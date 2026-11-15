/* THE PUBLIC PROMISES, held to what is true. StepSAFE teaches vulnerability disclosure, privacy notices and access;
   these are the site's own: /.well-known/security.txt (RFC 9116) and the three pages it points to, the software bill
   of materials, robots.txt, and the offline worker that must not keep a policy page as the app.
     npx tsx probe-trust.mts
   PROBLEMS fail the gate. PENDING names what waits for a person (the security contact), and scripts/ship.sh refuses
   to ship while it waits. */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const problems: string[] = [];
const pending: string[] = [];
let checks = 0;
const ok = (cond: boolean, msg: string) => { checks++; if (!cond) problems.push(msg); };
const read = (p: string) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const TOKEN = '[[SECURITY CONTACT]]';
const SITE = 'https://unitium-safe.vercel.app';

/* ---- security.txt ---- */
const st = read('public/.well-known/security.txt');
ok(!!st, 'public/.well-known/security.txt exists');
const field = (name: string) => (st.match(new RegExp('^' + name + ':\\s*(.+)$', 'mi')) || [])[1]?.trim() || '';
const contact = field('Contact');
ok(/^(mailto:|https:\/\/)/.test(contact), 'security.txt has a Contact that is a mailto: or https: address');
if (contact.includes(TOKEN)) pending.push('the security contact: replace ' + TOKEN + ' in public/.well-known/security.txt and the three policy pages');
const exp = Date.parse(field('Expires'));
ok(Number.isFinite(exp) && exp > Date.now(), 'security.txt Expires is a date in the future');
ok(Number.isFinite(exp) && exp - Date.now() <= 366 * 864e5, 'security.txt Expires is less than a year away (RFC 9116 recommends it)');
ok(field('Policy') === SITE + '/security.html', 'security.txt Policy points to /security.html');
ok(field('Canonical') === SITE + '/.well-known/security.txt', 'security.txt Canonical is its own address');
ok(/^en\b/.test(field('Preferred-Languages')), 'security.txt names its language');

/* ---- the three pages ---- */
const PAGES = ['security', 'privacy', 'accessibility'];
for (const name of PAGES) {
  const html = read('public/' + name + '.html');
  ok(!!html, 'public/' + name + '.html exists');
  if (!html) continue;
  ok(/<html lang="en">/.test(html), name + '.html declares its language');
  ok((html.match(/<h1[\s>]/g) || []).length === 1, name + '.html has exactly one h1');
  ok(/<title>[^<]{3,}<\/title>/.test(html), name + '.html has a title');
  ok(!/<script\b/i.test(html), name + '.html runs no script');
  ok(!/https?:\/\/(?!unitium-safe\.vercel\.app)[^"'\s)]+\.(css|woff2?|js)\b|fonts\.googleapis|<link[^>]+stylesheet/i.test(html), name + '.html loads nothing from another site');
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const p = m[1];
    ok(p === '/' || p === '/trust' || existsSync('public' + p) || existsSync('public' + p.replace(/\/$/, '') + '.html'), name + '.html links ' + p + ', which exists');
  }
  if (html.includes(TOKEN) && !pending.length) pending.push('the security contact in ' + name + '.html');
  const mail = [...html.matchAll(/mailto:([^"]+)"/g)].map((m) => m[1]);
  ok(mail.every((a) => 'mailto:' + a === contact), name + '.html writes to the same address as security.txt');
}

/* ---- the privacy page names every outside service the content security policy allows ---- */
const vercel = JSON.parse(read('vercel.json') || '{}');
const csp = String(((vercel.headers || []).flatMap((h: any) => h.headers || []).find((h: any) => /content-security-policy/i.test(h.key)) || {}).value || '');
ok(!!csp, 'vercel.json carries the content security policy');
const connect = ((csp.match(/connect-src([^;]*)/) || [])[1] || '').trim().split(/\s+/).filter((h) => /^https:\/\//.test(h));
const NAMED: Record<string, string> = {
  'api.anthropic.com': 'api.anthropic.com', 'api.elevenlabs.io': 'api.elevenlabs.io', 'en.wikipedia.org': 'Wikipedia', 'wikimedia.org': 'Wikimedia',
  'hn.algolia.com': 'hn.algolia.com', 'api.stackexchange.com': 'Stack Exchange', 'api.openalex.org': 'OpenAlex', 'davara.dev': 'davara.dev', '*.davara.dev': 'davara.dev',
  'rdap.publicinterestregistry.org': 'Public Interest Registry', 'rdap.verisign.com': 'Verisign', 'rdap.identitydigital.services': 'Identity Digital',
  'rdap.centralnic.com': 'CentralNic', 'pubapi.registry.google': 'Google Registry', 'insight.dash.org': 'insight.dash.org', 'www.dashsupport.team': 'www.dashsupport.team',
  'api.scorecard.dev': 'OpenSSF Scorecard', 'dns.google': 'dns.google', 'platform-explorer.pshenmic.dev': 'platform-explorer.pshenmic.dev', 'testnet.platform-explorer.pshenmic.dev': 'testnet',
  'api.osv.dev': 'api.osv.dev',
};
const privacy = read('public/privacy.html');
for (const h of connect) {
  const host = h.replace(/^https:\/\//, '');
  ok(!!NAMED[host], 'probe-trust knows the service ' + host + ' (add it to NAMED, and to the privacy page)');
  if (NAMED[host]) ok(privacy.includes(NAMED[host]), 'the privacy page names ' + host + ' (as "' + NAMED[host] + '")');
}
const googleFonts = /fonts\.googleapis\.com/.test(csp);
ok(googleFonts === /Google Fonts/.test(privacy), googleFonts ? 'the privacy page says the fonts load from Google' : 'the privacy page no longer says the fonts load from Google, since they do not');

/* ---- the offline worker keeps only the app ---- */
const sw = read('public/sw.js');
const nav = (sw.match(/if \(req\.mode === 'navigate'\) \{[\s\S]*?\n {2}\}/) || [''])[0];
ok(/\\\.\[a-z0-9\]\{2,5\}\$\/i\.test\(url\.pathname\)\) return;/.test(nav), 'sw.js lets a page with a file name pass through, unkept');
ok(/r\.ok && \/text\\\/html\/i\.test\(r\.headers\.get\('content-type'\)/.test(nav), 'sw.js keeps the app only from a good answer that is a page');

/* ---- robots.txt, the bill of materials, and the way in from Settings ---- */
ok(/^User-agent:/m.test(read('public/robots.txt')), 'public/robots.txt exists');
let sbomSame = false;
try { execFileSync('node', ['scripts/sbom.mjs', '--check'], { stdio: 'pipe' }); sbomSame = true; } catch { sbomSame = false; }
ok(sbomSame, 'public/sbom.cdx.json matches package-lock.json (node scripts/sbom.mjs)');
const settings = read('src/views/SettingsView.tsx');
for (const name of PAGES) ok(settings.includes('href="/' + name + '.html"'), 'Settings links /' + name + '.html');

/* ---- the built site, when there is one ---- */
if (existsSync('dist/index.html')) {
  for (const f of ['.well-known/security.txt', 'security.html', 'privacy.html', 'accessibility.html', 'robots.txt', 'sbom.cdx.json'])
    ok(existsSync('dist/' + f), 'the build carries /' + f);
}

console.log('trust: ' + checks + ' checks | services named on the privacy page ' + connect.length + ' | sbom ' + (sbomSame ? 'matches the lockfile' : 'differs'));
if (pending.length) console.log('PENDING (' + pending.length + '): ' + pending.join('; '));
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.map((p) => '  ' + p).join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
