/* PROBE: the known systems and the hidden chapter. Every known system's map
   builds into a gauge, with threats the library holds for its parts and
   tags, structures that exist in the catalog, a chain to the public, and
   sources that are links. Loading one into Map your own system gives the
   same map back. The hidden chapter is in the lookups and out of the twelve,
   out of the study deck, and opens only on its three keys. The Coming SOON
   chapter has its preview, intro, questions, pages and research prompt.
   Every class the new components use has a rule.
   Run: npx tsx probe-outlier.mts */

import { readFileSync } from 'node:fs';

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).location = { origin: 'https://unitium-safe.vercel.app', pathname: '/', hash: '' };
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { MODUX_MODELS, CHAPTERS, ALL_CHAPTERS, chapterById, stepById, AWARDS } = await import('./src/content/index');
const own = await import('./src/content/modux/own');
const { KNOWN_SYSTEMS } = await import('./src/content/outlier/systems');
const { SYNTHESIS } = await import('./src/content/outlier/synthesis');
const { OUTLIER_CHAPTER, OUTLIER_ID, KEEPER_ID } = await import('./src/content/outlier/chapter');
const { outlierKeys, outlierOpen, knownChosen } = await import('./src/lib/outlier');
const { NODE_KIND_LABEL } = await import('./src/content/modux-schema');

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const problems: string[] = [];
const EXPECT = ['google', 'microsoft', 'anthropic', 'youtube', 'github', 'x', 'farcaster', 'reddit', 'waves-fund', 'dashsupport-team', 'unitium-one', 'semble-cc', 'chatgpt', 'huggingface', 'openrouter', 'dash', 'xfinity', 'bcbs', 'si-gov', 'truth-social', 'dell', 'coinbase', 'intuition', 'giveth', 'allstate', 'gitcoin', 'defense-one', 'nsa',
  /* the systems the world rests on */
  'dns', 'internet-routing', 'web-pki', 'time', 'package-registries', 'update-channels', 'payment-networks', 'power-grid', 'hospitals', 'water'];

/* ---------- every system is here, and every map builds ---------- */
const missing = EXPECT.filter(id => !KNOWN_SYSTEMS.some(k => k.id === id));
if (missing.length) problems.push(missing.length + ' systems missing: ' + missing.join(', '));
if (new Set(KNOWN_SYSTEMS.map(k => k.id)).size !== KNOWN_SYSTEMS.length) problems.push('two known systems share an id');
let threatsTotal = 0, sourcesTotal = 0;
for (const k of KNOWN_SYSTEMS) {
  const w = (m: string) => problems.push(k.id + ': ' + m);
  for (const f of ['keystoneQuestion', 'coreProblem', 'outlierMove', 'structure', 'securityPosture', 'lesson', 'synthesis', 'brief', 'serves', 'sector'] as const) if (!k[f] || k[f].length < 12) w('no ' + f);
  if (k.loops.length < 2) w('fewer than two loops');
  if (!k.loops.some(l => l.kind === 'reinforcing') || !k.loops.some(l => l.kind === 'balancing')) w('needs a reinforcing and a balancing loop');
  if (k.leveragePoints.length < 3) w('fewer than three leverage points');
  if (k.securityLeverage.length < 2) w('fewer than two security moves');
  if (k.evolution.length < 2) w('fewer than two dated moves');
  if (k.sources.length < 4) w('fewer than four sources');
  if (k.sources.some(s => !/^https?:\/\//.test(s.url))) w('a source is not a link');
  if (k.tagline && !/^https?:\/\//.test(k.tagline.source)) w('a tagline without the page it was read on');
  for (const s of k.securityLeverage) for (const m of s.models) if (!byId.has(m)) w('names a structure not in the catalog: ' + m);
  const kinds = new Set(k.map.parts.map(p => p.kind));
  for (const p of k.map.parts) if (!(p.kind in NODE_KIND_LABEL)) w('part ' + p.id + ' has kind ' + p.kind);
  if (!kinds.has('people') && !kinds.has('public')) w('no people or public part');
  if (k.map.parts.length < 5 || k.map.parts.length > own.MAX_PARTS) w('has ' + k.map.parts.length + ' parts');
  const ids = new Set(k.map.parts.map(p => p.id));
  for (const l of k.map.links) if (!ids.has(l.from) || !ids.has(l.to) || l.from === l.to) w('a link joins a part that is not on the map: ' + l.from + ' to ' + l.to);
  const spec = own.specFromKnown(k.id);
  if (!spec) { w('does not load into the builder'); continue; }
  if (spec.known !== k.id) w('the builder lost which system it came from');
  const pr = own.problemsOf(spec);
  if (pr.length) { w('the map does not build: ' + pr.join(' ')); continue; }
  const pool = new Set(own.candidates(spec).map(p => p.id));
  for (const t of k.map.threats) if (!pool.has(t)) w('threat ' + t + ' does not fit its parts and tags');
  if (k.map.threats.length < own.MIN_THREATS || k.map.threats.length > own.MAX_THREATS) w('carries ' + k.map.threats.length + ' threats');
  const g = own.buildOwnGauge(spec, byId);
  if (!g) { w('the forge could not build its gauge'); continue; }
  if (own.effectiveThreatIds(spec).join() !== k.map.threats.join()) w('the gauge did not keep its chosen threats');
  if (JSON.stringify(own.buildOwnGauge(spec, byId)) !== JSON.stringify(g)) w('builds a different gauge twice');
  const read = own.readMap(spec, byId);
  if (!read.chain.length) w('no chain of dependencies reaches the people');
  if (read.unreached.length) w('nothing reaches ' + read.unreached.join(', '));
  if (read.bare === null || read.withRef === null || read.withRef < read.bare) w('the reference stack does not keep more of the day than nothing: ' + read.bare + ' and ' + read.withRef);
  /* round trip: the map read back from the built gauge is the same map */
  const back = own.specFromGauge(g);
  if (JSON.stringify(own.systemOf(back)) !== JSON.stringify(own.systemOf(spec))) w('the gauge does not read back to the same map');
  threatsTotal += k.map.threats.length;
  sourcesTotal += k.sources.length;
}

/* ---------- our own systems ship as their public cut: no vendor beside a gap, nothing from private notes ---------- */
{
  /* markers of private detail: vendor and setting names beside a gap, internal files, secrets. Public catalog structures (break-glass) and public repositories are fine. */
  const PRIVATE = /(Squarespace|DNSSEC|clientHold|Blob token|team key|NEXT-MOVES|RELEASE-20|-site memory|git log|df752ba|no remote|not marked sensitive|MFA is on|service.role|hardcoded|DashPass|unprotected main|\.env)/i;
  for (const k of KNOWN_SYSTEMS.filter(x => x.own)) {
    const text = JSON.stringify({ ...k, sources: [] });
    const m = text.match(PRIVATE);
    if (m) problems.push(k.id + ': its public cut still carries "' + m[0] + '"');
    for (const s of k.sources) if (/vercel\.com\/[a-z-]+\/[a-z-]+\/(settings|deployments)|localhost|file:|rdap\./.test(s.url)) problems.push(k.id + ': a public cut cites a private place: ' + s.url);
  }
  /* the synthesis read the private assessments, so it is held to the same line */
  const PRIVATE_SYN = /(Squarespace|DNSSEC|clientHold|Blob token|team key|NEXT-MOVES|RELEASE-20|df752ba|DashPass|InitiumBuilders|service.role|hardcoded|-site memory)/i;
  if (SYNTHESIS) { const m = JSON.stringify(SYNTHESIS).match(PRIVATE_SYN); if (m) problems.push('the synthesis carries a private detail: "' + m[0] + '"'); }
}

/* ---------- the reading every map shows: computed, whole and true to the map ---------- */
{
  const { readSystem, rungOf, guardsOf } = await import('./src/lib/systemRead');
  let placed = 0, total = 0;
  for (const k of KNOWN_SYSTEMS) {
    const spec = own.specFromKnown(k.id); if (!spec) continue;
    const g = own.buildOwnGauge(spec, byId); if (!g) continue;
    const r = readSystem(g.system, g.threats, g, byId);
    const w = (m: string) => problems.push(k.id + ' reading: ' + m);
    const flat = r.rows.flat();
    if (flat.length !== g.system.nodes.length || new Set(flat).size !== flat.length) w('rows do not hold every part exactly once');
    const fwd = g.system.edges.filter(e => !r.loops.some(l => l.from === e.from && l.to === e.to));
    if (fwd.some(e => r.row[e.to] <= r.row[e.from])) w('a forward link does not point down the page');
    if (!r.keystone) w('no keystone');
    if (r.keystone && !(r.reach[r.keystone] || []).length) w('the keystone reaches nothing');
    if (r.fastest.length < 2 || r.fastestHours === null || r.fastestHours <= 0) w('no fastest cascade to the people');
    else if (!r.publicIds.includes(r.fastest[r.fastest.length - 1]) && !g.system.nodes.some(n => n.id === r.fastest[r.fastest.length - 1] && n.kind === 'people')) w('the fastest cascade does not end at the people');
    if (Object.values(r.fall).every(h => h === null)) w('the stress day model gives no hours');
    for (const s of k.securityLeverage) for (const p of guardsOf(s.models, g.threats)) if (!g.system.nodes.some(n => n.id === p)) w('a guard points at a part not on the map');
    for (const l of k.leveragePoints) { total++; if (rungOf(l.point) !== null) placed++; }
  }
  if (total && placed / total < 0.97) problems.push('only ' + placed + ' of ' + total + ' leverage points found their rung');
  console.log('readings: ' + KNOWN_SYSTEMS.length + ' systems read | rungs placed ' + placed + '/' + total);
}

/* ---------- the five states: each one a day the model really runs, and in the right order ---------- */
{
  const { readSystem } = await import('./src/lib/systemRead');
  const { STATES, buildState, runState } = await import('./src/lib/systemStates');
  const sum: Record<string, number> = {}; const sumRef: Record<string, number> = {}; let n = 0;
  for (const k of KNOWN_SYSTEMS) {
    const spec = own.specFromKnown(k.id); if (!spec) continue;
    const g = own.buildOwnGauge(spec, byId); if (!g) continue;
    const reading = readSystem(g.system, g.threats, g, byId);
    const w = (m: string) => problems.push(k.id + ' states: ' + m);
    const kept = (stack: string[]) => Object.fromEntries(STATES.map(x => [x.id, runState(buildState(x.id, { gauge: g, byId, stack, reading })).kept])) as Record<string, number>;
    const bare = kept([]), ref = kept(g.expert || []);
    for (const [id, v] of Object.entries(bare)) if (!(v >= 0 && v <= 24)) w(id + ' kept ' + v + ' hours');
    if (bare.calm < 24 - 1e-6) w('a calm day loses service');
    if (bare.keystone >= 24 - 1e-6) w('the keystone falling costs nothing');
    if (bare.adversary > bare.stress + 1e-6) w('the adversary keeps more than the stress day (' + bare.adversary.toFixed(1) + ' > ' + bare.stress.toFixed(1) + ')');
    if (bare.strongest + 1e-6 < bare.adversary) w('the strongest moves keep less than nothing in place');
    if (ref.stress + 1e-6 < bare.stress) w('the reference stack keeps less of the stress day than nothing');
    for (const x of STATES) { sum[x.id] = (sum[x.id] || 0) + bare[x.id]; sumRef[x.id] = (sumRef[x.id] || 0) + ref[x.id]; }
    n++;
  }
  const avg = (o: Record<string, number>) => STATES.map(x => x.id + ' ' + (o[x.id] / Math.max(1, n)).toFixed(1)).join(' · ');
  console.log('states, mean hours kept over ' + n + ' systems | bare: ' + avg(sum) + ' | reference stack: ' + avg(sumRef));
}

/* ---------- the hardening plan: a week that only ever gains, and the computed list still true ---------- */
{
  const { computeHardening } = await import('./scripts/hardening-gen.mts');
  const { HARDENING } = await import('./src/content/outlier/hardening');
  const { VERBS } = await import('./src/lib/hardening');
  const fresh = computeHardening();
  if (JSON.stringify(fresh) !== JSON.stringify(HARDENING)) problems.push('hardening.ts no longer matches the model: run npx tsx scripts/hardening-gen.mts');
  for (const k of KNOWN_SYSTEMS) {
    const w = fresh.weeks[k.id];
    const bad = (m: string) => problems.push(k.id + ' hardening: ' + m);
    if (!w) { bad('no week'); continue; }
    if (!w.moves.length) bad('the week found no move');
    if (w.end + 1e-6 < w.start) bad('the week ends below where it started');
    if (new Set(w.moves).size !== w.moves.length) bad('a move repeats');
    for (const id of w.moves) if (!byId.has(id)) bad('a move not in the catalog: ' + id);
  }
  for (const m of fresh.moves) if (!VERBS.some(v => v.id === m.verb)) problems.push('a move with no verb: ' + m.id);
  /* the plan for the hardest day: it can stop early, but it never makes the hardest day worse */
  {
    const { hardeningWeek } = await import('./src/lib/hardening');
    const { readSystem } = await import('./src/lib/systemRead');
    let moved = 0;
    for (const k of KNOWN_SYSTEMS) {
      const spec = own.specFromKnown(k.id); if (!spec) continue;
      const g = own.buildOwnGauge(spec, byId); if (!g) continue;
      const w = hardeningWeek(g, byId, readSystem(g.system, g.threats, g, byId), [], 6, 'hardest');
      if (w.end + 1e-6 < w.start) problems.push(k.id + ' hardest plan: ends below where it started');
      if (w.lessons.some((l, i) => i > 0 && l.kept + 1e-6 < w.lessons[i - 1].kept)) problems.push(k.id + ' hardest plan: a day keeps less than the day before');
      if (w.lessons.length) moved++;
    }
    console.log('hardest-day plans: ' + moved + ' of ' + KNOWN_SYSTEMS.length + ' systems find at least one move');
  }
  const ends = Object.values(fresh.weeks);
  console.log('hardening: ' + ends.length + ' weeks | mean start ' + (ends.reduce((a, w) => a + w.start, 0) / ends.length).toFixed(1) + ' h, end ' + (ends.reduce((a, w) => a + w.end, 0) / ends.length).toFixed(1) + ' h, hardest after ' + (ends.reduce((a, w) => a + w.hardest, 0) / ends.length).toFixed(1) + ' h | first moves: ' + fresh.moves.filter(m => m.first.length).map(m => m.name + ' ' + m.first.length).join(', '));
}

/* ---------- the commons beneath: every tagged part exists, and the computed file is still true ---------- */
{
  const { computeCommons } = await import('./scripts/commons-gen.mts');
  const { COMMONS } = await import('./src/content/outlier/commons');
  let fresh: any = null;
  try { fresh = computeCommons(); } catch (err) { problems.push('commons: ' + (err instanceof Error ? err.message : String(err))); }
  if (fresh && JSON.stringify(fresh) !== JSON.stringify(COMMONS)) problems.push('commons.ts no longer matches the model: run npx tsx scripts/commons-gen.mts');
  if (fresh) {
    for (const f of fresh.foundations) {
      if (!f.rests.length) problems.push('commons: ' + f.id + ' has no system resting on it');
      for (const r of f.rests) if (r.kept > 24 || r.kept < 0) problems.push('commons: ' + f.id + '/' + r.system + ' kept ' + r.kept);
      for (const m of [...f.contain, ...f.harden]) if (!byId.has(m.id)) problems.push('commons: a move not in the catalog: ' + m.id);
    }
    const heavy = [...fresh.foundations].sort((a: any, b: any) => b.lost - a.lost)[0];
    console.log('commons: ' + fresh.foundations.length + ' foundations, ' + fresh.foundations.reduce((s: number, f: any) => s + f.rests.length, 0) + ' roots | heaviest ' + heavy.name + ': ' + heavy.rests.length + ' systems, ' + heavy.lost + ' h at stake, ' + (heavy.contain[0] ? heavy.contain[0].name + ' keeps ' + heavy.contain[0].gain : 'no move'));
  }
}

/* ---------- the closest known system ---------- */
if (KNOWN_SYSTEMS.length >= 2) {
  const water = own.specFromTemplate(own.templates()[0].key)!;
  const near = own.closestKnown(water);
  if (!near) problems.push('the closest known system found nothing for a sample organisation');
  const k0 = KNOWN_SYSTEMS[0];
  const self = own.closestKnown(own.specFromKnown(k0.id)!);
  if (self && self.system.id === k0.id) problems.push('a known system is its own closest match');
  if (own.closestKnown(own.emptySpec()) !== null) problems.push('an empty map has a closest system');
}
for (const k of Object.keys(NODE_KIND_LABEL)) if (!(own.KIND_HINT as Record<string, string>)[k]) problems.push('no hint for the kind ' + k);

/* ---------- the hidden chapter ---------- */
if (KNOWN_SYSTEMS.length) {
  if (!OUTLIER_CHAPTER) problems.push('the hidden chapter did not build');
  else {
    if (CHAPTERS.some(c => c.id === OUTLIER_ID)) problems.push('the hidden chapter is in the twelve');
    if (CHAPTERS.length !== 12) problems.push('the twelve are now ' + CHAPTERS.length);
    if (!ALL_CHAPTERS.some(c => c.id === OUTLIER_ID) || !chapterById(OUTLIER_ID)) problems.push('the hidden chapter is not in the lookups');
    const steps = OUTLIER_CHAPTER.pages.flatMap(p => p.steps);
    for (const k of KNOWN_SYSTEMS) if (!steps.some(s => s.id === 'ol-' + k.id)) problems.push('no step for ' + k.id);
    for (const s of steps) if (!stepById(s.id)) problems.push('step ' + s.id + ' cannot be found by id');
    if (!OUTLIER_CHAPTER.prereq.includes(KEEPER_ID)) problems.push('the hidden chapter does not follow The Keeper');
    if (!CHAPTERS.some(c => c.id === KEEPER_ID)) problems.push('The Keeper is not ' + KEEPER_ID);
    if (SYNTHESIS && (!OUTLIER_CHAPTER.thesis || !OUTLIER_CHAPTER.why || OUTLIER_CHAPTER.outcomes.length < 4)) problems.push('the chapter frame is thin');
    for (const p of OUTLIER_CHAPTER.pages) if (!p.steps.length) problems.push('page ' + p.id + ' has no steps');
    const ids = steps.map(s => s.id);
    if (new Set(ids).size !== ids.length) problems.push('two steps share an id');
    const allIds = ALL_CHAPTERS.flatMap(c => c.pages.flatMap(p => p.steps.map(s => s.id)));
    if (new Set(allIds).size !== allIds.length) problems.push('a step id is used twice across all chapters');
    /* the deck reads the twelve only, so the secret stays out of StudyMode */
    const cardsSrc = readFileSync('src/lib/study/cards.ts', 'utf8');
    if (/ALL_CHAPTERS/.test(cardsSrc)) problems.push('the study deck reads every chapter, so the hidden one would show');
  }
}

/* ---------- the three keys ---------- */
{
  const keeper = CHAPTERS.find(c => c.id === KEEPER_ID)!;
  const prereq = CHAPTERS.find(c => c.id === keeper.prereq[0])!;
  const two = Object.fromEntries(prereq.pages.slice(0, 2).map(p => [p.id, 1]));
  const blank = { completedChapters: {}, completedPages: {}, runLog: [] as any[], gauges: {}, firsts: {} as Record<string, number> };
  const run = { g: 'x', title: 'x', notch: 0, score: 1, ref: 1, held: true, at: 1, fams: [], motrus: 0 };
  const cases: [string, any, boolean][] = [
    ['nothing', blank, false],
    ['The Keeper only', { ...blank, completedPages: two }, false],
    ['a gauge only', { ...blank, runLog: [run] }, false],
    ['a known system only', { ...blank, firsts: { 'known:google': 1 } }, false],
    ['The Keeper and a gauge', { ...blank, completedPages: two, runLog: [run] }, false],
    ['The Keeper and a known system', { ...blank, completedPages: two, firsts: { 'known:google': 1 } }, false],
    ['a gauge and a known system', { ...blank, runLog: [run], firsts: { 'known:google': 1 } }, false],
    ['all three', { ...blank, completedPages: two, runLog: [run], firsts: { 'known:google': 1 } }, true],
    ['all three, the gauge counted from its record', { ...blank, completedPages: two, gauges: { x: { runs: 2 } }, firsts: { 'known:dash': 1 } }, true],
    ['a sample organisation is not a known system', { ...blank, completedPages: two, runLog: [run], firsts: { 'exported': 1 } }, false],
  ];
  for (const [label, st, want] of cases) if (outlierOpen(st) !== want) problems.push('the hidden chapter ' + (want ? 'stays shut' : 'opens') + ' with ' + label + ': ' + JSON.stringify(outlierKeys(st)));
  if (knownChosen({ firsts: { 'known:a': 1, 'known:b': 2, other: 3 } }).join() !== 'a,b') problems.push('the chosen known systems read wrong');
}
for (const id of ['small-known-system', 'strong-outlier-open']) if (!AWARDS.some(a => a.id === id)) problems.push('award missing: ' + id);
const engine = readFileSync('src/lib/engine.tsx', 'utf8');
if (!engine.includes("grant('small-known-system')") || !engine.includes("grant('strong-outlier-open')")) problems.push('the engine does not grant the outlier awards');
/* the guards: a link to the hidden chapter or one of its steps shows nothing until it can be read
   (its three keys, or MOTUS mode), and the opening itself still waits for the keys */
for (const f of ['src/views/ChapterView.tsx', 'src/views/StepView.tsx']) if (!/outlierVisible\(s\)/.test(readFileSync(f, 'utf8'))) problems.push(f + ' does not guard the hidden chapter');
{
  const ol = await import('./src/lib/outlier');
  const bare = { completedChapters: {}, completedPages: {}, runLog: [], gauges: {}, firsts: {} } as any;
  if (ol.outlierVisible({ ...bare, mode: 'novus' })) problems.push('the hidden chapter shows in NOVUS mode with no keys held');
  if (!ol.outlierVisible({ ...bare, mode: 'motus' })) problems.push('the hidden chapter does not show in MOTUS mode');
  if (ol.outlierOpen({ ...bare, mode: 'motus' })) problems.push('MOTUS mode alone opens the chapter for good (the award must wait for the keys)');
  if (!/outlierOpen\(s\)/.test(readFileSync('src/App.tsx', 'utf8')) && !/outlierOpen\(/.test(readFileSync('src/App.tsx', 'utf8'))) problems.push('the opening is no longer tied to the three keys');
}
if (!/outlierOpened/.test(readFileSync('src/App.tsx', 'utf8'))) problems.push('the app does not open the hidden chapter when its keys are held');

/* ---------- Coming SOON ---------- */
if (SYNTHESIS) {
  const cs = SYNTHESIS.comingSoon;
  if (!cs.title || !cs.subtitle || !cs.preview) problems.push('Coming SOON has no title, subtitle or preview');
  if (cs.intro.split(/\n\n+/).length < 3) problems.push('the Coming SOON intro has fewer than three paragraphs');
  if (cs.keystoneQuestions.length < 6) problems.push('Coming SOON has fewer than six questions');
  if (cs.pages.length < 5) problems.push('Coming SOON has fewer than five pages');
  if (cs.researchPrompt.length < 800) problems.push('the Coming SOON research prompt is thin');
  if (SYNTHESIS.patterns.length < 6) problems.push('fewer than six patterns');
  if (SYNTHESIS.moduxAdditions.length < 6) problems.push('fewer than six Modux additions');
} else problems.push('no synthesis yet');
const chv = readFileSync('src/views/ChaptersView.tsx', 'utf8');
if (!chv.includes('Coming SOON')) problems.push('the Chapters page does not carry Coming SOON');

/* ---------- the outlier chunk is a leaf: a run-time import of the modux chunk makes a cycle that breaks production ---------- */
{
  const { readdirSync } = await import('node:fs');
  for (const f of readdirSync('src/content/outlier')) {
    const src = readFileSync('src/content/outlier/' + f, 'utf8');
    for (const m of src.matchAll(/^import\s+(?!type\b)[^;]*from\s+'([^']+)'/gm)) if (!m[1].startsWith('./')) problems.push('src/content/outlier/' + f + ' imports ' + m[1] + ' at run time; the outlier chunk must stay a leaf');
  }
}

/* ---------- every class the new components use has a rule ---------- */
const css = readFileSync('src/styles/outlier.css', 'utf8');
if (!readFileSync('src/main.tsx', 'utf8').includes('styles/outlier.css')) problems.push('outlier.css is not imported');
for (const f of ['src/components/KnownSystems.tsx', 'src/components/OwnSystem.tsx', 'src/views/ChaptersView.tsx', 'src/views/ModuxGaugeView.tsx']) {
  for (const m of readFileSync(f, 'utf8').matchAll(/\b(ks-[a-z0-9-]+|ol-[a-z0-9-]+|own-(?:known|start|kinds|outlier|grid-2)[a-z0-9-]*)/g)) {
    if (!css.includes('.' + m[1])) problems.push(f + ': no rule for class ' + m[1]);
  }
}

console.log('known systems: ' + KNOWN_SYSTEMS.length + '/' + EXPECT.length + ' | threats ' + threatsTotal + ' | sources ' + sourcesTotal + ' | chapter pages ' + (OUTLIER_CHAPTER?.pages.length || 0) + ' | steps ' + (OUTLIER_CHAPTER?.pages.reduce((n, p) => n + p.steps.length, 0) || 0));
console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems.slice(0, 60)) console.log('  ' + p);
process.exitCode = problems.length ? 1 : 0;
