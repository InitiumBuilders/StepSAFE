/* What the MOTRUS and Ankras pages show as fact, each with where it came from.
   Counts: C:\Users\Initi\ankras (scripts/check.mjs and words.mjs, 12 November 2026). Losses: the public record, read on
   12 November 2026 from the sources linked beside each. The Multisig governance card is the corpus's own text
   (seed/ankras/mm-chain-multisig-governance.json), cut at sentence ends and otherwise kept word for word. */

export const READ = '12 November 2026';

export const MEASURED = {
  cards: 109,
  models: 96,
  stacks: 13,
  families: 12,
  words: 16,
  wordsOnIntuition: 9,
  shown: 6,
  said: 384,
};

export type Source = { t: string; url: string };

/** three public losses, each the evidence for one way multisig governance fails */
export const INCIDENTS = [
  {
    key: 'bybit',
    name: 'Bybit',
    when: '21 February 2025',
    year: '2025',
    usd: 1_500_000_000,
    loss: 'about $1.5 billion',
    what: 'Signers approved the transfer their screen showed them. The signed payload replaced the wallet\'s code.',
    mode: 'The screen',
    sources: [
      { t: 'FBI, 26 February 2025', url: 'https://www.ic3.gov/PSA/2025/PSA250226' },
      { t: 'NCC Group analysis', url: 'https://www.nccgroup.com/research/in-depth-technical-analysis-of-the-bybit-hack/' },
    ] as Source[],
  },
  {
    key: 'ronin',
    name: 'Ronin bridge',
    when: '23 March 2022',
    year: '2022',
    usd: 625_000_000,
    loss: 'about $625 million, as reported',
    what: 'Five of nine validator keys moved the funds. Four of the five were run by one company.',
    mode: 'The signers',
    sources: [{ t: 'The Record, 29 March 2022', url: 'https://therecord.media/more-than-625-million-stolen-in-defi-hack-of-ronin-network' }] as Source[],
  },
  {
    key: 'harmony',
    name: 'Harmony Horizon bridge',
    when: '23 June 2022',
    year: '2022',
    usd: 100_000_000,
    loss: 'about $100 million',
    what: 'Two keys were enough to move the funds.',
    mode: 'The threshold',
    sources: [{ t: 'Harmony\'s post-mortem', url: 'https://medium.com/harmony-one/harmonys-horizon-bridge-hack-1e8d283b6d66' }] as Source[],
  },
];

/** the first half of 2025, from Chainalysis's mid-year update (17 July 2025) */
export const H1_2025 = {
  stolenUsd: 2_170_000_000,
  stolen: '$2.17 billion',
  bybitShare: 0.69,
  source: { t: 'Chainalysis, 17 July 2025', url: 'https://www.chainalysis.com/blog/2025-crypto-crime-mid-year-update/' } as Source,
};

/** a public-goods experiment: about half of people cooperate when they expect others to */
export const CONDITIONAL = {
  share: '50%',
  freeRiders: 'a third',
  source: { t: 'Fischbacher, Gächter and Fehr, Economics Letters, 2001', url: 'https://www.merlin.uzh.ch/publication/show/2015' } as Source,
};

/** the practice room in StepSAFE modelled on the 2025 signing-interface theft */
export const ROOM = {
  title: 'The Signature Was Valid',
  org: 'Halcyon Digital Markets',
  href: '/#/room/sim-halcyon-cold-vault-deception',
};

export const CARD = {
  id: 'mm-chain-multisig-governance',
  version: '1.0.0',
  name: 'Multisig governance',
  family: 'Chain and treasury',
  tier: 'proven',
  statement: 'Multisig governance defeats the single stolen key by requiring M of N independent signers, each verifying the same transaction on their own hardware, before any funds or contracts move.',
  holds: ['Single private key theft or loss', 'Insider acting alone', 'Hot wallet drain from one compromised server', 'Unilateral contract upgrade by one operator', 'Coerced single signer'],
  failsWhen: [
    'Signers sign what the interface shows them without decoding the calldata on the device.',
    'The signer set is not independent.',
  ],
  combines: ['Hardware root of trust', 'Timelock and guardian', 'Two person integrity', 'Witnessed key ceremony', 'Treasury tiers'],
  conflicts: ['Protocol circuit breakers'],
  /* the corpus line begins "First move: "; the card's own heading says that, so the label is dropped */
  adoption: 'List every address that holds value and every key that can move it, then put the largest balance behind a 3 of 5 or higher threshold across separate people and devices.',
  signals: [
    'No single person can move funds from any address above the daily operating limit',
    'Every signer can state what a transaction does from the device screen before signing',
    'Signer rotation has been executed at least once in the past year',
  ],
  evidence: [
    { source: 'Bybit, 21 February 2025', mark: 'Said' as const },
    { source: 'Ronin bridge, March 2022', mark: 'Said' as const },
    { source: 'Safe post incident changes, 2025', mark: 'Said' as const },
    { source: 'Chainalysis 2024 figures', mark: 'Said' as const },
  ],
  practice: '/#/model/mm-chain-multisig-governance',
};

/** the first MOTRUS, as drafted in C:\Users\Initi\ankras\motrus\dash-treasury-multisig.json */
export const FIRST = {
  ankras: 'Multisig governance 1.0.0',
  threshold: 5,
  floor: 5,
  measuredDays: 180,
  witnesses: 2,
};

/** the sixteen relationship words; nine already exist on Intuition mainnet and are reused, read 12 November 2026 */
export const WORDS: { w: string; s: string; o: string; id?: string; positions?: number }[] = [
  { w: 'has tag', s: 'card', o: 'family', id: '0x7ec36d201c', positions: 41842 },
  { w: 'is', s: 'card', o: 'Ankras', id: '0xdd4320a03f', positions: 3141 },
  { w: 'holds', s: 'card', o: 'threat', id: '0x867c3bf5c6', positions: 2 },
  { w: 'Depends on', s: 'card', o: 'card', id: '0x33b2327cd1', positions: 2 },
  { w: 'conflicts with', s: 'card', o: 'card', id: '0x01d4e9039f', positions: 2 },
  { w: 'replaces', s: 'version', o: 'version', id: '0x117cf16c77', positions: 2 },
  { w: 'proposes', s: 'team', o: 'MOTRUS', id: '0xa82fbe6d57', positions: 2 },
  { w: 'Adopts', s: 'organization', o: 'version', id: '0xc831b34100', positions: 2 },
  { w: 'attests', s: 'witness', o: 'claim', id: '0x724e870b26', positions: 2 },
  { w: 'combines with', s: 'card', o: 'card' },
  { w: 'fork of', s: 'version', o: 'version' },
  { w: 'used when', s: 'card', o: 'condition' },
  { w: 'commits to', s: 'organization', o: 'MOTRUS' },
  { w: 'held under', s: 'version', o: 'pressure' },
  { w: 'stopped', s: 'version', o: 'incident' },
  { w: 'failed at', s: 'version', o: 'incident' },
];

/** the two genesis cards (C:\Users\Initi\ankras\seed\genesis), drafts written 12 November 2026 for review */
export const GENESIS = [
  {
    id: 'genesis-ankras',
    name: 'Ankras',
    version: '1.0.0',
    statement: 'Ankras writes each security practice as a versioned card that names what it stops, when it fails and the evidence behind it, so many organizations can check the same practice, adopt it and make it better together.',
    holds: ['Security advice with no evidence and no date', 'The same failure repeated because the lesson stayed private', 'Practices that drift with no record of what changed'],
    failsWhen: ['Cards are published before a practitioner has reviewed them.', 'Evidence stays Said and goes unlinked.', 'Organizations adopt a card and report nothing back.'],
    signals: ['Every published card has at least one Shown source', 'Every adopted card receives results within its measure window', 'Every new version names the evidence that changed it'],
    next: 'Version 1.1.0 comes when the first MOTRUS reports its results.',
  },
  {
    id: 'genesis-motrus',
    name: 'MOTRUS',
    version: '1.0.0',
    statement: 'MOTRUS lets organizations adopt one card version together: each commits on one condition, that enough others commit by a deadline. The move binds only when the threshold is met, and every adopter reports what happened.',
    holds: ['The cost of going first that stops adoption', 'Standards that take years to change', 'Claims of adoption nobody can check'],
    failsWhen: ['The threshold is so low that the move proves nothing.', 'Proof is Said with no witnesses.', 'Adopters stop reporting, so the card cannot learn.'],
    signals: ['Each move publishes its threshold and deadline before commitments open', 'Each adopter\'s proof is Shown or witnessed', 'Each locked move reports results within its measure window'],
    next: 'Version 1.1.0 comes when the first move has locked, adopted and been measured.',
  },
];

/** two world agreements that bound no one until a threshold of parties had joined, each read at its official text */
export const TREATIES = [
  {
    name: 'Montreal Protocol',
    what: 'the ozone treaty',
    n: 11,
    inForce: '1 January 1989',
    rule: 'Eleven parties holding two-thirds of 1986 global consumption',
    source: 'Montreal Protocol, Article 16 (UNEP Ozone Secretariat)',
    href: 'https://ozone.unep.org/treaties/montreal-protocol/articles/article-16-entry-force',
  },
  {
    name: 'Paris Agreement',
    what: 'the climate accord',
    n: 55,
    inForce: '4 November 2016',
    rule: '55 parties holding 55 percent of global emissions',
    source: 'Paris Agreement, Article 21 (UN Treaty Collection)',
    href: 'https://treaties.un.org/Pages/ViewDetails.aspx?src=TREATY&mtdsg_no=XXVII-7-d&chapter=27&clang=_en',
  },
] as const;

/** Donella Meadows' twelve leverage points, read 12 November 2026 */
export const MEADOWS = 'https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/';
