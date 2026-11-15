/* NEXTSTEPS: the recommender. Reads the learner's actual history and argues
   for the highest-leverage next move. Statement: the right work at the right
   time beats more work at any time. */

import React, { useEffect, useMemo } from 'react';
import { CHAPTERS, GUIDES, PROJECTS, SIMS, ESSENCE_HEX, MODUX_CHAPTERS, MODUX_CATALOG } from '../content/registry';
import { GAUGES, gaugeOfTheDay } from '../content/modux/gauges';
import { useS, unitPhase, reviewDue } from '../lib/state';
import { chapterUnlocked } from '../lib/unlock';
import { SectionHead } from '../components/bits';
import { ReviewQueue } from '../components/ReviewQueue';
import { chargeKeystone } from '../lib/swarm';

interface Rec {
  kind: 'step' | 'chapter' | 'sim' | 'guide' | 'project' | 'habit';
  title: string;
  reason: string;
  essence: string;
  go: () => void;
  cta: string;
}

export function NextStepsView() {
  const { s, d } = useS();
  useEffect(() => { chargeKeystone(); }, []);

  const recs = useMemo<Rec[]>(() => {
    const out: Rec[] = [];
    const stepsDone = Object.keys(s.completedSteps).length;
    const phase = unitPhase(s, CHAPTERS.length);

    // 1. the immediate next step on the path
    outer: for (const c of CHAPTERS) {
      if (!chapterUnlocked(c, s.completedChapters, s.completedPages)) continue;
      for (const p of c.pages) {
        const remaining = p.steps.filter(st => !s.completedSteps[st.id]);
        if (remaining.length > 0) {
          const nearly = p.steps.length - remaining.length >= Math.ceil(p.steps.length / 2);
          out.push({
            kind: 'step',
            title: remaining[0].title,
            reason: nearly
              ? 'You are ' + remaining.length + ' step' + (remaining.length > 1 ? 's' : '') +
                ' from sealing the Page “' + p.title + '”. Finishing it puts a new credential on your Praxis Profile.'
              : 'The next step on your path through ' + c.title + '.',
            essence: ESSENCE_HEX[c.essence],
            go: () => d({ t: 'route', view: 'step', id: remaining[0].id }),
            cta: 'Take the step',
          });
          break outer;
        }
      }
    }

    // 2. the return queue outranks everything when reviews are due
    const dueNow = reviewDue(s);
    if (dueNow.length > 0) {
      out.unshift({
        kind: 'habit',
        title: 'Return Queue: ' + dueNow.length + ' decision' + (dueNow.length > 1 ? 's' : '') + ' due',
        reason: 'Retrieval on an expanding schedule is the single most replicated finding in learning science. These are the exact decisions that beat you before, back at the moment forgetting makes the rep worth the most. Nothing on this board pays better.',
        essence: ESSENCE_HEX.ember,
        go: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        cta: 'Clear the queue',
      });
    }

    // 2b. domain weakness: which chapter's drills are beating you
    const domainMiss = new Map<string, { missed: number; total: number; chapter: typeof CHAPTERS[number] }>();
    for (const c of CHAPTERS) {
      for (const p of c.pages) {
        for (const st of p.steps) {
          if (!st.drill) continue;
          const sc = s.drillScores[st.drill.id];
          if (sc === undefined) continue;
          const cur = domainMiss.get(c.id) || { missed: 0, total: 0, chapter: c };
          cur.total++;
          if (sc < 0) cur.missed++;
          domainMiss.set(c.id, cur);
        }
      }
    }
    const weakest = [...domainMiss.values()]
      .filter(x => x.total >= 2 && x.missed / x.total >= 0.4)
      .sort((a, b) => b.missed / b.total - a.missed / a.total)[0];
    if (weakest) {
      /* recommend a guide from the same domain: targeted remediation beats
         "read more", and the hub exists precisely for this */
      const guide = GUIDES.find(g =>
        !s.guidesRead[g.id] &&
        (g.domain.toLowerCase().includes(weakest.chapter.essence) ||
          weakest.chapter.title.toLowerCase().includes(g.domain.toLowerCase()) ||
          g.domain.toLowerCase().includes(weakest.chapter.title.split(' ')[0].toLowerCase())));
      const pct = Math.round((weakest.missed / weakest.total) * 100);
      out.push({
        kind: 'guide',
        title: guide ? guide.title : 'Re-read the ground under ' + weakest.chapter.title,
        reason: 'You have missed ' + weakest.missed + ' of ' + weakest.total + ' drills in ' +
          weakest.chapter.title + ' (' + pct + '%). ' +
          'The model behind those drills needs repair. ' + (guide
            ? 'This guide covers the same ground from a different angle.'
            : 'Go back to the constructs rather than pushing forward; the later Pages compile against these.'),
        essence: ESSENCE_HEX[weakest.chapter.essence],
        go: () => d({ t: 'route', view: guide ? 'guides' : 'chapter', id: guide ? undefined : weakest.chapter.id }),
        cta: guide ? 'Read it' : 'Back to the ground',
      });
    }

    // 3. simulation readiness
    const readySim = SIMS.find(m => {
      if (s.completedSims[m.id]) return false;
      const c = CHAPTERS.find(x => x.id === m.chapterId);
      if (!c) return false;
      const started = c.pages.some(p => p.steps.some(st => s.completedSteps[st.id]));
      return started && m.difficulty <= 2 + Object.keys(s.completedSims).length;
    });
    if (readySim && stepsDone >= 3) {
      out.push({
        kind: 'sim',
        title: readySim.title,
        reason: 'You have enough ground in ' + (CHAPTERS.find(c => c.id === readySim.chapterId)?.title || 'this domain') +
          ' for a live room. A simulation puts that ground to work in real decisions.',
        essence: ESSENCE_HEX[readySim.essence],
        go: () => d({ t: 'route', view: 'sim', id: readySim.id }),
        cta: 'Take the chair',
      });
    }

    // 4. project pressure
    if (s.projects.length === 0 && stepsDone >= 5) {
      const t = PROJECTS[Math.min(1, Math.max(0, PROJECTS.length - 1))];
      if (t) {
        out.push({
          kind: 'project',
          title: 'Forge your first Praxis Project',
          reason: 'Five or more Steps and no project yet. A project with evidence is how this work shows on your record. Start with “' + t.title + '” or bring your own.',
          essence: ESSENCE_HEX.gold,
          go: () => d({ t: 'route', view: 'profile' }),
          cta: 'Open the forge',
        });
      }
    }
    const stale = s.projects.find(p => p.status === 'forging' && Date.now() - p.createdAt > 6 * 86400000);
    if (stale) {
      out.push({
        kind: 'project',
        title: '“' + stale.title + '” is still on the anvil',
        reason: 'Forged ' + Math.round((Date.now() - stale.createdAt) / 86400000) + ' days ago and not yet active. Shrink the scope until the first deliverable fits in one sitting, then advance it.',
        essence: ESSENCE_HEX.gold,
        go: () => d({ t: 'route', view: 'profile' }),
        cta: 'Advance it',
      });
    }

    // 5. an unread guide adjacent to recent work
    const unread = GUIDES.find(g => !s.guidesRead[g.id]);
    if (unread && stepsDone >= 2) {
      out.push({
        kind: 'guide',
        title: unread.title,
        reason: 'A guide from the hub, ' + unread.minutes + ' minutes, ready to use today.',
        essence: ESSENCE_HEX.azure,
        go: () => d({ t: 'route', view: 'guides' }),
        cta: 'Read it',
      });
    }

    // 6. wallet / attestation nudges at the right moment
    if (!s.wallet && Object.keys(s.completedPages).length >= 1) {
      out.push({
        kind: 'habit',
        title: 'Link your wallet, put your record on the graph',
        reason: 'You hold at least one Page. Linking a wallet (read only; this school never asks for signatures) lets you mint your milestones as Intuition triples and build portable reputation.',
        essence: ESSENCE_HEX.violet,
        go: () => d({ t: 'route', view: 'settings' }),
        cta: 'Link wallet',
      });
    }

    // 6b. protect the record once there is one worth protecting
    if (Object.keys(s.completedPages).length >= 2 && !s.firsts['exported']) {
      out.push({
        kind: 'habit',
        title: 'Export your record. It only lives in this browser',
        reason: 'You hold ' + Object.keys(s.completedPages).length + ' Pages and ' +
          Object.keys(s.awards).length + ' awards, and every one of them lives in localStorage on this ' +
          'device. Clearing site data erases the lot. A backup you have not taken is a lesson this ' +
          'curriculum teaches in Chapter 5 and you would rather not learn here.',
        essence: ESSENCE_HEX.ember,
        go: () => d({ t: 'route', view: 'settings' }),
        cta: 'Export it',
      });
    }

    // 6c. the Modux Models: start them after the first core Page, continue them once begun
    {
      const moduxSteps = MODUX_CHAPTERS.flatMap(c => c.pages.flatMap(p => p.steps.map(st => ({ c, st }))));
      const studied = moduxSteps.filter(x => s.completedSteps[x.st.id]).length;
      const inProgress = MODUX_CHAPTERS.find(c =>
        !s.completedChapters[c.id] && c.pages.some(p => p.steps.some(st => s.completedSteps[st.id])));
      if (inProgress) {
        const next = inProgress.pages.flatMap(p => p.steps).find(st => !s.completedSteps[st.id]);
        const total = inProgress.pages.reduce((n, p) => n + p.steps.length, 0);
        const done = inProgress.pages.reduce((n, p) => n + p.steps.filter(st => s.completedSteps[st.id]).length, 0);
        if (next) {
          out.push({
            kind: 'chapter',
            title: 'Continue ' + inProgress.title,
            reason: done + ' of ' + total + ' models studied. The next one is ' + next.title + '.',
            essence: ESSENCE_HEX[inProgress.essence],
            go: () => d({ t: 'route', view: 'step', id: next.id }),
            cta: 'Open the next model',
          });
        }
      } else if (studied === 0 && Object.keys(s.completedPages).length >= 1 && MODUX_CHAPTERS.length) {
        const first = MODUX_CHAPTERS[0];
        out.push({
          kind: 'chapter',
          title: 'Start the Modux Models',
          reason: MODUX_CATALOG.length + ' security structures, each with what it defeats, where it fails and what it compounds with. ' +
            first.title + ' comes first: the systems models the rest stand on.',
          essence: ESSENCE_HEX[first.essence],
          go: () => d({ t: 'route', view: 'chapter', id: first.id }),
          cta: 'Open the course',
        });
      }
    }

    // 6d. today's gauge, once a day
    {
      const t = gaugeOfTheDay();
      const rec = s.gauges[t.id];
      const ranToday = rec && new Date(rec.at).toDateString() === new Date().toDateString();
      if (!ranToday && (Object.keys(s.completedSteps).length >= 3 || Object.keys(s.gauges).length > 0)) {
        out.push({
          kind: 'sim',
          title: "Today's gauge: " + t.title,
          reason: t.org + '. ' + t.threats.length + ' threats, a budget of ' + t.budget + '.' +
            (rec ? ' Your best is ' + rec.best + '.' : ''),
          essence: ESSENCE_HEX[t.essence],
          go: () => d({ t: 'route', view: 'modux-gauge', id: t.id }),
          cta: 'Build a stack',
        });
      }
    }

    // 6e. a gauge you hold at its current notch: take it up
    {
      const held = GAUGES.find(g => {
        const r = s.gauges[g.id];
        const at = s.gaugeSessions[g.id]?.used.length ?? 0;
        return r && r.levels[String(at)]?.held;
      });
      if (held) {
        const at = s.gaugeSessions[held.id]?.used.length ?? 0;
        out.push({
          kind: 'sim',
          title: 'Take ' + held.title + ' up a notch',
          reason: 'You hold it at ' + (at === 0 ? 'Ground' : 'notch ' + at) + '. The next notch adds a pressure and the budget grows by less than the threat.',
          essence: ESSENCE_HEX[held.essence],
          go: () => d({ t: 'route', view: 'modux-gauge', id: held.id }),
          cta: 'Open the gauge',
        });
      }
    }

    // 7. phase-arc counsel
    if (phase === 1) {
      out.push({
        kind: 'habit',
        title: 'The road to UNIT ZUN',
        reason: 'Your unit evolves at four sealed steps and one earned Page. You are at ' + stepsDone +
          ' step' + (stepsDone === 1 ? '' : 's') + ' and ' + Object.keys(s.completedPages).length + ' page(s). Close the gap and the first companions arrive.',
        essence: ESSENCE_HEX.cyan,
        go: () => d({ t: 'route', view: 'unit' }),
        cta: 'See the unit',
      });
    }

    return out.slice(0, 6);
  }, [s, d]);

  return (
    <div className="wrap">
      <SectionHead sigil="vector"
        kicker="NEXTSTEPS"
        title="The right work, right now."
        lede="Read from your history: sealed Steps, drill scores, projects and pace. Take the top one."
      />

      <ReviewQueue />

      <div className="stack" data-keystone data-essence="#9cc3ef">
        {recs.map((r, i) => (
          <div key={i} className="panel" style={i === 0 ? { borderColor: r.essence } : undefined}>
            <div className="row-between">
              <div style={{ minWidth: 0, paddingRight: 'var(--s4)' }}>
                <span className="label">{i === 0 ? 'HIGHEST LEVERAGE' : 'NEXT'} · {r.kind.toUpperCase()}</span>
                <h3 style={{ margin: '10px 0' }}>{r.title}</h3>
                <p className="big-sec" style={{ margin: 0 }}>{r.reason}</p>
              </div>
              <button className={'btn' + (i === 0 ? ' btn-key' : '')} onClick={r.go}>
                {r.cta}
              </button>
            </div>
          </div>
        ))}
        {recs.length === 0 && (
          <div className="empty">Complete a first step and the recommender wakes up.</div>
        )}
      </div>
    </div>
  );
}
