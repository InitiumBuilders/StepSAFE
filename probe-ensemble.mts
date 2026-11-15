/* Many days (content/modux/dynamics.ts: drawDays, ensemble, sensitivity, robustLeverage), checked on every authored
   gauge: the same inputs give the same days; the numbers are ordered and bounded; a stack never keeps fewer hours than
   no stack on the same day; the sensitivity covers every assumption; the robust moves are real gains; and it is fast
   enough to run on the page.
     npx tsx probe-ensemble.mts */
import { GAUGES } from './src/content/modux/gauges';
import { MODUX_MODELS } from './src/content/modux/index';
import { buildModel, stressDay, drawDays, ensemble, sensitivity, robustLeverage, leverage, RANGES, underDay, simulate } from './src/content/modux/dynamics';

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const problems: string[] = [];
const fail = (m: string) => { problems.push(m); console.log('FAIL ' + m); };
let agree = 0, differ = 0, msEns = 0, msRob = 0, maxRob = 0;

for (const g of GAUGES) {
  const bare = buildModel(g, [], byId), ref = buildModel(g, g.expert, byId);
  const days = drawDays(bare, 200);
  const again = drawDays(buildModel(g, [], byId), 200);
  if (JSON.stringify(days) !== JSON.stringify(again)) fail(g.id + ': the days are not the same for the same gauge');

  let t0 = performance.now();
  const eb = ensemble(bare, days), er = ensemble(ref, days);
  msEns = Math.max(msEns, (performance.now() - t0) / 2);
  for (const [name, e] of [['bare', eb], ['reference', er]] as const) {
    if (!(e.p10 >= 0 && e.p10 <= e.p50 + 1e-9 && e.p50 <= e.p90 + 1e-9 && e.p90 <= 24 + 1e-9)) fail(g.id + ' ' + name + ': quantiles out of order ' + [e.p10, e.p50, e.p90].join(' '));
    if (!(e.held >= 0 && e.held <= 1)) fail(g.id + ' ' + name + ': held share out of range');
    if (e.band.some(b => !(b.p10 <= b.p50 + 1e-9 && b.p50 <= b.p90 + 1e-9 && b.p10 >= -1e-9 && b.p90 <= 1 + 1e-9))) fail(g.id + ' ' + name + ': the hourly band is out of order');
    if (Object.values(e.fell).some(v => v < 0 || v > 1)) fail(g.id + ' ' + name + ': a fell share out of range');
    if (e.n !== 200 || e.kept.length !== 200) fail(g.id + ' ' + name + ': not 200 days');
  }
  /* the same day, with and without the reference stack: a stack never makes a day worse */
  let worse = 0;
  for (const d of days.slice(0, 60)) {
    const arr = Object.entries(d.arrivals).map(([id, at]) => ({ id, at }));
    const kb = 24 - simulate(underDay(bare, d), arr, 24, 0.2).state.lost;
    const kr = 24 - simulate(underDay(ref, d), arr, 24, 0.2).state.lost;
    if (kr < kb - 1e-6) worse++;
  }
  if (worse) fail(g.id + ': the reference stack kept fewer hours than no stack on ' + worse + ' of 60 days');
  if (er.p50 + 1e-9 < eb.p50) fail(g.id + ': the reference stack is worse on a typical day');

  const sens = sensitivity(bare);
  if (sens.length !== RANGES.length || sens.some((s, i) => i && s.swing > sens[i - 1].swing + 1e-9)) fail(g.id + ': sensitivity is not every assumption, widest first');

  t0 = performance.now();
  const rob = robustLeverage(g, [], byId, [], new Set(), 3, 80);
  const ms = performance.now() - t0; msRob += ms; maxRob = Math.max(maxRob, ms);
  if (rob.moves.some(m => !(m.worst >= -0.05 && m.cost > 0))) fail(g.id + ': a robust move with a loss or no cost');
  const st = leverage(g, [], byId, [], new Set(), 1).moves[0];
  if (rob.moves[0] && st) { if (rob.moves[0].id === st.id) agree++; else differ++; }

  console.log(g.id.padEnd(16) + ' stress ' + (24 - stressDay(bare)).toFixed(1).padStart(4) + ' h · bare days ' + eb.p10.toFixed(1) + ' / ' + eb.p50.toFixed(1) + ' / ' + eb.p90.toFixed(1) + ' · ref ' + er.p10.toFixed(1) + ' / ' + er.p50.toFixed(1) + ' / ' + er.p90.toFixed(1) + ' held ' + Math.round(er.held * 100) + '% · most sensitive: ' + sens[0].label + ' (' + sens[0].lo.toFixed(1) + ' to ' + sens[0].hi.toFixed(1) + ') · robust first: ' + (rob.moves[0] ? rob.moves[0].name + ' +' + rob.moves[0].worst + ' h worst' : 'none'));
}
console.log('robust and stress-day first moves: ' + agree + ' agree, ' + differ + ' differ');
console.log('time: 200 days ' + msEns.toFixed(0) + ' ms at most · robust ranking ' + (msRob / GAUGES.length).toFixed(0) + ' ms on average, ' + maxRob.toFixed(0) + ' ms at most');
if (msEns > 400) fail('200 days take ' + msEns.toFixed(0) + ' ms, too slow for the page');
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')' : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
