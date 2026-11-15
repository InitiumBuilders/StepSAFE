/* The phone's tab bar, walked in a real browser against the built site. On a phone the four places a learner goes
   most sit under the thumb and the full menu opens from More; nothing is pinned to the top of the page. This holds:
   the tabs are a finger tall and carry the menu's own names, More opens every other place with the learner's
   standing, Back and the scrim close it, the tab of the open page returns to its top, whatever a page pins to the
   bottom sits above the bar, the end of every page clears it, and a wider screen keeps the row or the rail.
     node scripts/serve-dist.mjs 5189 &   then   node probe-tabbar.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv.slice(2).find((a) => /^https?:/.test(a)) || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const seed = (theme) => { try { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme, mode: 'motus', motion: 'calm' })); } catch { /* no storage on a blank page */ } };

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
async function open(w, h, theme = 'nocturne') {
  const phone = w < 600;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  await ctx.addInitScript(seed, theme);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
  await p.goto('about:blank');
  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
  return { ctx, p };
}
const box = (p, q) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), b: Math.round(r.bottom), shown: cs.display !== 'none' && r.width > 0 && r.height > 0 }; }, q);

/* ---------- a phone ---------- */
{
  const { ctx, p } = await open(390, 844);
  const bar = await box(p, '.tabbar');
  ok(!!bar && bar.shown && bar.b === 844 && bar.w === 390, 'the tab bar sits at the bottom of the screen (' + JSON.stringify(bar) + ')');
  const tabs = await p.evaluate(() => [...document.querySelectorAll('.tabbar .tab')].map((t) => { const r = t.getBoundingClientRect(); return { label: t.innerText.trim(), w: Math.round(r.width), h: Math.round(r.height), font: parseFloat(getComputedStyle(t.querySelector('span')).fontSize), cut: t.scrollWidth > t.clientWidth + 1, on: t.getAttribute('aria-current') === 'page' || t.classList.contains('on') }; }));
  ok(tabs.map((t) => t.label).join(' | ') === 'Ground | Chapters | The Practice | Modux Models | More', 'four places under the menu\'s own names, and More (' + tabs.map((t) => t.label).join(' | ') + ')');
  ok(tabs.every((t) => t.w >= 44 && t.h >= 44), 'every tab is a finger wide and tall (' + tabs.map((t) => t.w + 'x' + t.h).join(' ') + ')');
  ok(tabs.every((t) => t.font >= 12 && !t.cut), 'their names are 12px or more and whole');
  ok(tabs.filter((t) => t.on).map((t) => t.label).join() === 'Ground', 'Ground shows as the open page');
  const lightAt = () => p.evaluate(() => { const l = document.querySelector('.tab-light').getBoundingClientRect(); const on = document.querySelector('.tabbar .tab[aria-current="page"], .tabbar .tab.on').getBoundingClientRect(); return { light: Math.round(l.left + l.width / 2), tab: Math.round(on.left + on.width / 2), h: Math.round(l.height), lights: document.querySelectorAll('.tab-light').length }; });
  const rest = await lightAt();
  ok(Math.abs(rest.light - rest.tab) <= 2 && rest.h >= 2 && rest.lights === 1, 'the bar has one light, resting over the open tab (' + JSON.stringify(rest) + ')');
  const menu = await box(p, '.nav');
  ok(!!menu && !menu.shown, 'the full menu is put away');
  const first = await p.evaluate(() => Math.round(document.querySelector('#main .view-in')?.firstElementChild?.getBoundingClientRect().top ?? 999));
  ok(first < 40, 'the page starts at the top of the screen (' + first + ')');

  /* More: every other place, Find, and the standing */
  await p.locator('.tab-more').tap(); await p.waitForTimeout(500);
  const overMore = await lightAt();
  ok(Math.abs(overMore.light - overMore.tab) <= 2 && overMore.light > rest.light + 100, 'with the sheet open the light is over More (' + JSON.stringify(overMore) + ')');
  const sheet = await p.evaluate(() => { const n = document.querySelector('.nav'); const r = n.getBoundingClientRect(); const vis = (e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.top >= r.top - 1 && b.left >= 0 && b.right <= innerWidth + 1; }; const btns = [...n.querySelectorAll('.navlist .navbtn')].filter((b) => b.getBoundingClientRect().height > 0); return { top: Math.round(r.top), b: Math.round(r.bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top), names: btns.map((b) => b.querySelector('span').textContent.trim()), small: btns.filter((b) => b.getBoundingClientRect().height < 44 || b.getBoundingClientRect().width < 44).length, allIn: btns.every(vis), find: (() => { const f = n.querySelector('.nav-find'); const b = f.getBoundingClientRect(); return vis(f) && b.height >= 44; })(), hud: (n.querySelector('.hud')?.innerText || '').replace(/\s+/g, ' '), hudShown: !!n.querySelector('.hud') && getComputedStyle(n.querySelector('.hud')).display !== 'none', scrim: !!document.querySelector('.nav-scrim'), over: document.documentElement.scrollWidth - document.documentElement.clientWidth, expanded: document.querySelector('.tab-more').getAttribute('aria-expanded') }; });
  ok(sheet.names.join(' | ') === 'StepGuides | StudyMode | Steps | UNIT ONE | Praxis Profile | NextSteps | Seva | Settings', 'More opens the eight places the tab bar does not carry (' + sheet.names.join(', ') + ')');
  ok(sheet.small === 0 && sheet.find, 'each is a finger tall, and Find leads them');
  ok(sheet.hudShown && /respect/i.test(sheet.hud) && /trust/i.test(sheet.hud) && /rank/i.test(sheet.hud), 'the sheet shows the learner\'s standing (' + sheet.hud.slice(0, 60) + ')');
  ok(sheet.b === sheet.bar && sheet.top > 60, 'the sheet rises from the tab bar and leaves the page in view above it (' + sheet.top + ' to ' + sheet.b + ', bar at ' + sheet.bar + ')');
  ok(sheet.scrim && sheet.expanded === 'true' && sheet.over <= 0, 'a scrim covers the page, the tab says it is open, nothing runs off the side');
  const fits = await p.evaluate(() => { const n = document.querySelector('.nav'); return n.scrollHeight <= n.clientHeight + 1; });
  ok(fits, 'the whole sheet fits without scrolling at this height');

  /* the keyboard: the sheet takes the focus, Escape closes it and hands the focus back */
  await p.waitForTimeout(200);
  const focusIn = await p.evaluate(() => document.activeElement?.classList.contains('nav-find') || false);
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  const focusOut = await p.evaluate(() => ({ shut: getComputedStyle(document.querySelector('.nav')).display === 'none', on: document.activeElement?.classList.contains('tab-more') || false }));
  ok(focusIn && focusOut.shut && focusOut.on, 'the sheet takes the focus, Escape closes it, and the focus returns to More');
  await p.locator('.tab-more').tap(); await p.waitForTimeout(450);

  /* closing: the scrim, Back, a place chosen */
  await p.mouse.click(195, 60); await p.waitForTimeout(400);
  ok(!(await box(p, '.nav')).shown, 'a tap on the page above closes it');
  await p.locator('.tab-more').tap(); await p.waitForTimeout(400);
  await p.goBack(); await p.waitForTimeout(700);
  ok(!(await box(p, '.nav')).shown && /Welcome/.test(await p.evaluate(() => document.querySelector('#main h1')?.innerText || '')), 'Back closes it and stays on the page');
  await p.locator('.tab-more').tap(); await p.waitForTimeout(400);
  await p.locator('.nav .navbtn', { hasText: 'StudyMode' }).tap(); await p.waitForTimeout(1500);
  const study = await p.evaluate(() => ({ menu: getComputedStyle(document.querySelector('.nav')).display, more: document.querySelector('.tab-more').classList.contains('on'), cur: [...document.querySelectorAll('.tabbar .tab[aria-current="page"]')].length, h1: document.querySelector('#main h1')?.innerText || '' }));
  ok(study.menu === 'none' && study.more && study.cur === 0 && study.h1.length > 0, 'a place chosen from the sheet opens, the sheet closes, and More shows as open (' + study.h1.replace(/\s+/g, ' ').slice(0, 40) + ')');
  await p.goBack(); await p.waitForTimeout(1200);
  ok(/Welcome/.test(await p.evaluate(() => document.querySelector('#main h1')?.innerText || '')), 'one Back returns to the page before');
  /* Find from the sheet */
  await p.locator('.tab-more').tap(); await p.waitForTimeout(400);
  await p.locator('.nav-find').tap(); await p.waitForSelector('.pal input'); await p.waitForTimeout(300);
  ok(!(await box(p, '.nav')).shown, 'Find opens and the sheet steps aside');
  const pal = await p.evaluate(() => { const s = document.querySelector('.pal-scrim') || document.querySelector('.pal'); return Number(getComputedStyle(s).zIndex) || 0; });
  ok(pal > 46, 'Find draws above the tab bar (layer ' + pal + ')');
  await p.goBack(); await p.waitForTimeout(600);
  ok(!(await p.locator('.pal input').count()), 'Back closes Find');

  /* a tab opens its page; the tab of the open page returns to its top */
  await p.locator('.tabbar .tab', { hasText: 'The Practice' }).tap(); await p.waitForSelector('.simcard'); await p.waitForTimeout(500);
  ok((await p.evaluate(() => document.querySelector('.tabbar .tab[aria-current="page"]')?.innerText.trim())) === 'The Practice', 'a tab opens its page and shows as open');
  await p.waitForTimeout(500);
  const moved = await lightAt();
  ok(Math.abs(moved.light - moved.tab) <= 2 && moved.light !== rest.light, 'and the light has moved to it (' + JSON.stringify(moved) + ')');
  await p.evaluate(() => window.scrollTo(0, 1400)); await p.waitForTimeout(250);
  await p.locator('.tabbar .tab', { hasText: 'The Practice' }).tap(); await p.waitForTimeout(500);
  ok((await p.evaluate(() => Math.round(window.scrollY))) === 0, 'the tab of the open page returns to its top');

  /* what a page pins to the bottom sits above the bar */
  await p.locator('.simcard').first().tap(); await p.waitForTimeout(1400);
  const dock = await p.evaluate(() => ({ d: Math.round(document.querySelector('.sim-dock').getBoundingClientRect().bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top) }));
  ok(dock.d <= dock.bar - 6 && dock.d > dock.bar - 40, 'a room\'s way in sits just above the tab bar (' + dock.d + ' over ' + dock.bar + ')');
  ok((await p.evaluate(() => document.querySelector('.tabbar .tab[aria-current="page"]')?.innerText.trim())) === 'The Practice', 'inside a room the tab bar still says The Practice');
  await p.locator('.sim-dock button').tap(); await p.waitForTimeout(1000);
  for (let i = 0; i < 3; i++) { if (await p.locator('.sim-next .btn:not([disabled])').count()) { await p.locator('.sim-next .btn').tap(); await p.waitForTimeout(700); } }
  await p.evaluate(() => window.scrollBy(0, 300)); await p.waitForTimeout(300);
  const strip = await p.evaluate(() => ({ y: Math.round(document.querySelector('.sim-strip').getBoundingClientRect().top), scrolled: Math.round(window.scrollY) }));
  ok(strip.scrolled > 100 && strip.y >= 0 && strip.y <= 16, 'the room\'s strip holds at the top of the screen while the feed scrolls (' + strip.y + ' at scroll ' + strip.scrolled + ')');
  await p.locator('.tabbar .tab', { hasText: 'Modux Models' }).tap(); await p.waitForTimeout(1500);
  await p.locator('.gx-card-wrap button').first().tap(); await p.waitForTimeout(2000);
  const gdock = await p.evaluate(() => ({ d: Math.round(document.querySelector('.tr-dock').getBoundingClientRect().bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top) }));
  ok(gdock.d <= gdock.bar - 6 && gdock.d > gdock.bar - 40, 'a gauge\'s dock sits just above the tab bar (' + gdock.d + ' over ' + gdock.bar + ')');

  /* the end of every page clears the bar */
  const nav = async (label) => { await p.evaluate((l) => [...document.querySelectorAll('.nav button')].find((x) => x.textContent.trim().startsWith(l))?.click(), label); await p.waitForTimeout(1400); };
  /* a deck card's controls and a glossary entry's actions are pinned above the bar too */
  await nav('StudyMode'); await p.locator('.sg-tab', { hasText: 'Deck' }).tap(); await p.waitForTimeout(900);
  await p.locator('.sg-row-card').first().tap(); await p.waitForSelector('.sg-nav'); await p.waitForTimeout(700);
  const card = await p.evaluate(() => ({ d: Math.round(document.querySelector('.sg-nav').getBoundingClientRect().bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top), tall: document.documentElement.scrollHeight > innerHeight + 40 }));
  ok(card.d <= card.bar, 'a deck card\'s controls sit above the tab bar (' + card.d + ' over ' + card.bar + ')');
  await nav('StepGuides'); await p.locator('.gs-tab', { hasText: 'Glossary' }).tap(); await p.waitForSelector('.gl-row', { timeout: 10000 });
  await p.locator('.gl-row').first().tap(); await p.waitForSelector('.gl-actions'); await p.waitForTimeout(900);
  const term = await p.evaluate(() => ({ d: Math.round(document.querySelector('.gl-actions').getBoundingClientRect().bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top) }));
  ok(term.d <= term.bar, 'a glossary entry\'s actions sit above the tab bar (' + term.d + ' over ' + term.bar + ')');
  for (const label of ['Ground', 'Chapters', 'The Practice', 'StepGuides', 'StudyMode', 'Steps', 'UNIT', 'Praxis Profile', 'NextSteps', 'Seva', 'Settings']) {
    await nav(label);
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(350);
    const end = await p.evaluate(() => { const bar = document.querySelector('.tabbar').getBoundingClientRect().top; const main = document.querySelector('#main .view-in'); let last = 0; for (const el of main.querySelectorAll('*')) { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); if (r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.position !== 'fixed' && cs.position !== 'sticky' && el.children.length === 0 && (el.innerText || '').trim()) last = Math.max(last, r.bottom); } return { last: Math.round(last), bar: Math.round(bar), over: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    ok(end.last <= end.bar && end.over <= 0, label + ': the last line clears the tab bar (' + end.last + ' over ' + end.bar + ')');
  }
  /* a real toast (the hidden principle, found by typing the word safe) shows at the top edge, clear of the bar */
  await nav('Ground'); await p.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
  await p.keyboard.type('safe'); await p.waitForTimeout(600);
  const toast = await p.evaluate(() => { const t = document.querySelector('.toasts .toast'); if (!t) return null; const r = t.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top), text: t.innerText.replace(/\s+/g, ' ').slice(0, 40) }; });
  ok(!!toast && toast.top >= 0 && toast.top <= 16 && toast.bottom < 80 && toast.bottom < toast.bar, 'a toast shows at the top edge of the screen, clear of the tab bar (' + JSON.stringify(toast) + ')');
  await ctx.close();
}

/* ---------- the light and the black theme: the bar and the sheet are solid ---------- */
for (const theme of ['meridian', 'mov']) {
  const { ctx, p } = await open(390, 844, theme);
  await p.locator('.tab-more').tap(); await p.waitForTimeout(500);
  const solid = await p.evaluate(() => { const a = (q) => { const c = document.createElement('canvas'); c.width = c.height = 1; const x = c.getContext('2d'); x.fillStyle = getComputedStyle(document.querySelector(q)).backgroundColor; x.fillRect(0, 0, 1, 1); return x.getImageData(0, 0, 1, 1).data[3]; }; return { bar: a('.tabbar'), sheet: a('.nav') }; });
  ok(solid.bar === 255 && solid.sheet === 255, theme + ': the bar and the sheet are solid, so the page does not show through');
  await ctx.close();
}

/* ---------- a small phone ---------- */
{
  const { ctx, p } = await open(320, 640);
  const tabs = await p.evaluate(() => [...document.querySelectorAll('.tabbar .tab')].map((t) => { const r = t.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), l: Math.round(r.left), r: Math.round(r.right) }; }));
  ok(tabs.length === 5 && tabs.every((t) => t.w >= 44 && t.l >= 0 && t.r <= 320), 'at 320 wide the five tabs still fit, each a finger wide (' + tabs.map((t) => t.w).join(' ') + ')');
  ok((await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 0, 'and nothing runs off the side');
  await p.locator('.tab-more').tap(); await p.waitForTimeout(500);
  const reach = await p.evaluate(() => { const n = document.querySelector('.nav'); n.scrollTop = n.scrollHeight; const last = [...n.querySelectorAll('.navlist .navbtn')].filter((b) => b.getBoundingClientRect().height > 0).pop().getBoundingClientRect(); return { b: Math.round(last.bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top), top: Math.round(n.getBoundingClientRect().top) }; });
  ok(reach.b <= reach.bar && reach.top >= 40, 'on a short screen the sheet scrolls to its last place (' + JSON.stringify(reach) + ')');
  await ctx.close();
}

/* ---------- a tablet keeps the row; a wide screen keeps the rail ---------- */
for (const [w, h, what] of [[900, 1100, 'the row on top'], [1440, 900, 'the rail at the side']]) {
  const { ctx, p } = await open(w, h);
  const s = await p.evaluate(() => ({ bar: getComputedStyle(document.querySelector('.tabbar')).display, nav: getComputedStyle(document.querySelector('.nav')).display, pos: getComputedStyle(document.querySelector('.nav')).position, tabh: getComputedStyle(document.documentElement).getPropertyValue('--tab-h').trim() }));
  ok(s.bar === 'none' && s.nav !== 'none' && s.pos === 'sticky', 'at ' + w + ' wide there is no tab bar: ' + what + ' (' + JSON.stringify(s) + ')');
  await ctx.close();
}

/* ---------- the first screen fetches what Ground needs and no more ----------
   A learner whose browser saves data gets no background fetch, so what loads here is what Ground itself asks for. */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await ctx.addInitScript(seed, 'nocturne');
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }); } catch { /* the browser keeps its own */ } });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push('first screen: ' + String(e).slice(0, 200)));
  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  const asked = await p.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name).filter((n) => /\/assets\/[^/]+\.js$/.test(n)).map((n) => n.split('/assets/')[1].replace(/-[A-Za-z0-9_-]{8}\.js$/, '')));
  const drawn = await p.evaluate(() => !!document.querySelector('.pr-one') && /welcome/i.test(document.querySelector('#main h1')?.innerText || ''));
  ok(drawn && asked.includes('bootApp') && !asked.some((n) => /^(glossary|outlier|practice|guides|awards|ch-|modux-models)/.test(n)), 'Ground draws without the glossary, the known systems, the rooms, the guides, the awards, a chapter or the Modux model texts (' + asked.join(' ') + ')');
  await ctx.close();
}

ok(errors.length === 0, 'no page error or console error' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
