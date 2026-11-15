/* The phone floor, walked in a real browser against the built site at 390 wide: every page of the app, and the
   places a learner goes deepest (a gauge, a room's brief and its live feed, a Step, the glossary, the checks).
   On each: no sideways scroll, no text under 12px, no text cut off by an ellipsis, and no more controls under a
   finger's 44px than docs/TOUCH-RATCHET.json records. That count may fall and may not rise; what is left in it is
   named there (the columns of a chart are as wide as a day).
     node scripts/serve-dist.mjs 5189 &   then   node probe-touch.mjs [base] [--write] [--list] */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const args = process.argv.slice(2);
const BASE = args.find((a) => /^https?:/.test(a)) || 'http://localhost:5189';
const WRITE = args.includes('--write'), LIST = args.includes('--list');
const RATCHET = 'docs/TOUCH-RATCHET.json';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
/* on a phone Find lives in the sheet that More opens */
const openFind = async (p) => { if (!(await p.locator('.nav-find').first().isVisible())) { await p.locator('.tab-more').tap(); await p.waitForTimeout(450); } await p.locator('.nav-find').first().tap(); };

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await ctx.addInitScript(() => { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus' })); });
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);

const measure = () => p.evaluate(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05; };
  const say = (el) => (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : el.tagName.toLowerCase()) + ' "' + (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 26) + '"';
  const doc = document.documentElement;
  const small = [], tiny = [], cut = [];
  for (const el of document.querySelectorAll('button, a[href], [role=button], [role=tab], [role=radio], input:not([type=hidden]), select, summary, textarea')) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    /* a link inside a sentence is as tall as its line; only a control that stands by itself is held to a finger */
    const inline = el.tagName === 'A' && getComputedStyle(el).display.startsWith('inline') && el.parentElement && el.parentElement.innerText.trim().length > (el.innerText || '').trim().length + 12;
    if (!inline && (r.height < 43.5 || r.width < 43.5)) small.push(say(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || seen.has(el) || !n.nodeValue.trim() || !vis(el) || el.closest('svg')) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    if (parseFloat(cs.fontSize) < 11.9) tiny.push(say(el) + ' ' + parseFloat(cs.fontSize).toFixed(1) + 'px');
    if (cs.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) cut.push(say(el));
  }
  return { over: doc.scrollWidth - doc.clientWidth, small: small.length, smallEx: [...new Set(small)].slice(0, 8), tiny: [...new Set(tiny)].slice(0, 6), cut: [...new Set(cut)].slice(0, 6) };
});

const nav = async (label) => { await p.evaluate((l) => [...document.querySelectorAll('.nav button')].find((x) => x.textContent.trim().startsWith(l))?.click(), label); await p.waitForTimeout(1500); };
const find = async (text) => { await openFind(p); await p.waitForSelector('.pal input'); await p.fill('.pal input', text); await p.waitForTimeout(700); await p.locator('.pal-main', { hasText: text }).first().tap(); await p.waitForTimeout(1600); };

/* every place measured, in the order a learner might walk them */
const PLACES = [
  ['ground', async () => {}],
  ['chapters', () => nav('Chapters')],
  ['step', () => find('Stocks, Flows')],
  ['practice', () => nav('The Practice')],
  ['room-brief', async () => { await p.locator('.simcard').first().tap(); await p.waitForTimeout(1400); }],
  ['room-live', async () => { await p.locator('.sim-dock button').tap(); await p.waitForTimeout(1200); }],
  ['modux', () => nav('Modux')],
  ['gauge', async () => { await p.locator('.gx-card-wrap button').first().tap(); await p.waitForTimeout(2000); await p.locator('.gx-hold-open').first().tap(); await p.waitForTimeout(400); }],
  ['guides', () => nav('StepGuides')],
  ['glossary', async () => { await p.locator('.gs-tab', { hasText: 'Glossary' }).tap(); await p.waitForSelector('.gl-row'); await p.waitForTimeout(400); }],
  ['study', () => nav('StudyMode')],
  ['steps', () => nav('Steps')],
  ['unit', () => nav('UNIT')],
  ['profile', () => nav('Praxis Profile')],
  ['next', () => nav('NextSteps')],
  ['seva', () => nav('Seva')],
  ['settings', () => nav('Settings')],
  ['checks', async () => { await nav('Ground'); await p.evaluate(() => [...document.querySelectorAll('.ck-door .btn')][0]?.click()); await p.waitForSelector('.ck h1', { timeout: 15000 }); await p.waitForTimeout(600); }],
  ['read a token', async () => { await find('Read a token'); await p.waitForSelector('.tkr h1', { timeout: 15000 }); await p.waitForTimeout(900); }],
  ['own record', async () => { await nav('Settings'); await p.locator('button', { hasText: 'StepSAFE’s own record' }).tap(); await p.waitForSelector('.ownr h1', { timeout: 15000 }); await p.locator('.ownr-read .btn-key').first().tap(); await p.waitForSelector('.ownr-sum', { timeout: 15000 }); await p.waitForTimeout(600); }],
];

const ratchet = (() => { try { return JSON.parse(readFileSync(RATCHET, 'utf8')); } catch { return { at: '', small: {} }; } })();
const now = {};
for (const [name, go] of PLACES) {
  try { await go(); } catch (e) { ok(false, name + ': could not be reached: ' + String(e).slice(0, 120)); continue; }
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  const m = await measure();
  now[name] = m.small;
  const allowed = ratchet.small?.[name] ?? 0;
  ok(m.over <= 0, name + ': no sideways scroll' + (m.over > 0 ? ' (' + m.over + 'px over)' : ''));
  ok(m.tiny.length === 0, name + ': no text under 12px' + (m.tiny.length ? ': ' + m.tiny.join(', ') : ''));
  ok(m.cut.length === 0, name + ': no text cut off' + (m.cut.length ? ': ' + m.cut.join(', ') : ''));
  ok(m.small <= allowed, name + ': ' + m.small + ' controls under a finger' + (allowed ? ' (' + allowed + ' on record)' : '') + (m.small > allowed ? ': ' + m.smallEx.join(', ') : ''));
  if (LIST && m.small) console.log('     ' + m.smallEx.join(', '));
}
ok(errors.length === 0, 'no page error or console error' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
await browser.close();

const fell = Object.keys(now).filter((k) => now[k] < (ratchet.small?.[k] ?? 0));
if (WRITE || (!ratchet.at && !problems.length)) {
  const small = Object.fromEntries(Object.entries(now).filter(([, n]) => n > 0));
  const d = new Date(); const at = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  writeFileSync(RATCHET, JSON.stringify({ at, note: 'Controls under 44px at 390 wide, by place. A count may fall and may not rise. Seva: the columns of the time chart are as wide as a day. Chapters: one node of the map is 41px wide.', small }, null, 2) + '\n');
  console.log('ratchet written: ' + JSON.stringify(small));
} else if (fell.length) console.log('fell since the record (run with --write to keep it): ' + fell.map((k) => k + ' ' + (ratchet.small[k]) + ' to ' + now[k]).join(', '));
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
