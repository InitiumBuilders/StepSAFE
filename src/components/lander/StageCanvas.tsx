/* The small system from the welcome page, on a canvas that runs only while it is on screen (lander/stage.ts).
   The welcome page moves it through its chapters; the threshold where a visitor takes their handle shows it
   holding. */

import React, { useEffect, useRef } from 'react';
import { Stage } from './stage';

/** a canvas that runs one Stage while it is on screen; `chapter` is fixed or follows the reading. `out` fades
    it away (the Sense has ended) and lets it rest once the fade is done. */
export function StageCanvas({ chapter, className, out = false }: { chapter: number; className: string; out?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const st = useRef<Stage | null>(null);
  const seen = useRef(false);
  const away = useRef(false);
  useEffect(() => {
    if (!cv.current || !box.current) return;
    const s = new Stage(cv.current, box.current);
    st.current = s;
    s.start();
    const io = new IntersectionObserver(es => { seen.current = es.some(e => e.isIntersecting); s.setVisible(seen.current && !away.current); }, { threshold: 0 });
    io.observe(box.current);
    return () => { io.disconnect(); s.stop(); st.current = null; };
  }, []);
  useEffect(() => { st.current?.setChapter(chapter); }, [chapter]);
  useEffect(() => {
    if (!out) { away.current = false; st.current?.setVisible(seen.current); return; }
    const t = window.setTimeout(() => { away.current = true; st.current?.setVisible(false); }, 900);
    return () => window.clearTimeout(t);
  }, [out]);
  return <div ref={box} className={className + (out ? ' out' : '')} aria-hidden><canvas ref={cv} /></div>;
}
