/* The lessons that teach a check statement's move (content/check/learn.ts), resolved for the page: what each one
   is, where it lives, whether the learner has done it, and the route that opens it. An id names its kind by its
   prefix: sg- a StepGuide, tr- a gauge, sim- a simulation, anything else a Step of a chapter. */

import { LEARN } from '../content/check/learn';
import { stepById, guideById, simById } from '../content/registry';
import { GAUGES } from '../content/modux/gauges';
import type { S, ViewKey } from './state';

export type LessonKind = 'step' | 'guide' | 'gauge' | 'sim';
export interface Lesson {
  id: string;
  kind: LessonKind;
  title: string;
  /** where it lives: a Step's chapter, a guide's domain, a gauge's organisation; empty for a simulation */
  where: string;
  done: boolean;
  /** a Step that runs in Motus mode, met by a learner in Novus */
  motus: boolean;
  route: { view: ViewKey; id: string };
}

export const KIND_LABEL: Record<LessonKind, string> = { step: 'Step', guide: 'StepGuide', gauge: 'Gauge', sim: 'Simulation' };

export const lessonKind = (id: string): LessonKind =>
  id.startsWith('sg-') ? 'guide' : id.startsWith('tr-') ? 'gauge' : id.startsWith('sim-') ? 'sim' : 'step';

type Progress = Pick<S, 'completedSteps' | 'guidesRead' | 'gauges' | 'completedSims' | 'mode'>;

export function lessonOf(id: string, s: Progress): Lesson | null {
  const kind = lessonKind(id);
  if (kind === 'guide') {
    const g = guideById(id);
    return g ? { id, kind, title: g.title, where: g.domain, done: !!s.guidesRead[id], motus: false, route: { view: 'guides', id } } : null;
  }
  if (kind === 'gauge') {
    const g = GAUGES.find(x => x.id === id);
    return g ? { id, kind, title: g.title, where: g.org, done: !!s.gauges[id], motus: false, route: { view: 'modux-gauge', id } } : null;
  }
  if (kind === 'sim') {
    const m = simById(id);
    return m ? { id, kind, title: m.title, where: '', done: !!s.completedSims[id], motus: false, route: { view: 'sim', id } } : null;
  }
  const l = stepById(id);
  return l ? { id, kind, title: l.step.title, where: l.chapter.title, done: !!s.completedSteps[id], motus: l.step.mode === 'motus' && s.mode === 'novus', route: { view: 'step', id } } : null;
}

/** the lessons for one statement, in the order they were chosen */
export const lessonsFor = (itemId: string, s: Progress): Lesson[] =>
  (LEARN[itemId] || []).map(id => lessonOf(id, s)).filter((l): l is Lesson => !!l);

const BLANK: Progress = { completedSteps: {}, guidesRead: {}, gauges: {}, completedSims: {}, mode: 'motus' };
/** the lessons for a statement as one line of a record: what each is and its title, nothing about the learner */
export const lessonLine = (itemId: string) =>
  lessonsFor(itemId, BLANK).map(l => KIND_LABEL[l.kind] + ': ' + l.title + (l.where ? ' (' + l.where + ')' : '')).join('; ');

/** a gap whose every lesson is done: the check offers to answer it again */
export const readyToRecheck = (itemId: string, s: Progress) => {
  const ls = lessonsFor(itemId, s);
  return ls.length > 0 && ls.every(l => l.done);
};
