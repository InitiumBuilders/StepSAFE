/* FOCUS: the intention in the learner's own words, and what the record says
   to do next. The intention saves when the field is left. The insights come
   from lib/insight.ts and nothing is typed into them. */

import React, { useEffect, useMemo, useState } from 'react';
import { useS } from '../lib/state';
import { insights } from '../lib/insight';

function ago(ms: number, now = Date.now()): string {
  const d = Math.floor((now - ms) / 86400000);
  return d <= 0 ? 'set today' : d === 1 ? 'set yesterday' : 'set ' + d + ' days ago';
}

export function Focus() {
  const { s, d } = useS();
  const list = useMemo(() => insights(s), [s]);
  const [draft, setDraft] = useState(s.profile.intention || '');
  useEffect(() => { setDraft(s.profile.intention || ''); }, [s.profile.intention]);

  function commit() {
    const v = draft.trim();
    if (v === (s.profile.intention || '')) return;
    d({ t: 'profile', patch: { intention: v, intentionAt: v ? Date.now() : 0 } });
  }

  return (
    <section className="focus panel" data-essence="#f18ac6">
      <div className="focus-head">
        <span className="label">FOCUS</span>
        <h3>What the record says to do next.</h3>
      </div>

      <label className="focus-intent">
        <span className="label">Intention{s.profile.intention ? ' · ' + ago(s.profile.intentionAt || 0) : ''}</span>
        <input value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          placeholder="One line for this week, in your own words" maxLength={160} />
      </label>

      {list.length > 0 && (
        <ul className="focus-list">
          {list.map(i => (
            <li key={i.key}>
              <span className="focus-k">{i.kicker}</span>
              <strong>{i.title}</strong>
              <span className="focus-line">{i.line}</span>
              {i.action && <button className="btn btn-sm" onClick={() => d(i.action!.go)}>{i.action.label}</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
