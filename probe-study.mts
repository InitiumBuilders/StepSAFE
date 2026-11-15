/* PROBE: StudyMode. The deck builds from the content with one card per id and
   every kind present; every related id resolves and the graph is symmetric;
   a question has four options and one right answer; the reducer pays one
   hundredth of a UNITIA a second, stops paying after ten minutes on a card in
   a day, pays one UNITIA for a review once a day and only after five seconds;
   Semble Sound clamps to its range and below one is the FUD range; tags, notes
   and own words have caps; the boxes move as the grades say; the queue has a
   reason for every card; every sg- class the components use has a rule.
   Run: npx tsx probe-study.mts */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).location = { origin: 'https://unitium-safe.vercel.app', pathname: '/', hash: '' };
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };
(globalThis as any).localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
(globalThis as any).sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };

const { deck, cardById, neighbours, degree, pathTo, domainsOf, KIND_LABEL } = await import('./src/lib/study/cards');
const { masteryOf, isFud, isDue, questionFor, forYou, progressOf, heldCards, fmtUnitia, fmtTime, dayKey, soundWords, calibrationOf } = await import('./src/lib/study/engine');
const { signalQuery, researchTrend } = await import('./src/lib/study/signal');
const { reducer, scheduleCard, UNITIA_C_PER_SECOND, UNITIA_C_PER_REVIEW, STUDY_DAILY_CARD_SECONDS, STUDY_REVIEW_MIN_SECONDS, SOUND_MIN, SOUND_MAX } = await import('./src/lib/state');
const { newSession, applyEvent, dueIds, fudIds, SESSION_CAP } = await import('./src/lib/study/session');
const { HOOKS } = await import('./src/content/hooks');
const { AWARDS } = await import('./src/content/index');
const { GOAL_KINDS, goalProgress } = await import('./src/lib/goals');
const { insights } = await import('./src/lib/insight');
const { serviceRecord } = await import('./src/lib/service');

const problems: string[] = [];
const kinds = Object.keys(KIND_LABEL);

/* ---------- the deck ---------- */
const cards = deck();
const ids = new Set<string>();
const byKind: Record<string, number> = {};
for (const c of cards) {
  if (ids.has(c.id)) problems.push('duplicate card id ' + c.id);
  ids.add(c.id);
  byKind[c.kind] = (byKind[c.kind] || 0) + 1;
  if (!c.id.startsWith(c.kind + ':')) problems.push('card id does not carry its kind: ' + c.id);
  if (!c.title.trim()) problems.push('card without a title: ' + c.id);
  if (!c.answer.trim()) problems.push('card without an answer: ' + c.id);
  if (!c.cue.trim()) problems.push('card without a cue: ' + c.id);
  if (!c.domain.trim()) problems.push('card without a domain: ' + c.id);
  if (!c.route || !c.route.view) problems.push('card without a route: ' + c.id);
  if (c.words <= 0) problems.push('card with no words counted: ' + c.id);
  for (const r of c.related) {
    if (!cardById(r)) problems.push(c.id + ' relates to a card that does not exist: ' + r);
    if (!neighbours(r).includes(c.id)) problems.push('graph is not symmetric: ' + c.id + ' -> ' + r);
  }
}
for (const k of kinds) if (!byKind[k]) problems.push('no cards of kind ' + k);
if (cards.length < 100) problems.push('deck is thin: ' + cards.length + ' cards');
const joined = cards.filter(c => degree(c.id) > 0).length;
if (joined / cards.length < 0.6) problems.push('fewer than six in ten cards are joined to another: ' + joined + '/' + cards.length);
if (!domainsOf('term').length) problems.push('terms have no domains');

/* ---------- questions ---------- */
let asked = 0, noQuestion = 0;
for (const c of cards) {
  const q = questionFor(c, 1);
  if (!q) { noQuestion++; continue; }
  asked++;
  if (q.options.length !== 4) problems.push('question for ' + c.id + ' has ' + q.options.length + ' options');
  if (q.options.filter(o => o.right).length !== 1) problems.push('question for ' + c.id + ' does not have one right option');
  if (new Set(q.options.map(o => o.text)).size !== q.options.length) problems.push('question for ' + c.id + ' repeats an option');
  if (!q.prompt.trim() || !q.explain.trim()) problems.push('question for ' + c.id + ' has no prompt or no explanation');
  if (c.kind !== 'threat' && q.options.find(o => o.right)?.text !== c.title) problems.push('question for ' + c.id + ' has the wrong right answer');
}
if (asked / cards.length < 0.9) problems.push('fewer than nine in ten cards can be asked: ' + asked + '/' + cards.length);
/* salt changes the draw but not the answer */
{
  const c = cards.find(x => x.kind === 'term')!;
  const a = questionFor(c, 1), b = questionFor(c, 2);
  if (a && b && a.options.find(o => o.right)?.text !== b.options.find(o => o.right)?.text) problems.push('salt changed the right answer');
}

/* a question must not give its own answer: no significant word of the title survives in the prompt */
{
  const STOP = new Set(['and', 'the', 'with', 'from', 'your', 'for', 'into', 'that', 'this', 'what', 'when', 'how', 'are', 'not', 'one', 'its', 'you', 'who', 'why', 'than', 'over', 'under']);
  let leaks = 0;
  const leaked: string[] = [];
  for (const c of cards) {
    if (c.kind === 'threat') continue;
    const q = questionFor(c, 1);
    if (!q) continue;
    const words = (c.title.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || []).filter(w => !STOP.has(w));
    const p = q.prompt.toLowerCase();
    if (words.some(w => new RegExp('\\b' + w.replace(/(es|s)$/, '') + "[a-z']*\\b").test(p))) { leaks++; if (leaked.length < 3) leaked.push(c.id); }
  }
  if (leaks > 3) problems.push(leaks + ' questions still name their own answer, such as ' + leaked.join(', '));
}

/* ---------- the reducer: UNITIA ---------- */
const base: any = {
  gauges: {}, gaugeSessions: {}, forged: [], runLog: [], completedSims: {}, completedSteps: {}, completedPages: {}, completedChapters: {}, guidesRead: {}, streak: 0,
  study: {}, unitiaC: 0, unitiaDays: {}, goals: [], boards: {},
};
const T0 = Date.UTC(2026, 9, 18, 12);
const day = '2026-10-18', next = '2026-10-19';
const id = cards[0].id;
let st: any = reducer(base, { t: 'study-view', id, at: T0 });
if (st.study[id].views !== 1) problems.push('a view did not count');
if (masteryOf(st.study[id]) !== 'learning') problems.push('a viewed card is not learning: ' + masteryOf(st.study[id]));
st = reducer(st, { t: 'study-time', id, secs: 60, day, at: T0 + 60000 });
if (st.unitiaC !== 60 * UNITIA_C_PER_SECOND) problems.push('60 s did not earn 60 hundredths: ' + st.unitiaC);
if (fmtUnitia(st.unitiaC) !== '0.60') problems.push('60 s does not read 0.60 UNITIA: ' + fmtUnitia(st.unitiaC));
if (st.unitiaDays[day] !== 60) problems.push('the day did not keep the 60 hundredths');
/* a review before five seconds on a fresh card does not pay */
let st2: any = reducer(base, { t: 'study-time', id, secs: 4, day, at: T0 });
st2 = reducer(st2, { t: 'study-grade', id, grade: 2, day, at: T0 });
if (st2.unitiaC !== 4) problems.push('a review after 4 s paid: ' + st2.unitiaC);
/* a review after five seconds pays one UNITIA, once a day */
st = reducer(st, { t: 'study-grade', id, grade: 2, day, at: T0 + 61000 });
if (st.unitiaC !== 60 + UNITIA_C_PER_REVIEW) problems.push('a review did not pay one UNITIA: ' + st.unitiaC);
if (fmtUnitia(st.unitiaC) !== '1.60') problems.push('balance does not read 1.60: ' + fmtUnitia(st.unitiaC));
st = reducer(st, { t: 'study-grade', id, grade: 3, day, at: T0 + 62000 });
if (st.unitiaC !== 160) problems.push('a second review the same day paid again: ' + st.unitiaC);
if (st.study[id].reviews !== 2) problems.push('reviews not counted: ' + st.study[id].reviews);
/* the next day it pays again, after time with the card */
st = reducer(st, { t: 'study-time', id, secs: 10, day: next, at: T0 + 86400000 });
st = reducer(st, { t: 'study-grade', id, grade: 2, day: next, at: T0 + 86400000 + 1000 });
if (st.unitiaC !== 170 + UNITIA_C_PER_REVIEW) problems.push('the next day did not pay the review: ' + st.unitiaC);
if (st.unitiaDays[next] !== 110) problems.push('the next day did not keep its hundredths: ' + st.unitiaDays[next]);
/* the daily cap on one card: 600 s pay, the rest counts as time only */
let st3: any = base;
for (let i = 0; i < 70; i++) st3 = reducer(st3, { t: 'study-time', id, secs: 10, day, at: T0 + i * 10000 });
if (st3.unitiaC !== STUDY_DAILY_CARD_SECONDS) problems.push('the daily cap did not hold: ' + st3.unitiaC + ' hundredths for 700 s');
if (st3.study[id].secs !== 700) problems.push('time past the cap was lost: ' + st3.study[id].secs);
st3 = reducer(st3, { t: 'study-time', id, secs: 10, day: next, at: T0 + 86400000 });
if (st3.unitiaC !== STUDY_DAILY_CARD_SECONDS + 10) problems.push('a new day did not reopen the cap: ' + st3.unitiaC);
/* the quiz grades as a review: right is Good, wrong is Again */
let st4: any = reducer(base, { t: 'study-time', id, secs: 10, day, at: T0 });
st4 = reducer(st4, { t: 'study-quiz', id, right: true, day, at: T0 });
if (st4.study[id].box !== 1 || st4.study[id].quiz?.right !== 1) problems.push('a right quiz did not move the box or count');
if (st4.unitiaC !== 110) problems.push('a right quiz did not pay the review: ' + st4.unitiaC);
st4 = reducer(st4, { t: 'study-quiz', id, right: false, day, at: T0 + 1 });
if (st4.study[id].box !== 0 || st4.study[id].quiz?.wrong !== 1 || st4.study[id].lapses !== 1) problems.push('a wrong quiz did not drop the box, count, and lapse');

/* ---------- Semble Sound, tags, notes ---------- */
let st5: any = reducer(base, { t: 'study-patch', id, patch: { sound: 500 }, at: T0 });
if (st5.study[id].sound !== SOUND_MAX) problems.push('sound did not clamp to +112: ' + st5.study[id].sound);
st5 = reducer(st5, { t: 'study-patch', id, patch: { sound: -500 }, at: T0 + 1 });
if (st5.study[id].sound !== SOUND_MIN) problems.push('sound did not clamp to -112: ' + st5.study[id].sound);
if (st5.study[id].soundLog?.length !== 2) problems.push('the sound log did not keep both ratings');
st5 = reducer(st5, { t: 'study-patch', id, patch: { sound: 0 }, at: T0 + 2 });
if (!isFud(st5.study[id])) problems.push('a rating of 0 is not in the FUD range');
st5 = reducer(st5, { t: 'study-patch', id, patch: { sound: 1 }, at: T0 + 3 });
if (isFud(st5.study[id])) problems.push('a rating of 1 is in the FUD range');
if (isFud(undefined)) problems.push('an unrated card is in the FUD range');
if (!soundWords(-112) || !soundWords(0) || !soundWords(112) || soundWords(-100) === soundWords(100)) problems.push('sound words do not change across the range');
st5 = reducer(st5, { t: 'study-patch', id, patch: { tags: Array.from({ length: 30 }, (_, i) => ' Tag ' + i + ' ' + 'x'.repeat(60)) }, at: T0 + 4 });
if (st5.study[id].tags.length !== 16) problems.push('tags did not cap at 16: ' + st5.study[id].tags.length);
if (st5.study[id].tags.some((t: string) => t.length > 32 || t !== t.trim() || t !== t.toLowerCase())) problems.push('tags were not trimmed, lowered, and cut to 32');
st5 = reducer(st5, { t: 'study-patch', id, patch: { note: 'n'.repeat(7000), ownWords: 'w'.repeat(7000) }, at: T0 + 5 });
if (st5.study[id].note.length !== 6000 || st5.study[id].ownWords.length !== 6000) problems.push('note or own words did not cap at 6000');
st5 = reducer(st5, { t: 'study-patch', id, patch: { favorite: true, diving: true, essential: true }, at: T0 + 6 });
if (!st5.study[id].favorite || !st5.study[id].diving || !st5.study[id].essential) problems.push('marks did not stick');
/* calibration: high sound with a low box is over; low sound with a high box is under */
if (calibrationOf({ ...st5.study[id], sound: 100, quiz: { right: 0, wrong: 3, lastAt: T0 } })?.kind !== 'over') problems.push('rated +100 and answered 0 of 3 is not read as over');
if (calibrationOf({ ...st5.study[id], sound: -80, quiz: { right: 4, wrong: 1, lastAt: T0 } })?.kind !== 'under') problems.push('rated -80 and answered 4 of 5 is not read as under');
if (calibrationOf({ ...st5.study[id], sound: 100, quiz: { right: 1, wrong: 0, lastAt: T0 } })) problems.push('one answer is enough to call calibration');
if (calibrationOf({ ...st5.study[id], sound: 100, quiz: { right: 3, wrong: 0, lastAt: T0 } })) problems.push('rated high and answered right is read as miscalibrated');

/* ---------- the boxes ---------- */
const fresh: any = { secs: 0, unitiaC: 0, firstAt: T0, lastAt: T0, views: 1 };
let c: any = scheduleCard(fresh, 2, T0);
if (c.box !== 1 || c.due !== T0 + 86400000) problems.push('Good from box 0 should be box 1 due tomorrow');
c = scheduleCard(c, 3, T0);
if (c.box !== 3 || c.due !== T0 + 7 * 86400000) problems.push('Strong from box 1 should be box 3 due in 7 days');
c = scheduleCard(c, 1, T0);
if (c.box !== 3 || c.due !== T0 + 3.5 * 86400000) problems.push('Hard keeps the box and halves the wait');
c = scheduleCard(c, 0, T0);
if (c.box !== 0 || c.lapses !== 1 || Math.round((c.due - T0) / 60000) !== 10) problems.push('Again drops to box 0, counts a lapse, and comes back in 10 min');
let top: any = fresh;
for (let i = 0; i < 8; i++) top = scheduleCard(top, 3, T0);
if (top.box !== 5 || top.due !== T0 + 60 * 86400000) problems.push('the top box is 5 with a 60 day wait');
if (masteryOf(top) !== 'mastered') problems.push('box 5 is not held');
if (masteryOf({ ...fresh, box: 2 }) !== 'reviewing') problems.push('box 2 is not reviewing');
if (!isDue({ ...fresh, due: T0 - 1 }, T0) || isDue({ ...fresh, due: T0 + 1 }, T0)) problems.push('due is misread');

/* ---------- the queue, progress, the shelf ---------- */
const q0 = forYou(base, T0, 24);
if (!q0.length) problems.push('an empty record has no queue');
if (q0.some(x => !x.reason.trim())) problems.push('a suggestion has no reason');
if (new Set(q0.map(x => x.id)).size !== q0.length) problems.push('the queue repeats a card');
if (q0.some(x => !cardById(x.id))) problems.push('the queue names a card that does not exist');
if (q0.length > 24) problems.push('the queue ignores its limit');
const dueState: any = { ...base, study: { [id]: { ...fresh, box: 2, due: T0 - 86400000 } } };
const q1 = forYou(dueState, T0, 24);
if (q1[0]?.id !== id || !/due/i.test(q1[0].reason)) problems.push('a due card is not first in the queue');
const pr = progressOf(st, T0 + 86400000 + 2000);
if (pr.total !== cards.length) problems.push('progress total is not the deck');
if (pr.met !== 1) problems.push('progress met is not 1: ' + pr.met);
if (pr.unitiaToday !== 110) problems.push('progress today is not 110 hundredths: ' + pr.unitiaToday);
if (pr.days.length !== 14) problems.push('progress does not show 14 days');
if (pr.streak !== 2) problems.push('two days of earning is not a streak of 2: ' + pr.streak);
if (!heldCards({ ...base, study: { [id]: { ...fresh, sound: 56 } } }).has(id)) problems.push('a card rated 56 is not held');
if (heldCards({ ...base, study: { [id]: { ...fresh, sound: 55 } } }).has(id)) problems.push('a card rated 55 is held');
/* a bridge from held cards to a target through the graph */
const hub = [...cards].sort((a, b) => degree(b.id) - degree(a.id))[0];
const nb = neighbours(hub.id);
if (nb.length) {
  const far = nb[0];
  const path = pathTo(far, new Set([hub.id]));
  if (!path || path[0] !== hub.id || path[path.length - 1] !== far) problems.push('no bridge from a hub to its neighbour');
  if (pathTo(hub.id, new Set([hub.id]))?.length !== 1) problems.push('a held target is not its own path');
}

/* ---------- words and the field ---------- */
if (fmtUnitia(1) !== '0.01' || fmtUnitia(100) !== '1.00' || fmtUnitia(12345) !== '123.45') problems.push('fmtUnitia');
if (fmtTime(59) !== '59 s' || fmtTime(61) !== '1 min 01 s' || !/^1 h /.test(fmtTime(3660))) problems.push('fmtTime: ' + fmtTime(61));
if (dayKey(new Date(2026, 0, 5)) !== '2026-01-05') problems.push('dayKey');
if (signalQuery('Zero Trust (ZTA): the long tail of a title that runs on') !== 'Zero Trust') problems.push('signalQuery: ' + signalQuery('Zero Trust (ZTA): the long tail of a title that runs on'));
const trend = researchTrend({ query: 'x', at: 0, research: { years: [{ year: 2024, count: 100 }, { year: 2025, count: 150 }] } } as any, new Date(Date.UTC(2026, 5, 1)));
if (trend !== 0.5) problems.push('researchTrend: ' + trend);

/* ---------- sessions from any page ---------- */
{
  const ses = newSession(['term:a', 'term:a', 'nocolon', 'model:b', ...Array.from({ length: 300 }, (_, i) => 'step:' + i)], 'x'.repeat(200), 123, T0, true);
  if (ses.ids.length !== SESSION_CAP) problems.push('a session is not capped at ' + SESSION_CAP + ': ' + ses.ids.length);
  if (ses.ids[0] !== 'term:a' || ses.ids[1] !== 'model:b') problems.push('a session does not keep order or drop ids that are not cards');
  if (new Set(ses.ids).size !== ses.ids.length) problems.push('a session repeats an id');
  if (ses.label.length !== 80 || ses.startC !== 123 || ses.at !== T0 || !ses.expand) problems.push('a session does not keep its label, balance, start and expand flag');
  let tl = ses.tally;
  tl = applyEvent(tl, { kind: 'grade', id: 'term:a', grade: 0 });
  tl = applyEvent(tl, { kind: 'grade', id: 'term:a', grade: 0 });
  tl = applyEvent(tl, { kind: 'grade', id: 'model:b', grade: 3 });
  tl = applyEvent(tl, { kind: 'quiz', right: true });
  tl = applyEvent(tl, { kind: 'quiz', right: false });
  tl = applyEvent(tl, { kind: 'rate' });
  if (tl.graded !== 3 || tl.again.length !== 1 || tl.again[0] !== 'term:a' || tl.right !== 1 || tl.wrong !== 1 || tl.rated !== 1) problems.push('the tally is wrong: ' + JSON.stringify(tl));
  tl = applyEvent(tl, { kind: 'grade', id: 'term:a', grade: 2 });
  if (tl.again.length !== 0) problems.push('a Good grade did not clear the card from Again');
  const study = { 'term:x': { due: T0 - 5 }, 'term:y': { due: T0 - 50 }, 'term:z': { due: T0 + 5 }, 'term:w': {} };
  const due = dueIds(study, T0);
  if (due.join(',') !== 'term:y,term:x') problems.push('dueIds order or filter: ' + due.join(','));
  const fud = fudIds({ 'term:a': { sound: -10 }, 'term:b': { sound: -80 }, 'term:c': { sound: 1 }, 'term:d': {} });
  if (fud.join(',') !== 'term:b,term:a') problems.push('fudIds order or filter: ' + fud.join(','));
}

/* ---------- the awards, their hooks and the counters behind them ---------- */
{
  const ids = new Set(AWARDS.map(a => a.id));
  const studyAwards = AWARDS.filter(a => a.domain === 'StudyMode');
  if (studyAwards.length < 8) problems.push('fewer than eight StudyMode awards: ' + studyAwards.length);
  for (const a of studyAwards) if (!a.research || a.research.length < 120) problems.push('thin research on ' + a.id);
  const studyHooks = HOOKS.filter(h => ['cards-met', 'cards-held', 'own-words', 'fud-cleared', 'study-kinds', 'unitia', 'exams-taken', 'exam-perfect'].includes(h.trigger));
  const hooked = new Set(studyHooks.flatMap(h => h.awards));
  for (const a of studyAwards) if (!hooked.has(a.id)) problems.push('StudyMode award without a hook: ' + a.id);
  for (const h of studyHooks) for (const a of h.awards) if (!ids.has(a)) problems.push('study hook names a missing award: ' + a);
  try {
    const { counters } = await import('./src/lib/engine');
    const rec: any = {
      ...base, projects: [], attestations: [], perfectDrills: {}, recoveredDrills: {}, flawlessSims: {}, unitMembers: [], reviewsCleared: 0, watchesKept: 0, mode: 'praxis', wallet: null, sevaEvolved: false,
      unitiaC: 250,
      study: {
        'term:a': { views: 1, box: 4, ownWords: 'mine', soundLog: [{ at: 1, v: -20 }, { at: 2, v: 60 }] },
        'model:b': { views: 1, box: 5, soundLog: [{ at: 1, v: 60 }, { at: 2, v: -20 }] },
        'threat:c': { reviews: 1, box: 1, ownWords: '   ' },
        'guide:d': {},
      },
    };
    const c = counters(rec, 1);
    const want: Record<string, number> = { 'cards-met': 3, 'cards-held': 2, 'own-words': 1, 'fud-cleared': 1, 'study-kinds': 3, 'unitia': 2 };
    for (const [k, v] of Object.entries(want)) if (c[k] !== v) problems.push('counter ' + k + ': want ' + v + ' got ' + c[k]);
    for (const h of studyHooks) if (c[h.trigger] === undefined) problems.push('hook trigger has no counter: ' + h.trigger);
    const c0 = counters({ ...base, projects: [], attestations: [], perfectDrills: {}, recoveredDrills: {}, flawlessSims: {}, unitMembers: [], reviewsCleared: 0, watchesKept: 0, mode: 'praxis', wallet: null, sevaEvolved: false, study: {}, unitiaC: 0 } as any, 1);
    if (c0['cards-held'] !== 0 || c0['unitia'] !== 0 || c0['study-kinds'] !== 0) problems.push('an empty study record counts something');
  } catch (e) { problems.push('could not read the counters: ' + (e instanceof Error ? e.message : String(e))); }
}

/* ---------- goals and insights read the study record ---------- */
{
  const kinds = GOAL_KINDS.map(k => k.key);
  if (!kinds.includes('cards') || !kinds.includes('unitia')) problems.push('goal kinds for StudyMode are missing');
  const rec: any = { ...base, unitiaC: 1234, study: { 'term:a': { views: 1, box: 4 }, 'term:b': { views: 1, box: 3 } } };
  const sr = serviceRecord(rec, T0);
  if (goalProgress(rec, sr, 'cards') !== 1) problems.push('cards goal reads ' + goalProgress(rec, sr, 'cards'));
  if (goalProgress(rec, sr, 'unitia') !== 12) problems.push('unitia goal reads ' + goalProgress(rec, sr, 'unitia'));
  const dueRec: any = { ...base, goals: [], study: Object.fromEntries(Array.from({ length: 6 }, (_, i) => ['term:' + i, { views: 1, due: T0 - 1 }])) };
  const ins = insights(dueRec, T0);
  if (!ins.some(x => x.key === 'study-due')) problems.push('six due cards do not raise the review insight: ' + ins.map(x => x.key).join(','));
  const fudRec: any = { ...base, goals: [], study: Object.fromEntries(Array.from({ length: 3 }, (_, i) => ['term:' + i, { views: 1, sound: -40 }])) };
  const ins2 = insights(fudRec, T0);
  if (!ins2.some(x => x.key === 'study-fud')) problems.push('three FUD cards do not raise the FUD insight: ' + ins2.map(x => x.key).join(','));
  if (insights({ ...base, goals: [], study: {} } as any, T0).some(x => x.key.startsWith('study'))) problems.push('an empty study record raises a study insight');
}

/* ---------- the test: a seeded draw, the same for everyone; the record keeps thirty ---------- */
{
  const { drawExam, examQuestion, newExam, scoreExam, resultLine } = await import('./src/lib/study/exam');
  const pool = cards.filter(c => c.kind === 'term').slice(0, 120).map(c => c.id);
  const a = drawExam(pool, 20, 4242), b = drawExam(pool, 20, 4242), c2 = drawExam(pool, 20, 777);
  if (a.length !== 20) problems.push('a draw of 20 from 120 terms gave ' + a.length);
  if (a.join() !== b.join()) problems.push('the same seed drew different cards');
  if (a.join() === c2.join()) problems.push('a different seed drew the same cards in the same order');
  if (new Set(a).size !== a.length) problems.push('a draw repeats a card');
  if (a.some(id => !pool.includes(id))) problems.push('a draw left its pool');
  const q1 = examQuestion({ ids: a, seed: 4242 }, 3), q2 = examQuestion({ ids: a, seed: 4242 }, 3);
  if (!q1 || !q2 || JSON.stringify(q1) !== JSON.stringify(q2)) problems.push('the same test gave a different question');
  const spec = newExam('Probe test', pool, 10, 99);
  if (spec.ids.length !== 10 || spec.picks.length !== 10 || spec.picks.some(x => x !== null)) problems.push('a new test is not ten blank questions');
  /* answer every question right, then score */
  const right = { ...spec, picks: spec.ids.map((_, i) => examQuestion(spec, i)!.options.findIndex(o => o.right)), secs: 125, done: true };
  const sc = scoreExam(right);
  if (sc.right !== 10 || sc.misses.length !== 0 || sc.answered !== 10) problems.push('an all right test does not score 10 of 10: ' + JSON.stringify({ r: sc.right, m: sc.misses.length }));
  const wrong = { ...spec, picks: spec.ids.map((_, i) => examQuestion(spec, i)!.options.findIndex(o => !o.right)), done: true };
  if (scoreExam(wrong).right !== 0 || scoreExam(wrong).misses.length !== 10) problems.push('an all wrong test does not score 0');
  const blank = { ...spec, done: true };
  if (scoreExam(blank).answered !== 0 || scoreExam(blank).misses.some(m => m.picked !== null)) problems.push('a blank test counts answers');
  if (!/10 of 10 \(100%\) in 2 minutes/.test(resultLine(right, sc))) problems.push('the result line reads: ' + resultLine(right, sc));
  /* a shared test with its own ids keeps their order */
  const shared = newExam('Shared', [], 0, 4242, a.slice(0, 5), 'Teacher');
  if (shared.ids.join() !== a.slice(0, 5).join() || shared.by !== 'Teacher') problems.push('a shared test did not keep its ids, order or sender');
  /* the record */
  let st6: any = { ...base, exams: [] };
  for (let i = 0; i < 35; i++) st6 = reducer(st6, { t: 'exam-done', result: { label: 'T' + i, n: 20, right: i % 21, secs: 60, at: i } });
  if (st6.exams.length !== 30) problems.push('the record does not cap tests at thirty: ' + st6.exams.length);
  st6 = reducer(st6, { t: 'exam-done', result: { label: 'x'.repeat(200), n: 500, right: 900, secs: -4, at: 1 } });
  const last = st6.exams[st6.exams.length - 1];
  if (last.n !== 60 || last.right !== 60 || last.secs !== 0 || last.label.length !== 80) problems.push('a hostile test result was not clamped: ' + JSON.stringify(last));
  if (reducer({ ...base, exams: [] } as any, { t: 'exam-done', result: { label: 'empty', n: 0, right: 0, secs: 0, at: 1 } }).exams.length !== 0) problems.push('a test of zero questions was kept');
  try {
    const { counters } = await import('./src/lib/engine');
    const rec: any = { ...base, projects: [], attestations: [], perfectDrills: {}, recoveredDrills: {}, flawlessSims: {}, unitMembers: [], reviewsCleared: 0, watchesKept: 0, mode: 'praxis', wallet: null, sevaEvolved: false,
      exams: [{ label: 'a', n: 20, right: 20, secs: 1, at: 1 }, { label: 'b', n: 10, right: 10, secs: 1, at: 2 }, { label: 'c', n: 20, right: 19, secs: 1, at: 3 }] };
    const cc = counters(rec, 1);
    if (cc['exams-taken'] !== 3 || cc['exam-perfect'] !== 1) problems.push('the test counters read ' + cc['exams-taken'] + ' and ' + cc['exam-perfect']);
  } catch (e) { problems.push('could not read the test counters: ' + (e instanceof Error ? e.message : String(e))); }
  for (const id of ['small-study-first-test', 'strong-study-perfect-test']) if (!AWARDS.some(x => x.id === id)) problems.push('award missing: ' + id);
}

/* ---------- a set in a link: round trip, and a hostile one comes back clamped ---------- */
{
  const { encodeSet, decodeSet, cleanSet } = await import('./src/lib/share');
  const set = { label: 'Identity week', ids: ['model:mm-identity-phishing-resistant-auth', 'term:breaker', 'threat:pr-push-bombing'], mode: 'study' as const, by: 'August' };
  const back = await decodeSet(await encodeSet(set));
  if (!back || back.label !== set.label || back.ids.join() !== set.ids.join() || back.mode !== 'study' || back.by !== 'August') problems.push('a set did not survive its own link: ' + JSON.stringify(back));
  const exam = await decodeSet(await encodeSet({ label: 'T', ids: set.ids, mode: 'exam', seed: 4242 }));
  if (!exam || exam.mode !== 'exam' || exam.seed !== 4242) problems.push('a test link lost its mode or seed');
  const hostile = cleanSet({ label: '<script>alert(1)</script>' + 'x'.repeat(300), ids: ['term:a', 'term:a', 'javascript:alert(1)', 'nope', 42, 'model:' + 'z'.repeat(300), ...Array.from({ length: 400 }, (_, i) => 'step:s' + i)], mode: 'exam', seed: -12.7, by: 'B'.repeat(90) });
  if (!hostile) problems.push('a hostile set with valid ids was dropped');
  else {
    if (/[<>]/.test(hostile.label) || hostile.label.length > 80) problems.push('a set label was not cleaned: ' + hostile.label.slice(0, 40));
    if (hostile.ids.includes('javascript:alert(1)') || hostile.ids.includes('nope') || hostile.ids.some(i => i.length > 140)) problems.push('a set kept an id that is not a card id');
    if (hostile.ids.length > 60) problems.push('a test link kept more than sixty questions: ' + hostile.ids.length);
    if (hostile.ids.filter(i => i === 'term:a').length !== 1) problems.push('a set kept a repeated id');
    if (!Number.isInteger(hostile.seed) || (hostile.seed as number) < 0) problems.push('a hostile seed was not made whole and positive: ' + hostile.seed);
    if ((hostile.by || '').length > 40) problems.push('a sender name was not cut to forty');
  }
  if (cleanSet({ label: 'empty', ids: ['nope'] }) !== null) problems.push('a set with no card ids was accepted');
  if (await decodeSet('zNOTBASE64!!') !== null) problems.push('a broken set link decoded to something');
}

/* ---------- every sg- class the components use has a rule ---------- */
const css = readFileSync('src/styles/study.css', 'utf8');
const ruleClasses = new Set([...css.matchAll(/\.(sg-[a-z0-9-]+|mk|chip|m-[a-z]+|k-[a-z]+|fud|sound|on|off|flipped|front|back|good|again|over|under|right|wrong|dim|static|compact|unset|dive|ess|fav|met|held|label|sec|btn|hit|dot|halo|faint|g[0-3])\b/g)].map(m => m[1]));
const fieldCss = readFileSync('src/styles/field.css', 'utf8');
if (!fieldCss.includes('.watch-study')) problems.push('no rule for the watch strip');
const files = ['src/views/StudyView.tsx', 'src/components/study/StudyCardView.tsx', 'src/components/study/parts.tsx', 'src/components/study/Atlas.tsx', 'src/components/study/Exam.tsx'];
const used = new Set<string>();
for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(/\bsg-[a-z0-9-]+/g)) used.add(m[0]);
for (const u of used) if (!ruleClasses.has(u) && !css.includes(u)) problems.push('no rule for class ' + u);
/* the card grows with its content: both faces share one grid cell, neither is absolutely positioned */
const faceRule = css.match(/\.sg-face \{[^}]*\}/)?.[0] || '';
if (/position:\s*absolute/.test(faceRule)) problems.push('the card face is absolutely positioned; a long answer would clip');
if (!/grid-area/.test(faceRule)) problems.push('the card faces must share one grid cell so the card grows with its content');
const disp = readFileSync('src/styles/display.css', 'utf8');
if (!disp.includes("data-text='large'") || !disp.includes("data-motion='calm'")) problems.push('display.css lacks the text size or calm motion rules');
/* the sheet is imported */
if (!readFileSync('src/main.tsx', 'utf8').includes("styles/study.css")) problems.push('study.css is not imported');
/* no stray compiled copies */
const strays: string[] = [];
const walk = (d: string) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.js$/.test(e.name)) strays.push(p); } };
walk('src');
if (strays.length) problems.push('compiled copies in src: ' + strays.join(', '));

console.log('deck: ' + cards.length + ' cards | ' + kinds.map(k => k + ' ' + (byKind[k] || 0)).join(', '));
console.log('joined: ' + joined + '/' + cards.length + ' | questions: ' + asked + ' asked, ' + noQuestion + ' without');
console.log('queue on an empty record: ' + q0.length + ' | first: ' + q0[0]?.id + ' (' + q0[0]?.reason + ')');
console.log('UNITIA: 60 s -> ' + fmtUnitia(60) + ' | review -> ' + fmtUnitia(UNITIA_C_PER_REVIEW) + ' | cap ' + STUDY_DAILY_CARD_SECONDS + ' s/card/day | review after ' + STUDY_REVIEW_MIN_SECONDS + ' s');
console.log('sg- classes used: ' + used.size + ' | css rules: ' + ruleClasses.size);
console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems.slice(0, 40)) console.log('  ' + p);
process.exitCode = problems.length ? 1 : 0;
