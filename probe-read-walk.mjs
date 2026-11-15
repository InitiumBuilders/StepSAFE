/* Read a token, walked in a real browser against the built site under its real headers. The explorer is stood in
   for by the saved records (research/evidence/onchain/), so the walk is the same every run and asks the real
   explorer nothing. Walked: the two made-up tokens; a refused id; a read by contract id and by token id; the
   reading's address, Back, copy, save and the link to the record; testnet and a group; a contract the explorer
   could not decode; a contract with no token; an unknown id; the explorer down; arriving by an address (nothing is
   read until the button); a record whose issuer typed markup; Find and the door on the checks page; the daylight
   and Mov themes by contrast; a phone under reduced motion; the Content-Security-Policy and the console.
     node scripts/serve-dist.mjs 5189 &   then   node probe-read-walk.mjs [base] [folder for screenshots] */
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const SHOTS = process.argv[3] || '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const errors = [], csp = [], strays = [];

/* ---------- the explorer, stood in for by the saved records ---------- */
const DIR = 'research/evidence/onchain/';
const FX = readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => ({ name: f.replace(/\.json$/, ''), ...JSON.parse(readFileSync(DIR + f, 'utf8')) }));
const fx = (name) => FX.find(f => f.name === name);
const DUSD = fx('mainnet-dusd'), GROUP = fx('testnet-group-mints'), UNDEC = fx('testnet-undecoded'), DPNS = fx('mainnet-dpns'), CLOSED = fx('testnet-closed'), TIMED = fx('testnet-schedule');
const UNKNOWN = 'ExampLecontractonekeyExampLecontractonekey11';
const HOSTILE = '<img src=x onerror="window.__pwned=1">';
let hits = [], down = false, hostile = false;
async function explorer(route) {
  const req = route.request();
  const u = new URL(req.url());
  const net = u.host.startsWith('testnet.') ? 'testnet' : 'mainnet';
  hits.push(req.method() + ' ' + net + ' ' + u.pathname);
  if (down) return route.abort('failed');
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'GET, POST, OPTIONS' };
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
  const json = (status, body) => route.fulfill({ status, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const on = FX.filter(f => f.net === net);
  /* an issuer who typed markup where a name goes: the same record, with its token's name and description changed */
  const spoil = (f) => {
    if (!hostile) return f;
    const j = JSON.parse(JSON.stringify(f));
    for (const t of j.dec?.tokens || []) { t.description = HOSTILE; for (const k of Object.keys(t.conventions?.localizations || {})) t.conventions.localizations[k].singularForm = HOSTILE; }
    return j;
  };
  let m;
  if ((m = /^\/dataContract\/([^/]+)$/.exec(u.pathname))) { const f = on.find(x => x.dc.identifier === m[1]); return f ? json(200, spoil(f).dc) : json(404, { message: 'not found' }); }
  if ((m = /^\/token\/([^/]+)$/.exec(u.pathname))) { const f = on.find(x => (x.dc.tokens || []).some(t => t.identifier === m[1])); return f ? json(200, { identifier: m[1], dataContractIdentifier: f.dc.identifier }) : json(404, { message: 'not found' }); }
  if (u.pathname === '/transaction/decode') {
    let hash = ''; try { hash = Buffer.from(JSON.parse(req.postData() || '{}').base64 || '', 'base64').toString(); } catch { /* answered as not decoded */ }
    const f = on.find(x => x.dc.txHash === hash);
    return f && f.dec ? json(200, spoil(f).dec) : json(500, { error: 'invalid contract structure: unsupported property type: identifier' });
  }
  if ((m = /^\/transaction\/([0-9A-Fa-f]{64})$/.exec(u.pathname))) { const f = on.find(x => x.dc.txHash === m[1]); return f ? json(200, { hash: m[1], data: Buffer.from(m[1]).toString('base64') }) : json(404, { message: 'not found' }); }
  return json(404, { message: 'not found' });
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function context(opts = {}, seed = {}) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, permissions: ['clipboard-read', 'clipboard-write'], ...opts });
  await c.addInitScript(([seed]) => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', ...seed }));
  }, [seed]);
  await c.route(/platform-explorer\.pshenmic\.dev/, explorer);
  return c;
}
async function newPage(c, tag, at = '/#/read') {
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(tag + ': ' + String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(tag + ': ' + m.text().slice(0, 200)); });
  p.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !/^data:|^blob:|fonts\.(googleapis|gstatic)\.com|platform-explorer\.pshenmic\.dev/.test(u)) strays.push(tag + ': ' + u.slice(0, 120)); });
  await p.goto(BASE + at, { waitUntil: 'networkidle' });
  await p.waitForSelector('.tkr h1, .ck h1', { timeout: 20000 });
  await p.waitForTimeout(1600);
  return p;
}
const collect = async (p, tag) => (await p.evaluate(() => window.__csp.splice(0))).forEach((v) => csp.push(tag + ': ' + v));
const shot = async (p, name, full = false) => { if (SHOTS) await p.screenshot({ path: SHOTS + '/' + name + '.png', fullPage: full }); };
const hash = (p) => p.evaluate(() => location.hash);
const titles = (p) => p.evaluate(() => [...document.querySelectorAll('.tkr-f-title')].map(e => e.textContent));
const vessel = (p) => p.evaluate(() => document.querySelector('.tkr-vessel')?.getAttribute('class') || '');
const alertText = (p) => p.evaluate(() => document.querySelector('.tkr-err')?.textContent || '');
async function readIt(p, id, net) {
  await p.fill('.tkr-field input', id);
  if (net) await p.locator('.tkr-net-opt input[value="' + net + '"]').check();
  await p.locator('.tkr-form button[type=submit]').click();
}
async function readTo(p, f, by) {
  await readIt(p, by || f.dc.identifier, f.net);
  await p.waitForFunction((id) => location.hash.includes(id) && !!document.querySelector('#tkr-result-h'), f.dc.identifier, { timeout: 15000 });
  await p.waitForTimeout(1700);
}

/* the page's own ink, computed against what it sits on */
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
const INK = ['.tkr-field .label', '.tkr-net-opt.tkr-on', '.tkr-net-opt:not(.tkr-on)', '.tkr-says', '.tkr-result-head .label', '.tkr-result-head h2', '.tkr-result-head .sec', '.tkr-id', '.tkr-said', '.tkr-supply dt', '.tkr-supply dd', '.tkr-token .tkr-h', '.tkr-f-title', '.tkr-f-body p', '.tkr-f-from', '.tkr-f-from code', '.tkr-f-models .chip', '.tkr-powers thead th', '.tkr-powers tbody th', '.tkr-powers td', '.tkr-list li', '.tkr-actions a.btn', '.tkr-foot'];
const ART = ['.tkr-t-alone .tkr-mark', '.tkr-t-held .tkr-mark', '.tkr-t-open .tkr-mark', '.tkr-t-fixed .tkr-mark', '.tkr-valve circle', '.tkr-glass'];

/* ---------- 1. the page before a reading: two made-up tokens ---------- */
console.log('-- before a reading');
{
  const c = await context();
  const p = await newPage(c, 'first');
  ok((await p.locator('.tkr h1').innerText()).trim() === 'Read a token', 'the page opens by its address');
  ok(hits.length === 0, 'opening the page asks the explorer nothing: ' + hits.length);
  ok((await titles(p)).join(' | ') === 'One Key Can Mint Without Limit | One Key Can Destroy A Frozen Balance | One Key Can Freeze A Balance | One Key Can Stop Every Transfer | A Maximum Can Still Be Set', 'the first example is held by one key: ' + (await titles(p)).join(' | '));
  ok(/tkr-v-alone/.test(await vessel(p)) && /tkr-nocap/.test(await vessel(p)), 'its vessel has no rim and one key on the valve: ' + (await vessel(p)));
  ok(await p.evaluate(() => document.querySelectorAll('.tkr-valve-keys circle').length === 1 && document.querySelectorAll('.tkr-valve-keys circle.tkr-on').length === 1 && !!document.querySelector('.tkr-flow') && !document.querySelector('.tkr-rim')), 'one mark over the valve, light in the pipe, no rim');
  /* the level rises with a motion, and a busy machine runs it slower (a live walk once read 148 at 600 ms, still
     rising): read the level once it has stopped moving, not at a fixed moment */
  const settled = async () => { let last = NaN; for (let i = 0; i < 40; i++) { const v = await p.evaluate(() => +document.querySelector('.tkr-vessel g[clip-path] rect').getAttribute('y')); if (Math.abs(v - last) < 0.05) return v; last = v; await p.waitForTimeout(150); } return last; };
  const y1 = await settled();
  ok(Math.abs(y1 - (242 - 180 * 0.56)) < 2, 'with no maximum the level stands a little over half: ' + y1.toFixed(1));
  ok(await p.evaluate(() => !document.querySelector('.tkr-example .tkr-actions') && !document.querySelector('.tkr-example a[href]') && !/ExampLe/.test(document.querySelector('.tkr-examples').textContent)), 'an example has nothing to open, copy or share, and shows no identifier');
  await shot(p, 'wide-example-one', true);
  /* a vessel below the fold fills a moment later, so the page never waits on being seen */
  await p.locator('.tkr-pick button', { hasText: 'A group holds it' }).click(); await p.waitForTimeout(3200);
  ok((await titles(p)).join(' | ') === 'A Group Can Stop Every Transfer | Minting Takes More Than One Key | The Maximum Is Fixed | No One Can Freeze Or Take A Balance | It Can Not Join The Resale Market', 'the second example is held by a group: ' + (await titles(p)).join(' | '));
  ok(await p.evaluate(() => document.querySelectorAll('.tkr-valve-keys circle').length === 3 && document.querySelectorAll('.tkr-valve-keys circle.tkr-on').length === 2 && !!document.querySelector('.tkr-rim')), 'three marks over the valve, two filled, and a rim');
  const y2 = await settled();
  ok(Math.abs(y2 - (242 - 180 * 0.6)) < 2, 'the level is the supply over its maximum, 12.6 of 21 million: ' + y2.toFixed(1));
  ok(await p.evaluate(() => [...document.querySelectorAll('.tkr-pick button')].map(b => b.getAttribute('aria-pressed')).join() === 'false,true'), 'the chosen example says it is pressed');
  ok(/3 members\. An action needs power 2 of 3, which takes at least 2 of them\./.test(await p.locator('.tkr-example').innerText()), 'its group is written out');
  await shot(p, 'wide-example-two', true);

  /* an id that is not one */
  await readIt(p, 'dash.org'); await p.waitForTimeout(300);
  ok(/That is not a Dash Platform identifier/.test(await alertText(p)) && hits.length === 0, 'a refused id says so and asks the explorer nothing');
  ok(await p.evaluate(() => document.querySelector('.tkr-err').getAttribute('role') === 'alert'), 'the refusal is an alert');
  await collect(p, 'first');
  await c.close();
}

/* ---------- 2. a reading ---------- */
console.log('-- a reading');
{
  hits = [];
  const c = await context();
  const p = await newPage(c, 'read');
  await p.locator('.tkr-field input').focus();
  await p.keyboard.type(DUSD.dc.identifier);
  await p.keyboard.press('Enter');
  await p.waitForFunction((id) => location.hash === '#/read/' + id && !!document.querySelector('#tkr-result-h'), DUSD.dc.identifier, { timeout: 15000 });
  await p.waitForTimeout(1700);
  ok(true, 'Enter in the field reads, and the address becomes the contract’s: ' + (await hash(p)).slice(0, 16));
  ok(hits.join(' | ') === ['GET mainnet /dataContract/' + DUSD.dc.identifier, 'GET mainnet /transaction/' + DUSD.dc.txHash, 'POST mainnet /transaction/decode'].join(' | '), 'three requests, each to the explorer: ' + hits.length);
  ok(await p.evaluate(() => document.activeElement?.id === 'tkr-result-h'), 'the reading’s heading takes the focus');
  const name = DUSD.dec.tokens[0].conventions.localizations.en.singularForm;
  ok((await p.locator('#tkr-result-h').innerText()).trim() === name, 'the heading is the token’s name: ' + name);
  ok(/Mainnet · read \d{4}-\d\d-\d\d/i.test(await p.locator('.tkr-result-head .label').innerText()), 'the reading is dated and names its network');
  ok(await p.evaluate(() => scrollY < 40 && document.querySelector('#tkr-result-h').getBoundingClientRect().top < innerHeight), 'the reading opens at the top of the page');
  await p.evaluate(() => navigator.clipboard.writeText(''));
  await p.locator('.tkr-actions .btn-key').click(); await p.waitForTimeout(300);
  const text = await p.evaluate(() => navigator.clipboard.readText());
  ok(/^# A reading of /.test(text) && text.includes(DUSD.dc.identifier) && /It says nothing about what a token is worth\./.test(text), 'Copy puts the dated reading on the clipboard');
  const said = [...text.matchAll(/^- (.+?)\. /gm)].map(m => m[1]);
  const shown = await titles(p);
  ok(shown.length > 0 && shown.every((t, i) => said[i] === t), 'the page shows the findings the record text holds, in the same order: ' + shown.length);
  ok(await p.evaluate(() => document.querySelectorAll('.tkr-powers tbody tr').length === 9 && [...document.querySelectorAll('.tkr-powers tbody td')].every(td => td.textContent.trim().length > 2) && document.querySelectorAll('.tkr-powers thead th').length === 3), 'nine powers, each with who holds it and who can change that');
  const link = await p.evaluate(() => { const a = document.querySelector('.tkr-actions a[href]'); return [a.href, a.target, a.rel]; });
  ok(link[0] === 'https://platform-explorer.com/dataContract/' + DUSD.dc.identifier && link[1] === '_blank' && /noopener/.test(link[2]) && /noreferrer/.test(link[2]), 'the record’s link opens the explorer’s page in a new tab and sends no referrer');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.locator('.tkr-actions .btn', { hasText: 'Save the reading' }).click()]);
  ok(/^token-reading-mainnet-[1-9A-HJ-NP-Za-km-z]{8}-\d{4}-\d\d-\d\d\.md$/.test(dl.suggestedFilename()), 'Save writes a dated file: ' + dl.suggestedFilename());
  await shot(p, 'wide-reading', true);
  const low = (await contrastOf(p, INK)).filter(([, r]) => r < 4.5);
  ok(!low.length, 'night: every ink on the reading computes 4.5:1 or better' + (low.length ? ': ' + low.map(([s, r]) => s + ' ' + r).join(', ') : ''));
  const art = (await contrastOf(p, ['.tkr-mark', '.tkr-valve circle'], 'stroke')).filter(([, r]) => r < 3);
  ok(!art.length, 'night: the marks compute 3:1 or better' + (art.length ? ': ' + art.map(([s, r]) => s + ' ' + r).join(', ') : ''));

  /* a structure, and Back */
  const before = hits.length;
  const chip = await p.locator('.tkr-f-models .chip').first().innerText();
  await p.locator('.tkr-f-models .chip').first().click();
  await p.waitForFunction(() => location.hash.startsWith('#/model/'), null, { timeout: 15000 }); await p.waitForTimeout(900);
  ok(true, 'a structure opens its page: ' + chip);
  await p.goBack();
  await p.waitForFunction((id) => location.hash === '#/read/' + id && !!document.querySelector('#tkr-result-h'), DUSD.dc.identifier, { timeout: 15000 }); await p.waitForTimeout(700);
  ok(hits.length === before, 'Back shows the reading again and asks the explorer nothing more');

  /* read another: a token’s own id finds its contract */
  hits = [];
  const tokenId = CLOSED.dc.tokens[0].identifier;
  await readTo(p, CLOSED, tokenId);
  ok(hits[0] === 'GET testnet /dataContract/' + tokenId && hits[1] === 'GET testnet /token/' + tokenId && hits[2] === 'GET testnet /dataContract/' + CLOSED.dc.identifier, 'a token’s own id is looked up and its contract read');
  ok((await hash(p)) === '#/read/' + CLOSED.dc.identifier + '/testnet', 'a testnet reading’s address says testnet');
  ok(/tkr-v-plugged/.test(await vessel(p)) && await p.evaluate(() => !!document.querySelector('.tkr-plug') && !document.querySelector('.tkr-flow')), 'a token no one can ever mint: the pipe is plugged and no light moves in it');
  await shot(p, 'wide-closed');

  /* a group on testnet */
  await readTo(p, GROUP);
  ok(/tkr-v-shared/.test(await vessel(p)) && /Its groups/.test(await p.locator('.tkr-result').innerText()) && /3 members/.test(await p.locator('.tkr-result').innerText()), 'a group’s token: the valve is the group’s, and the group is written out');
  ok(await p.evaluate(() => { const k = document.querySelector('.tkr-powers tbody tr td .tkr-keys'); return !!k && k.querySelectorAll('i').length === 3 && k.querySelectorAll('i.tkr-on').length === 2; }), 'the table marks two keys of three beside the words');

  /* a schedule: tokens the contract releases by itself */
  await readTo(p, TIMED);
  ok(await p.evaluate(() => !!document.querySelector('.tkr-timed .tkr-flow') && !!document.querySelector('.tkr-timed circle')) && (await titles(p)).includes('New Tokens Arrive On A Schedule'), 'a schedule is drawn as its own pipe under a clock, and said');
  await shot(p, 'wide-schedule');
  ok((await titles(p)).includes('One Key Can Replace The Main Group') && /leaves out some of a token’s rules/.test(await p.locator('.tkr-result').innerText()), 'the reading says who can replace the main group, and names the rules the explorer leaves out');

  /* the explorer could not decode it */
  await readTo(p, UNDEC);
  ok((await titles(p))[0] === 'Its Rules Could Not Be Read' && /did not decode the transition/.test(await p.locator('.tkr-result').innerText()), 'a contract the explorer could not decode says its rules were not read');
  ok(await p.evaluate(() => [...document.querySelectorAll('.tkr-powers tbody td')].every(td => td.textContent.trim() === 'Not in the record')) && /tkr-v-unread/.test(await vessel(p)), 'and every power is marked as not in the record');
  await shot(p, 'wide-undecoded');

  /* a contract with no token */
  await readTo(p, DPNS);
  ok((await p.locator('#tkr-result-h').innerText()).trim() === 'A data contract with no token' && /This contract holds no token/.test(await p.locator('.tkr-result').innerText()) && (await p.locator('.tkr-vessel').count()) === 0, 'a contract with no token says so and draws no vessel');
  ok(/Its document types/.test(await p.locator('.tkr-result').innerText()) && /a system contract of Dash Platform/.test(await p.locator('.tkr-result-head .sec').innerText()), 'its document types are read, and a system contract is named as one');

  /* an id no record has, and the explorer down */
  await readIt(p, UNKNOWN, 'mainnet'); await p.waitForTimeout(900);
  ok(/No contract or token with this id on mainnet\. If it is on testnet, switch the network\./.test(await alertText(p)), 'an unknown id says so: ' + (await alertText(p)));
  down = true;
  await readIt(p, DUSD.dc.identifier, 'mainnet'); await p.waitForTimeout(900);
  ok(/The explorer could not be reached/.test(await alertText(p)), 'the explorer down says so: ' + (await alertText(p)));
  down = false;
  await collect(p, 'read');
  await c.close();
}

/* ---------- 3. arriving by an address ---------- */
console.log('-- arriving by an address');
{
  hits = [];
  const c = await context();
  const p = await newPage(c, 'arrive', '/#/read/' + GROUP.dc.identifier + '/testnet');
  ok(hits.length === 0, 'an address that names a contract reads nothing by itself: ' + hits.length);
  ok(await p.evaluate((id) => document.querySelector('.tkr-field input').value === id && document.querySelector('.tkr-net-opt input[value=testnet]').checked, GROUP.dc.identifier), 'the field holds the contract and the network is Testnet');
  ok(/This link names a contract on Testnet\. Press the button to read it\./.test(await p.locator('.tkr-waits').innerText()), 'the page says it is waiting to be asked');
  await p.locator('.tkr-form button[type=submit]').click();
  await p.waitForSelector('#tkr-result-h', { timeout: 15000 }); await p.waitForTimeout(600);
  ok(hits.length === 3 && (await p.locator('#tkr-result-h').innerText()).trim() === GROUP.dec.tokens[0].conventions.localizations.en.singularForm, 'the button reads it');
  for (const no of ['/#/read/treasury', '/#/read/' + GROUP.dc.identifier + '/mainnet']) {
    await p.goto(BASE + no, { waitUntil: 'networkidle' }); await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
    ok((await p.locator('.tkr').count()) === 0, 'an address that names no reading opens Ground: ' + no);
  }
  await collect(p, 'arrive');
  await c.close();
}

/* ---------- 4. an issuer who typed markup ---------- */
console.log('-- a hostile record');
{
  hostile = true;
  const c = await context();
  const p = await newPage(c, 'hostile');
  await readTo(p, DUSD);
  ok((await p.locator('#tkr-result-h').innerText()).includes('<img src=x') && (await p.locator('.tkr-said').innerText()).includes('<img src=x'), 'markup an issuer typed is printed as text');
  ok(await p.evaluate(() => !window.__pwned && document.querySelectorAll('.tkr-result img, .tkr-result script, .tkr-result iframe').length === 0), 'and nothing of it runs or loads');
  ok((await p.locator('#tkr-result-h').innerText()).trim().length <= 40, 'a name is cut to forty characters');
  hostile = false;
  await collect(p, 'hostile');
  await c.close();
}

/* ---------- 5. Find, and the door on the checks page ---------- */
console.log('-- the ways in');
{
  const c = await context();
  const p = await newPage(c, 'ways', '/#/check');
  await p.locator('.tkr-door').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await shot(p, 'wide-door');
  ok(await p.evaluate(() => { const d = document.querySelector('.tkr-door').getBoundingClientRect(), h = document.querySelector('.ck-hub').getBoundingClientRect(); return Math.abs(d.left - h.left) < 2 && Math.abs(d.right - h.right) < 2; }), 'the door on the checks page lines up with the checks above it');
  await p.locator('.tkr-door .btn').click();
  await p.waitForFunction(() => location.hash === '#/read' && !!document.querySelector('.tkr h1'), null, { timeout: 15000 });
  ok(true, 'the checks page opens it');
  await p.goBack(); await p.waitForSelector('.ck-hub', { timeout: 15000 });
  await p.keyboard.press('Control+k'); await p.waitForSelector('.pal input', { timeout: 8000 });
  await p.locator('.pal input').fill('read a token'); await p.waitForTimeout(500);   /* typed into the field itself: the palette takes the focus a moment after it opens */
  ok((await p.locator('.pal-row.on strong').innerText()).trim() === 'Read a token', 'Find lists it first by its name');
  await p.keyboard.press('Enter');
  await p.waitForFunction(() => location.hash === '#/read' && !!document.querySelector('.tkr h1'), null, { timeout: 15000 });
  ok(true, 'and Enter opens it');
  /* the keys: the field, the two networks, the button */
  await p.locator('.tkr-field input').focus();
  await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement?.matches('.tkr-net-opt input[value=mainnet]')), 'Tab moves from the field to the network');
  await p.keyboard.press('ArrowRight');
  ok(await p.evaluate(() => document.querySelector('.tkr-net-opt input[value=testnet]').checked && document.querySelector('.tkr-net-opt.tkr-on').textContent === 'Testnet'), 'an arrow key chooses Testnet');
  ok(await p.evaluate(() => { const o = document.querySelector('.tkr-net-opt.tkr-on'); const s = getComputedStyle(o); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2; }), 'the chosen network shows the focus');
  ok(await p.evaluate(() => document.querySelector('.tkr-form button[type=submit]').disabled), 'with an empty field the button waits');
  await collect(p, 'ways');
  await c.close();
}

/* ---------- 6. the daylight and Mov themes ---------- */
for (const theme of ['meridian', 'mov']) {
  console.log('-- ' + theme);
  const c = await context({}, { theme });
  const p = await newPage(c, theme);
  const ex = (await contrastOf(p, ['.tkr .lede', '.tkr-result-head h2', '.tkr-result-head .sec', '.tkr-pick .btn.tkr-on', '.tkr-pick .btn:not(.tkr-on)', '.tkr-waits, .tkr-says'])).filter(([, x]) => x < 4.5);
  ok(!ex.length, theme + ': the examples’ ink computes 4.5:1 or better' + (ex.length ? ': ' + ex.map(([s, x]) => s + ' ' + x).join(', ') : ''));
  await shot(p, theme + '-example', true);
  await readTo(p, GROUP);
  const r = await contrastOf(p, INK);
  const low = r.filter(([, x]) => x < 4.5);
  ok(!low.length, theme + ': every ink on the reading computes 4.5:1 or better' + (low.length ? ': ' + low.map(([s, x]) => s + ' ' + x).join(', ') : ''));
  console.log('     ' + theme + ' ink: ' + r.map(([s, x]) => s.replace('.tkr-', '').replace('.tkr ', '') + ' ' + x).join(', '));
  const art = await contrastOf(p, ['.tkr-t-alone .tkr-mark', '.tkr-t-held .tkr-mark', '.tkr-valve circle'], 'stroke');
  ok(art.every(([, x]) => x >= 3), theme + ': the marks compute 3:1 or better: ' + art.map(([s, x]) => s.replace('.tkr-', '') + ' ' + x).join(', '));
  await shot(p, theme + '-reading', true);
  await collect(p, theme);
  await c.close();
}

/* ---------- 7. a phone, reduced motion ---------- */
console.log('-- a phone, reduced motion');
{
  const c = await context({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const p = await newPage(c, 'phone');
  const measure = () => p.evaluate(() => ({
    wide: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
    small: [...document.querySelectorAll('.tkr .btn, .tkr-net-opt, .tkr-field input, .tkr-f-models .chip, .tkr-actions a')].filter(b => b.offsetParent && b.getBoundingClientRect().height < 44).map(b => (b.className || b.tagName) + ' ' + Math.round(b.getBoundingClientRect().height)),
    tiny: [...document.querySelectorAll('.tkr *')].filter(e => e.offsetParent && e.children.length === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 12).map(e => e.className + ' ' + getComputedStyle(e).fontSize).slice(0, 4),
    out: [...document.querySelectorAll('.tkr *')].filter(e => e.offsetParent && e.getBoundingClientRect().right > innerWidth + 1).map(e => e.className).slice(0, 4),
  }));
  let m = await measure();
  ok(m.wide[0] <= m.wide[1] && !m.out.length, 'the examples at 390: no sideways scroll, nothing past the edge: ' + m.wide.join('/') + ' ' + m.out.join(','));
  ok(!m.small.length, 'every control is 44px or taller' + (m.small.length ? ': ' + m.small.join(', ') : ''));
  ok(!m.tiny.length, 'no type under 12px' + (m.tiny.length ? ': ' + m.tiny.join(', ') : ''));
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('.tkr-flow')).animationName === 'none'), 'reduced motion: the light in the pipe is still');
  ok(await p.evaluate(() => +document.querySelector('.tkr-vessel g[clip-path] rect').getAttribute('height') > 60), 'reduced motion: the vessel is drawn at its level');
  await shot(p, 'phone-example', true);
  await p.fill('.tkr-field input', GROUP.dc.identifier);
  await p.locator('.tkr-net-opt', { hasText: 'Testnet' }).tap();
  await p.locator('.tkr-form button[type=submit]').tap();
  await p.waitForSelector('#tkr-result-h', { timeout: 15000 }); await p.waitForTimeout(900);
  m = await measure();
  ok(m.wide[0] <= m.wide[1] && !m.out.length, 'a reading at 390: no sideways scroll, nothing past the edge: ' + m.wide.join('/') + ' ' + m.out.join(','));
  ok(!m.small.length, 'every control on the reading is 44px or taller' + (m.small.length ? ': ' + m.small.join(', ') : ''));
  ok(!m.tiny.length, 'no type under 12px on the reading' + (m.tiny.length ? ': ' + m.tiny.join(', ') : ''));
  ok(await p.evaluate(() => { const td = document.querySelector('.tkr-powers tbody td'); const th = document.querySelector('.tkr-powers thead'); return getComputedStyle(td, '::before').content.includes('Who holds it') && th.getBoundingClientRect().width <= 1 && getComputedStyle(td).display === 'flex' && getComputedStyle(document.querySelector('.tkr-powers tbody tr')).flexDirection === 'column'; }), 'on a phone each power is one block, each holder beside its own label');
  ok(await p.evaluate(() => !document.querySelector('.tkr .lede')), 'a reading stands directly under the page’s name');
  ok(await p.evaluate(() => { const v = document.querySelector('.tkr-vessel').getBoundingClientRect(), s = document.querySelector('.tkr-supply').getBoundingClientRect(); return v.bottom <= s.top + 1 && v.width <= 252; }), 'the vessel stands over the numbers, not beside them');
  await shot(p, 'phone-reading', true);
  await shot(p, 'phone-reading-top');
  await collect(p, 'phone');
  await c.close();
}

ok(!strays.length, 'the page asked no host but its own, its fonts and the explorer' + (strays.length ? ': ' + strays.slice(0, 4).join(' | ') : ''));
ok(!csp.length, 'no CSP violations' + (csp.length ? ': ' + csp.join(' | ') : ''));
ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
