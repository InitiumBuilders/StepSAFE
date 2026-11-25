import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-intuition",
  act: "ACT VI — TRUST",
  order: 11,
  title: "THE HONEST GRAPH",
  subtitle: "Intuition, the $TRUST graph, and the defense of a knowledge commons",
  essence: "cyan",
  thesis: "A knowledge graph with money on it is not a database. It is a market, and every market eventually meets an attacker with a spreadsheet.",
  statement: "You cannot delete a lie from a permissionless graph. You can only make it cost more than it is worth.",
  why: "Every security program you will ever run consumes claims made by other people: this contract is safe, this vendor is SOC 2, this maintainer is who they say they are, this CVE is exploited in the wild. Today those claims live in PDFs, spreadsheets, and vendor portals, and their provenance dies the moment they are copied. Intuition is the first serious attempt to make an attestation a first-class economic object — a claim that carries its own funding, its own dissent, and its own audit trail. That is a genuine advance and a genuine new attack surface. A CISO who can read a token-curated graph, price an attack against it, and publish defensible findings into it is operating a decade ahead of the field. A CISO who consumes one uncritically has outsourced judgement to whoever showed up with the most capital.",
  outcomes: [
    "Model any security domain onto atoms, triples, and signals without fragmenting the graph.",
    "Read MultiVault state directly — share price, position count, counter-vault weight — and explain what each number can and cannot prove.",
    "Price an attack on a curation market using the cost-of-corruption versus profit-from-corruption frame.",
    "Detect wash attestation, self-signal collusion, and reputation laundering from position and funding data.",
    "Run a repeatable Validator Session over a region of the graph and publish findings as signed, staked attestations.",
    "Design a challenge window that cannot be turned into a denial-of-service against your own release train.",
    "Manage keys for a high-reputation attestor identity whose signature is worth more than its balance.",
    "Run incident response when a false claim about your organization acquires real economic weight.",
    "Explain to a board why you depend on a system you do not control, and what you did about it."
  ],
  prereq: ["ch-chain"],
  unitUnlock: "u-signal",
  sources: [
    {
      label: "Intuition Docs — Primitives (Atoms, Triples, Signals)",
      note: "The canonical semantics. Read Atoms/fundamentals, Triples/nested-triples, and Signals/fundamentals before you model anything. The best-practices page on atoms is the only official statement on fragmentation."
    },
    {
      label: "Intuition Docs — Smart Contracts: Configurations and Fees",
      note: "The only place with hard numbers: atom and triple creation fees at 0.1 TRUST, minimum deposit 0.01 TRUST, entry 50 / exit 75 / protocol 125 basis points against a 10000 denominator, atom deposit fraction 90, minimum shares 1e6 wei, atom data max length 1000. Every attack cost model starts here."
    },
    {
      label: "Intuition Docs — GraphQL API: Counter Triples and Vault queries",
      note: "Shows the counter_term_id and counter_term fields. If you are building any dispute-aware read path, this is the query shape you copy. Also the source for the v1 to v2 change where all ids became String."
    },
    {
      label: "Intuition Docs — Trust Mechanisms",
      note: "Useful mainly for what it admits: it names whale dominance, cartel formation, echo chambers and popularity-as-accuracy as risks, and offers diverse participation rather than cryptography as the mitigation. Treat that page as a threat model the protocol wrote about itself."
    },
    {
      label: "Intuition contracts v2 audits — Consensys Diligence (September 2025, two reports) and Trail of Bits (March 2024, v0.1)",
      note: "Read the actual PDFs in the intuition-contracts-v2 repository. Audits bound implementation risk, not economic risk. Nothing in them tells you whether a claim is true."
    },
    {
      label: "Vitalik Buterin — The P + epsilon Attack (blog.ethereum.org, 2015)",
      note: "The foundational result for anyone securing a Schelling-point system. A briber who offers P plus epsilon conditional on the wrong outcome winning can flip a majority and, in the clean case, pay nothing. Every curation market inherits this."
    },
    {
      label: "Vitalik Buterin — On Collusion (2019)",
      note: "Why identity and coordination are the two hard problems under every voting or curation mechanism, and why renting tokens defeats time-locks. The line about controlling thousands of fake identities being easier than bribing real people is the whole Sybil chapter in one sentence."
    },
    {
      label: "Arbitrum documentation — AnyTrust protocol and Data Availability Committees",
      note: "Intuition settles to Base as an Orbit L3 using AnyTrust. Read this to understand exactly what you are trusting: a Data Availability Committee, a keyset threshold, signed Data Availability Certificates with expiry, and a fallback to posting full data on the parent chain when signatures cannot be gathered."
    },
    {
      label: "Verizon Data Breach Investigations Report (2026 edition, incidents Nov 2024 to Oct 2025)",
      note: "For calibration when you argue budget. Software vulnerabilities overtook stolen credentials as the leading initial access route at 31 percent; ransomware appears in 48 percent of breaches. Use it to keep graph work proportionate to the rest of your program."
    },
    {
      label: "Chainalysis — 2025 Crypto Crime Mid-Year Update",
      note: "Over 2.17 billion USD stolen from services by 30 June 2025, of which the February 2025 Bybit theft was roughly 69 percent. Personal wallet compromise was 23.35 percent of stolen-fund activity. The relevant lesson for us is that key theft, not contract bugs, is where the money went."
    },
    {
      label: "NIST Cybersecurity Framework 2.0 (February 2024)",
      note: "GOVERN as a first-class function is what lets you write a defensible policy for consuming third-party attestations. Use Organizational Profiles to state your target state for graph-derived inputs rather than inventing your own maturity scale."
    },
    {
      label: "NIST SP 800-61r3 — Incident Response Recommendations and Considerations",
      note: "Aligns incident response to CSF 2.0. Use it to structure the runbook for a false claim gaining economic weight, which is a reputational incident with a market attached."
    },
    {
      label: "OWASP Smart Contract Top 10 (2026)",
      note: "Access control, business logic, and price oracle manipulation lead the list. Relevant here because a curation market that feeds a control decision is a price oracle whether or not anyone calls it one."
    },
    {
      label: "MITRE ATT&CK and MITRE D3FEND",
      note: "Use ATT&CK to describe how an attestor key actually gets stolen (it is phishing and endpoint compromise, not cryptanalysis) and D3FEND to name the countermeasure precisely when you write it into a control document."
    }
  ],
  pages: [
    {
      id: "ch-intuition-p1",
      title: "THE PRIMITIVES",
      credential: "Certified Intuition Protocol Practitioner",
      summary: "Everything in this chapter rests on three objects and one contract. Learn them exactly — the semantics, the money, the identifiers, and where the data physically lives — because every attack later in the chapter is a misuse of something taught here.",
      competencies: [
        "Explain content-addressed identity and why atom ids are deterministic and permissionless.",
        "Decompose a security assertion into subject, predicate, object without inventing vocabulary.",
        "Read a vault: shares, assets, share price, position count, market cap, and the counter side.",
        "Compute the real cost of a write using the published fee parameters.",
        "State the trust assumptions of the L3, the sequencer, the data availability committee, and the indexer.",
        "Create atoms and triples with the SDK against testnet and verify the result independently."
      ],
      seal: "SEAL OF THE FIRST NODE",
      steps: [
        {
          id: "ch-intuition-atoms",
          kind: "construct",
          title: "Atoms — Identity Without a Registrar",
          statement: "An atom is not a record you own; it is a name the network derives from your data, and derivation means nobody can gatekeep it and nobody can take it away.",
          minutes: 18,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The primitive",
              body: "An atom is a unique, persistent identifier for anything you might want to say something about: a person, an organization, a smart contract, a wallet address, a CVE, a concept, a tag. Anyone can create one. There is no registrar, no application form, no approval. Creating an atom automatically deploys an on-chain vault for it, which is the protocol saying something important: every name in this system can hold money."
            },
            {
              kind: "principle",
              body: "The atom id is derived from the atom data by hash. Identical data always yields the identical id. This is content addressing applied to identity, and it changes the entire threat model: you cannot squat a name, only its authorship."
            },
            {
              kind: "prose",
              title: "Why the derivation matters more than it looks",
              body: "In DNS, ENS, or a corporate asset registry, the identifier is allocated. Allocation creates a queue, and a queue creates squatting, disputes, and an authority to appeal to. Intuition removes the allocation step. The identifier for the string Log4Shell is a function of the bytes L-o-g-4-S-h-e-l-l, and it was the same identifier before anyone created it and will be the same after. What a first mover gets is not the name — it is the creator position on that name, which earns a share of deposits forever. That is a real prize, and we will attack it properly in the second Page. But understand the shape now: the collision surface here is semantic, not nominal. Two people cannot fight over who owns Apple. They can absolutely both be right and both be talking about different things."
            },
            {
              kind: "table",
              title: "Atom data types and where each one belongs",
              headers: ["Form", "Example", "Use it for", "Failure mode if misused"],
              rows: [
                ["Raw string", "TypeScript", "Tags, concepts, predicates, vocabulary", "Ambiguity. Paris the city and Paris the person collapse into one node."],
                ["Ethereum account", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "Wallets, EOAs, agent identities", "Chain ambiguity. The same 20 bytes exist on every EVM chain."],
                ["Smart contract", "A deployed contract address", "Protocol and contract subjects", "Proxy confusion. You attest to the proxy and mean the implementation, or the reverse."],
                ["IPFS URI", "ipfs://bafkrei...", "Rich metadata, schema.org Thing, Person, Organization", "Availability. The id is permanent; the pin is not."],
                ["Thing or Person JSON-LD", "name, description, image, url", "Human-facing entities in a product surface", "Fragmentation. Two teams pin nearly identical JSON and mint two canonical-looking atoms."]
              ]
            },
            {
              kind: "callout",
              title: "The constraint that will bite you",
              body: "Atom data is capped at 1000 bytes on-chain. That is why anything rich goes to IPFS and the atom carries only the URI. Which means: the permanent, censorship-resistant part of your identity claim is a pointer, and the thing it points at is hosted by someone. Write that down. It reappears as a real finding in the Validator Session."
            },
            {
              kind: "list",
              title: "The four questions before you create any atom",
              items: [
                "Does a canonical atom for this already exist? Search first, always. calculateAtomId lets you check offline with zero gas before you spend anything.",
                "Is the thing I am naming unambiguous to a stranger in five years, with no context from my team?",
                "If this atom becomes the subject of a claim that hurts someone, is the referent precise enough that the claim is falsifiable?",
                "Am I creating a noun, or am I smuggling a whole sentence into one node? If the second, it wants to be a triple."
              ]
            }
          ],
          glossary: ["atom", "term-id", "content-addressing", "canonical-identifier", "fragmentation"],
          awards: ["first-node"]
        },
        {
          id: "ch-intuition-triples",
          kind: "construct",
          title: "Triples — A Sentence That Owns Two Bank Accounts",
          statement: "A triple is a claim that can be funded and a claim that can be funded against; disagreement is a first-class object here, and that is the single most important design decision in the protocol.",
          minutes: 20,
          respect: 80,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Subject, predicate, object — each of them an atom",
              body: "A triple links three existing atoms into a structured claim. The subject is what you are talking about. The predicate is the relationship. The object is what you are relating it to. All three slots are atom ids, which means predicates are themselves nameable, curatable, and stakeable objects. That is unusual and consequential: the vocabulary of your security domain is not schema you control, it is inventory the community holds positions in."
            },
            {
              kind: "principle",
              body: "Every triple has two vaults. The positive vault means I believe this. The counter vault means I dispute this. Web2 gave you likes and upvotes, which can only express agreement. A system that can only express agreement cannot represent a contested fact."
            },
            {
              kind: "compare",
              title: "Two ways to encode the same security fact",
              left: {
                title: "Smuggled into an atom",
                items: [
                  "One atom whose data is the string ContractXIsSafeAsOfJune",
                  "One vault, one direction of belief only",
                  "Nobody can disagree except by minting a rival atom, which fragments",
                  "The claim cannot be decomposed, filtered, or aggregated by subject",
                  "Six months later the string is stale and there is no mechanism that notices"
                ]
              },
              right: {
                title: "Modelled as a triple",
                items: [
                  "Atoms: the contract address, the predicate is_safe, the object true",
                  "Two vaults: FOR and AGAINST, both liquid, both queryable",
                  "Disagreement is a deposit, not a fork",
                  "You can query every claim about that contract, or every is_safe claim in the graph",
                  "Staleness shows up as a drifting FOR-to-AGAINST ratio and a dead position count"
                ]
              }
            },
            {
              kind: "prose",
              title: "Nested triples, and why a security team should care",
              body: "A triple has its own id, and that id can occupy a slot inside another triple. So you can make claims about claims. This is how you express provenance and context without a bespoke schema: the claim that a contract is safe is one object, and the claim that a named auditor asserted it on a named date is a second triple pointing at the first. In practice this is how you avoid the worst failure of every attestation system built before this one, which is that the assertion and the basis for the assertion travel separately and the basis gets lost first."
            },
            {
              kind: "numbered",
              title: "Modelling drill — turn a real advisory into triples",
              items: [
                "Name the subject precisely. Not the vendor. The artifact. A package at a version, or a contract at an address on a named chain.",
                "Choose a predicate that already exists in the graph if one is close enough. Every bespoke predicate you mint is a permanent tax on everyone who later wants to aggregate.",
                "Make the object a bounded value, not prose. true, false, a severity band, a named CWE. Prose objects cannot be aggregated and cannot be contradicted cleanly.",
                "Add a second triple whose subject is the first triple, whose predicate is something like asserted_by, and whose object is your attestor identity atom.",
                "Ask the falsification question out loud: what evidence would make the counter vault the correct side? If you cannot answer, you have written an opinion, not a claim."
              ]
            },
            {
              kind: "callout",
              title: "Predicates are shared infrastructure",
              body: "The economics push hard toward reuse: a claim using a widely-held predicate joins a liquid market and a widely-queried index. A claim using your private predicate is invisible. Treat predicate selection the way you treat a log schema decision — one careless choice costs the whole org years of joins."
            }
          ],
          glossary: ["triple", "counter-triple", "predicate", "nested-triple", "falsifiability"],
          awards: ["first-claim"]
        },
        {
          id: "ch-intuition-signals",
          kind: "lesson",
          title: "Signals — Conviction With a Price Attached",
          statement: "A signal is not a vote; it is a position, and the difference is that a position can lose money, be sold, be borrowed, and be rented to someone whose interests are not yours.",
          minutes: 24,
          respect: 95,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "What actually happens",
              body: "A signal is a deposit into, or a redemption from, a vault. Depositing buys shares priced by a bonding curve; redeeming burns shares back into assets. On-chain it is an event. The indexer enriches that event into a queryable signal record with the account and the entity attached, which is how you get an activity feed, a leaderboard, and — for our purposes — an audit trail of who backed what and when."
            },
            {
              kind: "table",
              title: "The three kinds of signal the protocol distinguishes, and what each is worth to a defender",
              headers: ["Kind", "What it is", "Forgery cost", "How much weight it deserves"],
              rows: [
                ["Explicit", "A deliberate stake into a FOR or AGAINST vault", "The stake itself plus fees, and it is recoverable on exit", "Real but bounded. It proves willingness to lock capital, not correctness."],
                ["Implicit", "Query frequency, inclusion in applications, usage", "Near zero if the attacker controls a client or a bot fleet", "Low on its own. Useful only when correlated with independent explicit signal."],
                ["Transitive", "Trust inherited through a follow or endorsement graph", "Cost of acquiring one trusted edge, then unbounded fan-out", "Dangerous. This is the vector that turns one compromised high-reputation key into a graph-wide event."]
              ]
            },
            {
              kind: "principle",
              body: "Skin in the game is a real signal and a weak one. It proves the attestor was willing to risk capital. It does not prove they were right, and it does not prove the capital was theirs."
            },
            {
              kind: "prose",
              title: "The rented-conviction problem",
              body: "This is the point most people miss for years. If stake can be borrowed, then conviction can be rented, and a time-lock does not fix it. The classic write-up is in Buterin's On Collusion: a participant borrows tokens, votes, and returns them, taking the influence without the price exposure. Any scoring function you build over this graph must assume that some fraction of the capital behind any claim is transient and directional. The defensive move is not to reject stake as a signal — it is to weight stake by its dwell time and by the independence of the wallets holding it, which we build in the Validator Session."
            },
            {
              kind: "metric",
              title: "The number that tells you the most, fastest",
              body: "position_count against market_cap. A vault with a large market cap and a tiny position count is one or two actors, and the market cap is a statement about their balance sheet, not about the world. A vault with a modest market cap spread across many independent, long-lived positions is far stronger evidence. Ratio first, absolute value second — always."
            },
            {
              kind: "checklist",
              title: "Before you let any signal influence a control decision",
              items: [
                "I have looked at position_count, not only market_cap or total_assets.",
                "I have checked whether the FOR and AGAINST vaults have overlapping depositors.",
                "I know the age of the accounts holding the largest positions, not just their size.",
                "I know how recently the largest holders last changed their position.",
                "I have written down what happens to my decision if the top position exits tomorrow."
              ]
            }
          ],
          glossary: ["signal", "position", "transitive-trust", "dwell-time", "rented-conviction"],
          awards: ["signal-reader"]
        },
        {
          id: "ch-intuition-multivault",
          kind: "lab",
          title: "Reading the MultiVault — Fees, Curves, and What a Share Actually Costs",
          statement: "If you cannot compute what an attack costs, you are not doing security on this system; you are doing commentary.",
          minutes: 34,
          respect: 150,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The contract that holds the money",
              body: "MultiVault, historically called EthMultiVault, is the economic engine. It creates atoms and triples, deploys vaults, takes deposits, issues shares, processes redemptions, and applies fees. Vaults are keyed by the composite of term id and curve id. Curve id 1 is the default. The write paths are guarded by nonReentrant and whenNotPaused, which tells you the implementation risk was taken seriously and also tells you there is a pause authority, which is itself a governance fact you must record in your threat model."
            },
            {
              kind: "table",
              title: "Published parameters you build every cost model on",
              headers: ["Parameter", "Value", "Meaning for an attacker or defender"],
              rows: [
                ["Atom creation fee", "0.1 TRUST (1e17)", "The unit cost of minting a name. Multiply by the number of homoglyph variants to price a squatting campaign."],
                ["Triple creation fee", "0.1 TRUST (1e17)", "The unit cost of minting a claim. Spam floors are set here."],
                ["Minimum deposit", "0.01 TRUST (1e16)", "The floor on a single signal. Divide an attacker budget by this to get the maximum number of distinct-looking positions."],
                ["Entry fee", "50 / 10000 = 0.5%", "Paid on the way in."],
                ["Exit fee", "75 / 10000 = 0.75%", "Paid on the way out. Entry plus exit is the round-trip friction on a wash cycle."],
                ["Protocol fee", "125 / 10000 = 1.25%", "Paid to the protocol on deposit."],
                ["Atom deposit fraction", "90 / 10000 = 0.9%", "Portion of a triple deposit routed down into its constituent atoms."],
                ["Minimum shares", "1e6 wei", "Dust floor that prevents share-accounting attacks at the bottom of a vault."],
                ["Atom data max length", "1000 bytes", "Forces rich metadata off-chain. The origin of the availability dependency."],
                ["OffsetProgressiveCurve offset / slope", "1e17 / 3e19, fixed", "Explicitly not governance-adjustable. One fewer parameter for a governance attack to reach."]
              ]
            },
            {
              kind: "prose",
              title: "Share math you should be able to do on a whiteboard",
              body: "On the default curve the first deposit into an empty vault is one-to-one: assets in equal shares out. Every subsequent deposit mints shares equal to assets multiplied by totalShares divided by totalAssets. The consequence is the whole economics of the system in one line: as assets accumulate, each unit of capital buys fewer shares, so early conviction is cheap and late conviction is expensive. An attacker arriving late to flip an established claim pays a premium, and a defender who seeded a canonical claim early holds a position that is expensive to dislodge. Early presence in the graph is a security control. Say that to your budget holder in exactly those words."
            },
            {
              kind: "code",
              title: "Read live vault state against testnet before you trust any dashboard",
              lang: "typescript",
              body: "import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';\nimport { privateKeyToAccount } from 'viem/accounts';\nimport {\n  intuitionTestnet,\n  getMultiVaultAddressFromChainId,\n  multiVaultGetVault,\n  multiVaultCurrentSharePrice,\n  multiVaultPreviewDeposit,\n  multiVaultGetShares,\n  type WriteConfig,\n} from '@0xintuition/sdk';\n\nconst account = privateKeyToAccount(process.env.ATTESTOR_KEY as Hex);\n\nconst publicClient = createPublicClient({\n  chain: intuitionTestnet,\n  transport: http(),\n  batch: { multicall: true },\n});\n\nconst walletClient = createWalletClient({\n  chain: intuitionTestnet,\n  transport: http(),\n  account,\n});\n\nconst address = getMultiVaultAddressFromChainId(intuitionTestnet.id);\nconst config: WriteConfig = { address, publicClient, walletClient };\n\nconst CURVE = 1n;\n\nexport async function inspect(termId: Hex) {\n  const vault = await multiVaultGetVault(config, { args: [termId] });\n  const price = await multiVaultCurrentSharePrice(config, { args: [termId, CURVE] });\n\n  // What does one more unit of capital actually buy right now\n  const probe = parseEther('1');\n  const sharesForOne = await multiVaultPreviewDeposit(config, {\n    args: [termId, CURVE, probe],\n  });\n\n  return {\n    termId,\n    sharePrice: price,\n    marginalSharesPerTrust: sharesForOne,\n    vault,\n  };\n}\n\nexport async function myExposure(termId: Hex) {\n  return multiVaultGetShares(config, { args: [account.address, termId] });\n}\n"
            },
            {
              kind: "callout",
              title: "Slippage guards are a security control, not a trading nicety",
              body: "deposit takes a minShares argument and redeem takes a minAssets argument. If you leave them at zero because the example did, you have written an unbounded-loss transaction into an environment where anyone can see your pending intent and move the curve underneath you. Set them from a preview call plus your tolerance, every time, including in scripts you think nobody will run twice."
            },
            {
              kind: "checklist",
              title: "Lab completion",
              items: [
                "I funded a testnet wallet from the faucet on chain 13579 and confirmed the balance is tTRUST.",
                "I read a vault directly from the contract and separately from the GraphQL indexer, and the numbers agree.",
                "I computed, on paper, the round-trip fee cost of depositing and immediately redeeming 100 TRUST.",
                "I explained to one other person why the marginal share price rises and what that does to a late attacker.",
                "I set non-zero minShares on every write I made."
              ]
            }
          ],
          glossary: ["multivault", "bonding-curve", "share-price", "slippage-guard", "curve-id", "bonding-curve-vault", "trust-token"],
          awards: ["vault-reader"]
        },
        {
          id: "ch-intuition-substrate",
          kind: "lesson",
          title: "Where The Truth Physically Lives",
          statement: "The chain is the source of truth, the indexer is what you actually query, and the gap between those two sentences is where your incident will happen.",
          minutes: 26,
          respect: 110,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Three layers, three different things to trust",
              body: "Intuition Network is an EVM Layer 3 built on the Arbitrum Orbit stack with AnyTrust data availability, settling to Base. Mainnet is chain id 1155 with TRUST as the native currency; testnet is 13579 with tTRUST. On top of that sits the protocol: MultiVault and friends, holding the authoritative state of every atom, triple, vault, and position. On top of that sits an off-chain Rust indexer that consumes events, resolves IPFS and ENS references, and serves a Postgres-backed GraphQL API. Reads need no wallet because reads do not touch the chain at all."
            },
            {
              kind: "timeline",
              title: "The life of one attestation, and what can go wrong at each hop",
              items: [
                "You sign a deposit in a wallet — key compromise lives here, and it is the most likely failure by a wide margin.",
                "The transaction reaches the sequencer — ordering is not yours to control; your intent is visible before it is final.",
                "The batch is committed with AnyTrust data availability — a committee holds the data and signs a certificate with an expiry; the fallback when signatures cannot be gathered is posting full data to the parent chain.",
                "The state settles to Base — this is where the security budget actually comes from.",
                "The indexer decodes the event and enriches it — this is off-chain software with its own bugs, its own lag, and its own operator.",
                "IPFS content behind any URI atom is fetched — if the pin is gone, the label your users see is gone, while the id remains valid forever.",
                "Your application reads GraphQL and makes a decision — and by default trusts every hop above without verifying any of them."
              ]
            },
            {
              kind: "principle",
              body: "Anything you read from an indexer is a claim about the chain. If the decision it drives is important enough to matter, verify it against the contract before you act on it."
            },
            {
              kind: "prose",
              title: "The data availability assumption, stated honestly",
              body: "AnyTrust replaces the rollup assumption that all data is posted on the parent chain with a committee assumption: a set of members hold the data, sign hash-and-expiry pairs with BLS keys, and the chain accepts a certificate when the keyset threshold is met. The honest-minority framing is that at least two members are honest, so that any set of members promising availability contains at least one honest one. If enough signatures cannot be gathered quickly, the sequencer falls back to posting the data directly. This is a reasonable and well-understood design. It is also a different assumption from an Ethereum-equivalent rollup, and if you write a control document that says the data is on-chain, you have written something false. Write the committee assumption down by name."
            },
            {
              kind: "table",
              title: "Trust assumptions to record in your risk register",
              headers: ["Component", "What you are trusting", "Realistic failure", "Your compensating control"],
              rows: [
                ["Sequencer", "Ordering and censorship resistance", "Downtime, or your transaction delayed while an observer acts first", "Do not make time-critical writes; use deterministic id precomputation to detect races"],
                ["Data availability committee", "That the batch data remains retrievable", "Withholding or expiry mishandling", "Independently archive the events you depend on; do not treat the indexer as your archive"],
                ["Indexer and GraphQL", "Correct decoding, no silent lag, honest operator", "Stale reads during reorg handling; a bug in enrichment", "Dual-read critical values from the contract; alert on indexer lag exceeding your tolerance"],
                ["IPFS pinning", "That metadata behind an atom URI resolves", "Unpinned content, label goes blank while the id persists", "Pin your own copies of every atom you depend on; treat the URI as a hash to verify against"],
                ["Governance", "Fee and parameter changes, pause authority", "A parameter you modelled against changes underneath you", "Snapshot configuration values into your model and alert on drift"]
              ]
            }
          ],
          glossary: ["indexer-trust", "data-availability-committee", "sequencer", "orbit-l3", "reorg"],
          awards: ["substrate-mapper"]
        },
        {
          id: "ch-intuition-firstgraph",
          kind: "lab",
          title: "Build Your First Honest Subgraph",
          statement: "Write the smallest useful region of the graph correctly, and you will have internalized more than any amount of reading about it.",
          minutes: 38,
          respect: 160,
          trust: 8,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The build",
              body: "You will publish a small security-relevant subgraph on testnet: three atoms, one claim, one provenance claim about that claim, and one deliberate counter-position so that you experience disagreement as a first-class act rather than an abstraction. Everything here is reversible and costs test tokens. Do it before you read another word of theory."
            },
            {
              kind: "code",
              title: "Create atoms and a triple, then a nested provenance triple",
              lang: "typescript",
              body: "import { parseEther, type Hex } from 'viem';\nimport {\n  createAtomFromString,\n  createAtomFromSmartContract,\n  createTripleStatement,\n  calculateAtomId,\n  calculateTripleId,\n  calculateCounterTripleId,\n  getAtomDetails,\n  deposit,\n} from '@0xintuition/sdk';\n\n// 1. Check before you mint. Deterministic ids let you do this offline, free.\nconst predicateId = calculateAtomId('has_verified_audit');\nconst existing = await getAtomDetails(predicateId);\n\nconst predicate = existing\n  ? { state: { termId: predicateId } }\n  : await createAtomFromString(config, 'has_verified_audit', parseEther('0.05'));\n\n// 2. Subject is a contract, not a vendor name. Precision is the control.\nconst subject = await createAtomFromSmartContract(\n  config,\n  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',\n  parseEther('0.05'),\n);\n\nconst object = await createAtomFromString(config, 'true', parseEther('0.05'));\n\n// 3. The claim itself.\nconst claim = await createTripleStatement(config, {\n  args: [\n    [subject.state.termId],\n    [predicate.state.termId],\n    [object.state.termId],\n    [parseEther('0.1')],\n  ],\n  value: parseEther('0.1'),\n});\n\nconst claimId = claim.state[0].termId as Hex;\n\n// 4. Provenance: a claim ABOUT the claim. This is the part teams skip\n//    and then cannot reconstruct six months later.\nconst assertedBy = await createAtomFromString(config, 'asserted_by', parseEther('0.05'));\nconst me = await createAtomFromString(config, 'stepsafe-validator-001', parseEther('0.05'));\n\nawait createTripleStatement(config, {\n  args: [[claimId], [assertedBy.state.termId], [me.state.termId], [parseEther('0.1')]],\n  value: parseEther('0.1'),\n});\n\n// 5. Now take the other side, deliberately, so you feel the mechanism.\nconst against = calculateCounterTripleId(claimId);\nawait deposit(config, [account.address, against, 1n, parseEther('0.05'), minSharesFromPreview]);\n"
            },
            {
              kind: "callout",
              title: "Two failure modes you will hit in the next ten minutes",
              body: "First: creating a triple reverts if any of its three atoms do not exist yet. Order matters. Second: freshly created entities take a few seconds to appear in GraphQL, because the indexer is downstream of the chain. If you write and immediately read and see nothing, you have not found a bug; you have found the architecture."
            },
            {
              kind: "numbered",
              title: "Verification, which is the actual point of the lab",
              items: [
                "Confirm the atom id you computed offline with calculateAtomId equals the id in the transaction receipt. If it does not, you misunderstood the data encoding, and that misunderstanding would have fragmented a production graph.",
                "Read the triple back through getTripleDetails and confirm both term and counter_term are present.",
                "Read the same vault twice: once from the contract, once from GraphQL. Note the lag. Write down the number of seconds.",
                "Open the Portal explorer for testnet and find your claim visually. Confirm the label rendered matches what you intended, including for the IPFS-backed atoms if you made any.",
                "Redeem your counter position and observe the exit fee. You now know, experimentally and not theoretically, what a round trip costs."
              ]
            },
            {
              kind: "checklist",
              title: "Lab completion",
              items: [
                "Three atoms, one claim triple, one provenance triple, one counter position, all on chain 13579.",
                "Offline id computation verified against on-chain result.",
                "Indexer lag measured and recorded.",
                "Round-trip fee cost measured empirically and compared to the published parameters.",
                "I can explain, without notes, why the provenance triple is the one that makes this auditable."
              ]
            }
          ],
          praxis: "Publish the five-object subgraph on Intuition testnet and record every id.",
          evidence: "A note on your Praxis Profile listing the six term ids, the measured indexer lag in seconds, and the measured round-trip fee, with a one-paragraph explanation of why your subject atom is a contract address rather than a product name.",
          glossary: ["subgraph", "provenance-triple", "indexer-lag", "counter-vault"],
          awards: ["first-subgraph", "vault-reader"]
        }
      ]
    }
    ,
    {
      id: "ch-intuition-p2",
      title: "ATTACK THE GRAPH",
      credential: "Certified Knowledge-Graph Adversary",
      summary: "Learn the attacks properly, from the attacker's side of the table, with real cost arithmetic. A defender who has never priced an attack on a curation market will build controls against the attacks that are easy to imagine rather than the ones that are cheap to run.",
      competencies: [
        "Enumerate Sybil strategies against a permissionless attestation system and price each one.",
        "Detect wash attestation and self-signal collusion from position, timing, and funding data.",
        "Explain the P plus epsilon attack and identify which parts of a curation market inherit it.",
        "Recognise atom squatting, homoglyph collision, and referent ambiguity as distinct attacks with distinct fixes.",
        "Anticipate front-running of deterministic identifier creation and choose the response that does not fragment the graph.",
        "Audit a predicate for hidden asymmetry, unfalsifiability, and semantic drift."
      ],
      seal: "SEAL OF THE RED HAND",
      steps: [
        {
          id: "ch-intuition-sybil",
          kind: "lesson",
          title: "Sybil Resistance When Identity Costs Nothing",
          statement: "In a system where anyone can mint an identity for a tenth of a token, the question is never how do we stop fake identities; it is what does a fake identity fail to buy.",
          minutes: 30,
          respect: 135,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The shape of the problem",
              body: "Intuition is permissionless by design. Anyone can create an atom for a wallet address and call it a person. Anyone can generate ten thousand wallets. The protocol's stated defence, in its own trust-mechanisms documentation, is diverse participation and counter-signal rather than cryptographic proof of personhood. That is an honest position and it is also an explicit handover: the protocol makes claims and money legible, and it is the consuming application's job to decide whose claims count. If you build on this and do not implement Sybil resistance yourself, you have not inherited it from anywhere."
            },
            {
              kind: "quote",
              body: "Attacking these mechanisms by simply controlling thousands of fake identities like a puppetmaster is even easier than having to go through the trouble of bribing people.",
              source: "Vitalik Buterin, On Collusion, 2019"
            },
            {
              kind: "prose",
              title: "The one real cost the attacker cannot avoid",
              body: "Capital is not free to split. If a scoring function counts distinct accounts, the attacker splits one balance into a thousand minimum-deposit positions and wins cheaply — the minimum deposit is 0.01 TRUST, so a thousand positions is ten TRUST plus fees plus gas, which is nothing. If a scoring function counts capital, the attacker needs the capital, but they keep it: deposits are recoverable minus the round trip. If a scoring function counts capital held over time, the attacker pays opportunity cost, which is the only cost in this system that cannot be recovered by exiting. Dwell time is the scarce resource. Build on it."
            },
            {
              kind: "table",
              title: "Sybil strategies, priced",
              headers: ["Strategy", "Marginal cost per identity", "What it defeats", "What defeats it"],
              rows: [
                ["Wallet spray with minimum deposits", "0.01 TRUST plus fees plus sub-cent gas", "Any distinct-account count, any naive one-address-one-vote score", "Weighting by capital, and by account age at time of signal"],
                ["Aged wallets bought or farmed", "Cost of acquiring a pre-existing history", "Account-age heuristics applied naively", "Funding-ancestry clustering; aged wallets funded from one source are one actor"],
                ["Borrowed stake", "Interest for the duration of the snapshot", "Capital weighting and time-locks alike", "Dwell-time weighting measured across your whole observation window, not at a point"],
                ["Compromised high-reputation key", "Cost of one phishing campaign", "Almost every reputation heuristic simultaneously", "Key hygiene at the attestor, plus caps on how fast any single identity's weight can move your output"],
                ["Coordinated real people", "Payment per participant", "Everything that measures independence by address", "Correlation analysis on timing and funding, plus human review at the top of the weight distribution"]
              ]
            },
            {
              kind: "principle",
              body: "Do not try to prove that an account is a person. Prove that a set of accounts is not one actor. The second question is answerable from on-chain data; the first is not answerable at all."
            },
            {
              kind: "list",
              title: "Independence tests that survive contact with a competent adversary",
              items: [
                "Funding ancestry: walk backward from each depositor to a common funder. Shared ancestry within a small number of hops is the strongest single indicator you will get for free.",
                "Timing correlation: positions opened within the same block or the same few minutes, repeatedly, across unrelated claims. Humans are not that synchronised; scripts are.",
                "Portfolio overlap: two accounts holding near-identical position sets across dozens of unrelated terms are one actor or one bot vendor.",
                "Behavioural asymmetry: real attestors disagree with people they usually agree with, occasionally. A cluster with zero internal disagreement across hundreds of claims is not a community.",
                "Exit correlation: the cheapest tell of all. Sybils leave together, because one operator decides."
              ]
            },
            {
              kind: "callout",
              title: "The honest limit",
              body: "None of this proves personhood, and none of it is a court-admissible finding. It produces a confidence, and a confidence belongs in a report with its methodology attached. If you publish a cluster analysis as an accusation rather than as a measurement with stated assumptions, you will eventually be spectacularly and publicly wrong, and you will deserve it."
            }
          ],
          glossary: ["sybil-resistance", "funding-ancestry", "dwell-time", "independence-test", "proof-of-personhood"],
          awards: ["cluster-analyst"]
        },
        {
          id: "ch-intuition-wash",
          kind: "drill",
          title: "Wash Attestation and Self-Signal Collusion",
          statement: "A claim can be simultaneously well-funded and entirely self-referential, and the difference is invisible in every headline metric your dashboard shows by default.",
          minutes: 28,
          respect: 165,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The mechanism",
              body: "Wash attestation is the attestation analogue of wash trading. The attacker deposits into their own claim from wallets they control, producing high market cap, rising share price, a healthy-looking position count, and a chart that goes up. The round trip is not free — entry at 0.5 percent, exit at 0.75 percent, plus a 1.25 percent protocol fee on deposit — but the attacker recovers the principal, and against a target worth compromising, low single-digit percentage friction on recoverable capital is a rounding error, not a deterrent."
            },
            {
              kind: "prose",
              title: "Self-signal collusion is the subtler cousin",
              body: "Here the attacker does not stake on their own claim at all. They stake on yours, and you stake on theirs, and neither transaction looks self-referential to any check that only looks for an address depositing on a term it created. Reciprocity across a ring of five or six participants defeats every naive self-dealing filter and produces something that looks exactly like an organic community of subject-matter experts endorsing each other. Because, structurally, that is also what an organic community of subject-matter experts looks like. The distinguishing evidence is never the reciprocity itself. It is the absence of dissent inside the ring and the correlation of timing at the edges."
            },
            {
              kind: "metric",
              title: "Three ratios that expose it",
              body: "One: capital concentration — the share of a vault's market cap held by the top three positions. Two: creator overlap — the fraction of a vault's depositors who also created the term or its subject atom. Three: dissent ratio — counter-vault market cap divided by FOR-vault market cap, tracked over time rather than as a snapshot. Organic claims accumulate some dissent and some concentration decay. Washed claims stay perfectly clean and perfectly concentrated."
            },
            {
              kind: "callout",
              title: "The trap in the drill you are about to run",
              body: "The tempting wrong answer is always the one that is fast, visible, and demonstrates decisiveness to an audience. Notice, when you pick, whether you are choosing the action that reduces uncertainty or the action that reduces your discomfort."
            }
          ],
          drill: {
            id: "ch-intuition-drill-wash",
            scene: "You own graph integrity for a security data product that ranks smart contracts. Your ranking consumes triples of the form contract-is_safe-true and promotes anything whose FOR vault clears a market cap threshold with at least twenty positions. Forty minutes ago a contract from a vendor nobody on your team has heard of crossed the threshold. It will enter tonight's published feed, which three customers use to gate deployment approvals.",
            clock: "You have until the 22:00 snapshot. It is 21:18.",
            pressure: "Your head of product is in the channel asking whether this is a problem or whether the model is working. A customer security lead is already asking why the vendor appeared.",
            prompt: "What do you do first?",
            options: [
              {
                id: "opt-counterstake",
                label: "Counter-stake hard from the treasury to push the claim back under threshold before the snapshot.",
                detail: "Fast, decisive, uses the mechanism the protocol gives you, and demonstrably protects the customers tonight.",
                score: -1,
                outcome: "The claim drops below threshold and the feed ships clean. You have also just spent treasury capital on a position you have no evidence to justify, and you have entered a capital contest against an unknown balance sheet with no exit plan.",
                ripple: "Two weeks later the same actor re-stakes at four times the size and you either escalate again or visibly retreat. Your ranking is now a function of your treasury, which is a fact your customers will eventually discover and correctly describe as undisclosed market participation by the referee."
              },
              {
                id: "opt-analyse",
                label: "Pull every position on the FOR vault, resolve funding ancestry and account creation times, compare against the claim timestamp, and check for depositor overlap with the counter vault.",
                detail: "Answer the only question that matters — is this twenty actors or one — before touching anything.",
                score: 3,
                outcome: "Within twenty minutes you find that nineteen of twenty-one positions trace to two funders within three hops, were created inside a four-hour window eight days ago, and opened positions in the same block. You have a measurement, not a hunch, and you have it before the snapshot.",
                ripple: "The finding becomes a reusable detection: funding-ancestry clustering plus block-level timing correlation goes into your pipeline as a standing check, and every future promotion carries an independence score. You did not just handle tonight; you retired a class of incident.",
                isBest: true
              },
              {
                id: "opt-freeze",
                label: "Freeze the feed: drop all is_safe-derived rankings from tonight's publication until the region is reviewed.",
                detail: "Conservative, defensible, and no customer gets a bad answer from you tonight.",
                score: 1,
                outcome: "No bad data ships. You also discard several thousand legitimate, well-supported claims, and three customers get a degraded feed with an explanation you cannot yet give them because you have not done the analysis.",
                ripple: "Blanket freezing becomes your reflex. Over a year, availability of your product becomes a function of any adversary's willingness to poke it, which is precisely the griefing dynamic you will study two Pages from now. You have handed an attacker a cheap denial-of-service against your own release train."
              },
              {
                id: "opt-publish",
                label: "Post in the public community forum naming the vendor and stating that the claim appears to be wash-attested.",
                detail: "Transparency, community defence, and it warns everyone else immediately.",
                score: -3,
                outcome: "You have made a public accusation of fraud against a named party on the basis of a chart shape, with no analysis, forty minutes into an investigation. If you are right, you tipped the attacker and they exit before you can measure anything. If you are wrong, your organisation has a legal problem and you personally have no defence.",
                ripple: "Legal counsel imposes a review gate on all future public findings from your team, which slows your genuine disclosures by weeks and permanently reduces your ability to warn the community. One impulsive post cost you the standing that made your warnings valuable."
              }
            ],
            debrief: "The correct move is the boring one because the situation contains exactly one unknown that matters: is the funding independent. Everything else — the threshold, the vendor, the clock, the head of product asking questions — is noise engineered by the scenario to make you act before you know. Counter-staking feels like using the mechanism correctly, and it is the single most seductive error available to a well-funded defender, because it converts an epistemic problem into a capital contest you might lose and definitely should not be entering as the operator of the ranking. Freezing is not wrong so much as expensive and habit-forming; it trades a specific unknown for a general loss of service and teaches your team that uncertainty means stop. Publishing is the failure that ends careers. Note also what the best option produces beyond tonight: a measurement, a method, and a detection that runs forever. The mark of a senior operator is that the incident response leaves a permanent artefact behind.",
            principle: "When a metric surprises you, the first action is always to decompose the metric, never to move it."
          },
          glossary: ["wash-attestation", "self-signal-collusion", "capital-concentration", "dissent-ratio", "reciprocity-ring"],
          awards: ["wash-hunter", "cluster-analyst"]
        },
        {
          id: "ch-intuition-bribery",
          kind: "lesson",
          title: "P Plus Epsilon — Why Bribing a Curation Market Can Be Free",
          statement: "A briber who pays only when the attack fails does not have to be rich; they have to be credible, and credibility is cheap to manufacture on a public ledger.",
          minutes: 32,
          respect: 175,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The result you must know cold",
              body: "In a Schelling-point system, participants are rewarded for agreeing with the majority. Buterin's 2015 analysis shows what happens when an attacker publicly commits to paying a bonus of P plus epsilon to anyone who votes for the wrong answer, conditional on the wrong answer losing. If the attack succeeds, the attacker pays nothing, because the payout condition never triggers. If it fails, the attacker pays. Now examine the individual's payoff: voting with the attacker dominates regardless of what you believe about the world, because you either collect the ordinary reward for being in the majority or you collect the bribe for being in the minority. Everyone reasons this way, the attack succeeds, and the attacker's bill is zero."
            },
            {
              kind: "table",
              title: "The payoff transformation",
              headers: ["", "You vote honestly", "You vote with the attacker"],
              rows: [
                ["Others vote honestly (baseline)", "P", "0"],
                ["Others vote with attacker (baseline)", "0", "P"],
                ["Others vote honestly (under attack)", "P", "P plus epsilon"],
                ["Others vote with attacker (under attack)", "0", "P"]
              ]
            },
            {
              kind: "principle",
              body: "Read the second column of the attacked matrix. It weakly dominates the first in every row. That is the whole attack. No participant needs to be dishonest, corrupt, or even aware they are being manipulated — only rational."
            },
            {
              kind: "prose",
              title: "How much of this does Intuition actually inherit",
              body: "Less than a pure Schelling oracle, and more than is comfortable. It inherits less because there is no discrete resolution event and no fixed round reward: a triple's vaults are continuous markets with no settlement date, so there is no single moment whose majority an attacker can buy. Bonding-curve positions also mean an attacker who wants to move a claim must actually buy shares at a rising price rather than merely signalling. It inherits more than is comfortable because consuming applications routinely impose their own settlement: your snapshot at 22:00, your quarterly vendor review, your weekly promotion job. The moment you define a resolution point over a market that has none, you have manufactured the Schelling round the protocol carefully avoided, and you own its bribery surface entirely."
            },
            {
              kind: "list",
              title: "Bribery vectors that do not look like bribery",
              items: [
                "Retroactive grants to accounts that took a specific side, announced after the fact but predictably enough to be anticipated. Legally clean, economically identical to a bribe.",
                "Airdrop eligibility criteria that reward staking on particular terms. The briber is the token issuer and the bribe is denominated in a future asset.",
                "Liquidity incentives on a vault, which pay for presence rather than for correctness and therefore reward whoever shows up with capital regardless of belief.",
                "Fee sharing offered to attestors who route through a particular application. The application becomes the coordinator of a bloc it does not have to name.",
                "Employment. The cheapest bribe in every reputation system ever built is a job offer to the person whose signature moves the number."
              ]
            },
            {
              kind: "compare",
              title: "Mitigations that work versus mitigations that feel good",
              left: {
                title: "Structurally sound",
                items: [
                  "Do not create a resolution point. Consume a time-weighted average across a long window instead of a snapshot.",
                  "Make the observation window unpredictable within a published range, so there is no single moment to buy.",
                  "Weight by dwell time so that capital arriving just before your read is nearly worthless to you.",
                  "Require independent corroboration from a source that is not the graph before a claim can change a control decision.",
                  "Publish your scoring function's shape but not its exact parameters and refresh timing."
                ]
              },
              right: {
                title: "Comfortable and insufficient",
                items: [
                  "Raising the market cap threshold. It raises the attacker's capital requirement, not their cost, because deposits are recoverable.",
                  "Requiring more positions. Trivially satisfied at 0.01 TRUST per position.",
                  "Adding a manual review step with no independence requirement. The reviewer is now the single point to bribe, and they are cheaper than the market.",
                  "Publishing a code of conduct. Necessary for the social layer, worth zero against a rational actor.",
                  "Trusting audits. The Diligence and Trail of Bits audits bound implementation risk; no audit has ever bounded a payoff matrix."
                ]
              }
            },
            {
              kind: "callout",
              title: "The mitigation Buterin actually proposed, and why you probably cannot use it",
              body: "The strong defence is large deposits that get slashed in proportion to how contested a vote was, so a bribe must exceed the deposit rather than the round reward. Intuition has no slashing — deposits are recoverable minus fees. So that defence is not available to you at the protocol layer. It is available at your layer: a consuming application can require attestors to post a bond it controls. Before you build that, be honest that you have just recreated a permissioned system with extra steps, and decide whether that is what you actually wanted."
            }
          ],
          glossary: ["p-plus-epsilon", "schelling-point", "cost-of-corruption", "resolution-point", "time-weighted-signal"],
          awards: ["bribe-resistant"]
        },
        {
          id: "ch-intuition-squatting",
          kind: "lesson",
          title: "Atom Squatting, Homoglyphs, and the Ambiguous Referent",
          statement: "You cannot squat a content-addressed name, so a competent attacker will not try; they will squat the meaning instead, and that attack has no protocol-layer fix at all.",
          minutes: 28,
          respect: 140,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Three attacks people confuse for one",
              body: "Atom squatting proper is the race to be the creator of a canonical atom, which earns a creator share of every future deposit into it. Homoglyph collision is minting visually confusable variants — Cyrillic а for Latin a, a zero for a capital O, a trailing space — so that a human reading a rendered label cannot distinguish the canonical atom from the decoy. Referent ambiguity is the deepest one: creating a legitimately-formed atom whose data is genuinely ambiguous, so that stake accumulates on a node whose meaning is contested and can later be argued in whichever direction suits the arguer."
            },
            {
              kind: "table",
              title: "Distinguishing them properly, because the fixes are different",
              headers: ["Attack", "What the attacker gains", "Cost", "Fix, and at which layer"],
              rows: [
                ["Creator squatting", "A perpetual cut of deposits into a canonical name", "0.1 TRUST per atom, plus watching for intent", "None available and none needed. Use the canonical id anyway. Protocol layer cannot help; economics make it a nuisance, not a threat."],
                ["Homoglyph collision", "Users stake on the wrong node believing it is the right one", "0.1 TRUST per variant, so a full campaign is trivially affordable", "Application layer. Normalise and render Unicode confusables explicitly; never trust a rendered label as an identifier."],
                ["Referent ambiguity", "A node whose meaning can be reinterpreted after stake accumulates", "Free, because it is a legitimate atom", "Editorial layer. Precision at creation and a disambiguation convention your organisation actually follows."],
                ["Proxy versus implementation", "Attestations attach to the wrong contract entity", "Free; it is an honest mistake at scale", "Editorial and tooling. Resolve and record both, and state which one the claim is about."],
                ["Cross-chain address reuse", "The same 20 bytes mean different contracts on different chains", "Free", "Editorial. Use CAIP-10 style identifiers so the chain is inside the identity, not beside it."]
              ]
            },
            {
              kind: "principle",
              body: "The rendered label is user interface. The term id is identity. Every place your product lets a human act on a label without showing the id is a place a homoglyph attack lands."
            },
            {
              kind: "prose",
              title: "Why creator squatting is a smaller problem than your instincts say",
              body: "Because the id is derived from the data, the squatter does not get to be the canonical Log4Shell. They get to be the person who happened to submit that transaction first, and the canonical Log4Shell is the same node whether they exist or not. The economically correct response to discovering a squatter on an atom you intended to create is to shrug and use the atom. The economically catastrophic response is to change your data slightly so that your atom is distinct — because you have then permanently fragmented the identifier, split all future liquidity and query traffic, and paid a cost that recurs forever to avoid a fee that is a fraction of a percent. Ego is the vulnerability here, which is why this specific decision is the drill in the next Step."
            },
            {
              kind: "checklist",
              title: "Pre-creation hygiene for any atom your organisation will depend on",
              items: [
                "Compute the id offline first and query for an existing atom before spending anything.",
                "Normalise the data string: NFC normalisation, trimmed whitespace, a documented case convention, no zero-width characters.",
                "Run a confusables check against the atoms you already depend on and against any high-value label in your domain.",
                "For any address, record the chain explicitly and decide proxy versus implementation before you write, not after.",
                "For any IPFS-backed atom, pin the content yourself in addition to whatever the pinning service does, and store the hash in your own records.",
                "Write the intended referent in a sentence a stranger could check, and store it with the id in your internal registry."
              ]
            },
            {
              kind: "callout",
              title: "The thousand-byte detail that matters here",
              body: "Atom data is capped at 1000 bytes, so anything long is a URI. That means the human-readable label your users see for most serious atoms is fetched from off-chain content that someone must keep pinned. An attacker who can influence what that URI resolves to can change what an atom appears to mean without touching the chain at all. Verify content against its hash on read. Every time."
            }
          ],
          glossary: ["atom-squatting", "homoglyph", "referent-ambiguity", "caip-10", "unicode-normalisation"],
          awards: ["canonical-keeper"]
        },
        {
          id: "ch-intuition-frontrun",
          kind: "drill",
          title: "Front-Running the Creation of a Canonical Identifier",
          statement: "Your intent is public before your transaction is final, and on a content-addressed system the only thing an observer can steal is authorship — so the question is how much you are willing to pay to avoid losing something that does not matter.",
          minutes: 24,
          respect: 155,
          trust: 8,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "How the intent leaks",
              body: "It leaks from your pull request. It leaks from the design document you shared with a partner. It leaks from your pending transaction sitting in the sequencer's view. It leaks from the pattern of atoms you have already created, which telegraphs the next one. Because ids are deterministic, an observer who learns your intended data can compute the id and submit the creation first, at a cost of 0.1 TRUST, and thereby capture the creator position on a node you were about to make valuable."
            },
            {
              kind: "principle",
              body: "Content addressing means front-running cannot steal the name. It can only steal the fee stream on the name. Confusing those two costs organisations years of fragmented data."
            },
            {
              kind: "metric",
              title: "The arithmetic that should decide this for you",
              body: "The creator share is a small percentage of deposits into one node. Fragmentation splits every future query, every future aggregation, and every future stake across two nodes forever, and it does so silently, because both nodes look canonical to anyone who does not already know the history. There is no volume at which the first cost exceeds the second."
            }
          ],
          drill: {
            id: "ch-intuition-drill-frontrun",
            scene: "Your team is standing up a public registry of audited smart contracts on Intuition, and the anchor is a predicate atom your organisation designed and socialised for six weeks: has_verified_audit. It is in a public RFC. This morning, twelve minutes before your deployment window, you discover the atom already exists. It was created four days ago by an address with no other history except creating eleven other predicate atoms lifted verbatim from your RFC.",
            clock: "Deployment window opens in 12 minutes. Three partner teams are waiting on the ids.",
            pressure: "Your VP has already been told the registry ships today. The engineer who wrote the RFC is visibly angry in the channel and has proposed a fix.",
            prompt: "Which move do you authorise?",
            options: [
              {
                id: "opt-rename",
                label: "Change the predicate data to has_verified_audit_v2 and ship your own atoms, so the squatter gets nothing.",
                detail: "Ships on time, denies the squatter the creator position, and the engineer's proposal so the team feels vindicated.",
                score: -3,
                outcome: "You ship. You have also permanently created two competing predicates for the same relationship, one of which is the one you spent six weeks socialising and every partner already wrote into their integration docs.",
                ripple: "Eighteen months later your aggregate queries silently miss a third of the claims in your own domain, partners are split across both predicates, and the fix requires a coordinated migration you will never get everyone to do. You paid an unbounded permanent cost to deny an adversary a fraction of a percent of deposits."
              },
              {
                id: "opt-use",
                label: "Use the existing atoms. Ship on the canonical ids, note the creator in your registry documentation, and move on.",
                detail: "Costs you the creator fee stream. Costs you nothing else.",
                score: 3,
                outcome: "You ship on time on the ids your partners already expected. The squatter earns a small ongoing share of deposits into nodes that now carry the entire ecosystem's liquidity — an outcome that is annoying and strategically irrelevant.",
                ripple: "Your registry becomes the canonical one because it is the one everybody can join without a decision. The episode becomes an internal teaching case: in a content-addressed system, the identifier is a commons and authorship is a receipt. Your team stops treating creation races as emergencies, which frees them to worry about things that matter.",
                isBest: true
              },
              {
                id: "opt-buyout",
                label: "Deposit heavily into the squatted atoms so your organisation dominates the share supply and effectively controls the node.",
                detail: "Establishes your position, deters further interference, and the capital is recoverable.",
                score: 0,
                outcome: "You spend real capital, you do not become the creator, and share dominance on a predicate atom confers no control over anything — predicates are used by reference, not by permission. You have bought a position in an asset for reasons that have nothing to do with wanting the position.",
                ripple: "Finance asks what the treasury position on a predicate atom is for, and there is no good answer. Worse, your dominance of the vault becomes a talking point for anyone who wants to argue your registry is captured — you handed a critic a true fact."
              },
              {
                id: "opt-escalate",
                label: "Escalate to the protocol team and the community to have the squatted atoms invalidated or reassigned before you ship.",
                detail: "Establishes a precedent that protects everyone from this class of behaviour, and the community will likely be sympathetic.",
                score: -2,
                outcome: "There is no reassignment mechanism, because there cannot be one — the id is a hash of the data. You burn the deployment window on a request that cannot be granted, and you have publicly demonstrated that your team does not understand the primitive it is building a registry on.",
                ripple: "Partners quietly downgrade their confidence in your technical judgement. The next time you make a genuine protocol-level argument, it is discounted. Credibility is the only currency in this ecosystem that has no vault and cannot be redeposited."
              }
            ],
            debrief: "This drill is about correctly identifying what was actually taken. Nothing was. The predicate has_verified_audit has exactly one id, it had that id before anyone created it, and your partners can use it today. What the squatter acquired is a claim on a fee stream, and the correct valuation of that loss is a shrug. The renaming option is the trap, and it is a trap because it is the option that satisfies the emotional state in the room — the engineer who was copied, the VP who wants the ship date, the team that wants to win. Fragmentation is the one genuinely irreversible harm available in this scenario and it is the option that feels most like fighting back. Notice also the escalation option: it is not just ineffective, it is reputationally expensive, because asking for something the protocol structurally cannot do broadcasts a misunderstanding to exactly the audience whose respect you need. Twelve minutes of clock exists in this scene solely to make you skip the question what did we actually lose.",
            principle: "Before you spend anything to recover from an attack, price the loss. Most of the damage in most incidents is self-inflicted by the response."
          },
          glossary: ["front-running", "creator-position", "fragmentation", "deterministic-id"],
          awards: ["canonical-keeper", "cool-head"]
        },
        {
          id: "ch-intuition-predicates",
          kind: "lesson",
          title: "Malicious Predicate Design",
          statement: "The most durable attack on a knowledge graph is not a false claim; it is a predicate whose grammar makes certain truths unsayable.",
          minutes: 30,
          respect: 170,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Vocabulary is power, and here it is also an asset",
              body: "Predicates are atoms. Anyone can create one, anyone can stake on one, and once a predicate becomes the standard way to express a relationship, everyone who wants to be queryable must use it. Whoever shapes the predicate shapes what can be asserted, what can be contradicted, and what quietly falls outside the schema. This is the oldest power in information systems — the person who designs the form controls the answers — and Intuition gives it an economic engine and permanent settlement."
            },
            {
              kind: "list",
              title: "Six predicate pathologies, with the tell for each",
              items: [
                "Unfalsifiable: is_innovative, is_trustworthy, is_best_in_class. No evidence could support the counter vault, so the counter vault is dead and the claim is a one-way ratchet. Tell: try to write the disproof in one sentence. If you cannot, the predicate is marketing.",
                "Asymmetric: has_no_known_vulnerabilities. The FOR side is an absence claim that can never be verified and the AGAINST side requires producing a specific finding. Attackers accumulate cheap positive weight while honest dissent is expensive. Tell: compare the cost of evidence on each side.",
                "Time-blind: is_safe with no temporal object. True in March, catastrophic in September, and nothing in the structure notices. Tell: ask what happens to this claim in twelve months if nobody touches it.",
                "Scope-creeping: is_compliant, where the object is a bare true. Compliant with what, assessed by whom, under which version. Tell: count how many questions a reader must already know the answer to before the claim means anything.",
                "Bundled: is_secure_and_maintained. Two assertions in one vault, so a stake means either or both and dissent is impossible to interpret. Tell: the word and, or a comma, in the predicate.",
                "Loaded: has_been_accused_of. The predicate makes an unrebuttable claim about the world regardless of which vault you stake in, because the accusation is asserted by the subject line itself. Tell: read the triple aloud with the counter vault winning and see whether the subject is still damaged."
              ]
            },
            {
              kind: "principle",
              body: "A predicate is well designed if a rational, informed adversary who disagrees with you would still be willing to use it. If your predicate only serves people who already agree with you, you have not built vocabulary; you have built a weapon that will be pointed back at you."
            },
            {
              kind: "prose",
              title: "Semantic drift, the slow attack",
              body: "The subtlest version requires no malice at all. A predicate is introduced with a narrow, well-understood meaning, accumulates thousands of claims and substantial liquidity, and then usage gradually broadens — because the narrow meaning was never written down anywhere binding, and each individual broadening was reasonable. Two years later has_verified_audit means anything from a full formal-methods engagement to a weekend review by an anonymous account, and the aggregate market cap on that predicate's claims is a number with no interpretation. Nobody attacked it. It rotted, because meaning has no vault and therefore nobody was paid to maintain it. The defence is unglamorous: publish a definition atom, attach it to the predicate with a nested triple, and treat definition drift as a monitored control."
            },
            {
              kind: "table",
              title: "Rewriting bad predicates",
              headers: ["Weak predicate", "Why it fails", "Stronger construction"],
              rows: [
                ["contract is_safe true", "Unfalsifiable, time-blind, scope-free", "contract has_no_open_findings_from audit_engagement_id, plus a nested triple carrying the assessment date"],
                ["vendor is_compliant true", "Compliant with what, per whom", "vendor holds_attestation soc2_type2_2025, plus a nested asserted_by triple naming the auditor"],
                ["package is_malicious true", "Loaded, damages the subject either way", "package contains_behaviour credential_exfiltration, which the counter vault can genuinely refute with evidence"],
                ["maintainer is_trustworthy true", "Pure vibe, no disproof exists", "maintainer controls_signing_key key_fingerprint, which is checkable and where the counter vault means something"],
                ["cve is_exploited true", "Time-blind and source-free", "cve listed_in cisa_kev, plus a nested triple carrying the observation date"]
              ]
            },
            {
              kind: "callout",
              title: "The governance point hiding in here",
              body: "If your organisation is going to depend on graph-derived inputs, someone must own the vocabulary — which predicates you accept, what each one means, and what evidence standard attaches to each. Under NIST CSF 2.0 this is a GOVERN concern, not a technical one, and it should be written into your Organizational Profile as an explicit target state. Vocabulary ownership is the cheapest control in this entire chapter and the one nobody staffs."
            }
          ],
          glossary: ["predicate-design", "semantic-drift", "unfalsifiable-claim", "definition-atom", "vocabulary-governance"],
          awards: ["predicate-architect"]
        }
      ]
    }
    ,
    {
      id: "ch-intuition-p3",
      title: "THE ECONOMICS OF CORRUPTION",
      credential: "Certified Attestation Economics Analyst",
      summary: "Security on a curation market is arithmetic before it is anything else. This Page teaches you to price an attack, price the defence, and notice when the two numbers say your control is theatre.",
      competencies: [
        "Apply the cost-of-corruption versus profit-from-corruption frame to any staked claim.",
        "Distinguish capital requirement from cost, and explain why recoverable stake is not a deterrent.",
        "Model griefing attacks where the attacker's goal is your cost, not their profit.",
        "Detect reputation laundering across identities, time, and topic domains.",
        "Build a working attack-budget model against live vault state and defend its assumptions."
      ],
      seal: "SEAL OF THE LEDGER",
      steps: [
        {
          id: "ch-intuition-cost-of-corruption",
          kind: "construct",
          title: "Cost of Corruption Versus Profit From Corruption",
          statement: "A claim is only as true as it is expensive to falsify relative to what falsifying it is worth — and on a system with recoverable deposits, the expensive part is smaller than it looks.",
          minutes: 26,
          respect: 130,
          trust: 7,
          mode: "novus",
          blocks: [
            {
              kind: "principle",
              body: "Security of any economically-weighted claim reduces to one inequality: cost of corruption must exceed profit from corruption, with a margin proportional to how badly you would be hurt if it did not."
            },
            {
              kind: "prose",
              title: "Getting the cost side right, which nearly everyone gets wrong",
              body: "The instinct is to say that flipping a claim with one million TRUST behind it costs an attacker something like one million TRUST. It does not. It requires that much capital, briefly, and then most of it comes back. The actual cost is the sum of the entry fee at 0.5 percent, the protocol fee at 1.25 percent, the exit fee at 0.75 percent, the gas, the opportunity cost of the capital for the holding period, the slippage from moving a bonding curve in and back out, and any capital genuinely stranded because the position could not be exited at the price it was entered. Against a claim worth attacking, the recoverable portion is not a cost at all. Confusing capital requirement with cost is the single most common error in this domain and it makes every control built on it optimistic by roughly two orders of magnitude."
            },
            {
              kind: "table",
              title: "Decomposing a hypothetical attack on a claim with substantial FOR-vault weight",
              headers: ["Component", "Recoverable", "Notes"],
              rows: [
                ["Capital deployed into the counter vault", "Yes, minus fees and slippage", "This is a requirement, not a cost. Treat it as a gate on who can attack, not on whether attacking pays."],
                ["Entry fee, 50 basis points", "No", "Paid on deposit."],
                ["Protocol fee, 125 basis points", "No", "Paid on deposit."],
                ["Exit fee, 75 basis points", "No", "Paid on redemption."],
                ["Bonding-curve slippage", "Partly", "Buying up a curve and selling back down does not round-trip at par. Depth determines how bad this is."],
                ["Opportunity cost of the capital", "No", "The only cost that scales with how long you must hold to beat a dwell-time-weighted defence."],
                ["Gas", "No", "Sub-cent on an L3. Effectively zero for this purpose."],
                ["Reputational cost to the attacking identity", "No", "Zero if the attacker uses fresh identities, which is free. This is why identity-based deterrence fails here."]
              ]
            },
            {
              kind: "prose",
              title: "Now the profit side, where security people are too modest",
              body: "Profit from corruption is not what the attacker earns from the market. It is the value of the decision your organisation makes because of the corrupted claim. If a graph-derived is_safe promotion gates a production deployment, the profit from corruption is the value of shipping a backdoored dependency into your estate — which is not measured in TRUST at all. This asymmetry is the whole risk. The market's internal stakes are small; the external decisions riding on it are large; and an attacker only needs the second number. Any time the external decision is worth more than the internal market, the market is structurally under-secured for that purpose, no matter how healthy it looks."
            },
            {
              kind: "metric",
              title: "The security ratio you should compute for every graph-derived input",
              body: "Take the non-recoverable cost to flip the claim past your threshold, including opportunity cost over your observation window. Divide by the value to an attacker of the decision that claim controls. If that ratio is below one, the input is not a control and you must not describe it as one. If it is between one and ten, it is a signal that requires corroboration. Above ten it can carry weight on its own. Most teams have never computed it once."
            },
            {
              kind: "callout",
              title: "The design consequence",
              body: "Because you cannot easily raise the cost side on a protocol with no slashing, the durable move is to lower the profit side: make sure no single claim can move a high-value decision by itself. Corroboration requirements are cheaper than capital wars and they are the only defence that scales with the attacker's budget rather than against it."
            }
          ],
          glossary: ["cost-of-corruption", "profit-from-corruption", "recoverable-stake", "security-ratio", "corroboration"],
          awards: ["ledger-mind"]
        },
        {
          id: "ch-intuition-griefing",
          kind: "lesson",
          title: "Griefing an Honest Claim",
          statement: "Some attackers are not trying to make you believe something false; they are trying to make believing anything expensive, and against that goal your careful process is the weapon.",
          minutes: 28,
          respect: 145,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The griefer's objective function",
              body: "A griefer does not need the counter vault to win. They need it to be non-trivial. If your process says a claim with meaningful dissent goes to human review, then buying meaningful dissent on every claim you care about converts your review capacity into the binding constraint on your entire product. The economics are brutally in their favour: dissent costs them recoverable capital plus low single-digit percentage fees, and it costs you analyst hours, which are neither recoverable nor cheap nor elastic."
            },
            {
              kind: "compare",
              title: "Two threat actors that require opposite defences",
              left: {
                title: "The persuader",
                items: [
                  "Wants a specific false claim to be believed",
                  "Must win the vault, decisively and durably",
                  "Cares about being credible, so uses aged and clustered identities",
                  "Defeated by corroboration and by dwell-time weighting",
                  "Cost scales with how strongly the true claim is held"
                ]
              },
              right: {
                title: "The griefer",
                items: [
                  "Wants your process to stall or your output to be untrustworthy",
                  "Only needs to create contestation, never to win it",
                  "Does not care about credibility at all; fresh identities are fine",
                  "Defeated by making dissent cost the dissenter something you keep",
                  "Cost scales with how many claims you care about, which they choose"
                ]
              }
            },
            {
              kind: "principle",
              body: "Any rule of the form we will pause when someone objects hands an unbounded denial-of-service to anyone willing to object. Every dispute mechanism must ask what it costs to be wrong, and the answer must not be nothing."
            },
            {
              kind: "list",
              title: "Anti-griefing mechanisms, ranked by how well they hold",
              items: [
                "Evidence-bearing disputes only. A dispute must carry a resolvable artefact — a transaction, a reproduction, a signed statement — not merely a counter-stake. Costs the griefer work, which is the one thing that does not round-trip.",
                "Bonded challenges at your layer. The challenger posts a bond you hold and forfeit on frivolous challenges. Effective, and it makes you the arbiter, which is a governance decision you must make consciously.",
                "Asymmetric thresholds. Promotion requires a high bar; demotion requires a higher one, because demotion is the cheaper attack and the one with the nastier second-order effect on availability.",
                "Reviewer capacity as a published, bounded resource. If disputes exceed capacity, the overflow policy is pre-written and automatic rather than decided under pressure by whoever is on call.",
                "Reputation-weighted dispute standing, with the standing itself earned through a track record you measure. Powerful and slow to bootstrap; it also concentrates power, so pair it with a published appeal path.",
                "Rate limiting per identity cluster rather than per address. Per-address limits are free to defeat at 0.01 TRUST a head."
              ]
            },
            {
              kind: "prose",
              title: "The second-order effect that catches good teams",
              body: "The most common anti-griefing measure is to quietly raise the bar for dissent — require more stake, require reviewer approval, require a form. It works, briefly, and then you discover what you actually built: a system where honest researchers with limited capital can no longer contradict a well-funded claim, which is precisely the failure the counter vault existed to prevent. You will have traded a denial-of-service against your process for a censorship regime against your best contributors, and the second failure is far harder to see from the inside because it manifests as quiet, not as noise. Track the number of successful disputes from small holders as a health metric. If it goes to zero, your defence became the problem."
            },
            {
              kind: "callout",
              title: "Name it correctly when you brief",
              body: "Griefing is an availability attack, not an integrity attack, and it belongs in that column of your risk register with an availability owner. Teams consistently misfile it under integrity, which routes it to the wrong reviewers and produces integrity-shaped controls that make the availability problem worse."
            }
          ],
          glossary: ["griefing", "evidence-bearing-dispute", "bonded-challenge", "asymmetric-threshold", "availability-attack"],
          awards: ["grief-proof"]
        },
        {
          id: "ch-intuition-laundering",
          kind: "lesson",
          title: "Reputation Laundering",
          statement: "Reputation earned in a domain where you cannot be checked converts, without friction, into authority in a domain where it matters — and on a public graph that conversion leaves a trail you can actually follow.",
          minutes: 30,
          respect: 175,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The play",
              body: "An actor accumulates a long, clean, verifiable record of correct attestations in a domain that is cheap to be right in — token metadata, project links, uncontroversial tagging, follows. Thousands of claims, all true, all boring, all confirmed by everyone. That record makes them a high-reputation attestor under any scoring function that measures accuracy without measuring difficulty. Then, once, at the moment it pays, they spend that reputation on a claim in a domain where being wrong is expensive for you: a contract safety assertion, a vendor breach claim, a maintainer identity binding. Nothing they did before was fraudulent. The fraud is the conversion."
            },
            {
              kind: "principle",
              body: "Score accuracy per unit of difficulty, never accuracy alone. A thousand correct claims that nobody could have got wrong is not evidence of judgement; it is evidence of participation."
            },
            {
              kind: "table",
              title: "Laundering routes and their detection signatures",
              headers: ["Route", "How it works", "Signature in the data"],
              rows: [
                ["Domain hop", "Build record in a low-stakes domain, spend it in a high-stakes one", "First claim in the high-stakes predicate arrives with an anomalously high stake and no prior history in that predicate family"],
                ["Volume laundering", "Thousands of trivially-true claims to inflate accuracy count", "Extremely high claim count with near-zero counter-vault exposure ever taken against them"],
                ["Consensus shadowing", "Only ever attest after consensus is visible, harvesting accuracy with no risk", "Claim timestamps cluster tightly after the FOR vault has already crossed a majority; never an early position"],
                ["Identity graft", "Acquire or compromise an aged, respected identity and repurpose it", "Sharp discontinuity in predicate mix, staking size, or timing behaviour at a single point in time"],
                ["Endorsement ring", "A cluster mutually elevates each other's standing over time", "Follow and endorsement edges are dense inside the cluster and sparse outward; no member has ever counter-staked another"],
                ["Institutional drape", "Attach a real organisation's name to an identity it does not control", "The organisation atom has no reciprocal claim; no signed control proof binds the address to the name"]
              ]
            },
            {
              kind: "prose",
              title: "Consensus shadowing deserves its own paragraph",
              body: "This is the most elegant one and the hardest to name in a meeting. An actor never takes a position until the FOR vault is already clearly winning. Their accuracy is near-perfect, forever, at essentially no risk. Every naive reputation function loves them. And they have contributed exactly nothing, because information only has value before it is consensus. The test is trivial once you know to run it: for every attestor, compute the median share of the vault's eventual market cap that already existed at the moment they entered. A genuine early attestor's number is low and their accuracy is noisier. A shadow's number is high and their accuracy is suspiciously clean. Rank by early-and-right, never by right."
            },
            {
              kind: "numbered",
              title: "Building a laundering-resistant attestor score",
              items: [
                "Bucket every claim by predicate family and by contestedness at time of entry, so that difficulty is a dimension and not an afterthought.",
                "Score accuracy only within a bucket, and never let accuracy in an easy bucket contribute weight in a hard one. Cross-domain transfer must be explicit and capped.",
                "Weight by earliness: what fraction of the eventual vault existed when this attestor took their position.",
                "Include exposure taken: has this attestor ever counter-staked, ever been wrong, ever lost money. An attestor with no losses has taken no risk and has demonstrated no judgement.",
                "Detect discontinuity: monitor each high-weight identity for step changes in behaviour, and treat a step change as a possible key compromise until shown otherwise.",
                "Cap the rate at which any single identity's weight can grow, so that a laundered or compromised reputation cannot be spent all at once."
              ]
            },
            {
              kind: "callout",
              title: "The one that will actually happen to you",
              body: "Identity graft via key compromise. Chainalysis put personal wallet compromise at 23.35 percent of all stolen-fund activity in the first half of 2025, and the largest single event of that period began with a compromise of a developer environment rather than a contract flaw. Your highest-reputation attestor key is a phishing target with a market value, and the discontinuity test above is the cheapest tripwire you will ever deploy."
            }
          ],
          glossary: ["reputation-laundering", "consensus-shadowing", "earliness-weight", "identity-graft", "discontinuity-detection"],
          awards: ["launder-detector", "cluster-analyst"]
        },
        {
          id: "ch-intuition-attack-budget",
          kind: "lab",
          title: "Build the Attack-Budget Model",
          statement: "Until the number is in a file that anyone on your team can rerun, your threat model is a story you tell yourselves.",
          minutes: 40,
          respect: 200,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "What you are building",
              body: "A script that takes a term id and a target threshold, reads live vault state, and returns the non-recoverable cost for an adversary to move that claim past your decision threshold and hold it across your observation window. It is not a simulation and it is not perfect. It is a number with stated assumptions, which is infinitely more than most organisations have, and it turns every subsequent argument about controls into an argument about inputs rather than about vibes."
            },
            {
              kind: "code",
              title: "Cost model against live state",
              lang: "typescript",
              body: "import { formatEther, parseEther, type Hex } from 'viem';\nimport {\n  multiVaultGetVault,\n  multiVaultPreviewDeposit,\n  multiVaultPreviewRedeem,\n  calculateCounterTripleId,\n} from '@0xintuition/sdk';\n\nconst CURVE = 1n;\nconst BPS = 10_000n;\n\n// Published protocol parameters. Snapshot them; alert if they drift.\nconst ENTRY_FEE_BPS = 50n;\nconst EXIT_FEE_BPS = 75n;\nconst PROTOCOL_FEE_BPS = 125n;\n\ntype Assumptions = {\n  holdDays: number;\n  annualCostOfCapitalBps: bigint;\n  decisionValue: bigint;\n};\n\nexport async function attackCost(\n  tripleId: Hex,\n  targetCounterAssets: bigint,\n  a: Assumptions,\n) {\n  const counterId = calculateCounterTripleId(tripleId);\n  const forVault = await multiVaultGetVault(config, { args: [tripleId] });\n  const againstVault = await multiVaultGetVault(config, { args: [counterId] });\n\n  const deploy = targetCounterAssets;\n\n  // Non-recoverable fee legs\n  const entry = (deploy * ENTRY_FEE_BPS) / BPS;\n  const protocol = (deploy * PROTOCOL_FEE_BPS) / BPS;\n\n  // Round-trip through the curve to measure real slippage, not assumed slippage\n  const sharesOut = await multiVaultPreviewDeposit(config, {\n    args: [counterId, CURVE, deploy],\n  });\n  const assetsBack = await multiVaultPreviewRedeem(config, {\n    args: [counterId, CURVE, sharesOut],\n  });\n  const exit = (assetsBack * EXIT_FEE_BPS) / BPS;\n  const slippage = deploy > assetsBack ? deploy - assetsBack : 0n;\n\n  // Opportunity cost: the only leg that scales with a dwell-time defence\n  const carry =\n    (deploy * a.annualCostOfCapitalBps * BigInt(a.holdDays)) / (BPS * 365n);\n\n  const nonRecoverable = entry + protocol + exit + slippage + carry;\n\n  return {\n    forAssets: forVault.totalAssets,\n    againstAssets: againstVault.totalAssets,\n    capitalRequired: formatEther(deploy),\n    nonRecoverableCost: formatEther(nonRecoverable),\n    securityRatio:\n      Number(nonRecoverable) / Number(a.decisionValue === 0n ? 1n : a.decisionValue),\n    assumptions: a,\n  };\n}\n"
            },
            {
              kind: "callout",
              title: "Read what the model tells you, not what you hoped",
              body: "Run it against a real claim your product depends on with holdDays set to your actual observation window. In most configurations the non-recoverable cost lands in the low single-digit percentage range of capital deployed, and the carry term dominates only when you hold your window open for weeks. That is the finding. It means dwell time is your strongest lever and threshold height is your weakest, and it means anyone with access to capital can attack your threshold for a fraction of a percent of it."
            },
            {
              kind: "checklist",
              title: "Lab completion",
              items: [
                "The model runs against a live term id and produces a number without hand-editing.",
                "Protocol fee parameters are read or snapshotted from a single source with a drift alert, not hardcoded in three places.",
                "Slippage is measured through preview functions rather than assumed.",
                "The observation window in the model equals the observation window in production. If they differ, I have written down why.",
                "decisionValue is filled in with a real figure agreed with a business owner, not a placeholder.",
                "The output is checked into the repository next to the control it justifies, with the date it was run."
              ]
            },
            {
              kind: "metric",
              title: "The graph that changes the conversation",
              body: "Plot non-recoverable cost against holdDays for a fixed capital deployment. The curve is nearly flat at short windows and rises linearly once carry dominates. Put that chart in front of a sceptical engineering leader and the argument for a time-weighted read instead of a snapshot read makes itself in about eleven seconds."
            }
          ],
          praxis: "Implement the attack-budget model against a real term your organisation would depend on, with real assumptions signed off by a business owner.",
          evidence: "The committed script, one run output with a timestamp, and a one-page memo stating the security ratio, the assumptions behind it, and whether the input is being used as a control, a signal, or neither.",
          glossary: ["attack-budget", "carry-cost", "slippage", "observation-window", "parameter-drift"],
          awards: ["ledger-mind", "model-builder"]
        },
        {
          id: "ch-intuition-whale",
          kind: "drill",
          title: "The Whale Takes the Wrong Side",
          statement: "When capital contradicts evidence, changing your scoring function is a defensible engineering decision and matching the capital is a bet you have no mandate to place.",
          minutes: 26,
          respect: 170,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Setting up the pressure honestly",
              body: "The hardest version of this is not when a whale backs a lie. It is when a whale backs a lie about something you published, so that defending the truth and defending yourself are the same action and you can no longer tell whether your judgement is clean. Read the drill knowing that the scenario is engineered to make the self-interested action and the correct action look identical, and that they are not."
            },
            {
              kind: "principle",
              body: "The operator of a ranking must not be a market participant in the thing it ranks. The moment you counter-stake to protect your own output, your output is a position and every critic who says so is right."
            },
            {
              kind: "metric",
              title: "What your scoring function should have been measuring all along",
              body: "Distinct independent positions above a meaningful size, weighted by dwell time, with capital concentration as a discount factor. Under that function, a single enormous position moves the score far less than it moves raw market cap — and crucially, that property must have been true before the incident, or changing to it now looks exactly like moving the goalposts."
            }
          ],
          drill: {
            id: "ch-intuition-drill-whale",
            scene: "Your team published a well-evidenced claim that a widely used contract carries an unpatched reentrancy issue, and staked it. Overnight a single address deposited enough into the counter vault that AGAINST market cap now exceeds FOR by roughly four to one. Your product ranks by net market cap, so as of the next refresh the contract will read as clean. The address is new, funded from a bridge, and has no other history. Your evidence has not changed and is public.",
            clock: "Next scoring refresh in 3 hours. A trade publication has already asked for comment.",
            pressure: "Your CTO wants to know why the company's own published finding is about to be scored away by its own product.",
            prompt: "What ships in three hours?",
            options: [
              {
                id: "opt-match",
                label: "Match the counter-stake from the treasury so the FOR vault leads again before the refresh.",
                detail: "Restores the correct answer immediately, using the mechanism as designed, and the capital is recoverable.",
                score: -1,
                outcome: "The number is right for now. You have also entered an open-ended capital contest against an unknown balance sheet, and you have made the operator of the ranking the largest position in the thing being ranked.",
                ripple: "The trade publication runs a story about a security vendor buying its own ranking. It is a fair characterisation and you have no rebuttal. Every future finding you publish is now read as a position statement, which is the exact credibility your entire business model rests on."
              },
              {
                id: "opt-rescore",
                label: "Ship the scoring change you already had designed: distinct dwell-time-weighted positions with a capital-concentration discount, published with its rationale, effective date, and the fact that it changes this specific outcome.",
                detail: "Fixes the class of problem, discloses the conflict, and does not put the company into the market.",
                score: 3,
                outcome: "The refresh reflects that one new address does not outweigh a distributed, aged position set. You have published a methodology change under your own name, including the uncomfortable disclosure that it changes an outcome involving your own claim.",
                ripple: "The disclosure is what makes it survive scrutiny. Customers who read the note learn that your scoring is designed rather than tuned, and the trade publication has a boring story. Internally, the incident forces you to keep a standing methodology-change process with pre-review, which is worth more than the incident cost.",
                isBest: true
              },
              {
                id: "opt-market-corrects",
                label: "Publish the evidence again, publicly and in detail, and let the market correct itself before the next refresh.",
                detail: "Trusts the mechanism, costs nothing, and keeps you out of the market entirely.",
                score: 1,
                outcome: "The evidence is strong and some independent stakers do arrive. Not enough of them arrive within three hours, so your product ships the wrong answer while you are publicly asserting the right one, which is the worst combination available.",
                ripple: "Customers who gate deployments on your feed act on the wrong value. You will spend the following week explaining why your product and your research team disagreed, and no explanation will fully repair it. Relying on a market to resolve inside your release window is a scheduling assumption dressed as a principle."
              },
              {
                id: "opt-suppress",
                label: "Manually exclude this contract from the refresh so neither answer ships, and revisit next week.",
                detail: "Nobody gets a wrong answer, and it buys time to decide properly.",
                score: -3,
                outcome: "You have introduced an undisclosed manual override into an automated ranking, in a case where your company has a direct interest in the outcome. That is the single fact most likely to end the product.",
                ripple: "The override exists in code and in logs. When it is found — by an auditor, a departing employee, or a customer diff — the story is not that the score was wrong; it is that the score is editable by the vendor when the vendor dislikes it. Every historical output becomes suspect at once."
              }
            ],
            debrief: "The teaching is about which lever you are entitled to pull. You own your methodology; you do not own the market. Matching the stake feels like defending the truth, and in a narrow sense it does defend it, but it converts you from referee to player in full public view and there is no path back. Waiting for the market is principled and fails on timing, which matters because your customers are acting on a schedule you set. The manual exclusion is the career-ending option precisely because it is invisible and easy and solves the immediate problem. The best answer works only because the scoring change was already designed before the incident — which is the actual lesson. You cannot invent a methodology under fire without it looking like a fix; you can only ship one you already had. Every serious ranking team keeps a queue of designed-but-unshipped methodology improvements, with rationale written in peacetime, exactly so that this drill has a good answer available.",
            principle: "Change the rule, never the score. And write the rule before you need it."
          },
          glossary: ["whale-dominance", "methodology-disclosure", "referee-conflict", "capital-concentration-discount"],
          awards: ["clean-hands", "ledger-mind"]
        }
      ]
    }
    ,
    {
      id: "ch-intuition-p4",
      title: "THE VALIDATOR SESSION",
      credential: "Certified Graph Validator",
      summary: "The craft Page. A repeatable ritual for auditing a region of a token-curated graph, the query pack that powers it, the key discipline that makes your signature worth something, and the dispute design that stops your own process being used against you.",
      competencies: [
        "Define curation-quality metrics that a competent adversary cannot cheaply satisfy.",
        "Run a bounded, repeatable Validator Session over a named region of the graph.",
        "Write and operate a GraphQL audit query pack against the Intuition API.",
        "Publish findings as staked, signed, provenance-bearing attestations.",
        "Operate a high-reputation attestor key with hardware isolation, tiering, and rotation.",
        "Design challenge windows that resist both false claims and denial-of-service by objection."
      ],
      seal: "SEAL OF THE VALIDATOR",
      steps: [
        {
          id: "ch-intuition-quality-metrics",
          kind: "lesson",
          title: "Curation-Quality Metrics That Do Not Reward the Attacker",
          statement: "Every metric you publish becomes a target, so choose metrics whose cheapest satisfaction is the behaviour you actually wanted.",
          minutes: 30,
          respect: 160,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Design rule",
              body: "Assume the metric is public and that a well-resourced adversary optimises it directly. The question is never is this metric a good proxy for quality. The question is what is the cheapest way to make this number go up, and would I be happy if someone did exactly that at scale. If the cheapest satisfaction is buying capital, you have built a plutocracy metric. If it is minting addresses, you have built a Sybil metric. If it is doing the actual work of forming a defensible view early and taking risk on it, you have built something worth publishing."
            },
            {
              kind: "table",
              title: "Metric audit",
              headers: ["Metric", "Cheapest way to satisfy it", "Verdict"],
              rows: [
                ["Vault market cap", "Deposit capital, recover it later", "Weak alone. Measures balance sheet, not belief."],
                ["Position count", "Split capital across addresses at 0.01 TRUST each", "Worthless alone. The single most gameable number on the system."],
                ["Distinct funding-ancestry clusters", "Actually acquire independent counterparties", "Strong. Expensive to fake, cheap to compute."],
                ["Dwell-time-weighted stake", "Hold capital through the whole window", "Strong. Converts recoverable capital into non-recoverable carry."],
                ["Earliness share", "Take a position before consensus exists, and be wrong sometimes", "Strong. Directly punishes consensus shadowing."],
                ["Counter-vault engagement", "Genuinely disagree with someone, publicly, with money", "Strong. Rings with zero internal dissent cannot satisfy it without breaking themselves."],
                ["Claim volume by an attestor", "Spam trivially-true claims", "Harmful. Actively rewards volume laundering. Never publish it as a quality signal."],
                ["Historical accuracy, unbucketed", "Only attest to settled consensus", "Harmful. The purest reward for contributing nothing."]
              ]
            },
            {
              kind: "principle",
              body: "The best curation metrics all share one property: satisfying them requires giving up optionality. Capital that must dwell, positions that must be early, disagreements that must be public. Optionality is what an attacker is unwilling to surrender."
            },
            {
              kind: "prose",
              title: "The composite, and why you publish its shape but not its constants",
              body: "A workable attestor weight is a product of four factors: independence, measured by funding-ancestry cluster diversity; commitment, measured by dwell-weighted stake; courage, measured by earliness share and realised losses; and domain fit, measured within predicate family rather than across the whole graph. Publish that structure, because a scoring function nobody can inspect is not trusted and does not deserve to be. Do not publish the exact constants and refresh cadence, because those are precisely what a P-plus-epsilon-style coordinator needs to know in order to price a bloc. This distinction — transparent mechanism, withheld parameters — is the same one used in fraud scoring and abuse detection everywhere, and it is defensible in front of both an auditor and a critic."
            },
            {
              kind: "checklist",
              title: "Before any metric ships to a customer-visible surface",
              items: [
                "I have written the cheapest-satisfaction path for this metric in one sentence.",
                "I have estimated the cost of that path using the published fee parameters and current curve depth.",
                "I have checked whether the metric can be moved by a single actor, and by how much.",
                "I know what this metric does when the graph region is cold and thin, not just when it is healthy.",
                "There is a named owner who reviews this metric quarterly and can retire it.",
                "The metric degrades gracefully rather than failing to a confident wrong answer when inputs are missing."
              ]
            }
          ],
          glossary: ["curation-quality", "goodhart", "attestor-weight", "earliness-share", "cluster-diversity"],
          awards: ["metric-smith"]
        },
        {
          id: "ch-intuition-validator-session",
          kind: "field",
          title: "THE VALIDATOR SESSION",
          statement: "A region of a public knowledge graph is an asset with no owner, which means it is audited by whoever decides to audit it — and the ritual below is how a professional decides.",
          minutes: 40,
          respect: 220,
          trust: 14,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "What this is",
              body: "A Validator Session is a bounded, repeatable, ninety-minute audit of a named region of the graph, ending in published findings that are themselves attestations. It is deliberately shaped like an incident review rather than like research: fixed scope, fixed clock, fixed output format, run the same way every time so that the results are comparable across sessions and across analysts. Run it monthly on the regions your organisation depends on. Run it once on any region before you allow it to influence a decision for the first time."
            },
            {
              kind: "numbered",
              title: "The ritual, in nine movements",
              items: [
                "SCOPE, 5 minutes. Name the region in one sentence: a predicate family, a subject set, a time window. Write the scope down before you look at any data. A session whose scope expands mid-flight produces findings that cannot be compared to the last one.",
                "CENSUS, 10 minutes. Count what exists. How many triples, how many distinct subjects, how many distinct attestors, what is the total staked, when was the region created, when was it last touched. You are establishing whether this region is alive, cold, or abandoned. A region with high market cap and no activity in ninety days is a museum, and museums get consumed as if they were current all the time.",
                "VOCABULARY, 10 minutes. List every predicate in the region by frequency. Read the top ten aloud and apply the six pathologies from the predicate step: unfalsifiable, asymmetric, time-blind, scope-creeping, bundled, loaded. Check whether any predicate has a definition atom attached and whether current usage matches it. This movement finds more real problems than any other and almost nobody performs it.",
                "CONCENTRATION, 10 minutes. For the top claims by market cap, compute the share held by the top three positions, and the number of distinct funding-ancestry clusters. Flag anything where one cluster holds a majority. You are not accusing anyone; you are measuring how much of this region's apparent consensus is one balance sheet.",
                "INDEPENDENCE, 15 minutes. Take the twenty largest attestors in the region and run the independence tests: funding ancestry, timing correlation, portfolio overlap, internal dissent, exit correlation. Produce a cluster map with a stated confidence. This is the most analytically demanding movement and the one that most benefits from being run the same way every month, because clusters are visible in change more than in snapshot.",
                "DISSENT, 10 minutes. Find every claim in the region with a non-trivial counter vault and read the evidence on both sides. Then find the claims with zero dissent and ask why. In a healthy contested domain, universal agreement on everything is not a sign of truth; it is a sign that nobody with an opposing view can afford to speak or that nobody is looking.",
                "STALENESS, 10 minutes. For each high-weight claim, establish the last date on which the assertion could have been verified. Time-blind predicates make this manual. Any claim whose supporting evidence predates the current version of its subject is a finding, regardless of how much money is behind it.",
                "SUBSTRATE, 10 minutes. Verify a sample. Re-read three high-weight vaults directly from the contract and compare against the indexer. Resolve every IPFS URI in your sample and confirm the content hashes match and still resolve. Record the indexer lag you observed. This movement is where you catch the failures nobody else is looking for.",
                "PUBLISH, 10 minutes. Write findings in the fixed format, sign them, and stake them. The session is not complete until the output is on the graph, because a validator who only writes internal memos is a consumer with extra steps."
              ]
            },
            {
              kind: "table",
              title: "Finding format — use exactly these fields, every time",
              headers: ["Field", "Content", "Why it is mandatory"],
              rows: [
                ["Region", "The scope sentence, verbatim from movement one", "Makes sessions comparable and stops scope drift being invisible"],
                ["Observation", "What is true, stated without interpretation", "Separates measurement from judgement so a disagreeing reader can accept the first and reject the second"],
                ["Method", "The exact queries and thresholds used", "A finding whose method is not reproducible is an opinion with a chart"],
                ["Confidence", "High, medium, or low, with the reason", "Forces you to be honest about clustering inference, which is probabilistic"],
                ["Consequence", "What decision this should change, if any", "Findings with no consequence are noise; say so explicitly when that is the answer"],
                ["Falsifier", "What evidence would overturn this finding", "The single most credibility-building line you can write, and the one that protects you when you are wrong"]
              ]
            },
            {
              kind: "callout",
              title: "The discipline that makes it work",
              body: "Timebox every movement and let findings be incomplete rather than letting the session run long. An eighty percent audit performed twelve times a year detects change; a perfect audit performed once does not. Change detection is the entire value here, because a static graph region tells you almost nothing and a region that just doubled its concentration ratio tells you everything."
            },
            {
              kind: "quote",
              body: "Trust evaluation incorporates stake amount, attestor quality, validator diversity, the time consensus has held, and counter-signal strength.",
              source: "Intuition Docs, Trust Mechanisms — treat this as the checklist the protocol expects you, not it, to run"
            }
          ],
          praxis: "Run one complete Validator Session, all nine movements, against a real region of the Intuition graph on mainnet or testnet — a predicate family or subject set your organisation would plausibly depend on. Keep to the ninety-minute clock.",
          evidence: "The completed finding set in the six-field format, with the scope sentence, the queries used, a cluster map with stated confidence, the measured indexer lag, and at least one finding whose falsifier you wrote before you knew whether it would hold. Attach the session date and the term ids of any attestations you published.",
          glossary: ["validator-session", "census", "concentration-ratio", "staleness", "falsifier", "knowledge-graph-integrity"],
          awards: ["the-validator", "seal-of-the-commons"]
        },
        {
          id: "ch-intuition-query-pack",
          kind: "lab",
          title: "The Audit Query Pack",
          statement: "The session is only repeatable if the queries are written down, so write them down once and never improvise them under pressure again.",
          minutes: 36,
          respect: 185,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Endpoint and ground rules",
              body: "Mainnet reads go to the Hasura GraphQL endpoint at mainnet.intuition.sh and testnet to testnet.intuition.sh, both under the v1/graphql path, with no wallet and no auth required. All ids are String in v2 — this was a breaking change from numeric, and a query typed against the old schema will fail in ways that look like missing data rather than like errors. Type every id variable as String. Prefer primary-key lookups over where filters, use aggregates for counts instead of fetching rows, and use the provided database functions for social and search rather than reimplementing them client-side."
            },
            {
              kind: "code",
              title: "Query one — census of a predicate family",
              lang: "graphql",
              body: "query RegionCensus($predicateId: String!, $since: timestamptz!) {\n  triples_aggregate(where: { predicate_id: { _eq: $predicateId } }) {\n    aggregate {\n      count\n    }\n  }\n\n  recent: triples_aggregate(\n    where: {\n      predicate_id: { _eq: $predicateId }\n      created_at: { _gte: $since }\n    }\n  ) {\n    aggregate {\n      count\n    }\n  }\n\n  triples(\n    where: { predicate_id: { _eq: $predicateId } }\n    order_by: { created_at: desc }\n    limit: 50\n  ) {\n    term_id\n    created_at\n    creator {\n      id\n    }\n    subject {\n      term_id\n      label\n    }\n    object {\n      term_id\n      label\n    }\n  }\n}\n"
            },
            {
              kind: "code",
              title: "Query two — both sides of a claim, with concentration inputs",
              lang: "graphql",
              body: "query ClaimWithDissent($tripleId: String!, $curveId: numeric!) {\n  triple(term_id: $tripleId) {\n    term_id\n    subject {\n      label\n    }\n    predicate {\n      label\n    }\n    object {\n      label\n    }\n    term {\n      total_assets\n      total_market_cap\n      vaults(where: { curve_id: { _eq: $curveId } }) {\n        total_shares\n        total_assets\n        current_share_price\n        market_cap\n        position_count\n        positions(order_by: { shares: desc }, limit: 10) {\n          shares\n          account {\n            id\n          }\n        }\n      }\n    }\n    counter_term_id\n    counter_term {\n      total_assets\n      vaults(where: { curve_id: { _eq: $curveId } }) {\n        total_shares\n        market_cap\n        position_count\n        positions(order_by: { shares: desc }, limit: 10) {\n          shares\n          account {\n            id\n          }\n        }\n      }\n    }\n  }\n}\n"
            },
            {
              kind: "code",
              title: "Query three — attestor behaviour, for independence and shadowing tests",
              lang: "graphql",
              body: "query AttestorProfile($accountId: String!, $limit: Int!) {\n  account(id: $accountId) {\n    id\n    label\n    positions_aggregate {\n      aggregate {\n        count\n      }\n    }\n    positions(order_by: { shares: desc }, limit: $limit) {\n      shares\n      vault {\n        term_id\n        curve_id\n        market_cap\n        position_count\n      }\n    }\n  }\n\n  signals(\n    where: { account_id: { _eq: $accountId } }\n    order_by: { block_timestamp: asc }\n    limit: $limit\n  ) {\n    delta\n    block_timestamp\n    transaction_hash\n    term_id\n  }\n}\n"
            },
            {
              kind: "code",
              title: "Composing the checks in TypeScript",
              lang: "typescript",
              body: "import { GraphQLClient } from 'graphql-request';\nimport { API_URL_PROD } from '@0xintuition/graphql';\n\nconst client = new GraphQLClient(API_URL_PROD);\n\ntype Position = { shares: string; account: { id: string } };\n\nexport function concentration(positions: Position[], totalShares: string) {\n  const total = BigInt(totalShares);\n  if (total === 0n) return 1;\n  const topThree = positions\n    .slice(0, 3)\n    .reduce((acc, p) => acc + BigInt(p.shares), 0n);\n  return Number((topThree * 10_000n) / total) / 10_000;\n}\n\nexport function timingCorrelation(signals: { block_timestamp: string }[]) {\n  // Count how many signals share a timestamp bucket with another signal.\n  // Scripted fleets cluster; humans do not.\n  const buckets = new Map<string, number>();\n  for (const s of signals) {\n    const key = String(Math.floor(Number(s.block_timestamp) / 60));\n    buckets.set(key, (buckets.get(key) ?? 0) + 1);\n  }\n  const clustered = [...buckets.values()].filter((n) => n > 1).length;\n  return clustered / Math.max(buckets.size, 1);\n}\n\nexport async function auditClaim(tripleId: string, curveId = 1) {\n  const data = await client.request(CLAIM_WITH_DISSENT, { tripleId, curveId });\n  const forVault = data.triple.term.vaults[0];\n  const againstVault = data.triple.counter_term?.vaults?.[0];\n\n  return {\n    forConcentration: concentration(forVault.positions, forVault.total_shares),\n    forPositions: forVault.position_count,\n    againstMarketCap: againstVault?.market_cap ?? '0',\n    dissentRatio:\n      Number(againstVault?.market_cap ?? 0) / Math.max(Number(forVault.market_cap), 1),\n  };\n}\n"
            },
            {
              kind: "callout",
              title: "Verify the indexer against the chain in every session",
              body: "The GraphQL layer is off-chain infrastructure with its own lag and its own operator. For at least three high-weight vaults per session, read the same values through multiVaultGetVault and compare. When they diverge beyond your recorded lag, that is a finding in its own right and it belongs in the session output — not because you suspect malice, but because your entire read path depends on an assumption nobody else on your team is testing."
            },
            {
              kind: "checklist",
              title: "Lab completion",
              items: [
                "All four queries run against a live endpoint and return data.",
                "Every id variable is typed String, and I have confirmed the query fails loudly rather than silently if it is not.",
                "The pack is version-controlled with the session template, not pasted into a notebook.",
                "Concentration and timing-correlation functions are unit-tested against a hand-built fixture.",
                "I compared at least three vaults between GraphQL and the contract and recorded the divergence."
              ]
            }
          ],
          praxis: "Commit the audit query pack to a repository with a README explaining each query's role in the nine movements.",
          evidence: "Repository link or export, plus one real run against a live region showing concentration and dissent-ratio outputs for at least five claims.",
          glossary: ["graphql-audit", "concentration-ratio", "timing-correlation", "dual-read", "indexer-lag"],
          awards: ["query-smith", "the-validator"]
        },
        {
          id: "ch-intuition-publish-findings",
          kind: "field",
          title: "Publishing Findings as Attestations",
          statement: "A finding that lives only in your document store cannot be built on, disputed, or compounded, and a finding on the graph can be all three — including by people who think you are wrong.",
          minutes: 34,
          respect: 190,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Why publish at all",
              body: "Two reasons that survive scrutiny. First, compounding: an attestation you make becomes something others can reference, extend, and dispute, and over years that turns a research team into infrastructure. Second, accountability: a claim you staked and signed is a claim you can be held to, and being holdable is what distinguishes an analyst from a commentator. The reason not to publish is also real and must be weighed each time — publishing tips adversaries, creates legal exposure, and permanently records a judgement you may later regret. Decide deliberately, per finding, against a written policy."
            },
            {
              kind: "numbered",
              title: "The publication procedure",
              items: [
                "Classify the finding. Measurement, inference, or allegation. Measurements publish freely. Inferences publish with confidence and method attached. Allegations about named parties go to legal review before anything touches a wallet, without exception and without a fast path.",
                "Choose or create the predicate. Search first. If nothing fits, write the definition atom before the predicate atom, and bind them with a nested triple in the same session so the definition can never be lost.",
                "Publish the observation as the primary triple, with a bounded object. Never encode prose into the object slot.",
                "Publish provenance as a nested triple: the observation triple as subject, asserted_by as predicate, your attestor identity atom as object. Add a second nested triple carrying the session date.",
                "Publish the method reference: pin the query pack version and thresholds to IPFS, create an atom from that URI, and bind it to the observation with a method predicate. This is what makes the finding reproducible by a stranger.",
                "Stake proportionally to your confidence, and record the amount in your internal log alongside why. Staking more than your confidence justifies is dishonest even when you turn out to be right.",
                "Set a review date. Put it in the same calendar your vulnerability management uses. An attestation with no expiry becomes a time-blind claim, and you have just spent a whole chapter learning why that is a defect."
              ]
            },
            {
              kind: "code",
              title: "Publishing an observation with provenance and method",
              lang: "typescript",
              body: "import { parseEther, type Hex } from 'viem';\nimport {\n  createAtomFromString,\n  createAtomFromIpfsUpload,\n  createTripleStatement,\n  calculateAtomId,\n  getAtomDetails,\n} from '@0xintuition/sdk';\n\nasync function getOrCreateAtom(data: string, seed: bigint) {\n  const id = calculateAtomId(data);\n  const found = await getAtomDetails(id);\n  if (found) return id;\n  const made = await createAtomFromString(config, data, seed);\n  return made.state.termId as Hex;\n}\n\nexport async function publishFinding(input: {\n  subjectId: Hex;\n  predicate: string;\n  object: string;\n  attestorAtomId: Hex;\n  sessionDate: string;\n  method: Record<string, unknown>;\n  stake: bigint;\n}) {\n  const seed = parseEther('0.05');\n\n  const predicateId = await getOrCreateAtom(input.predicate, seed);\n  const objectId = await getOrCreateAtom(input.object, seed);\n\n  const observation = await createTripleStatement(config, {\n    args: [[input.subjectId], [predicateId], [objectId], [input.stake]],\n    value: input.stake,\n  });\n  const observationId = observation.state[0].termId as Hex;\n\n  const assertedBy = await getOrCreateAtom('asserted_by', seed);\n  const observedOn = await getOrCreateAtom('observed_on', seed);\n  const derivedVia = await getOrCreateAtom('derived_via', seed);\n\n  const dateId = await getOrCreateAtom(input.sessionDate, seed);\n\n  const methodAtom = await createAtomFromIpfsUpload(config, input.method, seed);\n  const methodId = methodAtom.state.termId as Hex;\n\n  const link = parseEther('0.05');\n\n  await createTripleStatement(config, {\n    args: [\n      [observationId, observationId, observationId],\n      [assertedBy, observedOn, derivedVia],\n      [input.attestorAtomId, dateId, methodId],\n      [link, link, link],\n    ],\n    value: link * 3n,\n  });\n\n  return observationId;\n}\n"
            },
            {
              kind: "callout",
              title: "The parallel-array detail",
              body: "createTripleStatement takes four parallel arrays and index i across all four defines triple i, so three provenance triples go out in one transaction. This is not merely a gas optimisation. It means the observation and its provenance land atomically, and there is never a window in which your claim exists on the graph without the record of who made it and how."
            },
            {
              kind: "principle",
              body: "Publish the falsifier alongside the finding. An attestation that tells a reader exactly what would disprove it is worth more than one that does not, and it is the only thing that makes being publicly wrong survivable."
            }
          ],
          praxis: "Publish one real finding from your Validator Session to the graph, complete with provenance, session date, and an IPFS-pinned method record, staked at an amount you can justify in writing.",
          evidence: "The observation term id, the three provenance term ids, the IPFS hash of the method record, the stake amount, the written justification for that amount, and the calendar entry for the review date.",
          glossary: ["attestation-publishing", "provenance-triple", "method-record", "review-date", "confidence-proportional-stake"],
          awards: ["published-attestor", "seal-of-the-commons"]
        },
        {
          id: "ch-intuition-attestor-keys",
          kind: "lab",
          title: "Key Management for a High-Reputation Attestor",
          statement: "Your attestor key is not protecting a balance; it is protecting a reputation that took years to build and can be spent in one transaction, so secure it against its value, not against its holdings.",
          minutes: 38,
          respect: 195,
          trust: 13,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The threat model is boring and that is the point",
              body: "Nobody is going to break the cryptography. They are going to phish an operator, compromise a developer endpoint, poison a dependency in your signing tooling, or wait for a laptop to be left unlocked. Chainalysis recorded personal wallet compromise at 23.35 percent of stolen-fund activity in the first half of 2025, and the largest theft of that period reportedly originated in a compromised developer environment rather than a contract defect. Map your controls to that reality: ATT&CK phishing and endpoint compromise techniques, not exotic cryptographic attacks."
            },
            {
              kind: "table",
              title: "Key tiering for an attestation programme",
              headers: ["Tier", "Purpose", "Storage", "Approval", "Rotation"],
              rows: [
                ["Cold identity anchor", "Owns the attestor identity atom; used to rotate operational keys", "Hardware wallet, offline, geographically split backup, never on a networked machine", "Two-person, in person, logged", "Only on compromise or personnel change"],
                ["Operational attestor", "Signs published findings", "Hardware wallet held by the on-duty validator, PIN-protected", "One named human plus a second reviewer for any stake above threshold", "Quarterly, or immediately on operator change"],
                ["Automation key", "Routine low-value writes from pipelines", "Cloud KMS or HSM-backed signer with per-call authorisation", "Policy-enforced spend caps, allowlisted predicates only", "Monthly, automated"],
                ["Read-only", "Everything else", "No key at all — GraphQL needs none", "None", "Not applicable"]
              ]
            },
            {
              kind: "code",
              title: "Enforce the policy in the signer, not in a document",
              lang: "typescript",
              body: "import { parseEther, type Hex } from 'viem';\n\ntype Policy = {\n  allowedPredicates: Set<Hex>;\n  maxStakePerWrite: bigint;\n  maxStakePerDay: bigint;\n  requireSecondApproval: bigint;\n};\n\nconst AUTOMATION_POLICY: Policy = {\n  allowedPredicates: new Set<Hex>([OBSERVED_ON, DERIVED_VIA, ASSERTED_BY]),\n  maxStakePerWrite: parseEther('0.5'),\n  maxStakePerDay: parseEther('5'),\n  requireSecondApproval: parseEther('0.25'),\n};\n\nexport async function guardedWrite(\n  policy: Policy,\n  spentToday: bigint,\n  intent: { predicateId: Hex; stake: bigint; approvals: string[] },\n) {\n  if (!policy.allowedPredicates.has(intent.predicateId)) {\n    throw new Error('predicate not permitted for this key tier');\n  }\n  if (intent.stake > policy.maxStakePerWrite) {\n    throw new Error('stake exceeds per-write cap');\n  }\n  if (spentToday + intent.stake > policy.maxStakePerDay) {\n    throw new Error('daily cap exhausted');\n  }\n  if (\n    intent.stake >= policy.requireSecondApproval &&\n    intent.approvals.length < 2\n  ) {\n    throw new Error('second approval required');\n  }\n  return true;\n}\n"
            },
            {
              kind: "prose",
              title: "The control most teams skip: capping the blast radius of your own key",
              body: "Assume the operational key is stolen tomorrow. What can the thief do with it before you notice. If the answer is publish anything, at any stake, under an identity everyone trusts, then your key hygiene is irrelevant because the loss is total on first use. The fix is not stronger storage; it is caps. Per-write stake limits, per-day limits, an allowlist of predicates the key may use, and a rate limit on how fast your own published weight can change. These are the same compensating controls you would demand of any privileged service account, and they are the reason the discontinuity detection from the laundering step works — a thief who must operate inside the caps moves slowly enough to be caught."
            },
            {
              kind: "checklist",
              title: "Attestor key audit",
              items: [
                "The identity anchor key has never touched a networked machine and its backup location is documented in a place that survives the departure of the person who set it up.",
                "Every operational signing action is attributable to a named human, and that attribution is recorded independently of the chain.",
                "Automation keys are allowlisted to specific predicates and cannot publish a high-stake claim even if fully compromised.",
                "There is an alert on any write from an attestor key outside its normal predicate mix, stake range, or time of day.",
                "The rotation procedure has been rehearsed end to end at least once, including publishing the rotation as an attestation from the anchor key.",
                "Revocation is documented: what you publish, in what order, and which external channels carry the same message.",
                "The recovery path does not depend on a single person, a single device, or a single cloud account."
              ]
            },
            {
              kind: "callout",
              title: "Rotation on a permanent ledger",
              body: "You cannot delete a compromised key's history. Rotation means publishing a new binding from the anchor identity and ensuring every consumer resolves the current operational key through the anchor rather than caching an address. Design that indirection on day one. Teams that bind reputation directly to an operational address discover during an incident that rotation and starting over are the same thing."
            }
          ],
          praxis: "Stand up the full key tiering for an attestor identity, implement the policy guard in the signing path, and rehearse one complete rotation from the anchor key.",
          evidence: "A key inventory with tier, storage, approver, and rotation date for each key; the committed policy-guard code with tests showing each rejection path; and a rotation rehearsal record including the term ids of the binding attestations published.",
          glossary: ["attestor-key", "key-tiering", "blast-radius", "identity-anchor", "key-rotation"],
          awards: ["cold-ledger", "key-keeper"]
        },
        {
          id: "ch-intuition-dispute-design",
          kind: "drill",
          title: "Designing the Challenge Window",
          statement: "A dispute process is a promise you make in advance to a stranger who will be angry, and if you can change it while they are angry it was never a process.",
          minutes: 28,
          respect: 180,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Three properties, all mandatory",
              body: "A challenge window must be pre-committed, so nobody including you can move it under pressure. It must be evidence-bearing, so that objecting costs the objector work and cannot be turned into a free denial-of-service. And it must be bounded in effect, so that a dispute changes the status of the disputed thing and nothing else — never the whole release, never every claim by the same attestor, never the entire region. Miss any one of the three and you have built a mechanism that will be used against you by the first competent adversary who reads it."
            },
            {
              kind: "compare",
              title: "Two dispute designs that look similar and behave nothing alike",
              left: {
                title: "Pause on objection",
                items: [
                  "Any dispute halts promotion of the disputed claim",
                  "Free to file, so filing scales with attacker patience",
                  "Effect boundary is often vague and creeps to the whole batch",
                  "Under sustained abuse, availability becomes a function of adversary effort",
                  "Feels fair, and is the default almost everyone builds"
                ]
              },
              right: {
                title: "Downgrade on evidence",
                items: [
                  "A dispute with a resolvable artefact moves the claim to held, and only that claim",
                  "Costs the disputant work, which does not round-trip",
                  "Effect boundary written into the rule and enforced in code",
                  "Under sustained abuse, the cost lands on the abuser and your output keeps shipping",
                  "Feels harsher, and is the one that survives year three"
                ]
              }
            },
            {
              kind: "principle",
              body: "Held is a status. Removed is a decision. Never let a dispute mechanism produce the second when it was designed to produce the first."
            }
          ],
          drill: {
            id: "ch-intuition-drill-dispute",
            scene: "You publish a weekly feed of contract safety statuses. Your published policy says an evidence-bearing dispute filed before the cut-off moves a subject to held for that week. Eleven minutes before cut-off, a well-known independent researcher disputes a safe status on a widely-deployed contract. Their artefact is a link to a private repository you cannot access, plus a credible description of a reentrancy path. They are usually right. Two of your largest customers gate deployments on this feed.",
            clock: "11 minutes to cut-off.",
            pressure: "The researcher is posting publicly as they wait. Your on-call engineer can technically edit the snapshot. Your policy says evidence-bearing; the evidence is not accessible to you.",
            prompt: "What ships at cut-off?",
            options: [
              {
                id: "opt-honour-safe",
                label: "Ship safe as scheduled. The artefact is inaccessible, so by the letter of the policy it is not evidence-bearing.",
                detail: "Deterministic, policy-compliant, and you can defend every word of it.",
                score: 0,
                outcome: "You ship a status you now personally doubt, to customers who gate deployments on it, on a technicality about repository access. The policy is upheld and the outcome is bad.",
                ripple: "If the researcher is right, your defence is that the evidence was in a private repository, which reads as procedural hiding to every person who reads it afterward. The letter of a policy has never once protected anyone whose judgement was visibly overridden by it."
              },
              {
                id: "opt-manual-hold",
                label: "Have the on-call engineer manually set that subject to held for this week.",
                detail: "Right outcome, right now, and only one subject is affected.",
                score: -2,
                outcome: "The right value ships by the wrong mechanism. You have established that a sufficiently prominent objector plus a sufficiently nervous on-call can move your published output outside the process.",
                ripple: "The precedent is the damage. Within two quarters, manual holds are routine, undocumented, and correlated with which disputant was loudest, and you cannot reconstruct why any historical value was what it was. This is how an auditable feed quietly becomes an unauditable one."
              },
              {
                id: "opt-apply-rule",
                label: "Apply the rule as written but on its actual intent: request the artefact under your published responsible-access path, and if it is not accessible by cut-off, ship the subject as held-pending-evidence rather than safe, because your policy already defines held as the status for unresolved evidence-bearing disputes.",
                detail: "Uses the mechanism, does not invent a new one, and puts the burden back on the disputant without ignoring them.",
                score: 3,
                outcome: "The subject ships as held. Customers see a status that accurately represents the state of your knowledge. The researcher retains the ability to resolve it by sharing the artefact, and the clock pressure disappears because held is a stable state rather than a decision.",
                ripple: "You discover that held-pending-evidence should have been a first-class status all along, and you add it formally with a defined maximum duration and an automatic escalation. The incident produces a mechanism improvement rather than an exception, which is the difference between a process that hardens and one that erodes.",
                isBest: true
              },
              {
                id: "opt-delay",
                label: "Delay the entire weekly publication until the dispute resolves.",
                detail: "Nobody gets a wrong answer, and it signals that you take researcher disputes seriously.",
                score: -3,
                outcome: "One disputant, filing eleven minutes before cut-off, just stopped your entire product. Every customer is affected by a dispute about one contract.",
                ripple: "You have publicly demonstrated the exact griefing surface, and it will be used. The cost of a full publication delay is now known to be one well-timed objection, and the next objections will not come from researchers acting in good faith."
              }
            ],
            debrief: "The best answer is not the clever one; it is the one that already existed. The policy defined held as the status for an unresolved evidence-bearing dispute, and the only question was whether an inaccessible artefact counts. Reading the rule on its intent rather than its letter is legitimate when the intent is documented and the reading is published; inventing an unwritten exception is not. Notice how the three failing options each break exactly one of the three mandatory properties: shipping safe breaks evidence-bearing by treating access friction as absence of evidence, the manual hold breaks pre-commitment, and the full delay breaks bounded effect. That is not a coincidence — nearly every real dispute failure you will ever see is one of those three properties giving way under time pressure. The eleven-minute clock is the adversary's actual tool here, and the structural fix is that held must be a stable resting state so that running out of clock never forces a decision.",
            principle: "Design your dispute process so that running out of time produces a status, never a verdict."
          },
          glossary: ["challenge-window", "evidence-bearing-dispute", "bounded-effect", "held-status", "pre-commitment"],
          awards: ["grief-proof", "process-architect"]
        }
      ]
    }
    ,
    {
      id: "ch-intuition-p5",
      title: "COMMAND THE COMMONS",
      credential: "Certified Commons Security Lead",
      summary: "The leadership Page. What you do when a false claim about your organisation acquires real money behind it, how you decide whether a problem belongs to the protocol or to the people, and how you explain a dependency you do not control to a board that will ask why you accepted it.",
      competencies: [
        "Run incident response for a reputational incident with a market attached.",
        "Separate protocol-layer defence from social-layer defence and choose deliberately between them.",
        "Brief a board on a critical dependency your organisation cannot govern.",
        "Design a progressive decentralization path for moderation authority with published exit criteria.",
        "Hold the line on methodology under commercial and public pressure."
      ],
      seal: "SEAL OF THE COMMONS",
      steps: [
        {
          id: "ch-intuition-false-claim-ir",
          kind: "lesson",
          title: "When a False Claim Acquires Economic Weight",
          statement: "A lie with money behind it is not a communications problem with a market attached; it is a market event with a communications problem attached, and the order matters for who leads.",
          minutes: 32,
          respect: 185,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "What is different about this incident type",
              body: "In a normal reputational incident, the false statement sits somewhere — a post, an article, a forum — and your options are correction, contact, and legal process. Here the false statement has a vault, a share price, holders with a financial interest in it remaining believed, and an index that mechanically propagates it into other people's decisions. Some of the people amplifying it are not malicious; they hold a position and are behaving rationally. That changes the response: you are not persuading an audience, you are changing the expected value of a position, and every action you take is read by holders as a signal about that value."
            },
            {
              kind: "timeline",
              title: "The first two hours, in order",
              items: [
                "Confirm the claim exists as stated. Read the triple directly, resolve all three atoms, and check whether the subject atom actually refers to your organisation or to something confusable with it. A surprising fraction of these are referent errors rather than attacks.",
                "Measure before you speak. Market cap, position count, top-three concentration, funding ancestry of the largest positions, and the age of the claim. Ninety minutes of misdirected panic has been caused by a large number that turned out to be one wallet.",
                "Determine the propagation path. Which indexes, products, or feeds consume this predicate, and on what refresh cadence. Your real deadline is the next downstream refresh, not the news cycle.",
                "Decide the classification: attack, error, or true-but-mischaracterised. The third is the most common and the most dangerous to handle as if it were the first.",
                "Activate the pre-authorised response. If you did not build one, you are now designing policy at speed with an audience, which is the condition under which every bad decision in this chapter gets made.",
                "Publish the signed denial through channels you already control, and only then consider anything on-chain.",
                "Notify consuming parties directly. The customers gating decisions on a feed that consumes this claim need a phone call, not a press statement."
              ]
            },
            {
              kind: "principle",
              body: "Your first on-chain action in an incident should be a signed statement, not a counter-stake. Speech establishes a record; capital establishes a contest, and you may not be able to win a contest."
            },
            {
              kind: "table",
              title: "Response options, honestly assessed",
              headers: ["Action", "What it achieves", "What it costs", "When it is right"],
              rows: [
                ["Signed denial published to your own channels and as an atom", "An authoritative, timestamped, portable record from the party with standing", "Almost nothing", "Always, immediately, in every classification"],
                ["Counter-stake from a pre-authorised, disclosed attestor budget", "Visible dissent inside the mechanism where consumers are looking", "Capital, and the appearance of buying your own truth if undisclosed", "When the claim is propagating into decisions and your denial alone is not visible in the consuming path"],
                ["Direct contact with consuming products", "Stops the propagation at the point where it causes harm", "Relationship capital and a difficult conversation", "Always, and earlier than feels comfortable"],
                ["Public evidence release", "Converts assertion into verifiable fact", "May disclose more than you wanted; irreversible", "When you have evidence that is genuinely dispositive and safe to release"],
                ["Legal action against the attestor", "Deterrence, and sometimes attribution", "Slow, expensive, and streisand risk is real", "Only when the actor is identifiable, the harm is quantified, and you have accepted the amplification"],
                ["Requesting protocol-level removal", "Nothing. There is no such mechanism", "Credibility, immediately and permanently", "Never"]
              ]
            },
            {
              kind: "prose",
              title: "The disclosure rule that makes counter-staking survivable",
              body: "If you counter-stake, do it from a named, pre-declared organisational attestor identity, with the budget and authority published before the incident, and say plainly that you are the subject of the claim. A disclosed interested party staking against a claim about itself is a normal and legitimate act, and readers can weight it accordingly. An undisclosed one is manipulation, and it will be discovered because every position is public forever. The entire difference between those two outcomes is a paragraph you write in peacetime."
            },
            {
              kind: "callout",
              title: "Structure the runbook against SP 800-61r3",
              body: "This is an incident, so run it like one: preparation, detection and analysis, containment, eradication and recovery, post-incident activity, all mapped to CSF 2.0 functions. The only unusual part is that containment here means limiting propagation into decisions rather than limiting access, and eradication is not available at all — the claim is permanent. Recovery is what you build instead, and it is measured in whether downstream consumers reached the right decision, not in whether the vault balance changed."
            }
          ],
          glossary: ["reputational-incident", "propagation-path", "disclosed-counter-stake", "pre-authorised-response", "containment"],
          awards: ["false-claim-responder"]
        },
        {
          id: "ch-intuition-ir-drill",
          kind: "drill",
          title: "02:40 — The Claim That Cannot Be Deleted",
          statement: "In the first hour of a permanent-record incident, the only irreversible mistakes available are the ones you make yourself.",
          minutes: 30,
          respect: 200,
          trust: 13,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Before you choose",
              body: "Read the scene twice. Ask what is actually time-critical and what merely feels urgent because it is dark and someone is awake and angry. Then notice which of the four options changes the state of the world irreversibly, and hold those to a much higher standard than the ones that do not."
            },
            {
              kind: "metric",
              title: "The number that should shape your read of the scene",
              body: "Two hundred thousand in a vault sounds enormous at 02:40 and is a moderate position in market terms. What matters far more is that it sits across four addresses, all funded within seventy-two hours from one source. That is not a market's belief about you. That is one actor with a chequebook, and the correct response to one actor is not the correct response to a market."
            }
          ],
          drill: {
            id: "ch-intuition-drill-false-claim",
            scene: "02:40 local. Your on-call is paged: a triple asserting that your company suffered an unreported customer-data breach has accumulated roughly two hundred thousand dollars equivalent in its FOR vault over six hours, across four addresses funded from a single source in the last three days. The claim is false; you have complete telemetry for the period named. A security newsletter with a large readership has emailed asking for comment before its 07:00 send. Two enterprise customers consume a risk feed that ingests this predicate family and refreshes at 06:00.",
            clock: "Newsletter deadline 07:00. Downstream feed refresh 06:00. It is 02:40.",
            pressure: "Your CEO is awake and wants it gone. Your comms lead wants a statement in ten minutes. Nobody has yet looked at who the four addresses are.",
            prompt: "What is your first action?",
            options: [
              {
                id: "opt-treasury-war",
                label: "Counter-stake from the corporate treasury immediately, at scale, to flip the vault before the 06:00 refresh.",
                detail: "Directly addresses the mechanism that will propagate the claim, and the money is recoverable.",
                score: 0,
                outcome: "The ratio flips before the refresh. You have also placed an undisclosed corporate position against a claim about your own company, at 03:00, with no authority documented in advance, decided by whoever was awake.",
                ripple: "The position is public and permanent. When a journalist eventually maps it, the story becomes that the company bought down an accusation about itself in the middle of the night. It does not matter that the accusation was false; the action is indistinguishable from what a guilty company would have done, and you have destroyed your ability to use the same tool honestly later."
              },
              {
                id: "opt-signed-denial",
                label: "Publish a signed denial through your existing trusted channels and as an attestation from your declared organisational identity, notify the two consuming customers directly, and give the newsletter a factual on-record statement with the telemetry basis.",
                detail: "Establishes the authoritative record from the party with standing, in every channel that matters, before the refresh and before the send.",
                score: 3,
                outcome: "By 04:30 there is a timestamped, signed denial with a stated evidentiary basis in your channels, on the graph, in the hands of both affected customers, and with the newsletter. The claim still exists and still has money behind it, and it is now permanently accompanied by a first-party denial that anyone querying the subject will see.",
                ripple: "The newsletter runs the story as a disputed claim with your statement, which is a non-story. The customers' risk teams have what they need before their own morning. Because you used the declared organisational identity, the counter-stake you authorise at 09:00 through the normal process is legible as a disclosed interested party rather than as a night-time defensive purchase.",
                isBest: true
              },
              {
                id: "opt-protocol-ask",
                label: "Contact the protocol team and the indexer operator to request removal or suppression of the triple before 06:00.",
                detail: "If it can be suppressed at the source, everything downstream is solved at once.",
                score: -3,
                outcome: "There is no removal mechanism on-chain, and asking an indexer operator to suppress a claim about the party doing the asking is a request they should and will refuse. You have spent the most valuable hour of the incident on an impossible ask and created a written record of having attempted it.",
                ripple: "The request leaks, because requests like this always do. The story is now that the company tried to have the accusation censored, which is a far better story than the original claim and one that survives being false. You also missed the 06:00 refresh entirely."
              },
              {
                id: "opt-silence",
                label: "Say nothing until business hours. Attestations decay, the claim is false, and responding at 03:00 amplifies it.",
                detail: "Avoids amplification, avoids a rushed statement, and lets a rested team make a considered decision.",
                score: -2,
                outcome: "The 06:00 refresh propagates the claim into two enterprise risk feeds unchallenged, and the 07:00 newsletter runs with no comment from you, which reads as confirmation to a substantial fraction of its readers.",
                ripple: "By the time you respond you are correcting a claim that has already entered other organisations' systems of record, and removing something from an enterprise risk register is far harder than keeping it out. Attestations do not decay on a permanent ledger; they sit there being queryable forever, and the absence of a first-party denial in the record is itself permanent."
              }
            ],
            debrief: "The winning move is speech, not capital, and it is winning because of what it makes possible later rather than what it achieves immediately. A signed first-party denial costs nothing, is irreversible in the good direction, and — critically — it preserves your option to counter-stake through the normal disclosed process in daylight. The treasury option scores zero rather than negative because it does address the real propagation mechanism, and that is exactly what makes it dangerous: it is the option a competent person picks for a good reason and cannot undo. The protocol-removal request is the worst answer available and it is the one most frequently attempted by organisations meeting this incident for the first time, because it maps onto every takedown process they have ever used. Silence fails on a specific, checkable fact: the downstream refresh at 06:00 is before business hours, and incidents run on the adversary's calendar and your dependents' calendars, never on yours. Note the shape of the whole drill — three of four options are attempts to change the claim, and the correct one accepts that the claim is permanent and competes with it instead.",
            principle: "On a permanent ledger you cannot subtract. You can only add, faster and more credibly, from an identity that has standing."
          },
          glossary: ["signed-denial", "propagation-deadline", "first-party-record", "takedown-fallacy"],
          awards: ["false-claim-responder", "cool-head"]
        },
        {
          id: "ch-intuition-two-courts",
          kind: "council",
          title: "Protocol Court, Social Court",
          statement: "Every problem in a commons can be argued in two places, and choosing the wrong one wastes months — the protocol court decides what is possible and the social court decides what is acceptable.",
          minutes: 30,
          respect: 175,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The distinction, stated precisely",
              body: "Protocol-layer defence changes what an actor can do: parameters, contract logic, cryptographic constraints, code you control in your own consuming application. Social-layer defence changes what an actor is willing to do, or what the community will tolerate: norms, disclosure expectations, reputation consequences, published methodology, the professional cost of being caught. Protocol defences are enforceable and inflexible. Social defences are flexible and unenforceable. Almost every serious failure in commons governance comes from someone trying to solve a social problem with a protocol change or a protocol problem with a blog post."
            },
            {
              kind: "compare",
              title: "Sorting problems to the right court",
              left: {
                title: "Protocol court",
                items: [
                  "Wash attestation detection — computable from data, so encode it in your scoring",
                  "Blast radius of a compromised attestor key — caps and allowlists in the signer",
                  "Griefing your release train — bounded-effect dispute rules enforced in code",
                  "Slippage and unbounded-loss writes — minShares and minAssets, always set",
                  "Indexer divergence — dual-read verification in the pipeline"
                ]
              },
              right: {
                title: "Social court",
                items: [
                  "What a predicate means and whether its usage has drifted",
                  "Whether an interested party disclosed their position",
                  "Whether a finding was published responsibly",
                  "Whether an attestor who was badly wrong acknowledged it",
                  "What evidence standard a professional community expects before an allegation"
                ]
              }
            },
            {
              kind: "principle",
              body: "If the harm is computable, build it into code and stop arguing. If the harm is a matter of judgement, put it in front of people and stop pretending code can decide it."
            },
            {
              kind: "prose",
              title: "The council skill: arguing in the right register",
              body: "In the protocol court you win with a specification, a cost model, and a test. Bring feelings and you will be dismissed, correctly. In the social court you win with a clearly stated norm, a concrete example, and a personal willingness to be held to the same standard first. Bring a specification and you will be ignored, also correctly, because nobody adopts a norm because it was well-formatted. The most common failure among technically excellent security leaders is arguing in the protocol register in a social forum: presenting a table of attack costs to a community that is actually deciding whether it trusts you. Establish standing first, then evidence. In the other direction, the most common failure among excellent communicators is bringing consensus to an engineering decision that had a correct answer."
            },
            {
              kind: "numbered",
              title: "How to open a social-layer case that actually lands",
              items: [
                "State the norm you are proposing in one sentence a non-specialist can repeat, before any evidence.",
                "Apply it to yourself first, publicly, including a case where it would have constrained you. Nothing else buys standing this cheaply.",
                "Bring one concrete, verifiable example, not five. Five examples reads as a campaign and invites argument about the weakest one.",
                "Name the cost of the norm honestly, including who it disadvantages. A proposal with no stated cost is read as either naive or dishonest, and both readings are fatal.",
                "Propose the smallest enforceable version, not the ideal one. Norms are ratchets; you get to tighten later, and you almost never get to loosen.",
                "Leave a path for people who are currently violating it to comply without humiliation, because the ones you most need are the ones most exposed."
              ]
            },
            {
              kind: "callout",
              title: "The trap",
              body: "Protocol changes feel like progress because they are legible and shippable. Social changes feel like talking. But every protocol control you add narrows what honest participants can do as much as what attackers can do, and unlike attackers, honest participants have somewhere else to go. Reach for the social court more often than your instincts suggest, and reserve protocol changes for harms you can compute."
            }
          ],
          glossary: ["protocol-layer-defence", "social-layer-defence", "norm-setting", "standing", "governance-register"],
          awards: ["two-courts", "board-voice"]
        },
        {
          id: "ch-intuition-board",
          kind: "council",
          title: "Briefing the Board on a Dependency You Do Not Control",
          statement: "The board does not need to understand bonding curves; they need to know what decision this thing makes for you, what happens when it is wrong, and why that is an acceptable trade.",
          minutes: 28,
          respect: 180,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The question you will actually be asked",
              body: "Not how does it work. The question is: we depend on a public system nobody in this company governs, so what happens to us when it is wrong, and why did you accept that. Every minute you spend on protocol mechanics before answering that is a minute the board spends deciding you have not thought about the risk. Lead with the dependency, the failure mode, the bound on the damage, and the control. Mechanics go in the appendix and stay there unless someone asks."
            },
            {
              kind: "numbered",
              title: "The six-slide structure",
              items: [
                "The dependency in one sentence. We consume community attestations about third-party software to prioritise our review queue. Name the decision it influences and the decision it does not.",
                "The failure mode in one sentence, with the worst realistic case, not the worst imaginable one. A well-funded false claim causes us to deprioritise a genuine risk for up to one review cycle.",
                "The bound. What stops it being worse: corroboration requirements, the fact that no single claim can move a control decision alone, the cap on how fast any identity's weight can change our output.",
                "The cost to attack, from your model, with the assumptions visible. This is the slide that changes the conversation, because it converts an unfamiliar risk into a number the board already knows how to reason about.",
                "The alternative, priced. What it would cost to replace this input with an internal capability or a commercial feed, and what we would lose. Boards distrust a dependency presented without an alternative because it reads as unexamined.",
                "The trigger. The specific, pre-agreed condition under which we stop consuming this input, and who has authority to pull it without a meeting."
              ]
            },
            {
              kind: "table",
              title: "Translating the technical finding into the register a board uses",
              headers: ["What you found", "What you must not say", "What lands"],
              rows: [
                ["Concentration ratio 0.87 on the top claims", "The vault is concentrated", "Most of the apparent consensus in this data is one funder. We treat it as a lead, not a verdict."],
                ["Recoverable stake means low cost of corruption", "Deposits are recoverable so cost of corruption is low", "Manipulating this signal costs an attacker a few percent of the money they put up, and they get the rest back. So we never let it decide anything alone."],
                ["Indexer lag averages nine seconds", "There is indexer lag", "The data we read is seconds behind the source of truth, which is fine for our use and would not be for a real-time control."],
                ["AnyTrust committee data availability", "It uses a DAC", "A committee, not the whole network, guarantees the data stays retrievable. That is a normal design and we keep our own copy of what we depend on."],
                ["No slashing exists at the protocol layer", "There is no slashing", "Nobody loses money for being wrong here, only for trading badly. So the system rewards conviction, not accuracy, and our scoring corrects for that."]
              ]
            },
            {
              kind: "principle",
              body: "A board briefing on an uncontrolled dependency is judged on one thing: whether you knew the failure mode before it happened. Everything else is supporting material."
            },
            {
              kind: "prose",
              title: "The question that ends bad briefings",
              body: "Sooner or later a director asks: if this is so easily manipulated, why do we use it at all. The weak answer is a defence of the technology. The strong answer is comparative and immediate: because the alternatives are a vendor feed with the same problems and no transparency, an internal team we would need to fund at some stated cost, or nothing. This input is transparent enough that we can audit it ourselves, which is more than the commercial alternatives allow, and we have bounded what it can do to us. That answer works because it treats the board as capable of a trade-off decision, which is the thing boards are for."
            },
            {
              kind: "callout",
              title: "Anchor to a framework the board already accepts",
              body: "Put the whole thing under the GOVERN function of NIST CSF 2.0 and state the target profile for third-party attestation inputs explicitly. Boards do not want a new mental model for every emerging technology, and a director who already knows CSF will engage with a GOVERN framing in seconds. Keep proportion too: the 2026 DBIR has software vulnerabilities as the leading initial access route at 31 percent and ransomware in 48 percent of breaches. If your graph programme is consuming attention out of proportion to those numbers, say so before someone else does."
            }
          ],
          glossary: ["board-briefing", "dependency-risk", "pre-agreed-trigger", "csf-govern", "comparative-justification"],
          awards: ["board-voice", "two-courts"]
        },
        {
          id: "ch-intuition-progressive",
          kind: "field",
          title: "Progressive Decentralization of Moderation",
          statement: "Every credible commons starts centralized and admits it; the ones that survive publish the exit criteria on day one and are then held to them.",
          minutes: 40,
          respect: 210,
          trust: 14,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Why you start centralized and why you must say so",
              body: "A new graph region has no reputation history, no attestor track records, and no basis for weighting anyone. Any decentralized moderation scheme launched into that condition is either Sybil-captured immediately or so restrictive that nobody participates. So you start with your team deciding, which is honest and correct. The failure is not centralization; the failure is centralization that is never named, has no published end state, and quietly becomes permanent because the people holding the authority are the ones who would have to give it up."
            },
            {
              kind: "timeline",
              title: "The four phases, with the criterion that ends each",
              items: [
                "PHASE ONE, CUSTODIAL. Your team makes every curation decision, publishes every decision with its reason, and holds no undisclosed positions. Ends when there are enough independent attestors with measurable track records to weight, and you have published what measurable means.",
                "PHASE TWO, ADVISORY. A named external panel reviews decisions and their dissents are published alongside outcomes. You still decide. Ends when panel dissent rate stabilises and you can show that you changed a decision because of the panel at least a few times — if you never did, the panel is decoration and the phase has not actually happened.",
                "PHASE THREE, DELEGATED. Defined decision classes move to the panel or to a weighted attestor set, with your team holding only a narrow, published veto for specific enumerated harms. Ends when the veto has gone unused for a stated period under real load.",
                "PHASE FOUR, COMMONS. Decisions are made by the weighted attestor set under published rules. You are a participant with disclosed positions and no special authority. Ends never, but requires a standing process for rule change and a published record of who holds weight."
              ]
            },
            {
              kind: "principle",
              body: "Publish the exit criterion for each phase before you enter it. A phase with no exit criterion is not a phase; it is a permanent arrangement wearing a roadmap."
            },
            {
              kind: "table",
              title: "What must be public at every phase, from day one",
              headers: ["Artefact", "Why it cannot wait", "Failure if omitted"],
              rows: [
                ["The current phase, named", "Participants must know whether their input is advisory or binding", "People contribute under a false belief about their influence and leave angry when they discover it"],
                ["Exit criteria for the current phase", "It is the only thing that makes the roadmap enforceable", "Indefinite custody with a roadmap that is always one phase from starting"],
                ["The decision log with reasons", "Precedent is the only thing that makes discretionary moderation reviewable", "Inconsistent decisions that cannot be defended or learned from"],
                ["Conflict-of-interest disclosures for every decision-maker", "You are asking people to trust judgement they cannot verify", "One discovered undisclosed position invalidates every past decision at once"],
                ["The appeal path and who hears it", "Discretion without appeal is not governance", "Every dispute escalates to public pressure because there is nowhere else for it to go"],
                ["Capture metrics", "Decentralization can be reversed silently by concentration", "You reach Phase Four and hand authority to a set that is three people in a trench coat"]
              ]
            },
            {
              kind: "prose",
              title: "The metric that tells you whether you actually decentralized",
              body: "Not the number of participants. Not the number of attestors. Measure the concentration of decisive weight: what fraction of outcomes would change if the top three independent clusters were removed. If that fraction is high, you have distributed participation and centralized power, which is the most common outcome and the one that looks best on a dashboard. Track it from Phase One, publish it from Phase Two, and treat a rise in it as an incident rather than as a market development. The honest version of this work is that most projects that claim Phase Four are in Phase Three with better branding, and the only defence against becoming one is a metric you committed to before you knew what it would say."
            },
            {
              kind: "checklist",
              title: "The commitment you publish at launch",
              items: [
                "Current phase, named, with the date it began.",
                "Exit criteria for this phase, stated so that a hostile reader could verify whether they have been met.",
                "Who holds decision authority today, by name and role, and what their disclosed positions are.",
                "The decision log location and its update cadence.",
                "The appeal path, its timeline, and who hears appeals.",
                "The capture metric, its current value, and where it is published.",
                "What would cause you to move backward a phase, which is the credibility test almost nobody passes."
              ]
            }
          ],
          praxis: "Write and publish the phase commitment for a real curated region — a registry, a list, a feed, or an internal graph your organisation would operate — including exit criteria a hostile reader could verify, and stand up the capture metric so it produces a number today.",
          evidence: "The published commitment document with a date, the current capture-metric value with the method used to compute it, the first entries of the decision log with reasons, and the written answer to the backward-movement question. Attach the term ids if you published any part of it as attestations.",
          glossary: ["progressive-decentralization", "capture-metric", "exit-criteria", "decision-log", "conflict-disclosure"],
          awards: ["seal-of-the-commons", "commons-steward", "two-courts"]
        }
      ]
    }
  ]
};
