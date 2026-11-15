/* The subjects, held whole. Every glossary term, StepGuide, catalog structure, Step, threat, stack, room and public
   incident has exactly one of the eleven subjects (src/content/subjects.ts); every mapping names something that
   exists; every subject holds terms; and the glossary offers the eleven subjects and no chip per domain. Prints the table.
   Run: npx tsx probe-subjects.mts */
(globalThis as any).self = globalThis;
import { readFileSync } from 'node:fs';
const C: any = await import('./src/content/index');
const R: any = await import('./src/content/registry');
await R.loadContent();
const SH = await import('./src/content/subjects');
const { deck } = await import('./src/lib/study/cards');
const { FAMILY_LABEL } = await import('./src/content/modux-schema');

const problems: string[] = [];
const bad = (m: string) => problems.push(m);
const ids = new Set(SH.SUBJECTS.map(s => s.id));
if (SH.SUBJECTS.length !== 11 || ids.size !== 11) bad('there should be eleven subjects, each with its own id');

/* every source of a subject maps somewhere real */
const termDomains = new Set((C.TERMS as any[]).map(t => t.domain));
for (const d of termDomains) if (!SH.TERM_SUBJECT[d]) bad('a glossary domain with no subject: ' + d);
for (const [d, s] of Object.entries(SH.TERM_SUBJECT)) { if (!termDomains.has(d)) bad('TERM_SUBJECT names a domain no term uses: ' + d); if (!ids.has(s)) bad('TERM_SUBJECT names no subject: ' + s); }
for (const id of Object.keys(SH.TERM_OVERRIDE)) if (!(C.TERMS as any[]).some(t => t.id === id)) bad('TERM_OVERRIDE names a term that does not exist: ' + id);
const guideDomains = new Set((C.GUIDES as any[]).map(g => g.domain));
for (const d of guideDomains) if (!SH.GUIDE_SUBJECT[d]) bad('a StepGuide domain with no subject: ' + d);
for (const d of Object.keys(SH.GUIDE_SUBJECT)) if (!guideDomains.has(d)) bad('GUIDE_SUBJECT names a domain no guide uses: ' + d);
for (const label of Object.values(FAMILY_LABEL)) if (!SH.MODEL_SUBJECT[label as string]) bad('a catalog family with no subject: ' + label);
for (const c of C.ALL_CHAPTERS as any[]) if (!SH.CHAPTER_SUBJECT[c.id]) bad('a chapter with no subject: ' + c.id);

/* every card in the deck has one */
const cards = deck();
const none = cards.filter(c => !c.subject);
if (none.length) bad(none.length + ' cards have no subject, the first: ' + none.slice(0, 5).map(c => c.id).join(', '));

/* the table */
const kinds = ['term', 'guide', 'model', 'step', 'threat', 'stack', 'room', 'incident'];
console.log('subject'.padEnd(30) + kinds.map(k => k.slice(0, 6).padStart(7)).join('') + '   all');
for (const s of SH.SUBJECTS) {
  const row = kinds.map(k => cards.filter(c => c.kind === k && c.subject === s.id).length);
  const terms = row[0];
  if (!terms) bad('a subject with no glossary term: ' + s.name);
  console.log(s.name.padEnd(30) + row.map(n => String(n).padStart(7)).join('') + String(row.reduce((a, b) => a + b, 0)).padStart(6));
}

/* the glossary shows subjects, and no longer renders one chip per domain */
const view = readFileSync('src/views/GuidesView.tsx', 'utf8');
if (!/SUBJECTS/.test(view)) bad('the glossary does not offer the subjects');
if (/TERMS\.map\(t => t\.domain\)/.test(view)) bad('the glossary still builds a chip for every term domain');

console.log('terms ' + C.TERMS.length + ' over ' + termDomains.size + ' domains in ' + SH.SUBJECTS.length + ' subjects | cards ' + cards.length);
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
