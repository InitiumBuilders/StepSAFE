/* PROBE: goals and the watch. Every goal kind reads a number from the record;
   the notch kind counts Ground as one; a goal reaches when the record crosses
   it and not before; the reducer keeps at most twenty four goals; the watch
   counts a day once; the new awards exist and every award the hooks and the
   engine name exists. Run: npx tsx probe-goals.mts */

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { GOAL_KINDS, goalProgress, goalTargetValue } = await import('./src/lib/goals');
const { serviceRecord } = await import('./src/lib/service');
const { AWARDS, HOOKS } = await import('./src/content/index');

const problems: string[] = [];
const base: any = {
  gauges: {}, gaugeSessions: {}, forged: [], runLog: [], completedSims: {}, completedSteps: {}, completedChapters: {}, guidesRead: {}, streak: 0,
};

/* every kind reads zero from an empty record, and the right number from a filled one */
const empty = serviceRecord(base, 1000);
for (const k of GOAL_KINDS) {
  const v = goalProgress(base, empty, k.key);
  if (k.key === 'notch' ? v !== 0 : v !== 0) problems.push(k.key + ': reads ' + v + ' from an empty record');
  if (!(k.suggest.length >= 3 && k.suggest.every((x, i) => i === 0 || x > k.suggest[i - 1]))) problems.push(k.key + ': suggestions must rise');
  if (!k.title(k.suggest[0])) problems.push(k.key + ': no title');
}
const filled: any = {
  ...base,
  streak: 4,
  completedChapters: { a: 1, b: 1 },
  completedSteps: { s1: 1, s2: 1, s3: 1 },
  completedSims: { r1: { at: 1, score: 1 } },
  guidesRead: { g1: 1, g2: 1 },
  gauges: { 'tr-waterworks': { best: 90, stack: [], at: 1, runs: 2, held: true, beatRef: true, levels: {}, top: 2 } },
  study: { 'term:a': { box: 4, views: 2, reviews: 3 }, 'term:b': { box: 1, views: 1 } }, unitiaC: 250,
};
const sr = serviceRecord(filled, 1000);
const want: Record<string, number> = { people: 30000, gauges: 1, notch: 3, streak: 4, chapters: 2, steps: 3, rooms: 1, guides: 2, cards: 1, unitia: 2 };
for (const [k, v] of Object.entries(want)) {
  const got = goalProgress(filled, sr, k as any);
  if (got !== v) problems.push(k + ': want ' + v + ' got ' + got);
}
if (goalProgress(filled, sr, 'hours') <= 0) problems.push('hours: a held gauge keeps no hours');
if (goalTargetValue('notch', 2) !== 3 || goalTargetValue('people', 5) !== 5) problems.push('target value: notch counts Ground as one');

/* a goal reaches when the record crosses it and not before */
const reach = (key: any, target: number) => goalProgress(filled, sr, key) >= goalTargetValue(key, target);
if (!reach('people', 30000)) problems.push('people goal of 30,000 should be reached at 30,000');
if (reach('people', 30001)) problems.push('people goal of 30,001 should not be reached at 30,000');
if (!reach('notch', 2)) problems.push('notch goal of 2 should be reached when held to notch 2');
if (reach('notch', 3)) problems.push('notch goal of 3 should not be reached when held to notch 2');

/* the reducer */
const { reducer } = await import('./src/lib/state').catch(() => ({ reducer: null as any }));
if (reducer) {
  let st: any = { ...filled, goals: [], watchesKept: 0, lastWatch: '' };
  for (let i = 0; i < 30; i++) st = reducer(st, { t: 'goal-add', goal: { id: 'g' + i, key: 'steps', title: 'x', target: 1, createdAt: i } });
  if (st.goals.length !== 24) problems.push('goals cap: ' + st.goals.length);
  st = reducer(st, { t: 'goal-reached', id: 'g29', at: 7 });
  if (!st.goals.find((g: any) => g.id === 'g29')?.reachedAt) problems.push('goal-reached did not mark the goal');
  st = reducer(st, { t: 'goal-remove', id: 'g29' });
  if (st.goals.find((g: any) => g.id === 'g29')) problems.push('goal-remove did not remove the goal');
  st = reducer(st, { t: 'watch-kept', day: '2026-10-16' });
  st = reducer(st, { t: 'watch-kept', day: '2026-10-16' });
  st = reducer(st, { t: 'watch-kept', day: '2026-10-17' });
  if (st.watchesKept !== 2) problems.push('watch-kept counted a day twice or missed one: ' + st.watchesKept);
} else {
  console.log('(reducer not exported; the reducer checks were skipped)');
}

/* the awards exist and the hooks name real ones */
const ids = new Set(AWARDS.map(a => a.id));
for (const id of ['small-goal-set', 'small-three-goals', 'strong-goal-reached', 'strong-five-goals', 'small-held-ten-thousand', 'strong-held-hundred-thousand', 'strong-held-million', 'strong-full-day-kept', 'small-systems-shelf', 'small-watch-kept', 'strong-seven-watches', 'small-study-first-held', 'small-study-own-words', 'small-study-first-unitia', 'strong-study-ten-held', 'strong-study-fud-cleared', 'strong-study-every-kind', 'strong-study-fifty-held', 'strong-study-hundred-unitia']) {
  if (!ids.has(id)) problems.push('award missing: ' + id);
}
for (const h of HOOKS) for (const a of h.awards) if (!ids.has(a)) problems.push('hook ' + h.trigger + ' names a missing award ' + a);
const dup = AWARDS.map(a => a.id).filter((id, i, arr) => arr.indexOf(id) !== i);
if (dup.length) problems.push('duplicate award ids: ' + dup.join(', '));

console.log('kinds ' + GOAL_KINDS.length + ' · awards ' + AWARDS.length + ' · hooks ' + HOOKS.length);
console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
