/* A room left part way, held to its word (lib/roomProgress.ts). A saved place is offered only if it fits the room
   as it is written today: the inject exists, every decision before it has an answer in order, and each answer's
   score is the score its option carries. A place that was edited by hand, that names an option the room no longer
   has, or that is thirty days old is not offered. One room's place does not touch another's, erasing the record
   drops them all, and every room has a first decision to take by itself. The history module keeps a sub that names
   a place and drops one that asks for something once.
   Run: npx tsx probe-room.mts */
(globalThis as any).self = globalThis;
const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
};
const { FULL } = await import('./src/content/full');
const R = await import('./src/lib/roomProgress');
import { readFileSync } from 'node:fs';

const problems: string[] = [];
const ok = (c: boolean, m: string) => { if (!c) problems.push(m); };
const KEY = 'stepsafe-room-v1';
const DAY = 24 * 60 * 60 * 1000;
const sims = FULL.sims as any[];
const sim = sims[0];
const NOW = 1_800_000_000_000;

/* play a room to an inject, always taking the first option */
function play(m: any, cursor: number, answerLast = true) {
  const scores: number[] = [], bests: boolean[] = [], trail: { injectId: string; chosenId: string; score: number }[] = [];
  m.injects.slice(0, cursor + 1).forEach((inj: any, i: number) => {
    if (!inj.decision || (i === cursor && !answerLast)) return;
    const o = inj.decision.options[0];
    scores.push(o.score); bests.push(!!o.isBest); trail.push({ injectId: inj.id, chosenId: o.id, score: o.score });
  });
  return { cursor, scores, bests, trail };
}
const firstCall = sim.injects.findIndex((i: any) => i.decision);
const secondCall = sim.injects.findIndex((i: any, k: number) => k > firstCall && i.decision);
ok(firstCall >= 0 && secondCall > firstCall, 'the first room has two decisions to test with');

/* nothing saved; nothing to offer */
ok(R.roomProgress(sim, NOW) === null, 'a room never entered has no saved place');
ok(R.roomsKept(NOW).length === 0, 'and Ground hears of none');

/* a place is saved and read back whole */
const mid = play(sim, secondCall);
ok(R.saveRoom(sim.id, mid, NOW) === true, 'a save says it held');
const setItem = (globalThis as any).localStorage.setItem;
(globalThis as any).localStorage.setItem = () => { throw new Error('blocked'); };
ok(R.saveRoom(sim.id, mid, NOW) === false, 'and says so when the browser refuses to keep it');
(globalThis as any).localStorage.setItem = setItem;
const back = R.roomProgress(sim, NOW + 5 * DAY);
ok(!!back && back.cursor === secondCall && JSON.stringify(back.trail) === JSON.stringify(mid.trail) && JSON.stringify(back.scores) === JSON.stringify(mid.scores), 'a saved place reads back whole');
ok(R.roomsKept(NOW)[0]?.id === sim.id && R.roomsKept(NOW)[0]?.cursor === secondCall, 'Ground hears which room and where');
/* on the inject of a decision not yet answered */
R.saveRoom(sim.id, play(sim, secondCall, false), NOW);
ok(R.roomProgress(sim, NOW)?.trail.length === mid.trail.length - 1, 'a place on a decision not yet answered is kept');

/* thirty days */
R.saveRoom(sim.id, mid, NOW);
ok(R.roomProgress(sim, NOW + 29 * DAY) !== null, 'a place 29 days old is offered');
ok(R.roomProgress(sim, NOW + 31 * DAY) === null, 'a place 31 days old is not');
ok(R.roomsKept(NOW + 31 * DAY).length === 0, 'and Ground no longer hears of it');

/* places that do not fit the room are refused */
const put = (p: any) => store.set(KEY, JSON.stringify({ [sim.id]: { ...p, at: NOW } }));
const refuse = (p: any, why: string) => { put(p); ok(R.roomProgress(sim, NOW) === null, 'refused: ' + why); };
refuse({ ...mid, cursor: sim.injects.length }, 'an inject past the end of the room');
refuse({ ...mid, cursor: -1 }, 'a negative inject');
refuse({ ...mid, cursor: 1.5 }, 'a fractional inject');
refuse({ ...mid, scores: mid.scores.map(() => 3) }, 'scores raised by hand');
refuse({ ...mid, bests: mid.bests.map(() => true) }, 'every answer marked the strongest by hand');
refuse({ ...mid, trail: mid.trail.map(t => ({ ...t, chosenId: 'no-such-option' })) }, 'an option the room does not have');
refuse({ ...mid, trail: mid.trail.map(t => ({ ...t, score: t.score + 1 })) }, 'a trail score that is not the option score');
refuse({ ...mid, trail: mid.trail.slice(0, -2), scores: mid.scores.slice(0, -2), bests: mid.bests.slice(0, -2) }, 'a decision before this inject left unanswered');
refuse({ ...mid, trail: [...mid.trail].reverse(), scores: [...mid.scores].reverse(), bests: [...mid.bests].reverse() }, 'answers out of order');
refuse({ ...mid, scores: mid.scores.slice(1) }, 'scores and trail of different lengths');
refuse({ cursor: 0, scores: [], bests: [], trail: [] }, 'a room where nothing has happened');
refuse({ ...mid, trail: 'x' }, 'a trail that is not a list');
store.set(KEY, 'not json');
ok(R.roomProgress(sim, NOW) === null && R.roomsKept(NOW).length === 0, 'a broken store reads as empty');
store.set(KEY, '[]');
ok(R.roomProgress(sim, NOW) === null, 'a store of the wrong shape reads as empty');

/* rooms are kept apart; clearing one leaves the other; erasing the record drops all */
store.delete(KEY);
const other = sims[1];
const otherCall = other.injects.findIndex((i: any) => i.decision);
R.saveRoom(sim.id, mid, NOW);
R.saveRoom(other.id, play(other, otherCall), NOW + 1000);
ok(R.roomsKept(NOW + 2000).map(k => k.id).join() === [other.id, sim.id].join(), 'two rooms are kept, newest first');
ok(R.roomProgress(other, NOW)?.cursor === otherCall && R.roomProgress(sim, NOW)?.cursor === secondCall, 'each reads its own place');
R.clearRoom(other.id);
ok(R.roomProgress(other, NOW) === null && R.roomProgress(sim, NOW) !== null, 'clearing one leaves the other');
/* saving sweeps out what is too old */
R.saveRoom(other.id, play(other, otherCall), NOW + 40 * DAY);
ok(!JSON.parse(store.get(KEY)!)[sim.id], 'a save sweeps out a place past thirty days');
R.clearRooms();
ok(!store.has(KEY), 'erasing the record leaves no key behind');

/* the run before: only the choices are kept, and the numbers are worked out from the room */
const LASTKEY = 'stepsafe-room-last-v1';
ok(R.roomLastRun(sim) === null, 'a room never finished has no run before');
const whole = play(sim, sim.injects.length - 1);
R.saveLastRun(sim.id, whole.trail, NOW);
const run = R.roomLastRun(sim);
const sum = whole.scores.reduce((a, b) => a + b, 0), cleanN = whole.bests.filter(Boolean).length;
ok(!!run && run.score === sum && run.clean === cleanN && Object.keys(run.picks).length === whole.trail.length && run.at === NOW, 'a finished run reads back with its score and clean count (' + sum + ', ' + cleanN + ')');
const kept = JSON.parse(store.get(LASTKEY)!)[sim.id];
ok(Object.keys(kept).sort().join() === 'at,picks', 'only the choices and the day are kept: ' + Object.keys(kept).sort().join());
store.set(LASTKEY, JSON.stringify({ [sim.id]: { picks: { ...kept.picks, [whole.trail[0].injectId]: 'no-such-option' }, at: NOW, score: 99, clean: 99 } }));
ok(R.roomLastRun(sim) === null, 'a run that names a choice the room does not have is not shown');
store.set(LASTKEY, JSON.stringify({ [sim.id]: { picks: kept.picks, at: NOW, score: 99, clean: 99 } }));
ok(R.roomLastRun(sim)?.score === sum && R.roomLastRun(sim)?.clean === cleanN, 'numbers written by hand are ignored: the score comes from the room');
const partial = { ...kept.picks }; delete partial[whole.trail[whole.trail.length - 1].injectId];
store.set(LASTKEY, JSON.stringify({ [sim.id]: { picks: partial, at: NOW } }));
ok(R.roomLastRun(sim) === null, 'a run with a decision missing is not shown');
store.set(LASTKEY, 'not json');
ok(R.roomLastRun(sim) === null, 'a broken store of runs reads as empty');
R.saveLastRun(sim.id, whole.trail, NOW);
R.clearRooms();
ok(!store.has(LASTKEY) && R.roomLastRun(sim) === null, 'erasing the record drops the runs too');

/* every room: a first decision to take by itself, and every place along it can be saved and read back */
let places = 0;
for (const m of sims) {
  const k = m.injects.findIndex((i: any) => i.decision);
  ok(k >= 0, m.id + ' has a decision to take by itself');
  ok(k >= 0 && k <= 6, m.id + ': its first decision comes within seven injects (inject ' + (k + 1) + ')');
  for (let c = 1; c < m.injects.length; c++) {
    R.saveRoom(m.id, play(m, c), NOW);
    const b = R.roomProgress(m, NOW);
    if (!b || b.cursor !== c) { ok(false, m.id + ': the place at inject ' + (c + 1) + ' does not read back'); break; }
    places++;
  }
  R.clearRoom(m.id);
}

/* the history module: which subs are places */
const hist = readFileSync('src/lib/history.ts', 'utf8');
ok(/r\.view === 'modux' \|\| r\.view === 'guides' \|\| r\.view === 'sim' \|\| r\.view === 'read' \|\| \(r\.view === 'study' && sub !== 'close'\)/.test(hist), 'history keeps the subs that name a place (modux, guides, sim, a reading’s network, study but not its close)');
ok(!/location\.(hash|search|pathname|href)\s*=[^=]/.test(hist) && !/location\.(assign|replace)\(/.test(hist), 'history never sends the browser anywhere: it only names the entry it is on');
ok(hist.includes("location.pathname + location.search + (a ? '#' + a"), 'an address is only ever the part after the #, which a browser does not send to a server');

/* addresses: every place the curriculum has reads back from its own address, and nothing else is let in */
(globalThis as any).location = { hash: '', pathname: '/', search: '', origin: 'https://example.test' };
const H = await import('./src/lib/history');
const MXA = await import('./src/content/modux/index');
const { GAUGES } = await import('./src/content/modux/gauges');
const sameRoute = (a: any, b: any) => !!a && !!b && a.view === b.view && (a.id || '') === (b.id || '') && (a.sub || '') === (b.sub || '');
const named: any[] = [];
const chaptersAll = [...FULL.chapters, ...(MXA.MODUX_CHAPTERS || []), ...((FULL as any).outlier ? [(FULL as any).outlier] : [])];
for (const c of chaptersAll) { named.push({ view: 'chapter', id: c.id }); for (const pg of c.pages) for (const st of pg.steps) named.push({ view: 'step', id: st.id }); }
for (const m of sims) { named.push({ view: 'sim', id: m.id }); named.push({ view: 'sim', id: m.id, sub: 'one' }); const dn = m.injects.filter((i: any) => i.decision).length; for (let n = 2; n <= dn; n++) named.push({ view: 'sim', id: m.id, sub: 'one-' + n }); }
for (const g of FULL.guides) named.push({ view: 'guides', id: g.id });
for (const m of MXA.MODUX_MODELS) named.push({ view: 'modux-model', id: m.id });
for (const k of MXA.MODUX_STACKS) named.push({ view: 'modux-stack', id: k.id });
for (const g of GAUGES) named.push({ view: 'modux-gauge', id: g.id });
for (const t of ['systems', 'models', 'motrus', 'stacks', 'courses', 'web']) named.push({ view: 'modux', sub: t });
for (const t of ['deck', 'test', 'atlas', 'shelf', 'progress']) named.push({ view: 'study', sub: t });
for (const v of ['chapters', 'practice', 'steps', 'unit', 'profile', 'next', 'seva', 'settings', 'check', 'guides', 'study', 'modux']) named.push({ view: v });
named.push({ view: 'guides', sub: 'stock-and-flow' }, { view: 'modux', sub: 'systems', id: 'sys:google' });
const lostPlaces = named.filter(r => !sameRoute(H.routeOf('#' + H.addressOf(r)), r));
ok(lostPlaces.length === 0, 'every place reads back from its own address: ' + (named.length - lostPlaces.length) + ' of ' + named.length + (lostPlaces.length ? ' (lost ' + lostPlaces.slice(0, 3).map(r => JSON.stringify(r)).join(' ') + ')' : ''));
ok(H.addressOf({ view: 'home' }) === '' && H.routeOf('') === null && H.routeOf('#') === null, 'Ground has no address of its own');
ok(H.addressOf({ view: 'sim', id: sim.id, sub: 'resume' }) === '/room/' + sim.id && H.addressOf({ view: 'modux-gauge', id: GAUGES[0].id, sub: 'world' }) === '/gauge/' + GAUGES[0].id && H.addressOf({ view: 'seva', sub: 'ask:what next' }) === '/seva', 'what is asked for once (Continue, a world, a question) is not written into an address');
for (const bad of ['#g=abc123', '#p=abc', '#/nope', '#/room', '#/room/a/b', '#/room/a/one/more', '#/room/..%2Fx', '#/room/<script>', '#/chapter/' + 'x'.repeat(200), '#/models/nope', '#/study/close', '#/Chapter/x', '#/room/a b', '#/room/a/one-0', '#/room/a/one-1', '#/room/a/one-100', '#/room/a/one-x', '#/room/a/two'])
  ok(H.routeOf(bad) === null, 'this must be refused as an address: ' + bad.slice(0, 40));
ok(H.linkTo({ view: 'sim', id: sim.id }) === 'https://example.test/#/room/' + sim.id && H.linkTo({ view: 'home' }) === 'https://example.test/', 'a link to a place is the site and the address after its #');

/* one decision at a time: every decision of every room, a different room each time */
const O = await import('./src/lib/oneDecision');
const allCalls = O.oneCalls(sims);
const decisions = sims.reduce((n: number, m: any) => n + m.injects.filter((i: any) => i.decision).length, 0);
ok(allCalls.length === decisions && new Set(allCalls.map((c: any) => c.simId + '#' + c.n)).size === decisions, 'every decision of every room can be taken by itself, once each: ' + allCalls.length + ' of ' + decisions);
ok(new Set(allCalls.slice(0, sims.length).map((c: any) => c.simId)).size === sims.length && allCalls.slice(0, sims.length).every((c: any) => c.n === 1), 'the first ' + sims.length + ' are the first call of each room');
const sameRoomTwice = allCalls.filter((c: any, i: number) => i > 0 && allCalls[i - 1].simId === c.simId).length;
ok(sameRoomTwice <= 2, 'the order changes room nearly every time (' + sameRoomTwice + ' times it cannot: the longest rooms outlast the rest)');
for (const c of allCalls) {
  const m = sims.find((x: any) => x.id === c.simId);
  const dn = m.injects.filter((i: any) => i.decision).length;
  if (c.n < 1 || c.n > dn) ok(false, 'a call names a decision its room does not have: ' + c.simId + ' ' + c.n);
  if (!sameRoute(H.routeOf('#' + H.addressOf({ view: 'sim', id: c.simId, sub: O.subOfCall(c.n) })), { view: 'sim', id: c.simId, sub: O.subOfCall(c.n) })) ok(false, 'a call does not read back from its address: ' + c.simId + ' ' + c.n);
}
const lastCall = allCalls[allCalls.length - 1];
ok(O.nextCall(sims, lastCall.simId, lastCall.n)?.simId === allCalls[0].simId && O.nextCall(sims, allCalls[0].simId, 1)?.simId === allCalls[1].simId, 'the call after the last is the first');
/* a room says how many decisions it has, and how long each takes, before its text has loaded */
const bare = sims.map((m: any) => ({ ...m, injects: [] }));
const mins = sims.flatMap((m: any) => m.calls || []);
ok(sims.every((m: any) => Array.isArray(m.calls) && m.calls.length === m.injects.filter((i: any) => i.decision).length) && mins.length === decisions && mins.every((x: number) => Number.isInteger(x) && x >= 2 && x <= 12), 'every room carries the minutes of each of its decisions: ' + mins.length + ' of ' + decisions + ', from ' + Math.min(...mins) + ' to ' + Math.max(...mins));
ok(sims.every((m: any) => JSON.stringify(O.callMinutes(m)) === JSON.stringify(m.calls)), 'and they are the minutes the room gives as it is written');
ok(JSON.stringify(O.oneCalls(bare)) === JSON.stringify(allCalls) && bare.every((m: any, i: number) => O.callCount(m) === O.callCount(sims[i])), 'the order reads the same from the outline, before the rooms have loaded');
const { OUTLINE } = await import('./src/content/outline.gen');
ok(JSON.stringify(O.oneCalls(OUTLINE.sims)) === JSON.stringify(allCalls), 'and the outline the app starts from gives that order');
ok(sims.every((m: any) => m.injectCount === m.injects.length) && OUTLINE.sims.every((m: any, i: number) => m.injects.length === 0 && m.injectCount === sims[i].injects.length), 'every room carries its count of injects, and the outline keeps it with the text left out');

/* the place among the single decisions is kept, and moves on only when the decision on offer is taken */
const sameCall = (a: any, b: any) => !!a && !!b && a.simId === b.simId && a.n === b.n;
R.clearRooms();
ok(sameCall(R.onePlace(sims), allCalls[0]), 'the first decision is offered to begin with');
R.tookOne(sims, allCalls[5].simId, allCalls[5].n);
ok(sameCall(R.onePlace(sims), allCalls[0]), 'a decision taken from its link leaves the offer where it was');
R.tookOne(sims, allCalls[0].simId, allCalls[0].n);
ok(sameCall(R.onePlace(sims), allCalls[1]) && sameCall(R.onePlace(bare), allCalls[1]) && allCalls[1].simId !== allCalls[0].simId, 'taking the one on offer moves the offer to the next, in another room');
R.tookOne(sims, allCalls[0].simId, allCalls[0].n);
ok(sameCall(R.onePlace(sims), allCalls[1]), 'taking the same decision again does not move it twice');
for (let i = 1; i < allCalls.length; i++) R.tookOne(sims, allCalls[i].simId, allCalls[i].n);
ok(sameCall(R.onePlace(sims), allCalls[0]), 'after the last decision the first is offered again');
(globalThis as any).localStorage.setItem('stepsafe-one-v1', JSON.stringify({ simId: 'no-such-room', n: 2 }));
ok(sameCall(R.onePlace(sims), allCalls[0]), 'a kept place the rooms no longer have gives the first');
(globalThis as any).localStorage.setItem('stepsafe-one-v1', '{broken');
ok(sameCall(R.onePlace(sims), allCalls[0]), 'and so does one that cannot be read');
R.tookOne(sims, allCalls[0].simId, allCalls[0].n);
ok((globalThis as any).localStorage.getItem('stepsafe-one-v1') !== null, 'the place is written to the device');
R.clearRooms();
ok(sameCall(R.onePlace(sims), allCalls[0]) && (globalThis as any).localStorage.getItem('stepsafe-one-v1') === null, 'erasing the record forgets the place');
ok(O.subOfCall(1) === 'one' && O.subOfCall(3) === 'one-3', 'a call is written one, one-2, one-3');

/* a sealed Step leads on: from a chapter's first Step, the Step after reaches every Step once and stops */
const Reg = await import('./src/content/registry');
await Reg.loadContent();
let walkedSteps = 0;
for (const c of Reg.ALL_CHAPTERS as any[]) {
  const all = c.pages.flatMap((pg: any) => pg.steps.map((st: any) => st.id));
  if (!all.length) continue;
  const seenSteps: string[] = [all[0]];
  for (let nx = Reg.stepAfter(all[0]); nx && seenSteps.length <= all.length; nx = Reg.stepAfter(nx.step.id)) {
    if (nx.chapter.id !== c.id) ok(false, 'the Step after leaves its chapter: ' + c.id);
    seenSteps.push(nx.step.id);
  }
  if (seenSteps.join() !== all.join()) ok(false, 'the Steps of ' + c.id + ' are not walked in order, once each');
  if (Reg.stepAfter(all[all.length - 1]) !== undefined) ok(false, 'the last Step of ' + c.id + ' has a Step after it');
  walkedSteps += seenSteps.length;
}
ok(walkedSteps > 300 && Reg.stepAfter('no-such-step') === undefined, 'Next Step walks every chapter in order: ' + walkedSteps + ' Steps');
const withRooms = new Set(sims.map((m: any) => m.chapterId));
ok(sims.every((m: any) => !!Reg.chapterById(m.chapterId)) && withRooms.size >= 8, 'every room stands on a chapter that exists: ' + sims.length + ' rooms on ' + withRooms.size + ' chapters');

/* the installed app's shortcuts open places that exist */
const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));
ok(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3 && manifest.shortcuts.every((x: any) => typeof x.name === 'string' && /^\/#\//.test(x.url) && H.routeOf(x.url.slice(1)) !== null), 'every shortcut of the installed app opens a place: ' + (manifest.shortcuts || []).map((x: any) => x.name + ' ' + x.url).join(', '));
ok(manifest.start_url === '/' && manifest.scope === '/', 'the installed app still starts at Ground');
console.log('addresses read back ' + (named.length - lostPlaces.length) + ' of ' + named.length);
/* the copy this batch added has no dashes */
for (const f of ['src/views/SimView.tsx', 'src/views/PracticeView.tsx']) {
  const src = readFileSync(f, 'utf8');
  for (const line of ['You left this room at inject', 'The opening of {sim.title}', 'The opening of the room and its first call', 'This room has no decision to take by itself']) {
    const at = src.split('\n').find(l => l.includes(line));
    if (at) ok(!/[—–]/.test(at), f + ': a dash in "' + line + '"');
  }
}

console.log('rooms ' + sims.length + ' | places saved and read back ' + places);
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
