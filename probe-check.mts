/* Dash Defenders, the checks before launch, held to their word. Every check: twelve statements in three
   parts, each mapped to catalog structures and to a NIST CSF 2.0 category, each citing primary sources that
   were read at the source within the statement's shelf life (a stale fact fails the probe, so it cannot
   ship). The scoring reads Not sure as not held and Does not apply as out of the count; gaps come deepest
   first; the record carries every statement, its category, its warning and its source dates; the milestones
   exist, pay no trust on self-report, and are granted by kind; the checks never enter the main record; the
   pages are reachable; the copy has no dashes.
   Run: npx tsx probe-check.mts */
(globalThis as any).self = globalThis;
import { readFileSync } from 'node:fs';
const { CHECKS, checkKind } = await import('./src/content/check/index');
const { CSF_CATEGORIES } = await import('./src/content/check/csf');
const { scoreCheck, checkRecord } = await import('./src/lib/check');
const { CATALOG } = await import('./src/content/modux/catalog');
const { AWARDS } = await import('./src/content/index');
const E = await import('./src/lib/evidence');

const problems: string[] = [];
const bad = (m: string) => problems.push(m);
const ids = new Set(CATALOG.map(m => m.id));
const name = (id: string) => CATALOG.find(m => m.id === id)?.name || id;
const TODAY = Date.now();
const DAY = 86400e3;
/* primary sources only: Dash's own docs and DashSupport.Team, the standards bodies and the FBI, SEAL 911, SLSA
   and OpenSSF for their own specs, and each provider's own help */
const HOSTS = /^https:\/\/(docs\.dash\.org|www\.dashsupport\.team|www\.ledger\.com\/academy|www\.cisa\.gov|nvlpubs\.nist\.gov|www\.icann\.org|docs\.github\.com|support\.discord\.com|help\.x\.com|www\.ic3\.gov|securityalliance\.org|frameworks\.securityalliance\.org|slsa\.dev|github\.com\/ossf|support\.apple\.com)\//;

/* 1. every check, every statement */
const allIds = new Set<string>();
let oldest = '9999-12-31', stalest = '';
for (const k of CHECKS) {
  if (k.items.length !== 12) bad(k.id + ' should hold twelve statements, holds ' + k.items.length);
  if (k.parts.length !== 3) bad(k.id + ' should have three parts');
  for (const p of k.parts) { const n = k.items.filter(i => i.part === p.id).length; if (n !== 4) bad(k.id + ': ' + p.name + ' holds ' + n + ' statements, not 4'); }
  for (const i of k.items) {
    if (allIds.has(i.id)) bad('a repeated statement id: ' + i.id);
    allIds.add(i.id);
    if (!k.parts.some(p => p.id === i.part)) bad(i.id + ': a part its check does not have: ' + i.part);
    if (!i.models.length) bad(i.id + ': no structure');
    for (const m of i.models) if (!ids.has(m)) bad(i.id + ': names a structure not in the catalog: ' + m);
    if (!CSF_CATEGORIES[i.csf]) bad(i.id + ': not a NIST CSF 2.0 category: ' + i.csf);
    if (![90, 180, 365].includes(i.shelf)) bad(i.id + ': a shelf life of ' + i.shelf + ' days; use 90, 180 or 365');
    if (!i.sources.length) bad(i.id + ': no source');
    for (const s of i.sources) {
      if (!HOSTS.test(s.url)) bad(i.id + ': a source outside the primary hosts: ' + s.url);
      const t = Date.parse(s.checked + 'T00:00:00Z');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s.checked) || isNaN(t)) { bad(i.id + ': a source without the date it was checked: ' + s.label); continue; }
      if (t > TODAY + DAY) bad(i.id + ': a source checked in the future: ' + s.checked);
      if (TODAY - t > i.shelf * DAY) bad(i.id + ': STALE, its source ' + s.label + ' was checked ' + s.checked + ', past its ' + i.shelf + ' day shelf. Read it at the source again and redate it.');
      if (s.checked < oldest) { oldest = s.checked; stalest = i.id; }
    }
    for (const t of [i.ask, i.why, i.move]) if (t.trim().length < 20) bad(i.id + ': a short field: ' + t);
    if (!i.short || i.short.length > 34 || /[.–—]/.test(i.short)) bad(i.id + ': the ring label should be a few words with no stop or dash: ' + i.short);
  }
}

/* 2. the scoring, on the treasury and on accounts */
const T = checkKind('treasury'), A = checkKind('accounts');
const all = (k: typeof T, a: string) => Object.fromEntries(k.items.map(i => [i.id, a])) as any;
let sc = scoreCheck({ answers: all(T, 'yes') });
if (!sc.allHeld || sc.held !== 12 || sc.gaps.length) bad('every Yes does not read as every statement held');
sc = scoreCheck({ answers: { ...all(T, 'yes'), masternode: 'na' } });
if (!sc.allHeld || sc.applies !== 11) bad('Does not apply is counted: applies ' + sc.applies);
sc = scoreCheck({ answers: { ...all(T, 'yes'), seeds: 'unsure' } });
if (sc.allHeld || sc.gaps[0]?.item.id !== 'seeds') bad('Not sure does not read as a gap');
sc = scoreCheck({ answers: { ...all(T, 'yes'), rule: 'no', 'two-agree': 'no', restore: 'partly' } });
if (sc.gaps.map(g => g.item.id).join(',') !== 'two-agree,restore,rule') bad('gaps are not deepest first: ' + sc.gaps.map(g => g.item.id).join(','));
if (sc.partly !== 1 || sc.held !== 9) bad('partly or held miscounted');
sc = scoreCheck({ answers: { 'two-agree': 'yes' } });
if (sc.complete || sc.answered !== 1 || sc.gaps.length !== 11) bad('an unfinished check reads wrongly');
sc = scoreCheck({ kind: 'accounts', answers: { ...all(A, 'yes'), 'code-host': 'na', 'dns-signin': 'no' } });
if (sc.total !== 12 || sc.applies !== 11 || sc.gaps[0]?.item.id !== 'dns-signin' || sc.parts[0].name !== 'The domain') bad('an accounts run is not scored against its own statements');
if (scoreCheck({ answers: all(A, 'yes') }).answered !== 0) bad('a run without a kind is not read as a treasury check');

/* 3. the record */
const rec = checkRecord({ id: 'x', project: 'Probe Treasury', answers: { ...all(T, 'yes'), 'two-agree': 'no', masternode: 'na' }, at: Date.UTC(2026, 10, 4, 12), done: Date.UTC(2026, 10, 4, 12) }, name);
for (const i of T.items) if (!rec.includes(i.ask)) bad('the record is missing: ' + i.id);
if (!rec.includes('Share it only with the reviewer')) bad('the record lost its warning');
if (!rec.includes('We run no masternode')) bad('the record does not name a statement that does not apply');
if (!rec.includes('Move: ' + T.items.find(i => i.id === 'two-agree')!.move)) bad('the record does not give the move for a gap');
if (!/^# Ten-minute treasury check: Probe Treasury/.test(rec)) bad('the record does not open with the project');
if (!rec.includes('NIST CSF 2.0: PR.AA, Identity Management, Authentication, and Access Control')) bad('the record does not name a gap\'s CSF category');
if (!/\(checked \d{4}-\d{2}-\d{2}\)/.test(rec)) bad('the record does not date its sources');
const recA = checkRecord({ id: 'y', kind: 'accounts', project: 'Probe Project', answers: { 'dns-signin': 'no' }, at: Date.UTC(2026, 10, 4) }, name);
if (!/^# Accounts and access check: Probe Project/.test(recA) || !recA.includes(A.items[0].ask) || recA.includes(T.items[0].ask)) bad('the accounts record is not its own');

/* 3b. the statements that carry a lesson keep it */
const addr = T.items.find(i => i.id === 'address')!;
if (!/amount/.test(addr.ask) || !/device screen/.test(addr.move)) bad('the address statement does not ask for the amount on the device screen');
const dns = A.items.find(i => i.id === 'dns-signin')!;
if (!/text-message codes are not recommended/.test(dns.why)) bad('the DNS statement lost CISA\'s word on text-message codes');

/* 3c. where the checks live: never in the record, its export or its import */
const stateSrc = readFileSync('src/lib/state.tsx', 'utf8');
if (/checks: TreasuryCheck|case 'check-/.test(stateSrc)) bad('the main record still holds treasury checks');
if (!/adoptLegacyChecks\(s\.checks\)/.test(stateSrc) || !/delete st\.checks/.test(stateSrc)) bad('the record loader or the import does not move checks out');
if (!/NEVER_EXPORT = \[[^\]]*'checks'/.test(readFileSync('src/views/SettingsView.tsx', 'utf8'))) bad('the record export can carry checks');
const keyringSrc = readFileSync('src/lib/keyring.ts', 'utf8');
if (!/checks: held/.test(keyringSrc)) bad('the keyring seal does not carry the checks');
if (!/c\.kind/.test(keyringSrc)) bad('the keyring drops a run\'s kind');
for (const f of ['src/views/CheckView.tsx', 'src/views/HomeView.tsx']) if (/s\.checks/.test(readFileSync(f, 'utf8'))) bad(f + ' reads checks from the main record');

/* 4. the milestones, the page and the doors */
for (const k of CHECKS) {
  for (const id of ['small-' + k.id + '-check', 'strong-' + k.id + '-held']) if (!AWARDS.some(a => a.id === id)) bad('award missing: ' + id);
  const held = AWARDS.find(a => a.id === 'strong-' + k.id + '-held');
  if (held && (held.trust !== 0 || !/own (answers|account)/.test(held.statement))) bad(held.id + ' pays trust or does not say it rests on the project\'s own answers');
}
const engine = readFileSync('src/lib/engine.tsx', 'utf8');
if (!engine.includes("grant('small-' + kind + '-check', true)") || !engine.includes("grant('strong-' + kind + '-held', true)")) bad('the engine does not grant the milestones by kind, shown in place');
if (!/earned\.map\(a =>/.test(readFileSync('src/views/CheckView.tsx', 'utf8'))) bad('the result does not show the milestones it reached');
if (!/check: page\(\(\) => import\('\.\/views\/CheckView'\)/.test(readFileSync('src/App.tsx', 'utf8'))) bad('the checks have no route');
const palette = readFileSync('src/components/Palette.tsx', 'utf8');
for (const k of CHECKS) if (!palette.includes("view: 'check', id: '" + k.id + "'")) bad('Find does not lead to the ' + k.id + ' check');
if (!readFileSync('src/views/HomeView.tsx', 'utf8').includes("view: 'check'")) bad('Ground does not lead to the checks');
if (!readFileSync('src/main.tsx', 'utf8').includes("styles/check.css")) bad('the check styles are not loaded');

/* 4b. shown, not said: the parsers on saved real responses, the rules, and the policy */
const fx = (f: string) => JSON.parse(readFileSync('research/evidence/' + f, 'utf8'));
const dashOrg = E.parseRdap(fx('rdap-dash-org.json'), 'dash.org', 'https://x', '2026-11-04');
if (dashOrg.allows !== 'partly' || !/transfer lock is set/.test(dashOrg.found) || !/update and delete locks are not/.test(dashOrg.found)) bad('RDAP: one lock set should allow Partly and say which: ' + dashOrg.found);
if (E.parseRdap(fx('rdap-example-com.json'), 'example.com', 'https://x').allows !== 'yes') bad('RDAP: all three locks should allow Yes');
if (E.parseRdap({ status: [] }, 'x.org', 'https://x').allows !== 'no') bad('RDAP: no lock should allow No');
const MS = '7YSaxf6pd7SJ6aWMRy9xp5Jy2qLDBURU41';
const agree = E.parseMultisig(fx('insight-multisig-txs.json'), MS, 'multisig-agree', 'https://x');
if (agree.allows !== 'yes' || !/2 of 3 signatures/.test(agree.found)) bad('multisig: a 2 of 3 spend should show two signers: ' + agree.found);
if (E.parseMultisig(fx('insight-multisig-txs.json'), MS, 'multisig-spare', 'https://x').allows !== 'yes') bad('multisig: 2 of 3 should survive a lost key');
if (E.parseMultisig({ txs: [] }, 'XjW5rL5Ffx8A9n6K1x2tQKzvYpLMr1h9bS', 'multisig-agree', 'https://x').allows !== 'no') bad('multisig: an X address has one key and should allow No');
if (E.parseMultisig({ txs: [] }, MS, 'multisig-agree', 'https://x').allows !== 'open') bad('multisig: a script that has not spent should be open: the chain does not show its signers yet');
if (E.parseRedeemScript('52ae') !== null || E.parseRedeemScript('5321' + '02'.repeat(33) + '52ae') !== null || E.parseRedeemScript('zz') !== null) bad('redeem scripts: a malformed or impossible script was read as one');
if (E.contradicts('yes', dashOrg) !== true || E.shownBy('partly', dashOrg) !== true || E.shownBy('no', { allows: 'yes' } as any) || !E.shownBy('no', { allows: 'no' } as any)) bad('the rules: Yes over Partly is a contradiction; Partly is shown; No is shown only when the record says no');
if (E.cleanDomain('https://Dash.org/x') !== 'dash.org' || E.cleanDomain('not a domain') !== null || E.rdapUrl('dashpay.io') !== null) bad('domains: cleaning or the unreadable-TLD rule is off');
const csp = JSON.stringify(JSON.parse(readFileSync('vercel.json', 'utf8')));
for (const h of E.EVIDENCE_HOSTS) if (!csp.includes('https://' + h)) bad('the policy does not allow a host a read contacts: ' + h);
const evSrc = readFileSync('src/lib/evidence.ts', 'utf8');
for (const m of evSrc.matchAll(/https:\/\/([a-z0-9.-]+)\//g)) if (!E.EVIDENCE_HOSTS.includes(m[1]) && !E.LINK_HOSTS.includes(m[1]) && m[1] !== 'data.iana.org') bad('evidence.ts names a host the policy does not: ' + m[1]);
if (E.EVIDENCE_HOSTS.some(h => !csp.includes('https://' + h)) || !E.EVIDENCE_HOSTS.includes('api.scorecard.dev')) bad('Scorecard\'s API is not a host the reads and the policy both name');
const withEv = CHECKS.flatMap(k => k.items).filter(i => i.evidence);
const READ_TODAY = 'branch-rules,dep-alerts,disclosure,dns-watch,domain-lock,lose-one,provenance,review,signed,token-perms,two-agree';
if (withEv.map(i => i.id).sort().join(',') !== READ_TODAY) bad('the statements a record can show are not the eleven read today: ' + withEv.map(i => i.id).sort().join(','));
if (CHECKS.flatMap(k => k.items.filter(i => i.evidence && E.isScorecardKind(i.evidence)).map(() => k.id)).some(id => id !== 'code')) bad('a Scorecard read is named outside the code check');
if (E.subjectOf(E.evidenceSource('dns-records')) !== E.subjectOf(E.evidenceSource('domain-locks')) || E.subjectOf('insight') === E.subjectOf('rdap')) bad('the lock read and the DNS read should share the domain typed, and only they');

/* 4b2. DNS: where a domain points, kept as a dated copy that settles nothing, and what changed since the reading
   before. The answers are real (dns.google, 2026-11-10); each mutant must move what the reading says. */
const dohDash = fx('doh-dash-org.json'), dohGh = fx('doh-github.json');
const d1 = E.parseDns(dohDash, 'dash.org', E.DOH_VIEW + 'dash.org', '2026-11-10');
if (d1.allows !== 'open' || !/^The name servers are angela\.ns\.cloudflare\.com and owen\.ns\.cloudflare\.com\. It points to 104\.21\.59\.194 and 172\.67\.182\.239, and to 2 IPv6 addresses\. Mail goes to aspmx\.l\.google\.com, alt1\.aspmx\.l\.google\.com and 3 more\. No CAA record limits which authorities may issue certificates for it\.$/.test(d1.found)) bad('DNS: the dash.org reading is not said plainly, or it settles something: ' + d1.found);
if (d1.held?.length !== 11 || !d1.held.includes('NS owen.ns.cloudflare.com') || !d1.held.includes('MX 5 alt1.aspmx.l.google.com') || d1.held.some(l => l.includes('21600'))) bad('DNS: the copy kept for the next reading is off: ' + JSON.stringify(d1.held));
if (!d1.unseen || !/nothing watches while this page is closed/.test(d1.unseen) || d1.url !== 'https://dns.google/query?name=dash.org') bad('DNS: the reading does not say what it cannot show, or links somewhere else');
const ghd = E.parseDns({ CAA: dohGh['github.com CAA'], A: dohGh['www.github.com A'] }, 'www.github.com', 'https://x', '2026-11-10');
if (!/It is an alias: www\.github\.com points to github\.com\. It points to 140\.82\.113\.3\./.test(ghd.found) || !/Only digicert\.com, globalsign\.com, letsencrypt\.org and sectigo\.com may issue certificates for it \(CAA\)\./.test(ghd.found)) bad('DNS: an alias or a CAA record is not said plainly: ' + ghd.found);
const swap = JSON.parse(JSON.stringify(dohDash)); swap.NS.Answer[1].data = 'ns1.attacker.example.';
if (!/^Changed since the reading of 2026-11-10: added NS ns1\.attacker\.example; removed NS owen\.ns\.cloudflare\.com\. The name servers are/.test(E.parseDns(swap, 'dash.org', 'https://x', '2026-11-11', d1).found)) bad('DNS mutant: a swapped name server is not named as a change');
const tick = JSON.parse(JSON.stringify(dohDash)); tick.A.Answer.forEach((a: any) => (a.TTL = 7)); tick.A.Answer.reverse();
if (!/^Nothing changed since the reading of 2026-11-10\. /.test(E.parseDns(tick, 'dash.org', 'https://x', '2026-11-11', d1).found)) bad('DNS mutant: a TTL counting down, or answers in a new order, read as a change');
if (/since the reading/.test(E.parseDns(dohDash, 'dash.org', 'https://x', '2026-11-11', { ...d1, subject: 'example.org' }).found)) bad('DNS: a reading of another domain was compared with this one');
const hostile = JSON.parse(JSON.stringify(dohDash));
hostile.CAA = { Status: 0, Answer: [{ name: 'dash.org.', type: 257, TTL: 1, data: '0 issue "[x](http://evil.example)"' }, { name: 'dash.org.', type: 16, TTL: 1, data: 'v=spf1 -all' }] };
hostile.MX = { Status: 0, Answer: [{ name: 'dash.org.', type: 15, TTL: 1, data: '0 .' }] };
const hr = E.parseDns(hostile, 'dash.org', 'https://x', '2026-11-11');
if (/evil|\[|\]|\(http|spf/.test(hr.found + ' ' + hr.held!.join(' ')) || !/It has a CAA record\. One record holds characters this page does not show\./.test(hr.found) || !/It takes no mail \(a null MX record\)\./.test(hr.found)) bad('DNS mutant: a hostile record, a TXT answer or a null MX is not handled: ' + hr.found);
const hostile2 = JSON.parse(JSON.stringify(hostile)); hostile2.CAA.Answer[0].data = '0 issue "[y](http://evil.example)"';
if (!/^Changed since the reading of 2026-11-11: added CAA \(not shown, [0-9a-f]{8}\); removed CAA \(not shown, [0-9a-f]{8}\)\./.test(E.parseDns(hostile2, 'dash.org', 'https://x', '2026-11-12', hr).found)) bad('DNS mutant: a change to a record that is not shown does not show as a change');
if (E.contradicts('yes', d1) || E.shownBy('yes', d1) || E.shownBy('no', d1)) bad('DNS: a DNS reading should neither back nor limit an answer');
/* the keyring keeps what a reading held, so a sealed or reloaded run can still compare */
const { cleanChecks } = await import('./src/lib/keyring');
const kept = cleanChecks([{ id: 'k1', kind: 'accounts', project: 'P', answers: {}, at: 1, evidence: { 'dns-watch': E.parseDns(swap, 'dash.org', 'https://x', '2026-11-11', d1) } }]);
const keptR = kept[0]?.evidence?.['dns-watch'];
if (!keptR || JSON.stringify(keptR.held) !== JSON.stringify(E.parseDns(swap, 'dash.org', 'https://x', '2026-11-11', d1).held) || !/^Changed since/.test(keptR.found) || !/CAA record limits/.test(keptR.found)) bad('the keyring drops what a DNS reading held, or clips its words');
const recD = checkRecord({ id: 'd', kind: 'accounts', project: 'Probe', answers: { 'dns-watch': 'yes' }, evidence: { 'dns-watch': d1 }, at: Date.UTC(2026, 10, 10) } as any, name);
if (!/\*\*Yes\*\* \(NIST CSF DE\.CM\)\n  The public record: The name servers are angela\.ns\.cloudflare\.com/.test(recD) || !/at <https:\/\/dns\.google\/query\?name=dash\.org>\./.test(recD) || !/Shown by a public record: 0 of 12/.test(recD)) bad('the record does not carry the DNS reading as the public record under its statement, with its link, counted as said');
/* what a new DNS reading compares with: the newest reading of the same domain for the statement, across the runs of
   the same check, this run's own first on the same day; another domain, kind or check is never compared */
const { lastReading } = await import('./src/lib/check');
const rdg = (read: string, subject = 'dash.org', kind = 'dns-records') => ({ ...d1, read, subject, kind });
const runOf = (id: string, kind: string, at: number, r?: any) => ({ id, kind, project: 'P', answers: {}, at, ...(r ? { evidence: { 'dns-watch': r } } : {}) });
const cur = runOf('cur', 'accounts', 5);
const runs4 = [runOf('ra', 'accounts', 1, rdg('2026-10-01')), runOf('rb', 'accounts', 2, rdg('2026-11-01')), runOf('rc', 'accounts', 3, rdg('2026-11-20', 'example.org')), runOf('rt', 'treasury', 4, rdg('2026-12-01')), cur] as any[];
if (lastReading(runs4, cur as any, 'dns-watch', 'dns-records', 'dash.org')?.read !== '2026-11-01') bad('the last reading: the newest of the same domain in the same check should be the one compared');
const curSame = runOf('cur', 'accounts', 5, { ...rdg('2026-11-01'), found: 'this run' });
if (lastReading([runs4[1], curSame] as any[], curSame as any, 'dns-watch', 'dns-records', 'dash.org')?.found !== 'this run') bad('the last reading: on the same day this run\'s own reading should come first');
if (lastReading(runs4, cur as any, 'dns-watch', 'dns-records', null) || lastReading(runs4, cur as any, 'dns-watch', 'domain-locks', 'dash.org') || lastReading([runOf('rb', 'accounts', 2, { ...rdg('2026-11-01'), held: undefined }), cur] as any[], cur as any, 'dns-watch', 'dns-records', 'dash.org')) bad('the last reading: no domain, another kind, or a reading that kept nothing should give none');

/* 4c. Scorecard: the parser on two real published results, a Dash repository's and Scorecard's own */
const scDash = fx('scorecard-dashevo-dashcore-lib.json'), scOssf = fx('scorecard-ossf-scorecard.json');
const SK = ['scorecard-review', 'scorecard-branch', 'scorecard-token', 'scorecard-signed', 'scorecard-provenance', 'scorecard-updates', 'scorecard-policy'] as const;
const readAll = (j: any, subject: string) => Object.fromEntries(SK.map(k => [k, E.parseScorecard(j, k, subject, 'https://scorecard.dev/viewer/?uri=' + subject, '2026-11-05')])) as Record<typeof SK[number], any>;
const rd = readAll(scDash, 'github.com/dashevo/dashcore-lib'), ro = readAll(scOssf, 'github.com/ossf/scorecard');
const wantDash = { 'scorecard-review': 'partly', 'scorecard-branch': 'yes', 'scorecard-token': 'open', 'scorecard-signed': 'open', 'scorecard-provenance': 'open', 'scorecard-updates': 'open', 'scorecard-policy': 'open' };
const wantOssf = { 'scorecard-review': 'partly', 'scorecard-branch': 'yes', 'scorecard-token': 'yes', 'scorecard-signed': 'yes', 'scorecard-provenance': 'yes', 'scorecard-updates': 'yes', 'scorecard-policy': 'yes' };
for (const k of SK) {
  if (rd[k].allows !== (wantDash as any)[k]) bad('Scorecard, dashcore-lib: ' + k + ' should allow ' + (wantDash as any)[k] + ', allows ' + rd[k].allows + ': ' + rd[k].found);
  if (ro[k].allows !== (wantOssf as any)[k]) bad('Scorecard, ossf/scorecard: ' + k + ' should allow ' + (wantOssf as any)[k] + ', allows ' + ro[k].allows + ': ' + ro[k].found);
  if (!rd[k].unseen || !/^https:\/\/scorecard\.dev\/viewer\/\?uri=github\.com\//.test(rd[k].url)) bad('Scorecard: ' + k + ' does not say what the record cannot show, or links somewhere else');
}
if (!/force pushes and deletion are blocked on master/.test(rd['scorecard-branch'].found) || !/scan of 2026-11-02/.test(rd['scorecard-branch'].found)) bad('Scorecard: the branch reading does not name the branch or the scan date: ' + rd['scorecard-branch'].found);
if (!/17\/30 approved changesets/.test(rd['scorecard-review'].found) || /--/.test(rd['scorecard-review'].found)) bad('Scorecard: the review reading does not quote the count plainly: ' + rd['scorecard-review'].found);
if (!/1 workflow sets no top-level permissions/.test(rd['scorecard-token'].found)) bad('Scorecard: the token reading does not say why it is open: ' + rd['scorecard-token'].found);
if (!/did not run in Scorecard’s scan of 2026-11-02: “no releases found”\./.test(rd['scorecard-signed'].found)) bad('Scorecard: a check that did not run is not said plainly: ' + rd['scorecard-signed'].found);
if (!/did not run Dependency-Update-Tool/.test(rd['scorecard-updates'].found)) bad('Scorecard: a check the weekly scan leaves out is not said plainly: ' + rd['scorecard-updates'].found);
/* StepSAFE's own public copy, read the way its record page reads it (views/TrustView.tsx), against its own answers
   (content/own.ts): the scan backs No for review, Yes for token permissions and Yes for the policy, and settles the
   other four. Branch-Protection could not run with the scan's token, and the page says so without quoting the error. */
const scOwn = fx('scorecard-stepsafe.json');
const rs = readAll(scOwn, 'github.com/InitiumBuilders/StepSAFE');
const wantOwn = { 'scorecard-review': 'no', 'scorecard-branch': 'open', 'scorecard-token': 'yes', 'scorecard-signed': 'open', 'scorecard-provenance': 'open', 'scorecard-updates': 'open', 'scorecard-policy': 'yes' };
for (const k of SK) if (rs[k].allows !== (wantOwn as any)[k]) bad('Scorecard, StepSAFE: ' + k + ' should allow ' + (wantOwn as any)[k] + ', allows ' + rs[k].allows + ': ' + rs[k].found);
if (rs['scorecard-branch'].found !== 'Branch-Protection did not run in Scorecard’s scan of 2026-11-15.') bad('Scorecard, StepSAFE: a check stopped by the scan’s token should say it did not run, and quote no error: ' + rs['scorecard-branch'].found);
if (!/^Token-Permissions scored 10 of 10 in Scorecard’s scan of 2026-11-15: “GitHub workflow tokens follow principle of least privilege”\.$/.test(rs['scorecard-token'].found)) bad('Scorecard, StepSAFE: the token reading is off: ' + rs['scorecard-token'].found);
{
  const { CODE_ANSWERS } = await import('./src/content/own');
  const { ITEMS } = await import('./src/content/check/code');
  const tally = { backs: 0, against: 0, open: 0 };
  for (const item of ITEMS) {
    if (!item.evidence || !E.isScorecardKind(item.evidence)) continue;
    const a = CODE_ANSWERS[item.id]?.answer, r = rs[item.evidence as typeof SK[number]];
    if (!a) { bad('Scorecard, StepSAFE: ' + item.id + ' has no answer of StepSAFE’s own to set beside its reading'); continue; }
    if (E.contradicts(a, r)) tally.against++; else if (E.shownBy(a, r)) tally.backs++; else tally.open++;
  }
  if (tally.backs !== 3 || tally.against !== 0 || tally.open !== 4) bad('Scorecard, StepSAFE: its scan should back 3 of StepSAFE’s answers, disagree with none and settle none of the other 4: ' + JSON.stringify(tally));
}
/* mutants: each must move the answer the record allows */
const withCheck = (j: any, name: string, patch: any) => ({ ...j, checks: j.checks.map((c: any) => (c.name === name ? { ...c, ...patch } : c)) });
const mBranch = E.parseScorecard(withCheck(scDash, 'Branch-Protection', { details: scDash.checks.find((c: any) => c.name === 'Branch-Protection').details.map((d: string) => d.replace("Info: 'force pushes' disabled", "Warn: 'force pushes' enabled")) }), 'scorecard-branch', 'x', 'https://x');
if (mBranch.allows !== 'partly' || !/force pushes allowed, deletion blocked/.test(mBranch.found)) bad('Scorecard mutant: force pushes enabled should allow Partly and say so: ' + mBranch.found);
if (E.parseScorecard(withCheck(scDash, 'Branch-Protection', { score: 0, details: [] }), 'scorecard-branch', 'x', 'https://x').allows !== 'no') bad('Scorecard mutant: branch protection at 0 should allow No');
if (E.parseScorecard(withCheck(scDash, 'Code-Review', { score: 10 }), 'scorecard-review', 'x', 'https://x').allows !== 'yes') bad('Scorecard mutant: every change reviewed should allow Yes');
if (E.parseScorecard(withCheck(scDash, 'Code-Review', { score: 0 }), 'scorecard-review', 'x', 'https://x').allows !== 'no') bad('Scorecard mutant: no change reviewed should allow No');
if (E.parseScorecard(withCheck(scOssf, 'Code-Review', { score: -1, reason: 'internal error: x' }), 'scorecard-review', 'x', 'https://x').allows !== 'open') bad('Scorecard mutant: a check that could not run should be open');
if (E.parseScorecard(withCheck(scOssf, 'Signed-Releases', { score: 8 }), 'scorecard-provenance', 'x', 'https://x').allows !== 'open' || E.parseScorecard(withCheck(scOssf, 'Signed-Releases', { score: 8 }), 'scorecard-signed', 'x', 'https://x').allows !== 'yes') bad('Scorecard mutant: signatures without provenance should back signing and leave provenance open');
if (E.parseScorecard(withCheck(scOssf, 'Security-Policy', { score: 4 }), 'scorecard-policy', 'x', 'https://x').allows !== 'open') bad('Scorecard mutant: a policy with no contact should be open, since private reporting can be on in settings');
if (E.parseScorecard({ checks: [] }, 'scorecard-review', 'x', 'https://x').allows !== 'open') bad('Scorecard mutant: an empty result should be open');
const open = { allows: 'open' } as any;
if (E.contradicts('yes', open) || E.shownBy('yes', open) || E.shownBy('no', open)) bad('the rules: an open reading should neither back nor limit an answer');
if (E.cleanRepo('https://github.com/DashEvo/dashcore-lib/tree/master') !== 'github.com/DashEvo/dashcore-lib' || E.cleanRepo('dashevo/dashcore-lib.git') !== 'github.com/dashevo/dashcore-lib' || E.cleanRepo('github.com/-x/y') !== null || E.cleanRepo('not a repo') !== null || E.cleanRepo('a/..') !== null) bad('repositories: cleaning is off');
const recOpen = checkRecord({ id: 'o', kind: 'code', project: 'Probe', answers: { 'token-perms': 'yes', review: 'yes' }, evidence: { 'token-perms': rd['scorecard-token'], review: rd['scorecard-review'] }, at: Date.UTC(2026, 10, 5) } as any, name);
if (!/The public record: Token-Permissions scored 0 of 10/.test(recOpen) || !/Said, and the public record allows Partly at most: Code-Review/.test(recOpen)) bad('the record does not set an open reading apart from a limiting one');

/* 4d. the launch record: every check's newest finished run, the gaps across them, what changed since the run before */
const { launchOf, launchRecord } = await import('./src/lib/check');
const day = (n: number) => Date.UTC(2026, 10, n, 12);
const C = checkKind('code');
const runs: any[] = [
  { id: 'a1', kind: 'accounts', project: 'Probe', answers: { ...all(A, 'yes'), 'dns-signin': 'no', 'cert-watch': 'no' }, at: day(1), done: day(1) },
  { id: 'a2', kind: 'accounts', project: 'Probe', answers: { ...all(A, 'yes'), 'dns-signin': 'yes', 'cert-watch': 'no', 'backup-codes': 'partly' }, at: day(3), done: day(3) },
  { id: 'a3', kind: 'accounts', project: 'Probe', answers: { 'dns-signin': 'no' }, at: day(4) },
  { id: 'c1', kind: 'code', project: 'Probe', answers: { ...all(C, 'yes'), signed: 'no', sbom: 'unsure' }, at: day(2), done: day(2) },
];
const LP = launchOf(runs, CHECKS);
if (LP.runs.find(r => r.kind.id === 'accounts')?.run?.id !== 'a2') bad('the launch record should read the newest finished run, not a newer one still open');
if (LP.finished !== 2 || LP.runs.filter(r => r.run).length !== 2) bad('the launch record miscounts the checks run');
const ch = LP.changes.find(x => x.kind.id === 'accounts');
if (!ch || ch.closed.map(i => i.id).join() !== 'dns-signin' || ch.opened.map(i => i.id).join() !== 'backup-codes') bad('since the run before: closed should be dns-signin and opened backup-codes: ' + JSON.stringify(ch && [ch.closed.map(i => i.id), ch.opened.map(i => i.id)]));
if (LP.gaps[0]?.item.weight !== 3 || LP.gaps.map(g => g.item.weight).some((w, i, a) => i && w > a[i - 1])) bad('the launch gaps are not deepest first across the checks');
if (LP.held !== 20 || LP.applies !== 24) bad('the launch tally is off: held ' + LP.held + ' of ' + LP.applies);
const LR = launchRecord(runs, CHECKS, name, day(5));
if (!/^# Launch record: Probe/.test(LR) || !/Checks finished: 2 of 5/.test(LR) || !/## Since the run before/.test(LR) || !/closed DNS accounts sign in strongly; opened backup codes are kept/.test(LR)) bad('the launch record lacks its title, its count or what changed');
if (!/\n## Accounts and access check: Probe/.test(LR) || !/\n### The domain/.test(LR) || !/Ten-minute treasury check: not run/.test(LR)) bad('the launch record does not carry each check in full, one heading down, or name the checks not run');
for (const i of C.items) if (!LR.includes(i.ask)) bad('the launch record is missing a code statement: ' + i.id);
const scE = scoreCheck({ answers: { ...all(T, 'yes') }, evidence: { 'two-agree': agree, 'lose-one': { ...agree, kind: 'multisig-spare' } } as any });
if (scE.shown !== 2 || scE.readable !== 2 || scE.contradicted.length) bad('scoring: two answers backed by a record should count as shown: ' + scE.shown);
const scA = scoreCheck({ kind: 'accounts', answers: { 'domain-lock': 'yes' }, evidence: { 'domain-lock': dashOrg } as any });
if (scA.contradicted.join() !== 'domain-lock' || scA.shown !== 0) bad('scoring: Yes against a record that allows Partly should be a contradiction');
const recE = checkRecord({ id: 'e', kind: 'accounts', project: 'Probe', answers: { 'domain-lock': 'yes' }, evidence: { 'domain-lock': dashOrg }, at: Date.UTC(2026, 10, 4) } as any, name);
if (!/Said, and the public record allows Partly at most: The transfer lock is set/.test(recE) || !/Shown by a public record: 0 of 12/.test(recE) || !/read each link again/.test(recE)) bad('the record does not mark a contradicted answer, its summary or its limits');

/* 4e. the loop into the corpus: every statement names the lessons that teach its move; each resolves; done lessons offer a re-check */
const { LEARN } = await import('./src/content/check/learn');
const L4 = await import('./src/lib/learn');
const fresh = { completedSteps: {}, guidesRead: {}, gauges: {}, completedSims: {}, mode: 'novus' } as any;
const statementIds = CHECKS.flatMap(k => k.items.map(i => i.id));
for (const id of statementIds) if (!(id in LEARN)) bad('the loop: statement ' + id + ' has no entry in content/check/learn.ts (an empty list marks a thin place)');
const thin: string[] = [];
let linked = 0;
for (const [id, ls] of Object.entries(LEARN)) {
  if (!statementIds.includes(id)) bad('the loop: learn.ts names a statement that does not exist: ' + id);
  if (ls.length > 3) bad('the loop: ' + id + ' names more than three lessons');
  if (new Set(ls).size !== ls.length) bad('the loop: ' + id + ' names a lesson twice');
  if (!ls.length) thin.push(id);
  for (const l of ls) {
    if (!L4.lessonOf(l, fresh)) bad('the loop: ' + id + ' names a lesson that does not resolve: ' + l);
    if (l.startsWith('ol-')) bad('the loop: ' + id + ' names a Step in the hidden chapter, which a learner cannot open: ' + l);
    linked++;
  }
}
const ex = LEARN['two-agree'];
const doneAll = { ...fresh, completedSteps: { 'ch-chain-safe-mpc': 1 }, guidesRead: { 'sg-safe-signer-operations': 1 }, gauges: { 'tr-tidewater': { best: 1 } } };
if (!L4.readyToRecheck('two-agree', doneAll) || L4.readyToRecheck('two-agree', { ...doneAll, guidesRead: {} }) || L4.readyToRecheck('domain-lock', doneAll) || ex.length !== 3) bad('the loop: a re-check should be offered only when every lesson for a gap is done');
if (L4.lessonsFor('two-agree', doneAll).map(l => l.kind).join() !== 'step,guide,gauge') bad('the loop: lesson kinds are read from their ids');
const viewSrc = readFileSync('src/views/CheckView.tsx', 'utf8');
if (!/   Lessons: Step: Safe Multisig, MPC, and the Delegatecall Foot-Gun \(The Chain Does Not Forgive\); StepGuide: Multisig Signer Operations/.test(rec)) bad('the loop: the record does not give a gap its lessons');
if (!/   Lessons: /.test(LR)) bad('the loop: the launch record does not give its gaps their lessons');
if (!/lessonsFor\(item\.id, st\)/.test(viewSrc) || !/className="ck-learn"/.test(viewSrc) || !/ck-recheck/.test(viewSrc)) bad('the loop: a gap\'s move does not show its lessons or the re-check');
console.log('the loop: ' + linked + ' lesson links over ' + (statementIds.length - thin.length) + ' of ' + statementIds.length + ' statements; thin, with no lesson yet: ' + (thin.join(', ') || 'none'));

/* 4f. the spine: every core page read for its CSF function, once; the table printed, the thin functions named */
const { SPINE, GUIDE_SPINE, FN_ORDER } = await import('./src/content/check/spine');
const { GUIDES: ALL_GUIDES } = await import('./src/content/index');
for (const g of ALL_GUIDES) if (!FN_ORDER.includes(GUIDE_SPINE[g.id])) bad('the spine: StepGuide ' + g.id + ' is not read for its CSF function');
for (const id of Object.keys(GUIDE_SPINE)) if (!ALL_GUIDES.some((g: any) => g.id === id)) bad('the spine: names a StepGuide that does not exist: ' + id);
const { spineCoverage } = await import('./src/lib/spine');
const { CHAPTERS: CORE } = await import('./src/content/index');
const corePages = CORE.flatMap((c: any) => c.pages.map((p: any) => p.id));
for (const id of corePages) if (!SPINE[id]) bad('the spine: core page ' + id + ' is not read for its CSF function');
for (const [id, v] of Object.entries(SPINE)) {
  if (!corePages.includes(id)) bad('the spine: names a page that is not a core page: ' + id);
  if (!FN_ORDER.includes(v.fn) || (v.also && (!FN_ORDER.includes(v.also) || v.also === v.fn))) bad('the spine: a page with no valid function, or the same one twice: ' + id);
}
const cov = spineCoverage();
if (cov.reduce((n, f) => n + f.first.length, 0) !== corePages.length || cov.reduce((n, f) => n + f.guides.length, 0) !== ALL_GUIDES.length || cov.reduce((n, f) => n + f.statements, 0) !== statementIds.length) bad('the spine: the table does not add up to every page, every StepGuide and every statement');
console.log('the spine (' + corePages.length + ' pages, ' + ALL_GUIDES.length + ' StepGuides, ' + statementIds.length + ' statements):');
for (const f of cov) console.log('  ' + f.fn + ' ' + f.name.padEnd(9) + ' pages first ' + String(f.first.length).padStart(2) + ', in part ' + String(f.also.length).padStart(2) + ' | guides ' + String(f.guides.length).padStart(2) + ' | statements ' + String(f.statements).padStart(2) + (f.thin ? '   THIN' : ''));
console.log('the spine, thin for August: ' + (cov.filter(f => f.thin).map(f => f.name + ' (' + f.first.length + ' page' + (f.first.length === 1 ? '' : 's') + ' and ' + f.guides.length + ' guide' + (f.guides.length === 1 ? '' : 's') + ' first, ' + f.statements + ' statements)').join('; ') || 'none'));
if (!/spineCoverage\(\)/.test(viewSrc) || !/className="ck-spine panel"/.test(viewSrc)) bad('the spine is not shown where a learner can see it');

/* 5. the copy */
for (const f of ['src/lib/evidence.ts', 'src/content/check/treasury.ts', 'src/content/check/accounts.ts', 'src/content/check/code.ts', 'src/content/check/people.ts', 'src/content/check/incident.ts', 'src/content/check/learn.ts', 'src/lib/learn.ts', 'src/content/check/spine.ts', 'src/lib/spine.ts', 'src/content/check/index.ts', 'src/content/check/types.ts', 'src/lib/check.ts', 'src/lib/checkstore.ts', 'src/views/CheckView.tsx', 'src/components/CheckRing.tsx', 'src/content/awards/check.ts', 'src/styles/check.css']) {
  const s = readFileSync(f, 'utf8');
  const m = s.match(/[–—]/);
  if (m) bad(f + ' has a dash: ...' + s.slice(Math.max(0, m.index! - 40), m.index! + 20).replace(/\n/g, ' ') + '...');
}

const items = CHECKS.flatMap(k => k.items);
console.log('checks ' + CHECKS.length + ' | statements ' + items.length + ' | structures ' + new Set(items.flatMap(i => i.models)).size + ' | sources ' + new Set(items.flatMap(i => i.sources.map(s => s.url))).size + ' | CSF categories ' + new Set(items.map(i => i.csf)).size + ' | oldest source check ' + oldest + ' (' + stalest + ')');
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
