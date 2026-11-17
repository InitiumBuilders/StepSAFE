// Three pictures of StepSAFE's 3D world (the Signing Screen gauge: its whole view twice, then The keystone), for a
// before and after comparison, as when three.js went from 0.169 to 0.187 on 2026-11-17.
//   node scripts/look/world-shot.mjs <base> <output prefix> [--gpu | --sw]
// --gpu uses this machine's GPU (Intel Arc: the world's tier 1), --sw the software renderer (tier 0). It enters the
// world the way probe-csp does, logs the GPU the page sees, and lists console errors and warnings. Production is
// the before when the change is local.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const OUT = process.argv[3];
const gpuArgs = process.argv.includes('--gpu') ? ['--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist'] : process.argv.includes('--sw') ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [];
const b = await chromium.launch({ channel: 'chrome', headless: true, args: gpuArgs });
const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
await c.addInitScript(() => {
  if (!localStorage.getItem('stepsafe-praxis-v1')) localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme: 'nocturne', mode: 'motus' }));
  localStorage.setItem('stepsafe-world-tour-v1', '1');
});
const p = await c.newPage();
const notes = [];
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') notes.push(m.type() + ': ' + m.text().slice(0, 220)); });
p.on('pageerror', (e) => notes.push('pageerror: ' + e.message.slice(0, 220)));
const clickText = async (re) => p.evaluate((src) => {
  const r = new RegExp(src, 'i');
  const el = [...document.querySelectorAll('button, a, [role=button], [role=tab]')].find((e) => r.test((e.textContent || '').trim()));
  if (el) { el.click(); return true; }
  return false;
}, re.source);
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
const gpu = await p.evaluate(() => {
  const gl = document.createElement('canvas').getContext('webgl2');
  const d = gl && gl.getExtension('WEBGL_debug_renderer_info');
  return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'none';
});
console.log('gpu: ' + gpu);
console.log('models: ' + await clickText(/^\s*Modux Models\s*$/)); await p.waitForTimeout(1500);
await p.getByText(/The Signing Screen/).first().click({ timeout: 5000 }).catch(() => console.log('no Signing Screen link'));
await p.waitForTimeout(2000);
console.log('world: ' + await clickText(/Enter the world|Build and enter the world/));
await p.waitForTimeout(9000);
await p.screenshot({ path: OUT + '-a.png' });
await p.waitForTimeout(4000);
await p.screenshot({ path: OUT + '-b.png' });
console.log('keystone: ' + await clickText(/^\s*The keystone\s*$/));
await p.waitForTimeout(3500);
await p.screenshot({ path: OUT + '-c.png' });
console.log('tier kept: ' + await p.evaluate(() => localStorage.getItem('stepsafe-world-tier')));
console.log('console: ' + (notes.length ? '\n  ' + [...new Set(notes)].join('\n  ') : 'none'));
await b.close();
