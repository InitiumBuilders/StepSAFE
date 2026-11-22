/* Read a token, walked in WebKit at iPhone 15 size against the built site. WebKit is the engine Safari uses, so
   this is the nearest thing here to August's own phone. The explorer is stood in for by the saved records, as in
   probe-read-walk.mjs. It asserts what is visible: the two made-up tokens with the vessel drawn at its level, the
   field, the network choice and the button reachable by a thumb, a reading with its heading, its findings, its
   powers one block each, and nothing scrolling sideways.

   It needs a Playwright whose WebKit build is installed on this machine; it tries the installs it knows of and
   says which one it used. Exit 2 means no WebKit could be launched, which is not a failure of the site.
     node scripts/serve-dist.mjs 5189 &   then   node probe-read-webkit.mjs [base] [folder for screenshots] */
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const BASE = process.argv[2] || 'http://localhost:5189';
const SHOTS = process.argv[3] || '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };

const INSTALLS = ['C:/Users/Initi/DuoZone', 'C:/Users/Initi/duodash-ai', 'C:/Users/Initi/iphone-duos-sold', 'C:/Users/Initi/gino-works', 'C:/Users/Initi/semble-up-citizens'];
let browser = null, devices = null;
for (const dir of INSTALLS) {
  try {
    const pw = require(dir + '/node_modules/playwright-core');
    browser = await pw.webkit.launch({ headless: true });
    devices = pw.devices;
    console.log('WebKit from ' + dir);
    break;
  } catch { /* this install's WebKit build is not on the machine; try the next */ }
}
if (!browser) { console.log('No WebKit could be launched. Install one with: npx playwright install webkit'); process.exit(2); }

/* the explorer, stood in for by the saved records */
const DIR = 'research/evidence/onchain/';
const FX = readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => ({ name: f.replace(/\.json$/, ''), ...JSON.parse(readFileSync(DIR + f, 'utf8')) }));
const GROUP = FX.find(f => f.name === 'testnet-group-mints');
let hits = 0;
async function explorer(route) {
  const req = route.request();
  const u = new URL(req.url());
  const net = u.host.startsWith('testnet.') ? 'testnet' : 'mainnet';
  hits++;
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'GET, POST, OPTIONS' };
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
  const json = (status, body) => route.fulfill({ status, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const on = FX.filter(f => f.net === net);
  let m;
  if ((m = /^\/dataContract\/([^/]+)$/.exec(u.pathname))) { const f = on.find(x => x.dc.identifier === m[1]); return f ? json(200, f.dc) : json(404, {}); }
  if (u.pathname === '/transaction/decode') {
    let hash = ''; try { hash = Buffer.from(JSON.parse(req.postData() || '{}').base64 || '', 'base64').toString(); } catch { /* answered as not decoded */ }
    const f = on.find(x => x.dc.txHash === hash);
    return f && f.dec ? json(200, f.dec) : json(500, { error: 'not decoded' });
  }
  if ((m = /^\/transaction\/([0-9A-Fa-f]{64})$/.exec(u.pathname))) { const f = on.find(x => x.dc.txHash === m[1]); return f ? json(200, { hash: m[1], data: Buffer.from(m[1]).toString('base64') }) : json(404, {}); }
  return json(404, {});
}

/* service workers are blocked: once the app's worker controls the page, WebKit sends the explorer request where
   ctx.route cannot see it, and the walk would read the live explorer instead of the saved records */
const ctx = await browser.newContext({ ...devices['iPhone 15'], serviceWorkers: 'block' });
await ctx.addInitScript(() => {
  window.__csp = [];
  document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
  if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus' }));
});
await ctx.route(/platform-explorer\.pshenmic\.dev/, explorer);
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
await p.goto(BASE + '/#/read', { waitUntil: 'networkidle' });
await p.waitForSelector('.tkr h1', { timeout: 20000 });
await p.waitForTimeout(3200);
const shot = async (name, full = false) => { if (SHOTS) await p.screenshot({ path: SHOTS + '/' + name + '.png', fullPage: full }); };
const measure = () => p.evaluate(() => ({
  wide: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
  out: [...document.querySelectorAll('.tkr *')].filter(e => e.offsetParent && e.getBoundingClientRect().right > innerWidth + 1).map(e => String(e.className)).slice(0, 4),
  small: [...document.querySelectorAll('.tkr .btn, .tkr-net-opt, .tkr-field input, .tkr-f-models .chip, .tkr-actions a')].filter(b => b.offsetParent && b.getBoundingClientRect().height < 44).map(b => String(b.className) + ' ' + Math.round(b.getBoundingClientRect().height)),
}));

ok((await p.locator('.tkr h1').innerText()).trim() === 'Read a token', 'the page opens by its address');
ok((await p.locator('.tkr-f-title').count()) === 5, 'the first made-up token shows its five findings');
/* The fill rises over 1.2 s once the vessel is a quarter in view, or after a 1.5 s failsafe: it reached its level
   about 2.1 s after the heading on two builds (measured 21 Nov 2026), and the fixed pause read it mid-rise when
   WebKit's frames came late under load (145.1, then 242.0). It now waits for the level, up to eight seconds. */
let level = [0, 0];
for (let t = 0; t < 80; t++) {
  level = await p.evaluate(() => { const r = document.querySelector('.tkr-vessel g[clip-path] rect'); return r ? [+r.getAttribute('y'), +r.getAttribute('height')] : [0, 0]; });
  if (Math.abs(level[0] - (242 - 180 * 0.56)) < 2) break;
  await p.waitForTimeout(100);
}
ok(Math.abs(level[0] - (242 - 180 * 0.56)) < 2 && level[1] > 90, 'its vessel is drawn at its level: ' + level.map(n => n.toFixed(1)).join(' / '));
ok(await p.evaluate(() => { const v = document.querySelector('.tkr-vessel').getBoundingClientRect(); return v.width > 180 && v.height > 180; }), 'and the drawing has its size');
let m = await measure();
ok(m.wide[0] <= m.wide[1] && !m.out.length, 'the examples: no sideways scroll, nothing past the edge: ' + m.wide.join('/') + ' ' + m.out.join(','));
ok(!m.small.length, 'every control is 44px or taller' + (m.small.length ? ': ' + m.small.join(', ') : ''));
await shot('webkit-example');
await p.locator('.tkr-pick button', { hasText: 'A group holds it' }).tap(); await p.waitForTimeout(3200);
ok(await p.evaluate(() => document.querySelectorAll('.tkr-valve-keys circle').length === 3 && !!document.querySelector('.tkr-rim')), 'the second made-up token: three marks over the valve and a rim');

ok(hits === 0, 'nothing has been asked of the explorer yet: ' + hits);
await p.locator('.tkr-field input').fill(GROUP.dc.identifier);
await p.locator('.tkr-net-opt', { hasText: 'Testnet' }).tap();
ok(await p.evaluate(() => document.querySelector('.tkr-net-opt input[value=testnet]').checked), 'a tap chooses Testnet');
await p.locator('.tkr-form button[type=submit]').tap();
await p.waitForFunction((id) => location.hash.includes(id) && !!document.querySelector('#tkr-result-h'), GROUP.dc.identifier, { timeout: 20000 });
await p.waitForTimeout(3200);
ok((await p.locator('#tkr-result-h').innerText()).trim() === GROUP.dec.tokens[0].conventions.localizations.en.singularForm, 'the reading arrives under the token’s name');
ok(await p.evaluate(() => { const h = document.querySelector('#tkr-result-h').getBoundingClientRect(); return h.top >= 0 && h.bottom < innerHeight; }), 'and its name is on the first screen');
ok((await p.locator('.tkr-f-title').count()) >= 5 && (await p.locator('.tkr-powers tbody tr').count()) === 9, 'with its findings and the nine powers');
ok(await p.evaluate(() => { const td = document.querySelector('.tkr-powers tbody td'); return getComputedStyle(td, '::before').content.includes('Who holds it') && getComputedStyle(document.querySelector('.tkr-powers tbody tr')).flexDirection === 'column'; }), 'each power is one block, each holder beside its own label');
m = await measure();
ok(m.wide[0] <= m.wide[1] && !m.out.length, 'a reading: no sideways scroll, nothing past the edge: ' + m.wide.join('/') + ' ' + m.out.join(','));
ok(!m.small.length, 'every control on the reading is 44px or taller' + (m.small.length ? ': ' + m.small.join(', ') : ''));
await shot('webkit-reading-top');
await shot('webkit-reading', true);
const csp = await p.evaluate(() => window.__csp);
ok(!csp.length, 'no CSP violations' + (csp.length ? ': ' + csp.join(' | ') : ''));
ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
