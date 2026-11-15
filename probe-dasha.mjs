/* Dasha, the third mind, walked on the built site under its real headers (scripts/serve-dist.mjs).
   Her server is stood in for here, so the walk never spends her credits or counts on her Pulse: the page's own
   request is caught on its way out and answered with the same shapes her server sends (a status, a stream of her
   steps and words, a refusal). This holds:
     the pick offers three minds and Dasha can be chosen on a phone;
     a question goes to her host with her own command for her deeper mind, a fixed note, and nothing of the learner's;
     her answer is drawn as elements (bold, a list, code, a link that opens apart), never read as markup;
     the page says which model answered and which live sources she reached, and her suggested questions become the asks;
     a refusal shows her server's own sentence, and the next question leaves the unanswered one out;
     the site's Content-Security-Policy lets the page reach her host and reports no violation.
     node scripts/serve-dist.mjs 5189 &   then   node probe-dasha.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };

const HOST = 'https://www.dashsupport.team/api/chat';
const STATUS = { ok: true, service: 'dasha-ai', models: { flash: 'deepseek/deepseek-v4-flash-0731', pro: 'deepseek/deepseek-v4-pro-0813' }, mind: { version: 'v2.12.13 (live)', library: { skills: 47, knowledge: 15 } }, tools: ['load_skill', 'web_search', 'search_dash_docs', 'dash_governance', 'dash_platform', 'help_form_link', 'team_record', 'dash_network_stats', 'lookup_tx', 'lookup_address'] };
const REPLY = 'Keep the **owner key** offline and vote with a *separate* key.\n\n- Generate the owner key in a hardware wallet.\n- Set a voting address of its own.\n\n```\nprotx update_registrar "proTxHash" "" "votingAddress" ""\n```\n\nThe steps are in [the masternode docs](https://docs.dash.org/en/stable/docs/user/masternodes/index.html). <img src=x onerror="window.__pwned=1"> stays text.';
const sse = (evs) => evs.map((e) => 'data: ' + JSON.stringify(e) + '\n\n').join('');
const STREAM = sse([
  { t: 'start', depth: 'depth' },
  { t: 'tools', tools: ['search_dash_docs', 'dash_governance'] },
  { t: 'read' },
  { t: 'delta', text: 'Keep the **owner key** offline' },
  { t: 'done', reply: REPLY, tools: ['search_dash_docs', 'dash_governance'], depth: 'depth', next: ['How do I rotate a voting key?', 'What can the operator key do?', 'Show me the setup steps'], model: 'deepseek/deepseek-v4-pro-0813', version: 'v2.12.13' },
]);

const b = await chromium.launch({ channel: 'chrome', headless: true });
const errs = [];

async function open(w, h, mode) {
  const phone = w < 600;
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone, serviceWorkers: 'block' });
  await c.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + (e.blockedURI || '')));
    try { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'Rivka-Probe', guise: 'female', theme: 'nocturne', mode: 'motus', motion: 'calm' })); } catch { /* about:blank */ }
  });
  const p = await c.newPage();
  const sent = [];
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  p.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(t)) errs.push(t.slice(0, 160)); });
  await p.route(HOST, async (route) => {
    const req = route.request();
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, x-dasha-token', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS' };
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (req.method() === 'GET') return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(STATUS) });
    let body = {}; try { body = JSON.parse(req.postData() || '{}'); } catch { /* not json */ }
    sent.push(body);
    if (mode.refuse && mode.refuse()) return route.fulfill({ status: 429, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'You have reached the hourly message limit. Give it a little time.' }) });
    return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'text/event-stream; charset=utf-8' }, body: STREAM });
  });
  return { c, p, sent, phone };
}

/* ---------- 1. a phone: the pick, a question, the answer ---------- */
{
  const { c, p, sent } = await open(390, 844, {});
  await p.goto(BASE + '/#/seva', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const cards = await p.evaluate(() => [...document.querySelectorAll('.minds-pick .mind-card')].map((x) => { const r = x.getBoundingClientRect(); return { name: (x.querySelector('strong') || {}).innerText, w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right) }; }));
  ok(cards.length === 3 && cards.map((x) => x.name).join(' ') === 'Seva Claros Dasha', 'the pick offers three minds (' + cards.map((x) => x.name).join(', ') + ')');
  ok(cards.every((x) => x.h >= 44 && x.w >= 96 && x.right <= 390), 'each card is a finger tall and inside the screen (' + JSON.stringify(cards.map((x) => [x.w, x.h])) + ')');
  await p.locator('.mind-card.c-dasha').tap(); await p.waitForTimeout(900);
  ok(/^Dasha\.?$/.test(await p.evaluate(() => (document.querySelector('#main h1') || {}).innerText || '')), 'choosing Dasha makes her the mind on the page');
  ok(/dashsupport\.team/i.test(await p.evaluate(() => (document.querySelector('.minds-note') || {}).innerText || '')) , 'before the first question the page says where the conversation goes');
  const sees = await p.evaluate(() => (document.querySelector('.minds-sees') || {}).innerText || '');
  ok(/DeepSeek v4 pro/.test(sees) && /10 live tools/.test(sees), 'the bar says which model and tools she has, read from her server (' + sees + ')');

  const box = p.locator('.minds-compose textarea');
  await box.scrollIntoViewIfNeeded(); await box.fill('How do I keep my keys apart?');
  await p.locator('.minds-send').tap();
  await p.waitForFunction(() => !document.querySelector('.minds-wait') && document.querySelectorAll('.minds-msg.mind').length > 0, null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(500);
  const wire = sent[0] || {};
  const last = (wire.messages || []).slice(-1)[0] || {};
  ok(last.role === 'user' && last.content === '/Deep How do I keep my keys apart?', 'the question goes with her own command for her deeper mind (' + JSON.stringify(last.content) + ')');
  ok(Object.keys(wire).sort().join(',') === 'deltas,messages,project,stream', 'the request carries the conversation and one fixed note, nothing else (' + Object.keys(wire).sort().join(',') + ')');
  ok(!JSON.stringify(wire).includes('Rivka-Probe') && !/handle|respect|completed/i.test(JSON.stringify(wire)), 'nothing of the learner\'s record is sent');
  const a = await p.evaluate(() => {
    const m = [...document.querySelectorAll('.minds-msg.mind')].pop(); if (!m) return null;
    const link = m.querySelector('.minds-bubble a');
    return { strong: !!m.querySelector('.minds-bubble strong'), em: !!m.querySelector('.minds-bubble em'), li: m.querySelectorAll('.minds-ul li').length, code: !!m.querySelector('pre.minds-code code'), codeText: (m.querySelector('pre.minds-code code') || {}).innerText || '',
      href: link ? link.getAttribute('href') : null, target: link ? link.getAttribute('target') : null, rel: link ? link.getAttribute('rel') : null, img: m.querySelectorAll('img').length, pwned: !!window.__pwned,
      raw: m.innerText.includes('<img src=x'), src: (m.querySelector('.minds-src') || {}).innerText || '', stars: /\*\*|\*separate\*/.test(m.innerText) };
  });
  ok(!!a && a.strong && a.em && a.li === 2 && a.code && /protx update_registrar/.test(a.codeText) && !a.stars, 'her answer is laid out: bold, a list of two, a code block (' + JSON.stringify(a && { strong: a.strong, em: a.em, li: a.li, code: a.code, stars: a.stars }) + ')');
  ok(!!a && a.href === 'https://docs.dash.org/en/stable/docs/user/masternodes/index.html' && a.target === '_blank' && /noopener/.test(a.rel || '') && /noreferrer/.test(a.rel || ''), 'a link she gives opens apart, with no opener and no referrer');
  ok(!!a && a.img === 0 && !a.pwned && a.raw, 'markup inside her text stays text: no element is made from it');
  ok(!!a && /DeepSeek v4 pro/.test(a.src) && /the Dash docs/.test(a.src) && /the governance ballot/.test(a.src), 'under the answer: the model that wrote it and the live sources she reached (' + (a && a.src) + ')');
  /* the row begins with her two voice controls (probe-dasha-voice.mjs walks those); her suggestions follow them */
  const asks = await p.evaluate(() => [...document.querySelectorAll('.minds-ask:not(.minds-voice)')].map((x) => ({ t: x.innerText.trim(), h: Math.round(x.getBoundingClientRect().height) })));
  ok(asks.length === 3 && asks[0].t === 'How do I rotate a voting key?' && asks.every((x) => x.h >= 40), 'her suggested questions become the asks (' + asks.map((x) => x.t).join(' | ') + ')');
  ok((await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 0, 'no sideways scroll on a phone with her answer on the page');
  const pre = await p.evaluate(() => { const e = document.querySelector('pre.minds-code'); if (!e) return null; const r = e.getBoundingClientRect(), bb = e.closest('.minds-bubble').getBoundingClientRect(); return { inside: r.right <= bb.right + 1, scrolls: e.scrollWidth > e.clientWidth }; });
  ok(!!pre && pre.inside, 'a long line of code scrolls inside its own block and never widens the page (' + JSON.stringify(pre) + ')');
  ok((await p.evaluate(() => window.__csp.length)) === 0, 'the policy lets the page reach her host: no violation reported (' + (await p.evaluate(() => window.__csp.join(' | '))) + ')');

  /* the tab carries the mind; the ledger counts the ask and her live sources */
  await p.locator('.tab-more').tap(); await p.waitForTimeout(500);
  ok(await p.evaluate(() => [...document.querySelectorAll('.nav button, .nav a')].some((x) => x.textContent.trim() === 'Dasha')), 'the menu names the mind being spoken with: Dasha');
  await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300);
  const led = await p.evaluate(() => { const t = document.querySelector('.ml-tile.t-dasha'); const all = [...document.querySelectorAll('.ml-tile')]; const live = all.find((x) => /Live sources Dasha reached/.test(x.innerText)); return { n: all.length, dasha: t ? t.innerText.replace(/\s+/g, ' ') : '', live: live ? live.innerText.replace(/\s+/g, ' ') : '' }; });
  ok(led.n === 6 && /1 ask/.test(led.dasha) && /\b2\b/.test(led.live), 'the ledger keeps her asks and the live sources she reached (' + led.dasha + ' | ' + led.live + ')');
  const stored = await p.evaluate(() => { try { const r = JSON.parse(localStorage.getItem('stepsafe-praxis-v1') || '{}'); return { mind: r.mind, log: (r.dashaLog || []).length }; } catch { return null; } });
  ok(!!stored && stored.mind === 'dasha' && stored.log === 2, 'her conversation is kept on this device, apart from the others (' + JSON.stringify(stored) + ')');
  await c.close();
}

/* ---------- 2. a refusal: her server's own sentence, and the next question leaves the unanswered one out ---------- */
{
  let n = 0;
  const { c, p, sent } = await open(1280, 860, { refuse: () => ++n === 1 });
  await p.goto(BASE + '/#/seva', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.locator('.mind-card.c-dasha').click(); await p.waitForTimeout(600);
  const box = p.locator('.minds-compose textarea');
  await box.fill('First question'); await p.locator('.minds-send').click();
  await p.waitForFunction(() => !document.querySelector('.minds-wait') && document.querySelectorAll('.minds-msg.mind').length > 0, null, { timeout: 15000 }).catch(() => {});
  const un = await p.evaluate(() => { const m = [...document.querySelectorAll('.minds-msg.mind')].pop(); return m ? { text: m.innerText.replace(/\s+/g, ' '), marked: !!m.querySelector('.minds-bubble.unreached'), src: !!m.querySelector('.minds-src') } : null; });
  ok(!!un && /hourly message limit/.test(un.text) && un.marked && !un.src, 'a refusal shows her server\'s own sentence and claims no model (' + (un && un.text.slice(0, 80)) + ')');
  ok(/could not be reached/i.test(await p.evaluate(() => (document.querySelector('.minds-foot') || {}).innerText || '')), 'the foot says she could not be reached and where a person is');
  await box.fill('Second question'); await p.locator('.minds-send').click();
  await p.waitForFunction(() => document.querySelectorAll('.minds-msg.mind .minds-src').length > 0, null, { timeout: 15000 }).catch(() => {});
  const second = (sent[1] || {}).messages || [];
  ok(second.length === 1 && second[0].content === '/Deep Second question', 'the next question goes alone: the unanswered one and its notice are left out (' + second.map((m) => m.role).join(',') + ')');
  await box.fill('/human-support I need a person'); await p.locator('.minds-send').click();
  await p.waitForFunction(() => document.querySelectorAll('.minds-msg.me').length >= 3, null, { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(600);
  const third = ((sent[2] || {}).messages || []).slice(-1)[0] || {};
  ok(third.content === '/human-support I need a person', 'a request for a person is sent as written, so her server handles it itself');
  /* wide: three cards across, and the full-screen switch names all three */
  const wide = await p.evaluate(() => { const cs = [...document.querySelectorAll('.minds-pick .mind-card')].map((x) => x.getBoundingClientRect()); return { sameRow: cs.length === 3 && Math.abs(cs[0].top - cs[2].top) < 2, sameW: cs.length === 3 && Math.abs(cs[0].width - cs[2].width) < 2 }; });
  ok(wide.sameRow && wide.sameW, 'on a wide screen the three minds sit in one even row');
  ok((await p.evaluate(() => window.__csp.length)) === 0, 'no policy violation on the wide walk');
  await c.close();
}

console.log('console errors: ' + (errs.length ? errs.slice(0, 8).join(' | ') : 'none'));
ok(errs.length === 0, 'no page errors');
await b.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')' : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
