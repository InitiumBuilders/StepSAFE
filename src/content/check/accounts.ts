/* DASH DEFENDERS · THE ACCOUNTS AND ACCESS CHECK. Twelve statements about the accounts a project can be
   taken through: the domain and what points at it, the sign-ins that change its site, its code and its
   community, and how it gets back into an account that is lost or taken. Dash Alive's reviewer checks that a
   project is real and reachable at its links; these are the accounts behind those links.

   Every fact here is from its primary source, read on 2026-11-04: ICANN for domain locks, CISA's Emergency
   Directive 19-01 for DNS tampering, CISA for phishing-resistant sign-in, NIST CSF 2.0 for least privilege and
   inventories, and the providers' own help pages (GitHub, Discord, X) for what each one offers. */

import type { CheckItem, CheckKind, CheckPartDef } from './types';

const ON = '2026-11-04';
const ICANN_EPP = { label: 'ICANN: EPP status codes', url: 'https://www.icann.org/resources/pages/epp-status-codes-2014-06-16-en', checked: ON };
const CISA_DNS = { label: 'CISA: Emergency Directive 19-01, DNS infrastructure tampering', url: 'https://www.cisa.gov/news-events/directives/ed-19-01-mitigate-dns-infrastructure-tampering-closed', checked: ON };
const CISA_MFA = { label: 'CISA: More than a password', url: 'https://www.cisa.gov/MFA', checked: ON };
const GH_ORG_2FA = { label: 'GitHub docs: Requiring two-factor authentication in your organization', url: 'https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization', checked: ON };
const GH_RECOVERY = { label: 'GitHub docs: Two-factor authentication recovery methods', url: 'https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication-recovery-methods', checked: ON };
const DISCORD_MFA = { label: 'Discord: Setting up multi-factor authentication', url: 'https://support.discord.com/hc/en-us/articles/219576828-Setting-up-Multi-Factor-Authentication', checked: ON };
const X_2FA = { label: 'X Help Center: How to use two-factor authentication', url: 'https://help.x.com/en/managing-your-account/two-factor-authentication', checked: ON };
const NIST_CSF = { label: 'NIST Cybersecurity Framework 2.0', url: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf', checked: ON };

export const PARTS: CheckPartDef[] = [
  { id: 'domain', name: 'The domain', line: 'The name people type, and what it points to.' },
  { id: 'signin', name: 'Sign-in', line: 'Who can get into the accounts that change the project.' },
  { id: 'backin', name: 'Getting back in', line: 'How the project recovers an account that is lost or taken.' },
];

export const ITEMS: CheckItem[] = [
  /* ---------- the domain ---------- */
  {
    id: 'domain-lock', part: 'domain', weight: 2, csf: 'PR.PS', shelf: 365, evidence: 'domain-locks',
    short: 'The domain is locked',
    ask: 'The domain is locked at the registrar against transfer, changes and deletion, and renews by itself.',
    why: 'A domain that moves or lapses takes the site, the email and every link with it. ICANN says the transfer, update and delete locks a registrar sets help prevent unauthorized changes from hijacking or fraud.',
    move: 'Ask the registrar to set the transfer, update and delete locks, ask about a registry lock, and turn on automatic renewal with a card that will not expire first.',
    models: ['mm-resilience-fail-safe-defaults', 'mm-trust-blast-radius-budget'],
    sources: [ICANN_EPP],
  },
  {
    id: 'dns-signin', part: 'domain', weight: 3, csf: 'PR.AA', shelf: 365,
    short: 'DNS accounts sign in strongly',
    ask: 'Every account that can change the domain’s DNS has its own strong password and phishing-resistant sign-in.',
    why: 'CISA described attackers who took the login of an account that could change DNS records, pointed the domain at their own servers, and obtained valid certificates for it, so visitors saw no warning. It called for multi-factor sign-in on those accounts and said text-message codes are not recommended.',
    move: 'List every account that can change DNS, at the registrar and the DNS host. Give each a unique password from a password manager and a security key or passkey. Move to a provider that offers them if yours does not.',
    models: ['mm-identity-phishing-resistant-auth', 'mm-identity-zero-standing-privilege'],
    sources: [CISA_DNS, CISA_MFA],
  },
  {
    id: 'dns-watch', part: 'domain', weight: 2, csf: 'DE.CM', shelf: 365, evidence: 'dns-records',
    short: 'DNS records are checked',
    ask: 'Someone checks that the domain’s DNS records point where they should, and hears about it when one changes.',
    why: 'A changed record can send visitors to a copy of the site while everything looks normal. CISA’s first required action was to audit every DNS record and confirm it resolves to the intended place.',
    move: 'Write down where each record should point, check them on a schedule, and turn on change alerts at the DNS host.',
    models: ['mm-detect-detection-as-code', 'mm-detect-telemetry-tiers'],
    sources: [CISA_DNS],
  },
  {
    id: 'cert-watch', part: 'domain', weight: 1, csf: 'DE.CM', shelf: 365,
    short: 'New certificates are watched',
    ask: 'Someone watches Certificate Transparency logs for certificates issued for the domain that the project did not request.',
    why: 'An attacker who can change DNS can get a valid certificate for the domain. CISA told agencies to monitor Certificate Transparency logs for certificates they did not request and to report any to the issuer.',
    move: 'Set up a Certificate Transparency alert for the domain, and write down who reports an unexpected certificate to the authority that issued it.',
    models: ['mm-crypto-transparency-log', 'mm-detect-behaviour-over-indicators'],
    sources: [CISA_DNS],
  },
  /* ---------- sign-in ---------- */
  {
    id: 'strong-signin', part: 'signin', weight: 3, csf: 'PR.AA', shelf: 365,
    short: 'Passkeys where it matters',
    ask: 'The accounts that can change the site, the code or the money use passkeys or security keys.',
    why: 'A code typed into a fake page can be phished; a passkey is bound to the real site and will not sign in to a copy. CISA says the only widely available phishing-resistant authentication is FIDO/WebAuthn.',
    move: 'Add a passkey or a security key to each of those accounts, keep a second one for each person, then remove text-message codes where the provider allows it.',
    models: ['mm-identity-phishing-resistant-auth', 'mm-identity-device-bound-session'],
    sources: [CISA_MFA],
  },
  {
    id: 'code-host', part: 'signin', weight: 3, csf: 'PR.AA', shelf: 90, na: 'We host no code',
    short: 'The code host requires two-factor',
    ask: 'The code host’s organisation requires two-factor sign-in for every member, by secure methods only.',
    why: 'Anyone who can push to the code can change what users run. GitHub lets an organisation require two-factor for everyone and require secure methods only, which blocks members who rely on text messages.',
    move: 'Turn on the organisation’s two-factor requirement, then the secure-methods-only setting, and help each member move before it applies.',
    models: ['mm-identity-phishing-resistant-auth', 'mm-trust-policy-enforcement-point'],
    sources: [GH_ORG_2FA],
  },
  {
    id: 'community', part: 'signin', weight: 2, csf: 'PR.AA', shelf: 90, na: 'We run no public accounts',
    short: 'Public accounts sign in strongly',
    ask: 'The project’s public accounts, such as X and Discord, use a security key, a passkey or an authenticator app, never text messages alone.',
    why: 'A taken public account can post a fake link to everyone who trusts the project. X offers security keys and limits text-message codes to Premium subscribers; Discord says it does not recommend text-message codes because of SIM swaps.',
    move: 'Move each public account to a security key or passkey, with an authenticator app as the backup, and remove text-message codes.',
    models: ['mm-identity-phishing-resistant-auth', 'mm-resilience-fail-safe-defaults'],
    sources: [X_2FA, DISCORD_MFA],
  },
  {
    id: 'few-admins', part: 'signin', weight: 2, csf: 'PR.AA', shelf: 365,
    short: 'Few admins, used only for admin',
    ask: 'Each admin role is held by as few people as the work needs, and they use it only for admin work.',
    why: 'Every admin is another way in. NIST CSF 2.0 asks that access follow least privilege and separation of duties, and that it be reviewed.',
    move: 'List the admins of each account, remove anyone who does not need it, and review the list each time someone joins or leaves.',
    models: ['mm-identity-zero-standing-privilege', 'mm-org-decision-rights'],
    sources: [NIST_CSF],
  },
  /* ---------- getting back in ---------- */
  {
    id: 'recovery-email', part: 'backin', weight: 3, csf: 'PR.AA', shelf: 365,
    short: 'Project-owned recovery email',
    ask: 'The recovery email and phone of every project account belong to the project, not to one person, and are protected as strongly as the account.',
    why: 'Whoever controls an account’s recovery email can usually reset it. X ties each account to a confirmed email address and uses it to keep the account secure.',
    move: 'Move recovery to a project address that two people can reach, give that mailbox a passkey or security key, and remove personal numbers.',
    models: ['mm-identity-break-glass', 'mm-org-two-person-integrity'],
    sources: [X_2FA],
  },
  {
    id: 'backup-codes', part: 'backin', weight: 2, csf: 'PR.DS', shelf: 90,
    short: 'Backup codes are kept',
    ask: 'The backup codes for every project account are saved in a password manager or offline, with the project’s recovery records.',
    why: 'Lose the second factor without the codes and the provider may not be able to help. Discord says its support team cannot remove multi-factor authentication from an account; GitHub recommends saving recovery codes in a password manager.',
    move: 'Download the backup codes for each account, store them in the project’s password manager or on paper in the recovery file, and test one.',
    models: ['mm-identity-break-glass', 'mm-resilience-immutable-backups'],
    sources: [DISCORD_MFA, GH_RECOVERY],
  },
  {
    id: 'shared-logins', part: 'backin', weight: 1, csf: 'PR.AA', shelf: 365,
    short: 'Shared logins kept in a vault',
    ask: 'Any login that must be shared lives in a password manager, with a record of who can open it, and never in a chat.',
    why: 'A password pasted into a chat stays in every copy of that chat. CISA recommends password managers for complex and unique passwords on the accounts that can change a domain’s DNS.',
    move: 'Move shared logins into a password manager vault, give access by name, and change each password the day someone loses access.',
    models: ['mm-crypto-short-lived-secrets', 'mm-identity-zero-standing-privilege'],
    sources: [CISA_DNS],
  },
  {
    id: 'account-list', part: 'backin', weight: 2, csf: 'ID.AM', shelf: 365,
    short: 'A list of every account',
    ask: 'There is a written list of every account the project depends on, who administers it, and how to recover it.',
    why: 'A project cannot protect an account nobody remembers. NIST CSF 2.0 asks for an inventory of the services provided by suppliers, kept up to date.',
    move: 'Write one list: each account, its admins, its recovery email, where its backup codes are, and the provider’s recovery page. Review it each quarter.',
    models: ['mm-org-decision-rights', 'mm-trust-boundary-ledger'],
    sources: [NIST_CSF],
  },
];

export const ACCOUNTS: CheckKind = {
  id: 'accounts',
  name: 'Accounts and access',
  title: 'The accounts and access check',
  lede: 'Twelve statements about the accounts a project can be taken through: its domain, the sign-ins that change its site, code and community, and how it gets back in. Answer them before a launch.',
  line: 'The domain, sign-in, and getting back in.',
  parts: PARTS,
  items: ITEMS,
};
