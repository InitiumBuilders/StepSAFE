/* What the MOTRUS and Ankras pages share: the scene hooks, the step reader for walk-throughs, small drawing helpers
   and the bar along the top. Every scene plays once it is seen, loops only while visible, and under calm motion
   shows its last frame, which tells the whole story. */

import React, { useEffect, useRef, useState } from 'react';
import { Mark } from './Mark';

export type Vars = Record<string, string | number>;
export const v = (vars: Vars) => vars as React.CSSProperties;

export function calm(): boolean {
  try {
    return document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch { return false; }
}

/** a scene turns on once when its top passes into the lower fifth of the screen, or once it is above the screen (a
    fast scroll or a jump can pass it between frames), and is live only while it is visible */
export function useScene<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [on, setOn] = useState(false);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (calm() || typeof IntersectionObserver !== 'function') { setOn(true); return; }
    const seen = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { setOn(true); seen.disconnect(); }
    }, { rootMargin: '100000px 0px -18% 0px', threshold: 0 });
    const vis = new IntersectionObserver(es => { for (const e of es) setLive(e.isIntersecting); }, { threshold: 0 });
    seen.observe(el);
    vis.observe(el);
    return () => { seen.disconnect(); vis.disconnect(); };
  }, []);
  return { ref, on, live, cls: (on ? ' on' : '') + (live ? ' live' : '') };
}

/** a walk-through: the step crossing a line near the middle of the screen is the one shown on the stage */
export function useSteps(count: number) {
  const els = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return;
    const phone = window.matchMedia('(max-width: 900px)').matches;
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step) || 0);
    }, { rootMargin: phone ? '-64% 0px -34% 0px' : '-46% 0px -52% 0px', threshold: 0 });
    els.current.slice(0, count).forEach(el => { if (el) io.observe(el); });
    return () => io.disconnect();
  }, [count]);
  const bind = (i: number) => (el: HTMLElement | null) => { els.current[i] = el; };
  return { active, bind };
}

/** a link with a #part opens there once the page has drawn (the browser looks for it before the page exists), and
    again once the fonts have settled the layout, unless the visitor has started moving by then */
export function useHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    let moved = false;
    const go = () => { if (!moved) document.getElementById(id)?.scrollIntoView({ block: 'start' }); };
    const stop = () => { moved = true; };
    const opts = { passive: true } as AddEventListenerOptions;
    addEventListener('wheel', stop, opts); addEventListener('touchstart', stop, opts); addEventListener('keydown', stop);
    window.requestAnimationFrame(go);
    document.fonts?.ready.then(() => window.requestAnimationFrame(go)).catch(() => {});
    const t = window.setTimeout(go, 1200);
    return () => { window.clearTimeout(t); removeEventListener('wheel', stop); removeEventListener('touchstart', stop); removeEventListener('keydown', stop); };
  }, []);
}

/** the light has a source: on a desktop, the rim of the glass under the pointer catches it where the pointer is.
    One listener for the page; it writes two values on the one panel under the pointer, never on the root */
export function usePointerLight() {
  useEffect(() => {
    if (calm() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0, x = 0, y = 0;
    let want: HTMLElement | null = null, cur: HTMLElement | null = null;
    const paint = () => {
      raf = 0;
      if (cur !== want) { cur?.classList.remove('mt-lit'); cur = want; cur?.classList.add('mt-lit'); }
      if (!cur) return;
      const r = cur.getBoundingClientRect();
      cur.style.setProperty('--px', Math.round(x - r.left) + 'px');
      cur.style.setProperty('--py', Math.round(y - r.top) + 'px');
    };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      want = (e.target instanceof Element ? e.target.closest('.mt-panel') : null) as HTMLElement | null;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => { want = null; if (!raf) raf = requestAnimationFrame(paint); };
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => { document.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); cur?.classList.remove('mt-lit'); };
  }, []);
}

export const rad = (deg: number) => (deg * Math.PI) / 180;
export const at = (cx: number, cy: number, r: number, deg: number) => ({ x: cx + r * Math.cos(rad(deg)), y: cy + r * Math.sin(rad(deg)) });

/** a line drawn in its own frame, so it can grow from its start with a transform */
export function Grow({ x1, y1, x2, y2, cls, d }: { x1: number; y1: number; x2: number; y2: number; cls: string; d?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g transform={`translate(${x1.toFixed(1)} ${y1.toFixed(1)}) rotate(${ang.toFixed(2)})`}>
      <line x1={0} y1={0} x2={len.toFixed(1)} y2={0} className={cls} style={d === undefined ? undefined : v({ '--d': d + 'ms' })} />
    </g>
  );
}

/** the three proposal pages, by their own names */
const PAGES = [
  { key: 'motrus', name: 'MOTRUS', href: '/MOTRUS' },
  { key: 'ankras', name: 'Ankras', href: '/ankras' },
  { key: 'paxt', name: 'PAXT', href: '/PAXT' },
] as const;
export type ProposalPage = (typeof PAGES)[number]['key'];

/** the bar along the top of the three pages: this page's name, the other two, and the way back to the Praxis */
export function TopNav({ page }: { page: ProposalPage }) {
  const here = PAGES.find(p => p.key === page) || PAGES[0];
  return (
    <nav className="mt-top" aria-label={here.name}>
      <a className="mt-top-mark" href="#top"><Mark /><span>{here.name}</span></a>
      <span className="mt-top-links">
        {PAGES.filter(p => p.key !== page).map(p => <a key={p.key} className="mt-top-link" href={p.href}>{p.name}</a>)}
        <a className="mt-top-link" href="/">StepSAFE</a>
      </span>
    </nav>
  );
}

/** The parts of the page, one tap away. These pages are long; the button sits in the corner and lists every part by
    its own heading, read from the page when it opens, so a new section joins the list by having a heading. */
export function PartsIndex() {
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState<{ id: string; t: string }[]>([]);
  const btn = useRef<HTMLButtonElement | null>(null);
  const read = () => setParts([...document.querySelectorAll<HTMLElement>('main section[id]')]
    .map(s => ({ id: s.id, t: (s.querySelector('h2')?.textContent || '').replace(/ +/g, ' ').trim() })).filter(x => x.t));
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const onDown = (e: PointerEvent) => { if (!(e.target instanceof Element) || !e.target.closest('.mt-parts')) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onDown); };
  }, [open]);
  return (
    <div className={'mt-parts' + (open ? ' open' : '')}>
      {open && (
        <nav className="mt-parts-list" aria-label="Parts of this page">
          <ol>
            {parts.map((x, i) => (
              <li key={x.id}><a href={'#' + x.id} onClick={() => setOpen(false)}><span aria-hidden>{String(i + 1).padStart(2, '0')}</span>{x.t}</a></li>
            ))}
          </ol>
        </nav>
      )}
      <button ref={btn} type="button" className="mt-parts-btn" aria-expanded={open} onClick={() => { if (!open) read(); setOpen(o => !o); }}>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden><path d="M4 5.5h12M4 10h12M4 14.5h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        Parts
      </button>
    </div>
  );
}

export { Mark };
