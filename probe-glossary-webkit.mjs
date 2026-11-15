/* The glossary, a Step's words and the deck by subject, walked in WebKit at iPhone 15 size against the built site.
   WebKit is the engine Safari uses, so this is the nearest thing here to August's own phone. It asserts what is
   visible: the list in even rows, the letters holding under the bar, a term on its own screen with the page
   heading stepped aside (a :has rule) and its card pinned at the foot, Back to the same place, a Step's terms
   opening in place, a word with no entry opening its own page with the sentence marked, Find reaching an entry by
   another name and closing by its own button, Progress by subject, and the systems map inside its box.

   It needs a Playwright whose WebKit build is installed on this machine; it tries the installs it knows of and
   says which one it used. Exit 2 means no WebKit could be launched, which is not a failure of the site.
     node scripts/serve-dist.mjs 5189 &   then   node probe-glossary-webkit.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const BASE = process.argv[2] || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
/* on a phone Find lives in the sheet that More opens */
const openFind = async (p) => { if (!(await p.locator('.nav-find').first().isVisible())) { await p.locator('.tab-more').tap(); await p.waitForTimeout(450); } await p.locator('.nav-find').first().tap(); };

const INSTALLS = ['C:/Users/Initi/DuoZone', 'C:/Users/Initi/duodash-ai', 'C:/Users/Initi/iphone-duos-sold', 'C:/Users/Initi/gino-works', 'C:/Users/Initi/semble-up-citizens'];
let browser = null, devices = null;
for (const dir of INSTALLS) {
  try {
    const pw = require(dir + '/node_modules/playwright-core');
    browser = await pw.webkit.launch({ headless: true });
    devices = pw.devices;
    console.log('WebKit from ' + dir);
    break;
  } catch { /* this install's WebKit build is not on the machine; try the next */ }
}
if (!browser) { console.log('No WebKit could be launched. Install one with: npx playwright install webkit'); process.exit(2); }

const ctx = await browser.newContext({ ...devices['iPhone 15'] });
await ctx.addInitScript(() => { localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus' })); });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
const nav = async (label) => { await p.evaluate((l) => [...document.querySelectorAll('.nav button')].find((x) => x.textContent.trim().startsWith(l))?.click(), label); await p.waitForTimeout(1500); };
const noSide = () => p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
const find = async (text) => { await openFind(p); await p.waitForSelector('.pal input'); await p.fill('.pal input', text); await p.waitForTimeout(800); };

/* the list */
await nav('StepGuides');
ok((await p.locator('.gs-guide').count()) === 60 && await noSide(), 'the guides list all 60, with no sideways scroll');
await p.locator('.gs-tab', { hasText: 'Glossary' }).tap(); await p.waitForSelector('.gl-row'); await p.waitForTimeout(500);
const rows = await p.evaluate(() => ({ n: document.querySelectorAll('.gl-row').length, hs: [...new Set([...document.querySelectorAll('.gl-row')].map((r) => Math.round(r.getBoundingClientRect().height)))], row: getComputedStyle(document.querySelector('.gl-subjects')).display, pick: (() => { const s = document.querySelector('.phone-select select'); return s ? { n: s.options.length, h: Math.round(s.getBoundingClientRect().height), first: s.options[0].textContent } : null; })() }));
ok(rows.n > 400 && rows.hs.length === 1 && rows.row === 'none' && !!rows.pick && rows.pick.n >= 6 && rows.pick.h >= 44 && /^Every subject/.test(rows.pick.first) && await noSide(), 'the glossary lists ' + rows.n + ' terms in even rows (' + rows.hs.join(', ') + 'px), with the subjects in one picker (' + JSON.stringify(rows.pick) + ')');
await p.evaluate(() => window.scrollTo(0, 2000)); await p.waitForTimeout(500);
const strip = await p.evaluate(() => ({ top: Math.round(document.querySelector('.gl-letters').getBoundingClientRect().top), nav: Math.round(document.querySelector('.nav').getBoundingClientRect().bottom) }));
ok(Math.abs(strip.top - strip.nav) <= 2, 'the letters hold under the bar while the list scrolls: ' + strip.top + ' vs ' + strip.nav);

/* a term on its own screen, and Back */
const y = await p.evaluate(() => window.scrollY);
const name = await p.evaluate(() => [...document.querySelectorAll('.gl-row')].find((r) => r.getBoundingClientRect().top > 220).querySelector('strong').textContent);
await p.locator('.gl-row', { hasText: name }).first().tap(); await p.waitForTimeout(900);
const term = await p.evaluate(() => ({ title: document.querySelector('#gl-term')?.textContent, head: getComputedStyle(document.querySelector('.view-head')).display, top: Math.round(document.querySelector('.gl-detail').getBoundingClientRect().top), nav: Math.round(document.querySelector('.nav').getBoundingClientRect().bottom), foot: Math.round(document.querySelector('.gl-actions').getBoundingClientRect().bottom), vh: innerHeight, rows: document.querySelectorAll('.gl-row').length }));
ok(term.title === name && term.rows === 0, 'a tap opens the term on its own screen: ' + term.title);
ok(term.head === 'none', 'the page heading steps aside while a term is read');
ok(term.top >= term.nav - 2 && term.top < term.nav + 70, 'the term starts at the top of the screen: ' + term.top + ' (bar ends ' + term.nav + ')');
ok(term.foot <= term.vh + 1, 'its card and the way on are pinned at the foot: ' + term.foot + ' of ' + term.vh);
await p.locator('.gl-back').tap(); await p.waitForTimeout(800);
const back = await p.evaluate(() => ({ y: Math.round(window.scrollY), head: getComputedStyle(document.querySelector('.view-head')).display }));
ok(Math.abs(back.y - y) <= 3 && back.head !== 'none', 'Back returns to the same place in the list, with the heading: ' + back.y + ' vs ' + y);

/* a Step's words */
await p.evaluate(() => window.scrollTo(0, 0));
await find('Stocks, Flows');
await p.locator('.pal-main', { hasText: 'Stocks, Flows' }).first().tap(); await p.waitForTimeout(1800);
await p.locator('.sw').scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
const sw = await p.evaluate(() => ({ terms: [...document.querySelectorAll('.sw-term')].map((b) => b.textContent.trim()), hs: [...document.querySelectorAll('.sw-term')].map((b) => Math.round(b.getBoundingClientRect().height)) }));
ok(sw.terms[0] === 'Stock and Flow' && sw.terms.length >= 2 && sw.hs.every((h) => h >= 44), 'the Step lists its terms, each a full finger tall: ' + sw.terms.join(', '));
await p.locator('.sw-term').first().tap(); await p.waitForTimeout(500);
ok((await p.locator('.sw .term-pop strong').innerText()) === 'Stock and Flow' && await noSide(), 'a term opens in place');
await p.locator('.sw-bare .term-link', { hasText: 'inflow rate' }).tap(); await p.waitForTimeout(1600);
const word = await p.evaluate(() => ({ title: document.querySelector('#gl-term')?.textContent, marks: document.querySelectorAll('.gl-noentry mark').length, covered: [...document.querySelectorAll('[data-said="covered"] strong')].map((x) => x.textContent), top: Math.round(document.querySelector('.gl-noentry').getBoundingClientRect().top), nav: Math.round(document.querySelector('.nav').getBoundingClientRect().bottom) }));
ok(word.title === 'inflow rate' && word.covered.includes('Stock and Flow') && word.marks > 0, 'a word with no entry opens its own page with the sentence marked: ' + word.covered.join(', '));
ok(word.top >= word.nav - 2 && word.top < word.nav + 70, 'and it starts at the top of the screen: ' + word.top);

/* the words that link in prose, and Find by another name */
await find('Holding The Name');
await p.locator('.pal-main', { hasText: 'Holding The Name' }).first().tap(); await p.waitForTimeout(1800);
const links = await p.locator('.blk .term-link').count();
ok(links > 0, 'a guide links the terms in its prose (' + links + '): the name matcher runs in WebKit');
if (links) {
  await p.locator('.blk .term-link').first().scrollIntoViewIfNeeded(); await p.locator('.blk .term-link').first().tap(); await p.waitForTimeout(500);
  const pop = await p.evaluate(() => ({ where: document.querySelector('.term-pop-where')?.textContent || '', buttons: [...document.querySelectorAll('.term-pop button')].map((b) => b.textContent) }));
  ok(pop.where.length > 3 && pop.buttons.includes('Study its card') && await noSide(), 'a linked word opens its definition with its subject: ' + pop.where);
}
await find('Hardware Security Module');
const hit = await p.evaluate(() => { const r = document.querySelector('.pal-row'); return { title: r?.querySelector('strong')?.textContent || '', why: r?.querySelector('em')?.textContent || '' }; });
ok(hit.title === 'HSM' && /Also called Hardware Security Module/.test(hit.why), 'Find reaches an entry by another name and says so: ' + hit.title + ' · ' + hit.why);
await p.locator('.pal-main').first().tap(); await p.waitForTimeout(1600);
ok((await p.evaluate(() => document.querySelector('#gl-term')?.textContent)) === 'HSM', 'and opens it');
/* Find fills a phone's screen, so its way out has to be a button. The palette scales in over 420ms, so it is measured once it has settled. */
await openFind(p); await p.waitForSelector('.pal input'); await p.waitForTimeout(1000);
await p.waitForFunction(() => { const el = document.querySelector('.pal'); return !!el && el.getAnimations().every((a) => a.playState !== 'running'); }, null, { timeout: 6000 }).catch(() => {});
const way = await p.evaluate(() => { const b = document.querySelector('.pal-close'), r = b.getBoundingClientRect(); return { word: b.innerText.trim(), w: Math.round(r.width), h: Math.round(r.height) }; });
await p.locator('.pal-close').tap(); await p.waitForTimeout(400);
ok(way.word === 'Close' && way.w >= 44 && way.h >= 44 && (await p.locator('.pal').count()) === 0, 'Find has a Close a finger can hit, and it closes: ' + way.w + ' by ' + way.h);

/* the record by subject, the deck on a subject, and the map */
await nav('StudyMode');
await p.locator('.sg-tab', { hasText: 'Progress' }).tap(); await p.waitForTimeout(900);
ok((await p.locator('.sg-bysubject li').count()) === 11, 'Progress counts the record over the eleven subjects');
await p.locator('.sg-bysubject button', { hasText: 'Keys and custody' }).tap(); await p.waitForTimeout(1500);
ok(await p.evaluate(() => [...document.querySelectorAll('.sg-selects select')][1]?.value === 'keys'), 'a subject opens the deck on that subject');
await p.locator('.sg-row-card button').first().tap(); await p.waitForTimeout(1500);
const det = p.locator('details', { has: p.locator('.sg-map') }).first();
if ((await det.count()) && !(await det.evaluate((e) => e.open))) { await det.locator('summary').tap(); await p.waitForTimeout(700); }
const fit = await p.evaluate(() => { const svg = document.querySelector('.sg-map svg'); if (!svg) return null; const vb = svg.viewBox.baseVal; return { n: svg.querySelectorAll('text').length, out: [...svg.querySelectorAll('text')].filter((t) => { const b = t.getBBox(); return b.x < 0 || b.x + b.width > vb.width; }).length }; });
ok(!!fit && fit.n > 0 && fit.out === 0, 'the systems map keeps its ' + (fit ? fit.n : 0) + ' labels inside its box');
ok(await noSide(), 'no sideways scroll on a card');

/* in Safari's engine: the tab bar's light, one decision on Ground, the outcome in view, a sealed Step that leads on */
await nav('Ground'); await p.waitForTimeout(600);
const lightW = await p.evaluate(() => { const l = document.querySelector('.tab-light')?.getBoundingClientRect(); const on = document.querySelector('.tabbar .tab[aria-current="page"]')?.getBoundingClientRect(); return l && on ? { light: Math.round(l.left + l.width / 2), tab: Math.round(on.left + on.width / 2) } : null; });
ok(!!lightW && Math.abs(lightW.light - lightW.tab) <= 2, 'the tab bar\'s light rests over the open tab (' + JSON.stringify(lightW) + ')');
const cardW = await p.evaluate(() => { const c = document.querySelector('.pr-one'); if (!c) return null; return { bottom: Math.round(c.getBoundingClientRect().bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top) }; });
ok(!!cardW && cardW.bottom <= cardW.bar, 'Ground offers one decision on its first screen (' + JSON.stringify(cardW) + ')');
await p.locator('.pr-one-go').tap(); await p.waitForTimeout(1600);
await p.locator('.sim-one .opt').first().scrollIntoViewIfNeeded(); await p.locator('.sim-one .opt').first().tap(); await p.waitForTimeout(2400);
const outW = await p.evaluate(() => { const r = document.querySelector('.sim-one .outcome')?.getBoundingClientRect(); return r ? { top: Math.round(r.top), vh: innerHeight, tag: document.querySelector('.sim-one .opt-tag')?.textContent || '' } : null; });
ok(!!outW && outW.top >= 0 && outW.top < outW.vh - 200 && /you chose/i.test(outW.tag), 'after an answer the options say which was chosen and the page moves to the outcome (' + JSON.stringify(outW) + ')');
await p.goto(BASE + '/#/step/ch-foundations-stocks-and-flows', { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
if (await p.locator('.drill .opt').count()) { await p.locator('.drill .opt').first().scrollIntoViewIfNeeded(); await p.locator('.drill .opt').first().tap(); await p.waitForTimeout(1600); }
const sealW = p.locator('button', { hasText: 'Seal this Step' });
await sealW.scrollIntoViewIfNeeded(); await sealW.tap(); await p.waitForTimeout(2200);
const nextW = await p.evaluate(() => { const c = document.querySelector('.st-next'); if (!c) return null; const r = c.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top), go: (c.querySelector('.pr-one-go')?.textContent || '').trim() }; });
ok(!!nextW && nextW.go === 'Next Step' && nextW.top >= 0 && nextW.bottom <= nextW.bar, 'a sealed Step shows the Step after it, whole above the tab bar (' + JSON.stringify(nextW) + ')');
ok(await noSide(), 'no sideways scroll on a sealed Step');
ok(errs.length === 0, 'no page error or console error' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));

await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
