/* The Content-Security-Policy, walked: the built site under vercel.json's headers (scripts/serve-dist.mjs), through
   the welcome page, onboarding, every nav tab, a gauge and its 3D World, StudyMode and Settings with a stand-in key's
   connection check. Any violation the browser reports is a failure.
     node scripts/serve-dist.mjs 5189 &   then   node probe-csp.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };

const b = await chromium.launch({ channel: 'chrome', headless: true });
const viol = [], errs = [];
async function ctx(onboarded) {
  const c = await b.newContext({ viewport: { width: 1280, height: 860 } });
  await c.addInitScript((on) => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + (e.blockedURI || '') + ' ' + (e.sourceFile || '').slice(-40)));
    if (on && !localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'probe' }));
    try { localStorage.setItem('stepsafe-world-tour-v1', '1'); } catch {}
  }, onboarded);
  const p = await c.newPage();
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  p.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(t)) errs.push(t.slice(0, 160)); if (/Content Security Policy|Refused to/.test(t)) viol.push(t.slice(0, 200)); });
  return p;
}
const collect = async (p, where) => { const v = await p.evaluate(() => window.__csp.splice(0)); v.forEach((x) => viol.push(where + ': ' + x)); return v.length; };
const clickText = async (p, re) => { const el = p.locator('button, a, [role="tab"]', { hasText: re }).first(); if (await el.count()) { await el.click({ timeout: 4000 }).catch(() => {}); return true; } return false; };

// a first visit: the welcome page and its live demo
let p = await ctx(false);
await p.goto(BASE + '/welcome', { waitUntil: 'load' }); await p.waitForTimeout(3500);
ok((await collect(p, 'welcome')) === 0, 'the welcome page under the policy');
await p.context().close();

// an onboarded learner: every nav tab
p = await ctx(true);
await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(3000);
ok((await collect(p, 'ground')) === 0, 'Ground under the policy');
const tabs = await p.$$eval('nav button, nav a', (els) => els.map((e) => (e.textContent || '').trim()).filter((t) => t && t.length < 24));
const seen = [];
for (const t of [...new Set(tabs)].slice(0, 16)) {
  await clickText(p, new RegExp('^\\s*' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$')); await p.waitForTimeout(1600);
  const n = await collect(p, 'tab ' + t); seen.push(t + (n ? ' (' + n + ')' : ''));
}
console.log('tabs walked: ' + seen.join(' · '));
ok(!viol.some((v) => v.startsWith('tab ')), 'every nav tab under the policy');

// a gauge and its World
await clickText(p, /Modux Models/); await p.waitForTimeout(1500);
await p.getByText(/The Signing Screen/).first().click({ timeout: 5000 }).catch(() => {}); await p.waitForTimeout(2000);
const entered = await clickText(p, /Enter the world|Build and enter the world/);
await p.waitForTimeout(entered ? 6000 : 500);
ok((await collect(p, 'world')) === 0, 'a gauge' + (entered ? ' and its 3D World' : ' (the World button was not found)') + ' under the policy');
await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(800);

// StudyMode, where the field signal reaches the research APIs
await clickText(p, /StudyMode/); await p.waitForTimeout(2500);
await clickText(p, /Deck|Atlas|Shelf/); await p.waitForTimeout(2000);
ok((await collect(p, 'study')) === 0, 'StudyMode under the policy');

// Settings: a stand-in key, and the connection check reaches api.anthropic.com
await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(1500);
await clickText(p, /Settings/); await p.waitForTimeout(1500);
await clickText(p, /your own|Anthropic|bring your own/i); await p.waitForTimeout(800);
const key = p.locator('#antkey'); if (await key.count()) { await key.fill('sk-ant-csp-probe-' + 'x'.repeat(40)); await p.waitForTimeout(300); await clickText(p, /Check the connection/); await p.waitForTimeout(4000); }
ok((await collect(p, 'settings')) === 0, 'Settings and a connection check under the policy' + ((await key.count()) ? '' : ' (no key field found)'));
const stored = await p.evaluate(() => localStorage.getItem('stepsafe-praxis-v1') || '');
ok(!stored.includes('sk-ant-csp-probe'), 'the pasted key never reached the saved record');

console.log('violations: ' + (viol.length ? '\n  ' + viol.join('\n  ') : 'none'));
console.log('console errors: ' + (errs.length ? errs.slice(0, 8).join(' | ') : 'none'));
await b.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')' : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
