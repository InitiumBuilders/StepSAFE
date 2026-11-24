/* StepSAFE :: The Praxis — award hooks.

   The 99 awards in awards.ts are behavioural milestones, not Step-specific ones.
   They are earned by how a learner moves through the journey — consistency,
   thresholds crossed, judgment held under pressure — rather than by opening a
   particular Step. This file binds every one of them to an engine event.

   Every award id in awards.ts appears exactly once below. Nothing is invented here.

   Where an award criteria describes something the engine genuinely cannot observe
   (a refusal that cost the learner something, a call made against their own
   interest, a systemic catch nobody instrumented for), the hook lands on a late,
   high threshold and says so in a comment above the entry. The threshold is a
   proxy for standing earned, not a claim that the engine verified the act. */

export interface Hook {
  trigger: string;
  threshold?: number;
  awards: string[];
}

export const HOOKS: Hook[] = [
  /* ---------- The Systems shelf, and the days the watch was kept ---------- */
  { trigger: "systems-shelf", threshold: 1, awards: ["small-systems-shelf"] },
  { trigger: "watches-kept", threshold: 1, awards: ["small-watch-kept"] },
  { trigger: "watches-kept", threshold: 7, awards: ["strong-seven-watches"] },

  /* ---------- StudyMode: measured from the study record ---------- */
  { trigger: "cards-held", threshold: 1, awards: ["small-study-first-held"] },
  { trigger: "cards-held", threshold: 10, awards: ["strong-study-ten-held"] },
  { trigger: "cards-held", threshold: 50, awards: ["strong-study-fifty-held"] },
  { trigger: "own-words", threshold: 1, awards: ["small-study-own-words"] },
  { trigger: "fud-cleared", threshold: 1, awards: ["strong-study-fud-cleared"] },
  { trigger: "study-kinds", threshold: 8, awards: ["strong-study-every-kind"] },
  { trigger: "unitia", threshold: 1, awards: ["small-study-first-unitia"] },
  { trigger: "unitia", threshold: 100, awards: ["strong-study-hundred-unitia"] },
  { trigger: "exams-taken", threshold: 1, awards: ["small-study-first-test"] },
  { trigger: "exam-perfect", threshold: 1, awards: ["strong-study-perfect-test"] },

  /* ---------- First contact: the single events that only fire once ---------- */

  {
    trigger: "first-step",
    awards: ["small-first-light"]
  },
  /* A Page is a whole scope closed out — the same shape as an inventory that
     leaves nothing unclaimed. */
  {
    trigger: "first-page",
    awards: ["small-asset-inventory"]
  },
  /* Reading one framework all the way through is structurally the same act as
     finishing a Chapter instead of skimming its summary. */
  {
    trigger: "first-chapter",
    awards: ["small-first-policy-read"]
  },
  {
    trigger: "first-sim",
    awards: ["small-first-page"]
  },
  {
    trigger: "first-guide",
    awards: ["small-first-runbook"]
  },
  {
    trigger: "first-project",
    awards: ["small-first-diagram"]
  },
  /* Both graph primitives land on the same moment: the atom is the addressable
     claim, the signal is the stake that makes it cost something. */
  {
    trigger: "first-attestation",
    awards: ["small-first-atom", "small-first-signal"]
  },
  {
    trigger: "wallet-linked",
    awards: ["small-first-cold-storage"]
  },
  /* "Broke It on Testnet" is earned in the reentrancy lab (ch-chain-reentrancy-lab), where the learner writes the
     exploit against their own vulnerable contract. Choosing Motus mode grants no award. */
  /* Seva becoming able to carry the material without the learner in the room is
     the same proof of transfer the award asks for. */
  {
    trigger: "sevas-emergence",
    awards: ["strong-taught-it-forward"]
  },

  /* ---------- steps-total: breadth of ground actually covered ---------- */

  {
    trigger: "steps-total",
    threshold: 5,
    awards: ["small-first-abuse-case"]
  },
  {
    trigger: "steps-total",
    threshold: 10,
    awards: ["small-first-log"]
  },
  {
    trigger: "steps-total",
    threshold: 25,
    awards: ["small-first-repro"]
  },
  {
    trigger: "steps-total",
    threshold: 50,
    awards: ["small-first-detection", "strong-telemetry-recovered"]
  },
  {
    trigger: "steps-total",
    threshold: 100,
    awards: ["strong-hunt-that-found-something", "strong-class-eliminated"]
  },
  {
    trigger: "steps-total",
    threshold: 150,
    awards: ["strong-slsa-l3", "strong-artifact-diffed", "strong-crypto-review-passed"]
  },
  /* Designed failure modes and blast-radius reduction are architectural
     judgments made across a whole surface. Near-complete coverage of the
     curriculum is the closest observable standing. */
  {
    trigger: "steps-total",
    threshold: 250,
    awards: ["safe-fails-safe", "safe-blast-radius-shrunk"]
  },
  /* The two hardest awards in the set. Catching a structural risk nobody
     instrumented for, and delivering an unwelcome assessment upward in writing,
     are both unobservable to the engine. They sit at full completion because
     nothing short of the whole journey is an honest proxy for them. */
  {
    trigger: "steps-total",
    threshold: 352,
    awards: ["safe-systemic-catch", "safe-truth-to-power"]
  },

  /* ---------- pages-total: credentialed competencies closed out ---------- */

  {
    trigger: "pages-total",
    threshold: 1,
    awards: ["small-key-hygiene"]
  },
  {
    trigger: "pages-total",
    threshold: 3,
    awards: ["small-first-false-positive", "small-first-timeline"]
  },
  {
    trigger: "pages-total",
    threshold: 5,
    awards: ["small-first-provenance", "small-dependency-depth"]
  },
  {
    trigger: "pages-total",
    threshold: 10,
    awards: ["strong-phishing-resistant-rollout", "strong-helpdesk-hardened"]
  },
  {
    trigger: "pages-total",
    threshold: 20,
    awards: ["strong-joiner-mover-leaver", "strong-zero-trust-slice"]
  },
  {
    trigger: "pages-total",
    threshold: 30,
    awards: ["strong-detection-shipped", "strong-coverage-mapped"]
  },
  /* Collecting less, and staffing a real safe harbour, are both choices to give
     up something available and permitted. The engine sees only the depth of
     credentialed work behind the person making them. */
  {
    trigger: "pages-total",
    threshold: 45,
    awards: ["safe-privacy-held", "safe-safe-harbor-built"]
  },
  /* Retiring a control that produces audit evidence and no safety, and declining
     a trade that improves your metric with someone else's risk, are refusals the
     engine cannot witness. Placed at near-total credential coverage. */
  {
    trigger: "pages-total",
    threshold: 60,
    awards: ["safe-no-theater", "safe-refused-the-tradeoff"]
  },

  /* ---------- chapters-total: sustained arcs finished ---------- */

  {
    trigger: "chapters-total",
    threshold: 1,
    awards: ["small-first-tabletop"]
  },
  {
    trigger: "chapters-total",
    threshold: 2,
    awards: ["small-first-prompt-injection"]
  },
  {
    trigger: "chapters-total",
    threshold: 3,
    awards: ["strong-postmortem-that-changed-something", "strong-fair-analysis"]
  },
  /* Designing a key hierarchy that survives adversarial review is not something
     the engine can observe. It lands here because by four locked chapters the
     learner has completed the custody arc and been through the key-ceremony
     material — the threshold stands in for the standing earned, not for a
     verified design. */
  {
    trigger: "chapters-total",
    threshold: 4,
    awards: ["strong-kms-designed"]
  },
  {
    trigger: "chapters-total",
    threshold: 6,
    awards: ["strong-board-brief", "strong-third-party-program"]
  },
  {
    trigger: "chapters-total",
    threshold: 9,
    awards: ["strong-data-boundary", "strong-permanence-designed"]
  },
  /* Choosing the person over the dashboard, and countering a live sybil or
     collusion attack on a reputation graph, are both events the engine has no
     sensor for. They land on full chapter completion. */
  {
    trigger: "chapters-total",
    threshold: 12,
    awards: ["safe-people-over-metrics", "safe-graph-integrity"]
  },

  /* ---------- sims-total: hours spent inside a live scenario ---------- */

  {
    trigger: "sims-total",
    threshold: 1,
    awards: ["small-first-key-ceremony-witness"]
  },
  {
    trigger: "sims-total",
    threshold: 3,
    awards: ["strong-purple-team-run"]
  },
  {
    trigger: "sims-total",
    threshold: 6,
    awards: ["strong-forensics-preserved"]
  },
  {
    trigger: "sims-total",
    threshold: 10,
    awards: ["strong-restore-proven"]
  },
  {
    trigger: "sims-total",
    threshold: 14,
    awards: ["safe-breach-notified-well"]
  },

  /* ---------- guides-total: the reading and reference practice ---------- */

  {
    trigger: "guides-total",
    threshold: 1,
    awards: ["small-first-model-card"]
  },
  {
    trigger: "guides-total",
    threshold: 5,
    awards: ["small-first-sbom", "small-first-permaweb"]
  },
  {
    trigger: "guides-total",
    threshold: 10,
    awards: ["strong-regulatory-map"]
  },
  {
    trigger: "guides-total",
    threshold: 25,
    awards: ["strong-dependency-triage"]
  },
  /* Coordinated disclosure done proportionately is a discipline built out of the
     process literature — ISO 29147, CERT/CC timing, Project Zero policy. Full
     command of the guide library is the nearest honest proxy. */
  {
    trigger: "guides-total",
    threshold: 51,
    awards: ["safe-responsible-disclosure"]
  },

  /* ---------- projects-complete: evidence attached to the Praxis Profile ---------- */

  {
    trigger: "projects-complete",
    threshold: 1,
    awards: ["small-first-content-address"]
  },
  {
    trigger: "projects-complete",
    threshold: 3,
    awards: ["strong-threat-model-shipped"]
  },
  {
    trigger: "projects-complete",
    threshold: 5,
    awards: ["strong-appsec-page"]
  },
  {
    trigger: "projects-complete",
    threshold: 10,
    awards: ["safe-kill-switch-tested"]
  },

  /* ---------- drills-perfect: the best option chosen under pressure ---------- */

  {
    trigger: "drills-perfect",
    threshold: 1,
    awards: ["small-epss-first-read"]
  },
  {
    trigger: "drills-perfect",
    threshold: 5,
    awards: ["small-first-clear-sign"]
  },
  {
    trigger: "drills-perfect",
    threshold: 10,
    awards: ["strong-comms-under-fire"]
  },
  {
    trigger: "drills-perfect",
    threshold: 25,
    awards: ["strong-materiality-call"]
  },
  /* Taking the position that is correct and personally expensive is the single
     least observable criteria in the set. Fifty consecutive best-option calls is
     the only evidence the engine can offer that the habit is real. */
  {
    trigger: "drills-perfect",
    threshold: 50,
    awards: ["safe-harder-right"]
  },

  /* ---------- drill-recovered: a failed decision later answered correctly ---------- */

  {
    trigger: "drill-recovered",
    threshold: 1,
    awards: ["small-second-question"]
  },
  {
    trigger: "drill-recovered",
    threshold: 5,
    awards: ["small-honest-error"]
  },
  {
    trigger: "drill-recovered",
    threshold: 15,
    awards: ["strong-assumption-breaker"]
  },

  /* ---------- reviews-cleared: scored repetition, which is what calibration is ---------- */

  {
    trigger: "reviews-cleared",
    threshold: 5,
    awards: ["small-first-estimate"]
  },
  {
    trigger: "reviews-cleared",
    threshold: 20,
    awards: ["small-loss-not-likert"]
  },
  {
    trigger: "reviews-cleared",
    threshold: 50,
    awards: ["strong-calibrated-forecaster"]
  },

  /* ---------- streak-days: the unglamorous cadence ---------- */

  {
    trigger: "streak-days",
    threshold: 3,
    awards: ["small-patch-clock"]
  },
  {
    trigger: "streak-days",
    threshold: 7,
    awards: ["small-password-autopsy"]
  },
  {
    trigger: "streak-days",
    threshold: 14,
    awards: ["strong-alert-debt-paid"]
  },
  /* Sustained support of an under-resourced dependency is measured in months of
     showing up, not in a single contribution. The longest streak is the closest
     shape the engine has. */
  {
    trigger: "streak-days",
    threshold: 30,
    awards: ["safe-commons-defended"]
  },

  /* ---------- unit-size: quorum, witnesses, and people who can replace you ---------- */

  {
    trigger: "unit-size",
    threshold: 2,
    awards: ["small-first-log"]
  },
  {
    trigger: "unit-size",
    threshold: 4,
    awards: ["strong-ceremony-run"]
  },
  {
    trigger: "unit-size",
    threshold: 8,
    awards: ["strong-recovery-proven"]
  },
  /* Refusing a unilateral privileged path requires a quorum that actually
     exists. A large UNIT is the structural precondition, not proof of the
     refusal itself. */
  {
    trigger: "unit-size",
    threshold: 12,
    awards: ["safe-quorum-defended"]
  },
  {
    trigger: "unit-size",
    threshold: 16,
    awards: ["safe-succession-built"]
  },

  /* ---------- sim-flawless: every decision in a scenario taken at its best ---------- */

  {
    trigger: "sim-flawless",
    threshold: 1,
    awards: ["strong-incident-commanded"]
  },
  /* Calling off your own response once the evidence stops supporting it is a
     decision that looks like weakness in the moment. Three flawless runs is the
     only standing the engine can require before granting it. */
  {
    trigger: "sim-flawless",
    threshold: 3,
    awards: ["safe-stood-down"]
  },

  /* ---------- act-complete: the structural milestones of the journey ---------- */

  {
    trigger: "act-complete",
    threshold: 1,
    awards: ["strong-attack-path-mapped"]
  },
  {
    trigger: "act-complete",
    threshold: 2,
    awards: ["strong-contract-audited", "strong-bridge-threat-model"]
  },
  {
    trigger: "act-complete",
    threshold: 3,
    awards: ["strong-signer-ux", "strong-untrusted-compute"]
  },
  {
    trigger: "act-complete",
    threshold: 4,
    awards: ["strong-ai-red-team", "strong-agent-boundary", "strong-weights-tiering"]
  },
  /* Publishing an honest decentralisation assessment and raising the level
     around irreversibly sensitive artifacts both cost real friction and both
     depend on authority the engine cannot see the learner holding. */
  {
    trigger: "act-complete",
    threshold: 5,
    awards: ["safe-decentralization-honest", "safe-model-weights-guarded"]
  },
  /* The final two refusals: authority withheld from an autonomous system, and a
     release held on evidence rather than schedule. Both are pre-commitments made
     before the result is known, which is precisely what no counter can observe.
     They close the journey. */
  {
    trigger: "act-complete",
    threshold: 6,
    awards: ["safe-agent-leashed", "safe-eval-before-ship"]
  }
];
