/* STOCK VESSELS: the World's notation on the flat pages.
   A stock is a glass vessel with a level inside it. The level is the value
   over its ceiling, and it rises once when the vessel comes into view, the
   way a buffer fills. Under reduced motion it is drawn at its level. */

import React, { useEffect, useId, useRef, useState } from 'react';

export interface StockProps {
  value: number;
  max: number;
  label: string;
  /** the liquid's hue; ice by default */
  hue?: string;
  /** the line under the number: "of 24 h", "of 1,667,000 people" */
  note?: string;
  /** how the number is printed; a plain integer by default */
  format?: (v: number) => string;
  big?: boolean;
  small?: boolean;
}

const EASE = (t: number) => 1 - Math.pow(1 - t, 3);

export function StockVessel({ value, max, label, hue = '#b9d8f6', note, format, big, small }: StockProps) {
  const target = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const [level, setLevel] = useState(0);
  const [shown, setShown] = useState(0);
  const clip = useId().replace(/:/g, '');
  const ref = useRef<SVGSVGElement | null>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || typeof IntersectionObserver === 'undefined') { setLevel(target); setShown(value); return; }
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const from = level, fromV = shown;
      const tick = (now: number) => {
        /* a frame's time can fall just before t0, which would ease below the start and draw a negative fill */
        const k = EASE(Math.max(0, Math.min(1, (now - t0) / 1100)));
        setLevel(from + (target - from) * k);
        setShown(fromV + (value - fromV) * k);
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (seen.current) { run(); return () => cancelAnimationFrame(raf); }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { seen.current = true; io.disconnect(); run(); }
    }, { threshold: 0.3 });
    io.observe(el);
    const failsafe = window.setTimeout(() => { if (!seen.current) { seen.current = true; io.disconnect(); run(); } }, 1600);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(failsafe); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, value]);

  const top = 10, h = 74, y = top + h * (1 - level);
  const text = format ? format(shown) : Math.round(shown).toLocaleString();

  return (
    <div className={'sv' + (big ? ' sv-big' : '') + (small ? ' sv-small' : '')} style={{ ['--sv' as string]: hue }}>
      <svg ref={ref} viewBox="0 0 64 92" width={big ? 72 : small ? 34 : 56} height={big ? 104 : small ? 49 : 80} aria-hidden>
        <defs>
          <clipPath id={clip}><rect x="10" y={top} width="44" height={h} rx="12" /></clipPath>
          <linearGradient id={clip + 'g'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={hue} stopOpacity="0.85" />
            <stop offset="1" stopColor={hue} stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <rect x="10" y={top} width="44" height={h} rx="12" className="sv-glass" />
        <g clipPath={'url(#' + clip + ')'}>
          <rect x="10" y={y} width="44" height={top + h - y + 2} fill={'url(#' + clip + 'g)'} />
          <ellipse cx="32" cy={y} rx="22" ry="2.6" className="sv-surface" />
        </g>
        <line x1="15.5" y1={top + 8} x2="15.5" y2={top + h - 8} className="sv-light" />
        <ellipse cx="32" cy={top} rx="22" ry="3.4" className="sv-rim" />
      </svg>
      <span className="sv-text">
        <strong>{text}</strong>
        <small>{label}</small>
        {note && <em>{note}</em>}
      </span>
    </div>
  );
}

export function StockRow({ children }: { children: React.ReactNode }) {
  return <div className="sv-row">{children}</div>;
}
