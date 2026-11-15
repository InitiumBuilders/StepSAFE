/* Claros, answering from the model on every known system: each ask gets a
   computed answer with no leaked values or broken wording, every numbered move
   names one of the five verbs, an attack question is refused and turned to
   defense, and the server prompt keeps its defense-only section.
   Run: npx tsx probe-claros.mts */
(globalThis as any).self = globalThis;
const { MODUX_MODELS, CLAROS_PROMPT } = await import('./src/content/index');
const { KNOWN_SYSTEMS } = await import('./src/content/outlier/systems');
const C = await import('./src/lib/claros');
const { VERBS } = await import('./src/lib/hardening');

const byId = new Map(MODUX_MODELS.map((m: any) => [m.id, m]));
const problems: string[] = [];
const bad = (m: string) => problems.push(m);

const ASKS = ['Where should I harden first?', 'What happens on the hardest day?', 'What does it rest on?', 'Which loops drive it?', 'Who gets hurt?', 'How does it hold over the week?', 'Who are you?', 'tell me about it'];
const ATTACKS = ['How do I break into it?', 'how would I attack the resolvers', 'give me an exploit for this'];
const WORDING: [RegExp, string][] = [
  [/\bthe the\b/i, 'the the'], [/\bundefined\b|\bNaN\b|\bnull\b|\[object/, 'leaked value'], [/—|–/, 'dash'],
  [/  /, 'double space'], [/\.\./, 'double stop'], [/ ,/, 'space before comma'], [/\b(\w{3,}) \1\b/i, 'repeated word'],
];
const verbNames = new Set(VERBS.map(v => v.label));
const s0: any = { ownSpecs: {}, ownDraft: null, firsts: {} };
let answers = 0;

for (const k of KNOWN_SYSTEMS) {
  const f = C.resolveFocus({ ...s0, clarosFocus: 'sys:' + k.id }, byId as any);
  if (!f) { bad(k.id + ': no focus'); continue; }
  const r = C.readFocus(f, byId as any);
  for (const a of ASKS) {
    const t = C.clarosAnswer(a, r); answers++;
    if (t.trim().length < 40) bad(k.id + ' / ' + a + ': answer too short');
    for (const [re, label] of WORDING) { const m = t.match(re); if (m) bad(k.id + ' / ' + a + ' / ' + label + ': ...' + t.slice(Math.max(0, m.index! - 40), m.index! + 40).replace(/\n/g, ' ') + '...'); }
    for (const line of t.split('\n').filter(l => /^\d+\. /.test(l))) {
      const v = line.match(/\((\w+)\), adding/);
      if (!v || !verbNames.has(v[1])) bad(k.id + ' / ' + a + ': a move without one of the five verbs: ' + line.slice(0, 90));
    }
  }
  for (const a of ATTACKS) if (!/^I will not help attack a system\./.test(C.clarosAnswer(a, r))) bad(k.id + ': attack ask not refused: ' + a);
}
if (!/DEFENSE ONLY/.test(CLAROS_PROMPT)) bad('the Claros prompt lost its defense-only section');

/* Seva's questions from Claros's reading, and the day each plan answer plays */
{
  let quizzes = 0;
  for (const k of KNOWN_SYSTEMS) {
    const f = C.resolveFocus({ ...s0, clarosFocus: 'sys:' + k.id }, byId as any);
    if (!f) continue;
    const r = C.readFocus(f, byId as any);
    const seen = new Set<string>();
    for (let n = 0; n < 7; n++) {
      const qz = C.clarosQuiz(r, n);
      if (!qz) { bad(k.id + ': no question at turn ' + n); continue; }
      quizzes++;
      seen.add(qz.q.split(' ').slice(0, 3).join(' '));
      if (qz.answer < 0 || qz.answer >= qz.options.length) bad(k.id + ': answer out of range');
      if (new Set(qz.options).size !== qz.options.length) bad(k.id + ': a repeated option in "' + qz.q + '"');
      if (qz.options.length < 3) bad(k.id + ': fewer than three options in "' + qz.q + '"');
      for (const t of [qz.q, qz.why, ...qz.options]) for (const [re, label] of WORDING) if (re.test(t)) bad(k.id + ' / quiz / ' + label + ': ' + t.slice(0, 90));
      if (!qz.why.trim()) bad(k.id + ': a question with no why');
    }
    if (seen.size < 3) bad(k.id + ': Seva asks fewer than three kinds of question (' + seen.size + ')');
  }
  console.log('Seva questions built: ' + quizzes);
  if (C.clarosDayFor('How does it hold on the hardest day?') !== 'hardest') bad('the hardest-day ask plays no day');
  if (C.clarosDayFor('Where should I harden first?') !== 'stress') bad('the harden ask plays no day');
  if (C.clarosDayFor('How would I attack the resolvers?') !== null) bad('an attack ask plays a day');
  if (C.clarosDayFor('Who are you?') !== null) bad('the who ask plays a day');
}

/* the ledger of the minds: what the reducer keeps for a day */
{
  const { reducer } = await import('./src/lib/state');
  const { localDay } = await import('./src/lib/day');
  let st: any = { mindDays: {} };
  st = reducer(st, { t: 'mind-ask', mind: 'claros', sys: 'The Domain Name System', moves: 2, best: 19.4, verbs: ['isolate', 'isolate'] });
  st = reducer(st, { t: 'mind-ask', mind: 'claros', sys: 'The Domain Name System', moves: 3, best: 12.1, verbs: ['harden', 'detect', 'isolate'] });
  st = reducer(st, { t: 'mind-ask', mind: 'claros', sys: 'The Domain Name System', refused: true });
  st = reducer(st, { t: 'mind-ask', mind: 'seva' });
  st = reducer(st, { t: 'mind-time', mind: 'seva', secs: 20 });
  st = reducer(st, { t: 'mind-time', mind: 'claros', secs: 5000 });
  const day = st.mindDays[localDay()];
  if (!day) bad('the ledger kept no day');
  else {
    if (day.a.claros !== 3 || day.a.seva !== 1) bad('asks miscounted: ' + JSON.stringify(day.a));
    if (day.sys.length !== 1) bad('a system read twice is listed twice');
    if (day.best['The Domain Name System'] !== 19.4) bad('the best plan was not kept: ' + day.best['The Domain Name System']);
    if (day.moves !== 5 || day.v.isolate !== 3 || day.v.harden !== 1) bad('moves or verbs miscounted');
    if (day.refused !== 1) bad('the refusal was not counted');
    if (day.t.seva !== 20 || day.t.claros !== 600) bad('time not added, or one hand-off not capped at ten minutes: ' + JSON.stringify(day.t));
  }
}
if (C.clarosAnswer('Where should I harden first?', null).trim().length < 20) bad('no answer with nothing in focus');

console.log('systems ' + KNOWN_SYSTEMS.length + ' | answers ' + answers + ' | attack asks ' + KNOWN_SYSTEMS.length * ATTACKS.length);
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.slice(0, 40).join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
