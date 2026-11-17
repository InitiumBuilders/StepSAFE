// A visual survey of StepSAFE: every screen at its first view, then contact sheets to read them together.
//   node scripts/look/survey.mjs http://localhost:5189 <out folder>
// Nocturne at 1280 and 390 wide, Meridian and Mov at 1280. The front door is taken from a fresh visit. About 122
// screens and 13 sheets in six minutes. Start a visual round with it: on 2026-11-17 the sheets showed that every
// Modux and StudyMode tab opened on the same hero, which no single screenshot had shown.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const BASE = process.argv[2] || 'http://localhost:5189';
const OUT = process.argv[3];
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ['home', ''], ['chapters', '/chapters'], ['chapter', '/chapter/ch-foundations'],
  ['step', '/step/ch-foundations-stocks-and-flows'], ['practice', '/practice'],
  ['room', '/room/sim-halcyon-cold-vault-deception'], ['steps', '/steps'], ['unit', '/unit'], ['next', '/next'],
  ['seva', '/seva'], ['profile', '/profile'], ['settings', '/settings'], ['check', '/check'], ['trust', '/trust'],
  ['read', '/read'], ['gauges', '/models'], ['table', '/models/models'], ['systems', '/models/systems'],
  ['web', '/models/web'], ['stacks', '/models/stacks'], ['courses', '/models/courses'], ['motrus', '/models/motrus'],
  ['model', '/model/mm-identity-phishing-resistant-auth'], ['gauge', '/gauge/tr-tidewater'], ['guides', '/guides'],
  ['glossary', '/glossary/stock-and-flow'], ['study', '/study'], ['deck', '/study/deck'], ['atlas', '/study/atlas'],
  ['progress', '/study/progress'],
];
const RUNS = [
  { theme: 'nocturne', w: 1280, h: 800 }, { theme: 'nocturne', w: 390, h: 844 },
  { theme: 'meridian', w: 1280, h: 800 }, { theme: 'mov', w: 1280, h: 800 },
];

const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const shots = [];
const notes = [];
for (const run of RUNS) {
  const phone = run.w < 600;
  const c = await b.newContext({ viewport: { width: run.w, height: run.h }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  await c.addInitScript((theme) => {
    localStorage.setItem('stepsafe-praxis-v1', JSON.stringify({ onboarded: true, handle: 'R', guise: 'female', theme, mode: 'motus' }));
    localStorage.setItem('stepsafe-world-tour-v1', '1');
  }, run.theme);
  const p = await c.newPage();
  p.on('pageerror', (e) => notes.push(`${run.theme} ${run.w} pageerror: ${e.message.slice(0, 160)}`));
  p.on('console', (m) => { if (m.type() === 'error') notes.push(`${run.theme} ${run.w} console: ${m.text().slice(0, 160)}`); });
  for (const [name, path] of ROUTES) {
    await p.goto(BASE + '/#' + path, { waitUntil: 'networkidle' }).catch(() => {});
    await p.waitForTimeout(2200);
    const f = `${OUT}/${run.theme}-${run.w}-${name}.png`;
    await p.screenshot({ path: f });
    shots.push({ f, name, theme: run.theme, w: run.w, h: run.h });
  }
  await c.close();
}
// the front door, as a first visit sees it
for (const w of [1280, 390]) {
  const phone = w < 600;
  const c = await b.newContext({ viewport: { width: w, height: phone ? 844 : 800 }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  const p = await c.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' }).catch(() => {});
  await p.waitForTimeout(3500);
  const f = `${OUT}/door-${w}.png`;
  await p.screenshot({ path: f });
  shots.push({ f, name: 'door', theme: 'door', w, h: phone ? 844 : 800 });
  await c.close();
}

// contact sheets: twelve to a sheet, labelled
const sheet = async (list, file, cols, tw) => {
  const th = Math.round(tw * list[0].h / list[0].w);
  const html = `<!doctype html><html><body style="margin:0;background:#111;font:600 15px system-ui;color:#eee">
<div style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:10px;padding:10px">
${list.map((s) => `<figure style="margin:0"><img src="file:///${s.f.replace(/\\/g, '/')}" style="width:${tw}px;height:${th}px;display:block;object-fit:cover;object-position:top"><figcaption style="padding:4px 2px">${s.name} · ${s.theme} ${s.w}</figcaption></figure>`).join('\n')}
</div></body></html>`;
  const hf = file.replace(/\.png$/, '.html');
  writeFileSync(hf, html);
  const c = await b.newContext({ viewport: { width: cols * (tw + 10) + 10, height: 400 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.goto('file:///' + hf.replace(/\\/g, '/'));
  await p.waitForTimeout(800);
  await p.screenshot({ path: file, fullPage: true });
  await c.close();
};
const groups = {};
for (const s of shots) (groups[`${s.theme}-${s.w}`] ||= []).push(s);
let n = 0;
for (const [k, list] of Object.entries(groups)) {
  const phone = list[0].w < 600;
  const per = phone ? 15 : 12;
  for (let i = 0; i < list.length; i += per) {
    n++;
    await sheet(list.slice(i, i + per), `${OUT}/sheet-${k}-${i / per + 1}.png`, phone ? 5 : 4, phone ? 260 : 420);
  }
}
await b.close();
console.log(`${shots.length} screens, ${n} sheets in ${OUT}`);
console.log('errors: ' + (notes.length ? '\n  ' + [...new Set(notes)].join('\n  ') : 'none'));
