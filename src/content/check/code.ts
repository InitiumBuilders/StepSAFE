/* DASH DEFENDERS · THE CODE AND RELEASES CHECK. Twelve statements about who can change what users run, how a
   release is made, signed and taken back, and how a flaw reaches the project. Seven can be read from a public
   record: OpenSSF Scorecard's published results for the repository (lib/evidence.ts).

   Every fact here is from its primary source, read on 2026-11-05: NIST's Secure Software Development
   Framework (SP 800-218), SLSA for provenance, GitHub's own docs for what the code host offers, Dash's docs for
   verifying a Dash Core release, OpenSSF Scorecard's checks documentation, and the FBI on malicious packages. */

import type { CheckItem, CheckKind, CheckPartDef } from './types';

const ON = '2026-11-05';
const NIST_SSDF = { label: 'NIST SP 800-218: Secure Software Development Framework 1.1', url: 'https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf', checked: ON };
const SLSA = { label: 'SLSA: Build provenance', url: 'https://slsa.dev/spec/draft/build-provenance', checked: ON };
const GH_PROTECTED = { label: 'GitHub docs: About protected branches', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches', checked: ON };
const GH_PUSH = { label: 'GitHub docs: Push protection', url: 'https://docs.github.com/en/code-security/concepts/secret-security/push-protection', checked: ON };
const GH_SECURE = { label: 'GitHub docs: Secure use reference for Actions', url: 'https://docs.github.com/en/actions/reference/security/secure-use', checked: ON };
const GH_ENV = { label: 'GitHub docs: Deployments and environments', url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments', checked: ON };
const DASH_VERIFY = { label: 'Dash docs: Installing Dash Core on Linux, verifying Dash Core', url: 'https://docs.dash.org/en/stable/docs/user/wallets/dashcore/installation-linux.html', checked: ON };
const SCORECARD = { label: 'OpenSSF Scorecard: Checks documentation', url: 'https://github.com/ossf/scorecard/blob/main/docs/checks.md', checked: ON };
const FBI_DPRK = { label: 'FBI: North Korea aggressively targeting crypto industry with well-disguised social engineering attacks, September 2024', url: 'https://www.ic3.gov/PSA/2024/PSA240903', checked: ON };

export const PARTS: CheckPartDef[] = [
  { id: 'change', name: 'Changing the code', line: 'Who can change what users run, and how a change is checked.' },
  { id: 'release', name: 'Releases', line: 'How a release is made, signed and taken back.' },
  { id: 'deps', name: 'Dependencies and reports', line: 'What the code depends on, and how a flaw reaches the project.' },
];

export const ITEMS: CheckItem[] = [
  /* ---------- changing the code ---------- */
  {
    id: 'review', part: 'change', weight: 3, csf: 'PR.PS', shelf: 90, evidence: 'scorecard-review',
    short: 'Every change is reviewed',
    ask: 'No change reaches the main branch without a pull request approved by someone other than its author.',
    why: 'If one person can merge a change alone, so can anyone who steals that person’s login. GitHub can require approving reviews before a merge, and can require that the most recent push be approved by someone other than the person who pushed it.',
    move: 'Protect the main branch: require a pull request, at least one approving review, and approval of the most recent push by someone other than the person who pushed it.',
    models: ['mm-org-two-person-integrity', 'mm-trust-policy-enforcement-point'],
    sources: [GH_PROTECTED, SCORECARD],
  },
  {
    id: 'branch-rules', part: 'change', weight: 2, csf: 'PR.PS', shelf: 90, evidence: 'scorecard-branch',
    short: 'Force pushes are blocked',
    ask: 'The main branch and the release branches cannot be force-pushed or deleted.',
    why: 'GitHub notes that a force push can point a branch at commits no pull request approved. A branch protection rule blocks force pushes and deletion by default, and these two are the first tier of OpenSSF Scorecard’s branch protection check.',
    move: 'Add a branch protection rule or ruleset to the main and release branches, and leave force pushes and deletion blocked.',
    models: ['mm-resilience-fail-safe-defaults', 'mm-trust-policy-enforcement-point'],
    sources: [GH_PROTECTED, SCORECARD],
  },
  {
    id: 'push-protection', part: 'change', weight: 2, csf: 'PR.AA', shelf: 90,
    short: 'Secrets are stopped at the push',
    ask: 'Secret scanning with push protection is on, so a key pasted into the code is refused before it lands.',
    why: 'A key that reaches a public repository can be copied by anyone. GitHub’s push protection blocks a push that contains a secret before it reaches the repository.',
    move: 'Turn on secret scanning and push protection, and rotate any key that was ever committed.',
    models: ['mm-crypto-short-lived-secrets', 'mm-supply-secure-by-default'],
    sources: [GH_PUSH],
  },
  {
    id: 'token-perms', part: 'change', weight: 2, csf: 'PR.AA', shelf: 90, evidence: 'scorecard-token',
    short: 'Workflows hold read-only tokens',
    ask: 'Automated workflows get read-only tokens by default and take write access only in the jobs that need it.',
    why: 'Each workflow run holds a token that can act on the repository. GitHub recommends a read-only default with more access granted per job, and warns that workflows started by pull_request_target are privileged and must not check out untrusted code.',
    move: 'Set read-only permissions at the top of each workflow, grant write only in the jobs that need it, and keep pull_request_target workflows from checking out code in outside pull requests.',
    models: ['mm-identity-workload-identity', 'mm-identity-zero-standing-privilege'],
    sources: [GH_SECURE],
  },
  /* ---------- releases ---------- */
  {
    id: 'signed', part: 'release', weight: 3, csf: 'PR.PS', shelf: 365, evidence: 'scorecard-signed',
    short: 'Releases are signed',
    ask: 'Every release is signed, and users are told how to check the signature.',
    why: 'A signature lets anyone confirm a release came from the project. NIST’s SSDF asks producers to make integrity verification information available, and Dash’s own docs show users how to check a Dash Core release with GPG.',
    move: 'Sign each release, and publish the key and the steps to verify it beside the download.',
    models: ['mm-supply-keyless-signing', 'mm-crypto-transparency-log'],
    sources: [NIST_SSDF, DASH_VERIFY],
  },
  {
    id: 'provenance', part: 'release', weight: 2, csf: 'PR.PS', shelf: 365, evidence: 'scorecard-provenance',
    short: 'Each release says how it was built',
    ask: 'Each release records how it was built: from which commit, by which build system.',
    why: 'Provenance lets a user confirm that a release was built from the code they can read. SLSA defines it as verifiable information describing where, when and how an artifact was produced, and NIST’s SSDF asks producers to archive it with each release.',
    move: 'Generate build provenance for each release and publish it with the release files.',
    models: ['mm-supply-build-integrity-levels', 'mm-supply-reproducible-builds'],
    sources: [SLSA, NIST_SSDF],
  },
  {
    id: 'release-two', part: 'release', weight: 2, csf: 'PR.AA', shelf: 90,
    short: 'No one publishes alone',
    ask: 'No one person can publish a release alone.',
    why: 'A release reaches every user at once. GitHub’s deployment environments can require a reviewer’s approval and can stop the person who started a deployment from approving it. On GitHub Free, Pro and Team plans, required reviewers work only in public repositories.',
    move: 'Put publishing behind an environment with a required reviewer, and turn on Prevent self-review.',
    models: ['mm-org-two-person-integrity', 'mm-org-decision-rights'],
    sources: [GH_ENV],
  },
  {
    id: 'rollback', part: 'release', weight: 1, csf: 'RC.RP', shelf: 365,
    short: 'A bad release can be pulled',
    ask: 'A bad release can be withdrawn and the last good one restored, and the steps are written down.',
    why: 'A rollback needs the last good release, intact. NIST’s SSDF asks producers to securely archive the files and integrity data of each release.',
    move: 'Write the rollback steps, keep every release archived with its checksums, and practise a rollback once.',
    models: ['mm-resilience-immutable-backups', 'mm-resilience-game-days'],
    sources: [NIST_SSDF],
  },
  /* ---------- dependencies and reports ---------- */
  {
    id: 'new-deps', part: 'deps', weight: 2, csf: 'GV.SC', shelf: 365,
    short: 'New dependencies are reviewed',
    ask: 'A new dependency is reviewed before it is added, and the lockfile is committed.',
    why: 'A package is code someone else wrote, running with the project’s access. The FBI warns that North Korean actors targeting the crypto industry ask people to run unknown Node.js and PyPI packages, for example as a hiring test.',
    move: 'Review every new dependency in its pull request, commit the lockfile, and prefer packages with a record of maintenance.',
    models: ['mm-supply-dependency-cooldown', 'mm-supply-paved-road'],
    sources: [FBI_DPRK],
  },
  {
    id: 'dep-alerts', part: 'deps', weight: 2, csf: 'ID.RA', shelf: 90, evidence: 'scorecard-updates',
    short: 'Flaws in dependencies are fixed',
    ask: 'Someone hears about known flaws in the project’s dependencies and fixes them within a set time.',
    why: 'A flaw in a dependency is public once it is announced. OpenSSF Scorecard checks whether a dependency update tool is enabled, and says it cannot tell whether the tool runs or whether its pull requests are merged.',
    move: 'Turn on dependency alerts or an update tool, name who reads them, and set how fast a critical one is fixed.',
    models: ['mm-supply-sbom-and-exploitability', 'mm-org-security-champions'],
    sources: [SCORECARD],
  },
  {
    id: 'disclosure', part: 'deps', weight: 3, csf: 'ID.RA', shelf: 365, evidence: 'scorecard-policy',
    short: 'Flaws can be reported privately',
    ask: 'There is a published way to report a flaw privately, and someone answers it.',
    why: 'A researcher who finds a flaw needs a private way to report it. NIST’s SSDF asks for a policy that addresses vulnerability disclosure, and OpenSSF Scorecard looks for a SECURITY.md with a contact in it.',
    move: 'Add a SECURITY.md with a private contact and the time to expect a reply, and answer within it.',
    models: ['mm-org-security-commons', 'mm-org-decision-rights'],
    sources: [NIST_SSDF, SCORECARD],
  },
  {
    id: 'sbom', part: 'deps', weight: 1, csf: 'ID.AM', shelf: 365,
    short: 'Each release lists its parts',
    ask: 'Each release lists the components inside it, so a newly found flaw in one can be traced to the releases that carry it.',
    why: 'When a flaw is announced in a component, a project needs to know which of its releases carry it. NIST’s SSDF asks producers to collect and share provenance data for every component of each release, for example in a software bill of materials.',
    move: 'Generate a software bill of materials for each release and publish it with the release.',
    models: ['mm-supply-sbom-and-exploitability', 'mm-trust-boundary-ledger'],
    sources: [NIST_SSDF],
  },
];

export const CODE: CheckKind = {
  id: 'code',
  name: 'Code and releases',
  title: 'The code and releases check',
  lede: 'Twelve statements about who can change what users run, how a release is made and signed, and how a flaw reaches the project. Answer them before a launch.',
  line: 'Changing the code, releases, and dependencies.',
  parts: PARTS,
  items: ITEMS,
};
