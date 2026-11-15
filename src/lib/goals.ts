/* GOALS: a goal is a number the record can answer. Eleven measured kinds, each
   read from the record by the same functions the rest of the Praxis uses, and
   one kind in the learner's own words that they mark done themselves. */

import type { S, GoalKey } from './state';
import type { ServiceRecordData } from './service';

export interface GoalKind {
  key: GoalKey;
  label: string;
  unit: string;
  /** three milestones offered when a goal of this kind is set */
  suggest: number[];
  title: (n: number) => string;
}

const plural = (n: number, one: string, many: string) => n + ' ' + (n === 1 ? one : many);

export const GOAL_KINDS: GoalKind[] = [
  { key: 'people', label: 'People held for', unit: 'people', suggest: [10000, 100000, 1000000], title: n => 'Hold for ' + n.toLocaleString() + ' people' },
  { key: 'hours', label: 'Hours of service kept', unit: 'hours', suggest: [24, 100, 360], title: n => 'Keep ' + n + ' hours of service' },
  { key: 'gauges', label: 'Gauges held', unit: 'gauges', suggest: [1, 5, 15], title: n => 'Hold ' + plural(n, 'gauge', 'gauges') },
  { key: 'notch', label: 'Highest notch held', unit: 'notch', suggest: [1, 3, 5, 7], title: n => 'Hold a gauge at notch ' + n },
  { key: 'streak', label: 'Day streak', unit: 'days', suggest: [3, 7, 30], title: n => 'A ' + n + ' day streak' },
  { key: 'chapters', label: 'Chapters locked in', unit: 'chapters', suggest: [1, 3, 12], title: n => 'Lock in ' + plural(n, 'chapter', 'chapters') },
  { key: 'steps', label: 'Steps sealed', unit: 'steps', suggest: [10, 50, 200], title: n => 'Seal ' + plural(n, 'step', 'steps') },
  { key: 'rooms', label: 'Rooms commanded', unit: 'rooms', suggest: [1, 5, 12], title: n => 'Command ' + plural(n, 'room', 'rooms') },
  { key: 'guides', label: 'Guides read', unit: 'guides', suggest: [5, 20, 55], title: n => 'Read ' + plural(n, 'guide', 'guides') },
  { key: 'cards', label: 'Cards held in StudyMode', unit: 'cards', suggest: [10, 50, 200], title: n => 'Hold ' + plural(n, 'card', 'cards') + ' in StudyMode' },
  { key: 'unitia', label: 'UNITIA earned', unit: 'UNITIA', suggest: [10, 100, 1000], title: n => 'Earn ' + n.toLocaleString() + ' UNITIA' },
];

export function kindOf(key: GoalKey): GoalKind | null {
  return GOAL_KINDS.find(k => k.key === key) || null;
}

/** where the record stands for a kind of goal; an own goal stands at 0 until it is marked done */
export function goalProgress(s: S, sr: ServiceRecordData, key: GoalKey): number {
  switch (key) {
    case 'people': return sr.people;
    case 'hours': return Math.round(sr.hours * 10) / 10;
    case 'gauges': return sr.held;
    case 'notch': return Math.max(-1, ...Object.values(s.gauges).map(r => r.top ?? -1)) + 1;
    case 'streak': return s.streak;
    case 'chapters': return Object.keys(s.completedChapters).length;
    case 'steps': return Object.keys(s.completedSteps).length;
    case 'rooms': return Object.keys(s.completedSims).length;
    case 'guides': return Object.keys(s.guidesRead).length;
    case 'cards': return Object.values(s.study || {}).filter(c => (c.box || 0) >= 4).length;
    case 'unitia': return Math.floor((s.unitiaC || 0) / 100);
    default: return 0;
  }
}

/** the notch kind counts from Ground as 1, so a target of n means "held at notch n" */
export function goalTargetValue(key: GoalKey, target: number): number {
  return key === 'notch' ? target + 1 : target;
}

export function fmtDay(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
