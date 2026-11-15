/* OUTLIER SYSTEMS: from Davara's final entries to app content.
   Reads research/outlier/final/<id>.json and _synthesis.json, checks every
   map against the app's own vocabulary (part kinds, links that join real
   parts, threats the pressure library holds for those parts and tags,
   structures that exist in the catalog), repairs what can be repaired,
   reports what was changed, and writes src/content/outlier/systems.ts and
   synthesis.ts. A map that will not build into a gauge fails the run.
   Run: npx tsx scripts/outlier-gen.mts */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const ROOT = process.cwd();
const FINAL = join(ROOT, 'research', 'outlier', 'final');
const { MODUX_MODELS } = await import('../src/content/index');
const own = await import('../src/content/modux/own');
const KINDS = ['people', 'public', 'identity', 'network', 'data', 'build', 'money', 'control', 'model', 'time', 'vendor'];
const TAGS = new Set(own.TAG_CHOICES.map(t => t.tag));
const MODEL_IDS = new Set(MODUX_MODELS.map(m => m.id));
const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));

/* the order systems are read in, and the group each is read with */
const GROUPS: [string, string[]][] = [
  ['Platforms of knowledge and work', ['google', 'microsoft', 'youtube', 'github']],
  ['The AI frontier', ['anthropic', 'chatgpt', 'huggingface', 'openrouter']],
  ['Networks of people', ['x', 'farcaster', 'reddit', 'truth-social']],
  ['Money, trust and the commons', ['dash', 'coinbase', 'intuition', 'giveth', 'gitcoin']],
  ['Service at scale', ['xfinity', 'bcbs', 'allstate', 'dell']],
  ['The state and its signals', ['nsa', 'defense-one', 'si-gov']],
  ['The systems the world rests on', ['dns', 'internet-routing', 'web-pki', 'time', 'package-registries', 'update-channels', 'payment-networks', 'power-grid', 'hospitals', 'water']],
  ['Our own systems', ['waves-fund', 'dashsupport-team', 'unitium-one', 'semble-cc']],
];
const OWN = new Set(['waves-fund', 'dashsupport-team', 'unitium-one', 'semble-cc']);
const ORDER = GROUPS.flatMap(([, ids]) => ids);
const groupOf = (id: string) => GROUPS.find(([, ids]) => ids.includes(id))?.[0] || 'Other systems';

const notes: string[] = [];
const fail: string[] = [];
const str = (x: unknown, max = 4000) => (typeof x === 'string' ? x.trim().slice(0, max) : '');
const arr = (x: unknown): any[] => (Array.isArray(x) ? x : []);
const strs = (x: unknown, max = 600) => arr(x).map(v => str(v, max)).filter(Boolean);
const slug = (x: string) => x.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'part';

/* a character lost in an encoding round trip comes back as U+FFFD; between letters it was an apostrophe */
const BAD = String.fromCharCode(0xfffd);
const APOS = String.fromCharCode(0x2019);
function mend(id: string, x: any): any {
  if (typeof x === 'string') {
    if (!x.includes(BAD)) return x;
    const y = x.replace(new RegExp('([A-Za-z])' + BAD + '([A-Za-z])', 'g'), '$1' + APOS + '$2');
    if (y.includes(BAD)) fail.push(id + ': a lost character that is not an apostrophe: ' + y.slice(Math.max(0, y.indexOf(BAD) - 30), y.indexOf(BAD) + 30));
    else notes.push(id + ': mended a lost apostrophe in: ' + y.slice(0, 80));
    return y;
  }
  if (Array.isArray(x)) return x.map(v => mend(id, v));
  if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, mend(id, v)]));
  return x;
}

function clean(id: string, e0: any) {
  const e = mend(id, e0);
  /* the map */
  const seen = new Set<string>();
  const parts = arr(e.map?.parts).map((p: any) => {
    let pid = slug(str(p.id) || str(p.name));
    while (seen.has(pid)) pid += 'x';
    seen.add(pid);
    const kind = KINDS.includes(p.kind) ? p.kind : 'control';
    if (kind !== p.kind) notes.push(id + ': part ' + pid + ' had kind ' + p.kind + ', set to control');
    const name = str(p.name, 200);
    if (name.length > 48) notes.push(id + ': part name cut to 48: ' + name);
    return { id: pid, name: name.slice(0, 48).trim(), kind, was: str(p.id) };
  });
  /* over the limit: drop the parts on the fewest links first, never the people or the public */
  while (parts.length > own.MAX_PARTS) {
    const deg = (p: { was: string; id: string }) => arr(e.map?.links).filter((l: any) => [str(l.from), str(l.to)].some(x => x === p.was || x === p.id)).length;
    const cut = parts.filter(p => p.kind !== 'public' && p.kind !== 'people').sort((a, b) => deg(a) - deg(b))[0] || parts[parts.length - 1];
    notes.push(id + ': over ' + own.MAX_PARTS + ' parts, dropped ' + cut.name);
    parts.splice(parts.indexOf(cut), 1);
  }
  const pidOf = (x: string) => parts.find(p => p.was === x || p.id === x || p.id === slug(x))?.id;
  const links: { from: string; to: string; how: 'needs' | 'supplied' | 'serves' }[] = [];
  for (const l of arr(e.map?.links)) {
    const from = pidOf(str(l.from)), to = pidOf(str(l.to));
    if (!from || !to || from === to) { notes.push(id + ': dropped link ' + l.from + ' to ' + l.to); continue; }
    if (links.some(x => x.from === from && x.to === to)) continue;
    links.push({ from, to, how: ['needs', 'supplied', 'serves'].includes(l.how) ? l.how : 'needs' });
  }
  const loose = parts.filter(p => !links.some(l => l.from === p.id || l.to === p.id));
  if (loose.length) notes.push(id + ': parts on no link: ' + loose.map(p => p.name).join(', '));
  const tags = strs(e.tags, 20).filter(t => TAGS.has(t));
  if (!tags.length) notes.push(id + ': no valid tags');

  const spec = {
    org: str(e.name, 60), serves: str(e.serves, 120), tags, brief: str(e.brief, 600), threatIds: [] as string[], known: id,
    parts: parts.map(p => ({
      id: p.id, name: p.name, kind: p.kind as any, how: 'needs' as const,
      dependsOn: links.filter(l => l.to === p.id).map(l => l.from),
      hows: Object.fromEntries(links.filter(l => l.to === p.id).map(l => [l.from, l.how])),
    })),
  };
  const pool = new Set(own.candidates(spec).map(p => p.id));
  let threats = strs(e.map?.threats, 60).filter(t => pool.has(t));
  const dropped = strs(e.map?.threats, 60).filter(t => !pool.has(t));
  if (dropped.length) notes.push(id + ': threats that do not fit this map were dropped: ' + dropped.join(', '));
  if (threats.length < own.MIN_THREATS) {
    const top = own.defaultThreatIds({ ...spec, threatIds: [] }).filter(t => !threats.includes(t));
    threats = [...threats, ...top].slice(0, Math.max(own.MIN_THREATS, threats.length));
    notes.push(id + ': threats topped up by the forge to ' + threats.length);
  }
  threats = [...new Set(threats)].slice(0, own.MAX_THREATS);
  spec.threatIds = threats;
  const problems = own.problemsOf(spec);
  if (problems.length) fail.push(id + ': the map does not build: ' + problems.join(' '));
  else if (!own.buildOwnGauge(spec, byId)) fail.push(id + ': the map passes its checks but the forge could not build a gauge');

  const sec = arr(e.securityLeverage).map((s: any) => {
    const models = strs(s.models, 80);
    const bad = models.filter(m => !MODEL_IDS.has(m));
    if (bad.length) notes.push(id + ': unknown structure ids dropped: ' + bad.join(', '));
    return { move: str(s.move, 400), why: str(s.why, 800), models: models.filter(m => MODEL_IDS.has(m)) };
  }).filter(s => s.move);

  const tag = e.tagline && str(e.tagline.text) ? { text: str(e.tagline.text, 300), source: str(e.tagline.source, 300) } : null;
  return {
    id, name: str(e.name, 80), url: str(e.url, 300), sector: str(e.sector, 160), serves: str(e.serves, 300), tags,
    keystoneQuestion: str(e.keystoneQuestion, 400), coreProblem: str(e.coreProblem, 800), tagline: tag,
    knownFor: str(e.knownFor, 800), outlierMove: str(e.outlierMove, 800), structure: str(e.structure, 2400),
    stocks: strs(e.stocks), flows: strs(e.flows),
    loops: arr(e.loops).map((l: any) => ({ kind: l.kind === 'balancing' ? 'balancing' : 'reinforcing', name: str(l.name, 120), how: str(l.how, 600) })).filter(l => l.name),
    evolution: arr(e.evolution).map((x: any) => ({ when: str(x.when, 40), move: str(x.move, 500) })).filter(x => x.move),
    doesWell: strs(e.doesWell),
    leveragePoints: arr(e.leveragePoints).map((x: any) => ({ point: str(x.point, 300), why: str(x.why, 700) })).filter(x => x.point),
    securityLeverage: sec, securityPosture: str(e.securityPosture, 2400), risks: strs(e.risks),
    incidents: arr(e.incidents).map((x: any) => ({ when: str(x.when, 40), what: str(x.what, 600), source: str(x.source, 300) })).filter(x => x.what),
    map: { parts: parts.map(({ was, ...p }) => p), links, threats },
    brief: str(e.brief, 600), lesson: str(e.lesson, 400), synthesis: str(e.synthesis, 5000), forModux: strs(e.forModux),
    sources: arr(e.sources).map((x: any) => ({ label: str(x.label, 200), url: str(x.url, 400) })).filter(x => /^https?:\/\//.test(x.url)),
    uncertain: strs(e.uncertain, 800),
    ...(OWN.has(id) ? { own: true } : {}),
    group: groupOf(id),
  };
}

/* --check <id>: read one final entry and report, writing nothing. For researchers checking their own entry. */
const ci = process.argv.indexOf('--check');
if (ci > 0) {
  const id = process.argv[ci + 1] || '';
  const f = join(FINAL, id + '.json');
  if (!existsSync(f)) { console.log('no file at ' + f); process.exit(1); }
  let e: any;
  try { e = clean(id, JSON.parse(readFileSync(f, 'utf-8'))); } catch (err) { console.log('could not read: ' + (err instanceof Error ? err.message : String(err))); process.exit(1); }
  const extra: string[] = [];
  const { rungOf } = await import('../src/lib/systemRead');
  if (e.map.parts.filter((x: any) => x.kind === 'public').length !== 1) extra.push('the map needs exactly one public part');
  if (e.map.threats.length < own.MIN_THREATS) extra.push('fewer than ' + own.MIN_THREATS + ' threats fit');
  if (e.securityLeverage.length < 6) extra.push('fewer than six security moves');
  if (e.securityLeverage.some((x: any) => !x.models.length)) extra.push('a security move with no catalog structure');
  if (e.leveragePoints.length < 6) extra.push('fewer than six leverage points');
  const unplaced = e.leveragePoints.filter((x: any) => rungOf(x.point) === null).map((x: any) => x.point);
  if (unplaced.length) extra.push('leverage points with no Meadows rung (open with the rung name, such as "Information flows:"): ' + unplaced.join(' | '));
  if (e.sources.length < 15) extra.push('only ' + e.sources.length + ' sources');
  if (!e.tags.length) extra.push('no valid sector tags');
  const { tagline, sources, url, ...rest } = e;
  if (/\u2014|\u2013| -- /.test(JSON.stringify(rest))) extra.push('a dash in the writing');
  console.log(id + ': ' + e.map.parts.length + ' parts, ' + e.map.links.length + ' links, threats ' + e.map.threats.join(', '));
  for (const n of notes) console.log('  note  ' + n);
  for (const x of extra) console.log('  FIX   ' + x);
  for (const x of fail) console.log('  FAIL  ' + x);
  console.log(fail.length || extra.length ? 'NOT READY' : 'READY');
  process.exit(fail.length || extra.length ? 1 : 0);
}

/* August's own systems ship only as their public cut (final/public/<id>.json): what the live site shows
   and the structural lesson, with no vendor named beside a gap and nothing from private notes. The full
   assessment stays in final/<id>.json, which never leaves this folder. Without a public cut the system is
   left out of the app and the run fails, so a private reading cannot ship by accident. */
const PUBLIC = join(FINAL, 'public');
const files = existsSync(FINAL) ? readdirSync(FINAL).filter(f => f.endsWith('.json') && !f.startsWith('_')) : [];
const entries = files.map(f => {
  const id = f.replace(/\.json$/, '');
  const src = OWN.has(id) ? join(PUBLIC, f) : join(FINAL, f);
  if (OWN.has(id) && !existsSync(src)) { fail.push(id + ': one of our own systems has no public cut at final/public/' + f + ', so it was left out'); return null; }
  try { return clean(id, JSON.parse(readFileSync(src, 'utf-8'))); }
  catch (err) { fail.push(id + ': could not read ' + f + ': ' + (err instanceof Error ? err.message : String(err))); return null; }
}).filter((x): x is NonNullable<typeof x> => !!x)
  .sort((a, b) => (ORDER.indexOf(a.id) + 1 || 999) - (ORDER.indexOf(b.id) + 1 || 999));

/* writing that would trip the house style, reported for a person to read; taglines are their authors' words and are not checked */
const DASH = /—|–| -- /;
for (const e of entries) {
  const { tagline, sources, url, ...rest } = e;
  const text = JSON.stringify(rest);
  if (DASH.test(text)) notes.push(e.id + ': has a dash in its writing');
}

const missing = ORDER.filter(id => !entries.some(e => e.id === id));
const head = '/* GENERATED by scripts/outlier-gen.mts from research/outlier/final. Edit the\n   final entries and run the script again; do not edit this file by hand. */\n\n';
writeFileSync(join(ROOT, 'src', 'content', 'outlier', 'systems.ts'),
  head + "import type { KnownSystem } from './schema';\n\nexport const KNOWN_SYSTEMS: KnownSystem[] = " + JSON.stringify(entries, null, 1) + ';\n', 'utf-8');

const synPath = join(FINAL, '_synthesis.json');
if (existsSync(synPath)) {
  const syn = mend('synthesis', JSON.parse(readFileSync(synPath, 'utf-8')));
  /* the subtitle counts the systems; the count is the build's, so it cannot fall behind the set */
  if (syn.chapter && typeof syn.chapter.subtitle === 'string') {
    const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const n = entries.length;
    const said = n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    const word = n < 100 ? said.charAt(0).toUpperCase() + said.slice(1) : String(n);
    syn.chapter.subtitle = syn.chapter.subtitle.replace(/^([A-Z][a-z]+(?: [a-z]+)?|\d+) real systems/, word + ' real systems');
  }
  /* structure ids that are not in the catalog leave the strongest moves */
  for (const s of arr(syn.strongest)) {
    const bad = strs(s.models, 80).filter(m => !MODEL_IDS.has(m));
    if (bad.length) notes.push('synthesis: unknown structure ids dropped from a strongest move: ' + bad.join(', '));
    s.models = strs(s.models, 80).filter(m => MODEL_IDS.has(m));
  }
  /* the pressures the systems taught: each one checked before it joins the library */
  const { PRESSURES: LIB } = await import('../src/content/modux/pressures');
  const authored = LIB.filter(p => !p.id.startsWith('pr-ol-'));
  const taught: any[] = [];
  for (const a of arr(syn.moduxAdditions)) {
    const p = a.pressure;
    if (a.kind !== 'pressure' || !p) continue;
    const name = str(p.name, 60);
    const id = 'pr-ol-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
    const counters = strs(p.counters, 80).filter(m => MODEL_IDS.has(m));
    const fits = strs(p.fits, 20).filter(x => TAGS.has(x));
    const why: string[] = [];
    if (!name || !str(p.move)) why.push('no name or move');
    if (!KINDS.includes(p.target)) why.push('target ' + p.target + ' is not a part kind');
    if (counters.length < 2) why.push('fewer than two catalog counters');
    if (authored.some(b => b.name.toLowerCase() === name.toLowerCase())) why.push('the library already has it');
    if (taught.some(b => b.id === id)) why.push('a repeat');
    if (why.length) { notes.push('synthesis: pressure "' + name + '" left out: ' + why.join(', ')); continue; }
    taught.push({ id, name, move: str(p.move, 300), counters: counters.slice(0, 4), weight: Math.max(1, Math.min(3, Math.round(Number(p.weight) || 2))), target: p.target, from: 2, fits, budget: 2 });
  }
  writeFileSync(join(ROOT, 'src', 'content', 'outlier', 'pressures.ts'),
    head + "import type { Pressure } from '../modux-schema';\n\n/* the pressures the outlier systems taught, from Davara's synthesis */\nexport const OUTLIER_PRESSURES: Pressure[] = " + JSON.stringify(taught, null, 1) + ';\n', 'utf-8');
  notes.push('synthesis: ' + taught.length + ' pressures join the library');
  writeFileSync(join(ROOT, 'src', 'content', 'outlier', 'synthesis.ts'),
    head + "import type { OutlierSynthesis } from './schema';\n\nexport const SYNTHESIS: OutlierSynthesis | null = " + JSON.stringify(syn, null, 1) + ';\n', 'utf-8');
} else if (!existsSync(join(ROOT, 'src', 'content', 'outlier', 'synthesis.ts'))) {
  writeFileSync(join(ROOT, 'src', 'content', 'outlier', 'synthesis.ts'),
    head + "import type { OutlierSynthesis } from './schema';\n\nexport const SYNTHESIS: OutlierSynthesis | null = null;\n", 'utf-8');
  notes.push('no _synthesis.json yet; synthesis.ts holds null');
}

/* the structure names the chapter prints, so the outlier chunk never imports the modux chunk */
{
  const used = new Set<string>();
  for (const e of entries) for (const s of e.securityLeverage) for (const m of s.models) used.add(m);
  if (existsSync(synPath)) for (const s of arr(JSON.parse(readFileSync(synPath, 'utf-8')).strongest)) for (const m of strs(s.models, 80)) if (MODEL_IDS.has(m)) used.add(m);
  const names = Object.fromEntries([...used].sort().map(id => [id, byId.get(id)!.name]));
  writeFileSync(join(ROOT, 'src', 'content', 'outlier', 'names.ts'),
    head + "/* catalog structure names for the ids the outlier entries cite */\nexport const MODEL_NAMES: Record<string, string> = " + JSON.stringify(names, null, 1) + ';\n', 'utf-8');
  notes.push(used.size + ' structure names written for the chapter');
}

console.log(entries.length + ' systems written' + (missing.length ? '; missing: ' + missing.join(', ') : ''));
for (const n of notes) console.log('  note  ' + n);
for (const f of fail) console.log('  FAIL  ' + f);
process.exit(fail.length ? 1 : 0);
