/* The words on the MOTRUS page, in one place so they can be read, checked and changed together.
   Lines in HIS are August's, verbatim (2026-11-12), spacing and spelling included. Everything else is plain
   explanation written for him to keep or change. Statements are in Title Case; body sentences are not. */

export const HIS = {
  /** the tagline, as he wrote it */
  tagline: 'THE MOVE THAT HELPS HUMANITY BUILD MORE TRUST TOGETHER',
  /** the meaning, an exact excerpt of his line */
  meaning: 'to move safe and sound and secure and strong forward together. to move towards stronger trust together',
  /** the teams, his names */
  ussdt: 'United Systems Security Design Team',
  ussdtShort: 'USSDT',
  soundmind: 'Your SoundMind Team',
  systemsMindName: 'SystemsMind Team',
  soundMindName: 'SoundMind Team',
  /** his statement for the teams, verbatim */
  teams: 'One of the worlds strongest support groups and learning labs for some of the worlds most stressful jobs and strongest systems minds. Your SoundMind Team. Sound System. Sound Mind. We learn better together. We build better with sound mind. We stay stronger and safer with better design and depth overtime. Sometimes it just helps  to share the weight and lessons and insights we learn with security practitioners while also building sound mind.',
  /** his hashtag */
  stronger: '#StrongerOverTime',
};

export const COPY = {
  title: 'MOTRUS · StepSAFE',
  kicker: 'A proposal from StepSAFE',
  lede: 'MOTRUS lets organizations adopt a security practice together. Each practice is written as an Ankras: a card that says what it stops, when it fails, and what the evidence shows. A commitment binds only when enough organizations have committed. Then everyone reports what happened, and the card gets better.',
  read: 'Walk One Move',
  open: 'Open StepSAFE',
  /** read by a screen reader; the ring says it to everyone else */
  heroCaption: 'Twelve organizations. Each one commits when it is ready and takes its place in the ring. When two thirds have committed, the move locks, and a light starts to travel between them. The rest can still join.',

  gap: {
    title: 'The Group Moves At Once',
    body: [
      'Each organization commits on one condition: that enough others commit too. When enough have, they all move at once and share the cost of going first.',
      'In a public-goods experiment, about half of the people cooperated as much as they expected others to. MOTRUS is built for them: it lets a group commit together, with the condition written down.',
    ],
    alone: 'Alone',
    together: 'Together',
    caption: 'Alone, one organization carries the whole cost of going first. Together, they commit, move at once and share it.',
  },

  walk: {
    kicker: 'One move, start to finish',
    title: 'From One Loss To A Stronger Card',
    intro: 'This walk starts in The Practice, in a room built from the public record of the signing-interface theft of February 2025, and follows one card through one move.',
    room: 'Open the room',
    steps: [
      { t: 'Every Signature Was Valid', d: 'In the room The Signature Was Valid, three signers approve what their screen calls a routine transfer. The payload they sign replaces the vault\'s code, and the vault empties. It is modelled on the theft of 21 February 2025: about $1.5 billion.' },
      { t: 'Three Signers, One Screen', d: 'Mapped as a system, the vault is the stock and signing is the gate. All three signers read the same screen, so one compromised screen opened the gate for all of them. Signers who share one view count as one.' },
      { t: 'The Card Already Knew', d: 'Multisig governance, an Ankras from the corpus, names this failure in its own words. It also names the sign that it is working: every signer can say what a transaction does from the device screen before signing.' },
      { t: 'Each Loss Becomes Evidence', d: 'Three public losses each show one way the practice fails: the screen, the signers, the threshold. Linked to their sources and read on a date, they move from Said to Shown.' },
      { t: 'A Team Proposes The Move', d: 'A SoundMind Team puts forward a MOTRUS for the Dash ecosystem: adopt Multisig governance 1.0.0, with every signer checking on the device. Five projects must commit for it to bind.' },
      { t: 'Five Commit, The Move Locks', d: 'Each project commits on the condition that the others do. When the fifth commits, the move locks and all five adopt.' },
      { t: 'Proof, Shown And Said', d: 'The chain shows each project\'s threshold once its address has spent. The checks on each device are Said, and two peers witness them.' },
      { t: 'Results Make The Next Version', d: 'After 180 days the five report as one group. The result becomes evidence, the card moves to 1.1.0 with what they learned, and the people whose insight changed it earn TRUST.' },
    ],
    labels: {
      routine: 'routine transfer',
      vault: 'vault',
      audited: 'audited code',
      replaced: 'new code',
      signers: '3 signers',
      screen: '1 screen',
      team: 'SoundMind Team',
      bind: '5 to bind',
      locked: 'locked',
      shown: 'Shown',
      said: 'Said',
      witnesses: 'witnesses',
      floor: 'five together',
      researcher: 'researcher',
      reviewers: 'reviewers',
      teams: 'teams',
    },
  },

  ankras: {
    kicker: 'The card',
    title: 'Ankras',
    body: 'An Ankras holds one security practice in a form anyone can check. It names what the practice stops, when it fails, what it works with, how to start, the signs that it is working, and the evidence behind each claim.',
    real: 'An Ankras from the StepSAFE corpus',
    open: 'Explore Ankras',
    stats: 'Drawn so far from the corpus',
    stops: 'What it stops',
    fails: 'When it fails',
    signs: 'Signs it is working',
    evidence: 'Evidence',
  },

  layers: {
    kicker: 'Where it lives',
    title: 'Built On Intuition And Dash',
    intuitionTitle: 'Intuition Holds What We Know',
    intuition: 'Intuition is a shared knowledge graph. Each Ankras version becomes an atom. Each relationship becomes a triple: a short sentence such as “this card holds this threat”. People back a triple or dispute it by staking on it, so agreement and disagreement both carry weight.',
    dashTitle: 'Dash Holds Who We Are And What We Decide',
    dash: 'Dash Platform gives organizations and reviewers verified identities and names, and keeps each card\'s signed text and each move\'s commitments as documents. Dash\'s treasury, run by masternode votes since 2015, can fund the work and decide moves for the Dash ecosystem.',
    words: 'Ankras uses 16 relationship words. 9 of them already exist on Intuition, so Ankras reuses them and joins the graph that is already there.',
    atomsLabel: 'Atoms and triples',
    stakeOn: 'Stake on “holds”',
    stakeFor: 'Backed',
    stakeAgainst: 'Disputed',
    identity: 'Identity',
    document: 'Signed document',
    vote: 'Masternode vote',
  },

  move: {
    kicker: 'The move',
    title: 'MOTRUS',
    body: 'A MOTRUS asks a group to adopt one Ankras version by a date. Each organization commits on one condition: that enough others commit too. If the threshold is met by the deadline, the move locks and everyone who committed adopts. If not, it lapses and binds no one.',
    stations: [
      { k: 'proposed', t: 'Proposed', d: 'A SoundMind Team or an organization puts it forward.' },
      { k: 'open', t: 'Open', d: 'Organizations commit.' },
      { k: 'locked', t: 'Locked', d: 'The threshold is met.' },
      { k: 'adopting', t: 'Adopting', d: 'Each one puts the card in place.' },
      { k: 'measured', t: 'Measured', d: 'Results come back over time.' },
      { k: 'evolved', t: 'Evolved', d: 'The card gets a better version.' },
    ],
    praxis: 'The name has two uses. In the Praxis, MoTRUS models are the security structures learners invent. MOTRUS, the move, is how organizations adopt a practice together. Planned: a sound MoTRUS model can be written as an Ankras and proposed as a move.',
    lapsed: 'Lapsed: below the threshold at the deadline. Nobody is bound.',
    standard: 'Standard',
    standardBody: 'Reviewed first, then open for commitments until a deadline.',
    emergency: 'Emergency',
    emergencyBody: 'For an active exploit: a short deadline and a smaller threshold.',
    terms: 'The terms of a move',
    termRows: [
      { k: 'ankras', t: 'The card', d: 'One Ankras version, named by id and version.' },
      { k: 'lane', t: 'Lane', d: 'Standard, or emergency for an active exploit.' },
      { k: 'scope', t: 'Who it is for', d: 'An ecosystem, an industry, or a team\'s members.' },
      { k: 'threshold', t: 'Threshold', d: 'How many must commit, as a count or a share.' },
      { k: 'deadline', t: 'Deadline', d: 'The date the threshold must be met by.' },
      { k: 'proof', t: 'Proof', d: 'What the chain can show, and what witnesses confirm.' },
      { k: 'privacy', t: 'Privacy floor', d: 'Results only in groups of five or more, after a delay.' },
      { k: 'outcomes', t: 'Outcomes', d: 'How long to measure, and what to report.' },
    ],
  },

  teams: {
    kicker: 'The teams',
    stagesTitle: 'Every Team Starts As A SystemsMind Team',
    stages: [
      'A team forms: security leads and practitioners who meet, learn systems together and share the practices they run.',
      'Once a team contributes research, results and lessons that change a card, it becomes a SoundMind Team.',
    ],
    does: ['Research labs on open questions', 'MOTRUS moves proposed and run together', 'Results reported in groups of five or more', 'Peer support for the people who carry these jobs'],
    care: 'Peer support sits beside professional care. To talk with a person,',
    careEnd: 'is open. In a crisis in the US, call or text 988.',
    talk: 'https://www.soundmind.team/talk',
    talkLabel: 'SoundMind.Team',
  },

  proof: {
    kicker: 'Proof and privacy',
    title: 'Show What Can Be Shown. Protect Who Is Exposed.',
    shownTitle: 'Shown',
    shown: 'On Dash, a multisig address shows its threshold on the chain once it has spent. Before that, a project can publish its script and anyone can check it against the address.',
    saidTitle: 'Said, And Witnessed',
    said: 'What only an organization can say is marked Said. Peers who saw it attest to it.',
    floorTitle: 'The Floor Of Five',
    floor: 'Results are published only from five organizations or more, and only after a delay. The public layer shows which practices work and keeps each organization\'s exposure private.',
    circle: 'Inside a SoundMind Team, discussion stays private. The team decides whether to publish its move.',
    statement: 'Each signer is a different person on a different device.',
    address: ['multisig', 'address'],
    spends: 'spends',
    script: 'its script',
    attests: 'attests',
    published: 'Published as one result for all five',
  },

  industry: {
    kicker: 'For the crypto industry',
    title: 'Four Moves The Industry Can Make Together',
    stat: 'In the first half of 2025, $2.17 billion was stolen from crypto services. One signing-interface theft was about 69% of it.',
    statLabel: 'Bybit, about 69%',
    restLabel: 'every other theft',
    from: 'From',
    card: 'Ankras',
    moves: [
      { t: 'Check On The Device', d: 'Every signer reads the transaction on the hardware screen, apart from the web interface.', card: 'Multisig governance', from: 'Bybit, 2025' },
      { t: 'Separate Signers', d: 'The keys that meet the threshold sit with separate organizations, people and devices.', card: 'Two person integrity', from: 'Ronin bridge, 2022' },
      { t: 'Three Of Five Or More', d: 'A threshold of at least three of five, so two stolen keys move nothing.', card: 'Multisig governance', from: 'Harmony bridge, 2022' },
      { t: 'Code Changes Wait', d: 'A change to a vault\'s own code waits behind a timelock everyone can watch.', card: 'Timelock and guardian', from: 'Bybit, 2025' },
    ],
    note: 'Each one can be proposed as a MOTRUS today.',
  },

  loop: {
    kicker: 'The loop',
    title: 'A Record That Learns',
    body: 'Every adopted move reports what happened. The results go into the OmniDrive, a shared record kept with the cards. A card that held gains evidence. A card that failed gets a better version. StepSAFE turns the lessons into practice, and a defender AI can learn from all of it.',
    ratchet: 'Once a card has held, that result stays on the record.',
    planned: 'Planned: when a major incident is disclosed, it becomes a practice room within days, so defenders rehearse it before attackers repeat it.',
    stations: ['Practice', 'Move', 'Results', 'New version'],
    center: 'The record',
  },

  rewards: {
    kicker: 'Collective intelligence',
    title: 'Insight Earns TRUST',
    body: 'Researchers, practitioners and teams earn TRUST when their insight makes a card stronger: a source linked, a result reported, a version reviewed, a failure mode found. The full design is on the Ankras page.',
    link: 'How Rewards Work',
    href: '/ankras#rewards',
    kinds: ['A source linked', 'A result reported', 'A version reviewed', 'A failure mode found', 'A version adopted'],
  },

  first: {
    kicker: 'Proposed',
    title: 'The First MOTRUS',
    what: 'For the Dash ecosystem: each project holds its largest balance in a 3 of 5 or higher multisig address, with each signer a different person on a different device.',
    card: 'Ankras',
    threshold: 'Threshold',
    proof: 'Proof',
    proofShown: 'Shown: the address and its script',
    proofSaid: 'Said: separate people and devices, witnessed by two peers',
    privacy: 'Privacy floor',
    measured: 'Measured for',
    status: 'Draft. The threshold, the dates and the first five projects are being set.',
    committed: 'committed',
  },

  model: {
    kicker: 'Sustainability',
    title: 'How It Pays For Itself',
    body: 'The knowledge stays open. Organizations pay for coordination, proof and support.',
    freeTitle: 'Open To Everyone',
    free: ['StepSAFE practice', 'Every published Ankras', 'The MOTRUS protocol', 'Moves for small projects and communities', 'A SoundMind Team for every practitioner'],
    streamsTitle: 'What Organizations Pay For',
    streams: [
      { t: 'SoundMind Teams', d: 'Organizations sponsor seats for their people.' },
      { t: 'MOTRUS runs', d: 'Setting up a move, reading its proof and reporting its results.' },
      { t: 'Attestations', d: 'Signed proof of adoption that renews when its evidence expires.' },
      { t: 'The defender AI', d: 'A licensed model that runs on an organization\'s own hardware.' },
      { t: 'Ecosystem funding', d: 'Treasury proposals, ecosystem grants and research grants.' },
    ],
    usesTitle: 'Where It Goes',
    uses: ['Paid reviews by practitioners', 'Insight rewards in TRUST', 'New rooms and cards', 'Research', 'The security of the system itself'],
    stock: 'The treasury',
    principlesTitle: 'What It Holds To',
    principles: ['Each organization\'s data stays its own.', 'Anyone can check a card\'s evidence.', 'Stake shows conviction. Rank comes from evidence.', 'Results are published only from five organizations or more.'],
  },

  moves: {
    kicker: 'The plan',
    title: 'The Moves, In Order',
    done: 'Done',
    next: 'Next',
    then: 'Then',
    doneItems: ['The names: Ankras and MOTRUS', 'The card and move schemas', '109 cards drawn from the corpus', 'The first MOTRUS drafted', '/motrus and /ankra live on TheSame.Page and Initium'],
    nextItems: ['Claim Ankras and MOTRUS on Intuition', 'The first SoundMind Team', 'Link the evidence on the first ten cards', 'Publish the first ten cards on Intuition\'s testnet', 'Set the first MOTRUS and its five projects'],
    thenItems: ['Cards and commitments on Dash Platform', 'The insight pool and its first rewards', 'The defender AI reads the graph', 'A Dash treasury proposal'],
  },

  paxt: {
    kicker: 'The next layer',
    title: 'A PAXT Carries Many Moves',
    body: 'A MOTRUS is one move by organizations. A PAXT is a standing agreement between whole communities. They have already agreed how they decide, what they share and how they count, so the next move starts from there.',
    open: 'Read PAXT',
  },

  close: {
    doors: [
      { t: 'Explore Ankras', href: '/ankras' },
      { t: 'Open StepSAFE', href: '/' },
      { t: 'TheSame.Page', href: 'https://www.thesame.page' },
    ],
    note: 'Written 12 November 2026. Card counts come from the corpus, word counts from Intuition, and losses from the sources linked beside them, all read that day. The figures for the first MOTRUS and the rewards design are proposals.',
  },
};
