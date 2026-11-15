/* Words for the newer sections of both pages: how the move holds under attack, where it moves the system, the
   thresholds that carried two world agreements, and how a card stays true. All of it is mine and plain; facts and
   their sources live in facts.ts. The defenses are proposed rules of the protocol, written out in full in
   C:\Users\Initi\ankras\SPEC-FLOWS.md (section 11). */

export const DEF = {
  holds: {
    kicker: 'Defense',
    title: 'Built To Hold Under Pressure',
    lede: 'Each rule of the move answers a way someone could attack it. These are the eight we planned for first.',
    caption: 'Eight attacks arrive from eight sides of the move. Each one stops at the rule built to meet it, and the move holds.',
    rows: [
      { t: 'Fake organizations', d: 'A commitment counts only from a verified identity, one per organization, proven by its domain or its treasury.' },
      { t: 'A last-minute withdrawal', d: 'Withdrawals close three days before the deadline, so the count everyone sees is the count that locks.' },
      { t: 'Committing without adopting', d: 'Proof is due by a set date. A missing proof stays on the record, and the result says how many adopted.' },
      { t: 'Witnesses who collude', d: 'Each Said proof needs two witnesses from two other organizations, and Shown evidence outranks it.' },
      { t: 'Unmasking one member', d: 'A result publishes from five or more members, and only when it differs from the last release by five or more.' },
      { t: 'Rushed emergency terms', d: 'An emergency move ends after 30 days unless the standard lane ratifies it.' },
      { t: 'A swapped screen', d: 'Every document is plain text and is hashed on the signer\u2019s own device, so a changed page cannot change what gets signed.' },
      { t: 'Farmed rewards', d: 'Two reviewers accept each contribution, and the weights favor depth: a failure mode found earns five times a linked source.' },
    ],
  },
  levers: {
    kicker: 'Leverage',
    title: 'Six Places MOTRUS Moves The System',
    lede: 'Donella Meadows ranked twelve places to intervene in a system, from numbers at the bottom to paradigms at the top. MOTRUS works on six of them, from loops up to paradigm.',
    source: 'Leverage Points: Places to Intervene in a System, Donella Meadows',
    rungs: [
      { n: 1, name: 'Transcending paradigms' },
      { n: 2, name: 'Paradigm', line: 'Security becomes something organizations build together.' },
      { n: 3, name: 'Goals', line: 'The measure is what held and what failed in the field.' },
      { n: 4, name: 'Self-organization', line: 'Each result can write the card\u2019s next version.' },
      { n: 5, name: 'Rules', line: 'A commitment binds only when enough others commit.' },
      { n: 6, name: 'Information flows', line: 'What one organization learns reaches every team, in groups of five.' },
      { n: 7, name: 'Reinforcing loops', line: 'Each adoption adds evidence, and better evidence brings the next adopter.' },
      { n: 8, name: 'Balancing loops' },
      { n: 9, name: 'Delays' },
      { n: 10, name: 'Stocks and flows' },
      { n: 11, name: 'Buffers' },
      { n: 12, name: 'Numbers' },
    ],
  },
  precedent: {
    kicker: 'Precedent',
    title: 'Thresholds Have Moved The World Before',
    lede: 'The ozone treaty and the climate accord each bound no one until enough parties had joined. MOTRUS brings the same rule to security.',
    caption: 'Three rings of commitments. Each fills one party at a time and closes when its threshold is met: eleven parties for the ozone treaty, fifty-five for the climate accord, five organizations for the first MOTRUS.',
    proposed: 'Proposed',
  },
  cardTrue: {
    kicker: 'Integrity',
    title: 'How A Card Stays True',
    lede: 'Four ways someone could bend a card, and the rule that keeps it straight.',
    caption: 'Four attacks reach the card from four sides. Each stops at the rule that meets it, and the card keeps its seal.',
    rows: [
      { t: 'Poisoned evidence', d: 'A source counts after two practitioners review it, and results combine only in groups of five.' },
      { t: 'A harmful version', d: 'Every version is hashed and reviewed before it publishes, so the version adopted is the version that was read.' },
      { t: 'Bought trust', d: 'Stake on Intuition shows conviction. A version earns trust from Shown results and adoptions.' },
      { t: 'Lookalike cards', d: 'Every version names the one it replaces or forks, and the record keeps the whole line.' },
    ],
  },
} as const;
