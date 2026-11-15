/* The words and the facts on the PAXT page, in one place so they can be read, checked and changed together.

   The names in HIS_PAXT are August's (2026-11-12), kept as he wrote them: PAXT, PAXT Partners, Dash PAXT, Telepaxt.
   Everything else here is plain explanation written for him to keep or change. Statements are in Title Case; body
   sentences are not. Every number has its source beside it and the day it was read. */

import type { Source } from './facts';

export const HIS_PAXT = {
  name: 'PAXT',
  partners: 'PAXT Partners',
  dash: 'Dash PAXT',
  room: 'Telepaxt',
  protectors: 'Dash Trust Protectors',
};

export const READ_PAXT = '12 November 2026';

/** the Dash masternode list, read once through a public node and held to Dash Core's own governance figure */
export const LIST = {
  height: 2_571_106,
  enabled: 2_046,
  regular: 1_691,
  evo: 355,
  votes: 3_111,
  /** a tenth of the votes, whole number: what a proposal needs net of no votes */
  tenth: 311,
  /** Dash Core's getgovernanceinfo.fundingthreshold at the same height */
  coreThreshold: 311,
  votingKeys: 1_883,
  /** enabled masternodes whose voting address is not their owner address */
  votingApart: 1_583,
  sameOwnerVoting: 463,
  paidToCollateral: 291,
  source: { t: 'Dash Core: masternodelist json and getgovernanceinfo, read through rpc.digitalcash.dev', url: 'https://rpc.digitalcash.dev/' } as Source,
};

export const SOURCES = {
  dip3: { t: 'DIP 3: Deterministic Masternode Lists', url: 'https://github.com/dashpay/dips/blob/master/dip-0003.md' } as Source,
  docsKeys: { t: 'Dash docs: Understanding Masternodes', url: 'https://docs.dash.org/en/stable/docs/user/masternodes/understanding.html' } as Source,
  docsSign: { t: 'Dash docs: Signing and Verifying Messages', url: 'https://docs.dash.org/en/stable/docs/user/wallets/signing.html' } as Source,
  tp2018: { t: 'Dash.org, 31 December 2018', url: 'https://www.dash.org/blog/dash-network-elected-trust-protectors-closing-the-governance-loop' } as Source,
  tp2020: { t: 'Dash.org, 4 May 2020', url: 'https://dash.org/blog/results-of-the-dash-dao-irrevocable-trust-elections' } as Source,
  dashmsg: { t: 'dashhive/dashmsg', url: 'https://github.com/dashhive/dashmsg' } as Source,
  ens: { t: 'ENS DAO, EP 6.19', url: 'https://docs.ens.domains/dao/proposals/6.19' } as Source,
  telegram: { t: 'Telegram FAQ', url: 'https://telegram.org/faq#q-so-how-do-you-encrypt-data' } as Source,
};

const n = (x: number) => x.toLocaleString('en-US');
const pct = (a: number, b: number) => ((100 * a) / b).toFixed(1) + '%';

export const PX = {
  title: 'PAXT · StepSAFE',
  kicker: 'A proposal from StepSAFE',
  statement: 'An Agreement Between Communities',
  lede: 'A PAXT is one plain text that communities agree to. Each partner says so with one line, signed by a wallet it already holds. Anyone can check every signature and count the result again.',
  see: 'See How It Forms',
  tryIt: 'Try The Line',
  heroCaption: 'Three communities, each a ring of its own members. One text sits between them. As each community joins, a thread runs from its ring to the text. When all three have joined, a light travels the threads.',

  layers: {
    kicker: 'Where it sits',
    title: 'The Card, The Move, The PAXT',
    rows: [
      { name: 'Ankras', what: 'The card', line: 'One security practice, written so anyone can check it.', href: '/ankras' },
      { name: 'MOTRUS', what: 'The move', line: 'Organizations adopt one card together, once enough have committed.', href: '/MOTRUS' },
      { name: 'PAXT', what: 'The agreement', line: 'Communities keep a standing text between them, and run many moves under it.', href: '#forms' },
    ],
  },

  forms: {
    kicker: 'The life of one',
    title: 'How A PAXT Forms',
    steps: [
      { t: 'Signal', d: 'A room asks its members a quick question. It shows where people stand and binds no one.' },
      { t: 'Text', d: 'The agreement is written as one plain document. Its hash is its name.' },
      { t: 'Sign', d: 'Each partner signs one line that names the text by its hash.' },
      { t: 'In Force', d: 'When the keys that joined carry the threshold, it holds. Below that it lapses and asks nothing of anyone.' },
      { t: 'Renew', d: 'It runs to a date. Partners report what they saw, and sign the next text.' },
    ],
  },

  line: {
    kicker: 'Try it',
    title: 'One Line, Signed',
    body: 'This is the first Dash PAXT, as a draft. Change a word and the hash changes, and so does the line. A signature made for one text cannot be moved to another.',
    textLabel: 'The document',
    hashLabel: 'Its hash',
    lineLabel: 'The line a wallet signs',
    choiceLabel: 'Choice',
    join: 'Join',
    leave: 'Leave',
    copy: 'Copy the line',
    copied: 'Copied',
    reset: 'Put the draft back',
    changed: 'The text has changed, so this is a different document.',
    asDrafted: 'The text is the draft as written.',
    notADoc: 'This no longer reads as a PAXT document:',
    where: 'Where to sign it',
    wallets: [
      { t: 'Dash Core', d: 'File, then Sign message.' },
      { t: 'Trezor', d: 'Sign & Verify, then Sign message.' },
      { t: 'Dash Masternode Tool', d: 'Tools, then Sign message with HW for current masternode’s address.' },
    ],
    keys: 'Signing happens in your own wallet. This page sees the text and the line, and no key.',
    phone: 'On a phone, sign with any wallet that signs a message, or sign on the device that holds the key and send the line from anywhere.',
  },

  voice: {
    kicker: HIS_PAXT.dash,
    title: 'Who May Speak',
    body: 'A Dash PAXT counts masternode keys. The public masternode list says which keys have a voice and how much, so no new account or token is needed.',
    tiles: [
      { k: 'Enabled masternodes', v: n(LIST.enabled), d: n(LIST.regular) + ' regular, ' + n(LIST.evo) + ' Evo' },
      { k: 'Votes they carry', v: n(LIST.votes), d: 'A regular node carries 1, an Evo node 4' },
      { k: 'A tenth of the votes', v: n(LIST.tenth), d: 'Dash Core reports the same funding threshold' },
      { k: 'Voting keys', v: n(LIST.votingKeys), d: 'One key can carry many masternodes' },
    ],
    read: 'Read from the public list at height ' + n(LIST.height) + ' on ' + READ_PAXT + '.',
    voicesTitle: 'Three Keys, Three Voices',
    voices: [
      { t: 'Voting key', d: 'Made for governance votes. An owner can hand it to someone else. The default voice of a Dash PAXT.' },
      { t: 'Owner key', d: 'Changes a masternode’s registration: its payout address, its voting key, its operator key.' },
      { t: 'Collateral key', d: 'Holds the 1,000 or 4,000 DASH, and is the one key that can move it.' },
    ],
    doc: 'Each document names the voice it counts.',
  },

  first: {
    kicker: 'Draft',
    title: 'The First Dash PAXT: Keys Apart',
    what: 'Masternode owners agree to keep their voting key apart from their owner key, and to be paid to an address that is not their collateral.',
    shownTitle: 'Already Shown On The List',
    apart: n(LIST.votingApart) + ' of ' + n(LIST.enabled),
    apartLine: 'enabled masternodes vote with a key that is not their owner key (' + pct(LIST.votingApart, LIST.enabled) + ').',
    same: n(LIST.sameOwnerVoting),
    sameLine: 'use one address as both owner and voting key.',
    paid: n(LIST.paidToCollateral),
    paidLine: 'are paid to their collateral address. The Dash docs advise a different address.',
    proof: 'Both practices can be read from the masternode list, so adoption needs no witness. The list shows it.',
    threshold: 'In force at',
    thresholdV: '111 votes',
    voiceK: 'Voice',
    voiceV: 'Voting key',
    statusK: 'Status',
    statusV: 'Draft. The threshold and dates are August’s to set.',
    open: 'Read The Draft Above',
  },

  room: {
    kicker: 'The room',
    title: 'A ' + HIS_PAXT.room + ' Is Where Partners Meet',
    body: 'A Telepaxt is a Telegram group for one PAXT. Dasha, the Dash Support Team’s mind, can sit in it as clerk.',
    doesTitle: 'What The Clerk Does',
    does: [
      'Posts the text and its hash, so everyone reads the same words.',
      'Runs a quick Signal poll when the room wants one.',
      'Posts the count, with the head of the open record, so the room itself is a witness.',
    ],
    keepsTitle: 'What Stays With Its Owner',
    keeps: [
      'Every key. The clerk holds none and moves no funds.',
      'Every signature. A signed line goes through the ballot page, outside the room.',
      'Who holds which masternode. The count shows weights and addresses, and no member’s name.',
    ],
    honest: 'Telegram groups are encrypted between each phone and Telegram’s servers, and Telegram can read them. A Telepaxt does not depend on the room being secret. It depends on signatures anyone can check.',
    status: 'Dasha’s Telepaxt commands and the ballot page are live at DashSupport.Team since 12 November 2026. No room has run a PAXT yet.',
    open: 'Open The Ballot Page',
    pageHref: 'https://www.dashsupport.team/paxt',
  },

  grades: {
    kicker: 'How much each voice weighs',
    title: 'Signal, Signed, Shown, Backed',
    rows: [
      { t: 'Signal', d: 'A tap in the room. A quick read of where people stand. It binds no one.' },
      { t: 'Signed', d: 'One line, signed by a key with a voice. Counted by the votes that key carries.' },
      { t: 'Shown', d: 'The practice itself, read from a public record. On Dash, the masternode list.' },
      { t: 'Backed', d: 'TRUST placed for or against the claim on Intuition. It shows conviction and is read apart from proof.' },
    ],
  },

  held: {
    kicker: 'Proposed',
    title: 'Held Evidence Earns Again',
    body: 'A PAXT can keep a pool, funded by its partners or by a treasury proposal. It pays for evidence that lasts.',
    rules: [
      { t: 'When It Is Accepted', d: 'A linked source, a reported result or a reviewed version earns its weight once two reviewers accept it.' },
      { t: 'Each Quarter It Still Holds', d: 'While adopters’ results keep confirming it, it earns a held share again.' },
      { t: 'When It Stops Holding', d: 'The person who shows it no longer holds earns the most, and the old claim stops earning.' },
    ],
    pays: 'Payouts are in DASH from a multisig the partners hold. The clerk drafts the sheet: who, for which evidence, how much. The signers read it and sign. Nothing pays itself.',
    caption: 'Four quarters of one card. Three pieces of evidence earn each quarter they still hold. In the third quarter one is shown to fail: it stops earning, and the person who showed it earns the most that quarter.',
  },

  precedent: {
    kicker: 'Precedent',
    title: 'Communities Have Decided This Way Before',
    rows: [
      {
        t: 'The Dash Trust Protector elections',
        d: 'Masternode owners voted by signing messages with their masternode keys. An auditor read the masternode list on the closing day, and only keys on it counted. In 2020 the vote file and the list were published with the result.',
        sources: [SOURCES.tp2018, SOURCES.tp2020, SOURCES.dashmsg],
      },
      {
        t: 'The Safe Harbor agreement',
        d: 'A security agreement that protocols adopt through their own governance. ENS passed it as EP 6.19 and recorded the adoption in a public registry.',
        sources: [SOURCES.ens],
      },
    ],
    more: 'The treaties that set a threshold before they bound anyone are on the MOTRUS page.',
    moreOpen: 'Thresholds Have Moved The World Before',
  },

  next: {
    kicker: 'Where this stands',
    title: 'Built, And Next',
    builtTitle: 'Built',
    built: [
      'The protocol: the document, the line, the count, the open record',
      '56 checks, held to Dash Core’s own message verifier and the live list',
      'The first Dash PAXT, as a draft',
      'Dasha as a mind inside StepSAFE',
      'Dasha’s Telepaxt commands and the ballot page at DashSupport.Team',
    ],
    nextTitle: 'Next',
    next: [
      'PAXT on Intuition: the text and its partners as claims, from August’s wallet',
      'More voices: a DAO’s own vote, an organization’s domain',
      'The first room of Dash masternode owners',
    ],
  },

  close: {
    doors: [
      { t: 'Read MOTRUS', href: '/MOTRUS' },
      { t: 'Explore Ankras', href: '/ankras' },
      { t: 'Open StepSAFE', href: '/' },
    ],
    note: 'Written ' + READ_PAXT + '. PAXT is a proposal. The protocol is a draft and nothing has been written to a chain. The figures for the masternode list are dated where they appear.',
  },
};
