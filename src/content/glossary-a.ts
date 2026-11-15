import type { Term } from "./schema";

/* StepGuides :: GLOSSARY A — the shared vocabulary of the discipline.
   Foundations and systems thinking, identity and access, applied cryptography.
   Every entry teaches the mechanism, not just the label. */

export const TERMS: Term[] = [
  /* ---------------- FOUNDATIONS AND SYSTEMS THINKING ---------------- */
  {
    id: "leverage-point",
    term: "Leverage Point",
    domain: "Systems",
    short: "A place in a system where a small, well-aimed change produces a large change in behaviour.",
    long: "Donella Meadows ranked twelve places to intervene in a system, from weakest to strongest: constants and parameters at the bottom, then buffer sizes, delays, feedback loop strengths, information flows, rules, self-organisation, goals, and finally the paradigm from which the system arises. Security programmes overwhelmingly spend at the bottom of that list — buying another tool, tuning another threshold — because parameters are easy to change and easy to invoice. The higher points are harder and slower: who gets told what (information flows), what the org rewards (rules and goals), whether engineers see security as their job or someone else's (paradigm). The counterintuitive part Meadows insisted on is that high leverage points are also the ones people push in the wrong direction, because the system's own logic disguises the correct sign.",
    why: "Your budget is finite and your calendar is finite. Knowing which intervention class you are buying — a parameter tweak versus an information-flow change — is the difference between a programme that compounds and one that treadmills.",
    related: ["stock-and-flow", "feedback-loop", "goodharts-law", "paved-road", "security-debt"],
    mode: "both"
  },
  {
    id: "stock-and-flow",
    term: "Stock and Flow",
    domain: "Systems",
    short: "Stocks are accumulations; flows are the rates that fill and drain them. Confusing the two wrecks forecasts.",
    long: "A stock is a level you can measure at an instant — open critical vulnerabilities, standing admin grants, unrotated long-lived credentials, unreviewed exceptions. A flow is a rate over time — vulnerabilities introduced per sprint, grants issued per week, credentials expired per month. A stock only falls when the outflow exceeds the inflow, which is why heroic remediation pushes produce a dip and then a full rebound: the drain was widened for a quarter while the tap ran unchanged. Most security dashboards report stocks and almost none report the two flows that determine them, so leaders keep treating a rate problem with a level intervention.",
    why: "Nearly every durable security win is a flow change disguised as a stock report. Ask for the inflow rate before you approve a remediation sprint, or you will buy the same sprint again next year.",
    related: ["leverage-point", "feedback-loop", "control-decay", "security-debt", "mean-time-to-detect"],
    mode: "both"
  },
  {
    id: "feedback-loop",
    term: "Feedback Loop",
    domain: "Systems",
    short: "A circuit where a system's output re-enters as input — reinforcing growth or balancing toward a goal.",
    long: "Reinforcing loops amplify: one compromised credential yields access to a secret store, which yields more credentials, which yields more access. Balancing loops resist: an alert fires, an analyst responds, the deviation shrinks. Delay inside a balancing loop is what turns it into an oscillation — if your detection takes eleven days to close the loop, the adversary completes several reinforcing cycles before your first correction lands. Security engineering is mostly the craft of shortening the delay in your balancing loops while lengthening the delay or breaking the coupling in the adversary's reinforcing ones.",
    why: "Adversary tradecraft is a reinforcing loop and your response is a balancing one. Whoever cycles faster wins, which is why loop latency matters more than loop strength.",
    related: ["stock-and-flow", "dwell-time", "breakout-time", "detection-engineering", "requisite-variety"],
    mode: "both"
  },
  {
    id: "requisite-variety",
    term: "Requisite Variety",
    domain: "Systems",
    short: "Ashby's law: only variety can absorb variety — a controller needs at least as many distinct responses as the system has distinct disturbances.",
    long: "W. Ross Ashby's law of requisite variety says a regulator can hold a system stable only if its repertoire of responses is at least as rich as the repertoire of disturbances it faces. Applied to defence, if an adversary has fifty ways to obtain initial access and your response playbook has three, the other forty-seven pass through untouched. There are only two honest ways to satisfy the law: increase your own variety (more detections, more response options, more skilled humans) or attenuate the incoming variety (shrink the attack surface, standardise the estate, remove entire classes of exposure so they cannot vary). Attenuation is almost always cheaper, which is why platform consolidation and memory-safe languages outperform hiring your way out of an alert backlog.",
    why: "It tells you when to stop adding detections and start deleting variety. A messy estate demands a controller you cannot afford to staff.",
    related: ["attack-surface", "paved-road", "defense-in-depth", "alert-fatigue", "feedback-loop"],
    mode: "motus"
  },
  {
    id: "trust-boundary",
    term: "Trust Boundary",
    domain: "Architecture",
    short: "The line where data or control passes between parties with different privilege, and where assumptions must be re-verified.",
    long: "A trust boundary is any edge across which you can no longer assume the other side behaved. Classic examples: browser to server, tenant to tenant, container to host, application to database, first-party code to third-party dependency, human to AI agent. The engineering rule is that every value crossing a boundary must be re-validated on the trusting side, in the trusting side's own terms — validating in the client and trusting the result at the server is the single most repeated design defect in the field. Boundaries also move: a service mesh sidecar, a reverse proxy, or a new SaaS integration silently relocates the line, and controls left behind protect nothing.",
    why: "Threat models are only as good as their boundary drawing. Draw the boundary wrong and every control you place is correct in isolation and useless in composition.",
    related: ["threat-model", "blast-radius", "confused-deputy", "zero-trust", "mtls"],
    mode: "both"
  },
  {
    id: "failure-domain",
    term: "Failure Domain",
    domain: "Architecture",
    short: "The set of components that fail together because they share a dependency, a credential, or a control plane.",
    long: "Two systems are in the same failure domain if one event can take both down, and shared fate is usually created by something unglamorous: a common identity provider, a single CI pipeline, one DNS zone, one KMS key, one on-call human. Availability engineering has good language for this — cells, shards, regions — and security should borrow it wholesale, because a security incident is a correlated failure with an intelligent cause. The intelligence matters: random failures respect your independence assumptions, adversaries deliberately target the shared dependency because that is where the leverage is. Mapping failure domains means asking, for each shared component, what an attacker who owned it could reach.",
    why: "Resilience claims that assume independent failures are wrong under adversarial conditions. Naming the shared dependency is the fastest way to find your real single point of failure.",
    related: ["blast-radius", "supply-chain-attack", "defense-in-depth", "crown-jewels", "normal-accident-theory"],
    mode: "both"
  },
  {
    id: "threat-model",
    term: "Threat Model",
    domain: "Threat Modeling",
    short: "A structured answer to four questions: what are we building, what can go wrong, what will we do, and did we do a good job.",
    long: "The four-question frame from the Threat Modeling Manifesto is deliberately minimal because the failure mode of threat modelling is ceremony. You need a diagram accurate enough to argue over, a decomposition method that forces coverage (STRIDE for per-element enumeration, attack trees for goal decomposition, kill chains for sequencing), an explicit list of what you are not defending against, and a record of decisions so the next engineer inherits reasoning rather than conclusions. The stated assumptions are the highest-value artefact: models rot when the world changes and nobody notices which assumption broke. A threat model that never says no to a design is documentation, not analysis.",
    why: "It is the cheapest place to remove an entire vulnerability class — before code exists. Every hour here is worth many in remediation, and it is the one artefact that transfers reasoning across a team.",
    related: ["trust-boundary", "attack-tree", "attack-surface", "residual-risk", "mitre-attack"],
    mode: "both"
  },
  {
    id: "attack-tree",
    term: "Attack Tree",
    domain: "Threat Modeling",
    short: "A goal-rooted tree decomposing an adversary objective into AND/OR sub-goals, with costs and feasibility on the leaves.",
    long: "Bruce Schneier's formalism puts the attacker's objective at the root — read the production database, sign a release, drain the treasury — and expands each node into the alternatives (OR) and the conjunctions (AND) that achieve it. Annotating leaves with cost, required skill, and detectability turns the tree into a comparison engine: the adversary takes the cheapest satisfiable path, so your defence should raise the cost of the current minimum, not the maximum. The technique's power is that it exposes paths nobody discusses, especially the ones that route around your strongest control rather than through it. Its weakness is combinatorial explosion, so anchor trees to real objectives and prune with threat intelligence rather than imagination.",
    why: "It converts hand-waving about risk into an explicit cheapest-path argument, and cheapest path is what an adversary actually optimises.",
    related: ["threat-model", "kill-chain", "privilege-escalation-path", "pyramid-of-pain", "fair-model"],
    mode: "motus"
  },
  {
    id: "attack-surface",
    term: "Attack Surface",
    domain: "Threat Modeling",
    short: "The complete set of points where an untrusted party can supply input or extract output from a system.",
    long: "Attack surface is not a count of open ports; it is entry points weighted by reachability and privilege. It includes network listeners, file and message parsers, deserialisation paths, browser extensions, admin consoles, CI webhooks, OAuth grants held by third-party apps, and every SaaS tenancy holding your data. Mandiant's M-Trends 2026 reporting found exploits remained the leading initial infection vector at 32 percent for the sixth consecutive year, with internet-facing edge appliances — VPNs, gateways, file transfer products — repeatedly the entry point, because they are exposed by definition and instrumented by nobody. Surface grows silently through acquisition, shadow IT, and every convenience integration approved without an owner.",
    why: "Reduction beats detection on cost per unit of risk removed, and it is the only control that keeps working while you sleep.",
    related: ["threat-model", "requisite-variety", "cisa-kev", "supply-chain-attack", "paved-road"],
    mode: "both"
  },
  {
    id: "kill-chain",
    term: "Kill Chain",
    domain: "Threat Intelligence",
    short: "A sequenced model of intrusion phases, used to place detections where interruption is cheapest for you and costliest for the adversary.",
    long: "Lockheed Martin's Cyber Kill Chain names seven phases — reconnaissance, weaponisation, delivery, exploitation, installation, command and control, actions on objectives — and the analytic point is that breaking any single link defeats the whole chain. Its virtue is sequencing; its limitation is that it is perimeter-shaped and linear, so modern intrusions that begin with valid credentials skip most of it. Practitioners therefore run it alongside MITRE ATT&CK, which is a matrix of observed techniques rather than a straight line, and use the chain for narrative and the matrix for coverage. Used well, it forces the question every detection programme avoids: at which phase do we currently catch this actor, and what would it take to catch them one phase earlier.",
    why: "Detection value is not uniform across the chain — catching command and control is worth far more than catching exfiltration. The model makes that ranking explicit and defensible to a board.",
    related: ["mitre-attack", "pyramid-of-pain", "detection-engineering", "lateral-movement", "attack-tree"],
    mode: "both"
  },
  {
    id: "mitre-attack",
    term: "MITRE ATT&CK",
    domain: "Threat Intelligence",
    short: "A curated knowledge base of adversary tactics, techniques, and procedures observed in real intrusions.",
    long: "ATT&CK organises behaviour into tactics (the adversary's goal — initial access, persistence, credential access, exfiltration) and techniques with sub-techniques (how the goal is achieved), each backed by observed group and software references. It is a shared vocabulary first and a coverage map second: it lets a detection engineer, a red teamer, and a vendor argue about the same thing. The common misuse is heat-map theatre — colouring cells green because a product claims a technique, without evidence that a specific data source and a specific rule would fire in your estate. Coverage is a property of your telemetry and your rules under test, not of your purchase order.",
    why: "It is the lingua franca of the field. Fluency lets you translate threat intelligence into detection work into board narrative without losing meaning at each hop.",
    related: ["d3fend", "kill-chain", "detection-engineering", "purple-team", "living-off-the-land"],
    mode: "both"
  },
  {
    id: "detection-engineering",
    term: "Detection Engineering",
    domain: "Detection",
    short: "Treating detections as software: version-controlled, tested, measured for precision and recall, and retired when they stop earning their keep.",
    long: "A detection has a lifecycle — hypothesis grounded in a technique, data source verification, rule authoring, validation against emulated adversary behaviour, tuning against production noise, and deprecation. The two numbers that matter are true positive rate against emulated behaviour and analyst-hours consumed per confirmed incident; a rule can be technically correct and still be a net negative if it drowns the queue. Mature teams run detection-as-code with pull requests, unit tests against recorded telemetry, and continuous validation so that an agent upgrade or a log schema change surfaces as a failing test rather than as silence. Silence is the failure mode nobody alerts on, which is why coverage must be actively probed rather than assumed.",
    why: "Undetected detection failure is the most common way mature programmes get breached. Only an engineering discipline with tests catches a rule that quietly stopped firing in March.",
    related: ["alert-fatigue", "control-decay", "purple-team", "pyramid-of-pain", "mitre-attack"],
    mode: "motus"
  },
  {
    id: "breakout-time",
    term: "Breakout Time",
    domain: "Incident Response",
    short: "How long an adversary takes to move from the first compromised host to a second one.",
    long: "Breakout time sets the clock your response must beat: if you contain after breakout, you are chasing a footprint rather than removing one. The trend runs strongly against defenders. Mandiant's M-Trends 2026 observed that the median time between initial access and hand-off to a follow-on operator fell from more than eight hours in 2022 to 22 seconds in 2025, driven by automated access brokerage. That collapse breaks the human-in-the-loop containment model outright: any response plan whose first step is page a human and convene a bridge has already lost the race, which is why pre-authorised automated containment for high-confidence signals stops being a nice-to-have.",
    why: "It is the number that decides whether your response can be manual. If breakout is seconds and your triage is minutes, automation is not an efficiency project, it is the control.",
    related: ["dwell-time", "lateral-movement", "detection-engineering", "assume-breach", "blast-radius"],
    mode: "motus"
  },
  {
    id: "defense-in-depth",
    term: "Defense in Depth",
    domain: "Architecture",
    short: "Layered independent controls so that the failure of any one does not become the failure of the system.",
    long: "The word doing the work is independent. Three controls that share an identity provider, a management agent, or an assumption about network location are one control wearing three badges, and an adversary who defeats the shared premise defeats all of them at once. Genuine depth requires diversity along the axis the attacker must cross: different trust anchors, different failure modes, different operators. Depth also has a cost curve — every added layer adds operational friction, more chances for misconfiguration, and more surface — so past some point another layer reduces security by consuming the attention that would have kept the existing layers correct.",
    why: "Most architectures claim depth and deliver correlation. Interrogating independence, not counting layers, is what separates real resilience from a slide.",
    related: ["failure-domain", "swiss-cheese-model", "compensating-control", "blast-radius", "requisite-variety"],
    mode: "both"
  },
  {
    id: "control-decay",
    term: "Control Decay",
    domain: "Assurance",
    short: "The steady, silent loss of a control's effectiveness after deployment, absent continuous verification.",
    long: "Controls degrade for mundane reasons: an agent fails to install on a new image, an exclusion added for a performance incident is never removed, a log source changes schema and a rule stops matching, a firewall rule is loosened for a migration that finished two years ago. Nothing alerts, because the control's absence produces no events — the failure signature of a detection is silence, and silence looks exactly like peace. This is why point-in-time assurance (an annual audit, a one-off pentest) systematically overstates posture, and why continuous control validation, breach-and-attack simulation, and coverage tests belong in the same pipeline as unit tests. Assume every control you are not actively testing has decayed since you last looked.",
    why: "The gap between the control you designed and the control that exists today is where breaches live. Verification cadence, not control count, is the real posture number.",
    related: ["detection-engineering", "purple-team", "compensating-control", "stock-and-flow", "security-debt"],
    mode: "both"
  },
  {
    id: "base-rate",
    term: "Base Rate",
    domain: "Risk",
    short: "The underlying prevalence of an event, without which any test result or alert is uninterpretable.",
    long: "The base rate fallacy is why a 99 percent accurate detector for a phenomenon occurring in one of a hundred thousand sessions produces roughly a thousand false alarms for each true one. This is not a tuning problem; it is arithmetic, and no amount of model improvement escapes it without changing the population you test. The practical escapes are to raise the prior by narrowing scope (run the detector only on privileged sessions, only on crown-jewel systems, only after a corroborating signal), or to chain independent weak signals so the joint prior climbs. The same arithmetic governs risk conversations: an executive asking how likely is this deserves a stated base rate, not an adjective.",
    why: "It is the mathematical reason your SOC drowns and your risk register is fiction. Leaders who cannot reason about priors will buy detection that cannot work.",
    related: ["alert-fatigue", "fair-model", "epss", "residual-risk", "detection-engineering"],
    mode: "both"
  },
  {
    id: "inherent-risk",
    term: "Inherent Risk",
    domain: "Risk",
    short: "Exposure before controls — the size of the problem if nothing were done.",
    long: "Inherent risk is a modelling device rather than a real state, since no system runs with zero controls, and its value is comparative: it ranks where to look and it shows how much of your posture depends on control operation continuing to work. A system with enormous inherent risk and excellent controls is fragile in a specific way — its safety is entirely operational, so a single sustained control failure returns it to the inherent state. That is the crown-jewel profile, and it argues for architectural change that lowers inherent exposure (hold less data, shorten retention, split the failure domain) rather than for another control layer stacked on top.",
    why: "It distinguishes systems that are safe by design from systems that are safe only while everything keeps working. Those two need entirely different investment.",
    related: ["residual-risk", "crown-jewels", "blast-radius", "risk-appetite", "fair-model"],
    mode: "novus"
  },
  {
    id: "swiss-cheese-model",
    term: "Swiss Cheese Model",
    domain: "Safety",
    short: "James Reason's model: accidents occur when holes in successive imperfect defensive layers momentarily align.",
    long: "Reason distinguished active failures — the operator's slip, the missed alert — from latent conditions, the decisions taken months earlier that shaped the holes: understaffing, a confusing console, a deadline that made the shortcut rational. The model's discipline is that blaming the last hole an event passed through explains nothing, because the hole was made available by design choices upstream. In security the latent conditions are usually organisational: no owner for a system, an exception process with no expiry, a control whose failure is invisible. The alignment framing also warns against correlated layers, since holes that share a cause move together and will align far more often than independence would predict.",
    why: "It reframes an incident from who erred to what made this error likely and inevitable, which is the only framing that produces changes that hold.",
    related: ["defense-in-depth", "normal-accident-theory", "blameless-postmortem", "safety-ii", "failure-domain"],
    mode: "both"
  },
  {
    id: "safety-ii",
    term: "Safety-II",
    domain: "Safety",
    short: "Erik Hollnagel's reframing: study why things usually go right, because success and failure come from the same adaptive behaviour.",
    long: "Safety-I counts and eliminates failures; Safety-II observes that complex socio-technical systems work at all only because people continually adapt to gaps between work-as-imagined and work-as-done. Those adaptations are what keep the system running on a normal Tuesday and also what produce the occasional bad outcome, so eliminating the adaptation removes the safety along with the hazard. For a security programme this means studying near-misses and normal operations, not only incidents; asking engineers where the policy makes their job impossible, because that is where the workaround will be; and measuring capacity to respond rather than only absence of events. It also predicts that a control which forces a workaround has not removed the risk, it has hidden it.",
    why: "Your controls are being adapted around right now by competent people with deadlines. Finding those adaptations before an adversary does is a leading indicator no incident count will give you.",
    related: ["swiss-cheese-model", "blameless-postmortem", "normal-accident-theory", "paved-road", "control-decay"],
    mode: "motus"
  },
  {
    id: "blameless-postmortem",
    term: "Blameless Postmortem",
    domain: "Learning",
    short: "A review that assumes everyone acted reasonably given what they knew, and hunts for the conditions that made the action reasonable.",
    long: "Blamelessness is not kindness; it is an information-extraction technique. The moment participants anticipate consequence, the account narrows to the defensible version and the details you need — what the console actually showed, why the runbook was ignored, who was paged three times that night — disappear permanently. The method is to reconstruct the timeline from the actors' point of view, resist counterfactual reasoning (they should have noticed), separate the review from any performance process, and produce owned actions with dates rather than a list of recommendations. Security adds a wrinkle: legal privilege and regulatory disclosure pressures push toward sanitised narratives, so the internal learning artefact and the external report must be deliberately separated.",
    why: "Organisations that punish disclosure stop hearing about problems, and a CISO who cannot hear about problems is blind by construction. This is the practice that keeps the channel open.",
    related: ["safety-ii", "swiss-cheese-model", "tabletop-exercise", "control-decay", "dwell-time", "corrective-action", "incident-commander", "game-day"],
    mode: "both"
  },
  {
    id: "assume-breach",
    term: "Assume Breach",
    domain: "Doctrine",
    short: "Design and operate as if an adversary already has a foothold inside your perimeter.",
    long: "The doctrine follows from base rates, not pessimism: with credential abuse and edge-device exploitation as leading initial vectors, the probability that no unauthorised access exists anywhere in a large estate at a given moment is low. Assuming breach changes what you build — segmentation and identity-based authorisation over network location, short-lived credentials over standing ones, per-request authorisation over session trust, telemetry designed for retrospective hunting rather than only live alerting. It also changes what you exercise: recovery, communication, and containment under uncertainty rather than prevention alone. The misreading to avoid is fatalism; prevention still has the best cost per unit of risk removed. Assume breach means prevention is necessary and insufficient.",
    why: "It is the doctrinal shift that produces architectures which survive their first compromise. Every organisation adopts it eventually — the choice is whether before or after.",
    related: ["zero-trust", "blast-radius", "lateral-movement", "dwell-time", "breakout-time"],
    mode: "both"
  },
  {
    id: "living-off-the-land",
    term: "Living Off the Land",
    domain: "Adversary Tradecraft",
    short: "Operating with the tools already present on a system so that malicious activity blends into administrative noise.",
    long: "Instead of dropping malware, the adversary uses signed, trusted, expected binaries and interfaces — scripting hosts, management frameworks, remote administration utilities, cloud provider APIs, backup and monitoring agents. This defeats detection strategies rooted in file reputation and hashes entirely, which is precisely Bianco's pyramid argument made flesh, and it is why Cobalt Strike's share of observed intrusion tooling has fallen sharply while intrusion volume has not. Detection has to move to intent expressed in context — which parent process invoked this, from which account, at what hour, against which target, with what argument shape — and to the sequence of actions rather than any single one. The corollary is defensive: every powerful administrative capability you leave universally available is a capability you have donated.",
    why: "It kills the comfortable assumption that malicious equals unknown. Programmes that never make this shift keep passing tool evaluations and keep missing real intrusions.",
    related: ["pyramid-of-pain", "detection-engineering", "lateral-movement", "mitre-attack", "least-privilege", "edr", "attack-technique", "log-source-fidelity", "detection-as-code"],
    mode: "both"
  },
  {
    id: "provenance",
    term: "Provenance",
    domain: "Supply Chain",
    short: "Cryptographically verifiable metadata stating what built an artefact, by what process, from what inputs.",
    long: "Provenance in the in-toto and SLSA sense is an attestation signed by the build platform, binding the output artefact digest to the source commit, the builder identity, the build definition, and the resolved dependencies. Its power is that verification moves from trusting a publisher's identity to checking a policy about how the artefact came to exist — this binary must come from this repository, on this builder, from a protected branch — which is a far stronger claim than a signature alone. Ecosystems have moved in this direction with keyless signing bound to workload identity and transparency logs, so verification does not depend on long-lived private keys held by maintainers. The practical requirement is enforcement at admission: provenance nobody checks is provenance nobody has.",
    why: "It converts trust in people into policy over process, which is the only version of supply-chain trust that scales past a few dozen maintainers.",
    related: ["slsa", "sbom", "supply-chain-attack", "workload-identity", "certificate-transparency"],
    mode: "motus"
  },
  {
    id: "crown-jewels",
    term: "Crown Jewels",
    domain: "Governance",
    short: "The small set of assets whose compromise would materially change the organisation's future.",
    long: "Crown jewels are defined by consequence, not by data classification labels: the signing key that authenticates every product update, the model weights that constitute the company's advantage, the customer ledger, the control plane that can reach every other system. The discipline is ruthless scoping — if the list exceeds a dozen it is an inventory, not a prioritisation — and then mapping every path to each item, including the indirect ones through backups, replicas, analytics copies, and vendor access. The second-order effect matters: designating crown jewels means consciously accepting more risk everywhere else, and that acceptance has to be explicit or the designation quietly becomes a wish list.",
    why: "Uniform protection across an estate means uniformly inadequate protection of what matters. Naming the short list is what makes concentrated defence politically possible.",
    related: ["blast-radius", "inherent-risk", "risk-appetite", "failure-domain", "key-ceremony"],
    mode: "both"
  },
  {
    id: "security-debt",
    term: "Security Debt",
    domain: "Governance",
    short: "Accumulated deferred security work that compounds interest in the form of rising exposure and rising cost to fix.",
    long: "Like technical debt, some of it is deliberate and rational — ship now, harden next quarter — and some is inadvertent, arising from decisions made before anyone knew better. The interest is real and compounding: an unmanaged identity system accretes dependencies, so the cost of replacing it grows every month while the exposure grows too. Making the debt visible requires a register with principal (what it would cost to fix), interest (how the exposure grows), and a named owner, expressed in the same terms engineering already uses for technical debt so that it competes in the same forum rather than in a separate security ritual. Debt taken without a repayment date is not debt, it is a permanent architectural decision made by omission.",
    why: "Most CISOs inherit far more debt than they can service. Choosing which to repay and which to formally accept — and saying so out loud — is the core of the job's first year.",
    related: ["control-decay", "compensating-control", "stock-and-flow", "residual-risk", "paved-road"],
    mode: "both"
  },

  /* ---------------- IDENTITY AND ACCESS ---------------- */
  {
    id: "zero-trust",
    term: "Zero Trust",
    domain: "Identity",
    short: "Authorise every request on its own merits — identity, device state, and context — rather than granting trust by network position.",
    long: "NIST SP 800-207 frames zero trust as a set of principles rather than a product: no implicit trust from network location, per-session authorisation, dynamic policy incorporating device posture and behavioural signals, and continuous monitoring feeding back into policy. The architectural pieces are a policy decision point and a policy enforcement point separating the control plane from the data plane. The dominant failure is buying a product labelled zero trust while leaving the flat internal network and the standing admin roles intact — the model's value comes from removing implicit trust, and a VPN replacement that still grants broad access after one authentication has moved the perimeter rather than removed it. The honest test is whether a compromised internal host gains anything by virtue of being internal.",
    why: "It is the only architectural doctrine that survives the assumption you are already breached, and it converts network arguments into identity and policy arguments where they can actually be resolved.",
    related: ["assume-breach", "least-privilege", "continuous-access-evaluation", "workload-identity", "mtls"],
    mode: "both"
  },
  {
    id: "separation-of-duties",
    term: "Separation of Duties",
    domain: "Identity",
    short: "No single actor can complete a sensitive transaction end to end without a second, independent actor.",
    long: "The control splits a dangerous capability across principals — one proposes, another approves; one writes the code, another releases it; one holds a key share, another holds the second. Its strength is that it converts a single compromise into a conspiracy requirement, which is why it appears in every high-assurance regime from payments to nuclear command. Two failure modes destroy it in practice: automation that holds both roles, such as a CI identity that can both merge and deploy, and approval fatigue, where the second party rubber-stamps because they have no independent basis to judge. It also fights availability, so every implementation needs a defined and heavily monitored break-glass path or people will build an undocumented one.",
    why: "It is the structural answer to insider risk and to credential theft simultaneously, and it is where automation quietly reintroduces the risk you thought you had removed.",
    related: ["least-privilege", "break-glass", "threshold-signature", "key-ceremony", "entitlement-review"],
    mode: "both"
  },
  {
    id: "rbac",
    term: "RBAC",
    domain: "Authorization",
    short: "Role-based access control — permissions attach to roles, users attach to roles.",
    long: "RBAC gained ground because it matches how organisations describe themselves and because role assignment is auditable. Its structural weakness is role explosion: every genuine exception spawns a new role, and mature estates end up with more roles than users, at which point the model has stopped abstracting anything. It also cannot express relationship or context conditions — this user may read this document because they own it, or only during business hours, or only from a managed device — so those get hard-coded into applications where nobody can review them. RBAC remains the right default for coarse organisational permissions, and the right move is to notice when a requirement is genuinely relational or attribute-driven rather than bending roles until they break.",
    why: "It is the model you will inherit almost everywhere. Recognising the point where role explosion signals a modelling mismatch saves years of unmanageable entitlement sprawl.",
    related: ["abac", "rebac", "entitlement-review", "least-privilege", "separation-of-duties"],
    mode: "novus"
  },
  {
    id: "abac",
    term: "ABAC",
    domain: "Authorization",
    short: "Attribute-based access control — decisions evaluate attributes of subject, resource, action, and environment against policy.",
    long: "ABAC, described in NIST SP 800-162, expresses rules such as allow if the subject's clearance meets the resource's classification, the device is compliant, and the request originates from an approved jurisdiction. Its expressiveness is its strength and its curse: policies compose in ways that are hard to reason about, and answering the audit question who can access this resource requires evaluating policy across the whole attribute space rather than reading a list. Attribute integrity becomes the real security boundary, since anyone who can edit a subject attribute can grant themselves access without touching an access policy. In practice it works best combined with coarse RBAC for the broad grant and ABAC for the conditions on top.",
    why: "It is how context-aware and zero-trust policy actually gets expressed, and it moves your attack surface onto attribute provenance — a boundary most teams forget to defend.",
    related: ["rbac", "rebac", "zero-trust", "continuous-access-evaluation", "least-privilege"],
    mode: "motus"
  },
  {
    id: "rebac",
    term: "ReBAC",
    domain: "Authorization",
    short: "Relationship-based access control — permission derives from a graph of relationships between subjects and objects.",
    long: "ReBAC answers questions RBAC cannot express naturally: you may edit this document because you are an editor of the folder that contains it, and members of the team that owns that folder inherit viewer rights. Authorisation becomes a graph reachability problem over stored relationships, which is exactly how collaborative products actually behave. The costs are real — evaluation requires traversal, so latency and caching become correctness problems, and consistency across a distributed store introduces the possibility of deciding on stale relationships. It is the right model for document, repository, and multi-tenant collaboration systems, and the wrong model for simple administrative permissions where a role is genuinely the truth.",
    why: "Most modern products are relationship-shaped, and forcing them into roles produces the application-embedded authorisation logic that nobody can audit or change safely.",
    related: ["zanzibar", "rbac", "abac", "confused-deputy", "least-privilege"],
    mode: "motus"
  },
  {
    id: "zanzibar",
    term: "Zanzibar",
    domain: "Authorization",
    short: "Google's globally distributed authorisation system, and the reference design for relationship-based authorisation at scale.",
    long: "The 2019 USENIX ATC paper describes a service storing relation tuples of the form object hash relation at user, evaluated by graph traversal, serving on the order of ten million authorisation checks per second over trillions of tuples with single-digit millisecond latency. Its most instructive contribution is the consistency work: to avoid the new enemy problem — where a permission revocation and a content update are applied out of causal order, so a removed collaborator reads content they should never see — clients pass opaque consistency tokens called zookies that pin evaluation to a snapshot at or after the relevant change. That problem is not an artefact of scale; any authorisation system with caching or replication has it, and most simply have not noticed.",
    why: "It is the clearest worked example that authorisation is a distributed systems problem, not a policy file. The new enemy problem exists in your cached permission checks right now.",
    related: ["rebac", "confused-deputy", "abac", "entitlement-review", "feedback-loop"],
    mode: "motus"
  },
  {
    id: "privilege-escalation-path",
    term: "Privilege Escalation Path",
    domain: "Identity",
    short: "A chain of individually legitimate permissions that composes into unintended administrative power.",
    long: "No single grant in the chain looks alarming: this role may update a Lambda function; that function runs as a second role; that role may read a secret; that secret authenticates a third identity with admin. The escalation is a property of the graph, invisible to any per-permission review, and it is why graph-based analysis of identity relationships finds paths that years of entitlement reviews missed. The same shape recurs on-premises through Active Directory ACLs and group nesting, and in CI through job permissions and workflow triggers. The operational discipline is to compute the paths continuously, treat any path from a low-trust principal to a crown-jewel principal as a finding, and break the shortest edge rather than trying to prune everything.",
    why: "Attackers enumerate this graph automatically and cheaply; most defenders have never computed it once. It is the fastest way to find the real distance from anywhere to everything.",
    related: ["blast-radius", "least-privilege", "lateral-movement", "service-account", "attack-tree"],
    mode: "motus"
  },
  {
    id: "break-glass",
    term: "Break-Glass",
    domain: "Identity",
    short: "A pre-authorised emergency access path that works when the normal identity system does not.",
    long: "Break-glass exists because every access control system eventually fails or locks you out — the identity provider is down, the MFA service is unreachable, the incident is in the identity system itself. A credible design has credentials held offline in a controlled physical form, excluded from conditional access policies that could block them, alerting on any use to multiple independent channels, a mandatory post-use rotation, and a periodic test that proves the path actually works. The two failure modes are equal and opposite: an untested path that fails during the crisis it was made for, and a convenient path that becomes routine and turns into the softest target in the estate. Test it on a schedule and treat every unplanned use as an incident.",
    why: "Every organisation eventually has the day the identity provider is the outage. Whether that day is an inconvenience or an extended catastrophe is decided long in advance.",
    related: ["separation-of-duties", "just-in-time-access", "tabletop-exercise", "identity-provider", "key-ceremony"],
    mode: "both"
  },
  {
    id: "just-in-time-access",
    term: "Just-in-Time Access",
    domain: "Identity",
    short: "Privileges granted on request for a bounded window, with justification and automatic expiry, instead of held standing.",
    long: "JIT attacks the time dimension of least privilege, which is usually the cheaper half to fix: the permission set stays the same but the window in which a stolen credential can exercise it shrinks from permanent to minutes. A working implementation needs approval that is fast enough not to be routed around, a reason captured at request time, automatic revocation that genuinely fires, and a break-glass path for when the elevation service itself is unavailable. Watch two failure modes: elevation requests that are auto-approved by default, which converts JIT into standing access with extra logging, and long sessions that outlive the grant because the token was minted before expiry and nothing revokes it.",
    why: "Standing privilege is what turns a phished credential into a company-ending event. Removing the standing part is often achievable in a quarter, unlike a full entitlement redesign.",
    related: ["least-privilege", "break-glass", "entitlement-review", "continuous-access-evaluation", "privilege-escalation-path"],
    mode: "both"
  },
  {
    id: "entitlement-review",
    term: "Entitlement Review",
    domain: "Identity",
    short: "Periodic attestation by an accountable owner that a set of granted permissions is still justified.",
    long: "Done badly — a spreadsheet of a thousand cryptic permission names sent to a manager with a deadline — reviews produce bulk approval and an audit artefact with zero security value, while consuming real organisational goodwill. Done well, they are risk-weighted and evidence-driven: review only privileged and sensitive entitlements, show last-used dates alongside each grant, default to revoke on no response, and drive the workflow from the identity system so revocation actually happens. The structural insight is that reviews are a lagging, low-frequency control fighting a continuous accumulation process, so they should be paired with automatic expiry and usage-based pruning, which handle the volume, leaving humans to judge only the genuinely ambiguous.",
    why: "It is the control auditors care most about and the one that most often delivers nothing. Redesigning it around evidence and expiry converts a compliance tax into real risk reduction.",
    related: ["least-privilege", "just-in-time-access", "rbac", "service-account", "separation-of-duties"],
    mode: "both"
  },
  {
    id: "spiffe",
    term: "SPIFFE",
    domain: "Identity",
    short: "An open standard for workload identity: a URI-shaped identity, short-lived verifiable documents, and a local API to fetch them.",
    long: "A SPIFFE ID takes the form of a URI with a trust domain and a workload path, for example an identity naming a payments service within an organisation's trust domain. That identity is carried in an SVID, either an X.509-SVID with a short-lived certificate and private key suitable for mutual TLS, or a JWT-SVID for cases where a layer-7 proxy sits between workloads — the specification notes JWT-SVIDs are more susceptible to replay and prefers X.509 where possible. Workloads obtain credentials through the Workload API without holding any prior secret, analogous to a cloud metadata service, and the trust bundle they receive lets them verify peers. SPIRE is the reference implementation, performing node and workload attestation before issuing an identity.",
    why: "It gives you one identity namespace across clouds, clusters, and legacy systems, which is the precondition for any authorisation policy that spans your whole estate.",
    related: ["workload-identity", "mtls", "zero-trust", "root-of-trust", "service-account"],
    mode: "motus"
  },
  {
    id: "service-account",
    term: "Service Account",
    domain: "Identity",
    short: "A non-human identity used by an application or automation — usually the most over-permissioned and least governed principal you own.",
    long: "Service accounts share three properties that make them attractive targets: they are broadly permissioned because nobody wants to debug a permission error at 2am, they hold long-lived credentials because rotation risks an outage, and they are frequently exempt from MFA and conditional access because they cannot satisfy an interactive challenge. They also outlive their owners — the engineer who created the account leaves, the system it served is decommissioned, the credential lives on. Every mature programme ends up building the same inventory: every non-human identity with a named human owner, a declared purpose, an expiry, usage-based permission pruning, and a migration path to workload identity so the static secret disappears entirely.",
    why: "Non-human identities now vastly outnumber human ones in most estates and receive a fraction of the governance. That asymmetry is where the escalation paths are.",
    related: ["workload-identity", "privilege-escalation-path", "entitlement-review", "spiffe", "least-privilege"],
    mode: "both"
  },
  {
    id: "passkey",
    term: "Passkey",
    domain: "Authentication",
    short: "A phishing-resistant FIDO credential — a private key on a device, either bound to that device or synced across a user's ecosystem.",
    long: "A passkey is a WebAuthn credential where the private key never leaves the authenticator and the signature is bound to the relying party's origin, so a lookalike domain cannot obtain anything usable. Two flavours matter operationally: device-bound passkeys, where the key is non-extractable and lives in hardware such as a security key or platform TPM, and synced passkeys, which replicate through a provider's sync fabric so users can recover after losing a device. NIST SP 800-63B-4 addresses syncable authenticators explicitly, with requirements around key protection and the sync fabric, since the fabric's account recovery becomes part of your authentication security. That tradeoff is the whole decision: syncing buys adoption and recoverability at the cost of extending trust to the platform account.",
    why: "It removes credential phishing and credential reuse — the leading initial access vector — as a class rather than as a percentage, which almost no other control does.",
    related: ["webauthn", "fido2", "phishing-resistant-mfa", "adversary-in-the-middle", "session-token-theft"],
    mode: "both"
  },
  {
    id: "webauthn",
    term: "WebAuthn",
    domain: "Authentication",
    short: "The W3C browser API for public-key authentication, with origin binding as its central security property.",
    long: "WebAuthn defines two ceremonies. Registration creates a key pair scoped to a relying party identifier and returns a public key with an optional attestation statement about the authenticator's make and security properties. Authentication signs a server challenge together with client data that includes the actual origin the browser is talking to, so a signature produced for a phishing domain is invalid at the real one — this binding is done by the browser and cannot be defeated by a convincing user interface. Other elements matter in deployment: user verification distinguishes possession from possession-plus-biometric-or-PIN, and the signature counter offers a weak cloning signal that syncable credentials do not meaningfully provide.",
    why: "Understanding that origin binding is enforced by the browser, not the user, is what lets you explain why this is categorically different from every MFA that came before it.",
    related: ["passkey", "fido2", "phishing-resistant-mfa", "adversary-in-the-middle", "oidc"],
    mode: "both"
  },
  {
    id: "fido2",
    term: "FIDO2",
    domain: "Authentication",
    short: "The umbrella comprising W3C WebAuthn and the FIDO Alliance's CTAP protocol for talking to external authenticators.",
    long: "FIDO2 pairs WebAuthn, which the relying party and browser speak, with the Client to Authenticator Protocol, which the browser speaks to a roaming authenticator over USB, NFC, or Bluetooth. CTAP2 added features that matter for enterprise deployment: discoverable credentials enabling usernameless flows, PIN and biometric user verification on the authenticator itself, and enterprise attestation for organisations that must verify authenticator provenance before allowing registration. Attestation is where enterprise policy lives — it lets you require that credentials be created only on hardware meeting a certification level, which is the difference between allowing a certified security key and allowing any authenticator a user happens to have.",
    why: "The registration ceremony is the real trust decision, not the login. Whoever can register an authenticator owns the account, which is why enrolment and recovery deserve more scrutiny than authentication.",
    related: ["webauthn", "passkey", "phishing-resistant-mfa", "root-of-trust", "identity-provider"],
    mode: "motus"
  },
  {
    id: "phishing-resistant-mfa",
    term: "Phishing-Resistant MFA",
    domain: "Authentication",
    short: "Authentication where the credential cannot be relayed to an impostor verifier, because it is cryptographically bound to the real one.",
    long: "NIST SP 800-63B-4 defines phishing resistance as preventing disclosure of authentication secrets and valid authenticator outputs to an impostor verifier, and recognises two mechanisms: channel binding, which ties the authenticator output to the authenticated protected channel, and verifier name binding, which ties it to a verifier identifier authenticated within the protocol. The guidance is explicit that anything requiring manual entry — one-time passcodes, out-of-band codes — cannot be phishing-resistant, because typing breaks the binding between output and session. This is why push approval and TOTP fall to real-time relay proxies while WebAuthn does not, and why phishing-resistant is a protocol property rather than a marketing adjective.",
    why: "Adversary-in-the-middle kits defeat every MFA that a human can transcribe. Knowing exactly which mechanisms bind and which do not is what makes your rollout worth its cost.",
    related: ["webauthn", "passkey", "adversary-in-the-middle", "push-fatigue", "fido2"],
    mode: "both"
  },
  {
    id: "push-fatigue",
    term: "Push Fatigue",
    domain: "Authentication",
    short: "Bombarding a user with authentication prompts until one is approved out of confusion or exhaustion.",
    long: "The attack requires only a valid password and an MFA method with a binary approve control; the adversary triggers authentication repeatedly, often at night, sometimes accompanied by a call impersonating IT support to explain the prompts away. It has featured in numerous high-profile intrusions and is cheap enough to be fully automated. Partial mitigations — number matching, showing application and geographic context, rate limiting, and alerting on denied-prompt storms — raise the bar meaningfully but do not remove the class, because the underlying weakness is that a human is asked to make a security decision with almost no information. The complete fix is to remove the approve button by moving to origin-bound cryptographic authentication.",
    why: "It is the clearest proof that MFA is a category, not a control. The failure is in the ceremony's design, and no amount of user training removes it.",
    related: ["phishing-resistant-mfa", "adversary-in-the-middle", "passkey", "consent-phishing", "identity-provider"],
    mode: "both"
  },
  {
    id: "adversary-in-the-middle",
    term: "Adversary-in-the-Middle",
    domain: "Authentication",
    short: "A relay proxy that sits between user and real site, harvesting credentials and the resulting session token in real time.",
    long: "Modern phishing kits act as reverse proxies: the victim interacts with the genuine site through the attacker's server, so every page, every branding element, and every MFA challenge is authentic. The user completes MFA correctly, the real site issues a session cookie, and the proxy captures it — after which the attacker replays the session and never needs the credential again. This defeats TOTP, push approval, and SMS entirely, and it is why session theft has displaced credential theft as the dominant identity attack. Two defences actually bite: origin-bound authentication, which will not produce a valid signature for the proxy's domain, and binding the resulting session to hardware so a stolen cookie is inert elsewhere.",
    why: "It explains why organisations with full MFA coverage still get compromised through identity. If your controls stop at authentication, you have defended the wrong artefact.",
    related: ["session-token-theft", "phishing-resistant-mfa", "device-bound-session-credentials", "passkey", "push-fatigue"],
    mode: "both"
  },
  {
    id: "saml",
    term: "SAML",
    domain: "Federation",
    short: "An XML-based federation standard where an identity provider issues signed assertions that service providers consume.",
    long: "SAML 2.0 remains the workhorse of enterprise single sign-on, particularly for older SaaS. Its security rests entirely on XML digital signature validation, which is notoriously subtle: signature wrapping attacks, canonicalisation ambiguities, comment-injection parsing differences, and implementations that verify a signature without checking that it covers the assertion actually used have all produced authentication bypasses in widely deployed products. Beyond the parsing hazards, the golden SAML technique lets an adversary who steals an identity provider's token-signing key mint assertions for any user at any service provider, entirely offline and invisible to the identity provider's logs — which is what makes that key a first-order crown jewel.",
    why: "You will run SAML for years whether you like it or not. Knowing that its signing key is a skeleton key for your whole estate changes how you store and monitor it.",
    related: ["oidc", "identity-provider", "federation", "crown-jewels", "hsm"],
    mode: "both"
  },
  {
    id: "oidc",
    term: "OIDC",
    domain: "Federation",
    short: "OpenID Connect — an identity layer over OAuth 2.0 that returns a signed ID token describing the authenticated user.",
    long: "OIDC adds authentication semantics to OAuth's authorisation framework: an ID token, which is a JWT with issuer, subject, audience, expiry, nonce, and authentication context claims, plus discovery and JWKS endpoints so relying parties can find keys and metadata automatically. The critical validation rules are unglamorous and constantly violated: verify the signature against the issuer's published keys, verify issuer and audience match exactly, verify expiry, and verify the nonce ties the token to your own request. It is also the substrate for workload federation — CI systems and cloud platforms exchange OIDC tokens for short-lived cloud credentials, which removes static keys from pipelines but makes the subject and audience claim conditions security-critical, since a loose condition can let any repository assume your role.",
    why: "It is the connective tissue of modern identity, human and machine. The default-insecure part is claim validation, and that is exactly where implementations cut corners.",
    related: ["oauth", "jwt", "saml", "workload-identity", "identity-provider"],
    mode: "both"
  },
  {
    id: "oauth",
    term: "OAuth 2.0",
    domain: "Authorization",
    short: "A delegation framework letting an application act on a resource owner's behalf with scoped, revocable access — not an authentication protocol.",
    long: "OAuth exists to avoid giving applications your password: the authorisation server issues an access token with limited scope and lifetime, and the resource server enforces it. The most persistent industry error is using OAuth as authentication, which it was never designed for — an access token proves an application was granted access, not that a user is present now, which is why OIDC exists. The security-relevant mechanics are redirect URI validation, exact scope granularity, state parameters for CSRF protection, PKCE for public clients, and sender-constrained tokens for high-value flows. The current best-practice guidance consolidated in the OAuth 2.1 work removes the implicit and password grants outright because they leaked tokens through URLs and taught users to hand over credentials.",
    why: "Every SaaS integration and AI agent connector in your estate runs on OAuth grants. Those grants are standing access nobody reviews, and they survive password resets.",
    related: ["oidc", "pkce", "jwt", "consent-phishing", "confused-deputy"],
    mode: "both"
  },
  {
    id: "pkce",
    term: "PKCE",
    domain: "Authorization",
    short: "Proof Key for Code Exchange — binds an authorisation code to the client that requested it, defeating code interception.",
    long: "The client generates a random verifier, sends its hash as a challenge with the authorisation request, and must present the original verifier when redeeming the code. An attacker who intercepts the code — through a malicious app registering the same custom URI scheme, a leaked redirect, or a browser history entry — cannot exchange it without the verifier that never left the legitimate client. Originally specified for mobile and other public clients that cannot hold a secret, PKCE is now recommended for confidential clients too, because it also defends against authorisation code injection where a code obtained in one session is replayed into another. Two implementation details decide whether it works: use the S256 challenge method rather than plain, and have the authorisation server reject requests lacking a challenge instead of silently downgrading.",
    why: "It is a small, cheap change that closes a whole class of interception, and its downgrade-tolerant deployments are a good example of a control that is present but not enforced.",
    related: ["oauth", "oidc", "jwt", "consent-phishing", "trust-boundary"],
    mode: "motus"
  },
  {
    id: "jwt",
    term: "JWT",
    domain: "Tokens",
    short: "JSON Web Token — a base64url-encoded, signed set of claims that is readable by anyone who holds it.",
    long: "A JWT is a bearer artefact: possession is authorisation unless it is explicitly sender-constrained. Its historic vulnerability catalogue is instructive — accepting the none algorithm, confusing an asymmetric algorithm for a symmetric one so the public key is used as an HMAC secret, trusting the key identifier in the header to fetch a key from an attacker-controlled location, and skipping audience or expiry validation. The structural issue is revocation: a stateless token remains valid until it expires, so short lifetimes plus refresh, or a revocation check on sensitive operations, are the only real answers. And because the payload is encoded rather than encrypted, putting anything sensitive in a JWT means publishing it to whoever holds the token.",
    why: "JWTs carry authorisation across nearly every service boundary you own. Bearer semantics plus weak revocation is precisely why stolen tokens are now the primary identity attack.",
    related: ["oidc", "oauth", "session-token-theft", "continuous-access-evaluation", "mtls"],
    mode: "both"
  },
  {
    id: "scim",
    term: "SCIM",
    domain: "Identity Lifecycle",
    short: "System for Cross-domain Identity Management — the REST standard for provisioning and de-provisioning accounts across systems.",
    long: "SCIM defines schemas for users and groups and CRUD operations so an identity provider can create, update, and deactivate accounts in downstream applications automatically. Its security value is concentrated in the de-provisioning half: manual offboarding reliably misses applications, and orphaned accounts with valid credentials are a durable route back into an organisation long after a departure. The control also has teeth in the other direction, since the SCIM credential held by the identity provider can typically create and modify accounts in every connected application, making it a high-value target and a mandatory item on your privileged inventory. Coverage is the honest metric here: SCIM protects only the applications actually connected, and the ones that matter are often the ones nobody integrated.",
    why: "Offboarding gaps are among the most common findings in real breach reports, and they are entirely mechanical to close. Measure applications integrated, not whether SCIM exists.",
    related: ["entitlement-review", "identity-provider", "federation", "service-account", "least-privilege"],
    mode: "novus"
  },
  {
    id: "identity-provider",
    term: "Identity Provider",
    domain: "Federation",
    short: "The system that authenticates principals and issues assertions or tokens other systems trust.",
    long: "The identity provider is the highest-consequence single dependency in a modern estate: it is both the control plane for access and a single failure domain for availability. Compromise of its signing keys, its administrative plane, or its support and recovery processes yields authentication as anyone, everywhere, which is why several major intrusions of recent years targeted the provider or its help desk rather than any application. The corresponding defences are heavier than most organisations apply: signing keys in hardware, administrative access under just-in-time elevation with separate credentials, help-desk identity-proofing that cannot be talked past, immutable logs shipped off-platform, and a rehearsed answer to the provider being unavailable or untrustworthy.",
    why: "It concentrates nearly all of your access risk in one place. That concentration is worth it for the control it buys, but only if you protect it like the crown jewel it is.",
    related: ["saml", "oidc", "federation", "crown-jewels", "break-glass"],
    mode: "both"
  },
  {
    id: "federation",
    term: "Federation",
    domain: "Federation",
    short: "Trusting another domain's authentication so that identity crosses organisational boundaries without shared credentials.",
    long: "Federation replaces credential duplication with a trust relationship, which is a clear win — one authoritative source, one place to disable an account, no password copies in a hundred applications. The subtlety is that trust is directional and transitive in ways people forget: if you federate with a partner and that partner federates with a third party, your access decisions now depend on a chain you cannot see. Each relationship needs explicit scoping (which users, which applications, which claims are accepted), claim filtering so an inbound assertion cannot assert privileged group membership, and a defined process for terminating trust quickly when the partner has an incident. Guest and cross-tenant access in cloud platforms is federation with the review step usually skipped.",
    why: "Every federation you accept extends your authentication boundary into an organisation whose controls you do not run. Knowing how to sever one under pressure is a rehearsal item, not a design detail.",
    related: ["identity-provider", "saml", "oidc", "trust-boundary", "supply-chain-attack"],
    mode: "both"
  },
  {
    id: "continuous-access-evaluation",
    term: "Continuous Access Evaluation",
    domain: "Identity",
    short: "Re-evaluating access during a session, so that a change in risk revokes access without waiting for token expiry.",
    long: "The OpenID Foundation's Continuous Access Evaluation Profile applies the Shared Signals Framework to access security: a transmitter emits events that receivers act on, including session revoked, token claims change, credential change, assurance level change, and device compliance change. This closes the window that short token lifetimes only narrow — if a device falls out of compliance or an account is disabled, the relying party learns immediately rather than in forty minutes. The design tension is availability against security: aggressive revocation on noisy signals produces user-visible failures, so implementations need signal quality good enough that revocation is rare and correct. It also demands that both sides implement the profile, which is why adoption, not capability, is the practical constraint.",
    why: "It is the mechanism that makes zero trust real at session granularity rather than at login. Without it, your policy engine is advisory for the life of every issued token.",
    related: ["zero-trust", "jwt", "session-token-theft", "abac", "just-in-time-access"],
    mode: "motus"
  },
  {
    id: "session-token-theft",
    term: "Session Token Theft",
    domain: "Identity",
    short: "Stealing an authenticated session artefact — cookie, refresh token, access token — to bypass authentication entirely.",
    long: "Once authentication succeeds, the resulting session artefact is a bearer credential, and stealing it skips every control you placed at the front door: no password, no MFA, no phishing-resistant ceremony. The theft routes are numerous — infostealer malware harvesting browser cookie stores, adversary-in-the-middle proxies capturing the cookie at issuance, tokens leaked into logs or error reports, and refresh tokens stored insecurely by native applications. The defences that actually work bind the artefact to something the attacker does not have: hardware-backed proof of possession, mutual TLS client certificates, or DPoP-style sender constraint, backed by continuous evaluation so that anomalous use terminates the session. Everything else — shorter lifetimes, IP checks — narrows the window without closing it.",
    why: "This is where identity attacks moved once MFA became common. If your identity roadmap ends at strong authentication, you have hardened the door and left the key in the lock.",
    related: ["adversary-in-the-middle", "device-bound-session-credentials", "jwt", "continuous-access-evaluation", "mtls"],
    mode: "both"
  },
  {
    id: "device-bound-session-credentials",
    term: "Device Bound Session Credentials",
    domain: "Identity",
    short: "Binding a web session to a private key held in device hardware, so a stolen cookie is useless on another machine.",
    long: "DBSC has the browser generate a key pair at login and store the private key in secure hardware such as a TPM where available. The session then uses short-lived cookies — on the order of ten minutes — and when one expires the browser must complete a challenge-response with the server, signing the challenge with the hardware-held key before a fresh cookie is issued. An adversary who exfiltrates the cookie store gets, at most, the remaining minutes of a single cookie on their own machine and can never refresh, which converts session theft from a persistent foothold into a brief and detectable one. It requires server-side work — a refresh endpoint and changes to the login flow — but it is the first mainstream mechanism that makes bearer cookies non-portable.",
    why: "It attacks the artefact that adversaries actually steal today. Understanding it lets you push your critical applications toward proof-of-possession rather than shorter expiry theatre.",
    related: ["session-token-theft", "adversary-in-the-middle", "tpm", "mtls", "passkey"],
    mode: "motus"
  },
  {
    id: "mtls",
    term: "Mutual TLS",
    domain: "Transport",
    short: "TLS where both ends present and validate certificates, making the connection itself an authenticated, proof-of-possession channel.",
    long: "Mutual TLS gives service-to-service communication an identity that cannot be replayed, because authentication requires the private key rather than a copyable bearer token. It is the transport most commonly paired with SPIFFE X.509-SVIDs and with service meshes, where sidecars terminate and originate mTLS transparently so applications need not change. The hard parts are operational rather than cryptographic: certificate lifecycle at scale, rotation without outage, revocation that actually propagates, and the fact that short-lived certificates make revocation largely moot — which is the point. Note also that mTLS authenticates the channel, not the request, so you still need request-level authorisation; a mesh that authenticates every peer and authorises none has built a very well-encrypted flat network.",
    why: "It is the strongest practical answer to stolen service credentials, and the distinction between authenticated channel and authorised request is where most mesh deployments quietly fail.",
    related: ["spiffe", "workload-identity", "zero-trust", "pki", "session-token-theft"],
    mode: "both"
  },
  {
    id: "consent-phishing",
    term: "Consent Phishing",
    domain: "Authorization",
    short: "Tricking a user into granting a malicious application OAuth permissions, obtaining durable access without any credential.",
    long: "The attacker registers an application with a plausible name, sends a legitimate consent link from the real identity provider, and the user approves scopes such as read all mail or read all files. No password is stolen, no MFA is triggered, and the resulting refresh token survives password resets and MFA re-enrolment — which is why this technique persists as a foothold long after an incident is believed closed. Defences are administrative rather than technical: disable user consent for anything beyond a curated low-risk scope set, require admin review for sensitive scopes, inventory existing grants including those approved years ago, and monitor for newly consented applications with broad permissions. Treat every OAuth grant in your tenant as standing access held by a third party.",
    why: "It bypasses your entire authentication investment by asking permission instead of stealing it, and the resulting access is invisible to controls that watch logins.",
    related: ["oauth", "confused-deputy", "push-fatigue", "entitlement-review", "supply-chain-attack"],
    mode: "both"
  },

  /* ---------------- APPLIED CRYPTOGRAPHY ---------------- */
  {
    id: "aead",
    term: "AEAD",
    domain: "Cryptography",
    short: "Authenticated Encryption with Associated Data — confidentiality plus integrity in one primitive, with unencrypted context bound in.",
    long: "AEAD takes a key, a nonce, a plaintext, and optional associated data, and returns ciphertext plus an authentication tag; decryption fails outright if either ciphertext or associated data has been altered. The associated data slot is the underused feature: it binds context that must travel in the clear — a record identifier, a tenant ID, a purpose string — so a valid ciphertext cannot be cut from one context and pasted into another. AES-GCM and ChaCha20-Poly1305 are the workhorses; AES-GCM-SIV and other nonce-misuse-resistant constructions trade a little performance for far graceful degradation when nonces repeat. The rule that supersedes all others is never to compose encryption and a MAC yourself: use an AEAD, because the historic parade of padding-oracle and encrypt-then-MAC-ordering failures came from exactly that composition.",
    why: "It is the correct default for every symmetric encryption decision you will make, and its associated-data parameter prevents a whole class of ciphertext-substitution bugs that reviews rarely catch.",
    related: ["nonce-reuse", "envelope-encryption", "key-derivation-function", "constant-time", "kms"],
    mode: "both"
  },
  {
    id: "nonce-reuse",
    term: "Nonce Reuse",
    domain: "Cryptography",
    short: "Using the same nonce twice with the same key — catastrophic in counter-mode AEADs, not merely degrading.",
    long: "In AES-GCM the keystream is a function of key and nonce, so two messages encrypted under the same pair XOR to reveal the XOR of their plaintexts. Worse, the forbidden attack recovers the GHASH authentication subkey from the colliding pair, after which the adversary can forge arbitrary valid ciphertexts under that key — integrity is lost permanently, not just for the two messages. NIST SP 800-38D therefore requires IV uniqueness per key, recommends the 96-bit IV, and caps random-IV generation at 2 to the 32nd invocations per key to keep collision probability negligible. The practical hazards are mundane: a counter that resets when a container restarts, a virtual machine snapshot rolled back, the same key deployed to two replicas each with its own counter.",
    why: "It is the most common way real systems lose all cryptographic security while every test still passes. Nonce management is a distributed systems problem wearing a cryptography costume.",
    related: ["aead", "csprng", "key-rotation", "envelope-encryption", "constant-time"],
    mode: "both"
  },
  {
    id: "envelope-encryption",
    term: "Envelope Encryption",
    domain: "Cryptography",
    short: "Encrypt data with a per-object data key, then encrypt that data key with a higher-level key held in a KMS or HSM.",
    long: "The pattern exists because you want the strong key isolated in hardware and you cannot send terabytes through it. A data key is generated, returned in both plaintext and wrapped form, used locally to encrypt the payload, then wiped from memory while the wrapped copy is stored beside the ciphertext. Decryption calls the KMS to unwrap. This yields several properties at once: the root key never leaves its boundary, every KMS call is logged and authorised so you get a per-object audit trail, key rotation at the top level is cheap because only wrapped data keys need re-wrapping, and cryptographic erasure becomes possible. Bind an encryption context or additional authenticated data into the wrap so a wrapped key cannot be moved between objects or tenants.",
    why: "It is the standard structure of every serious data-at-rest design, and the encryption-context binding is what stops cross-tenant ciphertext substitution in multi-tenant systems.",
    related: ["kms", "hsm", "aead", "crypto-shredding", "key-rotation"],
    mode: "both"
  },
  {
    id: "kms",
    term: "KMS",
    domain: "Key Management",
    short: "A managed service that creates, stores, and uses keys inside a hardware boundary, exposing use rather than material.",
    long: "A key management service inverts the usual problem: instead of protecting a key your application holds, the application never holds it and instead calls an API to encrypt, decrypt, sign, or generate wrapped data keys. That makes key policy the real access control — who may use this key, for what operation, under what conditions — and it makes every use auditable. The subtleties that decide whether the design is sound are key policy separation from broad administrative roles, the deletion window before a key is destroyed, whether keys are single-region or multi-region and what that means for your recovery and jurisdiction story, and rotation semantics: rotating a KMS key typically adds new material for new encryptions while retaining old material to decrypt existing ciphertext.",
    why: "It converts key protection into access control and logging, which are disciplines your organisation already has. The key policy, not the hardware, becomes the thing to review.",
    related: ["envelope-encryption", "hsm", "key-rotation", "crypto-shredding", "least-privilege"],
    mode: "both"
  },
  {
    id: "hsm",
    term: "HSM",
    domain: "Key Management",
    short: "A tamper-resistant hardware device that generates and uses keys without ever exporting them in plaintext.",
    long: "Hardware security modules provide physical and logical protection validated under FIPS 140-3, with tamper evidence and response, an internal entropy source, and enforced key attributes such as non-exportable. Their guarantee is narrow and worth stating precisely: they protect key material from extraction, not from misuse — an adversary who obtains authorised access to the HSM's API can sign or decrypt whatever policy allows, without ever touching the key. That is why quorum authentication, per-key usage policy, rate limiting, and independent logging of every operation matter as much as the certification level. HSMs are the right home for root and signing keys whose compromise would be unrecoverable: code-signing roots, certificate authority keys, identity provider token-signing keys.",
    why: "It draws the line between keys that can be stolen and keys that can only be used. Knowing which of your keys deserve that line is a crown-jewel exercise, not a procurement one.",
    related: ["kms", "key-ceremony", "root-of-trust", "crown-jewels", "threshold-signature", "blind-signing", "hot-warm-cold-custody"],
    mode: "both"
  },
  {
    id: "key-ceremony",
    term: "Key Ceremony",
    domain: "Key Management",
    short: "A scripted, witnessed, recorded procedure for generating or handling a root key that no individual may ever control alone.",
    long: "A ceremony exists because the highest-value keys must be created under conditions nobody can later dispute: a written script rehearsed in advance, multiple participants in defined roles, tamper-evident materials, an independent witness or auditor, video recording, and a signed record of every step and serial number. Split control is the core mechanism — key shares distributed to separate custodians so a quorum is required to reconstitute or activate. The DNSSEC root ceremony is the public reference example. The failure modes are almost never cryptographic: they are the share stored in the same safe as another share, the custodian who left the company, the recovery procedure never tested, and the script that assumed a device model no longer manufactured.",
    why: "Root keys are the assets where recovery is impossible and trust is absolute. The ceremony is the only evidence you will ever have that the key was born clean.",
    related: ["hsm", "shamir-secret-sharing", "root-of-trust", "separation-of-duties", "crown-jewels", "hot-warm-cold-custody", "hardware-security-module", "proof-of-reserves"],
    mode: "motus"
  },
  {
    id: "key-rotation",
    term: "Key Rotation",
    domain: "Key Management",
    short: "Replacing key material on a schedule or on compromise, so that any single key protects a bounded amount of data for a bounded time.",
    long: "Rotation limits exposure in three ways: it caps the volume encrypted under one key (which matters for modes with usage limits), it bounds the window in which an undetected compromise is useful, and it exercises the machinery so that emergency rotation is a rehearsed path rather than an improvisation. The distinction that trips teams up is rotation versus re-encryption: generating new material for new operations is cheap, while re-encrypting existing ciphertext is expensive and often unnecessary if envelope encryption is in place. The hardest part is always the long tail — the embedded credential in a device fleet, the partner integration with a manually exchanged key, the backup encrypted under a key you were about to delete. Rotation you have never performed under pressure is a plan, not a control.",
    why: "The rotation you can actually execute in an hour, not the policy that says ninety days, is what determines your recovery time after a key compromise.",
    related: ["kms", "envelope-encryption", "nonce-reuse", "crypto-agility", "service-account"],
    mode: "both"
  },
  {
    id: "crypto-shredding",
    term: "Crypto-Shredding",
    domain: "Data Protection",
    short: "Rendering data unrecoverable by destroying its key rather than by erasing the data itself.",
    long: "Cryptographic erasure is the only practical deletion mechanism for data replicated across backups, immutable stores, log pipelines, and analytics copies you cannot enumerate. It requires designing for it from the start: a distinct key per subject or per tenant, envelope encryption so the per-subject key is itself wrapped and centrally destroyable, and rigorous discipline that no plaintext copy escaped the encryption boundary into a search index, a cache, or an export. The assurance argument to interrogate honestly is that erasure holds only as long as the algorithm does, which is why NIST SP 800-88 treats key destruction as valid sanitisation while noting the dependency, and why harvest-now-decrypt-later changes the calculus for long-lived data.",
    why: "It is the only credible answer to deletion obligations in a distributed estate, and it must be architected years before the first deletion request arrives.",
    related: ["envelope-encryption", "kms", "harvest-now-decrypt-later", "blast-radius", "key-rotation"],
    mode: "motus"
  },
  {
    id: "forward-secrecy",
    term: "Forward Secrecy",
    domain: "Cryptography",
    short: "Compromise of a long-term key does not expose past sessions, because each session used ephemeral keys that were discarded.",
    long: "In an ephemeral Diffie-Hellman exchange the session key is derived from key shares generated for that session and destroyed afterward; the long-term key only authenticates the exchange rather than protecting it. TLS 1.3 removed static RSA key exchange entirely and made forward secrecy mandatory, which is a large part of why the version is a security upgrade and not merely a performance one. Messaging protocols push further with ratcheting, giving both forward secrecy and post-compromise security so that a compromised device eventually heals as new key material is mixed in. The property has a boundary worth stating: it protects the transport, not the endpoints, so data already logged, cached, or stored at either end remains fully exposed.",
    why: "It is the property that decides whether a stolen private key exposes one session or a decade of recorded traffic. That distinction is the entire premise of harvest-now-decrypt-later.",
    related: ["harvest-now-decrypt-later", "hybrid-key-exchange", "post-quantum-cryptography", "pki", "mtls"],
    mode: "both"
  },
  {
    id: "post-quantum-cryptography",
    term: "Post-Quantum Cryptography",
    domain: "Cryptography",
    short: "Algorithms designed to resist attack by a cryptographically relevant quantum computer, running on classical hardware today.",
    long: "Shor's algorithm breaks RSA, finite-field Diffie-Hellman, and elliptic-curve cryptography — meaning essentially all deployed public-key cryptography — while Grover's algorithm merely halves the effective strength of symmetric ciphers, which AES-256 already absorbs. NIST standardised the first replacements in August 2024 as FIPS 203 (ML-KEM, for key establishment), FIPS 204 (ML-DSA, for signatures), and FIPS 205 (SLH-DSA, a hash-based signature alternative). NIST IR 8547 sets the transition trajectory: quantum-vulnerable public-key algorithms at the 112-bit level deprecated after 2030 and disallowed after 2035, with hybrid modes explicitly permitted to support phased migration. The binding constraint is inventory — most organisations cannot enumerate where their public-key cryptography lives, which makes migration planning impossible before discovery is done.",
    why: "The migration is a multi-year inventory and refactoring programme with a fixed regulatory horizon, and the work that determines whether you make it is discovery you should already be doing.",
    related: ["ml-kem", "ml-dsa", "harvest-now-decrypt-later", "hybrid-key-exchange", "crypto-agility"],
    mode: "both"
  },
  {
    id: "ml-kem",
    term: "ML-KEM",
    domain: "Cryptography",
    short: "Module-Lattice-Based Key-Encapsulation Mechanism, FIPS 203 — the NIST standard for post-quantum key establishment, derived from CRYSTALS-Kyber.",
    long: "ML-KEM is a key-encapsulation mechanism rather than a drop-in Diffie-Hellman: one party encapsulates a shared secret to the other's public key and transmits the resulting ciphertext. It is standardised at three parameter sets — ML-KEM-512, 768, and 1024 — with security resting on the hardness of module learning-with-errors. Its practical costs are size rather than speed: public keys and ciphertexts run to roughly a kilobyte or more, which matters for protocols with tight packet budgets, embedded devices, and anything that has to fit in a single round trip. Deployment in TLS has moved fastest through hybrid groups that combine X25519 with ML-KEM-768, so a break in either component still leaves the exchange secure.",
    why: "It is the concrete artefact of the post-quantum transition for confidentiality, and its size profile is what will actually break your legacy protocols and constrained devices.",
    related: ["post-quantum-cryptography", "hybrid-key-exchange", "ml-dsa", "forward-secrecy", "crypto-agility"],
    mode: "motus"
  },
  {
    id: "ml-dsa",
    term: "ML-DSA",
    domain: "Cryptography",
    short: "Module-Lattice-Based Digital Signature Algorithm, FIPS 204 — the NIST standard for post-quantum signatures, derived from CRYSTALS-Dilithium.",
    long: "ML-DSA replaces ECDSA and RSA signatures in the post-quantum era, standardised alongside SLH-DSA in FIPS 205, which offers a hash-based alternative with very conservative security assumptions but much larger signatures. Signature and public key sizes are substantially bigger than elliptic-curve equivalents, which strains certificate chains, code-signing manifests, and firmware update payloads far more than it strains CPU. The migration profile also differs fundamentally from key establishment: signatures are not vulnerable to harvest-now-decrypt-later, since forging a past signature has no value, so the urgency is driven by long-lived trust anchors instead — a device root of trust or a code-signing root shipping today may still need to verify signatures in 2040.",
    why: "Signature migration is governed by the lifetime of your trust anchors, not by data confidentiality. Firmware and hardware roots being designed now are already making a thirty-year bet.",
    related: ["post-quantum-cryptography", "ml-kem", "root-of-trust", "crypto-agility", "pki"],
    mode: "motus"
  },
  {
    id: "hybrid-key-exchange",
    term: "Hybrid Key Exchange",
    domain: "Cryptography",
    short: "Combining a classical and a post-quantum key exchange so the session is secure if either one holds.",
    long: "A hybrid group derives the session secret from both a classical exchange such as X25519 and a post-quantum KEM such as ML-KEM-768, concatenated and run through a key derivation function so that breaking one component alone yields nothing. The rationale is straightforward risk management: post-quantum schemes are comparatively young and could have undiscovered classical weaknesses, while classical schemes have a known future weakness. NIST IR 8547 notes that hybrid modes combining an approved post-quantum algorithm with a classical one are not caught by the 2035 disallowance, which is what makes them the sane migration path rather than a compromise. The costs are larger handshakes and more code paths, and the hazard is a downgrade: if a peer can negotiate away from hybrid, an active attacker will make it.",
    why: "It is the deployment shape the post-quantum transition is actually taking, and negotiation downgrade is the implementation flaw that will quietly undo it.",
    related: ["ml-kem", "post-quantum-cryptography", "forward-secrecy", "harvest-now-decrypt-later", "crypto-agility"],
    mode: "motus"
  },
  {
    id: "harvest-now-decrypt-later",
    term: "Harvest Now, Decrypt Later",
    domain: "Threat",
    short: "Recording encrypted traffic today to decrypt it once a cryptographically relevant quantum computer exists.",
    long: "The attack requires no new capability — bulk capture and storage are cheap and well within the means of state actors — and it inverts the usual assumption that today's encryption only needs to hold today. Its relevance to a given dataset is decided by Mosca's inequality: if the time your data must stay secret plus the time your migration takes exceeds the time until a capable quantum computer exists, you are already late. That makes the calculation concrete and unsentimental. Genomic data, intelligence material, long-term contracts, and identity documents have secrecy lifetimes measured in decades; session cookies and ephemeral telemetry do not. Note it applies only to confidentiality, which is why key establishment migrates before signatures.",
    why: "It converts a speculative future threat into a present-tense prioritisation exercise you can defend with arithmetic rather than with fear.",
    related: ["post-quantum-cryptography", "hybrid-key-exchange", "forward-secrecy", "crypto-shredding", "ml-kem"],
    mode: "both"
  },
  {
    id: "crypto-agility",
    term: "Crypto-Agility",
    domain: "Cryptography",
    short: "The engineered ability to change cryptographic algorithms, parameters, or keys without redesigning the system.",
    long: "Agility is an architectural property, not a library feature: algorithm identifiers carried in protocol and stored data, negotiation with a policy-driven preference order and a floor that rejects downgrade, key and algorithm metadata stored beside every ciphertext so old data remains readable during migration, and a discoverable inventory of where cryptography is used at all. Systems that lack it fail in a characteristic way — the algorithm is implicit in the data format, so migration requires re-encrypting everything under a scheme nobody can enumerate. The counterweight is that negotiation itself creates attack surface, as the history of downgrade attacks from FREAK to Logjam shows, so agility must come with a hard minimum rather than unlimited flexibility.",
    why: "It is the difference between the post-quantum transition being a configuration change and being a multi-year rewrite. It is also the last chance to build it in before the deadline forces it.",
    related: ["post-quantum-cryptography", "hybrid-key-exchange", "key-rotation", "ml-dsa", "sbom"],
    mode: "motus"
  },
  {
    id: "certificate-transparency",
    term: "Certificate Transparency",
    domain: "PKI",
    short: "Public append-only logs of issued certificates, making misissuance detectable rather than merely prohibited.",
    long: "CT logs are append-only ledgers built on Merkle trees, so inclusion and consistency can be proven cryptographically and tampering is detectable. When a CA submits a precertificate, the log returns a signed certificate timestamp, a promise to include the entry within the maximum merge delay, typically 24 hours; the CA embeds those SCTs in the issued certificate. Browsers enforce policy by requiring multiple SCTs from independent logs before accepting a certificate, so no single log operator can validate issuance alone. Monitors watch the logs continuously for certificates naming domains they care about — which is the part organisations underuse, since CT gives you free, near-real-time detection of anyone obtaining a certificate for your names, including your own teams provisioning shadow infrastructure.",
    why: "It is the rare security control that made an entire trust system auditable by outsiders, and it hands you a free external view of your own domain estate if you bother to watch it.",
    related: ["pki", "provenance", "root-of-trust", "attack-surface", "detection-engineering"],
    mode: "both"
  },
  {
    id: "pki",
    term: "PKI",
    domain: "PKI",
    short: "The set of roles, policies, and systems that bind public keys to identities through certificates.",
    long: "A public key infrastructure has a root of trust, intermediate issuing authorities, a certificate policy describing what a certificate means, validation of subject identity before issuance, and revocation machinery. Its two chronic weaknesses are that trust is only as good as the weakest authority a relying party trusts — historically the reason a single compromised CA endangered the whole web — and that revocation has never worked well at internet scale, which is why the industry moved toward short certificate lifetimes so expiry does the work revocation could not. Internal PKI has its own recurring failure: an offline root generated once by someone who has left, with no documented recovery, quietly approaching an expiry that will take out authentication estate-wide.",
    why: "Certificate expiry causes more outages than certificate compromise causes breaches, and both trace back to a PKI nobody owns. Find the owner, or become it.",
    related: ["certificate-transparency", "root-of-trust", "mtls", "key-ceremony", "ml-dsa"],
    mode: "both"
  },
  {
    id: "root-of-trust",
    term: "Root of Trust",
    domain: "Assurance",
    short: "The component whose integrity is assumed rather than verified, because every other verification depends on it.",
    long: "Every chain of trust terminates somewhere: an immutable boot ROM holding a verification key, a CA root certificate in a trust store, a signing key in an HSM, a hardware attestation key. Because the root is assumed rather than checked, its compromise is unrecoverable by any mechanism inside the system, and its protection therefore justifies expense that would be absurd elsewhere — offline storage, split control, ceremonies, physical security. Two questions separate serious designs from decorative ones: how would we detect compromise of the root, given that nothing above it can be trusted to tell us, and how would we replace it in a deployed fleet. Devices whose root of trust cannot be updated are making a bet on the lifetime of an algorithm.",
    why: "It is the one asset where recovery is not a plan you can write later. Knowing exactly where your roots are, and who could reach them, is a foundational inventory most organisations lack.",
    related: ["hsm", "key-ceremony", "pki", "tpm", "crown-jewels"],
    mode: "both"
  },
  {
    id: "tpm",
    term: "TPM",
    domain: "Hardware Security",
    short: "A hardware module that stores keys, measures boot state, and can attest to a platform's configuration.",
    long: "A Trusted Platform Module generates and holds keys that cannot be exported, extends measurements of firmware and boot components into platform configuration registers, and can produce a signed quote of those registers for remote attestation. Two capabilities follow that matter well beyond disk encryption: sealing, where data can only be unsealed if the platform measurements match the expected state, and device binding, which underpins device-bound session credentials, hardware-backed passkeys, and device-identity checks in conditional access. Practical caveats are worth carrying — measurements change legitimately on firmware updates, breaking sealed data unless recovery is planned, and discrete TPMs communicate over a bus that has been subject to sniffing attacks, which is part of why firmware-based and integrated implementations gained ground.",
    why: "It is the hardware anchor that makes device identity and non-exportable keys real on ordinary endpoints, which is what several of the strongest modern identity controls stand on.",
    related: ["root-of-trust", "device-bound-session-credentials", "passkey", "hsm", "workload-identity"],
    mode: "both"
  },
  {
    id: "threshold-signature",
    term: "Threshold Signature",
    domain: "Cryptography",
    short: "A signing scheme where any t of n parties can jointly produce one signature, and no party ever holds the whole key.",
    long: "Unlike splitting a key and reassembling it, threshold signing never reconstitutes the private key anywhere: the parties run a protocol producing a single valid signature that verifies against one public key, indistinguishable from an ordinary signature to any verifier. That distinguishes it from multisignature schemes at the protocol level, where multiple distinct signatures are visible on-chain, costing more space and revealing the policy. Threshold schemes for ECDSA are considerably more intricate than for Schnorr-style signatures, and several deployed implementations have had serious protocol vulnerabilities, so implementation provenance matters enormously here. NIST has been running a multi-party threshold cryptography project precisely because the demand outran the standards.",
    why: "It gives you separation of duties as a cryptographic guarantee rather than a procedural one, with no moment where a single machine holds the key.",
    related: ["mpc", "shamir-secret-sharing", "separation-of-duties", "hsm", "key-ceremony", "multisig", "distributed-key-generation", "threshold-bft"],
    mode: "motus"
  },
  {
    id: "mpc",
    term: "MPC",
    domain: "Cryptography",
    short: "Secure multi-party computation — jointly computing a function over private inputs without any party revealing its input.",
    long: "MPC generalises the threshold idea: parties compute an agreed function on secret-shared data so that only the output is learned. Real deployments exist beyond key custody — private set intersection for contact discovery and for advertising measurement, joint fraud analytics across institutions that cannot share customer records, private statistics collection. The costs are communication rounds and latency rather than raw computation, so protocol design is dominated by network round trips. Security models matter more than performance claims when evaluating a product: semi-honest security assumes participants follow the protocol while trying to learn, whereas malicious security tolerates active deviation, and the gap between them is where the interesting attacks live.",
    why: "It changes what is architecturally possible — collaboration without data sharing — and it is the correct question to ask whenever a business wants to combine sensitive datasets.",
    related: ["threshold-signature", "shamir-secret-sharing", "separation-of-duties", "crypto-shredding", "trust-boundary"],
    mode: "motus"
  },
  {
    id: "shamir-secret-sharing",
    term: "Shamir Secret Sharing",
    domain: "Cryptography",
    short: "Splitting a secret into n shares such that any k reconstruct it and any k-1 reveal nothing at all.",
    long: "The construction encodes the secret as the constant term of a random polynomial of degree k-1 over a finite field and distributes evaluations at distinct points; k points determine the polynomial uniquely while fewer leave every candidate secret equally likely — information-theoretic security, not computational. It is the standard mechanism for root key custody, disaster recovery envelopes, and split control in key ceremonies. Two limitations must be designed around: reconstruction brings the whole secret into memory on one machine at one moment, which is exactly the exposure threshold signatures avoid, and the plain scheme is not verifiable, so a malicious shareholder can submit a bad share and cause reconstruction to fail silently unless a verifiable variant is used.",
    why: "It is how you make a root key survive a person leaving without letting any person hold it. The reconstruction moment is the residual risk, and it is where the ceremony has to be strongest.",
    related: ["key-ceremony", "threshold-signature", "mpc", "seed-phrase", "separation-of-duties", "threshold-signature-scheme", "hot-warm-cold-custody"],
    mode: "both"
  },
  {
    id: "hd-wallet",
    term: "HD Wallet",
    domain: "Key Management",
    short: "A hierarchical deterministic wallet deriving an unlimited tree of keys from a single seed, per BIP-32 and its successors.",
    long: "From one master seed, BIP-32 derives child keys along a path, with BIP-44 standardising the path structure for purpose, coin type, account, change, and index. Extended public keys allow a watch-only system to derive receiving addresses without any signing capability, which is genuinely useful for accounting and monitoring separation. Two hazards deserve emphasis: a non-hardened derivation path leaks the master private key if an extended public key and any single child private key are both exposed, which is why hardened derivation is used for account-level nodes; and the entire tree collapses to the seed, so seed compromise is total and irreversible compromise of every key ever derived or derivable.",
    why: "It concentrates unlimited key material into one backup artefact, which is both its convenience and the reason its custody is the whole security problem.",
    related: ["seed-phrase", "key-derivation-function", "shamir-secret-sharing", "root-of-trust", "blast-radius"],
    mode: "motus"
  },
  {
    id: "key-derivation-function",
    term: "Key Derivation Function",
    domain: "Cryptography",
    short: "A function that turns a secret input into one or more cryptographically strong keys, sometimes deliberately slowly.",
    long: "Two distinct families get conflated. Extract-and-expand KDFs such as HKDF take an already-high-entropy input — a Diffie-Hellman shared secret, for example — and derive multiple context-separated keys quickly, where the info parameter provides domain separation so the same secret yields different keys for different purposes. Password-based KDFs such as Argon2id, scrypt, and PBKDF2 take low-entropy human input and are deliberately expensive, with Argon2id additionally memory-hard to blunt the GPU and ASIC advantage that makes iteration-only functions cheap to attack at scale. Using the wrong family is a classic and quiet failure: HKDF on a password offers no attack cost, and a slow password KDF in a hot path is a self-inflicted denial of service.",
    why: "Domain separation and cost parameters are the two knobs that decide whether a compromised database is a nuisance or a catastrophe, and both are chosen once and rarely revisited.",
    related: ["aead", "seed-phrase", "hybrid-key-exchange", "csprng", "constant-time"],
    mode: "both"
  },
  {
    id: "constant-time",
    term: "Constant-Time Implementation",
    domain: "Cryptography",
    short: "Code whose execution time and memory access pattern do not depend on secret data.",
    long: "If a comparison exits early on the first mismatched byte, an attacker measures response time to recover a MAC or token byte by byte; if a table lookup index depends on a key, cache timing leaks it. Constant-time code therefore avoids secret-dependent branches, secret-dependent memory indices, and secret-dependent division, using arithmetic masking instead — which is why implementations look strange and must never be tidied up by a well-meaning reviewer or an optimising compiler. The correct posture for almost every engineer is not to write it, but to recognise where it is required and to use a vetted library, plus the one rule everyone can apply: always compare secrets with a constant-time equality function rather than the language's default.",
    why: "It is the reason cryptographic code cannot be reviewed by ordinary code-quality standards, and the naive comparison of a token or MAC is the version of this bug that appears in normal application code.",
    related: ["side-channel", "aead", "key-derivation-function", "csprng", "hsm"],
    mode: "motus"
  },
  {
    id: "side-channel",
    term: "Side Channel",
    domain: "Cryptography",
    short: "Leakage of secrets through a system's physical or behavioural properties rather than through its intended interface.",
    long: "Channels include timing, cache access patterns, power consumption, electromagnetic emission, acoustic emission, and speculative execution artefacts of the Spectre and Meltdown family. What unites them is that the mathematics remains sound while the implementation leaks, so an algorithm proven secure on paper is broken in the specific box it runs in. Shared infrastructure raises the stakes because co-tenancy on a physical host gives an adversary the measurement position that used to require physical access. Defences are layered: constant-time implementations, blinding to randomise the relationship between secret and observable, hardware isolation, and — the strategic version — deciding which workloads simply should not share silicon with untrusted code.",
    why: "It is where the assumption that correct cryptography means secure cryptography breaks. Multi-tenant infrastructure means you inherit this risk whether or not you handle keys yourself.",
    related: ["constant-time", "hsm", "tpm", "csprng", "trust-boundary"],
    mode: "motus"
  },
  {
    id: "csprng",
    term: "CSPRNG",
    domain: "Cryptography",
    short: "A cryptographically secure pseudorandom generator — unpredictable output, forward and backward, from a well-seeded state.",
    long: "The requirement is that an observer of past output cannot predict future output, and an observer who compromises the state cannot recover past output. In practice this means using the operating system's interface — getrandom, urandom, the platform's secure random API — rather than a language's default generator, which is almost always a fast statistical PRNG with a predictable state. The recurring real-world failures are seeding failures rather than algorithmic ones: embedded devices generating keys at first boot before entropy is available, virtual machines cloned from a snapshot with identical state, and containers inheriting a parent's generator. These are how large-scale duplicate-key surveys keep finding thousands of devices sharing keys, and how a signature nonce collapse has repeatedly leaked ECDSA private keys.",
    why: "Every key, nonce, salt, and session identifier you own rests on this. It is the lowest layer of the stack and the one where a silent failure is invisible until the keys are already public.",
    related: ["nonce-reuse", "key-derivation-function", "seed-phrase", "constant-time", "hd-wallet"],
    mode: "both"
  },

  /* ---------------- THE WORDS THE MAP USES ---------------- */
  {
    id: "system-delay",
    term: "System Delay",
    domain: "Systems",
    short: "The time between a cause and its effect in a system. Delays make people act on what they can see while the real state is already moving.",
    long: "Every dependency carries one. When a controller fails, the booster station it commands runs on for a while on its own momentum; when a directory fails, the services that check it fail within seconds. The length of the delay decides how a failure arrives: a short one makes the system fall as one piece, a long one gives the people in it time to act, and a delay in the information about the failure is the one that hurts most, because decisions get made on a picture that is already old. Meadows listed delays in feedback loops among the most common causes of overshoot and oscillation, and shortening the delay in an information flow as a higher point of leverage than changing any parameter in the system.",
    why: "In a gauge every pipe carries its delay in bars: one for minutes, two for an hour, three for hours. Containment buys time in exactly those units, and detection shortens the delay that matters most, the one before anyone knows.",
    related: ["feedback-loop", "stock-and-flow", "containment", "cascade-failure", "dwell-time"],
    mode: "both"
  },
  {
    id: "cascade-failure",
    term: "Cascade Failure",
    domain: "Systems",
    short: "A failure that travels: one part falls, and every part that depends on it loses what it needs, after its delay, and falls too.",
    long: "The 2003 Northeast blackout began with sagging lines touching trees in Ohio and an alarm system that had silently stopped working, so operators did not see the first lines trip. Within hours the failures had crossed into Michigan, Ontario and New York, and fifty million people lost power. Nothing about any one part was unusual; the structure carried the failure. The same shape runs through a water utility whose boosters answer to one control room, a cooperative whose substations switch from one set of servers, and a dispatch centre whose radios depend on one network. The map shows the path a cascade would take before it happens, and that is the whole point of drawing it.",
    why: "Containment is read on the map, not claimed in a policy. A breaker on a dependency stops the cascade there, and the score pays for every part it saves.",
    related: ["containment", "blast-radius", "tight-coupling", "system-delay"],
    mode: "both"
  },
  {
    id: "tight-coupling",
    term: "Tight Coupling",
    domain: "Systems",
    short: "Parts that depend on each other with no slack between them, so a failure in one has nowhere to stop.",
    long: "Perrow drew the line in Normal Accidents: a tightly coupled system has time dependent processes, sequences that cannot be reordered, little slack, and one way to reach its goal. Add interactive complexity, parts that affect each other in ways nobody designed, and accidents stop being surprising. The remedy is not more alarms on the same structure. It is slack built on purpose: cells that fail alone, a station that can run by hand when its controller cannot be trusted, a budget for how far any one failure is allowed to reach. Each of those loosens a coupling, and each one shows on a map as a breaker on a dependency.",
    why: "Cell architecture, blast radius budgets and fail safe defaults are loose coupling bought with budget. When the catalog ceiling says no stack can hold a notch, the coupling is usually what has to change.",
    related: ["cascade-failure", "blast-radius", "containment", "leverage-point"],
    mode: "both"
  },
  {
    id: "breaker",
    term: "Breaker",
    domain: "Systems",
    short: "A structure that stops a failure crossing a dependency, so the part downstream keeps its function when the part it depends on falls.",
    long: "The word comes from the electrical breaker that opens a circuit before the fault spreads, and the structure behind it is the same in every domain: a boundary that holds when what is on the other side does not. Fail safe defaults decide what a booster does when its controller cannot be trusted, so the water keeps flowing by hand. Cell architecture keeps one cell's failure from reaching the next. A blast radius budget writes down how far any failure is allowed to reach and builds the walls to hold it there. Segmentation keeps a stolen login on the office network from reaching the control network. None of these stop the first failure; they decide where it ends.",
    why: "On a gauge's map a breaker is a valve wheel on a pipe. The leverage list ranks them by the hours of service they keep, and the cheap ones near the public are usually the move with the most leverage you have.",
    related: ["containment", "cascade-failure", "tight-coupling", "blast-radius"],
    mode: "both"
  }
];
