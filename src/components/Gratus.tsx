/* Gratus marks and the Gold rite.

   Gratus is an eight point star in a ring, drawn as two overlapping squares.
   Gratus Gold adds sixteen rays and is drawn in gold. The halo brightens and
   dims slowly and nothing spins. Under reduced motion every mark is still. */

import React, { useEffect, useId, useRef } from 'react';
import type { GoldMoment } from '../lib/state';
import { BAND_LABEL, bandOf } from '../content/modux-schema';

export function GratusSigil({ gold = false, size = 64, draw = false, still = false }: {
  gold?: boolean; size?: number; draw?: boolean; still?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const a = gold ? '#fff1cc' : '#e6f6ff';
  const b = gold ? '#e8c46b' : '#a78bff';
  const c = gold ? '#a8761f' : '#5b8cff';
  const stroke = 'url(#gs-s-' + id + ')';
  const cls = (base: string) => base + (draw ? ' gx-draw' : '');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden
      className={'gx-sigil' + (gold ? ' gold' : '') + (still ? ' still' : '')}>
      <defs>
        <radialGradient id={'gs-h-' + id}>
          <stop offset="0" stopColor={b} stopOpacity="0.55" />
          <stop offset="0.55" stopColor={b} stopOpacity="0.16" />
          <stop offset="1" stopColor={b} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={'gs-s-' + id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.5" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <circle className="gx-halo" cx="50" cy="50" r="49" fill={'url(#gs-h-' + id + ')'} />
      {gold && Array.from({ length: 16 }, (_, k) => {
        const t = (k / 16) * Math.PI * 2;
        const r1 = k % 2 ? 42.5 : 41.5, r2 = k % 2 ? 46 : 48.5;
        return (
          <line key={k} className={cls('gx-ray')} pathLength={1}
            x1={50 + Math.cos(t) * r1} y1={50 + Math.sin(t) * r1}
            x2={50 + Math.cos(t) * r2} y2={50 + Math.sin(t) * r2}
            stroke={stroke} strokeWidth={k % 2 ? 1.2 : 1.8} strokeLinecap="round"
            style={draw ? { animationDelay: 0.9 + k * 0.04 + 's' } : undefined} />
        );
      })}
      <circle className={cls('gx-ring')} pathLength={1} cx="50" cy="50" r="38" fill="none" stroke={stroke} strokeWidth="1.6" />
      <polygon className={cls('gx-sq')} pathLength={1} points="50,23 77,50 50,77 23,50"
        fill={b} fillOpacity="0.1" stroke={stroke} strokeWidth="2" strokeLinejoin="round"
        style={draw ? { animationDelay: '0.3s' } : undefined} />
      <polygon className={cls('gx-sq')} pathLength={1} points="31,31 69,31 69,69 31,69"
        fill={b} fillOpacity="0.08" stroke={stroke} strokeWidth="2" strokeLinejoin="round"
        style={draw ? { animationDelay: '0.5s' } : undefined} />
      <circle cx="50" cy="50" r="7.5" fill={stroke} className="gx-core" />
    </svg>
  );
}

/** The two counts, side by side, for the profile, the hub and the rail. */
export function GratusCounts({ gratus, gold, size = 44 }: { gratus: number; gold: number; size?: number }) {
  return (
    <div className="gx-counts">
      <span className="gx-count">
        <GratusSigil size={size} />
        <span><strong>{gratus.toLocaleString()}</strong><span className="gx-count-l">Gratus</span></span>
      </span>
      <span className="gx-count">
        <GratusSigil size={size} gold />
        <span><strong className="gold">{gold.toLocaleString()}</strong><span className="gx-count-l">Gratus Gold</span></span>
      </span>
    </div>
  );
}

/** The moment Gold is earned. */
export function GoldRite({ moment, total, onClose }: { moment: GoldMoment; total: number; onClose: () => void }) {
  const btn = useRef<HTMLButtonElement | null>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    /* focus goes to the one button, and back to where it was when the rite closes */
    const before = document.activeElement as HTMLElement | null;
    btn.current?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close.current(); };
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); before?.focus?.(); };
  }, []);
  const band = BAND_LABEL[bandOf(moment.notch)];
  return (
    <div className="gx-rite" role="dialog" aria-modal="true" aria-labelledby="gx-rite-t" onClick={onClose}>
      <div className="gx-rite-card" onClick={e => e.stopPropagation()}>
        <div className="gx-rite-mark"><GratusSigil gold size={208} draw /></div>
        <span className="gx-rite-kicker">GRATUS GOLD</span>
        <h2 id="gx-rite-t">{moment.title}</h2>
        <p className="gx-rite-line">
          {moment.why === 'beyond'
            ? 'Held past the catalog ceiling at notch ' + moment.notch + '. No stack from the catalog can hold this notch. Yours did.'
            : 'Held at notch ' + moment.notch + ', ' + band + ', with ' + moment.score + ' against a reference of ' + moment.ref + '.'}
        </p>
        <p className="gx-rite-total">Gratus Gold earned: <strong>{total}</strong></p>
        <button ref={btn} className="btn btn-key" onClick={onClose}>Keep moving</button>
      </div>
    </div>
  );
}
