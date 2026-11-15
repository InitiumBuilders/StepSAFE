/* StepSAFE :: The Praxis — content schema.
   Every content module in src/content conforms to these types.
   Steps compose into Pages. Pages compose into Chapters. Chapters build the UNIT. */

/* A source a note names, and, once someone has read it at its own page, the link and the day (YYYY-MM-DD).
   probe-sources.mts counts linked and dated notes and holds the count in docs/TRUTH-RATCHET.json: it may rise
   and never fall. */
export interface SourceLink { label: string; url: string; checked: string }
export interface SourceNote { label: string; note: string; url?: string; checked?: string }

export type Hue = 'cyan' | 'azure' | 'violet' | 'ember' | 'gold';
export type Mode = 'novus' | 'motus' | 'both';

export type StepKind =
  | 'construct' // a core mental model — the smallest transferable unit of thought
  | 'lesson'    // deep teaching with research backing
  | 'drill'     // a timed decision under pressure
  | 'lab'       // hands-on build / break / verify
  | 'field'     // real-world praxis project, evidence required
  | 'council';  // leadership, narrative, board & crisis communication

export interface StepBlock {
  kind:
    | 'prose'
    | 'principle'
    | 'list'
    | 'numbered'
    | 'code'
    | 'table'
    | 'callout'
    | 'quote'
    | 'metric'
    | 'checklist'
    | 'compare'
    | 'timeline';
  title?: string;
  body?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  lang?: string;
  source?: string;
  /** for 'compare': two columns of claims */
  left?: { title: string; items: string[] };
  right?: { title: string; items: string[] };
}

export interface DrillOption {
  id: string;
  label: string;
  detail?: string;
  /** -3 (harmful) .. +3 (world-class) */
  score: number;
  outcome: string;
  ripple: string;
  isBest?: boolean;
}

export interface Drill {
  id: string;
  scene: string;
  clock?: string;
  pressure?: string;
  prompt: string;
  options: DrillOption[];
  debrief: string;
  principle: string;
}

export interface Step {
  id: string;
  kind: StepKind;
  title: string;
  /** The Statement Law: one line of stance. Never decoration. */
  statement: string;
  minutes: number;
  respect: number;
  trust: number;
  mode: Mode;
  blocks: StepBlock[];
  drill?: Drill;
  /** what the learner actually does in the world */
  praxis?: string;
  /** what proof they attach to their Praxis Profile */
  evidence?: string;
  awards?: string[];
  glossary?: string[];
}

export interface Page {
  id: string;
  title: string;
  /** the SamePage-style certification line printed on the Praxis Profile */
  credential: string;
  summary: string;
  competencies: string[];
  seal: string;
  steps: Step[];
}

export interface Chapter {
  id: string;
  act: string;
  order: number;
  title: string;
  subtitle: string;
  essence: Hue;
  thesis: string;
  statement: string;
  why: string;
  outcomes: string[];
  prereq: string[];
  unitUnlock?: string;
  sources: SourceNote[];
  pages: Page[];
}

/* ---------- Steps: awards, badges, milestones ---------- */

export type AwardTier = 'small' | 'strong' | 'safe';

export interface Award {
  id: string;
  tier: AwardTier;
  name: string;
  /** a short typographic mark, 1–2 glyphs. No emoji. */
  glyph: string;
  statement: string;
  criteria: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'signature';
  respect: number;
  trust: number;
  domain: string;
  /** the data/research reason this milestone is high leverage */
  research: string;
  /** the sources the research was read against, each with the day it was read (probe-sources counts them) */
  researchLinks?: SourceLink[];
}

/* ---------- StepGuides ---------- */

export interface Term {
  id: string;
  term: string;
  domain: string;
  short: string;
  long: string;
  why: string;
  related: string[];
  mode: Mode;
  /** other names for the same thing: an abbreviation, a spelling, the words a Step uses (content/glossary-aliases.ts) */
  aliases?: string[];
  /** where an outside fact in the entry was read, and the day it was read */
  sources?: SourceLink[];
}

export interface Guide {
  id: string;
  title: string;
  domain: string;
  kind: 'playbook' | 'template' | 'checklist' | 'model' | 'field-note' | 'reading' | 'drillbook';
  statement: string;
  summary: string;
  minutes: number;
  mode: Mode;
  blocks: StepBlock[];
  sources: SourceNote[];
}

/* ---------- The UNIT ---------- */

export interface UnitMember {
  id: string;
  callsign: string;
  role: string;
  title: string;
  /** 1 = UNIT ONE, 2 = UNIT ZUN, 3 = THE UNIT, 4 = UNITIUM ONE */
  phase: 1 | 2 | 3 | 4;
  essence: Hue;
  bio: string;
  doctrine: string;
  strengths: string[];
  /** how this member multiplies another member */
  leverages: { member: string; how: string }[];
  unlockedBy: string;
  firstWords: string;
  evolvesTo?: string;
}

/* ---------- The Practice ---------- */

export interface Inject {
  id: string;
  t: string;
  channel: 'pager' | 'exec' | 'legal' | 'press' | 'field' | 'board' | 'chain' | 'model' | 'regulator' | 'community';
  from: string;
  text: string;
  decision?: Drill;
}

export interface SimModule {
  id: string;
  title: string;
  org: string;
  sector: string;
  chapterId: string;
  essence: Hue;
  /** 1..5 */
  difficulty: number;
  minutes: number;
  brief: string;
  objective: string;
  roles: string[];
  mode: Mode;
  injects: Inject[];
  scoring: { dimension: string; weight: number; note: string }[];
  debrief: { title: string; body: string }[];
  awards: string[];
  respect: number;
  trust: number;
  /** minutes to take each decision by itself, in order (lib/oneDecision.ts). content/full.ts works them out and
      the outline carries them, so a room's decisions can be counted before its text has loaded. */
  calls?: number[];
  /** how many injects the room has; the outline carries it, so a place in the room can be named before its text loads */
  injectCount?: number;
}

/* ---------- UNIT counsel: your specialists speak inside a simulation ----------
   They advise from their own doctrine, and they do not always agree. Weighing
   advice — including advice that is confidently wrong — is the skill. */

export interface CounselVoice {
  member: string;
  line: string;
  /** short phrase naming which way they lean; rendered as their position */
  leaning: string;
}

export interface Counsel {
  simId: string;
  decisionId: string;
  voices: CounselVoice[];
}

/* ---------- Praxis projects ---------- */

export interface ProjectTemplate {
  id: string;
  title: string;
  domain: string;
  statement: string;
  difficulty: number;
  weeks: number;
  brief: string;
  deliverables: string[];
  evidence: string[];
  rubric: { dimension: string; strong: string; weak: string }[];
  awards: string[];
  mode: Mode;
}

/* ---------- Seva ---------- */

export type Guise = 'male' | 'female' | 'zun' | 'one';

export interface SevaLine {
  id: string;
  trigger: string;
  tone: 'welcome' | 'award' | 'nudge' | 'correction' | 'depth' | 'emergence' | 'farewell';
  text: string;
}
