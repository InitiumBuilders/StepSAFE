/* The whole curriculum, built from every authored module: the twelve chapters, the hidden chapter, the awards,
   guides, glossary, rooms and project templates, each list exactly as the Praxis has always assembled it.
   This is the heavy part (several megabytes of text). The app does not load it at start: content/registry.ts
   carries the outline of it, and content/index.ts imports this and fills the registry in. */

import type { Chapter, Award, Term, Guide, SimModule, ProjectTemplate } from './schema';
import type { ModuxModel } from './modux-schema';

import { chapter as chFoundations } from './chapters/foundations';
import { chapter as chIdentity } from './chapters/identity-crypto';
import { chapter as chDetection } from './chapters/detection';
import { chapter as chAppsec } from './chapters/appsec-supplychain';
import { chapter as chIncident } from './chapters/incident-crisis';
import { chapter as chGrc } from './chapters/grc-risk';
import { chapter as chChain } from './chapters/blockchain-dao';
import { chapter as chDecinfra } from './chapters/decentralized-infra';
import { chapter as chAi } from './chapters/ai-security';
import { chapter as chCiso } from './chapters/ciso-leadership';
import { chapter as chIntuition } from './chapters/intuition-trust';
import { chapter as chDashEvo } from './chapters/dash-evo';

import { AWARDS as AWARDS_RAW } from './awards';
import { STEP_AWARDS } from './awards-steps';
import { PROJECTS as PROJECTS_RAW } from './projects';

import { GUIDES as GUIDES_CORE } from './guides-core';
import { GUIDES as GUIDES_COMMAND } from './guides-command';
import { GUIDES as GUIDES_FRONTIER } from './guides-frontier';
import { GUIDES_SYSTEMS } from './guides-systems';
import { GUIDES_LAUNCH } from './guides-launch';
import { GUIDE_MODEL } from './guides-model';

import { TERMS as TERMS_A } from './glossary-a';
import { TERMS as TERMS_B } from './glossary-b';
import { TERMS as TERMS_C } from './glossary-c';
import { TERMS as TERMS_D } from './glossary-d';
import { TERMS_SYSTEMS } from './glossary-systems';
import { TERMS_NAMED } from './glossary-named';
import { TERM_ALIASES } from './glossary-aliases';
import { AWARDS as AWARDS_SYSTEMS } from './awards/systems';
import { AWARDS as AWARDS_STUDY } from './awards/study';
import { AWARDS as AWARDS_OUTLIER } from './awards/outlier';
import { AWARDS as AWARDS_CHECK } from './awards/check';

import { MODULES as SIM_AI } from './practice/frontier-ai';
import { MODULES as SIM_EXCHANGE } from './practice/exchange-treasury';
import { MODULES as SIM_ENTERPRISE } from './practice/enterprise-crisis';
import { MODULES as SIM_GRAPH } from './practice/graph-decinfra';
import { MODULES as SIM_EVO } from './practice/evo-capstone';
import { OUTLIER_CHAPTER } from './outlier/chapter';
import { callMinutes } from '../lib/oneDecision';
import { MODUX_MODELS, MODUX_CHAPTERS, MODUX_PROJECTS } from './modux';

export interface FullContent {
  /** the twelve chapters, in order */
  chapters: Chapter[];
  /** the hidden chapter 2.6.7, when the known systems exist */
  outlier: Chapter | null;
  awards: Award[];
  guides: Guide[];
  terms: Term[];
  sims: SimModule[];
  /** the authored project templates */
  projects: ProjectTemplate[];
  /** the Modux catalog in full: every model with its text, the courses compiled into chapters, each stack as a
      project template. The registry starts from the catalog's outline and is filled from these. */
  moduxModels: ModuxModel[];
  moduxChapters: Chapter[];
  moduxProjects: ProjectTemplate[];
}

export const FULL: FullContent = {
  chapters: [
    chFoundations, chIdentity, chDetection, chAppsec, chIncident, chGrc,
    chChain, chDecinfra, chAi, chCiso, chIntuition, chDashEvo,
  ].sort((a, b) => a.order - b.order),
  outlier: OUTLIER_CHAPTER,
  /* Behavioural awards (granted by engine triggers via HOOKS) + Step-granted awards.
     Deduplicated by id, first definition winning, so a hand-researched award always
     beats a reconciled one of the same name. */
  awards: (() => {
    const seen = new Set<string>();
    const out: Award[] = [];
    for (const a of [...AWARDS_RAW, ...STEP_AWARDS, ...AWARDS_SYSTEMS, ...AWARDS_STUDY, ...AWARDS_OUTLIER, ...AWARDS_CHECK]) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      out.push(a);
    }
    return out;
  })(),
  guides: [...GUIDES_CORE, ...GUIDES_COMMAND, ...GUIDES_FRONTIER, ...GUIDES_SYSTEMS, ...GUIDES_LAUNCH, GUIDE_MODEL],
  /* every entry, with the other names recorded for it (glossary-aliases.ts) */
  terms: [...TERMS_A, ...TERMS_B, ...TERMS_C, ...TERMS_D, ...TERMS_SYSTEMS, ...TERMS_NAMED]
    .map(t => (TERM_ALIASES[t.id] ? { ...t, aliases: [...(t.aliases || []), ...TERM_ALIASES[t.id]] } : t))
    .sort((a, b) => a.term.localeCompare(b.term)),
  /* each room also carries the minutes each of its decisions takes by itself, and its count of injects; the outline keeps both */
  sims: [...SIM_AI, ...SIM_EXCHANGE, ...SIM_ENTERPRISE, ...SIM_GRAPH, ...SIM_EVO].map(m => Object.assign(m, { calls: callMinutes(m), injectCount: m.injects.length })),
  projects: PROJECTS_RAW,
  moduxModels: MODUX_MODELS,
  moduxChapters: MODUX_CHAPTERS,
  moduxProjects: MODUX_PROJECTS,
};
