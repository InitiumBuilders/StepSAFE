/* THE SERVICE RECORD: the people a learner has held for, in the model's own
   count. Four stocks (people, hours, gauges, days) and, on the full view,
   one line per held gauge. Everything shown is computed from the record by
   lib/service.ts; nothing is entered by hand. */

import React, { useMemo } from 'react';
import { useS } from '../lib/state';
import { serviceRecord } from '../lib/service';
import { StockRow, StockVessel } from './Stocks';

const ICE = '#b9d8f6', VIOLET = '#a78bff', PINK = '#f18ac6', AMBER = '#fdc26f';

function hours(v: number): string { return Math.round(v).toLocaleString(); }

export function ServiceRecord({ compact, strip }: { compact?: boolean; strip?: boolean }) {
  const { s, d } = useS();
  const r = useMemo(() => serviceRecord(s), [s.gauges, s.gaugeSessions, s.forged, s.runLog, s.completedSims, s.completedSteps]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={'sr panel' + (compact || strip ? ' sr-compact' : '') + (strip ? ' sr-strip' : '')} data-essence={ICE}>
      <div className="sr-head">
        <span className="label">SERVICE RECORD</span>
        {!compact && !strip && <h2>The people you held for.</h2>}
        <p className="sec">
          Counted by running the stress day of every gauge you hold, at the highest notch you held it, with the stack on your record: every threat in the first hour, which is the floor. Catalog structures only; a gauge with no count in its sector line adds no people.
        </p>
      </div>

      <StockRow>
        <StockVessel big={!compact && !strip} small={strip} value={r.people} max={r.peopleAll} label="people held for" hue={ICE}
          note={'of ' + r.peopleAll.toLocaleString() + ' across the gauges'} />
        <StockVessel big={!compact && !strip} small={strip} value={r.hours} max={Math.max(24, 24 * r.held)} label={Math.round(r.hours * 10) === 10 ? 'hour of service kept' : 'hours of service kept'} hue={VIOLET}
          format={hours} note={r.held ? 'of ' + 24 * r.held + ' on the days you held' : 'of 24 on a held day'} />
        <StockVessel big={!compact && !strip} small={strip} value={r.held} max={r.gaugesAll} label={r.held === 1 ? 'gauge held' : 'gauges held'} hue={PINK}
          note={'of ' + r.gaugesAll + ' · ' + r.runs + (r.runs === 1 ? ' run' : ' runs')} />
        <StockVessel big={!compact && !strip} small={strip} value={r.days30} max={30} label={r.days30 === 1 ? 'day with a move' : 'days with a move'} hue={AMBER}
          note={'of the last 30 · ' + r.daysAll + ' ever'} />
      </StockRow>

      {!compact && !strip && (
        r.lines.length ? (
          <ul className="sr-lines">
            {r.lines.map(l => (
              <li key={l.id}>
                <button onClick={() => d({ t: 'route', view: 'modux-gauge', id: l.id })}>
                  <span className="sr-title">{l.title}</span>
                  <span className="sr-org">{l.org}{l.notch ? ' · notch ' + l.notch : ' · Ground'}</span>
                  <span className="sr-num">
                    {l.peopleLabel ? <strong>{l.peopleLabel}</strong> : <strong>no count</strong>}
                    <em>about {hours(l.hoursKept)} of 24 h kept</em>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="sr-empty">
            <p className="sec">Nothing held yet. Hold a gauge and the people it serves appear here.</p>
            <button className="btn btn-sm" onClick={() => d({ t: 'route', view: 'modux' })}>Open the Gauges</button>
          </div>
        )
      )}
    </section>
  );
}
