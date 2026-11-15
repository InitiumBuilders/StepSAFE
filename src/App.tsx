/* StepSAFE :: The Praxis — the shell.
   The nav rail carries the HUD and the evolving unit tab:
   UNIT ONE -> UNIT ZUN -> THE UNIT -> UNITIUM ONE. */

import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { lazyLoad } from './lib/lazyLoad';
import { CHAPTERS, essenceForTheme, loadContent, chapterById, stepById, simById, guideById, moduxStackById, moduxById } from './content/registry';
import { PageSigil } from './components/PageSigil';
import {
  useS, unitPhase, PHASE_NAMES, rankOf, type ViewKey,
} from './lib/state';
import { Mark, useToast } from './components/bits';
import { surfacePrinciple, principleOfTheDay } from './content/principles';
import { configureVoice } from './lib/study/voice';
import { Swarm } from './lib/swarm';
import { Field } from './lib/field';
import { gaugeFromUrl, resultFromUrl, setFromUrl, type SharedSet } from './lib/share';
import { studyRoute, requestExam } from './lib/study/session';
import { LinkOffer, SetOffer, type Offer } from './components/LinkOffer';
import { Palette, Shortcuts } from './components/Palette';
import { GAUGES } from './content/modux/gauges';

import { HomeView } from './views/HomeView';
import { GratusSigil } from './components/Gratus';
import { useEngine } from './lib/engine';
import { outlierOpen, OUTLIER_OPENED } from './lib/outlier';
import { Back, useBackCloses, arrival, type Route } from './lib/history';
import { Haptic } from './lib/haptic';
import { Mark as MotrusMark } from './motrus/Mark';

/* Ground opens with the app; every other page loads when it is first opened, together with the rest of the
   curriculum (content/registry.ts), so a returning learner's first screen does not wait for all of it */
type Mod = Record<string, unknown>;
/* every page's own code, so it can be fetched ahead with the curriculum (the idle effect in App) */
const PAGE_CODE: (() => Promise<Mod>)[] = [];
function page(load: () => Promise<Mod>, name: string) {
  PAGE_CODE.push(load);
  return lazyLoad(() => Promise.all([load(), loadContent()]).then(([m]) => ({ default: m[name] as React.ComponentType })));
}

/* A page waits for its code. On a weak connection a request can stall and never finish, and the page would wait on
   its mark for good. After eight seconds the wait offers a way out: the same address, loaded again. */
function ViewWait() {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const t = window.setTimeout(() => setSlow(true), 8000); return () => window.clearTimeout(t); }, []);
  return (
    <div className="view-wait" role="status" aria-label="Opening">
      <PageSigil kind="seed" />
      {slow && (
        <div className="view-slow">
          <p>Still opening. The connection may have stalled.</p>
          <button type="button" className="btn" onClick={() => window.location.reload()}>Try again</button>
        </div>
      )}
    </div>
  );
}
const VIEWS: Record<ViewKey, React.ComponentType> = {
  home: HomeView,
  chapters: page(() => import('./views/ChaptersView'), 'ChaptersView'),
  chapter: page(() => import('./views/ChapterView'), 'ChapterView'),
  step: page(() => import('./views/StepView'), 'StepView'),
  practice: page(() => import('./views/PracticeView'), 'PracticeView'),
  sim: page(() => import('./views/SimView'), 'SimView'),
  steps: page(() => import('./views/StepsView'), 'StepsView'),
  profile: page(() => import('./views/ProfileView'), 'ProfileView'),
  guides: page(() => import('./views/GuidesView'), 'GuidesView'),
  next: page(() => import('./views/NextStepsView'), 'NextStepsView'),
  unit: page(() => import('./views/UnitView'), 'UnitView'),
  seva: page(() => import('./views/SevaView'), 'SevaView'),
  settings: page(() => import('./views/SettingsView'), 'SettingsView'),
  modux: page(() => import('./views/ModuxView'), 'ModuxView'),
  'modux-model': page(() => import('./views/ModuxModelView'), 'ModuxModelView'),
  'modux-stack': page(() => import('./views/ModuxStackView'), 'ModuxStackView'),
  'modux-gauge': page(() => import('./views/ModuxGaugeView'), 'ModuxGaugeView'),
  study: page(() => import('./views/StudyView'), 'StudyView'),
  /* Dash Defenders: the ten-minute treasury check */
  check: page(() => import('./views/CheckView'), 'CheckView'),
  /* Dash Defenders: a token's rules, read from its public record */
  read: page(() => import('./views/ReadView'), 'ReadView'),
  /* StepSAFE's own record: its promises, read from this site in the visitor's browser */
  trust: page(() => import('./views/TrustView'), 'TrustView'),
  /* the welcome page draws outside the shell; this keeps the table whole */
  welcome: HomeView,
};

/* the tab bar's figures: ground under a seed, an open book, a room, three structures joined, the rest */
const ico = (body: React.ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{body}</svg>
);
const TAB_ICON: Record<string, React.ReactNode> = {
  home: ico(<><circle cx="12" cy="9.5" r="3.4" /><path d="M4 18h16" /><path d="M12 13v5" /></>),
  chapters: ico(<><path d="M12 7.2C9.4 5.6 6.8 5.4 4 6.2v11.4c2.8-.8 5.4-.6 8 1 2.6-1.6 5.2-1.8 8-1V6.2c-2.8-.8-5.4-.6-8 1z" /><path d="M12 7.2v11.4" /></>),
  practice: ico(<><rect x="4.5" y="4.5" width="15" height="15" rx="4.5" /><circle cx="12" cy="12" r="2.1" /></>),
  modux: ico(<><circle cx="12" cy="6" r="2.3" /><circle cx="6" cy="17" r="2.3" /><circle cx="18" cy="17" r="2.3" /><path d="M10.9 8l-3.8 7M13.1 8l3.8 7M8.3 17h7.4" /></>),
  more: ico(<><rect x="4.5" y="4.5" width="6" height="6" rx="1.8" /><rect x="13.5" y="4.5" width="6" height="6" rx="1.8" /><rect x="4.5" y="13.5" width="6" height="6" rx="1.8" /><rect x="13.5" y="13.5" width="6" height="6" rx="1.8" /></>),
};

const Lander = lazy(() => import('./views/Lander'));
/* the threshold where a new visitor takes their handle; the menu waits until they have begun */
const Arrival = lazy(() => import('./views/Arrival'));

/** `arrived`: the visitor came through the welcome page, which main.tsx drew on its own, and chose this door */
export function App({ arrived }: { arrived?: string } = {}) {
  const { s, d } = useS();
  essenceForTheme(s.theme);
  /* the welcome page: the first visit, the /welcome link, and the welcome route from inside the Praxis */
  const [landed, setLanded] = useState(() => arrived === undefined && (!s.onboarded || location.pathname === '/welcome'));
  const showLander = landed || s.route.view === 'welcome';
  const pendingGo = useRef<string | null>(null);
  /** a door on the welcome page: a page of the Praxis, or Claros by name */
  const goTo = (go: string) => {
    if (go === 'claros') { d({ t: 'mind', mind: 'claros' }); d({ t: 'route', view: 'seva' }); return; }
    if (go === 'dasha') { d({ t: 'mind', mind: 'dasha' }); d({ t: 'route', view: 'seva' }); return; }
    if (go === 'seva') d({ t: 'mind', mind: 'seva' });
    d({ t: 'route', view: go as ViewKey });
  };
  function begin(go?: string) {
    if (location.pathname === '/welcome') history.replaceState(null, '', '/');
    setLanded(false);
    window.scrollTo(0, 0);
    if (s.onboarded) goTo(go || 'home');
    else { pendingGo.current = go && go !== 'home' ? go : null; if (s.route.view === 'welcome') d({ t: 'route', view: 'home' }); }
  }
  /* a visitor who began on the welcome page drawn before the app arrives here as if they had begun inside it */
  useEffect(() => { if (arrived !== undefined) begin(arrived); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  /* an address may name a place that does not exist (a typo, a room since renamed): that opens Ground */
  const knownPlace = (r: Route) =>
    r.view === 'chapter' ? !!chapterById(r.id || '')
    : r.view === 'step' ? !!stepById(r.id || '')
    : r.view === 'sim' ? !!simById(r.id || '')
    : r.view === 'modux-model' ? !!moduxById(r.id || '')
    : r.view === 'modux-stack' ? !!moduxStackById(r.id || '')
    : r.view === 'guides' && r.id ? !!guideById(r.id)
    : true;
  /* a visitor who chose a door on the welcome page lands there once they have their handle; one who came by an
     address that names a place lands on that place */
  const cameIn = useRef(s.onboarded);
  useEffect(() => {
    if (!s.onboarded || cameIn.current) return;
    cameIn.current = true;
    if (pendingGo.current) { goTo(pendingGo.current); pendingGo.current = null; return; }
    const to = arrival();
    if (to && knownPlace(to)) d({ t: 'route', view: to.view, id: to.id, sub: to.sub });
  }, [s.onboarded]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (s.route.view === 'welcome') window.scrollTo(0, 0); }, [s.route.view]);
  const { push } = useToast();
  const pushRef = useRef(push);
  pushRef.current = push;
  /* the voice that reads aloud follows Settings */
  useEffect(() => { configureVoice(s.voice); }, [s.voice]);
  /* the hidden chapter opens once, the moment its three keys are held */
  const eng = useEngine();
  const outlier = outlierOpen(s);
  useEffect(() => { if (outlier && !s.firsts[OUTLIER_OPENED]) eng.outlierOpened(); }, [outlier]); // eslint-disable-line react-hooks/exhaustive-deps
  /* the shortcuts typed as characters (/ and ?, and the word safe) follow Settings; Ctrl or Cmd with K always opens Find */
  const oneKey = useRef(true);
  oneKey.current = s.shortcuts !== 'off';

  /* the eight principles, hidden: the console carries one a day, and typing the word safe anywhere outside a field surfaces the next */
  useEffect(() => {
    const today = principleOfTheDay();
    console.info('%cStepSAFE :: The Praxis', 'color:#c084fc;font-weight:600', '\n' + today.name + ': ' + today.line + '\nEight principles are hidden here. Type safe anywhere in the app.');
    let buf = '';
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable || e.metaKey || e.ctrlKey || e.altKey || !oneKey.current) return;
      if (e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf !== 'safe') return;
      buf = '';
      const r = surfacePrinciple();
      pushRef.current({
        title: r.isNew ? 'Principle found \u00b7 ' + r.found + ' of ' + r.total : r.principle.name,
        body: (r.isNew ? r.principle.name + '. ' : '') + r.principle.line,
        gold: r.isNew && r.found === r.total,
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const phase = unitPhase(s, CHAPTERS.length);
  const rank = rankOf(s.respect);
  const View = VIEWS[s.route.view] || HomeView;

  /* A link or a file asks first: what it carries is shown, and nothing is written until it is accepted. */
  const [offer, setOffer] = useState<Offer | null>(null);
  /* a study set or a test that arrived by link, asked about the same way */
  const [setOffer2, setSetOffer] = useState<SharedSet | null>(null);
  /* the palette on Ctrl or Cmd K or the slash; the keys on the question mark */
  const [palette, setPalette] = useState(false);
  const [keys, setKeys] = useState(false);
  /* on a phone the full menu is a sheet that opens from the tab bar */
  const [more, setMore] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const inField = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setKeys(false); setPalette(v => !v); return; }
      if (inField || !oneKey.current) return;
      if (e.key === '/') { e.preventDefault(); setKeys(false); setPalette(true); }
      else if (e.key === '?') { e.preventDefault(); setPalette(false); setKeys(v => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const known = (id: string) => !!moduxById(id);
    resultFromUrl(known).then(sh => {
      if (!sh) return;
      history.replaceState(history.state, '', location.pathname);
      setOffer({ kind: 'run', gauge: sh.gauge, run: sh.run, from: 'link' });
    });
    gaugeFromUrl(known).then(sh => {
      if (!sh) return;
      history.replaceState(history.state, '', location.pathname);
      setOffer({ kind: 'gauge', gauge: sh.gauge, from: 'link', note: sh.by && sh.best ? { by: sh.by, notch: sh.best.notch, hoursKept: sh.best.hoursKept, at: Date.now() } : undefined });
    });
    setFromUrl().then(sh => {
      if (!sh) return;
      history.replaceState(history.state, '', location.pathname);
      setSetOffer(sh);
    });
    const onFile = (e: Event) => setOffer((e as CustomEvent<Offer>).detail);
    window.addEventListener('stepsafe-offer', onFile);
    return () => window.removeEventListener('stepsafe-offer', onFile);
  }, []);
  const offerKnown = !!offer && (GAUGES.some(g => g.id === offer.gauge.id) || s.forged.some(g => g.id === offer.gauge.id));
  function acceptOffer() {
    if (!offer) return;
    if (!offerKnown) d({ t: 'forge-add', gauge: offer.gauge });
    if (offer.run) d({ t: 'board-add', gaugeId: offer.gauge.id, run: offer.run });
    if (offer.note) d({ t: 'shared-note', id: offer.gauge.id, note: offer.note });
    if (s.onboarded) d({ t: 'route', view: 'modux-gauge', id: offer.gauge.id });
    setOffer(null);
  }

  useEffect(() => {
    const idle = (cb: () => void) => { if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(cb, { timeout: 4000 }); else window.setTimeout(cb, 1200); };
    /* The rest of the curriculum is several megabytes. It is fetched ahead so pages open at once, except for a
       learner who has asked their browser to save data or is on a very slow line: there each page fetches what
       it needs when it is opened. */
    const line = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (line && (line.saveData || line.effectiveType === '2g' || line.effectiveType === 'slow-2g')) return;
    /* Then each page's own code, one at a time when the browser is idle. A tap after minutes of reading then needs
       no request at all: a connection left idle can be dropped on the way without either end being told, and a
       page fetched at that moment waited on it. */
    const ahead = (i: number) => { if (i < PAGE_CODE.length) idle(() => { PAGE_CODE[i]().catch(() => { /* fetched again when the page is opened */ }).finally(() => ahead(i + 1)); }); };
    const t = window.setTimeout(() => idle(() => { loadContent().then(() => ahead(0), () => { /* each page fetches what it needs when opened */ }); }), 1200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    Swarm.start();
    Swarm.setLight(s.theme === 'meridian');
    Field.start();
    Field.setLight(s.theme === 'meridian');
    return () => { Swarm.stop(); Field.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { Swarm.setLight(s.theme === 'meridian'); Field.setLight(s.theme === 'meridian'); }, [s.theme]);
  /* Back and Forward walk the pages a learner has opened. A page opened by a link starts at its top; one that Back
     or Forward returns to opens where it was left. */
  useEffect(() => Back.start(s.route, r => d({ t: 'route', view: r.view, id: r.id, sub: r.sub }), knownPlace), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (s.onboarded && !knownPlace(s.route)) { Back.redirect(); d({ t: 'route', view: 'home' }); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = useRef<{ view: ViewKey; id?: string } | null>(null);
  useEffect(() => {
    const y = Back.route(s.route);
    const moved = !shown.current || shown.current.view !== s.route.view || shown.current.id !== s.route.id;
    shown.current = { view: s.route.view, id: s.route.id };
    if (y !== null) Back.settle(y);
    else if (moved) window.scrollTo({ top: 0 });
    if (moved) Field.pulse(undefined, undefined, 'note');
  }, [s.route.view, s.route.id, s.route.sub]); // eslint-disable-line react-hooks/exhaustive-deps
  useBackCloses(palette && s.onboarded, () => setPalette(false), 'find');
  useBackCloses(keys, () => setKeys(false), 'keys');
  useBackCloses(more, () => setMore(false), 'more');
  useEffect(() => {
    if (!more) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMore(false); };
    /* a wider window has no sheet: the menu is the row or the rail again */
    const onSize = () => { if (window.innerWidth > 720) setMore(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onSize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onSize); };
  }, [more]);
  /* the sheet takes the focus when it opens, and hands it back to More when it closes with nothing else holding it */
  const sheetWasOpen = useRef(false);
  useEffect(() => {
    if (more) {
      sheetWasOpen.current = true;
      const t = window.setTimeout(() => document.querySelector<HTMLElement>('#nav-all .nav-find')?.focus({ preventScroll: true }), 80);
      return () => window.clearTimeout(t);
    }
    if (!sheetWasOpen.current) return;
    sheetWasOpen.current = false;
    const a = document.activeElement as HTMLElement | null;
    if (!a || a === document.body || a.closest('#nav-all')) document.querySelector<HTMLElement>('.tab-more')?.focus({ preventScroll: true });
  }, [more]);

  /* sections come into view in order; a timer lands every one of them in case the observer never fires */
  useEffect(() => {
    const stage = document.getElementById('main');
    if (!stage) return;
    const all = () => Array.from(stage.querySelectorAll<HTMLElement>('section.band'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') { all().forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    const seen = new Set<Element>();
    const observe = () => all().forEach(el => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(stage, { childList: true, subtree: true });
    const t = window.setTimeout(() => all().forEach(el => el.classList.add('in')), 1400);
    return () => { io.disconnect(); mo.disconnect(); window.clearTimeout(t); };
    /* onboarded too: a new learner arrives on Ground from the threshold, which has no #main to watch */
  }, [s.route.view, s.route.id, s.onboarded, showLander]);

  const stepsDone = Object.keys(s.completedSteps).length;
  const pagesDone = Object.keys(s.completedPages).length;
  const sevaName = s.sevaEvolved ? 'Sevas' : 'Seva';

  const NAV: { key: ViewKey; label: string; count?: number; hide?: boolean }[] = [
    { key: 'home', label: 'Ground' },
    { key: 'chapters', label: 'Chapters', count: Object.keys(s.completedChapters).filter(k => !k.startsWith('mx-')).length },
    { key: 'practice', label: 'The Practice', count: Object.keys(s.completedSims).length },
    { key: 'modux', label: 'Modux Models', count: Object.keys(s.completedChapters).filter(k => k.startsWith('mx-')).length },
    { key: 'guides', label: 'StepGuides' },
    { key: 'study', label: 'StudyMode', count: Math.floor(s.unitiaC / 100) || undefined },
    { key: 'steps', label: 'Steps', count: Object.keys(s.awards).length },
    { key: 'unit', label: PHASE_NAMES[phase] },
    { key: 'profile', label: 'Praxis Profile' },
    { key: 'next', label: 'NextSteps' },
    /* the tab carries the mind the learner is speaking with */
    { key: 'seva', label: s.mind === 'claros' ? 'Claros' : s.mind === 'dasha' ? 'Dasha' : sevaName },
    { key: 'settings', label: 'Settings' },
  ];

  /* the four places on a phone's tab bar, under the names the menu gives them */
  const TABS = NAV.filter(n => n.key === 'home' || n.key === 'chapters' || n.key === 'practice' || n.key === 'modux');
  const go = (key: ViewKey) => {
    const here = s.route.view === key;
    Haptic.tap();
    setMore(false);
    if (here) {
      /* the tab of the page already open returns to its top */
      const calm = document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
    } else d({ t: 'route', view: key });
  };

  const inModux = (s.route.id || '').startsWith('mx-');
  const activeKey: ViewKey =
    (s.route.view === 'chapter' || s.route.view === 'step') ? (inModux ? 'modux' : 'chapters')
    : s.route.view === 'sim' ? 'practice'
    : s.route.view === 'modux-model' || s.route.view === 'modux-stack' || s.route.view === 'modux-gauge' ? 'modux'
    : s.route.view;

  /* on a narrow screen the menu is one scrolling row: the current page's tab stays in view */
  useEffect(() => {
    if (window.innerWidth > 1080) return;
    const t = window.setTimeout(() => {
      const on = document.querySelector<HTMLElement>('.nav .navbtn[aria-current="page"]');
      const list = on?.closest<HTMLElement>('.navlist');
      if (!on || !list) return;
      const a = on.getBoundingClientRect(), b = list.getBoundingClientRect();
      list.scrollTo({ left: list.scrollLeft + a.left - b.left - b.width / 2 + a.width / 2, behavior: 'smooth' });
    }, 60);
    return () => window.clearTimeout(t);
  }, [activeKey, s.onboarded]);

  /* the tab bar has one light: it rests over the open tab and slides there when the page changes */
  const tabbarRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const bar = tabbarRef.current;
    if (!bar) return;
    const place = () => {
      const on = bar.querySelector<HTMLElement>('.tab[aria-current="page"], .tab.on');
      if (!on || !on.offsetWidth) return;
      bar.style.setProperty('--tab-x', Math.round(on.offsetLeft + on.offsetWidth / 2) + 'px');
      /* the first placing is not a move: the light is set down, read once so it is there, and slides from then on */
      if (!bar.dataset.lit && bar.firstElementChild) { void getComputedStyle(bar.firstElementChild).transform; bar.dataset.lit = '1'; }
    };
    place();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(place) : null;
    ro?.observe(bar);
    return () => ro?.disconnect();
  }, [activeKey, more, s.onboarded, showLander]);

  /* the tab, the history and a bookmark carry the name of the place */
  useEffect(() => {
    const r = s.route;
    const name = r.view === 'chapter' ? chapterById(r.id || '')?.title
      : r.view === 'step' ? stepById(r.id || '')?.step.title
      : r.view === 'sim' ? simById(r.id || '')?.title
      : r.view === 'modux-model' ? moduxById(r.id || '')?.name
      : r.view === 'guides' && r.id ? guideById(r.id)?.title
      : r.view === 'trust' ? 'StepSAFE’s own record'
      : r.view === 'check' ? 'Checks before launch'
      : r.view === 'read' ? 'Read a token'
      : r.view === 'home' || r.view === 'welcome' ? '' : NAV.find(n => n.key === activeKey)?.label;
    document.title = name ? name + ' · StepSAFE' : 'StepSAFE :: The Praxis';
  }, [s.route.view, s.route.id, s.route.sub, s.onboarded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Palette open={palette && s.onboarded} onClose={() => setPalette(false)} />
      <Shortcuts open={keys} onClose={() => setKeys(false)} />
      {offer && <LinkOffer offer={offer} known={offerKnown} onAccept={acceptOffer} onDecline={() => setOffer(null)} />}
      {setOffer2 && s.onboarded && <SetOffer set={setOffer2} onDecline={() => setSetOffer(null)} onAccept={() => {
        const x = setOffer2;
        setSetOffer(null);
        const label = x.label + (x.by ? ' \u00b7 from ' + x.by : '');
        if (x.mode === 'exam') requestExam(d, { label: x.label, pool: x.ids, n: x.ids.length, ids: x.ids, seed: x.seed, by: x.by });
        else studyRoute(d, x.ids, label, s.unitiaC);
      }} />}
      <canvas id="field" aria-hidden />
      <canvas id="swarm" aria-hidden />
      {showLander ? (
        <Suspense fallback={<div className="lx-boot" aria-hidden />}>
          <Lander onBegin={begin} entered={s.onboarded} />
        </Suspense>
      ) : !s.onboarded ? (
        <Suspense fallback={<div className="lx-boot" aria-hidden />}>
          <Arrival />
        </Suspense>
      ) : (<>
      <a className="skip" href="#main">Skip to content</a>
      <div className="shell">
        <nav className={'nav' + (more ? ' nav-open' : '')} id="nav-all" aria-label="Primary">
          <div className="brand">
            <span className="brand-mark"><Mark /> StepSAFE</span>
            <span className="brand-sub">The Praxis</span>
          </div>
          {/* the door to the MOTRUS proposal, a page of its own: under the name on a wide screen (CSS shows one door) */}
          <a className="nav-motrus nav-motrus-rail" href="/MOTRUS">
            <MotrusMark size={22} className="nav-motrus-mark" />
            <span>MOTRUS</span>
          </a>

          {s.onboarded && (
            <div className="hud" aria-label="Standing">
              <div className="hud-row">
                <span className="label">Respect</span>
                <span className="hud-v">{s.respect.toLocaleString()}</span>
              </div>
              <div className="hud-row">
                <span className="label">Trust</span>
                <span className="hud-v trust">{s.trust.toLocaleString()}</span>
              </div>
              <div className="hud-row">
                <span className="label">Rank</span>
                <span className="hud-v gold">{rank.name}</span>
              </div>
              {(s.gratus > 0 || s.gratusGold > 0) && (
                <div className="hud-row" title={s.gratus + ' Gratus · ' + s.gratusGold + ' Gratus Gold'}>
                  <span className="label">Gratus</span>
                  <span className="hud-v gx-hud">
                    <GratusSigil size={16} still />{s.gratus.toLocaleString()}
                    {s.gratusGold > 0 && <><GratusSigil size={16} gold still />{s.gratusGold}</>}
                  </span>
                </div>
              )}
              <div className="vessel" role="progressbar"
                aria-label="Steps and pages"
                aria-valuenow={stepsDone} aria-valuemin={0} aria-valuemax={999}>
                <div className="vessel-fill" style={{
                  width: Math.min(100, Math.round((pagesDone / Math.max(1,
                    CHAPTERS.reduce((n, c) => n + c.pages.length, 0))) * 100)) + '%' }} />
              </div>
            </div>
          )}

          <div className="nav-sep" role="presentation" />

          <button className="navbtn nav-find" onClick={() => { setMore(false); setPalette(true); }} disabled={!s.onboarded} aria-label="Find anything in the Praxis">
            <span className="nb-ico" aria-hidden><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
            <span>Find</span>
            <kbd className="nb-kbd">⌘K</kbd>
          </button>
          <ul className="navlist">
            {NAV.map(n => (
              <li key={n.key} className={TABS.some(t => t.key === n.key) ? 'nav-tabbed' : undefined}>
                <button
                  className="navbtn"
                  aria-current={activeKey === n.key ? 'page' : undefined}
                  disabled={!s.onboarded && n.key !== 'home'}
                  onClick={() => { setMore(false); d({ t: 'route', view: n.key }); }}
                >
                  <span>{n.label}</span>
                  {typeof n.count === 'number' && n.count > 0 && (
                    <span className="nb-ct">{n.count}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {/* and after the places on a narrower screen */}
          <a className="nav-motrus nav-motrus-row" href="/MOTRUS">
            <MotrusMark size={22} className="nav-motrus-mark" />
            <span>MOTRUS</span>
          </a>

          <div className="spacer" />
          <div className="navfoot" style={{ padding: '0 8px' }}>
            <p className="label" style={{ lineHeight: 1.7 }}>
              STEPS → PAGES → CHAPTERS<br />
              {PHASE_NAMES[phase]}
            </p>
          </div>
        </nav>
        {more && <div className="nav-scrim" onClick={() => setMore(false)} aria-hidden />}
        <nav className="tabbar" aria-label="Places" ref={tabbarRef}>
          <i className="tab-light" aria-hidden />
          {TABS.map(t => (
            <button key={t.key} className="tab" aria-current={!more && activeKey === t.key ? 'page' : undefined} onClick={() => go(t.key)}>
              {TAB_ICON[t.key]}
              <span>{t.label}</span>
            </button>
          ))}
          <button className={'tab tab-more' + (more || !TABS.some(t => t.key === activeKey) ? ' on' : '')}
            aria-expanded={more} aria-controls="nav-all" onClick={() => setMore(v => !v)}>
            {TAB_ICON.more}
            <span>More</span>
          </button>
        </nav>

        <main id="main" className="stage">
          <div key={s.route.view + ':' + (s.route.id || '') + ':' + (s.route.sub || '')} className="view-in">
            <Suspense fallback={<ViewWait />}>
              <View />
            </Suspense>
          </div>
        </main>
      </div>
      </>)}
    </>
  );
}
