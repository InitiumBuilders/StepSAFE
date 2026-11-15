/* PROBE: StepSAFE reads itself (lib/selfread.ts, content/own.ts, views/TrustView.tsx). Every reading is tested here
   against StepSAFE's real files (security.txt, vercel.json's headers, the bill of materials) and against broken
   copies of them, so a reading that says "holds" has been seen to say "does not hold" when it should. Then the
   words on the page are held to the code: every Code and releases statement answered once, every site the security
   policy allows named once, every storage name the app writes labelled, every test the page names a real file.
     npx tsx probe-selfread.mts */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as S from './src/lib/selfread.ts';
import { HOST_NAMES, STORE_NAMES, CODE_ANSWERS, FEDERAL, RELEASE_TESTS, OWN_ON } from './src/content/own.ts';
import { ITEMS as CODE_ITEMS } from './src/content/check/code.ts';

const problems: string[] = [];
let checks = 0;
const ok = (c: boolean, m: string) => { checks++; if (!c) { problems.push(m); console.log('FAIL ' + m); } };
const NOW = Date.parse('2026-11-14T12:00:00Z');
const DAY = 864e5;

/* ---------- security.txt ---------- */
const realTxt = readFileSync('public/.well-known/security.txt', 'utf8');
const real = S.parseSecurityTxt(realTxt);
ok(real.contact.length === 1 && real.expiresCount === 1 && /security\.html$/.test(real.policy), 'the real security.txt parses: one contact, one Expires, the policy');
const placeholder = real.contact[0].includes('[[');
/* a copy whose contact is a known address, whatever the real file holds today */
const withContact = (txt: string) => txt.replace(/^Contact:.*$/m, 'Contact: mailto:security@example.org');
const filled = S.parseSecurityTxt(withContact(realTxt));
ok(S.disclosureFinding(S.parseSecurityTxt(realTxt.replace(/^Contact:.*$/m, 'Contact: mailto:[[SECURITY CONTACT]]')), NOW).line.includes('not filled in'), 'a placeholder contact is read as a gap');
const fShown = S.disclosureFinding(filled, NOW);
ok(fShown.mark === 'shown' && fShown.line.includes('security@example.org') && /days from now/.test(fShown.line), 'a filled security.txt holds and names its contact and days left: ' + fShown.line);
ok(!fShown.line.includes('mailto:'), 'the contact is shown without its mailto: prefix');
if (placeholder) ok(S.disclosureFinding(real, NOW).mark === 'gap' && /not filled in/.test(S.disclosureFinding(real, NOW).line), 'the real file, its contact still a placeholder, is read as a gap');
else ok(S.disclosureFinding(real, NOW).mark === 'shown', 'the real file, its contact set, holds');
const base = withContact(realTxt);
const mut = (from: string, to: string) => S.disclosureFinding(S.parseSecurityTxt(base.replace(from, to)), NOW);
ok(mut('Expires: 2027-11-13T23:59:59.000Z', 'Expires: 2020-01-01T00:00:00.000Z').line.includes('expired on 2020-01-01'), 'an expired file is a gap that says when it expired');
ok(/RFC 9116/.test(mut('Expires: 2027-11-13T23:59:59.000Z', 'Expires: 2029-01-01T00:00:00.000Z').line), 'an Expires more than a year ahead is a gap, after RFC 9116');
ok(/more than once/.test(mut('Preferred-Languages: en', 'Expires: 2027-01-01T00:00:00.000Z\nPreferred-Languages: en').line), 'two Expires lines are a gap');
ok(/no Expires/.test(mut('Expires: 2027-11-13T23:59:59.000Z', '').line), 'a missing Expires is a gap');
ok(/cannot be read/.test(mut('Expires: 2027-11-13T23:59:59.000Z', 'Expires: soon').line), 'an Expires that is not a date is a gap');
ok(/no contact/.test(S.disclosureFinding(S.parseSecurityTxt('# Contact: mailto:a@b.c\nExpires: 2027-01-01T00:00:00Z'), NOW).line), 'a contact in a comment does not count');
ok(S.disclosureFinding(null, NOW).mark === 'gap', 'no security.txt at all is a gap');
ok(S.parseSecurityTxt('Contact: mailto:a@b.c\r\nExpires: 2027-01-01T00:00:00Z\r\n').expiresCount === 1, 'CRLF line ends parse');

/* ---------- the headers, from vercel.json ---------- */
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const H = Object.fromEntries((vercel.headers || []).filter((h: any) => h.source === '/(.*)').flatMap((h: any) => h.headers).map((h: any) => [h.key.toLowerCase(), h.value]));
const CSP = H['content-security-policy'];
ok(S.scriptsFinding(CSP).mark === 'shown', 'the real policy: scripts from this site only');
ok(/Plugins are refused/.test(S.scriptsFinding(CSP).line), 'the real policy refuses plugins too');
ok(S.scriptsFinding(CSP.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'")).line.includes("'unsafe-inline'"), 'a policy that lets inline scripts in is a gap that names it');
ok(S.scriptsFinding(CSP.replace("script-src 'self'", "script-src 'self' https://cdn.example.com")).mark === 'gap', 'a policy that lets in another site’s scripts is a gap');
ok(S.scriptsFinding("default-src 'self'").mark === 'shown', 'with no script-src, default-src counts');
ok(S.scriptsFinding(null).mark === 'gap' && S.scriptsFinding("img-src 'self'").mark === 'gap', 'no policy, or one that sets no script limit, is a gap');
ok(S.scriptsFinding("script-src 'self'; script-src *").mark === 'shown', 'the first script-src counts, as in a browser');
ok(S.framingFinding(CSP, H['x-frame-options']).mark === 'shown' && /both/.test(S.framingFinding(CSP, H['x-frame-options']).line), 'the real headers forbid framing, twice');
ok(S.framingFinding("frame-ancestors *", null).mark === 'gap', 'a policy that lets any site frame the page is a gap');
ok(S.framingFinding(null, 'DENY').mark === 'shown', 'X-Frame-Options DENY alone holds');
ok(S.httpsFinding('max-age=63072000; includeSubDomains; preload').line.includes('730 days, on every subdomain'), 'Vercel’s HSTS reads as 730 days, every subdomain');
ok(S.httpsFinding('max-age=86400').mark === 'gap' && S.httpsFinding(null).mark === 'gap', 'a short HSTS, or none, is a gap');
ok(S.referrerFinding(H['referrer-policy']).mark === 'shown', 'the real referrer policy holds');
ok(S.referrerFinding('no-referrer-when-downgrade').mark === 'gap' && S.referrerFinding('unsafe-url, no-referrer').mark === 'shown', 'the last known referrer policy in a list is the one read');
const pw = S.powersFinding(H['permissions-policy']);
ok(pw.mark === 'shown' && /microphone is allowed for this site only/.test(pw.line), 'the real permissions: camera, location and payments off, the microphone for this site');
ok(/the camera/.test(S.powersFinding(H['permissions-policy'].replace('camera=()', 'camera=*')).line), 'a camera left on is a gap that names it');
ok(S.powersFinding(null).mark === 'gap', 'no permissions header is a gap');

/* ---------- the sites a visit reaches ---------- */
const hosts = new Set<string>();
for (const dir of ['connect-src', 'style-src', 'font-src', 'img-src', 'media-src', 'script-src']) for (const v of S.cspOf(CSP).get(dir) || []) if (/^https:\/\//.test(v)) hosts.add(v.replace(/^https:\/\//, ''));
for (const h of hosts) ok(Object.prototype.hasOwnProperty.call(HOST_NAMES, h), 'the security policy allows ' + h + ', and the own record names it');
for (const h of Object.keys(HOST_NAMES)) ok(hosts.has(h), 'the own record names ' + h + ', and the security policy allows it');
const here = 'unitium-safe.vercel.app';
const visit = ['https://unitium-safe.vercel.app/#/trust', 'https://unitium-safe.vercel.app/assets/a.js', 'https://en.wikipedia.org/api/rest_v1/page/summary/X', 'https://api.anthropic.com/v1/messages', 'https://me.davara.dev/api/chat', 'data:image/png;base64,AAAA', 'blob:https://unitium-safe.vercel.app/x', 'not a url'];
const reached = S.hostsReached(visit, here);
ok(reached.length === 4 && reached[0].host === here && reached[0].name === 'this site', 'a visit’s sites: four, this site first, data and blob and junk skipped: ' + reached.map((r) => r.host).join(' '));
ok(reached.every((r) => r.name), 'each site of that visit is named (a Davara subdomain by its wildcard)');
ok(S.hostsFinding(reached, here, false).mark === 'shown', 'a visit to named sites only holds');
const stray = S.hostsFinding(S.hostsReached([...visit, 'https://collector.example/beacon'], here), here, false);
ok(stray.mark === 'gap' && stray.line.includes('collector.example'), 'a visit to a site the privacy page does not name is a gap that names it');
ok(/list of what this visit loaded is full/.test(S.hostsFinding(reached, here, true).line), 'a full list says a site may be missing');
ok(/no site but this one/.test(S.hostsFinding(S.hostsReached([visit[0]], here), here, false).line), 'a visit that reached only this site says so');
ok(S.nameOfHost('evil.davara.dev.example') === null, 'a wildcard matches a real subdomain only');
/* a load the policy refused is listed by the browser with no time, bytes or status: it never left */
const split = S.splitLoaded([
  { name: 'https://vercel.live/_next-live/feedback/feedback.js', duration: 0, transferSize: 0, responseStatus: 0 },
  { name: 'https://en.wikipedia.org/w/api.php', duration: 12.4, transferSize: 0 },
  { name: 'https://unitium-safe.vercel.app/assets/b.js', duration: 0, transferSize: 4096, responseStatus: 200 },
]);
ok(split.stopped.length === 1 && split.stopped[0].includes('vercel.live') && split.sent.length === 2, 'a refused load is told apart from one that left: a cross-site load with time but no bytes still counts as sent');
const preview = S.hostsFinding(S.hostsReached([visit[0], ...split.sent], here), here, false, S.hostsReached(split.stopped, here));
ok(preview.mark === 'shown' && /stopped every request to vercel\.live before it left your browser/.test(preview.line) && !/reached 1 site the privacy page does not name/.test(preview.line), 'a refused toolbar script is said to be stopped, never reached: ' + preview.line);
ok(!/stopped/.test(S.hostsFinding(S.hostsReached(['https://en.wikipedia.org/a'], here), here, false, S.hostsReached(['https://en.wikipedia.org/b'], here)).line), 'a site reached once is not also said to be stopped');

/* ---------- what the browser keeps ---------- */
const SEALED = JSON.stringify({ v: 1, kdf: 'PBKDF2-SHA256', rounds: 600000, salt: 'c2FsdHNhbHQ=', iv: 'aXZpdml2aXY=', ct: 'Y2lwaGVydGV4dA==' });
const record = JSON.stringify({ onboarded: true, handle: 'R', provider: { anthropicKey: '' } });
const scan = S.scanStore([['stepsafe-praxis-v1', record], ['stepsafe-keys-v1', SEALED], ['stepsafe-sound', 'on']]);
ok(scan.sealed === 'sealed' && scan.rounds === 600000 && !scan.shaped.length, 'a sealed blob is read as sealed, at 600,000 rounds');
const dev = S.deviceFinding(scan, 'locked', '', 120);
ok(dev.mark === 'shown' && /3 items/.test(dev.line) && /AES-256-GCM/.test(dev.line) && /600,000/.test(dev.line) && /locked/.test(dev.line) && /No cookie/.test(dev.line) && /120 of StepSAFE’s files/.test(dev.line), 'the device reading: items, the seal, no cookie, the offline files: ' + dev.line);
ok(!dev.line.includes('"onboarded"') && !dev.line.includes('c2FsdHNhbHQ='), 'the device reading shows names and sizes, never contents');
const leaked = 'sk-ant-' + 'a'.repeat(40);
const bad = S.scanStore([['stepsafe-praxis-v1', JSON.stringify({ provider: { anthropicKey: leaked } })], ['stepsafe-keys-v1', JSON.stringify({ v: 1, kdf: 'PBKDF2-SHA256', rounds: 600000, salt: 'c2Fs', iv: 'aXY=', ct: 'Y3Q=', anthropicKey: 'x' })]]);
ok(bad.sealed === 'bad' && bad.shaped.includes('your record'), 'a key in the record, and a keys blob with an extra field, are both caught');
const badF = S.deviceFinding(bad, 'open', 'a=1; b=two', null);
ok(badF.mark === 'gap' && !badF.line.includes(leaked) && !badF.line.includes('two') && /a, b/.test(badF.line), 'the gap says where and which cookies, never the key or a cookie’s value: ' + badF.line);
ok(/memory for this visit only/.test(S.deviceFinding(S.scanStore([]), 'session', '', null).line), 'with no seal, a pasted key is said to live in memory for the visit');
ok(/did not write \(other\)/.test(S.deviceFinding(S.scanStore([['other', '1']]), 'session', '', null).line), 'a name StepSAFE did not write is shown as such');
/* every name the app writes to storage has its words on the page */
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : []; });
const written = new Set<string>();
for (const f of walk('src')) { const t = readFileSync(f, 'utf8'); if (!/localStorage/.test(t)) continue; for (const m of t.matchAll(/['"`](stepsafe-[a-z0-9-]*[a-z0-9])['"`]/g)) written.add(m[1]); }
for (const k of written) ok(Object.prototype.hasOwnProperty.call(STORE_NAMES, k), 'the app keeps ' + k + ' in storage, and the own record labels it');

/* ---------- the bill of materials, and the flaws ---------- */
const sbom = S.parseSbom(JSON.parse(readFileSync('public/sbom.cdx.json', 'utf8')));
ok(!!sbom && sbom.parts.length >= 1 && sbom.parts.every((p) => p.supplier && /^pkg:(npm|generic)\//.test(p.purl)), 'the real bill of materials parses, every component with a supplier and a purl');
ok(!!sbom && sbom.parts.filter((p) => p.purl.startsWith('pkg:generic/')).length === readdirSync('src/styles/fonts').filter((f) => f.endsWith('.woff2')).length, 'every font file that ships is in the bill of materials');
const parts = S.partsFinding(sbom);
ok(parts.mark === 'shown' && parts.line.includes('react 18.3.1') && /CycloneDX 1\.5/.test(parts.line) && /\d+ font files \(/.test(parts.line), 'the parts reading holds and lists the packages and the font files: ' + parts.line.slice(0, 160));
const thin = JSON.parse(readFileSync('public/sbom.cdx.json', 'utf8')); delete thin.components[0].supplier;
ok(S.partsFinding(S.parseSbom(thin)).mark === 'gap', 'a package with no supplier is a gap');
ok(S.parseSbom({ bomFormat: 'SPDX', components: [] }) === null && S.partsFinding(null).mark === 'gap', 'a file that is not CycloneDX is a gap');
ok(S.partsFinding(S.parseSbom({ bomFormat: 'CycloneDX', components: [] })).mark === 'gap', 'an empty list is a gap');
const list = sbom ? S.npmParts(sbom.parts) : [];
ok(!!sbom && list.length > 0 && list.length < sbom.parts.length && list.every((p) => p.purl.startsWith('pkg:npm/')), 'only the npm packages go to OSV.dev; the font files stay out of the question');
const body = S.osvBody(list);
ok(body.queries.length === list.length && body.queries.every((q) => q.package.ecosystem === 'npm' && q.version), 'the OSV question carries each package, npm, with its version, and nothing else');
ok(JSON.stringify(body).length < 2000 && !/handle|stepsafe-praxis/.test(JSON.stringify(body)), 'the OSV question holds nothing about the visitor');
const clean = S.parseOsv({ results: list.map(() => ({})) }, list);
ok(!!clean && clean.length === 0 && S.flawsFinding(clean, list.length, NOW).mark === 'shown', 'no vulns from OSV holds');
const flawed = S.parseOsv({ results: list.map((_, i) => (i === 0 ? { vulns: [{ id: 'GHSA-abcd-efgh-ijkl', modified: 'x' }, { id: '<img src=x>' }] } : {})) }, list);
const flawF = S.flawsFinding(flawed, list.length, NOW);
ok(flawF.mark === 'gap' && flawF.line.includes('GHSA-abcd-efgh-ijkl') && !flawF.line.includes('<img'), 'a known flaw is a gap that names it, and a hostile id is dropped: ' + flawF.line);
ok(S.parseOsv({ results: [] }, list) === null && S.flawsFinding(null, list.length, NOW).mark === 'unread', 'an answer of the wrong length is not read as clean');

/* ---------- the words held to the code ---------- */
const ids = CODE_ITEMS.map((i) => i.id);
for (const id of ids) ok(!!CODE_ANSWERS[id], 'StepSAFE answers its own statement ' + id);
for (const id of Object.keys(CODE_ANSWERS)) ok(ids.includes(id), 'the answer ' + id + ' is to a statement the check asks');
const READS = new Set(['disclosure', 'parts', 'flaws']);
for (const [id, a] of Object.entries(CODE_ANSWERS)) {
  if (a.how === 'shown') ok(!!a.read, 'the shown answer ' + id + ' names the reading that shows it');
  if (a.read) ok(READS.has(a.read), 'the answer ' + id + ' points at a reading the page takes: ' + a.read);
  ok(a.note.length > 20 && !/\u2014/.test(a.note), 'the answer ' + id + ' says why, with no em dash');
}
const fedIds = new Set<string>();
for (const row of FEDERAL) {
  ok(!fedIds.has(row.id), 'the federal row ' + row.id + ' appears once'); fedIds.add(row.id);
  for (const s of row.sources) {
    const age = (NOW - Date.parse(s.checked + 'T00:00:00Z')) / DAY;
    ok(/^https:\/\//.test(s.url) && /^\d{4}-\d\d-\d\d$/.test(s.checked) && age >= -1 && age <= 365, 'the source for ' + row.id + ' is https and was read within a year: ' + s.checked);
  }
}
ok(/^\d{4}-\d\d-\d\d$/.test(OWN_ON), 'the answers carry the day they were true');
for (const t of RELEASE_TESTS) ok(existsSync(t.name + '.mts') || existsSync(t.name + '.mjs') || existsSync('scripts/' + t.name + '.mjs'), 'the release test ' + t.name + ' is a real file');
ok(new RegExp('setResourceTimingBufferSize\\(' + S.LOADED_LIST_SIZE + '\\)').test(readFileSync('src/main.tsx', 'utf8')), 'the app keeps the list of loaded files at the size the reading assumes (' + S.LOADED_LIST_SIZE + ')');
ok(/'trust'/.test(readFileSync('src/lib/history.ts', 'utf8')) && /TrustView/.test(readFileSync('src/App.tsx', 'utf8')), 'the page has its address, #/trust');
ok(/view: 'trust'/.test(readFileSync('src/views/SettingsView.tsx', 'utf8')), 'Settings opens the own record');
const mainSrc = readFileSync('src/main.tsx', 'utf8');
const mountAt = mainSrc.indexOf("import('./views/trustMount')");
ok(mountAt > 0 && mountAt < mainSrc.indexOf('readRecord().onboarded') && mainSrc.includes("test(location.pathname)"), 'the app opens /trust on its own, before the welcome page');
for (const f of ['security', 'privacy']) ok(readFileSync('public/' + f + '.html', 'utf8').includes('href="/trust"'), f + '.html links the own record at /trust, which needs no handle');

/* ---------- a whole reading, as a reviewer keeps it ---------- */
const reading: S.SelfReading = { at: NOW, origin: 'https://unitium-safe.vercel.app', findings: [fShown, S.scriptsFinding(CSP), stray], parts: list };
const md = S.readingText(reading, flawF);
ok(md.includes('https://unitium-safe.vercel.app/trust') && md.includes('Does not hold') && md.includes(S.SELF_TITLES.flaws), 'the saved reading carries every finding, its state and the address to read it again');
const t = S.tally([fShown, stray, S.flawsFinding(null, 1, NOW)]);
ok(t.shown === 1 && t.gap === 1 && t.unread === 1, 'the tally counts each state');

console.log('selfread: ' + checks + ' checks | sites named ' + Object.keys(HOST_NAMES).length + ' | storage names ' + written.size + ' | answers ' + Object.keys(CODE_ANSWERS).length + ' | federal rows ' + FEDERAL.length);
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.map((p) => '  ' + p).join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
