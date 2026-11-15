/* Two hundred days (content/modux/dynamics.ts: ensemble, sensitivity, robustLeverageAsync). The stress day is one
   extreme; these are the days the model also finds plausible, read together: the service through the day as a fan,
   every day's hours kept as a strip against the line the gauge calls held, the parts that fall most often, the
   assumption that moves the answer most, and the moves that add the most on the bad days. */
import React, { useEffect, useMemo, useState } from 'react';
import type { ModuxGauge, ModuxModel } from '../content/modux-schema';
import type { MotrusPlay } from '../content/modux/score';
import { buildModel, simulate, drawDays, ensemble, sensitivity, robustLeverageAsync, leverage, HELD_HOURS, fmtHours, type RobustMove } from '../content/modux/dynamics';
import '../styles/manydays.css';

interface Props {
  gauge: ModuxGauge;
  stack: string[];
  byId: Map<string, ModuxModel>;
  plays?: MotrusPlay[];
  weakened?: Set<string>;
  nameOf: (nodeId: string) => string;
  /** a second stack run on the same days, drawn as its own typical day: on a system's page the days run with nothing
      in place and this is the reference stack */
  compare?: { stack: string[]; label: string };
}

const X = (h: number) => (h / 24) * 240;
const pct = (v: number) => Math.round(v * 100);

export function ManyDays({ gauge, stack, byId, plays = [], weakened = new Set(), nameOf, compare }: Props) {
  const key = stack.join(',') + '|' + plays.map(p => p.id + ':' + p.answers.join('.')).join(',') + '|' + [...weakened].join(',') + '|' + (compare ? compare.stack.join(',') : '');
  const read = useMemo(() => {
    const m = buildModel(gauge, stack, byId, plays, weakened);
    const days = drawDays(m, 200);
    const e = ensemble(m, days);
    const c = compare ? ensemble(buildModel(gauge, compare.stack, byId, plays, weakened), days) : null;
    const live = m.threats.filter(t => !t.open);
    const stress = simulate(m, live.map((t, i) => ({ id: t.id, at: 0.5 + i * 0.1 })), 24, 0.2).samples;
    const sens = sensitivity(m).slice(0, 3);
    const fragile = Object.entries(e.fell).filter(([, v]) => v >= 0.05).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const stressFirst = leverage(gauge, stack, byId, plays, weakened, 1).moves[0] || null;
    return { e, c, stress, sens, fragile, stressFirst };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gauge, byId, key]);

  const [robust, setRobust] = useState<RobustMove[] | null>(null);
  useEffect(() => {
    let stop = false;
    setRobust(null);
    robustLeverageAsync(gauge, stack, byId, plays, weakened, 3, 80, undefined, () => stop).then(r => { if (!stop && r) setRobust(r.moves); });
    return () => { stop = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gauge, byId, key]);

  const { e, c, stress, sens, fragile, stressFirst } = read;
  /* The service axis starts a step under the lowest point any line reaches, so a day that dips to 90% still shows its
     shape. The floor carries its own label, so the zoom is never hidden. */
  const lowV = Math.min(1, ...e.band.map(b => b.p10), ...stress.map(s => s.delivered), ...(c ? c.band.map(b => b.p50) : []));
  const vFloor = lowV >= 0.5 ? Math.max(0, Math.floor((lowV - 0.04) * 10) / 10) : 0;
  const Y = (v: number) => 6 + (1 - (Math.max(vFloor, v) - vFloor) / (1 - vFloor)) * 88;
  const vMid = (1 + vFloor) / 2;
  const vName = (v: number) => (v >= 0.999 ? 'all service' : v <= 0.001 ? 'no service' : vFloor === 0 && Math.abs(v - 0.5) < 0.001 ? 'half' : pct(v) + '%');
  /* Hours kept: the strip of days and the assumption bars share one scale. It starts an hour under the lowest day and
     always shows the held line. */
  const hFloor = Math.max(0, Math.min(HELD_HOURS - 2, Math.floor(Math.min(e.kept[0] ?? 24, ...sens.map(s => Math.min(s.lo, s.hi))) - 1)));
  const H = (k: number) => ((Math.max(hFloor, k) - hFloor) / (24 - hFloor)) * 240;
  const Hpct = (k: number) => (H(k) / 240) * 100;
  const outer = 'M' + e.band.map(b => X(b.hour) + ',' + Y(b.p90)).join(' L') + ' L' + [...e.band].reverse().map(b => X(b.hour) + ',' + Y(b.p10)).join(' L') + ' Z';
  const inner = 'M' + e.band.map(b => X(b.hour) + ',' + Y(b.p75)).join(' L') + ' L' + [...e.band].reverse().map(b => X(b.hour) + ',' + Y(b.p25)).join(' L') + ' Z';
  const mid = e.band.map(b => X(b.hour) + ',' + Y(b.p50)).join(' ');
  const cmid = c ? c.band.map(b => X(b.hour) + ',' + Y(b.p50)).join(' ') : '';
  const sline = stress.map(s => X(s.hour) + ',' + Y(s.delivered)).join(' ');
  const swingMax = Math.max(0.5, ...sens.map(s => s.swing));
  const robustDiffers = robust && robust[0] && stressFirst && robust[0].id !== stressFirst.id;

  return (
    <div className="tr-block mdays">
      <h3>Two Hundred Days</h3>
      <p className="sec mdays-lead">The stress day lands every threat in the first hour, at the model&rsquo;s middle settings. These are two hundred more days the model finds plausible: each draws its own settings across their ranges, and the threats come in one wave, from all at once to spread across a working day. They are the model&rsquo;s days, not a forecast.</p>

      <div className="mdays-fan" role="img" aria-label={'Service through the day across ' + e.n + ' days: typical ' + fmtHours(e.p50) + ' hours kept, worst tenth ' + fmtHours(e.p10) + ', best tenth ' + fmtHours(e.p90) + '.'}>
        <svg viewBox="0 0 240 100" preserveAspectRatio="none" aria-hidden="true">
          {[1, vMid, vFloor].map(v => <line key={v} x1="0" x2="240" y1={Y(v)} y2={Y(v)} className="mdays-grid" vectorEffect="non-scaling-stroke" />)}
          <path d={outer} className="mdays-outer" />
          <path d={inner} className="mdays-inner" />
          <polyline points={sline} className="mdays-stress" vectorEffect="non-scaling-stroke" />
          <polyline points={mid} className="mdays-mid" vectorEffect="non-scaling-stroke" />
          {c && <polyline points={cmid} className="mdays-cmp" vectorEffect="non-scaling-stroke" />}
        </svg>
        {[0, 6, 12, 18, 24].map(h => <span key={h} className="mdays-xl" style={{ left: (h / 24) * 100 + '%', transform: h === 0 ? 'none' : h === 24 ? 'translateX(-100%)' : undefined }}>{h} h</span>)}
        {[1, vMid, vFloor].map(v => <span key={v} className="mdays-yl" style={{ top: Y(v) + '%' }}>{vName(v)}</span>)}
      </div>
      <p className="sec mdays-key">
        <span className="mdays-ki"><span className="mdays-k mid" />the typical day</span>
        <span className="mdays-ki"><span className="mdays-k inner" />the middle half of days</span>
        <span className="mdays-ki"><span className="mdays-k outer" />four days in five</span>
        <span className="mdays-ki"><span className="mdays-k stress" />the stress day</span>
        {compare && <span className="mdays-ki"><span className="mdays-k cmp" />the typical day with {compare.label}</span>}
      </p>

      <div className="mdays-rug" role="img" aria-label={'Hours kept on each of ' + e.n + ' days; ' + pct(e.held) + ' percent kept ' + HELD_HOURS + ' or more.'}>
        <svg viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden="true">
          {e.kept.map((k, i) => <line key={i} x1={H(k)} x2={H(k)} y1="3" y2="17" className={k >= HELD_HOURS ? 'mdays-tick held' : 'mdays-tick'} vectorEffect="non-scaling-stroke" />)}
          <line x1={H(HELD_HOURS)} x2={H(HELD_HOURS)} y1="0" y2="20" className="mdays-heldline" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="mdays-xl" style={{ left: 0, transform: 'none' }}>{hFloor} h kept</span>
        {Hpct(HELD_HOURS) > 18 && Hpct(HELD_HOURS) < 78 && <span className="mdays-xl" style={{ left: Hpct(HELD_HOURS) + '%' }}>{HELD_HOURS} h</span>}
        <span className="mdays-xl" style={{ left: '100%', transform: 'translateX(-100%)' }}>24 h</span>
      </div>
      <p className="mdays-nums">
        {compare && <span>With nothing in place:</span>}
        <span><strong>{fmtHours(e.p10)} h</strong> on the worst tenth of days</span>
        <span><strong>{fmtHours(e.p50)} h</strong> typical</span>
        <span><strong>{fmtHours(e.p90)} h</strong> on the best tenth</span>
        <span><strong>{pct(e.held)}%</strong> of days held ({HELD_HOURS} h or more)</span>
      </p>
      {c && compare && (
        <p className="mdays-nums mdays-cmp-nums">
          <span>With {compare.label}:</span>
          <span><strong>{fmtHours(c.p10)} h</strong> on the worst tenth</span>
          <span><strong>{fmtHours(c.p50)} h</strong> typical</span>
          <span><strong>{pct(c.held)}%</strong> of days held</span>
        </p>
      )}

      {fragile.length > 0 && (
        <p className="sec mdays-line">Drops under half its function at some point in the day: {fragile.map(([id, v], i) => <React.Fragment key={id}>{i ? ', ' : ''}<strong>{nameOf(id)}</strong> {v >= 0.995 ? 'every day' : 'on ' + pct(v) + '% of days'}</React.Fragment>)}{e.held >= 0.5 ? ', while the service to the public held on most days' : ''}.</p>
      )}

      <h4 className="mdays-h4">What Moves The Answer Most</h4>
      <ul className="mdays-sens">
        {sens.map(s => {
          const lo = Math.min(s.lo, s.hi), hi = Math.max(s.lo, s.hi);
          return (
            <li key={s.key}>
              <span className="mdays-sens-label">{s.label}</span>
              <span className="mdays-sens-bar" aria-hidden="true"><i style={{ left: Hpct(HELD_HOURS) + '%' }} /><span style={{ left: Hpct(lo) + '%', width: Math.max(1.5, Hpct(hi) - Hpct(lo)) + '%', opacity: 0.45 + 0.55 * (s.swing / swingMax) }} /></span>
              <span className="mdays-sens-val">{fmtHours(lo) === fmtHours(hi) ? 'about ' + fmtHours(lo) : fmtHours(lo) + ' to ' + fmtHours(hi)} h</span>
            </li>
          );
        })}
      </ul>
      <p className="sec mdays-line">On a day with the threats in one wave across the first eight hours, each assumption is set to the low and the high end of its range with the rest held at the middle. The widest is the one most worth checking against the real organisation.</p>

      <h4 className="mdays-h4">The Moves That Hold On Bad Days</h4>
      {robust === null ? (
        <p className="sec mdays-line" aria-live="polite">Running each move against the same days&hellip;</p>
      ) : robust.length === 0 ? (
        <p className="sec mdays-line">No single structure adds an hour on these days. The stack already holds where the model can see.</p>
      ) : (
        <>
          <ol className="mdays-moves">
            {robust.map(m => (
              <li key={m.id}>
                <strong>{m.name}</strong>
                <span>+{fmtHours(m.worst)} h on the worst tenth, +{fmtHours(m.typical)} h typical{m.held > 0 ? ', ' + m.held + ' more days in a hundred held' : ''} &middot; cost {m.cost}</span>
              </li>
            ))}
          </ol>
          {robustDiffers && (
            <p className="sec mdays-line">On the stress day alone, <strong>{stressFirst!.name}</strong> ranks first. Across the bad days, <strong>{robust![0].name}</strong> adds more per point.</p>
          )}
        </>
      )}
    </div>
  );
}
