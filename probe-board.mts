/* PROBE: the board and the week. A run travels in a link with its gauge and
   comes back whole; a hostile run comes back clamped; the week's challenge
   is the same for every day of a week and changes with the week; its
   pressure fits its gauge; the week key is the ISO week; a held run under
   the week's pressure counts and a run outside it does not.
   Run: npx tsx probe-board.mts */

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).location = { origin: 'https://unitium-safe.vercel.app', pathname: '/', hash: '' };
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { MODUX_MODELS } = await import('./src/content/modux/index');
const { GAUGES } = await import('./src/content/modux/gauges');
const { encodeResult, decodeResult } = await import('./src/lib/share');
const { weekKey, weekChallenge, weekCandidates, heldThisWeek } = await import('./src/content/modux/week');
const { reducer } = await import('./src/lib/state');

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const known = (id: string) => byId.has(id);
const problems: string[] = [];

/* a run round trip */
const g = GAUGES[0];
const run = { by: 'Probe', notch: 2, score: 88, hoursKept: 21.2, held: true, stack: g.expert.slice(0, 3), at: 1792300000000 };
const frag = await encodeResult(g, run);
const back = await decodeResult(frag, known);
if (!back) problems.push('the run did not come back');
else {
  if (back.gauge.id !== g.id) problems.push('the gauge changed: ' + back.gauge.id);
  if (JSON.stringify(back.run) !== JSON.stringify(run)) problems.push('the run changed: ' + JSON.stringify(back.run));
}
console.log('result link ' + frag.length + ' chars');

/* a hostile run */
const toB64 = (x: string) => 'r' + Buffer.from(x).toString('base64').replace(/[+]/g, '-').replace(/[/]/g, '_').replace(/=+$/, '');
const bell = String.fromCharCode(7);
const hostile = await decodeResult(toB64(JSON.stringify({ v: 1, g, r: { by: bell + 'x'.repeat(100), notch: -3, score: 500, hoursKept: 99.99, held: 'yes', stack: ['nope', g.expert[0], 7], at: 'now' } })), known);
if (!hostile) problems.push('a hostile run was refused instead of cleaned');
else {
  const r = hostile.run;
  if (r.by.length !== 40 || r.by.includes(bell)) problems.push('by not cleaned: ' + r.by.length);
  if (r.notch !== 0 || r.score !== 100 || r.hoursKept !== 24 || r.held !== false || r.stack.length !== 1 || r.at !== 0) problems.push('run not clamped: ' + JSON.stringify(r));
}
if (await decodeResult(toB64(JSON.stringify({ v: 1, g })), known) !== null) problems.push('a link without a run was accepted');
if (await decodeResult(toB64(JSON.stringify({ v: 1, r: run })), known) !== null) problems.push('a link without a gauge was accepted');

/* the reducer keeps a board, once per run, forty at most */
let st: any = { boards: {} };
for (let i = 0; i < 50; i++) st = reducer(st, { t: 'board-add', gaugeId: g.id, run: { ...run, by: 'p' + i, at: i } });
st = reducer(st, { t: 'board-add', gaugeId: g.id, run: { ...run, by: 'p49', at: 49 } });
if (st.boards[g.id].length !== 40) problems.push('board cap: ' + st.boards[g.id].length);

/* the forged list keeps your own maps, and the newest twenty four of the rest */
let fl: any = { forged: [] };
for (let i = 0; i < 30; i++) fl = reducer(fl, { t: 'forge-add', gauge: { ...g, id: 'own-' + i, seed: 'own' } });
for (let i = 0; i < 30; i++) fl = reducer(fl, { t: 'forge-add', gauge: { ...g, id: 'fg-' + i, seed: 'x' } });
if (fl.forged.filter((x: any) => x.seed === 'own').length !== 30) problems.push('own maps were evicted: ' + fl.forged.filter((x: any) => x.seed === 'own').length);
if (fl.forged.filter((x: any) => x.seed !== 'own').length !== 24) problems.push('other gauges not capped at 24');
if (!fl.forged.some((x: any) => x.id === 'fg-29') || fl.forged.some((x: any) => x.id === 'fg-0')) problems.push('the newest were not kept');

/* the open formats: a gauge file and a run file come back whole; anything else is refused */
const { recordFile, readRecordFile } = await import('./src/lib/share');
const gf = readRecordFile(recordFile(g), known);
if (!gf || gf.gauge.id !== g.id || gf.run) problems.push('gauge file round trip');
const rf = readRecordFile(recordFile(g, run), known);
if (!rf || !rf.run || JSON.stringify(rf.run) !== JSON.stringify(run)) problems.push('run file round trip');
if (readRecordFile('{"format":"nope"}', known) !== null) problems.push('a foreign file was read');
if (readRecordFile('not json', known) !== null) problems.push('a broken file was read');
if (!JSON.parse(recordFile(g)).$schema.endsWith('/schema/stepsafe-gauge.v1.json')) problems.push('gauge file does not name its schema');

/* the week */
const mon = new Date(2026, 9, 12, 9), fri = new Date(2026, 9, 16, 23), nextMon = new Date(2026, 9, 19, 1);
if (weekKey(mon) !== '2026-W42' || weekKey(fri) !== '2026-W42') problems.push('week key: ' + weekKey(mon) + ' ' + weekKey(fri));
if (weekKey(nextMon) !== '2026-W43') problems.push('next week key: ' + weekKey(nextMon));
if (weekKey(new Date(2026, 0, 1)) !== '2026-W01' || weekKey(new Date(2027, 0, 1)) !== '2026-W53') problems.push('iso week edges: ' + weekKey(new Date(2026, 0, 1)) + ' ' + weekKey(new Date(2027, 0, 1)));
const w1 = weekChallenge(mon), w2 = weekChallenge(fri), w3 = weekChallenge(nextMon);
if (w1.gauge.id !== w2.gauge.id || w1.pressure.id !== w2.pressure.id) problems.push('the week changed inside a week');
if (w1.gauge.id === w3.gauge.id && w1.pressure.id === w3.pressure.id) problems.push('two weeks in a row gave the same challenge (possible, but check the seed)');
if (!weekCandidates(w1.gauge).some(p => p.id === w1.pressure.id)) problems.push('the pressure does not fit the gauge');
if (w1.monday.getDay() !== 1 || w1.sunday.getDay() !== 0) problems.push('bounds are not monday to sunday');
const seen = new Set<string>();
for (let d = 0; d < 26 * 7; d += 7) { const w = weekChallenge(new Date(2026, 0, 5 + d)); seen.add(w.gauge.id); }
if (seen.size < 6) problems.push('26 weeks visited only ' + seen.size + ' gauges');
console.log('this week:', weekKey(), w1.key, w1.gauge.title, '·', w1.pressure.name);

/* held this week */
const log = [{ week: weekKey(fri), held: true }, { week: '2026-W41', held: true }, { week: weekKey(fri), held: false }];
if (!heldThisWeek(log, fri)) problems.push('a held run this week should count');
if (heldThisWeek([{ week: '2026-W41', held: true }], fri)) problems.push('last week should not count');
if (heldThisWeek([{ held: true }], fri)) problems.push('a run with no week should not count');

console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
