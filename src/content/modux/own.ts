/* MAP YOUR OWN SYSTEM. A practitioner names the parts of their own
   organisation, what each depends on, and who it serves, chooses the threats
   that apply from the pressure library, and the forge turns it into a gauge:
   a reference stack found by search and a budget set so the gauge can be
   held. The World then draws their own system and runs its stress day.
   Deterministic for the same map and the same choice of threats. */

import type { ModuxGauge, ModuxModel, GaugeThreat, NodeKind, Pressure, GaugeSystem } from '../modux-schema';
import { NODE_KIND_LABEL } from '../modux-schema';
import { PRESSURES } from './pressures';
import { fnv, rng, searchReference } from './escalate';
import { ARCHETYPES } from './forge';
import { buildModel, stressDay } from './dynamics';
import { peopleOf, peopleCount } from '../../lib/people';
import { KNOWN_SYSTEMS } from '../outlier/systems';
import type { KnownSystem } from '../outlier/schema';

export type OwnHow = 'needs' | 'supplied' | 'serves';
export interface OwnPart { id: string; name: string; kind: NodeKind; dependsOn: string[]; how: OwnHow; /** how each dependency is joined; `how` is the default for any not listed */ hows?: Record<string, OwnHow> }
export interface OwnSpec { org: string; serves: string; tags: string[]; parts: OwnPart[]; brief: string; threatIds: string[]; /** the known system this map was started from */ known?: string; /** the reading in the learner's own words: the question it answers, its outlier move, its strongest security lever */ keystone?: string; outlier?: string; lever?: string }

/** how a dependency is written on the pipe, from the part depended on to the part that depends */
export const HOW_LINE: Record<OwnHow, { label: string; verb: string; note: string }> = {
  needs: { label: 'Needs it live', verb: 'keeps running', note: 'Fails within minutes of the other part failing.' },
  supplied: { label: 'Is supplied by it', verb: 'supplies', note: 'Runs for hours on what it has before the loss shows.' },
  serves: { label: 'Serves people through it', verb: 'serves', note: 'The people feel the loss about an hour later.' },
};

export const TAG_CHOICES: { tag: string; label: string }[] = [
  { tag: 'water', label: 'Water' }, { tag: 'grid', label: 'Electric grid' }, { tag: 'telecom', label: 'Telecom' },
  { tag: 'health', label: 'Health care' }, { tag: 'finance', label: 'Finance' }, { tag: 'payments', label: 'Payments' },
  { tag: 'emergency', label: 'Emergency services' }, { tag: 'public', label: 'Public service' }, { tag: 'ot', label: 'Industrial control' },
  { tag: 'saas', label: 'Software service' }, { tag: 'cloud', label: 'Cloud' }, { tag: 'build', label: 'Software build' },
  { tag: 'data', label: 'Data' }, { tag: 'identity', label: 'Identity' }, { tag: 'ai', label: 'AI systems' }, { tag: 'time', label: 'Time service' },
];

/** what each kind of part means, for the builder */
export const KIND_HINT: Record<NodeKind, string> = {
  people: 'The staff or community who run it.',
  public: 'The people it serves, and their trust in it.',
  identity: 'Who is who: accounts, sign in, and the keys that prove an account.',
  network: 'How it is reached, and how its parts talk to each other.',
  data: 'What it stores and what it knows.',
  build: 'How its software is written, built and released.',
  money: 'How money comes in and goes out.',
  control: 'A decision system: governance, ranking, moderation, a policy engine or a control room.',
  model: 'An AI model it runs or depends on.',
  time: 'A clock it depends on.',
  vendor: 'A supplier or dependency it does not run itself.',
};

export const MAX_PARTS = 10;
export const MIN_THREATS = 4;
export const MAX_THREATS = 8;

export function emptySpec(): OwnSpec {
  return { org: '', serves: '', tags: [], brief: '', threatIds: [], parts: [
    { id: 'p1', name: '', kind: 'control', dependsOn: [], how: 'needs' },
    { id: 'p2', name: '', kind: 'people', dependsOn: [], how: 'needs' },
    { id: 'p3', name: '', kind: 'public', dependsOn: [], how: 'serves' },
  ] };
}

/** the kind of link a pipe's words describe: the builder's own words exactly, or the forge's by their sense */
const howOf = (verb: string, toKind: NodeKind): OwnHow => {
  const exact = (Object.keys(HOW_LINE) as OwnHow[]).find(h => HOW_LINE[h].verb === verb);
  if (exact) return exact;
  return /suppl|power|ship|sends help|treats|deliver/i.test(verb) ? 'supplied' : (toKind === 'public' || /serve/i.test(verb)) ? 'serves' : 'needs';
};

/** a spec seeded from one of the forge's archetypes, to edit from */
export function specFromTemplate(key: string): OwnSpec | null {
  const a = ARCHETYPES.find(x => x.key === key);
  if (!a) return null;
  const parts: OwnPart[] = a.system.nodes.map(n => ({ id: n.id, name: n.name, kind: n.kind, dependsOn: [], how: 'needs' as OwnHow }));
  for (const e of a.system.edges) {
    const to = parts.find(p => p.id === e.to);
    if (!to) continue;
    to.dependsOn.push(e.from);
    to.hows = { ...(to.hows || {}), [e.from]: howOf(e.how, to.kind) };
    to.how = howOf(e.how, to.kind);
  }
  return { org: a.orgs[0], serves: a.sector, tags: [...a.tags], brief: a.brief, parts, threatIds: [] };
}

/** the map a gauge was built from, read back from the gauge, for editing */
export function specFromGauge(g: ModuxGauge): OwnSpec {
  const parts: OwnPart[] = g.system.nodes.map(n => ({ id: n.id, name: n.name, kind: n.kind, dependsOn: [], how: 'needs' as OwnHow }));
  for (const e of g.system.edges) {
    const to = parts.find(p => p.id === e.to);
    if (!to) continue;
    to.dependsOn.push(e.from);
    to.hows = { ...(to.hows || {}), [e.from]: howOf(e.how, to.kind) };
    to.how = howOf(e.how, to.kind);
  }
  const threatIds = g.threats.map(t => PRESSURES.find(p => p.name === t.name && p.target === g.system.nodes.find(n => n.id === t.target)?.kind)?.id).filter((x): x is string => !!x);
  return { org: g.org, serves: g.sector, tags: [...g.tags], brief: g.brief, parts, threatIds };
}

export function templates(): { key: string; label: string }[] {
  return ARCHETYPES.map(a => ({ key: a.key, label: a.orgs[0] + ' · ' + a.sector }));
}

/* ---------- known systems: real organisations, mapped from public sources ---------- */

export function knownById(id: string): KnownSystem | undefined {
  return KNOWN_SYSTEMS.find(k => k.id === id);
}

/** a spec seeded from a known system's map, to run as it is or edit from */
export function specFromKnown(id: string): OwnSpec | null {
  const k = knownById(id);
  if (!k) return null;
  const parts: OwnPart[] = k.map.parts.map(p => {
    const into = k.map.links.filter(l => l.to === p.id);
    return {
      id: p.id, name: p.name, kind: p.kind,
      dependsOn: into.map(l => l.from),
      how: into[0]?.how || (p.kind === 'public' ? 'serves' : 'needs'),
      hows: Object.fromEntries(into.map(l => [l.from, l.how])),
    };
  });
  return { org: k.name.slice(0, 60), serves: k.serves.slice(0, 120), tags: [...k.tags], brief: k.brief.slice(0, 600), parts, threatIds: [...k.map.threats], known: k.id };
}

/** the groups the known systems are read in, in reading order */
export function knownGroups(): { group: string; systems: KnownSystem[] }[] {
  const out: { group: string; systems: KnownSystem[] }[] = [];
  for (const k of KNOWN_SYSTEMS) {
    const g = out.find(x => x.group === k.group);
    if (g) g.systems.push(k); else out.push({ group: k.group, systems: [k] });
  }
  return out;
}

/** the known system whose map is shaped most like this one: shared part kinds and tags, then the same size */
export function closestKnown(spec: OwnSpec): { system: KnownSystem; shared: NodeKind[]; tags: string[] } | null {
  const kinds = new Set(spec.parts.filter(p => p.name.trim()).map(p => p.kind));
  if (kinds.size < 2) return null;
  let best: { system: KnownSystem; shared: NodeKind[]; tags: string[]; score: number } | null = null;
  for (const k of KNOWN_SYSTEMS) {
    if (k.id === spec.known) continue;
    const theirs = new Set(k.map.parts.map(p => p.kind));
    const shared = [...kinds].filter(x => theirs.has(x));
    const tags = spec.tags.filter(x => k.tags.includes(x));
    const union = new Set([...kinds, ...theirs]).size;
    const score = shared.length / union + tags.length * 0.25 - Math.abs(k.map.parts.length - kinds.size) * 0.01;
    if (!best || score > best.score) best = { system: k, shared, tags, score };
  }
  return best && best.shared.length >= 2 ? { system: best.system, shared: best.shared, tags: best.tags } : null;
}

/** what stops a map from becoming a gauge, in order; empty when it can */
export function problemsOf(spec: OwnSpec): string[] {
  const out: string[] = [];
  if (!spec.org.trim()) out.push('Name the organisation.');
  if (!spec.serves.trim()) out.push('Say who it serves, with a number if you have one.');
  const parts = spec.parts.filter(p => p.name.trim());
  if (parts.length < 3) out.push('Name at least three parts.');
  if (!parts.some(p => p.kind === 'public' || p.kind === 'people')) out.push('One part must be the people: the public the service reaches, or the staff who run it.');
  const edges = parts.reduce((n, p) => n + p.dependsOn.filter(id => parts.some(q => q.id === id && q.id !== p.id)).length, 0);
  if (edges < 2) out.push('Draw at least two dependencies.');
  if (out.length === 0 && candidates(spec).length < MIN_THREATS) out.push('The pressure library has fewer than four threats for these kinds of parts. Add a part of another kind.');
  return out;
}

/** the kind of link between a part and one of its dependencies */
export function howFor(p: OwnPart, dep: string): OwnHow {
  return (p.hows && p.hows[dep]) || p.how;
}

export function systemOf(spec: OwnSpec): GaugeSystem {
  const parts = spec.parts.filter(p => p.name.trim());
  const ids = new Set(parts.map(p => p.id));
  return {
    nodes: parts.map(p => ({ id: p.id, name: p.name.trim().slice(0, 48), kind: p.kind })),
    edges: parts.flatMap(p => p.dependsOn.filter(id => ids.has(id) && id !== p.id).map(id => ({ from: id, to: p.id, how: HOW_LINE[howFor(p, id)].verb }))),
  };
}

/** the threats the library holds for the kinds of parts on the map, in library order */
export function candidates(spec: OwnSpec): Pressure[] {
  const kinds = new Set(spec.parts.filter(p => p.name.trim()).map(p => p.kind));
  return PRESSURES.filter(p =>
    !p.open && !p.weakens && p.from <= 2 && kinds.has(p.target) &&
    (p.fits.length === 0 || p.fits.some(t => spec.tags.includes(t))));
}

function seedOf(spec: OwnSpec): string {
  const system = systemOf(spec);
  return JSON.stringify({ o: spec.org.trim(), s: spec.serves.trim(), t: spec.tags, n: system.nodes, e: system.edges });
}

/** the threats the forge would choose on its own: spread across the parts before any is hit twice */
export function defaultThreatIds(spec: OwnSpec): string[] {
  const pool = candidates(spec);
  const r = rng(fnv('own|' + seedOf(spec)));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  const want = Math.max(MIN_THREATS, Math.min(6, Math.ceil(systemOf(spec).nodes.length / 2) + 2));
  const chosen: Pressure[] = [];
  const hit = new Set<string>();
  for (const p of shuffled) { if (chosen.length >= want) break; if (!hit.has(p.target)) { chosen.push(p); hit.add(p.target); } }
  for (const p of shuffled) { if (chosen.length >= want) break; if (!chosen.includes(p)) chosen.push(p); }
  return chosen.map(p => p.id);
}

/** the threats a map carries: the chosen ones when enough are chosen, the forge's own choice otherwise */
export function effectiveThreatIds(spec: OwnSpec): string[] {
  const pool = new Set(candidates(spec).map(p => p.id));
  const chosen = spec.threatIds.filter(id => pool.has(id)).slice(0, MAX_THREATS);
  return chosen.length >= MIN_THREATS ? chosen : defaultThreatIds(spec);
}

export interface MapRead {
  people: string | null;
  /** the part most parts depend on, with the count */
  hub: { name: string; dependents: number } | null;
  /** parts nothing depends on and that depend on nothing */
  loose: string[];
  /** the longest chain of dependencies that ends at the people, upstream first */
  chain: string[];
  /** the people the day cannot touch: a public part that depends on nothing, or staff that depend on nothing when no public part is reached or they supply nothing */
  unreached: string[];
  /** hours of service kept on a stress day with nothing in place, and with the reference stack */
  bare: number | null;
  withRef: number | null;
  threats: number;
}

/** what the map says before it is a gauge; the two day numbers come from the model when the map builds */
export function readMap(spec: OwnSpec, byId: Map<string, ModuxModel>): MapRead {
  const system = systemOf(spec);
  const dependents = new Map<string, number>();
  for (const e of system.edges) dependents.set(e.from, (dependents.get(e.from) || 0) + 1);
  const top = [...dependents.entries()].sort((a, b) => b[1] - a[1])[0];
  const touched = new Set(system.edges.flatMap(e => [e.from, e.to]));
  const loose = system.nodes.filter(n => !touched.has(n.id)).map(n => n.name);
  /* the longest chain into a people part: follow dependencies upstream, no part twice */
  const into = new Map<string, string[]>();
  for (const e of system.edges) into.set(e.to, [...(into.get(e.to) || []), e.from]);
  const longest = (id: string, seen: Set<string>): string[] => {
    let best: string[] = [];
    for (const up of into.get(id) || []) {
      if (seen.has(up)) continue;
      const c = longest(up, new Set([...seen, up]));
      if (c.length + 1 > best.length) best = [...c, up];
    }
    return best;
  };
  let chain: string[] = [];
  for (const n of system.nodes.filter(x => x.kind === 'public' || x.kind === 'people')) {
    const c = longest(n.id, new Set([n.id]));
    if (c.length + 1 > chain.length) chain = [...c, n.id];
  }
  const name = (id: string) => system.nodes.find(n => n.id === id)?.name || id;
  /* a people or public part that supplies others (staff, a trusted name) is on the map when the public is reached elsewhere; with no public part reached, the day must reach it */
  const publicReached = system.nodes.some(x => x.kind === 'public' && (into.get(x.id) || []).length > 0);
  const ok = problemsOf(spec).length === 0;
  const g = ok ? buildOwnGauge(spec, byId) : null;
  return {
    people: peopleOf(spec.serves),
    hub: top && top[1] >= 2 ? { name: name(top[0]), dependents: top[1] } : null,
    loose,
    chain: chain.length >= 2 ? chain.map(name) : [],
    unreached: system.nodes.filter(x => !(into.get(x.id) || []).length &&
      (x.kind === 'public' || x.kind === 'people') && (!publicReached || !dependents.has(x.id))).map(x => x.name),
    bare: g ? Math.max(0, 24 - stressDay(buildModel(g, [], byId))) : null,
    withRef: g ? Math.max(0, 24 - stressDay(buildModel(g, g.expert, byId))) : null,
    threats: ok ? effectiveThreatIds(spec).length : 0,
  };
}

export function buildOwnGauge(spec: OwnSpec, byId: Map<string, ModuxModel>): ModuxGauge | null {
  if (problemsOf(spec).length) return null;
  const system = systemOf(spec);
  const ids = effectiveThreatIds(spec);
  const key = seedOf(spec) + '|' + ids.join(',');
  const r = rng(fnv('own|' + key));
  const chosen = ids.map(id => PRESSURES.find(p => p.id === id)!).filter(Boolean);
  if (chosen.length < MIN_THREATS) return null;

  /* targets: spread over the parts of each kind before any part is hit twice */
  const hit = new Set<string>();
  const threats: GaugeThreat[] = chosen.map((p, i) => {
    const nodes = system.nodes.filter(n => n.kind === p.target);
    const fresh = nodes.filter(n => !hit.has(n.id));
    const node = (fresh.length ? fresh : nodes)[Math.floor(r() * (fresh.length ? fresh.length : nodes.length))];
    hit.add(node.id);
    return { id: String.fromCharCode(97 + i), name: p.name, move: p.move, counters: p.counters, weight: p.weight, target: node.id };
  });

  const org = spec.org.trim().slice(0, 60);
  const count = peopleCount(spec.serves);
  const draft: ModuxGauge = {
    id: 'own-' + fnv(key).toString(36),
    title: 'A Stress Day At ' + org,
    org,
    sector: spec.serves.trim().slice(0, 120),
    brief: (spec.brief.trim() || 'Your own system, mapped by hand: ' + system.nodes.length + ' parts and ' + system.edges.length + ' dependencies' + (count ? ', serving ' + count.toLocaleString() + ' people' : '') + '. The threats were chosen from the pressure library for the kinds of parts you named.').slice(0, 600),
    adversary: 'Whoever finds the weakest part first',
    budget: 99, threats, expert: [], debrief: '',
    essence: spec.tags.includes('finance') || spec.tags.includes('payments') ? 'gold' : spec.tags.includes('health') || spec.tags.includes('emergency') ? 'ember' : spec.tags.includes('ai') || spec.tags.includes('saas') ? 'violet' : 'cyan',
    system, tags: [...spec.tags], origin: 'forged', seed: 'own',
  };
  const found = searchReference(draft, byId);
  if (!found.covered) return null;
  const budget = found.spent + (r() < 0.5 ? 1 : 2);
  const ref = searchReference({ ...draft, budget }, byId);
  const names = ref.stack.map(x => byId.get(x)?.name).filter(Boolean).join(', ');
  return {
    ...draft, budget, expert: ref.stack,
    debrief: 'This gauge was mapped by hand from your own system. Its reference stack was found by search: ' + names +
      '. A search finds coverage and depth. It does not look for structures that compound, so a careful stack can beat it.',
  };
}

export const KIND_LABEL = NODE_KIND_LABEL;
