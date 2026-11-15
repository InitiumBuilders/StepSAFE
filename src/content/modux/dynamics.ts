/* THE DYNAMICS OF A GAUGE: the organisation as a system in motion.

   Everything here is derived from the gauge's own data and the game's own
   rules, so what the World shows is the model the score already uses, run
   forward in time:

     stocks     every part holds a stock of its function, 0 to 1
     flows      every dependency carries the upstream part's function to the
                part that needs it, after a delay set by what the dependency is
     pressure   every threat pushes on its part with its weight; each layer of
                structure that stops it takes most of that pressure away, and
                two layers take all of it
     spread     a part whose supply fails loses its own function, unless a
                breaker in the stack cuts that dependency
     dwell      a threat that lands keeps pushing for a while; structures that
                detect shorten that while
     recovery   a part regains its function slowly; resilience structures
                speed it up
     outcome    service is what reaches the public parts along their
                dependencies, and the hours of it lost over a day; trust is the
                public parts' own stock, which the threats aimed at them push on

   From that model two things come out of runs, not out of prose: the feedback
   loops at work in this gauge, with the parts they run through and whether
   the stack has broken them, and the moves with the most leverage, each
   priced in budget and in hours of service kept over a stress day. */

import type { ModuxGauge, ModuxModel, GaugeEdge, NodeKind } from '../modux-schema';
import { BREAKERS, DECOUPLERS, costOf, type MotrusPlay } from './score';

export const DAMAGE = 0.9;      /* per hour, a landed weight 3 threat with nothing in its way */
export const SPREAD = 0.7;      /* per hour, a part whose supply is gone */
export const RECOVER = 0.12;    /* per hour, back toward full function */
export const DWELL = 6;         /* hours a landed threat keeps pushing with nothing to see it */
const ATTENUATION = [1, 0.1, 0]; /* pressure that gets through 0, 1, 2 or more layers */

export interface DynEdge { from: string; to: string; key: string; delay: number; cutBy: string | null; how: string }
export interface DynThreat { id: string; name: string; target: string; p: number; layers: number; detect: number; open: boolean }

export interface DynModel {
  nodes: string[];
  kinds: Record<string, NodeKind>;
  edges: DynEdge[];
  threats: DynThreat[];
  /** resilience layers at each part */
  resilience: Record<string, number>;
  /** the parts the public receives service from; every part when a gauge has none */
  outcomeIds: string[];
  /** the model's assumptions for one plausible day (see `ensemble`); absent, the nominal constants above */
  params?: Params;
}

export interface DynState {
  hour: number;
  health: Record<string, number>;
  /** the lagged upstream function on each dependency */
  lag: Record<string, number>;
  /** the hour each threat landed */
  landed: Record<string, number>;
  /** the share of the service reaching the public now */
  delivered: number;
  /** the public parts' own stock: what people still believe of what they are told */
  trust: number;
  /** hours of service lost so far */
  lost: number;
}

const familyOf = (id: string) => id.split('-')[1] || '';
const FAILSAFE = 'mm-resilience-fail-safe-defaults';
const LOOSE = 'mm-systems-coupling-and-complexity';
const CELLS = ['mm-resilience-cell-architecture', 'mm-trust-blast-radius-budget'];

/** hours before a failure upstream reaches the part that depends on it */
export function delayOf(e: GaugeEdge, toKind: NodeKind | undefined): number {
  if (/suppl|power|ship|sends help|treats|deliver/i.test(e.how)) return 3;
  if (toKind === 'public' || toKind === 'people') return 1;
  return 0.25;
}

export function buildModel(
  gauge: ModuxGauge,
  stack: string[],
  byId: Map<string, ModuxModel>,
  plays: MotrusPlay[] = [],
  weakened: Set<string> = new Set(),
): DynModel {
  const live = new Set(stack.filter(id => byId.has(id) && !weakened.has(id)));
  const kinds: Record<string, NodeKind> = {};
  for (const n of gauge.system.nodes) kinds[n.id] = n.kind;
  const nodes = gauge.system.nodes.map(n => n.id);
  /* What a structure cuts. A breaker of a kind cuts what crosses into that kind from another
     kind; a failure between two parts of the same kind still travels, because a boundary sits
     between kinds and not inside one. Fail safe defaults cut what a control or time part
     commands: the thing commanded falls back to a safe state. Cells and a blast radius budget
     cut every boundary between kinds. Loose coupling cuts nothing and gives every pipe two
     hours of slack. */
  const loose = live.has(LOOSE);
  const cutBy = (e: GaugeEdge): string | null => {
    const fk = kinds[e.from], tk = kinds[e.to];
    if (fk !== tk) {
      const b = (BREAKERS[tk] || []).find(c => c !== FAILSAFE && c !== LOOSE && live.has(c));
      if (b) return b;
      const cell = CELLS.find(c => live.has(c));
      if (cell) return cell;
    }
    if ((fk === 'control' || fk === 'time') && live.has(FAILSAFE)) return FAILSAFE;
    return null;
  };
  const edges: DynEdge[] = gauge.system.edges
    .filter(e => kinds[e.from] && kinds[e.to])
    .map(e => ({ from: e.from, to: e.to, key: e.from + '>' + e.to, delay: delayOf(e, kinds[e.to]) + (loose ? 2 : 0), cutBy: cutBy(e), how: e.how }));
  const threats: DynThreat[] = gauge.threats.filter(t => kinds[t.target]).map(t => {
    const liveCounters = t.counters.filter(c => live.has(c));
    const layers = liveCounters.length + plays.filter(m => m.answers.includes(t.id)).length;
    /* weight 3 pushes with its full force; weight 1 with a ninth of it */
    const w = Math.max(1, Math.min(3, t.weight)) / 3;
    return {
      id: t.id, name: t.name, target: t.target, p: w * w, layers,
      detect: liveCounters.filter(c => familyOf(c) === 'detect').length, open: !!t.open,
    };
  });
  const resilience: Record<string, number> = {};
  for (const n of nodes) {
    const ids = new Set<string>();
    for (const t of gauge.threats) if (t.target === n) for (const c of t.counters) if (live.has(c) && familyOf(c) === 'resilience') ids.add(c);
    resilience[n] = ids.size;
  }
  const pub = nodes.filter(n => kinds[n] === 'public');
  return { nodes, kinds, edges, threats, resilience, outcomeIds: pub.length ? pub : nodes };
}

export function initState(m: DynModel): DynState {
  const health: Record<string, number> = {}, lag: Record<string, number> = {};
  for (const n of m.nodes) health[n] = 1;
  for (const e of m.edges) lag[e.key] = 1;
  return { hour: 0, health, lag, landed: {}, delivered: 1, trust: 1, lost: 0 };
}

/** The service a public part receives: what reaches it along every dependency, cut or
    not. A breaker into a public part (incident command, a transparency log) keeps the
    public's trust when the parts that serve them fail; it does not make the water flow.
    A part nothing feeds delivers its own stock. */
export function serviceAt(m: DynModel, s: DynState, node: string): number {
  const feeds = m.edges.filter(e => e.to === node);
  if (!feeds.length) return s.health[node];
  let service = 1;
  for (const e of feeds) service = Math.min(service, s.lag[e.key]);
  return service;
}

/** a threat arrives at this hour; from here it pushes until its dwell runs out */
export function land(s: DynState, threatId: string, hour = s.hour) {
  if (!(threatId in s.landed)) s.landed[threatId] = hour;
}

/** hours a landed threat keeps pushing: detection shortens it, and detection needs people to act on it */
export function dwellOf(t: DynThreat, people = 1, dwell = DWELL): number { return dwell / (1 + t.detect * people); }

/** the share of a landed threat's pressure that gets through its layers */
const through1 = (m: DynModel, layers: number) => (layers <= 0 ? ATTENUATION[0] : layers === 1 ? (m.params ? m.params.atten1 : ATTENUATION[1]) : ATTENUATION[2]);

/** the people who respond and recover: the mean function of the people parts, one when the map has none */
export function peopleOf(m: DynModel, s: DynState): number {
  const ids = m.nodes.filter(n => m.kinds[n] === 'people');
  if (!ids.length) return 1;
  return ids.reduce((k, n) => k + (s.health[n] ?? 1), 0) / ids.length;
}

/** the pressure getting through to a part now, 0 to 1 */
export function pressureOn(m: DynModel, s: DynState, node: string, people = 1): number {
  let through = 0;
  for (const t of m.threats) {
    if (t.target !== node || !(t.id in s.landed)) continue;
    if (s.hour - s.landed[t.id] > dwellOf(t, people, m.params ? m.params.dwell : DWELL)) continue;
    through += t.p * through1(m, t.layers);
  }
  return Math.min(1, through);
}

/** the function reaching a part along its dependencies, 1 when it has none it depends on */
export function supplyOf(m: DynModel, s: DynState, node: string): number {
  let supply = 1;
  for (const e of m.edges) if (e.to === node && !e.cutBy) supply = Math.min(supply, s.lag[e.key]);
  return supply;
}

/** advance the system by dt hours */
export function step(m: DynModel, s: DynState, dt: number) {
  for (const e of m.edges) s.lag[e.key] += (s.health[e.from] - s.lag[e.key]) * Math.min(1, dt / e.delay);
  const next: Record<string, number> = {};
  /* someone has to act: detection works as far as the people parts still function, and
     recovery runs between half pace and full pace with them */
  const people = peopleOf(m, s);
  const P = m.params, damage = P ? P.damage : DAMAGE, spread = P ? P.spread : SPREAD, recover = P ? P.recover : RECOVER;
  for (const n of m.nodes) {
    /* A part moves toward the lower of two ceilings: what it is supplied (a part cannot
       deliver more than reaches it), and what the threats on it leave (residual pressure p
       takes p of its function). It falls toward that level fast and recovers toward it slowly. */
    const through = pressureOn(m, s, n, people);
    const supply = supplyOf(m, s, n);
    const h = s.health[n];
    const target = Math.min(supply, 1 - through);
    let rate = 0;
    if (h > target) {
      rate = -Math.max(damage * Math.max(0, h - (1 - through)), spread * Math.max(0, h - supply));
    } else {
      rate = recover * (1 + 0.6 * (m.resilience[n] || 0)) * (0.5 + 0.5 * people) * (target - h);
    }
    next[n] = Math.max(0, Math.min(1, h + rate * dt));
  }
  for (const n of m.nodes) s.health[n] = next[n];
  s.hour += dt;
  const pub = m.outcomeIds.filter(n => m.kinds[n] === 'public');
  s.delivered = pub.length
    ? pub.reduce((k, n) => k + serviceAt(m, s, n), 0) / pub.length
    : m.outcomeIds.reduce((k, n) => k + s.health[n], 0) / m.outcomeIds.length;
  s.trust = pub.length ? pub.reduce((k, n) => k + s.health[n], 0) / pub.length : 1;
  s.lost += (1 - s.delivered) * dt;
}

export interface Sample { hour: number; delivered: number; health: Record<string, number> }

/** run a day: threats land at the hours given; a sample every hour */
export function simulate(m: DynModel, arrivals: { id: string; at: number }[], hours = 24, dt = 0.1): { state: DynState; samples: Sample[] } {
  const s = initState(m);
  const samples: Sample[] = [];
  const due = [...arrivals].sort((a, b) => a.at - b.at);
  let nextSample = 0;
  while (s.hour < hours - 1e-9) {
    while (due.length && due[0].at <= s.hour + 1e-9) land(s, due.shift()!.id, s.hour);
    if (s.hour >= nextSample - 1e-9) { samples.push({ hour: Math.round(s.hour * 10) / 10, delivered: s.delivered, health: { ...s.health } }); nextSample += 1; }
    step(m, s, Math.min(dt, hours - s.hour));
  }
  samples.push({ hour: hours, delivered: s.delivered, health: { ...s.health } });
  return { state: s, samples };
}

/** The order of the fall on a stress day: every part with the hour it first dropped under
    half its function (for a public part, under half its trust), earliest first, and the
    parts that held the day with null. */
export function fallOrder(m: DynModel): { id: string; hour: number | null; kind: NodeKind | undefined }[] {
  const { samples } = simulate(m, m.threats.filter(t => !t.open).map((t, i) => ({ id: t.id, at: 0.5 + i * 0.1 })));
  const fell: Record<string, number> = {};
  for (const smp of samples) for (const id of m.nodes) if (!(id in fell) && (smp.health[id] ?? 1) < 0.5) fell[id] = smp.hour;
  return m.nodes.map(id => ({ id, hour: id in fell ? fell[id] : null, kind: m.kinds[id] }))
    .sort((a, b) => (a.hour === null ? 1e9 : a.hour) - (b.hour === null ? 1e9 : b.hour));
}

/** a stress day: every threat lands in the first hour; the hours of service lost by the end */
export function stressDay(m: DynModel): number {
  return simulate(m, m.threats.filter(t => !t.open).map((t, i) => ({ id: t.id, at: 0.5 + i * 0.1 }))).state.lost;
}

/** The day as a range. The stress day lands every threat in the first hour and is the floor.
    The spread day lands them across the day, which is the most a stack keeps. Both are the
    model's; neither is a prediction. */
export function dayRange(m: DynModel): { lo: number; hi: number } {
  const live = m.threats.filter(t => !t.open);
  const lo = Math.max(0, 24 - stressDay(m));
  const spread = simulate(m, live.map((t, i) => ({ id: t.id, at: 1 + (i * 20) / Math.max(1, live.length) }))).state.lost;
  const hi = Math.max(lo, Math.min(24, 24 - spread));
  return { lo, hi };
}

/** hours as people read them: whole hours from one up, a tenth below one so a small move does not read as zero */
export const fmtHours = (x: number): string => (x >= 1 ? String(Math.round(x)) : (Math.round(x * 10) / 10).toFixed(1));

/** "about 21 of 24 hours", or "19 to 23 of 24 hours" when the two days differ by more than one */
export function dayWords(r: { lo: number; hi: number }): string {
  const a = Math.round(r.lo), b = Math.round(r.hi);
  return (b - a <= 1 ? 'about ' + a : a + ' to ' + b) + ' of 24 hours';
}

/* ---------- the loops ---------- */

export interface Loop {
  id: string;
  kind: 'R' | 'B';
  name: string;
  /** the parts it runs through, in order */
  parts: string[];
  /** whether it is running now, given the stack */
  active: boolean;
  why: string;
}

/** the longest dependency chain, as parts in order */
function longestChain(m: DynModel): string[] {
  const out = new Map<string, string[]>();
  for (const n of m.nodes) out.set(n, []);
  for (const e of m.edges) out.get(e.from)!.push(e.to);
  let best: string[] = [];
  const walk = (n: string, path: string[], seen: Set<string>) => {
    if (path.length > best.length) best = path;
    for (const to of out.get(n) || []) if (!seen.has(to)) walk(to, [...path, to], new Set([...seen, to]));
  };
  for (const n of m.nodes) walk(n, [n], new Set([n]));
  return best;
}

export function loopsOf(gauge: ModuxGauge, m: DynModel, level: number): Loop[] {
  const loops: Loop[] = [];
  const name = (id: string) => gauge.system.nodes.find(n => n.id === id)?.name || id;

  const chain = longestChain(m);
  if (chain.length >= 3) {
    const uncut = chain.slice(1).some((to, i) => { const e = m.edges.find(x => x.from === chain[i] && x.to === to); return e && !e.cutBy; });
    loops.push({
      id: 'spread', kind: 'R', name: 'Failure spreads', parts: chain, active: uncut,
      why: uncut
        ? 'When ' + name(chain[0]) + ' falls, ' + name(chain[1]) + ' loses what it depends on after a delay, and so on down the chain. A breaker on a dependency stops it there.'
        : 'Every dependency on this chain is cut by a breaker in the stack, so a failure stays where it starts.',
    });
  }

  const pub = m.nodes.filter(n => m.kinds[n] === 'public');
  if (pub.length) {
    const feeders = [...new Set(m.edges.filter(e => pub.includes(e.to)).map(e => e.from))];
    loops.push({
      id: 'public', kind: 'B', name: 'The public pushes back', parts: [pub[0], ...feeders.slice(0, 3)], active: true,
      why: 'Service lost reaches people, and pressure comes back to the organisation as attention and budget, after a delay. Each notch grants the budget that pressure buys.',
    });
    const orgOpen = m.threats.filter(t => pub.includes(t.target) && t.layers === 0);
    if (orgOpen.length) {
      const people = m.nodes.filter(n => m.kinds[n] === 'people');
      loops.push({
        id: 'trust', kind: 'R', name: 'Trust erodes', parts: [pub[0], ...people.slice(0, 1), ...orgOpen.map(t => t.target).filter(x => x !== pub[0]).slice(0, 1)], active: true,
        why: orgOpen[0].name + ' reaches the public with nothing in the stack to answer it. Each hour it runs, recovery gets harder, because the people you serve stop trusting what you say.',
      });
    }
  }

  const seen = m.threats.filter(t => t.detect > 0);
  const detectIn = seen.length > 0;
  loops.push({
    id: 'detect', kind: 'B', name: 'Seen and answered', parts: [...new Set(seen.map(t => t.target))].slice(0, 4), active: detectIn,
    why: detectIn
      ? 'A structure that detects shortens how long a landed threat keeps pushing: six hours with nothing to see it, half that with one layer that does.'
      : 'Nothing in the stack senses pressure, so a threat that lands keeps pushing for six hours before it burns out. A detect structure closes this loop.',
  });

  if (level >= 5) {
    const picked = m.threats.filter(t => gauge.threats.find(x => x.id === t.id)?.pressure);
    const thin = picked.filter(t => t.layers < 2);
    loops.push({
      id: 'adapt', kind: 'R', name: 'The adversary learns', parts: [...new Set((thin.length ? thin : picked).map(t => t.target))].slice(0, 4), active: thin.length > 0,
      why: thin.length
        ? 'From Wicked on, each notch is chosen against the stack you last ran. ' + thin[0].name + ' is held by ' + (thin[0].layers === 0 ? 'nothing' : 'one layer') + ', and that is where the next notch goes.'
        : 'Every pressure the adversary chose is held by two layers, so the next notch has nothing thin to study.',
    });
  }
  return loops;
}

/* ---------- the moves with leverage ---------- */

export interface Move {
  id: string;
  name: string;
  cost: number;
  /** the part it acts on */
  where: string;
  kind: 'layer' | 'second' | 'breaker';
  /** hours of service kept over a stress day */
  kept: number;
  /** the threat it answers, for a layer or a second layer */
  threat?: string;
}


/** The structures that could add a layer to a thin threat or cut a live dependency, given the stack. */
function moveCandidates(
  gauge: ModuxGauge,
  stack: string[],
  byId: Map<string, ModuxModel>,
  plays: MotrusPlay[],
  weakened: Set<string>,
  baseModel: DynModel,
): Omit<Move, 'kept' | 'cost' | 'name'>[] {
  const live = new Set(stack.filter(id => byId.has(id) && !weakened.has(id)));
  const cands = new Map<string, Omit<Move, 'kept' | 'cost' | 'name'>>();
  for (const t of baseModel.threats) {
    if (t.open || t.layers >= 2) continue;
    const src = gauge.threats.find(x => x.id === t.id)!;
    for (const c of src.counters) {
      if (live.has(c) || weakened.has(c) || !byId.has(c) || cands.has(c)) continue;
      cands.set(c, { id: c, where: t.target, kind: t.layers === 0 ? 'layer' : 'second', threat: t.id });
    }
  }
  for (const e of baseModel.edges) {
    if (e.cutBy) continue;
    for (const b of [...BREAKERS[baseModel.kinds[e.to]], ...DECOUPLERS]) {
      if (live.has(b) || weakened.has(b) || !byId.has(b) || cands.has(b)) continue;
      cands.set(b, { id: b, where: e.to, kind: 'breaker' });
    }
  }
  void plays;
  return [...cands.values()];
}

/** The moves that keep the most service per point of budget, measured by running the
    stress day with and without each one, so every number comes from a run. */
export function leverage(
  gauge: ModuxGauge,
  stack: string[],
  byId: Map<string, ModuxModel>,
  plays: MotrusPlay[] = [],
  weakened: Set<string> = new Set(),
  top = 5,
): { base: number; moves: Move[] } {
  const baseModel = buildModel(gauge, stack, byId, plays, weakened);
  const base = stressDay(baseModel);
  const moves: Move[] = [];
  for (const c of moveCandidates(gauge, stack, byId, plays, weakened, baseModel)) {
    const m = byId.get(c.id)!;
    const kept = base - stressDay(buildModel(gauge, [...stack, c.id], byId, plays, weakened));
    if (kept > 0.02) moves.push({ ...c, name: m.name, cost: costOf(m), kept: Math.round(kept * 10) / 10 });
  }
  moves.sort((a, b) => (b.kept / b.cost) - (a.kept / a.cost) || b.kept - a.kept);
  return { base: Math.round(base * 10) / 10, moves: moves.slice(0, top) };
}

/* ---------- many days: the model's own uncertainty ----------

   One stress day answers one question with one number. But every rate above is an assumption, and a real day does
   not land every threat in the first hour. So the model also runs many plausible days. Each day draws its own
   assumptions from a stated range around the nominal values (how hard a landed threat hits, how fast a failure
   spreads, how fast parts recover, how long a threat keeps pushing, how much one layer lets through, how long a
   failure takes to travel) and its own arrivals: the threats come in one wave that starts somewhere in the first six
   hours and lasts from a few minutes (coordinated) to most of a working day (scattered). The draws are seeded, so the
   same gauge and stack always give the same days, and every candidate move is run against the same days, so a
   difference between two plans is the plans and not the dice. These are the model's days, not a forecast. */

export interface Params { damage: number; spread: number; recover: number; dwell: number; atten1: number; delayX: number }
export const NOMINAL: Params = { damage: DAMAGE, spread: SPREAD, recover: RECOVER, dwell: DWELL, atten1: ATTENUATION[1], delayX: 1 };

/** each assumption's plausible range, as a multiplier on its nominal value */
export const RANGES: { key: keyof Params; label: string; lo: number; hi: number }[] = [
  { key: 'recover', label: 'how fast parts recover', lo: 0.6, hi: 1.6 },
  { key: 'damage', label: 'how hard a landed threat hits', lo: 0.7, hi: 1.3 },
  { key: 'spread', label: 'how fast a failure spreads', lo: 0.7, hi: 1.3 },
  { key: 'dwell', label: 'how long a threat keeps pushing', lo: 0.5, hi: 1.7 },
  { key: 'atten1', label: 'how much one layer lets through', lo: 0.4, hi: 2.5 },
  { key: 'delayX', label: 'how long a failure takes to travel', lo: 0.5, hi: 2 },
];

/** the day the gauge calls held: 22 or more of 24 hours kept */
export const HELD_HOURS = 22;

export interface DayDraw { params: Params; arrivals: Record<string, number> }

function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function fnv(s: string): number { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
const logUniform = (r: () => number, lo: number, hi: number) => lo * Math.pow(hi / lo, r());

/** n plausible days for the threats of a model, seeded by the threats themselves */
export function drawDays(m: DynModel, n: number, seed = fnv(m.threats.map(t => t.id).join('|'))): DayDraw[] {
  const r = rng(seed), ids = m.threats.filter(t => !t.open).map(t => t.id), out: DayDraw[] = [];
  for (let d = 0; d < n; d++) {
    const params = { ...NOMINAL };
    for (const g of RANGES) params[g.key] = NOMINAL[g.key] * logUniform(r, g.lo, g.hi);
    const start = 0.25 + r() * 6, span = logUniform(r, 0.1, 9);
    const arrivals: Record<string, number> = {};
    for (const id of ids) arrivals[id] = Math.min(23, start + r() * span);
    out.push({ params, arrivals });
  }
  return out;
}

/** a model run under one day's assumptions */
export function underDay(m: DynModel, d: DayDraw): DynModel {
  return { ...m, params: d.params, edges: m.edges.map(e => ({ ...e, delay: Math.max(0.05, e.delay * d.params.delayX) })) };
}

export interface Ensemble {
  n: number;
  /** hours of service kept on each day, lowest first */
  kept: number[];
  p10: number; p50: number; p90: number; mean: number;
  /** the share of days that kept HELD_HOURS or more */
  held: number;
  /** service reaching the public across the day: the spread of all the days, hour by hour */
  band: { hour: number; p10: number; p25: number; p50: number; p75: number; p90: number }[];
  /** for each part, the share of days it dropped under half its function */
  fell: Record<string, number>;
}

const q = (sorted: number[], p: number) => {
  if (!sorted.length) return 0;
  const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
};

/** run the days and read them together */
export function ensemble(m: DynModel, days: DayDraw[] = drawDays(m, 200), dt = 0.2): Ensemble {
  const kept: number[] = [], fellCount: Record<string, number> = {};
  const byHour: number[][] = Array.from({ length: 25 }, () => []);
  for (const n of m.nodes) fellCount[n] = 0;
  for (const d of days) {
    const run = simulate(underDay(m, d), Object.entries(d.arrivals).map(([id, at]) => ({ id, at })), 24, dt);
    kept.push(Math.max(0, 24 - run.state.lost));
    const low: Record<string, number> = {};
    for (const smp of run.samples) {
      const h = Math.min(24, Math.round(smp.hour));
      byHour[h].push(smp.delivered);
      for (const n of m.nodes) low[n] = Math.min(low[n] ?? 1, smp.health[n] ?? 1);
    }
    for (const n of m.nodes) if ((low[n] ?? 1) < 0.5) fellCount[n]++;
  }
  kept.sort((a, b) => a - b);
  const band = byHour.map((v, hour) => { const s = [...v].sort((a, b) => a - b); return { hour, p10: q(s, 0.1), p25: q(s, 0.25), p50: q(s, 0.5), p75: q(s, 0.75), p90: q(s, 0.9) }; }).filter((b, i) => byHour[i].length);
  const fell: Record<string, number> = {};
  for (const n of m.nodes) fell[n] = days.length ? fellCount[n] / days.length : 0;
  return {
    n: days.length, kept,
    p10: q(kept, 0.1), p50: q(kept, 0.5), p90: q(kept, 0.9),
    mean: kept.reduce((a, b) => a + b, 0) / Math.max(1, kept.length),
    held: kept.filter(k => k >= HELD_HOURS).length / Math.max(1, kept.length),
    band, fell,
  };
}

/** One assumption at a time, at the low and the high end of its range, on a typical day (the threats in one wave
    across the first eight hours), everything else nominal: how far the hours kept move. The widest swing is the
    assumption most worth checking against the real organisation. */
export function sensitivity(m: DynModel): { key: keyof Params; label: string; lo: number; hi: number; swing: number }[] {
  const live = m.threats.filter(t => !t.open);
  const arrivals = live.map((t, i) => ({ id: t.id, at: 1 + (i * 8) / Math.max(1, live.length) }));
  const keptWith = (p: Params) => Math.max(0, 24 - simulate(underDay(m, { params: p, arrivals: {} }), arrivals, 24, 0.2).state.lost);
  return RANGES.map(g => {
    const lo = keptWith({ ...NOMINAL, [g.key]: NOMINAL[g.key] * g.lo });
    const hi = keptWith({ ...NOMINAL, [g.key]: NOMINAL[g.key] * g.hi });
    return { key: g.key, label: g.label, lo, hi, swing: Math.abs(hi - lo) };
  }).sort((a, b) => b.swing - a.swing);
}

export interface RobustMove extends Omit<Move, 'kept'> {
  /** hours added on the worst tenth of days */
  worst: number;
  /** hours added on a typical day */
  typical: number;
  /** points of the share of days held */
  held: number;
}

/** The moves that add the most on the hard days: every candidate run against the same plausible days, ranked by the
    hours it adds to the worst tenth per point of budget. Where this disagrees with the stress day's ranking, the
    stress day is optimising for one extreme and this for the bad days in general. */
export function robustLeverage(
  gauge: ModuxGauge,
  stack: string[],
  byId: Map<string, ModuxModel>,
  plays: MotrusPlay[] = [],
  weakened: Set<string> = new Set(),
  top = 3,
  n = 80,
): { base: Ensemble; moves: RobustMove[] } {
  const baseModel = buildModel(gauge, stack, byId, plays, weakened);
  const days = drawDays(baseModel, n);
  const base = ensemble(baseModel, days);
  const moves: RobustMove[] = [];
  for (const c of moveCandidates(gauge, stack, byId, plays, weakened, baseModel)) {
    const m = byId.get(c.id)!;
    const e = ensemble(buildModel(gauge, [...stack, c.id], byId, plays, weakened), days);
    const worst = e.p10 - base.p10, typical = e.p50 - base.p50, held = e.held - base.held;
    if (worst > 0.05 || typical > 0.05) moves.push({ ...c, name: m.name, cost: costOf(m), worst: Math.round(worst * 10) / 10, typical: Math.round(typical * 10) / 10, held: Math.round(held * 100) });
  }
  moves.sort((a, b) => (b.worst / b.cost) - (a.worst / a.cost) || b.typical - a.typical);
  return { base, moves: moves.slice(0, top) };
}

/** robustLeverage, one candidate at a time with a pause between them, so a page can run it without holding a frame */
export async function robustLeverageAsync(
  gauge: ModuxGauge,
  stack: string[],
  byId: Map<string, ModuxModel>,
  plays: MotrusPlay[] = [],
  weakened: Set<string> = new Set(),
  top = 3,
  n = 80,
  pause: () => Promise<void> = () => new Promise(r => setTimeout(r, 0)),
  stopped: () => boolean = () => false,
): Promise<{ base: Ensemble; moves: RobustMove[] } | null> {
  const baseModel = buildModel(gauge, stack, byId, plays, weakened);
  const days = drawDays(baseModel, n);
  const base = ensemble(baseModel, days);
  const moves: RobustMove[] = [];
  for (const c of moveCandidates(gauge, stack, byId, plays, weakened, baseModel)) {
    await pause();
    if (stopped()) return null;
    const m = byId.get(c.id)!;
    const e = ensemble(buildModel(gauge, [...stack, c.id], byId, plays, weakened), days);
    const worst = e.p10 - base.p10, typical = e.p50 - base.p50, held = e.held - base.held;
    if (worst > 0.05 || typical > 0.05) moves.push({ ...c, name: m.name, cost: costOf(m), worst: Math.round(worst * 10) / 10, typical: Math.round(typical * 10) / 10, held: Math.round(held * 100) });
  }
  moves.sort((a, b) => (b.worst / b.cost) - (a.worst / a.cost) || b.typical - a.typical);
  return { base, moves: moves.slice(0, top) };
}
