/* The system map: the organisation as nodes and dependencies, drawn on a
   tilted plane. Each node stands up from the plane facing the viewer and
   rises with the weight of the threats aimed at it. During a run, threats
   resolve on their nodes; a node that falls glows, and the failure travels
   along every dependency the stack does not cut. A cut edge shows a bar in
   the colour of the structure that cut it.

   The plane tilts further with each band, so the map gains depth as the
   gauge gets harder. */

import React, { useMemo, useRef } from 'react';
import type { GaugeSystem, GaugeThreat, NodeKind } from '../content/modux-schema';
import { NODE_KIND_LABEL } from '../content/modux-schema';
import type { Cut } from '../content/modux/score';

export const KIND_HUE: Record<NodeKind, string> = {
  people: '#f0abfc', identity: '#60a5fa', network: '#22d3ee', data: '#a78bff', build: '#7dd3fc',
  money: '#e8c46b', control: '#5eead4', model: '#c4b5fd', public: '#fda4af', time: '#fcd9a5', vendor: '#93c5fd',
};

export type ThreatState = 'pending' | 'stopped' | 'landed' | 'idle';

interface Props {
  system: GaugeSystem;
  threats: GaugeThreat[];
  state: Record<string, ThreatState>;
  fallen?: string[];
  reached?: string[];
  cuts?: Cut[];
  /** 0 Ground … 4 Outlier */
  band: number;
  /** node hit by the newest notch */
  fresh?: string | null;
  cutName?: (id: string) => string;
}

export const W = 1000;

/** Layered layout shared with the 3D world: columns by dependency depth,
    each column ordered to cut crossings. Coordinates are in a W by H box. */
export function layoutSystem(system: GaugeSystem) {
  const depth = new Map(system.nodes.map(n => [n.id, 0]));
  for (let i = 0; i < system.nodes.length; i++) {
    for (const e of system.edges) {
      const d = (depth.get(e.from) ?? 0) + 1;
      if (d > (depth.get(e.to) ?? 0) && d < system.nodes.length) depth.set(e.to, d);
    }
  }
  const maxD = Math.max(0, ...depth.values());
  const cols: string[][] = Array.from({ length: maxD + 1 }, () => []);
  for (const n of system.nodes) cols[depth.get(n.id) ?? 0].push(n.id);

  /* order each column by the mean position of its neighbours, sweeping
     forward then back a few times: the usual way to cut crossings */
  const frac = (id: string) => {
    const c = cols[depth.get(id) ?? 0];
    return c.length < 2 ? 0.5 : c.indexOf(id) / (c.length - 1);
  };
  const order = (col: string[], near: (id: string) => string[]) => {
    const key = new Map(col.map((id, i) => {
      const ns = near(id);
      return [id, ns.length ? ns.reduce((k, x) => k + frac(x), 0) / ns.length : i / Math.max(1, col.length - 1)];
    }));
    col.sort((a, b) => key.get(a)! - key.get(b)!);
  };
  const preds = (id: string) => system.edges.filter(e => e.to === id).map(e => e.from);
  const succs = (id: string) => system.edges.filter(e => e.from === id).map(e => e.to);
  for (let sweep = 0; sweep < 4; sweep++) {
    for (let d = 1; d <= maxD; d++) order(cols[d], preds);
    for (let d = maxD - 1; d >= 0; d--) order(cols[d], succs);
  }
  const tallest = Math.max(...cols.map(c => c.length));
  const H = Math.max(420, tallest * 150 + 60);
  const pos = new Map<string, { x: number; y: number }>();
  cols.forEach((col, d) => {
    const x = maxD === 0 ? W / 2 : 110 + (d * (W - 220)) / maxD;
    col.forEach((id, i) => {
      /* stagger alternate columns so long edges do not pass through nodes */
      const off = d % 2 ? 0.18 : 0;
      pos.set(id, { x, y: ((i + 1 + off) * H) / (col.length + 1) });
    });
  });
  return { pos, H };
}

export function SystemMap({ system, threats, state, fallen = [], reached = [], cuts = [], band, fresh, cutName }: Props) {
  const { pos, H } = useMemo(() => layoutSystem(system), [system]);
  const stage = useRef<HTMLDivElement | null>(null);
  const plane = useRef<HTMLDivElement | null>(null);
  const tilt = [8, 10, 16, 22, 28][Math.max(0, Math.min(4, band))];
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fallenSet = new Set(fallen);
  const reachedSet = new Set(reached);
  const hot = new Set<string>();
  for (const e of system.edges) {
    if ((fallenSet.has(e.from) || reachedSet.has(e.from)) && reachedSet.has(e.to)) hot.add(e.from + '>' + e.to);
  }
  const cutAt = new Map(cuts.map(c => [c.from + '>' + c.to, c.by]));

  const onMove = (e: React.PointerEvent) => {
    if (still || !plane.current || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    plane.current.style.transform = 'rotateX(' + (tilt - dy * 4) + 'deg) rotateY(' + dx * 6 + 'deg)';
  };
  const onLeave = () => { if (plane.current) plane.current.style.transform = 'rotateX(' + tilt + 'deg)'; };

  return (
    <div className="gx-stage" ref={stage} onPointerMove={onMove} onPointerLeave={onLeave}
      role="img" aria-label={'System map: ' + system.nodes.length + ' parts, ' + system.edges.length + ' dependencies' +
        (fallen.length ? ', ' + fallen.length + ' fallen' : '') + (reached.length ? ', ' + reached.length + ' reached by a cascade' : '')}>
      <div className="gx-plane" ref={plane} style={{ transform: 'rotateX(' + tilt + 'deg)', aspectRatio: W + ' / ' + H }}>
        <svg className="gx-edges" viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" aria-hidden>
          <defs>
            <marker id="gx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 10 5 0 10z" fill="rgba(216,226,255,0.55)" />
            </marker>
          </defs>
          {/* the plane's own grid: one steady lattice */}
          {Array.from({ length: 11 }, (_, i) => (
            <line key={'g' + i} x1={(i * W) / 10} y1={0} x2={(i * W) / 10} y2={H} className="gx-grid" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={'h' + i} x1={0} y1={(i * H) / 6} x2={W} y2={(i * H) / 6} className="gx-grid" />
          ))}
          {system.edges.map((e, i) => {
            const a = pos.get(e.from), b = pos.get(e.to);
            if (!a || !b) return null;
            const dx = b.x - a.x, dy = b.y - a.y;
            const len = Math.hypot(dx, dy) || 1;
            const ux = dx / len, uy = dy / len;
            const x1 = a.x + ux * 34, y1 = a.y + uy * 34, x2 = b.x - ux * 40, y2 = b.y - uy * 40;
            const mx = (x1 + x2) / 2 - uy * 26, my = (y1 + y2) / 2 + ux * 26;
            const key = e.from + '>' + e.to;
            const cutBy = cutAt.get(key);
            const isHot = hot.has(key);
            return (
              <g key={i}>
                <path d={'M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2}
                  className={'gx-edge' + (isHot ? ' hot' : '') + (cutBy ? ' cut' : '')} markerEnd="url(#gx-arrow)" />
                {cutBy && (
                  <g transform={'translate(' + ((x1 + x2) / 2 - uy * 13) + ' ' + ((y1 + y2) / 2 + ux * 13) + ') rotate(' + (Math.atan2(dy, dx) * 180) / Math.PI + ')'}>
                    <rect x={-3} y={-16} width={6} height={32} rx={3} className="gx-cutbar" />
                    {cutName && <title>{'Cut by ' + cutName(cutBy)}</title>}
                  </g>
                )}
              </g>
            );
          })}
          {system.nodes.map(n => {
            const p = pos.get(n.id)!;
            return <ellipse key={'s' + n.id} cx={p.x} cy={p.y + 6} rx={36} ry={14} className="gx-shadow" />;
          })}
        </svg>

        {system.nodes.map(n => {
          const p = pos.get(n.id)!;
          const on = threats.filter(t => t.target === n.id);
          const weight = on.reduce((k, t) => k + t.weight, 0);
          const lift = 10 + Math.min(9, weight) * 7;
          const cls = 'gx-node' + (fallenSet.has(n.id) ? ' fallen' : reachedSet.has(n.id) ? ' reached' : '') +
            (fresh === n.id ? ' fresh' : '');
          return (
            <div key={n.id} className={cls}
              style={{
                left: (p.x / W) * 100 + '%', top: (p.y / H) * 100 + '%',
                ['--kind' as string]: KIND_HUE[n.kind],
                transform: 'translate(-50%, -100%) translateZ(' + lift + 'px) rotateX(' + -tilt + 'deg)',
              }}>
              <span className="gx-node-pins">
                {on.map(t => (
                  <i key={t.id} className={'gx-pin ' + (state[t.id] || 'idle') + (t.open ? ' open' : '') + (t.weight === 3 ? ' heavy' : '')}
                    title={t.name} />
                ))}
              </span>
              <span className="gx-node-orb" />
              <span className="gx-node-name">{n.name}</span>
              <span className="gx-node-kind">{NODE_KIND_LABEL[n.kind]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
