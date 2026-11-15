/* THE SERVICE RECORD: what the learner's held gauges amount to in people
   and hours, counted by the same model the World runs.

   For every gauge on the record that holds, the gauge is escalated to the
   highest notch held, the stack on the record is placed, and the stress day
   is run. Hours kept is 24 minus the hours of service the model lost. People
   comes from the gauge's own sector line. Nothing here is a claim: a run with
   a different stack gives a different number, and a forged gauge with no
   count in its sector line adds no people. MoTRUS structures live in the
   vault and are not placed here, so a stack that held through one counts
   only its catalog structures. */

import { MODUX_MODELS } from '../content/registry';
import { GAUGES } from '../content/modux/gauges';
import { escalate } from '../content/modux/escalate';
import { buildModel, stressDay } from '../content/modux/dynamics';
import type { ModuxGauge } from '../content/modux-schema';
import type { S } from './state';
import { peopleOf, peopleCount } from './people';

export interface ServiceLine {
  id: string;
  title: string;
  org: string;
  notch: number;
  people: number;
  peopleLabel: string | null;
  hoursKept: number;
  runs: number;
  at: number;
}

export interface ServiceRecordData {
  lines: ServiceLine[];
  /** people across every held gauge */
  people: number;
  /** people across every gauge the learner could hold */
  peopleAll: number;
  /** hours of service kept, summed over held gauges */
  hours: number;
  /** gauges held and gauges in reach */
  held: number;
  gaugesAll: number;
  runs: number;
  /** distinct days with any move in the last thirty, and ever */
  days30: number;
  daysAll: number;
}

const DAY = 86400000;

function dayKey(ms: number): string {
  const d = new Date(ms);
  return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
}

export function serviceRecord(s: S, now = Date.now()): ServiceRecordData {
  const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
  const all: ModuxGauge[] = [...GAUGES, ...s.forged];
  const lines: ServiceLine[] = [];
  let runs = 0;

  for (const [id, rec] of Object.entries(s.gauges)) {
    runs += rec.runs;
    if (!rec.held || rec.top < 0) continue;
    const base = all.find(g => g.id === id);
    if (!base) continue;
    const used = (s.gaugeSessions[id]?.used || []).slice(0, rec.top);
    let hoursKept = 0;
    try {
      const esc = escalate(base, used);
      const weakened = new Set(esc.weakened.map(w => w.model));
      const lost = stressDay(buildModel(esc.gauge, rec.stack, byId, [], weakened));
      hoursKept = Math.max(0, Math.min(24, 24 - lost));
    } catch {
      hoursKept = 0;
    }
    lines.push({
      id, title: base.title, org: base.org, notch: rec.top,
      people: peopleCount(base.sector), peopleLabel: peopleOf(base.sector),
      hoursKept, runs: rec.runs, at: rec.at,
    });
  }
  lines.sort((a, b) => b.people * b.hoursKept - a.people * a.hoursKept || b.at - a.at);

  const days = new Set<string>();
  const days30 = new Set<string>();
  const mark = (ms: unknown) => {
    if (typeof ms !== 'number' || !isFinite(ms) || ms <= 0) return;
    const k = dayKey(ms);
    days.add(k);
    if (now - ms < 30 * DAY) days30.add(k);
  };
  for (const r of s.runLog) mark(r.at);
  for (const v of Object.values(s.completedSims)) mark(v.at);
  for (const v of Object.values(s.completedSteps)) mark(v);

  return {
    lines,
    people: lines.reduce((n, l) => n + l.people, 0),
    peopleAll: all.reduce((n, g) => n + peopleCount(g.sector), 0),
    hours: lines.reduce((n, l) => n + l.hoursKept, 0),
    held: lines.length,
    gaugesAll: all.length,
    runs,
    days30: days30.size,
    daysAll: days.size,
  };
}
