import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-decinfra",
  act: "ACT IV — CHAIN",
  order: 8,
  title: "THE PERMANENT RECORD",
  subtitle: "Decentralized storage, decentralized compute, and the security of data you can never take back",
  essence: "violet",
  thesis: "Decentralization relocates the security problem, it does not dissolve it. When you surrender the delete key you must buy it back with cryptography. When you surrender the datacenter you must buy back isolation with economics and with hypervisors. Every guarantee a distributed substrate gives you is paid for by a guarantee it takes away, and the engineer who cannot name the trade has not designed anything.",
  statement: "Write nothing to a permanent substrate that you would not be willing to defend, unchanged, in a deposition twenty years from now.",
  why: "Most security engineers learn their craft on systems where the last resort always exists: pull the plug, revoke the object, purge the bucket, restore from yesterday. Decentralized infrastructure removes the last resort by design. Arweave is engineered so that no operator can delete your data, which also means no operator can delete your mistake. IPFS is engineered so that content is named by its hash, which means a leaked file can be renamed by nobody and re-served by anybody. Golem and its peers are engineered so that strangers execute code on strangers hardware, which means the isolation boundary is the only thing standing between a paying customer and a rootkit. These properties are genuinely valuable — permanence defeats silent revisionism, content addressing defeats supply-chain substitution, open compute defeats regional capacity monopolies — but each one converts a familiar operational control into a cryptographic or economic one. This chapter teaches the conversion. You will learn what permanence actually costs, what a content identifier actually promises, what a storage proof actually proves, how to run someone else code on your metal without losing the metal, and how to satisfy a right-to-erasure request against a ledger that has never forgotten anything. Then you will learn to draw the seam: the architecture where a regulated, centralized organization meets an unowned substrate, and where every control must be re-derived from first principles because the old ones no longer apply.",
  outcomes: [
    "Decompose availability, integrity, durability and permanence into four separate properties with four separate failure modes, and stop letting a vendor sell you one as if it were another.",
    "Model the irreversibility threat: enumerate, before any write, what happens if the payload is wrong, poisoned, personal, or illegal, because after the write there is no remediation path.",
    "Read a content identifier correctly: what a CID proves, what it does not prove, and why content addressing and availability are orthogonal.",
    "Explain what Proof of Replication and Proof of Spacetime actually attest to, and what they leave completely unattested.",
    "Operate untrusted compute: choose deliberately between namespace isolation, gVisor, microVMs and WASM, and defend a provider node against a paying adversary.",
    "Design crypto-shredding as a first-class data-lifecycle control, with key custody, envelope structure and destruction evidence that will survive an audit.",
    "Answer a GDPR erasure request against an immutable substrate without lying to the data subject or to the regulator.",
    "Detect eclipse, Sybil, griefing and incentive attacks against a node fleet you operate, and instrument for them before you need them.",
    "Write and defend a hybrid architecture doctrine that spans a centralized organization and a decentralized substrate, with an explicit seam and explicit trust boundaries."
  ],
  prereq: ["ch-chain"],
  unitUnlock: "u-cartographer",
  sources: [
    {
      label: "Arweave mining and packing documentation, docs.arweave.org",
      note: "The only place that states the mechanics plainly: replica.2.9 packing, 3.6 TB weave partitions, the RandomX H0 then SHA-256 H1 and H2 chain, the single-core SHA-256 bound on the verifiable delay function, and the explicit warning that miners carry their own data-protection compliance risk. Read the mining section before you form any opinion about what permanence costs."
    },
    {
      label: "ANS-104 Bundled Data Item standard, ArweaveTeam/arweave-standards",
      note: "Defines the bundle format that almost all real Arweave writes now use. Tells you that a DataItem is signed by its author via deep-hash, that its id is the SHA-256 of the signature, and that the top-level transaction pays for everything inside it. This is where the bundler trust assumption lives."
    },
    {
      label: "AR.IO gateway documentation, docs.ar.io",
      note: "Explains that gateways index, resolve names, cache and serve — and that operators differ in indexing choices and moderation policy. The clearest available statement that the permanent layer and the layer you actually read from are not the same layer."
    },
    {
      label: "IPFS DHT concepts, docs.ipfs.tech",
      note: "Gives the real Kademlia parameters: the 0 to 2 to the 256 address space, K equal to 20 links per distance bucket, SHA-256 peer ordering, provider records keyed by multihash, separate WAN and LAN DHTs, routing table refresh every ten minutes. Use it to reason about how many nodes an adversary needs."
    },
    {
      label: "IPNS Record specification, specs.ipfs.tech",
      note: "The mutable-pointer layer. Sequence numbers, RFC 3339 validity with nanosecond precision, the recommendation that DHT-published records expire within 48 hours, a 10 KiB record ceiling, mandatory Ed25519. Everything you need to reason about rollback and key compromise on a mutable name."
    },
    {
      label: "IPFS Compact Denylist Format, specs.ipfs.tech",
      note: "The .deny grammar with path prefixes, IPNS names and negation, plus double-hashed entries so the denylist itself does not become a directory of abusive content. The single best artifact for teaching that moderation on IPFS happens at gateways, not at the network."
    },
    {
      label: "Peer2PIR: Private Queries for IPFS, arXiv 2405.17307",
      note: "States the leakage precisely: any query within the network leaks the queried content to other peers, across peer routing, provider advertisement and content retrieval. Use it when someone claims IPFS is private because it is decentralized."
    },
    {
      label: "Active Sybil Attack and Efficient Defense Strategy in IPFS DHT, arXiv 2505.01139",
      note: "An active Sybil that returns semantically correct but false data and exploits early termination in Kubo lookups, denying access to targeted content in roughly 80 percent of attempts on recent versions. The proposed SR-DHT-Store defence uses region-based publication rather than attack detection."
    },
    {
      label: "Network-level Censorship Attacks in the InterPlanetary File System, arXiv 2509.06626",
      note: "Shows, in simulation, a single malicious autonomous system censoring 75 percent of IPFS content for more than 57 percent of requester nodes, and roughly 70 percent effectiveness from 62 hijacked prefixes. The antidote to the belief that peer-to-peer routing is immune to BGP."
    },
    {
      label: "Eclipse Attacks on Ethereum Peer-to-Peer Network, arXiv 2601.16560 and ACM Web Conference 2026",
      note: "A five-stage end-to-end eclipse: discovery-table poisoning, DNS peerlist infiltration, network-wide inbound slot occupation, outbound hijack, inbound hijack. Real budgets — 720 public IPs on mainnet, 28 IPs over 100 days for half the DNS list — and real success rates. The best single paper on peer-layer isolation."
    },
    {
      label: "Filecoin storage proving docs and sector lifecycle spec, docs.filecoin.io and spec.filecoin.io",
      note: "WindowPoSt as 48 non-overlapping 30-minute deadlines inside a 24-hour proving period, 32 GiB and 64 GiB sectors, zk-SNARK proofs, slashing to the f099 burn address, fault fees per faulty sector per day, and automatic termination after 42 consecutive faulty proving periods."
    },
    {
      label: "EDPB Guidelines 02/2025 on processing of personal data through blockchain technologies",
      note: "The regulator position, in writing: avoid putting personal data on-chain, treat encrypted and hashed data as still personal, do not treat technical impossibility as an excuse for denying data-subject rights, run a DPIA, and prefer off-chain storage with an on-chain pointer."
    },
    {
      label: "NIST SP 800-88 Rev. 1, Guidelines for Media Sanitization",
      note: "The Clear, Purge and Destroy taxonomy, and the treatment of cryptographic erase as a purge technique whose validity depends entirely on every byte having been encrypted before it was written and on every copy of the key being genuinely destroyed. This is the standard your crypto-shredding claim will be measured against."
    },
    {
      label: "Cofense and Unit 42 reporting on IPFS abuse in phishing operations",
      note: "Field evidence that adversaries stage credential-harvest pages behind public IPFS gateways to inherit the gateway domain reputation and its valid TLS certificate, and that takedown requires gateway-level denylisting because there is no host to serve notice on."
    }
  ],
  pages: [
    {
      id: "ch-decinfra-p1-permanence",
      title: "PERMANENCE AS A SECURITY PROPERTY",
      credential: "Certified Practitioner — Permanence Threat Modeling",
      summary: "Permanence is not a feature you buy, it is a constraint you accept. This Page separates durability from availability from integrity from permanence, teaches how Arweave actually pays for forever, and builds the discipline that must sit in front of every irreversible write: a pre-write gate that assumes the payload is wrong.",
      competencies: [
        "Distinguish durability, availability, integrity and permanence as four independent properties with four distinct adversaries",
        "Explain the Arweave incentive stack — packing, partitions, the recall mechanism, the verifiable delay function, and the endowment — well enough to say what it does and does not guarantee",
        "Enumerate the irreversibility threat model: wrong, poisoned, personal, illegal, and stale payloads",
        "Design and implement a pre-write gate that treats every permanent write as a one-way door",
        "Communicate the permanence trade to a board that has been told immutable means secure"
      ],
      seal: "SEAL-PERMANENCE-I",
      steps: [
        {
          id: "ch-decinfra-p1-s1-four-properties",
          kind: "construct",
          title: "Four Properties Wearing One Word",
          statement: "Durable, available, intact and permanent are four different promises, and vendors sell you the cheapest one using the vocabulary of the most expensive.",
          minutes: 18,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Every storage conversation you will ever have degenerates within ten minutes unless you force this decomposition early. Someone says the data is safe. Safe against what? A disk dying is a durability question. A region browning out is an availability question. A byte flipping or an operator rewriting history is an integrity question. Somebody in five years being unable to prove the document existed in its original form is a permanence question. These have different adversaries, different controls, different costs, and different failure signatures. Conflating them is how organisations end up with eleven replicas of a corrupted file and no way to prove what the file used to say."
            },
            {
              kind: "table",
              title: "The decomposition, and who breaks each one",
              headers: ["Property", "The claim", "Primary adversary", "Control that actually holds", "How it fails silently"],
              rows: [
                ["Durability", "The bytes still exist somewhere", "Hardware entropy, correlated failure, operator error", "Independent replicas across independent failure domains, with restore rehearsals", "All replicas share a bug, a firmware batch, or a bad deploy, and nobody restores until it matters"],
                ["Availability", "You can fetch the bytes right now", "Network partition, routing attack, rate limits, provider outage, denial of service", "Multiple retrieval paths that do not share a chokepoint", "One vendor gateway serves every path and nobody noticed until it was down"],
                ["Integrity", "The bytes are the bytes you wrote", "Silent corruption, malicious substitution, supply-chain tampering", "Content addressing plus signature over the address, verified at read time", "The verification is nominally present but is done by the same party that serves the data"],
                ["Permanence", "The bytes will still be provable years from now, unchanged, without your continued cooperation", "Your own company dissolving, your own contract lapsing, a court order, a rewrite of history", "An economically self-funding substrate with no delete primitive", "You paid a subscription for permanence, so it is really a lease"]
              ]
            },
            {
              kind: "principle",
              title: "The lease test",
              body: "Ask a single question of any permanence claim: what happens if my organisation stops paying, stops existing, and stops caring, on a random Tuesday. If the answer involves anyone continuing to do anything on your behalf because of a commercial relationship, you have bought a lease, not permanence. A lease is often the right purchase. It is never the same purchase."
            },
            {
              kind: "compare",
              left: {
                title: "What a lease gives you",
                items: [
                  "A delete primitive, which is a security control and a legal necessity",
                  "A named counterparty who can be sued, audited and served with process",
                  "Elastic cost that tracks actual retention need",
                  "The ability to fix a mistake by removing it rather than by superseding it",
                  "Contractual data-residency guarantees you can put in a DPIA"
                ]
              },
              right: {
                title: "What permanence gives you",
                items: [
                  "Resistance to silent revisionism by any party including your own leadership",
                  "Survival of the record beyond the survival of the organisation",
                  "No renewal risk, no vendor migration project, no price ratchet",
                  "A provable original for disputes about what a document said at a moment in time",
                  "Loss of the delete primitive, permanently, including for the things you wish you had never written"
                ]
              }
            },
            {
              kind: "callout",
              title: "The sentence that starts every good design review",
              body: "Name the property you are buying, name the property you are giving up, and name the person who will be holding the consequence in five years. If a design document cannot answer those three, it is a procurement document wearing an architecture costume."
            }
          ],
          glossary: ["durability", "availability", "integrity-property", "permanence", "failure-domain"],
          awards: ["four-properties-named"]
        },
        {
          id: "ch-decinfra-p1-s2-arweave-mechanics",
          kind: "lesson",
          title: "How Arweave Actually Pays For Forever",
          statement: "Permanence on Arweave is not a promise from an operator, it is a standing bribe to strangers to keep holding data they cannot read, and you should understand the bribe before you trust it.",
          minutes: 34,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Arweave calls its structure a blockweave rather than a blockchain because a block references not only its predecessor but also a previously mined block chosen by the protocol. To produce a valid block you must demonstrate access to that earlier data. That is the core idea behind proof of access: mining is gated on storage, not merely on computation, so the cheapest way to be a profitable miner is to actually hold a large fraction of the historical dataset. Everything else in the design exists to make that statement true under adversarial optimisation."
            },
            {
              kind: "numbered",
              title: "The mining loop as documented, stage by stage",
              items: [
                "A verifiable delay function advances in steps. Its speed is bounded by single-core SHA-256 throughput, which is deliberately not parallelisable — this removes the advantage of simply buying more cores to grind the search space.",
                "Each VDF step feeds a RandomX computation producing an H0 value for the partition being mined. RandomX is memory-hard and CPU-friendly, which flattens the specialised-hardware advantage.",
                "H0 selects a recall offset. The miner reads the corresponding chunk from local disk and computes an H1 SHA-256 hash. If H1 clears difficulty, that is a solution derived from data held in one partition.",
                "If H1 does not clear, a second recall reads a chunk from anywhere in the weave and produces H2. Clearing difficulty on H2 requires holding data outside the partition you started in, which is exactly the incentive to hold complete replicas.",
                "Data is stored packed, not raw. The current dominant format is replica.2.9, and packing is intentionally expensive so that the profitable strategy is to pack once to disk rather than pack on demand at mining time. Entropy is generated per chunk during packing.",
                "The weave is divided into partitions of 3.6 TB. Around November 2025 the documented figure was roughly 103 partitions, on the order of 373 TB of unique weave data, with early partitions smaller for historical reasons."
              ]
            },
            {
              kind: "prose",
              title: "Why packing matters more than it looks",
              body: "Packing is the anti-deduplication mechanism, and it is the load-bearing security idea. If every miner stored the same raw bytes, a rational cartel would keep one copy and share it, and the network would have the redundancy of a single NAS while charging for a thousand. By requiring miners to store a per-miner encoded representation that costs real compute to produce, the protocol makes the cheap cheat expensive. This is the same design instinct as Filecoin proof of replication, arrived at from a different direction. When you evaluate any storage network, find the anti-deduplication mechanism first. If there is not one, the advertised replication factor is marketing."
            },
            {
              kind: "prose",
              title: "The endowment, stated honestly",
              body: "You pay once. A portion of that payment funds immediate mining rewards and the remainder capitalises a storage endowment which is drawn down over time to keep paying for replication. The model is solvent if and only if the long-run real cost of storing a byte declines faster than the endowment is drawn down. That is an economic assumption about the future of storage media, not a cryptographic guarantee. It has held for decades of magnetic and solid-state improvement. It is not a law of physics, and areal-density improvement has slowed relative to its historical trend. Treat the endowment as a well-designed bet with a long track record, not as a proof. The correct posture is: I believe this substrate will outlive my organisation, and I have a second retrieval path that does not depend on that belief being true."
            },
            {
              kind: "callout",
              title: "The compliance sentence hiding in the mining docs",
              body: "The Arweave mining documentation states plainly that miners are responsible for their own compliance with data protection laws such as GDPR and other applicable laws in their jurisdiction, and that failure to adhere may entail substantial legal risks. Read that again from the position of someone who just wrote customer data to the weave. You have not merely made your own data permanent. You have distributed a compliance liability to thousands of strangers who never agreed to process it, and given them a content policy problem you cannot help them solve."
            },
            {
              kind: "metric",
              title: "The number that reframes the design",
              body: "Zero. That is the number of parties, including the protocol authors, the foundation, the largest miner and you, who possess a delete primitive for data already settled into the weave. Every control you would normally reach for after a bad write — purge, revoke, expire, legal-hold-then-destroy — has a value of zero here. Design as if the delete button does not exist, because it does not."
            },
            {
              kind: "quote",
              body: "The intent is for packing to be an expensive operation — expensive enough that the most profitable strategy is to pack data once and store it to disk rather than store the data unpacked and pack it on demand.",
              source: "Arweave mining documentation, on the replica.2.9 packing format"
            }
          ],
          glossary: ["blockweave", "proof-of-access", "packing", "recall-block", "storage-endowment", "verifiable-delay-function"],
          awards: ["read-the-substrate"]
        },
        {
          id: "ch-decinfra-p1-s3-drill-one-way-door",
          kind: "drill",
          title: "Drill: The Migration That Cannot Be Rolled Back",
          statement: "The moment to exercise judgement about a permanent write is the moment before it, because afterwards judgement has nothing to act on.",
          minutes: 22,
          respect: 165,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Irreversible operations create a specific cognitive failure: the team treats the write as a deploy. Deploys have rollbacks, so deploys get a lighter review. Permanent writes have no rollback, so they need the review weight of a schema migration on a production database with no backup — and almost nobody instinctively gives them that. Your job as the security lead is to change the ritual, not the intention."
            },
            {
              kind: "list",
              title: "What you already know walking in",
              items: [
                "The archive product stores signed, timestamped compliance attestations for enterprise customers. Permanence is the actual product promise.",
                "The pipeline batches records into ANS-104 bundles through a third-party bundler and settles them on-chain.",
                "The schema has an attachments array. Nobody on the security side has audited what customers actually put in attachments.",
                "The dry run wrote to a test environment that pointed at the same production bundler."
              ]
            }
          ],
          drill: {
            id: "ch-decinfra-p1-s3-drill",
            scene: "Wednesday, 16:40. The archive team is forty minutes from a backfill that will write 2.3 million historical customer records to permanent storage in a single sequence of bundles. The change ticket says data migration, low risk, reversible via re-index. You are the security lead. Fifteen minutes ago a data engineer mentioned in a side channel that the attachments array is a free-form blob field, and that during onboarding some customers uploaded whatever they had, including scans. Nobody has classified the contents. The VP of Engineering is on the call and has already told the board this ships today.",
            clock: "40 minutes to the scheduled write",
            pressure: "A board commitment, a team that has worked six weeks on this, and a change ticket that says reversible about an operation that is not",
            prompt: "You have one intervention before the window. What do you do?",
            options: [
              {
                id: "opt-a",
                label: "Halt the backfill and demand a full data classification of all 2.3 million records before any write",
                detail: "The safest-sounding move: nothing goes to a permanent substrate until every field is classified.",
                score: 0,
                outcome: "The write is stopped, which is correct, but you have asked for something that takes six to ten weeks and you have framed it as a precondition. The VP escalates, you are overruled at 17:30 by a compromise that carves out the attachments field and ships the rest, and the carve-out is implemented by an exhausted engineer at 18:00 with no review.",
                ripple: "You spent all of your political capital on a maximalist ask and got a rushed exception in return. Next quarter, the archive team routes around you: they stop mentioning risky details in side channels because mentioning them cost them six weeks. You lost the intelligence source that saved you this time."
              },
              {
                id: "opt-b",
                label: "Let the backfill proceed but require that the attachments field be excluded from this run, and that every record be written under a per-customer envelope key held in your KMS",
                detail: "Ship the migration, drop the one field nobody can vouch for, and make every permanent byte cryptographically destroyable.",
                score: 3,
                outcome: "The team removes one field from a projection — a twenty-minute change they can actually make in the window — and switches the payload to envelope encryption with per-customer data keys wrapped in the KMS. The backfill lands on schedule. What is now permanent is ciphertext whose plaintext availability you control by controlling key material, and the one field of genuinely unknown content is not on the substrate at all.",
                ripple: "You have just installed the two controls that make every future permanent write survivable: exclude the unclassified, and make the classified crypto-shreddable. The archive team now has a reusable pattern instead of a one-off exception, and the next erasure request has a real answer. Six months later, when a customer demands deletion, you destroy a wrapped key in minutes instead of explaining to a regulator why you cannot.",
                isBest: true
              },
              {
                id: "opt-c",
                label: "Let it proceed as-is and open a follow-up ticket to classify attachments and remediate anything sensitive afterwards",
                detail: "Do not block the board commitment; handle the data problem in the next sprint with a proper remediation plan.",
                score: -3,
                outcome: "The write completes. Three weeks later classification finds passport scans and two files containing what appear to be a third party medical records inside attachments. There is no remediation. The data is packed into miner replicas worldwide and referenced by settled transactions. The follow-up ticket is closed with the resolution not technically possible.",
                ripple: "Your organisation is now a permanent, worldwide, unauthorised processor of special-category personal data, and every miner is an unwitting recipient. The incident is unclosable by definition, which means it will appear in every due-diligence questionnaire and every regulator interaction for the life of the company. This is the single most expensive of the four choices and it is the one that felt like the least disruptive."
              },
              {
                id: "opt-d",
                label: "Redirect the run to a private staging network first, review the output, then replay to mainnet tomorrow",
                detail: "A staged rollout: same code path, non-permanent target, human review of a sample, then the real write.",
                score: 1,
                outcome: "You buy a day and see the data, which is genuinely useful. But sampling 2.3 million records by eye finds the common cases and misses the rare ones, and rare is exactly where the passport scans live. Worse, the team replays the next day under more schedule pressure with the same unclassified field still in scope, and the review becomes a rubber stamp because it already passed once.",
                ripple: "You converted an unreviewed write into a lightly reviewed write and taught the organisation that a staging pass constitutes diligence for irreversible operations. The next permanent write skips the field-level question entirely because staging is now the ritual. You built a control that consumes attention without reducing the actual risk."
              }
            ],
            debrief: "Option B wins because it is the only choice that changes the shape of the risk rather than its schedule. Halting entirely (A) and staging (D) both operate on time, and time is not the problem — an unclassified free-form field is just as dangerous next month as it is tonight. Proceeding with a follow-up (C) is the classic irreversibility error: it applies deploy-shaped reasoning, where remediation exists, to a one-way door, where it does not. B does two things at once. First, it removes from scope the only data whose contents genuinely nobody can vouch for, which is a small, achievable change that fits in the window and is therefore actually implementable under pressure. Second, it converts the remaining permanent data from plaintext into ciphertext under keys you hold, which restores an approximation of the delete primitive you were about to give up forever. Note what B does not do: it does not claim the encryption makes the data non-personal — under EDPB guidance encrypted data remains personal data — and it does not promise the customer that deletion is complete. It buys you a defensible, exercisable control, and the honest statement that accompanies it: we cannot remove the ciphertext, we can and will destroy the key. The deeper lesson is about the shape of a good intervention under a clock. A security lead who can only say stop is a speed bump. A security lead who can name the smallest change that materially reduces irreversible risk, and who can implement it inside the window the business already has, becomes the person the team calls before the next migration rather than the person they route around.",
            principle: "Before an irreversible write, remove what you cannot classify and encrypt what you can, because after the write your only remaining lever is key custody."
          },
          glossary: ["one-way-door", "envelope-encryption", "crypto-shredding", "data-classification"],
          awards: ["one-way-door-guardian", "pre-write-discipline"]
        },
        {
          id: "ch-decinfra-p1-s4-irreversibility",
          kind: "lesson",
          title: "The Irreversibility Threat Model",
          statement: "When remediation is impossible, prevention is not the best control, it is the only control, and your entire risk budget must move upstream of the write.",
          minutes: 30,
          respect: 155,
          trust: 8,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Standard risk practice implicitly assumes a response function. FAIR decomposes loss into primary and secondary; incident response frameworks assume containment, eradication and recovery; the NIST Cybersecurity Framework has Respond and Recover as two of its six Functions. All of that machinery assumes that after a bad event you can act on the world to reduce loss. On a permanent substrate, for the class of harm that is the data itself, that assumption fails. Eradication has no implementation. Recovery means only that you carry on. Your loss curve has no tail-reduction term, so the only place to spend is before."
            },
            {
              kind: "table",
              title: "The five irreversible payload failures, and the pre-write control that answers each",
              headers: ["Failure class", "What it looks like", "Why remediation fails", "Pre-write control"],
              rows: [
                ["Wrong", "A schema bug writes the wrong customer id on 400k records", "Superseding records do not delete the erroneous ones, and any reader can still read the original", "Write a canary batch, verify by independent read path, then gate on a checksum of the projection, not of the source"],
                ["Poisoned", "An adversary who owns your ingestion pipeline writes attacker-chosen content that is now permanent and attributable to your signing key", "You cannot unpublish; you can only publish a repudiation that most readers will never fetch", "Sign at the boundary with a key the pipeline cannot use unattended, and require a second-party approval for bulk writes"],
                ["Personal", "Free-form fields contain names, identifiers, health or biometric data nobody classified", "Erasure rights cannot be satisfied by deletion, and the data is replicated to parties you cannot instruct", "Field-level allowlists, never denylists; unclassified fields are excluded by default"],
                ["Illegal", "User-generated content includes material that is criminal to possess in some jurisdictions", "Every replica holder becomes a possessor; you have created legal exposure for strangers", "Do not put user-generated binary content on a permanent substrate without hash-matching, human review, and an accepted-risk sign-off"],
                ["Stale", "You permanently publish a credential, endpoint or policy that will later be wrong and is now quoted forever", "Correction requires the reader to check for a newer version, which most integrations will not do", "Publish pointers with validity windows and expiry semantics, never bare facts that will age"]
              ]
            },
            {
              kind: "principle",
              title: "Allowlist the fields, never denylist them",
              body: "A denylist of sensitive fields fails on the first schema change, because the new field is not on the list and therefore ships. An allowlist of permitted fields fails safe, because the new field is not on the list and therefore does not ship. On a substrate with no delete, the difference between fail-open and fail-closed is the difference between an inconvenience and an unclosable incident. Every serialiser that writes to permanent storage must enumerate what it emits, and the build must fail when a struct grows a field the serialiser has not been taught about."
            },
            {
              kind: "prose",
              title: "The second-order effect nobody models",
              body: "Permanent writes leak organisational structure over time. Each write carries metadata: a signing key, a timestamp, a bundler, a tag set, a size distribution. Individually harmless. Aggregated across years, they describe your release cadence, your customer growth curve, your outage windows, the moment you changed vendors, and the exact week you started onboarding a class of customer you have not announced. A competitor or an adversary who indexes your permanent writes gets a business intelligence feed you cannot revoke. This is not hypothetical reasoning; it is the same traffic-analysis logic that makes encrypted-message metadata valuable. Decide deliberately: rotate signing identities, pad and batch on a fixed schedule rather than an event-driven one, and stop putting semantically rich tags on writes because they made indexing convenient."
            },
            {
              kind: "checklist",
              title: "The pre-write gate — every item is blocking",
              items: [
                "Every field in the emitted payload appears on an explicit allowlist, and the build fails if the source struct has fields the allowlist does not mention",
                "No free-form, user-supplied binary or text field is emitted without either exclusion, hash-matching against known-bad sets, or a documented accepted-risk decision naming an owner",
                "All payload content is envelope-encrypted under a per-subject data key, with the key wrapped by a KMS key you control and can destroy",
                "Bulk writes above a defined record threshold require a second human approver who is not on the implementing team",
                "The canary batch has been written and independently read back through a retrieval path that does not share code with the writer",
                "The tag and metadata set has been reviewed for what it discloses in aggregate over five years, not just what it discloses today",
                "There is a written statement of what your organisation will tell a data subject who requests erasure of this data, and legal has seen it"
              ]
            },
            {
              kind: "callout",
              title: "The interview question that separates levels",
              body: "Ask a candidate: what is your rollback plan for a permanent write. A junior engineer describes a compensating record. A senior engineer says there is no rollback and describes their pre-write gate. A principal engineer says there is no rollback, describes the gate, and then tells you which field on their current schema they still are not comfortable with and what they are doing about it. The third answer is the only one that indicates the person has actually operated one of these systems."
            }
          ],
          glossary: ["irreversibility", "field-allowlist", "canary-write", "traffic-analysis", "accepted-risk"],
          awards: ["prevention-only-mindset"]
        },
        {
          id: "ch-decinfra-p1-s5-lab-pre-write-gate",
          kind: "lab",
          title: "Lab: Build the Pre-Write Gate",
          statement: "A policy that lives in a document is advice, a policy that fails the build is a control.",
          minutes: 38,
          respect: 175,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "You are going to build the smallest thing that actually prevents the failure in the drill: a serialisation gate that refuses to emit any field it has not been explicitly taught, encrypts what it does emit under a per-subject key, and produces an auditable record of the decision. Run it locally. Then break it by adding a field to the source type and confirm that it fails closed rather than silently shipping the new field to a substrate with no delete."
            },
            {
              kind: "code",
              title: "The allowlist serialiser — fails closed on schema drift",
              lang: "typescript",
              body: "type SubjectRecord = {\n  subjectId: string;\n  attestationHash: string;\n  issuedAt: string;\n  issuerKeyId: string;\n  attachments: unknown[];\n  internalNotes: string;\n};\n\nconst PERMANENT_FIELDS = [\n  'subjectId',\n  'attestationHash',\n  'issuedAt',\n  'issuerKeyId'\n] as const;\n\ntype PermanentField = typeof PERMANENT_FIELDS[number];\n\ntype Reviewed = Record<keyof SubjectRecord, 'emit' | 'exclude'>;\n\nconst REVIEW: Reviewed = {\n  subjectId: 'emit',\n  attestationHash: 'emit',\n  issuedAt: 'emit',\n  issuerKeyId: 'emit',\n  attachments: 'exclude',\n  internalNotes: 'exclude'\n};\n\nexport function project(record: SubjectRecord): Pick<SubjectRecord, PermanentField> {\n  const unreviewed = Object.keys(record).filter(k => !(k in REVIEW));\n  if (unreviewed.length > 0) {\n    throw new Error('permanent-write blocked: unreviewed fields ' + unreviewed.join(','));\n  }\n  return {\n    subjectId: record.subjectId,\n    attestationHash: record.attestationHash,\n    issuedAt: record.issuedAt,\n    issuerKeyId: record.issuerKeyId\n  };\n}"
            },
            {
              kind: "prose",
              title: "Why the Reviewed type is the actual control",
              body: "The runtime check catches drift at execution time, which is late. The Reviewed mapped type catches it at compile time, which is early. Because Reviewed is declared as Record over keyof SubjectRecord, adding a field to SubjectRecord makes REVIEW structurally incomplete and the type check fails. Whoever adds the field must make a conscious emit-or-exclude decision to get the build green. That is the whole trick: move the decision from a code review that a tired person may skim into a compiler error that nobody can skim. Keep both checks — the compile-time one for your code, the runtime one for payloads that arrive from outside your type system."
            },
            {
              kind: "code",
              title: "Envelope encryption before the write, so the key is the delete primitive",
              lang: "typescript",
              body: "import { randomBytes, createCipheriv } from 'node:crypto';\n\ntype Envelope = {\n  v: 1;\n  keyRef: string;\n  wrappedDataKey: string;\n  iv: string;\n  tag: string;\n  ciphertext: string;\n};\n\nexport async function seal(\n  plaintext: Buffer,\n  subjectId: string,\n  kms: { wrap: (dk: Buffer, ctx: Record<string, string>) => Promise<{ ref: string; blob: Buffer }> }\n): Promise<Envelope> {\n  const dataKey = randomBytes(32);\n  const iv = randomBytes(12);\n  const cipher = createCipheriv('aes-256-gcm', dataKey, iv);\n  cipher.setAAD(Buffer.from(subjectId, 'utf8'));\n  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);\n  const tag = cipher.getAuthTag();\n  const wrapped = await kms.wrap(dataKey, { subjectId, purpose: 'permanent-archive' });\n  dataKey.fill(0);\n  return {\n    v: 1,\n    keyRef: wrapped.ref,\n    wrappedDataKey: wrapped.blob.toString('base64'),\n    iv: iv.toString('base64'),\n    tag: tag.toString('base64'),\n    ciphertext: ciphertext.toString('base64')\n  };\n}"
            },
            {
              kind: "list",
              title: "Three details in that function that are not decoration",
              items: [
                "The subjectId is bound as additional authenticated data. A ciphertext lifted from one subject record and replayed under another subject fails authentication instead of decrypting into a plausible-looking cross-contamination.",
                "The data key is zeroed immediately after wrapping. On a permanent-write path, a data key lingering in a heap dump or a core file is the one copy that survives your shredding ceremony.",
                "The wrapping context carries the subjectId and purpose. Your KMS can then enforce that a key wrapped for permanent-archive is never unwrapped by the analytics service, and your audit log records the purpose of every unwrap without you having to correlate it later."
              ]
            },
            {
              kind: "code",
              title: "The write gate as a shell step, with an independent read-back",
              lang: "bash",
              body: "set -euo pipefail\n\nBATCH=canary-$(date -u +%Y%m%dT%H%M%SZ)\n\nnode ./bin/project-and-seal.js --in ./staging/records.ndjson --out ./out/$BATCH.ndjson\n\nRECORDS=$(wc -l < ./out/$BATCH.ndjson)\nif [ $RECORDS -gt 500 ]; then\n  echo 'canary batch too large, refusing' >&2\n  exit 1\nfi\n\nsha256sum ./out/$BATCH.ndjson | tee ./out/$BATCH.sha256\n\nnode ./bin/publish.js --in ./out/$BATCH.ndjson --tag batch=$BATCH\n\nsleep 120\n\nnode ./bin/read-back.js --tag batch=$BATCH --expect ./out/$BATCH.sha256 --via independent-gateway\n\necho 'canary verified, proceed to bulk with second approver'"
            },
            {
              kind: "callout",
              title: "The read-back must not share code with the writer",
              body: "If your verification uses the same client library, the same gateway and the same serialiser as the write, you are testing that your code agrees with itself. That test passes when the code is uniformly wrong. Use a second gateway operator, and where possible a second implementation, for read-back. On IPFS this means fetching through a gateway you do not operate; on Arweave it means resolving through a different AR.IO gateway than the one your bundler is friendly with. The cost is a few lines of configuration. The benefit is that the one class of bug that permanence makes unfixable — a systematically wrong projection — is the exact class this catches."
            }
          ],
          praxis: "Implement the gate against a schema from a system you actually work on, then deliberately add a field to the source type and capture the failing build.",
          glossary: ["fail-closed", "additional-authenticated-data", "key-wrapping", "read-back-verification"],
          awards: ["gate-builder", "fails-closed"]
        },
        {
          id: "ch-decinfra-p1-s6-council-board",
          kind: "council",
          title: "Council: The Board Heard Immutable And Understood Secure",
          statement: "Your job in that room is not to explain the technology, it is to relocate one word in the directors mental model from the asset column to the liability column without sounding like you are against the strategy.",
          minutes: 26,
          respect: 140,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "A board has approved a strategy built on permanent storage. Someone in the pitch said immutable, and everyone in the room heard tamper-proof, which they mapped to secure, which they mapped to lower risk. All of that is partly true and the composition is dangerously wrong. You are now in the risk committee with eleven minutes. If you open with the mechanics you will lose them; if you open with objections you will be classified as the department of no and the strategy will proceed without your controls attached. There is a narrow, effective path and it starts by agreeing with them."
            },
            {
              kind: "numbered",
              title: "The eleven-minute structure that works",
              items: [
                "Affirm the win in their language, specifically. Immutability means no insider, no vendor and no future management team can quietly alter a record after the fact. That is a genuine governance improvement and it is why this strategy is worth having. Say this first and mean it.",
                "Introduce the symmetry in one sentence. The property that stops anyone from changing a record is the same property that stops us from removing one. There is no version of this that gives us the first without the second.",
                "Make it concrete with a scenario they already fear, not a technical one. A customer exercises their right to erasure. Under our current architecture we delete. Under the new one, we cannot, and the honest answer to the customer and the regulator is that we destroy the key rather than the data.",
                "Present the control, not the objection. We can make that answer defensible by encrypting everything before it is written, holding keys ourselves, and never writing unclassified fields. That is a design decision we must make now because it cannot be retrofitted.",
                "State the decision you are asking for, with a date. I am asking for an architecture standard mandating encrypt-before-write and field allowlisting for permanent storage, approved before the first production write in the launch plan.",
                "Name the residual risk out loud and own it. Even with this, we accept that ciphertext is permanent and that a future cryptographic break or a key-custody failure would be unrecoverable. I am recommending we accept that, and I want it recorded as accepted rather than unexamined."
              ]
            },
            {
              kind: "compare",
              left: {
                title: "Framings that get you ignored",
                items: [
                  "This technology is not mature enough for us",
                  "GDPR makes this illegal",
                  "We should use S3 with object lock instead",
                  "Engineering did not consult security before the pitch",
                  "Here is how proof of access and packing work"
                ]
              },
              right: {
                title: "Framings that get you the standard approved",
                items: [
                  "The property we bought is real and here is its exact price",
                  "Erasure requests become a key-destruction process, and that is defensible if we design for it now",
                  "This control costs two weeks now and cannot be added later at any price",
                  "I want the residual risk recorded as an accepted decision of this committee",
                  "Here is the one question I want asked at every future permanent-storage go-live"
                ]
              }
            },
            {
              kind: "principle",
              title: "Never make a board choose between your control and their strategy",
              body: "If the only two options on the table are their plan and your plan, you lose, and you should lose, because they own the strategy and you do not. Your leverage comes from making your control a component of their plan rather than an alternative to it. The sentence that does this is: I am not asking you to reconsider the strategy, I am asking you to fund the one part of it that cannot be added later."
            },
            {
              kind: "callout",
              title: "The question you plant for every future go-live",
              body: "Leave the room with one durable artifact: a standing question added to the go-live checklist that any non-technical director can ask. If a customer demanded that this data be erased on the day after launch, what exactly would we do, and who has approved that answer. That question, asked by a director, does more work over three years than any architecture document you will write, because it forces the answer to exist before the write rather than after the request."
            }
          ],
          glossary: ["residual-risk", "accepted-risk-record", "governance-function", "erasure-posture"],
          awards: ["room-reframer", "control-not-objection"]
        }
      ]
    },
    {
      id: "ch-decinfra-p2-cas",
      title: "CONTENT ADDRESSING AND THE AVAILABILITY LIE",
      credential: "Certified Practitioner — Content-Addressed Storage Security",
      summary: "A content identifier is a claim about bytes, not a claim about the world. This Page teaches what a CID proves and what it silently does not, how the distributed hash table leaks the interests of everyone who uses it, why the pinning service is the centralization you thought you escaped, how public gateways became phishing infrastructure, and what Filecoin proofs actually attest.",
      competencies: [
        "State precisely what a CID guarantees and enumerate the four guarantees people wrongly assume it carries",
        "Reason quantitatively about the IPFS DHT — Kademlia parameters, provider records, and the adversary node counts that matter",
        "Operate a Kubo node like a professional: pinning, provider republication, gateway isolation, and verified retrieval",
        "Recognise and defend against gateway-inherited trust in phishing and malware staging",
        "Explain Proof of Replication and Proof of Spacetime, and name what remains unproven after both succeed",
        "Maintain a provenance register that binds CIDs to signed, dated, human-owned assertions"
      ],
      seal: "SEAL-CONTENT-ADDRESS-I",
      steps: [
        {
          id: "ch-decinfra-p2-s1-cid-is-a-name",
          kind: "construct",
          title: "A CID Is A Name, Not A Promise",
          statement: "Content addressing gives you integrity for free and gives you availability not at all, and almost every architecture mistake in this domain comes from conflating the two.",
          minutes: 20,
          respect: 85,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "A content identifier is a self-describing hash: a version, a multicodec saying what the bytes mean, a multihash saying which function produced the digest, and the digest itself. Its entire semantic content is one conditional. If someone hands you bytes and those bytes hash to this identifier, then those bytes are the ones the identifier names. That is an enormous property. It means nobody in the delivery path — no CDN, no mirror, no compromised gateway, no state-level interceptor — can substitute different bytes without you detecting it, provided you actually verify. It is also a narrow property, and the narrowness is where people get hurt."
            },
            {
              kind: "table",
              title: "What a CID proves, and the four things people assume it proves",
              headers: ["Assumption", "True?", "What is actually the case"],
              rows: [
                ["These bytes are the ones named by this identifier", "Yes", "This is the whole guarantee, and it holds against any adversary in the delivery path, conditional on you verifying rather than trusting the server"],
                ["Someone, somewhere, is storing these bytes", "No", "A CID can be computed from data that was never published, or that was published and has since been garbage-collected everywhere. Addressability and availability are orthogonal"],
                ["The bytes are authentic — the right author produced them", "No", "A hash has no author. Anyone can publish anything and compute its CID. Authenticity requires a signature over the CID by a key you have independently bound to an identity"],
                ["The bytes are current", "No", "Content addressing is inherently immutable, which means it is inherently stale. Freshness requires a mutable pointer such as IPNS or DNSLink, and that pointer has its own key-compromise and rollback threat model"],
                ["Fetching them is private", "No", "Requesting a CID over the public network tells peers which content you want. This is documented leakage across peer routing, provider advertisement and retrieval, and it is the motivation for privacy work such as double hashing and private information retrieval"]
              ]
            },
            {
              kind: "principle",
              title: "Verify at the edge you control",
              body: "The value of content addressing is realised at exactly one moment: when your own code recomputes the hash of the bytes it received and compares it to the identifier it expected. If you fetch by CID through a gateway over HTTPS and trust the response body because the TLS certificate was valid, you have paid for content addressing and used TLS. You have the security of the gateway operator, not the security of the hash. This mistake is nearly universal in production code, because the gateway response looks like an ordinary web response and ordinary web responses are not verified."
            },
            {
              kind: "compare",
              left: {
                title: "Content addressing, honestly stated",
                items: [
                  "Integrity without a trusted delivery path",
                  "Natural deduplication and cacheability",
                  "Stable references that survive vendor migration",
                  "Tamper-evidence for supply-chain artifacts",
                  "No authorship, no freshness, no availability, no privacy"
                ]
              },
              right: {
                title: "Location addressing, honestly stated",
                items: [
                  "Availability delegated to a named, accountable operator",
                  "Freshness by construction — the URL returns whatever is current",
                  "Access control, revocation and deletion all exist",
                  "Authenticity borrowed from the domain and its certificate",
                  "Integrity only as good as every party in the delivery path"
                ]
              }
            },
            {
              kind: "callout",
              title: "The composition that is actually correct",
              body: "Use content addressing for what the bytes are, a signature for who says so, a mutable pointer with a short validity for what is current, and an explicit availability strategy — your own pin, plus a paid deal, plus a fallback origin — for whether you can get them at all. Four mechanisms, four properties. Anyone selling you one mechanism for four properties is selling you a gap."
            }
          ],
          glossary: ["content-identifier", "multihash", "multicodec", "location-addressing", "tamper-evidence"],
          awards: ["cid-literacy"]
        },
        {
          id: "ch-decinfra-p2-s2-dht-leakage",
          kind: "lesson",
          title: "The Distributed Hash Table Knows What You Want",
          statement: "Every lookup you make in a public DHT is a signed confession of interest broadcast to strangers, and the strangers are cheap to become.",
          minutes: 32,
          respect: 160,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "IPFS content routing runs on Kademlia. The address space runs from zero to two to the power of two hundred fifty six. Peers are ordered by SHA-256 of their peer identifier and records are projected into the same space by SHA-256 of the record key. Each peer maintains up to K equal to twenty links for each power-of-two distance bucket, which is what buys logarithmic lookup. Providers publish provider records — a mapping from a content multihash to their own peer identifier — to the K closest peers to that content, and only a node can advertise its own content. There is a separate WAN and LAN DHT with different protocol identifiers, and routing tables refresh on the order of every ten minutes."
            },
            {
              kind: "prose",
              title: "Read those parameters as an adversary",
              body: "K equal to twenty is the number that matters. To censor a specific piece of content you do not need to control the network; you need to control the neighbourhood of one key. Published research on active Sybil attacks in the IPFS DHT demonstrates exactly this: place Sybil nodes strategically around the target identifier, return semantically correct but intentionally false data, and exploit an early-termination behaviour in Kubo lookups. On recent versions the reported result is denial of access to targeted content in roughly eighty percent of lookup attempts. The proposed mitigation, SR-DHT-Store, avoids trying to detect the attack at all and instead publishes into a region computed from a dynamic XOR distance, which is the right instinct — detection-based defences in an open membership system lose to whoever is willing to spin up more identities."
            },
            {
              kind: "table",
              title: "Three leakage surfaces in one lookup, and what each discloses",
              headers: ["Surface", "Who learns what", "Why it is hard to fix", "Practical mitigation today"],
              rows: [
                ["Peer routing", "Every peer on the lookup path learns the key you are walking toward, and by extension your area of interest", "The routing algorithm requires disclosing the target to make progress", "Route through your own trusted node, or use delegated routing you operate; treat the public DHT as an observed channel"],
                ["Provider advertisement", "The K closest peers learn that you specifically hold this content, tied to your peer id and therefore your IP", "Advertisement is the mechanism by which anyone can find you at all", "Do not advertise sensitive content; serve it over an authenticated path and use the DHT only for public artifacts"],
                ["Content retrieval", "The serving peer learns your peer id, your address, and exactly which block you fetched", "Bitswap is a direct exchange with a peer who by definition sees the request", "Fetch through a node you control that is not attributable to the person asking; never fetch sensitive CIDs from an end-user device"]
              ]
            },
            {
              kind: "prose",
              title: "Double hashing, and why the denylist is the clearest teacher",
              body: "The privacy programme in this ecosystem converges on double hashing: rather than querying for a plain content address, you query for a hash of it, so intermediaries learn less about the underlying content and gain a degree of k-anonymity from prefix collisions. The most instructive deployment of the idea is not in routing but in the compact denylist format. A .deny file lists entries by path, by prefix, by IPNS name, with negation for exceptions — and it supports double-hashed entries specifically so that readers of a denylist cannot recover the original content addresses. The stated reason is precise and worth memorising: it avoids making the denylist a directory of bad content. Sit with that. A moderation artifact for a censorship-resistant network had to be designed so that publishing the list of things to block does not itself publish the things. That constraint recurs everywhere in this domain."
            },
            {
              kind: "metric",
              title: "The cost curve that should worry you",
              body: "Twenty. That is how many peer slots surround a given key, and therefore the order of magnitude of Sybil identities needed to dominate a single piece of content. Compare that to the resources shown necessary to eclipse an Ethereum node — hundreds of public IP addresses, sustained over weeks. Targeted content censorship in an open DHT is dramatically cheaper than targeted node isolation on a blockchain, and it is cheap enough that you should assume any content genuinely worth suppressing is suppressible unless you hold an independent retrieval path."
            },
            {
              kind: "callout",
              title: "The network layer is not immune either",
              body: "Peer-to-peer routing does not escape the Internet. Research on network-level censorship in IPFS shows a single malicious autonomous system censoring seventy-five percent of content for more than fifty-seven percent of requester nodes, with roughly seventy percent effectiveness achievable from sixty-two hijacked prefixes — an outcome enabled by how much peer-to-peer infrastructure has concentrated into a handful of large public clouds. Decentralisation at the application layer sitting on centralisation at the routing layer gives you the operational complexity of the former and the failure domain of the latter."
            }
          ],
          glossary: ["kademlia", "provider-record", "bitswap", "double-hashing", "sybil-attack", "k-anonymity"],
          awards: ["dht-realist", "leak-mapper"]
        },
        {
          id: "ch-decinfra-p2-s3-lab-kubo",
          kind: "lab",
          title: "Lab: Run Kubo Like An Operator, Not Like A Demo",
          statement: "A default IPFS node advertises what you hold, dials whoever asks, and lets the DHT decide whether your data is reachable, and none of those three defaults belong in production.",
          minutes: 36,
          respect: 150,
          trust: 8,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "The gap between the getting-started tutorial and an operable node is entirely about defaults. Out of the box, a node joins the public DHT, advertises every block it holds, accepts inbound connections from anyone, and exposes an HTTP API on localhost that has historically been a favourite of drive-by browser-based attacks. This lab walks the changes that matter and, more importantly, the verification that proves each change took effect."
            },
            {
              kind: "code",
              title: "Initialise with a server profile and confirm what changed",
              lang: "bash",
              body: "set -euo pipefail\n\nexport IPFS_PATH=/srv/ipfs\n\nipfs init --profile server\n\nipfs config Addresses.API /ip4/127.0.0.1/tcp/5001\nipfs config Addresses.Gateway /ip4/127.0.0.1/tcp/8080\n\nipfs config --json Swarm.ConnMgr.HighWater 200\nipfs config --json Swarm.ConnMgr.LowWater 100\n\nipfs config --json Gateway.NoFetch true\n\nipfs config Routing.Type dhtclient\n\nipfs config show | head -n 60"
            },
            {
              kind: "list",
              title: "What each of those lines is actually buying you",
              items: [
                "The server profile disables local network discovery, which stops your node from probing RFC1918 space and from being discovered by anything else on the subnet. On a cloud host, local discovery is pure attack surface and zero benefit.",
                "Binding the API to loopback is non-negotiable. The Kubo HTTP API is a full administrative interface — it can add content, modify config and pin data. An exposed API is a remote takeover of your storage identity, and it has been found exposed in the wild repeatedly.",
                "Gateway.NoFetch true makes your gateway serve only what you already hold rather than fetching arbitrary content from the network on behalf of a requester. Without it, anyone who can reach your gateway can use your node as an open proxy that caches whatever they name — including content you would very much prefer never touched your disk.",
                "Routing.Type dhtclient means you query the DHT but do not serve as a DHT server for others. For a node whose job is to hold your organisation content, being a routing server adds inbound load and adds your node to other parties routing tables for no benefit to you.",
                "Connection manager bounds prevent a peer-count blowup from consuming your file descriptors, which is the most common way a small node degrades under an unfriendly network."
              ]
            },
            {
              kind: "code",
              title: "Pin, verify by recomputation, and prove the provider record exists",
              lang: "bash",
              body: "CID=$(ipfs add -Q --cid-version 1 --raw-leaves ./artifact.tar.zst)\necho published $CID\n\nipfs pin add --recursive $CID\n\nipfs cat $CID > /tmp/roundtrip.tar.zst\nRECOMPUTED=$(ipfs add -Q --only-hash --cid-version 1 --raw-leaves /tmp/roundtrip.tar.zst)\n\nif [ $RECOMPUTED != $CID ]; then\n  echo integrity check failed >&2\n  exit 1\nfi\n\nipfs routing provide $CID\n\nipfs routing findprovs --num-providers 5 $CID"
            },
            {
              kind: "prose",
              title: "The part of that script that teaches the real lesson",
              body: "Run the findprovs command from a machine in a different network, an hour later, and then again a day later. What you are measuring is provider record decay. Provider records are not permanent; they expire and must be republished, and republication competes with churn in the peer set holding them. A pin guarantees your node keeps the bytes. It does not guarantee that anyone can find your node. Teams discover this the first time an artifact that resolved perfectly in testing becomes unresolvable in production a week later, and they blame the network when the actual cause is that nothing republished. If availability matters, run explicit reprovide, monitor findprovs from outside your network as a synthetic check, and hold a second retrieval path that does not use the DHT at all."
            },
            {
              kind: "checklist",
              title: "Verification, not configuration — prove each of these from outside the host",
              items: [
                "Port 5001 is not reachable from anywhere except loopback, confirmed by an external scan and not by reading the config",
                "A request to your gateway for a CID you have never held returns not found rather than fetching it, confirming NoFetch is in effect",
                "findprovs from an unrelated network returns your node for a CID you pinned more than 24 hours ago",
                "A deliberately corrupted copy of an artifact fails the recomputation check in your pipeline, proving verification is actually running",
                "Your node peer identifier and its private key are backed up and access-controlled, because that identity is what your provider records are bound to",
                "Disk usage is bounded and garbage collection policy is explicit, so that a burst of unpinned traffic cannot fill the volume and take the node down"
              ]
            },
            {
              kind: "callout",
              title: "The failure mode you should induce on purpose",
              body: "Stop your node for two hours and watch what happens to retrieval from a third-party gateway. If the content still resolves, you have learned that some gateway has cached it and that your availability is currently being provided by a stranger for free. That is a fine situation to be in and a terrible situation to depend on. Write down which party is actually keeping you available, then decide whether to pay them, replace them, or accept it consciously."
            }
          ],
          praxis: "Stand up a hardened Kubo node, publish one artifact, and run the outside-in verification checklist end to end.",
          glossary: ["kubo", "pinning", "reprovide", "provider-record-decay", "open-proxy"],
          awards: ["node-operator", "outside-in-verifier"]
        },
        {
          id: "ch-decinfra-p2-s4-drill-gateway-phish",
          kind: "drill",
          title: "Drill: The Link In The Customer Email",
          statement: "A public gateway lends its domain reputation and its valid certificate to whatever content is asked for, which makes it the cleanest phishing infrastructure an adversary can get for free.",
          minutes: 24,
          respect: 170,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Threat actors moved onto public IPFS gateways for a specific and rational reason. The gateway domain carries reputation built by legitimate use, it serves over TLS with a valid certificate for that domain, and the content behind it cannot be taken down by serving notice on a hosting provider because there is no hosting provider — only whichever peers hold the blocks. Removal happens at gateway denylists, one gateway at a time, and there are many gateways. Cofense and Unit 42 have both documented sustained campaigns staging credential-harvest pages this way. Map it to ATT&CK and it sits comfortably in Stage Capabilities for the setup and Web Service for the delivery and command channel."
            },
            {
              kind: "list",
              title: "Facts on the table when the drill starts",
              items: [
                "Your company sends transactional email containing document links. Marketing has been using a public gateway URL for downloadable assets because it was fast to set up.",
                "Your secure email gateway allowlists the gateway domain, because blocking it broke the marketing assets six months ago and the exception was never revisited.",
                "The reported URL is on the same gateway domain your own emails use, with a path containing a CID.",
                "Your endpoint telemetry shows fourteen users reached the page in the last ninety minutes. Two submitted credentials."
              ]
            }
          ],
          drill: {
            id: "ch-decinfra-p2-s4-drill",
            scene: "Tuesday, 09:15. A customer forwards an email that appears to come from your billing team, with a link to a payment update page. The link is on a public IPFS gateway domain that your own marketing emails also use, so it renders with a valid certificate and passes your secure email gateway allowlist. The page is a pixel-accurate clone of your billing portal. Fourteen of your users have already loaded it; two have submitted credentials. Your abuse contact at the gateway operator has a stated response time of two business days.",
            clock: "Credential submissions are ongoing; the send is still in flight",
            pressure: "You cannot take down the content, you cannot block the domain without breaking your own transactional email, and the clock is measured in credentials",
            prompt: "Your first action, in the next ten minutes.",
            options: [
              {
                id: "opt-a",
                label: "Block the entire gateway domain at the proxy and email gateway immediately, and deal with the marketing breakage afterwards",
                detail: "Stop the bleeding at the network edge. Your own asset links break, but credentials stop flowing.",
                score: 1,
                outcome: "Submissions stop within minutes, which is real value. But your transactional email assets break simultaneously, support volume spikes, and marketing escalates within the hour. Worse, the adversary re-stages the same CID on three other public gateways before lunch, and you are now playing domain whack-a-mole with a blunt instrument while your own product is degraded.",
                ripple: "You have established that your incident response to gateway abuse is to break your own delivery path. The next time this happens, the business will resist the block, and you will have less authority to demand it. You also did nothing about the two credentials already submitted, which is where the actual compromise lives."
              },
              {
                id: "opt-b",
                label: "Force password reset and session revocation for the two submitters and all fourteen visitors, block the specific gateway path pattern rather than the domain, and submit the CID to the gateway operator denylist",
                detail: "Contain the identity compromise first, apply the narrowest possible network control, and start the slow takedown in parallel.",
                score: 3,
                outcome: "Sessions for the two submitters are killed before the adversary uses them, which is the only irreversible harm in play. Path-level blocking on the specific CID stops further submissions through that gateway without breaking your own asset URLs. The denylist submission starts the two-day clock in the background rather than on your critical path. You still have to handle re-staging, but you handled it from a position where nobody is currently losing an account.",
                ripple: "Your team learns the correct priority order for this class of incident: identity harm first, narrow network control second, takedown last, because takedown is the slowest lever and the least under your control. The path-pattern block also becomes a reusable detection: you now alert on any request to a gateway path your own systems did not publish, which catches the re-staging within minutes rather than by customer report.",
                isBest: true
              },
              {
                id: "opt-c",
                label: "Contact the gateway operator abuse channel and escalate hard while preparing a customer notification",
                detail: "Go to the party who can actually remove the content, and get ahead of the story with customers.",
                score: -2,
                outcome: "You spend the first hour writing an escalation to a queue with a two-business-day service level and drafting communications. Meanwhile submissions continue, the compromised sessions are used to change a payout destination on one account, and the customer notification you were carefully drafting now has to describe an actual financial loss rather than an attempted phish.",
                ripple: "You optimised for the lever that is slowest and least under your control while the fastest and most controllable lever — your own identity system — sat untouched. This is the most common senior-level error in gateway abuse incidents, because contacting the host is the muscle memory from a decade of ordinary phishing, and here the host is not a host."
              },
              {
                id: "opt-d",
                label: "Publish a warning banner on your real billing portal and email all customers that a phishing campaign is active",
                detail: "Warn the population broadly so nobody else falls for it, and demonstrate transparency.",
                score: -1,
                outcome: "The warning is useful and will be part of the response, but as a first action it is the wrong shape. It does not stop submissions from users already in the funnel, it does not revoke the two compromised sessions, and mass email in the middle of an active phishing campaign trains your customers to act on urgent security emails from you, which is precisely the behaviour the adversary is exploiting.",
                ripple: "You will do this eventually and you should, but doing it first costs you the containment window and slightly degrades your own anti-phishing posture. Communications is an amplifier of a response, not a substitute for one."
              }
            ],
            debrief: "The structural insight is that gateway abuse inverts the normal phishing response order. In classic phishing you contact the host, the host pulls the page, and the campaign dies. Here there is no host: the content is addressed by hash and served by whichever gateway is asked, so takedown means persuading each gateway operator to add the address to a denylist, one at a time, on their timetable. Since your slowest lever is also your least controllable, the response must be reordered around what you control absolutely — your own identity system — and what you control narrowly — path-level rather than domain-level network policy. Option B does both. Note the specific reason domain-level blocking (A) is worse than path-level: the gateway domain is load-bearing for your own delivery, and a control that breaks your product will be rolled back by the business, which means it is not a control, it is a temporary outage. Option C is the seductive one, and it is seductive precisely because it is what a decade of professional habit says to do. Option D confuses telling people about the fire with putting it out. The transferable pattern: when an attack exploits infrastructure you cannot influence, stop trying to influence it during the incident and spend the containment window entirely inside your own trust boundary. Then, after the incident, do the structural work — stop using public gateways for your own transactional links, so that the next time you can block the domain outright without breaking anything, and the adversary loses the reputation borrow.",
            principle: "When you cannot remove the attacker infrastructure, contain inside your own trust boundary first and treat takedown as a background task, never as the response."
          },
          glossary: ["gateway-trust", "denylist", "reputation-borrowing", "path-level-blocking", "session-revocation"],
          awards: ["gateway-incident-lead", "narrow-control"]
        },
        {
          id: "ch-decinfra-p2-s5-filecoin-proofs",
          kind: "lesson",
          title: "What PoRep And PoSt Actually Prove",
          statement: "Filecoin proofs attest that a provider held a unique encoding of specific bytes at specific moments, and they attest nothing at all about whether you can get those bytes back.",
          minutes: 30,
          respect: 165,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Storage networks face one hard question: how do you verify, without downloading everything, that a party you cannot inspect is genuinely holding a distinct copy of your data over time. Filecoin answers it in two parts. Proof of Replication runs once, at sealing, and establishes that the provider constructed a unique physical encoding of a specific piece of data — unique meaning that a provider cannot claim to store ten copies while keeping one, because the encodings differ per sector and per provider and are expensive to produce. Proof of Spacetime then runs continuously and establishes that the provider still has that encoding as time passes."
            },
            {
              kind: "numbered",
              title: "The proving cycle as specified",
              items: [
                "Sectors are 32 GiB or 64 GiB. Data is sealed into a sector, producing the replication proof and committing the sector on chain.",
                "Each 24-hour proving period is divided into 48 non-overlapping 30-minute deadlines. Every sector is assigned a deadline and must be proven once per period.",
                "At its deadline, the provider must submit a Window Proof of Spacetime — a zk-SNARK over randomly challenged parts of the sealed sector — as an on-chain message, inside the 30-minute window.",
                "Winning Proof of Spacetime is the separate, election-related proof used in block production, and it rewards providers proportional to committed storage power rather than attesting continuous possession.",
                "A missed proof is a fault. A fault fee roughly equal to one day of the block reward that sector would earn is charged per faulty sector per day, and collateral is slashed to the f099 burn address with a corresponding reduction in storage power.",
                "A provider can declare recovery to return a sector to active. If a sector remains faulty for 42 consecutive proving periods it is terminated automatically, and termination carries its own fee."
              ]
            },
            {
              kind: "table",
              title: "The gap between what is proven and what you need",
              headers: ["You want to know", "Proven by PoRep", "Proven by WindowPoSt", "Where you must get it instead"],
              rows: [
                ["A unique copy exists rather than a shared deduplicated one", "Yes", "Indirectly, by continuing to prove the same encoding", "Nothing further needed"],
                ["The copy still existed as of the last deadline", "No", "Yes, to a granularity of the proving period", "Nothing further needed"],
                ["I can retrieve my data right now, at usable speed", "No", "No", "Retrieval markets, explicit retrieval deals, your own hot cache, or a second provider entirely"],
                ["The provider will not go dark tomorrow", "No", "No — it detects the loss, it does not prevent it", "Redundancy across independent providers, plus monitoring of your own deals"],
                ["My data is confidential from the provider", "No", "No", "Encrypt before you hand it over; the provider is an untrusted party who is paid, not trusted"],
                ["The data is what I think it is", "Partially, via the piece commitment", "No", "Your own content-address verification on retrieval"]
              ]
            },
            {
              kind: "principle",
              title: "A proof of storage is a detection control, not a prevention control",
              body: "Nothing in the proving system stops a provider from losing your data. It makes the loss visible on a bounded schedule and makes it expensive for the provider. That is genuinely valuable — it converts an unknown into a monitored signal with an economic penalty — but treat it the way you would treat a smoke detector. It tells you the building is burning. It does not keep your data. Redundancy keeps your data, and redundancy means independent providers with independent hardware, independent operators and ideally independent jurisdictions, because correlated failure is the thing all proving systems are blind to."
            },
            {
              kind: "metric",
              title: "The detection latency you are actually buying",
              body: "Up to 24 hours. That is the worst-case interval between a provider silently losing a sector and the network noticing, because each sector proves once per proving period. If your recovery objective is tighter than a day, the proving system is not your monitoring system, and you need your own retrieval canaries running on your own schedule against your own deals."
            },
            {
              kind: "callout",
              title: "The question that exposes a weak storage design in one sentence",
              body: "Ask the architect: what is your retrieval test, how often does it run, and from where. If storage proofs are the answer, the design has confused the network economic guarantee with an operational one. The correct answer names a canary object, a frequency, an independent network location, and an alert threshold — the same answer a good backup engineer has given about restore tests for thirty years, because it is the same question."
            }
          ],
          glossary: ["proof-of-replication", "proof-of-spacetime", "sector", "fault-fee", "retrieval-canary", "storage-power"],
          awards: ["proof-literate", "restore-test-discipline"]
        },
        {
          id: "ch-decinfra-p2-s6-field-provenance",
          kind: "field",
          title: "Field: Build A CID Provenance Register",
          statement: "A hash without a signed, dated, human-owned assertion about what it is and why it was published is an orphan, and orphans are how supply-chain substitution succeeds.",
          minutes: 40,
          respect: 195,
          trust: 12,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "In practice, organisations accumulate content identifiers the way they accumulate S3 keys: quickly, informally, and with no record of who authorised the publication or what the bytes were supposed to be. Then a year later someone finds a CID in a config file and has no way to establish whether it is a legitimate build artifact, a test fixture, or something an attacker inserted during a compromise. Content addressing gives you perfect integrity against a name you cannot trust. The provenance register is the missing half."
            },
            {
              kind: "numbered",
              title: "What you are building",
              items: [
                "An append-only register, in your own version control, where every content identifier your organisation publishes or depends upon has exactly one entry.",
                "Each entry carries: the identifier, a human description, the producing system and build reference, the publication reason, the named accountable owner, the classification of the content, the retention intent, and the date.",
                "Each entry is signed by a person, not a service account. The signature is over the entry including the identifier, so an attacker who can write to the register cannot silently alter which bytes an entry vouches for.",
                "A verification job runs on a schedule: for every entry, fetch through an independent path, recompute the address, and confirm it matches. Failures alert with the owner name attached.",
                "A second job scans your deployed configuration, manifests and code for content identifiers, and flags any identifier in production that has no register entry. That job is the actual control; the register is just its database."
              ]
            },
            {
              kind: "code",
              title: "A register entry, in a format your build can validate",
              lang: "yaml",
              body: "- cid: bafybeigd7xyz...\n  description: signed release bundle for edge-agent v4.2.1\n  producer: ci/edge-agent\n  build_ref: gh-actions/run/8841203\n  reason: production distribution artifact\n  owner: a.okonkwo\n  classification: public\n  retention: indefinite-public\n  published: 2026-03-11\n  signature_file: signatures/bafybeigd7xyz.sig\n  independent_read_path: gateway-b\n\n- cid: bafkreih4abc...\n  description: customer onboarding attestation batch 2026-Q1\n  producer: archive-pipeline\n  build_ref: archive/batch/2026Q1-014\n  reason: regulatory retention, encrypted envelope only\n  owner: m.delacroix\n  classification: confidential-encrypted\n  retention: permanent-crypto-shreddable\n  published: 2026-04-02\n  signature_file: signatures/bafkreih4abc.sig\n  independent_read_path: self-hosted-node-2"
            },
            {
              kind: "list",
              title: "The three fields that experienced people fight for",
              items: [
                "Owner as a named person, never a team alias. A team alias means nobody is accountable, and in three years the alias will contain people who have never heard of the entry. A person who has left the company generates a review task; an alias generates silence.",
                "Reason, written in plain language. Six months later, the only question anyone asks about an unfamiliar identifier is why does this exist. If the register cannot answer that, it will not be consulted, and a register that is not consulted decays into a compliance artifact.",
                "Independent read path, named explicitly. It forces the person creating the entry to have thought about how this content will be retrieved by someone who does not have access to the publishing infrastructure — which is exactly the situation during an incident."
              ]
            },
            {
              kind: "checklist",
              title: "Acceptance criteria — the register is real when all of these hold",
              items: [
                "Every content identifier present in production configuration resolves to exactly one register entry, verified by an automated scan that fails the pipeline",
                "Every entry carries a signature by a named individual, verifiable against a key in your organisation key directory",
                "The scheduled verification job has run at least ten times and has produced at least one genuine failure that was investigated",
                "At least one entry has been deliberately corrupted in a test to prove the verification detects a mismatch rather than reporting success by default",
                "An entry exists for at least one third-party identifier you depend on but did not publish, with a note on what happens if that party stops serving it"
              ]
            },
            {
              kind: "callout",
              title: "The test that tells you whether you built a control or a spreadsheet",
              body: "Hand the register to someone who was not involved, name a random production content identifier, and ask them to tell you within five minutes what the bytes are, who authorised them, and how to retrieve them from outside your network. If they can, you have built an operational control. If they need to ask someone, you have built documentation, and documentation does not survive the departure of the person who would have been asked."
            }
          ],
          praxis: "Create the register for a real system you own, backfill every content identifier currently referenced in its production configuration, and wire the scan into the build so that an unregistered identifier fails the pipeline.",
          evidence: "Attach to your Praxis Profile: the register file with at least eight real entries, a link to the failing pipeline run that proves an unregistered identifier is blocked, a screenshot or log of the verification job detecting a deliberately corrupted entry, and a one-page note naming the third-party identifier you depend on and your contingency if it stops resolving.",
          glossary: ["provenance-register", "supply-chain-substitution", "named-accountability", "independent-read-path"],
          awards: ["provenance-keeper", "orphan-hunter"]
        }
      ]
    },
    {
      id: "ch-decinfra-p3-compute",
      title: "RUNNING SOMEONE ELSE CODE ON YOUR METAL",
      credential: "Certified Practitioner — Untrusted Compute Isolation",
      summary: "Decentralized compute is a marketplace in which two mutually distrusting strangers must cooperate: one pays for a result they cannot verify, the other executes code they cannot inspect. This Page teaches both sides of that trust problem, the real isolation tiers and what each actually costs, how to harden a provider node against a paying adversary, and what verifiable computation buys and does not buy.",
      competencies: [
        "State the two-sided trust problem precisely and name the distinct controls that serve the requestor and the provider",
        "Choose deliberately between namespace isolation, gVisor, microVMs and WASM using threat model and workload shape, not fashion",
        "Harden a compute provider node: kernel surface, egress policy, resource exhaustion, and payment-layer abuse",
        "Evaluate verifiable computation approaches — redundancy voting, hardware attestation, and cryptographic proofs — with their honest limitations",
        "Design an adversarial test that a sandbox must survive before it carries production workloads"
      ],
      seal: "SEAL-UNTRUSTED-COMPUTE-I",
      steps: [
        {
          id: "ch-decinfra-p3-s1-two-sided-trust",
          kind: "construct",
          title: "The Two-Sided Trust Problem",
          statement: "In decentralized compute neither party can verify the other, and every real design is a choice about which party absorbs the residual risk.",
          minutes: 18,
          respect: 80,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Golem and networks like it have two roles: requestors who want computation done, and providers who supply idle machines. The economics are obvious and the security is not. The requestor hands a workload and data to a machine owned by an anonymous party in an unknown jurisdiction, then pays for a result they generally cannot independently verify without redoing the work — which would defeat the purpose. The provider accepts an arbitrary binary payload from an anonymous party and executes it on hardware that also holds their personal life, their keys, and their network position. Each party is the other threat actor. This symmetry is the defining feature of the domain and it has no analogue in ordinary cloud computing, where the provider is a named company with a contract, an audit report and something to lose."
            },
            {
              kind: "compare",
              left: {
                title: "The requestor threat model — the provider is hostile",
                items: [
                  "Reads the input data and exfiltrates it, silently and undetectably",
                  "Reads the workload binary and extracts proprietary logic or embedded secrets",
                  "Returns a plausible but fabricated result without doing the work, to collect payment for free",
                  "Selectively corrupts results in ways that survive spot checks but poison the aggregate",
                  "Times the workload to learn business intelligence — when you compute, how much, on what cadence",
                  "Simply disappears mid-job, converting a compute cost into a schedule failure"
                ]
              },
              right: {
                title: "The provider threat model — the requestor is hostile",
                items: [
                  "Escapes the sandbox and takes the host, its keys and its wallet",
                  "Uses the host as an egress point for attacks, spam or abuse traffic attributed to the provider IP",
                  "Runs illegal content processing on the provider hardware, creating criminal exposure for the operator",
                  "Exhausts disk, memory, file descriptors or bandwidth to degrade the host or trigger costs",
                  "Fingerprints the host — CPU model, network position, neighbouring workloads — for later targeting",
                  "Games the payment layer: consumes compute then disputes, abandons, or under-pays the agreement"
                ]
              }
            },
            {
              kind: "principle",
              title: "Isolation protects the provider, cryptography protects the requestor",
              body: "These are two different problems solved by two different toolkits and it is a persistent confusion to treat them as one. No amount of hypervisor hardening stops a provider from reading a requestor plaintext input, because the provider owns the hypervisor. No amount of encryption stops a requestor payload from attacking the host, because the payload has to run. If your design has only sandboxing, the requestor is unprotected. If it has only encryption or attestation, the provider is unprotected. Real systems need both, and most real systems ship with one."
            },
            {
              kind: "table",
              title: "Who absorbs the residual risk in each common posture",
              headers: ["Posture", "Requestor exposure", "Provider exposure", "When it is the right call"],
              rows: [
                ["Plain sandboxed execution, encrypted transport only", "Total — the provider sees everything in memory", "Bounded by sandbox quality", "Public data, non-proprietary workloads: rendering open assets, scientific batch jobs on public datasets"],
                ["Redundant execution across N providers with result voting", "Reduced fabrication risk; confidentiality unchanged", "Unchanged", "Deterministic workloads where correctness matters more than secrecy, and where N-times cost is acceptable"],
                ["Hardware attested enclave execution", "Reduced, contingent on trusting the silicon vendor and the attestation chain", "Unchanged, and possibly worse — you cannot inspect what runs inside", "Confidential inputs where the requestor accepts a hardware root of trust and the provider accepts opacity"],
                ["Cryptographic proof of correct execution", "Correctness assured; confidentiality only if the scheme provides it", "Unchanged", "Small, well-structured computations where the proving overhead is affordable"],
                ["Do not send the sensitive part at all", "Zero, by construction", "Zero, by construction", "Almost always the right answer for the sensitive fraction of a workload, and almost always overlooked"]
              ]
            },
            {
              kind: "callout",
              title: "The design move that beats every clever mechanism",
              body: "Split the workload. Most jobs are ninety percent commodity computation over non-sensitive intermediate data and ten percent a step that touches something that matters. Run the ninety percent on the open market at market price and keep the ten percent on infrastructure you control. Engineers reach for confidential computing and verifiable computation before they have asked whether the sensitive part needs to leave the building at all, and the partition is usually cheaper, simpler and stronger than any of the cryptographic answers."
            }
          ],
          glossary: ["requestor", "provider-node", "residual-risk-allocation", "confidential-computing", "workload-partition"],
          awards: ["two-sided-thinker"]
        },
        {
          id: "ch-decinfra-p3-s2-isolation-tiers",
          kind: "lesson",
          title: "Isolation Tiers, Honestly Priced",
          statement: "Every isolation technology is a bet about which layer the attacker will find a bug in, and you should be able to say out loud which bet you are making.",
          minutes: 34,
          respect: 170,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "There is a common and lazy hierarchy — containers bad, VMs good — that survives because it is roughly right and stops people asking better questions. The better question is: what is the attack surface, measured in code that the untrusted workload can directly reach, and who wrote that code. A Linux container shares the host kernel, so the surface is the entire system call interface of a kernel with tens of millions of lines and a steady stream of privilege-escalation findings. A gVisor sandbox interposes a userspace kernel — the Sentry — that implements syscalls itself and passes only a small vetted subset to the host, so the surface becomes the Sentry plus that narrow subset. A microVM gives the workload its own guest kernel on top of hardware virtualisation, so the attacker must first own the guest kernel and then break the virtual machine monitor. A WASM runtime gives no syscalls at all by default, only explicitly granted host functions, so the surface is the runtime and the capability surface you chose to expose."
            },
            {
              kind: "table",
              title: "The four tiers, with the honest cost line",
              headers: ["Tier", "What the workload can reach", "The bet you are making", "Cost", "Where it breaks"],
              rows: [
                ["Namespaces and seccomp", "The host kernel, filtered by your seccomp policy", "That your seccomp allowlist plus the kernel is sound", "Near zero overhead, instant start", "One kernel bug in a reachable syscall is a full host compromise; policies drift as workloads add syscalls"],
                ["gVisor", "The Sentry userspace kernel; only a vetted subset of host syscalls", "That the Sentry is more trustworthy than the kernel it replaces", "Roughly ten to thirty percent overhead on I/O-heavy work, minimal on compute-bound", "Compatibility gaps break real workloads; the Sentry itself runs on the host and remains a target"],
                ["MicroVM such as Firecracker", "Its own guest kernel, then the VMM device model", "That the hardware virtualisation boundary plus a deliberately minimal device model holds", "Boot on the order of 125 milliseconds, under 5 MiB memory overhead per VM", "Device emulation bugs, side channels across cores, and the operational weight of running kernels you must patch"],
                ["WASM runtime", "Only host functions you explicitly export", "That the runtime is correct and your capability surface is small", "Very low startup, but only for code you can compile to WASM", "Rich workloads do not fit; every capability you add to make it fit is surface you added back"]
              ]
            },
            {
              kind: "prose",
              title: "The Golem case, and what its choice tells you",
              body: "Golem does not run requestor payloads as Docker containers on the provider host. Images are authored in Docker format, then converted with gvmkit-build into a SquashFS-based Golem VM image, and executed by ya-runtime-vm under the yagna provider agent. The documented rationale is that running images as virtual machines rather than containers provides separation of provider and requestor data and processes. That is the correct instinct for a market where the workload author is anonymous and adversarial by default: pay the virtualisation cost, because the shared-kernel bet is not a bet you can win when your counterparty is selected by an auction rather than by a contract."
            },
            {
              kind: "principle",
              title: "Isolation without egress control is theatre",
              body: "The obsessive focus on sandbox escape misses the more common outcome. Most abuse of untrusted compute never escapes anything — it uses the sandbox exactly as designed, to send traffic. Credential stuffing, scanning, spam relay, denial of service participation, cryptomining pool traffic, and exfiltration of the data the workload was legitimately given all happen entirely inside a perfectly functioning sandbox. If your isolation story does not include a default-deny egress policy with an explicit allowlist, you have hardened the wall and left the gate open. The provider IP address is the asset being stolen, and it is stolen through the front door."
            },
            {
              kind: "list",
              title: "Controls that matter as much as the isolation tier, and are usually missing",
              items: [
                "Default-deny egress with per-agreement allowlists, and a hard rate cap so that even permitted destinations cannot be used for volume abuse",
                "Hard resource ceilings on CPU, memory, disk, file descriptors and process count, enforced by cgroups or the VMM rather than by the guest, because the guest is the adversary",
                "Ephemeral, zero-state instances: a fresh rootfs per agreement, no persistence between jobs, no shared writable volumes, no reuse of a warm sandbox across tenants",
                "Time bounds enforced outside the sandbox, so a job that hangs is reaped by the supervisor rather than by anything the workload controls",
                "Separate network namespace and separate egress identity per job, so abuse attribution lands on a disposable address rather than on the provider primary IP",
                "No host secrets, no wallet keys, no SSH agent and no cloud instance metadata reachable from the sandbox network path — metadata service access from a sandbox is a credential handout"
              ]
            },
            {
              kind: "callout",
              title: "The one-sentence test for a sandbox design review",
              body: "Ask: assume the workload achieves arbitrary code execution as root inside the sandbox on its first instruction — that is the design assumption, not the worst case — now what can it reach. If the answer includes the host kernel, the wallet, the instance metadata service, another tenant, or the open Internet, the design is not finished. Every serious sandbox review starts from the assumption that the inside is already lost, because for a marketplace that accepts anonymous payloads, it eventually is."
            }
          ],
          glossary: ["seccomp", "sentry", "microvm", "wasm-sandbox", "egress-policy", "gvmi", "gvisor"],
          awards: ["isolation-economist", "egress-first"]
        },
        {
          id: "ch-decinfra-p3-s3-lab-harden-provider",
          kind: "lab",
          title: "Lab: Harden A Compute Provider Node",
          statement: "The provider host must be built as if the workload is already root inside it, because sooner or later the workload will be.",
          minutes: 40,
          respect: 200,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "You are going to build the containment layer that sits between an anonymous payload and a host you care about. The order matters: network first, because egress abuse is the likeliest outcome; then resource bounds, because exhaustion is the second likeliest; then the isolation runtime, because escape is the least likely and the most catastrophic. Building in that order also means that when you run out of time — and you will — you have spent it on the controls that address the actual base rate."
            },
            {
              kind: "code",
              title: "Default-deny egress for the sandbox network namespace",
              lang: "bash",
              body: "set -euo pipefail\n\nJOB_NS=job-$1\nJOB_CIDR=10.77.$2.0/30\n\nip netns add $JOB_NS\nip link add veth-$1 type veth peer name veth-in netns $JOB_NS\n\nip netns exec $JOB_NS ip addr add 10.77.$2.2/30 dev veth-in\nip netns exec $JOB_NS ip link set veth-in up\nip netns exec $JOB_NS ip route add default via 10.77.$2.1\n\nnft add table inet job_$1\nnft add chain inet job_$1 forward '{ type filter hook forward priority 0 ; policy drop ; }'\n\nnft add rule inet job_$1 forward ip saddr $JOB_CIDR ip daddr 169.254.169.254 drop\nnft add rule inet job_$1 forward ip saddr $JOB_CIDR ip daddr 10.0.0.0/8 drop\nnft add rule inet job_$1 forward ip saddr $JOB_CIDR ip daddr 172.16.0.0/12 drop\nnft add rule inet job_$1 forward ip saddr $JOB_CIDR ip daddr 192.168.0.0/16 drop\n\nnft add rule inet job_$1 forward ip saddr $JOB_CIDR tcp dport 25 drop\nnft add rule inet job_$1 forward ip saddr $JOB_CIDR limit rate over 20 mbytes/second drop\nnft add rule inet job_$1 forward ip saddr $JOB_CIDR ct state new limit rate over 50/second drop\n\nnft add rule inet job_$1 forward ip saddr $JOB_CIDR accept"
            },
            {
              kind: "list",
              title: "Read those rules in order — the order is the argument",
              items: [
                "The instance metadata address is dropped first and explicitly. On any cloud host, that single address is the difference between a contained sandbox and a handed-over cloud account, and it is the most commonly forgotten line in the file.",
                "RFC1918 ranges are dropped before anything else is allowed, because lateral movement into your own management network is worth more to an attacker than anything on the public Internet.",
                "Outbound port 25 is dropped so your address does not become spam infrastructure, which is the abuse that gets a provider IP blocklisted fastest and hurts longest.",
                "Bandwidth and new-connection rate limits are the anti-abuse controls, not the anti-escape controls. They cap the value of your host to someone running a scanner or participating in a flood, which is the highest-frequency misuse of rented compute.",
                "Accept comes last, and only for traffic that survived every drop above. Writing the allow first and the drops after is the single most common firewall error, and it silently inverts the whole policy."
              ]
            },
            {
              kind: "code",
              title: "Resource ceilings enforced outside the guest",
              lang: "toml",
              body: "[job.limits]\nvcpu_count = 2\nmem_size_mib = 4096\nmax_open_files = 1024\nmax_processes = 256\nrootfs_size_mib = 8192\nwall_clock_seconds = 3600\n\n[job.storage]\nrootfs_mode = 'ephemeral-copy-on-write'\npersist_between_jobs = false\nshared_writable_mounts = []\n\n[job.network]\nnamespace = 'per-job'\negress_policy = 'default-deny'\negress_identity = 'disposable-nat-address'\n\n[job.host]\nexpose_instance_metadata = false\nexpose_wallet_socket = false\nexpose_docker_socket = false\nexpose_ssh_agent = false"
            },
            {
              kind: "prose",
              title: "The four exposures in that last block are the whole game",
              body: "Every one of those four has been the root cause of a real compromise class. The instance metadata service hands out cloud credentials to anything that can make an HTTP request. A wallet socket lets a workload sign transactions as you, which converts a compute abuse into a direct financial loss. A mounted container runtime socket is a documented and trivially exploited full host takeover — it is an unauthenticated root API. A forwarded SSH agent lets the workload authenticate as you to every host that trusts your key. None of these are subtle, all of them are conveniences that someone adds during debugging, and all four survive into production because they make something work. Put them in configuration as explicit false values so that turning one on is a visible, reviewable diff rather than an invisible default."
            },
            {
              kind: "code",
              title: "A supervisor that reaps rather than trusts",
              lang: "python",
              body: "import subprocess, time, signal, os\n\ndef run_job(job_id, vmm_cmd, wall_clock_seconds, cgroup_path):\n    proc = subprocess.Popen(vmm_cmd, preexec_fn=os.setsid)\n    deadline = time.monotonic() + wall_clock_seconds\n    while True:\n        if proc.poll() is not None:\n            return proc.returncode\n        if time.monotonic() > deadline:\n            os.killpg(os.getpgid(proc.pid), signal.SIGKILL)\n            audit(job_id, 'reaped-wall-clock')\n            return -1\n        if pressure_stalled(cgroup_path):\n            os.killpg(os.getpgid(proc.pid), signal.SIGKILL)\n            audit(job_id, 'reaped-memory-pressure')\n            return -2\n        time.sleep(1)\n\ndef pressure_stalled(cgroup_path):\n    with open(cgroup_path + '/memory.pressure') as f:\n        for line in f:\n            if line.startswith('full'):\n                fields = dict(p.split('=') for p in line.split()[1:])\n                return float(fields.get('avg10', 0)) > 40.0\n    return False"
            },
            {
              kind: "checklist",
              title: "Prove each of these before the node accepts a paid job",
              items: [
                "From inside a test payload, a request to the instance metadata address fails, and the failure is a drop rather than a refusal that reveals the address exists",
                "From inside a test payload, a TCP connection to your management subnet fails, verified by packet capture on the host side rather than by the payload own report",
                "A payload that forks aggressively is killed by the process limit without the host losing responsiveness",
                "A payload that allocates until the memory ceiling is reaped by your supervisor, and the reaping is recorded in the audit log with a reason",
                "A payload that opens ten thousand outbound connections is rate-limited, and the limit is visible in your metrics before it is visible in an abuse complaint",
                "No wallet key, signing socket, container runtime socket or agent socket is reachable from the sandbox, verified by attempting to reach each one from inside",
                "The rootfs is destroyed between jobs, verified by writing a marker file in one job and confirming its absence in the next"
              ]
            }
          ],
          praxis: "Build the containment layer on a disposable host, then run a deliberately hostile payload against it that attempts metadata access, lateral connection, fork bombing and bulk outbound connections.",
          glossary: ["network-namespace", "instance-metadata-service", "cgroup-pressure", "ephemeral-rootfs", "reaping"],
          awards: ["provider-hardener", "metadata-blocker"]
        },
        {
          id: "ch-decinfra-p3-s4-drill-job-that-pays",
          kind: "drill",
          title: "Drill: The Job That Pays Too Well",
          statement: "In an open compute market, an unusually generous offer is not luck, it is a bid for something you did not intend to sell.",
          minutes: 22,
          respect: 175,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Price is a signal in a marketplace, and adversaries know that operators respond to it. A requestor willing to pay well above market for a specific configuration is buying something other than compute — usually a network position, a jurisdiction, a hardware capability, or a duration long enough to establish persistence. The operator instinct, honed by every other business, is that a customer paying above rate is a good customer. In this market that instinct is inverted, and the inversion is what the drill teaches."
            },
            {
              kind: "list",
              title: "What is in front of you",
              items: [
                "You operate a fleet of eleven provider nodes across three data centres as a side business that has become material revenue.",
                "An offer arrives for a 96-hour agreement at roughly four times your usual rate, for a single node, with unusual requirements: a specific data centre, unrestricted outbound, and a request that you disable your per-job network namespace because the workload needs raw sockets.",
                "The requestor has a fresh identity with no history on the network and has pre-funded the full amount.",
                "Your monthly revenue across the whole fleet is roughly what this single agreement would pay."
              ]
            }
          ],
          drill: {
            id: "ch-decinfra-p3-s4-drill",
            scene: "Saturday, 23:10. A requestor with a brand-new identity and no reputation offers you a 96-hour agreement at four times market rate, on one specific node in one specific data centre, on the condition that you disable per-job network isolation and permit raw sockets and unrestricted outbound. The funds are already escrowed. The agreement window opens in twenty minutes and the offer expires with it. Your fleet is a side business and this single agreement is worth roughly a month of total revenue.",
            clock: "20 minutes until the offer expires",
            pressure: "A month of revenue, a plausible technical justification, escrowed funds, and nobody to consult at 23:10 on a Saturday",
            prompt: "What do you do?",
            options: [
              {
                id: "opt-a",
                label: "Accept, but only on your least valuable node, and monitor closely for the duration",
                detail: "Take the money on hardware you could afford to lose, and watch the traffic.",
                score: -2,
                outcome: "You have accepted a raw-socket, unrestricted-egress workload on your own IP address in your own data centre. Within six hours your address is originating scan traffic across a large range. Within a day your upstream provider receives abuse complaints and rate-limits the whole rack, which affects your other nodes. The node you were willing to lose was never the asset — the address reputation and the upstream relationship were.",
                ripple: "You learn the hard way that in this business the disposable asset is not the machine. Reputation with your transit provider, your address blocks and your data centre relationship are the durable assets, and they are shared across every node you run. You have also created a record: your fleet is now the fleet that accepted a raw-socket job, and that record follows the addresses, not the hardware."
              },
              {
                id: "opt-b",
                label: "Decline the isolation exception, counter-offer the same job at the same price with your standard network policy intact, and let the requestor walk if the policy is the problem",
                detail: "Keep the control, keep the price, and use the counter-offer as the diagnostic.",
                score: 3,
                outcome: "You reply that the rate is acceptable and the network policy is not negotiable. If the workload genuinely needs high throughput you can raise the bandwidth cap within policy. The requestor either accepts — in which case you have a well-paid legitimate job — or vanishes, which tells you exactly what they were buying. In this case they vanish within four minutes, and your Sunday is uneventful.",
                ripple: "You have converted a pressure decision into a cheap diagnostic. The counter-offer costs nothing, preserves the possibility of legitimate revenue, and extracts the single most informative signal available: whether the requestor wants your compute or your network position. You also now have a policy precedent you can cite the next time, which means the next 23:10 decision takes thirty seconds instead of twenty minutes.",
                isBest: true
              },
              {
                id: "opt-c",
                label: "Decline outright and report the requestor identity to the network reputation system",
                detail: "Refuse and warn the community.",
                score: 1,
                outcome: "Declining is safe and correct as far as it goes. The report is well intentioned but weak: you are reporting an offer, not an abuse, and a fresh identity that has done nothing yet cannot be meaningfully penalised. Identities are free, so the reported one is discarded and a new one appears an hour later with a slightly different pitch. You also forfeited revenue that might have been legitimate.",
                ripple: "You are safe and slightly poorer, and you have learned nothing about the requestor intent. Reputation systems over free identities have a structural weakness: they punish accumulated bad behaviour and are blind to first offences, which is exactly when the offer is most attractive and least informed. Your report will not stop the next one reaching another operator who needs the money more than you do."
              },
              {
                id: "opt-d",
                label: "Accept with isolation intact but without telling the requestor, and see whether the workload fails",
                detail: "Take the money, quietly keep your controls, and let the job break if it really needed what it asked for.",
                score: 0,
                outcome: "The workload fails within minutes, the requestor disputes the agreement, and you spend the weekend in a payment dispute over a job you knowingly accepted under terms you had no intention of honouring. Whatever the requestor was, you are now the party who misrepresented the service, and in a marketplace where your own reputation is the collateral, that is an expensive position to be in.",
                ripple: "You traded a clean policy boundary for a covert one, and covert boundaries do not scale, cannot be delegated to an employee, and collapse the moment they are tested. Worse, you have taught yourself that quiet non-compliance is an available move, which is a habit that will eventually be applied to a customer who deserved honesty."
              }
            ],
            debrief: "The counter-offer in option B is the professional move, and it is worth understanding why rather than just remembering it. The offer contains two components: a price and a policy exception. The price is negotiable and legitimate — markets do have urgent, well-funded, unusual jobs. The policy exception is the actual payload of the offer, and it is what the four-times rate is purchasing. By separating them and conceding the negotiable one while holding the non-negotiable one, you find out which component the requestor cared about, at zero cost, inside the window. That is the general form of the technique: when someone bundles a legitimate ask with an illegitimate one and applies time pressure, unbundle them and grant the legitimate half immediately. The response to the remaining half is your intelligence. Option A fails on a specific misidentification of the asset — operators consistently think of the machine as the thing at risk, when the durable assets are the IP reputation, the transit relationship and the data centre contract, all of which are shared across the fleet and none of which are restored by rebuilding a node. Option C is safe but leaves value on the table and overestimates what reputation systems can do against free identities. Option D is the one that looks clever and is actually a character failure with a business cost attached. Note also the meta-lesson about timing: the offer expires in twenty minutes at 23:10 on a Saturday, and that is not a coincidence. Urgency outside working hours with a hard expiry is a social engineering pattern, and recognising it as such is often faster than analysing the technical request.",
            principle: "Unbundle a pressured offer into its negotiable and non-negotiable parts, concede the negotiable part instantly, and read the response to the rest as the real message."
          },
          glossary: ["counter-offer-diagnostic", "reputation-collateral", "free-identity-problem", "raw-socket"],
          awards: ["price-signal-reader", "policy-holder"]
        },
        {
          id: "ch-decinfra-p3-s5-verifiable-compute",
          kind: "lesson",
          title: "Verifiable Computation And Its Three Honest Limits",
          statement: "You can verify that a computation was performed correctly in three ways — by repetition, by hardware attestation, or by proof — and each one moves the trust somewhere else rather than removing it.",
          minutes: 32,
          respect: 180,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "The requestor problem is stated simply: I paid for a result I cannot check without redoing the work. Every answer in the field is a variant of three strategies, and a professional should be able to name the residual trust in each without hesitating. Redundancy trusts that a majority of independently selected providers are not colluding. Attestation trusts a hardware vendor and their certificate chain. Cryptographic proof trusts the soundness of a construction, its implementation, and its setup. There is no fourth option that trusts nothing."
            },
            {
              kind: "table",
              title: "The three strategies against the questions that matter",
              headers: ["Strategy", "Cost multiplier", "Handles non-determinism?", "Protects confidentiality?", "Residual trust"],
              rows: [
                ["Redundant execution with result voting", "N times the compute, plus reconciliation", "Poorly — floating point, threading and timing differences produce honest disagreement that looks like fraud", "No, and it makes it worse: N providers now see the data instead of one", "That the N providers were selected independently and are not the same operator behind different identities"],
                ["Trusted execution environment with remote attestation", "Low compute overhead, high operational and compatibility cost", "Yes", "Yes, against the host operator, subject to side-channel history", "The silicon vendor, the firmware supply chain, the attestation service, and the long record of microarchitectural side-channel findings against these environments"],
                ["Cryptographic proof of execution", "Very high proving overhead, though verification is cheap", "Yes, within the constraints of the arithmetisation", "Only if the scheme is explicitly zero-knowledge over the inputs", "The soundness of the construction, the correctness of the circuit or virtual machine implementation, and any trusted setup"],
                ["Spot-checking with economic penalty", "Low — check a random sample and slash on mismatch", "Same problem as voting", "No", "That the penalty exceeds the expected gain from cheating, which requires stake at risk larger than the value of the fraud"]
              ]
            },
            {
              kind: "prose",
              title: "The Sybil problem underneath redundancy",
              body: "Redundant execution with majority voting is the workhorse of practical decentralized compute because it is simple and needs no special hardware or mathematics. Its security rests entirely on an assumption that is difficult to establish in an open network: that the providers you selected are genuinely distinct parties. Identities are cheap. One operator can present as twenty providers across twenty addresses in twenty regions, accept all five copies of your redundant job, run it once, and return five identical fabricated results that vote unanimously. Your redundancy has then cost you five times the money and bought you nothing. This is the Sybil problem wearing a different hat, and it is why serious systems bind provider identity to something scarce — stake, hardware attestation, accumulated reputation with real cost to build, or diversity constraints on network position and jurisdiction. If provider selection is uniform random over free identities, majority voting is a comfort blanket."
            },
            {
              kind: "principle",
              title: "Verify the property you care about, not the computation",
              body: "Full verification of an arbitrary computation is expensive. Verification of a specific property of its output is often nearly free, and it is usually what you actually need. If the job renders frames, check structural similarity against a locally rendered sample frame. If it trains a model, check the loss against a held-out set you keep private. If it transcodes media, check duration, stream count and a perceptual hash on random segments. If it searches a space, check that the returned candidate satisfies the predicate — verifying a solution is nearly always cheaper than finding one. Ask what a fabricated result would have to get right in order to fool you, then make that list expensive to satisfy. This single reframing eliminates most of the need for heavyweight verification machinery in real workloads."
            },
            {
              kind: "list",
              title: "The asymmetries worth exploiting",
              items: [
                "Finding versus checking: any search, optimisation or factoring style workload has a cheap verifier by construction, and you should structure jobs to have this shape whenever you can choose",
                "Sampling versus full verification: verifying one percent of outputs at random, with a penalty large enough to make expected cheating value negative, is a complete answer for large batch workloads and costs one percent",
                "Canary work: insert a small number of tasks whose correct answer you already know, indistinguishable from real tasks, and treat a wrong answer on a canary as evidence of systematic fabrication — this is the oldest trick in distributed computing and it is still the best value per unit of effort",
                "Cross-strategy composition: canaries plus sampling plus stake at risk gives most of the assurance of full redundancy at a small fraction of the cost, and it degrades gracefully rather than failing all at once"
              ]
            },
            {
              kind: "callout",
              title: "The failure mode of every verification scheme",
              body: "None of these detect a provider who does the work correctly and also keeps a copy of your data. Verification is a correctness control. It contributes nothing to confidentiality. Teams routinely present a redundancy and attestation design as an answer to a data protection question, and the two are unrelated. If confidentiality is the requirement, the answers are encryption with the provider never holding the key, a trusted execution environment with all of its own trust assumptions, or not sending the data. Verification is not on that list."
            }
          ],
          glossary: ["redundant-execution", "remote-attestation", "trusted-execution-environment", "canary-task", "verifier-asymmetry", "validity-proof"],
          awards: ["verification-realist", "asymmetry-exploiter"]
        },
        {
          id: "ch-decinfra-p3-s6-field-adversarial-sandbox",
          kind: "field",
          title: "Field: Stand Up A Sandbox And Then Break It",
          statement: "A sandbox you have not personally attacked is a claim, and claims do not survive contact with a paying adversary.",
          minutes: 40,
          respect: 205,
          trust: 13,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "The deliverable here is not a sandbox. Anyone can follow a quickstart. The deliverable is a written attack log against your own sandbox, containing at least one finding that surprised you, and the fix. Security engineers who have never attacked their own containment have an unjustified confidence that shows up in design reviews as certainty about things they have not tested. This exercise removes that."
            },
            {
              kind: "numbered",
              title: "The build, then the attack",
              items: [
                "Stand up a compute sandbox on a disposable host using a microVM runtime or gVisor, with per-job network namespace, default-deny egress, resource ceilings and an ephemeral rootfs. Use the controls from the earlier lab.",
                "Write a hostile payload that runs on first execution and attempts, in order: reach the instance metadata address, connect to your management subnet, enumerate host devices and mounts, read any reachable socket, fork until refused, allocate until refused, open a thousand outbound connections, and write a marker to any writable path outside the intended workspace.",
                "Instrument the host side, not the guest side. Packet capture at the host interface, cgroup accounting, audit logs of the supervisor. Never trust the payload own report of what it could reach, because the payload is the adversary and it can lie.",
                "For every attempt, record the result as blocked, partially blocked, or succeeded, with the host-side evidence that supports the classification. Partially blocked is a real category and it is where most of the learning lives.",
                "Fix everything in the succeeded and partially blocked columns, then re-run the entire payload from scratch on a freshly built host and confirm the fixes hold on a clean build rather than on a patched one.",
                "Then do the part people skip: run the payload again after a week of normal operation, because configuration drifts, someone adds a debug mount, and the second run is the one that tells you whether your controls are durable or ceremonial."
              ]
            },
            {
              kind: "code",
              title: "The reconnaissance stub the payload should start with",
              lang: "bash",
              body: "set +e\n\necho '--- identity'\nid; cat /proc/self/status | grep -i cap\n\necho '--- devices and mounts'\nls -la /dev; cat /proc/mounts\n\necho '--- sockets reachable'\nfor s in /var/run/docker.sock /run/containerd/containerd.sock /run/user/1000/keyring/ssh; do\n  test -S $s && echo REACHABLE $s\ndone\n\necho '--- metadata'\ntimeout 3 curl -s http://169.254.169.254/latest/meta-data/ && echo METADATA_REACHABLE\n\necho '--- management subnet'\nfor h in 10.0.0.1 10.0.10.1 192.168.1.1; do\n  timeout 2 bash -c 'cat < /dev/null > /dev/tcp/'$h'/22' 2>/dev/null && echo LATERAL_OPEN $h\ndone\n\necho '--- kernel surface'\nuname -a; cat /proc/version; ls /sys/kernel/security 2>/dev/null"
            },
            {
              kind: "prose",
              title: "What a good finding looks like",
              body: "The findings that matter are almost never a sandbox escape. They are things like: the metadata address was blocked but the link-local IPv6 equivalent was not, because your rules were written for IPv4 and the host had IPv6 enabled. Or: egress was default-deny but DNS was allowed to the host resolver, and DNS is a perfectly serviceable exfiltration and command channel. Or: the rootfs was ephemeral but a build cache volume was shared across jobs for performance, so one tenant could plant a file another tenant would execute. Or: resource ceilings were enforced but the supervisor read the guest own reported memory usage. Each of these is a control that looked present, was present, and did not do what its name implied. Write them down in exactly those terms, because that is the form your future design reviews should take."
            },
            {
              kind: "checklist",
              title: "The attack log is complete when it contains",
              items: [
                "A build description precise enough that another engineer could reproduce the host from it",
                "Every attempted action with a blocked, partially blocked or succeeded verdict, each supported by host-side evidence rather than guest-side output",
                "At least one finding that you did not expect, described honestly, including how long it had been true",
                "The fix for each finding, and a re-test result from a freshly built host rather than a patched one",
                "A second run one week later with a note on whether anything drifted, and what caused the drift",
                "One paragraph naming the control you are still not confident in, and what evidence would change your mind"
              ]
            },
            {
              kind: "callout",
              title: "Publish the failure, not the success",
              body: "When you write this up for your Praxis Profile, lead with what got through. Anyone can produce a list of controls that worked. A log that opens with the IPv6 gap you missed for six weeks, and closes with the process change that would have caught it, is evidence of an engineer who can be trusted with a system nobody else is checking. That is the signal reviewers actually read for."
            }
          ],
          praxis: "Build the sandbox, write and run the hostile payload against it, fix every finding, rebuild clean, re-test, and re-test again after a week of normal use.",
          evidence: "Attach to your Praxis Profile: the sandbox build description, the hostile payload source, the attack log with host-side evidence for each verdict, at least one genuine unexpected finding with its fix and clean-rebuild re-test, the one-week drift check, and the paragraph naming the control you still do not trust.",
          glossary: ["hostile-payload", "host-side-evidence", "control-drift", "partial-block"],
          awards: ["broke-my-own-box", "drift-checker"]
        }
      ]
    },
    {
      id: "ch-decinfra-p4-erasure",
      title: "DELETION, TOMBSTONES AND THE LAW",
      credential: "Certified Practitioner — Crypto-Shredding and Data Lifecycle Control",
      summary: "On a substrate with no delete, deletion becomes a key management discipline. This Page teaches crypto-shredding as a real control with real preconditions, reads the regulator position on immutable ledgers as written rather than as wished, builds the envelope scheme that makes an erasure request answerable, and separates tombstoning from deletion once and for all.",
      competencies: [
        "Explain cryptographic erase against the NIST sanitization taxonomy, including the preconditions that invalidate the claim",
        "Read the EDPB position on blockchain and personal data accurately, including that encrypted and hashed data remain personal data",
        "Design and implement an envelope key hierarchy whose destruction is per-subject, evidenced, and auditable",
        "Answer a data subject erasure request against an immutable substrate honestly and defensibly",
        "Distinguish deletion, tombstoning, denylisting and unlinking, and say who controls each",
        "Lead the DPIA conversation with legal and, if it comes to it, with a regulator"
      ],
      seal: "SEAL-ERASURE-I",
      steps: [
        {
          id: "ch-decinfra-p4-s1-deletion-is-keys",
          kind: "construct",
          title: "Deletion Is A Key Management Problem",
          statement: "Once data leaves a medium you physically control, the only deletion primitive you still own is the destruction of the key that makes it readable.",
          minutes: 20,
          respect: 90,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "NIST SP 800-88 organises sanitization into three levels. Clear applies logical techniques through the standard read and write interfaces and defeats a keyboard-level attacker. Purge applies stronger techniques that defeat laboratory recovery. Destroy renders the medium unusable. Cryptographic erase — encrypting data and then destroying the key — is treated as a purge technique, and it is the only one of the three that remains available when the medium belongs to someone else. That is the entire reason it matters here. You cannot degauss a stranger disk in another jurisdiction. You can destroy a key you hold."
            },
            {
              kind: "table",
              title: "Which sanitization technique survives which storage model",
              headers: ["Storage model", "Clear", "Purge by overwrite", "Destroy media", "Cryptographic erase"],
              rows: [
                ["Your own disk in your own rack", "Available", "Available", "Available", "Available"],
                ["Managed cloud object storage", "Available via the API", "Not directly — you trust the provider", "Not available to you", "Available and often the strongest claim you can make"],
                ["Content-addressed storage with third-party pinning", "You can unpin; others may still hold the blocks", "Not available", "Not available", "Available — the only control that reaches copies you do not know about"],
                ["Permanent storage such as a blockweave", "Not available", "Not available", "Not available", "Available — and it is the only one"],
                ["Data already distributed to peers who never agreed to anything", "Not available", "Not available", "Not available", "Available if and only if you encrypted before publication"]
              ]
            },
            {
              kind: "principle",
              title: "The precondition that invalidates most crypto-shredding claims",
              body: "Cryptographic erase only sanitizes data that was encrypted before it was ever written. Any bytes written in plaintext before encryption was enabled remain in plaintext forever, and destroying the key afterwards does nothing to them. This is stated explicitly in the sanitization guidance and it is the failure that most real crypto-shredding programmes contain: encryption was turned on at some point during the system life, and the claim is made retrospectively over the whole dataset. Before you claim crypto-shredding, establish the date on which every byte in scope started being encrypted, and be prepared to show it."
            },
            {
              kind: "list",
              title: "The five conditions under which the claim actually holds",
              items: [
                "Every byte in scope was encrypted before it was written to the substrate, with a documented start date and evidence rather than a belief",
                "The key hierarchy grants per-subject or per-object granularity — a single tenant-wide key means erasing one subject requires erasing everyone, so nobody will ever do it",
                "Every copy of the key material is enumerable: the wrapped key, its backups, its escrow copies, any cached plaintext key in a running service, and any copy that ever touched a developer laptop",
                "Key destruction is a supported, audited operation of your key management system with a durable record, not an administrator deleting a row",
                "The cipher and key length are strong enough that the claim survives the retention period of the data, which on permanent storage may be measured in decades rather than years"
              ]
            },
            {
              kind: "callout",
              title: "The uncomfortable honesty at the centre of this",
              body: "Crypto-shredding does not delete data. It makes data unreadable to anyone who does not hold the key, and then removes the key from existence. The ciphertext persists, worldwide, forever. If the cipher is broken in thirty years, or if a copy of the key survived somewhere you did not enumerate, the data returns. Say this out loud when you present the control. An engineer who oversells crypto-shredding as deletion is setting up their organisation to make a false statement to a regulator, and the statement will be in writing."
            }
          ],
          glossary: ["cryptographic-erase", "clear-purge-destroy", "key-hierarchy", "sanitization"],
          awards: ["shredding-precondition"]
        },
        {
          id: "ch-decinfra-p4-s2-edpb-collision",
          kind: "lesson",
          title: "The Regulator Has Already Written It Down",
          statement: "The collision between erasure rights and immutable ledgers has an official answer, and the answer is that technical impossibility is not a defence.",
          minutes: 30,
          respect: 165,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "For years the industry argument was that data protection law had not caught up with distributed ledgers, and that regulators would eventually accommodate immutability. The EDPB Guidelines 02/2025 on the processing of personal data through blockchain technologies close that argument, and they close it in the direction engineers were hoping to avoid. The positions are unambiguous enough that you should be able to recite them, because they determine architecture and not merely paperwork."
            },
            {
              kind: "numbered",
              title: "The positions that change your design",
              items: [
                "Do not put personal data on-chain. The guidance recommends against registering personal data on a blockchain in clear text, in encrypted form, or as a hash. This is a design-stage recommendation, not a compliance-stage one.",
                "Encrypted and hashed data remain personal data. Encryption and hashing are protective measures, not anonymisation. Applying them does not exit the scope of the regulation, and an architecture built on the belief that hashing anonymises is built on sand.",
                "Technical impossibility does not excuse denying data subject rights. The obligation sits with the controller, and choosing an architecture that cannot honour erasure is itself a choice the controller made.",
                "Design for erasure or irreversible anonymisation from the beginning. The guidance directs controllers to consider these rights at the technology-selection stage, which means the correct time to raise this is during architecture, not during the first request.",
                "Run a data protection impact assessment. Given immutability, cross-border replication and the difficulty of enforcing rights, the risk profile pushes toward a DPIA as a practical necessity.",
                "Prefer off-chain storage with an on-chain pointer. This is the recommended architecture, and it exists precisely so that deleting the off-chain payload renders the on-chain record unlinkable to an individual."
              ]
            },
            {
              kind: "compare",
              left: {
                title: "Architectures that survive this guidance",
                items: [
                  "Personal data held off-chain in systems with real deletion, with only a commitment or pointer written to the immutable layer",
                  "Per-subject envelope encryption with key destruction as the erasure mechanism, disclosed honestly as such",
                  "Immutable records containing only non-personal facts: build hashes, policy versions, aggregate counts with no re-identification path",
                  "Permissioned ledgers where the controller can be identified and where governance can effect changes",
                  "Pseudonymous identifiers whose linking table lives in a deletable system under your control"
                ]
              },
              right: {
                title: "Architectures that will not survive it",
                items: [
                  "Hashes of email addresses on-chain, treated as anonymised — the input space is small enough to brute force and the guidance treats hashes as personal data regardless",
                  "Encrypted personal data on-chain with the claim that encryption removes it from scope",
                  "A design whose erasure answer is that the technology does not permit it",
                  "Permanent storage of user-generated content with no classification and no key-based control",
                  "A DPIA written after launch to justify a decision already made"
                ]
              }
            },
            {
              kind: "prose",
              title: "The hashing trap, spelled out",
              body: "The single most common engineering error in this area is treating a hash as an anonymisation function. It is not one. A hash is deterministic, so the same input always produces the same output, which preserves linkability across every system that computes it. And where the input space is small or predictable — email addresses, phone numbers, national identifiers, dates of birth — the hash is trivially reversible by enumeration. Hashing a phone number gives you approximately no protection at all, because the entire space can be enumerated on commodity hardware in a short time. A salted hash with a secret salt is materially better, but only for as long as the salt is secret, and the salt is now the thing you must protect forever and destroy on erasure — which means you have built a crypto-shredding scheme with extra steps and worse ergonomics. If you are going to hold a secret to make the scheme work, hold a proper encryption key and get authenticated encryption in the bargain."
            },
            {
              kind: "quote",
              body: "Encrypted or hashed data remains personal and the regulation continues to apply.",
              source: "Summary of the EDPB Guidelines 02/2025 position on protective measures"
            },
            {
              kind: "callout",
              title: "How to use this in a design review without becoming the compliance department",
              body: "Do not cite the guidance as an authority to stop things. Cite it as a constraint that improves the design, because it does: an architecture with personal data off-chain and only commitments on-chain is more operable, cheaper, easier to migrate and easier to reason about than one that embeds personal data in an immutable record. The regulator here is pushing engineering toward the design a careful engineer would have chosen anyway. Say that, and you will be heard as an architect rather than as an obstacle."
            }
          ],
          glossary: ["controller", "data-subject-rights", "pseudonymisation", "dpia", "on-chain-pointer"],
          awards: ["regulation-literate", "hash-trap-avoider"]
        },
        {
          id: "ch-decinfra-p4-s3-lab-envelope",
          kind: "lab",
          title: "Lab: An Envelope Scheme You Can Actually Shred",
          statement: "A key hierarchy that cannot destroy one subject without destroying every subject will never be used, and an unused control is not a control.",
          minutes: 38,
          respect: 195,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Most encryption-at-rest designs are built for confidentiality and then repurposed for erasure, which is why they fail at erasure. Confidentiality wants few keys, because fewer keys are easier to protect and rotate. Erasure wants many keys, because the unit of destruction is the unit of erasure. If you have one key per tenant, then an individual erasure request either destroys the tenant or destroys nothing. Design the hierarchy for the granularity of your erasure obligation first, and then solve the key-management ergonomics, not the other way round."
            },
            {
              kind: "code",
              title: "The hierarchy, expressed as the operations it must support",
              lang: "typescript",
              body: "type KeyRef = string;\n\ninterface ShreddableStore {\n  putForSubject(subjectId: string, objectId: string, plaintext: Buffer): Promise<KeyRef>;\n  getForSubject(subjectId: string, objectId: string): Promise<Buffer>;\n  shredSubject(subjectId: string, reason: string, approver: string): Promise<ShredReceipt>;\n  attestShredded(subjectId: string): Promise<ShredAttestation>;\n}\n\ninterface ShredReceipt {\n  subjectId: string;\n  subjectKeyRef: KeyRef;\n  destroyedAt: string;\n  reason: string;\n  approver: string;\n  objectCount: number;\n  copiesEnumerated: string[];\n  receiptSignature: string;\n}\n\ninterface ShredAttestation {\n  subjectId: string;\n  subjectKeyExists: false;\n  unwrapAttemptResult: 'key-not-found';\n  verifiedAt: string;\n  verifierIdentity: string;\n}"
            },
            {
              kind: "prose",
              title: "Why the attestation type exists and why it is the important one",
              body: "The receipt records that you performed a destruction. The attestation records that the destruction is still true, verified by attempting the operation and observing it fail. These are different claims and only the second one is evidence. A receipt is something your system wrote about itself at the moment it believed it did something. An attestation is a negative result obtained by trying: ask the key management system to unwrap the subject key and record that it returned key-not-found. Run it on a schedule, keep the results, and you have a continuously verified erasure claim rather than a historical assertion. When a regulator or an auditor asks how you know the data is unreadable, the honest answer is that you tried to read it this morning and could not."
            },
            {
              kind: "code",
              title: "The destruction path, including the copies people forget",
              lang: "typescript",
              body: "async function shredSubject(\n  subjectId: string,\n  reason: string,\n  approver: string,\n  kms: KeyManagement,\n  caches: CacheRegistry,\n  backups: BackupRegistry\n): Promise<ShredReceipt> {\n  const subjectKeyRef = await kms.resolveSubjectKey(subjectId);\n\n  const enumerated: string[] = [];\n\n  await caches.evictAllForSubject(subjectId);\n  enumerated.push('service-memory-cache');\n\n  await kms.revokeAllGrants(subjectKeyRef);\n  enumerated.push('kms-grants');\n\n  const backupHolds = await backups.findHoldsFor(subjectKeyRef);\n  if (backupHolds.length > 0) {\n    throw new Error('shred blocked: key material retained in backups ' + backupHolds.join(','));\n  }\n  enumerated.push('backup-sets-verified-clear');\n\n  await kms.scheduleDestroy(subjectKeyRef, { pendingWindowDays: 0, force: true });\n  enumerated.push('kms-primary-key-material');\n\n  const objectCount = await countObjectsForSubject(subjectId);\n\n  return signReceipt({\n    subjectId,\n    subjectKeyRef,\n    destroyedAt: new Date().toISOString(),\n    reason,\n    approver,\n    objectCount,\n    copiesEnumerated: enumerated\n  });\n}"
            },
            {
              kind: "list",
              title: "The four copies that break real shredding programmes",
              items: [
                "Backups of the key management system itself. If your KMS is backed up nightly and backups are retained for ninety days, then a key destroyed today is recoverable for ninety days and your erasure claim is false for a quarter. Either exclude key material from backups entirely and accept the availability risk, or state the true erasure completion date, which is the backup expiry date, and tell the data subject that date.",
                "Plaintext data keys cached in running service memory. A long-lived process that unwrapped a key an hour ago still has it. Eviction must be an explicit, verified step, and processes that cannot be instructed to evict must be restarted.",
                "Escrow and break-glass copies. Someone created these for a legitimate recovery reason and they are usually held outside the normal key lifecycle, sometimes literally in a safe. They must be in the enumeration or the enumeration is fiction.",
                "Derived material. If a data key was used to derive per-file keys, or if it was ever exported for a migration, those derivatives and exports are copies. Migration exports in particular have a habit of persisting in an object store nobody has looked at in two years."
              ]
            },
            {
              kind: "checklist",
              title: "Prove the scheme before you rely on it",
              items: [
                "Encrypt a test subject dataset, shred it, and then attempt retrieval through every read path in the system, confirming each fails with a key error rather than a stale cache hit",
                "Restart every service and re-attempt retrieval, to prove the failure is not merely a cache eviction that a restart would undo",
                "Restore your key management system from its most recent backup into an isolated environment and attempt retrieval there, then record the true date on which that path closes",
                "Run the scheduled attestation for thirty days and confirm it has produced key-not-found every day, with the results retained",
                "Have someone other than the implementer attempt to recover the shredded subject data using any means available to them, with a time box and a written result",
                "Confirm that shredding one subject leaves every other subject fully readable, because a scheme that cannot do this will be refused in production"
              ]
            },
            {
              kind: "callout",
              title: "The date you must be able to state",
              body: "For any erasure request, you should be able to name the exact date on which the last recoverable copy of the key ceases to exist, and that date is almost never today. It is the expiry of your longest key-material backup retention. Organisations that cannot name this date discover it during a regulator interaction, which is the most expensive possible moment to learn your own retention schedule."
            }
          ],
          praxis: "Implement the envelope hierarchy and the shred path against a real key management system, then run the full proof checklist including the backup-restore recovery attempt.",
          glossary: ["shred-receipt", "shred-attestation", "key-escrow", "break-glass", "derived-key"],
          awards: ["shred-engineer", "enumerated-every-copy"]
        },
        {
          id: "ch-decinfra-p4-s4-drill-erasure-request",
          kind: "drill",
          title: "Drill: The Erasure Request That Lands On Permanent Storage",
          statement: "The answer to a data subject is not a technical explanation, it is a commitment about what you will do and by when, and it must be true.",
          minutes: 24,
          respect: 180,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Erasure requests are usually routine. This one is not, because the data in question was written to a substrate with no delete two years ago by a team that no longer exists, before your envelope scheme was in place. You are about to make a written statement to a data subject and, downstream, potentially to a supervisory authority. The wrong instinct here is to optimise the sentence. The right instinct is to establish what is actually true before writing anything, and then to say that, including the uncomfortable part."
            },
            {
              kind: "list",
              title: "What you have established in the first hour",
              items: [
                "The subject records were written to permanent storage in 2024, in plaintext, before encryption-before-write was mandated.",
                "The records contain name, email, a support transcript and one uploaded attachment of unknown content.",
                "Your current systems can delete every off-chain copy, and your gateway can stop serving the permanent content through your own domain.",
                "You have no delete primitive for the permanent copy, and you do not know how many independent parties hold replicas.",
                "The statutory response window has twenty-six days remaining. Your general counsel is available. Your CEO has asked to see the response before it goes."
              ]
            }
          ],
          drill: {
            id: "ch-decinfra-p4-s4-drill",
            scene: "Monday. A data subject has exercised their right to erasure. Their records were written in plaintext to a permanent storage substrate in 2024, before your controls existed. You can delete every copy you control and stop serving it from your own gateway, but the permanent copy cannot be removed and you cannot enumerate who holds replicas. Twenty-six days remain in the response window. Legal is engaged, and the CEO wants to approve the wording.",
            clock: "26 days to a written response, and every day of delay narrows your options",
            pressure: "A statement that will be read by a regulator, a CEO who wants it to sound better than it is, and a fact pattern with no good version",
            prompt: "What is your recommended response and remediation?",
            options: [
              {
                id: "opt-a",
                label: "Respond that the erasure has been completed, having deleted every copy under your control and removed it from your gateway",
                detail: "Technically defensible framing: you deleted everything you have the ability to delete.",
                score: -3,
                outcome: "The statement is false in the way that matters most. The data remains retrievable by anyone through any other gateway, and it takes one person to demonstrate that. When it is demonstrated, the issue is no longer an erasure failure — which is an architecture problem with mitigating circumstances — but a false statement to a data subject, which is a candour problem with none.",
                ripple: "You have converted a difficult, explicable technical limitation into a credibility failure. Every subsequent statement your organisation makes to that authority is now read with suspicion, and the internal cost is worse: you have established that the security function will sign off on comfortable wording. The next person asked to do it will find it easier."
              },
              {
                id: "opt-b",
                label: "Respond honestly: delete everything you control, disclose that a permanent copy exists and cannot be removed, state precisely what you have done to make it unreachable, and set out the remediation programme with dates",
                detail: "Full disclosure of the limitation, a concrete account of the mitigation, and a commitment that the class of failure is being closed.",
                score: 3,
                outcome: "The response is uncomfortable to write and it is the only one that holds. You delete all controlled copies, remove the content from your own gateway and submit it to public gateway denylists, disclose the permanent copy plainly, and commit to specific dates for encrypt-before-write and for retrospective review of everything written before the control existed. The data subject knows exactly where they stand. Legal has a defensible file showing prompt disclosure and concrete remediation.",
                ripple: "You have made the organisation credible on the day it had bad news, which is the only day credibility is actually established. Internally, the disclosure creates the mandate that six months of architecture advocacy could not: the retrospective review is funded within a week, because now there is a named subject and a written commitment. Difficult honesty converts a compliance failure into organisational momentum.",
                isBest: true
              },
              {
                id: "opt-c",
                label: "Request an extension, commission legal analysis on whether the permanent copy constitutes processing by you, and respond once the position is settled",
                detail: "Take the time the law allows, get the legal characterisation right, and answer once rather than twice.",
                score: -1,
                outcome: "The legal question is genuinely interesting and entirely secondary. Weeks pass, the analysis concludes what everyone already suspected — that you were the controller who put it there — and the subject receives a delayed response that reads as evasive because it was preceded by silence. Meanwhile nothing was done about the underlying architecture, because the extension removed the urgency that would have funded it.",
                ripple: "You optimised for legal precision at the cost of the two things that actually matter in a data protection interaction: promptness and candour. Extensions are a tool for complex identity verification and volume, not for buying time to feel better about a fact you already know. You also lost the remediation window that the request had opened."
              },
              {
                id: "opt-d",
                label: "Disclose the limitation but commit to obtaining removal from the permanent substrate, and open engagement with the network community to explore options",
                detail: "Honest about today, ambitious about tomorrow, and demonstrably making every effort.",
                score: 0,
                outcome: "The honesty is right and the commitment is not deliverable. There is no removal mechanism, no party who can perform one, and no realistic community process that produces one. In six months you must either report failure on a commitment you made in writing to a regulator, or quietly let it lapse. Both are worse than never having promised it.",
                ripple: "This is the sympathetic wrong answer, made by people trying hard to be constructive. Committing to an outcome that the substrate does not permit converts a one-time disclosure of a limitation into a rolling record of unmet undertakings. Never promise a regulator an outcome that depends on a mechanism that does not exist."
              }
            ],
            debrief: "Option B is correct because in data protection interactions, the currency is candour and promptness, not technical success. Nobody expects an organisation to be able to reach into thousands of independent replicas. Everybody expects an organisation to say clearly what happened, what it has done, what it cannot do, and how it is preventing recurrence. Option A is the catastrophic one, and it is catastrophic for a reason worth internalising: it converts a defensible engineering limitation into an indefensible integrity failure, and the second is far more expensive than the first in every dimension — regulatory, commercial and cultural. Option C mistakes legal precision for the goal; the characterisation question is real but it does not change what you must tell the subject, and the delay costs you the remediation mandate. Option D is generous and undeliverable, and undeliverable commitments to regulators compound. Notice the structural lesson about timing. The remediation programme in option B gets funded because of the request, not despite it. Security functions routinely fail to get retrospective data reviews funded because there is no forcing event; when a forcing event arrives, the correct move is to attach the structural fix to it immediately, in writing, with dates, while the organisation attention is at its peak. The request is the leverage. Use it in the same week it arrives or you will not get it again.",
            principle: "Tell a data subject exactly what you did, exactly what you cannot do, and exactly what changes because of it — and never promise an outcome the substrate cannot deliver."
          },
          glossary: ["right-to-erasure", "supervisory-authority", "candour", "remediation-commitment"],
          awards: ["honest-under-pressure", "leverage-the-forcing-event"]
        },
        {
          id: "ch-decinfra-p4-s5-council-dpia",
          kind: "council",
          title: "Council: The DPIA Conversation With Legal",
          statement: "A data protection impact assessment written by legal alone is a description, and one written by engineering alone is a defence, and only the two written together are a decision.",
          minutes: 28,
          respect: 155,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "The DPIA on a decentralized architecture is the one document where the engineering reality and the legal position must be made to sit in the same sentence, and the two functions have opposite instincts about how to write it. Legal wants defensible language, which tends toward the general. Engineering wants accurate language, which tends toward the specific and the alarming. Both instincts are correct and the document fails if either wins outright. Your job in this conversation is to be the person who makes the specific facts legally usable rather than the person who makes them legally frightening."
            },
            {
              kind: "table",
              title: "The translation table you should walk in with",
              headers: ["What engineering says", "What legal hears", "What to write instead"],
              rows: [
                ["The data is immutable and cannot be deleted", "We are in breach and it cannot be fixed", "Erasure is effected by destruction of the decryption key; the ciphertext persists and is disclosed as such, with the key destruction date stated"],
                ["We do not know who holds copies", "Uncontrolled international transfer", "Replication is to an open set of participants; the mitigation is that no participant holds readable data, and the transfer analysis is performed on the ciphertext and key custody rather than on the substrate"],
                ["Hashing anonymises it", "We have no obligation here", "Hashes are treated as personal data; anonymisation is not claimed; pseudonymisation is claimed and the linking table is held in a deletable system"],
                ["It is decentralized so there is no controller", "Nobody is accountable, which is worse", "We are the controller for the processing we initiate; the substrate is a processor-like technical means with no contract, which is why we do not put personal data on it"],
                ["We can crypto-shred", "The data is gone", "Data becomes unreadable on key destruction; residual risk of future cryptographic weakness is stated and accepted at a named level of the organisation"]
              ]
            },
            {
              kind: "numbered",
              title: "How to run the working session so it produces a decision",
              items: [
                "Bring the architecture diagram with the data flows already annotated by category, and the specific fields listed. Vague inputs produce vague assessments, and the vagueness will be resolved in the direction of whoever is more confident in the room.",
                "State the residual risks yourself, before legal finds them. You lose nothing and you gain the position of the honest broker, which is the position from which your mitigations get accepted without argument.",
                "For each risk, bring the mitigation and its cost. A risk with a costed mitigation is a decision. A risk without one is an anxiety, and anxieties are resolved by adding words to a document rather than controls to a system.",
                "Name the person who accepts each residual risk, by role, and get it written down. Unowned accepted risk reverts to the security function by default, and you will be the one holding it in two years.",
                "Set the review trigger explicitly — not a calendar date but an event: any new field written to the substrate, any change of storage substrate, any change in the categories of data processed. Calendar reviews are performed by whoever is available; event triggers are performed by whoever caused the event.",
                "Close by writing the one-paragraph summary that a non-specialist executive will actually read, and read it aloud to the room. If it makes the engineers wince, it is inaccurate. If it makes legal wince, it is imprudent. Iterate until neither winces and both agree it is true."
              ]
            },
            {
              kind: "principle",
              title: "Never let a mitigation be written as a plan",
              body: "A DPIA that says we will implement encryption before write is a description of an intention, and intentions are not mitigations. Either the control exists, in which case describe it in the present tense with evidence, or it does not, in which case the risk is unmitigated today and must be recorded as such with a date and an owner. The document is a record of the state of the world, not of the roadmap. This distinction is what separates a DPIA that protects the organisation from one that documents its negligence with a timestamp."
            },
            {
              kind: "callout",
              title: "If it ever reaches a supervisory authority",
              body: "The single strongest thing you can present is a DPIA written before the processing began, containing the exact risk that later materialised, with a named accepter and a mitigation that was actually implemented. That document turns an incident from evidence of carelessness into evidence of a managed risk that occurred anyway, which is a fundamentally different conversation. The second strongest is one written after, honestly, with the same rigour. The weakest is a polished one written after, which reads as reconstruction and will be treated as such."
            }
          ],
          glossary: ["dpia-working-session", "residual-risk-owner", "review-trigger", "pseudonymisation-claim"],
          awards: ["honest-broker", "risk-owner-named"]
        },
        {
          id: "ch-decinfra-p4-s6-tombstones",
          kind: "lesson",
          title: "Tombstones, Denylists And Who Actually Controls Availability",
          statement: "Every removal mechanism in a decentralized system is really a request to an intermediary, which means availability is controlled by whoever operates the layer people actually use.",
          minutes: 26,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "There is a persistent belief that decentralized content cannot be moderated. It is wrong in an instructive way. The content cannot be deleted, which is true and permanent. But the overwhelming majority of access happens through a small number of intermediaries — public gateways, pinning services, indexers, name resolvers, wallets and applications — and every one of those can decline to serve. What actually exists is not a censorship-resistant system but a system where censorship has moved from the storage layer to the access layer, and where the access layer is far more centralised than the storage layer. That is the real map, and it is very different from the marketing one."
            },
            {
              kind: "table",
              title: "Five removal mechanisms and their honest reach",
              headers: ["Mechanism", "What it actually does", "Who controls it", "Reach"],
              rows: [
                ["Unpin", "Your node stops holding and stops advertising the blocks", "You", "Only your copy; anyone else holding it is unaffected"],
                ["Gateway denylist entry", "One gateway refuses to serve the path, typically via a compact denylist with double-hashed entries", "Each gateway operator independently", "One gateway per submission; a real takedown means many submissions and many operators"],
                ["Indexer or search removal", "The content stops being discoverable through that index", "The indexer operator", "Discovery only; direct retrieval by identifier is unaffected"],
                ["Tombstone record", "A new record asserting the previous one is retracted", "You, as the publisher", "Only readers who look for it — most integrations will not, and the original remains readable"],
                ["Key destruction", "The ciphertext becomes unreadable to everyone including you", "You, if and only if you encrypted before publication", "Universal, which is why it is the only mechanism worth relying on"]
              ]
            },
            {
              kind: "prose",
              title: "The mutable-pointer trap",
              body: "Systems that add mutability on top of content addressing — IPNS being the canonical example — create a specific and often unexamined risk. An IPNS record is a signed statement binding a name to a value, carrying a sequence number and a validity period, published into the DHT with a recommendation that records expire within 48 hours, capped at 10 KiB, and signed with a key type such as Ed25519. Two consequences follow directly. First, whoever holds the private key controls what every consumer of that name sees, which makes the name key a production credential of the highest sensitivity and one that is frequently kept in a developer home directory. Second, an adversary who can suppress your republication can hold consumers on an old record until it expires — a rollback within the validity window — which matters enormously if the name points at software or policy. Treat a mutable-pointer key with the same custody, rotation and monitoring you would apply to a code-signing key, and monitor the sequence number your consumers actually observe from an independent vantage point, because that is the only way you find out that they are not seeing what you published."
            },
            {
              kind: "principle",
              title: "Tombstones are advisory, keys are dispositive",
              body: "A retraction record only works if readers check for one. In practice, integrations resolve an identifier once, cache it, and never look again — the exact property that made content addressing attractive is the property that makes retraction ineffective. If your removal design depends on readers behaving well, it is a convention, not a control. Design retraction for the honest majority and key destruction for the adversary, and never present the first as if it were the second."
            },
            {
              kind: "list",
              title: "What to do the day you need something to stop being available",
              items: [
                "Destroy the key first if the content was encrypted, because that is the only step with universal reach and every other step is a mitigation of visibility rather than of access",
                "Stop serving from every surface you control, including your own gateway, your CDN, your application, and any cache in front of them",
                "Submit denylist entries to the public gateways with meaningful traffic share, in the double-hashed form so your submission does not itself publish the address",
                "Publish a retraction record and update any mutable pointer, understanding that this reaches only well-behaved readers",
                "Instrument for it: monitor whether the content is still retrievable from independent vantage points, because the only honest status is the one you measured this morning rather than the one you requested last week"
              ]
            },
            {
              kind: "callout",
              title: "The uncomfortable corollary for anyone building on this",
              body: "If access control lives at the gateway layer, then the gateway operators are your effective moderation authority, your effective availability provider, and your effective censor. You did not escape centralisation; you outsourced it to a set of operators with whom you have no contract, no service level and, frequently, no relationship. Decide deliberately whether that is acceptable. For many use cases it genuinely is. For anything where availability is a commitment you have made to a customer, run your own gateway, and treat the public ones as a convenience rather than as infrastructure."
            }
          ],
          glossary: ["tombstone", "ipns", "sequence-number", "rollback-window", "access-layer-centralisation"],
          awards: ["availability-cartographer", "pointer-key-custodian"]
        }
      ]
    },
    {
      id: "ch-decinfra-p5-substrate",
      title: "THREAT MODELS OF THE SUBSTRATE",
      credential: "Certified Architect — Hybrid Centralized and Decentralized Security Architecture",
      summary: "The final Page moves from the data to the network that carries it. Eclipse and Sybil attacks, incentive and griefing attacks, node operator compromise, and the availability-versus-censorship frame. Then the synthesis: how to design, instrument and defend a security architecture that spans a regulated organisation and a substrate nobody owns.",
      competencies: [
        "Model eclipse and Sybil attacks quantitatively, using published resource budgets and success rates rather than intuition",
        "Recognise incentive attacks — free riding, griefing, bribery and grinding — as first-class threats with economic rather than technical mitigations",
        "Detect peer-layer isolation and node compromise in a fleet you operate, with instrumentation designed before the incident",
        "Hold the availability-versus-censorship frame without collapsing into either naive maximalism",
        "Design and defend a hybrid architecture with an explicit seam, explicit trust boundaries and explicit failure behaviour"
      ],
      seal: "SEAL-SUBSTRATE-I",
      steps: [
        {
          id: "ch-decinfra-p5-s1-eclipse-sybil",
          kind: "lesson",
          title: "Eclipse And Sybil, With The Real Numbers",
          statement: "You do not need to defeat a network to defeat a participant, and the published cost of isolating one node is well within the reach of an ordinary criminal budget.",
          minutes: 34,
          respect: 190,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "A Sybil attack creates many identities. An eclipse attack uses identities to surround one victim so that every connection the victim has runs through the attacker. The distinction matters operationally: Sybil resistance is a network-wide property maintained by the protocol, and eclipse resistance is a per-node property maintained partly by the protocol and partly by the operator. Defending against Sybil is largely not your job. Defending against eclipse very much is, because the controls that work — peer diversity, pinned trusted peers, out-of-band consistency checks — are operator controls that no protocol can apply on your behalf."
            },
            {
              kind: "timeline",
              title: "The published five-stage eclipse against Ethereum execution nodes",
              items: [
                "Stage one, discovery table poisoning: pre-fill the target persistent peer database with attacker-controlled entries using unsolicited discovery messages, so that on restart the victim rebuilds its view from attacker data.",
                "Stage two, DNS peerlist infiltration: get attacker nodes into the DNS-based bootstrap list. Reported cost is on the order of 28 IP addresses sustained over roughly 100 days to reach about half of the list.",
                "Stage three, network-wide inbound slot occupation: pre-emptively occupy inbound connection slots across many honest nodes so that benign peers cannot accept the victim outbound dials.",
                "Stage four, outbound hijack: when the victim restarts and dials out, its choices come from the poisoned table. Reported success rises from around 45 percent to around 95 percent once slot occupation is in place.",
                "Stage five, inbound hijack: flood the victim inbound slots. On testnet, 100 percent within 30 seconds; on mainnet, around 45 percent within 30 seconds and around 60 percent within two days.",
                "Overall reported resource requirement: on the order of 720 public IP addresses for mainnet, and 304 for the testnet variant."
              ]
            },
            {
              kind: "prose",
              title: "Read the restart dependency, because it is the operational lever",
              body: "Notice that the attack is anchored on restart. Poisoned tables become effective when the node rebuilds its peer set, and the paper explicitly considers client release cadence as an input, because operators restart to upgrade. This has a direct operational consequence that almost nobody implements: restart is a security-sensitive event for a peer-to-peer node, and it should be treated like one. Stagger restarts across your fleet rather than restarting everything at once during a maintenance window; never let every node in a fleet bootstrap from the same list at the same moment; and monitor peer-set composition specifically in the minutes after a restart, because that is the window in which the composition is decided for the rest of the node life."
            },
            {
              kind: "table",
              title: "The cost of isolation across three substrates, and what it implies",
              headers: ["Target", "Reported adversary resource", "Reported effect", "Implication for you"],
              rows: [
                ["One Ethereum execution node", "On the order of 720 public IP addresses, sustained over weeks", "Full isolation on restart with high probability", "Node isolation is affordable to organised crime; assume it is available to anyone motivated by a meaningful sum"],
                ["One content identifier in the IPFS DHT", "Sybil nodes placed around one key, on the order of the K parameter of 20", "Roughly 80 percent lookup denial on recent client versions", "Targeted content censorship is dramatically cheaper than node isolation; never treat DHT resolution as an availability guarantee"],
                ["A large share of IPFS retrieval", "62 hijacked BGP prefixes", "Roughly 70 percent censorship effectiveness; a single malicious autonomous system reaching 75 percent of content for over 57 percent of requesters", "Your peer-to-peer availability inherits every weakness of interdomain routing, amplified by cloud concentration"]
              ]
            },
            {
              kind: "list",
              title: "Operator controls that actually raise the cost of eclipse",
              items: [
                "Pin a set of trusted static peers you operate or know, so that a full eclipse requires isolating you from named parties rather than from an anonymous population — this is the single highest-value control and it is a configuration line",
                "Enforce diversity constraints on the peer set: limit peers per subnet, per autonomous system and per hosting provider, because an attacker with 700 addresses usually has them in few netblocks",
                "Stagger restarts, and re-bootstrap from a list that differs per node in the fleet so a single poisoned list cannot capture the whole fleet at once",
                "Run an out-of-band consistency check: compare the head state your node reports with an independent source over a path that does not traverse your peer set, and alert on divergence rather than on peer count",
                "Rate-limit unsolicited discovery traffic — the published mitigation suggests penalising peers exceeding roughly five pings per minute — and log what you dropped, because the log is your early warning",
                "Alert on peer-set churn and on composition change, not just on peer count; a node with a healthy count of peers who are all new and all in one netblock is already lost"
              ]
            },
            {
              kind: "callout",
              title: "The detection question that catches it",
              body: "Peer count is the metric everyone graphs and it is nearly useless, because a successful eclipse leaves the count perfectly healthy. Graph instead: the number of distinct autonomous systems in your peer set, the fraction of peers first seen in the last hour, and the agreement between your view of the chain or the content and an independent view fetched over a different network path. An eclipse is visible in all three of those and in none of the peer count."
            }
          ],
          glossary: ["eclipse-attack", "peer-diversity", "static-peers", "bootstrap-poisoning", "autonomous-system"],
          awards: ["eclipse-aware", "diversity-enforcer"]
        },
        {
          id: "ch-decinfra-p5-s2-incentive-attacks",
          kind: "lesson",
          title: "Incentive Attacks: When The Adversary Is Rational Rather Than Technical",
          statement: "In a system held together by incentives, the most dangerous attacker does not break anything — they follow the rules to an outcome the designers did not want.",
          minutes: 30,
          respect: 185,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Security engineers are trained to look for the bug: the memory corruption, the missing authorisation check, the parser confusion. Incentive attacks contain none of those. Every message is well formed, every signature valid, every protocol rule respected. The attack is the strategy. This is genuinely difficult for a traditional security mind because there is nothing to patch, and it is the category that most reliably surprises organisations moving from centralized systems to economic ones."
            },
            {
              kind: "table",
              title: "The five incentive attack families",
              headers: ["Family", "The strategy", "Why it works", "Mitigation shape"],
              rows: [
                ["Free riding", "Consume the network resource while contributing nothing back", "Serving costs the server and costs the requester nothing, so pure altruism is unstable at scale", "Make contribution a precondition of service, or price the resource; reputation alone is insufficient because identities are free"],
                ["Griefing", "Impose cost on another participant with no gain to yourself, sometimes at a cost to yourself", "Most protocols price attacks by the attacker gain and assume rational profit-seeking, which griefers are not", "Bound the cost any counterparty can impose on you per unit of resource they spend; measure the griefing ratio explicitly"],
                ["Free option", "Enter an agreement, observe how conditions develop, then abandon it if the outcome is unfavourable", "Timeouts and dispute windows create a period during which one party has an option the other has written for free", "Require collateral proportional to the value of the option, and shorten the window in which abandonment is costless"],
                ["Bribery", "Pay honest participants more to deviate than they earn by complying", "Rational participants take the better payment; nothing in the protocol distinguishes a bribe from revenue", "Make deviation slashable, so the bribe must exceed the stake at risk, and keep stake meaningfully larger than plausible bribes"],
                ["Grinding", "Cheaply search over choices you control to bias an outcome the protocol treats as random", "Randomness derived from participant-influenced inputs is not random against a participant willing to iterate", "Derive randomness from a verifiable delay function or an unbiasable beacon, so searching costs wall-clock time that cannot be parallelised"]
              ]
            },
            {
              kind: "prose",
              title: "The griefing ratio, and why it belongs on your dashboard",
              body: "The most useful single number in this domain is the ratio of cost imposed on the victim to cost borne by the attacker. If an adversary can cost you a hundred units by spending one, you have a griefing ratio of one hundred and you will eventually meet someone with a motive that is not financial: a competitor, an activist, a bored teenager, a former employee. Compute this ratio deliberately for each interaction your system exposes to strangers. For a compute provider: what does it cost an adversary to make you consume a gigabyte-hour, and what does that gigabyte-hour cost you. For a storage deal: what does it cost to make you seal a sector that is then abandoned. Most systems have never computed this, and the ones that have are the ones that survive contact with an unprofitable attacker."
            },
            {
              kind: "prose",
              title: "Why verifiable delay functions keep appearing",
              body: "You have now seen a verifiable delay function in two places in this chapter: at the heart of Arweave mining, and as the mitigation for grinding. That is not a coincidence, it is the same problem twice. Any protocol that needs an unpredictable value that participants cannot bias faces an adversary who will iterate over inputs until the output favours them. Hash-based randomness invites grinding because hashing is parallel and cheap. A delay function is inherently sequential, so iterating costs wall-clock time that cannot be bought with more machines. When you see a VDF in a design, read it as the designer having identified a grinding surface and closed it. When you see participant-influenced randomness with no delay function, read it as a grinding surface nobody has looked at yet, and go look."
            },
            {
              kind: "principle",
              title: "Price the attack, not the attacker",
              body: "Traditional threat modelling asks who would want to attack us and what they would gain. Incentive systems require the inverse question: what is the cheapest way for anyone at all to impose the largest cost, regardless of whether they gain anything. Assume the attacker gains nothing and is doing it because they can. If the system survives that assumption it survives the profit-motivated adversary trivially, because the profit-motivated adversary is strictly more constrained."
            },
            {
              kind: "callout",
              title: "The organisational failure this produces",
              body: "Incentive attacks land in an accountability gap. They are not vulnerabilities, so the security team says it is a protocol design issue. They are not bugs, so engineering says it is working as intended. They are not fraud in the legal sense, so risk says it is an engineering matter. Meanwhile the losses are real and recurring. Someone must own the question of whether the economic design is being exploited, and in every organisation that handles this well, that owner sits in security and has learned enough mechanism design to argue with the protocol team on their own terms. That is a career-defining specialisation and it is currently very scarce."
            }
          ],
          glossary: ["griefing-ratio", "free-option", "grinding", "slashing", "mechanism-design", "free-rider"],
          awards: ["incentive-modeler", "priced-the-attack"]
        },
        {
          id: "ch-decinfra-p5-s3-drill-fleet-quiet",
          kind: "drill",
          title: "Drill: The Fleet That Looks Healthy And Is Not",
          statement: "Every dashboard is green during a successful eclipse, because the attacker controls the data your dashboard is made of.",
          minutes: 24,
          respect: 195,
          trust: 12,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "The defining property of peer-layer compromise is that the compromised node reports normally. It has peers, it is syncing, it is serving requests, its latency is fine. All of that information comes from the node, and the node is being fed by the adversary. Any monitoring architecture that asks a node how it is doing will be told that it is doing well. The only reliable signals are comparative and external, and the moment to build them is before the incident, which is why this drill is about a decision made with imperfect information rather than about analysis."
            },
            {
              kind: "list",
              title: "The situation as your monitoring presents it",
              items: [
                "You operate a fleet of nine nodes across three providers, serving a customer-facing data availability product with a contractual availability commitment.",
                "Four hours ago you completed a rolling client upgrade across all nine, restarting them within a forty-minute window.",
                "All nine report healthy peer counts, are syncing, and are serving. No alert has fired.",
                "One customer reports that a specific record they published two hours ago is not retrievable through your service, though it is retrievable elsewhere. Your own retrieval test for that record succeeds.",
                "Your peer-diversity metric, which you added last quarter, shows that three of the nine nodes now have peer sets concentrated in two autonomous systems, up from a normal spread of fifteen or more."
              ]
            }
          ],
          drill: {
            id: "ch-decinfra-p5-s3-drill",
            scene: "Thursday, 14:20. Four hours after a rolling upgrade restarted all nine of your nodes inside a forty-minute window, a customer reports one record unretrievable through your service though it resolves fine elsewhere. Every node reports healthy. Your own test for that record passes. The only anomaly anywhere is that three nodes now draw their peers from two autonomous systems instead of the usual fifteen-plus. Your availability commitment is contractual and the quarterly report goes out in nine days.",
            clock: "Unknown — if this is an eclipse it has been running for four hours and is stable",
            pressure: "One customer report, one soft metric, nine green dashboards, and a contractual commitment that makes declaring an incident expensive",
            prompt: "What is your next move?",
            options: [
              {
                id: "opt-a",
                label: "Ask the customer for more detail and open a normal support investigation while monitoring the diversity metric",
                detail: "One report and one soft signal do not justify an incident. Gather evidence properly before escalating.",
                score: -2,
                outcome: "The support path takes a day, during which the three affected nodes continue to serve a partial and attacker-influenced view. More customers are affected but do not report, because a single unretrievable record looks like their own error. By the time the pattern is clear, you have a multi-day availability failure to explain rather than a four-hour one.",
                ripple: "You applied a support-shaped process to a peer-layer integrity question. The deeper error is treating the customer report as the primary signal when the diversity metric was the primary signal — the customer report merely told you when to look at it. Your team learns that soft internal signals do not trigger action, which means the next one will not be looked at either."
              },
              {
                id: "opt-b",
                label: "Immediately re-bootstrap the three low-diversity nodes onto pinned trusted peers, and run an out-of-band comparison of their view against an independent source",
                detail: "Treat the diversity anomaly as the finding, restore a known-good peer anchor, and verify their view from outside their peer set.",
                score: 3,
                outcome: "Re-bootstrapping onto pinned peers restores diversity within minutes and, critically, the out-of-band comparison immediately shows that the three nodes had been serving a view missing recent records. The customer report was one visible symptom of a systematic partial isolation that began at restart. You have a diagnosis, a containment, and a four-hour blast radius rather than a multi-day one.",
                ripple: "Your team internalises the correct escalation trigger for peer-to-peer infrastructure: composition anomalies are treated as integrity incidents, not as capacity noise. You also now have proof that the diversity metric earns its place, which funds the rest of the instrumentation. And you have learned that a forty-minute rolling restart across nine nodes is a synchronised bootstrap event — the exact condition the published eclipse research identifies as the opening — so the restart policy changes the same week.",
                isBest: true
              },
              {
                id: "opt-c",
                label: "Roll back the client upgrade across the fleet, on the theory that the upgrade introduced the problem",
                detail: "The one thing that changed four hours ago was the upgrade, so undo it.",
                score: 0,
                outcome: "The rollback is a reasonable instinct and it accidentally helps, because it restarts the nodes and they may re-bootstrap into a better peer set. But it is a coincidental fix arrived at by a wrong theory, it burns your rollback option on a non-cause, and if the attacker is still occupying inbound slots the restart may simply re-establish the same poisoned view. You may also reintroduce whatever the upgrade fixed.",
                ripple: "Fixing something by accident is worse than not fixing it, because the team now believes a false causal story: upgrades cause retrieval failures. That story will misdirect the next three investigations. The correlation between the restart and the failure was real; the causal mechanism was the bootstrap, not the code."
              },
              {
                id: "opt-d",
                label: "Declare a customer-impacting incident, notify all customers of possible retrieval failures, and begin a full fleet investigation",
                detail: "Maximum transparency and maximum resources, immediately.",
                score: 1,
                outcome: "Not wrong, and defensible. But you have notified customers of an unbounded problem before you can characterise it, which produces a wave of enquiries your team must field during the investigation, and the investigation is now conducted under communication load. The containment action in option B takes five minutes and would have given you a characterised incident to notify about.",
                ripple: "You built a reputation for transparency, which is worth something real, at the cost of a slower and more chaotic technical response. The refinement to take away is not to notify less, it is to sequence: perform the five-minute containment that also serves as the diagnostic, then notify with a characterisation. Notification quality matters more than notification speed once you are past the first hour."
              }
            ],
            debrief: "The teaching point is that in peer-to-peer infrastructure, containment and diagnosis are frequently the same action, and that action is cheap. Re-bootstrapping onto pinned trusted peers takes minutes, is low risk, restores a known-good anchor, and — because you compare the before and after view — tells you definitively whether the node was isolated. There is rarely a reason to investigate first, because investigation using data from the possibly compromised node is investigation using the adversary data. Option A is the most common real-world failure: the signal that mattered was internal and soft, and the organisation waited for a hard external signal that will always arrive late because individual users attribute isolated failures to themselves. Option C is the correlation trap, and its real cost is the false causal story it leaves behind. Option D is directionally right and mis-sequenced. Underneath all of it sits the operational lesson about restarts. Nine nodes restarted inside forty minutes is a synchronised bootstrap, and the published eclipse research identifies restart as the moment the peer set is decided. Staggering restarts across hours and varying the bootstrap source per node costs nothing and removes the single window in which a whole fleet can be captured at once. Most operators restart fleets in a tight window because it is operationally tidy. Tidy and safe are different objectives here.",
            principle: "In peer-to-peer operations, re-anchor first and investigate second, because the cheapest containment is also the only trustworthy diagnostic."
          },
          glossary: ["synchronised-bootstrap", "pinned-peer", "out-of-band-comparison", "composition-anomaly"],
          awards: ["reanchor-reflex", "soft-signal-respecter"]
        },
        {
          id: "ch-decinfra-p5-s4-lab-instrument-fleet",
          kind: "lab",
          title: "Lab: Instrument A Fleet For Isolation And Divergence",
          statement: "Build the three metrics that a healthy node cannot fake, then alert on the comparison rather than on the node.",
          minutes: 36,
          respect: 190,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Standard node monitoring measures liveness and throughput, both of which a compromised node reports beautifully. What you need instead are three comparative signals: the diversity of the peer set, the freshness and turnover of that set, and the agreement between what this node believes and what an independent observer believes. The third is the decisive one and it must traverse a network path that does not share fate with the node peer connections, or you are asking the adversary to grade their own work."
            },
            {
              kind: "code",
              title: "Peer-set diversity and churn, computed from the node own peer list",
              lang: "python",
              body: "import ipaddress, time\nfrom collections import Counter\n\ndef peer_metrics(peers, asn_lookup, first_seen, now=None):\n    now = now or time.time()\n    asns = Counter()\n    prefixes = Counter()\n    fresh = 0\n\n    for p in peers:\n        addr = ipaddress.ip_address(p['ip'])\n        asns[asn_lookup(addr)] += 1\n        if addr.version == 4:\n            prefixes[str(ipaddress.ip_network(str(addr) + '/24', strict=False))] += 1\n        else:\n            prefixes[str(ipaddress.ip_network(str(addr) + '/48', strict=False))] += 1\n        if now - first_seen.get(p['id'], now) < 3600:\n            fresh += 1\n\n    total = max(len(peers), 1)\n    top_asn_share = (asns.most_common(1)[0][1] / total) if asns else 0.0\n\n    return {\n        'peer_count': len(peers),\n        'distinct_asns': len(asns),\n        'distinct_prefixes': len(prefixes),\n        'top_asn_share': top_asn_share,\n        'fresh_peer_fraction': fresh / total\n    }\n\nALERTS = [\n    ('distinct_asns', 'lt', 8, 'peer-set concentrated: possible eclipse staging'),\n    ('top_asn_share', 'gt', 0.35, 'single autonomous system dominates peer set'),\n    ('fresh_peer_fraction', 'gt', 0.7, 'peer set almost entirely rebuilt: check for forced churn')\n]"
            },
            {
              kind: "prose",
              title: "Choosing the thresholds honestly",
              body: "Do not take those numbers as given. Run the metrics for two weeks with no alerting and look at the distribution for your fleet, your client and your network position. Set thresholds at the edge of your observed normal, not at a number from a document. Then, and this is the part that gets skipped, deliberately induce the condition: start a node with a bootstrap list containing only peers in one hosting provider and confirm the alert fires. An alert that has never fired on a real condition is a hypothesis, and you will discover its bugs during the incident it was built for."
            },
            {
              kind: "code",
              title: "The divergence check that does not trust the node",
              lang: "python",
              body: "import hashlib, asyncio\n\nasync def divergence_probe(node_client, independent_clients, probe_keys):\n    findings = []\n    for key in probe_keys:\n        local = await node_client.fetch(key)\n        local_digest = hashlib.sha256(local).hexdigest() if local else None\n\n        remote_digests = await asyncio.gather(\n            *[c.fetch_digest(key) for c in independent_clients],\n            return_exceptions=True\n        )\n        remote_digests = [d for d in remote_digests if isinstance(d, str)]\n\n        if not remote_digests:\n            findings.append((key, 'no-independent-view', local_digest))\n            continue\n\n        agreed = max(set(remote_digests), key=remote_digests.count)\n        agreement = remote_digests.count(agreed) / len(remote_digests)\n\n        if local_digest is None and agreement > 0.6:\n            findings.append((key, 'local-missing-remote-present', agreed))\n        elif local_digest != agreed and agreement > 0.6:\n            findings.append((key, 'local-diverges-from-quorum', local_digest))\n\n    return findings"
            },
            {
              kind: "list",
              title: "The design rules that make that probe trustworthy",
              items: [
                "The independent clients must run outside your primary network and outside your primary cloud provider. If your probes and your nodes share an autonomous system, a routing-level attack captures both and your comparison silently agrees with itself.",
                "Use at least three independent observers and require a quorum, because a single independent observer that is itself unhealthy generates false positives that will train your team to ignore the alert.",
                "Probe keys should include content you published minutes ago, not only long-settled content. Isolation shows up first as missing recent data, since the attacker view is stale rather than wrong.",
                "Record the no-independent-view outcome distinctly from a divergence. It usually means your probes are broken, and a broken probe that silently returns success is worse than no probe.",
                "Run the probe on a schedule tighter than your recovery objective. A daily probe cannot support an hourly commitment, and the proving cadence of any underlying storage network is not your monitoring cadence."
              ]
            },
            {
              kind: "checklist",
              title: "The instrumentation is real when",
              items: [
                "All three metrics are graphed per node and per fleet, with thresholds derived from two weeks of your own observed baseline",
                "Each alert has been fired at least once by a deliberately induced condition, and the runbook it links to has been followed end to end by someone who did not write it",
                "The divergence probe runs from at least three network locations that share no provider with your nodes",
                "Peer-set composition is captured and retained at restart time specifically, so that post-incident you can reconstruct what the node bootstrapped into",
                "Restart procedure enforces stagger and per-node bootstrap variation, and the procedure is in code rather than in a document",
                "A quarterly exercise re-runs an induced isolation on one node in production hours, with the on-call engineer not told in advance"
              ]
            },
            {
              kind: "callout",
              title: "Retain the bootstrap snapshot above everything else",
              body: "If you keep one thing from this lab, keep the peer-set snapshot taken in the first sixty seconds after every restart. It is small, it is cheap, and it is the only artifact that lets you answer the question every peer-layer post-incident asks: what did this node connect to when it decided who its neighbours were. Without it you will be reconstructing from inference. With it, the answer takes one query."
            }
          ],
          praxis: "Deploy the three metrics and the divergence probe against a real node or a testnet fleet, baseline for two weeks, induce each alert condition deliberately, and write the runbook that the alert links to.",
          glossary: ["divergence-probe", "quorum-agreement", "baseline-threshold", "bootstrap-snapshot"],
          awards: ["comparative-monitor", "induced-the-alert"]
        },
        {
          id: "ch-decinfra-p5-s5-field-doctrine",
          kind: "field",
          title: "Field: Write The Hybrid Architecture Doctrine",
          statement: "The seam between a regulated organisation and an unowned substrate is where every control must be re-derived, and the document that names the seam is the most valuable thing you will write in this domain.",
          minutes: 40,
          respect: 220,
          trust: 14,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Everything in this chapter converges here. Your organisation has identity, access control, logging, retention, incident response, vendor management and an audit programme, and all of it assumes an owned or contracted environment. The substrate has none of those assumptions. The seam is the set of points where a request, an artifact or a piece of data crosses between the two, and at every one of those points a control either continues, transforms, or ceases to exist. Most organisations have never enumerated their seam, which is why their decentralized components are simultaneously over-restricted in the places that do not matter and completely uncontrolled in the places that do."
            },
            {
              kind: "table",
              title: "The seam, control by control",
              headers: ["Control", "Inside the organisation", "At the seam", "On the substrate"],
              rows: [
                ["Identity", "Directory, single sign-on, joiner-mover-leaver process", "A signing key becomes the identity; binding a key to a human is now your responsibility and no directory does it for you", "A public key with no attributes, no revocation authority, and no lifecycle"],
                ["Authorisation", "Policy decision point evaluating attributes at request time", "The last enforcement point you own; after this, possession of a key or of ciphertext is the only authorisation", "None — publication is public, and the only access control is whether someone can decrypt"],
                ["Retention and deletion", "Lifecycle policy with real deletion", "Encrypt-before-write, and deletion redefines as key destruction", "Retention is infinite and deletion does not exist"],
                ["Logging", "Central log pipeline with retention and integrity controls", "Log the intent, the payload digest, the approver and the key reference before the write leaves", "The ledger is a log of what happened but not of why, and it is public"],
                ["Incident response", "Contain, eradicate, recover", "Contain by revoking keys and stopping your own serving; eradication is unavailable", "Only mitigation of reachability at the access layer"],
                ["Vendor management", "Contracts, service levels, assessments, right to audit", "Gateways, bundlers, pinning services and providers are dependencies with no contract", "Anonymous participants with economic incentives instead of obligations"],
                ["Availability", "Service level with a named accountable operator", "Your own node and your own gateway are the only availability you control", "Best effort by unknown parties, subject to eclipse, routing attacks and economics"]
              ]
            },
            {
              kind: "numbered",
              title: "The doctrine document, section by section",
              items: [
                "Scope and substrate inventory. Name every decentralized component in use, its role, and the specific property you are buying from it. Any component whose property you cannot name in one sentence is a candidate for removal.",
                "The classification rule. State, unambiguously, which data classifications may cross the seam and under what transformation. The default must be that nothing crosses unencrypted, and the exceptions must be enumerated rather than described.",
                "Key doctrine. Where signing and encryption keys live, who can use them, how they are rotated, how a subject key is destroyed, and what evidence destruction produces. This is the longest section and it should be.",
                "Availability doctrine. Which retrieval paths you operate, which you depend on without a contract, what happens when each fails, and what you have committed to customers. Name the parties you depend on but do not pay.",
                "Incident doctrine. The response order for this domain — key revocation and destruction first, own-surface serving second, third-party denylisting third, communication fourth — with the explicit statement that eradication is not available and what you say instead.",
                "The residual risks, each with a named accepter and a review trigger tied to an event rather than a date.",
                "The go-live gate. The specific questions that must be answered before any new component writes to the substrate, phrased so that a non-specialist reviewer can ask them and recognise a bad answer."
              ]
            },
            {
              kind: "principle",
              title: "Write the doctrine so that a reviewer who does not understand the technology can still stop a bad design",
              body: "The measure of this document is not its technical depth, it is whether it transfers judgement to people who lack your expertise. A doctrine that only you can apply is a bottleneck that disappears when you leave. Phrase the gate questions as things anyone can ask — what classification is this data, what happens if a customer asks us to delete it, who can we call if it becomes unavailable — and make the acceptable answers concrete enough that a wrong one is visibly wrong. That is the difference between a standard and a personal opinion with formatting."
            },
            {
              kind: "checklist",
              title: "The doctrine is real when",
              items: [
                "It has been applied to a live design review and changed the outcome, with the change recorded",
                "Someone other than the author has used the go-live gate to stop or alter a proposal without consulting the author",
                "Every residual risk carries a named individual accepter and an event-based review trigger",
                "The availability section names at least one party you depend on with whom you have no contractual relationship, and states what happens if they stop",
                "The incident section has been walked through in a tabletop exercise with the on-call team, and the tabletop produced at least one correction to the document",
                "It is short enough that the on-call engineer will actually read it during an incident, which in practice means the incident section fits on one page"
              ]
            },
            {
              kind: "callout",
              title: "The paragraph most doctrines are missing",
              body: "Include an explicit statement of what you will not do. We will not write personal data to permanent storage. We will not depend on a public gateway for a contractual availability commitment. We will not accept a compute agreement that requires disabling network isolation. We will not claim deletion where we can only claim key destruction. Prohibitions are more durable than procedures, they survive reorganisation and staff turnover, and they are the only part of a document that a stranger under pressure at two in the morning will reliably apply correctly."
            }
          ],
          praxis: "Write the doctrine for a real system in your organisation or for a substantial personal project, then take it through an actual design review and record what it changed.",
          evidence: "Attach to your Praxis Profile: the doctrine document, the completed seam table for your specific system, evidence that it was applied in a review and altered an outcome, the named accepters for each residual risk, and a short note on the one prohibition you argued hardest for and why.",
          glossary: ["seam", "policy-enforcement-point", "substrate-inventory", "go-live-gate", "prohibition"],
          awards: ["doctrine-author", "seam-cartographer", "wrote-the-prohibitions"]
        },
        {
          id: "ch-decinfra-p5-s6-availability-censorship",
          kind: "construct",
          title: "The Availability And Censorship Frame",
          statement: "Censorship resistance and takedown capability are the same mechanism viewed from two sides, and any position that wants one without the other is incoherent.",
          minutes: 20,
          respect: 110,
          trust: 6,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "A system that can remove content at the request of a rights holder can remove content at the request of a government. A system that cannot be compelled to remove a political document cannot be compelled to remove abuse material either. There is no engineering trick that separates these, because they are the same capability with different requesters attached. Every serious practitioner in this field eventually arrives at that sentence, and the ones who arrive early make better decisions, because they stop looking for the design that avoids the trade and start choosing where on it to sit."
            },
            {
              kind: "compare",
              left: {
                title: "What resistance actually buys",
                items: [
                  "A record that survives the party who would prefer it did not",
                  "Publication that does not require permission from an intermediary",
                  "Evidence that cannot be quietly revised after the fact",
                  "Availability that survives the failure or capture of any single operator",
                  "Protection for speech in jurisdictions where the alternative is silence"
                ]
              },
              right: {
                title: "What resistance actually costs",
                items: [
                  "Abuse material that no mechanism can remove from the substrate",
                  "Erasure rights that cannot be honoured at the storage layer",
                  "Defamatory or fraudulent content with no correction path",
                  "Leaked personal data that is permanent for the person it belongs to",
                  "Legal exposure distributed to node operators who never chose the content"
                ]
              }
            },
            {
              kind: "prose",
              title: "Where the trade actually gets resolved in practice",
              body: "In deployed systems the trade is not resolved at the storage layer at all — it is resolved at the access layer, and it is resolved unevenly and quietly. Gateways maintain denylists. Indexers decline to index. Applications refuse to render. Pinning services drop customers. The substrate remains uncensorable and the experience becomes moderated, which means the practical answer to censorship resistance is that it holds against a casual requester and does not hold against a determined one who is willing to work through many intermediaries. Understanding this is what separates an engineer from an ideologue. The property you get is not permanent public availability; it is that removal requires effort proportional to the number of intermediaries, and that the underlying record continues to exist for anyone who goes to the substrate directly."
            },
            {
              kind: "principle",
              title: "Choose your position and write it down before you need it",
              body: "The worst time to decide where your organisation sits on this trade is during an incident involving content that horrifies everyone in the room. Decide in advance, in writing: what content will you refuse to serve from infrastructure you operate, what will you refuse to publish, what requests will you honour and from whom, and what will you decline and on what basis. Publish that position. A written position is a decision made calmly that constrains a decision made under pressure, and that is its entire value."
            },
            {
              kind: "callout",
              title: "The closing question of the chapter",
              body: "For every decentralized component you deploy, you should be able to answer one question without hesitation: what did I gain, what did I give up, and who holds the consequence. Permanence gains an unfalsifiable record and gives up deletion. Content addressing gains integrity and gives up availability, freshness and privacy. Open compute gains capacity and gives up the knowable counterparty. Censorship resistance gains protection from the powerful and gives up the ability to remove the intolerable. None of these trades is wrong. Making one without naming it is."
            }
          ],
          glossary: ["censorship-resistance", "moderation-layer", "intermediary-liability", "stated-position"],
          awards: ["named-the-trade", "chapter-decinfra-complete"]
        }
      ]
    }
  ]
};
