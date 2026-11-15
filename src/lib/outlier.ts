/* The three keys to the hidden chapter: The Keeper has opened, a gauge has
   been run, and a known system has been chosen in Map your own system. */

import { CHAPTERS } from '../content/registry';
import { KEEPER_ID } from '../content/outlier/ids';
import { chapterUnlocked } from './unlock';
import type { S } from './state';

export const KNOWN_FIRST = 'known:';
export const OUTLIER_OPENED = 'outlier-open';

export function outlierKeys(s: Pick<S, 'completedChapters' | 'completedPages' | 'runLog' | 'gauges' | 'firsts'>) {
  const keeper = CHAPTERS.find(c => c.id === KEEPER_ID);
  return {
    keeper: !!keeper && chapterUnlocked(keeper, s.completedChapters, s.completedPages),
    gauge: s.runLog.length > 0 || Object.values(s.gauges).some(g => (g.runs || 0) > 0),
    known: Object.keys(s.firsts).some(k => k.startsWith(KNOWN_FIRST)),
  };
}

export function outlierOpen(s: Parameters<typeof outlierKeys>[0]): boolean {
  const k = outlierKeys(s);
  return k.keeper && k.gauge && k.known;
}

/** the chapter can be read: its three keys are held, or the learner is in MOTUS mode (chosen or previewed).
    The opening itself, its award and its toast, still waits for the three keys. */
export function outlierVisible(s: Parameters<typeof outlierKeys>[0] & Pick<S, 'mode'>): boolean {
  return s.mode === 'motus' || outlierOpen(s);
}

/** the known systems this learner has chosen, by id */
export function knownChosen(s: Pick<S, 'firsts'>): string[] {
  return Object.keys(s.firsts).filter(k => k.startsWith(KNOWN_FIRST)).map(k => k.slice(KNOWN_FIRST.length));
}
