/* THE LEDGER OF THE MINDS: how long the learner has spent with Seva, with Claros and with Dasha, how many
   times they asked, and what the work held, day by day for two weeks. Every number here is counted
   on this device from what happened: time while present (lib/mindClock), asks as they were sent,
   systems Claros read, the moves in its plans and their verbs, the best plan seen for each system,
   attack asks turned to defense, and the Steps sealed on the record. */

import React, { useEffect, useMemo, useState } from 'react';
import { useS, type MindDay } from '../lib/state';
import { localDay } from '../lib/day';
import { spent, clockText, type Mind, type MindClock } from '../lib/mindClock';

const DAYS = 14;
const VERBS: { id: string; label: string }[] = [
  { id: 'model', label: 'Model' }, { id: 'harden', label: 'Harden' }, { id: 'detect', label: 'Detect' }, { id: 'isolate', label: 'Isolate' }, { id: 'restore', label: 'Restore' },
];
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Col { key: string; date: Date; day: MindDay | null; steps: number }

/** the running clock for this visit, re-drawn each second without re-drawing the page */
export function SessionClock({ clock, mind }: { clock: React.MutableRefObject<MindClock>; mind: Mind }) {
  const [, setN] = useState(0);
  useEffect(() => { const t = window.setInterval(() => setN(n => n + 1), 1000); return () => window.clearInterval(t); }, []);
  return <span className="ml-clock" aria-label="Time this visit"><i aria-hidden />{clockText(clock.current.session[mind])}</span>;
}

export function MindLedger({ sevaName, compact = false }: { sevaName: string; compact?: boolean }) {
  const { s } = useS();
  const days = s.mindDays || {};

  const cols: Col[] = useMemo(() => {
    const steps: Record<string, number> = {};
    for (const at of Object.values(s.completedSteps)) { const k = localDay(at); steps[k] = (steps[k] || 0) + 1; }
    const out: Col[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const dt = new Date(); dt.setHours(12, 0, 0, 0); dt.setDate(dt.getDate() - i);
      const key = localDay(dt.getTime());
      out.push({ key, date: dt, day: days[key] || null, steps: steps[key] || 0 });
    }
    return out;
  }, [days, s.completedSteps]);

  const T = useMemo(() => {
    const t = { seva: 0, claros: 0, dasha: 0 }, a = { seva: 0, claros: 0, dasha: 0 }, v: Record<string, number> = {};
    const best: Record<string, number> = {};
    let moves = 0, refused = 0, lookups = 0;
    for (const d of Object.values(days)) {
      t.seva += d.t?.seva || 0; t.claros += d.t?.claros || 0; a.seva += d.a?.seva || 0; a.claros += d.a?.claros || 0;
      t.dasha += d.t?.dasha || 0; a.dasha += d.a?.dasha || 0; lookups += d.dl || 0;
      moves += d.moves || 0; refused += d.refused || 0;
      for (const [k, n] of Object.entries(d.v || {})) v[k] = (v[k] || 0) + n;
      for (const sys of d.sys || []) if (!(sys in best)) best[sys] = 0;
      for (const [sys, h] of Object.entries(d.best || {})) best[sys] = Math.max(best[sys] || 0, h);
    }
    const hours = Math.round(Object.values(best).reduce((n, h) => n + h, 0) * 10) / 10;
    return { t, a, v, moves, refused, lookups, systems: Object.keys(best), hours };
  }, [days]);

  /* Seva's questions from Claros's reading, answered: counted from the conversation itself */
  const qz = useMemo(() => {
    const done = s.sevaLog.filter(m => m.quiz && m.quiz.picked !== undefined);
    return { answered: done.length, right: done.filter(m => m.quiz!.picked === m.quiz!.answer).length };
  }, [s.sevaLog]);

  const [sel, setSel] = useState(DAYS - 1);
  const max = Math.max(600, ...cols.map(c => (c.day ? (c.day.t.seva || 0) + (c.day.t.claros || 0) + (c.day.t.dasha || 0) : 0)));
  const c = cols[sel];
  const cd = c.day;
  const dateLine = WEEKDAY[c.date.getDay()] + ' ' + c.date.getDate() + ' ' + MONTH[c.date.getMonth()];
  const verbTotal = VERBS.reduce((n, x) => n + (T.v[x.id] || 0), 0);

  const detail: string[] = [];
  if (cd && (cd.t.seva || cd.a.seva)) detail.push(sevaName + ': ' + (cd.t.seva ? spent(cd.t.seva) + ', ' : '') + cd.a.seva + ' ask' + (cd.a.seva === 1 ? '' : 's'));
  if (cd && (cd.t.claros || cd.a.claros)) detail.push('Claros: ' + (cd.t.claros ? spent(cd.t.claros) + ', ' : '') + cd.a.claros + ' ask' + (cd.a.claros === 1 ? '' : 's'));
  if (cd && (cd.t.dasha || cd.a.dasha)) detail.push('Dasha: ' + (cd.t.dasha ? spent(cd.t.dasha) + ', ' : '') + cd.a.dasha + ' ask' + (cd.a.dasha === 1 ? '' : 's'));
  if (cd && cd.sys.length) detail.push(cd.sys.length + ' system' + (cd.sys.length === 1 ? '' : 's') + ' read: ' + cd.sys.join(', '));
  if (cd && cd.moves) detail.push(cd.moves + ' move' + (cd.moves === 1 ? '' : 's') + ' planned');
  if (cd && cd.refused) detail.push(cd.refused + ' ask' + (cd.refused === 1 ? '' : 's') + ' to attack turned to defense');
  if (c.steps) detail.push(c.steps + ' Step' + (c.steps === 1 ? '' : 's') + ' sealed');

  return (
    <section className={'mind-ledger' + (compact ? ' compact' : '')} aria-label="Time with the minds">
      <header className="ml-head">
        <span className="label">Time with the minds</span>
        <span className="ml-local">Kept on this device</span>
      </header>

      {!compact && (
        <div className="ml-tiles">
          <div className="ml-tile t-seva"><span>With {sevaName}</span><strong>{spent(Math.max(T.t.seva, T.a.seva ? 1 : 0))}</strong><em>{T.a.seva} ask{T.a.seva === 1 ? '' : 's'}{qz.answered ? ' · ' + qz.right + ' of ' + qz.answered + ' questions right' : ''}</em></div>
          <div className="ml-tile t-claros"><span>With Claros</span><strong>{spent(Math.max(T.t.claros, T.a.claros ? 1 : 0))}</strong><em>{T.a.claros} ask{T.a.claros === 1 ? '' : 's'}</em></div>
          <div className="ml-tile t-dasha"><span>With Dasha</span><strong>{spent(Math.max(T.t.dasha, T.a.dasha ? 1 : 0))}</strong><em>{T.a.dasha} ask{T.a.dasha === 1 ? '' : 's'}</em></div>
          <div className="ml-tile"><span>Systems Claros has read</span><strong className="n">{T.systems.length}</strong><em>{T.systems.length ? T.systems.slice(0, 2).join(', ') + (T.systems.length > 2 ? ' and ' + (T.systems.length - 2) + ' more' : '') : 'none yet'}</em></div>
          <div className="ml-tile"><span>Moves in its plans</span><strong className="n">{T.moves}</strong><em>{T.hours ? T.hours + ' h of service its best plans add' : 'none yet'}</em></div>
          <div className="ml-tile"><span>Live sources Dasha reached</span><strong className="n">{T.lookups}</strong><em>{T.lookups ? 'the Dash docs, the ballot, the network' : 'none yet'}</em></div>
        </div>
      )}

      <div className="ml-chart" role="group" aria-label="The last two weeks, day by day">
        {cols.map((col, i) => {
          const ss = col.day?.t.seva || 0, cs = col.day?.t.claros || 0, ds = col.day?.t.dasha || 0;
          const label = WEEKDAY[col.date.getDay()] + ' ' + col.date.getDate() + ' ' + MONTH[col.date.getMonth()] + ': ' + spent(ss) + ' with ' + sevaName + ', ' + spent(cs) + ' with Claros' + (ds ? ', ' + spent(ds) + ' with Dasha' : '') + (col.steps ? ', ' + col.steps + ' Steps sealed' : '');
          return (
            <button key={col.key} type="button" className={'ml-col' + (i === sel ? ' on' : '') + (i === DAYS - 1 ? ' today' : '')} aria-pressed={i === sel} aria-label={label} onClick={() => setSel(i)}>
              <span className="ml-mark" aria-hidden>{col.steps > 0 && <i className="ml-step" />}</span>
              <span className="ml-track" aria-hidden>
                <span className="ml-fill" style={{ ['--d' as string]: i * 28 + 'ms' }}>
                  {ss > 0 && <i className="s" style={{ height: (ss / max) * 100 + '%' }} />}
                  {cs > 0 && <i className="c" style={{ height: (cs / max) * 100 + '%' }} />}
                  {ds > 0 && <i className="d" style={{ height: (ds / max) * 100 + '%' }} />}
                </span>
              </span>
              <span className="ml-dow" aria-hidden>{WEEKDAY[col.date.getDay()].slice(0, 1)}</span>
              <span className="ml-dom" aria-hidden>{col.date.getDate()}</span>
            </button>
          );
        })}
      </div>

      <p className="ml-day" aria-live="polite"><strong>{dateLine}{sel === DAYS - 1 ? ', today' : ''}.</strong> {detail.length ? detail.join(' · ') + '.' : 'Nothing with the minds this day.'}</p>

      {verbTotal > 0 && (
        <div className="ml-verbs">
          <div className="ml-verbbar" aria-hidden>
            {VERBS.map(x => (T.v[x.id] ? <i key={x.id} className={'v-' + x.id} style={{ flexGrow: T.v[x.id] }} /> : null))}
          </div>
          <ul className="ml-verblist">
            {VERBS.map(x => <li key={x.id} className={'v-' + x.id}><i aria-hidden />{x.label} <strong>{T.v[x.id] || 0}</strong></li>)}
          </ul>
          {T.refused > 0 && <p className="ml-refused">{T.refused} ask{T.refused === 1 ? '' : 's'} to attack a system turned to its defense.</p>}
        </div>
      )}

      <details className="ml-key">
        <summary>Key</summary>
        <ul>
          <li><i className="k-seva" aria-hidden />Time with {sevaName}</li>
          <li><i className="k-claros" aria-hidden />Time with Claros</li>
          <li><i className="k-dasha" aria-hidden />Time with Dasha</li>
          <li><i className="k-step" aria-hidden />A day you sealed Steps</li>
        </ul>
        <p>Time counts only while this page is open and you are here. The hours are the model’s: for each system, the best plan Claros gave you, in hours of service it adds to the day.</p>
      </details>
    </section>
  );
}
