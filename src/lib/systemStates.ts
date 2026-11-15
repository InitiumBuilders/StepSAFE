/* THE STATES A SYSTEM CAN BE PUT IN. One definition, used by the flat map and by
   the World, so both always show the same day. Each state is the gauges' own model
   with one thing changed, and every number it produces comes from running it:

   - calm: no threat lands
   - the stress day: every threat lands in the first hour
   - the keystone falls: a blow nothing holds lands on the keystone
   - the hardest day: every pressure at full strength, all in the first quarter hour,
     with nothing to see them coming, landing where they do the most harm: either on
     their own parts or each on the part of its kind whose fall spreads furthest,
     whichever the model says costs more. It tests the defense; it describes no attack.
   - the strongest moves: the same hardest day, against the stack plus the moves the
     model rates highest for this system

   The stack is whatever is in place: the learner's in a gauge, the reference stack
   on a known system's map, or nothing. */

import type { GaugeThreat, ModuxGauge, ModuxModel } from '../content/modux-schema';
import type { MotrusPlay } from '../content/modux/score';
import { buildModel, leverage, simulate, DWELL, type DynModel, type Sample } from '../content/modux/dynamics';
import type { SystemReading } from './systemRead';

export type StateId = 'calm' | 'stress' | 'keystone' | 'adversary' | 'strongest';

export const STATES: { id: StateId; label: string; short: string; line: string }[] = [
  { id: 'calm', label: 'A calm day', short: 'Calm', line: 'No threat lands. Service flows the way the system is built to carry it.' },
  { id: 'stress', label: 'The stress day', short: 'Stress day', line: 'Every threat lands in the first hour.' },
  { id: 'keystone', label: 'The keystone falls', short: 'Keystone falls', line: 'A blow that nothing holds takes out the keystone at the start of the day. Watch how far the loss travels.' },
  { id: 'adversary', label: 'The hardest day', short: 'Hardest day', line: 'Every pressure at full strength, landing where it does the most harm, all in the first quarter hour and unseen.' },
  { id: 'strongest', label: 'The hardest day, against the strongest moves', short: 'Strongest moves', line: 'The hardest day again, against the stack in place plus the three moves the model rates highest here.' },
];

export interface StateRun {
  id: StateId;
  model: DynModel;
  arrivals: { id: string; at: number }[];
  /** what lands, for a scene that draws each blow */
  blows: { threat: GaugeThreat; stopped: boolean }[];
  /** the moves added for the strongest moves state */
  added: string[];
}

export interface StateOpts {
  gauge: ModuxGauge;
  byId: Map<string, ModuxModel>;
  stack: string[];
  reading: SystemReading;
  plays?: MotrusPlay[];
  weakened?: Set<string>;
}

/** the hardest day: full strength and unseen, on whichever placement costs the system more */
function aimed(base: DynModel, reading: SystemReading): DynModel {
  const reachOf = (n: string) => reading.reach[n]?.length || 0;
  const open = base.threats.filter(x => x.open);
  const where = (spread: boolean): DynModel => ({ ...base, threats: [...open, ...base.threats.filter(x => !x.open).map(x => {
    const same = base.nodes.filter(n => base.kinds[n] === base.kinds[x.target]).sort((a, b) => reachOf(b) - reachOf(a));
    return { ...x, target: spread ? x.target : same[0] || x.target, p: 1, detect: 0 };
  })] });
  const lostOf = (m: DynModel) => simulate(m, m.threats.filter(x => !x.open).map((x, i) => ({ id: x.id, at: 0.1 + i * 0.02 }))).state.lost;
  const a = where(false), b = where(true);
  return lostOf(b) > lostOf(a) ? b : a;
}

export function buildState(id: StateId, o: StateOpts): StateRun {
  const plays = o.plays || [], weakened = o.weakened || new Set<string>();
  const base = buildModel(o.gauge, o.stack, o.byId, plays, weakened);
  const g = o.gauge;
  if (id === 'calm') return { id, model: base, arrivals: [], blows: [], added: [] };
  if (id === 'stress') {
    const live = base.threats.filter(x => !x.open);
    return {
      id, model: base, added: [],
      arrivals: live.map((x, i) => ({ id: x.id, at: 0.5 + i * 0.1 })),
      blows: g.threats.filter(x => !x.open).map(x => ({ threat: x, stopped: (base.threats.find(y => y.id === x.id)?.layers || 0) > 0 })),
    };
  }
  if (id === 'keystone') {
    if (!o.reading.keystone) return buildState('stress', o);
    const k = o.reading.keystone;
    const blow = { id: 'x-keystone', name: 'The keystone falls', target: k, p: 1, layers: 0, detect: 0, open: false };
    return {
      id, added: [],
      model: { ...base, threats: [...base.threats, blow] },
      arrivals: [{ id: blow.id, at: 0.2 }],
      blows: [{ threat: { id: blow.id, name: blow.name, move: 'A blow that nothing holds lands on the keystone.', counters: [], weight: 3, target: k }, stopped: false }],
    };
  }
  let added: string[] = [];
  let from = base;
  if (id === 'strongest') {
    added = leverage(g, o.stack, o.byId, plays, weakened, 3).moves.map(x => x.id);
    from = buildModel(g, [...new Set([...o.stack, ...added])], o.byId, plays, weakened);
  }
  const m = aimed(from, o.reading);
  const re = m.threats.filter(x => !x.open);
  return {
    id, model: m, added,
    arrivals: re.map((x, i) => ({ id: x.id, at: 0.1 + i * 0.02 })),
    blows: re.map(x => { const src = g.threats.find(y => y.id === x.id); return src ? { threat: { ...src, target: x.target }, stopped: x.layers > 0 } : null; })
      .filter((b): b is { threat: GaugeThreat; stopped: boolean } => !!b),
  };
}

/** a state's whole day: the hourly samples and the hours of service kept */
export function runState(r: StateRun): { samples: Sample[]; kept: number; trust: number } {
  const { state, samples } = simulate(r.model, r.arrivals);
  return { samples, kept: Math.max(0, 24 - state.lost), trust: state.trust };
}

/** the system's beat: how fast each kind of link carries a failure, and how long a threat pushes unseen */
export const BEAT = { live: 0.25, people: 1, supply: 3, unseen: DWELL };
