/* The glossary, the guides and the StudyMode deck, walked in a real browser against the built site under its real
   headers. The terms reach the learner in eleven subjects, with no chip per domain; every row in the list
   is the same height; a chosen term opens beside the list, by click and by arrow key; a search ranks names
   first; the letters jump; the term's related terms, the Steps that teach it and its card all go where they say;
   a link from Find opens the glossary on its term. Every term link is true: a Step lists the entries it names and
   uses, a word with no entry opens that word's own page with the corpus's sentences as proof, and no term stands
   in for another ("tier zero" is not Zero Trust). An entry answers to its other names, shows its source, and the
   seven merged entries appear once. On a phone the list opens into the term and Back returns to the same place. The guides are grouped by the same subjects;
   the deck filters by subject, with its domains grouped under each; the systems map keeps every label inside its
   box. Then the contrast of the glossary's ink and of Find's labels in all three themes, the Content-Security-Policy
   and the console.
     node scripts/serve-dist.mjs 5189 &   then   node probe-glossary-walk.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
/* on a phone Find lives in the sheet that More opens */
const openFind = async (p) => { if (!(await p.locator('.nav-find').first().isVisible())) { await p.locator('.tab-more').tap(); await p.waitForTimeout(450); } await p.locator('.nav-find').first().tap(); };
const errors = [], csp = [];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function context(opts = {}, seed = {}) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  await c.addInitScript(([seed]) => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', ...seed }));
  }, [seed]);
  return c;
}
async function newPage(c, tag) {
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(tag + ': ' + String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(tag + ': ' + m.text().slice(0, 200)); });
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1600);
  return p;
}
const collect = async (p, tag) => (await p.evaluate(() => window.__csp.splice(0))).forEach((v) => csp.push(tag + ': ' + v));
const nav = async (p, label) => { await p.evaluate((l) => [...document.querySelectorAll('.nav button')].find((x) => x.textContent.trim().startsWith(l))?.click(), label); await p.waitForTimeout(1300); };
const toGlossary = async (p) => { await nav(p, 'StepGuides'); await p.locator('.gs-tab', { hasText: 'Glossary' }).click(); await p.waitForSelector('.gl-row', { timeout: 10000 }); await p.waitForTimeout(300); };
const termName = (p) => p.evaluate(() => document.querySelector('#gl-term')?.textContent || '');
const rowNames = (p) => p.evaluate(() => [...document.querySelectorAll('.gl-row strong')].map((x) => x.textContent));
const heights = (p) => p.evaluate(() => [...new Set([...document.querySelectorAll('.gl-row')].map((r) => Math.round(r.getBoundingClientRect().height)))]);

async function contrastOf(p, sels) {
  return p.evaluate((sels) => {
    const rgb = (s) => { const n = (s.match(/[\d.]+/g) || []).map(Number); if (/^color\(srgb/.test(s)) return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1]; return n; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const ground = (el) => { let base = rgb(getComputedStyle(document.documentElement).getPropertyValue('--ground').trim().replace(/^#(..)(..)(..)$/, (m, r, g, b) => parseInt(r, 16) + ',' + parseInt(g, 16) + ',' + parseInt(b, 16))); if (base.length < 3) base = [5, 10, 30]; const stack = []; for (let n = el; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c.length >= 3 && (c[3] ?? 1) > 0) stack.push(c); } for (const c of stack.reverse()) { const a = c[3] ?? 1; base = base.map((v, i) => v * (1 - a) + c[i] * a); } return base; };
    return sels.map((sel) => {
      const el = document.querySelector(sel); if (!el) return [sel, 0];
      const fg = rgb(getComputedStyle(el).color), bg = ground(el);
      const a = lum(fg), b = lum(bg);
      return [sel, +(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(1))];
    });
  }, sels);
}
/* Find's ink, read through a canvas so a colour in any space (a color-mix, oklab) is measured as the screen shows it */
async function paletteInk(p) {
  return p.evaluate(() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
    const rgb = (s) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = 'rgba(0,0,0,0)'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const hex = getComputedStyle(document.documentElement).getPropertyValue('--ground').trim();
    const g0 = /^#[0-9a-f]{6}$/i.test(hex) ? [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) : [5, 10, 30];
    const ground = (el) => { let b = g0; const stack = []; for (let n = el; n; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c[3] > 0) stack.push(c); } for (const c of stack.reverse()) b = b.map((v, i) => v * (1 - c[3]) + c[i] * c[3]); return b; };
    const ratio = (el) => { const a = lum(rgb(getComputedStyle(el).color)), b = lum(ground(el)); return +(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(1)); };
    return [...document.querySelectorAll('.pal-row')].flatMap((row) => [['.pal-kind ' + row.querySelector('.pal-kind').textContent.trim(), ratio(row.querySelector('.pal-kind'))], ['.pal-text em', ratio(row.querySelector('.pal-text em'))]]);
  });
}
const LIST_INK = ['.gl-row strong', '.gl-row span', '.gl-letter', '.gl-subject', '.gl-subject b', '.gl-letters button', '.gs-tab', '.gl-search input'];
const TERM_INK = ['#gl-term', '.gl-where-subject', '.gl-where-domain', '.gl-short', '.gl-long', '.gl-why .label', '.gl-why p', '.gl-sec > .label', '.gl-chip', '.gl-taught strong', '.gl-taught em'];
const MORE_INK = ['.gl-aka', '.gl-sources a', '.gl-sources li span'];
const WORD_INK = ['.gl-noentry #gl-term', '.gl-noentry .gl-where-domain', '.gl-noentry .gl-long', '.gl-says strong', '.gl-says q', '.gl-mark'];
const STEP_INK = ['.sw .label', '.sw-term', '.sw-bare', '.sw-bare .term-link'];

/* ---------- 1. the glossary on a wide screen ---------- */
console.log('-- the glossary, wide');
{
  /* a Motus learner, so the Steps written for Motus open */
  const c = await context({}, { mode: 'motus' });
  const p = await newPage(c, 'wide');
  await toGlossary(p);
  const subjects = await p.evaluate(() => [...document.querySelectorAll('.gl-subject')].map((b) => ({ t: b.textContent.trim(), n: Number(b.querySelector('b')?.textContent || 0), on: b.classList.contains('on') })));
  ok(subjects.length === 12, 'twelve choices above the terms: every subject and the eleven subjects (' + subjects.length + ')');
  ok((await p.locator('.gl .chip').count()) === 0, 'no domain chip wall: the 77 domains no longer render as chips');
  ok(subjects[0].on && subjects[0].n === subjects.slice(1).reduce((a, x) => a + x.n, 0), 'the subjects hold every term once: ' + subjects.slice(1).map((x) => x.n).join(' + ') + ' = ' + subjects[0].n);
  const total = (await rowNames(p)).length;
  ok(total === subjects[0].n, 'the list shows every term, A to Z: ' + total);
  const hs = await heights(p);
  ok(hs.length === 1, 'every row in the list is the same height: ' + hs.join(', ') + 'px');
  const first = (await rowNames(p))[0];
  ok((await termName(p)) === first, 'the first term is open beside the list: ' + first);
  const grid = await p.evaluate(() => { const l = document.querySelector('.gl-list').getBoundingClientRect(), d = document.querySelector('.gl-detail').getBoundingClientRect(); return { lw: Math.round(l.width), dl: Math.round(d.left), lr: Math.round(l.right) }; });
  ok(grid.dl > grid.lr && grid.lw < 420, 'the list and the open term stand side by side: list ' + grid.lw + 'px, term from ' + grid.dl + 'px');

  /* choose a term, then move by key */
  const names = await rowNames(p);
  await p.locator('.gl-row').nth(6).click(); await p.waitForTimeout(350);
  ok((await termName(p)) === names[6], 'a click opens that term: ' + names[6]);
  ok(await p.evaluate(() => document.querySelector('.gl-row.on')?.getAttribute('aria-current') === 'true'), 'the open term is marked in the list');
  ok(await p.evaluate(() => document.querySelectorAll('.gl-row[tabindex="0"]').length === 1 && document.querySelector('.gl-row[tabindex="0"]').classList.contains('on')), 'the list is one tab stop, on the open term; Tab moves on to the term itself');
  await p.locator('.gl-row').nth(6).focus();
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(350);
  ok((await termName(p)) === names[7], 'ArrowDown opens the next term: ' + names[7]);
  ok(await p.evaluate(() => document.activeElement?.classList.contains('gl-row') && document.activeElement.classList.contains('on')), 'the focus moves with it');
  await p.keyboard.press('ArrowUp'); await p.waitForTimeout(300);
  ok((await termName(p)) === names[6], 'ArrowUp goes back');
  await p.locator('.gl-step .btn', { hasText: 'Next' }).click(); await p.waitForTimeout(300);
  ok((await termName(p)) === names[7], 'Next in the term opens the one after it');

  /* the parts of a term */
  const parts = await p.evaluate(() => ({ why: !!document.querySelector('.gl-why p')?.textContent, where: document.querySelector('.gl-where')?.textContent || '', study: !!document.querySelector('.gl-actions .btn-key') }));
  ok(parts.why && parts.where.length > 3 && parts.study, 'the term shows its subject, why it matters and its card: ' + parts.where);

  /* the letters */
  ok((await p.locator('.gl-letters button').count()) >= 20, 'the letters stand above the list');
  await p.locator('.gl-letters button', { hasText: /^M$/ }).click(); await p.waitForTimeout(500);
  const jump = await p.evaluate(() => { const h = document.getElementById('gl-letter-M').getBoundingClientRect(), s = document.querySelector('.gl-letters').getBoundingClientRect(); return { h: Math.round(h.top), s: Math.round(s.bottom), stop: Math.round(s.top) }; });
  ok(Math.abs(jump.h - jump.s) <= 8, 'M jumps to the M terms, just under the letters: ' + jump.h + ' vs ' + jump.s);
  ok(jump.stop === 0, 'the letters stay at the top while the list scrolls');
  const held = await p.evaluate(() => { const d = document.querySelector('.gl-detail').getBoundingClientRect(), a = document.querySelector('.gl-actions').getBoundingClientRect(); return { top: Math.round(d.top), bottom: Math.round(a.bottom), vh: innerHeight }; });
  ok(held.top > 0 && held.top < 120 && held.bottom <= held.vh, 'the open term stays in view as the list scrolls, its card and the way on in reach: top ' + held.top + ', foot ' + held.bottom + ' of ' + held.vh);

  /* a subject */
  await p.locator('.gl-subject', { hasText: 'Keys' }).click(); await p.waitForTimeout(400);
  const keysN = await p.evaluate(() => Number([...document.querySelectorAll('.gl-subject')].find((b) => b.textContent.includes('Keys'))?.querySelector('b')?.textContent));
  ok((await rowNames(p)).length === keysN, 'a subject lists only its own terms: ' + keysN);
  ok(/Keys and custody/.test(await p.locator('.gl-caption').innerText()), 'the subject says what it holds');
  ok(/Keys and custody/.test(await p.locator('.gl-where').innerText()), 'the open term is from the subject');

  /* a search ranks names first */
  await p.locator('.gl-subject', { hasText: 'Every subject' }).click();
  await p.fill('.gl-search input', 'key'); await p.waitForTimeout(450);
  const found = await rowNames(p);
  const firstBody = found.findIndex((n) => !n.toLowerCase().includes('key'));
  ok(found.length > 3 && firstBody > 0 && found.slice(firstBody).every((n) => !n.toLowerCase().includes('key')), 'a search lists the names that hold it first: ' + found.slice(0, 3).join(', ') + ' … ' + found.length);
  ok((await p.locator('.gl-letters').count()) === 0 && (await p.locator('.gl-letter').count()) === 0, 'a search shows one ranked list, without letters');
  await p.fill('.gl-search input', 'qqqzzz'); await p.waitForTimeout(350);
  ok((await p.locator('.gl-empty').count()) === 1, 'a search that finds nothing says so and offers every term');
  await p.locator('.gl-empty .btn').click(); await p.waitForTimeout(350);
  ok((await rowNames(p)).length === total, 'and the button brings every term back');

  /* related terms stay in the glossary */
  await p.fill('.gl-search input', 'certificate transparency'); await p.waitForTimeout(400);
  ok((await rowNames(p))[0] === 'Certificate Transparency' && (await termName(p)) === 'Certificate Transparency', 'search finds Certificate Transparency first and opens it');
  const rel = await p.locator('.gl-sec .gl-chip').first().innerText();
  await p.locator('.gl-sec .gl-chip').first().click(); await p.waitForTimeout(400);
  ok((await termName(p)) === rel, 'a related term opens in place: ' + rel);
  ok((await rowNames(p)).includes(rel) && await p.evaluate(() => { const r = document.querySelector('.gl-row.on')?.getBoundingClientRect(); return !!r && r.top >= 0 && r.bottom <= innerHeight; }), 'and its row is in the list, in view');

  /* the Steps that teach it */
  await p.fill('.gl-search input', 'stock and flow'); await p.waitForTimeout(400);
  await p.locator('.gl-row', { hasText: 'Stock and Flow' }).first().click(); await p.waitForTimeout(300);
  const taught = await p.locator('.gl-taught button strong').allInnerTexts();
  ok(taught.length > 0, 'Stock and Flow lists the Steps that teach it: ' + taught.length);
  await p.locator('.gl-taught button', { hasText: 'Stocks, Flows' }).first().click(); await p.waitForTimeout(1400);
  const stepHead = await p.evaluate(() => document.querySelector('h1[aria-label], h2[aria-label]')?.getAttribute('aria-label') || '');
  ok(/Stocks, Flows/.test(stepHead), 'a Step it is taught in opens: ' + stepHead);
  /* the Step's own words: entries open in place; a word with no entry is plain, or opens that word's page */
  const words = await p.evaluate(() => ({
    terms: [...document.querySelectorAll('.sw-term')].map((x) => x.textContent.trim()),
    links: [...document.querySelectorAll('.sw-bare .term-link')].map((x) => x.textContent.trim()),
    plain: [...document.querySelectorAll('.sw-bare > span:not([aria-hidden])')].map((x) => x.textContent.trim()),
    chips: document.querySelectorAll('.sw .chip, .band .chiprow .chip:not(.on)').length,
  }));
  ok(words.terms[0] === 'Stock and Flow' && words.terms.length >= 2, 'the Step lists its glossary entries, the one it names first: ' + words.terms.join(', '));
  ok(words.links.includes('inflow rate') && words.plain.includes('outflow rate'), 'a word with no entry is a link only when the corpus says something about it: links ' + words.links.join(', ') + ' | plain ' + words.plain.join(', '));
  ok(words.chips === 0, 'the old row of chips that all went to the glossary is gone');
  await p.locator('.sw-term', { hasText: 'Stock and Flow' }).click(); await p.waitForTimeout(400);
  const pop = await p.evaluate(() => ({ name: document.querySelector('.sw .term-pop strong')?.textContent || '', where: document.querySelector('.sw .term-pop-where')?.textContent || '', buttons: [...document.querySelectorAll('.sw .term-pop button')].map((x) => x.textContent) }));
  ok(pop.name === 'Stock and Flow' && /Systems/.test(pop.where) && pop.buttons.includes('Study its card'), 'a term opens its definition in place, with its subject and its card: ' + pop.where);
  ok(/Stocks, Flows/.test(await p.evaluate(() => document.querySelector('h1[aria-label], h2[aria-label]')?.getAttribute('aria-label') || '')), 'and the learner is still on the Step');
  await p.locator('.sw-bare .term-link', { hasText: 'inflow rate' }).click(); await p.waitForTimeout(1300);
  const word = await p.evaluate(() => ({
    title: document.querySelector('#gl-term')?.textContent || '', where: document.querySelector('.gl-noentry .gl-where')?.textContent || '',
    covered: [...document.querySelectorAll('[data-said="covered"] strong')].map((x) => x.textContent), marks: [...document.querySelectorAll('.gl-noentry mark')].map((x) => x.textContent.toLowerCase()),
    uses: document.querySelectorAll('[data-said="uses"] li').length, on: document.querySelectorAll('.gl-row.on').length,
  }));
  ok(word.title === 'inflow rate' && /No entry/.test(word.where), 'a word with no entry opens its own page and says so: ' + word.title + ' · ' + word.where);
  ok(word.on === 0, 'no term in the list stands in for it');
  ok(word.covered.includes('Stock and Flow') && word.uses > 0 && word.marks.length > 0 && word.marks.every((m) => m.startsWith('inflow rate')), 'the page shows the entry that explains it and where it is used, each sentence with the phrase marked: ' + word.covered.join(', ') + ' | ' + word.uses + ' uses');
  await p.locator('[data-said="covered"] button', { hasText: 'Stock and Flow' }).click(); await p.waitForTimeout(500);
  ok((await termName(p)) === 'Stock and Flow' && (await p.locator('.gl-noentry').count()) === 0, 'the entry that explains it opens from there');

  /* the links that used to open the wrong entry */
  const openStep = async (title) => { await p.keyboard.press('Control+k'); await p.waitForTimeout(600); await p.fill('.pal input', title); await p.waitForTimeout(500); await p.locator('.pal-main', { hasText: title }).first().click(); await p.waitForTimeout(1500); };
  await openStep('Ground Truth: Finding Out What Is Actually There');
  const tz = await p.evaluate(() => ({ terms: [...document.querySelectorAll('.sw-term')].map((x) => x.textContent.trim()), link: [...document.querySelectorAll('.sw-bare .term-link')].some((x) => x.textContent.trim() === 'tier zero'), plain: [...document.querySelectorAll('.sw-bare > span:not([aria-hidden])')].some((x) => x.textContent.trim() === 'tier zero') }));
  ok((tz.link || tz.plain) && tz.terms.includes('Phishing-Resistant MFA'), 'that Step names tier zero as a word with no entry, and reaches Phishing-Resistant MFA by its other name');
  if (tz.link) {
    await p.locator('.sw-bare .term-link', { hasText: /^tier zero$/ }).click(); await p.waitForTimeout(1300);
    const z = await p.evaluate(() => ({ title: document.querySelector('#gl-term')?.textContent || '', near: [...document.querySelectorAll('[data-said="closest"] .gl-chip')].map((x) => x.textContent) }));
    ok(z.title === 'tier zero' && !z.near.includes('Zero Trust'), '"tier zero" opens its own page, and Zero Trust is not offered as it: ' + z.title);
  } else ok(tz.plain, '"tier zero" is plain text there: the corpus says nothing more about it, and it is not Zero Trust');
  await openStep('Drill: The 9.8');
  const sca = await p.evaluate(() => [...document.querySelectorAll('.sw-term')].map((x) => x.textContent.trim()));
  ok(sca.includes('SCA') && sca.includes('KEV Catalog') && !sca.includes('Business Impact Analysis'), 'software composition analysis reaches SCA, and nothing reaches Business Impact Analysis by accident: ' + sca.join(', '));

  /* an entry answers to its other names, shows where its fact was read, and lists where it lives */
  await nav(p, 'StepGuides'); await p.locator('.gs-tab', { hasText: 'Glossary' }).click(); await p.waitForSelector('.gl-row', { timeout: 10000 });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.fill('.gl-search input', 'two-person rule'); await p.waitForTimeout(450);
  ok((await rowNames(p))[0] === 'Dual Control', 'a search by another name finds the entry: two-person rule finds ' + (await rowNames(p))[0]);
  await p.locator('.gl-row').first().click(); await p.waitForTimeout(1100);
  const dc = await p.evaluate(() => ({
    aka: document.querySelector('.gl-aka')?.textContent || '', src: [...document.querySelectorAll('.gl-sources a')].map((a) => a.href + ' ' + a.rel + ' ' + a.target), read: document.querySelector('.gl-sources li span')?.textContent || '',
    taught: document.querySelectorAll('[data-places="taught"] li').length, foot: Math.round(document.querySelector('.gl-actions').getBoundingClientRect().bottom), vh: innerHeight,
  }));
  ok(/Two-Person Rule/.test(dc.aka), 'the entry shows its other names: ' + dc.aka);
  ok(dc.src.length === 1 && /^https:\/\/csrc\.nist\.gov\/.* noopener noreferrer _blank$/.test(dc.src[0]) && /^read \d{4}-\d{2}-\d{2}$/.test(dc.read), 'and the source its fact was read at, with the day: ' + dc.read);
  ok(dc.taught >= 5, 'and the Steps that teach it: ' + dc.taught + ' shown');
  ok(dc.foot <= dc.vh, 'opening a term from the top of the page brings its card and the way on into view: foot ' + dc.foot + ' of ' + dc.vh);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.fill('.gl-search input', 'threat model'); await p.waitForTimeout(450);
  await p.locator('.gl-row', { hasText: /^Threat Model/ }).first().click(); await p.waitForTimeout(900);
  const used = await p.evaluate(() => ({ n: document.querySelectorAll('[data-places="used"] li').length, more: document.querySelector('[data-places="used"] .gl-more')?.textContent || '', label: document.querySelector('[data-places="used"] .label')?.textContent || '' }));
  ok(used.n === 5 && /Show the other \d+/.test(used.more), 'a term lists the Steps and guides that use it, five at first: ' + used.label + ' · ' + used.more);
  await p.locator('[data-places="used"] .gl-more').click(); await p.waitForTimeout(300);
  ok((await p.locator('[data-places="used"] li').count()) > 5, 'and the rest on request');
  await p.fill('.gl-search input', 'slither'); await p.waitForTimeout(450);
  await p.locator('.gl-row', { hasText: /^Slither/ }).first().click(); await p.waitForTimeout(600);
  const kin = await p.locator('[data-related] .gl-chip').allInnerTexts();
  ok(kin.length > 0 && !kin.includes('Business Impact Analysis') && !kin.includes('3-2-1-1-0 Backup Rule'), 'related terms are entries the term names, with no stand-ins: ' + kin.join(', '));
  await p.fill('.gl-search input', 'hardware security module'); await p.waitForTimeout(450);
  const hsm = await rowNames(p);
  ok(hsm[0] === 'HSM' && !hsm.includes('Hardware Security Module'), 'a merged entry appears once, under the kept name, and still answers to the other: ' + hsm[0]);
  await p.fill('.gl-search input', 'blameless'); await p.waitForTimeout(450);
  ok((await rowNames(p)).filter((n) => /^Blameless/.test(n)).length === 1, 'one Blameless Postmortem, where there were two');

  /* the card */
  await p.fill('.gl-search input', 'certificate transparency'); await p.waitForTimeout(400);
  await p.locator('.gl-actions .btn-key').click(); await p.waitForTimeout(1500);
  ok(/Certificate Transparency/.test(await p.evaluate(() => document.querySelector('.sg-card h2, h2')?.textContent || '')), 'Study its card opens the term\'s StudyMode card');

  /* a link from Find opens the glossary on its term */
  await p.keyboard.press('Control+k'); await p.waitForTimeout(700);
  await p.fill('.pal input', 'Envelope Encryption'); await p.waitForTimeout(500);
  await p.locator('.pal-main', { hasText: 'Envelope Encryption' }).first().click(); await p.waitForTimeout(1500);
  ok((await termName(p)) === 'Envelope Encryption', 'Find opens the glossary on its term: ' + (await termName(p)));
  ok(await p.evaluate(() => { const r = document.querySelector('.gl-row.on')?.getBoundingClientRect(); return !!r && r.top >= 0 && r.bottom <= innerHeight; }), 'with its row brought into view in the list');
  await collect(p, 'wide');
  await c.close();
}

/* ---------- 2. a phone ---------- */
console.log('-- the glossary, phone');
{
  const c = await context({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await newPage(c, 'phone');
  await toGlossary(p);
  const side = await p.evaluate(() => ({ page: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth, row: getComputedStyle(document.querySelector('.gl-subjects')).display, pick: (() => { const s = document.querySelector('.phone-select select'); return s ? { h: Math.round(s.getBoundingClientRect().height), n: s.options.length, first: s.options[0].textContent } : null; })() }));
  ok(side.page <= side.vw, 'no sideways scroll at 390: ' + side.page + '/' + side.vw);
  ok(side.row === 'none' && !!side.pick && side.pick.h >= 44 && side.pick.n >= 6 && /^Every subject/.test(side.pick.first), 'on a phone the subjects are one picker, not a row to scroll: ' + JSON.stringify(side.pick));
  const allRows = await p.locator('.gl-row').count();
  await p.selectOption('.phone-select select', 'keys'); await p.waitForTimeout(450);
  const keyRows = await p.locator('.gl-row').count();
  ok(keyRows > 0 && keyRows < allRows, 'choosing a subject in the picker narrows the list: ' + allRows + ' to ' + keyRows);
  await p.selectOption('.phone-select select', 'all'); await p.waitForTimeout(450);
  ok((await p.locator('.gl-row').count()) === allRows, 'and Every subject brings them all back');
  const hs = await heights(p);
  ok(hs.length === 1, 'every row is the same height on a phone: ' + hs.join(', ') + 'px');
  ok((await p.locator('.gl-detail').count()) === 0, 'a phone shows the list first, no term beside it');
  await p.evaluate(() => window.scrollTo(0, 2400)); await p.waitForTimeout(400);
  const y = await p.evaluate(() => window.scrollY);
  const pickName = await p.evaluate(() => { const rows = [...document.querySelectorAll('.gl-row')]; const r = rows.find((x) => x.getBoundingClientRect().top > 200); return r.querySelector('strong').textContent; });
  await p.locator('.gl-row', { hasText: pickName }).first().tap(); await p.waitForTimeout(700);
  const reading = await p.evaluate(() => ({ list: document.querySelectorAll('.gl-row').length, back: !!document.querySelector('.gl-back'), top: Math.round(document.querySelector('.gl-detail').getBoundingClientRect().top), nav: Math.round(document.querySelector('.nav').getBoundingClientRect().height), foot: Math.round(document.querySelector('.gl-actions').getBoundingClientRect().bottom), vh: innerHeight }));
  ok((await termName(p)) === pickName && reading.list === 0 && reading.back, 'a tap opens the term on its own screen, with Back: ' + pickName);
  ok(reading.top >= reading.nav - 1 && reading.top < reading.nav + 40, 'the term starts just under the bar: ' + reading.top + ' (bar ' + reading.nav + ')');
  ok(reading.foot <= reading.vh, 'the card and the way on stay at the foot of the screen: ' + reading.foot + ' of ' + reading.vh);
  const targets = await p.evaluate(() => [...document.querySelectorAll('.gl-back, .gl-actions .btn')].map((b) => Math.round(b.getBoundingClientRect().height)));
  ok(targets.every((h) => h >= 44), 'every control on the term is a full finger tall: ' + targets.join(', '));
  await p.locator('.gl-back').tap(); await p.waitForTimeout(600);
  const backAt = await p.evaluate(() => ({ y: Math.round(window.scrollY), focus: document.activeElement?.querySelector?.('strong')?.textContent || '' }));
  ok(Math.abs(backAt.y - y) <= 2 && backAt.focus === pickName, 'Back returns to the same place in the list, on the same term: ' + backAt.y + ' vs ' + y);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('.view-head')).display !== 'none'), 'and the page heading is back with the list');
  const lt = await p.evaluate(() => [...document.querySelectorAll('.gl-letters button, .gs-tab')].map((b) => Math.round(b.getBoundingClientRect().height)));
  ok(lt.every((h) => h >= 44), 'the letters and the switch are a full finger tall');

  /* a Step's words on a phone: a term opens in place, and a word with no entry opens its page under the bar */
  await p.keyboard.press('Control+k'); await p.waitForTimeout(700);
  await p.fill('.pal input', 'Stocks, Flows'); await p.waitForTimeout(500);
  await p.locator('.pal-main', { hasText: 'Stocks, Flows' }).first().tap(); await p.waitForTimeout(1500);
  await p.locator('.sw').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  const sw = await p.evaluate(() => ({ wide: document.documentElement.scrollWidth <= document.documentElement.clientWidth, taps: [...document.querySelectorAll('.sw-term')].map((b) => Math.round(b.getBoundingClientRect().height)), link: (() => { const l = document.querySelector('.sw-bare .term-link'); const r = l.getBoundingClientRect(); const cs = getComputedStyle(l); return { h: Math.round(r.height), line: cs.textDecorationLine, border: cs.borderBottomWidth }; })() }));
  ok(sw.wide && sw.taps.length >= 2 && sw.taps.every((h) => h >= 44), 'the Step\'s terms fit a phone and are a full finger tall: ' + sw.taps.join(', '));
  ok(sw.link.line.includes('underline') && sw.link.border === '0px', 'a linked word keeps its underline with the word');
  await p.locator('.sw-term').first().tap(); await p.waitForTimeout(400);
  ok((await p.locator('.sw .term-pop').count()) === 1 && (await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)), 'a term opens in place on a phone, with no sideways scroll');
  await p.locator('.sw-bare .term-link', { hasText: 'inflow rate' }).tap(); await p.waitForTimeout(1400);
  const wp = await p.evaluate(() => ({ title: document.querySelector('#gl-term')?.textContent || '', top: Math.round(document.querySelector('.gl-noentry')?.getBoundingClientRect().top ?? -1), nav: Math.round(document.querySelector('.nav').getBoundingClientRect().height), back: !!document.querySelector('.gl-back'), rows: document.querySelectorAll('.gl-row').length, head: getComputedStyle(document.querySelector('.view-head')).display, foot: Math.round(document.querySelector('.gl-noentry')?.getBoundingClientRect().bottom ?? 9999), vh: innerHeight }));
  ok(wp.title === 'inflow rate' && wp.back && wp.rows === 0, 'a word with no entry opens on its own screen: ' + wp.title);
  ok(wp.head === 'none' && wp.top >= wp.nav - 1 && wp.top < wp.nav + 70, 'the page heading steps aside and the word starts at the top of the screen: ' + wp.top + ' (bar ' + wp.nav + ')');
  await p.locator('[data-said="covered"] button').first().tap(); await p.waitForTimeout(900);
  const tp = await p.evaluate(() => ({ title: document.querySelector('#gl-term')?.textContent || '', top: Math.round(document.querySelector('.gl-detail').getBoundingClientRect().top), nav: Math.round(document.querySelector('.nav').getBoundingClientRect().height) }));
  ok(tp.title === 'Stock and Flow' && tp.top >= tp.nav - 1 && tp.top < tp.nav + 40, 'the entry that explains it opens under the bar too: ' + tp.title + ' at ' + tp.top);

  /* Find on a phone: the palette fills the screen, so its way out is a button; the key hints step aside; its count is the deck's */
  await openFind(p); await p.waitForSelector('.pal input'); await p.fill('.pal input', 'cisa kev'); await p.waitForTimeout(700);
  const pal = await p.evaluate(() => {
    const close = document.querySelector('.pal-close'), b = close.getBoundingClientRect(), card = document.querySelector('.pal-card')?.getBoundingClientRect();
    return { close: [Math.round(b.width), Math.round(b.height)], word: close.innerText.trim(), hints: [...document.querySelectorAll('.pal-hint')].filter((h) => h.getBoundingClientRect().width > 0).length, card: card ? Math.round(card.height) : 0, count: document.querySelector('.pal-foot span:last-child').textContent.trim(), hit: (document.querySelector('.pal-row strong')?.textContent || '') + ' · ' + (document.querySelector('.pal-row em')?.textContent || '') };
  });
  ok(pal.hit === 'KEV Catalog · Also called CISA KEV', 'Find reaches an entry by another name on a phone: ' + pal.hit);
  ok(pal.close[0] >= 44 && pal.close[1] >= 44 && pal.word === 'Close' && pal.hints === 0 && pal.card >= 44, 'Find on a phone has a Close a finger can hit, no key hints, and Card a full finger tall: Close ' + pal.close.join(' by ') + ', Card ' + pal.card);
  await p.locator('.pal-close').tap(); await p.waitForTimeout(400);
  ok((await p.locator('.pal').count()) === 0, 'Close closes Find');
  await nav(p, 'StudyMode');
  const deckSays = await p.evaluate(() => ((document.querySelector('.sg-hero')?.textContent || '').match(/([\d,]+) cards/) || [])[1] || '');
  ok(!!deckSays && pal.count === deckSays + ' cards', 'Find counts the same cards StudyMode does: ' + pal.count + ' vs ' + deckSays);
  await collect(p, 'phone');
  await c.close();
}

/* ---------- 3. the guides, by the same subjects ---------- */
console.log('-- the guides');
{
  const c = await context();
  const p = await newPage(c, 'guides');
  await nav(p, 'StepGuides');
  const g = await p.evaluate(() => ({
    sections: [...document.querySelectorAll('.gs-subject')].map((s) => ({ n: s.querySelectorAll('.gs-guide').length, says: s.querySelector('.gs-n')?.textContent || '' })),
    guides: document.querySelectorAll('.gs-guide').length,
    chips: document.querySelectorAll('.gl-subject').length,
    graph: (() => { const b = [...document.querySelectorAll('.gl-subject')].find((x) => x.textContent.includes('Trust graphs')); return b ? b.disabled : null; })(),
  }));
  ok(g.guides === 60, 'all 60 guides, grouped by subject: ' + g.sections.length + ' subjects');
  ok(g.sections.every((s) => (s.n === 1 ? /One guide/ : new RegExp('^' + s.n + ' guides')).test(s.says)), 'each subject says how many guides it holds');
  ok(g.chips === 12 && g.graph === true, 'the same twelve choices as the glossary; a subject with no guide is there, and off');
  await p.locator('.gl-subject', { hasText: 'Detection' }).click(); await p.waitForTimeout(300);
  ok((await p.locator('.gs-subject').count()) === 1, 'a subject shows only its own guides');
  await p.locator('.gs-guide').first().click(); await p.waitForTimeout(800);
  ok((await p.locator('.blk, .band .statement').count()) > 0, 'a guide opens');
  await collect(p, 'guides');
  await c.close();
}

/* ---------- 4. the deck by subject, and the map ---------- */
console.log('-- the deck and the map');
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844, isMobile: true, hasTouch: true }]) {
  const { width, height, ...rest } = vp;
  const c = await context({ viewport: { width, height }, ...rest });
  const p = await newPage(c, 'deck-' + width);
  await nav(p, 'StudyMode');
  await p.locator('.sg-tab', { hasText: 'Deck' }).click(); await p.waitForTimeout(900);
  if (width > 600) {
    const sel = await p.evaluate(() => { const [st, sh, dm] = [...document.querySelectorAll('.sg-selects select')]; return { subject: sh.options.length, groups: dm.querySelectorAll('optgroup').length, first: dm.querySelector('optgroup')?.label }; });
    ok(sel.subject === 12 && sel.groups === 11, 'the deck has a Subject filter, and its domains sit under the eleven subjects: ' + sel.subject + ' choices, ' + sel.groups + ' groups');
    const before = await p.locator('.sg-now.compact .sec').innerText();
    const opt = await p.evaluate(() => { const dm = [...document.querySelectorAll('.sg-selects select')][2]; const og = [...dm.querySelectorAll('optgroup')].find((g) => g.label === 'Keys and custody'); return og.querySelector('option').value; });
    await p.locator('.sg-selects select').nth(2).selectOption(opt); await p.waitForTimeout(500);
    const after = await p.evaluate(() => ({ subject: [...document.querySelectorAll('.sg-selects select')][1].value, n: document.querySelector('.sg-now.compact .sec').textContent, dm: [...document.querySelectorAll('.sg-selects select')][2].querySelectorAll('optgroup').length }));
    ok(after.subject === 'keys' && after.n !== before && after.dm === 0, 'a domain picks its subject too, and the list narrows: ' + before + ' to ' + after.n);
    const chev = await p.evaluate(() => getComputedStyle(document.querySelector('.sg-selects label'), '::after').content);
    ok(chev && chev !== 'none', 'every select draws its arrow');
    /* the deck search reaches a card by another name, and its row says which name matched */
    await p.locator('.sg-selects select').nth(1).selectOption('all'); await p.waitForTimeout(300);
    await p.fill('.sg-search', 'two-person'); await p.waitForTimeout(500);
    const via = await p.evaluate(() => { const r = document.querySelector('.sg-row-card'); return (r?.querySelector('strong')?.textContent || '') + ' · ' + (r?.querySelector('small')?.textContent || ''); });
    ok(via === 'Dual Control · Also called Two-Person Rule', 'the deck finds a card by another name and says so: ' + via);
    await p.fill('.sg-search', 'dual control'); await p.waitForTimeout(500);
    const own = await p.evaluate(() => [...document.querySelectorAll('.sg-row-card')].find((r) => r.querySelector('strong')?.textContent === 'Dual Control')?.querySelector('small')?.textContent || '');
    ok(own === 'Term · Access Control', 'by its own name the row keeps its kind and domain: ' + own);
    await p.fill('.sg-search', ''); await p.waitForTimeout(300);
    /* the record by subject, and from a subject into the deck */
    await p.locator('.sg-tab', { hasText: 'Progress' }).click(); await p.waitForTimeout(800);
    const by = await p.evaluate(() => [...document.querySelectorAll('.sg-bysubject li')].map((li) => li.querySelector('em')?.textContent || ''));
    ok(by.length === 11 && by.every((t) => /^\d+ met, \d+ held of \d+$/.test(t)), 'Progress counts the record over the eleven subjects: ' + by.length);
    await p.locator('.sg-bysubject button', { hasText: 'Keys and custody' }).click(); await p.waitForTimeout(1300);
    const into = await p.evaluate(() => ({ tab: document.querySelector('.sg-tab.on')?.textContent, subject: [...document.querySelectorAll('.sg-selects select')][1]?.value }));
    ok(into.tab === 'Deck' && into.subject === 'keys', 'a subject there opens the deck on that subject');
    await p.locator('.sg-selects select').nth(1).selectOption('all'); await p.waitForTimeout(400);
  }
  await p.locator('.sg-row-card button').first().click(); await p.waitForTimeout(1300);
  const det = p.locator('details', { has: p.locator('.sg-map') }).first();
  if ((await det.count()) && !(await det.evaluate((e) => e.open))) { await det.locator('summary').click(); await p.waitForTimeout(600); }
  const fit = await p.evaluate(() => {
    const svg = document.querySelector('.sg-map svg'); const vb = svg.viewBox.baseVal; const box = svg.getBoundingClientRect();
    const out = [...svg.querySelectorAll('text')].filter((t) => { const b = t.getBBox(); return b.x < 0 || b.x + b.width > vb.width || b.y < 0 || b.y + b.height > vb.height; }).map((t) => t.textContent);
    const px = parseFloat(getComputedStyle(svg.querySelector('text')).fontSize) * (box.width / vb.width);
    return { out, n: svg.querySelectorAll('text').length, px: +px.toFixed(1) };
  });
  ok(fit.n > 0 && fit.out.length === 0, 'the systems map keeps all ' + fit.n + ' labels inside its box at ' + width + (fit.out.length ? ': ' + fit.out.join(', ') : ''));
  ok(fit.px >= 12, 'its labels read at ' + fit.px + 'px');
  await collect(p, 'deck-' + width);
  await c.close();
}

/* ---------- 5. the ink in all three themes ---------- */
console.log('-- contrast');
for (const theme of ['nocturne', 'meridian', 'mov']) {
  const c = await context({}, { theme });
  const p = await newPage(c, theme);
  await toGlossary(p);
  const r = await contrastOf(p, LIST_INK);
  /* a term with every part: its domain, why it matters, related terms and the Steps that teach it */
  await p.fill('.gl-search input', 'certificate transparency'); await p.waitForTimeout(400);
  r.push(...(await contrastOf(p, TERM_INK.filter((s) => !s.startsWith('.gl-taught')))));
  await p.fill('.gl-search input', 'stock and flow'); await p.waitForTimeout(400);
  await p.locator('.gl-row', { hasText: 'Stock and Flow' }).first().click(); await p.waitForTimeout(300);
  r.push(...(await contrastOf(p, ['.gl-taught strong', '.gl-taught em'])));
  await p.fill('.gl-search input', 'dual control'); await p.waitForTimeout(400);
  await p.locator('.gl-row').first().click(); await p.waitForTimeout(400);
  r.push(...(await contrastOf(p, MORE_INK)));
  /* a Step's words, and a word with no entry */
  await p.keyboard.press('Control+k'); await p.waitForTimeout(600); await p.fill('.pal input', 'Stocks, Flows'); await p.waitForTimeout(500); await p.locator('.pal-main', { hasText: 'Stocks, Flows' }).first().click(); await p.waitForTimeout(1400);
  r.push(...(await contrastOf(p, STEP_INK)));
  await p.locator('.sw-bare .term-link', { hasText: 'inflow rate' }).click(); await p.waitForTimeout(1200);
  r.push(...(await contrastOf(p, WORD_INK)));
  /* Find's kind labels and its second lines, every kind, chosen and not: the lowest of each */
  await p.keyboard.press('Control+k'); await p.waitForSelector('.pal input'); await p.waitForTimeout(900);
  const worstPal = {};
  for (const q of ['', 'nocturne', 'custody', 'ransomware', 'bybit', 'stack', 'room', 'two-person']) {
    await p.fill('.pal input', q); await p.waitForTimeout(400);
    for (const [s, v] of await paletteInk(p)) if (!(s in worstPal) || v < worstPal[s]) worstPal[s] = v;
  }
  r.push(...Object.entries(worstPal));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  const low = r.filter(([, v]) => v < 4.5);
  ok(low.length === 0, theme + ': every glossary ink and every label in Find reads at 4.5:1 or better' + (low.length ? ': ' + low.map(([s, v]) => s + ' ' + v).join(', ') : ''));
  console.log('     ' + r.map(([s, v]) => s.replace(/^\.gl-|^\./, '') + ' ' + v).join(', '));
  await collect(p, theme);
  await c.close();
}

ok(csp.length === 0, 'no Content-Security-Policy violation' + (csp.length ? ': ' + csp.slice(0, 3).join(' | ') : ''));
ok(errors.length === 0, 'no page error or console error' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
