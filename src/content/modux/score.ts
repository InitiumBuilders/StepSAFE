/* Score a stack against a gauge. Pure and deterministic, so the same stack
   always gets the same result and the probe can check every reference.

   Below the Systemic band:   coverage 60 · depth 15 · compounding 25
   From the Systemic band on: coverage 50 · depth 10 · compounding 20 · containment 20

   Containment reads the system map. A threat that lands takes its node, and
   the failure travels along every dependency edge the stack does not cut. */

import type { ModuxModel, ModuxGauge, GaugeThreat, NodeKind } from '../modux-schema';
import { TIER_COST } from '../modux-schema';
import type { Escalated } from './escalate';
import { searchReference, exactCover } from './escalate';

export interface StackLink { a: string; b: string; how: string }

/** A MoTRUS model as it plays in a gauge: the learner's own claim. */
export interface MotrusPlay { id: string; name: string; answers: string[] }

/** Untested ideas cost what an emerging structure costs. */
export const MOTRUS_COST = 3;
/** One MoTRUS model can claim at most this many threats. */
export const MOTRUS_MAX_ANSWERS = 2;

export interface ThreatOutcome { threat: GaugeThreat; stoppedBy: string[]; motrus: string[] }
export interface Cut { from: string; to: string; by: string }

export interface GaugeResult {
  score: number;
  coverage: number;
  depth: number;
  synergy: number;
  containment: number;
  max: { coverage: number; depth: number; synergy: number; containment: number };
  spent: number;
  perThreat: ThreatOutcome[];
  links: StackLink[];
  /** tensions between chosen models: shown, never penalised */
  tensions: StackLink[];
  coveredAll: boolean;
  /** every weight 3 threat stopped by two or more structures */
  heavyDepth: boolean;
  /** every threat with catalog counters was stopped by a catalog structure */
  catalogOnly: boolean;
  verdict: 'holds' | 'breached';
  landed: number;
  fallen: string[];
  reached: string[];
  cuts: Cut[];
  /** weight each structure stops on its own, heaviest first */
  load: { model: string; weight: number }[];
  /** stack models a pressure has taken away */
  dead: string[];
  /** assume breach: nodes lost if each single layered or landed threat goes through */
  ifFails: { threat: string; lost: number }[];
}

const SYNERGY_CAP = 6;

/* Structures that stop a failure crossing into a node of this kind. */
export const BREAKERS: Record<NodeKind, string[]> = {
  network: ['mm-trust-microsegmentation', 'mm-trust-policy-enforcement-point', 'mm-trust-blast-radius-budget', 'mm-resilience-cell-architecture'],
  data: ['mm-data-tokenization-vault', 'mm-crypto-envelope-encryption', 'mm-data-classification-tiers', 'mm-resilience-immutable-backups'],
  control: ['mm-trust-microsegmentation', 'mm-trust-boundary-ledger', 'mm-resilience-fail-safe-defaults', 'mm-resilience-cell-architecture'],
  identity: ['mm-identity-zero-standing-privilege', 'mm-identity-continuous-access-evaluation', 'mm-identity-relationship-authorization'],
  money: ['mm-org-two-person-integrity', 'mm-chain-treasury-tiers', 'mm-chain-circuit-breakers', 'mm-chain-timelock-and-guardian'],
  model: ['mm-ai-capability-sandbox', 'mm-si-layered-autonomy', 'mm-ai-agent-delegation', 'mm-ai-human-approval-gates'],
  build: ['mm-supply-ephemeral-builders', 'mm-supply-build-integrity-levels', 'mm-supply-keyless-signing'],
  vendor: ['mm-trust-boundary-ledger', 'mm-trust-blast-radius-budget', 'mm-supply-dependency-cooldown'],
  people: ['mm-org-incident-command', 'mm-org-two-person-integrity'],
  public: ['mm-crypto-transparency-log', 'mm-org-incident-command', 'mm-chain-credible-neutrality'],
  time: ['mm-resilience-fail-safe-defaults', 'mm-systems-requisite-variety', 'mm-systems-coupling-and-complexity'],
};
/** These decouple any edge. */
export const DECOUPLERS = ['mm-systems-coupling-and-complexity', 'mm-resilience-cell-architecture', 'mm-trust-blast-radius-budget'];

export function costOf(m: Pick<ModuxModel, 'tier'>): number {
  return TIER_COST[m.tier];
}

export function linksAmong(ids: string[], byId: Map<string, ModuxModel>, kind: 'combines' | 'conflicts'): StackLink[] {
  const set = new Set(ids);
  const seen = new Set<string>();
  const out: StackLink[] = [];
  for (const id of ids) {
    const m = byId.get(id);
    if (!m) continue;
    for (const l of m[kind] || []) {
      if (!set.has(l.model) || l.model === id) continue;
      const key = [id, l.model].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ a: id, b: l.model, how: l.how });
    }
  }
  return out;
}

export interface ScoreOpts {
  weakened?: Set<string>;
  motrus?: MotrusPlay[];
  coupling?: boolean;
}

export function scoreGauge(gauge: ModuxGauge, ids: string[], byId: Map<string, ModuxModel>, opts: ScoreOpts = {}): GaugeResult {
  const weakened = opts.weakened || new Set<string>();
  const motrus = opts.motrus || [];
  const coupling = !!opts.coupling;
  const live = new Set(ids.filter(id => byId.has(id) && !weakened.has(id)));
  const totalW = gauge.threats.reduce((n, t) => n + t.weight, 0) || 1;

  const perThreat: ThreatOutcome[] = gauge.threats.map(threat => ({
    threat,
    stoppedBy: threat.counters.filter(c => live.has(c)),
    motrus: motrus.filter(m => m.answers.includes(threat.id)).map(m => m.id),
  }));
  const layers = (p: ThreatOutcome) => p.stoppedBy.length + p.motrus.length;

  const coveredW = perThreat.filter(p => layers(p) > 0).reduce((n, p) => n + p.threat.weight, 0);
  const depthW = perThreat.filter(p => layers(p) > 1).reduce((n, p) => n + p.threat.weight, 0);

  const catalogIds = [...live];
  const links = linksAmong(catalogIds, byId, 'combines');
  const tensions = linksAmong(catalogIds, byId, 'conflicts');

  /* containment: landed threats take their node; failure travels uncut edges */
  const nodeKind = new Map(gauge.system.nodes.map(n => [n.id, n.kind]));
  const cutBy = (to: string): string | undefined => {
    const k = nodeKind.get(to);
    const cands = [...(k ? BREAKERS[k] : []), ...DECOUPLERS];
    return cands.find(c => live.has(c));
  };
  const spread = (from: string[]) => {
    const reached = new Set<string>();
    const cuts: Cut[] = [];
    const queue = [...from];
    const seen = new Set(from);
    while (queue.length) {
      const at = queue.shift()!;
      for (const e of gauge.system.edges) {
        if (e.from !== at || seen.has(e.to)) continue;
        const by = cutBy(e.to);
        if (by) { cuts.push({ from: e.from, to: e.to, by }); continue; }
        seen.add(e.to); reached.add(e.to); queue.push(e.to);
      }
    }
    return { reached, cuts };
  };
  const fallen = [...new Set(perThreat.filter(p => layers(p) === 0).map(p => p.threat.target))];
  const actual = spread(fallen);
  const reached = actual.reached;
  const cuts = actual.cuts;
  const nodes = Math.max(1, gauge.system.nodes.length);

  /* assume one layer fails: every threat held by a single structure is played
     as if it landed, and a threat that did land counts twice */
  const single = perThreat.filter(p => layers(p) === 1);
  const landedP = perThreat.filter(p => layers(p) === 0);
  const what: { threat: string; lost: number }[] = [];
  let exposure = 0;
  for (const p of [...landedP, ...single]) {
    const lost = 1 + spread([p.threat.target]).reached.size;
    what.push({ threat: p.threat.id, lost });
    exposure += p.threat.weight * lost * (layers(p) === 0 ? 2 : 1);
  }
  exposure = Math.min(1, exposure / (totalW * nodes));

  const max = coupling
    ? { coverage: 50, depth: 10, synergy: 20, containment: 20 }
    : { coverage: 60, depth: 15, synergy: 25, containment: 0 };
  const coverage = Math.round((coveredW / totalW) * max.coverage);
  const depth = Math.round((depthW / totalW) * max.depth);
  const synergy = Math.round((Math.min(links.length, SYNERGY_CAP) / SYNERGY_CAP) * max.synergy);
  const containment = coupling ? Math.round((1 - exposure) * max.containment) : 0;
  const score = Math.max(0, Math.min(100, coverage + depth + synergy + containment));

  const spent = ids.reduce((n, id) => {
    const m = byId.get(id);
    return n + (m ? costOf(m) : 0);
  }, 0) + motrus.length * MOTRUS_COST;

  const coveredAll = perThreat.every(p => layers(p) > 0);
  const heavy = perThreat.filter(p => p.threat.weight === 3);
  const heavyDepth = heavy.length > 0 && heavy.every(p => layers(p) > 1);
  const catalogOnly = perThreat.every(p => p.threat.counters.length === 0 || p.stoppedBy.length > 0);

  const load = catalogIds
    .map(model => ({
      model,
      weight: perThreat.filter(p => p.stoppedBy.length === 1 && p.motrus.length === 0 && p.stoppedBy[0] === model)
        .reduce((n, p) => n + p.threat.weight, 0),
    }))
    .filter(x => x.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  return {
    score, coverage, depth, synergy, containment, max, spent, perThreat, links, tensions,
    coveredAll, heavyDepth, catalogOnly,
    verdict: coveredAll ? 'holds' : 'breached',
    landed: perThreat.filter(p => layers(p) === 0).length,
    fallen, reached: [...reached], cuts, load,
    dead: ids.filter(id => weakened.has(id)),
    ifFails: what.sort((a, b) => b.lost - a.lost),
  };
}

/* ---------- the reference at any notch ---------- */

export interface ReferenceResult {
  stack: string[];
  result: GaugeResult;
  by: 'authored' | 'search';
  /** the reference stops every threat that has catalog counters */
  catalogHolds: boolean;
  /** true: some catalog stack can hold; false: proven none can; null: not proven either way */
  coverable: boolean | null;
}

/** The stack to match. At Ground on an authored gauge it is the authored stack;
    above Ground it is the better of a search seeded with that stack and a fresh search. */
export function referenceFor(esc: Escalated, byId: Map<string, ModuxModel>): ReferenceResult {
  const weakened = new Set(esc.weakened.map(w => w.model));
  const opts: ScoreOpts = { weakened, coupling: esc.coupling };
  const g = esc.gauge;
  const holds = (r: GaugeResult) => r.perThreat.every(p => p.threat.counters.length === 0 || p.stoppedBy.length > 0);

  if (esc.level === 0 && g.origin !== 'forged' && g.expert.length) {
    const result = scoreGauge(g, g.expert, byId, opts);
    return { stack: g.expert, result, by: 'authored', catalogHolds: holds(result), coverable: true };
  }
  const tries = [
    searchReference(g, byId, weakened, g.expert).stack,
    searchReference(g, byId, weakened).stack,
  ];
  const exact = exactCover(g, byId, weakened);
  /* the exact cover, then the leftover budget spent on depth */
  if (exact) tries.push(searchReference(g, byId, weakened, exact).stack);
  let best: ReferenceResult | null = null;
  for (const stack of tries) {
    const result = scoreGauge(g, stack, byId, opts);
    const cand: ReferenceResult = { stack, result, by: 'search', catalogHolds: holds(result), coverable: exact ? true : exact === null ? false : null };
    if (!best
      || (cand.catalogHolds && !best.catalogHolds)
      || (cand.catalogHolds === best.catalogHolds && cand.result.score > best.result.score)) best = cand;
  }
  return best!;
}
