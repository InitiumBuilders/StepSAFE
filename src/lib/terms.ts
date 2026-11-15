/* THE WORDS AND WHERE THEY LIVE. One relation between the glossary and the rest of the corpus, read both ways:
   the terms a Step names or uses, and the Steps and guides that name or use a term. A term is used where its name,
   or another name recorded for it, appears in the text. That is the same match that turns the word into a link in
   the prose (components/Blocks.tsx) and joins cards in StudyMode (lib/study/cards.ts), so all three agree.

   For a phrase the glossary has no entry for, lookup() reports what the corpus itself says: the entries whose text
   explains the phrase, and the Steps and guides that use it, each with the sentence as proof, then the entries with
   the nearest names. Nothing here guesses: a passage is shown only when the phrase is in it. */

import { TERMS, CHAPTERS, GUIDES, exactTerm, closestTerms } from '../content/registry';
import type { Term, Step, StepBlock } from '../content/schema';

const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ---------- the names that link in prose ---------- */

export interface TermMatcher { words: RegExp; acr: RegExp; byKey: Map<string, Term> }
const isAcronym = (name: string) => /^[A-Z0-9][A-Z0-9.+-]*$/.test(name) && name.length >= 3;
/** multi-word names, long single words and acronyms link; short common words do not. Another name for an entry
    has to be longer still when it is one word, so "credits" in a sentence is left alone. */
export const linksInProse = (name: string, other = false) => /\s/.test(name) || isAcronym(name) || name.length >= (other ? 10 : 7);

let MATCHER: TermMatcher | null = null, MATCHER_N = -1;
export function termMatcher(): TermMatcher {
  if (MATCHER && MATCHER_N === TERMS.length) return MATCHER;
  const byKey = new Map<string, Term>();
  const words: string[] = [], acr: string[] = [];
  const add = (raw: string, t: Term, other: boolean) => {
    const name = raw.trim();
    if (!linksInProse(name, other) || byKey.has(name.toLowerCase())) return;
    byKey.set(name.toLowerCase(), t);
    (isAcronym(name) ? acr : words).push(esc(name));
  };
  for (const t of TERMS) add(t.term, t, false);
  for (const t of TERMS) for (const a of t.aliases || []) add(a, t, true);
  words.sort((a, b) => b.length - a.length);
  acr.sort((a, b) => b.length - a.length);
  const bound = (alts: string[], flags: string) => alts.length ? new RegExp('(?<![\\w-])(' + alts.join('|') + ')(e?s)?(?![\\w-])', flags) : /(?!)/g;
  MATCHER = { words: bound(words, 'gi'), acr: bound(acr, 'g'), byKey };
  MATCHER_N = TERMS.length;
  return MATCHER;
}

/** every place a text names a term, in reading order */
export function termHits(text: string): { i: number; e: number; term: Term }[] {
  const m = termMatcher();
  const found: { i: number; e: number; term: Term }[] = [];
  for (const re of [m.acr, m.words]) {
    re.lastIndex = 0;
    let x: RegExpExecArray | null;
    while ((x = re.exec(text))) {
      const t = m.byKey.get(x[1].toLowerCase());
      if (t) found.push({ i: x.index, e: x.index + x[0].length, term: t });
      if (!x[0].length) re.lastIndex++;
    }
  }
  /* in reading order; where two names start at the same place the longer one wins, so "CSF 2.0 GOVERN" is that
     entry and a bare "CSF" is the framework */
  return found.sort((a, b) => a.i - b.i || (b.e - b.i) - (a.e - a.i));
}

/** the glossary terms a text names, by id, in order of first mention, at most `cap` */
export function mentionsIn(text: string, cap = 8, skip?: string): string[] {
  const out: string[] = [];
  for (const f of termHits(text)) {
    if (f.term.id === skip || out.includes(f.term.id)) continue;
    out.push(f.term.id);
    if (out.length >= cap) break;
  }
  return out;
}

/* ---------- a phrase, and the sentence that holds it ---------- */

/** a phrase as the corpus might write it: its words in order, joined by a space, a hyphen, a dot or a slash, singular or plural */
export function phraseFinder(phrase: string): RegExp | null {
  const words = phrase.toLowerCase().split(/[^a-z0-9+]+/).filter(Boolean);
  if (!words.length) return null;
  return new RegExp('(?<![\\w-])' + words.map(esc).join('[\\s.\\-/]+') + '(?:e?s)?(?![\\w-])', 'i');
}

/** the sentence of a text that a pattern matches, whole, or its nearest 300 characters when it runs long */
export function sentenceWith(text: string, re: RegExp): string {
  const m = re.exec(text);
  if (!m) return '';
  let a = m.index, b = m.index + m[0].length;
  while (a > 0 && text[a - 1] !== '\n' && !(/[.!?]/.test(text[a - 1]) && /\s/.test(text[a] || ''))) a--;
  while (b < text.length && text[b] !== '\n' && !(/[.!?]/.test(text[b]) && (b + 1 >= text.length || /\s/.test(text[b + 1])))) b++;
  let s = text.slice(a, Math.min(text.length, b + 1)).replace(/\s+/g, ' ').trim();
  if (s.length > 300) {
    const at = Math.max(0, m.index - a - 110);
    s = (at > 0 ? '…' : '') + s.slice(at, at + 290).trim() + '…';
  }
  return s;
}

/* ---------- the corpus as text ---------- */

interface Texts { prose: string[]; cells: string[]; low: string }
const blockTexts = (bs: StepBlock[], extra: (string | undefined)[]): Texts => {
  const prose: string[] = extra.filter(Boolean) as string[], cells: string[] = [];
  for (const b of bs) {
    if (b.kind === 'code') continue;
    if (b.body) prose.push(...b.body.split(/\n\n+/));
    if (b.items) prose.push(...b.items);
    if (b.left) prose.push(...b.left.items);
    if (b.right) prose.push(...b.right.items);
    if (b.rows) for (const r of b.rows) cells.push(r.join(' · '));
  }
  return { prose, cells, low: (prose.join('\n') + '\n' + cells.join('\n')).toLowerCase() };
};

interface StepEntry extends Texts { step: Step; chapter: string }
interface GuideEntry extends Texts { id: string; title: string; domain: string }
let CORPUS: { steps: StepEntry[]; guides: GuideEntry[]; n: number } | null = null;
function corpus() {
  if (CORPUS && CORPUS.n === TERMS.length) return CORPUS;
  const steps: StepEntry[] = [];
  /* the twelve core chapters; a Modux Step's glossary holds catalog tags, not terms */
  for (const c of CHAPTERS) for (const p of c.pages) for (const st of p.steps) {
    if (st.id.includes('--mm-') || !st.blocks) continue;
    steps.push({ step: st, chapter: c.title, ...blockTexts(st.blocks, [st.statement]) });
  }
  const guides: GuideEntry[] = GUIDES.filter(g => g.blocks).map(g => ({ id: g.id, title: g.title, domain: g.domain, ...blockTexts(g.blocks, [g.statement, g.summary]) }));
  CORPUS = { steps, guides, n: TERMS.length };
  return CORPUS;
}

const passageIn = (t: Texts, re: RegExp): string => {
  for (const x of t.prose) { const s = sentenceWith(x, re); if (s) return s; }
  for (const x of t.cells) { const s = sentenceWith(x, re); if (s) return s; }
  return '';
};

/* ---------- a phrase with no entry ---------- */

export interface Use { kind: 'step' | 'guide'; id: string; title: string; where: string; passage: string; names: boolean; /** a Step written for Motus */ motus?: boolean }
export interface Lookup {
  phrase: string;
  /** entries whose own text explains the phrase, with the sentence */
  covered: { term: Term; passage: string }[];
  /** Steps and guides that use the phrase, with the sentence; the Steps that name it come first */
  uses: Use[];
  /** entries whose names are nearest */
  closest: Term[];
}

const LOOKUPS = new Map<string, Lookup>();
export function lookup(slugOrPhrase: string): Lookup {
  const key = slugOrPhrase.toLowerCase();
  const kept = LOOKUPS.get(key);
  if (kept && CORPUS && CORPUS.n === TERMS.length) return kept;
  const phrase = slugOrPhrase.replace(/-/g, ' ').trim();
  const re = phraseFinder(phrase);
  const out: Lookup = { phrase, covered: [], uses: [], closest: closestTerms(slugOrPhrase) };
  if (re) {
    const first = phrase.toLowerCase().split(/[^a-z0-9+]+/).filter(Boolean)[0] || '';
    for (const t of TERMS) {
      const s = sentenceWith(t.short, re) || sentenceWith(t.long, re) || sentenceWith(t.why, re);
      if (s) out.covered.push({ term: t, passage: s });
    }
    const c = corpus();
    const named: Use[] = [], other: Use[] = [];
    for (const e of c.steps) {
      const names = (e.step.glossary || []).includes(slugOrPhrase);
      if (!names && !e.low.includes(first)) continue;
      const passage = e.low.includes(first) ? passageIn(e, re) : '';
      if (passage) (names ? named : other).push({ kind: 'step', id: e.step.id, title: e.step.title, where: e.chapter, passage, names, motus: e.step.mode === 'motus' });
    }
    for (const g of c.guides) {
      if (!g.low.includes(first)) continue;
      const passage = passageIn(g, re);
      if (passage) other.push({ kind: 'guide', id: g.id, title: g.title, where: 'StepGuide · ' + g.domain, passage, names: false });
    }
    out.uses = [...named, ...other];
  }
  LOOKUPS.set(key, out);
  return out;
}

/* ---------- a term, and where the corpus teaches or uses it ---------- */

export interface Place { kind: 'step' | 'guide'; id: string; title: string; where: string; /** a Step written for Motus */ motus?: boolean }
export interface Places { taught: Place[]; used: Place[]; guides: Place[] }
const PLACES = new Map<string, Places>();

/** the Steps that name a term in their vocabulary, the Steps whose text uses it, and the guides that use it */
export function placesOf(term: Term): Places {
  const kept = PLACES.get(term.id);
  if (kept && CORPUS && CORPUS.n === TERMS.length) return kept;
  const names = [term.term, ...(term.aliases || [])].map((n, i) => n.trim()).filter((n, i) => linksInProse(n, i > 0));
  const res = names.map(n => new RegExp('(?<![\\w-])' + esc(n) + '(e?s)?(?![\\w-])', isAcronym(n) ? '' : 'i'));
  const lows = names.map(n => n.toLowerCase());
  const usedIn = (t: Texts) => lows.some(l => t.low.includes(l)) && res.some(re => t.prose.some(x => re.test(x)) || t.cells.some(x => re.test(x)));
  const c = corpus();
  const out: Places = { taught: [], used: [], guides: [] };
  for (const e of c.steps) {
    const place: Place = { kind: 'step', id: e.step.id, title: e.step.title, where: e.chapter, motus: e.step.mode === 'motus' };
    if ((e.step.glossary || []).some(g => exactTerm(g)?.id === term.id)) out.taught.push(place);
    else if (usedIn(e)) out.used.push(place);
  }
  for (const g of c.guides) if (usedIn(g)) out.guides.push({ kind: 'guide', id: g.id, title: g.title, where: g.domain });
  PLACES.set(term.id, out);
  return out;
}

/* ---------- a Step, and its words ---------- */

export interface StepVocab {
  /** entries: the ones the Step names first, then the ones its text uses */
  terms: Term[];
  /** how many of them the Step names itself */
  named: number;
  /** words the Step names that have no entry; `open` when the corpus says something about one beyond this Step */
  bare: { slug: string; phrase: string; open: boolean }[];
}
const VOCAB = new Map<string, StepVocab>();

export function vocabOfStep(step: Step, cap = 10): StepVocab {
  const kept = VOCAB.get(step.id);
  if (kept && CORPUS && CORPUS.n === TERMS.length) return kept;
  const terms: Term[] = [], bare: StepVocab['bare'] = [];
  for (const g of step.glossary || []) {
    const t = exactTerm(g);
    if (t) { if (!terms.includes(t)) terms.push(t); continue; }
    const l = lookup(g);
    bare.push({ slug: g, phrase: l.phrase, open: l.covered.length > 0 || l.closest.length > 0 || l.uses.some(u => u.id !== step.id) });
  }
  const named = terms.length;
  const text = blockTexts(step.blocks || [], [step.statement]);
  for (const id of mentionsIn(text.prose.join('\n') + '\n' + text.cells.join('\n'), 24)) {
    if (terms.length >= Math.max(cap, named)) break;
    const t = TERMS.find(x => x.id === id);
    if (t && !terms.includes(t)) terms.push(t);
  }
  const out = { terms, named, bare };
  corpus();
  VOCAB.set(step.id, out);
  return out;
}
