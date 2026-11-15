/* Dasha by voice, walked on the built site under its real headers (scripts/serve-dist.mjs).
   Her chat server and her voice server are both stood in for, so the walk spends nothing: the page's own requests
   are caught on their way out and answered with the shapes her servers send. This holds:
     a reply that came with a ticket is read by her voice server: the page sends the reply's exact text, its ticket
       and a part number, plays what comes back, and asks for the next part;
     the Listen button says Stop while it plays and Listen when it ends;
     with "Read replies aloud" on, the next reply is read without a tap;
     when her voice server refuses, the page does not break (the device's own voice is the fallback);
     the two voice controls appear for Dasha and for no other mind;
     the page's policy lets it reach her voice and play the sound, and the microphone is allowed for this page only.
     node scripts/serve-dist.mjs 5189 &   then   node probe-dasha-voice.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };

const CHAT = 'https://www.dashsupport.team/api/chat', VOICE = 'https://www.dashsupport.team/api/voice';
const STATUS = { ok: true, service: 'dasha-ai', models: { flash: 'deepseek/deepseek-v4-flash-0731', pro: 'deepseek/deepseek-v4-pro-0813' }, mind: { version: 'v2.13.0 (live)', library: { skills: 56, knowledge: 22 } }, tools: ['load_skill', 'dash_platform', 'dash_chain'] };
const REPLY = 'Mainnet runs **Platform 5.0**, protocol 14.\n\nA contest fund is 0.1 DASH now.';
const TICKET = 'stand-in-ticket-0123456789abcdef';
const sse = (evs) => evs.map((e) => 'data: ' + JSON.stringify(e) + '\n\n').join('');
const STREAM = sse([
  { t: 'start', depth: 'depth', skills: ['/evo5'] }, { t: 'tools', tools: ['dash_platform'] }, { t: 'read' },
  { t: 'done', reply: REPLY, tools: ['dash_platform'], depth: 'depth', next: ['What breaks at protocol 14?'], model: 'deepseek/deepseek-v4-pro-0813', version: 'v2.13.0', say: TICKET, motion: { skills: ['/evo5'], knowledge: ['17. PLATFORM 5.0'], tools: ['dash_platform'] } },
]);
/* a quarter second of silence, as a real sound file */
function wav() {
  const n = 2000, b = Buffer.alloc(44 + n, 128);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(8000, 24); b.writeUInt32LE(8000, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34); b.write('data', 36); b.writeUInt32LE(n, 40);
  return b;
}

const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const errs = [];
async function open(mode) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  await c.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + (e.blockedURI || '')));
    try { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'Rivka-Probe', guise: 'female', theme: 'nocturne', mode: 'motus', motion: 'calm' })); } catch { /* about:blank */ }
  });
  const p = await c.newPage();
  const voice = [];
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  p.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(t)) errs.push(t.slice(0, 160)); });
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, x-dasha-token', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Expose-Headers': 'X-Voice-Parts' };
  await p.route(CHAT, async (route) => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (req.method() === 'GET') return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(STATUS) });
    return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'text/event-stream; charset=utf-8' }, body: STREAM });
  });
  await p.route(VOICE, async (route) => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    let body = {}; try { body = JSON.parse(req.postData() || '{}'); } catch { /* not json */ }
    voice.push(body);
    if (mode.refuse) return route.fulfill({ status: 503, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, voice: false, error: 'Her voice is not switched on.' }) });
    return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'audio/wav', 'X-Voice-Parts': '2' }, body: wav() });
  });
  await p.goto(BASE + '/#/seva', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  return { c, p, voice };
}
async function ask(p, q) {
  const box = p.locator('.minds-compose textarea');
  await box.scrollIntoViewIfNeeded(); await box.fill(q);
  await p.locator('.minds-send').tap();
  await p.waitForFunction(() => !document.querySelector('.minds-wait') && document.querySelectorAll('.minds-msg.mind').length > 0, null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(400);
}
const voiceButtons = (p) => p.evaluate(() => [...document.querySelectorAll('.minds-asks .minds-voice')].map((x) => x.innerText.trim()));

/* ---------- 1. her voice reads her reply ---------- */
{
  const { c, p, voice } = await open({});
  ok((await voiceButtons(p)).length === 0, 'with Seva chosen there are no voice controls');
  await p.locator('.mind-card.c-dasha').tap(); await p.waitForTimeout(800);
  const vb = await voiceButtons(p);
  ok(vb[0] === 'Read replies aloud' && vb[1] === 'Start a voice call', 'with Dasha chosen the row offers reading aloud and a voice call (' + vb.join(' | ') + ')');
  await ask(p, 'What version is Platform on?');
  ok(voice.length === 0, 'nothing is sent to her voice until the learner asks to listen');
  const src = await p.evaluate(() => { const m = [...document.querySelectorAll('.minds-msg.mind')].pop(); return m ? (m.querySelector('.minds-src') || {}).innerText || '' : ''; });
  ok(/skill \/evo5/.test(src) && /Dash Platform/.test(src), 'under the answer: the skill that led and the source she reached (' + src + ')');
  const listen = p.locator('.minds-msg.mind .minds-listen').last();
  await listen.scrollIntoViewIfNeeded(); await listen.tap();
  await p.waitForTimeout(250);
  ok((await listen.innerText()).trim() === 'Stop' && (await listen.getAttribute('aria-pressed')) === 'true', 'while her voice plays the button says Stop');
  await p.waitForFunction(() => { const x = [...document.querySelectorAll('.minds-msg.mind .minds-listen')].pop(); return x && x.getAttribute('aria-pressed') === 'false'; }, null, { timeout: 8000 }).catch(() => {});
  ok((await listen.innerText()).trim() === 'Listen', 'when the reading ends the button says Listen again');
  const v0 = voice[0] || {};
  ok(v0.text === REPLY && v0.ticket === TICKET && v0.part === 0, 'her voice server is sent the reply exactly as she wrote it, its ticket, and part 0');
  ok(Object.keys(v0).sort().join(',') === 'part,text,ticket' && !JSON.stringify(voice).includes('Rivka-Probe'), 'and nothing else: no question, nothing of the learner\'s');
  ok(voice.some((x) => x.part === 1), 'the second part is asked for too (' + voice.map((x) => x.part).join(',') + ')');

  /* reading aloud, switched on: the next reply needs no tap */
  const before = voice.length;
  await p.locator('.minds-asks .minds-voice').first().tap(); await p.waitForTimeout(200);
  ok((await voiceButtons(p))[0] === 'Reading replies aloud', 'the control says it is reading replies aloud');
  await ask(p, 'And the SDK?');
  await p.waitForTimeout(600);
  ok(voice.length > before && voice[before].part === 0, 'with reading aloud on, the new reply is read without a tap');
  ok((await p.evaluate(() => window.__csp.length)) === 0, 'no policy violation: the page may reach her voice and play it (' + (await p.evaluate(() => window.__csp.join(' | '))) + ')');
  const hdr = await (await p.request.get(BASE + '/')).headers();
  ok(/microphone=\(self\)/.test(hdr['permissions-policy'] || ''), 'the microphone is allowed for this page only (' + (hdr['permissions-policy'] || 'no header') + ')');
  await c.close();
}

/* ---------- 2. her voice server refuses: the page carries on ---------- */
{
  const { c, p, voice } = await open({ refuse: true });
  await p.locator('.mind-card.c-dasha').tap(); await p.waitForTimeout(800);
  await ask(p, 'What version is Platform on?');
  const listen = p.locator('.minds-msg.mind .minds-listen').last();
  await listen.scrollIntoViewIfNeeded(); await listen.tap();
  await p.waitForTimeout(1500);
  ok(voice.length === 1 && voice[0].part === 0, 'a refusal is asked once, not retried in a loop (' + voice.length + ')');
  ok(await p.evaluate(() => !!document.querySelector('.minds-compose textarea')), 'the page is still whole after the refusal');
  await listen.tap().catch(() => {}); await p.waitForTimeout(300);
  await c.close();
}

console.log('console errors: ' + (errs.length ? errs.slice(0, 8).join(' | ') : 'none'));
ok(errs.length === 0, 'no page errors');
await b.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')' : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
