/* THE ROOM SPEAKS — your unit's counsel on a live decision.

   Members you have actually earned advise from their own doctrine; seats you
   have not yet filled stay silent, and the silence is visible. Counsel is
   advice, not the answer — the engine never marks who is right, because
   weighing a split room IS the skill. */

import React, { useMemo, useState } from 'react';
import type { Drill } from '../content/schema';
import { ESSENCE_HEX } from '../content/registry';
import { counselFor } from '../lib/counsel';
import { useS } from '../lib/state';

export function UnitCounsel({ simId, drill, roles }: { simId: string; drill: Drill; roles: string[] }) {
  const { s } = useS();
  const [open, setOpen] = useState(false);

  const { voices, split } = useMemo(
    () => counselFor(simId, drill, roles, s.unitMembers),
    [simId, drill, roles, s.unitMembers]
  );

  const speaking = voices.filter(v => v.present);
  const silent = voices.filter(v => !v.present);
  if (voices.length === 0) return null;

  const silentLine = silent.length > 0 && (
    <p className="sec" style={{ margin: '4px 0 0' }}>
      {silent.map(v => v.member.callsign).join(', ')} — seat{silent.length > 1 ? 's' : ''} not yet
      filled. A fuller unit hears a fuller room; every Chapter you lock in seats another voice.
    </p>
  );
  /* with no seat filled there is no one to turn to: the silence is said outright, not kept behind a button */
  if (speaking.length === 0) return <div style={{ margin: 'var(--s4) 0' }}>{silentLine}</div>;

  return (
    <div style={{ margin: 'var(--s4) 0' }}>
      {!open ? (
        <button className="btn btn-sm sweep" onClick={() => setOpen(true)}>
          <span className="sweep-bar" aria-hidden />
          Turn to the room — hear your unit ({speaking.length} voice{speaking.length === 1 ? '' : 's'})
        </button>
      ) : (
        <div className="counsel" data-split={split ? 'true' : 'false'}>
          {speaking.map(v => (
            <div className="voice" key={v.member.id}
              style={{ ['--essence' as string]: ESSENCE_HEX[v.member.essence] }}>
              <div className="vsig" aria-hidden>{v.member.callsign.slice(0, 2)}</div>
              <div style={{ minWidth: 0 }}>
                <div className="vname">{v.member.callsign} · {v.member.role}</div>
                <p>{v.line}</p>
                <span className="vlean">{v.leaning}</span>
              </div>
            </div>
          ))}
          {silentLine}
        </div>
      )}
    </div>
  );
}
