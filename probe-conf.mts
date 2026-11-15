import { GAUGES as TRIALS } from './src/content/modux/gauges';
import { MODUX_MODELS } from './src/content/modux/index';
import { linksAmong } from './src/content/modux/score';
const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
for (const id of ['tr-harbor', 'tr-commons', 'tr-lumen']) {
  const t = TRIALS.find(x => x.id === id)!;
  for (const c of linksAmong(t.expert, byId, 'conflicts')) console.log(id, '|', c.a, '<>', c.b, '\n   ', c.how.slice(0, 260));
}
let total = 0; for (const m of MODUX_MODELS) total += (m.conflicts || []).length;
console.log('total conflicts authored:', total);
