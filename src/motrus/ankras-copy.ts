/* The words on the Ankras page. August named the card "Ankras" and called it "the card" (2026-11-12); those words
   are his. Everything else is plain explanation written for him to keep or change. Statements in Title Case. */

export const AK = {
  title: 'Ankras · StepSAFE',
  kicker: 'The card',
  lede: 'An Ankras holds one security practice in a form anyone can check: what it stops, when it fails, and the evidence behind each claim. Every organization that adopts it reports back, and each version learns from the last.',
  see: 'Open The Anatomy',
  motrus: 'Read MOTRUS',
  /** read by a screen reader; the drawing says it to everyone else */
  heroCaption: 'A card settles into the shared graph and a wave moves through it. The threats it holds, the cards it works with and the evidence behind it light up and connect to the card. A result arrives, and the version moves from 1.0.0 to 1.1.0.',

  anatomy: {
    kicker: 'The anatomy',
    title: 'What A Card Holds',
    intro: 'Every Ankras is one document with the same parts. This is the real card for Multisig governance, read part by part, with where each part lives.',
    steps: [
      { t: 'An Id And A Version', d: 'Each card keeps one id for life. Each version gets its own number, and a published version stays exactly as it was published.', where: ['Intuition: one atom per version', 'Dash: one signed document per version'] },
      { t: 'A Statement', d: 'One sentence on what the practice does and what it defeats.', where: ['Dash: in the signed document'] },
      { t: 'What It Holds', d: 'The threats the practice stops when it is in place.', where: ['Intuition: a “holds” triple to each threat'] },
      { t: 'When It Fails', d: 'The conditions that break it, each drawn from a loss on the public record.', where: ['Intuition: a “failed at” triple to each incident'] },
      { t: 'Works With, Pulls Against', d: 'The cards that make it stronger, and the ones it competes with, each with how.', where: ['Intuition: “combines with” and “conflicts with” triples'] },
      { t: 'A First Move And Its Signs', d: 'Where to start, and what a check can look for once it is in place.', where: ['Dash: in the signed document'] },
      { t: 'Evidence, Shown Or Said', d: 'Shown: linked to a source and read on a date. Said: the source is named and not yet linked.', where: ['Dash: an evidence document for each source'] },
      { t: 'Lineage And Review', d: 'What it replaces or forks from, and the practitioners who reviewed it before it went public.', where: ['Intuition: “replaces” and “fork of” triples', 'Dash: a signed review from each reviewer'] },
    ],
  },

  planes: {
    kicker: 'The structure',
    title: 'Three Layers, One Card',
    body: 'A card lives in three places at once. Each layer does one job, and results flow back down through all three.',
    layers: [
      { k: 'practice', t: 'StepSAFE and TheSame.Page', d: 'Where people meet the card: rooms and models teach it, and /ankra and /motrus carry it into the signal field.', has: ['rooms', 'models', '/ankra', '/motrus'] },
      { k: 'intuition', t: 'Intuition', d: 'What it means and how strongly: each version an atom, each relationship a triple, with FOR and AGAINST stake on every triple.', has: ['atoms', 'triples', 'stake'] },
      { k: 'dash', t: 'Dash Platform', d: 'Who and what: verified identities and names for organizations, reviewers and witnesses, and every card version as a signed document.', has: ['identities', 'names', 'documents', 'votes'] },
    ],
    /* between each pair of layers: what flows down (left, amber) and what flows up (right, ice) */
    flows: [
      { down: 'practice turns into reports', up: 'the graph teaches the rooms' },
      { down: 'results are kept as evidence', up: 'signed text becomes an atom' },
    ],
  },

  words: {
    kicker: 'The vocabulary',
    title: 'Sixteen Words, Nine Already Shared',
    body: 'Ankras speaks in sixteen relationship words. Nine already exist on Intuition, so every card joins the graph that is already there. “has tag” alone carries 41,842 positions. Seven words are new.',
    read: 'Read on Intuition mainnet, 12 November 2026.',
    reused: 'on Intuition',
    fresh: 'new',
    positions: 'positions',
  },

  learn: {
    kicker: 'Versions',
    title: 'How A Card Learns',
    body: 'A published version stays as it is. A better one replaces it and a variation forks from it, so anyone can see what changed, when, and on what evidence.',
    kinds: [
      { v: '1.0.1', d: 'Clearer words. Every claim stays the same.' },
      { v: '1.1.0', d: 'New evidence, a new failure mode or a new sign.' },
      { v: '2.0.0', d: 'What the card stops has changed.' },
    ],
    replaces: 'replaces',
    fork: 'fork of',
    forkName: 'for DAOs',
  },

  losses: {
    kicker: 'Evidence',
    title: 'Every Failure Mode Comes From A Loss',
    body: 'The two ways Multisig governance fails, and the threshold in its first move, each come from a public loss. Linked to their sources and read today, all three move from Said to Shown.',
    read: 'Read 12 November 2026',
    shown: 'Shown',
  },

  results: {
    kicker: 'Collective intelligence',
    title: 'Results Come Back Together',
    body: 'Every organization that adopts a card through a MOTRUS reports what happened. Reports are combined five or more at a time and published after a delay, so the public learns which practices work while each organization stays private.',
    steps: [
      'Commit through a MOTRUS.',
      'Put the card in place.',
      'Report on schedule: what held, what failed, what it cost.',
      'Prove it: Shown, or Said with two witnesses.',
      'Reports combine in groups of five or more.',
      'Practitioners review, and a new version is written.',
    ],
    labels: { report: 'reports', floor: 'five or more', result: 'one result', card: 'the card' },
    submit: 'Companies, DAOs and research teams can also submit research, data and traction directly to a card. Each submission is reviewed like a result, and accepted work is credited to the people who did it.',
  },

  rewards: {
    held: 'A PAXT can keep a pool that pays for evidence each quarter it still holds.',
    heldOpen: 'Held Evidence Earns Again',
    kicker: 'Rewards',
    title: 'Insight Earns TRUST',
    body: 'The people whose insight makes a card stronger are paid for it in TRUST, from an insight pool.',
    poolTitle: 'The Insight Pool',
    pool: ['A share of every MOTRUS run and attestation (proposed: one fifth)', 'Ecosystem and research grants', 'Treasury proposals, such as Dash\'s'],
    earnTitle: 'What Earns',
    earn: [
      { t: 'A source linked', d: 'A Said claim becomes Shown.', w: 1 },
      { t: 'A result reported', d: 'Counted in a group of five or more.', w: 2 },
      { t: 'A version reviewed', d: 'Signed off by two reviewers.', w: 3 },
      { t: 'A failure mode found', d: 'With evidence, accepted into a card.', w: 5 },
      { t: 'A version adopted', d: 'A MOTRUS adopts the version you wrote.', w: 8 },
    ],
    weightsNote: 'Proposed weights. The first SoundMind Teams set them.',
    payTitle: 'How It Pays',
    pay: [
      'Two reviewers accept a contribution before it earns.',
      'Each quarter, the pool is shared by accepted weight and paid in TRUST to each contributor\'s wallet.',
      'One verified identity per person, through Dash Platform.',
      'On Intuition, backing a claim early buys shares on a bonding curve. When others back it later, those shares can be worth more.',
    ],
    flow: { insight: 'insight', card: 'the card', trust: 'TRUST' },
  },

  genesis: {
    kicker: 'Genesis',
    title: 'The First Two Cards',
    body: 'The first Ankras describes Ankras itself. The second describes MOTRUS. Both are drafts written today for review, and both will learn the way every card does.',
    stops: 'What it stops',
    fails: 'When it fails',
    signs: 'Signs it is working',
    next: 'What comes next',
    draft: 'Draft',
  },

  close: {
    doors: [
      { t: 'Read MOTRUS', href: '/MOTRUS' },
      { t: 'Practice The Cards', href: '/#/models' },
      { t: 'TheSame.Page', href: 'https://www.thesame.page' },
    ],
    note: 'Written 12 November 2026. Card counts come from the corpus, word counts from Intuition mainnet, and losses from the sources linked beside them, all read that day. The rewards design and the genesis cards are proposals.',
  },
};
