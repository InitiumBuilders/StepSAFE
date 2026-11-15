/* THE COMMONS BENEATH: the known systems and the foundations they share.

   The systems sit at the top like a canopy. Below them are the shared foundations their own maps name:
   name lookup, outside cloud, package registries, update channels, payment networks, outside AI models,
   public blockchains, hospitals. A root runs from each system to each foundation it rests on, and service
   travels up the roots. Under everything lies the bedrock band: routing, certificates, time, power and
   water, which every system rests on whether its map names them or not.

   Choose a foundation to read what fails with it and the one move that contains it for every system on
   it. Every number comes from scripts/commons-gen.mts running the gauges' model; nothing is drawn that
   the model did not compute. Motion runs only on screen, and calm motion shows the still frame. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { COMMONS, type Foundation } from '../content/outlier/commons';
import { KNOWN_SYSTEMS } from '../content/outlier/systems';
import { useS } from '../lib/state';
import { Sound } from '../lib/sound';

const HUE: Record<string, string> = { ice: '#d8effc', azure: '#9cc3ef', violet: '#a78bff', amber: '#fdc26f', pink: '#f18ac6', lilac: '#d8b4fe', gold: '#f0d48c', coral: '#e8786a' };
const h1 = (x: number) => String(Math.round(x));
const still = () => typeof window !== 'undefined' && ((!!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-motion') === 'calm');
type Sel = { kind: 'f' | 's' | 'b'; id: string };

export function CommonsMap() {
  const { d } = useS();
  const box = useRef<HTMLDivElement | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState(880);
  const [sel, setSel] = useState<Sel>({ kind: 'f', id: [...COMMONS.foundations].sort((a, b) => b.rests.length - a.rests.length)[0]?.id || '' });
  const [phase, setPhase] = useState<'idle' | 'fail' | 'contain'>('idle');
  const calm = useMemo(still, []);
  const timers = useRef<number[]>([]);

  /* the canopy is every known system that is not itself a foundation */
  const foundationIds = new Set(COMMONS.bedrock.map(b => b.entry).concat(COMMONS.foundations.map(f => f.entry || '')));
  const systems = useMemo(() => KNOWN_SYSTEMS.filter(k => !foundationIds.has(k.id)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const known = (id: string | null) => !!id && KNOWN_SYSTEMS.some(k => k.id === id);
  const open = (id: string) => d({ t: 'route', view: 'modux', sub: 'systems', id: 'sys:' + id });
  /* the strongest move from the foundation's own researched entry */
  const stewardMove = (id: string | null) => (id ? KNOWN_SYSTEMS.find(k => k.id === id)?.securityLeverage[0]?.move || '' : '');

  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(es => { const w = Math.round(es[0].contentRect.width); if (w > 200) setWidth(w); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const el = box.current; const s = svg.current;
    if (!el || !s || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([en]) => { try { if (en.isIntersecting) s.unpauseAnimations(); else s.pauseAnimations(); } catch { /* no SMIL */ } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => () => timers.current.forEach(t => window.clearTimeout(t)), []);

  /* ---------- layout ---------- */
  const L = useMemo(() => {
    const narrow = width < 640;
    const pad = 18;
    const rows = narrow ? 4 : 2;
    const per = Math.ceil(systems.length / rows);
    const sys: Record<string, { x: number; y: number }> = {};
    systems.forEach((k, i) => {
      const row = Math.floor(i / per), col = i % per;
      const cw = (width - pad * 2) / per;
      sys[k.id] = { x: pad + cw * (col + 0.5) + (row % 2 ? cw / 4 : -cw / 4) * (narrow ? 0 : 1), y: 26 + row * (narrow ? 30 : 34) };
    });
    const canopyB = 26 + (rows - 1) * (narrow ? 30 : 34);
    const fs = COMMONS.foundations;
    const fRows = narrow ? 2 : 1;
    const fPer = Math.ceil(fs.length / fRows);
    const maxN = Math.max(1, ...fs.map(f => f.rests.length));
    const fy0 = canopyB + (narrow ? 120 : 150);
    const fRowH = 120;
    const fnd: Record<string, { x: number; y: number; r: number }> = {};
    fs.forEach((f, i) => {
      const row = Math.floor(i / fPer), col = i % fPer;
      const cw = (width - pad * 2) / fPer;
      fnd[f.id] = { x: pad + cw * (col + 0.5), y: fy0 + row * fRowH, r: 9 + 15 * Math.sqrt(f.rests.length / maxN) };
    });
    const bandY = fy0 + (fRows - 1) * fRowH + 92;
    return { narrow, sys, fnd, bandY, H: bandY + 64, pad, labelW: Math.min(150, (width - pad * 2) / fPer - 8) };
  }, [width, systems]);

  /* ---------- what is lit ---------- */
  const f = sel.kind === 'f' ? COMMONS.foundations.find(x => x.id === sel.id) || null : null;
  const restsOf = (sysId: string) => COMMONS.foundations.flatMap(fd => fd.rests.filter(r => r.system === sysId).map(r => ({ f: fd, r })));
  const litSystems = new Set(sel.kind === 'f' ? (f?.rests.map(r => r.system) || []) : sel.kind === 's' ? [sel.id] : systems.map(k => k.id));
  const litFound = new Set(sel.kind === 'f' ? [sel.id] : sel.kind === 's' ? restsOf(sel.id).map(x => x.f.id) : []);
  const top = f?.contain[0];
  const ties = f ? f.contain.filter(c => top && c.gain === top.gain && c.helped === top.helped) : [];
  const hardest = f?.harden[0];

  function choose(s: Sel) {
    timers.current.forEach(t => window.clearTimeout(t)); timers.current = [];
    setPhase('idle'); setSel(s);
  }
  function letFail() {
    if (!f) return;
    setPhase('fail');
    if (calm) return;
    f.rests.slice(0, 4).forEach((_, i) => timers.current.push(window.setTimeout(() => Sound.fall(), 500 + i * 260)));
  }
  function contain() {
    if (!f || !top) return;
    setPhase('contain');
    if (calm) return;
    Sound.gratus();
    timers.current.push(window.setTimeout(() => Sound.verdict(true), 1200));
  }

  /* the health each system shows: whole, after the fall, or after the fall with the move in place */
  const hpOf = (sysId: string) => {
    if (!f || phase === 'idle') return 1;
    const r = f.rests.find(x => x.system === sysId);
    if (!r) return 1;
    const kept = phase === 'contain' && top ? Math.min(24, r.kept + (top.per?.[sysId] || 0)) : r.kept;
    return Math.max(0.15, kept / 24);
  };

  const order = (id: string) => (f ? f.rests.findIndex(r => r.system === id) : -1);

  return (
    <section className="cm" aria-label="What the systems rest on">
      <div className={'cm-stage' + (phase !== 'idle' ? ' ' + phase : '') + (calm ? ' calm' : '')} ref={box} style={{ height: L.H }}>
        <svg ref={svg} className="cm-links" width={width} height={L.H} viewBox={'0 0 ' + width + ' ' + L.H} aria-hidden>
          <defs>
            <linearGradient id="cm-col" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8effc" stopOpacity="0" /><stop offset="1" stopColor="#d8effc" stopOpacity="0.28" /></linearGradient>
          </defs>
          {/* every foundation stands on the bedrock */}
          {COMMONS.foundations.map(fd => {
            const p = L.fnd[fd.id];
            /* a foundation with another below it stands on that row, not straight on the band */
            if (Object.values(L.fnd).some(q => q !== p && Math.abs(q.x - p.x) < 4 && q.y > p.y)) return null;
            return <path key={'col' + fd.id} d={'M' + p.x + ' ' + (p.y + p.r + 34) + ' V' + (L.bandY - 4)} className="cm-col" stroke="url(#cm-col)" />;
          })}
          {/* the roots: from each system down to what it rests on; service travels up them */}
          {COMMONS.foundations.flatMap(fd => fd.rests.map(r => {
            const a = L.sys[r.system], b = L.fnd[fd.id];
            if (!a || !b) return null;
            const y1 = a.y + 7, y2 = b.y - b.r - 4, k = (y2 - y1) * 0.55;
            const dd = 'M' + b.x + ' ' + y2 + ' C' + b.x + ' ' + (y2 - k) + ' ' + a.x + ' ' + (y1 + k) + ' ' + a.x + ' ' + y1;
            const on = litFound.has(fd.id) && litSystems.has(r.system);
            const held = phase === 'contain' && f?.id === fd.id && !!top?.per?.[r.system];
            return (
              <g key={fd.id + r.system + r.part} className={'cm-root' + (on ? ' on' : '') + (held ? ' held' : '')} style={{ ['--h' as string]: HUE[fd.hue] || '#d8effc' }}>
                <path d={dd} className="cm-root-path" />
                {on && !calm && (
                  <circle r={2.4} className="cm-sig">
                    <animateMotion dur={(2.2 + (order(r.system) % 4) * 0.35) + 's'} repeatCount="indefinite" path={dd} />
                  </circle>
                )}
              </g>
            );
          }))}
        </svg>

        {systems.map(k => {
          const p = L.sys[k.id]; if (!p) return null;
          const on = litSystems.has(k.id);
          const i = order(k.id);
          return (
            <button key={k.id} type="button" className={'cm-sys' + (on ? ' on' : ' dim') + (sel.kind === 's' && sel.id === k.id ? ' focus' : '') + (k.own ? ' own' : '')}
              style={{ left: p.x, top: p.y, ['--hp' as string]: String(hpOf(k.id)), ['--i' as string]: String(Math.max(0, i)) }}
              aria-pressed={sel.kind === 's' && sel.id === k.id} aria-label={k.name}
              title={k.name} onClick={() => choose({ kind: 's', id: k.id })}>
              <i aria-hidden />
              {(on && sel.kind !== 'b' && (sel.kind === 's' || (f && f.rests.length <= 8))) && <span className="cm-sys-name">{k.name.replace(/ \(.*\)$/, '')}</span>}
            </button>
          );
        })}

        {COMMONS.foundations.map(fd => {
          const p = L.fnd[fd.id];
          const on = litFound.has(fd.id);
          return (
            <button key={fd.id} type="button" className={'cm-f' + (on ? ' on' : '') + (sel.kind === 'f' && sel.id === fd.id ? ' focus' : '')}
              style={{ left: p.x, top: p.y, ['--r' as string]: p.r + 'px', ['--h' as string]: HUE[fd.hue] || '#d8effc', ['--lw' as string]: L.labelW + 'px' }}
              aria-pressed={sel.kind === 'f' && sel.id === fd.id} aria-label={fd.name + ', ' + fd.rests.length + ' systems rest on it'}
              onClick={() => choose({ kind: 'f', id: fd.id })}>
              <span className="cm-f-orb" aria-hidden />
              <span className="cm-f-name">{fd.name}</span>
              <span className="cm-f-n">{fd.rests.length} {fd.rests.length === 1 ? 'system' : 'systems'}</span>
            </button>
          );
        })}

        <div className="cm-band" style={{ top: L.bandY, left: L.pad, right: L.pad }} role="group" aria-label="The bedrock every system rests on">
          {COMMONS.bedrock.map(b => (
            <button key={b.id} type="button" className={'cm-rock' + (sel.kind === 'b' && sel.id === b.id ? ' on' : '')} aria-pressed={sel.kind === 'b' && sel.id === b.id}
              title={b.line} onClick={() => choose({ kind: 'b', id: b.id })}>{b.name}</button>
          ))}
        </div>
      </div>

      <div className="cm-read" aria-live="polite">
        {f && (
          <>
            <div className="cm-head" style={{ ['--h' as string]: HUE[f.hue] }}>
              <i aria-hidden />
              <div><strong>{f.name}</strong><span>{f.line}</span></div>
            </div>
            <p className="cm-line">
              {f.rests.length === 1 ? 'One system rests on it here.' : f.rests.length + ' systems rest on it here.'} If it fails, {f.rests.length === 1 ? 'it loses' : 'they lose'} {h1(f.lost)} hours of service {f.rests.length === 1 ? '' : 'between them '}on the model's day.
            </p>
            {top && (
              <p className="cm-line cm-move">
                <strong>One move for all of them.</strong> {ties.map(t => t.name).join(' or ')} in place on every one keeps {h1(top.gain)} of those hours across {top.helped} {top.helped === 1 ? 'system' : 'systems'}.
              </p>
            )}
            {stewardMove(f.entry) && (
              <p className="cm-line">
                <strong>Harden the foundation itself.</strong> {stewardMove(f.entry)}
              </p>
            )}
            {hardest && (
              <p className="cm-line">
                <strong>Where they touch it.</strong> {hardest.name} at the parts that rest on it adds {h1(hardest.gain)} hours of the stress day across {hardest.helped} {hardest.helped === 1 ? 'system' : 'systems'}.
              </p>
            )}
            <div className="cm-actions">
              <button type="button" className="btn btn-sm" onClick={letFail} disabled={phase === 'fail'}>Let it fail</button>
              {top && <button type="button" className="btn btn-sm btn-key" onClick={contain} disabled={phase === 'contain'}>Contain it</button>}
              {phase !== 'idle' && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPhase('idle')}>Back to whole</button>}
              {known(f.entry) && <button type="button" className="btn btn-ghost btn-sm" onClick={() => open(f.entry!)}>Open its map</button>}
            </div>
            <ol className="cm-rests">
              {f.rests.map(r => {
                const kept = phase === 'contain' && top ? Math.min(24, r.kept + (top.per?.[r.system] || 0)) : r.kept;
                return (
                  <li key={r.system + r.part} style={{ ['--kept' as string]: String((phase === 'idle' ? r.kept : kept) / 24) }}>
                    <button type="button" className="cm-rest" onClick={() => open(r.system)}>
                      <span className="cm-rest-name"><strong>{r.systemName}</strong><span>{r.partName}</span></span>
                      <span className="cm-rest-bar" aria-hidden><i /></span>
                      <span className="cm-rest-h">{h1(phase === 'idle' ? r.kept : kept)} of 24 h</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </>
        )}
        {sel.kind === 's' && (() => {
          const k = KNOWN_SYSTEMS.find(x => x.id === sel.id);
          const on = restsOf(sel.id);
          if (!k) return null;
          return (
            <>
              <div className="cm-head"><div><strong>{k.name}</strong><span>{k.sector}</span></div></div>
              <p className="cm-line">
                {on.length ? 'Its map names ' + on.length + (on.length === 1 ? ' foundation' : ' foundations') + ': ' + on.map(x => x.f.name.toLowerCase() + ' (through ' + x.r.partName + ')').join('; ') + '.' : 'Its map names no shared foundation.'} Like every system here, it also rests on routing, certificates, time, power and water.
              </p>
              <div className="cm-actions"><button type="button" className="btn btn-sm" onClick={() => open(k.id)}>Open its map</button></div>
            </>
          );
        })()}
        {sel.kind === 'b' && (() => {
          const b = COMMONS.bedrock.find(x => x.id === sel.id);
          if (!b) return null;
          return (
            <>
              <div className="cm-head"><div><strong>{b.name}</strong><span>{b.line}</span></div></div>
              <p className="cm-line">Every system on this map rests on it, whether its own map names it or not.</p>
              {stewardMove(b.entry) && <p className="cm-line"><strong>Harden it.</strong> {stewardMove(b.entry)}</p>}
              <div className="cm-actions">
                {known(b.entry) ? <button type="button" className="btn btn-sm" onClick={() => open(b.entry)}>Open its map</button> : <span className="cm-note">Its map is being researched.</span>}
              </div>
            </>
          );
        })()}
      </div>
      <details className="sa-key cm-key">
        <summary>How to read this</summary>
        <ul>
          <li>The small lights at the top are the known systems. The larger ones below are the foundations they share. A foundation's size is how many systems rest on it.</li>
          <li>A root runs from a system to a foundation its own map names. Light travels up the roots: the service each system draws from it.</li>
          <li>The band at the bottom is the bedrock: routing, certificates, time, power and water. Every system rests on it.</li>
          <li>The hours are each system's day in the gauges' model when a blow that nothing holds lands on the part that rests on the foundation.</li>
        </ul>
      </details>
    </section>
  );
}
