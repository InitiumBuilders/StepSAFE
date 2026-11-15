/* THE SPINE. The sixty pages of the twelve core chapters, each read for the NIST CSF 2.0 function it teaches first,
   and a second where it teaches two. Read on 2026-11-05 from each page's summary and its steps, not by matching
   words. With the CSF categories of the sixty check statements, it shows where the corpus is deep and where it is
   thin. probe-check.mts prints the table and lists the thin functions for August; this pass does not fill them. */

import { CSF_FUNCTIONS } from './csf';

export type CsfFn = 'GV' | 'ID' | 'PR' | 'DE' | 'RS' | 'RC';
export const FN_ORDER: CsfFn[] = ['GV', 'ID', 'PR', 'DE', 'RS', 'RC'];
export const fnName = (f: CsfFn) => CSF_FUNCTIONS[f];

/* The StepGuides, each read on 2026-11-08 from its title, statement and summary for the function it teaches first. */
export const GUIDE_SPINE: Record<string, CsfFn> = {
  'sg-threat-model-playbook': 'ID', 'sg-design-review-record': 'ID', 'sg-vuln-triage-model': 'ID',
  'sg-fair-quantification-model': 'GV', 'sg-post-incident-review-template': 'ID', 'sg-passkey-rollout-playbook': 'PR',
  'sg-key-hierarchy-model': 'PR', 'sg-secrets-incident-playbook': 'RS', 'sg-pqc-migration-field-note': 'PR',
  'sg-identity-attack-drillbook': 'PR', 'sg-detection-as-code-playbook': 'DE', 'sg-attack-coverage-model': 'DE',
  'sg-hunt-design-drillbook': 'DE', 'sg-logging-decisions-field-note': 'DE', 'sg-detection-reading-path': 'DE',
  'sg-read-the-systems-map': 'GV', 'sg-incident-command-first-60': 'RS', 'sg-ransomware-decision': 'RS',
  'sg-third-party-breach-response': 'RS', 'sg-tabletop-design': 'ID', 'sg-first-90-days': 'GV', 'sg-saying-no': 'GV',
  'sg-post-incident-review': 'ID', 'sg-risk-acceptance-memo': 'GV', 'sg-board-three-slide': 'GV',
  'sg-crisis-comms-statements': 'RS', 'sg-notification-clocks': 'RS', 'sg-ir-readiness-audit': 'ID',
  'sg-materiality-8k': 'GV', 'sg-fair-quantification': 'GV', 'sg-metrics-tree': 'GV', 'sg-security-org-design': 'GV',
  'sg-budget-defense': 'GV', 'sg-hiring-signal': 'GV', 'sg-leadership-reading-path': 'GV', 'sg-calibrated-estimation': 'ID',
  'sg-smart-contract-audit-playbook': 'ID', 'sg-safe-signer-operations': 'PR', 'sg-blind-signing-field-note': 'PR',
  'sg-treasury-key-ceremony': 'PR', 'sg-dao-governance-attack-model': 'ID', 'sg-onchain-incident-response': 'RS',
  'sg-permanence-decision-model': 'PR', 'sg-crypto-shredding-field-note': 'PR', 'sg-decentralized-compute-sandboxing': 'PR',
  'sg-llm-threat-model-template': 'ID', 'sg-lethal-trifecta-checklist': 'PR', 'sg-prompt-injection-field-note': 'PR',
  'sg-model-weights-custody-model': 'PR', 'sg-ai-red-team-program': 'ID', 'sg-ai-governance-record-template': 'GV',
  'sg-twelve-places-to-act': 'GV', 'sg-delays-acting-before-you-see': 'DE', 'sg-breakers-designing-the-cut': 'PR',
  'sg-working-a-wicked-problem': 'GV', 'sg-the-model-written-down': 'GV',
  /* the Launch shelf, written 2026-11-08 */
  'sg-domain-defense': 'PR', 'sg-verify-new-people': 'PR', 'sg-never-ask-line': 'PR', 'sg-coming-back': 'RC',
};

export const SPINE: Record<string, { fn: CsfFn; also?: CsfFn }> = {
  /* Ground: the system, its variety, threat models, the adversary, consequence */
  'ch-foundations-p1-systems': { fn: 'GV' },
  'ch-foundations-p2-variety': { fn: 'GV', also: 'ID' },
  'ch-foundations-p3-threatmodel': { fn: 'ID' },
  'ch-foundations-p4-adversary': { fn: 'ID', also: 'DE' },
  'ch-foundations-p5-calibration': { fn: 'ID', also: 'GV' },
  /* The Keeper: authentication, authorization, zero trust, cryptography, custody */
  'ch-identity-p1': { fn: 'PR' },
  'ch-identity-p2': { fn: 'PR' },
  'ch-identity-p3': { fn: 'PR' },
  'ch-identity-p4': { fn: 'PR' },
  'ch-identity-p5': { fn: 'PR', also: 'RS' },
  /* The Lantern: detection as a product, telemetry, coverage, hunting, the SOC */
  'ch-detection-page-product': { fn: 'DE' },
  'ch-detection-page-telemetry': { fn: 'DE', also: 'PR' },
  'ch-detection-page-coverage': { fn: 'DE' },
  'ch-detection-page-hunt': { fn: 'DE' },
  'ch-detection-page-room': { fn: 'DE', also: 'RS' },
  /* The Forge: defect classes, the paved road, testing, the supply chain, triage */
  'ch-appsec-pg-origins': { fn: 'PR' },
  'ch-appsec-pg-paved-road': { fn: 'PR' },
  'ch-appsec-pg-proof': { fn: 'PR', also: 'ID' },
  'ch-appsec-pg-chain': { fn: 'PR', also: 'GV' },
  'ch-appsec-pg-triage': { fn: 'ID' },
  /* The hour the building burns: command, the cut, extortion, the clock, after */
  'ch-incident-page-command': { fn: 'RS' },
  'ch-incident-page-containment': { fn: 'RS' },
  'ch-incident-page-extortion': { fn: 'RS', also: 'RC' },
  'ch-incident-page-clock': { fn: 'RS' },
  'ch-incident-page-after': { fn: 'RC', also: 'ID' },
  /* The ledger of consequence: quantification, frameworks, privacy, regulation, third parties */
  'ch-grc-p1': { fn: 'GV', also: 'ID' },
  'ch-grc-p2': { fn: 'GV' },
  'ch-grc-p3': { fn: 'PR', also: 'GV' },
  'ch-grc-p4': { fn: 'GV' },
  'ch-grc-p5': { fn: 'GV' },
  /* The chain does not forgive: losses, contracts, audits, custody, the war room */
  'pg-chain-losses': { fn: 'ID' },
  'pg-chain-contracts': { fn: 'PR' },
  'pg-chain-audit': { fn: 'ID', also: 'PR' },
  'pg-chain-custody': { fn: 'PR' },
  'pg-chain-governance': { fn: 'RS', also: 'GV' },
  /* The permanent record: permanence, content addressing, compute, erasure, the substrate */
  'ch-decinfra-p1-permanence': { fn: 'PR', also: 'ID' },
  'ch-decinfra-p2-cas': { fn: 'PR' },
  'ch-decinfra-p3-compute': { fn: 'PR' },
  'ch-decinfra-p4-erasure': { fn: 'PR', also: 'GV' },
  'ch-decinfra-p5-substrate': { fn: 'ID', also: 'DE' },
  /* The oracle problem: the weights, attacks on the model, agents, defending with AI, governance */
  'ch-ai-p1-weights': { fn: 'PR' },
  'ch-ai-p2-attack': { fn: 'ID' },
  'ch-ai-p3-agentic': { fn: 'PR' },
  'ch-ai-p4-defense': { fn: 'DE' },
  'ch-ai-p5-governance': { fn: 'GV' },
  /* The chair: the job, the board, the portfolio, the organisation, standing */
  'ch-ciso-p-chair': { fn: 'GV' },
  'ch-ciso-p-board': { fn: 'GV' },
  'ch-ciso-p-portfolio': { fn: 'GV' },
  'ch-ciso-p-org': { fn: 'GV' },
  'ch-ciso-p-standing': { fn: 'GV' },
  /* The honest graph: primitives, attacks, the economics of corruption, the validator session, the commons */
  'ch-intuition-p1': { fn: 'ID' },
  'ch-intuition-p2': { fn: 'ID' },
  'ch-intuition-p3': { fn: 'ID', also: 'GV' },
  'ch-intuition-p4': { fn: 'DE', also: 'PR' },
  'ch-intuition-p5': { fn: 'RS', also: 'GV' },
  /* Dash EVO operator: the machine, identity on Platform, the evonode, governance, the doctrine */
  'ch-dashevo-p1-machine': { fn: 'ID' },
  'ch-dashevo-p2-identity': { fn: 'PR' },
  'ch-dashevo-p3-evonode': { fn: 'PR', also: 'RS' },
  'ch-dashevo-p4-governance': { fn: 'GV' },
  'ch-dashevo-p5-doctrine': { fn: 'GV' },
};
