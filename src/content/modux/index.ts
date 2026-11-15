/* The Modux registry: catalog, models, stacks, courses, compiled chapters. */

import type { Chapter } from '../schema';
import type { ModuxModel, ModuxFamily, ModuxTier } from '../modux-schema';
import { CATALOG, CATALOG_IDS } from './catalog';
import { STACKS } from './stacks';
import { COURSES } from './courses';
import { compileCourse } from './compile';
import { stackProjects } from './projects';

import { MODELS as M_IDENTITY } from './models/identity';
import { MODELS as M_TRUST } from './models/trust';
import { MODELS as M_CRYPTO } from './models/crypto';
import { MODELS as M_SUPPLY } from './models/supply';
import { MODELS as M_DETECT } from './models/detect';
import { MODELS as M_RESILIENCE } from './models/resilience';
import { MODELS as M_DATA } from './models/data';
import { MODELS as M_ORG } from './models/org';
import { MODELS as M_CHAIN } from './models/chain';
import { MODELS as M_AI } from './models/ai';
import { MODELS as M_SI } from './models/si';
import { MODELS as M_SYSTEMS } from './models/systems';

const AUTHORED: ModuxModel[] = [
  ...M_IDENTITY, ...M_TRUST, ...M_CRYPTO, ...M_SUPPLY,
  ...M_DETECT, ...M_RESILIENCE, ...M_DATA, ...M_ORG,
  ...M_CHAIN, ...M_AI, ...M_SI, ...M_SYSTEMS,
];

/* Only catalog ids are admitted, and the catalog order is kept. */
const byId = new Map(AUTHORED.filter(m => CATALOG_IDS.has(m.id)).map(m => [m.id, m]));

export const MODUX_MODELS: ModuxModel[] = CATALOG
  .map(e => byId.get(e.id))
  .filter(Boolean) as ModuxModel[];

export const MODUX_CATALOG = CATALOG;
export const MODUX_STACKS = STACKS;
export const MODUX_COURSES = COURSES;

export const MODUX_CHAPTERS: Chapter[] = COURSES
  .map(c => compileCourse(c, MODUX_MODELS))
  .sort((a, b) => a.order - b.order);

/* each stack, offered as a Praxis Project template */
export const MODUX_PROJECTS = stackProjects(STACKS, byId);

export function moduxById(id: string): ModuxModel | undefined {
  return byId.get(id);
}

export function moduxStackById(id: string) {
  return STACKS.find(s => s.id === id);
}

/** Every link touching a model, in both directions, deduplicated. */
export function moduxLinks(id: string): { model: ModuxModel; how: string; direction: 'out' | 'in' }[] {
  const out: { model: ModuxModel; how: string; direction: 'out' | 'in' }[] = [];
  const seen = new Set<string>();
  const self = byId.get(id);
  if (self) {
    for (const c of self.combines) {
      const m = byId.get(c.model);
      if (m && !seen.has(m.id)) { seen.add(m.id); out.push({ model: m, how: c.how, direction: 'out' }); }
    }
  }
  for (const m of MODUX_MODELS) {
    if (m.id === id) continue;
    const c = m.combines.find(x => x.model === id);
    if (c && !seen.has(m.id)) { seen.add(m.id); out.push({ model: m, how: c.how, direction: 'in' }); }
  }
  return out;
}

export function moduxByFamily(f: ModuxFamily) {
  return MODUX_MODELS.filter(m => m.family === f);
}

export function moduxByTier(t: ModuxTier) {
  return MODUX_MODELS.filter(m => m.tier === t);
}

/** Which stacks and which courses a model appears in. */
export function moduxMembership(id: string) {
  return {
    stacks: STACKS.filter(s => s.models.includes(id)),
    courses: COURSES.filter(c => c.pages.some(p => p.models.includes(id))),
  };
}
