/* The app's bar sits on top on a narrower screen and at the side on a wide one. A view with something sticky under
   the bar sets the bar's height as a CSS variable on its own root, and stays right when the bar's height changes
   (a stylesheet arriving late, a rotation, a larger text size). */

import { useEffect, type RefObject } from 'react';

export function useBarOffset(ref: RefObject<HTMLElement | null>, name: string, key?: unknown): void {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('.nav');
    const el = ref.current;
    if (!el) return;
    const set = () => {
      const cs = nav ? getComputedStyle(nav) : null;
      const top = nav && cs && cs.position === 'sticky' && cs.flexDirection === 'row' ? nav.getBoundingClientRect().height : 0;
      el.style.setProperty(name, Math.round(top) + 'px');
    };
    set();
    const ro = nav ? new ResizeObserver(set) : null;
    if (nav) ro!.observe(nav);
    window.addEventListener('resize', set);
    return () => { ro?.disconnect(); window.removeEventListener('resize', set); };
  }, [ref, name, key]);
}
