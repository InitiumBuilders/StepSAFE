/* THE SOFTWARE BILL OF MATERIALS. Everything StepSAFE ships to a browser that it did not write: the npm packages,
   read from package-lock.json, and the font files in src/styles/fonts. Written as CycloneDX 1.5 JSON to
   public/sbom.cdx.json, so the live site serves it at /sbom.cdx.json. A US federal buyer asks for one (Executive Order
   14028). It carries NTIA's minimum elements: for each component a supplier, the name, the version and a unique id
   (its purl), the relationships between them, and who wrote the list and when.
   Development tools are left out: they never reach a browser.
   A package's supplier is its author when its package.json names one, or else the owner of its GitHub repository; a
   font's is Google Fonts, which served the file.
   The time is the moment the list was first written, and it stays until the list itself changes, so the same
   lockfile always gives the same file and probe-trust.mts can say whether the served list is the lockfile's.
     node scripts/sbom.mjs          write it
     node scripts/sbom.mjs --check  exit 1 when the written file differs from what the lockfile gives */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
if (!lock.packages) { console.error('package-lock.json has no "packages" map (lockfile version 2 or 3 is needed)'); process.exit(2); }

const purl = (name, version) => 'pkg:npm/' + (name.startsWith('@') ? '%40' + name.slice(1) : name) + '@' + version;
const hexOf = (integrity) => {
  const m = /^sha512-(.+)$/.exec(String(integrity || '').split(' ')[0]);
  return m ? Buffer.from(m[1], 'base64').toString('hex') : null;
};
/* a repository field as an https address: "owner/name", "git://github.com/owner/name.git" and "git+https://..." all
   become https://github.com/owner/name (only a trailing .git is dropped: three.js keeps its .js) */
const repoUrl = (repo) => {
  const raw = typeof repo === 'string' ? repo : repo && repo.url;
  if (!raw) return null;
  if (/^[\w.-]+\/[\w.-]+$/.test(raw)) return 'https://github.com/' + raw;
  const m = /github\.com[/:]([\w.-]+)\/([\w.-]+?)(\.git)?$/.exec(raw);
  return m ? 'https://github.com/' + m[1] + '/' + m[2] : null;
};
const authorName = (a) => {
  const s = typeof a === 'string' ? a : a && a.name;
  return s ? s.replace(/<[^>]*>/g, '').replace(/\([^)]*\)/g, '').trim() || null : null;
};

const missing = [];
const components = [];
for (const [path, e] of Object.entries(lock.packages)) {
  if (!path || e.dev || e.devOptional || e.link) continue;
  const name = path.split('node_modules/').pop();
  const c = { type: 'library', 'bom-ref': purl(name, e.version), name, version: e.version, purl: purl(name, e.version) };
  let meta = null;
  try { meta = JSON.parse(readFileSync(path + '/package.json', 'utf8')); } catch { missing.push(name); }
  const repo = meta && repoUrl(meta.repository);
  const who = meta && (authorName(meta.author) || (repo ? repo.split('/')[3] : null));
  if (who) c.supplier = repo ? { name: who, url: [repo] } : { name: who };
  else missing.push(name + ' (no author and no repository)');
  const h = hexOf(e.integrity);
  if (h) c.hashes = [{ alg: 'SHA-512', content: h }];
  if (e.license) c.licenses = [{ license: { id: e.license } }];
  const refs = [];
  if (repo) refs.push({ type: 'vcs', url: repo });
  if (meta && /^https:\/\//.test(meta.homepage || '')) refs.push({ type: 'website', url: meta.homepage });
  if (refs.length) c.externalReferences = refs;
  components.push(c);
}
/* the typefaces, served from this site since 2026-11-14: each Latin file as Google Fonts served it (src/styles/fonts).
   The version is Google Fonts' own for the family, from the address the file came from. */
const FONTS = [
  ['outfit-latin.woff2', 'Outfit', 'v15', 'https://fonts.gstatic.com/s/outfit/v15/QGYvz_MVcBeNP4NJtEtq.woff2'],
  ['hanken-grotesk-latin.woff2', 'Hanken Grotesk', 'v12', 'https://fonts.gstatic.com/s/hankengrotesk/v12/ieVn2YZDLWuGJpnzaiwFXS9tYtpd59A.woff2'],
  ['inter-latin.woff2', 'Inter', 'v20', 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2'],
  ['sora-latin.woff2', 'Sora', 'v17', 'https://fonts.gstatic.com/s/sora/v17/xMQ9uFFYT72X5wkB_18qmnndmSdSnh2BAfO5mnuyOo1lfiQwV6-x.woff2'],
  ['ibm-plex-mono-latin-400.woff2', 'IBM Plex Mono 400', 'v23', 'https://fonts.gstatic.com/s/ibmplexmono/v23/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2'],
  ['ibm-plex-mono-latin-500.woff2', 'IBM Plex Mono 500', 'v23', 'https://fonts.gstatic.com/s/ibmplexmono/v23/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgg.woff2'],
  ['ibm-plex-mono-latin-600.woff2', 'IBM Plex Mono 600', 'v23', 'https://fonts.gstatic.com/s/ibmplexmono/v23/-F6qfjptAgt5VM-kVkqdyU8n3vAOwlBFgg.woff2'],
];
for (const [file, name, version, url] of FONTS) {
  const path = 'src/styles/fonts/' + file;
  if (!existsSync(path)) { missing.push(file + ' (the font file is not in src/styles/fonts)'); continue; }
  const ref = 'pkg:generic/' + name.toLowerCase().replace(/ /g, '-') + '@' + version + '?download_url=' + encodeURIComponent(url);
  components.push({
    type: 'file', 'bom-ref': ref, name, version, purl: ref,
    supplier: { name: 'Google Fonts', url: ['https://fonts.google.com'] },
    hashes: [{ alg: 'SHA-512', content: createHash('sha512').update(readFileSync(path)).digest('hex') }],
    licenses: [{ license: { id: 'OFL-1.1' } }],
    externalReferences: [{ type: 'distribution', url }],
  });
}
components.sort((a, b) => a['bom-ref'] < b['bom-ref'] ? -1 : 1);

const direct = [
  ...Object.keys(pkg.dependencies || {}).map((n) => components.find((c) => c.name === n)).filter(Boolean).map((c) => c['bom-ref']),
  ...components.filter((c) => c.type === 'file').map((c) => c['bom-ref']),
].sort();
const appRef = 'pkg:npm/' + pkg.name + '@' + pkg.version;
const deps = [{ ref: appRef, dependsOn: direct }];
for (const [path, e] of Object.entries(lock.packages)) {
  if (!path || e.dev || e.devOptional || e.link) continue;
  const name = path.split('node_modules/').pop();
  const on = Object.keys(e.dependencies || {}).map((n) => components.find((c) => c.name === n)).filter(Boolean).map((c) => c['bom-ref']);
  deps.push({ ref: purl(name, e.version), dependsOn: on.sort() });
}
for (const c of components.filter((x) => x.type === 'file')) deps.push({ ref: c['bom-ref'], dependsOn: [] });
deps.sort((a, b) => a.ref < b.ref ? -1 : 1);

const metadata = {
  authors: [{ name: 'StepSAFE' }],
  tools: { components: [{ type: 'application', name: 'stepsafe scripts/sbom.mjs' }] },
  component: { type: 'application', 'bom-ref': appRef, name: pkg.name, version: pkg.version, supplier: { name: 'StepSAFE', url: ['https://unitium-safe.vercel.app'] } },
};
const digest = createHash('sha256').update(JSON.stringify({ metadata, components, dependencies: deps })).digest('hex');
const serialNumber = 'urn:uuid:' + [digest.slice(0, 8), digest.slice(8, 12), '5' + digest.slice(13, 16), '8' + digest.slice(17, 20), digest.slice(20, 32)].join('-');

const OUT = 'public/sbom.cdx.json';
let prev = null;
try { prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null; } catch { prev = null; }
const kept = prev && prev.serialNumber === serialNumber && prev.metadata && prev.metadata.timestamp;
const timestamp = kept ? prev.metadata.timestamp : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const sbom = { bomFormat: 'CycloneDX', specVersion: '1.5', serialNumber, version: 1, metadata: { timestamp, ...metadata }, components, dependencies: deps };
const text = JSON.stringify(sbom, null, 2) + '\n';

if (missing.length) console.error('sbom: no supplier read for ' + missing.join(', ') + ' (is node_modules installed?)');
if (process.argv.includes('--check')) {
  const same = !missing.length && existsSync(OUT) && readFileSync(OUT, 'utf8') === text;
  console.log(same ? 'sbom: matches package-lock.json and the fonts (' + components.length + ' components, written ' + timestamp + ')' : 'sbom: DIFFERS from package-lock.json; run node scripts/sbom.mjs');
  process.exit(same ? 0 : 1);
}
writeFileSync(OUT, text);
console.log('sbom: ' + components.length + ' components that ship, written to ' + OUT + (kept ? ' (unchanged since ' + timestamp + ')' : ' at ' + timestamp));
