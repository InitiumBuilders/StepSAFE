/* The tab rows of Modux Models and StudyMode, and the words of the model table, walked in a real browser against the
   built site. Added 21 Nov 2026 so the visual rounds of that week cannot slip back:
   - the front tab (Gauges, For you) keeps the whole hero, and every other tab opens on the slim one, so the tab's own
     work starts in the top half of the screen;
   - a tap on a tab while the page is scrolled down to the row keeps the row in view as the hero shrinks above it, and
     under the bar where the bar sits on top (Modux keeps its tab in state; StudyMode's tabs are routes, so its view
     remounts and reads the note the tap left). Chrome's scroll anchoring held the row by itself at 1440 wide, and a
     short page can hold it at its end; either would hide a broken keepInView, so each case also runs with anchoring
     off, and the tap goes to a tab whose page is long at every width;
   - on a phone the chosen tab comes to the middle of its row, on arrival and after a tap, unless the row stops at
     either end;
   - every word of every name in the model table fits its box whole at desktop widths (the measure of
     scripts/look/wordfit.mjs; phones lean on their own hyphenation, which this machine's Chrome does not have).
     node scripts/serve-dist.mjs 5189 &   then   node probe-tabrow-walk.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv.slice(2).find((a) => /^https?:/.test(a)) || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const seed = () => { try { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus', motion: 'calm' })); } catch { /* no storage on a blank page */ } };

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
async function open(w, h, at, wait = '.mx-hero, .sg-hero') {
  const phone = w < 600;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  await ctx.addInitScript(seed);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(w + ': ' + String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(w + ' console: ' + m.text().slice(0, 200)); });
  await p.goto('about:blank');
  await p.goto(BASE + at, { waitUntil: 'networkidle' });
  await p.waitForSelector(wait, { timeout: 20000 });
  await p.waitForTimeout(1200);
  return { ctx, p };
}

const MODUX = { name: 'Modux', at: '/#/models', deep: (k) => '/#/models/' + k, hero: '.mx-hero', slim: 'mx-hero-slim', extra: '.mx-tiles', extraName: 'tiles', row: '.mx > .mx-tabs', tab: '.mx-tab',
  tabs: [['gauges', 'Gauges'], ['systems', 'Systems'], ['models', 'Models'], ['motrus', 'MoTRUS'], ['stacks', 'Stacks'], ['courses', 'Courses'], ['web', 'The Web']] };
const STUDY = { name: 'StudyMode', at: '/#/study', deep: (k) => '/#/study/' + k, hero: '.sg-hero', slim: 'sg-hero-slim', extra: '.sg-unitia em', extraName: 'line under the balance', row: '.sg-tabs', tab: '.sg-tab',
  tabs: [['foryou', 'For you'], ['deck', 'Deck'], ['test', 'Test'], ['atlas', 'Atlas'], ['shelf', 'Shelf'], ['progress', 'Progress']] };
const sel = (k) => ({ hero: k.hero, slim: k.slim, extra: k.extra, row: k.row, tab: k.tab });

/* where the hero, the tab row, the chosen tab and the tab's own work are, and what of the screen is free: below the
   bar where it sits on top, above the phone's tab bar */
const look = (p, k) => p.evaluate((k) => {
  const box = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), r: Math.round(b.right), h: Math.round(b.height), c: Math.round((b.left + b.right) / 2) }; };
  const shows = (e) => !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0;
  const hero = document.querySelector(k.hero), row = document.querySelector(k.row);
  const on = row && row.querySelector(k.tab + '.on');
  const nav = document.querySelector('.nav'), ncs = nav && getComputedStyle(nav);
  const bar = nav && ncs.display !== 'none' && ncs.position === 'sticky' && ncs.flexDirection === 'row' ? Math.round(nav.getBoundingClientRect().bottom) : 0;
  const tb = document.querySelector('.tabbar');
  let next = row && row.nextElementSibling;
  while (next && !shows(next)) next = next.nextElementSibling;
  return {
    slim: !!hero && hero.classList.contains(k.slim), hero: box(hero), row: box(row), next: box(next),
    on: on ? on.textContent.trim() : '', onBox: box(on),
    lede: shows(hero && hero.querySelector('.lede')), extra: shows(hero && hero.querySelector(k.extra)),
    bar, floor: shows(tb) ? Math.round(tb.getBoundingClientRect().top) : innerHeight, y: Math.round(scrollY),
    doc: document.scrollingElement.scrollHeight, vh: innerHeight,
    anchoring: getComputedStyle(document.documentElement).overflowAnchor !== 'none',
    left: row ? Math.round(row.scrollLeft) : 0, max: row ? row.scrollWidth - row.clientWidth : 0,
  };
}, sel(k));
/* a tab chosen as a finger would: the page does not move first (a driver's own tap scrolls its target into view) */
const tap = async (p, k, label) => {
  const found = await p.evaluate(({ row, tab, label }) => { const b = [...document.querySelectorAll(row + ' ' + tab)].find((x) => x.textContent.trim() === label); if (b) b.click(); return !!b; }, { ...sel(k), label });
  await p.waitForTimeout(700);
  return found;
};

/* ---------- the whole hero on the front tab, the slim one on every other ---------- */
for (const k of [MODUX, STUDY]) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { ctx, p } = await open(w, h, k.at);
    const whole = await look(p, k);
    const front = k.tabs[0][1];
    ok(!whole.slim && whole.lede && whole.extra && whole.on === front, k.name + ' at ' + w + ': the front tab (' + front + ') keeps the whole hero, its lede and its ' + k.extraName + ' (hero ' + (whole.hero && whole.hero.h) + 'px, chosen ' + whole.on + ')');
    const seen = [];
    for (const [, label] of k.tabs.slice(1)) {
      const found = await tap(p, k, label);
      seen.push({ label, found, ...(await look(p, k)) });
    }
    ok(seen.every((s) => s.found && s.on === s.label && s.slim && !s.lede && !s.extra), k.name + ' at ' + w + ': every other tab has the slim hero, without the lede or the ' + k.extraName + ' (' + seen.map((s) => s.label + (s.slim && !s.lede && !s.extra ? '' : ' WHOLE') + (s.on === s.label ? '' : ' not chosen')).join(', ') + ')');
    ok(seen.every((s) => s.hero.h <= whole.hero.h * 0.6), k.name + ' at ' + w + ': the slim hero is at most 60% of the whole one (' + whole.hero.h + 'px whole; ' + seen.map((s) => s.label + ' ' + s.hero.h).join(', ') + ')');
    ok(seen.every((s) => s.next && s.y === 0 && s.next.t < (s.bar + s.floor) / 2), k.name + ' at ' + w + 'x' + h + ': on each of them the tab\'s own work starts in the top half of the screen (' + seen.map((s) => s.label + ' ' + (s.next ? s.next.t : 'none')).join(', ') + '; half is ' + Math.round((seen[0].bar + seen[0].floor) / 2) + ')');
    await ctx.close();
  }
  /* an arrival on a tab other than the front one opens on the slim hero too */
  const [key, label] = k.tabs[2];
  const { ctx, p } = await open(1440, 900, k.deep(key));
  const s = await look(p, k);
  ok(s.slim && !s.lede && s.on === label, k.name + ': an address that names ' + label + ' opens it on the slim hero (' + p.url().replace(BASE, '') + ', chosen ' + s.on + ')');
  await ctx.close();
}

/* ---------- a tap from a page scrolled to its tab row keeps the row in view ---------- */
for (const k of [MODUX, STUDY]) {
  /* pages measured on 21 Nov 2026: Models 1685 to 3980px tall, Deck 5072 to 5263; StudyMode's Test was 908 at 1440 */
  const label = k === MODUX ? 'Models' : 'Deck';
  for (const [w, h, where] of [[390, 844, 'a phone'], [900, 1000, 'the bar on top'], [1440, 900, 'the bar at the side']]) {
    for (const anchored of [true, false]) {
      const { ctx, p } = await open(w, h, k.at);
      /* set through the style object, which the security policy allows, where a style tag would be refused */
      if (!anchored) await p.evaluate(() => { document.documentElement.style.overflowAnchor = 'none'; document.body.style.overflowAnchor = 'none'; });
      const a = await look(p, k);
      await p.evaluate((y) => { document.scrollingElement.scrollTop = y; }, a.row.t + a.y - a.bar - 10);
      await p.waitForTimeout(300);
      const b = await look(p, k);
      const placed = Math.abs(b.row.t - (b.bar + 10)) <= 2 && b.anchoring === anchored;
      const found = await tap(p, k, label);
      const c = await look(p, k);
      const shrank = b.hero.h - c.hero.h;
      /* the new tab's page is long enough to keep the scroll where it was, so the page's end cannot be what moved the row */
      const room = c.doc - c.vh >= b.y;
      ok(placed && found && room && c.on === label && shrank > 100 && c.row.t >= c.bar - 1 && c.row.b <= c.floor + 1,
        k.name + ' at ' + w + 'x' + h + ' (' + where + (anchored ? '' : ', anchoring off') + '): with the tab row ' + (b.row.t - b.bar) + 'px under the ' + (b.bar ? 'bar' : 'top of the screen') + ', a tap on ' + label + ' shrinks the hero by ' + shrank + 'px and the row stays in view (row ' + c.row.t + ' to ' + c.row.b + (c.bar ? ', the bar ends at ' + c.bar : '') + ')' + (placed ? '' : '; the page could not be set up') + (room ? '' : '; the page is too short to prove it'));
      await ctx.close();
    }
  }
}

/* ---------- on a phone the chosen tab comes to the middle of its row ---------- */
for (const k of [MODUX, STUDY]) {
  const mid = k === MODUX ? k.tabs[4] : k.tabs[3];
  const { ctx, p } = await open(390, 844, k.deep(mid[0]));
  const s = await look(p, k);
  const off = (x) => x.onBox.c - x.row.c;
  ok(s.max > 0 && s.slim && s.on === mid[1] && Math.abs(off(s)) <= 2, k.name + ' on a phone: the row scrolls (' + s.max + 'px), and arriving on ' + mid[1] + ' the tab sits in the middle of it (' + off(s) + 'px off)');
  const seen = [];
  for (const [, label] of k.tabs) {
    await tap(p, k, label);
    seen.push({ label, ...(await look(p, k)) });
  }
  const placed = (x) => x.on === x.label && x.onBox.l >= x.row.l - 1 && x.onBox.r <= x.row.r + 1 &&
    (Math.abs(off(x)) <= 2 || (x.left === 0 && off(x) < 0) || (x.left >= x.max - 1 && off(x) > 0));
  ok(seen.every(placed), k.name + ' on a phone: each tab tapped comes to the middle of the row, or the row stops at its end with the tab in view (' + seen.map((x) => x.label + ' ' + (Math.abs(off(x)) <= 2 ? 'middle' : x.left === 0 ? 'start' : x.left >= x.max - 1 ? 'end' : off(x) + 'px off') + (placed(x) ? '' : ' WRONG')).join(', ') + ')');
  await ctx.close();
}

/* ---------- every word of the model table whole at desktop widths ---------- */
for (const w of [761, 1000, 1024, 1180, 1280, 1366, 1436, 1440, 1536, 1920]) {
  const { ctx, p } = await open(w, 900, '/#/models/models', '.mt-cell');
  const r = await p.evaluate(async () => {
    await document.fonts.ready;
    const cv = document.createElement('canvas').getContext('2d');
    const out = [];
    for (const n of document.querySelectorAll('.mt-cell-n, .mt-head-n')) {
      const cs = getComputedStyle(n);
      cv.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const room = n.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      for (const word of n.textContent.split(/\s+/)) {
        const ww = cv.measureText(word).width;
        if (ww > room + 0.5) out.push(word + ' ' + Math.round(ww) + '>' + Math.round(room));
      }
    }
    return { n: document.querySelectorAll('.mt-cell-n').length, cols: getComputedStyle(document.querySelector('.mt-grid')).gridTemplateColumns.split(' ').length, col: Math.round(document.querySelector('.mt-col').getBoundingClientRect().width), broken: [...new Set(out)], sideways: document.documentElement.scrollWidth > innerWidth };
  });
  ok(r.n === 96 && r.broken.length === 0 && !r.sideways, 'the model table at ' + w + ': ' + r.cols + ' across, columns ' + r.col + 'px, ' + (r.broken.length ? 'BROKEN ' + r.broken.join(', ') : 'every word of the ' + r.n + ' names and the family names whole') + (r.sideways ? ', and the page runs sideways' : ''));
  await ctx.close();
}

ok(errors.length === 0, 'no page error or console error' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
