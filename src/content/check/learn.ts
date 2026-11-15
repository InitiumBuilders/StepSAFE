/* DASH DEFENDERS · THE LOOP INTO THE CORPUS. Each statement in the checks names the lessons that teach its move:
   a Step of a chapter, a StepGuide (sg-), a gauge (tr-) or a simulation (sim-). Each was chosen by reading the
   lesson against the statement's move, not by matching words, on 2026-11-05; the Launch shelf of StepGuides
   (guides-launch.ts) was written on 2026-11-08 for the statements that had none. A gap's move opens them, and when
   every lesson for a gap is done, the check offers to answer that statement again.

   An empty list is a thin place: no lesson in the corpus teaches that move yet. probe-check.mts prints them for
   August and does not fail on them; they are not filled in the same pass that finds them. The catalog structures
   a statement names (its models) are linked already, beside its move, so they are not repeated here. */

export const LEARN: Record<string, string[]> = {
  /* ---------- the treasury ---------- */
  'two-agree': ['ch-chain-safe-mpc', 'sg-safe-signer-operations', 'tr-tidewater'],
  independent: ['ch-identity-p5-s1', 'ch-chain-exchange-grade', 'sg-safe-signer-operations'],
  hardware: ['ch-identity-p5-s3', 'ch-chain-key-is-asset'],
  rotate: ['ch-dashevo-p3-rotation', 'sg-safe-signer-operations'],
  'lose-one': ['ch-identity-p5-s2', 'sg-treasury-key-ceremony'],
  tiers: ['ch-chain-exchange-grade', 'sim-halcyon-custody'],
  address: ['ch-chain-verify-lab', 'ch-chain-blindsign-drill', 'sg-blind-signing-field-note'],
  rule: ['sg-safe-signer-operations', 'ch-chain-insider-drill'],
  seeds: ['ch-identity-p5-s3', 'sg-treasury-key-ceremony'],
  restore: ['ch-identity-p5-s5', 'ch-incident-backup-immutability', 'sg-coming-back'],
  succession: ['ch-identity-p2-s5', 'sg-treasury-key-ceremony'],
  masternode: ['ch-dashevo-p3-key-separation', 'ch-dashevo-p4-vote-security'],

  /* ---------- accounts and access ---------- */
  'domain-lock': ['sg-domain-defense'],
  'dns-signin': ['ch-identity-p1-s3', 'sg-passkey-rollout-playbook'],
  'dns-watch': ['sg-domain-defense', 'ch-detection-ads-document'],
  'cert-watch': ['sg-domain-defense'],
  'strong-signin': ['ch-identity-p1-s3', 'sg-passkey-rollout-playbook', 'tr-ledgerline'],
  'code-host': ['ch-identity-p1-s5', 'sg-passkey-rollout-playbook'],
  community: ['ch-identity-p1-s2', 'sg-identity-attack-drillbook'],
  'few-admins': ['ch-identity-p2-s6', 'tr-ledgerline'],
  'recovery-email': ['ch-identity-p1-s4', 'sg-identity-attack-drillbook'],
  'backup-codes': ['ch-identity-p2-s5'],
  'shared-logins': ['sg-secrets-incident-playbook'],
  'account-list': ['ch-identity-p1-s6', 'ch-ciso-s-ground-truth'],

  /* ---------- code and releases ---------- */
  review: ['ch-appsec-step-chain-taxonomy', 'tr-harbor'],
  'branch-rules': ['ch-appsec-step-tag-drill', 'ch-appsec-step-actions-hardening'],
  'push-protection': ['sg-secrets-incident-playbook'],
  'token-perms': ['ch-appsec-step-actions-hardening', 'ch-identity-p3-s4'],
  signed: ['ch-appsec-step-sign-attest-verify', 'sim-signed-build-poisoned'],
  provenance: ['ch-appsec-step-sign-attest-verify', 'tr-harbor'],
  'release-two': ['tr-harbor', 'ch-ai-two-party-control-field'],
  rollback: ['ch-incident-restore-gap', 'sg-coming-back'],
  'new-deps': ['ch-appsec-step-xz', 'ch-appsec-step-chain-taxonomy'],
  'dep-alerts': ['ch-appsec-step-kev-epss-reach', 'sg-vuln-triage-model'],
  disclosure: ['ch-dashevo-p4-disclosure', 'ch-chain-bounty-design-council'],
  sbom: ['ch-appsec-step-sbom-truth'],

  /* ---------- people and devices ---------- */
  'hire-check': ['sg-verify-new-people'],
  'least-new': ['sg-verify-new-people', 'ch-identity-p2-s6'],
  offboard: ['ch-ai-insider-event-drill', 'ch-identity-p3-s3'],
  'scam-brief': ['sg-identity-attack-drillbook', 'ch-identity-p1-s4'],
  disk: ['ch-identity-p3-s2'],
  updates: ['ch-appsec-step-kev-epss-reach', 'ch-identity-p3-s2'],
  'lost-device': ['ch-identity-p3-s5', 'ch-identity-p3-s3'],
  'stranger-code': ['ch-decinfra-p3-s2-isolation-tiers', 'sg-decentralized-compute-sandboxing'],
  'second-channel': ['tr-instant', 'ch-identity-p1-s4'],
  'never-ask': ['sg-never-ask-line'],
  'closed-channels': ['sg-identity-attack-drillbook'],
  'report-fast': ['ch-incident-declare'],

  /* ---------- the worst day ---------- */
  'ir-plan': ['ch-incident-command-roles', 'sg-ir-readiness-audit'],
  contacts: ['ch-incident-law-enforcement', 'sg-onchain-incident-response'],
  rehearsed: ['ch-incident-ransom-tabletop', 'sg-tabletop-design'],
  logs: ['ch-detection-questions-first', 'sg-logging-decisions-field-note'],
  'war-room': ['ch-incident-single-writer', 'sg-incident-command-first-60', 'ch-chain-war-room-council'],
  pause: ['ch-chain-pause-drill', 'sg-onchain-incident-response'],
  isolate: ['ch-incident-order-of-volatility', 'ch-incident-containment-ladder'],
  rescue: ['ch-chain-no-rollback', 'sg-onchain-incident-response'],
  'tell-users': ['ch-incident-customer-notification', 'sg-crisis-comms-statements'],
  'report-ic3': ['ch-incident-law-enforcement'],
  'restore-checked': ['sg-coming-back', 'ch-incident-idp-rebuild', 'ch-incident-backup-immutability'],
  'after-action': ['ch-incident-causal-analysis', 'sg-post-incident-review'],
};
