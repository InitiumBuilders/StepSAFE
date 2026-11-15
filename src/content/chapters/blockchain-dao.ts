import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-chain",
  act: "ACT IV — CHAIN",
  order: 7,
  title: "The Chain Does Not Forgive",
  subtitle: "Blockchain, exchange, treasury and DAO security — where every mistake is public, permanent, and settled in full",
  essence: "violet",
  thesis: "On-chain, the adversary reads the same source you do, the ledger cannot be rolled back, and the largest thefts in history were not broken cryptography — they were signers approving what a compromised screen showed them. Security here is custody, verification, and governance, not an audit PDF.",
  statement: "The money is the code, the code is public, and there is no undo — so verification is the whole job.",
  why: "Web2 security buys you time: you rotate a credential, restore a backup, roll back a deploy. None of that exists here. A signed transaction is final at inclusion, a drained treasury is drained, and the attacker had your bytecode before you shipped it. The people who protect billions on-chain are not the ones who write the cleverest Solidity — they are the ones who treat key custody, transaction verification, and governance as the primary attack surface, because that is where the money actually leaves. This chapter builds that instinct with the real incidents that set the price of every lesson.",
  outcomes: [
    "Rank crypto loss causes by where money actually leaves, not by which bug is most interesting, and spend your first security dollar accordingly",
    "Find, exploit, and fix the smart-contract bug classes that matter — reentrancy and its read-only variant, oracle and flash-loan manipulation, access control, proxy storage collisions, and signature replay — with Foundry and Slither in hand",
    "Run an audit and a bug-bounty program that resist becoming a rubber stamp, and know when to reach for fuzzing versus formal verification",
    "Design key custody at institutional scale: Safe multisig and MPC tradeoffs, signer diversity, and independent transaction verification that would have stopped Bybit",
    "Govern a treasury and run on-chain incident response in a world with no rollback: timelocks, guardians, the pause dilemma, and the war-room communications that decide whether the protocol survives"
  ],
  prereq: ["ch-identity"],
  unitUnlock: "u-vault",
  sources: [
    { label: "Chainalysis 2026 Crypto Crime Report", note: "The authority on where stolen value actually comes from — use it to argue that private-key and access compromise, not exotic contract bugs, drive the largest losses." },
    { label: "NCC Group — In-Depth Technical Analysis of the Bybit Hack", note: "The best public reconstruction of the delegatecall-to-slot-0 signer-interface attack; read it before you ever teach blind signing." },
    { label: "Certora — The Bybit Hack and Multisig Wallet Security", note: "The defensive counterpart: why a formally verified Safe still lost 1.5B, and the operational controls that would have caught it." },
    { label: "NIST SP 800-61 Rev. 3 (2025)", note: "Incident response recast as a CSF 2.0 profile across Govern/Identify/Protect/Detect/Respond/Recover — the frame for on-chain IR where you cannot roll back." },
    { label: "OWASP Smart Contract Top 10 (2025)", note: "The canonical taxonomy: access control first, price-oracle manipulation second, reentrancy fifth, flash loans seventh — the ordering itself is the lesson." },
    { label: "Trail of Bits — Building Secure Contracts (secure-contracts.com)", note: "Practitioner guidance on Slither, Echidna, and Medusa, plus how to pick properties worth testing; the source for a real tooling pipeline." },
    { label: "Foundry Book — Invariant Testing", note: "The handler-and-ghost-variable pattern for stateful fuzzing; the difference between tests that reassure and tests that break your protocol." },
    { label: "Immunefi Vulnerability Severity Classification System v2.3", note: "Critical/High/Medium/Low with impact-first definitions and the Primacy of Impact idea; the shared language for triaging and pricing findings." },
    { label: "Beanstalk Governance Exploit post-mortem (bean.money) and Immunefi analysis", note: "The definitive flash-loan governance-capture case: instantaneous vote weight plus emergencyCommit equals a one-block takeover." },
    { label: "Immunefi — Hack Analysis: Nomad Bridge, August 2022", note: "How a trusted root initialized to zero turned a bridge into a public free-for-all; the archetype for upgrade-time misconfiguration." },
    { label: "Roninchain.com — Ronin Security Breach Postmortem", note: "Five-of-nine validators, four keys phished, a fifth signature cleared by a standing allowlist nobody revoked; the archetype for signer compromise plus stale trust." },
    { label: "Vitalik Buterin — Having a Safe CEX: Proof of Solvency and Beyond", note: "Why proof of reserves alone is theater without proof of liabilities, and how Merkle-sum trees and ZK proofs actually establish solvency." },
    { label: "ChainSecurity — Curve LP Oracle Manipulation / Read-Only Reentrancy post-mortem", note: "The mechanism behind read-only reentrancy: a view function with no guard reading state mid-callback, mispricing collateral for everyone downstream." },
    { label: "L2BEAT — Risk Framework", note: "State validation, data availability, sequencer and proposer failure, and the exit window; the honest map of how much trust each L2 still asks of you." },
    { label: "Dash Documentation — Decentralized Governance", note: "Masternode voting, superblocks every 16,616 blocks, and the net-yes threshold of ten percent of masternodes; a live treasury-governance model to reason about." }
  ],
  pages: [
    {
      id: "pg-chain-losses",
      title: "The Adversary's Ledger",
      credential: "STEPSAFE Certified — Crypto Threat Modeling and Loss Attribution",
      summary: "Before you write a line of Solidity or review a single audit, you learn where the money actually leaves. This Page rebuilds your threat model around the real distribution of loss: access-control and key compromise dwarf clever contract bugs, six distinct failure archetypes explain most of the historical damage, and MEV is an adversary class in its own right. You leave able to spend the first security dollar where it stops the largest loss, and to explain that tradeoff to a board in the language of probable loss, not fear.",
      competencies: [
        "Attribute losses to root cause using primary incident data rather than headline framing",
        "Distinguish the six failure archetypes — validator/key compromise, bridge verification bug, upgrade misconfiguration, governance capture, oracle manipulation, and signer-interface compromise",
        "Treat MEV, reorgs, and time-bandit attacks as a distinct extractive adversary",
        "Prioritize a security budget against the loss distribution, not against the most interesting bug",
        "Communicate quantified risk to executives using a FAIR-style loss model"
      ],
      seal: "The Broken Ledger",
      steps: [
        {
          id: "ch-chain-loss-distribution",
          kind: "construct",
          title: "The Loss Distribution Is Not the Audit Report",
          statement: "The bug classes that get the most audit attention are not the ones that lose the most money.",
          minutes: 16,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "New security engineers arrive obsessed with reentrancy and integer overflow because those are what the tutorials teach and what the CTFs reward. Then they look at the ledger of real losses and find that the biggest numbers are almost never elegant contract bugs. They are stolen keys, compromised signing interfaces, phished engineers, and misconfigured upgrades. The gap between what we study and what actually loses money is the single most expensive misconception in this field."
            },
            {
              kind: "principle",
              body: "Spend your attention in proportion to where value leaves, not in proportion to how clever the exploit is."
            },
            {
              kind: "table",
              title: "What the taxonomy ranks first vs. what the money says",
              headers: ["Category", "OWASP SC Top 10 (2025) rank", "Share of largest real losses"],
              rows: [
                ["Access control / privileged-key compromise", "SC01 — first", "The dominant driver of the biggest single losses"],
                ["Price-oracle manipulation", "SC02 — second", "Large, concentrated in DeFi money markets"],
                ["Reentrancy", "SC05 — fifth", "Real but a small fraction of total value lost"],
                ["Flash-loan-enabled attacks", "SC07 — seventh", "An amplifier of the above, rarely the root cause alone"]
              ]
            },
            {
              kind: "callout",
              title: "The number that reorders your priorities",
              body: "The Chainalysis 2026 Crypto Crime Report finds that private-key and access compromise account for the largest share of stolen value — with a single incident, the February 2025 Bybit theft of roughly 1.5 billion dollars, larger than most full years of contract exploits combined. Smart-contract bugs remain the most common attack by incident count, but they are not where the money is."
            },
            {
              kind: "quote",
              body: "The security guarantees of a multisig assume the signers can accurately evaluate what they are approving. When the interface showing them the transaction has been compromised, that assumption breaks.",
              source: "Paraphrasing the consensus reading of the Bybit incident"
            }
          ],
          glossary: ["access-control", "oracle-manipulation", "reentrancy", "flash-loan", "loss-attribution"],
          awards: ["ch-chain-ledger-reader"]
        },
        {
          id: "ch-chain-six-archetypes",
          kind: "lesson",
          title: "The Six Archetypes That Explain the Wreckage",
          statement: "Most catastrophic on-chain losses are one of six recurring shapes — learn the shapes and you can triage any new incident in minutes.",
          minutes: 30,
          respect: 110,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "You will not memorize every hack. You do not need to. Nearly every nine-figure loss collapses into one of six archetypes, each with a different root cause and therefore a different defense. When the next incident hits your feed, your first job is not to read the exploit transaction — it is to place it in an archetype, because that tells you where to look and what your own exposure is."
            },
            {
              kind: "timeline",
              title: "The canonical incidents, by archetype",
              items: [
                "2022-02 · Wormhole — bridge signature-verification bug. A deprecated unchecked instruction load let a forged system account bypass guardian signature checks; ~120,000 wETH (~320M USD) minted from nothing. The fix was already in the public repo, undeployed.",
                "2022-03 · Ronin — validator/key compromise. Four of Sky Mavis's keys phished via a fake job PDF; the fifth signature cleared by a standing Axie DAO allowlist nobody revoked. Five of nine validators, ~620M USD. Later attributed to Lazarus.",
                "2022-04 · Beanstalk — governance capture. A ~1B USD flash loan bought a two-thirds supermajority in one block; emergencyCommit executed the attacker's proposal behind a decoy Ukraine-donation proposal. ~182M USD.",
                "2022-06 · Harmony Horizon — key compromise on a thin multisig. A 2-of-5 bridge multisig; two keys, likely hot and stored in plaintext, were enough. ~100M USD; the FBI later attributed it to Lazarus.",
                "2022-08 · Nomad — upgrade misconfiguration. A routine upgrade set the trusted Merkle root to 0x00, which the proof check accepted for any message; hundreds of copycats drained it in a public free-for-all. ~190M USD.",
                "2025-02 · Bybit — signer-interface compromise. Malicious JavaScript in the Safe wallet front end swapped a routine transfer for a delegatecall that overwrote the proxy's implementation pointer; signers blind-signed. ~1.5B USD, the largest theft ever. Lazarus."
              ]
            },
            {
              kind: "compare",
              title: "Two families, two entirely different defenses",
              left: {
                title: "Code was correct, humans/keys failed",
                items: [
                  "Ronin, Harmony, Bybit",
                  "Defense: key custody, signer diversity, transaction verification, deprovisioning",
                  "No audit would have caught it",
                  "This family holds the largest single losses"
                ]
              },
              right: {
                title: "Code was wrong, logic failed",
                items: [
                  "Wormhole, Nomad, Beanstalk",
                  "Defense: verification, invariant testing, upgrade discipline, governance design",
                  "An audit or invariant might have caught it",
                  "More common by count, smaller in aggregate value"
                ]
              }
            },
            {
              kind: "callout",
              title: "The tell that separates the families",
              body: "Ask one question of any new incident: did the protocol behave exactly as written? If yes, you are in the custody/governance family and the audit was never going to help. If no, you are in the code family. Getting this wrong sends teams to buy another audit after a key-compromise loss, which is spending on the wrong archetype."
            }
          ],
          glossary: ["bridge-trust-model", "governance-capture", "signer-diversity", "loss-attribution"],
          awards: ["ch-chain-archetype-triage"]
        },
        {
          id: "ch-chain-triage-drill",
          kind: "drill",
          title: "First Dollar of Security",
          statement: "A finite security budget spent on the most interesting risk instead of the largest one is a subsidy to the attacker.",
          minutes: 22,
          respect: 170,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "You have just been hired as the first security engineer at a DeFi protocol about to hold serious value. You have one meaningful budget line to spend this quarter and a founder who wants to know where it goes. Everything below is defensible on paper. Only one of them is where the money actually leaves."
            }
          ],
          drill: {
            id: "ch-chain-triage-drill-d1",
            scene: "Series-A DeFi protocol, roughly 40M USD of user deposits expected at launch in six weeks. No dedicated security spend yet. The deployer key is a single hardware wallet in the CTO's desk drawer; upgrades are controlled by a 1-of-1 owner. You get one budget line this quarter.",
            clock: "You present your recommendation to the founders in 48 hours.",
            pressure: "The CTO already assumes the answer is a brand-name audit and has told investors so.",
            prompt: "Where do you spend the first security dollar?",
            options: [
              {
                id: "opt-audit",
                label: "Book the most prestigious audit firm you can afford",
                detail: "A top-tier firm, a public report, a marketing bump at launch.",
                score: -1,
                outcome: "You get a competent review of the contract logic and a report investors like. The 1-of-1 upgrade owner and the desk-drawer deployer key are noted as out of scope for a code audit and left exactly as they were.",
                ripple: "You have hardened the smaller half of your risk and advertised it. The archetype that actually produces nine-figure losses — a single compromised privileged key — is untouched. Ronin, Harmony, and Bybit all passed audits.",
                isBest: false
              },
              {
                id: "opt-keys",
                label: "Replace the single-owner control with a real signing architecture",
                detail: "Move upgrade and treasury control to a Safe multisig with diverse, geographically separated signers on distinct hardware, plus monitoring and a documented signing process.",
                score: 3,
                outcome: "The single point of catastrophic failure is gone. Draining the protocol now requires compromising several independent people and devices, and every privileged action is observable before it lands.",
                ripple: "You have spent on the archetype that holds the largest historical losses. The audit still needs to happen, but it now protects a system that cannot be undone by one phished laptop. This is the least glamorous and most defensible first move.",
                isBest: true
              },
              {
                id: "opt-bounty",
                label: "Launch a large public bug bounty on day one",
                detail: "Post a Critical bounty in the millions on a major platform to crowdsource security.",
                score: 0,
                outcome: "You attract attention, some low-severity noise, and eventually maybe a real finding. But a bounty only works on code that whitehats can read and reason about, and it does nothing for the private-key attack surface.",
                ripple: "Bounties are a genuine layer, but as a first and only move they externalize a job you have not yet done internally. You are asking strangers to find bugs while your own upgrade key sits in a drawer.",
                isBest: false
              },
              {
                id: "opt-tests",
                label: "Pour the budget into unit-test coverage to 100 percent",
                detail: "Fund a sprint to reach total line and branch coverage before launch.",
                score: -2,
                outcome: "You reach a coverage number that looks reassuring and proves only that each line runs at least once. Coverage says nothing about adversarial sequences, and nothing at all about who holds the keys.",
                ripple: "High coverage with weak properties is one of the most dangerous forms of false confidence, because it feels like rigor. You have bought a metric, not security, and left the dominant archetype wide open.",
                isBest: false
              }
            ],
            debrief: "The plausible-but-wrong answer is the audit, because it is what the CTO expects, what investors reward, and what the industry trained you to buy first. But the loss distribution is unambiguous: the largest single thefts in history were privileged-key and signer-interface compromises against code that behaved exactly as written. A 1-of-1 upgrade owner is the same shape of risk that cost Ronin 620M and Bybit 1.5B. The audit is necessary and comes next; it is simply not where the first dollar buys the most risk reduction. Spending it on custody first is the move that separates people who have read the ledger from people who have read the tutorials.",
            principle: "Buy down the largest loss before the most interesting bug; the attacker is indifferent to your elegance."
          },
          glossary: ["access-control", "safe-multisig", "signer-diversity", "bug-bounty"],
          awards: ["ch-chain-first-dollar"]
        },
        {
          id: "ch-chain-mev",
          kind: "lesson",
          title: "MEV Is an Adversary, Not a Fee",
          statement: "The order of transactions is itself a resource, and someone is extracting value from yours whether or not you modeled them.",
          minutes: 26,
          respect: 130,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Maximal extractable value is the profit a block producer or searcher can capture by choosing which transactions to include, exclude, and reorder, beyond the normal reward and fees. Most engineers meet MEV as a slippage line item. Treat it instead as a permanent, rational adversary that reads the public mempool and reorders the world to its advantage. It shapes protocol design, user harm, and even chain stability."
            },
            {
              kind: "list",
              title: "The extraction patterns you must design against",
              items: [
                "DEX arbitrage — the benign end: buy cheap on one venue, sell dear on another, atomically. Competitive and mostly harmless to users.",
                "Liquidations — a race to be the one who liquidates an underwater position for the fee; healthy in theory, a gas war in practice.",
                "Sandwiching — the harmful end: a searcher sees your large swap in the mempool, buys ahead of you to push the price, lets your trade execute at the worse price, and sells behind you. Your slippage is their profit.",
                "Time-bandit reorgs — when the MEV in a past block exceeds the honest reward, a rational producer is tempted to reorganize the chain to re-capture it, threatening finality itself."
              ]
            },
            {
              kind: "compare",
              title: "Public mempool vs. private order flow",
              left: {
                title: "Broadcasting to the public mempool",
                items: [
                  "Your intent is visible to every searcher before inclusion",
                  "Large swaps are sandwiched by default",
                  "Failed transactions still cost gas",
                  "Simple, permissionless, censorship-resistant"
                ]
              },
              right: {
                title: "Private RPC (e.g. Flashbots Protect)",
                items: [
                  "Transaction hidden from frontrunning and sandwich bots until included",
                  "Revert protection: excluded if it would fail, so no gas on reverts",
                  "Some MEV refunded back to the user",
                  "Trust and latency tradeoffs, and a new dependency to reason about"
                ]
              }
            },
            {
              kind: "callout",
              title: "Second-order effect most teams miss",
              body: "Proposer-builder separation and MEV-Boost were introduced to democratize extraction and reduce validator centralization pressure, but they also concentrate power in a small number of builders and relays. When you push users toward private order flow to protect them from sandwiching, you are trading one centralization for another. There is no MEV-free choice, only a choice of who captures it and who you now trust."
            },
            {
              kind: "principle",
              body: "If your protocol's safety depends on transaction ordering, assume a profit-maximizing adversary controls the ordering."
            }
          ],
          glossary: ["mev", "sandwich-attack", "reorg", "time-bandit-attack", "sequencer"],
          awards: ["ch-chain-mev-aware"]
        },
        {
          id: "ch-chain-threat-model-field",
          kind: "field",
          title: "Build the Loss-Cause Ledger for a Real Protocol",
          statement: "A threat model you cannot map to real historical losses is a fantasy; ground it in the ledger or discard it.",
          minutes: 40,
          respect: 200,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Pick a real, live protocol you do not work on — an open-source DeFi app, a bridge, or a DAO treasury. You are going to build the artifact a serious security lead actually keeps: a threat model organized by the six archetypes, with each branch tied to a named historical incident and an honest statement of this protocol's exposure to it. This is the document that decides where money and attention go, and it is the single most valuable thing you can put on your Praxis Profile from this Page."
            },
            {
              kind: "numbered",
              title: "The build",
              items: [
                "Enumerate the privileged roles and keys: who can upgrade, pause, mint, move treasury, or change parameters, and what protects each one (EOA, multisig threshold, timelock).",
                "Map each of the six archetypes onto this protocol: for each, name the analogous historical incident and state whether this protocol is exposed, partially mitigated, or hardened, with the evidence for your claim.",
                "For every privileged key, record the custody reality: hardware or hot, single or threshold, signer diversity, and whether transaction verification is possible before signing.",
                "Rank the branches by probable loss, not by interest, and write the one sentence that names where you would spend the first defensive dollar.",
                "State your three biggest uncertainties explicitly — the things you could not verify from public data — because naming what you do not know is the mark of the work being real."
              ]
            },
            {
              kind: "callout",
              title: "The honesty test",
              body: "If your finished model has no branch in the custody/governance family, you have modeled the tutorial, not the protocol. Every real system has a privileged-key story, and it is almost always the largest branch."
            }
          ],
          praxis: "Produce a written threat model for a real, named protocol, organized by the six archetypes, tying each branch to a historical incident and a stated exposure level, and ending with a first-dollar recommendation ranked by probable loss.",
          evidence: "Attach the threat-model document (redact nothing about the public protocol; it is all public) plus a short screencast or annotated diagram walking through the privileged-key branch and your first-dollar recommendation.",
          glossary: ["loss-attribution", "access-control", "bridge-trust-model", "governance-capture"],
          awards: ["ch-chain-threat-cartographer"]
        },
        {
          id: "ch-chain-board-risk-council",
          kind: "council",
          title: "Say the Number to the Board",
          statement: "A board does not fund fear; it funds a defensible range of probable loss against a defensible cost of control.",
          minutes: 28,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Everything you learned this Page is worthless to the organization until a decision-maker who does not read Solidity agrees to fund it. The failure mode of security leaders in the boardroom is to speak in vulnerabilities — reentrancy, oracle manipulation — which lands as noise. The board thinks in expected loss and cost of control. Your job is to translate the loss distribution into that language without inventing precision you do not have."
            },
            {
              kind: "prose",
              title: "Use FAIR to structure the estimate",
              body: "The FAIR model (Factor Analysis of Information Risk) decomposes risk into loss event frequency and loss magnitude, and insists you express each as a calibrated range rather than a single number. For a custody risk you might say: a privileged-key compromise is low-frequency but, given the treasury, has a loss magnitude between most-of-treasury and all-of-treasury. That framing is honest about uncertainty and still actionable, which is exactly what a board can approve against."
            },
            {
              kind: "compare",
              title: "Two ways to ask for the same budget",
              left: {
                title: "The framing that fails",
                items: [
                  "We have a reentrancy risk and need an audit",
                  "Bug names the board cannot weigh",
                  "No dollar figure, no likelihood",
                  "Sounds like every other team asking for money"
                ]
              },
              right: {
                title: "The framing that funds",
                items: [
                  "Our single largest exposure is a privileged-key compromise, in the same shape that cost Ronin 620M and Bybit 1.5B",
                  "Estimated loss magnitude: a large fraction of the treasury; frequency: low but non-trivial for a target our size",
                  "Cost of control: a multisig migration and signing process, a fraction of one percent of what is at risk",
                  "The board is being asked to compare a bounded loss to a small, known cost"
                ]
              }
            },
            {
              kind: "callout",
              title: "The move that earns you the room",
              body: "Volunteer your uncertainty before they find it. Say which numbers are ranges and why. Executives have a finely tuned detector for false confidence, and the fastest way to lose a board is to present a fabricated point estimate that a smart director pokes a hole in. Calibrated humility reads as competence; false precision reads as risk."
            },
            {
              kind: "principle",
              body: "Translate every technical risk into a range of probable loss against a cost of control, and never quote a number you cannot defend under questioning."
            }
          ],
          glossary: ["fair-model", "loss-attribution", "access-control"],
          awards: ["ch-chain-board-translator"]
        }
      ]
    },
    {
      id: "pg-chain-contracts",
      title: "The Reentrant Door and Its Cousins",
      credential: "STEPSAFE Certified — Smart Contract Vulnerability Engineering",
      summary: "This is the deep code Page. You learn the bug classes that actually take money — reentrancy including its read-only variant, oracle and flash-loan price manipulation, access-control failures, proxy storage collisions, EIP-712 signature replay, and rounding errors — not as a checklist but as mechanisms you can construct, exploit, and fix. You build a working reentrancy exploit and its fix in Foundry, and you write stateful invariant tests with a proper handler that would have caught real losses. You leave able to break a contract on purpose and prove the fix holds.",
      competencies: [
        "Construct and remediate reentrancy in all four modern forms, including read-only reentrancy through unguarded view functions",
        "Build a flash-loan-driven oracle manipulation and explain why spot price is not a price",
        "Identify access-control, proxy storage-collision, and EIP-712 replay bugs from the code",
        "Reason about integer rounding and the direction of the error that favors the protocol",
        "Write Foundry invariant tests with a handler and ghost variables that break the contract before an attacker does"
      ],
      seal: "The Reentrant Door",
      steps: [
        {
          id: "ch-chain-reentrancy-variants",
          kind: "construct",
          title: "Reentrancy Has Four Doors, Not One",
          statement: "The checks-effects-interactions rule stops the classic attack and none of its three modern relatives.",
          minutes: 24,
          respect: 80,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Every engineer learns the classic reentrancy story: a withdraw function sends ETH before it updates the balance, the recipient's fallback calls back in, and the balance is drained in a loop. The fix — checks, then effects, then interactions — is real and necessary. But teams that learned only the classic form keep losing money to three variants that the classic fix does not touch. You need all four in your head as distinct doors, because they require distinct guards."
            },
            {
              kind: "table",
              title: "The four doors of reentrancy",
              headers: ["Variant", "The re-entry path", "What the classic fix misses"],
              rows: [
                ["Classic (single-function)", "Re-enters the same function before state updates", "Nothing — checks-effects-interactions handles this"],
                ["Cross-function", "Re-enters a different function that shares the same state", "A guard on one function does not protect its siblings reading the same balance"],
                ["Cross-contract", "Re-enters through a second contract that trusts the first mid-update", "Per-function reasoning misses inter-contract state that is momentarily inconsistent"],
                ["Read-only", "A view function is called mid-callback and returns stale state to a third party", "The vulnerable code has no state change at all — it only reads, so no reentrancy guard was ever placed on it"]
              ]
            },
            {
              kind: "callout",
              title: "Read-only reentrancy, the one that surprises seniors",
              body: "In the Curve pattern documented by ChainSecurity, remove_liquidity burns LP tokens and then sends the underlying assets via a raw ETH transfer, which hands control to the recipient before all transfers finish. During that window, the unguarded get_virtual_price view reads balances that have dropped while total supply was already reduced, returning a price that can be off by a factor of two. Every protocol using that view as an oracle — lending markets pricing LP collateral — gets a corrupted number, without any reentrancy into their own code."
            },
            {
              kind: "compare",
              title: "The mental model shift",
              left: {
                title: "The junior model",
                items: [
                  "Reentrancy is about calling back into a function",
                  "A nonReentrant guard on external state-changers is enough",
                  "View functions are safe because they change nothing"
                ]
              },
              right: {
                title: "The senior model",
                items: [
                  "Reentrancy is about anyone observing inconsistent state during an external call",
                  "Guards must cover every function that shares state, including views others rely on",
                  "A view that reads mid-mutation state is a poisoned oracle for the whole ecosystem"
                ]
              }
            },
            {
              kind: "principle",
              body: "Any external call is a window where the world can read your half-finished state; the guard belongs on everything that half-finished state touches, including the views strangers trust."
            }
          ],
          glossary: ["reentrancy", "read-only-reentrancy", "oracle-manipulation", "checks-effects-interactions"],
          awards: ["ch-chain-four-doors"]
        },
        {
          id: "ch-chain-oracle-flashloan",
          kind: "lesson",
          title: "Spot Price Is Not a Price",
          statement: "A price you can move within a single transaction is not an oracle; it is an attacker-controlled input.",
          minutes: 30,
          respect: 120,
          trust: 6,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "The most reliably profitable DeFi attack is not a memory-corruption exploit; it is convincing a protocol that an asset is worth something it is not, for exactly one block. Flash loans make this trivial: they let anyone borrow enormous, uncollateralized sums as long as the loan is repaid within the same transaction. That removes capital as a barrier and turns price manipulation from a whale's privilege into anyone's tool. The bug is almost never the flash loan itself — it is a protocol reading a price it should never have trusted."
            },
            {
              kind: "numbered",
              title: "How a flash-loan price manipulation is constructed",
              items: [
                "Borrow a large sum via flash loan — no collateral, repayable at the end of the transaction.",
                "Use it to skew a thin on-chain pool the target uses as a price source: dump into it or drain it so the spot price moves hard in your favor.",
                "Call the target protocol while the price is corrupted — borrow against inflated collateral, mint against a fake ratio, or trigger a mispriced liquidation.",
                "Reverse the pool trade and repay the flash loan, all atomically. You keep the difference; the protocol keeps a hole."
              ]
            },
            {
              kind: "callout",
              title: "Beanstalk: the same trick aimed at governance",
              body: "The 2022 Beanstalk loss of roughly 182M was a flash-loan attack whose target was not a price but a vote. The attacker borrowed about a billion dollars, used it to acquire a two-thirds supermajority of instantaneously-measured voting weight, and executed their own malicious proposal through the emergencyCommit path in a single block. Same primitive, different mispriced input: voting weight measured at the current instant instead of from a fixed checkpoint."
            },
            {
              kind: "compare",
              title: "A price you can trust vs. one you cannot",
              left: {
                title: "Manipulable in one transaction",
                items: [
                  "Spot price from a single thin AMM pool",
                  "get_virtual_price read mid-callback",
                  "Instantaneous vote weight or balance snapshots",
                  "Any value an attacker with a flash loan can move and restore atomically"
                ]
              },
              right: {
                title: "Resistant to single-transaction manipulation",
                items: [
                  "Time-weighted average price over many blocks",
                  "Robust external oracle with multiple independent sources and sanity bounds",
                  "Vote weight checkpointed to a past block",
                  "Values that cost more to move than the attack can earn"
                ]
              }
            },
            {
              kind: "principle",
              body: "If an input can be moved and restored inside one transaction, treat it as fully attacker-controlled and never as ground truth."
            }
          ],
          glossary: ["flash-loan", "oracle-manipulation", "governance-capture", "twap"],
          awards: ["ch-chain-price-skeptic"]
        },
        {
          id: "ch-chain-reentrancy-lab",
          kind: "lab",
          title: "Break It, Then Guard It, in Foundry",
          statement: "You do not understand a vulnerability until you have written the exploit that proves it and the test that proves the fix.",
          minutes: 38,
          respect: 180,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Reading about reentrancy is not knowing reentrancy. In this lab you build a vulnerable vault, write an attacker contract that drains it, watch the test pass (the drain succeeds), apply the fix, and watch the same exploit test fail (the drain is stopped). Foundry is the right tool because the exploit and the fix live in the same Solidity you are defending, and the test is the proof you can show an auditor."
            },
            {
              kind: "code",
              lang: "solidity",
              title: "The vulnerable vault — interactions before effects",
              body:
                "// SPDX-License-Identifier: MIT\n" +
                "pragma solidity ^0.8.24;\n" +
                "\n" +
                "contract Vault {\n" +
                "    mapping(address => uint256) public balance;\n" +
                "\n" +
                "    function deposit() external payable {\n" +
                "        balance[msg.sender] += msg.value;\n" +
                "    }\n" +
                "\n" +
                "    // BUG: sends ETH (interaction) before zeroing the balance (effect)\n" +
                "    function withdraw() external {\n" +
                "        uint256 amount = balance[msg.sender];\n" +
                "        require(amount > 0, 'nothing to withdraw');\n" +
                "        (bool ok, ) = msg.sender.call{value: amount}('');\n" +
                "        require(ok, 'transfer failed');\n" +
                "        balance[msg.sender] = 0;\n" +
                "    }\n" +
                "}\n"
            },
            {
              kind: "code",
              lang: "solidity",
              title: "The attacker and the test that proves the drain",
              body:
                "// SPDX-License-Identifier: MIT\n" +
                "pragma solidity ^0.8.24;\n" +
                "\n" +
                "import 'forge-std/Test.sol';\n" +
                "import './Vault.sol';\n" +
                "\n" +
                "contract Attacker {\n" +
                "    Vault public vault;\n" +
                "    constructor(Vault v) { vault = v; }\n" +
                "\n" +
                "    function pwn() external payable {\n" +
                "        vault.deposit{value: 1 ether}();\n" +
                "        vault.withdraw();\n" +
                "    }\n" +
                "\n" +
                "    // re-enters withdraw while our balance is still non-zero\n" +
                "    receive() external payable {\n" +
                "        if (address(vault).balance >= 1 ether) {\n" +
                "            vault.withdraw();\n" +
                "        }\n" +
                "    }\n" +
                "}\n" +
                "\n" +
                "contract ReentrancyTest is Test {\n" +
                "    Vault vault;\n" +
                "\n" +
                "    function setUp() public {\n" +
                "        vault = new Vault();\n" +
                "        // three honest depositors seed the vault\n" +
                "        for (uint256 i = 0; i < 3; i++) {\n" +
                "            address user = address(uint160(1000 + i));\n" +
                "            vm.deal(user, 1 ether);\n" +
                "            vm.prank(user);\n" +
                "            vault.deposit{value: 1 ether}();\n" +
                "        }\n" +
                "    }\n" +
                "\n" +
                "    function test_drain() public {\n" +
                "        Attacker a = new Attacker(vault);\n" +
                "        vm.deal(address(a), 1 ether);\n" +
                "        a.pwn();\n" +
                "        // attacker walked away with more than it deposited\n" +
                "        assertGt(address(a).balance, 1 ether);\n" +
                "    }\n" +
                "}\n"
            },
            {
              kind: "code",
              lang: "bash",
              title: "Run it, then flip to the fix",
              body:
                "# watch the exploit succeed against the vulnerable vault\n" +
                "forge test --match-test test_drain -vvv\n" +
                "\n" +
                "# apply the fix (see next block), then rerun:\n" +
                "# the same test now reverts on the re-entrant call and the drain fails\n" +
                "forge test --match-test test_drain -vvv\n"
            },
            {
              kind: "code",
              lang: "solidity",
              title: "The fix — effects before interactions (and a guard as belt-and-suspenders)",
              body:
                "// checks, then effects, then interactions\n" +
                "function withdraw() external {\n" +
                "    uint256 amount = balance[msg.sender];\n" +
                "    require(amount > 0, 'nothing to withdraw');\n" +
                "    balance[msg.sender] = 0;               // effect first\n" +
                "    (bool ok, ) = msg.sender.call{value: amount}('');\n" +
                "    require(ok, 'transfer failed');        // interaction last\n" +
                "}\n" +
                "\n" +
                "// For cross-function and cross-contract variants, also inherit a\n" +
                "// reentrancy guard (e.g. OpenZeppelin ReentrancyGuard) and apply\n" +
                "// nonReentrant to every function that touches shared balance state\n" +
                "// including view functions other protocols use as oracles.\n"
            },
            {
              kind: "callout",
              title: "The lab's real lesson",
              body: "Notice that the exploit test is now a permanent regression test. Any future refactor that reintroduces the interaction-before-effect ordering will make test_drain pass again and fail your CI. A proof-of-exploit is not a one-time demo; it is the most durable form of security documentation you can keep."
            }
          ],
          praxis: "Reproduce this lab end to end in your own Foundry project, then extend it with a second test that demonstrates the cross-function variant surviving a naive single-function guard.",
          evidence: "Attach the repository with both the passing exploit against the vulnerable version and the reverting exploit against the fixed version, plus the forge test output showing the transition.",
          glossary: ["reentrancy", "checks-effects-interactions", "foundry", "invariant-testing"],
          awards: ["ch-chain-exploit-author"]
        },
        {
          id: "ch-chain-access-proxy-replay",
          kind: "lesson",
          title: "Access Control, Proxy Slots, and the Signature You Can Replay",
          statement: "The quiet bugs — a missing modifier, a colliding storage slot, a domain separator left off — move more money than the loud ones.",
          minutes: 32,
          respect: 140,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Reentrancy is famous; these are lucrative. Access-control failures top the OWASP Smart Contract Top 10 for 2025 precisely because they are boring to look for and catastrophic to miss. Upgradeability adds a second quiet class: storage collisions between proxy and implementation, or between two implementation versions. And anywhere you accept a signed message off-chain, you inherit the entire replay surface. None of these need cleverness; they need discipline."
            },
            {
              kind: "table",
              title: "The quiet bug classes and their tells",
              headers: ["Class", "The mechanism", "The tell in review"],
              rows: [
                ["Access control", "A privileged function missing onlyOwner, or a role check that can be granted by anyone", "Any state-changing external function with no modifier and no msg.sender check"],
                ["Proxy storage collision", "Implementation declares a variable in a slot the proxy or a prior version uses for something else", "Reordered or inserted state variables across an upgrade; missing storage gaps"],
                ["Signature replay", "A signed message valid on more than one chain, contract, or use because a field was omitted", "EIP-712 domain separator missing chainId, verifyingContract, or a per-use nonce"],
                ["Integer rounding", "Division that rounds in the user's favor, skimmable at scale", "Any share/asset conversion where the rounding direction was not deliberately chosen"]
              ]
            },
            {
              kind: "callout",
              title: "ERC-1967 is the reason your proxy does not eat its own admin",
              body: "OpenZeppelin's unstructured-storage pattern stores the implementation and admin addresses at pseudo-random slots derived like keccak256('eip1967.proxy.implementation') minus one, so they cannot collide with any variable the implementation declares. This solves proxy-versus-implementation collisions. It does not solve implementation-versus-implementation collisions: if version two inserts a new variable above an existing one, every later variable shifts by a slot and reads corrupted data. Storage gaps and append-only variable layout are how you avoid it. The Bybit attack, notably, weaponized slot 0 of the Safe proxy — the singleton pointer — by delegatecalling code that overwrote it."
            },
            {
              kind: "code",
              lang: "solidity",
              title: "EIP-712 replay protection: the fields that must be present",
              body:
                "// The domain separator binds a signature to ONE chain and ONE contract.\n" +
                "// Omit any field and the signature becomes replayable somewhere.\n" +
                "bytes32 constant TYPEHASH = keccak256(\n" +
                "    'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'\n" +
                ");\n" +
                "\n" +
                "function domainSeparator() public view returns (bytes32) {\n" +
                "    return keccak256(abi.encode(\n" +
                "        TYPEHASH,\n" +
                "        keccak256(bytes('MyProtocol')),\n" +
                "        keccak256(bytes('1')),\n" +
                "        block.chainid,          // recompute; do NOT cache blindly across a fork\n" +
                "        address(this)\n" +
                "    ));\n" +
                "}\n" +
                "\n" +
                "// Every signed action must also carry a per-account nonce that the\n" +
                "// contract increments on use, or the same signature replays forever.\n"
            },
            {
              kind: "principle",
              body: "Caching the domain separator at deploy time and never recomputing it after a chain fork is the most common EIP-712 bug; bind chainId at verification time or you will honor signatures on a chain you never meant to serve."
            }
          ],
          glossary: ["access-control", "proxy-storage-collision", "eip-712", "domain-separator", "signature-replay"],
          awards: ["ch-chain-quiet-bugs"]
        },
        {
          id: "ch-chain-finding-drill",
          kind: "drill",
          title: "Two Findings, One Night Left",
          statement: "The elegant bug that skims dust is a trap when a boring bug can empty the contract.",
          minutes: 24,
          respect: 170,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "You are the lead on a fixed-fee audit due tomorrow morning. Tonight you find two things. One is a subtle rounding error you are genuinely proud of catching — an attacker can skim a few wei per transaction through a favorable division. The other is uglier and less interesting: an admin function that reconfigures the fee recipient has no access-control modifier at all. You have hours, not days."
            }
          ],
          drill: {
            id: "ch-chain-finding-drill-d1",
            scene: "Fixed-fee audit of a yield vault, report due in nine hours. Finding A: a rounding error skimmable at roughly dust-per-transaction, elegant and hard to spot. Finding B: setFeeRecipient() has no onlyOwner check — anyone can point all future fees, and potentially redirect a privileged flow, to themselves. You cannot fully write up both to your usual standard tonight.",
            clock: "Report and findings call in 9 hours.",
            pressure: "The client has a launch scheduled on the audit's completion and has been hinting they want a clean sign-off, not a critical finding at the buzzer.",
            prompt: "How do you spend the night and frame the report?",
            options: [
              {
                id: "opt-rounding",
                label: "Fully develop the rounding exploit; note the access-control gap briefly",
                detail: "The rounding bug is your best technical work and will impress the client's engineers.",
                score: -2,
                outcome: "You ship a beautiful writeup of a low-severity issue and a one-line mention of a Critical one. The client, reading severity, fixes the elegant bug and defers the boring one past launch.",
                ripple: "You optimized for looking clever over protecting the protocol. An unguarded admin setter is Critical by any classification — direct control of privileged state — and you buried it. If it is exploited post-launch, your report is the evidence that you saw it and under-weighted it.",
                isBest: false
              },
              {
                id: "opt-access",
                label: "Escalate the access-control gap immediately as Critical, then document the rounding bug as time allows",
                detail: "Stop, notify the client tonight that a Critical is confirmed, and make the fix and re-check the priority.",
                score: 3,
                outcome: "The client learns tonight that an unauthenticated function controls fee routing, freezes the launch decision, and patches it. The rounding bug ships as a documented Medium/Low with a clear recommendation.",
                ripple: "You triaged by impact, not by elegance, and you gave the client the information early enough to act on it. This is what separates an audit from a vanity report: the severity ordering drives the timeline, and a Critical stops the clock.",
                isBest: true
              },
              {
                id: "opt-signoff",
                label: "Give the clean sign-off; both issues are theoretical and the client is under pressure",
                detail: "Neither has been exploited; you can add them as informational notes.",
                score: -3,
                outcome: "You certify a contract with a publicly-callable privileged setter as clean. The launch proceeds. Your name is on the report.",
                ripple: "This is the rubber stamp — the exact failure mode that makes audits worthless and destroys the auditor. An unauthenticated admin function is not theoretical; it is a Critical waiting for the first person who reads the ABI. You have traded your credibility for a client's launch date.",
                isBest: false
              },
              {
                id: "opt-delay",
                label: "Refuse to deliver anything until both findings are exhaustively written up, sliding the deadline indefinitely",
                detail: "Do it perfectly or not at all.",
                score: 0,
                outcome: "You protect your standards but leave the client with no information at the moment they most need the Critical. Perfect is delivered late; the launch decision is made in the dark tonight.",
                ripple: "Rigor is right, but withholding a confirmed Critical to polish a Low inverts the priority. The client needed the dangerous finding fast and the elegant finding thorough, not both slow.",
                isBest: false
              }
            ],
            debrief: "The tempting answer is the rounding bug, because it is your best work and the thing an interviewer would praise. But severity is defined by impact, and by every serious classification — the Immunefi system among them — an unauthenticated function that controls privileged state is Critical: direct manipulation of protocol funds or configuration. A dust-skim is Low to Medium. The whole value of an audit is that severity ordering drives what the client does and when. The best move escalates the Critical the moment it is confirmed, because early warning on a fund-controlling bug is worth more than a perfect writeup delivered too late to matter. Elegance is for you; impact is for the protocol.",
            principle: "Triage by blast radius, not by beauty; a boring Critical outranks a brilliant Low every single time."
          },
          glossary: ["access-control", "integer-rounding", "bug-bounty", "loss-attribution"],
          awards: ["ch-chain-impact-first"]
        },
        {
          id: "ch-chain-invariant-lab",
          kind: "lab",
          title: "Invariants That Break the Contract Before the Attacker Does",
          statement: "A unit test checks the case you imagined; an invariant test lets the machine imagine the case you missed.",
          minutes: 40,
          respect: 190,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Unit tests encode your assumptions and therefore inherit your blind spots. Invariant testing inverts that: you state a property that must hold no matter what — total user balances never exceed vault assets, the sum of shares always maps back to deposits — and Foundry throws random sequences of calls at your contract trying to break it. Done right, with a handler and ghost variables, this is the single highest-leverage testing technique in the field, and it catches the state-machine bugs that reentrancy and rounding hide inside."
            },
            {
              kind: "prose",
              title: "Why a handler, and why ghost variables",
              body: "If you point the fuzzer straight at your contract, most calls revert on preconditions and you explore almost nothing. A handler is a wrapper you point the fuzzer at instead; it bounds inputs and sets up preconditions so calls actually land, and it accumulates ghost variables — running totals the fuzzer updates as it goes — so your invariant can compare the contract's real state against an independently tracked expectation. The discipline: prefer reading real state from the contract under test over re-deriving it in the ghost, or you will simply replicate the implementation's bug in your own test and prove nothing."
            },
            {
              kind: "code",
              lang: "solidity",
              title: "A handler with ghost accounting",
              body:
                "// SPDX-License-Identifier: MIT\n" +
                "pragma solidity ^0.8.24;\n" +
                "\n" +
                "import 'forge-std/Test.sol';\n" +
                "import './Vault.sol';\n" +
                "\n" +
                "contract Handler is Test {\n" +
                "    Vault public vault;\n" +
                "    uint256 public ghost_depositSum;    // total ever deposited\n" +
                "    uint256 public ghost_withdrawSum;   // total ever withdrawn\n" +
                "    address[] internal actors;\n" +
                "\n" +
                "    constructor(Vault v) {\n" +
                "        vault = v;\n" +
                "        for (uint256 i = 0; i < 5; i++) actors.push(address(uint160(2000 + i)));\n" +
                "    }\n" +
                "\n" +
                "    function deposit(uint256 actorSeed, uint256 amount) external {\n" +
                "        address actor = actors[actorSeed % actors.length];\n" +
                "        amount = bound(amount, 0, 100 ether);   // bound so the call actually lands\n" +
                "        vm.deal(actor, amount);\n" +
                "        vm.prank(actor);\n" +
                "        vault.deposit{value: amount}();\n" +
                "        ghost_depositSum += amount;\n" +
                "    }\n" +
                "\n" +
                "    function withdraw(uint256 actorSeed) external {\n" +
                "        address actor = actors[actorSeed % actors.length];\n" +
                "        uint256 bal = vault.balance(actor);\n" +
                "        if (bal == 0) return;\n" +
                "        vm.prank(actor);\n" +
                "        vault.withdraw();\n" +
                "        ghost_withdrawSum += bal;\n" +
                "    }\n" +
                "}\n"
            },
            {
              kind: "code",
              lang: "solidity",
              title: "The invariant: the vault can always pay everyone back",
              body:
                "contract VaultInvariants is Test {\n" +
                "    Vault vault;\n" +
                "    Handler handler;\n" +
                "\n" +
                "    function setUp() public {\n" +
                "        vault = new Vault();\n" +
                "        handler = new Handler(vault);\n" +
                "        targetContract(address(handler));   // fuzz ONLY the handler\n" +
                "    }\n" +
                "\n" +
                "    // solvency: assets held cover the net of deposits minus withdrawals\n" +
                "    function invariant_solvent() public view {\n" +
                "        assertGe(\n" +
                "            address(vault).balance,\n" +
                "            handler.ghost_depositSum() - handler.ghost_withdrawSum()\n" +
                "        );\n" +
                "    }\n" +
                "}\n"
            },
            {
              kind: "code",
              lang: "bash",
              title: "Run it, and read the metrics",
              body:
                "# runs and depth per run come from foundry.toml [invariant]\n" +
                "forge test --match-contract VaultInvariants -vvv\n" +
                "\n" +
                "# turn on the call breakdown so you can see which handler\n" +
                "# functions actually executed vs. reverted and were discarded:\n" +
                "# set  show_metrics = true  under [invariant] in foundry.toml\n" +
                "# if withdraw() reverts 95% of the time, your handler is exploring nothing.\n"
            },
            {
              kind: "callout",
              title: "The failure mode of invariant testing itself",
              body: "The most dangerous invariant suite is the one that passes because it never explores. If your metrics show the interesting functions reverting almost every run, your handler preconditions are too tight and you have proven nothing while feeling safe. Tune bounds and seeding until the fuzzer is landing real, varied sequences — then a green run means something. The horsefacts WETH invariant-testing walkthrough is the canonical worked example to model yours on."
            }
          ],
          praxis: "Write an invariant suite with a handler and at least two ghost-tracked invariants for a non-trivial contract (a vault, an AMM pair, or a staking contract), and demonstrate it catching a bug you deliberately introduce.",
          evidence: "Attach the handler and invariant files, the foundry.toml invariant config, the show_metrics output proving real exploration, and a diff of the injected bug with the failing run that caught it.",
          glossary: ["invariant-testing", "foundry", "differential-testing", "echidna"],
          awards: ["ch-chain-invariant-author"]
        }
      ]
    },
    {
      id: "pg-chain-audit",
      title: "The Bounded Search",
      credential: "STEPSAFE Certified — Security Audit and Bounty Program Leadership",
      summary: "An audit is not a certificate of safety; it is a time-boxed search by fallible humans, and treating it as a guarantee is how protocols die confident. This Page teaches you to run reviews that resist becoming rubber stamps: a real tooling pipeline of static analysis, fuzzing, and differential testing; a clear-eyed choice between fuzzing and formal verification; the discipline to refuse a clean sign-off on an out-of-scope critical path; and how to design a bug-bounty program at the scale where a single Critical is worth millions. You leave able to lead a review whose findings a protocol can bet its treasury on.",
      competencies: [
        "Frame an audit as a bounded search with explicit scope, assumptions, and residual risk, never as a guarantee",
        "Operate a Slither, Echidna, and differential-testing pipeline and read its output critically",
        "Choose between fuzzing, bounded symbolic testing with Halmos, and full formal verification with Certora based on the property and the stakes",
        "Negotiate scope and refuse to bless an out-of-scope critical path under deadline pressure",
        "Design a bug-bounty program with impact-first severity, a Primacy of Impact scope, and honest payout economics"
      ],
      seal: "The Bounded Search",
      steps: [
        {
          id: "ch-chain-audit-not-certificate",
          kind: "construct",
          title: "An Audit Is a Search, Not a Certificate",
          statement: "The word audited on a landing page has killed more protocols than any single bug.",
          minutes: 16,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Users read audited as safe. Founders sell audited as safe. Neither is what an audit provides. An audit is a fixed number of skilled people looking at a defined slice of code for a defined number of days, finding what they can in that window. It reduces risk; it does not eliminate it, and it says nothing about the parts you left out of scope, the dependencies you integrate, or the keys you hold. Every protocol that has been audited and then drained learned this the expensive way."
            },
            {
              kind: "principle",
              body: "An audit lowers the probability of a class of bug in a slice of code for a period of time; anyone who reads it as a guarantee has misunderstood the product they bought."
            },
            {
              kind: "list",
              title: "What an audit structurally cannot do",
              items: [
                "Cover what you kept out of scope — and the riskiest integration is often exactly what got deferred",
                "Protect against a compromised key or signer, which is code behaving as written",
                "Guarantee the deployed bytecode matches what was reviewed",
                "Anticipate future upgrades, new dependencies, or economic conditions the reviewers never saw",
                "Substitute for the protocol's own continuous testing, monitoring, and custody discipline"
              ]
            },
            {
              kind: "callout",
              title: "The reframe that makes audits worth their price",
              body: "Stop asking is it audited and start asking what was in scope, what assumptions did the auditors make, what did they explicitly not cover, and what is the residual risk. A good audit report answers those in writing. If it does not, you bought a logo, not a review. The residual-risk section is the most important page in the document and the one nobody reads."
            }
          ],
          glossary: ["audit-scope", "residual-risk", "differential-testing", "bug-bounty"],
          awards: ["ch-chain-audit-realist"]
        },
        {
          id: "ch-chain-tooling-lab",
          kind: "lab",
          title: "The Pipeline: Static, Fuzz, Differential",
          statement: "Each tool sees a different class of bug; running one and calling it coverage is theater.",
          minutes: 36,
          respect: 160,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "There is no single tool that finds smart-contract bugs. There is a pipeline, and each stage has a different cost, a different false-positive rate, and a different class of bug it is good at. Trail of Bits's Building Secure Contracts lays out the staging: static analysis first because it is seconds and catches structural issues, then fuzzing for state-machine and access-control properties, then heavier symbolic and differential techniques for the arithmetic and the parts you most distrust. Run them in order and you filter cheaply before you spend the expensive attention."
            },
            {
              kind: "table",
              title: "The tools and what each is actually good at",
              headers: ["Tool", "Technique", "Best at", "Cost / caveat"],
              rows: [
                ["Slither", "Static analysis", "Structural bugs, inheritance issues, missing modifiers, in seconds", "Misses deep arithmetic and semantic logic; some false positives to triage"],
                ["Echidna / Medusa", "Property-based fuzzing", "State-machine and access-control properties, true positives only", "Random exploration can miss narrow edge cases; needs good properties"],
                ["Halmos", "Bounded symbolic execution", "Proving arithmetic properties for all inputs up to a bound, locally", "Bounded, not full proof; unbounded loops only checked to depth N"],
                ["Differential testing", "Compare implementations", "Catching a divergence between a reference model and the contract", "Requires a trusted reference; only as good as the oracle you compare to"]
              ]
            },
            {
              kind: "code",
              lang: "bash",
              title: "Stage one and two: Slither then Echidna",
              body:
                "# static analysis first: cheapest signal, run on every commit\n" +
                "pip install slither-analyzer\n" +
                "slither . --exclude-informational\n" +
                "\n" +
                "# print the human-readable inheritance and call graphs to reason about scope\n" +
                "slither . --print inheritance-graph\n" +
                "slither . --print human-summary\n" +
                "\n" +
                "# property fuzzing: write invariants as echidna properties, then\n" +
                "pip install echidna || echo 'or install the prebuilt binary from crytic'\n" +
                "echidna src/Vault.sol --contract VaultEchidna --test-mode assertion\n"
            },
            {
              kind: "code",
              lang: "solidity",
              title: "An Echidna property and a differential check",
              body:
                "// An Echidna assertion property: shares must never mint value from nothing\n" +
                "contract VaultEchidna {\n" +
                "    Vault vault;\n" +
                "    constructor() { vault = new Vault(); }\n" +
                "\n" +
                "    function echidna_no_free_shares() public view returns (bool) {\n" +
                "        // total shares must always be backed by at least as many assets\n" +
                "        return vault.totalAssets() >= vault.totalShares();\n" +
                "    }\n" +
                "}\n" +
                "\n" +
                "// Differential idea: run the same operation through a simple reference\n" +
                "// model written in plain Solidity or a Python model, and assert the\n" +
                "// contract and the model agree on every fuzzed input. A divergence is\n" +
                "// a bug in one of them - and finding out which is the point.\n"
            },
            {
              kind: "callout",
              title: "The trap of a green pipeline",
              body: "A clean Slither run and a passing Echidna suite feel like safety and are not. Slither cannot see your arithmetic invariants; Echidna only tests the properties you wrote. The pipeline's value is bounded by the quality of your properties, not by the tools. The senior move is to spend most of your time deciding what must always be true, and only then reach for the tools to try to break it."
            }
          ],
          praxis: "Stand up the full pipeline — Slither, Echidna, and one differential comparison against a reference model — on a real contract, and record at least one genuine finding or a documented argument for why a class of bug is absent.",
          evidence: "Attach the pipeline configuration and CI file, the tool outputs, the Echidna properties and differential model, and a short writeup of what each stage caught or ruled out.",
          glossary: ["slither", "echidna", "differential-testing", "halmos"],
          awards: ["ch-chain-pipeline-builder"]
        },
        {
          id: "ch-chain-formal-verification",
          kind: "lesson",
          title: "When Fuzzing Stops and Proof Begins",
          statement: "Fuzzing finds bugs; formal verification proves their absence within a spec — and the spec is where all the difficulty moves.",
          minutes: 30,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Fuzzing and invariant testing can only tell you that they failed to break your contract in the time they ran. For the highest-value code — the core accounting of a major lending protocol, the settlement math of an exchange — that is not enough, and you reach for formal verification: a mathematical proof that a property holds for all inputs. But verification does not remove the hard work; it relocates it entirely into writing a specification that is both correct and complete. A proof of the wrong property is worse than no proof, because it is confident."
            },
            {
              kind: "compare",
              title: "Halmos vs. Certora — two points on the verification spectrum",
              left: {
                title: "Halmos (bounded symbolic testing)",
                items: [
                  "Runs locally on an SMT solver, no cloud, no key",
                  "Reuses your Solidity property tests; low adoption cost",
                  "Bounded: proves properties up to N iterations and call depth",
                  "The right first step for arithmetic properties during development"
                ]
              },
              right: {
                title: "Certora Prover (deductive verification)",
                items: [
                  "Full formal proof for all inputs within the spec",
                  "Requires CVL, a dedicated specification language, and a paid service",
                  "The industry standard for Aave, Compound, MakerDAO, and the Uniswap v4 pre-release review",
                  "The tool for protocol-level invariants where the stakes justify the spec-writing cost"
                ]
              }
            },
            {
              kind: "callout",
              title: "Where verification actually fails in practice",
              body: "The proof engine rarely lies. What fails is the specification: an invariant that is too weak to catch the real bug, or an assumption baked into the spec that does not hold in production. Certora verified the Safe contracts, and Safe multisigs still lost 1.5 billion dollars at Bybit — because the compromise was in the signing interface and the human, entirely outside what any contract spec covers. Formal verification proves the code matches the spec; it can never prove the spec matches reality, or that the humans holding the keys will read what they sign."
            },
            {
              kind: "numbered",
              title: "A staged verification workflow that respects cost",
              items: [
                "Start with Foundry invariant tests to find the obvious property violations fast and cheap.",
                "Promote your most important arithmetic properties to Halmos symbolic tests to prove them for all inputs up to a bound, still locally.",
                "Reserve Certora CVL specs for the protocol-level invariants whose failure would be catastrophic, where the cost of writing and maintaining a formal spec is justified by the value at risk.",
                "Treat the spec itself as reviewable code: a weak or wrong spec is a vulnerability, so it gets the same scrutiny as the implementation."
              ]
            },
            {
              kind: "principle",
              body: "Formal verification moves the entire problem into the specification; budget your skepticism for the spec, because the prover will faithfully certify whatever you actually asked it to."
            }
          ],
          glossary: ["halmos", "certora", "invariant-testing", "differential-testing"],
          awards: ["ch-chain-proof-writer"]
        },
        {
          id: "ch-chain-scope-drill",
          kind: "drill",
          title: "The Sign-Off They Want You to Give",
          statement: "The most dangerous line in an audit is the clean summary on a system whose real risk you were told not to look at.",
          minutes: 24,
          respect: 170,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "You are wrapping an audit whose scope, agreed weeks ago, was the core vault contracts. In the final days you realize the protocol's actual risk lives one layer out: a price oracle integration that was explicitly excluded from scope and that you can see is fragile. The client wants the sign-off on the agreed scope, on time, so they can launch. Your report is about to say the in-scope code is clean, which is true, and which will be read as the protocol is safe, which is not."
            }
          ],
          drill: {
            id: "ch-chain-scope-drill-d1",
            scene: "Final day of a fixed-scope audit of a lending protocol's vault contracts. The vaults are clean. But the protocol prices collateral through an oracle integration that was contractually out of scope, and from what you can see, it reads a manipulable spot price. The client wants the clean sign-off on the agreed scope so they can launch on schedule.",
            clock: "Final report due end of day; launch is gated on it.",
            pressure: "The oracle is genuinely outside your paid scope, and the client is firm that re-scoping now blows their launch and their budget.",
            prompt: "How do you handle the sign-off?",
            options: [
              {
                id: "opt-clean",
                label: "Deliver the clean report on the agreed scope; the oracle was not your job",
                detail: "Scope is scope; you audited what you were paid to audit, and it is clean.",
                score: -2,
                outcome: "You deliver a technically accurate report that the market and the client both read as an endorsement of the whole protocol. The oracle risk ships unmentioned. If it is exploited, your clean report is the thing everyone points to.",
                ripple: "Technically-correct-but-misleading is the auditor's cardinal sin. Scope limits are legitimate; silently letting a clean in-scope report imply a safe out-of-scope critical path is how audits lose their meaning and how you inherit reputational liability for a risk you saw.",
                isBest: false
              },
              {
                id: "opt-flag",
                label: "Deliver the in-scope findings and add a prominent, explicit out-of-scope critical risk on the oracle",
                detail: "Sign off on what you reviewed, and in writing, at the top, state that the oracle integration was out of scope, that it appears manipulable, and that you cannot bless the protocol as a whole without it.",
                score: 3,
                outcome: "The report is honest on both counts: the vaults are clean, and the protocol has an unreviewed critical dependency that the client and users can now see and decide about. The launch decision is made with the real risk in the room.",
                ripple: "You preserved both the integrity of the scoped review and the value of the audit as a signal. Naming an out-of-scope critical risk in writing is exactly what protects users and protects you. A client who launches anyway does so informed, and the record shows you called it.",
                isBest: true
              },
              {
                id: "opt-quiet",
                label: "Mention the oracle verbally to the lead engineer but keep the written report clean",
                detail: "Give them a heads-up off the record so the report stays within scope.",
                score: -1,
                outcome: "You have a clear conscience and no evidence. The verbal warning evaporates in the launch rush, the written record says clean, and the risk is undocumented.",
                ripple: "A warning that is not in writing did not happen, for the users and for you. Off-the-record caveats are how real risks get lost precisely when the pressure to ship is highest. The report is the artifact; if it does not say it, it was not said.",
                isBest: false
              },
              {
                id: "opt-refuse",
                label: "Refuse to deliver any report until the oracle is added to scope and reviewed",
                detail: "You will not sign anything while a critical path is unexamined.",
                score: 1,
                outcome: "You hold the line on rigor, but you also withhold the genuinely useful clean result on the vaults and force a budget fight at the worst moment. The client may walk, and the vault findings never reach them.",
                ripple: "Principled but blunt. The better move delivers the real in-scope value and flags the out-of-scope risk in writing, rather than making the client choose between your invoice and their launch. Refusing everything can leave users less informed than a scoped report with a loud caveat.",
                isBest: false
              }
            ],
            debrief: "The trap is the clean report, because it is defensible — you did audit the agreed scope, and it is clean. But an audit's social function is to signal safety, and a clean in-scope report on a protocol with an unreviewed critical dependency signals something false. The professional move is neither to silently sign off nor to nuke the engagement, but to deliver the honest scoped result and, in writing and prominently, name the out-of-scope critical risk and refuse to extend your blessing to it. That keeps the review truthful, keeps the audit's signal meaningful, informs the users, and protects you. Scope is a legitimate boundary; letting people misread its edge is not.",
            principle: "You may limit your scope, but you must never let a clean report inside the boundary be read as safety outside it — put the residual risk in writing where it cannot be lost."
          },
          glossary: ["audit-scope", "residual-risk", "oracle-manipulation", "bug-bounty"],
          awards: ["ch-chain-no-rubber-stamp"]
        },
        {
          id: "ch-chain-bounty-field",
          kind: "field",
          title: "Run a Real Review on Live Code",
          statement: "The proof you can review is a report on code you did not write, with findings someone could act on.",
          minutes: 40,
          respect: 210,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "You have practiced the tools and the framing. Now do the thing itself on code you did not write. Choose an open-source protocol with a public repository and, ideally, a live bug-bounty program on a platform like Immunefi or Cantina. Conduct a real, scoped review: read the code adversarially, run your pipeline, and produce a professional report. If you find something genuine, disclose it responsibly through the program's channel — never publicly, never by exploiting it. This is the artifact that proves you can do the work, not just describe it."
            },
            {
              kind: "numbered",
              title: "The engagement",
              items: [
                "Pick a target with a public repo and a written bug-bounty scope; read the scope and severity definitions before you read the code.",
                "Write down your scope, assumptions, and the invariants you expect to hold before you start — this is your audit plan.",
                "Run the pipeline (Slither, Echidna or Foundry invariants) and read the code by hand for the archetypes from this chapter: access control, reentrancy, oracle trust, upgrade safety, signature handling.",
                "Produce a report with severity per finding using an impact-first classification, a residual-risk section, and an explicit statement of what you did not cover.",
                "If you find a real vulnerability, disclose it only through the program's official channel with a minimal proof of concept; if you find nothing conclusive, document the invariants you verified and where you would look next with more time."
              ]
            },
            {
              kind: "callout",
              title: "The line you never cross",
              body: "Responsible disclosure means the program's channel, a private report, and a proof of concept that demonstrates without stealing. Never test against mainnet with real funds, never exploit to prove a point, and never go public before the program has had its disclosure window. The difference between a researcher and a thief is entirely in this paragraph."
            }
          ],
          praxis: "Conduct a scoped security review of a real open-source protocol and produce a professional report; if a genuine finding emerges, submit it responsibly through the project's official bug-bounty or disclosure channel.",
          evidence: "Attach the review report (scope, findings with impact-first severity, residual risk, and coverage gaps) and, if applicable, the redacted disclosure submission confirmation — never a public exploit.",
          glossary: ["bug-bounty", "audit-scope", "residual-risk", "differential-testing"],
          awards: ["ch-chain-live-reviewer"]
        },
        {
          id: "ch-chain-bounty-design-council",
          kind: "council",
          title: "Designing a Bounty That Attracts the Right Hacker",
          statement: "A bug bounty is a market you design; price it wrong and the best researchers sell your Critical to someone else.",
          minutes: 28,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "A bug-bounty program is not a mailbox for bugs; it is a market you are competing in against the black market. A skilled researcher who finds a Critical in your protocol has two buyers: you, at your posted bounty, and an exploiter or broker who will pay for the exploit itself. If your top payout is a rounding error compared to what the bug is worth to steal, you have designed a program that surfaces only the findings not worth stealing. The largest programs on Immunefi post Critical bounties in the millions precisely because the alternative buyer is real."
            },
            {
              kind: "table",
              title: "The design decisions that determine whether it works",
              headers: ["Decision", "Cheap and broken", "Designed to work"],
              rows: [
                ["Top payout", "A flat few thousand for any bug", "Critical priced as a meaningful fraction of funds a Critical could steal"],
                ["Severity model", "Vague, negotiated after the fact", "Impact-first, published, aligned to a system like Immunefi v2.3"],
                ["Scope", "Only the contracts you feel good about", "Primacy of Impact: if the impact is real, the exact asset is secondary"],
                ["Response", "Weeks of silence", "Fast triage, a named human, and payment on confirmed impact"],
                ["Safe harbor", "None, so researchers fear legal reprisal", "Clear legal safe harbor for good-faith research"]
              ]
            },
            {
              kind: "callout",
              title: "Primacy of Impact vs. Primacy of Rules",
              body: "Immunefi's framing is worth internalizing. Primacy of Rules pays only for what your scope document literally lists. Primacy of Impact pays when a real, demonstrated impact occurs even if the specific contract was not enumerated, as long as it is an asset in the spirit of scope. Programs that cling to Primacy of Rules train researchers to walk away from findings on a technicality — and that finding does not disappear, it just finds the other buyer."
            },
            {
              kind: "prose",
              title: "The relationship is the product",
              body: "The whitehats who save your protocol are repeat players who talk to each other. A program that triages fast, pays fairly on confirmed impact, and treats researchers as allies builds a reputation that pulls the best people toward you first. A program that lowballs, argues severity down, and goes quiet builds the opposite reputation, and you will hear about your Criticals from the attacker instead. The economics and the relationship are the same lever pointed at the same goal: be the buyer the good researcher chooses."
            },
            {
              kind: "principle",
              body: "Price and run your bounty as if you are outbidding the exploit market for the researcher's loyalty, because you are."
            }
          ],
          glossary: ["bug-bounty", "primacy-of-impact", "residual-risk", "loss-attribution"],
          awards: ["ch-chain-bounty-architect"]
        }
      ]
    },
    {
      id: "pg-chain-custody",
      title: "The Cold Key and the Blind Signature",
      credential: "STEPSAFE Certified — Institutional Key Custody and Signing Security",
      summary: "The private key is the asset, and the largest thefts in history were signers approving what a compromised screen showed them. This Page builds custody at institutional scale: Safe multisig architecture and its delegatecall foot-gun, the real tradeoffs between multisig and MPC, signer diversity and hardware hygiene, and the independent transaction verification that would have stopped Bybit. It extends to exchange-grade custody — hot/warm/cold segmentation, withdrawal allowlists, proof of reserves, and the insider threat that bribed its way through Coinbase's support layer in 2025. You leave able to design a signing architecture where no single compromised screen or person can move the treasury.",
      competencies: [
        "Explain Safe smart-account architecture and why delegatecall plus storage slot zero is the highest-consequence foot-gun in multisig",
        "Choose between multisig and MPC on the real axes of on-chain transparency, single-point-of-failure, and operational complexity",
        "Independently verify an EIP-712 transaction hash and simulate it before signing, defeating a compromised signing interface",
        "Design hot, warm, and cold segmentation with withdrawal allowlists and dual control",
        "Reason about proof of reserves and proof of liabilities, and design against the insider threat"
      ],
      seal: "The Cold Key",
      steps: [
        {
          id: "ch-chain-key-is-asset",
          kind: "construct",
          title: "The Key Is the Asset",
          statement: "On-chain there is no account recovery, no chargeback, and no fraud department — the key is the money.",
          minutes: 16,
          respect: 80,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "In a bank, the money is a ledger entry the bank controls, and control means they can freeze, reverse, and restore. On-chain, control is the private key and nothing else. Whoever can produce a valid signature can move the funds, finally, with no appeal. This single fact reorganizes everything: your security perimeter is not your servers or your code, it is every place a key or a signature can be produced, and every human who can cause one to be produced."
            },
            {
              kind: "principle",
              body: "Protecting funds on-chain is not protecting a database; it is protecting the ability to sign, wherever and by whomever that ability exists."
            },
            {
              kind: "compare",
              title: "Why custody dominates the loss ledger",
              left: {
                title: "What web2 lets you recover",
                items: [
                  "Reset a stolen password",
                  "Reverse a fraudulent transfer",
                  "Restore from backup after ransomware",
                  "Freeze an account under investigation"
                ]
              },
              right: {
                title: "What on-chain gives you instead",
                items: [
                  "A signed transaction is final at inclusion",
                  "A stolen key drains funds with no reversal",
                  "There is no backup for the ledger state",
                  "Containment means changing the future, never undoing the past"
                ]
              }
            },
            {
              kind: "callout",
              title: "The reframe that changes how you build",
              body: "Ronin, Harmony, and Bybit were not code failures; the contracts did exactly what a valid signature told them to. They were custody and signing failures. When you accept that the key is the asset, you stop over-investing in the contract and start investing in who can sign, on what device, after what verification — which is where the billion-dollar losses actually happened."
            }
          ],
          glossary: ["access-control", "safe-multisig", "mpc", "signer-diversity"],
          awards: ["ch-chain-key-custodian"]
        },
        {
          id: "ch-chain-safe-mpc",
          kind: "lesson",
          title: "Safe Multisig, MPC, and the Delegatecall Foot-Gun",
          statement: "A multisig only protects you if each signer can independently see and refuse what they are signing.",
          minutes: 32,
          respect: 150,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "The default institutional answer to the key is the asset is to require multiple keys to sign. Two architectures dominate. A Safe smart-contract multisig enforces the threshold on-chain: the Safe is a proxy delegating to a shared singleton, with an owner set and a threshold, and execTransaction runs only once enough owners have signed. Multi-party computation (MPC) enforces the threshold off-chain in cryptography: the private key is never assembled; signers hold shares and jointly produce one ordinary signature. Both raise the bar. They fail in different ways, and you must choose deliberately."
            },
            {
              kind: "compare",
              title: "Multisig (Safe) vs. MPC threshold signing",
              left: {
                title: "Smart-contract multisig",
                items: [
                  "Threshold and owners are on-chain and auditable by anyone",
                  "Losing or rotating a signer is an on-chain transaction",
                  "Recovery, modules, and guards are transparent and composable",
                  "The signing UI is a trusted component, and delegatecall is a live foot-gun"
                ]
              },
              right: {
                title: "MPC threshold signatures",
                items: [
                  "Produces a single ordinary signature; the policy is off-chain and private",
                  "No on-chain footprint of who signed, which is privacy and opacity at once",
                  "No smart-contract attack surface for the wallet itself",
                  "You trust the MPC vendor's implementation and ceremony; a subtle protocol bug is catastrophic and invisible"
                ]
              }
            },
            {
              kind: "callout",
              title: "The delegatecall foot-gun that drained Bybit",
              body: "A Safe transaction has an operation field: 0 is a normal call, 1 is a delegatecall, which runs the target's code in the Safe's own storage context. The Safe's implementation pointer lives at storage slot 0. At Bybit, the compromised signing interface swapped a routine transfer for a delegatecall to attacker code that overwrote slot 0, repointing the Safe to a malicious implementation that then drained it. The multisig math was perfect; the signers approved a delegatecall they could not read. Any signing process that permits delegatecall to arbitrary targets without independent verification is one compromised screen away from this."
            },
            {
              kind: "list",
              title: "Signer hygiene that the architecture cannot provide",
              items: [
                "Signer diversity: different people, different physical locations, different hardware and software vendors, so one supply-chain compromise cannot reach a threshold",
                "Dedicated signing devices used for nothing else, reducing the malware surface on the machine that authorizes money",
                "Diversified hardware wallets so a single vendor firmware flaw does not compromise every signer at once",
                "A written signing procedure that requires independent verification of the transaction before any approval, every time, with no fast-path exception"
              ]
            },
            {
              kind: "principle",
              body: "The number of signers protects you only up to the quality of what each signer independently verifies; identical, blind signers are one screen away from being a 1-of-1."
            }
          ],
          glossary: ["safe-multisig", "mpc", "threshold-signature", "delegatecall", "signer-diversity"],
          awards: ["ch-chain-multisig-architect"]
        },
        {
          id: "ch-chain-blindsign-drill",
          kind: "drill",
          title: "The Screen Says It Is Fine",
          statement: "Every catastrophic multisig loss shares one moment: a competent signer approved a transaction they could not actually read.",
          minutes: 30,
          respect: 200,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "This is the Bybit moment, reconstructed so you feel the pull of the wrong answer. You are one of the required signers on your treasury's cold Safe. A scheduled rebalancing transfer to a known warm wallet is queued. The Safe web interface shows exactly the transfer you expected: right destination, right amount, a routine operation. Your hardware wallet, though, shows a long hash and a delegatecall you cannot decode on its small screen. The rest of the signing group has already approved, and the operations window is closing."
            }
          ],
          drill: {
            id: "ch-chain-blindsign-drill-d1",
            scene: "You are the final required signer on a cold-wallet Safe holding the bulk of the treasury. The Safe UI shows a clean, expected transfer to a known warm wallet. Your hardware wallet shows an unreadable EIP-712 hash and, if you scrutinize it, an operation type that is a delegatecall to an address you do not recognize. Every other signer has already approved. The scheduled transfer is late.",
            clock: "The operations team is asking you to approve now; the window closes in minutes.",
            pressure: "The UI matches the plan exactly, the transfer is routine, and holding it up looks like you do not trust your own team's tooling.",
            prompt: "What do you do with your signature?",
            options: [
              {
                id: "opt-sign",
                label: "Sign — the UI shows exactly the expected transfer and everyone is waiting",
                detail: "The interface is the one you always use, the destination is correct, and the team has already approved.",
                score: -3,
                outcome: "You sign a delegatecall that overwrites the Safe's implementation pointer. The treasury is drained in minutes. The UI was showing you a transfer that the signed message never contained.",
                ripple: "This is the Bybit decision, exactly. The interface is the compromised component; trusting it because it looks right is precisely the assumption the attacker engineered. The multisig gave you the power to refuse, and you spent it on the word of the one thing that was lying to you.",
                isBest: false
              },
              {
                id: "opt-verify",
                label: "Refuse to sign until you independently recompute the transaction hash and simulate the call",
                detail: "Stop, take the raw transaction, compute the EIP-712 hash off the Safe UI, confirm it matches the hash on your hardware wallet, and simulate the exact call to see what it does.",
                score: 3,
                outcome: "Independent verification shows the operation is a delegatecall to an unknown address, not the transfer the UI claims. The hashes do not correspond to a simple transfer. You halt, and the compromise of the signing interface is uncovered before any funds move.",
                ripple: "You treated the interface as untrusted and verified the thing you were actually signing, which is the one control that defeats a UI-spoofing attack. A late transfer costs nothing; this refusal is worth the entire treasury. This is the signer Bybit needed and did not have.",
                isBest: true
              },
              {
                id: "opt-colleague",
                label: "Sign, but ask a colleague to quickly sign too so it is not just you",
                detail: "More approvals feels safer under pressure.",
                score: -2,
                outcome: "You add another blind signature to a malicious transaction. Two people who both trusted the same compromised screen are no safer than one; the threshold is met and the funds are gone.",
                ripple: "This is the illusion that multisig is about counting signatures. If every signer verifies nothing and trusts the same interface, more signers is more people making the identical mistake. Diversity of verification, not quantity of approvals, is the control.",
                isBest: false
              },
              {
                id: "opt-trust-hw",
                label: "Trust the hardware wallet — it is a cold device, so whatever it shows must be safe to sign",
                detail: "The hardware signer is the secure element; if it presents the transaction, it must be fine.",
                score: -1,
                outcome: "You sign because the device asked you to. The hardware wallet faithfully signed exactly what it was given — an unreadable delegatecall — and its job was never to judge intent, only to protect the key.",
                ripple: "A hardware wallet protects the key from extraction; it does not understand or vet the transaction's meaning. Blind-signing an opaque hash on a trusted device is still blind signing. The security of the secure element is not the security of the decision.",
                isBest: false
              }
            ],
            debrief: "The pull of the wrong answer is the whole lesson. The Safe UI showing the expected transfer is not evidence — it is the compromised component, and at Bybit it displayed a clean transfer while the message being signed was a delegatecall that repointed the wallet. A multisig's security assumes each signer can accurately evaluate what they approve; the moment the interface is untrusted, only independent verification restores that assumption. The best signer recomputes the EIP-712 hash outside the Safe UI, confirms it matches the hardware device, and simulates the call to see its real effect before approving. Every alternative — trusting the screen, adding blind signers, trusting the device to judge intent — preserves the exact assumption the attacker exploited. A delayed transfer is recoverable; a signed delegatecall is not.",
            principle: "Treat the signing interface as hostile: verify the hash you are signing and simulate its effect through an independent path, or your multisig is theater."
          },
          glossary: ["blind-signing", "transaction-simulation", "eip-712", "delegatecall", "safe-multisig"],
          awards: ["ch-chain-blind-sign-refuser"]
        },
        {
          id: "ch-chain-verify-lab",
          kind: "lab",
          title: "Verify the Hash Before You Sign It",
          statement: "If you cannot independently reproduce the hash your device is asking you to sign, you are blind signing no matter how good your hardware is.",
          minutes: 36,
          respect: 180,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "The defense against a compromised signing interface is not a better interface; it is a second, independent path to compute what you are actually signing and compare. In this lab you take a Safe transaction, recompute its EIP-712 hash yourself from the raw parameters, confirm it matches what your hardware wallet displays, and simulate the call to see its real effect before anyone approves. This is the concrete control that turns the previous drill's best answer into a repeatable procedure your whole signing group can follow."
            },
            {
              kind: "code",
              lang: "bash",
              title: "Recompute the Safe transaction hash independently",
              body:
                "# Pull the exact transaction parameters from the Safe transaction service\n" +
                "# (or from the proposer), NOT from the UI you are being asked to trust.\n" +
                "# Then recompute the EIP-712 safeTxHash yourself and compare to the\n" +
                "# hash your hardware wallet is displaying. They must match exactly.\n" +
                "\n" +
                "# Community tooling exists for precisely this (safe-tx-hashes and similar).\n" +
                "# The point is a SECOND independent computation, not the Safe web app.\n" +
                "safe-tx-hashes \\\n" +
                "  --safe 0xYourSafeAddress \\\n" +
                "  --chain ethereum \\\n" +
                "  --nonce 42\n" +
                "\n" +
                "# Critically, inspect the OPERATION field in the output:\n" +
                "#   operation = 0  -> CALL       (normal transfer / contract call)\n" +
                "#   operation = 1  -> DELEGATECALL (runs target code in the Safe context)\n" +
                "# A delegatecall on a routine transfer is the Bybit red flag.\n"
            },
            {
              kind: "code",
              lang: "bash",
              title: "Decode the calldata and simulate the real effect",
              body:
                "# Decode what the calldata actually calls - do not eyeball a hash.\n" +
                "cast 4byte-decode 0xa9059cbb00000000000000000000000000000000000000000000000000\n" +
                "\n" +
                "# Simulate the full transaction against current mainnet state so you\n" +
                "# see the ACTUAL balance and storage changes it would produce.\n" +
                "# A Tenderly simulation or a local fork both work:\n" +
                "anvil --fork-url $MAINNET_RPC &\n" +
                "cast send --unlocked --from 0xYourSafe \\\n" +
                "  0xTarget 'execTransaction(...)' <args> \\\n" +
                "  --rpc-url http://127.0.0.1:8545\n" +
                "\n" +
                "# If the simulation shows storage slot 0 of the Safe changing, STOP.\n" +
                "# Slot 0 is the singleton/implementation pointer. Nothing routine\n" +
                "# should ever rewrite it.\n"
            },
            {
              kind: "checklist",
              title: "The pre-signing checklist every signer runs, every time",
              items: [
                "I obtained the raw transaction parameters from a source other than the signing UI",
                "I recomputed the EIP-712 safeTxHash independently and it matches my hardware wallet's display",
                "I confirmed the operation field is a plain call (0), or I fully understand and expect the delegatecall (1)",
                "I decoded the calldata and it is the function and arguments I expect",
                "I simulated the transaction and the balance and storage changes are exactly what was intended, with no change to slot 0",
                "No time pressure caused me to skip any step above"
              ]
            },
            {
              kind: "callout",
              title: "Why this is a group control, not a personal habit",
              body: "If only one signer verifies and the rest trust the UI, the attacker only needs the threshold-minus-one who do not. Independent verification has to be the standard every signer meets, enforced by procedure, or it protects nothing. Write it into the signing runbook, make it non-skippable, and practice it on low-value transactions so it is muscle memory before it matters."
            }
          ],
          praxis: "Build and document a pre-signing verification procedure for a Safe (real or testnet): independently recompute the safeTxHash, decode calldata, check the operation field, and simulate the effect, then run your signing group through it on a test transaction.",
          evidence: "Attach the written verification runbook, a recorded walkthrough of independently reproducing a safeTxHash and simulating a transaction, and evidence that at least one other signer executed the same steps independently.",
          glossary: ["transaction-simulation", "eip-712", "blind-signing", "safe-multisig"],
          awards: ["ch-chain-verifier"]
        },
        {
          id: "ch-chain-exchange-grade",
          kind: "lesson",
          title: "Exchange-Grade Custody and the Insider You Cannot Audit",
          statement: "Hot, warm, and cold segmentation stops the outside attacker; only dual control and least privilege stop the one you hired.",
          minutes: 32,
          respect: 150,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "An exchange holds other people's money at a scale that makes it the most valuable target in the ecosystem, and its custody architecture is a study in segmentation. The governing idea is that the amount of value reachable by any single compromise should be bounded. You do not hold everything where it can move fast; you hold almost everything where it moves slowly and with many hands, and only a working float where it moves quickly."
            },
            {
              kind: "table",
              title: "Hot, warm, cold — the segmentation that bounds the loss",
              headers: ["Tier", "Connectivity", "Holds", "Control"],
              rows: [
                ["Hot", "Online, automated signing", "A small operational float for withdrawals", "Rate limits, allowlists, anomaly detection; assume it can be lost"],
                ["Warm", "Semi-online, human in the loop", "Working reserves to refill hot", "Multisig or MPC with human approval per movement"],
                ["Cold", "Offline, air-gapped, geographically split", "The overwhelming majority of assets", "Deep multisig, dual control, ceremony-based signing, slow by design"]
              ]
            },
            {
              kind: "list",
              title: "The controls that make segmentation real",
              items: [
                "Withdrawal allowlists: funds can only leave to pre-approved addresses, so a compromised hot system cannot invent a destination",
                "Dual control and separation of duties: no single person can both initiate and approve a movement, and the person who onboards an address cannot also authorize a withdrawal to it",
                "Proof of reserves paired with proof of liabilities: reserves alone can be faked by borrowing funds to pass an audit, so solvency requires proving what you owe as well as what you hold",
                "Least privilege on the support and operations layer, because that is where the human attack lands"
              ]
            },
            {
              kind: "callout",
              title: "Coinbase 2025: the insider the perimeter never sees",
              body: "In May 2025 Coinbase disclosed that attackers had bribed overseas third-party support contractors to exfiltrate the personal data of roughly 70,000 customers. No cold-wallet was breached and no contract was exploited; the compromise was human, at the support layer, and the company estimated remediation and reimbursement at between 180 and 400 million dollars while refusing a 20 million dollar ransom. The lesson is that custody segmentation protects the coins, but the insider threat routes around it through the people and the data, and dual control plus least privilege on the human layer is the only thing that bounds it."
            },
            {
              kind: "prose",
              title: "Why proof of reserves alone is theater",
              body: "As Vitalik Buterin argues, an exchange proving it holds assets says nothing about what it owes. Two exchanges can shuttle the same funds between them to each pass a reserve check while both are insolvent. Real solvency requires proof of liabilities too — a Merkle-sum tree of customer balances, ideally with zero-knowledge proofs so it does not leak every customer's holdings — and even then, a point-in-time proof can be gamed by borrowing around the audit. Treat a lone proof-of-reserves banner as marketing until the liabilities side and the timing are addressed."
            },
            {
              kind: "principle",
              body: "Segment custody so no single compromise reaches everything, and assume the highest-privilege human is a threat you design against, not a person you trust."
            }
          ],
          glossary: ["hot-cold-segmentation", "withdrawal-allowlist", "dual-control", "insider-threat", "proof-of-reserves"],
          awards: ["ch-chain-custody-designer"]
        },
        {
          id: "ch-chain-insider-drill",
          kind: "drill",
          title: "The Emergency Withdrawal Outside the Allowlist",
          statement: "The controls that matter are the ones that hold when a powerful person, under real urgency, asks you to skip them.",
          minutes: 24,
          respect: 190,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Controls are easy to honor when nothing is happening. They are tested the moment someone senior, in a real hurry, with a plausible story, asks you to make an exception. This is the shape of the insider and social-engineering attack: not a hacker at a keyboard, but a pressured human choosing whether the allowlist and dual control are real rules or suggestions. You run treasury operations. The request feels legitimate and the pressure is genuine."
            }
          ],
          drill: {
            id: "ch-chain-insider-drill-d1",
            scene: "You operate treasury withdrawals under a strict allowlist and dual control. A message arrives from the CFO's account: a time-sensitive OTC deal requires an immediate large transfer to a new counterparty address, not yet on the allowlist. The CFO is traveling, cannot get to a signing device, and asks you to push it through this once and add the address after. The tone is urgent and irritated at any delay.",
            clock: "The CFO says the deal collapses in 30 minutes.",
            pressure: "Refusing the CFO under a real deadline feels career-limiting, and the request is internally plausible.",
            prompt: "How do you respond to the request?",
            options: [
              {
                id: "opt-exception",
                label: "Make the one-time exception and add the address to the allowlist afterward",
                detail: "It is the CFO, the deal is real, and the process allows for adding addresses.",
                score: -3,
                outcome: "You bypass the allowlist and dual control on the word of an account you did not verify. If that account is compromised or the CFO is being socially engineered, the funds are gone to an attacker-controlled address, permanently.",
                ripple: "This is the exact opening that insider and business-email-compromise attacks are built to create: authority plus urgency plus a plausible story to make you skip the control. An allowlist you can be talked out of is not a control. The 30-minute deadline is the weapon.",
                isBest: false
              },
              {
                id: "opt-verify-channel",
                label: "Refuse to bypass the controls; verify the request out-of-band and route it through the normal allowlist and dual-control process",
                detail: "Confirm the request with the CFO through a second, known channel, and if genuine, run the address through the standard onboarding and dual approval, deadline notwithstanding.",
                score: 3,
                outcome: "You call the CFO on a known number. Either it is genuine and goes through the real process, or it was a compromised account or a spoof, and you just stopped a theft. Either way, the controls held and the funds are safe.",
                ripple: "You treated urgency plus authority as the attack signature it usually is, and used an independent channel to verify. A missed OTC deal is a business cost; a bypassed allowlist to an attacker address is an unrecoverable loss. The control is only real because you enforced it when it was hard.",
                isBest: true
              },
              {
                id: "opt-partial",
                label: "Send a smaller amount now to be safe and the rest after verification",
                detail: "Split the difference to reduce exposure while still helping.",
                score: -1,
                outcome: "You still send funds to an unverified, non-allowlisted address, just fewer of them. If it is an attack, you have confirmed a working path and lost real money; the attacker will happily take the smaller amount and come back.",
                ripple: "Partial compliance with a control bypass is still a control bypass. The size of the transfer is not the issue; sending anything to an unverified destination outside the allowlist is the failure. You cannot half-enforce a rule whose entire value is that it is absolute.",
                isBest: false
              },
              {
                id: "opt-escalate-only",
                label: "Refuse and escalate to your manager, but take no verification step yourself",
                detail: "Push the decision up the chain and wait.",
                score: 1,
                outcome: "You correctly decline to bypass the control, but by only escalating you may hand the same pressured decision to someone else without the out-of-band verification that actually resolves it, and the clock keeps running.",
                ripple: "Not bypassing is right, and escalation is reasonable, but the decisive action is independent verification through a known channel. Escalation without verification can just relocate the same social-engineering pressure to the next person up.",
                isBest: false
              }
            ],
            debrief: "The tempting answer is the exception, because refusing a senior executive under a real deadline feels insubordinate and risky to your career. That feeling is precisely the lever the attack pulls. Authority plus urgency plus a plausible story, aimed at getting you to skip a control, is the signature of business-email-compromise and insider-enabled theft, and the Coinbase 2025 breach showed how far attackers will go to place a pressured human in the loop. The control — allowlist and dual control — exists so that no single request, however senior or urgent, can move funds to an unverified destination. The professional move is to refuse the bypass and verify out-of-band through a known channel: this catches the compromised or spoofed request and lets a genuine one proceed through the real process. A dead deal is survivable; an irreversible transfer to an attacker is not.",
            principle: "A control that bends under authority and urgency was never a control; verify high-pressure requests out-of-band and let the process hold, especially when it is hard."
          },
          glossary: ["withdrawal-allowlist", "dual-control", "insider-threat", "hot-cold-segmentation"],
          awards: ["ch-chain-control-holder"]
        }
      ]
    },
    {
      id: "pg-chain-governance",
      title: "The War Room With No Undo",
      credential: "STEPSAFE Certified — DAO Governance and On-Chain Incident Response",
      summary: "You cannot roll back a blockchain, so containment means something different here, and this Page teaches what. It covers governance as an attack surface — flash-loan vote capture, the centralization tradeoff of guardians and emergency pause, timelocks as a defensive delay — and a real treasury-governance model in the Dash masternode DAO, where proposal review is itself a security function. It closes with the two hardest things in the field: the decision to pull a pause key while funds drain, and the war-room communication with a board, a community, and possibly the attacker while it happens. You leave able to govern a treasury and run an incident where undo does not exist.",
      competencies: [
        "Redefine containment for an immutable ledger: bounding future damage rather than reversing past damage",
        "Analyze governance attacks including flash-loan vote capture, and defend with checkpointed voting, timelocks, and guardians",
        "Weigh the centralization tradeoff of emergency pause and guardian powers against their necessity in a live incident",
        "Reason about a real treasury-governance model — Dash masternode voting and superblocks — and treat proposal review as security",
        "Lead on-chain incident response and war-room communication with boards, communities, and attackers under irreversibility"
      ],
      seal: "The Frozen War Room",
      steps: [
        {
          id: "ch-chain-no-rollback",
          kind: "construct",
          title: "Containment When There Is No Undo",
          statement: "On-chain you cannot reverse the theft, so incident response is entirely about bounding what has not happened yet.",
          minutes: 18,
          respect: 90,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Every incident-response playbook you learned assumes you can contain, eradicate, and recover — isolate the host, remove the malware, restore from backup. On-chain, the ledger is immutable and the drained funds are gone finally. Containment cannot mean undoing the theft; it can only mean stopping the next transaction, protecting the funds not yet taken, and shaping what happens after. NIST SP 800-61 Revision 3 reframes incident response as a profile across the CSF 2.0 functions rather than a linear cleanup, and that reframing fits here exactly, because on-chain the Respond and Recover work is about the future state, never the past one."
            },
            {
              kind: "principle",
              body: "You cannot recover the stolen block; you can only change every block after it, so on-chain incident response is a forward-looking discipline entirely."
            },
            {
              kind: "compare",
              title: "What containment means, web2 vs. on-chain",
              left: {
                title: "Traditional incident response",
                items: [
                  "Isolate and reimage the compromised host",
                  "Reverse fraudulent transactions",
                  "Restore data from backup",
                  "Recovery returns you to the prior state"
                ]
              },
              right: {
                title: "On-chain incident response",
                items: [
                  "Pause or upgrade to stop the next drain, if you can",
                  "The stolen funds are final; no reversal exists",
                  "There is no backup of ledger state to restore",
                  "Recovery is negotiation, redeployment, and making users whole from elsewhere"
                ]
              }
            },
            {
              kind: "callout",
              title: "The uncomfortable implication",
              body: "Because you cannot undo, the value of every control shifts forward in time. Prevention and the ability to halt are worth vastly more than any response capability, because response cannot give the money back. This is why the pause key, the timelock, and the monitoring that buys you minutes are the crown jewels of on-chain IR — they are the only levers that act before the irreversible has finished happening."
            }
          ],
          glossary: ["emergency-pause", "timelock", "guardian", "csf"],
          awards: ["ch-chain-no-undo"]
        },
        {
          id: "ch-chain-governance-attacks",
          kind: "lesson",
          title: "Capturing a Protocol Through Its Own Rules",
          statement: "Governance is executable code with the highest privileges in the system, and every defense against capturing it trades decentralization for safety.",
          minutes: 30,
          respect: 150,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "The most elegant attacks do not break the rules; they follow them to a hostile conclusion. Governance is the mechanism that can change everything about a protocol, which makes capturing governance equivalent to owning the protocol. Beanstalk is the archetype: the attacker did nothing illegal by the protocol's logic. They acquired a supermajority of voting weight with a flash loan and executed their own proposal through the emergency path, in a single block, all perfectly within the rules as written."
            },
            {
              kind: "numbered",
              title: "Why Beanstalk was capturable, and the fixes it forced",
              items: [
                "Voting weight was measured instantaneously, so a flash loan could buy a two-thirds supermajority for one block without ever holding it — the fix is checkpointed voting weight measured from a past block the attacker cannot retroactively acquire.",
                "The emergencyCommit path let a supermajority execute a 24-hour-old proposal immediately — the fix is a timelock on execution so that even a passed proposal cannot act until a delay has elapsed and people can react.",
                "The malicious proposal sat behind a decoy Ukraine-donation proposal to look benign — the fix is proposal review as a first-class security function, with humans reading exactly what executable governance actions do before they can pass.",
                "There was no circuit breaker between passage and irreversible execution — the fix is a guardian able to veto or pause a malicious proposal inside the timelock window."
              ]
            },
            {
              kind: "table",
              title: "The defensive controls and what each one costs",
              headers: ["Control", "What it prevents", "The centralization it introduces"],
              rows: [
                ["Checkpointed voting", "Flash-loan supermajorities", "Little; mostly a design correctness fix"],
                ["Timelock on execution", "Instant execution of a hostile proposal", "Slower governance; every legitimate change is delayed too"],
                ["Guardian / veto", "A passed malicious proposal from executing", "A privileged party who can block the community's decisions"],
                ["Emergency pause", "Ongoing drain during an active exploit", "A small set of humans who can unilaterally freeze the protocol"]
              ]
            },
            {
              kind: "callout",
              title: "The tradeoff you can never fully resolve",
              body: "Every one of these controls concentrates power to move faster than an attacker, and that same power can be abused or compromised. A guardian who can veto a malicious proposal can also veto a legitimate one; a pause key that stops a drain can also freeze users' funds or be turned against them if the key is captured. There is no design that is both fully decentralized and able to stop a live attack in seconds. Mature protocols choose a deliberate point on that spectrum and are honest with their community about where they stand and why.",
              source: "The guardian and pause tradeoff, generalized from Beanstalk and others"
            },
            {
              kind: "principle",
              body: "Governance defenses buy reaction time by concentrating power; the engineering is not eliminating that tradeoff but choosing and disclosing where you sit on it."
            }
          ],
          glossary: ["governance-capture", "flash-loan", "timelock", "guardian", "emergency-pause"],
          awards: ["ch-chain-governance-guardian"]
        },
        {
          id: "ch-chain-dash-treasury",
          kind: "lesson",
          title: "A Treasury That Governs Itself: The Masternode Model",
          statement: "A DAO treasury's real security control is not the smart contract but the humans who read every proposal before it can spend.",
          minutes: 30,
          respect: 150,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Not every treasury is a Solidity contract with a pause key. Dash runs a decentralized governance-by-blockchain model that has funded itself on-chain for years, and it is worth studying as a concrete, live alternative. A share of every block reward is directed not to miners but to a treasury, and the network's masternodes — nodes that have posted a large collateral stake — vote directly on which proposals that treasury funds. The collateral is the security assumption: attacking the vote means acquiring and locking enormous stake, which is expensive and self-defeating if it destroys the value you are attacking."
            },
            {
              kind: "table",
              title: "The Dash treasury governance mechanics",
              headers: ["Mechanism", "How it works (per the Dash documentation)"],
              rows: [
                ["Funding source", "A protocol-defined share of block rewards is reserved for the treasury rather than paid to miners"],
                ["Voters", "Masternodes, each backed by a large locked collateral, cast yes / no / abstain votes"],
                ["Passing threshold", "A proposal passes when net approval, yes votes minus no votes, exceeds ten percent of the masternode count"],
                ["Payout cadence", "Approved proposals are funded at superblocks, which occur roughly every 16,616 blocks, about a month apart"],
                ["Anti-spam", "Creating a proposal requires burning a fee, so flooding the system with proposals has a real cost"],
                ["Voting cutoff", "Voting closes a set number of blocks before the superblock, after which the network tallies and validates the result on-chain"]
              ]
            },
            {
              kind: "callout",
              title: "Proposal review is the security function",
              body: "The technical mechanism only decides which proposals get money; it says nothing about whether a proposal is honest, competent, or a slow rug. In a masternode treasury, that judgment is the masternode operators reading proposals and voting, and in any DAO treasury the analogous human review is the real control. A treasury with flawless voting cryptography and no serious proposal scrutiny will fund its own attackers politely and on schedule. Social-layer attacks — a credible-looking team, a plausible deliverable, a proposal that quietly routes funds — target exactly this human gap, not the vote counting."
            },
            {
              kind: "list",
              title: "How social-layer treasury attacks actually work",
              items: [
                "A proposer builds reputation with small honest deliverables, then submits a large proposal that trades on that trust",
                "A proposal bundles a reasonable-looking action with a subtle transfer or permission change, betting voters skim rather than read",
                "Voter apathy and low turnout let a small coordinated group clear a low net-yes threshold",
                "Time pressure near a voting cutoff is used to rush a proposal past scrutiny"
              ]
            },
            {
              kind: "principle",
              body: "Design the voting mechanism to resist capture, but staff the proposal review as if it were the primary control, because for a treasury it is."
            }
          ],
          glossary: ["masternode", "superblock", "governance-capture", "proposal-review"],
          awards: ["ch-chain-treasury-steward"]
        },
        {
          id: "ch-chain-pause-drill",
          kind: "drill",
          title: "The Pause Key While the Funds Drain",
          statement: "The moment you most need to act decisively is the moment your community's principles most demand you do not.",
          minutes: 26,
          respect: 200,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Monitoring just fired: an exploit is draining your protocol in real time, and it is accelerating. You are one of the guardians holding an emergency pause key that can halt the protocol immediately. Pausing stops the bleeding but freezes every honest user's funds, hands your critics proof that the protocol was never really decentralized, and cannot be undone quickly. Not pausing keeps faith with your decentralization principles while the treasury empties. You have seconds to decide, and every option has a permanent cost."
            }
          ],
          drill: {
            id: "ch-chain-pause-drill-d1",
            scene: "An active exploit is draining your lending protocol, roughly a large fraction of TVL already gone and the rate increasing. You hold one of the guardian keys for an emergency pause that halts all protocol functions instantly. The community has always been vocal that guardian powers are a necessary evil to be used sparingly, and pausing will freeze legitimate users along with the attacker.",
            clock: "Funds are leaving every block; you have perhaps a minute of meaningful decision time.",
            pressure: "Pausing will be read by part of the community as proof the protocol was centralized theater, and you will own that decision publicly.",
            prompt: "What do you do with the pause key?",
            options: [
              {
                id: "opt-pause",
                label: "Pause immediately, then coordinate the response and communicate why",
                detail: "Halt the protocol now to stop the ongoing drain, accept the freeze on honest users as the lesser harm, and open communications immediately.",
                score: 3,
                outcome: "The drain stops. Honest users are frozen and upset, but their funds are still there to be unfrozen. You have bought the time to assess, coordinate a whitehat rescue of remaining funds, and plan remediation, at the cost of a hard conversation about centralization.",
                ripple: "You correctly valued irreversible loss above reversible inconvenience. A freeze can be lifted; a drained treasury cannot be refilled. The pause key exists for exactly this moment, and using it decisively — then owning the tradeoff publicly — is what the power is for. The centralization critique is real and answerable; the lost funds would not have been.",
                isBest: true
              },
              {
                id: "opt-wait-vote",
                label: "Do not use the guardian power; convene an emergency governance vote to decide",
                detail: "Honor decentralization by letting the community vote on whether to pause.",
                score: -3,
                outcome: "Governance cannot move in the seconds you have. By the time any vote could resolve, the protocol is fully drained. You preserved a principle and lost all the funds it was meant to protect.",
                ripple: "This is decentralization theater at the cost of the treasury. Governance is deliberately slow; an active exploit is deliberately fast. Refusing a control that exists precisely for irreversible emergencies, in the name of process, is how principled teams lose everything. The vote should decide whether guardians keep the power, not whether to use it mid-drain.",
                isBest: false
              },
              {
                id: "opt-rescue",
                label: "Skip the pause and try to whitehat-rescue the remaining funds ahead of the attacker",
                detail: "Race the attacker with your own transactions to move remaining funds to safety without freezing users.",
                score: -1,
                outcome: "You enter a live MEV race against an attacker who may be faster, better-positioned, and watching the mempool. Sometimes it works; often the attacker front-runs your rescue or the complexity costs you the minute you needed to just pause.",
                ripple: "Heroic rescues have their place, but as the first move against an accelerating drain they gamble the certain control (pause) on an uncertain race. A whitehat rescue is a strong second step after you have stopped the bleeding, not a substitute for the halt that is guaranteed to work.",
                isBest: false
              },
              {
                id: "opt-upgrade",
                label: "Push an emergency upgrade to patch the bug without pausing",
                detail: "Deploy a fix to the vulnerable contract live while it is under attack.",
                score: -2,
                outcome: "An upgrade under fire is slow, risky, and can introduce a storage collision or new bug at the worst possible moment; meanwhile the drain continues through the entire deploy-and-verify window.",
                ripple: "Upgrading mid-exploit is the highest-risk path: you are writing and shipping critical code under maximum pressure while funds leave. Pause first to stop the clock, then fix carefully. An upgrade is the recovery step, not the containment step.",
                isBest: false
              }
            ],
            debrief: "The seductive wrong answer is deferring to a governance vote, because it is the most principled-sounding and protects you from owning a controversial call. But it fatally misreads the physics: governance is slow by design and an exploit is fast by design, so a vote during an active drain simply guarantees total loss while you honor a process. On an immutable ledger the entire value hierarchy shifts toward stopping the irreversible, and a pause freezes funds reversibly while a drain removes them permanently. The best move pauses immediately, accepts the freeze as the lesser and undoable harm, and then does the harder political work of explaining the tradeoff and, in parallel, attempting a whitehat rescue and a careful fix. The guardian power is uncomfortable precisely because it exists for the moment when decentralization and survival conflict; the job is to use it correctly and be accountable for it, not to abdicate it to a process that cannot act in time.",
            principle: "In a live drain, choose the reversible harm over the irreversible one; a freeze can be lifted, a drained treasury cannot, and deferring to slow process is a decision to lose."
          },
          glossary: ["emergency-pause", "guardian", "governance-capture", "reorg"],
          awards: ["ch-chain-pause-decider"]
        },
        {
          id: "ch-chain-war-room-council",
          kind: "council",
          title: "The War Room: Board, Community, and the Attacker",
          statement: "During a live incident you are running three negotiations at once, and silence in any of them is a decision with consequences.",
          minutes: 30,
          respect: 170,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "A live on-chain incident is not only a technical event; it is three simultaneous conversations under maximum scrutiny. You are briefing a board or leadership who want to know exposure and legal risk. You are communicating with a community watching the drain on a block explorer in real time and deciding whether to panic. And you may be negotiating, on-chain or through intermediaries, with the attacker themselves. Each audience needs different words at a different cadence, and the temptation to go silent until you know everything is itself a costly choice, because the block explorer never goes silent."
            },
            {
              kind: "table",
              title: "Three audiences, three postures",
              headers: ["Audience", "What they need", "The failure mode"],
              rows: [
                ["Board / leadership", "Bounded exposure, legal and regulatory posture, the decisions you need from them", "Drowning them in technical detail, or hiding the severity until it is worse"],
                ["Community / users", "Acknowledgment, honest status, what is safe, and cadence they can rely on", "Silence that reads as coverup, or false reassurance that later proves wrong"],
                ["Attacker", "A credible whitehat path: a bounty, a deadline, and a way to return funds", "Threats you cannot enforce, or an offer with no realistic path to comply"]
              ]
            },
            {
              kind: "prose",
              title: "Negotiating with the attacker without lying to anyone",
              body: "A recurring, sometimes successful on-chain move is the public whitehat offer: acknowledge the exploit on-chain, offer the attacker a meaningful bounty to return the bulk of the funds, and set a clear deadline before involving law enforcement. Euler Finance, after a roughly 197 million dollar exploit in 2023, ultimately recovered the vast majority of funds through exactly this kind of negotiated return. The offer only works if it is credible: a bounty large enough to tempt, a genuine path to keep some funds and avoid pursuit, and consistency between what you tell the attacker and what you tell your community and the regulators. The moment those messages diverge, all three negotiations collapse."
            },
            {
              kind: "callout",
              title: "The cadence discipline that holds a community",
              body: "In the first hour, the content of your updates matters less than the fact of them. A simple we are aware, funds in X are safe, next update in 30 minutes, on time, every time, buys you more trust than a single perfect statement delivered after two hours of silence. Set an interval and hit it even when the update is we still do not know. Predictability is the thing a frightened community can hold onto, and it is entirely within your control when almost nothing else is."
            },
            {
              kind: "principle",
              body: "Run all three conversations on a reliable cadence and keep them consistent with each other; the fastest way to lose an incident is to let your messages to the board, the community, and the attacker contradict one another."
            }
          ],
          glossary: ["emergency-pause", "guardian", "insider-threat", "loss-attribution"],
          awards: ["ch-chain-war-room-lead"]
        },
        {
          id: "ch-chain-ir-runbook-field",
          kind: "field",
          title: "Write the On-Chain Incident Runbook Before You Need It",
          statement: "The plan you write calmly today is the only thing that will function when the treasury is draining and you have sixty seconds.",
          minutes: 40,
          respect: 210,
          trust: 14,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "The pause drill and the war room are unwinnable if you are improvising the mechanics under fire. The deliverable that makes them winnable is a written on-chain incident-response runbook, produced in advance, for a real protocol or treasury. It names who holds which emergency power, exactly how to invoke it, who communicates to whom on what cadence, and what the whitehat-negotiation posture is. This is the single most senior artifact you can put on your Praxis Profile from this chapter, because it is the thing an actual CISO of an on-chain organization is judged by."
            },
            {
              kind: "numbered",
              title: "What the runbook must contain",
              items: [
                "The emergency-power inventory: every pause, guardian, upgrade, and freeze capability, who holds the keys, the threshold, and the exact command or transaction to invoke each one.",
                "Detection-to-action: what monitoring signals trigger the runbook, who is authorized to declare an incident, and the decision tree for pause-versus-rescue-versus-upgrade under the irreversibility principle.",
                "The communications matrix: named roles for board, community, and regulator updates, the cadence commitment, and pre-drafted holding statements for the first fifteen minutes.",
                "The whitehat-negotiation posture: a pre-agreed bounty framework and deadline structure, so you are not inventing terms mid-crisis, plus the legal and law-enforcement escalation path.",
                "The post-incident plan: how remaining funds are secured, how users are made whole if possible, and how the root cause feeds back into prevention — the Recover and Govern loop from the CSF framing."
              ]
            },
            {
              kind: "callout",
              title: "The test that proves the runbook is real",
              body: "A runbook nobody has rehearsed is a document, not a capability. The evidence that matters is a tabletop exercise: walk the whole team through a simulated live drain against this runbook and record where it broke — the key holder who was unreachable, the command nobody had actually run, the communications role with no backup. A runbook that survives one honest tabletop is worth more than ten that were only ever written."
            }
          ],
          praxis: "Author a complete on-chain incident-response runbook for a real or realistically-modeled protocol or treasury, then run at least one tabletop exercise against it and revise it based on what broke.",
          evidence: "Attach the runbook (emergency-power inventory, decision tree, communications matrix, whitehat posture, and recovery plan) and a written after-action report from the tabletop exercise listing the gaps found and the fixes applied.",
          glossary: ["emergency-pause", "guardian", "timelock", "csf", "masternode"],
          awards: ["ch-chain-runbook-author", "ch-chain-incident-commander"]
        }
      ]
    }
  ]
};
