/* HARDENING: a defender's week, read from the model.

   Each morning the defender adds the one move the last day says would keep the
   most service for its cost, then runs the day again. The order that comes out is
   a hardening plan: every move in it chosen after the moves before it, so it
   counts how structures compound. Nothing here describes an attack. The days are
   the gauges' own stress day, and the closing check is the hardest day.

   Each move carries a defender's verb. The verbs are five of the seven tactics in
   MITRE D3FEND 1.6.0 (Model, Harden, Detect, Isolate, Restore). The mapping from a
   structure to its verb is ours: a move that cuts a link isolates; otherwise the
   structure's family decides, with a few structures named
   where they do other work than their family's usual. */

import type { ModuxFamily, ModuxGauge, ModuxModel } from '../content/modux-schema';
import { leverage, type Move } from '../content/modux/dynamics';
import { buildState, runState } from './systemStates';
import type { SystemReading } from './systemRead';

export type Verb = 'model' | 'harden' | 'detect' | 'isolate' | 'restore';

export const VERBS: { id: Verb; label: string; line: string; hue: string }[] = [
  { id: 'model', label: 'Model', line: 'Know the system: what depends on what, and who decides.', hue: '#c4b5fd' },
  { id: 'harden', label: 'Harden', line: 'Make a part harder to break.', hue: '#d8effc' },
  { id: 'detect', label: 'Detect', line: 'See trouble while there is still time to act.', hue: '#fdc26f' },
  { id: 'isolate', label: 'Isolate', line: 'Keep a failure from spreading.', hue: '#9cc3ef' },
  { id: 'restore', label: 'Restore', line: 'Bring service back, stronger than before.', hue: '#f18ac6' },
];

const FAMILY_VERB: Record<ModuxFamily, Verb> = {
  identity: 'harden', crypto: 'harden', supply: 'harden', data: 'harden', chain: 'harden', ai: 'harden', si: 'harden',
  trust: 'isolate',
  detect: 'detect',
  resilience: 'restore',
  org: 'model', systems: 'model',
};

/* where a structure does something other than its family's usual work */
const OWN_VERB: Record<string, Verb> = {
  'mm-org-two-person-integrity': 'harden',
  'mm-org-incident-command': 'restore',
  'mm-trust-boundary-ledger': 'model',
  'mm-resilience-cell-architecture': 'isolate',
  'mm-resilience-fail-safe-defaults': 'harden',
  'mm-resilience-error-budgets': 'model',
  'mm-systems-coupling-and-complexity': 'isolate',
};

export function verbOf(kind: Move['kind'], family: ModuxFamily | undefined, id?: string): Verb {
  if (kind === 'breaker') return 'isolate';
  if (id && OWN_VERB[id]) return OWN_VERB[id];
  return family ? FAMILY_VERB[family] : 'harden';
}

export interface Lesson {
  day: number;
  id: string;
  name: string;
  /** the part it enters at */
  where: string;
  verb: Verb;
  /** hours of the planned day this move adds, after the moves before it */
  gain: number;
  cost: number;
  /** the planned day's hours kept once it is in place */
  kept: number;
}

/** the day a plan is made for: the stress day, or the hardest day */
export type PlanFor = 'stress' | 'hardest';

export interface Week {
  /** hours kept on the first day, with only the stack in place */
  start: number;
  lessons: Lesson[];
  /** hours kept on the last day */
  end: number;
  /** hours kept on the hardest day once every lesson is in place */
  hardest: number;
  /** the parts still below half their function at the end of that hardest day */
  stillFalls: string[];
  /** the stack the week started from */
  from: string[];
  /** the day the plan was made for */
  planFor: PlanFor;
}

const MIN_GAIN = 0.3;

export function hardeningWeek(gauge: ModuxGauge, byId: Map<string, ModuxModel>, reading: SystemReading, from: string[] = [], days = 6, planFor: PlanFor = 'stress'): Week {
  const stack = [...from];
  const dayOf = (s: string[]) => runState(buildState(planFor === 'hardest' ? 'adversary' : 'stress', { gauge, byId, stack: s, reading })).kept;
  const start = dayOf(stack);
  let kept = start;
  const lessons: Lesson[] = [];
  for (let d = 1; d <= days && kept < 24 - 1e-6; d++) {
    let pick: { id: string; name: string; where: string; kind: Move['kind']; cost: number; gain: number; kept: number } | null = null;
    if (planFor === 'stress') {
      const m = leverage(gauge, stack, byId, [], new Set(), 1).moves[0];
      if (m) pick = { ...m, gain: m.kept, kept: dayOf([...stack, m.id]) };
    } else {
      /* every move the model can place, judged by the hours it keeps on the hardest day for its cost */
      let best = 0;
      for (const m of leverage(gauge, stack, byId, [], new Set(), 99).moves) {
        const k2 = dayOf([...stack, m.id]);
        const score = (k2 - kept) / m.cost;
        if (score > best) { best = score; pick = { ...m, gain: Math.round((k2 - kept) * 10) / 10, kept: k2 }; }
      }
    }
    if (!pick || pick.gain < MIN_GAIN) break;
    stack.push(pick.id);
    kept = pick.kept;
    lessons.push({ day: d, id: pick.id, name: pick.name, where: pick.where, verb: verbOf(pick.kind, byId.get(pick.id)?.family, pick.id), gain: pick.gain, cost: pick.cost, kept });
  }
  const last = runState(buildState('adversary', { gauge, byId, stack, reading }));
  const end = last.samples[last.samples.length - 1];
  const stillFalls = end ? Object.keys(end.health).filter(id => end.health[id] < 0.5) : [];
  return { start, lessons, end: kept, hardest: last.kept, stillFalls, from, planFor };
}

/** the week as a plain hardening plan, for a team to take away */
export function planMarkdown(o: {
  name: string; url?: string; week: Week; partName: (id: string) => string; stackLabel?: string;
  own?: { move: string; why: string }[]; sources?: { label: string; url: string }[]; date: string;
}): string {
  const h = (x: number) => (Math.round(x * 10) / 10).toString();
  const verb = (v: Verb) => VERBS.find(x => x.id === v)!.label;
  const out: string[] = [];
  out.push('# Hardening plan: ' + o.name, '');
  if (o.url) out.push(o.url, '');
  out.push('From StepSAFE :: The Praxis (https://unitium-safe.vercel.app), ' + o.date + '.', '');
  const dayName = o.week.planFor === 'hardest' ? 'hardest day (every pressure at full strength, unseen, where it does the most harm)' : 'stress day';
  out.push('Each move was chosen by the gauges’ system model after the moves before it, so the order counts how they compound. The plan is made for the ' + dayName + '. Hours are hours of service kept over that 24 hour day in the model, not a forecast of a real incident.', '');
  out.push('## The order to act', '');
  out.push('Day 1: ' + (o.week.from.length ? 'with ' + (o.stackLabel || 'the stack') + ' in place' : 'with nothing in place') + ', the system keeps ' + h(o.week.start) + ' of 24 hours.', '');
  for (const l of o.week.lessons) {
    out.push((l.day) + '. **' + l.name + '** at ' + o.partName(l.where) + ' (' + verb(l.verb) + '). Adds ' + h(l.gain) + ' hours. The day then keeps ' + h(l.kept) + ' of 24.');
  }
  if (!o.week.lessons.length) out.push('The model finds no single move that keeps more of the day.');
  out.push('', 'On the hardest day, with every move above in place, the system keeps ' + h(o.week.hardest) + ' of 24 hours.', '');
  out.push('## The five verbs', '');
  for (const v of VERBS) out.push('- **' + v.label + '**: ' + v.line);
  out.push('', 'The verbs are five of the seven tactics in MITRE D3FEND (https://d3fend.mitre.org).', '');
  if (o.own && o.own.length) {
    out.push('## What ' + o.name.replace(/^The /, 'the ') + ' leans on', '');
    for (const x of o.own) out.push('- **' + x.move + '**: ' + x.why);
    out.push('');
  }
  if (o.sources && o.sources.length) {
    out.push('## Sources', '');
    for (const s of o.sources) out.push('- ' + s.label + ': ' + s.url);
    out.push('');
  }
  return out.join('\n');
}
