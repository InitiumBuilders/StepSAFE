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
/* the model emoji (content/modux/emoji.ts): one for every model and family, all distinct, each drawn in colour as
   written, one character with no joined sequence, and nothing newer than Emoji 13, so five-year-old devices draw them */
{
  const E = await import('./src/content/modux/emoji');
  const famKeys = Object.keys(E.FAMILY_EMOJI);
  for (const m of MODUX_MODELS) if (!E.MODEL_EMOJI[m.id]) p('emoji: ' + m.id + ' has none');
  for (const id of Object.keys(E.MODEL_EMOJI)) if (!MODUX_MODELS.some(m => m.id === id)) p('emoji: ' + id + ' names no model');
  for (const f of new Set(MODUX_MODELS.map(m => m.family))) if (!famKeys.includes(f)) p('emoji: the family ' + f + ' has none');
  const all = [...Object.values(E.MODEL_EMOJI), ...Object.values(E.FAMILY_EMOJI)].map((x: any) => x.e as string);
  const bare = (x: string) => x.replace(/️/g, '');
  const seen = new Set<string>();
  for (const e of all) { if (seen.has(bare(e))) p('emoji: ' + e + ' is used twice'); seen.add(bare(e)); }
  const NEW = (cp: number) => (cp >= 0x1FA7B && cp <= 0x1FA7F) || (cp >= 0x1FAA9 && cp <= 0x1FAAF) || (cp >= 0x1FAB7 && cp <= 0x1FABF) || (cp >= 0x1FAC3 && cp <= 0x1FACF) || (cp >= 0x1FAD7 && cp <= 0x1FAFF) || (cp >= 0x1F6DD && cp <= 0x1F6DF) || cp === 0x1F7F0;
  for (const e of all) {
    const cps = [...e].map(c => c.codePointAt(0)!);
    if (cps.includes(0x200D)) p('emoji: ' + e + ' is a joined sequence');
    if (cps.some(NEW)) p('emoji: ' + e + ' is newer than Emoji 13');
    if (!(/^\p{Emoji_Presentation}$/u.test(e) || /^\p{Extended_Pictographic}️$/u.test(e))) p('emoji: ' + e + ' is not drawn in colour as written (U+' + cps.map(c => c.toString(16)).join(' U+') + ')');
  }
  for (const [id, x] of Object.entries(E.MODEL_EMOJI) as [string, any][]) if (!/^[A-Z].{20,110}\.$/.test(x.why)) p('emoji: the reason for ' + id + ' is not one sentence of 20 to 110 characters');
  if (E.modelByEmoji('🛁') !== 'mm-systems-stock-and-flow' || E.modelByEmoji('⚖') !== 'mm-chain-credible-neutrality' || E.modelByEmoji('⚖️') !== 'mm-chain-credible-neutrality' || E.modelByEmoji('hello') !== null) p('emoji: finding a model by its emoji, with or without the colour selector, is off');
  /* the structure of the day (Ground): every model once in a cycle of the catalog's length, a new family each day */
  {
    const n = MODUX_MODELS.length, days: string[] = [], fams: string[] = [];
    for (let i = 0; i < n; i++) { const m = E.modelOfTheDay(MODUX_MODELS, new Date(2026, 0, 1 + i)); days.push(m?.id || ''); fams.push(m?.family || ''); }
    if (new Set(days).size !== n) p('the structure of the day repeats within ' + n + ' days: ' + new Set(days).size + ' distinct');
    if (fams.some((f, i) => i > 0 && f === fams[i - 1])) p('the structure of the day stays in one family two days running');
    const a = E.modelOfTheDay(MODUX_MODELS, new Date(2026, 10, 16, 1)), b = E.modelOfTheDay(MODUX_MODELS, new Date(2026, 10, 16, 23));
    if (!a || a.id !== b?.id) p('the structure of the day changes within one day');
  }
  console.log('emoji: ' + Object.keys(E.MODEL_EMOJI).length + ' models, ' + famKeys.length + ' families, ' + seen.size + ' distinct');
}
console.log('per family: ' + Object.entries(perFamily).map(([k, v]) => k + '=' + v).join(' '));
console.log('links: ' + links + ' broken: ' + broken);
console.log('stacks: ' + STACKS.length + ' courses: ' + COURSES.length + ' pages: ' + COURSES.reduce((n, c) => n + c.pages.length, 0));
console.log('\nPROBLEMS (' + problems.length + ')');
for (const x of problems) console.log('  ' + x);
console.log('\nWARNINGS (' + warn.length + ')');
for (const x of warn) console.log('  ' + x);
process.exitCode = problems.length ? 1 : 0;
