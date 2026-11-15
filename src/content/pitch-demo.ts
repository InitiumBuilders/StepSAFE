/* THE WELCOME PAGE'S DEMO SYSTEM. A civic platform shaped like Semble.CC, drawn from generic parts
   any such platform has, so the welcome page can show the model reading and hardening a system people
   gather on. It is a demo map, written for this page: it describes no live system's real layout, so it
   hands nobody a list of where a real platform is weak. The pressures come from the library. */

import type { OwnSpec } from './modux/own';

export const DEMO_NAME = 'A civic platform like Semble.CC';

export const DEMO_SPEC: OwnSpec = {
  org: DEMO_NAME,
  serves: 'Citizens who gather, decide and build together in public',
  tags: ['saas', 'cloud', 'identity', 'ai', 'public'],
  brief: 'People join, sign in, gather in rooms, decide together and keep a public record. An AI guide helps each room. It runs on outside hosting and a domain it rents.',
  threatIds: ['pr-bought-password', 'pr-pipeline-secret', 'pr-shared-dependency', 'pr-agent-turned', 'pr-ol-the-counterfeit-crowd', 'pr-wiper'],
  parts: [
    { id: 'p1', name: 'Hosting and functions', kind: 'vendor', dependsOn: ['p2'], how: 'needs' },
    { id: 'p2', name: 'Code, builds and deploys', kind: 'build', dependsOn: [], how: 'needs' },
    { id: 'p3', name: 'Domain and DNS', kind: 'network', dependsOn: [], how: 'needs' },
    { id: 'p4', name: 'Member accounts and sign in', kind: 'identity', dependsOn: ['p1', 'p3'], how: 'needs' },
    { id: 'p5', name: 'The public record', kind: 'data', dependsOn: ['p1'], how: 'needs' },
    { id: 'p6', name: 'The AI room guide', kind: 'model', dependsOn: ['p1'], how: 'needs' },
    { id: 'p7', name: 'Stewards and moderators', kind: 'people', dependsOn: ['p4'], how: 'needs' },
    { id: 'p8', name: 'Rooms where people decide', kind: 'control', dependsOn: ['p4', 'p5', 'p6', 'p7'], how: 'needs' },
    { id: 'p9', name: 'Citizens who gather', kind: 'public', dependsOn: ['p8', 'p3'], how: 'serves' },
  ],
};
