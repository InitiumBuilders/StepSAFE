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

/** the height of the app's bar where it sits on top, else 0 */
function barTop(): number {
  const nav = document.querySelector<HTMLElement>('.nav');
  if (!nav) return 0;
  const cs = getComputedStyle(nav);
  return cs.position === 'sticky' && cs.flexDirection === 'row' ? nav.getBoundingClientRect().height : 0;
}

/** Brings an element back just under the bar (or the top of the screen) when it sits above it. Read from the layout
    (offsetTop), not the screen, so a view still sliding in as it arrives does not throw the measure off. */
export function keepInView(el: HTMLElement): void {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  const top = barTop();
  if (y < window.scrollY + top) window.scrollTo(0, Math.max(0, y - top - 12));
}

/** Centres an element in the row that scrolls it sideways, when the row does scroll. The page itself does not move. */
export function centerInRow(el: HTMLElement | null): void {
  const row = el?.parentElement;
  if (!el || !row || row.scrollWidth <= row.clientWidth + 1) return;
  const a = el.getBoundingClientRect(), b = row.getBoundingClientRect();
  row.scrollTo({ left: row.scrollLeft + a.left - b.left - b.width / 2 + a.width / 2 });
}
