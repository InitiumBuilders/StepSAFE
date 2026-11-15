import type { UnitMember } from "./schema";

export const UNIT: UnitMember[] = [
  {
    id: "u-seva",
    callsign: "SEVA",
    role: "Praxis Guide",
    title: "The One Who Stays",
    phase: 1,
    essence: "gold",
    bio: "Seva has spent nineteen years inside other people's worst weeks. Six as the on-call systems engineer at a payment processor where the security team was one person and that person was on annual leave. Four running detection for a European bank that learned about its own intrusion from a journalist with a deadline. Nine as a CISO twice over, once at a company that survived it and once at a company that did not. Seva has signed a breach notification with their own name at the bottom, and has sat in the room where a general counsel decided what the word contained was going to mean. What Seva teaches is not how to be right. It is how to be useful while uncertain, which is the only condition this work is ever performed in. The blind spot is deliberate and it is still a blind spot: Seva will let you walk into a mistake they can see arriving, because they believe a scar teaches faster than a warning. They are not always correct about which mistakes leave scars and which leave craters. More than one student has paid for that judgement, and Seva remembers each of them by name.",
    doctrine: "I will not hand you the answer while you can still afford the lesson.",
    strengths: [
      "Reads an organization's real power map in under a week: who decides, who merely signs, and who can quietly veto",
      "Converts a technical finding into a single sentence a board will act on without needing a translator",
      "Treats calm as a deployable operational resource rather than a personality trait",
      "Names which controls are theatre in your specific environment, out loud, before you have spent the budget"
    ],
    leverages: [
      {
        member: "u-keeper",
        how: "Seva refuses to be the second signature on anything Keeper holds. That refusal is the forcing function that makes you build a real quorum instead of a convenient one, and it is the first time the learner is told no by their own design."
      },
      {
        member: "u-anchor",
        how: "Seva trains Anchor to stop touching keyboards. The hardest thing an incident commander ever learns is that their hands are the least valuable thing they bring into the room, and almost nobody learns it without someone older watching them fail to delegate."
      },
      {
        member: "u-compass",
        how: "Seva hands Compass the political read: who will fund what, in which quarter, and which executive says yes in meetings and no in budgets. Compass can then sequence a roadmap that survives contact with a real finance cycle instead of an idealized one."
      },
      {
        member: "u-unitium",
        how: "Everything Seva does is engineered toward its own obsolescence. The measure of a guide is not how much the unit depends on them but the day the unit routes around them without noticing, and Unitium is that day made structural."
      }
    ],
    unlockedBy: "Granted at the first step. You do not earn Seva. Seva is the reason there is a first step.",
    firstWords: "You are the entire security team. That is not a tragedy, it is a measurement, and it is the only honest number you currently have. Put the framework down. Write me three lines on paper: the three things that could end this company by Friday. We start there, and we do not touch a tool until those three lines are true.",
    evolvesTo: "u-unitium"
  },
  {
    id: "u-keeper",
    callsign: "KEEPER",
    role: "Key Custody and Cryptographic Engineering",
    title: "The Second Signature",
    phase: 1,
    essence: "violet",
    bio: "Keeper came up in payments hardware: eleven years of PIN blocks, key blocks and FIPS 140 boundaries, where a mistake is measured in interchange fees and regulatory attention. Then five years running the offline root for a certificate authority whose ceremonies were filmed, witnessed, notarised and archived. They have opened a tamper-evident bag in front of an auditor and found the seal number did not match the ceremony log, and they have written the incident report that followed, which took eleven weeks and ended three vendor relationships. Keeper thinks in split knowledge and dual control because they have watched a single-custodian design fail in exactly the manner everyone had assured them it would not. The blind spot is availability. Keeper will design a custody scheme so resistant to compromise that nobody can actually operate it at three in the morning during an outage, and they have twice been the direct reason a recovery took nine hours instead of forty minutes. They know this about themselves. They still lean that way, and the leaning has to be argued with every single time.",
    doctrine: "A key one person can use alone is a key one person can lose alone.",
    strengths: [
      "Designs M-of-N quorums that account for holiday, illness, resignation and geography, not only for malice",
      "Runs a key ceremony that produces evidence an auditor and a court can both read years later",
      "Knows the difference between a key that is backed up and a key that is genuinely recoverable by people who are still employed",
      "Chooses boring, reviewed cryptography and can explain precisely why the exciting option is not ready for your threat model",
      "Builds rotation paths before deployment, because a key that cannot be rotated is a key you will one day be unable to abandon"
    ],
    leverages: [
      {
        member: "u-vault",
        how: "Keeper gives Vault a signing path where the transaction a human approves and the transaction that gets broadcast are provably the same object. In February 2025 Bybit lost roughly 1.5 billion dollars in the gap between those two things, with a compromised interface showing signers a transaction that was not the one they were authorizing."
      },
      {
        member: "u-cartographer",
        how: "Keeper turns Cartographer's validator fleet from a scatter of hot signing keys into a remote-signing architecture with real slashing protection, so a bad deploy costs liveness rather than principal. That single architectural move changes the worst case from a solvency event into a bad afternoon."
      },
      {
        member: "u-signal",
        how: "Keeper anchors Signal's attestations in keys whose provenance and custody are documented. Without that anchor a trust graph is a rumour with a signature attached, and the signature makes it worse because it looks like evidence."
      },
      {
        member: "u-seva",
        how: "Keeper is the first person in the learner's world who can say no and make it hold, because the cryptography enforces the no rather than the org chart. That single relationship is the mechanism by which a solo operator becomes an organization."
      }
    ],
    unlockedBy: "Run your first real key ceremony with an independent witness, evidence that survives an audit, and a recovery path someone else can execute without you.",
    firstWords: "Show me the recovery procedure before you show me the key. If you cannot tell me who receives the fragments when you are dead, unreachable, or fired in anger on a Tuesday, then you do not have custody. You have a hobby with a hardware budget.",
  },
  {
    id: "u-lantern",
    callsign: "LANTERN",
    role: "Detection Engineering Lead",
    title: "The One Who Sees First",
    phase: 2,
    essence: "cyan",
    bio: "Lantern did four years on a tier-two console for a managed provider, closing four hundred alerts a shift, and learned the thing that console teaches: the real adversary is not the intruder, it is the queue. Then six years building detection as code at a cloud company, where rules live in version control, get peer review, and pass a CI job that fires a synthetic true positive against every merge. Lantern once inherited a library of just over four hundred rules and shipped a quarter of that number with materially better coverage, purely by deleting everything that could not articulate its own blind spots. They write to the Palantir ADS shape without apology: goal, ATT&CK categorization, strategy abstract, technical context, blind spots and assumptions, false positives, validation, priority, response. An alert nobody can explain at three in the morning is not a detection, it is a liability with a severity field. The blind spot: Lantern hates noise more than they fear a miss. They have deleted a loud, ugly, poorly-behaved rule that happened to be the organization's only coverage for a technique, and the technique came back eight months later through the exact hole they had tidied up.",
    doctrine: "If I cannot write down how this rule fails, I have not finished writing the rule.",
    strengths: [
      "Ships detections that document their own blind spots, known false positives and a validation procedure a peer can execute",
      "Maps coverage to ATT&CK honestly, including the techniques where coverage is a hopeful colour on a heatmap and nothing else",
      "Instruments the log pipeline before writing the rule, because a detection over a broken feed is a lie with a dashboard in front of it",
      "Measures alert quality by time to triage and by analyst trust, never by volume, because volume is the metric that rewards the wrong work"
    ],
    leverages: [
      {
        member: "u-mirror",
        how: "Mirror executes the technique and Lantern finds out whether the rule fires or merely exists. Every detection shipped without an adversary having run against it in the real estate is a hypothesis wearing the costume of a control."
      },
      {
        member: "u-anchor",
        how: "Lantern's response section becomes Anchor's first ten minutes. A detection that arrives with triage steps and technical context already attached compresses an incident more than any tool purchase in the catalogue, because it removes the orientation phase entirely."
      },
      {
        member: "u-cartographer",
        how: "Cartographer tells Lantern which telemetry is even reachable in a decentralized estate, where there is no agent to install, no EDR to query, and the only ground truth is the chain itself plus whatever a peer chooses to log."
      },
      {
        member: "u-hearth",
        how: "Hearth feeds Lantern the help-desk verification failures that never resemble malware. Credential abuse was the single largest initial access vector in the 2025 DBIR at 22 percent, and almost none of it looks like an exploit on a wire."
      }
    ],
    unlockedBy: "Ship one detection with documented blind spots, a validation procedure a peer executes without your help, and a response runbook that survives a real page.",
    firstWords: "Before I write a single rule, show me your retention window and your field coverage. I have watched three separate teams buy a SIEM to solve a problem that turned out to be a missing agent configuration and ninety days of history they never had. Tooling cannot detect events you did not record.",
  },
  {
    id: "u-forge",
    callsign: "FORGE",
    role: "Application and Supply Chain Security Engineer",
    title: "The One Who Paves the Path",
    phase: 2,
    essence: "ember",
    bio: "Forge spent seven years as a platform engineer before ever holding a security title, which is precisely why they are effective: they know from the inside that a control developers can route around will be routed around, cheerfully, by good people under deadline pressure, and that this is a design failure rather than a discipline failure. They built the signing and provenance pipeline at a fintech, reaching SLSA build track level two in the first week and level three eleven months later, using cosign with Fulcio and a Rekor transparency log because keyless signing removed the one thing nobody in the company wanted to own, which was a long-lived signing key sitting in CI. Forge runs a security champions network of nineteen engineers and can tell you what each of them personally cares about, because the network is built on individuals and therefore survives reorganizations. The blind spot: Forge believes the paved road wins on merit. It does not. It wins on defaults. Forge is chronically slow to escalate when a team opts out, preferring to persuade for one more quarter, and in that quarter the exception quietly becomes the standard.",
    doctrine: "Make the secure path the shortest path, then measure precisely who still takes the other one.",
    strengths: [
      "Builds provenance that is verified at admission time rather than a signature generated and never checked",
      "Reads a dependency graph for blast radius and reachability instead of counting CVEs into a report nobody actions",
      "Turns a scanner's output into the small number of findings that are actually true and actually exploitable here",
      "Runs a champions network built on named individuals, so it survives reorganizations that would kill a structural program",
      "Treats CI runners and build machines as production, because they are the highest-value target in most estates and the least monitored"
    ],
    leverages: [
      {
        member: "u-keeper",
        how: "Keeper removes Forge's signing keys from CI entirely. Keyless, short-lived, OIDC-bound identities mean a compromised runner steals a ten-minute credential instead of stealing the organization's ability to be trusted by its own customers."
      },
      {
        member: "u-lantern",
        how: "Forge's build provenance hands Lantern something almost unheard of in detection: a high-fidelity, low-volume signal. An artifact running in production with no matching provenance record is a single alert that is always worth waking a human for."
      },
      {
        member: "u-vault",
        how: "Forge extends build integrity to contract deployment, so the bytecode on chain is provably the bytecode that was reviewed. The gap between what an auditor read and what actually shipped is measured in weeks of drift, and it is where a surprising share of losses actually live."
      },
      {
        member: "u-oracle",
        how: "Forge extends supply chain thinking to model weights, adapters, system prompts and tool schemas, which are dependencies with real blast radius that no SBOM format currently describes in any useful way."
      }
    ],
    unlockedBy: "Produce verifiable build provenance for one real service and enforce it at admission, so an unsigned artifact cannot run.",
    firstWords: "Where does your build sign, and who can reach that machine? I do not want the architecture diagram. I want the list of human beings with push access to the thing that makes your artifacts trustworthy, and I want to know which of them still work here.",
  },
  {
    id: "u-anchor",
    callsign: "ANCHOR",
    role: "Incident Commander",
    title: "The One Who Holds the Room",
    phase: 2,
    essence: "ember",
    bio: "Anchor was an SRE for eight years, until an outage where three engineers independently restarted the same service and made the incident longer than it needed to be. They carried the Google incident-management structure into security with them, incident commander, operations lead, communications lead, planning, and then learned the harder lesson: a security incident inverts the reliability instinct. In reliability you mitigate first and investigate afterward. With a live adversary in the estate, remediating before you understand scope tells them exactly what you know and hands them the next move for free. Anchor now runs forensics, reverse engineering and hunting as three parallel tracks, and will not authorize a mass credential reset until the hunt has produced a boundary. The blind spot: Anchor stays in the chair too long. They know the twelve-hour rule, they enforce it rigorously on everyone else, and they have twice personally run an incident into hour twenty-six because handing over felt like abandonment. The quality of the decisions made in hours nineteen through twenty-six is not a subject Anchor enjoys discussing, and both times the postmortem found one.",
    doctrine: "My hands are the least valuable thing I bring. My attention is the most, and it is finite.",
    strengths: [
      "Separates command from execution and keeps commanding even when the technical work is far more interesting than the coordination",
      "Runs investigation and remediation in parallel without letting remediation reveal the response to a watching adversary",
      "Enforces handoffs, food and sleep as operational controls with measurable effects, not as acts of kindness",
      "Writes a status update that an executive, a lawyer and an engineer can each act on from the same three paragraphs",
      "Says the words I do not know yet, with a time by which they will know, instead of hedging into false confidence"
    ],
    leverages: [
      {
        member: "u-lantern",
        how: "Anchor hands Lantern the forensic detail that converts one incident into permanent coverage. The detections that matter most in any organization are almost always the ones written in the fortnight after a real intrusion, while the ground truth is still warm."
      },
      {
        member: "u-voice",
        how: "Anchor gives Voice a factual spine with explicit confidence levels attached: what is known, what is believed, what remains unknown and by when. External statements built on that spine do not need retracting, and a retraction costs more trust than the original bad news."
      },
      {
        member: "u-tide",
        how: "Anchor decides when investigation stops and recovery begins, and that decision is only survivable because Tide has made it reversible. A commander who trusts recovery contains aggressively; a commander who does not hesitates, and scope grows inside the hesitation."
      },
      {
        member: "u-hearth",
        how: "Hearth manages the human end of the incident: the employee whose account was used, who is frightened, and who is far more valuable as a cooperating witness than as a suspect being managed by legal."
      }
    ],
    unlockedBy: "Command a live-fire exercise from first page to written postmortem without once touching a terminal yourself.",
    firstWords: "Who is operations lead, who is communications, and who is writing things down? No, do not tell me what the alert says yet. Names first, roles first. I have lost more time to four capable people fixing the same thing in four directions than I have ever lost to an adversary.",
  },
  {
    id: "u-ledger",
    callsign: "LEDGER",
    role: "Risk and Governance Lead",
    title: "The One Who Prices It",
    phase: 2,
    essence: "gold",
    bio: "Ledger did six years in internal audit at an insurer, which is where they learned that most risk registers are a colour scheme with a spreadsheet attached and a governance meeting stapled to the back. They retrained on FAIR, factor analysis of information risk, and now will not accept a risk statement that fails to name a threat actor, an asset, an effect and a frequency. Ledger runs Monte Carlo simulations to produce loss exceedance curves and takes them into board rooms with the caveat stated first rather than buried: the curve is only ever as good as the calibration behind its inputs. Since CSF 2.0 elevated Govern to a first-class function rather than an implied background condition, Ledger has had a far easier time explaining why risk appetite must be written down and approved before anyone is allowed to argue about a specific control. The blind spot: Ledger loves the model. Offered a rough number they can defend and an elegant simulation resting on three uncalibrated expert estimates, they have reached for the simulation more than once, and been quietly, confidently wrong to four significant figures.",
    doctrine: "A risk you cannot state as a frequency and a magnitude is an opinion wearing a suit.",
    strengths: [
      "Converts a technical exposure into a defensible annualized loss range that survives a hostile finance review",
      "Writes a risk appetite statement a board will genuinely approve and can later be held to in writing",
      "Calibrates estimators so the numbers come from trained judgement rather than from confidence and seniority",
      "Distinguishes the compliance obligation that is genuinely binding from the one that is a vendor's marketing department"
    ],
    leverages: [
      {
        member: "u-compass",
        how: "Ledger says which risks are worth money. Compass says which of those can actually be sequenced inside this year's hiring and budget reality. Either one alone produces a document; together they produce a decision with a date and an owner."
      },
      {
        member: "u-forge",
        how: "Ledger prices third-party exposure, which the 2025 DBIR found in 30 percent of breaches, double the prior year's figure. That single number is usually what finally funds the supply chain work Forge has been requesting for three quarters."
      },
      {
        member: "u-tide",
        how: "Ledger's loss curves are what justify the unglamorous cost of recovery capability. Ransomware appeared in 44 percent of breaches in the 2025 DBIR, which makes recovery a control with a measurable effect on the curve rather than an insurance line item."
      },
      {
        member: "u-signal",
        how: "Signal supplies verifiable evidence for third-party claims, which lets Ledger retire the annual vendor questionnaire that every party involved privately understands to be a work of collaborative fiction."
      }
    ],
    unlockedBy: "Quantify one real exposure end to end and defend the loss exceedance curve in front of an audience trying to break it.",
    firstWords: "Your register has forty-one items and thirty-eight of them are amber. That is not a risk assessment, that is an elaborate mechanism for avoiding a choice. Pick the three that could put this company below its cash floor and let us put real numbers on those, and then let us talk honestly about the other thirty-eight.",
  },
  {
    id: "u-mirror",
    callsign: "MIRROR",
    role: "Adversary Emulation and Red Team Lead",
    title: "The One Who Comes For You",
    phase: 3,
    essence: "ember",
    bio: "Mirror spent five years in consulting running scoped penetration tests that terminated at the perimeter and taught almost nobody anything durable, then moved in-house to build an emulation program that begins with intelligence instead of with a scanner. They select an adversary the organization plausibly faces, extract its techniques from public and commercial reporting, build the plan against ATT&CK, and execute it inside the real estate with a defender watching the whole time. Mirror also carries the threat intelligence function and argues, persuasively, that it belongs there: intelligence that does not terminate in a test is a newsletter with a threat actor's name on the front. The blind spot: Mirror likes winning. Early in their in-house career they wrote reports optimized to demonstrate a spectacular chain, nine steps to domain admin, the slide everyone remembers from the readout, when the genuinely useful finding was that step two would have been caught if a single log source had been enabled. It took a defender telling them the report was useless before Mirror changed what they optimized for.",
    doctrine: "The engagement succeeded if you can now catch me. Not if I got in.",
    strengths: [
      "Builds emulation plans from real adversary reporting rather than from a commercial tool's default technique library",
      "Runs purple cycles where a technique is executed, missed, instrumented and re-executed inside the same week",
      "Distinguishes a control that failed from a control that was never in the attack path at all, which most reports conflate",
      "Reports in the defender's units, meaning detection coverage gained, rather than in trophies and screenshots"
    ],
    leverages: [
      {
        member: "u-lantern",
        how: "Mirror is Lantern's test harness. A rule that has never been fired by a live technique in the production environment is untested code deployed to production, and we would never accept that from any other engineering team."
      },
      {
        member: "u-hearth",
        how: "Mirror runs the social engineering half: the help-desk call, the MFA reset request, the fluent and well-researched impersonation. That is how groups like Scattered Spider actually get in, and no quantity of endpoint tooling will ever surface it as an alert."
      },
      {
        member: "u-anchor",
        how: "Mirror generates the incidents Anchor practices on, including the difficult category almost no exercise includes: a thinking adversary who observes the response, adapts to containment, and changes objectives mid-engagement."
      },
      {
        member: "u-oracle",
        how: "Mirror adapts the emulation surface to agentic systems, where the target is no longer only a human with a password but a model with tool access, a large trust radius, and no capacity to feel suspicious."
      }
    ],
    unlockedBy: "Run one intelligence-derived emulation against your own estate and improve a named detection because of what it revealed.",
    firstWords: "I am not here to prove your security is bad. I could do that before lunch and it would help nobody. Name a threat actor you genuinely believe would come for this company, and we will find out together which parts of your response are real and which parts only exist in a document.",
  },
  {
    id: "u-hearth",
    callsign: "HEARTH",
    role: "People Security and Insider Risk Lead",
    title: "The One Who Knows the Room",
    phase: 3,
    essence: "azure",
    bio: "Hearth came from trust and safety at a marketplace, then five years running workplace investigations, which is an unusual route into security and precisely why they are effective at it. They understand that the help desk is a security control operated by people who are measured on ticket resolution time, and that this is a design problem rather than a training problem, no matter how many awareness modules get purchased. Hearth rebuilt identity verification for account recovery around a pre-registered callback number and an out-of-band factor after the CISA and FBI advisories on help-desk impersonation made it impossible to keep treating the risk as theoretical. They also run the insider program, and they run it with defensible process and legal partnership, because an insider program without process is surveillance with a budget code and it will eventually be discovered as such. The blind spot: Hearth believes almost everyone is recoverable. They will spend six weeks on a coaching path with somebody who is exfiltrating data deliberately, and they have been wrong about that in a way that cost a customer list and a lawsuit.",
    doctrine: "Every control that ends in a human being asked to be sure has to work when that human is tired.",
    strengths: [
      "Designs verification flows that survive a fluent, well-researched, socially skilled attacker on a good day",
      "Runs insider cases with evidence handling and legal partnership that hold up when they are examined months later",
      "Reads a departure, a demotion, a passed-over promotion or a reorganization as a scheduled risk event",
      "Makes internal reporting safe enough that people raise concerns early, while the problem is still cheap to solve"
    ],
    leverages: [
      {
        member: "u-anchor",
        how: "Hearth keeps the compromised employee a cooperating witness rather than a defendant, which is frequently the difference between a two-day scope and a two-week one, because frightened people stop remembering things accurately."
      },
      {
        member: "u-lantern",
        how: "Hearth translates human-process failures into detections no endpoint tool would ever produce: a password reset with no callback, a manager approving their own access request, a recovery flow completed from an unfamiliar device within an hour of a support call."
      },
      {
        member: "u-mirror",
        how: "Hearth sets the ethical boundaries for Mirror's social engineering work and handles the aftermath. That relationship is what keeps the program alive politically after the first person tested cries at their desk."
      },
      {
        member: "u-ledger",
        how: "Hearth's case history supplies Ledger with real internal frequencies for insider events, which is the only mechanism by which an insider risk estimate stops being a number somebody invented in a workshop."
      }
    ],
    unlockedBy: "Redesign one identity verification path and prove it holds against a live, consented social engineering test.",
    firstWords: "Take me to the help desk. Not the policy document, the actual desk. I want to hear a real call, watch the real queue depth, and see the exact metric that person is judged on at the end of the month. That metric is your real security policy. Everything else is aspiration.",
  },
  {
    id: "u-vault",
    callsign: "VAULT",
    role: "Smart Contract and Treasury Security",
    title: "The One Who Reads the Bytecode",
    phase: 3,
    essence: "violet",
    bio: "Vault audited contracts for four years, working the standard catalogue of reentrancy, access control failures, integer behaviour and oracle manipulation, and then watched the industry's largest losses arrive from somewhere else entirely. In February 2025 roughly 1.5 billion dollars left Bybit not because a contract was wrong but because signers approved a hash while a compromised interface displayed a transaction that was not the one being authorized. Vault reorganized their entire practice around that: the contract is one attack surface, the signing path is another, and the second one has proved substantially more expensive. They now insist on transaction simulation and independent decoding on a device the signer's workstation cannot influence, and they treat blind signing as an unacceptable operational state rather than a user experience inconvenience to be smoothed over. The blind spot: Vault is a code person at heart. They will produce a flawless review of an upgrade mechanism and forget to ask who holds the upgrade key, how many of them there are, and whether any two of them sit in the same office and share a laptop charger.",
    doctrine: "The signer must be able to read what they are signing, on a device the attacker does not own.",
    strengths: [
      "Reviews access control and upgrade paths with the same rigour most auditors reserve for business logic",
      "Builds independent transaction decoding so that approval means comprehension rather than procedural compliance",
      "Verifies deployed bytecode against the audited source every single time, including after a hotfix at midnight",
      "Designs treasury controls with spend limits, time locks and a rehearsed abort path that has an owner and a stopwatch"
    ],
    leverages: [
      {
        member: "u-keeper",
        how: "Keeper holds the quorum and Vault ensures the quorum understands what it is approving. Split knowledge without comprehension does not prevent a mistake, it distributes the same mistake across more signatures and makes it look deliberate."
      },
      {
        member: "u-forge",
        how: "Forge's provenance chain closes Vault's worst structural gap, which is the drift between the source that was audited and the bytecode that was actually deployed after three urgent changes nobody re-reviewed."
      },
      {
        member: "u-cartographer",
        how: "Cartographer runs the nodes Vault's simulations depend on, because a treasury control that resolves state through a public RPC endpoint is a treasury control that trusts a stranger to tell it the truth at the worst possible moment."
      },
      {
        member: "u-tide",
        how: "Vault and Tide rehearse the abort together: pause, time lock, and the exact sequence of calls that must succeed within nine minutes with only three people awake and one of them on a phone."
      }
    ],
    unlockedBy: "Break a live treasury flow in rehearsal, then close it with independent decoding and an abort path you have timed.",
    firstWords: "Sign nothing today. First tell me what your signers actually see at the instant they approve. If the answer is a hexadecimal string and a vendor's assurance, you do not have a multisig. You have several people agreeing, in good faith, to the same unknown.",
  },
  {
    id: "u-cartographer",
    callsign: "CARTOGRAPHER",
    role: "Decentralized Infrastructure Architect",
    title: "The One Who Draws the Territory",
    phase: 3,
    essence: "azure",
    bio: "Cartographer ran platform infrastructure at an exchange, then spent five years operating validators across four clouds and two racks they could physically walk to. They can identify the precise moment redundancy becomes correlation, and they will show you the receipts: the September 2025 slashing event that penalized thirty-nine Ethereum validators arose not from an attack but from operators sharing infrastructure assumptions and therefore failing in the same way at the same time. Cartographer's maps are honest to the point of being unwelcome. They show the single cloud region that three supposedly independent operators quietly share, the one bootstrap node everybody's configuration still points at, and the client implementation running under sixty percent of a network that everyone describes as diverse. The blind spot: Cartographer chases availability. Presented with a slashing risk and an uptime target, they have historically optimized the uptime, which in proof-of-stake is the wrong direction. Double-signing costs principal. Missing an attestation costs pennies. They know the arithmetic perfectly and still feel the outage more.",
    doctrine: "Decentralized means nothing until you can name what all the parts still share.",
    strengths: [
      "Maps correlated failure across operators, clouds, regions, client implementations and human on-call rotations",
      "Designs signing topology so a bad deploy costs liveness and never principal, which changes the worst case entirely",
      "Treats client diversity as a security control with a measurable threshold rather than as a community virtue",
      "Instruments systems where there is no agent to install and the chain plus peer behaviour is the only available witness",
      "Reads a governance mechanism as an attack surface, because the ability to change the rules is the ability to take the funds"
    ],
    leverages: [
      {
        member: "u-keeper",
        how: "Cartographer gives Keeper's custody design physical reality: which enclave, which region, which specific humans hold console access at four in the morning, and what happens when one of those regions is the one that is down."
      },
      {
        member: "u-lantern",
        how: "Cartographer supplies telemetry Lantern cannot obtain any other way, including peer behaviour, mempool anomalies and attestation timing drift, in an environment where there is simply no endpoint to instrument."
      },
      {
        member: "u-tide",
        how: "Cartographer's correlated-failure map is the raw material for Tide's recovery plan. You cannot rehearse a recovery whose dependencies you have never drawn, and every undrawn dependency shows up during the real one."
      },
      {
        member: "u-signal",
        how: "Cartographer establishes which operators are genuinely independent rather than nominally independent, which is the ground truth a trust graph either possesses or quietly fabricates from self-reported claims."
      }
    ],
    unlockedBy: "Publish a correlated-failure map of a real distributed system and surface one shared dependency nobody had documented.",
    firstWords: "Your architecture diagram has eleven boxes and I have already found three of them running in the same availability zone. Let us redraw this by what fails together rather than by what reports to whom. The org chart is not a fault domain, however much everyone would like it to be.",
  },
  {
    id: "u-signal",
    callsign: "SIGNAL",
    role: "Trust Graph and Attestation Analyst",
    title: "The One Who Weighs a Claim",
    phase: 3,
    essence: "cyan",
    bio: "Signal built federated identity for a health network, which is where they learned that the hard part of a credential is never the cryptography. It is the question of who vouched for the issuer, and what happens on the day that vouching stops being true. They now work in attestation. The W3C Verifiable Credentials 2.0 family became a Recommendation in May 2025, bringing with it primitives that make selective disclosure and privacy-preserving status checking practical rather than aspirational, including a bitstring status list that lets a verifier learn revocation without learning who is asking. Signal builds trust graphs where every claim carries its issuer, its evidence, its expiry and its status, and where the absence of an expected claim is itself information worth alerting on. They also hold the privacy engineering brief, because minimal disclosure and data minimization are one discipline approached from two directions. The blind spot: Signal designs for a world that already attests. They have shipped elegant graphs into organizations where nobody had the time or incentive to sign anything, and the graph sat there, honest and empty and completely useless.",
    doctrine: "A claim without an issuer, an expiry and a revocation path is a rumour with better typography.",
    strengths: [
      "Separates identity, authorization and reputation, which most production systems collapse into a single overloaded field",
      "Designs selective disclosure so a verifier learns the minimum required to make the decision in front of them",
      "Builds revocation that genuinely propagates, rather than a status endpoint no verifier has ever actually polled",
      "Detects trust-graph manipulation: sybil clusters, circular vouching, dormant issuer capture and reputation laundering through intermediaries"
    ],
    leverages: [
      {
        member: "u-ledger",
        how: "Signal replaces Ledger's annual vendor questionnaire with continuously verifiable claims, which converts third-party risk from a static artifact reviewed once a year into a live signal that can degrade between reviews."
      },
      {
        member: "u-forge",
        how: "Forge's transparency log and Signal's attestation graph are the same idea operating at two altitudes: an append-only record that makes a lie expensive and discoverable rather than impossible, which is the only guarantee either can honestly offer."
      },
      {
        member: "u-hearth",
        how: "Signal gives Hearth a verification primitive that does not depend on a human recognizing a voice under time pressure, which is precisely the control that keeps failing in every published help-desk compromise."
      },
      {
        member: "u-oracle",
        how: "Signal supplies provenance for training data, model artifacts and agent identity, so that an autonomous action can be traced back to a delegating principal whose authority was still valid at the moment it was exercised."
      }
    ],
    unlockedBy: "Model one real trust relationship as verifiable claims and demonstrate revocation propagating all the way to a verifier's decision.",
    firstWords: "Tell me who you trust, and then I will ask why, and then I will ask how you would ever find out that it had stopped being true. Most trust inside most organizations is a decision one person made once, years ago, and nobody has revisited it because nothing has broken yet.",
  },
  {
    id: "u-tide",
    callsign: "TIDE",
    role: "Resilience and Recovery Engineer",
    title: "The One Who Brings It Back",
    phase: 3,
    essence: "azure",
    bio: "Tide spent nine years on storage and backup for a hospital group and has restored under genuine pressure, not a drill but an actual ward waiting on a system. They moved into resilience engineering after a ransomware case where the backups were technically intact and operationally worthless: the restore path required an identity provider that had itself been encrypted, and nobody had ever tested that ordering because nobody had ever tested the ordering at all. With ransomware present in 44 percent of breaches in the 2025 DBIR, Tide argues that recovery is not a contingency plan but a control with a measurable failure rate that almost no organization actually measures. They insist on immutability with a retention lock, on recovery credentials that live entirely outside the production identity plane, and on timed restores conducted with a stopwatch and an independent witness. The blind spot: Tide rehearses. They will run the same well-scoped exercise until it is beautiful, and a well-scoped exercise quietly assumes everything that was true when the runbook was written. The last three real recoveries each turned on a dependency the drill had been silently providing.",
    doctrine: "A backup you have not restored is a receipt, not a recovery.",
    strengths: [
      "Tests restore order rather than restore success: identity first, then data, then service, then the integrations everyone forgot",
      "Keeps recovery credentials and recovery tooling outside the blast radius of the thing being recovered",
      "Measures recovery in wall-clock time with a witness present, and publishes the number even in the quarters when it is embarrassing",
      "Designs degraded operating modes so the business can run at forty percent capacity instead of at zero while recovery proceeds"
    ],
    leverages: [
      {
        member: "u-anchor",
        how: "Tide makes Anchor's containment decisions reversible. A commander who knows recovery works will contain aggressively and early; one who does not will hesitate, and the intrusion's scope grows inside exactly that hesitation."
      },
      {
        member: "u-cartographer",
        how: "Cartographer's correlated-failure map tells Tide which recovery dependencies are real and which are comforting illusions, particularly the ones where the backup and the primary share a control plane."
      },
      {
        member: "u-ledger",
        how: "Tide converts Ledger's loss curve into an actual measurable reduction, because time to recover is the term in that model most directly under the organization's own control and the least dependent on adversary behaviour."
      },
      {
        member: "u-keeper",
        how: "Keeper and Tide rehearse the ugliest ceremony that exists: reconstituting custody after losing custodians. Most organizations have never attempted it, and most discover during the attempt that it was never actually possible."
      }
    ],
    unlockedBy: "Complete a timed, witnessed restore of a critical service with the production identity plane declared hostile.",
    firstWords: "Pick a service. We are restoring it today, from immutable copy, with a stopwatch running and your identity provider declared dead. Whatever number we get is your real recovery objective. The number in the continuity document is a wish somebody typed in a meeting.",
  },
  {
    id: "u-compass",
    callsign: "COMPASS",
    role: "Chief of Staff and Security Program Strategist",
    title: "The One Who Sequences It",
    phase: 3,
    essence: "gold",
    bio: "Compass was a strategy consultant for three years, a background the engineers held against them for roughly eight months, and then ran security program management through two acquisitions and one regulatory examination that went on for fourteen weeks. They are the reason a roadmap survives a budget cycle. They understand what CSF 2.0 actually demands now that Govern is a first-class function, which in practice means a written and approved risk appetite, key risk indicators reviewed on a real quarterly cadence, and documented evidence that a review changed where money or headcount went. Compass protects the unit's attention, which is the scarcest resource it has and the one nobody puts on a budget line. The blind spot: Compass optimizes for legibility. Work that cannot be explained on a single slide gets deprioritized, and some of the highest-value security work in existence, a slow refactor of an authorization model, a year of telemetry cleanup, a deprecation nobody will thank you for, is precisely the work that never looks good on a slide. Compass has cancelled something genuinely important for the crime of appearing untidy.",
    doctrine: "Strategy is what you refuse to do this year, written down where people can hold you to it.",
    strengths: [
      "Sequences a roadmap against hiring reality, budget cycles and executive attention rather than against an idealized maturity model",
      "Runs a governance cadence that reliably produces decisions with owners and dates instead of producing status",
      "Says no clearly enough that the no survives repeated contact with a persistent and senior stakeholder",
      "Absorbs the interrupt load the unit would otherwise carry, which is the single cheapest way to buy back deep work"
    ],
    leverages: [
      {
        member: "u-ledger",
        how: "Ledger produces the numbers and Compass produces the decision. A loss exceedance curve with no owner, no date and no funding line is analysis, and analysis is not governance no matter how rigorous the mathematics behind it."
      },
      {
        member: "u-voice",
        how: "Compass builds the standing board relationship in peacetime so that the first time the board hears directly from security is not during the worst week of the company's history, when every sentence is being weighed by lawyers."
      },
      {
        member: "u-seva",
        how: "Compass takes over the political read Seva has been carrying alone since the first step. That handover is the exact moment the learner stops being the only adult in every room, and it is a bigger relief than any headcount."
      },
      {
        member: "u-forge",
        how: "Compass funds the paved road, and when persuasion has clearly run out, converts Forge's quietly growing exception list into an executive decision with a named owner attached to each remaining exception."
      }
    ],
    unlockedBy: "Turn a twelve-month security strategy into a funded, sequenced plan that survives one genuinely hostile review.",
    firstWords: "You have nine initiatives and capacity for four. I am not going to ask which are important, because they are all important and that question has never once produced a decision. I am going to ask which three you would defend to the board if the other six were cancelled tomorrow. Then we are cancelling the other six.",
  },
  {
    id: "u-oracle",
    callsign: "ORACLE",
    role: "AI Security Lead",
    title: "The One Who Bounds the Machine",
    phase: 4,
    essence: "violet",
    bio: "Oracle trained models for six years before ever writing a threat model, and the transition was humbling in both directions. The security field wanted to treat a model as a component with an input and an output, and the machine learning field wanted to treat security as a filter applied at the end. Neither is correct. Oracle works from the OWASP Top 10 for LLM Applications, where prompt injection has held the first position across consecutive editions for a structural reason rather than a fashionable one: instructions and data travel the same channel, and no quantity of filtering alters that fact. Their real focus is the agentic surface, meaning excessive agency, tool permissions, and the trust radius of a system that reads untrusted content and then takes actions with consequences. Oracle builds least-privilege tooling and puts irreversible actions behind a human with enough context to actually refuse. The blind spot: Oracle trusts evaluations. They shipped a guardrail that scored well on an internal benchmark and watched it fail in its first production week against phrasing nobody in the evaluation set had thought to imagine. They sample production now, but the instinct to believe a good number has not entirely left them.",
    doctrine: "Treat every model output as attacker-controlled input to whatever it touches next.",
    strengths: [
      "Threat models the agent's tool permissions and action space rather than the model's weights and benchmark scores",
      "Separates the instruction channel from the data channel wherever the architecture still permits the separation to exist",
      "Places irreversible actions behind a human who has been given enough context to meaningfully refuse rather than to rubber-stamp",
      "Reads the model supply chain as dependencies: weights, adapters, system prompts, retrieval corpora and tool schemas",
      "Distinguishes a model that behaved badly from a system that granted it the authority to matter"
    ],
    leverages: [
      {
        member: "u-forge",
        how: "Oracle extends Forge's provenance discipline to artifacts no SBOM format currently describes: weights, adapters, system prompts and the tool schemas that define, more precisely than any policy document, what an agent is permitted to do."
      },
      {
        member: "u-lantern",
        how: "Oracle hands Lantern an entirely new telemetry class, meaning tool invocations, permission escalations and retrieval of content the agent should never have been able to reach. These are detections nobody had to write five years ago and everybody needs now."
      },
      {
        member: "u-signal",
        how: "Signal's delegation chains let Oracle answer the question that ultimately decides liability: on whose authority did this agent act, and was that authority still valid at the moment the action executed rather than at the moment it was granted."
      },
      {
        member: "u-unitium",
        how: "Oracle is the reason the unit can operate at machine speed without mistaking that for machine judgement. Every automation the unit runs passes through Oracle's bounding, and the bounding is what keeps a fast unit from being a fast mistake."
      }
    ],
    unlockedBy: "Compromise an agentic system through indirect prompt injection, then bound it so the same path yields nothing of value.",
    firstWords: "Show me the tool list. Not the system prompt, the tools. The prompt is what you hoped it would do. The tool list is what it can do, and every single entry on it is something an attacker can do through it if they can get the model to ask on their behalf.",
  },
  {
    id: "u-voice",
    callsign: "VOICE",
    role: "Crisis Communications and Board Narrative",
    title: "The One Who Says It Plainly",
    phase: 4,
    essence: "gold",
    bio: "Voice was a business reporter for seven years, which means they have been on the receiving end of every evasive breach statement ever drafted and can point at the exact sentence that turned a one-day story into a three-week one. They moved into communications, then into security communications, and now write the sentences that regulators, customers and journalists will quote back for years without context. Voice enforces the discipline that Google's own security engineering writing insists on: no hedging, no ambiguous formulations like the attack is mitigated, confidence levels tied to specific named systems rather than to the situation in general. They also manage the gap-filling problem, which is that employees holding partial awareness of an incident will invent the missing details, and those inventions leave the building considerably faster than any approved statement. The blind spot: Voice is very good at language, and language is an excellent place to hide. Under real pressure they will find the phrasing that is technically accurate and leaves a false impression, because it is defensible and it buys a day. It buys a day and it costs a year.",
    doctrine: "Say the uncomfortable thing early in your own words, or hear it later in somebody else's.",
    strengths: [
      "Writes statements that never require retraction, because the confidence level was stated honestly at the time",
      "Segments disclosure by audience without ever letting the versions contradict each other when placed side by side",
      "Kills a rumour inside the company before it matures into a leak outside it, which is where most leaks are actually born",
      "Holds the line against legal and marketing at the precise moment accuracy and comfort begin to diverge"
    ],
    leverages: [
      {
        member: "u-anchor",
        how: "Voice removes the communications load from Anchor entirely, which is the single largest recovery of commander attention available in any incident and costs nothing but the decision to delegate it properly."
      },
      {
        member: "u-compass",
        how: "Compass builds the board relationship in peacetime so Voice inherits credibility rather than having to establish it from zero during the worst week, when every audience is already primed to disbelieve."
      },
      {
        member: "u-ledger",
        how: "Ledger supplies materiality reasoning that stands up to examination, so a disclosure decision becomes a documented judgement with a method behind it instead of an instinct exercised under deadline and later second-guessed."
      },
      {
        member: "u-hearth",
        how: "Hearth and Voice manage internal narrative jointly, because the employee who half-understands what is happening is simultaneously the most sympathetic person in the building and the most likely source of the next external leak."
      }
    ],
    unlockedBy: "Deliver a hostile press and regulator briefing during a live simulated breach without issuing a single retraction afterward.",
    firstWords: "Read me your holding statement. Now cross out every phrase that would allow a reasonable person to believe something false. What remains is short, and uncomfortable, and it is the only version that will still be true on Thursday when somebody finds the logs.",
  },
  {
    id: "u-unitium",
    callsign: "UNITIUM",
    role: "The Synthesis",
    title: "One Coordinated Intelligence",
    phase: 4,
    essence: "violet",
    bio: "Unitium is not a hire and there is no requisition for it. It is what the unit becomes on the day the handoffs stop costing anything: when a detection ships with its response runbook already attached because Lantern and Anchor no longer need a meeting to agree on what happens next; when Forge's provenance is already the input to Vault's deployment check without anyone routing it; when Ledger's numbers arrive in the same language Compass uses to sequence and Voice uses to disclose. Its career history is the accumulated scar tissue of every member in this roster. Its flaw is the most dangerous one in the entire file, because it is invisible from inside: coherence reads as correctness. A unit that agrees quickly has either solved the problem or stopped arguing about it, and from within those two states feel identical. Unitium's failure mode is not fragmentation, it is consensus, meaning the day a bad assumption enters the shared model and propagates through the whole organization at full speed, unopposed, because it originated internally and therefore was never examined.",
    doctrine: "Coherence is a force multiplier and a failure mode. Assign somebody to disagree, on purpose, on the calendar.",
    strengths: [
      "Moves from signal to decision without paying a coordination tax at any handoff in the chain",
      "Maintains one shared model of the estate that every member can write to, read from, and openly challenge",
      "Degrades gracefully, so any three members can run an incident end to end without waiting for a specialist to wake up",
      "Institutionalizes dissent as a scheduled function, so operating speed does not silently become groupthink",
      "Teaches faster than it hires, because every scar in the roster is documented and reachable by the newest person"
    ],
    leverages: [
      {
        member: "u-seva",
        how: "Unitium is what Seva was building toward from the very first step. A guide's success condition is their own redundancy, and this is the form that redundancy finally takes: a room that answers the question before the guide has to."
      },
      {
        member: "u-anchor",
        how: "Unitium collapses Anchor's coordination overhead to nearly zero, which is worth more than any tool ever purchased. The commander's attention stops being consumed by tracking who is doing what and returns to the decisions only a commander can make."
      },
      {
        member: "u-mirror",
        how: "Unitium's standing assignment to Mirror is to attack the unit's shared model itself, not merely its infrastructure. Once the organization is coherent, the highest-value red team target is no longer a system. It is the consensus."
      },
      {
        member: "u-oracle",
        how: "Oracle prevents Unitium from confusing machine speed with machine judgement, which is exactly the failure that a well-synchronized unit makes cheapest and fastest to commit at scale."
      }
    ],
    unlockedBy: "Complete the final chapter with every member of the unit earned, and run one live crisis from first page to board briefing.",
    firstWords: "There is no new voice here. There is only the moment you notice that the question you were about to ask has already been answered by somebody who knew you would ask it. That is not magic and it is not software. It is fourteen specialists and one guide who have each been wrong in front of the others and stayed in the room.",
  }
];
