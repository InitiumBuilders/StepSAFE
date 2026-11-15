/* The treasury check, walked in a real browser against the built site under its real headers: the ring and the
   one statement in front, answered by key and by tap; the result and its gaps; the closed ring when every
   statement holds; and the seal attacked: a plain-text record from an earlier version, the export, a hostile
   restore, a reload, the seal, a wrong passphrase, a second tab, Lock now. Then a phone, reduced motion, the
   contrast of the page's own ink, the Content-Security-Policy and the console.
     node scripts/serve-dist.mjs 5189 &   then   node probe-check-walk.mjs [base] */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const errors = [], csp = [];
const LEGACY = 'Legacy Plaintext Treasury';
const PASS = 'probe passphrase for the treasury';
const MIXED = ['y', 'p', 'y', 'n', 'n', 'y', 's', 'n', 'y', 'n', 's', 'd'];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function context(opts = {}, seed = {}) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, ...opts });
  await c.addInitScript(([seed]) => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', ...seed }));
  }, [seed]);
  return c;
}
async function newPage(c, tag) {
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(tag + ': ' + String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(tag + ': ' + m.text().slice(0, 200)); });
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  return p;
}
const collect = async (p, tag) => (await p.evaluate(() => window.__csp.splice(0))).forEach((v) => csp.push(tag + ': ' + v));
const toCheck = async (p, kind = 'treasury') => {
  await p.evaluate(() => [...document.querySelectorAll('.ck-door .btn')][0]?.click());
  await p.waitForSelector('.ck h1', { timeout: 15000 }); await p.waitForTimeout(500);
  if (await p.locator('.ck-hub').count()) { await p.locator('.ck-hub-open[data-kind="' + kind + '"]').click(); await p.waitForTimeout(500); }
};
const begin = async (p, name) => {
  await p.locator('[data-ck-begin]').click();
  await p.waitForSelector('.ck-card', { timeout: 8000 });
  if (name) await p.fill('.ck-name input', name);
  await p.evaluate(() => document.activeElement?.blur());
};
const item = (p) => p.evaluate(() => document.querySelector('.ck-card')?.getAttribute('data-item'));
/* answer by key, as a project would: a held statement moves on by itself, a gap waits for Enter */
async function answerAll(p, keys) {
  for (const k of keys) {
    const before = await item(p);
    await p.keyboard.press(k);
    await p.waitForTimeout(k === 'y' || k === 'd' ? 520 : 260);
    if (k !== 'y' && k !== 'd') { await p.keyboard.press('Enter'); await p.waitForTimeout(380); }
    /* a held answer on a statement a record can show waits, so the record can be read; Enter carries on */
    else if ((await p.locator('.ck-card').count()) && (await item(p)) === before) { await p.keyboard.press('Enter'); await p.waitForTimeout(380); }
  }
  await p.waitForTimeout(700);
}
const storageHas = (p, needle) => p.evaluate((n) => [...Object.keys(localStorage).map((k) => localStorage.getItem(k)), ...Object.keys(sessionStorage).map((k) => sessionStorage.getItem(k))].some((v) => (v || '').includes(n)), needle);

/* ---------- 1. the flow ---------- */
console.log('-- the ring and the statement in front');
{
  const c = await context();
  const p = await newPage(c, 'flow');
  ok(/Checks before launch/.test(await p.evaluate(() => document.querySelector('.ck-door')?.innerText || '')) && (await p.locator('.ck-door .ck-ring.mini').count()) === 1, 'Ground shows the checks with a small ring');
  await p.evaluate(() => [...document.querySelectorAll('.ck-door .btn')][0]?.click());
  await p.waitForSelector('.ck-hub', { timeout: 15000 });
  const kinds = await p.evaluate(() => [...document.querySelectorAll('.ck-hub-open')].map((b) => b.getAttribute('data-kind')).join(','));
  ok(kinds === 'treasury,accounts,code,people,incident' && !(await p.locator('.ck-planned').count()), 'the list holds the five checks, in the order a project meets them, and no planned line: ' + kinds);
  ok(/No check run yet/.test(await p.locator('.ck-launch').innerText()) && /Begin a check and its answers join the record here/.test(await p.locator('.ck-launch').innerText()), 'before any run, the launch record says how it fills');
  const row = await p.evaluate(() => [...document.querySelectorAll('.ck-hub-card')].map((x) => Math.round(x.getBoundingClientRect().top)));
  ok(new Set(row).size === 1, 'at 1440 the five rings stand in one row: ' + row.join(','));
  await p.locator('.ck-hub-open[data-kind="treasury"]').click(); await p.waitForTimeout(500);
  ok(await p.evaluate(() => document.querySelectorAll('.ck-hero .ck-seg').length === 12), 'before a check, the ring holds twelve arcs');
  await begin(p, 'Walk Treasury');
  ok((await item(p)) === 'two-agree' && /Statement 1 of 12/.test(await p.locator('.ck-count').innerText()), 'Begin puts statement 1 in front');
  await p.keyboard.press('y'); await p.waitForTimeout(520);
  ok((await item(p)) === 'two-agree' && (await p.locator('.ck-card .ck-ev').count()) === 1, 'a statement a public record can show waits after Yes, with the record beside it');
  ok(await p.evaluate(() => document.querySelector('.ck-aside .ck-seg')?.classList.contains('s-yes')), 'the first arc is lit');
  await p.keyboard.press('Enter'); await p.waitForTimeout(380);
  ok((await item(p)) === 'independent', 'Enter carries on to the next statement');
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(300); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
  await p.keyboard.press('p'); await p.waitForTimeout(300);
  ok((await item(p)) === 'independent' && (await p.locator('.ck-card .ck-move').count()) === 1, 'Partly waits on the statement and shows its move');
  ok(await p.evaluate(() => /Next statement/.test(document.activeElement?.textContent || '')), 'the gap puts the next step under Enter');
  await p.keyboard.press('Enter'); await p.waitForTimeout(380);
  ok((await item(p)) === 'hardware', 'Enter carries on');
  await p.locator('.ck-aside .ck-seg[aria-label^="12."]').click();
  await p.waitForTimeout(350);
  ok((await item(p)) === 'masternode' && (await p.locator('.ck-card .ck-ans.o-na').count()) === 1, 'an arc of the ring opens its statement, with Does not apply where it can');
  await p.keyboard.press('d'); await p.waitForTimeout(520);
  ok((await item(p)) === 'hardware', 'after a held answer the ring returns to the next statement still open');
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(300);
  ok((await item(p)) === 'independent', 'the left arrow goes back');
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
  await answerAll(p, ['y', 'n', 'n', 'y', 's', 'n', 'y', 'n', 's']);
  ok((await p.locator('.ck-result').count()) === 1, 'the last answer brings the result');
  const center = await p.evaluate(() => document.querySelector('.ck-result .ck-ring-num')?.innerText.replace(/\n/g, ' '));
  ok(/^4\s+of 11\s*held$/.test(center || ''), 'the ring counts what holds, out of what applies: ' + center);
  ok(/Walk Treasury/.test(await p.locator('.ck-held h2').innerText()), 'the result carries the project name');
  const gaps = await p.locator('.ck-gaps li').count();
  ok(gaps === 7, 'seven gaps, deepest first: ' + gaps);
  await p.locator('.ck-gaps li button').first().click(); await p.waitForTimeout(400);
  ok((await item(p)) === 'independent', 'a gap opens its statement');
  ok(await p.evaluate(() => document.querySelectorAll('.ck-aside .ck-seg.s-no').length === 4 && document.querySelectorAll('.ck-aside .ck-seg.s-unsure').length === 2 && document.querySelectorAll('.ck-aside .ck-seg.s-na').length === 1), 'the ring draws No as a break, Not sure dashed, Does not apply as a hairline');
  await p.locator('.ck-aside .ck-seg[aria-label^="7."]').hover(); await p.waitForTimeout(260);
  ok(/Address and amount on the device/.test(await p.locator('.ck-aside .ck-ring-c').innerText()), 'resting on an arc names its statement in the ring');

  await p.mouse.move(5, 5); await p.waitForTimeout(250);
  const low = (await contrastOf(p)).filter(([, r]) => r < 4.5);
  ok(!low.length, 'night: every ink on the check computes 4.5:1 or better' + (low.length ? ': ' + low.map(([s, r]) => s + ' ' + r).join(', ') : ''));
  console.log('     night ink: ' + (await contrastOf(p)).map(([s, r]) => s.replace('.ck-', '') + ' ' + r).join(', '));
  await collect(p, 'flow');
  await c.close();
}

/* ---------- 1b. the daylight and Mov themes, measured the same way ---------- */
for (const theme of ['meridian', 'mov']) {
  const c = await context({}, { theme });
  const p = await newPage(c, theme);
  await toCheck(p); await begin(p, 'Theme Treasury');
  await p.keyboard.press('n'); await p.waitForTimeout(400);
  const r = await contrastOf(p);
  const low = r.filter(([, x]) => x < 4.5);
  ok(!low.length, theme + ': every ink on the check computes 4.5:1 or better: ' + r.map(([s, x]) => s.replace('.ck-', '') + ' ' + x).join(', '));
  await collect(p, theme);
  await c.close();
}

/* the page's own ink, computed against what it sits on */
async function contrastOf(p, sels) {
  return p.evaluate((sels) => {
    /* rgb(r g b / a) on 0-255, or color(srgb r g b / a) on 0-1, as color-mix() reports it */
    const rgb = (s) => { const n = (s.match(/[\d.]+/g) || []).map(Number); if (/^color\(srgb/.test(s)) return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1]; return n; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const ground = (el) => { let base = rgb(getComputedStyle(document.documentElement).getPropertyValue('--ground').trim().replace(/^#(..)(..)(..)$/, (m, r, g, b) => parseInt(r, 16) + ',' + parseInt(g, 16) + ',' + parseInt(b, 16))); if (base.length < 3) base = [5, 10, 30]; const stack = []; for (let n = el; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c[3] ?? 1) > 0) stack.push(c); } for (const c of stack.reverse()) { const a = c[3] ?? 1; base = base.map((v, i) => v * (1 - a) + c[i] * a); } return base; };
    const out = [];
    for (const sel of sels || ['.ck-ask', '.ck-why', '.ck-chip', '.ck-count', '.ck-csf', '.ck-csf abbr', '.ck-ans span', '.ck-move p', '.ck-move .label', '.ck-partrows strong', '.ck-partrows em', '.ck-partrows b', '.ck-keep-line', '.ck-progress span', '.ck-ring-num span', '.ck-back']) {
      const el = document.querySelector(sel); if (!el) { out.push([sel, 0]); continue; }
      const fg = rgb(getComputedStyle(el).color), bg = ground(el);
      const a = lum(fg), b = lum(bg);
      out.push([sel, +(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(1))]);
    }
    return out;
  }, sels);
}

/* ---------- 2. every statement held: the ring closes ---------- */
console.log('-- the closed ring');
{
  const c = await context();
  const p = await newPage(c, 'held');
  await toCheck(p); await begin(p, 'Held Treasury');
  await answerAll(p, Array(12).fill('y'));
  ok(await p.evaluate(() => !!document.querySelector('.ck-result .ck-ring.closed .ck-ring-whole')), 'every statement held: the ring closes');
  const earned = await p.evaluate(() => document.querySelector('.ck-result .ck-earned')?.innerText || '');
  ok(/Held, By Our Own Account/.test(earned) && /The Treasury, Read/.test(earned), 'the result shows both milestones in place, and the all-held one names whose account it is: ' + earned.replace(/\n/g, ' | '));
  ok((await p.locator('.toast').count()) === 0, 'no toast covers the ring as it closes');
  await collect(p, 'held');
  await c.close();
}

/* ---------- 2b. the accounts and access check ---------- */
console.log('-- accounts and access');
{
  const c = await context({ permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await newPage(c, 'accounts');
  await toCheck(p, 'accounts');
  ok(/The accounts and access check/.test(await p.locator('.ck h1').innerText()), 'the list opens the accounts and access check');
  await begin(p, 'Accounts Treasury');
  ok((await item(p)) === 'domain-lock' && /The domain/.test(await p.locator('.ck-chip').innerText()), 'its first statement is about the domain');
  ok(/NIST CSF PR\.PS/.test(await p.locator('.ck-csf').innerText()) && /sources read 20\d\d-\d\d-\d\d/.test(await p.locator('.ck-csf').innerText()), 'each statement names its CSF category and the day its sources were read');
  await answerAll(p, ['y', 'n', 'y', 's', 'y', 'd', 'p', 'y', 'n', 'y', 'n', 'y']);
  ok((await p.locator('.ck-result').count()) === 1, 'twelve answers bring the result');
  const center = await p.evaluate(() => document.querySelector('.ck-result .ck-ring-num')?.innerText.replace(/\n/g, ' '));
  ok(/^6\s+of 11\s*held$/.test(center || ''), 'the accounts ring counts its own statements: ' + center);
  ok((await p.locator('.ck-gaps li').count()) === 5, 'five gaps, deepest first');
  const first = await p.locator('.ck-gaps li strong').first().innerText();
  ok(/List every account that can change DNS/.test(first), 'the deepest gap is the DNS sign-in: ' + first.slice(0, 60));
  await p.locator('.ck-actions .btn', { hasText: 'Copy the record' }).click(); await p.waitForTimeout(400);
  const rec = await p.evaluate(() => navigator.clipboard.readText());
  ok(/^# Accounts and access check: Accounts Treasury/.test(rec) && /NIST CSF 2\.0: PR\.AA/.test(rec) && /\(checked 20\d\d-\d\d-\d\d\)/.test(rec), 'the record names the check, each gap\'s category, and its sources\' dates');
  ok(/The Accounts, Read/.test(await p.evaluate(() => document.querySelector('.ck-result .ck-earned')?.innerText || '')) && !/Signed In Safely/.test(await p.locator('.ck-result').innerText()), 'the accounts milestone is granted by its own kind, and the all-held one only when all holds');
  await p.locator('.ck-back').click(); await p.waitForTimeout(600);
  const states = await p.evaluate(() => [...document.querySelectorAll('.ck-hub-state')].map((x) => x.innerText));
  ok(/Not run yet/.test(states[0] || '') && /6 of 11 held/.test(states[1] || ''), 'the list shows each check\'s latest run: ' + states.join(' | '));
  /* the launch record joins what has run */
  const launch = await p.locator('.ck-launch').innerText();
  ok(/1 of 5 checks finished/.test(launch) && /Held\s*6\s*of 11/.test(launch) && (await p.locator('.ck-launch .ck-gaps li').count()) === 5, 'the launch record counts the finished check and lists its gaps: ' + launch.slice(0, 120).replace(/\n/g, ' '));
  await p.locator('.ck-launch .btn', { hasText: 'Copy the launch record' }).click(); await p.waitForTimeout(400);
  const lrec = await p.evaluate(() => navigator.clipboard.readText());
  ok(/^# Launch record: Accounts Treasury/.test(lrec) && /Checks finished: 1 of 5/.test(lrec) && /Ten-minute treasury check: not run/.test(lrec) && /\n## Accounts and access check: Accounts Treasury/.test(lrec), 'the launch record names the project, the checks not run, and carries the accounts record in full');
  await p.mouse.move(5, 5); await p.waitForTimeout(200);
  const r = await contrastOf(p, ['.ck-hub-text strong', '.ck-hub-text em', '.ck-hub-state', '.ck-hub-go', '.ck-launch-head .label', '.ck-launch-head h2', '.ck-launch-head .sec', '.ck-launch-tally dt', '.ck-launch-tally dd', '.ck-launch-tally dd small', '.ck-launch .ck-gaps strong', '.ck-launch .ck-gaps em', '.ck-launch .ck-note']);
  const low = r.filter(([, x]) => x < 4.5);
  ok(!low.length, 'the list of checks and the launch record: every ink computes 4.5:1 or better: ' + r.map(([s, x]) => s.replace('.ck-', '') + ' ' + x).join(', '));
  /* a second accounts run: the launch record says what changed since the one before */
  await p.locator('.ck-hub-open[data-kind="accounts"]').click(); await p.waitForTimeout(500);
  await p.locator('.ck-actions .btn', { hasText: 'Start a new check' }).click(); await p.waitForTimeout(400);
  await p.evaluate(() => document.activeElement?.blur());
  await answerAll(p, ['y', 'y', 'y', 'y', 'y', 'd', 'p', 'y', 'n', 'y', 'y', 'y']);
  await p.locator('.ck-back').click(); await p.waitForTimeout(600);
  const since = await p.locator('.ck-launch-changes').innerText().catch(() => '');
  ok(/Accounts and access/.test(since) && /Closed: DNS accounts sign in strongly, new certificates are watched, shared logins kept in a vault\./.test(since), 'since the run before, the launch record names the gaps closed: ' + since.replace(/\n/g, ' ').slice(0, 200));
  await collect(p, 'accounts');
  await c.close();
}

/* ---------- 2c. the public record: shown, and a contradiction ---------- */
console.log('-- the public record');
{
  const c = await context({ permissions: ['clipboard-read', 'clipboard-write'] });
  const fx = (f) => readFileSync('research/evidence/' + f, 'utf8');
  /* saved real responses stand in for the registry and the explorer, so the walk does not depend on a domain's
     state today; the page's own security policy still applies to each request */
  await c.route('https://rdap.publicinterestregistry.org/rdap/domain/**', (r) => r.fulfill({ status: 200, contentType: 'application/rdap+json', headers: { 'access-control-allow-origin': '*' }, body: fx('rdap-dash-org.json') }));
  await c.route('https://insight.dash.org/insight-api/txs**', (r) => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: fx('insight-multisig-txs.json') }));
  const p = await newPage(c, 'record');
  await toCheck(p, 'accounts'); await begin(p, 'Record Project');
  await p.keyboard.press('y'); await p.waitForTimeout(400);
  ok(/The registry will see which domain you asked about/.test(await p.locator('.ck-ev').innerText()), 'before the first read, the page says the registry will see which domain is asked about');
  await p.locator('.ck-ev-form input').fill('https://Dash.org/');
  await p.locator('.ck-ev-form button[type=submit]').click();
  await p.waitForSelector('.ck-ev-found', { timeout: 15000 });
  const found = await p.locator('.ck-ev-found').innerText();
  ok(/The transfer lock is set; the update and delete locks are not/.test(found) && /Read 20\d\d-\d\d-\d\d for dash\.org/.test(found), 'the record is read and said plainly, with the day and the domain');
  ok(/You answered Yes\. The record allows Partly at most\./.test(found), 'a Yes the record does not allow is said plainly');
  ok(await p.evaluate(() => !!document.querySelector('.ck-aside .ck-seg .ck-seg-ev.against')), 'the ring marks the contradiction by shape');
  await p.locator('.ck-ev-against button', { hasText: 'Change my answer to Partly' }).click(); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelector('.ck-ans.o-partly')?.getAttribute('aria-checked') === 'true') && /This record backs your answer/.test(await p.locator('.ck-ev').innerText()), 'the project chooses: the answer moves to Partly, and the record now backs it');
  /* the DNS read takes the domain typed for the locks, keeps a dated copy that settles nothing, and the next
     reading names what changed: a name server is swapped between the two reads */
  let dnsNs = 'owen.ns.cloudflare.com.';
  await c.route('https://dns.google/resolve**', (r) => {
    const t = new URL(r.request().url()).searchParams.get('type');
    const body = JSON.parse(fx('doh-dash-org.json'))[t] || { Status: 0, Answer: [] };
    if (t === 'NS') body.Answer = body.Answer.map((a) => (a.data === 'owen.ns.cloudflare.com.' ? { ...a, data: dnsNs } : a));
    return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  });
  await p.locator('.ck-aside .ck-seg[aria-label^="3."]').click(); await p.waitForTimeout(400);
  ok(/Google will see which domain you asked about/.test(await p.locator('.ck-ev').innerText()) && (await p.locator('.ck-ev-form input').inputValue()) === 'dash.org', 'the DNS statement says Google will see the domain, and takes the domain typed for the locks');
  await p.locator('.ck-ev-form button[type=submit]').click();
  await p.waitForSelector('.ck-ev-found', { timeout: 15000 });
  const dns1 = await p.locator('.ck-ev-found').innerText();
  ok(/The name servers are angela\.ns\.cloudflare\.com and owen\.ns\.cloudflare\.com\./.test(dns1) && /nothing watches while this page is closed/.test(dns1) && /does not settle your answer either way/.test(dns1) && /Read 20\d\d-\d\d-\d\d for dash\.org/.test(dns1), 'the DNS records are read as a dated copy that settles nothing on its own');
  dnsNs = 'ns1.attacker.example.';
  await p.locator('.ck-ev-form button[type=submit]').click(); await p.waitForTimeout(1500);
  const dns2 = await p.locator('.ck-ev-found').innerText();
  ok(/^Changed since the reading of 20\d\d-\d\d-\d\d: added NS ns1\.attacker\.example; removed NS owen\.ns\.cloudflare\.com\./.test(dns2), 'read again, it names the record that changed since the reading before: ' + dns2.split('. ')[0]);
  await p.locator('.ck-aside .ck-to-result').click(); await p.waitForTimeout(500);
  ok(/Shown by a public record: 1 of 12/.test(await p.locator('.ck-shown-line').innerText()), 'the result counts the shown answer');
  await p.locator('.ck-actions .btn', { hasText: 'Copy the record' }).click(); await p.waitForTimeout(400);
  const rec = await p.evaluate(() => navigator.clipboard.readText());
  ok(/Shown: The transfer lock is set/.test(rec) && /rdap\.publicinterestregistry\.org/.test(rec) && /read each link again/.test(rec), 'the record marks the answer Shown, links the registry, and says to read the links again');
  ok(/The public record: Changed since the reading of 20\d\d-\d\d-\d\d: added NS ns1\.attacker\.example/.test(rec) && /<https:\/\/dns\.google\/query\?name=dash\.org>/.test(rec), 'the record carries the DNS reading as the public record, with what changed and its link');
  /* the treasury: a 2 of 3 spend backs two statements */
  await p.locator('.ck-back').click(); await p.waitForTimeout(400);
  await p.locator('.ck-hub-open[data-kind="treasury"]').click(); await p.waitForTimeout(500);
  await begin(p, 'Record Treasury');
  await p.keyboard.press('y'); await p.waitForTimeout(400);
  await p.locator('.ck-ev-form input').fill('7YSaxf6pd7SJ6aWMRy9xp5Jy2qLDBURU41');
  await p.locator('.ck-ev-form button[type=submit]').click();
  await p.waitForSelector('.ck-ev-found', { timeout: 15000 });
  ok(/2 of 3 signatures/.test(await p.locator('.ck-ev-found').innerText()) && /This record backs your answer/.test(await p.locator('.ck-ev').innerText()), 'a 2 of 3 spend on the chain backs: more than one person must agree');
  ok(await p.evaluate(() => !!document.querySelector('.ck-aside .ck-seg .ck-seg-ev:not(.against)')), 'the ring marks the shown answer with a filled dot');
  await p.locator('.ck-aside .ck-seg[aria-label^="5."]').click(); await p.waitForTimeout(400);
  ok((await p.locator('.ck-ev-form input').inputValue()) === '7YSaxf6pd7SJ6aWMRy9xp5Jy2qLDBURU41', 'the treasury address carries to the other statement the same record can show');
  await collect(p, 'record');
  await c.close();
}

/* ---------- 2d. code and releases: one Scorecard read fills seven statements ---------- */
console.log('-- code and releases, read from Scorecard');
{
  const c = await context({ permissions: ['clipboard-read', 'clipboard-write'] });
  const fx = (f) => readFileSync('research/evidence/' + f, 'utf8');
  const asked = [];
  /* a Dash repository's real published results stand in for the API; a repository Scorecard has not scanned answers 404 */
  await c.route('https://api.scorecard.dev/projects/**', (r) => {
    asked.push(r.request().url());
    const dash = /\/projects\/github\.com\/dashevo\/dashcore-lib$/.test(r.request().url());
    return r.fulfill({ status: dash ? 200 : 404, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: dash ? fx('scorecard-dashevo-dashcore-lib.json') : '{"code":5,"message":"failed to get scorecard data"}' });
  });
  const p = await newPage(c, 'code');
  await toCheck(p, 'code');
  ok(/The code and releases check/.test(await p.locator('.ck h1').innerText()), 'the list opens the code and releases check');
  await begin(p, 'Code Project');
  ok((await item(p)) === 'review' && /Changing the code/.test(await p.locator('.ck-chip').innerText()), 'its first statement is about changing the code');
  await p.keyboard.press('y'); await p.waitForTimeout(400);
  ok(/Scorecard will see which repository you asked about/.test(await p.locator('.ck-ev').innerText()) && !asked.length, 'before the first read, the page says Scorecard will see the repository, and nothing has been read');
  await p.locator('.ck-ev-form input').fill('github.com/dashpay/dash');
  await p.locator('.ck-ev-form button[type=submit]').click();
  await p.waitForSelector('.ck-ev-err', { timeout: 15000 });
  ok(/has no published results for github\.com\/dashpay\/dash/.test(await p.locator('.ck-ev-err').innerText()) && /publish_results/.test(await p.locator('.ck-ev-err').innerText()), 'a repository Scorecard has not scanned is said plainly, with how to publish results');
  await p.locator('.ck-ev-form input').fill('https://github.com/DashEvo/dashcore-lib/tree/master');
  await p.locator('.ck-ev-form button[type=submit]').click();
  await p.waitForSelector('.ck-ev-found', { timeout: 15000 });
  const found = await p.locator('.ck-ev-found').innerText();
  ok(/Code-Review scored 5 of 10 in Scorecard’s scan of 2026-11-02: “Found 17\/30 approved changesets”\./.test(found) && /The same read filled 6 other statements in this check/.test(found), 'the read is said plainly, with the scan date, and fills the other six statements: ' + found.slice(0, 160).replace(/\n/g, ' '));
  ok(/You answered Yes\. The record allows Partly at most\./.test(found), 'Yes against 17 of 30 reviewed changes is said plainly as more than the record allows');
  ok(asked.some((u) => /DashEvo/.test(u)) && asked.some((u) => /dashevo\/dashcore-lib$/.test(u)) && (await p.locator('.ck-ev-form input').inputValue()) === 'github.com/dashevo/dashcore-lib', 'a name in the wrong letter case is tried as typed, then once in lower case');
  await p.locator('.ck-aside .ck-seg[aria-label^="2."]').click(); await p.waitForTimeout(400);
  await p.keyboard.press('y'); await p.waitForTimeout(400);
  ok(/force pushes and deletion are blocked on master/.test(await p.locator('.ck-ev-found').innerText()) && /This record backs your answer/.test(await p.locator('.ck-ev').innerText()), 'the branch rules, filled by the same read, back a Yes');
  await p.locator('.ck-aside .ck-seg[aria-label^="4."]').click(); await p.waitForTimeout(400);
  await p.keyboard.press('y'); await p.waitForTimeout(400);
  const tok = await p.locator('.ck-ev').innerText();
  ok(/does not settle your answer either way/.test(tok) && !/allows .* at most/.test(tok) && !/backs your answer/.test(tok), 'a Scorecard check that cannot see far enough is open: it neither backs nor limits the answer');
  ok(await p.evaluate(() => document.querySelectorAll('.ck-aside .ck-seg .ck-seg-ev').length === 2 && document.querySelectorAll('.ck-aside .ck-seg .ck-seg-ev.against').length === 1), 'the ring marks one shown answer and one contradiction, and nothing for the open one');
  await p.locator('.ck-aside .ck-to-result').click(); await p.waitForTimeout(500);
  await p.locator('.ck-actions .btn', { hasText: 'Copy the record' }).click(); await p.waitForTimeout(400);
  const rec = await p.evaluate(() => navigator.clipboard.readText());
  ok(/^# Code and releases check: Code Project/.test(rec) && /Shown: Branch-Protection scored 5 of 10/.test(rec) && /Said, and the public record allows Partly at most: Code-Review/.test(rec) && /The public record: Token-Permissions scored 0 of 10/.test(rec) && /scorecard\.dev\/viewer\/\?uri=github\.com\/dashevo\/dashcore-lib/.test(rec), 'the record marks Shown, Said and open apart, and links the Scorecard viewer');
  await collect(p, 'code');
  await c.close();
}

/* ---------- 2e. people and devices, the worst day: their own statements and milestones ---------- */
console.log('-- people and devices, the worst day');
{
  const c = await context();
  const p = await newPage(c, 'people');
  for (const [kind, first, title, toast] of [['people', 'hire-check', 'The people and devices check', 'The People, Read'], ['incident', 'ir-plan', 'The worst day check', 'Ready For The Worst Day, By Our Own Account']]) {
    await toCheck(p, kind);
    ok(new RegExp(title).test(await p.locator('.ck h1').innerText()), 'the list opens ' + title.toLowerCase());
    await begin(p, 'Walk ' + kind);
    ok((await item(p)) === first, kind + ': its first statement is ' + first);
    await answerAll(p, Array(12).fill(kind === 'incident' ? 'y' : 'n'));
    ok((await p.locator('.ck-result').count()) === 1, kind + ': twelve answers bring the result');
    ok(new RegExp(toast).test(await p.evaluate(() => document.querySelector('.ck-result .ck-earned')?.innerText || '')) && (await p.locator('.toast').count()) === 0, kind + ': its milestone shows in the result, and no toast covers it');
    await p.locator('.ck-back').click(); await p.waitForTimeout(500);
    await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  }
  await collect(p, 'people');
  await c.close();
}

/* ---------- 2f. the loop into the corpus, and the spine ---------- */
console.log('-- the loop and the spine');
{
  /* a learner who has done two of the three lessons for "independent" */
  const c = await context({}, { completedSteps: { 'ch-identity-p5-s1': Date.now() }, guidesRead: { 'sg-safe-signer-operations': Date.now() } });
  const p = await newPage(c, 'loop');
  await p.evaluate(() => [...document.querySelectorAll('.ck-door .btn')][0]?.click());
  await p.waitForSelector('.ck-spine', { timeout: 15000 }); await p.waitForTimeout(400);
  const fns = await p.evaluate(() => [...document.querySelectorAll('.ck-spine-grid > li')].map((li) => li.querySelector('.ck-spine-fn')?.firstChild?.textContent + (li.classList.contains('thin') ? '*' : '')).join(','));
  ok(fns === 'Govern,Identify,Protect,Detect,Respond,Recover*', 'the spine shows the six functions, Recover marked thin: ' + fns);
  await p.locator('.ck-spine-grid > li.thin summary').click(); await p.waitForTimeout(300);
  ok(/After/i.test(await p.locator('.ck-spine-grid > li.thin ol').innerText()), 'opening Recover lists the page that teaches it');
  await p.locator('.ck-hub-open[data-kind="treasury"]').click(); await p.waitForTimeout(500);
  await begin(p, 'Loop Treasury');
  await p.keyboard.press('y'); await p.waitForTimeout(400); await p.keyboard.press('Enter'); await p.waitForTimeout(380);
  await p.keyboard.press('n'); await p.waitForTimeout(400);
  const learn = await p.locator('.ck-learn').innerText();
  ok((await item(p)) === 'independent' && (await p.locator('.ck-learn li').count()) === 3 && /StepGuide/.test(learn) && /Custody Is a Systems Problem/.test(learn), 'a gap\'s move lists the lessons that teach it, by kind and title');
  ok((await p.locator('.ck-learn button.done').count()) === 2 && !(await p.locator('.ck-recheck').count()), 'two of three lessons done: they are marked, and no re-check is offered yet');
  await p.locator('.ck-learn button', { hasText: 'Exchange-Grade Custody' }).click();
  await p.waitForFunction(() => /Exchange-Grade Custody/.test(document.querySelector('h1, h2')?.textContent || document.body.innerText.slice(0, 600)), null, { timeout: 15000 }).then(() => ok(true, 'a lesson opens its Step'), () => ok(false, 'a lesson did not open its Step'));
  await collect(p, 'loop');
  await c.close();
  /* every lesson done: the check offers to answer again */
  const c2 = await context({}, { completedSteps: { 'ch-identity-p5-s1': Date.now(), 'ch-chain-exchange-grade': Date.now() }, guidesRead: { 'sg-safe-signer-operations': Date.now() } });
  const p2 = await newPage(c2, 'recheck');
  await toCheck(p2); await begin(p2, 'Recheck Treasury');
  await p2.keyboard.press('y'); await p2.waitForTimeout(400); await p2.keyboard.press('Enter'); await p2.waitForTimeout(380);
  await p2.keyboard.press('n'); await p2.waitForTimeout(400);
  ok(/Every lesson for this gap is done/.test(await p2.locator('.ck-learn').innerText()), 'every lesson done: the gap offers to answer the statement again');
  /* a statement that was thin now opens a StepGuide written for it */
  await p2.locator('.ck-back').click(); await p2.waitForTimeout(400);
  await p2.locator('.ck-hub-open[data-kind="accounts"]').click(); await p2.waitForTimeout(500);
  await begin(p2, 'Thin No More');
  await p2.keyboard.press('n'); await p2.waitForTimeout(400);
  ok((await item(p2)) === 'domain-lock' && /StepGuide · Domains and DNS/.test(await p2.locator('.ck-learn').innerText()), 'the domain lock gap opens the guide written for it');
  await p2.locator('.ck-learn button', { hasText: 'Holding The Name' }).click();
  await p2.waitForFunction(() => /Holding The Name/.test(document.body.innerText) && /clientTransferProhibited/.test(document.body.innerText), null, { timeout: 15000 }).then(() => ok(true, 'the guide opens with its procedure'), () => ok(false, 'the guide did not open'));
  await collect(p2, 'recheck');
  await c2.close();
}

/* ---------- 3. the seal, attacked ---------- */
console.log('-- the seal');
{
  const c = await context({}, { checks: [{ id: 'legacyck1', project: LEGACY, answers: { 'two-agree': 'no', seeds: 'unsure' }, at: Date.now() - 3600e3 }] });
  const p = await newPage(c, 'seal');
  const rec = await p.evaluate(() => localStorage.getItem('stepsafe-praxis-v1') || '');
  ok(!rec.includes(LEGACY) && !rec.includes('"checks"'), 'a plain-text check from an earlier version is gone from the saved record at the first load');
  await toCheck(p);
  ok(/found in plain text/.test(await p.locator('.ck-keep').innerText()), 'the page says it was found and moved');
  ok(await p.evaluate((l) => document.querySelector('.ck-name input')?.value === l, LEGACY), 'the moved check opens with its name');
  await p.evaluate(() => document.activeElement?.blur());
  await p.locator('.ck-card-nav .btn').last().click();
  await p.locator('.ck-aside .ck-to-result').click(); await p.waitForTimeout(300);
  await p.locator('.ck-actions .btn', { hasText: 'Start a new check' }).click(); await p.waitForTimeout(400);
  await p.fill('.ck-name input', 'Wave 001 Treasury'); await p.evaluate(() => document.activeElement?.blur());
  await answerAll(p, MIXED);
  ok(!(await storageHas(p, 'Wave 001')) && !(await storageHas(p, 'two-agree')) && !(await storageHas(p, LEGACY)), 'answered for the visit: no name and no answer in any storage');

  await p.locator('.nav .navbtn', { hasText: 'Settings' }).first().click(); await p.waitForTimeout(1400);
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), p.locator('button', { hasText: 'Export my record' }).click()]);
  const file = readFileSync(await dl.path(), 'utf8');
  ok(!file.includes('Wave 001') && !file.includes(LEGACY) && !/"checks"/.test(file), 'the exported record file holds no check');
  const evil = JSON.stringify({ kind: 'stepsafe-praxis-record', version: 1, exportedAt: new Date().toISOString(), handle: 'R', record: { onboarded: true, handle: 'R', checks: [{ id: 'fileck1', project: 'From A File Treasury', answers: { seeds: 'no' }, at: Date.now() }] } });
  await p.setInputFiles('input[type=file][accept="application/json"]', { name: 'old.json', mimeType: 'application/json', buffer: Buffer.from(evil) });
  await p.waitForTimeout(1200);
  ok(/held a treasury check in plain text/.test(await p.evaluate(() => [...document.querySelectorAll('.toast')].map((t) => t.innerText).join(' '))), 'a restore that carries a check says so');
  ok(!(await storageHas(p, 'From A File')), 'the restored check never reaches storage');

  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
  ok(/Begin a check/.test(await p.evaluate(() => document.querySelector('.ck-door')?.innerText || '')), 'a reload before sealing ends the visit, as the page said');
  await toCheck(p); await begin(p, 'Sealed Wave Treasury');
  await answerAll(p, ['n', 'n', 'n']);
  await p.locator('.ck-keep button', { hasText: 'Seal on this device' }).click();
  const two = p.locator('.ck-keep-form input[type=password]');
  await two.nth(0).fill(PASS); await two.nth(1).fill(PASS);
  await p.locator('.ck-keep-form button[type=submit]').click();
  await p.waitForFunction(() => /Sealed on this device/.test(document.querySelector('.ck-keep')?.innerText || ''), null, { timeout: 20000 });
  await p.waitForTimeout(300);
  ok(await p.evaluate(() => !!localStorage.getItem('stepsafe-keys-v1')), 'sealing writes the keyring blob');
  ok(!(await storageHas(p, 'Sealed Wave')) && !(await storageHas(p, '"no"')) && !(await storageHas(p, PASS)), 'sealed: no name, answer or passphrase in any storage');

  const p2 = await newPage(c, 'tab2');
  ok(/Your checks are sealed on this device/.test(await p2.evaluate(() => document.querySelector('.ck-door')?.innerText || '')), 'a new visit sees only that sealed checks exist');
  await toCheck(p2);
  ok(!(await p2.evaluate(() => document.body.innerText.includes('Sealed Wave'))), 'locked: the page shows no sealed check');
  const one = p2.locator('.ck-keep-form input[type=password]');
  await one.fill('the wrong passphrase entirely'); await p2.locator('.ck-keep-form button[type=submit]').click();
  await p2.waitForFunction(() => /does not open them/.test(document.querySelector('.ck-keep')?.innerText || ''), null, { timeout: 20000 });
  ok(!(await p2.evaluate(() => document.body.innerText.includes('Sealed Wave'))), 'a wrong passphrase opens nothing');
  await one.fill(PASS); await p2.locator('.ck-keep-form button[type=submit]').click();
  await p2.waitForFunction(() => document.querySelector('.ck-name input')?.value === 'Sealed Wave Treasury', null, { timeout: 20000 }).then(() => ok(true, 'the right passphrase opens it in the second tab'), () => ok(false, 'the right passphrase did not open it in the second tab'));
  await p.fill('.ck-name input', 'Sealed Wave Treasury, renamed in tab one');
  await p2.waitForFunction(() => /renamed in tab one/.test(document.querySelector('.ck-name input')?.value || ''), null, { timeout: 10000 }).then(() => ok(true, 'the second tab follows a change made in the first'), () => ok(false, 'the second tab did not follow the first'));
  ok(!(await storageHas(p, 'renamed in tab one')), 'the change travelled sealed');
  await p.locator('.ck-keep button', { hasText: 'Lock now' }).click(); await p.waitForTimeout(500);
  ok(!(await p.evaluate(() => document.body.innerText.includes('Sealed Wave'))), 'Lock now takes the check off the page');
  await collect(p, 'seal'); await collect(p2, 'tab2');
  await c.close();
}

/* ---------- 4. a phone, and reduced motion ---------- */
console.log('-- a phone, reduced motion');
{
  const c = await context({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const p = await newPage(c, 'phone');
  await p.evaluate(() => [...document.querySelectorAll('.ck-door .btn')][0]?.click());
  await p.waitForSelector('.ck-hub', { timeout: 15000 }); await p.waitForTimeout(500);
  const hubWide = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  const small = await p.evaluate(() => [...document.querySelectorAll('.ck-hub-go, .ck-launch .btn')].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).length);
  ok(hubWide[0] <= hubWide[1] && small === 0, 'the list of five at 390: no sideways scroll, every control 44px or taller: ' + hubWide.join('/'));
  await p.locator('.ck-hub-open[data-kind="treasury"]').click(); await p.waitForTimeout(500);
  await begin(p, 'Phone Treasury');
  await p.waitForTimeout(900);
  const box = await p.evaluate(() => { const a = document.querySelector('.ck-ask')?.getBoundingClientRect(), b = document.querySelector('.ck-ans')?.getBoundingClientRect(); return [a?.top, b?.bottom]; });
  ok(box[0] > 0 && box[1] < 844, 'on a phone the statement and its first answers are in the first screen after Begin: ' + box.map(Math.round).join('/'));
  await p.locator('.ck-card .ck-ans.o-no').tap(); await p.waitForTimeout(300);
  ok((await p.locator('.ck-card .ck-move').count()) === 1, 'a tap answers');
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('.ck-card')).animationName === 'none'), 'reduced motion: the statement arrives without motion');
  const wide = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  ok(wide[0] <= wide[1], 'no sideways scroll at 390: ' + wide.join('/'));
  const targets = await p.evaluate(() => [...document.querySelectorAll('.ck-card button')].filter((b) => b.offsetParent).map((b) => b.getBoundingClientRect().height).filter((h) => h < 36).length);
  ok(targets === 0, 'every control on the statement is at least 36px tall');
  await collect(p, 'phone');
  await c.close();
}

ok(!csp.length, 'no CSP violations' + (csp.length ? ': ' + csp.join(' | ') : ''));
ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
