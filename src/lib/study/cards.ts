/* THE DECK: every piece of content in the Praxis as one study card, linked
   into one graph. Built from the content arrays themselves, so a term, a
   model, a guide, a Step, a threat, a stack or a room added anywhere joins
   the deck on the next load with nothing else to change.

   Edges come from the content's own links (a term's related terms, a
   model's compounding and conflicting models, a threat's counters, a
   stack's members, an incident's structures) and from mentions: when the
   text of a card names a glossary term, the two are joined. */

import { TERMS, GUIDES, CHAPTERS, SIMS, MODUX_MODELS, exactTerm } from '../../content/registry';
import { mentionsIn } from '../terms';
import { RETIRED } from '../../content/glossary-aliases';
import { STACKS } from '../../content/modux/stacks';
import { PRESSURES } from '../../content/modux/pressures';
import { INCIDENTS } from '../../content/modux/calibration';
import { FAMILY_LABEL, NODE_KIND_LABEL } from '../../content/modux-schema';
import type { ViewKey } from '../state';
import { TERM_SUBJECT, TERM_OVERRIDE, GUIDE_SUBJECT, MODEL_SUBJECT, CHAPTER_SUBJECT, PAGE_SUBJECT, THREAT_SUBJECT, INCIDENT_SUBJECT, SUBJECTS, type SubjectId } from '../../content/subjects';

export type CardKind = 'term' | 'model' | 'guide' | 'step' | 'threat' | 'stack' | 'room' | 'incident';

export interface CardFact { label: string; items: string[] }

export interface StudyCard {
  /** kind:id, unique across the deck */
  id: string;
  kind: CardKind;
  ref: string;
  title: string;
  /** a term's other names (content/glossary-aliases.ts), so a search by one of them finds the card */
  aka?: string[];
  /** the domain, family, chapter or part kind it belongs to */
  domain: string;
  /** its subject, one of eleven shared by the glossary, the guides and the deck (content/subjects.ts) */
  subject?: SubjectId;
  /** the front's cue: what to recall before turning the card */
  cue: string;
  /** the back: the answer in a sentence or two */
  answer: string;
  /** the depth: longer paragraphs */
  detail: string[];
  facts: CardFact[];
  related: string[];
  route: { view: ViewKey; id?: string; sub?: string };
  /** words across the card, for the reading time */
  words: number;
}

export const KIND_LABEL: Record<CardKind, string> = {
  term: 'Term', model: 'Structure', guide: 'Guide', step: 'Step', threat: 'Threat', stack: 'Stack', room: 'Room', incident: 'In the world',
};
export const KIND_HUE: Record<CardKind, string> = {
  term: '#c084fc', model: '#9cc3ef', guide: '#fdc26f', step: '#d8effc', threat: '#e8786a', stack: '#f18ac6', room: '#8b9cf5', incident: '#f8f1fb',
};
const CUE: Record<CardKind, string> = {
  term: 'Say what it means, and why it matters to a security leader.',
  model: 'Say what this structure defeats, and where it fails.',
  guide: 'Say what this guide is for, and the first move it asks of you.',
  step: 'Say the stance this Step takes, and what it asks you to do.',
  threat: 'Say what the adversary does, and which structures stop it.',
  stack: 'Say what these structures do together, and where they fit.',
  room: 'Say what this room puts you in charge of, and what it judges.',
  incident: 'Say what happened, and what made the difference that day.',
};

function firstSentences(text: string, max = 420): string {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '));
  return stop > 120 ? cut.slice(0, stop + 1) : cut.slice(0, cut.lastIndexOf(' ')) + '…';
}
const countWords = (...xs: (string | undefined)[]) => xs.join(' ').split(/\s+/).filter(Boolean).length;

/* which glossary terms a text names: lib/terms.ts, the same match that links the word in prose */
export { mentionsIn };

/* ---------- the deck ---------- */

let DECK: StudyCard[] | null = null;
let BY_ID: Map<string, StudyCard> | null = null;
let GRAPH: Map<string, Set<string>> | null = null;

function build(): StudyCard[] {
  const cards: StudyCard[] = [];
  const modelIds = new Set(MODUX_MODELS.map(m => m.id));
  const modelName = (id: string) => MODUX_MODELS.find(m => m.id === id)?.name || id;
  /* an id, a spelling or another name of an entry joins to that entry; a word with no entry joins to nothing */
  const termCards = (ids: string[]) => ids.map(id => exactTerm(id)).filter(Boolean).map(t => 'term:' + t!.id);

  for (const t of TERMS) {
    cards.push({
      id: 'term:' + t.id, kind: 'term', ref: t.id, title: t.term, aka: t.aliases, domain: t.domain, cue: CUE.term,
      answer: t.short, detail: [t.long, t.why ? 'Why it matters: ' + t.why : ''].filter(Boolean), facts: [],
      related: [...termCards(t.related || []), ...termCards(mentionsIn(t.long + ' ' + t.why, 6, t.id))],
      route: { view: 'guides', sub: t.id }, words: countWords(t.short, t.long, t.why),
    });
  }
  for (const m of MODUX_MODELS) {
    const links = [...(m.combines || []), ...(m.conflicts || [])].map(l => l.model).filter(id => modelIds.has(id));
    cards.push({
      id: 'model:' + m.id, kind: 'model', ref: m.id, title: m.name, domain: FAMILY_LABEL[m.family] + ' · ' + m.tier, cue: CUE.model,
      answer: m.statement, detail: [m.structure, m.systemsLens, m.origin].filter(Boolean),
      facts: [
        { label: 'Defeats', items: m.defeats || [] },
        { label: 'Fails when', items: m.failsWhen || [] },
        { label: 'Parts', items: m.components || [] },
        ...(m.combines?.length ? [{ label: 'Compounds with', items: m.combines.map(l => modelName(l.model) + ': ' + l.how) }] : []),
      ].filter(f => f.items.length),
      related: [...links.map(id => 'model:' + id), ...termCards(mentionsIn(m.statement + ' ' + m.structure + ' ' + m.systemsLens, 5))],
      route: { view: 'modux-model', id: m.id }, words: countWords(m.statement, m.structure, m.systemsLens, m.origin, (m.defeats || []).join(' '), (m.failsWhen || []).join(' ')),
    });
  }
  for (const g of GUIDES) {
    const titles = g.blocks.map(b => b.title).filter((x): x is string => !!x);
    const prose = g.blocks.filter(b => b.kind === 'prose' && b.body).map(b => b.body as string);
    cards.push({
      id: 'guide:' + g.id, kind: 'guide', ref: g.id, title: g.title, domain: g.domain, cue: CUE.guide,
      answer: firstSentences(g.summary, 360), detail: [g.statement, ...prose.slice(0, 1).map(p => firstSentences(p, 600))],
      facts: titles.length ? [{ label: 'In this guide', items: titles }] : [],
      related: termCards(mentionsIn(g.summary + ' ' + prose.join(' '), 8)),
      route: { view: 'guides', id: g.id }, words: countWords(g.summary, ...prose),
    });
  }
  for (const c of CHAPTERS) for (const p of c.pages) for (const st of p.steps) {
    const prose = st.blocks.filter(b => (b.kind === 'prose' || b.kind === 'principle') && b.body).map(b => b.body as string);
    cards.push({
      id: 'step:' + st.id, kind: 'step', ref: st.id, title: st.title, domain: c.title + ' · ' + p.title, cue: CUE.step,
      answer: st.statement, detail: prose.slice(0, 2).map(x => firstSentences(x, 600)),
      facts: [
        ...(st.praxis ? [{ label: 'In the world', items: [st.praxis] }] : []),
        ...(st.blocks.some(b => b.title) ? [{ label: 'In this Step', items: st.blocks.map(b => b.title).filter((x): x is string => !!x).slice(0, 8) }] : []),
      ],
      related: termCards(mentionsIn(st.statement + ' ' + prose.join(' '), 8)),
      route: { view: 'step', id: st.id }, words: countWords(st.statement, ...prose),
    });
  }
  for (const p of PRESSURES) {
    cards.push({
      id: 'threat:' + p.id, kind: 'threat', ref: p.id, title: p.name, domain: 'Hits ' + NODE_KIND_LABEL[p.target], cue: CUE.threat,
      answer: p.move, detail: [],
      facts: [{ label: 'Stopped by', items: p.counters.filter(id => modelIds.has(id)).map(modelName) }],
      related: [...p.counters.filter(id => modelIds.has(id)).map(id => 'model:' + id), ...termCards(mentionsIn(p.move, 3))],
      route: { view: 'study', id: 'threat:' + p.id }, words: countWords(p.move),
    });
  }
  for (const st of STACKS) {
    cards.push({
      id: 'stack:' + st.id, kind: 'stack', ref: st.id, title: st.name, domain: 'Stack · ' + st.fits, cue: CUE.stack,
      answer: st.statement, detail: [st.why, st.evidence].filter(Boolean),
      facts: [{ label: 'Structures', items: st.models.filter(id => modelIds.has(id)).map(modelName) }],
      related: st.models.filter(id => modelIds.has(id)).map(id => 'model:' + id),
      route: { view: 'modux-stack', id: st.id }, words: countWords(st.statement, st.why, st.evidence),
    });
  }
  for (const r of SIMS) {
    const ch = CHAPTERS.find(c => c.id === r.chapterId);
    cards.push({
      id: 'room:' + r.id, kind: 'room', ref: r.id, title: r.title, domain: r.org + ' · ' + r.sector, cue: CUE.room,
      answer: firstSentences(r.brief, 360), detail: [r.objective].filter(Boolean),
      facts: [], related: termCards(mentionsIn(r.brief + ' ' + r.objective, 6)),
      route: { view: 'sim', id: r.id }, words: countWords(r.brief, r.objective) + (ch ? 0 : 0),
    });
  }
  for (const inc of INCIDENTS) {
    const ids = [...new Set(inc.checks.flatMap(c => c.stack).filter(id => modelIds.has(id)))];
    cards.push({
      id: 'incident:' + inc.id, kind: 'incident', ref: inc.id, title: inc.name, domain: inc.when, cue: CUE.incident,
      answer: inc.known, detail: ['Source: ' + inc.source],
      facts: [{ label: 'The checks', items: inc.checks.map(c => c.label) }],
      related: ids.map(id => 'model:' + id),
      route: { view: 'guides', id: 'sg-the-model-written-down' }, words: countWords(inc.known, inc.source),
    });
  }
  return cards;
}

export function deck(): StudyCard[] {
  if (!DECK) {
    DECK = build();
    BY_ID = new Map(DECK.map(c => [c.id, c]));
    /* related ids that do not resolve are dropped, and duplicates removed */
    for (const c of DECK) c.related = [...new Set(c.related.filter(id => id !== c.id && BY_ID!.has(id)))];
    for (const c of DECK) c.subject = subjectOfCard(c);
    GRAPH = new Map(DECK.map(c => [c.id, new Set<string>()]));
    for (const c of DECK) for (const r of c.related) { GRAPH.get(c.id)!.add(r); GRAPH.get(r)!.add(c.id); }
  }
  return DECK;
}

export function cardById(id: string): StudyCard | undefined {
  deck();
  /* a glossary entry that was merged into another (content/glossary-aliases.ts): its card id finds the kept card */
  return BY_ID!.get(id) || (id.startsWith('term:') && RETIRED[id.slice(5)] ? BY_ID!.get('term:' + RETIRED[id.slice(5)]) : undefined);
}

/** every card this one is joined to, in either direction */
export function neighbours(id: string): string[] {
  deck();
  return [...(GRAPH!.get(id) || [])];
}

/** how many cards a card is joined to: its load in the graph */
export function degree(id: string): number {
  deck();
  return GRAPH!.get(id)?.size || 0;
}

/** the shortest path of joined cards from any card in `from` to `to`, or null */
export function pathTo(to: string, from: Set<string>, maxLen = 7): string[] | null {
  deck();
  if (from.has(to)) return [to];
  const prev = new Map<string, string | null>();
  const queue: string[] = [];
  for (const f of from) { prev.set(f, null); queue.push(f); }
  while (queue.length) {
    const cur = queue.shift()!;
    for (const n of GRAPH!.get(cur) || []) {
      if (prev.has(n)) continue;
      prev.set(n, cur);
      if (n === to) {
        const path = [n];
        let p = prev.get(n);
        while (p) { path.unshift(p); p = prev.get(p) || null; }
        return path.length <= maxLen ? path : null;
      }
      queue.push(n);
    }
  }
  return null;
}

/** the share of cards joined to at most this many others, for reading a degree as a percentile */
export function degreeRank(id: string): number {
  const all = deck().map(c => degree(c.id)).sort((a, b) => a - b);
  const d = degree(id);
  let below = 0;
  for (const x of all) if (x < d) below++;
  return all.length ? below / all.length : 0;
}

/** a card's subject, read from what it was made from */
function subjectOfCard(c: StudyCard): SubjectId | undefined {
  switch (c.kind) {
    case 'term': return TERM_OVERRIDE[c.ref] || TERM_SUBJECT[c.domain];
    case 'guide': return GUIDE_SUBJECT[c.domain];
    case 'model': return MODEL_SUBJECT[c.domain.split(' · ')[0]];
    case 'step': {
      for (const ch of CHAPTERS) for (const p of ch.pages) if (p.steps.some(st => st.id === c.ref)) return PAGE_SUBJECT[p.id] || CHAPTER_SUBJECT[ch.id];
      return undefined;
    }
    case 'threat': { const p = PRESSURES.find(x => x.id === c.ref); return p ? THREAT_SUBJECT[p.target] : undefined; }
    case 'stack': return 'systems';
    case 'room': { const r = SIMS.find(x => x.id === c.ref); return (r && CHAPTER_SUBJECT[r.chapterId]) || 'systems'; }
    case 'incident': return INCIDENT_SUBJECT[c.ref] || 'resilience';
  }
}

/** the subjects that hold cards of a kind (or of every kind), in subject order, with their counts */
export function subjectsOf(kind?: CardKind): { id: SubjectId; name: string; n: number }[] {
  const cards = deck().filter(c => !kind || c.kind === kind);
  return SUBJECTS.map(sh => ({ id: sh.id, name: sh.name, n: cards.filter(c => c.subject === sh.id).length })).filter(x => x.n > 0);
}

export function domainsOf(kind?: CardKind): string[] {
  return [...new Set(deck().filter(c => !kind || c.kind === kind).map(c => c.domain.split(' · ')[0]))].sort();
}

/** the deck's domains under the subjects that hold them, for a kind (or every kind) and one subject (or every subject) */
export function domainsBySubject(kind?: CardKind, subject?: SubjectId): { id: SubjectId; name: string; domains: string[] }[] {
  const cards = deck().filter(c => (!kind || c.kind === kind) && (!subject || c.subject === subject));
  return SUBJECTS.filter(sh => !subject || sh.id === subject)
    .map(sh => ({ id: sh.id, name: sh.name, domains: [...new Set(cards.filter(c => c.subject === sh.id).map(c => c.domain.split(' · ')[0]))].sort() }))
    .filter(x => x.domains.length);
}

/** the source text a learner reads on a card, for search and for Seva */
export function cardText(c: StudyCard): string {
  return [c.title, c.answer, ...c.detail, ...c.facts.map(f => f.label + ': ' + f.items.join('; '))].join('\n');
}
