/* OTHER NAMES. A name the Steps, the guides or other entries use for a concept the glossary files under another
   name: an abbreviation, a spelling, or the same idea in other words. Each was read against its entry on
   2026-11-09. An entry's other names resolve links to it (content/registry.ts), link the words in prose when
   they are long enough to be safe (lib/terms.ts), are found by the glossary's search, and show on the entry as
   "Also called".

   A name belongs here only when it means the entry itself. A narrower idea that an entry merely covers is not
   another name for it; the glossary finds those from the phrase in the entry's own text (lookup() in lib/terms.ts).

   RETIRED holds the seven entries that said the same thing as another entry. Each pair is now one entry. The
   retired id still resolves through the kept entry's other names, and a learner's study record for a retired
   card moves to the kept card when the record loads (lib/state.tsx). The retired text is in the repository's
   history (commit f0136bf and earlier). */

export const TERM_ALIASES: Record<string, string[]> = {
  /* the seven merged pairs: the retired entry's name */
  'blameless-postmortem': ['Blameless Post-Mortem', 'Blameless review'],
  'hsm': ['Hardware Security Module'],
  'mttd': ['Mean Time to Detect'],
  'normal-accident': ['Normal Accident Theory'],
  'pseudonymisation': ['Pseudonymization'],
  'threshold-signature': ['Threshold Signature Scheme', 'TSS'],
  'kev': ['CISA KEV', 'Known Exploited Vulnerabilities'],

  /* abbreviations and their expansions */
  'sca': ['Software Composition Analysis'],
  'rto': ['Recovery Time Objective'],
  'rpo': ['Recovery Point Objective'],
  'mttr': ['Mean Time to Respond', 'Mean Time to Recover'],
  'cid': ['Content Identifier'],
  'indicator-of-compromise': ['IOC'],
  'post-quantum-cryptography': ['Post-quantum', 'PQC'],
  'nist-ai-rmf': ['AI RMF'],

  /* the same idea in the words a Step uses */
  'chain-reorganization': ['Reorg'],
  'entitlement-review': ['Access Review', 'Access Certification', 'User Access Review'],
  'csf-2-0-govern': ['CSF Govern', 'Govern Function'],
  'break-glass': ['Break-Glass Credential', 'Break-Glass Account', 'Emergency Access Account'],
  'finality': ['Settlement Finality'],
  'hot-warm-cold-custody': ['Hot-Cold Segmentation'],
  'platform-credit': ['Credits'],
  'multisig': ['Safe multisig', 'Multisignature'],
  'sigma': ['Sigma rule'],
  'tombstone': ['Tombstone record'],
  'supply-chain-attack': ['Supply Chain Compromise'],
  'kill-chain': ['Intrusion Kill Chain', 'Cyber Kill Chain'],
  'out-of-band-communications': ['Out-of-band comms'],
  'phishing-resistant-mfa': ['Phishing-resistant authentication', 'Phishing-resistant auth', 'Phishing-resistant factor', 'Phishing-resistant'],
  'training-data-poisoning': ['Data poisoning'],
  'threat-hunting-hypothesis': ['Hunt hypothesis'],
  'goodharts-law': ['Goodhart', 'Goodhart effect'],
  'alignment-vs-control': ['Alignment versus control'],
  'dangerous-capability-evaluation': ['Dangerous capability eval'],
  'in-toto': ['in-toto attestation'],
  'risk-acceptance': ['Accepted risk'],
};

/** an entry that said the same thing as another: the retired id, and the entry that now holds its place */
export const RETIRED: Record<string, string> = {
  'blameless-post-mortem': 'blameless-postmortem',
  'hardware-security-module': 'hsm',
  'mean-time-to-detect': 'mttd',
  'normal-accident-theory': 'normal-accident',
  'pseudonymization': 'pseudonymisation',
  'threshold-signature-scheme': 'threshold-signature',
  'cisa-kev': 'kev',
};
