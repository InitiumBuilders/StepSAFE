import type { Term } from "./schema";

/* StepGuides :: GLOSSARY C — Chain, Decentralized Infrastructure, AI, Intuition.
   The shared vocabulary. Every entry teaches the mechanism, not just the label. */

export const TERMS: Term[] = [
  /* ---------- Chain security ---------- */
  {
    id: "reentrancy",
    term: "Reentrancy",
    domain: "Chain security",
    short: "An external call hands control to code you do not own while your own invariants are still false.",
    long: "A contract calls out to an address it does not control. That address is code, and code can call back in. If the second entry reads state that the first entry has not yet written, the contract answers from a stale world: balance still full, flag still unset, allowance still intact. The structural fix is Checks-Effects-Interactions — validate inputs, write every piece of your own state, and only then make the external call. Reentrancy guards are a mutex bolted over the symptom; they do not stop cross-function reentrancy (re-entering a different function that shares the same storage) or read-only reentrancy, where an attacker re-enters a view function that a third protocol trusts as an oracle.",
    why: "Reentrancy is the purest lesson that a trust boundary is a call boundary. Once you hold it, you stop asking it about Solidity and start asking it about every system you own: where do we yield control to a third party while our accounting is mid-flight? That question finds bugs in payment reconciliation, webhook handlers, and agent tool loops, not just in smart contracts.",
    related: ["flash-loan", "blast-radius", "transaction-simulation", "confused-deputy"],
    mode: "both"
  },
  {
    id: "flash-loan",
    term: "Flash Loan",
    domain: "Chain security",
    short: "Uncollateralized borrowing that must be repaid inside the same transaction, so atomicity is the only collateral.",
    long: "A flash loan lends an arbitrary amount with one condition: if the funds are not returned before the transaction ends, the whole transaction reverts and the loan never happened. That makes capital free to rent and removes the attacker cost model most protocols implicitly assume. An adversary with no balance sheet can, for one atomic block of execution, hold more of an asset than most treasuries. Flash loans are not themselves an exploit; they are an amplifier that converts any capital-weighted assumption into an immediately exploitable one. Almost every large flash-loan incident is really an oracle bug, a governance bug, or a rounding bug that only became reachable at scale.",
    why: "It kills the phrase an attacker would need millions of dollars to do that. Any control whose safety depends on the attacker being poor is already broken. A leader uses flash loans as a stress lens over the whole design: which of our invariants only hold because we assume bounded adversary capital?",
    related: ["oracle-manipulation", "mev", "reentrancy", "governance-capture"],
    mode: "both"
  },
  {
    id: "oracle-manipulation",
    term: "Oracle Manipulation",
    domain: "Chain security",
    short: "Moving the price source rather than breaking the protocol that reads it.",
    long: "A protocol that reads an instantaneous spot price from a single on-chain pool is trusting a number an attacker can rent for one transaction. Push the pool far out of balance with borrowed capital, take a loan against the distorted valuation, unwind, repay. Nothing in the lending contract was buggy; its input was. Mitigations trade freshness for manipulation cost: a time-weighted average price makes the attacker hold the distortion across many blocks; a decentralized oracle network aggregates independent reporters and publishes on a deviation threshold or a heartbeat, so the on-chain value updates when the off-chain value moves past a set percentage or when a maximum interval elapses. Every one of those choices is a tunable an attacker will read.",
    why: "Oracle manipulation teaches that the security perimeter includes everything your decision logic reads, not just the code you wrote. It is the on-chain form of a truth that applies to SIEM rules, fraud models, and autoscaling: control the input, control the output. Ask of every automated decision, who can move this signal, and how much does moving it cost them?",
    related: ["flash-loan", "mev", "bridge-trust-model", "data-availability"],
    mode: "both"
  },
  {
    id: "mev",
    term: "MEV (Maximal Extractable Value)",
    domain: "Chain security",
    short: "Value a block producer can capture by choosing what to include, exclude, and in what order.",
    long: "MEV is the profit available from sequencing power itself, above the block reward and fees. Searchers scan the mempool for extractable opportunities: cross-venue arbitrage, liquidations, and user trades worth front-running or sandwiching. Proposer-builder separation splits the roles so that specialized builders assemble ordered bundles and bid for inclusion while the proposer only picks the highest bid, which limits proposer centralization pressure but concentrates power in builders and relays. The second-order effects are the ones that matter to a defender: when the MEV in a block exceeds the block reward, validators have an economic reason to reorganize the chain, and private orderflow relationships quietly become a censorship channel.",
    why: "MEV is the clearest real-world proof that ordering is a privilege and privilege is an attack surface. Every queue you operate — payment batches, job schedulers, alert triage, ticket routing — has an MEV analogue, and the party who controls order can extract from the parties who do not. Naming it lets you design ordering fairness deliberately instead of inheriting whatever your infrastructure happens to do.",
    related: ["sandwich-attack", "sequencer", "censorship-resistance", "chain-reorganization"],
    mode: "both"
  },
  {
    id: "sandwich-attack",
    term: "Sandwich Attack",
    domain: "Chain security",
    short: "Buy in front of a visible trade, let it move the price, sell behind it.",
    long: "A searcher sees a pending swap large enough to move a pool, places a buy immediately before it and a sell immediately after, and pockets the slippage the victim generated. Unlike atomic arbitrage the sandwich is not risk-free: the two legs are separate transactions, and a victim transaction that reverts or a competing bundle can leave the attacker holding the position. Defenses are all about denying the preconditions — tight slippage limits, private orderflow so the trade never hits a public mempool, batch auctions that clear many orders at one uniform price, and commit-reveal schemes that hide intent until ordering is fixed.",
    why: "The sandwich is the canonical example of an attack made possible purely by disclosure timing. Nothing was stolen; the victim's own intention was used against them because it was visible before it was final. Security leaders should hunt for the same shape wherever the organization broadcasts intent early: pre-announced maintenance windows, published bug bounty scopes, staged rollouts visible in DNS.",
    related: ["mev", "sequencer", "transaction-simulation"],
    mode: "motus"
  },
  {
    id: "proxy-storage-collision",
    term: "Proxy Storage Collision",
    domain: "Chain security",
    short: "An upgrade that shifts storage slots so the new logic reads the old contract's variables as the wrong thing.",
    long: "In a proxy pattern the state lives in the proxy and the logic lives in an implementation contract reached by delegatecall. Slots are assigned by declaration order, so reordering variables, changing a type, removing one, or inserting a new variable into a shared base contract silently repoints the new code at the old bytes. An address becomes a balance. A boolean becomes an owner. Standard defenses are storage gaps in base contracts, fixed unstructured slots for proxy metadata under ERC-1967, and namespaced storage under ERC-7201 that hangs each contract's state off a hashed namespace so inheritance changes cannot shift it. A related failure is leaving the implementation contract uninitialized so anyone can claim it, which is why _disableInitializers belongs in the implementation constructor.",
    why: "This is the most expensive kind of bug in existence: correct code, correct tests, catastrophic behavior, and nothing in the diff looks wrong. It teaches a leader to demand that upgrade paths get their own review discipline separate from feature review — layout diffs, storage-layout CI checks, and a rehearsal on a fork before the mainnet upgrade.",
    related: ["timelock", "guardian", "governance-capture", "blast-radius"],
    mode: "motus"
  },
  {
    id: "eip-712",
    term: "EIP-712",
    domain: "Chain security",
    short: "A standard for hashing and signing typed structured data so a wallet can show a human what they are approving.",
    long: "Instead of signing an opaque digest, the signer signs a structure whose type is declared and whose fields can be rendered. The payload is the byte prefix 0x1901, then a domain separator, then the hash of the typed struct. The domain separator carries name, version, chainId, verifyingContract, and an optional salt, which is what scopes the signature: an identical struct signed for one contract cannot be replayed against another, and a mainnet signature cannot be replayed on a fork or testnet with the same addresses. EIP-712 does not give you nonce-based replay protection inside the application; you still have to implement that.",
    why: "EIP-712 is a case study in how a protocol-level format change moves the security burden off the user. The lesson generalizes far past chains: when your system asks a human to approve something, the approval UI is a control, and an unreadable approval is a failed control. Push for structured, renderable authorization objects anywhere your organization asks people to click yes.",
    related: ["blind-signing", "transaction-simulation", "multisig", "infinite-approval"],
    mode: "both"
  },
  {
    id: "blind-signing",
    term: "Blind Signing",
    domain: "Custody",
    short: "Authorizing a payload you cannot read, so the signature is delegated trust in whatever produced the bytes.",
    long: "A hardware wallet that shows only a hex digest, or an operator who approves a transaction whose calldata the device cannot decode, is signing on faith in the host machine. Every large multisig compromise of the recent era has this shape: the signing key was never stolen, the signer was shown one thing and signed another, usually because a compromised front end or a malicious delegatecall target supplied the payload. Removing blind signing means end-to-end clear signing — typed data the device can render, contract ABIs the device knows, and an independent verification path that does not run on the machine that composed the transaction.",
    why: "Blind signing is where key security and human factors meet, and it is where most real crypto losses now occur. It reframes the custody problem: protecting the key is table stakes, protecting the meaning of the signature is the actual job. The same principle governs any approval workflow that renders a summary produced by the untrusted party.",
    related: ["eip-712", "transaction-simulation", "hardware-security-module", "multisig"],
    mode: "both"
  },
  {
    id: "transaction-simulation",
    term: "Transaction Simulation",
    domain: "Custody",
    short: "Executing a transaction against forked state first, to see the balance and permission changes it would actually cause.",
    long: "Simulation runs the exact calldata against a fork of current chain state and returns the resulting state diff: which balances move, which approvals are granted, which storage slots change, which contracts are touched. It converts an approval decision from reading intent to reading effect, which is the only reading that matters. Its limits are real and should be stated to executives: simulation reflects the state at simulation time, so a transaction sandwiched, reordered, or executed after an attacker-controlled state change can behave differently, and a malicious contract can branch on block number, caller, or gas to behave benignly under simulation.",
    why: "Simulation is the highest-leverage single control you can add to a treasury or DAO operations process, because it defeats the entire class of attacks in which the signer is deceived about effect. Insist that it runs on independent infrastructure from the tool that proposed the transaction; a simulator and a proposer sharing a compromise is one control, not two.",
    related: ["blind-signing", "eip-712", "safe-module", "infinite-approval"],
    mode: "both"
  },
  {
    id: "infinite-approval",
    term: "Infinite Approval",
    domain: "Chain security",
    short: "Granting a contract unlimited spending rights on a token so its future compromise becomes your loss.",
    long: "Token standards separate approval from transfer, and interfaces commonly request the maximum uint256 allowance so the user never has to approve again. That allowance persists indefinitely and is enforced by the token contract, not by the spender, so it survives the spender being upgraded, exploited, or having its admin key stolen. The exposure is not the balance you had when you approved; it is every balance you will ever hold in that wallet for as long as the allowance stands. Mitigations are bounded allowances per interaction, permit-style signed approvals with expiry, periodic allowance revocation sweeps, and segregating the wallets that interact with unaudited contracts.",
    why: "This is standing privilege with no expiry — the same defect as a long-lived cloud access key or a service account with wildcard IAM. Teaching it in token terms makes the generic lesson land: every grant needs a scope and a clock, and an inventory of grants is as important as an inventory of assets.",
    related: ["eip-712", "transaction-simulation", "blast-radius", "address-poisoning"],
    mode: "novus"
  },
  {
    id: "address-poisoning",
    term: "Address Poisoning",
    domain: "Custody",
    short: "Seeding a victim's transaction history with a lookalike address so a future copy-paste sends funds to the attacker.",
    long: "The attacker generates a vanity address whose first and last characters match one the victim uses, then sends a zero-value or dust transfer to the victim so the lookalike appears in their history. Wallet interfaces truncate addresses in the middle, so the decoy is visually identical to the real counterparty at a glance. Later, the victim copies the address from history rather than from source. It is a pure interface attack: no key is compromised, no contract is exploited, and the transaction is perfectly valid. Defenses are address books with verified labels, full-address verification on a second device, and test transfers before large sends.",
    why: "It is the cheapest reminder that truncation is a security decision. Any place your systems abbreviate an identifier for display — hostnames, container digests, commit hashes, invoice numbers — you have created room for a near-collision that a human will not catch. Look for truncation in your own UIs before an attacker does.",
    related: ["blind-signing", "infinite-approval", "hot-warm-cold-custody"],
    mode: "novus"
  },
  {
    id: "multisig",
    term: "Multisig",
    domain: "Custody",
    short: "Requiring m of n independent signatures, so compromising one signer is insufficient.",
    long: "A multisig smart account holds funds and executes only when a configured threshold of owner signatures is presented. The strength is entirely in the independence of the signers: different people, different devices, different geographies, different failure modes. A three of five where all five keys sit on laptops in the same office, administered by the same person, is a one of one with extra steps. The threshold is a live tradeoff, because raising m raises attacker cost and simultaneously raises the chance of permanent lockout, which is why real designs pair a threshold with documented recovery and a rehearsed signer-rotation procedure.",
    why: "Multisig is where a leader learns that quorum design is availability design. Choose the wrong m and you have either a single point of theft or a single point of loss. Being able to defend the specific m and n to a board, with the loss scenario on each side named, is a mark of maturity.",
    related: ["threshold-signature-scheme", "safe-module", "quorum", "key-ceremony", "transaction-guard"],
    mode: "novus"
  },
  {
    id: "safe-module",
    term: "Safe Module",
    domain: "Custody",
    short: "An extension contract that can execute transactions from a Safe without meeting the owner signature threshold.",
    long: "Once enabled, a module calls execTransactionFromModule and the account executes, applying the module's own logic instead of the owner quorum. That is the entire point — it is how recurring payments, session keys, automated strategies, and recovery flows are built — and it is also why the Safe documentation warns plainly that a malicious module can take over the account. An enabled module is a permanent bypass of the control you told your board protects the treasury, and enabling one is itself just a transaction the owners sign, often with calldata they cannot read.",
    why: "The module list is the real access control list of a smart account, and almost nobody audits it. Add enabled modules, guards, and the fallback handler to your periodic control review the same way you review who is in the domain admins group. A treasury attestation that recites the threshold without enumerating the modules is incomplete.",
    related: ["multisig", "transaction-guard", "timelock", "blast-radius"],
    mode: "motus"
  },
  {
    id: "transaction-guard",
    term: "Transaction Guard",
    domain: "Custody",
    short: "A hook contract that inspects every transaction before and after execution and can veto it.",
    long: "A guard implements checkTransaction, called before execution, and checkAfterExecution, called after, and reverting in either aborts the whole operation. That gives you a programmable policy layer over a smart account: allowlisted destinations, per-period value caps, blocked delegatecall, required cooldowns, or a post-condition asserting that a critical balance did not fall. The guard is powerful in both directions — a buggy or malicious guard can brick the account entirely by always reverting, which is why serious deployments pair a guard with a tested removal path.",
    why: "Guards are policy-as-code at the point of enforcement rather than at the point of intention, which is the difference between a written treasury policy and an enforced one. When an executive asks how you know the rules are followed, being able to say the rule reverts the transaction rather than the rule is documented is the whole answer.",
    related: ["safe-module", "multisig", "timelock"],
    mode: "motus"
  },
  {
    id: "hot-warm-cold-custody",
    term: "Hot, Warm, Cold Custody",
    domain: "Custody",
    short: "Tiering keys by how reachable they are online, and capping the value that any tier can move.",
    long: "Hot keys are online and automated, serving withdrawals and operations at machine speed; warm keys require human involvement but stay connected; cold keys are air-gapped, held under ceremony, and moved rarely. The tiering only works if the value at each tier is bounded and enforced, and if replenishment flows one way — cold funds warm, warm funds hot, never the reverse on an automated trigger. The interesting failures are at the seams: the automated sweep that can be induced to drain cold, the monitoring account that quietly holds a hot key with no cap, the operational pressure that turns a cold key into a warm one during an incident.",
    why: "This is blast-radius engineering rendered in money, and it is the model executives understand fastest. Once a board sees that hot balance equals worst-case automated loss, they will fund the ceremony work. Use the same framing for credentials: which of our secrets are hot, and what is the maximum damage each one can do without a human?",
    related: ["key-ceremony", "hardware-security-module", "proof-of-reserves", "blast-radius", "multisig"],
    mode: "both"
  },
  {
    id: "seed-phrase",
    term: "Seed Phrase",
    domain: "Custody",
    short: "A human-transcribable encoding of a master secret from which an entire key tree is deterministically derived.",
    long: "A mnemonic encodes entropy plus a checksum as words from a fixed list; that entropy seeds a hierarchical deterministic derivation tree, so every address and key in the wallet descends from it. The consequence people miss is that the phrase is not a backup of one key, it is the key to all of them, forever, including addresses not yet derived. An optional passphrase adds a distinct secret that produces a completely different tree, which enables plausible deniability but also silent, unrecoverable loss if it is mistyped or forgotten. Photographing, typing, or cloud-syncing a phrase converts an offline secret into an online one permanently.",
    why: "The seed phrase is the clearest example in security of a secret that cannot be rotated after exposure — you can only migrate every asset to a new tree. Leaders should look for the same property elsewhere: biometric templates, hardcoded device root keys, national identifiers. Anything unrotatable deserves a different class of protection than anything rotatable.",
    related: ["shamir-secret-sharing", "hot-warm-cold-custody", "hardware-security-module", "hd-wallet", "key-derivation-function", "root-of-trust", "key-ceremony"],
    mode: "both"
  },
  {
    id: "timelock",
    term: "Timelock",
    domain: "Governance",
    short: "A mandatory delay between an approved action being queued and being executable, so the public can react.",
    long: "A timelock contract accepts a queued operation, records the earliest execution time, and refuses to run it before then. The delay is not a technical control at all; it is a social one. Its value is exactly the value of what observers can do inside the window — withdraw, fork, publish, litigate, or trigger a guardian veto. A timelock with a delay shorter than the time it takes an ordinary user to notice and exit is theater, and a timelock whose queued calldata is not decoded and published anywhere is worse, because it manufactures the appearance of transparency without the substance.",
    why: "Timelocks make the abstract idea of a reaction window concrete and measurable. That framing is portable: your change management delay, your certificate rotation lead time, and your incident escalation clock are all timelocks, and each should be justified by what someone can actually accomplish inside it. If the answer is nothing, shorten it or admit it is decoration.",
    related: ["guardian", "governance-capture", "escape-hatch", "security-council"],
    mode: "both"
  },
  {
    id: "guardian",
    term: "Guardian",
    domain: "Governance",
    short: "A privileged role that can pause or veto, deliberately trading decentralization for a stop button.",
    long: "A guardian is usually a multisig or council holding narrow emergency powers: pause deposits, cancel a queued proposal, freeze a bridge. The design question is never whether to have one but what asymmetry it holds. A guardian that can only stop things is a very different risk from one that can also start them, and the good pattern is to make the emergency power purely subtractive, time-bounded, and automatically expiring unless renewed by the normal governance path. Every guardian is also a target: it is the smallest set of humans whose compromise most changes the system's behavior.",
    why: "Guardians force the honest conversation about who is actually in charge when things go wrong, which most governance documents avoid. Being able to point at a named, reachable, rehearsed emergency authority — and to state exactly what it cannot do — is the difference between a credible crisis plan and an org chart.",
    related: ["timelock", "security-council", "governance-capture", "escape-hatch"],
    mode: "both"
  },
  {
    id: "governance-capture",
    term: "Governance Capture",
    domain: "Governance",
    short: "Acquiring enough voting power to pass a proposal that drains or repurposes the system, entirely within the rules.",
    long: "Where token voting is the control, the control has a market price. An attacker can buy, borrow, or rent votes; with flash loans and lending markets, borrowed governance power has been used to pass a proposal and repay within the same block unless the design snapshots balances at proposal time. Even without a hostile actor, capture happens slowly through low participation: if quorum is routinely met by a handful of large holders and a delegate cartel, the effective threshold is far below the nominal one. Mitigations are snapshot-based voting weight, proposal deposits and cooldowns, quorum floors, timelocks long enough to permit exit, and vote-escrow designs that price influence in time as well as capital.",
    why: "Capture is the reminder that a legitimate process is still an attack surface, and that the attacker's cheapest path is often to become the decision maker rather than to bypass one. The same failure appears as a rubber-stamp change advisory board, a self-approving exception process, or a risk committee with no dissenting member. Measure your controls by their cost to capture, not by their existence.",
    related: ["quorum", "timelock", "flash-loan", "security-council", "curation-market"],
    mode: "motus"
  },
  {
    id: "quorum",
    term: "Quorum",
    domain: "Governance",
    short: "The minimum participation required for a decision to count, and therefore the number an attacker must reach.",
    long: "Quorum is two numbers that people conflate: a participation floor (enough of the electorate showed up for the result to be legitimate) and an approval threshold (enough of those who showed up agreed). Set the floor too high and the system deadlocks, which is itself an attack — an adversary who can suppress turnout can freeze you. Set it too low and a motivated minority governs. In consensus protocols the same word carries a hard mathematical meaning: a Byzantine fault tolerant quorum is sized so that any two quorums intersect in at least one honest participant, which is what makes conflicting decisions impossible.",
    why: "Quorum is where availability risk and integrity risk are traded against each other explicitly, in a single number. A leader who can articulate both failure directions for a given quorum — captured at this level, deadlocked at that level — is doing real risk work rather than picking a comfortable-sounding fraction.",
    related: ["governance-capture", "threshold-bft", "multisig", "llmq"],
    mode: "both"
  },
  {
    id: "security-council",
    term: "Security Council",
    domain: "Governance",
    short: "A named, partly external multisig with bounded emergency powers over a protocol.",
    long: "The maturity frameworks for rollups make the shape concrete: a council of at least eight participants operating a multisig with a majority threshold, at least half of them outside the operating organization, with publicly disclosed identities or durable pseudonyms. The stage requirements pair the council with exit guarantees — a minimum window during which users can leave before an unwanted upgrade takes effect, lengthening as the system matures and the council's remit narrows to on-chain-adjudicated soundness errors. The council exists so the system can be saved, and the constraints exist so the council cannot be the thing it saves you from.",
    why: "This is the best available public template for emergency authority with legitimacy: composition, independence, disclosure, and a written boundary on scope. Steal the structure for your own break-glass powers. The test of a good council is that its members can describe what they are forbidden to do as fluently as what they are permitted to do.",
    related: ["guardian", "timelock", "escape-hatch", "governance-capture"],
    mode: "motus"
  },
  {
    id: "proof-of-reserves",
    term: "Proof of Reserves",
    domain: "Custody",
    short: "Cryptographic evidence that a custodian controls the assets it claims, which is only half of solvency.",
    long: "The asset side is provable: sign a message from each address, or publish a set of addresses with attested control, and anyone can sum the balances on chain. The liability side is the hard half, and it is where a Merkle-tree construction is used so each customer can verify their own balance is included in the committed total without seeing anyone else's. Neither half proves solvency by itself. A custodian can borrow assets for the snapshot, share addresses with another entity, or simply omit liabilities, which is why a meaningful attestation requires point-in-time randomness, an independent auditor over the liability set, and repeated unannounced runs.",
    why: "Proof of reserves is a superb teaching case for the difference between evidence and assurance. It shows leaders how a partial proof gets marketed as a complete one, and trains the reflex to ask what a control does not cover. Carry that reflex into every attestation report and vendor questionnaire you are handed.",
    related: ["hot-warm-cold-custody", "attestation", "key-ceremony", "verifiable-computation"],
    mode: "both"
  },
  {
    id: "bridge-trust-model",
    term: "Bridge Trust Model",
    domain: "Chain security",
    short: "Who or what you must trust for a message to cross between two chains, and what happens when they lie.",
    long: "Bridges fall on a spectrum. At one end, an external validator set or a multisig attests that a deposit happened on the source chain and mints on the destination; the security is the honesty of that committee, and its compromise mints unbacked assets out of nothing. In the middle, optimistic bridges accept messages after a challenge window during which any watcher can produce a fraud proof. At the strong end, a light client verifies the source chain's consensus directly on the destination, or a validity proof establishes the state transition cryptographically. Bridges have concentrated more value loss than almost any other pattern in the space because they hold pooled collateral behind whichever assumption is weakest.",
    why: "Bridges are the sharpest available lesson in trust composition: connecting two well-secured systems creates a third system whose security is neither of theirs. That is the same arithmetic as federated identity, third-party integrations, and supply chain trust. Learn to draw the trust boundary at the join, and to value the join separately from the things it joins.",
    related: ["validity-proof", "fraud-proof", "multisig", "data-availability", "blast-radius"],
    mode: "both"
  },
  {
    id: "sequencer",
    term: "Sequencer",
    domain: "Chain security",
    short: "The party that orders transactions on a rollup, and therefore holds a soft censorship and ordering monopoly.",
    long: "A rollup sequencer receives user transactions, decides their order, and publishes batches to the settlement layer. Because it is usually a single operator, it can delay or drop transactions, extract ordering value, and give some users a private lane. It cannot steal funds directly if the proof system is sound and data is published, but it can prevent you from transacting, which is why a designed rollup pairs the sequencer with a forced-inclusion path on the settlement layer and a self-sequencing fallback if the sequencer stops entirely. Sequencer downtime is the most common real-world rollup incident, well ahead of proof failures.",
    why: "The sequencer teaches the difference between confidentiality-integrity failures and availability-plus-ordering failures, which most threat models under-weight. Ask of any system with a single ordering authority: what is the user's recourse if that authority simply declines to serve them, and how long does that recourse take?",
    related: ["forced-inclusion", "escape-hatch", "censorship-resistance", "mev"],
    mode: "both"
  },
  {
    id: "escape-hatch",
    term: "Escape Hatch",
    domain: "Chain security",
    short: "A path that lets users exit a system without the cooperation of its operators.",
    long: "An escape hatch is the answer to the question what if the operator is gone, malicious, or compelled. In rollups it means a user can force their withdrawal through the settlement contract using only published data, without the sequencer, without the proposer, and without a governance vote. That only works if two preconditions hold: the data needed to reconstruct state is available to the user, and the exit path is not itself upgradeable by the operator on a short timescale. Maturity frameworks pin the second point to an exit window, requiring a minimum number of days between an announced upgrade and its effect so users can leave first.",
    why: "An escape hatch is the strongest single question to ask of any custodial or platform relationship, on chain or off: can I leave without your permission, and how long does it take? It reframes vendor lock-in, data portability, and cloud exit planning as security properties rather than procurement complaints.",
    related: ["sequencer", "forced-inclusion", "data-availability", "security-council"],
    mode: "both"
  },
  {
    id: "forced-inclusion",
    term: "Forced Inclusion",
    domain: "Chain security",
    short: "Submitting a transaction directly to the settlement layer so the sequencer must eventually process it.",
    long: "Forced inclusion is the concrete mechanism behind censorship resistance on a rollup. The user posts their transaction to a contract on the settlement chain; after a defined delay, the rollup's derivation rules require that transaction to appear in the canonical ordering, or the chain is invalid. The delay is deliberate — it must be long enough that the sequencer is not routinely bypassed, and short enough that censorship is bounded. It costs settlement-layer gas, which means it is a real right that is expensive to exercise, and rights that are expensive to exercise are exercised rarely and therefore tested rarely.",
    why: "Forced inclusion is a lesson in the gap between a right and an exercisable right. Many security controls have this shape: a break-glass procedure that nobody has ever run, a legal audit right nobody has invoked. Untested recourse should be treated as absent until someone has actually walked it end to end.",
    related: ["sequencer", "escape-hatch", "censorship-resistance"],
    mode: "motus"
  },
  {
    id: "fraud-proof",
    term: "Fraud Proof",
    domain: "Chain security",
    short: "An after-the-fact challenge that proves a published state claim was wrong, backed by a challenge window.",
    long: "Optimistic systems publish a state root and assume it is correct. Any observer who disagrees can submit a fraud proof — typically by bisecting the disputed computation down to a single step that the settlement layer can execute itself and adjudicate. The security rests on three things people forget: at least one honest, funded, and awake challenger; a challenge window long enough for that challenger to act even under network stress; and the data availability required to recompute the disputed state at all. If challenging is permissioned, the guarantee is only as strong as the permissioned set; maturity frameworks therefore require a minimum number of independent parties able to challenge, and full permissionlessness at the highest stage.",
    why: "Fraud proofs are detective controls with teeth, and they show precisely what a detective control requires to work: visibility, a defined response window, an incentivized responder, and an authority that can act on the finding. Grade your own detections against those four. Most alerting programs fail on the incentivized, awake responder.",
    related: ["validity-proof", "data-availability", "escape-hatch", "bridge-trust-model"],
    mode: "motus"
  },
  {
    id: "validity-proof",
    term: "Validity Proof",
    domain: "Chain security",
    short: "A succinct cryptographic proof that a state transition was executed correctly, verified before it is accepted.",
    long: "A validity proof, usually a SNARK or STARK, lets a verifier confirm that a large computation was performed correctly by checking a small proof, without re-executing the computation or trusting the prover. Applied to a rollup, this removes the challenge window entirely: an invalid state cannot be accepted, so no honest watcher is required. What it does not remove is the rest of the trust surface — the circuit could have a bug, a trusted setup may have required a ceremony whose toxic waste must have been destroyed, the prover could be the only party able to produce proofs and therefore able to halt you, and the contract that verifies the proof may be upgradeable.",
    why: "Validity proofs are the clearest example of moving from detect-and-respond to make-it-impossible, which is the direction every mature security program wants to travel. They also teach humility about proofs: proving the computation was correct says nothing about whether the computation was the right one. Correctness of implementation and correctness of specification are different audits.",
    related: ["fraud-proof", "verifiable-computation", "data-availability"],
    mode: "motus"
  },
  {
    id: "data-availability",
    term: "Data Availability",
    domain: "Chain security",
    short: "The guarantee that the data needed to reconstruct or challenge a state is actually published and retrievable.",
    long: "A state root commits to data; it does not deliver it. If an operator publishes a root but withholds the underlying transactions, nobody can compute the state, construct a fraud proof, or exit without the operator's help, even though the commitment is perfectly valid. That is why data availability sits underneath both fraud proofs and escape hatches as a precondition rather than a feature. Systems either post data to a chain with its own consensus, or rely on a data availability committee, or use sampling schemes where light nodes randomly query erasure-coded fragments so that withholding any meaningful portion is detected with high probability.",
    why: "Data availability is the discipline of asking not can it be verified but can it be verified by someone other than you. That distinction is the difference between a log you keep and a log an investigator can obtain, between a vendor's SOC report and the evidence behind it. Push it into your logging, your escrow arrangements, and your incident evidence handling.",
    related: ["fraud-proof", "validity-proof", "escape-hatch", "content-addressing"],
    mode: "motus"
  },
  {
    id: "finality",
    term: "Finality",
    domain: "Consensus",
    short: "The point past which a committed transaction cannot be reversed, and the cost of reversing it before that point.",
    long: "Probabilistic finality, as in proof of work, never reaches certainty; it approaches it as the cost of rewriting history grows with each confirmation, which is why exchanges pick a confirmation count as a risk decision rather than a technical one. Deterministic or economic finality, as in Byzantine fault tolerant and modern proof of stake designs, declares a block final once a supermajority has attested, and reversal then requires provably slashable misbehavior by a large fraction of stake. Some networks bolt fast finality onto a proof of work base: Dash uses a signing quorum to lock a block so that competing chains at that height are rejected outright, making reorganizations below the locked block impossible.",
    why: "Finality is how you translate a cryptographic property into a business rule, which is exactly the translation a CISO is paid to make. When someone asks how many confirmations before we release goods, they are asking you to price the reversal risk. Answer with the attacker's cost, not with a number you inherited from a wiki.",
    related: ["chain-reorganization", "chainlock", "threshold-bft", "instantsend"],
    mode: "both"
  },
  {
    id: "chain-reorganization",
    term: "Chain Reorganization",
    domain: "Consensus",
    short: "A previously accepted block being replaced by a competing chain, un-doing transactions that looked settled.",
    long: "A reorg happens whenever the network switches to a heavier or otherwise preferred fork, discarding blocks it had accepted. Short reorgs are routine and benign; deep ones are how double spends are executed. The economic driver is often overlooked: when the extractable value in a block exceeds the reward for building the next one, rational validators have a positive incentive to reorganize and capture it themselves, which means MEV is a consensus-stability problem and not only a fairness problem. Finality gadgets and block-locking quorums exist to remove the option entirely below a certain depth.",
    why: "Reorgs are the concrete answer to why we do not treat a database write as final just because it returned success. Any leader integrating with a chain must set confirmation policy per asset and per value band, and must have a documented response for the day a reorg reverses a settled customer transaction after goods have shipped.",
    related: ["finality", "chainlock", "mev", "censorship-resistance"],
    mode: "both"
  },
  {
    id: "threshold-bft",
    term: "Threshold BFT",
    domain: "Consensus",
    short: "Byzantine fault tolerant agreement where a threshold of a fixed set produces a single verifiable collective signature.",
    long: "Classical BFT reaches agreement when a supermajority of a known validator set votes for the same value, sized so that any two quorums must overlap in an honest member. Adding threshold cryptography compresses the result: instead of collecting and verifying n individual signatures, members contribute signature shares and any party with enough shares recovers one signature that verifies against a single group public key. The verifier's cost stops growing with the validator set, which is what makes light clients and cross-chain verification practical. The cost is a fixed, known membership and a setup protocol to establish the shared key.",
    why: "Threshold BFT is the cleanest available model of quorum intersection, which underlies far more than blockchains: replicated databases, leader election, certificate transparency logs, and any m of n approval you design. Understanding why the intersection guarantee requires a specific fraction is what stops you from picking a threshold that merely feels safe.",
    related: ["distributed-key-generation", "llmq", "quorum", "finality"],
    mode: "motus"
  },
  {
    id: "chainlock",
    term: "ChainLock",
    domain: "Consensus",
    short: "A quorum-signed message that fixes the canonical block at a height, making deeper reorganizations impossible.",
    long: "In Dash, a deterministically selected long-living masternode quorum of several hundred members observes the network; each member signs the first valid block it sees extending the chain at that height. When enough members sign the same block, they recover a collective signature and broadcast a chain lock message. Every node that accepts it must then reject all other blocks at that height and any descendants of them, which makes the choice of active chain immediate and unambiguous and removes the 51 percent mining reorg as an attack. Attempts are coordinated with transaction locking, so a lock is generally pursued once the block's transactions are already individually locked.",
    why: "ChainLocks are a working example of layering a fast, membership-based finality mechanism over a slow, open-membership one to get both properties. That composition pattern — a permissionless base with a permissioned accelerator that can only constrain, never invent — is worth carrying into any hybrid architecture you design.",
    related: ["llmq", "finality", "chain-reorganization", "instantsend", "masternode"],
    mode: "motus"
  },
  {
    id: "instantsend",
    term: "InstantSend",
    domain: "Consensus",
    short: "Locking a transaction's inputs by quorum signature so it cannot be double spent while it waits for a block.",
    long: "Rather than waiting for confirmations, a quorum signs a lock over the transaction's inputs. Once locked, any conflicting spend of those inputs is rejected by the network, so the recipient can treat the payment as settled within seconds. The lock is an input-level commitment, which is why it composes with block locking: a block whose transactions are all individually locked can be locked in turn. For platform systems it matters operationally because a proof that funds are locked can be produced immediately, rather than waiting for the block confirmation path.",
    why: "This is a precise demonstration that finality can be decomposed — you can settle the specific claim that matters (these inputs are spent, once) long before you settle the general one (this history is permanent). Look for the same decomposition in your own systems, where a narrow, fast guarantee often removes the need for a broad, slow one.",
    related: ["chainlock", "llmq", "asset-lock", "finality"],
    mode: "motus"
  },
  {
    id: "masternode",
    term: "Masternode",
    domain: "Consensus",
    short: "A collateralized, always-on node that provides network services and is Sybil-resisted by its bonded stake.",
    long: "A masternode proves control of a fixed collateral, registers on chain with owner, operator, and voting keys, and then serves functions ordinary nodes do not: participating in signing quorums, relaying locks, and voting on treasury proposals. The collateral is the Sybil resistance — identities are cheap, but bonded identities are not — and the key separation means the party who owns the collateral need not be the party who runs the server, which is what makes hosting practical without handing over the funds. Deterministic on-chain registration is what allows every node to independently compute the same membership list, which is a precondition for deterministic quorum selection.",
    why: "Masternodes make bonded identity tangible: the right to participate is purchased with capital at risk rather than granted by an administrator. That is a different answer to the identity problem than certificates or allowlists, and knowing all three lets you pick deliberately when you design a permissioned network or a partner ecosystem.",
    related: ["evonode", "llmq", "chainlock", "sybil-resistance"],
    mode: "both"
  },
  {
    id: "evonode",
    term: "Evonode",
    domain: "Dash Platform",
    short: "A high-specification masternode that additionally runs the platform layer and serves its API.",
    long: "Evolution nodes carry a larger collateral and stricter hardware and bandwidth requirements because they run the platform state machine and its consensus alongside the base-layer node. They serve the decentralized API that clients use to submit state transitions and read documents and proofs, and they participate in the platform quorums that order and validate those transitions. From a security standpoint the important property is that clients can request cryptographic proofs alongside query results, so an evonode returning wrong data can be detected by the client rather than merely trusted.",
    why: "Evonodes model a pattern you will meet everywhere: a node that is simultaneously a consensus participant and a public API endpoint. Those two roles have opposite exposure profiles, and separating their threat models — consensus safety versus internet-facing availability and abuse — is the design work that keeps a hybrid node from being compromised through its least-hardened function.",
    related: ["masternode", "llmq", "state-transition", "platform-credit"],
    mode: "motus"
  },
  {
    id: "distributed-key-generation",
    term: "Distributed Key Generation",
    domain: "Consensus",
    short: "A protocol that creates a shared key with no dealer, so the full private key never exists at any point in time.",
    long: "DKG runs in phases: participants exchange contributions, complain about missing or invalid contributions, justify themselves against complaints, and finally commit to the resulting group public key. Each participant ends holding a share of a private key that was never assembled anywhere, which removes the trusted dealer that a simple secret-sharing scheme requires. The complaint and justification phases are what make it Byzantine tolerant rather than merely distributed: a member that withholds or misbehaves is identified and excluded before the key is finalized. Dash forms its long-living quorums this way, ending with a final commitment broadcast to the whole network.",
    why: "DKG is the answer to the objection that every split-key scheme still has one moment where the whole key exists. Being able to say there is no such moment changes what you can promise about insider risk. It is also a model for designing any process where the goal is that no single party ever holds the complete capability, not merely that they promise not to use it.",
    related: ["threshold-signature-scheme", "llmq", "threshold-bft", "key-ceremony"],
    mode: "motus"
  },
  {
    id: "llmq",
    term: "LLMQ",
    domain: "Consensus",
    short: "A long-living masternode quorum: a deterministic subset of nodes with a shared key, reused across many signing sessions.",
    long: "Rather than forming an ad hoc group per decision, an LLMQ is selected deterministically from the registered masternode list, establishes a shared key by distributed key generation, and then persists for a defined lifetime signing many messages with BLS threshold signatures. Quorum types are named for their size and threshold percentage — a four hundred member quorum requiring sixty percent, or a hundred member quorum requiring sixty-seven percent — and different features use different types according to how much security and how much latency they need. Because membership is computed from on-chain data, every node derives the same quorum without coordination, and a recovered signature verifies against one group key.",
    why: "LLMQs show how to make Byzantine agreement cheap enough to use constantly: amortize the expensive setup across many decisions and keep verification constant-size. When you are designing anything that needs repeated multi-party authorization, the question of whether the group is per-decision or long-lived is the main cost and risk lever you have.",
    related: ["distributed-key-generation", "chainlock", "instantsend", "threshold-bft", "masternode"],
    mode: "motus"
  },
  {
    id: "data-contract",
    term: "Data Contract",
    domain: "Dash Platform",
    short: "An on-chain schema declaring the document types, fields, indices, and constraints an application may write.",
    long: "A data contract is registered by an identity and then governs every document submitted under it: the platform validates each write against both protocol rules and the contract's own schema before accepting it. That makes the schema a consensus-enforced input filter rather than an application-layer convention, so a malformed or unexpected document cannot enter state at all. Indices must be declared in advance because they determine what queries are efficiently answerable and provable, which means data modeling decisions are also availability and cost decisions. Contract updates are themselves state transitions, and are constrained so that existing documents remain valid.",
    why: "This is schema-as-a-security-control taken to its conclusion: validation that cannot be bypassed by a misbehaving client because it is enforced by the network. Most breaches involving injection or deserialization exist because validation lived in the application. Ask where in your stack the schema is authoritative, and whether anything can write around it.",
    related: ["state-transition", "dpns", "evonode", "platform-credit"],
    mode: "motus"
  },
  {
    id: "state-transition",
    term: "State Transition",
    domain: "Dash Platform",
    short: "The signed unit of change on Dash Platform: header, typed payload, and identity signature.",
    long: "Every mutation on the platform is expressed as a state transition carrying a version and payload type, the payload itself, and a signature from the submitting identity. Payload types cover contract creation and update, identity creation, top-up, update and credit transfer, batched document create, replace, delete and transfer, and token operations. Clients construct them locally and submit through the decentralized API; validation applies protocol rules first and then any relevant data contract rules. Because each is signed by a specific identity key and priced in credits, the platform gets authentication, authorization, and rate limiting from one primitive.",
    why: "State transitions are a clean demonstration of making every mutation an explicit, signed, typed, replay-protected object. Compare that with a typical enterprise system where mutations arrive as untyped HTTP calls with ambient session authority. When you can, design your write path as a signed command with an identity and a sequence number attached, not as a request.",
    related: ["data-contract", "platform-credit", "asset-lock", "dpns"],
    mode: "motus"
  },
  {
    id: "dpns",
    term: "DPNS",
    domain: "Dash Platform",
    short: "The Dash Platform naming service: human-readable names bound to identities via a preorder and reveal.",
    long: "Registration is two steps by design. First a preorder document commits to a salted hash of the desired name, revealing nothing about the name itself; after it propagates, a domain document reveals the name and the salt, and the network checks that it matches the earlier commitment. That ordering is what prevents an observer from seeing your intended name in the mempool and registering it first. Names are contested resources, and the platform includes a voting path for resolving high-value or conflicting claims rather than granting them purely first come first served.",
    why: "Preorder and reveal is the general defense against front-running any scarce namespace, and it will come up again in domain registration, ticketing, allocation, and auction design. More broadly, DPNS is a reminder that human-readable identifiers are a security surface: the moment a name is easier to remember than a key, impersonation moves to the name.",
    related: ["data-contract", "state-transition", "atom-squatting", "platform-credit"],
    mode: "motus"
  },
  {
    id: "asset-lock",
    term: "Asset Lock",
    domain: "Dash Platform",
    short: "A base-layer transaction that immobilizes coins so a second-layer identity can be funded against the proof.",
    long: "The user creates a special transaction on the core chain whose payload designates funds for platform use and commits to a one-time key that the platform will credit. Once the lock is proven — by an instant lock or by a chain lock, or by burial under confirmations — the user submits an identity create or top-up state transition referencing that proof, and the locked value less fees becomes credits. Because the proof is over a specific outpoint, the same lock cannot be spent twice into the second layer, and because anyone may submit a top-up for any identity, an application can subsidize its users' costs without holding their keys.",
    why: "Asset locking is the cleanest small example of a cross-layer trust bridge done conservatively: value is destroyed or immobilized on one side before it is created on the other, and the proof is over an unforgeable, single-use reference. Every bridge failure you will read about is a violation of one of those two properties. Use it as the reference shape when reviewing any value transfer between domains.",
    related: ["platform-credit", "instantsend", "chainlock", "state-transition"],
    mode: "motus"
  },
  {
    id: "platform-credit",
    term: "Platform Credit",
    domain: "Dash Platform",
    short: "The non-transferable unit that prices platform operations, derived from locked base-layer value.",
    long: "Credits exist only inside the platform and are consumed by state transitions according to the storage and processing they cause. That makes cost a first-class part of the protocol rather than a billing concern: an operation that writes more state costs more, and an identity with no credits simply cannot write. The result is built-in denial-of-service resistance, because spam has to be purchased with real base-layer value that was immobilized first. The security nuance is that a griefing attacker may target credit exhaustion rather than the state itself, so any application that subsidizes user operations must model its own top-up wallet as a rate-limited resource.",
    why: "Metered write access is the most underused availability control in ordinary systems. When cost is attached to the operation rather than to the account, abuse becomes self-limiting. If you take one thing from platform credits into enterprise architecture, make it this: price your expensive endpoints, even internally, and watch the abuse patterns disappear.",
    related: ["asset-lock", "state-transition", "data-contract", "griefing"],
    mode: "motus"
  },
  {
    id: "slashing",
    term: "Slashing",
    domain: "Consensus",
    short: "Destroying part of a participant's bonded stake as an automatic, protocol-enforced penalty for provable misbehavior.",
    long: "Slashing converts a rule from a promise into a price. The design constraints are strict: the offense must be objectively provable from data the protocol can see, the proof must be submittable by anyone, and the penalty must exceed the profit from the offense. Filecoin storage providers who fail to submit a proof of continued storage for a sector are slashed a portion of pledge collateral and lose the associated power; proof of stake networks slash for equivocation. The great danger is over-slashing correlated honest failures — a data center outage that takes out many operators at once can turn a liveness incident into a solvency event, which is why serious designs scale penalties with the fraction of the network failing simultaneously.",
    why: "Slashing is what an enforceable control looks like when there is no court. Studying it sharpens how you write internal policy: is the violation objectively detectable, who can raise it, what is the automatic consequence, and does the consequence exceed the benefit of violating? Most corporate policy fails all four tests.",
    related: ["proof-of-spacetime", "sybil-resistance", "masternode", "cost-of-corruption"],
    mode: "motus"
  },
  {
    id: "censorship-resistance",
    term: "Censorship Resistance",
    domain: "Consensus",
    short: "The property that no participant can prevent a valid transaction from eventually being included.",
    long: "Censorship resistance is usually eventual rather than immediate: a censoring party can delay you, but cannot exclude you forever, because there exists a path that does not require their cooperation. On a rollup that path is forced inclusion via the settlement layer; on a base chain it is the existence of enough independent block producers that one will include you. The mechanism erodes quietly through centralization of block building, compliance filtering at the relay layer, and private orderflow agreements that give a subset of users a faster lane. Measuring it means measuring inclusion delay for transactions that specific builders refuse, not merely counting validators.",
    why: "Censorship resistance is availability restated as a political property, and it is where security leaders in regulated environments have to be most honest. You will be asked to filter, and the right answer requires understanding exactly which layer the filtering happens at and what recourse remains. Confusing cannot process with will not process is how organizations end up making promises the architecture does not keep.",
    related: ["sequencer", "forced-inclusion", "mev", "credible-neutrality"],
    mode: "motus"
  },

  /* ---------- Decentralized infrastructure ---------- */
  {
    id: "content-addressing",
    term: "Content Addressing",
    domain: "Decentralized storage",
    short: "Naming data by the hash of its bytes rather than by where it lives.",
    long: "Under content addressing the identifier is derived from the content, so any difference in the content yields a different identifier and identical content added with identical settings yields the same identifier anywhere. That gives you integrity for free — you can verify what you received without trusting who sent it — plus natural deduplication and immutable references. What it explicitly does not give you is availability or location: an identifier is a claim about what, never a promise that anyone still has it. Files are also chunked and arranged into a directed acyclic graph before hashing, so the identifier is the hash of a root block, not of the file, and the same bytes can produce different identifiers under different chunking or codec settings.",
    why: "Content addressing separates integrity from availability cleanly, and once you see the separation you will find it missing everywhere: a package pinned by tag rather than digest, a container image referenced by mutable label, a document linked by URL. Moving your own supply chain from location references to content references removes an entire attack class without any new infrastructure.",
    related: ["cid", "pinning", "gateway-trust", "data-availability"],
    mode: "both"
  },
  {
    id: "cid",
    term: "CID",
    domain: "Decentralized storage",
    short: "A self-describing content identifier carrying its hash function, its codec, and its encoding.",
    long: "A CID bundles a multihash, which names the hash algorithm and carries the digest, with a multicodec that says how to interpret the bytes once fetched, and for version one a multibase prefix declaring the string encoding. Version zero identifiers are bare base58 multihashes that start with Qm and imply a single codec; version one is self-describing and defaults to case-insensitive base32, which matters because case-insensitive encodings can be placed in DNS labels and in subdomain-isolated origins. The self-description is the security-relevant part: a verifier does not have to be told which hash function was used, so the format can migrate away from a weakened algorithm without ambiguity.",
    why: "The CID is the best available example of cryptographic agility designed in from the start rather than retrofitted. Every organization eventually faces an algorithm migration; those that encoded the algorithm alongside the digest survive it as a rolling upgrade, and those that assumed one algorithm forever face a flag day. Ask whether your own stored digests say which function produced them.",
    related: ["content-addressing", "ipns", "pinning", "dht"],
    mode: "motus"
  },
  {
    id: "pinning",
    term: "Pinning",
    domain: "Decentralized storage",
    short: "An explicit local commitment to keep a block, because nothing else guarantees anyone will.",
    long: "Content-addressed networks do not replicate by default; a node stores what it has been asked to store and garbage-collects the rest. Pinning marks specific content as exempt from collection on a specific node. The consequence people learn painfully is that publishing content and having content persist are unrelated events: if the only pinning node goes away, the identifier still resolves to nothing forever. Real durability therefore means multiple independent pins across operators, monitored, with the pin set itself backed up, and often a paid storage layer underneath that offers cryptographic proofs of continued storage rather than a promise.",
    why: "Pinning is the discipline that decentralization does not create durability. It maps directly onto backup practice: replication counted, geographically and administratively independent, verified by restore rather than by dashboard. If you cannot name who is pinning your critical data and how you would notice if they stopped, you do not have a backup, you have a copy.",
    related: ["content-addressing", "storage-endowment", "gateway-trust", "free-rider"],
    mode: "novus"
  },
  {
    id: "dht",
    term: "DHT",
    domain: "P2P networks",
    short: "A distributed hash table that maps content and peer identifiers to the peers who can serve them.",
    long: "IPFS uses a Kademlia-style DHT with two record types: provider records mapping a content multihash to peers advertising it, and peer records mapping a peer identifier to reachable network addresses. Distance is defined as the XOR of hashed identifiers, and each peer keeps buckets of roughly twenty contacts at each distance range, refreshing its routing table on a regular interval. Storing a record means locating the peers closest to the key and writing it there; retrieval walks the same gradient. The security consequence follows directly from the structure: because responsibility for a key is determined by identifier proximity, an adversary who can choose identifiers can position themselves next to a target key.",
    why: "The DHT is the canonical example of a routing layer whose correctness depends on identity being expensive. It teaches the reflex to ask, for any peer-to-peer or gossip system, what stops one party from occupying many positions. That reflex is what separates people who deploy distributed systems from people who secure them.",
    related: ["libp2p", "eclipse-attack", "sybil-resistance", "cid"],
    mode: "motus"
  },
  {
    id: "ipns",
    term: "IPNS",
    domain: "Decentralized storage",
    short: "A mutable pointer, signed by a key, that resolves to a content identifier which can change over time.",
    long: "Content identifiers are immutable, which is excellent for integrity and useless for anything that updates. IPNS names are derived from a public key; the holder of the corresponding private key publishes signed records binding the name to a current content identifier with a sequence number and a validity period. Resolution means finding the newest valid record, so the security properties are those of any signed, expiring record: key compromise means the name is captured, an expired record means the name stops resolving, and a stale record served by an offline-tolerant resolver can pin a viewer to an old version. Publishing and propagation are slow relative to fetching immutable content, which pushes many deployments toward DNS-based aliasing instead.",
    why: "IPNS is a compact lesson in the cost of mutability. Every time you introduce a mutable pointer over immutable data you inherit key management, revocation, rollback, and freshness problems that the immutable layer did not have. Know which of those four you are accepting, and make the rollback question explicit, because attackers reach for stale-but-valid far more often than for forged.",
    related: ["cid", "dht", "content-addressing", "dpns"],
    mode: "motus"
  },
  {
    id: "libp2p",
    term: "libp2p",
    domain: "P2P networks",
    short: "A modular networking stack for peer-to-peer systems: transports, secure channels, multiplexing, discovery, and pubsub.",
    long: "libp2p factors out the parts every peer-to-peer system needs and lets each be swapped: multiple transports including TCP, QUIC, and WebSockets, negotiated encryption and authentication where the peer identifier is the hash of a public key, stream multiplexing over one connection, peer discovery through the DHT or bootstrap peers or local broadcast, and gossip-based publish and subscribe. Because the peer identity is a key, authentication is mutual and continuous rather than a login event. The attack surface is correspondingly broad: relay and hole-punching services can be abused for amplification, gossip meshes can be partitioned or spammed, and connection managers must be tuned or a peer can be resource-exhausted by cheap dials.",
    why: "libp2p is where you learn that in a peer network there is no perimeter and no server, so every node is simultaneously a client, a server, and a routing element. Designing authorization for that world — capability per stream, not role per user — is the same shift that service mesh and zero-trust architectures demand inside the enterprise.",
    related: ["dht", "eclipse-attack", "sybil-resistance"],
    mode: "motus"
  },
  {
    id: "blockweave",
    term: "Blockweave",
    domain: "Decentralized storage",
    short: "Arweave's structure where each block links to both the previous block and an earlier recalled block.",
    long: "A conventional chain links each block only to its predecessor, so a node needs recent history to validate. The blockweave adds a second link to a pseudorandomly chosen prior block, which means producing a valid block requires access to older data as well as new. That converts storage from an unrewarded burden into a mining input: the more of the historical dataset a miner holds, the more often they can answer a challenge, and the protocol therefore pushes miners toward holding complete replicas rather than only recent state. The weave is partitioned for practical mining, and hashing proceeds against stored partitions.",
    why: "The blockweave is a masterclass in aligning incentives with the property you actually want. Nobody is paid to store data in most systems, so nobody does it well. When you design any system where a desired behavior is costly and unrewarded, ask whether you can make the behavior a precondition for the reward instead of a policy requirement.",
    related: ["proof-of-access", "storage-endowment", "content-addressing"],
    mode: "motus"
  },
  {
    id: "proof-of-access",
    term: "Proof of Access",
    domain: "Decentralized storage",
    short: "Requiring a miner to demonstrate possession of randomly recalled historical data in order to produce a block.",
    long: "Instead of proving only that work was done, a miner must prove they could read a specific, unpredictably selected piece of the stored history at the moment of the challenge. Because the challenge is random and the deadline is short, a miner cannot fetch the data on demand from a peer and still compete, which is what forces genuine local storage rather than an index of where the data might be. Successive designs tightened this by making the hashing itself depend on the recalled bytes, so the rate at which a miner can attempt solutions scales with how much of the dataset they actually hold.",
    why: "Proof of access is a working answer to a question every auditor asks and few controls answer: prove you have it right now, not that you had it when the report was written. Random, deadline-bounded challenges over a large corpus are a technique you can borrow for backup verification, key escrow attestation, and vendor data-residency claims.",
    related: ["blockweave", "storage-endowment", "porep", "free-rider"],
    mode: "motus"
  },
  {
    id: "storage-endowment",
    term: "Storage Endowment",
    domain: "Decentralized storage",
    short: "Prepaying a principal whose yield, under a declining cost-of-storage assumption, funds perpetual replication.",
    long: "The endowment model takes a one-time payment at upload, allocates a portion to immediate miner reward, and places the rest in a pool that is released over time to those proving continued storage. Its solvency rests entirely on an economic assumption: that the cost per byte of storage falls faster than the endowment is drawn down. If that assumption breaks — through a hardware plateau, an energy shock, or a demand shift — the model becomes underfunded at exactly the moment nobody is watching, because the failure is silent and slow. It is a genuinely different funding shape from subscription storage, and it should be evaluated as a financial model, not only a technical one.",
    why: "This is the clearest case in infrastructure of a security property that depends on a macroeconomic forecast. It trains the habit of asking what assumption keeps this funded, and over what horizon. The same question applies to open-source maintenance, certificate lifetimes, and any control whose operation depends on someone continuing to pay for it years from now.",
    related: ["blockweave", "proof-of-access", "pinning", "free-rider"],
    mode: "motus"
  },
  {
    id: "porep",
    term: "PoRep",
    domain: "Decentralized storage",
    short: "Proof of Replication: evidence that a specific provider created a physically distinct encoding of specific data at a specific time.",
    long: "Sealing is a deliberately slow, sequential encoding that binds three things together: the data, the identity of the provider, and a randomness value drawn from the chain at a known height. Because the randomness is time-anchored, the same provider sealing the same data later produces a different proof, and because sealing is expensive it cannot be faked on demand at challenge time. The provider then compresses the proof with a SNARK and commits it on chain. The property this buys is deduplication resistance: a provider paid for ten copies cannot store one and claim ten, because each replica is a distinct encoding.",
    why: "PoRep is the answer to a problem every enterprise has and rarely solves: proving that your three backup copies are three copies and not three pointers to one array. It also demonstrates using deliberate computational cost as a security primitive, the same idea behind password hashing and proof of work, applied to storage rather than to authentication.",
    related: ["proof-of-spacetime", "slashing", "verifiable-computation", "content-addressing"],
    mode: "motus",
    aliases: ["Proof of Replication"]
  },
  {
    id: "proof-of-spacetime",
    term: "Proof of Spacetime",
    domain: "Decentralized storage",
    short: "Recurring proofs that committed data is still stored, turning a one-time claim into a continuous obligation.",
    long: "Filecoin runs two variants. WinningPoSt is a fast challenge issued when a provider is selected to produce a block, answerable only if the data is genuinely on hand, with a deadline short enough that sealing on demand is impossible. WindowPoSt is the audit: every twenty-four hour proving period is divided into forty-eight thirty-minute deadlines, and every sector a provider holds must be proven once per period at its assigned deadline, with sectors grouped into partitions so one proof covers many. Missing a proof is a fault; faults forfeit pledge collateral and reduce the provider's power.",
    why: "The distinction between a point-in-time proof and a continuous one is the single most useful idea here. Most compliance is WinningPoSt — you prove the control existed on audit day. Mature programs are WindowPoSt: continuous, sampled, with an automatic consequence for a missed window. Push your control evidence in that direction and the annual audit stops being an event.",
    related: ["porep", "slashing", "proof-of-access"],
    mode: "motus"
  },
  {
    id: "gateway-trust",
    term: "Gateway Trust",
    domain: "Decentralized storage",
    short: "Fetching content-addressed data through an HTTP gateway you do not verify, which reintroduces the trusted middleman.",
    long: "Gateways exist because browsers speak HTTP and not peer-to-peer protocols. When a user loads a URL that embeds a content identifier, the gateway fetches the blocks and returns bytes — and unless the client independently re-hashes those bytes against the identifier, the entire integrity guarantee of content addressing has been delegated to the gateway operator. The operator also sees every request, which is a complete access log over supposedly permissionless content, and can censor, rate limit, or serve stale data. Path-based gateway URLs additionally place all content in one web origin, so ordinary same-origin protections do not separate one piece of content from another, which is why subdomain and verified-fetch approaches exist.",
    why: "Gateway trust is the recurring pattern where a convenience layer silently voids the guarantee the underlying system was chosen for. You will meet it as a TLS-terminating proxy that breaks end-to-end encryption, a mirror that breaks package signing, and a managed service that breaks customer-managed keys. Name the guarantee, then trace every hop and ask which hop can still break it.",
    related: ["content-addressing", "cid", "pinning", "confused-deputy"],
    mode: "both"
  },
  {
    id: "eclipse-attack",
    term: "Eclipse Attack",
    domain: "P2P networks",
    short: "Surrounding a node with attacker-controlled peers so it sees only the reality the attacker chooses.",
    long: "The attacker does not need to control the network, only the target's view of it. By filling the victim's connection slots and routing table with peers they control — through repeated crafted connections, through identifiers positioned close to the victim in the keyspace, or by exhausting inbound slots after forcing a restart — the attacker can withhold transactions and blocks, feed a stale or forged chain, and set the victim up for a double spend or a false query result. Defenses are structural: pin some outbound connections to known-good peers, diversify by network address space, require bonded identity where possible, randomize eviction, and reserve slots that cannot be filled by inbound dials.",
    why: "The eclipse is the network-layer version of an information-isolation attack, and the same shape appears far above the network: a monitoring pipeline whose only feed is attacker-writable, a responder whose only view of the incident is the compromised console. Ask what would happen if this component's entire view of the world were adversarial, because that is a much stronger question than asking whether one input can be tampered with.",
    related: ["dht", "sybil-resistance", "libp2p", "chain-reorganization"],
    mode: "motus"
  },
  {
    id: "sybil-resistance",
    term: "Sybil Resistance",
    domain: "P2P networks",
    short: "Making identities costly, so influence cannot be bought by simply creating more of them.",
    long: "In an open system identities are free, and any mechanism that counts them can be overwhelmed by one actor wearing many faces. Resistance means attaching an unforgeable cost to identity: bonded collateral that can be slashed, proof of work, proof of stored data, a scarce social attestation, or a trusted-issuer credential. Each choice has a different failure mode — capital-based resistance concentrates influence among the wealthy, work-based resistance concentrates it among the cheap-energy holders, and credential-based resistance reintroduces a central issuer. There is no free option; there is only choosing which centralization you can live with and monitoring for drift toward it.",
    why: "Almost every decentralized-system failure reduces to a Sybil assumption that did not hold. Getting fluent here changes how you evaluate anything one-per-person: voting, ratings, airdrops, free tiers, and fraud scoring. The right question is never how do we detect fake accounts but what does an identity cost, and does that cost exceed what an identity can obtain?",
    related: ["eclipse-attack", "griefing", "cost-of-corruption", "masternode"],
    mode: "both"
  },
  {
    id: "griefing",
    term: "Griefing",
    domain: "P2P networks",
    short: "An attack whose payoff is your cost, not the attacker's gain.",
    long: "A griefer accepts a loss to impose a larger one: filling a channel with dust so settlement becomes expensive, opening connections to exhaust slots, submitting proposals that force expensive validation, or locking counterparty collateral in a dispute they will lose. Because standard threat modeling asks what does the attacker gain, griefing is routinely missed — the answer is nothing, and the analysis stops. The right metric is the griefing factor, the ratio of victim cost to attacker cost, and the defense is to keep that ratio near or below one by charging for the expensive operation, requiring a bond that the griefer forfeits, or rate limiting by the scarce resource rather than by identity.",
    why: "Griefing is the correction to profit-motivated threat modeling, and it covers a large share of real-world adversaries: competitors, activists, disgruntled insiders, and states. Add a column to your threat model for cost imposed on us versus cost to them, and you will find controls that looked adequate under an economic-rationality assumption and are not.",
    related: ["free-rider", "sybil-resistance", "platform-credit", "wash-attestation"],
    mode: "motus"
  },
  {
    id: "free-rider",
    term: "Free Rider",
    domain: "P2P networks",
    short: "Consuming a shared resource without contributing, which is individually rational and collectively fatal.",
    long: "In file sharing it is the client that downloads and never seeds; in storage networks it is the participant who serves nothing but queries constantly; in open source it is the enterprise consuming a maintainer's unpaid labour. The dynamic is not moral but structural: if contribution is voluntary and consumption is free, the equilibrium is under-provision, and the system degrades until only the most committed remain. Protocol answers are reciprocity accounting, metering consumption so that queries pay contributors, bonded participation, or reputation that gates access to service.",
    why: "The free-rider problem explains a great deal of security debt: shared responsibility models where every team assumes another owns the control, threat intelligence consortia where everyone reads and nobody submits, and critical dependencies maintained by one exhausted volunteer. As a leader you either fund the commons you depend on or you inherit its failure, and that budget conversation is yours to start.",
    related: ["griefing", "storage-endowment", "pinning", "curation-market"],
    mode: "both"
  },
  {
    id: "verifiable-computation",
    term: "Verifiable Computation",
    domain: "Isolation",
    short: "Proving a computation was performed correctly, so the verifier does not need to trust the executor or repeat the work.",
    long: "The prover runs the computation and produces a succinct proof; the verifier checks the proof in far less time than the computation took, and rejects any incorrect result. This is what turns an untrusted machine into a usable one for integrity purposes, and it underlies validity rollups, proofs of storage, and emerging work on proving machine learning inference. The caveats matter as much as the capability: the proof is about the circuit, so a bug in the circuit is proven faithfully; proving overhead is large and shapes what is practical; and some schemes require a setup ceremony whose secret material must genuinely have been destroyed.",
    why: "Verifiable computation is the strongest available answer to trusting a system you do not operate, which is the defining problem of cloud, of outsourcing, and increasingly of AI inference. Even before it is cheap enough for your workloads, the mental model is useful: it forces you to ask which of your trust relationships could in principle be replaced by a check, and which are irreducibly social.",
    related: ["validity-proof", "porep", "wasm-sandbox", "attestation"],
    mode: "motus"
  },
  {
    id: "wasm-sandbox",
    term: "WASM Sandbox",
    domain: "Isolation",
    short: "Running untrusted code in a capability-oriented bytecode VM with no ambient access to the host.",
    long: "WebAssembly modules execute against a linear memory they cannot escape by construction, with no syscalls, no file descriptors, and no network unless a host function is explicitly imported. That inverts the usual model: instead of starting with full process authority and removing it, the module starts with nothing and receives exactly the capabilities the host grants. Determinism and small startup cost make it attractive for plugin systems and edge execution. The real risks live at the boundary — a host function that takes a path or a URL from the guest, integer or bounds handling in the host bindings, and side channels through timing and shared resources, none of which the sandbox itself addresses.",
    why: "WASM is the most accessible working example of capability-based security, which is the model that actually solves the confused deputy problem rather than patching it. If you are designing plugin or extension architecture, or an execution surface for AI-generated code, start from deny-by-default with explicit imports. The audit then reduces to reviewing the import list, which is a tractable task.",
    related: ["gvisor", "firecracker", "agent-sandboxing", "verifiable-computation"],
    mode: "motus"
  },
  {
    id: "gvisor",
    term: "gVisor",
    domain: "Isolation",
    short: "A user-space application kernel that services container syscalls itself instead of passing them to the host kernel.",
    long: "gVisor implements a Linux-compatible interface in Go. The Sentry is that kernel: syscalls from the sandboxed application are redirected to it by a platform layer, and it handles memory, signals, threading, and file semantics internally rather than forwarding to the host. Filesystem access is mediated by a separate Gofer process, so the Sentry itself runs under a restrictive seccomp policy without direct filesystem reach. The tradeoff against a plain container is that host kernel attack surface shrinks dramatically; the tradeoff against a virtual machine is faster startup and process-like resource use, paid for with higher per-syscall cost and imperfect application compatibility.",
    why: "gVisor is the clearest illustration that container isolation is a kernel-shared model, and that the host kernel is the shared fate. When you evaluate multi-tenant workloads, untrusted code execution, or AI agents that run arbitrary commands, the first question is what is the isolation boundary and what is on the other side of it. Namespaces and cgroups are not a boundary against kernel exploits.",
    related: ["firecracker", "wasm-sandbox", "agent-sandboxing", "blast-radius"],
    mode: "motus"
  },
  {
    id: "firecracker",
    term: "Firecracker",
    domain: "Isolation",
    short: "A minimal virtual machine monitor that gives each workload a real hardware boundary with container-like startup.",
    long: "Each Firecracker process runs exactly one microVM with an API thread, a VMM thread, and one thread per virtual CPU. The device model is deliberately tiny — VirtIO block and network, a serial console, a partial keyboard controller — because every emulated device is attack surface. The threat model assumes guest code is hostile from the first instruction, and production deployments run the jailer, which establishes cgroups and a chroot with elevated permissions, drops privileges, and then executes Firecracker inside that constrained context. Network filtering is explicitly out of scope and must be supplied by the host.",
    why: "Firecracker is proof that the old tradeoff between virtual machine isolation and container agility was an implementation artifact rather than a law. That matters for anyone building a platform where untrusted workloads must be cheap and safe. It is also a fine example of security by subtraction: the strongest thing about the design is the list of features it refuses to have.",
    related: ["gvisor", "wasm-sandbox", "agent-sandboxing"],
    mode: "motus"
  },
  {
    id: "blast-radius",
    term: "Blast Radius",
    domain: "Isolation",
    short: "Everything reachable from a single compromise, which is the number that actually determines incident severity.",
    long: "Blast radius is not a probability, it is an extent: given that this credential, host, key, module, or agent is fully controlled by an adversary, what falls next. Measuring it means enumerating reachable data, reachable systems, and reachable authority, including transitive paths through shared credentials, trust relationships, and automation. The design levers are segmentation, per-workload identity, short-lived credentials, value caps per tier, and the removal of standing privilege. The most common measurement error is stopping at the first hop, because a service account that can only reach one database still counts everything that database's contents can unlock elsewhere.",
    why: "Prevention has diminishing returns; containment does not. Framing security investment in blast radius terms is also how you win budget conversations, because an executive who cannot evaluate a vulnerability count can immediately evaluate if this laptop is owned, here is exactly what the attacker gets. Make it a standing number per system and drive it down.",
    related: ["hot-warm-cold-custody", "agent-sandboxing", "gvisor", "confused-deputy", "failure-domain", "least-privilege", "privilege-escalation-path", "trust-boundary", "crypto-shredding", "lateral-movement", "containment", "workload-identity", "business-impact-analysis"],
    mode: "both"
  },

  /* ---------- AI security and safety ---------- */
  {
    id: "prompt-injection",
    term: "Prompt Injection",
    domain: "AI security",
    short: "Untrusted text entering a model's context and being followed as instruction.",
    long: "A language model receives one undifferentiated token stream. Whatever the developer intended as system policy, user request, and retrieved data arrives as the same kind of thing, and the model has no reliable channel-level notion of which part is authoritative. An attacker who controls any text that reaches the context can therefore attempt to redirect behavior. This is the top entry in the OWASP list for large language model applications for good reason: it is not a bug in a particular model but a consequence of the architecture, and no filter has demonstrated the reliability that a security control needs. Mitigations reduce impact rather than eliminate the class: constrain what the model can do, not what it can be told.",
    why: "Prompt injection is the defining unsolved problem of the agentic era, and the single most important thing for a security leader to understand honestly. The honesty is the leverage: vendors will sell you detection at ninety-five percent, and ninety-five percent is a failing grade for a control facing an adaptive adversary. Design as though injection succeeds, and make the success uninteresting.",
    related: ["indirect-prompt-injection", "lethal-trifecta", "jailbreak", "excessive-agency"],
    mode: "both"
  },
  {
    id: "indirect-prompt-injection",
    term: "Indirect Prompt Injection",
    domain: "AI security",
    short: "The malicious instruction is planted in content the model retrieves, not typed by the user.",
    long: "The user asks an innocuous question. The agent fetches a web page, an email, a pull request comment, a calendar invite, a document, or a tool result, and that content contains text addressed to the model. Because the attacker never touches the user's session, this scales: poison a page and wait for agents to read it. Production systems across the industry have been shown vulnerable, including cases where an agent reading public issues in a repository was steered into disclosing contents of private repositories. The instruction can be invisible to a human — white text, HTML comments, metadata, or an image the model reads — which defeats human review of the source content.",
    why: "This is the reason AI security cannot be handled as input validation on the user's message. The attack surface is every document your agents will ever read, and it is unbounded. It forces the architectural question that actually matters: what is this agent permitted to do, regardless of what it is convinced to want?",
    related: ["prompt-injection", "lethal-trifecta", "rag-poisoning", "confused-deputy", "mcp-security"],
    mode: "both"
  },
  {
    id: "lethal-trifecta",
    term: "Lethal Trifecta",
    domain: "AI security",
    short: "Private data access, exposure to untrusted content, and the ability to communicate externally, in one agent.",
    long: "Simon Willison's formulation names the combination that turns prompt injection from a nuisance into exfiltration. Any two of the three are survivable. All three together mean an attacker who can place text where the agent will read it can cause the agent to fetch secrets and send them out, and the send can be as subtle as a rendered image whose URL carries the data, a search query, or a created pull request. The recommended mitigation is uncomfortable but correct: do not assemble the three in one context. That is an architecture decision about tool composition, and it must be enforced at the tool layer because a user assembling their own tools cannot see the combination they have created.",
    why: "The trifecta gives you a one-line review criterion that a non-specialist executive can apply, which is rare and valuable. Put it on your agent design review: which of the three does this configuration have? Two is a design; three is an incident waiting for someone to write the page. It also tells you where to spend effort — usually on severing the outbound channel, which is the cheapest of the three to constrain.",
    related: ["indirect-prompt-injection", "tool-authorization", "agent-sandboxing", "human-in-the-loop"],
    mode: "both"
  },
  {
    id: "jailbreak",
    term: "Jailbreak",
    domain: "AI security",
    short: "Getting a model to produce output its policy training was meant to refuse.",
    long: "Jailbreaks work by changing the frame rather than the request: role play, fictional framing, incremental escalation across turns, encoding the request, translating it, splitting it across a long context, or supplying many in-context examples of compliance. Defenses layer rather than solve — refusal training, input and output classifiers running on the stream, asynchronous monitoring that can inspect more deeply without adding latency, and post-hoc detection with a rapid patch path when a new technique appears. The important distinction from prompt injection is who is attacking whom: a jailbreak is the user attacking the operator's policy, while injection is a third party attacking the user through the model.",
    why: "Confusing jailbreak with injection leads to spending on the wrong controls, so a leader must separate them cleanly. Jailbreak is a content-policy and brand-risk problem best addressed by layered classifiers and rapid response; injection is an authority problem addressed by architecture. When a vendor answers your injection question with jailbreak benchmarks, you have learned something about the vendor.",
    related: ["prompt-injection", "ai-red-teaming", "dangerous-capability-evaluation", "responsible-scaling"],
    mode: "both"
  },
  {
    id: "training-data-poisoning",
    term: "Training Data Poisoning",
    domain: "AI security",
    short: "Corrupting the data a model learns from, so the defect is baked into the weights.",
    long: "An adversary who can influence pretraining corpora, fine-tuning sets, or human feedback data can degrade performance broadly or, more dangerously, install a targeted backdoor: normal behavior everywhere except on a specific trigger. Web-scale corpora are attackable simply because expired domains and editable sources are cheap to acquire, and research has shown that poisoning a very small absolute number of documents can be sufficient rather than a large fraction. Because the defect lives in the weights, it survives prompt-level defenses entirely, and detection requires provenance controls over the data pipeline, dataset versioning and hashing, and targeted evaluation for trigger behavior.",
    why: "Poisoning moves AI risk into supply chain territory, where security leaders already have doctrine. The same instincts apply: know your sources, pin and hash your inputs, hold provenance records, and treat a fine-tuning dataset with the seriousness you would give a build dependency. If you cannot say where every training and fine-tuning corpus came from, you have an unowned supply chain.",
    related: ["rag-poisoning", "model-extraction", "mitre-atlas", "knowledge-graph-integrity"],
    mode: "motus"
  },
  {
    id: "rag-poisoning",
    term: "RAG Poisoning",
    domain: "AI security",
    short: "Planting content in a retrieval corpus so it is fetched as authoritative context at answer time.",
    long: "Retrieval augmented generation grounds answers in fetched documents, which means whoever can write to the index can write to the model's premises. The attack has two flavors: content poisoning, where the planted document contains false facts the model repeats with confident citation, and instruction poisoning, where it contains directives the model follows. It is often easier than training poisoning because indexes accept new content continuously, embeddings can be gamed to rank a document highly for targeted queries, and ingestion pipelines commonly pull from wikis, ticket systems, and shared drives that many people can write to. Defenses are write-path authorization on the corpus, provenance and trust tiers per source, and treating retrieved text as data with markers rather than as instruction.",
    why: "RAG turns your document repositories into part of your production trust boundary overnight, usually without anyone re-reviewing who can write to them. Go find who can create a page in the wiki your assistant indexes. That list is now an authorization list for your AI system, and almost certainly nobody has approved it as one.",
    related: ["training-data-poisoning", "indirect-prompt-injection", "knowledge-graph-integrity", "wash-attestation"],
    mode: "both"
  },
  {
    id: "model-extraction",
    term: "Model Extraction",
    domain: "AI security",
    short: "Reconstructing a model's parameters or capabilities through its own query interface.",
    long: "An attacker with API access queries systematically and trains a surrogate on the responses, recovering behavior without ever touching the weights. Richer outputs make it cheaper: full probability distributions and logit access leak far more per query than a sampled token, and published work has shown that even limited API surfaces can reveal structural facts such as embedding dimensions. Related attacks lift the system prompt, the tool schema, or the retrieval sources, which are often the actual commercial secret. Countermeasures are rate limiting per principal rather than per key, restricting output detail, watermarking, anomaly detection on query distributions, and accepting that a determined, funded extractor cannot be fully stopped through an open interface.",
    why: "Extraction is the reminder that an inference endpoint is a disclosure channel, and that intellectual property in an AI system leaves through the front door rather than through a breach. It also reframes the perimeter conversation: your most valuable asset may be reachable by anyone with a credit card, which is a very different defensive posture from protecting a file on a server.",
    related: ["membership-inference", "model-weights-custody", "mitre-atlas", "adversarial-example"],
    mode: "motus"
  },
  {
    id: "membership-inference",
    term: "Membership Inference",
    domain: "AI security",
    short: "Determining whether a specific record was in a model's training set, from the model's behavior on it.",
    long: "Models behave measurably differently on data they memorized than on data they have not seen — lower loss, higher confidence, more exact continuation. An attacker exploits that gap to answer a binary question about a specific individual or document. The privacy harm is often the membership itself rather than the content: knowing a person's record was in a clinical dataset discloses their diagnosis regardless of what the model outputs. It is the entry point to a family of attacks including attribute inference and verbatim extraction of memorized secrets. Differential privacy in training bounds the leakage formally, at a measurable cost to utility, and deduplication of training data reduces memorization substantially.",
    why: "Membership inference is what makes the claim the model only saw anonymized data legally and technically inadequate. Regulators are increasingly clear that a model can constitute processing of personal data. If your organization fine-tunes on customer records, this is the specific mechanism your privacy counsel needs explained, and it should change what you are willing to fine-tune on.",
    related: ["model-extraction", "training-data-poisoning", "mitre-atlas"],
    mode: "motus"
  },
  {
    id: "adversarial-example",
    term: "Adversarial Example",
    domain: "AI security",
    short: "An input perturbed just enough to flip a model's output while looking unchanged to a human.",
    long: "Because a learned decision boundary is high-dimensional and locally fragile, a small, carefully chosen perturbation can move an input across it. Attacks range from white-box gradient methods to black-box query-based search, and perturbations frequently transfer between models trained on similar data, which means an attacker can craft against a surrogate and deploy against yours. Physical-world variants — stickers, printed patterns, audio at the edge of perception — matter for perception systems in vehicles and access control. Adversarial training improves robustness against the threat model it was trained on and generalizes poorly beyond it, so robustness claims must always be read together with the attack they were measured under.",
    why: "Adversarial examples are the proof that machine learning components fail differently from software components: not by crashing but by being confidently wrong in a way an attacker selects. Any deployment where a model gates a consequential decision needs a defense in depth behind it, because the model's confidence score is itself under adversary control.",
    related: ["model-extraction", "mitre-atlas", "ai-red-teaming"],
    mode: "motus"
  },
  {
    id: "model-weights-custody",
    term: "Model Weights Custody",
    domain: "AI safety",
    short: "Protecting the trained parameters as the crown jewel, because they encode the capability itself.",
    long: "Weights are a single copyable artifact that embodies the entire investment and the entire capability, and once exfiltrated they cannot be revoked, rotated, or watched. Serious programs treat them like key material: hardware-backed storage, strict egress controls on the networks that touch them, multi-party authorization and mandatory code review for changes to systems with weight access, no persistent high-privilege access, temporary grants with the smallest necessary permission set, hardware authentication devices, and binary authorization on endpoints. The insider is the central threat, because the legitimate research workflow requires touching the very asset you are protecting, and unlike most secrets there is no useful partial disclosure to detect first.",
    why: "Weight custody is where AI security stops being novel and becomes classic high-assurance security, which is good news: the doctrine exists. It is also where an AI-adjacent CISO earns credibility fastest, because it is concrete, measurable, and legible to a board. Ask any lab or vendor how weight access is granted and revoked, and you will learn more about their real security posture than any certification tells you.",
    related: ["rand-security-level", "responsible-scaling", "hot-warm-cold-custody", "blast-radius"],
    mode: "both"
  },
  {
    id: "rand-security-level",
    term: "RAND Security Level",
    domain: "AI safety",
    short: "A tiered benchmark for weight security, defined by the class of attacker each level is meant to withstand.",
    long: "RAND's work on securing AI model weights frames the problem the right way around: not a list of controls but a ladder of adversary capability, from opportunistic amateurs and individual insiders at the low end, through capable non-state groups and standard state operations, up to top-priority operations by the most capable state actors at the highest level. Each level is defined by what it is expected to stop, and the report catalogues the attack vectors an assessment must cover across running systems, access management, insiders, supply chain, and physical means. The honest conclusion embedded in the framing is that the highest levels are beyond what current commercial security practice achieves, and closing that gap requires investment on a different order.",
    why: "Defining security by the adversary it stops, rather than by the controls implemented, is the single most useful reframing in the report and it transfers to everything you own. Rewrite your own control narrative that way. Saying we are hardened against a capable non-state group and not against a priority state operation is far more useful to a board than a maturity score, and it makes the next investment decision obvious.",
    related: ["model-weights-custody", "responsible-scaling", "preparedness-framework"],
    mode: "motus"
  },
  {
    id: "dangerous-capability-evaluation",
    term: "Dangerous Capability Evaluation",
    domain: "AI safety",
    short: "Testing whether a model can meaningfully uplift a serious harm, before deciding how to deploy it.",
    long: "These are not benchmarks of helpfulness but structured attempts to measure whether a model provides real assistance toward specific severe harms — chemical and biological uplift, offensive cyber operations, autonomous replication, and automated AI research and development. Doing them well requires eliciting the model's best performance rather than its default behavior: fine-tuning, scaffolding, tool access, and expert red teams, because an evaluation that fails to elicit a capability has proven nothing about its absence. Results feed a threshold decision, so the evaluation must be run before deployment and re-run when capabilities materially change, and the elicitation gap must be reported alongside the score.",
    why: "This is the discipline of testing for capability rather than for behavior, and it is the model for how to evaluate any dual-use system you deploy. It also carries an operational lesson every security leader should internalize: an evaluation that did not try hard is not evidence of safety, and the same is true of your penetration tests.",
    related: ["responsible-scaling", "preparedness-framework", "ai-red-teaming", "jailbreak"],
    mode: "motus"
  },
  {
    id: "preparedness-framework",
    term: "Preparedness Framework",
    domain: "AI governance",
    short: "A published policy binding capability thresholds to required safeguards before further deployment or training.",
    long: "The pattern, adopted in various forms across frontier developers, is: define tracked categories of severe risk, define thresholds within them, evaluate models against those thresholds, and commit in advance to specific safeguards or to halting if a threshold is crossed without them. The commitments are pre-registered precisely because the moment of decision is the moment of maximum commercial pressure, and a rule written under pressure is not a rule. Credibility rests on details that are easy to skip: who evaluates, whether the evaluation is independent, what the elicitation effort was, what triggers a re-evaluation, and who has authority to stop.",
    why: "Frameworks like these are the best available template for pre-committing to a hard decision before the incentives arrive, which is exactly what an incident severity matrix or a breach disclosure policy is supposed to do and usually fails to do. Study the structure, then apply it: write down now what would make you stop, and who can overrule that, before the quarter is on the line.",
    related: ["responsible-scaling", "dangerous-capability-evaluation", "rand-security-level", "eu-ai-act"],
    mode: "motus"
  },
  {
    id: "responsible-scaling",
    term: "Responsible Scaling",
    domain: "AI governance",
    short: "Tying safety and security standards to a model's demonstrated capability level rather than to its release date.",
    long: "Anthropic's Responsible Scaling Policy defines AI Safety Levels, with each level pairing a set of capability thresholds against required safeguards that must be in place before a model at that level is trained further or deployed. The safeguards split into two halves that are assessed separately: deployment standards, built as defense in depth with access controls, real-time classifiers on prompts and completions, asynchronous monitoring that can look deeper without adding latency, and post-hoc jailbreak detection with a rapid response path; and security standards covering access management, compartmentalization, software supply chain monitoring, endpoint binary authorization, and infrastructure as code. The policy is explicitly a living document, revised as understanding improves.",
    why: "The structural insight worth stealing is the separation of deployment risk from security risk, each with its own bar and its own evidence. Most organizations conflate them and end up with strong external controls and a soft interior, or the reverse. Ask of your own crown-jewel systems: what is our deployment standard, what is our security standard, and what capability level are they calibrated to?",
    related: ["dangerous-capability-evaluation", "model-weights-custody", "rand-security-level", "preparedness-framework"],
    mode: "motus",
    aliases: ["Responsible Scaling Policy"]
  },
  {
    id: "alignment-vs-control",
    term: "Alignment vs Control",
    domain: "AI safety",
    short: "Making a system want the right thing, versus making a system unable to do the wrong thing.",
    long: "Alignment approaches shape objectives and values so the system pursues intended goals; control approaches assume the objective may be wrong or subverted and constrain what actions are reachable regardless. They are complements with different evidence requirements: alignment claims rest on behavioral evaluation and generalization arguments, which are hard to make airtight, while control claims rest on architecture and permissions, which are auditable. Control safeguards also survive an aligned model being manipulated, which is exactly the prompt injection case, and they degrade gracefully because a partial control failure still bounds the damage.",
    why: "This distinction is the entire reason a security leader has standing in AI deployment conversations, which are otherwise dominated by model behavior. You are not qualified to certify that a model is aligned and you should never be asked to. You are absolutely qualified to bound what any process on your network can reach. Plant your flag there and the rest of the conversation becomes tractable.",
    related: ["agent-sandboxing", "human-in-the-loop", "responsible-scaling", "tool-authorization"],
    mode: "both"
  },
  {
    id: "agent-sandboxing",
    term: "Agent Sandboxing",
    domain: "AI security",
    short: "Running an AI agent inside an isolation boundary sized to the damage you are willing to accept.",
    long: "The tiers are the same as for any untrusted code, and choosing among them is a real decision: a capability-based bytecode sandbox for pure computation, a user-space kernel for syscall-level isolation with fast startup, or a microVM for a hardware boundary. Around whichever you pick, the controls that matter are egress allowlisting so exfiltration has no route, ephemeral filesystems so persistence does not survive the task, per-task credentials scoped to that task's need, no host credential inheritance, and resource caps so a runaway loop is a bounded cost. The recurring failure is an agent given the developer's own credentials for convenience, which makes the sandbox decorative.",
    why: "Sandboxing is the control that makes prompt injection survivable, and it works without needing to predict what the attacker will say. It is also the honest answer to the question can we let agents run code: yes, with a boundary whose failure you have costed. Being able to state the blast radius of a fully compromised agent is the deliverable your executives actually need.",
    related: ["gvisor", "firecracker", "tool-authorization", "lethal-trifecta", "blast-radius"],
    mode: "both"
  },
  {
    id: "tool-authorization",
    term: "Tool Authorization",
    domain: "AI security",
    short: "Deciding what an agent may do based on the requesting principal, not on the agent's own ambient credentials.",
    long: "Most agent deployments give the agent a service identity with the union of every permission any task might need, which turns the agent into a confused deputy for every user it serves. The correct model passes the invoking principal's authority through to the tool call, so the agent can never exceed the person on whose behalf it is acting, and pairs that with per-tool policy: read tools that are freely callable, write tools that are scoped and rate limited, and irreversible tools that require an out-of-band confirmation. Every tool result should re-enter the context marked as untrusted data, and tool schemas themselves should be pinned, because a tool description is text the model reads and therefore a place an attacker can write.",
    why: "This is where AI security converges with identity and access management, which is a discipline your organization already has. The reframing that unlocks it: an agent is not a user, it is a delegation mechanism, and delegation without an authority to delegate is just privilege escalation with a friendly interface. Audit your agents' permission sets exactly as you would a service account.",
    related: ["confused-deputy", "mcp-security", "agent-sandboxing", "excessive-agency"],
    mode: "both"
  },
  {
    id: "mcp-security",
    term: "MCP Security",
    domain: "AI security",
    short: "The trust problems introduced when models connect to tool servers through a standard protocol.",
    long: "A tool protocol makes capability composition easy, which is the point and also the risk. The specific hazards are: every connected server's tool descriptions are attacker-writable text entering the model's context; every tool result is untrusted content that can carry instructions; a server can change its tool definitions after a user has approved them; combining servers from different trust domains can silently assemble the lethal trifecta; and credentials granted to a server are usually broader than any single call needs. The controls are pinning server versions and reviewing tool definitions as code, isolating servers by trust domain, scoping and short-lifing credentials per server, logging every tool call with its arguments, and confirming irreversible actions out of band.",
    why: "Tool protocols are how AI capability actually enters an enterprise, and they arrive through developer enthusiasm rather than through procurement. Get ahead of it with a registry of approved servers, a review standard for tool definitions, and a default of read-only. The organizations that lose here will lose because nobody had an inventory, not because the protocol was flawed.",
    related: ["tool-authorization", "indirect-prompt-injection", "lethal-trifecta", "confused-deputy"],
    mode: "both"
  },
  {
    id: "human-in-the-loop",
    term: "Human in the Loop",
    domain: "AI security",
    short: "A human approval step, which is only a control if the human can actually understand what they are approving.",
    long: "Placing a person between an agent's decision and its effect is the most commonly proposed safeguard and the most commonly hollow one. It fails through volume, because a reviewer facing hundreds of approvals per day approves reflexively; through opacity, because the summary shown is generated by the same system being reviewed; and through absent authority, because the reviewer has no realistic ability to say no. Making it real means reserving approval for a small number of genuinely consequential and irreversible actions, rendering the actual effect rather than the stated intent, sourcing the rendering independently of the proposer, and measuring the rejection rate as a control health metric.",
    why: "This is the same failure as blind signing, arriving in a new domain, and the same fix applies: show effect, not intent, and cap the volume so attention survives. A rejection rate of zero is not a sign of a well-behaved system; it is a sign of a control that has stopped functioning. Instrument it, and treat a sustained zero as an incident.",
    related: ["blind-signing", "lethal-trifecta", "alignment-vs-control", "excessive-agency"],
    mode: "both"
  },
  {
    id: "nist-ai-rmf",
    term: "NIST AI RMF",
    domain: "AI governance",
    short: "A voluntary framework organizing AI risk work into GOVERN, MAP, MEASURE, and MANAGE.",
    long: "Released in January 2023, the AI Risk Management Framework is designed to help organizations build trustworthiness into the design, development, use, and evaluation of AI systems. GOVERN establishes accountability and culture and runs across the other three; MAP establishes context and identifies risks; MEASURE assesses and tracks them with appropriate methods; MANAGE prioritizes and acts. It is deliberately non-prescriptive and outcome-oriented rather than a control list. The Generative AI Profile, published as NIST AI 600-1 in July 2024, extends it with risks specific to generative systems and suggested actions mapped back to the four functions.",
    why: "The RMF is the vocabulary your regulators, auditors, insurers, and enterprise customers will increasingly use, so speaking it is table stakes. Its real value internally is that MAP forces context first — who is affected, in what setting, with what alternatives — which is the step technical teams skip and the step that determines whether the rest of the work is aimed correctly.",
    related: ["eu-ai-act", "preparedness-framework", "mitre-atlas", "responsible-scaling"],
    mode: "both"
  },
  {
    id: "eu-ai-act",
    term: "EU AI Act",
    domain: "AI governance",
    short: "Binding, risk-tiered EU regulation of AI systems with separate obligations for general-purpose models.",
    long: "The Act classifies systems by risk, prohibiting some practices outright, imposing substantial conformity, documentation, and oversight requirements on high-risk uses, and lighter transparency duties elsewhere. General-purpose AI models carry their own chapter of obligations, with additional duties where a model is deemed to present systemic risk. The timeline is staged: general-purpose AI rules, governance provisions, and penalties began applying on 2 August 2025, the bulk of the remaining obligations on 2 August 2026, with a further tranche in 2027 and a compliance deadline for general-purpose models placed on the market before August 2025. Compliance for general-purpose providers can be demonstrated through a code of practice or, failing that, other adequate means.",
    why: "This is the first binding AI regime with extraterritorial reach and real penalties, which makes it the forcing function for AI governance budgets globally. The leverage for a security leader is that most of what it demands — risk management, documentation, logging, human oversight, robustness, and post-market monitoring — is work you should be doing anyway. Frame your programme in its language and the funding conversation gets much shorter.",
    related: ["nist-ai-rmf", "preparedness-framework", "responsible-scaling"],
    mode: "both"
  },
  {
    id: "excessive-agency",
    term: "Excessive Agency",
    domain: "AI security",
    short: "Granting an AI system more functionality, permission, or autonomy than its task requires.",
    long: "Catalogued in the OWASP list for large language model applications, excessive agency decomposes into three distinct over-grants that need separate remedies. Excessive functionality is the tool that can do more than the use case needs, such as a database tool with write access for a reporting assistant. Excessive permission is the credential scoped beyond the task, typically a shared service account. Excessive autonomy is the absence of a confirmation step for a high-impact, irreversible action. The compounding effect is what makes it dangerous: an injected instruction only causes harm through the agency you granted, so reducing agency reduces the impact of every injection you failed to prevent.",
    why: "This is least privilege restated for a component that will be argued into misusing whatever you give it, and it is the most actionable item on the list because each of the three over-grants has a concrete owner and fix. Run the decomposition across every deployed agent. You will usually find that the fastest large risk reduction available to you is removing a tool nobody uses.",
    related: ["tool-authorization", "human-in-the-loop", "agent-sandboxing", "lethal-trifecta"],
    mode: "both"
  },
  {
    id: "ai-red-teaming",
    term: "AI Red Teaming",
    domain: "AI security",
    short: "Adversarial testing of an AI system's behavior, safeguards, and surrounding architecture under real elicitation effort.",
    long: "Effective AI red teaming spans three layers that are often conflated: model behavior, where the goal is eliciting policy-violating or dangerous output; system architecture, where the goal is injection, exfiltration, and tool abuse through the deployed application; and supply chain, covering training data, model provenance, and connected servers. It differs from traditional penetration testing in two ways that change the methodology — the target is stochastic, so a single success or failure proves little and you must report rates over trials, and success often requires domain expertise rather than security expertise, which means chemists and biologists on the team for uplift questions. Automation extends coverage but adaptive human effort still finds the classes automation does not.",
    why: "Red teaming is how you convert an unfalsifiable safety claim into evidence, and the credibility of the evidence is proportional to the effort spent trying to break it. Insist on hearing what the team tried and failed to do, not just what they found, and insist on trial counts rather than anecdotes. A report with no methodology section is marketing.",
    related: ["dangerous-capability-evaluation", "jailbreak", "mitre-atlas", "adversarial-example"],
    mode: "both"
  },
  {
    id: "mitre-atlas",
    term: "MITRE ATLAS",
    domain: "AI security",
    short: "An ATT&CK-style knowledge base of adversary tactics and techniques against machine learning systems.",
    long: "ATLAS applies the ATT&CK methodology to machine learning, organizing real-world and research-demonstrated attacks into tactics and techniques across reconnaissance, obtaining model access, poisoning, evasion at inference, and exfiltration, alongside documented case studies. Its value over a generic threat list is that it is structured for the same uses as ATT&CK: mapping observed activity to a shared vocabulary, checking detection coverage per technique, and driving purple team exercises with a common reference. Because it sits beside ATT&CK rather than replacing it, a full picture of an incident against an AI system usually needs both.",
    why: "ATLAS lets you integrate AI threats into the threat-informed defense process you already run, instead of standing up a parallel and disconnected AI risk exercise. Map your existing detections against it once and the gaps are immediately visible. That single artifact is usually enough to make AI risk concrete for a security operations team that has been treating it as somebody else's topic.",
    related: ["ai-red-teaming", "training-data-poisoning", "model-extraction", "nist-ai-rmf"],
    mode: "both"
  },

  /* ---------- Intuition protocol ---------- */
  {
    id: "atom",
    term: "Atom",
    domain: "Intuition",
    short: "A permissionless, persistent identifier for any entity or concept: the node of the knowledge graph.",
    long: "An atom is a decentralized identifier for anything — a person, an organization, a contract, a tag, a URL, an idea. Anyone can create one; there is no gatekeeper. Its data may be a raw string, a chain-scoped account or contract identifier, an IPFS URI, or a JSON-LD object following schema.org types. Uniqueness is derived from the exact contents of the data, so byte-identical data is the same atom, which is what makes convergence on shared identifiers possible and what makes sloppy metadata permanently fragmenting. Creating an atom deploys a vault for it, so an atom is immediately something people can stake on. In Protocol v2 identifiers are hex strings rather than numbers, which breaks v1-typed queries.",
    why: "The atom is the cleanest available demonstration that identity infrastructure can be permissionless and still converge, because convergence is economic rather than administrative. For anyone designing a registry, a naming system, or a reputation layer, it reframes the central question from who is allowed to create an identifier to what makes people reuse the right one.",
    related: ["triple", "signal", "bonding-curve-vault", "atom-squatting", "ethmultivault"],
    mode: "both"
  },
  {
    id: "triple",
    term: "Triple",
    domain: "Intuition",
    short: "A structured claim of subject, predicate, and object, where each slot is itself an atom: the edge of the graph.",
    long: "A triple expresses a sentence in a machine-readable form, and because every slot is an atom the sentence is composed of reusable, individually stakeable parts. A triple is itself a first-class entity with its own identifier, so triples can be nested — a claim can be the subject of another claim, which is how disputes, endorsements, and provenance about statements are expressed. Critically, a triple has two vaults rather than one: a positive vault for staking that the claim is true and a negative or counter vault for staking that it is false. The predicate being an atom is what lets communities converge on shared vocabulary instead of each application inventing its own.",
    why: "Making disagreement a first-class, economically weighted position is the design move most systems miss; likes and upvotes only ever model agreement. If you are building anything involving contested facts, fraud flags, or verification, the counter vault is the primitive you were missing, and its existence changes what your data can honestly represent.",
    related: ["atom", "signal", "attestation", "curation-market", "knowledge-graph-integrity"],
    mode: "both"
  },
  {
    id: "signal",
    term: "Signal",
    domain: "Intuition",
    short: "Staked conviction: a deposit into or redemption from an atom or triple vault, and the weight on the graph.",
    long: "A signal is the economic act, recorded on chain as a deposit or redemption event and enriched by the indexer into a queryable record carrying the account and the entity it targeted. Staking into a triple's positive vault says I believe this; staking into its counter vault says I dispute this. The staked amount is the conviction, so the graph distinguishes a claim nobody has backed from a claim with substantial capital behind it, and it does so without any central scoring authority. Signals are also reversible by redemption, which means conviction can be withdrawn and the weight is a live quantity rather than a permanent record.",
    why: "Signals turn attention into a costly, revocable, attributable act, which is precisely what free engagement metrics cannot do. For a security leader the value is the reasoning pattern: when you need a trust score that resists manipulation, ask what the manipulator must risk, not what they must claim. That question survives long after any particular protocol.",
    related: ["atom", "triple", "bonding-curve-vault", "wash-attestation", "curation-market"],
    mode: "both"
  },
  {
    id: "ethmultivault",
    term: "EthMultiVault",
    domain: "Intuition",
    short: "The core contract that creates atoms and triples and manages their vaults, deposits, redemptions, and share accounting.",
    long: "The MultiVault is the central protocol contract: it handles atom and triple creation, holds the vault for each term, mints and burns shares on deposit and redemption, applies the fee splits, and routes bonding-curve operations through a registry so multiple curve implementations can coexist. The beta contracts named it EthMultiVault and gave bonding-curve activity its own dedicated methods and routes alongside the original ones; current documentation refers to the MultiVault, and the v2 contracts sit alongside a TrustBonding contract in the deployed set. Because both atoms and triples are terms under the hood, one contract carries the accounting for the entire graph.",
    why: "A single contract holding the accounting for every vault in the system is a concentrated, high-value target, and that is the point worth teaching: know where the value concentrates in any protocol you depend on, regardless of how decentralized the surrounding narrative is. When you evaluate an integration, find the contract that would be catastrophic if wrong, and read its audit history first.",
    related: ["atom", "triple", "bonding-curve-vault", "trust-token"],
    mode: "motus",
    aliases: ["MultiVault"]
  },
  {
    id: "bonding-curve-vault",
    term: "Bonding Curve Vault",
    domain: "Intuition",
    short: "A pool keyed by term and curve where deposits mint shares at a price that rises with supply.",
    long: "Every atom and every triple vault prices shares by a bonding curve, so there is continuous liquidity with no order book and no counterparty: price is always computable from supply, and entry and exit are instant and deterministic. Vaults are identified by the composite of the term identifier and the curve identifier, with the standard linear curve as the default and other shapes available for specialized vaults; a user's holding in a given vault is a position. The behavioral consequence is asymmetric by design — early stakers get cheaper shares and earn from those who follow, but carry the risk that nobody follows, while late stakers pay a premium for a proven signal and capture less upside.",
    why: "The bonding curve is a mechanism-design lesson in paying for early, correct conviction rather than for late, safe agreement. Understand its second-order effect and you understand the manipulation surface too: any metric whose value rises with participation invites participation manufactured to move the metric. That is the same reasoning you apply to reputation systems, bug bounty payouts, and internal incentive schemes.",
    related: ["ethmultivault", "signal", "curation-market", "trust-token"],
    mode: "motus"
  },
  {
    id: "trust-token",
    term: "TRUST Token",
    domain: "Intuition",
    short: "The native token of the Intuition Network: gas, staking collateral, creation and storage fees, query fees, and governance.",
    long: "TRUST pays for every transaction on the network, is the collateral staked as a signal, funds the fixed creation fee and ongoing storage fee that keep low-value entries from accumulating, and prices queries so that fees flow back to node operators and to the identifiers and attestations serving those queries. Governance moves over time toward vote-escrowed TRUST, and a TrustBonding contract sits alongside the MultiVault in the deployed set. Emissions are described as performance-sensitive, expanding with genuine usage and contracting when activity slows. Intuition Mainnet uses chain identifier 1155 with TRUST as its currency; the testnet uses 13579 with tTRUST, and both are EVM layer-three networks settling to Base.",
    why: "TRUST is a compact example of one asset carrying five distinct jobs — metering, collateral, storage pricing, query payment, and governance weight — which means a price shock propagates into all five simultaneously. Recognizing coupled-dependency risk is a core leadership skill: when one variable underwrites several controls at once, a move in that variable is a correlated failure, not an isolated one.",
    related: ["ethmultivault", "signal", "bonding-curve-vault", "validator-session", "cost-of-corruption"],
    mode: "motus"
  },
  {
    id: "attestation",
    term: "Attestation",
    domain: "Intuition",
    short: "A signed, portable claim by an identified party about a subject, valuable in proportion to what the issuer risks.",
    long: "In the general sense an attestation binds an issuer, a subject, a claim, and a time, and its usefulness depends entirely on the verifier's ability to evaluate the issuer. On Intuition an attestation is expressed as a triple and weighted by the issuer's stake, so conviction is priced rather than merely asserted, and the issuer's own atom accumulates a history that contextualizes everything they have ever attested. Because the graph is shared rather than application-private, an attestation made in one context is legible in another, which is the portability property that private review systems and closed reputation scores structurally cannot provide.",
    why: "Attestation is the connective concept across this entire glossary: it is what a proof of reserves is, what a signed software bill of materials is, what a remote attestation quote is, and what a credential is. The generalizable discipline is always the same three questions — who signed it, what exactly did they claim, and what do they lose if it is false.",
    related: ["triple", "signal", "proof-of-reserves", "knowledge-graph-integrity", "wash-attestation"],
    mode: "both"
  },
  {
    id: "wash-attestation",
    term: "Wash Attestation",
    domain: "Intuition",
    short: "Staking against your own claims through controlled accounts to manufacture the appearance of consensus.",
    long: "By analogy with wash trading, an actor creates or controls multiple accounts and has them stake on the same claim so that the aggregate conviction looks like independent agreement. Where fees on deposits and redemptions exist the round trip is not free, which sets a floor on the cost, but the attack is economically rational whenever the downstream value of appearing credible exceeds that cost. Detection is a graph problem rather than a rule: cluster funding sources, look for accounts whose positions co-move, weight by the independence and history of stakers rather than by raw totals, and account for the counter vault, since manufactured consensus can be contested by anyone willing to stake against it.",
    why: "Any reputation system with a public score has this attack, and the naive defense of counting stake is exactly what the attacker is exploiting. The correct posture is to treat aggregate conviction as a slow, contestable variable rather than a fast, authoritative one, and to weight independence over magnitude. That principle is directly reusable for vendor risk scores, review platforms, and internal trust ratings.",
    related: ["attestation", "signal", "cost-of-corruption", "curation-market", "sybil-resistance"],
    mode: "motus"
  },
  {
    id: "cost-of-corruption",
    term: "Cost of Corruption",
    domain: "Intuition",
    short: "The capital an attacker must commit and risk to change a system's output, and the number that defines its real security.",
    long: "Cryptoeconomic security is measured as the cost to corrupt an outcome against the profit from corrupting it, and a system is secure only while the first exceeds the second. Computing it honestly means counting what is genuinely at risk rather than what is nominally locked: stake that can be withdrawn before a penalty lands is not at risk, capital that can be borrowed for one transaction costs a fee rather than a balance sheet, and value that leaves through a bridge or a market is profit that was never modeled. In a staked knowledge graph the same arithmetic applies per claim: moving the apparent consensus on a high-value claim costs whatever it takes to out-stake the honest weight and hold it against counter-staking.",
    why: "This is the single most useful number to carry into any decentralized-system review, and it converts security from an adjective into a figure you can compare against the value at stake. Do the calculation before you integrate, and redo it when the token price moves, because a system that was secure at one valuation is not automatically secure at another.",
    related: ["wash-attestation", "schelling-point", "sybil-resistance", "governance-capture"],
    mode: "motus"
  },
  {
    id: "schelling-point",
    term: "Schelling Point",
    domain: "Intuition",
    short: "The answer people converge on without communicating, because each expects the others to converge on it too.",
    long: "A focal point is a solution that is salient rather than mandated, and coordination games settle on it because expecting others to choose it makes choosing it correct. In a permissionless identifier system this is the whole convergence mechanism: with no registrar deciding which identifier for an entity is canonical, the one that already carries the most attestations and the most staked value becomes the one a rational new participant uses, because using it taps existing liquidity and network effects while minting a near-duplicate isolates you economically. The fragility is that focal points can be moved by whoever shapes salience — defaults in an interface, search ranking, and documentation examples are all levers on which identifier looks canonical.",
    why: "Schelling points explain why standards win without being enforced, and why the party controlling defaults controls outcomes far more than the party controlling policy. Apply it internally: the secure path must also be the obvious path, because you are not going to out-argue the default. Changing the default is usually cheaper and more effective than any amount of training.",
    related: ["cost-of-corruption", "atom-squatting", "credible-neutrality", "curation-market"],
    mode: "motus"
  },
  {
    id: "credible-neutrality",
    term: "Credible Neutrality",
    domain: "Intuition",
    short: "A mechanism whose rules visibly do not favour any particular participant, which is what makes its outputs acceptable to losers.",
    long: "A mechanism is credibly neutral when an observer can confirm from the rules alone that no specific person or outcome was written into them. The practical requirements are that the mechanism does not name specific participants or outcomes, that it is open source and its execution publicly verifiable, that it is kept simple enough for people to actually check that claim, and that it is not changed frequently, because frequent change relocates power from the rules to whoever changes them. Neutrality is not the same as fairness — a neutral mechanism can produce unequal outcomes — and that distinction is exactly why it is achievable and durable when fairness disputes are not.",
    why: "Credible neutrality is the property that lets a shared substrate be adopted by parties who do not trust each other, which is the precondition for any consortium, standard, or public infrastructure. It is also a discipline for internal security governance: a policy that visibly cannot be bent for a favoured team survives contact with executives far better than one that is merely correct.",
    related: ["schelling-point", "censorship-resistance", "governance-capture", "knowledge-graph-integrity"],
    mode: "motus"
  },
  {
    id: "curation-market",
    term: "Curation Market",
    domain: "Intuition",
    short: "A market where staking on information both ranks it and rewards those who backed it early and correctly.",
    long: "In a curation market the act of expressing that something is valuable is also an investment in it. Ranking emerges from aggregate signal weight rather than from an editorial decision or a private algorithm, and the bonding curve pays those who staked before consensus arrived. Applied to a knowledge graph, a curated list is an atom, membership is a triple, and position in the list is the staked weight on that membership triple, with counter-staking available to push items down. The known failure modes are the ones any market has: momentum can substitute for merit, wealthy participants can set the ranking directly, and the incentive rewards predicting what others will value, which is not identical to what is true.",
    why: "Curation markets are the most instructive live experiment in replacing an opaque ranking algorithm with a transparent, adversarial, priced one. Neither is neutral; they simply expose different manipulation surfaces. Knowing both is what lets you evaluate any ranked feed, threat feed, or vendor leaderboard by asking who profits from this ordering rather than whether the ordering is correct.",
    related: ["bonding-curve-vault", "signal", "free-rider", "wash-attestation"],
    mode: "motus"
  },
  {
    id: "atom-squatting",
    term: "Atom Squatting",
    domain: "Intuition",
    short: "Creating identifiers for entities you do not represent, to capture creator fees or to poison the canonical choice.",
    long: "Because atom creation is permissionless and content-derived, anyone can mint an identifier that appears to represent a company, a person, or a protocol. Two harms follow. Economically, the creator of an atom earns a share of deposits into its vault, so squatting a valuable identifier taxes everyone who later stakes on it. Semantically, the presence of multiple plausible identifiers for one entity fragments liquidity and forces every consumer to decide which is canonical, which is exactly the ambiguity an impersonator wants. The defenses are the ones that apply to any open namespace: authoritative self-attestation from a verifiable account or contract address, search-and-reuse built into creation flows, and reading the staked weight and the attesting parties rather than the label.",
    why: "Every open namespace gets squatted, and it is always cheaper to claim your identifiers early than to contest them later — the same lesson as domains, package registries, and social handles. Add emerging identifier namespaces to the brand-protection function you already run, and make sure the claim is made from an address or account that can prove it is you.",
    related: ["atom", "schelling-point", "dpns", "curation-market"],
    mode: "motus"
  },
  {
    id: "validator-session",
    term: "Validator Session",
    domain: "Intuition",
    short: "A bounded period during which a fixed validator set is authorized to produce and finalize blocks.",
    long: "In session-based consensus designs the validator set is not continuously fluid; it is fixed for the duration of a session, keys for that session are established at its start, and membership changes take effect only at a session boundary. That gives every participant a stable, agreed-upon set to verify signatures against, and it bounds how long a compromised key remains useful. The security questions to ask of any such design are concrete: how is the set for the next session selected, what is the session length, are session keys distinct from long-term identity keys, and what happens if a session's set becomes unavailable partway through. For a layer-three network settling to another chain, the answers determine whether a validator failure is a halt, a censorship event, or a safety failure, so verify the current parameters in the network documentation rather than assuming.",
    why: "Session boundaries are the underrated lever in any rotating-authority system: they convert continuous key exposure into bounded exposure and give you a natural moment for rotation, revocation, and membership change. The same shape appears in Kerberos tickets, workload identity tokens, and short-lived certificates, and the leadership question is always the same — how long is the window, and what can an attacker accomplish inside it?",
    related: ["trust-token", "threshold-bft", "sequencer", "finality"],
    mode: "motus"
  },
  {
    id: "knowledge-graph-integrity",
    term: "Knowledge Graph Integrity",
    domain: "Intuition",
    short: "Whether the claims, weights, and identifiers in a shared graph still reflect honest belief rather than manipulation.",
    long: "Integrity here is not a hash check; the graph is append-only and every entry is authentic in the cryptographic sense. The question is semantic: are entities represented by canonical identifiers or fragmented across near-duplicates, is the staked weight on a claim independent conviction or the same actor wearing many faces, are the predicates converging on shared vocabulary or proliferating into private dialects, and has anyone contested the false claims through the counter vaults. Assessing it means measuring identifier convergence, staker independence and funding provenance, predicate reuse, and the ratio of contested to uncontested high-value claims — none of which any single on-chain field reports.",
    why: "This is where the whole glossary converges for the coming decade: as AI systems consume shared graphs as ground truth, the integrity of those graphs becomes an input to model behavior at scale, and poisoning the source is more efficient than attacking the model. A security leader who can assess graph integrity is defending the premises of every downstream decision, which is a far better position than auditing the conclusions.",
    related: ["triple", "attestation", "rag-poisoning", "wash-attestation", "credible-neutrality"],
    mode: "both"
  }
];
