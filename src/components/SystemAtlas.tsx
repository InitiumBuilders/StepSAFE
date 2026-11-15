/* THE SYSTEM ATLAS: a system read the way a defender reads it.

   The parts sit in rows from the ones that depend on nothing at the top to the
   people at the bottom, where the service lands. Service moves down every link
   as a travelling signal at that link's own beat: quick on a live dependency,
   slow through a supply that holds for hours, soft into the people. A link that
   closes a feedback loop arcs back up the side. A part's size is how much fails
   with it. The keystone carries the one amber light on the page.

   On a system's own map the atlas shows only defense. Its hardening points are
   where each move in the hardening plan enters the system, numbered in the order
   to act; the plan comes from the model one day at a time (lib/hardening). Inside
   a gauge, where the learner is choosing the moves, the plan stays hidden and the
   pressures stay on their parts, because they are the exercise.

   Frames answer the questions a defender asks; layers can be laid on or taken
   off; the states run the day through the gauges' own model, one definition
   shared with the World, and play hour by hour with a soft beat when sound is on.
   Davara's reading sits under the map, every line computed. Motion runs only on
   screen, and calm motion gets one still frame. */

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { GaugeSystem, GaugeThreat, ModuxGauge, ModuxModel, NodeKind } from '../content/modux-schema';
import { NODE_KIND_LABEL } from '../content/modux-schema';
import type { Cut } from '../content/modux/score';
import { buildModel, type Sample } from '../content/modux/dynamics';
import { KIND_HUE, type ThreatState } from './SystemMap';
import { readSystem, RUNGS, rungOf } from '../lib/systemRead';
import { STATES, BEAT, buildState, runState, type StateId } from '../lib/systemStates';
import { hardeningWeek, planMarkdown, VERBS, type PlanFor, type Verb, type Week } from '../lib/hardening';
import { Sound } from '../lib/sound';
import { localDay } from '../lib/day';

export interface Guard { move: string; parts: string[] }

interface Props {
  system: GaugeSystem;
  threats: GaugeThreat[];
  /** the gauge the map belongs to: its model gives the hours, the states and the plan */
  gauge?: ModuxGauge | null;
  byId?: Map<string, ModuxModel>;
  /** during a run */
  state?: Record<string, ThreatState>;
  fallen?: string[];
  reached?: string[];
  cuts?: Cut[];
  fresh?: string | null;
  cutName?: (id: string) => string;
  /** a known system's own moves and the parts they guard */
  guards?: Guard[];
  org?: string;
  /** Davara's reading under the map */
  reading?: boolean;
  /** play the stress day once when the map first comes into view */
  autoplay?: boolean;
  /** show the hardening plan; off inside a gauge, where it would give the answer away */
  rateMoves?: boolean;
  /** the defense in place: the reference stack on a known system, or a learner's stack */
  stack?: string[];
  stackLabel?: string;
  /** the frames, layers and states; off where the map is a small preview */
  controls?: boolean;
  /** what the downloadable hardening plan carries beyond the map */
  plan?: { name: string; url?: string; own?: { move: string; why: string }[]; sources?: { label: string; url: string }[] };
  label?: string;
}

type LayerId = 'flow' | 'harden' | 'reach' | 'loops' | 'defense';
type FrameId = 'whole' | 'harden' | 'cascade' | 'people';
type Layers = Record<LayerId, boolean>;
type RunId = StateId | 'week';

const LAYERS: { id: LayerId; label: string; what: string }[] = [
  { id: 'flow', label: 'Flow', what: 'Service moving down every link at its own pace' },
  { id: 'harden', label: 'Hardening points', what: 'Where each move in the hardening plan enters, numbered in the order to act' },
  { id: 'reach', label: 'Reach', what: 'How much fails with each part, as a halo' },
  { id: 'loops', label: 'Loops', what: 'The links that carry a loss back upstream' },
  { id: 'defense', label: 'Defense', what: 'The stack in place: its rings and the links it cuts' },
];

const FRAMES: { id: FrameId; label: string; ask: string; layers: Partial<Layers> }[] = [
  { id: 'whole', label: 'The whole', ask: 'What is this system?', layers: { flow: true, harden: true, reach: false, loops: true } },
  { id: 'harden', label: 'Where to harden', ask: 'Where does a defender’s move pay most?', layers: { flow: false, harden: true, reach: false, loops: false } },
  { id: 'cascade', label: 'The cascade', ask: 'How does a failure travel?', layers: { flow: true, harden: false, reach: true, loops: true } },
  { id: 'people', label: 'The people’s view', ask: 'What do the people depend on?', layers: { flow: true, harden: false, reach: false, loops: false } },
];

/* a name that opens with The reads lower case inside a sentence */
const inSentence = (name?: string) => name?.replace(/^The /, 'the ');
const kindWord = (k: NodeKind) => (k === 'model' ? 'AI model' : NODE_KIND_LABEL[k].toLowerCase());
const hrs = (h: number) => (h < 1 ? Math.round(h * 60) + ' minutes' : (Math.round(h * 10) / 10) + (h === 1 ? ' hour' : ' hours'));
const h1 = (x: number) => String(Math.round(x * 10) / 10);
const verbLabel = (v: Verb) => VERBS.find(x => x.id === v)!.label;
const still = () => typeof window !== 'undefined' && ((!!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-motion') === 'calm');
const linkKind = (how: string): 'needs' | 'supplied' | 'serves' => (/suppl/i.test(how) ? 'supplied' : /serve/i.test(how) ? 'serves' : 'needs');

/** split a cubic at its middle (de Casteljau), for a signal that stops at a cut */
function firstHalf(p: number[]): string {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = p;
  const m = (a: number, b: number) => (a + b) / 2;
  const ax = m(x0, x1), ay = m(y0, y1), bx = m(x1, x2), by = m(y1, y2), cx = m(x2, x3), cy = m(y2, y3);
  const dx = m(ax, bx), dy = m(ay, by), ex = m(bx, cx), ey = m(by, cy), fx = m(dx, ex), fy = m(dy, ey);
  return 'M' + x0 + ' ' + y0 + ' C' + ax + ' ' + ay + ' ' + dx + ' ' + dy + ' ' + fx + ' ' + fy;
}

/** one played day: its samples, the parts struck and when, and how fast its hours pass */
interface Seg { samples: Sample[]; label: string; strikes: { at: number; target: string }[]; perHour: number; gap: number; enter?: () => void }

export function SystemAtlas({ system, threats, gauge, byId, state = {}, fallen = [], reached = [], cuts = [], fresh, cutName, guards = [], org, reading = false, autoplay = false, rateMoves = true, stack, stackLabel = 'the reference stack', controls = true, plan, label }: Props) {
  const box = useRef<HTMLDivElement | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const edgeRefs = useRef<Record<string, SVGGElement | null>>({});
  const dayBtn = useRef<HTMLSpanElement | null>(null);
  const [width, setWidth] = useState(880);
  const [focus, setFocus] = useState<string | null>(null);
  const [lit, setLit] = useState<{ nodes: string[]; edges: string[] } | null>(null);
  const [frame, setFrame] = useState<FrameId>('whole');
  const haveModel = !!gauge && !!byId;
  /* defense only: a system's own map, never inside a gauge */
  const defense = rateMoves && haveModel;
  const canDefend = !!stack && stack.length > 0 && haveModel;
  const [layers, setLayers] = useState<Layers>({ flow: true, harden: true, reach: false, loops: true, defense: false });
  const [day, setDay] = useState<{ id: RunId; playing: boolean; defended: boolean } | null>(null);
  /* each state's day, bare and defended kept apart so the two can be compared */
  const [results, setResults] = useState<Record<string, { kept: number; trust: number }>>({});
  const [weekDay, setWeekDay] = useState<number | null>(null);
  const [weekShown, setWeekShown] = useState(false);
  const [played, setPlayed] = useState(false);
  const calm = useMemo(still, []);
  const playing = !!day?.playing;

  const R = useMemo(() => readSystem(system, threats, gauge, byId), [system, threats, gauge, byId]);
  const nameOf = (id: string) => system.nodes.find(n => n.id === id)?.name || id;
  const kindOf = (id: string) => system.nodes.find(n => n.id === id)?.kind || 'control';

  /* the width the map has, so circles stay round and labels get their real room. It is read before the first
     paint: the map used to draw once at 880 wide and then shrink, which on a phone showed a frame of it cut off at
     the edge (and, on a busy machine, the phone crawl measured that frame). */
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const w0 = Math.round(el.getBoundingClientRect().width);
    if (w0 > 200) setWidth(w0);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(es => { const w = Math.round(es[0].contentRect.width); if (w > 200) setWidth(w); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---------- the hardening plan: a week from a standing start, worked out after the first paint ---------- */
  const [week, setWeek] = useState<Week | null>(null);
  /* the plan can be made for the stress day or for the hardest day; each is worked out once */
  const [planFor, setPlanFor] = useState<PlanFor>('stress');
  const plans = useRef<Partial<Record<PlanFor, Week>>>({});
  useEffect(() => { plans.current = {}; }, [gauge, byId, R]);
  useEffect(() => {
    if (!defense) { setWeek(null); return; }
    if (plans.current[planFor]) { setWeek(plans.current[planFor]!); return; }
    let live = true;
    const t = window.setTimeout(() => {
      try { const w = hardeningWeek(gauge!, byId!, R, [], 6, planFor); plans.current[planFor] = w; if (live) setWeek(w); } catch { if (live) setWeek(null); }
    }, 60);
    return () => { live = false; window.clearTimeout(t); };
  }, [defense, gauge, byId, R, planFor]);

  /* ---------- the defense in place ---------- */
  const useStack = layers.defense && canDefend;
  const defModel = useMemo(() => (useStack ? buildModel(gauge!, stack!, byId!) : null), [useStack, gauge, stack, byId]);
  const stackCuts = useMemo<Cut[]>(() => (defModel ? defModel.edges.filter(e => e.cutBy).map(e => ({ from: e.from, to: e.to, by: e.cutBy! })) : []), [defModel]);
  const layersOf = (threatId: string) => defModel?.threats.find(t => t.id === threatId)?.layers || 0;
  const heldBy = useMemo(() => {
    const c: Record<string, string[]> = {};
    if (!useStack) return c;
    for (const n of system.nodes) c[n.id] = [...new Set(threats.filter(t => t.target === n.id).flatMap(t => t.counters.filter(x => stack!.includes(x))))];
    return c;
  }, [useStack, system, threats, stack]);

  /* ---------- layout: each row sits below the labels of the row above, and a staggered
     row drops its odd parts far enough to clear their neighbours' names ---------- */
  const L = useMemo(() => {
    const narrow = width < 560;
    const side = R.loops.length ? (narrow ? 34 : 54) : 14;
    const lead = 22;
    const inner = width - side - lead;
    const maxRow = Math.max(1, ...R.rows.map(r => r.length));
    const stagger = inner / maxRow < (narrow ? 118 : 150);
    const top = 38;
    const n = system.nodes.length;
    const pos: Record<string, { x: number; y: number; r: number; w: number }> = {};
    const label: Record<string, { l: number; r: number; t: number; b: number }> = {};
    /* the height a label takes: up to three lines of the name at 13px, then the kind */
    const labelH = (id: string, w: number) => {
      const name = system.nodes.find(x => x.id === id)?.name || id;
      const lines = Math.min(3, Math.max(1, Math.ceil((name.length * 7.1) / Math.max(40, w))));
      return lines * 16.25 + 2 + 15;
    };
    const radius = (id: string) => (R.publicIds.includes(id) ? 17 : 9 + 9 * Math.sqrt((R.reach[id]?.length || 0) / Math.max(1, n - 1)));
    let y = top, bottom = top;
    R.rows.forEach((row, ri) => {
      const colW = inner / row.length;
      const staggered = stagger && row.length > 1;
      const widths = row.map((id, i) => {
        const x = lead + colW * (i + 0.5);
        const room = 2 * Math.min(x - 6, width - side - x);
        return Math.max(72, Math.min(staggered ? colW * 1.9 : colW - 12, 200, room));
      });
      /* the lowered part's orb has to sit below its upper neighbours' names */
      const drop = staggered ? Math.max(54, ...row.map((id, i) => (i % 2 === 0 ? labelH(id, widths[i]) + radius(id) : 0))) + Math.max(0, ...row.map((id, i) => (i % 2 === 1 ? radius(id) : 0))) + 16 : 0;
      let rowBottom = y;
      row.forEach((id, i) => {
        const r = radius(id);
        const x = lead + colW * (i + 0.5);
        const yy = y + (staggered && i % 2 === 1 ? drop : 0);
        const w = widths[i];
        pos[id] = { x, y: yy, r, w };
        const t = yy + r + 9;
        label[id] = { l: x - w / 2, r: x + w / 2, t, b: t + labelH(id, w) };
        rowBottom = Math.max(rowBottom, label[id].b);
      });
      bottom = Math.max(bottom, rowBottom);
      const next = R.rows[ri + 1];
      if (next) {
        const nextR = Math.max(...next.map(radius));
        y = Math.max(y + (narrow ? 128 : 138), rowBottom + nextR + 26);
      }
    });
    const H = Math.ceil(bottom + 26);
    return { H, pos, label, side, narrow };
  }, [R, width, system.nodes.length]);

  /* ---------- the links ---------- */
  const cutAt = useMemo(() => new Map([...cuts, ...stackCuts].map(c => [c.from + '>' + c.to, c.by])), [cuts, stackCuts]);
  const fallenSet = useMemo(() => new Set(fallen), [fallen]);
  const reachedSet = useMemo(() => new Set(reached), [reached]);
  const loopKeys = useMemo(() => new Set(R.loops.map(l => l.from + '>' + l.to)), [R]);
  const fastKeys = useMemo(() => new Set(R.fastest.slice(1).map((t, i) => R.fastest[i] + '>' + t)), [R]);

  interface EdgeView { e: GaugeSystem['edges'][number]; i: number; key: string; d: string; half: string; how: 'needs' | 'supplied' | 'serves'; loop: boolean; cutBy: string | null; hot: boolean; mid: { x: number; y: number } | null; hue: string }
  const edges = useMemo<EdgeView[]>(() => system.edges.map((e, i): EdgeView | null => {
    const a = L.pos[e.from], b = L.pos[e.to];
    if (!a || !b) return null;
    const key = e.from + '>' + e.to;
    const loop = loopKeys.has(key);
    let d: string; let pts: number[] | null = null;
    if (loop) {
      const xr = width - 10;
      d = 'M' + (a.x + a.r + 2) + ' ' + a.y + ' C' + xr + ' ' + a.y + ' ' + xr + ' ' + b.y + ' ' + (b.x + b.r + 6) + ' ' + b.y;
    } else {
      const y1 = a.y + a.r + 3, y2 = b.y - b.r - 7;
      /* a part on a row between the two ends, near where the straight curve would cross it */
      const between = system.nodes.map(n => ({ id: n.id, p: L.pos[n.id] })).filter(o => o.p && o.id !== e.from && o.id !== e.to && o.p.y > y1 + 10 && o.p.y < y2 - 10);
      const xAt = (y: number) => { const s = (y - y1) / Math.max(1, y2 - y1); const sm = s * s * (3 - 2 * s); return a.x + (b.x - a.x) * sm; };
      const block = between.filter(o => Math.abs(xAt(o.p.y) - o.p.x) < o.p.r + 16).sort((u, v) => Math.abs(xAt(u.p.y) - u.p.x) - Math.abs(xAt(v.p.y) - v.p.x))[0];
      if (block) {
        const leftRoom = block.p.x, rightRoom = width - L.side - block.p.x;
        const wx = block.p.x + (rightRoom >= leftRoom ? 1 : -1) * (block.p.r + 30);
        const wy = block.p.y;
        const k1 = Math.max(20, (wy - y1) * 0.5), k2 = Math.max(20, (y2 - wy) * 0.5);
        d = 'M' + a.x + ' ' + y1 + ' C' + a.x + ' ' + (y1 + k1) + ' ' + wx + ' ' + (wy - k1) + ' ' + wx + ' ' + wy +
          ' C' + wx + ' ' + (wy + k2) + ' ' + b.x + ' ' + (y2 - k2) + ' ' + b.x + ' ' + y2;
      } else {
        const k = Math.max(26, (y2 - y1) * 0.5);
        pts = [a.x, y1, a.x, y1 + k, b.x, y2 - k, b.x, y2];
        d = 'M' + pts[0] + ' ' + pts[1] + ' C' + pts[2] + ' ' + pts[3] + ' ' + pts[4] + ' ' + pts[5] + ' ' + pts[6] + ' ' + pts[7];
      }
    }
    const how = linkKind(e.how);
    const cutBy = cutAt.get(key) || null;
    const hot = (fallenSet.has(e.from) || reachedSet.has(e.from)) && reachedSet.has(e.to);
    const bend = !pts && !loop ? d.match(/C[^C]* ([\d.-]+) ([\d.-]+) C/) : null;
    const mid = pts ? { x: (pts[0] + 3 * pts[2] + 3 * pts[4] + pts[6]) / 8, y: (pts[1] + 3 * pts[3] + 3 * pts[5] + pts[7]) / 8 } : bend ? { x: Number(bend[1]), y: Number(bend[2]) } : null;
    return { e, i, key, d, half: pts ? firstHalf(pts) : (!loop && bend ? d.slice(0, d.lastIndexOf(' C')) : d), how, loop, cutBy, hot, mid, hue: KIND_HUE[kindOf(e.from)] };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }).filter((x): x is EdgeView => !!x), [system, L, width, loopKeys, cutAt, fallenSet, reachedSet]);

  /* ---------- the hardening points: where each move in the plan enters, numbered in the order to act ---------- */
  const points = useMemo(() => {
    if (!week) return [];
    const byPart = new Map<string, Week['lessons']>();
    for (const l of week.lessons) if (L.pos[l.where]) byPart.set(l.where, [...(byPart.get(l.where) || []), l]);
    /* the first spot near the part that covers no name, no part and no other chip */
    const taken: { l: number; r: number; t: number; b: number }[] = [
      ...Object.values(L.label).map(o => ({ l: o.l - 4, r: o.r + 4, t: o.t - 4, b: o.b + 8 })),
      ...Object.values(L.pos).map(q => ({ l: q.x - q.r - 4, r: q.x + q.r + 4, t: q.y - q.r - 4, b: q.y + q.r + 4 })),
    ];
    const hits = (bx: { l: number; r: number; t: number; b: number }) => taken.some(o => bx.l < o.r && o.l < bx.r && bx.t < o.b && o.t < bx.b);
    return [...byPart.entries()].map(([part, list]) => {
      const p = L.pos[part];
      const text = list.map(l => l.day).join(' \u00b7 ');
      const cw = 12 + text.length * 7;
      const sides = p.x <= width / 2 ? [-1, 1] : [1, -1];
      const spots: { x: number; y: number; dir: number }[] = [];
      for (const dist of [p.r + 40, p.r + 58, p.r + 26, p.r + 84])
        for (const dir of sides)
          for (const dy of [-(p.r + 22), -(p.r + 4), 0, -(p.r + 40), p.r + 14, -(p.r + 60)]) spots.push({ x: p.x + dir * dist, y: p.y + dy, dir });
      for (const dy of [-(p.r + 26), -(p.r + 46)]) spots.push({ x: p.x, y: p.y + dy, dir: 1 });
      /* how much of a name or a part a spot would cover; off the stage costs the most */
      const cost = (sp: { x: number; y: number }) => {
        const bx = { l: sp.x - cw / 2 - 2, r: sp.x + cw / 2 + 2, t: sp.y - 12, b: sp.y + 12 };
        if (bx.l < 4 || bx.r > width - 4 || bx.t < 4 || bx.b > L.H - 4) return 1e9;
        if (!hits(bx)) return 0;
        return taken.reduce((sum, o) => sum + Math.max(0, Math.min(bx.r, o.r) - Math.max(bx.l, o.l)) * Math.max(0, Math.min(bx.b, o.b) - Math.max(bx.t, o.t)), 0);
      };
      let at = spots[0], best = Infinity;
      for (const sp of spots) { const c = cost(sp); if (c < best) { best = c; at = sp; } if (c === 0) break; }
      taken.push({ l: at.x - cw / 2 - 2, r: at.x + cw / 2 + 2, t: at.y - 12, b: at.y + 12 });
      const x0 = at.x, y0 = at.y;
      const ang = Math.atan2(p.y - y0, p.x - x0);
      const x1 = p.x - Math.cos(ang) * (p.r + 7), y1 = p.y - Math.sin(ang) * (p.r + 7);
      const sx = x0 + Math.cos(ang) * (cw / 2 + 2), sy = y0 + Math.sin(ang) * 10;
      const d = 'M' + sx + ' ' + sy + ' Q' + ((sx + x1) / 2) + ' ' + ((sy + y1) / 2 - 6) + ' ' + x1 + ' ' + y1;
      return { part, list, d, x0, y0, verb: list[0].verb, text, cw, first: list[0].day };
    });
  }, [week, L, width]);

  /* ---------- what is lit: a tap, a reading line, then the frame ---------- */
  const up = useMemo(() => {
    if (!focus) return new Set<string>();
    const s = new Set<string>(); const q = [focus];
    while (q.length) { const x = q.shift()!; for (const e of system.edges) if (e.to === x && !s.has(e.from) && e.from !== focus) { s.add(e.from); q.push(e.from); } }
    return s;
  }, [focus, system]);
  const down = useMemo(() => new Set(focus ? R.reach[focus] || [] : []), [focus, R]);
  const frameLit = useMemo<{ nodes: string[]; edges: string[] } | null>(() => {
    if (frame === 'harden' && points.length) return { nodes: points.map(x => x.part), edges: [] };
    if (frame === 'cascade' && R.fastest.length >= 2) return { nodes: [...R.fastest, ...(R.keystone ? R.reach[R.keystone] || [] : [])], edges: [...fastKeys] };
    if (frame === 'people' && R.publicIds.length) {
      /* the people, what they touch directly, and the fastest way a failure reaches them */
      const near = new Set<string>([...R.publicIds, ...R.fastest]);
      for (const e of system.edges) if (R.publicIds.includes(e.to)) near.add(e.from);
      return { nodes: [...near], edges: system.edges.filter(e => R.publicIds.includes(e.to) || fastKeys.has(e.from + '>' + e.to)).map(e => e.from + '>' + e.to) };
    }
    return null;
  }, [frame, points, R, fastKeys, system]);
  const shown = lit || frameLit;
  const litNodes = useMemo(() => new Set(shown?.nodes || []), [shown]);
  const litEdges = useMemo(() => new Set(shown?.edges || []), [shown]);
  const quiet = !!focus || !!shown;

  function pickFrame(f: FrameId) {
    setFrame(f); setFocus(null); setLit(null);
    const preset = FRAMES.find(x => x.id === f)!.layers;
    setLayers(l => ({ ...l, ...preset }));
  }
  const toggle = (id: LayerId) => setLayers(l => ({ ...l, [id]: !l[id] }));

  /* ---------- motion: signals run only on screen; the day plays once on first sight ---------- */
  useEffect(() => {
    const el = box.current; const s = svg.current;
    if (!el || !s || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([en]) => {
      try { if (en.isIntersecting) s.unpauseAnimations(); else s.pauseAnimations(); } catch { /* SMIL not supported */ }
      if (en.isIntersecting && autoplay && !played && !calm && haveModel) startDay('stress', false);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, played, haveModel, calm]);

  /* ---------- playing days on the map: each hour paints the parts, then the map heals back to whole ---------- */
  const raf = useRef(0);
  function play(segs: Seg[], byHand: boolean, ticks: boolean, onEnd: () => void) {
    const starts: number[] = []; let T = 0;
    for (const s of segs) { starts.push(T); T += 24 * s.perHour + s.gap; }
    const hold = 1400, back = 900;
    const fell = new Set<string>();
    let lastHour = 0, seg = -1;
    const t0 = performance.now();
    const paint = (sg: Seg, h: number, heal: number) => {
      const samples = sg.samples;
      /* a frame's timestamp can fall just before the run began */
      const i = Math.max(0, Math.min(samples.length - 2, Math.floor(h))); const f = Math.max(0, Math.min(1, h - i));
      const a = samples[i] || samples[0], b = samples[i + 1] || a;
      if (!a) return;
      for (const id of Object.keys(nodeRefs.current)) {
        const el = nodeRefs.current[id]; if (!el) continue;
        const v = (a.health[id] ?? 1) * (1 - f) + (b.health[id] ?? 1) * f;
        const shownV = v + (1 - v) * heal;
        el.style.setProperty('--hp', String(Math.max(0, Math.min(1, shownV))));
        el.classList.toggle('down', shownV < 0.5);
        if (shownV < 0.5 && heal === 0 && !fell.has(id)) { fell.add(id); if (byHand) Sound.fall(); }
      }
      for (const k of Object.keys(edgeRefs.current)) {
        const g = edgeRefs.current[k]; if (!g) continue;
        const from = k.split('>')[0];
        const v = (a.health[from] ?? 1) * (1 - f) + (b.health[from] ?? 1) * f;
        g.classList.toggle('failing', v + (1 - v) * heal < 0.5);
      }
      const hourNow = Math.min(24, Math.max(1, Math.ceil(h)));
      if (ticks && heal === 0 && hourNow !== lastHour) { lastHour = hourNow; if (byHand) Sound.hour(hourNow % 6 === 0); }
      if (dayBtn.current) dayBtn.current.textContent = heal > 0 ? 'The day is over' : sg.label + ' · hour ' + hourNow;
      const struck = new Set(heal === 0 ? sg.strikes.filter(x => x.at <= h && h < x.at + 2.5).map(x => x.target) : []);
      for (const id of Object.keys(nodeRefs.current)) nodeRefs.current[id]?.classList.toggle('struck', struck.has(id));
    };
    const last = segs[segs.length - 1];
    const tick = (now: number) => {
      const t = Math.max(0, now - t0);
      if (t < T) {
        let i = segs.length - 1; while (i > 0 && starts[i] > t) i--;
        if (i !== seg) { seg = i; fell.clear(); lastHour = 0; segs[i].enter?.(); }
        paint(segs[i], Math.min(24, (t - starts[i]) / segs[i].perHour), 0);
      } else if (t < T + hold) paint(last, 24, 0);
      else if (t < T + hold + back) paint(last, 24, (t - T - hold) / back);
      else { paint(last, 24, 1); onEnd(); return; }
      raf.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /* a state: one day through the model, played at two hours a second */
  function startDay(id: StateId, byHand: boolean) {
    if (!haveModel || playing) return;
    const run = buildState(id, { gauge: gauge!, byId: byId!, stack: useStack ? stack! : [], reading: R });
    const res = runState(run);
    setPlayed(true); setFocus(null); setLit(null); setWeekDay(null);
    setResults(r => ({ ...r, [id + (useStack ? ':d' : '')]: { kept: res.kept, trust: res.trust } }));
    if (id === 'calm' || calm) { setDay({ id, playing: false, defended: useStack }); return; }
    setDay({ id, playing: true, defended: useStack });
    if (byHand && (id === 'adversary' || id === 'strongest')) Sound.adversary();
    const targets = new Map(run.model.threats.map(t => [t.id, t.target]));
    const label = STATES.find(x => x.id === id)?.short || '';
    const strikes = run.arrivals.map(x => ({ at: x.at, target: targets.get(x.id) || '' })).filter(x => x.target);
    play([{ samples: res.samples, label, strikes, perHour: 500, gap: 0 }], byHand, true, () => {
      setDay(d => (d ? { ...d, playing: false } : d));
      if (byHand) Sound.verdict(res.kept >= 12);
    });
  }

  /* the week: day one with nothing in place, then each morning one move from the plan */
  function startWeek() {
    if (!haveModel || playing || !week || !week.lessons.length) return;
    setPlayed(true); setFocus(null); setLit(null);
    setLayers(l => ({ ...l, harden: true }));
    if (calm) { setWeekShown(true); setWeekDay(null); setDay({ id: 'week', playing: false, defended: false }); return; }
    setDay({ id: 'week', playing: true, defended: false });
    setWeekDay(0);
    const segs: Seg[] = [0, ...week.lessons.map(l => l.day)].map((d, i) => {
      const run = buildState(week.planFor === 'hardest' ? 'adversary' : 'stress', { gauge: gauge!, byId: byId!, stack: week.lessons.slice(0, i).map(l => l.id), reading: R });
      const targets = new Map(run.model.threats.map(t => [t.id, t.target]));
      return {
        samples: runState(run).samples, label: 'Day ' + (i + 1), perHour: 95, gap: 650,
        strikes: run.arrivals.map(x => ({ at: x.at, target: targets.get(x.id) || '' })).filter(x => x.target),
        enter: () => { setWeekDay(d); if (d > 0) Sound.gratus(); },
      };
    });
    play(segs, true, false, () => {
      setDay(d => (d ? { ...d, playing: false } : d));
      setWeekShown(true); setWeekDay(null);
      Sound.verdict(week.end >= 12);
    });
  }

  function downloadPlan() {
    if (!week) return;
    const md = planMarkdown({ name: plan?.name || org || label || 'This system', url: plan?.url, week, partName: nameOf, own: plan?.own, sources: plan?.sources, date: localDay() });
    const slug = (plan?.name || org || 'system').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'system';
    const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = slug + '-hardening-plan.md';
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /* ---------- Davara's reading ---------- */
  const unheld = useMemo(() => (defModel ? [...new Set(defModel.threats.filter(t => !t.open && t.layers === 0).map(t => t.target))] : []), [defModel]);
  const lines = useMemo(() => {
    if (!reading) return [];
    const out: { key: string; head: string; body: string; nodes: string[]; edges: string[]; beat?: boolean }[] = [];
    const n = system.nodes.length;
    if (R.keystone) {
      const k = R.keystone; const r = R.reach[k] || [];
      const people = r.filter(x => kindOf(x) === 'public' || kindOf(x) === 'people');
      out.push({ key: 'keystone', head: 'The keystone',
        body: 'Everything rests most on ' + nameOf(k) + '. If it fails, ' + r.length + ' of the other ' + (n - 1) + ' parts lose what they need' + (people.length ? ', the people among them' : '') + '.',
        nodes: [k, ...r], edges: system.edges.filter(e => e.from === k || (r.includes(e.from) && r.includes(e.to))).map(e => e.from + '>' + e.to) });
    }
    if (defense && week && week.lessons.length) {
      const dayWord = week.planFor === 'hardest' ? 'the hardest day' : 'the stress day';
      out.push({ key: 'order', head: 'Harden in this order' + (week.planFor === 'hardest' ? ' for the hardest day' : ''),
        body: week.lessons.map(l => l.day + '. ' + l.name + ' at ' + nameOf(l.where)).join('; ') + '. Each one was chosen after the ones before it. Together they take ' + dayWord + ' from ' + h1(week.start) + ' to ' + h1(week.end) + ' of 24 hours.' +
          (week.end < 23.5 && week.lessons.length < 6 ? ' After that, no single move adds even twenty minutes, so what is left is structural.' : ''),
        nodes: [...new Set(week.lessons.map(l => l.where))], edges: [] });
      const count = (v: Verb) => week.lessons.filter(l => l.verb === v).length;
      const used = VERBS.filter(v => count(v.id) > 0).map(v => v.label + ' ' + count(v.id));
      const missing = (['detect', 'restore'] as Verb[]).filter(v => !count(v));
      out.push({ key: 'cadence', head: 'The defender’s cadence',
        body: 'The plan by verb: ' + used.join(', ') + '.' + (missing.length ? ' Nothing in it ' + missing.map(v => (v === 'detect' ? 'detects' : 'restores')).join(' or ') + '. ' + 'Detecting and restoring are the steps that let a system learn from each incident.' : ' It covers seeing trouble and bringing service back.'),
        nodes: [...new Set(week.lessons.map(l => l.where))], edges: [] });
      out.push({ key: 'hardest', head: 'The hardest day',
        body: week.hardest >= 23.5
          ? 'With the plan in place the system keeps ' + h1(week.hardest) + ' of 24 hours even on the hardest day.'
          : 'On the stress day the plan keeps ' + h1(week.end) + ' hours. On the hardest day it keeps ' + h1(week.hardest) + ' of 24.' + (week.stillFalls.length ? ' Still below half at the end: ' + week.stillFalls.map(nameOf).join(' and ') + '. That is where to look next.' : ''),
        nodes: week.stillFalls, edges: [] });
    }
    if (R.fastest.length >= 2 && R.fastestHours !== null) {
      out.push({ key: 'beat', head: 'The beat of this system', beat: true,
        body: 'A live link fails in about ' + hrs(BEAT.live) + ', the people feel a loss in about ' + hrs(BEAT.people) + ', and a supply holds for about ' + hrs(BEAT.supply) + '. A pressure that lands pushes for ' + hrs(BEAT.unseen) + ' when nothing sees it. Here a failure reaches the people in about ' + hrs(R.fastestHours) + ', so trouble has to be seen inside that.',
        nodes: R.fastest, edges: [...fastKeys] });
      out.push({ key: 'fast', head: 'The fastest cascade',
        body: R.fastest.map(nameOf).join(', then ') + '. On the model’s delays a failure at the top reaches the people in about ' + hrs(R.fastestHours) + '.',
        nodes: R.fastest, edges: [...fastKeys] });
    }
    const chokes = R.chokepoints.filter(c => c !== R.keystone);
    if (chokes.length || R.chokepoints.length) {
      const list = (chokes.length ? chokes : R.chokepoints).slice(0, 3);
      out.push({ key: 'choke', head: 'No way around',
        body: 'Every path to ' + nameOf(R.publicIds[0] || '') + ' runs through ' + list.map(nameOf).join(' and ') + '. A second path there is worth more than a stronger wall.',
        nodes: list, edges: [] });
    }
    if (defModel) {
      out.push({ key: 'unheld', head: unheld.length ? 'Parts still to harden' : 'Every part held',
        body: unheld.length
          ? 'With ' + stackLabel + ' in place, a pressure still meets no layer at ' + unheld.map(nameOf).join(' and at ') + '.'
          : 'With ' + stackLabel + ' in place, every pressure meets at least one layer before it reaches its part.',
        nodes: unheld, edges: [] });
    }
    if (R.buffers.length) {
      const b = R.buffers[0];
      out.push({ key: 'buffer', head: 'The time you have',
        body: nameOf(b.to) + ' runs on what ' + nameOf(b.from) + ' supplies and holds for about three hours after it stops' + (R.buffers.length > 1 ? ', as ' + (R.buffers.length - 1) + ' other supply ' + (R.buffers.length === 2 ? 'link does' : 'links do') : '') + '. That buffer is the window to act.',
        nodes: [b.from, b.to], edges: R.buffers.map(x => x.from + '>' + x.to) });
    }
    if (R.loops.length) {
      const l = R.loops[0];
      out.push({ key: 'loop', head: 'The loop that compounds',
        body: nameOf(l.from) + ' feeds back into ' + nameOf(l.to) + '. A loss there returns upstream, so it grows on each turn of the loop.',
        nodes: [l.from, l.to], edges: R.loops.map(x => x.from + '>' + x.to) });
    }
    for (const g of guards.filter(x => x.parts.length).slice(0, 2)) {
      out.push({ key: 'guard-' + g.move, head: 'What ' + (inSentence(org) || 'it') + ' leans on here',
        body: g.move + ' guards ' + g.parts.map(nameOf).join(', ') + '.', nodes: g.parts, edges: [] });
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading, R, system, defense, week, guards, org, fastKeys, defModel, unheld, stackLabel]);

  const guardCount = useMemo(() => {
    const c: Record<string, number> = {};
    for (const g of guards) for (const p of g.parts) c[p] = (c[p] || 0) + 1;
    return c;
  }, [guards]);
  const maxReach = Math.max(1, ...Object.values(R.reach).map(r => r.length));
  /* the pressures show on their parts inside a gauge, and on any map while a run plays them out */
  const showPins = !defense || Object.keys(state).length > 0;

  const card = focus ? {
    id: focus, name: nameOf(focus), kind: kindOf(focus),
    needs: [...up].filter(x => system.edges.some(e => e.from === x && e.to === focus)),
    falls: R.reach[focus] || [],
    hour: R.fall[focus],
    on: threats.filter(t => t.target === focus),
    guard: guards.filter(g => g.parts.includes(focus)).map(g => g.move),
    moves: week ? week.lessons.filter(l => l.where === focus) : [],
    held: (heldBy[focus] || []).map(id => byId?.get(id)?.name || id),
  } : null;

  const stateList = STATES.filter(x => x.id !== 'keystone' || R.keystone);
  const ran = stateList.flatMap(x => [false, true].filter(d => results[x.id + (d ? ':d' : '')]).map(d => ({ ...x, defended: d, r: results[x.id + (d ? ':d' : '')] })));
  const weekRows = week ? [{ day: 1, name: 'Nothing in place', kept: week.start, verb: null as Verb | null }, ...week.lessons.map(l => ({ day: l.day + 1, name: l.name, kept: l.kept, verb: l.verb as Verb | null }))] : [];

  return (
    <div className={'sa' + (playing ? ' playing' : '') + (quiet ? ' quiet' : '') + (calm ? ' calm' : '') + (layers.flow ? '' : ' no-flow') + (layers.loops ? '' : ' no-loops')}>
      {controls && (
        <div className="sa-controls">
          <div className="sa-frames" role="group" aria-label="Frames">
            {FRAMES.filter(f => (f.id !== 'harden' || defense) && (f.id !== 'cascade' || R.fastest.length >= 2)).map(f => (
              <button key={f.id} type="button" className={'sa-frame' + (frame === f.id ? ' on' : '')} aria-pressed={frame === f.id} title={f.ask} onClick={() => pickFrame(f.id)}>{f.label}</button>
            ))}
          </div>
          <div className="sa-layers" role="group" aria-label="Layers">
            {LAYERS.filter(x => (x.id !== 'harden' || defense) && (x.id !== 'defense' || canDefend)).map(x => (
              <button key={x.id} type="button" className={'sa-layer l-' + x.id + (layers[x.id] ? ' on' : '')} aria-pressed={layers[x.id]} title={x.what} onClick={() => toggle(x.id)}>
                <i aria-hidden />{x.label}{x.id === 'defense' ? ': ' + stackLabel : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sa-stage" ref={box} style={{ height: L.H }}
        role="group" aria-label={(label || 'System map') + ': ' + system.nodes.length + ' parts and ' + system.edges.length + ' links' + (R.keystone ? '. The keystone is ' + nameOf(R.keystone) : '')}
        onClick={ev => { if (ev.target === ev.currentTarget) { setFocus(null); setLit(null); } }}>
        <svg ref={svg} className="sa-links" width={width} height={L.H} viewBox={'0 0 ' + width + ' ' + L.H} aria-hidden>
          <defs>
            <marker id="sa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0 1 9 5 0 9z" className="sa-arrowhead" />
            </marker>
            {VERBS.map(v => (
              <marker key={v.id} id={'sa-hp-' + v.id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                <path d="M0 1 9 5 0 9z" className={'sa-hp-head v-' + v.id} />
              </marker>
            ))}
            <radialGradient id="sa-halo-g"><stop offset="0" stopColor="#f18ac6" stopOpacity="0.32" /><stop offset="1" stopColor="#f18ac6" stopOpacity="0" /></radialGradient>
            <radialGradient id="sa-halo-k"><stop offset="0" stopColor="#fdc26f" stopOpacity="0.36" /><stop offset="1" stopColor="#fdc26f" stopOpacity="0" /></radialGradient>
          </defs>

          {/* reach: a halo as wide as what fails with the part */}
          {layers.reach && system.nodes.map(nd => {
            const p = L.pos[nd.id]; const rn = R.reach[nd.id]?.length || 0;
            if (!p || !rn) return null;
            return <circle key={'h' + nd.id} cx={p.x} cy={p.y} r={p.r + 12 + 46 * (rn / maxReach)} fill={'url(#' + (R.keystone === nd.id ? 'sa-halo-k' : 'sa-halo-g') + ')'} className="sa-halo" />;
          })}

          {edges.map(x => {
            const on = (focus && ((up.has(x.e.from) || x.e.from === focus) && (up.has(x.e.to) || x.e.to === focus) || (down.has(x.e.to) && (down.has(x.e.from) || x.e.from === focus)))) || litEdges.has(x.key);
            const cls = 'sa-link k-' + x.how + (x.loop ? ' loop' : '') + (x.cutBy ? ' cut' : '') + (x.hot ? ' hot' : '') + (fastKeys.has(x.key) && frame === 'cascade' ? ' fast' : '') + (on ? ' on' : '');
            const dur = x.how === 'supplied' ? 4.8 : x.how === 'serves' ? 2.8 : 1.7;
            return (
              <g key={x.key} className={cls} style={{ ['--hue' as string]: x.hue }} ref={el => { edgeRefs.current[x.key] = el; }}>
                <path d={x.d} className="sa-path" markerEnd="url(#sa-arrow)" />
                {x.how === 'supplied' && !x.loop && <path d={x.d} className="sa-path sa-twin" />}
                {!calm && (
                  <g className="sa-sigs">
                    <circle r={x.how === 'supplied' ? 3.2 : 2.4} className="sa-sig">
                      <animateMotion dur={(x.hot ? 0.9 : dur) + 's'} repeatCount="indefinite" begin={(-((x.i * 0.61) % dur)).toFixed(2) + 's'} path={x.cutBy ? x.half : x.d} />
                    </circle>
                    {x.how === 'needs' && !x.cutBy && (
                      <circle r={1.8} className="sa-sig faint">
                        <animateMotion dur={dur + 's'} repeatCount="indefinite" begin={(-((x.i * 0.61 + dur / 2) % dur)).toFixed(2) + 's'} path={x.d} />
                      </circle>
                    )}
                  </g>
                )}
                {x.how === 'supplied' && x.mid && !x.loop && <rect x={x.mid.x - 7} y={x.mid.y - 4} width={14} height={8} rx={4} className="sa-buffer" />}
                {x.cutBy && x.mid && (
                  <g transform={'translate(' + x.mid.x + ' ' + x.mid.y + ')'}>
                    <rect x={-13} y={-3} width={26} height={6} rx={3} className="sa-cutbar" />
                    <title>{'Cut by ' + (cutName ? cutName(x.cutBy) : byId?.get(x.cutBy)?.name || x.cutBy)}</title>
                  </g>
                )}
              </g>
            );
          })}

          {/* the hardening points: a defender's move entering the system, numbered in the order to act */}
          {layers.harden && points.map(pt => {
            const later = weekDay !== null && pt.first > weekDay;
            const arrive = weekDay !== null && pt.list.some(l => l.day === weekDay);
            return (
              <g key={'hp' + pt.part} className={'sa-hp v-' + pt.verb + (litNodes.size && !litNodes.has(pt.part) ? ' dim' : '') + (later ? ' later' : '') + (arrive ? ' arrive' : '')}>
                <path d={pt.d} className="sa-hp-path" markerEnd={'url(#sa-hp-' + pt.verb + ')'} />
                {!calm && (
                  <circle r={2.6} className="sa-hp-sig">
                    <animateMotion dur={(1.9 + (pt.first % 3) * 0.2) + 's'} repeatCount="indefinite" path={pt.d} />
                  </circle>
                )}
                <g transform={'translate(' + pt.x0 + ' ' + pt.y0 + ')'}>
                  <rect x={-pt.cw / 2} y={-10} width={pt.cw} height={20} rx={8} className="sa-hp-chip" />
                  <text x={0} y={4.5} textAnchor="middle" className="sa-hp-n">{pt.text}</text>
                </g>
                <title>{pt.list.map(l => l.day + '. ' + l.name + ' (' + verbLabel(l.verb) + ') adds ' + h1(l.gain) + ' hours').join('\n')}</title>
              </g>
            );
          })}
        </svg>

        {system.nodes.map(nd => {
          const p = L.pos[nd.id]; if (!p) return null;
          const on = threats.filter(t => t.target === nd.id);
          const isKey = R.keystone === nd.id, isChoke = R.chokepoints.includes(nd.id);
          const role = focus === nd.id ? ' focus' : focus ? (up.has(nd.id) ? ' up' : down.has(nd.id) ? ' down' : ' dim') : shown ? (litNodes.has(nd.id) ? ' lit' : ' dim') : '';
          const ringN = (heldBy[nd.id] || []).length;
          const moves = defense && week ? week.lessons.filter(l => l.where === nd.id) : [];
          const cls = 'sa-node k-' + nd.kind + (isKey ? ' keystone' : '') + (isChoke ? ' choke' : '') + (fallenSet.has(nd.id) ? ' fallen' : reachedSet.has(nd.id) ? ' reached' : '') + (fresh === nd.id ? ' fresh' : '') + role;
          return (
            <button key={nd.id} type="button" className={cls} ref={el => { nodeRefs.current[nd.id] = el; }}
              style={{ left: p.x, top: p.y, ['--kind' as string]: KIND_HUE[nd.kind], ['--r' as string]: p.r + 'px', ['--lw' as string]: p.w + 'px' }}
              aria-pressed={focus === nd.id}
              aria-label={nd.name + ', ' + kindWord(nd.kind) + (isKey ? ', the keystone' : '') + (moves.length ? ', hardening move ' + moves.map(m => m.day).join(' and ') : '') + (showPins && on.length ? ', ' + on.length + (on.length === 1 ? ' pressure' : ' pressures') : '')}
              onClick={() => { setLit(null); setFocus(f => (f === nd.id ? null : nd.id)); }}>
              <span className="sa-orb">
                {showPins && on.map((t, i) => (
                  <i key={t.id} className={'sa-pin s-' + (state[t.id] || 'idle') + (t.weight >= 3 ? ' heavy' : '') + (t.open ? ' open' : '') + (useStack && !state[t.id] ? (layersOf(t.id) === 0 ? ' bare' : layersOf(t.id) === 1 ? ' one' : ' two') : '')}
                    style={{ transform: 'rotate(' + (-60 + (on.length === 1 ? 60 : (i * 120) / (on.length - 1))) + 'deg) translateY(calc(-1 * (var(--r) + 7px)))' }} />
                ))}
                {Array.from({ length: Math.min(3, ringN) }, (_, i) => <b key={'r' + i} className="sa-ring" style={{ ['--ri' as string]: String(i) }} aria-hidden />)}
                {guardCount[nd.id] ? <b className="sa-guard" aria-hidden /> : null}
              </span>
              <span className="sa-label">
                <span className="sa-name">{nd.name}</span>
                <span className="sa-kind">{kindWord(nd.kind)}{isKey ? ' · keystone' : isChoke ? ' · no way around' : ''}</span>
              </span>
            </button>
          );
        })}
      </div>

      {controls && haveModel && (
        <div className="sa-states" role="group" aria-label="Put the system in a state">
          <span className="sa-states-l">Run a day</span>
          <div className="sa-states-row">
            {defense && (
              <span className="sa-planfor" role="group" aria-label="Plan for">
                {(['stress', 'hardest'] as PlanFor[]).map(pf => (
                  <button key={pf} type="button" className={'sa-pf' + (planFor === pf ? ' on' : '')} aria-pressed={planFor === pf} disabled={playing}
                    title={pf === 'stress' ? 'Plan the week for the stress day' : 'Plan the week for the hardest day'} onClick={() => { setPlanFor(pf); setWeekShown(false); }}>
                    {pf === 'stress' ? 'For the stress day' : 'For the hardest day'}
                  </button>
                ))}
              </span>
            )}
            {defense && week && week.lessons.length > 0 && (
              <button type="button" className={'sa-state sa-week-btn' + (day?.id === 'week' ? ' on' : '')} disabled={playing} aria-pressed={day?.id === 'week'}
                title="Day one with nothing in place. Each morning after, one move from the hardening plan." onClick={startWeek}>
                {day?.id === 'week' && playing ? <span ref={dayBtn}>A week of hardening</span> : 'A week of hardening'}
              </button>
            )}
            {stateList.map(x => (
              <button key={x.id} type="button" className={'sa-state' + (day?.id === x.id ? ' on' : '') + (x.id === 'adversary' ? ' extreme' : '')} disabled={playing} aria-pressed={day?.id === x.id} title={x.line} onClick={() => startDay(x.id, true)}>
                {day?.id === x.id && playing ? <span ref={dayBtn}>{x.short}</span> : x.short}
              </button>
            ))}
          </div>
          {day && day.id !== 'week' && <p className="sa-state-line">{STATES.find(x => x.id === day.id)?.line}{day.defended ? ' With ' + stackLabel + ' in place.' : ' With nothing in place.'}</p>}
          {day?.id === 'week' && <p className="sa-state-line">Day one runs with nothing in place. Each morning after, the defender adds the move the last day says would keep the most, and the day runs again.</p>}
          {weekShown && weekRows.length > 0 && (
            <ol className="sa-results sa-week" aria-label="What each day of the week kept">
              {weekRows.map(w => (
                <li key={w.day} className={'sa-result' + (w.verb ? ' v-' + w.verb : '')} style={{ ['--kept' as string]: String(w.kept / 24) }}>
                  <span className="sa-result-name">Day {w.day} · {w.verb ? '+ ' + w.name : w.name}</span>
                  <span className="sa-result-bar" aria-hidden><i /></span>
                  <strong>{Math.round(w.kept)} of 24 h</strong>
                </li>
              ))}
            </ol>
          )}
          {ran.length > 0 && (
            <ol className="sa-results" aria-label="What each day kept">
              {ran.map(({ r, ...x }) => (
                <li key={x.id + x.defended} className={'sa-result' + (day?.id === x.id && day.defended === x.defended ? ' on' : '')} style={{ ['--kept' as string]: String(r.kept / 24) }}>
                  <span className="sa-result-name">{x.short}{x.defended ? ' · ' + stackLabel : ' · nothing in place'}</span>
                  <span className="sa-result-bar" aria-hidden><i /></span>
                  <strong>{Math.round(r.kept)} of 24 h</strong>
                </li>
              ))}
            </ol>
          )}
          {defense && week && week.lessons.length > 0 && (
            <div className="sa-plan-row">
              <button type="button" className="btn btn-sm" onClick={downloadPlan}>Download the hardening plan</button>
              <span>A Markdown file with the order to act, each move's verb and hours, and the sources.</span>
            </div>
          )}
        </div>
      )}

      {!controls && gauge && byId && (
        <div className="sa-bar">
          <button type="button" className="btn btn-sm" onClick={() => startDay('stress', true)} disabled={playing || calm}>
            {playing ? <span ref={dayBtn}>Play the stress day</span> : played ? 'Play the stress day again' : 'Play the stress day'}
          </button>
        </div>
      )}

      <details className="sa-key">
        <summary>How to read this map</summary>
        <ul>
          <li><svg viewBox="0 0 40 10" aria-hidden><path d="M2 5 H38" className="sa-k needs" /></svg>Needs it live: fails within minutes of the part above it.</li>
          <li><svg viewBox="0 0 40 10" aria-hidden><path d="M2 3.5 H38 M2 6.5 H38" className="sa-k supplied" /></svg>Supplied: runs for hours on what it holds. The small capsule is that buffer.</li>
          <li><svg viewBox="0 0 40 10" aria-hidden><path d="M2 5 H38" className="sa-k serves" /></svg>Serves the people: they feel the loss about an hour later.</li>
          <li><svg viewBox="0 0 40 10" aria-hidden><path d="M2 8 C14 -2 26 -2 38 8" className="sa-k loop" /></svg>A link that arcs back up the side closes a feedback loop.</li>
          <li><svg viewBox="0 0 40 12" aria-hidden><circle cx="20" cy="6" r="4.5" className="sa-k keystone" /></svg>The amber ring is the keystone. A part's size is how much fails with it.</li>
          {defense && <li><svg viewBox="0 0 40 12" aria-hidden><rect x="1" y="1" width="14" height="10" rx="4" className="sa-k hpchip" /><path d="M16 6 H36" className="sa-k hp" /></svg>A hardening point: where a move from the plan enters. The number is its day in the order to act.</li>}
          {defense && <li className="sa-key-verbs">{VERBS.map(v => <span key={v.id} className={'sa-verb v-' + v.id} title={v.line}><i aria-hidden />{v.label}</span>)}<span className="sa-key-note">The colour is the move's verb, from MITRE D3FEND.</span></li>}
          <li><svg viewBox="0 0 40 12" aria-hidden><circle cx="20" cy="6" r="4" className="sa-k ring" /></svg>A ring around a part: a structure in the defense holds a pressure there. A bar across a link: the defense cuts it.</li>
          {guards.length > 0 && <li><svg viewBox="0 0 40 12" aria-hidden><circle cx="20" cy="6" r="4" className="sa-k guard" /></svg>A pearl dot: something {inSentence(org) || 'the organisation'} already leans on guards this part.</li>}
        </ul>
      </details>

      {card && (
        <div className="sa-card" role="region" aria-label={card.name}>
          <div className="sa-card-head">
            <span className="sa-card-dot" style={{ ['--kind' as string]: KIND_HUE[card.kind] }} />
            <strong>{card.name}</strong>
            <span>{kindWord(card.kind)}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFocus(null)}>Close</button>
          </div>
          <dl>
            {card.needs.length > 0 && <div><dt>It needs</dt><dd>{card.needs.map(nameOf).join(', ')}</dd></div>}
            <div><dt>If it fails</dt><dd>{card.falls.length ? card.falls.length + (card.falls.length === 1 ? ' part loses' : ' parts lose') + ' what they need: ' + card.falls.map(nameOf).join(', ') + '.' : 'Nothing else on the map depends on it.'}</dd></div>
            {card.hour !== undefined && gauge && <div><dt>On a stress day</dt><dd>{card.hour === null ? 'It holds the whole day, with nothing in place.' : 'With nothing in place it drops below half its function at about hour ' + Math.max(1, Math.round(card.hour)) + '.'}</dd></div>}
            {card.moves.length > 0 && <div><dt>Harden it</dt><dd>{card.moves.map(m => 'Day ' + m.day + ': ' + m.name + ' (' + verbLabel(m.verb) + ') adds ' + h1(m.gain) + ' hours').join(' · ')}</dd></div>}
            {card.held.length > 0 && <div><dt>Held by</dt><dd>{card.held.join(', ')}</dd></div>}
            {!defense && card.on.length > 0 && <div><dt>The pressures on it</dt><dd>{card.on.map(t => t.name + (useStack ? (layersOf(t.id) === 0 ? ' (nothing holds it)' : layersOf(t.id) === 1 ? ' (one layer)' : ' (' + layersOf(t.id) + ' layers)') : '')).join(', ')}</dd></div>}
            {card.guard.length > 0 && <div><dt>What {inSentence(org) || 'it'} leans on here</dt><dd>{card.guard.join(' · ')}</dd></div>}
          </dl>
        </div>
      )}

      {reading && lines.length > 0 && (
        <section className="sa-read" aria-label="Davara's reading">
          <span className="label">Davara's reading</span>
          <ol>
            {lines.map(l => (
              <li key={l.key} className={l.beat ? 'sa-beat-li' : undefined}>
                <button type="button" className={'sa-line' + (lit && lit.nodes.join() === l.nodes.join() ? ' on' : '')}
                  onMouseEnter={() => { setFocus(null); setLit({ nodes: l.nodes, edges: l.edges }); }}
                  onMouseLeave={() => setLit(null)}
                  onFocus={() => { setFocus(null); setLit({ nodes: l.nodes, edges: l.edges }); }}
                  onBlur={() => setLit(null)}
                  onClick={() => { setFocus(null); setLit(v => (v && v.nodes.join() === l.nodes.join() ? null : { nodes: l.nodes, edges: l.edges })); }}>
                  <strong>{l.head}</strong>
                  {l.beat && (
                    <span className="sa-beat" aria-hidden>
                      <i className="b-live" /><i className="b-people" /><i className="b-supply" /><i className="b-unseen" />
                    </span>
                  )}
                  <span>{l.body}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

/* ---------- the leverage ladder: where a system's leverage points sit on Meadows' twelve ---------- */

export function LeverageLadder({ points }: { points: { point: string; why: string }[] }) {
  const placed = useMemo(() => points.map(p => ({ ...p, rung: rungOf(p.point) })), [points]);
  const [open, setOpen] = useState<number | null>(() => {
    const deepest = placed.filter(p => p.rung !== null).sort((a, b) => a.rung! - b.rung!)[0];
    return deepest ? deepest.rung : null;
  });
  const at = (n: number) => placed.filter(p => p.rung === n);
  const loose = placed.filter(p => p.rung === null);
  const rungs = [...RUNGS].sort((a, b) => a.n - b.n);
  return (
    <section className="sa-ladder" aria-label="Where its leverage sits">
      <span className="label">Where its leverage sits</span>
      <p className="sec" style={{ margin: '4px 0 10px' }}>Donella Meadows ranked twelve places to change a system. The higher the rung, the deeper the change. Davara placed each of this system's leverage points on its rung.</p>
      <div className="sa-ladder-grid">
        <ol className="sa-rungs">
          {rungs.map(r => {
            const here = at(r.n);
            return (
              <li key={r.n}>
                <button type="button" className={'sa-rung' + (here.length ? ' lit' : '') + (open === r.n ? ' on' : '')} disabled={!here.length}
                  onClick={() => setOpen(r.n)} aria-pressed={open === r.n} style={{ ['--depth' as string]: String((12 - r.n) / 11) }}>
                  <span className="sa-rung-n">{r.n}</span>
                  <span className="sa-rung-name">{r.name}</span>
                  <span className="sa-rung-dots" aria-label={here.length + (here.length === 1 ? ' point' : ' points')}>{here.map((_, i) => <i key={i} />)}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="sa-rung-read" aria-live="polite">
          {open !== null && at(open).map((p, i) => (
            <div key={i} className="sa-rung-point"><strong>{p.point}</strong><span>{p.why}</span></div>
          ))}
          {open === null && loose.length === 0 && <p className="sec" style={{ margin: 0 }}>Choose a lit rung.</p>}
          {loose.length > 0 && open === null && loose.map((p, i) => <div key={i} className="sa-rung-point"><strong>{p.point}</strong><span>{p.why}</span></div>)}
        </div>
      </div>
    </section>
  );
}
