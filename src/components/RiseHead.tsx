/* A page heading that rises word by word when the page opens, the way August's statements do on the welcome
   page (lander/Statement.tsx). Each word sits in its own window and rises into it in turn.

   The themes draw a heading as one gradient clipped to its text. A word that moves is painted on its own
   layer, outside that clip, so the gradient is read from the heading as the theme draws it and laid onto each
   word, positioned from the heading's box: the colours land where they did on the whole line. It is read again
   when the theme, the text size or the width changes. Calm and reduced motion show every word in place. */

import React, { useLayoutEffect, useRef } from 'react';

interface Props {
  text: string;
  as?: 'h1' | 'h2';
  className?: string;
  style?: React.CSSProperties;
}

/** where the first word moves, the time between words, and the latest any word starts */
const START = 0.1, BEAT = 0.055, LAST = 0.55;

/** words split at spaces; a long compound also breaks after its hyphens, as it could before */
function words(text: string): string[][] {
  return text.split(' ').filter(Boolean).map(w => w.split(/(?<=-)(?=.)/));
}

/** Separate windows lose the kerning across a gap (a comma before a space, a space before an A), so each word
    would sit a pixel or two off. A hidden plain copy of the heading gives every gap its true width, and each
    window takes back the difference. */
function kern(el: HTMLElement) {
  const ws = [...el.querySelectorAll<HTMLElement>('.rise-w')];
  for (const w of ws) w.style.removeProperty('--kx');
  const label = el.getAttribute('aria-label') || '';
  const plain = document.createElement('span');
  plain.className = 'rise-plain';
  plain.textContent = label;
  el.appendChild(plain);
  const t = plain.firstChild as Text | null;
  const box = el.getBoundingClientRect();
  const at: { x: number; y: number }[] = [];
  let from = 0;
  for (const w of ws) {
    const word = w.textContent || '';
    const i = t ? label.indexOf(word, from) : -1;
    if (i < 0 || !t) { at.push({ x: NaN, y: NaN }); continue; }
    from = i + word.length;
    const r = document.createRange();
    r.setStart(t, i); r.setEnd(t, i + 1);
    const rr = r.getBoundingClientRect();
    at.push({ x: rr.left - box.left - el.clientLeft, y: rr.top });
  }
  plain.remove();
  /* the windows never move, so their boxes give each word's place to the fraction of a pixel */
  const win = ws.map(w => w.getBoundingClientRect());
  const k: number[] = ws.map(() => 0);
  for (let i = 1; i < ws.length; i++) {
    const sameLine = Math.abs(win[i].top - win[i - 1].top) < 1 && Math.abs(at[i].y - at[i - 1].y) < 1;
    if (!sameLine || Number.isNaN(at[i].x) || Number.isNaN(at[i - 1].x)) continue;
    const d = (at[i].x - at[i - 1].x) - (win[i].left - win[i - 1].left);
    if (Math.abs(d) > 0.05 && Math.abs(d) < 12) k[i] = d;
  }
  ws.forEach((w, i) => { if (k[i]) w.style.setProperty('--kx', k[i].toFixed(2) + 'px'); });
}

/** Each word sits in its own window and cannot break. A word wider than the heading (one long name, on a phone)
    would run past the edge, so the heading is set just small enough for its widest word to fit. */
function shrink(el: HTMLElement) {
  el.style.removeProperty('font-size');
  const room = el.clientWidth;
  if (!room) return;
  let widest = 0;
  for (const w of el.querySelectorAll<HTMLElement>('.rise-w')) widest = Math.max(widest, w.getBoundingClientRect().width);
  if (widest > room) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * (room / widest) * 0.985).toFixed(2) + 'px';
}

/** lay the heading's own gradient across its words */
function measure(el: HTMLElement) {
  shrink(el);
  kern(el);
  el.classList.remove('rise-g');
  const bg = getComputedStyle(el).backgroundImage;
  if (!bg || bg === 'none') { el.style.removeProperty('--hg'); return; }
  el.style.setProperty('--hg', bg);
  el.style.setProperty('--gw', el.clientWidth + 'px');
  el.style.setProperty('--gh', el.clientHeight + 'px');
  const box = el.getBoundingClientRect();
  for (const w of el.querySelectorAll<HTMLElement>('.rise-w')) {
    const r = w.getBoundingClientRect(), cs = getComputedStyle(w);
    const inner = w.firstElementChild as HTMLElement;
    inner.style.setProperty('--gx', (r.left + parseFloat(cs.paddingLeft) - box.left - el.clientLeft).toFixed(2) + 'px');
    inner.style.setProperty('--gy', (r.top + parseFloat(cs.paddingTop) - box.top - el.clientTop).toFixed(2) + 'px');
  }
  el.classList.add('rise-g');
}

export function RiseHead({ text, as = 'h1', className = '', style }: Props) {
  const Tag = as;
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* the words are sent first, so nothing below can keep a heading from arriving */
    let raf = requestAnimationFrame(() => (raf = requestAnimationFrame(() => el.classList.add('in'))));
    /* a page opened in a background tab gets no frames; the words still arrive */
    const safety = window.setTimeout(() => el.classList.add('in'), 1200);
    /* if the measuring ever fails, the heading keeps its own gradient and its words simply stand in place */
    const fit = () => { try { measure(el); } catch { el.classList.remove('rise-g'); el.classList.add('rise-still'); } };
    fit();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(fit) : null;
    ro?.observe(el);
    const mo = new MutationObserver(fit);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-text'] });
    document.fonts?.ready.then(fit).catch(() => {});
    return () => { cancelAnimationFrame(raf); clearTimeout(safety); ro?.disconnect(); mo.disconnect(); };
  }, [text]);

  let k = 0;
  return (
    <Tag ref={ref} className={'rise ' + className} style={style} aria-label={text}>
      {words(text).map((parts, wi, all) => (
        <React.Fragment key={wi}>
          {parts.map((p, pi) => {
            const d = Math.min(LAST, START + k++ * BEAT);
            return <span key={pi} className="rise-w" aria-hidden><span className="rise-wi" style={{ ['--d' as string]: d.toFixed(3) + 's' }}>{p}</span></span>;
          })}
          {wi < all.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}
