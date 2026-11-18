/* The wide layer (styles/wide.css, components/StepRail.tsx, components/Practitioners.tsx), walked in a real browser
   against the built site under its real headers, so the behaviour shipped on 2026-11-18 cannot slip without the gate
   saying so. Walked: The Practice in two columns at 1600, three at 1920, one below 1500; a Step's outline beside it
   from 1500 and gone below, with no outline label repeating any other button's words (on the first build "Seal this
   Step" did, and two walks found two seal buttons); the light after a jump to the end on the last part, and a click
   lighting its own part; Ground in two columns from 1500 with the practitioners door in its side column, opening the
   Outlier.Systems group in a new tab; the after-action review's picks side by side from 1180 and stacked on a phone;
   no sideways scroll at any width; the security policy and the console.
     node scripts/serve-dist.mjs 5189 &   then   node probe-wide-walk.mjs [base] [folder for screenshots] */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const SHOTS = process.argv[3] || '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const errors = [], csp = [];
const STEP = 'ch-ciso-s-first-ninety';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function page(w, h, at) {
  const phone = w < 600;
  const c = await browser.newContext({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone });
  await c.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
    if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'W', guise: 'one', theme: 'nocturne', mode: 'motus' }));
  });
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(m.text().slice(0, 200)); });
  await p.goto(BASE + at, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  return { c, p };
}
const collect = async (p) => (await p.evaluate(() => window.__csp.splice(0))).forEach((v) => csp.push(v));
const shot = async (p, name) => { if (SHOTS) await p.screenshot({ path: SHOTS + '/' + name + '.png' }); };
const sideways = (p) => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);

/* The Practice: chapters flow into columns on a wide screen */
for (const [w, h, cols] of [[1600, 1000, 2], [1920, 1080, 3], [1440, 900, 1], [390, 844, 1]]) {
  const { c, p } = await page(w, h, '/#/practice');
  await p.waitForSelector('.pr-bands > .actband', { timeout: 20000 });
  const m = await p.evaluate(() => {
    const bands = [...document.querySelectorAll('.pr-bands > .actband')];
    return { n: bands.length, lefts: new Set(bands.map((b) => Math.round(b.getBoundingClientRect().left))).size };
  });
  ok(m.n > 3 && m.lefts === cols, `The Practice at ${w}: ${m.n} chapters in ${m.lefts} column(s), ${cols} expected`);
  ok(!(await sideways(p)), `The Practice at ${w}: no sideways scroll`);
  await shot(p, 'practice-' + w);
  await collect(p);
  await c.close();
}

/* A Step's outline */
for (const [w, h, shown] of [[1600, 1000, true], [2560, 1440, true], [1440, 900, false], [390, 844, false]]) {
  const { c, p } = await page(w, h, '/#/step/' + STEP);
  await p.waitForSelector('.blk-title', { timeout: 20000 });
  const m = await p.evaluate(() => {
    const r = document.querySelector('.st-rail');
    const labels = r ? [...r.querySelectorAll('button')].map((b) => b.textContent.trim()) : [];
    const others = [...document.querySelectorAll('button')].filter((b) => !b.closest('.st-rail')).map((b) => b.textContent.trim());
    return { display: r ? getComputedStyle(r).display : 'absent', n: labels.length, clash: labels.filter((l) => others.includes(l)) };
  });
  ok(shown ? m.display !== 'none' && m.n >= 2 : m.display === 'none' || m.display === 'absent', `Step at ${w}: the outline is ${shown ? 'beside the Step' : 'not shown'} (${m.display}, ${m.n} parts)`);
  ok(!m.clash.length, `Step at ${w}: no outline label repeats another button's words` + (m.clash.length ? ': ' + m.clash.join(', ') : ''));
  ok(!(await sideways(p)), `Step at ${w}: no sideways scroll`);
  if (shown) {
    await p.keyboard.press('End'); await p.waitForTimeout(700);
    await p.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(700);
    const atEnd = await p.evaluate(() => { const li = [...document.querySelectorAll('.st-rail li')]; return { last: li.length - 1, lit: li.findIndex((x) => x.classList.contains('on')) }; });
    ok(atEnd.lit === atEnd.last, `Step at ${w}: at the end of the page the last part is lit (lit ${atEnd.lit} of ${atEnd.last})`);
    await p.locator('.st-rail button').first().click(); await p.waitForTimeout(1600);
    const held = await p.evaluate(() => { const li = [...document.querySelectorAll('.st-rail li')]; const first = document.querySelector('.blk-title, [data-st-part]'); return { lit: li.findIndex((x) => x.classList.contains('on')), top: Math.round(first.getBoundingClientRect().top) }; });
    ok(held.lit === 0 && held.top < 400, `Step at ${w}: a click on the first part lights it and brings it up (lit ${held.lit}, its heading at ${held.top}px)`);
    await shot(p, 'step-' + w);
  }
  await collect(p);
  await c.close();
}

/* Ground in two columns, and the practitioners door */
for (const [w, h, two] of [[1600, 1000, true], [390, 844, false]]) {
  const { c, p } = await page(w, h, '/#/');
  await p.waitForSelector('.home-grid', { timeout: 20000 });
  const m = await p.evaluate(() => {
    const main = document.querySelector('.home-main'), side = document.querySelector('.home-side');
    const a = document.querySelector('.prx a');
    return {
      beside: main && side ? Math.abs(main.getBoundingClientRect().top - side.getBoundingClientRect().top) < 40 && side.getBoundingClientRect().left > main.getBoundingClientRect().left + 100 : false,
      door: a ? { href: a.getAttribute('href'), target: a.target, rel: a.rel, inSide: !!a.closest('.home-side'), h: Math.round(a.getBoundingClientRect().height) } : null,
    };
  });
  ok(two ? m.beside : !m.beside, `Ground at ${w}: ${two ? 'two columns side by side' : 'one column'}`);
  ok(!!m.door && m.door.href === 'https://t.me/Outlier_Systems' && m.door.target === '_blank' && /noopener/.test(m.door.rel) && m.door.inSide, `Ground at ${w}: the practitioners door opens the Outlier.Systems group in a new tab`);
  ok(!!m.door && m.door.h >= 44, `Ground at ${w}: the door is a 44px target (${m.door && m.door.h}px)`);
  ok(!(await sideways(p)), `Ground at ${w}: no sideways scroll`);
  await shot(p, 'ground-' + w);
  await collect(p);
  await c.close();
}

/* The after-action review's picks: the rule in the stylesheet, read on a box built from the room's own classes */
for (const [w, h, side] of [[1440, 900, true], [390, 844, false]]) {
  const { c, p } = await page(w, h, '/#/practice');
  const m = await p.evaluate(() => {
    const box = document.createElement('div'); box.className = 'aar-picks';
    box.innerHTML = '<div class="aar-pick">a</div><div class="aar-pick best">b</div>';
    document.body.appendChild(box);
    const [a, b] = [...box.children].map((x) => x.getBoundingClientRect());
    const out = { display: getComputedStyle(box).display, sideBySide: Math.abs(a.top - b.top) < 2 && b.left > a.left };
    box.remove();
    return out;
  });
  ok(side ? m.display === 'grid' && m.sideBySide : !m.sideBySide, `the review's picks at ${w}: ${side ? 'side by side' : 'one above the other'} (${m.display})`);
  await collect(p);
  await c.close();
}

ok(!csp.length, 'no CSP violations' + (csp.length ? ': ' + csp.join(' | ') : ''));
ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
