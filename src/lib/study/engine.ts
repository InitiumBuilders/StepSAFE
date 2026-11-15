/* THE STUDY ENGINE: what to study next and why, how far along each card is,
   whether confidence and recall agree, and questions drawn from the content
   itself. Everything here reads the learner's record and the deck; nothing
   is invented, and every suggestion carries the reason it was made. */

import type { S, CardState } from '../state';
import { deck, cardById, neighbours, degree, type StudyCard, type CardKind } from './cards';
import type { SubjectId } from '../../content/subjects';
import { CHAPTERS, MODUX_MODELS } from '../../content/registry';
import { GAUGES } from '../../content/modux/gauges';
import { weekChallenge } from '../../content/modux/week';
import { INCIDENTS } from '../../content/modux/calibration';
import { chapterUnlocked } from '../unlock';

export type Mastery = 'new' | 'learning' | 'reviewing' | 'mastered';

export function masteryOf(c?: CardState): Mastery {
  if (!c || (!c.views && !c.reviews)) return 'new';
  const box = c.box ?? 0;
  if (box >= 4) return 'mastered';
  if (box >= 2) return 'reviewing';
  return 'learning';
}

export const MASTERY_LABEL: Record<Mastery, string> = { new: 'Not met yet', learning: 'Learning', reviewing: 'Reviewing', mastered: 'Held' };

export function isFud(c?: CardState): boolean { return typeof c?.sound === 'number' && c.sound < 1; }
export function isDue(c: CardState | undefined, now: number): boolean { return !!c && typeof c.due === 'number' && c.due <= now; }

/** a Semble Sound reading in words */
export function soundWords(v: number): string {
  if (v < -56) return 'Deep in the FUD range';
  if (v < 1) return 'In the FUD range';
  if (v < 40) return 'Finding its footing';
  if (v < 80) return 'Semble Sound';
  return 'Semble Strong';
}

/* ---------- calibration: does confidence match recall? ---------- */

export interface Calibration { kind: 'over' | 'under'; line: string }

/** a card rated high and missed, or rated low and answered every time */
export function calibrationOf(c?: CardState): Calibration | null {
  if (!c || typeof c.sound !== 'number' || !c.quiz) return null;
  const n = c.quiz.right + c.quiz.wrong;
  if (n < 2) return null;
  const acc = c.quiz.right / n;
  if (c.sound >= 56 && acc < 0.5) return { kind: 'over', line: 'Rated ' + signed(c.sound) + ', answered ' + c.quiz.right + ' of ' + n + '. Confidence is ahead of recall here.' };
  if (c.sound < 1 && acc >= 0.8) return { kind: 'under', line: 'In the FUD range, yet answered ' + c.quiz.right + ' of ' + n + '. You know more than you credit.' };
  return null;
}
export const signed = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v);

/* ---------- the context a learner is in right now ---------- */

export interface Context {
  /** cards on this week's pressure: the threat and its counters */
  week: Set<string>;
  /** cards the chapter nearest to locking in names */
  chapter: Set<string>;
  chapterTitle: string;
  /** cards on the gauges the learner has run most recently */
  gauge: Set<string>;
  gaugeTitle: string;
  /** cards on the three public incidents */
  world: Set<string>;
}

export function contextOf(s: S, now = new Date()): Context {
  const w = weekChallenge(now);
  const week = new Set<string>(['threat:' + w.pressure.id, ...w.pressure.counters.map(id => 'model:' + id)]);
  /* the open chapter with the most steps sealed, and the terms its steps name */
  const near = CHAPTERS.filter(c => !s.completedChapters[c.id] && chapterUnlocked(c, s.completedChapters, s.completedPages))
    .map(c => ({ c, done: c.pages.reduce((n, p) => n + p.steps.filter(st => s.completedSteps[st.id]).length, 0) }))
    .sort((a, b) => b.done - a.done)[0];
  const chapter = new Set<string>();
  if (near) for (const p of near.c.pages) for (const st of p.steps) {
    chapter.add('step:' + st.id);
    for (const r of cardById('step:' + st.id)?.related || []) chapter.add(r);
  }
  const last = [...s.runLog].reverse()[0];
  const gauge = new Set<string>();
  let gaugeTitle = '';
  if (last) {
    const g = GAUGES.find(x => x.id === last.g) || s.forged.find(x => x.id === last.g);
    if (g) {
      gaugeTitle = g.title;
      for (const t of g.threats) for (const c of t.counters) gauge.add('model:' + c);
    }
  }
  const world = new Set<string>(INCIDENTS.flatMap(i => ['incident:' + i.id, ...i.checks.flatMap(c => c.stack.map(id => 'model:' + id))]));
  return { week, chapter, chapterTitle: near ? near.c.title : '', gauge, gaugeTitle, world };
}

/* ---------- the queue: what to study now, and why ---------- */

export interface Suggestion { id: string; reason: string; weight: number }

export function forYou(s: S, now = Date.now(), limit = 24): Suggestion[] {
  const all = deck();
  const ctx = contextOf(s, new Date(now));
  const out = new Map<string, Suggestion>();
  const add = (id: string, reason: string, weight: number) => {
    if (!cardById(id)) return;
    const cur = out.get(id);
    if (!cur || cur.weight < weight) out.set(id, { id, reason, weight });
  };
  for (const [id, c] of Object.entries(s.study)) {
    if (isDue(c, now)) add(id, 'Due for review today', 100 + Math.min(30, (now - (c.due || now)) / 86400000));
    if (c.diving) add(id, 'Diving Into', 90);
    const cal = calibrationOf(c);
    if (cal?.kind === 'over') add(id, 'Confidence ahead of recall', 88);
    if (isFud(c)) add(id, 'In your FUD range', 80 - (c.sound || 0) / 10);
    if (c.essential && now - c.lastAt > 7 * 86400000) add(id, 'Semble Essential, not seen this week', 75);
  }
  for (const id of ctx.week) if (!s.study[id]?.box) add(id, "On this week's pressure", 70);
  for (const id of ctx.gauge) if (!s.study[id]?.box) add(id, 'On ' + (ctx.gaugeTitle || 'your last gauge'), 62);
  for (const id of ctx.chapter) if (!s.study[id] && id.startsWith('term:')) add(id, 'Named in ' + (ctx.chapterTitle || 'your chapter'), 58);
  for (const id of ctx.world) if (!s.study[id]) add(id, 'In a public incident', 50);
  /* load-bearing cards not met yet: the most joined, so each one opens many others */
  const unseen = all.filter(c => !s.study[c.id] && (c.kind === 'term' || c.kind === 'model'))
    .map(c => ({ c, d: degree(c.id) })).sort((a, b) => b.d - a.d).slice(0, 12);
  for (const { c, d } of unseen) add(c.id, 'Load-bearing: joined to ' + d + ' cards', 40 + Math.min(10, d / 3));
  return [...out.values()].sort((a, b) => b.weight - a.weight).slice(0, limit);
}

/* ---------- questions drawn from the content ---------- */

export interface Question { id: string; prompt: string; options: { text: string; right: boolean }[]; explain: string }

function hashSeed(x: string): number { let h = 2166136261; for (let i = 0; i < x.length; i++) { h ^= x.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed: number) { let t = seed; return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
function shuffle<T>(a: T[], r: () => number): T[] { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }

/** a question for a card: which name fits this definition, or which structure stops this threat.
    Distractors come from cards of the same kind, nearest domain first. `salt` varies the draw. */
const MASK_STOP = new Set(['and', 'the', 'with', 'from', 'your', 'for', 'into', 'that', 'this', 'what', 'when', 'how', 'are', 'not', 'one', 'its', 'you', 'who', 'why', 'than', 'over', 'under']);

export function questionFor(card: StudyCard, salt = 0): Question | null {
  const r = rng(hashSeed(card.id + '|' + salt));
  const all = deck();
  if (card.kind === 'threat') {
    const right = card.facts[0]?.items || [];
    if (!right.length) return null;
    const answer = right[Math.floor(r() * right.length)];
    const pool = shuffle(MODUX_MODELS.map(m => m.name).filter(n => !right.includes(n)), r).slice(0, 3);
    if (pool.length < 3) return null;
    return { id: card.id, prompt: 'Which structure stops this? ' + card.answer, options: shuffle([{ text: answer, right: true }, ...pool.map(text => ({ text, right: false }))], r), explain: card.title + ' is stopped by ' + right.join(', ') + '.' };
  }
  const same = all.filter(c => c.kind === card.kind && c.id !== card.id && c.title !== card.title);
  const near = shuffle(same.filter(c => c.domain.split(' · ')[0] === card.domain.split(' · ')[0]), r);
  const far = shuffle(same.filter(c => c.domain.split(' · ')[0] !== card.domain.split(' · ')[0]), r);
  const seen = new Set<string>([card.title]);
  const distract = [...near, ...far].filter(c => !seen.has(c.title) && !!seen.add(c.title)).slice(0, 3);
  if (distract.length < 3) return null;
  /* the prompt must not give its own answer: the title becomes "this", and every significant word of it a blank */
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const words = [...new Set(card.title.toLowerCase().match(/[a-z][a-z'-]{3,}/g) || [])].filter(w => !MASK_STOP.has(w));
  const strip = (t: string) => {
    let x = t.replace(new RegExp(esc(card.title), 'gi'), 'this');
    for (const w of words) x = x.replace(new RegExp('\\b' + esc(w.replace(/(es|s)$/, '')) + "[a-z']*\\b", 'gi'), '____');
    return x;
  };
  return {
    id: card.id,
    prompt: (card.kind === 'model' ? 'Which structure is this? ' : card.kind === 'term' ? 'Which term is this? ' : 'Which ' + card.kind + ' is this? ') + strip(card.answer),
    options: shuffle([{ text: card.title, right: true }, ...distract.map(c => ({ text: c.title, right: false }))], r),
    explain: card.title + ': ' + card.answer,
  };
}

/* ---------- progress ---------- */

export interface Progress {
  total: number;
  met: number;
  mastered: number;
  fud: number;
  sound: number;
  due: number;
  byKind: Record<CardKind, { total: number; met: number; mastered: number }>;
  /** the same count over the eleven subjects (content/subjects.ts) */
  bySubject: Partial<Record<SubjectId, { total: number; met: number; mastered: number }>>;
  secsToday: number;
  reviewedToday: number;
  unitiaToday: number;
  days: { day: string; unitiaC: number }[];
  streak: number;
  avgSound: number | null;
  ownWords: number;
  essentials: number;
  diving: number;
}

export function dayKey(d: Date = new Date()): string { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

export function progressOf(s: S, now = Date.now()): Progress {
  const all = deck();
  const byKind = {} as Progress['byKind'];
  for (const c of all) { byKind[c.kind] = byKind[c.kind] || { total: 0, met: 0, mastered: 0 }; byKind[c.kind].total++; }
  const bySubject: Progress['bySubject'] = {};
  for (const c of all) if (c.subject) { (bySubject[c.subject] ||= { total: 0, met: 0, mastered: 0 }).total++; }
  let met = 0, mastered = 0, fud = 0, sound = 0, due = 0, ownWords = 0, essentials = 0, diving = 0, sumSound = 0, nSound = 0, secsToday = 0, reviewedToday = 0;
  const today = dayKey(new Date(now));
  for (const [id, st] of Object.entries(s.study)) {
    const card = cardById(id);
    if (!card) continue;
    const m = masteryOf(st);
    if (m !== 'new') { met++; byKind[card.kind].met++; if (card.subject) bySubject[card.subject]!.met++; }
    if (m === 'mastered') { mastered++; byKind[card.kind].mastered++; if (card.subject) bySubject[card.subject]!.mastered++; }
    if (typeof st.sound === 'number') { nSound++; sumSound += st.sound; if (st.sound < 1) fud++; else sound++; }
    if (isDue(st, now)) due++;
    if (st.ownWords?.trim()) ownWords++;
    if (st.essential) essentials++;
    if (st.diving) diving++;
    if (st.day === today) secsToday += st.daySecs || 0;
    if (st.reviewDay === today) reviewedToday++;
  }
  const days: { day: string; unitiaC: number }[] = [];
  for (let i = 13; i >= 0; i--) { const d = dayKey(new Date(now - i * 86400000)); days.push({ day: d, unitiaC: s.unitiaDays[d] || 0 }); }
  let streak = 0;
  for (let i = 0; i < 400; i++) { const d = dayKey(new Date(now - i * 86400000)); if (s.unitiaDays[d]) streak++; else if (i > 0) break; }
  return {
    total: all.length, met, mastered, fud, sound, due, byKind, bySubject, secsToday, reviewedToday,
    unitiaToday: s.unitiaDays[today] || 0, days, streak, avgSound: nSound ? Math.round(sumSound / nSound) : null,
    ownWords, essentials, diving,
  };
}

/** the cards a learner already holds: mastered, or rated Semble Sound */
export function heldCards(s: S): Set<string> {
  return new Set(Object.entries(s.study).filter(([, c]) => masteryOf(c) === 'mastered' || (typeof c.sound === 'number' && c.sound >= 56)).map(([id]) => id));
}

/** what a card's neighbours look like on the learner's record */
export function neighbourhood(s: S, id: string): { total: number; met: number; fud: number } {
  const ns = neighbours(id);
  let met = 0, fud = 0;
  for (const n of ns) { const c = s.study[n]; if (masteryOf(c) !== 'new') met++; if (isFud(c)) fud++; }
  return { total: ns.length, met, fud };
}

export function fmtTime(secs: number): string {
  if (secs < 60) return Math.round(secs) + ' s';
  if (secs < 3600) return Math.floor(secs / 60) + ' min ' + String(Math.round(secs % 60)).padStart(2, '0') + ' s';
  return Math.floor(secs / 3600) + ' h ' + Math.round((secs % 3600) / 60) + ' min';
}
export const fmtUnitia = (c: number) => (c / 100).toFixed(2);
