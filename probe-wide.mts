/* Nothing asks a phone to scroll sideways. Every Step, every guide, every model, stack and gauge, and every page of
   the app is opened at 390 wide in a real browser, with every fold opened, and measured: the page itself does not
   scroll sideways, and nothing inside it does either, except the few places named in ALLOWED (a row of filters
   that is one line by design, a map that is panned). A table reads as rows of labelled lines, a code block wraps,
   a chart is drawn in the width it has. Clipped content counts too: a box that hides what runs past its edge.
     node scripts/serve-dist.mjs 5189 &   then   npx tsx probe-wide.mts [base] [--list] [--only=step|guide|model|page] [--theme=nocturne|meridian|mov] */
(globalThis as any).self = globalThis;
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Initi/semble-up-citizens/node_modules/playwright-core');
const { FULL } = await import('./src/content/full');
const MX = await import('./src/content/modux/index');
const { GAUGES } = await import('./src/content/modux/gauges');
const { CHECKS } = await import('./src/content/check/index');

const args = process.argv.slice(2);
const BASE = args.find(a => /^https?:/.test(a)) || 'http://localhost:5189';
const LIST = args.includes('--list');
const ONLY = (args.find(a => a.startsWith('--only=')) || '').slice(7);
const THEME = ['meridian', 'mov'].find(t => args.includes('--theme=' + t)) || 'nocturne';
const problems: string[] = [];

/* the few places that scroll sideways on purpose: the glossary's A to Z index, StudyMode's six tabs (a third of a
   screen past the edge), Modux's seven tabs on a phone (one row since 2026-11-17, never three rows with one tab
   alone), and StudyMode's heading, whose drawn light is clipped at its edge (no words are) */
const ALLOWED = ['gl-letters', 'sg-tabs', 'mx-tabs', 'sg-hero'];

type Route = { view: string; id?: string; sub?: string };
const routes: { kind: string; name: string; route: Route }[] = [];
const allChapters = [...FULL.chapters, ...(MX.MODUX_CHAPTERS || []), ...((FULL as any).outlier ? [(FULL as any).outlier] : [])];
for (const c of allChapters) {
  routes.push({ kind: 'page', name: 'chapter ' + c.id, route: { view: 'chapter', id: c.id } });
  for (const pg of c.pages) for (const st of pg.steps) routes.push({ kind: 'step', name: st.id, route: { view: 'step', id: st.id } });
}
for (const g of FULL.guides) routes.push({ kind: 'guide', name: g.id, route: { view: 'guides', id: g.id } });
for (const m of MX.MODUX_MODELS) routes.push({ kind: 'model', name: m.id, route: { view: 'modux-model', id: m.id } });
for (const k of MX.MODUX_STACKS) routes.push({ kind: 'model', name: 'stack ' + k.id, route: { view: 'modux-stack', id: k.id } });
for (const g of GAUGES) routes.push({ kind: 'model', name: 'gauge ' + g.id, route: { view: 'modux-gauge', id: g.id } });
for (const k of CHECKS) routes.push({ kind: 'page', name: 'check ' + k.id, route: { view: 'check', id: k.id } });
for (const m of FULL.sims) routes.push({ kind: 'page', name: 'room ' + m.id, route: { view: 'sim', id: m.id } });
/* one decision of every room: its first, and one out of the middle with the room so far unfolded */
for (const m of FULL.sims) for (const sub of ['one', 'one-3']) routes.push({ kind: 'page', name: sub + ' ' + m.id, route: { view: 'sim', id: m.id, sub } });
for (const v of ['home', 'chapters', 'practice', 'guides', 'steps', 'unit', 'profile', 'next', 'seva', 'settings', 'check', 'read']) routes.push({ kind: 'page', name: v, route: { view: v } });
for (const t of ['gauges', 'systems', 'models', 'motrus', 'stacks', 'courses', 'web']) routes.push({ kind: 'page', name: 'modux ' + t, route: { view: 'modux', sub: t } });
for (const t of ['foryou', 'deck', 'test', 'atlas', 'shelf', 'progress']) routes.push({ kind: 'page', name: 'study ' + t, route: { view: 'study', sub: t } });
routes.push({ kind: 'page', name: 'glossary', route: { view: 'guides', sub: 'stock-and-flow' } });
const todo = ONLY ? routes.filter(r => r.kind === ONLY) : routes;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await ctx.addInitScript('try { if (!localStorage.getItem("stepsafe-praxis-v1")) localStorage.setItem("stepsafe-praxis-v1", JSON.stringify({ onboarded: true, handle: "R", guise: "female", theme: "' + THEME + '", mode: "motus", motion: "calm" })); } catch (e) {}');
const p = await ctx.newPage();
const errors: string[] = [];
p.on('pageerror', (e: Error) => errors.push(String(e).slice(0, 200)));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800);
/* the rest of the curriculum arrives with the first page that needs it */
await p.evaluate('[...document.querySelectorAll(".nav button")].find(x => (x.textContent || "").trim().startsWith("Chapters"))?.click()');
await p.waitForTimeout(2500);

/* sent to the page as plain script text: the TypeScript runner rewrites a function handed to evaluate() */
const go = (r: Route) => p.evaluate('window.dispatchEvent(new PopStateEvent("popstate", { state: { ss: ' + JSON.stringify(r) + ' } }))');
const MEASURE = `(() => {
  const allowed = ${JSON.stringify(ALLOWED)};
  const main = document.querySelector('#main');
  if (!main) return { over: 0, wide: [], ready: false, tables: 0, pres: 0 };
  for (const d of main.querySelectorAll('details')) d.open = true;
  const wide = [];
  for (const h of main.querySelectorAll('*')) {
    if (h.closest('svg') && h.tagName.toLowerCase() !== 'svg') continue;
    const r = h.getBoundingClientRect();
    if (r.width < 40 || r.height < 8) continue;
    const cs = getComputedStyle(h);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const extra = h.scrollWidth - h.clientWidth;
    if (extra > 8 && cs.overflowX !== 'visible') {
      const cls = typeof h.className === 'string' ? h.className : '';
      if (allowed.some(a => cls.split(/\\s+/).includes(a))) continue;
      const name = h.tagName.toLowerCase() + (cls ? '.' + cls.trim().split(/\\s+/).slice(0, 3).join('.') : '');
      wide.push((cs.overflowX === 'hidden' || cs.overflowX === 'clip' ? 'CUT ' : 'SCROLL ') + name + ' +' + extra);
    }
  }
  const doc = document.documentElement;
  return { over: doc.scrollWidth - doc.clientWidth, wide: [...new Set(wide)], ready: !document.querySelector('.view-wait') && !!main.querySelector('.view-in > *'), tables: main.querySelectorAll('table').length, pres: main.querySelectorAll('pre').length };
})()`;
const measure = (): Promise<{ over: number; wide: string[]; ready: boolean; tables: number; pres: number }> => p.evaluate(MEASURE);

const bySig = new Map<string, { n: number; where: string[]; max: number }>();
let pagesOver = 0, seen = 0, tables = 0, pres = 0;
for (const r of todo) {
  await go(r.route);
  let m = await measure();
  for (let i = 0; i < 12 && !m.ready; i++) { await p.waitForTimeout(150); m = await measure(); }
  await p.waitForTimeout(120);
  m = await measure();
  seen++; tables += m.tables; pres += m.pres;
  if (m.over > 0) { pagesOver++; problems.push(r.name + ': the page scrolls sideways by ' + m.over + 'px'); }
  for (const w of m.wide) {
    const sig = w.replace(/ \+\d+$/, '');
    const extra = Number((/\+(\d+)$/.exec(w) || [])[1] || 0);
    const e = bySig.get(sig) || { n: 0, where: [], max: 0 };
    e.n++; e.max = Math.max(e.max, extra); if (e.where.length < 4) e.where.push(r.name);
    bySig.set(sig, e);
  }
}
await browser.close();

const rows = [...bySig.entries()].sort((a, b) => b[1].n - a[1].n);
for (const [sig, e] of rows) problems.push(sig + ': on ' + e.n + ' of ' + seen + ' places, up to ' + e.max + 'px past its edge (' + e.where.join(', ') + ')');
if (errors.length) problems.push('page errors: ' + [...new Set(errors)].slice(0, 3).join(' | '));
console.log('theme ' + THEME + ' | places opened ' + seen + ' | tables ' + tables + ' | code blocks ' + pres + ' | pages that scroll sideways ' + pagesOver + ' | kinds of box that run past their edge ' + rows.length);
if (LIST) for (const [sig, e] of rows) console.log('  ' + sig + '  x' + e.n + '  max +' + e.max + '  e.g. ' + e.where.join(', '));
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
