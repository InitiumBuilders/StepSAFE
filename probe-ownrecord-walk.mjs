/* StepSAFE's own record (#/trust), walked in a real browser against the built site under its real headers. OSV.dev
   is stood in for, so the walk asks it nothing: a clean answer, a known flaw, then OSV.dev down. OpenSSF Scorecard
   is stood in for too, with its real published result for the public copy (research/evidence/scorecard-stepsafe.json):
   the readings under the answers, a branch rule the record says is missing, no published result, and Scorecard down.
   Walked: the page before a read, when nothing has been asked; the read, every finding's state and the tally; focus
   on the result; the answers, gaps first, and the federal rows with their sources; the OSV question, what it
   carries, and its three answers; copy and save; leaving and coming back, when the reading is kept and nothing is
   read twice; Settings' button to the page; a key-shaped string planted in storage, read as a gap that never shows
   the string; a phone at 390 in all three themes, with contrast, 44px controls, no type under 12px and no sideways
   scroll; the security policy and the console.
     node scripts/serve-dist.mjs 5189 &   then   node probe-ownrecord-walk.mjs [base] [folder for screenshots] */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const SHOTS = process.argv[3] || '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const HTTPS = BASE.startsWith('https:');
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const errors = [], csp = [], strays = [];
/* the npm packages: what the parts line counts as packages and what OSV.dev is asked about */
const PACKAGES = JSON.parse(readFileSync('public/sbom.cdx.json', 'utf8')).components.filter((c) => String(c.purl || '').startsWith('pkg:npm/')).length;

/* ---------- OpenSSF Scorecard, stood in for ---------- */
const CARD = JSON.parse(readFileSync('research/evidence/scorecard-stepsafe.json', 'utf8'));
let cardMode = 'ok', cardUrls = [];
async function scorecard(route) {
  const req = route.request();
  const cors = { 'access-control-allow-origin': '*' };
  cardUrls.push(req.url());
  if (cardMode === 'down') return route.abort('failed');
  if (cardMode === 'none') return route.fulfill({ status: 404, headers: { ...cors, 'content-type': 'application/json' }, body: '{"code":5,"message":"not found"}' });
  /* a record that says the main branch is unprotected: Branch-Protection at 0, so StepSAFE's Partly is more than it allows */
  const body = cardMode === 'bare' ? { ...CARD, checks: CARD.checks.map((c) => (c.name === 'Branch-Protection' ? { ...c, score: 0, reason: 'branch protection not enabled on development/release branches', details: [] } : c)) } : CARD;
  return route.fulfill({ status: 200, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(body) });
}

/* ---------- OSV.dev, stood in for ---------- */
let osvMode = 'clean', osvBodies = [];
async function osv(route) {
  const req = route.request();
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST, OPTIONS' };
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
  if (osvMode === 'down') return route.abort('failed');
  let q = [];
  try { const b = JSON.parse(req.postData() || '{}'); osvBodies.push(b); q = b.queries || []; } catch { /* answered empty */ }
  const results = q.map((_, i) => (osvMode === 'flaw' && i === 0 ? { vulns: [{ id: 'GHSA-walk-test-0001', modified: '2026-11-14T00:00:00Z' }] } : {}));
  return route.fulfill({ status: 200, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify({ results }) });
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function context(opts = {}, seed = {}, plant = null) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'], ...opts });
  await c.addInitScript(([seed, plant]) => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'W', guise: 'one', theme: 'nocturne', ...seed }));
    if (plant) localStorage.setItem(plant[0], plant[1]);
  }, [seed, plant]);
  await c.route(/api\.osv\.dev/, osv);
  await c.route(/api\.scorecard\.dev/, scorecard);
  return c;
}
let selfReads = 0;
async function newPage(c, tag, at = '/#/trust') {
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(tag + ': ' + String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(tag + ': ' + m.text().slice(0, 200)); });
  p.on('request', (r) => {
    const u = r.url();
    if (/\/\.well-known\/security\.txt$/.test(u)) selfReads++;
    if (!u.startsWith(BASE) && !/^data:|^blob:|api\.osv\.dev|api\.scorecard\.dev/.test(u)) strays.push(tag + ': ' + u.slice(0, 120));
  });
  await p.goto(BASE + at, { waitUntil: 'networkidle' });
  await p.waitForSelector('.ownr h1, .view-head h1', { timeout: 20000 });
  await p.waitForTimeout(1200);
  return p;
}
const collect = async (p, tag) => (await p.evaluate(() => window.__csp.splice(0))).forEach((v) => csp.push(tag + ': ' + v));
const shot = async (p, name, full = false) => { if (SHOTS) await p.screenshot({ path: SHOTS + '/' + name + '.png', fullPage: full }); };
const states = (p) => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('.ownr-read [data-ownr]')].map((li) => [li.getAttribute('data-ownr'), (li.className.match(/ownr-k-(\w+)/) || [])[1]])));
const lineOf = (p, id) => p.evaluate((id) => document.querySelector('[data-ownr="' + id + '"] .ownr-f-body p')?.textContent || '', id);
async function readIt(p) {
  await p.locator('.ownr-read .btn-key').first().click();
  await p.waitForSelector('.ownr-sum', { timeout: 15000 });
  await p.waitForTimeout(500);
}
async function ask(p, mode) {
  osvMode = mode;
  const before = await p.evaluate(() => document.querySelector('[data-ownr="flaws"] .ownr-f-body p')?.textContent || '');
  await p.locator('#ownr-flaws-h ~ .ownr-actions .btn-key').click();
  await p.waitForFunction((b) => { const t = document.querySelector('[data-ownr="flaws"] .ownr-f-body p')?.textContent || ''; return t && t !== b; }, before, { timeout: 15000 });
}

async function askCard(p, mode) {
  cardMode = mode;
  const before = cardUrls.length;
  await p.locator('.ownr-card .btn-key').click();
  await p.waitForFunction(() => { const b = document.querySelector('.ownr-card .btn-key'); return b && !b.disabled; }, null, { timeout: 15000 });
  await p.waitForTimeout(400);
  if (cardUrls.length === before) problems.push('askCard: the button asked nothing');
}
const cardLines = (p) => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-ownr-answer]')].filter((li) => li.querySelector('.ownr-card-line')).map((li) => [li.getAttribute('data-ownr-answer'), li.querySelector('.ownr-card-line').textContent + ' | ' + li.querySelector('.ownr-f-state').textContent])));
const cardSum = (p) => p.evaluate(() => document.querySelector('[data-ownr-card]')?.textContent || '');
const cardAlert = (p) => p.evaluate(() => document.querySelector('.ownr-card [role=alert]')?.textContent || '');

async function contrastOf(p, sels, prop = 'color') {
  return p.evaluate(([sels, prop]) => {
    const rgb = (s) => { const n = (s.match(/[\d.]+/g) || []).map(Number); if (/^color\(srgb/.test(s)) return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1]; return n; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const ground = (el) => { let base = rgb(getComputedStyle(document.documentElement).getPropertyValue('--ground').trim().replace(/^#(..)(..)(..)$/, (m, r, g, b) => parseInt(r, 16) + ',' + parseInt(g, 16) + ',' + parseInt(b, 16))); if (base.length < 3) base = [5, 10, 30]; const stack = []; for (let n = el; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c[3] ?? 1) > 0) stack.push(c); } for (const c of stack.reverse()) { const a = c[3] ?? 1; base = base.map((v, i) => v * (1 - a) + c[i] * a); } return base; };
    const out = [];
    for (const sel of sels) {
      const el = document.querySelector(sel); if (!el) { out.push([sel, 0]); continue; }
      const fg = rgb(getComputedStyle(el)[prop]), bg = ground(el);
      if (fg.length < 3) { out.push([sel, 0]); continue; }
      const a = lum(fg), b = lum(bg);
      out.push([sel, +(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(1))]);
    }
    return out;
  }, [sels, prop]);
}

/* ---------- the desktop walk ---------- */
{
  const c = await context();
  const p = await newPage(c, 'desk');
  ok(await p.evaluate(() => document.title === 'StepSAFE’s own record · StepSAFE'), 'the tab carries the page’s name');
  ok(await p.evaluate(() => document.querySelectorAll('.ownr-waiting [data-ownr]').length === 9 && [...document.querySelectorAll('.ownr-waiting .ownr-f-state')].every((e) => e.textContent === 'Not read yet')), 'before a read: nine promises, each not read yet');
  ok(selfReads === 0, 'nothing is read before the button');
  ok(await p.evaluate(() => document.querySelector('#ownr-flaws-h ~ .ownr-actions .btn-key').disabled), 'the OSV question waits for the record to be read first');
  await shot(p, 'desk-before');
  await readIt(p);
  const s = await states(p);
  ok(Object.keys(s).length === 9, 'the read gives nine findings: ' + Object.keys(s).join(' '));
  for (const id of ['scripts', 'framing', 'referrer', 'powers', 'hosts', 'device', 'parts']) ok(s[id] === 'shown', id + ' holds: ' + (await lineOf(p, id)).slice(0, 110));
  const txt = readFileSync('public/.well-known/security.txt', 'utf8');
  const pending = txt.includes('[[SECURITY CONTACT]]');
  ok(s.disclosure === (pending ? 'gap' : 'shown'), 'the disclosure reading matches security.txt as it is (' + (pending ? 'its contact not filled in yet' : 'its contact set') + '): ' + (await lineOf(p, 'disclosure')).slice(0, 110));
  ok(s.https === (HTTPS ? 'shown' : 'gap'), HTTPS ? 'HTTPS holds on the real host' : 'the local server sends no HSTS, and the reading says so');
  const tally = await p.evaluate(() => document.querySelector('.ownr-sum').textContent);
  const n = Object.values(s).filter((x) => x === 'shown').length;
  ok(tally.startsWith(n + ' of 9 hold'), 'the tally counts what was read: ' + tally);
  ok(await p.evaluate(() => document.activeElement && document.activeElement.classList.contains('ownr-sum')), 'focus moves to the result');
  ok(/no site but this one/.test(await lineOf(p, 'hosts')), 'with the typefaces served here, the visit reached no site but this one: ' + (await lineOf(p, 'hosts')).slice(0, 90));
  ok(/No cookie/.test(await lineOf(p, 'device')) && /your record/.test(await lineOf(p, 'device')), 'the device line lists your record and no cookie');
  ok(new RegExp(PACKAGES + ' open-source packages').test(await lineOf(p, 'parts')), 'the parts line counts ' + PACKAGES + ' packages');
  /* the answers and the federal rows */
  const answers = await p.evaluate(() => [...document.querySelectorAll('[data-ownr-answer]')].map((li) => (li.className.match(/ownr-ans-(\w+)/) || [])[1]));
  ok(answers.length === 12 && answers.indexOf('yes') > answers.lastIndexOf('no') && answers.indexOf('yes') > answers.lastIndexOf('partly'), 'twelve answers, the gaps before what holds: ' + answers.join(' '));
  ok(await p.evaluate(() => [...document.querySelectorAll('[data-ownr-answer] .ownr-move')].length === [...document.querySelectorAll('.ownr-ans-no, .ownr-ans-partly')].length), 'every gap carries its move');
  ok(await p.evaluate(() => document.querySelectorAll('[data-ownr-federal]').length === 6 && [...document.querySelectorAll('[data-ownr-federal] a[href^="https://"]')].every((a) => a.target === '_blank' && /noopener/.test(a.rel))), 'six federal rows, each source opening apart from the page');
  if (pending) ok(await p.evaluate(() => /disagrees/.test(document.querySelector('[data-ownr-answer="disclosure"] .ownr-read-line')?.textContent || '')), 'with the contact not filled in, the answer says the reading disagrees');
  /* the OSV question */
  await ask(p, 'clean');
  ok((await lineOf(p, 'flaws')).includes('no flaw in any of the ' + PACKAGES), 'OSV.dev clean: no known flaw: ' + (await lineOf(p, 'flaws')));
  const b = osvBodies[osvBodies.length - 1] || {};
  ok(Array.isArray(b.queries) && b.queries.length === PACKAGES && b.queries.every((q) => Object.keys(q).sort().join() === 'package,version' && Object.keys(q.package).sort().join() === 'ecosystem,name'), 'the question to OSV.dev carries each package’s name, ecosystem and version, and nothing else');
  ok(!/"W"|stepsafe-praxis|onboarded/.test(JSON.stringify(b)), 'nothing about the visitor goes to OSV.dev');
  await ask(p, 'flaw');
  ok(await p.evaluate(() => document.querySelector('[data-ownr="flaws"]').classList.contains('ownr-k-gap')) && (await lineOf(p, 'flaws')).includes('GHSA-walk-test-0001'), 'a known flaw is a gap that names it');
  await ask(p, 'down');
  ok(await p.evaluate(() => document.querySelector('[data-ownr="flaws"]').classList.contains('ownr-k-unread')) && /could not be reached/.test(await lineOf(p, 'flaws')), 'OSV.dev down: not read, and the page says so');
  osvMode = 'clean';
  await ask(p, 'clean');
  /* the Scorecard question */
  ok(cardUrls.length === 0, 'nothing is asked of OpenSSF Scorecard before its button');
  ok(/github\.com\/InitiumBuilders\/StepSAFE/.test(await p.evaluate(() => document.querySelector('.ownr-card .ownr-says')?.textContent || '')), 'the page names the repository Scorecard is asked about before the button is pressed');
  await askCard(p, 'ok');
  const sum = await cardSum(p);
  ok(sum.startsWith('OpenSSF Scorecard’s scan of 2026-11-15 backs 3 of these answers and does not settle 4.'), 'Scorecard: one line counts what the scan backs and leaves open: ' + sum.slice(0, 120));
  ok(cardUrls.length === 1 && cardUrls[0] === 'https://api.scorecard.dev/projects/github.com/InitiumBuilders/StepSAFE', 'the question to OpenSSF Scorecard is the public repository’s name and nothing else: ' + cardUrls.join(' '));
  let lines = await cardLines(p);
  ok(Object.keys(lines).sort().join() === 'branch-rules,dep-alerts,disclosure,provenance,review,signed,token-perms', 'seven answers carry a Scorecard reading: ' + Object.keys(lines).join(' '));
  ok(/Token-Permissions scored 10 of 10/.test(lines['token-perms']) && /backs StepSAFE’s answer/.test(lines['token-perms']) && /backed by OpenSSF Scorecard/.test(lines['token-perms']), 'token permissions: 10 of 10, and the answer says Scorecard backs it');
  ok(/Code-Review scored 0 of 10/.test(lines.review) && /backs StepSAFE’s answer/.test(lines.review), 'review: 0 of 10 backs StepSAFE’s No');
  ok(/Branch-Protection did not run/.test(lines['branch-rules']) && !/internal error/.test(lines['branch-rules']) && /does not settle/.test(lines['branch-rules']), 'branch rules: the scan could not read them, said plainly, and settles nothing');
  ok(/Security-Policy scored 9 of 10/.test(lines.disclosure) && /Shown on this page, backed by OpenSSF Scorecard/.test(lines.disclosure), 'the policy: shown on this page and backed by Scorecard');
  ok(!(await cardAlert(p)), 'a good answer shows no error');
  await shot(p, 'desk-scorecard');
  await askCard(p, 'bare');
  lines = await cardLines(p);
  ok(/StepSAFE answered Partly\. The record allows No at most\./.test(lines['branch-rules']) && await p.evaluate(() => document.querySelector('[data-ownr-answer="branch-rules"] .ownr-card-line').classList.contains('ownr-disagree')), 'a record that says the branch is unprotected: the page says it disagrees with StepSAFE’s Partly');
  ok(/disagrees with 1/.test(await cardSum(p)), 'and the summary counts the disagreement: ' + (await cardSum(p)).slice(0, 120));
  await askCard(p, 'none');
  ok(/has no published results for StepSAFE’s public copy yet/.test(await cardAlert(p)), 'no published result: the page says so in its own words');
  await askCard(p, 'down');
  ok(/could not be reached/.test(await cardAlert(p)), 'Scorecard down: the page says it could not be reached');
  await askCard(p, 'ok');
  ok(!(await cardAlert(p)) && /backs 3/.test(await cardSum(p)), 'asking again clears the error and reads afresh');
  /* copy and save */
  await p.locator('.ownr-actions .btn', { hasText: 'Copy' }).click();
  await p.waitForTimeout(300);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  ok(clip.startsWith('# StepSAFE’s own record') && clip.includes(BASE + '/trust') && clip.includes('No known flaw in what ships'), 'the copied reading carries the findings and the address to read it again');
  ok(clip.includes('## Read by OpenSSF Scorecard') && / StepSAFE answers Yes\. Token-Permissions scored 10 of 10/.test(clip) && clip.indexOf('## Read by OpenSSF Scorecard') < clip.indexOf(BASE + '/trust'), 'the copied reading carries the Scorecard readings under their own heading');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.locator('.ownr-actions .btn', { hasText: 'Save' }).click()]);
  ok(/^stepsafe-own-record-\d{4}-\d\d-\d\d\.md$/.test(dl.suggestedFilename()), 'save gives a dated Markdown file: ' + dl.suggestedFilename());
  await shot(p, 'desk-read', true);
  /* leave and come back */
  const readsBefore = selfReads;
  await p.evaluate(() => { location.hash = '#/settings'; });
  await p.waitForFunction(() => [...document.querySelectorAll('h3')].some((h) => /Security, privacy and access/.test(h.textContent || '')), null, { timeout: 15000 }); await p.waitForTimeout(600);
  ok(await p.evaluate(() => [...document.querySelectorAll('button')].some((x) => x.textContent === 'StepSAFE’s own record')), 'Settings has a button to the own record');
  await p.locator('button', { hasText: 'StepSAFE’s own record' }).click();
  await p.waitForSelector('.ownr-sum', { timeout: 15000 }); await p.waitForTimeout(500);
  ok(await p.evaluate(() => location.hash === '#/trust'), 'the button opens #/trust');
  ok(selfReads === readsBefore && (await states(p)).scripts === 'shown', 'coming back shows the kept reading and reads nothing twice');
  ok(cardUrls.length === 6 && Object.keys(await cardLines(p)).length === 7, 'coming back shows the kept Scorecard readings and asks nothing twice: ' + cardUrls.length + ' asks');
  await collect(p, 'desk');
  await c.close();
}

/* ---------- a first visit at /trust: no record, no welcome page, no handle ---------- */
{
  /* reduced motion stills the lattice behind the page, so two pictures of one spot differ only by what is on it */
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await c.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI)); });
  await c.route(/api\.osv\.dev/, osv);
  await c.route(/api\.scorecard\.dev/, scorecard);
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push('fresh: ' + String(e).slice(0, 200)));
  p.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !/^data:|^blob:|api\.osv\.dev|api\.scorecard\.dev/.test(u)) strays.push('fresh: ' + u.slice(0, 120)); });
  await p.goto(BASE + '/trust', { waitUntil: 'networkidle' });
  await p.waitForSelector('.ownr h1', { timeout: 20000 }); await p.waitForTimeout(900);
  ok(await p.evaluate(() => !document.querySelector('.lx, #nav-all') && !!document.querySelector('main.ownr-alone') && document.querySelectorAll('.ownr h1').length === 1), 'a first visit to /trust opens the record itself: no welcome page, no handle to choose');
  ok(await p.evaluate(() => document.title === 'StepSAFE’s own record · StepSAFE' && document.documentElement.dataset.theme === 'nocturne'), 'it carries its name in the tab and the night theme');
  ok(await p.evaluate(() => [...document.querySelectorAll('.ownr-top a')].map((a) => a.getAttribute('href')).join() === '/,/'), 'it carries its own way into StepSAFE');
  await readIt(p);
  ok((await lineOf(p, 'device')).startsWith('This browser keeps nothing for StepSAFE yet'), 'the device line says nothing is kept yet: ' + (await lineOf(p, 'device')).slice(0, 80));
  /* the body's fixed layers (future.css, calm.css) are drawn over anything that is not lifted above them, and a
     hit-test cannot see that, because they take no pointer: so the words below the first screen are looked at */
  for (const sel of ['#ownr-tests-h', '#ownr-fed-h', '.ownr-foot']) {
    await p.locator(sel).scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    const box = await p.locator(sel).boundingBox();
    const clip = { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.width, 900), height: Math.min(box.height, 120) };
    const seen = await p.screenshot({ clip });
    await p.evaluate((s) => { document.querySelector(s).style.visibility = 'hidden'; }, sel);
    const gone = await p.screenshot({ clip });
    await p.evaluate((s) => { document.querySelector(s).style.visibility = ''; }, sel);
    ok(!seen.equals(gone), 'the words of ' + sel + ' are drawn on the page, not hidden under the background');
  }
  await ask(p, 'clean');
  await askCard(p, 'ok');
  ok(await p.evaluate(() => localStorage.length === 0), 'reading the record and asking both services writes nothing to this browser’s storage');
  {
    const sel = '[data-ownr-answer="token-perms"] .ownr-card-line';
    await p.locator(sel).scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    const box = await p.locator(sel).boundingBox();
    const clip = { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.width, 900), height: Math.min(box.height, 120) };
    const seen = await p.screenshot({ clip });
    await p.evaluate((s) => { document.querySelector(s).style.visibility = 'hidden'; }, sel);
    const gone = await p.screenshot({ clip });
    await p.evaluate((s) => { document.querySelector(s).style.visibility = ''; }, sel);
    ok(!seen.equals(gone), 'a Scorecard reading is drawn on the page, not hidden under the background');
  }
  await shot(p, 'fresh-trust');
  await collect(p, 'fresh');
  await c.close();
}

/* ---------- a key-shaped string planted in storage ---------- */
{
  const planted = 'sk-ant-' + 'w'.repeat(40);
  const c = await context({}, {}, ['stepsafe-sound', planted]);
  const p = await newPage(c, 'plant');
  await readIt(p);
  const line = await lineOf(p, 'device');
  ok(await p.evaluate(() => document.querySelector('[data-ownr="device"]').classList.contains('ownr-k-gap')) && /sound on or off/.test(line), 'a key-shaped string in storage is a gap that says where: ' + line.slice(0, 120));
  ok(!(await p.evaluate((k) => document.body.innerText.includes(k), planted)), 'the page never shows the string itself');
  await collect(p, 'plant');
  await c.close();
}

/* ---------- a phone, in all three themes ---------- */
for (const theme of ['nocturne', 'meridian', 'mov']) {
  const c = await context({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, { theme });
  const p = await newPage(c, 'phone-' + theme);
  await readIt(p);
  await ask(p, 'clean');
  await askCard(p, 'ok');
  const m = await p.evaluate(() => ({
    wide: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
    small: [...document.querySelectorAll('.ownr .btn')].filter((b) => b.offsetParent && b.getBoundingClientRect().height < 44).map((b) => b.textContent + ' ' + Math.round(b.getBoundingClientRect().height)),
    tiny: [...document.querySelectorAll('.ownr *')].filter((e) => e.offsetParent && e.children.length === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 12).map((e) => e.className + ' ' + getComputedStyle(e).fontSize).slice(0, 4),
    out: [...document.querySelectorAll('.ownr *')].filter((e) => e.offsetParent && e.getBoundingClientRect().right > innerWidth + 1).map((e) => e.className || e.tagName).slice(0, 4),
  }));
  ok(m.wide[0] <= m.wide[1] && !m.out.length, theme + ' at 390: no sideways scroll, nothing past the edge: ' + m.wide.join('/') + ' ' + m.out.join(','));
  ok(!m.small.length, theme + ': every button 44px or taller' + (m.small.length ? ': ' + m.small.join(', ') : ''));
  ok(!m.tiny.length, theme + ': no type under 12px' + (m.tiny.length ? ': ' + m.tiny.join(', ') : ''));
  const cr = await contrastOf(p, ['.ownr-k-shown .ownr-f-title', '.ownr-k-shown .ownr-f-state', '.ownr-k-shown .ownr-f-body p', '.ownr-f-from', '.ownr-ask', '.ownr-tests li', '.ownr-foot', '.ownr-card-sum', '.ownr-card-line .label', '.ownr-card-line p', '.ownr-card-line .ownr-card-verdict']);
  ok(cr.every(([, r]) => r >= 4.5), theme + ': text contrast 4.5:1 or more: ' + cr.map(([s, r]) => s.split(' ').pop() + ' ' + r).join(', '));
  const marks = await contrastOf(p, ['.ownr-k-shown .ownr-mark', '.ownr-ans-no .ownr-mark', '.ownr-ans-partly .ownr-mark'], 'stroke');
  ok(marks.every(([, r]) => r >= 3), theme + ': each mark 3:1 or more against its ground: ' + marks.map(([s, r]) => s.split(' ')[0] + ' ' + r).join(', '));
  await shot(p, 'phone-' + theme, true);
  await collect(p, 'phone-' + theme);
  await c.close();
}

ok(!strays.length, 'the page asked no host but its own, OSV.dev and OpenSSF Scorecard' + (strays.length ? ': ' + strays.slice(0, 4).join(' | ') : ''));
ok(!csp.length, 'no CSP violations' + (csp.length ? ': ' + csp.join(' | ') : ''));
ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
