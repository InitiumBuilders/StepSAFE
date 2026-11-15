/* A STUDY SESSION: the queue of cards a learner is moving through, where it
   came from, when it began, the UNITIA balance when it began, and a tally
   of what happened in it. It lives in sessionStorage, so a reload keeps
   the place and a new tab starts fresh. Any page can start one: the gauge
   page sends its threats and structures, a stack sends its models, a
   chapter sends its Steps, the Watch sends what is due. */

import type { Act } from '../state';

export const SESSION_KEY = 'stepsafe-study-session';
export const SESSION_CAP = 200;

export interface SessionTally { graded: number; again: string[]; right: number; wrong: number; rated: number }
export interface StudySession {
  ids: string[];
  label: string;
  /** when it began */
  at: number;
  /** the UNITIA balance (hundredths) when it began */
  startC: number;
  /** cards whose related cards should join the queue once the deck is loaded */
  expand?: boolean;
  /** the session reads itself aloud and moves on its own */
  listen?: boolean;
  tally: SessionTally;
}

export const EMPTY_TALLY: SessionTally = { graded: 0, again: [], right: 0, wrong: 0, rated: 0 };

export function readSession(): StudySession {
  try {
    const x = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (x && Array.isArray(x.ids)) return { ids: x.ids.filter((i: unknown) => typeof i === 'string').slice(0, SESSION_CAP), label: String(x.label || 'StudyMode'), at: Number(x.at) || 0, startC: Number(x.startC) || 0, expand: !!x.expand, listen: !!x.listen, tally: { ...EMPTY_TALLY, ...(x.tally || {}) } };
  } catch { /* a fresh session */ }
  return { ids: [], label: 'StudyMode', at: 0, startC: 0, tally: { ...EMPTY_TALLY } };
}

export function writeSession(x: StudySession) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(x)); } catch { /* the session lives in memory */ }
}

/** a new session: ids deduplicated in order and capped */
export function newSession(ids: string[], label: string, startC: number, at = Date.now(), expand = false): StudySession {
  const clean = [...new Set(ids.filter(id => typeof id === 'string' && id.includes(':')))].slice(0, SESSION_CAP);
  return { ids: clean, label: label.slice(0, 80) || 'StudyMode', at, startC, expand, tally: { ...EMPTY_TALLY } };
}

/** start a session from any page: write it, then route to its first card */
export function studyRoute(d: (a: Act) => void, ids: string[], label: string, startC: number, expand = false): boolean {
  const ses = newSession(ids, label, startC, Date.now(), expand);
  if (!ses.ids.length) return false;
  writeSession(ses);
  d({ t: 'route', view: 'study', id: ses.ids[0] });
  return true;
}

export type SessionEvent = { kind: 'grade'; id: string; grade: 0 | 1 | 2 | 3 } | { kind: 'quiz'; right: boolean } | { kind: 'rate' };

/** the tally after an event: grades counted, the cards marked Again kept once, questions and ratings counted */
export function applyEvent(t: SessionTally, e: SessionEvent): SessionTally {
  if (e.kind === 'grade') return { ...t, graded: t.graded + 1, again: e.grade === 0 ? [...new Set([...t.again, e.id])] : t.again.filter(x => x !== e.id) };
  if (e.kind === 'quiz') return { ...t, right: t.right + (e.right ? 1 : 0), wrong: t.wrong + (e.right ? 0 : 1) };
  return { ...t, rated: t.rated + 1 };
}

/** the card ids a learner's record says are due now, in the order they fell due */
export function dueIds(study: Record<string, { due?: number }>, now = Date.now()): string[] {
  return Object.entries(study).filter(([, c]) => typeof c.due === 'number' && c.due <= now).sort((a, b) => (a[1].due || 0) - (b[1].due || 0)).map(([id]) => id);
}

/** the card ids rated in the FUD range, lowest first */
export function fudIds(study: Record<string, { sound?: number }>): string[] {
  return Object.entries(study).filter(([, c]) => typeof c.sound === 'number' && c.sound < 1).sort((a, b) => (a[1].sound || 0) - (b[1].sound || 0)).map(([id]) => id);
}

/* a test asked for from a page outside StudyMode (a chapter, a link): written here, built by StudyView, which has the deck */
export const EXAM_REQUEST = 'stepsafe-study-exam-request';
export interface ExamRequest { label: string; pool: string[]; n: number; ids?: string[]; seed?: number; by?: string; expand?: boolean }
export function requestExam(d: (a: Act) => void, req: ExamRequest) {
  try { sessionStorage.setItem(EXAM_REQUEST, JSON.stringify({ ...req, pool: req.pool.slice(0, 400), label: req.label.slice(0, 80) })); } catch { /* memory only */ }
  d({ t: 'route', view: 'study', sub: 'test' });
}
export function takeExamRequest(): ExamRequest | null {
  try { const x = JSON.parse(sessionStorage.getItem(EXAM_REQUEST) || 'null'); sessionStorage.removeItem(EXAM_REQUEST); return x && Array.isArray(x.pool) ? x : null; } catch { return null; }
}
