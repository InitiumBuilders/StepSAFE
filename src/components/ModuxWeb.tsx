/* The Modux web: the catalog drawn as the graph it is.

   Twelve families sit on a ring. Each model is a node on its family's arc.
   A line joins two models when one names the other in its combines list.
   Pointing at a node lights its lines; choosing a family keeps only the
   lines that touch it. Nothing flies. Nodes stay where they are.

   The web is drawn in the pixels of its own box. Shrunk to a phone, a fixed drawing left the families' names near
   6px and a node under 3px. On a narrow box the ring takes the whole width, the families are named in a legend
   under it, a touch lights the node nearest the finger, and a button opens it. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MODUX_MODELS, MODUX_CATALOG, ESSENCE_HEX } from '../content/registry';
import { FAMILY_LABEL, FAMILY_HUE, type ModuxFamily } from '../content/modux-schema';
import { useS } from '../lib/state';

const FULL = 820;
const FAMILIES = Object.keys(FAMILY_LABEL) as ModuxFamily[];

export function ModuxWeb({ family }: { family: ModuxFamily | 'all' }) {
  const { d } = useS();
  const [focus, setFocus] = useState<string | null>(null);
  /* the node was chosen by a finger: it stays lit, and a button opens it */
  const [byTouch, setByTouch] = useState(false);
  const touch = useRef(false);
  const authored = useMemo(() => new Set(MODUX_MODELS.map(m => m.id)), []);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(FULL);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const set = () => setSize(Math.round(Math.min(FULL, Math.max(260, el.clientWidth))));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const k = size / FULL, C = size / 2;
  /* the families' names fit around the ring only near the full drawing; below it a legend carries them */
  const named = k >= 0.75;
  const R_NODE = named ? 318 * k : C - 12;
  const R_LABEL = 372 * k;
  const dot = named ? 7 : Math.max(3.4, 7 * k + 1);

  const nodes = useMemo(() => {
    const out: { id: string; name: string; family: ModuxFamily; x: number; y: number; a: number }[] = [];
    const span = (Math.PI * 2) / FAMILIES.length;
    FAMILIES.forEach((f, fi) => {
      const members = MODUX_CATALOG.filter(m => m.family === f);
      const start = fi * span - Math.PI / 2 + span * 0.12;
      const step = (span * 0.76) / Math.max(1, members.length - 1);
      members.forEach((m, i) => {
        const a = start + step * i;
        out.push({ id: m.id, name: m.name, family: f, a, x: C + Math.cos(a) * R_NODE, y: C + Math.sin(a) * R_NODE });
      });
    });
    return out;
  }, [C, R_NODE]);

  const pos = useMemo(() => {
    const p: Record<string, { x: number; y: number }> = {};
    for (const n of nodes) p[n.id] = n;
    return p;
  }, [nodes]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const out: { a: string; b: string }[] = [];
    for (const m of MODUX_MODELS)
      for (const c of m.combines) {
        if (!pos[c.model]) continue;
        const key = [m.id, c.model].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a: m.id, b: c.model });
      }
    return out;
  }, [pos]);

  const familyOf = (id: string) => nodes.find(n => n.id === id)?.family;
  const inFamily = (id: string) => family === 'all' || familyOf(id) === family;
  const open = (id: string) => d({ t: 'route', view: 'modux-model', id });
  const focused = focus ? nodes.find(n => n.id === focus) : undefined;

  /* a finger cannot land on a node a few pixels wide: the node nearest the touch, within a finger of it, is lit */
  function touched(e: React.PointerEvent<SVGSVGElement>) {
    touch.current = e.pointerType !== 'mouse';
    if (!touch.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) * (size / box.width), y = (e.clientY - box.top) * (size / box.height);
    let best: string | null = null, reach = 44 * 44;
    for (const n of nodes) {
      if (!inFamily(n.id)) continue;
      const far = (n.x - x) ** 2 + (n.y - y) ** 2;
      if (far < reach) { reach = far; best = n.id; }
    }
    setFocus(best);
    setByTouch(!!best);
  }

  return (
    <div className="mx-web-wrap" ref={boxRef}>
      <svg className="mx-web" viewBox={`0 0 ${size} ${size}`} role="img" onPointerDown={touched}
        aria-label="The Modux web: which security structures compound with which">
        <circle cx={C} cy={C} r={R_NODE} fill="none" stroke="rgba(216,226,255,0.08)" strokeWidth={1} />

        {named && FAMILIES.map((f, fi) => {
          const span = (Math.PI * 2) / FAMILIES.length;
          const a = fi * span - Math.PI / 2 + span * 0.5;
          const x = C + Math.cos(a) * R_LABEL, y = C + Math.sin(a) * R_LABEL;
          const dim = family !== 'all' && family !== f;
          return (
            <text key={f} x={x} y={y} textAnchor="middle" className="mx-web-family"
              opacity={dim ? 0.35 : 1} style={{ fill: ESSENCE_HEX[FAMILY_HUE[f]] }}>
              {FAMILY_LABEL[f]}
            </text>
          );
        })}

        {edges.map((e, i) => {
          const a = pos[e.a], b = pos[e.b];
          const touchesFocus = focus && (e.a === focus || e.b === focus);
          const visible = inFamily(e.a) || inFamily(e.b);
          if (!visible) return null;
          const hue = ESSENCE_HEX[FAMILY_HUE[familyOf(e.a) || 'systems']];
          /* bow through the centre so same-family edges do not lie on the ring */
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          const cx = C + (mx - C) * 0.35, cy = C + (my - C) * 0.35;
          return (
            <path key={i}
              d={`M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
              fill="none"
              stroke={touchesFocus ? hue : 'rgba(216,226,255,0.22)'}
              strokeWidth={touchesFocus ? 2.2 : 1}
              opacity={focus ? (touchesFocus ? 0.95 : 0.08) : 0.55}
              style={{ transition: 'opacity 220ms, stroke 220ms' }}
            />
          );
        })}

        {nodes.map(n => {
          const hue = ESSENCE_HEX[FAMILY_HUE[n.family]];
          const has = authored.has(n.id);
          const isFocus = focus === n.id;
          const linked = focus && edges.some(e => (e.a === focus && e.b === n.id) || (e.b === focus && e.a === n.id));
          const dimmed = (focus && !isFocus && !linked) || !inFamily(n.id);
          return (
            <g key={n.id} className="mx-web-node" tabIndex={0} role="button"
              aria-label={n.name + (has ? '' : ', not yet authored')}
              opacity={dimmed ? 0.22 : 1}
              onMouseEnter={() => { if (!touch.current) setFocus(n.id); }} onMouseLeave={() => { if (!touch.current) setFocus(null); }}
              onFocus={() => setFocus(n.id)} onBlur={() => { if (!touch.current) setFocus(null); }}
              onClick={() => { if (!touch.current && has) open(n.id); }}
              onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && has) { e.preventDefault(); open(n.id); } }}
              style={{ cursor: has ? 'pointer' : 'default', transition: 'opacity 220ms' }}>
              <circle cx={n.x} cy={n.y} r={isFocus ? dot * 1.6 : dot}
                fill={has ? hue : 'rgba(216,226,255,0.18)'}
                style={{ filter: isFocus ? `drop-shadow(0 0 14px ${hue})` : has ? `drop-shadow(0 0 5px ${hue})` : 'none', transition: 'r 200ms' }} />
            </g>
          );
        })}

        {named && focused && (
          <text x={focused.x} y={focused.y + (focused.y > C ? 30 : -20)} textAnchor="middle" className="mx-web-name">
            {focused.name}
          </text>
        )}
      </svg>
      <p className="mx-web-read" aria-live="polite">
        {focused
          ? (() => {
              const m = MODUX_MODELS.find(x => x.id === focused.id);
              /* a statement opens with its model's name; where the ring carries no name and the line does not, it is said */
              const line = m ? m.statement : 'This model is still being written.';
              return <>{!named && !line.startsWith(focused.name) && <strong>{focused.name}. </strong>}{line}</>;
            })()
          : edges.length + ' connections between ' + MODUX_MODELS.length + ' models. ' + (named ? 'Point at a node to see what it compounds with.' : 'Touch the ring to see what a model compounds with.')}
      </p>
      {focused && byTouch && authored.has(focused.id) && (
        <p className="mx-web-go"><button type="button" className="btn btn-sm" onClick={() => open(focused.id)}>Open {focused.name}</button></p>
      )}
      {!named && (
        <ul className="mx-web-legend" aria-label="The twelve families, by colour">
          {FAMILIES.map(f => (
            <li key={f} style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[f]], opacity: family !== 'all' && family !== f ? 0.4 : 1 }}>
              <i aria-hidden />{FAMILY_LABEL[f]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
