/* Back and Forward, walked in a real browser on a phone-sized screen against the built site. The app keeps its place
   in its own state and the address stays the same, so this holds the promise lib/history.ts makes: Back returns to
   the page before and to where it was scrolled, Forward goes on again, a sheet that is open closes first, a page
   chosen from a sheet is one step, and a room left part way is still there.
     node scripts/serve-dist.mjs 5189 &   then   node probe-back.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv.slice(2).find((a) => /^https?:/.test(a)) || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
/* on a phone Find lives in the sheet that More opens */
const openFind = async (p) => { if (!(await p.locator('.nav-find').first().isVisible())) { await p.locator('.tab-more').tap(); await p.waitForTimeout(450); } await p.locator('.nav-find').first().tap(); };

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await ctx.addInitScript(() => { try { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus', motion: 'calm' })); } catch { /* the blank page has no storage */ } });
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
/* a blank page first, so the tab has somewhere to go back to that is not the app */
await p.goto('about:blank');
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);

const nav = async (label) => { await p.evaluate((l) => [...document.querySelectorAll('.nav button')].find((x) => x.textContent.trim().startsWith(l))?.click(), label); await p.waitForTimeout(1300); };
const on = () => p.evaluate(() => document.querySelector('.nav .navbtn[aria-current="page"]')?.textContent.trim().replace(/\d+$/, '') || '');
const h1 = () => p.evaluate(() => (document.querySelector('#main h1')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60));
const y = () => p.evaluate(() => Math.round(window.scrollY));
const back = async () => { await p.goBack(); await p.waitForTimeout(1300); };
const fwd = async () => { await p.goForward(); await p.waitForTimeout(1300); };
const path0 = await p.evaluate(() => location.pathname + location.search + location.hash);

/* ---------- 1. pages ---------- */
await nav('Chapters');
ok(await on() === 'Chapters', 'Chapters opens');
const firstChapter = await p.evaluate(() => { const b = document.querySelector('#main .chapter, #main [class*="chapter"] button, #main button.chapter'); return !!b; });
await p.evaluate(() => { const c = [...document.querySelectorAll('#main button, #main [role=button]')].find((x) => /Ground/.test(x.innerText) && x.getBoundingClientRect().height > 60); (c || document.querySelector('#main .chapter'))?.click(); });
await p.waitForTimeout(1500);
const chapterTitle = await h1();
ok(firstChapter && chapterTitle.length > 0 && await p.evaluate(() => !!document.querySelector('#main')), 'a chapter opens (' + chapterTitle + ')');
await nav('The Practice');
await p.waitForSelector('.simcard');
await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(250);
const leftAt = await y();
ok(leftAt > 600, 'The Practice is scrolled before it is left (' + leftAt + ')');
await nav('Modux');
ok(await on() === 'Modux Models' && await y() === 0, 'a page opened from the menu starts at its top');

await back();
ok(await on() === 'The Practice', 'Back returns to The Practice');
ok(Math.abs(await y() - leftAt) <= 4, 'and to where it was scrolled (' + await y() + ' of ' + leftAt + ')');
await back();
ok((await h1()) === chapterTitle, 'Back again returns to the chapter (' + (await h1()) + ')');
await back();
ok(await on() === 'Chapters', 'and then to Chapters');
await back();
ok(await on() === 'Ground', 'and then to Ground');
await fwd();
ok(await on() === 'Chapters', 'Forward goes on to Chapters');
await fwd(); await fwd();
ok(await on() === 'The Practice', 'and on to The Practice');
ok((await p.evaluate(() => location.pathname + location.hash)) === '/#/practice', 'the address names the page after its #, and the path stays the same (' + (await p.evaluate(() => location.pathname + location.hash)) + ')');

/* ---------- 2. a sheet closes first; a page chosen from it is one step ---------- */
await openFind(p); await p.waitForSelector('.pal input'); await p.waitForTimeout(300);
await back();
ok(!(await p.locator('.pal input').count()) && await on() === 'The Practice', 'Back closes Find and stays on the page');
await openFind(p); await p.waitForSelector('.pal input');
await p.fill('.pal input', 'Stocks, Flows'); await p.waitForTimeout(700);
await p.locator('.pal-main', { hasText: 'Stocks, Flows' }).first().tap(); await p.waitForTimeout(1600);
const stepTitle = await h1();
ok(!(await p.locator('.pal input').count()) && /Stocks/.test(stepTitle), 'a Step chosen in Find opens (' + stepTitle + ')');
await back();
ok(await on() === 'The Practice' && !(await p.locator('.pal input').count()), 'one Back returns to the page Find was opened on');
await openFind(p); await p.waitForSelector('.pal input'); await p.waitForTimeout(250);
await p.locator('.pal-close').tap(); await p.waitForTimeout(700);
ok(!(await p.locator('.pal input').count()), 'Find closes by its own button');
await back();
ok((await h1()) === chapterTitle && await on() === 'Chapters', 'Back after closing Find by hand is a real step: the page before (' + (await h1()) + ')');

/* ---------- 3. a room left part way is still there ---------- */
await nav('The Practice'); await p.waitForSelector('.simcard');
await p.locator('.simcard').first().tap(); await p.waitForTimeout(1400);
ok(await p.locator('.sim-dock button').innerText() === 'Take the chair', 'a fresh room offers the chair');
await p.locator('.sim-dock button').tap(); await p.waitForTimeout(1000);
let moves = 0, decided = 0;
for (; moves < 30 && decided < 2; moves++) {
  const st = await p.evaluate(() => ({ opt: !!document.querySelector('.inject.current .opt:not([disabled])'), next: !!document.querySelector('.sim-next .btn:not([disabled])') }));
  if (st.opt) { await p.locator('.inject.current .opt:not([disabled])').first().tap(); await p.waitForTimeout(500); decided++; continue; }
  if (st.next) { await p.locator('.sim-next .btn').tap(); await p.waitForTimeout(700); continue; }
  await p.waitForTimeout(300);
}
const strip = await p.evaluate(() => (document.querySelector('.sim-strip')?.innerText || '').replace(/\s+/g, ' '));
const at = /Inject (\d+) of (\d+)/.exec(strip);
ok(!!at && decided === 2, 'two decisions are taken (' + strip + ')');
ok((await p.evaluate(() => document.querySelector('.sim-kept')?.innerText || '')).startsWith('Your place is kept on this device.'), 'the live room says its place is kept');
await back();
ok(await on() === 'The Practice' && !(await p.locator('.sim-strip').count()), 'Back leaves the room for The Practice');
const chip = await p.evaluate(() => document.querySelector('.simcard .pr-going')?.innerText || '');
ok(!!at && chip.includes('In progress') && chip.includes(at[1] + ' of ' + at[2]), 'its card says In progress (' + chip + ')');
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(1600);
ok(await on() === 'The Practice', 'a reload stays on the page it was on');
await nav('Ground');
const ground = await p.evaluate(() => document.querySelector('#main')?.innerText || '');
ok(/in progress/i.test(ground), 'after a reload Ground names the room in progress');
/* Ground leads with it: the room left part way, its place, and Continue, whole on the first screen */
const groundLead = await p.evaluate(() => { const c = document.querySelector('.pr-one'); if (!c) return null; return { text: c.innerText.replace(/\s+/g, ' '), going: c.classList.contains('pr-one-going'), bottom: Math.round(c.getBoundingClientRect().bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top) }; });
ok(!!at && !!groundLead && groundLead.going && groundLead.text.toLowerCase().includes('inject ' + at[1] + ' of ' + at[2]) && /continue/i.test(groundLead.text) && groundLead.bottom <= groundLead.bar, 'Ground leads with the room in progress, on its first screen (' + (groundLead && groundLead.text) + ')');
/* Continue, from Ground and from The Practice, opens the room on the inject it was left on, with no brief on the way */
const stripNow = () => p.evaluate(() => (document.querySelector('.sim-strip')?.innerText || '').replace(/\s+/g, ' '));
await p.locator('.pr-one-go').tap(); await p.waitForTimeout(1600);
ok((await stripNow()) === strip && !(await p.locator('.sim-dock').count()), 'from Ground its Continue opens the room where it was left (' + (await stripNow()) + ')');
await back();
ok(await on() === 'Ground', 'and Back returns to Ground');
await nav('The Practice'); await p.waitForSelector('.simcard');
const lead = await p.evaluate(() => (document.querySelector('.pr-one')?.innerText || '').replace(/\s+/g, ' '));
ok(!!at && /in progress/i.test(lead) && lead.toLowerCase().includes('inject ' + at[1] + ' of ' + at[2]) && /continue/i.test(lead), 'The Practice leads with the room in progress (' + lead + ')');
await p.locator('.pr-one-go').tap(); await p.waitForTimeout(1500);
ok((await stripNow()) === strip, 'and its Continue opens the room where it was left');
const curAt = await p.evaluate(() => { const c = document.querySelector('.inject.current')?.getBoundingClientRect(); const st = document.querySelector('.sim-strip')?.getBoundingClientRect(); return c && st ? { top: Math.round(c.top), strip: Math.round(st.bottom) } : null; });
ok(!!curAt && curAt.top >= curAt.strip - 2 && curAt.top < 700, 'with the inject it was left on in view (' + JSON.stringify(curAt) + ')');
await back(); await p.waitForSelector('.simcard');
await p.locator('.simcard').first().tap(); await p.waitForTimeout(1400);
const resume = await p.evaluate(() => (document.querySelector('.sim-resume')?.innerText || '').replace(/\s+/g, ' '));
ok(!!at && resume.includes('inject ' + at[1] + ' of ' + at[2]), 'the brief offers the saved place (' + resume.slice(0, 90) + ')');
ok(await p.locator('.sim-dock button').innerText() === 'Continue', 'and the dock says Continue');
await p.locator('.sim-dock button').tap(); await p.waitForTimeout(1100);
const strip2 = await p.evaluate(() => (document.querySelector('.sim-strip')?.innerText || '').replace(/\s+/g, ' '));
ok(strip2 === strip, 'Continue opens the room where it was left (' + strip2 + ')');
const answered = await p.evaluate(() => { const c = document.querySelector('.inject.current'); return { picked: !!c?.querySelector('.opt.picked'), open: c ? c.querySelectorAll('.opt:not([disabled])').length : -1, drill: !!c?.querySelector('.drill') }; });
ok(!answered.drill || (answered.picked && answered.open === 0), 'a decision already taken opens as answered, not to be scored twice');
const cur = await p.evaluate(() => { const c = document.querySelector('.inject.current')?.getBoundingClientRect(); const s = document.querySelector('.sim-strip')?.getBoundingClientRect(); return c && s ? { top: Math.round(c.top), strip: Math.round(s.bottom) } : null; });
ok(!!cur && cur.top >= cur.strip - 2 && cur.top < 700, 'the inject it was left on is in view under the strip (' + JSON.stringify(cur) + ')');
/* start over drops the saved place */
await back(); await p.waitForSelector('.simcard');
await p.locator('.simcard').first().tap(); await p.waitForTimeout(1300);
await p.locator('.sim-resume .btn-ghost').tap(); await p.waitForTimeout(900);
const strip3 = await p.evaluate(() => (document.querySelector('.sim-strip')?.innerText || '').replace(/\s+/g, ' '));
ok(/Inject 1 of/.test(strip3) && /Score 0/.test(strip3), 'Start over begins the room again (' + strip3 + ')');
await back(); await p.waitForSelector('.simcard');
ok(!!at && (await p.evaluate(() => document.querySelector('.simcard .pr-going')?.innerText || '')).includes(at[1] + ' of ' + at[2]), 'the saved place is kept until the new run makes a move: a slip of the thumb costs nothing');
await p.locator('.simcard').first().tap(); await p.waitForTimeout(1300);
await p.locator('.sim-resume .btn-ghost').tap(); await p.waitForTimeout(900);
await p.locator('.sim-next .btn').tap(); await p.waitForTimeout(800);
await back(); await p.waitForSelector('.simcard');
ok(/In progress . 2 of/.test(await p.evaluate(() => document.querySelector('.simcard .pr-going')?.innerText || '')), 'the first move of the new run takes its place (' + (await p.evaluate(() => document.querySelector('.simcard .pr-going')?.innerText || '')) + ')');
await p.evaluate(() => localStorage.removeItem('stepsafe-room-v1'));
/* the next part starts with no room in progress */
await nav('Ground'); await nav('The Practice'); await p.waitForSelector('.simcard');

/* ---------- 4. one decision ---------- */
const one = await p.evaluate(() => (document.querySelector('.pr-one')?.innerText || '').replace(/\s+/g, ' '));
ok(/one decision/i.test(one) && /min/i.test(one), 'The Practice offers one decision (' + one.slice(0, 80) + ')');
const oneBox = await p.evaluate(() => { const r = document.querySelector('.pr-one-go').getBoundingClientRect(); return Math.round(r.height); });
ok(oneBox >= 44, 'its button is a finger tall (' + oneBox + ')');
await p.locator('.pr-one-go').tap(); await p.waitForTimeout(1500);
const oneView = await p.evaluate(() => ({ label: document.querySelector('.sim-one .label')?.innerText || '', injects: document.querySelectorAll('.sim-one .inject').length, drills: document.querySelectorAll('.sim-one .drill').length, brief: !!document.querySelector('.sim-dock'), next: !!document.querySelector('.sim-one-next') }));
ok(/one decision/i.test(oneView.label) && oneView.injects >= 1 && oneView.drills === 1 && !oneView.brief && !oneView.next, 'it opens the room at its first call, with no brief (' + JSON.stringify(oneView) + ')');
const before = await p.evaluate(() => localStorage.getItem('stepsafe-praxis-v1'));
await p.locator('.sim-one .opt').first().tap(); await p.waitForTimeout(900);
const seen = await p.evaluate(() => { const r = document.querySelector('.sim-one .outcome').getBoundingClientRect(); return { top: Math.round(r.top), tall: Math.round(r.height), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top) }; });
ok(seen.top >= 0 && seen.top < seen.bar - 200, 'after the answer the page moves to the outcome (' + JSON.stringify(seen) + ')');
const tags = await p.evaluate(() => ({ tags: [...document.querySelectorAll('.sim-one .opt-tag')].map((t) => t.innerText.trim().toLowerCase()), onFirst: !!document.querySelector('.sim-one .opt')?.querySelector('.opt-tag') }));
ok(tags.onFirst && tags.tags.length >= 1 && tags.tags[0].startsWith('you chose') && (tags.tags.length === 1 ? tags.tags[0] === 'you chose · strongest move' : tags.tags.length === 2 && tags.tags.includes('the stronger move')), 'the options say in words which was chosen and which was strongest (' + tags.tags.join(' | ') + ')');
ok(await p.locator('.sim-one .outcome').count() === 1 && (await p.locator('.sim-one-next .btn').allInnerTexts()).join(' | ') === 'Another one | Take the whole room | Share this decision', 'the call answers with its outcome, two ways on, and its link after them');
const after = await p.evaluate(() => localStorage.getItem('stepsafe-praxis-v1'));
const rec = (x) => { const j = JSON.parse(x); return JSON.stringify([j.completedSims, j.respect, j.trust, j.awards]); };
ok(rec(before) === rec(after) && !(await p.evaluate(() => localStorage.getItem('stepsafe-room-v1'))), 'nothing is written to the record or kept as a room in progress');
const oneTitle = await p.evaluate(() => document.querySelector('.sim-one .org-line')?.innerText || '');
await p.locator('.sim-one-next .btn', { hasText: 'Another one' }).tap(); await p.waitForTimeout(1400);
const twoTitle = await p.evaluate(() => document.querySelector('.sim-one .org-line')?.innerText || '');
ok(!!twoTitle && twoTitle !== oneTitle && await y() === 0, 'Another one opens a different room at its top (' + oneTitle + ' to ' + twoTitle + ')');
await back();
ok((await p.evaluate(() => document.querySelector('.sim-one .org-line')?.innerText || '')) === oneTitle, 'Back returns to the decision before');
await p.locator('.sim-one .opt').first().tap(); await p.waitForTimeout(600);
await p.locator('.sim-one-next .btn-key').tap(); await p.waitForTimeout(1400);
ok(await p.locator('.sim-dock button').count() === 1 && !(await p.locator('.sim-one').count()), 'Take the whole room opens its brief');

/* ---------- 5. a second run is set beside the first ---------- */
const playThrough = async (which) => {
  for (let i = 0; i < 90; i++) {
    const st = await p.evaluate(() => ({ debrief: !document.querySelector('.sim-strip') && !!document.querySelector('.sim-end'), opt: !!document.querySelector('.inject.current .opt:not([disabled])'), next: !!document.querySelector('.sim-next .btn:not([disabled])') }));
    if (st.debrief) return true;
    if (st.opt) { const o = p.locator('.inject.current .opt:not([disabled])'); await (which === 'last' ? o.last() : o.first()).tap(); await p.waitForTimeout(350); continue; }
    if (st.next) { await p.locator('.sim-next .btn').tap(); await p.waitForTimeout(450); continue; }
    await p.waitForTimeout(250);
  }
  return false;
};
const finals = () => p.evaluate(() => ({ final: (document.querySelector('.chip.gold')?.innerText || '').replace(/[^0-9+-]/g, ''), clean: (/(\d+)\/(\d+)/.exec([...document.querySelectorAll('.chip.sig')].map((c) => c.innerText).join(' ')) || []).slice(1, 3).join(' of '), before: (document.querySelector('.sim-before')?.innerText || '').replace(/\s+/g, ' '), was: document.querySelectorAll('.aar-pick.was').length, trail: document.querySelectorAll('.aar').length }));
await p.locator('.sim-dock button').tap(); await p.waitForTimeout(900);
ok(await playThrough('first'), 'a room is played to its debrief');
const run1 = await finals();
ok(run1.trail > 0 && !run1.before && run1.was === 0, 'a first run has no run before it (' + run1.final + ', ' + run1.clean + ' clean)');
await p.locator('.sim-end .btn').first().tap(); await p.waitForTimeout(900);
ok(await p.locator('.sim-dock button').innerText() === 'Take the chair', 'Run it again returns to the brief, with nothing in progress');
await p.locator('.sim-dock button').tap(); await p.waitForTimeout(900);
ok(await playThrough('last'), 'the room is played again, taking the other end of each decision');
const run2 = await finals();
const said = /^The run before, on .+: ([+-]?\d+), with (\d+) of (\d+) taken cleanly\.$/.exec(run2.before);
ok(!!said && Number(said[1]) === Number(run1.final) && said[2] + ' of ' + said[3] === run1.clean, 'the second debrief names the run before with the first run\'s numbers (' + run2.before + ')');
ok(run2.was >= 1 && run2.was <= run2.trail, 'and each decision that changed shows the choice made before (' + run2.was + ' of ' + run2.trail + ')');
/* the debrief hands the run over with its room's link, and leads to a test on the chapter the room stands on */
await p.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: async (d) => { window.__run = d; } }); });
await p.locator('.sim-end .share-link').scrollIntoViewIfNeeded(); await p.locator('.sim-end .share-link').tap(); await p.waitForTimeout(400);
const runSent = await p.evaluate(() => window.__run || null);
ok(!!runSent && /#\/room\/[a-z0-9-]+$/.test(runSent.url || '') && new RegExp(': ' + String(run2.final).replace('+', '\\+') + ', \\d+ of \\d+ decisions taken cleanly\\.$').test(runSent.text || ''), 'Share this run sends the room\'s link with the score (' + (runSent && runSent.text) + ')');
await p.locator('.sim-from .btn-ghost').scrollIntoViewIfNeeded(); await p.locator('.sim-from .btn-ghost').tap(); await p.waitForTimeout(1800);
ok(await on() === 'StudyMode' && (await p.evaluate(() => location.hash)) === '#/study/test', 'Test me on this chapter opens a test in StudyMode (' + (await p.evaluate(() => (document.querySelector('#main h1, #main h2')?.innerText || '').replace(/\s+/g, ' ').slice(0, 50))) + ')');
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
ok(!(await p.evaluate(() => localStorage.getItem('stepsafe-room-v1'))) && !!(await p.evaluate(() => localStorage.getItem('stepsafe-room-last-v1'))), 'a finished room leaves no place in progress, only its choices');

/* ---------- 6. addresses ---------- */
const addr = (pg = p) => pg.evaluate(() => location.pathname + location.hash);
const openOn = (pg) => pg.evaluate(() => document.querySelector('.nav .navbtn[aria-current="page"]')?.textContent.trim().replace(/\d+$/, '') || '');
await nav('Ground');
ok((await addr()) === '/', 'Ground is the bare address (' + (await addr()) + ')');
/* one decision is on Ground too: one tap from opening the app, and it moves on once it has been taken */
const groundCall = await p.evaluate(() => { const c = document.querySelector('.pr-one'); if (!c) return null; const r = c.getBoundingClientRect(); return { label: c.querySelector('.label')?.innerText || '', title: c.querySelector('.pr-one-title')?.innerText || '', bottom: Math.round(r.bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top), go: Math.round(c.querySelector('.pr-one-go').getBoundingClientRect().height) }; });
ok(!!groundCall && /one decision/i.test(groundCall.label) && /min/i.test(groundCall.label) && groundCall.bottom <= groundCall.bar && groundCall.go >= 44, 'Ground offers one decision, whole on its first screen (' + JSON.stringify(groundCall) + ')');
await p.locator('.pr-one-go').tap(); await p.waitForTimeout(1500);
ok(await p.locator('.sim-one .drill').count() === 1 && /^\/#\/room\/[a-z0-9-]+\/one(-\d+)?$/.test(await addr()), 'and it opens that decision (' + (await addr()) + ')');
await p.locator('.sim-one .opt').first().scrollIntoViewIfNeeded(); await p.locator('.sim-one .opt').first().tap(); await p.waitForTimeout(700);
await back();
const groundNext = await p.evaluate(() => document.querySelector('.pr-one-title')?.innerText || '');
ok(await on() === 'Ground' && !!groundNext && groundNext !== groundCall.title, 'Back returns to Ground, and the card has moved on to another room (' + (groundCall && groundCall.title) + ' to ' + groundNext + ')');
await nav('Chapters');
await p.evaluate(() => { const c = [...document.querySelectorAll('#main button, #main [role=button]')].find((x) => /Ground/.test(x.innerText) && x.getBoundingClientRect().height > 60); (c || document.querySelector('#main .chapter'))?.click(); }); await p.waitForTimeout(1500);
const chapterAddr = await addr();
ok(/^\/#\/chapter\/[a-z0-9-]+$/.test(chapterAddr), 'a chapter has its own address (' + chapterAddr + ')');
const titled = await p.title();
ok(/ · StepSAFE$/.test(titled) && titled.length > 12, 'and the tab carries its name (' + titled + ')');
await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
ok((await addr()) === chapterAddr && (await h1()) === chapterTitle, 'a reload opens the same place (' + (await h1()) + ')');
await back();
ok(await on() === 'Chapters' && (await addr()) === '/#/chapters', 'and Back still walks the pages before it');

await nav('The Practice'); await p.waitForSelector('.simcard'); await p.locator('.simcard').first().tap(); await p.waitForTimeout(1300);
const roomAddr = await addr(); const roomTitle = await h1();
ok(/^\/#\/room\/[a-z0-9-]+$/.test(roomAddr), 'a room has its own address (' + roomAddr + ')');
/* its own link, handed to the share sheet on a touch screen */
await p.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: async (d) => { window.__shared = d; } }); });
await p.locator('.sim-share').tap(); await p.waitForTimeout(400);
const sharedLink = await p.evaluate(() => window.__shared || null);
ok(!!sharedLink && sharedLink.url === new URL(roomAddr, BASE).href && / · StepSAFE$/.test(sharedLink.title || ''), 'Share this room hands over the room\'s own link (' + (sharedLink && sharedLink.url) + ')');

/* the address opened cold, in a new tab */
const q = await ctx.newPage();
q.on('pageerror', (e) => errors.push('cold: ' + String(e).slice(0, 160)));
await q.goto(BASE + roomAddr, { waitUntil: 'networkidle' }); await q.waitForTimeout(2200);
const cold = await q.evaluate(() => ({ h1: (document.querySelector('#main h1')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60), dock: !!document.querySelector('.sim-dock'), addr: location.pathname + location.hash }));
ok(cold.dock && cold.h1 === roomTitle && cold.addr === roomAddr, 'the address opened in a new tab is that room (' + cold.h1 + ')');
/* typed by hand into the open tab */
await q.evaluate(() => { location.hash = '#/practice'; }); await q.waitForTimeout(1300);
ok((await openOn(q)) === 'The Practice', 'an address typed into the tab opens its page');
await q.evaluate(() => { location.hash = '#/room/no-such-room'; }); await q.waitForTimeout(1300);
const typo = { on: await openOn(q), addr: await addr(q), lost: await q.evaluate(() => /not found/i.test(document.querySelector('#main')?.innerText || '')) };
ok(typo.on === 'Ground' && typo.addr === '/' && !typo.lost, 'an address that names no room opens Ground and is put right (' + JSON.stringify(typo) + ')');
await q.goBack(); await q.waitForTimeout(1200);
ok((await openOn(q)) === 'The Practice', 'and Back from there is the page before');
await q.close();
const q2 = await ctx.newPage();
await q2.goto(BASE + '/#/step/no-such-step', { waitUntil: 'networkidle' }); await q2.waitForTimeout(2200);
ok((await openOn(q2)) === 'Ground' && (await addr(q2)) === '/', 'an address that names no Step, opened cold, is Ground too (' + (await addr(q2)) + ')');
await q2.goto(BASE + '/#/glossary/stock-and-flow', { waitUntil: 'networkidle' }); await q2.waitForTimeout(600);
await q2.reload({ waitUntil: 'networkidle' }); await q2.waitForTimeout(2600);
ok((await q2.evaluate(() => document.querySelector('#gl-term')?.textContent || '')) === 'Stock and Flow', 'a glossary entry has an address that opens it');
/* a decision out of the middle of a room has an address too: the room so far is folded above it */
await q2.goto(BASE + roomAddr + '/one-2', { waitUntil: 'networkidle' }); await q2.waitForTimeout(600);
await q2.reload({ waitUntil: 'networkidle' }); await q2.waitForTimeout(2600);
const mid = await q2.evaluate(() => ({ note: (document.querySelector('.sim-one-note')?.innerText || '').replace(/\s+/g, ' '), sofar: !!document.querySelector('.sim-sofar'), open: document.querySelector('.sim-sofar')?.open || false, said: (document.querySelector('.sim-sofar summary')?.innerText || '').replace(/\s+/g, ' '), shown: document.querySelectorAll('.sim-one > .stack > .inject').length, drills: document.querySelectorAll('.sim-one .drill').length, sum: Math.round(document.querySelector('.sim-sofar summary')?.getBoundingClientRect().height || 0) }));
ok(/^Decision 2 of \d+ in /.test(mid.note) && mid.sofar && !mid.open && /^The room so far . \d+ injects?$/.test(mid.said) && mid.shown >= 1 && mid.drills === 1 && mid.sum >= 44, 'the second decision opens by itself with the room so far folded (' + JSON.stringify(mid) + ')');
await q2.locator('.sim-sofar summary').tap(); await q2.waitForTimeout(400);
ok((await q2.evaluate(() => document.querySelectorAll('.sim-sofar[open] .inject').length)) >= 1 && (await q2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 0, 'and unfolds to the injects before it');
/* a Step has its own link to send */
await q2.goto(BASE + '/#/step/ch-foundations-stocks-and-flows', { waitUntil: 'networkidle' }); await q2.waitForTimeout(600);
await q2.reload({ waitUntil: 'networkidle' }); await q2.waitForTimeout(2600);
await q2.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: async (d) => { window.__shared = d; } }); });
await q2.locator('.share-link', { hasText: 'Share this Step' }).tap(); await q2.waitForTimeout(400);
const stepLink = await q2.evaluate(() => window.__shared || null);
ok(!!stepLink && stepLink.url === new URL('/#/step/ch-foundations-stocks-and-flows', BASE).href, 'Share this Step hands over the Step\'s own link (' + (stepLink && stepLink.url) + ')');
await q2.close();

/* someone who has never been here follows a room's address: the welcome, a handle, then that room */
const freshCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const n = await freshCtx.newPage();
n.on('pageerror', (e) => errors.push('new visitor: ' + String(e).slice(0, 160)));
await n.goto(BASE + roomAddr, { waitUntil: 'networkidle' }); await n.waitForTimeout(2500);
ok(!(await n.locator('.sim-dock').count()) && (await n.evaluate(() => /begin the praxis/i.test(document.body.innerText))), 'a new visitor meets the welcome first');
await n.evaluate(() => [...document.querySelectorAll('button')].find((x) => /begin the praxis/i.test(x.innerText))?.click()); await n.waitForTimeout(2200);
await n.fill('.ar-form input', 'Rae'); await n.locator('.ar-guise').first().tap(); await n.waitForTimeout(200);
await n.locator('.ar-form button[type=submit]').tap(); await n.waitForTimeout(3000);
const landed = await n.evaluate(() => ({ dock: !!document.querySelector('.sim-dock'), h1: (document.querySelector('#main h1')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60), addr: location.pathname + location.hash }));
ok(landed.dock && landed.h1 === roomTitle && landed.addr === roomAddr, 'and with a handle taken, lands in that room (' + JSON.stringify(landed) + ')');
await freshCtx.close();

/* ---------- 7. a sealed Step leads on ---------- */
await p.goto(BASE + '/#/step/ch-foundations-stocks-and-flows', { waitUntil: 'networkidle' }); await p.waitForTimeout(1600);
ok(await p.locator('.st-next').count() === 0, 'a Step that is not sealed does not lead on yet');
if (await p.locator('.drill .opt').count()) { await p.locator('.drill .opt').first().scrollIntoViewIfNeeded(); await p.locator('.drill .opt').first().tap(); await p.waitForTimeout(1100); }
const seal = p.locator('button', { hasText: 'Seal this Step' });
await seal.scrollIntoViewIfNeeded(); await seal.tap(); await p.waitForTimeout(1300);
const nextCard = await p.evaluate(() => { const c = document.querySelector('.st-next'); if (!c) return null; const r = c.getBoundingClientRect(); return { label: (c.querySelector('.label')?.innerText || '').trim(), title: (c.querySelector('.pr-one-title')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60), go: (c.querySelector('.pr-one-go')?.innerText || '').trim(), goH: Math.round(c.querySelector('.pr-one-go')?.getBoundingClientRect().height || 0), top: Math.round(r.top), bottom: Math.round(r.bottom), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top) }; });
ok(!!nextCard && nextCard.go === 'Next Step' && / MIN$/i.test(nextCard.label) && nextCard.title.length > 3 && nextCard.goH >= 44, 'a sealed Step shows the Step after it (' + JSON.stringify(nextCard) + ')');
ok(!!nextCard && nextCard.top >= 0 && nextCard.bottom <= nextCard.bar, 'and the page moves so the way on is whole above the tab bar');
const sealedAddr = await addr();
await p.locator('.st-next .pr-one-go').tap(); await p.waitForTimeout(1500);
ok(/^\/#\/step\/[a-z0-9-]+$/.test(await addr()) && (await addr()) !== sealedAddr && (await h1()).toLowerCase() === (nextCard ? nextCard.title.toLowerCase() : '') && await y() === 0, 'Next Step opens it at its top (' + (await addr()) + ')');
await back();
ok((await addr()) === sealedAddr && await p.locator('.st-next').count() === 1, 'Back returns to the sealed Step, which still leads on');

/* Ground's Step row opens the Step itself once its chapter is under way */
await nav('Ground');
const rowTitle = await p.evaluate(() => (document.querySelector('.watch-list li button strong')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60));
await p.locator('.watch-list li button').first().scrollIntoViewIfNeeded(); await p.locator('.watch-list li button').first().tap(); await p.waitForTimeout(1500);
ok(/^\/#\/step\/[a-z0-9-]+$/.test(await addr()) && (await addr()) !== sealedAddr && rowTitle.length > 3 && (await h1()).toLowerCase() === rowTitle.toLowerCase(), 'with a chapter under way, the Step row on Ground opens that Step (' + (await addr()) + ')');
await back();
ok(await on() === 'Ground', 'and Back returns to Ground');

/* a chapter leads to the rooms that stand on it */
await p.goto(BASE + '/#/chapter/ch-identity', { waitUntil: 'networkidle' }); await p.waitForTimeout(1600);
const chRooms = await p.evaluate(() => [...document.querySelectorAll('.ch-rooms .opt strong')].map((x) => x.innerText.trim()));
ok(chRooms.length >= 1 && /stands? on this chapter/.test(await p.evaluate(() => document.querySelector('.ch-rooms')?.innerText || '')), 'a chapter names the rooms that stand on it (' + chRooms.join(' | ') + ')');
await p.locator('.ch-rooms .opt').first().scrollIntoViewIfNeeded(); await p.locator('.ch-rooms .opt').first().tap(); await p.waitForTimeout(1500);
ok(/^\/#\/room\/[a-z0-9-]+$/.test(await addr()) && await p.locator('.sim-dock button').count() === 1, 'and one tap opens the room at its brief (' + (await addr()) + ')');
await back();
ok((await addr()) === '/#/chapter/ch-identity', 'Back returns to the chapter');

/* ---------- 8. a page opens with no request at the tap; a page whose code stalls offers a way out ---------- */
const SEEDED = () => { try { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus', motion: 'calm' })); } catch { /* about:blank */ } };
{
  /* every page's code is fetched ahead, so a chapter opens even when its file can no longer be fetched */
  const ac = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  await ac.addInitScript(SEEDED);
  const q = await ac.newPage();
  q.on('pageerror', (e) => errors.push('fetched ahead: ' + String(e).slice(0, 160)));
  await q.goto(BASE, { waitUntil: 'networkidle' });
  await q.waitForFunction(() => ['ChaptersView', 'ChapterView', 'StepView', 'PracticeView', 'SimView', 'ModuxView', 'StudyView'].every((n) => performance.getEntriesByType('resource').some((e) => e.name.includes('/assets/' + n + '-'))), null, { timeout: 30000 }).catch(() => {});
  const ahead = await q.evaluate(() => ['ChaptersView', 'ChapterView', 'StepView', 'PracticeView', 'SimView', 'ModuxView', 'StudyView'].filter((n) => performance.getEntriesByType('resource').some((e) => e.name.includes('/assets/' + n + '-'))));
  ok(ahead.length === 7, 'after Ground has drawn, the pages under the tabs are fetched ahead (' + ahead.join(' ') + ')');
  await q.route('**/assets/ChapterView-*.js', () => { /* the file can no longer be fetched */ });
  await q.evaluate(() => { location.hash = '#/chapter/ch-identity'; });
  await q.waitForTimeout(1200);
  ok(/keeper/i.test(await q.evaluate(() => document.querySelector('#main h1')?.innerText || '')), 'so a chapter opens at once, with no request at the tap');
  await ac.close();
}
{
  /* a learner saving data is not sent pages ahead; there, a page whose code stalls offers Try again */
  const sc = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  await sc.addInitScript(SEEDED);
  await sc.addInitScript(() => { try { Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }); } catch { /* the browser keeps its own */ } });
  const q = await sc.newPage();
  q.on('pageerror', (e) => errors.push('stalled page: ' + String(e).slice(0, 160)));
  await q.goto(BASE, { waitUntil: 'networkidle' }); await q.waitForTimeout(1200);
  /* the first request for the chapter's code is left unanswered, as a stalled connection leaves it; a fresh load is answered */
  let stalled = 0;
  await q.route('**/assets/ChapterView-*.js', (route) => { if (stalled++ === 0) return; route.continue(); });
  await q.evaluate(() => { location.hash = '#/chapter/ch-identity'; });
  await q.waitForTimeout(3000);
  const early = await q.evaluate(() => ({ wait: !!document.querySelector('.view-wait'), slow: !!document.querySelector('.view-slow') }));
  ok(early.wait && !early.slow, 'a page still fetching its code shows its mark and nothing more for the first seconds');
  await q.waitForTimeout(6000);
  const slow = await q.evaluate(() => { const b = document.querySelector('.view-slow button'); if (!b) return null; const r = b.getBoundingClientRect(); return { word: b.innerText.trim(), h: Math.round(r.height), top: Math.round(r.top), bar: Math.round(document.querySelector('.tabbar').getBoundingClientRect().top) }; });
  ok(!!slow && slow.word === 'Try again' && slow.h >= 44 && slow.top < slow.bar, 'after eight seconds it offers Try again (' + JSON.stringify(slow) + ')');
  await q.locator('.view-slow button').tap();
  /* a learner saving data fetches the curriculum with the page, so the fresh load takes a few seconds */
  await q.waitForFunction(() => /keeper/i.test(document.querySelector('#main h1')?.innerText || ''), null, { timeout: 20000 }).catch(() => {});
  ok((await q.evaluate(() => location.hash)) === '#/chapter/ch-identity' && /keeper/i.test(await q.evaluate(() => document.querySelector('#main h1')?.innerText || '')), 'and Try again loads the same address and opens the page');
  await sc.close();
}

ok((await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 0, 'no sideways scroll');
ok(errors.length === 0, 'no page error or console error' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
