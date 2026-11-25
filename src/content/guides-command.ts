import type { Guide } from "./schema";

/* StepGUIDES :: Command, Risk & Leadership.
   The reference shelf a working security leader actually reaches for.
   Instruments, not summaries. Every one of these is meant to be printed and used. */

export const GUIDES: Guide[] = [
  {
    id: "sg-incident-command-first-60",
    title: "Incident Command: The First 60 Minutes",
    domain: "Incident Command",
    kind: "playbook",
    statement: "The first hour decides whether you run the incident or the incident runs you.",
    summary: "A minute-by-minute command procedure for the opening hour of a confirmed security incident: when to declare, who holds what, what must be said out loud, and what has to be written down before minute sixty.",
    minutes: 22,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Command before analysis",
        body: "In the first hour the binding constraint is almost never technical skill. It is that six competent engineers are all touching the same host, three executives are asking the same question through three channels, and nobody has written down what is actually known versus assumed. Google's SRE practice names the fix: recursive separation of responsibilities. The incident commander holds every role they have not explicitly delegated, and delegates by name, out loud, with acknowledgement. Adopt only that and you have removed the dominant failure mode of hour one. Everything else in this playbook is scaffolding around it."
      },
      {
        kind: "numbered",
        title: "The declaration ladder — declare early, downgrade cheaply",
        items: [
          "Does resolving this require a second team? If yes, declare. Cross-team coordination without a named commander is the most reliable way to lose an hour.",
          "Is it visible to customers, partners, or the public? If yes, declare — because the communications clock has already started whether you acknowledge it or not.",
          "Has an hour of concentrated analysis failed to explain it? If yes, declare. Unexplained is a severity input, not a reason to wait.",
          "Security-specific trigger: is there any evidence of an interactive human adversary — hands-on-keyboard, credential use from unfamiliar infrastructure, defence evasion? Declare immediately and skip the ladder. Automated malware tolerates deliberation; a live operator does not.",
          "Security-specific trigger: has any identity system, backup system, or code-signing/build system been touched? These are the three that turn a contained incident into an existential one. Declare at the highest severity you can defend and lower it later.",
          "Downgrading is free. Announce it as a decision, in the channel, with a reason. The cost of a false declaration is one hour of eight people's attention. The cost of a late declaration is measured in days of dwell time."
        ]
      },
      {
        kind: "timeline",
        title: "T+0 to T+60 — the actual sequence",
        items: [
          "T+00 — Declare. Say the words: this is now a declared incident, severity provisional, I am incident commander. Start the clock and record the wall time in UTC.",
          "T+02 — Open the single channel and the single document. One bridge, one written record. Every parallel thread you allow now is a contradiction you will have to reconcile in front of an executive at T+180.",
          "T+05 — Delegate by name: operations lead, communications lead, scribe. Get verbal acknowledgement from each. Unacknowledged delegation is not delegation.",
          "T+08 — Freeze the change surface. No one modifies the system except the operations lead's team. State this explicitly; well-meaning side fixes destroy both evidence and your ability to attribute cause to effect.",
          "T+10 — Establish the known/assumed/unknown split in the document. Three headings. Most bad hours come from an assumption that got promoted to fact without anyone noticing the promotion.",
          "T+15 — Preserve before you remediate. Memory, volatile logs, cloud audit trails at risk of rolling over, disk images of the first two hosts. If you reimage before you image, you have destroyed the only copy of the answer.",
          "T+20 — Set severity properly and name the business impact in one sentence a non-engineer would repeat correctly. If you cannot write that sentence, you do not yet understand the incident.",
          "T+25 — Notify legal counsel. Not for permission — for privilege, for the regulatory clock, and so that counsel is inside the room rather than reconstructing it later. This is the step most technical leaders skip and most regret.",
          "T+30 — First formal stakeholder update, on a stated cadence. Say what is known, what is being done, what you will know by when, and the time of the next update. Then honour that time even if nothing has changed.",
          "T+40 — Containment decision with the operations lead. Name the tradeoff aloud: containment destroys visibility and tips off the adversary; waiting extends dwell. Choose, record the reasoning, and record who agreed.",
          "T+50 — Plan the handoff. Incidents outlive the adrenaline. Name your relief, name the time, and schedule the first shift change before anyone is tired enough to need it.",
          "T+60 — Read the document out loud to yourself. If it does not answer what happened, what we know, what we did, and what we decide next, the hour was spent on activity rather than command."
        ]
      },
      {
        kind: "table",
        title: "The role card — print this and hand it out",
        headers: ["Role", "Owns", "First act", "Must not do"],
        rows: [
          ["Incident Commander", "Severity, priorities, the decision log, who holds what", "Declare, delegate three roles by name, start the document", "Touch a keyboard on the affected system. The moment you debug, the incident has no commander."],
          ["Operations Lead", "The only hands on the system; sequencing of technical actions", "Freeze the change surface and enumerate who currently has access", "Take direction from anyone outside the command structure, including executives"],
          ["Communications Lead", "All outbound updates: exec, customer, partner, internal", "Publish the update cadence and the next update time", "Improvise content. Every external word goes through counsel once the incident is declared."],
          ["Scribe", "Timestamped record of facts, decisions, and who decided", "Create the known / assumed / unknown headings", "Editorialise. The scribe records; the commander interprets."],
          ["Legal Counsel", "Privilege, regulatory clocks, external counsel and insurer contact", "Confirm privilege posture and start the notification-clock worksheet", "Direct technical containment. Counsel advises on exposure, not on architecture."],
          ["Subject Matter Expert", "Depth on one system, on request", "State what is normal for their system so anomaly means something", "Self-dispatch. SMEs who wander turn a bounded incident into a search party."]
        ]
      },
      {
        kind: "callout",
        title: "Three sentences that must be said out loud before T+10",
        body: "One: I am incident commander — said by a named human, not implied by seniority. Two: the only people making changes to the affected system are on the operations lead's team — said so that helpful bystanders stop helping. Three: here is what we know, here is what we are assuming, here is what we do not know — said so that the assumption layer is visible and revisable. These three sentences cost twenty seconds and buy back the hour that most organisations lose to ambiguity."
      },
      {
        kind: "compare",
        title: "The commander who is commanding vs the commander who has quietly become an engineer",
        left: {
          title: "Commanding",
          items: [
            "Can state, without checking, who currently holds each of the five roles",
            "Speaks in decisions and deadlines: we will decide containment at 14:20 with or without more data",
            "Keeps the known/assumed/unknown split honest and demotes facts back to assumptions when challenged",
            "Has already named their relief and scheduled the handoff",
            "Runs the update cadence on the clock, not on the availability of good news"
          ]
        },
        right: {
          title: "Debugging with a title",
          items: [
            "Is deepest in the most interesting technical thread and cannot summarise the other four",
            "Speaks in hypotheses: it might be the load balancer, or possibly the identity provider",
            "Has no written record because writing felt slower than working",
            "Is on hour nine, is the only person with full context, and cannot be relieved",
            "Updates stakeholders when there is something to say, which means silence during the worst stretch"
          ]
        }
      },
      {
        kind: "checklist",
        title: "Before you leave the first hour",
        items: [
          "Wall-clock declaration time recorded in UTC, alongside first-detection time and first-evidence time — these three are different and regulators will ask for all three",
          "One channel, one document, both linked from the calendar invite so latecomers do not restart the discussion",
          "Five roles named and acknowledged; the commander is not one of the people typing",
          "Change freeze announced and the current privileged-access list enumerated",
          "Volatile evidence preserved before any reimage, rotation, or block",
          "Business impact written in one sentence a board member could repeat accurately",
          "Counsel engaged and the notification-clock worksheet opened",
          "Update cadence published with a specific next-update time",
          "Relief commander named and handoff time on the calendar",
          "One sentence recorded on why this severity and not the one above it — this is the sentence you will be asked to defend"
        ]
      },
      {
        kind: "quote",
        body: "the only group modifying the system during an incident",
        source: "Google SRE Book, Managing Incidents — on the operations team's exclusive write access"
      },
      {
        kind: "prose",
        title: "The second-order effect nobody warns you about",
        body: "Good hour-one command has a delayed cost: it produces a written record that is discoverable, quotable, and unforgiving. A precise decision log will be read later by counsel, by a regulator, by a plaintiff's expert, and by your own successor. Do not respond to that by writing less — respond by writing better. Record decisions and the reasoning available at the time, not speculation about blame or breezy characterisations of severity. The phrase we assessed X based on Y at time Z is defensible forever. The phrase this looks like the usual nonsense is a deposition exhibit. Mandiant's 2025 M-Trends put global median dwell time at eleven days, and found intrusions discovered by external parties ran to a twenty-six day median against ten days for internal discovery — meaning the difference between good and bad detection is roughly two weeks of adversary freedom. Hour-one discipline does not shorten dwell time by itself, but it is the only thing that keeps the next fifteen days from being spent re-litigating what happened in the first sixty minutes."
      }
    ],
    sources: [
      { label: "Google SRE Book — Managing Incidents (sre.google/sre-book/managing-incidents)", note: "The origin of recursive separation of responsibilities and the four-role structure. Also the cleanest declaration criteria in print: second team needed, customer-visible, unsolved after an hour. Read the handoff paragraph twice." },
      { label: "PagerDuty Incident Response documentation (response.pagerduty.com)", note: "Open-sourced from a company that runs incidents for a living. The severity ladder is explicit about which severities page a commander, and it states the tie-break rule: if unsure which level, treat it as the higher one." },
      { label: "NIST SP 800-61r3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management (April 2025)", note: "Rev 3 is a structural break from Rev 2: incident response is reframed as continuous risk management mapped to CSF 2.0, with Govern/Identify/Protect as preparation and Detect/Respond/Recover as response. Use it to argue that IR budget is not event budget." },
      { label: "Cloudflare, Cloudflare outage on November 18 2025 (blog.cloudflare.com)", note: "A public incident where the responders initially believed they were under a hyper-scale DDoS, partly because their own status page failed simultaneously. The best available lesson in how confidently wrong hour one can be." },
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "Global median dwell time of 11 days; 26 days when an external party notifies you versus 10 when you find it yourself. The gap is the value of detection, denominated in adversary days." },
      { label: "FEMA, Incident Command System ICS-100 and ICS-300 course material", note: "Where the whole discipline comes from. Worth reading in the original to see how much of modern tech incident response is a re-derivation of wildfire command, and which parts were dropped for the worse — notably formal span of control." }
    ]
  },

  {
    id: "sg-ransomware-decision",
    title: "The Ransomware Decision Playbook",
    domain: "Incident Command",
    kind: "playbook",
    statement: "The pay-or-not question is downstream of six other decisions, and you will get it wrong if you take it first.",
    summary: "How to run a ransomware incident as a sequence of separable decisions — containment, recovery viability, extortion posture, sanctions exposure, notification, and negotiation — instead of one panicked binary about money.",
    minutes: 34,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why the pay question is a trap when asked first",
        body: "Within ninety minutes of a ransomware detonation, someone with a large title will ask whether you are going to pay. If you answer that question at ninety minutes you are answering it with almost no information: you do not yet know your restore time, you do not know whether data was exfiltrated, you do not know whether the actor is sanctioned, and you do not know whether the decryptor even works for your file volume. The correct answer at ninety minutes is a process answer: we will have a defensible recommendation at hour thirty-six, here are the five workstreams running in parallel to get there, and here is what would move the recommendation. Verizon's 2026 DBIR reports that 48 percent of breaches now involve ransomware while payouts shrink — the strategic centre of gravity has moved from whether to pay toward how fast you can decline to. Your job in the incident is to make declining survivable."
      },
      {
        kind: "numbered",
        title: "The decision sequence — run these in this order, in parallel where marked",
        items: [
          "Decision 1 — Contain the propagation vector, not the malware. Ransomware is the payload; the access is the incident. Kill the credential path, the management plane, or the remote access route first. Organisations that mass-reimage endpoints while the operator still holds domain admin get encrypted twice.",
          "Decision 2 — Protect the backups, immediately and physically. Modern operators target backup infrastructure before detonation as standard tradecraft. Verify offline or immutable copies exist, verify their integrity, and verify that the restore credentials are not in the compromised identity domain. Do this in the first hour; it determines every subsequent decision.",
          "Decision 3 — Establish recovery viability with a number, not an adjective. The question is not can we restore, it is how many business days to restore the top five revenue-bearing systems from the last clean point, assuming the restore runs at observed throughput and not vendor throughput. Test-restore one representative system before you commit to a number.",
          "Decision 4 (parallel) — Determine exfiltration independently of the encryption. Egress volume, staging archives, cloud storage tool artefacts, and the actor's own claims. The extortion leverage is almost never the encryption any more; it is the data. An organisation with perfect backups can still be facing a full disclosure decision.",
          "Decision 5 (parallel) — Sanctions and legal exposure. Identify the actor and check exposure before any payment conversation begins. OFAC has been explicit that facilitating a payment to a sanctioned entity carries strict-liability civil exposure regardless of intent, and that applies to your incident response firm, your insurer, and your broker as well as to you.",
          "Decision 6 (parallel) — Start the notification clocks from the awareness moment, not from the decision moment. See the notification-clock checklist. The extortion negotiation does not pause GDPR Article 33, NIS2 Article 23, DORA, or an SEC materiality determination.",
          "Decision 7 — Only now: extortion posture. Not pay or do not pay — posture. Are you opening a channel to gather intelligence, to stall, to obtain proof of exfiltration, or to transact? These are four different postures with four different authorisation levels. Conflating them is how organisations discover they have made an offer they did not intend to make."
        ]
      },
      {
        kind: "table",
        title: "Inputs to the recommendation — score each honestly",
        headers: ["Input", "Argues toward declining", "Argues toward transacting", "How to get the real answer"],
        rows: [
          ["Restore viability", "Tested restore of a representative system completed within tolerance", "Backups encrypted, deleted, or last clean copy predates the intrusion", "Actually restore one system to isolated infrastructure and time it. Never accept an RTO from a runbook."],
          ["Exfiltration certainty", "No evidence of staging or egress after full log review", "Actor provides file-level proof matching your crown-jewel inventory", "Demand a file tree and validate specific low-circulation files. Actors bluff with public data more often than teams expect."],
          ["Sanctions posture", "Actor attributed to a designated entity or unattributable", "Actor clearly outside designation and counsel has documented the check", "Written determination from counsel and your IR firm, retained in the file. This document protects the company later."],
          ["Decryptor quality", "Known-poor decryptor for this family, or petabyte-scale file counts", "Known-functional tooling and a manageable file population", "Public reporting on the family plus your IR firm's direct experience. Some decryptors take longer than restoring."],
          ["Regulatory posture", "Sector where payment invites supervisory or state-law consequence", "Neutral", "Counsel maps every jurisdiction you touch, including any explicit prohibitions on payment for public-sector entities."],
          ["Contractual exposure", "Customer contracts have no data-disclosure-triggered penalty", "Contracts carry step-in or termination rights on confirmed disclosure", "Commercial team pulls the top twenty contracts by revenue within four hours. This is usually the surprise."],
          ["Insurer position", "Neutral or supportive of restore", "Policy conditions on notification or panel-firm use are at risk", "Read the actual policy, not the broker summary, in the first six hours."]
        ]
      },
      {
        kind: "callout",
        title: "The sanctions trap, stated plainly",
        body: "US sanctions liability for facilitating a ransom payment is strict liability under the International Emergency Economic Powers Act as applied by OFAC — a person can be civilly liable even without knowing they were dealing with a sanctioned party. The practical consequence for you is procedural, not moral: no payment discussion proceeds without a documented attribution attempt, a documented sanctions check by counsel, and a documented decision about law-enforcement engagement. OFAC's public advisory identifies timely, self-initiated reporting to law enforcement and full cooperation as significant mitigating factors. That means calling the FBI or your national CSIRT early is not merely civic — it is a documented mitigation you will want in the file. Build the check into the playbook now, because you will not run a novel legal process well at hour twenty."
      },
      {
        kind: "compare",
        title: "Arguments you will actually hear in the room",
        left: {
          title: "For transacting — and what each is really saying",
          items: [
            "We cannot restore in time — usually true only for a subset of systems; ask which five and demand tested numbers",
            "It is cheaper than downtime — a claim about a distribution, so make it a distribution: expected downtime cost with and without a working decryptor",
            "The data will be published — often true and often unaffected by payment, since possession is not destroyed by promise",
            "Our insurer will fund it — a funding argument, not a decision argument; the insurer does not carry the reputational or regulatory consequence",
            "Our customers will forgive payment more than outage — testable against your actual contracts and your actual customers, not against intuition"
          ]
        },
        right: {
          title: "For declining — and the load each carries",
          items: [
            "Payment funds the next campaign against someone else — true, structurally correct, and rarely decisive alone in a board room",
            "Payment does not guarantee deletion, and re-extortion by the same or an affiliated actor is a documented pattern",
            "Decryptors frequently underperform, and at very high file counts the restore may be faster anyway",
            "Payment creates a permanent disclosure artefact — regulators, auditors, insurers, and acquirers will all eventually see it",
            "Declining once, publicly and survivably, changes your target profile more than any control you can buy this quarter"
          ]
        }
      },
      {
        kind: "checklist",
        title: "Gate checklist — nothing crosses this line without all boxes ticked",
        items: [
          "Named executive decision-maker with written authority, and a named alternate for the hours they are asleep",
            "Counsel-documented sanctions determination retained in the incident file",
          "Law enforcement engagement decision made and recorded, with reasons either way",
          "Board or audit committee informed under the governance threshold you agreed before the incident, not the one you invent during it",
          "Insurer notified in accordance with the actual policy wording, including any panel-firm conditions",
          "Independent recovery track fully funded and running regardless of the extortion track — never let a negotiation become the recovery plan",
          "Proof-of-life and proof-of-exfiltration validated against files only you could know about",
          "A written statement of what you believe payment buys, and what it explicitly does not buy",
          "Communications drafted for both outcomes before either is chosen, so the decision is not shaped by which statement is easier to write",
          "A defined walk-away condition, written down before the negotiation opens"
        ]
      },
      {
        kind: "metric",
        title: "Numbers worth carrying into the room",
        items: [
          "48 percent of breaches now involve ransomware, per the 2026 Verizon DBIR — with the same report noting payouts are shrinking, which is what a market losing its pricing power looks like.",
          "31 percent of breaches now begin with exploitation of a software vulnerability, overtaking stolen credentials as the top initial access route (2026 DBIR). Your patch SLA is a ransomware control.",
          "Median dwell time of 11 days globally, dropping to 5 days when the adversary notifies you — which in practice means the ransom note (M-Trends 2025). The note is a detection failure with a countdown attached.",
          "Exploits at 33 percent and stolen credentials at 16 percent as initial infection vectors in M-Trends 2025. Between them they explain half of everything, and both are prevention problems with known answers."
        ]
      },
      {
        kind: "prose",
        title: "The part that decides the outcome, and it happens before the incident",
        body: "Every ransomware incident is scored against work you did or failed to do months earlier. Three things dominate: whether backups are genuinely out of the blast radius of your identity system, whether you have ever timed a real restore of a revenue-bearing system, and whether the authority to decide is written down. The third is the cheapest and the most commonly missing. Write, this quarter, a one-page instrument that names who authorises a payment, what threshold triggers board involvement, which law enforcement contact is called and by whom, and what the standing posture is. Have the board note it. Then, when the day comes, the argument in the room is about facts rather than about who gets to decide — and you will find that most of the panic in a ransomware incident is not fear of the adversary but fear of unallocated authority."
      }
    ],
    sources: [
      { label: "CISA, FBI, NSA, MS-ISAC — #StopRansomware Guide", note: "The joint operational baseline. The value is the response checklist appendix: isolate, take a system image, consult, report, and only then consider restoration paths. Also the clearest official statement that paying does not guarantee recovery." },
      { label: "US Treasury OFAC — Updated Advisory on Potential Sanctions Risks for Facilitating Ransomware Payments", note: "The strict-liability point and the mitigating-factor list. Read this before you need it; the mitigation credit is largely earned in the first hours by reporting, not in the negotiation." },
      { label: "Verizon, 2026 Data Breach Investigations Report", note: "48 percent ransomware involvement and 31 percent of breaches beginning with software vulnerability exploitation, the latter now ahead of stolen credentials. Use it to move budget from response to patch velocity." },
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "Exploits at 33 percent and stolen credentials at 16 percent of initial infection vectors; adversary-notified intrusions at a 5-day median dwell. Good for showing a board what the ransom note actually indicates about your detection." },
      { label: "Coveware quarterly ransomware reports", note: "The longest-running public series on payment rates, negotiation outcomes, and actor behaviour drawn from real cases. Read for the trend line and the actor-by-actor behaviour notes rather than for any single quarter's headline figure." },
      { label: "NIST SP 800-61r3 (April 2025)", note: "Section framing that puts recovery capability under Protect and Recover rather than treating it as an incident-time concern. Useful when arguing that immutable backup spend is a ransomware decision made in advance." }
    ]
  },

  {
    id: "sg-third-party-breach-response",
    title: "When the Breach Is Your Vendor's",
    domain: "Incident Command",
    kind: "playbook",
    statement: "You will own the consequence of an incident you cannot investigate, in a system you cannot image, run by a company that owes you a status page.",
    summary: "A response procedure for the incident class you are structurally worst-equipped for: a compromise at a supplier, SaaS provider, or managed service that reaches your data or your customers.",
    minutes: 24,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "The asymmetry",
        body: "In your own incident you control the evidence, the timeline, and the narrative. In a supplier incident you control none of them and retain all of the accountability. Your customers will not accept our vendor was breached as an answer, your regulators will treat you as the controller of the data, and your board will ask why you accepted the risk. Meanwhile the only information channel is a vendor status page written by someone whose job is to reduce their liability, not to inform your decision. The 2026 Verizon DBIR finds that 31 percent of breaches now start with software vulnerability exploitation — a category dominated by edge devices and platform software you did not write and often cannot patch on your own schedule. This is not an edge case any more. It is a primary operating mode."
      },
      {
        kind: "numbered",
        title: "Hour one to day three",
        items: [
          "Declare an incident on your side. Not a monitoring task — a declared incident with a commander. Organisations that treat supplier breaches as vendor-management matters consistently discover their own exposure late.",
          "Establish scope from your own telemetry first, before you ask the vendor anything. What data did you send them, what access did they hold into your environment, what identities of yours exist in their system, and what did their integration touch in the last ninety days. You will have this faster than they will answer.",
          "Cut the standing access immediately and decide about the data flow separately. Vendor integrations almost always hold credentials into you. Revoking the inbound path is reversible and cheap; halting the business process is neither. Do not bundle these two decisions.",
          "Open a single named channel to the vendor with a named counterpart. Status pages are not a channel. If your contract has a security-incident clause, cite it in writing in your first message — this both invokes your rights and creates the record that you invoked them.",
          "Start your own notification clocks. Your obligations under GDPR, NIS2, DORA, SEC, or sector rules run from your awareness, and awareness of a processor's breach is awareness. GDPR Article 33(2) requires the processor to tell the controller without undue delay, which is a duty on them and no defence for you.",
          "Ask for the four things that actually matter, in writing, with a deadline: the time window of unauthorised access, the specific data categories and record counts attributable to your tenant, the indicators of compromise, and whether the access included any credential or token that could be replayed against you.",
          "Hunt for the replay. The most damaging phase of a supplier breach is often not the data loss but the lateral use of your tokens, API keys, or federated identities. Assume anything you gave them is now adversary-held and rotate on that assumption.",
          "Decide your customer communication independently of the vendor's timeline. If you wait for the vendor to be comfortable, you will be late by their standard of comfort, not yours."
        ]
      },
      {
        kind: "table",
        title: "The vendor interrogation — questions that produce usable answers",
        headers: ["Question", "Why this wording", "What a bad answer looks like"],
        rows: [
          ["What is the earliest evidence of unauthorised access, and what is the earliest time you cannot rule out access?", "Forces the distinction between confirmed and bounded. The second number drives your notification scope.", "We detected it on the 14th — with no statement about the unbounded prior window."],
          ["Which of my tenant's records were accessed, and what is your confidence basis — logging, or inference?", "Separates evidence from assumption. Many providers cannot log per-tenant object access at all.", "No customer data is believed to be affected, with no description of how belief was formed."],
          ["Did the intrusion reach any credential, token, or key that authenticates to my environment?", "This is the question that determines whether you have a second incident.", "Silence, or a redirect to a general assurance about encryption."],
          ["What indicators can you share now, under what handling restrictions?", "Named handling makes it easy for them to say yes. Ask for TLP-designated indicators.", "We will share indicators once the investigation concludes."],
          ["Who is your retained forensic firm and will their report be made available under NDA?", "Establishes independence and creates the possibility of real evidence rather than a summary.", "Investigation is being handled internally."],
          ["What is your regulatory notification position and to which authorities?", "Their filings become public and will be read against your statements. Alignment matters.", "We are still assessing — beyond a few days into the incident."],
          ["What changes on your side, and by when, and how will I verify them?", "Turns the incident into contract leverage while goodwill is highest.", "A commitment to enhance security posture with no date and no artefact."]
        ]
      },
      {
        kind: "callout",
        title: "The thing to fix before the next one",
        body: "The single control that most reduces supplier-incident damage is not a questionnaire, a certification, or a rating score. It is limiting what the integration can do. An OAuth grant scoped to one mailbox folder, a service account with read on two tables, a webhook that cannot write back, a key that expires in ninety days — these convert a catastrophic supplier breach into a manageable one, and they are engineering decisions rather than procurement decisions. Vendor risk assessments measure the probability of a supplier being breached, which you cannot control. Integration scoping measures your loss magnitude if they are, which you can. Spend your marginal effort on the second."
      },
      {
        kind: "compare",
        title: "Two organisations, same supplier breach",
        left: {
          title: "The one that recovers in a week",
          items: [
            "Has an inventory of what each supplier holds and what each integration can reach, maintained as engineering data rather than a spreadsheet",
            "Rotates every credential shared with the supplier within hours, because rotation is automated and pre-tested",
            "Notifies customers with its own scoped statement, on its own clock, referencing only what it can substantiate",
            "Has contract language granting incident information rights with defined timeframes, and cites it on day one",
            "Runs the internal hunt for replayed tokens in parallel with the vendor conversation"
          ]
        },
        right: {
          title: "The one still explaining itself in month three",
          items: [
            "Learns which data the supplier held by asking the supplier",
            "Cannot rotate the integration credential because nobody knows what will break",
            "Repeats the vendor's language in its customer notice and inherits every inaccuracy in it",
            "Discovers the contract has no security-incident clause, only an annual attestation requirement",
            "Treats the vendor's investigation as its own investigation, and therefore has no independent facts when the regulator asks"
          ]
        }
      },
      {
        kind: "checklist",
        title: "Standing readiness for supplier incidents",
        items: [
          "For your top twenty suppliers by data sensitivity: named security contact, escalation path, and contractual notification window — tested by actually sending a message once a year",
          "Machine-readable inventory of every integration credential, its scope, its owner, and its rotation procedure",
          "Pre-tested credential rotation for the ten highest-impact integrations, with the blast radius of rotation documented",
          "A standing customer-notification template for the case where you are the downstream victim, pre-cleared by counsel",
          "A defined internal threshold at which a supplier incident becomes your declared incident — written down, not improvised",
          "Egress and identity telemetry that lets you answer what did this integration do in the last ninety days without vendor help",
          "Contract clauses granting incident notice within a fixed hour count, forensic report access under NDA, and audit rights that survive the incident",
          "Annual tabletop where the injects come from a vendor who is slow, defensive, and partially wrong — because that is the realistic case"
        ]
      }
    ],
    sources: [
      { label: "Verizon, 2026 Data Breach Investigations Report", note: "31 percent of breaches beginning with software vulnerability exploitation, now the leading initial access route. The DBIR's third-party and supply chain analysis is the best public longitudinal view of this class." },
      { label: "GDPR Article 33(2) and Article 28 (gdpr-info.eu)", note: "The processor must inform the controller without undue delay, and the controller remains accountable. Article 28 is where your contractual leverage should already be — read your own DPAs against it before an incident, not during." },
      { label: "NIST SP 800-161r1, Cybersecurity Supply Chain Risk Management Practices for Systems and Organizations", note: "The formal C-SCRM control set. Skim the control families, then use it to argue for integration-scoping controls rather than more questionnaires." },
      { label: "NIST Cybersecurity Framework 2.0 (February 2024)", note: "GOVERN includes supply chain risk management as a first-class outcome category rather than an appendix. Useful framing when a board asks why supplier risk is a governance topic." },
      { label: "Cloudflare, Code Orange: Fail Small — our resilience plan following recent incidents (December 2025)", note: "A provider publishing its own dependency-failure reasoning: staged configuration rollout, sane defaults at service boundaries, and removal of circular dependencies. Use it as the standard you hold your own suppliers to." },
      { label: "CISA Secure by Design principles", note: "The vocabulary for demanding that the burden of security move to the supplier. Quoting it in a vendor conversation is more effective than quoting your own policy." }
    ]
  },

  {
    id: "sg-tabletop-design",
    title: "Designing a Tabletop That Changes Something",
    domain: "Incident Command",
    kind: "playbook",
    statement: "A tabletop that everyone passes taught nothing; design for the moment the room goes quiet.",
    summary: "How to build, run, and extract value from an exercise: objective selection, inject construction, the facilitator's craft, the failure modes that make exercises theatre, and how to convert findings into funded work.",
    minutes: 30,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Exercises test decisions, not knowledge",
        body: "The commonest design error is building an exercise that asks participants what the policy says. Nobody learns from that, and the executives in the room learn only that they are being examined. A useful exercise puts a small number of humans in front of a decision with insufficient information, a running clock, and a real tradeoff — then observes how they decide, who they ask, and what they cannot find. The deliverable is not a score. It is a list of specific things that were slow, missing, ambiguous, or owned by nobody, each of which is now a funded ticket with a name on it."
      },
      {
        kind: "numbered",
        title: "The design sequence",
        items: [
          "Pick exactly one to three objectives, written as observable behaviours. Not test our IR plan but: determine whether the participants can reach a materiality recommendation within four hours using only the artefacts that actually exist today. Objectives you cannot observe cannot be assessed.",
          "Pick the audience the objective requires and no one else. A regulatory-clock exercise needs counsel, comms, finance, and the disclosure committee — and does not need your detection engineers. A containment-tradeoff exercise needs the reverse. Mixed audiences produce mixed attention.",
          "Choose a scenario that is boring and plausible over exotic and exciting. A compromised administrator credential at a managed service provider will teach you more than a nation-state implant in your firmware, because the first one will happen and the second one will not shape your controls.",
          "Write the master scenario events list backwards from the decision points. Identify the three to five decisions you want to observe, then construct the minimum set of injects required to force each one. Every inject that does not drive toward a decision is padding.",
          "Build in the information you will not give them. Realistic exercises are defined by absence: the vendor does not answer, the logs rolled over, the SME is on a plane. Most exercises fail to teach because the facilitator answers every question asked.",
          "Pre-write the ground truth document — what actually happened in the scenario — and do not share it. Facilitators who improvise the underlying reality produce contradictions that participants will correctly resent.",
          "Decide the exercise type honestly. A discussion-based tabletop tests decision-making and coordination. It does not test whether your EDR isolates a host. If you need the second, you need a technical exercise or a purple team, and you should say so rather than letting a tabletop stand in for it.",
          "Design the debrief before you design the injects. If you cannot say in advance what a finding will look like and who will own it, the exercise has no output path and will produce a slide deck instead of change."
        ]
      },
      {
        kind: "table",
        title: "A working inject schedule — 3 hours, executive audience, ransomware with exfiltration",
        headers: ["Clock", "Inject", "Decision it forces", "What good looks like"],
        rows: [
          ["T+00", "Service desk reports 40 users cannot open files; one plant has stopped", "Declare or investigate; who is commander", "Declaration inside 15 minutes with a named commander and a named comms lead"],
          ["T+20", "EDR shows the same admin account authenticating from three unusual sources over the prior 6 days", "Whether to cut the identity path before understanding it", "Names the tradeoff aloud: containment costs visibility; decides anyway and records why"],
          ["T+35", "Backup team reports the last verified restore test was 14 months ago", "Whether recovery time is a known number or a hope", "Refuses to give leadership an RTO; commits to a tested number by a stated time"],
          ["T+55", "A journalist emails the CEO's public address citing a leak site post", "External communication and the disclosure clock", "Comms lead owns response; counsel engaged; no substantive comment made without a written basis"],
          ["T+80", "Actor posts a file tree containing genuine internal document names", "Exfiltration confirmation and notification scope", "Validates specific low-circulation files rather than accepting the claim or dismissing it"],
          ["T+105", "CFO asks whether this is an 8-K matter and whether the four-day clock has started", "Materiality determination process", "Distinguishes discovery from determination; names the committee and the timeline; does not answer materially or immaterially on the spot"],
          ["T+130", "Cyber insurer requires use of a panel forensic firm; your retained firm is already engaged", "Contractual conflict under pressure", "Someone has actually read the policy; the conflict is escalated rather than absorbed"],
          ["T+150", "Largest customer invokes a contractual right to be notified within 24 hours of a confirmed incident", "Customer notification versus investigation completeness", "Commercial and legal produce a scoped notice that is accurate and short"]
        ]
      },
      {
        kind: "list",
        title: "The smells of an exercise that is theatre",
        items: [
          "Every question asked by a participant receives an answer — reality withholds",
          "The scenario escalates on a schedule regardless of what the room decides, so decisions do not matter",
          "Nobody is uncomfortable at any point, which means no real constraint was applied",
          "The facilitator is the person who wrote the plan being tested, and is therefore defending it",
          "The output is a maturity score rather than a list of named owners and dates",
          "The same scenario as last year, run for the same audience, producing the same findings",
          "The most senior person in the room talks first on every inject, which converts the exercise into an assessment of their preferences",
          "No inject ever contradicts an earlier inject, so the room never has to revise a belief in public"
        ]
      },
      {
        kind: "callout",
        title: "The single highest-value inject you can write",
        body: "Give the room a fact at T+60 that contradicts something they concluded at T+20, and make the contradiction quiet rather than dramatic. Then watch whether anyone notices, whether the earlier conclusion gets demoted back to an assumption, and how long it takes. Belief revision under time pressure is the actual skill that separates competent incident leadership from confident incident leadership, and it is almost never exercised deliberately. Most real incidents are lost here — not because the team was wrong early, which is inevitable, but because being wrong early was never revisited."
      },
      {
        kind: "compare",
        title: "Facilitation craft",
        left: {
          title: "Facilitator who is generating learning",
          items: [
            "Asks who owns this decision rather than what should we do",
            "Lets silence run for eight seconds before filling it",
            "Redirects a question back to the room: what would you need to answer that, and can you get it today",
            "Notes down the artefact that did not exist, then moves on rather than solving it live",
            "Ends exactly on time, because the debrief is the product"
          ]
        },
        right: {
          title: "Facilitator who is running a lecture",
          items: [
            "Answers every question, including the ones the participants should have to chase",
            "Corrects participants in front of their leadership, which ends candour for the remainder",
            "Adds injects to demonstrate a threat they find interesting",
            "Defends the plan when the plan is criticised",
            "Runs over, so the debrief gets ten minutes and the findings are never written down"
          ]
        }
      },
      {
        kind: "checklist",
        title: "Facilitator pre-flight, forty-eight hours out",
        items: [
          "Objectives written as observable behaviours and shared with the sponsor, who has agreed them",
          "Ground truth document written, internally consistent, and unread by any participant",
          "Every inject mapped to a decision; injects that map to nothing deleted",
          "At least two injects that withhold information and one that contradicts an earlier inject",
          "A named notetaker who is not the facilitator, with a template of one line per finding: what, who was blocked, what artefact was missing",
          "Executive sponsor briefed that the exercise is expected to surface failures and that this is the success condition",
          "Safety word agreed for pausing when a participant needs to state that something is real rather than exercise",
          "Debrief structure fixed in advance: what surprised you, what did you not have, what would you change, in that order",
          "A commitment from the sponsor, before the exercise, that findings will be funded from a specific budget line",
          "Calendar time already booked for the findings review thirty days out — book it before, because you will not get it after"
        ]
      },
      {
        kind: "prose",
        title: "Converting findings into change",
        body: "The half-life of a tabletop finding is about eleven days. After that the room's memory of urgency fades and the finding rejoins the backlog at ordinary priority. Beat this with three mechanics. First, write every finding as a ticket with an owner and a date during the debrief itself, in the room, on the screen — not afterward from notes. Second, categorise each finding as artefact missing, authority unclear, or capability absent, because the three route to completely different fixes and mixing them produces a list nobody can act on. Third, take the two findings that most embarrassed the organisation and put them in front of the same audience thirty days later with evidence of closure. Cloudflare's response to its November and December 2025 outages is the public example worth copying: they declared a Code Orange, explicitly deprioritised feature development beneath resilience work, and published the commitments with a quarter attached. The lesson is not the specific engineering — it is that they made the follow-through visible and time-bound, which is what converts an incident or an exercise into a changed system."
      }
    ],
    sources: [
      { label: "CISA Tabletop Exercise Packages (CTEP)", note: "Free, sector-specific exercise packages including situation manuals and facilitator guides. Use them as structural templates rather than content — the scenarios are generic by design, and your own plausible scenario will teach more." },
      { label: "NIST SP 800-84, Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities", note: "Old but structurally sound. The distinction between discussion-based and operations-based exercises is the one most programmes get wrong, and this is where it is defined clearly." },
      { label: "FEMA Homeland Security Exercise and Evaluation Program (HSEEP) doctrine", note: "Where the master scenario events list, exercise evaluation guides, and after-action report format originate. The improvement-plan template is worth stealing wholesale." },
      { label: "Cloudflare, Code Orange: Fail Small (December 2025)", note: "A public example of converting incident findings into an organisation-wide prioritisation mechanism with an explicit commitment that feature work sits below resilience work until a stated quarter." },
      { label: "Gary Klein, Sources of Power: How People Make Decisions (MIT Press, 1998)", note: "Recognition-primed decision making — how experts actually decide under time pressure, which is by pattern match and mental simulation rather than option comparison. Read it to understand why exercising decision-making beats testing knowledge." },
      { label: "Karl Weick and Kathleen Sutcliffe, Managing the Unexpected", note: "High-reliability organising: preoccupation with failure, reluctance to simplify, deference to expertise. The theoretical basis for why contradicting your own participants is the most valuable inject you can write." }
    ]
  },

  {
    id: "sg-first-90-days",
    title: "The First 90 Days as a Security Leader",
    domain: "CISO Leadership",
    kind: "playbook",
    statement: "You have ninety days of licence to ask stupid questions and roughly one chance to spend it well.",
    summary: "A week-by-week entry plan for a new security leader: what to read, whom to meet, what to measure, what to change immediately, what to leave alone, and the five artefacts you must produce before day ninety.",
    minutes: 32,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "What the ninety days are actually for",
        body: "The first ninety days are not for fixing things. They are for building an accurate model of where risk actually sits, establishing that you are a person who says true things, and earning the right to make expensive decisions later. Most incoming security leaders invert this: they arrive with a programme from their last company, announce it in week three, and spend the next year discovering why the previous person did not do that. The asset you are accumulating in this period is credibility, and it is spent later, all at once, on the one or two things that actually matter. Guard it. In particular, guard it from the temptation to demonstrate value early through visible activity."
      },
      {
        kind: "timeline",
        title: "The ninety days",
        items: [
          "Days 1-5 — Read before you speak. The last three years of incidents and near misses. The audit findings and their management responses. The risk register, if it exists, and what has been on it longest. The last four board decks and, more importantly, the questions asked afterwards. Every open exception and risk acceptance. Get the org chart and the actual budget, not the summary.",
          "Days 1-10 — Find the people who know. In every organisation there are three or four people who can tell you where the bodies are: a long-tenured infrastructure engineer, someone in internal audit, a support lead, and usually one deeply cynical architect. Ask each of them the same question: what would you fix if I could give you one thing, and what is everyone pretending is fine.",
          "Days 5-15 — Establish the incident baseline. Not the plan — the reality. When did you last declare, who commanded, how long to contain, what is the on-call load, and what was the last thing that went badly. Read the two most recent incident records end to end. This tells you more about the organisation than any assessment.",
          "Days 10-25 — Meet the business, and ask about revenue rather than about security. What does this business unit sell, what would stop it selling for a week, what data would be catastrophic to lose, and who is the customer that would leave. You are building the loss-magnitude side of your risk model, and only they have it.",
          "Days 15-30 — Find the immediate, undeniable exposures. There are usually two or three: an internet-exposed system that should not be, a domain admin account with a decade-old password, a backup that has never been restored, an unmanaged privileged path into production. Fix these quietly and immediately. Do not announce them. You are demonstrating competence to your own team, not to the executive floor.",
          "Days 30-45 — Write the honest current-state assessment for yourself alone. Unpublishable, uncensored, specific. What is broken, what is theatre, who is not able to do their job, what would a competent adversary do first. This document is the input to everything after it, and it must not be written for an audience.",
          "Days 40-60 — Build the risk picture in business terms. Take the top five loss scenarios, quantify them badly but explicitly, and validate the assumptions with the business owners. Bad numbers you can defend beat colour-coded confidence every time, and the conversation you have while producing them is worth more than the output.",
          "Days 50-70 — Test the machine once. Run a short tabletop with the executive team, or a technical exercise with the response team. You need one shared experience of failure before you propose spending money, because the proposal will land differently after the room has felt the gap.",
          "Days 60-80 — Socialise the plan before you present it. Every number in your ninety-day presentation should already have been seen and challenged privately by the CFO, the CIO, the general counsel, and the audit committee chair. A board meeting is not a place to introduce a surprise; it is a place to ratify an agreement.",
          "Days 80-90 — Present, and commit to less than you can do. Three priorities, each with an owner, a cost, a measurable outcome, and a date. Then deliver all three early. The reputation you want by day one hundred and eighty is that when you say a thing will happen, it happens."
        ]
      },
      {
        kind: "table",
        title: "The five artefacts you must have by day ninety",
        headers: ["Artefact", "What it must contain", "Who must have seen it", "The failure mode if you skip it"],
        rows: [
          ["Top loss scenarios", "Five scenarios with frequency and magnitude ranges in currency, and the named business owner who validated the magnitude", "CFO, business unit heads", "Every future budget conversation becomes an argument about vibes"],
          ["Authority map", "Who can accept risk, at what threshold, and where that is written down", "General counsel, CEO", "You will discover during an incident that nobody can decide, at the worst possible time"],
          ["Incident command instrument", "Declaration criteria, roles, escalation thresholds, notification-clock worksheet, board trigger", "Legal, comms, executive team", "Hour one of your first real incident is spent inventing process in public"],
          ["Control reality inventory", "For the ten controls you would name to a regulator: does it exist, does it cover everything, is it monitored, who fixed the last failure", "Your own leadership team", "You will assert coverage you do not have, in writing, to someone who checks"],
          ["Three-priority plan", "Three funded initiatives with owner, cost, outcome metric, and date", "Board or executive committee, after private socialisation", "You are measured against an imagined mandate rather than an agreed one"]
        ]
      },
      {
        kind: "callout",
        title: "The trap: the predecessor's decisions",
        body: "You will find decisions that look indefensible. Before you reverse any of them, find out what constraint produced them — because the constraint is usually still there. The exception that never expired probably protects a revenue system nobody can afford to touch. The tool nobody uses was probably bought to close an audit finding. The team structure that makes no sense probably reflects a personality that has since left, or one that has not. Reversing a decision without understanding its cause is how a new leader spends credibility on a change that gets quietly reversed back six months later. Ask, in each case: what would have to be true for this to have been reasonable? Then check whether it still is."
      },
      {
        kind: "compare",
        title: "Two entry strategies",
        left: {
          title: "Inherit and steer — usually correct",
          items: [
            "Keeps the existing team intact through the learning period, so institutional memory survives your arrival",
            "Fixes the two undeniable exposures immediately and silently, which builds internal credibility fast",
            "Changes one structural thing at day ninety, chosen after evidence, and explains the reasoning publicly",
            "Treats existing tooling as sunk and asks what it would take to make it work before replacing it",
            "Accumulates political capital in the first quarter to spend in the second"
          ]
        },
        right: {
          title: "Arrive and rebuild — correct only in specific conditions",
          items: [
            "Justified when there has been a recent catastrophic incident and the mandate is explicitly transformation",
            "Justified when the function has no leadership bench and reporting lines are actively obstructive",
            "Costs you every long-tenured person who knows where the undocumented dependencies are",
            "Buys eighteen months of rebuilding before you produce a single risk reduction",
            "Requires a written, executive-level mandate for the disruption, obtained before you start, not after"
          ]
        }
      },
      {
        kind: "checklist",
        title: "Week one, before anything else",
        items: [
          "Read the last two incident records end to end, including the parts that were not presented upward",
          "Obtain the actual budget file with commitments and headcount, not the summary slide",
          "Find every open risk acceptance and exception, and note the ones with no expiry date",
          "Ask the general counsel one question: what keeps you up at night about this company and data",
          "Ask the CFO one question: what is the largest single-day revenue exposure in this business",
          "Confirm you are on the incident escalation path and test it by asking someone to page you",
          "Identify the one person on your team who will tell you the truth, and protect them",
          "Establish whether cyber insurance exists, what it excludes, and what conditions it imposes on your response",
          "Learn how the board actually receives security information and how often, before deciding to change it",
          "Write down your own first impressions on day three, sealed. You will never see the organisation this clearly again."
        ]
      },
      {
        kind: "prose",
        title: "The disclosure dimension, which is new and non-optional",
        body: "If your organisation is a US public company, your entry period now has a regulatory dimension that did not exist before 2023. Regulation S-K Item 106 requires annual disclosure of your cybersecurity risk management processes, management's role, and board oversight — which means the description of your programme is now a filed statement, reviewed by counsel and signed off by officers. Read your company's last 10-K cybersecurity section in week one and ask yourself one question: is every sentence in this true today? If any is not, that is the highest-priority item on your list, ahead of anything technical. The SEC's action against SolarWinds and its CISO turned on public statements about security posture, and whatever one concludes about that case, its durable lesson is unambiguous: descriptions of your security programme are statements with legal weight, and the person who signs off on the description is increasingly you."
      }
    ],
    sources: [
      { label: "NIST Cybersecurity Framework 2.0 (February 2024)", note: "Use GOVERN as the checklist for your first ninety days: organisational context, risk management strategy, roles and responsibilities, policy, oversight, supply chain. It maps almost exactly to what a new leader must establish." },
      { label: "SEC Regulation S-K Item 106 and Form 8-K Item 1.05 (final rule, 2023)", note: "Item 106 makes your programme description a filed statement in the annual report. Read your own company's last filing in week one and check every sentence against reality." },
      { label: "SEC v. SolarWinds Corp. and Timothy G. Brown (S.D.N.Y., charges filed October 2023; claims narrowed July 2024)", note: "The court permitted claims to proceed concerning the company's public security statement while dismissing much of the rest. Whatever the ultimate disposition, the operative lesson is that public descriptions of security posture are actionable statements." },
      { label: "Michael Watkins, The First 90 Days (Harvard Business Review Press)", note: "The general management source. The useful parts for a security leader are the STARS diagnosis — whether you are in start-up, turnaround, accelerated growth, realignment, or sustaining success — and the warning against importing your last playbook." },
      { label: "NIST SP 800-61r3 (April 2025)", note: "The preparation-versus-response split gives you a defensible structure for your day-ninety plan: most of what you will ask for lives under Govern, Identify, and Protect, not under Respond." },
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "Baseline numbers for the detection conversation with your new executive team: 11-day median dwell, 26 days when someone else tells you. Ask what your own number is; if nobody knows, that is your first finding." }
    ]
  },

  {
    id: "sg-saying-no",
    title: "The Discipline of Saying No",
    domain: "CISO Leadership",
    kind: "playbook",
    statement: "A no that cannot be escalated is not authority, it is an obstacle the business will route around.",
    summary: "How to refuse well: the four grades of no, how to make a refusal survivable for the person receiving it, when to escalate rather than block, and how to protect the small number of refusals that must actually hold.",
    minutes: 18,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "You have a refusal budget and it is smaller than you think",
        body: "Every organisation grants its security function a finite number of hard refusals per year before it begins routing around the function entirely — shadow procurement, quiet exceptions, architectural decisions made in meetings you are not invited to. The number is small, perhaps three or four in a mid-sized company, and it resets slowly. This means the operative skill is not the ability to say no. It is the discipline of not spending a hard no on something that a conditional yes would have handled, so that the budget survives for the decision that genuinely cannot be allowed."
      },
      {
        kind: "numbered",
        title: "The ladder — always start at the bottom",
        items: [
          "Yes, and here is the cheaper way. Most requests that alarm you are asking for an outcome, not a mechanism. The person wants customer data in the analytics tool; they do not want the raw table. Offer the outcome through a path you can live with and the conflict evaporates. This resolves the majority of cases and costs nothing from the budget.",
          "Yes, with conditions and a date. The condition must be specific, verifiable, and owned by someone with a name. Conditional approval that nobody verifies is just approval with extra paperwork, and everyone learns that your conditions are decorative.",
          "Yes, for now, with an expiry. Time-boxed acceptance with an automatic review. This is the correct answer far more often than it is used, because it converts an argument about principle into a calendar entry.",
          "No, and here is who can overrule me. This is the hard refusal. It must always come with a named escalation path — the executive who can accept this risk on the company's behalf. A no without an escalation path is an obstacle rather than a decision, and the organisation will treat it accordingly.",
          "No, and I will resign over it. Reserve this for cases involving illegality, a false statement to a regulator or customer, or knowing exposure of people to serious harm. If you use it more than approximately once in a career, either you are in the wrong company or you have miscalibrated. Its power depends entirely on its rarity."
        ]
      },
      {
        kind: "table",
        title: "Four refusals, four correct techniques",
        headers: ["Situation", "Wrong move", "Right move", "Why"],
        rows: [
          ["Team wants a tool with poor security posture for a real business need", "Block on principle, cite policy", "Approve with scoped data, an expiry, and a documented review trigger", "The need is real; a block produces a shadow deployment you cannot see"],
          ["Executive requests an exception to MFA for convenience", "Escalate immediately to their peer", "Offer the friction-reducing alternative first; if refused, write the risk acceptance with their name on it", "Named ownership changes the calculus more reliably than confrontation does"],
          ["Engineering wants to ship with a known critical vulnerability to hit a launch date", "Absolute no", "Quantify the exposure window, offer a compensating control, and set a fix date that is contractual", "Launch dates have their own risk; you are trading two risks, not preventing one"],
          ["Sales promises a customer a security capability that does not exist", "Correct them publicly", "Fix the statement before it reaches the customer, then fix how commitments get made", "The systemic problem is the commitment process, and correcting the individual leaves it intact"],
          ["Finance wants to cut a control to make a number", "Warn about breaches in general", "Present the specific loss scenario the control addresses, with a range, and let them decide on the record", "A decision made on the record with a quantified exposure is a legitimate business decision; you are not the only adult"],
          ["A partner asks you to attest to something you cannot verify", "Soften the language and sign", "Refuse the attestation and offer what you can substantiate instead", "This is the category where the hard no belongs; false attestations are the one thing that does not become survivable later"]
        ]
      },
      {
        kind: "compare",
        title: "Two ways to refuse the same request",
        left: {
          title: "Refusal that holds",
          items: [
            "States the specific loss scenario, not the policy clause",
            "Names what would change the answer: if the data were tokenised, this becomes a yes",
            "Offers a path to yes with a date, so the requester leaves with something to do",
            "Names the person who can overrule and offers to arrange the conversation",
            "Is delivered to the requester before it is delivered to their leadership"
          ]
        },
        right: {
          title: "Refusal that gets routed around",
          items: [
            "Cites policy as the reason, which invites the response that policy can be changed",
            "Offers no alternative, so the requester's only path forward is around you",
            "Is delivered in a large meeting, which makes it a status contest instead of a decision",
            "Has no escalation path, teaching the organisation that security decisions are unappealable and therefore avoidable",
            "Is one of eleven refusals this quarter, so it carries no signal"
          ]
        }
      },
      {
        kind: "callout",
        title: "The escalation is the product, not the failure",
        body: "Security leaders often experience escalation as losing. It is the opposite. The purpose of your role in a contested decision is to ensure the risk is accurately described and consciously owned by someone with the authority to own it. If a general manager accepts a documented risk, with a quantified exposure, an expiry, and their name on the memo, the system worked exactly as designed — and you now have an artefact that is worth more to you than the win would have been. What you must never permit is the third outcome: the risk is taken, nobody accepts it, and there is no record. That is the state in which the organisation is exposed and you are the person who will be asked why."
      },
      {
        kind: "checklist",
        title: "Before you say a hard no",
        items: [
          "I can state the loss scenario in one sentence, with a magnitude range, and a non-specialist would follow it",
          "I have looked for the conditional yes and can explain specifically why it does not work here",
          "I know who has the authority to overrule me and I have a route to them that does not embarrass the requester",
          "I have counted my hard refusals this year and this one is worth the slot",
          "I have checked whether I am refusing the mechanism when I could accept the outcome",
          "I know what evidence would change my mind, and I have said so out loud",
          "If overruled, I know exactly what I will write down, where it will live, and who will sign it",
          "I am not saying no because it is Friday, because I was not consulted earlier, or because the requester was rude — all three are real causes of miscalibrated refusals and none is a reason"
        ]
      },
      {
        kind: "prose",
        title: "The second-order effect: what a reputation for no actually costs",
        body: "A security function known for refusing gets consulted late, which is far more dangerous than being overruled early. The architecture decision you were not in the room for is worse than the one you lost. Track this deliberately: count how many significant technical and commercial decisions reached you before commitment versus after. If that ratio is deteriorating, your refusal rate is too high regardless of how correct each individual refusal was. The counterintuitive move when you find yourself consulted late is to become dramatically easier to consult — approve faster, offer paths, reduce the ceremony — and to accept slightly more risk in the aggregate in exchange for seeing much more of it. Visibility compounds; individual refusals do not."
      }
    ],
    sources: [
      { label: "NIST SP 800-37 Rev. 2, Risk Management Framework — the Authorize step", note: "The formal model where an accountable official explicitly accepts residual risk in writing. Borrow the concept even outside federal contexts: a risk that is taken but not accepted by a named person is an unmanaged risk." },
      { label: "The Open Group, Open FAIR (O-RT Risk Taxonomy and O-RA Risk Analysis standards)", note: "The vocabulary that turns a refusal into a comparison. If you cannot express the request as a change in loss event frequency or loss magnitude, you probably cannot defend the refusal either." },
      { label: "ISO 31000:2018, Risk management — Guidelines", note: "Risk acceptance as a legitimate treatment option alongside avoid, reduce, and share. Useful for reframing yourself as the person who documents the choice rather than the person who forbids." },
      { label: "SEC v. SolarWinds Corp. and Timothy G. Brown (S.D.N.Y. 2023-2024)", note: "The reason the attestation row in the table above is the one category where the hard no belongs. Statements about security posture carry legal consequence for the individual who makes them." },
      { label: "NIST Cybersecurity Framework 2.0, GOVERN function (February 2024)", note: "Roles, responsibilities, and authorities as a named outcome category. Cite GV.RR when arguing that risk acceptance authority must be written down before it is needed." }
    ]
  },

  {
    id: "sg-post-incident-review",
    title: "Post-Incident Review: The Template",
    domain: "Incident Command",
    kind: "template",
    statement: "A review that produces a list of human mistakes has found the symptom and stopped.",
    summary: "The actual document structure, the rules of the room, the question set that surfaces mechanism rather than blame, and the quality bar a review must clear before it is worth anyone's time.",
    minutes: 28,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "What the review is for, stated so the room agrees",
        body: "The purpose is to change the system so that the next competent person in the same situation, with the same information, makes a better decision — or is not put in that situation at all. It is not to determine what went wrong, because that framing pulls toward a single cause and a single owner. It is to understand how the work actually happens, which is nearly always different from how it is documented. If the output is training reminders and be more careful, the review has failed. Every finding must terminate in a change to a system, a default, an interface, a piece of documentation someone will actually read, or an explicit decision to accept the condition."
      },
      {
        kind: "callout",
        title: "Blameless does not mean consequence-free, and pretending otherwise breaks trust",
        body: "Blameless review means we assume every person acted reasonably given the information, tooling, and incentives available to them at the time — because that assumption is usually true and because it is the only assumption that produces accurate information. It does not mean that gross negligence, deliberate policy circumvention, or misconduct is excused; those are separate processes, handled by different people, on a different track. Say this out loud at the start of every review. Teams can tell when blameless is being used as a euphemism, and the moment they suspect it, you stop learning anything real."
      },
      {
        kind: "code",
        title: "The document — copy this structure",
        lang: "markdown",
        body: "# Post-Incident Review: <short incident name>\n\n**Status:** draft | in review | published\n**Severity:** SEV-n   **Duration:** <first impact> to <full recovery>, <hh:mm>\n**Authors:** <names>   **Facilitator:** <name, not the incident commander>\n**Review date:** <date>   **Distribution:** <who>\n\n## 1. Summary\nFour sentences maximum, written for someone two levels removed.\nWhat happened, who was affected and how, how long, and what is different now.\n\n## 2. Impact\n- Customer impact: which customers, which capability, measured how\n- Data impact: categories, volume, confirmed versus not excluded\n- Financial impact: direct response cost, lost revenue, contractual exposure\n- Regulatory impact: which clocks started, when, and their disposition\n- Internal impact: person-hours consumed, work displaced\n\n## 3. Timeline\nOne table. UTC. Separate columns for what happened in the system and\nwhat responders knew at that moment. The gap between those two columns\nis where the actual findings live.\n\n## 4. Detection\n- How was it detected, and by whom\n- Time from first adversary or system action to first signal\n- Time from first signal to human acknowledgement\n- What signals existed and were not surfaced, and why they were not\n- What would have detected this one hour earlier\n\n## 5. Response\n- Was command established, when, and by whom\n- Which decisions were made, by whom, with what information\n- Which decisions would we make differently with the same information\n  (these are process findings)\n- Which decisions were correct given the information but wrong given\n  the reality (these are information findings — the more valuable kind)\n\n## 6. Contributing conditions\nNo root cause section. List the conditions that had to hold\nsimultaneously. For each: was it known, was it accepted, was it visible.\n\n## 7. What went well\nNot a courtesy. Identify the defences that worked, because those are the\nones you must not accidentally remove during remediation.\n\n## 8. Findings and actions\n| # | Finding | Class | Owner | Due | Ticket |\nClass is one of: artefact missing, authority unclear, capability absent,\ndefault unsafe, signal absent, dependency unmodelled.\n\n## 9. Accepted risks\nWhat we have decided not to fix, who accepted it, and when it expires.\nA review without this section is usually hiding something.\n\n## 10. Open questions\nWhat we still do not know, and who is chasing it."
      },
      {
        kind: "table",
        title: "The timeline table — two columns, not one",
        headers: ["UTC", "What was happening in the system", "What responders believed at that moment"],
        rows: [
          ["11:05", "A database permissions change caused a generated configuration file to double in size", "Nothing observed; no alert"],
          ["11:28", "Proxy processes began failing on oversized input", "Error rate spike observed; suspected external attack"],
          ["11:32", "Failure propagating with each configuration refresh cycle", "Symptom fluctuation interpreted as adversary behaviour rather than gradual rollout"],
          ["11:48", "Same underlying condition, continuing", "Belief that an unrelated third-party outage was the cause"],
          ["14:30", "Condition unchanged", "Correct mechanism identified"],
          ["17:06", "Full recovery", "Recovery confirmed"]
        ],
        source: "Structure adapted from Cloudflare's public post-incident report for 18 November 2025, where responders initially believed they were under a hyper-scale DDoS. The right-hand column is where the learning is."
      },
      {
        kind: "list",
        title: "The question set — ask these, in this order, and do not skip the boring ones",
        items: [
          "Walk me through what you were doing just before you noticed. Not what the alert said — what you were doing.",
          "What did you think was happening at that moment, and what made that the most reasonable interpretation?",
          "What information did you go looking for, and how long did it take to find? Where did you look first?",
          "What did you expect to see that you did not see?",
          "Who did you need and could not reach? How did you try?",
          "What did you decide not to do, and why? Deliberate non-actions are decisions and are almost never recorded.",
          "At what point did you know your earlier interpretation was wrong, and what changed it?",
          "If this happened again tomorrow at 3am to someone with less context, what specifically would go worse?",
          "What did you have to work around? Workarounds are the map of where the system fights its operators.",
          "What almost went much worse, and what stopped it? This finds your load-bearing defences before you accidentally remove one."
        ]
      },
      {
        kind: "checklist",
        title: "The publication quality bar",
        items: [
          "No individual is named as a cause; systems, defaults, and interfaces are named instead",
          "The timeline separates system state from responder belief, and the divergence is discussed rather than glossed",
          "There is at least one finding about detection and at least one about the response process itself",
          "Every action has a named human owner — not a team — and a date that is not end of quarter",
          "The what went well section identifies specific mechanisms, so remediation does not remove them",
          "Accepted risks are stated explicitly with an accepting name and an expiry",
          "The summary is comprehensible to someone who does not know the system, verified by having such a person read it",
          "No finding is a training or awareness action unless it is accompanied by a system change, because training alone reliably fails",
          "Counsel has reviewed distribution and privilege posture, and the document says nothing it cannot substantiate",
          "It is published inside two weeks. A perfect review at eight weeks changes less than a good one at ten days."
        ]
      },
      {
        kind: "compare",
        title: "Two reviews of the same incident",
        left: {
          title: "The review that changes the system",
          items: [
            "Finding: the deployment tool applies configuration globally in one step, with no staged rollout and no automatic halt",
            "Finding: the runbook referenced a dashboard that was decommissioned nine months earlier",
            "Finding: the alert fired correctly and was routed to a channel with 40 daily messages, so acknowledgement took 23 minutes",
            "Action: configuration changes move to health-mediated staged deployment; owner named; date in six weeks",
            "Accepted: we will not add a second approval step, because approval fatigue would cost more than it buys — accepted by the VP of Engineering, reviewed annually"
          ]
        },
        right: {
          title: "The review that produces a document",
          items: [
            "Root cause: human error during a configuration change",
            "Finding: the runbook was not followed",
            "Finding: alerting could be improved",
            "Action: remind the team of the change process; owner: the team; date: ongoing",
            "No accepted risks listed, which means the risks are still there and now nobody owns them"
          ]
        }
      },
      {
        kind: "prose",
        title: "Publishing outward, and why the good ones read the way they do",
        body: "If the incident was customer-visible, the external version is a different document with the same spine: specific mechanism, honest timeline, unqualified ownership, and commitments with dates. The best public examples share three features. They open with an unhedged apology and an explicit statement that the outage was unacceptable, before any explanation. They describe the actual technical mechanism in enough detail that a competent engineer could evaluate it — including the embarrassing parts, such as misreading one's own outage as an attack. And they end with a small number of specific, dated commitments rather than a general assurance about taking security seriously. Cloudflare's November 2025 report is the current reference implementation, and its follow-up resilience plan demonstrates the harder second half: publishing what changed as a result, with a quarter attached and feature work explicitly deprioritised beneath it. The reputational return on a precise public review is consistently underestimated by the people deciding how much to say."
      }
    ],
    sources: [
      { label: "Cloudflare, Cloudflare outage on November 18 2025 (blog.cloudflare.com)", note: "The current best public post-incident report. Note the opening apology, the disclosure that they initially misattributed their own outage to a hyper-scale DDoS, and the four specific hardening commitments at the end." },
      { label: "Cloudflare, Code Orange: Fail Small (December 2025) and the completion report (May 2026)", note: "The rarer half: publishing what actually changed. Staged configuration rollout, sane defaults at service boundaries, removal of circular dependencies in break-glass paths, with feature work explicitly ranked below." },
      { label: "Google SRE Book — Postmortem Culture: Learning from Failure", note: "The origin of blameless postmortem practice in the industry, including the argument that blame produces incomplete information rather than merely bad feelings. The postmortem template in the appendix is worth reading against your own." },
      { label: "John Allspaw, Morgan Evans, Daniel Schauenberg — Debriefing Facilitation Guide (Etsy, 2016)", note: "The best practical guide to facilitating the conversation itself. The question set above is heavily indebted to it, particularly the insistence on asking what people expected to see." },
      { label: "Sidney Dekker, The Field Guide to Understanding Human Error (3rd ed., 2014)", note: "Why root cause is the wrong frame and why hindsight makes past decisions look worse than they were. Read chapters on the local rationality principle before you facilitate your first review." },
      { label: "NIST SP 800-61r3 (April 2025)", note: "Positions lessons learned as a continuous risk management input feeding Govern and Identify rather than as a closing ceremony. Useful for arguing that review findings deserve programme budget." }
    ]
  },

  {
    id: "sg-risk-acceptance-memo",
    title: "The Risk Acceptance Memo",
    domain: "Risk & Governance",
    kind: "template",
    statement: "A risk that is taken but not accepted by a named human is an unmanaged risk wearing a process costume.",
    summary: "The full text of a risk acceptance memo that survives audit, litigation, and staff turnover — plus the fields that make it binding, the expiry mechanics, and the anti-patterns that make acceptances accumulate forever.",
    minutes: 20,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "What this instrument does and does not do",
        body: "A risk acceptance memo does three things. It converts an implicit organisational choice into an explicit one. It attaches a name and a date to that choice. And it creates a scheduled moment when the choice is revisited, which is the only reliable defence against the exception that quietly becomes permanent architecture. What it does not do is transfer blame. If an incident occurs in the accepted space, you will still be asked whether the risk was accurately described, whether the accepting officer had the authority and the information to accept it, and whether the compensating controls you listed actually existed. A memo built to shield you will fail at exactly those three questions. Build it to be accurate instead, and it will hold."
      },
      {
        kind: "code",
        title: "The memo — full text, fill and sign",
        lang: "markdown",
        body: "# RISK ACCEPTANCE — RA-<YYYY>-<nnn>\n\n**Title:** <one line, plain language, no acronyms>\n**Requested by:** <name, role>\n**Prepared by:** <name, role>\n**Accepting officer:** <name, role — must hold budget or P&L authority for the affected scope>\n**Date accepted:** <date>   **Expires:** <date, maximum 12 months>\n**Review trigger:** <named event that forces early review>\n\n## 1. The decision, in one sentence\nWe are choosing to <do / not do X> until <date>, accepting the\npossibility of <loss scenario>.\n\n## 2. What we are not doing, and why\nThe control or change that would address this, its cost, its lead time,\nand the specific reason it is not being done now. Be concrete: not\nresource constraints but this requires 2 FTE-quarters from the platform\nteam, which is committed to <named work> until <date>.\n\n## 3. The loss scenario\nWho does what, to what, with what effect. Written so a non-specialist\ncan picture it. One scenario, not a category.\n\n## 4. Exposure\n- Estimated frequency: <events per year, as a 90% range>\n- Estimated magnitude per event: <currency, as a 90% range>\n- Basis: <calibrated estimate by named people / historical data / vendor\n  data — say which, and say how confident>\n- Annualised expected loss: <figure, with the range>\n\n## 5. Compensating controls actually in place\nList only controls that exist today and are monitored. For each: what it\nreduces (frequency or magnitude), and who verifies it still works.\nControls that are planned belong in section 7, not here.\n\n## 6. What would change this decision\nSpecific, observable conditions. Examples: this system becomes\ninternet-reachable; the data volume exceeds N records; a public exploit\nappears for <component>; the customer count on this tier exceeds N.\n\n## 7. Path to closure\nThe work that would retire this acceptance, its owner, its cost, and the\nquarter in which it is expected to be funded. If there is no path, say\nso explicitly — a permanent acceptance is a legitimate answer and must\nbe labelled as one.\n\n## 8. Obligations and disclosure\nAny contractual, regulatory, insurance, or customer-attestation\nobligation this acceptance touches. Confirmed by: <counsel name, date>.\n\n## 9. Signatures\nAccepting officer: __________________  Date: __________\nSecurity: _________________________  Date: __________\n(Security signature attests to the accuracy of sections 3-6, not to\nagreement with the decision.)"
      },
      {
        kind: "table",
        title: "Why each field is there — and what goes wrong without it",
        headers: ["Field", "Purpose", "Failure without it"],
        rows: [
          ["Accepting officer with budget authority", "Ensures the person accepting could actually have funded the alternative", "A director accepts a risk that only the CFO could have avoided; the acceptance is meaningless and everyone finds out later"],
          ["Hard expiry, maximum twelve months", "Forces re-decision as conditions change", "The exception outlives the system, the team, and the reason; you find it during due diligence for an acquisition"],
          ["Named review trigger", "Catches change between annual reviews", "The system becomes internet-facing in month four and the acceptance silently no longer describes reality"],
          ["Quantified exposure with a stated basis", "Makes acceptances comparable and prioritisable across the portfolio", "You cannot answer which of our 60 accepted risks matters most, so none of them get funded"],
          ["Compensating controls limited to those that exist", "Prevents the memo from describing an aspirational architecture", "The memo lists a control that was never deployed, and it is now a written misstatement in an audit file"],
          ["Path to closure with a cost", "Turns the acceptance into a budget request with a queue position", "Acceptances become a landfill instead of a backlog"],
          ["Counsel confirmation on obligations", "Catches the acceptance that contradicts a customer commitment or a filing", "You accept a risk that your own contract or 10-K says you have addressed"],
          ["Security signature scoped to accuracy", "Lets you sign an accurate memo you disagree with", "Security refuses to sign, the memo goes unsigned, and the risk is taken anyway with no record at all"]
        ]
      },
      {
        kind: "checklist",
        title: "Validity test — a memo failing any of these is not an acceptance",
        items: [
          "The accepting officer could have chosen otherwise — they hold the budget or the authority for the affected scope",
          "The loss scenario is one specific scenario, not a category like data breach",
          "The exposure figure has a range and a stated basis, and the basis is not somebody's professional judgement without qualification",
          "Every compensating control listed can be demonstrated today by a named person",
          "The expiry is a date, not a condition, and it is inside twelve months",
          "The path to closure has a cost figure, even a rough one, or is explicitly labelled permanent",
          "The memo would read as reasonable to a regulator who already knows the incident happened — this is the real test",
          "It is stored where the next security leader will find it, and it is indexed in a register with the expiry date"
        ]
      },
      {
        kind: "callout",
        title: "The expiry mechanic that actually works",
        body: "Expiry dates fail because nothing happens when they pass. Fix it with two mechanisms. First, put every acceptance's expiry into the same calendar system that governs financial approvals, so the reminder arrives to the accepting officer rather than to you — the person who accepted should feel the renewal, not the person who documented it. Second, make renewal cost something: the memo must be re-quantified and re-signed, not extended. An acceptance that renews by default is not an acceptance; it is a policy nobody wrote down. When you inherit a register full of expired acceptances, do not attempt to close them all. Sort by exposure, take the top ten to the accepting officers, and let the rest expire into a single portfolio memo that says these forty are being retired without individual review because their aggregate exposure is below threshold, signed by you."
      },
      {
        kind: "list",
        title: "Anti-patterns worth naming out loud",
        items: [
          "The blanket acceptance: legacy systems are accepted until modernisation, with no scope, no exposure, and no date. This is a decision to stop managing an entire estate.",
          "The security-signed acceptance: security accepts the risk on behalf of the business, which inverts the entire point and leaves the function owning consequences it cannot fund away.",
          "The acceptance-as-approval-workflow: a ticket queue where acceptances are granted in bulk by whoever is on rota, producing volume with no deliberation.",
            "The unquantified portfolio: two hundred acceptances, none with a number, so aggregate exposure is unknowable and the register cannot inform a budget conversation.",
          "The acceptance that contradicts a filing: the memo accepts a condition that the company's own annual disclosure describes as controlled. Counsel review exists to catch precisely this.",
          "The retroactive acceptance: written after the incident to establish that the risk was known and accepted. This is worse than no memo, in every forum where it will be read."
        ]
      }
    ],
    sources: [
      { label: "NIST SP 800-37 Rev. 2, Risk Management Framework for Information Systems and Organizations — the Authorize step", note: "The canonical model of explicit, accountable, time-bounded acceptance of residual risk by a named authorising official. The authorisation decision document is the ancestor of this memo." },
      { label: "The Open Group, Open FAIR (O-RT and O-RA)", note: "Where the frequency-times-magnitude structure in section 4 comes from. Even a crude FAIR decomposition makes acceptances comparable, which is what turns a register into a prioritisation instrument." },
      { label: "ISO 31000:2018, Risk management — Guidelines", note: "Establishes risk retention as a deliberate treatment option requiring documented rationale, monitoring, and review. Useful when someone argues that accepting risk is a failure of the security function." },
      { label: "NIST Cybersecurity Framework 2.0, GOVERN — GV.RM and GV.RR (February 2024)", note: "Risk management strategy including risk appetite and tolerance, and roles, responsibilities and authorities. Cite these when establishing who may accept what." },
      { label: "SEC Regulation S-K Item 106 (2023)", note: "Because your acceptances must not contradict your filed description of your cybersecurity risk management processes. This is the specific reason section 8 requires counsel confirmation." },
      { label: "Douglas Hubbard and Richard Seiersen, How to Measure Anything in Cybersecurity Risk (2nd ed., Wiley, 2023)", note: "The argument against ordinal risk scales and for calibrated ranges. Read it before you accept a memo whose exposure field says High." }
    ]
  },

  {
    id: "sg-board-three-slide",
    title: "The Board Narrative: The Three-Slide Standard",
    domain: "CISO Leadership",
    kind: "template",
    statement: "A board does not need to understand your programme; it needs to be able to govern it, which is a different and much smaller thing.",
    summary: "Three slides, the exact questions each must answer, the speaker notes that go with them, the vocabulary to delete, and how to handle the question you cannot answer.",
    minutes: 24,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "The board's job is oversight, and oversight has three questions",
        body: "Directors have a duty to oversee, not to operate. Their duty is discharged when they can answer three things: are we exposed in ways that matter, is the exposure moving in the right direction, and are the decisions that require our authority in front of us. Everything else you might want to tell them — architecture, tooling, incident volume, framework coverage — is either evidence for one of those three or it is your anxiety looking for an audience. Three slides. If you need a fourth, it belongs in the appendix, and appendices are read more carefully than main decks by exactly the directors you most want to reach."
      },
      {
        kind: "table",
        title: "The three slides",
        headers: ["Slide", "The question it answers", "What is on it", "What must never be on it"],
        rows: [
          ["1. Exposure", "Where could we lose materially, and how much", "Top five loss scenarios in currency ranges, each with the named business owner and the trend arrow since last meeting", "Threat actor names, malware families, framework maturity scores, anything colour-coded without a number behind it"],
          ["2. Trajectory", "Are we getting better, and how would we know", "Three to five outcome metrics with 4-6 quarters of history, the target, and one sentence on what moved and why", "Activity counts. Blocked attacks, tickets closed, training completion, and alert volume are not outcomes and directors have learned to discount them"],
          ["3. Decisions", "What needs your authority, and by when", "One to three decisions with the options, the cost, the exposure change, and your recommendation", "Anything you can decide yourself. Bringing non-decisions to a board teaches them that your agenda items are optional"]
        ]
      },
      {
        kind: "code",
        title: "Speaker notes — the actual words",
        lang: "text",
        body: "SLIDE 1 — EXPOSURE  [4 minutes]\n\n“Five scenarios account for most of what could hurt us. The largest is\n<scenario>, which we estimate at <range> per year in expected loss —\nthat is a range, not a forecast, and I will tell you how we built it if\nyou want. <Business owner name> owns that exposure with me.\n\nTwo of the five moved since we last met. <Scenario A> went down because\n<specific change>. <Scenario B> went up because <specific change> —\nI want to be clear that this one got worse, and here is why.”\n\nRULE: name at least one thing that got worse, every single meeting.\nA deck where everything improves is a deck that stops being believed,\nand the board that stops believing you cannot be warned later.\n\n\nSLIDE 2 — TRAJECTORY  [4 minutes]\n\n“Three numbers. Time to detect a confirmed intrusion: <n> days median,\nagainst an industry median of 11 days in the most recent M-Trends. Time\nto remediate a vulnerability that is on CISA's Known Exploited catalogue:\n<n> days against our <n>-day commitment. Percentage of our revenue-\nbearing systems with a tested restore in the last 90 days: <n> percent.\n\nThe third one is the one I would watch. It is <n> percent, and it is the\nnumber that determines what a ransomware event costs us.”\n\nRULE: three numbers, not twelve. Directors remember three.\n\n\nSLIDE 3 — DECISIONS  [7 minutes, most of your time]\n\n“One decision for you today. We can <option A> at <cost>, which reduces\nthe <scenario> exposure from <range> to <range>. Or we can <option B> at\n<cost>, which does less but starts sooner. Or we accept the current\nexposure for another year, which is a legitimate choice and would need to\nbe recorded as such with a named accepting officer.\n\nMy recommendation is <A>, and the reason is <one sentence>. What I need\nfrom you today is <the specific authority>.”\n\nRULE: always include the do-nothing option, priced. A board that is\nnever offered the option of accepting risk correctly suspects it is being\nmanaged rather than advised."
      },
      {
        kind: "list",
        title: "Vocabulary to delete before you present",
        items: [
          "Sophisticated — every actor is described this way and it now signals that you do not know how they got in",
          "Advanced persistent threat, unless you mean a specific tracked group and can say which",
            "Zero-day, unless it genuinely was one; the word is used to mean unpatched far more often than it is true, and one director will know",
          "Best practice — invites the question of whose, and against what evidence",
          "Nation-state — usually true and almost never decision-relevant at board level",
          "Attacks blocked, events processed, or any denominator-free volume figure",
          "Maturity level 3.2 — a number with no units, which directors correctly treat as a number with no meaning",
          "We are compliant — compliance is a floor and directors who have sat on an audit committee know it",
          "Human error, as an explanation for anything; it terminates inquiry exactly where inquiry should begin"
        ]
      },
      {
        kind: "compare",
        title: "The same fact, two registers",
        left: {
          title: "Board register",
          items: [
            "If our order management platform is encrypted, we estimate 4 to 14 days before plants are shipping again, at roughly 1.6 million dollars of gross margin per day",
            "We would find an intruder in our environment in about nine days today. Two years ago it was thirty-one",
            "Two of our top ten suppliers can reach our customer data. Neither contract requires them to tell us about a breach within a fixed period",
            "This control costs 600 thousand a year and reduces the largest scenario by roughly 4 million a year in expected loss. Here is the range and here is what I am uncertain about",
            "I was wrong about the timeline I gave you last quarter. Here is what I missed"
          ]
        },
        right: {
          title: "Engineering register — correct, and wrong room",
          items: [
            "We have gaps in our EDR coverage across the OT segment",
            "Our mean time to detect is improving quarter over quarter",
            "Third-party risk management is a focus area for the coming year",
            "This investment will significantly strengthen our security posture",
            "We are tracking to plan"
          ]
        }
      },
      {
        kind: "callout",
        title: "The question you cannot answer",
        body: "A director will eventually ask something you do not know — are we vulnerable to the thing in the news, or could what happened to that company happen here. There are exactly two acceptable answers and improvising is neither. The first: I do not know, I will find out, and you will have an answer by Thursday — followed by an answer on Thursday. The second: here is what I know now, here is my confidence in it, and here is what would change it. What destroys you is the confident answer that turns out to be wrong, because it costs the board's ability to calibrate everything else you have said. You are, more than anything else, a measuring instrument that the board is trying to learn to read. Be consistent and they will trust the readings, including the alarming ones."
      },
      {
        kind: "checklist",
        title: "Pre-flight, one week before the meeting",
        items: [
          "Every number has been seen and challenged privately by the CFO before it appears in the deck",
          "The audit committee chair has had a private call and knows what is coming, including the bad part",
          "At least one metric has moved in the wrong direction and you can explain it without defensiveness",
          "Each decision on slide three has a costed do-nothing option",
          "You have deleted every acronym, then read it aloud to someone outside security who confirms it parses",
          "Your description of the programme matches your company's most recent Item 106 disclosure, word by word where it matters",
          "You know the three questions each individual director tends to ask, and have prepared for those specifically",
          "The appendix contains the detail behind every headline number, and you have rehearsed jumping to it in under ten seconds",
          "The follow-up from last meeting is the first thing on the page, closed or explained — this is the single highest-trust behaviour available to you"
        ]
      }
    ],
    sources: [
      { label: "NACD Director's Handbook on Cyber-Risk Oversight (National Association of Corporate Directors, with the Internet Security Alliance)", note: "The document your directors have most likely read. Its principles — cyber as enterprise risk, adequate access to expertise, discussion of risk appetite — are the frame they will use to judge your deck. Read it to learn their vocabulary rather than to teach them yours." },
      { label: "SEC Regulation S-K Item 106(c) (2023)", note: "Requires disclosure of board oversight processes and management's role in assessing and managing cyber risk. Your reporting cadence and content are now described in a filing; make sure the deck matches it." },
      { label: "The Open Group, Open FAIR (O-RT, O-RA)", note: "The only widely accepted way to put a currency range on slide one that will survive a CFO's questioning. A board conversation about ranges is qualitatively different from one about colours." },
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "The 11-day global median dwell time gives slide two an external benchmark. Directors trust a number more when it sits next to an independent comparison." },
      { label: "CISA Known Exploited Vulnerabilities catalogue and BOD 22-01", note: "A remediation SLA against the KEV catalogue is the most defensible vulnerability metric available to a board, because the inclusion criterion is confirmed exploitation rather than theoretical severity." },
      { label: "Daniel Kahneman, Olivier Sibony and Cass Sunstein, Noise: A Flaw in Human Judgment (2021)", note: "Why unaided expert judgement varies enormously between occasions and people. The practical reason to give boards ranges and explicit bases rather than confident single points." }
    ]
  },

  {
    id: "sg-crisis-comms-statements",
    title: "Crisis Statements: The Drafting Kit",
    domain: "Incident Command",
    kind: "template",
    statement: "Every sentence you publish during an incident will be read back to you when you know more; write only what will still be true then.",
    summary: "Ready-to-adapt text for the holding statement, the customer notification, the employee brief, and the regulator-facing summary — plus the audience matrix, the banned phrases, and the accuracy rules that keep a statement from becoming a liability.",
    minutes: 26,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "The rule that governs every word",
        body: "Write only sentences that will remain true when the investigation completes. This single constraint eliminates almost every mistake organisations make in incident communications. It rules out no customer data was affected on day two, because you do not know that yet — the true sentence is we have no evidence at this time that customer data was accessed, and we will update this statement as the investigation progresses. It rules out the incident has been contained before you can demonstrate it. It rules out sophisticated attack as a characterisation you cannot support. The discipline is not about lawyerly hedging; it is that every retraction costs more credibility than the original candour would have, and the retraction is public while the original caution was merely awkward."
      },
      {
        kind: "code",
        title: "Holding statement — for hour two to hour twenty-four",
        lang: "text",
        body: "PUBLIC HOLDING STATEMENT (max 120 words)\n\nOn <date>, <company> identified <a security incident affecting / unusual\nactivity in> <the narrowest accurate system description>. We took\nimmediate steps to <contain / investigate>, engaged external\ncybersecurity experts, and notified <law enforcement / relevant\nauthorities>.\n\n<If applicable:> <Named service> is currently <unavailable / degraded>.\nWe expect to provide an update by <specific time, with timezone>.\n\nWe are working to determine what information may have been involved. We\nwill contact affected <customers / individuals> directly if we determine\nthat their information was affected.\n\nUpdates will be published at <URL> and we will post the next update by\n<specific time>.\n\n---\nRULES FOR THIS STATEMENT\n1. Name a specific next-update time. Then meet it, even with no news.\n   “No new information; next update at 18:00 UTC” preserves more trust\n   than silence and costs nothing.\n2. Never use the word “breach” before counsel confirms it. In several\n   jurisdictions it is a defined term that triggers obligations.\n3. Do not quantify anything you have not verified twice.\n4. Do not name a threat actor, a malware family, or an attribution.\n5. Do not say “no evidence of” unless you have actually looked and can\n   describe where you looked."
      },
      {
        kind: "code",
        title: "Customer notification — for when you have facts",
        lang: "text",
        body: "SUBJECT: Important security notice regarding your <account / data>\n\nWe are writing to tell you about a security incident that affected some\nof your information. We are sorry this happened.\n\nWHAT HAPPENED\nOn <date> we discovered that <plain description of the mechanism, one or\ntwo sentences>. Our investigation determined that an unauthorised party\nhad access between <date> and <date>.\n\nWHAT INFORMATION WAS INVOLVED\n<Enumerated categories, specific. “Your name, email address and hashed\npassword” — not “certain personal information”.> We have <no evidence /\nevidence> that <financial details / government identifiers> were\ninvolved.\n\nWHAT WE ARE DOING\n<Specific actions, past tense where complete: we reset all affected\npasswords on <date>, we revoked all active sessions, we engaged <firm>\nto conduct a forensic investigation, we notified <authority>.>\n\nWHAT YOU CAN DO\n<Two or three specific actions, ranked by usefulness. Not a generic list\nof security hygiene advice — the specific ones that matter for this\nincident.>\n\nFOR MORE INFORMATION\n<Named contact route with a real human at the end of it, and hours.>\n\n---\nRULES\n1. Apologise in the first three sentences, unconditionally, with no “if\n   you were affected” or “any inconvenience” construction.\n2. Enumerate data categories exactly. Vagueness reads as concealment and\n   generates more inbound contact than precision does.\n3. Never lead with what you did well. The reader wants to know what\n   happened to them.\n4. Offer credit monitoring only if it is genuinely relevant to the data\n   involved. Offering it reflexively signals that you have not thought\n   about what was lost."
      },
      {
        kind: "table",
        title: "Audience matrix — who hears what, and when",
        headers: ["Audience", "First contact", "Owner", "Content constraint", "Common failure"],
        rows: [
          ["Employees", "Before any external statement", "CEO or COO, not security", "What is true, what not to say externally, where to send inbound questions", "Employees learn from the press and post their own speculation"],
          ["Enterprise customers under contract", "Per contractual window, often 24-72 hours", "Named account teams, single approved script", "Only what is substantiated; contractual notice language cited", "Different account managers give different versions, which surfaces on a customer forum by day two"],
          ["Consumers / data subjects", "When categories and scope are determined", "Comms with counsel", "Enumerated categories; specific actions; named contact route", "Vague categories, generic advice, no human contact route"],
          ["Regulators", "Per the statutory clock, from awareness", "Counsel", "Factual, structured to the regime's required fields, phased where permitted", "Waiting for investigative certainty and blowing the clock"],
          ["Investors / market", "Per SEC Item 1.05 following materiality determination", "CFO and counsel, with disclosure committee", "Nature, scope, timing, material impact or reasonably likely material impact", "Filing under Item 1.05 for an incident not determined material, which the SEC staff has specifically discouraged"],
          ["Press", "Only after employees and customers", "Single named spokesperson", "The holding statement, verbatim, no elaboration", "An engineer speaks helpfully to a reporter and creates the day-two story"],
          ["Partners and suppliers", "When their systems or credentials are implicated", "Security, direct to their security contact", "Indicators and the specific action requested, under stated handling", "A generic notice to all suppliers that tells them nothing actionable"]
        ]
      },
      {
        kind: "list",
        title: "Banned phrases and what to write instead",
        items: [
          "Sophisticated attack — instead: describe the mechanism, or say nothing about the mechanism yet",
          "We take security seriously — instead: state a specific thing you did, with a date",
          "No evidence of misuse — instead: we have no evidence at this time that the information has been used, and we are continuing to monitor. The words at this time and continuing are what make it survive",
          "Out of an abundance of caution — instead: say what you did and why, without the flourish that signals you think it was unnecessary",
          "We were the victim of a crime — true, and it reads as deflection to every audience except your own employees",
          "Limited number of customers — instead: a number, or a category, or nothing",
          "The incident has been contained — only after you can demonstrate it; until then, we have taken steps to contain the activity and are monitoring",
          "Military-grade encryption, bank-level security, or any comparison to an institution you do not control — this specific class of claim is what regulators and plaintiffs quote back"
        ]
      },
      {
        kind: "callout",
        title: "Privilege, and how organisations lose it",
        body: "Communications aimed at obtaining legal advice can be privileged; the underlying facts never are. Organisations lose privilege by mixing the two — putting forensic findings into a marketing deck, circulating the investigator's report to a wide business audience, or having the incident channel double as the legal-advice channel. Practical discipline: counsel engages the forensic firm, not procurement. Legal-advice threads are separate from operational threads and are labelled. The scribe's factual timeline is written to be disclosed, because it probably will be. And nothing in any channel characterises legal exposure, because a stray sentence estimating our liability here is probably eight figures written by an engineer at 2am will be read aloud in a deposition. None of this is about hiding facts. It is about not converting privileged advice into discoverable commentary through carelessness."
      },
      {
        kind: "compare",
        title: "Two notifications for the same incident",
        left: {
          title: "The one that reduces harm",
          items: [
            "Names exactly which data fields were involved, per affected population",
            "Gives the access window as two dates, so people can reason about their own exposure",
            "Recommends two specific actions relevant to the data lost, not a generic hygiene list",
            "Provides a phone route staffed by trained humans with the actual facts",
            "Published simultaneously with the regulator filing, so the two do not contradict"
          ]
        },
        right: {
          title: "The one that generates a second crisis",
          items: [
            "Says certain personal information may have been involved",
            "Omits the access window, so every customer assumes the maximum",
            "Offers twelve months of credit monitoring for an incident that did not involve identifiable financial data",
            "Directs recipients to a web form with no response commitment",
            "Says no evidence of misuse on the same day the data appears on a leak site"
          ]
        }
      }
    ],
    sources: [
      { label: "SEC Form 8-K Item 1.05 and the Corporation Finance staff statement of 21 May 2024 (Erik Gerding)", note: "The staff discouraged voluntary Item 1.05 filings for incidents not determined material, directing them to Item 8.01, with the stated concern that investors would otherwise misperceive immaterial incidents as material. This shapes the investor row of the matrix." },
      { label: "GDPR Article 34 (gdpr-info.eu)", note: "Communication to data subjects where the breach is likely to result in a high risk to their rights and freedoms, in clear and plain language, describing the likely consequences and the measures taken. The plain language requirement is legal, not stylistic." },
      { label: "GDPR Article 33(3) (gdpr-info.eu)", note: "The required content fields for the supervisory authority: nature of the breach and approximate numbers, DPO contact, likely consequences, and measures taken. Structure your regulator-facing summary to these fields exactly." },
      { label: "Cloudflare, Cloudflare outage on November 18 2025", note: "The reference for tone: an unhedged apology in the first lines, the statement that any outage is unacceptable, and full disclosure of their own misdiagnosis. Public candour about being wrong is what makes the rest credible." },
      { label: "CISA and FBI joint #StopRansomware Guide", note: "Contains the reporting routes and the standard language for law-enforcement engagement, which belongs in your holding statement when true." },
      { label: "State attorney general breach notification statutes (see the multistate summaries maintained by the National Conference of State Legislatures)", note: "Content requirements vary materially by state — some prescribe specific sections and headings. Counsel should hold a jurisdiction matrix; you should know it exists before you draft." }
    ]
  },

  {
    id: "sg-notification-clocks",
    title: "The Regulator Notification Clock Checklist",
    domain: "Risk & Governance",
    kind: "checklist",
    statement: "The clocks start at awareness, and awareness is a lower bar than you want it to be.",
    summary: "Every notification clock a multinational incident can start — SEC, GDPR, NIS2, DORA, CIRCIA, HIPAA, NYDFS and more — with the trigger, the deadline, the recipient, and the traps that cause organisations to miss them.",
    minutes: 28,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "How organisations actually miss these",
        body: "Almost nobody misses a notification deadline through ignorance of the deadline. They miss it in one of four ways. They mis-date awareness, treating it as the moment the investigation concluded rather than the moment a responsible person had enough information to suspect a reportable event. They wait for certainty, when nearly every regime permits and expects phased reporting. They notify one regulator and lose track of the six others the same facts triggered. Or nobody owned the clock — the responder assumed legal was counting, legal assumed the responder would say when it mattered, and four days passed. The fix is a single worksheet, opened in the first hour of every declared incident, with one named owner whose entire job is the clocks."
      },
      {
        kind: "table",
        title: "The clock table — verify against counsel for your jurisdictions and sector",
        headers: ["Regime", "Trigger", "Deadline", "To whom", "Note"],
        rows: [
          ["SEC Form 8-K Item 1.05 (US public companies)", "Determination that a cybersecurity incident is material", "4 business days from the determination", "SEC, via EDGAR", "The determination itself must be made without unreasonable delay after discovery. The clock you must defend is the discovery-to-determination gap, not the four days."],
          ["SEC Form 8-K Item 8.01", "Voluntary disclosure of an incident not determined material", "No statutory deadline", "SEC", "Staff guidance of 21 May 2024 directs non-material or undetermined incidents here rather than to Item 1.05, to avoid investors misreading them as material."],
          ["GDPR Article 33 (EU/UK personal data)", "Awareness of a personal data breach, unless unlikely to result in risk to rights and freedoms", "72 hours where feasible; later notification requires a reasoned justification", "Lead supervisory authority", "Phased reporting is explicitly permitted under Article 33(4). Processors must inform controllers without undue delay under 33(2)."],
          ["GDPR Article 34", "Breach likely to result in high risk to individuals", "Without undue delay", "The data subjects", "Clear and plain language required; specific content obligations. Not required if data was rendered unintelligible, or if a subsequent measure removes the high risk."],
          ["NIS2 Article 23 (EU essential and important entities)", "Awareness of a significant incident", "24h early warning; 72h incident notification; 1 month final report (3 months if ongoing)", "National CSIRT or competent authority", "The 24-hour early warning only needs to state whether malicious activity is suspected and whether cross-border impact is possible. Do not treat it as a report."],
          ["DORA Article 19 (EU financial entities)", "Classification of an ICT-related incident as major", "Initial within 4 hours of classification and no later than 24 hours from awareness; intermediate within 72 hours of the initial notification; final within 1 month of the latest intermediate report", "Competent authority", "Deadlines set by the regulatory technical standards, Delegated Regulation (EU) 2025/301, Article 5; templates by the implementing technical standards, Implementing Regulation (EU) 2025/302. The 24-hour limit runs from awareness, not from classification; do not let classification become a stall."],
          ["CIRCIA (US critical infrastructure, per the statute)", "Covered cyber incident; separately, a ransom payment", "72 hours for a covered cyber incident; 24 hours for a ransom payment", "CISA", "Statutory deadlines are fixed; the obligations attach on the effective date of the final rule following the April 2024 proposed rule. Confirm current status with counsel before relying on any timing assumption."],
          ["HIPAA Breach Notification Rule (US health data)", "Discovery of a breach of unsecured protected health information", "Without unreasonable delay and no later than 60 calendar days for breaches affecting 500 or more individuals; annually for smaller ones", "Individuals, HHS OCR, and media for 500+ in a state or jurisdiction", "The 60-day figure is an outer limit, not a target, and OCR has treated it as such in enforcement."],
          ["NYDFS 23 NYCRR Part 500 (NY financial services)", "Cybersecurity event; separately, an extortion payment", "72 hours for a cybersecurity event; 24 hours for notice of an extortion payment, plus 30 days for a written explanation of the reasons", "NYDFS Superintendent", "The extortion payment provisions came in with the Second Amendment. This is one of the few regimes that requires you to explain why you paid."],
          ["US state breach notification statutes", "Varies; typically unauthorised acquisition of defined personal information", "Varies from 30 to 90 days; several require attorney general notice above thresholds", "Individuals and state attorneys general", "Content requirements differ by state, sometimes prescriptively. Counsel needs a matrix; you need to know one exists."],
          ["Contractual customer notification", "Confirmed incident affecting the customer's data or service", "Frequently 24 to 72 hours, often stricter than any regulator", "Named customer contacts", "This is the deadline most often missed, because nobody in the incident has read the contracts. Pull the top twenty by revenue in hour one."],
          ["Cyber insurance policy", "Awareness of a circumstance that may give rise to a claim", "Often as short as 72 hours; conditions on panel firms and consent", "Insurer or broker", "Late notice or unapproved vendor engagement can impair coverage. Read the policy, not the broker summary."]
        ]
      },
      {
        kind: "checklist",
        title: "Hour zero — open the worksheet",
        items: [
          "Name a single clock owner. Not the commander, not counsel generically — a named person whose only job is the notification worksheet",
          "Record three separate times in UTC: first evidence of the activity, first human observation, and the moment a responsible person could reasonably have suspected a reportable event. The third is the one regulators care about",
          "List every jurisdiction where affected data subjects reside, not where your systems reside — data location is not the test under GDPR",
          "List every regulated entity in the group that is separately in scope, including subsidiaries with their own supervisors",
          "Identify sector overlays: financial services, health, critical infrastructure, telecoms, defence — many organisations sit under three simultaneously and only remember one",
          "Pull the top twenty customer contracts by revenue and extract the notification clauses within four hours",
          "Locate the cyber policy and read the actual notice condition and panel-firm requirement",
          "Set calendar alarms at 50 percent of each deadline, not at the deadline",
          "Record a decision line for every clock you have assessed as not triggered, with the reason. The unrecorded non-decision is what looks negligent in hindsight",
          "Confirm who signs each filing and that they are reachable, including overnight and at weekends"
        ]
      },
      {
        kind: "callout",
        title: "The awareness trap",
        body: "Awareness is not certainty and it is not the completion of your investigation. Under GDPR it is generally understood as the point at which the controller has a reasonable degree of certainty that a security incident occurred leading to personal data being compromised — a threshold that a competent investigator often crosses days before the report is written. Under NIS2 the early warning is due 24 hours from becoming aware of a significant incident, and the content required is deliberately minimal precisely so that awareness cannot be deferred by claiming you do not yet have the details. Under DORA the initial report follows classification, and the classification decision is itself expected promptly. The consistent regulatory posture across all of these is the same: tell us early with little, then tell us more. Organisations that wait for a complete picture are optimising for a standard no regulator asked for, and are usually late by their own regulator's reckoning while feeling responsible."
      },
      {
        kind: "numbered",
        title: "Running the clocks under uncertainty",
        items: [
          "Assume triggered, then disprove. Open every plausibly applicable clock at hour one and close each with a written reason. This is faster than the reverse and produces a defensible record either way.",
          "Separate the determination from the filing. For SEC purposes these are two distinct acts with two different standards: the determination must be without unreasonable delay, the filing within four business days of it. Document both, separately, with times.",
          "Use phased reporting deliberately. Article 33(4) permits it, NIS2 is built around it, DORA mandates it structurally. Filing with what you have is compliant; filing late with more is not.",
          "Draft the filings before you need them, in parallel with the investigation, so the only late-stage variable is facts rather than prose.",
          "Reconcile across regimes before anything goes out. Your SEC language, your GDPR notification, your customer notices, and your press statement must be consistent, because they will be compared — sometimes by a journalist, sometimes by a plaintiff's counsel.",
          "Log every clock decision with time, decider, and reasoning. If you later determine an incident was not material or not reportable, the memo showing how you reached that conclusion is the artefact that protects the decision.",
          "After the incident, reconcile the actual timeline against every deadline and write down where you had slack and where you did not. That reconciliation is the input to next year's exercise design."
        ]
      },
      {
        kind: "list",
        title: "Traps that catch experienced teams",
        items: [
          "Believing that the investigation must conclude before notification. No major regime requires this and several forbid the delay it causes.",
          "Treating a supplier's breach as not your clock. Awareness of a processor's breach is your awareness under GDPR, and you are the controller.",
          "Notifying one EU supervisory authority and assuming the one-stop-shop mechanism covers everything — it does not apply the same way to NIS2 or DORA, which have their own recipients.",
          "Missing the second SEC obligation: the Item 1.05 amendment when previously unavailable material information becomes available.",
          "Forgetting that a ransom payment starts its own clocks independently — 24 hours under CIRCIA once effective, 24 hours under NYDFS for covered entities, with a written explanation following.",
          "Letting the extortion negotiation set the notification schedule. An actor's deadline has no legal standing; a regulator's does.",
          "Overlooking employee data. HR systems hold personal data of data subjects in every country you employ people, which frequently exceeds your customer footprint.",
          "Assuming encryption removes the obligation. It can reduce the Article 34 duty to individuals; it rarely removes the Article 33 duty to the authority."
        ]
      }
    ],
    sources: [
      { label: "SEC, Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure, Release 33-11216 (2023) — Form 8-K Item 1.05", note: "The four-business-day clock runs from the materiality determination, and the determination must be made without unreasonable delay after discovery. Both halves matter and organisations tend to prepare only for the second." },
      { label: "SEC Division of Corporation Finance staff statement, 21 May 2024 (Erik Gerding)", note: "Directs incidents not determined material, or not yet determined, to Item 8.01 rather than Item 1.05, and confirms that an Item 8.01 filing does not discharge the duty to make a materiality determination without unreasonable delay.", url: "https://www.sec.gov/newsroom/speeches-statements/gerding-cybersecurity-incidents-05212024", checked: "2026-11-04" },
      { label: "GDPR Articles 33 and 34 (gdpr-info.eu)", note: "72 hours where feasible, with reasoned justification for delay, phased reporting expressly permitted, and prescribed content fields. Article 34 sets the separate and higher threshold for telling individuals." },
      { label: "NIS2 Directive (EU) 2022/2555, Article 23", note: "The 24-hour early warning, 72-hour incident notification, intermediate report on request, and one-month final report, with three months where the incident is ongoing. Note the deliberately minimal content of the early warning." },
      { label: "DORA Regulation (EU) 2022/2554, Article 19, and Commission Delegated Regulation (EU) 2025/301", note: "The initial report within 4 hours of classification and no later than 24 hours from awareness, intermediate at 72 hours, final at one month. The delegated regulation carries the templates and content requirements." },
      { label: "Cyber Incident Reporting for Critical Infrastructure Act of 2022 (CIRCIA) and CISA's proposed rule (April 2024)", note: "Statutory 72-hour covered-incident and 24-hour ransom-payment deadlines. Confirm the current rulemaking status and effective date with counsel rather than assuming a timeline." },
      { label: "45 CFR Parts 160 and 164 Subpart D — HIPAA Breach Notification Rule", note: "The 60-calendar-day outer limit for breaches of 500 or more individuals, plus the media notice obligation. Read the without unreasonable delay language, which is the operative standard." },
      { label: "23 NYCRR Part 500 (NYDFS), including the Second Amendment (November 2023)", note: "72-hour cybersecurity event notice, 24-hour extortion payment notice, and a 30-day written explanation of why the payment was made. The last is a useful preview of where other regimes are heading." }
    ]
  },

  {
    id: "sg-ir-readiness-audit",
    title: "Incident Readiness: The Discriminating Checklist",
    domain: "Incident Command",
    kind: "checklist",
    statement: "Everyone has a plan; the question is which specific thing will be missing at 3am, and you can find that out cheaply this week.",
    summary: "An audit checklist built from what actually fails during real incidents, not from control catalogues. Every item is one that separates organisations that respond well from organisations that have documentation.",
    minutes: 22,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "How to use this",
        body: "Do not self-assess. For each item, name the person who could demonstrate it and the artefact they would show you, then actually ask three of them at random this week. The gap between an organisation that responds well and one that does not is almost never the existence of a plan; it is whether a specific artefact exists, is current, and is reachable by the person who needs it at 3am on a public holiday. Items below are chosen because they fail in real incidents. Obvious controls have been deliberately omitted — you already know you need logging."
      },
      {
        kind: "checklist",
        title: "Authority and command",
        items: [
          "There is a written statement of who may declare an incident, and at least four people across time zones hold that authority",
          "There is a written threshold at which the board or audit committee must be told, expressed in observable terms rather than as significant incident",
          "There is a named individual, plus an alternate, authorised to approve a ransom payment, and the authority document predates any incident",
          "There is a written decision rule for taking a revenue-generating system offline, and it names who decides — not who is consulted",
          "Somebody other than the CISO has commanded a declared incident in the last twelve months",
          "The incident commander role is explicitly separated from the technical lead role in your plan, and this separation held in your last real incident",
          "Out-of-hours escalation has been tested by paging cold, at 2am, without warning, in the last six months"
        ]
      },
      {
        kind: "checklist",
        title: "Evidence and investigation",
        items: [
          "Cloud control-plane audit logs are retained for at least twelve months, not the ninety-day default, and this has been verified by querying for an event eleven months old",
          "You can determine what a given identity did across every major system within four hours, and someone has actually done it recently",
            "Endpoint memory capture is possible on a machine you cannot physically reach, and the tooling has been used in anger this year",
          "Log retention exceeds your realistic detection latency — if median dwell time in your sector is measured in weeks, thirty-day retention means the evidence is gone before you look",
          "There is a documented, tested procedure for preserving evidence before reimaging, and the service desk knows it exists",
          "SaaS platforms you depend on can produce per-tenant access logs, and you have confirmed this with each of the top five rather than assumed it",
          "Your forensic retainer has a named responder, a response-time commitment, and has been activated at least once, even for a small matter, so the first activation is not during a crisis"
        ]
      },
      {
        kind: "checklist",
        title: "Recovery, which is where the money is",
        items: [
          "A revenue-bearing system has been restored from backup, end to end, in the last ninety days, and the elapsed time was recorded",
          "Backup infrastructure authenticates from a separate identity domain, so compromise of your primary directory does not compromise the backups",
          "At least one backup copy is immutable or offline, and someone has verified the immutability setting rather than the vendor's marketing",
          "The restore runbook does not depend on any system that would be unavailable in the scenario it addresses — check specifically for the password vault, the wiki, and single sign-on",
          "You know the actual restore throughput in terabytes per hour from a measurement, not from a datasheet",
          "There is a documented clean-build path for a domain controller and for your CI/CD system, and it has been walked through this year",
          "Someone can state, from memory or a single document, the recovery time for the top five revenue-bearing systems"
        ]
      },
      {
        kind: "checklist",
        title: "Communication and obligation",
        items: [
          "There is an out-of-band communication channel that does not depend on the corporate identity provider or corporate email, and the incident team has used it in a drill",
          "A holding statement and a customer notification template exist, pre-cleared by counsel, and have been reviewed in the last twelve months",
          "The notification-clock worksheet exists as a document, with an owner role, and was used in your last exercise",
          "Someone has read the cyber insurance policy's notice conditions and panel-firm requirements in the last year, and can state them",
          "The top twenty customer contracts have had their notification clauses extracted into a single reference document",
          "External counsel with breach experience is retained and has been contacted at least once this year",
          "The press contact is a single named person and everyone in engineering knows not to be that person"
        ]
      },
      {
        kind: "table",
        title: "The five questions that predict outcome better than a maturity assessment",
        headers: ["Question", "Good answer", "What a bad answer tells you"],
        rows: [
          ["When did you last restore a production system from backup and how long did it take?", "A date inside 90 days and a number in hours", "Recovery time is a hope, and every ransomware decision will be made blind"],
          ["Who declared your last incident and how long after first signal?", "A name and a number under 30 minutes", "Either you have no declarations, meaning your detection is silent, or declaration is informal and inconsistent"],
          ["Show me the decision log from your last significant incident", "A timestamped document with named deciders", "There is no record, so there was no command and there is nothing to learn from"],
          ["What is your median time from KEV catalogue listing to remediation?", "A measured number against a stated SLA", "Vulnerability management is measured by scan coverage, which measures effort rather than exposure"],
          ["If your identity provider were compromised right now, how would you communicate?", "A named channel that has been exercised", "Your entire response depends on the system most likely to be the target"]
        ]
      },
      {
        kind: "callout",
        title: "The single test worth more than the rest of this list",
        body: "Pick a Tuesday. Tell the response team you are running a no-notice exercise. Then ask them to do one thing: produce, within four hours, a complete account of everything a specified privileged identity did across every system in the last thirty days. Do not tell them why. What you learn is worth more than a year of maturity assessment — whether your logs go back far enough, whether they are queryable together, whether anyone knows how, whether the tooling requires a person who is on leave, and how long a routine investigative question actually takes. Nearly every organisation that fails this test believed it would pass, and nearly every ransomware investigation begins with exactly this question."
      }
    ],
    sources: [
      { label: "NIST SP 800-61r3 (April 2025)", note: "The preparation half of the model — Govern, Identify, Protect — is where most of these items live. Use its structure to argue that readiness work is programme budget rather than incident budget." },
      { label: "CISA, FBI, NSA, MS-ISAC — #StopRansomware Guide", note: "The prevention and response checklists behind most of the recovery items above, particularly the emphasis on offline, encrypted, immutable backups and on testing restoration." },
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "11-day median dwell, 26 days when externally notified. Use these to set a log retention floor: retention shorter than plausible dwell means the evidence is gone before the question is asked." },
      { label: "Cloudflare, Code Orange: Fail Small (December 2025)", note: "Specifically the commitment to remove circular dependencies from break-glass access paths. That failure mode — the tool you need is behind the system that is down — is the one most readiness checklists miss." },
      { label: "Verizon, 2026 Data Breach Investigations Report", note: "31 percent of breaches beginning with software vulnerability exploitation. The KEV remediation question in the table above is derived from this being the leading initial access route." },
      { label: "CISA Known Exploited Vulnerabilities catalogue and Binding Operational Directive 22-01", note: "The inclusion criterion is confirmed active exploitation, which makes time-to-remediate against KEV the most defensible single vulnerability metric you can put on an audit checklist." }
    ]
  },

  {
    id: "sg-materiality-8k",
    title: "Materiality: A Determination Model for Form 8-K",
    domain: "Risk & Governance",
    kind: "model",
    statement: "Materiality is a securities-law judgement made by a committee on a legal standard, and your job is to supply facts precise enough for them to make it defensibly.",
    summary: "A structured determination model: the legal standard, the qualitative and quantitative factors, the sequence, the Item 1.05 versus 8.01 fork, and a worked determination memo.",
    minutes: 32,
    mode: "novus",
    blocks: [
      {
        kind: "principle",
        title: "The standard, stated exactly",
        body: "Information is material if there is a substantial likelihood that a reasonable shareholder would consider it important in making an investment decision, or if it would have significantly altered the total mix of information made available. That is the TSC Industries v. Northway formulation, reaffirmed in Basic v. Levinson, and it is the standard the SEC expressly adopted for cybersecurity incidents rather than inventing a new one. Two consequences follow immediately. First, materiality is not a threshold in dollars; a small financial impact can be material if it reveals something about the company that a reasonable investor would weigh. Second, for events whose outcome is still uncertain, Basic supplies a probability-and-magnitude approach — the significance of the event discounted by the likelihood it occurs. Both consequences push against the engineer's instinct to wait for a final number."
      },
      {
        kind: "numbered",
        title: "The determination sequence",
        items: [
          "Fix the discovery time precisely. Discovery starts the obligation to determine without unreasonable delay. Record it in UTC with the evidence for it, because the gap between discovery and determination is the part you will have to defend.",
          "Convene the disclosure committee, or whatever your company calls the standing body of finance, legal, and business leadership that owns disclosure judgements. Security does not determine materiality. Security supplies facts and their uncertainty.",
          "Produce the facts sheet: systems affected, data categories and volumes, operational impact, customers affected, duration, containment state, and — critically — what is not yet known, with an estimate of when it will be known.",
            "Assess quantitative impact as a range, not a point, covering direct response cost, lost revenue, remediation, contractual penalties, regulatory exposure, and litigation. State the confidence.",
          "Assess qualitative factors independently, because these decide most cybersecurity materiality determinations. See the factor grid below.",
          "Apply probability and magnitude for the uncertain elements, per Basic. An incident with a 40 percent chance of a large adverse outcome is not immaterial merely because the outcome is unresolved.",
          "Decide, and write the memo — including for a determination of not material. The unwritten negative determination is the one that looks like inattention two years later when the facts turn out differently.",
          "If material, file Item 1.05 within four business days of the determination. If not material or not yet determined but disclosure is warranted for other reasons, use Item 8.01, per the staff statement of 21 May 2024.",
          "Set the reassessment trigger. New information can change the determination, and Item 1.05 requires an amendment when information that was unavailable at the time of filing becomes available."
        ]
      },
      {
        kind: "table",
        title: "The factor grid — score both columns, then judge",
        headers: ["Dimension", "Quantitative signal", "Qualitative signal that can carry the determination alone"],
        rows: [
          ["Operations", "Days of impaired revenue-bearing operation; units not shipped; transactions not processed", "Whether the incident revealed that a single control failure can stop the core business"],
          ["Data", "Records by category and by population", "Whether the data is of a kind whose loss changes how customers, partners, or regulators regard the company"],
            ["Financial", "Direct cost range; revenue at risk; expected insurance recovery", "Whether the loss requires a change to guidance, an impairment, or a restatement"],
          ["Customers", "Number affected; revenue concentration among them; contractual penalties triggered", "Whether any customer has step-in, audit, or termination rights that are now exercisable"],
          ["Legal and regulatory", "Notification obligations triggered; expected penalty ranges", "Whether the incident contradicts a prior public statement about the company's security posture — this is high-severity in both securities and enforcement terms"],
          ["Reputation", "Not directly quantifiable", "Whether the incident goes to the company's stated basis of competition, such as a security vendor being compromised or a custodian losing custody"],
          ["Governance", "Not directly quantifiable", "Whether the incident reveals a known, accepted, and undisclosed weakness — a documented risk acceptance that a reasonable investor would have wanted disclosed"],
          ["Recurrence", "Number of related incidents in the period", "Whether this is the third incident of the same class, which can make an individually immaterial event material in aggregate"]
        ]
      },
      {
        kind: "compare",
        title: "Item 1.05 versus Item 8.01",
        left: {
          title: "Item 1.05 — material cybersecurity incident",
          items: [
            "Filed within four business days of the determination that the incident is material",
            "Describes the material aspects of the nature, scope and timing, and the material impact or reasonably likely material impact on financial condition and results of operations",
            "Does not require disclosure of technical detail that would impede response or remediation",
            "Requires an amendment when previously unavailable material information becomes available",
            "A limited delay is available where the Attorney General determines that disclosure poses a substantial risk to national security or public safety"
          ]
        },
        right: {
          title: "Item 8.01 — other events",
          items: [
            "The correct home for voluntary disclosure of an incident not determined material, or not yet determined",
            "Staff guidance of 21 May 2024 discouraged using Item 1.05 for this purpose, on the reasoning that investors would otherwise misread immaterial incidents as material",
            "Filing under 8.01 does not discharge the duty to determine materiality without unreasonable delay",
            "Useful when customers are being notified and market awareness is inevitable, but the determination is still open",
            "Practically: gives you a way to be transparent early without making a legal characterisation you have not yet reasoned to"
          ]
        }
      },
      {
        kind: "callout",
        title: "The gap that gets examined",
        body: "The four business days are not the risky part; the discovery-to-determination interval is. Without unreasonable delay is a standard, not a deadline, and it will be assessed against what you actually did in that window. Two practices make it defensible. First, convene the disclosure committee on a schedule from the moment of discovery — daily during a live incident — and minute each meeting even when the conclusion is that insufficient information exists to determine. A record showing seven consecutive daily meetings is nearly unassailable; a record showing a determination eleven days after discovery with nothing in between is not. Second, define the trigger for convening the committee in advance, in your incident plan, in observable terms. If the plan says the committee convenes when an incident affects customer data or a revenue-bearing system for more than four hours, then convening is a process outcome rather than a judgement call made under pressure by someone who does not want to raise an alarm."
      },
      {
        kind: "checklist",
        title: "The determination memo — required contents",
        items: [
          "Discovery time, with the evidence establishing it, in UTC",
          "Each date the disclosure committee convened, who attended, and what was concluded",
          "The facts relied on, and explicitly, the facts not yet known at the time of determination",
          "Quantitative assessment as a range, with the basis and the confidence",
          "Qualitative factors considered, each addressed, including the ones that argued the other way",
          "The conclusion and the reasoning, in the language of the TSC and Basic standard rather than in operational language",
          "Named decision-makers and the date",
          "The reassessment trigger and its owner",
          "Counsel's participation recorded, and the privilege posture stated",
          "For a not-material determination: an explicit statement of what would change the conclusion"
        ]
      },
      {
        kind: "prose",
        title: "Limits of this model, stated honestly",
        body: "Three limits. First, this is a US securities-law model and it does not travel: NIS2 significance, DORA majority, and GDPR risk to rights and freedoms are different tests with different thresholds, and an incident can be reportable in Brussels and immaterial in Washington on the same facts. Run them independently. Second, materiality is a legal conclusion and you are not the person who reaches it — a security leader who tells the CFO that an incident is immaterial has stepped outside their competence and into someone else's liability. Your product is a facts sheet with honest uncertainty. Third, and least discussed: the model biases toward under-disclosure, because the people applying it experience the costs of disclosure immediately and the costs of non-disclosure only in a tail scenario. Counter it structurally by requiring that the memo address the strongest argument for materiality explicitly, in writing, every time. If nobody in the room can make that argument well, you have not thought about the incident hard enough yet."
      }
    ],
    sources: [
      { label: "SEC, Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure, Release Nos. 33-11216 / 34-97989 (July 2023)", note: "The adopting release. Read the materiality discussion in the preamble, where the Commission declines to set a bright-line threshold and expressly imports the existing securities-law standard." },
      { label: "TSC Industries, Inc. v. Northway, Inc., 426 U.S. 438 (1976)", note: "The substantial likelihood and total mix formulation. Every materiality memo should quote this standard and reason within it rather than inventing operational thresholds." },
      { label: "Basic Inc. v. Levinson, 485 U.S. 224 (1988)", note: "The probability-and-magnitude approach for contingent or speculative events. This is the authority for not deferring a determination merely because the outcome is unresolved." },
      { label: "SEC Division of Corporation Finance staff statement, 21 May 2024 (Erik Gerding)", note: "The Item 1.05 versus Item 8.01 fork, and the stated concern that using 1.05 for everything causes investors to misperceive immaterial incidents as material." },
      { label: "SEC Regulation S-K Item 106 (2023)", note: "The annual disclosure of risk management processes, board oversight, and management's role. Read it alongside 1.05: an incident that contradicts your Item 106 description carries an additional, distinct problem." },
      { label: "SEC v. SolarWinds Corp. and Timothy G. Brown (S.D.N.Y., charges October 2023; claims narrowed July 2024)", note: "The court allowed claims concerning the company's public security statement to proceed while dismissing much else. The reason the factor grid treats contradiction of a prior public statement as high-severity." },
      { label: "Cooley, Key Considerations for Form 8-K Cybersecurity Materiality Determinations (cdp.cooley.com)", note: "Practitioner guidance on running the determination process, including the disclosure committee cadence point. Useful for showing counsel that your proposed process matches market practice." }
    ]
  },

  {
    id: "sg-fair-quantification",
    title: "FAIR: Quantifying a Risk End to End",
    domain: "Risk & Governance",
    kind: "model",
    statement: "A range you can defend beats a colour you cannot, and the argument you have while building the range is worth more than the number.",
    summary: "The Open FAIR taxonomy in full, the eight-step analysis, and a complete worked example — a ransomware scenario quantified, then re-quantified with a proposed control, producing a defensible investment decision.",
    minutes: 42,
    mode: "novus",
    blocks: [
      {
        kind: "principle",
        title: "Why decomposition works",
        body: "People are poor at estimating a composite quantity like annual cyber loss and considerably better at estimating its parts. FAIR exploits that. It decomposes risk into frequency and magnitude, then decomposes each of those until it reaches quantities a knowledgeable person can bound with a calibrated range. You then recombine by simulation rather than by arithmetic, because multiplying ranges by hand produces nonsense. The output is a loss distribution — not a number, a distribution — and the honest version has a wide tail. That width is not a flaw in the method; it is the actual state of your knowledge, made visible for the first time. Executives handle it far better than security teams expect, because they price uncertainty every day in every other part of the business."
      },
      {
        kind: "table",
        title: "The Open FAIR taxonomy",
        headers: ["Level", "Factor", "What it means", "How you actually estimate it"],
        rows: [
          ["Risk", "Risk", "Probable frequency and probable magnitude of future loss", "Simulated, never estimated directly"],
          ["1", "Loss Event Frequency (LEF)", "Probable frequency of loss events in a time frame", "Threat Event Frequency times Vulnerability, or directly from history where you have enough of it"],
          ["1", "Loss Magnitude (LM)", "Probable magnitude of loss per event", "Primary Loss plus Secondary Risk"],
          ["2", "Threat Event Frequency (TEF)", "Frequency of a threat actor acting against the asset", "Telemetry, sector incident data, calibrated estimate. Often the best-evidenced factor you have"],
          ["2", "Vulnerability", "Probability that a threat event becomes a loss event", "Threat Capability versus Resistance Strength. Purple team results are excellent evidence here"],
          ["3", "Contact Frequency and Probability of Action", "How often the actor contacts the asset, and how often contact becomes action", "Decompose TEF only when you have data at this level; otherwise estimate TEF directly"],
          ["3", "Threat Capability and Resistance Strength", "The actor's capability against your control strength, on a comparable scale", "Control testing, red team, exploit availability, KEV listing"],
          ["2", "Primary Loss", "Loss to the organisation as a direct result of the event", "Response, productivity, replacement — the costs you incur regardless of anyone else's reaction"],
          ["2", "Secondary Risk", "Loss arising from other parties reacting to the event", "Secondary Loss Event Frequency times Secondary Loss Magnitude: fines, litigation, customer churn, reputation"],
          ["Forms", "Six loss forms", "Productivity, response, replacement, fines and judgements, competitive advantage, reputation", "Enumerate all six each time. Teams systematically forget response cost and replacement cost"]
        ]
      },
      {
        kind: "numbered",
        title: "The eight steps",
        items: [
          "Scope one scenario precisely: a named threat actor type, acting on a named asset, producing a named effect. Ransomware is not a scenario. A financially motivated criminal group encrypting the order management platform is a scenario.",
          "Estimate Threat Event Frequency as a 90 percent range. Use your own detection telemetry first, sector data second, calibrated judgement third — and say which you used.",
          "Estimate Vulnerability as a probability that a threat event becomes a loss event. This is where control effectiveness enters the model, and where purple team evidence is worth more than any control catalogue.",
          "Derive Loss Event Frequency and sanity-check it against history. If the model says 0.4 events per year and you have had none in ten years, either your controls are better than you modelled or you have not been detecting.",
          "Estimate Primary Loss by walking all six loss forms explicitly. Response and replacement are the ones teams omit, and together they are often the majority of primary loss.",
          "Estimate Secondary Loss Event Frequency — the probability that other parties react at all — separately from Secondary Loss Magnitude. Conflating them is the most common error in FAIR analyses and it inflates the tail dramatically.",
          "Simulate. Ten thousand Monte Carlo iterations in a spreadsheet is enough. Report the mean, the median, the 90th percentile, and the shape.",
          "Re-run with the proposed control changed, and report the difference as risk reduction per year against the control's annualised cost. That difference, not the absolute number, is what the decision needs."
        ]
      },
      {
        kind: "code",
        title: "Worked example — ransomware on the order management platform",
        lang: "text",
        body: "SCENARIO\nA financially motivated criminal group gains access via an exploited\nedge device, deploys ransomware, and encrypts the order management\nplatform that schedules and releases production at five plants.\n\nORGANISATION\nManufacturer, revenue 2.0bn, gross margin ~30% (~1.64m gross margin per\noperating day). 900 endpoints, 120 servers.\n\nALL INPUTS BELOW ARE CALIBRATED ESTIMATES BY NAMED PEOPLE, NOT\nBENCHMARKS. The basis for each is recorded in the analysis file.\n\n--- FREQUENCY ---------------------------------------------------------\nThreat Event Frequency  (attempts reaching deployment stage per year)\n  90% range 2 to 12       most likely 5\n  Basis: 3 years of internal detections at pre-deployment stage,\n  plus sector reporting. Estimators: SOC lead, threat intel lead.\n\nVulnerability  (probability an attempt becomes a loss event)\n  90% range 3% to 20%     most likely 8%\n  Basis: last two purple team exercises reached domain admin in one of\n  three attempts but were detected pre-encryption in both successes.\n\nLoss Event Frequency = TEF x Vulnerability\n  central estimate ~0.4 events per year  (roughly 1 in 2.5 years)\n\n--- PRIMARY LOSS MAGNITUDE (per event) --------------------------------\nResponse       (forensics, IR firm, overtime, counsel, negotiation)\n  90% range 0.4m to 1.6m     most likely 0.75m\nProductivity   (plants down; 1.64m gross margin per day)\n  downtime 90% range 3 to 14 days, most likely 6 days\n  90% range 4.9m to 23.0m    most likely 9.8m\nReplacement    (rebuild 900 endpoints, 120 servers, hardware, licences)\n  90% range 0.6m to 2.5m     most likely 1.1m\nPrimary Loss, most likely  ~11.7m\n\n--- SECONDARY RISK (per event) ----------------------------------------\nSecondary Loss Event Frequency\n  probability that regulators, customers or claimants react materially\n  estimate 60%\nSecondary Loss Magnitude  (fines, notification, customer credits,\n  litigation, lost contracts)\n  90% range 1.0m to 25.0m    most likely 5.0m\nExpected secondary contribution  0.60 x 5.0m = ~3.0m\n\n--- RESULT ------------------------------------------------------------\nLoss Magnitude per event, most likely     ~14.7m\nAnnualised Loss Exposure, central          ~5.9m per year\nSimulated 90% range (10,000 iterations)    ~0.4m to ~28m per year\n  (right-skewed; the mean sits above the median — say this out loud\n   when presenting, because the median is the number people anchor on)\n\n--- CONTROL DECISION --------------------------------------------------\nProposal: immutable backup tier with a separate identity domain, plus\nnetwork segmentation isolating the OT/MES boundary.\n  Capital 1.9m year one, run rate 0.6m per year.\n\nModelled effect, and note that each is an estimate to be defended:\n  Vulnerability   8%  ->  4%   (segmentation breaks the lateral path)\n  Downtime      6 days -> 1.5 days  (tested restore from immutable tier)\n\nRe-run:\n  LEF                       ~0.2 events per year\n  Primary Loss most likely  0.75m + 2.46m + 1.1m = ~4.3m\n  Secondary expected                              ~3.0m\n  Loss Magnitude per event                        ~7.3m\n  Annualised Loss Exposure                        ~1.5m per year\n\n  Risk reduction    ~4.4m per year\n  Annualised cost   ~0.6m per year plus 1.9m capital\n\nCONCLUSION TO PRESENT\n“This control reduces expected annual loss from roughly 5.9m to roughly\n1.5m. It costs 1.9m now and 0.6m a year. The two assumptions carrying\nthe result are the downtime reduction from six days to one and a half,\nwhich depends on a tested restore we have not yet run at full scale, and\nthe segmentation effect on lateral movement, which we can validate with\na purple team in Q3. If the downtime assumption is wrong by half, the\ncase still holds. If both are wrong, it does not.”\n\nThat last paragraph is the deliverable. The number was only the way to\nget to it."
      },
      {
        kind: "compare",
        title: "FAIR versus the heat map",
        left: {
          title: "What quantification buys",
          items: [
            "Risks become comparable, so a portfolio can be ranked and a budget allocated rather than argued",
            "Control proposals get evaluated against loss reduction per currency unit, which is the language finance already speaks",
            "Assumptions become explicit and therefore contestable, which improves them over time",
            "Aggregation across scenarios is arithmetically meaningful; you cannot add two ambers",
            "It surfaces where you are actually uncertain, which is usually loss magnitude rather than frequency — the opposite of where most programmes invest their analysis effort"
          ]
        },
        right: {
          title: "What it does not buy, and where it fails",
          items: [
            "It does not make estimates accurate. Uncalibrated estimators produce confident, precise, wrong distributions with a veneer of rigour",
            "It handles novel or correlated systemic events poorly — a shared cloud provider failing for everyone at once breaks the independence assumption",
            "It is expensive per scenario, so it works for your top ten and not for a register of four hundred",
            "It can be gamed by whoever supplies the inputs, which means the estimation process needs the same governance as the model",
            "It cannot price the scenarios that end the company; those need a separate survivability conversation, not an expected-value one"
          ]
        }
      },
      {
        kind: "callout",
        title: "The failure mode that discredits quantification programmes",
        body: "Precision without calibration. A team produces a beautiful distribution from inputs supplied by three uncalibrated engineers who have never been scored on an estimate, presents it to a board as if it were measured, and is wrong in a way that becomes visible eighteen months later. The programme never recovers. The fix is sequencing: calibrate your estimators before you quantify anything, and record who estimated each input so that estimation quality can be tracked and improved. A FAIR programme without a calibration programme underneath it is a machine for laundering opinion into numbers. Run the calibrated estimation drillbook first, get your estimators to roughly nine-in-ten on 90 percent intervals, and only then start quantifying scenarios that will inform spending."
      },
      {
        kind: "checklist",
        title: "Quality bar for a FAIR analysis you would put in front of a CFO",
        items: [
          "Scenario is a single actor, asset, and effect — not a category",
          "Every input has a named estimator and a stated basis, and the estimators have completed calibration training",
          "The six loss forms have each been considered explicitly, including the two everyone forgets",
          "Secondary loss event frequency is estimated separately from secondary loss magnitude",
          "Results are presented as a distribution with mean, median, and 90th percentile, and the skew is described in words",
          "The two or three assumptions that dominate the result are identified and their sensitivity stated",
          "The control comparison uses annualised cost including run rate, not capital alone",
          "There is a stated validation plan for the dominant assumptions, with a date",
          "Someone hostile to the conclusion has reviewed the inputs before the analysis leaves the building"
        ]
      }
    ],
    sources: [
      { label: "The Open Group, Risk Taxonomy (O-RT) Standard and Risk Analysis (O-RA) Standard — Open FAIR", note: "The normative definitions. If your analysis and your auditor's disagree about what Vulnerability means, this is the document that settles it. Read O-RT before O-RA." },
      { label: "Jack Freund and Jack Jones, Measuring and Managing Information Risk: A FAIR Approach (Butterworth-Heinemann, 2014)", note: "The book-length treatment by the model's authors. The chapters on common analysis mistakes are worth more than the introductory material, particularly on conflating secondary frequency with secondary magnitude." },
      { label: "Douglas Hubbard and Richard Seiersen, How to Measure Anything in Cybersecurity Risk (2nd ed., Wiley, 2023)", note: "The calibration and simulation machinery, plus the sustained argument against ordinal risk matrices. The downloadable spreadsheets are enough to run your first Monte Carlo without buying anything." },
      { label: "FAIR Institute (fairinstitute.org)", note: "Practitioner community, the model diagram, and case material. Useful mainly for seeing how other organisations scope scenarios, which is the step beginners get wrong most often." },
      { label: "NIST SP 800-30 Rev. 1, Guide for Conducting Risk Assessments", note: "The qualitative counterpart. Worth reading to see exactly where the ordinal approach loses information — particularly its own appendices acknowledging that its scales are not arithmetically combinable." },
      { label: "Verizon, 2026 Data Breach Investigations Report", note: "Useful as an external frequency anchor when your own telemetry is thin, with the caveat that DBIR populations are incident-report populations and not your organisation." },
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "Dwell time and initial infection vector distributions, useful as evidence for the Vulnerability and downtime factors respectively." }
    ]
  },

  {
    id: "sg-metrics-tree",
    title: "The Security Metrics Tree",
    domain: "Risk & Governance",
    kind: "model",
    statement: "If a metric cannot change a decision, it is a number you are paying people to produce.",
    summary: "A four-level model that connects a board-level outcome to the operational signal beneath it, so that every metric you report has a decision above it and a lever below it.",
    minutes: 26,
    mode: "both",
    blocks: [
      {
        kind: "principle",
        title: "Every metric must have a parent and a child",
        body: "The parent is the decision the metric informs. The child is the lever that moves it. A metric with no parent is trivia — interesting, unactionable, and it consumes reporting bandwidth that better metrics need. A metric with no child is a wish — it tells you something is wrong but not what to do, so it produces anxiety rather than action. Build your metrics as a tree and enforce this rule at every node. When you cannot name a metric's parent and child, delete it. Most security dashboards shrink by two thirds under this test, and the reporting conversation improves immediately."
      },
      {
        kind: "table",
        title: "The four levels",
        headers: ["Level", "Audience", "Question it answers", "Example", "Cadence"],
        rows: [
          ["L1 — Exposure", "Board, CEO", "How much could we lose, and is it moving", "Annualised loss exposure across the top five scenarios, as a range in currency", "Quarterly"],
          ["L2 — Programme outcome", "Executive committee", "Are our capabilities actually improving", "Median time from intrusion to containment; percentage of revenue-bearing systems with a tested restore in 90 days", "Monthly"],
          ["L3 — Control outcome", "Security leadership", "Is this specific control doing its job across the whole estate", "Percentage of privileged sessions passing through the broker; median days from KEV listing to remediation", "Weekly"],
          ["L4 — Operational signal", "Engineering teams", "What is happening right now and what should I do", "Detection rule coverage against prioritised ATT&CK techniques; queue age; failed agent check-ins", "Continuous"]
        ]
      },
      {
        kind: "numbered",
        title: "Building the tree — start at the top and never at the bottom",
        items: [
          "Write the three to five decisions your executives actually make about security: how much to spend, whether to accept a specific exposure, whether to enter a market or acquire a company, whether to change a business process. These are the roots.",
          "For each decision, write the one number that would change it. If no number would change it, the decision is being made politically and no metric will help — say so out loud rather than instrumenting around it.",
          "Decompose each L1 number into the two or three programme outcomes that drive it. Annualised loss exposure for ransomware decomposes into intrusion frequency, containment speed, and recovery speed — three L2 metrics with clear owners.",
          "For each L2, identify the controls that move it and define one outcome metric per control. Outcome, not activity: coverage of the estate and effectiveness in the estate, never volume of work performed.",
          "For each L3, define the operational signals that predict it, and make those the team's daily instruments. These are the only metrics that should exist in real time.",
          "Now delete everything not on the tree. Every orphan metric you keep is competing for the same executive attention as the ones that matter.",
          "Instrument the tree's own honesty: for every metric, record who can change the number without changing reality. That person is the metric's structural weakness and you should know who they are before someone else finds out."
        ]
      },
      {
        kind: "compare",
        title: "Activity metrics versus outcome metrics",
        left: {
          title: "Outcome — reports the state of the world",
          items: [
            "Median days from KEV catalogue listing to remediation across the estate, with the 90th percentile alongside",
            "Percentage of production workloads reachable from the internet without an authenticated path",
            "Median time from first adversary action to containment, measured from post-incident reconstruction rather than from alert time",
            "Percentage of privileged access that flows through a monitored broker",
            "Percentage of revenue-bearing systems with a restore tested in the last 90 days"
          ]
        },
        right: {
          title: "Activity — reports how busy you were",
          items: [
            "Number of vulnerabilities remediated this month — grows when you deploy more scanners and says nothing about exposure",
            "Attacks blocked — a function of internet background noise and your logging verbosity",
            "Phishing simulation click rate — measures your simulation difficulty at least as much as your workforce",
            "Number of alerts triaged — improves when your detection gets worse",
            "Framework control coverage percentage — measures documentation, and rises fastest when you rewrite the documentation"
          ]
        }
      },
      {
        kind: "list",
        title: "The tests a metric must pass",
        items: [
          "Decision test: name the specific decision this changes and the threshold at which the decision flips. If neither exists, delete it.",
          "Denominator test: percentages need a denominator you can defend. Ninety percent of what, counted how, by whom?",
          "Gaming test: what is the cheapest way to improve this number without improving reality? If that path is easy and invisible, the metric will drift there whether or not anyone intends it.",
          "Direction test: does everyone agree which direction is good? Alert volume fails this — it can rise because detection improved or because the environment degraded.",
          "Latency test: can it move fast enough to inform the decision it serves? A quarterly number cannot drive a weekly decision.",
          "Survivability test: will this still be measurable the same way in two years, after a tooling change? Metrics tied to a vendor's dashboard vanish with the vendor and take your trend line with them.",
          "Comparison test: is there an external benchmark, even a rough one? An 11-day industry median dwell time makes your own number legible to a board in a way that no internal target can."
        ]
      },
      {
        kind: "callout",
        title: "The three metrics that carry the most weight for the least effort",
        body: "If you can maintain only three, make them these. One: median time from first adversary action to containment, reconstructed after each incident rather than measured from alerting — it is the single number that most closely tracks total loss and it exposes both detection and response. Two: median days from CISA KEV catalogue listing to remediation across the whole estate, with the 90th percentile shown next to it — the median tells you about your process and the 90th percentile tells you about the systems your process cannot reach, which are exactly the systems that will be exploited. Three: percentage of revenue-bearing systems with a restore tested in the last ninety days — the number that determines what a ransomware event actually costs and the one that nearly every organisation cannot answer. All three are outcome metrics, all three have external anchors, and all three are expensive to game."
      },
      {
        kind: "prose",
        title: "Where metrics programmes go wrong, and the second-order effect",
        body: "The characteristic failure is building upward from what is easy to instrument. Tooling emits activity counts abundantly, so dashboards fill with them, and eventually someone builds a board slide from whatever the tools produce. The result is a reporting layer that is precise, current, and answers no question anyone was asking. The second-order effect is worse than the waste: teams optimise what is measured. If you report vulnerabilities closed, you will get vulnerabilities closed — starting with the trivial ones, because they close fastest, while the internet-facing unpatched appliance stays open because it needs a change window. That is not a people problem, it is a metric-design problem, and you caused it. Before you publish any metric to an audience with power over budget or promotion, spend ten minutes asking what a rational, slightly cynical person would do to make this number good. Then decide whether you would be happy if they did exactly that."
      }
    ],
    sources: [
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "The 11-day global median dwell time, and the split between internally discovered (10 days) and externally notified (26 days) intrusions. The external anchor that makes your own detection metric legible to a board." },
      { label: "CISA Known Exploited Vulnerabilities catalogue and Binding Operational Directive 22-01", note: "Inclusion requires evidence of active exploitation, which makes KEV-based remediation timing the most defensible vulnerability metric available. Federal agencies operate to fixed due dates under BOD 22-01; borrow the structure." },
      { label: "FIRST, Exploit Prediction Scoring System (first.org/epss)", note: "A daily-updated estimate of the probability that a CVE will be exploited in the wild within the next 30 days. Combine it with CVSS and KEV rather than replacing either; it changes the shape of a remediation queue considerably." },
      { label: "Cyentia Institute, Prioritization to Prediction research series", note: "Empirical work on the coverage-versus-efficiency tradeoff in vulnerability remediation: strategies that catch more exploited vulnerabilities generally waste more effort, and the frontier can be measured. Read it before setting any patch SLA." },
      { label: "NIST Cybersecurity Framework 2.0 (February 2024)", note: "Useful as a structure for L3 control outcomes, with the standing warning that CSF coverage is not itself an outcome metric — it measures the presence of practices, not their effect." },
      { label: "Verizon, 2026 Data Breach Investigations Report", note: "31 percent of breaches beginning with software vulnerability exploitation. The reason a patch-velocity metric belongs in your top three rather than in an appendix." },
      { label: "MITRE ATT&CK", note: "The only shared vocabulary that lets detection coverage be stated as a percentage of something meaningful. Prioritise techniques by observed use in your sector rather than attempting full-matrix coverage, which is a trap." }
    ]
  },

  {
    id: "sg-security-org-design",
    title: "Designing the Security Organisation",
    domain: "CISO Leadership",
    kind: "model",
    statement: "Org design is a bet about where the friction should live, and every structure you can choose is wrong in a different, predictable way.",
    summary: "The five functions every security organisation must cover, the three structural patterns and what each one breaks, the reporting-line question, and a sequence for changing structure without losing the people who know things.",
    minutes: 28,
    mode: "motus",
    blocks: [
      {
        kind: "principle",
        title: "Structure allocates friction; it does not remove it",
        body: "Every organisational design decides which interactions are cheap and which are expensive. Centralise security engineering and you make consistency cheap and product velocity expensive. Embed engineers in product teams and you reverse it exactly. There is no arrangement in which both are cheap. The competent move is to decide deliberately where you want the friction — which usually means where the loss magnitude is highest — and then to be honest with everyone about the cost you have chosen to impose. The incompetent move is to reorganise every eighteen months, discovering each structure's characteristic failure and fleeing to the next one, which imposes both sets of costs plus the cost of the transitions."
      },
      {
        kind: "table",
        title: "The five functions — every organisation covers these or is exposed in that dimension",
        headers: ["Function", "Owns", "Characteristic failure when weak", "Signal that it is weak"],
        rows: [
          ["Governance and risk", "Policy, risk register, acceptances, regulatory posture, board reporting", "The company takes risks nobody accepted and cannot answer regulators", "No expiry dates on exceptions; no quantified exposures; the register has not changed in a year"],
          ["Security engineering", "Building and running controls: identity, network, endpoint, cloud posture, cryptography", "Controls exist as purchases rather than as running systems", "High tool count, low coverage; nobody can say what percentage of the estate a control reaches"],
          ["Detection and response", "Telemetry, detection content, triage, incident command, forensics", "Long dwell, external notification, incidents discovered by customers", "You learn about intrusions from third parties; no post-incident reviews in the last year"],
          ["Product and application security", "Threat modelling, secure defaults in platforms, code and dependency assurance, review of designs", "Security arrives at the end, as a gate, and is routed around", "Reviews are requested the week before launch; the same class of defect recurs quarterly"],
          ["Assurance and identity governance", "Access reviews, control testing, audit interface, third-party assessment", "You assert coverage you cannot demonstrate", "Audit findings repeat across cycles; access reviews are rubber-stamped in bulk"]
        ]
      },
      {
        kind: "compare",
        title: "Centralised versus federated",
        left: {
          title: "Centralised — one team, standard everywhere",
          items: [
            "Cheap consistency, coherent tooling, clear career paths, easier to hire into",
            "Expensive context — the central team does not know why the payments platform is built that way",
            "Becomes a queue, and queues get routed around by anyone with a deadline",
            "Scales badly past roughly one security engineer per 100 engineers; beyond that you are staffing a bottleneck",
            "Correct when the estate is homogeneous, regulatory demands are uniform, or the function is young and needs to establish a baseline"
          ]
        },
        right: {
          title: "Federated — embedded engineers, central platform",
          items: [
            "Cheap context and early involvement; security is in the design meeting rather than the launch review",
            "Expensive consistency — five embedded engineers will make five defensible and different decisions",
            "Embedded people drift toward their host team's incentives within about two quarters unless the reporting line and the performance review stay central",
            "Requires a strong central platform team or it degenerates into five separate small security programmes",
            "Correct when product velocity is the business, when domains genuinely differ, and when you have enough senior people to embed without diluting"
          ]
        }
      },
      {
        kind: "numbered",
        title: "The design sequence",
        items: [
          "Start from loss, not from the org chart. List where the largest losses would originate. Structure exists to put capability next to exposure, so if your largest exposure is a manufacturing platform, that is where an embedded engineer belongs regardless of how the rest is arranged.",
          "Decide what must be identical everywhere and make exactly that centralised and non-negotiable. Identity, logging, secrets management, and the incident command function. Everything else is negotiable, and treating everything as non-negotiable is how a security function loses the right to insist on anything.",
          "Build the platform before you federate. Embedded engineers without a central platform to build on will each build their own, and you will spend three years unifying them.",
          "Keep detection and response centralised almost always. It is the one function with hard economics of scale, a genuine on-call burden, and a requirement for a single view of the estate. Federating it is the most reliably regretted structural decision in this field.",
          "Fix the reporting line for embedded people to security, with a dotted line to the host organisation. If you invert this, you have not federated — you have transferred headcount and will discover it during the next incident.",
          "Size against the exposure, not against a ratio. Published headcount ratios are averages across incomparable organisations. Build the case from what has to be covered, on what cadence, at what standard.",
          "Design the interfaces explicitly and write them down: what a product team can decide alone, what needs consultation, what needs approval. Ambiguity at this boundary produces both bottleneck and bypass simultaneously.",
          "Change structure at most once every two to three years, and only with a written statement of which failure mode you are moving toward. Every reorganisation costs roughly two quarters of output and some number of the people who knew where the undocumented dependencies were."
        ]
      },
      {
        kind: "callout",
        title: "The reporting line, and what it actually determines",
        body: "The CISO reporting line is argued about far more than it matters, and it matters in one specific way: it determines what happens when security and the reporting parent are in conflict. Reporting to the CIO makes infrastructure change cheap and makes it structurally awkward to raise a risk created by IT's own decisions. Reporting to the CEO gives escalation authority and costs you the operational proximity that gets things actually deployed. Reporting to the general counsel aligns well with regulatory exposure and tends to make the function conservative and slow. Reporting to a COO or CTO varies entirely with the individual. There is no correct answer, but there is a correct diagnostic: ask what happens the day you need to say something the person you report to does not want said. If the answer is that you have direct, regular, unaccompanied access to the audit committee, the line matters much less. Secure that access first; it does more work than the box on the chart. Note also that since 2023 this is not purely internal — Regulation S-K Item 106(c) requires public companies to describe management's role and the reporting structure, so the arrangement is now a disclosed fact."
      },
      {
        kind: "checklist",
        title: "Health checks that reveal structure problems before the org chart does",
        items: [
          "Ask three engineers outside security who they would call about a security question. If you get three different answers, or a shrug, the interface is undefined",
          "Count how many significant architecture decisions in the last quarter reached security before commitment. A declining ratio means you are being routed around, whatever the structure says",
          "Check whether any of the five functions has no named owner. Assurance is the one most often orphaned, and it is the one auditors ask about first",
          "Look at where your best people spend their time. If senior engineers are doing triage, the structure is compensating for a capability gap somewhere else",
          "Ask embedded engineers whose feedback they weight more heavily: yours or their host team's. The honest answer tells you whether you federated or transferred",
          "Check whether the on-call burden is distributed or concentrated in four people. Concentration is a retention risk that shows up as a structure problem eighteen months later",
          "Look for the function with no metric in your tree. Unmeasured functions are the ones that quietly stop happening"
        ]
      }
    ],
    sources: [
      { label: "SEC Regulation S-K Item 106(c) (2023)", note: "Requires public companies to describe management's role in assessing and managing cyber risk, including the relevant expertise and the reporting structure to the board. Your org design is now a disclosed fact rather than an internal preference." },
      { label: "NIST Cybersecurity Framework 2.0, GOVERN — GV.RR Roles, Responsibilities and Authorities (February 2024)", note: "The cleanest external reference for arguing that authority and accountability must be explicit and documented rather than inferred from the org chart." },
      { label: "Matthew Skelton and Manuel Pais, Team Topologies (IT Revolution, 2019)", note: "Stream-aligned, platform, enabling, and complicated-subsystem team types, and the three interaction modes. The best available vocabulary for arguing that a security team should usually be a platform plus enabling team rather than a gate." },
      { label: "Google SRE Book — chapters on on-call and operational overload", note: "The economics of on-call load, error budgets, and why concentrating operational burden in a few people is a structural failure rather than a staffing inconvenience. Directly applicable to detection and response staffing." },
      { label: "IANS Research and Artico Search, Security Budget Benchmark and CISO Compensation and Organization research", note: "The main public source for staffing ratios, reporting lines, and budget allocation by sector and size. Use it for orientation and never as a target; the variance between organisations swamps the averages." },
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "Detection outcomes by discovery source. The strongest available argument for keeping detection and response centralised: the split between internal and external discovery is where organisational scale actually shows up in results." }
    ]
  },

  {
    id: "sg-budget-defense",
    title: "Defending the Security Budget",
    domain: "CISO Leadership",
    kind: "field-note",
    statement: "The budget you defend with fear gets cut the first quarter the fear subsides; the budget you defend with unit economics survives the CFO changing.",
    summary: "How security budgets are actually decided, the four arguments ranked by how long each survives, what to do in a cut cycle, and the two mistakes that cost more than any single line item.",
    minutes: 18,
    mode: "motus",
    blocks: [
      {
        kind: "prose",
        title: "What is actually happening in the room",
        body: "Your budget is not evaluated against the threat landscape. It is evaluated against the other things the same money could buy, by people who are being asked to fund a sales expansion, a platform migration, and a new plant with the same pool. That is not cynicism; it is the correct behaviour of a finance function, and until you internalise it you will keep making arguments that feel compelling and land as noise. The winning position is not that security is important — everyone already agrees and it changes nothing. It is that this specific spend removes this specific quantity of expected loss, here is the range, here is what I am uncertain about, and here is what happens if we defer it two quarters. That argument competes on the same terms as every other request in the room, which is the only place it can be won."
      },
      {
        kind: "numbered",
        title: "The four arguments, ranked by how long they survive",
        items: [
          "Unit economics of loss reduction — this control reduces expected annual loss from 5.9 million to 1.5 million and costs 600 thousand a year to run. Survives a CFO change, an incident-free year, and a downturn. It is the only argument that gets stronger with time, because you can show the trend. It requires you to have done quantification work, which is why the FAIR guide comes before this one.",
          "Enabling revenue — we cannot sell to this customer segment, enter this market, or close this deal without this control. Survives well because it is denominated in revenue and has a named commercial owner who will defend it for you. Find these; there are usually two or three you have not noticed, and the enterprise sales team knows exactly what they are.",
          "Obligation — a regulator, a contract, or an auditor requires this. Survives, but it caps you: you will get exactly the minimum and never a penny more, and you will have taught the organisation that security spend is a compliance tax rather than a risk decision. Use it when it is true; never make it your primary frame.",
          "Fear — look at what happened to that company. Works once, works fast, and decays within about two quarters. Worse, it trains the organisation to fund security only after visible pain, which means you cannot fund prevention. If you find yourself reaching for this repeatedly, it is a signal that you have not built the first argument yet."
        ]
      },
      {
        kind: "table",
        title: "Translating five common requests into arguments that land",
        headers: ["The request", "How it usually gets framed", "How to frame it instead"],
        rows: [
          ["Three more detection engineers", "We are understaffed and the team is burning out", "Our reconstructed containment time is 19 days against an industry median of 11. Each day of dwell adds roughly X to expected loss. Three engineers move us to a 24/7 follow-the-sun rota, which the on-call data says is the binding constraint"],
          ["Privileged access management platform", "We need PAM, it is a best practice", "Sixty-one percent of privileged access today bypasses any monitored path. In our top two loss scenarios, that path is the mechanism. This closes it and gives us the evidence our largest customer's audit clause requires"],
          ["Immutable backup tier", "Ransomware protection", "This changes our modelled recovery from six days to one and a half. At 1.6 million gross margin per day, that is 7 million of loss magnitude removed per event, against 600 thousand a year"],
          ["Application security programme", "We need to shift left", "The last four production defects of this class each cost roughly 40 days of engineering rework. Catching them at design costs about two days. Here is the arithmetic and here is the engineering leader who agrees with it"],
          ["Log retention extension", "Compliance requires it", "Median dwell in our sector is measured in weeks. Our retention is 30 days. In our last two investigations we could not answer the central question because the evidence had aged out. This is the difference between an investigation and a guess"]
        ]
      },
      {
        kind: "compare",
        title: "Two CISOs in the same budget cycle",
        left: {
          title: "Keeps the budget",
          items: [
            "Arrives with the portfolio ranked by loss reduction per currency unit, and volunteers the bottom 15 percent for cut before being asked",
            "Has already shown the CFO every number privately, so the meeting contains no surprises",
            "Distinguishes run-rate from investment and can state what breaks at each level of funding",
            "Names one thing they funded last year that did not work, and what they learned — this single behaviour buys more credibility than any slide",
            "Has a commercial colleague who will speak for two of the line items unprompted"
          ]
        },
        right: {
          title: "Loses it and does not know why",
          items: [
            "Presents a flat percentage increase justified by threat landscape evolution",
            "Argues that security cannot be measured, which finance hears as security cannot be evaluated",
            "Treats every line as essential, which forces finance to choose for them and they will choose worse",
            "Benchmarks against peer spending, inviting the reply that peers are not our shareholders",
            "Has never given anything back voluntarily, so is not believed when they say a cut is genuinely dangerous"
          ]
        }
      },
      {
        kind: "callout",
        title: "What to do when the cut is real",
        body: "When you must cut, cut visibly and structurally rather than evenly. Across-the-board reductions preserve the org chart and quietly degrade every capability below its threshold of usefulness — you end up with five functions that all half-work, which is worse than four that work. Instead: name the capability you are stopping, write a risk acceptance memo for the exposure it leaves, get it signed by the executive who made the cut, and put it in the register with an expiry. This does three things. It makes the tradeoff real to the person making it, which sometimes reverses the decision on the spot. It protects you, accurately rather than defensively, because the record shows the choice was made consciously by someone with the authority. And it creates a queue with a documented exposure attached, which is the strongest possible position from which to ask for restoration when conditions improve."
      },
      {
        kind: "list",
        title: "The two mistakes that cost more than any line item",
        items: [
          "Spending your credibility on the wrong ask. You get a small number of requests per year that finance treats as non-negotiable claims. Spend them on the two or three that genuinely change your loss profile, and be visibly flexible on everything else. A CISO who fights equally hard for every line is a CISO whose objections carry no information.",
          "Never returning money. If you consistently spend to the last pound regardless of value, you are teaching finance that your number is an entitlement rather than an estimate. Hand back a genuine underspend once, loudly, with an explanation of why the need did not materialise. The credibility from that single act is worth more than the money, and it is remembered in the next cycle when you say something is genuinely necessary."
        ]
      }
    ],
    sources: [
      { label: "The Open Group, Open FAIR (O-RT, O-RA)", note: "The only defensible route to the unit-economics argument. Without a loss-reduction number, argument one is unavailable to you and you are left with the three weaker ones." },
      { label: "IANS Research and Artico Search, Security Budget Benchmark Report", note: "The main public benchmark for budget growth, spend as a share of IT budget and revenue, and allocation. Useful for orientation; treat peer benchmarking as the weakest argument in the room, because it invites the observation that peers are not your shareholders." },
      { label: "Douglas Hubbard and Richard Seiersen, How to Measure Anything in Cybersecurity Risk (2nd ed., 2023)", note: "Specifically the chapters on the value of information — how to decide which uncertainty is worth paying to reduce. This is the argument structure behind funding measurement rather than controls, which is often the higher-return spend." },
      { label: "Verizon, 2026 Data Breach Investigations Report", note: "31 percent of breaches beginning with software vulnerability exploitation and 48 percent involving ransomware. Use these to argue about allocation between prevention and response, not to argue about the total." },
      { label: "Mandiant / Google Cloud, M-Trends 2025", note: "The dwell time and discovery-source figures that make a detection headcount request legible in loss terms rather than in staffing terms." },
      { label: "NIST Cybersecurity Framework 2.0, GOVERN — GV.RM Risk Management Strategy (February 2024)", note: "Risk appetite and tolerance as explicit organisational statements. A documented appetite is what converts a budget argument from a preference contest into a comparison against an agreed standard." }
    ]
  },

  {
    id: "sg-hiring-signal",
    title: "Hiring: Signal, Noise, and the Questions That Discriminate",
    domain: "CISO Leadership",
    kind: "field-note",
    statement: "Most security interviews measure how much the candidate has read; almost none measure how they behave when they are wrong.",
    summary: "What actually predicts performance in security roles, the interview loop that surfaces it, the specific questions that separate operators from readers, and the credentials that carry less signal than their prominence suggests.",
    minutes: 22,
    mode: "motus",
    blocks: [
      {
        kind: "prose",
        title: "What you are actually selecting for",
        body: "Security work is unusual in that the job is mostly performed under incomplete information, in other people's systems, against decisions that were made by people who are no longer there. The attributes that predict success are therefore not primarily knowledge attributes. They are: the ability to reason from a system's actual behaviour rather than from its documentation; the willingness to say I do not know followed immediately by here is how I would find out; the instinct to ask who is affected by this before asking how do I fix it; and the capacity to change one's mind out loud in front of colleagues. Knowledge is a filter, not a predictor — it gets you into the population of plausible candidates and then stops being informative, because everyone left in the pool has it. The general personnel-selection literature makes the same point structurally: work samples and structured interviews carry meaningfully more predictive validity than unstructured conversation, and unstructured conversation is what most security loops actually run."
      },
      {
        kind: "table",
        title: "Signal and noise",
        headers: ["Observed", "What people read into it", "What it actually predicts"],
        rows: [
          ["Long certification list", "Deep knowledge", "Willingness to study and pass exams. Real, and orthogonal to judgement under pressure"],
          ["CTF ranking", "Offensive skill", "Genuine skill at bounded puzzles with a known solution. Predicts poorly for ambiguity, stakeholder work, and problems that have no solution"],
          ["Named a CVE or spoke at a conference", "Elite practitioner", "Communication ability and persistence. Both valuable; neither is operational judgement"],
          ["Tenure at a famous security company", "Rigour", "Exposure to good practice. Also, sometimes, an inability to operate without that company's tooling and budget"],
          ["Explains a past incident with specific self-criticism", "Modesty", "The strongest single positive signal available in an interview. It requires having been present, having been wrong, and having noticed"],
          ["Asks about the business before the architecture", "Not technical enough", "Almost always the opposite: it predicts the ability to prioritise, which is the scarcest attribute in the field"],
          ["Confident answer to a question outside their experience", "Breadth", "The strongest negative signal available. In an incident this person will be confidently wrong and will not flag it"]
        ]
      },
      {
        kind: "numbered",
        title: "The loop that produces signal",
        items: [
          "Work sample, always, and make it resemble the actual job. For a detection engineer: here is a real log sample and a real alert, tell me what you would conclude and what you would need next. For a leader: here are three competing priorities and a fixed budget, decide and defend. Take-homes cost you candidates with caregiving responsibilities; do it live and pay for the time if it exceeds an hour.",
          "One deep dive on something they actually built or ran, going three layers past the summary. Ask what broke, what they would do differently, and what they only understood a year later. Candidates who have genuinely operated something have inexhaustible detail at layer three; candidates who have supervised it run out at layer two.",
          "One structured ambiguity interview with the same scenario for every candidate and a written rubric. Same question, same order, scored independently before discussion. This is the single highest-value change most loops can make, and it costs nothing.",
          "One stakeholder simulation: an interviewer plays a product manager who wants to ship something unsafe, and does not yield to the first correct answer. You are watching for whether the candidate reaches for a conditional yes before reaching for a refusal.",
          "Independent written scoring before the debrief. If the panel discusses before submitting, you have measured the most confident interviewer's opinion and called it consensus.",
          "One explicit dissent slot in the debrief: someone is assigned to argue against the hire, regardless of their real view. Panels converge fast, and a designated dissenter is the cheapest available correction."
        ]
      },
      {
        kind: "list",
        title: "Questions that discriminate — and what you are listening for",
        items: [
          "Tell me about a control you removed or a rule you deleted. Why, and what happened after? — Listening for: whether they understand that controls have costs, and whether they measured the effect or just assumed it. Almost nobody has an answer, and the ones who do are usually excellent.",
          "Describe a time you were confidently wrong during an incident. How did you find out? — Listening for: whether the discovery came from them, from a colleague, or from consequences. All three are acceptable; not having an example is not.",
          "What is the most secure thing you have built that nobody uses, and why did nobody use it? — Listening for: awareness that adoption is part of the engineering problem rather than someone else's failure.",
          "Walk me through what you would check first if I told you an account might be compromised, and tell me why that order. — Listening for: reasoning about the order, not recall of a checklist. Follow up by removing their first tool and asking what they would do instead.",
          "What do you believe about security that most of your peers disagree with? — Listening for: whether an independent position exists at all, and whether they hold it with appropriate rather than total confidence.",
          "Something in your own work is currently insecure and you have decided not to fix it. What is it? — Listening for: honest prioritisation. Everyone has one. Candidates who claim otherwise are either inexperienced or performing.",
          "Here is a technology I am fairly sure you have not used. Reason out loud about how you would approach securing it. — Listening for: the process, and specifically whether they say I do not know this, here is how I would find out. This is the closest available proxy for the actual job."
        ]
      },
      {
        kind: "compare",
        title: "Two answers to the same question about a past incident",
        left: {
          title: "Hire",
          items: [
            "Names the specific technical mechanism, including the part that was their own team's mistake",
            "Distinguishes what they knew at the time from what is known now, without being prompted",
            "Describes a decision they made with incomplete information and stands by the reasoning while acknowledging the outcome was poor",
            "Credits a specific colleague for a specific insight",
            "Says what changed in the system afterwards, and whether it held"
          ]
        },
        right: {
          title: "Pass",
          items: [
            "Describes the incident from the outside, in the passive voice, with no decision they personally made",
            "Attributes the cause to another team, a vendor, or a user",
            "Has a polished narrative with no rough edges, which usually means it has been told many times and interrogated never",
            "Cannot say what would have detected it earlier",
            "Describes the remediation as a project that was completed, with no statement about whether it worked"
          ]
        }
      },
      {
        kind: "callout",
        title: "The hiring decision you will most regret",
        body: "Not the candidate who lacked a skill — skills are teachable and you will find out within a quarter. It is the technically outstanding candidate about whom two people on the panel had a vague reservation they could not articulate, and who was hired anyway because the technical bar was so clearly met. Those reservations are usually about how the person behaves when they are wrong or when they are contradicted, and that behaviour is the single most consequential attribute in a function whose work is done in incidents and in other people's systems. When a panel member says I cannot put my finger on it, do not dismiss it and do not accept it either. Send them back to find one specific observation that produced the feeling. If they can, weigh it heavily. If they genuinely cannot, discount it — because unarticulated discomfort is also where bias lives, and the discipline of demanding a specific observation is what separates a signal from a prejudice."
      },
      {
        kind: "checklist",
        title: "Loop hygiene",
        items: [
          "Every candidate for a role gets the same structured questions in the same order, with the same written rubric",
          "Scores are submitted in writing before any panel discussion happens",
          "At least one interviewer is outside the security function, assessing collaboration under disagreement",
          "The work sample is paid if it exceeds one hour, and can be completed inside a working day",
          "Somebody in the debrief is assigned to argue against the hire",
          "You can state, in one sentence, what this specific hire is expected to make different in twelve months — and that sentence was written before the first interview",
          "The rejection is delivered by a human, quickly, with one specific reason. Your reputation as an employer is built almost entirely on how you treat the people you do not hire"
        ]
      }
    ],
    sources: [
      { label: "Frank Schmidt and John Hunter, The Validity and Utility of Selection Methods in Personnel Psychology (Psychological Bulletin, 1998)", note: "The foundational meta-analysis establishing work samples and structured interviews as among the most predictive selection methods and unstructured interviews as substantially weaker. Read alongside the correction below." },
      { label: "Paul Sackett, Charlene Zhang, Christopher Berry and Filip Lievens, Revisiting Meta-Analytic Estimates of Validity in Personnel Selection (Journal of Applied Psychology, 2022)", note: "A major re-analysis that lowered many of the 1998 validity estimates by correcting range-restriction handling. The relative ordering largely survives: structure and work samples still beat unstructured conversation. Cite both, not just the flattering one." },
      { label: "Google re:Work — Guide to structured interviewing (rework.withgoogle.com)", note: "The practical implementation: same questions, defined rubrics, independent scoring before discussion. Free, specific, and directly transplantable to a security loop." },
      { label: "John Allspaw, Morgan Evans, Daniel Schauenberg — Debriefing Facilitation Guide (Etsy, 2016)", note: "The questioning technique behind the incident questions above — asking what someone expected to see, and what they were doing just before, rather than what went wrong." },
      { label: "Gary Klein, Sources of Power (MIT Press, 1998)", note: "Why expertise shows up as rapid pattern recognition and mental simulation rather than as recall. The basis for the reason-out-loud-about-something-unfamiliar question, which surfaces process rather than knowledge." },
      { label: "Daniel Kahneman, Olivier Sibony and Cass Sunstein, Noise (2021)", note: "The chapter on hiring: independent judgements aggregated beat discussion-first panels, because discussion propagates the most confident view rather than the most accurate one. This is the reason for written scoring before debrief." }
    ]
  },

  {
    id: "sg-leadership-reading-path",
    title: "The Reading Path for Security Leadership",
    domain: "CISO Leadership",
    kind: "reading",
    statement: "Read in this order and each work makes the next one land harder; read them at random and you will collect vocabulary instead of judgement.",
    summary: "An annotated, sequenced path through the literature that actually changes how a security leader thinks — what to read, in what order, why each matters, and roughly what it costs you in hours.",
    minutes: 45,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "How this path is constructed",
        body: "Five stages. The first establishes what is actually happening in the world, so that everything after is anchored in evidence rather than in vendor narrative. The second gives you the vocabulary of measurement, because a leader who cannot quantify cannot allocate. The third is about how complex systems fail, which is the intellectual core of the discipline and the part most security leaders never read. The fourth is command and decision under pressure. The fifth is the governance and disclosure layer that now determines a great deal of what a senior security role actually is. Read them in order. The annual reports in stage one should be re-read every year; almost everything else is read once and returned to. Total commitment is roughly one focused hour a week for a year, which is a smaller investment than a single certification and returns considerably more."
      },
      {
        kind: "numbered",
        title: "Stage 1 — What is actually happening (start here, re-read annually)",
        items: [
          "Verizon Data Breach Investigations Report, current edition. Two to three hours. Read the summary of findings, then the industry section for your own sector, then the incident classification patterns. The 2026 edition reports 31 percent of breaches beginning with software vulnerability exploitation — now ahead of stolen credentials — and 48 percent involving ransomware. Read it for the shape of the distribution rather than for individual figures, and note where the population is incident reports rather than the world.",
          "Mandiant M-Trends, current edition. Two hours. The complement to the DBIR: incident-response data rather than breach-report data, so it skews toward organisations that could afford Mandiant. The 2025 edition put global median dwell time at 11 days, with 26 days when an external party notified the victim against 10 for internal discovery. That single comparison is the most useful number in the report.",
          "CISA Known Exploited Vulnerabilities catalogue and Binding Operational Directive 22-01. One hour. Not a report but an operating instrument. Understand the inclusion criterion — evidence of active exploitation — and why it produces a fundamentally different queue than severity scoring does.",
          "MITRE ATT&CK, browsed rather than read. Two hours. Pick three techniques your organisation is genuinely exposed to and read the detection and mitigation guidance in full. Reading the whole matrix teaches nothing; reading three techniques deeply teaches how to think in terms of adversary behaviour rather than tooling."
        ]
      },
      {
        kind: "numbered",
        title: "Stage 2 — Measurement and decision (the stage that most changes your career)",
        items: [
          "Douglas Hubbard and Richard Seiersen, How to Measure Anything in Cybersecurity Risk, 2nd edition (2023). Eight hours. The most consequential book on this list for a leader. Its arguments — that everything relevant is measurable to some useful degree, that ordinal risk matrices actively destroy information, and that calibration is a trainable skill — will change how you run the function. Do the calibration exercises rather than reading past them.",
          "Jack Freund and Jack Jones, Measuring and Managing Information Risk: A FAIR Approach (2014). Six hours. The model in depth from its authors. Read the chapters on common analysis errors twice; the mistakes described there are the ones you will make in your first three analyses.",
          "The Open Group, Risk Taxonomy (O-RT) and Risk Analysis (O-RA) standards. Three hours. The normative definitions. Dry, and the document you need when your analysis and an auditor's disagree about what a term means.",
          "Daniel Kahneman, Olivier Sibony and Cass Sunstein, Noise: A Flaw in Human Judgment (2021). Eight hours. Why the same expert reaches different conclusions on different days, and why aggregating independent judgements beats discussing to consensus. Read it and then look at your own risk register and your own hiring debriefs with fresh discomfort.",
          "Philip Tetlock and Dan Gardner, Superforecasting (2015). Six hours. What distinguishes people who forecast well: granular probability, frequent small updates, and keeping score. The practical companion to Hubbard's calibration material."
        ]
      },
      {
        kind: "numbered",
        title: "Stage 3 — How complex systems fail (the stage most leaders skip, and should not)",
        items: [
          "Sidney Dekker, The Field Guide to Understanding Human Error, 3rd edition (2014). Six hours. The old view versus the new view of human error, and the local rationality principle: people do what makes sense given their goals, knowledge, and focus at the time. This is the intellectual foundation of every good post-incident review, and reading it will make your current review template look naive.",
          "Charles Perrow, Normal Accidents: Living with High-Risk Technologies (1984). Eight hours. Interactive complexity and tight coupling as the structural preconditions of catastrophe. Written about nuclear plants and chemical works, and it describes your cloud architecture exactly. The single most useful lens for evaluating whether a proposed system is safe to operate.",
          "Karl Weick and Kathleen Sutcliffe, Managing the Unexpected. Five hours. High-reliability organising: preoccupation with failure, reluctance to simplify, sensitivity to operations, commitment to resilience, deference to expertise. The best available description of what a mature security culture actually looks like from the inside.",
          "Google SRE Book, chapters on Managing Incidents, Postmortem Culture, and being on-call. Three hours, free online. The industry's operational translation of the above. The recursive separation of responsibilities model is the most-copied idea in modern incident command for good reason.",
          "Cloudflare's public post-incident reports, 2024 to 2026. Two hours. Read three of them consecutively, including the November 2025 outage report in which responders disclose that they initially believed they were under a hyper-scale DDoS, and then the Code Orange resilience plan that followed. This is what stage three looks like when practised by people who publish."
        ]
      },
      {
        kind: "numbered",
        title: "Stage 4 — Command, adversaries, and engineering depth",
        items: [
          "Gary Klein, Sources of Power: How People Make Decisions (1998). Six hours. Recognition-primed decision making: experts under time pressure do not compare options, they pattern-match and mentally simulate. Explains why tabletop exercises must test decisions rather than knowledge, and why experience is not substitutable by process.",
          "Ross Anderson, Security Engineering, 3rd edition (2020). Twenty hours, and you do not read it end to end. The reference work for the field. Read the chapters on the economics of security and on psychology and usability first — they are the ones that will change how you allocate resources.",
          "NIST SP 800-61r3, Incident Response Recommendations and Considerations (April 2025). Three hours. The structural break from Rev 2: incident response reframed as continuous risk management aligned to CSF 2.0, with preparation mapped to Govern, Identify and Protect. Use it to argue that readiness is programme budget.",
          "NIST Cybersecurity Framework 2.0 (February 2024). Three hours. Read GOVERN closely and skim the rest. GOVERN is the function that describes your actual job, and it is the one added in version 2 precisely because it was the gap."
        ]
      },
      {
        kind: "numbered",
        title: "Stage 5 — Governance, disclosure, and the frontier",
        items: [
          "SEC Release 33-11216, Cybersecurity Risk Management, Strategy, Governance and Incident Disclosure (2023), plus the Corporation Finance staff statement of 21 May 2024. Four hours including the adopting release preamble. If you work for or with a US public company, this is now part of your job description rather than background reading. The preamble's materiality discussion is the part that matters.",
          "NACD Director's Handbook on Cyber-Risk Oversight. Three hours. Read it to learn what your board has been told to expect from you. It is the frame they will judge your reporting against, which makes it more useful than anything written for CISOs.",
          "GDPR Articles 32 to 34, NIS2 Article 23, and DORA Article 19 with Delegated Regulation (EU) 2025/301, read in the original. Four hours. Read the actual text once. Every summary you have read, including the one in this library, compresses distinctions that matter — particularly the difference between awareness, classification, and determination as clock triggers.",
          "RAND Corporation, Securing AI Model Weights (Nevo, Lahav, Karpur, Bar-On, Bradley and Alstott, 2024). Five hours. The most rigorous public threat model for a genuinely new asset class, with a five-level security benchmark scaled against attacker capability up to and including top-tier state operations. Read it even if you have no AI systems, because it is a masterclass in how to build a threat model for something with no prior art.",
          "SLSA framework and the CISA Secure by Design principles. Three hours. Where supply chain assurance and vendor accountability are heading. Read them for the vocabulary you will need to make demands of suppliers that they cannot dismiss as bespoke."
        ]
      },
      {
        kind: "callout",
        title: "The discipline that makes reading pay",
        body: "Keep a single document with one entry per work: what it changed about how you operate, in one sentence, written within a week of finishing. Not a summary — a change. If you cannot write the sentence, either the work was not for you or you read it passively, and both are worth knowing. Over three years this becomes the most valuable document you own: it is a record of how your judgement was actually constructed, it is the material for mentoring the person who succeeds you, and it will tell you honestly which of these works earned their place. Mine has entries for perhaps a third of what I have read, and the fact that two thirds produced nothing is itself the most useful finding in it."
      },
      {
        kind: "quote",
        body: "the new view of human error",
        source: "Sidney Dekker, The Field Guide to Understanding Human Error — the framing that error is a symptom of trouble deeper inside the system, not a cause"
      }
    ],
    sources: [
      { label: "Verizon, Data Breach Investigations Report (annual; 2026 edition current)", note: "31 percent of breaches beginning with software vulnerability exploitation and 48 percent involving ransomware. The longest-running public incident dataset. Read the methodology section once so you understand what its population actually is." },
      { label: "Mandiant / Google Cloud, M-Trends (annual; 2025 edition cited above)", note: "11-day global median dwell time, 26 days for externally notified intrusions versus 10 for internal discovery, exploits at 33 percent of initial infection vectors. Drawn from Mandiant's own consulting engagements, which is both its strength and its selection bias." },
      { label: "Douglas Hubbard and Richard Seiersen, How to Measure Anything in Cybersecurity Risk, 2nd ed. (Wiley, 2023)", note: "The single most career-changing work on this list for a leader. Calibration training, Monte Carlo simulation, and a sustained empirical argument against risk matrices. Do the exercises." },
      { label: "Sidney Dekker, The Field Guide to Understanding Human Error, 3rd ed. (Ashgate, 2014)", note: "The local rationality principle and the old-view/new-view distinction. The foundation of any post-incident review that produces learning rather than blame." },
      { label: "Charles Perrow, Normal Accidents: Living with High-Risk Technologies (Basic Books, 1984)", note: "Interactive complexity and tight coupling as structural preconditions of catastrophe. Forty years old and the most accurate description of modern distributed systems you will read." },
      { label: "Ross Anderson, Security Engineering, 3rd ed. (Wiley, 2020)", note: "The field's reference work. Start with the economics and the psychology chapters; they change resource allocation decisions more than the cryptography chapters do." },
      { label: "NIST SP 800-61r3 (April 2025) and NIST Cybersecurity Framework 2.0 (February 2024)", note: "Read together. Rev 3 explicitly reframes incident response as continuous risk management mapped to CSF 2.0, with GOVERN as the function that describes senior security leadership." },
      { label: "RAND Corporation, Securing AI Model Weights: Preventing Theft and Misuse of Frontier Models (2024)", note: "Nevo, Lahav, Karpur, Bar-On, Bradley and Alstott. A five-level security benchmark scaled to attacker capability, built for an asset class with no prior art. The best available example of constructing a threat model from first principles." }
    ]
  },

  {
    id: "sg-calibrated-estimation",
    title: "Calibrated Estimation: The Drillbook",
    domain: "Risk & Governance",
    kind: "drillbook",
    statement: "Almost everyone is overconfident, almost everyone can be trained out of it in a few hours, and almost nobody does the training.",
    summary: "Three sets of exercises with answers — interval calibration, probability calibration, and the equivalent bet test — plus the scoring rules that tell you whether you are actually improving.",
    minutes: 38,
    mode: "novus",
    blocks: [
      {
        kind: "prose",
        title: "Why this comes before quantification",
        body: "A quantified risk model is a machine that converts estimates into decisions. If the estimates going in are overconfident — and untrained estimates almost always are, with people who state 90 percent confidence intervals typically capturing the truth far less than 90 percent of the time — then the machine converts overconfidence into decisions, wrapped in a presentation layer that makes it look measured. Calibration training fixes this and it is unusual among training interventions in that it works quickly and measurably. A few hours of feedback-driven practice moves most people substantially toward calibration, and the skill persists. Run these drills before you run a FAIR analysis, and record who has been calibrated so that your analyses can say so."
      },
      {
        kind: "numbered",
        title: "The method",
        items: [
          "For each question, give a 90 percent confidence interval — a lower and upper bound such that you believe there is a 90 percent chance the true value falls between them.",
          "Apply the absurdity test in both directions. Start with a range so wide it is obviously silly, then narrow each end until it stops feeling silly. Most people start too narrow and never test the other direction.",
          "Apply the equivalent bet test to each interval. See the drill below. This is the single technique that produces most of the improvement.",
          "Write down all answers before checking any of them. Checking as you go contaminates the later estimates.",
          "Score. On twenty questions at 90 percent, a calibrated estimator captures about eighteen. Sixteen or fewer means overconfident. Twenty out of twenty means underconfident, which is a real and separate failure — intervals so wide they cannot inform a decision.",
          "Repeat with a fresh set after a break. Most of the improvement appears between the first and third attempt, and it is visible in the score."
        ]
      },
      {
        kind: "table",
        title: "Drill 1 — Interval calibration. Give a 90 percent range for each, then score.",
        headers: ["#", "Question", "Answer"],
        rows: [
          ["1", "In what year did MITRE first publish the CVE list?", "1999"],
          ["2", "How many tactics are in the MITRE ATT&CK Enterprise matrix?", "14"],
          ["3", "Global median dwell time reported in M-Trends 2025, in days?", "11"],
          ["4", "Median dwell time in M-Trends 2025 when an external entity notified the victim, in days?", "26"],
          ["5", "Median dwell time in M-Trends 2025 when the adversary notified the victim, in days?", "5"],
          ["6", "GDPR Article 33 notification deadline to the supervisory authority, in hours?", "72"],
          ["7", "NIS2 Article 23 early warning deadline, in hours?", "24"],
          ["8", "NIS2 Article 23 final report deadline, in months?", "1 (3 if the incident is ongoing)"],
          ["9", "DORA initial major-incident notification deadline after classification, in hours?", "4"],
          ["10", "DORA outer limit for the initial notification measured from awareness, in hours?", "24"],
          ["11", "SEC Form 8-K Item 1.05 filing deadline after the materiality determination, in business days?", "4"],
          ["12", "HIPAA Breach Notification Rule outer limit for breaches affecting 500 or more individuals, in calendar days?", "60"],
          ["13", "NYDFS 23 NYCRR Part 500 deadline to notify the Superintendent of an extortion payment, in hours?", "24"],
          ["14", "CIRCIA statutory deadline for reporting a covered cyber incident to CISA, in hours?", "72"],
          ["15", "The EPSS prediction window, in days?", "30"],
          ["16", "Number of Functions in NIST Cybersecurity Framework 2.0?", "6"],
          ["17", "Year NIST Cybersecurity Framework 2.0 was published?", "2024"],
          ["18", "Percentage of breaches involving ransomware in the 2026 Verizon DBIR?", "48"],
          ["19", "Percentage of breaches beginning with software vulnerability exploitation in the 2026 DBIR?", "31"],
          ["20", "Percentage of intrusions with exploits as the initial infection vector in M-Trends 2025?", "33"]
        ]
      },
      {
        kind: "code",
        title: "Drill 2 — The equivalent bet test. Run this on interval 3 above before scoring.",
        lang: "text",
        body: "You have stated a 90% interval. Now choose between two prizes.\n\n  PRIZE A: You win 1,000 if the true value falls inside your stated\n           interval. Otherwise nothing.\n\n  PRIZE B: You spin a wheel with 100 equal segments. 90 are marked WIN.\n           You win 1,000 if it lands on WIN. Otherwise nothing.\n\nWhich do you prefer?\n\n  Prefer B  ->  You believe your interval is less than 90% likely to\n                contain the truth. It is too narrow. Widen it and\n                re-run the test.\n\n  Prefer A  ->  You believe your interval is more than 90% likely.\n                It is too wide. Narrow it and re-run.\n\n  Indifferent -> Your interval genuinely expresses 90% belief.\n                 Stop. That is the estimate.\n\nWHY THIS WORKS\nThe wheel converts an abstract confidence statement into a decision\nabout money, which recruits a completely different and considerably\nmore honest kind of reasoning. Most people discover on the first run\nthat they prefer the wheel — that is, that their stated 90% interval\nis not actually a 90% interval at all. That discovery, repeated a few\ntimes, is most of what calibration training does.\n\nRUN IT ON EVERY INTERVAL FOR YOUR FIRST THREE SESSIONS.\nAfter that it becomes internalised and you will do it silently."
      },
      {
        kind: "table",
        title: "Drill 3 — Probability calibration. State a probability from 50 to 100 percent that each is true, then score.",
        headers: ["#", "Statement", "True / False", "Why"],
        rows: [
          ["1", "Under GDPR the 72-hour clock runs from the moment the breach occurred.", "False", "It runs from awareness, not occurrence. Article 33(1)."],
          ["2", "SEC Item 1.05 requires filing within four business days of discovering the incident.", "False", "Four business days from the determination that it is material. The determination itself must be without unreasonable delay."],
          ["3", "The NIS2 24-hour early warning must contain a full impact assessment.", "False", "It need only indicate whether malicious activity is suspected and whether cross-border impact is possible. The detail comes at 72 hours."],
          ["4", "OFAC sanctions liability for facilitating a ransomware payment requires knowledge that the recipient was designated.", "False", "It is strict liability; a person can be civilly liable without knowing."],
          ["5", "A processor's breach does not start the controller's Article 33 clock.", "False", "The processor must inform the controller without undue delay under 33(2), and the controller's obligation follows from its own awareness."],
          ["6", "EPSS estimates the probability that a CVE will be exploited in the wild in the next 30 days.", "True", "That is the stated definition of the score."],
          ["7", "Inclusion in the CISA KEV catalogue requires evidence of active exploitation.", "True", "That is the defining inclusion criterion, which is why it produces a different queue than severity scoring."],
          ["8", "NIST SP 800-61r3 retains the four-phase incident response lifecycle from Revision 2.", "False", "Rev 3 restructures around CSF 2.0 with preparation under Govern/Identify/Protect and response under Detect/Respond/Recover."],
          ["9", "Under GDPR, notifying individuals is required whenever notifying the supervisory authority is required.", "False", "Article 34 applies a higher threshold: likely to result in a high risk to rights and freedoms."],
          ["10", "Under DORA the initial major-incident report is due within 72 hours.", "False", "72 hours is the intermediate report. Initial is 4 hours from classification, and no later than 24 hours from awareness."],
          ["11", "An Item 8.01 Form 8-K filing discharges the duty to determine materiality.", "False", "The staff statement of 21 May 2024 is explicit that the determination duty continues."],
          ["12", "Mandiant M-Trends 2025 found median dwell time increased from the prior year.", "True", "It rose from 10 days to 11 days."]
        ]
      },
      {
        kind: "code",
        title: "Scoring drill 3 — the Brier score",
        lang: "text",
        body: "For each statement, you gave a probability p that it is TRUE.\nLet o = 1 if the statement is true, 0 if false.\n\n  Brier score = mean over all items of (p - o)^2\n\nLower is better. Zero is perfect.\n\n  0.00        perfect\n  below 0.10  strong\n  0.10 - 0.20 good, typical of a calibrated practitioner\n  0.25        the score you get by answering 50% to everything\n  above 0.25  you are worse than guessing, which means you are\n              confidently wrong rather than merely uninformed\n\nWORKED EXAMPLE, three items:\n  Item 1: you said 20% true. It is FALSE (o=0).  (0.20-0)^2 = 0.04\n  Item 6: you said 85% true. It is TRUE  (o=1).  (0.85-1)^2 = 0.0225\n  Item 10: you said 70% true. It is FALSE (o=0). (0.70-0)^2 = 0.49\n\n  Brier = (0.04 + 0.0225 + 0.49) / 3 = 0.184\n\nItem 10 is doing almost all of the damage. That is the point of the\nscore: it punishes confident wrongness far more than uncertainty, which\nis exactly the incentive you want in a risk estimator.\n\nTHE DECOMPOSITION THAT MATTERS\nTake every item where you said 70%. Across a large enough set, roughly\n70% of them should be true. If only 45% are, you are overconfident at\nthat level specifically — and this is far more actionable than a single\naggregate score, because most people are well calibrated at 60% and\nbadly calibrated at 90%."
      },
      {
        kind: "checklist",
        title: "Running this as a programme rather than an afternoon",
        items: [
          "Every person who supplies inputs to a risk quantification completes at least three calibration sessions before their estimates are used",
          "Calibration status is recorded in the analysis file alongside each estimate, so a reader can weight the inputs",
          "Real forecasting questions about your own organisation are added to the drill set, with resolution dates — how many KEV vulnerabilities will be open past SLA on 31 March, how many declared incidents next quarter",
          "Estimates are recorded before outcomes and scored publicly. The scoring must be visibly safe, or people will hedge to protect themselves and you will destroy the signal",
          "Brier scores are decomposed by confidence band, because aggregate scores hide the specific band where a person is overconfident",
          "Re-calibrate annually. The skill decays, particularly for people who have not made a scored estimate in months",
          "Leaders go first and publish their own scores. If the CISO will not be scored in public, nobody else will either"
        ]
      },
      {
        kind: "callout",
        title: "The failure mode of a calibration programme",
        body: "Using scores to evaluate people. The moment a calibration score appears in a performance review, everyone widens their intervals to protect themselves and the entire apparatus becomes useless — you have converted a measurement instrument into an incentive system, and it will faithfully produce the behaviour you incentivised rather than the accuracy you wanted. Calibration scores are diagnostic, they belong to the individual, and the aggregate belongs to the programme. What you may legitimately do is require calibration training as a prerequisite for supplying inputs to decisions above a threshold, and record in the analysis whether the estimators were calibrated. That distinction — training as a prerequisite, scoring as a private diagnostic — is what keeps the programme honest, and it is the difference between an organisation that learns to estimate well and one that learns to look like it does."
      }
    ],
    sources: [
      { label: "Douglas Hubbard and Richard Seiersen, How to Measure Anything in Cybersecurity Risk, 2nd ed. (Wiley, 2023)", note: "The source of the calibration method used here, including the equivalent bet test and the absurdity test. The companion spreadsheets at howtomeasureanything.com/cybersecurity are free and sufficient to run the whole programme." },
      { label: "Douglas Hubbard, How to Measure Anything, 3rd ed.", note: "The general-purpose original, with the fuller treatment of calibration training and the evidence that it improves quickly and durably with feedback. Read the calibration chapter even if you skip the rest." },
      { label: "Glenn W. Brier, Verification of Forecasts Expressed in Terms of Probability (Monthly Weather Review, 1950)", note: "The original scoring rule, from meteorology, which is the field that has been keeping score on probabilistic forecasts longest and is correspondingly the best calibrated." },
      { label: "Philip Tetlock and Dan Gardner, Superforecasting: The Art and Science of Prediction (Crown, 2015)", note: "What distinguishes accurate forecasters: granularity, frequent small updates, and keeping score. The IARPA Good Judgment Project work behind it is the strongest evidence that forecasting skill is trainable rather than innate." },
      { label: "Daniel Kahneman, Olivier Sibony and Cass Sunstein, Noise (2021)", note: "Why independent judgements should be collected before discussion, and why aggregating them beats consensus. Directly applicable to how you gather estimates for a risk model." },
      { label: "FIRST, Exploit Prediction Scoring System (first.org/epss)", note: "The source for question 15 and a live example of a calibrated probabilistic model in security. Its published performance analysis is a good model for how to evaluate any predictive claim." },
      { label: "Mandiant / Google Cloud, M-Trends 2025, and Verizon 2026 DBIR", note: "Sources for the dwell time, infection vector, and breach composition answers in drills 1 and 3. Verify each against the current edition before running the drill, because these figures move annually and a stale answer key teaches the wrong lesson." }
    ]
  }
];
