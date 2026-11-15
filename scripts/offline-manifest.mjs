/* After a build: list every file the Praxis needs to open with no signal,
   so the service worker can keep them all on request. Writes
   dist/offline-manifest.json. Run: node scripts/offline-manifest.mjs */
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
if (!existsSync(dist)) { console.error('no dist to list'); process.exit(1); }
const files = ['/'];
const walk = (dir, base) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    const rel = base + '/' + e.name;
    if (e.isDirectory()) { walk(p, rel); continue; }
    if (/\.(js|css|png|webmanifest|json|woff2)$/.test(e.name) && !/offline-manifest\.json$/.test(e.name)) files.push(rel.replace(/\\/g, '/'));
  }
};
walk(join(dist, 'assets'), '/assets');
walk(join(dist, 'icons'), '/icons');
if (existsSync(join(dist, 'schema'))) walk(join(dist, 'schema'), '/schema');
files.push('/manifest.webmanifest');
const bytes = files.filter(f => f !== '/').reduce((n, f) => n + statSync(join(dist, f)).size, 0);
writeFileSync(join(dist, 'offline-manifest.json'), JSON.stringify({ at: new Date().toISOString(), files, bytes }, null, 0));
console.log('offline manifest: ' + files.length + ' files, ' + (bytes / 1048576).toFixed(1) + ' MB');
