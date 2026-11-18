/* One simulation — the inject feed. The clock moves when you do. */

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { simById, memberById, awardById, ESSENCE_HEX, CHAPTERS, SIMS } from '../content/registry';
import { useS } from '../lib/state';
import { useBarOffset } from '../lib/barOffset';
import { useEngine } from '../lib/engine';
import { DrillPlayer } from '../components/DrillPlayer';
import { UnitCounsel } from '../components/UnitCounsel';
import { chargeKeystone, Swarm } from '../lib/swarm';
import { RiseHead } from '../components/RiseHead';
import { roomProgress, saveRoom, clearRoom, roomLastRun, saveLastRun, tookOne, type RoomProgress, type RoomRun } from '../lib/roomProgress';
import { Haptic } from '../lib/haptic';
import { nextCall, subOfCall } from '../lib/oneDecision';
import { requestExam } from '../lib/study/session';
import { ShareLink, TIER_NAMES, quietToasts } from '../components/bits';

const CHANNEL_LABEL: Record<string, string> = {
  pager: 'PAGER', exec: 'EXEC', legal: 'LEGAL', press: 'PRESS', field: 'FIELD',
  board: 'BOARD', chain: 'ON-CHAIN', model: 'MODEL', regulator: 'REGULATOR', community: 'COMMUNITY',
};

export function SimView() {
  const { s, d } = useS();
  const eng = useEngine();
  const sim = simById(s.route.id || '');
  const [cursor, setCursor] = useState(0);      // injects revealed so far
  const [scores, setScores] = useState<number[]>([]);
  const [bests, setBests] = useState<boolean[]>([]);
  /** the learner's actual decision trail, for the after-action review */
  const [trail, setTrail] = useState<{ injectId: string; chosenId: string; score: number }[]>([]);
  /* one decision of the room taken by itself, with nothing recorded: 'one' is the first, 'one-3' the third */
  const oneSub = /^one(-\d{1,2})?$/.test(s.route.sub || '') ? (s.route.sub as string) : '';
  const one = !!oneSub;
  const [phase, setPhase] = useState<'brief' | 'live' | 'debrief' | 'one'>(one ? 'one' : 'brief');
  const [oneDone, setOneDone] = useState(false);
  /* the place this room was left at, if it was left part way */
  const [resume, setResume] = useState<RoomProgress | null>(null);
  /* the last finished run of this room, read as this one ends, for the debrief to set beside it */
  const [before, setBefore] = useState<RoomRun | null>(null);
  /* the last save held: a room runs an hour or more, and a learner should know they can leave it */
  const [keptHere, setKeptHere] = useState(false);
  /* what the learner held as the run ended, so the debrief can list what this run earned */
  const [heldAtEnd, setHeldAtEnd] = useState<string[] | null>(null);
  const [firstRun, setFirstRun] = useState(false);

  /* before the first paint, so a room opened by Continue never shows its brief on the way */
  useLayoutEffect(() => {
    const saved = sim && !one ? roomProgress(sim) : null;
    if (saved && s.route.sub === 'resume') {
      /* Continue, from The Practice or from Ground: straight to the inject it was left on */
      setCursor(saved.cursor); setScores(saved.scores); setBests(saved.bests); setTrail(saved.trail);
      setPhase('live');
    } else {
      setCursor(0); setScores([]); setBests([]); setTrail([]); setPhase(one ? 'one' : 'brief');
    }
    setOneDone(false);
    setResume(saved);
    chargeKeystone();
    window.scrollTo({ top: 0 });
  }, [s.route.id, one]); // eslint-disable-line react-hooks/exhaustive-deps

  /* the live room keeps its place on this device after every move */
  useEffect(() => {
    if (!sim || phase !== 'live' || (cursor === 0 && trail.length === 0)) return;
    setKeptHere(saveRoom(sim.id, { cursor, scores, bests, trail }));
  }, [phase, cursor, scores, bests, trail]); // eslint-disable-line react-hooks/exhaustive-deps

  /* the room and the debrief each open from their top: the way in can be pressed from anywhere in the brief */
  useEffect(() => { chargeKeystone(); if (phase === 'debrief' || (phase === 'live' && cursor === 0)) window.scrollTo({ top: 0 }); }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* the room's strip stays under the app's bar; each new inject arrives under the strip */
  const rootRef = useRef<HTMLDivElement | null>(null);
  useBarOffset(rootRef, '--sim-bar', sim?.id);
  useEffect(() => {
    if (phase !== 'live' || cursor === 0) return;
    const calm = document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = window.requestAnimationFrame(() => rootRef.current?.querySelector('.inject.current')?.scrollIntoView({ block: 'start', behavior: calm ? 'auto' : 'smooth' }));
    return () => window.cancelAnimationFrame(id);
  }, [cursor, phase]);

  /* the debrief lists what the run earned, so notices stay quiet while it shows; leaving it lets them speak again */
  useEffect(() => (phase === 'debrief' ? () => quietToasts(false) : undefined), [phase]);

  const total = useMemo(() => (sim ? sim.injects.length : 0), [sim]);
  if (!sim) return <div className="wrap"><div className="empty">Module not found.</div></div>;

  const essence = ESSENCE_HEX[sim.essence];
  const decisionCount = sim.injects.filter(i => i.decision).length;
  const current = sim.injects[cursor];
  const pendingDecision = phase === 'live' && current && current.decision &&
    scores.length <= sim.injects.slice(0, cursor + 1).filter(i => i.decision).length - 1;

  function advance() {
    if (cursor + 1 >= total) {
      const score = scores.reduce((a, b) => a + b, 0);
      const decisions = sim!.injects.filter(i => i.decision).length;
      const flawless = decisions > 0 && bests.length === decisions && bests.every(Boolean);
      setPhase('debrief');
      clearRoom(sim!.id); setResume(null);
      setBefore(roomLastRun(sim!));
      saveLastRun(sim!.id, trail);
      setHeldAtEnd(Object.keys(s.awards));
      setFirstRun(!s.completedSims[sim!.id]);
      quietToasts(true);
      eng.finishSim(sim!, score, flawless);
      /* commanding a room flawlessly is a different order of thing from
         surviving it */
      Swarm.summon(flawless ? 'seal' : 'mark', { x: window.innerWidth / 2, y: 220 });
    } else {
      setCursor(cursor + 1);
    }
  }

  /* starting over keeps the saved place until the new run makes its first move, so a slip of the thumb costs nothing */
  function begin() { Haptic.tap(); setResume(null); setPhase('live'); }
  function carryOn() {
    if (!resume) return;
    Haptic.tap();
    setCursor(resume.cursor); setScores(resume.scores); setBests(resume.bests); setTrail(resume.trail);
    setPhase('live');
  }
  const kept = resume ? resume.scores.reduce((a, b) => a + b, 0) : 0;
  /* one decision: the injects up to the first call */
  const calls = sim.injects.map((inj, i) => (inj.decision ? i : -1)).filter(i => i >= 0);
  const oneN = one ? Math.min(Math.max(1, parseInt(oneSub.slice(4) || '1', 10)), Math.max(1, calls.length)) : 1;
  const callAt = calls.length ? calls[oneN - 1] : -1;
  /* the injects since the call before it are shown; everything before those is the room so far, folded */
  const sinceAt = oneN > 1 ? calls[oneN - 2] + 1 : 0;
  const sofar = callAt >= 0 ? sim.injects.slice(0, sinceAt) : [];
  const opening = callAt >= 0 ? sim.injects.slice(sinceAt, callAt + 1) : [];
  function another() {
    const nxt = nextCall(SIMS, sim!.id, oneN);
    if (nxt) d({ t: 'route', view: 'sim', id: nxt.simId, sub: subOfCall(nxt.n) });
  }
  const injectHead = (inj: (typeof sim.injects)[number]) => (
    <div className="row-between" style={{ marginBottom: 12, gap: 12 }}>
      <span className="row" style={{ gap: 10 }}>
        <span className="chan">{CHANNEL_LABEL[inj.channel] || inj.channel.toUpperCase()}</span>
        <span className="from">{inj.from}</span>
      </span>
      <span className="clock">{inj.t}</span>
    </div>
  );

  const running = scores.reduce((a, b) => a + b, 0);
  const chapter = CHAPTERS.find(c => c.id === sim.chapterId);
  const chapterSteps = chapter ? chapter.pages.flatMap(pg => pg.steps) : [];
  const chapterDone = chapterSteps.filter(st => s.completedSteps[st.id]).length;

  return (
    <div className={'wrap sim' + (phase === 'live' ? ' sim-is-live' : '')} ref={rootRef}>
      <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'practice' })}>
        ← The Practice
      </button>

      {phase === 'brief' && (
        <section className="band" data-keystone data-essence={essence}>
          <div className="row" style={{ gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
            <span className="diff-strip" aria-label={'Difficulty ' + sim.difficulty + ' of 5'}>
              {[1, 2, 3, 4, 5].map(k => <i key={k} className={k <= sim.difficulty ? 'on' : undefined} />)}
            </span>
            <span className="chip">~{sim.minutes} min</span>
            <span className="chip">{decisionCount} decisions</span>
            {sim.mode === 'motus' && <span className="chip gold">MOTUS</span>}
            <ShareLink route={{ view: 'sim', id: sim.id }} title={sim.title + ' · StepSAFE'} label="Share this room" className="sim-share" />
          </div>

          <div className="org-line">{sim.org}</div>
          <span className="sector" style={{ marginBottom: 18 }}>{sim.sector}</span>

          <RiseHead text={sim.title} style={{ marginBottom: 22 }} />

          {resume && (
            <div className="panel sim-resume" style={{ marginBottom: 'var(--s4)' }}>
              <span className="label" style={{ display: 'block', marginBottom: 8 }}>In progress</span>
              <p className="big-sec" style={{ margin: '0 0 14px' }}>
                You left this room at inject {resume.cursor + 1} of {total}. Your score so far is {kept > 0 ? '+' : ''}{kept}.
              </p>
              <div className="row sim-resume-row">
                <button className="btn btn-key" onClick={carryOn}>Continue</button>
                <button className="btn btn-ghost" onClick={begin}>Start over</button>
              </div>
            </div>
          )}

          <div className="panel" style={{ marginBottom: 'var(--s4)' }}>
            <span className="label" style={{ display: 'block', marginBottom: 10 }}>Situation brief</span>
            <p className="big-sec" style={{ margin: 0, whiteSpace: 'pre-line' }}>{sim.brief}</p>
          </div>

          <div className="panel panel-2" style={{ marginBottom: 'var(--s4)' }}>
            <span className="label" style={{ display: 'block', marginBottom: 10 }}>Your objective</span>
            <p className="big-sec" style={{ margin: 0 }}>{sim.objective}</p>
          </div>

          {/* Real exercises tell you the assessment criteria before you start.
              Hiding them would test recall of the rubric rather than judgment. */}
          <div className="panel" style={{ marginBottom: 'var(--s4)' }}>
            <span className="label" style={{ display: 'block', marginBottom: 4 }}>
              How you will be judged — read this before you go in
            </span>
            <p className="sec" style={{ marginTop: 0, marginBottom: 14 }}>
              These weights are the whole game. An action that feels decisive but scores against the
              heaviest dimension is the exact mistake this room exists to teach.
            </p>
            <div className="stack-sm">
              {[...sim.scoring].sort((a, b) => b.weight - a.weight).map((sc, i) => (
                <div key={i} className="judge-row">
                  <div className="row-between" style={{ marginBottom: 6 }}>
                    <strong>{sc.dimension}</strong>
                    <span className="chip sig">{sc.weight}%</span>
                  </div>
                  <div className="weightbar" aria-hidden>
                    <i style={{ width: sc.weight + '%' }} />
                  </div>
                  <p className="sec" style={{ margin: '8px 0 0', fontSize: '0.96rem' }}>{sc.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel panel-2" style={{ marginBottom: 'var(--s5)' }}>
            <span className="label" style={{ display: 'block', marginBottom: 12 }}>Who is in the room</span>
            <div className="stack-sm">
              {sim.roles.map(r => {
                const m = memberById(r);
                const here = s.unitMembers.includes(r) || r === 'u-seva';
                if (!m) return null;
                return (
                  <div key={r} className="row" style={{ gap: 12, alignItems: 'flex-start', opacity: here ? 1 : 0.55 }}>
                    <span className={'seat-lg' + (here ? ' here' : '')}
                      style={{ ['--essence' as string]: ESSENCE_HEX[m.essence] }}>
                      {m.callsign.slice(0, 2)}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <strong>{m.callsign}</strong> <span className="sec">— {m.role}</span>
                      <p className="sec" style={{ margin: '4px 0 0', fontSize: '0.95rem' }}>
                        {here ? '“' + m.doctrine + '”' : 'Seat not yet filled — lock in their Chapter and they take this chair.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="row-between">
            <p className="sec" style={{ margin: 0, maxWidth: '48ch' }}>
              Your unit will advise at each decision. They will not always agree with each other,
              and they will not always be right. Weighing them is the exercise.
            </p>
            {resume
              ? <button className="btn btn-key btn-charge sim-start" onClick={carryOn}>Continue</button>
              : <button className="btn btn-key btn-charge sim-start" onClick={begin}>Take the chair</button>}
          </div>
          {/* on a phone the brief runs several screens, so the way in stays in reach */}
          <div className="sim-dock" role="region" aria-label="Start the room">
            <span className="sim-dock-text">{resume ? 'Inject ' + (resume.cursor + 1) + ' of ' + total + ' · score ' + (kept > 0 ? '+' : '') + kept : '~' + sim.minutes + ' min · ' + decisionCount + ' decisions'}</span>
            {resume
              ? <button className="btn btn-key" onClick={carryOn}>Continue</button>
              : <button className="btn btn-key" onClick={begin}>Take the chair</button>}
          </div>
        </section>
      )}

      {phase === 'one' && (
        <section className="band sim-one" data-keystone data-essence={essence}>
          <div className="label" style={{ marginBottom: 10 }}>One decision</div>
          <div className="org-line">{sim.org}</div>
          <span className="sector" style={{ marginBottom: 14 }}>{sim.sector}</span>
          <p className="sec sim-one-note">
            {oneN === 1 ? 'The opening of ' + sim.title + ', up to its first decision.' : 'Decision ' + oneN + ' of ' + calls.length + ' in ' + sim.title + '.'} It does not count toward your record.
          </p>
          {sofar.length > 0 && (
            <details className="sim-sofar">
              <summary>The room so far · {sofar.length} {sofar.length === 1 ? 'inject' : 'injects'}</summary>
              <div className="stack sim-sofar-body">
                {sofar.map(inj => (
                  <div key={inj.id} className={'panel inject past ch-' + inj.channel}>
                    {injectHead(inj)}
                    <p className="injecttext" style={{ margin: 0, whiteSpace: 'pre-line' }}>{inj.text}</p>
                  </div>
                ))}
              </div>
            </details>
          )}
          <div className="stack">
            {opening.map((inj, i) => (
              <div key={inj.id} className={'panel inject ch-' + inj.channel + (i === opening.length - 1 ? ' current' : ' past')}
                style={i === opening.length - 1 ? { borderColor: essence } : undefined}>
                <div className="row-between" style={{ marginBottom: 12, gap: 12 }}>
                  <span className="row" style={{ gap: 10 }}>
                    <span className="chan">{CHANNEL_LABEL[inj.channel] || inj.channel.toUpperCase()}</span>
                    <span className="from">{inj.from}</span>
                  </span>
                  <span className="clock">{inj.t}</span>
                </div>
                <p className="injecttext" style={{ margin: 0, whiteSpace: 'pre-line' }}>{inj.text}</p>
                {inj.decision && (
                  <div style={{ marginTop: 'var(--s4)' }}>
                    <UnitCounsel simId={sim.id} drill={inj.decision} roles={sim.roles} />
                    <DrillPlayer key={inj.decision.id} drill={inj.decision} onResolved={() => { setOneDone(true); tookOne(SIMS, sim.id, oneN); }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          {opening.length === 0 && <div className="empty">This room has no decision to take by itself.</div>}
          {(oneDone || opening.length === 0) && (
            <div className="row sim-one-next" style={{ marginTop: 'var(--s5)' }}>
              <button className="btn" onClick={another}>Another one</button>
              <button className="btn btn-key" onClick={() => d({ t: 'route', view: 'sim', id: sim.id })}>Take the whole room</button>
              <ShareLink route={{ view: 'sim', id: sim.id, sub: subOfCall(oneN) }} title={sim.title + ' · StepSAFE'} label="Share this decision" />
            </div>
          )}
        </section>
      )}

      {phase === 'live' && (
        <div className="sim-live">
        <div className="sim-feed">
          {/* the room's clock, how far through it is, and the score: in view the whole way */}
          <div className="sim-strip" role="status" aria-label={'Inject ' + (cursor + 1) + ' of ' + total + ', score ' + running}>
            <span className="sim-strip-clock">{current?.t}</span>
            <span className="sim-strip-step">Inject {cursor + 1} of {total}</span>
            <span className="sim-strip-score">Score {running > 0 ? '+' : ''}{running}</span>
            <span className="sim-strip-bar" aria-hidden><i style={{ transform: 'scaleX(' + ((cursor + 1) / total).toFixed(4) + ')' }} /></span>
          </div>
          <div className="stack">
            {sim.injects.slice(0, cursor + 1).map((inj, i) => (
              <div key={inj.id} id={'inj-' + inj.id} className={'panel inject ch-' + inj.channel + (i === cursor ? ' current' : ' past')}
                style={i === cursor ? { borderColor: essence } : undefined}
                data-keystone={i === cursor ? true : undefined} data-essence={essence}>
                <div className="row-between" style={{ marginBottom: 12, gap: 12 }}>
                  <span className="row" style={{ gap: 10 }}>
                    <span className="chan">{CHANNEL_LABEL[inj.channel] || inj.channel.toUpperCase()}</span>
                    <span className="from">{inj.from}</span>
                  </span>
                  <span className="clock">{inj.t}</span>
                </div>
                <p className="injecttext" style={{ margin: 0, whiteSpace: 'pre-line' }}>{inj.text}</p>
                {i === cursor && inj.decision && (
                  <div style={{ marginTop: 'var(--s4)' }}>
                    <UnitCounsel simId={sim.id} drill={inj.decision} roles={sim.roles} />
                    <DrillPlayer
                      key={inj.decision.id}
                      drill={inj.decision}
                      initial={trail.find(t => t.injectId === inj.id)?.chosenId}
                      onResolved={(score, best, chosenId) => {
                        setScores(v => [...v, score]);
                        setBests(v => [...v, best]);
                        setTrail(v => [...v, { injectId: inj.id, chosenId, score }]);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="row sim-next" style={{ justifyContent: 'flex-end', marginTop: 'var(--s4)' }}>
            {keptHere && <span className="sec sim-kept">Your place is kept on this device. Leave when you need to.</span>}
            <button
              className="btn btn-charge"
              disabled={!!(current?.decision && scores.length <
                sim.injects.slice(0, cursor + 1).filter(x => x.decision).length)}
              onClick={advance}
            >
              {cursor + 1 >= total ? 'End of exercise → debrief' : 'Continue ▸'}
            </button>
          </div>
        </div>
          {/* beside the feed on a wide screen: every inject so far, each one a way back to its card, and every call
              made with what it scored. A phone has the strip and the feed alone. */}
          <aside className="sim-rail" aria-label="The room so far">
            <div className="sim-rail-head">
              <span className="label">The room so far</span>
              <strong>{sim.title}</strong>
              <span className="sim-rail-org">{sim.org}</span>
            </div>
            <ol className="sim-rail-line">
              {sim.injects.slice(0, cursor + 1).map((inj, i) => (
                <li key={inj.id} className={(i === cursor ? 'now' : 'past') + ' ch-' + inj.channel + (inj.decision ? ' call' : '')}>
                  <button type="button" onClick={() => {
                    const calm = document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    document.getElementById('inj-' + inj.id)?.scrollIntoView({ block: 'start', behavior: calm ? 'auto' : 'smooth' });
                  }}>
                    <span className="sim-rail-t">{inj.t}</span>
                    <span className="sim-rail-ch">{CHANNEL_LABEL[inj.channel] || inj.channel.toUpperCase()}</span>
                    <span className="sim-rail-from">{inj.from}</span>
                  </button>
                </li>
              ))}
            </ol>
            {total - cursor - 1 > 0 && <p className="sim-rail-more">{total - cursor - 1} more to come</p>}
            {trail.length > 0 && (
              <div className="sim-rail-calls">
                <span className="label">Your calls</span>
                <ol>
                  {trail.map((t, k) => {
                    const o = sim.injects.find(x => x.id === t.injectId)?.decision?.options.find(x => x.id === t.chosenId);
                    return (
                      <li key={t.injectId} className={o?.isBest ? 'best' : t.score < 0 ? 'cost' : ''}>
                        <span className="sim-rail-n">{k + 1}</span>
                        <span className="sim-rail-call">{o?.label}</span>
                        <span className="sim-rail-score">{t.score > 0 ? '+' : ''}{t.score}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </aside>
        </div>
      )}

      {phase === 'debrief' && (
        <section className="band" data-keystone data-essence="#e8c46b">
          <div className="label" style={{ marginBottom: 12 }}>DEBRIEF</div>
          <RiseHead text="What the exercise argued." style={{ marginBottom: 'var(--s4)' }} />

          {/* A bare number teaches nothing. Say what this run actually was. */}
          {(() => {
            const total = scores.reduce((a, b) => a + b, 0);
            const clean = bests.filter(Boolean).length;
            const flawless = decisionCount > 0 && clean === decisionCount;
            const verdict = flawless
              ? 'You took the strongest option at every decision. That is rare, and it is worth knowing which of them you would still choose at three in the morning with worse information.'
              : total > 0
                ? 'You came out ahead. The decisions you did not take cleanly are the ones worth re-reading below — a positive total often hides one expensive call.'
                : total === 0
                  ? 'Net neutral. In a real room this is a survivable outcome that leaves questions on the table; find the decision that cost you and what you would need to have known.'
                  : 'This run cost you. That is what the room is for — every one of these decisions has been genuinely made by someone under this exact pressure, and the debrief below is what they learned.';
            return (
              <div className="panel" style={{ marginBottom: 'var(--s4)', borderColor: 'var(--gold)' }}>
                <div className="row" style={{ gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span className="chip gold">FINAL {total > 0 ? '+' : ''}{total}</span>
                  <span className="chip sig">{clean}/{decisionCount} decisions taken cleanly</span>
                  {flawless && <span className="chip gold">FLAWLESS COMMAND</span>}
                </div>
                <p className="big-sec" style={{ margin: 0 }}>{verdict}</p>
                {before && (
                  <p className="sec sim-before" style={{ margin: '12px 0 0' }}>
                    The run before, on {new Date(before.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}:{' '}
                    {before.score > 0 ? '+' : ''}{before.score}, with {before.clean} of {decisionCount} taken cleanly.
                  </p>
                )}
                {/* what this run earned, said here in place of notices that would cover the debrief */}
                {(() => {
                  const fresh = heldAtEnd ? Object.keys(s.awards).filter(id => !heldAtEnd.includes(id)).map(awardById).filter((a): a is NonNullable<typeof a> => !!a) : [];
                  if (!fresh.length && !firstRun) return null;
                  return (
                    <div className="sim-earned">
                      <span className="label">Earned in this room</span>
                      {firstRun && <p className="sim-earned-rt">+{sim.respect.toLocaleString()} respect · +{sim.trust.toLocaleString()} trust</p>}
                      {fresh.length > 0 && (
                        <ul className="sim-earned-list">
                          {fresh.map(a => (
                            <li key={a.id} className={'sim-earned-a t-' + a.tier}>
                              <span className="sim-earned-g" aria-hidden>{a.glyph}</span>
                              <span><strong>{a.name}</strong><em>{TIER_NAMES[a.tier]} · {a.statement}</em></span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          <div className="panel" style={{ marginBottom: 'var(--s4)' }}>
            <span className="label" style={{ display: 'block', marginBottom: 12 }}>Scoring dimensions</span>
            <div className="stack-sm">
              {[...sim.scoring].sort((a, b) => b.weight - a.weight).map((sc, i) => (
                <div key={i} className="judge-row">
                  <div className="row-between" style={{ marginBottom: 6 }}>
                    <strong>{sc.dimension}</strong>
                    <span className="chip sig">{sc.weight}%</span>
                  </div>
                  <div className="weightbar" aria-hidden><i style={{ width: sc.weight + '%' }} /></div>
                  <p className="sec" style={{ margin: '8px 0 0', fontSize: '0.96rem' }}>{sc.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* THE AFTER-ACTION REVIEW — the single most valuable artifact an
              exercise produces. Not a score: a decision-by-decision comparison
              of what you actually did against the strongest available move,
              with the reasoning attached, in the order it happened. */}
          {trail.length > 0 && (
            <div className="panel" style={{ marginBottom: 'var(--s4)' }}>
              <span className="label" style={{ display: 'block', marginBottom: 4 }}>
                Your decision trail — what you did, and what the room rewarded
              </span>
              <p className="sec" style={{ marginTop: 0, marginBottom: 'var(--s4)' }}>
                Read the ones you missed first. A decision you got right for a reason you cannot
                state is not yet yours.
              </p>
              <div className="stack-sm">
                {trail.map((t, i) => {
                  const inj = sim.injects.find(x => x.id === t.injectId);
                  const drill = inj?.decision;
                  if (!drill) return null;
                  const chosen = drill.options.find(o => o.id === t.chosenId);
                  const best = drill.options.find(o => o.isBest);
                  const clean = !!chosen?.isBest;
                  return (
                    <details className={'aar' + (clean ? ' clean' : ' missed')} key={i} open={!clean}>
                      <summary>
                        <span className="aar-n">{String(i + 1).padStart(2, '0')}</span>
                        <span className="aar-t">{inj?.t}</span>
                        <span className="aar-v">{clean ? 'STRONGEST MOVE' : 'MISSED'}</span>
                        <span className="aar-s">{t.score > 0 ? '+' : ''}{t.score}</span>
                      </summary>
                      <div className="aar-body">
                        <p className="sec" style={{ marginTop: 0 }}><strong>The call:</strong> {drill.prompt}</p>
                        <div className="aar-pick">
                          <span className="label">YOU CHOSE</span>
                          <p style={{ margin: '6px 0 0' }}>{chosen?.label}</p>
                          {chosen?.ripple && (
                            <p className="sec" style={{ margin: '8px 0 0' }}>
                              <strong>What surfaced later:</strong> {chosen.ripple}
                            </p>
                          )}
                        </div>
                        {before && before.picks[t.injectId] && before.picks[t.injectId] !== t.chosenId && (
                          <div className="aar-pick was">
                            <span className="label">THE RUN BEFORE</span>
                            <p style={{ margin: '6px 0 0' }}>{drill.options.find(o => o.id === before.picks[t.injectId])?.label}</p>
                          </div>
                        )}
                        {!clean && best && (
                          <div className="aar-pick best">
                            <span className="label">THE STRONGER MOVE</span>
                            <p style={{ margin: '6px 0 0' }}>{best.label}</p>
                            <p className="sec" style={{ margin: '8px 0 0' }}>{best.outcome}</p>
                          </div>
                        )}
                        <p className="statement e-gold" style={{ marginTop: 'var(--s3)' }}>{drill.principle}</p>
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          )}

          <div className="stack">
            {sim.debrief.map((db, i) => (
              <div className="panel panel-2" key={i}>
                <h4 style={{ marginBottom: 10 }}>{db.title}</h4>
                <p className="sec" style={{ margin: 0, whiteSpace: 'pre-line' }}>{db.body}</p>
              </div>
            ))}
          </div>

          {/* the way on: the chapter this room stands on, with how much of it the learner has done */}
          {chapter && (
            <div className="panel sim-from" style={{ marginTop: 'var(--s4)' }}>
              <span className="label" style={{ display: 'block', marginBottom: 8 }}>From here</span>
              <p className="big-sec" style={{ margin: '0 0 14px' }}>
                This room stands on {chapter.title}. You have finished {chapterDone} of its {chapterSteps.length} Steps.
              </p>
              <div className="row sim-from-row">
                <button className="btn" onClick={() => d({ t: 'route', view: 'chapter', id: chapter.id })}>Open {chapter.title}</button>
                <button className="btn btn-ghost" onClick={() => requestExam(d, { label: chapter.title, pool: chapterSteps.map(st => 'step:' + st.id), n: 20, expand: true })}>Test me on this chapter</button>
              </div>
            </div>
          )}

          <div className="row sim-end" style={{ marginTop: 'var(--s5)' }}>
            <button className="btn" onClick={() => { setCursor(0); setScores([]); setBests([]); setTrail([]); setResume(null); setPhase('brief'); }}>
              Run it again
            </button>
            <button className="btn btn-key" onClick={() => d({ t: 'route', view: 'practice' })}>
              Back to The Practice
            </button>
            <ShareLink route={{ view: 'sim', id: sim.id }} title={sim.title + ' · StepSAFE'} label="Share this run"
              text={sim.title + ': ' + (running > 0 ? '+' : '') + running + ', ' + bests.filter(Boolean).length + ' of ' + decisionCount + ' decisions taken cleanly.'} />
          </div>
        </section>
      )}
    </div>
  );
}
