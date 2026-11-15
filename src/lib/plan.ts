/* THE PLAN: a run written out as plain text a practitioner can carry into a
   meeting. The organisation and who it serves, the day the model gives this
   stack, what fell and in what order, the structures in place and what each
   defeats, and the moves that keep the most hours per point of budget. Every
   number is the model's; nothing is added to it. */

import type { ModuxGauge, ModuxModel } from '../content/modux-schema';
import { fmtHours, type Move } from '../content/modux/dynamics';
import { localDay } from './day';

export interface PlanInput {
  gauge: ModuxGauge;
  notch: number;
  stack: string[];
  byId: Map<string, ModuxModel>;
  /** hours of service lost on the stress day with this stack */
  lost: number;
  /** the day as a range: the stress day and the spread day */
  range?: { lo: number; hi: number };
  fall: { id: string; hour: number | null; kind?: string }[];
  moves: Move[];
  people: string | null;
  score?: number;
  verdict?: string;
  reference?: number;
  at?: Date;
}

const h = fmtHours;

export function planText(p: PlanInput): string {
  const g = p.gauge;
  const name = (id: string) => g.system.nodes.find(n => n.id === id)?.name || id;
  const kept = Math.max(0, 24 - p.lost);
  const lines: string[] = [];
  lines.push('THE PLAN · ' + g.org);
  lines.push(g.title + (p.notch ? ' · notch ' + p.notch : ' · Ground') + ' · ' + localDay((p.at || new Date()).getTime()));
  if (g.sector) lines.push('Serves: ' + g.sector);
  lines.push('');
  lines.push('THE DAY');
  const words = p.range ? ((Math.round(p.range.hi) - Math.round(p.range.lo) <= 1 ? 'about ' + Math.round(p.range.lo) : Math.round(p.range.lo) + ' to ' + Math.round(p.range.hi)) + ' of 24 hours') : 'about ' + Math.round(kept) + ' of 24 hours';
  lines.push('This stack keeps ' + words + ' of service' + (p.people ? ' for ' + p.people : '') + '.');
  if (typeof p.score === 'number') lines.push('Score ' + p.score + (typeof p.reference === 'number' ? ' against a reference of ' + p.reference : '') + (p.verdict ? ' · ' + (p.verdict === 'holds' ? 'the stack holds' : 'breached') : '') + '.');
  const fell = p.fall.filter(f => f.hour !== null);
  if (fell.length) {
    lines.push('');
    lines.push('THE ORDER OF THE FALL');
    for (const f of fell) lines.push('- ' + name(f.id) + ': ' + (f.kind === 'public' ? 'trust under half by hour ' : 'under half by hour ') + Math.round(f.hour as number));
    const held = p.fall.length - fell.length;
    lines.push('- ' + held + ' of ' + p.fall.length + ' parts held the day');
  } else {
    lines.push('');
    lines.push('No part dropped under half its function. Every part held the day.');
  }
  lines.push('');
  lines.push('THE THREATS');
  for (const t of g.threats) lines.push('- ' + t.name + ' (weight ' + t.weight + ', hits ' + name(t.target) + '): ' + t.move);
  lines.push('');
  lines.push('IN PLACE' + (p.stack.length ? '' : ': nothing yet'));
  for (const id of p.stack) {
    const m = p.byId.get(id);
    if (m) lines.push('- ' + m.name + ' (' + m.tier + '): ' + m.statement);
  }
  if (p.moves.length) {
    lines.push('');
    lines.push('WHERE TO ACT NEXT · hours of service kept per point of budget');
    for (const m of p.moves) {
      const model = p.byId.get(m.id);
      const where = m.kind === 'breaker' ? 'a breaker into ' + name(m.where) : (m.kind === 'layer' ? 'a first layer on ' : 'a second layer on ') + (m.threat ? (g.threats.find(t => t.id === m.threat)?.name || name(m.where)) : name(m.where));
      lines.push('- ' + m.name + ': ' + where + ' · ' + m.cost + ' budget · keeps ' + h(m.kept) + ' more hours' + (model ? '. ' + model.statement : ''));
    }
  }
  lines.push('');
  lines.push('WHAT THIS NUMBER IS');
  lines.push('The model runs a day with every threat landing in the first hour, which is the floor, and a day with the threats spread across it, which is the most this stack keeps. The hours are a comparison between stacks on the same map, not a prediction of an incident. The model, its constants and the incidents it is checked against are written down in the guide The Model, Written Down.');
  lines.push('Counted by StepSAFE :: The Praxis.');
  return lines.join('\n');
}
