/* The way into practice, on Ground and on The Practice. A room left part way leads, with Continue: rooms run an
   hour or more, so coming back to one is the common case. Otherwise one decision: the next call in the order
   (lib/oneDecision.ts), with the minutes it takes, which moves on once it has been taken. Both read the rooms'
   outline, so the card is on the page from the first paint. */

import React, { useMemo } from 'react';
import { SIMS } from '../content/registry';
import { useS } from '../lib/state';
import { callCount, subOfCall } from '../lib/oneDecision';
import { onePlace, roomsKept, roomProgress } from '../lib/roomProgress';

export function OneCallCard() {
  const { d } = useS();
  const call = useMemo(() => onePlace(SIMS), []);
  const sim = call ? SIMS.find(m => m.id === call.simId) || null : null;
  if (!sim || !call) return null;
  const minutes = sim.calls ? sim.calls[call.n - 1] : 0;
  return (
    <div className="panel pr-one">
      <div className="pr-one-text">
        <span className="label">One decision{minutes ? ' · ~' + minutes + ' min' : ''}</span>
        <strong className="pr-one-title">{sim.title}</strong>
        <span className="sec pr-one-org">{sim.org}. {call.n === 1 ? 'The opening of the room and its first call.' : 'Decision ' + call.n + ' of ' + callCount(sim) + ', with the room so far.'}</span>
      </div>
      <button className="btn btn-key pr-one-go" onClick={() => d({ t: 'route', view: 'sim', id: sim.id, sub: subOfCall(call.n) })}>Take one</button>
    </div>
  );
}

/** a room left part way, newest first, with its place; else one decision */
export function WayIn() {
  const { d } = useS();
  const going = useMemo(() => {
    for (const k of roomsKept()) {
      const m = SIMS.find(x => x.id === k.id);
      if (!m) continue;
      /* once the rooms' text has loaded the place is checked against the room; before, it is taken as kept */
      if (m.injects.length) { const at = roomProgress(m); if (at) return { sim: m, cursor: at.cursor }; continue; }
      return { sim: m, cursor: k.cursor };
    }
    return null;
  }, []);
  if (!going) return <OneCallCard />;
  const total = going.sim.injects.length || going.sim.injectCount || 0;
  return (
    <div className="panel pr-one pr-one-going">
      <div className="pr-one-text">
        <span className="label">In progress{total ? ' · inject ' + (going.cursor + 1) + ' of ' + total : ''}</span>
        <strong className="pr-one-title">{going.sim.title}</strong>
        <span className="sec pr-one-org">{going.sim.org}</span>
      </div>
      <button className="btn btn-key pr-one-go" onClick={() => d({ t: 'route', view: 'sim', id: going.sim.id, sub: 'resume' })}>Continue</button>
    </div>
  );
}
