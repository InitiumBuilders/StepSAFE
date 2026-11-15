/* The one-character shortcuts, walked (WCAG 2.1.4). With them on, / opens Find and ? opens the list of keys. With
   them off in Settings, neither does, and Ctrl or Cmd with K still opens Find. Settings' own switch is pressed too,
   so the setting is seen to take effect without a reload. Run against the built site under its real headers.
     node scripts/serve-dist.mjs 5189 &   then   node probe-keys.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const errors = [];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function open(shortcuts) {
  const c = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  await c.addInitScript(([sc]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'K', guise: 'one', theme: 'nocturne', ...(sc ? { shortcuts: sc } : {}) }));
  }, [shortcuts]);
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  await p.goto(BASE + '/#/chapters', { waitUntil: 'networkidle' });
  await p.waitForSelector('.view-head h1', { timeout: 20000 }); await p.waitForTimeout(900);
  await p.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
  return { c, p };
}
const find = (p) => p.evaluate(() => !!document.querySelector('.pal:not(.pal-keys)'));
const keys = (p) => p.evaluate(() => !!document.querySelector('.pal-keys'));

{ /* an older record with no setting: the shortcuts are on */
  const { c, p } = await open(null);
  await p.keyboard.press('/'); await p.waitForTimeout(300);
  ok(await find(p), 'with no setting saved, / opens Find');
  await p.keyboard.press('Escape'); await p.waitForTimeout(250);
  await p.keyboard.press('?'); await p.waitForTimeout(300);
  ok(await keys(p), 'and ? opens the list of keys');
  await c.close();
}
{ /* turned off in the record */
  const { c, p } = await open('off');
  await p.keyboard.press('/'); await p.waitForTimeout(300);
  ok(!(await find(p)), 'with shortcuts off, / opens nothing');
  await p.keyboard.press('?'); await p.waitForTimeout(300);
  ok(!(await keys(p)), 'and ? opens nothing');
  await p.keyboard.press('Control+k'); await p.waitForTimeout(300);
  ok(await find(p), 'Ctrl with K still opens Find');
  await c.close();
}
{ /* Settings' switch takes effect at once */
  const { c, p } = await open('on');
  await p.evaluate(() => { location.hash = '#/settings'; });
  await p.waitForFunction(() => [...document.querySelectorAll('.label')].some((l) => l.textContent === 'Single-key shortcuts'), null, { timeout: 15000 });
  const row = p.locator('.disp-row', { hasText: 'Single-key shortcuts' });
  ok(await row.locator('button', { hasText: 'On' }).getAttribute('aria-pressed') === 'true', 'Settings shows the shortcuts on, as the record says');
  await row.locator('button', { hasText: 'Off' }).click(); await p.waitForTimeout(300);
  ok(await row.locator('button', { hasText: 'Off' }).getAttribute('aria-pressed') === 'true', 'pressing Off marks it off');
  await p.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
  await p.keyboard.press('/'); await p.waitForTimeout(300);
  ok(!(await find(p)), 'and / no longer opens Find, without a reload');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('stepsafe-praxis-v1') || '{}').shortcuts === 'off'), 'the choice is kept in the record');
  await c.close();
}
ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
