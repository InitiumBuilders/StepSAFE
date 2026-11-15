/* The engine — where an action becomes progression.
   One place turns "the learner did X" into: respect, trust, page seals,
   chapter locks, unit members arriving, Seva speaking, awards landing,
   the tab itself evolving. */

import { useCallback, useEffect, useRef } from 'react';
import {
  CHAPTERS, SEVA_LINES, ESSENCE_HEX, awardById, memberById, pageById, stepById, simById,
} from '../content/registry';
import { MILESTONES } from '../content/wiring';
import { HOOKS } from '../content/hooks';
import type { Step, SimModule } from '../content/schema';
import type { ModuxGauge } from '../content/modux-schema';
import type { GaugeResult, ReferenceResult } from '../content/modux/score';
import { GAUGES } from '../content/modux/gauges';
import { GUIDES, MODUX_MODELS, moduxById } from '../content/registry';
import { buildModel, stressDay } from '../content/modux/dynamics';
import { peopleCount } from './people';
import { Sound } from './sound';
import { Field } from './field';
import { rewardFor, type Reward } from '../content/modux/gratus';
import { useS, uid, unitPhase, PHASE_NAMES, sevasReady, type S } from './state';
import { useToast, TIER_NAMES } from '../components/bits';
import { Swarm } from './swarm';
import { KNOWN_FIRST, OUTLIER_OPENED } from './outlier';

function sevaLine(trigger: string): string | null {
  const hits = SEVA_LINES.filter(l => l.trigger === trigger);
  if (!hits.length) return null;
  return hits[Math.floor(Math.random() * hits.length)].text;
}

export function strongCount(s: S): number {
  let n = 0;
  for (const id of Object.keys(s.awards)) {
    const a = awardById(id);
    if (a && a.tier === 'strong') n++;
  }
  return n;
}

/* The behavioural awards are earned by how a learner moves, not by which Step
   they opened. This reads the whole record and reports which trigger counters
   currently stand, so hooks can be evaluated against it after any event. */
const SYSTEMS_SHELF = GUIDES.filter(g => g.domain === 'Systems').map(g => g.id);
const MODEL_BY_ID = new Map(MODUX_MODELS.map(m => [m.id, m]));

export function counters(s: S, totalChapters: number): Record<string, number> {
  /* an act is complete when every chapter belonging to it is locked in */
  const actsAll = new Map<string, number>();
  const actsDone = new Map<string, number>();
  for (const c of CHAPTERS) {
    actsAll.set(c.act, (actsAll.get(c.act) || 0) + 1);
    if (s.completedChapters[c.id]) actsDone.set(c.act, (actsDone.get(c.act) || 0) + 1);
  }
  let actsComplete = 0;
  for (const [act, total] of actsAll) if ((actsDone.get(act) || 0) >= total) actsComplete++;
  const projectsComplete = s.projects.filter(p => p.status === 'complete').length;
  const study = Object.values(s.study || {});
  return {
    'first-step': Object.keys(s.completedSteps).length ? 1 : 0,
    'first-page': Object.keys(s.completedPages).length ? 1 : 0,
    'first-chapter': Object.keys(s.completedChapters).length ? 1 : 0,
    'first-sim': Object.keys(s.completedSims).length ? 1 : 0,
    'first-guide': Object.keys(s.guidesRead).length ? 1 : 0,
    'first-project': s.projects.length ? 1 : 0,
    'first-attestation': s.attestations.length ? 1 : 0,
    'wallet-linked': s.wallet ? 1 : 0,
    'sevas-emergence': s.sevaEvolved ? 1 : 0,
    'motus-mode': s.mode === 'motus' ? 1 : 0,
    'steps-total': Object.keys(s.completedSteps).length,
    'pages-total': Object.keys(s.completedPages).length,
    'chapters-total': Object.keys(s.completedChapters).length,
    'sims-total': Object.keys(s.completedSims).length,
    'guides-total': Object.keys(s.guidesRead).length,
    'projects-complete': projectsComplete,
    'drills-perfect': Object.keys(s.perfectDrills).length,
    'drill-recovered': Object.keys(s.recoveredDrills).length,
    'reviews-cleared': s.reviewsCleared,
    'streak-days': s.streak,
    'unit-size': s.unitMembers.length,
    'sim-flawless': Object.keys(s.flawlessSims).length,
    'act-complete': actsComplete,
    'systems-shelf': SYSTEMS_SHELF.every(id => s.guidesRead[id]) ? 1 : 0,
    'watches-kept': s.watchesKept,
    /* StudyMode, read from the study record on the device */
    'cards-met': study.filter(c => c.views || c.reviews).length,
    'cards-held': study.filter(c => (c.box || 0) >= 4).length,
    'own-words': study.filter(c => !!(c.ownWords && c.ownWords.trim())).length,
    'fud-cleared': study.filter(c => { const log = c.soundLog || []; const i = log.findIndex(l => l.v < 1); return i >= 0 && log.slice(i + 1).some(l => l.v >= 56); }).length,
    'study-kinds': new Set(Object.entries(s.study || {}).filter(([, c]) => c.views || c.reviews).map(([id]) => id.split(':')[0])).size,
    'unitia': Math.floor((s.unitiaC || 0) / 100),
    'exams-taken': (s.exams || []).length,
    'exam-perfect': (s.exams || []).filter(e => e.n >= 20 && e.right === e.n).length,
  };
}

export function useEngine() {
  const { s, d } = useS();
  const { push } = useToast();

  /* Two triggers can grant the same award inside one event (a milestone and a
     hook both fire on the first Step). The state check alone misses that,
     because `s` is stale until the next render, so the award was paid twice.
     This set remembers grants until the state catches up. */
  const pendingRef = useRef<Set<string>>(new Set());
  useEffect(() => { pendingRef.current.clear(); }, [s.awards]);

  const speak = useCallback(
    (trigger: string, fallback?: string) => {
      const text = sevaLine(trigger) || fallback;
      if (!text) return;
      d({ t: 'seva-msg', msg: { id: uid(), from: 'seva', text, at: Date.now(), tone: trigger } });
    },
    [d]
  );

  const grant = useCallback(
    /* inPlace: the page that earned it shows the milestone itself, so no toast covers that moment */
    (awardId: string, inPlace = false) => {
      if (s.awards[awardId] || pendingRef.current.has(awardId)) return;
      const a = awardById(awardId);
      if (!a) return;
      pendingRef.current.add(awardId);
      d({ t: 'award', awardId });
      d({ t: 'earn', respect: a.respect, trust: a.trust });
      speak(a.tier + '-step-earned');
      if (inPlace) return;
      push({
        title: TIER_NAMES[a.tier] + ' · ' + a.name,
        body: a.statement,
        gold: a.tier === 'safe',
      });
      /* A SAFEStep is the rarest thing in the product — it gets the room.
         SmallSteps land quietly; a hundred of them should not feel like a
         hundred ceremonies. */
      Swarm.summon(a.tier === 'safe' ? 'seal' : a.tier === 'strong' ? 'mark' : 'note',
        { x: window.innerWidth - 170, y: window.innerHeight - 130 });
    },
    [s.awards, d, push, speak]
  );

  const fireMilestone = useCallback(
    (key: string) => {
      for (const id of MILESTONES[key] || []) grant(id);
    },
    [grant]
  );

  /** Evaluate every behavioural hook against the record as it will stand after
      the current event. Pass a projection of the next state so awards land on
      the action that earned them, not one action later. */
  const evaluateHooks = useCallback(
    (next: S) => {
      const c = counters(next, CHAPTERS.length);
      for (const h of HOOKS) {
        const v = c[h.trigger];
        if (v === undefined) continue;
        if (v >= (h.threshold ?? 1)) for (const id of h.awards) grant(id);
      }
      checkUnitArrivals(next);
    },
    [grant] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /** Four members are not tied to a chapter — they arrive when the journey
      itself earns them. The red team and people security join a formation
      mature enough to be worth attacking and worth protecting from within;
      the recovery engineer arrives the first time you bring a failure back;
      the voice arrives for the final emergence. */
  const joinMember = useCallback(
    (memberId: string, line: string) => {
      if (s.unitMembers.includes(memberId)) return;
      const m = memberById(memberId);
      if (!m) return;
      d({ t: 'unit-join', memberId });
      push({ title: m.callsign + ' joins your unit', body: m.role, gold: true });
      d({ t: 'seva-msg', msg: { id: uid(), from: 'seva', at: Date.now(), tone: 'unit-member-joined', text: line } });
      Swarm.summon('seal', undefined, ESSENCE_HEX[m.essence]);
    },
    [s.unitMembers, d, push]
  );

  const checkUnitArrivals = useCallback(
    (next: S) => {
      const phase = unitPhase(next, CHAPTERS.length);
      if (phase >= 3) {
        joinMember('u-mirror',
          'MIRROR has taken a seat: adversary emulation and red team lead. Your unit now has someone who tests it the way an attacker would.');
        joinMember('u-hearth',
          'HEARTH has taken a seat. Every control you have built runs on people; now someone watches the room itself.');
      }
      if (Object.keys(next.recoveredDrills).length >= 1) {
        joinMember('u-tide',
          'TIDE has taken a seat: resilience and recovery. You answered a drill you had missed before, and recovery now has an engineer.');
      }
      if (phase >= 4) {
        joinMember('u-voice',
          'VOICE has taken the last seat: crisis communications and the board. When your work has to reach the people who can act on it, VOICE carries it.');
      }
    },
    [joinMember]
  );

  /** Everything that follows from finishing a Step. */
  const finishStep = useCallback(
    (step: Step) => {
      if (s.completedSteps[step.id]) return;
      const loc = stepById(step.id);
      d({ t: 'step-done', stepId: step.id, respect: step.respect, trust: step.trust });
      d({ t: 'touch-day' });
      push({ title: 'Step complete · ' + step.title, body: '+' + step.respect + ' respect · +' + step.trust + ' trust' });

      const done = { ...s.completedSteps, [step.id]: Date.now() };
      const isFirst = Object.keys(s.completedSteps).length === 0;
      if (isFirst) {
        speak('first-step', 'First step taken.');
        fireMilestone('first-step');
      } else {
        speak('step-done');
      }
      for (const aid of step.awards || []) grant(aid);

      /* Modux study: the first model, and a model in every family */
      if (step.id.includes('--mm-')) {
        const mxBefore = Object.keys(s.completedSteps).filter(id => id.includes('--mm-'));
        if (mxBefore.length === 0) grant('small-mx-first-model');
        const fams = new Set<string>();
        for (const id of [...mxBefore, step.id]) {
          const m = moduxById(id.split('--')[1]);
          if (m) fams.add(m.family);
        }
        if (fams.size >= 12) grant('strong-mx-twelve-families');
      }

      if (!loc) return;
      const { chapter, page } = loc;

      // page seal
      if (!s.completedPages[page.id] && page.steps.every(st => done[st.id])) {
        d({ t: 'page-done', pageId: page.id });
        push({ title: 'PAGE EARNED · ' + page.title, body: page.credential, gold: true });
        const firstPage = Object.keys(s.completedPages).length === 0;
        speak(firstPage ? 'first-page' : 'page-earned',
          'A Page is sealed: ' + page.title + '. It now lives on your Praxis Profile.');
        if (firstPage) fireMilestone('first-page');
        Swarm.summon('mark');

        // chapter lock-in
        const pagesDone = { ...s.completedPages, [page.id]: Date.now() };
        if (!s.completedChapters[chapter.id] && chapter.pages.every(p => pagesDone[p.id])) {
          d({ t: 'chapter-done', chapterId: chapter.id });
          if (chapter.id.startsWith('mx-')) grant('strong-mx-course-' + chapter.id);
          push({ title: 'CHAPTER LOCKED IN · ' + chapter.title, body: 'The whole arc, solidified.', gold: true });
          const firstCh = Object.keys(s.completedChapters).length === 0;
          speak(firstCh ? 'first-chapter' : 'chapter-done');
          if (firstCh) fireMilestone('first-chapter');
          /* a whole arc solidified — the room changes */
          Swarm.summon('seal');

          // a unit member arrives with the chapter
          if (chapter.unitUnlock && !s.unitMembers.includes(chapter.unitUnlock)) {
            const m = memberById(chapter.unitUnlock);
            if (m) {
              d({ t: 'unit-join', memberId: m.id });
              push({ title: m.callsign + ' joins your unit', body: m.role, gold: true });
              d({ t: 'seva-msg', msg: { id: uid(), from: 'seva', at: Date.now(), tone: 'unit-member-joined',
                text: sevaLine('unit-member-joined') || (m.callsign + ' has taken their seat. ' + m.role + '.') } });
            }
          }

          // phase transition check
          const before = unitPhase(s, CHAPTERS.length);
          const after = unitPhase(
            { ...s, completedSteps: done, completedPages: pagesDone,
              completedChapters: { ...s.completedChapters, [chapter.id]: Date.now() } },
            CHAPTERS.length
          );
          if (after > before) {
            const trig = after === 2 ? 'phase-zun' : after === 3 ? 'phase-the-unit' : 'phase-unitium';
            push({ title: 'YOUR UNIT EVOLVES · ' + PHASE_NAMES[after], gold: true });
            speak(trig, 'Look at the rail. The name has changed. You changed it.');
            Swarm.startle();
          }
        }
      }

      // phase check on steps alone (UNIT ONE -> UNIT ZUN can happen off a step)
      const before = unitPhase(s, CHAPTERS.length);
      const after = unitPhase({ ...s, completedSteps: done }, CHAPTERS.length);
      if (after > before) {
        push({ title: 'YOUR UNIT EVOLVES · ' + PHASE_NAMES[after], gold: true });
        speak(after === 2 ? 'phase-zun' : after === 3 ? 'phase-the-unit' : 'phase-unitium');
      }

      // sevas emergence check
      if (sevasReady({ ...s, completedSteps: done }, strongCount(s))) {
        d({ t: 'route', view: 'seva', sub: 'emergence' });
      }

      // behavioural awards, evaluated against the record as it now stands
      const pagesDone = page.steps.every(st => done[st.id])
        ? { ...s.completedPages, [page.id]: Date.now() } : s.completedPages;
      const chaptersDone = chapter.pages.every(p => pagesDone[p.id])
        ? { ...s.completedChapters, [chapter.id]: Date.now() } : s.completedChapters;
      evaluateHooks({ ...s, completedSteps: done, completedPages: pagesDone, completedChapters: chaptersDone });
    },
    [s, d, push, speak, grant, fireMilestone, evaluateHooks]
  );

  const finishSim = useCallback(
    (sim: SimModule, score: number, flawless = false) => {
      const already = !!s.completedSims[sim.id];
      d({ t: 'sim-done', simId: sim.id, score,
        respect: already ? 0 : sim.respect, trust: already ? 0 : sim.trust });
      d({ t: 'touch-day' });
      if (flawless) d({ t: 'sim-flawless', simId: sim.id });
      if (!already) {
        push({ title: 'Simulation complete · ' + sim.title, body: '+' + sim.respect + ' respect · +' + sim.trust + ' trust' });
        speak(score >= 0 ? 'sim-completed' : 'sim-failed');
        if (score >= 0) for (const aid of sim.awards || []) grant(aid);
        if (Object.keys(s.completedSims).length === 0) fireMilestone('first-sim');
      } else {
        push({ title: 'Simulation re-run · ' + sim.title, body: 'Score ' + score });
      }
      evaluateHooks({
        ...s,
        completedSims: { ...s.completedSims, [sim.id]: { at: Date.now(), score } },
        flawlessSims: flawless ? { ...s.flawlessSims, [sim.id]: Date.now() } : s.flawlessSims,
      });
    },
    [s, d, push, speak, grant, fireMilestone, evaluateHooks]
  );

  /** A due review answered. Wrong answers reset the interval; clean ones expand it. */
  const reviewResult = useCallback(
    (drillId: string, passed: boolean) => {
      d({ t: 'review-result', drillId, passed });
      d({ t: 'touch-day' });
      if (passed) {
        const r = s.reviews[drillId];
        const recovered = r && r.lapses > 0;
        if (recovered) speak('review-recovered',
          'You missed that one before and answered it this time.');
        /* project the pass AND the recovery, so hooks (and TIDE's arrival) fire
           on the action that earned them rather than one event later */
        evaluateHooks({
          ...s,
          reviewsCleared: s.reviewsCleared + 1,
          recoveredDrills: recovered && !s.recoveredDrills[drillId]
            ? { ...s.recoveredDrills, [drillId]: Date.now() }
            : s.recoveredDrills,
        });
      } else {
        speak('review-lapsed', 'Back to the start of the queue. A lapse found now costs a review; found in an incident it costs the incident.');
      }
    },
    [s, d, speak, evaluateHooks]
  );

  const readGuide = useCallback(
    (guideId: string) => {
      if (s.guidesRead[guideId]) return;
      d({ t: 'guide-read', guideId });
      const n = Object.keys(s.guidesRead).length + 1;
      if (n === 1) { speak('guide-read'); fireMilestone('first-guide'); }
      if (n === 10) fireMilestone('ten-guides');
      evaluateHooks({ ...s, guidesRead: { ...s.guidesRead, [guideId]: Date.now() } });
    },
    [s, d, speak, fireMilestone, evaluateHooks]
  );

  const linkWallet = useCallback(
    (address: string, chainId: string, label: string) => {
      d({ t: 'wallet', wallet: { address, chainId, label } });
      push({ title: 'Wallet linked', body: label + ' · read only. StepSAFE can see the address and cannot sign or send.' });
      speak('wallet-linked');
      fireMilestone('wallet-linked');
      evaluateHooks({ ...s, wallet: { address, chainId, label } });
    },
    [s, d, push, speak, fireMilestone, evaluateHooks]
  );

  const mintDraft = useCallback(
    () => {
      speak('atom-minted');
      fireMilestone('first-attestation');
      evaluateHooks(s);
    },
    [s, speak, fireMilestone, evaluateHooks]
  );

  /** A gauge run: record it, pay respect only for improvement, pay gratus
      and Gratus Gold by the rules in gratus.ts, grant awards. Returns the
      reward so the view can mark the moment. */
  const finishGauge = useCallback(
    (g: {
      gauge: ModuxGauge; notch: number; result: GaugeResult; ref: ReferenceResult;
      stack: string[]; motrusCount: number; motrusSound: boolean; weakened?: string[]; seed?: string; week?: string;
    }): Reward => {
      const { gauge, notch, result: r, ref } = g;
      const prev = s.gauges[gauge.id];
      const lv = prev?.levels[String(notch)];
      const hadBeyond = s.golds.some(x => x.gauge === gauge.id && x.why === 'beyond');
      const rw = rewardFor({
        notch, result: r, ref, prevLevel: lv, hadBeyond,
        motrusCount: g.motrusCount, motrusSound: g.motrusSound,
      });
      const gain = Math.max(0, r.score - (lv?.best ?? 0));
      /* a held stack earns double. A breach earns for improving only at Ground:
         each notch starts from zero, so paying breaches there would pay for
         pressing the notch button */
      const respect = rw.held ? gain * 2 : notch === 0 ? gain : 0;
      const trust = (rw.firstHoldHere && notch >= 3 ? 3 : 0) + (rw.gold ? 10 : 0);
      const fams = [...new Set(g.stack.map(id => moduxById(id)?.family).filter(Boolean) as string[])];
      const goldMoment = rw.gold
        ? { gauge: gauge.id, title: gauge.title, notch, score: r.score, ref: ref.result.score, at: Date.now(), why: rw.gold }
        : null;

      d({
        t: 'gauge-done', gaugeId: gauge.id, notch, score: r.score, stack: g.stack,
        held: rw.held, beatRef: rw.beatRef, gratus: rw.gratus, gold: goldMoment,
        log: {
          g: gauge.id, title: gauge.title, notch, score: r.score, ref: ref.result.score,
          held: rw.held, at: Date.now(), fams, motrus: g.motrusCount, ...(g.week ? { week: g.week } : {}),
        },
      });
      d({ t: 'touch-day' });
      if (respect + trust > 0) d({ t: 'earn', respect, trust });
      push({
        title: (rw.held ? 'Holds' : 'Breached') + ' · ' + gauge.title + (notch ? ' · notch ' + notch : ''),
        body: 'Score ' + r.score + ' · reference ' + ref.result.score +
          (respect > 0 ? ' · +' + respect + ' respect' : '') +
          (rw.gratus > 0 ? ' · +' + rw.gratus + ' gratus' : ''),
        gold: !!rw.gold,
      });

      if (Object.keys(s.gauges).length === 0) grant('small-mx-first-trial');
      if (rw.held) grant('strong-mx-trial-holds');
      if (rw.held && r.heavyDepth) grant('strong-mx-heavy-depth');
      if (rw.beatRef) grant('strong-mx-match-reference');
      if (notch >= 1) grant('small-mx-first-notch');
      if (rw.held && notch >= 3) grant('strong-mx-hold-systemic');
      if (rw.held && notch >= 5) grant('strong-mx-hold-wicked');
      if (rw.held && notch >= 7) grant('strong-mx-hold-outlier');
      if (gauge.origin === 'forged') grant('small-mx-forged');
      if (rw.held && g.motrusCount > 0 && g.motrusSound) grant('strong-mx-motrus-holds');
      if (rw.held && ref.coverable === false) grant('strong-mx-past-ceiling');
      if (rw.gold) grant('strong-mx-gratus-gold');
      if (rw.held && gauge.seed === 'own') grant('strong-own-held');
      if (rw.held && g.week) grant('strong-week-held');

      /* the people held for, across the record as it will stand after this run */
      const sectorOf = (id: string) => (GAUGES.find(x => x.id === id) || s.forged.find(x => x.id === id))?.sector || '';
      let people = 0;
      for (const [id, rec] of Object.entries(s.gauges)) if (rec.held && id !== gauge.id) people += peopleCount(sectorOf(id));
      if (rw.held || prev?.held) people += peopleCount(gauge.sector);
      if (people >= 10000) grant('small-held-ten-thousand');
      if (people >= 100000) grant('strong-held-hundred-thousand');
      if (people >= 1000000) grant('strong-held-million');
      /* a full day: the stress day with this stack loses no more than half an hour */
      if (rw.held && stressDay(buildModel(gauge, g.stack, MODEL_BY_ID, [], new Set(g.weakened || []))) <= 0.5) grant('strong-full-day-kept');

      /* the nine authored gauges at Ground */
      const ground = (id: string, k: 'held' | 'beatRef') =>
        id === gauge.id && notch === 0 ? rw[k] || !!lv?.[k] : !!s.gauges[id]?.levels['0']?.[k];
      if (GAUGES.every(x => ground(x.id, 'held'))) grant('strong-mx-all-trials-held');
      if (GAUGES.every(x => ground(x.id, 'beatRef'))) grant('strong-mx-all-references');
      return rw;
    },
    [s.gauges, s.golds, d, push, grant]
  );

  /** A MoTRUS model was minted (kept or for this gauge only). */
  const mintedMotrus = useCallback(() => { grant('small-mx-first-motrus'); }, [grant]);

  /** the day's watch kept: a Step, a room and the gauge, all today; once per day */
  const keepWatch = useCallback(
    (day: string) => {
      if (s.lastWatch === day) return;
      d({ t: 'watch-kept', day });
      Sound.gratus();
      Field.pulse(undefined, '#f0d48c', 'emergence');
      push({ title: 'Watch kept', body: 'A Step, a room and the gauge, all today.', gold: true });
      evaluateHooks({ ...s, lastWatch: day, watchesKept: s.watchesKept + 1 });
    },
    [s, d, push, evaluateHooks]
  );

  /** your own system, built */
  const ownBuilt = useCallback(() => { grant('small-own-system'); }, [grant]);

  /** a map started from a known system: one of the three keys to the hidden chapter */
  const knownStarted = useCallback((id: string) => {
    if (!s.firsts[KNOWN_FIRST + id]) d({ t: 'first', key: KNOWN_FIRST + id });
    grant('small-known-system');
  }, [s.firsts, d, grant]);

  /** Dash Defenders: a check finished, and one where every statement that applies holds. The result shows both
     milestones in place (views/CheckView.tsx), so no toast covers the ring as it closes. */
  const checkFinished = useCallback((kind: string, allHeld: boolean) => {
    grant('small-' + kind + '-check', true);
    if (allHeld) grant('strong-' + kind + '-held', true);
  }, [grant]);

  /** the hidden chapter opens once, when its three keys are held */
  const outlierOpened = useCallback(() => {
    if (s.firsts[OUTLIER_OPENED]) return;
    d({ t: 'first', key: OUTLIER_OPENED });
    grant('strong-outlier-open');
    Field.pulse(undefined, '#a78bff', 'emergence');
    push({ title: 'A hidden chapter has opened', body: 'Chapter 2.6.7, Outlier Systems Structures And Insights, is on the Chapters page.', gold: true });
  }, [s.firsts, d, grant, push]);

  /** goals: set, and reached by the record */
  const goalSet = useCallback(
    (count: number) => { grant('small-goal-set'); if (count >= 3) grant('small-three-goals'); },
    [grant]
  );
  const goalReached = useCallback(
    (count: number, titles: string[]) => {
      push({ title: 'Goal reached', body: titles.join(' · '), gold: true });
      grant('strong-goal-reached');
      if (count >= 5) grant('strong-five-goals');
    },
    [grant, push]
  );

  return {
    speak, grant, fireMilestone, evaluateHooks,
    finishStep, finishSim, readGuide, linkWallet, mintDraft, reviewResult, finishGauge, mintedMotrus,
    keepWatch, goalSet, goalReached, ownBuilt, knownStarted, outlierOpened, checkFinished,
  };
}
