/* THE MODEL, CHECKED. Three public incidents written as the smallest map
   that carries their shape, with what is known about how each day went. The
   model is not fitted to them; its constants are set by hand. These are the
   checks it has to pass: what fell first, and whether the structure that
   made the difference in the real day makes the difference in the model.
   probe-calibration.mts runs them before every deploy. */

import type { ModuxGauge } from '../modux-schema';

export interface Check {
  /** a stack, the bound on the hours kept on the stress day, and why */
  stack: string[];
  label: string;
  min?: number;
  max?: number;
}

export interface IncidentShape {
  id: string;
  name: string;
  when: string;
  known: string;
  source: string;
  gauge: ModuxGauge;
  checks: Check[];
  /** the part that has to fall first, or among the first, with nothing in place */
  fallsFirst: string;
}

const base = { adversary: 'A real adversary', expert: [], debrief: '', tags: [], origin: 'authored' as const, essence: 'cyan' as const, budget: 12 };

export const INCIDENTS: IncidentShape[] = [
  {
    id: 'cal-booster',
    name: 'Manual mode at a booster station',
    when: 'Aliquippa, Pennsylvania, November 2023',
    known: 'An internet facing controller with a default password was taken over and its screen defaced. The authority took the booster station to manual operation and said there was no known risk to the water.',
    source: 'CISA, FBI, NSA and EPA advisory AA23-335A (December 2023), and the authority’s own statement.',
    fallsFirst: 'ctl',
    gauge: {
      ...base, id: 'cal-booster', title: 'The Booster Station', org: 'A municipal water authority', sector: 'Drinking water for a small town',
      brief: 'A booster station run by one internet facing controller.',
      threats: [{ id: 'a', name: 'Default password on an exposed controller', move: 'The controller is reached from the internet with its factory password.', counters: ['mm-identity-phishing-resistant-auth', 'mm-trust-microsegmentation'], weight: 3, target: 'ctl' }],
      system: {
        nodes: [
          { id: 'ctl', name: 'Station controller', kind: 'control' },
          { id: 'pumps', name: 'Booster pumps', kind: 'control' },
          { id: 'ops', name: 'Operators', kind: 'people' },
          { id: 'town', name: 'Customers', kind: 'public' },
        ],
        edges: [
          { from: 'ctl', to: 'pumps', how: 'keeps running' },
          { from: 'pumps', to: 'town', how: 'supplies' },
        ],
      },
    },
    checks: [
      { stack: [], label: 'with nothing in place, the customers lose most of the day', max: 10 },
      { stack: ['mm-resilience-fail-safe-defaults'], label: 'with manual mode, the day is kept', min: 20 },
    ],
  },
  {
    id: 'cal-clearinghouse',
    name: 'A shared clearinghouse goes down',
    when: 'Change Healthcare, February 2024',
    known: 'Attackers entered through a remote access portal without multi factor authentication and deployed ransomware. Prescription and claims processing that ran through the clearinghouse stopped across the United States for weeks; providers with another route recovered sooner.',
    source: 'Testimony of the UnitedHealth Group chief executive to the US Senate Finance Committee, May 2024, and the American Hospital Association’s survey of the impact, March 2024.',
    fallsFirst: 'hub',
    gauge: {
      ...base, id: 'cal-clearinghouse', title: 'The Clearinghouse', org: 'A regional pharmacy network', sector: 'Prescriptions for a region',
      brief: 'Every claim runs through one clearinghouse.',
      threats: [{ id: 'a', name: 'A remote portal without a second factor', move: 'A stolen password opens the remote access portal.', counters: ['mm-identity-phishing-resistant-auth', 'mm-resilience-immutable-backups'], weight: 3, target: 'hub' }],
      system: {
        nodes: [
          { id: 'hub', name: 'Claims clearinghouse', kind: 'vendor' },
          { id: 'claims', name: 'Pharmacy claims', kind: 'data' },
          { id: 'staff', name: 'Pharmacists', kind: 'people' },
          { id: 'patients', name: 'Patients', kind: 'public' },
        ],
        edges: [
          { from: 'hub', to: 'claims', how: 'keeps running' },
          { from: 'claims', to: 'patients', how: 'serves' },
          { from: 'staff', to: 'claims', how: 'keeps running' },
        ],
      },
    },
    checks: [
      { stack: [], label: 'with nothing in place, the patients lose most of the day', max: 10 },
      { stack: ['mm-identity-phishing-resistant-auth'], label: 'with a second factor on the portal, most of the day is kept', min: 18 },
      { stack: ['mm-trust-blast-radius-budget'], label: 'with another route around the clearinghouse, most of the day is kept', min: 18 },
    ],
  },
  {
    id: 'cal-update',
    name: 'One update on every machine at once',
    when: 'The faulty CrowdStrike content update, 19 July 2024',
    known: 'A content update released at 04:09 UTC crashed the Windows machines that received it within minutes, and was withdrawn at 05:27 UTC. Each machine had to be fixed by hand, so the people who could do it set the pace of recovery, and some airlines took days.',
    source: 'CrowdStrike, Preliminary Post Incident Review and Root Cause Analysis (July and August 2024); Microsoft’s estimate of 8.5 million affected devices.',
    fallsFirst: 'agent',
    gauge: {
      ...base, id: 'cal-update', title: 'The Update', org: 'An airline', sector: 'Flights for a region',
      brief: 'Every machine takes the same update at the same time.',
      threats: [{ id: 'a', name: 'A faulty update reaches every machine', move: 'A vendor update that crashes the machine at boot goes out to the whole fleet at once.', counters: ['mm-supply-dependency-cooldown'], weight: 3, target: 'agent' }],
      system: {
        nodes: [
          { id: 'agent', name: 'Security agent', kind: 'vendor' },
          { id: 'fleet', name: 'Workstations and servers', kind: 'network' },
          { id: 'crew', name: 'Gate and crew staff', kind: 'people' },
          { id: 'flyers', name: 'Travellers', kind: 'public' },
        ],
        edges: [
          { from: 'agent', to: 'fleet', how: 'keeps running' },
          { from: 'fleet', to: 'crew', how: 'keeps running' },
          { from: 'crew', to: 'flyers', how: 'serves' },
        ],
      },
    },
    checks: [
      { stack: [], label: 'with nothing in place, the travellers lose most of the day', max: 10 },
      { stack: ['mm-supply-dependency-cooldown'], label: 'with a cooldown before an update spreads, the day is kept', min: 20 },
    ],
  },
];
