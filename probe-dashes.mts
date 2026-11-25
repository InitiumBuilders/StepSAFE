/* PROBE: the voice ratchet. The course text still carries the dashes of its first authoring (counted on 2026-11-25).
   The house voice uses none: a period, a comma, a colon or parentheses instead. docs/VOICE-RATCHET.json holds the
   count for each part of the course. A count may fall and never rise, and the file tightens itself when the text
   improves, so no new sentence adds a dash while the old ones are rewritten, part by part, each sentence read.
   Modux has almost none, because probe-modux bans the long dash there.
   If a new dash is inside August's own words, which stay exactly as he wrote them, raise that part's count in the
   file by hand and say so in the commit.
   Run: npx tsx probe-dashes.mts */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.env.SS_ROOT || '.';
const TODAY = new Date().toISOString().slice(0, 10);
const RATCHET = join(ROOT, 'docs/VOICE-RATCHET.json');
const DASH = /[–—]/g;

const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(n) ? [p] : [];
});
const partOf = (rel: string): string => {
  if (rel.startsWith('chapters/')) return 'chapters';
  if (rel.startsWith('practice/')) return 'practice';
  if (rel.startsWith('modux/')) return 'modux';
  if (rel.startsWith('awards/') || rel === 'awards.ts') return 'awards';
  if (/^guides[^/]*\.ts$/.test(rel)) return 'guides';
  if (/^glossary[^/]*\.ts$/.test(rel)) return 'glossary';
  return 'other';
};

const counts: Record<string, number> = {};
const where: Record<string, Record<string, number>> = {};
const base = join(ROOT, 'src/content');
for (const file of walk(base)) {
  const rel = relative(base, file).replace(/\\/g, '/');
  const n = (readFileSync(file, 'utf8').match(DASH) || []).length;
  const part = partOf(rel);
  counts[part] = (counts[part] || 0) + n;
  if (n) (where[part] ||= {})[rel] = n;
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);
const parts = Object.keys(counts).sort();
console.log('dashes in the course text: ' + total + ' | ' + parts.map((p) => p + ' ' + counts[p]).join(', '));

const problems: string[] = [];
const held = existsSync(RATCHET) ? JSON.parse(readFileSync(RATCHET, 'utf8')) : null;
if (held) {
  for (const p of parts) {
    const was = held.parts?.[p] ?? 0;
    if (counts[p] > was) {
      const files = Object.entries(where[p] || {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([f, n]) => f + ' (' + n + ')').join(', ');
      problems.push('the ratchet: ' + p + ' has ' + counts[p] + ' dashes, more than the ' + was + ' held on ' + held.at + '. A new sentence added one: use a period, a comma, a colon or parentheses. Most are in ' + files + '.');
    }
  }
}
if (!problems.length && (!held || parts.some((p) => counts[p] < (held.parts?.[p] ?? 0)) || Object.keys(held.parts || {}).some((p) => !(p in counts)))) {
  writeFileSync(RATCHET, JSON.stringify({ at: TODAY, total, parts: Object.fromEntries(parts.map((p) => [p, counts[p]])) }, null, 2) + '\n', 'utf8');
  console.log('ratchet ' + (held ? 'moved' : 'set') + ': ' + total + ' dashes');
} else if (held) console.log('ratchet held: ' + held.total + ' dashes (' + held.at + ')');

for (const p of problems) console.log('FAIL ' + p);
console.log('PROBLEMS (' + problems.length + ')');
process.exit(problems.length ? 1 : 0);
