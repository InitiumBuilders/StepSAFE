// One practice room played end to end, photographed at each phase: the brief, the first decision before and after a
// choice, the middle of the run, and the debrief. For judging the rooms as an experience at phone and screen sizes.
//   node scripts/look/room.mjs <base> <out folder> [room id] [widths, comma separated] [theme]
// It always picks the first option, so the run is the same each time.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const OUT = process.argv[3];
const ROOM = process.argv[4] || 'sim-halcyon-cold-vault-deception';
const WIDTHS = (process.argv[5] || '390,1440,2560').split(',').map(Number);
const THEME = process.argv[6] || 'nocturne';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const notes = [];
for (const w of WIDTHS) {
  const phone = w < 600;
  const h = phone ? 844 : w >= 2000 ? 1440 : 900;
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  await c.addInitScript((theme) => {
    localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme, mode: 'motus' }));
  }, THEME);
  const p = await c.newPage();
  p.on('pageerror', (e) => notes.push(`${w} pageerror: ${e.message.slice(0, 160)}`));
  const shot = (name) => p.screenshot({ path: `${OUT}/${THEME === 'nocturne' ? '' : THEME + '-'}${w}-${name}.png` });
  const click = (re) => p.evaluate((src) => {
    const r = new RegExp(src);
    const el = [...document.querySelectorAll('button')].find((x) => r.test((x.textContent || '').trim()) && !x.disabled);
    if (el) { el.click(); return true; }
    return false;
  }, re.source);
  await p.goto(`${BASE}/#/room/${ROOM}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(2200);
  await shot('1-brief');
  await click(/^Take the chair$/); await p.waitForTimeout(1500);
  await shot('2-live-start');
  let decisions = 0, steps = 0;
  while (steps++ < 60) {
    const opt = await p.$('.drill .opts button:not([disabled])');
    const picked = await p.$('.drill .outcome');
    if (opt && !picked) {
      if (decisions === 0) { await opt.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await shot('3-decision'); }
      await opt.click(); await p.waitForTimeout(900);
      decisions++;
      if (decisions === 1) { await p.evaluate(() => document.querySelector('.drill .outcome')?.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400); await shot('4-outcome'); }
      continue;
    }
    if (decisions === 2 && !(await p.evaluate(() => window.__midShot))) { await p.evaluate(() => { window.__midShot = true; window.scrollTo(0, document.documentElement.scrollHeight); }); await p.waitForTimeout(300); await shot('5-mid'); }
    const end = await click(/End of exercise/);
    if (end) break;
    if (!(await click(/^Continue/))) break;
    await p.waitForTimeout(500);
  }
  await p.waitForTimeout(1800);
  await shot('6-debrief');
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.45)); await p.waitForTimeout(400);
  await shot('7-debrief-mid');
  console.log(`${w}: ${decisions} decisions, ${steps} steps, sideways ${await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)}`);
  await c.close();
}
await b.close();
console.log('errors: ' + (notes.length ? notes.join(' | ') : 'none'));
