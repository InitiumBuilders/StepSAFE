/* The forge: make a new gauge from a seed.

   An archetype gives the organisation its shape: nodes, edges and sector
   tags. The pressure library gives the threats. The budget is set from a
   stack found by search, so every forged gauge can be held. The same seed
   always forges the same gauge; a new seed forges a new one. */

import type { ModuxGauge, GaugeThreat, GaugeSystem, ModuxModel, Pressure } from '../modux-schema';
import type { Hue } from '../schema';
import { PRESSURES } from './pressures';
import { fnv, rng, searchReference } from './escalate';

export interface Archetype {
  key: string;
  orgs: string[];
  sector: string;
  brief: string;
  titles: string[];
  tags: string[];
  essence: Hue;
  system: GaugeSystem;
  /** pressures this kind of organisation always faces, drawn first */
  signature?: string[];
}

export const ARCHETYPES: Archetype[] = [
  {
    key: 'time',
    orgs: ['Keystone Timing Cooperative', 'Continental Time Service', 'Northstar Time Exchange'],
    sector: 'Distributes precise time to a grid operator, two carriers and a trading venue',
    brief: 'Each site sets its clocks from satellite time and serves network time to its customers. The backup oscillators hold accurate time for about a day. One engineer manages the configuration for every site.',
    titles: ['Agreed Time', 'The Second That Slipped', 'Holdover'],
    tags: ['time', 'grid', 'telecom', 'finance', 'public'],
    essence: 'gold',
    signature: ['pr-clock-lies'],
    system: {
      nodes: [
        { id: 'sat', name: 'Satellite time receivers', kind: 'time' },
        { id: 'clocks', name: 'Holdover clocks', kind: 'control' },
        { id: 'ntp', name: 'Network time servers', kind: 'network' },
        { id: 'eng', name: 'Configuration engineer', kind: 'people' },
        { id: 'logs', name: 'Audit logs', kind: 'data' },
        { id: 'customers', name: 'Grid, carriers and trading venue', kind: 'public' },
      ],
      edges: [
        { from: 'sat', to: 'clocks', how: 'sets' },
        { from: 'clocks', to: 'ntp', how: 'feeds' },
        { from: 'ntp', to: 'customers', how: 'serves' },
        { from: 'eng', to: 'clocks', how: 'configures' },
        { from: 'ntp', to: 'logs', how: 'timestamps' },
      ],
    },
  },
  {
    key: 'water',
    orgs: ['Alder Creek Water District', 'Two Rivers Water Authority', 'Pine Hollow Utilities'],
    sector: 'Drinking water for 180,000 people',
    brief: 'Treatment runs from a control room, and after hours through a remote access tool the equipment vendor installed. The business office and the plant share one network. Alarms go to one phone.',
    titles: ['After Hours At The Plant', 'One Phone For The Alarms', 'The Vendor Login'],
    tags: ['water', 'ot', 'public', 'emergency'],
    essence: 'cyan',
    signature: ['pr-into-ot'],
    system: {
      nodes: [
        { id: 'office', name: 'Business office network', kind: 'network' },
        { id: 'remote', name: 'Vendor remote access', kind: 'vendor' },
        { id: 'room', name: 'Control room', kind: 'control' },
        { id: 'treat', name: 'Treatment controls', kind: 'control' },
        { id: 'ops', name: 'Plant operators', kind: 'people' },
        { id: 'residents', name: 'Residents', kind: 'public' },
      ],
      edges: [
        { from: 'office', to: 'room', how: 'reaches' },
        { from: 'remote', to: 'room', how: 'logs into' },
        { from: 'room', to: 'treat', how: 'sets' },
        { from: 'ops', to: 'room', how: 'watch' },
        { from: 'treat', to: 'residents', how: 'serves' },
      ],
    },
  },
  {
    key: 'bank',
    orgs: ['First Prairie Community Bank', 'Blue Ridge Savings', 'Lakeshore Credit Union'],
    sector: 'Community bank, 14 branches, 90,000 accounts',
    brief: 'Core banking runs at a service provider. Wire transfers are approved by one officer by phone. Staff reach the core system from home through a shared remote desktop.',
    titles: ['The Wire Room', 'Settlement Day', 'Fourteen Branches'],
    tags: ['finance', 'payments', 'identity', 'data'],
    essence: 'gold',
    system: {
      nodes: [
        { id: 'staff', name: 'Branch staff', kind: 'people' },
        { id: 'logins', name: 'Staff identities', kind: 'identity' },
        { id: 'rdp', name: 'Shared remote desktop', kind: 'network' },
        { id: 'core', name: 'Core banking provider', kind: 'vendor' },
        { id: 'wires', name: 'Wire approvals', kind: 'money' },
        { id: 'files', name: 'Customer files', kind: 'data' },
      ],
      edges: [
        { from: 'logins', to: 'rdp', how: 'open' },
        { from: 'rdp', to: 'core', how: 'reaches' },
        { from: 'core', to: 'files', how: 'holds' },
        { from: 'staff', to: 'wires', how: 'approve' },
        { from: 'core', to: 'wires', how: 'executes' },
      ],
    },
  },
  {
    key: 'hospital',
    orgs: ['Copper Valley Medical Center', 'Northgate Community Hospital', 'St. Ansgar Regional'],
    sector: 'Rural hospital, 120 beds, the only emergency room for 90 miles',
    brief: 'Imaging, pharmacy and the health record share one network. A vendor supports the imaging systems remotely. The IT team is four people.',
    titles: ['Ninety Miles To The Next ER', 'The Holiday Weekend', 'Four People On Call'],
    tags: ['health', 'ot', 'data', 'emergency'],
    essence: 'ember',
    system: {
      nodes: [
        { id: 'net', name: 'Hospital network', kind: 'network' },
        { id: 'ehr', name: 'Health record', kind: 'data' },
        { id: 'clinical', name: 'Imaging and pharmacy', kind: 'control' },
        { id: 'support', name: 'Vendor remote support', kind: 'vendor' },
        { id: 'it', name: 'The IT team', kind: 'people' },
        { id: 'patients', name: 'Patients', kind: 'public' },
      ],
      edges: [
        { from: 'support', to: 'net', how: 'connects into' },
        { from: 'net', to: 'ehr', how: 'holds' },
        { from: 'net', to: 'clinical', how: 'runs' },
        { from: 'clinical', to: 'patients', how: 'treats' },
        { from: 'it', to: 'net', how: 'keep up' },
      ],
    },
  },
  {
    key: 'coop',
    orgs: ['Kettle Falls Electric Cooperative', 'Red Mesa Power', 'Granite Plains Electric'],
    sector: 'Rural electric cooperative serving 60,000 members',
    brief: 'Field substations report to a control center over a mix of radio and leased lines. The control network and the office network meet at one firewall that nobody has reviewed in years.',
    titles: ['The Substation Link', 'One Firewall', 'Winter Peak'],
    tags: ['grid', 'ot', 'public', 'emergency', 'time'],
    essence: 'cyan',
    system: {
      nodes: [
        { id: 'office', name: 'Office network', kind: 'network' },
        { id: 'control', name: 'Control center', kind: 'control' },
        { id: 'subs', name: 'Substations', kind: 'control' },
        { id: 'clock', name: 'Grid time source', kind: 'time' },
        { id: 'crew', name: 'Operators and crews', kind: 'people' },
        { id: 'members', name: 'Members on the line', kind: 'public' },
      ],
      edges: [
        { from: 'office', to: 'control', how: 'meets at one firewall' },
        { from: 'control', to: 'subs', how: 'commands' },
        { from: 'clock', to: 'subs', how: 'synchronises' },
        { from: 'crew', to: 'control', how: 'operate' },
        { from: 'subs', to: 'members', how: 'power' },
      ],
    },
  },
  {
    key: 'carrier',
    orgs: ['Midland Mobile', 'Clearpath Telecom', 'Ridgeline Wireless'],
    sector: 'Regional carrier, 2 million subscribers',
    brief: 'Core routers are managed from a jump host shared by three teams. Lawful request systems sit on the same management network. Network time comes from satellite receivers at each site.',
    titles: ['The Jump Host', 'Quiet On The Core', 'Who Is Listening'],
    tags: ['telecom', 'public', 'data', 'identity', 'time'],
    essence: 'azure',
    system: {
      nodes: [
        { id: 'jump', name: 'Shared jump host', kind: 'network' },
        { id: 'admins', name: 'Network admins', kind: 'identity' },
        { id: 'core', name: 'Core routers', kind: 'control' },
        { id: 'lawful', name: 'Lawful request systems', kind: 'data' },
        { id: 'clock', name: 'Site time receivers', kind: 'time' },
        { id: 'subs', name: 'Subscribers', kind: 'public' },
      ],
      edges: [
        { from: 'admins', to: 'jump', how: 'use' },
        { from: 'jump', to: 'core', how: 'manages' },
        { from: 'jump', to: 'lawful', how: 'reaches' },
        { from: 'clock', to: 'core', how: 'synchronises' },
        { from: 'core', to: 'subs', how: 'carries' },
      ],
    },
  },
  {
    key: 'saas',
    orgs: ['Brightlane Software', 'Northpeak Cloud', 'Fieldstone Apps'],
    sector: 'Business software company, 300 staff, 9,000 customers',
    brief: 'Everything runs in one cloud account. Engineers deploy from their laptops with long lived keys. Customer data and internal tools share the same database cluster.',
    titles: ['One Cloud Account', 'Deploy From A Laptop', 'The Shared Cluster'],
    tags: ['saas', 'cloud', 'build', 'data', 'identity'],
    essence: 'azure',
    system: {
      nodes: [
        { id: 'eng', name: 'Engineers', kind: 'people' },
        { id: 'sso', name: 'Single sign on', kind: 'identity' },
        { id: 'pipeline', name: 'Build pipeline', kind: 'build' },
        { id: 'cloud', name: 'Cloud account', kind: 'network' },
        { id: 'db', name: 'Customer database', kind: 'data' },
        { id: 'deps', name: 'Open source dependencies', kind: 'vendor' },
      ],
      edges: [
        { from: 'sso', to: 'cloud', how: 'opens' },
        { from: 'eng', to: 'pipeline', how: 'push to' },
        { from: 'deps', to: 'pipeline', how: 'feed' },
        { from: 'pipeline', to: 'cloud', how: 'deploys to' },
        { from: 'cloud', to: 'db', how: 'hosts' },
      ],
    },
  },
  {
    key: 'agents',
    orgs: ['Meridia Operations', 'Tallow Logistics AI', 'Cobalt Agentworks'],
    sector: 'Operations company where AI agents handle most routine work',
    brief: 'Agents read email, update orders, pay invoices under a limit and ask each other for help. Staff review a sample of agent actions each week.',
    titles: ['The Agents Talk To Each Other', 'Under The Limit', 'The Weekly Sample'],
    tags: ['ai', 'saas', 'payments', 'data'],
    essence: 'violet',
    system: {
      nodes: [
        { id: 'inbox', name: 'Inbound email', kind: 'public' },
        { id: 'agents', name: 'Agent fleet', kind: 'model' },
        { id: 'tokens', name: 'Agent credentials', kind: 'identity' },
        { id: 'invoices', name: 'Invoice payments', kind: 'money' },
        { id: 'orders', name: 'Order records', kind: 'data' },
        { id: 'reviewers', name: 'Staff reviewers', kind: 'people' },
      ],
      edges: [
        { from: 'inbox', to: 'agents', how: 'read by' },
        { from: 'tokens', to: 'agents', how: 'empower' },
        { from: 'agents', to: 'invoices', how: 'pay' },
        { from: 'agents', to: 'orders', how: 'update' },
        { from: 'reviewers', to: 'agents', how: 'sample' },
      ],
    },
  },
];

function shuffle<T>(a: T[], r: () => number): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A fresh seed string for the forge button. */
export function freshSeed(): string {
  return Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
}

/** Forge a gauge. Null only if the library cannot fill it, which the probe rules out. */
export function forgeGauge(seed: string, byId: Map<string, ModuxModel>): ModuxGauge | null {
  const r = rng(fnv('forge|' + seed));
  const pick = <T,>(a: T[]): T => a[Math.floor(r() * a.length)];
  const arch = pick(ARCHETYPES);
  const kinds = new Set(arch.system.nodes.map(n => n.kind));

  const pool = shuffle(PRESSURES.filter(p =>
    !p.open && !p.weakens && p.from <= 2 && kinds.has(p.target) &&
    (p.fits.length === 0 || p.fits.some(t => arch.tags.includes(t)))), r);

  /* five threats: the archetype's signature first, then spread across the
     system before any node is hit twice */
  const chosen: Pressure[] = [];
  const hit = new Set<string>();
  for (const id of arch.signature || []) {
    const p = PRESSURES.find(x => x.id === id);
    if (p && kinds.has(p.target)) { chosen.push(p); hit.add(p.target); }
  }
  for (const p of pool) { if (chosen.length >= 5) break; if (!chosen.includes(p) && !hit.has(p.target)) { chosen.push(p); hit.add(p.target); } }
  for (const p of pool) { if (chosen.length >= 5) break; if (!chosen.includes(p)) chosen.push(p); }
  if (chosen.length < 4) return null;

  const threats: GaugeThreat[] = chosen.map((p, i) => {
    const nodes = arch.system.nodes.filter(n => n.kind === p.target);
    return {
      id: String.fromCharCode(97 + i), name: p.name, move: p.move, counters: p.counters,
      weight: p.weight, target: pick(nodes).id,
    };
  });

  const id = 'fg-' + fnv(seed).toString(36);
  const draft: ModuxGauge = {
    id, title: pick(arch.titles), org: pick(arch.orgs), sector: arch.sector, brief: arch.brief,
    adversary: 'Whoever finds the weakest node first',
    budget: 99, threats, expert: [], debrief: '', essence: arch.essence,
    system: arch.system, tags: arch.tags, origin: 'forged', seed,
  };
  const found = searchReference(draft, byId);
  if (!found.covered) return null;
  /* a little room above the found stack, never so much that everything fits */
  const budget = found.spent + (r() < 0.5 ? 1 : 2);
  const ref = searchReference({ ...draft, budget }, byId);
  const names = ref.stack.map(x => byId.get(x)?.name).filter(Boolean).join(', ');
  return {
    ...draft,
    budget,
    expert: ref.stack,
    debrief: 'This gauge was forged from a seed, and its reference stack was found by search: ' + names +
      '. A search finds coverage and depth. It does not look for structures that compound, so a careful stack can beat it.',
  };
}
