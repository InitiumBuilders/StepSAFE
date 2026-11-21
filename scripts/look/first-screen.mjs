// What the first screen asks for under two builds, side by side, on DevTools' "Fast 3G": requests, kilobytes over
// the wire, first paint, load, and the scripts by name. A first visit (the Lander) and a returning learner (Ground),
// at 390 and 1440 wide, three runs each with the median kept. Service workers are blocked, so every run is a cold one.
//   node scripts/look/first-screen.mjs <old base> <new base>      for example the shipped build on 5194 and a trial on 5195
// Written 21 Nov 2026 for the Vite 8 trial: Rolldown made Ground's first screen 48 requests where Rollup made 15, and
// it painted about 240 ms later. Run it on any change to vite.config.ts or the bundler before a gate.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const [OLD, NEW] = process.argv.slice(2);
if (!OLD || !NEW) { console.error('give two base addresses: node scripts/look/first-screen.mjs <old> <new>'); process.exit(2); }
const b = await chromium.launch({ channel: 'chrome', headless: true });
const med = (xs) => xs.slice().sort((x, y) => x - y)[Math.floor(xs.length / 2)];
async function once(base, w, h, learner) {
  const phone = w < 600;
  const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone, serviceWorkers: 'block' });
  if (learner) await c.addInitScript(() => { try { localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus' })); } catch { /* no storage on a blank page */ } });
  const p = await c.newPage();
  const cdp = await c.newCDPSession(p);
  await cdp.send('Network.enable');
  /* DevTools' "Fast 3G": 1.6 Mbps down, 750 kbps up, 562.5 ms of latency, in bytes a second */
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 562.5, downloadThroughput: 1.6 * 1024 * 1024 / 8 * 0.9, uploadThroughput: 750 * 1024 / 8 * 0.9 });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const res = performance.getEntriesByType('resource').filter((e) => e.name.startsWith(location.origin));
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return {
      n: res.length + 1,
      kb: Math.round(res.reduce((s, e) => s + (e.transferSize || 0), nav.transferSize || 0) / 1024),
      fcp: Math.round(fcp ? fcp.startTime : -1), load: Math.round(nav.loadEventEnd),
      js: res.filter((e) => /\.js$/.test(e.name)).map((e) => e.name.split('/assets/')[1].replace(/-[A-Za-z0-9_-]{8}\.js$/, '')),
    };
  });
  await c.close();
  return r;
}
for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const learner of [false, true]) {
    console.log(w + 'x' + h + ' ' + (learner ? 'Ground (a returning learner)' : 'the Lander (a first visit)'));
    for (const [label, base] of [['old', OLD], ['new', NEW]]) {
      const runs = [];
      for (let i = 0; i < 3; i++) runs.push(await once(base, w, h, learner));
      console.log('  ' + label + ': ' + med(runs.map((x) => x.n)) + ' requests, ' + med(runs.map((x) => x.kb)) + ' KB, first paint ' + med(runs.map((x) => x.fcp)) + ' ms, load ' + med(runs.map((x) => x.load)) + ' ms');
      console.log('    scripts: ' + runs[0].js.join(' '));
    }
  }
}
await b.close();
