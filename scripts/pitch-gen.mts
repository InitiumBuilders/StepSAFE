/* THE PITCH, COUNTED. Every number the welcome page shows comes from the content itself, written
   here into a small file so the page loads fast and never carries a figure nobody can trace.
   Run: npx tsx scripts/pitch-gen.mts   (probe-pitch.mts fails when the file and the content differ)

   With --print it writes nothing and prints the file it would write. */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

(globalThis as any).self = globalThis;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export async function buildPitch() {
  const C = await import('../src/content/index');
  const { CATALOG } = await import('../src/content/modux/catalog');
  const { FAMILY_LABEL, TIER_COST } = await import('../src/content/modux-schema');
  const { STACKS } = await import('../src/content/modux/stacks');
  const { COURSES } = await import('../src/content/modux/courses');
  const { GAUGES } = await import('../src/content/modux/gauges');
  const { PRESSURES } = await import('../src/content/modux/pressures');
  const { KNOWN_SYSTEMS } = await import('../src/content/outlier/systems');
  const { COMMONS } = await import('../src/content/outlier/commons');
  const { deck, KIND_LABEL } = await import('../src/lib/study/cards');
  const { PHASE_NAMES } = await import('../src/lib/state');

  const core = C.CHAPTERS;
  const steps = core.flatMap(c => c.pages.flatMap(p => p.steps));
  const tier = (t: string) => C.AWARDS.filter(a => a.tier === t);
  const pickAwards = (t: string) => tier(t).filter(a => a.statement.length < 150).slice(0, 3).map(a => ({ name: a.name, statement: a.statement }));

  const families = [...new Set(CATALOG.map(m => m.family))].map(f => {
    const ms = CATALOG.filter(m => m.family === f);
    return { id: f, label: (FAMILY_LABEL as Record<string, string>)[f] || f, count: ms.length, examples: ms.slice(0, 2).map(m => m.name) };
  });
  const tiers: Record<string, number> = {};
  for (const m of CATALOG) tiers[m.tier] = (tiers[m.tier] || 0) + 1;

  /* the web between families: how many connections join each pair */
  const famOf = new Map(CATALOG.map(m => [m.id, m.family]));
  const pair = new Map<string, number>();
  for (const m of C.MODUX_MODELS) for (const x of m.combines) {
    const a = famOf.get(m.id), b = famOf.get(x.model);
    if (!a || !b || a === b) continue;
    const k = [a, b].sort().join('|');
    pair.set(k, (pair.get(k) || 0) + 1);
  }
  const famLinks = [...pair].map(([k, n]) => { const [a, b] = k.split('|'); return { a, b, n }; }).sort((x, y) => y.n - x.n);
  const { BEAT } = await import('../src/lib/systemStates');
  const { VERBS } = await import('../src/lib/hardening');
  /* one room's opening, as it arrives: the first injects of the room with the shortest lines */
  const room = [...C.SIMS].sort((x, y) => x.injects.slice(0, 4).reduce((n, i) => n + i.text.length, 0) - y.injects.slice(0, 4).reduce((n, i) => n + i.text.length, 0))[0];

  const cards = deck();
  const kinds: Record<string, number> = {};
  for (const c of cards) kinds[c.kind] = (kinds[c.kind] || 0) + 1;
  /* five cards to try, one of each of five kinds, short enough to read at a glance */
  const sample = (['term', 'model', 'threat', 'incident', 'room'] as const).map(k =>
    cards.filter(c => c.kind === k && c.cue.length < 170 && c.answer.length < 260 && c.answer.length > 40)[0]).filter(Boolean)
    .map(c => ({ kind: c.kind, kindLabel: (KIND_LABEL as Record<string, string>)[c.kind], title: c.title, domain: c.domain, cue: c.cue, answer: c.answer }));


  return {
    chapters: {
      count: core.length,
      pages: core.reduce((n, c) => n + c.pages.length, 0),
      steps: steps.length,
      hours: Math.round(steps.reduce((n, s) => n + (s.minutes || 0), 0) / 60),
      list: core.map(c => ({ order: c.order, title: c.title, act: c.act })),
    },
    awards: {
      total: C.AWARDS.length, small: tier('small').length, strong: tier('strong').length, safe: tier('safe').length,
      examples: { small: pickAwards('small'), strong: pickAwards('strong'), safe: pickAwards('safe') },
    },
    unit: { members: C.UNIT.length, phases: Object.values(PHASE_NAMES as Record<string, string>) },
    practice: { rooms: C.SIMS.length, injects: C.SIMS.reduce((n, s) => n + s.injects.length, 0), examples: C.SIMS.slice(0, 6).map(s => ({ title: s.title, org: s.org, minutes: s.minutes })) },
    guides: { count: C.GUIDES.length, terms: C.TERMS.length },
    modux: {
      models: CATALOG.length, families, tiers, tierCost: TIER_COST,
      stacks: STACKS.length, stackExamples: STACKS.slice(0, 4).map(s => s.name),
      courses: COURSES.length, courseNames: COURSES.map(c => c.title),
      connections: C.MODUX_MODELS.reduce((n, m) => n + m.combines.length, 0),
    },
    gauges: { authored: GAUGES.length, pressures: PRESSURES.length },
    famLinks,
    beat: BEAT,
    verbs: VERBS.map(v => ({ id: v.id, label: v.label, line: v.line })),
    room: { title: room.title, org: room.org, injects: room.injects.slice(0, 4).map(i => ({ t: i.t, channel: i.channel, from: i.from, text: i.text })) },
    systems: {
      known: KNOWN_SYSTEMS.length,
      threats: KNOWN_SYSTEMS.reduce((n, k) => n + (k.map?.threats?.length || 0), 0),
      sources: KNOWN_SYSTEMS.reduce((n, k) => n + k.sources.length, 0),
      groups: [...new Set(KNOWN_SYSTEMS.map(k => k.group))],
      examples: KNOWN_SYSTEMS.slice(0, 12).map(k => k.name),
    },
    commons: { foundations: COMMONS.foundations.length, roots: COMMONS.foundations.reduce((n, f) => n + f.rests.length, 0), names: COMMONS.foundations.map(f => f.name) },
    study: { cards: cards.length, kinds, kindLabels: KIND_LABEL, sample },
  };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url).replace(/\\/g, '/').toLowerCase() === process.argv[1].replace(/\\/g, '/').toLowerCase();
if (isMain) {
  const p = await buildPitch();
  const out = '/* GENERATED by scripts/pitch-gen.mts from the content. Do not edit by hand; run the script.\n   The welcome page reads every number it shows from here. */\n\nexport const PITCH = ' + JSON.stringify(p, null, 1) + ' as const;\n';
  if (process.argv.includes('--print')) console.log(out);
  else { writeFileSync(join(ROOT, 'src', 'content', 'pitch.ts'), out, 'utf-8'); console.log('pitch written: ' + out.length + ' chars'); }
}
