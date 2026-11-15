/* THE DAY, PLAYED. Claros's answer about a day, shown on the system it read: the gauges' model runs
   the day twice, first with nothing more in place and then with Claros's plan, and the map plays both.
   Each part glows with its own health hour by hour; a link carries the failure while its source is down
   and the part it feeds is still falling; the plan's moves arrive at their parts in order, each in the
   colour of its verb; the strip under the map is service to the people across the 24 hours. Every
   frame is a sample from the model, eased between hours. Nothing here is drawn for effect. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ModuxModel } from '../content/modux-schema';
import type { Sample } from '../content/modux/dynamics';
import { buildState, runState } from '../lib/systemStates';
import { planMarkdown } from '../lib/hardening';
import { localDay } from '../lib/day';
import type { ClarosRead } from '../lib/claros';
import { layoutSystem, KIND_HUE, W } from './SystemMap';

const DAY_MS = 4600, GAP_MS = 800;
type Mode = 'bare' | 'plan';
const h1 = (x: number) => String(Math.round(x * 10) / 10);

/** a sample between the hours, so a part's light moves smoothly */
function at(samples: Sample[], hour: number) {
  let i = 0;
  while (i < samples.length - 2 && samples[i + 1].hour <= hour) i++;
  const a = samples[i], b = samples[Math.min(samples.length - 1, i + 1)];
  const span = Math.max(1e-6, b.hour - a.hour);
  const f = Math.max(0, Math.min(1, (hour - a.hour) / span));
  return {
    delivered: a.delivered + (b.delivered - a.delivered) * f,
    health: (id: string) => (a.health[id] ?? 1) + ((b.health[id] ?? 1) - (a.health[id] ?? 1)) * f,
  };
}

/** hours of service kept from the start of the day to this hour */
function keptBy(samples: Sample[], hour: number) {
  let k = 0;
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i], b = samples[i + 1];
    if (a.hour >= hour) break;
    const end = Math.min(b.hour, hour);
    const mid = at(samples, (a.hour + end) / 2).delivered;
    k += mid * (end - a.hour);
  }
  return k;
}

function stripPath(samples: Sample[], to: number, area: boolean) {
  const X = (h: number) => (h / 24) * 480, Y = (d: number) => 54 - d * 48;
  const pts: string[] = [];
  for (let h = 0; h <= to + 1e-6; h += 0.25) pts.push(X(h).toFixed(1) + ' ' + Y(at(samples, Math.min(h, 24)).delivered).toFixed(1));
  if (!pts.length) return '';
  return 'M' + pts.join(' L') + (area ? ' L' + X(to).toFixed(1) + ' 54 L0 54 Z' : '');
}

export function ClarosDay({ read, plan, byId, planLabel = 'With the plan' }: { read: ClarosRead; plan: 'stress' | 'hardest'; byId: Map<string, ModuxModel>; planLabel?: string }) {
  const pl = planLabel.charAt(0).toLowerCase() + planLabel.slice(1);
  const g = read.focus.gauge;
  const week = plan === 'hardest' ? read.hard : read.week;
  const sid = plan === 'hardest' ? 'adversary' : 'stress';

  const runs = useMemo(() => {
    const bareRun = buildState(sid, { gauge: g, byId, stack: week.from, reading: read.R });
    const planRun = buildState(sid, { gauge: g, byId, stack: [...week.from, ...week.lessons.map(l => l.id)], reading: read.R });
    return {
      bare: runState(bareRun), plan: runState(planRun),
      struck: [...new Set(bareRun.blows.map(b => b.threat.target))],
    };
  }, [g, byId, week, sid, read.R]);

  /* the map measures itself: a narrow screen gets a taller map and larger parts, so each stays a thing you can tap */
  const box = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(640);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(es => { const w = es[0]?.contentRect.width; if (w) setCw(Math.round(w)); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  /* as tall as the system's longest column needs, no taller */
  const tallest = useMemo(() => {
    const per = new Map<number, number>();
    for (const v of layoutSystem(g.system).pos.values()) per.set(Math.round(v.x), (per.get(Math.round(v.x)) || 0) + 1);
    return Math.max(1, ...per.values());
  }, [g.system]);
  const clamp = (lo: number, x: number, hi: number) => Math.max(lo, Math.min(hi, x));
  const HC = cw < 420 ? clamp(440, 220 + tallest * 95, 780) : cw < 640 ? clamp(340, 150 + tallest * 80, 600) : clamp(270, 120 + tallest * 62, 460);
  const u = W / Math.max(200, cw);
  const R = { core: Math.max(11, 6.5 * u), halo: Math.max(17, 10 * u), key: Math.max(27, 15 * u), hit: Math.max(34, 20 * u), pad: Math.max(24, 13 * u) };

  const pos = useMemo(() => {
    const { pos: p, H } = layoutSystem(g.system);
    return new Map([...p].map(([id, v]) => [id, { x: v.x, y: 34 + (v.y / H) * (HC - 68) }]));
  }, [g.system, HC]);

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [mode, setMode] = useState<Mode>('plan');
  const [hour, setHour] = useState(24);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const raf = useRef(0);
  const root = useRef<HTMLElement>(null);

  function play() {
    cancelAnimationFrame(raf.current);
    if (reduced) { setMode('bare'); setHour(24); setPlayed(true); return; }
    setPlaying(true); setPlayed(true);
    const t0 = performance.now();
    const tick = (now: number) => {
      const e = now - t0;
      if (e < DAY_MS) { setMode('bare'); setHour((24 * e) / DAY_MS); }
      else if (e < DAY_MS + GAP_MS) { setMode('bare'); setHour(24); }
      else if (e < 2 * DAY_MS + GAP_MS) { setMode('plan'); setHour((24 * (e - DAY_MS - GAP_MS)) / DAY_MS); }
      else { setMode('plan'); setHour(24); setPlaying(false); return; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }
  function show(m: Mode) { cancelAnimationFrame(raf.current); setPlaying(false); setMode(m); setHour(24); }

  /* it plays once, the first time it is on screen */
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const samples = mode === 'bare' ? runs.bare.samples : runs.plan.samples;
  const now = at(samples, hour);
  /* the count lands exactly on the model's own hours kept */
  const full = mode === 'bare' ? runs.bare.kept : runs.plan.kept;
  const whole = keptBy(samples, 24);
  const kept = whole > 0 ? (full * keptBy(samples, hour)) / whole : 0;
  const health = (id: string) => Math.max(0, Math.min(1, now.health(id)));
  const placed = mode === 'plan' ? week.lessons : [];
  const firstStrike = plan === 'hardest' ? 0.1 : 0.5;
  const striking = mode === 'bare' && hour > firstStrike && hour < firstStrike + 2.2;
  const keystone = read.R.keystone;
  const nameOf = read.nameOf;

  const caption = pick
    ? nameOf(pick) + ': ' + Math.round(health(pick) * 100) + '% of its function at hour ' + Math.floor(hour) + (mode === 'plan' ? ', ' + pl : ', bare')
    : playing
      ? 'Hour ' + Math.floor(hour) + (mode === 'plan' ? ', ' + pl : ', bare') + ' · service to the people ' + Math.round(now.delivered * 100) + '%'
      : 'Tap a part to read it.';

  async function copyPlan() {
    const md = planMarkdown({ name: read.focus.name, week, partName: nameOf, date: localDay() });
    try { await navigator.clipboard.writeText(md); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* nothing to copy into */ }
  }

  return (
    <figure ref={root} className={'cday m-' + mode + (playing ? ' playing' : '')} aria-label={(plan === 'hardest' ? 'The hardest day' : 'The stress day') + ' on ' + read.focus.name + ', played by the model'}>
      <div className="cday-head">
        <span className="cday-title">{plan === 'hardest' ? 'The hardest day' : 'The stress day'}, played</span>
        <span className="cday-modes" role="radiogroup" aria-label="Which day to show">
          <button type="button" role="radio" aria-checked={mode === 'bare'} className={mode === 'bare' ? 'on' : ''} onClick={() => show('bare')}>Bare</button>
          <button type="button" role="radio" aria-checked={mode === 'plan'} className={mode === 'plan' ? 'on' : ''} onClick={() => show('plan')}>{planLabel}</button>
        </span>
        <button type="button" className="cday-play" onClick={play} disabled={playing} aria-label="Play the day again">
          <svg viewBox="0 0 20 20" aria-hidden><path d="M6 4.5v11l9-5.5z" /></svg>{played ? 'Again' : 'Play'}
        </button>
      </div>

      <div className="cday-map" ref={box} style={{ aspectRatio: W + ' / ' + HC }}>
        <svg viewBox={'0 0 ' + W + ' ' + HC} preserveAspectRatio="xMidYMid meet" aria-hidden>
          {g.system.edges.map((e, i) => {
            const a = pos.get(e.from), b = pos.get(e.to);
            if (!a || !b) return null;
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
            const x1 = a.x + ux * R.pad, y1 = a.y + uy * R.pad, x2 = b.x - ux * (R.pad + 2), y2 = b.y - uy * (R.pad + 2);
            const mx = (x1 + x2) / 2 - uy * 22, my = (y1 + y2) / 2 + ux * 22;
            const carry = health(e.from) < 0.5 && health(e.to) < 0.97 && health(e.to) > 0.02;
            return <path key={i} className={'cday-edge' + (carry ? ' carry' : '')} d={'M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2} />;
          })}
          {g.system.nodes.map(n => {
            const p = pos.get(n.id)!;
            const h = health(n.id);
            const down = h < 0.5;
            return (
              <g key={n.id} className={'cday-node' + (down ? ' down' : '') + (pick === n.id ? ' picked' : '')} transform={'translate(' + p.x + ' ' + p.y + ')'}
                onClick={() => setPick(x => (x === n.id ? null : n.id))}>
                <circle r={R.hit} className="hit" />
                {striking && runs.struck.includes(n.id) && <circle r={R.halo + (hour - firstStrike) * 9 * u} className="strike" style={{ opacity: Math.max(0, 1 - (hour - firstStrike) / 2.2) }} />}
                {keystone === n.id && <circle r={R.key} className="key" />}
                <circle r={R.halo} className="halo" style={{ fill: KIND_HUE[n.kind], opacity: 0.08 + 0.3 * h }} />
                <circle r={R.core} className="core" style={{ fill: KIND_HUE[n.kind], opacity: 0.18 + 0.82 * h }} />
                <title>{n.name}</title>
              </g>
            );
          })}
        </svg>
        {keystone && pos.get(keystone) && (
          <span className={'cday-label key' + (pos.get(keystone)!.x > W * 0.62 ? ' west' : '')}
            style={{ left: ((pos.get(keystone)!.x + (pos.get(keystone)!.x > W * 0.62 ? -R.key : R.key)) / W) * 100 + '%', top: (pos.get(keystone)!.y / HC) * 100 + '%' }}>
            {nameOf(keystone)}
          </span>
        )}
        {placed.map((l, i) => {
          const p = pos.get(l.where);
          if (!p) return null;
          const dup = placed.slice(0, i).filter(x => x.where === l.where).length;
          return (
            <span key={l.id + i} className={'cday-move v-' + l.verb} style={{ left: (p.x / W) * 100 + '%', top: (p.y / HC) * 100 + '%', ['--k' as string]: String(i), ['--dup' as string]: String(dup) }} title={l.name}>
              {i + 1}
            </span>
          );
        })}
      </div>

      <svg className="cday-strip" viewBox="0 0 480 58" preserveAspectRatio="none" aria-hidden>
        <line x1="0" y1="54" x2="480" y2="54" className="base" />
        <path d={stripPath(mode === 'bare' ? runs.plan.samples : runs.bare.samples, 24, false)} className="ghost" />
        <path d={stripPath(samples, hour, true)} className="area" />
        <path d={stripPath(samples, hour, false)} className="line" />
        <line x1={(hour / 24) * 480} y1="2" x2={(hour / 24) * 480} y2="56" className="head" />
      </svg>

      <figcaption className="cday-foot">
        <span className={'cday-n b' + (mode === 'bare' ? ' on' : '')}><strong>{playing && mode === 'bare' ? h1(kept) : h1(runs.bare.kept)}</strong> of 24 h bare</span>
        {playing && mode === 'bare'
          ? <span className="cday-n p">{planLabel}, next</span>
          : <span className={'cday-n p' + (mode === 'plan' ? ' on' : '')}><strong>{playing ? h1(kept) : h1(runs.plan.kept)}</strong> of 24 h {pl}</span>}
        <button type="button" className="cday-copy" onClick={copyPlan}>{copied ? 'Copied' : 'Copy the plan'}</button>
        <span className="cday-now" aria-live="polite">{caption}</span>
      </figcaption>
    </figure>
  );
}
