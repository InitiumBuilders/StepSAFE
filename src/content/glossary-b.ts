import type { Term } from "./schema";

/* StepSAFE :: THE PRAXIS — StepGuides Glossary B.
   The shared vocabulary of detection, appsec and supply chain, incident and
   resilience, and governance. Every entry teaches the mechanism, not the label.
   Grounded in MITRE ATT&CK and D3FEND 1.0, CISA KEV and BOD 22-01, FIRST EPSS v4
   and CVSS v4.0, NIST CSF 2.0 and SP 800-61r3, OWASP API Security Top 10 (2023),
   SLSA v1.1, in-toto, Sigstore, Verizon DBIR 2025, Mandiant M-Trends 2025/2026,
   Google SRE postmortem culture, and the FAIR model. */

export const TERMS: Term[] = [
  {
    id: "detection-as-code",
    term: "Detection as Code",
    domain: "Detection Engineering",
    short: "Treating every detection as a versioned, tested, peer-reviewed software artifact rather than a click in a console.",
    long: "A detection written in a UI has no history, no author, no test, and no way to prove it still works. Detection as code moves the rule into a repository: the logic lives in a file, the change goes through pull request, unit tests fire synthetic events to prove the rule matches what it claims and ignores what it should, and CI deploys it to the SIEM. The unlock is regression testing — you can replay a corpus of known-malicious and known-benign telemetry against every rule on every commit, so a schema change in an upstream log source breaks the build instead of silently blinding you for six months. It also makes coverage auditable: the ATT&CK technique a rule addresses becomes metadata in the file, so coverage maps are generated from the truth rather than maintained by hand in a spreadsheet.",
    why: "It converts detection from tribal craft into an engineering discipline with a review trail. When a regulator, a board, or an acquirer asks how you know your detections work, the answer is a test suite and a git log, not a confident sentence. It is also the only sane way to scale detection across more than one analyst.",
    related: ["sigma", "detection-drift", "detection-coverage-map", "attack-technique", "false-positive-economics"],
    mode: "both"
  },
  {
    id: "sigma",
    term: "Sigma",
    domain: "Detection Engineering",
    short: "An open YAML format for describing log-based detections once and compiling them to any SIEM query language.",
    long: "Sigma is to detections what a portable IR is to compilers. An analyst writes the logic once — log source, selection criteria, condition, false-positive notes, ATT&CK tags — in vendor-neutral YAML. A backend plus a processing pipeline then compiles that rule into Splunk SPL, Elastic Lucene or ES|QL, Sentinel KQL, QRadar AQL, and dozens of others. The pipeline layer is the underrated half: it maps abstract field names such as the parent process image to whatever your particular log shipper actually emits, which is where most real portability lives. The format is maintained by SigmaHQ with a large public rule corpus, and pySigma is the library that lets you bake conversion into your own build.",
    why: "Vendor lock-in in detection is a slow-motion hostage situation — migrating a SIEM normally means rewriting years of logic. Sigma turns your detection estate into an asset you own, and it lets you consume community detections and publish your own without exposing your stack.",
    related: ["detection-as-code", "attack-technique", "siem", "log-source-fidelity", "detection-coverage-map"],
    mode: "both"
  },
  {
    id: "attack-technique",
    term: "ATT&CK Technique",
    domain: "Threat Modeling",
    short: "A named adversary behavior in MITRE ATT&CK, describing how a goal is achieved rather than what tool achieved it.",
    long: "ATT&CK organizes real, observed intrusion behavior into tactics (the adversary's objective, such as persistence or credential access) and techniques with sub-techniques (the means of achieving it). A technique is a behavior abstraction: it survives the attacker changing malware families, C2 infrastructure, or packer, because it describes the mechanism. This is why detection anchored on techniques ages better than detection anchored on hashes. The taxonomy also gives you a shared coordinate system — a threat intel report, a red team finding, a control gap, and a SIEM rule can all reference the same technique ID and be compared honestly. The trap is treating the matrix as a checklist: techniques are not equally weighted, many have dozens of procedural variants, and a green cell may mean you detect one narrow procedure while a dozen others walk past.",
    why: "It is the lingua franca of the discipline. Without it, every conversation about coverage becomes a debate about words. With it, you can say precisely what you detect, what you only prevent, and what you have no visibility into at all.",
    related: ["d3fend", "detection-coverage-map", "adversary-emulation", "pyramid-of-pain", "threat-hunting-hypothesis"],
    mode: "both"
  },
  {
    id: "d3fend",
    term: "D3FEND",
    domain: "Defensive Ontology",
    short: "MITRE's knowledge graph of defensive techniques, reaching 1.0 in January 2025, that formally links countermeasures to the offensive behaviors they affect.",
    long: "ATT&CK tells you what adversaries do; D3FEND models what defenses actually do, and how. It is built as an OWL 2 DL ontology rather than a list, so a countermeasure is defined by the digital artifacts it operates on — a process, a network packet, a credential — and inference can connect it to offensive techniques that touch the same artifacts. The 1.0 release added identity and access control concepts, operational technology, source code hardening, and modeling of CWE for vulnerability use cases, and shipped a Cyber Attack-Defense graph tool for building scenario graphs. The practical value is precision of claim: instead of saying a product provides endpoint protection, you can say it performs process spawn analysis and executable denylisting, and reason about what that leaves uncovered.",
    why: "Security spend is routinely justified with category words that do not survive contact with an incident. D3FEND lets you describe your defensive estate in terms that can be verified, compared between vendors, and mapped to the specific adversary behaviors you claim to counter.",
    related: ["attack-technique", "detection-coverage-map", "cwe", "compensating-control", "threat-modeling", "mitre-attack", "defense-in-depth", "detection-engineering", "threat-model"],
    mode: "motus"
  },
  {
    id: "telemetry-pipeline",
    term: "Telemetry Pipeline",
    domain: "Security Operations",
    short: "The path a security-relevant event takes from producer to detection to storage, and the place where cost, latency, and fidelity are decided.",
    long: "Between the agent that emits an event and the analyst who reads it sits a pipeline: collection, parsing, normalization, enrichment, routing, and retention. Each stage is a design decision with consequences. Sampling cuts cost and quietly destroys the ability to see low-and-slow behavior. Aggressive normalization loses the raw field an incident later depends on, so keep the original event alongside the parsed one. Enrichment at ingest — asset owner, criticality, identity, geography — is far cheaper than joining at query time and is what turns an alert into a decision. Modern practice splits the stream: high-value events to the hot detection tier, bulk logs to cheap object storage that can be rehydrated during an investigation.",
    why: "Detection quality is capped by telemetry quality, and telemetry cost is one of the largest line items you control. A leader who cannot describe their pipeline in these terms will be sold storage instead of visibility, and will discover the gap during an incident.",
    related: ["log-source-fidelity", "siem", "detection-as-code", "alert-fatigue", "forensic-timeline"],
    mode: "both"
  },
  {
    id: "log-source-fidelity",
    term: "Log Source Fidelity",
    domain: "Security Operations",
    short: "How completely and reliably a log source represents the activity it claims to cover, including its silent failure modes.",
    long: "Every log source has a coverage boundary and a failure mode, and both are usually undocumented. An endpoint agent that is not installed on the build fleet has zero fidelity there no matter how good the rules are. A cloud audit log that omits data-plane reads gives you control-plane truth and object-access blindness. Command-line logging truncated at a fixed length destroys detection of long encoded payloads. Fidelity work means answering four questions per source: what fraction of the estate it covers, what events it structurally cannot see, how you would know if it stopped flowing, and how long it is retained. The last two matter most — a dead log source produces no alerts, which looks exactly like a quiet week.",
    why: "Most detection failures during real incidents are not bad rules, they are missing or degraded data. Instrumenting the health of your sources is cheaper than any new tool and is the first thing a competent adversary tries to break.",
    related: ["telemetry-pipeline", "detection-drift", "detection-coverage-map", "siem", "memory-acquisition"],
    mode: "both"
  },
  {
    id: "siem",
    term: "SIEM",
    domain: "Security Operations",
    short: "The central store and query engine for security telemetry, where correlation across sources becomes possible and expensive.",
    long: "A security information and event management platform aggregates logs from many sources, normalizes them into a common schema, runs scheduled and streaming detection logic, and holds the searchable history an investigation depends on. Its real function is correlation: linking an identity event, a network event, and an endpoint event into one narrative. Its real cost driver is ingest volume priced per gigabyte, which creates a perverse incentive to drop exactly the noisy sources that carry investigative value. The maturity signal is not how many rules are enabled but whether the platform is treated as a data problem — schema discipline, tiered retention, tested content, and a documented answer to what happens when it is the thing that is down.",
    why: "The SIEM is where budget, visibility, and analyst time collide. Leaders who let it become a compliance log dump pay twice: once for storage, and again in dwell time when nothing correlates.",
    related: ["telemetry-pipeline", "log-source-fidelity", "soar", "xdr", "alert-triage-funnel"],
    mode: "novus"
  },
  {
    id: "edr",
    term: "EDR",
    domain: "Endpoint Defense",
    short: "Endpoint agent tooling that records process, file, registry, and network behavior locally, detects on it, and enables remote response.",
    long: "Endpoint detection and response gives you three things: a high-resolution behavioral recording of what happened on a host, detection logic running close to the data, and the ability to isolate a machine or kill a process without touching it physically. The recording is the part people undervalue — during an incident the EDR timeline is often the only source that can reconstruct parent-child process lineage and command lines. Its limits are structural: coverage gaps on unmanaged, embedded, appliance, and edge devices; a finite local retention window measured in days; and tamper resistance that determined attackers probe first. Mandiant's frontline reporting has repeatedly shown adversaries pivoting to network edge appliances precisely because they cannot host an agent.",
    why: "EDR is the highest-yield single control for post-compromise visibility, and its coverage map is a truthful statement of where you are blind. Knowing the uncovered fraction of your estate matters more than the detection rate on the covered fraction.",
    related: ["xdr", "memory-acquisition", "living-off-the-land", "containment", "log-source-fidelity"],
    mode: "novus"
  },
  {
    id: "xdr",
    term: "XDR",
    domain: "Security Operations",
    short: "Detection and response that correlates across endpoint, identity, email, network, and cloud within one analytic layer.",
    long: "Extended detection and response is a product category and an architectural claim: that correlating signals across domains produces higher-confidence detections than any single domain can. The claim is real — a mediocre endpoint signal plus an anomalous identity event plus an unusual egress destination is a strong composite — but the category is marketed far beyond what any single vendor delivers, because correlation quality depends on owning or faithfully ingesting all the domains. Evaluate it on two axes only: which telemetry it genuinely parses at depth versus merely stores, and whether you can author and version your own cross-domain logic. If you cannot write your own correlation, you have bought someone else's threat model.",
    why: "XDR is where the industry's consolidation pressure meets your need for independent detection. Buy it for correlation you cannot build yourself, but never let it become the only place your detection logic lives.",
    related: ["edr", "siem", "ueba", "detection-as-code", "soar"],
    mode: "both"
  },
  {
    id: "ueba",
    term: "UEBA",
    domain: "Detection Engineering",
    short: "Behavioral analytics that model normal activity per user and per entity, then alert on deviation rather than on signature.",
    long: "User and entity behavior analytics builds a baseline — typical login hours, typical hosts accessed, typical data volumes, typical peer group behavior — and scores departures from it. It catches things signatures cannot: a valid credential used by the wrong human, a service account suddenly enumerating a file share, an insider staging data before resignation. It also fails in characteristic ways. Baselines learned during an already-compromised period bless the attacker's behavior as normal. Small populations produce unstable baselines. And anomaly does not equal malice, so raw UEBA output has a punishing false positive rate unless it is used as a risk contributor inside a composite detection rather than as a standalone alert.",
    why: "Credential abuse remains the single most common initial access vector in breach data, and stolen valid credentials defeat signature-based detection by definition. UEBA is one of the few analytic families that addresses that directly, provided you resist paging humans on raw anomalies.",
    related: ["base-rate-fallacy", "false-positive-economics", "xdr", "lateral-movement", "honeytoken"],
    mode: "motus"
  },
  {
    id: "soar",
    term: "SOAR",
    domain: "Security Operations",
    short: "Automation and orchestration that executes the deterministic parts of response so humans only spend judgment where judgment is required.",
    long: "Security orchestration, automation and response connects your tools with code: enrich an alert with asset owner and threat intel, check whether the user recently travelled, quarantine a device, open a ticket, page the right on-call. The economics are simple — if an action is performed more than a few times a week and its decision rule can be written down, a human performing it is waste. The failure mode is automating a broken process, which industrializes the brokenness, and building playbooks so brittle that they break every time a vendor changes an API. The discipline that works is the same as detection as code: playbooks in version control, tested, with an explicit human approval gate on any irreversible action.",
    why: "Analyst attention is the scarcest resource in your operation, and it degrades under volume. SOAR is how you protect it. It is also how you make response consistent enough to be measured and improved.",
    related: ["alert-triage-funnel", "alert-fatigue", "mttr", "containment", "siem"],
    mode: "both"
  },
  {
    id: "alert-fatigue",
    term: "Alert Fatigue",
    domain: "Human Factors",
    short: "The measurable degradation of analyst accuracy and speed caused by sustained exposure to high-volume, low-precision alerting.",
    long: "Alert fatigue is not a morale complaint, it is a detection failure with a human substrate. When precision is low, analysts learn — correctly, from evidence — that a given alert class is usually noise, and they begin to triage by pattern rather than by investigation. The true positive that arrives inside that class is then closed in seconds with a plausible-sounding disposition. The damage compounds: tuning requests go unanswered because the team is underwater, attrition rises, institutional memory leaves, and the incoming analyst inherits a queue whose history they cannot read. The fix is never resilience training. It is raising precision, deleting detections that have never produced a true positive, and enforcing a hard budget on alerts per analyst per shift.",
    why: "Your detection estate has a throughput ceiling set by human attention, and every low-precision rule spends that budget. Treating alert volume as a cost you must justify — rather than coverage you should celebrate — is one of the highest-leverage cultural shifts a security leader can make.",
    related: ["false-positive-economics", "base-rate-fallacy", "alert-triage-funnel", "soar", "detection-drift", "detection-engineering", "base-rate", "indicator-of-compromise", "mean-time-to-detect", "goodharts-law"],
    mode: "both"
  },
  {
    id: "base-rate-fallacy",
    term: "Base Rate Fallacy",
    domain: "Decision Science",
    short: "The error of judging a detector by its accuracy while ignoring how rare the thing it detects actually is.",
    long: "Imagine a detector that is 99 percent accurate in both directions, run against a population where one event in a hundred thousand is malicious. Across a million events it flags the ten true positives and roughly ten thousand benign ones. Its precision — the probability that a given alert is real — is about one in a thousand, despite the impressive accuracy figure. This is the arithmetic behind almost every unusable detection in security, and it is why vendor accuracy claims are close to meaningless without the base rate of the environment they run in. The practical response is to raise the base rate before you detect: narrow the population to crown-jewel systems, stack weak signals into a composite, or require corroboration across domains before a human is paged.",
    why: "This single piece of arithmetic explains why sophisticated analytics so often produce unusable output, and it gives you a defensible way to reject tools whose demos are built on unrealistically enriched populations.",
    related: ["false-positive-economics", "alert-fatigue", "ueba", "calibrated-estimate", "detection-as-code"],
    mode: "both"
  },
  {
    id: "false-positive-economics",
    term: "False Positive Economics",
    domain: "Detection Engineering",
    short: "Costing a detection by the analyst minutes it consumes against the loss it prevents, so keep-or-kill becomes an arithmetic decision.",
    long: "Every detection has a running cost: alerts per week times median minutes to disposition times loaded analyst cost. Every detection has an expected benefit: probability the behavior occurs times probability the rule catches it times the loss avoided. Writing both numbers down changes the conversation entirely, because most detection estates contain a long tail of rules that have never produced a true positive and collectively consume a large share of analyst capacity. The subtlety is that false negatives are not symmetric with false positives — a missed detection of ransomware staging is not comparable to ten wasted minutes — so the right move is to tier detections explicitly: high-precision rules page humans, medium-precision rules feed risk scoring, low-precision signals are retained for hunting and retrospective search but never alert.",
    why: "It gives you the language to say no to coverage theater and to defend deleting detections, which is politically hard and operationally essential. It also turns detection tuning from a chore into a measurable efficiency program with a number attached.",
    related: ["alert-fatigue", "base-rate-fallacy", "detection-as-code", "alert-triage-funnel", "mttd"],
    mode: "motus"
  },
  {
    id: "alert-triage-funnel",
    term: "Alert Triage Funnel",
    domain: "Security Operations",
    short: "The staged narrowing of raw signals into alerts, alerts into investigations, and investigations into declared incidents.",
    long: "A healthy operation can state its conversion rates at each stage and the median time spent per stage. Signals become alerts through detection logic. Alerts become investigations when enrichment and automated checks fail to close them. Investigations become incidents when impact or adversary presence is confirmed. Measuring the funnel exposes exactly where you are losing — a huge signal-to-alert ratio means noisy logic, a huge alert-to-investigation ratio means enrichment is missing, and a tiny investigation-to-incident ratio means you are chasing ghosts. It also gives you the honest capacity model you need for staffing arguments, because the funnel makes headcount a function of alert volume and handling time rather than of anxiety.",
    why: "Boards fund what can be modeled. The funnel turns SOC staffing and automation investment into a capacity calculation instead of a plea, and it localizes the actual bottleneck rather than adding people at the top.",
    related: ["alert-fatigue", "soar", "mttd", "mttr", "false-positive-economics"],
    mode: "both"
  },
  {
    id: "detection-drift",
    term: "Detection Drift",
    domain: "Detection Engineering",
    short: "The silent decay of a detection's effectiveness as the environment, log schema, or adversary tradecraft moves out from under it.",
    long: "A rule written against a specific field name breaks when an agent upgrade renames the field, and the symptom is silence, not an error. An allowlist tuned for a 2024 software estate becomes a hole once a new EDR-adjacent tool is deployed. A behavioral threshold calibrated for a smaller workforce stops firing after growth. Drift is insidious because a broken detection and a quiet environment are indistinguishable from the alert console. The countermeasures are mechanical: unit tests that assert the rule matches a synthetic positive on every build, health monitoring that alerts when a rule that normally fires weekly has been silent for a month, and periodic adversary emulation that fires the real technique and confirms the alert arrives.",
    why: "Most organizations discover their detections stopped working during the incident those detections existed to catch. Continuous validation is the difference between believing you have coverage and knowing it.",
    related: ["detection-as-code", "log-source-fidelity", "adversary-emulation", "purple-team", "detection-coverage-map"],
    mode: "motus"
  },
  {
    id: "threat-hunting-hypothesis",
    term: "Threat Hunting Hypothesis",
    domain: "Threat Hunting",
    short: "A falsifiable statement about adversary presence that specifies the data, the query, and what would prove it wrong before the hunt starts.",
    long: "Hunting without a hypothesis is browsing. A disciplined hunt states something like: if an adversary were using scheduled tasks for persistence on our finance servers, we would see task creation events referencing binaries outside standard install paths within the last ninety days. That formulation names the technique, the population, the data source, the query, and the disconfirming evidence. It produces value in three ways regardless of outcome — it may find the adversary, it will certainly reveal whether the data needed to answer the question even exists, and a negative result that was well specified should be converted into a permanent detection so the question never has to be asked manually again. Hunts that cannot be answered because the telemetry is missing are the most valuable findings of all.",
    why: "Hunting is the only activity that systematically discovers your visibility gaps before an adversary does, and hypothesis discipline is what separates it from expensive wandering. Every hunt should end with either a detection, a telemetry requirement, or a documented negative.",
    related: ["attack-technique", "detection-as-code", "log-source-fidelity", "pyramid-of-pain", "beaconing"],
    mode: "motus"
  },
  {
    id: "pyramid-of-pain",
    term: "Pyramid of Pain",
    domain: "Threat Intelligence",
    short: "David Bianco's ranking of indicator types by how much it costs an adversary when you detect on them.",
    long: "At the base sit hashes, which an attacker changes by recompiling — trivially. Above them, IP addresses and domain names, which cost money and minutes. Higher still, network and host artifacts, then tools, which cost real engineering time to replace. At the apex sit tactics, techniques, and procedures, which cost the adversary retraining and operational redesign. The lesson is not that low-tier indicators are useless — they are cheap, fast, and fine for blocking — but that a program whose detection weight sits entirely at the base is trivially evaded and will never impose cost. Mature programs invert the pyramid deliberately in where they invest engineering effort, while still consuming cheap indicators for automated blocking.",
    why: "It gives you a defensible allocation model for detection engineering effort and a way to explain to executives why an expensive threat feed of hashes does not make the company meaningfully harder to attack.",
    related: ["indicator-of-compromise", "attack-technique", "threat-hunting-hypothesis", "adversary-emulation", "detection-coverage-map", "detection-engineering", "mitre-attack", "kill-chain", "living-off-the-land"],
    mode: "both"
  },
  {
    id: "indicator-of-compromise",
    term: "Indicator of Compromise",
    domain: "Threat Intelligence",
    short: "An observable artifact — hash, address, filename, registry key — associated with a known intrusion.",
    long: "IOCs are the atoms of tactical threat intelligence: cheap to share, cheap to search for, and cheap for the adversary to change. Their proper use is retrospective and automated — sweep historical telemetry for them the moment an advisory lands, feed them to blocking controls, expire them on a schedule so your denylist does not become an archaeological record. Their improper use is as the backbone of a detection program. Two operational details matter more than most teams admit: an IOC without context (what campaign, what confidence, what date) is nearly unusable, and an IOC search is only as good as your retention window, which is why the ability to retrospectively hunt ninety days of history is worth more than any feed subscription.",
    why: "IOCs are the fastest way to answer the question every executive asks after a public advisory: were we affected. Being able to answer that in minutes rather than days is a capability you build in advance, not during the fire.",
    related: ["pyramid-of-pain", "kev", "forensic-timeline", "threat-hunting-hypothesis", "telemetry-pipeline", "detection-engineering", "dwell-time", "mitre-attack", "alert-fatigue"],
    mode: "novus"
  },
  {
    id: "beaconing",
    term: "Beaconing",
    domain: "Threat Detection",
    short: "The periodic call-home pattern of an implant checking in with its controller, detectable by the regularity of its timing.",
    long: "Implants must ask for instructions, and asking on a schedule creates a statistical signature: repeated connections to the same destination at near-constant intervals, with small and consistent payload sizes. Detection works on the distribution of inter-arrival times rather than on any single connection — low variance in the gaps, corrected for the jitter operators add deliberately. Modern tradecraft fights this by randomizing sleep, using long intervals measured in hours or days, blending into legitimate cloud and CDN destinations that cannot be blocked, and riding protocols such as DNS or HTTPS that must be allowed. That is why beacon hunting depends on flow records and DNS logs with long retention rather than on payload inspection, and why destination reputation is a weaker signal each year.",
    why: "Command and control is one of the few phases an intruder cannot skip, which makes it a durable detection anchor. Understanding the timing mechanism lets you evaluate honestly whether your network telemetry can support the analysis at all.",
    related: ["command-and-control", "telemetry-pipeline", "threat-hunting-hypothesis", "lateral-movement", "attack-technique"],
    mode: "motus"
  },
  {
    id: "command-and-control",
    term: "Command and Control",
    domain: "Adversary Tradecraft",
    short: "The channel an adversary uses to direct compromised systems and receive their output.",
    long: "C2 spans a spectrum of sophistication: direct connections to attacker-owned infrastructure at the crude end; domain fronting, legitimate SaaS abuse, and traffic riding inside allowed protocols in the middle; and fully out-of-band channels using cloud storage, collaboration platforms, or DNS at the sophisticated end. The defensive implication is that blocking by destination reputation degrades every year, because adversaries increasingly operate through infrastructure you cannot block without breaking the business. What remains durable is behavioral: which process is making the connection, whether that process has any business making it, and whether the timing pattern looks machine-generated. Egress control — default-deny outbound with an explicit allowlist for server workloads — is unfashionable and remains one of the highest-yield architectural controls available.",
    why: "Every intrusion that persists needs a channel, and constraining that channel raises adversary cost across the whole kill chain. Egress design is a decision made by architects long before an incident, and it determines how much room the adversary has once inside.",
    related: ["beaconing", "blast-radius", "lateral-movement", "containment", "attack-technique"],
    mode: "both"
  },
  {
    id: "lateral-movement",
    term: "Lateral Movement",
    domain: "Adversary Tradecraft",
    short: "The adversary's expansion from an initial foothold to the systems that actually hold value.",
    long: "Initial access is rarely where the value sits, so intruders move: harvesting credentials from memory or configuration files, abusing remote management protocols such as SMB, WMI, WinRM, SSH and RDP, riding trust relationships between domains, clouds, and SaaS tenants, and increasingly abusing identity rather than exploiting hosts. In cloud environments the movement is often a role assumption chain rather than a network hop, which means network segmentation alone does not contain it. Detection anchors on the improbable combination — this identity, this protocol, this source, this destination — rather than on the protocol itself, since all of these are legitimate administrative tools. Prevention is architectural: tiered administration, unique local credentials, workload identity with narrow trust, and segmentation that follows data value rather than office floors.",
    why: "The gap between one compromised laptop and a company-ending incident is entirely made of lateral movement. Every control that shrinks that gap converts a catastrophe into an inconvenience.",
    related: ["blast-radius", "least-privilege", "living-off-the-land", "workload-identity", "containment", "breakout-time", "privilege-escalation-path", "assume-breach"],
    mode: "both"
  },
  {
    id: "honeytoken",
    term: "Honeytoken",
    domain: "Deception",
    short: "A fake credential, record, or file that has no legitimate use, so any interaction with it is a high-confidence intrusion signal.",
    long: "A honeytoken inverts the base rate problem. Instead of trying to distinguish malicious from legitimate use of a real asset, you plant an asset with no legitimate use at all: an AWS access key in a config file that no service reads, a fictional customer record in the database, a domain admin account that never logs in, a document titled to attract an intruder browsing a file share. Any authentication attempt, query, or open is essentially certain to be adversarial. The engineering work is in the plumbing — the token must be discoverable along a realistic attacker path, its alert must route somewhere with an owner, and it must be documented so that a future engineer does not clean it up or, worse, use it. Coverage should follow the intrusion path: credential stores, code repositories, file shares, and directory objects.",
    why: "Honeytokens deliver the rarest thing in detection engineering — near-perfect precision at negligible cost — and they detect post-compromise activity you have no other signal for. A leader who has not deployed them is leaving free detection on the table.",
    related: ["canary-token", "base-rate-fallacy", "false-positive-economics", "lateral-movement", "secrets-sprawl"],
    mode: "both"
  },
  {
    id: "canary-token",
    term: "Canary Token",
    domain: "Deception",
    short: "A honeytoken implemented as a callback trigger — a URL, DNS name, or document that phones home the instant it is touched.",
    long: "Where a honeytoken is the general concept, a canary token is the specific implementation pattern: an artifact embedded with a unique callback that fires when opened, resolved, or authenticated against. Common forms include a Word or PDF document with a remote resource reference, a unique DNS name embedded in a config file, a cloud API key whose use triggers a provider alert, and a QR code or URL in a physical location. The callback carries context — source address, user agent, timestamp — which often reveals the adversary's egress infrastructure. Two operational cautions: the callback destination should not leak your organization's identity to the adversary, and tokens embedded in code repositories will fire on legitimate CI runs unless scoped carefully, which teaches you something useful about your own pipelines.",
    why: "Canary tokens are the cheapest form of detection you can deploy in an afternoon, and they detect exactly the phases — data staging, credential use, share browsing — where dwell time accumulates.",
    related: ["honeytoken", "secrets-sprawl", "double-extortion", "beaconing", "false-positive-economics"],
    mode: "novus"
  },
  {
    id: "purple-team",
    term: "Purple Team",
    domain: "Adversary Simulation",
    short: "Offense and defense executing techniques together in real time, optimizing for detection improvement rather than for a win.",
    long: "A red team engagement optimizes for objective achievement and reports at the end; a purple team exercise optimizes for learning and reports continuously. The operator executes a specific technique, announces it, and the defenders check whether telemetry captured it, whether a detection fired, whether the alert reached a human, and how long each step took. If it failed, the team fixes it and runs it again in the same session. The output is not a finding list but a set of merged detection rules, telemetry requirements, and measured detection latencies per technique. It works only when the red side is not scored on evasion and the blue side is not punished for gaps, which is a leadership decision about incentives, not a technical one.",
    why: "It is the fastest known loop for converting adversary knowledge into working detection, and it produces evidence of coverage that survives scrutiny. It also builds the working relationship you need in the first hour of a real incident.",
    related: ["adversary-emulation", "detection-drift", "attack-technique", "detection-coverage-map", "game-day", "detection-engineering", "mitre-attack", "control-decay", "tabletop-exercise", "d3fend"],
    mode: "motus"
  },
  {
    id: "adversary-emulation",
    term: "Adversary Emulation",
    domain: "Adversary Simulation",
    short: "Reproducing the specific tradecraft of a named threat actor against your own environment to test whether your defenses actually stop it.",
    long: "Emulation differs from generic penetration testing in that it starts from intelligence: a documented actor's tactics, techniques, and procedures are turned into an execution plan and run in sequence, in your environment, with your controls active. MITRE's public emulation plans and the ATT&CK Evaluations program formalized this. The value is specificity — you are no longer asking whether you are secure but whether you would detect this particular set of behaviors performed the way this actor performs them. The failure mode is emulating actors who have no plausible interest in your sector while ignoring the commodity ransomware affiliate that is far more likely to appear. Threat modeling should choose the actor, not fashion.",
    why: "It converts threat intelligence from a reading exercise into a control test, and it produces the only honest answer to the board question of whether you could withstand the actor currently in the news.",
    related: ["purple-team", "attack-technique", "detection-drift", "threat-modeling", "tabletop-exercise"],
    mode: "motus"
  },
  {
    id: "mttd",
    term: "MTTD",
    domain: "Operations Metrics",
    short: "Mean time to detect: the interval from the start of adversary activity to the moment a defender recognizes it.",
    long: "MTTD is only meaningful if the clock starts at the adversary's first action rather than at the first alert, which means it can only be computed retrospectively from forensic timelines. That constraint is what makes it honest and what makes it hard. Report it as a distribution, not a mean — a median of two hours with a long tail of ninety-day cases describes a very different program than a uniform two days, and the tail is where the company-ending incidents live. Segment it by detection source as well, because internally discovered intrusions and externally notified ones have profoundly different profiles; Mandiant's frontline data has consistently shown external notification cases running far longer than internal discovery.",
    why: "Detection speed bounds every downstream cost — data staged, systems encrypted, regulatory exposure. It is one of the few security metrics with a direct, arguable line to financial loss, which makes it the right thing to put in front of a board.",
    related: ["mttr", "dwell-time", "alert-triage-funnel", "false-positive-economics", "forensic-timeline", "goodharts-law", "base-rate", "alert-fatigue", "detection-engineering"],
    mode: "both"
  },
  {
    id: "mttr",
    term: "MTTR",
    domain: "Operations Metrics",
    short: "Mean time to respond, contain, or recover — three different clocks that are routinely conflated into one misleading number.",
    long: "Be specific about which R you mean. Time to respond is detection to first human action. Time to contain is detection to the point where adversary capability is removed or blocked. Time to recover is detection to restored normal service. Each has different drivers: response time is about paging and staffing, containment time is about pre-authorization and tooling reach, recovery time is about backup architecture and dependency mapping. Conflating them hides the actual constraint. The most common hidden constraint is authority rather than capability — the team could isolate the segment in five minutes but spends four hours getting permission, which is a governance defect that no tool purchase fixes.",
    why: "Containment speed is the variable with the steepest effect on loss magnitude in a ransomware event, and it is usually limited by pre-agreed authority rather than by technology. Measuring the components separately tells you which lever to pull.",
    related: ["mttd", "containment", "soar", "incident-commander", "rto"],
    mode: "both"
  },
  {
    id: "dwell-time",
    term: "Dwell Time",
    domain: "Operations Metrics",
    short: "The number of days an adversary is present in an environment before discovery — the industry's most-cited detection benchmark.",
    long: "Mandiant's M-Trends series has tracked global median dwell time for over a decade, from more than four hundred days in the early 2010s to eleven days in 2024 and fourteen days in 2025, with internal detection running far shorter than external notification. Read the improvement carefully: much of the historical compression came from the rise of ransomware, which announces itself, rather than from defenders getting proportionally better. Espionage and insider-threat intrusions still run for months. So dwell time is a useful directional benchmark and a dangerous single number — always ask which intrusion types are in the denominator and whether the median is hiding a long tail of quiet, high-consequence cases.",
    why: "It is the number executives and directors have heard of, which makes it the number you must be able to contextualize rather than merely quote. Explaining why your own tail matters more than the industry median is a credibility moment.",
    related: ["mttd", "mttr", "forensic-timeline", "double-extortion", "threat-hunting-hypothesis", "mean-time-to-detect", "breakout-time", "detection-engineering", "feedback-loop", "assume-breach"],
    mode: "both"
  },
  {
    id: "detection-coverage-map",
    term: "Detection Coverage Map",
    domain: "Detection Engineering",
    short: "A generated view of which adversary techniques you detect, prevent, or cannot see, with the evidence behind each claim.",
    long: "The common version is an ATT&CK Navigator layer colored by whether a rule exists. The useful version is generated from detection metadata in your repository, distinguishes prevention from detection from visibility-only, records the last date each claim was validated by emulation, and weights techniques by relevance to your threat model rather than treating all cells equally. Without those refinements the map becomes a self-congratulatory heat map: a technique with one narrow rule against dozens of known procedures shows the same green as one with genuine coverage. Pair the map with a validation date and it becomes an audit artifact; leave it hand-maintained and it becomes a lie you tell yourself annually.",
    why: "It is the artifact that turns the question of whether you are covered into a specific, checkable claim. It also makes gaps visible enough to fund, which is how detection engineering wins budget arguments.",
    related: ["attack-technique", "detection-as-code", "d3fend", "purple-team", "detection-drift"],
    mode: "motus"
  },
  {
    id: "sast",
    term: "SAST",
    domain: "Application Security",
    short: "Static analysis that inspects source or bytecode for vulnerable patterns without running the program.",
    long: "Static application security testing parses code into an intermediate representation and performs data-flow and taint analysis to find paths from untrusted input to dangerous sinks. It is unrivalled for finding whole classes of injection and unsafe API use early and cheaply, and it works on code paths that tests never reach. Its structural weakness is context: it cannot see the runtime configuration, the WAF in front, or whether the sink is genuinely reachable in production, so it over-reports. It is also blind to authorization logic, which is the defect class most likely to actually breach you. The determinant of success is not the scanner but the workflow — findings surfaced in the pull request with a fix suggestion get fixed; findings dumped into a quarterly report do not.",
    why: "SAST is the cheapest place to catch code-level defects, but only if it is tuned aggressively enough that developers trust it. A noisy scanner is worse than none, because it teaches the engineering organization to ignore security output.",
    related: ["dast", "sca", "cwe", "shift-left", "guardrail-vs-gate"],
    mode: "novus"
  },
  {
    id: "dast",
    term: "DAST",
    domain: "Application Security",
    short: "Dynamic testing that attacks a running application from the outside, seeing what actually responds rather than what is written.",
    long: "Dynamic application security testing exercises the deployed application: crawling, fuzzing parameters, replaying authenticated sessions, and observing responses. Because it tests the running system, its findings are exploitable by construction, which makes them far easier to get prioritized than static findings. Its weaknesses mirror SAST's strengths — coverage is limited to what the crawler reaches, single-page applications and complex authentication defeat naive crawlers, and it finds nothing in code paths behind feature flags or admin roles it cannot authenticate into. The modern practice is API-first: driving the scanner from an OpenAPI specification rather than a crawler, and running it against ephemeral environments in CI rather than once a year against production.",
    why: "DAST produces the findings that end arguments, because a working request and response is not debatable. Its coverage limits are the thing to be honest about — a clean DAST report means the crawler found nothing, not that the application is sound.",
    related: ["sast", "fuzzing", "bola", "ssrf", "idor"],
    mode: "novus"
  },
  {
    id: "sca",
    term: "SCA",
    domain: "Application Security",
    short: "Software composition analysis: identifying third-party components in a build and matching them to known vulnerabilities and licenses.",
    long: "SCA resolves the dependency graph — direct and transitive — and compares each component and version against vulnerability databases. Two things determine whether it is useful. First, resolution fidelity: reading a manifest file tells you what was requested, while inspecting the lockfile or the built artifact tells you what actually shipped, and the difference is where real risk hides. Second, reachability: most reported vulnerabilities in a large dependency tree are in code your application never calls, so a tool that reports raw CVE counts creates enormous work with little risk reduction. Combine SCA output with exploitation likelihood from EPSS, known exploitation from the KEV catalog, and reachability analysis, and the remediation list shrinks from thousands to a handful worth an engineer's afternoon.",
    why: "Modern applications are mostly other people's code, so this is where most of your vulnerability surface lives. The leadership skill is refusing to manage it by raw count, which is the default behavior of every tool in the category.",
    related: ["sbom", "transitive-dependency", "vex", "epss", "kev"],
    mode: "both"
  },
  {
    id: "fuzzing",
    term: "Fuzzing",
    domain: "Application Security",
    short: "Automatically feeding malformed or unexpected input to a program to provoke crashes, hangs, and memory errors.",
    long: "Fuzzing finds the bugs humans do not think to test for because it does not think at all — it generates enormous volumes of input and watches for abnormal termination. Paired with sanitizers such as AddressSanitizer, UndefinedBehaviorSanitizer, and MemorySanitizer, it detects memory corruption at the moment it occurs rather than when it eventually crashes, which turns a vague instability into a precise, reproducible defect with a stack trace. It is most effective on code that parses untrusted input in a memory-unsafe language — file format parsers, protocol decoders, media codecs, compression libraries — which is exactly the code that ends up in remote exploitation chains. Its output is a corpus and a set of crashers, both of which are permanent regression assets.",
    why: "For any organization that ships or embeds parsing code, fuzzing is the highest-yield vulnerability discovery method per engineer-hour, and it is continuous rather than point-in-time. Not fuzzing a parser you wrote is a choice to let someone else find those bugs first.",
    related: ["coverage-guided-fuzzing", "memory-safety", "exploit-mitigation", "cwe", "dast"],
    mode: "both"
  },
  {
    id: "coverage-guided-fuzzing",
    term: "Coverage-Guided Fuzzing",
    domain: "Application Security",
    short: "Fuzzing that instruments the target to measure code coverage and evolves inputs that reach new paths.",
    long: "Naive random fuzzing wastes essentially all its cycles being rejected by input validation. Coverage-guided fuzzers such as AFL++ and libFuzzer instrument the binary at compile time, keep a corpus of inputs that reached previously unseen edges, and mutate those inputs preferentially — a genetic algorithm whose fitness function is new coverage. This lets the fuzzer learn structure it was never told about, discovering magic bytes and checksums by hill-climbing. Practical leverage comes from three things: writing narrow harnesses that call a single parsing entry point rather than the whole program, seeding with a realistic corpus, and running continuously in CI so every commit is fuzzed. Google's OSS-Fuzz has run this model across thousands of open-source projects and found tens of thousands of defects.",
    why: "It is the difference between a fuzzing program that finds shallow bugs in a week and one that keeps finding deep bugs for years. Understanding the coverage feedback loop tells you where to spend harness-writing effort, which is the real scarce resource.",
    related: ["fuzzing", "memory-safety", "reproducible-build", "cwe", "shift-left"],
    mode: "motus"
  },
  {
    id: "memory-safety",
    term: "Memory Safety",
    domain: "Software Assurance",
    short: "The property that a program cannot read or write memory outside the bounds and lifetime of its intended objects.",
    long: "Memory-unsafe languages such as C and C++ permit buffer overflows, use-after-free, double free, and type confusion, and those defect classes have accounted for roughly two-thirds of severe vulnerabilities in large codebases at Microsoft and Google over multiple years of measurement. Memory-safe languages — Rust, Go, Java, C#, Swift, Python — eliminate most of these by construction through ownership rules, bounds checking, or garbage collection. CISA and international partners have pushed vendors to publish memory-safe roadmaps, and Google has reported that concentrating new code in safe languages drives down vulnerability density sharply even while old unsafe code remains, because most defects are found in recently written code. That last observation is the strategic key: you do not need to rewrite everything, you need to stop adding to the unsafe pile.",
    why: "This is one of the few decisions in security with an order-of-magnitude effect on defect density, and it is made by engineering leadership, not by the security team. Framing language choice as a security investment is a conversation a CISO must be able to have with a CTO.",
    related: ["fuzzing", "exploit-mitigation", "cwe", "coverage-guided-fuzzing", "secure-defaults"],
    mode: "both"
  },
  {
    id: "cwe",
    term: "CWE",
    domain: "Software Assurance",
    short: "Common Weakness Enumeration: the taxonomy of defect types, as distinct from CVE which names specific vulnerable products.",
    long: "A CVE is an instance; a CWE is the class. CWE-79 is cross-site scripting, CWE-89 is SQL injection, CWE-416 is use-after-free, CWE-639 is authorization bypass through a user-controlled key. MITRE publishes the annual Top 25 Most Dangerous Software Weaknesses derived from CVE and CVSS data, and the KEV catalog's exploitation data makes the ranking sharper each year. The operational use is pattern analysis: mapping your own findings to CWE tells you whether you have a random assortment of bugs or a systemic gap — twelve instances of CWE-639 across four teams is not twelve bugs, it is one missing authorization abstraction and a training problem. D3FEND 1.0 incorporated CWE modeling specifically to support this kind of reasoning.",
    why: "Fixing instances is engineering; fixing classes is leadership. CWE is the vocabulary that lets you spot the class, and class-level fixes are the only ones that scale across a growing codebase.",
    related: ["sast", "idor", "bola", "memory-safety", "d3fend"],
    mode: "both"
  },
  {
    id: "idor",
    term: "IDOR",
    domain: "Web Security",
    short: "Insecure direct object reference: exposing an internal identifier that a user can change to reach another user's data.",
    long: "The pattern is simple enough to be missed everywhere. An endpoint accepts an object identifier from the client, uses it to fetch a record, and returns the record without checking that the requesting principal is entitled to it. Incrementing an invoice number, swapping an account ID, or altering a document reference then walks straight through. It survives because functional tests are written from the perspective of a legitimate user who never tries someone else's ID, and because scanners cannot infer intended ownership rules. Unguessable identifiers such as UUIDs reduce casual discovery but are not an access control — identifiers leak through logs, referrers, exports, and support tickets. The only real fix is an authorization check bound to the data access itself, ideally in a shared layer no endpoint can bypass.",
    why: "IDOR and its API sibling BOLA are among the most reliably present and most damaging defect classes in modern applications, and they are invisible to most automated tooling. Making authorization a platform primitive rather than a per-endpoint decision is the architectural answer.",
    related: ["bola", "confused-deputy", "least-privilege", "cwe", "dast"],
    mode: "novus"
  },
  {
    id: "bola",
    term: "BOLA",
    domain: "API Security",
    short: "Broken object level authorization — IDOR at API scale, and the number one entry in the OWASP API Security Top 10.",
    long: "OWASP ranks BOLA as API1:2023 because APIs make the problem structurally worse. A server-rendered application often derives context from session state; an API receives object identifiers as parameters on nearly every call and, as OWASP puts it, relies on those parameters rather than fully tracking client state. Multiply that by hundreds of endpoints, several client teams, and a microservice mesh where the authorization check may live in any of five services or none, and the odds that every path checks correctly approach zero. Prevention that works is structural: a single authorization component invoked at the data layer, identifiers that are unpredictable, and automated tests that replay every endpoint with a second tenant's token and assert denial.",
    why: "This is the defect class most likely to produce a mass data exposure without any exploit code, malware, or anomaly your detection stack would notice. It reads as normal API traffic, which is precisely why it must be prevented in design rather than detected in operation.",
    related: ["idor", "confused-deputy", "least-privilege", "dast", "threat-modeling"],
    mode: "both"
  },
  {
    id: "ssrf",
    term: "SSRF",
    domain: "Web Security",
    short: "Server-side request forgery: tricking a server into making attacker-chosen requests from its own privileged network position.",
    long: "An application that fetches a user-supplied URL — for a webhook, an image import, a PDF render, a link preview — can be pointed inward: at localhost services, at internal admin panels, at the cloud metadata endpoint that hands out instance credentials. The 2019 Capital One breach is the canonical case, where SSRF against a metadata service yielded role credentials that were used to read data from storage. Naive defenses fail predictably: denylists miss encodings, decimal and IPv6 notations, and DNS rebinding where the name resolves benignly at validation time and maliciously at fetch time. Effective defense is layered — resolve and validate the address at connection time, forbid redirects, egress-proxy all outbound fetches through a component with an explicit allowlist, and require the metadata service to demand a session token that a blind request cannot supply.",
    why: "SSRF is the bridge from an ordinary web bug to full cloud compromise, because in cloud environments the network position of a server is itself a credential. Any feature that fetches a URL deserves a design review, not a scanner rule.",
    related: ["blast-radius", "workload-identity", "least-privilege", "command-and-control", "cwe"],
    mode: "both"
  },
  {
    id: "insecure-deserialization",
    term: "Insecure Deserialization",
    domain: "Application Security",
    short: "Reconstructing objects from untrusted serialized data, letting an attacker choose which code runs during reconstruction.",
    long: "Native serialization formats in Java, .NET, Python pickle, PHP, and Ruby do not merely carry data — they carry type information and invoke constructors, setters, and lifecycle hooks as objects are rebuilt. An attacker who controls the byte stream therefore controls which classes are instantiated, and gadget chains assembled from methods in libraries already on the classpath can reach arbitrary code execution without any attacker-supplied code. This is the mechanism behind a long line of severe vulnerabilities in enterprise middleware. Mitigations that half-work include class allowlists and look-ahead deserialization filters; the mitigation that works is not deserializing untrusted input with these formats at all, preferring plain data formats such as JSON parsed into explicit schemas, with integrity protection if the data round-trips through a client.",
    why: "It is a defect class that yields remote code execution from what looks like a data-handling decision, and it hides in framework defaults chosen years ago. Knowing to ask which serialization format crosses a trust boundary is a design review reflex worth training.",
    related: ["cwe", "sast", "threat-modeling", "memory-safety", "secure-defaults"],
    mode: "motus"
  },
  {
    id: "race-condition",
    term: "Race Condition",
    domain: "Application Security",
    short: "A defect where the outcome depends on the timing of concurrent operations, allowing an attacker to break an invariant by acting in the gap.",
    long: "Security-relevant races usually appear where a check and an action are separated by any window at all: verifying a balance then deducting it, validating a coupon then redeeming it, checking a rate limit then incrementing it. Concurrency turns a single-use operation into a multi-use one — send fifty simultaneous requests and several may pass the check before any commits. Web-scale exploitation is easier than it sounds, since HTTP/2 single-packet techniques can land many requests within a very narrow window. The fixes are database and design fixes rather than application patches: atomic compare-and-set operations, unique constraints that make double-spend impossible at the storage layer, idempotency keys, and pessimistic locking on the specific resource rather than optimistic hope.",
    why: "Races produce direct financial loss without tripping any security alarm, because every individual request is well-formed and authorized. They are also invisible to scanners, which means they must be caught in design review and load testing.",
    related: ["toctou", "cwe", "threat-modeling", "sast", "dast"],
    mode: "motus"
  },
  {
    id: "toctou",
    term: "TOCTOU",
    domain: "Application Security",
    short: "Time-of-check to time-of-use: the specific race in which a resource is validated and then used, with the resource changing in between.",
    long: "The classic form is filesystem-based. A privileged program checks that a path is a regular file the user owns, then opens it; between those two operations the user replaces the path with a symbolic link to a sensitive file, and the privileged open follows it. The generalization is broader than files: verifying a token then loading the user record, checking a container image digest then pulling by mutable tag, validating a URL then resolving it again at fetch time (which is how DNS rebinding defeats SSRF filters). The correct pattern is to eliminate the window by operating on a handle rather than a name — open the file descriptor first and check its properties, pin the image by digest, resolve the address once and connect to that address.",
    why: "TOCTOU is the reason so many validation controls fail in production despite reading correctly in code review. The rule to internalize is that validating a name and then using the name are two different operations on possibly two different objects.",
    related: ["race-condition", "ssrf", "cwe", "confused-deputy", "threat-modeling"],
    mode: "motus"
  },
  {
    id: "confused-deputy",
    term: "Confused Deputy",
    domain: "Access Control",
    short: "A privileged component tricked into misusing its authority on behalf of a less privileged caller.",
    long: "Norm Hardy's 1988 framing names a permanent structural hazard: whenever component A holds authority that caller B lacks, and A acts on B's instructions without carrying B's identity, A can be used as a weapon. The pattern recurs constantly — a CI runner with deployment credentials executing a contributor's pull request code, a service account that queries any customer's data acting on an unvalidated tenant parameter, an SSRF-vulnerable server borrowing its own network position, a cloud role assumed cross-account without an external ID. The remedy is to carry the caller's authority rather than the deputy's: pass a scoped, delegated credential, or make the deputy check the caller's entitlement against the specific object before acting. This is exactly what OAuth token scoping and cloud confused-deputy protections are designed to enforce.",
    why: "It is the shared skeleton beneath SSRF, BOLA, CI compromise, and most cross-tenant failures. Recognizing the pattern lets you fix a class of problems that otherwise appears as an endless series of unrelated bugs.",
    related: ["ssrf", "bola", "pwn-request", "least-privilege", "workload-identity", "trust-boundary", "oauth", "rebac", "tool-authorization", "indirect-prompt-injection", "gateway-trust", "safe-module"],
    mode: "both"
  },
  {
    id: "least-privilege",
    term: "Least Privilege",
    domain: "Access Control",
    short: "Granting exactly the authority a principal needs for its task, for exactly as long as it needs it, and no more.",
    long: "The principle is old and universally endorsed, which is why its practical failure modes deserve attention rather than its definition. Privilege accretes: people change roles and keep old access, service accounts get a broader role during an outage and never get narrowed, and wildcard permissions are granted because enumerating the real ones takes an afternoon. The mechanisms that actually work are automated rather than aspirational — deriving policy from observed usage over a window, time-bound just-in-time elevation with an approval trail, expiring grants by default, and continuously reporting the delta between granted and used permissions. Note the tradeoff honestly: aggressive least privilege creates operational friction and outages, so it needs a fast, reliable escalation path or engineers will route around it with a shared admin credential.",
    why: "It is the single control that most directly shrinks blast radius, and it is the one most quietly eroded by ordinary operational pressure. Measuring the granted-versus-used gap turns a principle into a program with a trend line.",
    related: ["blast-radius", "workload-identity", "lateral-movement", "exception-management", "secure-defaults", "just-in-time-access", "privilege-escalation-path", "entitlement-review", "separation-of-duties"],
    mode: "both"
  },
  {
    id: "secure-defaults",
    term: "Secure Defaults",
    domain: "Platform Security",
    short: "Making the safe configuration the one you get without asking, so that insecurity requires a deliberate act.",
    long: "Defaults are the highest-leverage control in any platform because most consumers never change them. Encryption on by default, public access blocked by default, TLS required by default, deny-by-default network policy, MFA enforced at creation, logging enabled at provisioning. The economics are decisive: a default protects every future service without any individual team doing anything, whereas a policy requiring teams to configure security correctly must be re-enforced forever against turnover and deadline pressure. The organizational challenge is migration — flipping a default breaks existing consumers, so the pattern is to make it default for new resources, measure the non-compliant population, and drive it down with a deprecation timeline rather than a big-bang change that gets rolled back after the first outage.",
    why: "Configuration errors remain a leading breach cause, and defaults are how you eliminate an entire failure class rather than auditing for it forever. Owning the defaults of your platform is worth more than owning the audit of its exceptions.",
    related: ["paved-road", "guardrail-vs-gate", "least-privilege", "exception-management", "memory-safety"],
    mode: "both"
  },
  {
    id: "paved-road",
    term: "Paved Road",
    domain: "Platform Security",
    short: "A supported, opinionated path through building and shipping software on which the secure choices are already made.",
    long: "The paved road is a product the security and platform teams build for engineers: templated services with authentication, authorization, logging, secret management, dependency policy, and deployment already wired. Teams that stay on the road inherit controls for free and get faster; teams that leave it accept documented additional obligations. The idea, popularized by Netflix, works because it aligns incentives — the secure path is also the fastest path, so adoption does not require enforcement. It fails when the road is slower or less capable than the alternative, at which point it becomes shelfware and the security team resorts to gates. The measurable health indicator is the fraction of production services on the road, tracked over time, and the reasons given by teams that left.",
    why: "You cannot review your way to security at scale, and you cannot mandate your way there either. Building the road converts security from a tax on every team into infrastructure that compounds, which is the only model that survives organizational growth.",
    related: ["guardrail-vs-gate", "secure-defaults", "security-champion", "shift-left", "exception-management", "requisite-variety", "leverage-point", "safety-ii", "security-debt", "workload-identity"],
    mode: "both"
  },
  {
    id: "guardrail-vs-gate",
    term: "Guardrail vs Gate",
    domain: "Platform Security",
    short: "The choice between a control that constrains at runtime without stopping delivery and one that blocks a pipeline until a human approves.",
    long: "A gate halts progress pending review: an approval before production, a scan that must pass, a change board. Gates provide strong assurance at a specific moment and impose queueing delay, which engineers route around under deadline. A guardrail constrains the space of possible actions instead: a service control policy that makes a public bucket impossible to create, an admission controller that rejects privileged containers, a network policy that denies undeclared egress. Guardrails scale without human attention and cannot be socially negotiated at eleven at night. The mature posture uses guardrails for anything expressible as policy, reserves gates for genuinely irreversible or novel decisions, and measures how long each gate holds work — because an unmeasured gate becomes a rubber stamp that provides assurance theater and delay in equal measure.",
    why: "How you distribute control between guardrails and gates determines whether security is experienced as infrastructure or as bureaucracy, and it determines whether your controls survive the quarter-end release crunch.",
    related: ["paved-road", "secure-defaults", "shift-left", "exception-management", "sast"],
    mode: "motus"
  },
  {
    id: "security-champion",
    term: "Security Champion",
    domain: "Program Design",
    short: "An engineer embedded in a delivery team who carries security context, judgment, and a direct line to the security organization.",
    long: "Champions solve a structural problem: security teams are outnumbered by engineers by one or two orders of magnitude and lack the domain knowledge of each system. A champion knows their own codebase, attends design discussions where risk is created, triages findings with context a scanner lacks, and escalates the small number of things that genuinely need specialist attention. The programs that work give champions three concrete things — protected time measured in hours per week, real training and access to the security team's tooling, and visible career recognition. The programs that fail appoint volunteers, hand them a badge and a newsletter, and quietly convert them into unpaid ticket routers. Measure the program by the fraction of design decisions influenced early, not by the number of champions appointed.",
    why: "Scaling security judgment is harder than scaling security tooling, and champions are the only mechanism that puts judgment where decisions are actually made. They are also your best internal hiring pipeline.",
    related: ["paved-road", "threat-modeling", "shift-left", "guardrail-vs-gate", "blameless-post-mortem"],
    mode: "both"
  },
  {
    id: "threat-modeling",
    term: "Threat Modeling",
    domain: "Design Security",
    short: "A structured examination of what you are building, what can go wrong, what you will do about it, and whether you did a good enough job.",
    long: "Adam Shostack's four questions are the durable formulation, and they matter more than any specific methodology. Draw the system with its trust boundaries, enumerate what an adversary could do at each boundary using a prompt such as STRIDE or a technique catalog, decide which of those you will mitigate, accept, or transfer, and record the decision. The practical failure is scope and cadence: modeling everything annually produces stale documents, while modeling every change exhausts the team. What works is triggering on architectural change — a new trust boundary, a new data classification, a new external dependency, a new authentication path — and timeboxing the session to an hour with the engineers who will implement the outcome in the room.",
    why: "It is the only security activity that can remove a vulnerability class before it exists, at a cost measured in hours rather than in incident response. It is also where you learn what your engineers actually believe about their own system.",
    related: ["attack-technique", "blast-radius", "security-champion", "adversary-emulation", "business-impact-analysis"],
    mode: "both"
  },
  {
    id: "shift-left",
    term: "Shift Left",
    domain: "Program Design",
    short: "Moving security activity earlier in the delivery lifecycle, where defects are cheaper to fix and design is still fluid.",
    long: "The insight is real: a design flaw caught in a whiteboard session costs a conversation, the same flaw caught in production costs an incident. The term has been degraded, though, into a justification for pushing tool output onto developers without changing anything about who owns remediation or how noisy the tools are. Shifting left legitimately means three things — security participation in design, fast and precise feedback inside the developer's existing workflow, and secure primitives available so the fix is a library call rather than a research project. Shifting left illegitimately means a scanner in CI that fails builds on unreachable transitive findings, which trains engineers to disable it. Note also that left is not everywhere: runtime detection cannot be shifted left, and organizations that overcorrect end up with excellent pipelines and no operational visibility.",
    why: "It is a genuine cost argument and a frequently abused slogan, so a leader must be able to tell the difference. The test is simple — did the change reduce total engineering time spent on security defects, or merely relocate the pain.",
    related: ["paved-road", "guardrail-vs-gate", "sast", "threat-modeling", "security-champion"],
    mode: "novus"
  },
  {
    id: "sbom",
    term: "SBOM",
    domain: "Supply Chain",
    short: "A machine-readable inventory of the components inside a piece of software, with versions and relationships.",
    long: "A software bill of materials, in SPDX or CycloneDX format, lists what is in a build and how components relate. Its highest-value use is speed of answer: when a Log4Shell-class event lands, the question of which of your four hundred services contains the vulnerable version should take minutes, not a week of engineering surveys. The quality determinant is generation point — an SBOM produced from a manifest describes intent, one produced from the built artifact or container image describes reality, and the second is the one that matters. Executive Order 14028 and subsequent US federal acquisition guidance made SBOMs a procurement expectation, but possessing a supplier's SBOM changes nothing unless you ingest it, diff it across releases, and can query the whole estate at once.",
    why: "Inventory is the precondition for every other supply chain control, and the absence of it converts each new critical dependency vulnerability into an expensive fire drill. The maturity question is not whether you have SBOMs, it is how fast you can query them.",
    related: ["sca", "vex", "transitive-dependency", "provenance-attestation", "supply-chain-attack", "slsa", "provenance", "cisa-kev", "attack-surface"],
    mode: "both"
  },
  {
    id: "vex",
    term: "VEX",
    domain: "Supply Chain",
    short: "A vulnerability exploitability exchange statement asserting whether a specific product is actually affected by a specific vulnerability.",
    long: "An SBOM says the vulnerable library is present; a VEX document says whether it matters here. Its four core statuses are not affected, affected, fixed, and under investigation, with a required justification when claiming not affected — for example that the vulnerable code is not present in the build, not reachable from any entry point, or already mitigated by configuration. This closes the most expensive loop in vulnerability management, where a supplier's customers each independently discover the same finding and each independently open a support ticket. Producing VEX for your own products is a discipline test: it forces someone to make and record a defensible reachability determination rather than leave the question open forever.",
    why: "Without VEX, SBOM adoption generates enormous false-positive workload across the whole ecosystem and discourages the transparency it was meant to create. Being able to issue credible VEX statements is becoming a differentiator in enterprise procurement.",
    related: ["sbom", "sca", "epss", "kev", "exception-management"],
    mode: "motus"
  },
  {
    id: "slsa",
    term: "SLSA",
    domain: "Supply Chain",
    short: "Supply-chain Levels for Software Artifacts: a graduated framework of build integrity requirements, L0 through L3.",
    long: "SLSA's build track defines what you must be able to prove about how an artifact was produced. L0 is no guarantees. L1 requires automatically generated provenance describing the build, distributed to consumers. L2 adds a hosted build platform that generates and signs the provenance itself, so post-build tampering becomes detectable. L3 hardens the platform so builds cannot influence one another and the signing key material is unreachable from user-defined build steps — which is the level that actually defends against a compromised build script stealing the signing identity. The important framing is that SLSA describes the build platform's properties, not the code's quality: a level 3 build of malicious source is still malicious, faithfully attested.",
    why: "It gives you a shared vocabulary for build integrity that can be written into supplier requirements and measured internally. Knowing what each level does and does not buy prevents you from paying for L3 assurance on a threat model that L2 already covered.",
    related: ["provenance-attestation", "in-toto", "sigstore", "reproducible-build", "pwn-request", "provenance", "sbom", "supply-chain-attack", "root-of-trust", "paved-road"],
    mode: "both"
  },
  {
    id: "in-toto",
    term: "in-toto",
    domain: "Supply Chain",
    short: "A framework and attestation format for cryptographically binding statements about software to the artifacts they describe.",
    long: "in-toto originated as a way to enforce a software supply chain layout — declaring which steps must occur, in what order, by which authorized functionaries — and to verify at the end that the delivered artifact is the product of exactly that chain. Its Attestation Framework is now the substrate the wider ecosystem builds on: an envelope containing a subject (the artifact, identified by digest), a predicate type (what kind of claim is being made), and the predicate body. SLSA provenance is one predicate type among many; others cover test results, vulnerability scan outcomes, and review approvals. The design insight is separating the transport and identity problem from the semantics of the claim, so new kinds of assertion can be added without new plumbing.",
    why: "It is the format your policy engine will consume when you start requiring evidence about artifacts rather than trust in pipelines. Understanding subject-plus-predicate structure is what lets you write admission policies that mean something.",
    related: ["slsa", "provenance-attestation", "sigstore", "sbom", "reproducible-build"],
    mode: "motus"
  },
  {
    id: "provenance-attestation",
    term: "Provenance Attestation",
    domain: "Supply Chain",
    short: "A signed statement recording what source, what builder, and what parameters produced a specific artifact digest.",
    long: "Provenance answers the question that matters after any pipeline compromise: where did this exact binary come from. A useful attestation names the builder identity, the source repository and commit, the build entry point and parameters, the resolved dependencies, and the artifact digest — all signed by the build platform rather than the developer. Its value is entirely in verification: attestations that are generated and never checked are decoration. The consuming end is an admission or deployment policy that refuses artifacts whose provenance does not show the expected repository, the expected builder identity, and a protected branch. That check is what turns provenance from a compliance artifact into an actual control against an attacker who pushes a build from an unauthorized path.",
    why: "It is how you make the deploy decision on evidence rather than on the assumption that whatever landed in the registry got there legitimately. The discipline of verifying, not merely producing, is where most programs stop short.",
    related: ["slsa", "in-toto", "sigstore", "reproducible-build", "supply-chain-attack"],
    mode: "motus"
  },
  {
    id: "sigstore",
    term: "Sigstore",
    domain: "Supply Chain",
    short: "Keyless signing infrastructure that binds signatures to OIDC identities using short-lived certificates and a public transparency log.",
    long: "Sigstore removes the hardest part of code signing, which is key custody. The signer authenticates with an OIDC identity — a developer email or, more usefully, a CI workflow identity — and Fulcio issues a certificate valid for minutes that is bound to that identity and an ephemeral key. The signing happens, the key is discarded, and the whole event is recorded in Rekor, an append-only transparency log. Verification then checks that the certificate was valid at the time of signing, as proven by the log entry, and that the identity matches policy. The security property that matters is auditability: an identity owner can monitor the log for signatures they did not make, which converts a silent key compromise into a detectable event. The tradeoff is dependence on public infrastructure and on the identity provider, which is why high-assurance users run private instances.",
    why: "It makes signing achievable for organizations that would never successfully operate an HSM-backed signing ceremony, and its workflow-identity binding is what lets you write policies about which pipeline may produce a deployable artifact.",
    related: ["provenance-attestation", "slsa", "in-toto", "oidc-federation", "workload-identity"],
    mode: "motus"
  },
  {
    id: "reproducible-build",
    term: "Reproducible Build",
    domain: "Supply Chain",
    short: "A build that produces a bit-for-bit identical artifact from the same source, allowing independent parties to verify nothing was inserted.",
    long: "Reproducibility requires eliminating every source of nondeterminism: embedded timestamps, build paths, locale and environment variables, filesystem ordering, parallelism-dependent output, and unpinned dependency resolution. The payoff is a verification model that does not require trusting the builder — several independent rebuilders produce the artifact and compare digests, so a compromised build machine inserting a backdoor is caught by disagreement. This is the strongest available answer to the SolarWinds-class attack, where the source was clean and the build was subverted. It is also expensive, and partial adoption still helps: even reproducibility within your own infrastructure lets you detect a compromised builder by rebuilding on a second, isolated one.",
    why: "It is the difference between trusting your build pipeline and being able to verify it, and it is one of the few controls that defends against an attacker who already owns your CI. Knowing why it is hard tells you where nondeterminism is hiding in your own toolchain.",
    related: ["slsa", "provenance-attestation", "in-toto", "supply-chain-attack", "coverage-guided-fuzzing"],
    mode: "motus"
  },
  {
    id: "dependency-confusion",
    term: "Dependency Confusion",
    domain: "Supply Chain",
    short: "Publishing a package with an internal name to a public registry at a higher version, so the build resolves to the attacker's copy.",
    long: "Alex Birsan's 2021 research demonstrated the mechanism at scale. Many package managers, when configured with both an internal index and the public one, resolve by choosing the highest version found across sources rather than preferring the internal source. Publishing a package named after a company's internal library with a version such as 9000.0.0 therefore wins resolution, and install-time hooks execute attacker code inside the build. Birsan found internal package names embedded in public JavaScript bundles and in leaked manifests, and the technique produced callbacks from more than thirty-five organizations including Apple, PayPal, and Microsoft, with individual bounties in the tens of thousands. The durable fixes are scoped namespaces reserved on the public registry, explicit source pinning per dependency, and a proxy configured to never fall through to public for internal namespaces.",
    why: "It is a name-resolution flaw rather than a code flaw, so no amount of code review finds it, and its blast radius is the build system itself. Verifying your own resolution behavior is a one-afternoon test with a very asymmetric payoff.",
    related: ["typosquatting", "transitive-dependency", "supply-chain-attack", "sbom", "sca"],
    mode: "both"
  },
  {
    id: "typosquatting",
    term: "Typosquatting",
    domain: "Supply Chain",
    short: "Registering package or domain names that resemble legitimate ones, harvesting installs and visits from human error.",
    long: "In package ecosystems the attacker publishes something a keystroke away from a popular library — a transposed letter, a missing hyphen, a singular where the original is plural, or a name that matches a common misremembering. Install scripts then run in the developer's environment or the CI runner, which is often the most credential-rich machine in the organization. The same logic drives domain typosquatting for phishing and for credential harvesting against internal tools. Registry operators have improved detection, but the ecosystem's scale means new variants appear continuously, and generative tooling that suggests plausible-sounding package names has added a new vector where a hallucinated dependency name is registered by an attacker in advance. Defenses are dull and effective: lockfiles with integrity hashes, an internal proxy with an allowlist, and disabling install scripts by default.",
    why: "The compromise lands on developer laptops and build agents, which sit inside every trust boundary you have. Treating the developer environment as a production-tier asset follows directly from understanding this vector.",
    related: ["dependency-confusion", "supply-chain-attack", "transitive-dependency", "sca", "secrets-sprawl"],
    mode: "novus"
  },
  {
    id: "transitive-dependency",
    term: "Transitive Dependency",
    domain: "Supply Chain",
    short: "A component you did not choose, pulled in by a component you did, several levels deep.",
    long: "A typical application declares a few dozen direct dependencies and ends up with hundreds or thousands of packages in the resolved graph. Most of your vulnerability findings will be transitive, which creates two hard problems. First, remediation is indirect — you often cannot upgrade the vulnerable package without waiting for an intermediate maintainer, so the practical tools are version overrides, forks, or removal of the direct dependency entirely. Second, reachability matters enormously: the vulnerable function in a deeply nested package is frequently never invoked by any path your code takes, so raw counts massively overstate real exposure. The strategic move is reducing graph size — fewer, larger, better-maintained dependencies beat many small ones — and tracking maintenance health, since an unmaintained transitive package is a future incident with no patch available.",
    why: "This is where the arithmetic of modern vulnerability management breaks down and where prioritization discipline earns its keep. It is also the shape of the risk you are accepting every time an engineer adds a convenience library.",
    related: ["sca", "sbom", "vex", "dependency-confusion", "supply-chain-attack"],
    mode: "novus"
  },
  {
    id: "pwn-request",
    term: "Pwn Request",
    domain: "CI/CD Security",
    short: "A CI workflow that runs untrusted pull request code in a privileged context, handing repository write and secrets to any contributor.",
    long: "GitHub's pull_request_target trigger exists so workflows can access secrets and write permissions when handling pull requests from forks. The vulnerability appears when such a workflow explicitly checks out the pull request's head — the untrusted code — and then builds, tests, or installs it. Execution follows through many paths: a modified build script, a package install hook, a test file, a tampered manifest. The result is arbitrary code execution in a runner holding repository write access and every secret the workflow can read, which is a full supply chain compromise reachable by anyone who can open a pull request. GitHub's Security Lab prescribes the two-workflow pattern: build untrusted code with the ordinary pull_request trigger and no secrets, then process the resulting artifact in a separate privileged workflow_run job.",
    why: "It is a confused deputy living in nearly every open-source and inner-source repository, and it converts a public contribution surface into a direct path to production artifacts. Auditing your own workflow triggers is a concrete, finishable task with outsized payoff.",
    related: ["confused-deputy", "oidc-federation", "secrets-sprawl", "supply-chain-attack", "slsa"],
    mode: "motus"
  },
  {
    id: "oidc-federation",
    term: "OIDC Federation",
    domain: "Identity",
    short: "Exchanging a short-lived, provider-issued identity token for cloud credentials, eliminating long-lived secrets in CI.",
    long: "Instead of storing a cloud access key in a CI secret, the pipeline requests an OIDC token from its platform. That token carries verifiable claims — repository, branch or tag, workflow file, environment — and the cloud provider, configured to trust that issuer, exchanges it for temporary credentials scoped by a trust policy. The security gain is twofold: there is no static secret to steal, and the trust policy can be written to constrain which repository and which branch may assume which role. That second property is where implementations fail. A trust policy that matches only the organization, or uses a wildcard on the subject claim, lets any repository or any branch in the org assume the role, which quietly recreates the shared credential you were trying to eliminate. Always pin the subject condition to the exact repository and ref, and use a string equality operator rather than a wildcard match.",
    why: "It removes the most commonly leaked class of credential from your build systems, and the subject-condition detail is the kind of specific knowledge that separates a control that works from one that only looks modern.",
    related: ["workload-identity", "secrets-sprawl", "sigstore", "pwn-request", "least-privilege"],
    mode: "motus"
  },
  {
    id: "secrets-sprawl",
    term: "Secrets Sprawl",
    domain: "Identity",
    short: "The accumulation of credentials across repositories, CI configuration, images, wikis, tickets, and chat, with no owner or expiry.",
    long: "Secrets propagate by copy. A key generated once ends up in a repository, a container layer, an environment file on a laptop, a ticket where someone pasted it while debugging, and a chat thread. Detection scanning finds some of it, but the harder truth is that finding a leaked secret is the easy half — rotating it requires knowing every consumer, and that knowledge usually does not exist, which is why leaked credentials stay valid for months after discovery. The structural fix is removing the long-lived secret from existence: workload identity and OIDC federation for machine-to-machine access, dynamic short-lived credentials from a secret manager, and mandatory expiry so that an undiscovered leak self-heals. Pair that with pre-commit and CI scanning, and with a rehearsed rotation runbook per secret class so the response is minutes rather than weeks.",
    why: "Valid credentials are the most reliable initial access vector in breach data, and most of them were not stolen from a user, they were found lying in a repository or an image layer. Every long-lived secret you delete is a permanent reduction in attack surface.",
    related: ["oidc-federation", "workload-identity", "honeytoken", "typosquatting", "least-privilege"],
    mode: "both"
  },
  {
    id: "workload-identity",
    term: "Workload Identity",
    domain: "Identity",
    short: "Giving a running service a cryptographically attested identity of its own, rather than a shared secret it must carry.",
    long: "The pattern replaces bearer secrets with attestation: the platform vouches for what the workload is — this Kubernetes service account, this instance, this pod — and the workload receives short-lived credentials on that basis. SPIFFE and its SPIRE implementation formalize this with a workload identity document issued after node and workload attestation; cloud providers offer equivalents through instance and service account identity. The security gains are that credentials cannot be exfiltrated for reuse elsewhere because they are bound and short-lived, and that authorization can be expressed per workload rather than per environment. The tradeoff is that the attestation root becomes critical infrastructure, and a compromise of the node agent or metadata service — which is exactly what SSRF targets — undermines the whole model, so protecting that path is non-negotiable.",
    why: "It is the identity foundation that makes real least privilege and real segmentation achievable in dynamic infrastructure, where network location has stopped being a meaningful boundary.",
    related: ["oidc-federation", "secrets-sprawl", "least-privilege", "ssrf", "blast-radius", "spiffe", "service-account", "mtls", "zero-trust", "provenance"],
    mode: "both"
  },
  {
    id: "supply-chain-attack",
    term: "Supply Chain Attack",
    domain: "Supply Chain",
    short: "Compromising a supplier, dependency, or build system to reach the downstream population that trusts it.",
    long: "The attacker's economics are what make this category strategic: one compromise of a widely used component yields access proportional to that component's install base, with the victim's own trust mechanisms doing the distribution. The variants differ in where trust is subverted — source (a malicious commit or a compromised maintainer account), build (SolarWinds-style implant injection during compilation), distribution (registry or update channel compromise), or dependency resolution (dependency confusion and typosquatting). Verizon's 2025 DBIR reported that breaches involving third parties doubled year over year to about thirty percent, which reflects both real growth and better attribution. Defense is layered because no single control covers all four variants: provenance and reproducibility for build, signing and transparency for distribution, namespace control and pinning for resolution, and vendor security requirements plus contractual notification for source.",
    why: "It is the threat model where your own control quality is insufficient, which makes it a governance problem as much as an engineering one. The board question — what happens when a supplier is breached — should have a rehearsed answer, not an improvised one.",
    related: ["slsa", "sbom", "dependency-confusion", "third-party-risk", "reproducible-build", "provenance", "failure-domain", "cisa-kev"],
    mode: "both"
  },
  {
    id: "exploit-mitigation",
    term: "Exploit Mitigation",
    domain: "Software Assurance",
    short: "Platform defenses that raise the cost of turning a memory-safety bug into reliable code execution, without fixing the bug.",
    long: "ASLR randomizes address layout so an attacker cannot hardcode targets. Non-executable memory separates data from code. Stack canaries detect linear overwrites before a function returns. Control-flow integrity constrains indirect branches to legitimate targets, and hardware forms such as Intel CET shadow stacks and ARM pointer authentication push that enforcement into silicon. Heap hardening randomizes and isolates allocations to frustrate grooming. None of these fix the underlying defect; each converts a straightforward exploit into a research project, often requiring an additional information leak. The strategic reading is that mitigations buy time and raise the cost of commodity exploitation, while memory-safe languages remove the defect class entirely — so mitigations are the right investment for the legacy code you cannot rewrite, not a substitute for the rewrite decision.",
    why: "Understanding what mitigations do lets you judge exploitability claims honestly during triage, and it clarifies why a critical-severity memory bug in a hardened, sandboxed process may be a lower priority than a medium-severity authorization flaw.",
    related: ["memory-safety", "fuzzing", "cwe", "cvss", "epss"],
    mode: "motus"
  },
  {
    id: "incident-commander",
    term: "Incident Commander",
    domain: "Incident Response",
    short: "The single accountable decision-maker during an incident, who coordinates rather than investigates.",
    long: "Borrowed from emergency services and refined in SRE practice, the incident commander owns the response, not the technical work. They hold the current state, assign roles, run the cadence of updates, decide when to escalate or declare, and explicitly do not go heads-down debugging — the moment the commander starts investigating, coordination stops and the response fragments. Supporting roles matter as much: an operations lead directing technical work, a communications lead handling executives and external parties, and a scribe maintaining the timeline that later becomes evidence and postmortem input. The role must be pre-designated and rotated with training, because appointing a commander during the incident wastes the first hour, and the most senior person in the room is frequently the wrong choice.",
    why: "Incidents fail on coordination far more often than on technical capability. Establishing this role and rehearsing it is one of the cheapest, highest-return preparations available, and it is visible immediately in the first thirty minutes of a real event.",
    related: ["incident-severity", "crisis-communication", "mttr", "tabletop-exercise", "blameless-post-mortem"],
    mode: "both"
  },
  {
    id: "incident-severity",
    term: "Incident Severity",
    domain: "Incident Response",
    short: "A pre-agreed classification that determines who is woken, what authority is unlocked, and which clocks start.",
    long: "A severity scale is not a description, it is a trigger mechanism. Each level should specify concretely who is paged, what response time is committed, which authorities are pre-approved at that level (isolate a segment, take a service offline, engage outside counsel and forensics), and which external clocks begin — regulatory notification windows, contractual customer commitments, disclosure obligations. Two design rules earn their keep: severity must be declarable by the on-call engineer without seeking permission, since a scale that requires approval to invoke will be under-invoked exactly when it matters; and it must be revisable in both directions without blame, so that early over-declaration is culturally safe. Anchor the levels on impact and uncertainty, not on adversary sophistication, which is unknowable early.",
    why: "The severity call is the switch that converts an alert into an organizational response, and hesitation at that switch is where hours are lost. Pre-wiring authority to severity is how you make containment speed a property of the system rather than of the individual on shift.",
    related: ["incident-commander", "containment", "breach-notification", "materiality", "mttr"],
    mode: "both"
  },
  {
    id: "containment",
    term: "Containment",
    domain: "Incident Response",
    short: "Limiting the adversary's reach and impact while preserving the evidence and access needed to understand the intrusion.",
    long: "Containment is a judgment call between two costs. Act immediately — isolate hosts, disable accounts, block egress — and you stop the bleeding but tip the adversary off, who may then burn persistence you have not found and escalate to destruction. Wait to map the full footprint and you risk further encryption or exfiltration. The professional resolution is usually staged: contain aggressively where impact is imminent, monitor elsewhere while scoping, and then execute a coordinated eradication across all identified footholds simultaneously so the adversary cannot re-enter through a channel you cut second. Partial containment is the classic failure — evicting from ten hosts while missing the eleventh, or resetting user passwords while leaving the service account and the OAuth token grant intact.",
    why: "Containment speed dominates loss magnitude in ransomware, and containment completeness dominates whether you have one incident or three. Both depend on decisions and authorities established long before the event.",
    related: ["eradication", "incident-severity", "blast-radius", "mttr", "edr"],
    mode: "both"
  },
  {
    id: "eradication",
    term: "Eradication",
    domain: "Incident Response",
    short: "Removing every adversary foothold, credential, and persistence mechanism in a coordinated action rather than piecemeal.",
    long: "Eradication follows scoping and should be executed as a single event across the whole identified footprint: rebuild compromised hosts rather than clean them, rotate every credential the adversary could have touched including service accounts, API keys, certificates, and the directory service key material if domain compromise is suspected, revoke sessions and OAuth grants, and remove persistence in scheduled tasks, services, startup items, cloud functions, identity provider federation, and mail rules. The hard-won lesson from repeat incidents is that credentials are the most commonly missed category, particularly non-human ones, and that identity-layer persistence such as an added federation trust or a rogue application consent survives every host rebuild. Verify by hunting for the adversary's known tradecraft afterward, not by observing that alerts stopped.",
    why: "Incomplete eradication produces reinfection, and reinfection destroys organizational confidence in the security team far more than the original breach did. The credential and identity sweep is where thoroughness pays.",
    related: ["containment", "forensic-timeline", "secrets-sprawl", "corrective-action", "chain-of-custody"],
    mode: "both"
  },
  {
    id: "order-of-volatility",
    term: "Order of Volatility",
    domain: "Digital Forensics",
    short: "The rule that evidence must be collected from most perishable to least, because acting changes the system.",
    long: "CPU registers and cache vanish instantly. Memory contents, running processes, network connections, and routing state survive only until reboot or, in the case of network state, seconds. Temporary filesystems and swap survive a little longer. Disk contents and archived logs persist longest. The sequence matters because every collection action perturbs the system — running a tool allocates memory and may overwrite the very artifacts you need — so the collection order is also a damage-limitation order. In cloud and container environments the same principle applies with compressed timescales: an ephemeral container that is terminated takes its memory, its filesystem, and often its logs with it, which is why snapshot-before-terminate must be automated into the response playbook rather than remembered under pressure.",
    why: "The single most common irreversible mistake in early response is rebooting or terminating the compromised system, destroying the memory that held the only copy of the implant. Knowing the order turns instinct into procedure.",
    related: ["memory-acquisition", "chain-of-custody", "forensic-timeline", "containment", "edr"],
    mode: "motus"
  },
  {
    id: "memory-acquisition",
    term: "Memory Acquisition",
    domain: "Digital Forensics",
    short: "Capturing volatile memory from a live system to recover artifacts that exist nowhere on disk.",
    long: "Modern intrusions are substantially fileless — reflectively loaded code, injected threads, in-memory only payloads, decrypted configuration, and credential material harvested from process memory. A disk image of such a host can look clean. Acquisition captures the full physical memory to an image that frameworks such as Volatility can parse for process lists, injected regions, network connections, loaded modules, command history, and key material. Three operational realities govern it: the acquisition tool itself runs on the target and perturbs the very memory it collects, so minimal footprint and immediate imaging matter; hypervisor-level or snapshot-based capture in virtualized and cloud environments is superior because it does not touch the guest; and the acquisition must happen before containment actions that trigger reboot or termination.",
    why: "Memory is where the truth of a modern intrusion lives, and it is deleted by the most instinctive containment action available. Building acquisition into the first ten minutes of the playbook is what preserves your ability to answer what happened.",
    related: ["order-of-volatility", "chain-of-custody", "forensic-timeline", "living-off-the-land", "edr"],
    mode: "motus"
  },
  {
    id: "chain-of-custody",
    term: "Chain of Custody",
    domain: "Digital Forensics",
    short: "The unbroken, documented record of who handled each piece of evidence, when, and what they did to it.",
    long: "Every acquisition is logged with the collector's identity, timestamp with timezone, method and tool version, source system, and a cryptographic hash of the resulting image. Every subsequent transfer, copy, or analysis is recorded, and analysis is performed on verified copies while the original is preserved read-only. This exists because evidence with a gap in its handling record can be challenged, and once challenged it may be excluded from litigation, regulatory proceedings, insurance claims, or law enforcement referral. The judgment a leader must make early is which incidents warrant this overhead — it is real friction, and applying it to every alert is waste — so the rule of thumb is to invoke it whenever employee misconduct, litigation, insurance recovery, regulatory notification, or law enforcement involvement is plausible, and to decide that in the first hour rather than the second week.",
    why: "Forensic rigor cannot be applied retroactively. The cost of maintaining custody is small; the cost of discovering months later that your only evidence is inadmissible is not recoverable at any price.",
    related: ["order-of-volatility", "memory-acquisition", "forensic-timeline", "breach-notification", "incident-commander"],
    mode: "both"
  },
  {
    id: "forensic-timeline",
    term: "Forensic Timeline",
    domain: "Digital Forensics",
    short: "A single normalized, time-ordered reconstruction of adversary and system activity across every available evidence source.",
    long: "Timeline construction is the core analytic act of incident response. Filesystem metadata, event logs, EDR telemetry, authentication records, network flows, cloud audit trails, and application logs are normalized to a common timezone — always UTC, since mixed local times have destroyed more analyses than any anti-forensic technique — and merged into one sequence. From that sequence come the answers that matter: the earliest confirmed adversary action, which fixes patient zero and the true dwell time; the full set of accessed systems and data, which drives notification obligations; and the persistence inventory that eradication must cover. Watch for adversary timestomping of filesystem metadata, and prefer sources the attacker could not easily alter, such as centrally shipped logs and network flow records.",
    why: "The timeline is what converts an incident into knowledge, and it is the document that legal, regulators, insurers, and the board will all rely on. Its quality is set by the telemetry decisions you made months earlier.",
    related: ["chain-of-custody", "memory-acquisition", "dwell-time", "eradication", "telemetry-pipeline"],
    mode: "motus"
  },
  {
    id: "double-extortion",
    term: "Double Extortion",
    domain: "Ransomware",
    short: "Exfiltrating data before encrypting it, so that restoring from backup does not remove the leverage.",
    long: "The model emerged around 2019 and is now standard: the adversary spends the dwell period locating and staging valuable data, exfiltrates it, then encrypts and demands payment for both a decryption key and a promise not to publish. It defeats the entire backup-centric defensive posture, because a perfect restore leaves the disclosure threat intact. Extensions have followed — contacting customers, regulators, and journalists directly; threatening the victim with regulatory reporting; and in some cases pure extortion without encryption at all, which is faster and lower-risk for the attacker. The defensive implication is that data exfiltration detection and reduction of retained data become as important as recovery capability, and that the negotiation and disclosure decision must be pre-modeled with counsel rather than improvised at three in the morning.",
    why: "It changes the executive decision from an operational one about recovery into a legal and reputational one about disclosure, and it means recovery readiness alone no longer bounds your loss. Data minimization becomes a ransomware control, which is not where most programs look for one.",
    related: ["immutable-backup", "data-minimization", "breach-notification", "crisis-communication", "canary-token"],
    mode: "both"
  },
  {
    id: "immutable-backup",
    term: "Immutable Backup",
    domain: "Resilience",
    short: "Backup data that cannot be altered or deleted for a defined retention period, even by an administrator with valid credentials.",
    long: "Ransomware operators target backups first, because a victim who can restore does not pay. Immutability enforces write-once-read-many semantics at the storage layer — object lock in compliance mode, hardened repositories, or tape physically removed from the network — so that even a fully compromised backup administrator account cannot shorten retention or delete recovery points. The details determine whether it is real: governance mode allows privileged override and therefore does not survive an admin compromise, while compliance mode does not; the backup catalog and the credentials used by the backup service must be protected as thoroughly as the data; and the retention window must exceed your realistic detection time, since backups taken after the intrusion began may contain the adversary's persistence. Untested immutability is a claim, not a control.",
    why: "It is the specific mechanism that converts ransomware from an existential decision into an expensive operational recovery. The compliance-versus-governance distinction is the kind of detail that decides whether the control holds on the worst day.",
    related: ["three-two-one-backup", "rto", "rpo", "double-extortion", "game-day"],
    mode: "both"
  },
  {
    id: "three-two-one-backup",
    term: "3-2-1-1-0 Backup Rule",
    domain: "Resilience",
    short: "Three copies of data, on two media types, one offsite, one immutable or offline, and zero errors on verified restore test.",
    long: "The original 3-2-1 rule addressed hardware failure and site loss. The modern extension addresses adversaries: the additional one requires a copy that is offline or immutable so it survives a credentialed attacker, and the zero requires that recovery be verified by actual restore testing rather than by a successful backup job. That last digit is where most programs fail, because a green backup dashboard reports that data was written, not that it can be read back into a working system. Restore verification must cover the full dependency chain — an application restored without its database schema version, its secrets, its certificates, or its identity provider is not restored — and it must be timed, because the elapsed duration is the only honest input to your recovery objectives.",
    why: "Nearly every organization believes it has backups and a smaller number can actually restore a complex service under pressure. The gap between those two states is discovered either in a test you scheduled or in an incident you did not.",
    related: ["immutable-backup", "rto", "rpo", "game-day", "business-impact-analysis"],
    mode: "novus"
  },
  {
    id: "rto",
    term: "RTO",
    domain: "Resilience",
    short: "Recovery time objective: the maximum tolerable duration between service loss and service restoration.",
    long: "RTO is a business commitment that drives architecture and cost, and it is meaningful only when derived from impact analysis rather than declared by aspiration. Every stakeholder wants four hours until they see the price of the redundancy required, at which point real prioritization begins. The number must account for the whole restoration path — decision time, provisioning, data restore, dependency startup order, integrity validation, and reconnection to upstream and downstream systems — not just the copy operation. In a ransomware scenario RTO must also absorb the forensic requirement not to restore into a still-compromised environment, which is why realistic enterprise-wide recovery timelines run in weeks rather than hours even when individual service RTOs are short. Measure achieved RTO in exercises and publish the delta against the stated objective.",
    why: "RTO is the number that translates security investment into a business promise, and the gap between stated and demonstrated RTO is one of the most useful uncomfortable facts a CISO can put in front of an executive team.",
    related: ["rpo", "business-impact-analysis", "three-two-one-backup", "game-day", "mttr"],
    mode: "both"
  },
  {
    id: "rpo",
    term: "RPO",
    domain: "Resilience",
    short: "Recovery point objective: the maximum amount of data, measured in time, that the business can afford to lose.",
    long: "RPO sets backup frequency and replication design. An hour of RPO means hourly snapshots or continuous replication; a day means nightly is acceptable. The security-specific twist that surprises teams is that synchronous replication, which gives excellent RPO against hardware failure, faithfully replicates encryption and deletion caused by an attacker, so it provides no protection against the failure mode you actually fear. Ransomware resilience therefore requires point-in-time recovery to a moment before the intrusion, which means retaining enough versioned history to reach behind a dwell time measured in weeks. State RPO per data class rather than globally — transaction records and a rebuildable cache do not deserve the same investment — and validate it by restoring to an arbitrary historical point, not just the most recent one.",
    why: "RPO exposes the difference between availability engineering and security resilience, and misunderstanding that difference is how organizations discover their replicated data is uniformly encrypted.",
    related: ["rto", "immutable-backup", "three-two-one-backup", "business-impact-analysis", "double-extortion"],
    mode: "both"
  },
  {
    id: "corrective-action",
    term: "Corrective Action",
    domain: "Learning Systems",
    short: "A specific, owned, dated change that removes a contributing cause, tracked to completion with the same rigor as product work.",
    long: "The value of a postmortem is realized only in the actions it generates, and most action lists fail in predictable ways. They are vague, so nobody can tell when they are done. They are assigned to a team rather than a person, so nobody owns them. They lack a date, so they lose every prioritization contest against feature work. And they cluster at the weakest level of intervention — add training, add a warning, update the documentation — rather than at the strongest, which is to make the failure impossible by construction. A useful discipline is to classify each action by leverage: eliminate the hazard, add an automated guardrail, add a detection, or add a procedure, in descending order of durability, and require that at least one action sit in the top two tiers.",
    why: "Repeat incidents are the clearest evidence that a learning system is not working, and they are almost always traceable to action lists that closed on paper. Tracking completion and leverage tier turns postmortems from ritual into compounding improvement.",
    related: ["blameless-post-mortem", "guardrail-vs-gate", "secure-defaults", "exception-management", "residual-risk"],
    mode: "both"
  },
  {
    id: "tabletop-exercise",
    term: "Tabletop Exercise",
    domain: "Preparedness",
    short: "A discussion-based rehearsal in which participants talk through their decisions against an injected scenario, without touching systems.",
    long: "The tabletop tests decision-making, authority, and communication — the layer that fails first in real incidents. Its power is in the injects: a ransom note appears, then a journalist calls, then legal asks whether this is reportable, then a major customer demands a written statement, then the CEO asks whether to pay. The right participants are executives, legal, communications, and business owners, not just the security team, because the questions being tested are theirs. Good facilitation withholds information the way reality does, refuses to let participants assume a control works, and captures every moment where someone says they would need to find out who decides. Those moments are the deliverable. A tabletop that ends with everyone feeling prepared was too easy.",
    why: "Executive hesitation and unclear authority cost more hours in real incidents than any technical gap, and those are exactly what a tabletop surfaces cheaply. It is also the most effective way to secure resilience funding, because the executives feel the gap themselves.",
    related: ["game-day", "incident-commander", "crisis-communication", "materiality", "breach-notification", "blameless-postmortem", "purple-team", "break-glass", "assume-breach", "risk-appetite"],
    mode: "both"
  },
  {
    id: "game-day",
    term: "Game Day",
    domain: "Preparedness",
    short: "A live exercise in which real failure is injected into real systems to test whether recovery actually works.",
    long: "Where a tabletop tests decisions, a game day tests reality: pull the identity provider, corrupt a database and restore it, revoke the certificate, sever a region, execute a ransomware recovery from immutable backup end to end. It reliably discovers what documentation cannot — the runbook that references a decommissioned tool, the restore that depends on a credential stored in the system being restored, the dependency nobody remembered, the elapsed time that is four times the stated RTO. Run it in production or in an environment genuinely equivalent to it, because a game day in a toy environment tests the toy. Announce it, set an abort condition, and treat any failure as the intended output rather than as an embarrassment, or people will start quietly pre-fixing things before the next one.",
    why: "It is the only method that converts stated resilience into demonstrated resilience, and the evidence it produces is what makes RTO and RPO commitments credible to auditors, insurers, and the board.",
    related: ["tabletop-exercise", "rto", "three-two-one-backup", "immutable-backup", "purple-team"],
    mode: "motus"
  },
  {
    id: "crisis-communication",
    term: "Crisis Communication",
    domain: "Council",
    short: "Managing what employees, customers, regulators, press, and markets know during an incident, at the pace the incident sets.",
    long: "Communication in a crisis is constrained by a hard asymmetry: you must say something before you know much, and everything you say becomes a commitment that will be checked against the final facts. The discipline is to communicate the process rather than premature conclusions — what you have confirmed, what you have not, what you are doing, and when the next update comes — and to hold that update cadence even when there is nothing new, because silence is filled by speculation and by the adversary, who in double-extortion cases is an active participant in the narrative. Prepare templates and pre-agreed approval paths in advance, keep legal in the loop without letting review latency exceed the news cycle, and remember that employees are a communications audience whose messages will reach the press within the hour.",
    why: "Reputational damage is driven far more by the perception of concealment than by the breach itself, and the tone of the first statement is set in the first hour by whoever is available. Pre-deciding who speaks and how removes the worst improvisation.",
    related: ["out-of-band-communications", "incident-commander", "breach-notification", "materiality", "tabletop-exercise"],
    mode: "both"
  },
  {
    id: "out-of-band-communications",
    term: "Out-of-Band Communications",
    domain: "Incident Response",
    short: "A response channel independent of the potentially compromised corporate environment.",
    long: "If the adversary is in your directory, your email, and your chat platform, then coordinating the response there tells them your containment plan, your timeline, and your negotiating position — and there are documented cases of intruders reading incident bridges and adapting in real time. The out-of-band channel must be genuinely independent: a separate messaging tenant or application on personal or dedicated devices, an alternate conferencing service, and a printed contact list, because the directory you would look people up in may be down or untrusted. It must be provisioned, distributed, and exercised beforehand, since standing up a new secure channel while the incident is running is both slow and prone to the wrong people being invited. Include external parties — counsel, insurer, forensics retainer, key vendors — in the pre-provisioned list.",
    why: "This is a cheap preparation with a catastrophic failure mode if skipped, and it is one of the most common gaps found in tabletop exercises. Assuming your own infrastructure is trustworthy during a compromise is the definition of the wrong assumption.",
    related: ["crisis-communication", "incident-commander", "containment", "tabletop-exercise", "chain-of-custody"],
    mode: "both"
  },
  {
    id: "breach-notification",
    term: "Breach Notification",
    domain: "Regulatory",
    short: "The legal obligation to inform regulators, individuals, or customers within defined windows once a qualifying incident is identified.",
    long: "Obligations stack rather than replace one another, and their clocks differ. GDPR requires notification to the supervisory authority without undue delay and where feasible within seventy-two hours of becoming aware, with communication to affected individuals when risk to their rights and freedoms is high. US state laws impose their own timelines and content requirements. Sector regimes add more — banking, health, critical infrastructure — and contracts frequently impose shorter windows than any statute. The operationally decisive concept is the trigger: what constitutes awareness, and who in your organization is authorized to declare it, because the clock starts at a moment that your own process defines. Build a notification decision record that captures what was known when, since regulators will assess the reasonableness of your timeline against that record.",
    why: "Notification failures generate penalties and credibility damage independent of the breach itself, and the clock usually starts while you still understand very little. Knowing your obligation map before the event is the only way to meet it.",
    related: ["materiality", "crisis-communication", "chain-of-custody", "lawful-basis", "third-party-risk"],
    mode: "both"
  },
  {
    id: "business-impact-analysis",
    term: "Business Impact Analysis",
    domain: "Resilience",
    short: "Determining what the organization actually does, which systems it depends on, and what it costs when each stops.",
    long: "A BIA maps business processes to the technology, data, people, facilities, and third parties they require, then quantifies the consequence of disruption over time — because impact is rarely linear, and many processes tolerate four hours and collapse at forty-eight. It produces the inputs everything else depends on: recovery objectives derived from tolerance rather than preference, a defensible criticality ranking for prioritizing controls, and the dependency graph that recovery sequencing requires. Its recurring blind spot is hidden dependencies — the identity provider, the certificate authority, the DNS provider, the single vendor that three critical processes quietly share — which only surface when someone traces the chain rather than accepting the process owner's description.",
    why: "Without a BIA, resilience investment is allocated by whoever advocates loudest, and recovery ordering during a real event is improvised. It is also the artifact that lets you say no to protecting everything equally, which is the only affordable posture.",
    related: ["rto", "rpo", "blast-radius", "third-party-risk", "fair-model"],
    mode: "both"
  },
  {
    id: "fair-model",
    term: "FAIR",
    domain: "Risk Quantification",
    short: "Factor Analysis of Information Risk: a model that decomposes risk into loss event frequency and loss magnitude, expressed in money.",
    long: "FAIR replaces ordinal color ratings with a decomposition that can be estimated and argued about. Risk is loss event frequency times loss magnitude. Frequency decomposes into threat event frequency and vulnerability, which itself is a comparison of threat capability against control strength. Magnitude decomposes into primary loss — response cost, replacement, lost productivity — and secondary loss from fines, litigation, and reputational effects. Each factor is estimated as a calibrated range with a confidence distribution rather than a point value, and the model is run through Monte Carlo simulation to produce a distribution of annual loss. The honest critique is that inputs are still expert judgment; the honest defense is that the model makes each judgment explicit, separately challengeable, and updatable as evidence arrives, which no heat map does.",
    why: "Executives allocate capital in currency, and a risk expressed as high on a five-point scale cannot be compared against a factory investment or an insurance premium. FAIR is how security enters the capital allocation conversation as a peer rather than as a plea.",
    related: ["loss-exceedance-curve", "calibrated-estimate", "risk-appetite", "residual-risk", "business-impact-analysis", "base-rate", "inherent-risk", "crown-jewels"],
    mode: "motus"
  },
  {
    id: "loss-exceedance-curve",
    term: "Loss Exceedance Curve",
    domain: "Risk Quantification",
    short: "A chart showing the probability that annual loss will exceed each given amount, replacing a single risk number with a distribution.",
    long: "The curve plots loss on one axis and the probability of exceeding that loss on the other, so it answers the question executives and insurers actually ask: what is the chance we lose more than twenty million dollars this year. Overlaying a risk tolerance curve — the maximum acceptable probability at each loss level, set by the board — turns risk appetite from a paragraph into a testable line, and any portion of the loss curve sitting above the tolerance curve is a quantified gap that justifies investment. Its second use is control evaluation: model the curve before and after a proposed control, and the area between them is the risk reduction you are buying, which can be divided by the control's cost to compare candidate investments on the same basis.",
    why: "It communicates uncertainty honestly to people who make capital decisions under uncertainty every day, and it survives the challenge that a single expected-loss figure never does. It also gives insurance and retention decisions a defensible analytic footing.",
    related: ["fair-model", "calibrated-estimate", "risk-appetite", "risk-acceptance", "materiality"],
    mode: "motus"
  },
  {
    id: "calibrated-estimate",
    term: "Calibrated Estimate",
    domain: "Decision Science",
    short: "A quantified judgment given as a range with a stated confidence level, produced by someone trained to be right about their own uncertainty.",
    long: "Calibration training, popularized in security by Douglas Hubbard's work, is straightforward and effective: subjects answer trivia questions with ninety percent confidence intervals and receive feedback on how often the true value fell inside. Most people start badly overconfident — their ninety percent ranges contain the answer far less than ninety percent of the time — and a few hours of feedback moves most of them close to calibrated, an improvement that transfers to domain estimates. The technique that does most of the work is the equivalent bet test: ask whether you would rather bet on your interval containing the answer or spin a wheel with a ninety percent win chance, and widen the interval until the two feel equal. This is what makes expert judgment a usable input rather than a guess with a decimal point.",
    why: "Every risk model runs on estimates, and uncalibrated experts produce confident, narrow, wrong ranges that make the model worse than no model. Calibration is a few hours of training that raises the quality of every quantitative decision the security function makes thereafter.",
    related: ["fair-model", "loss-exceedance-curve", "base-rate-fallacy", "goodharts-law", "risk-acceptance"],
    mode: "motus"
  },
  {
    id: "goodharts-law",
    term: "Goodhart's Law",
    domain: "Program Design",
    short: "When a measure becomes a target, it ceases to be a good measure.",
    long: "The security function is unusually prone to this because its outcomes are rare and hard to observe, so proxies get promoted to goals. Target patching speed and teams close tickets on low-risk assets while the internet-facing appliance waits for a change window. Target phishing click rate and simulations get easier and reporting gets discouraged. Target mean time to resolve and incidents get closed early and reopened under new numbers. Target vulnerability counts and scanners get scoped narrowly. The countermeasures are structural rather than moral: pair every efficiency metric with a quality metric that moves in the opposite direction under gaming, prefer outcome measures validated by independent testing such as adversary emulation, rotate metrics before they ossify, and never tie compensation to a single number a team fully controls.",
    why: "You will be asked for metrics constantly, and the ones you choose will reshape behavior whether or not you intended it. Selecting metrics is therefore an act of organizational design, and the second-order effects are usually larger than the first-order ones.",
    related: ["calibrated-estimate", "mttd", "mttr", "blameless-post-mortem", "false-positive-economics", "mean-time-to-detect", "control-decay", "purple-team", "leverage-point", "base-rate"],
    mode: "both"
  },
  {
    id: "risk-appetite",
    term: "Risk Appetite",
    domain: "Governance",
    short: "The amount and type of risk an organization is willing to pursue in service of its objectives, set by the board.",
    long: "Appetite is a leadership statement, not a security team preference, and it becomes operational only when expressed in terms that can be tested. Vague formulations — we have a low appetite for cybersecurity risk — govern nothing. Usable formulations specify thresholds: a stated maximum probability of exceeding a given annual loss, a maximum tolerable outage duration for named critical services, a hard prohibition on unencrypted regulated data leaving defined boundaries, a maximum acceptable count of internet-facing systems with known exploited vulnerabilities past their deadline. Distinguish appetite from capacity: capacity is the loss the balance sheet could absorb before existential damage, appetite is the smaller amount leadership chooses to accept, and the gap between them is where insurance and reserves live.",
    why: "Without a stated appetite, every risk decision is relitigated from first principles and the security leader becomes the de facto decider of business risk, which is both unsustainable and outside their mandate. Getting appetite stated in numbers is the work that makes everything downstream delegable.",
    related: ["risk-acceptance", "residual-risk", "loss-exceedance-curve", "csf-2-0-govern", "materiality", "fair-model", "inherent-risk", "compensating-control", "crown-jewels"],
    mode: "both"
  },
  {
    id: "risk-acceptance",
    term: "Risk Acceptance",
    domain: "Governance",
    short: "A documented decision by an accountable business owner to proceed with a known, unmitigated risk.",
    long: "Acceptance is legitimate and necessary — you cannot fix everything, and some fixes cost more than the exposure. What makes it legitimate is the record: the specific risk described in business terms, the exposure quantified as best you can, the alternatives considered with their costs, the named accountable individual who is senior enough to own the consequence, an expiry date, and the conditions that would force reconsideration. Two failure modes recur. Acceptance by silence, where a finding sits unremediated for two years without anyone deciding, which is the same exposure with none of the accountability. And acceptance at the wrong level, where an engineering manager accepts a risk whose realization would be material to the enterprise. The security leader's role is to inform and record the decision, not to make it.",
    why: "Documented acceptance converts an audit finding into a business decision and moves accountability to where authority already sits. It also protects the security function from carrying risk it never had the mandate to accept.",
    related: ["risk-appetite", "residual-risk", "exception-management", "compensating-control", "materiality"],
    mode: "both"
  },
  {
    id: "residual-risk",
    term: "Residual Risk",
    domain: "Governance",
    short: "The exposure that remains after controls are applied, as opposed to the inherent risk before them.",
    long: "The inherent-to-residual comparison is how control value is expressed, and it is routinely fabricated. Residual risk is only credible when control effectiveness is evidenced rather than assumed — a control that exists on paper, is misconfigured, covers sixty percent of the estate, or has never been tested does not reduce risk by the amount the register claims. This is why control validation through adversary emulation, restore testing, and access reviews is not an audit chore but the input that makes residual figures honest. Residual risk also drifts upward silently between assessments as the environment changes, exceptions accumulate, and detections decay, which is the argument for continuous validation over annual assessment.",
    why: "Residual risk is the number that flows to the board and to insurers, and an unvalidated one is a fiction that will be tested by an adversary rather than by an auditor. Insisting on evidence behind effectiveness claims is a core discipline of the role.",
    related: ["risk-acceptance", "compensating-control", "detection-drift", "risk-appetite", "fair-model", "inherent-risk", "control-decay"],
    mode: "both"
  },
  {
    id: "compensating-control",
    term: "Compensating Control",
    domain: "Governance",
    short: "An alternative safeguard used when the specified control is infeasible, which must meet the intent and rigor of the original.",
    long: "The concept is formalized in standards such as PCI DSS, which requires a documented compensating control to address the intent of the original requirement, provide a comparable level of defense, be above and beyond other requirements, and be validated. In practice the term is frequently abused as a synonym for we did something else and hope it counts — network monitoring proposed in place of encryption, or an annual review proposed in place of automated enforcement. The test to apply is mechanical: name the specific attack the original control prevents, and demonstrate that the alternative prevents that same attack with comparable reliability and comparable evidence of operation. If the alternative only detects what the original prevented, that is a different risk posture, not an equivalent one.",
    why: "Legacy systems, operational technology, and acquired estates make compensating controls unavoidable, so the skill is distinguishing a genuine equivalent from a rationalization. Getting that judgment wrong hides real exposure behind an approved record.",
    related: ["residual-risk", "risk-acceptance", "exception-management", "d3fend", "third-party-risk", "control-decay", "defense-in-depth", "risk-appetite", "security-debt"],
    mode: "both"
  },
  {
    id: "exception-management",
    term: "Exception Management",
    domain: "Governance",
    short: "The controlled process for permitting a documented, time-bound deviation from policy, with an owner and a remediation plan.",
    long: "Exceptions are inevitable and their handling is a strong indicator of program maturity. A healthy process requires a business justification, a named accountable owner, a defined scope, an expiry date that is actually enforced, an assessment of the added exposure, and compensating measures where possible. The pathology to watch for is the standing exception: granted once for a migration, renewed annually without review, and eventually forgotten until an incident reveals that the exception population is larger than the compliant one. Two metrics keep it honest — the count and age distribution of open exceptions, and the fraction that expired without renewal or remediation. A rising exception count is not a process failure, it is a signal that a policy no longer matches operational reality and should be redesigned rather than routinely waived.",
    why: "The exception register is the most accurate description of your real security posture, far more so than the policy set. Reading it as a design signal rather than a compliance backlog is what turns it from bureaucracy into feedback.",
    related: ["risk-acceptance", "compensating-control", "residual-risk", "guardrail-vs-gate", "corrective-action"],
    mode: "both"
  },
  {
    id: "materiality",
    term: "Materiality",
    domain: "Regulatory",
    short: "The threshold at which information becomes something a reasonable investor would consider important, triggering disclosure obligations.",
    long: "US securities law defines materiality by the reasonable investor standard, and the SEC's 2023 cybersecurity disclosure rules operationalize it: registrants must report a material cybersecurity incident on Form 8-K Item 1.05 within four business days of determining materiality — not of discovering the incident — and must describe the incident's nature, scope, timing, and material impact or reasonably likely material impact. Annual reporting under Regulation S-K Item 106 covers risk management processes, strategy, and governance including board oversight. Two subtleties dominate practice. Materiality is qualitative as well as quantitative, so reputational and operational consequences count even when the dollar figure is modest. And the determination must be made without unreasonable delay, meaning an organization cannot extend the clock by declining to conclude.",
    why: "This is where security judgment meets securities law, and the determination is made by a disclosure committee that will rely on the CISO's characterization of scope and impact. Being able to express an incident in materiality terms, early and accurately, is a defining executive competence.",
    related: ["breach-notification", "incident-severity", "crisis-communication", "risk-appetite", "csf-2-0-govern"],
    mode: "motus"
  },
  {
    id: "third-party-risk",
    term: "Third-Party Risk",
    domain: "Governance",
    short: "Exposure created by suppliers, service providers, and their own suppliers, who hold your data or hold access to your systems.",
    long: "Verizon's 2025 DBIR reported that breaches involving a third party doubled year over year to roughly thirty percent, which reflects both concentration of services and better attribution. The prevailing control model — annual questionnaires and certification review — measures documentation quality rather than security, and it is largely uncorrelated with the outcomes that matter. What works better is tiering suppliers by the access and data they actually hold, then applying proportionate assurance: contractual security requirements with notification windows that meet your own regulatory clocks, evidence of specific controls rather than attestations of process, right to audit for the top tier, and integration of key suppliers into your own incident response exercises. Fourth-party concentration deserves explicit attention, since many vendors share the same small set of underlying providers.",
    why: "You are accountable for outcomes you do not control, which makes contract terms, tiering, and rehearsed joint response the actual levers. Knowing which suppliers could stop your business or breach your regulated data is the minimum viable version of this program.",
    related: ["supply-chain-attack", "business-impact-analysis", "breach-notification", "csf-2-0-govern", "compensating-control"],
    mode: "both"
  },
  {
    id: "dpia",
    term: "DPIA",
    domain: "Privacy",
    short: "A data protection impact assessment: a structured evaluation required before processing that is likely to be high risk to individuals.",
    long: "Under GDPR Article 35, a DPIA is mandatory where processing is likely to result in high risk to the rights and freedoms of natural persons — systematic and extensive automated evaluation with legal or similarly significant effects, large-scale processing of special category data, or systematic monitoring of publicly accessible areas. It must describe the processing and its purposes, assess necessity and proportionality against those purposes, assess the risks to individuals, and set out the measures that address them. The necessity and proportionality test is the part engineers underestimate: it is not a security assessment, it asks whether the processing should happen at all and whether a less intrusive design would achieve the same purpose. Where residual high risk remains, prior consultation with the supervisory authority is required.",
    why: "It is the formal moment where privacy and security intersect in design, and it forces the question of whether collecting the data is justified rather than merely how to protect it. Running it late, as a compliance signoff, wastes its entire value.",
    related: ["data-minimization", "lawful-basis", "data-retention", "threat-modeling", "breach-notification"],
    mode: "motus"
  },
  {
    id: "data-minimization",
    term: "Data Minimization",
    domain: "Privacy",
    short: "Collecting and keeping only the personal data that is adequate, relevant, and limited to what the purpose requires.",
    long: "GDPR Article 5 states the principle, but its security value is independent of any regulation: data you never collected cannot be breached, and data you deleted cannot be exfiltrated. In an era of double extortion, where the leverage is disclosure rather than encryption, retained data is a direct liability. Implementation is less about policy than about defaults — collect fields only when a named purpose requires them, set expiry at ingest rather than promising future deletion, pseudonymize or tokenize identifiers so that a compromised analytics store yields nothing linkable, and aggregate where individual-level records are not genuinely needed. The organizational obstacle is always the same: analytics and product teams believe unforeseen future value justifies indefinite retention, which is an argument that must be met with the quantified breach exposure of holding it.",
    why: "It is the only control that reduces breach impact to zero for the data it covers, and it directly counters the extortion model that backups cannot address. Framing deletion as a security control rather than a compliance chore is how you win that argument.",
    related: ["data-retention", "dpia", "lawful-basis", "double-extortion", "blast-radius"],
    mode: "both"
  },
  {
    id: "lawful-basis",
    term: "Lawful Basis",
    domain: "Privacy",
    short: "The specific legal ground that permits a given processing of personal data, chosen before processing begins and not swapped later.",
    long: "GDPR Article 6 provides six: consent, contract, legal obligation, vital interests, public task, and legitimate interests. Each carries different obligations and different individual rights — consent must be freely given, specific, informed, unambiguous, and as easy to withdraw as to give, while legitimate interests requires a documented balancing test weighing the interest against the individual's rights and expectations. Security processing frequently relies on legitimate interests, and GDPR Recital 49 explicitly recognizes network and information security as a legitimate interest, which is the basis under which log retention, monitoring, and threat detection generally operate. Special category data under Article 9 requires an additional condition beyond the Article 6 basis. The basis must be determined before processing and documented, since changing it afterward is not permitted.",
    why: "Security teams process enormous volumes of personal data — logs, endpoint telemetry, email content, network records — and doing so without an articulated basis and proportionality argument creates regulatory exposure from the security program itself.",
    related: ["dpia", "data-minimization", "data-retention", "telemetry-pipeline", "breach-notification"],
    mode: "motus"
  },
  {
    id: "data-retention",
    term: "Data Retention",
    domain: "Privacy",
    short: "The defined period each data class is kept, balancing investigative need, legal obligation, cost, and breach liability.",
    long: "Retention pulls in opposing directions and the tension is real. Security investigation wants long log history — dwell times measured in weeks and espionage intrusions measured in months mean a thirty-day window can make an intrusion permanently unreconstructable. Privacy law and breach exposure want short retention of personal data. Cost sits on top of both. The resolution is class-by-class rather than global: security telemetry retained long but tiered into cheap searchable storage and stripped of unnecessary personal fields, customer personal data retained per its lawful basis and deleted on schedule, and legal hold handled as an explicit override with its own process. The two failure modes are retention policies that exist only on paper while data accumulates forever, and aggressive deletion applied to logs that destroys investigative capability.",
    why: "Retention is where privacy obligation and forensic capability collide, and the CISO usually owns both sides of the argument. Deciding it deliberately, per class, is what prevents both the unanswerable investigation and the unnecessary breach exposure.",
    related: ["data-minimization", "lawful-basis", "telemetry-pipeline", "forensic-timeline", "dpia"],
    mode: "both"
  },
  {
    id: "kev",
    term: "KEV Catalog",
    domain: "Vulnerability Management",
    short: "CISA's authoritative list of vulnerabilities with reliable evidence of active exploitation in the wild.",
    long: "Established under Binding Operational Directive 22-01 in November 2021, the Known Exploited Vulnerabilities catalog requires three things for inclusion: an assigned CVE identifier, reliable evidence of active exploitation, and clear remediation guidance such as a vendor update or mitigation. Federal civilian agencies must remediate listed vulnerabilities by the due date CISA assigns, and the catalog has become a de facto prioritization standard well beyond government. Its power is that it converts speculation into fact — presence on KEV means exploitation is happening now, not that it is theoretically possible. Its limits are equally important: it is necessarily retrospective, it covers a small fraction of published CVEs, and absence from the catalog is not evidence of safety, merely of no confirmed public exploitation reported to CISA.",
    why: "It is the highest-signal, lowest-cost input to patch prioritization available, and it is free. Any organization whose internet-facing estate carries overdue KEV entries has a prioritization failure that needs no further analysis to diagnose.",
    related: ["epss", "cvss", "ssvc", "sca", "indicator-of-compromise", "attack-surface", "assume-breach"],
    mode: "both"
  },
  {
    id: "epss",
    term: "EPSS",
    domain: "Vulnerability Management",
    short: "FIRST's machine-learning model estimating the probability that a given CVE will be exploited in the wild within the next thirty days.",
    long: "EPSS produces a daily score from zero to one for every published CVE, plus a percentile, derived from features including vulnerability characteristics, references, published exploit code availability, vendor and product, time since publication, and observed exploitation telemetry. Version 4 launched in March 2025 with substantially improved performance. The value is efficiency, which FIRST measures explicitly: prioritizing by CVSS seven and above requires remediating roughly half of all known CVEs to reach about seventy-five percent coverage of exploited vulnerabilities, at around six percent efficiency, while EPSS reaches comparable coverage by addressing a few percent of vulnerabilities. Two cautions apply — EPSS predicts exploitation likelihood, not impact on your environment, so it must be combined with asset criticality and exposure; and scores move daily, so a decision made on last quarter's score is stale.",
    why: "It is the mathematical answer to the impossible vulnerability backlog, and it lets you defend a remediation plan that ignores thousands of findings. Understanding coverage and efficiency as concepts is what makes that defense rigorous rather than convenient.",
    related: ["kev", "cvss", "ssvc", "sca", "vex", "cisa-kev", "base-rate", "residual-risk", "attack-surface"],
    mode: "both"
  },
  {
    id: "cvss",
    term: "CVSS",
    domain: "Vulnerability Management",
    short: "A severity scoring standard describing the intrinsic characteristics of a vulnerability, not the risk it poses to you.",
    long: "The Common Vulnerability Scoring System, maintained by FIRST and now at version 4.0, decomposes severity into base metrics such as attack vector, attack complexity, privileges required, user interaction, and impact on confidentiality, integrity and availability. Version 4.0 restructured this into base, threat, environmental, and supplemental groups, added attack requirements and automatable metrics, and explicitly discouraged the widespread practice of using the base score alone. That practice is the central problem: base scores are published by vendors without knowledge of your architecture, and treating a base nine point eight as a mandate ignores whether the component is internet-facing, whether the vulnerable path is reachable, and whether exploitation is occurring anywhere. CVSS answers how bad this could be under worst-case assumptions, which is a different question from what to fix first.",
    why: "It is the most widely used and most widely misused metric in the discipline. Knowing precisely what it measures — and that the environmental and threat groups exist to be applied — is what lets you replace severity-driven queues with risk-driven ones.",
    related: ["epss", "kev", "ssvc", "cwe", "exploit-mitigation", "cisa-kev", "base-rate", "attack-surface", "residual-risk"],
    mode: "both"
  },
  {
    id: "ssvc",
    term: "SSVC",
    domain: "Vulnerability Management",
    short: "Stakeholder-Specific Vulnerability Categorization: a decision tree that outputs an action rather than a score.",
    long: "Developed by CMU's Software Engineering Institute and adopted by CISA, SSVC replaces a numeric severity with an explicit decision tree whose branches are the questions a defender actually needs answered: is exploitation none, proof of concept, or active; is the exposure open, controlled, or small; what is the automatable potential for propagation; what is the mission and well-being impact. The leaves are actions — track, track closely, attend, act — with associated timeframes. Two advantages follow. The decision logic is visible and can be argued about and tuned by an organization rather than inherited from a vendor formula, and the output is directly operational, since track and act imply different queues rather than different numbers. It also composes well with the other inputs, taking exploitation status from KEV and EPSS as a branch input.",
    why: "It moves the organization from arguing about scores to arguing about decision criteria, which is the more productive argument and one that can be settled once and then applied consistently at scale.",
    related: ["cvss", "epss", "kev", "vex", "risk-acceptance"],
    mode: "motus"
  },
  {
    id: "csf-2-0-govern",
    term: "CSF 2.0 GOVERN",
    domain: "Governance",
    short: "The function added in NIST Cybersecurity Framework 2.0 that establishes strategy, expectations, policy, and accountability above the other five.",
    long: "CSF 2.0, released in February 2024, expanded the framework from five functions to six by adding GOVERN alongside Identify, Protect, Detect, Respond, and Recover. GOVERN is not a peer activity but the layer that informs and prioritizes the others, comprising organizational context, risk management strategy, roles and responsibilities and authorities, policy, oversight, and cybersecurity supply chain risk management. The addition encodes a hard-won lesson: programs fail on unclear accountability and misaligned strategy far more often than on missing technical controls, and supply chain risk had to be elevated from a subcategory to a governance concern. CSF 2.0 also broadened the framework's stated audience beyond critical infrastructure to all organizations, and NIST SP 800-61r3, published April 2025, restructured incident response guidance to fit this model.",
    why: "It gives you a standard, externally recognized structure for the argument that governance is the foundation rather than the paperwork, and it maps cleanly onto board reporting. When a director asks how the program is organized, this is the answer that needs no translation.",
    related: ["risk-appetite", "materiality", "third-party-risk", "residual-risk", "business-impact-analysis"],
    mode: "both"
  }
];
