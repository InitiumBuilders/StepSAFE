/* /PAXT walked on the built site (scripts/serve-dist.mjs), on a phone and wide, and the changes it brought to
   /MOTRUS and /ankras. This holds:
     the page opens under its own name and is as wide as the screen, with nothing spilling;
     the bench is real: the hash on the page is the reference hash, a changed word changes the hash and the line,
       the draft can be put back, Leave writes the leave line, and Copy puts the line on the clipboard;
     /telepaxt opens the room; the three pages name each other; Parts lists every part and takes you there;
     on /MOTRUS the first move now follows the walk and a door leads to /PAXT; /ankras links held evidence;
     under calm motion every figure shows its last frame; no page error, no policy violation.
     node scripts/serve-dist.mjs 5189 &   then   node probe-paxt-walk.mjs [base] */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const V = JSON.parse(readFileSync(new URL('./scripts/paxt-vectors.json', import.meta.url), 'utf8'));
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const b = await chromium.launch({ channel: 'chrome', headless: true });
const errs = [];

async function open(w, h, path, opts = {}) {
  const phone = w < 600;
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone, serviceWorkers: 'block', permissions: ['clipboard-read', 'clipboard-write'] });
  await c.addInitScript((calm) => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + (e.blockedURI || '')));
    if (calm) { try { localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', motion: 'calm' })); } catch { /* blank */ } }
  }, !!opts.calm);
  const p = await c.newPage();
  p.on('pageerror', (e) => errs.push(path + ': ' + e.message.slice(0, 160)));
  p.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(t)) errs.push(path + ': ' + t.slice(0, 160)); });
  await p.goto(BASE + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  return { c, p, phone };
}
const over = (p) => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const wider = (p) => p.evaluate(() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('main *, header *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > W + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 4).map((e) => e.tagName + '.' + String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).slice(0, 30)); });

/* ---------- 1. a phone ---------- */
{
  const { c, p } = await open(390, 844, '/PAXT');
  ok((await p.title()) === 'PAXT \u00b7 StepSAFE' && (await p.evaluate(() => document.querySelector('h1').innerText.trim())) === 'PAXT', 'the page opens under its own name');
  ok((await over(p)) <= 0, 'no sideways scroll on a phone');
  const out = await wider(p);
  ok(out.length === 0, 'nothing reaches past the screen\'s edge (' + out.join(', ') + ')');
  const nav = await p.evaluate(() => [...document.querySelectorAll('.mt-top-link')].map((a) => ({ t: a.innerText.trim(), href: a.getAttribute('href'), h: Math.round(a.getBoundingClientRect().height), right: Math.round(a.getBoundingClientRect().right) })));
  ok(nav.map((n) => n.t).join(' ') === 'MOTRUS Ankras StepSAFE' && nav.every((n) => n.h >= 44 && n.right <= 390), 'the bar names the other two pages and the way back, each a finger tall and on the screen (' + nav.map((n) => n.t + ' ' + n.right).join(', ') + ')');

  /* the bench */
  await p.evaluate(() => document.getElementById('line').scrollIntoView()); await p.waitForTimeout(700);
  const read = () => p.evaluate(() => ({ hash: (document.querySelector('.px-hash-v') || {}).innerText || '', line: (document.querySelector('.px-line-v') || {}).innerText || '', state: (document.querySelector('.px-state') || {}).innerText || '', reset: !!document.querySelector('.px-doc-foot .mt-btn') }));
  let s = await read();
  ok(s.hash === V.digest && s.line === V.join && !s.reset, 'the bench shows the draft\'s own hash and the join line, as the reference computes them');
  const fontSize = await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.px-text')).fontSize));
  ok(fontSize >= 16, 'the document is typed at 16px or more, so a phone does not zoom in on it (' + fontSize + ')');
  await p.locator('.px-text').fill(V.doc.replace('111 votes', '11 votes'));
  await p.waitForFunction((d) => (document.querySelector('.px-hash-v') || {}).innerText !== d, V.digest, { timeout: 5000 }).catch(() => {});
  s = await read();
  ok(s.hash !== V.digest && /^[0-9a-f]{64}$/.test(s.hash) && s.line !== V.join && s.line.startsWith('paxt1 dash-keys-apart join ' + s.hash.slice(0, 32)) && /different document/.test(s.state) && s.reset, 'one changed word gives another hash and another line, and the page says it is a different document');
  await p.locator('.px-text').fill('hello');
  await p.waitForTimeout(400);
  ok(await p.evaluate(() => !!document.querySelector('.px-errors') && !document.querySelector('.px-line-v')), 'text that is not a PAXT document gets no line, and the page says why');
  await p.locator('.px-doc-foot .mt-btn').tap();
  await p.waitForFunction((d) => (document.querySelector('.px-hash-v') || {}).innerText === d, V.digest, { timeout: 5000 }).catch(() => {});
  s = await read();
  ok(s.hash === V.digest && s.line === V.join && !s.reset, 'the draft can be put back');
  await p.locator('.px-choice-b', { hasText: 'Leave' }).tap(); await p.waitForTimeout(200);
  ok((await read()).line === V.leave, 'Leave writes the leave line');
  await p.locator('.px-copy').tap(); await p.waitForTimeout(400);
  const clip = await p.evaluate(() => navigator.clipboard.readText().catch(() => null));
  ok(clip === V.leave, 'Copy puts exactly that line on the clipboard');
  const tall = await p.evaluate(() => [...document.querySelectorAll('#line button')].map((x) => Math.round(x.getBoundingClientRect().height)));
  ok(tall.every((h) => h >= 44), 'every button on the bench is a finger tall (' + tall.join(', ') + ')');

  /* the strip shows the share of the list */
  const strip = await p.evaluate(() => ({ n: document.querySelectorAll('.px-strip i').length, on: document.querySelectorAll('.px-strip i.on').length }));
  ok(strip.n === 62 && strip.on === 48, 'the strip lights 48 of 62, the share of masternodes that keep the voting key apart');

  /* Parts */
  await p.locator('.mt-parts-btn').tap(); await p.waitForTimeout(400);
  const parts = await p.evaluate(() => [...document.querySelectorAll('.mt-parts-list a')].map((a) => ({ t: a.innerText.replace(/\s+/g, ' ').trim(), h: Math.round(a.getBoundingClientRect().height), href: a.getAttribute('href') })));
  const secs = await p.evaluate(() => document.querySelectorAll('main section[id]').length);
  ok(parts.length === secs && parts.length === 10 && parts.every((x) => x.h >= 44), 'Parts lists every part of the page, each a finger tall (' + parts.length + ' of ' + secs + ')');
  const box = await p.evaluate(() => { const r = document.querySelector('.mt-parts-list').getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top) }; });
  ok(box.l >= 0 && box.r <= 390 && box.t >= 0, 'the list sits inside the screen');
  await p.locator('.mt-parts-list a[href="#held"]').tap(); await p.waitForTimeout(700);
  const at = await p.evaluate(() => ({ top: Math.round(document.getElementById('held').getBoundingClientRect().top), open: !!document.querySelector('.mt-parts-list'), hash: location.hash }));
  ok(Math.abs(at.top) < 120 && !at.open && at.hash === '#held', 'a part\'s name takes you to it and the list closes');
  ok((await p.evaluate(() => window.__csp.length)) === 0, 'no policy violation on the page');
  const tiny = await p.evaluate(() => [...document.querySelectorAll('.mt a, .mt button')].map((a) => { const r = a.getBoundingClientRect(); return { t: a.textContent.trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) }; }).filter((t) => t.w < 44 || t.h < 44));
  ok(tiny.length === 0, 'every link and button on the page is a finger tall and wide' + (tiny.length ? ' (' + JSON.stringify(tiny.slice(0, 4)) + ')' : ''));
  await c.close();
}

/* ---------- 2. /telepaxt, wide, and the keyboard ---------- */
{
  const { c, p } = await open(1280, 860, '/telepaxt');
  await p.waitForTimeout(1500);
  const t = await p.evaluate(() => ({ path: location.pathname + location.hash, top: Math.round(document.getElementById('telepaxt').getBoundingClientRect().top), h2: document.querySelector('#telepaxt h2').innerText }));
  ok(t.path === '/PAXT#telepaxt' && Math.abs(t.top) < 140 && /Telepaxt/.test(t.h2), '/telepaxt opens the room (' + t.path + ')');
  ok((await over(p)) <= 0 && (await wider(p)).length === 0, 'wide: nothing spills');
  await p.locator('.mt-parts-btn').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  const opened = await p.evaluate(() => !!document.querySelector('.mt-parts-list'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  ok(opened && await p.evaluate(() => !document.querySelector('.mt-parts-list') && document.activeElement === document.querySelector('.mt-parts-btn')), 'Parts opens from the keyboard, and Escape closes it and returns the focus');
  const links = await p.evaluate(() => [...document.querySelectorAll('main a[target="_blank"]')].map((a) => ({ href: a.getAttribute('href'), rel: a.getAttribute('rel') || '' })));
  ok(links.length >= 8 && links.every((l) => /^https:\/\//.test(l.href) && /noopener/.test(l.rel) && /noreferrer/.test(l.rel)), 'every source opens apart, with no opener and no referrer (' + links.length + ' links)');
  await c.close();
}

/* ---------- 3. calm motion: the last frame ---------- */
{
  const { c, p } = await open(390, 844, '/PAXT', { calm: true });
  await p.waitForTimeout(600);
  const f = await p.evaluate(() => { const op = (sel) => [...document.querySelectorAll(sel)].map((e) => parseFloat(getComputedStyle(e).opacity)); return { nodes: op('.px-node'), doc: op('.px-doc'), threads: [...document.querySelectorAll('.px-thread')].map((e) => getComputedStyle(e).transform), layers: op('.px-layer') }; });
  ok(f.nodes.length === 21 && f.nodes.every((o) => o === 1) && f.doc[0] === 1 && f.threads.every((t) => t === 'none' || /matrix\(1, 0, 0, 1/.test(t)), 'under calm motion the hero shows its last frame: every member, the text and all three threads');
  await p.evaluate(() => document.getElementById('first').scrollIntoView()); await p.waitForTimeout(500);
  ok((await p.evaluate(() => [...document.querySelectorAll('.px-strip i')].every((e) => parseFloat(getComputedStyle(e).opacity) === 1))), 'and the strip is whole');
  await c.close();
}

/* ---------- 4. what changed on /MOTRUS and /ankras ---------- */
{
  const { c, p } = await open(390, 844, '/MOTRUS');
  const order = await p.evaluate(() => [...document.querySelectorAll('main section[id]')].map((s) => s.id));
  ok(order.indexOf('first') === order.indexOf('walk') + 1 && order.indexOf('first') < order.indexOf('move'), 'on /MOTRUS the first move follows the walk (' + order.slice(0, 5).join(', ') + ')');
  const door = await p.evaluate(() => { const a = document.querySelector('#paxt a.mt-btn'); return a ? { href: a.getAttribute('href'), h: Math.round(a.getBoundingClientRect().height) } : null; });
  ok(!!door && door.href === '/PAXT' && door.h >= 44, 'and a door leads to /PAXT');
  ok((await p.evaluate(() => [...document.querySelectorAll('.mt-top-link')].map((a) => a.innerText.trim()).join(' '))) === 'Ankras PAXT StepSAFE', 'its bar names Ankras, PAXT and the way back');
  ok((await over(p)) <= 0, '/MOTRUS still has no sideways scroll');
  await p.locator('.mt-parts-btn').tap(); await p.waitForTimeout(300);
  ok((await p.evaluate(() => document.querySelectorAll('.mt-parts-list a').length)) === order.length, 'Parts lists all ' + order.length + ' parts of /MOTRUS');
  await c.close();
  const a = await open(390, 844, '/ankras');
  const held = await a.p.evaluate(() => { const x = document.querySelector('#rewards a[href="/PAXT#held"]'); return x ? x.innerText.trim() : null; });
  ok(held === 'Held Evidence Earns Again', '/ankras links held evidence from its rewards');
  ok((await over(a.p)) <= 0 && !!(await a.p.$('.mt-parts-btn')), '/ankras has Parts and no sideways scroll');
  await a.c.close();
}

console.log('console errors: ' + (errs.length ? errs.slice(0, 8).join(' | ') : 'none'));
ok(errs.length === 0, 'no page errors');
await b.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')' : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
