/* THE STUDY CLOCK: the seconds a learner actually spends on a card. A second
   counts only while the card is open, the tab is visible, and the learner has
   moved, typed, touched or scrolled within the last minute, so an open tab
   left alone earns nothing. Seconds are gathered here and written to the
   record every ten seconds and when the card changes or the page hides. */

import { useEffect, useRef, useState } from 'react';
import { useS } from '../state';
import { dayKey } from './engine';

const IDLE_MS = 60000;
const FLUSH_MS = 10000;

export function useStudyClock(cardId: string | null): { live: number; active: boolean } {
  const { d } = useS();
  const pending = useRef(0);
  const lastInput = useRef(Date.now());
  const [live, setLive] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const touch = () => { lastInput.current = Date.now(); };
    const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];
    for (const e of evs) window.addEventListener(e, touch, { passive: true });
    return () => { for (const e of evs) window.removeEventListener(e, touch); };
  }, []);

  useEffect(() => {
    if (!cardId) return;
    pending.current = 0;
    setLive(0);
    lastInput.current = Date.now();
    d({ t: 'study-view', id: cardId, at: Date.now() });
    const flush = () => {
      const secs = Math.floor(pending.current);
      if (secs > 0) {
        pending.current -= secs;
        d({ t: 'study-time', id: cardId, secs, day: dayKey(), at: Date.now() });
      }
    };
    const tick = window.setInterval(() => {
      const on = document.visibilityState === 'visible' && Date.now() - lastInput.current < IDLE_MS;
      setActive(on);
      if (!on) return;
      pending.current += 1;
      setLive(v => v + 1);
    }, 1000);
    const saver = window.setInterval(flush, FLUSH_MS);
    const onHide = () => { if (document.visibilityState !== 'visible') flush(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(saver);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId]);

  return { live, active };
}
