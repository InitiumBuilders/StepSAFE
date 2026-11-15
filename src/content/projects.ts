import type { ProjectTemplate } from "./schema";

/* STEPSAFE :: THE PRAXIS — Praxis Project templates.
   A Praxis Project is a real artifact built, broken, defended, or documented in the world.
   Every one of these is doable by one motivated person with a laptop and free-tier accounts.
   The rubric is where the teaching lives: strong and weak are written to be discriminating,
   not encouraging. If a learner cannot tell which column they are in, the rubric has failed. */

export const PROJECTS: ProjectTemplate[] = [
  {
    id: "px-detection-lab-five",
    title: "The Five Detections",
    domain: "Detection Engineering",
    statement: "A detection you have not tried to evade is a hypothesis, not a control.",
    difficulty: 3,
    weeks: 4,
    brief:
      "Stand up a detection lab you own end to end — a Windows VM with Sysmon and a Linux VM with auditd or eBPF telemetry, shipping into a free-tier SIEM — and author five detections that survive contact with an adversary. The point is not five rules. The point is the discipline around them: each detection begins as a written hypothesis about attacker behaviour, is validated with an Atomic Red Team test that actually fires it, is measured for false positives against a week of your own normal activity, and is then deliberately evaded by you so you can document exactly how brittle it is. SigmaHQ publishes over three thousand community rules and Atomic Red Team publishes over a thousand tests; the gap between importing those and understanding them is this project. Most junior detection work dies on false positives nobody budgeted for, so you will budget for them up front and hold yourself to the number.",
    deliverables: [
      "A reproducible lab build — infrastructure-as-code or a documented VM build script — that a stranger can stand up in under an hour",
      "Five detections in Sigma format, each with a written hypothesis, data source, logic, and known-evasion section",
      "An Atomic Red Team validation run per detection with the exact test ID, command executed, and the resulting log evidence",
      "A false-positive baseline: seven days of normal-use telemetry with per-rule FP counts and a stated FP budget per rule per week",
      "An evasion log — for each detection, at least one working bypass you found yourself, and what telemetry would have caught it",
      "A MITRE ATT&CK Navigator layer showing what you cover, what you partially cover, and the honest blank space",
    ],
    evidence: [
      "Public repository containing the lab build, the five Sigma rules, and the Navigator layer JSON",
      "Screen recording or terminal transcript of one atomic test firing its detection in the SIEM, timestamps visible",
      "The false-positive table with raw counts, not adjectives",
      "A one-page write-up of the single most instructive evasion you found and why the original logic was fragile",
    ],
    rubric: [
      {
        dimension: "Hypothesis quality",
        strong:
          "Each detection names a specific attacker behaviour and the invariant it depends on — the thing the attacker cannot easily change without giving up the objective. The rule targets that invariant, not a command line string an adversary can rename in five seconds.",
        weak:
          "Rules key on process names, filenames, or literal argument strings pulled from a blog post. The learner cannot articulate what an attacker would have to sacrifice to evade the rule, because the answer is nothing.",
      },
      {
        dimension: "Validation honesty",
        strong:
          "Every rule has a green test and a red test: proof it fires on the technique and proof it stays silent on the nearest benign lookalike. Failed validations are kept in the record with what was learned.",
        weak:
          "Validation means the rule existed and the SIEM did not error. No negative test. Atomic test IDs cited but never actually executed, or executed with the detection already tuned to the exact test artefact.",
      },
      {
        dimension: "Coverage integrity",
        strong:
          "The Navigator layer is conservative and the blank space is larger than the covered space. Partial coverage is marked partial with a note on what is missing. The learner can explain why a technique is covered for one procedure and not another.",
        weak:
          "Techniques marked fully covered on the strength of one rule and one procedure. The heatmap is a marketing object. Coverage claims for data sources the lab does not collect.",
      },
      {
        dimension: "Operational cost",
        strong:
          "An FP budget is stated before tuning and defended after. The learner knows the cost per alert in analyst minutes and has retired or demoted a rule that could not earn its keep.",
        weak:
          "No FP measurement, or measurement taken on an idle machine. Every rule is high severity. Nothing was ever retired, so nothing was ever really evaluated.",
      },
    ],
    awards: ["strong-detection-author", "safe-coverage-honest", "strong-evasion-eye"],
    mode: "both",
  },
  {
    id: "px-threat-model-oss",
    title: "Threat Model in the Open",
    domain: "Threat Modeling",
    statement: "A threat model that never leaves your laptop is a diary entry.",
    difficulty: 3,
    weeks: 3,
    brief:
      "Pick a real open-source project with real users — a self-hosted app, a CLI that handles credentials, a small protocol implementation — and threat model it properly, then file what you find upstream where maintainers can act on it. The Threat Modeling Manifesto's four questions structure the work: what are we working on, what can go wrong, what are we going to do about it, did we do a good enough job. The manifesto also names the anti-patterns you will be graded against — the Hero Threat Modeler working alone, Admiration for the Problem where analysis never converts to action, Tendency to Overfocus on one component, and Perfect Representation where the diagram never ships because it is never complete. The hard skill here is not finding problems. It is writing them up so a volunteer maintainer with limited time can triage, argue, and fix.",
    deliverables: [
      "A data flow diagram at a stated level of abstraction, with trust boundaries drawn and justified in prose",
      "An assumptions register — every security-relevant thing you assumed about the deployment, the users, and the environment",
      "A threat enumeration using a named method (STRIDE per element, attack trees, or kill-chain walk) with the method's blind spots stated",
      "A prioritised findings list with concrete attacker preconditions, not severity adjectives",
      "At least two findings filed upstream as issues or a private security report, following the project's own disclosure policy",
      "A short did-we-do-a-good-enough-job section: what you did not model and why",
    ],
    evidence: [
      "Link to the published threat model document, including the diagram source, not just an exported image",
      "Links to the filed upstream issues or a redacted copy of the private report, plus any maintainer response",
      "The assumptions register with at least one assumption you tested and found false",
      "A short reflection on which anti-pattern you fell into first and how you noticed",
    ],
    rubric: [
      {
        dimension: "Boundary reasoning",
        strong:
          "Trust boundaries are drawn where authority actually changes hands, and the learner can name the mechanism enforcing each one. Where a boundary is nominal rather than enforced, that is called out as a finding in itself.",
        weak:
          "Boundaries drawn around visual groupings — a box per container, a box per repo — with no statement of what enforces them. The network diagram has been relabelled a threat model.",
      },
      {
        dimension: "Finding actionability",
        strong:
          "Each finding states the attacker's starting position, the specific step that fails, and what a fix would need to make true. A maintainer can disagree on a concrete point rather than on vibes.",
        weak:
          "Findings phrased as missing best practices or absent controls. No attacker precondition, so maintainers cannot judge whether it matters in their deployment and reasonably ignore it.",
      },
      {
        dimension: "Engagement with maintainers",
        strong:
          "Disclosure followed the project's stated channel, tone was collaborative, and the learner engaged with pushback on the technical merits — including conceding where the maintainer was right.",
        weak:
          "Findings dumped as public issues on a project with a private security policy, or written in a tone that treats volunteers as negligent. No follow-through after filing.",
      },
      {
        dimension: "Scope discipline",
        strong:
          "The model covers the whole system at a coarse level before going deep anywhere, and the depth chosen is justified by where authority concentrates. Out-of-scope areas are listed explicitly.",
        weak:
          "Eleven pages on the login form, nothing on the update mechanism or the build. Or endless breadth with no finding that would change anyone's behaviour.",
      },
    ],
    awards: ["strong-model-in-public", "safe-disclosure-conduct"],
    mode: "novus",
  },
  {
    id: "px-slsa-l3-pipeline",
    title: "Provenance You Can Prove",
    domain: "Supply Chain Security",
    statement: "If a consumer cannot verify the build offline, you have shipped a claim, not provenance.",
    difficulty: 4,
    weeks: 3,
    brief:
      "Take a real project you maintain and drive its release pipeline to SLSA Build Level 3, then prove it by verification rather than assertion. SLSA Build L3 adds two hard requirements on top of a hosted build platform: the platform must prevent build runs from influencing one another even within the same project, and it must prevent the secret material used to sign provenance from being reachable by user-defined build steps. That second requirement is the one that kills most homegrown attempts, because the obvious implementation puts a signing key in a workflow secret where any step, action, or transitive dependency can read it. You will use a builder that generates and signs provenance outside your control — GitHub Artifact Attestations or the SLSA GitHub generator — and then verify the resulting attestation from a clean machine, as a consumer would. Verizon's 2025 DBIR put third-party involvement in breaches at thirty percent, doubled from fifteen the year before; this is the control that makes that number tractable for your consumers.",
    deliverables: [
      "A release workflow that produces signed provenance for every published artifact, with the signing step outside user-controlled build code",
      "A written analysis of how your pipeline satisfies the two L3 controls — run isolation and signing-material inaccessibility — and where it depends on the platform's guarantees",
      "A verification script a downstream consumer can run, checking the artifact digest, the source repository, and the workflow identity",
      "A negative test: a deliberately tampered artifact or mismatched provenance that your verification correctly rejects, with the failure output captured",
      "A dependency and action pinning pass — all third-party actions pinned to full commit SHAs, with a documented update process",
      "A short threat note on what L3 does not protect against, specifically source integrity and the trustworthiness of your own build inputs",
    ],
    evidence: [
      "Public repository with the workflow file and a released artifact carrying verifiable provenance",
      "Terminal transcript of successful verification on a machine that never touched the build",
      "Terminal transcript of the negative test failing closed, with the exact error",
      "The written L3 control analysis, including the honest list of guarantees you inherited rather than built",
    ],
    rubric: [
      {
        dimension: "Understanding of the trust root",
        strong:
          "The learner can trace exactly whose key signs the provenance, who controls that key, and what an attacker would need to compromise to forge an attestation. Inherited platform guarantees are named as inherited.",
        weak:
          "Provenance is generated because a marketplace action was added. The learner cannot say who signs, and would accept a self-signed attestation produced by the same job that built the artifact.",
      },
      {
        dimension: "Verification rigour",
        strong:
          "Verification is performed as an outsider, checks the source repository and workflow identity — not merely that a signature parses — and fails closed on the tampered case with a clear error.",
        weak:
          "Verification runs inside the same workflow that produced the artifact, or checks only that a signature exists. The negative test was never attempted, or was attempted and quietly passed.",
      },
      {
        dimension: "Attack surface reduction",
        strong:
          "Actions pinned to immutable digests, workflow token permissions minimised to the specific scopes needed, pull-request triggers that could execute untrusted code kept away from the release path.",
        weak:
          "Actions referenced by mutable tags, write-all token permissions, and a release path reachable from a fork's pull request. The pipeline is attested and still trivially poisonable.",
      },
      {
        dimension: "Honest boundary statement",
        strong:
          "The write-up states plainly that build provenance says nothing about whether the source was good, and identifies the next control that would address it.",
        weak:
          "The project is described as supply-chain secure. Level is treated as a score rather than a specific, narrow claim about how the artifact was produced.",
      },
    ],
    awards: ["strong-provenance-builder", "safe-verify-as-outsider"],
    mode: "both",
  },
  {
    id: "px-key-ceremony",
    title: "The Ceremony",
    domain: "Key Custody",
    statement: "Ceremony is not theatre — it is how you make a private key's history auditable by strangers.",
    difficulty: 4,
    weeks: 2,
    brief:
      "Generate a root signing key in a witnessed, scripted, recorded ceremony, and produce documentation good enough that someone who was not in the room can audit what happened. Model the practice on the DNSSEC root KSK ceremonies, which are scripted line by line, video recorded, witnessed by external participants, and published afterward — because the whole value of the key rests on strangers being able to check the story. Your scale is smaller: an offline signing key for a package repository, a container registry, a TUF root, or a personal certificate authority. Split the key or its recovery material across holders with a threshold, so no single person and no single failure destroys or steals it. The graded skill is not key generation. It is designing a procedure that resists both the compromised operator and the honest operator having a bad day, and then writing it so it survives your absence.",
    deliverables: [
      "A ceremony script written before the ceremony: numbered steps, expected output at each step, named roles, and stop conditions",
      "A hardware and entropy plan stating where the key material is generated, why that source is trusted, and what never touches a networked machine",
      "A threshold recovery design — how many shares, held by whom, stored where, and the exact quorum needed to reconstitute or rotate",
      "A recorded and witnessed execution of the script, with deviations logged at the moment they happened",
      "A signed ceremony transcript including hashes of all produced artifacts and the public key fingerprint",
      "A rotation and revocation runbook, including the compromise case, with a stated target time to revoke",
      "A tested recovery drill: reconstitute or verify quorum access with at least one holder deliberately unavailable",
    ],
    evidence: [
      "The pre-written ceremony script, timestamped before execution",
      "The signed transcript with artifact hashes and witness signatures or attestations",
      "Recording or contemporaneous photographs of the ceremony, with sensitive material framed out",
      "A written account of the recovery drill including what went wrong, because something will",
      "The published public key or root metadata that third parties can now verify against",
    ],
    rubric: [
      {
        dimension: "Procedure before execution",
        strong:
          "The script existed in full before the key existed, deviations were logged live rather than reconstructed, and stop conditions were defined so a participant knew when to halt the ceremony.",
        weak:
          "Documentation written afterward from memory. No stop conditions, so the only possible outcome was success. Deviations either not recorded or smoothed out in the write-up.",
      },
      {
        dimension: "Threshold design",
        strong:
          "Quorum and share count are justified against two named failure modes — one coercion or compromise scenario, one loss or unavailability scenario — and the geographic or organisational separation of holders reflects that reasoning.",
        weak:
          "A threshold chosen because the tool defaulted to it. All shares in one house, one safe, or one cloud account, which converts a threshold scheme back into a single key with extra steps.",
      },
      {
        dimension: "Auditability by a stranger",
        strong:
          "An outsider can follow the transcript, check the published hashes and fingerprint, and identify the moment the key came into existence and every artifact it touched.",
        weak:
          "The record proves only that a ceremony happened. No hashes, no fingerprints, no way to bind the published key to the documented process.",
      },
      {
        dimension: "Lifecycle realism",
        strong:
          "Rotation and revocation are written as executable runbooks with named owners and a target time, and the recovery drill was actually run with a holder missing.",
        weak:
          "Rotation described as a future intention. No revocation path, meaning a compromise would be handled by improvisation during the worst week of the year.",
      },
    ],
    awards: ["strong-ceremony-master", "safe-quorum-designed", "safe-recovery-drilled"],
    mode: "both",
  },
  {
    id: "px-agent-vulnerable-toolchain",
    title: "Break Your Own Agent",
    domain: "AI and Agent Security",
    statement: "An agent's blast radius is the union of its tools, not the intent of its prompt.",
    difficulty: 4,
    weeks: 5,
    brief:
      "Build a working LLM agent with a deliberately vulnerable tool chain, exploit it yourself along at least four distinct paths, then rebuild it so those paths close without the agent becoming useless. The OWASP Top 10 for LLM Applications 2025 gives you the target set: LLM01 Prompt Injection, LLM05 Improper Output Handling, LLM06 Excessive Agency, and LLM02 Sensitive Information Disclosure are the four that matter most for tool-using agents. Your agent should read untrusted content — a web page, an inbox, a ticket queue, a repository issue — and hold at least one tool with real consequence, such as writing files, calling an external API, or spending a test-mode budget. The lesson that lands is that prompt-level defences degrade under pressure while architectural defences hold: the injected instruction still arrives, but the tool it wants is not reachable, or requires a human, or is scoped to something the attacker does not want.",
    deliverables: [
      "A working agent with a documented tool inventory, each tool annotated with its blast radius and reversibility",
      "Four or more working exploits with reproducible transcripts — at minimum one indirect injection from untrusted content and one excessive-agency chain",
      "A defended version with the mitigation for each exploit implemented and mapped to the specific OWASP LLM identifier",
      "An evaluation harness that replays every exploit against both versions and reports pass or fail, runnable by someone else",
      "A capability-scoping design note: which tools are gated by human confirmation, which are scoped by policy, which were removed entirely",
      "A utility measurement showing the defended agent still completes its legitimate task set, with the cost of defence stated",
    ],
    evidence: [
      "Public repository with both agent versions and the eval harness",
      "Transcripts of the four exploits, showing the injected content, the agent's reasoning, and the tool call it made",
      "Harness output table: exploits against undefended versus defended, plus the utility benchmark on both",
      "A written note on the mitigation that looked strongest and failed anyway, and why",
    ],
    rubric: [
      {
        dimension: "Attack authenticity",
        strong:
          "Exploits arrive through channels the agent is designed to consume, not typed by the operator into the chat box. At least one succeeds through content the agent had a legitimate reason to read.",
        weak:
          "All attacks are direct user prompts. The threat model implicitly assumes a hostile user rather than hostile data, which is the wrong assumption for almost every deployed agent.",
      },
      {
        dimension: "Defence architecture",
        strong:
          "Mitigations constrain what tools can do regardless of what the model believes — allowlists, scoped credentials, irreversibility gates, out-of-band confirmation for consequential actions. Prompt hardening is used, but never as the load-bearing control.",
        weak:
          "Defence is a longer system prompt telling the model to ignore instructions in documents. A single well-crafted input restores full capability, and the learner presents this as mitigated.",
      },
      {
        dimension: "Measurement",
        strong:
          "The harness is deterministic enough to be believed, reports both security and utility, and the learner reports at least one regression where a defence broke a legitimate workflow.",
        weak:
          "Evidence is a handful of screenshots of the agent refusing. No utility measurement, so no way to know whether the defended agent is secure or merely broken.",
      },
      {
        dimension: "Blast-radius reasoning",
        strong:
          "Each tool is classified by consequence and reversibility, and the design shows the learner reduced authority before adding filtering. Removal was considered a legitimate mitigation.",
        weak:
          "Tool inventory is a list of function names. Every tool retains full authority and the defence is entirely about detecting bad inputs before they reach it.",
      },
    ],
    awards: ["strong-agent-breaker", "safe-capability-scoped", "strong-eval-harness"],
    mode: "motus",
  },
  {
    id: "px-fair-board-memo",
    title: "One Risk, In Dollars",
    domain: "Risk Quantification",
    statement: "A risk you cannot express as a distribution of losses is an opinion wearing a colour.",
    difficulty: 3,
    weeks: 3,
    brief:
      "Take one real risk in a real system you have access to — your own product, a community project, a volunteer organisation's infrastructure — and quantify it using FAIR, then present it as a one-page board memo with a decision attached. FAIR decomposes risk into loss event frequency and loss magnitude, and the discipline it imposes is that every number must be a calibrated range with a stated rationale, not a point estimate pulled from confidence. You will run a Monte Carlo over your ranges, produce a loss exceedance curve, and then do the part most analysts skip: compare the annualised loss reduction of a specific control against its actual cost, and make a recommendation that a numerate executive could reject on the merits. The failure mode you are training against is the heat map, which converts real uncertainty into a coloured square and destroys the information a decision-maker needs.",
    deliverables: [
      "A scoped risk statement naming the asset, the threat actor community, the effect, and the specific loss event — narrow enough to be estimable",
      "Calibrated ranges for loss event frequency and for primary and secondary loss magnitude, each with its evidence and its confidence interval",
      "A Monte Carlo simulation with the code included, producing an annualised loss distribution and a loss exceedance curve",
      "A sensitivity analysis identifying which input, if better measured, would most narrow the output",
      "A one-page board memo: the decision requested, the number, the range, the assumption most likely to be wrong",
      "A control comparison: expected annualised loss reduction versus fully loaded cost for at least two candidate controls, including do nothing",
    ],
    evidence: [
      "The published memo, one page, readable by a non-technical director",
      "The simulation notebook or script with inputs, seeds, and outputs reproducible by a third party",
      "The calibration rationale document showing where each range came from and which are weakest",
      "A recording or written account of presenting it to a real audience, with the hardest question you were asked",
    ],
    rubric: [
      {
        dimension: "Scoping",
        strong:
          "The loss event is specific enough that frequency is actually estimable — a named asset, a named actor community, a named effect. The scope note says explicitly what related risks are excluded.",
        weak:
          "The risk is cyber attack or ransomware in general. Frequency estimates are meaningless because the event class is too broad to have a frequency.",
      },
      {
        dimension: "Calibration discipline",
        strong:
          "Ranges are wide where evidence is thin and narrow where it is not, each with a written rationale. The learner can name which number they would defend and which they would not.",
        weak:
          "Suspiciously tight ranges with no source, or ranges so wide they carry no information. Industry averages imported without asking whether this organisation resembles the average.",
      },
      {
        dimension: "Decision usefulness",
        strong:
          "The memo asks for one decision, states the tradeoff, and gives the board a legitimate basis to say no. Secondary losses — response cost, legal, reputation effects on revenue — are separated from primary.",
        weak:
          "The memo reports a number and asks for budget. No option was seriously offered other than the one the author wanted. Do nothing was never priced.",
      },
      {
        dimension: "Intellectual honesty",
        strong:
          "The sensitivity analysis is used to say what should be measured next, and the memo names the assumption whose failure would most change the recommendation.",
        weak:
          "Precision implied to two decimal places on inputs that were guesses. No statement of what would falsify the analysis.",
      },
    ],
    awards: ["strong-risk-quantified", "safe-calibrated-estimator", "strong-board-voice"],
    mode: "both",
  },
  {
    id: "px-intuition-validator-session",
    title: "Validator Session",
    domain: "Trust Graph",
    statement: "An attestation with nothing at stake is a rumour with better formatting.",
    difficulty: 3,
    weeks: 3,
    brief:
      "Choose a bounded region of a public knowledge graph — a set of open-source maintainers, a set of contracts, a set of security claims about specific packages — and run a validator session on it: verify each claim against primary sources, then publish signed attestations recording what you found, including the claims you could not verify. On Intuition, identities are atoms, claims are triples that connect a subject, a predicate, and an object, and belief is expressed as signal staked into a vault on a bonding curve, so agreement and disagreement both carry cost. That economic layer is the interesting part and also the trap: staking is not evidence, it is a wager, and a graph where the loudest capital wins is a graph that has recreated the problem it was built to solve. Your job is to make your methodology legible enough that someone can audit your attestations rather than merely trusting your balance.",
    deliverables: [
      "A scoped region definition: the atoms and predicate types in scope, and the rule for what belongs and what does not",
      "A written verification methodology stating, per predicate type, what counts as sufficient primary evidence",
      "At least twenty verified claims published as attestations, each linked to the primary source consulted and the date consulted",
      "An explicit disputed and unverifiable set — claims you examined and declined to affirm, with reasons",
      "A staking policy: how you sized signal, what you would stake against, and the conflict-of-interest disclosure for anything you are connected to",
      "A short analysis of the region's failure modes — where the curve rewards volume over accuracy, and where a well-funded actor could manufacture consensus",
    ],
    evidence: [
      "Transaction hashes or graph query results resolving to your published attestations",
      "The methodology document, versioned, with any mid-session revisions kept visible",
      "The disputed set, published rather than quietly dropped",
      "A written account of one claim you initially believed and then reversed on evidence, including the cost of reversing",
    ],
    rubric: [
      {
        dimension: "Evidence standard",
        strong:
          "Each predicate type has a stated evidence bar set before verification began, and the bar is met or the claim goes to the unverifiable set. Sources are primary and dated.",
        weak:
          "Verification means the claim looked plausible or was already popular in the graph. Secondary sources cited that themselves cite nothing.",
      },
      {
        dimension: "Handling of uncertainty",
        strong:
          "The unverifiable set is substantial and published. The learner distinguishes false from unverified, and stakes accordingly rather than treating absence of evidence as evidence.",
        weak:
          "Everything examined was affirmed. No negative or abstained positions, which means the methodology was never capable of producing one.",
      },
      {
        dimension: "Economic reasoning",
        strong:
          "Staking sizes reflect confidence and are explained. The learner analyses how the incentive structure could be gamed in this specific region and states what they would do about it as a protocol designer.",
        weak:
          "Stake sized by convenience or by what was affordable, with no relationship to confidence. The bonding curve is treated as a payment step rather than a mechanism with adversarial properties.",
      },
      {
        dimension: "Conflict disclosure",
        strong:
          "Every connection between the validator and the subjects — employment, holdings, friendship, prior contributions — is disclosed before the attestations, and contested claims involving those subjects are recused or flagged.",
        weak:
          "No disclosure. The validator attests to claims about projects they benefit from, and the graph cannot tell.",
      },
    ],
    awards: ["strong-validator-session", "safe-abstains-honestly", "strong-graph-economist"],
    mode: "motus",
  },
  {
    id: "px-incident-command-live",
    title: "Take the Con",
    domain: "Incident Command",
    statement: "The incident commander's job is not to solve the incident — it is to keep it solvable.",
    difficulty: 3,
    weeks: 3,
    brief:
      "Run a live functional incident exercise in your own lab where you play incident commander for a real intrusion that is actually happening on real infrastructure — a scripted attack chain executed against systems you control, unfolding in real time, with at least two other people in support roles. Not a tabletop where everyone discusses what they would do. A functional exercise where the logs are real, the containment actions actually break things, and the clock does not stop while you think. Command is a separable skill from analysis, and the failure most technically strong people exhibit is collapsing into the keyboard: the best investigator in the room becomes the commander and immediately stops commanding. You will run the incident, then run the after-action review, and the review is where the grade lives.",
    deliverables: [
      "An exercise design document: the attack chain, the injects, the systems in play, and the objectives being tested",
      "A live incident log with timestamps — decisions, who made them, what was known at the time, and what was assumed",
      "A written role assignment used during the exercise, with handover procedure for a commander who has to step away",
      "A communications artefact set produced under the clock: at least two status updates written for a non-technical audience",
      "An after-action review following a blameless structure, separating what happened from what should have happened",
      "A remediation list with owners and dates, and evidence that at least one item was actually completed",
    ],
    evidence: [
      "The raw incident log, unedited, including the decisions that turned out to be wrong",
      "The status updates as they were sent, with their timestamps",
      "The after-action review document with at least one systemic finding, not only individual mistakes",
      "A recording or participant statements from the other roles about how command felt from their side",
    ],
    rubric: [
      {
        dimension: "Command posture",
        strong:
          "The commander stayed out of the terminal, held the timeline, assigned rather than performed, and explicitly stated what was known versus assumed at each decision. Handover was practised, not theorised.",
        weak:
          "The commander did the investigation. Nobody else had a clear task. The log has a twenty-minute gap that corresponds exactly to the commander finding something interesting.",
      },
      {
        dimension: "Decision under incomplete information",
        strong:
          "Containment decisions were made on time with stated confidence and stated reversibility. The learner can point to a decision taken deliberately early and explain the tradeoff accepted.",
        weak:
          "Decisions deferred pending more data until the exercise ended, or taken instantly with no articulated basis. No distinction drawn between reversible and irreversible actions.",
      },
      {
        dimension: "Communication under load",
        strong:
          "Updates are short, state what is known, what is unknown, what is being done, and when the next update arrives. They would not need retraction if the situation changed.",
        weak:
          "Updates are either technical dumps or premature reassurance. Statements made that could not be supported by evidence at the time and would have to be walked back.",
      },
      {
        dimension: "After-action quality",
        strong:
          "The review finds systemic causes — missing telemetry, an ambiguous runbook, an escalation path nobody knew — and produces owned actions with dates, at least one of which is demonstrably done.",
        weak:
          "The review lists what went well and recommends more training. All findings are individual failures. Actions have no owner, so nothing changed.",
      },
    ],
    awards: ["strong-took-the-con", "safe-blameless-review", "strong-clock-discipline"],
    mode: "both",
  },
  {
    id: "px-passkey-migration",
    title: "Kill the Password",
    domain: "Identity",
    statement: "Every authentication system is only as strong as the recovery path you did not threat model.",
    difficulty: 4,
    weeks: 4,
    brief:
      "Ship passkey authentication in a real application you control, and then do the work that separates a demo from a deployment: threat model the recovery path. WebAuthn with discoverable credentials removes the shared secret, which removes credential stuffing, phishing of the primary factor, and password database compromise in one move — and then relocates all of the remaining risk into account recovery, device loss, and the synchronisation model of whichever passkey provider your users happen to use. Verizon's 2025 DBIR continues to show access as the recurring point of failure; most passkey rollouts preserve that failure by leaving a password fallback permanently enabled, which means the phishing-resistant factor is optional for the attacker. You will build the registration and authentication flows, then design a recovery process that is neither a permanent bypass nor a support burden that guarantees exceptions.",
    deliverables: [
      "Working passkey registration and authentication in a deployed application, with multiple credentials per account supported",
      "A written recovery design covering device loss, sole-device users, and the account takeover path an attacker would attempt through support",
      "A credential inventory model — what your server stores per credential, including AAGUID handling and what you deliberately chose not to record",
      "A downgrade analysis: every remaining path to authenticate without a passkey, and the decision on each one",
      "An abuse test set: registration replay, origin and RP ID mismatch, and a simulated social-engineering attempt against your recovery flow",
      "Telemetry that would let you detect recovery-path abuse in production, with the specific signal named",
    ],
    evidence: [
      "Deployed application URL or a recorded end-to-end walkthrough including registration on a second device",
      "The recovery threat model document with the support-desk attack path modelled explicitly",
      "Test output for the abuse set, including the origin-mismatch case failing closed",
      "A short note on the tradeoff you found hardest and the decision you made",
    ],
    rubric: [
      {
        dimension: "Recovery threat modelling",
        strong:
          "The recovery path is modelled as the primary attack surface. The learner identifies who can be socially engineered, what evidence recovery requires, and the delay or notification that limits silent takeover.",
        weak:
          "Recovery is an email link, which means the account's real authenticator is the mail provider. The learner has built phishing resistance on top of a phishable root and does not say so.",
      },
      {
        dimension: "Downgrade discipline",
        strong:
          "Every non-passkey authentication path is enumerated and either removed, gated, or accepted with a written rationale and an expiry date. The learner knows the strength of the account equals the weakest enabled path.",
        weak:
          "Password login remains fully enabled indefinitely and is described as a transition. No enumeration, so unknown fallbacks such as legacy API tokens survive untouched.",
      },
      {
        dimension: "Implementation correctness",
        strong:
          "Origin and RP ID verified server side, challenges are single-use and bound to the session, signature counter handling is deliberate, and the abuse tests demonstrate each check failing closed.",
        weak:
          "Verification delegated to a library with default settings the learner cannot explain. No negative tests, so a mismatched origin would likely be accepted and nobody would know.",
      },
      {
        dimension: "Operational realism",
        strong:
          "Detection signals for recovery abuse are named and instrumented, and there is a written answer to what happens when a user with one device loses it at two in the morning.",
        weak:
          "No telemetry. The plan for edge cases is that support will figure it out, which in practice means support will create the bypass the attacker uses.",
      },
    ],
    awards: ["strong-passwordless-shipped", "safe-recovery-modeled"],
    mode: "both",
  },
  {
    id: "px-sbom-reachability",
    title: "The Reachable Half",
    domain: "Supply Chain Security",
    statement: "A vulnerable dependency you never call is a chore; one on a request path is an incident.",
    difficulty: 3,
    weeks: 3,
    brief:
      "Generate a real SBOM for a real application, resolve it against vulnerability data, and then do the part that turns a list into a decision: prove which findings are actually reachable from untrusted input. Most dependency scanners produce hundreds of findings, the overwhelming majority of which are in code paths the application never executes, and teams that treat all of them as equal burn their credibility and then start ignoring the tool. You will produce a CycloneDX or SPDX SBOM, enrich it with vulnerability and exploitation data, sample a set of findings for manual reachability analysis, and publish a VEX-style statement recording which are affected and which are not, with the reasoning. The DBIR's 2025 finding that only fifty-four percent of edge-device vulnerabilities were fully remediated, at a median of thirty-two days, is what unprioritised backlogs look like at scale.",
    deliverables: [
      "A generated SBOM in CycloneDX or SPDX format, produced from the build rather than hand-written, with the generation command documented",
      "A vulnerability resolution pass with the data sources named and their known gaps stated",
      "Manual reachability analysis for at least ten findings, each with the call path traced or the exclusion justified",
      "A VEX-style document publishing affected, not affected, and under investigation statuses with machine-readable justifications",
      "At least one real remediation — upgrade, patch, replacement, or removal — with before and after evidence",
      "A written note on SBOM decay: what invalidates this document and how often it must be regenerated",
    ],
    evidence: [
      "The SBOM file and the exact command that produced it, reproducible by a third party",
      "The reachability analysis with call paths for at least three findings, showing the actual code",
      "The published VEX document",
      "Commit or release evidence of the remediation shipped",
    ],
    rubric: [
      {
        dimension: "SBOM fidelity",
        strong:
          "The SBOM is generated from the actual build and includes transitive dependencies, with the learner able to explain what the generator cannot see — vendored code, dynamic loading, system packages outside the manifest.",
        weak:
          "The SBOM is a dependency manifest renamed. Transitive depth is shallow or absent, and the learner presents it as complete.",
      },
      {
        dimension: "Reachability reasoning",
        strong:
          "Reachability is demonstrated by tracing an actual call path or by showing the vulnerable function is never invoked and the module never imported. Uncertainty is recorded as under investigation rather than resolved by assumption.",
        weak:
          "Reachability judged by whether the package name looks important. Findings dismissed as false positives with no analysis, which is exactly how real exposure gets buried.",
      },
      {
        dimension: "Prioritisation logic",
        strong:
          "Ranking combines exploitation evidence, reachability, and exposure to untrusted input, and the learner can defend why a lower-severity finding was fixed before a higher-severity one.",
        weak:
          "Sorted by CVSS descending and worked from the top. Severity treated as risk, ignoring whether the code is reachable or the vulnerability is exploited in the wild.",
      },
      {
        dimension: "Maintenance thinking",
        strong:
          "The learner states the decay properties of the artefact, wires regeneration into the build, and knows a VEX statement is only true for a specific version.",
        weak:
          "The SBOM is a one-time deliverable with no regeneration trigger, stale within a fortnight and treated as current thereafter.",
      },
    ],
    awards: ["strong-reachability-proof", "safe-vex-published"],
    mode: "novus",
  },
  {
    id: "px-kev-epss-triage",
    title: "Triage Engine",
    domain: "Vulnerability Management",
    statement: "Prioritisation is a claim about the future — measure it like one.",
    difficulty: 3,
    weeks: 3,
    brief:
      "Build a vulnerability prioritisation engine that combines CISA KEV membership, EPSS probability, and your own asset context, then measure it against the naive baseline of patching everything with a high CVSS score. EPSS gives a zero-to-one probability that a given CVE will be exploited in the next thirty days, updated daily; KEV is the far narrower set of vulnerabilities with confirmed in-the-wild exploitation, carrying binding remediation deadlines for US federal civilian agencies under BOD 22-01. The engine is easy. The discipline is defining and computing your strategy's coverage — the fraction of actually-exploited vulnerabilities you would have prioritised — and efficiency — the fraction of your prioritised work that mattered — and then showing where your strategy is worse than the baseline, because it will be somewhere.",
    deliverables: [
      "A working pipeline ingesting KEV and EPSS daily, with a stored history so you can evaluate against yesterday's decisions, not today's hindsight",
      "An asset context model — exposure to untrusted networks, data sensitivity, compensating controls — with the scoring made explicit rather than embedded in code",
      "A written policy converting the score into an SLA, including the escape hatch for KEV entries that your policy would otherwise deprioritise",
      "A backtest against a historical window comparing your strategy, CVSS 7-and-above, and KEV-only, reporting coverage and efficiency for each",
      "A documented failure case: a real vulnerability your strategy would have ranked low that mattered, and what signal was missing",
      "An exception process for vulnerabilities that cannot be remediated in SLA, with compensating control requirements and expiry",
    ],
    evidence: [
      "Public repository with the pipeline and the backtest code, seeded so results reproduce",
      "The comparison table with coverage and efficiency figures for all three strategies over the same window",
      "The written policy document as it would go to an operations team",
      "A short write-up of the failure case and the change you made in response",
    ],
    rubric: [
      {
        dimension: "Measurement rigour",
        strong:
          "Coverage and efficiency are defined precisely, computed over a stated window against a stated ground truth, and the backtest avoids using data that would not have been available at decision time.",
        weak:
          "Improvement asserted with no baseline, or measured with today's KEV list applied to last year's decisions, which guarantees a flattering result.",
      },
      {
        dimension: "Signal understanding",
        strong:
          "The learner can explain what EPSS predicts and what it does not, why KEV is a floor rather than a ranking, and why CVSS temporal and environmental factors are usually ignored in practice.",
        weak:
          "Scores combined into a weighted sum with weights chosen by feel. EPSS treated as severity, KEV treated as one input among many rather than a hard trigger.",
      },
      {
        dimension: "Operational translation",
        strong:
          "The policy is executable by someone who has never met the learner: clear SLAs, a named owner, a defined exception path with expiry, and a rule for the case where the model and KEV disagree.",
        weak:
          "Output is a ranked list with no SLA and no owner. Exceptions granted informally and never expire, so the backlog quietly becomes permanent.",
      },
      {
        dimension: "Failure honesty",
        strong:
          "The learner presents a case where the strategy was wrong, diagnoses the missing signal, and changed the system rather than the narrative.",
        weak:
          "No failure case identified, which in vulnerability prioritisation means the evaluation was not real.",
      },
    ],
    awards: ["strong-triage-engineer", "safe-measured-coverage"],
    mode: "novus",
  },
  {
    id: "px-honeypot-forensics",
    title: "Bait and Reconstruct",
    domain: "Digital Forensics",
    statement: "You do not understand an intrusion until you can put its minutes in order.",
    difficulty: 2,
    weeks: 4,
    brief:
      "Put a deliberately weak but carefully isolated service on the internet, collect thirty days of what arrives, and then pick one real intrusion attempt and reconstruct it minute by minute as a forensic timeline. The internet provides an inexhaustible supply of genuine adversary behaviour for free, most of it automated and dull, some of it not. The first half of this project is operational: build the honeypot so that a successful compromise cannot reach anything you care about, and instrument it so you capture enough to reconstruct events afterward. The second half is forensic craft: take one session, correlate network capture with host artefacts, establish what the actor did in what order, distinguish what you observed from what you inferred, and write it up to a standard that would survive review by someone who does not want to believe you.",
    deliverables: [
      "A deployed honeypot with a written isolation design — network segmentation, credential isolation, egress control, and the kill criteria for taking it down",
      "Thirty days of collected telemetry with a documented collection and retention scheme, and a privacy note on source addresses",
      "A quantified summary of what arrived: volume, top techniques, credential sets attempted, and the shape of the automated background",
      "A full forensic timeline of one selected session with every entry sourced to a specific artefact",
      "An analysis that separates observation, inference, and speculation into visibly different registers",
      "A gap note listing what you could not determine and exactly what collection would have determined it",
    ],
    evidence: [
      "The isolation design document and the deployment configuration",
      "The thirty-day summary with raw counts and the collection method stated",
      "The forensic timeline with artefact references for each entry",
      "Sanitised sample artefacts — packet capture excerpt, log lines, or file hashes — supporting at least three timeline entries",
    ],
    rubric: [
      {
        dimension: "Containment design",
        strong:
          "Isolation is defended with an explicit answer to what happens if the honeypot is fully compromised, egress is restricted by default, credentials are unique and worthless elsewhere, and kill criteria were defined in advance.",
        weak:
          "The honeypot shares a network, an account, or a cloud project with something real. The isolation plan is that the software is designed for this, which is not a control.",
      },
      {
        dimension: "Evidence handling",
        strong:
          "Every timeline entry cites the artefact it rests on, timestamps are normalised to a stated timezone with clock-skew handled, and the learner distinguishes what the log recorded from what it means.",
        weak:
          "Timeline written as narrative with no sourcing. Mixed timezones. Tool output pasted and treated as conclusion.",
      },
      {
        dimension: "Inferential discipline",
        strong:
          "Observation, inference, and speculation are visibly separated, alternative explanations are considered for at least one key step, and confidence is stated per conclusion.",
        weak:
          "Attribution claims from user-agent strings or source geography. Confident narrative about actor intent built on three log lines.",
      },
      {
        dimension: "Collection reflection",
        strong:
          "The gap note names specific missing telemetry and specific questions it would have answered, and at least one gap was closed during the thirty days.",
        weak:
          "No gap analysis, implying complete visibility. Collection unchanged throughout, so nothing was learned about collection.",
      },
    ],
    awards: ["strong-timeline-builder", "safe-isolation-designed"],
    mode: "novus",
  },
  {
    id: "px-smart-contract-audit",
    title: "The Audit Report",
    domain: "Blockchain Security",
    statement: "Severity is a claim about consequence and likelihood, and you must be able to defend both.",
    difficulty: 4,
    weeks: 4,
    brief:
      "Produce a real audit report on a real contract system, to the standard a paying client would accept. Start on deliberately vulnerable training targets to build the pattern library — reentrancy, unchecked external calls, oracle manipulation, access-control gaps, precision and rounding loss, upgrade-path abuse — then move to a live, small, unaudited contract on a public testnet or a project that welcomes review. Every finding needs a working proof of concept in a test harness, a severity rating you can defend against both an optimistic developer and a pessimistic client, and a fix recommendation specific enough to implement. The lesson this project drives home is that the hard part of auditing is not spotting the bug. It is the invariant work: stating what the system claims to guarantee, then hunting the state in which the claim is false.",
    deliverables: [
      "A written system model: the contracts in scope, the actors, the value flows, and the trust assumptions the code makes about each",
      "An invariant list — the properties the system claims to always hold — with each mapped to how it is enforced",
      "Findings with working proof-of-concept tests in a real harness, each reproducible with a single command",
      "A severity rationale per finding covering impact, likelihood, and the preconditions an attacker needs",
      "Fix recommendations at the code level, with a note on what each fix costs in gas, complexity, or functionality",
      "A fuzzing or invariant-testing run against at least two stated invariants, with the campaign configuration published",
      "A disclosure record following the project's policy, with dates",
    ],
    evidence: [
      "The published audit report",
      "Repository with the proof-of-concept test suite, runnable by a third party",
      "Fuzzing campaign output including the seed and the number of runs",
      "Disclosure correspondence or a public issue thread, redacted as appropriate",
    ],
    rubric: [
      {
        dimension: "Invariant thinking",
        strong:
          "Findings emerge from violated invariants the learner stated in advance. Coverage of the system's guarantees is systematic rather than driven by which vulnerability classes the learner already knows.",
        weak:
          "A checklist walk of known bug classes. No invariants stated, so logic errors specific to this system's economics are structurally invisible.",
      },
      {
        dimension: "Proof quality",
        strong:
          "Every finding above informational has a runnable exploit test that fails before the fix and passes after. Preconditions are stated in the test, including required attacker capital.",
        weak:
          "Findings described in prose with a theoretically an attacker could framing. No test, so the severity is unfalsifiable and the developer is right to push back.",
      },
      {
        dimension: "Severity defensibility",
        strong:
          "Severity is argued from impact and attacker preconditions, including cost of the attack versus value extracted. The learner has downgraded at least one finding on reflection and says so.",
        weak:
          "Everything is high or critical. Severity inflated to make the report look valuable, which destroys the signal the client needs to sequence fixes.",
      },
      {
        dimension: "Remediation usefulness",
        strong:
          "Fixes are concrete, consider the second-order effects of the change, and acknowledge where a fix trades functionality or introduces new assumptions.",
        weak:
          "Recommendations amount to validate input or follow best practice. No consideration of whether the fix breaks a legitimate flow or shifts risk elsewhere.",
      },
    ],
    awards: ["strong-audit-report", "safe-poc-proven", "strong-invariant-hunter"],
    mode: "motus",
  },
  {
    id: "px-dao-governance-review",
    title: "Govern or Be Governed",
    domain: "Blockchain Security",
    statement: "Governance is an attack surface with a voting interface.",
    difficulty: 4,
    weeks: 4,
    brief:
      "Take a real DAO with on-chain governance and produce a governance security review: model how control could be seized, simulate the most credible path on a fork, and publish a set of concrete parameter and process recommendations. The technical vectors are well documented in the public record — borrowed voting power acquired for the duration of a single block, proposals whose executable payload does not match their description, timelock windows too short for anyone to react, quorum thresholds that a handful of addresses can meet alone, and delegate concentration that makes the token distribution irrelevant. The governance vectors are less discussed and often worse: proposal fatigue, forum capture, and the fact that most token holders never vote, so effective quorum is a small, identifiable, and socially reachable set of people. You will simulate at least one attack against a forked mainnet state and quantify what it would cost.",
    deliverables: [
      "A governance map: proposal lifecycle, thresholds, timelock durations, execution authority, and every emergency or admin power that bypasses the normal path",
      "A voting power concentration analysis from real on-chain data, including delegation, showing effective control rather than nominal distribution",
      "A simulated attack on a forked state — capital required, blocks needed, and what stops it or fails to",
      "A defence analysis of the existing mitigations, stating for each what it actually prevents and what it merely delays",
      "A prioritised recommendation set covering parameters and process, with the cost of each in governance friction",
      "A monitoring design: the specific on-chain signals that would warn of an accumulation or a malicious proposal before execution",
    ],
    evidence: [
      "The published review with the concentration analysis and its data sources",
      "Fork simulation code and output showing the attack succeeding or being blocked, with the reason",
      "The recommendation set as delivered to the community — forum post, governance proposal, or direct communication",
      "Any response from the community, including disagreement",
    ],
    rubric: [
      {
        dimension: "Control mapping",
        strong:
          "Every path to executing privileged state change is enumerated, including multisigs, guardians, and pause powers that sit outside token voting. The learner identifies where formal governance is a facade over a small operational key set.",
        weak:
          "Only the token-voting path examined. Admin keys, upgrade proxies, and emergency multisigs missed, so the review describes the decorative governance and not the real one.",
      },
      {
        dimension: "Empirical grounding",
        strong:
          "Concentration figures come from on-chain data the learner queried, delegation is resolved to effective voting power, and historical turnout is used to compute realistic rather than nominal quorum.",
        weak:
          "Token distribution taken from a dashboard, delegation ignored, quorum assumed to require the stated percentage of all supply, which almost never reflects who actually votes.",
      },
      {
        dimension: "Simulation credibility",
        strong:
          "The attack is executed against forked real state with real balances and real timelocks, and the cost is computed including capital, fees, slippage, and the risk the attacker bears.",
        weak:
          "Attack described theoretically or simulated against toy contracts with invented parameters. Cost analysis omits whether the required capital is even acquirable.",
      },
      {
        dimension: "Recommendation realism",
        strong:
          "Recommendations account for the governance friction they add and the legitimate activity they slow. The learner can say which they would drop if the community accepted only one.",
        weak:
          "Recommendations maximise safety with no regard for participation, which guarantees they are ignored. No prioritisation, so the community has no entry point.",
      },
    ],
    awards: ["strong-governance-review", "safe-simulated-on-fork"],
    mode: "motus",
  },
  {
    id: "px-secrets-pipeline",
    title: "Rotate What Leaks",
    domain: "Application Security",
    statement: "Detection without rotation just tells you how long the key has been compromised.",
    difficulty: 3,
    weeks: 3,
    brief:
      "Build a secrets detection and rotation capability for a real codebase, and then prove it against the two cases that break naive implementations: a secret already in git history, and a secret that leaks after your scanner is in place. Detection is the easy half and where most projects stop. The valuable half is the response pipeline — verifying whether a matched string is a live credential, revoking it, rotating it, and confirming the old value is dead — because a leaked key that is detected and not rotated is simply a documented compromise. You will also handle the history problem honestly: rewriting git history does not un-publish anything a fork or a mirror already has, so anything ever pushed to a public repository must be treated as burned. If, in the course of this work, you find a live credential belonging to someone else, you will report it under a written disclosure protocol and never test it.",
    deliverables: [
      "A scanning setup covering pre-commit, CI, and full history, with the detection rule set documented and at least two custom rules for formats your tooling missed",
      "A verification step distinguishing a live credential from a matched pattern, without ever using the credential beyond the minimum to establish validity",
      "A rotation runbook per secret type with the revocation-first ordering and the expected downtime stated",
      "A measured false-positive rate over a real codebase and the tuning decisions made, with what you chose to keep noisy and why",
      "A documented incident exercise: plant a live test credential, detect it, revoke it, rotate it, and record the wall-clock time from commit to dead key",
      "A written disclosure protocol for third-party secrets, including what you will not do",
    ],
    evidence: [
      "Repository with the scanning configuration and custom rules",
      "The rotation runbook and the timing evidence from the exercise, showing commit time and revocation confirmation time",
      "The false-positive measurement with counts against a stated corpus",
      "If applicable, a redacted record of a responsible disclosure and its outcome",
    ],
    rubric: [
      {
        dimension: "Response completeness",
        strong:
          "The pipeline ends at a confirmed-dead credential, not at an alert. Revocation precedes rotation where the service allows it, and the exercise produced a real measured time to revoke.",
        weak:
          "The project is a scanner. Rotation is described as a manual follow-up owned by nobody, which in practice means live keys sit in history indefinitely.",
      },
      {
        dimension: "History realism",
        strong:
          "Anything ever pushed publicly is treated as permanently compromised regardless of rewriting. The learner distinguishes cleaning the repository from containing the exposure and does both in the right order.",
        weak:
          "History rewritten and the incident declared closed. No revocation, on the theory that the commit is gone, which ignores forks, mirrors, caches, and anyone already watching.",
      },
      {
        dimension: "Noise management",
        strong:
          "False positives measured, entropy and pattern rules tuned with reasoning, and the learner deliberately accepts noise in high-consequence categories while suppressing it elsewhere.",
        weak:
          "Either everything alerts, so developers disable the hook, or thresholds were raised until it went quiet, which trades visible noise for invisible misses.",
      },
      {
        dimension: "Ethical handling",
        strong:
          "Third-party credentials are validated with the least intrusive possible check, never used, reported through the vendor's channel, and the protocol is written down before it was needed.",
        weak:
          "A found credential was tested to see what it could access. No disclosure protocol, so the decision was made under curiosity rather than policy.",
      },
    ],
    awards: ["strong-rotation-proven", "safe-disclosure-conduct"],
    mode: "novus",
  },
  {
    id: "px-identity-aware-proxy",
    title: "Retire the VPN",
    domain: "Zero Trust Architecture",
    statement: "Network position is not identity, and a flat network is a single credential away from total.",
    difficulty: 3,
    weeks: 4,
    brief:
      "Replace flat network access to a set of real services you run with an identity-aware access proxy, so that reaching a service requires proving who you are and what device you are on, per request, rather than being inside a tunnel. The DBIR's 2025 finding that exploitation of edge devices, particularly VPN appliances, rose from three percent to twenty-two percent of breaches is the argument in one line: the appliance that grants network-wide access is the highest-value target on the perimeter, and when it falls, everything behind it is reachable. Build the proxy, enforce per-service authorisation policy, add device posture as a signal, and then do the part that decides whether this is architecture or configuration: prove the services are not reachable by any path that bypasses the proxy, including from a compromised host already inside.",
    deliverables: [
      "A deployed identity-aware proxy fronting at least three services with distinct authorisation policies",
      "A policy model expressed as code — identity, device, and context conditions per service — with the default-deny position visible",
      "A bypass audit: every network path to each backend, and the enforcement that closes it, including direct addressing from inside",
      "A device posture signal integrated into at least one policy decision, with the honest limits of that signal stated",
      "An access log design that answers who reached what, when, and under which policy, retained long enough to investigate",
      "A break-glass procedure for proxy failure that does not reintroduce flat access, with its own audit trail",
    ],
    evidence: [
      "Configuration repository and a recorded demonstration of an authorised and an unauthorised access attempt",
      "The bypass audit with test output proving direct backend access fails from an internal host",
      "Sample access logs showing the policy decision recorded alongside the request",
      "The break-glass procedure and evidence it was tested at least once",
    ],
    rubric: [
      {
        dimension: "Bypass elimination",
        strong:
          "The learner tested direct backend access from inside the network and it failed. Backends authenticate the proxy rather than trusting its source address, and the audit covers management interfaces and the container or host network path.",
        weak:
          "The proxy is in front of the services and the services still listen on all interfaces. Anyone with a foothold routes around it in one command, and the audit never tested from inside.",
      },
      {
        dimension: "Policy expressiveness",
        strong:
          "Policies differ per service and reflect real sensitivity, default is deny, and the learner can explain why a specific service requires a stronger condition than another.",
        weak:
          "One policy — authenticated equals allowed — applied everywhere. This is a login page in front of a flat network and does not change the blast radius of a stolen session.",
      },
      {
        dimension: "Signal honesty",
        strong:
          "Device posture is used with a clear statement of what it proves and what a compromised endpoint can forge. The learner does not treat a self-reported attribute as an attestation.",
        weak:
          "Posture accepted from the client and treated as trustworthy. The control depends on the honesty of the machine it is meant to be assessing.",
      },
      {
        dimension: "Failure planning",
        strong:
          "Break-glass exists, is scoped, is audited, and was tested. The learner knows what happens to access when the identity provider is down and has decided deliberately.",
        weak:
          "No failure plan, so the first outage will be resolved by disabling the proxy — and it will stay disabled.",
      },
    ],
    awards: ["strong-proxy-enforced", "safe-no-bypass"],
    mode: "novus",
  },
  {
    id: "px-purple-team-emulation",
    title: "Emulate a Named Adversary",
    domain: "Adversary Emulation",
    statement: "Emulate behaviour, not tooling — the tool changes weekly, the objective does not.",
    difficulty: 4,
    weeks: 5,
    brief:
      "Choose one adversary with a substantial public reporting record, build an emulation plan from the primary reports rather than from a summary blog, execute it end to end in your lab, and measure detection at every step. This is different from running atomic tests: an emulation follows the actor's actual operational sequence, including the dull steps between the interesting ones, because those dull steps are frequently where detection is cheapest and where real intrusions are caught. You will produce a per-step detection outcome — prevented, detected, logged but not alerted, or invisible — and the logged-but-not-alerted category is the one that will teach you the most, because it is where the data already existed and nobody had written the question. Close at least three gaps and re-run to prove the change.",
    deliverables: [
      "An emulation plan built from cited primary reporting, with each step mapped to ATT&CK technique and to the specific report paragraph that justifies it",
      "A lab environment representative enough to make the results mean something, with its divergences from a real environment listed",
      "Execution evidence per step: what was run, when, and the resulting telemetry",
      "A detection outcome matrix across all steps using prevented, detected, logged-not-alerted, and invisible",
      "At least three closed gaps with the new or modified detection, plus a re-run proving the change",
      "A written analysis of which single telemetry addition would have improved the outcome most, with its cost",
    ],
    evidence: [
      "The emulation plan with citations to primary sources",
      "The detection outcome matrix, before and after",
      "Rule or configuration diffs for the three closed gaps",
      "Re-run evidence with timestamps showing the improved outcome",
    ],
    rubric: [
      {
        dimension: "Source discipline",
        strong:
          "Every emulated behaviour traces to primary incident reporting, and where reporting is ambiguous the learner says so and states the assumption made. Tooling substitutions are declared as substitutions.",
        weak:
          "The plan is assembled from a technique list attributed to the actor with no reporting behind specific steps. Emulation of a brand rather than a behaviour.",
      },
      {
        dimension: "Sequence fidelity",
        strong:
          "The full chain is executed in order including reconnaissance, staging, and cleanup. The learner notes where their lab forced a deviation and what it costs the result's validity.",
        weak:
          "Isolated techniques run in convenient order. Nothing is learned about detection that depends on sequence or on the accumulation of weak signals.",
      },
      {
        dimension: "Outcome classification",
        strong:
          "Four-way classification applied strictly, with logged-not-alerted counted as a failure of detection engineering rather than a partial success. Evidence is attached per step.",
        weak:
          "Binary detected or not, with detected meaning the event existed somewhere in the data. This inflates coverage and hides the exact gaps the exercise was meant to find.",
      },
      {
        dimension: "Improvement loop",
        strong:
          "Gaps closed and re-tested, with the new detections carrying their own false-positive assessment so the fix does not create an operational problem.",
        weak:
          "Gaps documented as future work. Or closed with rules so specific they detect only the exact command the learner ran and nothing an adversary would do.",
      },
    ],
    awards: ["strong-emulation-run", "safe-gap-closed", "strong-primary-sources"],
    mode: "motus",
  },
  {
    id: "px-telemetry-economics",
    title: "Cost of Seeing",
    domain: "Security Operations",
    statement: "Every gigabyte you collect is a gigabyte you must justify for the next three years.",
    difficulty: 3,
    weeks: 4,
    brief:
      "Build a security telemetry pipeline under a hard budget and prove the detection value of each data source per unit of cost. Every security organisation eventually meets this wall: the SIEM bill grows faster than the team, and the response is either an indiscriminate cut that blinds the detection team or an indiscriminate spend that starves everything else. The professional move is to know, per source, what detections depend on it, what an incident would cost without it, and what a cheaper tier would lose. You will build tiered routing — hot searchable storage for what analytics need now, cheap cold storage for what investigations need later, and dropped for what nobody has ever queried — and then defend the drops with evidence rather than intuition.",
    deliverables: [
      "A working pipeline with at least three routing tiers and the routing decisions expressed as reviewable configuration",
      "A source inventory with measured volume, cost per gigabyte per tier, and the detections and investigation questions each source supports",
      "A query archaeology pass: what has actually been searched over a real period, and which sources have never been touched",
      "A drop decision record for each removed or downsampled source, stating the detection or investigation capability sacrificed",
      "A retention policy tied to the realistic time to discovery for your threat model, not to a round number of days",
      "A before-and-after cost figure with the detection coverage delta measured, not asserted",
    ],
    evidence: [
      "Pipeline configuration repository",
      "The source inventory table with real volume and cost numbers",
      "The drop decision records",
      "A cost and coverage comparison with the measurement method described",
    ],
    rubric: [
      {
        dimension: "Value attribution",
        strong:
          "Each source is tied to specific detections and specific investigative questions, and the learner can name what breaks if it disappears. Sources that survive only because they have always been collected are identified as such.",
        weak:
          "Sources justified by category — endpoint logs are important — with no mapping to any query or rule. Value is asserted, so cuts become political rather than analytical.",
      },
      {
        dimension: "Retention reasoning",
        strong:
          "Retention is derived from how long intrusions plausibly go undiscovered in this environment plus any binding obligation, and the learner distinguishes searchable from retrievable.",
        weak:
          "Ninety days because that was the default. No distinction between hot and cold, so the choice is between expensive and absent.",
      },
      {
        dimension: "Reversibility",
        strong:
          "Drops are staged, monitored, and reversible, with the decision record naming what signal would trigger reinstatement.",
        weak:
          "Sources deleted from the configuration with no record. Six months later nobody knows why an investigation cannot be completed.",
      },
      {
        dimension: "Measurement",
        strong:
          "Coverage delta is measured by re-running detection tests against the reduced pipeline, so the cost saving comes with a known capability price.",
        weak:
          "Savings reported, coverage impact assumed to be minimal. No test, so the first missed incident will be the measurement.",
      },
    ],
    awards: ["strong-telemetry-economist", "safe-drop-documented"],
    mode: "both",
  },
  {
    id: "px-crypto-implementation-review",
    title: "Break the Primitive Use",
    domain: "Applied Cryptography",
    statement: "Almost nobody breaks the algorithm; almost everybody breaks the way it was used.",
    difficulty: 5,
    weeks: 4,
    brief:
      "Review a real cryptographic implementation in a small open-source project — a token format, an encrypted backup, a licence signer, a session cookie scheme — and find the misuse. You are not attacking AES or Ed25519. You are hunting the recurring failures at the seams: a nonce reused across messages under the same key, a MAC verified after decryption or with a non-constant-time comparison, encrypt-and-MAC ordering that leaks, a password KDF with parameters set for a machine from a decade ago, a signature scheme where the algorithm field is attacker-controlled, randomness from a non-cryptographic source, and key material that outlives its rotation policy because rotation was never implemented. Write proof-of-concept code for at least one finding, and disclose responsibly.",
    deliverables: [
      "A cryptographic inventory of the target: every primitive, key, nonce or IV source, and where each key lives across its lifecycle",
      "A misuse analysis against a stated checklist of failure classes, with each item marked present, absent, or not applicable and reasoned",
      "A working proof of concept for at least one finding — forgery, decryption, downgrade, or key recovery — with its preconditions",
      "A parameter review for any password-based or key-derivation function, with concrete recommended parameters and the reasoning",
      "A remediation proposal including migration for data already encrypted or signed under the old scheme",
      "A responsible disclosure record with dates and the coordination timeline agreed with the maintainer",
    ],
    evidence: [
      "The review document with the inventory and the analysis",
      "Proof-of-concept code that a third party can run against a test vector",
      "The disclosure correspondence, redacted, with dates",
      "Any upstream fix, patch, or advisory that resulted",
    ],
    rubric: [
      {
        dimension: "Seam focus",
        strong:
          "The analysis targets construction, key lifecycle, and protocol composition — where the primitives meet the application — and the learner explains why the algorithm itself is not the interesting surface.",
        weak:
          "Time spent on algorithm choice and key length while nonce generation, comparison timing, and key rotation go unexamined.",
      },
      {
        dimension: "Demonstrated exploitability",
        strong:
          "At least one finding is proven with running code and stated preconditions, and the learner is clear about which findings are theoretical hardening versus practically exploitable today.",
        weak:
          "Findings are pattern matches against a checklist with no demonstration. Weak comparison flagged without showing whether the timing signal is measurable in this context.",
      },
      {
        dimension: "Lifecycle coverage",
        strong:
          "Keys are traced from generation through storage, use, rotation, and destruction, and the review names where the design has no answer.",
        weak:
          "Analysis stops at the encryption call. Where the key came from and how it would be rotated after compromise is not addressed.",
      },
      {
        dimension: "Migration realism",
        strong:
          "Remediation accounts for existing ciphertexts and signatures, versioning, and the rollout order that avoids a window where neither scheme validates.",
        weak:
          "Recommendation is to switch to a modern construction, with no path for data already in the wild and no version field to make migration possible.",
      },
    ],
    awards: ["strong-crypto-reviewer", "safe-poc-proven", "strong-migration-designed"],
    mode: "motus",
  },
  {
    id: "px-custody-architecture",
    title: "Custody Under Duress",
    domain: "Key Custody",
    statement: "Design custody for the day the holder is unavailable, uncooperative, or lying.",
    difficulty: 4,
    weeks: 4,
    brief:
      "Design and operate a key custody architecture for a real signing responsibility you hold — a release signing key, a treasury multisig, a certificate authority, a validator identity — and then stress it against the three human failure modes that matter: unavailable, uncooperative, and compromised. Technology alone does not solve this. A multisig on one person's three devices is a single point of failure with a threshold badge. Hardware isolation without a tested recovery path converts theft risk into loss risk. You will define the roles, the quorum, the physical and geographic separation, the signing procedure with its verification step, and the revocation path, and then run two drills that actually remove capability from a holder and see whether the system still works.",
    deliverables: [
      "A custody architecture document: key hierarchy, hardware, quorum, holder roles, and separation of duties with the reasoning for each choice",
      "A signing procedure requiring the signer to verify what they are signing through an independent channel, defeating a compromised requester",
      "An adversary analysis covering the malicious insider, the coerced holder, the lost device, and the deceased or unreachable holder",
      "A revocation and rotation plan with a stated target time and the dependency list that must be updated",
      "Two executed drills: one recovery with a holder removed, one revocation exercise, both timed and logged",
      "An access review cadence with a documented removal procedure for departing holders",
    ],
    evidence: [
      "The architecture document with the quorum rationale",
      "Drill logs with timestamps, participants, and what failed",
      "The signing procedure with evidence of at least one real signing operation performed under it",
      "The revocation plan and evidence the dependency list is accurate",
    ],
    rubric: [
      {
        dimension: "Failure-mode coverage",
        strong:
          "Unavailable, uncooperative, and compromised holders are each addressed with a distinct mechanism, and the learner can explain why the mechanism for one does not accidentally weaken another.",
        weak:
          "Only theft is modelled. Loss and coercion unaddressed, so the design either cannot recover or cannot resist a holder who is forced to sign.",
      },
      {
        dimension: "Separation reality",
        strong:
          "Quorum holders are genuinely separated by person, location, and account, and the learner has identified the correlated failure — the shared cloud provider, the shared building, the shared password manager — and broken it.",
        weak:
          "Threshold cryptography over shares that all sit in one account or one home. The mathematics is sound and the deployment reduces it to one key.",
      },
      {
        dimension: "Verification in signing",
        strong:
          "The procedure forces the signer to confirm the payload through a channel the requester does not control, so a compromised build system or a spoofed request does not produce a valid signature.",
        weak:
          "Signers approve what the tool shows them. A compromised requesting system gets a legitimate signature on whatever it likes, and the audit trail will show it was authorised.",
      },
      {
        dimension: "Drill authenticity",
        strong:
          "Drills genuinely removed capability rather than pretending to, produced surprises, and the surprises changed the architecture.",
        weak:
          "Drills were walkthroughs. Everyone knew the answer in advance, so the exercise validated the document rather than the system.",
      },
    ],
    awards: ["strong-custody-architect", "safe-recovery-drilled"],
    mode: "both",
  },
  {
    id: "px-security-champions",
    title: "Build the Champions",
    domain: "Security Leadership",
    statement: "Influence scales; your review queue does not.",
    difficulty: 3,
    weeks: 6,
    brief:
      "Stand up a working security champions programme inside a real organisation you have access to — an open-source project, a student society, a volunteer group, a small company — and run it long enough to produce evidence that behaviour changed. This is a leadership project with a measurement requirement. Most champions programmes fail in an identifiable pattern: enthusiastic launch, a training session, a chat channel that goes quiet in five weeks, and no measurable difference in outcomes. The ones that work give champions something they personally gain — capability, standing, decision rights — and remove work from them somewhere else. You will define what a champion is authorised to decide, what they receive in exchange, and what metric you expect to move, and then report the metric honestly including if it did not move.",
    deliverables: [
      "A programme charter: purpose, the specific authority champions hold, time commitment, and what they get in return",
      "A selection and onboarding process, with the deliberate reasoning about who you did not select",
      "A capability curriculum tied to the actual risks of this organisation, not a generic awareness course",
      "A defined outcome metric measured before the programme and again after, with the measurement method stated",
      "A working artefact the champions produced together — a threat model, a paved-road guide, a fixed class of finding",
      "A sustainability plan covering champion turnover and the loss of executive attention",
      "An honest retrospective on what did not work",
    ],
    evidence: [
      "The charter as published to the organisation",
      "Before-and-after measurement of the outcome metric with raw numbers",
      "The artefact the champions produced",
      "Written statements from at least two champions about whether it was worth their time",
    ],
    rubric: [
      {
        dimension: "Exchange design",
        strong:
          "The programme is explicit about what champions gain and what was taken off their plate to make room. The learner can name the incentive that survives a busy quarter.",
        weak:
          "Champions are volunteers given extra work in exchange for a title. Participation decays and is attributed to culture rather than to the design.",
      },
      {
        dimension: "Authority clarity",
        strong:
          "Champions hold defined decision rights — approving a design, waiving a control within bounds, blocking a release for a stated class of issue — and the boundary is written and respected.",
        weak:
          "Champions can raise concerns. That is what everyone could already do, so the role changes nothing and the best people leave it first.",
      },
      {
        dimension: "Measurement honesty",
        strong:
          "The outcome metric is behavioural — time to fix, findings caught pre-merge, threat models per feature — measured the same way before and after, and reported even when unflattering.",
        weak:
          "Success measured by attendance, channel members, or training completion. These measure the programme's existence, not its effect.",
      },
      {
        dimension: "Durability",
        strong:
          "There is a named succession path, a rotation cadence, and evidence the programme survived at least one champion leaving.",
        weak:
          "The programme depends entirely on the learner's personal energy and would end the week they stopped.",
      },
    ],
    awards: ["strong-champions-built", "safe-measured-behavior"],
    mode: "both",
  },
  {
    id: "px-security-strategy-board",
    title: "The Twelve-Month Case",
    domain: "Security Leadership",
    statement: "A strategy that does not say what you will not do is a wish list.",
    difficulty: 4,
    weeks: 4,
    brief:
      "Write a twelve-month security strategy and the board presentation that accompanies it, for a real organisation — yours, a nonprofit you advise, or a public company you can research from filings and disclosures. The document must contain the thing most security strategies omit: an explicit list of risks you are choosing to accept this year, with the reasoning and the owner of that acceptance. Boards can fund a plan that admits its limits. They cannot act on a plan that claims it will address everything, because such a plan gives them no way to judge whether the ask is right-sized. You will price the plan, sequence it against the organisation's actual constraints, define the small number of measures you will report against, and rehearse the presentation against hostile questions.",
    deliverables: [
      "A current-state assessment grounded in evidence you gathered, not in a maturity model score",
      "A twelve-month plan with sequencing, dependencies, and the specific reason each item precedes the next",
      "A costed resource ask covering people, tooling, and the operational load the plan creates for other teams",
      "An explicit risk acceptance register: what is not being addressed, why, who owns the acceptance, and when it is revisited",
      "A board-level measurement set of no more than five measures, each tied to a decision the board could take",
      "A twelve-slide-maximum board deck plus a two-page written pre-read",
      "A hostile question rehearsal: the ten hardest questions and your actual answers",
    ],
    evidence: [
      "The written strategy document",
      "The board deck and the pre-read",
      "The risk acceptance register with named owners",
      "A recording or a written account of presenting it to a real audience with the questions asked",
    ],
    rubric: [
      {
        dimension: "Refusal clarity",
        strong:
          "The acceptance register is specific, owned outside the security function, and dated for review. The learner can defend each acceptance on business grounds and knows which one keeps them awake.",
        weak:
          "No acceptance register, implying everything is covered. When something fails, the strategy provides no record that the risk was known and consciously carried.",
      },
      {
        dimension: "Sequencing logic",
        strong:
          "Order is driven by dependency and by risk reduction per unit of organisational disruption. The learner can explain why the obvious first item is not first.",
        weak:
          "Items ordered by framework domain or by what is easiest to buy. No dependencies mapped, so the plan will stall on the first prerequisite nobody planned for.",
      },
      {
        dimension: "Executive register",
        strong:
          "The deck speaks in outcomes, decisions, and money. Technical detail is available in appendix and never on the main path. Each measure connects to something the board could actually change.",
        weak:
          "Control counts, tool logos, and maturity radar charts. The board is asked to approve a budget for activity rather than for an outcome.",
      },
      {
        dimension: "Cost honesty",
        strong:
          "The ask includes the load imposed on engineering and operations, the run cost after the project ends, and what the learner would cut first at seventy percent funding.",
        weak:
          "Capital costs only. No run cost, no cross-team burden, no answer to a partial funding scenario — which is the scenario that actually happens.",
      },
    ],
    awards: ["strong-board-voice", "safe-acceptance-owned"],
    mode: "motus",
  },
  {
    id: "px-vdp-operation",
    title: "Run a Front Door",
    domain: "Security Governance",
    statement: "If a finder cannot reach you in five minutes, your first notification will be from someone else.",
    difficulty: 2,
    weeks: 4,
    brief:
      "Establish a vulnerability disclosure programme for a real project and then operate it end to end through at least one genuine report. Publish a security.txt, write a policy that states scope, safe harbour, and expected response times, build the intake path, and then handle what arrives. The operational skill is triage under ambiguity — most inbound reports are duplicates, out-of-scope automated scanner output, or misunderstandings, and a small number are real, and the tone you use with the first group determines whether the second group ever writes to you. You will also handle the awkward part: negotiating a disclosure timeline with a finder who wants to publish sooner than you can fix, and holding the line without threats.",
    deliverables: [
      "A published policy covering scope, out-of-scope, safe harbour language, expected acknowledgement and resolution times, and coordinated disclosure expectations",
      "A security.txt served at the well-known path with a valid contact and expiry, plus a monitored intake channel",
      "A triage runbook with severity criteria and a defined path for reports that arrive outside the official channel",
      "At least one report handled end to end — acknowledgement, triage, decision, fix or explicit accept, and finder notification",
      "A published advisory or changelog entry for any real issue fixed, crediting the finder as they prefer",
      "A metrics record: reports received, valid rate, time to acknowledge, time to resolve",
    ],
    evidence: [
      "Live URL to the published policy and the security.txt",
      "Redacted correspondence from one full report lifecycle",
      "The published advisory or changelog entry",
      "The metrics record with real counts",
    ],
    rubric: [
      {
        dimension: "Policy usability",
        strong:
          "A researcher can read the policy in two minutes and know what is in scope, what they are protected for, and when they will hear back. Safe harbour is unambiguous rather than conditional on the project's later goodwill.",
        weak:
          "Policy is a legal notice full of prohibitions. Safe harbour absent or discretionary, which deters exactly the good-faith finders it was meant to attract.",
      },
      {
        dimension: "Triage under noise",
        strong:
          "Scanner output and duplicates are closed quickly, courteously, and with a reason. The learner can articulate the signals that distinguish a real finding from a template report in under a minute.",
        weak:
          "Everything treated identically. Either all reports get deep analysis, which does not scale, or all get a form rejection, which loses the real one.",
      },
      {
        dimension: "Timeline conduct",
        strong:
          "Timelines are agreed rather than imposed, updates are proactive when a fix slips, and the learner never used legal pressure. Credit is given as the finder requested.",
        weak:
          "Silence between acknowledgement and fix, timelines extended unilaterally, or an implied threat when the finder pressed. Both parties leave worse than they started.",
      },
    ],
    awards: ["strong-vdp-operator", "safe-disclosure-conduct"],
    mode: "novus",
  },
  {
    id: "px-model-weight-gap",
    title: "Weights Under Guard",
    domain: "AI Security",
    statement: "A model you can copy in an afternoon is a model you do not control.",
    difficulty: 4,
    weeks: 4,
    brief:
      "Take a self-hosted model deployment you actually run — inference server, fine-tuning setup, adapter weights, whatever you have — and assess it against the RAND framework for securing AI model weights, which enumerates thirty-eight distinct attack vectors and defines five progressive security levels from opportunistic attackers up to the most capable state operations. You are not building SL5 on a laptop, and claiming otherwise would be the failure mode. You are doing the honest work: determining which level your deployment actually sits at, identifying the two vectors that offer the largest reduction for your effort, and closing them with evidence. The transferable insight is that weight exfiltration is usually not a novel AI attack — it is credential theft, an over-permissioned storage bucket, an insider with legitimate access, or a backup nobody encrypted.",
    deliverables: [
      "A weight lifecycle map: every location weights exist at rest, in transit, and in memory, including checkpoints, backups, caches, and developer machines",
      "An access inventory of every human and service principal that can read the weights, with the path each would use",
      "An assessment against the RAND security levels stating which level the deployment meets and what specifically prevents the next one",
      "Two closed gaps with before-and-after evidence, chosen for the largest reduction per unit of effort",
      "A detection capability for bulk egress of weight-sized objects, with the specific signal and threshold named",
      "An extraction-by-query note assessing whether the served interface leaks enough to reconstruct capability, and what rate or output limits apply",
    ],
    evidence: [
      "The lifecycle map and access inventory",
      "The level assessment with the specific blocking control identified for the next level",
      "Configuration diffs and verification output for the two closed gaps",
      "A test showing the egress detection firing on a simulated bulk transfer",
    ],
    rubric: [
      {
        dimension: "Lifecycle completeness",
        strong:
          "The map includes the copies people forget — training checkpoints, object storage versioning, a backup snapshot, a colleague's laptop, a debugging container image — and each has an owner and a disposition.",
        weak:
          "Only the production serving path considered. The actual easiest theft path, an old checkpoint in a bucket with broad read access, is not in the document.",
      },
      {
        dimension: "Level honesty",
        strong:
          "The claimed level is conservative and justified by specific controls, with the blocking control for the next level named precisely. No aspiration presented as posture.",
        weak:
          "A high level claimed because encryption at rest is enabled. The framework is used as a badge rather than as an assessment.",
      },
      {
        dimension: "Prioritisation",
        strong:
          "The two closed gaps are defended as the highest reduction per unit of effort, with the reasoning visible, and both are verified rather than declared.",
        weak:
          "Gaps chosen because they were easy or interesting. No comparison against what was left open, and no verification the change took effect.",
      },
      {
        dimension: "Detection realism",
        strong:
          "The egress signal is specific — volume, destination, principal, object size — with a threshold justified against normal behaviour, and it was tested with a simulated transfer.",
        weak:
          "Detection described as monitoring cloud logs. No threshold, no test, so the alert would fire on everything or on nothing.",
      },
    ],
    awards: ["strong-weights-guarded", "safe-level-honest"],
    mode: "motus",
  },
  {
    id: "px-rag-poisoning-lab",
    title: "Poison the Well",
    domain: "AI Security",
    statement: "In a retrieval system, whoever controls the corpus controls the answer.",
    difficulty: 4,
    weeks: 4,
    brief:
      "Build a retrieval-augmented generation system over a corpus that accepts contributions, poison it several ways, then build and measure the defences. The OWASP 2025 list names both LLM04 Data and Model Poisoning and LLM08 Vector and Embedding Weaknesses, and this project puts you inside both. Your attacks should include a document engineered to rank highly for a target query and then assert something false, an indirect prompt injection embedded in retrieved content that manipulates the generating model, and a cross-tenant retrieval leak if your system has any notion of separation. The measurement discipline is what makes this a real project: build a query set with known-correct answers first, so poisoning success and defence effectiveness are numbers rather than anecdotes.",
    deliverables: [
      "A working RAG system with a documented ingestion path, chunking strategy, and retrieval configuration",
      "A benchmark query set with ground-truth answers, established before any attack",
      "Three or more poisoning attacks with measured success rates — at minimum a retrieval-ranking attack and an injection carried through retrieved content",
      "A provenance model attaching source, contributor, and ingestion time to every chunk, surfaced in the generated answer",
      "Defences implemented and measured: ingestion controls, retrieval-time filtering, and output handling, with the effect of each isolated",
      "A tenant or trust separation test proving retrieval cannot cross the boundary, if applicable to your design",
    ],
    evidence: [
      "Repository with the system, the attacks, and the benchmark harness",
      "Attack success rate table before and after defences, per attack",
      "A recorded demonstration of the retrieval-ranking attack changing an answer",
      "A short analysis of which defence gave the most reduction per unit of complexity",
    ],
    rubric: [
      {
        dimension: "Attack sophistication",
        strong:
          "Poisoned documents are crafted against the actual embedding and ranking behaviour, achieving high retrieval rank for target queries without being obviously anomalous to a human reader.",
        weak:
          "Attacks consist of documents containing the word ignore. They succeed only because no defence exists and would fail against any filter, teaching nothing about the real risk.",
      },
      {
        dimension: "Measurement design",
        strong:
          "Ground truth established before attacking, defences measured independently so their individual contributions are visible, and the learner reports a defence that did not help.",
        weak:
          "Success judged by eyeballing outputs. All defences applied at once, so the learner cannot say which one mattered or whether any did.",
      },
      {
        dimension: "Provenance handling",
        strong:
          "Every chunk carries source and contributor metadata through retrieval to the answer, so a poisoned response is traceable to its origin and the corpus can be repaired rather than rebuilt.",
        weak:
          "Chunks are text without lineage. A discovered poisoning cannot be traced, and the only remediation is to rebuild the index and hope.",
      },
      {
        dimension: "Boundary enforcement",
        strong:
          "Access control is enforced at retrieval against the requesting identity, and there is a test proving a query cannot surface another tenant's content even when semantically closest.",
        weak:
          "Filtering applied after retrieval or in the prompt, so the sensitive content is loaded before it is excluded and a single instruction-following failure exposes it.",
      },
    ],
    awards: ["strong-corpus-defender", "safe-provenance-tracked"],
    mode: "motus",
  },
  {
    id: "px-injection-eval-harness",
    title: "The Injection Benchmark",
    domain: "AI Security",
    statement: "A defence you cannot regression-test will quietly stop working.",
    difficulty: 4,
    weeks: 4,
    brief:
      "Build a reusable evaluation harness for indirect prompt injection against an agentic system, publish it, and run it against your own defences over time. LLM01 Prompt Injection has held the top position across editions of the OWASP LLM Top 10, and the reason it stays unsolved is structural: the model receives instructions and data on the same channel, so any defence is probabilistic. That changes what good engineering looks like. You cannot claim it is fixed; you can build the instrument that tells you when it gets worse, and you can wire that instrument into every model upgrade and prompt change. Your harness needs a taxonomy of injection vectors, deterministic scoring against observable outcomes rather than model self-report, and a versioned result history so drift is visible.",
    deliverables: [
      "An injection corpus organised by vector — delivery channel, obfuscation method, and target capability — with each case documented",
      "A target harness that runs cases against a configurable system and records the tool calls attempted, not just the text output",
      "A deterministic scoring function keyed to observable outcomes, with the rate of ambiguous cases reported honestly",
      "A benign control set that measures over-refusal, so the security number cannot be improved by breaking the system",
      "A results history across at least two model versions or two defence configurations, with the delta analysed",
      "A written statement of what the harness cannot measure and why a passing score is not a safety claim",
    ],
    evidence: [
      "Public repository with the corpus, harness, and scoring code",
      "Results tables across configurations with attack success and over-refusal side by side",
      "The scoring function with a worked example of an ambiguous case and how it was resolved",
      "A short note on the injection that worked and that you did not expect to",
    ],
    rubric: [
      {
        dimension: "Corpus coverage",
        strong:
          "Cases span delivery channels and obfuscation methods systematically, with a taxonomy that makes coverage gaps visible. New cases can be added without breaking the structure.",
        weak:
          "A flat list of injection strings collected from social media. Overweighted on one style, so a defence tuned to that style scores well and fails on everything else.",
      },
      {
        dimension: "Scoring integrity",
        strong:
          "Scoring keys on observable side effects — the tool call, the exfiltrated string, the file written — and is deterministic. Ambiguous cases are counted and reported rather than silently resolved.",
        weak:
          "A model judges whether the attack succeeded, with no validation of the judge. The benchmark inherits the failure mode it is testing for.",
      },
      {
        dimension: "Utility control",
        strong:
          "The benign set is realistic and reported alongside the security number, so a defence that refuses everything is visibly a failure.",
        weak:
          "Security measured alone. The best-scoring configuration is the least useful one and the harness cannot tell.",
      },
      {
        dimension: "Epistemic framing",
        strong:
          "The write-up states that the harness measures known vectors against a specific configuration and makes no claim about unknown ones, and it is wired into a change process so it runs on upgrade.",
        weak:
          "A pass rate is presented as evidence the system is secure against prompt injection. The instrument is treated as a verdict.",
      },
    ],
    awards: ["strong-eval-harness", "safe-overrefusal-measured"],
    mode: "motus",
  },
  {
    id: "px-validator-node-ops",
    title: "Run the Node",
    domain: "Decentralized Infrastructure",
    statement: "In permissionless systems, availability is a security property and downtime is a slashing event.",
    difficulty: 4,
    weeks: 6,
    brief:
      "Operate a validator or full node for a public network for at least six weeks, on testnet if mainnet stake is out of reach, with genuine operational security and a published runbook. This is where security engineering and site reliability stop being separate disciplines: your signing key must be isolated from the network-exposed process, your monitoring must catch a stall before the network penalises you, your upgrade process must survive a consensus-breaking release on short notice, and any failover design must make double-signing structurally impossible rather than merely unlikely, because in many networks equivocation is punished far more harshly than being offline. You will have at least one real incident in six weeks. That incident, and your postmortem of it, is the centrepiece of the deliverable.",
    deliverables: [
      "A deployed node with a documented architecture separating the signing key from the public-facing process",
      "A monitoring and alerting setup covering liveness, peer health, disk and memory headroom, and missed duties, with thresholds justified",
      "An upgrade runbook including the emergency-release case and a tested rollback",
      "A key management design for the validator identity, including the anti-double-signing mechanism and what happens during failover",
      "A published operations runbook another operator could follow without speaking to you",
      "A postmortem of at least one real incident with timeline, contributing causes, and completed corrective actions",
      "A six-week performance record with uptime, missed duties, and any penalties incurred",
    ],
    evidence: [
      "Public node or validator address with observable history",
      "The published runbook",
      "Monitoring dashboard screenshots or exported metrics covering the full period",
      "The incident postmortem",
      "The performance record with raw figures including the bad days",
    ],
    rubric: [
      {
        dimension: "Key isolation",
        strong:
          "The signing key is unreachable from the internet-facing process, held in a remote signer or hardware boundary, and the learner can state exactly what an attacker who fully compromises the node process can and cannot do.",
        weak:
          "The key sits in a file next to the node binary on a host with an open peer-to-peer port. Compromise of the process is compromise of the identity.",
      },
      {
        dimension: "Equivocation safety",
        strong:
          "Double-signing is prevented by construction — a single authoritative signer, a shared slashing-protection database with correct locking, or an explicit design decision to have no hot standby at all, with the availability tradeoff stated.",
        weak:
          "A hot standby configured for failover with no mutual exclusion. The design converts a downtime incident into a slashing incident, which is strictly worse.",
      },
      {
        dimension: "Operational discipline",
        strong:
          "Alerts fire before penalties, thresholds are justified against the network's actual tolerance, and the runbook has been followed by the learner under pressure at least once.",
        weak:
          "Monitoring exists but nothing pages. Problems discovered by checking a dashboard occasionally, which means every incident runs to its full duration.",
      },
      {
        dimension: "Postmortem quality",
        strong:
          "The postmortem finds contributing causes across technology and process, states what was believed at the time versus what was true, and closes corrective actions with evidence.",
        weak:
          "Root cause is stated as a single technical fault with a fix applied. No examination of why detection was slow or why the runbook did not cover it.",
      },
    ],
    awards: ["strong-node-operator", "safe-no-equivocation", "safe-blameless-review"],
    mode: "motus",
  },
  {
    id: "px-crisis-simulation-exec",
    title: "The Room Where It Goes Wrong",
    domain: "Crisis Leadership",
    statement: "The decision is never technical by the time it reaches the room that has to make it.",
    difficulty: 3,
    weeks: 3,
    brief:
      "Design and facilitate a crisis simulation for non-technical decision-makers around an incident with no clean answer — a ransomware event with encrypted backups, a data exposure discovered by a journalist, an insider case involving a senior person. The technical facts should be settled early so the exercise spends its time where real crises spend theirs: on disclosure timing, on what can be said publicly while facts are still moving, on regulatory clocks, on whether to pay, and on who has authority to decide when the person who normally decides is unreachable. You are the facilitator, not a participant, and facilitation is the skill being graded. The most common failure is a simulation designed to demonstrate that the security team was right, which teaches the participants nothing and costs you their trust.",
    deliverables: [
      "A scenario package with a timeline, injects tied to clock time, and the specific decisions each inject forces",
      "A participant brief that gives roles genuine authority and genuine incentive conflict",
      "A facilitation plan including how to handle a stalled room, a dominant participant, and a group that solves it too fast",
      "A decision log captured live, recording what was decided, by whom, on what information, and what was assumed",
      "A hot debrief immediately after and a written after-action report within a week",
      "An action register with named owners and dates, plus evidence at least one action was completed",
    ],
    evidence: [
      "The scenario package as delivered",
      "The live decision log",
      "The after-action report",
      "Participant feedback, including any criticism of the exercise itself",
      "Evidence of one completed action",
    ],
    rubric: [
      {
        dimension: "Dilemma quality",
        strong:
          "Every major decision has a defensible case on both sides with real costs either way. Participants disagree along genuine role lines rather than along who knows the most about computers.",
        weak:
          "One obviously correct answer per inject. The exercise is a quiz, participants learn to guess what the facilitator wants, and nothing about real decision-making is practised.",
      },
      {
        dimension: "Facilitation",
        strong:
          "The facilitator held the clock, injected pressure when the room settled prematurely, surfaced the quiet participant, and never rescued the room from a decision it needed to own.",
        weak:
          "The facilitator answered questions, corrected participants, and steered toward the prepared conclusion. The room performed rather than decided.",
      },
      {
        dimension: "Authority mapping",
        strong:
          "The exercise exposed a real gap — an undefined decision right, an unreachable approver, an unclear legal trigger — and the gap became an owned action item.",
        weak:
          "Authority questions avoided by assuming everyone is available and agreeable. The exercise validated a plan that has never been tested against absence.",
      },
      {
        dimension: "Follow-through",
        strong:
          "The after-action report was delivered quickly enough to matter, actions have owners and dates, and at least one is demonstrably closed.",
        weak:
          "A report circulated weeks later with recommendations addressed to nobody. The organisation is exactly where it was, minus a day.",
      },
    ],
    awards: ["strong-facilitator", "safe-authority-mapped"],
    mode: "both",
  },
  {
    id: "px-hardening-paved-road",
    title: "Pave the Road",
    domain: "Application Security",
    statement: "Make the secure path the shortest path, or lose to convenience every single time.",
    difficulty: 3,
    weeks: 4,
    brief:
      "Build a paved road for a real class of work — a service template, a project scaffold, a reusable deployment module — that makes a specific set of security properties automatic, and prove adoption by getting at least two real projects onto it. The insight this project teaches is that policy documents lose to friction reliably and permanently, while a template that saves an engineer an afternoon gets adopted without an argument. Your road should carry a defined set of guarantees: authentication wired correctly, secrets from a manager rather than a file, dependency and container scanning present, logging shaped so an investigator can use it, sane defaults on transport and headers. The graded difficulty is not building it. It is keeping it current, and designing the escape hatch so teams with a legitimate reason to deviate leave a record rather than quietly forking.",
    deliverables: [
      "The template or module with the security properties it guarantees stated explicitly, including what it does not cover",
      "A verification test suite that fails when a guarantee is broken, runnable in the consuming project's own CI",
      "Documentation written for a developer in a hurry — copy-paste start, five-minute path to a running service",
      "Two real projects adopted, with the adoption effort measured in actual time",
      "A deviation process: how a project opts out of a guarantee, who reviews it, and where the record lives",
      "A maintenance plan covering dependency updates and how consuming projects learn a new version exists",
    ],
    evidence: [
      "Public repository with the template and its test suite",
      "Links to two adopting projects with commit evidence",
      "Test suite output demonstrating a broken guarantee being caught",
      "A written account of the friction the first adopter hit and what you changed",
    ],
    rubric: [
      {
        dimension: "Guarantee precision",
        strong:
          "Each guarantee is testable and tested. The learner is explicit about what remains the application's responsibility, so nobody inherits false confidence.",
        weak:
          "Guarantees phrased as follows best practices. Untestable, so drift is invisible and adopters assume coverage they do not have.",
      },
      {
        dimension: "Friction reduction",
        strong:
          "Adoption measurably saves the developer time versus building from scratch. The learner measured the first adoption and removed the worst step.",
        weak:
          "The road adds steps and is sold on the grounds that security requires it. Adoption happens only under mandate and reverts the moment attention moves.",
      },
      {
        dimension: "Deviation handling",
        strong:
          "There is a real, low-friction escape hatch with a review and a record, so teams deviate visibly rather than forking silently. At least one deviation has been processed.",
        weak:
          "No opt-out. Teams that cannot comply copy the template and edit it, and the security team loses visibility of exactly the projects with unusual requirements.",
      },
      {
        dimension: "Sustainability",
        strong:
          "A stated update cadence, a version notification path, and evidence that at least one update propagated to an adopter.",
        weak:
          "Shipped once. Dependencies go stale, the road becomes a liability, and consuming projects inherit vulnerabilities from the thing that was meant to protect them.",
      },
    ],
    awards: ["strong-road-paved", "safe-guarantees-tested"],
    mode: "novus",
  },
  {
    id: "px-verifiable-evidence-chain",
    title: "Evidence That Verifies Itself",
    domain: "Trust Graph",
    statement: "Make your claims falsifiable before someone else does it for you.",
    difficulty: 3,
    weeks: 4,
    brief:
      "Build the verifiable evidence layer for your own Praxis Profile: sign every artifact you have produced, publish the signatures and their timestamps in a way a stranger can check, and structure your claims so that each one names the specific evidence that would disprove it. This is the capstone of the trust-graph track and it is also the most self-interested project here, because a portfolio of unverifiable claims is worth exactly what any other set of unverifiable claims is worth. Borrow the structure that update systems already solved: The Update Framework separates root, targets, snapshot, and timestamp roles precisely so that a compromised online key cannot rewrite history, and it defends against rollback, freeze, and mix-and-match attacks — the same three attacks that apply to a résumé. Publish attestations to a public graph where third parties can dispute them, and treat a dispute as a feature.",
    deliverables: [
      "A signing setup with an offline root and an online signing key, with the delegation documented and the rotation path defined",
      "Signed manifests for your evidence artifacts, each binding a content hash to a claim and a date",
      "A verification tool or documented procedure a stranger can run to check any single claim end to end",
      "A claim structure where each claim names its disconfirming evidence — what would show it to be false",
      "Attestations published to a public trust graph, with conflicts of interest disclosed for any claim involving a party you are connected to",
      "A rollback and freeze analysis: how someone would detect if you silently removed a claim or stopped updating",
    ],
    evidence: [
      "Published public key with a documented provenance",
      "The signed manifest set with resolvable hashes",
      "A recorded verification run performed by someone other than you",
      "Graph references or transaction hashes for the published attestations",
      "The disconfirming-evidence column of your claim table, filled in",
    ],
    rubric: [
      {
        dimension: "Key hygiene",
        strong:
          "Root key is offline and separate from the routine signing key, delegation is explicit, and rotation is documented, so a compromise of the everyday key does not let an attacker rewrite the history of claims.",
        weak:
          "One key, on the laptop, used for everything. Compromise of that key means an attacker can retroactively author any claim, which makes the entire chain worthless.",
      },
      {
        dimension: "Falsifiability",
        strong:
          "Every claim names the observation that would disprove it, and at least one claim in the set is genuinely risky — it could have gone the other way.",
        weak:
          "Claims phrased so nothing could contradict them: participated in, gained exposure to, familiar with. The structure is verifiable and the content is not checkable.",
      },
      {
        dimension: "Third-party verifiability",
        strong:
          "Someone with no relationship to the learner ran the verification procedure successfully and could detect a substituted artifact.",
        weak:
          "Verification depends on trusting the learner's own site or a signature nobody outside can resolve to a known key. The chain proves internal consistency only.",
      },
      {
        dimension: "History integrity",
        strong:
          "The design addresses silent removal and staleness — a monotonic index, periodic timestamping, or a public log — so a reader can tell whether they are seeing the whole set and a current one.",
        weak:
          "Claims can be removed or edited without trace. Rollback and freeze are unaddressed, so the record shows only what the author currently wants shown.",
      },
    ],
    awards: ["strong-evidence-chain", "safe-falsifiable-claims", "safe-key-hierarchy"],
    mode: "motus",
  },
];
