/* PROBE: the service record. For every authored gauge, a record that holds
   at Ground with the expert stack must count its people and keep most of
   the day; the same gauge held at notch 3 with the same stack keeps no more
   than it kept at Ground; a breached record counts nothing; a sector line
   with no number adds no people. Run: npx tsx probe-service.mts */

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { GAUGES } = await import('./src/content/modux/gauges');
const { serviceRecord } = await import('./src/lib/service');
const { peopleCount, peopleOf } = await import('./src/lib/people');

const problems: string[] = [];
const base = { forged: [], runLog: [], completedSims: {}, completedSteps: {}, gaugeSessions: {} };

let heldAll = 0, peopleAll = 0;
for (const g of GAUGES) {
  const s = { ...base, gauges: { [g.id]: { best: 90, stack: g.expert, at: 1, runs: 1, held: true, beatRef: true, levels: { '0': { best: 90, held: true, beatRef: true, at: 1 } }, top: 0 } } } as any;
  const r = serviceRecord(s, 1000);
  const line = r.lines[0];
  if (!line) { problems.push(g.id + ': no line for a held record'); continue; }
  heldAll += 1; peopleAll += line.people;
  if (line.people !== peopleCount(g.sector)) problems.push(g.id + ': people ' + line.people + ' vs ' + peopleCount(g.sector));
  if (line.hoursKept < 8) problems.push(g.id + ': expert stack at Ground keeps only ' + line.hoursKept.toFixed(1) + ' h');
  if (line.hoursKept > 24) problems.push(g.id + ': kept more than a day');
  console.log(g.id.padEnd(26), String(line.people).padStart(8), (peopleOf(g.sector) || 'no count').padEnd(22), line.hoursKept.toFixed(1) + ' h at Ground');

  /* the same stack at notch 3 keeps no more than at Ground */
  const s3 = { ...s, gauges: { [g.id]: { ...s.gauges[g.id], top: 3 } }, gaugeSessions: { [g.id]: { used: ['p-a', 'p-b', 'p-c'], salt: 'one' } } } as any;
  const r3 = serviceRecord(s3, 1000);
  if (r3.lines[0] && r3.lines[0].hoursKept > line.hoursKept + 0.01) problems.push(g.id + ': notch 3 keeps more than Ground (' + r3.lines[0].hoursKept.toFixed(1) + ' > ' + line.hoursKept.toFixed(1) + ')');

  /* a breached record counts nothing */
  const sb = { ...s, gauges: { [g.id]: { ...s.gauges[g.id], held: false, top: -1 } } } as any;
  if (serviceRecord(sb, 1000).lines.length) problems.push(g.id + ': a breached record counted');
}

/* the days: three moves on two days count two days, and only the recent ones in the last thirty */
const now = 40 * 86400000;
const sd = { ...base, gauges: {}, runLog: [{ at: now - 1000 }, { at: now - 2000 }], completedSims: { a: { at: now - 35 * 86400000, score: 1 } }, completedSteps: { x: now - 3 * 86400000 } } as any;
const rd = serviceRecord(sd, now);
if (rd.days30 !== 2) problems.push('days30 ' + rd.days30 + ' (want 2)');
if (rd.daysAll !== 3) problems.push('daysAll ' + rd.daysAll + ' (want 3)');

/* a sector with no number */
if (peopleCount('A thing with no count') !== 0 || peopleOf('A thing with no count') !== null) problems.push('a sector with no number counted people');

const all = serviceRecord({ ...base, gauges: {} } as any, 1000);
console.log('\ngauges ' + GAUGES.length + ' · people across the catalog ' + all.peopleAll.toLocaleString() + ' · held in this probe ' + heldAll + ' · people held ' + peopleAll.toLocaleString());
console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
