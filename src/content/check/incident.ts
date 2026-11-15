/* DASH DEFENDERS · THE WORST DAY CHECK. Twelve statements about the day something goes wrong: what is ready
   before it, what the team does in the first hours, and how the project comes back. Each one is something a
   project can put in place before a launch.

   Every fact here is from its primary source, read on 2026-11-05: NIST's incident response guide (SP 800-61
   Revision 3, April 2025), NIST CSF 2.0, SEAL 911 and its war room guidelines, and the FBI's response steps for
   crypto companies. */

import type { CheckItem, CheckKind, CheckPartDef } from './types';

const ON = '2026-11-05';
const NIST_IR = { label: 'NIST SP 800-61 Rev. 3: Incident Response Recommendations and Considerations for Cyber Risk Management, April 2025', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf', checked: ON };
const NIST_CSF = { label: 'NIST Cybersecurity Framework 2.0', url: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf', checked: ON };
const SEAL_SOS = { label: 'SEAL 911: Did you lose crypto?', url: 'https://securityalliance.org/sos', checked: ON };
const SEAL_WAR = { label: 'SEAL 911: War room guidelines', url: 'https://frameworks.securityalliance.org/incident-management/playbooks/seal-911-war-room-guidelines', checked: ON };
const FBI_DPRK = { label: 'FBI: North Korea aggressively targeting crypto industry with well-disguised social engineering attacks, September 2024', url: 'https://www.ic3.gov/PSA/2024/PSA240903', checked: ON };

export const PARTS: CheckPartDef[] = [
  { id: 'before', name: 'Before', line: 'What is ready before anything goes wrong.' },
  { id: 'during', name: 'The first hours', line: 'What the team does when something goes wrong.' },
  { id: 'after', name: 'Coming back', line: 'How the project tells its users, reports, recovers and learns.' },
];

export const ITEMS: CheckItem[] = [
  /* ---------- before ---------- */
  {
    id: 'ir-plan', part: 'before', weight: 3, csf: 'ID.IM', shelf: 365,
    short: 'A written plan names the lead',
    ask: 'There is a written plan for a hack or a theft, and it names who leads, who decides on pausing or moving funds, and who speaks for the project.',
    why: 'NIST’s incident response guide names the roles a response needs, among them leaders with authority over high-impact actions and someone to inform the public. SEAL 911’s war room guidelines begin by assigning roles.',
    move: 'Write one page: who leads, who can pause, who can move funds, who speaks, and who stands in for each. Keep a copy off the project’s own systems.',
    models: ['mm-org-incident-command', 'mm-org-decision-rights'],
    sources: [NIST_IR, SEAL_WAR],
  },
  {
    id: 'contacts', part: 'before', weight: 2, csf: 'RS.CO', shelf: 365,
    short: 'Emergency contacts are listed',
    ask: 'The plan lists who to call, with a way to reach each: SEAL 911, the FBI’s IC3, and the security contacts of the services the project depends on.',
    why: 'SEAL 911 is a free volunteer emergency team for crypto hacks, reached through its Telegram bot, and says most tickets get a response within minutes. The FBI asks anyone hit by these attacks to file a complaint with IC3, and SEAL’s guidelines include gathering the security contacts of services that could be affected.',
    move: 'Write the contacts into the plan: SEAL 911’s bot, ic3.gov, the code host, the hosting and domain providers, and the exchanges the project works with.',
    models: ['mm-org-security-commons', 'mm-org-incident-command'],
    sources: [SEAL_SOS, SEAL_WAR, FBI_DPRK],
  },
  {
    id: 'rehearsed', part: 'before', weight: 2, csf: 'ID.IM', shelf: 365,
    short: 'The plan has been practised',
    ask: 'The team has walked through the plan in a practice run in the last year.',
    why: 'NIST’s incident response guide says exercises and tests help evaluate a response and prepare staff and outside partners for real incidents, and names tabletop discussions as one form.',
    move: 'Run a one-hour tabletop once a year: pick a scenario, such as a signer’s laptop stolen, and walk through the plan out loud. Fix what the walk-through shows.',
    models: ['mm-resilience-game-days', 'mm-org-incident-command'],
    sources: [NIST_IR],
  },
  {
    id: 'logs', part: 'before', weight: 2, csf: 'PR.PS', shelf: 365,
    short: 'Logs are kept somewhere else',
    ask: 'The logs of the project’s servers and accounts are copied to a place that an attacker on those systems cannot change.',
    why: 'NIST’s incident response guide says logs are particularly important for preserving what detection, response and recovery need, and recommends sending log data to a small number of log servers as it is made.',
    move: 'Turn on the audit logs of the code host, the hosting and the domain accounts, send them to storage the everyday logins cannot delete, and decide how long to keep them.',
    models: ['mm-detect-telemetry-tiers', 'mm-resilience-immutable-backups'],
    sources: [NIST_IR],
  },
  /* ---------- the first hours ---------- */
  {
    id: 'war-room', part: 'during', weight: 3, csf: 'RS.MA', shelf: 365,
    short: 'A war room opens at once',
    ask: 'When something goes wrong, a private call opens at once with the people the plan names, and one person keeps a timeline in UTC.',
    why: 'SEAL 911’s guidelines start with notifying SEAL 911 and opening a war room with audio for trusted people, and ask for a timeline of events with every time recorded in UTC.',
    move: 'Put the call link and a timeline template in the plan, so the first person who sees trouble can open both in a minute.',
    models: ['mm-org-incident-command', 'mm-systems-decision-loop'],
    sources: [SEAL_WAR],
  },
  {
    id: 'pause', part: 'during', weight: 3, csf: 'RS.MI', shelf: 365,
    short: 'What is at risk can be paused',
    ask: 'The project can pause what is at risk, such as deposits, withdrawals, payouts or contracts, within minutes, and more than one person knows how.',
    why: 'SEAL 911’s guidelines ask a team to act at once to prevent further loss of funds: pause contracts where possible, run defensive scripts made beforehand, and disable deposits or withdrawals in the web app.',
    move: 'List what can be paused and how, give that power to at least two people, and test a pause in a quiet hour.',
    models: ['mm-chain-circuit-breakers', 'mm-chain-timelock-and-guardian'],
    sources: [SEAL_WAR],
  },
  {
    id: 'isolate', part: 'during', weight: 2, csf: 'RS.AN', shelf: 365,
    short: 'A suspect device goes offline',
    ask: 'A device that may be compromised is taken off the internet at once and left powered on.',
    why: 'The FBI advises disconnecting an affected device from the internet immediately and leaving it powered on, so the malware on it can still be recovered.',
    move: 'Write it into the plan in one line: turn off the network, keep the device on, and do not wipe it until the responders say so.',
    models: ['mm-detect-identity-first-triage', 'mm-resilience-fail-safe-defaults'],
    sources: [FBI_DPRK],
  },
  {
    id: 'rescue', part: 'during', weight: 2, csf: 'RS.MI', shelf: 365,
    short: 'Rescue moves are agreed first',
    ask: 'No one moves funds to rescue them until the war room has agreed the move.',
    why: 'SEAL 911’s guidelines say to validate a solution before running it, and to coordinate with the war room before executing any rescue transaction.',
    move: 'Agree each rescue move in the war room, check the destination address with a second person, and record it on the timeline.',
    models: ['mm-org-two-person-integrity', 'mm-chain-multisig-governance'],
    sources: [SEAL_WAR],
  },
  /* ---------- coming back ---------- */
  {
    id: 'tell-users', part: 'after', weight: 2, csf: 'RC.CO', shelf: 365,
    short: 'Users hear it from the project',
    ask: 'Users hear what happened and what to do from the project’s own channels, in words the war room agreed.',
    why: 'NIST CSF 2.0 asks that public updates on recovery be shared using approved methods and messaging. SEAL 911’s guidelines ask the team to prepare messages for internal and external communication, and ask war room members not to publicize anything without the project’s consent.',
    move: 'Keep a short template in the plan: what happened, what users should do, what they should not do, and when the next update comes. Post it from the official accounts only.',
    models: ['mm-org-incident-command', 'mm-org-security-commons'],
    sources: [NIST_CSF, SEAL_WAR],
  },
  {
    id: 'report-ic3', part: 'after', weight: 1, csf: 'RS.CO', shelf: 365,
    short: 'The theft is reported',
    ask: 'A theft or intrusion is reported to the FBI’s IC3, with the details and screenshots the team kept.',
    why: 'The FBI asks anyone hit by these attacks to file a detailed complaint with IC3 and to give law enforcement as many details as they can, including screenshots of the messages and the attackers’ usernames and accounts.',
    move: 'File at ic3.gov with the timeline, the addresses and transaction ids, and the screenshots. Report it to the national police where the team lives as well.',
    models: ['mm-org-security-commons', 'mm-detect-hypothesis-hunting'],
    sources: [FBI_DPRK],
  },
  {
    id: 'restore-checked', part: 'after', weight: 3, csf: 'RC.RP', shelf: 365,
    short: 'Restored systems are checked',
    ask: 'Before anything restored goes back online, it is checked for signs of the attacker and the cause is fixed.',
    why: 'NIST’s incident response guide says to check restored assets for signs of compromise and fix the root causes before production use, and to verify the restoration before putting a system back online.',
    move: 'Rebuild from known good copies, change every key and password the attacker could have seen, and have a second person check before anything goes back online.',
    models: ['mm-resilience-immutable-backups', 'mm-org-two-person-integrity'],
    sources: [NIST_IR],
  },
  {
    id: 'after-action', part: 'after', weight: 2, csf: 'ID.IM', shelf: 365,
    short: 'Lessons are written and used',
    ask: 'After an incident, the team writes down what happened, what it did and what it learned, and turns each lesson into a change.',
    why: 'NIST’s incident response guide recommends an after-action report that documents the incident, the response and recovery actions taken, and the lessons learned. NIST CSF 2.0 asks that improvements be identified from the running of real processes.',
    move: 'Write the report within two weeks, without blame, and give each lesson an owner and a date. Run the checks again once the changes are made.',
    models: ['mm-resilience-blameless-review', 'mm-systems-loop-design'],
    sources: [NIST_IR, NIST_CSF],
  },
];

export const INCIDENT: CheckKind = {
  id: 'incident',
  name: 'The worst day',
  title: 'The worst day check',
  lede: 'Twelve statements about the day something goes wrong: what is ready before it, what the team does in the first hours, and how the project comes back. Answer them before a launch.',
  line: 'Before, the first hours, and coming back.',
  parts: PARTS,
  items: ITEMS,
};
