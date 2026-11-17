// Does every word of every name in the model table fit its box whole? At each width, each cell name's and family
// label's longest word is measured in its own font against the box's content width. A word wider than its box is
// broken in two on screen. Chrome on this machine does not hyphenate, so a phone width that lists words here leans
// on the phone's own hyphenation.
//   node scripts/look/wordfit.mjs http://localhost:5189
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const b = await chromium.launch({ channel: 'chrome', headless: true });
let bad = 0;
for (const w of [360, 390, 430, 761, 1000, 1180, 1280, 1436, 1440, 1536, 1920]) {
  const phone = w < 600;
  const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: phone, hasTouch: phone });
  await c.addInitScript(() => { localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus' })); });
  const p = await c.newPage();
  await p.goto(BASE + '/#/models/models', { waitUntil: 'networkidle' }); await p.waitForTimeout(1300);
  const r = await p.evaluate(() => {
    const cv = document.createElement('canvas').getContext('2d');
    const out = [];
    let col = 0, cols = 0;
    for (const n of document.querySelectorAll('.mt-cell-n, .mt-head-n')) {
      const cs = getComputedStyle(n);
      cv.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const room = n.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      for (const word of n.textContent.split(/\s+/)) {
        const ww = cv.measureText(word).width;
        if (ww > room + 0.5) out.push(`${word} ${Math.round(ww)}>${Math.round(room)}`);
      }
    }
    const g = document.querySelector('.mt-grid');
    cols = getComputedStyle(g).gridTemplateColumns.split(' ').length;
    col = Math.round(document.querySelector('.mt-col').getBoundingClientRect().width);
    return { cols, col, broken: [...new Set(out)], sideways: document.documentElement.scrollWidth > innerWidth };
  });
  bad += r.broken.length + (r.sideways ? 1 : 0);
  console.log(`${String(w).padStart(4)} ${r.cols} across, column ${r.col}px: ${r.broken.length ? 'BROKEN ' + r.broken.join(', ') : 'every word whole'}${r.sideways ? ' SIDEWAYS' : ''}`);
  await c.close();
}
await b.close();
console.log('PROBLEMS (' + bad + ')');
