/* THE LEVERAGE WEB — the unit drawn as what it actually is.

   Every member declares how they multiply specific others. Those declarations
   form a graph, and the graph is the argument: a security organisation is not a
   list of roles, it is a set of relationships in which each seat makes the
   others more capable. Seats you have earned are lit; seats you have not are
   present but dim, so the shape of what is still missing is visible.

   Deliberately not a force simulation. Members are placed on rings by the phase
   they arrive in, so the picture also reads as a timeline: the centre is where
   you began, the outer ring is UNITIUM ONE. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UNIT, ESSENCE_HEX } from '../content/registry';

const FULL = 760;
const RING: Record<number, number> = { 1: 96, 2: 178, 3: 262, 4: 336 };

export function UnitWeb({ unlocked }: { unlocked: Set<string> }) {
  const [focus, setFocus] = useState<string | null>(null);

  /* The web is drawn in the pixels of its own box. On a phone the rings close up and each seat keeps its size, so
     a seat is a finger wide and its letters stay readable; a fixed drawing shrunk to fit left them near 5px. */
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(FULL);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const set = () => setSize(Math.round(Math.min(FULL, Math.max(280, el.clientWidth))));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const k = size / FULL, C = size / 2;
  /* the names under the seats need the room of the full drawing; below it the readout under the web carries them */
  const named = k >= 0.75;

  const nodes = useMemo(() => {
    const byPhase: Record<number, typeof UNIT> = { 1: [], 2: [], 3: [], 4: [] };
    for (const m of UNIT) (byPhase[m.phase] || byPhase[4]).push(m);
    const out: { id: string; x: number; y: number; m: (typeof UNIT)[number] }[] = [];
    for (const ph of [1, 2, 3, 4]) {
      const ring = byPhase[ph] || [];
      const r = RING[ph] * k;
      ring.forEach((m, i) => {
        /* offset each ring so nodes do not stack radially on the ring below */
        const a = (i / Math.max(1, ring.length)) * Math.PI * 2 - Math.PI / 2 + ph * 0.42;
        out.push({ id: m.id, x: C + Math.cos(a) * r, y: C + Math.sin(a) * r, m });
      });
    }
    return out;
  }, [k, C]);

  const pos = useMemo(() => {
    const p: Record<string, { x: number; y: number }> = {};
    for (const n of nodes) p[n.id] = { x: n.x, y: n.y };
    return p;
  }, [nodes]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const out: { a: string; b: string; how: string }[] = [];
    for (const m of UNIT)
      for (const lv of m.leverages) {
        if (!pos[lv.member] || !pos[m.id]) continue;
        const key = [m.id, lv.member].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a: m.id, b: lv.member, how: lv.how });
      }
    return out;
  }, [pos]);

  const focused = focus ? UNIT.find(m => m.id === focus) : null;
  const focusEdges = focus ? edges.filter(e => e.a === focus || e.b === focus) : [];

  return (
    <div ref={boxRef}>
      <svg className="constel unitweb" viewBox={`0 0 ${size} ${size}`} role="img"
        aria-label="The leverage web: how each seat in your unit multiplies the others">
        {/* rings as quiet structure, so the phases read without labels shouting */}
        {[1, 2, 3, 4].map(ph => (
          <circle key={ph} cx={C} cy={C} r={RING[ph] * k} fill="none"
            stroke="var(--frame)" strokeWidth={1} strokeDasharray="2 8" opacity={0.6} />
        ))}

        {edges.map((e, i) => {
          const a = pos[e.a], b = pos[e.b];
          const both = unlocked.has(e.a) && unlocked.has(e.b);
          const lit = focus ? (e.a === focus || e.b === focus) : both;
          /* bow each edge slightly away from centre so reciprocal pairs are legible */
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const dx = mx - C, dy = my - C;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const cx = mx + (dx / d) * 26 * k, cy = my + (dy / d) * 26 * k;
          return (
            <path
              key={i}
              className={'edge' + (lit ? ' live' : '')}
              d={`M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
              opacity={focus ? (lit ? 0.95 : 0.1) : both ? 0.75 : 0.22}
            />
          );
        })}

        {nodes.map(n => {
          const here = unlocked.has(n.id);
          const hue = ESSENCE_HEX[n.m.essence];
          const isFocus = focus === n.id;
          const dim = focus && !isFocus && !focusEdges.some(e => e.a === n.id || e.b === n.id);
          return (
            <g
              key={n.id}
              className={'node' + (here ? ' done' : ' locked')}
              opacity={dim ? 0.25 : 1}
              onMouseEnter={() => setFocus(n.id)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(n.id)}
              onBlur={() => setFocus(null)}
              onClick={() => setFocus(n.id)}
              tabIndex={0}
              role="button"
              aria-label={n.m.callsign + ' — ' + n.m.role + (here ? '' : ' (seat not yet filled)')}
            >
              {/* a finger-wide place to press, around a seat that is drawn smaller */}
              <circle cx={n.x} cy={n.y} r={22} fill="transparent" stroke="none" />
              <circle className="core" cx={n.x} cy={n.y} r={isFocus ? 21 : 16}
                fill="var(--panel-2)" stroke={here ? hue : 'var(--frame-strong)'}
                strokeWidth={here ? 2.4 : 1.4}
                style={{ color: here ? hue : 'transparent' }} />
              <text x={n.x} y={n.y + 4} textAnchor="middle"
                style={{ fill: here ? 'var(--ink)' : 'var(--ink-label)', fontSize: 12 }}>
                {here ? n.m.callsign.slice(0, 3) : '···'}
              </text>
              {named && (
                <text x={n.x} y={n.y + 34} textAnchor="middle" style={{ fontSize: 12 }}>
                  {here ? n.m.callsign : ''}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* the relationship, in words, for whoever the reader is pointing at */}
      <div className="panel panel-2 webread" aria-live="polite">
        {focused ? (
          <>
            <div className="row" style={{ gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <strong>{unlocked.has(focused.id) ? focused.callsign : 'SEAT UNFILLED'}</strong>
              <span className="sec">— {focused.role}</span>
            </div>
            {unlocked.has(focused.id) ? (
              <>
                <p className="sec" style={{ margin: '0 0 10px' }}>“{focused.doctrine}”</p>
                <div className="stack-sm">
                  {focused.leverages.slice(0, 3).map((lv, i) => {
                    const other = UNIT.find(u => u.id === lv.member);
                    return (
                      <div key={i} className="blk-callout" style={{ margin: 0 }}>
                        <strong>× {other ? other.callsign : lv.member}</strong>
                        <p className="sec" style={{ margin: '6px 0 0' }}>{lv.how}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="sec" style={{ margin: 0 }}>{focused.unlockedBy}</p>
            )}
          </>
        ) : (
          <p className="sec" style={{ margin: 0 }}>
            Point at a seat to see what it is and who it multiplies. Bright lines are relationships
            you have actually earned — both seats filled. Dim ones are leverage still waiting for you.
          </p>
        )}
      </div>
    </div>
  );
}
