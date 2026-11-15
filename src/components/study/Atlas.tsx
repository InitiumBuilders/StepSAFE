/* THE ATLAS: the whole deck as one field. Each kind of card is a cluster on a
   ring; inside a cluster the cards sit on a sunflower spiral, so the field is
   steady and the same on every visit. A card's light is its state: dim when
   not met, lit when met, ringed when held, coral when in the FUD range, gold
   when Semble Essential, and a slow pulse when Diving Into. Tap a light to
   open its card. It draws only while on screen. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useS } from '../../lib/state';
import { deck, KIND_HUE, KIND_LABEL, type CardKind } from '../../lib/study/cards';
import { masteryOf, isFud } from '../../lib/study/engine';

const ORDER: CardKind[] = ['term', 'model', 'threat', 'stack', 'guide', 'step', 'room', 'incident'];
interface Dot { id: string; x: number; y: number; kind: CardKind; title: string }

function layout(w: number, h: number): { dots: Dot[]; centers: { kind: CardKind; x: number; y: number; r: number; n: number }[] } {
  const cards = deck();
  const byKind = ORDER.map(k => cards.filter(c => c.kind === k));
  const cx = w / 2, cy = h / 2;
  const narrow = w < 520;
  const ring = Math.min(w, h) * (narrow ? 0.37 : 0.33);
  const unit = Math.min(w, h) / (narrow ? 84 : 64);
  const dots: Dot[] = [];
  const centers: { kind: CardKind; x: number; y: number; r: number; n: number }[] = [];
  byKind.forEach((list, i) => {
    if (!list.length) return;
    const a = (i / ORDER.length) * Math.PI * 2 - Math.PI / 2;
    const big = list.length > 120;
    const pull = big ? (narrow ? 0.5 : 0.55) : 1;
    const ox = cx + Math.cos(a) * ring * pull;
    const oy = cy + Math.sin(a) * ring * pull;
    const step = unit * (list.length > 200 ? 0.62 : 0.85);
    list.forEach((c, j) => {
      const rr = step * Math.sqrt(j + 0.5) * 1.15;
      const th = j * 2.39996;
      dots.push({ id: c.id, x: ox + Math.cos(th) * rr, y: oy + Math.sin(th) * rr, kind: c.kind, title: c.title });
    });
    centers.push({ kind: ORDER[i], x: ox, y: oy, r: step * Math.sqrt(list.length) * 1.15, n: list.length });
  });
  return { dots, centers };
}

export function Atlas({ onOpen, onKind }: { onOpen: (id: string) => void; onKind?: (kind: CardKind) => void }) {
  const { s } = useS();
  const wrap = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ w: 600, h: 520 });
  const [hover, setHover] = useState<Dot | null>(null);
  const lay = useMemo(() => layout(size.w, size.h), [size]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const read = () => { const w = el.clientWidth; setSize({ w, h: Math.round(Math.min(620, Math.max(360, w * 0.92))) }); };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    cv.width = Math.round(size.w * dpr); cv.height = Math.round(size.h * dpr);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, visible = true, last = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, size.w, size.h);
      for (const c of lay.centers) {
        ctx.strokeStyle = 'rgba(216,239,252,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r + 8, 0, Math.PI * 2); ctx.stroke();
      }
      for (const dt of lay.dots) {
        const st = s.study[dt.id];
        const m = masteryOf(st);
        const hue = KIND_HUE[dt.kind];
        const met = m !== 'new';
        ctx.globalAlpha = met ? 1 : 0.28;
        ctx.fillStyle = isFud(st) ? '#e8786a' : hue;
        const r = met ? 2.6 : 1.7;
        ctx.beginPath(); ctx.arc(dt.x, dt.y, r, 0, Math.PI * 2); ctx.fill();
        if (m === 'mastered' || st?.essential || st?.diving) {
          const pulse = st?.diving && !still ? 1 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.4)) : 1;
          ctx.globalAlpha = st?.diving ? 0.9 : 0.75;
          ctx.strokeStyle = st?.essential ? '#fdc26f' : hue;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(dt.x, dt.y, 5 * pulse, 0, Math.PI * 2); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      if (hover) {
        ctx.strokeStyle = '#f8f1fb'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(hover.x, hover.y, 8, 0, Math.PI * 2); ctx.stroke();
      }
    };
    const loop = (now: number) => {
      if (!visible) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 50) return;
      last = now;
      draw(now);
    };
    const io = new IntersectionObserver(en => { visible = en.some(e => e.isIntersecting); if (visible && !still) raf = requestAnimationFrame(loop); });
    io.observe(cv);
    draw(performance.now());
    if (!still) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [lay, size, s.study, hover]);

  const pick = (e: React.PointerEvent) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let best: Dot | null = null, bd = 144;
    for (const dt of lay.dots) { const dd = (dt.x - x) ** 2 + (dt.y - y) ** 2; if (dd < bd) { bd = dd; best = dt; } }
    return best;
  };

  return (
    <div className="sg-atlas" ref={wrap}>
      <canvas ref={canvas} style={{ width: size.w, height: size.h }} aria-label="Every card in the deck as one field. Use the deck list to reach a card by keyboard."
        onPointerMove={e => setHover(pick(e))} onPointerLeave={() => setHover(null)}
        onClick={e => { const p = pick(e as unknown as React.PointerEvent); if (p) onOpen(p.id); }} />
      {size.w >= 520 && lay.centers.map(c => (
        <button key={c.kind} type="button" className="sg-atlas-label" style={{ left: c.x, top: Math.max(10, c.y - c.r - 22), ['--hue' as string]: KIND_HUE[c.kind] }}
          onClick={() => onKind?.(c.kind)} title={'Open the deck on every ' + KIND_LABEL[c.kind].toLowerCase() + ' card'}>{KIND_LABEL[c.kind]} {'·'} {c.n}</button>
      ))}
      {size.w < 520 && (
        <div className="sg-atlas-doors">
          {lay.centers.map(c => (
            <button key={c.kind} type="button" className="chip" style={{ ['--hue' as string]: KIND_HUE[c.kind] }} onClick={() => onKind?.(c.kind)}>{KIND_LABEL[c.kind]} {'·'} {c.n}</button>
          ))}
        </div>
      )}
      {hover && (
        <span className="sg-atlas-tip" style={{ left: Math.min(size.w - 180, Math.max(8, hover.x + 12)), top: Math.max(8, hover.y - 34) }}>
          {hover.title}
        </span>
      )}
      <div className="sg-atlas-key">
        <span><i className="k-dim" />Not met</span><span><i className="k-lit" />Met</span><span><i className="k-ring" />Held</span>
        <span><i className="k-fud" />FUD range</span><span><i className="k-gold" />Semble Essential</span><span><i className="k-pulse" />Diving Into</span>
      </div>
    </div>
  );
}
