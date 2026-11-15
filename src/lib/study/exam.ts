/* THE TEST. Twenty questions under exam conditions: the answers stay hidden
   until the end, then the score, the time, and every miss with its answer. The draw
   is seeded, so a test sent by link gives everyone who opens it the same
   questions in the same order. The test in progress lives in sessionStorage,
   so a reload keeps the place. */

import { cardById, type CardKind } from './cards';
import { questionFor, type Question } from './engine';

export const EXAM_KEY = 'stepsafe-study-exam';
export const EXAM_LENGTHS = [10, 20, 40] as const;

export interface ExamSpec {
  label: string;
  /** the cards the test was drawn from, so it can be taken again with a new draw */
  pool: string[];
  seed: number;
  /** the cards asked, in order */
  ids: string[];
  /** the option index picked for each question, or null */
  picks: (number | null)[];
  at: number;
  /** seconds taken, set when it is finished */
  secs: number;
  done: boolean;
  /** who sent it, for a test that came by link */
  by?: string;
}

function rng(seed: number) {
  let t = seed >>> 0;
  return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
}

export function newSeed(): number { return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) & 0x7fffffff; }

/** draw n cards that can be asked from a pool, in a seeded order */
export function drawExam(pool: string[], n: number, seed: number): string[] {
  const r = rng(seed);
  const ids = [...new Set(pool)].filter(id => cardById(id));
  for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  const out: string[] = [];
  for (const id of ids) {
    if (out.length >= n) break;
    if (questionFor(cardById(id)!, seed)) out.push(id);
  }
  return out;
}

/** the question for the i-th card of a test; the same seed gives the same question */
export function examQuestion(spec: Pick<ExamSpec, 'ids' | 'seed'>, i: number): Question | null {
  const c = cardById(spec.ids[i]);
  return c ? questionFor(c, spec.seed * 31 + i) : null;
}

export function newExam(label: string, pool: string[], n: number, seed = newSeed(), ids?: string[], by?: string): ExamSpec {
  const drawn = ids && ids.length ? ids.filter(id => cardById(id) && questionFor(cardById(id)!, seed)).slice(0, 60) : drawExam(pool, n, seed);
  return { label: label.slice(0, 80) || 'A test', pool: [...new Set(pool)].slice(0, 400), seed, ids: drawn, picks: drawn.map(() => null), at: Date.now(), secs: 0, done: false, by: by?.slice(0, 40) };
}

export function readExam(): ExamSpec | null {
  try {
    const x = JSON.parse(sessionStorage.getItem(EXAM_KEY) || 'null');
    if (!x || !Array.isArray(x.ids) || !Array.isArray(x.picks)) return null;
    return { label: String(x.label || 'A test'), pool: Array.isArray(x.pool) ? x.pool.filter((i: unknown) => typeof i === 'string') : [], seed: Number(x.seed) || 0, ids: x.ids.filter((i: unknown) => typeof i === 'string'), picks: x.picks.map((p: unknown) => (typeof p === 'number' ? p : null)), at: Number(x.at) || Date.now(), secs: Number(x.secs) || 0, done: !!x.done, by: typeof x.by === 'string' ? x.by : undefined };
  } catch { return null; }
}
export function writeExam(x: ExamSpec | null) {
  try { if (x) sessionStorage.setItem(EXAM_KEY, JSON.stringify(x)); else sessionStorage.removeItem(EXAM_KEY); } catch { /* the test lives in memory */ }
}

export interface ExamScore {
  n: number;
  right: number;
  answered: number;
  byKind: Partial<Record<CardKind, [number, number]>>;
  misses: { id: string; q: Question; picked: number | null }[];
}

export function scoreExam(spec: ExamSpec): ExamScore {
  const byKind: ExamScore['byKind'] = {};
  const misses: ExamScore['misses'] = [];
  let right = 0, answered = 0;
  spec.ids.forEach((id, i) => {
    const q = examQuestion(spec, i);
    const c = cardById(id);
    if (!q || !c) return;
    const p = spec.picks[i];
    if (p !== null && p !== undefined) answered++;
    const ok = p !== null && p !== undefined && !!q.options[p]?.right;
    if (ok) right++; else misses.push({ id, q, picked: p ?? null });
    const k = byKind[c.kind] || [0, 0];
    byKind[c.kind] = [k[0] + (ok ? 1 : 0), k[1] + 1];
  });
  return { n: spec.ids.length, right, answered, byKind, misses };
}

/** the result as one line a learner can paste anywhere */
export function resultLine(spec: ExamSpec, sc: ExamScore): string {
  const m = Math.max(1, Math.round(spec.secs / 60));
  return 'StepSAFE test · ' + spec.label + ' · ' + sc.right + ' of ' + sc.n + ' (' + Math.round((sc.right / Math.max(1, sc.n)) * 100) + '%) in ' + m + (m === 1 ? ' minute' : ' minutes');
}
