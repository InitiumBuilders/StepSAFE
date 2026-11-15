/* The words, held true. Every word a Step names in its vocabulary either resolves to the glossary entry for that
   concept (by its id, by a spelling of its name, or by another name recorded on the entry) or is counted as having
   no entry. Nothing resolves by guessing: until 2026-11-09 a fuzzy "confident" match opened the nearest-sounding
   entry for 263 links ("tier zero" opened Zero Trust), and this probe fails if that returns.

   It prints what the corpus says about the words with no entry (explained inside another entry, used in other
   Steps or guides, used only where they are named, or found nowhere), and checks the other names, the merged
   entries, every entry's related links and sources, near-duplicate names, and how many entries the corpus reaches.
   docs/TERMS-RATCHET.json holds the counts: resolved links may rise and never fall; links to no entry, from Steps
   and from entries, may fall and never rise.
   Run: npx tsx probe-terms.mts */
(globalThis as any).self = globalThis;
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
const C: any = await import('./src/content/index');
const R: any = await import('./src/content/registry');
await R.loadContent();
const { lookup, placesOf, vocabOfStep, termHits } = await import('./src/lib/terms');
const { TERM_ALIASES, RETIRED } = await import('./src/content/glossary-aliases');
const { TERMS_NAMED } = await import('./src/content/glossary-named');

const problems: string[] = [];
const bad = (m: string) => problems.push(m);
const TODAY = new Date().toISOString().slice(0, 10);
const T: any[] = R.TERMS;
const byId = new Map(T.map(t => [t.id, t]));

/* 1. the Steps' links: an entry, or none */
let links = 0, resolved = 0, byOtherName = 0, none = 0;
const noEntry = new Map<string, string[]>();
const steps: any[] = [];
for (const c of R.CHAPTERS) for (const p of c.pages) for (const st of p.steps) {
  if (st.id.includes('--mm-')) continue;
  steps.push(st);
  for (const g of st.glossary || []) {
    links++;
    const t = R.exactTerm(g);
    const viaResolver = R.resolveTerm(g).term;
    if ((viaResolver && viaResolver.id) !== (t && t.id)) bad('the resolver opens ' + viaResolver?.term + ' for "' + g + '", which is not that entry: a guess');
    if (!t) { none++; noEntry.set(g, [...(noEntry.get(g) || []), st.id]); continue; }
    resolved++;
    if (t.id !== g && R.normaliseTerm(t.id) !== R.normaliseTerm(g) && R.normaliseTerm(t.term) !== R.normaliseTerm(g)) byOtherName++;
  }
}

/* the cases that were wrong before, and the ones that must work */
for (const [q, want] of [['tier-zero', ''], ['legitimate-interests-balancing', ''], ['high-risk-ai-system', ''], ['verifiable-delay-function', ''], ['static-analysis', ''],
  ['software-composition-analysis', 'sca'], ['two-person-rule', 'dual-control'], ['hardware-security-module', 'hsm'], ['pseudonymization', 'pseudonymisation'],
  ['reorg', 'chain-reorganization'], ['csf', 'nist-csf'], ['csf-govern', 'csf-2-0-govern'], ['safe-multisig', 'multisig'], ['legal-privilege', 'legal-privilege']] as [string, string][]) {
  const got = R.resolveTerm(q).term?.id || '';
  if (got !== want) bad('"' + q + '" should resolve to ' + (want || 'no entry') + ', and resolves to ' + (got || 'no entry'));
}

/* 2. what the corpus says about a word with no entry */
const tiers = { explained: 0, elsewhere: 0, ownStepOnly: 0, neighboursOnly: 0, nowhere: 0 };
const tierLinks = { explained: 0, elsewhere: 0, ownStepOnly: 0, neighboursOnly: 0, nowhere: 0 };
const nowhere: string[] = [];
for (const [slug, ids] of noEntry) {
  const l = lookup(slug);
  const k = l.covered.length ? 'explained' : l.uses.some((u: any) => !ids.includes(u.id)) ? 'elsewhere' : l.uses.length ? 'ownStepOnly' : l.closest.length ? 'neighboursOnly' : 'nowhere';
  (tiers as any)[k]++; (tierLinks as any)[k] += ids.length;
  if (k === 'nowhere') nowhere.push(slug);
  for (const c of l.covered) if (!c.passage) bad('an entry is said to explain "' + slug + '" with no sentence to show');
}

/* 3. the other names */
for (const id of Object.keys(TERM_ALIASES)) if (!byId.has(id)) bad('glossary-aliases names an entry that does not exist: ' + id);
for (const t of T) for (const a of t.aliases || []) {
  const hit = R.exactTerm(a);
  if (!hit || hit.id !== t.id) bad('"' + a + '" is recorded as another name for ' + t.term + ' and resolves to ' + (hit ? hit.term : 'nothing'));
}
for (const [old, kept] of Object.entries(RETIRED) as [string, string][]) {
  if (byId.has(old)) bad('a retired entry is still in the glossary: ' + old);
  if (!byId.has(kept)) bad('RETIRED points at an entry that does not exist: ' + kept);
  if (R.exactTerm(old)?.id !== kept) bad('the retired id ' + old + ' does not resolve to ' + kept);
}

/* 4. no two entries for one thing: names and other names that differ only by spacing, hyphens or a plural */
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/s$/, '');
const seen = new Map<string, string>();
for (const t of T) for (const n of [t.term, ...(t.aliases || [])]) {
  const k = key(n), was = seen.get(k);
  if (was && was !== t.id) bad('two entries answer to one name: ' + was + ' and ' + t.id + ' (' + n + ')');
  seen.set(k, t.id);
}

/* 5. every entry's related links, and the new entries' in full */
let related = 0, relatedNone = 0;
for (const t of T) for (const r of t.related) { related++; if (!R.exactTerm(r)) relatedNone++; }
for (const t of TERMS_NAMED as any[]) {
  for (const r of t.related) if (!R.exactTerm(r)) bad('the new entry ' + t.term + ' relates to "' + r + '", which has no entry');
  if (/[—–]/.test(t.short + t.long + t.why)) bad('the new entry ' + t.term + ' carries a dash');
  if (!R.exactTerm(t.id) || R.exactTerm(t.id).id !== t.id) bad('the new entry ' + t.id + ' does not resolve to itself');
}

/* 6. a source on an entry is a link read on a day that has happened */
let sourced = 0;
for (const t of T) for (const s of t.sources || []) {
  sourced++;
  if (!s.label || !/^https:\/\//.test(s.url)) bad(t.term + ' has a source with no https link');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.checked) || s.checked > TODAY) bad(t.term + ' has a source read on ' + s.checked + ', which is not a day that has happened');
}

/* 7. the other way: which entries the corpus reaches */
let named = 0, used = 0, reached = 0;
const unreached: string[] = [];
for (const t of T) {
  const p = placesOf(t);
  if (p.taught.length) named++;
  if (p.used.length || p.guides.length) used++;
  if (p.taught.length || p.used.length || p.guides.length) reached++; else unreached.push(t.term);
}

/* 8. a Step's row of terms holds entries only, and the glossary labels a related term by its own entry */
let rowTerms = 0, rowBare = 0, rowOpen = 0;
for (const st of steps) { const v = vocabOfStep(st); rowTerms += v.terms.length; rowBare += v.bare.length; rowOpen += v.bare.filter((b: any) => b.open).length; if (v.terms.some((t: any) => !byId.has(t.id))) bad('a Step lists a term that is not an entry: ' + st.id); }
const gloss = readFileSync('src/components/Glossary.tsx', 'utf8');
if (/resolveTerm\(r\)\.term/.test(gloss)) bad('the glossary labels a related term through the resolver; it should use the entry or nothing');

/* a name inside a longer name: the longer entry wins where both start at the same word */
{
  const a = termHits('The CSF 2.0 GOVERN function sits above the others.')[0], b = termHits('Record it in the CSF profile.')[0], c = termHits('The HSM signs; a Hardware Security Module will not export the key.');
  if (a?.term.id !== 'csf-2-0-govern') bad('"CSF 2.0 GOVERN" in a sentence should link to that entry, and links to ' + a?.term.id);
  if (b?.term.id !== 'nist-csf') bad('a bare "CSF" in a sentence should link to NIST CSF, and links to ' + b?.term.id);
  if (c.length !== 2 || c.some((h: any) => h.term.id !== 'hsm')) bad('HSM and its other name should both link to the one entry');
}

/* 9. a merged entry's card and a learner's record of it: the old card id finds the kept card, and a saved study
   record moves to it with the learner's own words, notes and tags kept */
const { cardById, deck } = await import('./src/lib/study/cards');
for (const [old, kept] of Object.entries(RETIRED) as [string, string][]) {
  if (cardById('term:' + old)?.id !== 'term:' + kept) bad('the card of the retired entry ' + old + ' does not find the card of ' + kept);
  if (deck().some((c: any) => c.id === 'term:' + old)) bad('the deck still holds a card for the retired entry ' + old);
}
const store = new Map<string, string>();
(globalThis as any).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); }, removeItem: (k: string) => { store.delete(k); } };
(globalThis as any).sessionStorage ??= { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const card = (extra: object) => ({ secs: 5, unitiaC: 0, firstAt: 1, lastAt: 2, views: 1, ...extra });
store.set('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, study: {
  'term:hardware-security-module': card({ ownWords: 'mine, from the retired card', tags: ['a'], note: 'same' }),
  'term:hsm': card({ secs: 9, ownWords: 'kept', tags: ['b'], note: 'same' }),
  'term:cisa-kev': card({ note: 'only on the retired card' }),
  'term:zero-trust': card({ ownWords: 'untouched' }),
} }));
const { load } = await import('./src/lib/state');
const st: any = load().study;
if (st['term:hardware-security-module'] || st['term:cisa-kev']) bad('a study record for a retired card was left under its old id');
if (st['term:hsm']?.secs !== 9 || !/kept/.test(st['term:hsm']?.ownWords || '') || !/mine, from the retired card/.test(st['term:hsm']?.ownWords || '')) bad('where both cards were studied, the kept record should stand and take the other\'s own words: ' + JSON.stringify(st['term:hsm']));
if (st['term:hsm']?.note !== 'same' || (st['term:hsm']?.tags || []).slice().sort().join() !== 'a,b') bad('the merged record should keep one copy of a repeated note and both sets of tags: ' + JSON.stringify(st['term:hsm']));
if (st['term:kev']?.note !== 'only on the retired card') bad('a record studied only on the retired card should move to the kept card');
if (st['term:zero-trust']?.ownWords !== 'untouched') bad('a record for any other card must not change');

console.log('Step links ' + links + ' | to an entry ' + resolved + ' (' + byOtherName + ' by another name) | to no entry ' + none + ' (' + noEntry.size + ' words)');
console.log('words with no entry: explained inside an entry ' + tiers.explained + ' (' + tierLinks.explained + ' links) | used in another Step or guide ' + tiers.elsewhere + ' (' + tierLinks.elsewhere + ') | only where named ' + tiers.ownStepOnly + ' (' + tierLinks.ownStepOnly + ') | near names only ' + tiers.neighboursOnly + ' (' + tierLinks.neighboursOnly + ') | found nowhere ' + tiers.nowhere + ' (' + tierLinks.nowhere + ')');
console.log('entries ' + T.length + ' | other names ' + T.reduce((n, t) => n + (t.aliases || []).length, 0) + ' | retired ' + Object.keys(RETIRED).length + ' | sources on entries ' + sourced);
console.log('related links ' + related + ' | to no entry ' + relatedNone);
console.log('merged entries: ' + Object.keys(RETIRED).length + ' retired ids find their kept cards; a saved record moves with its words, notes and tags');
console.log('entries a Step names ' + named + ' | entries the text uses ' + used + ' | reached any way ' + reached + ' | reached no way ' + unreached.length);
console.log('Step rows: ' + rowTerms + ' terms shown over ' + steps.length + ' Steps | words with no entry ' + rowBare + ', of which ' + rowOpen + ' open onto something');
if (process.argv.includes('--list')) { console.log('\nno entry, most named:\n' + [...noEntry].sort((a, b) => b[1].length - a[1].length).slice(0, 60).map(([k, v]) => k + ' ' + v.length).join(', ')); console.log('\nreached no way:\n' + unreached.join(', ')); }

/* the ratchet */
const RATCHET = 'docs/TERMS-RATCHET.json';
const base = existsSync(RATCHET) ? JSON.parse(readFileSync(RATCHET, 'utf8')) : null;
if (base) {
  if (resolved < base.resolved) bad('the ratchet: ' + resolved + ' Step links reach an entry, fewer than the ' + base.resolved + ' held on ' + base.at + '. An entry or another name was lost; restore it.');
  if (none > base.noEntry) bad('the ratchet: ' + none + ' Step links reach no entry, more than the ' + base.noEntry + ' held on ' + base.at + '. A new Step names a word the glossary lacks: write the entry, record the other name, or drop the word.');
  if (relatedNone > base.relatedNoEntry) bad('the ratchet: ' + relatedNone + ' related links reach no entry, more than the ' + base.relatedNoEntry + ' held on ' + base.at + '.');
}
if (!problems.some(p => p.startsWith('the ratchet')) && (!base || resolved > base.resolved || none < base.noEntry || relatedNone < base.relatedNoEntry)) {
  writeFileSync(RATCHET, JSON.stringify({ at: TODAY, links, resolved, noEntry: none, relatedNoEntry: relatedNone, entries: T.length }, null, 2) + '\n', 'utf8');
  console.log('ratchet ' + (base ? 'moved' : 'set') + ': ' + resolved + ' resolved, ' + none + ' to no entry, ' + relatedNone + ' related to no entry');
} else if (base) console.log('ratchet held: ' + base.resolved + ' resolved, ' + base.noEntry + ' to no entry, ' + base.relatedNoEntry + ' related to no entry (' + base.at + ')');

console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
