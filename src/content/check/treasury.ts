/* DASH DEFENDERS · THE TEN-MINUTE TREASURY CHECK. Twelve statements about who can move a project's DASH,
   how its keys are held and how it would get them back, for any project in the Dash DAO before it launches,
   and for a reviewer reading a Dash Alive listing. The Outlier.Systems corpus names this move for the Guard
   frame (rung 5): the ten-minute treasury checklist, signers, multisig and recovery.

   Each statement is answered Yes, Partly, No or Not sure. Not sure is read as not held: if nobody can say
   how a key is kept, nobody can check it. Each maps to the catalog structures that hold it and to a NIST CSF
   2.0 category. Every fact about Dash itself is from Dash's own documentation or DashSupport.Team's published
   pages, the one fact about a device is from its maker, and the one about succession is from NIST. All were
   read at the source on 2026-11-04. */

import type { CheckItem, CheckKind, CheckPartDef } from './types';
export type { CheckAnswer, CheckItem, CheckKind } from './types';
export type CheckPart = string;

const ON = '2026-11-04';
const DASH_HW = { label: 'Dash docs: Hardware wallets', url: 'https://docs.dash.org/en/stable/docs/user/wallets/hardware.html', checked: ON };
const DASH_MN = { label: 'Dash docs: Understanding masternodes', url: 'https://docs.dash.org/en/stable/docs/user/masternodes/understanding.html', checked: ON };
const DASH_EL = { label: 'Dash docs: Dash Electrum, multisig wallets', url: 'https://docs.dash.org/en/stable/docs/user/wallets/electrum/advanced.html', checked: ON };
const DASH_RPC = { label: 'Dash Core docs: Wallet RPCs (addmultisigaddress)', url: 'https://docs.dash.org/projects/core/en/stable/docs/api/remote-procedure-calls-wallet.html', checked: ON };
const DASH_RECOVERY = { label: 'Dash docs: Wallet recovery', url: 'https://docs.dash.org/en/stable/docs/user/wallets/recovery.html', checked: ON };
const DASH_GOV = { label: 'Dash docs: Understanding governance', url: 'https://docs.dash.org/en/stable/docs/user/governance/understanding.html', checked: ON };
const DASH_ALIVE = { label: 'DashSupport.Team: Dash Alive', url: 'https://www.dashsupport.team/Dash-Alive', checked: ON };
/* the one fact here about a device rather than about Dash, from the device's maker; Dash's docs list Ledger as supporting Dash */
const LEDGER_SCREEN = { label: 'Ledger: the secure screen', url: 'https://www.ledger.com/academy/topics/ledgersolutions/ledger-wallets-secure-screen-security-model', checked: ON };
const NIST_CP = { label: 'NIST SP 800-34 Rev. 1: Contingency planning guide', url: 'https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf', checked: ON };

export const CHECK_PARTS: CheckPartDef[] = [
  { id: 'signers', name: 'Signers', line: 'Who can move the DASH, and how their keys are held.' },
  { id: 'multisig', name: 'Multisig and spending', line: 'How a payment is agreed, checked and recorded.' },
  { id: 'recovery', name: 'Recovery', line: 'How the project gets its keys back on its worst day.' },
];

export const CHECK_ITEMS: CheckItem[] = [
  /* ---------- signers ---------- */
  {
    id: 'two-agree', part: 'signers', weight: 3, csf: 'PR.AA', shelf: 365, evidence: 'multisig-agree',
    short: 'Two people to move funds',
    ask: 'More than one person must agree before the treasury’s DASH can move.',
    why: 'A treasury one person can spend is lost the day that person is phished, pressured or gone.',
    move: 'Move the treasury to a multisig address that needs at least two signers to spend.',
    models: ['mm-chain-multisig-governance', 'mm-org-two-person-integrity', 'mm-crypto-threshold-custody'],
    sources: [DASH_EL, DASH_RPC],
  },
  {
    id: 'independent', part: 'signers', weight: 3, csf: 'PR.AA', shelf: 365,
    short: 'One key per person',
    ask: 'No one person holds more than one of the signing keys.',
    why: 'If one person holds two keys, one stolen phone or one pressured person can sign twice. Multisig holds only if the signers are separate people, on separate devices.',
    move: 'Give each key to a different person, each on their own device, and write down who holds which.',
    models: ['mm-crypto-threshold-custody', 'mm-trust-blast-radius-budget'],
    sources: [DASH_EL],
  },
  {
    id: 'hardware', part: 'signers', weight: 2, csf: 'PR.AA', shelf: 90,
    short: 'Keys on hardware wallets',
    ask: 'Every signing key lives on a hardware wallet that still supports Dash.',
    why: 'A key on a laptop or phone is as safe as everything else on it. Dash’s docs say Trezor Suite stopped supporting Dash in February 2025 and that only the Trezor Model One and Model T support it; Ledger and KeepKey support Dash.',
    move: 'Put each signing key on a hardware wallet that supports Dash today. Trezor advises moving Dash to other wallets, so plan that move for any key still on a Trezor.',
    models: ['mm-crypto-hardware-root'],
    sources: [DASH_HW],
  },
  {
    id: 'rotate', part: 'signers', weight: 1, csf: 'PR.AA', shelf: 365,
    short: 'A signer can be replaced',
    ask: 'A signer who leaves can be replaced, and the steps are written down.',
    why: 'People step back from projects. A signer who leaves still holds a key until the treasury moves to a new set.',
    move: 'Write the steps for replacing a signer: make a new multisig with the new set, move the funds, and record the date.',
    models: ['mm-org-decision-rights', 'mm-crypto-short-lived-secrets'],
    sources: [DASH_EL],
  },
  /* ---------- multisig and spending ---------- */
  {
    id: 'lose-one', part: 'multisig', weight: 2, csf: 'PR.IR', shelf: 365, evidence: 'multisig-spare',
    short: 'Survives a lost key',
    ask: 'Losing any one key would not lock the treasury: it needs fewer signatures than it has keys.',
    why: 'A 2 of 2 wallet stops the day one key is lost. A 2 of 3 wallet survives one loss and still needs two people to spend.',
    move: 'Use a threshold below the number of keys, such as 2 of 3 or 3 of 5.',
    models: ['mm-crypto-threshold-custody', 'mm-chain-multisig-governance'],
    sources: [DASH_EL, DASH_RPC],
  },
  {
    id: 'tiers', part: 'multisig', weight: 2, csf: 'GV.RM', shelf: 365,
    short: 'A small working wallet',
    ask: 'Only a working amount sits in a single-key wallet. The rest stays in the multisig.',
    why: 'Day-to-day payments need a quick wallet, and a quick wallet is the one most often taken. Keeping it small keeps a loss small.',
    move: 'Set a ceiling for the single-key wallet and refill it from the multisig when it runs low.',
    models: ['mm-chain-treasury-tiers', 'mm-trust-blast-radius-budget'],
    sources: [DASH_EL],
  },
  {
    id: 'address', part: 'multisig', weight: 2, csf: 'PR.AA', shelf: 365,
    short: 'Address and amount on the device',
    ask: 'Before anyone signs, the receiving address and the amount are read on the hardware wallet’s own screen, and the address is proved by its owner.',
    why: 'A swapped address in a chat, a clipboard or a hacked computer sends the payment to someone else, and the chain will not reverse it. Dash’s docs say to confirm the address on the device, and Ledger says its screen shows the true details even when the computer is compromised. Dash Alive already asks a listing’s owner to sign a message with the receiving address.',
    move: 'Ask every payee to sign a message with their address before the first payment. Before each signature, read the address and the amount on the device screen, not the computer’s.',
    models: ['mm-identity-verifiable-credentials', 'mm-resilience-fail-safe-defaults'],
    sources: [DASH_ALIVE, DASH_HW, LEDGER_SCREEN],
  },
  {
    id: 'rule', part: 'multisig', weight: 1, csf: 'GV.PO', shelf: 365,
    short: 'A written spending rule',
    ask: 'A written rule says which payments need which signers, and each payment is logged with who approved it.',
    why: 'The DAO funds the project in public, and Dash’s docs say a funded proposal’s manager is expected to report on budget expenditure. A dated log of each payment and its approvers is that report.',
    move: 'Write the spending rule on one page, and keep a dated log of every payment, its purpose and its signers.',
    models: ['mm-org-decision-rights', 'mm-crypto-transparency-log', 'mm-org-two-person-integrity'],
    sources: [DASH_GOV],
  },
  /* ---------- recovery ---------- */
  {
    id: 'seeds', part: 'recovery', weight: 3, csf: 'PR.DS', shelf: 365,
    short: 'Phrases kept offline',
    ask: 'Every recovery phrase is written down offline, in at least two places, and has never been typed into a website or photographed.',
    why: 'Whoever holds a recovery phrase holds the key. DashSupport.Team tells every builder never to share one with anyone, including them.',
    move: 'Write each phrase on paper or metal and keep two copies in different places. If a phrase was ever typed, photographed or stored online, move the funds to a new key.',
    models: ['mm-crypto-witnessed-ceremony', 'mm-crypto-hardware-root'],
    sources: [DASH_ALIVE, DASH_EL],
  },
  {
    id: 'restore', part: 'recovery', weight: 2, csf: 'PR.DS', shelf: 365,
    short: 'A tested restore',
    ask: 'A restore has been tested: a backup was loaded on a clean device and showed the same addresses.',
    why: 'An untested backup can be missing a word or a step, and nobody finds out until the restore. Dash’s recovery guide starts by asking what format a backup is in, which is a question to answer before the day it is needed.',
    move: 'Restore one signer’s backup on a spare device, check the addresses match, then wipe the spare. Note the date.',
    models: ['mm-resilience-immutable-backups', 'mm-resilience-game-days'],
    sources: [DASH_RECOVERY, DASH_EL],
  },
  {
    id: 'succession', part: 'recovery', weight: 2, csf: 'GV.RR', shelf: 365,
    short: 'A named recovery contact',
    ask: 'Someone outside the signers knows what to do if signers are lost, under a written rule.',
    why: 'If signers are unreachable at once, the project needs a named person who can start recovery, with a record of each time they do. NIST’s contingency planning guide lists an order of succession and a delegation of authority among the parts of a continuity plan.',
    move: 'Name a recovery contact, write what they may do and when, and keep the backups where they can reach them only under that rule.',
    models: ['mm-identity-break-glass', 'mm-org-decision-rights'],
    sources: [NIST_CP],
  },
  {
    id: 'masternode', part: 'recovery', weight: 2, csf: 'PR.AA', shelf: 365, na: 'We run no masternode',
    short: 'Masternode keys kept apart',
    ask: 'If the project runs a masternode, its owner, voting and operator keys are separate, and payouts go to an address other than the collateral.',
    why: 'Dash’s docs give each key its own role, require a unique owner key for each masternode, and ask owners to pay out to an address different from the collateral. Separate keys mean a stolen voting or operator key cannot spend the collateral.',
    move: 'Register each masternode with its own owner key, a separate voting key and operator key, and a payout address that is not the collateral address.',
    models: ['mm-trust-object-capabilities', 'mm-trust-blast-radius-budget', 'mm-identity-zero-standing-privilege'],
    sources: [DASH_MN],
  },
];

export const TREASURY: CheckKind = {
  id: 'treasury',
  name: 'Treasury',
  title: 'The ten-minute treasury check',
  lede: 'Twelve statements about who can move a project’s DASH, how its keys are held, and how it would get them back. Answer them before a launch, or for a reviewer reading a Dash Alive listing.',
  line: 'Signers, multisig and recovery.',
  parts: CHECK_PARTS,
  items: CHECK_ITEMS,
};
