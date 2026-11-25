import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-dashevo",
  act: "ACT VI — TRUST",
  order: 12,
  title: "Dash EVO Operator",
  subtitle: "Running infrastructure whose keys move real value, and folding six Acts into one doctrine you can execute at three in the morning",
  essence: "gold",
  thesis: "Dash Evolution is the smallest complete instance of every problem in this curriculum. It has a public state machine, a threshold-signed trust root, keys that convert directly into money, a treasury governed by voters you cannot hire or fire, a name system that is also a phishing surface, and no one above you to escalate to. Learn to operate it honestly and you have learned the shape of everything else.",
  statement: "The capstone is not a system. It is whether your judgment survives contact with a system that has no owner.",
  why: "Every prior Act gave you one lens. Perception gave you the trust graph. The machine Act gave you adversarial models and non-deterministic systems. Command gave you the org, the board, and the budget. Substrate gave you permanent storage and decentralized infrastructure. This Act gives you the seam where all of them meet: a live network where a leaked key is an irreversible transfer, an availability lapse is a protocol-enforced penalty, a schema change is permanent, and a governance vote is an authentication event. Mandiant reported a global median dwell time of eleven days for 2024 intrusions, with exploits at thirty-three percent of initial infection vectors and stolen credentials at sixteen percent, and it specifically flagged rising adversary interest in Web3 infrastructure. If you operate a node that holds signing material, you are inside that data set. This chapter turns you from someone who knows security into someone an organization can be run from.",
  outcomes: [
    "Explain the Dash two-layer trust model precisely enough to name every place where L1 assurance is imported into L2 and where that import can fail",
    "Reason quantitatively about threshold quorums, DKG, and quorum capture instead of gesturing at the word decentralized",
    "Design a Platform identity key lattice that survives a hot-key compromise without losing custody or history",
    "Build, harden, monitor, and rotate an evonode as a production service with a real blast-radius map",
    "Treat governance, treasury voting, and contested-name voting as authentication systems and secure them accordingly",
    "Ship data contracts and documents on a permanently public state without creating an unfixable privacy liability",
    "Run a single decision procedure across a centralized company, a DAO treasury, a permanent-storage substrate, an AI system, and a trust graph",
    "Publish a complete, falsifiable security doctrine for a real organization and defend it in two rooms with two audiences and one truth"
  ],
  prereq: ["ch-intuition", "ch-ai", "ch-ciso", "ch-decinfra"],
  unitUnlock: "u-unitium",
  sources: [
    { label: "DIP-0006, Long-Living Masternode Quorums (dashpay/dips)", note: "The primary spec for DKG phases, deterministic member selection, quorumSize and quorumThreshold. Read the complaint and justification phases closely; that is where an adversary lives." },
    { label: "DIP-0008, ChainLocks (dashpay/dips)", note: "Defines CLSIG and the reorg-protection claim, and contains the actual probability calculation for an attacker holding a fraction of masternodes. Use it when a finance stakeholder asks how final is final." },
    { label: "DIP-0003, Deterministic Masternode Lists (dashpay/dips)", note: "The origin of the owner / operator / voting key separation. The single best short document on designing for blast radius." },
    { label: "DIP-0028, Evolution Masternodes (Dash Core documentation)", note: "Masternode type 1, the 4000 DASH collateral, platformNodeID, platformP2PPort and platformHTTPPort. This is what you actually register." },
    { label: "Dash Platform documentation, Platform Consensus", note: "Tenderdash, BFT thresholds, same-block execution and rotating validator sets. Good for explaining why halting is correct behaviour." },
    { label: "Dash Platform documentation, Identity protocol reference", note: "Key purposes, security levels, readOnly and disabledAt semantics, credit costs. The authoritative source for your key lattice." },
    { label: "Dash Platform documentation, Name Service (DPNS)", note: "Preorder and domain documents, normalization rules, contested-name voting windows and weights. Read it as an anti-phishing design study." },
    { label: "Dash documentation, Understanding Governance", note: "Block subsidy split, superblock cadence, proposal fee and the net-yes passing rule. Cite exact figures from here rather than folklore.", url: "https://docs.dash.org/en/stable/docs/user/governance/understanding.html", checked: "2026-11-04" },
    { label: "Dash documentation, dashmate", note: "The real operator tooling: config keys, service ports, status and doctor subcommands. Your baseline should map one to one against it.", url: "https://docs.dash.org/en/stable/docs/user/network/dashmate/index.html", checked: "2026-11-04" },
    { label: "Dash blog, Nakamoto Coefficient of Dash Platform Tenderdash", note: "A rare public, numeric decentralization analysis of a live network, including its own uncomfortable answers. Model your dependency profiles on it." },
    { label: "NIST Cybersecurity Framework 2.0 (February 2024)", note: "The GOVERN function is the one that matters here; it is the vocabulary a board already accepts for the doctrine you are going to write." },
    { label: "Mandiant M-Trends 2025", note: "Dwell time, initial infection vectors and sector targeting drawn from real incident response hours. Use it as the external anchor when your own numbers look flattering." },
    { label: "Verizon Data Breach Investigations Report, current edition", note: "Headline figures on vulnerability-initiated breaches, ransomware prevalence and generative-AI-assisted techniques. Best used to calibrate, never to decorate." },
    { label: "SLSA v1.0 Build Levels specification", note: "L0 through L3 with the exact threat each level removes. The clearest existing model for arguing about build-time integrity in a doctrine." }
  ],
  pages: [
    {
      id: "ch-dashevo-p1-machine",
      title: "The Machine Beneath",
      credential: "Certified Operator, Dash Network Architecture and Consensus Security",
      summary: "Two state machines, one Sybil-resistance root. This Page builds the mechanical model you need before you are allowed to have opinions: how a deterministic masternode list becomes a threshold key, what ChainLocks actually promise, why Tenderdash stops instead of forking, and what you are trusting every time you read from a DAPI node.",
      competencies: [
        "Map the Core chain and Platform chain as separate trust domains and enumerate every seam where assurance crosses between them",
        "Explain distributed key generation and threshold recovery well enough to say what breaks at threshold versus at quorum size",
        "State the ChainLocks security claim, its probability model, and the risk it substitutes rather than removes",
        "Describe Tenderdash consensus, same-block execution and validator rotation, and design a product that survives a halt",
        "Verify Platform reads with cryptographic proofs and articulate the residual risks proofs do not cover",
        "Quantify quorum capture risk for a dependency and present it as a managed control rather than an ideology"
      ],
      seal: "GOLD SEAL I — THE QUORUM",
      steps: [
        {
          id: "ch-dashevo-p1-two-chains",
          kind: "construct",
          title: "Two Chains, One Trust Boundary",
          statement: "Dash is not one ledger with a feature bolted on; it is two state machines sharing a single Sybil-resistance root, and almost every real security question lives at the seam between them.",
          minutes: 22,
          respect: 90,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The two machines",
              body: "The Core chain is proof-of-work, and on top of it sits a deterministic list of collateralized nodes: masternodes at 1000 DASH and evonodes at 4000 DASH. That list is the network's scarce, verifiable notion of identity. The Platform chain is a separate state machine, run by evonodes, using a Tendermint derivative called Tenderdash, storing documents in an authenticated store called Drive. Platform does not do proof of work. It borrows its Sybil resistance entirely from the Core chain's masternode list, which is itself secured by proof of work. That borrowing is the whole architecture, and it is also the whole attack surface."
            },
            {
              kind: "table",
              title: "Two trust domains, side by side",
              headers: ["Property", "Core chain (L1)", "Platform chain (L2)"],
              rows: [
                ["Consensus", "Proof of work, plus LLMQ threshold signatures for ChainLocks", "Tenderdash BFT, greater than two thirds precommit"],
                ["Who participates", "Miners, plus all masternodes and evonodes", "Evonodes only, drawn into a rotating validator quorum"],
                ["Finality model", "Probabilistic, then near-absolute once ChainLocked", "Deterministic per committed block, no reorgs by design"],
                ["What it stores", "Coins, special transactions, the masternode list", "Identities, credits, data contracts, documents, votes"],
                ["What an attacker gains", "Reorgs, double spends, censorship of transactions", "Forged or censored application state, stolen identity authority"],
                ["Sybil resistance origin", "Hashrate plus locked collateral", "Inherited entirely from the L1 masternode list"]
              ]
            },
            {
              kind: "principle",
              title: "The seam law",
              body: "Assurance does not travel between layers for free. Every place where L1 fact becomes L2 belief is a conversion, and every conversion has a format, a proof type, an ordering assumption, and a failure mode you are responsible for."
            },
            {
              kind: "list",
              title: "The six seams, memorize them",
              items: [
                "Asset lock: DASH burned on L1 becomes credits on L2, proven by either an InstantSend lock or a ChainLock over the funding transaction",
                "Asset unlock: credits on L2 become spendable DASH on L1 through a withdrawal that the network must sign and mine",
                "Masternode list to validator set: the L1 deterministic list selects who is allowed to produce L2 blocks",
                "Masternode identities: Platform auto-creates owner, operator and voting identities whose keys are derived from the L1 ProRegTx, and those keys cannot be changed by an L2 identity update",
                "Governance: masternode and evonode voting keys, held for L1 purposes, also decide L2 contested resources",
                "Time and ordering: L2 reasoning about what is confirmed depends on L1 ChainLock status, so a stalled ChainLock is an L2 problem"
              ]
            },
            {
              kind: "callout",
              title: "The operator's first question",
              body: "When something looks wrong, do not ask which chain broke. Ask which conversion produced the belief you are acting on, and whether you verified that conversion or inherited it from someone who claimed to. Most Platform incidents that look like consensus problems are actually a client that accepted an unproven answer from a gateway."
            },
            {
              kind: "quote",
              body: "You do not secure a two-layer system. You secure six conversions and then argue about the rest.",
              source: "STEPSAFE :: field doctrine"
            }
          ],
          awards: ["award-seam-mapper"],
          glossary: ["masternode", "evonode", "platform-chain", "asset-lock", "sybil-resistance"]
        },
        {
          id: "ch-dashevo-p1-llmq-dkg",
          kind: "lesson",
          title: "LLMQ: How a Crowd Becomes a Key",
          statement: "A threshold quorum converts a Sybil-resistant list into a single signing key, and the entire security of that key reduces to the assumption that fewer than the threshold of its members collude.",
          minutes: 30,
          respect: 145,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "What a Long-Living Masternode Quorum is",
              body: "DIP-0006 defines an LLMQ as a deterministic subset of the global masternode list that runs a distributed key generation protocol and then stays alive for a long period, signing many messages with one shared key. Membership is not negotiated; it is computed. Every node derives the same member list by sorting masternodes on a double-hash construction over the node's proTxHash and confirmedHash against the quorum type and quorum hash. Nobody chooses the members, which removes an entire class of social attack and replaces it with a different one: an adversary who can predict membership can target it."
            },
            {
              kind: "numbered",
              title: "The DKG, phase by phase, and where an attacker plays",
              items: [
                "Contribution: each member publishes a verification vector and sends encrypted secret shares to every other member. An attacker here sends valid-looking garbage to a targeted subset to push them out later",
                "Complaint: members vote that specific contributors were dishonest. An attacker here files false complaints to trigger exclusions, or coordinates complaints to bias the surviving set",
                "Justification: accused members reveal their contributions for public verification. Failure to justify is permanent exclusion, so a member forced offline during this window is removed even though it was honest",
                "Commitment: surviving members aggregate contributions, compute the shared public key, and dual-sign a commitment with both their operator key and a threshold signature",
                "Finalization: valid commitments are aggregated into a final commitment carrying a threshold signature and propagated",
                "Mining: the final commitment is included in blocks until the network has consensus on the quorum's existence and public key"
              ]
            },
            {
              kind: "table",
              title: "Mainnet quorum types, size and threshold",
              headers: ["Quorum type", "Size", "Threshold", "Used for"],
              rows: [
                ["LLMQ_50_60", "50", "60 percent", "InstantSend, pre-DIP24 signing"],
                ["LLMQ_60_75", "60", "75 percent", "Deterministic InstantSend"],
                ["LLMQ_400_60", "400", "60 percent", "ChainLocks"],
                ["LLMQ_400_85", "400", "85 percent", "Enhanced hard fork signalling"],
                ["LLMQ_100_67", "100", "67 percent", "Dash Platform"]
              ]
            },
            {
              kind: "compare",
              title: "Two different things break at two different numbers",
              left: {
                title: "Below threshold participation (liveness)",
                items: [
                  "The quorum cannot recover a signature at all",
                  "ChainLocks stall, InstantSend locks stall, Platform blocks stop committing",
                  "Nothing false is produced; the system refuses to move",
                  "Recoverable by bringing honest members back online",
                  "Attack cost: denial of service against a predictable member set"
                ]
              },
              right: {
                title: "Threshold reached by colluding members (safety)",
                items: [
                  "The quorum can sign anything it wants and the signature verifies",
                  "A false ChainLock, a forged Platform commit, a fraudulent withdrawal signature",
                  "The lie is indistinguishable from truth to any verifier holding only the quorum public key",
                  "Not recoverable by protocol; requires social intervention and a fork",
                  "Attack cost: control of enough collateralized nodes to hit threshold in one quorum"
                ]
              }
            },
            {
              kind: "principle",
              title: "Threshold is a dial, not a constant",
              body: "Raising the threshold buys safety and sells liveness. LLMQ_400_85 exists because hard fork signalling must be almost impossible to fake, and it is acceptable for it to be slow. LLMQ_100_67 exists because Platform must produce blocks continuously. When someone asks whether the network is secure, the honest answer is a question: against forgery or against stoppage."
            },
            {
              kind: "callout",
              title: "The under-monitored ceremony",
              body: "DKG runs on a schedule, in public, on your node, and almost nobody watches it. If your evonode fails to contribute or gets excluded during the complaint or justification phase, you silently drop out of quorums, earn less, and quietly reduce network diversity. Instrument DKG participation as a first-class signal, not as a line in a log you read after an incident."
            }
          ],
          awards: ["award-threshold-thinker"],
          glossary: ["llmq", "distributed-key-generation", "threshold-signature", "quorum-threshold", "protx-hash"]
        },
        {
          id: "ch-dashevo-p1-chainlocks",
          kind: "lesson",
          title: "ChainLocks: Finality as a Signed Assertion",
          statement: "ChainLocks convert probabilistic settlement into a signed statement, which moves your risk from hashrate economics to quorum honesty; that is a different risk, not automatically a smaller one.",
          minutes: 24,
          respect: 105,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "What actually happens",
              body: "Masternodes periodically attempt to sign the current chain tip. Each attempt uses a request identifier derived from block height and attempt number, so the whole quorum is trying to sign the same thing. In the common case a majority signs the same block hash on the first attempt. If not, subsequent attempts converge on the most-signed hash from the previous round. Once an attempt succeeds, a second quorum signs the successful attempt, and the result is broadcast as a CLSIG message. Any node can verify it against the quorum public key."
            },
            {
              kind: "metric",
              title: "The numbers that matter",
              body: "From DIP-0008 and the ChainLocks implementation.",
              items: [
                "CLSIG payload: 4-byte block height, 32-byte block hash, 96-byte recovered BLS signature",
                "ChainLocks are signed by LLMQ_400_60: 400 members, 60 percent threshold",
                "DIP-0008 worked example: an attacker holding 1500 of 5000 masternodes has roughly 3.36e-6 probability of controlling a signing quorum",
                "Practical consequence stated in the spec: below roughly 30 percent of masternodes, preventing or forging ChainLocks is effectively impossible",
                "Once a block is ChainLocked, every transaction in it and in all prior blocks is treated as irreversible"
              ]
            },
            {
              kind: "compare",
              title: "Two ways to believe a payment is final",
              left: {
                title: "Confirmation counting (classic proof of work)",
                items: [
                  "Security grows with elapsed work, so you wait",
                  "The threat model is economic: can someone outspend the honest chain",
                  "A 51 percent attacker can reorganize history you already accepted",
                  "Your control is a policy number: N confirmations before credit",
                  "Failure is gradual and observable as chain reorganization depth"
                ]
              },
              right: {
                title: "ChainLock verification",
                items: [
                  "Security is a signature you check in milliseconds",
                  "The threat model is collusion: can someone control a signing quorum",
                  "A 51 percent hashrate attacker cannot reorganize a ChainLocked block",
                  "Your control is verification: did you actually check the CLSIG, and against which quorum public key",
                  "Failure is binary and silent; a forged lock looks exactly like a real one"
                ]
              }
            },
            {
              kind: "callout",
              title: "What you tell a CFO, exactly",
              body: "Say this: our settlement finality no longer depends on how long we wait, it depends on a quorum of collateralized nodes not colluding, and we monitor that assumption with a published concentration metric that we review quarterly. Do not say the network is 51 percent attack proof. It is resistant to a specific attack under a specific assumption, and your job is to keep naming the assumption out loud so nobody forgets it is there."
            },
            {
              kind: "principle",
              title: "Finality is a claim with a signer",
              body: "Whenever a system offers you fast finality, find the entity whose signature makes it final and put that entity in your risk register by name. Speed in settlement is almost always purchased with a trust assumption, and the assumption is the product."
            }
          ],
          awards: ["award-finality-reader"],
          glossary: ["chainlock", "clsig", "instantsend", "settlement-finality", "bls-signature"]
        },
        {
          id: "ch-dashevo-p1-tenderdash",
          kind: "lesson",
          title: "Tenderdash: A Machine That Would Rather Stop Than Lie",
          statement: "Platform chooses consistency over availability, so when the validator quorum cannot agree the correct behaviour is to halt, and your product architecture has to be able to survive halting.",
          minutes: 28,
          respect: 155,
          trust: 8,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "A Tendermint fork with quorum surgery",
              body: "Tenderdash is a heavily modified derivative of Tendermint. A block commits when more than two thirds of the total validators precommit for it in a round. The modifications matter. Validators do not each attach an individual signature; the set produces a single BLS threshold signature, which keeps block headers compact and makes verification cheap for light clients. The validator set is not static; it is drawn from a masternode quorum and rotated on a short deterministic schedule rather than being a fixed committee, which reduces the value of targeting any particular set of machines. And Dash's own consensus documentation states that the validators' signature is produced by an LLMQ which is itself secured by the Core chain's proof of work, which is the seam again."
            },
            {
              kind: "list",
              title: "Four differences from vanilla Tendermint you must be able to name",
              items: [
                "Same-block execution: the committed block's AppHash already commits to the post-execution state, so you can query data in the same block you wrote it rather than waiting for the next one",
                "Threshold signing: one aggregated BLS signature instead of a vector of validator signatures",
                "Rotating validator set drawn from LLMQ membership rather than a governance-selected static committee; Dash release material describes the active set being reassigned every fifteen blocks, roughly every two minutes",
                "Consensus rooted in a proof-of-work-secured node list, so Sybil resistance is external to the BFT protocol rather than being staked inside it"
              ]
            },
            {
              kind: "table",
              title: "Failure modes and what each one means for you",
              headers: ["Condition", "Protocol behaviour", "What your service sees", "Correct response"],
              rows: [
                ["More than one third of validators offline or partitioned", "No block commits, chain halts", "Writes time out, reads return a stale but valid state", "Serve read-only, queue writes with idempotency keys, do not fabricate optimistic success"],
                ["Between one third and two thirds colluding", "Can censor and halt, cannot forge", "Selective transaction suppression, no visible corruption", "Detect by write-then-verify with proofs from independent gateways"],
                ["More than two thirds colluding", "Can commit arbitrary state", "Everything verifies and everything is false", "Out of protocol; needs social recovery, which is why quorum concentration is a board-level metric"],
                ["Validator rotation while your write is in flight", "Normal operation", "Occasional transient errors on submit", "Retry with backoff and treat already-exists as success"]
              ]
            },
            {
              kind: "prose",
              title: "Same-block execution is a security property, not just ergonomics",
              body: "Because the AppHash commits post-execution state, a proof you receive for a document is a proof about a state that was already applied when the block committed. That closes a real gap present in post-commit execution designs, where a client can be shown a committed transaction whose effects are not yet reflected and can be induced to act on a state that does not exist yet. If you have ever built a payments integration against a system with deferred execution, you have already been bitten by this. Here the correct verification is one step, not two: check the proof, check the block height, check that the height is inside your freshness window."
            },
            {
              kind: "callout",
              title: "Design for the halt",
              body: "The single most common architectural mistake teams make on a BFT chain is building the happy path against a system that is chosen to stop under stress, then discovering during the first halt that their user flow has no read-only mode. Write the halt behaviour first. Decide what a user can still do, what you queue, what you refuse, and what you tell them. Then build the feature."
            },
            {
              kind: "principle",
              title: "Preferring consistency is a promise you inherit",
              body: "When a dependency chooses to stop rather than diverge, the dependency has moved the availability problem into your building. You did not opt out of it; you accepted it as a design constraint the day you integrated."
            }
          ],
          awards: ["award-bft-operator"],
          glossary: ["tenderdash", "apphash", "same-block-execution", "validator-rotation", "byzantine-fault-tolerance", "threshold-bft"]
        },
        {
          id: "ch-dashevo-p1-dapi-trust",
          kind: "lab",
          title: "DAPI Is a Gateway, Not an Oracle",
          statement: "Any answer you take from a DAPI node without a proof is an answer you have chosen to trust a stranger for, and proofs cover fewer things than most engineers assume.",
          minutes: 35,
          respect: 165,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "What DAPI is and is not",
              body: "DAPI is the decentralized API surface exposed by masternodes. It offers JSON-RPC endpoints for Core chain data and gRPC endpoints for Platform, including event streaming for blocks, transactions and masternode list updates. Clients connect over TLS. The important architectural fact is that DAPI is a gateway to consensus, not a participant in your trust decision. Its Platform endpoints can optionally return cryptographic proofs generated from GroveDB, the authenticated hierarchical store behind Drive. If you request a proof and verify it, a malicious node cannot alter the answer. If you do not, it can say anything."
            },
            {
              kind: "code",
              lang: "javascript",
              title: "Read with a proof, and check what the proof is about",
              body: "const { DashPlatformSDK } = require('@dashevo/sdk');\n\nconst sdk = new DashPlatformSDK({ network: 'mainnet' });\n\nasync function readVerified(contractId, docType, whereClause) {\n  const result = await sdk.documents.query({\n    dataContractId: contractId,\n    documentType: docType,\n    where: whereClause,\n    prove: true\n  });\n\n  if (!result.proof) {\n    throw new Error('gateway returned no proof; refusing to act on this read');\n  }\n\n  const meta = result.metadata;\n  const ageBlocks = (await sdk.platform.getHeight()) - meta.height;\n\n  if (ageBlocks > 20) {\n    throw new Error('proof is valid but stale: height ' + meta.height);\n  }\n\n  return result.documents;\n}\n"
            },
            {
              kind: "code",
              lang: "bash",
              title: "Do not trust one gateway; cross-read and diff",
              body: "# Query the same document from three independently operated evonodes\n# and compare the returned state root and height. Divergence is a signal,\n# not necessarily an attack, but it is always worth an alert.\n\nfor host in node-a.example.org node-b.example.org node-c.example.org; do\n  grpcurl -insecure -d '{\"id\": \"'$IDENTITY_ID'\", \"prove\": true}' \\\n    $host:443 org.dash.platform.dapi.v0.Platform/getIdentity \\\n    | jq -r '[.v0.proof.quorumHash, .v0.metadata.height] | @tsv'\ndone | sort -u\n"
            },
            {
              kind: "table",
              title: "Gateway threat model and what actually mitigates it",
              headers: ["Threat", "What it looks like", "Mitigated by proofs", "Real mitigation"],
              rows: [
                ["Response tampering", "Altered document values or balances", "Yes", "Always request and verify proofs before money movement"],
                ["Stale state served as current", "Valid proof, old block height", "No", "Enforce a freshness window against an independently obtained height"],
                ["Selective omission", "A document that exists is reported absent", "Partly, via non-inclusion proofs at a given root", "Cross-read from independent operators and alert on divergence"],
                ["Availability denial", "Your one gateway stops answering", "No", "Multiple pinned endpoints plus your own evonode as a fallback"],
                ["Query correlation and privacy", "The operator learns which identities you care about", "No", "Batch and pad queries, rotate endpoints, or run your own node"],
                ["TLS interception on a self-signed path", "Anything, silently", "No", "Never disable certificate verification in production, no matter what a tutorial does"]
              ]
            },
            {
              kind: "callout",
              title: "The TLS trap in every Dash sample script",
              body: "A great deal of Dash tooling and example code disables certificate verification because DAPI nodes have historically used self-signed certificates. That is a legitimate development convenience and an unacceptable production posture. If your integration turns off certificate checking globally, you have not just weakened Dash calls, you have weakened every outbound TLS call the process makes for its whole lifetime. Scope it, pin it, or run your own node and talk to it over a private network."
            },
            {
              kind: "checklist",
              title: "Gateway posture review",
              items: [
                "Every read that influences a value transfer requests a proof and fails closed if the proof is absent",
                "Freshness window is enforced in code with a specific block-height tolerance, not assumed",
                "At least three independently operated endpoints are configured and health checked",
                "Certificate verification is enabled process-wide, with any exception scoped to a single client",
                "Divergence between endpoints raises an alert with a named owner, not a debug log line",
                "There is a documented decision for what the product does when all endpoints are unreachable"
              ]
            },
            {
              kind: "principle",
              title: "Verification is the product of decentralization",
              body: "A decentralized network you consume through one unverified endpoint gives you the cost profile of decentralization and the trust profile of a single vendor. Proofs are the only thing that converts the architecture into an actual security benefit for you."
            }
          ],
          awards: ["award-proof-verifier"],
          glossary: ["dapi", "grovedb", "state-proof", "freshness-window", "non-inclusion-proof"]
        },
        {
          id: "ch-dashevo-p1-quorum-capture",
          kind: "drill",
          title: "The Nakamoto Coefficient Is Not a Vanity Metric",
          statement: "Decentralization is an operational control with a number attached, and if you cannot state that number for a dependency you are not managing the risk, you are admiring it.",
          minutes: 30,
          respect: 185,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Dash published its own uncomfortable number",
              body: "In October 2023 a Dash blog analysis measured the Nakamoto coefficient of Platform's Tenderdash, defined as the number of entities required to control one third of a rotating hundred-node quorum, which is enough to halt or censor. With 73 active evonodes at the time, the answer was five. The projection at roughly 450 evonodes was sixteen, assuming large masternode holders converted about a quarter of their nodes. The pessimistic scenario in the same article was two. That analysis is a model of the behaviour you should copy: pick the specific subsystem, pick the specific fraction that matters, count the entities, publish it, and keep updating it."
            },
            {
              kind: "metric",
              title: "The measurement, restated as a control",
              items: [
                "Subsystem under measurement: the rotating Platform validator quorum, size 100, threshold 67",
                "Fraction that grants halting and censorship power: greater than one third of the quorum",
                "Fraction that grants forgery power: greater than two thirds of the quorum",
                "Entity count is what matters, not node count; one operator with fifteen nodes is one entity",
                "The metric decays: it must be recomputed on a schedule because operator concentration changes with price and yield"
              ]
            },
            {
              kind: "list",
              title: "Why counting entities is harder than it sounds",
              items: [
                "Hosting concentration hides behind distinct proTxHashes: forty nodes on one provider is one power failure and one subpoena",
                "Custodial and pooled services aggregate many economic owners under one operator key holder",
                "Geographic and jurisdictional correlation is invisible in the node list but decisive in a legal event",
                "Software monoculture is a correlated failure: one bad release affects every node that upgrades on time",
                "Operators who share a single upstream network transit are correlated even if they share nothing else"
              ]
            },
            {
              kind: "compare",
              title: "How two teams answer the same board question",
              left: {
                title: "The team that loses the room",
                items: [
                  "It is decentralized, so it is fine",
                  "No named subsystem, no named fraction",
                  "Cannot say what would change their answer",
                  "Treats the question as an attack on their choice",
                  "Has no monitoring for the thing they claim is safe"
                ]
              },
              right: {
                title: "The team that keeps the room",
                items: [
                  "Names the subsystem, the fraction and the current entity count",
                  "States the threshold at which they would pause the integration",
                  "Shows the monitoring that produces the number monthly",
                  "Presents a compensating control for the interval before the number improves",
                  "Has a written exit path with a tested fallback settlement route"
                ]
              }
            }
          ],
          drill: {
            id: "ch-dashevo-p1-quorum-capture-drill",
            scene: "You are the security lead at a payments company that is two weeks from routing merchant settlement through Dash Platform. A researcher publishes an analysis showing the top handful of evonode operators could plausibly assemble more than one third of a rotating validator quorum, which would let them halt or censor. Your CEO has seen it. Your integration is code complete. The risk committee meets in 48 hours and the head of risk has already forwarded the article with one line: are we exposed.",
            clock: "48 hours to the risk committee",
            pressure: "Engineering has burned a quarter on this integration. Legal wants a written position. The researcher is credible and the number is probably right.",
            prompt: "What do you bring to the risk committee?",
            options: [
              {
                id: "ch-dashevo-opt-halt",
                label: "Recommend halting the integration until the coefficient exceeds a threshold you pick tonight",
                detail: "A clean, defensible no. Freeze the launch, publish a minimum decentralization bar, revisit in two quarters.",
                score: 1,
                outcome: "The committee accepts the pause because nobody gets fired for caution. Engineering morale drops, the threshold you picked under time pressure turns out to be arbitrary when challenged, and six months later nobody remembers why the number was that number.",
                ripple: "You have taught the organization that decentralization risk is binary and unmanageable. The next time a similar question arises, the default answer becomes no, and you lose the ability to take any calculated infrastructure risk at all.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-profile",
                label: "Bring a quantified dependency profile: named subsystem, current entity count, the capture threshold, monitoring, a pause trigger, and a tested fallback settlement path",
                detail: "Launch proceeds with an explicit, monitored risk acceptance and a documented exit.",
                score: 3,
                outcome: "The committee gets a decision it can actually make. You launch with a stated exposure, a monthly recomputed number, an automatic pause trigger if entity concentration crosses your line, and a fallback path that has been exercised in a game day rather than described in a slide.",
                ripple: "You have converted an ideological argument into a managed control with an owner and a cadence. This becomes the template for every third-party and infrastructure dependency in the company, and the risk register starts carrying real numbers instead of colour codes.",
                isBest: true
              },
              {
                id: "ch-dashevo-opt-chainlocks",
                label: "Reassure the committee that ChainLocks make the network resistant to a 51 percent attack, so quorum concentration is not a real concern",
                detail: "Cite DIP-0008 and the published probability figures.",
                score: -3,
                outcome: "The statement is true about a different subsystem and therefore false in context. ChainLocks are signed by a 400-member quorum on the Core chain; the researcher is describing a 100-member Platform validator quorum. Someone technical in the room, or on the internet, notices.",
                ripple: "You have spent your credibility to protect a launch date. The next time you raise a genuine risk, the committee discounts it, and a security function that gets discounted is a security function that stops being consulted before decisions rather than after.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-buy",
                label: "Propose that the company operate enough evonodes itself to improve the coefficient",
                detail: "Turn the dependency into participation. Budget for collateral and operations.",
                score: -1,
                outcome: "It is expensive, slow, and does not answer the committee's question within 48 hours. It also quietly makes you one of the concentrating entities, and it puts several thousand DASH of collateral and a set of live signing keys inside your own control plane.",
                ripple: "You have taken on insider risk, custody risk and regulatory surface in order to improve a metric by a fraction of one. Worse, you now have a conflict: your security team is measuring the decentralization of a network your company is materially centralizing.",
                isBest: false
              }
            ],
            debrief: "The winning move is not a verdict, it is a profile. Decentralization risk feels ideological, so people argue about it in adjectives; the discipline is to force it into the same shape as every other third-party risk: what subsystem, what fraction grants what power, how many independent entities today, who recomputes it and how often, what number makes us stop, and what do we do when we stop. The ChainLocks answer is the plausible-but-wrong option and it is the one most experienced people reach for, because the ChainLocks security argument is genuinely strong and genuinely well documented. It is simply about a different quorum. Conflating two quorums with different sizes, thresholds and purposes is the single most common technical error in Dash risk conversations, and it is fatal in a room with one competent skeptic. The pause option is not stupid; it is just unowned. A threshold invented the night before a committee has no analysis behind it and will not survive its first challenge.",
            principle: "For any dependency, be able to say: this subsystem, this fraction, this many independent entities, recomputed this often, and here is the number at which we stop."
          },
          awards: ["award-dependency-profiler", "award-quorum-cartographer"],
          glossary: ["nakamoto-coefficient", "quorum-capture", "censorship-resistance", "dependency-profile"]
        }
      ]
    },
    {
      id: "ch-dashevo-p2-identity",
      title: "Identity, Credits, and the Public State",
      credential: "Certified Practitioner, Platform Identity and Public-State Data Design",
      summary: "On Platform an identity is a set of public keys with a spendable balance, a name is a phishing surface with a defence, and a schema is a decision you cannot take back. This Page teaches the key lattice, the asset-lock funding path, DPNS commit-reveal, and how to design data that will be readable by everyone forever without creating a liability you cannot delete.",
      competencies: [
        "Construct a Platform identity key lattice using purpose and security level correctly, including master key handling and contract-bound keys",
        "Execute and reason about the asset lock and credit top-up flow, including the one-time key, proof types and nonce sequencing",
        "Register a DPNS name using preorder and domain documents and explain the anti-front-running and anti-homograph controls",
        "Design a data contract that can survive the platform's immutability rules and avoid enumeration and side-channel traps",
        "Classify data for a permanently public state and choose commitment, encryption or off-chain storage on defensible grounds",
        "Rotate and disable identity keys with an understanding of what disabled means and what it does not"
      ],
      seal: "GOLD SEAL II — THE KEY LATTICE",
      steps: [
        {
          id: "ch-dashevo-p2-identity-model",
          kind: "construct",
          title: "An Identity Is a Key Set With a Balance",
          statement: "A Platform identity is not an account you log into; it is a set of public keys with a spendable balance, and whoever holds a key holds the identity to exactly the extent that key permits.",
          minutes: 24,
          respect: 100,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Four fields, no password",
              body: "There is no credential store, no session, no reset flow and no support desk. An identity is an identifier, an array of public keys, a credit balance and a revision counter. The identifier is derived from the double SHA256 hash of the outpoint that funded the identity's creation, which means the identity is cryptographically tied to a specific L1 transaction output for its entire life. Authentication is a signature over a state transition. Authorization is which key signed and what that key is permitted to do. Everything you know about account security has to be re-expressed in those terms or it does not apply."
            },
            {
              kind: "table",
              title: "The identity object",
              headers: ["Field", "What it is", "Security consequence"],
              rows: [
                ["id", "Double SHA256 of the funding outpoint, 32 bytes", "Permanently links the identity to an on-chain funding event that anyone can inspect"],
                ["publicKeys", "Array of keys with type, purpose, security level, readOnly and disabledAt", "This is your entire access control model; there is nothing else"],
                ["balance", "Credits available to pay for state transitions", "A drained balance is a denial of service against your own application"],
                ["revision", "Monotonic counter incremented by identity updates", "Your only built-in tamper-evidence signal for key changes; watch it"]
              ]
            },
            {
              kind: "numbered",
              title: "How an identity comes into existence",
              items: [
                "Lock DASH on the Core chain in an asset lock special transaction whose credit output pays to a one-time key you generated",
                "Wait for either an InstantSend lock or a ChainLock over that transaction, which is what produces a usable asset lock proof",
                "Build an identity create state transition referencing the proof and carrying your intended public keys",
                "Sign the transition with the one-time key that controls the locked value, proving you are entitled to the credits",
                "Broadcast to Platform; the locked value minus fees becomes the identity's opening credit balance",
                "Optionally register a DPNS name so humans can find you without copying 32 bytes"
              ]
            },
            {
              kind: "metric",
              title: "Costs, in units you can actually reason about",
              body: "From the Dash Platform identity reference.",
              items: [
                "1 duff equals 1000 credits",
                "Identity creation base cost: 2 million credits",
                "Per public key added at creation: 6.5 million credits",
                "A single-key identity therefore costs about 8.5 million credits, roughly 0.000085 DASH",
                "Credits are spent by every state transition, so an idle application still needs a funding and monitoring plan",
                "Credits can be withdrawn back to DASH via an asset unlock, subject to network withdrawal limits"
              ]
            },
            {
              kind: "callout",
              title: "The failure that has no recovery path",
              body: "If you lose every private key on an identity, the identity is gone. Not suspended, not recoverable by an operator, not restorable by proving who you are. The balance is stranded and the DPNS name is stranded with it. This is the single most important sentence to say out loud to a product manager who is designing a user flow, because every consumer product instinct they have was built in a world with account recovery, and none of those instincts survive here without an explicit design."
            },
            {
              kind: "principle",
              title: "Custody is the product",
              body: "In any system where authority is a key and action is irreversible, the key management design is not a supporting concern for the product; it is the product. Everything else is presentation."
            }
          ],
          awards: ["award-identity-cartographer"],
          glossary: ["platform-identity", "credits", "duff", "outpoint", "state-transition"]
        },
        {
          id: "ch-dashevo-p2-key-lattice",
          kind: "lesson",
          title: "Purpose, Security Level, and the Master Key Trap",
          statement: "Platform gives you a key lattice with two independent axes, what a key may do and how carefully it must be stored, and most real losses come from operators who collapsed the two axes into one key.",
          minutes: 32,
          respect: 175,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Two axes, deliberately separate",
              body: "Purpose says what operation a key is allowed to authorize: authentication, encryption, decryption, transfer, voting, owner, system. Security level says how carefully the key must be handled: master is zero, critical is one, high is two, medium is three. The protocol enforces minimum security levels for certain purposes. Transfer requires at least critical. Encryption and decryption require at least medium. Authentication may exist at any level, which is exactly why authentication keys are where discipline collapses: the protocol will happily let you put a medium-level authentication key on a web server and use it for everything your application does."
            },
            {
              kind: "table",
              title: "Purpose against minimum security level, and where the key should actually live",
              headers: ["Purpose", "Minimum security level", "Sane storage", "If stolen"],
              rows: [
                ["Authentication", "Any level permitted", "Depends entirely on what you sign with it; scope it with contractBounds", "Attacker acts as you within whatever that key can sign"],
                ["Encryption / Decryption", "Medium or higher", "Application secret store, rotated on a schedule", "Historical confidentiality of anything encrypted to it is gone permanently"],
                ["Transfer", "Critical or higher", "Hardware-backed, offline, dual control", "Direct, irreversible loss of credits and withdrawal to an attacker address"],
                ["Master (security level 0)", "Exactly one per identity", "Cold, air-gapped, split, geographically separated backups", "Total identity takeover including adding attacker keys and disabling yours"],
                ["Voting / Owner (masternode identities)", "Derived from Core registration", "Governed by L1 key custody, not by identity update", "Governance influence hijack; see the governance Page"]
              ]
            },
            {
              kind: "prose",
              title: "The master key trap, precisely",
              body: "Each identity must have exactly one master key at security level zero, and it is the key used to update the identity. That means it is the key that can add new keys and disable existing ones. Read that twice. An attacker with the master key does not need any of your other keys; they add their own and disable yours, and the revision counter ticks by one. The trap is that during development the master key is the most convenient key in existence, so it ends up in an environment variable on a build machine, and then it stays there, because nothing visibly breaks. The correct posture is that the master key touches production exactly twice in the lifetime of an identity: at creation and during a planned rotation ceremony."
            },
            {
              kind: "list",
              title: "Key types available, and when each is the right answer",
              items: [
                "ECDSA_SECP256K1: the default; interoperates with Dash Core key material and standard wallet tooling",
                "BLS12_381: aggregation-friendly, aligned with the masternode operator key world, useful where threshold or aggregate constructions matter",
                "ECDSA_HASH160: publish only a hash of the key, revealing the full key at first use, which shrinks the on-chain exposure window",
                "BIP13_SCRIPT_HASH: bind authority to a script rather than a single key, which is how you express multi-party control",
                "EDDSA_25519_HASH160: aligns with the ED25519 key material used for Platform node identity"
              ]
            },
            {
              kind: "compare",
              title: "Disabling a key is not deleting a key",
              left: {
                title: "What disabling does",
                items: [
                  "Sets disabledAt so the key can no longer sign new state transitions",
                  "Preserves the key on the identity so previously signed data still verifies",
                  "Increments the identity revision, which is externally observable",
                  "Takes effect at consensus, so it is fast but public",
                  "Is the correct immediate action on suspected compromise"
                ]
              },
              right: {
                title: "What disabling does not do",
                items: [
                  "Does not remove anything the key already signed or encrypted",
                  "Does not restore confidentiality of data encrypted to that key",
                  "Does not hide from an observer that you just had an incident",
                  "Does not help if the attacker holds the master key and re-enables their own access",
                  "Does not substitute for rotating whatever off-chain secret leaked alongside it"
                ]
              }
            },
            {
              kind: "callout",
              title: "contractBounds is capability scoping, and almost nobody uses it",
              body: "A public key can carry contract bounds restricting it to a specific data contract, and optionally a specific document type. This is on-chain least privilege and it is free. If your application writes only to your own contract, bind the key that does it. Then a stolen application key cannot be used against DPNS, cannot be used to transfer credits, and cannot be used to write into somebody else's contract. Every time you see an integration with one unbounded authentication key doing everything, you are looking at an incident that has not happened yet."
            },
            {
              kind: "principle",
              title: "Separate what a key can do from where a key can live",
              body: "Authority and exposure are independent variables. Every key that is highly exposed must be narrowly capable, and every key that is broadly capable must be almost never touched. A design where those two properties move together is not a key lattice; it is one key wearing several names."
            }
          ],
          awards: ["award-key-lattice-architect"],
          glossary: ["security-level", "key-purpose", "master-key", "contract-bounds", "key-disable"]
        },
        {
          id: "ch-dashevo-p2-asset-lock",
          kind: "lab",
          title: "The Asset Lock: Where L1 Money Becomes L2 Capability",
          statement: "The asset lock is the most dangerous short stretch of code in any Platform integration, because a one-time key generated off-chain is the only thing standing between locked value and whoever finds it first.",
          minutes: 40,
          respect: 205,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The mechanism",
              body: "An asset lock is a DIP-2 style special transaction on the Core chain. Its payload contains credit outputs, which are pay-to-public-key-hash outputs to a freshly generated one-time key, and the on-chain burn output is an OP_RETURN carrying the amount being converted. Platform sees the locked value and will assign credits to whoever can prove control of that one-time key. The proof comes in two flavours: an InstantSendLockProof, which uses an InstantSend lock over the funding transaction, and a ChainAssetLockProof, which references the transaction's outpoint once the block containing it is ChainLocked. The one-time key is not a formality. It is bearer authority over the locked value until it is consumed."
            },
            {
              kind: "numbered",
              title: "The flow, and the place each step fails",
              items: [
                "Generate the one-time keypair; fails if you generate it with a weak source, log it, or store it anywhere it can be read later",
                "Select UTXOs and build the type-8 asset lock transaction with the credit output paying the one-time key hash; fails on fee estimation and on picking a UTXO that is not actually spendable",
                "Broadcast via DAPI core broadcast, with a block explorer submit endpoint as fallback; fails if you treat a broadcast timeout as a failure and rebroadcast a conflicting transaction",
                "Wait for the lock: either an InstantSend lock or inclusion in a ChainLocked block; fails if you build the proof before the transaction is actually locked",
                "Construct the proof with the outpoint, remembering the txid must be byte-reversed into internal order and the output index must point at the credit output; fails silently and produces an unhelpful rejection",
                "Build the identity create or top-up transition, sign it with the one-time key, broadcast; fails on nonce sequencing if you are managing nonces manually",
                "Verify the resulting balance with a proved read before you consider the operation complete"
              ]
            },
            {
              kind: "code",
              lang: "javascript",
              title: "Top-up skeleton, with the parts people get wrong marked",
              body: "const one = new PrivateKey();\nconst oneTimeKeyHash = Hash.sha256ripemd160(one.toPublicKey().toBuffer());\n\nconst assetLock = new Transaction()\n  .from(largestUtxo)\n  .addOutput(new Transaction.Output({\n    satoshis: topUpDuffs,\n    script: Script.buildDataOut(Buffer.alloc(0))\n  }))\n  .to(changeAddress, changeAmount);\n\nassetLock.setType(TRANSACTION_ASSET_LOCK);\nassetLock.setExtraPayload(new AssetLockPayload({\n  version: 1,\n  creditOutputs: [\n    new Transaction.Output({\n      satoshis: topUpDuffs,\n      script: Script.buildPublicKeyHashOut(oneTimeKeyHash)\n    })\n  ]\n}));\nassetLock.sign(fundingPrivateKey);\n\nawait dapi.core.broadcastTransaction(assetLock.toBuffer());\nconst height = await waitUntilMined(assetLock.id);\n\n// txid must be reversed into internal byte order, and the index must be\n// the index of the credit output, which is 0 in this construction\nconst outPoint = Buffer.concat([\n  Buffer.from(assetLock.id, 'hex').reverse(),\n  uint32LE(0)\n]);\n\nconst proof = new ChainAssetLockProof({ coreChainLockedHeight: height, outPoint });\nconst topUp = new IdentityTopUpTransition({ identityId, assetLockProof: proof });\n\nawait topUp.signByPrivateKey(one, KeyType.ECDSA_SECP256K1);\nawait dapi.platform.broadcastStateTransition(topUp.toBuffer());\n"
            },
            {
              kind: "table",
              title: "Failure modes ranked by how much money they cost",
              headers: ["Failure", "Symptom", "Cost", "Prevention"],
              rows: [
                ["One-time key lost before the transition lands", "Top-up never completes, funds locked", "Total loss of the locked amount", "Persist the one-time keypair to encrypted state before broadcasting the lock transaction"],
                ["One-time key leaked", "Someone else claims your credits", "Total loss, and it looks like your own transaction", "Generate in memory, never log, never place in shell history or CI variables"],
                ["Txid byte order wrong", "Broadcast rejected with an opaque proof error", "Time and confusion, no direct loss", "Unit test the outpoint construction against a known good transaction"],
                ["Proof built before the lock exists", "Intermittent rejection depending on timing", "Flaky pipeline that hides real errors", "Poll for lock status explicitly; never sleep and hope"],
                ["Nonce sequencing off by one in a manual flow", "Second or third transition rejected", "Half-completed multi-step registration", "Fetch the current nonce immediately before each transition, or use SDK-managed nonces"],
                ["Retry storm on an ambiguous broadcast", "Conflicting transactions, wasted fees", "Small direct loss, large operational noise", "Idempotency: treat already-exists errors as success and back off exponentially"]
              ]
            },
            {
              kind: "callout",
              title: "Already exists is success, and that is a design decision",
              body: "Broadcasts on this network are retried, and retries reach nodes that already saw your transition. Errors containing already, AlreadyExists, txn-already, or a DPNS duplicate code are not failures, they are confirmations that the step completed. Every serious Platform script encodes this. The deeper lesson is general: in any distributed system with at-least-once delivery, your error taxonomy must distinguish this did not happen from this already happened, and if it does not, your retry logic will eventually corrupt state or spend money twice."
            },
            {
              kind: "checklist",
              title: "Pre-flight for any funding operation on mainnet",
              items: [
                "The one-time keypair is written to encrypted, resumable state before the lock transaction is broadcast",
                "The script has been run end to end on testnet with the same code path, not a simplified variant",
                "Amounts are asserted against an explicit maximum so a units error cannot lock more than intended",
                "The funding wallet holds only the operating float, not the treasury",
                "Logging is audited for key material, and the log destination is one you control",
                "There is a documented resume procedure and it has been tested by killing the process mid-run",
                "A proved read of the resulting balance is the definition of done, not a successful broadcast"
              ]
            },
            {
              kind: "principle",
              title: "Bearer authority must be persisted before it is used",
              body: "Any time a system creates a secret that is the sole claim on value, the order of operations is: create, persist durably and encrypted, verify you can read it back, then act. Reversing those steps is how competent engineers lose real money in a single process crash."
            }
          ],
          awards: ["award-assetlock-operator", "award-idempotence-discipline"],
          glossary: ["asset-lock-proof", "one-time-key", "chainassetlockproof", "identity-nonce", "op-return"]
        },
        {
          id: "ch-dashevo-p2-dpns",
          kind: "lab",
          title: "DPNS: Human Names Are an Attack Surface With a Defence",
          statement: "A human-readable name is a security control for users and a phishing primitive for attackers, and DPNS answers both with commit-reveal, aggressive normalization, and a vote.",
          minutes: 30,
          respect: 145,
          trust: 7,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Why registration is two steps",
              body: "If you submitted a name directly, every node that saw your transition before it was committed could register it first. That is front-running, and it is the same problem that domain registrars and decentralized exchanges both had to solve. DPNS uses commit-reveal. First you submit a preorder document containing only a salted hash of the full name. Nobody can invert it. Then you submit a domain document revealing the name and the salt, and the network checks that the hash matches your earlier preorder. The salt is the proof that the preorder was yours."
            },
            {
              kind: "code",
              lang: "javascript",
              title: "Preorder then domain, with the salt as the linkage",
              body: "const label = 'avaria';\nconst normalized = label.toLowerCase().replace(/o/g, '0').replace(/[il]/g, '1');\nconst fullName = normalized + '.dash';\n\nconst salt = crypto.randomBytes(32);\nconst saltedDomainHash = doubleSha256(Buffer.concat([\n  salt,\n  Buffer.from(fullName, 'utf8')\n]));\n\nawait sdk.documents.create({\n  dataContractId: DPNS_CONTRACT_ID,\n  documentType: 'preorder',\n  data: { saltedDomainHash }\n});\n\nawait waitForPropagation();\n\nawait sdk.documents.create({\n  dataContractId: DPNS_CONTRACT_ID,\n  documentType: 'domain',\n  data: {\n    label: label,\n    normalizedLabel: normalized,\n    normalizedParentDomainName: 'dash',\n    preorderSalt: salt,\n    records: { identity: identityId },\n    subdomainRules: { allowSubdomains: false }\n  }\n});\n"
            },
            {
              kind: "table",
              title: "DPNS rules you must encode in validation, not in a comment",
              headers: ["Rule", "Value", "Why it exists"],
              rows: [
                ["Length", "3 to 63 characters", "Prevents single-character land grabs and DNS-incompatible lengths"],
                ["Character set", "a-z, A-Z, 0-9 and hyphen", "Eliminates whitespace and control-character spoofing outright"],
                ["Hyphen placement", "Cannot lead or trail", "Blocks the leading-hyphen tricks used in flag injection and display confusion"],
                ["Normalization", "Lowercased, then o becomes 0 and i and l become 1", "Collapses the classic homograph pairs so lookalikes resolve to the same name"],
                ["Contested trigger", "Under 20 characters, using only letters, zeros, ones and hyphens", "Identifies short, brandable, valuable names that would otherwise be squatted"],
                ["Contested fee", "0.2 DASH", "Prices the cost of running a network-wide vote and deters spray registration"]
              ]
            },
            {
              kind: "prose",
              title: "The contested-name vote, and why it is a security mechanism",
              body: "A premium name opens a two-week voting window, and additional identities may request the same name during the first week. Masternodes and evonodes vote using their voting keys, weighted by collateral: an evonode carries four votes, a masternode one. Voters may support a specific identity, abstain, or lock the name so nobody gets it. A voter can change their vote up to four times during the contest. If nobody locks it, the identity with the most support wins; if only one identity requested the name and no votes are cast, that identity receives it. Read this as an anti-impersonation control rather than an auction: the lock option exists so the network can refuse to hand a trusted brand name to the first opportunist, which is exactly the outcome a purely first-come system produces."
            },
            {
              kind: "callout",
              title: "Normalization is the same fight browsers had",
              body: "The o-to-zero and i-or-l-to-one mapping is a deliberate answer to the homograph problem that produced years of punycode phishing in browsers. It is blunt compared to full Unicode confusable detection, and it is blunt on purpose: a small ASCII character set with an aggressive collapse rule is far easier to reason about than a Unicode confusables table that changes with every standard revision. When you design a naming system, prefer a small alphabet you can fully enumerate over a large one you must continually police."
            },
            {
              kind: "checklist",
              title: "Name security review for any application that displays DPNS names",
              items: [
                "Your UI displays the normalized label, not the raw label, wherever a trust decision is made",
                "You never render a name without also making the underlying identity id retrievable in one action",
                "Names your organization cares about are registered defensively, including obvious normalization neighbours",
                "You monitor for new registrations that resolve near your brand and have a documented response",
                "Your support flow never treats a matching name as proof of identity"
              ]
            },
            {
              kind: "principle",
              title: "Every human-readable identifier is a trust shortcut, and shortcuts are attacked",
              body: "The moment a system lets a person recognize an entity by a short string instead of a key, you have created a namespace, and every namespace in computing history has been squatted, spoofed and homograph-attacked. Design the collapse rules and the dispute process before you launch, because retrofitting them is a migration nobody survives cleanly."
            }
          ],
          awards: ["award-namespace-defender"],
          glossary: ["dpns", "commit-reveal", "salted-domain-hash", "homograph-attack", "contested-name"]
        },
        {
          id: "ch-dashevo-p2-contracts",
          kind: "lesson",
          title: "Data Contracts: Schema as an Irreversible Decision",
          statement: "A data contract is a schema you can add to but never take back, so every optional field you ship is a permanent liability you have chosen to carry forever.",
          minutes: 32,
          respect: 175,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "What a contract is",
              body: "A data contract defines the document types your application may store and the schema each must satisfy. It is owned by a single identity, and only that identity can modify it. Its id is derived from the owner identity plus entropy. Document types define properties with types and constraints, plus indices that make queries possible. Indices may be unique or non-unique. Documents automatically carry createdAt and updatedAt. Additional properties beyond the schema are rejected. If the data does not match the contract, the write simply does not happen, which makes the contract your first and cheapest validation layer."
            },
            {
              kind: "table",
              title: "What you may change later, and what is permanent",
              headers: ["Change", "Allowed", "Consequence if you get it wrong"],
              rows: [
                ["Add a new document type", "Yes", "Low risk; the main cost is namespace clutter"],
                ["Add a new optional property", "Yes", "Permanent; you can never remove it, only stop writing it"],
                ["Add a non-unique index", "Yes", "Storage and write cost increase permanently"],
                ["Remove a property", "No", "You must design as if every field ships forever"],
                ["Change a property type", "No", "A units or encoding mistake is unfixable in place"],
                ["Rename a field", "No", "Bad names become permanent documentation debt"],
                ["Modify an existing unique index", "No", "An over-broad uniqueness constraint permanently shapes your data model"]
              ]
            },
            {
              kind: "compare",
              title: "Two schema mindsets",
              left: {
                title: "Mutable database thinking",
                items: [
                  "Add the column now, we will clean it up later",
                  "Migrations are a routine engineering cost",
                  "Sensitive fields can be dropped when policy changes",
                  "Uniqueness constraints are easy to relax",
                  "Bad naming is fixed in a follow-up pull request"
                ]
              },
              right: {
                title: "Public append-only state thinking",
                items: [
                  "Every field is a permanent public commitment; ship the minimum",
                  "There is no migration, only a new document type and a dual-read period",
                  "Sensitive fields written once are readable forever by everyone",
                  "A unique index you regret is a redesign, not a change",
                  "Names are part of the protocol surface and are reviewed like an API"
                ]
              }
            },
            {
              kind: "list",
              title: "Five design traps that only show up in production",
              items: [
                "Unique index on user-controlled data creates an enumeration oracle: anyone can test whether a value is already registered, which turns a uniqueness feature into a membership disclosure",
                "Timestamps are a behavioural side channel: createdAt and updatedAt on documents reveal activity patterns, timezone, and often the identity of an organization behind a supposedly pseudonymous account",
                "Document size is a side channel even when contents are encrypted, because message length correlates with message class",
                "Groups and token authorizations concentrate privileged actions such as minting into a small identity set that becomes the highest-value target in your whole system",
                "Maximum length constraints are a denial-of-service control as well as a validation rule; leaving them generous means an adversary can inflate your storage and query costs cheaply"
              ]
            },
            {
              kind: "callout",
              title: "The migration you cannot run",
              body: "Design review for a data contract should be run like a public API freeze, because that is what it is. Get a second reader who is not on the team. Ask one question about every field: if this value were printed on the front page of a newspaper next to our company name in three years, would we be comfortable. If the answer is anything other than yes, the field belongs off-chain with a commitment on-chain."
            },
            {
              kind: "principle",
              title: "Optionality is not free when the state is permanent",
              body: "In mutable systems, adding a field is cheap because removing it is possible. In append-only public systems, adding a field is a permanent decision, so the cost of the field must be paid at design time in review effort rather than at cleanup time in migration effort."
            }
          ],
          awards: ["award-schema-steward"],
          glossary: ["data-contract", "document-type", "unique-index", "enumeration-oracle", "append-only-state"]
        },
        {
          id: "ch-dashevo-p2-public-state",
          kind: "drill",
          title: "Privacy on a State Everyone Can Read Forever",
          statement: "On a public state machine, confidentiality is not a property of the system; it is a property of what you decided to put into it.",
          minutes: 35,
          respect: 195,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "What is exposed even when the payload is not",
              body: "Encrypting a document field protects the field. It does not protect the fact that a document exists, who owns it, which contract it belongs to, when it was created and updated, how large it is, how often it changes, or which identities interact around it. Platform does define encryption and decryption key purposes, and the protocol's state transition type list includes shielded pool operations, so privacy primitives exist and continue to develop. None of them retroactively fix a metadata design mistake, because the metadata is the ledger."
            },
            {
              kind: "list",
              title: "Leak channels on a public state, in the order they actually bite",
              items: [
                "Ownership graph: ownerId on every document links all of an entity's activity across every contract they touch",
                "Timing: creation and update timestamps reveal working hours, release cadence, incident response windows and holidays",
                "Volume and size: document counts and sizes classify the underlying activity even under encryption",
                "Uniqueness constraints: a unique index is a public membership test on whatever it constrains",
                "Funding linkage: the identity id derives from an L1 outpoint, so on-chain analysis can often connect an identity to a funding source",
                "Query patterns: what you read from a gateway tells that operator what you care about, which is a separate leak from what you wrote"
              ]
            },
            {
              kind: "table",
              title: "Data classification for a permanent public state",
              headers: ["Data class", "On-chain plaintext", "On-chain encrypted", "Off-chain with on-chain commitment", "Never"],
              rows: [
                ["Public identifiers and names", "Yes", "Unnecessary", "Unnecessary", "-"],
                ["Application state with no personal linkage", "Yes", "If competitively sensitive", "If large", "-"],
                ["Pseudonymous behavioural data", "No", "Weak, metadata still leaks", "Preferred", "-"],
                ["Direct personal data such as email or phone", "No", "No", "Yes, salted commitment only", "-"],
                ["Special-category personal data", "No", "No", "Only if the commitment itself is not linkable", "Default answer is never"],
                ["Secrets, credentials, keys", "No", "No", "No", "Never, under any framing"]
              ]
            },
            {
              kind: "callout",
              title: "The right to erasure meets the append-only ledger",
              body: "If you write personal data to a permanent public state, you have created a compliance position that no amount of engineering will later reverse. The defensible pattern is that the ledger holds a salted commitment and your own system holds the data, so deleting the data destroys the linkage and the on-chain value becomes an opaque number. Design that on day one and it is elegant. Retrofit it and it is a disclosure."
            }
          ],
          drill: {
            id: "ch-dashevo-p2-public-state-drill",
            scene: "Three hours before a release freeze, you review the final data contract for a consumer wallet. A product engineer has added an optional email property to the account document type so that support can help users recover access. It is already in the staging contract, the client code is written, and the release notes mention recovery. The product lead says removing it kills the single most requested feature of the quarter.",
            clock: "3 hours to release freeze",
            pressure: "The feature has executive visibility. The engineer is competent and has already thought about encryption. Saying no here costs you political capital you may need later this quarter.",
            prompt: "What do you do with the email field?",
            options: [
              {
                id: "ch-dashevo-opt-encrypt",
                label: "Ship it, but encrypt the email to the user's own encryption key before writing",
                detail: "Uses the platform's encryption key purpose. Support cannot read it, only the user can.",
                score: -1,
                outcome: "It ships and looks responsible. But the ciphertext is permanent, the metadata still says this identity has a recovery email, the support use case does not actually work because support cannot decrypt, and the day the encryption key leaks or the algorithm ages, every historical address is exposed with no remediation path.",
                ripple: "You have created an unremovable ciphertext archive tied to real people, and you have given the organization a false sense that encryption solved a data-permanence problem. The next sensitive field gets added with less scrutiny because there is now a precedent.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-commitment",
                label: "Replace it with a salted commitment on-chain, keep the email in your own store, and document the linkage and deletion behaviour",
                detail: "The document holds an opaque hash; recovery works by matching a candidate email against the commitment through your service.",
                score: 3,
                outcome: "The feature ships in a shape that works. Support recovery functions through your service, the on-chain value is an opaque number with no offline guessing value because of the per-record salt, and deleting a user's record in your store permanently severs the linkage.",
                ripple: "You have established the pattern the whole company will reuse: the ledger carries commitments, your systems carry data. Every future privacy question becomes a routine application of an existing pattern rather than a fresh argument three hours before a freeze.",
                isBest: true
              },
              {
                id: "ch-dashevo-opt-truncated",
                label: "Store a truncated hash of the email so lookups are cheap and the value is not reversible",
                detail: "Sixty-four bits feels like plenty and keeps the index small.",
                score: -2,
                outcome: "Unsalted or truncated hashes of email addresses are trivially reversible at scale; the space of real email addresses is small enough to enumerate against any public breach corpus. You have published a de-anonymization index for your entire user base and made it permanent.",
                ripple: "When a researcher demonstrates the reversal, the story is not that you had a bug; it is that you designed a privacy control that a first-year student can defeat. That specific failure mode destroys technical credibility in a way ordinary vulnerabilities do not.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-escalate",
                label: "Stop the release and escalate to legal and the data protection officer before deciding",
                detail: "This is personal data on an immutable ledger; get the formal position first.",
                score: 1,
                outcome: "It is not wrong, and in a heavily regulated context it is mandatory. But it consumes the three hours you had, produces a decision no faster, and outsources a design judgment you were hired to make. Legal will ask you what the alternatives are, and you will need the commitment design anyway.",
                ripple: "The organization learns that security escalates rather than solves. Over time engineers route around you to avoid the delay, which is how a security function becomes a checkpoint people optimize past instead of a capability people consult.",
                isBest: false
              }
            ],
            debrief: "The tempting answer is encryption, because encryption is what a thoughtful engineer reaches for and because the platform genuinely offers encryption key purposes. It fails on three separate axes: it does not support the stated use case, it does not remove the metadata disclosure, and it converts a data-permanence problem into a key-permanence problem which is strictly worse because keys age and algorithms age while the ledger does not forget. The truncated hash is the option that looks sophisticated and is the most damaging, because low-entropy inputs make hashes into lookup tables, and email addresses are exactly that. Escalation is a legitimate instinct that becomes a failure mode when it substitutes for design; the correct sequencing is to bring legal a designed option, not an open question. The commitment pattern wins because it moves the permanent artifact to something with no standalone value, and because it puts the deletion lever inside a system you control. Note the general shape: when you cannot delete, do not store; store a pointer whose meaning you can destroy.",
            principle: "On an immutable public state, do not ask how to protect sensitive data. Ask what you can store instead whose meaning you retain the power to destroy."
          },
          awards: ["award-commitment-designer", "award-metadata-realist"],
          glossary: ["salted-commitment", "metadata-leakage", "right-to-erasure", "shielded-transition", "data-classification"]
        }
      ]
    },
    {
      id: "ch-dashevo-p3-evonode",
      title: "The Evonode Operator",
      credential: "Certified Evonode Operator, Production Key and Availability Security",
      summary: "Four thousand DASH of collateral, a public IP, a TLS certificate, a BLS operator key, an ED25519 platform node key, and a protocol that penalizes downtime. This Page turns node running into engineering: blast-radius separation, a hardening baseline you can audit, availability treated as a security property, and two incidents under a clock where the difference between a good operator and a great one is the order of the first two actions.",
      competencies: [
        "Separate collateral, operator and voting authority and place each key according to its blast radius",
        "Stand up and harden an evonode with a baseline that maps one to one against real dashmate configuration",
        "Treat proof-of-service enforcement as a security control and build off-node, independent monitoring for it",
        "Rotate an operator key correctly across the L1 and L2 boundary under suspected compromise",
        "Contain authority before containing hosts when signing material is implicated in an incident",
        "Publish an auditable node security baseline with checks, thresholds, owners and evidence"
      ],
      seal: "GOLD SEAL III — THE NODE",
      steps: [
        {
          id: "ch-dashevo-p3-key-separation",
          kind: "construct",
          title: "Four Keys, Four Blast Radii",
          statement: "Dash separates collateral, operation and voting into distinct keys precisely so that the key sitting on your internet-facing server is the one worth the least.",
          minutes: 26,
          respect: 115,
          trust: 6,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "What DIP-3 actually did",
              body: "The provider registration transaction carries two public key identifiers and one BLS public key, representing three roles. The owner controls the collateral and may change the payout address and delegate the other roles. The operator runs the node and may change only the service address and the operator reward address. The voter casts governance votes and can change no metadata at all. This is not bureaucratic tidiness. It is a deliberate decomposition of a single trusted role into three with sharply different blast radii, done at the protocol level so that operators cannot accidentally collapse them. DIP-28 then adds the evonode dimension: masternode type 1, four thousand DASH collateral instead of one thousand, a twenty-byte platformNodeID derived from an ED25519 P2P key, a platform P2P port defaulting to 26656 and a platform HTTP port defaulting to 443."
            },
            {
              kind: "table",
              title: "The blast-radius map you should be able to draw from memory",
              headers: ["Key", "Controls", "Where it must live", "If stolen"],
              rows: [
                ["Owner key", "The collateral, payout address, delegation of operator and voting roles", "Cold, offline, ideally hardware, never on the node", "The attacker redirects rewards and can re-delegate the node; the collateral itself is protected by the collateral UTXO keys"],
                ["Collateral UTXO key", "The 4000 DASH itself", "Deepest cold storage, separate from everything else, multi-party if possible", "Total loss of the collateral, which is the whole economic position"],
                ["Operator BLS key", "Service address, operator reward address, participation in quorum signing", "On the node, because it must be", "Attacker can misrepresent service details and participate as your node in quorums; you lose service, not collateral"],
                ["Voting key", "Governance votes and contested-resource votes", "Separate host or a signing service, never on the evonode", "Attacker votes with your weight on treasury proposals and contested names"],
                ["Platform node ED25519 key", "Node identity in the Tenderdash P2P network", "On the node, backed up encrypted", "Impersonation and disruption at the P2P layer; loss also means an identity change on rebuild"]
              ]
            },
            {
              kind: "principle",
              title: "The least-privileged key goes in the most-exposed place",
              body: "Exposure and authority must run in opposite directions. The machine with the public IP and the open port gets the key that can do the least. Any architecture where the internet-facing component holds the highest-value credential is broken regardless of how well that component is hardened."
            },
            {
              kind: "prose",
              title: "The L2 consequence people miss",
              body: "Platform automatically creates identities for the owner, operator and voting roles, with keys derived from the Core chain masternode registration. Those identities cannot have their keys modified through a normal identity update state transition; they change only through Core masternode transactions. That means your L2 key rotation story for a masternode identity runs through L1, and the tooling, custody and approval process for that rotation are Core chain concerns. If your incident runbook says rotate the identity key and the identity in question is a masternode identity, the runbook is wrong and you will discover it at the worst possible time."
            },
            {
              kind: "callout",
              title: "Four times the weight, four times the target",
              body: "An evonode carries four thousand DASH and four times the governance vote weight of a masternode, and during the Platform transition it receives four consecutive payment blocks when selected. Every one of those multipliers also multiplies your attractiveness as a target. Higher-value nodes deserve a different operational tier: separate credentials, separate monitoring, separate change control, and a named owner. Do not run a four-thousand-DASH position with the same discipline you would apply to a hobby VPS."
            }
          ],
          awards: ["award-blast-radius-mapper"],
          glossary: ["proregtx", "operator-key", "voting-key", "collateral", "platform-node-id"]
        },
        {
          id: "ch-dashevo-p3-build",
          kind: "lab",
          title: "Standing Up an Evonode You Would Bet On",
          statement: "An evonode is a production service with a public IP, a renewing certificate, live signing material and a four-thousand-DASH reason for someone to care about it.",
          minutes: 40,
          respect: 205,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "code",
              lang: "bash",
              title: "The real operator loop with dashmate",
              body: "# Interactive setup: collateral, addresses, operator keys, SSL choice\ndashmate setup\n\n# Keep logs useful and bounded, and keep metrics off the public interface\ndashmate config set core.log.filePath /var/log/dash/core.log\ndashmate config set core.log.debug.enabled false\ndashmate config set platform.gateway.log.level info\ndashmate config set platform.drive.abci.logs.stdout.level info\ndashmate config set platform.drive.tenderdash.log.level info\ndashmate config set platform.gateway.metrics.enabled true\n\ndashmate start\n\n# Status is a security signal, not just an ops signal\ndashmate status\ndashmate status core\ndashmate status masternode\ndashmate status platform\ndashmate status services\n\n# Run this before you open a support thread and before you blame the network\ndashmate doctor\n"
            },
            {
              kind: "table",
              title: "Ports, and the exposure decision for each",
              headers: ["Port", "Service", "Must be public", "Control"],
              rows: [
                ["9999", "Dash Core P2P", "Yes", "Rate limiting upstream; monitor peer counts and ban lists"],
                ["26656", "Platform P2P (Tenderdash)", "Yes", "Firewall to the interface only; alert on peer churn"],
                ["443", "Platform HTTP, gRPC and gRPC-Web for clients", "Yes", "Valid certificate, renewal monitoring, request rate limits"],
                ["26657", "Tenderdash RPC", "No", "Bind to loopback or a private interface; this is an operator interface"],
                ["9090", "Gateway metrics", "No", "Private network or authenticated scrape only"],
                ["29090", "Drive ABCI metrics", "No", "Private network or authenticated scrape only"],
                ["9091", "RS-DAPI metrics", "No", "Private network or authenticated scrape only"],
                ["22", "SSH", "Preferably no", "Bastion or wireguard only, key auth, no passwords, no root login"]
              ]
            },
            {
              kind: "checklist",
              title: "Hardening baseline, each item auditable",
              items: [
                "The owner key and the collateral UTXO key exist on no machine that has ever had a public IP",
                "The voting key is not present on the evonode; votes are signed elsewhere",
                "The operator BLS key and the platform ED25519 node key are backed up encrypted, off-host, and the restore has been tested",
                "SSH is key-only, root login disabled, access via bastion or an overlay network, and the authorized key list is reviewed monthly",
                "Metrics and Tenderdash RPC are unreachable from the public internet, verified by an external scan and not by reading config",
                "Certificate expiry is monitored with an alert at thirty days and an escalation at seven; renewal failure is treated as a P2 incident",
                "Unattended security updates are enabled and reboots are scheduled with a documented quorum-participation impact",
                "Logs ship off-host in near real time so that a compromised node cannot erase its own history",
                "Disk is encrypted at rest and the passphrase custody model is written down",
                "Time synchronization is monitored; clock skew degrades consensus participation before it degrades anything you would notice",
                "Node software versions are tracked against release announcements, with a named owner for the upgrade decision",
                "A monthly restore-from-backup rebuild is performed on a spare host to prove the runbook works"
              ]
            },
            {
              kind: "prose",
              title: "Metrics endpoints are an intelligence source for your adversary",
              body: "Gateway, Drive ABCI and RS-DAPI metrics are extremely useful and extremely revealing. They expose participation, throughput, error rates, peer topology and, by inference, your maintenance windows and your capacity headroom. An attacker planning a targeted denial of service against an evonode to knock it out of quorum participation would very much like a public metrics endpoint that tells them exactly when they succeeded. Bind them privately. If you need remote scraping, put it behind an authenticated tunnel, not behind an obscure port."
            },
            {
              kind: "callout",
              title: "The certificate is an availability dependency, therefore a security dependency",
              body: "Evonodes need a valid certificate for the platform HTTP port. Certificate renewal is an automated process that depends on a third party, a DNS record, an outbound path and a clock. Every one of those has failed for somebody. A silent renewal failure ends with your node unreachable to clients, then failing service checks, then facing proof-of-service consequences, and you will spend the first thirty minutes of the incident looking at consensus logs. Monitor expiry as a first-class alert with a human owner."
            },
            {
              kind: "principle",
              title: "A baseline is only real if an outsider can verify it",
              body: "Every hardening item must be phrased so that someone who does not trust you can check it from outside the host. If the only way to confirm a control is to read your configuration file, you have a claim, not a control."
            }
          ],
          awards: ["award-node-hardener"],
          glossary: ["dashmate", "tenderdash-rpc", "attack-surface-reduction", "certificate-lifecycle", "bastion-host"]
        },
        {
          id: "ch-dashevo-p3-pose",
          kind: "lesson",
          title: "Availability Is a Security Property When Downtime Costs Collateral",
          statement: "On this network your uptime is enforced by the protocol, so an availability incident and a security incident have the same shape, the same clock, and often the same cause.",
          minutes: 30,
          respect: 165,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Proof of service as an economic control",
              body: "The network continuously checks that registered nodes actually provide service. Nodes that fail accumulate penalty score, and past a threshold they are banned from the valid list, which means no rewards and no quorum participation until they are re-registered and prove themselves again. The purpose is to prevent free-riding: collateral alone should not entitle you to payment. The second-order effect is what matters to you as a security engineer. It converts availability into a directly monetized attack surface. An adversary who can degrade a competitor's evonode does not need to steal anything; they need only to make it fail service checks."
            },
            {
              kind: "list",
              title: "What actually causes penalties in practice, ranked by frequency in operator reports",
              items: [
                "Certificate expiry or renewal failure making the platform HTTP port unusable to clients",
                "Disk exhaustion from unrotated logs or an unpruned chain state, which stalls the node quietly before it stops it loudly",
                "Memory pressure during upgrade windows when both old and new state exist simultaneously",
                "Network transit issues at the hosting provider that never show as an instance failure and therefore never page anyone",
                "Firewall or security group changes made for an unrelated reason that close a port the protocol needs",
                "Clock skew degrading consensus participation before any monitoring threshold notices",
                "Unattended upgrades restarting services during a DKG window, causing exclusion from the forming quorum"
              ]
            },
            {
              kind: "table",
              title: "Signal, detection, response, and the budget you have",
              headers: ["Signal", "How you detect it independently", "First response", "Time budget"],
              rows: [
                ["Platform HTTP unreachable from outside", "External synthetic probe from at least two networks", "Check certificate, then firewall, then process", "Minutes"],
                ["Peer count collapse on 26656", "Off-host metrics scrape with alerting", "Check transit and provider status before touching config", "Tens of minutes"],
                ["Missed DKG participation", "Parse quorum commitments for your proTxHash", "Verify process health and clock, then look for exclusion cause", "Hours, but it recurs"],
                ["Penalty score rising", "Poll the masternode list from an independent node", "Treat as an active incident, not a metric", "Immediate"],
                ["Node banned", "List membership check", "Recovery runbook, then a full post-incident review", "Already too late; this is the failure you were preventing"]
              ]
            },
            {
              kind: "compare",
              title: "Two ways to think about uptime",
              left: {
                title: "Classic enterprise SLO thinking",
                items: [
                  "Downtime costs revenue and reputation, measured in aggregate",
                  "An error budget lets you spend availability deliberately",
                  "Degradation is usually graceful and partial",
                  "Recovery restores you to exactly where you were",
                  "The penalty is negotiated with a customer"
                ]
              },
              right: {
                title: "Protocol-enforced liveness",
                items: [
                  "Downtime triggers a rule, not a negotiation",
                  "There is no error budget; the threshold is set by consensus code",
                  "Degradation is binary from the protocol's point of view",
                  "Recovery may require re-registration and a fresh proving period",
                  "The penalty is applied by software that does not read your incident report"
                ]
              }
            },
            {
              kind: "callout",
              title: "Monitor from somewhere the node cannot lie about",
              body: "A compromised or failing node is exactly the entity you should not be asking whether it is healthy. Every critical availability signal must be produced by something external to the node: a synthetic probe from a different network, a masternode list query from an independent client, a metrics scrape to a collector the node cannot write to. This is the same principle as shipping logs off-host, applied to health rather than history."
            },
            {
              kind: "principle",
              title: "When the protocol enforces liveness, availability engineering is security engineering",
              body: "Any system that penalizes unavailability by rule has merged the two disciplines. Your denial-of-service threat model, your capacity plan and your patch window are now the same document, and the person who owns uptime owns a security control whether they know it or not."
            }
          ],
          awards: ["award-liveness-guardian"],
          glossary: ["proof-of-service", "pose-ban", "synthetic-probe", "dkg-window", "error-budget"]
        },
        {
          id: "ch-dashevo-p3-rotation",
          kind: "drill",
          title: "Rotating a Key You Cannot Un-Publish",
          statement: "Key rotation on a public chain is itself a public event, so the rotation is a signal to your adversary and must be sequenced with that in mind.",
          minutes: 32,
          respect: 195,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Three rotation paths, three different processes",
              body: "The operator BLS key is changed on the Core chain with a provider update registrar transaction signed by the owner key, and the service details are updated with a provider update service transaction signed by the operator. Ordinary Platform identity keys are changed with an identity update state transition that adds a new key and disables the old one, where disabled means it can no longer sign but is retained so past signatures still verify. Masternode identity keys on Platform are not rotatable at L2 at all; they follow the Core registration. Three paths, three custody models, three sets of tooling. If your incident response plan has one section called key rotation, it is not a plan."
            },
            {
              kind: "numbered",
              title: "Safe rotation order, and why the order is the whole thing",
              items: [
                "Regain a clean signing environment first: a machine that was not part of the exposure, with the higher-authority key you will use to authorize the change",
                "Generate the replacement key material in that clean environment and verify you can use it before you invalidate anything",
                "Publish the change that grants the new key authority",
                "Publish the change that removes the old key's authority, or do both atomically if the transition supports it",
                "Verify from an independent client, with a proof, that the on-chain state reflects exactly the key set you intended",
                "Only then rebuild, isolate or image the exposed host",
                "Finally, communicate; disclosure comes after control, not before"
              ]
            },
            {
              kind: "table",
              title: "What each key rotation actually protects",
              headers: ["Rotated key", "Protects against", "Does not protect against", "Downtime cost"],
              rows: [
                ["Operator BLS key", "Continued impersonation of your node in quorums and service metadata changes", "Anything already signed, and the collateral, which it never controlled", "Brief, a restart and a confirmation window"],
                ["Platform authentication key", "Future signed state transitions by the attacker", "Documents already written, which are permanent", "None if you add before you disable"],
                ["Transfer key", "Further credit withdrawal", "Credits already withdrawn, which are gone", "None"],
                ["Master key", "Total identity takeover continuing", "An attacker who already added their own keys before you acted", "None, but this is the ceremony you must have rehearsed"],
                ["Collateral UTXO key", "Theft of the collateral", "Everything else; this is a slow, heavy, last-resort move", "Significant: full re-registration and proving period"]
              ]
            }
          ],
          drill: {
            id: "ch-dashevo-p3-rotation-drill",
            scene: "A junior engineer, debugging a startup failure at the end of a long day, pasted a config fragment into a public paste service to ask for help. The fragment included the evonode operator BLS private key. They deleted the paste eleven minutes later and told you immediately, which is the single best thing that has happened today. The node is running normally. It is 18:40 on a Friday.",
            clock: "Assume it was scraped within seconds. You have minutes, not hours.",
            pressure: "The engineer is distraught and is asking whether they should resign. The on-call rotation for the collateral custody process is a person who is on a flight. The node is currently participating in a quorum.",
            prompt: "What is your first action?",
            options: [
              {
                id: "ch-dashevo-opt-rotate-first",
                label: "Rotate the operator key immediately from a clean machine using the owner key, then rebuild the node",
                detail: "Provider update registrar transaction with a fresh BLS key, verified from an independent client, then rebuild the host and restore service.",
                score: 3,
                outcome: "The exposed key loses its authority within the time it takes to get a confirmation. Your node has a brief service interruption during the switch, which is a known and acceptable cost. The rebuild afterwards is a hygiene measure rather than a race.",
                ripple: "The organization sees that revocation is fast, rehearsed and unremarkable, which is the single most valuable cultural outcome you can produce. Engineers report exposures faster because reporting leads to a competent forty-minute procedure instead of a tribunal.",
                isBest: true
              },
              {
                id: "ch-dashevo-opt-offline-first",
                label: "Take the node offline immediately, then plan the rotation calmly over the weekend",
                detail: "Contain first, decide later. Nothing can be abused while the node is down.",
                score: 0,
                outcome: "It feels responsible and achieves almost nothing. The operator key's authority is a property of the on-chain registration, not of your process being alive; taking the host down does not revoke it. Meanwhile you accumulate penalty score, drop out of quorum participation, and lose rewards over a weekend.",
                ripple: "You have taught the team that the response to a key exposure is a service outage. The next time someone suspects an exposure they will hesitate, because reporting it now costs the business visible uptime, and hesitation is the thing you can least afford.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-collateral",
                label: "Move the 4000 DASH collateral to a new address and re-register the node from scratch",
                detail: "Treat it as a full compromise and rebuild the economic position cleanly.",
                score: -2,
                outcome: "A slow, expensive, high-risk operation that solves a problem you do not have. The operator key never controlled the collateral; that is the entire point of DIP-3 key separation. You have now put your largest asset through a live transaction under time pressure, on a Friday evening, with your custody on-call unavailable.",
                ripple: "The most likely bad outcome of this incident is now a mistake in the collateral move rather than anything the attacker does. Panic-driven movement of high-value assets is how exposure incidents turn into loss incidents.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-disclose",
                label: "Rotate, and simultaneously post a disclosure to the operator community and the project's security contact",
                detail: "Transparency immediately; other operators may be affected by the same tooling pattern.",
                score: 1,
                outcome: "The rotation is right and the transparency instinct is admirable, but the sequencing splits your attention during the only window that matters, and this is not a network-wide issue. It is one operator's key, exposed by one paste.",
                ripple: "Publishing during the response window invites questions you cannot answer yet, and a partial early account is very hard to correct later without looking evasive. Disclose after control, with a complete timeline, and the same facts land far better.",
                isBest: false
              }
            ],
            debrief: "Everything here turns on knowing what the operator key controls. It controls participation and service metadata. It does not control the collateral and it does not control the payout destination, because DIP-3 separated those roles specifically so that this incident would be survivable. The taking-it-offline option is the plausible-but-wrong one, and it is the one most seasoned enterprise responders choose, because containment-first is correct in an environment where authority is a session that dies with the host. On a chain, authority is a registration that outlives the host entirely. Revocation is a state change, and until you publish it, taking your machine down protects nobody. The collateral option is the panic option dressed as thoroughness; note that it converts a contained key exposure into an uncontained asset movement. And notice the human dimension: an engineer who reports an exposure in under a minute is an asset, and how you treat them determines your mean time to detection for the next five years.",
            principle: "Revoke the authority, then contain the host. On systems where authority lives on-chain, pulling the plug is not containment."
          },
          awards: ["award-rotation-runner"],
          glossary: ["proupregtx", "key-rotation", "revocation", "blast-radius", "identity-update"]
        },
        {
          id: "ch-dashevo-p3-incident",
          kind: "drill",
          title: "03:14 — The Node Is Signing Things You Did Not Ask For",
          statement: "When a machine holding signing material misbehaves, the first decision is always containment of authority, never containment of the host.",
          minutes: 35,
          respect: 205,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "timeline",
              title: "The last seven minutes",
              items: [
                "03:07 — Off-host log collector alerts on an outbound connection from the evonode to an address in no allowlist, sustained, low volume",
                "03:09 — Process listing shows an unfamiliar binary running as the same user as the node services",
                "03:11 — Your independent masternode list query shows the node still valid and still in the current quorum",
                "03:12 — Metrics show normal signing participation, which means the operator key is being used right now by something",
                "03:13 — The hosting provider console is reachable; the bastion is reachable; the owner key is in cold storage two hours away by process, not by distance",
                "03:14 — You have to decide"
              ]
            },
            {
              kind: "prose",
              title: "The trap in your training",
              body: "Everything you were taught about incident response in a corporate environment optimizes for evidence, because in that environment the attacker's ongoing capability is usually bounded by a session, a token, or a foothold that dies when you isolate the host. Here the attacker's capability is a key, and a key does not die when the host dies. It also does not die when you unplug the network cable, because they may already have a copy. The only thing that ends the key's power is a published state change. Every minute you spend preserving memory is a minute the key is still authoritative."
            },
            {
              kind: "list",
              title: "The levers actually available at 03:14",
              items: [
                "Rotate the operator key with the owner key, from a clean environment, ending the exposed key's authority",
                "Isolate the host at the network layer, which stops further exfiltration but not further authority use",
                "Kill the containers, which stops your node signing but does not stop the attacker signing with a copied key",
                "Capture volatile memory, which is valuable evidence and costs you the only minutes that matter",
                "Wake a second person, which is almost always correct and almost always forgotten"
              ]
            },
            {
              kind: "table",
              title: "Two response orders, same actions, different outcomes",
              headers: ["Order", "Minute 0-10", "Minute 10-40", "Result"],
              rows: [
                ["Evidence first", "Memory capture, disk snapshot, careful documentation", "Isolation, then eventually rotation", "Excellent forensic record of an attacker who retained authority for forty minutes"],
                ["Authority first", "Rotate from clean environment, verify on-chain with a proof", "Isolate, snapshot, image, investigate", "Attacker loses capability in minutes; you still get the disk, and memory loss is a known, accepted cost"]
              ]
            }
          ],
          drill: {
            id: "ch-dashevo-p3-incident-drill",
            scene: "03:14. Your evonode is running an unfamiliar process as the service user, is making sustained outbound connections to an unallowlisted address, and is currently participating in an active quorum. The operator BLS key is on that host by necessity. The platform ED25519 node key is on that host. Logs are shipping off-box and appear intact. You are alone on call.",
            clock: "Every minute the exposed key remains authoritative",
            pressure: "You have never rotated an operator key at 3am. The owner key custody procedure requires a second approver. Your instinct, trained by a decade of enterprise IR, is screaming preserve the evidence.",
            prompt: "What do you do first?",
            options: [
              {
                id: "ch-dashevo-opt-kill",
                label: "Kill the containers and pull the host off the network",
                detail: "Immediate, decisive containment of the compromised machine.",
                score: 1,
                outcome: "Exfiltration stops and the unfamiliar process dies. But if the operator key was copied at any point in the intrusion, and you must assume it was, the attacker retains the ability to act as your node from anywhere. You have also guaranteed a service outage and penalty accumulation without buying revocation.",
                ripple: "The post-incident review will find that the attacker used the key after your containment, and the finding will be that the team confused host containment with authority containment. That is a doctrine failure, not an execution failure, and it will repeat until the doctrine changes.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-forensics",
                label: "Capture volatile memory and take a disk snapshot before touching anything",
                detail: "Standard incident response practice. Evidence degrades; act carefully and preserve the ability to investigate.",
                score: -2,
                outcome: "You produce a beautiful forensic record. It takes twenty-five to forty minutes on a real host with real volumes. Throughout that period the exposed key retains full authority and the attacker knows they have been noticed the moment your tooling touches the box.",
                ripple: "You optimized for the investigation at the expense of the outcome. In systems where compromise converts directly into irreversible action, this reflex is the single most expensive habit an experienced responder brings with them, precisely because it was correct everywhere they learned it.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-authority",
                label: "Wake the second approver and rotate the operator key from a clean environment, then isolate the host, then image it",
                detail: "Revoke authority, verify the new key set on-chain with a proof from an independent client, and only then deal with the machine.",
                score: 3,
                outcome: "Within the confirmation window the exposed key is worthless. The attacker's copy becomes an artifact rather than a capability. You then isolate at leisure, snapshot the disk, and run a real investigation without a clock on it. Memory is lost, and you write that down as an accepted cost.",
                ripple: "This becomes the template: authority first, host second, evidence third. Every subsequent incident involving credentials, tokens, cloud keys or signing material gets faster, and the team stops relitigating the order under pressure because the order is doctrine.",
                isBest: true
              },
              {
                id: "ch-dashevo-opt-observe",
                label: "Watch for thirty minutes to characterize the actor before acting",
                detail: "Understanding the intrusion path first prevents you from rotating into a still-compromised environment.",
                score: -3,
                outcome: "Thirty minutes of an attacker holding a live signing key on a node with real economic weight. The stated justification is real, which is what makes this option dangerous: rotating into a compromised environment is a genuine risk. But the answer to that risk is a clean environment, not a delay.",
                ripple: "If anything is lost during those thirty minutes, no explanation survives the review. Deliberate delay while an attacker holds signing authority is the one decision that ends careers, because it is indefensible in hindsight regardless of how defensible it felt.",
                isBest: false
              }
            ],
            debrief: "The forensics option is the plausible-but-wrong answer and it is chosen by the most experienced people in the room, which is exactly why it is the teaching device. Evidence-first is correct when the attacker's capability is tied to the asset you are containing. It is wrong when the attacker's capability is a copied secret that operates independently of the host. The discriminating question is one sentence long: does my containment action remove the attacker's ability to act. If the answer is no, it is not containment, it is cleanup. Note also the third option's structure. It does not skip forensics, it reorders it, and it explicitly names memory loss as an accepted cost. Good incident doctrine does not pretend tradeoffs away; it decides them in advance and writes them down so nobody has to be brave at 3am. Finally, waking the second approver is in the correct option for a reason: dual control on high-authority keys is only a real control if the process for waking the second person is rehearsed. If your custody model cannot produce a second approver in ten minutes at 3am, you do not have dual control, you have a delay.",
            principle: "Ask of every containment action: does this remove the adversary's ability to act. If not, it is cleanup, and cleanup never goes first."
          },
          awards: ["award-authority-containment", "award-three-am-operator"],
          glossary: ["authority-containment", "volatile-memory", "dual-control", "mean-time-to-revoke"]
        },
        {
          id: "ch-dashevo-p3-field-node",
          kind: "field",
          title: "Publish an Evonode Security Baseline",
          statement: "A baseline nobody can audit is a preference; a baseline with checks, thresholds, owners and evidence is a control.",
          minutes: 40,
          respect: 210,
          trust: 13,
          mode: "both",
          praxis: "Produce and publish a complete security baseline for an evonode, whether you run one yourself, run a testnet node, or write it for a real operator who agrees to review it. It must contain: the blast-radius map for all five key types with your stated custody location for each; the port exposure table with an external scan result proving the private ports are private; the hardening checklist with each item expressed as an externally verifiable check; the availability monitoring design showing which signals are produced off-node; the rotation runbook for the operator key including who the second approver is and how they are reached at 3am; and an accepted-risk register naming what you chose not to do and why. Then have one other person attempt to falsify at least three of your claims from outside the host, and publish their findings alongside your baseline without editing them.",
          evidence: "On your Praxis Profile attach: the published baseline document with a version and a date; the raw output of the external port scan performed by your reviewer, not by you; a screenshot or transcript of a successful restore-from-backup rebuild on a spare host; the rotation runbook with the dual-control path named; and the reviewer's unedited falsification notes with your written response to each finding. A baseline submitted without an adversarial review from a second person does not count.",
          blocks: [
            {
              kind: "numbered",
              title: "What the baseline must contain, in this order",
              items: [
                "Scope and threat model: what this node is worth, who would want it, and what they would do with it",
                "Blast-radius map: every key, what it controls, where it lives, what happens if it is stolen",
                "Exposure surface: every listening port with a public or private decision and the control that enforces it",
                "Hardening controls: each stated so that an outsider can verify it without your cooperation",
                "Availability and proof-of-service monitoring: which signals, produced by what, alerting whom, with what time budget",
                "Rotation and recovery runbooks: operator key, node key, and full rebuild, each with a tested restore",
                "Accepted risks: the things you decided not to do, with the reason and a review date",
                "Ownership and cadence: who owns each control and when it is re-verified"
              ]
            },
            {
              kind: "table",
              title: "Control, check, evidence: the three-column discipline",
              headers: ["Control", "External check", "Evidence artifact"],
              rows: [
                ["Tenderdash RPC not publicly reachable", "External scan of 26657 from two networks", "Timestamped scan output run by a second person"],
                ["Metrics endpoints private", "External scan of 9090, 29090, 9091", "Timestamped scan output"],
                ["Certificate valid and monitored", "Remote TLS handshake plus expiry query", "Alert configuration screenshot and one triggered test alert"],
                ["Owner key absent from the node", "Filesystem attestation plus a signed statement of custody location", "Custody procedure document and a rehearsal log"],
                ["Backups restorable", "Rebuild on a spare host from backup only", "Rebuild transcript with start and end timestamps"],
                ["Logs shipped off-host", "Confirm entries present in the collector after deleting locally", "Collector query result spanning the deletion window"]
              ]
            },
            {
              kind: "code",
              lang: "bash",
              title: "A verification script your reviewer runs, not you",
              body: "#!/usr/bin/env bash\nset -euo pipefail\n\nHOST=${1:?usage: verify-baseline.sh host}\nFAIL=0\n\ncheck_closed() {\n  local port=$1 name=$2\n  if nc -z -w3 $HOST $port 2>/dev/null; then\n    echo FAIL $name port $port is reachable from outside\n    FAIL=1\n  else\n    echo PASS $name port $port not reachable\n  fi\n}\n\ncheck_open() {\n  local port=$1 name=$2\n  if nc -z -w3 $HOST $port 2>/dev/null; then\n    echo PASS $name port $port reachable as intended\n  else\n    echo FAIL $name port $port should be reachable and is not\n    FAIL=1\n  fi\n}\n\ncheck_open 9999 core-p2p\ncheck_open 26656 platform-p2p\ncheck_open 443 platform-http\ncheck_closed 26657 tenderdash-rpc\ncheck_closed 9090 gateway-metrics\ncheck_closed 29090 drive-metrics\ncheck_closed 9091 rsdapi-metrics\n\nDAYS=$(echo | openssl s_client -connect $HOST:443 2>/dev/null \\\n  | openssl x509 -noout -enddate \\\n  | cut -d= -f2 \\\n  | xargs -I{} date -d {} +%s \\\n  | awk -v now=$(date +%s) '{print int(($1-now)/86400)}')\n\nif [ $DAYS -lt 30 ]; then\n  echo FAIL certificate expires in $DAYS days\n  FAIL=1\nelse\n  echo PASS certificate valid for $DAYS days\nfi\n\nexit $FAIL\n"
            },
            {
              kind: "callout",
              title: "The reviewer is the point",
              body: "You will be tempted to write the baseline, run the checks yourself, and publish a clean result. Do not. The entire value of this exercise is the gap between what you believe about your system and what a second person can demonstrate from outside it. That gap is where every incident you will ever have is currently hiding. Publish the gap."
            },
            {
              kind: "principle",
              title: "A control you verify yourself is a belief",
              body: "Self-attested security is not security; it is documentation of intent. Independent verification is the smallest unit of actual assurance, and any program that cannot produce it is measuring effort rather than outcome."
            }
          ],
          awards: ["award-baseline-published", "award-adversarial-review"],
          glossary: ["security-baseline", "independent-verification", "accepted-risk", "runbook"]
        }
      ]
    },
    {
      id: "ch-dashevo-p4-governance",
      title: "Governance, Treasury, and the Electorate You Cannot Fire",
      credential: "Certified Practitioner, Decentralized Governance and Treasury Risk",
      summary: "A treasury that pays out monthly by vote, an electorate of collateralized strangers, and voting keys that are just credentials with a democratic costume. This Page covers treasury mechanics, vote-key concentration, how to write a security proposal that survives a thousand skeptical readers, and how to run coordinated disclosure into a network that has no CISO to call.",
      competencies: [
        "State Dash treasury mechanics precisely: subsidy split, superblock cadence, proposal fee, voting cutoff and the passing rule",
        "Analyze governance as an authentication system and identify concentration and delegation risk in voting keys",
        "Write a security proposal that is fundable by an anonymous electorate with divergent incentives",
        "Design a coordinated disclosure path for a system with no central security team and live user funds",
        "Produce a governance risk memo that puts a decentralized dependency into an enterprise risk register with real numbers"
      ],
      seal: "GOLD SEAL IV — THE ELECTORATE",
      steps: [
        {
          id: "ch-dashevo-p4-treasury",
          kind: "lesson",
          title: "A Budget Nobody Owns",
          statement: "A treasury governed by voters you cannot hire or fire changes the security question from who approved this to who could be persuaded.",
          minutes: 26,
          respect: 125,
          trust: 6,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Money that allocates itself on a schedule",
              body: "Dash reserves a portion of every block subsidy for a governance budget that is disbursed by masternode vote. Nobody signs a purchase order. There is no CFO to appeal to, no procurement review, and no vendor risk questionnaire. Proposals are submitted on-chain with a fee, masternodes vote over a window, and at a superblock the network pays the winners automatically. If you come from a corporate security background, sit with that for a moment: the funding mechanism for security work in this ecosystem is an election, and elections are won by communication as much as by merit."
            },
            {
              kind: "table",
              title: "The mechanics, as stated in Dash's governance documentation",
              headers: ["Parameter", "Value", "Security relevance"],
              rows: [
                ["Block subsidy split", "80 percent to mining and masternode rewards, 20 percent to the governance budget", "The budget is a function of price and emission, so security funding is procyclical and shrinks exactly when attacks get cheaper relative to it"],
                ["Superblock interval", "Every 16616 blocks, approximately 30.29 days", "One funding cycle per month; a missed cycle is a month of delay for any urgent work"],
                ["Proposal fee", "1 DASH to submit a governance object", "An anti-spam control, and also a barrier that filters out casual but legitimate contributors"],
                ["Passing rule", "Yes votes minus No votes must exceed the total number of masternodes divided by ten", "Abstention is functionally a No, which means low turnout kills good proposals"],
                ["Voting cutoff", "1662 blocks before the superblock", "Creates a deadline that late-breaking objections cannot cross, and a window an adversary can time against"],
                ["Vote weight", "Evonodes carry four votes, masternodes one", "Weight follows collateral, so influence concentrates with capital, not with expertise"]
              ]
            },
            {
              kind: "list",
              title: "Attack surfaces of an on-chain treasury",
              items: [
                "Vote buying and side payments, which are undetectable on-chain because a vote and a bribe do not have to touch the same ledger",
                "Sockpuppet proposals that fragment support across near-identical options so none clears the threshold",
                "Hosting and custody concentration, where one service holds voting keys for hundreds of nodes and becomes a single point of governance failure",
                "Timing attacks near the voting cutoff, where damaging information is released too late to change votes or too late to be rebutted",
                "Apathy as an attack: because abstention behaves like No, an adversary needs only to suppress turnout rather than to win an argument",
                "Funding capture, where a single team becomes the network's only maintainer and the treasury becomes a dependency rather than a market"
              ]
            },
            {
              kind: "compare",
              title: "Corporate budget versus on-chain treasury",
              left: {
                title: "Corporate",
                items: [
                  "One accountable approver you can persuade in a meeting",
                  "Confidential proposals; you can discuss the vulnerability honestly",
                  "Emergency spend is possible within hours",
                  "Failure to fund is a management decision with a named owner",
                  "Vendor due diligence is a defined process"
                ]
              },
              right: {
                title: "On-chain treasury",
                items: [
                  "Hundreds of independent approvers with different incentives and no meeting",
                  "Public proposals; you cannot describe the vulnerability you want funded",
                  "Emergency spend takes a full monthly cycle at best",
                  "Failure to fund is an aggregate outcome nobody is accountable for",
                  "Due diligence is whatever the electorate individually chooses to do, which is often nothing"
                ]
              }
            },
            {
              kind: "callout",
              title: "The security-funding paradox",
              body: "The most valuable security work in a decentralized network is the least fundable by public vote, because describing it publicly is often the thing you are trying to prevent. You cannot campaign for funding to fix a vulnerability by explaining the vulnerability. The practical answer is to fund capability rather than incidents: get a standing security function funded during calm periods, with a mandate broad enough to cover work it cannot pre-describe, and with a public accountability report that proves value without disclosing detail."
            },
            {
              kind: "principle",
              title: "Where funding is a vote, communication is a control",
              body: "In any environment where resources are allocated by an electorate rather than an executive, your ability to explain risk to non-specialists is not a soft skill adjacent to the work. It is the mechanism by which the work exists at all."
            }
          ],
          awards: ["award-treasury-literate"],
          glossary: ["superblock", "governance-object", "net-yes-rule", "voting-cutoff", "treasury-capture"]
        },
        {
          id: "ch-dashevo-p4-vote-security",
          kind: "lesson",
          title: "Voting Keys Are Credentials",
          statement: "Every governance mechanism is an authentication system wearing a democratic costume, and it fails in exactly the ways authentication fails.",
          minutes: 30,
          respect: 165,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The same key decides two very different things",
              body: "The voting key registered in a masternode's provider registration transaction is used for treasury governance and also for contested-resource voting on Platform, including DPNS premium names. One credential, two domains, two risk profiles. A treasury vote moves money. A contested-name vote decides who gets to be recognized as a brand. An attacker who compromises voting keys across a hosting provider does not need to steal anything to profit; they can win a valuable name, or swing a funding decision, and in both cases the on-chain record looks like ordinary participation."
            },
            {
              kind: "table",
              title: "Governance action, key used, typical custody, concentration risk",
              headers: ["Action", "Key", "Where it typically lives", "Concentration risk"],
              rows: [
                ["Treasury proposal vote", "Voting key", "Often delegated to a hosting or monitoring service", "One service can hold voting authority for hundreds of nodes"],
                ["Contested name vote", "Voting key", "Same key, same custody, usually less thought about", "Same concentration, applied to brand and impersonation outcomes"],
                ["Changing the payout address", "Owner key", "Cold storage, ideally hardware", "Low if custody is disciplined; catastrophic for the individual operator if not"],
                ["Changing service details", "Operator key", "On the node", "Distributed by design, which is why it is the right key to expose"],
                ["Delegating roles", "Owner key", "Cold storage", "The delegation itself is the risk: it is easy to delegate and easy to forget"]
              ]
            },
            {
              kind: "list",
              title: "Controls that actually reduce governance risk",
              items: [
                "Keep the voting key off the evonode entirely; a compromise of the node should never yield governance influence",
                "Publish your voting policy in advance so that a vote inconsistent with it is externally detectable as anomalous",
                "Delegate and verify: if a service votes on your behalf, reconcile its votes against the on-chain record every cycle",
                "Alert on any vote cast by your proTxHash that you did not initiate, treating it as an authentication anomaly rather than a governance disagreement",
                "Use the ability to change a contested-resource vote up to four times as a correction mechanism, and monitor for someone else using it against you",
                "Treat a hosting provider that holds voting keys as a critical third party with a real assessment, not as an operational convenience"
              ]
            },
            {
              kind: "compare",
              title: "Contested-name voting and treasury voting: same key, different stakes",
              left: {
                title: "Contested name vote",
                items: [
                  "Two-week window, additional claimants may join in week one",
                  "Options are support, abstain, or lock so nobody gets it",
                  "Evonode weight four, masternode weight one",
                  "Outcome is an identity binding that is very hard to undo",
                  "Failure mode is brand impersonation of real organizations"
                ]
              },
              right: {
                title: "Treasury proposal vote",
                items: [
                  "Cycle ends 1662 blocks before the superblock",
                  "Options are yes, no, or abstain, and abstain behaves like no",
                  "Weight follows collateral in the same proportion",
                  "Outcome is a monthly payment stream",
                  "Failure mode is capture of the network's development capacity"
                ]
              }
            },
            {
              kind: "callout",
              title: "The lock option is a security feature and it is underused",
              body: "The ability to vote to lock a contested name so that nobody receives it is the network's answer to a first-come-first-served land grab against real brands. It is a collective refusal rather than an award. Study it: most naming systems only have mechanisms to give a name to someone, and therefore have no way to express the correct outcome of let no one have this. If you ever design a namespace, build the lock."
            },
            {
              kind: "principle",
              title: "Governance is authentication, so secure it as authentication",
              body: "A vote is an authenticated assertion of preference. That means custody, delegation, anomaly detection and revocation apply to voting keys exactly as they apply to admin credentials, and any governance design that does not account for credential compromise is not a governance design, it is a hope.",
            }
          ],
          awards: ["award-vote-custodian"],
          glossary: ["voting-key-delegation", "contested-resource", "vote-locking", "governance-anomaly"]
        },
        {
          id: "ch-dashevo-p4-council-proposal",
          kind: "council",
          title: "Asking a Network for Money",
          statement: "In a decentralized treasury there is no budget owner to convince, so a security proposal must be written to survive being read by a thousand strangers with incompatible incentives.",
          minutes: 32,
          respect: 185,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Who you are actually writing for",
              body: "Your reader is not an executive who has to justify the spend upward. Your reader is an individual with capital at risk, a monthly payout they can compute, a limited tolerance for jargon, and a long memory for people who overpromised. They are reading on a phone, in a forum, alongside eleven other proposals. They will decide in under three minutes whether you are credible. The proposal you would write for a board is exactly wrong here: too much hedging, too much process language, too little specificity about what happens if you fail."
            },
            {
              kind: "numbered",
              title: "The structure that gets funded",
              items: [
                "The threat, named concretely and without theatre, in language a non-specialist operator can repeat to someone else",
                "Why it is the network's problem rather than an individual operator's problem, because voters reflexively push costs to whoever benefits",
                "What you will deliver, phrased as artifacts a stranger can inspect, not activities you will perform",
                "How anyone can verify you delivered it, specified before the money is voted rather than after",
                "The cost, broken down, in DASH and at a stated reference price, with the currency risk explicitly acknowledged",
                "Who you are and what you have shipped before, with links, because reputation is the only collateral you have",
                "What happens if you fail or disappear, including whether the work is escrowed, staged, or refundable, stated by you before anyone asks",
                "The single sentence a voter will use to explain their yes vote to someone else"
              ]
            },
            {
              kind: "table",
              title: "Audience segments and what kills you with each",
              headers: ["Segment", "What they need", "What kills the proposal"],
              rows: [
                ["Large operators and pools", "Predictable return on the treasury and no reputational hazard", "Any hint that the work invites regulatory attention without a plan for it"],
                ["Independent technical operators", "Verifiable deliverables and technical credibility", "Vagueness, buzzwords, or a claim they can check and disprove in one search"],
                ["Long-term holders and community voices", "Alignment with the network's stated values", "Anything that reads as extraction, or a team that disappeared from a previous proposal"],
                ["Skeptics and watchdogs", "A clear failure mode and an accountability path", "No answer to what if you do not deliver, which they will ask publicly"],
                ["Everyone", "Three minutes of clear reading", "Length without structure; a proposal nobody finishes is a proposal nobody funds"]
              ]
            },
            {
              kind: "compare",
              title: "Board memo versus network proposal",
              left: {
                title: "Board memo",
                items: [
                  "Written for one accountable decision maker",
                  "Hedged language is read as rigour",
                  "Confidential detail is permitted and expected",
                  "Failure is handled through performance management",
                  "Success is measured against an internal strategy"
                ]
              },
              right: {
                title: "Network proposal",
                items: [
                  "Written for hundreds of unaccountable voters",
                  "Hedged language is read as evasion",
                  "Everything is public forever, including your mistakes",
                  "Failure is handled by not being funded again, which is the only enforcement that exists",
                  "Success is measured against what you personally promised in writing"
                ]
              }
            },
            {
              kind: "checklist",
              title: "Pre-publication review",
              items: [
                "Someone outside security read it and could restate the threat in their own words",
                "Every deliverable is a noun a stranger can inspect, not a verb you will perform",
                "The verification method is specified and does not depend on trusting you",
                "The price is broken down and the exchange-rate assumption is stated explicitly",
                "The failure clause is written by you, in your own words, before anyone demands it",
                "There is nothing in it you would be embarrassed to have quoted back to you in two years",
                "It can be read in under three minutes, and the first two sentences carry the whole argument"
              ]
            },
            {
              kind: "quote",
              body: "Fund capability during calm. Nobody votes for a fire brigade while the building is burning.",
              source: "STEPSAFE :: field doctrine"
            },
            {
              kind: "principle",
              title: "Write the failure clause yourself",
              body: "In any public funding process, the person who states their own failure conditions before being asked is trusted more than the person who is forced to state them under questioning. Volunteering your downside is the cheapest credibility available and almost nobody spends it."
            }
          ],
          awards: ["award-public-funder", "award-plain-language"],
          glossary: ["proposal-escrow", "reputational-collateral", "failure-clause", "electorate"]
        },
        {
          id: "ch-dashevo-p4-disclosure",
          kind: "drill",
          title: "Disclosing to a Network With No CISO",
          statement: "Coordinated disclosure assumes a coordinator; when the system has none, your first job is to manufacture one before you publish anything.",
          minutes: 35,
          respect: 205,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The structural problem",
              body: "Classic coordinated vulnerability disclosure has a shape: a researcher, a vendor with a security team, an agreed embargo, a patch, a release, an advisory. Decentralized infrastructure breaks every element of that shape. There is often a core development organization, but it cannot compel anyone to upgrade. The people who must act are hundreds of independent operators. The users whose funds are at risk have no relationship with anyone. And the disclosure itself is the exploit primer, because the fix requires operator action that takes days while the exploit takes minutes."
            },
            {
              kind: "list",
              title: "Who exists to be coordinated with, and what each can actually do",
              items: [
                "The core development organization: can produce a fix, publish an advisory, and carry authority with operators, but cannot force upgrades",
                "Large operators and hosting services: can move a large fraction of node capacity quickly, and are therefore the real lever",
                "The improvement-proposal process: the legitimate channel for protocol change, but far too slow for an active vulnerability",
                "Exchanges and custodial services: can pause deposits and withdrawals, which is the strongest containment available for a value-theft bug",
                "Wallet and application vendors: can ship a client-side mitigation faster than the protocol can be fixed",
                "The security community and FIRST-style norms: provide the process vocabulary, embargo conventions and credibility you will need"
              ]
            },
            {
              kind: "table",
              title: "Disclosure paths and their honest risk profiles",
              headers: ["Path", "Speed of fix", "Risk of exploitation during the window", "When it is right"],
              rows: [
                ["Full public disclosure immediately", "Fastest possible pressure", "Maximum; you have armed everyone", "Only when the vulnerability is already being exploited publicly"],
                ["Private report, standard clock, no coordination", "Depends entirely on one team", "Moderate and unmanaged", "Low-severity issues with no live funds at risk"],
                ["Private report plus coordinated operator mitigation under embargo", "Slower to fix, much faster to mitigate", "Lowest, because containment precedes the fix", "Anything with live funds and a distributed action requirement"],
                ["Silent self-protection only", "None for anyone else", "Externalized onto other people's users", "Never, and it is usually also a professional ethics failure"]
              ]
            },
            {
              kind: "prose",
              title: "The thing that makes this different from enterprise",
              body: "In an enterprise you disclose to someone who can deploy the fix. Here you disclose to someone who can write the fix, and then a completely separate population has to choose to deploy it. That is why the correct structure has two clocks: a fix clock with the maintainers, and a mitigation clock with the operators and the exchanges. Most people who fail at this fail because they only ran the first clock, then were surprised that a released patch did not equal a protected network."
            }
          ],
          drill: {
            id: "ch-dashevo-p4-disclosure-drill",
            scene: "While reviewing a widely used wallet's data contract you find a flaw in how it validates a document index, which lets an attacker cause the wallet to display a counterparty identity that is not the one that actually signed. It is not a protocol bug; it is a contract and client design bug, and it affects a wallet with a large user base and real balances. Exploiting it requires modest skill and no privileged access. The wallet team has a published security contact. There is no network-wide security team.",
            clock: "You believe you are the first to find it, but you cannot know that",
            pressure: "You have a conference talk in six weeks and this would be an excellent talk. A friend at an exchange has already asked what you are working on. Your own users are exposed too.",
            prompt: "What is your disclosure plan?",
            options: [
              {
                id: "ch-dashevo-opt-full",
                label: "Publish a full technical writeup with a proof of concept to force a fast fix",
                detail: "Public pressure is the only leverage that reliably works on volunteer maintainers.",
                score: -3,
                outcome: "You have converted a vulnerability that required discovery into a vulnerability that requires copy and paste. The wallet cannot ship, distribute and have users install a fix in less than days. Losses during that window are attributable to your publication decision.",
                ripple: "Whatever the merits of your finding, the story becomes your judgment rather than the bug. You also make every future maintainer in the ecosystem less willing to engage with researchers, which raises the cost of disclosure for everyone who comes after you.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-standard",
                label: "Report privately to the wallet team with a standard ninety-day disclosure clock and let them handle it",
                detail: "The industry-normal process, applied faithfully and without drama.",
                score: 0,
                outcome: "Correct as far as it goes and genuinely defensible. But a ninety-day clock with no interim mitigation leaves real balances exposed for the entire period, and a patched release does not protect users who do not update. You have run the fix clock and skipped the mitigation clock.",
                ripple: "If a loss occurs in week six, the review will note that a known-exploitable flaw sat behind a process designed for software that auto-updates, applied to a context where deployment depends on individual user action. The process was followed and the outcome was still bad.",
                isBest: false
              },
              {
                id: "ch-dashevo-opt-coordinated",
                label: "Report privately, then build the coordination structure: a named coordinator, an embargo with a hard date, a staged client-side mitigation, and a pre-drafted advisory, escalating publicly only if the clock lapses",
                detail: "Two clocks: fix with the maintainers, mitigation with operators, exchanges and other wallet vendors under embargo.",
                score: 3,
                outcome: "Containment lands before the fix does. Exchanges know what to watch for, other wallet vendors check whether they share the pattern, and the advisory ships with a fix already available. The embargo has a hard date so the maintainers cannot let it drift indefinitely.",
                ripple: "You have created the coordination capability the ecosystem lacked, and it outlasts this bug. The next researcher has a path to follow, and the named coordinator role becomes a durable piece of ecosystem infrastructure rather than a favour you did once.",
                isBest: true
              },
              {
                id: "ch-dashevo-opt-silent",
                label: "Quietly harden your own product against the flaw and say nothing",
                detail: "You have no duty to a competitor's users, and disclosure carries personal risk.",
                score: -2,
                outcome: "Your users are safe and everyone else's are not. The flaw remains live, and when it is eventually exploited, your prior mitigation is discoverable in your commit history with a date on it.",
                ripple: "The reputational and, in some jurisdictions, legal consequences of demonstrably knowing and staying silent are far worse than the discomfort of reporting. This option feels like risk avoidance and is actually risk accumulation with a delay.",
                isBest: false
              }
            ],
            debrief: "The standard ninety-day report is the plausible-but-wrong answer, and that is precisely why it is here: it is the option a well-trained professional picks, it follows accepted practice, and it is defensible in a sentence. It fails because accepted practice was built for software that ships through a vendor pipeline to machines that update themselves. In a decentralized context, the population that must act is not the population you reported to, and a patch is not a deployment. The discipline is to separate the two clocks explicitly. Notice also what the winning option requires of you personally: you have to do organizational work that is not yours, recruiting a coordinator and assembling an embargo list, because nobody else will. That is the actual job in decentralized security, and it is why this Act is called TRUST. The hard embargo date matters too; open-ended embargoes drift, and drift is how researchers get burned and stop reporting.",
            principle: "In systems where the fixer and the deployer are different populations, run two clocks: one for the patch, one for the mitigation, and never let the first substitute for the second."
          },
          awards: ["award-coordinator", "award-two-clocks"],
          glossary: ["coordinated-disclosure", "embargo", "mitigation-clock", "advisory"]
        },
        {
          id: "ch-dashevo-p4-field-governance",
          kind: "field",
          title: "Governance Risk Memo for a Decentralized Dependency",
          statement: "If your organization's uptime depends on votes cast by people you have never met, that is a supply-chain risk with a name, and it belongs in the register with a number next to it.",
          minutes: 40,
          respect: 210,
          trust: 13,
          mode: "motus",
          praxis: "Choose a real decentralized dependency your organization uses or plausibly could use. It may be Dash Platform, or any protocol with an on-chain governance or upgrade process. Write a governance risk memo of no more than four pages for an audience of a real risk committee. It must contain: the specific decisions the governance process can make that would affect you, ranked by impact; the entity concentration analysis with your counting methodology stated and its weaknesses admitted; the upgrade and emergency-change path, including how fast the network can respond to a critical bug and what evidence you have for that number; your organization's ability to influence, participate in, or exit; two named scenarios with a plausible sequence of events and your response for each; and a monitoring plan naming who recomputes what, how often. Then present it to at least one person with genuine budget or risk authority and record the questions they asked that you could not answer.",
          evidence: "On your Praxis Profile attach: the memo with a version and a date; your entity concentration working, including raw source data and the counting rules you applied; a written record of the presentation including the unanswered questions and your subsequent answers; and a dated monitoring plan with a named owner for each recurring measurement. A memo with no unanswered questions recorded is a memo that was presented to a friendly audience and does not count.",
          blocks: [
            {
              kind: "numbered",
              title: "The memo skeleton",
              items: [
                "Dependency statement: what you rely on it for, and what stops working if it stops",
                "Decision surface: what the governance process can change, and which of those changes would affect you materially",
                "Entity concentration: the count, the methodology, the known blind spots, and the trend over time",
                "Change velocity: how fast a critical fix can realistically reach the operator population, with evidence rather than assertion",
                "Your position: can you influence, must you merely observe, and what would it cost to participate meaningfully",
                "Scenarios: two concrete sequences of events with your response, timing and decision owner for each",
                "Exit: what leaving costs, how long it takes, and whether it has ever been tested",
                "Monitoring: the specific numbers, the owner, the cadence, and the threshold that triggers escalation"
              ]
            },
            {
              kind: "table",
              title: "Risk statements that pass review versus statements that do not",
              headers: ["Weak statement", "Strong statement"],
              rows: [
                ["The network is decentralized and community governed", "Treasury allocation requires net yes votes exceeding one tenth of the masternode count; the top five operators by node count currently control enough weight to materially influence that outcome"],
                ["Upgrades are handled by the community", "A critical fix requires a release plus voluntary operator adoption; our estimate of time to majority adoption is drawn from the last three releases and is stated with its uncertainty"],
                ["We monitor the ecosystem", "Named owner recomputes operator entity concentration monthly from the deterministic node list and reports it in the third-party risk pack"],
                ["We could switch providers if needed", "Exit requires re-implementing settlement against an alternative and has been tested in a game day; last exercised on a stated date and took a measured number of days"],
                ["There is a small risk of governance capture", "Governance capture would allow a coordinated group to block a fix we depend on; our compensating control is a client-side mitigation path that does not require network consent"]
              ]
            },
            {
              kind: "checklist",
              title: "Before you present it",
              items: [
                "Every number in the memo has a source and a date next to it",
                "Your counting methodology for entity concentration is written down and its weaknesses are admitted in your own words",
                "At least one statement in the memo would be uncomfortable for the team that chose this dependency",
                "There is a specific threshold that would change your recommendation, and it was chosen from analysis rather than instinct",
                "Someone who does not work in security read it and could restate the top risk correctly",
                "You have a one-sentence answer to what would you do if this happened tomorrow for each scenario"
              ]
            },
            {
              kind: "callout",
              title: "Write down what you could not answer",
              body: "The measure of this exercise is not the memo, it is the list of questions you could not answer when a real decision maker read it. That list is your actual research agenda, and it will be more valuable than anything you wrote. Every experienced security leader keeps one; most of them started it after being embarrassed in exactly this kind of meeting."
            },
            {
              kind: "principle",
              title: "A dependency without a number is a dependency you have accepted by default",
              body: "Third-party risk becomes real at the moment someone writes a threshold that would change the decision. Until then, everything in the register is description, and description does not survive contact with an incident."
            }
          ],
          awards: ["award-risk-memo", "award-unanswered-questions"],
          glossary: ["third-party-risk", "change-velocity", "governance-capture", "exit-cost"]
        }
      ]
    },
    {
      id: "ch-dashevo-p5-doctrine",
      title: "The Doctrine",
      credential: "STEPSAFE Gold Doctrine — Certified Synthesis Operator",
      summary: "The capstone. Six Acts collapse into one doctrine, one decision procedure you can run against a centralized company, a DAO treasury, a permanent-storage substrate, an AI system and a trust graph without switching mental models, a set of invariants that execute on a schedule, a personal operating cadence, and the two rooms where you must say the same true thing in different words.",
      competencies: [
        "State a security doctrine short enough to recall under pressure and specific enough to act on",
        "Run one decision procedure across five structurally different systems and produce comparable answers",
        "Convert doctrine into executable invariants with checks, thresholds, owners and break actions",
        "Maintain a personal operating cadence that keeps judgment calibrated rather than merely busy",
        "Brief a board and a public community on the same facts without either version being false",
        "Author and publish a complete organizational security doctrine spanning all six Acts and defend it under review"
      ],
      seal: "GOLD SEAL V — UNITIUM",
      steps: [
        {
          id: "ch-dashevo-p5-doctrine-core",
          kind: "construct",
          title: "The Doctrine: Six Acts, One Sentence Each",
          statement: "A doctrine is what you do when you have no time to think, so it must be short enough to remember and specific enough to act on.",
          minutes: 30,
          respect: 185,
          trust: 10,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Why doctrine and not policy",
              body: "Policy tells people what is permitted. Doctrine tells people what to do when the situation was not anticipated, which is the only situation that actually tests you. Military and aviation organizations learned this the hard way: under load, humans do not consult documents, they execute patterns. Your job over the rest of your career is to install patterns in yourself and in your organization that produce good outcomes when the specifics are novel. NIST CSF 2.0 added the GOVERN function in February 2024 for exactly this reason: the framework needed a place for the organizational decisions that determine whether all the other functions are real. Doctrine is your GOVERN, written for a person rather than a program."
            },
            {
              kind: "numbered",
              title: "The six lines",
              items: [
                "PERCEPTION: trust is a graph with directions and weights; before you defend anything, draw who trusts whom to do what, because attacks travel along edges you did not draw",
                "ADVERSARY: assume the adversary is competent, funded, patient, and reads your documentation; design against capability, not against the attacks you have personally seen",
                "MACHINE: any system whose outputs you cannot deterministically reproduce must be treated as an untrusted input to everything downstream, no matter how useful it is",
                "COMMAND: security that cannot be explained to the person holding the budget does not exist; your ability to convert risk into a decision someone makes is the function, not a support activity",
                "SUBSTRATE: on permanent and decentralized substrates, assume nothing can be deleted, nobody can be compelled, and every key is bearer authority; design so that the irreversible parts are the smallest parts",
                "TRUST: when there is no one to escalate to, you are the escalation; write down what you will do before you are the person who has to do it"
              ]
            },
            {
              kind: "table",
              title: "Each Act, the question it answers, the invariant it enforces",
              headers: ["Act", "Question it answers", "Invariant it enforces", "Failure it prevents"],
              rows: [
                ["Perception", "Who trusts whom to do what", "Every trust edge is named, directional and reviewed", "Lateral movement through a relationship nobody documented"],
                ["Adversary", "What can a competent attacker do, not what have we seen", "Controls are justified by capability, not by incident history", "Building the defence for last year's report"],
                ["Machine", "Can I reproduce this output and bound its behaviour", "Non-deterministic outputs never carry authority without a deterministic check", "An AI system granted permissions its reliability does not justify"],
                ["Command", "Who decides, with what information, at what cost", "Every risk has a named owner and a stated threshold", "A known risk that nobody was accountable for accepting"],
                ["Substrate", "What here is permanent, and what is bearer authority", "Irreversible surface is minimized and explicitly enumerated", "A permanent liability created by a reversible-feeling decision"],
                ["Trust", "What do I do when nobody is coming", "The escalation of last resort is written before it is needed", "Improvising an irreversible decision at three in the morning"]
              ]
            },
            {
              kind: "callout",
              title: "Test your doctrine by trying to break it",
              body: "A doctrine line that cannot be violated is not a doctrine line, it is a platitude. For each of your six, write the specific decision that would violate it and check whether you have ever made that decision. If you cannot construct a violation, rewrite the line until you can. Security is safe is not doctrine. The internet-facing component holds the least valuable key is doctrine, because you can point at a system that breaks it."
            },
            {
              kind: "principle",
              title: "Doctrine is recall under load",
              body: "The value of a principle is measured entirely by whether it arrives in your mind at the moment of decision. A brilliant framework you cannot recall at 3am is worth less than a crude rule you can. Optimize for retrieval, then refine."
            }
          ],
          awards: ["award-doctrine-drafted"],
          glossary: ["doctrine", "govern-function", "trust-graph", "bearer-authority", "irreversible-surface"]
        },
        {
          id: "ch-dashevo-p5-decision",
          kind: "lesson",
          title: "The Decision Procedure",
          statement: "Judgment does not scale; a written procedure that reliably reproduces your judgment does.",
          minutes: 34,
          respect: 195,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "One procedure, five very different systems",
              body: "The reason security people struggle when they move between a corporate environment, a DAO, an AI platform and a chain is that they carry domain knowledge instead of a procedure. Domain knowledge does not transfer. A procedure does. What follows is the one used throughout this curriculum, stated explicitly for the first time, and it works because it never asks a domain-specific question. It asks about assets, authority, irreversibility and cost, which exist in every system that has ever been built."
            },
            {
              kind: "numbered",
              title: "The nine steps",
              items: [
                "Name the asset in one sentence, in terms a non-specialist recognizes as valuable",
                "Name the authority that can move, alter or destroy it: the specific capability, not the person",
                "Name who holds that authority today, including every delegate, service and process that inherits it",
                "Identify the single action that converts a compromise into an irreversible outcome",
                "Find the smallest control that breaks that conversion, and prefer controls that make the irreversible step require a second party or a delay",
                "Cost the control when it fires falsely, because a control whose false-positive cost exceeds its true-positive benefit will be disabled by someone within a year",
                "Set the reversibility budget: how much irreversibility you are willing to have in this system at all, and where you will spend it",
                "Write the invariant as a sentence that could be checked by someone who does not trust you",
                "Assign the check, the cadence and the owner, and define what happens the first time it fails"
              ]
            },
            {
              kind: "table",
              title: "The same procedure across five systems",
              headers: ["System", "Asset", "Authority that moves it", "Irreversible step", "Smallest control that breaks the conversion"],
              rows: [
                ["Centralized company", "Customer data and production systems", "Administrative credentials and CI/CD deploy rights", "Bulk export or a deploy that exfiltrates", "Egress control plus a second party required on the export path"],
                ["DAO treasury", "Pooled funds and the upgrade key", "Voting weight and multisig signer set", "A passed proposal executing a transfer or upgrade", "Timelock between passage and execution, long enough for a veto to organize"],
                ["Permanent-storage substrate", "Everything ever written, forever", "Whoever can construct a valid write", "The write itself, because it cannot be unwritten", "Pre-write review gate plus a commitment pattern that keeps meaning off-chain"],
                ["AI system", "The actions the model is permitted to take", "Tool permissions, prompt inputs and the retrieval corpus", "A model-initiated action with real-world effect", "Deterministic policy check between model output and effect, plus permission scoping per action"],
                ["Trust graph", "Reputation and attestation weight", "Whoever can issue or revoke attestations", "A false attestation propagating into others' decisions", "Attestation provenance and revocation that consumers actually check"]
              ]
            },
            {
              kind: "compare",
              title: "Risk register thinking versus authority graph thinking",
              left: {
                title: "Risk register",
                items: [
                  "Enumerates bad outcomes and scores them",
                  "Produces heat maps that are stable across years of change",
                  "Encourages debate about likelihood, which nobody can settle",
                  "Reorganizes when the business reorganizes",
                  "Tends to miss risks that cross two teams"
                ]
              },
              right: {
                title: "Authority graph",
                items: [
                  "Enumerates who can cause what, then asks what would stop them",
                  "Changes whenever a permission changes, which is the right sensitivity",
                  "Encourages debate about capability, which is checkable",
                  "Reorganizes when access reorganizes, which is what actually matters",
                  "Naturally surfaces cross-team paths because it follows the permission, not the org chart"
                ]
              }
            },
            {
              kind: "callout",
              title: "The second-order effect that catches everybody",
              body: "Step six exists because of the most reliable pattern in operational security: controls with high false-positive cost are removed, quietly, by people acting reasonably under delivery pressure. The removal is rarely a decision anyone records. If you cannot state what your control costs when it fires wrongly, you have not finished designing it, and you will one day discover it was disabled eight months ago by someone who had a deadline and a good reason."
            },
            {
              kind: "principle",
              title: "Design against the conversion, not against the compromise",
              body: "You will not prevent every compromise. You can almost always break the step where compromise becomes irreversible loss, and that step is usually singular, cheap to instrument, and ignored because everyone is busy trying to prevent the compromise instead."
            }
          ],
          awards: ["award-procedure-holder"],
          glossary: ["authority-graph", "reversibility-budget", "false-positive-cost", "timelock", "conversion-step"]
        },
        {
          id: "ch-dashevo-p5-invariants",
          kind: "lab",
          title: "Invariants You Can Actually Run",
          statement: "An invariant that is not executed on a schedule is a sentence in a document, and documents do not fail loudly.",
          minutes: 40,
          respect: 200,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The five parts of a real invariant",
              body: "A statement about the system that must always be true. A check that can determine whether it is true without trusting the system it is checking. A cadence at which the check runs. An owner who is paged when it fails. And a break action that is decided in advance. Miss any one of the five and you have a wish. Most security programs are enormous collections of wishes with a small number of invariants hidden inside them, and the difference between a mature program and an immature one is almost entirely the ratio."
            },
            {
              kind: "list",
              title: "Ten invariants for this operator, phrased so they can fail",
              items: [
                "No key with authority over collateral or identity mastery exists on a host with a public IP",
                "Every signing key in production has a documented rotation path that has been exercised within the last 180 days",
                "No production identity has more than one master key, and its revision counter has not changed without a corresponding change record",
                "Every read used to authorize value movement carries a verified proof and a block height within the declared freshness window",
                "No data contract change ships without a review against the immutability rules by someone outside the implementing team",
                "Quorum and operator entity concentration for every decentralized dependency is recomputed at least monthly",
                "Every listening port on every node is either publicly required or externally verified unreachable, monthly, by a second party",
                "Every alerting path terminates at a human who has acknowledged an alert on that path in the last 90 days",
                "Every backup has been restored to a working system within the last 30 days",
                "Every accepted risk has a named accepter, a stated threshold, and a review date that has not passed"
              ]
            },
            {
              kind: "code",
              lang: "yaml",
              title: "Invariants as data, not prose",
              body: "invariants:\n  - id: no-master-key-on-edge\n    statement: No master or collateral key exists on a host with a public IP\n    check: inventory.keys.filter(k => k.level <= 1 and k.host.public_ip)\n    expect: empty\n    cadence: daily\n    owner: platform-security\n    break_action: page-and-rotate\n\n  - id: rotation-exercised\n    statement: Every production signing key rotated or rehearsed within 180 days\n    check: inventory.keys.max(days_since_rotation_exercise)\n    expect: less_than 180\n    cadence: weekly\n    owner: platform-security\n    break_action: ticket-with-30-day-clock\n\n  - id: identity-revision-stable\n    statement: Identity revision changes only alongside a change record\n    check: chain.identity.revision != baseline.revision and no change_record\n    expect: false\n    cadence: hourly\n    owner: on-call\n    break_action: page-immediately\n\n  - id: proof-on-value-reads\n    statement: Value-authorizing reads carry a verified proof within the freshness window\n    check: telemetry.reads.where(authorizes_value).without_verified_proof\n    expect: empty\n    cadence: continuous\n    owner: application-team\n    break_action: fail-closed-and-alert\n\n  - id: dependency-concentration-fresh\n    statement: Entity concentration recomputed for every decentralized dependency\n    check: registry.dependencies.max(days_since_concentration_recompute)\n    expect: less_than 31\n    cadence: weekly\n    owner: third-party-risk\n    break_action: escalate-to-risk-owner\n"
            },
            {
              kind: "code",
              lang: "bash",
              title: "The harness: machine-readable results or it did not happen",
              body: "#!/usr/bin/env bash\nset -uo pipefail\n\nRESULTS=/var/lib/invariants/results.ndjson\nNOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)\nEXIT=0\n\nemit() {\n  printf '{\\n' >/dev/null\n  jq -nc --arg id $1 --arg status $2 --arg detail $3 --arg at $NOW \\\n    '{id: $id, status: $status, detail: $detail, at: $at}' >> $RESULTS\n}\n\nrun() {\n  local id=$1; shift\n  if output=$($@ 2>&1); then\n    emit $id pass $output\n  else\n    emit $id fail $output\n    EXIT=1\n  fi\n}\n\nrun no-master-key-on-edge   ./checks/keys-on-edge.sh\nrun rotation-exercised      ./checks/rotation-age.sh 180\nrun identity-revision-stable ./checks/identity-revision.sh\nrun proof-on-value-reads    ./checks/proof-coverage.sh\nrun dependency-concentration-fresh ./checks/concentration-age.sh 31\n\n# A silent harness is the failure mode that kills programs.\n# Emit a heartbeat so absence of results is itself an alert.\nemit harness-heartbeat pass ok\n\nexit $EXIT\n"
            },
            {
              kind: "table",
              title: "Cadence chosen from consequence, not from convenience",
              headers: ["Invariant class", "Cadence", "Why that cadence", "Break action"],
              rows: [
                ["Key placement and custody", "Daily", "A misplaced key is exploitable the moment it exists", "Page and rotate"],
                ["Identity revision integrity", "Hourly", "An unauthorized key addition is a live takeover in progress", "Page immediately"],
                ["Proof coverage on value reads", "Continuous, in-line", "The check is the control; running it later is auditing, not defending", "Fail closed"],
                ["Rotation rehearsal age", "Weekly", "Slow-moving; weekly catches drift without generating noise", "Ticket with a hard clock"],
                ["Dependency concentration", "Monthly, checked weekly for staleness", "The underlying number moves slowly but silently", "Escalate to the risk owner"],
                ["Backup restorability", "Monthly", "Restore is expensive to test and catastrophic to discover broken", "Treat as a P2 incident"]
              ]
            },
            {
              kind: "callout",
              title: "Alert on silence",
              body: "The most common failure of an invariant harness is not a false negative, it is that the harness stopped running and nobody noticed, because absence of failures looks identical to absence of the harness. Emit a heartbeat and alert on its absence. This single line of design separates monitoring that works from monitoring that has quietly been dead since a migration in March."
            },
            {
              kind: "principle",
              title: "Executable or decorative",
              body: "Every security statement in your organization is one of two things: a check that runs on a schedule with an owner, or decoration. There is no third category, and being sincerely believed does not move a statement from the second category to the first."
            }
          ],
          awards: ["award-invariant-engineer", "award-heartbeat-discipline"],
          glossary: ["invariant", "break-action", "heartbeat-alert", "fail-closed", "check-cadence"]
        },
        {
          id: "ch-dashevo-p5-council-board",
          kind: "council",
          title: "Two Rooms, One Truth",
          statement: "You will have to say the same true thing to a board that fears liability and a community that fears capture, and if the two versions differ in substance you have already lost both.",
          minutes: 32,
          respect: 195,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The temptation, named honestly",
              body: "The board wants to know whether the company is exposed and whether anyone will be blamed. The community wants to know whether the network is being centralized and whether you are honest. Those audiences reward opposite tones. The board rewards calm, bounded, quantified statements with a clear owner. The community rewards candour, technical specificity, and visible discomfort with your own weak points. The temptation is to write two documents. Do not. Write one set of facts and two framings, and make the load-bearing sentences literally identical in both, word for word, so that when someone puts the two versions side by side, as they eventually will, the overlap is the strongest thing in the room."
            },
            {
              kind: "compare",
              title: "What each room rewards and punishes",
              left: {
                title: "The board room",
                items: [
                  "Rewards: a number, a threshold, a named owner, a date",
                  "Rewards: risk stated in business consequence, not in mechanism",
                  "Punishes: surprise, especially a surprise they could have been told earlier",
                  "Punishes: technical detail that does not change a decision",
                  "Fears: liability, regulatory attention, and being the last to know"
                ]
              },
              right: {
                title: "The community forum",
                items: [
                  "Rewards: specificity, admitted uncertainty, and showing your working",
                  "Rewards: naming your own conflicts of interest before anyone else does",
                  "Punishes: corporate register, hedging, and unfalsifiable claims",
                  "Punishes: any gap between what you said here and what you said elsewhere",
                  "Fears: capture, quiet centralization, and being managed rather than informed"
                ]
              }
            },
            {
              kind: "table",
              title: "One fact, two framings, one identical sentence",
              headers: ["Fact", "Board framing", "Community framing", "The sentence that must be identical"],
              rows: [
                ["Validator concentration is higher than ideal", "A named third-party dependency with a monitored threshold and a tested fallback", "An honest count with the methodology published and its weaknesses admitted", "A small number of operators could currently halt or censor the subsystem we depend on, and here is the number"],
                ["We had an incident on a node", "Contained in minutes by a rehearsed rotation, no loss, controls updated", "Full timeline including what we got wrong and what we changed", "The exposed key lost its authority at a stated time, and no funds moved"],
                ["A fix requires operator adoption", "Change velocity is a risk we hold, with a client-side mitigation as compensating control", "Here is the adoption curve from the last three releases and what we are doing to shorten it", "A released patch is not a deployed patch, and the gap is measured in days"],
                ["We participate in governance", "Disclosed conflict, with a stated recusal policy", "Disclosed conflict, with our votes published", "We hold voting weight in a network we also assess, and here is how we handle that"]
              ]
            },
            {
              kind: "numbered",
              title: "The five-sentence briefing, in order",
              items: [
                "The one-sentence situation, stated without qualifiers, containing the worst true fact",
                "What is confirmed, what is suspected, and what is unknown, explicitly separated so nobody has to guess which is which",
                "What we have already done, with times, because action already taken buys you the right to ask for patience",
                "The decision we need from this room, or explicitly none, because unclear asks generate advice you do not want",
                "When you will hear from us next, and what will have happened by then"
              ]
            },
            {
              kind: "callout",
              title: "Numbers you never round in your own favour",
              body: "Use external anchors and quote them exactly. Mandiant's M-Trends reported a global median dwell time of eleven days for 2024 intrusions, with exploits accounting for thirty-three percent of initial infection vectors and stolen credentials sixteen percent. Verizon's current DBIR headline figures state that thirty-one percent of breaches begin with software vulnerabilities and forty-eight percent now involve ransomware. When you present your own detection time or patch latency next to those numbers and yours is worse, say so plainly. The credibility you gain by volunteering a bad comparison is worth more than any single control you could install."
            },
            {
              kind: "prose",
              title: "The recusal problem, which will be yours eventually",
              body: "If your organization runs evonodes, holds collateral, or votes in a treasury, and you are also the person assessing that network's decentralization, you have a conflict. Everyone can see it. The only defensible posture is to name it first, in both rooms, in the same words, and to describe the mechanism that constrains you: published votes, a recusal policy, an external reviewer for the concentration analysis. Conflicts do not destroy credibility. Undisclosed conflicts destroy credibility, and disclosed conflicts that come with no constraining mechanism do almost as much damage."
            },
            {
              kind: "principle",
              title: "Write the sentence that must survive both rooms",
              body: "Before any high-stakes communication, write the single sentence you would be comfortable seeing quoted in either venue, out of context, in two years. If no such sentence exists, you are not ready to speak in either room; you are still deciding what you believe."
            }
          ],
          awards: ["award-two-rooms", "award-conflict-disclosed"],
          glossary: ["recusal", "external-anchor", "briefing-structure", "disclosure-consistency"]
        },
        {
          id: "ch-dashevo-p5-final-field",
          kind: "field",
          title: "THE PRAXIS: Publish a Complete Security Doctrine",
          statement: "You are not certified by finishing the last Step; you are certified by an organization that can be operated from the document you wrote.",
          minutes: 40,
          respect: 220,
          trust: 14,
          mode: "motus",
          praxis: "Choose a real organization. It may be your employer, a company you advise, an open-source project, a DAO, a protocol, a startup you are founding, or a community you belong to. It must be real, it must have something worth protecting, and at least one person with authority in it must agree to read what you produce. Write and publish a complete security doctrine for it spanning all six Acts. The doctrine must contain, at minimum: a trust graph of the organization showing every principal and every directional trust edge including third parties and automated systems; an adversary model naming three specific adversary classes with their capabilities and their most likely path; a statement of how non-deterministic and AI-driven components are bounded and what authority they are permitted to carry; a command section naming who decides what, at what threshold, with what information; a substrate section enumerating every irreversible surface in the organization and justifying each one; and a trust section containing the escalation of last resort, written for the case where nobody is available. Attach an executable invariant set of at least ten invariants in the five-part form, a decision procedure worked against three real decisions the organization actually faces, and a personal operating cadence with daily, weekly, monthly and quarterly commitments you intend to keep. Then present it, take the review, and publish version two with the review incorporated and the disagreements you did not accept recorded with your reasoning.",
          evidence: "On your Praxis Profile attach: the published doctrine, versioned and dated, with the organization named or credibly described if it must be anonymized; the trust graph as a diagram; the invariant set in machine-readable form together with evidence that at least three invariants have actually executed and produced results; the worked decision procedure for three real decisions with the outcomes; the reviewer's written response in full and unedited; your version two with a changelog; and your personal operating cadence with at least four weeks of completed entries. Attach also the one thing most people omit: a written list of what you chose not to defend and why. A doctrine that defends everything is a doctrine that has not been costed, and it will be marked as incomplete.",
          blocks: [
            {
              kind: "numbered",
              title: "The six required sections, one per Act",
              items: [
                "PERCEPTION: the trust graph, with every principal, every directional edge, every third party and every automated system, and the three edges you consider most dangerous",
                "ADVERSARY: three named adversary classes with capability, motivation, likely entry path and the control that specifically frustrates each",
                "MACHINE: what non-deterministic components exist, what authority each is permitted, what deterministic check sits between their output and any real-world effect",
                "COMMAND: the decision rights table, the thresholds, the escalation ladder, and the named accepter for every accepted risk",
                "SUBSTRATE: every irreversible surface enumerated, with a justification for each and a plan to shrink the ones that do not need to be there",
                "TRUST: the escalation of last resort, the two-room communication position, and the standing disclosures of conflict"
              ]
            },
            {
              kind: "table",
              title: "How a reviewer falsifies each section",
              headers: ["Section", "Minimum contents", "How a hostile reviewer breaks it"],
              rows: [
                ["Perception", "Complete graph including automated principals", "Names a real access path that your graph does not contain"],
                ["Adversary", "Three classes with capability and path", "Describes a plausible attacker your model does not cover at all"],
                ["Machine", "Authority bounds and deterministic checks", "Finds one place where a model output causes an effect with no check between them"],
                ["Command", "Decision rights and named accepters", "Names a live risk with no accepter, or an accepter who does not know they are one"],
                ["Substrate", "Enumerated irreversible surfaces", "Finds an irreversible action that is not on your list"],
                ["Trust", "Escalation of last resort", "Asks what happens at 3am on a public holiday and gets an improvised answer"]
              ]
            },
            {
              kind: "checklist",
              title: "The publication standard",
              items: [
                "Every claim in the doctrine is either checkable by an outsider or explicitly labelled as a judgment",
                "Every number carries a source and a date",
                "Every invariant has all five parts: statement, check, cadence, owner, break action",
                "At least three invariants have executed and produced recorded results before you publish",
                "The decision procedure is worked against real decisions with real names, not hypotheticals",
                "The list of what you chose not to defend exists and is honest",
                "One person with real authority has read it and their response is published unedited",
                "There is a review date and a named owner for the next version"
              ]
            },
            {
              kind: "compare",
              title: "What separates a strong doctrine from a weak one",
              left: {
                title: "Weak",
                items: [
                  "Comprehensive coverage of every control family",
                  "No statement that anyone in the organization would dispute",
                  "Risks described, none accepted by name",
                  "Invariants that cannot fail",
                  "Reads like a framework mapping exercise",
                  "Would be identical if written for a different organization"
                ]
              },
              right: {
                title: "Strong",
                items: [
                  "Narrow coverage with explicit, costed omissions",
                  "At least one statement that made someone uncomfortable in review",
                  "Accepted risks with named accepters and review dates",
                  "Invariants that have already failed once and taught you something",
                  "Reads like it was written by someone who has operated this specific system",
                  "Could not have been written about anyone else"
                ]
              }
            },
            {
              kind: "callout",
              title: "Why it must be a real organization",
              body: "A doctrine written for a fictional company is a writing exercise, and writing exercises do not teach the thing this chapter exists to teach. What you are practising is the moment where a real person with real authority disagrees with you, and you have to decide which of your positions you will defend and which you will change. That moment is the entire profession compressed into a single conversation, and you cannot simulate it. Find the person. Have the conversation. Publish what happened."
            },
            {
              kind: "prose",
              title: "What happens after you publish",
              body: "You will be wrong about something in it within six months, probably something you were confident about. That is the point. A doctrine is a dated artifact that makes your reasoning legible to your future self, so that when reality corrects you, you can see exactly which assumption failed instead of vaguely updating your instincts. Keep every version. In five years the diff between version one and version twelve will be the most accurate record of your own development that exists, and it will be more useful to the person you are training than any curriculum, including this one."
            },
            {
              kind: "principle",
              title: "The final standard",
              body: "You have finished when someone else can operate the organization safely from what you wrote, in your absence, at three in the morning, without calling you. Everything short of that is study. That is practice."
            }
          ],
          awards: ["award-doctrine-published", "award-evo-operator", "award-gold-seal", "award-unitium-unlocked"],
          glossary: ["security-doctrine", "escalation-of-last-resort", "decision-rights", "operating-cadence", "costed-omission"]
        }
      ]
    }
  ]
};
