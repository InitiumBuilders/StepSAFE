/* What a file pulls in before anything can render: walk the static imports (not import()) from an entry and
   report every content module reached, with its source size and the shortest chain that brings it in.
     node scripts/graph.mjs [entry=src/bootApp.tsx] [--why=<substring>] */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const entry = resolve(root, process.argv.find(a => !a.startsWith('--') && a.endsWith('.tsx') || a.endsWith('.ts')) || 'src/bootApp.tsx');
const why = (process.argv.find(a => a.startsWith('--why=')) || '').slice(6);

const exts = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];
function resolveImport(from, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const e of exts) { const p = base + e; if (existsSync(p) && statSync(p).isFile()) return p; }
  return null;
}
/* static imports and re-exports; type-only imports are erased at build time, so they do not count */
const RE = /(?:^|\n)\s*(import|export)\s+(type\s+)?(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;
const seen = new Map([[entry, null]]);
const queue = [entry];
while (queue.length) {
  const f = queue.shift();
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(RE)) {
    if (m[2]) continue;
    if (/\.css$/.test(m[3])) continue;
    const to = resolveImport(f, m[3]);
    if (!to || seen.has(to)) continue;
    seen.set(to, f);
    queue.push(to);
  }
}
const rel = p => relative(root, p).replace(/\\/g, '/');
const chain = p => { const out = []; for (let x = p; x; x = seen.get(x)) out.unshift(rel(x)); return out.join(' > '); };
const files = [...seen.keys()];
const content = files.filter(f => rel(f).startsWith('src/content/'));
const kb = f => statSync(f).size / 1024;
const total = files.reduce((n, f) => n + kb(f), 0), ctotal = content.reduce((n, f) => n + kb(f), 0);
console.log(rel(entry) + ': ' + files.length + ' modules, ' + total.toFixed(0) + ' KB of source; content ' + content.length + ' modules, ' + ctotal.toFixed(0) + ' KB');
const groups = {};
for (const f of content) { const g = rel(f).replace(/^src\/content\/([^/]+)(\/.*)?$/, '$1').replace(/\.tsx?$/, ''); groups[g] = (groups[g] || 0) + kb(f); }
for (const [g, n] of Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log('  ' + n.toFixed(0).padStart(6) + ' KB  ' + g);
if (why) for (const f of files.filter(f => rel(f).includes(why)).slice(0, 6)) console.log('why ' + rel(f) + ':\n  ' + chain(f));
if (process.argv.includes('--list')) for (const f of files.filter(f => !rel(f).startsWith('src/content/')).sort()) console.log('  ' + rel(f));
