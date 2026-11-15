/* THE RETURN QUEUE — spaced repetition made visible.
   A drill you miss comes back: tomorrow, then in three days, then seven,
   twenty-one, sixty. Answer it cleanly each time and it graduates for good;
   miss it and the clock resets. Retrieval under a delay is what converts
   reading into recall — the queue is not punishment, it is the mechanism. */

import React, { useMemo, useState } from 'react';
import { stepById, ESSENCE_HEX } from '../content/registry';
import { useS, reviewDue, REVIEW_INTERVALS } from '../lib/state';
import { useEngine } from '../lib/engine';
import { DrillPlayer } from './DrillPlayer';

export function ReviewQueue() {
  const { s, d } = useS();
  const eng = useEngine();
  const [openId, setOpenId] = useState<string | null>(null);
  /* remount key so a re-attempted drill starts unanswered */
  const [attempt, setAttempt] = useState(0);

  const due = useMemo(() => reviewDue(s), [s]);
  const upcoming = useMemo(
    () => Object.values(s.reviews).filter(r => r.due > Date.now()).sort((a, b) => a.due - b.due),
    [s.reviews]
  );

  if (due.length === 0 && upcoming.length === 0) return null;

  const open = openId ? due.find(r => r.drillId === openId) : null;
  const openLoc = open ? stepById(open.stepId) : null;

  return (
    <section className="band" style={{ paddingTop: 0 }}>
      <div className="panel plate reticle" style={{ ['--essence' as string]: ESSENCE_HEX.ember }}>
        <div className="row" style={{ gap: 10, marginBottom: 6 }}>
          {due.length > 0 && <span className="due-pip" aria-hidden />}
          <span className="label">THE RETURN QUEUE</span>
        </div>
        <h3 style={{ marginBottom: 8 }}>
          {due.length > 0
            ? due.length + ' decision' + (due.length > 1 ? 's' : '') + ' came back for you'
            : 'Queue clear — ' + upcoming.length + ' scheduled ahead'}
        </h3>
        <p className="sec" style={{ marginBottom: due.length ? 'var(--s4)' : 0 }}>
          Every drill you miss returns on an expanding schedule — 1, 3, 7, 21, 60 days.
          Beat it each time and it graduates for good. This is the mechanism that turns
          reading into recall; there is no version of this craft without it.
        </p>

        {due.length > 0 && !open && (
          <div className="stack-sm">
            {due.map(r => {
              const loc = stepById(r.stepId);
              if (!loc || !loc.step.drill) return null;
              return (
                <div key={r.drillId} className="review-card panel" style={{ margin: 0 }}>
                  <div className="row-between">
                    <div style={{ minWidth: 0, paddingRight: 'var(--s3)' }}>
                      <span className="label">
                        {loc.chapter.title.toUpperCase()} · BOX {r.box + 1}/6
                        {r.lapses > 1 ? ' · ' + r.lapses + ' LAPSES' : ''}
                      </span>
                      <h4 style={{ margin: '8px 0 0' }}>{loc.step.title}</h4>
                    </div>
                    <button className="btn btn-sm"
                      onClick={() => { setOpenId(r.drillId); setAttempt(a => a + 1); }}>
                      Face it again
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {open && openLoc && openLoc.step.drill && (
          <div className="stack-sm">
            <button className="btn btn-ghost btn-sm" onClick={() => setOpenId(null)}>
              ← Back to the queue
            </button>
            <DrillPlayer
              key={open.drillId + ':' + attempt}
              drill={openLoc.step.drill}
              onResolved={(score) => {
                eng.reviewResult(open.drillId, score > 0);
                d({ t: 'drill-score', drillId: open.drillId, score });
                /* stay on the debrief; the learner closes it when read */
              }}
            />
            <button className="btn btn-sm" onClick={() => setOpenId(null)}>
              Done — next
            </button>
          </div>
        )}

        {due.length === 0 && upcoming.length > 0 && (
          <p className="sec" style={{ margin: 'var(--s3) 0 0' }}>
            Next return: <strong>{new Date(upcoming[0].due).toLocaleDateString()}</strong>
            {' '}· interval ladder {REVIEW_INTERVALS.slice(1).join(' / ')} days.
          </p>
        )}
      </div>
    </section>
  );
}
