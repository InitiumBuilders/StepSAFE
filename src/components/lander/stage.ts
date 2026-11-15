/* THE STAGE: one small system that the welcome page keeps on screen while you read, and that each chapter
   puts in a different state. Thirteen parts in three columns rest on three foundations, and service runs
   down every link to the people at the bottom. A line along the foot of the stage traces how much of it
   reaches them, moment to moment.

   The chapters, each a state of the same system:
     0 hold       it builds itself, then a threat lands on a part and a layer around it holds
     1 rests      the dependency chains light from the foundations down to the people
     2 travel     a foundation fails and the failure travels every link to the people
     3 keystone   the part most of the system leans on comes forward, and what rests on it lights
     4 layers     close on the keystone: three rings, and each stops one threat
     5 walls      the system in three cells: a failure fills one and stops at the walls
     6 way back   the keystone falls, refills, and service comes back down the links
     7 hardest    every threat at once against every structure; one gets in, the walls keep it small,
                  it recovers, and the day's line is joined by many more days

   A failure moves along a link at the link's own pace, and a part falls when any part it rests on is down.
   The visitor can play it: a tap on a part sends a threat at it, which the chapter's structures meet as
   they would any other (a layer holds it, a wall keeps it in its cell, or it travels), and a tap on a
   fallen part brings it back. While someone plays, the chapter's own script waits; a few quiet seconds
   later it starts again from a clean day.

   Nothing here is measured: it is a drawing of the ideas the gauges compute. The canvas runs only while
   it is on screen, caps its pixel ratio at 1.5, and under reduced motion draws one still frame per
   chapter. Each threat that lands sends a ripple through the page's lattice (lib/field). */

import { Field } from '../../lib/field';

type Kind = 'base' | 'part' | 'key' | 'people';
interface Part { id: string; x: number; y: number; kind: Kind; cell: number }

const PARTS: Part[] = [
  { id: 'f1', x: 118, y: 72, kind: 'base', cell: 0 },
  { id: 'f2', x: 300, y: 58, kind: 'base', cell: 1 },
  { id: 'f3', x: 482, y: 72, kind: 'base', cell: 2 },
  { id: 'a', x: 88, y: 190, kind: 'part', cell: 0 },
  { id: 'b', x: 252, y: 180, kind: 'part', cell: 1 },
  { id: 'c', x: 348, y: 180, kind: 'part', cell: 1 },
  { id: 'd', x: 512, y: 190, kind: 'part', cell: 2 },
  { id: 'e', x: 150, y: 300, kind: 'part', cell: 0 },
  { id: 'k', x: 300, y: 296, kind: 'key', cell: 1 },
  { id: 'g', x: 450, y: 300, kind: 'part', cell: 2 },
  { id: 'h', x: 186, y: 414, kind: 'part', cell: 0 },
  { id: 'i', x: 414, y: 414, kind: 'part', cell: 2 },
  { id: 'p', x: 300, y: 520, kind: 'people', cell: -1 },
];
const EDGES: [string, string][] = [
  ['f1', 'a'], ['f1', 'b'], ['f2', 'b'], ['f2', 'c'], ['f3', 'c'], ['f3', 'd'],
  ['a', 'e'], ['b', 'e'], ['b', 'k'], ['c', 'k'], ['c', 'g'], ['d', 'g'],
  ['e', 'h'], ['k', 'h'], ['k', 'i'], ['g', 'i'],
  ['h', 'p'], ['i', 'p'],
];
const BY: Record<string, Part> = Object.fromEntries(PARTS.map(p => [p.id, p]));
const INS: Record<string, number[]> = {}, OUTS: Record<string, number[]> = {};
for (const p of PARTS) { INS[p.id] = []; OUTS[p.id] = []; }
EDGES.forEach(([a, b], i) => { OUTS[a].push(i); INS[b].push(i); });

/* the cells are columns; a link that crosses between them crosses a wall at the gap's centre */
const CELLS = [0, 1, 2].map(c => {
  const ps = PARTS.filter(p => p.cell === c);
  const pad = 24;
  return { x0: Math.min(...ps.map(p => p.x)) - pad, x1: Math.max(...ps.map(p => p.x)) + pad, y0: Math.min(...ps.map(p => p.y)) - pad - 6, y1: Math.max(...ps.map(p => p.y)) + pad };
});
const GATE_X = [(CELLS[0].x1 + CELLS[1].x0) / 2, (CELLS[1].x1 + CELLS[2].x0) / 2];
function gateOf(i: number): { x: number; y: number; ang: number } | null {
  const [a, b] = EDGES[i];
  const A = BY[a], B = BY[b];
  if (A.cell < 0 || B.cell < 0 || A.cell === B.cell) return null;
  const gx = GATE_X[Math.min(A.cell, B.cell)];
  const t = (gx - A.x) / (B.x - A.x);
  return { x: gx, y: A.y + (B.y - A.y) * t, ang: Math.atan2(B.y - A.y, B.x - A.x) };
}
const GATES = EDGES.map((_, i) => gateOf(i));
const KEY = BY.k;
const RINGS = [64, 46, 30];
const CENTRE = { x: 300, y: 290 };
const BOX = { x0: 40, y0: 14, x1: 560, y1: 556 };

type RGB = [number, number, number];
export interface Pal { ice: RGB; azure: RGB; violet: RGB; orchid: RGB; pink: RGB; coral: RGB; amber: RGB; pearl: RGB; ink: RGB; ground: RGB; light: boolean }
const rgba = (c: RGB, a: number) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')';
function parse(s: string, fb: RGB): RGB {
  const v = s.trim();
  const m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
  const r = v.match(/rgba?\((\d+)[ ,]+(\d+)[ ,]+(\d+)/);
  return r ? [Number(r[1]), Number(r[2]), Number(r[3])] : fb;
}
export function readPal(el: Element): Pal {
  const cs = getComputedStyle(el);
  const g = (n: string, fb: RGB) => parse(cs.getPropertyValue(n), fb);
  const ground = g('--ground', [5, 11, 32]);
  return {
    ice: g('--lx-ice', [216, 239, 252]), azure: g('--lx-azure', [156, 195, 239]), violet: g('--lx-violet', [167, 139, 255]), orchid: g('--lx-orchid', [192, 132, 252]),
    pink: g('--lx-pink', [241, 138, 198]), coral: g('--lx-coral', [232, 120, 106]), amber: g('--lx-amber', [253, 194, 111]), pearl: g('--lx-pearl', [248, 241, 251]),
    ink: g('--ink', [244, 246, 249]), ground, light: (ground[0] * 0.3 + ground[1] * 0.59 + ground[2] * 0.11) > 128,
  };
}

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
const easeIn = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const mixRGB = (a: RGB, b: RGB, k: number): RGB => [Math.round(a[0] + (b[0] - a[0]) * k), Math.round(a[1] + (b[1] - a[1]) * k), Math.round(a[2] + (b[2] - a[2]) * k)];
const FADE = 0.5;

interface Pulse { e: number; t0: number; dur: number; kind: 'fail' | 'up' | 'trace'; then?: () => void; fade?: number }
interface Threat { to: string; t0: number; dur: number; ox: number; oy: number; ring: number; shield: boolean; fade?: number }
interface Flash { x: number; y: number; t0: number; kind: 'hit' | 'ring' | 'shield' | 'gate'; ang?: number; r?: number }
interface Ev { at: number; fn: () => void }

interface Chapter {
  /** seconds a loop lasts; the script runs again from the start */
  period: number;
  /** close on the keystone */
  zoom?: number;
  keyFocus?: boolean;
  walls?: boolean;
  /** the keystone's three rings */
  layers?: boolean;
  /** parts with one ring of their own */
  shields?: string[];
  /** the moment the still frame shows under reduced motion */
  still: number;
  script: (s: Stage) => Ev[];
}

const CHAPTERS: Chapter[] = [
  /* 0 hold */
  { period: 8, still: 6.6, shields: ['c', 'e'], script: s => [
    { at: 1.6, fn: () => s.threat('c', -0.5, 0) },
    { at: 5.2, fn: () => s.threat('e', 0.4, 0) },
  ] },
  /* 1 rests */
  { period: 7.5, still: 2.3, script: s => [
    { at: 0.4, fn: () => s.trace(['f2', 'c', 'k', 'i', 'p']) },
    { at: 2.8, fn: () => s.trace(['f1', 'a', 'e', 'h', 'p']) },
    { at: 5.0, fn: () => s.trace(['f3', 'd', 'g', 'i', 'p']) },
  ] },
  /* 2 travel */
  { period: 9.5, still: 3.9, script: s => [
    { at: 0.7, fn: () => s.threat('f2', 0, 0) },
    { at: 8.0, fn: () => s.restoreAll() },
  ] },
  /* 3 keystone */
  { period: 6, still: 2.6, keyFocus: true, script: s => [
    { at: 0.3, fn: () => s.lens() },
    { at: 1.7, fn: () => { s.trace(['k', 'h', 'p']); s.trace(['k', 'i', 'p']); } },
    { at: 3.6, fn: () => s.lens() },
  ] },
  /* 4 layers */
  { period: 9, still: 7.5, zoom: 2.05, layers: true, script: s => [
    { at: 0.6, fn: () => s.threat('k', -2.3, 0) },
    { at: 3.3, fn: () => s.threat('k', -0.6, 1) },
    { at: 6.0, fn: () => s.threat('k', 2.6, 2) },
  ] },
  /* 5 walls */
  { period: 9.5, still: 4.6, walls: true, script: s => [
    { at: 0.7, fn: () => s.threat('f1', 0, 0) },
    { at: 8.0, fn: () => s.restoreAll() },
  ] },
  /* 6 way back */
  { period: 10, still: 4.2, script: s => [
    { at: 0.6, fn: () => s.threat('k', -1.2, 0) },
    { at: 3.4, fn: () => s.refill('k', 1.8) },
  ] },
  /* 7 hardest */
  { period: 14.5, still: 9.9, walls: true, layers: true, shields: ['f2', 'f3', 'b', 'd'], script: s => [
    { at: 0.8, fn: () => { s.threat('f1', 0, 0); s.threat('f2', 0.3, 0); s.threat('f3', 0, 0); s.threat('b', -0.4, 0); s.threat('d', 0.3, 0); s.threat('k', 1.4, 0); } },
    { at: 4.0, fn: () => s.refill('f1', 1.6) },
    { at: 8.8, fn: () => s.fan() },
  ] },
];
export const STAGE_CHAPTERS = CHAPTERS.length;

/* two hundred days, seeded: each dips at its own moment by its own depth and comes back at its own pace */
const FAN: number[][] = (() => {
  let a = 0x2f6e2b1;
  const r = () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return Array.from({ length: 200 }, () => {
    const at = 0.1 + r() * 0.5, depth = Math.pow(r(), 1.8) * 0.75, back = 0.08 + r() * 0.5;
    return Array.from({ length: 49 }, (_, j) => {
      const x = j / 48;
      if (x < at) return 1;
      const fall = Math.min(1, (x - at) / 0.04);
      const rise = x > at + 0.04 ? Math.min(1, (x - at - 0.04) / back) : 0;
      return 1 - depth * fall * (1 - ease(rise));
    });
  });
})();

export class Stage {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private host: Element;
  private pal: Pal;
  private w = 0; private h = 0; private dpr = 1;
  private raf = 0; private last = 0;
  private visible = false; private reduced: boolean;
  private ro: ResizeObserver | null = null;
  private mo: MutationObserver | null = null;
  private sprites = new Map<string, HTMLCanvasElement>();

  /* time */
  private t = 0; private chT0 = 0; private ch = 0;
  /** the chapter the reading is on, taken up once it has settled for a moment */
  private pending: number | null = null; private pendingAt = 0;
  /** while the visitor plays, the chapter's script waits until this time */
  private userUntil = -99;
  private userRing = -1;
  /** what follows a visitor's tap: a part brought back, or the whole system restored */
  private timers: { at: number; fn: () => void }[] = [];
  private hover: string | null = null;
  private canHover = false;
  /** when the people's line last began a new day; the new day fades in */
  private lineT0 = -99;
  private events: Ev[] = []; private evI = 0;
  private builtAt = -99;

  /* camera: the box is fitted, then a zoom centres on a point */
  private cam = { x: CENTRE.x, y: CENTRE.y, z: 1 };
  private camFrom = { x: CENTRE.x, y: CENTRE.y, z: 1 };
  private camTo = { x: CENTRE.x, y: CENTRE.y, z: 1 };
  private camT0 = 0;

  /* the system's state */
  private down = new Set<string>();
  private hit = new Set<string>();
  private lv: Record<string, number> = {};
  private people = 1;
  private pulses: Pulse[] = [];
  private threats: Threat[] = [];
  private flashes: Flash[] = [];
  private fills: { id: string; t0: number; dur: number }[] = [];
  private lenses: number[] = [];
  private fanAt = -99;
  /** links a failure has run down, and how far (a wall stops it part way) */
  private failEdge = new Map<number, number>();
  /** the people's links that have gone dark */
  private pLost = new Set<string>();

  /* structure, eased in and out as chapters change */
  private wallsK = 0; private layersK = 0; private focusK = 0;
  private shieldK: Record<string, number> = {};

  /* the trace of light reaching the people */
  private line: number[] = [];
  private traceAt = 0;

  constructor(canvas: HTMLCanvasElement, host: Element) {
    this.canvas = canvas;
    this.host = host;
    this.ctx = canvas.getContext('2d')!;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.pal = readPal(host);
    for (const p of PARTS) this.lv[p.id] = 1;
    this.line = Array.from({ length: 160 }, () => 1);
  }

  start() {
    this.resize();
    this.ro = new ResizeObserver(() => { this.resize(); if (this.reduced || !this.visible) this.draw(); });
    this.ro.observe(this.canvas);
    this.mo = new MutationObserver(() => { this.pal = readPal(this.host); this.sprites.clear(); this.draw(); });
    this.mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('visibilitychange', this.onVis);
    this.canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.canvas.addEventListener('click', this.onClick);
    if (this.canHover) { this.canvas.addEventListener('pointermove', this.onMove); this.canvas.addEventListener('pointerleave', this.onLeave); }
    this.builtAt = this.reduced ? -99 : 0;
    this.enter(0, true);
    this.draw();
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.mo?.disconnect();
    document.removeEventListener('visibilitychange', this.onVis);
    this.canvas.removeEventListener('click', this.onClick);
    this.canvas.removeEventListener('pointermove', this.onMove);
    this.canvas.removeEventListener('pointerleave', this.onLeave);
  }

  /* ---------- the visitor's hand ---------- */

  /** the part under a point on the screen, within a fingertip */
  private partAt(clientX: number, clientY: number): string | null {
    const r = this.canvas.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    const { s, ox, oy } = this.view();
    const S = s * this.cam.z;
    let best: string | null = null, bd = Math.max(24, 16 * S);
    for (const p of PARTS) {
      if (p.kind === 'people') continue;
      if (this.cam.z > 1.2 && p.id !== 'k') continue;
      const d = Math.hypot(ox + (p.x - this.cam.x) * S - x, oy + (p.y - this.cam.y) * S - y);
      if (d < bd) { bd = d; best = p.id; }
    }
    return best;
  }

  private onClick = (e: MouseEvent) => { const id = this.partAt(e.clientX, e.clientY); if (id) this.tap(id); };
  private onMove = (e: PointerEvent) => {
    const id = this.partAt(e.clientX, e.clientY);
    if (id === this.hover) return;
    this.hover = id;
    this.canvas.style.cursor = id ? 'pointer' : '';
  };
  private onLeave = () => { this.hover = null; this.canvas.style.cursor = ''; };

  /** a tap: a threat at a standing part, or a fallen part brought back */
  tap(id: string) {
    if (this.t < this.chT0) return;
    const c = CHAPTERS[this.ch];
    /* the visitor's first tap starts from a sound system: whatever the chapter's script was doing fades out */
    if (this.userUntil < 0) this.resetState(true);
    this.userUntil = this.t + 9;
    if (this.down.has(id)) {
      if (!this.fills.some(f => f.id === id)) this.refill(id, 1.1);
    } else {
      this.userRing = (this.userRing + 1) % RINGS.length;
      this.threat(id, (Math.random() - 0.5) * 0.9, this.userRing);
      const holds = (id === 'k' && !!c.layers) || !!c.shields?.includes(id);
      if (!holds) {
        /* the day goes on: in a chapter with walls or a way back the part refills; elsewhere the system recovers */
        const back = c.walls || this.ch === 6 || this.ch === 7;
        this.timers.push({ at: this.t + (back ? 4.2 : 7), fn: () => {
          if (!this.down.has(id)) return;
          if (back) this.refill(id, 1.6); else this.restoreAll();
        } });
      }
    }
    if (this.reduced) { for (let x = 0; x < 3.4; x += 1 / 30) this.step(1 / 30, true); this.draw(); }
  }

  setVisible(v: boolean) { this.visible = v; if (v) this.loop(); }

  setChapter(i: number) {
    if (i < 0 || i >= CHAPTERS.length) return;
    if (i === this.ch) { this.pending = null; return; }
    if (this.reduced || !this.visible) { this.pending = null; this.enter(i, false); this.draw(); return; }
    /* a fast scroll passes through chapters without the system flickering between them */
    this.pending = i;
    this.pendingAt = this.t;
  }

  private onVis = () => { if (!document.hidden) this.loop(); };

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
  }

  private loop() {
    cancelAnimationFrame(this.raf);
    if (this.reduced) { this.draw(); return; }
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.visible || document.hidden) return;
      this.raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.step(dt);
      this.draw();
    };
    this.raf = requestAnimationFrame(tick);
  }

  /* ---------- the chapters ---------- */

  private enter(i: number, first: boolean) {
    this.ch = i;
    this.chT0 = this.t;
    this.userUntil = -99;
    this.resetState(!first);
    const c = CHAPTERS[i];
    this.camFrom = { ...this.cam };
    this.camTo = c.zoom ? { x: KEY.x, y: KEY.y + 8, z: c.zoom } : { x: CENTRE.x, y: CENTRE.y, z: 1 };
    this.camT0 = this.t;
    this.events = c.script(this).sort((a, b) => a.at - b.at);
    this.evI = 0;
    /* each chapter starts its own day on the line; parts that were down ease back up on their own */
    /* the line starts a clean day; the people's own light still eases back from the last chapter */
    this.line.fill(1);
    this.lineT0 = this.t;
    if (first && !this.reduced) { this.chT0 = this.t + 2.6; this.cam = { ...this.camTo }; }
    if (this.reduced) this.fastForward(c.still);
  }

  /** `soft` when a chapter changes: what is in flight fades where it is, and a failure's wake fades as its part's light returns */
  private resetState(soft = false) {
    if (soft) {
      for (const th of this.threats) if (th.fade === undefined) th.fade = this.t;
      for (const p of this.pulses) if (p.fade === undefined) { p.fade = this.t; p.then = undefined; }
    } else {
      this.threats = []; this.pulses = []; this.failEdge.clear();
    }
    this.down.clear(); this.hit.clear(); this.pLost.clear();
    this.fills = []; this.lenses = []; this.timers = [];
    this.fanAt = -99;
  }

  /** advance a chapter to its still moment without drawing */
  private fastForward(to: number) {
    const c = CHAPTERS[this.ch];
    this.cam = { ...this.camTo };
    this.wallsK = c.walls ? 1 : 0; this.layersK = c.layers ? 1 : 0; this.focusK = c.keyFocus ? 1 : 0;
    for (const p of PARTS) this.shieldK[p.id] = c.shields?.includes(p.id) ? 1 : 0;
    const dt = 1 / 30;
    for (let x = 0; x < to; x += dt) this.step(dt, true);
  }

  /** run the clock and the loop's script */
  private step(dt: number, fast = false) {
    this.t += dt;
    if (this.pending !== null && this.t - this.pendingAt >= 0.16) { const i = this.pending; this.pending = null; if (i !== this.ch) this.enter(i, false); }
    const c = CHAPTERS[this.ch];
    for (const tm of this.timers.filter(x => x.at <= this.t)) tm.fn();
    this.timers = this.timers.filter(x => x.at > this.t);
    if (this.userUntil > 0 && this.t >= this.userUntil) {
      this.userUntil = -99;
      this.resetState(true);
      this.chT0 = this.t + 0.8;
      this.events = c.script(this).sort((a, b) => a.at - b.at);
      this.evI = 0;
    }
    const local = this.t - this.chT0;
    if (local >= 0 && this.userUntil < 0) {
      while (this.evI < this.events.length && this.events[this.evI].at <= local) this.events[this.evI++].fn();
      if (local >= c.period) {
        this.chT0 = this.t;
        this.resetState();
        for (const p of PARTS) this.lv[p.id] = Math.max(this.lv[p.id], 0.999);
        this.events = c.script(this).sort((a, b) => a.at - b.at);
        this.evI = 0;
      }
    }

    /* structure eases in and out */
    const k = 1 - Math.exp(-dt * (fast ? 30 : 3.2));
    this.wallsK += ((c.walls ? 1 : 0) - this.wallsK) * k;
    this.layersK += ((c.layers ? 1 : 0) - this.layersK) * k;
    this.focusK += ((c.keyFocus ? 1 : 0) - this.focusK) * k;
    for (const p of PARTS) { const want = c.shields?.includes(p.id) ? 1 : 0; this.shieldK[p.id] = (this.shieldK[p.id] ?? 0) + (want - (this.shieldK[p.id] ?? 0)) * k; }
    const cp = ease((this.t - this.camT0) / 1.3);
    this.cam = { x: this.camFrom.x + (this.camTo.x - this.camFrom.x) * cp, y: this.camFrom.y + (this.camTo.y - this.camFrom.y) * cp, z: this.camFrom.z + (this.camTo.z - this.camFrom.z) * cp };

    /* pulses arrive */
    const due = this.pulses.filter(p => p.fade === undefined && this.t - p.t0 >= p.dur);
    this.pulses = this.pulses.filter(p => (p.fade !== undefined ? this.t - p.fade < FADE : this.t - p.t0 < p.dur));
    for (const p of due) p.then?.();

    /* threats land */
    for (const th of this.threats) if (th.fade === undefined && th.dur > 0 && this.t - th.t0 >= th.dur) { this.land(th); th.dur = -1; }
    this.threats = this.threats.filter(th => (th.fade !== undefined ? this.t - th.fade < FADE : th.dur > 0));
    this.flashes = this.flashes.filter(f => this.t - f.t0 < 1.6);
    this.lenses = this.lenses.filter(l => this.t - l < 2);

    /* refills: a fallen part fills back up and comes back */
    for (const f of this.fills) if (this.t - f.t0 >= f.dur) this.recover(f.id);
    this.fills = this.fills.filter(f => this.t - f.t0 < f.dur);

    /* each part's light follows its state */
    for (const p of PARTS) {
      if (p.kind === 'people') continue;
      const want = this.down.has(p.id) ? 0.08 : 1;
      const r = want < this.lv[p.id] ? 5 : 2.2;
      this.lv[p.id] += (want - this.lv[p.id]) * (1 - Math.exp(-dt * (fast ? 30 : r)));
    }
    for (const [i] of this.failEdge) { const a = EDGES[i][0]; if (!this.down.has(a) && this.lv[a] > 0.97) this.failEdge.delete(i); }
    const reach = 1 - this.pLost.size / INS.p.length;
    this.people += (reach - this.people) * (1 - Math.exp(-dt * (fast ? 30 : 2.4)));

    /* the trace moves on twenty times a second, and holds while the many days are shown */
    if (this.t - this.traceAt >= 0.05) {
      this.traceAt = this.t;
      if (this.t - this.fanAt > 4.2 || this.t < this.fanAt) { this.line.push(this.t - this.lineT0 < 1.4 ? 1 : this.people); if (this.line.length > 160) this.line.shift(); }
    }
  }

  /* ---------- what happens ---------- */

  private travel(i: number) { const [a, b] = EDGES[i]; return Math.hypot(BY[b].x - BY[a].x, BY[b].y - BY[a].y) / 150; }

  /** a threat sets out toward a part; `ring` says which of the keystone's rings stops it */
  threat(to: string, turn: number, ring: number) {
    const T = BY[to];
    let ax = T.x - CENTRE.x, ay = T.y - CENTRE.y;
    if (Math.hypot(ax, ay) < 30) { ax = 0; ay = -1; }
    const a0 = Math.atan2(ay, ax) + turn;
    const D = 300;
    const c = CHAPTERS[this.ch];
    this.threats.push({ to, t0: this.t, dur: 1.15, ox: T.x + Math.cos(a0) * D, oy: T.y + Math.sin(a0) * D, ring, shield: !!c.shields?.includes(to) });
  }

  private stopPoint(th: Threat): { x: number; y: number; r: number } {
    const T = BY[th.to];
    const c = CHAPTERS[this.ch];
    const dx = th.ox - T.x, dy = th.oy - T.y, d = Math.hypot(dx, dy);
    const r = th.to === 'k' && c.layers ? RINGS[th.ring] : th.shield ? 21 : (T.kind === 'key' ? 9 : 7);
    return { x: T.x + (dx / d) * r, y: T.y + (dy / d) * r, r };
  }

  private land(th: Threat) {
    const T = BY[th.to];
    const c = CHAPTERS[this.ch];
    const sp = this.stopPoint(th);
    const ang = Math.atan2(sp.y - T.y, sp.x - T.x);
    if (th.to === 'k' && c.layers) {
      this.flashes.push({ x: T.x, y: T.y, t0: this.t, kind: 'ring', ang, r: RINGS[th.ring] });
      for (let j = 0; j < th.ring; j++) this.flashes.push({ x: T.x, y: T.y, t0: this.t - 0.25 * (th.ring - j), kind: 'ring', ang, r: RINGS[j] });
      this.ripple(sp.x, sp.y, 'held');
    } else if (th.shield) {
      this.flashes.push({ x: T.x, y: T.y, t0: this.t, kind: 'shield', ang, r: 21 });
      this.ripple(sp.x, sp.y, 'held');
    } else {
      this.flashes.push({ x: T.x, y: T.y, t0: this.t, kind: 'hit' });
      this.hit.add(th.to);
      this.fail(th.to);
      this.ripple(T.x, T.y, 'hit');
    }
  }

  private fail(id: string) {
    if (this.down.has(id) || id === 'p') return;
    this.down.add(id);
    for (const i of OUTS[id]) {
      const to = EDGES[i][1];
      const gate = GATES[i];
      if (gate && CHAPTERS[this.ch].walls) {
        const A = BY[id];
        const part = Math.hypot(gate.x - A.x, gate.y - A.y) / Math.hypot(BY[to].x - A.x, BY[to].y - A.y);
        this.pulses.push({ e: i, t0: this.t, dur: this.travel(i) * part, kind: 'fail', then: () => { if (this.down.has(id)) this.failEdge.set(i, part); this.flashes.push({ x: gate.x, y: gate.y, t0: this.t, kind: 'gate', ang: gate.ang }); } });
      } else {
        this.pulses.push({ e: i, t0: this.t, dur: this.travel(i), kind: 'fail', then: () => { if (!this.down.has(id)) return; this.failEdge.set(i, 1); if (to === 'p') this.pLost.add(id); else this.fail(to); } });
      }
    }
  }

  private recover(id: string) {
    if (!this.down.has(id)) return;
    this.down.delete(id);
    this.hit.delete(id);
    for (const i of OUTS[id]) {
      const to = EDGES[i][1];
      this.pulses.push({ e: i, t0: this.t, dur: this.travel(i) * 0.8, kind: 'up', then: () => {
        if (to === 'p') { this.pLost.delete(id); return; }
        if (this.down.has(to) && !this.hit.has(to) && INS[to].every(j => !this.down.has(EDGES[j][0]))) this.recover(to);
      } });
    }
  }

  /** a fallen part fills back up over `dur` seconds, then comes back */
  refill(id: string, dur: number) { if (this.down.has(id)) this.fills.push({ id, t0: this.t, dur }); }

  restoreAll() { this.down.clear(); this.hit.clear(); this.pLost.clear(); for (const p of this.pulses) if (p.kind === 'fail' && p.fade === undefined) { p.fade = this.t; p.then = undefined; } }

  /** a bright signal runs a chain of links, one after the other */
  trace(chain: string[]) {
    const run = (j: number) => {
      if (j >= chain.length - 1) return;
      const i = EDGES.findIndex(([a, b]) => a === chain[j] && b === chain[j + 1]);
      if (i < 0) return;
      this.pulses.push({ e: i, t0: this.t, dur: this.travel(i) * 0.55, kind: 'trace', then: () => run(j + 1) });
    };
    run(0);
  }

  lens() { this.lenses.push(this.t); }
  fan() { this.fanAt = this.t; }

  /* ---------- the page's lattice answers ---------- */

  private ripple(x: number, y: number, kind: 'hit' | 'held') {
    if (this.reduced || !this.visible) return;
    const r = this.canvas.getBoundingClientRect();
    const { s, ox, oy } = this.view();
    const sx = r.left + ox + (x - this.cam.x) * s * this.cam.z, sy = r.top + oy + (y - this.cam.y) * s * this.cam.z;
    if (sy < -40 || sy > window.innerHeight + 40) return;
    Field.pulse({ x: sx, y: sy }, kind === 'hit' ? '#e8786a' : '#d8effc', 'note');
  }

  /* ---------- drawing ---------- */

  /** the fitted scale and the screen point the camera's centre lands on */
  private view() {
    const band = Math.min(70, this.h * 0.14);
    const pad = Math.min(28, this.w * 0.05);
    const s = Math.min((this.w - pad * 2) / (BOX.x1 - BOX.x0), (this.h - band - pad * 2) / (BOX.y1 - BOX.y0));
    const ox = this.w / 2 + (CENTRE.x - (BOX.x0 + BOX.x1) / 2) * s;
    const oy = pad + (this.h - band - pad * 2) / 2 + (CENTRE.y - (BOX.y0 + BOX.y1) / 2) * s;
    return { s, ox, oy, band };
  }

  private glow(c: RGB): HTMLCanvasElement {
    const key = c.join(',') + (this.pal.light ? 'L' : 'D');
    let g = this.sprites.get(key);
    if (g) return g;
    g = document.createElement('canvas');
    g.width = g.height = 64;
    const x = g.getContext('2d')!;
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, rgba(c, this.pal.light ? 0.5 : 0.9));
    gr.addColorStop(0.25, rgba(c, this.pal.light ? 0.22 : 0.42));
    gr.addColorStop(1, rgba(c, 0));
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
    this.sprites.set(key, g);
    return g;
  }

  private dot(x: number, y: number, r: number, c: RGB, a: number, glowR = 0) {
    const ctx = this.ctx;
    if (glowR > 0 && a > 0.02) { ctx.globalAlpha = a; ctx.drawImage(this.glow(c), x - glowR, y - glowR, glowR * 2, glowR * 2); ctx.globalAlpha = 1; }
    ctx.fillStyle = rgba(c, a);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  private draw() {
    const ctx = this.ctx, P = this.pal;
    if (!this.w) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    const { s, ox, oy, band } = this.view();
    const z = this.cam.z, S = s * z;
    /* world to screen */
    const X = (x: number) => ox + (x - this.cam.x) * S, Y = (y: number) => oy + (y - this.cam.y) * S;
    const px = (n: number) => n * Math.max(0.8, Math.min(1.25, s));
    const t = this.t;
    const built = this.reduced ? 99 : this.t - this.builtAt;
    const appear = (p: Part) => ease((built - 0.15 - (p.y / 520) * 1.5) / 0.5);
    const focusDim = (id: string) => 1 - this.focusK * (id === 'k' || id === 'h' || id === 'i' || id === 'p' ? 0 : 0.55);
    const zoomDim = (id: string) => (z > 1.2 ? (id === 'k' ? 1 : Math.max(0.15, 1 - (z - 1) * 0.8)) : 1);
    const ink = P.ink;

    /* walls: the cells, as quiet rounded fields */
    if (this.wallsK > 0.01) {
      CELLS.forEach(c => {
        const x0 = X(c.x0), y0 = Y(c.y0), x1 = X(c.x1), y1 = Y(c.y1), r = 22 * S;
        ctx.beginPath();
        ctx.roundRect(x0, y0, x1 - x0, y1 - y0, r);
        ctx.fillStyle = rgba(P.violet, (P.light ? 0.06 : 0.05) * this.wallsK);
        ctx.fill();
        ctx.strokeStyle = rgba(P.violet, (P.light ? 0.45 : 0.42) * this.wallsK);
        ctx.lineWidth = px(1.2);
        ctx.stroke();
      });
    }

    /* links: the line, its service, and what moves along it */
    EDGES.forEach(([a, b], i) => {
      const A = BY[a], B = BY[b];
      const reveal = clamp01((built - 0.5 - (A.y / 520) * 1.5) / 0.6);
      if (reveal <= 0) return;
      const x1 = X(A.x), y1 = Y(A.y), x2 = X(A.x + (B.x - A.x) * reveal), y2 = Y(A.y + (B.y - A.y) * reveal);
      const dim = Math.min(focusDim(a), focusDim(b)) * Math.min(zoomDim(a), zoomDim(b));
      const keyLink = this.focusK > 0.01 && (a === 'k' || b === 'k');
      ctx.strokeStyle = keyLink ? rgba(P.amber, 0.32 + 0.4 * this.focusK) : rgba(ink, (P.light ? 0.22 : 0.15) * dim);
      ctx.lineWidth = px(keyLink ? 1.6 : 1.1);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const wake = this.failEdge.get(i);
      const wa = wake === undefined ? 0 : clamp01((1 - this.lv[a]) / 0.9);
      if (wake !== undefined && wa > 0.01) {
        ctx.strokeStyle = rgba(P.coral, 0.62 * dim * wa);
        ctx.lineWidth = px(1.6);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(X(A.x + (B.x - A.x) * wake), Y(A.y + (B.y - A.y) * wake)); ctx.stroke();
      }
      /* service: two small lights on every live link, moving down at a steady pace */
      if (reveal >= 1) {
        const up = this.lv[a] * (a === 'p' ? 0 : 1);
        if (up > 0.15) {
          for (let k = 0; k < 2; k++) {
            const f = (t * 0.32 + i * 0.137 + k * 0.5) % 1;
            const col = b === 'p' ? P.amber : k ? P.violet : P.ice;
            this.dot(X(A.x + (B.x - A.x) * f), Y(A.y + (B.y - A.y) * f), px(1.6), col, 0.85 * up * dim * (0.6 + 0.4 * Math.sin(f * Math.PI)), px(7));
          }
        }
      }
    });

    /* moving signals: a failure (coral, with its wake), a recovery (pearl), a trace (bright) */
    for (const p of this.pulses) {
      const fa = p.fade === undefined ? 1 : clamp01(1 - (t - p.fade) / FADE);
      const [a, b] = EDGES[p.e];
      const A = BY[a], B = BY[b];
      const full = p.kind === 'fail' ? Math.hypot(B.x - A.x, B.y - A.y) / 150 : 0;
      const f = clamp01((t - p.t0) / (p.kind === 'fail' ? Math.max(p.dur, 0.0001) : p.dur));
      const reach = p.kind === 'fail' ? (p.dur / Math.max(full, 0.0001)) * f : f;
      const x = A.x + (B.x - A.x) * reach, y = A.y + (B.y - A.y) * reach;
      const col = p.kind === 'fail' ? P.coral : p.kind === 'up' ? P.pearl : P.pearl;
      if (p.kind === 'fail') {
        ctx.strokeStyle = rgba(P.coral, 0.85 * fa);
        ctx.lineWidth = px(1.8);
        ctx.beginPath(); ctx.moveTo(X(A.x), Y(A.y)); ctx.lineTo(X(x), Y(y)); ctx.stroke();
      }
      this.dot(X(x), Y(y), px(p.kind === 'trace' ? 2.6 : 2.4), col, fa, px(p.kind === 'trace' ? 16 : 12));
    }

    /* the keystone's layers */
    if (this.layersK > 0.01) {
      RINGS.forEach((r, j) => {
        const col = [P.azure, P.violet, P.orchid][j];
        ctx.strokeStyle = rgba(col, (0.55 - j * 0.06) * this.layersK);
        ctx.lineWidth = px(1.3);
        ctx.setLineDash(j === 0 ? [px(2), px(5)] : []);
        ctx.beginPath(); ctx.arc(X(KEY.x), Y(KEY.y), r * S * (0.85 + 0.15 * this.layersK), 0, Math.PI * 2); ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    /* single rings: a part's own layer */
    for (const p of PARTS) {
      const k = this.shieldK[p.id] || 0;
      if (k < 0.01) continue;
      ctx.strokeStyle = rgba(P.azure, 0.36 * k);
      ctx.lineWidth = px(1.1);
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 21 * S, 0, Math.PI * 2); ctx.stroke();
    }

    /* the part under the pointer */
    if (this.hover && !this.reduced) {
      const hp = BY[this.hover];
      ctx.strokeStyle = rgba(this.down.has(this.hover) ? P.pearl : P.ice, 0.55);
      ctx.lineWidth = px(1.2);
      ctx.setLineDash([px(2), px(3)]);
      ctx.beginPath(); ctx.arc(X(hp.x), Y(hp.y), (hp.kind === 'key' ? 17 : 13) * S, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }

    /* the lens: a ring that closes on the keystone */
    for (const l0 of this.lenses) {
      const f = clamp01((t - l0) / 1.6);
      const r = (150 - 128 * ease(f)) * S;
      ctx.strokeStyle = rgba(P.amber, 0.7 * Math.sin(f * Math.PI));
      ctx.lineWidth = px(1.4);
      ctx.beginPath(); ctx.arc(X(KEY.x), Y(KEY.y), r, 0, Math.PI * 2); ctx.stroke();
    }

    /* refills: an arc that closes around the fallen part */
    for (const f of this.fills) {
      const q = clamp01((t - f.t0) / f.dur);
      const P0 = BY[f.id];
      ctx.strokeStyle = rgba(P.pearl, 0.9);
      ctx.lineWidth = px(2);
      ctx.beginPath(); ctx.arc(X(P0.x), Y(P0.y), 15 * S, -Math.PI / 2, -Math.PI / 2 + q * Math.PI * 2); ctx.stroke();
    }

    /* the parts */
    for (const p of PARTS) {
      const ap = appear(p);
      if (ap <= 0) continue;
      const dim = focusDim(p.id) * zoomDim(p.id);
      const x = X(p.x), y = Y(p.y);
      if (p.kind === 'people') {
        const l = this.people;
        const r = px(10) * (0.6 + 0.4 * ap);
        this.dot(x, y, r, P.amber, (0.35 + 0.65 * l) * ap * dim, px(28 + 30 * l) * ap);
        ctx.strokeStyle = rgba(P.amber, 0.5 * ap * dim);
        ctx.lineWidth = px(1.2);
        ctx.beginPath(); ctx.arc(x, y, r + px(7), 0, Math.PI * 2); ctx.stroke();
        continue;
      }
      const l = this.lv[p.id];
      const key = p.kind === 'key';
      const base = key ? (this.focusK > 0.5 || this.ch >= 3 ? P.amber : P.pearl) : p.kind === 'base' ? P.azure : P.violet;
      /* lit is its own colour with its glow; fallen is coral with a ring; between, it passes from one to the other */
      const q = ease(clamp01((l - 0.15) / 0.75));
      const r = px(key ? 7.5 + 3 * this.focusK : p.kind === 'base' ? 5.5 : 5) * S / s * (0.5 + 0.5 * ap);
      const a = (0.55 + 0.45 * q) * ap * dim;
      const gr = px(key ? 26 : 18) * S / s;
      if (q > 0.02) { ctx.globalAlpha = a * q; ctx.drawImage(this.glow(base), x - gr, y - gr, gr * 2, gr * 2); ctx.globalAlpha = 1; }
      ctx.fillStyle = rgba(mixRGB(P.coral, base, q), a);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      if (q < 0.98) { ctx.strokeStyle = rgba(P.coral, 0.75 * (1 - q) * ap * dim); ctx.lineWidth = px(1.2); ctx.beginPath(); ctx.arc(x, y, r + px(3), 0, Math.PI * 2); ctx.stroke(); }
      if (key && q > 0.02) { ctx.fillStyle = rgba(P.pearl, a * q); ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, Math.PI * 2); ctx.fill(); }
    }

    /* threats on their way in */
    for (const th of this.threats) {
      const fa = th.fade === undefined ? 1 : clamp01(1 - (t - th.fade) / FADE);
      const f = easeIn(clamp01((t - th.t0) / th.dur));
      const sp = this.stopPoint(th);
      const x = th.ox + (sp.x - th.ox) * f, y = th.oy + (sp.y - th.oy) * f;
      const tx = th.ox + (sp.x - th.ox) * Math.max(0, f - 0.12), ty = th.oy + (sp.y - th.oy) * Math.max(0, f - 0.12);
      const g = ctx.createLinearGradient(X(tx), Y(ty), X(x), Y(y));
      g.addColorStop(0, rgba(P.coral, 0));
      g.addColorStop(1, rgba(P.coral, 0.9 * fa));
      ctx.strokeStyle = g;
      ctx.lineWidth = px(2);
      ctx.beginPath(); ctx.moveTo(X(tx), Y(ty)); ctx.lineTo(X(x), Y(y)); ctx.stroke();
      this.dot(X(x), Y(y), px(3), P.coral, fa, px(16));
    }

    /* flashes: a layer holding, a part hit, a wall's gate closing */
    for (const fl of this.flashes) {
      const f = clamp01((t - fl.t0) / 1.4);
      if (t < fl.t0) continue;
      const x = X(fl.x), y = Y(fl.y);
      if (fl.kind === 'hit') {
        ctx.strokeStyle = rgba(P.coral, 0.8 * (1 - f));
        ctx.lineWidth = px(1.6);
        ctx.beginPath(); ctx.arc(x, y, (8 + 40 * ease(f)) * S, 0, Math.PI * 2); ctx.stroke();
      } else if (fl.kind === 'ring' || fl.kind === 'shield') {
        const a = fl.ang || 0, r = (fl.r || 20) * S;
        ctx.strokeStyle = rgba(fl.kind === 'ring' ? P.pearl : P.ice, 0.95 * (1 - f));
        ctx.lineWidth = px(2.6);
        ctx.beginPath(); ctx.arc(x, y, r, a - 0.5 - f * 0.5, a + 0.5 + f * 0.5); ctx.stroke();
        this.dot(x + Math.cos(a) * r, y + Math.sin(a) * r, px(2.4), P.pearl, 1 - f, px(18));
      } else {
        const a = (fl.ang || 0) + Math.PI / 2, L = 11 * S;
        ctx.strokeStyle = rgba(P.amber, 1 - f * 0.6);
        ctx.lineWidth = px(2.6);
        ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * L, y - Math.sin(a) * L); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
        this.dot(x, y, px(2), P.amber, 1 - f, px(16));
      }
    }

    /* gates on every link that crosses a wall */
    if (this.wallsK > 0.01) {
      GATES.forEach(gt => {
        if (!gt) return;
        const a = gt.ang + Math.PI / 2, L = 7 * S;
        ctx.strokeStyle = rgba(P.amber, 0.75 * this.wallsK);
        ctx.lineWidth = px(1.6);
        ctx.beginPath(); ctx.moveTo(X(gt.x) - Math.cos(a) * L, Y(gt.y) - Math.sin(a) * L); ctx.lineTo(X(gt.x) + Math.cos(a) * L, Y(gt.y) + Math.sin(a) * L); ctx.stroke();
      });
    }

    /* the people's line: how much of the service reaches them, newest on the right */
    const fan = this.t - this.fanAt;
    const fa = fan >= 0 && fan < 5.2 ? ease(Math.min(1, fan / 0.9)) * ease(Math.min(1, (5.2 - fan) / 0.9)) : 0;
    const bx0 = this.w * 0.14, bx1 = this.w * 0.86, by1 = this.h - band * 0.26, by0 = by1 - band * (0.5 + 0.62 * fa);
    const yOf = (v: number) => by1 - (by1 - by0) * v;
    if (fa > 0.01) {
      /* two hundred more days: each leaves the line at its own hour, falls as far as it falls, and comes back */
      ctx.lineWidth = 1;
      for (const line of FAN) {
        let j0 = line.findIndex(v => v < 0.999);
        if (j0 < 0) continue;
        let j1 = line.length - 1;
        while (j1 > j0 && line[j1] >= 0.999) j1--;
        j0 = Math.max(0, j0 - 1); j1 = Math.min(line.length - 1, j1 + 1);
        const depth = 1 - Math.min(...line);
        ctx.strokeStyle = rgba(depth > 0.45 ? P.coral : depth > 0.18 ? P.violet : P.azure, (P.light ? 0.16 : 0.14) * fa);
        ctx.beginPath();
        for (let j = j0; j <= j1; j++) { const x = bx0 + (bx1 - bx0) * (j / 48); if (j === j0) ctx.moveTo(x, yOf(line[j])); else ctx.lineTo(x, yOf(line[j])); }
        ctx.stroke();
      }
      ctx.strokeStyle = rgba(P.ink, 0.18 * fa);
      ctx.beginPath(); ctx.moveTo(bx0, yOf(1)); ctx.lineTo(bx1, yOf(1)); ctx.stroke();
    }
    const n = this.line.length;
    const la = ease(clamp01((t - this.lineT0) / 0.9));
    ctx.lineJoin = 'round';
    for (const [w, a] of [[px(5), P.light ? 0.12 : 0.16], [px(1.6), 0.95]] as const) {
      const g = ctx.createLinearGradient(bx0, 0, bx1, 0);
      g.addColorStop(0, rgba(P.amber, 0));
      g.addColorStop(0.25, rgba(P.amber, a * 0.7 * la));
      g.addColorStop(1, rgba(P.pearl, a * la));
      ctx.strokeStyle = g;
      ctx.lineWidth = w;
      ctx.beginPath();
      this.line.forEach((v, j) => { const x = bx0 + (bx1 - bx0) * (j / (n - 1)); if (j) ctx.lineTo(x, yOf(v)); else ctx.moveTo(x, yOf(v)); });
      ctx.stroke();
    }
    this.dot(bx1, yOf(this.line[n - 1]), px(2.6), P.pearl, la, px(14));
  }
}
