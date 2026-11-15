/* OUTLIER SYSTEMS: the shape of one real system, read with a systems mind and
   a steward's eye. Each entry was researched from public sources, then
   checked and written by Davara. Every figure in an entry carries its source
   in the notes under research/outlier/notes. The map uses the same parts,
   links and pressures as Map your own system, so any entry can be loaded
   there and run as a stress day. */

import type { NodeKind } from '../modux-schema';

export interface KnownLink { from: string; to: string; how: 'needs' | 'supplied' | 'serves' }

export interface KnownSystem {
  id: string;
  name: string;
  url: string;
  sector: string;
  serves: string;
  tags: string[];
  /** the question the world asks that this system helps answer */
  keystoneQuestion: string;
  coreProblem: string;
  /** verbatim, from the page it was read on; null when none is current */
  tagline: { text: string; source: string } | null;
  knownFor: string;
  /** the one thing it does at an outlier level */
  outlierMove: string;
  structure: string;
  stocks: string[];
  flows: string[];
  loops: { kind: 'reinforcing' | 'balancing'; name: string; how: string }[];
  evolution: { when: string; move: string }[];
  doesWell: string[];
  /** deepest first */
  leveragePoints: { point: string; why: string }[];
  securityLeverage: { move: string; why: string; models: string[] }[];
  securityPosture: string;
  risks: string[];
  incidents: { when: string; what: string; source: string }[];
  map: { parts: { id: string; name: string; kind: NodeKind }[]; links: KnownLink[]; threats: string[] };
  brief: string;
  lesson: string;
  synthesis: string;
  forModux: string[];
  sources: { label: string; url: string }[];
  uncertain: string[];
  /** one of August's own systems */
  own?: boolean;
  /** the group it is read in, in the chapter and the library */
  group: string;
}

export interface OutlierSynthesis {
  chapter: { subtitle: string; thesis: string; statement: string; why: string; outcomes: string[] };
  opening: string;
  patterns: { name: string; read: string; examples: string[] }[];
  /** the strongest sound security moves across every system, ranked */
  strongest?: { move: string; why: string; systems: string[]; models: string[] }[];
  closing: string;
  moduxAdditions: {
    kind: 'pressure' | 'structure' | 'feature' | 'part'; title: string; detail: string; from: string[];
    pressure?: { name: string; move: string; target: string; counters: string[]; fits: string[]; weight: number };
  }[];
  comingSoon: {
    title: string;
    subtitle: string;
    preview: string;
    intro: string;
    researchPrompt: string;
    keystoneQuestions: string[];
    pages: { title: string; summary: string }[];
  };
}
