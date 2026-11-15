/* Gauge audit. Run: npx tsx probe-gauges.mts
   1. every authored gauge: ids, map, reference within budget and holding
   2. every pressure: counters are authored models
   3. ten notches up every gauge: what each notch adds and whether a stack still holds
   4. forty forged gauges: each one forges and holds */

import { GAUGES } from './src/content/modux/gauges';
import { PRESSURES } from './src/content/modux/pressures';
import { MODUX_MODELS } from './src/content/modux/index';
import { escalate, pickNext } from './src/content/modux/escalate';
import { forgeGauge } from './src/content/modux/forge';
import { scoreGauge, referenceFor, costOf } from './src/content/modux/score';
import { bandOf, BAND_LABEL } from './src/content/modux-schema';

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const problems: string[] = [];
const bad = (s: string) => problems.push(s);

/* 1 */
for (const g of GAUGES) {
  const nodes = new Set(g.system.nodes.map(n => n.id));
  for (const t of g.threats) {
    for (const c of t.counters) if (!byId.has(c)) bad(g.id + ' threat ' + t.id + ' counter ' + c);
    if (!nodes.has(t.target)) bad(g.id + ' threat ' + t.id + ' target ' + t.target);
  }
  for (const e of g.system.edges) if (!nodes.has(e.from) || !nodes.has(e.to)) bad(g.id + ' edge ' + e.from + '>' + e.to);
  for (const e of g.expert) if (!byId.has(e)) bad(g.id + ' expert ' + e);
  const spent = g.expert.reduce((n, id) => n + costOf(byId.get(id)!), 0);
  const r = scoreGauge(g, g.expert, byId);
  if (spent > g.budget) bad(g.id + ' expert over budget ' + spent + '/' + g.budget);
  if (r.verdict !== 'holds') bad(g.id + ' expert breached');
  console.log(g.id.padEnd(15), 'ground: spent', spent + '/' + g.budget, 'score', r.score, r.verdict);
}

/* 2 */
for (const p of PRESSURES) {
  for (const c of p.counters) if (!byId.has(c)) bad('pressure ' + p.id + ' counter ' + c);
  if (p.weakens && !byId.has(p.weakens.model)) bad('pressure ' + p.id + ' weakens ' + p.weakens.model);
  if (!p.open && !p.counters.length) bad('pressure ' + p.id + ' has no counters');
}

/* 3: climb with the reference stack in hand, as a strong learner would */
console.log('\nNOTCHES (reference stack carried up; R = reference holds every catalog threat)');
for (const g of GAUGES) {
  const used: string[] = [];
  let stack = g.expert;
  const row: string[] = [];
  for (let n = 1; n <= 25; n++) {
    const p = pickNext(g, used, stack, 'probe');
    if (!p) { row.push(n + ':end'); break; }
    used.push(p.id);
    const esc = escalate(g, used);
    const ref = referenceFor(esc, byId);
    stack = ref.stack;
    const spent = ref.stack.reduce((k, id) => k + costOf(byId.get(id)!), 0);
    if (spent > esc.gauge.budget) bad(g.id + ' notch ' + n + ' reference over budget');
    row.push((p.open ? 'O' : p.weakens ? 'W' : '') + (ref.catalogHolds ? 'R' : ref.coverable === false ? 'X' : '?') + ref.result.score);
  }
  const t0 = Date.now();
  console.log(g.id.padEnd(15), row.join(' '), '(' + (Date.now() - t0) + 'ms)');
}
/* pressure (threat weight per budget point) must rise at every notch, on every path */
let drops = 0, steps = 0;
for (const salt of ['a', 'b', 'c']) for (const g of GAUGES) {
  const used: string[] = []; let stack = g.expert;
  let prev = g.threats.reduce((k, t) => k + t.weight, 0) / g.budget;
  for (let n = 1; n <= 14; n++) {
    const p = pickNext(g, used, stack, salt); if (!p) break;
    used.push(p.id);
    const e = escalate(g, used);
    const pr = e.gauge.threats.reduce((k, t) => k + t.weight, 0) / e.gauge.budget;
    steps++; if (pr < prev - 1e-9) { drops++; bad(g.id + ' pressure fell at notch ' + n + ' (' + salt + ')'); }
    prev = pr; stack = referenceFor(e, byId).stack;
  }
}
console.log('pressure checked over', steps, 'notch steps, drops', drops);
console.log('bands:', [0, 1, 3, 5, 7, 12].map(l => l + '=' + BAND_LABEL[bandOf(l)]).join(' '));

/* 4 */
let forged = 0, held = 0;
const arche = new Map<string, number>();
for (let i = 0; i < 40; i++) {
  const g = forgeGauge('probe-' + i, byId);
  if (!g) { bad('forge failed for seed probe-' + i); continue; }
  forged++;
  arche.set(g.org, (arche.get(g.org) || 0) + 1);
  const r = scoreGauge(g, g.expert, byId);
  const spent = g.expert.reduce((k, id) => k + costOf(byId.get(id)!), 0);
  if (r.verdict === 'holds' && spent <= g.budget) held++;
  else bad('forged ' + g.id + ' reference does not hold');
  const again = forgeGauge('probe-' + i, byId);
  if (JSON.stringify(again) !== JSON.stringify(g)) bad('forge not deterministic for probe-' + i);
}
console.log('\nforged', forged, 'held', held, 'distinct orgs', arche.size);

console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems.slice(0, 40)) console.log('  ' + p);
process.exitCode = problems.length ? 1 : 0;
