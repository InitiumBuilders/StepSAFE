/* THE PAGE SIGILS. One small drawn figure beside each page's heading, each the page's own
   system idea, each in its own hue so the site reads as a spectrum. Each one moves with its
   page's meaning (styles/sigil.css): the seed of life drawn ring by ring, twelve chapters
   locking in around a centre, a message reaching you through rooms inside rooms, a light
   climbing the path and the stairs, seats filling around the unit, the keystone settling into
   its arch, a signal running the vector, the three lights of the controls, the threads of the
   web lighting in turn, a card turned and put back, and a lens closing on one point. They hold
   still under reduced or calm motion. The motion lives in styles/sigil.css, loaded with the other
   sheets in main.tsx so the probes can read this file in Node. Pure figures: no state, nothing measured. */

import React from 'react';

export type SigilKind = 'seed' | 'twelve' | 'rooms' | 'path' | 'stairs' | 'unit' | 'keystone' | 'vector' | 'tune' | 'web' | 'deck' | 'lens';

const HUES: Record<SigilKind, [string, string]> = {
  seed: ['#f8f1fb', '#d8effc'],
  twelve: ['#d8b4fe', '#a78bff'],
  rooms: ['#fdc26f', '#e8786a'],
  path: ['#d8effc', '#9cc3ef'],
  stairs: ['#fdc26f', '#f0d48c'],
  unit: ['#f18ac6', '#d8b4fe'],
  keystone: ['#f0d48c', '#fdc26f'],
  vector: ['#9cc3ef', '#7282ed'],
  tune: ['#d8b4fe', '#9cc3ef'],
  web: ['#c084fc', '#9cc3ef'],
  deck: ['#fdc26f', '#f18ac6'],
  lens: ['#d8effc', '#a78bff'],
};

const at = (i: number) => ({ ['--i' as string]: String(i) }) as React.CSSProperties;

function figure(kind: SigilKind) {
  const c = 32;
  switch (kind) {
    case 'seed': {
      const ring = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 - Math.PI / 2; return [c + Math.cos(a) * 10, c + Math.sin(a) * 10]; });
      return <>{[[c, c], ...ring].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={10} className="ps-line ps-seq" style={at(i)} />)}<circle cx={c} cy={c} r={2.6} className="ps-dot ps-beat" /></>;
    }
    case 'twelve': {
      const pts = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 - Math.PI / 2; return [c + Math.cos(a) * 23, c + Math.sin(a) * 23]; });
      return <>{pts.map(([x, y], i) => <line key={'l' + i} x1={c} y1={c} x2={x} y2={y} className="ps-faint ps-spoke" style={at(i)} />)}{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 0 ? 3.2 : 2} className={(i === 0 ? 'ps-dot' : 'ps-node') + ' ps-tick'} style={at(i)} />)}<circle cx={c} cy={c} r={3} className="ps-dot ps-beat" /></>;
    }
    case 'rooms':
      return <>{[26, 18, 10].map((h, i) => <rect key={i} x={c - h} y={c - h} width={h * 2} height={h * 2} rx={h * 0.42} className={i === 0 ? 'ps-faint' : 'ps-line'} />)}<circle cx={c} cy={c} r={2.2} className="ps-node ps-msg" /><circle cx={c} cy={c} r={6} className="ps-line ps-ring" /><circle cx={c} cy={c} r={3} className="ps-dot" /></>;
    case 'path': {
      const d = 'M10 50 C 22 50, 20 32, 32 32 S 42 14, 54 14';
      const pts = [[10, 50], [21, 43], [32, 32], [43, 21], [54, 14]];
      return <><path d={d} className="ps-line" fill="none" /><path d={d} className="ps-run" fill="none" pathLength={100} />{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 4 ? 3.4 : 2.2} className={i === 4 ? 'ps-dot' : 'ps-node'} />)}</>;
    }
    case 'stairs':
      return <>{[0, 1, 2, 3].map(i => <rect key={i} x={10 + i * 12} y={46 - (i + 1) * 8} width={9} height={(i + 1) * 8 + 4} rx={3} className={(i === 3 ? 'ps-line' : 'ps-faint') + ' ps-stair'} style={at(i)} />)}<circle cx={50.5} cy={10} r={3} className="ps-dot ps-beat" /><circle cx={14.5} cy={34} r={2.2} className="ps-node ps-climb" /></>;
    case 'unit': {
      const seats = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 - Math.PI / 2; return [c + Math.cos(a) * 20, c + Math.sin(a) * 20]; });
      return <><circle cx={c} cy={c} r={20} className="ps-faint" />{seats.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.2} className="ps-line ps-seat" style={at(i)} />)}<circle cx={c} cy={c} r={3.2} className="ps-dot ps-beat" /></>;
    }
    case 'keystone': {
      const segs = Array.from({ length: 7 }, (_, i) => {
        const a0 = Math.PI + (i / 7) * Math.PI + 0.05, a1 = Math.PI + ((i + 1) / 7) * Math.PI - 0.05;
        const r0 = 14, r1 = 24, p = (r: number, a: number) => (c + Math.cos(a) * r).toFixed(1) + ' ' + (44 + Math.sin(a) * r).toFixed(1);
        return 'M' + p(r0, a0) + ' L' + p(r1, a0) + ' A24 24 0 0 1 ' + p(r1, a1) + ' L' + p(r0, a1) + ' A14 14 0 0 0 ' + p(r0, a0) + 'Z';
      });
      return <>{segs.map((d, i) => <path key={i} d={d} className={i === 3 ? 'ps-key ps-drop' : 'ps-line'} />)}<line x1={8} y1={44} x2={56} y2={44} className="ps-faint" /></>;
    }
    case 'vector':
      return <><line x1={10} y1={48} x2={50} y2={16} className="ps-line" /><path d="M50 16 L40 18 M50 16 L47 26" className="ps-line" fill="none" />{[[10, 48], [23.3, 37.3], [36.7, 26.7]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 2 ? 3.2 : 2.4} className={i === 2 ? 'ps-dot' : 'ps-node'} />)}<circle cx={10} cy={48} r={2.4} className="ps-dot ps-shot" /></>;
    case 'tune': {
      const hex = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return [c + Math.cos(a) * 22, c + Math.sin(a) * 22]; });
      return <><path d={'M' + hex.map(p => p.map(n => n.toFixed(1)).join(' ')).join(' L') + 'Z'} className="ps-line" fill="none" />{[0, 2, 4].map(i => <line key={i} x1={c} y1={c} x2={hex[i][0]} y2={hex[i][1]} className="ps-faint" />)}{[0, 2, 4].map((i, j) => <circle key={'l' + i} cx={hex[i][0]} cy={hex[i][1]} r={2.6} className="ps-node ps-light" style={at(j)} />)}<circle cx={c} cy={c} r={3.4} className="ps-dot" /></>;
    }
    case 'web': {
      /* the families and the threads between them */
      const pts = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 - Math.PI / 2; return [c + Math.cos(a) * 22, c + Math.sin(a) * 22]; });
      return <>{pts.map(([x, y], i) => { const [x2, y2] = pts[(i + 3) % 8]; return <path key={'t' + i} d={'M' + x + ' ' + y + ' Q' + c + ' ' + c + ' ' + x2 + ' ' + y2} className="ps-faint ps-thread" style={at(i)} />; })}{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 0 ? 3.4 : 2.4} className={(i === 0 ? 'ps-dot' : 'ps-node') + ' ps-tick'} style={at(i)} />)}</>;
    }
    case 'deck':
      /* one deck: a card on top of the rest, turned and put back */
      return <>{[2, 1, 0].map(i => <g key={i} transform={'rotate(' + (i * 6 - 4) + ' 32 34)'}><rect x={14 + i * 4} y={16 - i * 4} width={30} height={38} rx={6} className={(i === 0 ? 'ps-line ps-top' : 'ps-faint')} /></g>)}<circle cx={29} cy={33} r={3} className="ps-dot ps-beat" /></>;
    case 'lens': {
      /* a lens whose light converges on one point */
      const rays = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
      return <><circle cx={c} cy={c} r={23} className="ps-line" /><circle cx={c} cy={c} r={14} className="ps-faint" />{rays.map((a, i) => <line key={i} x1={c + Math.cos(a) * 23} y1={c + Math.sin(a) * 23} x2={c + Math.cos(a) * 5} y2={c + Math.sin(a) * 5} className="ps-faint ps-ray" pathLength={100} style={at(i)} />)}<circle cx={c} cy={c} r={3.2} className="ps-dot ps-beat" /></>;
    }
  }
}

export function PageSigil({ kind }: { kind: SigilKind }) {
  const [a, b] = HUES[kind];
  const id = 'ps-' + kind;
  return (
    <svg className={'page-sigil k-' + kind} viewBox="0 0 64 64" aria-hidden style={{ ['--pa' as string]: a, ['--pb' as string]: b }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        <radialGradient id={id + '-g'}><stop offset="0" stopColor={b} stopOpacity="0.35" /><stop offset="1" stopColor={b} stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx={32} cy={32} r={31} fill={'url(#' + id + '-g)'} className="ps-glow" />
      <g stroke={'url(#' + id + ')'} fill="none">{figure(kind)}</g>
    </svg>
  );
}
