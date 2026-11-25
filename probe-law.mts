/* PROBE: the law as written. Every article of GDPR, NIS2, DORA or the EU AI Act that the course cites by number has
   been read at the source and recorded in docs/LEGAL-READINGS.md, whose "Read:" line lists the articles read. A
   citation of an article missing from that line fails here, so a claim about the law cannot enter the course on its
   own word. Written 2026-11-25, after the NIS2 Step turned out to have Article 20 wrong in two ways.

   It reads the source files as text. A citation is a law's name followed by "Article N" ("GDPR Article 33", "the AI
   Act's Article 14", "NIS2 Directive Article 23", "(GDPR), Articles 4(7) and 33"), or "Article N of the GDPR".
   Ranges and lists count every article in them. A bare "Article 33(4)" with no law beside it is not counted.
   Run: npx tsx probe-law.mts */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.env.SS_ROOT || '.';

const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(n) ? [p] : [];
});

/* one article number (none of the four laws has more than 113), with its paragraphs, and not a year or a count of
   hours, days or months */
const ONE = String.raw`\d{1,3}(?![0-9])(?:\([0-9a-z]+\))*(?!\s*(?:hours?|days?|months?|years?|h)\b)`;
const LIST = ONE + String.raw`(?:(?:,\s*|\s+and\s+|\s+to\s+)` + ONE + ')*';
const LAW = String.raw`(GDPR|NIS2|DORA|AI Act)`;
const AFTER = new RegExp(LAW + String.raw`(?:'s)?\)?,?\s+(?:Directive,?\s+)?Articles?\s+(` + LIST + ')', 'g');
const BEFORE = new RegExp(String.raw`Articles?\s+(` + LIST + String.raw`)\s+of\s+(?:the\s+)?(?:EU\s+)?` + LAW, 'g');

function expand(list: string): number[] {
  const out: number[] = [];
  for (const part of list.replace(/\([0-9a-z]+\)/g, '').split(/,\s*|\s+and\s+/)) {
    const range = /^(\d+)\s+to\s+(\d+)$/.exec(part.trim());
    if (range) { for (let n = +range[1]; n <= +range[2]; n++) out.push(n); continue; }
    const n = parseInt(part, 10);
    if (!Number.isNaN(n)) out.push(n);
  }
  return out;
}

/* the articles read, from the last "Read:" line of the readings */
const doc = readFileSync(join(ROOT, 'docs/LEGAL-READINGS.md'), 'utf8');
const readLine = doc.split('\n').filter((l) => l.startsWith('Read: ')).pop();
const problems: string[] = [];
if (!readLine) problems.push('docs/LEGAL-READINGS.md has no "Read:" line');
const read = new Set<string>();
for (const seg of (readLine || '').slice(6).split(';')) {
  const m = /^\s*(GDPR|NIS2|DORA|AI Act)\s+(.+?)\s*$/.exec(seg);
  if (!m) { if (seg.trim()) problems.push('the "Read:" line has a part it cannot read: ' + seg.trim()); continue; }
  for (const n of expand(m[2])) read.add(m[1] + ' ' + n);
}

/* every citation in the course */
const cited = new Map<string, string[]>();
let count = 0;
for (const file of walk(join(ROOT, 'src'))) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const hits: [string, string][] = [];
    for (const m of line.matchAll(AFTER)) hits.push([m[1], m[2]]);
    for (const m of line.matchAll(BEFORE)) hits.push([m[2], m[1]]);
    for (const [law, list] of hits) {
      for (const n of expand(list)) {
        count++;
        const key = law + ' ' + n;
        const at = relative(ROOT, file).replace(/\\/g, '/') + ':' + (i + 1);
        if (!cited.has(key)) cited.set(key, []);
        cited.get(key)!.push(at);
      }
    }
  });
}

const order = (a: string, b: string) => a.split(' ').slice(0, -1).join(' ').localeCompare(b.split(' ').slice(0, -1).join(' ')) || +a.split(' ').pop()! - +b.split(' ').pop()!;
const keys = [...cited.keys()].sort(order);
console.log('citations ' + count + ' | articles cited ' + keys.length + ' | articles read ' + read.size);
console.log('cited: ' + keys.map((k) => k + ' (' + cited.get(k)!.length + ')').join(', '));
for (const k of keys) if (!read.has(k)) problems.push('unread: ' + k + ' cited at ' + cited.get(k)!.slice(0, 3).join(', ') + (cited.get(k)!.length > 3 ? ' and ' + (cited.get(k)!.length - 3) + ' more' : ''));
const idle = [...read].filter((k) => !cited.has(k)).sort(order);
if (idle.length) console.log('read and not cited by number (fine): ' + idle.join(', '));
for (const p of problems) console.log('FAIL ' + p);
console.log('PROBLEMS (' + problems.length + ')');
process.exit(problems.length ? 1 : 0);
