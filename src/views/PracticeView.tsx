/* THE PRACTICE — the simulation rooms. Where knowledge is put under load.

   The card's job is to let a learner decide, in about four seconds, whether
   this is the room they should walk into next: how hard it is, how long it
   takes, what it will judge them on, which of their specialists will be in the
   room, and whether they have the ground to survive it. */

import React, { useEffect, useMemo } from 'react';
import { SIMS, CHAPTERS, memberById, ESSENCE_HEX } from '../content/registry';
import { useS } from '../lib/state';
import { SectionHead } from '../components/bits';
import { chargeKeystone } from '../lib/swarm';
import { StockRow, StockVessel } from '../components/Stocks';
import { roomProgress } from '../lib/roomProgress';
import { WayIn } from '../components/OneCallCard';

/* Truncate on a sentence boundary rather than mid-word — a brief that ends in
   the middle of a clause reads as broken, not as abbreviated. */
function firstSentences(text: string, max = 240): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (stop > 90) return cut.slice(0, stop + 1);
  const sp = cut.lastIndexOf(' ');
  return cut.slice(0, sp > 0 ? sp : max) + '…';
}

const LEDE = 'Every module puts you in the chair at a real-feeling organisation while the situation unfolds in live injects — pagers, executives, lawyers, press, regulators, chains, models. Your unit advises and does not always agree. Decisions score, and the ripples surface later. This is where judgment is forged.';

export function PracticeView() {
  const { s, d } = useS();
  useEffect(() => { chargeKeystone(); }, []);

  const byChapter = useMemo(
    () => CHAPTERS
      .map(c => ({ chapter: c, sims: SIMS.filter(m => m.chapterId === c.id) }))
      .filter(x => x.sims.length > 0),
    []
  );

  const totalDone = Object.keys(s.completedSims).length;
  const decisionsAll = SIMS.reduce((n, m) => n + m.injects.filter(i => i.decision).length, 0);
  const decisionsMade = SIMS.filter(m => s.completedSims[m.id]).reduce((n, m) => n + m.injects.filter(i => i.decision).length, 0);
  const flawless = Object.keys(s.flawlessSims).length;
  /* the next room: the first one not yet commanded, in the order the page shows them */
  const nextId = byChapter.flatMap(x => x.sims).find(m => !s.completedSims[m.id])?.id;

  return (
    <div className="wrap-wide pr">
      <SectionHead sigil="rooms"
        kicker="THE PRACTICE"
        title="The simulation rooms."
        lede={LEDE}
      />

      {/* a room left part way leads the page, with its place; else one decision */}
      <WayIn />
      {/* on a phone the way in comes before the explanation, so the page's lede is said here, under it */}
      <p className="lede pr-lede">{LEDE}</p>

      <div className="panel pr-stocks" style={{ marginBottom: 'var(--s6)' }}>
        <StockRow>
          <StockVessel value={totalDone} max={SIMS.length} label="rooms commanded" hue="#f18ac6" note={'of ' + SIMS.length} />
          <StockVessel value={decisionsMade} max={decisionsAll} label="decisions under pressure" hue="#a78bff" note={'of ' + decisionsAll + ' in the rooms'} />
          <StockVessel value={flawless} max={SIMS.length} label="flawless" hue="#fdc26f" note={'of ' + totalDone + ' commanded'} />
          <StockVessel value={SIMS.reduce((n, m) => n + m.injects.length, 0)} max={SIMS.reduce((n, m) => n + m.injects.length, 0)} label="injects authored" hue="#b9d8f6" note="across every room" />
        </StockRow>
      </div>

      {/* on a wide screen the chapters flow into columns (pr-bands, in wide.css); a phone reads them in order */}
      <div className="pr-bands">
      {byChapter.map(({ chapter, sims }, gi) => (
        <div key={chapter.id} className="actband">
          <div className="actlab">
            <span className="label">{chapter.title}</span>
            <span className="rule" />
          </div>
          {/* readiness, said once for the chapter: has the learner any of its ground, and is a room here still open */}
          {chapter.pages.every(p => p.steps.every(st => !s.completedSteps[st.id])) && sims.some(m => !s.completedSims[m.id]) && (
            <p className="sec pr-cold">
              You have not started {chapter.title} yet. You can walk in cold —
              people do — but the debrief will teach you more if you have the ground under you.
            </p>
          )}
          <div className="grid grid-2" data-keystone={gi === 0 ? true : undefined} data-essence="#e879c9">
            {sims.map(m => {
              const done = s.completedSims[m.id];
              const flawless = !!s.flawlessSims[m.id];
              const essence = ESSENCE_HEX[m.essence];
              const decisions = m.injects.filter(i => i.decision).length;
              const topJudged = [...m.scoring].sort((a, b) => b.weight - a.weight).slice(0, 2);
              const going = roomProgress(m);

              return (
                <button
                  key={m.id}
                  className="simcard"
                  style={{ ['--essence' as string]: essence }}
                  onClick={() => d({ t: 'route', view: 'sim', id: m.id })}
                >
                  <div className="strip">
                    <span className="diff" aria-label={'Difficulty ' + m.difficulty + ' of 5'}>
                      {[1, 2, 3, 4, 5].map(k => (
                        <i key={k} className={k <= m.difficulty ? 'on' : undefined} />
                      ))}
                    </span>
                    <span className="chip">{m.minutes} min</span>
                    <span className="chip">{decisions} decisions</span>
                    {m.mode === 'motus' && <span className="chip gold">MOTUS</span>}
                    {going
                      ? <span className="chip gold pr-going">In progress · {going.cursor + 1} of {m.injects.length}</span>
                      : m.id === nextId && <span className="chip sig pr-next">{totalDone ? 'Next room' : 'Start here'}</span>}
                    <span className="spacer" />
                    {done && (
                      <span className="done-flag">
                        {flawless ? 'FLAWLESS' : 'COMMANDED'} · {done.score > 0 ? '+' : ''}{done.score}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="org">{m.org}</div>
                    <span className="sector">{m.sector}</span>
                  </div>

                  <h3>{m.title}</h3>
                  <p className="brief">{firstSentences(m.brief)}</p>

                  <div className="judged">
                    <span className="label">WHAT THIS ROOM JUDGES</span>
                    {topJudged.map((sc, i) => (
                      <div className="jrow" key={i}>
                        <span className="jw">{sc.weight}%</span>
                        <span>{sc.dimension}</span>
                      </div>
                    ))}
                  </div>

                  <div className="row-between" style={{ gap: 12 }}>
                    <div className="seats" aria-label="Unit seats in this room">
                      {m.roles.slice(0, 7).map(r => {
                        const mem = memberById(r);
                        const here = s.unitMembers.includes(r) || r === 'u-seva';
                        return (
                          <span key={r} className={'seat' + (here ? ' here' : '')}
                            title={mem ? mem.callsign + ' — ' + mem.role + (here ? '' : ' (seat not yet filled)') : r}>
                            {mem ? mem.callsign.slice(0, 2) : '··'}
                          </span>
                        );
                      })}
                    </div>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="chip sig">+{m.respect}</span>
                      <span className="chip gold">+{m.trust} trust</span>
                    </div>
                  </div>

                </button>
              );
            })}
          </div>
        </div>
      ))}
      </div>

      {byChapter.length === 0 && <div className="empty">Simulation modules are being prepared.</div>}
    </div>
  );
}
