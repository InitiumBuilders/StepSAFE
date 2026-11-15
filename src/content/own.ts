/* STEPSAFE'S OWN RECORD: the words for views/TrustView.tsx. StepSAFE asks every project to back its record with
   evidence anyone can read, and this page holds StepSAFE to the same rule. What a browser can read is read there, by
   lib/selfread.ts. What it cannot read is said here, plainly, with the test or the setting that holds it.

   The answers to StepSAFE's own Code and releases check were true on OWN_ON. They rest on the repository's settings
   (gh api repos/InitiumBuilders/UnitiaSafeStep) and on scripts/ship.sh and scripts/keep.sh: read those again before
   changing an answer. probe-selfread.mts holds the shape: every statement answered once, every site the security
   policy allows named once, and every source read on a stated day. */

import type { CheckAnswer, CheckSource } from './check/types';

export const OWN_ON = '2026-11-14';

/** every site StepSAFE's security policy lets a page reach, named as the privacy page names it */
export const HOST_NAMES: Record<string, string> = {
  'api.anthropic.com': 'Anthropic, with your own key',
  'api.elevenlabs.io': 'ElevenLabs, for reading aloud with your own key',
  'en.wikipedia.org': 'Wikipedia, for field signals',
  'wikimedia.org': 'Wikimedia, for field signals',
  'hn.algolia.com': 'Hacker News search, for field signals',
  'api.stackexchange.com': 'Stack Exchange, for field signals',
  'api.openalex.org': 'OpenAlex, for field signals',
  'davara.dev': 'your own Davara',
  '*.davara.dev': 'your own Davara',
  'rdap.publicinterestregistry.org': 'Public Interest Registry, for the checks',
  'rdap.verisign.com': 'Verisign, for the checks',
  'rdap.identitydigital.services': 'Identity Digital, for the checks',
  'rdap.centralnic.com': 'CentralNic, for the checks',
  'pubapi.registry.google': 'Google Registry, for the checks',
  'insight.dash.org': 'Dash Insight, for Dash records',
  'www.dashsupport.team': 'the Dash Support Team, for Dasha',
  'api.scorecard.dev': 'OpenSSF Scorecard, for the checks',
  'dns.google': 'Google Public DNS, for the checks',
  'platform-explorer.pshenmic.dev': 'the Platform Explorer, for Dash tokens',
  'testnet.platform-explorer.pshenmic.dev': 'the Platform Explorer on testnet',
  'api.osv.dev': 'OSV.dev, for known flaws in what ships',
};

/** what each name in this browser's storage holds for StepSAFE. The page shows these names and sizes, never contents. */
export const STORE_NAMES: Record<string, string> = {
  'stepsafe-praxis-v1': 'your record',
  'stepsafe-keys-v1': 'your sealed keys',
  'stepsafe-signal-v1': 'field signals you looked up',
  'stepsafe-motrus-v1': 'your MOTRUS vault',
  'stepsafe-room-v1': 'your progress in the practice rooms',
  'stepsafe-room-last-v1': 'your last run in each room',
  'stepsafe-one-v1': 'your place in the rooms, one decision at a time',
  'stepsafe-principles-v1': 'the security principles you have found',
  'stepsafe-reading-v1': 'where reading aloud left off',
  'stepsafe-dasha-aloud': 'whether Dasha reads aloud',
  'stepsafe-sound': 'sound on or off',
  'stepsafe-world-tier': 'the 3D world’s quality setting',
  'stepsafe-world-tour-v1': 'whether the 3D world’s tour has been shown',
  'stepsafe-reloaded-for-build': 'a note that the app reloaded for a new release',
};

/** the tests that run before a release. A visitor cannot run them from here, so the page says them, by name. */
export const RELEASE_TESTS: { name: string; line: string }[] = [
  { name: 'probe-trust', line: 'Checks the promises on this page before they ship: security.txt and its dates, the three policy pages, that the privacy page names every site the security policy allows, and that the bill of materials matches the lockfile.' },
  { name: 'probe-csp', line: 'Walks the built site under its real security headers, through the welcome page, onboarding, every tab and Settings. Any policy violation the browser reports fails it.' },
  { name: 'probe-keyring', line: 'Attacks the keyring with the browser’s own Web Crypto. A key pasted for a visit stays out of storage, your record is saved with every key blanked, a kept key is stored only sealed, and a tampered seal is refused.' },
  { name: 'probe-seva-door', line: 'Attacks the guides’ server door: requests from another site, the wrong content type, a flood from one network, an oversized conversation, and a system prompt sent by a client, which the server ignores.' },
  { name: 'probe-selfread', line: 'Tests this page’s own readings against StepSAFE’s real files and against broken copies of them: an expired security.txt, a policy that lets in outside scripts, a visit to a site the privacy page does not name, a known flaw.' },
  { name: 'probe-keys', line: 'Walks the shortcuts made of one key: with them on they work, and when Settings turns them off they stop, while Ctrl or Cmd with K still opens Find.' },
  { name: 'secret-scan', line: 'Scans every tracked file for keys and tokens before each push to the repository. A hit stops the push.' },
  { name: 'vulns', line: 'Asks OSV.dev about every package that ships, before each release. A known flaw stops the release.' },
];

export type OwnHow = 'shown' | 'said';
export interface OwnAnswer {
  answer: CheckAnswer;
  how: OwnHow;
  /** the reading on this page that shows it, when one does */
  read?: 'disclosure' | 'parts' | 'flaws';
  note: string;
}

/** StepSAFE's answers to its own Code and releases check (content/check/code.ts), as true on OWN_ON */
export const CODE_ANSWERS: Record<string, OwnAnswer> = {
  'review': { answer: 'no', how: 'said', note: 'One person maintains StepSAFE. A change reaches the main branch without a second person’s review.' },
  'branch-rules': { answer: 'no', how: 'said', note: 'The repository is private on GitHub’s free plan, which offers no branch protection for private repositories.' },
  'push-protection': { answer: 'partly', how: 'said', note: 'GitHub’s push protection is off. Every push runs StepSAFE’s own scan of every tracked file for keys and tokens, and a hit stops the push.' },
  'token-perms': { answer: 'na', how: 'said', note: 'No automated workflow runs on the repository, so none holds a token.' },
  'signed': { answer: 'no', how: 'said', note: 'Releases and commits are not signed.' },
  'provenance': { answer: 'partly', how: 'said', note: 'Each release is a commit in the private repository, and the live site is compared file by file with the build that passed the tests. Signed provenance is not published yet.' },
  'release-two': { answer: 'partly', how: 'said', note: 'A production release waits for the maintainer’s own go-ahead for that build. The maintainer can still publish alone.' },
  'rollback': { answer: 'partly', how: 'said', note: 'Vercel keeps every release, so the last good one can be restored in one step, and the steps are written in the repository. A rollback has not been practiced.' },
  'new-deps': { answer: 'yes', how: 'said', read: 'parts', note: 'StepSAFE has three direct dependencies, React, React DOM and three.js, and ships six packages in all. The lockfile is committed.' },
  'dep-alerts': { answer: 'partly', how: 'said', read: 'flaws', note: 'Dependabot alerts are off. Every release asks OSV.dev about each package that ships, and so does this page when you press the button. A time to fix is not set yet.' },
  'disclosure': { answer: 'yes', how: 'shown', read: 'disclosure', note: 'security.txt and the policy page say where to send a report and when to expect a reply.' },
  'sbom': { answer: 'yes', how: 'shown', read: 'parts', note: 'The bill of materials is published with every release, at /sbom.cdx.json.' },
};

export type FederalStatus = 'in place' | 'partly' | 'not yet' | 'not certified';
export interface FederalRow {
  id: string;
  name: string;
  status: FederalStatus;
  /** the reading on this page that shows it, when one does */
  read?: 'disclosure' | 'parts';
  line: string;
  sources: CheckSource[];
}

const ON = OWN_ON;
/** what a US federal buyer looks for first, and where StepSAFE stands on each */
export const FEDERAL: FederalRow[] = [
  {
    id: 'vdp', name: 'A vulnerability disclosure policy', status: 'in place', read: 'disclosure',
    line: 'CISA’s directive BOD 20-01 requires every federal agency to publish one, and accepts security.txt as the way to point to it. StepSAFE’s policy is at /security.html, built on CISA’s template, and its security.txt follows RFC 9116.',
    sources: [
      { label: 'CISA: BOD 20-01, Develop and Publish a Vulnerability Disclosure Policy', url: 'https://www.cisa.gov/news-events/directives/bod-20-01-develop-and-publish-vulnerability-disclosure-policy', checked: ON },
      { label: 'CISA: Vulnerability Disclosure Policy Template', url: 'https://www.cisa.gov/vulnerability-disclosure-policy-template', checked: ON },
      { label: 'RFC 9116: A File Format to Aid in Security Vulnerability Disclosure', url: 'https://www.rfc-editor.org/rfc/rfc9116.html', checked: ON },
    ],
  },
  {
    id: 'privacy', name: 'A privacy notice', status: 'in place',
    line: 'StepSAFE’s notice at /privacy.html says what stays on the device and names every site the app can reach, and when. The sites this visit has reached are read above.',
    sources: [],
  },
  {
    id: '508', name: 'Section 508 accessibility', status: 'partly',
    line: 'The Section 508 standards hold federal ICT to WCAG 2.0 at levels A and AA. StepSAFE checks phone layout, text size, touch targets and some contrast before every release, and a machine audit of 24 places against WCAG 2.2 found four failures, now fixed. A full screen-reader review is not done yet, so the conformance report is still a draft.',
    sources: [
      { label: 'US Access Board: Information and Communication Technology, the Revised 508 Standards (E205.4)', url: 'https://www.access-board.gov/ict/', checked: ON },
    ],
  },
  {
    id: 'sbom', name: 'A software bill of materials', status: 'in place', read: 'parts',
    line: 'Executive Order 14028 led NTIA to set the minimum elements of one. StepSAFE’s carries them: for each package and font file a supplier, the name, the version and a unique id, how they depend on each other, and who wrote the list and when.',
    sources: [
      { label: 'NTIA: The Minimum Elements For a Software Bill of Materials (SBOM)', url: 'https://www.ntia.gov/report/2021/minimum-elements-software-bill-materials-sbom', checked: ON },
    ],
  },
  {
    id: 'ssdf', name: 'A secure software development attestation', status: 'not yet',
    line: 'Producers of software the federal government uses attest, on CISA’s form, to secure development practices drawn from NIST’s Secure Software Development Framework. StepSAFE’s practices are on this page, gaps included. The form is not signed.',
    sources: [
      { label: 'CISA: Secure Software Development Attestation Form', url: 'https://www.cisa.gov/secure-software-attestation-form', checked: ON },
      { label: 'NIST SP 800-218: Secure Software Development Framework 1.1', url: 'https://csrc.nist.gov/pubs/sp/800/218/final', checked: ON },
    ],
  },
  {
    id: 'fedramp', name: 'FedRAMP', status: 'not certified',
    line: 'FedRAMP certifies cloud services for federal use. StepSAFE is not certified. A learner’s record stays on their device, and the guides are the one feature that sends a learner’s words through StepSAFE’s server.',
    sources: [
      { label: 'FedRAMP', url: 'https://www.fedramp.gov/', checked: ON },
    ],
  },
];
