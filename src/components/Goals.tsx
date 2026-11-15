/* GOALS: numbers the learner sets against the record. A measured goal
   reaches itself when the record crosses it, with a chime and a ripple and
   a badge; a goal in the learner's own words is marked done by hand. The
   compact form on Ground shows the goals still open. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useS, uid, type Goal, type GoalKey } from '../lib/state';
import { useEngine } from '../lib/engine';
import { serviceRecord } from '../lib/service';
import { GOAL_KINDS, kindOf, goalProgress, goalTargetValue, fmtDay } from '../lib/goals';
import { Sound } from '../lib/sound';
import { Field } from '../lib/field';

const MAX_GOALS = 24;

export function Goals({ compact }: { compact?: boolean }) {
  const { s, d } = useS();
  const eng = useEngine();
  const sr = useMemo(() => serviceRecord(s), [s.gauges, s.gaugeSessions, s.forged, s.runLog, s.completedSims, s.completedSteps]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = s.goals.map(g => {
    const kind = kindOf(g.key);
    const value = g.key === 'own' ? (g.reachedAt ? 1 : 0) : goalProgress(s, sr, g.key);
    const target = goalTargetValue(g.key, g.target);
    return { g, kind, value, target, pct: Math.max(0, Math.min(1, target > 0 ? value / target : 0)) };
  });

  /* a measured goal reaches itself; each one is announced once, whatever React replays in development */
  const announced = useRef(new Set<string>());
  const dueKey = rows.map(r => r.g.id + (r.g.reachedAt ? 'r' : r.value >= r.target ? 'd' : 'o')).join('|');
  useEffect(() => {
    const due = rows.filter(r => !r.g.reachedAt && r.g.key !== 'own' && r.value >= r.target && !announced.current.has(r.g.id));
    if (!due.length) return;
    for (const r of due) announced.current.add(r.g.id);
    const at = Date.now();
    for (const r of due) d({ t: 'goal-reached', id: r.g.id, at });
    Sound.gratus();
    Field.pulse(undefined, '#f0d48c', 'seal');
    eng.goalReached(s.goals.filter(g => g.reachedAt).length + due.length, due.map(r => r.g.title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueKey]);

  const [key, setKey] = useState<GoalKey>('people');
  const [target, setTarget] = useState('');
  const [by, setBy] = useState('');
  const [own, setOwn] = useState('');
  const kind = kindOf(key);
  const current = key === 'own' ? 0 : goalProgress(s, sr, key);
  const n = parseInt(target.replace(/[^0-9]/g, ''), 10);
  const valid = key === 'own' ? own.trim().length > 2 : Number.isFinite(n) && n > 0 && goalTargetValue(key, n) > current;

  function add() {
    if (!valid || s.goals.length >= MAX_GOALS) return;
    const goal: Goal = {
      id: uid(), key, target: key === 'own' ? 1 : n,
      title: key === 'own' ? own.trim() : kind!.title(n),
      by: by || undefined, createdAt: Date.now(),
    };
    d({ t: 'goal-add', goal });
    eng.goalSet(s.goals.length + 1);
    Field.pulse(undefined, undefined, 'mark');
    setTarget(''); setOwn(''); setBy('');
  }

  const open = rows.filter(r => !r.g.reachedAt);
  const reached = rows.filter(r => r.g.reachedAt);
  const shown = compact ? open.slice(0, 3) : [...open, ...reached];

  return (
    <section className={'goals panel' + (compact ? ' goals-compact' : '')} data-essence="#fdc26f">
      <div className="goals-head">
        <span className="label">GOALS</span>
        {!compact && <h2>What you said you would reach.</h2>}
        <p className="sec">
          {compact
            ? (open.length ? open.length + (open.length === 1 ? ' goal open' : ' goals open') + (reached.length ? ' · ' + reached.length + ' reached' : '') : 'No goal set yet.')
            : 'A measured goal reaches itself when the record crosses it. A goal in your own words is yours to mark done.'}
        </p>
      </div>

      {shown.length > 0 && (
        <ul className="goal-list">
          {shown.map(({ g, kind: k, value, target: t, pct }) => (
            <li key={g.id} className={g.reachedAt ? 'reached' : ''}>
              <div className="goal-bar" aria-hidden><i style={{ width: Math.round(pct * 100) + '%' }} /></div>
              <div className="goal-text">
                <strong>{g.title}</strong>
                <span>
                  {g.reachedAt ? 'Reached ' + new Date(g.reachedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
                    : k ? (g.key === 'notch' ? 'Held to notch ' + (value - 1) + ' of ' + g.target : value.toLocaleString() + ' of ' + g.target.toLocaleString() + ' ' + k.unit)
                    : 'In your hands'}
                  {g.by && !g.reachedAt ? ' · by ' + fmtDay(g.by) : ''}
                </span>
              </div>
              {g.key === 'own' && !g.reachedAt && (
                <button className="btn btn-sm" onClick={() => { d({ t: 'goal-reached', id: g.id, at: Date.now() }); Sound.gratus(); eng.goalReached(reached.length + 1, [g.title]); }}>Done</button>
              )}
              {!compact && <button className="goal-x" onClick={() => d({ t: 'goal-remove', id: g.id })} aria-label={'Remove the goal ' + g.title}>×</button>}
            </li>
          ))}
        </ul>
      )}

      {compact ? (
        open.length === 0 && (
          <button className="btn btn-sm" onClick={() => d({ t: 'route', view: 'profile' })}>Set a goal</button>
        )
      ) : (
        <form className="goal-form" onSubmit={e => { e.preventDefault(); add(); }}>
          <label>
            <span className="label">Kind</span>
            <select value={key} onChange={e => { setKey(e.target.value as GoalKey); setTarget(''); }}>
              {GOAL_KINDS.map(k => <option key={k.key} value={k.key}>{k.label}</option>)}
              <option value="own">In your own words</option>
            </select>
          </label>
          {key === 'own' ? (
            <label className="wide">
              <span className="label">The goal</span>
              <input value={own} onChange={e => setOwn(e.target.value)} placeholder="What you will have done, in one line" maxLength={120} />
            </label>
          ) : (
            <label>
              <span className="label">Target{kind ? ' · now ' + (key === 'notch' ? Math.max(0, current - 1) : current.toLocaleString()) : ''}</span>
              <input inputMode="numeric" value={target} onChange={e => setTarget(e.target.value)} placeholder={kind ? kind.suggest[0].toLocaleString() : ''} />
              <span className="goal-suggest">
                {kind?.suggest.filter(v => goalTargetValue(key, v) > current).map(v => (
                  <button type="button" key={v} className={'chip' + (String(v) === target ? ' on' : '')} onClick={() => setTarget(String(v))}>{v.toLocaleString()}</button>
                ))}
              </span>
            </label>
          )}
          <label>
            <span className="label">By (optional)</span>
            <input type="date" value={by} onChange={e => setBy(e.target.value)} />
          </label>
          <button className="btn btn-key" type="submit" disabled={!valid || s.goals.length >= MAX_GOALS}>Set the goal</button>
        </form>
      )}
    </section>
  );
}
