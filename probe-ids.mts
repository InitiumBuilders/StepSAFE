/* Id coherence audit for the whole product.
   Run: npx tsx probe-ids.mts
   Checks that every award a Step, simulation, hook or the engine grants exists,
   that every award can be reached, that unit members and counsel resolve, and
   that every glossary link resolves to a term or a ranked lookup. */

import { readFileSync } from 'fs';
import {
  CHAPTERS, ALL_CHAPTERS, AWARDS, SIMS, UNIT, TERMS, GUIDES, HOOKS, resolveTerm,
} from './src/content/index';
import { COUNSEL_AUTHORED } from './src/content/counsel/index';
import { MODUX_MODELS } from './src/content/modux/index';
import { MILESTONES } from './src/content/wiring';

const awardIds = new Set(AWARDS.map(a => a.id));
const memberIds = new Set(UNIT.map(u => u.id));
const problems: string[] = [];
const granted = new Set<string>();

/* 1. what grants each award */
for (const c of ALL_CHAPTERS) for (const p of c.pages) for (const st of p.steps)
  for (const a of st.awards || []) { granted.add(a); if (!awardIds.has(a)) problems.push('step ' + st.id + ' grants missing award ' + a); }
for (const m of SIMS) for (const a of m.awards || []) { granted.add(a); if (!awardIds.has(a)) problems.push('sim ' + m.id + ' grants missing award ' + a); }
for (const h of HOOKS) for (const a of h.awards) { granted.add(a); if (!awardIds.has(a)) problems.push('hook ' + h.trigger + ' grants missing award ' + a); }
for (const k of Object.keys(MILESTONES)) for (const a of MILESTONES[k]) { granted.add(a); if (!awardIds.has(a)) problems.push('milestone ' + k + ' grants missing award ' + a); }

/* grants written directly in the engine, including the per-course prefix */
const engine = readFileSync('./src/lib/engine.tsx', 'utf8');
for (const m of engine.matchAll(/grant\('([a-z0-9-]+)'\)/g)) { granted.add(m[1]); if (!awardIds.has(m[1])) problems.push('engine grants missing award ' + m[1]); }
if (engine.includes("grant('strong-mx-course-' + chapter.id)"))
  for (const c of ALL_CHAPTERS) if (c.id.startsWith('mx-')) {
    const id = 'strong-mx-course-' + c.id;
    granted.add(id);
    if (!awardIds.has(id)) problems.push('engine course award missing: ' + id);
  }

/* the checks before launch: the engine grants two milestones per check by its kind */
if (engine.includes("grant('small-' + kind + '-check'") && engine.includes("grant('strong-' + kind + '-held'")) {
  const { CHECKS } = await import('./src/content/check/index');
  for (const k of CHECKS) for (const id of ['small-' + k.id + '-check', 'strong-' + k.id + '-held']) {
    granted.add(id);
    if (!awardIds.has(id)) problems.push('engine check milestone missing: ' + id);
  }
}

const unreachable = AWARDS.filter(a => !granted.has(a.id)).map(a => a.id);

/* 2. unit and counsel */
for (const c of CHAPTERS) if (c.unitUnlock && !memberIds.has(c.unitUnlock)) problems.push('chapter ' + c.id + ' unlocks missing member ' + c.unitUnlock);
for (const m of SIMS) for (const r of m.roles) if (!memberIds.has(r)) problems.push('sim ' + m.id + ' role missing ' + r);
const decisions = new Set<string>();
for (const m of SIMS) for (const inj of m.injects) if (inj.decision) decisions.add(m.id + '::' + inj.decision.id);
let counselOrphans = 0;
for (const c of COUNSEL_AUTHORED) {
  if (!decisions.has(c.simId + '::' + c.decisionId)) counselOrphans++;
  for (const v of c.voices) if (!memberIds.has(v.member)) problems.push('counsel voice missing member ' + v.member);
}
if (counselOrphans) problems.push(counselOrphans + ' counsel entries match no decision');

/* 3. glossary links: each reaches the entry for that concept, or is counted as a word with no entry. The
   resolver no longer guesses a nearest entry, so there is no "lookup" count; probe-terms.mts holds these numbers
   in a ratchet and prints what the corpus says about the words with no entry. */
let links = 0, exact = 0;
const moduxText = MODUX_MODELS.map(m => (m.name + ' ' + m.statement + ' ' + m.tags.join(' ') + ' ' + m.defeats.join(' ')).toLowerCase());
let moduxTags = 0, moduxDead = 0;
for (const c of ALL_CHAPTERS) for (const p of c.pages) for (const st of p.steps) for (const g of st.glossary || []) {
  /* Modux tags open a catalog search, so they must match at least one model */
  if (st.id.includes('--mm-')) { moduxTags++; if (!moduxText.some(t => t.includes(g.toLowerCase()))) moduxDead++; continue; }
  links++;
  if (resolveTerm(g).term) exact++;
}

/* 4. each glossary term and each guide appears once. StepGuides keys its cards
   on the id, so a repeated id logs a React key warning. */
const termIds = new Set<string>(), termNames = new Set<string>();
for (const t of TERMS) {
  if (termIds.has(t.id)) problems.push('duplicate glossary term id ' + t.id);
  if (termNames.has(t.term.toLowerCase())) problems.push('duplicate glossary term name ' + t.term);
  termIds.add(t.id); termNames.add(t.term.toLowerCase());
}
const guideIds = new Set<string>();
for (const g of GUIDES) {
  if (guideIds.has(g.id)) problems.push('duplicate guide id ' + g.id);
  guideIds.add(g.id);
}

console.log('awards: ' + AWARDS.length + ' defined, ' + granted.size + ' granted somewhere');
console.log('UNREACHABLE awards: ' + unreachable.length + (unreachable.length ? ' -> ' + unreachable.slice(0, 12).join(', ') : ''));
console.log('unit members: ' + UNIT.length + ' | counsel entries: ' + COUNSEL_AUTHORED.length + ' over ' + decisions.size + ' decisions');
console.log('glossary links: ' + links + ' | to an entry ' + exact + ' | to no entry ' + (links - exact) + ' | terms ' + TERMS.length);
console.log('modux tag links: ' + moduxTags + ' | dead ' + moduxDead);
console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems.slice(0, 30)) console.log('  ' + p);
process.exitCode = problems.length || unreachable.length || moduxDead ? 1 : 0;
