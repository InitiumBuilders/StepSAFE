/* TIME WITH THE MINDS. Counted only while the page with the minds is on screen and the learner is
   there: a touch, a key, a wheel or a scroll in the last ninety seconds, or a mind answering or
   reading aloud. Time is attributed to the mind being spoken with, and handed to the state every
   twenty seconds, when the tab hides, when the mind changes, and when the page closes. It stays on
   this device. */

import { useCallback, useEffect, useRef } from 'react';
import type { Act } from './state';

export type Mind = 'seva' | 'claros' | 'dasha';
const IDLE_MS = 90_000;

export interface MindClock {
  mind: Mind;
  busy: boolean;
  /** seconds this visit, by mind */
  session: Record<Mind, number>;
  /** seconds counted but not yet handed to the state */
  pending: number;
  lastAct: number;
  lastTick: number;
}

export function useMindClock(mind: Mind, busy: boolean, d: (a: Act) => void) {
  const c = useRef<MindClock>({ mind, busy, session: { seva: 0, claros: 0, dasha: 0 }, pending: 0, lastAct: Date.now(), lastTick: Date.now() });
  c.current.busy = busy;

  const tick = useCallback(() => {
    const k = c.current, now = Date.now();
    const dt = Math.min(5, Math.max(0, (now - k.lastTick) / 1000));
    k.lastTick = now;
    if (document.hidden) return;
    if (now - k.lastAct < IDLE_MS || k.busy) { k.pending += dt; k.session[k.mind] += dt; }
  }, []);

  const flush = useCallback(() => {
    const k = c.current;
    const secs = Math.floor(k.pending);
    if (secs >= 1) { k.pending -= secs; d({ t: 'mind-time', mind: k.mind, secs }); }
  }, [d]);

  /* the mind changed: what was counted belongs to the one before */
  useEffect(() => {
    if (c.current.mind === mind) return;
    tick(); flush();
    c.current.mind = mind;
  }, [mind, tick, flush]);

  useEffect(() => {
    const mark = () => { c.current.lastAct = Date.now(); };
    const evs: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];
    evs.forEach(e => window.addEventListener(e, mark, { passive: true, capture: true }));
    const t1 = window.setInterval(tick, 1000);
    const t2 = window.setInterval(flush, 20_000);
    const onVis = () => { tick(); flush(); c.current.lastTick = Date.now(); };
    const onHide = () => { tick(); flush(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onHide);
    return () => {
      tick(); flush();
      window.clearInterval(t1); window.clearInterval(t2);
      evs.forEach(e => window.removeEventListener(e, mark, { capture: true } as EventListenerOptions));
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onHide);
    };
  }, [tick, flush]);

  return { clock: c, settle: () => { tick(); flush(); } };
}

/** 75 seconds reads "1 min"; an hour and ten "1 h 10 min" */
export function spent(secs: number): string {
  const m = Math.floor(secs / 60);
  if (m < 1) return secs > 0 ? 'under a minute' : 'none yet';
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60), r = m % 60;
  return h + ' h' + (r ? ' ' + r + ' min' : '');
}

/** a running clock, mm:ss or h:mm:ss */
export function clockText(secs: number): string {
  const s = Math.floor(secs), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : String(m)) + ':' + String(r).padStart(2, '0');
}
