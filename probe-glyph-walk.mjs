/* Gradient words keep their tails, walked in a real browser against the built site. A word painted with
   background-clip: text shows only what falls inside its own box, and the statements on the front door and the
   rising page headings set their lines at a height under 1, so the tails of g, y and p hung below the box and were
   cut: until 21 Nov 2026 "Design" in the front door's headline lost 10.7px of its g at 1280, and "Right." 12.2px.
   For every element painted that way, this measures its text in its own font and says how much of any glyph falls
   outside its box, below and above, on the front door and on every page whose heading carries a gradient, at 1280
   and 390, in Nocturne and Meridian. A cut of more than half a pixel fails.
     node scripts/serve-dist.mjs 5189 &   then   node probe-glyph-walk.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv.slice(2).find((a) => /^https?:/.test(a)) || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const errors = [];
const PAGES = ['/chapters', '/next', '/practice', '/study', '/models', '/guides', '/check', '/trust', '/read', '/steps', '/unit', '/seva', '/settings', '/profile'];
const seed = (theme) => { try { localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme, mode: 'motus', motion: 'calm' })); } catch { /* no storage on a blank page */ } };

/* every element painted with background-clip: text whose box holds one line: how far its glyphs reach past the box */
const measure = (p) => p.evaluate(async () => {
  await document.fonts.ready;
  const cv = document.createElement('canvas').getContext('2d');
  const out = []; let n = 0;
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    /* a heading whose gradient lives on its words paints nothing of its own */
    if ((cs.webkitBackgroundClip || cs.backgroundClip) !== 'text' || cs.backgroundImage === 'none') continue;
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const b = el.getBoundingClientRect();
    if (!text || b.width === 0 || cs.display === 'none') continue;
    cv.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = cv.measureText(text);
    const L = cs.lineHeight === 'normal' ? m.fontBoundingBoxAscent + m.fontBoundingBoxDescent : parseFloat(cs.lineHeight);
    const A = m.fontBoundingBoxAscent, D = m.fontBoundingBoxDescent;
    const pt = parseFloat(cs.paddingTop), pb = parseFloat(cs.paddingBottom);
    if (Math.round((b.height - pt - pb) / L) !== 1) continue;
    n++;
    const below = m.actualBoundingBoxDescent - ((L - A + D) / 2 + pb);
    const above = m.actualBoundingBoxAscent - ((L + A - D) / 2 + pt);
    if (below > 0.5 || above > 0.5) out.push('"' + text.slice(0, 20) + '" ' + Math.round(parseFloat(cs.fontSize)) + 'px' + (below > 0.5 ? ' ' + below.toFixed(1) + 'px below' : '') + (above > 0.5 ? ' ' + above.toFixed(1) + 'px above' : ''));
  }
  return { n, out };
});
const watch = (p, w, where) => {
  p.on('pageerror', (e) => errors.push(w + ' ' + where + ': ' + String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(w + ' ' + where + ' console: ' + m.text().slice(0, 200)); });
};

const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const theme of ['nocturne', 'meridian']) {
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const phone = w < 600;
    const opts = { viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone };
    let words = 0; const cuts = [];
    /* the front door, as a first visit sees it, in the theme asked for */
    {
      const ctx = await browser.newContext(opts);
      const p = await ctx.newPage(); watch(p, w, '/');
      await p.goto(BASE + '/', { waitUntil: 'networkidle' });
      if (theme !== 'nocturne') await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await p.waitForTimeout(2200);
      const r = await measure(p);
      words += r.n; for (const x of r.out) cuts.push('/ ' + x);
      await ctx.close();
    }
    /* a learner's pages */
    const ctx = await browser.newContext(opts);
    await ctx.addInitScript(seed, theme);
    const p = await ctx.newPage();
    const at = { route: '' };
    watch(p, w, { toString: () => at.route });
    for (const route of PAGES) {
      at.route = route;
      await p.goto('about:blank');
      await p.goto(BASE + '/#' + route, { waitUntil: 'networkidle' });
      await p.waitForTimeout(1600);
      const r = await measure(p);
      words += r.n; for (const x of r.out) cuts.push(route + ' ' + x);
    }
    await ctx.close();
    ok(words > 40 && cuts.length === 0, theme + ' at ' + w + ': ' + words + ' gradient words on the front door and ' + PAGES.length + ' pages, every glyph whole' + (cuts.length ? '; CUT: ' + cuts.slice(0, 6).join(' | ') : ''));
  }
}
ok(errors.length === 0, 'no page error or console error' + (errors.length ? ': ' + [...new Set(errors)].slice(0, 3).join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
