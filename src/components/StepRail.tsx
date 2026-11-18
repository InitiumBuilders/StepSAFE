/* A Step's own outline, beside it on a wide screen: every titled block and the Step's later parts (the drill, the
   field praxis, the seal), each a way to its place, and the one being read lit. Read from the page as it stands,
   so it follows whatever the Step holds.
   The light follows the last heading above the top third of the screen. An IntersectionObserver moves it as
   headings cross that line during a scroll, and a pick once the scroll has settled catches a jump that skipped the
   line (the End key, a flick, the scrollbar). Nothing reads layout on every frame of a scroll. At the very end of
   the page the last parts can never reach the line, so the last one on screen is lit. A click lights its own item
   and holds it until the scroll it started has ended. */

import React, { useEffect, useRef, useState, type RefObject } from 'react';

interface Item { el: HTMLElement; label: string }

export function StepRail({ main, stepId }: { main: RefObject<HTMLElement | null>; stepId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [on, setOn] = useState(0);
  const hold = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const root = main.current;
    if (!root) return;
    const found = [...root.querySelectorAll<HTMLElement>('.blk-title, [data-st-part]')]
      .map(el => ({ el, label: (el.dataset.stPart || el.textContent || '').trim() }))
      .filter(x => x.label);
    setItems(found);
    setOn(0);
    if (!found.length) return;
    let held = false;
    let timer = 0;
    const pick = () => {
      if (held) return;
      const vh = window.innerHeight;
      let k = 0;
      found.forEach((x, i) => { if (x.el.getBoundingClientRect().top <= vh * 0.33) k = i; });
      const se = document.scrollingElement || document.documentElement;
      if (se.scrollTop + vh >= se.scrollHeight - 4) {
        found.forEach((x, i) => { if (x.el.getBoundingClientRect().top < vh * 0.85) k = Math.max(k, i); });
      }
      setOn(k);
    };
    // after a click the settle only lets go of the held item; after a reader's own scroll it picks
    const settle = () => { if (held) { held = false; return; } pick(); };
    const onScroll = () => { window.clearTimeout(timer); timer = window.setTimeout(settle, 140); };
    const io = typeof IntersectionObserver === 'function' ? new IntersectionObserver(pick, { rootMargin: '0px 0px -66% 0px' }) : null;
    found.forEach(x => io?.observe(x.el));
    window.addEventListener('scroll', onScroll, { passive: true });
    hold.current = (i: number) => {
      held = true;
      setOn(i);
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 1600);   // a click that needs no scroll still lets go
    };
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
      hold.current = () => {};
    };
  }, [main, stepId]);

  if (items.length < 2) return null;
  const go = (el: HTMLElement, i: number) => {
    hold.current(i);
    const calm = document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'start', behavior: calm ? 'auto' : 'smooth' });
  };
  return (
    <aside className="st-rail" aria-label="On this step">
      <span className="label">On this step</span>
      <ol>
        {items.map((x, i) => (
          <li key={i} className={i === on ? 'on' : i < on ? 'read' : ''}>
            <button type="button" onClick={() => go(x.el, i)} aria-current={i === on ? 'location' : undefined}>{x.label}</button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
