/* A TOKEN, DRAWN AS A STOCK. The supply is the level in a glass vessel. A maximum is the vessel's rim; with no
   maximum the glass has no top. Minting at will is the pipe that fills it: light moves down the pipe only when
   someone may mint today, the valve is shut when no one may, and a plug closes the pipe when no one ever can. The
   marks over the valve count the keys it takes. A second, short pipe under a clock is a schedule: tokens the
   contract releases by itself. A line across the glass is the supply the token was created with.
   Every part of the drawing is a fact from the reading, and the same facts are written beside it, so the drawing
   is hidden from a screen reader and nothing rests on colour. */

import React, { useEffect, useId, useRef, useState } from 'react';
import type { Holder, TokenRead } from '../lib/onchain';
import { alone, nobody } from '../lib/onchain';

/* how many keys an action takes, of how many: one of one for a single identity, two of three for a group */
function keysOf(h: Holder): { need: number; total: number } | null {
  if (h.who === 'owner' || h.who === 'identity') return { need: 1, total: 1 };
  if (h.who === 'group' && h.group && h.group.least > 0) { const total = Math.min(h.group.members, 7); return { need: Math.min(h.group.least, total), total }; }
  return null;
}

/** the keys an action takes, as marks beside the words that say it: filled for each key needed */
export function KeyMarks({ h }: { h: Holder }) {
  const k = keysOf(h);
  if (!k) return null;
  return (
    <span className={'tkr-keys' + (alone(h) ? ' tkr-keys-one' : '')} aria-hidden>
      {Array.from({ length: k.total }, (_, i) => <i key={i} className={i < k.need ? 'tkr-on' : ''} />)}
    </span>
  );
}

const ratio = (a: string | null, b: string | null): number | null => {
  if (a == null || b == null) return null;
  try { const x = BigInt(a), y = BigInt(b); if (y <= 0n) return null; return Math.max(0, Math.min(1, Number((x * 10000n) / y) / 10000)); } catch { return null; }
};

/* the glass: its mouth, its floor, and how tall the liquid stands when the vessel is full */
const X = 96, W = 128, MOUTH = 58, FLOOR = 246, FULL = FLOOR - MOUTH - 8;
const PIPE = 'M22 34 H' + (X + W / 2) + ' V' + (MOUTH + 12);
/* the schedule's own pipe, to the right of the first */
const TX = X + W - 30;
const TIMED = 'M' + TX + ' 26 V' + (MOUTH + 12);
/* with no maximum there is no full, so the level is drawn a little over half */
const OPEN_LEVEL = 0.56;

export function TokenVessel({ token }: { token: TokenRead }) {
  const { supply, rules } = token;
  const capped = supply.max != null;
  const now = supply.now ?? supply.base;
  const target = capped ? ratio(now, supply.max) ?? 0 : !now || now === '0' ? 0 : OPEN_LEVEL;
  const baseAt = capped ? ratio(supply.base, supply.max) : now && now !== '0' ? (ratio(supply.base, now) ?? 1) * OPEN_LEVEL : null;
  const mint = rules.mint;
  const flowing = mint.read && !nobody(mint.does);
  const plugged = mint.read && nobody(mint.does) && nobody(mint.changes);
  const keys = flowing ? keysOf(mint.does) : null;
  const timed = !!token.schedule || token.programmed > 0;
  const [level, setLevel] = useState(0);
  const uid = useId().replace(/:/g, '');
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.getAttribute('data-motion') === 'calm';
    if (still || typeof IntersectionObserver === 'undefined') { setLevel(target); return; }
    let raf = 0, done = false;
    const run = () => {
      if (done) return;
      done = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        /* a frame's time can fall just before t0, which would ease below the start */
        const k = Math.max(0, Math.min(1, (t - t0) / 1200));
        setLevel(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); run(); } }, { threshold: 0.25 });
    io.observe(el);
    const failsafe = window.setTimeout(() => { io.disconnect(); run(); }, 1500);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(failsafe); };
  }, [target, token.id]);

  const y = FLOOR - 4 - FULL * level;
  const yBase = baseAt != null ? FLOOR - 4 - FULL * baseAt : null;
  /* drawn only where it can be told from the floor and from the surface */
  const showBase = yBase != null && supply.base !== now && (baseAt ?? 0) > 0.05 && Math.abs((baseAt ?? 0) - target) > 0.03;
  const state = !mint.read ? 'unread' : flowing ? (alone(mint.does) ? 'alone' : 'shared') : plugged ? 'plugged' : 'shut';

  return (
    <svg ref={ref} className={'tkr-vessel tkr-v-' + state + (capped ? ' tkr-capped' : ' tkr-nocap')} viewBox="10 0 232 262" aria-hidden focusable="false">
      <defs>
        <clipPath id={uid + 'c'}><path d={'M' + (X + 4) + ' ' + (MOUTH - 30) + ' V' + (FLOOR - 22) + ' a18 18 0 0 0 18 18 H' + (X + W - 22) + ' a18 18 0 0 0 18 -18 V' + (MOUTH - 30) + ' z'} /></clipPath>
        <linearGradient id={uid + 'l'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--tkr-liquid)" stopOpacity="0.92" />
          <stop offset="1" stopColor="var(--tkr-liquid)" stopOpacity="0.4" />
        </linearGradient>
        {/* a vessel with no maximum: its glass fades out upward, so there is no top to reach */}
        <linearGradient id={uid + 'g'} gradientUnits="userSpaceOnUse" x1="0" y1={MOUTH - 30} x2="0" y2={FLOOR}>
          <stop offset="0" stopColor="var(--tkr-glass)" stopOpacity={capped ? 1 : 0} />
          <stop offset="0.36" stopColor="var(--tkr-glass)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* the pipe that fills it, its valve, and the keys the valve takes */}
      <path className="tkr-pipe" d={PIPE} />
      {flowing && <path className="tkr-flow" d={PIPE} pathLength={100} />}
      <g className="tkr-valve" transform="translate(64 34)">
        <circle r="13" />
        <path d={flowing ? 'M-7 0H7' : 'M0 -7V7'} />
      </g>
      {keys && (
        <g className="tkr-valve-keys" transform={'translate(' + (64 - (keys.total - 1) * 5.5) + ' 10)'}>
          {Array.from({ length: keys.total }, (_, i) => <circle key={i} cx={i * 11} cy="0" r="3.6" className={i < keys.need ? 'tkr-on' : ''} />)}
        </g>
      )}
      {plugged && <rect className="tkr-plug" x={X + W / 2 - 13} y={MOUTH - 19} width="26" height="11" rx="4" />}
      {timed && (
        <g className="tkr-timed">
          <path className="tkr-pipe" d={TIMED} />
          <path className="tkr-flow" d={TIMED} pathLength={40} />
          <circle cx={TX} cy="14" r="9" />
          <path className="tkr-hands" d={'M' + TX + ' 9 V14 H' + (TX + 4)} />
        </g>
      )}

      {/* the glass, the level, and the level it was created at */}
      <path className="tkr-glass" stroke={'url(#' + uid + 'g)'} d={'M' + X + ' ' + (capped ? MOUTH : MOUTH - 30) + ' V' + (FLOOR - 22) + ' a22 22 0 0 0 22 22 H' + (X + W - 22) + ' a22 22 0 0 0 22 -22 V' + (capped ? MOUTH : MOUTH - 30)} />
      <g clipPath={'url(#' + uid + 'c)'}>
        <rect x={X + 4} y={y} width={W - 8} height={Math.max(0, FLOOR - y)} fill={'url(#' + uid + 'l)'} />
        {level > 0.004 && <ellipse className="tkr-surface" cx={X + W / 2} cy={y} rx={W / 2 - 5} ry="4" />}
        {/* the glass catches light where it holds something */}
        {FLOOR - y > 56 && <path className="tkr-light" d={'M' + (X + 13) + ' ' + (y + 14) + ' V' + (FLOOR - 26)} />}
      </g>
      {showBase && <path className="tkr-base" d={'M' + (X - 14) + ' ' + yBase + ' H' + (X + W + 14)} />}
      {capped && <ellipse className="tkr-rim" cx={X + W / 2} cy={MOUTH} rx={W / 2} ry="6" />}
    </svg>
  );
}
