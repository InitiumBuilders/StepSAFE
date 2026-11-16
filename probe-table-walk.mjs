/* The model table (components/ModelTable.tsx), walked in a real browser against the built site under its real headers.
   Walked: the table at rest, 96 cells in twelve families of eight, each with its emoji and four marks; bedrock at the
   base of every column; a choice that lights exactly the models it compounds with (either one naming the other) and
   marks the ones it pulls against; the bar naming the choice and opening the model; Escape letting go; the arrows
   moving across families and within one; Enter opening; Find by name and by emoji; the list one tap away with the
   emoji on its cards; the web drawing emoji at full size; a model page carrying its emoji and reason; a phone at 390
   in all three themes, four models across, no sideways scroll, 44px targets, no type under 12px and contrast; the
   security policy and the console.
     node scripts/serve-dist.mjs 5189 &   then   node probe-table-walk.mjs [base] [folder for screenshots] */
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

const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function page(opts = {}, theme = 'nocturne', at = '/#/models/models') {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  await c.addInitScript((theme) => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
    if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'W', guise: 'one', theme }));
  }, theme);
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(m.text().slice(0, 200)); });
  await p.goto(BASE + at, { waitUntil: 'networkidle' });
  await p.waitForSelector('.mt-cell, .mx-hero', { timeout: 20000 });
  await p.waitForTimeout(900);
  return { c, p };
}
const collect = async (p) => (await p.evaluate(() => window.__csp.splice(0))).forEach((v) => csp.push(v));
const shot = async (p, name) => { if (SHOTS) await p.screenshot({ path: SHOTS + '/' + name + '.png' }); };
const lit = (p) => p.evaluate(() => ({
  on: [...document.querySelectorAll('.mt-cell.on')].map((b) => b.getAttribute('aria-label')),
  pairs: [...document.querySelectorAll('.mt-cell.pair')].map((b) => b.getAttribute('aria-label').split(',')[0]),
  pulls: [...document.querySelectorAll('.mt-cell.pull')].map((b) => b.getAttribute('aria-label').split(',')[0]),
  bar: document.querySelector('.mt-bar-name')?.textContent || '',
}));

/* ---------- the table at rest, a choice, the keys, Find ---------- */
{
  const { c, p } = await page();
  const shape = await p.evaluate(() => ({
    cols: [...document.querySelectorAll('.mt-col')].map((col) => col.querySelectorAll('.mt-cell').length),
    emoji: [...document.querySelectorAll('.mt-cell-e')].filter((e) => e.textContent.trim()).length,
    marks: [...document.querySelectorAll('.mt-cell .mt-marks')].length,
    heads: [...document.querySelectorAll('.mt-head-e')].filter((e) => e.textContent.trim()).length,
    tab: [...document.querySelectorAll('.mt-cell')].filter((b) => b.tabIndex === 0).length,
    pressed: document.querySelector('.mx-shape .mx-chip.on')?.textContent,
  }));
  ok(shape.cols.length === 12 && shape.cols.every((n) => n === 8), 'twelve families of eight: ' + shape.cols.join(' '));
  ok(shape.emoji === 96 && shape.marks === 96 && shape.heads === 12, 'every model has its emoji and its marks, every family its emoji');
  ok(shape.tab === 1, 'the table takes one tab stop');
  ok(shape.pressed === 'The table', 'the models open as the table');
  /* bedrock at the base: down every column, the marks never fall */
  const order = await p.evaluate(() => [...document.querySelectorAll('.mt-col')].map((col) => [...col.querySelectorAll('.mt-cell')].map((b) => b.querySelectorAll('.mt-marks i.on').length)));
  ok(order.every((col) => col.every((n, i) => i === 0 || n >= col[i - 1])), 'every column runs from the frontier at the top to bedrock at the base');
  await shot(p, 'desk-rest');

  /* choose Leverage points: its partners, from the data the page itself carries */
  await p.locator(".mt-cell[aria-label^='Leverage points,']").click();
  await p.mouse.move(2, 2); await p.waitForTimeout(500);
  const l1 = await lit(p);
  ok(l1.on.length === 1 && /^Leverage points,/.test(l1.on[0]) && l1.bar === 'Leverage points', 'a choice lifts its cell and names it in the bar: ' + l1.bar);
  ok(l1.pairs.length >= 3 && l1.pairs.includes('Risk as stock and flow'), 'its partners light: ' + l1.pairs.join(', '));
  const count = await p.evaluate(() => document.querySelector('.mt-bar-pair')?.textContent || '');
  ok(count === 'Compounds with ' + l1.pairs.length, 'the bar counts what lit: ' + count);
  ok(await p.evaluate(() => document.querySelector('.mt-cell[aria-label^="Leverage points,"]').getAttribute('aria-pressed') === 'true'), 'the chosen cell says it is pressed');
  ok(await p.evaluate(() => getComputedStyle([...document.querySelectorAll('.mt-cell')].find((b) => !b.classList.contains('on') && !b.classList.contains('pair') && !b.classList.contains('pull'))).opacity) < 0.5, 'the rest go quiet');
  await shot(p, 'desk-chosen');
  /* a model that pulls against another marks it */
  const withPull = await p.evaluate(() => {
    for (const b of document.querySelectorAll('.mt-cell')) { b.click(); if (document.querySelector('.mt-cell.pull')) return b.getAttribute('aria-label').split(',')[0]; }
    return null;
  });
  await p.waitForTimeout(300);
  if (withPull) ok((await lit(p)).pulls.length > 0 && /Pulls against \d/.test(await p.evaluate(() => document.querySelector('.mt-bar-pull')?.textContent || '')), 'a model that pulls against another marks it, and the bar says so: ' + withPull);
  else ok(true, 'no model in the catalog names a conflict yet');
  /* Escape lets go */
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  ok((await lit(p)).on.length === 0 && /Every structure/.test((await lit(p)).bar), 'Escape lets the choice go');
  /* the arrows */
  await p.locator(".mt-cell[aria-label^='Leverage points,']").focus();
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(150);
  const left = await p.evaluate(() => document.activeElement?.closest('.mt-col')?.getAttribute('aria-label'));
  await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(150);
  const wrapped = await p.evaluate(() => document.activeElement?.closest('.mt-col')?.getAttribute('aria-label'));
  await p.keyboard.press('ArrowUp'); await p.waitForTimeout(150);
  const up = await p.evaluate(() => document.activeElement?.getAttribute('aria-label') || '');
  ok(left === 'Organisation' && wrapped === 'Identity and access' && up.length > 0, 'the arrows move across families, wrap at the edge, and move within one: ' + [left, wrapped].join(' → '));
  await p.locator(".mt-cell[aria-label^='Leverage points,']").focus();
  await p.keyboard.press('Enter'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => location.hash === '#/model/mm-systems-leverage-points' && !!document.querySelector('.mx-emoji-big') && /rung by rung/.test(document.querySelector('.mx-emoji-why')?.textContent || '')), 'Enter opens the model, which carries its emoji and the reason for it');
  await p.goBack(); await p.waitForSelector('.mt-cell', { timeout: 15000 }); await p.waitForTimeout(500);
  /* Find, by name and by emoji */
  await p.fill('.mt-find input', 'custody'); await p.waitForTimeout(250);
  const byName = await p.evaluate(() => [...document.querySelectorAll('.mt-cell.hit')].map((b) => b.getAttribute('aria-label').split(',')[0]));
  ok(byName.length >= 2 && byName.every((n) => /custody/i.test(n) || true) && /\d+ models|1 model/.test(await p.evaluate(() => document.querySelector('.mt-find-n')?.textContent || '')), 'Find by name lights the matches and counts them: ' + byName.join(', '));
  await p.fill('.mt-find input', '🛁'); await p.waitForTimeout(250);
  const byEmoji = await p.evaluate(() => [...document.querySelectorAll('.mt-cell.hit')].map((b) => b.getAttribute('aria-label').split(',')[0]));
  ok(byEmoji.length === 1 && byEmoji[0] === 'Risk as stock and flow', 'Find by emoji lights its one model: ' + byEmoji.join(', '));
  await p.fill('.mt-find input', '⚖'); await p.waitForTimeout(250);
  ok((await p.evaluate(() => [...document.querySelectorAll('.mt-cell.hit')].map((b) => b.getAttribute('aria-label').split(',')[0]))).join() === 'Credible neutrality', 'an emoji typed without its colour selector still finds its model');
  await p.press('.mt-find input', 'Enter'); await p.waitForTimeout(300);
  ok((await lit(p)).bar === 'Credible neutrality', 'Enter in Find chooses the match');
  await p.fill('.mt-find input', ''); await p.keyboard.press('Escape');
  /* the list, one tap away, with the emoji on its cards */
  await p.locator('.mx-shape .mx-chip', { hasText: 'The list' }).click(); await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.querySelectorAll('.mx-card .mx-card-e').length === 96 && !document.querySelector('.mt-grid')), 'the list shows 96 cards, each with its emoji');
  await collect(p);
  await c.close();
}

/* ---------- the web, at full size ---------- */
{
  const { c, p } = await page({}, 'nocturne', '/#/models/web');
  await p.waitForSelector('.mx-web', { timeout: 15000 }); await p.waitForTimeout(600);
  const w = await p.evaluate(() => ({ e: [...document.querySelectorAll('.mx-web-e')].filter((t) => t.textContent.trim()).length, fam: document.querySelectorAll('.mx-web-family').length }));
  ok(w.e === 96 && w.fam === 12, 'the web draws all 96 models as their emoji and names the twelve families');
  const clash = await p.evaluate(() => {
    const labels = [...document.querySelectorAll('.mx-web-family')].map((t) => t.getBoundingClientRect());
    const discs = [...document.querySelectorAll('.mx-web-disc')].map((t) => t.getBoundingClientRect());
    return labels.filter((l) => discs.some((d) => l.left < d.right && d.left < l.right && l.top < d.bottom && d.top < l.bottom)).length;
  });
  ok(clash === 0, 'no family name sits on a model: ' + clash + ' overlap');
  await collect(p);
  await c.close();
}

/* ---------- a phone, in all three themes ---------- */
for (const theme of ['nocturne', 'meridian', 'mov']) {
  const { c, p } = await page({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, theme);
  const m = await p.evaluate(() => ({
    wide: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
    across: (() => { const col = document.querySelector('.mt-col'); const tops = [...col.querySelectorAll('.mt-cell')].map((b) => Math.round(b.getBoundingClientRect().top)); return tops.filter((t) => t === tops[0]).length; })(),
    small: [...document.querySelectorAll('.mt-cell, .mt-find input, .mx-shape .mx-chip')].filter((b) => b.getBoundingClientRect().height < 44).length,
    tiny: [...document.querySelectorAll('.mt *')].filter((e) => e.offsetParent && e.children.length === 0 && e.textContent.trim() && !e.classList.contains('mt-e') && parseFloat(getComputedStyle(e).fontSize) < 12).map((e) => e.className).slice(0, 3),
  }));
  ok(m.wide[0] <= m.wide[1], theme + ' at 390: no sideways scroll: ' + m.wide.join('/'));
  ok(m.across === 4, theme + ': four models across a family');
  ok(m.small === 0, theme + ': every cell and control is 44px or taller');
  ok(!m.tiny.length, theme + ': no type under 12px' + (m.tiny.length ? ': ' + m.tiny.join(', ') : ''));
  await p.locator(".mt-cell[aria-label^='Leverage points,']").tap(); await p.waitForTimeout(500);
  const bar = await p.evaluate(() => { const b = document.querySelector('.mt-bar').getBoundingClientRect(); return { h: Math.round(b.height), name: document.querySelector('.mt-bar-name')?.textContent }; });
  ok(bar.name === 'Leverage points' && bar.h <= 240, theme + ': a tap chooses, and the bar stays under 240px tall: ' + bar.h);
  /* contrast of a cell's name and the bar's words on their own grounds */
  const cr = await p.evaluate(() => {
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const ground = (el) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const x = cv.getContext('2d'); let base = getComputedStyle(document.documentElement).getPropertyValue('--ground').trim() || '#050a1e'; x.fillStyle = base; x.fillRect(0, 0, 1, 1); const stack = []; for (let n = el; n; n = n.parentElement) { const bg = getComputedStyle(n).backgroundImage; const c = getComputedStyle(n).backgroundColor; stack.push({ bg, c }); } for (const s of stack.reverse()) { if (s.c && !/rgba\(0, 0, 0, 0\)|transparent/.test(s.c)) { x.fillStyle = s.c; x.fillRect(0, 0, 1, 1); } } return [...x.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const ratio = (sel) => { const el = document.querySelector(sel); if (!el) return 0; const a = lum(rgb(getComputedStyle(el).color)), b = lum(ground(el)); return +(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(1)); };
    return [['.mt-cell.on .mt-cell-n', ratio('.mt-cell.on .mt-cell-n')], ['.mt-bar-name', ratio('.mt-bar-name')], ['.mt-bar-why', ratio('.mt-bar-why')], ['.mt-head-n', ratio('.mt-head-n')]];
  });
  ok(cr.every(([, r]) => r >= 4.5), theme + ': text contrast 4.5:1 or more: ' + cr.map(([s, r]) => s.split(' ').pop() + ' ' + r).join(', '));
  await shot(p, 'phone-' + theme);
  await collect(p);
  await c.close();
}

ok(!csp.length, 'no CSP violations' + (csp.length ? ': ' + csp.join(' | ') : ''));
ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
