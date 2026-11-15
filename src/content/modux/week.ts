/* THIS WEEK'S PRESSURE. One gauge and one pressure from the library, the
   same for everyone in the same week, chosen by the week's number alone so
   every learner, class and team faces the same day. The week is held when
   the gauge holds at notch one with that pressure on. */

import type { ModuxGauge, Pressure } from '../modux-schema';
import { GAUGES } from './gauges';
import { PRESSURES } from './pressures';
import { fnv, rng } from './escalate';

export interface WeekChallenge { key: string; gauge: ModuxGauge; pressure: Pressure; monday: Date; sunday: Date }

/** the ISO week, as 2026-W42 */
export function weekKey(now = new Date()): string {
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const y = d.getUTCFullYear();
  const start = new Date(Date.UTC(y, 0, 1));
  const w = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + 1) / 7);
  return y + '-W' + String(w).padStart(2, '0');
}

function bounds(now: Date): { monday: Date; sunday: Date } {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = d.getDay() || 7;
  const monday = new Date(d); monday.setDate(d.getDate() - day + 1);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

/** the pressures that could be the week's: early enough for notch one, aimed at a kind the gauge has, fitting its sector */
export function weekCandidates(gauge: ModuxGauge): Pressure[] {
  const kinds = new Set(gauge.system.nodes.map(n => n.kind));
  return PRESSURES.filter(p => !p.open && !p.weakens && p.from <= 1 && kinds.has(p.target) && (p.fits.length === 0 || p.fits.some(t => gauge.tags.includes(t))));
}

export function weekChallenge(now = new Date()): WeekChallenge {
  const key = weekKey(now);
  const r = rng(fnv('week|' + key));
  /* a gauge the week's number points at, then a pressure the same number picks from what fits it */
  let gauge = GAUGES[Math.floor(r() * GAUGES.length)];
  let pool = weekCandidates(gauge);
  for (let i = 0; pool.length === 0 && i < GAUGES.length; i++) { gauge = GAUGES[(GAUGES.indexOf(gauge) + 1) % GAUGES.length]; pool = weekCandidates(gauge); }
  const pressure = pool[Math.floor(r() * pool.length)];
  return { key, gauge, pressure, ...bounds(now) };
}

/** whether a run log entry is this week's held day */
export function heldThisWeek(log: { week?: string; held: boolean }[], now = new Date()): boolean {
  const key = weekKey(now);
  return log.some(l => l.week === key && l.held);
}
