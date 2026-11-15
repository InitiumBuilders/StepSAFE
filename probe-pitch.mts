/* The welcome page, held to its word: every number it shows still matches the content, the demo system
   still builds and reads, August's lines appear exactly as he wrote them, and the page's own copy keeps
   the house rules (no dashes).
   Run: npx tsx probe-pitch.mts */
(globalThis as any).self = globalThis;
import { readFileSync } from 'node:fs';
const { buildPitch } = await import('./scripts/pitch-gen.mts');
const { PITCH } = await import('./src/content/pitch');
const { MODUX_MODELS } = await import('./src/content/index');
const own = await import('./src/content/modux/own');
const { DEMO_SPEC, DEMO_NAME } = await import('./src/content/pitch-demo');
const C = await import('./src/lib/claros');

const problems: string[] = [];
const bad = (m: string) => problems.push(m);

/* 1. the numbers */
const now = await buildPitch();
const a = JSON.stringify(now), b = JSON.stringify(PITCH);
if (a !== b) {
  const keys = Object.keys(now).filter(k => JSON.stringify((now as any)[k]) !== JSON.stringify((PITCH as any)[k]));
  bad('content/pitch.ts has drifted from the content in: ' + keys.join(', ') + ' (run npx tsx scripts/pitch-gen.mts)');
}

/* 2. the demo system */
const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const g = own.buildOwnGauge(DEMO_SPEC, byId);
if (!g) bad('the demo system no longer builds into a gauge');
else {
  if (g.threats.length < 4) bad('the demo system carries fewer than four pressures: ' + g.threats.length);
  const r = C.readFocus({ key: 'demo:civic', name: DEMO_NAME, kind: 'own', gauge: g }, byId);
  if (!r.R.keystone) bad('the demo system has no keystone');
  if (!r.hard.lessons.length) bad('the demo system has no plan for the hardest day');
  if (r.hard.hardest <= r.hard.start) bad('the demo plan does not keep more of the hardest day');
  const t = C.clarosAnswer('Where should I harden first?', r);
  if (!/^Harden a civic platform/.test(t)) bad('Claros reads the demo name oddly: ' + t.slice(0, 60));
  console.log('demo: keystone ' + r.nameOf(r.R.keystone || '') + ' | hardest day ' + r.hard.start.toFixed(1) + ' -> ' + r.hard.hardest.toFixed(1));
}

/* 3. his words, exactly */
const page = readFileSync('src/views/Lander.tsx', 'utf8');
const HIS = [
  'Secure By Systems Design',
  'Sound System.',
  'Sound Mind.',
  'See The System.',
  'Build Sound Mind.',
  'Trust But Verify',
  'Trust But Derive',
  'Take It Up A Notch',
  'Do. It.',
  'Right.',
  'Meet Your Outlier Systems Security Steward Claros.SI',
  'Powered By ASense.si',
  'STEP.',
  'STRONG.',
  'Trust By Systems Design',
  'Trust Built Sound And Stronger Over Time',
  'August JDZ',
  'Strategic Systems Intelligence Agency. Solutions For The Data Backed World.',
  'Learn Systems Thinking. Build A Career In It.',
  'Not what a model knows. Where it chooses to push.',
  'STEP SAFE',
  'Trust Your Systems Sense And Your Systems Mind',
  'Stronger systems stronger world. Stay SOUND.',
  'An Outlier.Systems Security Project Dedicated And Shaped For The Dash DAO. AND With .:Waves In Mind.',
  '~AjD',
  '10/19/2026',
  '#DashDrives',
  'https://Dash.ORG',
  'StepSAFE :: The Praxis',
];
for (const line of HIS) if (!page.includes(line)) bad('his line is missing or changed: ' + line);
/* the versions he has since changed stay retired */
for (const line of ['Secure By Deep Design', 'Trust Built Sound Over Time', 'Powered By ASense.SI', '>Trust Your Systems Mind<', 'Shaped For The Dash DAO.<']) if (page.includes(line)) bad('a retired line came back: ' + line);

/* 4. the page's own copy */
for (const f of ['src/views/Lander.tsx', 'src/components/lander/Statement.tsx', 'src/components/lander/Figures.tsx', 'src/components/lander/Motifs.tsx', 'src/components/lander/stage.ts', 'src/components/lander/StudyPreview.tsx', 'src/components/lander/LanderLive.tsx', 'src/components/PageSigil.tsx', 'src/content/pitch-demo.ts']) {
  const s = readFileSync(f, 'utf8');
  const m = s.match(/[–—]/);
  if (m) bad(f + ' has a dash: ...' + s.slice(Math.max(0, m.index! - 40), m.index! + 20).replace(/\n/g, ' ') + '...');
}

console.log('pitch: ' + PITCH.chapters.steps + ' steps | ' + PITCH.awards.total + ' milestones | ' + PITCH.modux.models + ' models | ' + PITCH.systems.known + ' systems | ' + PITCH.study.cards + ' cards');
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
