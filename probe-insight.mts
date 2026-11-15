/* PROBE: the insights. An empty record gets the first-hold insight and the
   shelf; a record with a thin hold names it with the move that keeps the most;
   a goal with a date inside two weeks comes first; never more than three.
   Run: npx tsx probe-insight.mts */

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { insights } = await import('./src/lib/insight');
const problems: string[] = [];
const now = Date.UTC(2026, 9, 16, 12);
const base: any = {
  gauges: {}, gaugeSessions: {}, forged: [], runLog: [], completedSims: {}, completedSteps: {}, completedPages: {}, completedChapters: {},
  guidesRead: {}, streak: 0, goals: [], profile: { intention: '', intentionAt: 0 },
};

const empty = insights(base, now);
if (!empty.find(i => i.key === 'first-hold')) problems.push('empty record: no first-hold insight');
if (!empty.find(i => i.key === 'shelf')) problems.push('empty record: no shelf insight');
if (empty.length > 3) problems.push('more than three insights');
console.log('empty:', empty.map(i => i.key + ' · ' + i.title).join(' | '));

/* a thin hold at Ground with an empty stack keeps little; the move that keeps the most is named */
const thin: any = {
  ...base,
  gauges: { 'tr-waterworks': { best: 90, stack: [], at: 1, runs: 1, held: true, beatRef: false, levels: {}, top: 0 } },
  runLog: [{ g: 'tr-waterworks', title: 'x', notch: 0, score: 90, ref: 88, held: true, at: 1, fams: ['resilience'], motrus: 0 }],
};
const t = insights(thin, now);
const th = t.find(i => i.key === 'thin');
if (!th) problems.push('thin hold: no insight');
else {
  if (!/Booster Station/.test(th.title)) problems.push('thin hold: wrong gauge ' + th.title);
  if (!/keeps .* more for \d+ budget/.test(th.line)) problems.push('thin hold: no move named: ' + th.line);
  if (!/30,000/.test(th.line)) problems.push('thin hold: no people: ' + th.line);
}
const fam = t.find(i => i.key === 'families');
if (!fam) problems.push('families: no insight when one family was used');
else if (!/11 of 12/.test(fam.title)) problems.push('families: ' + fam.title);
console.log('thin:', t.map(i => i.key + ' · ' + i.title).join(' | '));

/* a goal with a date inside two weeks comes first */
const dated: any = { ...thin, goals: [{ id: 'g', key: 'steps', title: 'Seal 10 steps', target: 10, by: '2026-10-20', createdAt: 1 }] };
const g = insights(dated, now);
if (g[0]?.key !== 'goal') problems.push('a dated goal should come first, got ' + g[0]?.key);
if (!/due in 4 days/.test(g[0]?.title || '')) problems.push('goal days: ' + g[0]?.title);
if (g.length > 3) problems.push('more than three insights with a goal');
console.log('dated:', g.map(i => i.key + ' · ' + i.title).join(' | '));

/* a chapter with steps sealed is the nearest */
const ch: any = { ...base, completedSteps: { 'x': 1 } };
const { CHAPTERS } = await import('./src/content/index');
const first = CHAPTERS[0];
const stepId = first.pages[0].steps[0].id;
const chIns = insights({ ...ch, completedSteps: { [stepId]: 1 } }, now).find(i => i.key === 'chapter');
if (!chIns) problems.push('chapter: no nearest chapter with one step sealed');
else if (!chIns.title.startsWith(first.title)) problems.push('chapter: ' + chIns.title);

console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
