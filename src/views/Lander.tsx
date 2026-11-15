/* THE WELCOME PAGE. What a person sees the first time they open StepSAFE, and what anyone sees at /welcome.
   August's statements are the page. Each is set large and arrives word by word (components/lander/
   Statement.tsx), exactly as he wrote it, and each has a scene of its own. Under the opening, one small
   system stays on screen (components/lander/stage.ts) and passes through its states, a short beat beside
   each: it rests, a failure travels, one part carries the most, layers hold, walls contain, it returns, it
   holds. A visitor who knows none of the Praxis's words can follow it by watching.

   The rest is symbols and doors: the bench where you harden a demo system yourself, Claros with his
   line, the Practice, Modux Models and StudyMode as three moving figures, the twelve Chapters, the seal
   over the record, every page as a door, the founder, two ways in, and his dedication to the Dash DAO,
   signed and dated. My own words are kept to labels and doors. */

import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { PITCH } from '../content/pitch';
import { STAGE_CHAPTERS } from '../components/lander/stage';
import { StageCanvas } from '../components/lander/StageCanvas';
import { WebFig, PathFig, LensFig, OneSystemFig } from '../components/lander/Figures';
import { RoomsMotif, SealMotif } from '../components/lander/Motifs';
import { Statement } from '../components/lander/Statement';
import { PageSigil, type SigilKind } from '../components/PageSigil';
import '../styles/lander.css';

const LanderLive = lazy(() => import('../components/lander/LanderLive'));
/** where a door on this page leads: a page of the Praxis, or Claros by name */
export type Go = 'home' | 'chapters' | 'practice' | 'modux' | 'guides' | 'study' | 'steps' | 'unit' | 'profile' | 'next' | 'seva' | 'settings' | 'claros' | 'dasha';

const n = (x: number) => x.toLocaleString('en-US');

/* the beats beside the stage after his opening couplet, one per state of the system */
const BEATS = ['It Travels.', 'One Part Carries.', 'Layers Hold.', 'Walls Contain.', 'It Returns.', 'It Holds.'];

/** reveals, the reading bar, and which figures move: one observer each, one scroll handler that only writes */
function usePageMotion(root: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) el.classList.add('still');
    const reveal = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    el.querySelectorAll('[data-reveal]').forEach(x => reveal.observe(x));
    /* a reveal always lands, even if the observer never fires */
    const fail = window.setTimeout(() => el.querySelectorAll('[data-reveal]').forEach(x => { const r = x.getBoundingClientRect(); if (r.top < innerHeight) x.classList.add('in'); }), 2500);
    const live = new IntersectionObserver(es => { for (const e of es) e.target.classList.toggle('live', e.isIntersecting); }, { threshold: 0 });
    el.querySelectorAll('.lx-sec').forEach(x => live.observe(x));
    const bar = el.querySelector<HTMLElement>('.lx-progress i');
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        if (bar) bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, scrollY / max)).toFixed(4) + ')';
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { reveal.disconnect(); live.disconnect(); window.clearTimeout(fail); removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/** the phone layout: the system holds the top of the screen and the lines rise beneath it */
const NARROW = '(max-width: 860px)';
function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}

function Door({ go, to, children }: { go: (g: Go) => void; to: Go; children: React.ReactNode }) {
  return <button type="button" className="lx-door" onClick={() => go(to)}>{children}<i aria-hidden>→</i></button>;
}

export default function Lander({ onBegin, entered }: { onBegin: (go?: Go) => void; entered: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLDivElement>(null);
  /* the chapter being read; one past the last means the last line has lifted away while the system still holds */
  const [reading, setReading] = useState(0);
  const chapter = Math.min(STAGE_CHAPTERS - 1, reading);
  const narrow = useNarrow();
  const [near, setNear] = useState(false);
  const [ended, setEnded] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  usePageMotion(root);

  /* the Sense ends: the system fades as the last beat leaves, and returns when you scroll back */
  useEffect(() => {
    const el = end.current;
    if (!el) return;
    const io = new IntersectionObserver(es => { for (const e of es) setEnded(e.isIntersecting || e.boundingClientRect.top < 0); }, { rootMargin: '0px 0px -16% 0px', threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* the reading line: the chapter crossing it sets the stage. On a phone the line sits near the foot of the
     screen and each chapter is short, so a line is read below the system and lifts away before it reaches it */
  useEffect(() => {
    const el = steps.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>('.lxs-step > h1, .lxs-step > h2, .lxs-lift')];
    const line = narrow ? 92 : 58;
    /* every mark above the line, even one a fast scroll jumped past; the lowest of them is the chapter */
    const above = new Set<number>();
    const io = new IntersectionObserver(es => {
      for (const e of es) {
        const t = e.target as HTMLElement;
        const i = Number((t.classList.contains('lxs-lift') ? t : (t.parentElement as HTMLElement)).dataset.ch || 0);
        if (e.isIntersecting) above.add(i); else above.delete(i);
      }
      setReading(above.size ? Math.max(...above) : 0);
    }, { rootMargin: '99999px 0px -' + (100 - line) + '% 0px', threshold: 0 });
    items.forEach(x => io.observe(x));
    return () => io.disconnect();
  }, [narrow]);

  /* on a phone the opening lifts away as the reading starts, so it never crosses the system above it */
  useEffect(() => {
    const hero = root.current?.querySelector<HTMLElement>('.lxs-hero');
    if (!hero) return;
    const clear = () => { hero.style.opacity = ''; hero.style.transform = ''; hero.style.pointerEvents = ''; };
    if (!narrow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { clear(); return; }
    let raf = 0, last = -1;
    const paint = () => {
      raf = 0;
      const y = Math.round(Math.max(0, Math.min(140, scrollY)));
      if (y === last) return;
      last = y;
      const k = Math.min(1, y / 100);
      hero.style.opacity = (1 - k).toFixed(3);
      hero.style.transform = 'translateY(' + (y * 0.8).toFixed(1) + 'px)';
      hero.style.pointerEvents = k > 0.9 ? 'none' : '';
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('scroll', onScroll, { passive: true });
    paint();
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); clear(); };
  }, [narrow]);

  /* a section far off the screen rests: its loops pause until it is near again, so a phone draws only what is seen */
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver !== 'function') return;
    const io = new IntersectionObserver(es => { for (const e of es) { if (e.isIntersecting) e.target.removeAttribute('data-away'); else e.target.setAttribute('data-away', ''); } }, { rootMargin: '300px 0px' });
    el.querySelectorAll('.lx-sec').forEach(x => io.observe(x));
    return () => io.disconnect();
  }, []);

  /* the live demo loads when it is close, so the first paint stays light */
  useEffect(() => {
    const t = document.getElementById('lx-notch');
    if (!t) return;
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setNear(true); io.disconnect(); } }, { rootMargin: '1000px 0px' });
    io.observe(t);
    return () => io.disconnect();
  }, []);
  useEffect(() => { document.title = 'StepSAFE :: The Praxis · Secure By Systems Design'; return () => { document.title = 'StepSAFE :: The Praxis'; }; }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  /* to the first chapter; on a phone its line lands in the reading band below the system */
  const watch = () => {
    const el = document.getElementById('lx-sense-1');
    if (!el) return;
    if (!narrow) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const h = el.querySelector('h1, h2') ?? el;
    window.scrollTo({ top: h.getBoundingClientRect().top + scrollY - innerHeight * 0.8, behavior: 'smooth' });
  };
  const begin = entered ? 'Enter the Praxis' : 'Begin the Praxis';
  const P = PITCH;
  const doors: { go: Go; name: string; sig: SigilKind }[] = [
    { go: 'home', name: 'Ground', sig: 'seed' },
    { go: 'chapters', name: 'Chapters', sig: 'twelve' },
    { go: 'practice', name: 'The Practice', sig: 'rooms' },
    { go: 'modux', name: 'Modux Models', sig: 'web' },
    { go: 'guides', name: 'StepGuides', sig: 'path' },
    { go: 'study', name: 'StudyMode', sig: 'deck' },
    { go: 'steps', name: 'Steps', sig: 'stairs' },
    { go: 'unit', name: P.unit.phases[0], sig: 'unit' },
    { go: 'profile', name: 'Praxis Profile', sig: 'keystone' },
    { go: 'next', name: 'NextSteps', sig: 'vector' },
    { go: 'claros', name: 'Seva and Claros', sig: 'lens' },
    { go: 'settings', name: 'Settings', sig: 'tune' },
  ];

  return (
    <div ref={root} className="lx">
      <div className="lx-progress" aria-hidden><i /></div>

      <header className="lx-top">
        <button className="lx-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="StepSAFE, back to the top">
          <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="5.5" /><circle cx="8.5" cy="12" r="5.5" /><circle cx="15.5" cy="12" r="5.5" /><circle cx="12" cy="12" r="1.6" className="dot" /></svg>
          <span>StepSAFE</span>
        </button>
        <nav className="lx-links" aria-label="On this page">
          <button onClick={watch}>The Sense</button>
          <button onClick={() => go('lx-notch')}>The Praxis</button>
          <button onClick={() => go('lx-claros')}>Claros.SI</button>
          <button onClick={() => go('lx-pricing')}>Pricing</button>
        </nav>
        <button className="lx-btn key sm" onClick={() => onBegin()}>{begin}</button>
      </header>

      <main className="lx-main">
        {/* ============ THE SENSE: one system, and his words over it ============ */}
        <section className="lx-sec lxs" aria-label="How a system fails, and how it holds">
          <StageCanvas chapter={chapter} className="lxs-stage" out={ended} />
          <div className="lxs-steps" ref={steps}>
            <article className={'lxs-step lxs-hero' + (reading === 0 ? ' on' : '')} data-ch="0">
              <Statement as="h1" className="lx-st-hero" lines={['Secure By Systems Design']} start={0.35} beat={0.16} />
              <Statement as="p" className="lx-st-sound" lines={['Sound System.', 'Sound Mind.']} start={1.25} beat={0.14} rest={0.2} />
              <div className="lx-ctas lx-in" style={{ ['--d' as string]: '2.2s' }}>
                <button className="lx-btn key" onClick={() => onBegin()}>{begin}</button>
                <button className="lx-btn ghost lx-cue" onClick={watch} aria-label="Watch the system"><i className="lx-down" aria-hidden /></button>
              </div>
            </article>
            <article id="lx-sense-1" className={'lxs-step lxs-see' + (reading === 1 ? ' on' : '')} data-ch="1">
              <Statement follow lines={['See The System.', 'Build Sound Mind.']} beat={0.14} rest={0.35} />
            </article>
            {BEATS.map((w, i) => (
              <article key={w} id={'lx-sense-' + (i + 2)} className={'lxs-step' + (i === BEATS.length - 1 ? ' lxs-last' : '') + (reading === i + 2 ? ' on' : '')} data-ch={i + 2}>
                <Statement follow className="lxs-beat" lines={[w]} beat={0.14} />
              </article>
            ))}
            <div className="lxs-lift" data-ch={BEATS.length + 2} aria-hidden />
            <div ref={end} className="lxs-end" aria-hidden />
          </div>
        </section>

        {/* ============ TRUST BUT VERIFY ============ */}
        <section className="lx-sec lx-scene">
          <Statement className="xl" lines={['Trust But Verify', 'Trust But Derive']} beat={0.13} rest={0.45} />
          <i className="lx-scene-rule" aria-hidden />
        </section>

        {/* ============ TAKE IT UP A NOTCH: the bench ============ */}
        <section id="lx-notch" className="lx-sec lx-notch">
          <div className="lx-copy center" data-reveal>
            <h2>Take It Up A Notch.</h2>
            <p className="lx-tag">A demo system</p>
          </div>
          <div className="lx-live" data-reveal>
            <Suspense fallback={<div className="lx-live-wait" aria-label="Loading" />}>
              {near ? <LanderLive part="day" /> : <div className="lx-live-wait" aria-label="Loading" />}
            </Suspense>
          </div>
          <div className="lx-doors center" data-reveal><Door go={onBegin} to="modux">Run a gauge</Door><Door go={onBegin} to="modux">Map your own system</Door></div>
        </section>

        {/* ============ DO. IT. RIGHT. ============ */}
        <section className="lx-sec lx-scene">
          <Statement className="xl lx-st-do" lines={['Do. It.', 'Right.']} delays={[0, 0.6, 1.35]} />
          <i className="lx-scene-point" aria-hidden />
        </section>

        {/* ============ CLAROS.SI ============ */}
        <section id="lx-claros" className="lx-sec lx-row">
          <div className="lx-copy" data-reveal>
            <h2 className="lx-claros-title">Meet Your Outlier Systems Security Steward Claros.SI</h2>
            <p className="lx-powered">Powered By ASense.si</p>
            <div className="lx-doors"><Door go={onBegin} to="claros">Speak with Claros</Door><Door go={onBegin} to="seva">Meet Seva</Door><Door go={onBegin} to="dasha">Meet Dasha</Door></div>
          </div>
          <div className="lx-fig lx-claros-fig" data-reveal>
            <LensFig />
            <Suspense fallback={null}>{near && <LanderLive part="talk" />}</Suspense>
          </div>
        </section>

        {/* ============ THE PRAXIS, IN THREE SYMBOLS ============ */}
        <section id="lx-praxis" className="lx-sec lx-tri">
          <ul>
            <li><div className="lx-fig lx-tri-fig" data-reveal><RoomsMotif /></div><Door go={onBegin} to="practice">The Practice</Door></li>
            <li><div className="lx-fig lx-tri-fig" data-reveal><WebFig /></div><Door go={onBegin} to="modux">Modux Models</Door></li>
            <li><div className="lx-fig lx-tri-fig" data-reveal><PageSigil kind="deck" /></div><Door go={onBegin} to="study">StudyMode</Door></li>
          </ul>
        </section>

        {/* ============ STEP. STRONG. ============ */}
        <section id="lx-path" className="lx-sec lx-scene">
          <Statement className="xl lx-st-caps" lines={['STEP.', 'STRONG.']} beat={0.2} rest={0.5} />
          <div className="lx-fig lx-scene-fig" data-reveal><PathFig /></div>
          <p className="lx-tag" data-reveal>{n(P.chapters.steps)} Steps · {P.chapters.count} Chapters</p>
          <div className="lx-doors center" data-reveal><Door go={onBegin} to="chapters">See the Chapters</Door></div>
        </section>

        {/* ============ TRUST BY SYSTEMS DESIGN ============ */}
        <section id="lx-yours" className="lx-sec lx-scene">
          <div className="lx-fig lx-scene-fig seal" data-reveal><SealMotif /></div>
          <Statement className="xl long" lines={['Trust By Systems Design', 'Trust Built Sound And Stronger Over Time']} beat={0.11} rest={0.5} />
        </section>

        {/* ============ TWELVE DOORS ============ */}
        <section id="lx-doors" className="lx-sec">
          <ul className="lx-glance" data-reveal aria-label="Every page of the Praxis">
            {doors.map((t, i) => (
              <li key={t.name} style={{ ['--i' as string]: String(i) }}>
                <button type="button" onClick={() => onBegin(t.go)}>
                  <span className="lx-glance-sig"><PageSigil kind={t.sig} /></span>
                  <span className="lx-glance-name">{t.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ============ THE PROPOSAL PAGES: the move, the card, the agreement between communities ============ */}
        <section id="lx-proposals" className="lx-sec lx-proposals">
          <p className="lx-tag" data-reveal>Proposals from StepSAFE</p>
          <div className="lx-doors center" data-reveal>
            <a className="lx-door" href="/MOTRUS">MOTRUS<i aria-hidden>→</i></a>
            <a className="lx-door" href="/ankras">Ankras<i aria-hidden>→</i></a>
            <a className="lx-door" href="/PAXT">PAXT<i aria-hidden>→</i></a>
          </div>
        </section>

        {/* ============ THE FOUNDER ============ */}
        <section id="lx-founder" className="lx-sec lx-row flip">
          <div className="lx-fig" data-reveal><OneSystemFig /></div>
          <div className="lx-copy" data-reveal>
            <h2>August JDZ</h2>
            <p className="lx-role">Founder and core dev of StepSAFE. Founder and steward of Outlier.Systems.</p>
            <ul className="lx-his">
              <li><q>Strategic Systems Intelligence Agency. Solutions For The Data Backed World.</q><span>Outlier.Systems</span></li>
              <li><q>Learn Systems Thinking. Build A Career In It.</q><span>Trust The Practice</span></li>
              <li><q>Not what a model knows. Where it chooses to push.</q><span>SystemsBench</span></li>
            </ul>
            <div className="lx-links-row">
              <a href="https://www.outlier.systems" target="_blank" rel="noopener noreferrer">Outlier.Systems</a>
              <a href="https://MotusMoves.US" target="_blank" rel="noopener noreferrer">MotusMoves.US</a>
              <a href="https://github.com/InitiumBuilders" target="_blank" rel="noopener noreferrer">InitiumBuilders on GitHub</a>
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section id="lx-pricing" className="lx-sec">
          <div className="lx-plans" data-reveal>
            <div className="lx-plan">
              <span className="lx-plan-name">NOVUS MODE</span>
              <strong className="lx-price">From $23<small> a month</small></strong>
              <p>For anyone starting at the beginning: every foundation, every core Step, the full glossary, the starter rooms, Seva and Claros.</p>
              <button className="lx-btn key" onClick={() => onBegin()}>Begin with NOVUS</button>
            </div>
            <div className="lx-plan motus">
              <span className="lx-plan-name">MOTUS MODE</span>
              <strong className="lx-price">Priced to your commitment</strong>
              <p>The all-in tier: the full project-based Praxis Framework, the advanced and outlier guides, Chapter 2.6.7 on the {P.systems.known} real systems, and a pathway planned directly with August.</p>
              <a className="lx-btn" href="mailto:August@MotusMoves.US?subject=MOTUS%20MODE%20Application">Apply: August@MotusMoves.US</a>
            </div>
          </div>
        </section>

        {/* ============ CLOSE: the system again, holding, and his words ============ */}
        <section className="lx-sec lx-close">
          <StageCanvas chapter={0} className="lx-close-stage" />
          <Statement as="p" className="lx-mark" lines={['STEP SAFE']} letters beat={0.07} />
          <Statement className="lx-st-close" lines={['Trust Your Systems Sense And Your Systems Mind']} start={0.5} beat={0.1} />
          <p className="lx-close-line" data-reveal>Stronger systems stronger world. Stay SOUND.</p>
          <div data-reveal><button className="lx-btn key" onClick={() => onBegin()}>{begin}</button></div>
        </section>

        {/* ============ HIS DEDICATION ============ */}
        <section className="lx-dedication" data-reveal aria-label="Dedication">
          <p className="lx-ded-line">An Outlier.Systems Security Project Dedicated And Shaped For The Dash DAO. AND With .:Waves In Mind.</p>
          <p className="lx-ded-sign"><span>~AjD</span><span>10/19/2026</span></p>
          <p className="lx-ded-dash"><span>#DashDrives</span><a href="https://Dash.ORG" target="_blank" rel="noopener noreferrer">https://Dash.ORG</a></p>
        </section>
      </main>

      <footer className="lx-foot">
        <span>StepSAFE :: The Praxis</span>
        <a href="https://www.outlier.systems" target="_blank" rel="noopener noreferrer">Outlier.Systems</a>
      </footer>
    </div>
  );
}
