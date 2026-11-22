/* THE FIELD: the one steady lattice behind every page.

   A grid of dots that stays where it is, breathing with a slow wave. Now and
   then a signal crosses it in a straight line and the dots it passes light
   for a breath, so the page reads as a system with information moving through
   it. When something of consequence happens (a Step sealed, a Page earned, a
   Chapter locked in, a view arriving) a ripple runs out from where it happened.
   Nothing gathers into a shape, nothing follows the pointer, and under reduced
   motion the lattice is drawn once and left still.

   Budget: one canvas, the pixel ratio capped at 1.5, drawn at thirty frames a
   second only while the tab is visible, with a pre-rendered dot so a frame is
   a few thousand image draws. */

const SPACING = 30;
/* by day the dots sit on the seed of life engraved in the ground (styles/sacred.css): a triangular
   lattice of spacing R from the top left of the screen, rows ROW apart, every other row offset by half */
const R = 30;
const ROW = R * Math.sqrt(3) / 2;
const INK: [number, number, number] = [58, 40, 130];
const DAY_SIGNALS: [number, number, number][] = [[116, 68, 238], [201, 150, 46]];
const FPS_GAP = 1000 / 30;

type Weight = 'note' | 'mark' | 'seal' | 'emergence';
const REACH: Record<Weight, number> = { note: 260, mark: 420, seal: 640, emergence: 900 };

interface Ripple { x: number; y: number; t0: number; reach: number; rgb: [number, number, number] }
interface Signal { x0: number; y0: number; x1: number; y1: number; t0: number; dur: number; rgb: [number, number, number] }

function hexToRgb(hex: string): [number, number, number] {
  const h = (hex || '#a78bff').replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

class FieldEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private raf = 0;
  private started = false;
  private paused = false;
  private reduced = false;
  private light = false;
  private rgb: [number, number, number] = hexToRgb('#a78bff');
  private w = 0;
  private h = 0;
  private dpr = 1;
  private t0 = performance.now();
  private last = 0;
  private ripples: Ripple[] = [];
  private signals: Signal[] = [];
  private nextSignal = 0;
  private sprite: HTMLCanvasElement | null = null;
  private spriteRgb = '';
  /** a few out-of-focus lights in the air: small, rimmed, drifting a little */
  private discs: { x: number; y: number; r: number; ph: number; k: number }[] = [];

  start() {
    if (this.started) return;
    this.canvas = document.getElementById('field') as HTMLCanvasElement | null;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;
    this.started = true;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVis);
    this.loop();
  }

  stop() {
    this.started = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVis);
  }

  /** the world covers the page; the field rests until it closes */
  pause() { this.paused = true; }
  resume() { this.paused = false; }

  setLight(on: boolean) { this.light = on; this.sprite = null; if (this.reduced) this.draw(0); }

  /** the coloured air rests while a view of close-set glass cells is open (the model table), where its rims show
      through the cells as marks; each hold is released when its view closes */
  private airHolds = 0;
  holdAir() { this.airHolds++; if (this.reduced) this.draw(0); }
  releaseAir() { this.airHolds = Math.max(0, this.airHolds - 1); if (this.reduced) this.draw(0); }

  /** the colour of the lattice: the view's essence */
  setHue(hex?: string) { this.rgb = hexToRgb(hex || '#a78bff'); this.sprite = null; if (this.reduced) this.draw(0); }

  /** a ripple from where something happened; the centre of the page when nowhere is given */
  pulse(at?: { x: number; y: number }, hex?: string, weight: Weight = 'mark') {
    if (!this.started || this.reduced) return;
    const x = at ? at.x : this.w * 0.58, y = at ? at.y : Math.min(this.h * 0.4, window.scrollY > 0 ? this.h * 0.3 : this.h * 0.4);
    this.ripples.push({ x, y, t0: (performance.now() - this.t0) / 1000, reach: REACH[weight], rgb: hex ? hexToRgb(hex) : this.rgb });
    if (this.ripples.length > 4) this.ripples.shift();
  }

  private onResize = () => this.resize();
  private onVis = () => { if (!document.hidden) this.loop(); };

  private resize() {
    if (!this.canvas) return;
    this.dpr = Math.min(1.5, window.devicePixelRatio || 1);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    if (!this.discs.length) this.discs = Array.from({ length: 5 }, (_, i) => ({ x: 0.08 + Math.random() * 0.84, y: 0.3 + Math.random() * 0.62, r: 12 + Math.random() * 18, ph: Math.random() * 6.283, k: i % 3 }));
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.reduced) this.draw(0);
  }

  private loop() {
    cancelAnimationFrame(this.raf);
    if (this.reduced) { this.draw(0); return; }
    const tick = (ms: number) => {
      if (!this.started) return;
      this.raf = requestAnimationFrame(tick);
      if (document.hidden || this.paused || ms - this.last < FPS_GAP) return;
      this.last = ms;
      this.draw((ms - this.t0) / 1000);
    };
    this.raf = requestAnimationFrame(tick);
  }

  /** one dot, drawn once, so a frame is image draws */
  private dot(): HTMLCanvasElement {
    const key = this.rgb.join(',') + (this.light ? 'L' : 'D');
    if (this.sprite && this.spriteRgb === key) return this.sprite;
    const s = 16;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d')!;
    const [r, gg, b] = this.light ? INK : this.rgb;
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, 'rgba(' + r + ',' + gg + ',' + b + ',1)');
    grad.addColorStop(0.45, 'rgba(' + r + ',' + gg + ',' + b + ',0.9)');
    grad.addColorStop(1, 'rgba(' + r + ',' + gg + ',' + b + ',0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    this.sprite = c;
    this.spriteRgb = key;
    return c;
  }

  private draw(t: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.w, this.h);
    const sprite = this.dot();
    const base = this.light ? 0.2 : 0.2;

    /* the coloured air: five out-of-focus lights, a faint fill and a brighter rim, drifting slowly. Wide screens
       only: on a phone they sit in the reading space and read as marks on the glass */
    if (!this.light && this.w >= 900 && this.airHolds === 0) {
      for (const dsc of this.discs) {
        const x = dsc.x * this.w + Math.sin(t * 0.05 + dsc.ph) * 22, y = dsc.y * this.h + Math.cos(t * 0.04 + dsc.ph) * 16;
        const c = dsc.k === 0 ? [216, 239, 252] : dsc.k === 1 ? this.rgb : [241, 138, 198];
        const col = c[0] + ',' + c[1] + ',' + c[2];
        const g = ctx.createRadialGradient(x, y, 0, x, y, dsc.r);
        g.addColorStop(0, 'rgba(' + col + ',0.02)');
        g.addColorStop(0.82, 'rgba(' + col + ',0.035)');
        g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, dsc.r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(' + col + ',0.11)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, dsc.r - 1, 0, Math.PI * 2); ctx.stroke();
      }
    }

    /* a signal sets out now and then, in a straight line across the page */
    if (!this.reduced && t > this.nextSignal) {
      const side = Math.floor(Math.random() * 4);
      const edge = (k: number) => (side === 0 ? { x: Math.random() * this.w, y: -20 } : side === 1 ? { x: this.w + 20, y: Math.random() * this.h } : side === 2 ? { x: Math.random() * this.w, y: this.h + 20 } : { x: -20, y: Math.random() * this.h });
      const a = edge(0);
      const b = { x: this.w - a.x + (Math.random() - 0.5) * this.w * 0.5, y: this.h - a.y + (Math.random() - 0.5) * this.h * 0.5 };
      this.signals.push({ x0: a.x, y0: a.y, x1: b.x, y1: b.y, t0: t, dur: 1.6 + Math.random() * 0.8, rgb: this.light ? DAY_SIGNALS[Math.random() < 0.6 ? 0 : 1] : Math.random() < 0.7 ? [216, 239, 252] : this.rgb });
      this.nextSignal = t + 2.6 + Math.random() * 3;
    }
    this.signals = this.signals.filter(s => t - s.t0 < s.dur + 0.4);
    this.ripples = this.ripples.filter(r => t - r.t0 < 2.6);

    const day = this.light;
    const cols = day ? Math.ceil(this.w / R) + 2 : Math.ceil(this.w / SPACING) + 1;
    const rows = day ? Math.ceil(this.h / ROW) + 1 : Math.ceil(this.h / SPACING) + 1;
    const ox = day ? 0 : (this.w % SPACING) / 2, oy = day ? 0 : (this.h % SPACING) / 2;
    for (let j = 0; j < rows; j++) {
      const y = day ? j * ROW : oy + j * SPACING;
      for (let i = 0; i < cols; i++) {
        const x = day ? i * R + (j % 2 ? R / 2 : 0) : ox + i * SPACING;
        /* the wave: slow, two directions, never still */
        let a = base * (0.5 + 0.5 * Math.sin(x * 0.011 + t * 0.45) * Math.sin(y * 0.009 - t * 0.32));
        let size = 3.2;
        let lit: [number, number, number] | null = null;
        let litK = 0;
        for (const r of this.ripples) {
          const age = t - r.t0;
          const d = Math.hypot(x - r.x, y - r.y);
          const k = Math.exp(-Math.pow((d - age * r.reach * 0.42) / 46, 2)) * (1 - age / 2.6);
          if (k > 0.02) { a += k * 0.8; size += k * 3; if (k > litK) { litK = k; lit = r.rgb; } }
        }
        for (const s of this.signals) {
          const p = Math.min(1, (t - s.t0) / s.dur);
          const hx = s.x0 + (s.x1 - s.x0) * p, hy = s.y0 + (s.y1 - s.y0) * p;
          const d = Math.hypot(x - hx, y - hy);
          if (d > 90) continue;
          const k = Math.exp(-(d * d) / 1400) * (p < 1 ? 1 : Math.max(0, 1 - (t - s.t0 - s.dur) / 0.4));
          if (k > 0.03) { a += k * 0.9; size += k * 2.4; if (k > litK) { litK = k; lit = s.rgb; } }
        }
        if (a < 0.015) continue;
        ctx.globalAlpha = Math.min(1, a);
        if (lit && litK > 0.25) {
          ctx.fillStyle = 'rgba(' + lit[0] + ',' + lit[1] + ',' + lit[2] + ',1)';
          ctx.beginPath();
          ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
        }
      }
    }
    ctx.globalAlpha = 1;
  }
}

export const Field = new FieldEngine();
