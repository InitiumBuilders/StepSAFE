/* When a chapter opens. Kept apart from the Chapters view so the engine, the hidden chapter's keys and the
   insights can ask without loading the view (views/ChaptersView.tsx re-exports both). */

import { CHAPTERS } from '../content/registry';
import type { Chapter } from '../content/schema';

/* The gate: a prerequisite chapter opens its dependents at 2 of its Pages —
   momentum earned, not the whole arc. Locking a chapter in fully remains its own
   reward (the seal, the unit member, the credential); the door just opens
   sooner. A short chapter (fewer than 2 pages) requires all of them. */
export function prereqSatisfied(
  prereqId: string,
  completedChapters: Record<string, number>,
  completedPages: Record<string, number>
): boolean {
  if (completedChapters[prereqId]) return true;
  const pc = CHAPTERS.find(x => x.id === prereqId);
  if (!pc) return false;
  const need = Math.min(2, pc.pages.length);
  return pc.pages.filter(p => completedPages[p.id]).length >= need;
}

export function chapterUnlocked(
  c: Chapter,
  completedChapters: Record<string, number>,
  completedPages: Record<string, number>
): boolean {
  return c.prereq.every(id => prereqSatisfied(id, completedChapters, completedPages));
}
