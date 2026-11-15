/* StepSAFE :: The Praxis — the progression engine.
   Steps -> Pages -> Chapters -> the UNIT.
   RESPECT is earned understanding. TRUST is earned standing.
   The unit tab itself evolves: UNIT ONE -> UNIT ZUN -> THE UNIT -> UNITIUM ONE. */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { Back, arrival } from './history';
import { adoptLegacy, adoptLegacyChecks, withoutSecrets } from './keyring';
import type { Guise } from '../content/schema';
import type { OwnSpec } from '../content/modux/own';
import type { ModuxGauge } from '../content/modux-schema';
import { localDay, localYesterday } from './day';
import { RETIRED } from '../content/glossary-aliases';

export type ViewKey =
  | 'home' | 'chapters' | 'chapter' | 'step' | 'practice' | 'sim'
  | 'steps' | 'profile' | 'guides' | 'next' | 'unit' | 'seva' | 'settings' | 'modux' | 'modux-model' | 'modux-stack' | 'modux-gauge' | 'study' | 'welcome' | 'check' | 'read' | 'trust';

export interface UserProject {
  id: string;
  title: string;
  domain: string;
  brief: string;
  status: 'forging' | 'active' | 'submitted' | 'complete';
  evidence: string[];
  createdAt: number;
}

export interface AttestDraft {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  context: string;
  at: number;
  status: 'draft' | 'shared';
}

export interface SevaMsg {
  id: string;
  from: 'seva' | 'claros' | 'dasha' | 'me';
  text: string;
  at: number;
  tone?: string;
  /** Claros: the day this answer is about, played on the map of the system it read */
  card?: { plan: 'stress' | 'hardest'; focus: string };
  /** Seva: a question built from what Claros read, and the answer the learner picked */
  quiz?: { q: string; options: string[]; answer: number; why: string; picked?: number };
  /** Dasha: what her own server reported about this answer (the model, the live sources, what to ask next) */
  meta?: { model?: string; tools?: string[]; next?: string[]; say?: string; skills?: string[] };
}

/** One notch of one gauge. */
export interface LevelRecord {
  best: number;
  held: boolean;
  beatRef: boolean;
  at: number;
  gold?: boolean;
}

export interface GaugeRecord {
  best: number;
  stack: string[];
  at: number;
  runs: number;
  held: boolean;
  beatRef: boolean;
  /** keyed by notch */
  levels: Record<string, LevelRecord>;
  /** highest notch held, -1 for none */
  top: number;
}

/** Where a learner left a gauge: the notches taken, in order, and the salt. */
export interface GaugeSession {
  used: string[];
  salt: string;
}

export interface GoldMoment {
  gauge: string;
  title: string;
  notch: number;
  score: number;
  ref: number;
  at: number;
  /** 'notch': a high notch at or above the reference; 'beyond': past the catalog ceiling */
  why: 'notch' | 'beyond';
}

export interface RunLog {
  g: string;
  title: string;
  notch: number;
  score: number;
  ref: number;
  held: boolean;
  at: number;
  /** model families in the stack */
  fams: string[];
  motrus: number;
  /** the week's pressure this run was made under, when it was */
  week?: string;
}

/* ---------- StudyMode: what a learner has done with each card ---------- */

/** UNITIA is kept in hundredths, so 0.01 a second never drifts */
export const UNITIA_C_PER_SECOND = 1;
export const UNITIA_C_PER_REVIEW = 100;
/** seconds on one card that earn UNITIA in a day; time past it still counts as time */
export const STUDY_DAILY_CARD_SECONDS = 600;
/** seconds on a card, in a day, before a review of it pays */
export const STUDY_REVIEW_MIN_SECONDS = 5;
/** the Semble Sound reading runs from -112 to +112; below 1 is the FUD range */
export const SOUND_MIN = -112;
export const SOUND_MAX = 112;

export interface CardState {
  /** seconds on the card, ever */
  secs: number;
  /** the day the next two count */
  day?: string;
  daySecs?: number;
  /** UNITIA earned on the card, in hundredths */
  unitiaC: number;
  firstAt: number;
  lastAt: number;
  views: number;
  sound?: number;
  soundLog?: { at: number; v: number }[];
  tags?: string[];
  note?: string;
  ownWords?: string;
  favorite?: boolean;
  diving?: boolean;
  essential?: boolean;
  /** spaced review: box 0 to 5, the time it is next due, how often it slipped */
  box?: number;
  due?: number;
  lapses?: number;
  reviews?: number;
  /** the last day a review of this card paid its UNITIA */
  reviewDay?: string;
  quiz?: { right: number; wrong: number; lastAt: number };
  /** a MoTRUS model forged from this card */
  motrus?: string;
}

export type CardPatch = Partial<Pick<CardState, 'sound' | 'tags' | 'note' | 'ownWords' | 'favorite' | 'diving' | 'essential' | 'motrus'>>;

const STUDY_INTERVAL_DAYS = [0, 1, 3, 7, 21, 60];
function freshCard(at: number): CardState { return { secs: 0, unitiaC: 0, firstAt: at, lastAt: at, views: 0 }; }

/** the review: Again, Hard, Good or Strong moves the card between boxes and sets when it is due */
export function scheduleCard(c: CardState, grade: 0 | 1 | 2 | 3, at: number): CardState {
  const box = c.box ?? 0;
  let nb = box;
  if (grade === 0) nb = 0;
  else if (grade === 1) nb = Math.max(1, box);
  else if (grade === 2) nb = Math.min(5, box + 1);
  else nb = Math.min(5, box + 2);
  const days = grade === 0 ? 10 / 1440 : grade === 1 ? Math.max(0.5, STUDY_INTERVAL_DAYS[nb] * 0.5) : STUDY_INTERVAL_DAYS[nb];
  return { ...c, box: nb, due: at + days * 86400000, lapses: (c.lapses || 0) + (grade === 0 && box > 0 ? 1 : 0), reviews: (c.reviews || 0) + 1 };
}

/* one run that came back by link: a teammate's or a student's day on the same gauge */
export interface BoardRun { by: string; notch: number; score: number; hoursKept: number; held: boolean; stack: string[]; at: number }

/* what travelled with a shared gauge: who sent it and their best held day, when they chose to include it */
export interface SharedNote { by: string; notch: number; hoursKept: number; at: number }

/* a goal: a number the record can answer, or a line in the learner's own words */
export type GoalKey = 'people' | 'hours' | 'gauges' | 'notch' | 'streak' | 'chapters' | 'steps' | 'rooms' | 'guides' | 'cards' | 'unitia' | 'own';
export interface Goal {
  id: string;
  key: GoalKey;
  title: string;
  target: number;
  /** an ISO day, optional */
  by?: string;
  createdAt: number;
  reachedAt?: number;
}

/* the profile in the learner's own words */
export interface PraxisProfile {
  bio: string;
  mantra: string;
  quote: string;
  anchors: string;
  /** an honest paragraph: what you do well and really really well */
  strong: string;
  /** an honest paragraph: what you need help with and what you want to work on */
  help: string;
  cyberGoals: string;
  systemsGoals: string;
  /** one line for the week, and when it was set */
  intention: string;
  intentionAt: number;
}

export const FRESH_PROFILE: PraxisProfile = {
  bio: '', mantra: '', quote: '', anchors: '', strong: '', help: '', cyberGoals: '', systemsGoals: '',
  intention: '', intentionAt: 0,
};

/* one change of Unitium Code Name, with the learner's own account of it. Private:
   a share link carries only the name. */
export interface CodeNameEntry {
  at: number;
  /** the name before; empty on the first naming */
  from: string;
  to: string;
  context: string;
  inspiration: string;
  /** what made this foundation change or switch */
  shift: string;
  /** why you are a new you */
  newYou: string;
  /** what you will set off and do */
  moves: string;
}

export interface WalletInfo {
  address: string;
  chainId: string;
  label: string;
}

/* Bring-your-own-model. A learner can point Seva at their own Anthropic key or
   at their own Davara instance instead of the shared server key.

   Storage is deliberate and worth stating plainly: this lives in localStorage
   on this device. Any script running on this origin can read it — which is the
   same trust boundary as the site itself, but it is NOT the same as a secret
   held server-side. It is never sent to the StepSAFE server: a personal
   Anthropic key goes browser-direct to api.anthropic.com, and a Davara token
   goes only to the endpoint its owner configured. */
/* the voice: the device's own speech, or ElevenLabs on the learner's key, browser direct */
export interface VoiceConfig {
  mode: 'device' | 'eleven';
  elevenKey: string;
  voiceId: string;
  rate: number;
}
export const FRESH_VOICE: VoiceConfig = { mode: 'device', elevenKey: '', voiceId: 'cHlKR8aJujyitGaZzzp0', rate: 1 };

/* a test taken in StudyMode: what it was on, how many, how many right, how long */
export interface ExamResult { label: string; n: number; right: number; secs: number; at: number }

export interface ProviderConfig {
  /** 'shared' = the StepSAFE server key; 'anthropic' = your own key, browser-direct; 'davara' = your own instance */
  mode: 'shared' | 'anthropic' | 'davara';
  anthropicKey: string;
  /** model id used with a personal Anthropic key */
  model: string;
  /** full URL of a Davara-compatible chat endpoint */
  davaraUrl: string;
  /** DMAT / bearer token presented to that endpoint */
  davaraToken: string;
}

export const FRESH_PROVIDER: ProviderConfig = {
  mode: 'shared',
  anthropicKey: '',
  model: 'claude-sonnet-5-5',
  davaraUrl: '',
  davaraToken: '',
};

/* A drill you got wrong comes back. Leitner boxes with an expanding schedule —
   the interval only grows when you answer it cleanly, and a lapse knocks it
   back down. Retrieval under a delay is what converts reading into recall;
   getting it right once, immediately, converts almost nothing. */
export interface ReviewItem {
  drillId: string;
  stepId: string;
  /** 0..5 — position in the expanding schedule */
  box: number;
  due: number;
  lapses: number;
  lastScore: number;
}

/** days until a drill in each box returns */
export const REVIEW_INTERVALS = [0, 1, 3, 7, 21, 60];
export const DAY_MS = 86400000;

export function reviewDue(s: S, now = Date.now()): ReviewItem[] {
  return Object.values(s.reviews)
    .filter(r => r.due <= now)
    .sort((a, b) => a.due - b.due);
}

export interface S {
  v: number;
  handle: string;
  onboarded: boolean;
  guise: Guise | null;
  theme: 'nocturne' | 'meridian' | 'mov';
  /* the voice that reads aloud; a key here lives on this device and never travels */
  voice: VoiceConfig;
  /* display: the size of everything, and how much moves */
  textSize: 'standard' | 'large' | 'largest';
  motion: 'full' | 'calm';
  /* WCAG 2.1.4: the shortcuts made of one character (/ and ?, and L and 1 to 4 on a study card) can be turned off */
  shortcuts: 'on' | 'off';
  mode: 'novus' | 'motus';
  respect: number;
  trust: number;
  completedSteps: Record<string, number>;
  drillScores: Record<string, number>;
  completedPages: Record<string, number>;
  completedChapters: Record<string, number>;
  completedSims: Record<string, { at: number; score: number }>;
  awards: Record<string, number>;
  unitMembers: string[];
  projects: UserProject[];
  attestations: AttestDraft[];
  sevaLog: SevaMsg[];
  sevaEvolved: boolean;
  /* the minds: Seva teaches, Claros reads systems, Dasha supports building on Dash; each keeps its own conversation */
  mind: 'seva' | 'claros' | 'dasha';
  clarosLog: SevaMsg[];
  dashaLog: SevaMsg[];
  /* the system Claros is reading: 'draft', 'own:<gauge id>' or 'sys:<known id>' */
  clarosFocus: string | null;
  /* time with the minds, by local day: kept on this device like everything else here */
  mindDays: Record<string, MindDay>;
  wallet: WalletInfo | null;
  guidesRead: Record<string, number>;
  streak: number;
  lastDay: string;
  firsts: Record<string, number>;
  /* spaced repetition */
  reviews: Record<string, ReviewItem>;
  reviewsCleared: number;
  /* counters the award hooks read */
  perfectDrills: Record<string, number>;
  recoveredDrills: Record<string, number>;
  flawlessSims: Record<string, number>;
  /* Modux gauges */
  gauges: Record<string, GaugeRecord>;
  gaugeSessions: Record<string, GaugeSession>;
  forged: ModuxGauge[];
  gratus: number;
  gratusGold: number;
  golds: GoldMoment[];
  runLog: RunLog[];
  /* the profile in the learner's own words, and the Unitium Code Name */
  profile: PraxisProfile;
  codeName: string;
  codeNameLog: CodeNameEntry[];
  /* goals against the record, and the days the watch was kept */
  goals: Goal[];
  /* your own systems: the map being drawn, the map behind each built gauge, and what a shared link said */
  ownDraft: OwnSpec | null;
  ownSpecs: Record<string, OwnSpec>;
  sharedNotes: Record<string, SharedNote>;
  /* runs that came back by link, per gauge */
  boards: Record<string, BoardRun[]>;
  /* StudyMode: each card's record, UNITIA in hundredths, and UNITIA by day */
  study: Record<string, CardState>;
  unitiaC: number;
  unitiaDays: Record<string, number>;
  /* the tests taken in StudyMode, newest last, at most thirty */
  exams: ExamResult[];
  watchesKept: number;
  lastWatch: string;
  /* bring-your-own-model */
  provider: ProviderConfig;
  route: { view: ViewKey; id?: string; sub?: string };
}

const KEY = 'stepsafe-praxis-v1';

const FRESH: S = {
  v: 1,
  handle: '',
  onboarded: false,
  guise: null,
  theme: 'nocturne',
  voice: FRESH_VOICE,
  textSize: 'standard',
  motion: 'full',
  shortcuts: 'on',
  mode: 'novus',
  respect: 0,
  trust: 0,
  completedSteps: {},
  drillScores: {},
  completedPages: {},
  completedChapters: {},
  completedSims: {},
  awards: {},
  unitMembers: [],
  projects: [],
  attestations: [],
  sevaLog: [],
  sevaEvolved: false,
  mind: 'seva',
  clarosLog: [],
  dashaLog: [],
  clarosFocus: null,
  mindDays: {},
  wallet: null,
  guidesRead: {},
  streak: 0,
  lastDay: '',
  firsts: {},
  reviews: {},
  reviewsCleared: 0,
  perfectDrills: {},
  recoveredDrills: {},
  flawlessSims: {},
  gauges: {},
  gaugeSessions: {},
  forged: [],
  gratus: 0,
  gratusGold: 0,
  golds: [],
  runLog: [],
  profile: FRESH_PROFILE,
  codeName: '',
  codeNameLog: [],
  goals: [],
  ownDraft: null,
  ownSpecs: {},
  sharedNotes: {},
  boards: {},
  study: {},
  unitiaC: 0,
  unitiaDays: {},
  exams: [],
  watchesKept: 0,
  lastWatch: '',
  provider: FRESH_PROVIDER,
  route: { view: 'home' },
};

/** the saved record, read once at start; exported so the keyring probe can attack the migration */
export function load(): S {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return FRESH;
    const s = JSON.parse(raw);
    /* Trials became Gauges on 2026-10-13: carry every record across */
    if (s.trials && !s.gauges) {
      const gauges: Record<string, GaugeRecord> = {};
      for (const [id, t] of Object.entries(s.trials as Record<string, Omit<GaugeRecord, 'levels' | 'top'>>)) {
        gauges[id] = {
          ...t,
          levels: { '0': { best: t.best, held: t.held, beatRef: t.beatRef, at: t.at } },
          top: t.held ? 0 : -1,
        };
      }
      s.gauges = gauges;
      /* holds earned before Gratus existed are paid once, by the same rule */
      s.gratus = (s.gratus || 0) + Object.values(gauges).reduce((n, g) => n + (g.held ? 1 : 0) + (g.beatRef ? 1 : 0), 0);
    }
    delete s.trials;
    adoptLegacy({ anthropicKey: s.provider?.anthropicKey, davaraToken: s.provider?.davaraToken, elevenKey: s.voice?.elevenKey });
    if (s.provider) s.provider = { ...s.provider, anthropicKey: '', davaraToken: '' };
    if (s.voice) s.voice = { ...s.voice, elevenKey: '' };
    /* Seven glossary entries that repeated another were merged on 2026-11-09. A study record kept for a retired
       card moves to the card that holds its place; where both were studied, the kept card's record stands and
       takes the other's words, notes and tags so nothing the learner wrote is lost. */
    if (s.study) for (const [old, kept] of Object.entries(RETIRED)) {
      const a = s.study['term:' + old], b = s.study['term:' + kept];
      if (!a) continue;
      const join = (x?: string, y?: string) => [x, y].filter(t => t && t.trim()).filter((t, i, all) => all.indexOf(t) === i).join('\n\n') || undefined;
      s.study['term:' + kept] = b ? { ...a, ...b, ownWords: join(b.ownWords, a.ownWords), note: join(b.note, a.note), tags: [...new Set([...(b.tags || []), ...(a.tags || [])])] } : a;
      delete s.study['term:' + old];
    }
    /* treasury checks were kept here in plain text on 2026-10-27; they move to the keyring, for this visit */
    adoptLegacyChecks(s.checks);
    delete s.checks;
    return { ...FRESH, ...s, profile: { ...FRESH_PROFILE, ...(s.profile || {}) }, voice: { ...FRESH_VOICE, ...(s.voice || {}) }, route: (s.onboarded && arrival()) || { view: 'home' } };
  } catch {
    return FRESH;
  }
}

/** one day with the minds: seconds and asks with each, and what Claros's answers held */
export interface MindDay {
  t: { seva: number; claros: number; dasha: number };
  a: { seva: number; claros: number; dasha: number };
  /** live sources Dasha reached that day (the docs, the ballot, the network), as her server reported them */
  dl: number;
  /** the systems Claros read that day, by name */
  sys: string[];
  /** numbered moves in Claros's plans */
  moves: number;
  /** the best plan seen for each system that day: hours of service it adds, by the model */
  best: Record<string, number>;
  /** moves by verb: model, harden, detect, isolate, restore */
  v: Record<string, number>;
  /** asks to attack a system, turned to its defense */
  refused: number;
}
const EMPTY_DAY: MindDay = { t: { seva: 0, claros: 0, dasha: 0 }, a: { seva: 0, claros: 0, dasha: 0 }, dl: 0, sys: [], moves: 0, best: {}, v: {}, refused: 0 };
function mindDayOf(s: S, k: string): MindDay {
  const d = (s.mindDays || {})[k];
  return d ? { ...EMPTY_DAY, ...d, t: { ...EMPTY_DAY.t, ...d.t }, a: { ...EMPTY_DAY.a, ...d.a } } : EMPTY_DAY;
}
/** a year of days is plenty; the oldest go first */
function keepDays(m: Record<string, MindDay>): Record<string, MindDay> {
  const ks = Object.keys(m).sort();
  if (ks.length <= 366) return m;
  const out: Record<string, MindDay> = {};
  for (const k of ks.slice(-366)) out[k] = m[k];
  return out;
}

export type Act =
  | { t: 'route'; view: ViewKey; id?: string; sub?: string }
  | { t: 'onboard'; handle: string; guise: Guise }
  | { t: 'guise'; guise: Guise }
  | { t: 'theme'; theme: S['theme'] }
  | { t: 'display'; textSize?: S['textSize']; motion?: S['motion']; shortcuts?: S['shortcuts'] }
  | { t: 'voice'; patch: Partial<VoiceConfig> }
  | { t: 'exam-done'; result: ExamResult }
  | { t: 'mode'; mode: S['mode'] }
  | { t: 'earn'; respect: number; trust: number }
  | { t: 'step-done'; stepId: string; respect: number; trust: number }
  | { t: 'drill-score'; drillId: string; score: number }
  | { t: 'page-done'; pageId: string }
  | { t: 'chapter-done'; chapterId: string }
  | { t: 'sim-done'; simId: string; score: number; respect: number; trust: number }
  | { t: 'award'; awardId: string }
  | { t: 'unit-join'; memberId: string }
  | { t: 'project-add'; project: UserProject }
  | { t: 'project-update'; id: string; patch: Partial<UserProject> }
  | { t: 'attest-add'; draft: AttestDraft }
  | { t: 'attest-update'; id: string; status: AttestDraft['status'] }
  | { t: 'seva-msg'; msg: SevaMsg }
  | { t: 'claros-msg'; msg: SevaMsg }
  | { t: 'dasha-msg'; msg: SevaMsg }
  | { t: 'mind'; mind: 'seva' | 'claros' | 'dasha' }
  | { t: 'claros-focus'; focus: string | null }
  | { t: 'mind-time'; mind: 'seva' | 'claros' | 'dasha'; secs: number }
  | { t: 'seva-quiz-pick'; id: string; picked: number }
  | { t: 'mind-ask'; mind: 'seva' | 'claros' | 'dasha'; sys?: string; moves?: number; best?: number; verbs?: string[]; refused?: boolean; lookups?: number }
  | { t: 'seva-evolve' }
  | { t: 'wallet'; wallet: WalletInfo | null }
  | { t: 'guide-read'; guideId: string }
  | { t: 'first'; key: string }
  | { t: 'touch-day' }
  | { t: 'review-schedule'; drillId: string; stepId: string; score: number }
  | { t: 'review-result'; drillId: string; passed: boolean }
  | { t: 'sim-flawless'; simId: string }
  | { t: 'provider'; patch: Partial<ProviderConfig> }
  | { t: 'import'; state: Partial<S> }
  | { t: 'gauge-done'; gaugeId: string; notch: number; score: number; stack: string[]; held: boolean; beatRef: boolean;
      gratus: number; gold: GoldMoment | null; log: RunLog }
  | { t: 'gauge-session'; gaugeId: string; session: GaugeSession | null }
  | { t: 'forge-add'; gauge: ModuxGauge }
  | { t: 'forge-remove'; id: string }
  | { t: 'profile'; patch: Partial<PraxisProfile> }
  | { t: 'code-name'; entry: CodeNameEntry }
  | { t: 'goal-add'; goal: Goal }
  | { t: 'own-draft'; spec: OwnSpec | null }
  | { t: 'own-spec'; id: string; spec: OwnSpec }
  | { t: 'shared-note'; id: string; note: SharedNote }
  | { t: 'board-add'; gaugeId: string; run: BoardRun }
  | { t: 'study-view'; id: string; at: number }
  | { t: 'study-time'; id: string; secs: number; day: string; at: number }
  | { t: 'study-patch'; id: string; patch: CardPatch; at: number }
  | { t: 'study-grade'; id: string; grade: 0 | 1 | 2 | 3; day: string; at: number }
  | { t: 'study-quiz'; id: string; right: boolean; day: string; at: number }
  | { t: 'goal-remove'; id: string }
  | { t: 'goal-reached'; id: string; at: number }
  | { t: 'watch-kept'; day: string }
  | { t: 'reset' };

export function reducer(s: S, a: Act): S {
  switch (a.t) {
    case 'route': return { ...s, route: { view: a.view, id: a.id, sub: a.sub } };
    case 'onboard': return { ...s, onboarded: true, handle: a.handle, guise: a.guise };
    case 'guise': return { ...s, guise: a.guise };
    case 'theme': return { ...s, theme: a.theme };
    case 'display': return { ...s, ...(a.textSize ? { textSize: a.textSize } : {}), ...(a.motion ? { motion: a.motion } : {}), ...(a.shortcuts ? { shortcuts: a.shortcuts } : {}) };
    case 'mode': return { ...s, mode: a.mode };
    case 'earn': return { ...s, respect: s.respect + a.respect, trust: s.trust + a.trust };
    case 'step-done':
      if (s.completedSteps[a.stepId]) return s;
      return {
        ...s,
        completedSteps: { ...s.completedSteps, [a.stepId]: Date.now() },
        respect: s.respect + a.respect,
        trust: s.trust + a.trust,
      };
    case 'drill-score': {
      const prev = s.drillScores[a.drillId];
      const perfect = a.score > 0;
      /* a drill you previously failed and have now answered cleanly is a
         recovery — the most under-counted learning event there is */
      const recovered = perfect && prev !== undefined && prev < 0 && !s.recoveredDrills[a.drillId];
      return {
        ...s,
        drillScores: { ...s.drillScores, [a.drillId]: a.score },
        perfectDrills: perfect && !s.perfectDrills[a.drillId]
          ? { ...s.perfectDrills, [a.drillId]: Date.now() } : s.perfectDrills,
        recoveredDrills: recovered
          ? { ...s.recoveredDrills, [a.drillId]: Date.now() } : s.recoveredDrills,
      };
    }
    case 'review-schedule': {
      /* only wrong answers enter the queue; a clean first pass does not need it */
      if (a.score > 0 && !s.reviews[a.drillId]) return s;
      const existing = s.reviews[a.drillId];
      const box = a.score > 0 ? Math.min(5, (existing?.box ?? 0) + 1) : 0;
      return {
        ...s,
        reviews: {
          ...s.reviews,
          [a.drillId]: {
            drillId: a.drillId,
            stepId: a.stepId,
            box,
            due: Date.now() + REVIEW_INTERVALS[box] * DAY_MS,
            lapses: (existing?.lapses ?? 0) + (a.score > 0 ? 0 : 1),
            lastScore: a.score,
          },
        },
      };
    }
    case 'review-result': {
      const r = s.reviews[a.drillId];
      if (!r) return s;
      if (a.passed) {
        const box = Math.min(5, r.box + 1);
        const reviews = { ...s.reviews };
        /* graduated out of the queue once it survives the longest interval */
        if (box >= 5) delete reviews[a.drillId];
        else reviews[a.drillId] = { ...r, box, due: Date.now() + REVIEW_INTERVALS[box] * DAY_MS };
        return { ...s, reviews, reviewsCleared: s.reviewsCleared + 1 };
      }
      return {
        ...s,
        reviews: {
          ...s.reviews,
          [a.drillId]: { ...r, box: 0, lapses: r.lapses + 1, due: Date.now() + REVIEW_INTERVALS[0] * DAY_MS },
        },
      };
    }
    case 'sim-flawless':
      if (s.flawlessSims[a.simId]) return s;
      return { ...s, flawlessSims: { ...s.flawlessSims, [a.simId]: Date.now() } };
    case 'page-done':
      if (s.completedPages[a.pageId]) return s;
      return { ...s, completedPages: { ...s.completedPages, [a.pageId]: Date.now() } };
    case 'chapter-done':
      if (s.completedChapters[a.chapterId]) return s;
      return { ...s, completedChapters: { ...s.completedChapters, [a.chapterId]: Date.now() } };
    case 'sim-done':
      return {
        ...s,
        completedSims: { ...s.completedSims, [a.simId]: { at: Date.now(), score: a.score } },
        respect: s.respect + a.respect,
        trust: s.trust + a.trust,
      };
    case 'award':
      if (s.awards[a.awardId]) return s;
      return { ...s, awards: { ...s.awards, [a.awardId]: Date.now() } };
    case 'unit-join':
      if (s.unitMembers.includes(a.memberId)) return s;
      return { ...s, unitMembers: [...s.unitMembers, a.memberId] };
    case 'project-add': return { ...s, projects: [a.project, ...s.projects] };
    case 'project-update':
      return { ...s, projects: s.projects.map(p => (p.id === a.id ? { ...p, ...a.patch } : p)) };
    case 'attest-add': return { ...s, attestations: [a.draft, ...s.attestations] };
    case 'attest-update':
      return { ...s, attestations: s.attestations.map(d => (d.id === a.id ? { ...d, status: a.status } : d)) };
    case 'seva-msg':
      /* a milestone line that Seva said a moment ago is not said again */
      if (a.msg.from !== 'me' && a.msg.tone && !a.msg.tone.startsWith('quiz') && s.sevaLog.slice(-4).some(x => x.from !== 'me' && x.text === a.msg.text)) return s;
      return { ...s, sevaLog: [...s.sevaLog.slice(-199), a.msg] };
    case 'claros-msg': return { ...s, clarosLog: [...(s.clarosLog || []).slice(-199), a.msg] };
    case 'dasha-msg': return { ...s, dashaLog: [...(s.dashaLog || []).slice(-199), a.msg] };
    case 'mind': return { ...s, mind: a.mind === 'claros' ? 'claros' : a.mind === 'dasha' ? 'dasha' : 'seva' };
    case 'claros-focus': return { ...s, clarosFocus: a.focus };
    case 'seva-quiz-pick':
      return { ...s, sevaLog: s.sevaLog.map(m => (m.id === a.id && m.quiz && m.quiz.picked === undefined ? { ...m, quiz: { ...m.quiz, picked: a.picked } } : m)) };
    case 'mind-time': {
      if (!(a.secs > 0)) return s;
      const k = localDay(), day = mindDayOf(s, k);
      return { ...s, mindDays: keepDays({ ...(s.mindDays || {}), [k]: { ...day, t: { ...day.t, [a.mind]: day.t[a.mind] + Math.min(600, Math.round(a.secs)) } } }) };
    }
    case 'mind-ask': {
      const k = localDay(), day = mindDayOf(s, k);
      const next: MindDay = { ...day, a: { ...day.a, [a.mind]: day.a[a.mind] + 1 } };
      if (a.sys) {
        next.sys = day.sys.includes(a.sys) ? day.sys : [...day.sys, a.sys].slice(-24);
        if (a.best && a.best > (day.best[a.sys] || 0)) next.best = { ...day.best, [a.sys]: Math.round(a.best * 10) / 10 };
      }
      if (a.moves) next.moves = day.moves + a.moves;
      if (a.verbs?.length) { const v = { ...day.v }; for (const x of a.verbs) v[x] = (v[x] || 0) + 1; next.v = v; }
      if (a.refused) next.refused = day.refused + 1;
      if (a.lookups) next.dl = (day.dl || 0) + Math.min(12, a.lookups);
      return { ...s, mindDays: keepDays({ ...(s.mindDays || {}), [k]: next }) };
    }
    case 'seva-evolve': return { ...s, sevaEvolved: true };
    case 'wallet': return { ...s, wallet: a.wallet };
    case 'guide-read':
      if (s.guidesRead[a.guideId]) return s;
      return { ...s, guidesRead: { ...s.guidesRead, [a.guideId]: Date.now() } };
    case 'first':
      if (s.firsts[a.key]) return s;
      return { ...s, firsts: { ...s.firsts, [a.key]: Date.now() } };
    case 'touch-day': {
      const today = localDay();
      if (s.lastDay === today) return s;
      /* a day stamped in UTC before the local-day fix can sit ahead of today: take today, leave the streak */
      if (s.lastDay && s.lastDay > today) return { ...s, lastDay: today };
      const yest = localYesterday();
      return { ...s, lastDay: today, streak: s.lastDay === yest ? s.streak + 1 : 1 };
    }
    case 'provider': return { ...s, provider: { ...s.provider, ...a.patch, anthropicKey: '', davaraToken: '' } };
    case 'exam-done': {
      const r = a.result;
      const n = Math.max(0, Math.min(60, Math.floor(Number(r.n) || 0)));
      if (!n) return s;
      const clean: ExamResult = { label: String(r.label || 'A test').slice(0, 80), n, right: Math.max(0, Math.min(n, Math.floor(Number(r.right) || 0))), secs: Math.max(0, Math.min(86400, Math.floor(Number(r.secs) || 0))), at: Number(r.at) || Date.now() };
      return { ...s, exams: [...(s.exams || []), clean].slice(-30) };
    }
    case 'voice': {
      const v = { ...FRESH_VOICE, ...s.voice, ...a.patch };
      v.rate = Math.max(0.7, Math.min(1.3, Number(v.rate) || 1));
      v.elevenKey = '';
      v.voiceId = (v.voiceId || '').trim().replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64) || FRESH_VOICE.voiceId;
      return { ...s, voice: v };
    }
    case 'import': {
      /* a restored record never carries credentials, treasury checks or a route — those belong to
         the device you are on, not to the record you are importing */
      const st = { ...a.state } as Record<string, unknown>;
      delete st.checks;
      return {
        ...FRESH,
        ...(st as Partial<S>),
        provider: s.provider,
        voice: s.voice,
        theme: s.theme,
        route: { view: 'profile' },
      };
    }
    case 'gauge-done': {
      const prev = s.gauges[a.gaugeId];
      const key = String(a.notch);
      const lv = prev?.levels[key];
      const better = !prev || a.score > prev.best;
      const level: LevelRecord = {
        best: Math.max(lv?.best ?? 0, a.score),
        held: a.held || !!lv?.held,
        beatRef: a.beatRef || !!lv?.beatRef,
        at: Date.now(),
        gold: !!a.gold || !!lv?.gold,
      };
      return {
        ...s,
        gauges: {
          ...s.gauges,
          [a.gaugeId]: {
            best: better ? a.score : prev.best,
            stack: better ? a.stack : prev.stack,
            at: Date.now(),
            runs: (prev?.runs ?? 0) + 1,
            held: a.held || !!prev?.held,
            beatRef: a.beatRef || !!prev?.beatRef,
            levels: { ...(prev?.levels || {}), [key]: level },
            top: a.held ? Math.max(prev?.top ?? -1, a.notch) : (prev?.top ?? -1),
          },
        },
        gratus: s.gratus + a.gratus,
        gratusGold: s.gratusGold + (a.gold ? 1 : 0),
        golds: a.gold ? [...s.golds, a.gold].slice(-200) : s.golds,
        runLog: [...s.runLog, a.log].slice(-300),
      };
    }
    case 'gauge-session': {
      const next = { ...s.gaugeSessions };
      if (a.session) next[a.gaugeId] = a.session; else delete next[a.gaugeId];
      return { ...s, gaugeSessions: next };
    }
    case 'forge-add': {
      /* your own maps stay; forged and shared gauges keep the newest twenty four */
      const rest = s.forged.filter(g => g.id !== a.gauge.id);
      const list = [a.gauge, ...rest];
      let others = 0;
      return { ...s, forged: list.filter(g => g.seed === 'own' || ++others <= 24) };
    }
    case 'forge-remove': {
      const sessions = { ...s.gaugeSessions };
      delete sessions[a.id];
      return { ...s, forged: s.forged.filter(g => g.id !== a.id), gaugeSessions: sessions };
    }
    case 'profile': return { ...s, profile: { ...s.profile, ...a.patch } };
    case 'own-draft': return { ...s, ownDraft: a.spec };
    case 'own-spec': {
      const specs = { ...s.ownSpecs, [a.id]: a.spec };
      const keys = Object.keys(specs);
      for (const k of keys.slice(0, Math.max(0, keys.length - 32))) delete specs[k];
      return { ...s, ownSpecs: specs };
    }
    case 'shared-note': return { ...s, sharedNotes: { ...s.sharedNotes, [a.id]: a.note } };
    case 'study-view': {
      const c = s.study[a.id] || freshCard(a.at);
      return { ...s, study: { ...s.study, [a.id]: { ...c, views: c.views + 1, lastAt: a.at } } };
    }
    case 'study-time': {
      const secs = Math.max(0, Math.min(120, Math.round(a.secs)));
      if (!secs) return s;
      const c0 = s.study[a.id] || freshCard(a.at);
      const daySecs = c0.day === a.day ? c0.daySecs || 0 : 0;
      const counted = Math.max(0, Math.min(secs, STUDY_DAILY_CARD_SECONDS - daySecs));
      const earned = counted * UNITIA_C_PER_SECOND;
      const c = { ...c0, secs: c0.secs + secs, day: a.day, daySecs: daySecs + secs, unitiaC: c0.unitiaC + earned, lastAt: a.at };
      return { ...s, study: { ...s.study, [a.id]: c }, unitiaC: s.unitiaC + earned, unitiaDays: earned ? { ...s.unitiaDays, [a.day]: (s.unitiaDays[a.day] || 0) + earned } : s.unitiaDays };
    }
    case 'study-patch': {
      const c0 = s.study[a.id] || freshCard(a.at);
      const patch: CardPatch = { ...a.patch };
      let soundLog = c0.soundLog;
      if (typeof patch.sound === 'number') {
        patch.sound = Math.max(SOUND_MIN, Math.min(SOUND_MAX, Math.round(patch.sound)));
        soundLog = [...(c0.soundLog || []), { at: a.at, v: patch.sound }].slice(-24);
      }
      if (patch.tags) patch.tags = [...new Set(patch.tags.map(t => t.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 32)).filter(Boolean))].slice(0, 16);
      if (typeof patch.note === 'string') patch.note = patch.note.slice(0, 6000);
      if (typeof patch.ownWords === 'string') patch.ownWords = patch.ownWords.slice(0, 6000);
      return { ...s, study: { ...s.study, [a.id]: { ...c0, ...patch, soundLog, lastAt: a.at } } };
    }
    case 'study-grade':
    case 'study-quiz': {
      const c0 = s.study[a.id] || freshCard(a.at);
      const grade: 0 | 1 | 2 | 3 = a.t === 'study-grade' ? a.grade : a.right ? 2 : 0;
      let c = scheduleCard(c0, grade, a.at);
      if (a.t === 'study-quiz') { const q = c0.quiz || { right: 0, wrong: 0, lastAt: 0 }; c = { ...c, quiz: { right: q.right + (a.right ? 1 : 0), wrong: q.wrong + (a.right ? 0 : 1), lastAt: a.at } }; }
      /* the review pays once a day per card, and only after a few seconds with it */
      const daySecs = c0.day === a.day ? c0.daySecs || 0 : 0;
      const pays = c0.reviewDay !== a.day && daySecs >= STUDY_REVIEW_MIN_SECONDS;
      if (pays) c = { ...c, reviewDay: a.day, unitiaC: c.unitiaC + UNITIA_C_PER_REVIEW };
      return {
        ...s, study: { ...s.study, [a.id]: { ...c, lastAt: a.at } },
        unitiaC: s.unitiaC + (pays ? UNITIA_C_PER_REVIEW : 0),
        unitiaDays: pays ? { ...s.unitiaDays, [a.day]: (s.unitiaDays[a.day] || 0) + UNITIA_C_PER_REVIEW } : s.unitiaDays,
      };
    }
    case 'board-add': {
      const cur = s.boards[a.gaugeId] || [];
      if (cur.some(r => r.by === a.run.by && r.at === a.run.at)) return s;
      return { ...s, boards: { ...s.boards, [a.gaugeId]: [...cur, a.run].slice(-40) } };
    }
    case 'goal-add': return { ...s, goals: [...s.goals, a.goal].slice(-24) };
    case 'goal-remove': return { ...s, goals: s.goals.filter(g => g.id !== a.id) };
    case 'goal-reached': return { ...s, goals: s.goals.map(g => g.id === a.id ? { ...g, reachedAt: a.at } : g) };
    case 'watch-kept': return s.lastWatch === a.day ? s : { ...s, lastWatch: a.day, watchesKept: s.watchesKept + 1 };
    case 'code-name':
      return { ...s, codeName: a.entry.to, codeNameLog: [...s.codeNameLog, a.entry] };
    case 'reset': return { ...FRESH, theme: s.theme, textSize: s.textSize, motion: s.motion, shortcuts: s.shortcuts, voice: s.voice };
    default: return s;
  }
}

/* ---------- unit phase: the evolving name ---------- */

export interface Progress {
  steps: number;
  pages: number;
  chapters: number;
  sims: number;
  strongSteps: number;
  safeSteps: number;
  smallSteps: number;
  totalChapters: number;
}

export function unitPhase(s: S, totalChapters: number): 1 | 2 | 3 | 4 {
  const steps = Object.keys(s.completedSteps).length;
  const pages = Object.keys(s.completedPages).length;
  /* Modux courses are chapters too, but the unit evolves on the core twelve */
  const chapters = Object.keys(s.completedChapters).filter(k => !k.startsWith('mx-')).length;
  if (totalChapters > 0 && chapters >= totalChapters) return 4; // UNITIUM ONE
  if (chapters >= 3 && pages >= 8) return 3; // THE UNIT
  if (steps >= 4 && pages >= 1) return 2; // UNIT ZUN
  return 1; // UNIT ONE
}

export const PHASE_NAMES: Record<1 | 2 | 3 | 4, string> = {
  1: 'UNIT ONE',
  2: 'UNIT ZUN',
  3: 'THE UNIT',
  4: 'UNITIUM ONE',
};

export const PHASE_MEANING: Record<1 | 2 | 3 | 4, string> = {
  1: 'The beginning. One learner, one guide, one direction.',
  2: 'The first companions. A working formation, still forming.',
  3: 'A true security organization. Every seat filled with intent.',
  4: 'The final emergence. Many roles, one coordinated intelligence. The Initium of ONE.',
};

/* ---------- ranks (by RESPECT) ---------- */

export const RANKS = [
  { min: 0, name: 'Novus' },
  { min: 400, name: 'Apprentice' },
  { min: 1200, name: 'Operator' },
  { min: 2600, name: 'Analyst' },
  { min: 4800, name: 'Engineer' },
  { min: 8200, name: 'Architect' },
  { min: 13000, name: 'Commander' },
  { min: 20000, name: 'Director' },
  { min: 30000, name: 'CISO' },
  { min: 44000, name: 'EVO Operator' },
];

export function rankOf(respect: number) {
  let r = RANKS[0];
  for (const k of RANKS) if (respect >= k.min) r = k;
  return r;
}
export function nextRank(respect: number) {
  return RANKS.find(k => k.min > respect) || null;
}

/* Sevas emergence threshold: many milestones, many StrongSteps. */
export function sevasReady(s: S, strongCount: number): boolean {
  return !s.sevaEvolved && strongCount >= 12 && Object.keys(s.completedPages).length >= 6;
}

/* ---------- context ---------- */

const StateCtx = createContext<{ s: S; d: React.Dispatch<Act> } | null>(null);

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [s, d0] = useReducer(reducer, undefined, load);
  /* a page about to be left tells history how far it was scrolled, before the next page takes its place */
  const d = useCallback((a: Act) => { if (a.t === 'route') Back.leaving(); d0(a); }, []);

  useEffect(() => {
    /* keys live in the keyring (lib/keyring.ts), never in the record */
    try { localStorage.setItem(KEY, JSON.stringify(withoutSecrets(s))); } catch { /* storage full or blocked — session continues in memory */ }
  }, [s]);

  useEffect(() => {
    document.documentElement.dataset.theme = s.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', s.theme === 'meridian' ? '#ddd8ea' : s.theme === 'mov' ? '#03050a' : '#050a1e');
  }, [s.theme]);

  useEffect(() => {
    document.documentElement.dataset.text = s.textSize === 'standard' ? '' : s.textSize;
    document.documentElement.dataset.motion = s.motion === 'calm' ? 'calm' : '';
  }, [s.textSize, s.motion]);

  const v = useMemo(() => ({ s, d }), [s, d]);
  return <StateCtx.Provider value={v}>{children}</StateCtx.Provider>;
}

export function useS() {
  const c = useContext(StateCtx);
  if (!c) throw new Error('state outside provider');
  return c;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
