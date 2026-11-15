/* The welcome page's figures. Each draws one idea the section beside it states, and moves only to
   show that idea: the twelve Chapters lighting in order with a light that climbs them, a web whose
   threads are the catalog's real connections, a lens whose light closes on one point, and the six frames
   of One System. All of it is SVG moved by CSS, running only while the figure is on screen (the
   section's `live` class), with a still frame under reduced motion. */

import React from 'react';
import { PITCH } from '../../content/pitch';

const TAU = Math.PI * 2;
const pt = (cx: number, cy: number, r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;

/** the path: twelve chapters on a rising arc, lighting in order */
export function PathFig() {
  const n = PITCH.chapters.count;
  const pts = Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return [24 + t * 312, 190 - Math.sin(t * Math.PI * 0.62) * 150 - t * 10] as const; });
  return (
    <svg className="lx-fig lx-path" viewBox="0 0 360 220" aria-hidden>
      <path d={'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L')} className="lx-arc" />
      <path d={'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L')} className="lx-arc-sig" pathLength={100} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === n - 1 ? 8 : 5.5} className="lx-step" style={{ ['--i' as string]: String(i) }} />)}
      <text x={pts[0][0]} y={pts[0][1] + 24} textAnchor="middle" className="lx-tl">01</text>
      <text x={pts[n - 1][0]} y={pts[n - 1][1] - 16} textAnchor="middle" className="lx-tl strong">{String(n).padStart(2, '0')}</text>
    </svg>
  );
}

/** the web of the twelve families: each thread is the catalog's real count of connections between two families */
export function WebFig() {
  const fams: string[] = PITCH.modux.families.map(f => f.id);
  const c = 150, R = 118;
  const at = (id: string) => pt(c, c, R, (fams.indexOf(id) / fams.length) * TAU - TAU / 4);
  const max = Math.max(...PITCH.famLinks.map(l => l.n));
  return (
    <svg className="lx-fig lx-web" viewBox="0 0 300 300" aria-hidden>
      <circle cx={c} cy={c} r={R} className="lx-webring" />
      {PITCH.famLinks.map((l, i) => {
        const [x1, y1] = at(l.a), [x2, y2] = at(l.b);
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, qx = mx + (c - mx) * 0.55, qy = my + (c - my) * 0.55;
        return <path key={i} d={'M' + x1 + ' ' + y1 + ' Q' + qx + ' ' + qy + ' ' + x2 + ' ' + y2} className="lx-chord" style={{ strokeWidth: 0.6 + (l.n / max) * 2.6, ['--o' as string]: String(0.18 + (l.n / max) * 0.6), ['--i' as string]: String(i) }} />;
      })}
      {fams.map((f, i) => { const [x, y] = at(f); return <circle key={f} cx={x} cy={y} r={7} className={'lx-fam h' + (i % 6)} style={{ ['--i' as string]: String(i) }} />; })}
    </svg>
  );
}

/** Claros: a lens whose light converges on the one point it is looking for */
export function LensFig() {
  const rays = Array.from({ length: 12 }, (_, i) => (i / 12) * TAU);
  return (
    <svg className="lx-fig lx-lens" viewBox="0 0 240 240" aria-hidden>
      <defs><radialGradient id="lx-lglow"><stop offset="0" stopColor="#f8f1fb" /><stop offset="0.4" stopColor="#d8b4fe" /><stop offset="1" stopColor="#a78bff" stopOpacity="0" /></radialGradient><linearGradient id="lx-lens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8effc" /><stop offset="0.55" stopColor="#9cc3ef" /><stop offset="1" stopColor="#a78bff" /></linearGradient></defs>
      <circle cx={120} cy={120} r={96} className="lx-lring" stroke="url(#lx-lens)" />
      <circle cx={120} cy={120} r={64} className="lx-lring inner" stroke="url(#lx-lens)" />
      {rays.map((a, i) => { const [x1, y1] = pt(120, 120, 96, a), [x2, y2] = pt(120, 120, 14, a); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="lx-ray" style={{ ['--i' as string]: String(i) }} />; })}
      <circle cx={120} cy={120} r={34} fill="url(#lx-lglow)" className="lx-core-glow" />
      <circle cx={120} cy={120} r={8} className="lx-focus" />
    </svg>
  );
}

/* One System: the sixteen bodies of work in six frames (the Outlier.Systems corpus, version 2, 2026-10-08) */
export const ONE_SYSTEM: { frame: string; bodies: string[] }[] = [
  { frame: 'Sense', bodies: ['SystemsBench', 'Trust The Practice', 'SoundMind.Team'] },
  { frame: 'Build', bodies: ['Outlier.Systems', 'DuoDash', 'Gratus', 'InitiumBuilders'] },
  { frame: 'Gather', bodies: ['Semble.CC', 'Motus.Events', 'DashSupport.Team'] },
  { frame: 'Fund', bodies: ['Waves.Fund', 'Dash.org'] },
  { frame: 'Hold', bodies: ['$GREED', 'Intuition.Systems'] },
  { frame: 'Guard', bodies: ['Unitium.One', 'Unitium Safe'] },
];

export function OneSystemFig() {
  const c = 160, R = 104;
  return (
    <svg className="lx-fig lx-one" viewBox="0 0 320 320" aria-hidden>
      <defs><radialGradient id="lx-oglow"><stop offset="0" stopColor="#f8f1fb" /><stop offset="0.4" stopColor="#d8b4fe" /><stop offset="1" stopColor="#a78bff" stopOpacity="0" /></radialGradient></defs>
      <circle cx={c} cy={c} r={R} className="lx-webring" />
      {ONE_SYSTEM.map((f, i) => {
        const a = (i / 6) * TAU - TAU / 4;
        const [x, y] = pt(c, c, R, a);
        const [lx, ly] = pt(c, c, R + 26, a);
        return (
          <g key={f.frame} style={{ ['--i' as string]: String(i) }} className="lx-frame">
            <line x1={c} y1={c} x2={x} y2={y} className="lx-spoke" />
            {f.bodies.map((b, j) => {
              const [bx, by] = pt(c, c, R - 26, a + (j - (f.bodies.length - 1) / 2) * 0.17);
              return <circle key={b} cx={bx} cy={by} r={b === 'Unitium Safe' ? 6 : 4} className={'lx-body' + (b === 'Unitium Safe' ? ' here' : '')}><title>{b}</title></circle>;
            })}
            <circle cx={x} cy={y} r={8} className="lx-framenode" />
            <text x={lx} y={ly + 4} textAnchor="middle" className="lx-tl strong">{f.frame}</text>
          </g>
        );
      })}
      <circle cx={c} cy={c} r={30} fill="url(#lx-oglow)" className="lx-core-glow" />
      <circle cx={c} cy={c} r={6} className="lx-dcore" />
    </svg>
  );
}
