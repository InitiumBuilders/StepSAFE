/* CHAPTERS — the great map. Acts hold Chapters; Chapters hold Pages;
   Pages hold Steps. Statement: mastery has a shape, and you can see yours. */

import React, { useEffect, useState } from 'react';
import { CHAPTERS, ESSENCE_HEX } from '../content/registry';
import type { Chapter } from '../content/schema';
import { useS } from '../lib/state';
import { SectionHead } from '../components/bits';
import { chargeKeystone } from '../lib/swarm';
import { ChapterMap } from '../components/ChapterMap';
import { OUTLIER_CHAPTER } from '../content/outlier/chapter';
import { OUTLIER_NUMBER, COMING_NUMBER, KEEPER_ID } from '../content/outlier/ids';
import { SYNTHESIS } from '../content/outlier/synthesis';
import { outlierOpen, outlierVisible } from '../lib/outlier';
import { chapterUnlocked } from '../lib/unlock';

export { prereqSatisfied, chapterUnlocked } from '../lib/unlock';

export function ChaptersView() {
  const { s, d } = useS();
  useEffect(() => { chargeKeystone(); }, []);

  const acts: { act: string; chapters: Chapter[] }[] = [];
  for (const c of CHAPTERS) {
    const a = acts.find(x => x.act === c.act);
    if (a) a.chapters.push(c);
    else acts.push({ act: c.act, chapters: [c] });
  }

  return (
    <div className="wrap-wide">
      <SectionHead sigil="twelve"
        kicker="THE CHAPTERS"
        title="Twelve chapters. One doctrine."
        lede="Each Chapter is a full beyond-college course. Complete its Pages and it locks in — permanently on your Praxis Profile — and a new member takes their seat in your unit."
      />

      {s.mode === 'motus' && OUTLIER_CHAPTER && <MotusDoor />}

      <ChapterMap />

      {acts.map((band, bi) => (
        <React.Fragment key={band.act}>
        <div className="actband">
          <div className="actlab">
            <span className="label">{band.act}</span>
            <span className="rule" />
          </div>
          <div className="grid grid-2" data-keystone={bi === 0 ? true : undefined} data-essence="#9cc3ef">
            {band.chapters.map(c => {
              const unlocked = chapterUnlocked(c, s.completedChapters, s.completedPages);
              const done = !!s.completedChapters[c.id];
              const pagesDone = c.pages.filter(p => s.completedPages[p.id]).length;
              const stepsDone = c.pages.reduce(
                (n, p) => n + p.steps.filter(st => s.completedSteps[st.id]).length, 0);
              const stepsTotal = c.pages.reduce((n, p) => n + p.steps.length, 0);
              return (
                <button
                  key={c.id}
                  className={'chapter e-' + c.essence}
                  style={{ ['--essence' as string]: ESSENCE_HEX[c.essence] }}
                  disabled={!unlocked}
                  onClick={() => d({ t: 'route', view: 'chapter', id: c.id })}
                >
                  <span className="aura" />
                  <span className="cnum">
                    CHAPTER {String(c.order).padStart(2, '0')}
                    {done ? ' · LOCKED IN' : unlocked ? '' : ' · SEALED'}
                  </span>
                  <h3>{c.title}</h3>
                  <p className="csub">{c.subtitle}</p>
                  {!unlocked && (
                    <p className="sec" style={{ margin: 0 }}>
                      Opens at 2 Pages of: {c.prereq.map(id => {
                        const pc = CHAPTERS.find(x => x.id === id);
                        return pc ? pc.title : id;
                      }).join(' · ')}
                    </p>
                  )}
                  {unlocked && (
                    <>
                      <div className="row" style={{ gap: 8 }}>
                        <span className="chip">{stepsDone}/{stepsTotal} steps</span>
                        <span className="chip">{pagesDone}/{c.pages.length} pages</span>
                      </div>
                      <div className="pagerow" aria-hidden>
                        {c.pages.map(p => (
                          <span key={p.id} className={'pagepip' + (s.completedPages[p.id] ? ' done' : '')} />
                        ))}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {band.chapters.some(c => c.id === KEEPER_ID) && <OutlierBand />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* MOTUS MODE: the Outlier Systems course, at the top of the page */
function MotusDoor() {
  const { s, d } = useS();
  const c = OUTLIER_CHAPTER!;
  const stepsDone = c.pages.reduce((n, p) => n + p.steps.filter(st => s.completedSteps[st.id]).length, 0);
  const stepsTotal = c.pages.reduce((n, p) => n + p.steps.length, 0);
  return (
    <section className="motus-door" aria-label={'MOTUS MODE: Chapter ' + OUTLIER_NUMBER}>
      <span className="motus-door-sigil" aria-hidden>
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="12" /><circle cx="44" cy="32" r="12" /><circle cx="20" cy="32" r="12" />
          <circle cx="26" cy="21.6" r="12" /><circle cx="38" cy="21.6" r="12" /><circle cx="26" cy="42.4" r="12" /><circle cx="38" cy="42.4" r="12" />
          <circle cx="32" cy="32" r="2.6" className="core" />
        </svg>
      </span>
      <div className="motus-door-text">
        <span className="label">MOTUS MODE · CHAPTER {OUTLIER_NUMBER}</span>
        <h2>{c.title}</h2>
        <p className="sec">{c.subtitle}</p>
        <div className="row" style={{ gap: 8 }}>
          <span className="chip">{stepsDone}/{stepsTotal} steps</span>
          <span className="chip">{c.pages.length} pages</span>
        </div>
      </div>
      <div className="motus-door-go">
        <button className="btn btn-key" onClick={() => d({ t: 'route', view: 'chapter', id: c.id })}>Open the course</button>
        <button className="btn btn-ghost btn-sm" onClick={() => document.getElementById('ch-outlier-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Where it sits in the map</button>
      </div>
    </section>
  );
}

/* After The Keeper's act: the hidden chapter 2.6.7, once its three keys are
   held, and 2.6.8, Coming SOON, with its preview, its intro draft and the
   research prompt it will be built from. */
function OutlierBand() {
  const { s, d } = useS();
  const [soon, setSoon] = useState(false);
  const [copied, setCopied] = useState(false);
  const keys = outlierOpen(s);
  const open = outlierVisible(s) && !!OUTLIER_CHAPTER;
  const c = OUTLIER_CHAPTER;
  const cs = SYNTHESIS?.comingSoon;
  const pagesDone = c ? c.pages.filter(p => s.completedPages[p.id]).length : 0;
  const stepsDone = c ? c.pages.reduce((n, p) => n + p.steps.filter(st => s.completedSteps[st.id]).length, 0) : 0;
  const stepsTotal = c ? c.pages.reduce((n, p) => n + p.steps.length, 0) : 0;
  async function copy() {
    if (!cs) return;
    try { await navigator.clipboard.writeText(cs.researchPrompt); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* the prompt stays on the page to select */ }
  }
  return (
    <div className="actband ol-band">
      <div className="actlab">
        <span className="label">OUTLIER SYSTEMS</span>
        <span className="rule" />
      </div>
      <div className={'grid' + (open ? ' grid-2' : '')}>
        {open && c && (
          <button id="ch-outlier-card" className="chapter e-violet ol-secret" style={{ ['--essence' as string]: ESSENCE_HEX.violet }} onClick={() => d({ t: 'route', view: 'chapter', id: c.id })}>
            <span className="aura" />
            <span className="cnum">CHAPTER {OUTLIER_NUMBER}{s.completedChapters[c.id] ? ' · LOCKED IN' : keys ? ' · OPENED' : ' · MOTUS MODE'}</span>
            <h3>{c.title}</h3>
            <p className="csub">{c.subtitle}</p>
            <div className="row" style={{ gap: 8 }}>
              <span className="chip">{stepsDone}/{stepsTotal} steps</span>
              <span className="chip">{pagesDone}/{c.pages.length} pages</span>
            </div>
            <div className="pagerow" aria-hidden>
              {c.pages.map(p => <span key={p.id} className={'pagepip' + (s.completedPages[p.id] ? ' done' : '')} />)}
            </div>
          </button>
        )}
        <button className="chapter e-azure ol-soon" style={{ ['--essence' as string]: ESSENCE_HEX.azure }} onClick={() => setSoon(v => !v)} aria-expanded={soon}>
          <span className="aura" />
          <span className="cnum">CHAPTER {COMING_NUMBER} · Coming SOON</span>
          <h3>{cs?.title || 'Open Source, Read As A System'}</h3>
          <p className="csub">{cs?.subtitle || 'How open software is built, coordinated and hardened.'}</p>
          {cs?.preview && <p className="sec" style={{ margin: 0 }}>{cs.preview}</p>}
          <span className="ol-soon-cue">{soon ? 'Close the preview' : 'Read the preview'}</span>
        </button>
      </div>
      {soon && cs && (
        <section className="ol-preview mx-glass" aria-label={'Chapter ' + COMING_NUMBER + ' preview'}>
          <span className="label">The intro, in draft</span>
          {cs.intro.split(/\n\n+/).map((para, i) => <p key={i} className="big-sec">{para}</p>)}
          <span className="label">The questions it will answer</span>
          <ol className="ol-questions">{cs.keystoneQuestions.map((q, i) => <li key={i}>{q}</li>)}</ol>
          <span className="label">The pages it will hold</span>
          <ol className="ol-pages">{cs.pages.map((p, i) => <li key={i}><strong>{p.title}</strong><span>{p.summary}</span></li>)}</ol>
          <details className="ol-prompt">
            <summary>The research prompt it will be built from</summary>
            <div className="row" style={{ gap: 8, margin: '10px 0' }}>
              <button className="btn btn-sm" onClick={copy}>{copied ? 'Copied' : 'Copy the prompt'}</button>
            </div>
            <div className="ol-prompt-text">{cs.researchPrompt}</div>
          </details>
        </section>
      )}
    </div>
  );
}
