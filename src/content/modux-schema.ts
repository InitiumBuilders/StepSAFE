/* Modux Models: the schema.

   A Modux Model is one security structure: a pattern with named parts, the
   threats it defeats, the ways it fails, real evidence, and the other models
   it compounds with. The catalog is the database. Stacks are curated
   combinations. Courses are ordered paths through the catalog and compile
   into ordinary Chapters so the Step engine, drills and awards work unchanged. */

import type { Hue, Mode, Drill } from './schema';

export type ModuxFamily =
  | 'identity'    // who and what gets in
  | 'trust'       // boundaries and where trust is decided
  | 'crypto'      // keys, custody, secrets, transparency
  | 'supply'      // build integrity and the software supply chain
  | 'detect'      // telemetry, detection, response structure
  | 'resilience'  // failure, recovery, learning from stress
  | 'data'        // data governance and privacy structure
  | 'chain'       // blockchain, treasury, protocol and DAO security
  | 'ai'          // AI systems, agents and models
  | 'si'          // frontier and superintelligence control structures
  | 'org'         // organisation, governance and coordination
  | 'systems';    // systems thinking applied to security

export type ModuxTier =
  | 'bedrock'   // decades of use, survived real adversaries
  | 'proven'    // widely deployed, strong public evidence
  | 'emerging'  // real deployments, still being shaped
  | 'frontier'; // new, few deployments, worth learning now

export const FAMILY_LABEL: Record<ModuxFamily, string> = {
  identity: 'Identity and access',
  trust: 'Trust boundaries',
  crypto: 'Keys and custody',
  supply: 'Supply chain',
  detect: 'Detection and response',
  resilience: 'Resilience',
  data: 'Data and privacy',
  chain: 'Chain and treasury',
  ai: 'AI systems',
  si: 'Frontier control',
  org: 'Organisation',
  systems: 'Systems thinking',
};

export const FAMILY_HUE: Record<ModuxFamily, Hue> = {
  identity: 'azure',
  trust: 'cyan',
  crypto: 'gold',
  supply: 'azure',
  detect: 'cyan',
  resilience: 'ember',
  data: 'violet',
  chain: 'gold',
  ai: 'violet',
  si: 'ember',
  org: 'azure',
  systems: 'cyan',
};

export const TIER_LABEL: Record<ModuxTier, string> = {
  bedrock: 'Bedrock',
  proven: 'Proven',
  emerging: 'Emerging',
  frontier: 'Frontier',
};

/** The catalog contract. Authored first; every other file links only to these ids. */
export interface ModuxEntry {
  id: string;       // mm-<family>-<slug>
  name: string;
  family: ModuxFamily;
  tier: ModuxTier;
}

export interface ModuxEvidence {
  label: string;
  note: string;
  /** the source read at its own page, and the day it was read (see SourceNote in schema.ts) */
  url?: string;
  checked?: string;
}

export interface ModuxLink {
  /** another catalog id */
  model: string;
  how: string;
}

export interface ModuxModel extends ModuxEntry {
  /** one line: what this structure defeats */
  statement: string;
  /** where it came from and who proved it */
  origin: string;
  /** the shape: parts and the flows between them */
  structure: string;
  components: string[];
  defeats: string[];
  failsWhen: string[];
  evidence: ModuxEvidence[];
  /** the leverage graph: models that compound with this one */
  combines: ModuxLink[];
  /** models that pull against this one */
  conflicts?: ModuxLink[];
  /** stocks, flows, delays and loops this structure acts on */
  systemsLens: string;
  /** how it gets stronger under stress, or why it does not */
  underStress: string;
  /** the first move and the order to adopt it */
  adoption: string;
  /** signs the structure is in place and working */
  signals: string[];
  drill?: Drill;
  minutes: number;
  mode: Mode;
  tags: string[];
}

/** A curated combination that compounds. */
export interface ModuxStack {
  id: string;
  name: string;
  statement: string;
  /** ordered catalog ids */
  models: string[];
  why: string;
  /** the kind of organisation this fits */
  fits: string;
  /** where this stack has been seen working */
  evidence: string;
  essence: Hue;
}

/** An ordered path through the catalog. Compiles into a Chapter. */
export interface ModuxCourse {
  id: string;
  order: number;
  title: string;
  statement: string;
  thesis: string;
  essence: Hue;
  outcomes: string[];
  pages: {
    id: string;
    title: string;
    credential: string;
    summary: string;
    /** catalog ids, in teaching order */
    models: string[];
  }[];
}

/* ---------- Gauges: put a stack in front of an adversary ---------- */

/** What each tier costs to adopt. Older structures are cheaper to run. */
export const TIER_COST: Record<ModuxTier, number> = {
  bedrock: 1,
  proven: 2,
  emerging: 3,
  frontier: 4,
};

/** The kinds of thing an organisation's system is made of. */
export type NodeKind =
  | 'people' | 'identity' | 'network' | 'data' | 'build' | 'money'
  | 'control' | 'model' | 'public' | 'time' | 'vendor';

export const NODE_KIND_LABEL: Record<NodeKind, string> = {
  people: 'People', identity: 'Identity', network: 'Network', data: 'Data', build: 'Build',
  money: 'Money', control: 'Control', model: 'AI model', public: 'Public trust', time: 'Time', vendor: 'Vendor',
};

export interface GaugeNode { id: string; name: string; kind: NodeKind }
/** A dependency. When `from` falls, `to` is exposed. */
export interface GaugeEdge { from: string; to: string; how: string }
export interface GaugeSystem { nodes: GaugeNode[]; edges: GaugeEdge[] }

export interface GaugeThreat {
  id: string;
  name: string;
  /** what the adversary does, one sentence */
  move: string;
  /** catalog ids that stop this move */
  counters: string[];
  /** 1 to 3 */
  weight: number;
  /** the system node this move hits */
  target: string;
  /** set when a notch added it */
  pressure?: string;
  /** no catalog structure fully answers this; only a MoTRUS model can */
  open?: boolean;
}

export interface ModuxGauge {
  id: string;
  title: string;
  org: string;
  sector: string;
  brief: string;
  adversary: string;
  budget: number;
  threats: GaugeThreat[];
  /** a stack that holds, within budget */
  expert: string[];
  debrief: string;
  essence: Hue;
  system: GaugeSystem;
  /** sector tags the pressure library matches on */
  tags: string[];
  /** written by hand, forged by the generator, or written by a model under the learner's key */
  origin?: 'authored' | 'forged' | 'opus';
  seed?: string;
}

/** One notch of pressure added to a gauge. */
export interface Pressure {
  id: string;
  name: string;
  move: string;
  counters: string[];
  weight: number;
  target: NodeKind;
  /** the earliest notch this can appear at */
  from: number;
  /** sector tags this fits; empty means any sector */
  fits: string[];
  /** budget granted with it; the cheapest counter usually costs more, which is the point */
  budget: number;
  /** a structure that stops holding once this pressure is on */
  weakens?: { model: string; why: string };
  /** an open problem: no catalog counter */
  open?: boolean;
}

export type Band = 'ground' | 'hardened' | 'systemic' | 'wicked' | 'outlier';

export const BAND_LABEL: Record<Band, string> = {
  ground: 'Ground', hardened: 'Hardened', systemic: 'Systemic', wicked: 'Wicked', outlier: 'Outlier',
};

export function bandOf(level: number): Band {
  if (level <= 0) return 'ground';
  if (level <= 2) return 'hardened';
  if (level <= 4) return 'systemic';
  if (level <= 6) return 'wicked';
  return 'outlier';
}

/** Coupling goes live at the first Systemic notch. */
export const COUPLING_FROM = 3;
/** The adversary studies the stack from the first Wicked notch. */
export const ADAPTIVE_FROM = 5;
/** Open problems appear from the first Outlier notch. */
export const OPEN_FROM = 7;
/** A MoTRUS model can be minted after the second notch. */
export const MOTRUS_FROM = 2;
