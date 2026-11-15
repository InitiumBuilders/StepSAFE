/* One live read through a deployed page, with the real explorer and the site's real policy. No stand-ins.
     node live-read.mjs <base> <contract or token id> [testnet] [screenshot path] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const [BASE, ID, NET, SHOT] = [process.argv[2], process.argv[3], process.argv[4] === 'testnet' ? 'testnet' : 'mainnet', process.argv[5] || ''];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await c.addInitScript(() => {
  window.__csp = [];
  document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
  if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne' }));
});
const p = await c.newPage();
const asked = [], errors = [];
p.on('request', (r) => { if (/platform-explorer/.test(r.url())) asked.push(r.method() + ' ' + new URL(r.url()).host + new URL(r.url()).pathname.replace(/[A-Za-z0-9]{30,}/g, (m) => m.slice(0, 6) + '…')); });
p.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
await p.goto(BASE + '/#/read', { waitUntil: 'networkidle' });
await p.waitForSelector('.tkr h1', { timeout: 30000 });
await p.fill('.tkr-field input', ID);
if (NET === 'testnet') await p.locator('.tkr-net-opt input[value=testnet]').check();
const t0 = Date.now();
await p.locator('.tkr-form button[type=submit]').click();
await p.waitForFunction(() => !!document.querySelector('#tkr-result-h') || !!document.querySelector('.tkr-err'), null, { timeout: 40000 });
const ms = Date.now() - t0;
await p.waitForTimeout(2600);
const out = await p.evaluate(() => ({
  err: document.querySelector('.tkr-err')?.textContent || '',
  name: document.querySelector('#tkr-result-h')?.textContent || '',
  label: document.querySelector('.tkr-result-head .label')?.textContent || '',
  findings: [...document.querySelectorAll('.tkr-f-title')].map((e) => e.textContent),
  supply: [...document.querySelectorAll('.tkr-supply dd')].map((e) => e.textContent),
  vessel: document.querySelector('.tkr-vessel')?.getAttribute('class') || '',
  hash: location.hash.replace(/[A-Za-z0-9]{30,}/, (m) => m.slice(0, 8) + '…'),
  csp: window.__csp,
}));
if (SHOT) await p.screenshot({ path: SHOT });
console.log(JSON.stringify({ ms, asked, errors, ...out }, null, 1));
await browser.close();
