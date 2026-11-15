/* The Drill — a decision under pressure. The plausible-but-wrong option is
   the teaching device; the ripple is the second-order truth. */

import React, { useEffect, useRef, useState } from 'react';
import type { Drill } from '../content/schema';
import { Swarm } from '../lib/swarm';
import { Haptic } from '../lib/haptic';

export function DrillPlayer({
  drill,
  onResolved,
  initial,
}: {
  drill: Drill;
  /** the option already chosen, when a room in progress is opened again: it is shown as answered and not scored twice */
  initial?: string;
  /** chosenId lets a caller reconstruct the learner's actual decision trail */
  onResolved?: (score: number, best: boolean, chosenId: string) => void;
}) {
  const [picked, setPicked] = useState<string | null>(() => (initial && drill.options.some(o => o.id === initial) ? initial : null));
  const opt = drill.options.find(o => o.id === picked) || null;
  const best = drill.options.find(o => o.isBest);

  /* The outcome is written under the options, and on a phone that is below the screen. Once the options have
     said which was chosen and which was strongest, the page moves to the outcome. A learner who has scrolled,
     tapped or pressed a key in that moment is left where they are, and an answer restored from a saved place
     moves nothing. */
  const outcomeRef = useRef<HTMLDivElement | null>(null);
  const fresh = useRef(false);
  useEffect(() => {
    if (!picked || !fresh.current) return;
    fresh.current = false;
    const y0 = window.scrollY;
    let moved = false;
    const stop = () => { moved = true; };
    const evs = ['pointerdown', 'touchstart', 'wheel', 'keydown'];
    evs.forEach(n => window.addEventListener(n, stop, { passive: true }));
    const t = window.setTimeout(() => {
      const el = outcomeRef.current;
      if (!el || moved || Math.abs(window.scrollY - y0) > 4) return;
      const calm = document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
    }, 650);
    return () => { window.clearTimeout(t); evs.forEach(n => window.removeEventListener(n, stop)); };
  }, [picked]);

  function choose(id: string, e: React.MouseEvent) {
    if (picked) return;
    fresh.current = true;
    setPicked(id);
    const o = drill.options.find(x => x.id === id)!;
    /* Only a clean decision manifests, and only lightly. A miss gets the
       debrief and the ripple — which is the actual teaching — not a light show
       that would read as reward for the wrong answer. */
    if (o.isBest) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      Swarm.summon('note', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    if (o.isBest) Haptic.good(); else Haptic.tap();
    onResolved?.(o.score, !!o.isBest, o.id);
  }

  return (
    <div className="drill">
      <div className="drill-head">
        <span className="label">Decision drill</span>
        {drill.clock && <span className="drill-clock">{drill.clock}</span>}
      </div>
      <div className="drill-body">
        <p className="drill-scene">{drill.scene}</p>
        {drill.pressure && (
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>
            Pressure: {drill.pressure}
          </p>
        )}
        <p className="drill-prompt">{drill.prompt}</p>
        <div className="opts" role="group" aria-label="Decision options">
          {drill.options.map(o => {
            const cls = ['opt'];
            if (picked) {
              if (o.id === picked) cls.push('picked');
              if (o.isBest) cls.push('best');
              else if (o.id === picked && o.score < 0) cls.push('bad');
              if (o.id !== picked && !o.isBest) cls.push('dim');
            }
            return (
              <button
                key={o.id}
                className={cls.join(' ')}
                disabled={!!picked}
                onClick={e => choose(o.id, e)}
              >
                {picked && o.id === picked && <span className={'label opt-tag' + (o.isBest ? ' best' : '')}>{o.isBest ? 'You chose · Strongest move' : 'You chose'}</span>}
                {picked && o.id !== picked && o.isBest && <span className="label opt-tag best">The stronger move</span>}
                <strong>{o.label}</strong>
                {o.detail && <span className="od">{o.detail}</span>}
              </button>
            );
          })}
        </div>

        {opt && (
          <div className="outcome" ref={outcomeRef}>
            <div className="o-line">
              <span className="label">Immediate outcome</span>
              {opt.outcome}
            </div>
            <div className="o-line">
              <span className="label">The ripple — what surfaces later</span>
              {opt.ripple}
            </div>
            {!opt.isBest && best && (
              <div className="o-line">
                <span className="label">The stronger move</span>
                <strong>{best.label}.</strong> {best.outcome}
              </div>
            )}
            <div className="o-line">
              <span className="label">Debrief</span>
              {drill.debrief}
            </div>
            <div className="statement e-gold" style={{ marginTop: 'var(--s2)' }}>
              {drill.principle}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
