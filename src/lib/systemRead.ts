/* THE READING OF A SYSTEM. Everything the systems map shows beyond its parts
   and links is computed here, from the map itself and from the same stress day
   model the gauges run, so nothing on the map is drawn for effect:

   - rows: how far each part sits from the parts that depend on nothing
   - reach: every part that loses what it needs when a part fails
   - the keystone: the part whose failure reaches the most, and the people first
   - chokepoints: parts that every path to the people runs through
   - the fastest cascade: the chain from the keystone to the people with the
     shortest delay, using the model's own delays (a quarter hour on a live
     dependency, an hour into the people, three hours through a supply)
   - buffers: the supplied links, where a stock holds for hours
   - pressure: the weight of the threats aimed at each part
   - the hour each part falls on a stress day with nothing in place
   - guards: which parts a named security move protects, through the threats
     its structures counter
   - rungs: where a written leverage point sits on Donella Meadows' twelve
     places to intervene (1999), twelve the shallowest, one the deepest */

import type { GaugeSystem, GaugeThreat, ModuxGauge, ModuxModel } from '../content/modux-schema';
import { buildModel, fallOrder, delayOf } from '../content/modux/dynamics';

export interface SystemReading {
  /** the links that close a feedback loop: drawn as arcs back up the page */
  loops: { from: string; to: string }[];
  rows: string[][];
  row: Record<string, number>;
  reach: Record<string, string[]>;
  keystone: string | null;
  chokepoints: string[];
  fastest: string[];
  fastestHours: number | null;
  buffers: { from: string; to: string }[];
  pressure: Record<string, number>;
  hottest: string | null;
  fall: Record<string, number | null>;
  publicIds: string[];
}

const keyOf = (from: string, to: string) => from + '>' + to;

export function readSystem(system: GaugeSystem, threats: GaugeThreat[] = [], gauge?: ModuxGauge | null, byId?: Map<string, ModuxModel>): SystemReading {
  const ids = system.nodes.map(n => n.id);
  const kind = Object.fromEntries(system.nodes.map(n => [n.id, n.kind]));
  const out = new Map<string, string[]>(ids.map(i => [i, []]));
  const into = new Map<string, string[]>(ids.map(i => [i, []]));
  for (const e of system.edges) { out.get(e.from)?.push(e.to); into.get(e.to)?.push(e.from); }

  /* feedback: while the links hold a cycle, the link that closes it is the one most likely to carry
     something back upstream (out of the people, then out of money, then out of staff) */
  const loopKeys = new Set<string>();
  const back = (k: string) => (kind[k] === 'public' ? 3 : kind[k] === 'money' ? 2 : kind[k] === 'people' ? 1 : 0);
  for (let guard = 0; guard < system.edges.length; guard++) {
    const live = system.edges.filter(e => !loopKeys.has(keyOf(e.from, e.to)));
    const cycle = findCycle(ids, live);
    if (!cycle) break;
    const pick = cycle.slice().sort((a, b) => back(b.from) - back(a.from))[0];
    loopKeys.add(keyOf(pick.from, pick.to));
  }
  const forward = system.edges.filter(e => !loopKeys.has(keyOf(e.from, e.to)));
  const loops = system.edges.filter(e => loopKeys.has(keyOf(e.from, e.to))).map(e => ({ from: e.from, to: e.to }));
  const fin = new Map<string, string[]>(ids.map(i => [i, []]));
  for (const e of forward) fin.get(e.to)?.push(e.from);

  /* rows: longest forward path from a part that depends on nothing, so every forward link points down the page */
  const row: Record<string, number> = Object.fromEntries(ids.map(i => [i, 0]));
  for (let pass = 0; pass < ids.length; pass++) {
    let moved = false;
    for (const e of forward) {
      const r = row[e.from] + 1;
      if (r > row[e.to]) { row[e.to] = r; moved = true; }
    }
    if (!moved) break;
  }
  /* the people sit on the last row, so the page always ends where the service lands */
  const publicIds = ids.filter(i => kind[i] === 'public' && (into.get(i) || []).length > 0);
  const last = Math.max(0, ...Object.values(row));
  for (const p of publicIds) if (!forward.some(e => e.from === p)) row[p] = last;
  const rows: string[][] = Array.from({ length: last + 1 }, () => []);
  for (const i of ids) rows[row[i]].push(i);
  /* order each row by the mean place of its neighbours, a few sweeps each way, to cut crossings */
  const place = (i: string) => { const r = rows[row[i]]; return r.length < 2 ? 0.5 : r.indexOf(i) / (r.length - 1); };
  for (let sweep = 0; sweep < 4; sweep++) {
    for (let r = 1; r < rows.length; r++) rows[r].sort((a, b) => mean(fin.get(a)!, place, rows[r].indexOf(a)) - mean(fin.get(b)!, place, rows[r].indexOf(b)));
    for (let r = rows.length - 2; r >= 0; r--) rows[r].sort((a, b) => mean(out.get(a)!, place, rows[r].indexOf(a)) - mean(out.get(b)!, place, rows[r].indexOf(b)));
  }

  /* reach: everything downstream of a part */
  const reach: Record<string, string[]> = {};
  for (const i of ids) {
    const seen = new Set<string>(); const q = [...(out.get(i) || [])];
    while (q.length) { const x = q.shift()!; if (seen.has(x) || x === i) continue; seen.add(x); q.push(...(out.get(x) || [])); }
    reach[i] = [...seen];
  }

  /* the keystone: the most people reached, then the most parts, then the fewest it depends on */
  const peopleIds = ids.filter(i => kind[i] === 'public' || kind[i] === 'people');
  let keystone: string | null = null; let best = -1;
  for (const i of ids) {
    if (kind[i] === 'public' && !(out.get(i) || []).length) continue;
    const score = reach[i].filter(x => peopleIds.includes(x)).length * 100 + reach[i].length * 10 - (into.get(i) || []).length;
    if (reach[i].length > 0 && score > best) { best = score; keystone = i; }
  }

  /* chokepoints: remove a part, and some people part that was reached is reached no more */
  const roots = ids.filter(i => !(into.get(i) || []).length);
  const reachable = (without: string | null) => {
    const seen = new Set<string>(); const q = roots.filter(r => r !== without);
    while (q.length) { const x = q.shift()!; if (seen.has(x)) continue; seen.add(x); for (const t of out.get(x) || []) if (t !== without) q.push(t); }
    return seen;
  };
  const base = reachable(null);
  const chokepoints = ids.filter(n => {
    if (kind[n] === 'public') return false;
    const r = reachable(n);
    return publicIds.some(p => base.has(p) && !r.has(p) && p !== n);
  });

  /* the fastest cascade: the shortest delay from the keystone to any people part, with the model's delays */
  const delay = new Map(system.edges.map(e => [keyOf(e.from, e.to), delayOf(e, kind[e.to])]));
  let fastest: string[] = []; let fastestHours: number | null = null;
  if (keystone) {
    const dist = new Map<string, number>([[keystone, 0]]); const prev = new Map<string, string>(); const done = new Set<string>();
    while (true) {
      let u: string | null = null; let du = Infinity;
      for (const [k, v] of dist) if (!done.has(k) && v < du) { u = k; du = v; }
      if (!u) break;
      done.add(u);
      for (const t of out.get(u) || []) {
        const nd = du + (delay.get(keyOf(u, t)) ?? 0.25);
        if (nd < (dist.get(t) ?? Infinity)) { dist.set(t, nd); prev.set(t, u); }
      }
    }
    const targets = (publicIds.length ? publicIds : peopleIds).filter(p => dist.has(p) && p !== keystone);
    const end = targets.sort((a, b) => dist.get(a)! - dist.get(b)!)[0];
    if (end) {
      const path = [end]; while (prev.has(path[0])) path.unshift(prev.get(path[0])!);
      fastest = path; fastestHours = Math.round(dist.get(end)! * 100) / 100;
    }
  }

  const buffers = system.edges.filter(e => /suppl/i.test(e.how)).map(e => ({ from: e.from, to: e.to }));
  const pressure: Record<string, number> = Object.fromEntries(ids.map(i => [i, 0]));
  for (const t of threats) if (t.target in pressure && !t.open) pressure[t.target] += t.weight;
  const hottest = ids.reduce<string | null>((a, i) => (pressure[i] > (a ? pressure[a] : 0) ? i : a), null);

  /* the hour each part falls on a stress day with nothing in place, from the gauges' own model */
  const fall: Record<string, number | null> = Object.fromEntries(ids.map(i => [i, null]));
  if (gauge && byId) for (const f of fallOrder(buildModel(gauge, [], byId))) fall[f.id] = f.hour === null ? null : Math.round(f.hour * 10) / 10;

  return { loops, rows, row, reach, keystone, chokepoints, fastest, fastestHours, buffers, pressure, hottest, fall, publicIds };
}

/** one cycle in the links, as the links that make it, or null when there is none */
function findCycle(ids: string[], edges: { from: string; to: string }[]): { from: string; to: string }[] | null {
  const out = new Map<string, { from: string; to: string }[]>(ids.map(i => [i, []]));
  for (const e of edges) out.get(e.from)?.push(e);
  const state = new Map<string, number>();
  const stack: { from: string; to: string }[] = [];
  let found: { from: string; to: string }[] | null = null;
  const visit = (n: string): boolean => {
    state.set(n, 1);
    for (const e of out.get(n) || []) {
      if (state.get(e.to) === 1) {
        const start = stack.findIndex(s => s.from === e.to);
        found = [...(start >= 0 ? stack.slice(start) : []), e];
        return true;
      }
      if (!state.get(e.to)) { stack.push(e); if (visit(e.to)) return true; stack.pop(); }
    }
    state.set(n, 2);
    return false;
  };
  for (const i of ids) if (!state.get(i) && visit(i)) break;
  return found;
}

function mean(xs: string[], place: (i: string) => number, fallback: number): number {
  return xs.length ? xs.reduce((k, x) => k + place(x), 0) / xs.length : fallback;
}

/** the parts a named security move protects: the targets of the threats its structures counter */
export function guardsOf(models: string[], threats: GaugeThreat[]): string[] {
  return [...new Set(threats.filter(t => t.counters.some(c => models.includes(c))).map(t => t.target))];
}

/* ---------- Meadows' ladder ---------- */

export const RUNGS: { n: number; name: string }[] = [
  { n: 12, name: 'Parameters' }, { n: 11, name: 'Buffers' }, { n: 10, name: 'Stock and flow structure' },
  { n: 9, name: 'Delays' }, { n: 8, name: 'Balancing loops' }, { n: 7, name: 'Reinforcing loops' },
  { n: 6, name: 'Information flows' }, { n: 5, name: 'Rules' }, { n: 4, name: 'Self organisation' },
  { n: 3, name: 'Goals' }, { n: 2, name: 'Paradigm' }, { n: 1, name: 'Transcending paradigms' },
];

/** where a written leverage point sits on the ladder, read from the words it opens with */
export function rungOf(point: string): number | null {
  const head = point.toLowerCase().split(/[:.(]/)[0];
  const t = head + ' ' + point.toLowerCase().slice(0, 60);
  const m = point.match(/rung\s*(\d{1,2})/i);
  if (m) { const n = Number(m[1]); if (n >= 1 && n <= 12) return n; }
  const tests: [RegExp, number][] = [
    [/transcend/, 1], [/paradigm|mindset/, 2], [/\bgoal/, 3],
    [/self[- ]?organi|power to (change|add)|evolve the structure/, 4], [/\brules?\b|who may change the rules/, 5],
    [/clause|who may|policy/, 5], [/information|signal|feedback flow/, 6], [/reinforcing|gain|scaling loop/, 7],
    [/balancing|strength of the [a-z ]*loop/, 8], [/kept|how long|retention/, 11],
    [/delay/, 9], [/buffer/, 11], [/structure|stock and flow|physical/, 10], [/parameter|number|threshold/, 12],
  ];
  for (const [re, n] of tests) if (re.test(head)) return n;
  for (const [re, n] of tests) if (re.test(t)) return n;
  return null;
}
