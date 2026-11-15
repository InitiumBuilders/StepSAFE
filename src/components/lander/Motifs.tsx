/* Two symbols for the welcome page, drawn in SVG and moved by CSS (styles/lander.css, lm-*). They run only
   while their section is on screen and hold one still frame under reduced motion.

   RoomsMotif: The Practice. Rooms inside rooms with you at the centre. Messages keep arriving from every
   side, each in its own colour, and each one that reaches you sends out a ring: a choice made.

   SealMotif: your record. Two halves close around one light and hold, and while they hold, rings gather
   around them one after another, each brighter than the last: trust built over time. */

import React from 'react';

const MSGS = [
  { sx: -150, sy: -70, c: 'pink', d: 0 },
  { sx: 150, sy: -40, c: 'amber', d: 1.6 },
  { sx: 40, sy: 150, c: 'azure', d: 3.2 },
  { sx: -120, sy: 110, c: 'violet', d: 4.8 },
];

export function RoomsMotif() {
  const c = 130;
  return (
    <svg className="lx-motif lm-rooms" viewBox="0 0 260 260" aria-hidden>
      {[108, 74, 40].map((h, i) => <rect key={h} x={c - h} y={c - h} width={h * 2} height={h * 2} rx={h * 0.36} className={'lm-room r' + i} />)}
      {MSGS.map((m, i) => (
        <g key={i} className={'lm-msg ' + m.c} style={{ ['--sx' as string]: m.sx + 'px', ['--sy' as string]: m.sy + 'px', ['--d' as string]: m.d + 's' }}>
          <line x1={c} y1={c} x2={c + m.sx * 0.12} y2={c + m.sy * 0.12} className="lm-tail" />
          <circle cx={c} cy={c} r={4.5} className="lm-dot" />
        </g>
      ))}
      {MSGS.map((m, i) => <circle key={'r' + i} cx={c} cy={c} r={14} className={'lm-choice ' + m.c} style={{ ['--d' as string]: m.d + 's' }} />)}
      <circle cx={c} cy={c} r={8} className="lm-you" />
    </svg>
  );
}

export function SealMotif() {
  const c = 120, r = 70;
  const arc = (side: 1 | -1) => 'M' + c + ' ' + (c - r) + ' A' + r + ' ' + r + ' 0 0 ' + (side > 0 ? 1 : 0) + ' ' + c + ' ' + (c + r);
  return (
    <svg className="lx-motif lm-seal" viewBox="0 0 240 240" aria-hidden>
      <defs>
        <radialGradient id="lm-seal-core"><stop offset="0" stopColor="#f8f1fb" /><stop offset="0.45" stopColor="#fdc26f" /><stop offset="1" stopColor="#fdc26f" stopOpacity="0" /></radialGradient>
      </defs>
      {[86, 98, 110].map((rr, i) => <circle key={rr} cx={c} cy={c} r={rr} className="lm-grow" style={{ ['--g' as string]: String(i), ['--a' as string]: String(0.3 + i * 0.2) }} />)}
      <path d={arc(-1)} className="lm-half left" />
      <path d={arc(1)} className="lm-half right" />
      <circle cx={c} cy={c} r={r} className="lm-sealed" />
      <circle cx={c} cy={c} r={30} fill="url(#lm-seal-core)" className="lm-seal-glow" />
      <circle cx={c} cy={c} r={7} className="lm-seal-core" />
    </svg>
  );
}
