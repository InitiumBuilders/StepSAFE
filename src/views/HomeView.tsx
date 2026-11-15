/* HOME: the daily ground. A visitor who has not begun meets the threshold (views/Arrival.tsx) instead.
   Statement: you do not receive a unit. You build one, step by step. */

import React, { useEffect } from 'react';
import { CHAPTERS, SIMS } from '../content/registry';
import { useS, unitPhase, PHASE_NAMES, PHASE_MEANING, rankOf, nextRank } from '../lib/state';
import { useEngine } from '../lib/engine';
import { Vessel, SectionHead } from '../components/bits';
import { gaugeOfTheDay } from '../content/modux/gauges';
import { chargeKeystone } from '../lib/swarm';
import { ServiceRecord } from '../components/ServiceRecord';
import { Goals } from '../components/Goals';
import { Focus } from '../components/Focus';
import { weekChallenge, heldThisWeek } from '../content/modux/week';
import { dueIds, fudIds, studyRoute } from '../lib/study/session';
import { localDay } from '../lib/day';
import { roomsKept } from '../lib/roomProgress';
import { WayIn } from '../components/OneCallCard';
import { useChecks } from '../lib/checkstore';
import { checkKind } from '../content/check';
import { scoreCheck } from '../lib/check';
import { KeyRing } from '../components/CheckRing';

export function HomeView() {
  const { s, d } = useS();
  const treasury = useChecks();
  const eng = useEngine();

  useEffect(() => { chargeKeystone(); }, [s.onboarded]);

  /* the watch: three moves a day, each lit when it is done today; kept once all three are */
  const todayKey = localDay();
  const isToday = (t: number) => localDay(t) === todayKey;
  const stepToday = Object.values(s.completedSteps).some(isToday);
  const roomToday = Object.values(s.completedSims).some(x => isToday(x.at));
  const gaugeToday = s.runLog.some(r => isToday(r.at));
  const kept = [stepToday, roomToday, gaugeToday].filter(Boolean).length;
  useEffect(() => {
    if (s.onboarded && kept === 3 && s.lastWatch !== todayKey) eng.keepWatch(todayKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kept, todayKey, s.onboarded, s.lastWatch]);

  /* a visitor who has not begun meets the threshold (views/Arrival.tsx), never this page */
  if (!s.onboarded) return null;

  const phase = unitPhase(s, CHAPTERS.length);
  const rank = rankOf(s.respect);
  const next = nextRank(s.respect);
  const stepsDone = Object.keys(s.completedSteps).length;
  const totalSteps = CHAPTERS.reduce((n, c) => n + c.pages.reduce((m, p) => m + p.steps.length, 0), 0);
  const pagesDone = Object.keys(s.completedPages).length;
  const totalPages = CHAPTERS.reduce((n, c) => n + c.pages.length, 0);

  /* the next Step in curriculum order. `begun` says an earlier Step of its chapter is sealed: then the row opens
     the Step itself, and a chapter not yet begun opens at its own page first. */
  const nextStep = (() => {
    for (const c of CHAPTERS) {
      let begun = false;
      for (const p of c.pages)
        for (const st of p.steps) {
          if (!s.completedSteps[st.id]) return { id: st.id, title: st.title, chapter: c.title, chapterId: c.id, begun };
          begun = true;
        }
    }
    return null;
  })();

  /* a room left part way comes first; then the first room not yet commanded */
  const goingSim = roomsKept().map(k => SIMS.find(m => m.id === k.id)).find(Boolean);
  const openSim = goingSim || SIMS.find(m => !s.completedSims[m.id]);

  return (
    <div className="wrap">
      <SectionHead sigil="seed"
        kicker={PHASE_NAMES[phase] + ' · ' + rank.name.toUpperCase() + ' · DAY STREAK ' + s.streak}
        title={(stepsDone || Object.keys(s.completedSims).length || s.runLog.length ? 'Welcome back, ' : 'Welcome, ') + s.handle + '.'}
        lede={PHASE_MEANING[phase]}
      />

      {/* the shortest way into practice, one tap from opening the app: the room left part way, or one decision */}
      <WayIn />

      {(() => {
        const t = gaugeOfTheDay();
        const moves: { on: boolean; kicker: string; title: string; sub: string; go?: () => void }[] = [
          { on: stepToday, kicker: 'A STEP', title: nextStep ? nextStep.title : 'Every Step taken', sub: nextStep ? nextStep.chapter : 'The path is complete', go: nextStep ? () => d(nextStep.begun ? { t: 'route', view: 'step', id: nextStep.id } : { t: 'route', view: 'chapter', id: nextStep.chapterId }) : undefined },
          { on: roomToday, kicker: 'A ROOM', title: openSim ? openSim.title : 'Every room commanded', sub: openSim ? openSim.org + (goingSim ? ' · in progress' : '') : 'The Practice is complete', go: openSim ? () => d({ t: 'route', view: 'sim', id: openSim.id, sub: goingSim ? 'resume' : undefined }) : undefined },
          { on: gaugeToday, kicker: 'THE GAUGE', title: t.title, sub: t.org, go: () => d({ t: 'route', view: 'modux-gauge', id: t.id }) },
        ];
        /* the week rides with the watch: a fourth move, held once a week, the same for everyone */
        const w = weekChallenge();
        const weekHeld = heldThisWeek(s.runLog);
        const fmtD = (x: Date) => x.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
        /* StudyMode rides under the watch: what is due, what sits in the FUD range, and today's UNITIA */
        const localDay = (() => { const dt = new Date(); return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); })();
        const dueNow = dueIds(s.study);
        const fudNow = fudIds(s.study);
        const reviewedToday = Object.values(s.study).filter(c => c.reviewDay === localDay).length;
        const unitiaToday = s.unitiaDays[localDay] || 0;
        const weekMove = { on: weekHeld, kicker: 'THE WEEK · ' + fmtD(w.monday) + ' TO ' + fmtD(w.sunday).toUpperCase(), title: w.pressure.name + ' on ' + w.gauge.title, sub: weekHeld ? 'Held this week' : 'Hold it at notch one. The same day for everyone this week.', go: () => d({ t: 'route', view: 'modux-gauge', id: w.gauge.id, sub: 'week:' + w.pressure.id }) };
        return (
          <section className="band" style={{ paddingTop: 0 }} data-keystone data-essence="#a78bff">
            <div className="panel">
              <div className="row-between" style={{ marginBottom: 'var(--s3)', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <span className="label" style={{ display: 'block', marginBottom: 6 }}>TODAY'S WATCH</span>
                  <h3 className={kept === 3 ? 'watch-kept' : ''}>{kept === 3 ? 'Watch kept' : kept + ' of 3 kept'}</h3>
                </div>
                <span className="chip on">Day streak {s.streak}</span>
              </div>
              <p className="sec" style={{ margin: 0 }}>Three moves a day: a Step, a room in The Practice, and today's gauge. Each one you finish today lights here. The fourth is the week's pressure, held once a week.</p>
              <ul className="watch-list watch-four">
                {[...moves, weekMove].map(m => (
                  <li key={m.kicker} className={m.on ? 'on' : ''}>
                    <button onClick={m.go} disabled={!m.go} aria-pressed={m.on}>
                      <i className="watch-ring" aria-hidden />
                      <span><small>{m.kicker}{m.on ? ' · DONE TODAY' : ''}</small><strong>{m.title}</strong><em>{m.sub}</em></span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="watch-study">
                <span>
                  <small>STUDYMODE</small>
                  <strong>{dueNow.length ? dueNow.length + (dueNow.length === 1 ? ' card due for review' : ' cards due for review') : reviewedToday ? reviewedToday + (reviewedToday === 1 ? ' card reviewed today' : ' cards reviewed today') : 'Every concept, one deck'}</strong>
                  <em>{fudNow.length ? fudNow.length + ' in the FUD range · ' : ''}+{(unitiaToday / 100).toFixed(2)} UNITIA today</em>
                </span>
                <button className="btn btn-sm" onClick={() => { if (!dueNow.length || !studyRoute(d, dueNow, 'Due now', s.unitiaC)) d({ t: 'route', view: 'study' }); }}>{dueNow.length ? 'Review them' : 'Open StudyMode'}</button>
              </div>
              {(() => {
                /* the latest run of any check, drawn as its ring; an unfinished one opens straight to its statement */
                const ck = treasury.checks[0];
                const k = checkKind(ck?.kind);
                const sc = ck ? scoreCheck(ck) : null;
                const open = ck && !ck.done ? sc!.answered : null;
                const sealed = !ck && treasury.status === 'locked';
                return (
                  <div className="watch-study ck-door">
                    <KeyRing kind={k} answers={ck?.answers || {}} sc={sc} closed={!!sc?.allHeld} mini />
                    <span>
                      <small>DASH DEFENDERS</small>
                      <strong>Checks before launch</strong>
                      <em>{open !== null ? k.name + ': ' + open + ' of 12 answered' : ck ? k.name + ': ' + sc!.held + ' of ' + sc!.applies + ' held, ' + new Date(ck.done || ck.at).toLocaleDateString() : sealed ? 'Your checks are sealed on this device' : 'Five checks, from the treasury to the worst day'}</em>
                    </span>
                    <button className="btn btn-sm" onClick={() => d(open !== null ? { t: 'route', view: 'check', id: k.id } : { t: 'route', view: 'check' })}>{open !== null ? 'Continue the check' : ck || sealed ? 'Open the checks' : 'Begin a check'}</button>
                  </div>
                );
              })()}
            </div>
          </section>
        );
      })()}


      <section className="band band-tight">
        <Focus />
      </section>

      <section className="band band-tight">
        <Goals compact />
      </section>

      <section className="band band-tight">
        <ServiceRecord strip />
      </section>

      <section className="band band-tight">
        <div className="panel">
          <div className="row-between" style={{ marginBottom: 'var(--s4)' }}>
            <h3>The road so far</h3>
            <span className="chip on">{stepsDone} / {totalSteps} steps</span>
          </div>
          <div className="stack">
            <Vessel value={stepsDone} max={totalSteps} label="Steps taken" />
            <Vessel value={pagesDone} max={totalPages} label="Pages earned" />
            {next && (
              <Vessel value={s.respect - rank.min} max={next.min - rank.min}
                label={'Respect toward ' + next.name} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
