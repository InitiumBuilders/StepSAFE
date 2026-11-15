/* THE SWARM — the witness.

   It is not ambient. It is not decoration, and it does not follow you around.
   The swarm is DORMANT by default: no particles, no canvas draw, no animation
   frame running at all. It manifests only when something of consequence has
   actually happened — a Step sealed, a Page earned, a Chapter locked, an award
   landed, a specialist taking their seat, the unit itself evolving — holds for
   a beat, and dissolves.

   Statement: if the light appears for everything, it means nothing. Presence is
   the reward, so it has to be spent carefully. A learner should be able to read
   an entire chapter in complete stillness, and should look up when it arrives.

   Craft budget: <=190 particles desktop / <=100 mobile, DPR capped at 2, O(N)
   forces with sampled separation, rAF running ONLY while presence > 0 and the
   tab is visible. Reduced motion: it never manifests; callers get the toast and
   the state change, which carry the same information. */

type Vec = { x: number; y: number };

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  hueOff: number;
  size: number;
  phase: number;
  u: number;      // stable slot in [0,1)
  life: number;   // 0..1, own fade so the swarm dissolves unevenly like a real flock
}

import { Field } from './field';

const TAU = Math.PI * 2;

/* Retired. Particle swarms are out for good; nothing manifests. The API stays
   so callers compile, and the canvas stays empty. */
const RETIRED = true;

/** How consequential a manifestation is. Drives count, radius, hold and reach. */
export type Weight = 'note' | 'mark' | 'seal' | 'emergence';

const WEIGHT: Record<Weight, { n: number; hold: number; power: number; r: number }> = {
  /* a clean drill, a guide finished — brief, small, easy to miss on purpose */
  note: { n: 46, hold: 0.7, power: 2.2, r: 92 },
  /* an award, a Page — unmistakable but short */
  mark: { n: 96, hold: 1.5, power: 3.6, r: 140 },
  /* a Chapter locked in, a specialist joining — the room changes */
  seal: { n: 150, hold: 2.6, power: 5.0, r: 190 },
  /* the unit evolving, Sevas arriving — once in a journey */
  emergence: { n: 190, hold: 4.2, power: 6.4, r: 240 },
};

function hexToRgb(hex: string): [number, number, number] {
  const h = (hex || '#a78bff').replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

class SwarmEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private ps: Particle[] = [];
  private raf = 0;
  private started = false;
  private t = 0;

  /** 0 = fully dormant. Nothing draws, nothing animates. */
  private presence = 0;
  private holdT = 0;
  private centre: Vec = { x: 0, y: 0 };
  private ringR = 140;
  private hue: [number, number, number] = hexToRgb('#a78bff');
  /** hue the NEXT manifestation will use — set by the view, never summons on its own */
  private pendingHue = '#a78bff';
  private light = false;
  private reduced = false;

  start() {
    if (this.started) return;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const c = document.getElementById('swarm') as HTMLCanvasElement | null;
    if (!c) return;
    this.canvas = c;
    this.ctx = c.getContext('2d');
    if (!this.ctx) return;
    this.resize();
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.onVis);
    this.started = true;
    /* deliberately no loop() here — dormant until something earns it */
  }

  stop() {
    this.started = false;
    this.presence = 0;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.onVis);
    this.clear();
  }

  setLight(light: boolean) { this.light = light; }

  /** Views declare their essence hue. This NEVER manifests anything — it only
      decides what colour the next real moment will be. */
  setHue(hueHex?: string) { if (hueHex) this.pendingHue = hueHex; }

  /**
   * Manifest. Call this only when something consequential actually happened.
   * @param weight how much it mattered — see Weight
   * @param at screen point it radiates from; defaults to centre of viewport
   */
  summon(weight: Weight = 'mark', at?: Vec, hueHex?: string) {
    /* the field is the witness now: a ripple from where it happened */
    Field.pulse(at, hueHex, weight);
    if (RETIRED || !this.started || this.reduced) return;
    if (hueHex) this.pendingHue = hueHex;
    const cfg = WEIGHT[weight];
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const n = Math.round(cfg.n * (vw >= 780 ? 1 : 0.58));

    this.hue = hexToRgb(this.pendingHue);
    this.centre = at || { x: vw / 2, y: vh * 0.42 };
    this.centre.x = Math.max(80, Math.min(vw - 80, this.centre.x));
    this.centre.y = Math.max(80, Math.min(vh - 80, this.centre.y));
    this.ringR = cfg.r;
    this.holdT = cfg.hold;
    this.presence = 1;

    /* seed at the point of consequence and bloom outward — the origin is the
       thing the learner just did, so the light comes out of their own action */
    this.ps = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * TAU + Math.random() * 0.3;
      const speed = cfg.power * (0.55 + Math.random() * 0.75);
      return {
        x: this.centre.x + Math.cos(a) * 6,
        y: this.centre.y + Math.sin(a) * 6,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        hueOff: (Math.random() - 0.5) * 46,
        size: 1.5 + Math.random() * 2,
        phase: Math.random() * TAU,
        u: i / n,
        life: 0.82 + Math.random() * 0.18,
      };
    });

    if (!this.raf) this.loop();
  }

  /* ---- compatibility surface: existing callers keep working, but every path
     now routes through summon() so nothing can manifest by accident ---- */

  /** A moment of consequence at a point. */
  burst(x: number, y: number, power = 1) {
    this.summon(power >= 1.5 ? 'seal' : 'mark', { x, y });
  }

  /** The screen-level events: evolution, emergence. */
  startle() { this.summon('emergence'); }

  private resize = () => {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    /* clientWidth, not innerWidth: innerWidth includes the vertical scrollbar,
       so sizing to it makes the canvas wider than the viewport and the page
       scrolls sideways by the scrollbar's width. */
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    this.canvas.width = vw * dpr;
    this.canvas.height = vh * dpr;
    this.canvas.style.width = vw + 'px';
    this.canvas.style.height = vh + 'px';
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  private onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    } else if (this.presence > 0 && !this.raf) {
      this.loop();
    }
  };

  private clear() {
    if (this.ctx) this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private loop = () => {
    this.step();
    this.draw();
    if (this.presence <= 0) {
      /* fully dissolved — stop the animation frame entirely. No rAF runs while
         the learner is reading, which is the whole point. */
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.ps = [];
      this.clear();
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private step() {
    this.t += 1 / 60;

    if (this.holdT > 0) this.holdT -= 1 / 60;
    else this.presence = Math.max(0, this.presence - 0.012);

    const settle = 1 - this.presence;   // gathers as it fades: bloom, then furl
    const n = this.ps.length;

    for (let i = 0; i < n; i++) {
      const p = this.ps[i];

      /* slot on a breathing ring around the point of consequence */
      const breathe = 1 + Math.sin(this.t * 0.7 + p.phase) * 0.1;
      const ang = p.u * TAU + this.t * 0.2 + Math.sin(this.t * 0.3 + p.phase) * 0.24;
      const hx = this.centre.x + Math.cos(ang) * this.ringR * breathe;
      const hy = this.centre.y + Math.sin(ang) * this.ringR * 0.72 * breathe;

      const spring = 0.004 + settle * 0.004;
      p.vx += (hx - p.x) * spring;
      p.vy += (hy - p.y) * spring;

      /* layered sine wander — hand of nature, never a machine orbit */
      p.vx += Math.sin(this.t * 1.3 + p.phase * 3.1) * 0.05;
      p.vy += Math.cos(this.t * 1.1 + p.phase * 2.3) * 0.05;

      /* sampled separation so the being has body rather than overlap */
      for (let s = 0; s < 3; s++) {
        const o = this.ps[(i * 7 + s * 31 + ((this.t * 60) | 0)) % n];
        if (o === p) continue;
        const dx = p.x - o.x, dy = p.y - o.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 1 && d2 < 900) {
          const d = Math.sqrt(d2);
          p.vx += (dx / d) * 0.09;
          p.vy += (dy / d) * 0.09;
        }
      }

      p.vx *= 0.94; p.vy *= 0.94;
      p.x += p.vx; p.y += p.vy;
    }
  }

  private draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
    if (this.presence <= 0 || !this.ps.length) return;

    const [r, g, b] = this.hue;
    const fade = Math.min(1, this.presence * 1.15);
    ctx.globalCompositeOperation = this.light ? 'source-over' : 'lighter';
    const alpha = (this.light ? 0.5 : 0.75) * fade;

    /* micro-lightning: electricity lives INSIDE the being, as texture */
    ctx.lineWidth = 1;
    const n = this.ps.length;
    for (let i = 0; i < n; i += 2) {
      const p = this.ps[i];
      const o = this.ps[(i * 13 + 7) % n];
      const dx = p.x - o.x, dy = p.y - o.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 2100) {
        const a = (1 - d2 / 2100) * (this.light ? 0.24 : 0.3) * fade;
        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        const mx = (p.x + o.x) / 2 + (Math.random() - 0.5) * 7;
        const my = (p.y + o.y) / 2 + (Math.random() - 0.5) * 7;
        ctx.quadraticCurveTo(mx, my, o.x, o.y);
        ctx.stroke();
      }
    }

    for (const p of this.ps) {
      const tw = 0.6 + 0.4 * Math.sin(this.t * 2.2 + p.phase);
      const pr = Math.max(50, Math.min(255, r + p.hueOff));
      const pg = Math.max(50, Math.min(255, g + p.hueOff * 0.6));
      ctx.fillStyle = 'rgba(' + (pr | 0) + ',' + (pg | 0) + ',' + b + ',' + (alpha * tw * p.life) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (this.light ? 1.25 : 1), 0, TAU);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}

export const Swarm = new SwarmEngine();

/* Views mark their keystone to declare an essence hue:
     <div data-keystone data-essence="#a78bff"> ... </div>
   This sets the colour of the NEXT real moment. It deliberately does not
   manifest anything — navigating is not an achievement. */
export function chargeKeystone() {
  const el = document.querySelector('[data-keystone]');
  const hue = el?.getAttribute('data-essence') || undefined;
  Swarm.setHue(hue);
  Field.setHue(hue);
}
