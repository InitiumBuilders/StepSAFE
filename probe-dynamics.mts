/* The dynamics under every authored gauge: stocks stay in bounds, the reference
   stack keeps more service than no stack, every leverage move is a real catalog
   structure whose run keeps what it says, loops exist where the map says they
   should, and the model is deterministic. Run: npx tsx probe-dynamics.mts */
import { GAUGES } from './src/content/modux/gauges';
import { MODUX_MODELS } from './src/content/modux/index';
import { escalate, pickNext } from './src/content/modux/escalate';
import { buildModel, simulate, stressDay, leverage, loopsOf } from './src/content/modux/dynamics';

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const problems: string[] = [];
const bad = (s: string) => problems.push(s);
let moves = 0, checks = 0;

for (const g of GAUGES) {
  /* notch 0, and a path to notch 5 */
  const used: string[] = [];
  for (let i = 0; i < 5; i++) { const p = pickNext(g, used, g.expert, 'dyn'); if (!p) break; used.push(p.id); }
  for (const [label, esc] of [['ground', escalate(g, [])], ['notch ' + used.length, escalate(g, used)]] as const) {
    const gauge = esc.gauge;
    const weakened = new Set(esc.weakened.map(w => w.model));
    const empty = buildModel(gauge, [], byId, [], weakened);
    const ref = buildModel(gauge, gauge.expert, byId, [], weakened);
    const lostEmpty = stressDay(empty), lostRef = stressDay(ref);
    checks++;
    if (!(lostEmpty > 0.5)) bad(g.id + ' ' + label + ': an empty stack lost only ' + lostEmpty.toFixed(2) + ' h');
    if (!(lostRef < lostEmpty)) bad(g.id + ' ' + label + ': the reference stack (' + lostRef.toFixed(2) + ' h) did not beat empty (' + lostEmpty.toFixed(2) + ' h)');
    if (lostRef > 24 || lostEmpty > 24) bad(g.id + ' ' + label + ': lost more than a day');
    /* bounds and determinism */
    const a = simulate(empty, empty.threats.map((t, i) => ({ id: t.id, at: 1 + i })));
    const b = simulate(empty, empty.threats.map((t, i) => ({ id: t.id, at: 1 + i })));
    if (JSON.stringify(a.state) !== JSON.stringify(b.state)) bad(g.id + ' ' + label + ': two runs differed');
    for (const s of a.samples) for (const [n, h] of Object.entries(s.health)) if (h < 0 || h > 1 || Number.isNaN(h)) bad(g.id + ' ' + label + ': ' + n + ' health ' + h + ' at hour ' + s.hour);
    if (a.samples.length < 24) bad(g.id + ' ' + label + ': only ' + a.samples.length + ' samples');
    /* the public parts fall after the parts they depend on, when a chain exists */
    const chainEdge = empty.edges.find(e => empty.kinds[e.to] === 'public' && !e.cutBy);
    if (chainEdge) {
      const fromHit = empty.threats.some(t => t.target === chainEdge.from);
      if (fromHit) {
        const lastH = a.samples[a.samples.length - 1].health;
        if (lastH[chainEdge.to] >= 0.999 && lastH[chainEdge.from] < 0.5) bad(g.id + ' ' + label + ': ' + chainEdge.to + ' stayed whole while ' + chainEdge.from + ' fell');
      }
    }
    /* leverage: real ids, kept as promised, ordered */
    const lev = leverage(gauge, [], byId, [], weakened, 5);
    if (!lev.moves.length) bad(g.id + ' ' + label + ': no leverage move from an empty stack');
    for (const mv of lev.moves) {
      moves++;
      if (!byId.has(mv.id)) bad(g.id + ' ' + label + ': move ' + mv.id + ' is not in the catalog');
      if (!(mv.kept > 0)) bad(g.id + ' ' + label + ': move ' + mv.id + ' keeps nothing');
      const again = lev.base - stressDay(buildModel(gauge, [mv.id], byId, [], weakened));
      if (Math.abs(again - mv.kept) > 0.11) bad(g.id + ' ' + label + ': move ' + mv.id + ' said ' + mv.kept + ' h but a run gave ' + again.toFixed(2));
      if (!gauge.system.nodes.some(n => n.id === mv.where)) bad(g.id + ' ' + label + ': move ' + mv.id + ' acts on an unknown part ' + mv.where);
    }
    for (let i = 1; i < lev.moves.length; i++) {
      const p = lev.moves[i - 1], q = lev.moves[i];
      if (p.kept / p.cost < q.kept / q.cost - 1e-9) bad(g.id + ' ' + label + ': moves out of order');
    }
    /* the reference stack has less leverage left than nothing */
    const levRef = leverage(gauge, gauge.expert, byId, [], weakened, 5);
    if (levRef.base > lev.base) bad(g.id + ' ' + label + ': the reference stack loses more than nothing');
    /* loops */
    const loops = loopsOf(gauge, empty, esc.level);
    const hasPublic = gauge.system.nodes.some(n => n.kind === 'public');
    if (hasPublic && !loops.some(l => l.id === 'public')) bad(g.id + ' ' + label + ': public part without the public loop');
    if (!loops.some(l => l.id === 'detect' && !l.active)) bad(g.id + ' ' + label + ': an empty stack should show the detect loop idle');
    if (esc.level >= 5 && !loops.some(l => l.id === 'adapt')) bad(g.id + ' ' + label + ': Wicked without the adversary loop');
    const refLoops = loopsOf(gauge, ref, esc.level);
    for (const l of refLoops) for (const part of l.parts) if (!gauge.system.nodes.some(n => n.id === part)) bad(g.id + ' loop ' + l.id + ' names unknown part ' + part);
  }
}

console.log('gauges ' + GAUGES.length + ' · checks ' + checks + ' · moves ' + moves);
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.slice(0, 40).join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
