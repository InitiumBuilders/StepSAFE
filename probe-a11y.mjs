/* ACCESSIBILITY, measured. The WCAG 2.2 level A and AA success criteria a machine can test, on every main place of
   the app and the policy pages, in the night theme at 1440 wide, and reflow at 320 wide. A browser's own
   accessibility tree (Chrome DevTools Protocol) gives the names and roles; the page gives the rest.
   It is not a conformance claim: names that exist can still be wrong, and a full review needs people with screen
   readers. The accessibility page says so. The report feeds docs/ACR.md.
     node scripts/serve-dist.mjs 5189 &   then   node probe-a11y.mjs [base] [--json docs/a11y-report.json]
   Criteria: 1.1.1 non-text content · 1.3.1 info and relationships · 1.4.3 contrast · 1.4.10 reflow · 2.1.1 keyboard
   · 2.4.2 page titled · 2.4.6 headings and labels · 2.4.7 focus visible · 2.5.8 target size · 3.1.1 language of page
   · 4.1.2 name, role, value. */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = (process.argv[2] && !process.argv[2].startsWith('--')) ? process.argv[2] : 'http://localhost:5189';
const JSON_OUT = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : '';

const PLACES = [
  ['Ground', '/#/'], ['Chapters', '/#/chapters'], ['A chapter', '/#/chapter/ch-identity'], ['A step', '/#/step/ch-foundations-stocks-and-flows'],
  ['The Practice', '/#/practice'], ['A room', '/#/room/sim-halcyon-cold-vault-deception'], ['Modux Models', '/#/models'], ['A model', '/#/model/mm-chain-multisig-governance'],
  ['StepGuides', '/#/guides'], ['A glossary term', '/#/glossary/stock-and-flow'], ['StudyMode', '/#/study'], ['Steps', '/#/steps'], ['The unit', '/#/unit'],
  ['Praxis Profile', '/#/profile'], ['NextSteps', '/#/next'], ['Seva', '/#/seva'], ['Settings', '/#/settings'], ['The checks', '/#/check'], ['Read a token', '/#/read'],
  ['Own record', '/#/trust'], ['Own record, alone', '/trust'], ['Security policy', '/security.html'], ['Privacy', '/privacy.html'], ['Accessibility statement', '/accessibility.html'],
];
const INTERACTIVE = new Set(['button', 'link', 'checkbox', 'radio', 'tab', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'combobox', 'textbox', 'searchbox', 'slider', 'switch', 'spinbutton', 'listbox']);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const add = (place, criterion, what, examples = []) => results.push({ place, criterion, what, count: examples.length || 1, examples: examples.slice(0, 6) });

async function audit(name, path) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'A', guise: 'one', theme: 'nocturne' })); });
  const p = await ctx.newPage();
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  /* ---- the accessibility tree: every control has a name, every image a text alternative ---- */
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Accessibility.enable');
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  const unnamed = [], images = [];
  for (const n of nodes) {
    if (n.ignored) continue;
    const role = n.role?.value || '', label = (n.name?.value || '').trim();
    if (INTERACTIVE.has(role) && !label) unnamed.push(role + (n.backendDOMNodeId ? '#' + n.backendDOMNodeId : ''));
    if ((role === 'image' || role === 'img') && !label) images.push('image#' + n.backendDOMNodeId);
  }
  if (unnamed.length) add(name, '4.1.2', 'controls with no accessible name', unnamed);
  if (images.length) add(name, '1.1.1', 'images with no text alternative', images);
  /* ---- the page itself ---- */
  const page = await p.evaluate(() => {
    const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05; };
    const say = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : '') + ' "' + (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30) + '"';
    const out = { lang: document.documentElement.lang, title: document.title, mains: document.querySelectorAll('main, [role=main]').length, h1: [...document.querySelectorAll('h1')].filter(vis).length, skips: [], refs: [], small: [], noFocusable: [], contrast: [], checkedText: 0 };
    /* heading levels that jump (an h2 then an h4) */
    let last = 0;
    for (const h of [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].filter(vis)) { const lv = +h.tagName[1]; if (last && lv > last + 1) out.skips.push(say(h) + ' after h' + last); last = lv; }
    /* references that point at nothing */
    for (const el of document.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls], label[for]')) {
      for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'for']) {
        const v = el.getAttribute(attr); if (!v) continue;
        for (const id of v.split(/\s+/)) if (id && !document.getElementById(id)) out.refs.push(say(el) + ' ' + attr + '=' + id);
      }
    }
    /* 2.5.8: a control at least 24 by 24 CSS pixels, unless it sits inside a sentence */
    for (const el of document.querySelectorAll('button, a[href], [role=button], [role=tab], [role=radio], [role=checkbox], input:not([type=hidden]), select, summary, textarea')) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      const inline = el.tagName === 'A' && getComputedStyle(el).display.startsWith('inline') && el.parentElement && el.parentElement.innerText.trim().length > (el.innerText || '').trim().length + 12;
      if (!inline && (r.width < 23.5 || r.height < 23.5)) out.small.push(say(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    }
    /* 2.1.1: something that acts as a button but cannot take the keyboard's focus */
    for (const el of document.querySelectorAll('[role=button], [role=tab], [role=link], [onclick]')) if (vis(el) && el.tabIndex < 0 && !el.closest('[inert]')) out.noFocusable.push(say(el));
    /* 1.4.3: text against what it sits on, where the ground is plain colour */
    const rgb = (s) => { const n = (s.match(/[\d.]+/g) || []).map(Number); if (/^color\(srgb/.test(s)) return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1]; return [n[0], n[1], n[2], n[3] ?? 1]; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const groundOf = (el) => {
      let base = rgb(getComputedStyle(document.documentElement).getPropertyValue('--ground').trim().replace(/^#(..)(..)(..)$/, (m, a, b, c) => parseInt(a, 16) + ',' + parseInt(b, 16) + ',' + parseInt(c, 16)));
      if (base.length < 3 || base.some((v) => Number.isNaN(v))) base = [5, 10, 30, 1];
      const stack = [];
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== 'none' && n !== el && !/^(html|body)$/i.test(n.tagName)) return null;
        const c = rgb(cs.backgroundColor); if (c.length >= 3 && (c[3] ?? 1) > 0) stack.push(c);
      }
      for (const c of stack.reverse()) { const a = c[3] ?? 1; base = base.map((v, i) => (i < 3 ? v * (1 - a) + c[i] * a : 1)); }
      return base;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let t = walker.nextNode(); t && out.checkedText < 500; t = walker.nextNode()) {
      const el = t.parentElement;
      if (!el || seen.has(el) || !t.nodeValue.trim() || !vis(el) || el.closest('svg, [aria-hidden=true]')) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      const fg = rgb(cs.color);
      if (fg.length < 3 || (fg[3] ?? 1) < 0.05 || cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)') continue;
      const bg = groundOf(el); if (!bg) continue;
      out.checkedText++;
      const a = fg[3] ?? 1; const f = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
      const L1 = lum(f), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
      const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
      if (ratio < need) out.contrast.push(say(el) + ' ' + ratio.toFixed(2) + ':1 (needs ' + need + ')');
    }
    return out;
  });
  if (!page.lang) add(name, '3.1.1', 'the page declares no language');
  if (path !== '/#/' && /^StepSAFE :: The Praxis$/.test(page.title)) add(name, '2.4.2', 'the tab carries the app’s name, not the page’s', [page.title]);
  if (page.mains !== 1) add(name, '1.3.1', 'main landmarks: ' + page.mains);
  if (page.h1 < 1) add(name, '2.4.6', 'no visible top-level heading');
  if (page.skips.length) add(name, '1.3.1', 'heading levels that jump', page.skips);
  if (page.refs.length) add(name, '1.3.1', 'references to elements that do not exist', page.refs);
  if (page.small.length) add(name, '2.5.8', 'controls smaller than 24 by 24 pixels', page.small);
  if (page.noFocusable.length) add(name, '2.1.1', 'elements that act as controls but cannot take focus', page.noFocusable);
  if (page.contrast.length) add(name, '1.4.3', 'text below its contrast minimum (of ' + page.checkedText + ' checked)', page.contrast);
  /* ---- 2.4.7: the first stops of the keyboard, each one seen to change when it takes focus ---- */
  const unseen = [];
  for (let i = 0; i < 18; i++) {
    await p.keyboard.press('Tab');
    const r = await p.evaluate(() => {
      const el = document.activeElement; if (!el || el === document.body) return null;
      const pick = () => { const cs = getComputedStyle(el); return [cs.outlineStyle + cs.outlineWidth + cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor, cs.color, cs.textDecorationLine].join('|'); };
      const on = pick(); const said = el.tagName.toLowerCase() + ' "' + (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30) + '"';
      return { on, said };
    });
    if (!r) continue;
    const off = await p.evaluate(() => { const el = document.activeElement; el.dataset.a11yWas = '1'; el.blur(); const cs = getComputedStyle(el); return [cs.outlineStyle + cs.outlineWidth + cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor, cs.color, cs.textDecorationLine].join('|'); });
    if (off === r.on) unseen.push(r.said);
    await p.evaluate(() => { const el = document.querySelector('[data-a11y-was]'); if (el) { delete el.dataset.a11yWas; el.focus({ preventScroll: true }); } });
  }
  if (unseen.length) add(name, '2.4.7', 'keyboard stops that do not change when focused', [...new Set(unseen)]);
  /* ---- 1.4.10: at 320 wide nothing scrolls sideways ---- */
  await p.setViewportSize({ width: 320, height: 720 }); await p.waitForTimeout(700);
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (over > 1) add(name, '1.4.10', 'at 320 pixels the page scrolls sideways by ' + over + 'px');
  await ctx.close();
  console.log((results.some((x) => x.place === name) ? 'note ' : 'ok   ') + name + ' (' + page.checkedText + ' texts checked for contrast)');
}

for (const [name, path] of PLACES) {
  try { await audit(name, path); } catch (e) { add(name, 'run', 'could not be audited: ' + String(e).slice(0, 140)); console.log('FAIL ' + name + ': ' + String(e).slice(0, 140)); }
}
await browser.close();

const byCriterion = {};
for (const r of results) (byCriterion[r.criterion] ||= []).push(r);
console.log('\n-- by criterion');
for (const c of Object.keys(byCriterion).sort()) {
  const rs = byCriterion[c];
  console.log(c + ': ' + rs.length + ' place' + (rs.length === 1 ? '' : 's') + ', ' + rs.reduce((n, r) => n + r.count, 0) + ' findings');
  for (const r of rs.slice(0, 8)) console.log('   ' + r.place + ': ' + r.what + (r.examples.length ? ' | ' + r.examples.slice(0, 3).join(' ; ') : ''));
}
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify({ at: new Date().toISOString(), base: BASE, places: PLACES.map(([n]) => n), results }, null, 2));
console.log('\nFINDINGS (' + results.length + ')');
