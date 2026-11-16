/* THE GREAT MAP: the twelve chapters as a constellation drawn from the
   prerequisite graph. A locked-in chapter is a lit star; an open one is a
   ring; a sealed one is a faint ring. Along every edge from a chapter that
   has opened its dependents, a signal travels toward them (M6), and the
   chapter you are in the middle of breathes (M8). Click a star to open it.
   Under reduced motion the map is drawn still.

   Each act's two chapters stand together, the act named above them, so the map reads as the journey it is: six acts,
   left to right on a wide screen, and every star carries its chapter's name. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CHAPTERS, ESSENCE_HEX } from '../content/registry';
import { useS } from '../lib/state';
import { chapterUnlocked, prereqSatisfied } from '../lib/unlock';

interface Node { id: string; x: number; y: number; hue: string; order: number; title: string; lines: string[]; done: boolean; open: boolean; steps: number; total: number }
interface Act { label: string; x: number; y: number; hue: string }
interface Edge { from: Node; to: Node; lit: boolean; d: string; len: number }

const PITCH_Y = 150;
/* room above the first row for the acts' names */
const TOP = 74;

/** a chapter's name in lines short enough for its column, at most three */
function wrapTitle(t: string, max: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of t.split(' ')) {
    const next = (line + ' ' + word).trim();
    if (next.length > max && line) { out.push(line); line = word; } else line = next;
  }
  if (line) out.push(line);
  return out.slice(0, 3);
}

export function ChapterMap() {
  const { s, d } = useS();
  const wrap = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const pulses = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const read = () => setW(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { nodes, edges, acts, height, current } = useMemo(() => {
    const cols = w >= 760 ? 6 : 3;
    const pitchX = (w || 900) / cols;
    const max = Math.max(10, Math.floor((pitchX - 18) / 7.4));
    const list: Node[] = CHAPTERS.map((c, i) => {
      const pair = Math.floor(i / 2), within = i % 2;
      const col = pair % cols, row = Math.floor(pair / cols) * 2 + within;
      const steps = c.pages.reduce((n, p) => n + p.steps.filter(st => s.completedSteps[st.id]).length, 0);
      const total = c.pages.reduce((n, p) => n + p.steps.length, 0);
      return {
        id: c.id, order: c.order, title: c.title, lines: wrapTitle(c.title, max), hue: ESSENCE_HEX[c.essence] || '#a78bff',
        x: (col + 0.5) * pitchX + (within ? 16 : -16), y: TOP + row * PITCH_Y,
        done: !!s.completedChapters[c.id], open: chapterUnlocked(c, s.completedChapters, s.completedPages),
        steps, total,
      };
    });
    const byId = new Map(list.map(n => [n.id, n]));
    const es: Edge[] = [];
    for (const c of CHAPTERS) for (const p of c.prereq) {
      const a = byId.get(p), b = byId.get(c.id);
      if (!a || !b) continue;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 18;
      es.push({ from: a, to: b, lit: prereqSatisfied(p, s.completedChapters, s.completedPages), d: `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`, len: Math.hypot(b.x - a.x, b.y - a.y) });
    }
    const rows = Math.ceil(CHAPTERS.length / 2 / cols) * 2;
    /* an act is a pair of chapters: named once, above its first */
    const actList: Act[] = [];
    for (let i = 0; i < CHAPTERS.length; i += 2) {
      const pair = i / 2, col = pair % cols, block = Math.floor(pair / cols);
      actList.push({ label: CHAPTERS[i].act, x: (col + 0.5) * pitchX, y: TOP + block * 2 * PITCH_Y - 46, hue: ESSENCE_HEX[CHAPTERS[i].essence] || '#a78bff' });
    }
    /* the chapter in progress: open, not done, most steps */
    const cur = list.filter(n => n.open && !n.done && n.steps > 0).sort((a, b) => b.steps / b.total - a.steps / a.total)[0]
      || list.find(n => n.open && !n.done) || null;
    return { nodes: list, edges: es, acts: actList, height: TOP + (rows - 1) * PITCH_Y + 96, current: cur };
  }, [w, s.completedChapters, s.completedPages, s.completedSteps]);

  /* the signals: one light per lit edge whose target is still open, travelling the curve */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) return;
    let raf = 0, visible = true;
    const paths = Array.from(el.querySelectorAll<SVGPathElement>('path[data-signal]'));
    const io = new IntersectionObserver(en => { visible = en.some(e => e.isIntersecting); if (visible) raf = requestAnimationFrame(tick); });
    io.observe(el);
    const t0 = performance.now();
    const tick = (now: number) => {
      if (!visible) return;
      paths.forEach((p, i) => {
        const c = pulses.current[i];
        if (!c) return;
        const L = p.getTotalLength();
        const k = ((now - t0) / 2600 + i * 0.37) % 1;
        const pt = p.getPointAtLength(L * k);
        c.setAttribute('cx', String(pt.x));
        c.setAttribute('cy', String(pt.y));
        c.setAttribute('opacity', String(Math.sin(k * Math.PI)));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [edges]);

  const shown = nodes.find(n => n.id === hover) || current;
  const signals = edges.filter(e => e.lit && !e.to.done);

  return (
    <div className="cmap" ref={wrap} data-keystone data-essence="#9cc3ef">
      <svg width="100%" height={height} viewBox={`0 0 ${w || 900} ${height}`} preserveAspectRatio="none" role="group" aria-label="The map of the twelve chapters">
        <defs>
          <filter id="cmap-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {acts.map(a => (
          <g key={a.label} className="cmap-act" transform={`translate(${a.x},${a.y})`} style={{ ['--hue' as string]: a.hue }}>
            <text className="cmap-act-name">{a.label}</text>
            <path d="M-14 9 H14" className="cmap-act-line" />
          </g>
        ))}
        {edges.map((e, i) => (
          <path key={i} d={e.d} className={'cmap-edge' + (e.lit ? ' lit' : '')} style={{ ['--hue' as string]: e.to.hue }} />
        ))}
        {signals.map((e, i) => (
          <path key={'s' + i} d={e.d} data-signal fill="none" stroke="none" />
        ))}
        {signals.map((e, i) => (
          <circle key={'p' + i} r="3.2" className="cmap-pulse" style={{ ['--hue' as string]: e.to.hue }} ref={el => { pulses.current[i] = el; }} />
        ))}
        {nodes.map(n => (
          <g key={n.id} className={'cmap-node' + (n.done ? ' done' : n.open ? ' open' : ' sealed') + (current && current.id === n.id ? ' current' : '')}
            style={{ ['--hue' as string]: n.hue }} transform={`translate(${n.x},${n.y})`}
            role={n.open ? 'button' : undefined} tabIndex={n.open ? 0 : -1}
            aria-label={'Chapter ' + n.order + ', ' + n.title + (n.done ? ', locked in' : n.open ? ', open' : ', sealed')}
            onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
            onClick={() => { if (n.open) d({ t: 'route', view: 'chapter', id: n.id }); }}
            onKeyDown={e => { if (n.open && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); d({ t: 'route', view: 'chapter', id: n.id }); } }}>
            {n.done && <circle r="16" className="cmap-halo" filter="url(#cmap-glow)" />}
            <circle r="26" className="cmap-hit" />
            <circle r="11" className="cmap-star" />
            {n.open && !n.done && n.total > 0 && (
              <circle r="17" className="cmap-ring" pathLength={100} strokeDasharray={`${Math.round(100 * n.steps / n.total)} 100`} transform="rotate(-90)" />
            )}
            <text y="34" className="cmap-num">{String(n.order).padStart(2, '0')}</text>
            <text y="52" className="cmap-title">
              {n.lines.map((l, i) => <tspan key={i} x={0} dy={i ? 15 : 0}>{l}</tspan>)}
            </text>
          </g>
        ))}
      </svg>
      <div className="cmap-caption" aria-live="polite">
        {shown ? (
          <>
            <span className="label">CHAPTER {String(shown.order).padStart(2, '0')}{shown.done ? ' · LOCKED IN' : shown.open ? '' : ' · SEALED'}</span>
            <strong>{shown.title}</strong>
            {shown.open && !shown.done && <em>{shown.steps} of {shown.total} steps</em>}
          </>
        ) : (
          <strong>Twelve chapters. The lines are what opens what.</strong>
        )}
      </div>
    </div>
  );
}
