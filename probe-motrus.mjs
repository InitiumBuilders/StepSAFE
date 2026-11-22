/* The MOTRUS and Ankras proposal pages, walked in a real browser against the built site. /MOTRUS (the move) and
   /ankras (the card) are their own download and draw without the Praxis. This holds: August's lines are on the page
   exactly as he wrote them; every section is there and its scene plays once it is scrolled to; each walk-through shows
   the frame of the step being read; nothing runs off the side; every link is a finger tall and every word, the
   drawings' words included, is 12px or more; every loss names a source with a link; calm motion shows every scene's
   last frame at once; a link to a section opens there; the menu's door reaches /MOTRUS at every width; and Ground's
   first screen never fetches either page.
     node scripts/serve-dist.mjs 5189 &   then   node probe-motrus.mjs [base] */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv.slice(2).find((a) => /^https?:/.test(a)) || 'http://localhost:5189';
const problems = [];
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const HIS = {
  tagline: 'THE MOVE THAT HELPS HUMANITY BUILD MORE TRUST TOGETHER',
  meaning: 'to move safe and sound and secure and strong forward together. to move towards stronger trust together',
  ussdt: 'United Systems Security Design Team',
  soundmind: 'Your SoundMind Team',
  /* his statement, compared with runs of spaces closed up, as a browser shows it */
  teams: 'One of the worlds strongest support groups and learning labs for some of the worlds most stressful jobs and strongest systems minds. Your SoundMind Team. Sound System. Sound Mind. We learn better together. We build better with sound mind. We stay stronger and safer with better design and depth overtime. Sometimes it just helps to share the weight and lessons and insights we learn with security practitioners while also building sound mind.',
  stronger: '#StrongerOverTime',
};
const PAGES = {
  motrus: {
    path: '/MOTRUS', title: 'MOTRUS · StepSAFE', h1: 'MOTRUS',
    sections: ['gap', 'walk', 'move', 'teams', 'proof', 'holds', 'ankras', 'layers', 'industry', 'levers', 'loop', 'rewards', 'precedent', 'first', 'model', 'moves'],
    scenes: '.mt-hero-scene, .mt-gap, .mt-move, .tm-scene, .mt-proof, .df-shield, .cb-card, .mt-layers, .in-wrap, .lv, .mt-loop, .rb-flow, .pc, .mt-first, .mt-model, .mt-moves',
    waits: '.mt-rise, .mt-streams li, .mt-uses li, .mt-moves-col li, .in-moves li, .rb-kinds li, .tr-row',
    walk: 'walk',
  },
  ankras: {
    path: '/ankras', title: 'Ankras · StepSAFE', h1: 'Ankras',
    sections: ['anatomy', 'layers', 'words', 'learn', 'true', 'losses', 'results', 'rewards', 'genesis'],
    scenes: '.ak-scene, .pl, .wd, .lr, .df-shield, .ls, .rs, .rw, .gn',
    waits: '.mt-rise, .pl-layer, .wd-w, .ls-row, .rs-steps li, .gn-card',
    walk: 'anatomy',
  },
};
const seed = (motion) => { try { if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus', motion })); } catch { /* no storage on a blank page */ } };

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
async function open(w, h, path, motion) {
  const phone = w < 600;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  if (motion) await ctx.addInitScript(seed, motion);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(w + ' ' + path + ': ' + String(e).slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push(w + ' ' + path + ' console: ' + m.text().slice(0, 200)); });
  await p.goto('about:blank');
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  return { ctx, p };
}
const scenesOn = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => e.classList.contains('on')), sel);
const hidden = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.95).length, sel);

/* ---------- both pages, at a desktop and a phone ---------- */
for (const [key, P] of Object.entries(PAGES)) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { ctx, p } = await open(w, h, P.path);
    await p.waitForTimeout(900);
    const head = await p.evaluate(() => ({ title: document.title, h1: document.querySelector('h1')?.textContent.trim(), his: [...document.querySelectorAll('[data-his]')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()), praxis: !!document.querySelector('.shell, .lx'), ids: [...document.querySelectorAll('section[id]')].map((s) => s.id) }));
    ok(head.title === P.title && head.h1 === P.h1, `${key} ${w}: the page is ${P.h1} (${head.title} / ${head.h1})`);
    ok(head.his.includes(HIS.tagline) && head.his.includes(HIS.stronger), `${key} ${w}: his tagline and #StrongerOverTime, exactly as he wrote them`);
    if (key === 'motrus') {
      ok(head.his.some((t) => t.includes(HIS.meaning)), `${key} ${w}: his meaning, exactly`);
      ok(head.his.includes(HIS.ussdt) && head.his.includes(HIS.soundmind) && head.his.includes(HIS.teams), `${key} ${w}: the United Systems Security Design Team, Your SoundMind Team, and his statement for the teams, word for word`);
    }
    ok(!head.praxis, `${key} ${w}: it draws on its own, without the Praxis`);
    ok(P.sections.every((id) => head.ids.includes(id)), `${key} ${w}: every section is there (${head.ids.join(' ')})`);
    /* the walk-through shows the frame of the step being read. Its steps light on an IntersectionObserver, which runs
       with the frames, and a cold browser draws almost none at first: on 21 Nov 2026, one frame in the first second
       and 61 a second later, and the check failed on the shipped build and on a new one alike (10111111, 10011111).
       So it waits for twenty steady frames first, up to ten seconds. */
    await p.evaluate(() => new Promise((res) => {
      const t0 = performance.now(); let last = t0, run = 0;
      const f = (t) => { run = t - last < 50 ? run + 1 : 0; last = t; if (run >= 20 || t - t0 > 10000) res(run); else requestAnimationFrame(f); };
      requestAnimationFrame(f);
    }));
    const frames = await p.evaluate(async (id) => {
      const steps = [...document.querySelectorAll('#' + id + ' .wk-step')];
      const seen = [];
      for (const [i, el] of steps.entries()) {
        const r = el.getBoundingClientRect();
        const line = innerWidth <= 900 ? innerHeight * 0.65 : innerHeight * 0.47;
        window.scrollBy(0, r.top + r.height / 2 - line);
        /* wait for this step's own frame, up to 2.5 s. A fixed pause read the old frame on 2026-11-12: a browser
           that has just started drew 1 to 4 frames in its first two seconds on a laptop saving power, and this
           is the first page the walk opens. Measured then: every step lights its frame, most within 90 ms. */
        let own = false;
        for (let t = 0; t < 125 && !own; t++) {
          await new Promise((res) => setTimeout(res, 20));
          const frameOn = [...document.querySelectorAll('#' + id + ' .wk-frame')].findIndex((f) => f.classList.contains('on'));
          const stepOn = steps.findIndex((s) => s.classList.contains('on'));
          own = frameOn >= 0 ? frameOn === i : stepOn === i;
        }
        seen.push(own);
      }
      return seen;
    }, P.walk);
    ok(frames.length >= 8 && frames.every(Boolean), `${key} ${w}: each step of the walk-through shows its own frame (${frames.map((x) => (x ? 1 : 0)).join('')})`);
    for (const id of P.sections) { await p.evaluate((id) => document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'instant' }), id); await p.waitForTimeout(420); }
    await p.waitForTimeout(600);
    const on = await scenesOn(p, P.scenes);
    ok(on.length >= 8 && on.every(Boolean), `${key} ${w}: every scene has played (${on.map((x) => (x ? 1 : 0)).join('')})`);
    await p.waitForTimeout(6000);
    const m = await p.evaluate(() => {
      const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const small = [];
      for (const el of document.querySelectorAll('.mt *')) {
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        if (el.closest('.mt-sr')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        let px = parseFloat(cs.fontSize);
        const svg = el.closest('svg');
        if (svg) { const r = svg.getBoundingClientRect(); const vb = svg.viewBox.baseVal; if (vb && vb.width && r.width) px *= r.width / vb.width; }
        if (px < 12) small.push(el.textContent.trim().slice(0, 20) + ' ' + px.toFixed(1));
      }
      const tiny = [...document.querySelectorAll('.mt a, .mt button')].map((a) => { const r = a.getBoundingClientRect(); return { t: a.textContent.trim().slice(0, 20), w: r.width, h: r.height }; }).filter((t) => t.w < 44 || t.h < 44);
      return { over, small, tiny };
    });
    ok(m.over <= 0, `${key} ${w}: nothing runs off the side (${m.over})`);
    ok(m.small.length === 0, `${key} ${w}: every word is 12px or more, the drawings' words included` + (m.small.length ? ' (' + m.small.slice(0, 4).join(', ') + ')' : ''));
    ok(m.tiny.length === 0, `${key} ${w}: every link is a finger tall and wide` + (m.tiny.length ? ' (' + JSON.stringify(m.tiny.slice(0, 3)) + ')' : ''));
    const waiting = await hidden(p, P.waits);
    ok(waiting === 0, `${key} ${w}: every line that waits for its scene is in full view once the scene has played (${waiting} not)`);
    if (key === 'motrus') {
      const d = await p.evaluate(() => ({
        rules: document.querySelectorAll('#holds .df-rows li').length, gates: document.querySelectorAll('#holds .df-gate').length,
        rungs: document.querySelectorAll('#levers .lv-rung').length, lit: document.querySelectorAll('#levers .lv-rung.lit').length,
        rings: [...document.querySelectorAll('#precedent .pc-item')].map((f) => f.querySelectorAll('.pc-dot').length),
        sources: [...document.querySelectorAll('#precedent .pc-src a, #levers .mt-src')].map((a) => a.href),
      }));
      ok(d.rules === 8 && d.gates === 8, `${key} ${w}: eight attacks, eight gates (${d.rules} rules, ${d.gates} gates)`);
      ok(d.rungs === 12 && d.lit === 6, `${key} ${w}: twelve places to intervene, six lit (${d.lit} of ${d.rungs})`);
      ok(d.rings.join(' ') === '11 55 5', `${key} ${w}: the thresholds are 11, 55 and 5 (${d.rings.join(' ')})`);
      ok(d.sources.length === 3 && d.sources.every((u) => u.startsWith('https://')), `${key} ${w}: the treaties and Meadows link their sources (${d.sources.length})`);
    }
    if (key === 'ankras') {
      ok(await p.evaluate(() => document.querySelectorAll('#true .df-rows li').length === 4 && document.querySelectorAll('#true .df-gate').length === 4), `${key} ${w}: four attacks on a card, four gates`);
      const facts = await p.evaluate(() => ({
        words: document.querySelectorAll('.wd-w').length, shared: document.querySelectorAll('.wd-w.wd-on').length,
        sources: [...document.querySelectorAll('.ls-src a')].map((a) => a.href),
        genesis: [...document.querySelectorAll('.gn-card .mt-card-name')].map((e) => e.textContent.trim()),
      }));
      ok(facts.words === 16 && facts.shared === 9, `${key} ${w}: sixteen words, nine marked as already on Intuition (${facts.shared} of ${facts.words})`);
      ok(facts.sources.length >= 4 && facts.sources.every((u) => u.startsWith('https://')), `${key} ${w}: every loss links its source (${facts.sources.length} links)`);
      ok(facts.genesis.join(' ') === 'Ankras MOTRUS', `${key} ${w}: the two genesis cards (${facts.genesis.join(', ')})`);
    }
    await ctx.close();
  }
}

/* ---------- calm motion: every scene shows its last frame at once, without a scroll ---------- */
for (const [key, P] of Object.entries(PAGES)) {
  const { ctx, p } = await open(390, 844, P.path, 'calm');
  await p.waitForTimeout(500);
  const on = await scenesOn(p, P.scenes);
  const still = await p.evaluate((sel) => ({ motion: document.documentElement.dataset.motion, hidden: [...document.querySelectorAll(sel)].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.95).length, running: document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity).length }), P.waits);
  ok(still.motion === 'calm' && on.every(Boolean) && still.hidden === 0, `${key} calm: every scene is whole at once, nothing waits for a scroll (${JSON.stringify({ ...still, on: on.filter(Boolean).length + ' of ' + on.length })})`);
  ok(still.running === 0, `${key} calm: nothing loops (${still.running} running)`);
  await ctx.close();
}

/* ---------- a link to a section opens there; /ankras is the card's own page ---------- */
for (const [path, id] of [['/MOTRUS#walk', 'walk'], ['/ankras#rewards', 'rewards']]) {
  const { ctx, p } = await open(1440, 900, path);
  await p.waitForTimeout(1200);
  const at = await p.evaluate((id) => ({ top: Math.round(document.getElementById(id).getBoundingClientRect().top), y: Math.round(scrollY) }), id);
  ok(at.y > 400 && Math.abs(at.top) <= 4, `${path} opens at #${id} (${JSON.stringify(at)})`);
  await ctx.close();
}

/* ---------- the door in the Praxis menu ---------- */
for (const [w, h] of [[1440, 900], [900, 800], [390, 844]]) {
  const { ctx, p } = await open(w, h, '/', 'calm');
  await p.waitForTimeout(1800);
  if (w < 600) { await p.locator('.tab-more').tap(); await p.waitForTimeout(600); }
  const d = await p.evaluate(() => {
    const shown = [...document.querySelectorAll('.nav-motrus')].filter((a) => a.getBoundingClientRect().height > 0);
    const a = shown[0]; if (!a) return { n: 0 };
    const r = a.getBoundingClientRect(); const n = document.querySelector('.nav');
    return { n: shown.length, h: Math.round(r.height), w: Math.round(r.width), bottom: Math.round(r.bottom), right: Math.round(r.right), font: parseFloat(getComputedStyle(a).fontSize), href: a.getAttribute('href'), label: a.textContent.trim(), fits: n.scrollHeight <= n.clientHeight + 1, vh: innerHeight, vw: innerWidth };
  });
  const tall = w < 600 ? 50 : w <= 1080 ? 44 : 50;
  ok(d.n === 1 && d.href === '/MOTRUS' && d.label === 'MOTRUS' && d.h >= tall && d.w >= 44 && d.font >= 16, w + ': one door to MOTRUS in the menu, a finger tall, its word 16px (' + JSON.stringify(d) + ')');
  ok(d.bottom <= d.vh && d.right <= d.vw, w + ': the door is on the first screen of the menu');
  if (w < 600) ok(d.fits, w + ': the sheet still fits without scrolling');
  await p.locator('.nav-motrus:visible').first().click();
  await p.waitForURL(/\/MOTRUS$/, { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(800);
  const went = await p.evaluate(() => ({ path: location.pathname, h1: document.querySelector('h1')?.textContent.trim() }));
  ok(went.path === '/MOTRUS' && went.h1 === 'MOTRUS', w + ': the door opens the page (' + JSON.stringify(went) + ')');
  await ctx.close();
}

/* ---------- Ground's first screen never fetches the pages ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await ctx.addInitScript(seed, 'calm');
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }); } catch { /* the browser keeps its own */ } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  const asked = await p.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name).filter((n) => /\/assets\/[^/]+\.(js|css)$/.test(n)).map((n) => n.split('/assets/')[1]));
  ok(!asked.some((n) => /^mount-/.test(n)), 'Ground\'s first screen does not fetch the MOTRUS or Ankras page (' + asked.filter((n) => /mount|Mark/.test(n)).join(' ') + ')');
  await ctx.close();
}

ok(errors.length === 0, 'no page error or console error' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
await browser.close();
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
