/* CLAROS READS A SYSTEM.

   Claros is the systems mind. Whatever answers (the live model on the shared server, the learner's
   own key, or nothing at all), the readings come from here: the gauges' model run on the system in
   focus. With a model connected they go to it as data, so its numbers are the model's. With no model
   connected, Claros answers from them directly, so it is never vague and never invents.

   The system in focus is the learner's own map first (Map your own system), then a known system
   they chose. Every answer here is computed; the words around the numbers are plain. */

import type { ModuxGauge, ModuxModel } from '../content/modux-schema';
import type { OwnSpec } from '../content/modux/own';
import { buildOwnGauge, specFromKnown, knownById } from '../content/modux/own';
import { KNOWN_SYSTEMS } from '../content/outlier/systems';
import { COMMONS } from '../content/outlier/commons';
import { readSystem, type SystemReading } from './systemRead';
import { BEAT } from './systemStates';
import { hardeningWeek, VERBS, type Verb, type Week } from './hardening';
import { knownChosen } from './outlier';
import type { S } from './state';

export interface Focus { key: string; name: string; kind: 'own' | 'draft' | 'known'; gauge: ModuxGauge; knownId?: string }
export interface ClarosRead { focus: Focus; R: SystemReading; week: Week; hard: Week; rests: { foundation: string; part: string }[]; nameOf: (id: string) => string }

const hrs = (h: number) => (h < 1 ? Math.round(h * 60) + ' minutes' : (Math.round(h * 10) / 10) + (h === 1 ? ' hour' : ' hours'));
const h1 = (x: number) => String(Math.round(x * 10) / 10);
const verbLabel = (v: Verb) => VERBS.find(x => x.id === v)!.label;
const inner = (name: string) => name.replace(/^(The|A|An) /, (m: string) => m.toLowerCase());
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);

/** every system Claros can read for this learner: their own maps first, then the known systems */
export function focusChoices(s: Pick<S, 'ownSpecs' | 'ownDraft'>): { key: string; name: string; group: string }[] {
  const out: { key: string; name: string; group: string }[] = [];
  const named = (sp: OwnSpec | null) => !!sp && sp.parts.filter(p => p.name.trim()).length >= 2;
  if (named(s.ownDraft)) out.push({ key: 'draft', name: (s.ownDraft!.org || 'Your map').trim() + ' (the map you are drawing)', group: 'Your maps' });
  for (const [id, sp] of Object.entries(s.ownSpecs || {})) if (!sp.known && named(sp)) out.push({ key: 'own:' + id, name: (sp.org || 'Your system').trim(), group: 'Your maps' });
  for (const k of KNOWN_SYSTEMS) out.push({ key: 'sys:' + k.id, name: k.name, group: k.group });
  return out;
}

/** the system in focus: the one chosen, or the learner's own map, or a known system they opened */
export function resolveFocus(s: Pick<S, 'ownSpecs' | 'ownDraft' | 'clarosFocus' | 'firsts'>, byId: Map<string, ModuxModel>): Focus | null {
  const choices = focusChoices(s);
  const key = s.clarosFocus && choices.some(c => c.key === s.clarosFocus) ? s.clarosFocus
    : choices.find(c => c.group === 'Your maps')?.key
    || (knownChosen(s).length ? 'sys:' + knownChosen(s)[knownChosen(s).length - 1] : null);
  if (!key) return null;
  try {
    if (key === 'draft' && s.ownDraft) { const g = buildOwnGauge(s.ownDraft, byId); return g ? { key, name: (s.ownDraft.org || 'Your map').trim(), kind: 'draft', gauge: g } : null; }
    if (key.startsWith('own:')) { const sp = s.ownSpecs[key.slice(4)]; const g = sp && buildOwnGauge(sp, byId); return g ? { key, name: (sp.org || 'Your system').trim(), kind: 'own', gauge: g } : null; }
    if (key.startsWith('sys:')) {
      const id = key.slice(4); const k = knownById(id); const sp = specFromKnown(id); const g = sp && buildOwnGauge(sp, byId);
      return k && g ? { key, name: k.name, kind: 'known', gauge: g, knownId: id } : null;
    }
  } catch { return null; }
  return null;
}

const cache = new Map<string, ClarosRead>();

/** the model's readings of the system in focus, worked out once per map */
export function readFocus(f: Focus, byId: Map<string, ModuxModel>): ClarosRead {
  const sig = f.key + '|' + JSON.stringify(f.gauge.system) + '|' + f.gauge.threats.map(t => t.id).join(',');
  const hit = cache.get(sig);
  if (hit) return hit;
  const g = f.gauge;
  const R = readSystem(g.system, g.threats, g, byId);
  const week = hardeningWeek(g, byId, R, [], 6, 'stress');
  const hard = hardeningWeek(g, byId, R, [], 6, 'hardest');
  const nameOf = (id: string) => g.system.nodes.find(n => n.id === id)?.name || id;
  const rests = f.knownId ? COMMONS.foundations.flatMap(fd => fd.rests.filter(r => r.system === f.knownId).map(r => ({ foundation: fd.name, part: r.partName }))) : [];
  const read: ClarosRead = { focus: f, R, week, hard, rests, nameOf };
  cache.set(sig, read);
  if (cache.size > 24) cache.delete(cache.keys().next().value as string);
  return read;
}

/** the readings as data for a live model */
export function clarosDigest(r: ClarosRead): string {
  const { focus, R, week, hard, nameOf } = r;
  const g = focus.gauge;
  const lines: string[] = [];
  lines.push('System in focus: ' + focus.name + ' (' + (focus.kind === 'known' ? 'a known system in the app' : 'the learner’s own map') + '). ' + g.system.nodes.length + ' parts: ' + g.system.nodes.map(n => n.name + ' (' + n.kind + ')').join('; ') + '.');
  if (R.keystone) lines.push('Keystone: ' + nameOf(R.keystone) + '. If it fails, ' + (R.reach[R.keystone] || []).length + ' of the other ' + (g.system.nodes.length - 1) + ' parts lose what they need.');
  if (R.fastest.length >= 2 && R.fastestHours !== null) lines.push('Fastest cascade to the people: ' + R.fastest.map(nameOf).join(' > ') + ', about ' + hrs(R.fastestHours) + '.');
  if (R.loops.length) lines.push('Feedback loops: ' + R.loops.map(l => nameOf(l.from) + ' feeds back into ' + nameOf(l.to)).join('; ') + '.');
  if (r.rests.length) lines.push('Shared foundations its map names: ' + r.rests.map(x => x.foundation + ' (through ' + x.part + ')').join('; ') + '.');
  lines.push('Pressures on the map: ' + g.threats.filter(t => !t.open).map(t => t.name + ' on ' + nameOf(t.target)).join('; ') + '.');
  lines.push('Stress day with nothing in place: ' + h1(week.start) + ' of 24 hours kept. Hardening plan for the stress day, in order: ' + (week.lessons.length ? week.lessons.map(l => l.day + '. ' + l.name + ' at ' + nameOf(l.where) + ' (' + verbLabel(l.verb) + ', +' + h1(l.gain) + ' h)').join('; ') + '. It ends at ' + h1(week.end) + ' of 24.' : 'no single move keeps more.'));
  lines.push('Hardest day with nothing in place: ' + h1(hard.start) + ' of 24. Plan for the hardest day: ' + (hard.lessons.length ? hard.lessons.map(l => l.day + '. ' + l.name + ' at ' + nameOf(l.where) + ' (+' + h1(l.gain) + ' h)').join('; ') + '. It ends at ' + h1(hard.end) + ' of 24.' : 'no single move keeps more.') + (hard.stillFalls.length ? ' Still below half at the end: ' + hard.stillFalls.map(nameOf).join(', ') + '.' : ''));
  return lines.join('\n');
}

/* ---------- answering with no model connected ---------- */

const ATTACK = /\b(exploit|hack into|hacking into|break into|bypass (the|their|a)|malware|ransomware for|ddos|phish (him|her|them|someone|my)|crack (a|the|their) password|steal|keylogger|backdoor)\b/i;
/* asking how to bring a system down, in any of the usual words */
const ATTACK_HOW = /\b(how (do|would|could|can|should|to|might) (i |we |you |one |someone )?|help me |teach me (how )?(to )?|show me how to )(attack|take down|knock out|sabotage|poison|hijack|compromise)\b/i;

export function clarosAnswer(input: string, r: ClarosRead | null): string {
  const q = input.toLowerCase();
  if (ATTACK.test(q) || ATTACK_HOW.test(q)) {
    const m = r?.week.lessons[0];
    return 'I will not help attack a system. I read systems to defend them.' + (m && r ? ' The defensive side of the same worry, on ' + inner(r.focus.name) + ': ' + m.name + ' at ' + r.nameOf(m.where) + ' is the first move the model rates, worth about ' + h1(m.gain) + ' hours of the stress day.' : ' Give me the system you are worried about and I will show you where it should be hardened first.');
  }
  if (/who are you|what are you|\bclaros\b|what do you do/.test(q)) {
    return 'I am Claros. Seva teaches you. I read systems with you: the keystone, the way a failure travels, the loops, what a system rests on, and where one move holds the most. Every number I give comes from the gauges’ model, and I say so.';
  }
  if (!r) return 'Give me a system to read. Draw your own in Map your own system, or choose one of the known systems above, and I will read it with you.';
  const { focus, R, week, hard, nameOf } = r;
  const g = focus.gauge;
  const n = g.system.nodes.length;
  const plan = (w: Week) => w.lessons.map(l => l.day + '. ' + l.name + ' at ' + nameOf(l.where) + ' (' + verbLabel(l.verb) + '), adding ' + h1(l.gain) + (l.gain === 1 ? ' hour' : ' hours')).join('\n');

  if (/hardest|worst|extreme|full strength|unseen/.test(q)) {
    return 'On the hardest day, with nothing in place, ' + inner(focus.name) + ' keeps ' + h1(hard.start) + ' of 24 hours. That is every pressure at full strength, unseen, where it does the most harm.' +
      (hard.lessons.length ? '\n\nPlanned for that day, from the model:\n' + plan(hard) + '\n\nThat brings it to ' + h1(hard.end) + ' of 24.' + (hard.end < 23.5 && hard.lessons.length < 6 ? ' After that no single move adds even twenty minutes, so what is left is structural.' : '') : '\n\nThe model finds no single move that keeps more of that day.') +
      (hard.stillFalls.length ? (hard.end >= 23.5 ? ' The people keep their service all day. Still below half at the end: ' + list(hard.stillFalls.map(nameOf)) + '.' : ' Still below half at the end: ' + list(hard.stillFalls.map(nameOf)) + '. That is where to look next.') : '');
  }
  if (/harden|first|plan|order|priorit|fix|start|where should|what should|move/.test(q)) {
    if (!week.lessons.length) return 'The model finds no single move that keeps more of the stress day for ' + inner(focus.name) + '. Ask me about the hardest day instead.';
    const v = (x: Verb) => week.lessons.some(l => l.verb === x);
    return 'Harden ' + inner(focus.name) + ' in this order, from the model:\n' + plan(week) + '\n\nEach move was chosen after the ones before it. Together they take the stress day from ' + h1(week.start) + ' to ' + h1(week.end) + ' of 24 hours.' +
      (!v('detect') || !v('restore') ? ' Nothing in it ' + (!v('detect') && !v('restore') ? 'detects or restores' : !v('detect') ? 'detects' : 'restores') + ', so add that once the plan is in.' : '');
  }
  if (/rest|depend|foundation|commons|shared|cloud|dns|registry|update|vendor|supplier/.test(q)) {
    if (r.rests.length) return 'Its own map names ' + list(r.rests.map(x => x.foundation.toLowerCase() + ' (through ' + x.part + ')')) + '. A move at a shared foundation protects every system resting there. Under all of it sit routing, certificates, time and power.';
    const outside = g.system.nodes.filter(x => x.kind === 'vendor');
    return (outside.length ? 'Its outside parts are ' + list(outside.map(x => x.name)) + '. Those are where it rests on someone else. ' : 'The map names no outside supplier. ') + 'Like every system, it also rests on routing, certificates, time and power.';
  }
  if (/loop|feedback|compound|grow/.test(q)) {
    return R.loops.length ? 'The loop that compounds: ' + R.loops.map(l => nameOf(l.from) + ' feeds back into ' + nameOf(l.to)).join('; ') + '. A loss there returns upstream, so it grows on each turn. A move that cuts the loop is worth more than one that only slows it.' : 'The model finds no feedback loop on this map. Losses here travel one way, from the top toward the people.';
  }
  if (/people|public|user|customer|patient|citizen/.test(q)) {
    const near = new Set<string>();
    for (const e of g.system.edges) if (R.publicIds.includes(e.to)) near.add(e.from);
    return R.publicIds.length ? 'The people are ' + list(R.publicIds.map(nameOf)) + '. They touch ' + list([...near].map(nameOf)) + ' directly. Everything else reaches them through those.' : 'This map has no part for the people it serves. Add one: service to people is the stock a defender protects.';
  }
  if (/beat|fast|how long|cascade|spread|travel|minutes|hours/.test(q)) {
    return 'A live link fails in about ' + hrs(BEAT.live) + ', the people feel a loss in about ' + hrs(BEAT.people) + ', and a supply holds for about ' + hrs(BEAT.supply) + '. A pressure pushes for ' + hrs(BEAT.unseen) + ' when nothing sees it.' +
      (R.fastest.length >= 2 && R.fastestHours !== null ? ' On ' + inner(focus.name) + ' a failure reaches the people fastest through ' + R.fastest.map(nameOf).join(', then ') + ', in about ' + hrs(R.fastestHours) + '. Trouble has to be seen inside that.' : '');
  }
  if (/verb|cadence|detect|restore|isolate|model/.test(q)) {
    const c = (v: Verb) => week.lessons.filter(l => l.verb === v).length;
    return 'The plan by verb: ' + VERBS.filter(v => c(v.id)).map(v => v.label + ' ' + c(v.id)).join(', ') + '. ' + VERBS.map(v => v.label + ': ' + v.line).join(' ');
  }
  /* the reading, whole */
  const k = R.keystone;
  return focus.name + '. ' + n + ' parts.' +
    (k ? ' The keystone is ' + nameOf(k) + ': if it fails, ' + (R.reach[k] || []).length + ' of the other ' + (n - 1) + ' parts lose what they need.' : '') +
    (R.fastest.length >= 2 && R.fastestHours !== null ? ' A failure reaches the people fastest through ' + R.fastest.map(nameOf).join(', then ') + ', in about ' + hrs(R.fastestHours) + '.' : '') +
    ' With nothing in place the stress day keeps ' + h1(week.start) + ' of 24 hours, and the hardest day ' + h1(hard.start) + '.' +
    (week.lessons[0] ? ' The first move the model rates is ' + week.lessons[0].name + ' at ' + nameOf(week.lessons[0].where) + '.' : '') +
    '\n\nAsk me where to harden first, how it holds on the hardest day, what it rests on, or how fast a failure travels.';
}

/** the day an ask is about, so the answer can play it on the map; the same order the answers read the ask in */
export function clarosDayFor(input: string): 'stress' | 'hardest' | null {
  const q = input.toLowerCase();
  if (ATTACK.test(q) || ATTACK_HOW.test(q)) return null;
  if (/who are you|what are you|\bclaros\b|what do you do/.test(q)) return null;
  if (/hardest|worst|extreme|full strength|unseen|play the day|watch the day/.test(q)) return 'hardest';
  if (/harden|first|plan|order|priorit|fix|start|where should|what should|move/.test(q)) return 'stress';
  return null;
}

/* ---------- Seva's questions, built from what Claros read ---------- */

export interface ClarosQuiz { q: string; options: string[]; answer: number; why: string }

/** one question about the system Claros read, its answer computed by the model; n turns through the kinds */
export function clarosQuiz(r: ClarosRead, n: number): ClarosQuiz | null {
  const { focus, R, week, hard, nameOf } = r;
  const sys = inner(focus.name);
  const nodes = focus.gauge.system.nodes;
  const reach = (id: string) => (R.reach[id] || []).length;
  const make = (q: string, right: string, wrong: string[], why: string): ClarosQuiz | null => {
    const others = [...new Set(wrong.filter(w => w && w !== right))].slice(0, 3);
    if (others.length < 2) return null;
    const opts = [right, ...others];
    const k = n % opts.length;
    const rot = [...opts.slice(k), ...opts.slice(0, k)];
    return { q, options: rot, answer: rot.indexOf(right), why };
  };
  const kinds: (() => ClarosQuiz | null)[] = [
    () => {
      const k = R.keystone;
      if (!k) return null;
      const near = nodes.filter(x => x.id !== k).sort((a, b) => reach(b.id) - reach(a.id)).map(x => x.name);
      return make('Which part of ' + sys + ' is its keystone, the one whose fall takes the most down with it?', nameOf(k), near,
        nameOf(k) + '. When it falls, ' + reach(k) + ' of the other ' + (nodes.length - 1) + ' parts lose what they need.');
    },
    () => {
      const l = week.lessons[0];
      if (!l) return null;
      return make('Claros’s plan for the stress day on ' + sys + ' starts with one move. Which?', l.name,
        [...week.lessons.slice(1).map(x => x.name), ...hard.lessons.map(x => x.name)],
        l.name + ', at ' + nameOf(l.where) + '. It adds ' + h1(l.gain) + ' hours to the stress day, the most for its cost of any move the model can place first.');
    },
    () => {
      const bins = ['Under 6 hours', '6 to 12 hours', '12 to 18 hours', '18 to 24 hours'];
      const right = bins[Math.min(3, Math.floor(week.start / 6))];
      const q = make('On the stress day, with nothing in place, how many of the 24 hours does the model keep for ' + sys + '?', right, bins,
        h1(week.start) + ' of 24 hours.' + (week.lessons.length ? ' Claros’s plan takes it to ' + h1(week.end) + '.' : ''));
      /* the hours read in order, whatever the turn */
      return q ? { ...q, options: bins, answer: bins.indexOf(right) } : null;
    },
    () => {
      const used = new Set(week.lessons.map(l => l.verb));
      const missing = VERBS.filter(v => !used.has(v.id));
      const present = VERBS.filter(v => used.has(v.id));
      if (!missing.length || present.length < 2) return null;
      const m = missing[n % missing.length];
      return make('Which kind of move is not in Claros’s plan for ' + sys + '?', m.label, present.map(v => v.label),
        'Nothing in the plan ' + m.label.toLowerCase() + 's. ' + m.line + ' Add it once the plan is in.');
    },
    () => {
      const bins = ['Under 6 hours', '6 to 12 hours', '12 to 18 hours', '18 to 24 hours'];
      const right = bins[Math.min(3, Math.floor(hard.start / 6))];
      const q = make('On the hardest day, with nothing in place, how many of the 24 hours does the model keep for ' + sys + '?', right, bins,
        h1(hard.start) + ' of 24 hours: every pressure at full strength, unseen, where it does the most harm.' + (hard.lessons.length ? ' Planned for that day, it keeps ' + h1(hard.end) + '.' : ''));
      return q ? { ...q, options: bins, answer: bins.indexOf(right) } : null;
    },
    () => {
      const path = R.fastest;
      if (path.length < 3 || R.fastestHours === null) return null;
      const mid = path[1];
      const off = nodes.filter(x => !path.includes(x.id)).sort((a, b) => reach(b.id) - reach(a.id)).map(x => x.name);
      return make('On ' + sys + ', a failure takes one path to the people faster than any other. Which part does it pass through?', nameOf(mid), off,
        'The path runs ' + path.map(nameOf).join(', then ') + ', in about ' + hrs(R.fastestHours) + '. Trouble has to be seen inside that time.');
    },
    () => {
      if (!r.rests.length) return null;
      const right = r.rests[0];
      const mine = new Set(r.rests.map(x => x.foundation));
      return make('Which shared foundation is under ' + sys + '?', right.foundation, COMMONS.foundations.map(f => f.name).filter(x => !mine.has(x)),
        right.foundation + ', through ' + right.part + '. A move at a shared foundation protects every system resting there.');
    },
  ];
  for (let i = 0; i < kinds.length; i++) {
    const q = kinds[(n + i) % kinds.length]();
    if (q) return q;
  }
  return null;
}
