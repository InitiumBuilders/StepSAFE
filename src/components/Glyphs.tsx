/* SYMBOLIC MARKS — geometry that means something.
   Every kind of work carries its own figure, so the learner reads the shape of
   the task before they read its title. No icon here is decorative: each one
   argues what that kind of work actually is. */

import React from 'react';
import type { StepKind } from '../content/schema';

export const KIND_MEANING: Record<StepKind, string> = {
  construct: 'A mental model — the smallest transferable unit of thought. Built once, used everywhere.',
  lesson: 'Transmission. Someone learned this the expensive way so you would not have to.',
  drill: 'A decision under a clock. The plausible-but-wrong answer is the whole point.',
  lab: 'Hands on the machine. You do not know a thing until you have made it fail.',
  field: 'Out of the building. A real artifact, real evidence, real consequences.',
  council: 'The room where it is decided. Technical truth without narrative is inert.',
};

export function KindMark({ kind, size = 22 }: { kind: StepKind; size?: number }) {
  const p = { className: 'kindmark', width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true };
  switch (kind) {
    case 'construct': // stacked foundation — what everything else stands on
      return (
        <svg {...p}>
          <rect x="3" y="14" width="18" height="6" rx="1" />
          <rect x="6" y="8" width="12" height="6" rx="1" />
          <rect x="9.5" y="3" width="5" height="5" rx="1" className="fillbit" />
        </svg>
      );
    case 'lesson': // transmission — a signal crossing a boundary
      return (
        <svg {...p}>
          <circle cx="6" cy="12" r="2.4" className="fillbit" />
          <path d="M10 12h10" />
          <path d="M13.5 7.5 20 12l-6.5 4.5" />
          <path d="M3 6.5v11" />
        </svg>
      );
    case 'drill': // reticle — a decision taken under aim and clock
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" />
          <circle cx="12" cy="12" r="2" className="fillbit" />
        </svg>
      );
    case 'lab': // vessel under pressure — you make it fail on purpose
      return (
        <svg {...p}>
          <path d="M9.5 3v6.2L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3l-4.9-8.8V3" />
          <path d="M8 3h8" />
          <path d="M7.4 14.5h9.2" />
        </svg>
      );
    case 'field': // a mark planted in ground — evidence that you were there
      return (
        <svg {...p}>
          <path d="M6 21V3" />
          <path d="M6 4h11l-2.6 3.5L17 11H6" className="fillbit" />
          <path d="M2.5 21h11" />
        </svg>
      );
    case 'council': // the table — distributed authority around one question
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="4.6" />
          <circle cx="12" cy="3.4" r="1.8" className="fillbit" />
          <circle cx="19.4" cy="16" r="1.8" className="fillbit" />
          <circle cx="4.6" cy="16" r="1.8" className="fillbit" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---- tier marks: the three kinds of standing ---- */

export function TierMark({ tier, size = 20 }: { tier: 'small' | 'strong' | 'safe'; size?: number }) {
  const p = { className: 'kindmark', width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true };
  if (tier === 'small')
    return (
      <svg {...p}>
        <circle cx="12" cy="12" r="3.4" className="fillbit" />
        <circle cx="12" cy="12" r="8.4" />
      </svg>
    );
  if (tier === 'strong')
    return (
      <svg {...p}>
        <path d="M12 2.6 21 7.4v9.2L12 21.4 3 16.6V7.4z" />
        <path d="M12 8.2 16.6 10.7v4.9L12 18.1 7.4 15.6v-4.9z" className="fillbit" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M12 2.4 20.6 6v7.1c0 4.4-3.6 7.4-8.6 8.9-5-1.5-8.6-4.5-8.6-8.9V6z" />
      <path d="M8.4 12.2 11 14.9l4.8-5.1" />
    </svg>
  );
}

/* ---- THE SEAL — a generative identity mark.
   FNV-1a over the learner's handle drives a star polygon: point count, skip,
   rotation, and ring radii. Same name, same seal, forever. Change one letter
   and it turns. Statement: no two records are the same. ---- */

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function Seal({ seed, size = 168, gold = true }: { seed: string; size?: number; gold?: boolean }) {
  const h = fnv1a(seed || 'unitium');
  const points = 7 + (h % 6); // 7..12
  const skip = 2 + ((h >> 4) % Math.max(1, Math.floor(points / 2) - 1));
  const rot = (h >> 9) % 360;
  const inner = 0.34 + ((h >> 13) % 22) / 100;
  const R = size / 2 - 12;
  const cx = size / 2, cy = size / 2;

  const pt = (i: number, r: number) => {
    const a = ((i / points) * Math.PI * 2) + (rot * Math.PI) / 180 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };

  // the star: connect every `skip`-th vertex until the cycle closes
  const path: string[] = [];
  const visited = new Set<number>();
  let i = 0;
  do {
    visited.add(i);
    const [x, y] = pt(i, R);
    path.push((path.length ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2));
    i = (i + skip) % points;
  } while (!visited.has(i) && visited.size < points);
  path.push('Z');

  const stroke = gold ? 'var(--gold)' : 'var(--cyan)';
  const rings = [0.42, 0.68, 1].map(k => R * k);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img"
      aria-label={'Praxis seal for ' + (seed || 'operator')}>
      <g className="seal-spin">
        {rings.map((r, k) => (
          <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke="var(--frame-strong)"
            strokeWidth={k === 2 ? 1.6 : 1} strokeDasharray={k === 1 ? '3 6' : undefined} />
        ))}
      </g>
      <path d={path.join(' ')} fill="none" stroke={stroke} strokeWidth={2.4}
        strokeLinejoin="round" opacity={0.95} />
      {Array.from({ length: points }, (_, k) => {
        const [x, y] = pt(k, R);
        return <circle key={k} cx={x} cy={y} r={2.6} fill={stroke} />;
      })}
      <circle cx={cx} cy={cy} r={R * inner} fill="none" stroke={stroke} strokeWidth={1.3} opacity={0.7} />
      <circle cx={cx} cy={cy} r={3.2} fill={stroke} />
    </svg>
  );
}

/* ---- rank insignia: geometry that accretes with standing ---- */

export function RankInsignia({ index, size = 30 }: { index: number; size?: number }) {
  const bars = Math.min(5, Math.floor(index / 2) + 1);
  const crowned = index >= 8;
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden className="kindmark">
      {Array.from({ length: bars }, (_, k) => (
        <path key={k} d={`M6 ${22 - k * 4} h18`} strokeWidth={2.2}
          style={{ stroke: k === bars - 1 && crowned ? 'var(--gold)' : 'var(--cyan)' }} />
      ))}
      {crowned && <path d="M9 6 15 2l6 4-6 3z" className="fillbit" style={{ fill: 'var(--gold)' }} />}
    </svg>
  );
}
