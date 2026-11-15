/* Modux audit: ids, links, drills, coverage, encoding and wording.
   Run: npx tsx probe-modux.mts */
import { readFileSync, readdirSync } from 'fs';
import { CATALOG, CATALOG_IDS } from './src/content/modux/catalog';
import { STACKS } from './src/content/modux/stacks';
import { COURSES } from './src/content/modux/courses';
import { MODUX_MODELS } from './src/content/modux/index';

const problems: string[] = [];
const warn: string[] = [];
const p = (s: string) => problems.push(s);

/* 1. catalog fidelity */
const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
for (const m of MODUX_MODELS) {
  const e = CATALOG.find(c => c.id === m.id);
  if (!e) { p('not in catalog: ' + m.id); continue; }
  if (e.name !== m.name) p('name drift ' + m.id + ': "' + m.name + '" vs catalog "' + e.name + '"');
  if (e.family !== m.family) p('family drift ' + m.id);
  if (e.tier !== m.tier) p('tier drift ' + m.id + ': ' + m.tier + ' vs ' + e.tier);
}
const perFamily: Record<string, number> = {};
for (const e of CATALOG) perFamily[e.family] = (perFamily[e.family] || 0) + (byId.has(e.id) ? 1 : 0);

/* 2. links */
let links = 0, broken = 0;
for (const m of MODUX_MODELS) {
  for (const c of [...m.combines, ...(m.conflicts || [])]) {
    links++;
    if (!CATALOG_IDS.has(c.model)) { broken++; p('broken link in ' + m.id + ' -> ' + c.model); }
    if (c.model === m.id) p('self link ' + m.id);
  }
  if (m.combines.length < 3) warn.push(m.id + ' has only ' + m.combines.length + ' combines');
}

/* 3. drills */
for (const m of MODUX_MODELS) {
  if (!m.drill) { warn.push('no drill: ' + m.id); continue; }
  const d = m.drill;
  if (d.options.length !== 4) p('drill options != 4: ' + m.id);
  const best = d.options.filter(o => o.isBest).length;
  if (best !== 1) p('drill isBest count ' + best + ': ' + m.id);
  const ids = new Set(d.options.map(o => o.id));
  if (ids.size !== d.options.length) p('duplicate option ids: ' + m.id);
  for (const o of d.options) if (o.score < -3 || o.score > 3) p('score out of range in ' + m.id);
  if (!d.debrief || !d.principle || !d.prompt || !d.scene) p('drill missing text: ' + m.id);
}

/* 4. required fields and ranges */
for (const m of MODUX_MODELS) {
  for (const k of ['statement', 'origin', 'structure', 'systemsLens', 'underStress', 'adoption'] as const)
    if (!m[k] || m[k].trim().length < 20) p('thin field ' + k + ': ' + m.id);
  if (m.components.length < 3) p('few components: ' + m.id);
  if (m.evidence.length < 2) p('few evidence: ' + m.id);
  if (m.signals.length < 3) p('few signals: ' + m.id);
  if (m.minutes < 10 || m.minutes > 40) warn.push('minutes odd: ' + m.id + ' ' + m.minutes);
}

/* 5. stacks and courses */
for (const s of STACKS) for (const id of s.models) if (!CATALOG_IDS.has(id)) p('stack ' + s.id + ' bad id ' + id);
const covered = new Set<string>();
for (const c of COURSES) for (const pg of c.pages) for (const id of pg.models) {
  if (!CATALOG_IDS.has(id)) p('course ' + c.id + ' bad id ' + id);
  covered.add(id);
}
const uncovered = CATALOG.filter(e => !covered.has(e.id)).map(e => e.id);
if (uncovered.length) p('catalog ids not taught in any course: ' + uncovered.join(', '));

/* 6. encoding and wording, over the raw files */
const dir = './src/content/modux/';
const files = ['stacks.ts', 'courses.ts', ...readdirSync(dir + 'models').map(f => 'models/' + f)];
const BANNED = /\b(crucial|robust|landscape|delve|pivotal|testament|tapestry|underscore[sd]?|showcas(e|es|ing)|seamless|vibrant|meticulous(ly)?)\b/gi;
const NOTBUT = /\bnot (just |only |merely )?[^.;:]{3,80}\bbut\b/gi;
const MOJI = /Â|â€|âœ|âŒ|â‹|âˆ|Ã/;
for (const f of files) {
  const raw = readFileSync(dir + f);
  const bom = raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf;
  const s = raw.toString('utf8');
  if (bom) p('BOM: ' + f);
  if (MOJI.test(s)) p('mojibake: ' + f);
  const dashes = (s.match(/[–—]/g) || []).length;
  const banned = (s.match(BANNED) || []).length;
  const notbut = (s.match(NOTBUT) || []).length;
  if (dashes) warn.push(f + ': ' + dashes + ' em/en dashes');
  if (banned) warn.push(f + ': ' + banned + ' banned words: ' + [...new Set((s.match(BANNED) || []).map(x => x.toLowerCase()))].join(','));
  if (notbut) warn.push(f + ': ' + notbut + ' "not X but Y" shapes');
  if (/`/.test(s)) p('backtick in ' + f);
}

console.log('models: ' + MODUX_MODELS.length + '/' + CATALOG.length);
console.log('per family: ' + Object.entries(perFamily).map(([k, v]) => k + '=' + v).join(' '));
console.log('links: ' + links + ' broken: ' + broken);
console.log('stacks: ' + STACKS.length + ' courses: ' + COURSES.length + ' pages: ' + COURSES.reduce((n, c) => n + c.pages.length, 0));
console.log('\nPROBLEMS (' + problems.length + ')');
for (const x of problems) console.log('  ' + x);
console.log('\nWARNINGS (' + warn.length + ')');
for (const x of warn) console.log('  ' + x);
process.exitCode = problems.length ? 1 : 0;
