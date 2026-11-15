import type { Guide } from "./schema";

export const GUIDES: Guide[] = [
  {
    id: "sg-smart-contract-audit-playbook",
    title: "The Smart Contract Audit Playbook",
    domain: "Blockchain Security",
    kind: "playbook",
    statement: "An audit is not a bug hunt. It is a structured argument that the code cannot violate its own invariants, and the report is the argument.",
    summary: "A working two-week audit procedure: how to build the invariant list before you read a single line of logic, which tool proves which class of claim, how to grade severity so the client cannot argue it down, and what the deliverable must contain to still be useful eighteen months later.",
    minutes: 45,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "You are auditing intent, not syntax",
        body: "Every serious finding is a gap between what the protocol means and what the bytecode permits. Static analysers find the syntax class of bug. Nobody finds the intent class of bug except a human who first wrote down, in plain sentences, what must always be true. If you start by reading functions top to bottom you will produce a tidy report full of low-severity gas notes and miss the one accounting path that lets a depositor withdraw twice. Build the invariant list first, from the docs and the economics, before you let the implementation anchor your thinking."
      },
      {
        kind: "numbered",
        title: "The two-week shape",
        items: [
          "Day 1 — Scope freeze. Pin the commit hash, list every file in scope, and explicitly write down what is out of scope (governance, oracles, the deployment script, the frontend). Out-of-scope items become named residual risks in the report, not silence.",
          "Day 1 — Threat actor set. Who can call what: anonymous EOA, whitelisted keeper, the multisig, the upgrade admin, a flash-loan-funded caller with unlimited transient capital, a malicious token the protocol was told to trust.",
          "Day 2 — Invariant elicitation. Write 15 to 40 sentences of the form: it must never be the case that X. Do this from the whitepaper and the economics, not the code. Have the client sign off on the list; disagreements found here are the cheapest findings you will ever produce.",
          "Day 3 — Architecture read. Draw the call graph, the storage layout, the upgrade path, and the trust boundaries. Mark every external call and every place control leaves the contract.",
          "Days 4 to 5 — Automated sweep. Slither and Aderyn for the known-shape classes. Triage everything; do not paste raw output into the report. The value here is the two findings that survive triage, not the eighty that do not.",
          "Days 5 to 9 — Manual review against the invariant list, one invariant at a time. For each, either construct the violating sequence or write down the argument for why it cannot exist.",
          "Days 6 to 11 — Property testing in parallel. Encode the invariants as Echidna or Foundry properties. Run overnight. Symbolic-execute the arithmetic-heavy paths with Halmos.",
          "Day 12 — Adversarial review by a second auditor who has not read your notes. Fresh eyes on the invariant list, not on your findings.",
          "Days 13 to 14 — Report, severity calibration, and the fix-review commitment. An audit with no fix-review window is half an audit."
        ]
      },
      {
        kind: "table",
        title: "Which tool proves which claim",
        headers: ["Instrument", "What it can actually prove", "What it structurally cannot"],
        rows: [
          ["Slither / Aderyn (static)", "Presence of known bug shapes: reentrancy patterns, uninitialised storage, shadowing, unchecked return values", "Anything requiring protocol semantics. It has no idea what your token is for."],
          ["Foundry unit tests", "That the happy paths and the paths you imagined behave", "The path you did not imagine. Coverage percentage is not assurance."],
          ["Echidna / Medusa (fuzzing)", "That across millions of random call sequences, a stated property did not break", "Absence of a counterexample is not proof of absence. Deep state requires long sequences and good handlers."],
          ["Foundry invariant testing", "Same class as Echidna, in the toolchain the devs already use, so the properties survive after the audit ends", "Nothing beyond the properties you wrote. Poor handler design silently narrows the search space."],
          ["Halmos (symbolic)", "That for all inputs within the bounded loop depth, an assertion holds", "Unbounded loops, and anything the SMT solver times out on. Timeouts must be reported, not swallowed."],
          ["Certora / formal spec", "Machine-checked proof of a stated rule over the whole state space", "That your rule was the right rule. A proved wrong spec is a very expensive false comfort."]
        ]
      },
      {
        kind: "code",
        title: "An invariant that earns its keep",
        lang: "solidity",
        body: "// Bad property: restates the implementation.\n// function echidna_supply() public view returns (bool) {\n//     return token.totalSupply() == _totalSupply;\n// }\n\n// Good property: states the economic truth the implementation must serve.\n// Solvency must hold no matter what sequence of deposits,\n// withdrawals, donations or rebases the fuzzer invents.\ncontract SolvencyProps is VaultHandler {\n\n    function echidna_never_undercollateralised() public view returns (bool) {\n        return asset.balanceOf(address(vault)) >= vault.totalOwedToDepositors();\n    }\n\n    // Assertion mode: side effects are preserved, so we can check\n    // a mid-transaction condition rather than only end state.\n    function withdraw_cannot_mint_value(uint256 shares) public {\n        uint256 before = vault.convertToAssets(1e18);\n        vault.withdraw(shares);\n        uint256 sharePriceAfter = vault.convertToAssets(1e18);\n        assert(sharePriceAfter >= before);\n    }\n}",
        source: "Property shapes follow the Echidna testing-mode conventions in Trail of Bits, Building Secure Contracts."
      },
      {
        kind: "compare",
        title: "The two audits that cost the same",
        left: {
          title: "Theatre",
          items: [
            "Findings list assembled from static-analyser output",
            "Severity assigned by feel, negotiated downward in the call",
            "No invariants written down anywhere",
            "Out-of-scope components silently omitted",
            "Report is a PDF that dies at the next refactor",
            "Fix review is an email saying looks good"
          ]
        },
        right: {
          title: "Assurance",
          items: [
            "Findings traced to a violated invariant sentence",
            "Severity from a published impact-by-likelihood matrix applied before the client sees it",
            "Invariant suite handed over as runnable Foundry or Echidna files",
            "Residual risks named explicitly, with the actor who accepted them",
            "Report includes the assumptions that, if they change, invalidate the audit",
            "Fix review re-runs the property suite against the patched commit"
          ]
        }
      },
      {
        kind: "checklist",
        title: "Invariant elicitation prompts that surface real findings",
        items: [
          "Conservation: for every unit of value that enters, where can it leave, and does the sum of exits ever exceed the sum of entries plus yield?",
          "Monotonicity: which quantities must never decrease (share price, cumulative index, nonce) and what path could decrease them?",
          "Rounding direction: does every rounding favour the protocol rather than the caller, on both the deposit and the withdraw leg?",
          "Access: for every state-changing function, name the actor set that may call it and the actor set that should be able to.",
          "Reentrancy of accounting, not just of ETH: after any external call, which of your invariants are temporarily false?",
          "Transient capital: does any decision read a value that a flash loan can move within one transaction?",
          "Token assumptions: fee-on-transfer, rebasing, missing return value, 6 decimals, blocklist, double-entrypoint. Which are assumed away, and is that written down?",
          "Upgrade: does the new storage layout collide with the old one, and can the upgrade admin change semantics without changing the address users trust?",
          "Liveness under stress: if the oracle is stale, the sequencer is down, or gas is 3000 gwei, does the protocol fail closed or fail open?",
          "Initialisation: can any initialiser be front-run, and does every proxy get initialised in the same transaction it is deployed?"
        ]
      },
      {
        kind: "table",
        title: "Severity, decided before the client calls",
        headers: ["Impact", "Likelihood high", "Likelihood medium", "Likelihood low"],
        rows: [
          ["Funds directly stealable or permanently frozen", "Critical", "Critical", "High"],
          ["Funds at risk under a specific market or actor condition", "Critical", "High", "Medium"],
          ["Protocol accounting wrong, no immediate loss", "High", "Medium", "Medium"],
          ["Griefing, denial of service, degraded liveness", "Medium", "Medium", "Low"],
          ["Deviation from spec with no value consequence", "Low", "Low", "Informational"]
        ]
      },
      {
        kind: "callout",
        title: "The paragraph most reports omit",
        body: "Write an explicit assumptions section: the audit holds only if the upgrade admin remains a healthy multisig, the price oracle behaves as documented, the integrated token conforms to the stated subset of ERC-20, and the deployment matches the reviewed commit. Every large loss in the last three years has been in that paragraph rather than in the findings list. Chainalysis put illicit inflows at least 154 billion dollars for 2025, with the single largest event, Bybit, being an operational compromise rather than a contract flaw. Auditing only what compiles is auditing the wrong surface."
      }
    ],
    sources: [
      { label: "Trail of Bits — Building Secure Contracts, Echidna testing modes", note: "Authoritative on property, assertion, optimization, overflow and exploration modes, and on stateful versus stateless fuzzing. Read the assertion-mode section before writing your first property." },
      { label: "MITRE / Ethereum EIPs — ERC-7730 clear signing metadata", note: "Relevant to audits because it defines what a user can actually be shown at signing time. If your protocol has no descriptor, your users are blind-signing your calldata." },
      { label: "Chainalysis 2026 Crypto Crime Report", note: "At least 154 billion dollars received by illicit addresses in 2025, a 162 percent year-over-year rise, with stablecoins at 84 percent of illicit volume. Calibrates where loss actually comes from." },
      { label: "NCC Group — In-depth technical analysis of the Bybit hack", note: "The clearest public writeup of how a fully audited Safe contract was drained through operation type 1 delegatecall overwriting proxy storage slot 0. Proof that contract correctness is not system security." },
      { label: "Halborn — Explained: the Beanstalk hack, April 2022", note: "181 million dollars lost through unaudited governance code; the attacker held 79 percent of votes via flash loan against a two-thirds emergencyCommit threshold. Scope exclusions are findings." },
      { label: "SEAL Security Frameworks — External Security Reviews", note: "Community-maintained guidance on commissioning reviews, scoping, and what a client should demand. Useful when you sit on the buying side of the engagement." }
    ]
  },
  {
    id: "sg-safe-signer-operations",
    title: "Multisig Signer Operations: The SAFE Runbook",
    domain: "Blockchain Security",
    kind: "playbook",
    statement: "A multisig protects you from one compromised key. It protects you from nothing if all signers verify the same lying screen.",
    summary: "The operating procedure for a protocol or treasury multisig: signer selection and geographic and vendor diversity, the pre-signing verification ritual that would have stopped Bybit, hash verification off the proposing interface, emergency and offboarding paths, and the quarterly proof that the quorum still exists.",
    minutes: 35,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Threshold is a distribution property, not a number",
        body: "A 3-of-5 where all five signers use the same wallet vendor, the same browser interface, and the same laptop image is a 1-of-1 with extra steps. The number you write in the contract is meaningless until you can answer: what single failure, in software, in a supplier, in a building, or in a jurisdiction, takes out enough signers to cross the threshold or to block it. Design for both directions. Losing quorum is an incident too."
      },
      {
        kind: "timeline",
        title: "How 1.5 billion dollars left a correctly configured 3-of-6",
        items: [
          "Early February 2025 — A Safe developer machine is compromised. Nothing on chain changes. No contract is vulnerable.",
          "19 February 2025 — Malicious JavaScript is introduced into the Safe interface, targeted at the specific Bybit workflow.",
          "21 February 2025 — Signers open the interface and see what looks like a routine transfer to a hot wallet. The injected code preserves the original transaction object for display, substitutes destination and call parameters for signing, collects the signature over the tampered payload, then restores the original object.",
          "21 February 2025 — The executed transaction is operation type 1, a delegatecall to an attacker contract whose function mimics ERC-20 transfer syntax but writes to storage slot 0, replacing the proxy masterCopy pointer with attacker code.",
          "21 February 2025 — Roughly 401,347 ETH, about 1.4 to 1.5 billion dollars, is drained. Every signature was cryptographically valid. Every contract behaved as written. Attribution is to DPRK-linked actors."
        ]
      },
      {
        kind: "checklist",
        title: "Signer selection: the discriminating criteria",
        items: [
          "No two signers share a hardware wallet vendor and firmware version. Vendor monoculture is the failure mode people forget to model.",
          "At least one signer verifies on a device that has never had a browser installed on it.",
          "Signers span at least three legal jurisdictions and at least two timezone bands, so a raid, a subpoena, or a national outage cannot take quorum.",
          "No signer sits in a reporting line under another signer. A CFO and their direct report are one signer for coercion purposes.",
          "Every signer holds an independently derived key, generated on their own device. Keys distributed by an ops lead from one machine are one key.",
          "Signer identity is registered off chain with a verified out-of-band contact method that does not depend on the org's own SSO or Slack.",
          "Threshold plus one signers exist, so that a single unavailable person does not freeze the treasury and force an emergency policy exception.",
          "Every signer has personally executed a test transaction on the exact device and interface they will use in production, within the last 90 days."
        ]
      },
      {
        kind: "numbered",
        title: "The pre-signing ritual, performed by every signer independently",
        items: [
          "Receive the transaction brief out of band, on a channel different from the one that proposed the transaction. The brief states intent in plain language, the destination, the asset, the amount, and the expected Safe transaction hash.",
          "Compute the Safe transaction hash yourself from raw parameters, using a local tool or an independent verifier, not the page proposing the transaction. If the page tells you the hash, the page can lie about the hash.",
          "Confirm operation type is 0 (call). If it is 1 (delegatecall), stop. Delegatecall is a treasury-scale event and requires its own out-of-band approval path and a named reviewer of the target bytecode.",
          "Read the destination address on the hardware wallet screen, not the browser. Compare full string, not first and last four characters. Address-poisoning attacks target exactly that habit.",
          "Confirm the decoded intent matches the brief. If the device shows raw hex rather than a human sentence, you are blind signing; treat that as a hard stop unless a compensating verification exists.",
          "Simulate the transaction against a fork of current state and read the balance diff. Approve based on the diff, not on the label.",
          "Sign. Then confirm out of band that the number of collected signatures matches the number of signers who consciously signed. A signature you did not intend is the first signal of an interface compromise.",
          "After execution, verify on chain that the resulting state matches the brief, including that the proxy implementation address is unchanged."
        ]
      },
      {
        kind: "compare",
        title: "Interface trust: two postures",
        left: {
          title: "Convenient",
          items: [
            "Signers use the hosted web interface for both proposal and verification",
            "Hash shown by the interface is accepted as the hash",
            "Delegatecall permitted by default because the contract supports it",
            "No transaction policy contract; any destination is reachable",
            "Signers approve from personal laptops with the same extension set"
          ]
        },
        right: {
          title: "Survivable",
          items: [
            "Proposal and verification happen on different code paths; verification is a local, pinned, offline-capable tool",
            "Hash computed independently by each signer before the device is touched",
            "Delegatecall disabled at the contract or guard level, or gated behind a separate higher-threshold flow",
            "A guard contract enforces destination allowlists, asset allowlists and per-epoch limits, so a stolen quorum still cannot reach an arbitrary address",
            "Signing happens on dedicated hardened devices with pinned interface assets and subresource integrity"
          ]
        }
      },
      {
        kind: "callout",
        title: "The control that actually breaks the Bybit chain",
        body: "Every downstream control assumes the signer can see truth. Only two controls remove that assumption. First, independent hash computation: if all six signers derive the same hash from raw parameters using tooling that never touched the proposing origin, injected display code cannot survive. Second, an on-chain policy guard: an allowlist of destinations and a ban on delegatecall means a fully deceived quorum still executes something harmless. Everything else is hygiene. Build these two first."
      },
      {
        kind: "metric",
        title: "What to measure quarterly",
        body: "Quorum liveness drill: time from cold start to a threshold of valid signatures on a 1 wei test transaction, with no prior warning. Target under four hours. Track the distribution of who responded and how; the slowest signer defines your real incident response floor. Also track signer key age, device attestation freshness, and percentage of transactions in the quarter where at least one signer independently recomputed the hash. That last number should be 100 percent, and in most organisations it starts near zero."
      },
      {
        kind: "list",
        title: "Offboarding, in this order",
        items: [
          "Remove the signer from the Safe on chain first, before any HR or access conversation happens.",
          "Rotate any shared secrets the signer could observe: RPC keys, monitoring credentials, war-room channel invites.",
          "Re-verify threshold arithmetic after removal. Removing one of four in a 3-of-4 leaves you at 3-of-3 with no redundancy, which is a liveness incident waiting to happen.",
          "Update the out-of-band contact roster and the emergency call tree the same day.",
          "Run a quorum liveness drill within 14 days of any signer set change. Set changes are the highest-risk window you have."
        ]
      }
    ],
    sources: [
      { label: "NCC Group — In-depth technical analysis of the Bybit hack", note: "Operation type 1, target contract, and the exact five-step JavaScript manipulation of the signing payload. The single most instructive multisig document in existence." },
      { label: "SEAL Security Frameworks — Multisig for Protocols", note: "Fifteen sections covering planning, classification, setup, registration, emergency protocols, opsec, offboarding and runbooks. The closest thing to a community standard for protocol multisig operations." },
      { label: "ERC-7730 — Clear signing metadata (Ethereum EIPs)", note: "Defines the context, metadata and display descriptor structure that lets a wallet render intent instead of hex. Ship a descriptor for your own protocol or accept that your users blind sign." },
      { label: "Chainalysis 2026 Crypto Crime Report", note: "DPRK-linked actors stole roughly 2 billion dollars in 2025, their worst year on record, with Bybit the largest single event. Sets the threat actor you are actually designing against." },
      { label: "SEAL Security Frameworks — Wallet Security and Treasury Operations", note: "Companion frameworks covering device hygiene, seed handling and treasury movement authorisation. Use alongside the multisig framework rather than instead of it." }
    ]
  },
  {
    id: "sg-blind-signing-field-note",
    title: "Field Note: Simulation, Clear Signing, and the Limits of Both",
    domain: "Blockchain Security",
    kind: "field-note",
    statement: "Simulation tells you what would happen if the chain state and the payload are what you were shown. Both of those are attacker-controllable.",
    summary: "A narrow, hard-won note on transaction simulation and clear signing: where simulators genuinely help, the four ways they are defeated, why ERC-7730 descriptors matter more than any guardrail product, and the exact residual risk you must accept and document.",
    minutes: 18,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "The problem in one paragraph",
        body: "Signing is a cryptographic commitment to a byte string. Humans cannot read byte strings, so every wallet inserts an interpretation layer between the bytes and the person. Every attack on signing is an attack on that interpretation layer, not on the cryptography. Blind signing is the degenerate case where the interpretation layer gives up and shows hex. Clear signing is the case where it gives an answer. The security question is never is it clear, it is who controls the interpretation, and is that party in the same trust domain as the thing being signed."
      },
      {
        kind: "principle",
        title: "Sign what you verified, verify what you sign",
        body: "The only durable rule: the artifact you verified must be bound to the artifact you signed by something stronger than the display. In practice that means the hash. If a signer independently computes the transaction hash from raw parameters using tooling that never touched the proposing origin, and their device displays a hash they can compare, then no amount of interface compromise changes what they committed to. Everything else in this note is a way of making that comparison humanly possible."
      },
      {
        kind: "list",
        title: "Four ways a simulator lies without being wrong",
        items: [
          "State divergence. The simulator ran against block N. Execution lands at block N plus k, after an attacker-crafted transaction changed an allowance, an oracle price, or a proxy implementation. Nothing about the simulation was false; it was answered about a world that no longer exists.",
          "Payload divergence. The simulator was given the payload shown to you. The signature was collected over a different payload. This is precisely the Bybit mechanism, and no amount of simulation quality defeats it, because the simulator and the display share the same lie.",
          "Selective behaviour. Malicious contracts detect simulation environments through gas, coinbase, block number, chain id or the absence of a mempool, and behave benignly. Treat any contract whose behaviour depends on environment introspection as hostile by default.",
          "Semantic divergence. The diff is accurate and benign: you approve a token. The consequence is not: the spender is upgradeable and the approval is unlimited and permanent. Simulators show the delta, not the standing authority you just granted."
        ]
      },
      {
        kind: "code",
        title: "What clear signing metadata actually asserts",
        lang: "json",
        body: "{\n  “context”: {\n    “contract”: {\n      “deployments”: [ { “chainId”: 1, “address”: “0x...” } ]\n    }\n  },\n  “metadata”: {\n    “owner”: “Protocol name shown to the user”,\n    “enums”: { “orderType”: { “0”: “Market”, “1”: “Limit” } }\n  },\n  “display”: {\n    “formats”: {\n      “swap(address,uint256,uint256)”: {\n        “intent”: “Swap {amountIn} for at least {minOut}”,\n        “fields”: [\n          { “path”: “amountIn”, “format”: “tokenAmount” },\n          { “path”: “minOut”, “format”: “tokenAmount” }\n        ]\n      }\n    }\n  }\n}",
        source: "Structure per ERC-7730: context binds the descriptor to a chain and address, metadata supplies constants, display supplies per-function intent and field formatters."
      },
      {
        kind: "compare",
        title: "Guardrail product versus structural control",
        left: {
          title: "Detection-shaped",
          items: [
            "Scans the payload and warns on known-bad destinations",
            "Reports a catch rate; the marketing number is always high",
            "Fails silently on novel patterns and on targeted one-shot attacks",
            "Sits in the same web origin as the interface it is protecting",
            "Adds a modal that users learn to click through in about three weeks"
          ]
        },
        right: {
          title: "Structure-shaped",
          items: [
            "Descriptor pins intent to contract address and chain id, so a substituted destination has no descriptor and renders as hex",
            "Guard contract makes the dangerous state transition unreachable regardless of what was signed",
            "Independent hash computation makes display compromise irrelevant",
            "Verification path and proposal path are different code, different origin, different device",
            "Delegatecall is disabled rather than warned about"
          ]
        }
      },
      {
        kind: "callout",
        title: "Residual risk you must write down",
        body: "Even with descriptors, independent hash verification, simulation and a guard contract, one risk remains: the signer approves a transaction that is exactly what it claims to be, and is nonetheless the wrong decision, because the brief that generated it was authored by a compromised or coerced insider. Signing controls terminate at intent. Intent is protected by out-of-band confirmation of the business reason with a second human who was not in the proposing conversation. Put that in the runbook, name it, and stop pretending signing tooling covers it."
      },
      {
        kind: "quote",
        body: "Most data to sign, even enriched with data structure description like ABIs or EIP-712 types, are not self-sufficient in terms of correctly displaying them to users for review.",
        source: "ERC-7730, Clear Signing Metadata, Ethereum Improvement Proposals"
      }
    ],
    sources: [
      { label: "ERC-7730 — Clear Signing Metadata", note: "The standard itself. Read the context, metadata and display sections; note that interpolatedIntent is what lets a device render a sentence rather than a field list." },
      { label: "EIP-712 — Typed structured data hashing and signing", note: "The layer beneath 7730. It fixes how structured data is hashed and domain-separated; it deliberately says nothing about human display, which is exactly the gap 7730 fills." },
      { label: "NCC Group — In-depth technical analysis of the Bybit hack", note: "The definitive worked example of payload divergence: display object preserved, signing object substituted, signature restored onto the original. Read the five-step sequence." },
      { label: "Blockaid — On solving blind signing after Bybit", note: "Vendor-authored but useful on the taxonomy of blind signing scenarios and where simulation genuinely adds value versus where it cannot." },
      { label: "SEAL Security Frameworks — Wallet Security", note: "Community guidance on device posture for signers, including why the verification device should be separate from the proposing device." }
    ]
  },
  {
    id: "sg-treasury-key-ceremony",
    title: "The Treasury Key Ceremony",
    domain: "Blockchain Security",
    kind: "playbook",
    statement: "A key ceremony is not about generating a key. It is about producing evidence, years later, that nobody could have kept a copy.",
    summary: "A full ceremony procedure for generating and sharding treasury keys: room and device preparation, entropy handling, Shamir versus multisig, the roles that must not be held by the same person, witness and recording discipline, the sealed evidence package, and the recovery rehearsal that proves the whole thing worked.",
    minutes: 40,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "The ceremony's output is an argument, not a key",
        body: "In three years someone will ask whether the treasury key could have been copied at birth. The key itself cannot answer. Only the evidence package can: the attestations of witnesses who were not colleagues, the tamper-evident seal numbers, the device provenance, the recording, and the fact that no single participant was ever alone with material capable of reconstructing the secret. Design the ceremony backwards from that question. If a step produces no evidence, it is a step that will be disputed."
      },
      {
        kind: "table",
        title: "Roles, and who may not be the same person",
        headers: ["Role", "Responsibility", "Must not also be"],
        rows: [
          ["Ceremony Administrator", "Runs the script, calls each step aloud, keeps time", "Shard Holder, Witness"],
          ["Shard Holder (n of them)", "Receives and seals one custody share; never sees another", "Administrator, Custodian of a second shard, Auditor"],
          ["Internal Witness", "Attests that the script was followed as written", "Shard Holder"],
          ["External Witness", "Independent party, ideally counsel or an auditor, attests to the same", "Employee of the organisation"],
          ["Scribe", "Timestamped log, seal numbers, deviations", "Administrator"],
          ["Recovery Rehearsal Lead", "Runs the reconstitution test days later with a different subset", "Administrator of the original ceremony"]
        ]
      },
      {
        kind: "numbered",
        title: "The ceremony script",
        items: [
          "Pre-brief, 7 days prior. Circulate the written script. Every participant confirms in writing that they have read it. A ceremony improvised on the day is not a ceremony.",
          "Device provenance. Hardware wallets and any air-gapped machine are purchased through separate channels by separate people, arrive sealed, and seal numbers are photographed and logged before opening. Never accept a device that arrived through a single procurement path.",
          "Room preparation. No network. No personal phones. Cameras and recording device declared and logged. Windows covered; long-lens photography of a screen showing a seed phrase is a real technique, not a movie one.",
          "Device integrity. Verify firmware version and vendor attestation on each device with the participants watching. Log the versions. A device with unverifiable firmware is discarded, not used.",
          "Entropy. Generate on the device using the device's own hardware RNG. If you add user entropy, add it in a way that cannot reduce security: dice rolls mixed by the device, never a phrase a human chose. Never generate on a general-purpose computer, and never on a machine that has ever had a browser on it.",
          "Split. Choose Shamir or native multisig deliberately (see the comparison block) and record the reason. Record threshold and share count in the log before generating, so the parameters cannot be quietly changed mid-ceremony.",
          "Distribution. Each shard is written to its medium and immediately sealed in a numbered tamper-evident bag by its holder, in view of both witnesses. No shard is ever photographed, transcribed, or spoken aloud. Holders do not observe each other's shards.",
          "Verification without reconstitution. Derive the public address on each device and confirm all derivations agree. This proves the material is correct without ever assembling the secret.",
          "Test transaction. Send a dust amount in and out using the real quorum path and the real signing procedure. A key that has never signed is a key you do not know works.",
          "Seal the evidence package. Log, seal numbers, device serials, firmware versions, witness attestations, recording hash, and the signed script. Store two copies in separate custody.",
          "Recovery rehearsal, 14 to 30 days later. A different threshold subset reconstitutes into a fresh device in a fresh ceremony and signs a test transaction. Then re-shard. This is the step organisations skip and the step that catches the transcription error."
        ]
      },
      {
        kind: "compare",
        title: "Shamir sharding versus native multisig",
        left: {
          title: "Shamir secret sharing",
          items: [
            "One key, split into shares; reconstitution assembles the whole secret in one place",
            "Works for any chain, any signature scheme, including chains with no multisig primitive",
            "Cheaper: one signature, one address, no contract",
            "The reconstitution moment is a single point of total compromise; whoever is in that room could keep a copy",
            "No on-chain record of who participated, so no accountability trail",
            "Rotation means a new ceremony and a new address"
          ]
        },
        right: {
          title: "Native or contract multisig",
          items: [
            "n keys that never meet; there is no moment where a whole secret exists",
            "Chain-dependent, and on EVM introduces contract risk including the delegatecall surface",
            "On-chain attribution: you can prove which signers approved which action",
            "Signer set can be rotated without moving funds or changing the address",
            "Policy can be enforced in the contract via guards, allowlists and limits",
            "Requires quorum liveness discipline, or you get frozen instead of stolen"
          ]
        }
      },
      {
        kind: "callout",
        title: "Default, and when to deviate",
        body: "Default to native or contract multisig for anything with an operating cadence, and reserve Shamir for a genuinely cold recovery seed that is expected to be reconstituted at most once, under duress, with counsel present. The common anti-pattern is Shamir-sharding the operating treasury key because it is simpler to set up; you have then made every routine movement require assembling a full secret in a room, which is the exact event you built the ceremony to make rare."
      },
      {
        kind: "checklist",
        title: "Evidence package contents",
        items: [
          "Signed ceremony script, with any deviation initialled by both witnesses at the moment it occurred",
          "Timestamped scribe log with a line per step and the names present",
          "Photographs of unopened device seals with serial numbers legible, taken before opening",
          "Firmware versions and vendor attestation results for every device used",
          "Numbered tamper-evident bag identifiers mapped to shard holders, held by a party who holds no shard",
          "Derived public address and the test transaction hash",
          "Cryptographic hash of the ceremony recording, published or notarised so later substitution is detectable",
          "Written attestations from the internal and external witnesses",
          "The recovery rehearsal report, which is part of the same package and not a separate document"
        ]
      },
      {
        kind: "metric",
        title: "The number that matters",
        body: "Reconstitution success rate on first rehearsal attempt. Across organisations that actually run rehearsals, first-attempt failure is common, and the cause is almost never cryptographic: it is a transcribed character, a shard stored in a location the holder no longer has access to, a device model no longer obtainable, or a holder who has left the company. Track it. A ceremony with no rehearsal has an unknown reconstitution rate, which for planning purposes you should treat as zero."
      }
    ],
    sources: [
      { label: "NIST SP 800-57 Part 1 Rev 5 — Recommendation for Key Management", note: "The general discipline: key states, crypto-periods, separation of duties, and why key material handling procedures must be documented before use rather than after." },
      { label: "SEAL Security Frameworks — Treasury Operations and Wallet Security", note: "Crypto-native operational guidance on treasury movement authorisation, custody separation and signer device posture." },
      { label: "SLIP-0039 — Shamir's Secret Sharing for Mnemonic Codes", note: "The specification behind most hardware Shamir implementations, including two-level group sharing. Read it before choosing thresholds; the group structure is more expressive than most teams realise.", url: "https://github.com/satoshilabs/slips/blob/master/slip-0039.md", checked: "2026-11-04" },
      { label: "NCC Group — In-depth technical analysis of the Bybit hack", note: "Included here deliberately: a flawless ceremony followed by a compromised signing interface still loses the funds. The ceremony is necessary and nowhere near sufficient." },
      { label: "NIST SP 800-88 Rev 2 — Guidelines for Media Sanitization", note: "Published September 2025, superseding Rev 1. Governs how you destroy the media used during a ceremony, including scratch paper and failed shard writes." }
    ]
  },
  {
    id: "sg-dao-governance-attack-model",
    title: "The DAO Governance Attack Model",
    domain: "Blockchain Security",
    kind: "model",
    statement: "Governance is the one attack surface where the exploit is executed by the protocol itself, exactly as designed, with a valid vote behind it.",
    summary: "A decision framework for reasoning about governance risk: the four capital regimes an attacker can occupy, the five structural levers, worked application to the Beanstalk flash-loan takeover and the Tornado Cash proposal-bytecode substitution, and the limits of the model.",
    minutes: 30,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Cost of control versus value controlled",
        body: "The whole model reduces to one inequality. If the cost of acquiring decisive voting power, for the duration required, is less than the value that power can extract, the protocol is not governed, it is merely unclaimed. Everything else is a way of raising the left side or lowering the right side. Note the phrase for the duration required: that is where flash loans live, and it is why timelocks are not a bureaucratic nicety but the primary defensive parameter."
      },
      {
        kind: "table",
        title: "The four capital regimes",
        headers: ["Regime", "How power is acquired", "Duration held", "Primary defence"],
        rows: [
          ["Transient", "Flash loan or same-block borrow", "One transaction", "Snapshot voting power at a block before the proposal; never read balance at execution time"],
          ["Rented", "Borrowing markets, vote markets, delegation-for-hire", "Hours to weeks", "Timelock longer than the borrow is economical; vote-escrow with lock duration weighting"],
          ["Accumulated", "Open-market purchase of a low-float, low-participation token", "Weeks to months", "Raise quorum, raise proposal threshold, guardian veto, buyback of the surface itself"],
          ["Delegated", "Persuasion, sockpuppets, or capture of large delegates", "Indefinite", "Delegate accountability, identity-weighted or reputation-weighted components, disclosure of delegate conflicts"]
        ]
      },
      {
        kind: "list",
        title: "The five structural levers",
        items: [
          "Voting power snapshot. Where in time is power measured? A snapshot at proposal creation defeats transient capital entirely; a read at execution invites it. This is the single highest-leverage parameter in the whole system.",
          "Timelock. How long between passage and execution? The timelock is the community's only exit window and the only period in which a monitoring alert can turn into a human response. Emergency paths that bypass the timelock are where the losses concentrate.",
          "Proposal payload binding. Is the executed code bound to the reviewed code? If a proposal points at an address rather than at a hash of bytecode, then CREATE2 plus SELFDESTRUCT lets an address be redeployed with different code between vote and execution. This is the Tornado Cash lesson.",
          "Quorum and threshold. Quorum protects against apathy capture; threshold protects against narrow-margin capture. Set quorum against observed participation, not aspirational participation, and re-derive it quarterly.",
          "Scope of what governance may touch. Every parameter governance can change is a parameter an attacker can change. Constitutional immutability for the highest-value functions costs flexibility and buys survival."
        ]
      },
      {
        kind: "timeline",
        title: "Worked application one: Beanstalk, April 2022",
        items: [
          "Precondition — Governance included an emergencyCommit path that let a proposal with a two-thirds supermajority execute after 24 hours, and voting power was read from deposits.",
          "Acquisition — The attacker took a flash loan and deposited into the Diamond contract, reaching 79 percent of votes. Transient capital, held for one transaction, crossing a supermajority threshold.",
          "Execution — Two prepared proposals drained protocol assets, part to the attacker and part to a Ukraine donation address as noise.",
          "Loss — 181 million dollars removed, roughly 76 million retained after loan repayment and slippage.",
          "Model reading — Regime: transient. Failed lever: voting power snapshot. The governance code involved had not been audited, which is a scope failure on top of a design failure."
        ]
      },
      {
        kind: "timeline",
        title: "Worked application two: Tornado Cash governance, May 2023",
        items: [
          "Precondition — Proposals executed code at a target address, and reviewers evaluated the code that was at that address at review time.",
          "Preparation — The attacker deployed the proposal logic via CREATE2, so the address was derivable and reusable, and included a self-destruct path.",
          "Review — The community read benign code at the target address and voted to approve.",
          "Substitution — Before execution, the contract self-destructed and was redeployed at the identical address with malicious logic that granted the attacker overwhelming voting power.",
          "Execution — With control of governance, the attacker could reach the protocol's own governance holdings.",
          "Model reading — Regime: transitions from delegated to accumulated by fiat. Failed lever: proposal payload binding. Reviewing an address rather than a bytecode hash is reviewing a pointer, not a program."
        ]
      },
      {
        kind: "checklist",
        title: "Governance pre-mortem, run before any parameter change ships",
        items: [
          "Is voting power snapshotted at or before proposal creation, and is that enforced in code rather than convention?",
          "Is there any path, named emergency or otherwise, that executes faster than your monitoring plus human response time? Measure the response time first, then set the timelock above it.",
          "Does the proposal system bind execution to a bytecode hash, or only to an address? If only an address, assume substitution is possible and require an on-execution code hash check.",
          "What is the market cost, right now, of acquiring your quorum through borrowing markets, and how does that compare to the treasury?",
          "Which single delegate, if compromised, moves you past threshold? Name them. If the answer is nobody, verify it against current delegation data rather than the last time someone checked.",
          "Can the guardian or veto role be exercised in the timelock window by a person who is reachable at 3 a.m. on a Sunday, and has that been drilled?",
          "Is the governance contract itself in the audit scope of your most recent review, at the deployed commit?",
          "If governance is captured, what remains out of reach? If the answer is nothing, you have no constitutional layer, only a treasury with a voting interface."
        ]
      },
      {
        kind: "callout",
        title: "Where the model breaks",
        body: "This model assumes the attacker's payoff is extraction from the protocol. It does not cover two real cases. First, governance attacks whose payoff is external: shutting down a competitor, forcing a listing, or acquiring a legal position, where the attacker will spend more than they can extract. Second, slow capture through legitimate accumulation and genuine participation, where no rule is broken and the protocol simply changes hands. The inequality gives you no defence against a well-capitalised, patient, publicly identified acquirer. That is a governance design question, not a security one, and it belongs in front of the board rather than in the runbook."
      }
    ],
    sources: [
      { label: "Halborn — Explained: the Beanstalk hack, April 2022", note: "Documents the emergencyCommit 24-hour path, the two-thirds threshold, and the 79 percent of votes obtained via flash-loaned deposit. Precise on the mechanism." },
      { label: "OpenZeppelin — Tornado Cash governance attack post-mortem", note: "The reference account of the CREATE2 plus self-destruct proposal-substitution technique and why reviewing an address is not reviewing code." },
      { label: "Compound — Governor Bravo and the timelock architecture", note: "Read the contracts, not the marketing: getPriorVotes snapshotting, proposal threshold, quorum and the timelock delay are the four parameters this model turns on." },
      { label: "Curve Finance — vote-escrow (veCRV) design", note: "The canonical lock-duration-weighted voting design. Study it as the mitigation for rented capital, and study its own failure mode: vote markets that re-rent the escrowed power." },
      { label: "Chainalysis 2026 Crypto Crime Report", note: "Context for scale and attacker sophistication in 2025, including the dominance of operational and access-based compromise over pure contract logic flaws." },
      { label: "SEAL Security Frameworks — Multisig for Protocols", note: "Governance and multisig are the same problem at different thresholds. The emergency protocol and guardian sections apply directly to timelock veto design." }
    ]
  },
  {
    id: "sg-onchain-incident-response",
    title: "On-Chain Incident Response",
    domain: "Blockchain Security",
    kind: "playbook",
    statement: "You cannot contain an on-chain incident by pulling a cable. Containment is a transaction, it is public, it costs money, and you get one attempt with an audience.",
    summary: "The full procedure for the first six hours of a live protocol exploit: triage that distinguishes drain from anomaly, the pause decision and its second-order costs, war room composition, when and how to reach SEAL 911, the whitehat and negotiation path, and the disclosure sequence that keeps you out of a second incident.",
    minutes: 40,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Every containment action is itself an announcement",
        body: "In enterprise IR you can isolate a host and nobody outside knows for hours. On chain, calling pause is a broadcast to every searcher, every copycat, and every journalist watching your contract. The pause transaction sits in a public mempool before it lands, which means the attacker can see it coming and front-run it. Plan containment as a communications event and a technical one simultaneously, and assume the window between decision and effect is adversarial."
      },
      {
        kind: "numbered",
        title: "T plus zero to sixty minutes",
        items: [
          "Declare. One named person declares the incident. Do not wait for certainty; declaring is cheap and un-declaring is cheap. The failure mode is a 40-minute debate about whether this is real while funds leave.",
          "Establish the war room out of band. A channel that does not depend on your normal SSO, on the compromised laptop, or on a service the attacker may already be inside. Decide this channel now, while nothing is on fire, and rehearse joining it.",
          "Assign four roles: Incident Commander (decides, does not investigate), Chain Analyst (tracks funds and the attacker address set), Contract Lead (owns the pause or upgrade transaction), Comms Lead (owns every external word). One person may not hold two of these.",
          "Establish ground truth from chain state, not from dashboards. Read balances and the implementation address directly from an RPC you trust. Dashboards lag, and if the attacker changed the proxy implementation, indexers may show you a stale interpretation.",
          "Classify: is value leaving right now, is value at risk but static, or is this an anomaly with no loss? These three have completely different playbooks and the most common error is running the drain playbook against an anomaly and pausing a healthy protocol.",
          "Quantify the remaining exposure. Not what is gone; what can still go. That number, and only that number, justifies the pause decision.",
          "Preserve evidence: transaction hashes, attacker addresses, the exact block of first anomalous behaviour, the calldata, and a snapshot of frontend assets if a web compromise is suspected. Frontend evidence disappears when you deploy the fix.",
          "If the exposure is material or you lack in-house expertise, reach SEAL 911 now rather than at hour four. Bringing in help is not an admission of failure; it is the cheapest hour you will spend."
        ]
      },
      {
        kind: "table",
        title: "The pause decision, with its second-order effects",
        headers: ["Option", "Stops the bleed", "Second-order cost you must state out loud"],
        rows: [
          ["Pause everything", "Yes, if the pause path is not itself exploitable", "Freezes honest users' funds, breaks integrators, and converts a security incident into a solvency rumour. Also confirms to the attacker that you noticed."],
          ["Pause the affected market only", "Partially", "Requires you to be right about the blast radius under pressure. Attackers pivot to the market you left open."],
          ["Rate-limit or lower caps", "Slows it", "Buys hours, not safety, and only helps if the exploit is throughput-bound rather than one-shot."],
          ["Whitehat rescue: extract remaining funds yourself before the attacker", "Yes, for what you rescue", "You are now moving user funds without user consent, via a path that looks identical to theft on chain. Requires pre-agreed authority, counsel, and immediate public disclosure of the rescue address."],
          ["Do nothing, monitor", "No", "Correct surprisingly often for anomalies and for exploits already complete. Doing nothing loudly, with a public status update, is a legitimate action."]
        ]
      },
      {
        kind: "checklist",
        title: "Pre-conditions that must exist before the incident",
        items: [
          "The pause function has been executed on mainnet at least once, in a drill, by the people who will execute it under pressure. An untested pause is a hypothesis.",
          "The pause quorum is smaller than the treasury-movement quorum, and its signers are geographically distributed across timezones so 3 a.m. is covered.",
          "A war room channel exists that survives the compromise of your primary identity provider, and every responder has joined it once in the last quarter.",
          "SEAL 911 contact procedure is written down somewhere reachable from a phone, and someone on the team has used it in a non-emergency to confirm the path works.",
          "A Safe Harbor position is decided and published: what a whitehat may do with your funds, what bounty they get, and where to return assets. Deciding this mid-incident produces a negotiation, not a rescue.",
          "Monitoring alerts on invariant violation, not just on large transfers. The Bybit-class event is a proxy implementation change, which moves no unusual value at the moment it happens.",
          "A pre-drafted disclosure skeleton exists, with the legal review already done on the template so only facts need filling in.",
          "Every integrator and major LP has an out-of-band contact you can reach in under 30 minutes."
        ]
      },
      {
        kind: "timeline",
        title: "Hours one to six",
        items: [
          "H+1 — Public acknowledgement. Short, factual, no speculation on cause, no dollar figure you are not certain of, and an explicit next-update time. Silence is read as either incompetence or an exit.",
          "H+1 to H+2 — Root cause hypothesis with an owner and a falsification test. Write down what evidence would prove the hypothesis wrong. Incidents go sideways when the first hypothesis becomes doctrine.",
          "H+2 — Funds tracing and exchange notification. Contact centralised venues and bridge operators with attacker addresses. Speed matters enormously here; freezing is a race measured in tens of minutes.",
          "H+2 to H+4 — Decide on the negotiation posture and let one named person own it. Public bounty offers made by three different people on three channels destroy your leverage.",
          "H+4 — Integrator briefing. Anyone whose product reads your state needs to know before their users do.",
          "H+6 — Second public update whether or not there is news. Meeting your own stated update cadence is most of the reputational recovery."
        ]
      },
      {
        kind: "compare",
        title: "The two post-incidents",
        left: {
          title: "Incident that repeats",
          items: [
            "Root cause recorded as human error, with no analysis of why the system permitted the error",
            "Fix ships to the exploited path only",
            "Disclosure written by comms alone, engineering never reads it",
            "No change to monitoring, because the exploit was obvious in hindsight",
            "The runbook is updated but never drilled",
            "The person who declared the incident is quietly blamed"
          ]
        },
        right: {
          title: "Incident that compounds into strength",
          items: [
            "Root cause traced to a missing invariant, and that invariant added to the property suite so it can never regress",
            "The whole class is remediated, including paths not exploited this time",
            "Disclosure is technically precise enough that peers can check their own systems, published with the transaction hashes",
            "A detection rule is written that would have fired at the first anomalous block, and it is tested against the historical data",
            "The pause path is drilled within 30 days, with different people",
            "Declaring early is publicly praised, so the next declaration is faster"
          ]
        }
      },
      {
        kind: "callout",
        title: "The 3 a.m. problem",
        body: "Roughly half of on-chain exploits land outside your working hours; attackers pick the hour deliberately, and DPRK-linked operations in particular run against your calendar rather than theirs. Your real detection-to-response time is not your best case, it is the time it takes to wake a threshold of signers who are asleep in the same timezone. Measure it once, unannounced. The number is usually three to five times what the team estimates, and it is the number that determines whether your timelock and your pause path are usefully configured."
      }
    ],
    sources: [
      { label: "SEAL Security Frameworks — Incident Management", note: "Community-maintained crypto-native IR guidance covering war room setup, roles and escalation. The closest thing the industry has to a shared standard." },
      { label: "SEAL 911 emergency contact channel", note: "A volunteer whitehat responder network for live crypto incidents. Verify the current contact path in advance; the value is entirely in having used it before you need it." },
      { label: "SEAL Safe Harbor Agreement", note: "A standardised legal framework for whitehat rescue of funds during an active exploit. Adopting it in advance converts a mid-incident legal negotiation into a pre-signed authority." },
      { label: "NIST SP 800-61 Rev 3 — Incident Response Recommendations and Considerations", note: "The 2025 revision, restructured around the Cybersecurity Framework 2.0 functions. Use it for the lifecycle discipline; supply the on-chain specifics yourself." },
      { label: "Chainalysis 2026 Crypto Crime Report", note: "For the tracing and exchange-notification phase: how stolen funds move, and why stablecoin dominance at 84 percent of illicit volume changes who you need to call." },
      { label: "NCC Group — In-depth technical analysis of the Bybit hack", note: "Study it as an IR case: the detection signal was a proxy implementation change, not an unusual transfer. Design alerts accordingly." }
    ]
  },
  {
    id: "sg-permanence-decision-model",
    title: "The Permanence Decision Model: Arweave, IPFS, and What You Actually Owe",
    domain: "Decentralized Infrastructure",
    kind: "model",
    statement: "Permanence is a liability before it is a feature. Decide what you are forbidden to delete before you decide what you want to keep forever.",
    summary: "A decision framework for choosing a decentralized storage posture: the four properties people conflate under permanence, the availability versus durability distinction that IPFS makes and most teams miss, the endowment assumption Arweave runs on, and the regulatory obligations that make raw permanence unusable without an encryption layer.",
    minutes: 25,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Four properties, one word",
        body: "Teams say permanent and mean one of four different things: integrity (the bytes have not changed), availability (I can fetch it now), durability (it will still exist in ten years), and censorship resistance (no single party can make it unfetchable). Content addressing gives you integrity for free and nothing else. Pinning gives availability. Economic endowment aims at durability. Replication across independent jurisdictions gives censorship resistance. A design that assumes one of these implies the others is the design that loses data."
      },
      {
        kind: "table",
        title: "The comparison people should be making",
        headers: ["Property", "IPFS alone", "IPFS plus pinning service", "IPFS plus Filecoin deals", "Arweave"],
        rows: [
          ["Integrity", "Yes, via CID", "Yes", "Yes", "Yes"],
          ["Availability", "Only while some node caches it", "Yes, while you pay and the provider exists", "Yes, subject to retrieval markets", "Yes, via the gateway and miner set"],
          ["Durability", "None. Garbage collection is the default fate", "Contractual, not cryptographic; provider failure is your failure", "Deal-backed with on-chain proofs and penalties", "Endowment-backed, aiming at very long horizons"],
          ["Payment model", "None", "Recurring subscription", "Recurring deals, renewable", "One-time fee at upload"],
          ["Deletion", "Unpin and wait for GC", "Unpin; other copies may persist", "Let deals lapse; copies may persist", "Not possible by design"],
          ["Main failure mode", "You assumed the network stored it", "Vendor concentration and a lapsed card", "Deal expiry nobody was watching", "You published something you are later legally required to remove"]
        ]
      },
      {
        kind: "quote",
        body: "IPFS makes content discoverable but provides no guarantee of persistent availability.",
        source: "IPFS documentation, Persistence, permanence and pinning"
      },
      {
        kind: "numbered",
        title: "The decision sequence",
        items: [
          "Classify the data by deletion obligation first. Three buckets: must be deletable on demand (personal data under GDPR erasure rights, anything a user can revoke consent for), must be retained for a fixed period, and must never be deletable (audit trails, protocol history, published attestations). This classification, not the technology, drives everything after it.",
          "For anything in the must-be-deletable bucket, permanence is disqualifying unless you encrypt and manage the key so that key destruction is your deletion mechanism. Read the crypto-shredding field note before you rely on this; it has real preconditions.",
          "Decide whether you need availability or durability. A frontend build artifact needs availability and can be rebuilt; a legal attestation needs durability and can tolerate a slow fetch. They are different products.",
          "Choose the payment horizon you can actually honour. A recurring pinning subscription is a permanent operational obligation attached to a person who will change jobs. If the data must outlive your team's attention, a one-time endowment model is a genuinely different risk profile, and the risk you are accepting is an economic assumption rather than an operational one.",
          "Decide the failure signal. Whichever you pick, define how you would learn that the data became unavailable. Most permanence failures are discovered by a user, years later, which is the worst possible detection channel.",
          "Write the assumption you are betting on, in one sentence, in the architecture record. For pinning: the vendor stays solvent and the card keeps working. For Filecoin: deals get renewed by an owned process. For Arweave: storage cost continues to decline fast enough for the endowment to fund replication over the intended horizon. All three are bets. Name yours."
        ]
      },
      {
        kind: "compare",
        title: "Two ways teams get this wrong",
        left: {
          title: "Permanence theatre",
          items: [
            "Content is pinned to one hosted service and described in the whitepaper as stored on IPFS forever",
            "The CID is published as if the CID were the storage",
            "No monitoring for retrievability; nobody has fetched the object since launch",
            "Deletion requests are handled by unpinning, which is described to the regulator as deletion",
            "The subscription is on a founder's personal card"
          ]
        },
        right: {
          title: "Permanence as an owned obligation",
          items: [
            "At least two independent pinning providers plus a self-hosted node, in different jurisdictions",
            "A scheduled job fetches a random sample of CIDs from a network vantage point outside your infrastructure and alerts on failure",
            "Personal data never written to any content-addressed store in plaintext, ever, regardless of pinning posture",
            "Deletion means key destruction, with the key lifecycle documented and the erasure claim scoped honestly",
            "Renewal and payment ownership assigned to a role, not a person, and tested by removing that person for a quarter"
          ]
        }
      },
      {
        kind: "callout",
        title: "The clause that ends most permanence architectures",
        body: "The right to erasure and the right to rectification both assume a controller who can act on data. Public content-addressed storage with third-party replication has no such controller. If you put personal data on it, you have created an obligation you cannot discharge, and no amount of unpinning changes that, because unpinning does not reach copies you never controlled. The only defensible pattern is: plaintext personal data never touches the permanent layer; ciphertext may, with keys held in a system where destruction is provable. Design that boundary at the schema level, before the first upload, because after the first upload it is unfixable."
      },
      {
        kind: "checklist",
        title: "Before you publish anything irrevocably",
        items: [
          "Has this content been reviewed for personal data, including indirect identifiers in metadata, EXIF, filenames and error strings?",
          "If this were later found to contain illegal content uploaded by a user, what is your remediation story, and does it exist?",
          "Is the encryption key for this content, if any, held somewhere with a documented destruction procedure and a crypto-period?",
          "Does the CID or transaction id get recorded somewhere durable that is not itself on the permanent layer, so you can audit what you published?",
          "Is there a rollback for the pointer, if not for the content? Mutable pointers to immutable content is usually the right shape.",
          "Have you tested retrieval from a network location with no relationship to your infrastructure, from a cold cache?",
          "Does your threat model include the gateway operator, who is a centralisation point even when the storage layer is not?"
        ]
      }
    ],
    sources: [
      { label: "IPFS documentation — Persistence, permanence and pinning", note: "The primary source on garbage collection, local pinning, MFS, and the explicit statement that discoverability is not availability. Read it before writing the word permanent in a design doc." },
      { label: "Filecoin specification — Storage deals and proofs", note: "Proof of Replication and Proof of Spacetime are what convert a promise into an economically penalised commitment. This is the mechanism that makes durability more than a vendor claim." },
      { label: "Arweave yellow paper", note: "The endowment mechanism: a one-time fee funding perpetual storage under an assumed long-run decline in storage cost. Read the assumption explicitly; it is the entire bet." },
      { label: "GDPR Articles 17 and 5(1)(e) — erasure and storage limitation", note: "The legal constraint that makes raw permanence unusable for personal data. Article 5(1)(e) is the one people forget: storage limitation is a principle, not just a right you can wait to be invoked." },
      { label: "NIST SP 800-88 Rev 2 — Guidelines for Media Sanitization", note: "September 2025, superseding Rev 1. Its treatment of cryptographic erase is the standard you will be measured against if you claim key destruction equals deletion." },
      { label: "IPFS documentation — Content addressing and CIDs", note: "For the integrity property specifically, and for understanding why a CID is a verification mechanism rather than a storage location." }
    ]
  },
  {
    id: "sg-crypto-shredding-field-note",
    title: "Field Note: Crypto-Shredding Is a Contract, Not a Trick",
    domain: "Data Security",
    kind: "field-note",
    statement: "Destroying the key deletes the data only if you can prove every copy of that key is gone and the ciphertext will never face a stronger adversary than today's.",
    summary: "A narrow note on cryptographic erasure: the four preconditions that make it defensible, the per-subject key architecture that makes it operable at scale, the backup and derived-data problems that silently break it, and the honest wording to use with a regulator.",
    minutes: 20,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why this exists",
        body: "You will eventually own a system where data cannot be physically deleted: an append-only ledger, an immutable object store, a data lake with time-travel, a content-addressed network, or simply backups that predate the deletion request by four years. Crypto-shredding is the only mechanism that lets you make a defensible deletion claim about such a system. It is also routinely oversold. NIST recognises cryptographic erase as a sanitisation technique, and simultaneously constrains it more tightly than any other technique on the list. Both facts matter."
      },
      {
        kind: "list",
        title: "The four preconditions. Miss one and the claim is false",
        items: [
          "The data was encrypted from the moment it was first written, with no plaintext ever landing on the target medium. Encrypting after the fact leaves plaintext remnants in exactly the places you cannot enumerate: log files, page cache, temp directories, and prior backup generations.",
          "The key is unique to the deletion unit. If one key covers a million users, destroying it deletes a million users. Per-subject or per-tenant keys are not an optimisation; without them the technique has no useful granularity.",
          "Every copy of the key is enumerable and destructible, including the copies in the key manager's own backups, in HSM export bundles, in escrow, in a developer's environment file, and in the memory of a long-running process. Key sprawl is the single most common reason a crypto-shred claim collapses under audit.",
          "The algorithm and key length are strong enough that undecryptable-now means undecryptable-for-the-retention-horizon-of-the-ciphertext. Ciphertext that persists forever must resist an adversary you do not get to observe. This is where store-now-decrypt-later and post-quantum migration stop being abstract."
        ]
      },
      {
        kind: "code",
        title: "The architecture that makes it operable",
        lang: "text",
        body: "subject_key   : one AES-256 DEK per data subject (or per tenant)\n              : lives only in the KMS/HSM, never in application memory beyond use\n              : wrapped by a KEK held in a separate trust domain\n\nrecord        : ciphertext, wrapped under subject_key\n              : stored anywhere, including immutable and permanent media\n\nkey_manifest  : subject_id -> key_id, plus every location a copy has\n                ever existed (kms region, dr replica, escrow, backup set)\n\nerasure       : 1. destroy subject_key in primary KMS\n                2. destroy in every replica named in the manifest\n                3. destroy or expire every backup generation containing\n                   the wrapped key, or accept a stated residual window\n                4. purge derived plaintext: caches, search indexes,\n                   analytics aggregates, model training sets, embeddings\n                5. record a certificate of erasure with timestamps,\n                   operator, and the residual window\n\nfailure mode  : step 4 is the one that is skipped, and it is the one\n                that reproduces the data in a form no key protects",
        source: "Structure follows the cryptographic erase conditions in NIST SP 800-88 and the manifest discipline needed to satisfy an auditor."
      },
      {
        kind: "callout",
        title: "The derived-data problem, which nobody solves in the first design",
        body: "Encryption protects the record. It does not protect what the record produced. A user's data reaches a search index as tokens, a metrics store as counters, a warehouse as a joined row, an ML pipeline as an embedding, and a model as weights. Destroying the key touches none of these. Before you promise crypto-shredding, map the derived-data graph downstream of the encrypted store and decide, per node, whether it is re-derivable (rebuild after erasure), independently erasable (delete by subject id), or contaminated (must be rebuilt from scratch on any erasure). Embeddings and trained models are almost always in the third category, and that has budget consequences you want to discover in design, not in a regulator's letter."
      },
      {
        kind: "compare",
        title: "What you can honestly say",
        left: {
          title: "Overclaim, do not write this",
          items: [
            "The data has been permanently deleted",
            "Crypto-shredding satisfies our erasure obligations in full",
            "The ciphertext is meaningless and therefore is no longer personal data",
            "Backups are covered because they are encrypted",
            "We can erase on demand within 24 hours"
          ]
        },
        right: {
          title: "Defensible, write this",
          items: [
            "The unique decryption key for this subject has been destroyed in all locations recorded in the key manifest as of the stated timestamp",
            "Ciphertext remains on immutable media and is expected to be irrecoverable for as long as the algorithm remains sound; we treat it as personal data subject to residual controls",
            "Backup generations created before the erasure retain the wrapped key until they expire on the stated date, which is our documented residual window",
            "Derived stores were rebuilt or purged as follows, with dates",
            "A certificate of erasure is available, naming the operator, the locations, and the residual window"
          ]
        }
      },
      {
        kind: "checklist",
        title: "The audit questions to ask yourself first",
        items: [
          "Can you produce, today, a complete list of every location a given subject key has ever existed, including deleted infrastructure?",
          "Does your KMS backup itself, and if so, does destroying a key in the live system remove it from those backups, or merely from the live view?",
          "What is your longest backup retention, and are you willing to state that as the residual window in writing?",
          "Has any process ever logged plaintext, including on the error path, during a migration, or in a debug build that reached production?",
          "If your KMS provider were compelled to produce a key that you believe you destroyed, could they?",
          "Is the deletion action itself audited immutably, so you can prove when it happened as well as that it happened?",
          "Does the ciphertext outlive the estimated cryptographic lifetime of the algorithm you chose, and if so what is the migration plan?"
        ]
      },
      {
        kind: "metric",
        title: "The number to track",
        body: "Key manifest completeness: the percentage of subject keys for which an automated inventory can enumerate every storage location, verified by an independent scan rather than by the manifest asserting itself. Below 100 percent, your erasure claim has a hole of exactly that size. Teams that measure this for the first time usually land between 60 and 80 percent, and the missing portion is almost always disaster-recovery replicas and a key-escrow arrangement made years ago by someone who has left."
      }
    ],
    sources: [
      { label: "NIST SP 800-88 Rev 2 — Guidelines for Media Sanitization", note: "Published September 2025, superseding Rev 1 which was withdrawn on 26 September 2025. The authority on Clear, Purge and Destroy, and on the conditions attached to cryptographic erase. Cite the revision explicitly; auditors notice." },
      { label: "NIST SP 800-57 Part 1 Rev 5 — Recommendation for Key Management", note: "Key states, crypto-periods and the destruction state. Your erasure procedure is a key-state transition, and this is the document that defines what that means." },
      { label: "GDPR Article 17 and EDPB guidance on erasure", note: "The obligation being satisfied. Note that pseudonymised and encrypted personal data remains personal data to the controller who holds or could obtain the key." },
      { label: "IPFS documentation — Persistence, permanence and pinning", note: "Read alongside this note: content-addressed networks are the canonical case where physical deletion is unavailable and crypto-shredding is the only route." },
      { label: "NIST IR 8547 — Transition to Post-Quantum Cryptography Standards", note: "Relevant because permanent ciphertext must resist a future adversary. If your ciphertext horizon exceeds the algorithm's, key destruction is not a durable erasure claim.", url: "https://csrc.nist.gov/pubs/ir/8547/ipd", checked: "2026-11-04" }
    ]
  },
  {
    id: "sg-decentralized-compute-sandboxing",
    title: "Decentralized Compute Sandboxing Checklist",
    domain: "Decentralized Infrastructure",
    kind: "checklist",
    statement: "In decentralized compute the workload does not trust the operator and the operator does not trust the workload, and exactly one of those threats is usually designed for.",
    summary: "A pre-flight checklist for running untrusted code on infrastructure you do not control, or untrusted workloads on infrastructure you do: isolation boundary selection, the escape surfaces that survive each choice, TEE attestation verification done properly, egress control, and the side-channel risks you must accept in writing.",
    minutes: 22,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Name the direction of distrust before choosing a technology",
        body: "There are two problems and they need different tools. Protecting the host from the workload is a sandboxing problem, solved by syscall interception, virtualization and seccomp. Protecting the workload from the host is a confidential computing problem, solved by memory encryption and remote attestation, and it is strictly harder because the adversary owns the hardware, the hypervisor and the power supply. Decentralized compute networks need both simultaneously, in opposite directions, which is why most of them quietly solve only the first and market the second."
      },
      {
        kind: "table",
        title: "Isolation boundaries and what survives them",
        headers: ["Boundary", "Protects host from workload", "Protects workload from host", "What still gets through"],
        rows: [
          ["Namespaces plus seccomp (plain container)", "Weakly; the full host syscall surface is reachable", "No", "Any kernel LPE, and every container escape CVE of the last five years"],
          ["gVisor (userspace kernel)", "Strongly; syscalls are reimplemented in the Sentry, not passed through", "No", "Hardware side channels, host network service flaws, and anything outside the documented ABI"],
          ["Firecracker or Cloud Hypervisor microVM", "Strongly; a real hardware boundary with minimal device emulation", "No", "Side channels, hypervisor escapes, and the host's own management plane"],
          ["Confidential VM (AMD SEV-SNP, Intel TDX)", "Yes, plus the host cannot read guest memory", "Yes, subject to correct attestation", "Side channels, faulty attestation verification, and a compromised firmware or microcode supply chain"],
          ["Confidential GPU (H100-class CC mode)", "Yes", "Yes, for the accelerator path", "Performance cost, driver trust, and the fact that the model is decrypted inside the enclave and can be dumped if the enclave is broken"]
        ]
      },
      {
        kind: "quote",
        body: "A sandbox is not a substitute for a secure architecture.",
        source: "gVisor documentation, Security Model"
      },
      {
        kind: "checklist",
        title: "Pre-flight: running untrusted workloads on your infrastructure",
        items: [
          "Isolation boundary is a userspace kernel or a microVM, not namespaces alone. If someone argues that a hardened container is enough, ask them to name the last three container escapes and explain why the next one is different.",
          "Default egress is deny. Not filtered, not logged: denied, with an explicit allowlist. Cryptomining and data exfiltration both die here, and nothing else you do matters as much.",
          "The workload cannot reach the cloud instance metadata endpoint. This is the single most exploited path from workload to full account compromise, and it is one route rule.",
          "The scheduler treats the workload identity as untrusted input, so a malicious job cannot influence its own placement onto a node with different privileges.",
          "Resource limits cover the dimensions people forget: pids, open file descriptors, disk iops, and egress bandwidth, not just cpu and memory. Fork bombs and log-flood billing attacks are cheap and common.",
          "The node is cattle: no persistent state across jobs, and the disk image is reconstructed rather than cleaned. Cleaning implies you enumerated what to clean.",
          "Nothing on the node holds a credential with blast radius beyond that node. Node-scoped, short-lived, workload-identity-bound credentials only.",
          "Side-channel exposure is decided explicitly: are you co-tenanting untrusted workloads on the same physical core with SMT enabled? If yes, that is a documented accepted risk, not an oversight."
        ]
      },
      {
        kind: "checklist",
        title: "Pre-flight: running your workload on infrastructure you do not control",
        items: [
          "Attestation is verified by your own relying party, against your own policy, before any secret is released. If the attestation is checked by code running on the untrusted host, you have verified nothing.",
          "The attestation policy pins measurements, not just vendor signatures: firmware version, kernel and initramfs measurement, and the exact image digest. Accepting any signed enclave accepts an enclave the operator built.",
          "Freshness is enforced with a nonce you generated. Replayed attestation quotes are the classic bypass.",
          "Certificate and endorsement chains are validated against the silicon vendor root, with revocation checked. TCB version thresholds are enforced so a downlevel, known-vulnerable firmware fails closed.",
          "Secrets reach the enclave only after attestation succeeds, via a key release service that you operate, and they are never written to any disk the operator can read.",
          "Data at rest and in transit inside the environment is encrypted with keys that only exist inside the attested boundary.",
          "You have accepted, in writing, that a TEE does not defend against physical attacks with unlimited access, nor against microarchitectural side channels, and you have decided whether your data is worth that residual.",
          "There is a plan for the day the vendor discloses a TEE break: which workloads must stop, which keys must rotate, and how you learn about it."
        ]
      },
      {
        kind: "callout",
        title: "The economic attack nobody sandboxes for",
        body: "In a permissionless compute network the interesting attack is often not escape, it is verification fraud: returning a plausible result without doing the work, or doing the work incorrectly in a way that is expensive to detect. Sandboxing does nothing here. The mitigations are different in kind: redundant execution with cross-checking, random spot re-execution by a verifier who is paid for disagreement, deterministic execution so results are comparable at all, and staking with slashing so being caught costs more than the work saved. If your design has flawless isolation and no answer to lazy or lying providers, you have secured the wrong axis."
      },
      {
        kind: "metric",
        title: "Measure the boundary, not the config",
        body: "Escape attempt detection rate against a known corpus: run a deliberately hostile workload suite, containing published container escape proofs of concept, metadata-endpoint probes, and egress attempts, on every image change. What you want is not zero attempts, it is 100 percent of attempts blocked and 100 percent alerted. A boundary that blocks silently teaches you nothing and hides the day it stops blocking."
      }
    ],
    sources: [
      { label: "gVisor documentation — Security Model", note: "The clearest available statement of what a userspace kernel does and does not defend against, including the explicit disclaimers on hardware side channels and host network services. Read the Sentry section." },
      { label: "Firecracker design documentation (AWS)", note: "The microVM device model and why minimal emulation is the security argument. Useful counterpoint to gVisor when you need a hardware boundary." },
      { label: "Confidential Computing Consortium — A Technical Analysis of Confidential Computing", note: "Vendor-neutral treatment of TEEs, threat models, and explicitly what confidential computing does not protect against." },
      { label: "AMD SEV-SNP ABI specification and Intel TDX architecture specification", note: "The primary sources for attestation report structure and TCB versioning. Your relying-party verifier must be written against these, not against a vendor SDK sample." },
      { label: "NIST SP 800-190 — Application Container Security Guide", note: "Dated in places, still the reference for container threat taxonomy and for arguing the case that namespaces are not a security boundary." },
      { label: "MITRE ATT&CK for Containers", note: "Technique-level grounding for the escape and credential-access paths your detection rules should cover." }
    ]
  },
  {
    id: "sg-llm-threat-model-template",
    title: "LLM Application Threat Model: The Fill-In Document",
    domain: "AI Security",
    kind: "template",
    statement: "An LLM threat model that does not enumerate trust boundaries by data provenance is a list of worries, not a model.",
    summary: "The actual template text for an LLM application threat model: system decomposition by trust boundary, a provenance table, the attack enumeration keyed to OWASP LLM Top 10 2025 and MITRE ATLAS, control mapping, residual risk acceptance, and the review trigger conditions. Copy it and fill it in.",
    minutes: 35,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "How to use this",
        body: "Fill it in with the engineers who built the system in the room, in one sitting, in under two hours. A threat model written asynchronously by a security engineer alone is a document about what they imagine the system does. The value is concentrated in section 2: if you cannot fill in the provenance table, you have found the finding, because it means nobody knows which text reaching the model is attacker-controlled."
      },
      {
        kind: "code",
        title: "Sections 1 to 3",
        lang: "markdown",
        body: "# LLM Application Threat Model\n\nSystem: <name>            Version: <semver / commit>\nOwner: <named engineer>   Reviewer: <named, not the owner>\nDate: <date>              Next review trigger: see section 7\n\n## 1. What this system does, in two sentences\n<Plain language. If it takes more than two sentences, the scope is wrong;\nsplit it.>\n\n## 2. Data provenance and trust boundaries\nEvery string that can reach the model context, classified.\n\n| Source | Provenance | Attacker-controllable? | Reaches context as | Sanitisation |\n|---|---|---|---|---|\n| System prompt | First party | No (unless leaked) | Prefix | n/a |\n| End-user message | Semi-trusted | Yes, by that user | Turn | none |\n| Retrieved documents | Third party | Yes, if any writer is untrusted | Injected block | delimit + provenance tag |\n| Tool call results | Varies per tool | Per tool | Turn | per tool |\n| Web fetch content | Untrusted | Yes, fully | Turn | quarantine |\n| Prior conversation | Semi-trusted | Yes, cumulative | History | none |\n| Document / image / audio uploads | Untrusted | Yes | Multimodal input | quarantine |\n\nRule: the moment any row says Yes in column 3, every downstream capability\nis reachable by an attacker unless a structural control prevents it.\n\n## 3. Capability inventory\nEvery action the system can take in the world.\n\n| Capability | Reversible? | Blast radius | Requires human approval? | Reachable after untrusted input? |\n|---|---|---|---|---|\n| <tool name> | y/n | <scope> | y/n | y/n |\n\nAny row that is irreversible, wide blast radius, no human approval, and\nreachable after untrusted input is a finding. Write it as one.",
        source: "Provenance-first decomposition; the capability table operationalises the lethal trifecta as a per-row test."
      },
      {
        kind: "code",
        title: "Sections 4 to 7",
        lang: "markdown",
        body: "## 4. Attack enumeration\nWork the list; delete nothing without writing why it does not apply.\n\n| Ref | Attack | Applies? | Path in this system | Control | Residual |\n|---|---|---|---|---|---|\n| LLM01 | Prompt injection, direct and indirect | | | | |\n| LLM02 | Sensitive information disclosure | | | | |\n| LLM03 | Supply chain (models, adapters, packages, MCP servers) | | | | |\n| LLM04 | Data and model poisoning | | | | |\n| LLM05 | Improper output handling (downstream XSS, SQLi, SSRF, code exec) | | | | |\n| LLM06 | Excessive agency | | | | |\n| LLM07 | System prompt leakage | | | | |\n| LLM08 | Vector and embedding weaknesses | | | | |\n| LLM09 | Misinformation and overreliance | | | | |\n| LLM10 | Unbounded consumption (cost, DoS, model extraction) | | | | |\n\nCross-reference each applicable row to MITRE ATLAS technique ids so the\ndetection team can map coverage.\n\n## 5. Controls, classified\nStructural controls constrain what is possible. Probabilistic controls\nreduce how often something happens. List them separately and never let a\nprobabilistic control close a finding on its own.\n\nStructural:\n- <e.g. the agent that reads untrusted content holds no credentials>\n- <e.g. egress allowlist prevents exfiltration to attacker domains>\n- <e.g. all writes require a human approval on a rendered diff>\n\nProbabilistic:\n- <e.g. injection classifier on retrieved content, measured recall X%>\n- <e.g. system prompt hardening>\n\n## 6. Residual risk acceptance\n| Risk | Why not fixed | Accepted by (name, role) | Review date |\n|---|---|---|---|\n\nAcceptance requires a named human with budget authority. Security cannot\naccept risk on behalf of the business.\n\n## 7. Review triggers\nThis model is void and must be redone when any of the following occur:\n- a new tool or capability is added\n- a new untrusted data source reaches the context\n- the model or model version changes\n- the system gains the ability to act without a human in the loop\n- any incident involving this system\n- 12 months elapse",
        source: "Structural versus probabilistic control separation, per the design-patterns literature on provable resistance."
      },
      {
        kind: "principle",
        title: "The one rule that makes the template work",
        body: "A probabilistic control may never be the sole mitigation for a high-impact finding. Injection classifiers, output filters and prompt hardening are all worth having and none of them are boundaries. A vendor claiming to catch 95 percent of attacks is describing a control that fails one time in twenty against a random attacker and rather more often against one who is trying. Use them to reduce noise and to detect. Use architecture to make the bad outcome impossible."
      },
      {
        kind: "table",
        title: "Filling in section 5: which pattern applies",
        headers: ["If the system must...", "Use this structural pattern", "What you give up"],
        rows: [
          ["Trigger actions from user intent, no tool output fed back", "Action-Selector: the model picks a tool, never sees the result", "Multi-step reasoning over results"],
          ["Do multi-step work on untrusted data with fixed intent", "Plan-Then-Execute: plan is fixed before untrusted content is seen", "Adapting the plan to what is found"],
          ["Summarise or classify many untrusted documents", "LLM Map-Reduce: sub-agents return constrained values, coordinator aggregates", "Rich free-text synthesis from any single document"],
          ["Handle untrusted content while holding privileges", "Dual LLM: quarantined model returns symbolic variables the privileged model never reads", "Implementation complexity and latency"],
          ["Compose arbitrary logic over untrusted data", "Code-Then-Execute: privileged model emits code in a sandboxed DSL, data flow is analysable", "Expressiveness, and you must build the DSL"],
          ["Return results without leaking the prompt", "Context-Minimization: strip the user prompt and unnecessary context before responding", "Some conversational coherence"]
        ]
      },
      {
        kind: "callout",
        title: "What a reviewer should reject",
        body: "Send it back if: section 2 has any blank provenance cell; section 3 has no capability marked irreversible when the system can send email, spend money, write to a repository or delete anything; section 5 lists only probabilistic controls; section 6 is empty, which means either nothing was found or nothing was honest; or the reviewer is the same person as the owner. Empty residual risk sections are the strongest signal that a threat model was performed rather than done."
      }
    ],
    sources: [
      { label: "OWASP Top 10 for LLM Applications 2025", note: "LLM01 through LLM10 as used in section 4. Note the 2025 additions: System Prompt Leakage, Vector and Embedding Weaknesses, and Unbounded Consumption replacing the narrower denial-of-service framing." },
      { label: "MITRE ATLAS", note: "The adversarial ML tactic and technique knowledge base. Use it to give section 4 rows machine-readable ids that your detection engineering team can map coverage against." },
      { label: "Beurer-Kellner et al. — Design Patterns for Securing LLM Agents against Prompt Injections (arXiv 2506.08837)", note: "Source of the six patterns in the control-selection table, with the thesis that constraint after untrusted ingestion must be structural. Ten worked case studies including SQL agent, email assistant and SWE agent." },
      { label: "NIST AI 600-1 — Generative AI Profile", note: "For mapping your findings to a governance framework the board and auditors already recognise, particularly the Information Security and Information Integrity risk categories." },
      { label: "Simon Willison — The lethal trifecta for AI agents", note: "The clearest statement of the trust-boundary test that section 3's last column encodes. Read it before filling in the capability inventory." },
      { label: "OWASP Agentic AI — Threats and Mitigations", note: "Extends the LLM Top 10 to multi-agent and tool-using systems, which is where section 3 gets hard." }
    ]
  },
  {
    id: "sg-lethal-trifecta-checklist",
    title: "The Lethal Trifecta Agent Design Checklist",
    domain: "AI Security",
    kind: "checklist",
    statement: "If an agent has private data, untrusted content, and a way to talk to the outside world, it will eventually be made to combine them. Remove a leg or accept the loss.",
    summary: "A design-review checklist for any agent that holds credentials: how to test each leg of the trifecta honestly, the composition traps where three safe tools become one unsafe system, the exfiltration channels people forget, and the sign-off questions that force an architectural answer rather than a guardrail.",
    minutes: 20,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "The trifecta is a structural test, not a risk score",
        body: "The three legs are access to private data, exposure to untrusted content, and the ability to communicate externally. Any two are survivable. All three in the same trust context means a single crafted string reaching the model can cause your data to leave, with no software vulnerability anywhere in the traditional sense. The test is binary and it is per trust context, not per product. The right question in a design review is never how likely is injection, it is which leg are we removing."
      },
      {
        kind: "checklist",
        title: "Leg one: does this agent access private data?",
        items: [
          "Enumerate every credential, token, cookie and session the agent's process can use, including ambient ones: cloud instance metadata, kubelet identity, a mounted service account token, an SSH agent socket, and the developer's own git credentials.",
          "Include the filesystem. An agent with read access to a home directory has access to private data even if you gave it no API keys.",
          "Include the conversation. Prior turns containing a customer's data are private data, and they persist in context long after the turn that fetched them.",
          "Include implicit authority: if the agent runs as a user who is already authenticated to an internal system, it has that data whether or not you handed it a secret.",
          "If the honest answer is yes for any of these, this leg is present. Do not argue it down on the basis that access is read-only."
        ]
      },
      {
        kind: "checklist",
        title: "Leg two: is the agent exposed to untrusted content?",
        items: [
          "Any web page fetched, any search result summarised, any URL a user pastes.",
          "Any document, PDF, spreadsheet, image or audio file uploaded by anyone, including by trusted users who received it from elsewhere. Instructions hide in image pixels and in white-on-white text.",
          "Any retrieved document from a corpus that has more than one writer, including your own wiki, your own ticket system, and your own code comments. Internal is not the same as trusted.",
          "Any tool result from a third-party API. An MCP server's tool descriptions are themselves attacker-controlled if you did not write the server.",
          "Any content authored by another agent, including your own sub-agents that read untrusted content. Taint propagates through agents exactly as it propagates through functions.",
          "Any issue, comment, commit message, filename or branch name in a repository that accepts outside contributions."
        ]
      },
      {
        kind: "checklist",
        title: "Leg three: can data leave? The channels people forget",
        items: [
          "Obvious: send email, post a message, create an issue or pull request, write to a shared document, call an arbitrary HTTP endpoint.",
          "Markdown image rendering. If the client renders an image the model emits, the URL is a GET with attacker-chosen query parameters, and the data is gone before anyone sees anything. This has been the actual mechanism in multiple real incidents.",
          "Link rendering plus a plausible reason to click. Rendering is exfiltration with one extra step.",
          "DNS. Any tool that resolves a hostname the model chose is an exfiltration channel with no HTTP involved.",
          "Writes to any store a third party can read, including a public bucket, a shared calendar, a public repository, or a support ticket the attacker opened.",
          "Error messages and telemetry that include prompt content and are shipped to a vendor.",
          "Slow channels: a model that can set a single bit repeatedly, through retries or through a status field, can exfiltrate a key given enough turns."
        ]
      },
      {
        kind: "table",
        title: "Composition: three safe tools, one unsafe system",
        headers: ["Tool A", "Tool B", "Tool C", "Why the composition is lethal"],
        rows: [
          ["Read public issues", "Read private repositories", "Open a pull request", "Untrusted instruction in a public issue causes private code to be written into a PR on a public fork. Each tool is individually reasonable."],
          ["Search the web", "Read the user's email", "Render markdown in the client", "A poisoned search result instructs the agent to embed inbox contents in an image URL. No tool needed to send anything."],
          ["Read a shared calendar", "Query the CRM", "Send a meeting invite", "An attacker who can create a calendar event on your calendar has an injection channel into a system holding customer records."],
          ["Read a support ticket", "Query the internal knowledge base", "Reply to the ticket", "The customer who filed the ticket writes the injection and receives the exfiltrated answer in the reply, entirely inside the intended workflow."]
        ]
      },
      {
        kind: "compare",
        title: "Removing a leg, in practice",
        left: {
          title: "Weak mitigations that leave all three legs",
          items: [
            "Instruct the model to ignore instructions found in retrieved content",
            "Wrap untrusted content in delimiters and hope",
            "Run an injection classifier and proceed on a pass",
            "Ask the user to confirm with a modal that summarises the action in prose the model wrote",
            "Log everything and plan to detect abuse afterwards"
          ]
        },
        right: {
          title: "Structural removals",
          items: [
            "Remove data: the agent that reads untrusted content runs with no credentials and no filesystem access, and returns constrained values to a privileged caller",
            "Remove untrusted content: retrieve only from a corpus with a single trusted writer and an approval gate",
            "Remove egress: strict outbound allowlist at the network layer, markdown image rendering disabled, no arbitrary URL fetch",
            "Remove autonomy on the dangerous edge: irreversible actions require a human approving a rendered, non-model-authored diff",
            "Split the trust context: two agents, two identities, one narrow typed interface between them"
          ]
        }
      },
      {
        kind: "callout",
        title: "Sign-off question for the design review",
        body: "Ask exactly this: assume the attacker fully controls one document this agent will read, and knows our system prompt and our tool schemas. Walk me through what they can cause to happen. If the answer requires the model to behave correctly, the design has all three legs and no boundary. If the answer is that the worst case is a wrong summary, you have removed a leg and you can ship. Do not accept an answer that starts with the model would not, because the entire field is built on the fact that it might."
      }
    ],
    sources: [
      { label: "Simon Willison — The lethal trifecta for AI agents: private data, untrusted content, and external communication", note: "The origin of the framing, June 2025, with the essential point that vendor guardrails cannot help once a user combines tools themselves. Also the source of the scepticism about 95 percent catch rates." },
      { label: "Beurer-Kellner et al. — Design Patterns for Securing LLM Agents against Prompt Injections (arXiv 2506.08837)", note: "The formal counterpart: once an agent has ingested untrusted input it must be constrained so that input cannot trigger consequential actions. Six patterns, ten case studies." },
      { label: "Invariant Labs — GitHub MCP server exfiltration research", note: "The worked composition case: public issues as untrusted input, private repository access, pull request creation as the exfiltration channel. Read it as the canonical three-tool trap.", url: "https://invariantlabs.ai/blog/mcp-github-vulnerability", checked: "2026-11-04" },
      { label: "OWASP Top 10 for LLM Applications 2025 — LLM06 Excessive Agency", note: "The control framing for leg three: minimise extensions, minimise permissions, minimise autonomy, and require human approval for high-impact actions." },
      { label: "MITRE ATLAS", note: "For mapping trifecta-enabled outcomes to named adversary techniques, which is what makes them legible to a detection team and to a regulator." }
    ]
  },
  {
    id: "sg-prompt-injection-field-note",
    title: "Field Note: Prompt Injection Is Not a Model Problem",
    domain: "AI Security",
    kind: "field-note",
    statement: "You cannot patch prompt injection, because there is no bug. The model is doing exactly what it was built to do: follow instructions in its context.",
    summary: "A narrow note on why detection-based defence plateaus, what the maths of a 95 percent filter actually means at scale, the four defences that hold, how to talk to a vendor about it, and the two places where probabilistic controls genuinely earn their cost.",
    minutes: 24,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "The shape of the problem",
        body: "Every classical injection vulnerability, SQL, command, template, has the same fix: separate the control channel from the data channel, so instructions and data travel in different lanes and the interpreter can never confuse them. Parameterised queries work because the database is told, structurally, this is data. Language models have no such separation and cannot be given one by prompting, because the entire context is one channel by construction. This is why prompt injection has survived three years of concentrated effort by every frontier lab, and why treating it as a bug awaiting a patch is a planning error rather than an opinion."
      },
      {
        kind: "metric",
        title: "What a 95 percent filter means",
        body: "Take a filter that blocks 95 percent of injection attempts. Against a random adversary sending 20 payloads, one lands. Against a determined adversary, the number is worse than that, because attackers do not sample randomly: they iterate against the filter until they find a payload that passes, then reuse it. The 5 percent is not a residual, it is a search space with a free oracle. Meanwhile at one million legitimate requests per day, even a 0.1 percent false positive rate is a thousand broken user interactions daily, which is the number that actually gets the filter turned down. Detection controls degrade in both directions under load."
      },
      {
        kind: "list",
        title: "Four defences that hold, in order of strength",
        items: [
          "Capability removal. The agent that touches untrusted content cannot do the harmful thing, because it does not hold the credential or the tool. This is the only defence that is not probabilistic, and it is the only one that survives an attacker who is smarter than you.",
          "Egress control at the network layer. Even a fully hijacked agent cannot exfiltrate to a host that DNS will not resolve and the proxy will not reach. Enforce it below the application, where the model has no vote.",
          "Human approval on a non-model-authored rendering. The human must see the actual diff, the actual destination address, the actual recipient list, generated by deterministic code from the real payload, not a summary written by the possibly-hijacked model. A model-written confirmation dialog is part of the attack surface.",
          "Provenance-aware execution. Track which values in the working state derive from untrusted input, and refuse to let tainted values flow into sensitive parameters. This is the Code-Then-Execute idea: emit code in a constrained language where the data flow can be analysed, rather than letting the model act freely."
        ]
      },
      {
        kind: "compare",
        title: "Two things that look similar and are not",
        left: {
          title: "Jailbreak",
          items: [
            "The user is the adversary",
            "Target is the model's policy: get it to produce disallowed content",
            "Harm lands mostly on the provider and on third parties",
            "Mitigated by training, policy, classifiers and refusal behaviour",
            "Better models measurably help",
            "Failure is embarrassing"
          ]
        },
        right: {
          title: "Prompt injection",
          items: [
            "A third party is the adversary; the user is the victim",
            "Target is the application's authority: get the agent to use its legitimate permissions against its principal",
            "Harm lands on the user and on the deploying organisation",
            "Mitigated only by architecture; training helps at the margin and never closes it",
            "Better models can make it worse, because a more capable agent has more capabilities to misuse",
            "Failure is a breach"
          ]
        }
      },
      {
        kind: "code",
        title: "The taint discipline, written out",
        lang: "python",
        body: "# The rule: a value derived from untrusted input may never reach a\n# sensitive parameter. Enforce it in the harness, not in the prompt.\n\nTAINTED = set()   # ids of values derived from untrusted sources\n\ndef fetch_page(url):\n    body = http_get(url)\n    TAINTED.add(id(body))\n    return body\n\ndef send_email(to, subject, body):\n    # 'to' is a sensitive parameter: it determines where data goes.\n    if id(to) in TAINTED:\n        raise PolicyViolation('recipient derived from untrusted content')\n    # 'body' being tainted is fine only if 'to' is not attacker-chosen\n    return mail.send(to, subject, body)\n\n# What this buys you: a page that says 'email the summary to\n# attacker@example.com' cannot choose the recipient, no matter how\n# persuasive it is, because the recipient came from a tainted string.\n# What it does not buy you: protection when the legitimate recipient\n# is the attacker, as in a support-ticket workflow.",
        source: "Mechanism follows the information-flow reasoning behind the Code-Then-Execute and Dual LLM patterns."
      },
      {
        kind: "callout",
        title: "Where probabilistic controls do earn their cost",
        body: "Two places, and only two. First, detection and telemetry: a classifier that flags likely injection attempts gives you an incident signal and a corpus of real attacks against your own system, which is worth far more than the blocking. Second, raising the cost of casual attacks so your team's attention goes to the serious ones. What they must never do is close a finding. Write them in the probabilistic column of your threat model, measure their recall against your own red team corpus rather than the vendor's, and never let a control whose recall you have not personally measured be the reason an irreversible capability is allowed."
      },
      {
        kind: "quote",
        body: "Once an LLM agent has ingested untrusted input, it must be constrained so that it is impossible for that input to trigger any consequential actions.",
        source: "Beurer-Kellner et al., Design Patterns for Securing LLM Agents against Prompt Injections"
      },
      {
        kind: "list",
        title: "Questions to put to a vendor, and the answers that disqualify",
        items: [
          "What is your recall on attacks authored after your last training update? Disqualifying answer: a single number with no date attached.",
          "What is your false positive rate at that operating point, on our traffic distribution? Disqualifying answer: measured on a public benchmark.",
          "Does your product change what an agent is capable of, or only what it is likely to do? Disqualifying answer: any that avoids the word likely.",
          "If your classifier fails open, what happens? Disqualifying answer: it does not fail.",
          "Does your control sit in the same trust domain as the thing it protects? Disqualifying answer: yes, delivered as a library in the agent process, with no explanation of why that is acceptable.",
          "Show me an attack that defeats your product. Disqualifying answer: none exists. Every honest vendor in this space has a list."
        ]
      }
    ],
    sources: [
      { label: "Simon Willison — The lethal trifecta for AI agents", note: "Including the direct argument that a 95 percent catch rate is failure rather than success in a security context, and the incident list spanning Microsoft 365 Copilot, GitHub MCP, GitLab Duo and others." },
      { label: "Beurer-Kellner et al. — Design Patterns for Securing LLM Agents against Prompt Injections (arXiv 2506.08837)", note: "The six patterns and their utility-security tradeoffs. The Code-Then-Execute pattern is the formal version of the taint discipline shown above." },
      { label: "OWASP Top 10 for LLM Applications 2025 — LLM01 Prompt Injection", note: "The canonical enumeration of direct and indirect injection, and the reference every auditor and customer questionnaire will point at." },
      { label: "Greshake et al. — Not what you've signed up for: compromising real-world LLM-integrated applications with indirect prompt injection", note: "The 2023 paper that named indirect prompt injection and demonstrated it end to end. Still the clearest exposition of why retrieval turns any writer into an instruction source." },
      { label: "MITRE ATLAS — LLM Prompt Injection techniques", note: "Gives the technique ids you need to make injection legible in a detection coverage matrix rather than in prose." },
      { label: "Debenedetti et al. — AgentDojo", note: "A dynamic benchmark for evaluating agent robustness to prompt injection with realistic tasks. Use its methodology to measure your own controls instead of accepting vendor numbers." }
    ]
  },
  {
    id: "sg-model-weights-custody-model",
    title: "Model Weights Custody: Applying the RAND Security Levels",
    domain: "AI Security",
    kind: "model",
    statement: "Weights are the only asset in your company that is simultaneously worth billions, small enough to fit on a drive, and useful to the thief in exactly the form you store it.",
    summary: "A decision model for weight custody built on RAND's five security levels: which attacker each level defends against, the honest self-assessment questions per level, the six control families that actually move you up a level, and the organisational costs that make SL4 and SL5 different in kind rather than in degree.",
    minutes: 32,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "The asset has no dilution",
        body: "Most stolen assets degrade in the thief's hands: a stolen database goes stale, stolen money gets traced, stolen source code still requires the team that wrote it. Model weights do not degrade. A copied weights file is a complete, immediately usable instance of the capability, requiring no further access, no insider, and no ongoing relationship. There is no revocation, no rotation, and no expiry. This is why weight security is not an instance of data security with higher numbers; it is a different problem whose closest analogue is nuclear material accounting."
      },
      {
        kind: "table",
        title: "The five levels, and what each is actually claiming",
        headers: ["Level", "Defends against", "Representative actor", "The claim you are making"],
        rows: [
          ["SL1", "Opportunistic and amateur attacks", "An individual using off-the-shelf tools and public exploits", "We are not trivially breached by someone who is not trying hard"],
          ["SL2", "Capable, non-targeted attackers", "Professional cybercriminal groups running broad campaigns", "We survive being caught in a commodity campaign"],
          ["SL3", "Targeted, well-resourced non-state actors", "Top cybercrime syndicates, insider threats with moderate resources", "Someone deliberately targeting us must spend real money and time"],
          ["SL4", "Standard operations of the most capable state actors", "Leading state intelligence services running routine operations", "A nation-state must run a priority operation, not a routine one"],
          ["SL5", "Top-priority operations of the most capable states", "A state willing to spend its best capabilities and accept exposure", "Even a maximum-effort state operation is likely to fail"]
        ]
      },
      {
        kind: "prose",
        title: "How to place yourself honestly",
        body: "RAND's framing identifies 38 meaningfully distinct attack vectors spanning cyber, physical, insider and supply chain. Your level is set by your weakest vector, not your average. The common self-assessment error is to score the cyber column, where the organisation has invested, and to ignore the insider and supply-chain columns, where it has not. If a single administrator can copy weights without a second human, you are at SL2 regardless of how good your network segmentation is. If your inference hardware arrives through a supply chain nobody has ever audited, your ceiling is set there. Score the floor."
      },
      {
        kind: "list",
        title: "The six control families that move you up a level",
        items: [
          "Access architecture. Move from role-based access to per-action, time-bounded, multi-party authorisation on any operation that can read weights in bulk. The target property is that no single human account, including the most privileged, can extract weights alone. This is the control that separates SL2 from SL3 more than any other.",
          "Egress physics. At high levels the constraint becomes bandwidth: an interface that cannot move hundreds of gigabytes out of the secure zone, enforced by hardware data diodes and by physically limited links rather than by policy. Rate limiting in software is an SL2 control; physical impossibility is an SL4 one.",
          "Confidential compute. Weights decrypted only inside attested enclaves, including on the accelerator, so that a compromised host, hypervisor or operator cannot read them from memory. This is what closes the largest remaining cyber vector once access is multi-party.",
          "Insider programme. Structured, funded, and designed to make reporting rewarding rather than career-ending. Two-person integrity on weight-touching operations, mandatory code review on anything in the weights path, and no persistent high-privilege standing access. Anthropic's ASL-3 security standard states this directly as removing persistent high-privilege access to model weights.",
          "Supply chain integrity. Reproducible builds, signed artifacts with verified provenance, hardware provenance for accelerators and network gear, and vendor access that is time-boxed and observed. The Bybit lesson applies exactly: the compromise was a developer machine, not a contract.",
          "Physical and personnel. Secure facilities, escorted access, defence against physical exfiltration of drives, and personnel vetting proportionate to the level. This is the family that most AI organisations discover last and that gates SL4 and SL5 absolutely."
        ]
      },
      {
        kind: "compare",
        title: "Why SL4 and above is an organisational change, not a project",
        left: {
          title: "What SL3 costs",
          items: [
            "Meaningful money and a dedicated security team",
            "Friction on privileged workflows, absorbed by tooling",
            "Researchers keep broadly familiar development practices",
            "Cloud infrastructure is still viable with strong controls",
            "Achievable within an ordinary engineering roadmap"
          ]
        },
        right: {
          title: "What SL4 and SL5 cost",
          items: [
            "Research velocity is directly traded away; some workflows become impossible rather than slower",
            "Physical facilities, cleared personnel, and hardware supply chains you control or audit",
            "Confidential computing on every accelerator, with the performance and availability cost that implies",
            "Deep partnership with government, because some of the threat intelligence you need is not commercially available",
            "A culture in which two-person integrity is normal, which cannot be installed in a quarter"
          ]
        }
      },
      {
        kind: "checklist",
        title: "The self-assessment that produces a real number",
        items: [
          "Can any single human, with no second approval, cause a full copy of production weights to exist outside the secure zone? If yes, you are at SL2 at best.",
          "Is there a physical or hardware limit on outbound bandwidth from the weights zone, or only a policy limit?",
          "Are weights ever in plaintext in host memory on a machine an operator can access? Is that operator population enumerated?",
          "Does your logging record every read of the weights, and is that log in a trust domain that the people with access cannot alter?",
          "Have you tested detection of a slow exfiltration: 200 gigabytes over 30 days through an approved channel, by an authorised person?",
          "Do you know the provenance of your accelerators, and could you detect a substituted firmware?",
          "Is there any vendor with standing remote access to a machine that can reach weights, and when was that last reviewed?",
          "What is your response if a weights copy is confirmed exfiltrated? Rotation is not available. Write the actual plan; its absence is itself a finding."
        ]
      },
      {
        kind: "callout",
        title: "The limit of the model",
        body: "The levels describe defence against theft. They say nothing about three adjacent risks that are often larger. First, authorised misuse: weights that never leave, used internally for something the organisation should not do. Second, capability leakage through the deployed interface, where distillation and model extraction reproduce much of the capability without touching the file. Third, insider sabotage rather than theft, including backdoors introduced during training, which no exfiltration control addresses. Use the levels for what they measure, and hold the other three risks in a separate register so they do not vanish behind a good SL score."
      }
    ],
    sources: [
      { label: "RAND — Securing AI Model Weights: Preventing Theft and Misuse of Frontier Models (RR-A2849-1, May 2024)", note: "The source of SL1 to SL5, the 38 attack vectors across cyber, physical, insider and supply chain, and the benchmark systems per level. Read the attack vector taxonomy before the levels; the taxonomy is the more useful artifact." },
      { label: "Anthropic — Responsible Scaling Policy", note: "A concrete implementation: ASL-3 Security Standard requires multi-party authorisation and mandatory code review to remove persistent high-privilege access to weights, plus a structured insider threat programme. Read what it explicitly excludes from scope as well." },
      { label: "Institute for Security and Technology — Security Level 5 Task Force", note: "Over 50 participants developing a technical roadmap and standard for SL5 across cyber, physical, insider and supply chain. The live work on what the top level actually requires." },
      { label: "Confidential Computing Consortium — technical analysis of confidential computing", note: "For the enclave control family: what memory encryption and attestation actually guarantee, and the explicit list of what they do not." },
      { label: "NIST SP 800-53 Rev 5 — AC-3(2) dual authorisation and related controls", note: "The control catalogue language to use when you need multi-party authorisation to survive a procurement or audit conversation rather than being described as a bespoke practice." },
      { label: "NCC Group — In-depth technical analysis of the Bybit hack", note: "Cross-domain but directly on point for the supply-chain family: the entry point was a developer machine, and every downstream cryptographic control held perfectly while the asset left." }
    ]
  },
  {
    id: "sg-ai-red-team-program",
    title: "Standing Up an AI Red Team Program",
    domain: "AI Security",
    kind: "playbook",
    statement: "An AI red team that reports findings to the model team and nowhere else is a testing service. A red team that can stop a launch is a control.",
    summary: "How to build an AI red team from zero: the seven method families and what each is actually good for, staffing and independence, the pre-deployment gate and its authority, corpus and regression discipline, measuring a function whose success looks like nothing happening, and the failure modes that quietly turn it into theatre.",
    minutes: 40,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Independence is the whole design",
        body: "Everything else about an AI red team is method selection. The structural question is whether the team can say no and have it stick. If the red team reports into the organisation shipping the model, its findings are negotiable and its severity ratings will drift downward over quarters in a way nobody will notice from inside. Put it on a reporting line that terminates somewhere with launch authority and no launch incentive, give it a written escalation path, and define in advance what class of finding blocks a release. Do this on day one, because you cannot retrofit independence onto a team that has spent a year being helpful."
      },
      {
        kind: "table",
        title: "The seven method families",
        headers: ["Method", "Best at finding", "Structural weakness", "When to use it"],
        rows: [
          ["Domain expert red teaming", "Harms only a specialist can recognise: CBRN uplift, medical error, legal misadvice", "Expensive, slow, and access-constrained; you cannot cover many domains", "Pre-deployment for any capability touching a regulated or high-harm domain"],
          ["Policy vulnerability testing", "Gaps between written policy and actual behaviour, with trust and safety partners", "Only tests policies you have written; blind to unarticulated harms", "Continuously, with external partners on child safety, elections, extremism"],
          ["Frontier threat red teaming", "National security relevant capabilities: cyber offence, autonomy, bio", "Requires cleared or trusted experts and secure handling of the findings themselves", "At capability thresholds, tied to a scaling policy"],
          ["Multilingual and multicultural", "Harms that only exist outside English, and safety training that did not transfer", "Scalability; you cannot cover every language and culture", "Before any launch in a new locale, with local partners, not translators"],
          ["Automated red teaming", "Breadth, regression, and rediscovery of known classes at scale", "Finds what it was designed to find; weak on genuinely novel attacks", "Continuously in CI, as the regression harness"],
          ["Multimodal", "Cross-modality attacks: instructions in images, audio, and documents", "Complexity grows combinatorially with modalities", "Any system that accepts a file or an image, which is now most systems"],
          ["Crowdsourced and community", "Genuine novelty, unusual mental models, and the attack nobody on staff would think of", "Unsystematic coverage, variable quality, and disclosure handling overhead", "Periodically, as a diversity injection; never as your only method"]
        ]
      },
      {
        kind: "numbered",
        title: "The first ninety days",
        items: [
          "Week 1 to 2 — Write the charter: scope, authority, escalation path, what blocks a launch, and who may override. Get it signed by whoever owns launch decisions. This document is the team.",
          "Week 2 to 4 — Build the harm taxonomy for your product, not a generic one. Ground it in NIST AI 600-1 risk categories so it maps to governance, then add the categories specific to your domain. A payments assistant and a coding agent share almost nothing at the leaf level.",
          "Week 3 to 6 — Stand up the corpus and the harness before hiring more people. Every attack anyone finds goes into a versioned corpus with an expected-behaviour assertion, and the corpus runs on every model and prompt change. Without this, findings evaporate and the same bug ships twice.",
          "Week 4 to 8 — Run the first manual campaign against the highest-risk surface. Timebox it. Publish the findings internally with severity, exploitability, and a named owner per finding.",
          "Week 6 to 10 — Establish the external partner relationships that take longest to build: domain experts, trust and safety organisations, and locale partners. These have lead times measured in months and you want them in place before you need them.",
          "Week 8 to 12 — Define and publish the pre-deployment gate: which evaluations must run, what thresholds block, who signs off, and how an exception is granted and recorded. An exception process that exists is far healthier than one that is invented under launch pressure.",
          "Week 10 to 12 — Run the first gate for real on a low-stakes release, so the mechanism is exercised before it matters. The first time you block a launch should not also be the first time you use the process."
        ]
      },
      {
        kind: "compare",
        title: "Red team versus evaluation, which people conflate",
        left: {
          title: "Evaluation",
          items: [
            "Fixed benchmark, known answers, comparable across models",
            "Measures the average case and tracks progress over time",
            "Automatable and cheap to rerun",
            "Optimisable, and therefore eventually gamed by the training process",
            "Answers: is this model better than the last one"
          ]
        },
        right: {
          title: "Red teaming",
          items: [
            "Open-ended, adversarial, seeking the worst case rather than the average",
            "Measures what a motivated human can make happen",
            "Expensive, human-intensive, and not directly comparable across runs",
            "Resistant to gaming precisely because the target moves",
            "Answers: what is the worst thing achievable, and by whom"
          ]
        }
      },
      {
        kind: "metric",
        title: "Measuring a function whose success is absence",
        body: "Do not measure findings count; it rewards volume and punishes the team that hardened the system. Measure four things. Time to first successful attack on a new surface, tracked over releases: rising is good, and a sudden drop is a signal. Escape rate: findings discovered externally or in production that the programme should have caught, expressed as a fraction of total findings. Regression rate: previously fixed attacks that pass again, which should be near zero and rarely is. Coverage: the fraction of your harm taxonomy with at least one active probe, honestly scored, including the leaves nobody has tested."
      },
      {
        kind: "callout",
        title: "The four ways this becomes theatre",
        body: "First, the team becomes a launch checkbox and its findings arrive too late to change anything; fix by moving the gate earlier and giving it teeth. Second, it only tests the model and never the application, so the injection that matters, the one going through your retrieval pipeline into your tool calls, is out of scope. Third, findings are fixed by adding refusal training, which moves the behaviour rather than removing the capability, and the regression corpus then measures the patch rather than the class. Fourth, the corpus is never rerun because it is slow, so the programme silently degrades into a series of one-off campaigns with no memory."
      },
      {
        kind: "list",
        title: "Findings handling that keeps the team credible",
        items: [
          "Every finding has a reproducible artifact: the exact prompt, the model version, the system configuration, and the observed output, stored in a controlled repository. Findings that cannot be reproduced cannot be fixed or verified.",
          "Severity is assigned by the red team, not negotiated with the model team, using a published rubric that combines harm magnitude, reachability from a realistic attacker position, and reliability of the attack.",
          "High-severity findings that concern dangerous capability information get handled under a separate, more restrictive disclosure process. Your own findings become a proliferation risk at the top end.",
          "Fixes are verified by re-running the artifact, not by the model team asserting the fix. Assertion-based closure is how regression rates get to double digits.",
          "Findings that are accepted rather than fixed go into the same residual risk register the threat model uses, with a named accepting executive and a review date.",
          "External researchers get a published disclosure policy, a real response time commitment, and safe harbour. If you want the community's findings you must be a credible counterparty."
        ]
      }
    ],
    sources: [
      { label: "Anthropic — Challenges in red teaming AI systems", note: "The taxonomy of method families used in the table: domain expert, policy vulnerability testing, frontier threats, multilingual, automated, multimodal, crowdsourced and community, each with its stated strengths and limits." },
      { label: "NIST AI 600-1 — Generative AI Profile", note: "Use its risk categories as the spine of your harm taxonomy so red team findings map directly onto a governance framework auditors already accept." },
      { label: "OWASP Top 10 for LLM Applications 2025", note: "Application-layer coverage the model-centric methods miss. Your red team scope must include the retrieval pipeline, the tool layer and output handling, not only the model." },
      { label: "UK AI Safety Institute — Inspect evaluation framework", note: "An open framework for building the automated half of the programme, with a structure that supports regression corpora rather than one-off scripts." },
      { label: "MITRE ATLAS", note: "For expressing findings as adversary techniques with stable ids, which is what makes red team output legible to the detection team and comparable across releases." },
      { label: "Anthropic — Responsible Scaling Policy", note: "For the gate design specifically: how capability thresholds tie to required safeguards, and what an evaluation-driven launch decision looks like when it is written down in advance." }
    ]
  },
  {
    id: "sg-ai-governance-record-template",
    title: "The AI System Governance Record",
    domain: "AI Governance",
    kind: "template",
    statement: "Governance that cannot produce a dated, signed artifact per system is a set of intentions, and intentions do not survive a regulator, an incident, or a change of leadership.",
    summary: "The actual fill-in text for a per-system AI governance record that satisfies NIST AI RMF function mapping and EU AI Act evidentiary needs simultaneously: classification, obligation determination by date, control mapping, human oversight design, the risk acceptance block, and the events that force a re-issue.",
    minutes: 38,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why one record per system",
        body: "Organisations write an AI policy and think they have governance. A policy is a statement of intent that applies to nothing in particular. What withstands scrutiny is a per-system record: this system, this version, this classification, these obligations, these controls, this named accountable person, this date. When a regulator asks how you determined that a system was not high risk, the answer must be a document with a signature, not a paragraph in a handbook. Write one record per deployed system, keep it in version control next to the code, and make its absence a deployment blocker."
      },
      {
        kind: "code",
        title: "Sections 1 to 3: identity, classification, obligations",
        lang: "markdown",
        body: "# AI System Governance Record\n\nSystem: <name>              Record version: <n>    Date: <date>\nAccountable executive: <name, role>   Technical owner: <name>\nDeployment status: <design / pilot / production / retired>\n\n## 1. Purpose and context  [NIST AI RMF: MAP 1]\n- Intended purpose, in one paragraph:\n- Deployment context and setting:\n- Affected persons, including those who are not users:\n- Foreseeable misuse we are explicitly not designing against:\n- What this system must never be used for:\n\n## 2. Role and classification  [EU AI Act]\n- Our role: provider / deployer / importer / distributor / product manufacturer\n  (Note: fine-tuning or substantially modifying a system can make a deployer\n   into a provider. State the reasoning, not just the conclusion.)\n- Is the system prohibited under Article 5? y/n + reasoning\n- Is it high risk under Annex III or Annex I? y/n + which point + reasoning\n- Is it subject to transparency obligations under Article 50\n  (interacts with humans / generates synthetic content / emotion recognition\n   / deepfakes)? y/n + how the disclosure is implemented\n- Does it use a general-purpose AI model? Which, and from which provider?\n- If we train or place a GPAI model on the market: does it meet the systemic\n  risk threshold? y/n + basis\n\n## 3. Obligation schedule\nObligations attach by date, not by intention. Record which apply now.\n\n| Date | Regime | Applies to us? | Evidence location |\n|---|---|---|---|\n| 2 Feb 2025 | Prohibited practices (Art. 5); AI literacy (Art. 4) | | |\n| 2 Aug 2025 | GPAI model obligations; governance; penalties | | |\n| 2 Aug 2026 | Remainder of the Act incl. Annex III high-risk | | |\n| 2 Aug 2027 | Art. 6(1) product-embedded high risk; GPAI placed before Aug 2025 | | |\n\nAI literacy is the one everyone misses: it applied from February 2025 and\nis an obligation on staff competence, evidenced by training records.",
        source: "EU AI Act application dates per the official implementation timeline; NIST function tags per AI RMF 1.0."
      },
      {
        kind: "code",
        title: "Sections 4 to 7: risk, controls, oversight, acceptance",
        lang: "markdown",
        body: "## 4. Risk identification  [NIST AI RMF: MAP 5, MEASURE 2]\nWork the generative AI risk categories; delete none without a reason.\n\n| Risk | Applies | How it manifests here | Measurement | Owner |\n|---|---|---|---|---|\n| CBRN information or capabilities | | | | |\n| Confabulation | | | | |\n| Dangerous, violent or hateful content | | | | |\n| Data privacy | | | | |\n| Environmental impacts | | | | |\n| Harmful bias or homogenization | | | | |\n| Human-AI configuration | | | | |\n| Information integrity | | | | |\n| Information security | | | | |\n| Intellectual property | | | | |\n| Obscene, degrading or abusive content | | | | |\n| Value chain and component integration | | | | |\n\nColumn 4 is the one that separates real governance from a checklist: if a\nrisk applies and has no measurement, you have named a worry, not managed it.\n\n## 5. Controls  [NIST AI RMF: MANAGE 1, MANAGE 2]\n| Control | Type (structural / probabilistic) | Evidence | Last verified |\n|---|---|---|---|\n\n## 6. Human oversight design  [EU AI Act Art. 14; NIST GOVERN 3]\n- Who is the human, by role, and what is their actual authority?\n- What are they shown, and is it generated deterministically or by the model?\n- What competence and training do they have, and where is that recorded?\n- Can they override, and has an override been exercised in the last quarter?\n- What is the measured automation bias risk: do they ever disagree in practice?\n\nOversight that has never once resulted in a reversal is not oversight; it is\na signature step. Record the reversal rate.\n\n## 7. Residual risk acceptance  [NIST AI RMF: GOVERN 1, MANAGE 4]\n| Residual risk | Why not further mitigated | Accepted by | Role | Date | Review |\n|---|---|---|---|---|---|\n\n## 8. Re-issue triggers\nThis record is void on any of: model or version change; new data source;\nnew capability or tool; change of deployment context or user population;\nany incident; a substantial modification that changes our role under the\nAct; or 12 months elapsed.",
        source: "Risk category names per NIST AI 600-1 Generative AI Profile; oversight fields per EU AI Act Article 14."
      },
      {
        kind: "table",
        title: "Mapping the record to the NIST AI RMF functions",
        headers: ["Function", "What it asks", "Which section answers it"],
        rows: [
          ["GOVERN", "Are accountability, policy and culture in place, and is someone named?", "Header block, sections 7 and 8"],
          ["MAP", "Is context established and are risks identified in that context?", "Sections 1, 2 and 4"],
          ["MEASURE", "Are identified risks analysed, tracked and measured with real methods?", "Section 4 column 4, plus the red team and evaluation evidence it points to"],
          ["MANAGE", "Are risks prioritised, responded to, and monitored over time?", "Sections 5, 6, 7 and the re-issue triggers"]
        ]
      },
      {
        kind: "callout",
        title: "The two determinations to write down most carefully",
        body: "First, the provider-versus-deployer determination. Fine-tuning a model, rebranding a system, or substantially modifying its intended purpose can move you from deployer to provider, which changes your obligations from modest to extensive. Write the reasoning, not the conclusion, because the reasoning is what you will be asked to defend. Second, the high-risk determination. If you concluded not high risk, record which Annex III points you considered and why each does not apply. A blank where a negative determination should be is indistinguishable from never having looked."
      },
      {
        kind: "principle",
        title: "One record, two audiences, no duplication",
        body: "Resist the urge to keep a NIST document and an EU document and an internal document. They diverge within two quarters and then you have three records, none of which is true. Keep one record, tag its sections with the framework references, and generate any regulator-facing extract from it. The test of whether you have succeeded: an engineer changing the model version knows where to update, and does, because there is exactly one place."
      }
    ],
    sources: [
      { label: "NIST AI 100-1 — Artificial Intelligence Risk Management Framework 1.0", note: "The four functions GOVERN, MAP, MEASURE, MANAGE and their categories. Use the tags in the template so your record maps cleanly onto the framework your auditors already know." },
      { label: "NIST AI 600-1 — Generative Artificial Intelligence Profile", note: "The twelve risk categories used verbatim in section 4, from CBRN information through value chain and component integration. Using NIST's exact names is what makes the record legible externally." },
      { label: "EU AI Act — official implementation timeline", note: "Entry into force 1 August 2024; prohibitions and AI literacy 2 February 2025; GPAI obligations and governance 2 August 2025; the remainder 2 August 2026; Article 6(1) and grandfathered GPAI 2 August 2027. Section 3 is built directly on these dates." },
      { label: "EU AI Act — Articles 6, 14, 50 and Annex III", note: "The classification, human oversight and transparency provisions the record must evidence. Read Article 14 closely: it specifies competence and authority, not merely presence." },
      { label: "NIST AI RMF Playbook", note: "Suggested actions per subcategory. Useful when a section of the record is failing review and you need concrete remediation steps rather than a restatement of the outcome." },
      { label: "ISO/IEC 42001 — AI management systems", note: "If you need a certifiable management system wrapper around these records, this is the standard that provides it, and it maps onto the same evidence." }
    ]
  }
];
