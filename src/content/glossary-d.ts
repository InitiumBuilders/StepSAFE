import type { Term } from "./schema";

/* Glossary D — the terms the curriculum names but the first three files never
   defined. Written against the Step that introduces each one, so the definition
   matches the use. Mechanism first: what the thing does, how it fails, and why
   a security leader has to hold it. No statistic appears here that was not
   published; where a number would be needed to make a point, the claim is
   qualitative instead. */

export const TERMS: Term[] = [
  /* ---------- AI security ---------- */
  {
    id: "compartmentalisation",
    term: "Compartmentalisation",
    domain: "AI security",
    short: "Splitting access so that no single compromise reaches everything worth taking.",
    long: "Compartmentalisation divides a system into zones with distinct credentials, distinct trust assumptions and enforced boundaries between them, so that an adversary who defeats one zone inherits only that zone. In frontier-model environments the canonical compartments are training infrastructure, weight storage, inference serving and the research environment — each with its own identities and its own egress rules. The design question is never whether compartments exist on a diagram; it is which single credential, network path or human role currently spans them all, because that spanning element is the real perimeter.",
    why: "Every serious model-weight security framework treats compartmentalisation as the control that converts a catastrophic breach into a survivable one. It is also the control most often claimed and least often true: a shared administrative role or a single CI system with access to every zone silently rejoins the compartments you drew.",
    related: ["blast-radius", "lateral-movement", "zero-trust", "standing-credential", "scope-exclusion"],
    mode: "both"
  },
  {
    id: "tipping",
    term: "Tipping",
    domain: "AI security",
    short: "Warning a subject that they are under investigation, usually by accident.",
    long: "Tipping is any action that reveals to a person under investigation that they have been noticed — a sudden permission revocation, an unexplained meeting invite, a manager's changed behaviour, a legal hold notification routed to the wrong inbox. In insider-risk work the investigative sequence is deliberately quiet precisely because a tipped subject destroys evidence, accelerates exfiltration, or moves to channels nobody is watching. The tension is real and permanent: the controls that most reduce ongoing risk are exactly the ones most likely to tip.",
    why: "Insider investigations are the case where good security instincts — revoke fast, contain now — are actively wrong. Knowing when to hold an action, and having a pre-agreed protocol with legal and HR for who decides, is what separates a handled case from one that ends in litigation with no usable evidence.",
    related: ["insider-threat", "evidence-preservation", "legal-hold", "conviction-insider", "quiet-reduction"],
    mode: "motus"
  },

  /* ---------- AppSec and supply chain ---------- */
  {
    id: "imdsv2",
    term: "IMDSv2",
    domain: "AppSec",
    short: "The session-oriented instance metadata service that closes the SSRF-to-credential path.",
    long: "Cloud instances expose a metadata endpoint at a link-local address that returns instance identity and, critically, temporary role credentials. The original version answered any HTTP GET, which meant a server-side request forgery in an application could be pointed at the metadata address and returned working credentials. IMDSv2 requires a PUT to obtain a session token, sets a low IP TTL on responses to prevent them traversing a hop, and demands the token on subsequent requests — so a naive SSRF or an open proxy cannot reach it. Enforcement is a per-instance setting, and an account can run both modes at once.",
    why: "SSRF against instance metadata is one of the most consequential and best-documented cloud attack paths. The control is free and available; the failure is almost always that it is enabled somewhere and merely defaulted elsewhere, so the honest question is never whether you use IMDSv2 but what percentage of running instances actually require it.",
    related: ["imds", "ssrf", "standing-credential", "cloud-metadata", "least-privilege"],
    mode: "both"
  },
  {
    id: "iast",
    term: "IAST",
    domain: "AppSec",
    short: "Interactive application security testing — instrumentation that watches real execution for vulnerable data flow.",
    long: "IAST runs an agent inside the application while functional tests or real traffic exercise it, observing actual data flow from input to sink. Because it sees runtime values and reachable code paths rather than inferring them, it produces far fewer unreachable-code false positives than static analysis and far better coverage attribution than black-box scanning. Its ceiling is exactly its mechanism: it only finds what your tests actually execute, so coverage of the test suite becomes the coverage of the security tool.",
    why: "Choosing between SAST, DAST, IAST and SCA is a question about the class of defect you are trying to catch and the evidence you need, not about vendor category. IAST earns its place where you have real test coverage and need low-noise findings tied to a reproducible path.",
    related: ["sast", "dast", "sca", "false-positive", "secure-sdlc"],
    mode: "both"
  },
  {
    id: "shrinking",
    term: "Shrinking",
    domain: "AppSec",
    short: "Automatically reducing a failing generated input to the smallest case that still fails.",
    long: "Property-based testing generates large random inputs; when one fails, the raw counterexample is usually enormous and unreadable. Shrinking repeatedly simplifies the failing input — removing elements, reducing numbers toward zero, simplifying structure — re-running each candidate and keeping the smallest that still triggers the failure. The result is a minimal reproduction a human can actually reason about, which is the difference between a bug report that gets fixed and one that gets closed as unreproducible.",
    why: "The output of a fuzzing or property-testing campaign is only as valuable as its worst-case debuggability. Shrinking is what converts a machine-found failure into an engineering artifact, and a shrunk counterexample pinned as a regression test is how you make the finding permanent.",
    related: ["property-based-testing", "fuzzing", "invariant", "regression-threshold", "idempotence"],
    mode: "motus"
  },
  {
    id: "idempotence",
    term: "Idempotence",
    domain: "AppSec",
    short: "An operation you can safely apply more than once and get the same result.",
    long: "An idempotent operation produces the same system state whether it runs once or many times. It matters wherever delivery is unreliable and retries are automatic: payment capture, message consumption, provisioning, deprovisioning, and every webhook receiver. The usual implementation is an idempotency key recorded with the outcome, so a repeat of the same logical request returns the original result instead of performing the work again. Systems that lack it do not fail loudly — they double-charge, double-provision, or silently re-grant access that was just revoked.",
    why: "Retry logic is everywhere in distributed systems and almost never security-reviewed. A non-idempotent revocation or provisioning path is a real access-control defect: the second delivery of a stale message can restore exactly the permission an incident responder just removed.",
    related: ["invariant", "replay-attack", "eventual-consistency", "shrinking", "reversibility"],
    mode: "both"
  },

  /* ---------- Blockchain, DAO, treasury ---------- */
  {
    id: "twap",
    term: "TWAP",
    domain: "Chain",
    short: "Time-weighted average price — an oracle design that averages over a window to resist single-block manipulation.",
    long: "A spot price read from an on-chain pool can be moved arbitrarily within one transaction by a large swap, which is why flash-loan price manipulation works against naive oracles. A TWAP averages price across a time window using cumulative price accumulators, so moving the reported value requires holding a manipulated price across many blocks rather than a single atomic transaction — a materially more expensive attack. The tradeoff is lag: the same smoothing that resists manipulation also makes the oracle slow to reflect genuine, rapid price movement, which creates its own risk during real volatility.",
    why: "Oracle design is where a great many on-chain losses actually originate. Understanding that TWAP trades responsiveness for manipulation cost — and that a short window on a thin pool is barely better than spot — is the difference between citing a control and specifying one.",
    related: ["oracle-manipulation", "flash-loan", "price-oracle", "liquidity-depth", "mev"],
    mode: "both"
  },
  {
    id: "foundry",
    term: "Foundry",
    domain: "Chain",
    short: "A Solidity-native toolchain whose tests, fuzzing and invariant runs are written in Solidity itself.",
    long: "Foundry provides a fast EVM test runner where tests are Solidity contracts rather than JavaScript, along with built-in fuzzing, invariant testing, mainnet forking and cheatcodes for manipulating chain state such as balances, block numbers and caller identity. Forking in particular lets an engineer reproduce a live protocol's exact state locally and run adversarial scenarios against real deployed dependencies rather than mocks.",
    why: "Security work on contracts is only as good as the harness. Being able to fork mainnet at the block before an incident and replay it is the single most instructive exercise available for learning how a given exploit actually functioned.",
    related: ["echidna", "invariant", "property-based-testing", "fork-testing", "slither"],
    mode: "both"
  },
  {
    id: "echidna",
    term: "Echidna",
    domain: "Chain",
    short: "A property-based fuzzer for smart contracts that searches for inputs breaking your stated invariants.",
    long: "Echidna takes invariants you assert about a contract — total supply never exceeds a cap, no user can withdraw more than deposited, the pool never becomes insolvent — and generates transaction sequences attempting to falsify them, using coverage guidance to reach deeper states. Its power and its limit are the same thing: it can only break properties you thought to write. An unstated invariant is not tested, and the most damaging contract bugs are frequently violations of an assumption nobody articulated.",
    why: "Invariant testing changes the security question from find the bug to state what must always be true. That reframing is transferable far beyond contracts, and the discipline of writing the invariant is usually where the real design flaw surfaces.",
    related: ["invariant", "foundry", "property-based-testing", "halmos", "shrinking"],
    mode: "motus"
  },
  {
    id: "slither",
    term: "Slither",
    domain: "Chain",
    short: "A static analysis framework for Solidity that detects known vulnerability patterns and prints structural facts.",
    long: "Slither parses contracts into an intermediate representation and runs detectors for recognised issues — reentrancy shapes, uninitialised storage, dangerous delegatecall, shadowed variables — while also emitting inheritance graphs, function summaries and call graphs that are useful for review even when nothing is flagged. It is fast enough to run on every commit, which is where it belongs.",
    why: "Static analysis catches the known and cheap classes so that expensive human review is spent on logic and economics. The trap is treating a clean Slither run as evidence of security when the tool has no opinion at all about whether your business logic is correct.",
    related: ["static-analysis", "reentrancy", "foundry", "halmos", "plausible-empty-rule"],
    mode: "both"
  },
  {
    id: "halmos",
    term: "Halmos",
    domain: "Chain",
    short: "A symbolic execution tool that proves a property holds for all inputs, or returns the counterexample.",
    long: "Where a fuzzer samples concrete inputs, Halmos executes with symbolic values and asks a solver whether any assignment can violate the property. A successful run is a proof over the explored paths rather than an absence of observed failures; an unsuccessful one yields a concrete counterexample. The cost is path explosion — loops and complex state make exhaustive symbolic exploration expensive or infeasible, so it is applied to bounded, high-value properties rather than whole systems.",
    why: "A staged verification workflow that respects cost runs static analysis on every commit, fuzzing nightly, and symbolic or formal methods on the handful of properties whose violation would be unrecoverable. Knowing which tier a property belongs in is the actual engineering judgment.",
    related: ["symbolic-execution", "formal-verification", "certora", "echidna", "invariant"],
    mode: "motus"
  },
  {
    id: "certora",
    term: "Certora",
    domain: "Chain",
    short: "A commercial formal verification platform where rules are written in a dedicated specification language.",
    long: "Certora's prover checks contract bytecode against rules expressed in its specification language, attempting to prove that stated properties hold under all reachable states or producing a counterexample trace. It is typically applied to the small set of properties whose violation would be catastrophic and unrecoverable — solvency, access control, supply conservation — because specification and proof effort is substantial and ongoing as the code changes.",
    why: "Formal verification is not a stronger version of testing; it is a different claim, bounded strictly by the specification you wrote. A proof of the wrong property is worth nothing, and the specification review is therefore the security-critical artifact.",
    related: ["formal-verification", "halmos", "invariant", "specification", "symbolic-execution"],
    mode: "motus"
  },
  {
    id: "superblock",
    term: "Superblock",
    domain: "Chain",
    short: "A periodic block that pays approved treasury proposals in a single settlement.",
    long: "In treasury systems that fund development through on-chain governance, budget proposals are voted on by the network's stakeholding operators and the approved set is paid out together at a fixed cadence in a designated block. The design concentrates both the value and the decision into a predictable moment, which is precisely what makes the social layer — who proposes, who campaigns, who actually votes, and who quietly abstains — the real attack surface rather than the cryptography.",
    why: "Treasury attacks in practice are rarely technical. They are proposals that look reasonable, arrive when attention is elsewhere, and pass on low turnout. Understanding the settlement cadence tells you exactly when scrutiny must peak.",
    related: ["governance-attack", "treasury-risk", "voter-apathy", "proposal-review", "progressive-decentralization"],
    mode: "both"
  },

  /* ---------- Leadership, insurance, program ---------- */
  {
    id: "toil",
    term: "Toil",
    domain: "Leadership",
    short: "Manual, repetitive, automatable work that scales linearly with the service and produces no lasting value.",
    long: "Toil is operational work that is manual, repetitive, tactical, devoid of enduring value, and grows in direct proportion to the size of the system. It is distinguished from overhead (meetings, admin) and from engineering (work that leaves a durable artifact behind). Measuring the fraction of a team's time consumed by toil, and capping it deliberately, is what prevents a team from becoming a permanent human API for its own tooling.",
    why: "Naming toil as a measured quantity converts a morale complaint into a budget argument. A security team spending most of its capacity on ticket triage and access requests is not under-resourced in headcount; it is under-invested in automation, and those are different asks with different answers.",
    related: ["automation", "alert-fatigue", "operational-load", "partnership-squad", "burnout"],
    mode: "both"
  },
  {
    id: "partnership-squad",
    term: "Partnership Squad",
    domain: "Leadership",
    short: "A security platform model where engineers embed with product teams instead of reviewing them from outside.",
    long: "Rather than operating as a review gate that product teams must pass, a partnership model assigns security engineers to work inside product groups — building paved paths, writing the secure default, and carrying some of the delivery burden themselves. Its health is measured by adoption of the paved path, time to unblock, defect escape rate and partner satisfaction, not by counts of findings raised. The failure mode is capture: an embedded engineer who stops representing the security function and becomes an extra pair of product hands.",
    why: "A security team that only says no accumulates exactly the political capital it deserves. Structuring the team so its default output is a usable path rather than a finding is the single highest-leverage organisational change most programs can make.",
    related: ["paved-road", "friction-designer", "toil", "security-champion", "adoption-metric"],
    mode: "motus"
  },
  {
    id: "misprision",
    term: "Misprision",
    domain: "Leadership",
    short: "The offence of concealing knowledge of a crime from the authorities.",
    long: "Misprision refers to knowing that a serious offence has occurred and taking affirmative steps to conceal it rather than disclosing it. For a security leader the relevant shape is specific and modern: discovering conduct that is plausibly criminal — fraud, unauthorised access, obstruction — and then participating in a decision to bury it. Ordinary silence and active concealment are legally very different things, and the distinction is exactly what a security executive under pressure needs counsel on before, not after.",
    why: "Security leaders sit closer to evidence of wrongdoing than almost any other executive. Understanding where personal legal exposure begins, and having independent counsel identified before you need them, is a professional survival control rather than a legal curiosity.",
    related: ["advancement-of-fees", "spoliation", "legal-hold", "personal-liability", "whistleblower-protection"],
    mode: "motus"
  },
  {
    id: "advancement-of-fees",
    term: "Advancement of Fees",
    domain: "Leadership",
    short: "A contractual commitment that legal costs are paid as they are incurred, not reimbursed at the end.",
    long: "Indemnification promises that a company will cover an officer's legal costs; advancement determines the timing — whether those costs are paid contemporaneously as the matter proceeds or only reimbursed after resolution, and on what conditions the company can refuse or claw them back. A defence that costs more than the individual can carry is not a defence at all if payment arrives years later, and the company's interests may diverge from the officer's precisely when the matter becomes serious.",
    why: "This is the conversation to have at hire, in writing, when you have leverage — not during an investigation when you do not. Security leaders now face personal regulatory exposure in ways that were rare a decade ago, and the paperwork is the control.",
    related: ["misprision", "personal-liability", "do-insurance", "indemnification", "board-translation"],
    mode: "motus"
  },

  /* ---------- Dash EVO ---------- */
  {
    id: "clsig",
    term: "ChainLock Signature (clsig)",
    domain: "EVO",
    short: "A quorum signature over a block that makes chain reorganisation beyond that point infeasible.",
    long: "A rotating quorum of masternodes signs the first-seen valid block at a height, producing a threshold signature that participating nodes then treat as decisive: competing chains that do not include the signed block are rejected. This converts probabilistic settlement, which strengthens gradually with confirmations, into a near-immediate finality claim — but a claim whose strength rests on the quorum's honesty and liveness rather than on accumulated work.",
    why: "Finality is a claim with a signer. Any operator accepting value on the basis of ChainLocks is inheriting an assumption about quorum composition and threshold, and stating that assumption explicitly in a risk register is the difference between engineering and faith.",
    related: ["finality", "quorum", "threshold-signature", "reorg", "nakamoto-coefficient"],
    mode: "both"
  },
  {
    id: "tenderdash",
    term: "Tenderdash",
    domain: "EVO",
    short: "The BFT consensus engine underlying Dash Platform, derived from Tendermint with quorum threshold signing.",
    long: "Tenderdash provides Byzantine fault tolerant consensus for the platform chain, ordering state transitions and producing committed blocks with threshold signatures from the active validator quorum. Like other BFT designs in its lineage it favours consistency over availability: if the quorum cannot reach the required threshold, the chain halts rather than forking. That is a deliberate, inherited promise with direct operational consequences.",
    why: "Preferring consistency is a promise you inherit. An operator running on a BFT chain must plan for the halt case — how it is detected, who is authorised to communicate about it, and what the dependent services do while the chain is not producing — because the design guarantees that failure mode rather than avoiding it.",
    related: ["bft-consensus", "apphash", "quorum", "liveness", "finality"],
    mode: "motus"
  },
  {
    id: "apphash",
    term: "AppHash",
    domain: "EVO",
    short: "A commitment to application state after a block, used to detect divergence between nodes.",
    long: "After executing a block's transactions, each node computes a hash committing to the resulting application state and includes it in consensus. Nodes that compute a different value have diverged — through a software version difference, non-determinism, or corruption — and the disagreement surfaces immediately rather than silently. In a consistency-preferring chain this typically manifests as a halt, which is the intended behaviour: stopping is safer than proceeding with two versions of reality.",
    why: "An apphash mismatch is one of the few alerts where the correct first action is to stop and compare binaries rather than to restart the service. Recognising it prevents an operator from restarting their way through a genuine state divergence.",
    related: ["tenderdash", "state-commitment", "determinism", "grovedb", "bft-consensus"],
    mode: "motus"
  },
  {
    id: "dapi",
    term: "DAPI",
    domain: "EVO",
    short: "The decentralized API layer that clients use to reach Platform, with proofs rather than trust.",
    long: "DAPI is the client-facing interface exposed by evonodes for querying platform state and broadcasting state transitions. Its security property is not that any particular node is trustworthy but that responses can be accompanied by cryptographic proofs a client verifies locally against a signed state commitment — so a dishonest or compromised endpoint is detectable rather than merely unlikely.",
    why: "Verification is the product of decentralization. A client that requests proofs and does not check them has all the operational cost of a decentralized system and the trust model of a single API provider, which is the worst available combination.",
    related: ["grovedb", "proof-verification", "light-client", "apphash", "state-commitment"],
    mode: "both"
  },
  {
    id: "grovedb",
    term: "GroveDB",
    domain: "EVO",
    short: "The authenticated data structure backing Platform state, designed to produce proofs for queries.",
    long: "GroveDB is a hierarchical authenticated database combining Merkle structures so that query results — including range and secondary-index queries, not just single-key lookups — can be returned with proofs verifiable against a single root commitment. That capability is what allows a light client to accept an answer from an untrusted node while still detecting omission or fabrication.",
    why: "The difference between a system that can prove a query result and one that cannot determines whether decentralization delivers any security benefit to end users at all. Proof-carrying queries are the mechanism that makes the claim real.",
    related: ["dapi", "merkle-proof", "authenticated-data-structure", "apphash", "proof-verification"],
    mode: "motus"
  },
  {
    id: "nakamoto-coefficient",
    term: "Nakamoto Coefficient",
    domain: "EVO",
    short: "The smallest number of independent entities that could collude to compromise a subsystem.",
    long: "The coefficient counts the minimum entities needed to control a threshold of some critical resource — validator stake, hash rate, client implementations, hosting providers, geographic jurisdictions. It is computed per subsystem, and the honest reading is the minimum across all of them, because an adversary attacks the weakest dimension. A network with thousands of validators concentrated in two hosting providers has a hosting coefficient of two regardless of validator count.",
    why: "Decentralized means nothing until you name what all the parts still share. The coefficient forces that naming, and it very often reveals that the real concentration is in infrastructure, tooling or client software rather than in the token distribution everyone reports.",
    related: ["decentralization-metric", "correlated-loss", "client-diversity", "quorum"],
    mode: "both"
  },
  {
    id: "duff",
    term: "Duff",
    domain: "EVO",
    short: "The smallest denomination unit used in Dash amounts.",
    long: "Amounts are represented in integer base units rather than decimal currency values, avoiding floating-point error in financial arithmetic. Getting the unit conversion wrong at a system boundary — an API returning base units where a caller expects whole coins, or the reverse — produces off-by-many-orders-of-magnitude errors that are trivially avoidable and historically expensive.",
    why: "Custody is the product. Unit confusion at an integration boundary is a recurring source of real loss, and the control is boring: represent value in base units everywhere internally and convert only at presentation.",
    related: ["integer-arithmetic", "unit-confusion", "custody", "transaction-construction", "credits"],
    mode: "novus"
  },
  {
    id: "chainassetlockproof",
    term: "ChainAssetLockProof",
    domain: "EVO",
    short: "Evidence that value was locked on the core chain, used to fund a platform identity.",
    long: "Funding a platform identity requires proving that a corresponding amount was locked in a special transaction on the core chain. The proof references that transaction's outpoint and the chain state confirming it, and it is consumed by a platform state transition signed with the one-time key designated in the lock. Because that key is bearer authority over the locked value, it must be persisted durably at the moment it is generated — before it is used — or an interruption between broadcast and use strands the funds.",
    why: "Bearer authority must be persisted before it is used. This is the general lesson: any secret that alone controls value has to be written down durably at creation time, because the window between generation and successful use is where operational loss actually happens.",
    related: ["one-time-key", "bearer-instrument", "identity-topup", "custody", "duff"],
    mode: "motus"
  },
  {
    id: "proregtx",
    term: "ProRegTx",
    domain: "EVO",
    short: "The provider registration transaction that enrols a masternode and declares its key roles.",
    long: "A registration transaction records the collateral, the operator's BLS public key, the voting key and the payout address, establishing distinct roles that can be held by different parties. Separating owner, operator and voting authority is the mechanism that lets an operator run infrastructure without the ability to move collateral, which is the security-relevant property.",
    why: "Role separation encoded in the protocol is stronger than role separation encoded in a policy document. Reading a registration transaction tells you who can actually do what, regardless of what the organisation chart claims.",
    related: ["proupregtx", "role-separation", "bls-signature", "collateral", "masternode"],
    mode: "motus"
  },
  {
    id: "proupregtx",
    term: "ProUpRegTx",
    domain: "EVO",
    short: "The update transaction that rotates a registered node's declared keys or payout address.",
    long: "Registered node attributes are not immutable: an update transaction rotates the operator key, voting key or payout destination, signed by the authority entitled to make that change. This is the rotation path, and its existence is what makes operator key compromise recoverable rather than terminal — provided the owner authority is held separately and remains available.",
    why: "A key that cannot be rotated is a key you will one day be unable to abandon. Verifying that the rotation path works, with the people who hold the authority, before an incident requires it, is the whole point of having it.",
    related: ["proregtx", "key-rotation", "role-separation", "custody", "recovery-path"],
    mode: "motus"
  },
  {
    id: "dashmate",
    term: "Dashmate",
    domain: "EVO",
    short: "The node management tool that provisions and configures a masternode or evonode deployment.",
    long: "Dashmate handles container orchestration, configuration generation and service lifecycle for node operators, producing a reproducible deployment from declared configuration. Its value for security work is that configuration becomes an inspectable artifact rather than accumulated manual state, which is what makes a baseline verifiable by someone other than the person who built it.",
    why: "A baseline is only real if an outsider can verify it. Configuration expressed as a file that can be diffed against a known-good reference is auditable; a node configured by hand over eighteen months is archaeology.",
    related: ["configuration-drift", "reproducible-deployment", "baseline", "tenderdash-rpc", "infrastructure-as-code"],
    mode: "both"
  },
  {
    id: "tenderdash-rpc",
    term: "Tenderdash RPC",
    domain: "EVO",
    short: "The consensus-engine RPC interface exposing node, quorum and sync state.",
    long: "The RPC surface reports block height, sync status, validator set and peer information — the telemetry an operator needs to confirm a node is actually participating rather than merely running. It is also an interface that must not be publicly exposed: administrative and introspection endpoints reachable from the internet convert an information surface into an attack surface.",
    why: "The most common node compromise is not exotic. It is a management or RPC port bound to a public interface because a tutorial said to, and confirming what is actually listening is a five-minute check that belongs in every baseline.",
    related: ["dashmate", "attack-surface", "network-exposure", "baseline", "apphash"],
    mode: "motus"
  },
  {
    id: "embargo",
    term: "Embargo",
    domain: "EVO",
    short: "An agreed period during which a known vulnerability is withheld from public disclosure.",
    long: "During coordinated disclosure, affected parties agree to hold details private while a fix is developed and deployed, with a defined end date. Embargoes fail in characteristic ways: too many participants, no agreed clock, unequal notification giving some operators advance advantage, or a leak that forces disclosure before anyone is ready. In decentralized networks the problem is sharper because there is no single operator to patch and the fix requires voluntary adoption.",
    why: "Deciding who to tell, in what order, and on what clock is one of the genuinely hard judgment calls in this work. Getting it wrong in either direction — telling too many or too few — has produced real harm, and there is no formula that removes the judgment.",
    related: ["coordinated-disclosure", "safe-harbour", "recusal", "patch-adoption"],
    mode: "motus"
  },
  {
    id: "recusal",
    term: "Recusal",
    domain: "EVO",
    short: "Standing aside from a decision in which you hold an interest that could compromise judgment.",
    long: "Recusal is the pre-committed, disclosed practice of removing yourself from decisions where your holdings, relationships or role create a conflict — and it must be defined in advance, because deciding whether to recuse while already in the room is exactly when the conflict distorts the answer. In protocol communities where operators are also token holders and sometimes also the security responders, conflicts are structural rather than exceptional.",
    why: "Write the sentence that must survive both rooms. A recusal policy written while nobody is accusing you of anything is a credibility asset; one improvised under accusation is an admission.",
    related: ["conflict-of-interest", "credible-neutrality", "governance-attack", "embargo", "disclosure-policy"],
    mode: "motus"
  },

  /* ---------- Decentralized infrastructure ---------- */
  {
    id: "permanence",
    term: "Permanence",
    domain: "Decentralized",
    short: "A storage guarantee that data remains retrievable indefinitely, and therefore cannot be withdrawn.",
    long: "Permanence-oriented storage networks take payment once and use an endowment model to fund replication indefinitely, making the data's continued availability a property of the network's economics rather than of any operator's goodwill. The security consequence is symmetric and absolute: the same property that guarantees an audit trail survives also guarantees that anything personal, secret or unlawful written there cannot be removed.",
    why: "The sentence that starts every good design review of permanent storage is: what class of data is allowed to cross this boundary. Answered in advance it is an architecture; answered after an erasure request it is a crisis.",
    related: ["irreversibility", "crypto-shredding", "data-minimisation", "right-to-erasure", "tombstone"],
    mode: "both"
  },
  {
    id: "packing",
    term: "Packing",
    domain: "Decentralized",
    short: "Bundling many small items into larger units to amortise per-item overhead.",
    long: "Storage and settlement systems impose fixed costs per item — headers, proofs, transaction overhead — that dominate when items are small. Packing aggregates many records into a single stored object or bundled transaction, reducing cost per record by orders of magnitude. The tradeoff is granularity: once packed, retrieving or reasoning about a single record may require handling the whole bundle, and access control granularity is lost unless designed in deliberately.",
    why: "The number that reframes the design is cost per record after packing versus before. It frequently turns an architecture that looked economically impossible into a routine one — and it equally frequently destroys the per-record deletion story nobody checked.",
    related: ["permanence", "cost-model", "batching", "granularity", "irreversibility"],
    mode: "motus"
  },
  {
    id: "irreversibility",
    term: "Irreversibility",
    domain: "Decentralized",
    short: "The property that an action, once taken, cannot be undone by anyone including its author.",
    long: "Irreversibility is the defining constraint of settled transactions and permanent storage. It changes the correct engineering posture from detect and remediate to prevent and verify, because there is no remediation step available. Systems that mix reversible and irreversible operations behind a uniform interface are especially dangerous: the user cannot tell which kind of action they are about to take.",
    why: "The interview question that separates levels is what you would do differently if the action could not be undone. The answer reorders every control: verification moves before the act, review becomes mandatory rather than sampled, and the confirmation step earns its friction.",
    related: ["permanence", "reversibility", "two-party-authorization", "blast-radius", "fail-safe-default"],
    mode: "both"
  },
  {
    id: "bitswap",
    term: "Bitswap",
    domain: "Decentralized",
    short: "The block exchange protocol by which IPFS peers request and trade content blocks.",
    long: "Bitswap is how a node asks connected peers for specific content-addressed blocks and serves blocks in return. Because requests broadcast interest in particular content identifiers to peers, the protocol leaks information: an observer with sufficient peer connections can learn which nodes are requesting which content, and requests plus timing can be correlated back to a requesting node.",
    why: "The network layer is not immune either. Teams reason carefully about encrypting content at rest and then leak the far more sensitive fact of who is asking for what, which is frequently the more damaging disclosure.",
    related: ["kubo", "content-addressing", "metadata-leak", "k-anonymity", "reprovide"],
    mode: "motus"
  },
  {
    id: "k-anonymity",
    term: "k-Anonymity",
    domain: "Decentralized",
    short: "A privacy property where any record is indistinguishable from at least k−1 others on identifying attributes.",
    long: "A dataset is k-anonymous when every combination of quasi-identifiers maps to at least k records, so an observer cannot narrow an individual below a group of k. It is a useful baseline and a well-documented insufficient one: it does not prevent attribute disclosure when a group shares a sensitive value, and it degrades badly against an adversary with auxiliary data, which motivated later notions such as l-diversity and differential privacy.",
    why: "Quoting k-anonymity as a privacy guarantee without stating the auxiliary-information assumption is a common and consequential error. It bounds one specific attack, not privacy in general.",
    related: ["re-identification", "pseudonymisation", "differential-privacy", "bitswap", "quasi-identifier"],
    mode: "motus"
  },
  {
    id: "kubo",
    term: "Kubo",
    domain: "Decentralized",
    short: "The reference Go implementation of an IPFS node.",
    long: "Kubo provides the daemon most self-hosted IPFS deployments run: content storage, DHT participation, Bitswap exchange, pinning and a gateway. Operationally the two settings that matter most for security are which APIs are bound to which interfaces, and what the node is pinning — because a pinned set is a statement about what this operator is committed to keep serving.",
    why: "The failure mode you should induce on purpose is unpinning content and confirming what remains retrievable. Most teams discover only during an incident that their gateway was never the sole source, or that it was.",
    related: ["reprovide", "bitswap", "content-addressing", "pinning", "gateway-trust"],
    mode: "both"
  },
  {
    id: "reprovide",
    term: "Reprovide",
    domain: "Decentralized",
    short: "Periodically re-announcing to the DHT that this node holds particular content.",
    long: "Provider records in a distributed hash table expire, so a node must re-announce the content it serves on a schedule or become undiscoverable through the DHT even while still holding the data. Reprovide cost scales with the number of items announced, which is why very large pinsets create a genuine operational tension between discoverability and resource consumption.",
    why: "Content that exists but cannot be found is functionally unavailable. Inducing this failure deliberately — letting records lapse in a test environment — teaches the difference between storage and availability far faster than reading about it.",
    related: ["kubo", "dht", "content-routing", "availability", "bitswap"],
    mode: "motus"
  },
  {
    id: "requestor",
    term: "Requestor",
    domain: "Decentralized",
    short: "The party submitting a computation task to a decentralized compute network.",
    long: "In a decentralized compute market the requestor defines the workload, supplies the image and data, and pays for execution; providers run it on their own hardware. The trust problem runs both directions: the requestor must not be able to use the provider's machine as a foothold, and the provider must not be able to tamper with or exfiltrate the requestor's workload and data. Both concerns have to be designed for simultaneously.",
    why: "The design move that beats every clever verification mechanism is reducing what the untrusted side can affect in the first place. Asking who is being protected from whom, in both directions, is the first question of any compute-market review.",
    related: ["gvmi", "sandbox-escape", "provider-node", "attestation", "reaping"],
    mode: "motus"
  },
  {
    id: "gvmi",
    term: "GVMI",
    domain: "Decentralized",
    short: "The packaged image format defining a workload for a decentralized compute provider.",
    long: "A workload image bundles the filesystem and entrypoint a provider will execute inside its runtime sandbox. Its security properties depend entirely on the isolation boundary the provider enforces around it — the image itself is untrusted code from the provider's perspective, and the provider's environment is untrusted infrastructure from the requestor's.",
    why: "The one-sentence test for a sandbox design review is: assume the workload is hostile and the host is curious, then name what each can still reach. If either answer is anything important, the boundary is decorative.",
    related: ["requestor", "sandbox-escape", "isolation-boundary", "attestation", "confidential-computing"],
    mode: "motus"
  },
  {
    id: "reaping",
    term: "Reaping",
    domain: "Decentralized",
    short: "Terminating and cleaning up compute tasks that exceed their limits or lose their payment guarantee.",
    long: "A provider must be able to stop work that overruns time, memory or budget, and must reclaim the environment afterwards so no state persists into the next tenant's task. Incomplete reaping is a cross-tenant data leak: residual filesystem contents, memory, or network state inherited by the following workload.",
    why: "Prove each of these before the node accepts a paid job: that limits are enforced, that termination actually happens, and that the environment is destroyed rather than reused. Multi-tenancy without verified teardown is single-tenancy with extra steps and worse guarantees.",
    related: ["requestor", "gvmi", "resource-limit", "tenant-isolation", "sandbox-escape"],
    mode: "motus"
  },
  {
    id: "pseudonymisation",
    term: "Pseudonymisation",
    domain: "Governance",
    short: "Replacing identifiers with tokens so data cannot be attributed to a person without separately held information.",
    long: "Pseudonymisation substitutes direct identifiers with pseudonyms while retaining, separately and under controls, the mapping needed to re-identify. Crucially it is a risk-reduction measure and not anonymisation: pseudonymised data remains personal data under GDPR because re-identification is possible with the additional information. Treating it as anonymisation is one of the most common and consequential compliance errors in engineering practice.",
    why: "How to use this in a design review without becoming the compliance department: ask where the mapping lives, who can reach both halves, and whether any single role or system can rejoin them. That question is technical, answerable, and decides the legal characterisation.",
    related: ["re-identification", "k-anonymity", "data-minimisation", "personal-data", "tokenization"],
    mode: "both"
  },
  {
    id: "candour",
    term: "Candour",
    domain: "Governance",
    short: "Volunteering the unflattering fact yourself, early, in your own words.",
    long: "Candour in an incident or regulatory context means producing the damaging artifact — the missed ticket, the absent assessment, the decision that looks bad in hindsight — before it is discovered, paired with what you did about it. Partial candour is detected precisely because the full record exists and is producible, and every accurate statement made alongside a softened one is re-read in the light of the softening.",
    why: "Regulators and boards are assessing whether you can be relied upon to tell the truth about failing, which is a different question from whether you failed. The unflattering fact disclosed voluntarily is a mitigating factor; the same fact discovered later is the case.",
    related: ["coordinated-disclosure", "spoliation", "blameless-postmortem", "regulatory-posture", "recusal"],
    mode: "both"
  },
  {
    id: "tombstone",
    term: "Tombstone",
    domain: "Decentralized",
    short: "A marker recording that something was deleted, in a system that cannot actually delete.",
    long: "In append-only and distributed stores, deletion is represented by writing a record that says this is deleted rather than by removing bytes. Readers that honour tombstones stop returning the value; readers that do not, or that access the underlying storage directly, still see it. The tombstone is therefore a convention enforced at the read layer, not a property of the data.",
    why: "The uncomfortable corollary for anyone building on this is that your deletion story is exactly as strong as your weakest reader. Any component reading beneath the convention — a backup, an analytics job, a debugging tool — silently voids the guarantee.",
    related: ["permanence", "irreversibility", "crypto-shredding", "append-only", "right-to-erasure"],
    mode: "motus"
  },
  {
    id: "grinding",
    term: "Grinding",
    domain: "Decentralized",
    short: "Repeatedly retrying a computation to bias an outcome that is supposed to be unpredictable.",
    long: "Where a protocol derives selection, ordering or randomness from values a participant can influence — a nonce, a timestamp, a submitted input — that participant can iterate cheaply until the derived result favours them. Defences bind the source to something the participant cannot cheaply vary or cannot know in advance, such as a commit-reveal scheme or a verifiable delay.",
    why: "The organisational failure this produces is subtle: a system that is manipulable but not obviously broken looks fine on every dashboard, and the advantage accrues quietly to whoever noticed first. Randomness sources deserve the same scrutiny as key material.",
    related: ["randomness-source", "commit-reveal", "mev", "selection-bias", "verifiable-delay-function"],
    mode: "motus"
  },

  /* ---------- Detection ---------- */
  {
    id: "answerability-horizon",
    term: "Answerability Horizon",
    domain: "Detection",
    short: "How far back you can actually answer an investigative question, as opposed to how long you retain data.",
    long: "Retention says how long records exist; the answerability horizon says how far back a specific question can genuinely be answered — which is bounded by the shortest-retained field required to answer it, by index coverage, by whether archived data is queryable in practice, and by schema changes that broke the field partway through. It is almost always considerably shorter than the retention policy claims.",
    why: "One of the three ratios that make you credible in a budget meeting. Saying we retain a year sounds strong; saying we can answer identity questions for ninety days and network questions for thirty is true, specific, and immediately fundable.",
    related: ["retention-policy", "telemetry-economics", "answerability-briefing", "dwell-time", "unknown-column"],
    mode: "both"
  },
  {
    id: "ocsf",
    term: "OCSF",
    domain: "Detection",
    short: "An open schema for normalising security events across vendors into shared classes and attributes.",
    long: "The Open Cybersecurity Schema Framework defines event classes and a common attribute model so that logs from different products can be queried with one set of field names. Adopting a schema does not by itself produce good data — mapping quality varies enormously by source, and a poorly mapped field is worse than an absent one because it looks populated.",
    why: "Identity resolution is the highest-leverage normalisation work you will do: getting user, host and session to mean the same thing across sources is what makes cross-source correlation possible at all. Schema adoption is the vehicle, not the goal.",
    related: ["normalisation", "identity-resolution", "unknown-column", "log-pipeline", "detection-coverage-map"],
    mode: "both"
  },
  {
    id: "unknown-column",
    term: "Unknown Column",
    domain: "Detection",
    short: "A field that exists in the schema but is unpopulated, wrongly mapped, or silently null for a source.",
    long: "Unknown columns are the quiet failure of log pipelines: a detection queries a field that a given source never populates, so the rule matches nothing and reports healthy. Because absence of alerts is indistinguishable from absence of attacks, the gap can persist indefinitely. Finding them requires actively auditing field population by source rather than trusting the schema.",
    why: "A rule that cannot fire is worse than no rule, because it occupies the space where a working control should be and produces false confidence on a coverage report.",
    related: ["plausible-empty-rule", "ocsf", "detection-coverage-map", "coverage-claim", "silent-degradation"],
    mode: "motus"
  },
  {
    id: "falsifiability",
    term: "Falsifiability",
    domain: "Detection",
    short: "Stating a hypothesis so that a specific observation could prove it wrong.",
    long: "A falsifiable hunt hypothesis names what you expect to find, in which data, and what result would count as disconfirmation. Without that, a hunt returns nothing and the analyst concludes the environment is clean, when the honest conclusion is that this query, over this data, in this window, found nothing — a much weaker and much more useful statement.",
    why: "Write the hunt down before you run it. A pre-registered hypothesis converts hunting from an unfalsifiable activity into evidence, and it is the only way a negative result carries information.",
    related: ["threat-hunting-hypothesis", "coverage-claim", "answerability-briefing", "coefficient-of-variation"],
    mode: "both"
  },
  {
    id: "coefficient-of-variation",
    term: "Coefficient of Variation",
    domain: "Detection",
    short: "Standard deviation divided by the mean — relative variability, comparable across different scales.",
    long: "Because it normalises spread by magnitude, the coefficient of variation lets you compare volatility between series with different units or wildly different baselines: a host averaging ten connections and one averaging ten thousand can be assessed on the same footing. In anomaly work it identifies which entities are genuinely erratic versus merely large.",
    why: "The stacking trap that costs new hunters a week is treating absolute deviation as significance, which surfaces the busiest hosts over and over. Normalising by baseline is what makes an outlier meaningful rather than merely big.",
    related: ["self-relative-baseline", "benign-baseline", "anomaly-detection", "behavioural-drift", "falsifiability"],
    mode: "motus"
  },
  {
    id: "deception-grid",
    term: "Deception Grid",
    domain: "Detection",
    short: "Planted credentials, hosts and documents that no legitimate process should ever touch.",
    long: "Deception assets are placed so that legitimate activity has no reason to reach them, which gives any interaction an extremely high signal-to-noise ratio compared with behavioural detection. Their strategic value extends past the alert: an adversary who learns that an environment is seeded must verify every credential and share they find, which imposes time and risk on them continuously.",
    why: "The strategic effect that does not show up in any metric is the tax on adversary confidence. It cannot be measured on a dashboard, which is exactly why deception programmes get cut in favour of things that produce numbers.",
    related: ["honeytoken", "canary-record", "high-fidelity-alert", "adversary-cost", "detection-coverage-map"],
    mode: "motus"
  },
  {
    id: "answerability-briefing",
    term: "Answerability Briefing",
    domain: "Detection",
    short: "A standing statement of which questions you can answer, over what window, with what confidence.",
    long: "Rather than reporting tool coverage or alert volume, an answerability briefing enumerates the investigative questions leadership actually asks — did anyone access this data, is this credential in use, when did this host first talk to that address — and states honestly for each whether it is answerable, over what period, and how quickly. Gaps become specific funding requests rather than vague maturity complaints.",
    why: "The credibility asset you are actually building is a reputation for knowing the limits of your own visibility. A leader who says we cannot answer that, and here is what it would cost to be able to is trusted on the answers they do give.",
    related: ["answerability-horizon", "coverage-claim", "board-translation", "telemetry-economics", "falsifiability"],
    mode: "both"
  },

  /* ---------- Foundations ---------- */
  {
    id: "pasta",
    term: "PASTA",
    domain: "Foundations",
    short: "A risk-centric threat modelling methodology that runs from business objectives through to attack simulation.",
    long: "The Process for Attack Simulation and Threat Analysis is a staged methodology beginning with business objectives and technical scope, proceeding through application decomposition, threat and vulnerability analysis, and ending in attack modelling and risk analysis. Its distinguishing property is that it is driven by business impact rather than by enumerating technical flaws, which makes its output legible to people who allocate budget.",
    why: "Choosing between STRIDE, attack trees, PASTA and LINDDUN on the merits of the question is the actual skill. PASTA suits situations where the deliverable must justify investment; STRIDE suits enumerating flaws in a design; LINDDUN suits privacy.",
    related: ["stride", "attack-tree", "linddun", "threat-modeling", "risk-analysis"],
    mode: "both"
  },
  {
    id: "linddun",
    term: "LINDDUN",
    domain: "Foundations",
    short: "A privacy threat modelling framework organised around seven privacy threat categories.",
    long: "LINDDUN structures privacy analysis around linkability, identifiability, non-repudiation, detectability, disclosure of information, unawareness and non-compliance, applied systematically to data flows. It exists because security threat modelling reliably misses privacy harms: a system can be entirely secure against unauthorised access while still being an unacceptable privacy design, because the harm comes from authorised use.",
    why: "Undefined is a finding. Running a privacy model over a data flow that has never had one almost always surfaces collection nobody could justify, retention nobody chose, and linkage nobody intended.",
    related: ["linkability", "pseudonymisation", "data-minimisation", "stride", "pasta"],
    mode: "both"
  },
  {
    id: "linkability",
    term: "Linkability",
    domain: "Foundations",
    short: "Being able to tell that two records or actions relate to the same subject, without necessarily knowing who.",
    long: "Linkability is the ability to associate items of interest — sessions, transactions, requests — as belonging to one entity. It is a privacy harm in its own right and the precursor to identifiability: once behaviour is linked into a profile, the addition of any single identifying attribute retroactively identifies the whole profile. Persistent identifiers, stable device characteristics and unique timing patterns are the usual carriers.",
    why: "Teams frequently protect identity while leaving linkability untouched, then are surprised when a pseudonymous dataset is re-identified. Breaking linkage is often cheaper and more effective than protecting the identifier.",
    related: ["linddun", "re-identification", "k-anonymity", "pseudonymisation", "quasi-identifier"],
    mode: "motus"
  },

  /* ---------- Risk, governance, privacy ---------- */
  {
    id: "lognormal",
    term: "Lognormal Distribution",
    domain: "Governance",
    short: "A right-skewed distribution used for loss magnitude, where the logarithm of the value is normally distributed.",
    long: "Loss magnitudes are bounded below by zero and unbounded above, with most events small and rare events very large — a shape the normal distribution cannot represent but the lognormal can. In quantitative risk work it is commonly used to model the magnitude term, parameterised from a calibrated range rather than a single point, so that simulation output reflects the genuine possibility of a tail event.",
    why: "The honesty constraint is that a distribution choice is an assumption, not a fact, and it must be stated alongside the result. A quantified risk presented without its parameterisation and its assumptions is a number wearing the costume of evidence.",
    related: ["fair-model", "monte-carlo", "calibration", "loss-magnitude", "tail-risk"],
    mode: "motus"
  },
  {
    id: "tokenization",
    term: "Tokenization",
    domain: "Governance",
    short: "Replacing a sensitive value with a surrogate that has no exploitable meaning outside the token vault.",
    long: "Tokenization substitutes a sensitive datum — typically a payment card number — with a token that is useless if stolen, while a separately secured vault holds the mapping. Unlike encryption, the token carries no mathematical relationship to the original, so compromise of the token store yields nothing without the vault. Its effect on compliance scope is the usual motivation: systems handling only tokens can fall outside the strictest control boundary.",
    why: "Scope reduction is the most underrated control in regulated environments. Removing sensitive data from a system entirely is strictly better than protecting it there, and it is the one measure that reduces both risk and audit cost at once.",
    related: ["pseudonymisation", "crypto-shredding", "scope-reduction", "data-minimisation", "subprocessor"],
    mode: "both"
  },
  {
    id: "re-identification",
    term: "Re-identification",
    domain: "Governance",
    short: "Recovering identity from data that was believed to be anonymous.",
    long: "Re-identification combines a de-identified dataset with auxiliary information — public records, another leaked dataset, or simply a distinctive combination of quasi-identifiers — to attribute records to individuals. Repeated published work has shown that small numbers of seemingly innocuous attributes can uniquely identify a large fraction of a population, which is why the anonymisation claim demands the auxiliary-data assumption be stated explicitly.",
    why: "The finding that appears in almost every session is a dataset described internally as anonymised that is in fact pseudonymised, retained accordingly, and shared on that basis. The label determines the legal obligations, so the label has to be correct.",
    related: ["pseudonymisation", "k-anonymity", "linkability", "quasi-identifier", "pseudonymization"],
    mode: "both"
  },
  {
    id: "sensitivity",
    term: "Sensitivity",
    domain: "Governance",
    short: "How much one individual's data can change a released result — the quantity that sets privacy noise.",
    long: "In differential privacy, sensitivity measures the maximum change to a query's output caused by adding or removing a single individual's record. It determines how much calibrated noise must be added to achieve a given privacy guarantee: high-sensitivity queries such as maximums or unbounded sums require far more noise than bounded counts, which is why some queries cannot be answered usefully under a strict privacy budget at all.",
    why: "The de-identification honesty rule is that privacy protection has a measurable cost in utility, and any scheme claiming both perfect privacy and perfect utility is misdescribing itself.",
    related: ["differential-privacy", "k-anonymity", "epsilon-budget", "re-identification", "noise-calibration"],
    mode: "motus"
  },
  {
    id: "puffery",
    term: "Puffery",
    domain: "Governance",
    short: "Vague promotional claims too general to be treated as factual representations — until they get specific.",
    long: "Marketing language survives legal scrutiny while it remains subjective and unmeasurable. It stops being puffery and becomes a representation the moment it makes a specific, verifiable claim — bank-grade encryption, fully audited, we never store your data. Security leaders are routinely asked to approve exactly this language, and approving a claim that is not operationally true creates exposure for the company and for the approver.",
    why: "The personal discipline is refusing to sign off on a security claim you could not defend with evidence in a deposition. That refusal is cheap while the copy is in draft and extremely expensive afterwards.",
    related: ["warranty", "discoverability", "misprision", "regulatory-posture", "candour"],
    mode: "motus"
  },
  {
    id: "discoverability",
    term: "Discoverability",
    domain: "Governance",
    short: "The likelihood that a document will be obtainable by an opposing party in litigation.",
    long: "Internal messages, tickets, risk registers and draft assessments are generally discoverable in litigation and regulatory proceedings. This is not an argument for writing less — under-documenting is itself a serious failure — but for writing accurately and without editorialising: state the finding, the decision, the reasoning and the owner, and leave out speculation and sarcasm that will read very differently to a hostile reader years later.",
    why: "The personal discipline is to write every risk record as though it will be read aloud by someone trying to make you look negligent. Records written that way are both better evidence and better engineering documents.",
    related: ["spoliation", "legal-hold", "puffery", "candour", "risk-acceptance-memo"],
    mode: "motus"
  },
  {
    id: "warranty",
    term: "Warranty",
    domain: "Governance",
    short: "A contractual promise that a stated fact is true, with liability attached if it is not.",
    long: "Security warranties in customer contracts commit the company to specific claims — that controls exist, that certifications are held, that data is handled in a stated way. Unlike marketing language, breach of warranty carries direct contractual consequences. Security leaders are frequently the only people positioned to know whether a proposed warranty is actually true across the whole estate rather than in the flagship product.",
    why: "Reviewing security warranties before signature is one of the highest-leverage, lowest-visibility duties of the role. The cost of catching an untrue commitment in redlines is a conversation; the cost of catching it in an audit is a breach of contract.",
    related: ["puffery", "subprocessor", "discoverability", "compliance", "regulatory-posture"],
    mode: "motus"
  },
  {
    id: "subjectivity",
    term: "Subjectivity",
    domain: "Governance",
    short: "Judgment-dependent inputs in a scoring system that make its outputs unreproducible.",
    long: "Risk scores that rely on undefined qualitative bands mean different things to different assessors, and the same system assessed by two people produces different numbers with no way to adjudicate. The remedy is not to eliminate judgment, which is impossible, but to make it explicit and calibrated: define what each band means in observable terms, record the reasoning, and check reproducibility between assessors.",
    why: "A risk register whose scores cannot be reproduced is a record of who filled it in, not of the organisation's risk. Calibration training and written definitions are what make judgment defensible.",
    related: ["calibration", "inherent-risk", "fair-model", "lognormal", "maturity-theatre"],
    mode: "both"
  },
  {
    id: "subprocessor",
    term: "Subprocessor",
    domain: "Governance",
    short: "A third party engaged by your processor to handle personal data on your behalf, further down the chain.",
    long: "When a vendor processing your data engages their own vendors, those parties are subprocessors, and the data protection obligations flow down the chain contractually. In practice the chain is longer and more dynamic than most organisations track: subprocessors change, sub-subprocessors are rarely enumerated, and notification obligations are often satisfied by a webpage nobody monitors.",
    why: "The uncomfortable strategic truth is that your data protection posture is bounded by the weakest link in a chain you do not control and probably cannot fully enumerate. Knowing that changes what you are willing to collect in the first place.",
    related: ["data-minimisation", "warranty", "third-party-risk"],
    mode: "both"
  },

  /* ---------- Identity and cryptography ---------- */
  {
    id: "rp-id",
    term: "RP ID",
    domain: "Identity",
    short: "The relying party identifier that scopes a WebAuthn credential to a domain.",
    long: "A WebAuthn credential is bound at registration to a relying party identifier — effectively a domain — and the browser refuses to release it to any origin that does not match. This binding, enforced by the browser rather than by the user's judgment, is the mechanism that makes phishing-resistant authentication actually resistant: a lookalike domain simply cannot obtain a signature from the credential, no matter how convincing the page is.",
    why: "Carry this back to work as the reason passkeys differ in kind rather than degree from one-time codes. A code can be relayed by a convincing page; a scoped credential cannot, because the check is made by software that does not get fooled by visual similarity.",
    related: ["webauthn", "passkey", "phishing-resistant", "origin-binding", "aal3"],
    mode: "both"
  },
  {
    id: "aal2",
    term: "AAL2",
    domain: "Identity",
    short: "An authentication assurance level requiring two distinct factors with cryptographic proof of possession.",
    long: "Authenticator assurance level 2 requires multi-factor authentication with proof of possession of a key or one-time value, resisting common credential replay. It does not, by itself, require phishing resistance — which is why an environment can be fully AAL2 compliant and still be compromised by a well-built relay proxy that harvests both factors in real time.",
    why: "The metric that tells the truth is not the percentage of users on MFA but the percentage on phishing-resistant MFA. The first number is comfortable and the second is actionable.",
    related: ["aal3", "mfa", "phishing-resistant", "rp-id", "credential-replay"],
    mode: "both"
  },
  {
    id: "aal3",
    term: "AAL3",
    domain: "Identity",
    short: "The highest authentication assurance level, requiring a hardware-based, phishing-resistant authenticator.",
    long: "Assurance level 3 requires proof of possession of a key held in a hardware authenticator with verifier impersonation resistance — meaning the authentication cannot be relayed through an attacker-controlled site. In practice this means hardware security keys or platform authenticators with origin binding, not codes or push approvals.",
    why: "Reserve the strongest authenticator for the accounts whose compromise is unrecoverable: administrative access, signing authority, and the identity provider itself. Uniform authentication strength across a heterogeneous risk landscape is a budget decision disguised as a policy.",
    related: ["aal2", "rp-id", "webauthn", "phishing-resistant", "privileged-access"],
    mode: "both"
  },
  {
    id: "imds",
    term: "IMDS",
    domain: "Identity",
    short: "The cloud instance metadata service that returns instance identity and temporary role credentials.",
    long: "Reachable from inside an instance at a link-local address, the metadata service supplies instance information and, for instances with an attached role, short-lived credentials for that role. It is the single most valuable target reachable from an application-level SSRF, because it converts a request-forgery bug directly into cloud credentials with whatever permissions the role carries.",
    why: "The finding that always lands is an over-permissive instance role combined with a metadata service that does not require session tokens. Either alone is survivable; together they are a straight line from a web bug to your account.",
    related: ["imdsv2", "ssrf", "standing-credential", "least-privilege", "cloud-metadata"],
    mode: "both",
    aliases: ["Instance Metadata Service", "Instance Metadata"]
  },
  {
    id: "caep",
    term: "CAEP",
    domain: "Identity",
    short: "Continuous Access Evaluation Protocol — pushing session-invalidating events between identity systems in near real time.",
    long: "CAEP defines event types such as session revoked, credential change and assurance level change, transmitted between an identity provider and relying applications so that access decisions can be re-evaluated immediately rather than at the next token expiry. Without it, revoking a session leaves already-issued tokens valid until they expire, which can be a long time in a hostile hour.",
    why: "The cheapest large win in identity is closing the window between revocation and effect. Most organisations discover the size of that window during an incident, while watching a terminated session continue to work.",
    related: ["session-revocation", "token-lifetime", "continuous-authorization", "identity-plane-triage", "zero-trust"],
    mode: "motus"
  },
  {
    id: "cbom",
    term: "CBOM",
    domain: "Identity",
    short: "A cryptographic bill of materials — an inventory of the algorithms, key sizes and protocols a system uses.",
    long: "A CBOM enumerates where cryptography appears across an estate: which algorithms, at which strengths, in which components, protecting what, with what key lifetimes. It is the prerequisite for any migration — deprecating a weak algorithm, or planning post-quantum transition — because you cannot replace cryptography you cannot locate.",
    why: "The moment this artefact pays for itself is the day an algorithm is deprecated on a deadline. Organisations with an inventory execute a project; organisations without one begin with an archaeology phase of unknown length.",
    related: ["sbom", "crypto-agility", "post-quantum", "key-rotation", "harvest-now-decrypt-later"],
    mode: "motus"
  },
  {
    id: "bip32",
    term: "BIP32",
    domain: "Identity",
    short: "Hierarchical deterministic key derivation — many keys generated reproducibly from one seed.",
    long: "BIP32 derives a tree of keypairs from a single master seed, so an unlimited number of addresses can be regenerated from one backed-up secret. The security consequence that matters organisationally is concentration: the seed is a single point of total compromise and total recovery simultaneously, and extended public keys leak the ability to enumerate all derived addresses even without spending authority.",
    why: "The organisational translation is that your entire custody posture reduces to how that one seed was generated, who witnessed it, where its backups live, and who could assemble them. Everything downstream is detail by comparison.",
    related: ["hd-wallet", "seed-phrase", "key-custody", "duff", "recovery-path"],
    mode: "both"
  },

  /* ---------- Incident and crisis ---------- */
  {
    id: "tripwire",
    term: "Tripwire",
    domain: "Incident",
    short: "A pre-agreed condition that automatically triggers a defined action, decided before the pressure arrives.",
    long: "A tripwire binds an observable condition to a committed response — if this credential is used from outside the approved range, it is disabled; if this threshold is crossed, an incident is declared. Its value is that the decision is made calmly in advance by people with authority, so that under pressure the action does not require assembling a judgment call from tired people with partial information.",
    why: "The rule that makes rotation possible is deciding in advance what would make you rotate, because in the moment there is always a reason to wait for more information. Pre-commitment is how organisations act at the speed their own telemetry allows.",
    related: ["pre-authorised-containment", "escalation-threshold", "playbook", "break-glass", "reversibility"],
    mode: "both"
  },
  {
    id: "reversibility",
    term: "Reversibility",
    domain: "Incident",
    short: "Whether a response action can be undone, which should determine the order you take actions in.",
    long: "Response actions differ enormously in reversibility: network isolation is reversible, session revocation is reversible with inconvenience, powering off destroys volatile memory permanently, and re-imaging destroys evidence entirely. Sequencing by reversibility — reversible containment first, irreversible actions only after evidence is captured — preserves the investigation while still reducing risk.",
    why: "Isolate before you power off. It is a single sentence and it is the difference between an investigation that can determine what happened and one that will never be able to answer the question the regulator asks first.",
    related: ["evidence-preservation", "irreversibility", "containment", "volatile-memory", "spoliation"],
    mode: "both"
  },
  {
    id: "spoliation",
    term: "Spoliation",
    domain: "Incident",
    short: "Destruction or alteration of evidence relevant to anticipated litigation, and the sanctions that follow.",
    long: "Once litigation or investigation is reasonably anticipated, an organisation must suspend routine deletion of relevant material. Failing to do so — even through automated retention policies operating exactly as designed — can result in adverse inference instructions or sanctions. Routine log rotation continuing through an incident is the classic and entirely unintentional example.",
    why: "The evidence hold nobody issues is the one covering the systems that rotate fastest. Knowing who can issue a hold, and being able to reach them out of hours, belongs in the incident plan next to the technical steps.",
    related: ["legal-hold", "evidence-preservation", "discoverability", "reversibility", "candour"],
    mode: "both"
  },
  {
    id: "sanctions-screening",
    term: "Sanctions Screening",
    domain: "Incident",
    short: "Checking counterparties and addresses against restricted-party lists before value moves.",
    long: "Screening compares transaction counterparties — including blockchain addresses on designated lists — against sanctions regimes, because transacting with a restricted party carries strict liability in many jurisdictions regardless of intent. In an extortion scenario this collides directly with incident pressure: a payment that resolves the operational crisis may itself be a violation.",
    why: "This is the case where the technically obvious action and the legally permissible action diverge completely. The decision belongs with counsel and the board, and the security leader's job is to surface it early enough that the choice still exists.",
    related: ["ransom-decision", "legal-escalation", "regulatory-posture", "extortion", "candour"],
    mode: "motus"
  },

  /* ---------- Intuition and the trust graph ---------- */
  {
    id: "fragmentation",
    term: "Fragmentation",
    domain: "Trust graph",
    short: "Splitting attention and stake across near-duplicate identifiers for the same real-world thing.",
    long: "When identity is derived from exact data bytes, a trailing space, a different Unicode normalisation or an extra field produces a distinct identifier for what humans read as the same subject. Signal that should concentrate on one canonical entry disperses across decoys, and an adversary can induce this deliberately so that a genuine community response lands somewhere that does not count.",
    why: "The four questions before you create any atom are whether it already exists, in what canonical form, how a user will find it rather than recreate it, and what your interface does to prevent a near-duplicate. Every duplicate your product allows is an attack surface you manufactured.",
    related: ["homoglyph", "unicode-normalisation", "canonical-identifier", "census", "atom"],
    mode: "both"
  },
  {
    id: "orbit-l3",
    term: "Orbit L3",
    domain: "Trust graph",
    short: "An application-specific rollup layer, whose security depends on assumptions worth writing down.",
    long: "A layer-three chain settles to a layer two, which settles to a base layer. Each hop adds throughput and cost advantages and also adds trust assumptions: who operates the sequencer, whether transactions can be forced through if that operator censors, how long the challenge window is, and who holds upgrade authority over the bridge contracts. These are the terms on which your users' assets actually rest.",
    why: "Trust assumptions to record in your risk register are exactly these: sequencer centralisation, forced-inclusion mechanism, upgrade key custody and bridge risk. Recording them is not pessimism; it is the minimum honest description of the system.",
    related: ["rollup", "sequencer", "bridge-risk", "upgrade-key", "progressive-decentralization"],
    mode: "motus"
  },
  {
    id: "subgraph",
    term: "Subgraph",
    domain: "Trust graph",
    short: "An indexed, queryable view over on-chain events, and a trusted component in most applications.",
    long: "Because reading raw chain state is impractical for application queries, indexers ingest events and expose them through an API. The result is that most applications' view of the chain comes from an indexer rather than from consensus — so indexer bugs, lag, or manipulation become application-level correctness and security issues, invisible to anyone auditing only the contracts.",
    why: "Lab completion for any on-chain application should include the question of what happens when the indexer is wrong or behind. Almost every team has an answer for contract risk and almost none has one for this.",
    related: ["indexer-lag", "data-availability", "trust-assumption", "orbit-l3", "staleness"],
    mode: "motus"
  },
  {
    id: "homoglyph",
    term: "Homoglyph",
    domain: "Trust graph",
    short: "A character that looks like another but has a different code point.",
    long: "Cyrillic and Latin scripts share many visually identical letterforms, so strings that render identically to a human can be entirely distinct to a machine. Used against domain names, package names or graph identifiers, homoglyphs produce entries indistinguishable by eye from the legitimate one, which is why visual verification of an identifier is not verification at all.",
    why: "The thousand-byte detail that matters here is that humans cannot be the comparison function. Publish canonical identifiers as one-click links and build search-and-reuse into creation flows, because asking anyone to check a string by eye is asking them to fail.",
    related: ["unicode-normalisation", "fragmentation", "typosquatting", "canonical-identifier", "caip-10"],
    mode: "both"
  },
  {
    id: "caip-10",
    term: "CAIP-10",
    domain: "Trust graph",
    short: "A chain-agnostic standard for identifying an account as namespace, chain reference and address.",
    long: "CAIP-10 expresses an account identifier in a form that includes which chain it belongs to, so that the same address on different networks is unambiguously distinguished. Without this qualification, an address is ambiguous across chains — and attestations attached to an unqualified address inherit that ambiguity, which is a correctness problem before it is a security one.",
    why: "Identifier standards look like pedantry until an attestation is applied to the wrong chain's account. Precision in the identifier is what makes a claim about an account mean one thing.",
    related: ["homoglyph", "canonical-identifier", "attestation", "chain-namespace", "fragmentation"],
    mode: "motus"
  },
  {
    id: "unicode-normalisation",
    term: "Unicode Normalisation",
    domain: "Trust graph",
    short: "Converting text to a canonical form so equivalent sequences compare equal.",
    long: "The same visible character can be encoded as a single code point or as a base plus combining marks. Normalisation forms convert text to a consistent representation so that equivalent strings compare equal. Systems deriving identity from raw bytes without normalising will treat visually and semantically identical inputs as distinct entities, which is precisely the fragmentation attack.",
    why: "Normalise before you hash, or accept that your identity space contains invisible duplicates. This is a one-line implementation decision with permanent consequences on an immutable ledger.",
    related: ["homoglyph", "fragmentation", "canonical-identifier", "atom", "caip-10"],
    mode: "motus"
  },
  {
    id: "whale-dominance",
    term: "Whale Dominance",
    domain: "Trust graph",
    short: "A small number of large holders determining an outcome that is presented as collective.",
    long: "Where influence is proportional to capital, a handful of large positions can decide a signal, a vote or a ranking while the result is displayed as consensus. The reported number — total staked, total voting weight — conceals the distribution behind it, and the distribution is the thing that actually determines whether the signal means anything.",
    why: "Total assets in a vault is not a count of people who believe something; it is a count of dollars. Any consumer of a stake-weighted signal must decide whether they are measuring conviction or capital, because those are different quantities.",
    related: ["governance-attack", "sybil-resistance", "signal-quality", "census", "nakamoto-coefficient"],
    mode: "both"
  },
  {
    id: "census",
    term: "Census",
    domain: "Trust graph",
    short: "A periodic count of distinct participants behind a signal, as opposed to its total weight.",
    long: "A census asks how many independent parties contributed to a signal and how concentrated their contributions are, rather than reporting the aggregate. Distinguishing distinct funding provenance is what makes the count meaningful: many addresses funded from one source are one participant wearing many hats, which the aggregate cannot show.",
    why: "The discipline that makes it work is running the census on a schedule and publishing it, so that concentration trends are visible before they matter rather than after an incident makes them obvious.",
    related: ["whale-dominance", "sybil-resistance", "funding-ancestry", "staleness", "falsifier"],
    mode: "motus"
  },
  {
    id: "staleness",
    term: "Staleness",
    domain: "Trust graph",
    short: "How old a claim is, and whether anything has revalidated it since.",
    long: "Attestations do not decay on their own: a claim staked years ago about a contract, a person or an organisation continues to read as current unless the consuming system tracks age and revalidation. Systems that ignore staleness accumulate a growing body of confident assertions about a world that has moved on, and the oldest claims are frequently the most trusted purely by inertia.",
    why: "A claim without an issuer, an expiry and a revocation path is a rumour with better typography. Displaying claim age alongside claim weight is a one-line interface change that materially improves every downstream decision.",
    related: ["attestation", "revocation", "approval-freshness", "census", "falsifier"],
    mode: "both"
  },
  {
    id: "falsifier",
    term: "Falsifier",
    domain: "Trust graph",
    short: "A party who stakes against a claim, making disagreement a visible economic act.",
    long: "Most reputation systems model only agreement — likes, endorsements, upvotes — leaving disagreement unrepresentable. A counter-position lets a party put weight behind this is false on the same rails, visible to the same readers, so that the claim and its rebuttal both stand with their weights legible. That is materially better than a takedown, because nobody has to hold the delete key.",
    why: "The discipline that makes it work is that whoever operates the ranking layer must have a pre-committed, capped, disclosed policy for when they themselves stake — otherwise the referee has quietly taken a position.",
    related: ["counter-vault", "credible-neutrality", "staleness", "census", "recusal"],
    mode: "both"
  },
  {
    id: "progressive-decentralization",
    term: "Progressive Decentralization",
    domain: "Trust graph",
    short: "A published plan to hand over control over time, with named milestones rather than intentions.",
    long: "Most protocols launch with centralised control — upgrade keys, sequencer operation, treasury authority — for entirely legitimate reasons of speed and safety. Progressive decentralization is the commitment to relinquish it on stated conditions and a stated timeline, published where users can hold the team to it. Without published milestones the phrase describes an aspiration that is indistinguishable from indefinite control.",
    why: "The commitment you publish at launch is the one users can price. An honest statement of current centralisation with a dated plan earns far more durable trust than a decentralization claim that the architecture does not support.",
    related: ["upgrade-key", "orbit-l3", "governance-attack", "credible-neutrality", "superblock"],
    mode: "both"
  }
];
