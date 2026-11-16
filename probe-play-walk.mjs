/* The gauges and the rooms, played in a real browser against the built site, on a phone and on a wide screen.
   A gauge: picking starts from the threat (what holds it, what each costs), the cards and the dock count what is
   held before a run by the rule the run uses, the run agrees with them, and the next action after a run is in
   reach. A room: the first room is on the first screen, the way in stays in reach through the brief, the room's
   strip holds under the bar with each new inject arriving beneath it, an empty unit is said outright, and the
   debrief leads to the chapter the room stands on. UNIT ONE's web answers a tap with seats a finger wide.
     node scripts/serve-dist.mjs 5189 &   then   node probe-play-walk.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const problems = [], errors = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function open(width, tag) {
  const phone = width < 600;
  const c = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  await c.addInitScript(() => { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus' })); });
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(tag + ': ' + String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(tag + ': ' + m.text().slice(0, 200)); });
  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
  const tap = (loc) => (phone ? loc.tap() : loc.click());
  const nav = async (label) => { await p.evaluate((l) => [...document.querySelectorAll('.nav button')].find((x) => x.textContent.trim().startsWith(l))?.click(), label); await p.waitForTimeout(1500); };
  return { c, p, phone, tap, nav };
}
const noSide = (p) => p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
const heldLines = (p) => p.evaluate(() => [...document.querySelectorAll('.tr-threat')].map((t) => ({ name: t.querySelector('.tr-threat-name').childNodes[0].textContent.trim(), line: t.querySelector('.gx-hold-line')?.textContent.trim() || '', covered: t.classList.contains('gx-covered') })));

for (const width of [390, 1440]) {
  const at = width < 600 ? 'phone' : 'wide';
  console.log('-- a gauge, ' + at);
  {
    const { c, p, phone, tap, nav } = await open(width, 'gauge-' + at);
    await nav('Modux');
    if (phone) {
      const tabs = await p.evaluate(() => { const t = document.querySelector('.mx-tabs').getBoundingClientRect(); return { top: Math.round(t.top), vh: innerHeight }; });
      ok(tabs.top < tabs.vh - 60, 'the hub shows its tabs on the first screen: at ' + tabs.top + ' of ' + tabs.vh);
    }
    await tap(p.locator('.gx-card-wrap button').first()); await p.waitForTimeout(2000);
    const before = await heldLines(p);
    ok(before.length >= 3 && before.every((t) => t.line === 'Nothing in its way yet' && !t.covered), 'before anything is picked, every threat says nothing is in its way (' + before.length + ' threats)');
    const opens = await p.evaluate(() => [...document.querySelectorAll('.gx-hold-open')].map((b) => Math.round(b.getBoundingClientRect().height)));
    ok(opens.length >= 3 && opens.every((h) => h >= 44), 'each threat opens to what holds it, by a control a finger can press: ' + opens.join(', '));
    await tap(p.locator('.tr-threat').first().locator('.gx-hold-open')); await p.waitForTimeout(500);
    const list = await p.evaluate(() => [...document.querySelectorAll('.gx-hold-item')].map((r) => ({ name: (() => { const s = r.querySelector('strong').cloneNode(true); s.querySelectorAll('.mt-e').forEach((e) => e.remove()); return s.textContent; })(), meta: r.querySelector('small').textContent, add: [Math.round(r.querySelector('.tr-add').getBoundingClientRect().width), Math.round(r.querySelector('.tr-add').getBoundingClientRect().height)] })));
    ok(list.length >= 1 && list.every((r) => / · costs [1-4]$/.test(r.meta)), 'the structures that hold it are listed, each with what it costs: ' + list.map((r) => r.name + ' (' + r.meta.replace(/^.* · /, '') + ')').join(', '));
    ok(list.every((r) => r.add[0] >= 44 && r.add[1] >= (phone ? 44 : 40)), 'each can be added there');
    const cost = Number(list[0].meta.match(/costs (\d)/)[1]);
    await tap(p.locator('.tr-threat').first().locator('.gx-hold-list .tr-add').first()); await p.waitForTimeout(500);
    const after = await heldLines(p);
    const heldNames = after.filter((t) => t.covered).map((t) => t.name);
    ok(after[0].line === 'Held by ' + list[0].name && after[0].covered, 'adding one, the threat says what holds it: ' + after[0].line);
    ok(after.filter((t) => t.covered).every((t) => t.line.includes(list[0].name)), 'every other threat the same structure holds says so without being opened: ' + heldNames.join(', '));
    const tray = (await p.locator('.tr-budget').innerText()).replace(/\s+/g, ' ');
    ok(new RegExp('^' + cost + ' of \\d+ spent').test(tray) && tray.includes(heldNames.length + ' of ' + after.length + ' threats held'), 'the stack counts the budget and the threats held: ' + tray);
    await tap(p.locator('.tr-threat').nth(1).locator('.gx-hold-open')); await p.waitForTimeout(400);
    ok((await p.locator('.gx-hold-list').count()) === 1, 'one threat is open at a time');
    if (phone) {
      const dock = await p.evaluate(() => { const d = document.querySelector('.tr-dock'); const cs = getComputedStyle(d); const a = (cs.backgroundColor.match(/[\d.]+/g) || []).map(Number); return { text: d.innerText.replace(/\s+/g, ' '), alpha: a.length > 3 ? a[3] : 1, pos: cs.position, btn: Math.round(d.querySelector('button').getBoundingClientRect().height) }; });
      ok(dock.pos === 'sticky' && dock.alpha === 1 && dock.btn >= 44, 'the dock is solid, so no text shows through it, and Run is a finger tall');
      ok(dock.text.includes(heldNames.length + ' of ' + after.length + ' held'), 'the dock counts what is held: ' + dock.text);
      ok(await noSide(p), 'the gauge page does not scroll sideways');
      const cw = await p.evaluate(() => { const w = document.querySelector('.tr-pool-item .tr-cost-word'); return w ? getComputedStyle(w).display : 'missing'; });
      ok(cw !== 'none' && cw !== 'missing', 'where the phone hides the cost pips, the catalog says the cost in words');
      await tap(p.locator('.tr-dock button'));
    } else {
      ok(await p.evaluate(() => getComputedStyle(document.querySelector('.tr-dock')).display === 'none'), 'a wide screen has the stack beside the catalog and no dock');
      await p.evaluate(() => [...document.querySelectorAll('button')].find((x) => /^Run the gauge/.test(x.textContent.trim()))?.click());
    }
    await p.waitForTimeout(7000);
    const run = await p.evaluate(() => [...document.querySelectorAll('.tr-threat')].map((t) => ({ name: t.querySelector('.tr-threat-name').childNodes[0].textContent.trim(), stopped: t.classList.contains('stopped'), landed: t.classList.contains('landed') })));
    ok(run.every((t) => t.stopped || t.landed) && run.filter((t) => t.stopped).map((t) => t.name).join() === heldNames.join(), 'the run stops exactly the threats the cards said were held: ' + run.filter((t) => t.stopped).map((t) => t.name).join(', '));
    const next = await p.evaluate((phone) => { const el = phone ? document.querySelector('.tr-dock') : document.querySelector('.gx-next'); const b = el?.querySelector('button'); return el && b ? { shown: getComputedStyle(el).display !== 'none', text: b.textContent.trim(), dock: el.innerText.replace(/\s+/g, ' ') } : null; }, phone);
    ok(!!next && next.shown && /^(Rebuild|Take It Up A Notch)$/.test(next.text), 'after the run the next action is in reach: ' + (next ? next.text : 'missing'));
    if (next && next.text === 'Rebuild') {
      await tap(phone ? p.locator('.tr-dock button') : p.locator('.gx-next button')); await p.waitForTimeout(1400);
      const back = await p.evaluate(() => { const nav = document.querySelector('.nav'); const cs = getComputedStyle(nav); return { build: document.querySelectorAll('.gx-hold').length, top: Math.round([...document.querySelectorAll('h2')].find((h) => /What They Will Try/.test(h.textContent))?.getBoundingClientRect().top ?? -999), bar: Math.round(cs.position === 'sticky' && cs.flexDirection === 'row' ? nav.getBoundingClientRect().bottom : 0), kept: document.querySelectorAll('.tr-threat.gx-covered').length }; });
      ok(back.build > 0 && back.top >= back.bar && back.top < back.bar + 120 && back.kept === heldNames.length, 'Rebuild returns to the threats, clear of the bar, with the stack kept: heading at ' + back.top + ' (bar ends ' + back.bar + '), ' + back.kept + ' held');
    }
    await c.close();
  }

  console.log('-- a room, ' + at);
  {
    const { c, p, phone, tap, nav } = await open(width, 'room-' + at);
    await nav('The Practice');
    const hub = await p.evaluate(() => ({ top: Math.round(document.querySelector('.simcard').getBoundingClientRect().top), vh: innerHeight, tags: [...document.querySelectorAll('.pr-next')].map((x) => x.textContent), notes: document.querySelectorAll('.pr-cold').length, bands: document.querySelectorAll('.actband').length, rooms: document.querySelectorAll('.simcard').length, perCard: document.querySelectorAll('.simcard .pr-cold, .simcard p.sec').length }));
    const wayIn = await p.evaluate(() => { const b = document.querySelector('.pr-one-go')?.getBoundingClientRect(); const bar = document.querySelector('.tabbar'); const shown = bar && getComputedStyle(bar).display !== 'none'; const lede = [...document.querySelectorAll('.pr .lede')].filter((e) => e.getBoundingClientRect().height > 0); return { bottom: b ? Math.round(b.bottom) : 9999, limit: Math.round(shown ? bar.getBoundingClientRect().top : innerHeight), ledes: lede.length, ledeTop: lede[0] ? Math.round(lede[0].getBoundingClientRect().top) : -1, top: b ? Math.round(b.top) : -1 }; });
    ok(wayIn.bottom <= wayIn.limit, 'a way into a room is whole on the first screen: its button ends at ' + wayIn.bottom + ' of ' + wayIn.limit);
    ok(wayIn.ledes === 1, 'the page says its lede once');
    if (phone) ok(wayIn.top < wayIn.ledeTop && wayIn.bottom <= 420, 'on a phone the way in comes before the explanation (button at ' + wayIn.top + ', lede at ' + wayIn.ledeTop + ')');
    else ok(hub.top < hub.vh, 'the first room is on the first screen: at ' + hub.top + ' of ' + hub.vh);
    ok(hub.tags.length === 1 && hub.tags[0] === 'Start here', 'one room is marked as the place to start');
    ok(hub.notes <= hub.bands && hub.perCard === 0, 'readiness is said once for a chapter, not on every room: ' + hub.notes + ' notes for ' + hub.rooms + ' rooms');
    await tap(p.locator('.simcard').first()); await p.waitForTimeout(1500);
    const way = await p.evaluate(() => { const d = document.querySelector('.sim-dock'), s = document.querySelector('.sim-start'); return { dock: getComputedStyle(d).display !== 'none', dockBtn: Math.round(d.querySelector('button').getBoundingClientRect().height), dockBottom: Math.round(d.getBoundingClientRect().bottom), inline: getComputedStyle(s).display !== 'none', vh: innerHeight, pageH: document.documentElement.scrollHeight }; });
    if (phone) ok(way.dock && !way.inline && way.dockBtn >= 44 && way.dockBottom <= way.vh, 'through a brief ' + Math.round(way.pageH / way.vh) + ' screens long, the way in stays at the foot of the screen');
    else ok(!way.dock && way.inline, 'a wide screen keeps the way in at the end of the brief');
    await p.evaluate(() => window.scrollTo(0, 600)); await p.waitForTimeout(200);
    await tap(phone ? p.locator('.sim-dock button') : p.locator('.sim-start')); await p.waitForTimeout(1200);
    const live = await p.evaluate(() => ({ y: Math.round(scrollY), strip: (document.querySelector('.sim-strip')?.innerText || '').replace(/\s+/g, ' ') }));
    ok(live.y === 0 && /Inject 1 of \d+/.test(live.strip) && /Score 0/.test(live.strip), 'the room opens from its top, with its clock, its count and the score: ' + live.strip);
    ok((await p.locator('.sweep').count()) === 0 || !/\(0 voices\)/.test(await p.locator('.sweep').first().innerText().catch(() => '')), 'no button offers a unit of 0 voices');
    let moves = 0, stuck = null, voiced = null;
    for (; moves < 60; moves++) {
      const st = await p.evaluate(() => ({ debrief: !document.querySelector('.sim-strip') && /DEBRIEF/.test(document.body.innerText), opt: !!document.querySelector('.inject.current .opt:not([disabled])'), next: !!document.querySelector('.sim-next .btn:not([disabled])') }));
      if (st.debrief) break;
      if (st.opt) {
        if (voiced === null) voiced = await p.evaluate(() => { const cur = document.querySelector('.inject.current'); return { sweep: cur.querySelectorAll('.sweep').length, silent: /not yet\s+filled/.test(cur.innerText) }; });
        await p.locator('.inject.current .opt:not([disabled])').first().scrollIntoViewIfNeeded(); await tap(p.locator('.inject.current .opt:not([disabled])').first()); await p.waitForTimeout(500); continue;
      }
      if (st.next) {
        await p.locator('.sim-next .btn').scrollIntoViewIfNeeded(); await tap(p.locator('.sim-next .btn')); await p.waitForTimeout(1100);
        if (moves > 2 && !stuck) stuck = await p.evaluate(() => { const s = document.querySelector('.sim-strip'), cur = document.querySelector('.inject.current'), nav = document.querySelector('.nav'); if (!s || !cur) return null; const cs = getComputedStyle(nav); const bar = cs.position === 'sticky' && cs.flexDirection === 'row' ? nav.getBoundingClientRect().bottom : 0; const r = s.getBoundingClientRect(); return { top: Math.round(r.top), bar: Math.round(bar), gap: Math.round(cur.getBoundingClientRect().top - r.bottom), y: Math.round(scrollY), end: scrollY + innerHeight >= document.documentElement.scrollHeight - 2 }; });
        continue;
      }
      await p.waitForTimeout(300);
    }
    ok(!!voiced && voiced.sweep === 0 && voiced.silent, 'with no seat filled, the room says so outright at a decision');
    ok(!!stuck && stuck.y > 0 && Math.abs(stuck.top - (stuck.bar + 8)) <= 2 && stuck.gap >= 0 && (stuck.gap <= 60 || stuck.end), 'the strip holds under the bar and the new inject arrives beneath it, as high as the page allows: strip at ' + (stuck ? stuck.top + ' (bar ends ' + stuck.bar + '), inject ' + stuck.gap + 'px under' + (stuck.end ? ', at the page end' : '') : 'not measured'));
    const deb = await p.evaluate(() => ({ y: Math.round(scrollY), from: (document.querySelector('.sim-from')?.innerText || '').replace(/\s+/g, ' '), open: document.querySelector('.sim-from button')?.textContent || '' }));
    ok(deb.y === 0 && /^FROM HERE This room stands on .+\. You have finished \d+ of its \d+ Steps\./i.test(deb.from), 'the debrief opens from its top and names the chapter the room stands on: ' + deb.from.slice(0, 90));
    await p.locator('.sim-from .btn:not(.btn-ghost)').scrollIntoViewIfNeeded(); await tap(p.locator('.sim-from .btn:not(.btn-ghost)')); await p.waitForTimeout(1500);
    const ch = await p.evaluate(() => (document.querySelector('h1')?.getAttribute('aria-label') || document.querySelector('h1')?.innerText || '').replace(/\s+/g, ' '));
    ok(!!deb.open && ch.toLowerCase().includes(deb.open.replace(/^Open /, '').toLowerCase().slice(0, 12)), 'and its button opens that chapter: ' + ch.slice(0, 60));
    ok(await noSide(p), 'no sideways scroll through the room');
    await c.close();
  }
}

console.log('-- the unit web, phone');
{
  const { c, p, tap, nav } = await open(390, 'web');
  await nav('UNIT');
  await p.locator('.unitweb').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  const web = await p.evaluate(() => { const svg = document.querySelector('.unitweb'); const vb = svg.viewBox.baseVal; const r = svg.getBoundingClientRect(); return { scale: +(r.width / vb.width).toFixed(2), seats: [...svg.querySelectorAll('g.node')].map((g) => { const b = g.getBoundingClientRect(); return Math.round(Math.min(b.width, b.height)); }), text: [...svg.querySelectorAll('g.node text')].map((t) => parseFloat(getComputedStyle(t).fontSize) * (r.width / vb.width)) }; });
  ok(web.scale >= 0.98 && web.scale <= 1.02, 'the web is drawn in the pixels of its own box, not shrunk to fit: scale ' + web.scale);
  ok(web.seats.length >= 8 && web.seats.every((s) => s >= 43.5), 'every seat is a finger wide: ' + Math.min(...web.seats) + 'px at the least');
  ok(web.text.every((s) => s >= 11.9), 'the letters in the seats are 12px or more');
  await tap(p.locator('.unitweb g.node').first()); await p.waitForTimeout(500);
  const read = (await p.locator('.webread').innerText()).replace(/\s+/g, ' ');
  ok(!/^Point at a seat/.test(read) && read.length > 20, 'a tap on a seat says what it is: ' + read.slice(0, 60));
  await c.close();
}

ok(errors.length === 0, 'no page error or console error' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
