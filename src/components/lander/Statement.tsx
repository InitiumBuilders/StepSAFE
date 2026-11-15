/* A line set large. Each word sits in its own window and rises into it in turn, so the line arrives the way
   it would be spoken. August's statements are passed in whole, exactly as he wrote them; this only lays them
   out. The second line of a pair carries one gradient, measured across the words so it runs unbroken from
   the first letter to the last. A statement rises when it comes into view; inside the stage's chapters
   (`follow`) it rises while its chapter is the one being read and settles away when the reading moves on.
   Reduced motion shows every word in place. */

import React, { useEffect, useRef } from 'react';

interface Props {
  lines: string[];
  as?: 'h1' | 'h2' | 'p';
  className?: string;
  /** seconds between words */
  beat?: number;
  /** a pause before each new line */
  rest?: number;
  /** when the first word moves */
  start?: number;
  /** one delay per word, for a statement that keeps its own time */
  delays?: number[];
  /** letters instead of words, for a wordmark */
  letters?: boolean;
  /** rise with the chapter around it instead of on first view */
  follow?: boolean;
}

/** the gradient's span: each word learns where it sits within its line's words */
function measure(el: HTMLElement) {
  for (const line of el.querySelectorAll<HTMLElement>('.lx-st-line')) {
    const ws = [...line.querySelectorAll<HTMLElement>('.lx-st-w')];
    if (!ws.length) continue;
    const x0 = Math.min(...ws.map(w => w.offsetLeft));
    const x1 = Math.max(...ws.map(w => w.offsetLeft + w.offsetWidth));
    for (const w of ws) {
      const inner = w.firstElementChild as HTMLElement | null;
      if (!inner) continue;
      inner.style.setProperty('--gx', (w.offsetLeft - x0) + 'px');
      inner.style.setProperty('--gw', Math.max(1, x1 - x0) + 'px');
    }
  }
}

export function Statement({ lines, as = 'h2', className = '', beat = 0.12, rest = 0.3, start = 0, delays, letters = false, follow = false }: Props) {
  const Tag = as;
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure(el);
    const ro = new ResizeObserver(() => measure(el));
    ro.observe(el);
    document.fonts?.ready.then(() => measure(el)).catch(() => {});
    return () => ro.disconnect();
  }, []);
  let k = 0;
  return (
    <Tag ref={ref} className={'lx-st ' + (follow ? 'lx-st-follow ' : '') + className} aria-label={lines.join(' ')} {...(follow ? {} : { 'data-reveal': '' })}>
      {lines.map((line, li) => {
        const parts = letters ? [...line] : line.split(' ');
        return (
          <span key={li} className={'lx-st-line l' + li} aria-hidden>
            {parts.map((w, wi) => {
              const d = delays ? delays[k] ?? 0 : start + k * beat + li * rest;
              k++;
              const gap = !letters && wi < parts.length - 1 ? ' ' : '';
              if (letters && w === ' ') return <span key={wi} className="lx-st-gap"> </span>;
              return (
                <React.Fragment key={wi}>
                  <span className="lx-st-w"><span className="lx-st-wi" style={{ ['--d' as string]: d.toFixed(2) + 's', ['--i' as string]: String(k - 1) }}>{w}</span></span>{gap}
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
