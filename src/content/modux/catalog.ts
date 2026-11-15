/* The Modux catalog: the id contract.

   Written before any content author touched a model. Every link in every
   other Modux file points at one of these ids and nothing else. 96 models,
   12 families, 4 tiers. */

import type { ModuxEntry } from '../modux-schema';

export const CATALOG: ModuxEntry[] = [
  /* identity */
  { id: 'mm-identity-phishing-resistant-auth', name: 'Phishing resistant authentication', family: 'identity', tier: 'proven' },
  { id: 'mm-identity-zero-standing-privilege', name: 'Zero standing privilege', family: 'identity', tier: 'proven' },
  { id: 'mm-identity-workload-identity', name: 'Workload identity', family: 'identity', tier: 'proven' },
  { id: 'mm-identity-continuous-access-evaluation', name: 'Continuous access evaluation', family: 'identity', tier: 'emerging' },
  { id: 'mm-identity-relationship-authorization', name: 'Relationship based authorization', family: 'identity', tier: 'proven' },
  { id: 'mm-identity-break-glass', name: 'Break glass with evidence', family: 'identity', tier: 'bedrock' },
  { id: 'mm-identity-device-bound-session', name: 'Device bound sessions', family: 'identity', tier: 'emerging' },
  { id: 'mm-identity-verifiable-credentials', name: 'Verifiable credentials', family: 'identity', tier: 'emerging' },

  /* trust */
  { id: 'mm-trust-policy-enforcement-point', name: 'Policy engine and enforcement point', family: 'trust', tier: 'proven' },
  { id: 'mm-trust-context-aware-access', name: 'Context aware access', family: 'trust', tier: 'proven' },
  { id: 'mm-trust-microsegmentation', name: 'Identity aware segmentation', family: 'trust', tier: 'proven' },
  { id: 'mm-trust-boundary-ledger', name: 'The trust boundary ledger', family: 'trust', tier: 'bedrock' },
  { id: 'mm-trust-confidential-computing', name: 'Confidential computing boundary', family: 'trust', tier: 'emerging' },
  { id: 'mm-trust-object-capabilities', name: 'Object capabilities', family: 'trust', tier: 'bedrock' },
  { id: 'mm-trust-blast-radius-budget', name: 'Blast radius budgeting', family: 'trust', tier: 'proven' },
  { id: 'mm-trust-mutual-tls-mesh', name: 'Mutual TLS mesh', family: 'trust', tier: 'proven' },

  /* crypto */
  { id: 'mm-crypto-threshold-custody', name: 'Threshold custody', family: 'crypto', tier: 'proven' },
  { id: 'mm-crypto-hardware-root', name: 'Hardware root of trust', family: 'crypto', tier: 'bedrock' },
  { id: 'mm-crypto-envelope-encryption', name: 'Envelope encryption', family: 'crypto', tier: 'proven' },
  { id: 'mm-crypto-crypto-shredding', name: 'Crypto shredding', family: 'crypto', tier: 'proven' },
  { id: 'mm-crypto-post-quantum-migration', name: 'Post quantum migration', family: 'crypto', tier: 'emerging' },
  { id: 'mm-crypto-short-lived-secrets', name: 'Short lived secrets', family: 'crypto', tier: 'proven' },
  { id: 'mm-crypto-transparency-log', name: 'Transparency logs', family: 'crypto', tier: 'proven' },
  { id: 'mm-crypto-witnessed-ceremony', name: 'Witnessed key ceremony', family: 'crypto', tier: 'bedrock' },

  /* supply */
  { id: 'mm-supply-build-integrity-levels', name: 'Build integrity levels', family: 'supply', tier: 'proven' },
  { id: 'mm-supply-sbom-and-exploitability', name: 'SBOM with exploitability', family: 'supply', tier: 'emerging' },
  { id: 'mm-supply-keyless-signing', name: 'Keyless artifact signing', family: 'supply', tier: 'proven' },
  { id: 'mm-supply-reproducible-builds', name: 'Reproducible builds', family: 'supply', tier: 'proven' },
  { id: 'mm-supply-dependency-cooldown', name: 'Dependency cooldown', family: 'supply', tier: 'emerging' },
  { id: 'mm-supply-paved-road', name: 'The paved road', family: 'supply', tier: 'proven' },
  { id: 'mm-supply-secure-by-default', name: 'Secure by default', family: 'supply', tier: 'proven' },
  { id: 'mm-supply-ephemeral-builders', name: 'Ephemeral builders', family: 'supply', tier: 'proven' },

  /* detect */
  { id: 'mm-detect-detection-as-code', name: 'Detection as code', family: 'detect', tier: 'proven' },
  { id: 'mm-detect-behaviour-over-indicators', name: 'Behaviour over indicators', family: 'detect', tier: 'bedrock' },
  { id: 'mm-detect-telemetry-tiers', name: 'Telemetry tiers', family: 'detect', tier: 'proven' },
  { id: 'mm-detect-deception-layer', name: 'The deception layer', family: 'detect', tier: 'proven' },
  { id: 'mm-detect-hypothesis-hunting', name: 'Hypothesis hunting', family: 'detect', tier: 'proven' },
  { id: 'mm-detect-identity-first-triage', name: 'Identity first triage', family: 'detect', tier: 'emerging' },
  { id: 'mm-detect-schema-normalisation', name: 'Schema normalisation', family: 'detect', tier: 'emerging' },
  { id: 'mm-detect-verified-machine-triage', name: 'Verified machine triage', family: 'detect', tier: 'emerging' },

  /* resilience */
  { id: 'mm-resilience-chaos-experiments', name: 'Chaos experiments', family: 'resilience', tier: 'proven' },
  { id: 'mm-resilience-immutable-backups', name: 'Immutable backups', family: 'resilience', tier: 'bedrock' },
  { id: 'mm-resilience-cell-architecture', name: 'Cell architecture', family: 'resilience', tier: 'proven' },
  { id: 'mm-resilience-game-days', name: 'Game days', family: 'resilience', tier: 'proven' },
  { id: 'mm-resilience-blameless-review', name: 'Blameless review', family: 'resilience', tier: 'bedrock' },
  { id: 'mm-resilience-error-budgets', name: 'Error budgets', family: 'resilience', tier: 'proven' },
  { id: 'mm-resilience-fail-safe-defaults', name: 'Fail safe defaults', family: 'resilience', tier: 'bedrock' },
  { id: 'mm-resilience-stress-to-control', name: 'Stress to control loop', family: 'resilience', tier: 'emerging' },

  /* data */
  { id: 'mm-data-minimisation-at-source', name: 'Minimisation at source', family: 'data', tier: 'bedrock' },
  { id: 'mm-data-classification-tiers', name: 'Classification tiers', family: 'data', tier: 'proven' },
  { id: 'mm-data-privacy-by-design', name: 'Privacy by design', family: 'data', tier: 'proven' },
  { id: 'mm-data-differential-privacy', name: 'Differential privacy', family: 'data', tier: 'emerging' },
  { id: 'mm-data-retention-engine', name: 'The retention engine', family: 'data', tier: 'proven' },
  { id: 'mm-data-tokenization-vault', name: 'Tokenization vault', family: 'data', tier: 'proven' },
  { id: 'mm-data-residency-boundaries', name: 'Residency boundaries', family: 'data', tier: 'proven' },
  { id: 'mm-data-permanence-boundary', name: 'The permanence boundary', family: 'data', tier: 'emerging' },

  /* chain */
  { id: 'mm-chain-multisig-governance', name: 'Multisig governance', family: 'chain', tier: 'proven' },
  { id: 'mm-chain-timelock-and-guardian', name: 'Timelock and guardian', family: 'chain', tier: 'proven' },
  { id: 'mm-chain-circuit-breakers', name: 'Protocol circuit breakers', family: 'chain', tier: 'proven' },
  { id: 'mm-chain-formal-verification', name: 'Formal verification', family: 'chain', tier: 'emerging' },
  { id: 'mm-chain-private-order-flow', name: 'Private order flow', family: 'chain', tier: 'emerging' },
  { id: 'mm-chain-treasury-tiers', name: 'Treasury tiers', family: 'chain', tier: 'proven' },
  { id: 'mm-chain-quorum-finality', name: 'Quorum finality', family: 'chain', tier: 'proven' },
  { id: 'mm-chain-credible-neutrality', name: 'Credible neutrality', family: 'chain', tier: 'emerging' },

  /* ai */
  { id: 'mm-ai-dual-model-pattern', name: 'The dual model pattern', family: 'ai', tier: 'emerging' },
  { id: 'mm-ai-capability-sandbox', name: 'Capability sandbox', family: 'ai', tier: 'emerging' },
  { id: 'mm-ai-weight-custody', name: 'Model weight custody', family: 'ai', tier: 'emerging' },
  { id: 'mm-ai-instruction-data-boundary', name: 'Instruction and data boundary', family: 'ai', tier: 'emerging' },
  { id: 'mm-ai-eval-gates', name: 'Evaluation gates', family: 'ai', tier: 'emerging' },
  { id: 'mm-ai-agent-delegation', name: 'Agent identity and delegation', family: 'ai', tier: 'frontier' },
  { id: 'mm-ai-human-approval-gates', name: 'Human approval gates', family: 'ai', tier: 'proven' },
  { id: 'mm-ai-training-provenance', name: 'Training data provenance', family: 'ai', tier: 'emerging' },

  /* si */
  { id: 'mm-si-capability-thresholds', name: 'Capability thresholds', family: 'si', tier: 'emerging' },
  { id: 'mm-si-control-protocols', name: 'Control protocols', family: 'si', tier: 'frontier' },
  { id: 'mm-si-out-of-band-halt', name: 'Out of band halt', family: 'si', tier: 'frontier' },
  { id: 'mm-si-layered-autonomy', name: 'Layered autonomy limits', family: 'si', tier: 'frontier' },
  { id: 'mm-si-interpretability-audit', name: 'Interpretability audits', family: 'si', tier: 'frontier' },
  { id: 'mm-si-constitutional-classifiers', name: 'Constitutional classifiers', family: 'si', tier: 'emerging' },
  { id: 'mm-si-compute-governance', name: 'Compute governance', family: 'si', tier: 'frontier' },
  { id: 'mm-si-weight-exfiltration-containment', name: 'Weight exfiltration containment', family: 'si', tier: 'frontier' },

  /* org */
  { id: 'mm-org-three-lines', name: 'Three lines', family: 'org', tier: 'bedrock' },
  { id: 'mm-org-security-champions', name: 'Security champions', family: 'org', tier: 'proven' },
  { id: 'mm-org-two-person-integrity', name: 'Two person integrity', family: 'org', tier: 'bedrock' },
  { id: 'mm-org-incident-command', name: 'Incident command', family: 'org', tier: 'bedrock' },
  { id: 'mm-org-risk-in-ranges', name: 'Risk in ranges', family: 'org', tier: 'proven' },
  { id: 'mm-org-threat-informed-defense', name: 'Threat informed defense', family: 'org', tier: 'proven' },
  { id: 'mm-org-decision-rights', name: 'Security decision rights', family: 'org', tier: 'proven' },
  { id: 'mm-org-security-commons', name: 'The security commons', family: 'org', tier: 'emerging' },

  /* systems */
  { id: 'mm-systems-stock-and-flow', name: 'Risk as stock and flow', family: 'systems', tier: 'bedrock' },
  { id: 'mm-systems-requisite-variety', name: 'Requisite variety', family: 'systems', tier: 'bedrock' },
  { id: 'mm-systems-leverage-points', name: 'Leverage points', family: 'systems', tier: 'bedrock' },
  { id: 'mm-systems-layered-defenses', name: 'Layered defenses with holes', family: 'systems', tier: 'bedrock' },
  { id: 'mm-systems-safety-two', name: 'Safety from what goes right', family: 'systems', tier: 'proven' },
  { id: 'mm-systems-decision-loop', name: 'The decision loop', family: 'systems', tier: 'bedrock' },
  { id: 'mm-systems-loop-design', name: 'Feedback loop design', family: 'systems', tier: 'proven' },
  { id: 'mm-systems-coupling-and-complexity', name: 'Coupling and complexity', family: 'systems', tier: 'bedrock' },
];

export const CATALOG_IDS = new Set(CATALOG.map(m => m.id));
