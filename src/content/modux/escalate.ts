/* Take It Up A Notch: the escalation engine.

   A gauge starts at Ground. Each notch draws one pressure from the library
   and adds its threat, its budget, and sometimes takes a structure away.
   Everything here is pure and seeded, so the same gauge, the same notches
   and the same salt always produce the same scenario, and the probe can
   check that every notch still has a stack that holds.

   Bands:
     Ground      notch 0        the authored scenario
     Hardened    notches 1–2    one more threat each notch
     Systemic    notches 3–4    the system map opens; coupling goes live
     Wicked      notches 5–6    the adversary studies your stack
     Outlier     notches 7+     open problems only a MoTRUS model can answer */

import type {
  ModuxGauge, GaugeThreat, GaugeSystem, GaugeNode, Pressure, NodeKind, ModuxModel,
} from '../modux-schema';
import {
  COUPLING_FROM, ADAPTIVE_FROM, OPEN_FROM, TIER_COST, bandOf,
} from '../modux-schema';
import { PRESSURES, PRESSURE_BY_ID } from './pressures';

/* ---------- seeded randomness ---------- */

export function fnv(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32: small, fast, good enough for picking cards */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- the system grows as the scenario does ---------- */

const DEFAULT_NODE_NAME: Record<NodeKind, string> = {
  people: 'Staff', identity: 'Identity provider', network: 'The network', data: 'Data stores',
  build: 'Build and release', money: 'Payments', control: 'Operations', model: 'AI agents',
  public: 'The public', time: 'Time source', vendor: 'Vendors',
};

/** What each kind of part usually feeds, in order of preference. An edge
    from A to B means that when A falls, B is exposed. */
const FEEDS: Record<NodeKind, NodeKind[]> = {
  identity: ['network', 'control', 'data', 'model'],
  people: ['control', 'identity', 'money'],
  network: ['control', 'data', 'model'],
  vendor: ['network', 'build', 'data'],
  build: ['public', 'control', 'model'],
  time: ['control', 'network', 'money'],
  control: ['data', 'money', 'public'],
  data: ['public', 'money'],
  model: ['data', 'money', 'public'],
  money: ['public'],
  public: [],
};

/** The node most things depend on: most inbound edges, first on a tie. */
function heartOf(system: GaugeSystem): GaugeNode | undefined {
  let best: GaugeNode | undefined;
  let bestN = -1;
  for (const n of system.nodes) {
    const k = system.edges.filter(e => e.to === n.id).length;
    if (k > bestN) { bestN = k; best = n; }
  }
  return best;
}

/** Find a node of this kind, or add one and wire it to what it plausibly
    feeds and to what plausibly feeds it. */
function nodeFor(system: GaugeSystem, kind: NodeKind): { id: string; system: GaugeSystem } {
  const have = system.nodes.find(n => n.kind === kind);
  if (have) return { id: have.id, system };
  const id = 'n-' + kind;
  const node: GaugeNode = { id, name: DEFAULT_NODE_NAME[kind], kind };
  const edges = [...system.edges];
  let out: GaugeNode | undefined;
  for (const k of FEEDS[kind]) { out = system.nodes.find(n => n.kind === k); if (out) break; }
  if (out) edges.push({ from: id, to: out.id, how: 'feeds' });
  const into = system.nodes.find(n => FEEDS[n.kind].includes(kind) && n.id !== out?.id);
  if (into) edges.push({ from: into.id, to: id, how: 'feeds' });
  if (!out && !into) {
    const heart = heartOf(system);
    if (heart) edges.push({ from: heart.id, to: id, how: 'supports' });
  }
  return { id, system: { nodes: [...system.nodes, node], edges } };
}

/* ---------- apply notches ---------- */

export interface Weakened { model: string; why: string; by: string }

export interface Escalated {
  gauge: ModuxGauge;
  level: number;
  added: Pressure[];
  weakened: Weakened[];
  coupling: boolean;
  adaptive: boolean;
  open: GaugeThreat[];
}

/** Budget the adversary outspends you by at each notch. Threats grow faster
    than the budget does, which is what makes a notch harder. */
export function notchTax(notch: number): number {
  if (notch >= OPEN_FROM) return 3;
  if (notch >= COUPLING_FROM) return 2;
  return 1;
}

/** The gauge after these notches, in order. Unknown ids are skipped. */
export function escalate(base: ModuxGauge, pressureIds: string[]): Escalated {
  let system = base.system;
  const threats: GaugeThreat[] = [...base.threats];
  const added: Pressure[] = [];
  const weakened: Weakened[] = [];
  let budget = base.budget;
  for (const pid of pressureIds) {
    const [baseId, again] = pid.split('@');
    const p = PRESSURE_BY_ID.get(baseId);
    if (!p) continue;
    const r = nodeFor(system, p.target);
    system = r.system;
    /* a repeat lands on another node of the same kind when there is one */
    let target = r.id;
    if (again) {
      const same = system.nodes.filter(n => n.kind === p.target);
      target = same[Number(again) % same.length].id;
    }
    threats.push({
      id: pid, name: again ? p.name + ', again' : p.name,
      move: again ? 'The same move, made again: ' + p.move.charAt(0).toLowerCase() + p.move.slice(1) : p.move,
      counters: p.counters, weight: p.weight, target, pressure: pid, open: p.open,
    });
    added.push(p);
    budget += Math.max(0, p.budget - notchTax(added.length));
    if (p.weakens) weakened.push({ ...p.weakens, by: p.id });
  }
  const level = added.length;
  return {
    gauge: { ...base, threats, budget, system },
    level,
    added,
    weakened,
    coupling: level >= COUPLING_FROM,
    adaptive: level >= ADAPTIVE_FROM,
    open: threats.filter(t => t.open),
  };
}

/* ---------- choose the next notch ---------- */

function fits(p: Pressure, tags: string[]): boolean {
  return p.fits.length === 0 || p.fits.some(t => tags.includes(t));
}

/** Would weakening this model leave any non open threat with nothing that stops it? */
function weakeningIsFair(model: string, threats: GaugeThreat[], already: Set<string>): boolean {
  const gone = new Set([...already, model]);
  return threats.every(t => t.open || t.counters.some(c => !gone.has(c)));
}

/**
 * Pick the next pressure. Deterministic for a given gauge, history and salt.
 * From the first Wicked notch the adversary reads the stack and prefers a
 * pressure the current stack does not answer, or one that takes a structure
 * the stack relies on. Returns null when the library has nothing left.
 */
export function pickNext(base: ModuxGauge, used: string[], stack: string[], salt = 'one'): Pressure | null {
  const cur = escalate(base, used);
  const next = cur.level + 1;
  const weakenedNow = new Set(cur.weakened.map(w => w.model));
  const usedSet = new Set(used.map(u => u.split('@')[0]));
  const stackSet = new Set(stack);

  const pool = PRESSURES.filter(p => {
    if (usedSet.has(p.id)) return false;
    if (p.from > next) return false;
    if (!fits(p, base.tags)) return false;
    if (p.open && next < OPEN_FROM) return false;
    if (p.weakens) {
      if (next < COUPLING_FROM) return false;
      if (weakenedNow.has(p.weakens.model)) return false;
      if (!weakeningIsFair(p.weakens.model, cur.gauge.threats, weakenedNow)) return false;
    }
    return true;
  });
  if (pool.length === 0) {
    /* the library is spent: the adversary repeats a move that worked */
    const repeatable = used.map(u => u.split('@')[0])
      .filter((v, i, a) => a.indexOf(v) === i)
      .map(id => PRESSURE_BY_ID.get(id)!)
      .filter(p => p && !p.open && !p.weakens);
    if (!repeatable.length) return null;
    const r0 = rng(fnv(base.id + '|again|' + next + '|' + salt));
    const p = repeatable[Math.floor(r0() * repeatable.length)];
    return { ...p, id: p.id + '@' + next };
  }

  const openSoFar = cur.open.length;
  const score = (p: Pressure): number => {
    let s = 0;
    /* an adversary probes for the gap at every notch */
    if (!p.open && p.counters.length && !p.counters.some(c => stackSet.has(c))) s += 1;
    if (next >= ADAPTIVE_FROM) {
      if (p.weakens && stackSet.has(p.weakens.model)) s += 3;
      if (!p.open && p.counters.length && !p.counters.some(c => stackSet.has(c))) s += 2;
    }
    if (p.open && next >= OPEN_FROM && openSoFar === 0) s += 4;
    if (p.open && openSoFar >= 2) s -= 3;
    /* a weakening is a big move: hold it for the first Systemic notch and later */
    if (p.weakens && next === COUPLING_FROM) s += 1;
    return s;
  };
  const top = Math.max(...pool.map(score));
  const best = pool.filter(p => score(p) === top);
  const r = rng(fnv(base.id + '|' + next + '|' + salt + '|' + used.join(',')));
  return best[Math.floor(r() * best.length)] || null;
}

/* ---------- a reference stack found by search ---------- */

export interface Reference { stack: string[]; spent: number; covered: boolean }

/**
 * Greedy weighted set cover within the budget, then fill the remaining budget
 * with models that stop a threat twice. Deterministic. Open problems are not
 * part of the target: no catalog model answers them.
 */
export function searchReference(
  gauge: ModuxGauge,
  byId: Map<string, ModuxModel>,
  weakened: Set<string> = new Set(),
  seed: string[] = [],
): Reference {
  const threats = gauge.threats.filter(t => !t.open);
  const cost = (id: string) => TIER_COST[byId.get(id)!.tier];
  const chosen: string[] = [];
  let spent = 0;
  for (const id of seed) {
    if (!byId.has(id) || weakened.has(id) || chosen.includes(id)) continue;
    if (spent + cost(id) > gauge.budget) continue;
    chosen.push(id); spent += cost(id);
  }
  const stops = (id: string, t: GaugeThreat) => t.counters.includes(id) && !weakened.has(id);
  const uncovered = () => threats.filter(t => !chosen.some(id => stops(id, t)));

  /* cover */
  for (;;) {
    const open = uncovered();
    if (open.length === 0) break;
    let best: string | null = null;
    let bestV = 0;
    for (const m of byId.values()) {
      if (chosen.includes(m.id) || weakened.has(m.id)) continue;
      const c = TIER_COST[m.tier];
      if (spent + c > gauge.budget) continue;
      const w = open.filter(t => t.counters.includes(m.id)).reduce((n, t) => n + t.weight, 0);
      if (w === 0) continue;
      const v = w / c;
      if (v > bestV || (v === bestV && best && c < cost(best))) { bestV = v; best = m.id; }
    }
    if (!best) break;
    chosen.push(best); spent += cost(best);
  }

  /* depth: a second structure in front of the heaviest threats first */
  for (;;) {
    const thin = threats
      .filter(t => chosen.filter(id => stops(id, t)).length === 1)
      .sort((a, b) => b.weight - a.weight);
    let best: string | null = null;
    let bestW = 0;
    for (const t of thin) for (const c of t.counters) {
      if (chosen.includes(c) || weakened.has(c) || !byId.has(c)) continue;
      if (spent + cost(c) > gauge.budget) continue;
      if (t.weight > bestW) { bestW = t.weight; best = c; }
    }
    if (!best) break;
    chosen.push(best); spent += cost(best);
  }

  return { stack: chosen, spent, covered: uncovered().length === 0 };
}

/**
 * The cheapest set of catalog models that stops every threat with catalog
 * counters, within the budget, or null if none exists. Branch and bound on
 * the threat with the fewest live counters. A node limit keeps it fast on
 * very high notches; past the limit the answer is "not proven" (undefined).
 */
export function exactCover(
  gauge: ModuxGauge,
  byId: Map<string, ModuxModel>,
  weakened: Set<string> = new Set(),
  limit = 60000,
): string[] | null | undefined {
  const threats = gauge.threats.filter(t => !t.open && t.counters.length);
  const live = (t: GaugeThreat) => t.counters.filter(c => byId.has(c) && !weakened.has(c));
  if (threats.some(t => live(t).length === 0)) return null;
  const cost = (id: string) => TIER_COST[byId.get(id)!.tier];
  let best: string[] | null = null;
  let bestCost = gauge.budget + 1;
  let nodes = 0;
  let cut = false;
  const go = (chosen: string[], spent: number) => {
    if (++nodes > limit) { cut = true; return; }
    if (spent >= bestCost) return;
    const open = threats.filter(t => !t.counters.some(c => chosen.includes(c)));
    if (open.length === 0) { best = [...chosen]; bestCost = spent; return; }
    /* lower bound: the cheapest single model still has to be paid */
    let pivot = open[0];
    let pivotN = live(pivot).length;
    for (const t of open) { const n = live(t).length; if (n < pivotN) { pivot = t; pivotN = n; } }
    const opts = live(pivot).sort((a, b) => cost(a) - cost(b));
    for (const c of opts) {
      if (spent + cost(c) >= bestCost) continue;
      chosen.push(c);
      go(chosen, spent + cost(c));
      chosen.pop();
      if (cut) return;
    }
  };
  go([], 0);
  if (best) return best;
  return cut ? undefined : null;
}

export { bandOf };
