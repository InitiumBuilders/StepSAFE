/* PROBE: map your own system, and a gauge in a link. Every template builds
   and its expert stack holds; the smallest valid map builds and builds the
   same twice; an invalid map names its first problem; chosen threats are
   honoured and the forge's own choice spreads across parts; the map read
   gives the hub and the two day numbers; a gauge read back from its own
   build edits to the same gauge; a gauge survives the link round trip with
   the sender's note; a hostile payload comes back null or clean.
   Run: npx tsx probe-own.mts */

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).location = { origin: 'https://unitium-safe.vercel.app', pathname: '/', hash: '' };
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { MODUX_MODELS } = await import('./src/content/modux/index');
const { buildOwnGauge, emptySpec, specFromTemplate, specFromGauge, templates, problemsOf, candidates, defaultThreatIds, effectiveThreatIds, readMap } = await import('./src/content/modux/own');
const { encodeGauge, decodeGauge, sanitizeGauge } = await import('./src/lib/share');
const { buildModel, stressDay } = await import('./src/content/modux/dynamics');
const { scoreGauge } = await import('./src/content/modux/score');

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const known = (id: string) => byId.has(id);
const problems: string[] = [];

/* every template builds and holds */
for (const t of templates()) {
  const spec = specFromTemplate(t.key)!;
  if (problemsOf(spec).length) { problems.push(t.key + ': template has problems: ' + problemsOf(spec).join(' ')); continue; }
  const g = buildOwnGauge(spec, byId);
  if (!g) { problems.push(t.key + ': did not build'); continue; }
  if (g.threats.length < 4) problems.push(t.key + ': only ' + g.threats.length + ' threats');
  if (!g.threats.every(th => g.system.nodes.some(n => n.id === th.target))) problems.push(t.key + ': a threat targets a part that is not there');
  if (!g.threats.every(th => th.counters.every(known))) problems.push(t.key + ': a counter is not in the catalog');
  const r = scoreGauge(g, g.expert, byId);
  if (r.verdict !== 'holds') problems.push(t.key + ': the expert stack does not hold (' + r.verdict + ')');
  const lost = stressDay(buildModel(g, g.expert, byId));
  if (!(lost >= 0 && lost <= 24)) problems.push(t.key + ': stress day lost ' + lost);
  /* the forge's own choice spreads across parts before any is hit twice */
  const targets = g.threats.map(th => th.target);
  const kindsHit = new Set(g.threats.map(th => g.system.nodes.find(n => n.id === th.target)!.kind));
  if (new Set(targets).size < Math.min(targets.length, kindsHit.size)) problems.push(t.key + ': threats piled onto one part: ' + targets.join(','));
  /* the map read */
  const read = readMap(spec, byId);
  if (!read.hub && read.chain.length < 2 && !read.unreached.length) problems.push(t.key + ': nothing in the read');
  if (read.bare === null || read.withRef === null) problems.push(t.key + ': no day numbers in the read');
  else if (read.withRef < read.bare - 0.01) problems.push(t.key + ': the reference stack keeps less than nothing (' + read.withRef + ' < ' + read.bare + ')');
  /* a gauge read back edits to the same gauge */
  const back = specFromGauge(g);
  const again = buildOwnGauge(back, byId);
  if (!again) problems.push(t.key + ': the spec read back from the gauge did not build');
  else if (again.id !== g.id) problems.push(t.key + ': the spec read back built a different gauge (' + again.id + ' vs ' + g.id + ')');
  console.log(t.key.padEnd(10), g.id.padEnd(14), g.system.nodes.length + ' parts', g.threats.length + ' threats', 'budget ' + g.budget, 'score ' + r.score, 'bare ' + (read.bare ?? 0).toFixed(1) + ' h', 'ref ' + (read.withRef ?? 0).toFixed(1) + ' h');
}

/* chosen threats are honoured */
const water = specFromTemplate('water')!;
const pool = candidates(water);
if (pool.length < 6) problems.push('water: fewer than six candidate threats (' + pool.length + ')');
const choice = pool.slice(0, 5).map(p => p.id);
const chosen = buildOwnGauge({ ...water, threatIds: choice }, byId);
if (!chosen) problems.push('water with chosen threats did not build');
else if (chosen.threats.map(t => t.name).join('|') !== choice.map(id => pool.find(p => p.id === id)!.name).join('|')) problems.push('chosen threats were not honoured');
const few = effectiveThreatIds({ ...water, threatIds: choice.slice(0, 2) });
if (few.join() !== defaultThreatIds(water).join()) problems.push('fewer than four chosen should fall back to the forge');
const many = effectiveThreatIds({ ...water, threatIds: pool.slice(0, 10).map(p => p.id) });
if (many.length !== 8) problems.push('more than eight chosen should cap at eight, got ' + many.length);

/* the smallest valid blank map */
const small = emptySpec();
small.org = 'Harbor Clinic'; small.serves = 'A clinic for 2,000 patients'; small.tags = ['health'];
small.parts[0].name = 'Records system'; small.parts[1].name = 'Nurses'; small.parts[2].name = 'Patients';
small.parts[1].dependsOn = ['p1']; small.parts[2].dependsOn = ['p2']; small.parts[2].how = 'serves';
if (problemsOf(small).length) problems.push('small map has problems: ' + problemsOf(small).join(' '));
const sg = buildOwnGauge(small, byId);
if (!sg) problems.push('small map did not build');
else {
  if (sg.seed !== 'own' || sg.origin !== 'forged') problems.push('small map: origin or seed wrong');
  if (!/2,000/.test(sg.sector)) problems.push('small map: sector lost the count');
  if (!/serving 2,000 people/.test(sg.brief)) problems.push('small map: brief lacks the people: ' + sg.brief);
  const again = buildOwnGauge(small, byId);
  if (JSON.stringify(again) !== JSON.stringify(sg)) problems.push('the same map built a different gauge');
}

/* each dependency carries its own kind of link */
const { systemOf } = await import('./src/content/modux/own');
const two = emptySpec();
two.org = 'Two Links'; two.serves = 'A town of 5,000'; two.tags = [];
two.parts[0].name = 'Control room'; two.parts[1].name = 'Operators'; two.parts[2].name = 'Residents';
two.parts.push({ id: 'p4', name: 'Vendor link', kind: 'vendor', dependsOn: [], how: 'needs' });
two.parts[0].dependsOn = ['p2', 'p4']; two.parts[0].hows = { p2: 'needs', p4: 'supplied' };
two.parts[2].dependsOn = ['p1']; two.parts[2].how = 'serves';
const sys2 = systemOf(two);
const verbs = Object.fromEntries(sys2.edges.map(e => [e.from + '>' + e.to, e.how]));
if (verbs['p2>p1'] !== 'keeps running' || verbs['p4>p1'] !== 'supplies' || verbs['p1>p3'] !== 'serves') problems.push('per-dependency links not honoured: ' + JSON.stringify(verbs));
const g2 = buildOwnGauge(two, byId);
if (!g2) problems.push('the two-link map did not build');
else {
  const rt = buildOwnGauge(specFromGauge(g2), byId);
  if (!rt || rt.id !== g2.id) problems.push('the two-link map did not survive a read back');
}

/* an invalid map names its first problem */
const bad = emptySpec();
if (problemsOf(bad)[0] !== 'Name the organisation.') problems.push('blank map: first problem was ' + problemsOf(bad)[0]);
bad.org = 'X'; bad.serves = 'y';
bad.parts[0].name = 'A'; bad.parts[1].name = 'B'; bad.parts[1].kind = 'control'; bad.parts[2].name = 'C'; bad.parts[2].kind = 'control';
if (!/people/.test(problemsOf(bad)[0] || '')) problems.push('no people part should be named: ' + problemsOf(bad)[0]);

/* the link round trip, with and without the note */
if (sg) {
  const frag = await encodeGauge(sg, { by: 'Probe', best: { notch: 2, hoursKept: 21.24 } });
  if (frag.length > 6000) problems.push('link fragment is long: ' + frag.length);
  const back = await decodeGauge(frag, known);
  if (!back) problems.push('the gauge did not come back from the link');
  else {
    const g = back.gauge;
    if (g.id !== sg.id || g.title !== sg.title || g.threats.length !== sg.threats.length || g.system.nodes.length !== sg.system.nodes.length) problems.push('the gauge changed in the link');
    if (g.seed !== 'own') problems.push('the seed did not travel: ' + g.seed);
    if (g.origin !== 'forged') problems.push('origin after the link: ' + g.origin);
    if (back.by !== 'Probe') problems.push('the sender did not travel: ' + back.by);
    if (!back.best || back.best.notch !== 2 || back.best.hoursKept !== 21.2) problems.push('the best day did not travel clean: ' + JSON.stringify(back.best));
  }
  const bare = await decodeGauge(await encodeGauge(sg), known);
  if (!bare || bare.by || bare.best) problems.push('a link without the note should carry none');
  console.log('link fragment ' + frag.length + ' chars');
}

/* hostile payloads */
if (sanitizeGauge(null, known) !== null) problems.push('null was not refused');
if (sanitizeGauge({ threats: 'x', system: {} }, known) !== null) problems.push('a bad shape was not refused');
const hostile = sanitizeGauge({
  id: '<script>', title: 'x'.repeat(500), budget: 999, origin: 'authored', seed: 'own',
  system: { nodes: [{ id: 'a', name: 'A', kind: 'control' }, { id: 'b', name: 'B', kind: 'public' }, { id: 'c', name: 'C', kind: 'laser' }], edges: [{ from: 'a', to: 'b', how: 'x' }, { from: 'a', to: 'zz', how: 'y' }] },
  threats: [{ id: 'a', name: 'T', move: 'm', counters: ['c-not-real', MODUX_MODELS[0].id], weight: 9, target: 'a' }, { id: 'b', name: 'U', move: 'm', counters: ['nope'], weight: 1, target: 'a' }],
}, known);
if (!hostile) problems.push('a messy but usable payload was refused');
else {
  if (hostile.id.includes('<')) problems.push('hostile id kept: ' + hostile.id);
  if (hostile.title.length > 80) problems.push('title not capped');
  if (hostile.budget > 99) problems.push('budget not capped');
  if (hostile.origin !== 'forged') problems.push('origin not forced to forged');
  if (hostile.system.nodes.length !== 2) problems.push('unknown kind kept');
  if (hostile.system.edges.length !== 1) problems.push('dangling edge kept');
  if (hostile.threats.length !== 1 || hostile.threats[0].weight !== 3 || hostile.threats[0].counters.length !== 1) problems.push('threats not cleaned: ' + JSON.stringify(hostile.threats));
}
/* a hostile note */
const toB64 = (x: string) => 'r' + Buffer.from(x).toString('base64').replace(/[+]/g, '-').replace(/[/]/g, '_').replace(/=+$/, '');
const bell = String.fromCharCode(7);
const noteFrag = toB64(JSON.stringify({ v: 2, g: sg, by: 'x'.repeat(200) + bell, best: { notch: 999, hoursKept: -5 } }));
const hostileNote = await decodeGauge(noteFrag, known);
if (!hostileNote) problems.push('a gauge with a hostile note was refused');
else {
  if ((hostileNote.by || '').length > 40 || (hostileNote.by || '').includes(bell)) problems.push('the sender name was not cleaned');
  if (!hostileNote.best || hostileNote.best.notch !== 40 || hostileNote.best.hoursKept !== 0) problems.push('the best day was not clamped: ' + JSON.stringify(hostileNote.best));
}

console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
