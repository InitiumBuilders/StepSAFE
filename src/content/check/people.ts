/* DASH DEFENDERS · THE PEOPLE AND DEVICES CHECK. Twelve statements about the people who hold a project's access
   and the devices they hold it on: who joins and what they can reach, what a laptop keeps, and what the team
   does when a message pushes for something urgent. The attacks the FBI describes on crypto teams start with a
   person: a job offer, a test to run, a familiar face on a call.

   Every fact here is from its primary source, read on 2026-11-05: the FBI's warnings on North Korea's social
   engineering of the crypto industry (September 2024) and on North Korean IT workers (July 2025), SEAL 911,
   NIST CSF 2.0, and Apple's own support pages for disk encryption, updates and erasing a lost device. */

import type { CheckItem, CheckKind, CheckPartDef } from './types';

const ON = '2026-11-05';
const FBI_DPRK = { label: 'FBI: North Korea aggressively targeting crypto industry with well-disguised social engineering attacks, September 2024', url: 'https://www.ic3.gov/PSA/2024/PSA240903', checked: ON };
const FBI_ITW = { label: 'FBI: North Korean IT worker threats to U.S. businesses, July 2025', url: 'https://www.ic3.gov/PSA/2025/PSA250723-4', checked: ON };
const SEAL_SOS = { label: 'SEAL 911: Did you lose crypto?', url: 'https://securityalliance.org/sos', checked: ON };
const NIST_CSF = { label: 'NIST Cybersecurity Framework 2.0', url: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf', checked: ON };
const APPLE_FV = { label: 'Apple: Protect data on your Mac with FileVault', url: 'https://support.apple.com/guide/mac-help/protect-data-on-your-mac-with-filevault-mh11785/mac', checked: ON };
const APPLE_UPDATE = { label: 'Apple: Keep your Mac up to date', url: 'https://support.apple.com/guide/mac-help/keep-your-mac-up-to-date-mchlpx1065/mac', checked: ON };
const APPLE_ERASE = { label: 'Apple: Erase a device in Find My on Mac', url: 'https://support.apple.com/guide/findmy-mac/erase-a-device-fmmbe7bb71f4/mac', checked: ON };

export const PARTS: CheckPartDef[] = [
  { id: 'team', name: 'The team', line: 'Who joins, what they can reach, and what happens when they leave.' },
  { id: 'devices', name: 'Devices', line: 'The laptops and phones the project’s access lives on.' },
  { id: 'pressure', name: 'Under pressure', line: 'What the team does when a message pushes for something urgent.' },
];

export const ITEMS: CheckItem[] = [
  /* ---------- the team ---------- */
  {
    id: 'hire-check', part: 'team', weight: 3, csf: 'GV.RR', shelf: 365,
    short: 'New people are verified',
    ask: 'Before anyone new gets access, their identity and past work are checked, on a live video call at least.',
    why: 'The FBI reports North Korean IT workers hired under false identities, sometimes with one person passing the interview and another doing the work. It advises checking past employment directly, requiring video, and comparing the person on later calls with the one who was hired.',
    move: 'Check past employers and education directly, meet on video with the camera on, make sure the person on later calls is the one you hired, and grant no access until the checks are done.',
    models: ['mm-identity-verifiable-credentials', 'mm-org-threat-informed-defense'],
    sources: [FBI_ITW],
  },
  {
    id: 'least-new', part: 'team', weight: 2, csf: 'PR.AA', shelf: 365,
    short: 'New people start with little',
    ask: 'New people get only the access their first work needs, and none until their checks are done.',
    why: 'The FBI tells companies to grant no access to any system until a background check is complete, and to limit access to code repositories and development pipelines. NIST CSF 2.0 asks that access follow least privilege.',
    move: 'Give each new person the smallest set of access their first task needs, add more as the work asks for it, and write down who approved each grant.',
    models: ['mm-identity-zero-standing-privilege', 'mm-trust-blast-radius-budget'],
    sources: [FBI_ITW, FBI_DPRK, NIST_CSF],
  },
  {
    id: 'offboard', part: 'team', weight: 3, csf: 'PR.AA', shelf: 365,
    short: 'Leavers lose access that day',
    ask: 'When someone leaves, every account, key and signer seat they held is removed or changed the same day.',
    why: 'A former member’s login works until someone removes it. NIST CSF 2.0 asks that cybersecurity be part of human resources practices, and that access be managed and reviewed.',
    move: 'Keep the account list from the accounts check. When someone leaves, go down it: remove them, change any shared secret they knew, and replace their signer seat in every multisig.',
    models: ['mm-identity-zero-standing-privilege', 'mm-identity-continuous-access-evaluation'],
    sources: [NIST_CSF],
  },
  {
    id: 'scam-brief', part: 'team', weight: 2, csf: 'PR.AT', shelf: 365,
    short: 'The team knows the lures',
    ask: 'Everyone on the team has been shown the lures used on crypto teams: job offers, coding tests, investment offers and meeting software to install.',
    why: 'The FBI warns that North Korea runs tailored social engineering against people at crypto companies, and that even people well versed in security can be caught. Its signs include unexpected job offers, tests that run unknown packages, and requests to run a script to fix a call.',
    move: 'Walk the team through the FBI’s list of signs once a quarter, and add each new lure the team meets.',
    models: ['mm-org-threat-informed-defense', 'mm-org-security-champions'],
    sources: [FBI_DPRK],
  },
  /* ---------- devices ---------- */
  {
    id: 'disk', part: 'devices', weight: 2, csf: 'PR.DS', shelf: 90,
    short: 'Laptop disks are encrypted',
    ask: 'Every laptop that holds project access has full-disk encryption on, with its recovery key kept somewhere safe.',
    why: 'A lost laptop can give away the logins and keys on it. Apple says FileVault keeps anyone from reading a Mac’s data without the login password, and warns that losing both the password and the recovery key loses the files for good.',
    move: 'Turn on FileVault on each Mac, or BitLocker or device encryption on Windows, and keep the recovery keys with the project’s recovery records.',
    models: ['mm-crypto-hardware-root', 'mm-crypto-envelope-encryption'],
    sources: [APPLE_FV],
  },
  {
    id: 'updates', part: 'devices', weight: 2, csf: 'PR.PS', shelf: 90,
    short: 'Devices update themselves',
    ask: 'Every device that holds project access installs system and security updates automatically.',
    why: 'Apple releases macOS updates with security fixes, and a Mac can install them automatically, along with Apple’s Rapid Security Responses. NIST CSF 2.0 asks that software be maintained in proportion to its risk.',
    move: 'Turn on automatic updates for the system, the browser and the wallet apps on each device, and replace any device that no longer receives them.',
    models: ['mm-supply-secure-by-default', 'mm-resilience-fail-safe-defaults'],
    sources: [APPLE_UPDATE, NIST_CSF],
  },
  {
    id: 'lost-device', part: 'devices', weight: 2, csf: 'RS.MI', shelf: 90,
    short: 'A lost device can be erased',
    ask: 'Every phone and laptop with project access can be erased remotely, and the team knows to report a lost one at once.',
    why: 'Apple can erase a lost Mac, iPhone or iPad from Find My, but only if the device was added to Find My before it was lost.',
    move: 'Add each device to Find My, or to its Windows or Android equivalent, today. Write down who to tell and what to revoke when one goes missing.',
    models: ['mm-crypto-crypto-shredding', 'mm-resilience-fail-safe-defaults'],
    sources: [APPLE_ERASE],
  },
  {
    id: 'stranger-code', part: 'devices', weight: 3, csf: 'PR.PS', shelf: 365,
    short: 'Strangers’ code runs elsewhere',
    ask: 'No one runs code from a stranger, such as a coding test or a meeting app, on a device that holds project access.',
    why: 'The FBI’s signs of North Korean targeting include coding tests that run unknown packages and requests to run a script to fix a call. It advises against running such code on work devices, and says to use a virtual machine on a separate device when a test needs it.',
    move: 'Keep one rule for the whole team: a stranger’s code runs only in a virtual machine on a device with no project access, or not at all.',
    models: ['mm-supply-ephemeral-builders', 'mm-trust-microsegmentation'],
    sources: [FBI_DPRK],
  },
  /* ---------- under pressure ---------- */
  {
    id: 'second-channel', part: 'pressure', weight: 3, csf: 'PR.AA', shelf: 365,
    short: 'Requests are checked another way',
    ask: 'A request to move funds, change a key or grant access is confirmed through a second, separate channel before anyone acts on it.',
    why: 'The FBI advises crypto companies to verify a contact’s identity over a separate, unconnected platform, and to require approvals from several unconnected networks before any company funds move.',
    move: 'Write the rule down: a request that moves money or access is confirmed by a call or a message on a channel it did not come from, to a contact you already had.',
    models: ['mm-org-two-person-integrity', 'mm-systems-layered-defenses'],
    sources: [FBI_DPRK],
  },
  {
    id: 'never-ask', part: 'pressure', weight: 2, csf: 'PR.AT', shelf: 365,
    short: 'We never ask for seed phrases',
    ask: 'The project says publicly that it will never ask for a seed phrase, a private key or a payment to help, and the team never does.',
    why: 'Scammers pose as the people users trust for help. SEAL 911 says it will never ask for a seed phrase, private keys or payment, and that anyone claiming to be SEAL who asks for them is running a scam.',
    move: 'Put the line on the website, in the support channels and in the pinned posts, and repeat it whenever someone asks for help.',
    models: ['mm-org-security-commons', 'mm-data-minimisation-at-source'],
    sources: [SEAL_SOS],
  },
  {
    id: 'closed-channels', part: 'pressure', weight: 2, csf: 'PR.AA', shelf: 365,
    short: 'Work stays in our own channels',
    ask: 'Project work happens in channels the project controls, and nobody is added to them until someone has confirmed who they are.',
    why: 'The FBI lists a request to move a conversation to another messaging app as a sign of North Korean targeting. It advises keeping business on closed platforms and confirming who someone is, ideally in person, before adding them.',
    move: 'Name the project’s channels, decline requests to move a conversation elsewhere, and confirm each new member by a call before they join.',
    models: ['mm-trust-context-aware-access', 'mm-identity-verifiable-credentials'],
    sources: [FBI_DPRK],
  },
  {
    id: 'report-fast', part: 'pressure', weight: 2, csf: 'DE.AE', shelf: 365,
    short: 'Anyone can raise the alarm',
    ask: 'Anyone who clicked, ran or typed something they should not have tells a named person at once, without fear of blame.',
    why: 'SEAL 911 tells victims that experienced developers and whole organizations have been caught, and that the sooner someone reaches out, the better the chance of recovering funds or preventing further loss.',
    move: 'Name the person to tell and how to reach them at any hour, and say in writing that anyone who reports fast is thanked.',
    models: ['mm-resilience-blameless-review', 'mm-detect-identity-first-triage'],
    sources: [SEAL_SOS],
  },
];

export const PEOPLE: CheckKind = {
  id: 'people',
  name: 'People and devices',
  title: 'The people and devices check',
  lede: 'Twelve statements about the people who hold a project’s access and the devices they hold it on: who joins, what a laptop keeps, and what the team does under pressure. Answer them before a launch.',
  line: 'The team, devices, and pressure.',
  parts: PARTS,
  items: ITEMS,
};
