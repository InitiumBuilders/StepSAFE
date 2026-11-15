/* One decision at a time. Every decision of every room can be taken by itself, with the room so far folded
   above it, and without adding to the record. They are taken in an order that changes room every time: the first
   call of each room, then the second of each, and so on, so a learner meets every room before any room twice.
   The place in that order is kept on the device (lib/roomProgress.ts), so the card that offers a decision moves
   on once it has been taken. */

import type { SimModule } from '../content/schema';

/** n is the decision's number in its room, from 1 */
export interface OneCall { simId: string; n: number }

/** how many decisions a room has: counted from its injects once they have loaded, read from the outline before */
export const callCount = (m: SimModule): number => (m.injects.length ? m.injects.filter(i => i.decision).length : m.calls ? m.calls.length : 0);

/** minutes to take each decision of a room by itself: the injects since the decision before, the scene, the
    question and its options at 200 words a minute, and a minute to decide */
export function callMinutes(sim: SimModule): number[] {
  const at = sim.injects.map((inj, i) => (inj.decision ? i : -1)).filter(i => i >= 0);
  return at.map((end, k) => {
    const upTo = sim.injects.slice(k > 0 ? at[k - 1] + 1 : 0, end + 1);
    const call = upTo[upTo.length - 1].decision!;
    const words = (upTo.map(i => i.text).join(' ') + ' ' + call.scene + ' ' + call.prompt + ' ' + call.options.map(o => o.label + ' ' + (o.detail || '')).join(' ')).split(' ').length;
    return Math.max(2, Math.round(words / 200) + 1);
  });
}

export function oneCalls(sims: SimModule[]): OneCall[] {
  const counts = sims.map(callCount);
  const most = Math.max(0, ...counts);
  const out: OneCall[] = [];
  for (let n = 1; n <= most; n++) sims.forEach((m, i) => { if (counts[i] >= n) out.push({ simId: m.id, n }); });
  return out;
}

/** how a call is written in a route: the first is 'one', the third 'one-3' */
export const subOfCall = (n: number) => (n <= 1 ? 'one' : 'one-' + n);

/** the call after this one, in a different room; the last is followed by the first */
export function nextCall(sims: SimModule[], simId: string, n: number): OneCall | null {
  const all = oneCalls(sims);
  if (!all.length) return null;
  const i = all.findIndex(c => c.simId === simId && c.n === n);
  return all[(i + 1) % all.length];
}
