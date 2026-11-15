/* A room in progress is kept on this device, so a learner who is called away returns to the inject they were on.
   It is kept apart from the record: it is not exported, and it is dropped when the room is finished, started over,
   or thirty days old. A saved place is used only if it still fits the room as it is written today. */

import type { SimModule } from '../content/schema';
import { oneCalls, nextCall, type OneCall } from './oneDecision';

export interface RoomTrail { injectId: string; chosenId: string; score: number }
export interface RoomProgress { cursor: number; scores: number[]; bests: boolean[]; trail: RoomTrail[]; at: number }

const KEY = 'stepsafe-room-v1';
const KEEP = 30 * 24 * 60 * 60 * 1000;

function readAll(): Record<string, RoomProgress> {
  try {
    const x = JSON.parse(localStorage.getItem(KEY) || '{}');
    return x && typeof x === 'object' && !Array.isArray(x) ? x : {};
  } catch { return {}; }
}
function writeAll(all: Record<string, RoomProgress>): boolean {
  try {
    if (Object.keys(all).length) localStorage.setItem(KEY, JSON.stringify(all));
    else localStorage.removeItem(KEY);
    return true;
  } catch { return false; /* storage full or blocked: the room carries on in memory */ }
}

/** the saved place in this room, or null when there is none or it no longer fits the room */
export function roomProgress(sim: SimModule, now = Date.now()): RoomProgress | null {
  const p = readAll()[sim.id];
  if (!p || typeof p !== 'object' || typeof p.at !== 'number' || now - p.at > KEEP) return null;
  const { cursor, scores, bests, trail } = p;
  if (!Number.isInteger(cursor) || cursor < 0 || cursor >= sim.injects.length) return null;
  if (!Array.isArray(scores) || !Array.isArray(bests) || !Array.isArray(trail)) return null;
  if (scores.length !== trail.length || bests.length !== trail.length) return null;
  if (cursor === 0 && trail.length === 0) return null;
  /* every decision before this inject has an answer, in order; the decision on this inject may have one */
  const asked = sim.injects.slice(0, cursor + 1).filter(i => i.decision);
  const before = sim.injects.slice(0, cursor).filter(i => i.decision).length;
  if (trail.length < before || trail.length > asked.length) return null;
  for (let k = 0; k < trail.length; k++) {
    const t = trail[k];
    const opt = t && t.injectId === asked[k].id ? asked[k].decision!.options.find(o => o.id === t.chosenId) : undefined;
    if (!opt || opt.score !== t.score || opt.score !== scores[k] || !!opt.isBest !== bests[k]) return null;
  }
  return { cursor, scores: [...scores], bests: [...bests], trail: trail.map(t => ({ injectId: t.injectId, chosenId: t.chosenId, score: t.score })), at: p.at };
}

/** true when the place was written: a browser with storage blocked or full keeps the room in memory only */
export function saveRoom(simId: string, p: Omit<RoomProgress, 'at'>, now = Date.now()): boolean {
  const all = readAll();
  for (const id of Object.keys(all)) if (!all[id] || typeof all[id].at !== 'number' || now - all[id].at > KEEP) delete all[id];
  all[simId] = { ...p, at: now };
  return writeAll(all);
}

export function clearRoom(simId: string): void {
  const all = readAll();
  if (!(simId in all)) return;
  delete all[simId];
  writeAll(all);
}

/** every saved place, every finished run and the place among the single decisions is dropped: the record was erased */
export function clearRooms(): void {
  writeAll({});
  try { localStorage.removeItem(LAST); localStorage.removeItem(ONE); } catch { /* nothing to remove */ }
}

/* ---------- the run before ----------
   A finished run leaves its choices behind, so the next debrief can set the two runs side by side. Only the choices
   are kept: the score and the count of clean decisions are worked out again from the room as it is written today,
   and a run that names a choice the room no longer has is not shown. */

export interface RoomRun { picks: Record<string, string>; score: number; clean: number; at: number }
const LAST = 'stepsafe-room-last-v1';

function readLast(): Record<string, { picks: Record<string, string>; at: number }> {
  try {
    const x = JSON.parse(localStorage.getItem(LAST) || '{}');
    return x && typeof x === 'object' && !Array.isArray(x) ? x : {};
  } catch { return {}; }
}

/** the last finished run of this room, or null when there is none or the room has changed since */
export function roomLastRun(sim: SimModule): RoomRun | null {
  const r = readLast()[sim.id];
  if (!r || typeof r !== 'object' || typeof r.at !== 'number' || !r.picks || typeof r.picks !== 'object') return null;
  const picks: Record<string, string> = {};
  let score = 0, clean = 0, n = 0;
  for (const inj of sim.injects) {
    if (!inj.decision) continue;
    const o = inj.decision.options.find(x => x.id === r.picks[inj.id]);
    if (!o) return null;
    picks[inj.id] = o.id; score += o.score; if (o.isBest) clean++; n++;
  }
  return n ? { picks, score, clean, at: r.at } : null;
}

export function saveLastRun(simId: string, trail: RoomTrail[], now = Date.now()): void {
  const all = readLast();
  const picks: Record<string, string> = {};
  for (const t of trail) picks[t.injectId] = t.chosenId;
  all[simId] = { picks, at: now };
  try { localStorage.setItem(LAST, JSON.stringify(all)); } catch { /* storage full or blocked: the next debrief shows one run */ }
}

/** the rooms with a saved place, newest first. Not checked against the rooms: Ground reads this before they load. */
export function roomsKept(now = Date.now()): { id: string; cursor: number; at: number }[] {
  const all = readAll();
  return Object.keys(all)
    .filter(id => all[id] && typeof all[id].at === 'number' && now - all[id].at <= KEEP && Number.isInteger(all[id].cursor))
    .map(id => ({ id, cursor: all[id].cursor, at: all[id].at }))
    .sort((a, b) => b.at - a.at);
}

/* ---------- the next single decision ----------
   Decisions taken one at a time follow an order (lib/oneDecision.ts). The place in that order is kept here, so the
   card that offers one moves on once it has been taken. It is read from the rooms' outline, so it is known before
   the rooms' text has loaded. */

const ONE = 'stepsafe-one-v1';

/** the decision to offer: the kept one while the rooms still have it, or else the first */
export function onePlace(sims: SimModule[]): OneCall | null {
  const all = oneCalls(sims);
  if (!all.length) return null;
  try {
    const x = JSON.parse(localStorage.getItem(ONE) || 'null');
    const kept = x && typeof x === 'object' ? all.find(c => c.simId === x.simId && c.n === x.n) : undefined;
    if (kept) return kept;
  } catch { /* unreadable: the first is offered */ }
  return all[0];
}

/** a decision was taken by itself. If it was the one on offer, the next in the order is offered from now on. */
export function tookOne(sims: SimModule[], simId: string, n: number): void {
  const at = onePlace(sims);
  if (!at || at.simId !== simId || at.n !== n) return;
  const nxt = nextCall(sims, simId, n);
  try { if (nxt) localStorage.setItem(ONE, JSON.stringify(nxt)); } catch { /* storage full or blocked: the same decision is offered again */ }
}
