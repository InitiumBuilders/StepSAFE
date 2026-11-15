/* THE CONTENT REGISTRY: the one import surface the app uses for the curriculum.

   At start it holds the outline (content/outline.gen.ts): every chapter, page, Step, award, guide and room with
   its ids, titles and numbers, and without the long text. That is enough for Ground, the navigation and the
   engine. The rest of the curriculum (content/full.ts, several megabytes) loads when loadContent() is first
   called: the app calls it in the background after Ground is on screen, and every other page waits for it.

   The Modux catalog starts the same way: each model's name, family, tier and links, which the gauges' arithmetic on
   Ground reads, and each course's chapter by its titles. The model texts (content/modux/models, most of the catalog)
   arrive with the rest of the curriculum.

   When it arrives, hydrate() fills the outline in place. Each outline object gains its missing fields and keeps
   its identity, so anything that already holds a chapter, a Step or an award holds the full one from then on.
   The glossary and the authored project templates start empty and are filled the same way.

   content/index.ts imports the full content and calls hydrate() as it loads, so a script or probe that imports
   content/index gets the whole curriculum synchronously, as it always has. */

import type { Chapter, Award, Term, Guide, UnitMember, SimModule, ProjectTemplate } from './schema';
import type { ModuxModel, ModuxFamily, ModuxTier } from './modux-schema';
import type { FullContent } from './full';
import { OUTLINE } from './outline.gen';
import { HOOKS } from './hooks';
import { UNIT as UNIT_RAW } from './unit';
import { CATALOG } from './modux/catalog';
import { STACKS } from './modux/stacks';
import { COURSES } from './modux/courses';

export const CHAPTERS: Chapter[] = OUTLINE.chapters;

/* the Modux catalog: each model without its text until the rest arrives, and each course compiled into a chapter */
export const MODUX_MODELS: ModuxModel[] = OUTLINE.moduxModels;
export const MODUX_CHAPTERS: Chapter[] = OUTLINE.moduxChapters;

/* Modux courses compile into Chapters too, and so does the hidden chapter 2.6.7.
   Lookups search every list; the Chapters view and the UNIT progression use
   CHAPTERS alone. */
export const ALL_CHAPTERS: Chapter[] = [...CHAPTERS, ...MODUX_CHAPTERS, ...(OUTLINE.outlier ? [OUTLINE.outlier] : [])];

export const AWARDS: Award[] = OUTLINE.awards;
export { HOOKS };
export const UNIT: UnitMember[] = UNIT_RAW;
/** the authored templates and the Modux stacks' own arrive with the rest of the curriculum, in that order */
export const PROJECTS: ProjectTemplate[] = [];
export const GUIDES: Guide[] = OUTLINE.guides;
/** the glossary, alphabetical; empty until the rest of the curriculum arrives */
export const TERMS: Term[] = [];
export const SIMS: SimModule[] = OUTLINE.sims;

export { SEVA_PROMPT, SEVAS_PROMPT, CLAROS_PROMPT, GUISE_VOICE, SEVA_LINES, SEVAS_EMERGENCE } from './seva';

export const MODUX_CATALOG = CATALOG;
export const MODUX_STACKS = STACKS;
export const MODUX_COURSES = COURSES;
const MODUX_BY_ID = new Map(MODUX_MODELS.map(m => [m.id, m]));

export function moduxById(id: string): ModuxModel | undefined {
  return MODUX_BY_ID.get(id);
}

export function moduxStackById(id: string) {
  return STACKS.find(s => s.id === id);
}

/** Every link touching a model, in both directions, deduplicated. */
export function moduxLinks(id: string): { model: ModuxModel; how: string; direction: 'out' | 'in' }[] {
  const out: { model: ModuxModel; how: string; direction: 'out' | 'in' }[] = [];
  const seen = new Set<string>();
  const self = MODUX_BY_ID.get(id);
  if (self) {
    for (const c of self.combines) {
      const m = MODUX_BY_ID.get(c.model);
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

/* ---------- the rest of the curriculum ---------- */

let ready = false;
const listeners = new Set<() => void>();
let loading: Promise<void> | null = null;

/** true once the full curriculum has filled the outline */
export function contentReady(): boolean { return ready; }

/** called once, when the full curriculum has arrived; at once if it already has */
export function onContentReady(l: () => void): () => void {
  if (ready) { l(); return () => {}; }
  listeners.add(l);
  return () => { listeners.delete(l); };
}

/** fetch the rest of the curriculum; the same promise every time */
export function loadContent(): Promise<void> {
  if (ready) return Promise.resolve();
  return (loading ??= import('./index').then(() => undefined));
}

function byId<T extends { id: string }>(xs: T[]): Map<string, T> { return new Map(xs.map(x => [x.id, x])); }

function fillChapter(o: Chapter, f: Chapter) {
  const pages = o.pages;
  Object.assign(o, f, { pages });
  const ops = byId(pages);
  for (const fp of f.pages) {
    const op = ops.get(fp.id);
    if (!op) { pages.push(fp); continue; }
    const steps = op.steps;
    Object.assign(op, fp, { steps });
    const oss = byId(steps);
    for (const fs of fp.steps) {
      const os = oss.get(fs.id);
      if (os) Object.assign(os, fs); else steps.push(fs);
    }
  }
}

function fillList<T extends { id: string }>(outline: T[], full: T[]) {
  const o = byId(outline);
  for (const f of full) {
    const x = o.get(f.id);
    if (x) Object.assign(x, f); else outline.push(f);
  }
}

/** fill the outline with the full curriculum, in place; content/index.ts calls this as it loads */
export function hydrate(full: FullContent) {
  if (ready) return;
  const oc = byId(CHAPTERS);
  for (const f of full.chapters) { const o = oc.get(f.id); if (o) fillChapter(o, f); else { CHAPTERS.push(f); ALL_CHAPTERS.push(f); } }
  if (full.outlier) {
    const o = ALL_CHAPTERS.find(c => c.id === full.outlier!.id);
    if (o) fillChapter(o, full.outlier); else ALL_CHAPTERS.push(full.outlier);
  }
  fillList(AWARDS, full.awards);
  fillList(GUIDES, full.guides);
  fillList(SIMS, full.sims);
  fillList(MODUX_MODELS, full.moduxModels);
  for (const m of MODUX_MODELS) MODUX_BY_ID.set(m.id, m);
  const om = byId(MODUX_CHAPTERS);
  for (const f of full.moduxChapters) { const o = om.get(f.id); if (o) fillChapter(o, f); else { MODUX_CHAPTERS.push(f); ALL_CHAPTERS.push(f); } }
  TERMS.push(...full.terms);
  PROJECTS.push(...full.projects, ...full.moduxProjects);
  indexTerms();
  ready = true;
  for (const l of [...listeners]) l();
  listeners.clear();
}

/* ---------- lookups ---------- */

export function chapterById(id: string) {
  return ALL_CHAPTERS.find(c => c.id === id);
}
export function pageById(id: string) {
  for (const c of ALL_CHAPTERS) {
    const p = c.pages.find(p => p.id === id);
    if (p) return { chapter: c, page: p };
  }
  return undefined;
}
export function stepById(id: string) {
  for (const c of ALL_CHAPTERS)
    for (const p of c.pages) {
      const st = p.steps.find(s => s.id === id);
      if (st) return { chapter: c, page: p, step: st };
    }
  return undefined;
}
/** the Step after this one in its chapter, in the order the chapter lists them; undefined after the last */
export function stepAfter(id: string) {
  const loc = stepById(id);
  if (!loc) return undefined;
  const order = loc.chapter.pages.flatMap(p => p.steps.map(step => ({ chapter: loc.chapter, page: p, step })));
  const at = order.findIndex(x => x.step.id === id);
  return at >= 0 ? order[at + 1] : undefined;
}
export function awardById(id: string) {
  return AWARDS.find(a => a.id === id);
}
export function simById(id: string) {
  return SIMS.find(m => m.id === id);
}
export function memberById(id: string) {
  return UNIT.find(u => u.id === id);
}
export function guideById(id: string) {
  return GUIDES.find(g => g.id === id);
}

/* ---------- term resolution ----------
   The curriculum names far more concepts than the glossary defines, because each Step names the vocabulary it
   introduces. A link resolves to an entry only when the entry is that concept: by its id, by a spelling of its name
   (British or American, plural, punctuation), or by another name recorded on the entry (content/glossary-aliases.ts).
   It does not open the nearest-sounding entry as if it were the answer. Until 2026-11-09 a "confident" fuzzy match
   did that, for 263 of the Steps' links, and "tier zero" opened Zero Trust. A link with no entry now returns its
   own readable phrase and the entries whose names share most of its words, offered as neighbours. lib/terms.ts
   adds what the corpus itself says about the phrase. */

export function normaliseTerm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(\w+?)(?:isation|ization)\b/g, '$1ise')
    .replace(/\b(\w+?)(?:ise|ize)\b/g, '$1ise')
    .replace(/\b(\w+?)(?:our)\b/g, '$1or')
    .replace(/\b(\w+?)(?:ses|es|s)\b/g, '$1')
    .trim();
}

/** built when the glossary arrives: every id, name and other name, each under its normalised spelling too */
const TERM_INDEX = new Map<string, Term>();
function indexTerms() {
  TERM_INDEX.clear();
  for (const t of TERMS) TERM_INDEX.set(t.id, t);
  for (const t of TERMS) for (const name of [t.id, t.term]) { const n = normaliseTerm(name); if (!TERM_INDEX.has(n)) TERM_INDEX.set(n, t); }
  /* an entry's own id and name come before any other entry's other names */
  for (const t of TERMS) for (const a of t.aliases || []) { const n = normaliseTerm(a); if (!TERM_INDEX.has(n)) TERM_INDEX.set(n, t); }
}

export interface TermResolution {
  /** the readable phrase the link was asking about, always present */
  query: string;
  /** the entry for that concept, when the glossary has one */
  term?: Term;
  /** for an entry, its related entries; for a phrase with no entry, the entries whose names share most of its words */
  suggestions: Term[];
}

/** the entry an id, a spelling of its name or one of its other names points at, with no guessing */
export function exactTerm(idOrQuery: string): Term | undefined {
  return TERM_INDEX.get(idOrQuery) || TERM_INDEX.get(normaliseTerm(idOrQuery));
}

/** The entries nearest a phrase that has none of its own: an entry qualifies when its name holds more than half of
    the phrase's words, or when its whole name is the phrase's last word (a "safe multisig" is a kind of Multisig).
    One shared word is not enough: "tier zero" is no neighbour of Zero Trust. */
export function closestTerms(phrase: string, cap = 6): Term[] {
  const words = normaliseTerm(phrase).split(' ').filter(w => w.length > 2);
  if (!words.length) return [];
  const head = words[words.length - 1];
  const out: { t: Term; shared: number; size: number }[] = [];
  for (const t of TERMS) {
    let best = 0, size = 99;
    for (const name of [t.term, ...(t.aliases || [])]) {
      const nw = normaliseTerm(name).split(' ').filter(Boolean);
      const shared = words.filter(w => nw.includes(w)).length;
      const kind = nw.length === 1 && nw[0] === head ? 1 : 0;
      if (shared * 2 > words.length || kind) { if (shared > best || (shared === best && nw.length < size)) { best = Math.max(shared, kind); size = nw.length; } }
    }
    if (best) out.push({ t, shared: best, size });
  }
  return out.sort((a, b) => b.shared - a.shared || a.size - b.size || a.t.term.localeCompare(b.t.term)).slice(0, cap).map(x => x.t);
}

export function resolveTerm(idOrQuery: string): TermResolution {
  const query = idOrQuery.replace(/-/g, ' ').trim();
  const term = exactTerm(idOrQuery);
  return term ? { query, term, suggestions: relatedTo(term) } : { query, suggestions: closestTerms(idOrQuery) };
}

function relatedTo(t: Term): Term[] {
  return t.related.map(r => TERM_INDEX.get(r) || TERM_INDEX.get(normaliseTerm(r))).filter(Boolean) as Term[];
}

export const ESSENCE_HEX: Record<string, string> = {
  cyan: '#22d3ee',
  azure: '#60a5fa',
  violet: '#a78bff',
  ember: '#e879c9',
  gold: '#e8c46b',
};

/* the night draws the cyan essence in the welcome page's ice-azure; Meridian and Mov keep the original.
   App calls this before its views render, so every rim, border and canvas reads the theme's value. */
export function essenceForTheme(theme: string) {
  ESSENCE_HEX.cyan = theme === 'nocturne' ? '#9cc3ef' : '#22d3ee';
}
