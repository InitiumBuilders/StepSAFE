/* KNOWN FLAWS IN WHAT SHIPS, before a release. Reads public/sbom.cdx.json, the packages StepSAFE ships to a browser,
   and asks OSV.dev, the open database of known flaws in open-source packages, about each one in a single question.
   The question carries package names and versions, which are public, and nothing else.
     node scripts/vulns.mjs     exit 0 when no package has a known flaw, 1 when one does, 2 when OSV.dev cannot answer
   scripts/ship.sh runs it and refuses to ship on 1 or 2. StepSAFE's own record (#/trust) asks the same question
   from a visitor's browser. */
import { readFileSync } from 'node:fs';

const bom = JSON.parse(readFileSync('public/sbom.cdx.json', 'utf8'));
/* npm packages only: OSV.dev keeps no record of font files, which the bill of materials lists too */
const parts = (bom.components || []).filter((c) => c && c.name && c.version && String(c.purl || '').startsWith('pkg:npm/')).map((c) => ({ name: c.name, version: c.version }));
if (!parts.length) { console.error('vulns: the bill of materials lists no package'); process.exit(2); }

const body = { queries: parts.map((p) => ({ package: { ecosystem: 'npm', name: p.name }, version: p.version })) };
let json;
try {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  const r = await fetch('https://api.osv.dev/v1/querybatch', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
  clearTimeout(t);
  if (!r.ok) throw new Error('OSV.dev answered ' + r.status);
  json = await r.json();
} catch (e) {
  console.error('vulns: OSV.dev could not be asked (' + (e && e.message ? e.message : e) + '). Try again; a release waits for an answer.');
  process.exit(2);
}
const results = Array.isArray(json.results) ? json.results : [];
if (results.length !== parts.length) { console.error('vulns: OSV.dev answered for ' + results.length + ' of ' + parts.length + ' packages'); process.exit(2); }

const flawed = parts.map((p, i) => ({ ...p, ids: (results[i].vulns || []).map((v) => v.id) })).filter((p) => p.ids.length);
for (const p of flawed) console.log('FLAW ' + p.name + ' ' + p.version + ': ' + p.ids.join(', ') + '  (https://osv.dev/vulnerability/' + p.ids[0] + ')');
console.log('vulns: ' + parts.length + ' packages asked of OSV.dev, ' + (flawed.length ? flawed.length + ' with known flaws' : 'no known flaw in any'));
process.exit(flawed.length ? 1 : 0);
