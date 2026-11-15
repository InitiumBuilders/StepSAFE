import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-incident",
  act: "ACT III — FIRE",
  order: 5,
  title: "THE HOUR THE BUILDING BURNS",
  subtitle: "Incident command, crisis decision-making, and the engineering of recovery",
  essence: "ember",
  thesis:
    "A crisis does not test your tooling. It tests whether a group of tired, frightened, competent people can hold one shared picture of reality long enough to make a small number of irreversible decisions correctly.",
  statement:
    "Command is a role, not a rank — and the person who found the intrusion is almost never the person who should run it.",
  why:
    "Almost nobody fails an incident on technique. They fail it on structure: two people quietly running two different investigations, a containment action taken by someone who did not know what it would burn, an executive update that becomes a securities problem, a restore that turns out to have no restore. Mandiant put global median dwell time at eleven days in 2024, and at twenty-six days when someone outside the organization had to be the one to tell you. Sophos found in 2025 that only about half of encrypted organizations restored from backup — the lowest share in six years — and that recovery inside a week is now the majority outcome only because the ones who cannot recover in a week tend to be unable to recover for a month. The gap between those two outcomes is almost never a product. It is whether somebody was in command, whether the evidence survived, whether the backups were actually immutable, and whether the first hour of communication created options or destroyed them. This chapter teaches the hour the building burns, and the six months after.",
  outcomes: [
    "Stand up a functioning incident command structure inside ten minutes with a named commander, a scribe, a comms lead, and a single-writer rule that survives contact with executives.",
    "Make the eradicate-now versus observe-longer decision with explicit criteria, a deadline, and an escalation trigger instead of instinct.",
    "Acquire and preserve volatile evidence under time pressure without destroying the attribution you will need six months later in front of a regulator.",
    "Run the ransomware payment decision as a structured, parallel, legally-bounded process — including OFAC exposure, negotiation posture, and the restore-time reality gap.",
    "Hit the real regulatory clocks — SEC Item 1.05, GDPR Article 33, NIS2, DORA — without over-disclosing, under-disclosing, or creating a discoverable record you cannot defend.",
    "Design and run a tabletop that finds a genuine gap rather than confirming the plan you already wrote.",
    "Write a causal analysis, not a timeline, and write it so that people who were not there actually read it and change something.",
    "Plan and rehearse recovery from a full identity-provider compromise, where the thing you would normally authenticate with is the thing you no longer trust."
  ],
  prereq: ["ch-detection"],
  unitUnlock: "u-anchor",
  sources: [
    {
      label: "NIST SP 800-61r3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management (April 2025)",
      note: "Supersedes the 2012 r2 and deliberately kills the four-phase lifecycle picture. Use it for the argument that incident response is a risk-management property of the whole CSF 2.0 wheel, not a fire drill bounded by three days. Its two profile tables — preparation plus lessons learned, and detect/respond/recover — are the cleanest existing map of who owes what before an incident."
    },
    {
      label: "Google SRE, Incident Management Guide and the Managing Incidents chapter of the SRE Book",
      note: "Origin of the IC, operations lead, communications lead split and the three Cs — coordinate, communicate, control. Its single most useful rule is that the operations team is the only group permitted to modify the system during an incident. Steal that verbatim."
    },
    {
      label: "Building Secure and Reliable Systems, Chapter 17: Crisis Management (Google, O Reilly)",
      note: "The best free writing on why a security incident is not an outage: the adversary reacts to your response. Read it for operational security during response, out-of-band comms on freshly built hardware, parallel forensics and hunting workstreams, and the catalogue of ways teams accidentally tell the attacker they have been found."
    },
    {
      label: "CISA #StopRansomware Guide (joint CISA, FBI, NSA, MS-ISAC)",
      note: "The response checklist is the closest thing to a national standard for the first four hours of a ransomware event, including the isolate-before-power-off ordering that preserves memory. Good to hand directly to an infrastructure team that has never done this."
    },
    {
      label: "Sophos, The State of Ransomware 2025 (3,400 organizations, 17 countries)",
      note: "Best available survey numbers on the payment decision: roughly half paid, average payment about 85 percent of the initial demand, mean recovery cost excluding ransom around 1.53 million dollars, backup-based recovery at a six-year low. Use it to argue with executives who believe paying is fast."
    },
    {
      label: "Mandiant M-Trends 2025",
      note: "Dwell time by notification source is the number that changes budgets: eleven days median overall, twenty-six when an outside party tells you, five when the adversary tells you by encrypting things. Also the 2024 shift that put stolen credentials into second place as an initial vector.",
      url: "https://cloud.google.com/blog/topics/threat-intelligence/m-trends-2025",
      checked: "2026-11-04",
    },
    {
      label: "Verizon Data Breach Investigations Report, current edition",
      note: "Use for base rates when you are challenged on whether your scenario is realistic — particularly third-party and supply-chain involvement, and the steady prominence of edge-device exploitation. Read the methodology section before you quote a percentage at a board."
    },
    {
      label: "OFAC, Updated Advisory on Potential Sanctions Risks for Facilitating Ransomware Payments (Sept 2021, updating the Oct 2020 advisory)",
      note: "The controlling document for the payment decision in the United States. Civil liability is strict — intent is not a defense — and a self-initiated, timely and complete report to law enforcement plus ongoing cooperation is named as a significant mitigating factor. Print it and keep it in the crisis binder."
    },
    {
      label: "SEC Form 8-K Item 1.05 and the Division of Corporation Finance statement of 21 May 2024",
      note: "Four business days from the materiality determination, not from discovery, and the determination must be made without unreasonable delay. The 2024 staff statement pushed non-material incidents to Item 8.01 — the distinction is the whole exam question."
    },
    {
      label: "EU NIS2 Directive Article 23 and DORA Article 19 with the major-incident reporting RTS",
      note: "The clocks that beat GDPR: NIS2 at 24-hour early warning, 72-hour notification, one-month final report; DORA at four hours from classification as major and never more than 24 hours from awareness. If you operate in both regimes, DORA sets the binding constraint."
    },
    {
      label: "CrowdStrike, External Technical Root Cause Analysis — Channel File 291 (6 August 2024)",
      note: "A vendor post-incident report honest enough to be teachable: a template type defining twenty-one input fields against sensor code supplying twenty, a missing runtime array bounds check, a content validator logic error, and no staged deployment. The best available text for teaching that availability is a security property."
    },
    {
      label: "Okta Security, Unauthorized Access to Okta Support Case Management System: Root Cause and Remediation (Nov 2023)",
      note: "A service account credential saved into an employee personal Google account through Chrome profile sign-in, and a two-week detection gap caused by the file-access path emitting a different log event than the case-view path. The single best teaching case for logging blind spots and for why your customer told you first."
    },
    {
      label: "US House Energy and Commerce and Senate Finance testimony of UnitedHealth Group CEO Andrew Witty on the Change Healthcare attack (May 2024)",
      note: "Primary-source account of a Citrix remote access portal without multi-factor authentication, nine days of adversary presence before encryption, a 22 million dollar payment personally decided by the CEO, and a re-extortion afterward. Use it whenever someone claims paying ends the incident."
    },
    {
      label: "In re Capital One Consumer Data Security Breach Litigation (E.D. Va. 2020), In re Rutter s (M.D. Pa. 2021), Wengui v. Clark Hill (D.D.C. 2021)",
      note: "Three rulings that ordered incident-response forensic reports produced in discovery despite counsel engagement. Read them before you assume the word privileged at the top of a document does anything. They are the reason your investigation record must be written to be read by a hostile lawyer."
    }
  ],
  pages: [
    {
      id: "ch-incident-page-command",
      title: "THE COMMAND",
      credential: "Certified in Security Incident Command — StepSAFE Praxis",
      summary:
        "How a scattered group of responders becomes a single organism with one picture of reality, one writer, one commander, and a deliberate policy about what the adversary is allowed to learn from your behaviour. This Page is the difference between an incident and a mess.",
      competencies: [
        "Declare an incident deliberately, in writing, with a stated objective and a severity that maps to a defined response posture",
        "Stand up incident command roles — commander, operations lead, communications lead, scribe, legal liaison — and defend the boundaries between them",
        "Apply the single-writer rule to both the incident record and the production environment",
        "Maintain response operational security so the adversary does not learn they have been discovered",
        "Run a shift handoff that transfers context, not just credentials, and rotate people before their judgement degrades"
      ],
      seal: "seal-command-ember",
      steps: [
        {
          id: "ch-incident-declare",
          kind: "construct",
          title: "Declaration Is a Decision",
          statement:
            "An incident begins when somebody declares it, not when the adversary arrives — and the cost of declaring one you did not need is always lower than the cost of the four-hour hole in your timeline.",
          minutes: 18,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body:
                "Most organizations have an incident response plan and no incident response trigger. The plan describes what a well-run incident looks like; nothing in it tells a tired analyst at 02:40 what specific observation obliges them to stop investigating and start commanding. So the default happens instead: the analyst keeps pulling the thread, the thread gets more interesting, and forty minutes later there is no scribe, no clock, no legal notification, and no record of who decided what. That gap becomes the part of the timeline you cannot reconstruct, and it is the part opposing counsel will spend a deposition on."
            },
            {
              kind: "principle",
              title: "The declaration law",
              body:
                "Declaring is cheap and reversible. Not declaring is expensive and irreversible, because the evidence, the clock, and the shared record only start existing at the moment of declaration. When in doubt, declare and downgrade."
            },
            {
              kind: "prose",
              body:
                "NIST SP 800-61r3, published in April 2025, deliberately abandoned the tidy four-phase lifecycle that r2 had taught since 2012. The reason matters: the four-phase picture implied that incident response is a bounded episode that starts at detection and ends at recovery. In practice, response quality is almost entirely determined by governance decisions made months earlier — who is allowed to command, what the retainer covers, whether the logs exist, whether legal has pre-cleared a holding statement. r3 maps incident response across all six CSF 2.0 Functions precisely so that the preparation work has an owner before the pager fires."
            },
            {
              kind: "table",
              title: "A severity ladder that actually changes behaviour",
              headers: ["Severity", "Trigger example", "Who is woken", "Posture change"],
              rows: [
                [
                  "SEV-4 Observation",
                  "Single endpoint with commodity malware, contained by EDR, no credential exposure",
                  "On-call analyst only",
                  "Ticket. No incident record. No clock."
                ],
                [
                  "SEV-3 Incident",
                  "Confirmed unauthorized access to one system, or one user credential confirmed abused",
                  "On-call analyst plus security manager",
                  "Incident record opened, scribe named, evidence preservation begins"
                ],
                [
                  "SEV-2 Major",
                  "Lateral movement confirmed, or any access to an identity provider, backup system, or production data store",
                  "IC, legal, CISO, infrastructure lead",
                  "Command structure stood up, retainer IR firm notified, out-of-band comms channel opened"
                ],
                [
                  "SEV-1 Crisis",
                  "Encryption or destruction in progress, exfiltration of regulated data confirmed, or loss of trust in the identity plane",
                  "Executive team, general counsel, board chair notified within the hour",
                  "Crisis management activated, disclosure committee convened, external counsel engaged, regulatory clocks assumed running"
                ]
              ]
            },
            {
              kind: "callout",
              title: "The trigger nobody writes down",
              body:
                "Add one non-technical trigger to your severity ladder: any time two or more people are independently investigating the same anomaly without a shared record, that is a SEV-3 by definition. Duplicated uncoordinated investigation is the earliest reliable symptom of an incident that is about to be handled badly."
            },
            {
              kind: "checklist",
              title: "The declaration itself, written not spoken",
              items: [
                "One line stating what is believed true and the confidence level — believed, confirmed, or suspected.",
                "The severity and the one observation that justifies it.",
                "The named incident commander, in the present tense, by name not by role.",
                "The current objective, singular. Not a list. Example: determine whether the adversary has access to the identity provider.",
                "The time, in UTC, with the source of that time stated.",
                "The channel where the incident record lives and the statement that it is the only authoritative record."
              ]
            }
          ],
          awards: ["award-first-declaration", "award-clock-started"],
          glossary: ["incident-declaration", "severity-ladder", "incident-record", "response-posture"]
        },
        {
          id: "ch-incident-command-roles",
          kind: "lesson",
          title: "Incident Command, Adapted from People Who Run Into Fires",
          statement:
            "The Incident Command System works in cyber for exactly one reason: it separates the person deciding from the person doing, and a crisis destroys anyone who tries to be both.",
          minutes: 34,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "The Incident Command System came out of Californian wildfire response in the 1970s, where multiple agencies with different radios, ranks and vocabularies kept arriving at the same fire and producing less than the sum of their parts. Google adapted it into IMAG — Incident Management at Google — and the SRE literature reduced it to three verbs: coordinate, communicate, control. The adaptation to security is not cosmetic. Google's own crisis management chapter makes the load-bearing distinction explicit: in a reliability outage you fix first and understand later, because the failure is indifferent to you. In a security incident the failure is an intelligent agent that changes behaviour when it notices you, which means investigation has to substantially precede correction. Every structural choice below follows from that one asymmetry."
            },
            {
              kind: "table",
              title: "The roles, and what each one is forbidden to do",
              headers: ["Role", "Owns", "Is explicitly forbidden from"],
              rows: [
                [
                  "Incident Commander",
                  "The objective, the severity, the decision log, who holds every other role, and the authority to say stop",
                  "Typing into production, running queries, or being the deepest technical expert on the system in question"
                ],
                [
                  "Operations Lead",
                  "All changes to the environment. The ops lead is the only path by which the system is modified during the incident",
                  "Talking to executives, updating stakeholders, or accepting side-channel requests from anyone"
                ],
                [
                  "Communications Lead",
                  "Every outbound and inbound message: exec updates, status page, customer notice drafts, the inbound question queue",
                  "Speculating about cause, giving numbers that are not in the incident record, or promising a restoration time"
                ],
                [
                  "Scribe",
                  "The incident record: observations with timestamps and sources, decisions with the reasoning available at the time, and open questions",
                  "Participating in the investigation. A scribe who starts investigating stops being a scribe within four minutes"
                ],
                [
                  "Legal Liaison",
                  "Privilege posture, regulatory clocks, evidence retention obligations, law enforcement contact, and the decision on external counsel",
                  "Editing technical findings to make them sound better. That converts a defensible record into an indefensible one"
                ],
                [
                  "Planning Lead",
                  "The next shift, the eviction plan, the restore sequencing, and the resources that will be needed in twelve hours",
                  "Being consumed by the current hour. If planning is doing tactical work, nobody is thinking about tomorrow"
                ]
              ]
            },
            {
              kind: "compare",
              title: "Why a security incident is not an outage",
              left: {
                title: "Reliability outage",
                items: [
                  "The failure does not adapt. Acting early is almost always correct.",
                  "Mitigation and understanding can run in either order.",
                  "Broad internal broadcast is helpful; more eyes, more hypotheses.",
                  "Rollback is usually safe and usually sufficient.",
                  "Success is measured in minutes to mitigation."
                ]
              },
              right: {
                title: "Security incident",
                items: [
                  "The failure watches you and changes. Acting early can convert a known adversary into an unknown one.",
                  "Investigation must substantially precede correction or eradication is partial by construction.",
                  "Broad internal broadcast may reach the adversary, who may hold a mailbox or a chat token.",
                  "Rollback restores the vulnerability and often the persistence with it.",
                  "Success is measured in completeness of eviction and defensibility of the record."
                ]
              }
            },
            {
              kind: "numbered",
              title: "Span of control, and how it breaks",
              items: [
                "One human coordinates between three and seven other humans well. Beyond seven the commander becomes a message queue with a person attached.",
                "The failure is not that the eighth person is ignored. It is that the commander starts batching — answering in clusters — and latency on the one urgent item rises to the average latency of the batch.",
                "The fix is a layer, not more effort. Split into workstreams with named leads: forensics, hunting, identity, restoration, external. The IC then coordinates five leads rather than twenty-five responders.",
                "Each workstream lead runs their own span. A hunting lead with nine hunters has the same problem the IC had, one level down.",
                "Add the layer before you need it. Restructuring a bridge under load costs about twenty minutes of total confusion, which is why nobody does it at hour six when they should have done it at hour two."
              ]
            },
            {
              kind: "quote",
              body:
                "The operations team should be the only group modifying the system during an incident. Everything else is a suggestion routed through the operations lead.",
              source: "Google SRE, Incident Management Guide — the rule that prevents two people fixing the same thing in opposite directions"
            },
            {
              kind: "callout",
              title: "Deputies exist so that command can be handed over",
              body:
                "Name a deputy IC at declaration, not at hour twelve when the IC is slurring. The deputy's real job is to be the person who can say the IC needs to sleep and be obeyed. Without a named deputy, the only person who can remove an exhausted commander is the exhausted commander."
            }
          ],
          awards: ["award-command-structure", "award-span-of-control"],
          glossary: ["incident-commander", "operations-lead", "communications-lead", "span-of-control", "scribe-role"]
        },
        {
          id: "ch-incident-who-commands",
          kind: "drill",
          title: "The Best Engineer Trap",
          statement:
            "Putting your deepest expert in command is the most natural and most expensive mistake available to you in the first ten minutes.",
          minutes: 22,
          respect: 120,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "This drill exists because the instinct is unanimous and wrong. The person who found it has the most context, so they should run it. But command is a role that consumes attention continuously — every executive question, every resource request, every side conversation lands on the commander. Attention is exactly the resource your best investigator needs to keep the thread. Within an hour of being made IC, your expert has stopped investigating and become a mediocre project manager with unique knowledge locked in their head."
            },
            {
              kind: "metric",
              title: "What the first hour is worth",
              items: [
                "Mandiant put 2024 global median dwell time at eleven days, and at five days when the adversary is the one who tells you — which is a way of saying that by the time you feel urgency, they have usually finished the part they cared about.",
                "Dwell time when an external party notifies you: twenty-six days median. Your outside notification pathway is the single least-rehearsed input in most programs.",
                "Okta's October 2023 support-system compromise ran from roughly 28 September to 13 October before it was pinned down — and it was pinned down because BeyondTrust handed Okta a suspicious IP address, not because internal telemetry surfaced it."
              ]
            },
            {
              kind: "principle",
              title: "The separation law",
              body:
                "The commander must be able to say I do not know and go find out. An expert commander cannot say that about their own system, so they answer from memory under pressure, and the incident inherits their blind spots as facts."
            },
            {
              kind: "callout",
              title: "The counter-case, stated honestly",
              body:
                "In a team of three at 03:00, role separation is a fiction and pretending otherwise wastes the one thing you have. The minimum viable structure at that size is: one person types, one person writes the record and talks to the outside, and you explicitly agree which is which out loud. Scale the structure to the staffing you actually have — but never let the person typing also be the person deciding whether to type."
            }
          ],
          drill: {
            id: "ch-incident-drill-who-commands",
            scene:
              "02:40 local. EDR raises a high-confidence Kerberoasting alert on a member server, and within four minutes a service account with delegated rights to the finance file cluster authenticates successfully from a jump host in a jurisdiction where you have no offices and no staff. Priya, your strongest detection engineer, found it, wrote the detection two years ago, and is the only person who genuinely understands the authentication pipeline end to end. She is already six terminals deep. Six responders are on the bridge. The VP of Infrastructure has just joined and is asking whether he should shut down the file cluster. Your phone shows a missed call from the CFO, who is awake for unrelated reasons.",
            clock: "You have roughly ten minutes before the bridge either becomes a command structure or becomes a conference call.",
            pressure:
              "Everyone on the bridge is looking at Priya. She is the most credible person present and she is the one person who must not be interrupted.",
            prompt: "You are the on-call security manager. What is your first structural move?",
            options: [
              {
                id: "ch-incident-drill-who-commands-opt-priya",
                label: "Make Priya the incident commander — she has the most context and the most credibility.",
                detail: "Let her direct the response while continuing to investigate, since she understands the auth pipeline best.",
                score: -2,
                outcome:
                  "Within forty minutes Priya is fielding the CFO, arbitrating whether to shut the cluster, and half-updating a doc nobody else can read. Her terminals go cold. The pivot into the finance file share — visible in the data she was three commands away from pulling — is found four hours later by an analyst who happened to look.",
                ripple:
                  "You converted your best investigator into your worst project manager and lost the only person who could have caught the pivot. Worse, because she is both commander and expert, nobody on the bridge feels able to challenge a technical assertion she makes while exhausted."
              },
              {
                id: "ch-incident-drill-who-commands-opt-command",
                label:
                  "Take IC yourself. Name Priya operations lead with a protected workspace, name a scribe, name a comms lead to absorb the VP and the CFO, declare in writing with one objective.",
                detail:
                  "The written declaration states severity, the single current objective — determine whether the identity plane is compromised — and that all environment changes go through the operations lead.",
                score: 3,
                isBest: true,
                outcome:
                  "Priya keeps her attention. The VP's shutdown question is routed to you as a decision with a stated cost, not executed as a reflex. The scribe captures the service account name, the source address and the timestamps while they are still in someone's scrollback. The CFO gets a two-line update from a named human and stops calling.",
                ripple:
                  "Because the declaration is written and timestamped, the regulatory clock, the evidence hold and the retainer notification all have a defensible start. Three months later, when counsel reconstructs the night, the record starts at 02:44 rather than at whenever someone remembered to open a document."
              },
              {
                id: "ch-incident-drill-who-commands-opt-wait",
                label: "Hold off on declaring for thirty minutes to gather more signal, keeping it in the detection channel.",
                detail: "Avoid a false alarm and the executive noise that comes with a formal declaration.",
                score: -3,
                outcome:
                  "The thirty minutes become ninety. Nobody is writing anything down, the VP quietly reboots the member server to see if it clears, and the volatile memory containing the injected process goes with it. When you do declare, the first hour of the incident exists only as fragments in six people's chat scrollback.",
                ripple:
                  "Undeclared incidents have no clock, no scribe, no evidence hold and no legal trigger. The four-hour hole is discoverable, and it will be characterised as delay rather than caution. Every hour of undeclared investigation is an hour of unmanaged legal exposure."
              },
              {
                id: "ch-incident-drill-who-commands-opt-retainer",
                label: "Declare, then hand command to the retained incident response firm as soon as they answer.",
                detail: "They do this every week; you do it twice a year. Let the professionals run it.",
                score: 1,
                outcome:
                  "Calling the retainer at 02:45 is right and you will be glad you did. But their engagement lead arrives at 04:20, has no idea which systems generate revenue, cannot decide whether the file cluster can go dark, and spends the first ninety minutes asking questions your scribe should already have answered.",
                ripple:
                  "Outsourced command becomes outsourced accountability, and regulators do not accept it. The firm is a workstream — usually forensics and malware analysis — reporting to your commander. Retainers are worth their price mostly because they let you preserve your own people for the decisions only insiders can make."
              }
            ],
            debrief:
              "The correct move is not that you personally are a better commander than Priya. It is that command and depth compete for the same scarce resource — sustained attention — and only one of them can be delegated to somebody less specialised. You can be an adequate commander tonight; nobody else can be Priya. The written declaration does four things at once that are easy to miss: it starts the evidence hold, it starts the legal clock on your own terms, it establishes a single authoritative record before six people's memories diverge, and it converts the VP's shutdown reflex into a decision with a named owner. Note also what the best option does not do: it does not answer the technical question. Ten minutes in, you should have structure and one objective, not a hypothesis.",
            principle:
              "Put your deepest expert where depth compounds, and put command where interruption lands. Whoever absorbs the executives is doing real work, and it should never be the person holding the thread."
          },
          awards: ["award-first-command", "award-expert-protected"],
          glossary: ["incident-commander", "deputy-ic", "retainer-engagement", "attention-budget"]
        },
        {
          id: "ch-incident-single-writer",
          kind: "lab",
          title: "One Record, One Writer, One Hand on the System",
          statement:
            "Two people editing the truth produces two truths; two people editing production produces an outage inside an incident.",
          minutes: 38,
          respect: 165,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "The single-writer rule has two halves and teams usually adopt only the first. The record half: exactly one person, the scribe, writes to the incident record; everyone else contributes by speaking or by posting into a channel the scribe reads. The system half: exactly one path modifies the environment, through the operations lead. Skipping the second half produces the classic compound failure — an analyst kills a process to be safe while a forensics contractor is mid-acquisition on the same host, and now you have neither the evidence nor the certainty that the process is gone."
            },
            {
              kind: "prose",
              body:
                "Build the record as three separate sections that are never merged, because they decay at different rates and are read by different people. Observations are facts with a source and a timestamp, and they only get appended. Decisions record what was chosen, by whom, and — this is the part everyone omits — what was known at the time, so that a later reader can distinguish a bad decision from an unlucky one. Open questions is the section that keeps the incident honest, because an incident with no open questions is an incident where somebody has stopped looking."
            },
            {
              kind: "code",
              title: "The incident record skeleton, kept in a file, not a chat thread",
              lang: "markdown",
              body:
                "# INC-2026-0814 — suspected identity plane compromise\nSTATUS: active   SEV: 2   IC: a.okafor   DEPUTY: r.lindqvist\nSCRIBE: m.tan   OPS LEAD: p.raghavan   COMMS: j.ellery   LEGAL: s.abadi\nRECORD OPENED: 2026-08-14T02:44Z (source: bridge, ntp-synced laptop)\nCURRENT OBJECTIVE: determine whether the adversary holds valid credentials\n  or tokens for the identity provider. Nothing else until answered.\n\n## OBSERVATIONS (append only, never edit, never delete)\n- 02:41Z  EDR alert 88213, host FIN-APP-07, kerberoast pattern.\n           source: edr console, screenshot saved evid/0001.png\n- 02:45Z  svc-fincluster interactive logon from 203.0.113.44.\n           source: domain controller 4624 event, exported evid/0002.evtx\n- 03:02Z  203.0.113.44 has no prior authentication history in 400 days.\n           source: siem query saved as queries/q-0003.txt  CONFIDENCE: high\n\n## DECISIONS (what, who, when, and what was known then)\n- 02:48Z  DECIDED: do not shut down FIN cluster yet.\n           BY: a.okafor (IC)\n           KNOWN AT THE TIME: one confirmed logon, no encryption activity,\n             no evidence of data movement, cluster carries payroll run\n             scheduled 06:00Z.\n           REVISIT IF: any write-heavy process appears, or exfil confirmed.\n\n## OPEN QUESTIONS (owner and due time on every line)\n- Q1 Does svc-fincluster hold any Entra ID app role? OWNER p.raghavan DUE 03:30Z\n- Q2 Are there federation trusts added in the last 90 days? OWNER k.ford DUE 04:00Z\n\n## EVIDENCE INDEX\n- evid/0001.png  sha256 recorded in evid/MANIFEST.sha256\n- evid/0002.evtx sha256 recorded in evid/MANIFEST.sha256\n"
            },
            {
              kind: "code",
              title: "Make the record tamper-evident from minute one",
              lang: "bash",
              body:
                "# Run from the evidence directory on the acquisition host, not on any suspect host.\n# Every artifact gets hashed the moment it lands, and the manifest is appended to,\n# never rewritten. This is five minutes of work that decides whether your evidence\n# survives a challenge nine months from now.\n\numask 077\nmkdir -p /evidence/INC-2026-0814/{artifacts,queries,notes}\ncd /evidence/INC-2026-0814\n\n# hash on arrival\nfind artifacts -type f -newer .last_manifest -print0 |\n  xargs -0 sha256sum >> MANIFEST.sha256\ntouch .last_manifest\n\n# timestamp the manifest itself so later additions are provably later\nsha256sum MANIFEST.sha256 >> MANIFEST.chain\ndate -u +%Y-%m-%dT%H:%M:%SZ >> MANIFEST.chain\n\n# verify at any point, including in front of an auditor\nsha256sum -c MANIFEST.sha256 --quiet && echo MANIFEST OK\n\n# ship a copy off the acquisition host every 15 minutes to storage the\n# incident team does not administer, so a compromised admin cannot rewrite it\nrsync -a --append-verify MANIFEST.sha256 MANIFEST.chain \\\n  evidence-vault:/inc/2026-0814/\n"
            },
            {
              kind: "code",
              title: "Out-of-band comms, decided before you need them",
              lang: "yaml",
              body:
                "# comms-fallback.yaml — reviewed quarterly, printed and stored physically\n# Assumption: the corporate identity provider, mail and chat may all be adversary-readable.\n\nprimary:\n  channel: corporate chat, incident room\n  use_when: identity plane assessed clean with high confidence\n  risk: adversary with a valid session token reads everything you type\n\nfallback_tier_1:\n  channel: separate messaging tenant on a separately-billed account\n  identities: pre-provisioned, hardware-token only, no corporate SSO\n  devices: four laptops kept imaged and offline, rebuilt quarterly\n  activation: IC declares tier 1; comms lead posts the migration notice\n  gotcha: link previews in chat clients fetch URLs from your egress.\n    Disable link unfurling before pasting adversary infrastructure.\n\nfallback_tier_2:\n  channel: in person, single room, phones outside\n  use_when: suspected adversary access to any messaging platform\n  record: paper, photographed and hashed at the end of each session\n\nnever:\n  - discussing containment timing in corporate email\n  - naming the adversary domain in a channel with unfurling enabled\n  - inviting the compromised account holder into the incident channel\n"
            },
            {
              kind: "checklist",
              title: "Verify the rule is real, not aspirational",
              items: [
                "Ask three responders who the scribe is. If you get two answers, the record has two authors and no author.",
                "Grep the last incident's chat for the phrase I just — as in I just restarted it. Every instance is a single-writer violation you did not catch at the time.",
                "Confirm the ops lead has a way to say no to a VP. If they do not, the rule collapses the first time seniority enters the bridge.",
                "Check that the evidence manifest is written to storage the incident team cannot administer.",
                "Time how long it takes to activate tier 1 comms from cold. If it is more than fifteen minutes, it will not be used."
              ]
            }
          ],
          praxis:
            "Take your last real incident or exercise and rebuild its record into the three-section format. Then count how many decisions you can reconstruct with their what-was-known-at-the-time context.",
          evidence:
            "The rebuilt record with observations, decisions and open questions separated, plus a written note of how many decisions could not be reconstructed and why.",
          awards: ["award-single-writer", "award-tamper-evident-record"],
          glossary: ["single-writer-rule", "incident-record", "out-of-band-comms", "evidence-manifest", "decision-log"]
        },
        {
          id: "ch-incident-opsec-silence",
          kind: "drill",
          title: "What the Adversary Learns From You",
          statement:
            "Every action you take is telemetry the adversary receives, and the cheapest way to lose an incident is to announce that you have found it.",
          minutes: 24,
          respect: 145,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "Response operational security is the discipline of managing what your behaviour reveals. It is unnatural, because every instinct trained by reliability work says act now, and because doing nothing visible while an adversary sits in your network feels like negligence to everyone watching. Google's crisis management chapter puts the discipline plainly: for each step of your investigation, consider the conclusions a shrewd attacker may draw from your actions. That is a harder standard than it sounds, because the tells are usually infrastructural rather than deliberate."
            },
            {
              kind: "list",
              title: "Tells that responders generate without noticing",
              items: [
                "Chat clients that unfurl links: pasting the adversary command-and-control domain into your incident channel causes your egress IP to fetch it, which appears in their logs as a defender-shaped request from the victim network.",
                "Sudden conditional access policy changes, or an unexplained tightening of egress rules, both of which are visible from inside.",
                "Logging into the compromised host with domain administrator credentials, which hands the adversary a better credential than the one they had.",
                "Password resets or MFA re-enrolment on a single account they hold — maximum tell, minimum benefit.",
                "Querying adversary infrastructure from corporate address space, including via a sandbox that egresses through the corporate network.",
                "Public sample uploads: submitting the adversary's binary to a multi-vendor scanning service, where a targeted actor watching for their own hashes learns the exact hour you found it.",
                "Calendar and vacation signals: a security team that abruptly cancels a week of meetings is legible to anyone reading a mailbox.",
                "Procurement noise: an emergency purchase order for forensic services, visible in a compromised finance system."
              ]
            },
            {
              kind: "principle",
              title: "The reciprocity law",
              body:
                "You are not observing them; you are observing each other. Design each investigative step by asking what it costs you if they see it, and prefer steps whose signature is indistinguishable from normal operations."
            },
            {
              kind: "callout",
              title: "The exception that overrides everything",
              body:
                "Operational security yields immediately to active harm. If regulated data is leaving right now, if encryption has started, if a human safety system is implicated, you act and you accept the tell. Silence is a tactic in service of a better eviction, never a value in itself. Write this exception into the plan so that the person who invokes it is not arguing from instinct at 04:00."
            }
          ],
          drill: {
            id: "ch-incident-drill-opsec-silence",
            scene:
              "Day three of a suspected state-aligned intrusion at a mid-sized defence supplier. You have confirmed a webshell on an internet-facing file transfer appliance and identified one beaconing domain with a fourteen-minute jitter. Threat intelligence associates the tradecraft with an actor that historically maintains four to six independent persistence mechanisms and monitors defender behaviour closely. You have no evidence yet of movement into the identity provider, and no evidence that they lack it. Your SOC lead has a proxy block and an account disable staged and is waiting on your word. Business hours in the adversary's likely timezone begin in forty minutes.",
            clock: "Forty minutes until their operators are typically active. Your forensic agents are deployed on nine hosts out of four thousand.",
            pressure:
              "The CISO has asked twice why the known bad domain is still resolvable. The answer is correct and unsatisfying, and you have to give it anyway.",
            prompt: "You are the incident commander. What do you authorise in the next forty minutes?",
            options: [
              {
                id: "ch-incident-drill-opsec-opt-block",
                label: "Block the beacon domain at the proxy and disable the compromised account now.",
                detail: "Reduce active risk immediately. You can hunt for the rest afterwards.",
                score: -2,
                outcome:
                  "The beacon blackholes within one interval. Their operator sees it, burns the webshell you know about, and activates a channel you had no visibility into — in one observed pattern, a scheduled task calling out over a legitimate cloud storage API that your egress policy permits by design. You have traded a monitored adversary for an unmonitored one.",
                ripple:
                  "Your remaining detection surface just shrank to whatever you had already deployed. Every subsequent hunting hypothesis is now uninformed by live behaviour, and the eventual eviction is a guess about completeness rather than a claim you can defend to a customer's security team."
              },
              {
                id: "ch-incident-drill-opsec-opt-instrument",
                label:
                  "Authorise no visible action. Spend the window instrumenting: forensic agents and full packet capture on the appliance segment, identity-plane hunt for federation and token artifacts, and a written decision gate with explicit act-now criteria.",
                detail:
                  "Criteria stated up front: act immediately on any authentication to a domain controller, any access to the backup catalogue, any staging archive over one gigabyte, or any touch on the engineering document store.",
                score: 3,
                isBest: true,
                outcome:
                  "You lose forty minutes of comfort and gain the actual scope. Packet capture reveals a second beacon on a different protocol from a host you had not associated with the intrusion, and the identity-plane hunt turns up a service principal with a client secret added eleven days before the webshell. Neither would have appeared in a post-eviction sweep.",
                ripple:
                  "You now have a complete-enough map to run one coordinated eviction rather than three partial ones. Equally important, the written criteria mean the decision to keep watching is documented as a deliberate risk-managed choice with tripwires, which is the difference between judgment and negligence when it is reviewed later."
              },
              {
                id: "ch-incident-drill-opsec-opt-quiet",
                label: "Null-route the command-and-control traffic quietly so it looks like a routing fault, but leave the account active.",
                detail: "Get the risk reduction without the obvious tell of a proxy block page.",
                score: -1,
                outcome:
                  "Mature actors distinguish a network fault from targeted suppression within a couple of intervals: the fault is asymmetric, affects only their infrastructure, and coincides with the appliance still functioning normally. You get the tell anyway, and you have also blinded your own capture of their traffic.",
                ripple:
                  "This option is the most seductive because it feels clever, and it costs you the visibility that a real block at least trades for certainty. Half-measures against an observant adversary generally purchase the downside of both alternatives."
              },
              {
                id: "ch-incident-drill-opsec-opt-reset",
                label: "Order an enterprise-wide credential reset tonight to get ahead of any identity compromise.",
                detail: "If you cannot rule out identity access, remove it everywhere at once.",
                score: -3,
                outcome:
                  "Eleven thousand password changes generate a helpdesk queue that becomes its own outage, and the adversary — who now knows precisely when you found them — uses the confusion to enrol a new authenticator through a helpdesk operator who is overwhelmed and skipping verification. This is exactly the pressure that produced the 2023 casino intrusions, where a single convincing call to a service desk produced an MFA reset and eventually an entirely new federated identity provider inside the tenant.",
                ripple:
                  "Mass resets without first removing persistence and without hardening the helpdesk verification path are the textbook way to hand the adversary a fresh, clean credential while congratulating yourself on decisive action. Sequence matters more than scale."
              }
            ],
            debrief:
              "The best option is uncomfortable precisely because its benefit is invisible and its cost is felt by everyone watching. What makes it defensible is not patience as a virtue but the decision gate: named criteria, a named owner, and a stated deadline. That structure converts waiting into a managed control rather than an omission, and it gives the CISO something to hold. Note that the two worst options fail in opposite directions — one too narrow, one too broad — and both share the same root error of acting before the identity plane is understood. In modern intrusions the identity plane is where completeness of eviction is decided, and it is the layer that survives every endpoint action you take.",
            principle:
              "Waiting is only defensible when it is instrumented, bounded and written down. Undocumented patience is indistinguishable from paralysis, and documented patience is a control."
          },
          awards: ["award-response-opsec", "award-decision-gate"],
          glossary: ["response-opsec", "decision-gate", "beacon-jitter", "persistence-mechanism", "eviction-completeness"]
        },
        {
          id: "ch-incident-handoff",
          kind: "lab",
          title: "The Handoff That Transfers Context, Not Just Credentials",
          statement:
            "Most incidents lose more ground at shift change than at any point of adversary action, because context does not fit in a chat message.",
          minutes: 30,
          respect: 130,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "A long incident is a relay race in which the baton is a mental model. The outgoing commander holds a rich structure of ruled-out hypotheses, half-trusted evidence, and social knowledge — who is reliable at hour twelve, which executive needs a call rather than a message. Almost none of that is in the record. When the handoff is a five-minute status summary, the incoming commander rebuilds the model from scratch, re-asks questions that were answered, and re-opens decisions that were closed for good reasons nobody wrote down. Follow-the-sun response teams lose entire hours this way, twice a day, invisibly."
            },
            {
              kind: "numbered",
              title: "The handoff protocol, twenty minutes, overlapping",
              items: [
                "Overlap, do not swap. The incoming IC joins twenty minutes before the outgoing one leaves and observes first. A cold start at the moment of transfer is how objectives get silently redefined.",
                "The outgoing IC reads the current objective aloud and the incoming IC repeats it back in their own words. If the paraphrase differs, you have found a divergence that was already costing you.",
                "Walk the open questions list, not the observations list. Observations are in the record; open questions are where the thinking lives.",
                "Explicitly transfer the ruled-out list — hypotheses considered and discarded, with the reason. This is the single highest-value and most commonly omitted item.",
                "Name the tripwires: the specific observations that would change the plan, and who is watching for each.",
                "Transfer the social map: which executive is anxious, which vendor is slow, which team member is at their limit.",
                "Announce the transfer in the record with both names and a timestamp, and make the incoming IC post the next update so that the organization sees the change of voice."
              ]
            },
            {
              kind: "code",
              title: "A handoff artifact your successor can act on",
              lang: "yaml",
              body:
                "handoff:\n  incident: INC-2026-0814\n  from: a.okafor\n  to: r.lindqvist\n  at: 2026-08-14T14:00Z\n  hours_awake_outgoing: 11.5\n\n  objective_now: >\n    Establish whether any federation trust or token signing material\n    in the identity tenant has been modified since 2026-06-01.\n\n  believed_true:\n    - webshell on FTA-EDGE-02, first written 2026-07-28 (file system MAC times)\n    - beacon to 198.51.100.23, 14 min jitter, still active by design\n    - service principal sp-reporting-int gained a client secret 2026-08-03\n\n  ruled_out_and_why:\n    - lateral movement via SMB to FIN cluster — no 5140 or 5145 events\n      across the window, verified on all four DCs, query q-0031\n    - initial access via phishing — no matching mail flow, MX logs pulled\n      for 120 days, verified by k.ford\n    - insider — badge and VPN correlation shows no human present for the\n      02:00-04:00 window on any implicated host\n\n  tripwires:\n    - any authentication by sp-reporting-int -> page IC immediately (owner m.tan)\n    - any access to backup catalogue account -> full stop, evict now (owner p.raghavan)\n    - archive staging over 1 GB on FTA-EDGE-02 -> full stop (owner capture team)\n\n  social_map:\n    - CFO calls rather than messages; comms lead should ring at 16:00Z\n    - forensics vendor turnaround is running 6 hours, not the 2 they quoted\n    - m.tan has been on since 02:00 and must be off by 16:00Z, no exceptions\n\n  do_not_reopen:\n    - decision to leave the beacon active. Revisit only on a tripwire.\n"
            },
            {
              kind: "table",
              title: "Rotation policy that survives contact with a real crisis",
              headers: ["Element", "Weak version", "Version that holds"],
              rows: [
                [
                  "Shift length",
                  "Until people are tired",
                  "Twelve hours maximum, eight for anyone doing analysis requiring sustained attention, enforced by the deputy"
                ],
                [
                  "Who can remove someone",
                  "Nobody, socially",
                  "The deputy IC has explicit authority to stand anyone down, including the IC, and it is written in the plan"
                ],
                [
                  "Bench depth",
                  "One IC, one deputy",
                  "Three trained ICs minimum per organization, so that a seventy-two hour incident does not depend on two people"
                ],
                [
                  "Handoff cost",
                  "Treated as overhead to minimise",
                  "Budgeted as twenty minutes of overlap twice a day, roughly three percent of incident time, and defended"
                ],
                [
                  "Rest",
                  "Go home and check messages",
                  "Off means off the channel. A responder who reads updates while resting has not rested and will return with degraded judgement and false confidence"
                ]
              ]
            },
            {
              kind: "callout",
              title: "The rule that makes rotation possible",
              body:
                "Rotation is a staffing problem before it is a policy problem. If only two people in your organization can command, you have already decided that a multi-day incident will be commanded badly at the end. Train the third and fourth commander now, from outside security if necessary — experienced SRE incident commanders convert well, because the coordination skill transfers and the security specifics can sit in the operations lead."
            }
          ],
          praxis:
            "Write the handoff artifact for a live or recent incident, including the ruled-out list and the tripwires. Then hand it to a colleague who was not involved and have them brief it back to you.",
          evidence:
            "The completed handoff YAML plus a short note listing every question your colleague asked that the artifact failed to answer.",
          awards: ["award-clean-handoff", "award-rotation-discipline"],
          glossary: ["shift-handoff", "ruled-out-list", "tripwire", "follow-the-sun", "deputy-ic"]
        }
      ]
    },
    {
      id: "ch-incident-page-containment",
      title: "THE CUT",
      credential: "Certified in Containment, Forensic Soundness and Coordinated Eviction — StepSAFE Praxis",
      summary:
        "The hardest decision in security is when to stop watching and start cutting, and the second hardest is doing it without destroying the evidence that proves what happened. This Page covers the containment ladder, volatile evidence acquisition under time pressure, and the coordinated eviction that actually removes an adversary instead of annoying them.",
      competencies: [
        "Select containment actions by reversibility and blast radius rather than by availability of tooling",
        "Make the eradicate-now versus observe-longer call with written criteria, tripwires and a deadline",
        "Acquire memory, disk and cloud control-plane evidence in defensible order without contaminating the scene",
        "Maintain chain of custody and avoid the handling errors that destroy attribution",
        "Plan and execute a coordinated eviction across identity, network and endpoint in a single cutover",
        "Map an organization's identity blast radius and convert it into an executable eviction runbook"
      ],
      seal: "seal-cut-ember",
      steps: [
        {
          id: "ch-incident-containment-ladder",
          kind: "construct",
          title: "The Containment Ladder",
          statement:
            "Containment is not one action; it is a ladder of increasingly irreversible options, and you owe the organization the cheapest rung that actually holds.",
          minutes: 20,
          respect: 80,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body:
                "Teams talk about containment as if it were binary — contained or not contained — which is why the conversation collapses into pull the plug versus do nothing. In practice containment is a ladder ordered by two axes that usually run in opposite directions: how much adversary capability it removes, and how much it costs you in evidence, business function and surprise. Your job as commander is to know the rungs well enough to pick one under pressure, and to say out loud which axis you are trading."
            },
            {
              kind: "table",
              title: "Rungs, from cheapest to most drastic",
              headers: ["Rung", "Action", "Removes", "Costs you"],
              rows: [
                [
                  "1",
                  "Increase observation: forensic agents, packet capture, verbose auth logging on the segment",
                  "Nothing adversarial",
                  "Time, storage, and a small tell if the adversary can see agent installs"
                ],
                [
                  "2",
                  "Constrain without signalling: rate limits, egress inspection on an already-inspected path, honeytokens",
                  "Bandwidth for bulk exfiltration",
                  "Very little, if the constraint resembles normal operations"
                ],
                [
                  "3",
                  "Network isolation of a host: move to a quarantine VLAN or an EDR containment policy that keeps the management channel",
                  "Lateral movement from that host",
                  "Loud to the adversary; you keep memory and disk if you do not power off"
                ],
                [
                  "4",
                  "Credential and token invalidation for a scoped identity set",
                  "Live access via those identities",
                  "Very loud; useless if persistence sits outside those identities"
                ],
                [
                  "5",
                  "Service or segment shutdown",
                  "Adversary access and your own business function together",
                  "Revenue, safety systems, and the volatile evidence on anything powered off"
                ],
                [
                  "6",
                  "Identity plane rebuild: rotate signing material, reissue trust, reset the ticket-granting account",
                  "Forged-token and federation persistence",
                  "Days of work, authentication outages, and a dependency loop you must plan for"
                ]
              ]
            },
            {
              kind: "principle",
              title: "The reversibility law",
              body:
                "Prefer the lowest rung that removes the specific capability you are worried about. If you cannot name the capability, you are not containing, you are reacting — and reaction at rung five costs the same as a serious outage with none of the planning."
            },
            {
              kind: "list",
              title: "Four questions before any rung above two",
              items: [
                "What capability does this specifically remove, and what does the adversary still hold afterwards?",
                "What evidence does this destroy — volatile memory, live network state, an active session I could have traced?",
                "Who else is affected, and does anyone downstream depend on this system in a way nobody has mentioned yet?",
                "Is this reversible within an hour if I am wrong, and who has the authority to reverse it?"
              ]
            },
            {
              kind: "callout",
              title: "Isolate before you power off",
              body:
                "The joint CISA ransomware guidance is explicit about this ordering and it is the single most commonly violated rule in the first hour. Network isolation preserves running processes, injected code, encryption keys sometimes still resident in memory, and open network connections. Powering off destroys all of it. If a system truly cannot be isolated, and only then, powering it off is the fallback — and you record the reason in the decision log."
            }
          ],
          awards: ["award-containment-ladder"],
          glossary: ["containment-ladder", "network-isolation", "blast-radius", "reversibility"]
        },
        {
          id: "ch-incident-eradicate-or-watch",
          kind: "drill",
          title: "Eradicate Now or Watch Longer",
          statement:
            "You never find all of the persistence; you decide when your map is good enough, and you decide it with criteria rather than with nerve.",
          minutes: 26,
          respect: 160,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "The observe-longer argument is that partial eviction teaches the adversary your detections while leaving them a way back, so you should complete the map first. The eradicate-now argument is that every additional hour is additional harm, additional data leaving, and additional legal exposure once you know. Both are correct. The mistake is treating this as a values question — patient versus decisive — when it is a criteria question. Good commanders convert it into three written artifacts: a completeness standard, a set of tripwires that force immediate action, and a hard deadline after which you evict with whatever map you have."
            },
            {
              kind: "numbered",
              title: "A completeness standard you can actually defend",
              items: [
                "Initial access vector identified and closed, or a compensating control in place with a named owner.",
                "Every identity used by the adversary enumerated, including service principals, application registrations with credentials, and any federation or trust object created or modified in the window.",
                "Every persistence mechanism found by at least two independent methods — for example a scheduled task found both by artifact hunt and by behavioural detection — because single-source findings correlate with single-source blind spots.",
                "The full time window bounded on both ends, with the earliest confirmed artifact predating the earliest suspected activity by a margin you can state.",
                "A negative result you trust: at least one high-value area — backup infrastructure, the certificate authority, source control — searched and cleared with a documented method."
              ]
            },
            {
              kind: "principle",
              title: "The eviction law",
              body:
                "Eviction is a cutover, not a campaign. Anything you cannot execute inside one coordinated window will be executed against a warned adversary, and a warned adversary retains whatever you have not yet found."
            },
            {
              kind: "quote",
              body:
                "A security response requires the team to complete a full investigation into what happened prior to attempting to correct things.",
              source: "Building Secure and Reliable Systems, Chapter 17 — the sentence that justifies the wait, and also bounds it"
            }
          ],
          drill: {
            id: "ch-incident-drill-eradicate-or-watch",
            scene:
              "Day nine at a listed industrial manufacturer. You have mapped three persistence mechanisms: a webshell on an edge appliance, a scheduled task on a jump host, and a registered OAuth application in the tenant holding application-level mail read permission across the organization. Reconstruction puts first adversary activity forty-seven days ago. Your threat intelligence provider assesses this actor as typically holding five or more independent footholds and as having a pattern of destructive action once discovered. Two hours ago you confirmed the OAuth application has been reading the CFO's mailbox, including a folder containing draft quarterly figures. The board chair has asked the CISO directly why the intruder is still inside the network.",
            clock: "The quarterly earnings release is in eleven days. Your identity-plane hunt is roughly sixty percent complete.",
            pressure:
              "Material non-public information is confirmed to be in adversary hands. Every hour you wait is now also a securities and disclosure question, not only a technical one.",
            prompt: "You are the incident commander. What do you order?",
            options: [
              {
                id: "ch-incident-drill-eradicate-opt-tonight",
                label: "Evict the three known mechanisms tonight and continue hunting afterwards.",
                detail: "Remove what you know about now; you can keep searching for the rest with the adversary out of the network.",
                score: -2,
                outcome:
                  "The three are removed cleanly. Six days later, authentication succeeds using a token signed with material you never rotated, from an on-premises federation service you had not yet examined. The adversary now knows which three detections found them and avoids all three on the way back in.",
                ripple:
                  "You have spent your surprise, taught the adversary your detection surface, and still hold an unbounded compromise. Every subsequent statement you make to customers and regulators about having removed the intruder becomes a statement you will have to retract, which is far more damaging than the original intrusion."
              },
              {
                id: "ch-incident-drill-eradicate-opt-watch",
                label: "Keep watching for two more weeks until the map is complete.",
                detail: "The actor holds five or more footholds; anything less than a complete map guarantees a partial eviction.",
                score: -2,
                outcome:
                  "You accumulate excellent forensic material and two more weeks of confirmed access to draft financials. Complete has no operational definition, so the deadline slips twice. When you finally act, counsel has to explain a fourteen-day gap between confirmed knowledge of material non-public information in adversary hands and any protective action.",
                ripple:
                  "Waiting without a stopping condition is not patience, it is drift. Once specific, confirmed harm to a defined asset is known, the calculus changes from investigative to fiduciary, and the record has to show that you recognised the change."
              },
              {
                id: "ch-incident-drill-eradicate-opt-cutover",
                label:
                  "Set a hard eviction cutover seventy-two hours out. Spend the window on identity-plane completeness only, stage everything, and evict identity, network and endpoint in one coordinated action with mail access severed first.",
                detail:
                  "Written tripwires override the deadline: any touch on the backup catalogue, the certificate authority, source control, or the OT boundary triggers immediate eviction. Legal is briefed now on the material non-public information exposure so the disclosure track runs in parallel rather than after.",
                score: 3,
                isBest: true,
                outcome:
                  "The seventy-two hours surface a fourth mechanism — a certificate issued from your own internal CA to a machine identity that does not correspond to a real host — and a fifth, a modified group policy that reinstalls the scheduled task. The cutover removes all five inside forty minutes, with mail severed in the first five so the CFO exposure stops immediately.",
                ripple:
                  "The bounded window gives the board an answer — a date, a plan and a reason — rather than a posture. Because legal ran in parallel, the disclosure decision is made on a full record rather than at the last minute, and the parallel track is itself evidence of a functioning process."
              },
              {
                id: "ch-incident-drill-eradicate-opt-cfo",
                label: "Immediately isolate the CFO's mailbox and reset his credentials, then continue the hunt as planned.",
                detail: "Stop the specific confirmed harm without triggering a full eviction.",
                score: -1,
                outcome:
                  "The OAuth application loses one mailbox and retains organization-wide read on every other, because application permissions do not depend on that user's credentials. You have made the loudest possible move for the smallest possible gain, and a competent operator reads a single-mailbox action as confirmation that you have found the mail path.",
                ripple:
                  "This is the most technically tempting wrong answer because it feels proportionate. It fails on a specific piece of knowledge: application-level permissions are not user-scoped, so user-scoped remediation does not touch them. Proportionality has to be measured against the mechanism, not against the harm."
              }
            ],
            debrief:
              "The winning move is not the middle of the range; it is the one that adds structure. A deadline converts an open-ended watch into a plan, tripwires convert the plan into something that can respond to new harm, and sequencing inside the cutover — mail first — reduces the confirmed harm within minutes rather than waiting for the whole operation. Notice what the seventy-two hours are spent on: identity, not endpoints. In modern intrusions, endpoint persistence is recoverable and identity persistence is not, because forged tokens and trust objects survive every rebuild you perform. The CFO option is worth studying longest, because it is wrong for a reason that only shows up if you know how application permissions work — which is exactly the kind of knowledge a commander needs to hold even though they are not the one typing.",
            principle:
              "Bound the wait with a deadline and puncture it with tripwires. A decision that can be overridden by new evidence is a control; one that cannot is a bet."
          },
          awards: ["award-eviction-planner", "award-tripwire-discipline"],
          glossary: ["coordinated-eviction", "persistence-completeness", "oauth-application-permission", "cutover-window"]
        },
        {
          id: "ch-incident-order-of-volatility",
          kind: "lab",
          title: "Volatile First: Acquisition Under a Clock",
          statement:
            "Evidence decays in a strict order, and the choices you make in the first twenty minutes determine what you will be able to prove for the next two years.",
          minutes: 40,
          respect: 180,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "The order of volatility, formalised in RFC 3227, is the only forensic principle you must be able to recite while adrenaline is high: registers and cache, then memory, then network state and running processes, then disk, then remote logging and archives, then physical configuration and media. It ranks by how fast the evidence disappears, not by how useful it is. Memory is where injected code, decrypted payloads, in-flight credentials and sometimes ransomware keys live, and it survives exactly as long as the power does. Disk waits for you. This is why isolate-then-acquire beats power-off, and why the well-meaning infrastructure engineer who reboots to see if it clears is the most destructive person in the building."
            },
            {
              kind: "code",
              title: "Memory and disk acquisition, Linux and Windows",
              lang: "bash",
              body:
                "# ---- LINUX: memory first, to external media or an SSH stream ----\n# AVML from Microsoft handles most modern kernels without a matching module.\n# Never write the image to the suspect file system.\n./avml --compress /mnt/evidence/HOST01-mem-2026-08-14T0312Z.lime.compressed\nsha256sum /mnt/evidence/HOST01-mem-*.lime.compressed >> /mnt/evidence/MANIFEST.sha256\n\n# If you cannot attach media, stream it. Note the acquisition host must not be\n# in the compromised trust boundary.\n./avml - | ssh -i /root/.ssh/forensics_ed25519 evidence@10.7.0.9 \\\n  'cat > /vault/HOST01-mem.lime'\n\n# ---- Volatile state, captured before anything else touches the box ----\ndate -u +%Y-%m-%dT%H:%M:%SZ           > /mnt/evidence/HOST01-volatile.txt\nss -tunapo                           >> /mnt/evidence/HOST01-volatile.txt\nps auxwwf                            >> /mnt/evidence/HOST01-volatile.txt\nls -l /proc/*/exe 2>/dev/null        >> /mnt/evidence/HOST01-volatile.txt\ncat /proc/net/route /proc/net/arp    >> /mnt/evidence/HOST01-volatile.txt\nlsof -nP                             >> /mnt/evidence/HOST01-volatile.txt\n\n# ---- Disk, only after memory ----\n# dc3dd hashes while it images, which removes a whole class of later arguments.\ndc3dd if=/dev/sda hof=/mnt/evidence/HOST01-sda.img hash=sha256 \\\n  log=/mnt/evidence/HOST01-sda.log\n\n# ---- WINDOWS: memory, then triage collection ----\n# WinPmem writes a raw physical memory image. Run from removable media.\nE:/tools/winpmem_mini_x64.exe E:/evidence/WS-4412-mem.raw\n\n# KAPE targeted triage: registry hives, event logs, prefetch, USN journal,\n# scheduled tasks, WMI persistence, browser artifacts. Minutes, not hours.\nE:/tools/kape.exe --tsource C: --tdest E:/evidence/WS-4412 \\\n  --target KapeTriage --vhdx WS4412 --gui false\n"
            },
            {
              kind: "code",
              title: "Triage the image before the vendor gets back to you",
              lang: "bash",
              body:
                "# Volatility 3 against the Linux capture. Symbol table must match the kernel;\n# build it with dwarf2json against the running kernel BEFORE you lose the host.\nvol -f HOST01-mem.lime linux.pslist.PsList\nvol -f HOST01-mem.lime linux.bash.Bash          # recovered shell history\nvol -f HOST01-mem.lime linux.check_syscall.Check_syscall\nvol -f HOST01-mem.lime linux.malfind.Malfind\n\n# Windows image: the four plugins that answer the first questions\nvol -f WS-4412-mem.raw windows.pstree.PsTree\nvol -f WS-4412-mem.raw windows.malfind.Malfind\nvol -f WS-4412-mem.raw windows.netscan.NetScan\nvol -f WS-4412-mem.raw windows.cmdline.CmdLine\n\n# Timeline the file system without mounting the evidence read-write.\n# Mounting read-write updates access times and is a documented way to lose\n# an argument in front of an expert witness.\nmkdir -p /mnt/ro\nmount -o ro,loop,noexec,nodev,noatime HOST01-sda.img /mnt/ro\nfls -r -m / -o 2048 HOST01-sda.img > bodyfile\nmactime -b bodyfile -d -z UTC 2026-06-01..2026-08-15 > timeline.csv\n"
            },
            {
              kind: "code",
              title: "Cloud evidence has a different volatility curve",
              lang: "bash",
              body:
                "# In cloud, the volatile thing is often the control plane record, not RAM.\n# Snapshot the volume, protect the instance from termination, and pull the\n# control plane history before anyone starts remediating.\n\n# 1. Prevent destruction of the scene\naws ec2 modify-instance-attribute --instance-id i-0abc123 \\\n  --disable-api-termination\n\n# 2. Isolate without powering off: swap to a security group with no rules\naws ec2 modify-instance-attribute --instance-id i-0abc123 \\\n  --groups sg-0quarantine\n\n# 3. Snapshot every attached volume, tagged to the incident\naws ec2 create-snapshot --volume-id vol-0def456 \\\n  --description 'INC-2026-0814 forensic' \\\n  --tag-specifications 'ResourceType=snapshot,Tags=[{Key=incident,Value=INC-2026-0814}]'\n\n# 4. Pull the control plane story for the identity in question\naws cloudtrail lookup-events --lookup-attributes \\\n  AttributeKey=Username,AttributeValue=svc-reporting \\\n  --start-time 2026-06-25T00:00:00Z --end-time 2026-08-14T00:00:00Z \\\n  --max-results 1000 > cloudtrail-svc-reporting.jsonl\n\n# 5. The questions that decide scope, asked of the control plane\n#    - which identities created access keys, roles or trust policies\n#    - which regions were touched that you do not normally use\n#    - whether CloudTrail itself was stopped, filtered or had an S3 lifecycle\n#      rule added, which is a favourite anti-forensic move\naws cloudtrail get-trail-status --name org-trail\n"
            },
            {
              kind: "list",
              title: "Mistakes in this lab that destroy attribution permanently",
              items: [
                "Rebooting or powering off before memory acquisition. Everything resident is gone and cannot be recovered from disk.",
                "Running an antivirus or EDR full scan on the suspect host, which quarantines and often deletes the sample you needed and rewrites access times across the file system.",
                "Logging in with domain administrator credentials to investigate, which places a fresh privileged credential in the memory of a machine you believe an adversary controls.",
                "Mounting the disk image read-write, or examining the original disk rather than a verified copy.",
                "Writing evidence to the suspect file system, which overwrites unallocated space containing deleted artifacts.",
                "Recording times in local time with no stated source or offset. Timeline correlation across sources fails silently and the whole reconstruction becomes contestable.",
                "Letting a helpdesk technician reimage the host because a ticket said the user needs their laptop back."
              ]
            },
            {
              kind: "callout",
              title: "The pre-work that makes this possible",
              body:
                "None of the above is achievable in the moment unless the tooling is already staged: forensic agents deployable without an admin logon, an acquisition host outside the corporate trust boundary, removable media prepared and hashed, symbol tables built for your kernel builds, and one person who has actually run these commands in the last ninety days. Buy the capability before the incident; you cannot procure it during one."
            }
          ],
          praxis:
            "Acquire memory and a triage collection from one Linux host and one Windows host in your own environment during a maintenance window, hash everything, and run at least four triage plugins against each image.",
          evidence:
            "The manifest with hashes, the triage output, and a written record of elapsed time from decision to acquisition complete on each platform.",
          awards: ["award-volatile-first", "award-acquisition-runbook"],
          glossary: ["order-of-volatility", "memory-acquisition", "triage-collection", "control-plane-forensics", "anti-forensics"]
        },
        {
          id: "ch-incident-evidence-chain",
          kind: "lesson",
          title: "Chain of Custody, and Writing for a Hostile Reader",
          statement:
            "Assume every note you take tonight will be read aloud by someone whose job is to make you look careless, and write accordingly.",
          minutes: 32,
          respect: 155,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "Chain of custody is usually taught as a bureaucratic ritual, which is why it is abandoned in the first hour of a real crisis. The correct framing is narrower and more motivating: chain of custody exists so that you can answer, months later and under challenge, the question of whether this artifact could have been altered between collection and analysis. If you can answer that with a hash recorded at acquisition, a storage location with restricted and logged access, and a record of who held it when, the artifact stands. If you cannot, a competent opponent does not need to prove tampering; they only need to establish that tampering was possible."
            },
            {
              kind: "table",
              title: "The custody record, minimum viable",
              headers: ["Field", "Why it exists", "Failure it prevents"],
              rows: [
                [
                  "Artifact identifier and description",
                  "Distinguishes this image from the four other captures of the same host",
                  "Two analysts reasoning about different copies while believing they agree"
                ],
                [
                  "Collection time in UTC and the time source",
                  "Every correlation depends on it",
                  "Timelines that silently disagree by an hour across daylight saving boundaries"
                ],
                [
                  "Collector name and the method used",
                  "Lets a later reviewer reproduce or critique the acquisition",
                  "An acquisition whose validity nobody can assess because nobody knows how it was taken"
                ],
                [
                  "Cryptographic hash at collection",
                  "Proves the artifact is unchanged since acquisition",
                  "The could-have-been-altered argument, which is unanswerable without it"
                ],
                [
                  "Storage location and access control",
                  "Shows the artifact was not in a place any administrator could edit",
                  "Evidence held on a share administered by an account inside the compromised domain"
                ],
                [
                  "Transfer log with times and recipients",
                  "Accounts for the artifact continuously",
                  "A gap in possession, which is the classic point of attack on any evidentiary chain"
                ]
              ]
            },
            {
              kind: "prose",
              body:
                "The privilege question sits directly on top of this and is where technically excellent teams get hurt. It is widely believed that routing an incident-response engagement through outside counsel makes the resulting forensic report privileged. Several United States federal courts have declined to accept that. In the Capital One litigation the court ordered the forensic report produced despite the counsel engagement, weighing heavily that the same firm had a long-standing pre-existing relationship doing substantially similar work, that the report was distributed widely inside the company and beyond, and that the cost was treated as a business expense. In the Rutter's litigation the court reached a similar result on the reasoning that the investigation would have happened regardless of anticipated litigation. In Wengui v. Clark Hill the court rejected a two-track structure where the supposedly privileged investigation was in fact the only investigation performed."
            },
            {
              kind: "list",
              title: "What follows, practically, for how you write",
              items: [
                "Assume the technical record is discoverable. Write it so that it is accurate, sourced and neutral, which is also how you would want it written for your own use.",
                "Separate fact from inference explicitly. Observed, believed and assessed are three different words and a good record uses them deliberately.",
                "Never write speculation about culpability, and never write a characterisation of another team's competence. Those sentences have no investigative value and enormous litigation value to your opponent.",
                "Do not write conclusions about legal materiality, negligence or compliance status in a technical document. That is counsel's determination and putting it in an engineer's note helps nobody.",
                "If genuine legal advice is being sought, make the request explicit and keep it separate from the factual record, rather than stamping the word privileged on operational documents and hoping.",
                "Retain everything you generate. Selective deletion during an incident is the single fastest way to convert a bad situation into a spoliation problem."
              ]
            },
            {
              kind: "quote",
              body:
                "The label at the top of a document does not decide privilege. The purpose of the work, the pattern of the relationship, and the distribution of the result do.",
              source: "The practical lesson from Capital One, Rutter s and Clark Hill, stated for engineers"
            },
            {
              kind: "callout",
              title: "The evidence hold nobody issues",
              body:
                "At declaration, someone must suspend routine deletion: log retention rotation, mailbox auto-purge, ephemeral compute teardown, backup expiry, chat message retention policies and cloud snapshot lifecycle rules. In cloud environments this is genuinely urgent, because a ninety-day retention policy will quietly destroy the window you need while you are busy. Write the hold as a named checklist with owners and execute it in the first thirty minutes."
            }
          ],
          awards: ["award-chain-of-custody", "award-writes-for-discovery"],
          glossary: ["chain-of-custody", "evidence-hold", "spoliation", "work-product-doctrine", "fact-versus-inference"]
        },
        {
          id: "ch-incident-eviction-day",
          kind: "lesson",
          title: "Eviction Day: The Coordinated Cutover",
          statement:
            "Eviction succeeds or fails on sequencing, because every action you take removes one capability and warns the adversary about all the others.",
          minutes: 34,
          respect: 175,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "Eviction day is the most rehearsable part of incident response and the least rehearsed. It is a change window with adversarial conditions: a fixed start, a defined sequence, named owners per action, a rollback position, and a communications plan that assumes the adversary is reading whatever channel you forgot about. Teams that improvise it discover the dependencies during execution — that rotating the ticket-granting account breaks the backup agent, that the certificate rotation invalidates the very VPN the remote responders are using, that severing the federation trust locks out the identity team."
            },
            {
              kind: "timeline",
              title: "A cutover sequence that respects dependencies",
              items: [
                "T-72h — Freeze the map. New findings after this point go on a follow-up list unless they trip a tripwire. Endless discovery is how cutover dates slip.",
                "T-48h — Stage everything: scripts written and reviewed, break-glass credentials verified on hardware tokens, out-of-band comms tested cold, the recovery environment built and confirmed not to depend on the compromised domain.",
                "T-24h — Brief every owner on their exact action and their exact time. Rehearse the abort call and who can make it. Confirm the helpdesk has a hardened verification procedure and extra staff, because the volume is about to spike and that queue is an attack surface.",
                "T-2h — Silent readiness. No unusual traffic, no new policy pushes, nothing that changes the adversary's picture.",
                "T+0 — Sever the highest-leverage adversary capability first, usually the identity path: revoke sessions and refresh tokens, disable adversary-controlled service principals and applications, remove unrecognised federation trusts and token signing material.",
                "T+0:05 — Network layer: block infrastructure, close the initial access vector, quarantine known-compromised hosts simultaneously rather than sequentially.",
                "T+0:20 — Credential rotation in dependency order: ticket-granting account first pass, then privileged accounts, then service accounts with their dependent services restarted in a known order.",
                "T+2h — Verification hunt against the tripwire list. Silence is not evidence of success; you look for the specific artifacts you would expect if a mechanism survived.",
                "T+24h — Ticket-granting account second rotation, after the replication interval, closing the golden-ticket window.",
                "T+72h — Structured re-hunt with fresh eyes, ideally a team that was not in the cutover, testing the hypothesis that the eviction was incomplete."
              ]
            },
            {
              kind: "compare",
              title: "Two ways organizations get eviction day wrong",
              left: {
                title: "Death by a thousand cuts",
                items: [
                  "Actions taken as they are approved, over eleven days.",
                  "The adversary observes each one and adapts between them.",
                  "Nobody can say when the environment became clean.",
                  "Each partial action produces its own small outage, so the business experiences maximum disruption for minimum benefit.",
                  "The record shows no decision point, which is difficult to explain later."
                ]
              },
              right: {
                title: "The single coordinated cutover",
                items: [
                  "One window, published internally as planned maintenance, executed by named owners.",
                  "The adversary loses several capabilities before they can react to any one of them.",
                  "There is a defensible timestamp for cleanliness, which matters to customers and regulators.",
                  "One planned disruption, communicated in advance, with support staffed for it.",
                  "The plan itself is evidence of a functioning response, independent of the outcome."
                ]
              }
            },
            {
              kind: "callout",
              title: "The dependency that catches everyone",
              body:
                "Your recovery environment must not authenticate against the identity system you are rebuilding, and your responders must not need the VPN whose certificates you are rotating. Build the clean-room path first, verify a responder can reach production through it with hardware-token authentication, and only then schedule the cutover. Maersk's NotPetya recovery is the canonical illustration of this class of dependency: roughly one hundred and fifty domain controllers designed to back each other up were all destroyed together, and the surviving copy of the directory existed only because one site in Ghana had been offline during a local power outage. Mutual redundancy inside a single trust domain is not redundancy against an adversary who owns the domain."
            }
          ],
          awards: ["award-cutover-plan", "award-dependency-mapper"],
          glossary: ["eviction-cutover", "krbtgt-rotation", "break-glass-credential", "clean-room-recovery", "golden-ticket"]
        },
        {
          id: "ch-incident-identity-blast",
          kind: "field",
          title: "Map Your Identity Blast Radius",
          statement:
            "You cannot evict from an identity plane you have never enumerated, and almost nobody has enumerated theirs.",
          minutes: 45,
          respect: 190,
          trust: 12,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "This is field work, not a lab, because the artifact only has value if it describes your real environment with your real names in it. The goal is a document that a commander can execute at three in the morning without asking anyone a question. Most organizations discover during this exercise that they cannot answer basic questions: how many applications in the tenant hold organization-wide permissions, who can add a federation trust, which service accounts have never rotated, and what breaks if the ticket-granting account is reset twice in twenty-four hours."
            },
            {
              kind: "numbered",
              title: "The enumeration, in order",
              items: [
                "Trust objects: every federation relationship, external identity provider, cross-tenant access setting and trust between directories, with the date each was created and the human who owns it today.",
                "Signing material: every token signing certificate, SAML signing key, and the ticket-granting account, with last rotation date and the documented procedure to rotate each.",
                "Non-human identities: application registrations and service principals with credentials, their permission grants, whether any hold organization-wide read or write, and the last time each credential was used.",
                "Privileged human identities: every account with a path to directory administration, including nested group membership and any standing role assignment, plus the emergency access accounts and where their tokens physically live.",
                "Recovery dependencies: which systems authenticate against this identity plane and would therefore be unreachable during its rebuild — starting with your backup system, your ticketing system and your VPN.",
                "Detection coverage: for each of the above, whether creation or modification generates an alert that a human sees, and who that human is."
              ]
            },
            {
              kind: "code",
              title: "Starting queries — adapt to your platform, then verify by hand",
              lang: "powershell",
              body:
                "# Entra ID: federation configuration on every verified domain.\n# An unexpected federated domain is how the 2023 casino intrusions persisted:\n# the actor added their own identity provider through inbound federation and\n# could then mint valid users at will.\nGet-MgDomain | ForEach-Object {\n  Get-MgDomainFederationConfiguration -DomainId $_.Id -ErrorAction SilentlyContinue |\n    Select-Object DisplayName, IssuerUri, SigningCertificateUpdateStatus\n}\n\n# Service principals holding credentials, with the age of each secret.\nGet-MgServicePrincipal -All |\n  Where-Object { $_.PasswordCredentials.Count -gt 0 -or $_.KeyCredentials.Count -gt 0 } |\n  Select-Object DisplayName, AppId,\n    @{ n = 'SecretEnd'; e = { $_.PasswordCredentials.EndDateTime } }\n\n# Applications with organization-wide permission grants.\nGet-MgOauth2PermissionGrant -All |\n  Where-Object { $_.ConsentType -eq 'AllPrincipals' } |\n  Select-Object ClientId, ResourceId, Scope\n\n# On-premises ADFS: token signing certificate inventory and urgent rotation path.\nGet-AdfsCertificate -CertificateType Token-Signing |\n  Select-Object Thumbprint, NotBefore, NotAfter, IsPrimary\n\n# Directory: accounts with a path to elevated rights, including nesting.\nGet-ADGroupMember -Identity 'Domain Admins' -Recursive |\n  Select-Object SamAccountName, objectClass\nGet-ADUser -Filter { AdminCount -eq 1 } -Properties whenCreated, LastLogonDate |\n  Select-Object SamAccountName, whenCreated, LastLogonDate\n"
            },
            {
              kind: "checklist",
              title: "The runbook is finished when all of these are true",
              items: [
                "Every trust object has a named human owner who has confirmed ownership in writing within the last ninety days.",
                "Every rotation procedure has been executed at least once in a non-production environment by someone who is not its author.",
                "The emergency access accounts have been tested this quarter, are excluded from conditional access, use hardware tokens, and their use fires an alert to a distribution that is monitored.",
                "The runbook states, per action, the expected blast radius in plain language — what will break and for how long.",
                "The recovery environment has been proven to work with the production identity plane fully unavailable.",
                "The document is stored where it is readable during an outage of the systems it describes, including on paper."
              ]
            },
            {
              kind: "callout",
              title: "Expect the finding that changes your quarter",
              body:
                "Nearly every team that runs this exercise properly finds at least one of the following: an application registration with organization-wide mail permission created for a pilot that ended two years ago, a federation trust nobody recognises, a service account secret that has never expired because someone set a hundred-year lifetime, or an emergency access account whose token is in a drawer nobody can locate. Those findings are the point. Fix them and log them as risk reductions with dates."
            }
          ],
          praxis:
            "Produce the full identity blast radius inventory for your production tenant and turn it into an executable eviction runbook with named owners, per-action blast radius and tested rotation procedures.",
          evidence:
            "The runbook itself with owner names and dates, the inventory of trust objects and credentialed non-human identities, and a written record of at least three findings you remediated as a result.",
          awards: ["award-identity-cartographer", "award-eviction-runbook"],
          glossary: ["identity-blast-radius", "federation-trust", "service-principal", "emergency-access-account", "token-signing-certificate"]
        }
      ]
    },
    {
      id: "ch-incident-page-extortion",
      title: "THE EXTORTION",
      credential: "Certified in Ransomware Crisis Economics and Recovery Assurance — StepSAFE Praxis",
      summary:
        "Ransomware is not a malware problem; it is a business model with an operations team, a negotiation function and a public relations arm. This Page covers the economics you are actually facing, the payment decision and its legal exposure, whether your backups are real, and the gap between your stated recovery time objective and what will actually happen.",
      competencies: [
        "Explain modern extortion economics — affiliate structure, double and triple extortion, exit scams and re-extortion — well enough to brief an executive committee",
        "Run the payment decision as a structured parallel process with legal, insurance, law enforcement and restore tracks",
        "Assess sanctions exposure under the OFAC advisory and state the mitigating actions that matter",
        "Verify backup immutability and recoverability empirically rather than by policy assertion",
        "Compute a realistic recovery time from measured throughput and dependency ordering, and defend it to a board",
        "Design and facilitate a tabletop that produces owned, dated, verified findings"
      ],
      seal: "seal-extortion-ember",
      steps: [
        {
          id: "ch-incident-extortion-economics",
          kind: "lesson",
          title: "The Business on the Other Side",
          statement:
            "You are not negotiating with malware; you are negotiating with a firm that has a pipeline, a margin target and a reputation to protect.",
          minutes: 30,
          respect: 110,
          trust: 6,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body:
                "The single most useful reframe for an executive audience is that extortion groups run a business with specialisation and a supply chain. Access brokers sell footholds. Affiliates do the intrusion work and take the larger share. Core operators supply the encryptor, the leak site, the negotiation portal and the brand. Launderers move the proceeds. Each layer optimises independently, which is why the actor who breaks in is frequently not the actor who extorts you, why tradecraft is inconsistent within a single intrusion, and why the group's promises about deleting data are worth precisely what a promise from an unaccountable counterparty is worth."
            },
            {
              kind: "list",
              title: "The extortion stack, and what each layer costs you",
              items: [
                "Encryption — the original model. Costs availability. Fully defensible with genuinely immutable backups and rehearsed restore.",
                "Exfiltration and leak threat — double extortion. Costs confidentiality, regulatory exposure and customer trust. Backups do not help at all. This is why organizations with excellent recovery still pay.",
                "Direct pressure on your stakeholders — triple extortion. Costs you control of the narrative: the group emails your customers, calls your journalists, contacts affected individuals, and in some observed cases has filed complaints with regulators about the victim's own disclosure failures.",
                "Infrastructure denial — distributed denial of service against your public services during negotiation, to raise urgency.",
                "Re-extortion — the same data monetised again by a different affiliate or after a group implodes. The Change Healthcare case is the reference: payment was made, and the data still surfaced under a different banner."
              ]
            },
            {
              kind: "metric",
              title: "What the numbers actually say about paying",
              items: [
                "Sophos, surveying 3,400 affected organizations across 17 countries in 2025, found roughly half of victims paid a ransom, and that the average payment came in at about 85 percent of the initial demand — meaning negotiation moves the number, but not by an order of magnitude.",
                "In the same study, 53 percent paid less than the initial ask, 18 percent paid more, and 29 percent paid exactly what was demanded. Paying more than the demand is worth pausing on: it usually reflects a victim negotiating from panic without professional support.",
                "Mean recovery cost excluding any ransom was about 1.53 million dollars, down sharply from the prior year, while backup-based recovery fell to its lowest rate in six years — the two trends together suggest more organizations are recovering, but fewer are recovering from backups.",
                "Recovery within one week rose to 53 percent of victims, but the tail is brutal: a meaningful minority still take more than a month, and those are the organizations where the backup assumptions turned out to be wrong.",
                "Exploited vulnerabilities were the most common technical root cause at around a third of cases, with compromised credentials close behind — both of which are addressable long before the encryptor runs."
              ]
            },
            {
              kind: "prose",
              body:
                "Two structural facts change how you plan. First, the affiliate model means group brands are unstable: the ALPHV/BlackCat operation collapsed shortly after the Change Healthcare payment in circumstances widely read as an exit scam against its own affiliate, and the affiliate then re-extorted the victim under a different name. Any decision that depends on the counterparty honouring an agreement is exposed to this instability. Second, dwell time before encryption is usually days, not minutes — the Change Healthcare intrusion ran from initial access through a remote access portal lacking multi-factor authentication on 12 February to encryption on 21 February. Those nine days are your detection window, and every prevention control you skip is a day you give away."
            },
            {
              kind: "callout",
              title: "The question to put to your executive team before anything happens",
              body:
                "Ask them, in a calm room with no incident running: if our backups work perfectly and we can restore in four days, but the group holds a copy of customer records and will publish in seventy-two hours, do we pay? If the answer is anything other than a documented position with named decision-makers, you do not have a ransomware plan. You have a backup plan, which is a different and smaller thing."
            }
          ],
          awards: ["award-extortion-literacy"],
          glossary: ["double-extortion", "triple-extortion", "ransomware-affiliate", "access-broker", "re-extortion"]
        },
        {
          id: "ch-incident-payment-decision",
          kind: "drill",
          title: "The Payment Decision",
          statement:
            "The payment question is never answered on its own; it is answered by how well you run the four tracks that make it unnecessary or make it defensible.",
          minutes: 30,
          respect: 200,
          trust: 13,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "Executives treat payment as a single binary decision made at a moment. Practitioners treat it as the output of four parallel tracks — restore, negotiation, legal, and evidence — each with an owner, and each of which changes the value of the others. Starting negotiation does not commit you to paying; it buys time, produces proof of decryption capability, and often produces a file listing that is the fastest way to scope your exfiltration. Starting restore in parallel is what gives you the option to walk away. Running them sequentially is how organizations end up paying because they ran out of time rather than because paying was right."
            },
            {
              kind: "table",
              title: "The four tracks, running simultaneously from hour one",
              headers: ["Track", "Owner", "First four hours", "What it produces"],
              rows: [
                [
                  "Restore",
                  "Named restore commander, not the IC",
                  "Verify immutable copies exist and are clean, build the clean recovery environment, start the highest-value system",
                  "A measured, honest estimate of time to restore each tier — the number that makes payment unnecessary or necessary"
                ],
                [
                  "Negotiation",
                  "Professional negotiator engaged through counsel",
                  "Open the channel, ask nothing, request proof of decryption on files you choose and a full file tree of exfiltrated data",
                  "Time, scoping intelligence, and an assessment of whether the counterparty is competent and consistent"
                ],
                [
                  "Legal and regulatory",
                  "General counsel with outside counsel",
                  "Sanctions screening on the actor and wallet, notification clock assessment, insurer notice, law enforcement contact",
                  "The legality envelope and the disclosure timetable, both of which constrain everything else"
                ],
                [
                  "Evidence and scope",
                  "Forensics lead",
                  "Preserve, determine initial access and dwell window, determine what was actually taken versus what is claimed",
                  "The difference between the adversary's story and the truth, which is frequently large in both directions"
                ]
              ]
            },
            {
              kind: "principle",
              title: "The optionality law",
              body:
                "Every hour you spend creating options is worth more than every hour you spend deciding. Open the channel, start the restore, screen the sanctions exposure — none of these commits you, and each one widens the set of futures available at the moment of decision."
            }
          ],
          drill: {
            id: "ch-incident-drill-payment-decision",
            scene:
              "Hour thirty of a ransomware event at a regional health system operating eleven hospitals and forty clinics. Two emergency departments are on diversion; clinicians are on paper. The demand is twelve million dollars, with a leak-site countdown at seventy-two hours. Your immutable backup copies for the electronic health record are confirmed present and clean. The medical imaging archive is a different story: the backup jobs have been reporting success while writing nothing for approximately six weeks, which nobody noticed. The adversary has posted a directory listing that includes what appears to be a patient index. Your cyber insurer has assigned a panel firm. Two board members have separately called the CEO to say the organization must not negotiate with criminals.",
            clock: "Seventy-two hours on the leak site. Clinical leadership needs an answer on imaging within twelve.",
            pressure:
              "Patient safety is degrading measurably. Every hour on paper increases clinical risk, and everyone in the room knows it, which makes fast decisions feel virtuous.",
            prompt: "You are the incident commander advising the CEO. What do you recommend for the next twelve hours?",
            options: [
              {
                id: "ch-incident-drill-payment-opt-pay-now",
                label: "Recommend paying immediately to get the decryptor and shorten the clinical outage.",
                detail: "Patient safety outweighs principle; the fastest path back to imaging is the key.",
                score: -2,
                outcome:
                  "The decryptor arrives and works, and it is slow — single-threaded decryptors commonly run well below restore throughput, and you must still validate every decrypted file. Imaging comes back later than the parallel restore would have delivered for the systems that had good backups, and you have paid before knowing whether payment was even lawful in this case.",
                ripple:
                  "You have created a record showing payment before sanctions screening and before a measured restore estimate. Change Healthcare is the cautionary precedent on the second half: a 22 million dollar payment, publicly confirmed by the chief executive who said he personally made the call, and the data still surfaced afterwards through a re-extortion under a different name."
              },
              {
                id: "ch-incident-drill-payment-opt-refuse",
                label: "Adopt the board members' position: state publicly and internally that the organization does not negotiate with criminals, and commit to restoring from backup.",
                detail: "A clear principled stance removes ambiguity and protects reputation.",
                score: -1,
                outcome:
                  "It is a stance, not a decision, and it does not survive contact with the imaging archive, for which no usable backup exists. Within a day the position reverses under clinical pressure, having already destroyed your negotiating posture by announcing you would never pay.",
                ripple:
                  "Pre-committing publicly removes your own optionality and tells a commercially rational counterparty to escalate on the pressure axis instead of the price axis. Principles belong in a pre-agreed policy with stated exceptions, decided in peacetime, not announced during a crisis."
              },
              {
                id: "ch-incident-drill-payment-opt-parallel",
                label:
                  "Run all four tracks now: name a restore commander and start on the electronic health record, open a negotiation channel through counsel purely to buy time and obtain proof of decryption plus the exfiltration file tree, initiate sanctions screening and law enforcement contact, and set an explicit decision gate at hour seventy-two with written criteria.",
                detail:
                  "Criteria stated in advance: pay only if imaging cannot be reconstructed from modality caches and third-party copies, only if screening clears, only with insurer and counsel concurrence, and only after proof of decryption on files we select.",
                score: 3,
                isBest: true,
                outcome:
                  "The negotiation channel yields the file tree within eight hours, which shows the patient index is real but far smaller than implied. The restore track has the electronic health record up in thirty-one hours. Imaging turns out to be partially reconstructable from modality workstations and an outsourced radiology partner's copies, which nobody had considered because it was not in the backup inventory.",
                ripple:
                  "The decision gate means the CEO faces the payment question once, with a scoped problem, a measured restore estimate, a legality assessment and a proof-of-life test in hand. Whichever way it goes, the record shows a governed process — which is what the regulator, the insurer, the board and eventually the litigation will actually examine."
              },
              {
                id: "ch-incident-drill-payment-opt-deadline",
                label: "Tell the board you will restore from backup and will only pay if restoration is incomplete after twenty-four hours.",
                detail: "A clear commitment with a fallback, communicated so the board can plan.",
                score: -3,
                outcome:
                  "Twenty-four hours is not achievable and you knew it was uncertain when you said it. When you miss it, you have both a credibility failure with the board and a written record stating your willingness to pay on a known date — a record that is discoverable, and which would be catastrophic if it reached the counterparty through any compromised channel.",
                ripple:
                  "Announcing a payment trigger converts a negotiation into a waiting game your counterparty wins by default. Worse, a documented internal commitment to pay at a deadline undermines any later claim that payment was a last resort taken after all alternatives were exhausted."
              }
            ],
            debrief:
              "The best option contains no decision about payment at all, which is the lesson. At hour thirty you cannot make a good payment decision because you lack three inputs: whether restore is feasible for the systems that matter, whether payment is lawful with respect to this actor, and whether the counterparty can actually decrypt. All three are obtainable in parallel, and each takes hours you are otherwise spending on argument. Note the reconstruction finding in the outcome — restore paths outside your backup system are extremely common and almost never inventoried: vendor copies, modality caches, downstream data warehouses, partner systems, regulatory submissions. Ask the question, because your adversary has priced the ransom on the assumption you will not.",
            principle:
              "Do not decide whether to pay. Build, in parallel and quickly, the three facts that make the decision obvious — restore feasibility, legality, and proof the counterparty can perform."
          },
          awards: ["award-parallel-tracks", "award-payment-governance"],
          glossary: ["proof-of-decryption", "leak-site-countdown", "decision-gate", "restore-commander", "sanctions-screening"]
        },
        {
          id: "ch-incident-negotiation-council",
          kind: "council",
          title: "The Room Where Payment Is Decided",
          statement:
            "Your job in that room is not to have an opinion about paying; it is to make sure the decision is made by the right people, with the right facts, in a form that survives every later review.",
          minutes: 32,
          respect: 185,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "The payment room is the highest-stakes meeting a security leader ever attends, and technical excellence is nearly irrelevant in it. What matters is whether you can hold three positions simultaneously: absolute clarity on what is known and unknown, absolute refusal to give a number you cannot defend, and enough emotional steadiness that a frightened executive team can borrow yours. The CEO of UnitedHealth Group told Congress that he personally made the decision to pay in the Change Healthcare case and described it as among the hardest of his career. Note the structure of that: the accountable executive decided, on the record, and could say why. That is what a well-run process produces."
            },
            {
              kind: "table",
              title: "Who must be in the room and what each owes",
              headers: ["Seat", "Owes the room", "Failure mode if absent or unprepared"],
              rows: [
                [
                  "Accountable executive (CEO or delegate)",
                  "The decision itself, and ownership of it afterwards",
                  "The decision drifts to whoever speaks last; nobody can later say who decided"
                ],
                [
                  "General counsel",
                  "Sanctions position, disclosure obligations, privilege posture, and the record",
                  "Payment made into an unassessed legal exposure with strict liability attached"
                ],
                [
                  "Chief financial officer",
                  "Whether the payment mechanism exists at all, and the materiality assessment inputs",
                  "A decision to pay that cannot be executed, because nobody has ever moved cryptocurrency and the process takes days"
                ],
                [
                  "Security leader",
                  "What is known, what is unknown, restore estimate with its confidence interval, and the technical assessment of the counterparty",
                  "Estimates delivered as certainties, which is the single fastest way to lose executive trust permanently"
                ],
                [
                  "Insurer and panel counsel",
                  "Coverage position, approved vendors, and the notification requirements that condition coverage",
                  "Coverage voided by an unapproved vendor or an unnotified decision"
                ],
                [
                  "Communications lead",
                  "What has already been said publicly and what is committed to whom",
                  "A payment decision that contradicts a public statement made six hours earlier"
                ]
              ]
            },
            {
              kind: "list",
              title: "The legal frame, stated plainly for a non-lawyer audience",
              items: [
                "In the United States, OFAC sanctions liability is strict for civil purposes. Not knowing the recipient was sanctioned is not a defence, which is why screening the actor, the wallet and the intermediaries before payment is mandatory rather than prudent.",
                "The OFAC advisory names a self-initiated, timely and complete report to law enforcement, plus full and ongoing cooperation during and after the attack, as a significant mitigating factor in any enforcement matter. That is the clearest published incentive to call the FBI early.",
                "Payment does not discharge notification obligations. Regulatory clocks run on the incident, not on the outcome of your negotiation.",
                "Facilitation counts. Your negotiator, your insurer, your bank and your broker can all incur exposure, which is why they will have their own screening requirements and why routing through unapproved intermediaries can break coverage.",
                "Sanctions regimes outside the United States apply independently. A multinational may face several concurrently, and the strictest one governs the payment."
              ]
            },
            {
              kind: "list",
              title: "Sentences to have ready, and sentences never to say",
              items: [
                "Ready: here is what we know with high confidence, here is what we believe, here is what we do not know, and here is when I will know more.",
                "Ready: my restore estimate is thirty-one hours for tier one with a confidence interval of plus twelve hours, based on measured throughput of the last two systems, not on the recovery time objective in the policy document.",
                "Ready: I recommend we do not decide this now, and here is precisely what changes between now and the decision gate.",
                "Never: we have contained it — unless you can define contained and would repeat the sentence in a deposition.",
                "Never: no customer data was affected — before the exfiltration analysis is complete. This specific sentence has produced regulatory enforcement more than once.",
                "Never: a number you have not measured. An invented restore time is the fastest way to lose the room permanently, because it will be wrong and everyone will remember."
              ]
            },
            {
              kind: "callout",
              title: "Decide the policy in peacetime",
              body:
                "Bring a one-page payment policy to a board meeting when nothing is on fire. It should state the accountable decision-maker, the mandatory pre-conditions (sanctions screening cleared, counsel concurrence, insurer notification, proof of decryption obtained, law enforcement engaged), the categories where the organization will not pay under any circumstances, and the escalation path if the accountable executive is unreachable. The board approving that document in calm conditions is worth more than any amount of eloquence at hour thirty."
            }
          ],
          awards: ["award-payment-room", "award-sanctions-aware"],
          glossary: ["ofac-strict-liability", "panel-counsel", "materiality-input", "payment-policy", "facilitation-risk"]
        },
        {
          id: "ch-incident-backup-immutability",
          kind: "lab",
          title: "Prove the Backups, Do Not Believe Them",
          statement:
            "A backup you have not restored is a hypothesis, and immutability you have not attacked is a marketing claim.",
          minutes: 42,
          respect: 175,
          trust: 11,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body:
                "Adversaries target backups first and deliberately, because backups are the only control that makes encryption worthless. The mature ones spend part of their dwell time enumerating the backup system, deleting or corrupting copies, and sometimes waiting out the retention window on the last clean set. This means the property you need is not backup exists but the identity that can encrypt production cannot delete or alter the backup copies, and that property has to be tested by trying to break it."
            },
            {
              kind: "code",
              title: "Object storage immutability: verify, then attack",
              lang: "bash",
              body:
                "# 1. Confirm object lock is enabled at bucket level and in the mode you think.\n#    Governance mode can be bypassed by a principal with the bypass permission.\n#    Compliance mode cannot be bypassed by anyone, including the root account.\naws s3api get-object-lock-configuration --bucket backups-prod-immutable\n\n# 2. Confirm retention on an actual recent object, not on the policy document.\naws s3api get-object-retention --bucket backups-prod-immutable \\\n  --key 2026/08/14/db-core.full.age\n\n# 3. ATTACK IT. This must fail. If it succeeds, your immutability is decorative.\naws s3api delete-object --bucket backups-prod-immutable \\\n  --key 2026/08/14/db-core.full.age --version-id $VID\n\n# 4. Attack it as the backup service identity, which is the identity an adversary\n#    will actually hold. This is the test everyone skips.\naws --profile backup-agent s3api put-object-retention \\\n  --bucket backups-prod-immutable --key 2026/08/14/db-core.full.age \\\n  --retention 'Mode=COMPLIANCE,RetainUntilDate=2026-08-15T00:00:00Z'\n\n# 5. Check for the quiet killers that remove data without a delete call\naws s3api get-bucket-lifecycle-configuration --bucket backups-prod-immutable\naws s3api get-bucket-replication --bucket backups-prod-immutable\naws s3api get-bucket-versioning --bucket backups-prod-immutable\n"
            },
            {
              kind: "code",
              title: "Repository integrity and a restore that is actually measured",
              lang: "bash",
              body:
                "# Structural check plus real data verification on a sample. A structure-only\n# check passes happily on a repository full of corrupted blobs.\nexport RESTIC_REPOSITORY=s3:s3.amazonaws.com/backups-prod-immutable/core\nrestic check --read-data-subset=10%\nrestic snapshots --compact\n\n# Restore to a clean host and MEASURE. The number you want is throughput,\n# because throughput multiplied by data volume is your real recovery time.\nSTART=$(date -u +%s)\nrestic restore latest --target /restore/db-core --verify\nEND=$(date -u +%s)\nBYTES=$(du -sb /restore/db-core | cut -f1)\necho elapsed_seconds=$((END-START)) bytes=$BYTES mbps=$((BYTES/1048576/(END-START)))\n\n# Then the step that separates real programs from compliant ones:\n# start the application against the restored data and run a functional test.\n# A restored file set that the application rejects is not a recovery.\n/opt/core/bin/verify-restore --dataset /restore/db-core --run-integrity-suite\n\n# ZFS or similar local snapshots: holds prevent destruction even by root scripts\nzfs hold incident-2026-0814 tank/prod@2026-08-13-0200\nzfs holds -r tank/prod@2026-08-13-0200\n"
            },
            {
              kind: "checklist",
              title: "The six properties, each tested rather than asserted",
              items: [
                "Isolation of identity: the credentials that can encrypt production cannot delete, alter or shorten retention on backup copies. Tested by attempting it with the production identity and recording the failure.",
                "Isolation of control plane: the backup system does not authenticate against the same directory as production, so an identity-plane compromise does not reach it.",
                "Immutability with teeth: compliance-mode locks or equivalent, with lifecycle and replication rules audited, because a lifecycle expiry deletes data without ever issuing a delete.",
                "Catalogue survivability: the backup index or catalogue is itself backed up and restorable independently. Losing the catalogue while holding the data is a common and humiliating failure.",
                "Cleanliness: at least one restore point that predates the earliest confirmed adversary artifact, with the retention window long enough to cover a realistic dwell time — not thirty days, when median dwell is measured in weeks and worst cases in months.",
                "Proven recovery: a full restore of the largest tier-one system executed within the last ninety days, with elapsed time, throughput and functional verification recorded."
              ]
            },
            {
              kind: "callout",
              title: "The failure mode this lab exists to catch",
              body:
                "Backup jobs that report success while writing nothing are common, long-lived and invisible, because monitoring watches job status rather than the size and content of what was written. Alert on unexpected drops in backup size, on restore-test failures, and on any change to retention or lifecycle configuration. A six-week silent gap is not an exotic scenario; it is the single most frequently discovered problem when organizations finally test."
            }
          ],
          praxis:
            "Test all six properties against your production backup estate, including actively attempting deletion with the production identity and with the backup service identity, and perform one timed full restore with functional verification.",
          evidence:
            "The command transcript showing attempted deletions failing, the measured restore throughput and elapsed time, and the functional verification result — plus a written list of every property that failed and its remediation owner.",
          awards: ["award-immutability-proven", "award-timed-restore"],
          glossary: ["object-lock-compliance-mode", "backup-catalogue", "restore-throughput", "retention-window", "control-plane-isolation"]
        },
        {
          id: "ch-incident-restore-gap",
          kind: "lesson",
          title: "The Restore-Time Reality Gap",
          statement:
            "Your recovery time objective is a number somebody wrote in a document; your recovery time is a physical property of your data volume, your dependency graph and your staffing.",
          minutes: 34,
          respect: 165,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "Almost every organization has recovery time objectives that were negotiated rather than measured. The gap between the negotiated number and the physical one has four sources, and they compound. Serial dependency: you cannot restore the application before the database, the database before the directory, the directory before the network, and each layer's estimate assumed the others were already up. Throughput: restoring forty terabytes at four hundred megabytes per second takes over a day of pure transfer even if nothing goes wrong. Verification: restored is not the same as trusted, and in a security event every restored system needs assurance it is not carrying the adversary back in. Staffing: the same twelve people cannot restore two hundred systems in parallel, and by hour thirty they are not the same twelve people."
            },
            {
              kind: "numbered",
              title: "Compute your real number",
              items: [
                "Draw the true dependency chain for one tier-one service, all the way down to name resolution, time synchronisation, certificate issuance and authentication. Most teams discover a cycle here — the thing they need to restore first requires something that comes later.",
                "Measure actual restore throughput for each tier from a real timed restore, not from the storage vendor's specification sheet.",
                "Add verification time per system: integrity checking, malware assurance, functional test. In a security recovery this is often larger than the transfer time and is nearly always omitted from the plan.",
                "Apply a parallelism ceiling derived from your actual staffing and from shared bottlenecks — network egress, hypervisor capacity, the single senior engineer who understands the message bus.",
                "Add the identity rebuild if the identity plane is implicated, which is measured in days rather than hours and which blocks everything downstream.",
                "Present the result as a range with the assumptions written out. A range with stated assumptions is credible; a point estimate is a hostage."
              ]
            },
            {
              kind: "table",
              title: "Where the plan and reality diverge",
              headers: ["Assumption in the plan", "What actually happens", "Correction"],
              rows: [
                [
                  "Restore in parallel across all systems",
                  "Shared network and storage saturate at roughly four to eight concurrent streams",
                  "Measure the saturation point and build the restore order around it, tier one first, explicitly sequenced"
                ],
                [
                  "The recovery environment is ready",
                  "It authenticates against the compromised directory, or its own credentials expired last quarter",
                  "Build and test the clean room quarterly, with hardware-token authentication independent of production identity"
                ],
                [
                  "Staff work continuously",
                  "Effective output collapses after roughly sixteen hours and error rates rise sharply",
                  "Plan three shifts from hour zero; the third shift is what makes day three survivable"
                ],
                [
                  "Restored equals safe",
                  "Restoring a system with the original vulnerability reintroduces the initial access vector",
                  "Patch and harden during restore, in the recovery environment, before the system rejoins the network"
                ],
                [
                  "The vendor will help",
                  "Vendor support is at business-hours capacity and you are one of many callers during a widespread event",
                  "Pre-negotiate emergency escalation contacts and test them once a year"
                ]
              ]
            },
            {
              kind: "quote",
              body:
                "We had to install four thousand new servers, forty-five thousand new PCs, two and a half thousand applications, and that was done in a heroic effort over ten days. Normally I would say it is going to take six months.",
              source: "Maersk chairman Jim Hagemann Snabe, describing the NotPetya rebuild — note that ten days was the extraordinary outcome, not the plan"
            },
            {
              kind: "callout",
              title: "Availability is a security property",
              body:
                "The July 2024 CrowdStrike event is the cleanest teaching case here precisely because there was no adversary. A content update whose template type defined twenty-one input fields met sensor code supplying twenty; a missing runtime array bounds check turned that into an out-of-bounds read, and roughly eight and a half million Windows hosts went down. Delta alone cancelled around seven thousand flights over five days. Recovery was slow largely because it required physical or console access per machine. If your incident response plan assumes your endpoint agent, your identity provider and your management plane are available, you have written a plan for a category of incident that keeps not happening."
            }
          ],
          awards: ["award-real-rto", "award-dependency-cycle-breaker"],
          glossary: ["recovery-time-objective", "restore-ordering", "clean-room-recovery", "parallelism-ceiling", "availability-as-security"]
        },
        {
          id: "ch-incident-ransom-tabletop",
          kind: "field",
          title: "Design a Tabletop That Finds a Real Gap",
          statement:
            "A tabletop that confirms your plan works was designed to confirm your plan works, and you have spent four hours purchasing reassurance.",
          minutes: 50,
          respect: 200,
          trust: 13,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "The difference between a theatre tabletop and a useful one is almost entirely in the design, and the design principle is simple: aim every inject at a decision your organization has never made, not at a procedure it has already documented. Nobody learns anything from walking through the notification matrix. People learn a great deal from being asked who specifically can authorise a twelve million dollar payment when the CEO is on a flight and the CFO is the one whose mailbox is compromised, and from discovering that the answer takes eleven minutes of confused discussion to produce."
            },
            {
              kind: "numbered",
              title: "Designing the exercise",
              items: [
                "Pick the scenario from your own risk register, not from a template. If your identity provider is your single largest concentration of risk, the scenario is an identity provider compromise, however uncomfortable that is for the team that owns it.",
                "Write the injects backwards from the decisions you want to test. Each inject exists to force exactly one decision; if it does not, cut it.",
                "Include at least one inject that breaks an assumption in the plan — the on-call commander is unreachable, the incident channel itself is compromised, the backup team lead is the person whose credentials were used.",
                "Include one external inject with an unforgiving clock: a journalist with accurate details and a two-hour deadline, or a regulator asking a direct question.",
                "Include one inject that produces a false or ambiguous signal, so you can observe whether the group updates on evidence or defends its first hypothesis.",
                "Put the executives in the room. A tabletop of the security team tests the security team; the failures you actually need to find live at the boundary between security and the business.",
                "Have someone in the room whose only job is to note every question asked that nobody could answer. That list is the real output."
              ]
            },
            {
              kind: "list",
              title: "Findings that recur in almost every well-run ransomware tabletop",
              items: [
                "Nobody knows whether the organization can technically execute a cryptocurrency payment, or how long acquiring the funds takes. The answer is frequently days.",
                "The out-of-band communications plan exists but has never been activated cold, and the accounts have expired or the devices have not been rebuilt.",
                "The regulatory clock is assumed to start at forensic certainty rather than at the point the applicable standard actually specifies, which is nearly always earlier.",
                "The incident commander role is assigned to a person who will predictably be unavailable, and there is no second or third trained commander.",
                "The insurer's panel requirements conflict with the retainer firm the team intends to call, and nobody discovers this until coverage is at stake.",
                "No one has decided who talks to law enforcement, or whether engaging law enforcement is the default posture."
              ]
            },
            {
              kind: "table",
              title: "The findings register — the only artifact that matters",
              headers: ["Column", "Rule"],
              rows: [
                ["Finding", "One sentence stating the gap in observable terms, not the recommendation"],
                ["Evidence", "The moment in the exercise that revealed it, with the time and the inject number"],
                ["Owner", "A named person, never a team and never a role"],
                ["Due date", "A date, and it is inside ninety days or the finding is being deferred rather than accepted"],
                ["Verification method", "How you will prove it is closed, defined before work starts — a test, a timed drill, a document with a signature"],
                ["Status", "Open, closed with evidence attached, or explicitly risk-accepted with a named accepting executive"]
              ]
            },
            {
              kind: "callout",
              title: "The measure of a good exercise",
              body:
                "Count the number of times someone in the room said a version of I assumed somebody else did that. Under three, your scenario was too gentle. Over fifteen, you may have overwhelmed the group and should split into two exercises. And if the findings register is not shorter thirty days later, you did not run an exercise; you ran an event."
            }
          ],
          praxis:
            "Design and facilitate a three-hour ransomware tabletop with executives present, built from your own risk register, with at least one assumption-breaking inject and one hard external clock.",
          evidence:
            "The inject script, the findings register with named owners and verification methods, and evidence that at least two findings were closed within ninety days with their verification performed.",
          awards: ["award-tabletop-designer", "award-findings-closed"],
          glossary: ["tabletop-inject", "findings-register", "assumption-breaking-inject", "risk-acceptance", "exercise-facilitation"]
        }
      ]
    },
    {
      id: "ch-incident-page-clock",
      title: "THE CLOCK AND THE ROOM",
      credential: "Certified in Crisis Communication and Regulatory Disclosure — StepSAFE Praxis",
      summary:
        "Everything you say during a crisis is permanent, and several regulators are running stopwatches you do not control. This Page covers the first hour of executive communication, the materiality determination and its four-business-day clock, the overlapping European deadlines, law enforcement engagement, and how to write a customer notification that does not become the story.",
      competencies: [
        "Deliver a first-hour executive briefing that conveys uncertainty accurately without losing the room",
        "Run a materiality determination process that satisfies without unreasonable delay and distinguishes Item 1.05 from Item 8.01",
        "Map overlapping notification clocks across SEC, GDPR, NIS2, DORA, sectoral and state regimes for a single incident",
        "Decide law enforcement engagement deliberately, understanding what you gain and what you give up",
        "Draft holding statements and customer notifications that are accurate, complete and revisable",
        "Build a disclosure clock engine that computes every applicable deadline from a single incident timestamp"
      ],
      seal: "seal-clock-ember",
      steps: [
        {
          id: "ch-incident-first-hour-exec",
          kind: "council",
          title: "The First Hour of Executive Communication",
          statement:
            "In the first hour you have almost no facts and all of your credibility, and how you spend the second determines how much of the first you keep.",
          minutes: 30,
          respect: 150,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "Executives are not asking for data in the first hour. They are asking three questions underneath the ones they say out loud: are we going to be all right, is someone competent in charge, and what will I have to explain to somebody else. If you answer only the literal question — how many systems are affected — you will be asked it again every twenty minutes, because the real question was never addressed. The security leaders who hold rooms well answer the underlying questions explicitly and early, then give the facts."
            },
            {
              kind: "numbered",
              title: "The first executive briefing, six sentences, no slides",
              items: [
                "What we believe has happened, in one sentence, with an explicit confidence word: confirmed, believed, or suspected.",
                "What we are doing right now, in one sentence, naming the commander so that the room knows a human owns it.",
                "What we do not know yet, stated as a short list rather than hedged into vagueness. Naming the unknowns is what makes the knowns credible.",
                "What we need from you — usually authority, not information: authority to take a system down, to engage outside counsel, to spend without a purchase order.",
                "What could get materially worse and what would tell us early. This is the sentence that prevents the room from being surprised later, which is the thing that actually destroys trust.",
                "When you will hear from me next, as a time, and then meet it exactly. Meeting a stated update time three times in a row buys you more latitude than any amount of technical fluency."
              ]
            },
            {
              kind: "compare",
              title: "Two ways to say the same true thing",
              left: {
                title: "Loses the room",
                items: [
                  "It looks like we might have some kind of breach, we are still figuring it out.",
                  "I would rather not speculate.",
                  "We have contained it. (said at hour two)",
                  "No customer data was affected. (said before exfiltration analysis exists)",
                  "I will let you know when I know more.",
                  "The team is working incredibly hard on this."
                ]
              },
              right: {
                title: "Holds the room",
                items: [
                  "Confirmed: an external party authenticated as a service account at 02:45 and accessed the finance file cluster.",
                  "Here are the three things I do not know, and here is when I expect to know each.",
                  "The adversary path we identified is closed. We have not yet established that it was the only one.",
                  "We have no evidence of customer data movement. We also do not yet have the logging to rule it out, and getting that is the priority.",
                  "Next update at 09:00, from me, in this channel, whether or not there is news.",
                  "I need one decision from you by 08:00: whether the payments platform can be offline for four hours."
                ]
              }
            },
            {
              kind: "list",
              title: "Sentences that create legal and regulatory exposure",
              items: [
                "Any unqualified all-clear. Contained, resolved and no impact are statements a regulator will later hold you to precisely, and public companies have faced enforcement over disclosure language that minimised the scope of an intrusion.",
                "Numbers of affected records before the analysis supports them. Every subsequent correction upward is reported as a new breach even when the underlying facts never changed.",
                "Attribution to a named actor or nation. It is rarely load-bearing for your response, it is frequently wrong early, and it converts a technical incident into a geopolitical one.",
                "Commitments to restoration times. Give ranges with assumptions or give nothing.",
                "Speculation in writing about what the organization should have done. That is post-incident work, and in the first hour it is only a gift to a future plaintiff.",
                "Any statement that customer notification is not required, before counsel has performed the analysis in every applicable jurisdiction."
              ]
            },
            {
              kind: "callout",
              title: "The holding statement is written before the incident",
              body:
                "Pre-draft and pre-clear three artifacts with counsel and communications while nothing is happening: a two-paragraph external holding statement with blanks, an internal all-staff message that tells employees what to do and what not to say, and a customer-facing status page template. In the first hour you will not have time to negotiate language with legal, and the version you write under pressure is always worse than the version you wrote calmly."
            }
          ],
          awards: ["award-first-hour-briefing", "award-holds-the-room"],
          glossary: ["holding-statement", "confidence-language", "executive-briefing", "all-clear-trap"]
        },
        {
          id: "ch-incident-materiality-clock",
          kind: "drill",
          title: "Four Business Days From When, Exactly",
          statement:
            "The clock does not start when you are certain; it starts when a reasonable process would have determined materiality, and a slow process is the violation.",
          minutes: 28,
          respect: 190,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "Item 1.05 of Form 8-K requires a registrant to disclose a material cybersecurity incident within four business days of determining that the incident is material. Two features of that sentence do all the work. First, the trigger is the materiality determination, not discovery — which means the clock is under your control in a way that invites abuse. Second, the determination must be made without unreasonable delay. Together these mean the enforcement risk is not usually about filing late relative to your determination; it is about a determination that arrives suspiciously late relative to what you knew."
            },
            {
              kind: "list",
              title: "What a defensible determination process looks like",
              items: [
                "A standing disclosure committee with named members, convened on a defined trigger rather than on request.",
                "A written materiality framework covering both quantitative and qualitative factors — operational disruption, data sensitivity, customer and regulatory impact, reputational harm, and the reasonable investor standard rather than only a dollar threshold.",
                "Documented assessments at each checkpoint that record what was known, what was assessed, and the next assessment time, so the record shows continuous evaluation rather than a gap.",
                "A clear distinction in practice between Item 1.05 for material incidents and Item 8.01 for voluntary disclosure of incidents that are not material — the Division of Corporation Finance made this distinction explicit in its May 2024 statement after observing 1.05 filings for incidents that were not material.",
                "Legal, finance and security in the same process. A materiality determination made by security alone is not a determination, and one made by finance without technical input is a guess."
              ]
            },
            {
              kind: "principle",
              title: "The determination law",
              body:
                "You cannot stop the clock by refusing to look at it. Ambiguity about materiality obliges you to assess more frequently, not to defer the assessment until the facts are comfortable."
            }
          ],
          drill: {
            id: "ch-incident-drill-materiality",
            scene:
              "Tuesday, 16:10. You are the CISO of a listed company. Forensics has confirmed within the last ninety minutes that an adversary exfiltrated a production database containing records for approximately 1.2 million customers, including names, addresses and partial payment identifiers. Scope beyond that database is not yet established. The CFO says that since the financial impact is unquantified, the incident cannot yet be deemed material and therefore the clock has not started. The general counsel wants to wait for the full forensic report, which the vendor estimates at two weeks. The head of investor relations has heard a rumour that a journalist is already calling customers.",
            clock: "Markets open in seventeen hours. The forensic report is fourteen days out. Four business days is the number everyone in the room half-remembers.",
            pressure:
              "Two of the most senior people in the company have stated a position, and both are wrong in different directions. You are the most junior person who understands why.",
            prompt: "You are the CISO. What do you drive in the next twenty-four hours?",
            options: [
              {
                id: "ch-incident-drill-materiality-opt-file",
                label: "Push to file an Item 1.05 8-K tonight to be safe.",
                detail: "Over-disclosure is safer than under-disclosure, and filing early demonstrates good faith.",
                score: -1,
                outcome:
                  "You file a materiality determination you have not actually made, with facts that change three times in the following week. Each amendment is a news event. If the incident later proves immaterial, you have told investors that a non-material event was material, which is its own misstatement problem.",
                ripple:
                  "This is the failure mode the SEC staff specifically addressed in May 2024, pointing companies toward Item 8.01 for incidents that are not material. Reflexive over-filing degrades the signal value of Item 1.05 for every investor and does not, in fact, buy you safety."
              },
              {
                id: "ch-incident-drill-materiality-opt-wait",
                label: "Accept the CFO's framing: the clock has not started because materiality is undetermined. Revisit when the forensic report lands.",
                detail: "The rule is explicit that the trigger is the determination, and no determination has been made.",
                score: -3,
                outcome:
                  "Fourteen days of no assessment, no committee minutes and no documented evaluation. When the journalist publishes on day three, the company is disclosing reactively with no record of having evaluated materiality at any point in between.",
                ripple:
                  "The without-unreasonable-delay standard makes this the highest-risk option available. A gap in the record is read as avoidance, and the fact that the technical leader flagged it and was overruled will be visible in the same record."
              },
              {
                id: "ch-incident-drill-materiality-opt-process",
                label:
                  "Convene the disclosure committee within twenty-four hours with a written materiality assessment, document known and unknown facts, set the next assessment checkpoint at forty-eight hours, and have both an Item 1.05 and an Item 8.01 draft prepared in parallel.",
                detail:
                  "Separately: brief counsel that a journalist may publish, so the timeline reflects the possibility of forced disclosure, and confirm the state and international notification analyses are running on their own clocks.",
                score: 3,
                isBest: true,
                outcome:
                  "The committee determines on Wednesday that confirmed exfiltration of 1.2 million customer records is qualitatively material regardless of the unquantified financial impact. The four-business-day clock starts from that determination with a documented basis, and the filing goes out Monday with a draft that has already been through counsel twice.",
                ripple:
                  "The minutes are the artifact that matters. They show a company that evaluated materiality promptly and repeatedly on the facts available, which is what the standard actually asks. As a bonus, having both drafts ready removes the pressure to decide the question in order to produce the document."
              },
              {
                id: "ch-incident-drill-materiality-opt-preempt",
                label: "Get ahead of the journalist with a proactive press release describing the incident and stating that it is not expected to be material.",
                detail: "Control the narrative before someone else writes it, and manage market expectations at the same time.",
                score: -2,
                outcome:
                  "You have made a public materiality assertion with no process behind it, before the committee has met, on facts that are still moving. If the assessment later changes, the earlier statement becomes the problem rather than the incident.",
                ripple:
                  "Public statements are subject to the same accuracy standards as filings. Enforcement actions in this area have turned on language that downplayed the scope of an intrusion, not on the timing of the original filing. Narrative control is not a defence against a misstatement."
              }
            ],
            debrief:
              "The CFO's argument sounds rigorous and is the most dangerous thing in the room, because it uses a correct reading of the trigger to justify not performing the assessment that the trigger depends on. The correct move is procedural, not substantive: you cannot know tonight whether this is material, but you can guarantee that a competent process evaluates it promptly and leaves a record. Notice too that materiality is not purely quantitative — confirmed exfiltration of over a million customer records is the kind of qualitative fact a reasonable investor would want, whatever the eventual dollar figure. And note the parallel clocks: the SEC question is one of at least four running simultaneously, and the European ones may well be shorter.",
            principle:
              "When you cannot determine the answer, determine the process, put it on the record, and set the next checkpoint. Process is the only thing you can produce quickly that is still true later."
          },
          awards: ["award-materiality-process", "award-disclosure-committee"],
          glossary: ["item-1-05", "item-8-01", "materiality-determination", "disclosure-committee", "reasonable-investor-standard"]
        },
        {
          id: "ch-incident-notification-clocks",
          kind: "lesson",
          title: "Every Clock That Is Running",
          statement:
            "One incident starts many stopwatches at different moments with different definitions of aware, and the shortest one governs your planning.",
          minutes: 28,
          respect: 120,
          trust: 7,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body:
                "The common failure is not ignorance of the rules; it is treating them as sequential rather than concurrent, and assuming they all start when the forensic picture is complete. They do not. Most start at awareness or at classification, both of which precede certainty by a long way. Build the matrix in advance for your actual footprint, because deriving it during an incident consumes exactly the people you need for other things."
            },
            {
              kind: "table",
              title: "The clocks, and when each one starts",
              headers: ["Regime", "Deadline", "Starts at", "Filed to"],
              rows: [
                [
                  "SEC Form 8-K Item 1.05",
                  "Four business days",
                  "Determination that the incident is material, which must be made without unreasonable delay",
                  "The Commission, publicly"
                ],
                [
                  "GDPR Article 33",
                  "72 hours",
                  "Becoming aware of a personal data breach, not completing the investigation",
                  "The lead supervisory authority; Article 34 separately requires communication to individuals without undue delay where risk is high"
                ],
                [
                  "NIS2 Article 23",
                  "24 hours early warning, 72 hours notification, one month final report",
                  "Becoming aware of a significant incident",
                  "The national CSIRT or competent authority"
                ],
                [
                  "DORA",
                  "Four hours from classification as major, and never more than 24 hours from awareness; intermediate at 72 hours; final within one month",
                  "Classification of the incident as major",
                  "The relevant financial supervisory authority"
                ],
                [
                  "Sectoral and national regimes",
                  "Varies widely, some as short as 24 hours",
                  "Typically awareness or reasonable belief",
                  "Sector regulators, national authorities, and in some jurisdictions law enforcement directly"
                ],
                [
                  "Contractual",
                  "Frequently 24 to 72 hours, occasionally shorter",
                  "Awareness, as defined in each contract, which is rarely defined consistently",
                  "Customers, partners and processors — and this is the obligation most often missed entirely"
                ]
              ]
            },
            {
              kind: "principle",
              title: "The concurrency law",
              body:
                "Plan against the shortest clock in your footprint, not the most familiar one. A financial entity operating in the European Union is planning against four hours, and everything else follows comfortably behind it."
            },
            {
              kind: "list",
              title: "The traps inside the definitions",
              items: [
                "Aware is not confirmed. Most regimes treat awareness as a reasonable degree of certainty that an incident has occurred, which arrives well before you know its scope.",
                "Business days are not days. Four business days across a public holiday weekend is materially different from four calendar days, in both directions.",
                "Initial reports are expected to be incomplete. Regulators design staged reporting precisely because they know you will not have the full picture. Filing an accurate incomplete report on time beats a complete report that is late.",
                "Processor and controller roles change who notifies whom, and a processor typically owes the controller notice without undue delay, which is functionally immediate.",
                "Contractual clocks frequently bind harder than regulatory ones and are enforced by counterparties who are angry rather than by a regulator following a process.",
                "Third-party incidents start your clocks too. When a service provider is compromised, your obligations run on your awareness, not on when the provider gets around to telling you."
              ]
            },
            {
              kind: "callout",
              title: "The single most useful preparation",
              body:
                "Maintain a living register that maps each regulated entity, jurisdiction, data category and material contract to its notification obligation, the trigger definition, the deadline, the recipient and the named human who files it. Review it quarterly. During an incident it turns a research project into a lookup, and it is also the artifact that most reliably impresses a regulator asking whether you were prepared."
            }
          ],
          awards: ["award-clock-matrix"],
          glossary: ["gdpr-article-33", "nis2-early-warning", "dora-major-incident", "notification-register", "processor-obligation"]
        },
        {
          id: "ch-incident-law-enforcement",
          kind: "lesson",
          title: "Calling Law Enforcement, Deliberately",
          statement:
            "Engage law enforcement because you decided the trade is worth it, not because someone in the room said we should probably call the FBI.",
          minutes: 26,
          respect: 130,
          trust: 8,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body:
                "Law enforcement engagement is frequently either reflexive or avoided, and both are failures of decision-making. The trade is real and it has shape. What you gain is intelligence you cannot obtain otherwise — including, occasionally, decryption keys or seized infrastructure — a documented mitigating factor in sanctions enforcement, credibility with regulators and customers, and in some cases assistance with victim notification. What you give up is a degree of control over timing and narrative, the possibility that an ongoing investigation constrains what you can say, and the fact that anything you tell them exists outside your privilege boundary."
            },
            {
              kind: "compare",
              title: "The trade, stated honestly",
              left: {
                title: "What engagement gives you",
                items: [
                  "Actor-specific intelligence, including whether this affiliate has honoured decryption before.",
                  "The named mitigating factor in the OFAC advisory: self-initiated, timely and complete reporting plus ongoing cooperation.",
                  "Occasional access to seized keys or infrastructure takedowns that change your options.",
                  "A credibility signal to regulators, insurers and enterprise customers that is difficult to manufacture any other way.",
                  "A channel for attribution work that you are neither resourced nor authorised to do yourself."
                ]
              },
              right: {
                title: "What engagement costs you",
                items: [
                  "Some loss of control over disclosure timing if an investigation is active.",
                  "Information shared is generally outside any privilege you have constructed.",
                  "Time from your most senior responders for briefings during the hours you can least afford it.",
                  "Occasional divergence of interest: their objective is prosecution, yours is recovery, and those imply different timelines.",
                  "In multinational incidents, several agencies with different expectations and no coordination between them."
                ]
              }
            },
            {
              kind: "numbered",
              title: "Doing it well",
              items: [
                "Establish the relationship before the incident. Meet your local field office, know the agent's name, and confirm the after-hours number works. The first call should not be your first contact.",
                "Decide the default posture in policy, in peacetime, with named exceptions. A default of yes with counsel present is defensible; an ad hoc decision at hour four is not.",
                "Route the contact through counsel so that privilege decisions are made deliberately rather than accidentally by an engineer on a phone call.",
                "Share indicators generously and internal deliberations sparingly. Technical artifacts are what they can act on; your team's speculation about who is to blame is not.",
                "Ask directly what they can tell you. Agencies vary enormously in what they will share, and asking early sets expectations correctly on both sides.",
                "Record every interaction in the incident log — who, when, what was provided — because the completeness of your reporting is exactly what a mitigating-factor argument later depends on."
              ]
            },
            {
              kind: "callout",
              title: "Reporting is not the same as engagement",
              body:
                "Filing a report with a national cyber authority to meet an obligation, sharing indicators with a sector information-sharing organisation, and inviting a criminal investigation into your environment are three different acts with three different consequences. Decide each one separately. Teams that conflate them either over-share into a criminal process they did not intend to start, or fail an obligation they thought they had satisfied by talking to somebody."
            }
          ],
          awards: ["award-le-relationship"],
          glossary: ["law-enforcement-engagement", "information-sharing", "mitigating-factor", "privilege-boundary"]
        },
        {
          id: "ch-incident-customer-notification",
          kind: "field",
          title: "Write the Notification Before You Need It",
          statement:
            "The notification is the only artifact of your incident that most people will ever read, and it will be read as evidence of how you behaved.",
          minutes: 45,
          respect: 175,
          trust: 11,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "Customer notifications fail in a narrow and predictable set of ways: they hedge until they say nothing, they lead with reassurance the reader has not yet earned reasons to accept, they use passive constructions that read as evasion, they bury the concrete action the reader must take, or they promise a completeness that a later update contradicts. The strongest notifications share a shape: what happened, what it means for you specifically, what we have done, what you should do, and how you will hear more. Written in that order, in plain language, without the word robust."
            },
            {
              kind: "numbered",
              title: "The five moves of a notification people trust",
              items: [
                "Lead with the fact, not the framing. State what happened and when, in the first two sentences, in the active voice, naming the organization as the actor of its own sentences.",
                "Be specific about scope, including its edges. What was affected, what was not, and what you have not yet been able to determine. Naming the unknown is what makes the known believable.",
                "Give the reader their own answer. A generic notice makes every reader assume the worst applies to them. Where possible, tell each recipient which categories of their data were involved.",
                "Put the action the reader must take in its own block, early, in imperative sentences. If there is no action, say so explicitly rather than leaving them to search.",
                "Commit to a next update with a date, and then meet it. A follow-up that arrives when promised repairs more trust than the original notice cost."
              ]
            },
            {
              kind: "list",
              title: "Language to strike on sight",
              items: [
                "Sophisticated attack — it is used so universally that readers now parse it as an excuse, and it is frequently untrue.",
                "Out of an abundance of caution — signals that you are notifying for legal reasons rather than because the reader needs to know.",
                "We take security very seriously — occupies space, conveys nothing, and reliably attracts derision.",
                "May have been affected, when the analysis actually supports a firmer statement in either direction.",
                "Passive constructions that hide the actor: data was accessed rather than an attacker accessed data.",
                "Any claim that no evidence of misuse has been found, unless you also explain what you looked at and for how long, because otherwise it means only that you did not look."
              ]
            },
            {
              kind: "checklist",
              title: "The notification kit, prepared in advance",
              items: [
                "Holding statement with blanks, pre-cleared by counsel and communications, deployable in under fifteen minutes.",
                "Customer notification templates for each material data category, mapped to the jurisdictional requirements each must satisfy.",
                "An FAQ covering the twenty questions your support organisation will actually receive, with answers approved in advance.",
                "A status page that is hosted independently of the infrastructure it reports on, tested by taking the primary environment offline.",
                "An internal all-staff message telling employees what happened, what to do, and specifically what not to say, including on personal social accounts.",
                "A named approval chain with a maximum decision time per approver, because a notification that requires six sequential approvals will miss every clock in the previous step."
              ]
            },
            {
              kind: "callout",
              title: "The reference example worth studying",
              body:
                "Read published post-incident write-ups from vendors who disclosed their own root cause in technical detail — the CrowdStrike Channel File 291 analysis is a strong recent example, and Okta's published root cause for its 2023 support system compromise is another. Both name the specific mechanism, including the embarrassing part, and both are more credible than any amount of careful phrasing would have been. Specificity is the cheapest trust you will ever buy."
            }
          ],
          praxis:
            "Build the complete notification kit for your organization, get it pre-cleared by counsel and communications, and test the status page by taking the primary environment offline in a maintenance window.",
          evidence:
            "The pre-cleared templates with approval signatures and dates, the independently hosted status page with a test transcript, and a timed drill record showing elapsed time from decision to published holding statement.",
          awards: ["award-notification-kit", "award-plain-language"],
          glossary: ["holding-statement", "notification-template", "status-page-independence", "approval-chain"]
        },
        {
          id: "ch-incident-disclosure-machine",
          kind: "lab",
          title: "The Disclosure Clock Engine",
          statement:
            "Deadline arithmetic performed by tired humans at three in the morning is a control failure waiting to be discovered by a regulator.",
          minutes: 36,
          respect: 160,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "This lab builds a small, boring, high-leverage tool: a machine-readable register of your notification obligations and a script that takes one incident timestamp plus a few facts and prints every deadline you are now running against, ordered by urgency. It removes an entire class of error — the missed contractual clock, the business-day miscalculation across a holiday, the obligation that belonged to a subsidiary nobody thought of. It also becomes an audit artifact that demonstrates preparedness better than a policy document ever will."
            },
            {
              kind: "code",
              title: "The obligations register, one entry per obligation",
              lang: "yaml",
              body:
                "# obligations.yaml — reviewed quarterly by legal and security together.\n# start_event values: awareness | materiality_determination | classification_major\n# unit values: hours | business_days | calendar_days\n\n- id: sec-8k-1-05\n  applies_when:\n    entity: listed-parent\n    condition: incident determined material\n  deadline: 4\n  unit: business_days\n  start_event: materiality_determination\n  recipient: US Securities and Exchange Commission, Form 8-K Item 1.05\n  owner: general-counsel\n  note: >\n    Determination itself must be made without unreasonable delay.\n    Non-material incidents disclosed voluntarily belong under Item 8.01.\n\n- id: gdpr-33\n  applies_when:\n    entity: eu-controller\n    condition: personal data breach with risk to individuals\n  deadline: 72\n  unit: hours\n  start_event: awareness\n  recipient: lead supervisory authority\n  owner: data-protection-officer\n  note: Article 34 communication to data subjects runs separately on high risk.\n\n- id: nis2-early-warning\n  applies_when:\n    entity: eu-essential-entity\n    condition: significant incident\n  deadline: 24\n  unit: hours\n  start_event: awareness\n  recipient: national CSIRT\n  owner: head-of-compliance\n  note: Followed by 72 hour notification and one month final report.\n\n- id: dora-initial\n  applies_when:\n    entity: eu-financial-entity\n    condition: incident classified major\n  deadline: 4\n  unit: hours\n  start_event: classification_major\n  recipient: competent financial authority\n  owner: head-of-operational-resilience\n  note: >\n    Never later than 24 hours from awareness even if classification is slow,\n    which makes the classification step itself time-critical.\n\n- id: contract-northwind-msa\n  applies_when:\n    entity: subsidiary-eu\n    condition: any security incident affecting customer environment\n  deadline: 24\n  unit: hours\n  start_event: awareness\n  recipient: customer security contact per MSA schedule 4\n  owner: account-security-lead\n  note: Shorter than every regulatory clock. Most commonly missed obligation.\n"
            },
            {
              kind: "code",
              title: "The engine — one timestamp in, every deadline out",
              lang: "python",
              body:
                "import sys, yaml\nfrom datetime import datetime, timedelta, timezone\n\n# Holidays that shift business-day arithmetic. Keep this list current per market.\nHOLIDAYS = {'2026-09-07', '2026-11-26', '2026-12-25'}\n\ndef add_business_days(start, n):\n    d = start\n    added = 0\n    while added < n:\n        d = d + timedelta(days=1)\n        if d.weekday() < 5 and d.strftime('%Y-%m-%d') not in HOLIDAYS:\n            added += 1\n    return d\n\ndef deadline_for(ob, events):\n    start = events.get(ob['start_event'])\n    if start is None:\n        return None, 'NOT STARTED: ' + ob['start_event'] + ' has not occurred'\n    if ob['unit'] == 'hours':\n        return start + timedelta(hours=ob['deadline']), None\n    if ob['unit'] == 'calendar_days':\n        return start + timedelta(days=ob['deadline']), None\n    return add_business_days(start, ob['deadline']), None\n\ndef main(path, entities):\n    now = datetime.now(timezone.utc)\n    events = {\n        # Fill these from the incident record. Leave a value out and the\n        # engine reports the obligation as not yet started, which is itself\n        # a prompt to ask why the triggering assessment has not happened.\n        'awareness': datetime(2026, 8, 14, 2, 44, tzinfo=timezone.utc),\n        'materiality_determination': None,\n        'classification_major': datetime(2026, 8, 14, 6, 10, tzinfo=timezone.utc),\n    }\n    events = {k: v for k, v in events.items() if v is not None}\n\n    rows = []\n    for ob in yaml.safe_load(open(path)):\n        if ob['applies_when']['entity'] not in entities:\n            continue\n        due, note = deadline_for(ob, events)\n        if due is None:\n            rows.append((None, ob['id'], note, ob['owner']))\n        else:\n            remaining = (due - now).total_seconds() / 3600.0\n            rows.append((remaining, ob['id'],\n                         due.strftime('%Y-%m-%dT%H:%MZ'), ob['owner']))\n\n    started = sorted([r for r in rows if r[0] is not None], key=lambda r: r[0])\n    pending = [r for r in rows if r[0] is None]\n\n    print('RUNNING CLOCKS, most urgent first')\n    for rem, oid, due, owner in started:\n        flag = 'BREACHED' if rem < 0 else ('URGENT' if rem < 6 else '')\n        print('%9.1fh  %-28s due %s  owner %-28s %s'\n              % (rem, oid, due, owner, flag))\n    print()\n    print('NOT YET TRIGGERED — confirm the assessment is scheduled')\n    for _, oid, note, owner in pending:\n        print('           %-28s %s  owner %s' % (oid, note, owner))\n\nif __name__ == '__main__':\n    main(sys.argv[1], set(sys.argv[2:]))\n"
            },
            {
              kind: "checklist",
              title: "Make it real, not a demo",
              items: [
                "Every legal entity, jurisdiction and regulated activity in your group is represented, including the acquisition nobody has integrated yet.",
                "Every material customer contract with a notification clause is in the register, with the clause reference recorded.",
                "Each obligation has a named human owner, not a department, and that human has confirmed it.",
                "The register is reviewed jointly by legal and security every quarter, with the review recorded.",
                "The engine is run as part of every tabletop, so its output is a familiar artifact rather than a novelty during a crisis.",
                "Output is written into the incident record automatically at declaration and re-run at every status update."
              ]
            }
          ],
          praxis:
            "Build the obligations register for your real organization and run the engine against a historical incident timestamp, then compare its output to what actually happened.",
          evidence:
            "The completed register with owners, the engine output for a past incident, and a written note of every obligation the engine surfaced that was not identified at the time.",
          awards: ["award-clock-engine", "award-obligation-register"],
          glossary: ["business-day-arithmetic", "obligations-register", "start-event", "contractual-notification"]
        }
      ]
    },
    {
      id: "ch-incident-page-after",
      title: "AFTER",
      credential: "Certified in Post-Incident Analysis and Resilience Engineering — StepSAFE Praxis",
      summary:
        "The incident ends and the expensive part begins: rebuilding an identity plane you no longer trust, understanding what actually caused this rather than what happened, and converting a bad month into an organization that is measurably harder to hurt. This Page covers human factors under sustained load, causal analysis, identity recovery, security game days, and the leadership work of rebuilding trust.",
      competencies: [
        "Recognise and manage decision-quality collapse under fatigue, and enforce rotation as a control rather than a courtesy",
        "Produce a causal analysis rather than a timeline, using counterfactual discipline and blameless framing that still assigns ownership",
        "Plan and execute recovery from a full identity-provider compromise including signing material, trusts and break-glass paths",
        "Design security game days and chaos experiments with hypotheses, blast-radius controls and abort conditions",
        "Rebuild trust with customers, regulators and the board through specificity rather than reassurance",
        "Run a full-scale exercise and publish a post-incident report of external quality"
      ],
      seal: "seal-after-ember",
      steps: [
        {
          id: "ch-incident-three-am",
          kind: "drill",
          title: "The Three A.M. Decision",
          statement:
            "Fatigue does not announce itself as fatigue; it announces itself as confidence, which is why the tired person cannot be the one deciding whether they are too tired.",
          minutes: 24,
          respect: 150,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "Sustained wakefulness degrades exactly the capacities incident response depends on: working memory, risk calibration, the ability to hold multiple hypotheses simultaneously, and the willingness to seek disconfirming evidence. The dangerous part is that self-assessment degrades faster than performance, so the subjective experience of hour twenty-six is clarity. This is well established in aviation, medicine and military operations, all of which responded by removing the decision from the individual: hard duty limits, mandatory rest, and an explicit authority for someone else to stand you down. Security response is the only high-consequence field that still routinely treats this as a matter of personal toughness."
            },
            {
              kind: "list",
              title: "Observable symptoms, which are what you must watch for",
              items: [
                "The team stops generating alternative hypotheses and starts defending the current one. Cognitive narrowing is the earliest visible sign and it looks like focus.",
                "Time estimates become uniform — everything is about an hour — because effortful estimation has been abandoned.",
                "Somebody proposes an irreversible action and the room does not ask what would falsify it.",
                "Handoffs get shorter, because the outgoing shift lacks the energy to reconstruct context.",
                "Reading comprehension drops before speech does, so people miss what is written in the record while still sounding coherent on the bridge.",
                "Volunteering rises. The exhausted responder offers to take one more thing, which is a fatigue symptom and not a commitment problem."
              ]
            },
            {
              kind: "principle",
              title: "The relief law",
              body:
                "The authority to remove someone from duty must sit with a rested person who is not in the chain of command they are removing. Build it into the plan by name, because at hour twenty-six nobody will invent it."
            },
            {
              kind: "table",
              title: "Fatigue controls that survive a real crisis",
              headers: ["Control", "Implementation", "Why it holds"],
              rows: [
                [
                  "Hard duty limit",
                  "Twelve hours maximum, eight for sustained-attention analysis, enforced by the deputy IC",
                  "A number cannot be argued with at hour thirteen; a judgement can"
                ],
                [
                  "Two-person rule on irreversible actions",
                  "Any destructive or irreversible step requires a second, rested reviewer who states the falsification test",
                  "Catches the specific error fatigue produces: acting on an unexamined assumption"
                ],
                [
                  "Scheduled disconfirmation",
                  "Every six hours, ten minutes spent explicitly attacking the leading hypothesis",
                  "Forces the cognitive move that fatigue removes first"
                ],
                [
                  "Real rest",
                  "Off the channel entirely, phone handed to the deputy, return time fixed",
                  "Monitoring during rest produces the fatigue of work with none of the value"
                ],
                [
                  "Food, water and light",
                  "Someone is explicitly assigned to it, as a role, in the plan",
                  "Unassigned welfare tasks are never done, and the effect on error rates is not small"
                ]
              ]
            }
          ],
          drill: {
            id: "ch-incident-drill-three-am",
            scene:
              "Hour thirty-one of a destructive intrusion. You are the incident commander and you have been awake for twenty-six hours. A senior infrastructure engineer, awake nineteen hours, proposes restoring the primary domain controller from a backup taken nine days ago, arguing it predates the compromise. Your earliest confirmed adversary artifact is eleven days old, but the forensics lead — currently asleep, correctly — flagged in the record that the initial access assessment was provisional and that an earlier edge-appliance log gap had not yet been examined. Eleven people are waiting on a decision. The proposal is well constructed, the engineer is credible, and everything in you wants to say yes and get the authentication plane back.",
            clock: "Twelve business units cannot process transactions until authentication returns. The engineer can start in five minutes.",
            pressure:
              "You feel completely clear-headed. That feeling is a symptom, and you have to act on that knowledge rather than on the feeling.",
            prompt: "You are the incident commander. What do you do in the next ten minutes?",
            options: [
              {
                id: "ch-incident-drill-three-am-opt-approve",
                label: "Approve it. The reasoning is sound, momentum matters, and eleven people are blocked.",
                detail: "Nine days predates every confirmed artifact and the business is stopped.",
                score: -2,
                outcome:
                  "The restore proceeds. Two days later the log gap is examined and pushes first confirmed adversary activity to nineteen days, which is before the backup. The restored controller carries the adversary's directory modifications back into a supposedly clean environment, and the entire eviction has to be repeated with a warned adversary.",
                ripple:
                  "The failure is not that the engineer was wrong; it is that a provisional assessment was treated as settled at exactly the hour when nobody had the capacity to notice the word provisional in the record. Fatigue does not usually cause bad reasoning — it causes unexamined premises."
              },
              {
                id: "ch-incident-drill-three-am-opt-rotate",
                label:
                  "Hand command to the rested deputy with a written handoff, log the proposal with its explicit assumptions, require the one check that could falsify it — the edge-appliance log gap against the backup date — and reconvene in forty-five minutes.",
                detail:
                  "State plainly to the room that you are handing over because of hours awake, not because of doubt about the proposal, so that the rotation reads as discipline rather than as distrust of the engineer.",
                score: 3,
                isBest: true,
                outcome:
                  "The deputy runs the check. The log gap covers a period with authentication anomalies, which moves earliest confirmed activity earlier and invalidates the nine-day assumption. The restore is redirected to a point twenty-four days back with a documented rationale, costing three hours and saving a repeated eviction.",
                ripple:
                  "You modelled the behaviour you want the organization to have: rotation is what competent people do, not what failing people do. The next time a tired senior engineer needs to be stood down, there is precedent, and it did not come with a stigma attached."
              },
              {
                id: "ch-incident-drill-three-am-opt-reject",
                label: "Reject the proposal and tell the team to keep hunting until the picture is complete.",
                detail: "When uncertain about the compromise window, do not restore.",
                score: -1,
                outcome:
                  "You may well be right, and you have arrived at it by instinct while exhausted, with no test attached and no reasoning the room can evaluate. The engineer, who did careful work, is deflated; the business is still stopped; and nobody knows what would change your mind.",
                ripple:
                  "A correct decision produced by an untrustworthy process is not a win, because the process is what you will use again tomorrow. This option also spends authority without creating any mechanism — you have used up the room's patience and left them with no criteria."
              },
              {
                id: "ch-incident-drill-three-am-opt-escalate",
                label: "Escalate the decision to the CIO.",
                detail: "It is a large irreversible call with business impact, so the accountable executive should make it.",
                score: -1,
                outcome:
                  "The CIO has been awake nearly as long, has a fraction of the context, and will ask you what you recommend — returning the decision to you with an added twenty-minute delay and a diffusion of accountability that helps nobody.",
                ripple:
                  "Escalation is appropriate for decisions about business risk appetite and for authority you do not hold. It is not a substitute for a decision procedure on a technical question, and using it that way teaches the organization that hard calls travel upward until they reach someone too far from the facts to make them well."
              }
            ],
            debrief:
              "The best option separates three things that the pressure of the moment fuses together: the quality of the proposal, the fitness of the decision-maker, and the need for speed. Handing over does not reject the engineer's work; it routes that work to someone who can evaluate it properly. The falsification test is the technical core — one specific check that could prove the proposal wrong, identified in advance — and the reason it works is that a tired brain will generate supporting reasons indefinitely but will not spontaneously go looking for the disconfirming one. Note the social framing in the detail line. Rotation only becomes a real control when the most senior person in the room uses it on themselves first, in public, with a stated reason.",
            principle:
              "Attach a falsification test to every irreversible decision, and never let the person who has been awake longest be the one who decides whether they are still fit to decide."
          },
          awards: ["award-rotation-modelled", "award-falsification-test"],
          glossary: ["decision-quality-collapse", "cognitive-narrowing", "two-person-rule", "falsification-test", "duty-limit"]
        },
        {
          id: "ch-incident-causal-analysis",
          kind: "lesson",
          title: "A Timeline Is Not an Analysis",
          statement:
            "A timeline tells you what happened in what order; a causal analysis tells you which conditions made it possible, and only one of those changes anything.",
          minutes: 36,
          respect: 170,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "Most post-incident documents are timelines with recommendations stapled to the end, and they produce a recognisable pattern of action items: add an alert for this specific technique, write a runbook for this specific system, remind everyone to be careful. These fail because the timeline describes a path through a space of possibilities without describing the space. The question is not why did the adversary use this technique but what made the technique available, what made it invisible, and what would have had to be true for us to have caught it — questions whose answers generalise to attacks you have not seen yet."
            },
            {
              kind: "compare",
              title: "The same incident, two documents",
              left: {
                title: "Timeline thinking",
                items: [
                  "At 02:41 an alert fired. At 02:58 an analyst triaged it. At 03:40 escalation occurred.",
                  "Root cause: an unpatched edge appliance.",
                  "Action: patch the appliance and add it to the scanning scope.",
                  "Contributing factor: the analyst did not escalate quickly enough.",
                  "Result: one vulnerability closed, one analyst quietly less willing to escalate ambiguous alerts."
                ]
              },
              right: {
                title: "Causal thinking",
                items: [
                  "The appliance was outside the patching programme because ownership transferred during a reorganisation and no process detects unowned assets.",
                  "The alert was low-confidence because the detection had never been tuned against real traffic, and there is no mechanism that surfaces untuned detections.",
                  "Escalation took fifty-nine minutes because the escalation criteria required certainty the analyst could not obtain, and the culture penalised false escalations.",
                  "Detection depended on a single signal; no independent second signal existed for this class of access.",
                  "Result: an ownership-gap detector, a detection tuning lifecycle, escalation criteria rewritten around uncertainty, and a defence-in-depth requirement — all of which generalise beyond this incident."
                ]
              }
            },
            {
              kind: "numbered",
              title: "Method: from timeline to causes in five passes",
              items: [
                "Build the factual timeline first, sourced and timestamped, and stop there. Do not interpret while you are still assembling. Mixing the two produces a narrative that resists correction.",
                "Mark every decision point — every moment a human or system could have gone another way — and record what information was available at that moment. Judge decisions by what was knowable then, never by the outcome.",
                "For each decision point, ask what made the wrong path the easy path. Systems produce their behaviour reliably; if a good engineer did the wrong thing, the environment made it the reasonable thing.",
                "Trace each condition upward until you reach something the organization actually controls: a process, an incentive, a budget, an ownership model, a design choice. Stopping at human error means stopping one level too early, every time.",
                "Test each proposed change against a different incident. If the fix would not have helped with a plausible alternative attack, it is a patch, not a countermeasure — keep it, but do not count it as the lesson."
              ]
            },
            {
              kind: "list",
              title: "Traps that quietly ruin post-incident reviews",
              items: [
                "Counterfactual reasoning: if only the analyst had escalated. Counterfactuals describe a world that did not exist and explain nothing about the one that did.",
                "Root cause singular. Real incidents have a conjunction of conditions; naming one cause guarantees you fix less than you found.",
                "Blameless as blame-free-of-ownership. Blameless means we do not punish people for the system's shape; it does not mean nobody owns the fix. Every finding needs a named owner and a date.",
                "The recommendation that is really a wish: improve monitoring, increase awareness, enhance the process. If it cannot be verified as done, it will not be done.",
                "Hindsight-tainted timelines, where the reconstruction quietly includes facts nobody had at the time. Annotate the timeline with what was known, not only what was true.",
                "Publishing to an audience that will not read it. A thirty-page document that three people finish has less impact than two pages that four hundred people read."
              ]
            },
            {
              kind: "checklist",
              title: "Writing one people actually read",
              items: [
                "One page of summary that stands alone: what happened, what it cost, what changes, who owns each change. Assume most readers stop here and write it so that stopping here is fine.",
                "Lead with the surprising thing. Every incident contains one fact that makes an experienced reader sit up; if you bury it on page nine you have wasted the only attention you will get.",
                "Write the embarrassing part explicitly. Its presence is the signal that the rest of the document is honest, and its absence is noticed.",
                "No passive voice in the causal section. Passive voice hides the actor and the actor is usually a system you can change.",
                "Findings as a table with owner, date and verification method, so it can be tracked as work rather than admired as a document.",
                "Publish internally as widely as the sensitivity allows, and publish a version externally when you can. Organizations that publish real technical detail after an incident recover credibility faster than those that publish reassurance."
              ]
            },
            {
              kind: "callout",
              title: "The follow-through test",
              body:
                "Ninety days after publication, pull the findings table and count what is closed with verification evidence attached. Below fifty percent, your organization runs reviews as ceremony. The single most effective intervention is putting the closure rate on the same executive dashboard as the incident count, because unclosed findings then become visible as accumulating risk rather than as an administrative backlog."
            }
          ],
          awards: ["award-causal-analysis", "award-report-people-read"],
          glossary: ["causal-analysis", "counterfactual-trap", "blameless-review", "contributing-condition", "finding-closure-rate"]
        },
        {
          id: "ch-incident-idp-rebuild",
          kind: "lab",
          title: "Rebuilding an Identity Plane You No Longer Trust",
          statement:
            "When the identity provider is compromised, every credential in the organization becomes a claim rather than a fact, including the one you would use to fix it.",
          minutes: 48,
          respect: 220,
          trust: 14,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "This is the recovery scenario most organizations have never planned, and it has a shape unlike any other. In a normal recovery you authenticate, then act. Here, authentication is the thing under suspicion, so the first problem is bootstrapping trust from something outside the compromised system: hardware tokens held physically, out-of-band verification of humans, and a clean environment that never trusted the old plane. The second problem is that identity compromise leaves artifacts that survive password resets entirely — forged tokens signed with stolen material, federation trusts pointing at adversary-controlled providers, application credentials that are not tied to any user, and directory objects with delegated rights."
            },
            {
              kind: "numbered",
              title: "The recovery sequence, and why this order",
              items: [
                "Establish out-of-band human verification first. Before any credential work, agree how you will confirm that the person requesting an action is who they claim — video plus a pre-shared phrase, or physical presence. Every identity recovery is attacked through the help desk, and the 2023 casino intrusions began with a single convincing phone call that produced a multi-factor reset.",
                "Bootstrap a clean administrative path: hardware-token accounts created in a clean tenant or a directory that does not federate to the compromised one, on rebuilt hardware.",
                "Inventory and remove trust before rotating secrets. Rotating signing material while an adversary-controlled federation trust still exists simply gives them a new valid path.",
                "Rotate signing material: token signing certificates on every federation service, then the ticket-granting account twice with a full replication interval between passes, which is what actually closes the forged-ticket window.",
                "Revoke sessions and refresh tokens organization-wide. Password resets alone leave live sessions and refresh tokens intact, and this is the single most common incomplete step.",
                "Only then rotate credentials at scale, sequenced so that the help desk is hardened and staffed before the volume arrives.",
                "Re-establish conditional access from a known-good baseline rather than editing the existing policy set, which may contain adversary modifications that read as normal."
              ]
            },
            {
              kind: "code",
              title: "Hunt the artifacts that survive a password reset",
              lang: "powershell",
              body:
                "# 1. Federation trusts. An unrecognised issuer or a recently changed signing\n#    certificate is the highest-severity finding available in this hunt.\nGet-MgDomain | ForEach-Object {\n  $d = $_.Id\n  Get-MgDomainFederationConfiguration -DomainId $d -ErrorAction SilentlyContinue |\n    Select-Object @{n='Domain';e={$d}}, IssuerUri, PassiveSignInUri,\n                  SigningCertificateUpdateStatus\n}\n\n# 2. Credentials added to applications and service principals in the window.\n#    Adversaries prefer this because it is not a user and survives every reset.\n$since = (Get-Date).AddDays(-120)\nGet-MgApplication -All | ForEach-Object {\n  foreach ($c in $_.PasswordCredentials) {\n    if ($c.StartDateTime -gt $since) {\n      [pscustomobject]@{ App = $_.DisplayName; Type = 'secret'\n                         Added = $c.StartDateTime; KeyId = $c.KeyId }\n    }\n  }\n  foreach ($k in $_.KeyCredentials) {\n    if ($k.StartDateTime -gt $since) {\n      [pscustomobject]@{ App = $_.DisplayName; Type = 'certificate'\n                         Added = $k.StartDateTime; KeyId = $k.KeyId }\n    }\n  }\n}\n\n# 3. Consent grants that reach the whole tenant.\nGet-MgOauth2PermissionGrant -All |\n  Where-Object { $_.ConsentType -eq 'AllPrincipals' } |\n  Select-Object ClientId, ResourceId, Scope\n\n# 4. On-premises: token signing certificates and an urgent double rotation.\nGet-AdfsCertificate -CertificateType Token-Signing\nUpdate-AdfsCertificate -CertificateType Token-Signing -Urgent\n\n# 5. Directory persistence that hides in plain sight.\nGet-ADObject -LDAPFilter '(objectClass=user)' -Properties msDS-AllowedToDelegateTo |\n  Where-Object { $_.'msDS-AllowedToDelegateTo' } |\n  Select-Object Name, msDS-AllowedToDelegateTo\nGet-ADObject -SearchBase (Get-ADDomain).SystemsContainer -Filter * -Properties whenChanged |\n  Where-Object { $_.whenChanged -gt $since } | Select-Object Name, whenChanged\n"
            },
            {
              kind: "code",
              title: "Close the forged-ticket window and cut every live session",
              lang: "powershell",
              body:
                "# The ticket-granting account must be reset TWICE, with a full replication\n# interval between passes. One reset leaves the previous key valid, which is\n# exactly the window a forged ticket needs. Verify replication between passes;\n# do not rely on a timer.\n\n# Pass one\n.\\Reset-KrbtgtKeyInteractive.ps1 -Mode Reset\n\n# Verify replication converged on every controller before pass two\nrepadmin /replsummary\nrepadmin /showrepl * /csv\n\n# Pass two, only after convergence is confirmed on all controllers\n.\\Reset-KrbtgtKeyInteractive.ps1 -Mode Reset\n\n# Cloud: revoking sign-in sessions invalidates refresh tokens. A password\n# reset alone does not. Run this for every account in scope, not only\n# accounts you believe were compromised.\nGet-MgUser -All -Property Id, UserPrincipalName | ForEach-Object {\n  Revoke-MgUserSignInSession -UserId $_.Id\n}\n\n# Verify break-glass accounts BEFORE any of the above. Two accounts,\n# hardware tokens, excluded from conditional access, alerting on any use,\n# credentials sealed and their location known to two named executives.\nGet-MgUser -Filter (\n  'startswith(userPrincipalName,' + [char]39 + 'brk-' + [char]39 + ')'\n) | Select-Object UserPrincipalName, AccountEnabled\n"
            },
            {
              kind: "table",
              title: "Realistic timing for a full identity recovery",
              headers: ["Phase", "Elapsed", "The thing that actually takes the time"],
              rows: [
                ["Establish clean administrative path", "4 to 12 hours", "Physically distributing hardware tokens and verifying humans out of band"],
                ["Inventory and remove adversary trust", "12 to 48 hours", "Determining which of several hundred application registrations are legitimate, with no owner records"],
                ["Rotate signing material", "4 to 24 hours", "Waiting for replication convergence between the two ticket-granting rotations"],
                ["Organization-wide session and credential rotation", "1 to 5 days", "Help desk throughput and identity verification for people who cannot authenticate to prove who they are"],
                ["Restore normal authentication for all systems", "3 to 15 days", "Service accounts and integrations whose credentials are embedded in configuration nobody documented"],
                ["Regain confidence", "Weeks", "Independent verification hunting, and the honest answer that confidence is a judgement rather than a milestone"]
              ]
            },
            {
              kind: "callout",
              title: "Test the one thing that makes this possible",
              body:
                "Once a quarter, verify that two break-glass accounts work: hardware token present, account enabled, excluded from conditional access, use generates an alert to a monitored destination, and a named human can retrieve the credential within thirty minutes. This is a fifteen-minute test that decides whether the scenario above is a difficult recovery or an impossible one. Organizations discover during real incidents that their emergency account was disabled by an automated stale-account cleanup, and there is no recovering from that at speed."
            }
          ],
          praxis:
            "Run the artifact hunt against your production tenant, verify break-glass accounts end to end, and rehearse the double ticket-granting rotation in a representative test environment with replication verification.",
          evidence:
            "The hunt output with every finding triaged, a timed break-glass verification record, and the rehearsal log showing both rotation passes with replication convergence confirmed between them.",
          awards: ["award-identity-recovery", "award-break-glass-verified"],
          glossary: ["golden-saml", "krbtgt-double-reset", "refresh-token-revocation", "break-glass-credential", "constrained-delegation"]
        },
        {
          id: "ch-incident-game-day",
          kind: "lab",
          title: "Game Days: Breaking Your Own Controls on Purpose",
          statement:
            "A control you have never seen fail is a control you have never tested, and the first time it fails should not be the first time it matters.",
          minutes: 44,
          respect: 185,
          trust: 12,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "Security chaos engineering borrows the reliability discipline and points it at the assumption layer. The premise is that your security posture is a set of beliefs — that this alert fires, that this policy blocks, that this log reaches the pipeline, that this on-call responds — and beliefs decay silently as systems change around them. A game day is an experiment with a written hypothesis, a bounded blast radius, an abort condition and a measured result. The distinction from a penetration test matters: a red team asks whether an adversary can get in; a game day asks whether your defences behave the way you have documented, and it produces evidence about your organization rather than about your perimeter."
            },
            {
              kind: "code",
              title: "An experiment definition with the discipline written in",
              lang: "yaml",
              body:
                "experiment: detection-pipeline-loss\nversion: 3\nowner: detection-engineering\nreviewed_by: [ security-leadership, platform-oncall ]\n\nhypothesis: >\n  If the primary log forwarder for the production identity namespace stops\n  shipping, an alert reaches a human within 10 minutes, and the secondary\n  path continues to deliver authentication events with under 5 percent loss.\n\nwhy_this_matters: >\n  Every identity detection we own depends on this pipeline. We have never\n  observed it fail. Adversaries disable logging early and deliberately.\n\nsteady_state:\n  - metric: auth_events_per_minute\n    source: siem\n    expected_min: 1800\n  - metric: detection_rule_health_ok\n    source: detection-platform\n    expected: true\n\nmethod:\n  - stop the primary forwarder on 1 of 12 collectors (blast radius 8 percent)\n  - hold for 15 minutes or until hypothesis resolves\n  - restore, then verify backfill completeness against the source of truth\n\nblast_radius:\n  environment: production\n  scope: single collector, non-critical namespace\n  data_loss_risk: none, source retains 72 hours locally\n\nabort_conditions:\n  - any customer-facing error rate rises above baseline\n  - a real incident is declared at any severity\n  - auth_events_per_minute falls below 1200 across all collectors\n\nabort_authority: platform-oncall, unilateral, no discussion required\n\nnotification:\n  before: security-oncall told an experiment window is open, not what it is\n  reason: we are testing detection, not testing whether people are watching\n\nsuccess_criteria:\n  - human acknowledgement within 10 minutes\n  - secondary path loss under 5 percent\n  - backfill completes within 30 minutes of restoration\n\nresult: >\n  FAILED on run 3. Alert fired at 4 minutes to a channel with no on-call\n  routing configured after the March platform migration. No human saw it\n  for 71 minutes. Secondary path performed as expected.\n\nfindings:\n  - id: GD-2026-03\n    finding: alert routing lost during platform migration, silently\n    owner: r.okonjo\n    due: 2026-09-05\n    verification: re-run experiment, require acknowledgement under 10 minutes\n"
            },
            {
              kind: "code",
              title: "Running it, and automating the ones worth repeating",
              lang: "bash",
              body:
                "# Chaos Toolkit for the orchestration, with the hypothesis checked before\n# and after so that a failed steady state aborts before you inject anything.\nchaos run experiments/detection-pipeline-loss.json --journal-path journal.json\n\n# Cloud fault injection for infrastructure-level experiments, with the stop\n# condition wired to a real alarm rather than to a human watching a screen.\naws fis start-experiment --experiment-template-id EXT7fjk3l --tags \\\n  Key=exercise,Value=GD-2026-Q3\n\n# The security experiments worth building first, in rough order of value:\n#  1. detection pipeline loss for your highest-value namespace\n#  2. deliberately trigger a known detection and measure time to human\n#     acknowledgement, not time to alert generation\n#  3. revoke a service certificate and observe whether failure is loud or\n#     silent, and whether anything fails open\n#  4. simulate loss of the endpoint agent management plane, which is the\n#     July 2024 lesson: your response tooling can be the thing that is down\n#  5. remove one on-call responder without warning and measure escalation\n#  6. block egress to your identity provider from one region and observe\n#     which systems fail open rather than closed\n\n# Measure the same four numbers every time, so trend is visible:\n#   time to detect, time to human acknowledgement, time to correct action,\n#   and blast radius accuracy — how close the actual impact was to predicted.\n"
            },
            {
              kind: "list",
              title: "Rules that keep game days from becoming incidents",
              items: [
                "Write the hypothesis before the method. If you cannot state what you expect, you are not experimenting, you are poking.",
                "Never run during a real incident, a change freeze, or a period of elevated threat. The abort authority must be a single named person who can stop it without a meeting.",
                "Start in a non-production environment for the first run of any new experiment, then move to production with a reduced blast radius, then widen. Skipping straight to production is how a game day becomes the outage that gets the programme cancelled.",
                "Tell the responders that a window is open without telling them what is coming. Testing whether people are paying attention is a different and less useful experiment than testing whether the system works.",
                "Record failures prominently and celebrate them. A game day programme that only reports successes has been captured by performance management and will stop finding anything.",
                "Re-run every failed experiment after remediation. Verification is the entire point; an unverified fix is a belief, which is what you started with."
              ]
            },
            {
              kind: "callout",
              title: "The experiment nobody wants to run",
              body:
                "Test what happens when your security tooling itself fails. The July 2024 endpoint agent event took roughly eight and a half million Windows hosts offline with no adversary involved, and organizations discovered that their incident response depended on the availability of the thing that was down. Run the experiment: assume your endpoint platform, your identity provider and your logging pipeline are simultaneously unavailable, and find out whether your response plan contains a single executable step."
            }
          ],
          praxis:
            "Design and run three security game days over a quarter, including one that tests your detection pipeline and one that removes a piece of your own security tooling, with written hypotheses and measured results.",
          evidence:
            "Three experiment definitions with results, the findings each produced with owners and dates, and evidence of at least one failed experiment re-run successfully after remediation.",
          awards: ["award-game-day", "award-hypothesis-driven"],
          glossary: ["security-chaos-engineering", "steady-state-hypothesis", "blast-radius-control", "abort-condition", "time-to-acknowledgement"]
        },
        {
          id: "ch-incident-trust-rebuild",
          kind: "council",
          title: "Rebuilding Trust You Cannot Assert",
          statement:
            "Trust is regained through specificity and demonstrated change, never through reassurance, and the organizations that recover fastest are the ones that said the embarrassing part out loud.",
          minutes: 34,
          respect: 180,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body:
                "After the technical recovery ends you inherit a different problem with different physics. Customers, regulators, the board and your own engineers have each updated their model of your organization, and each requires a different kind of evidence to update it back. The instinct is to project confidence, which is precisely wrong: confidence is what you had before, and it is now discounted. What works is specific, checkable statements about what happened and what changed, delivered on a schedule you keep, by people who were visibly involved."
            },
            {
              kind: "table",
              title: "Four audiences, four currencies",
              headers: ["Audience", "What they actually want", "What fails"],
              rows: [
                [
                  "Enterprise customers",
                  "Technical specificity, a named contact, and the ability to tell their own board something concrete",
                  "A generic notice and a portal link. They will send a 200-question assessment and you will spend a quarter on it"
                ],
                [
                  "Regulators",
                  "Evidence of a process that was functioning before, during and after — minutes, decisions, timelines, closure records",
                  "Assertions of improvement without artifacts. Regulators assess process, not sentiment"
                ],
                [
                  "The board",
                  "A change in the risk picture with numbers, and a credible view of what remains open",
                  "Reassurance, or a list of purchased products presented as risk reduction"
                ],
                [
                  "Your own engineers",
                  "Evidence that the causes they identified are being fixed and that nobody was punished for surfacing them",
                  "A published review with no funded work behind it, which teaches the organization that reporting is pointless"
                ]
              ]
            },
            {
              kind: "numbered",
              title: "The disclosure that rebuilds rather than deflects",
              items: [
                "Name the mechanism precisely, including the part that reflects badly on you. Okta published that a service account credential had been saved into an employee's personal Google account through Chrome profile sign-in, and that its own logging emitted a different event for file access than for case access, which is why detection took two weeks. That level of candour is why the write-up is still taught.",
                "State what you have changed, in verifiable terms — the specific control, the specific date, the specific scope — rather than in categories such as strengthened monitoring.",
                "State what you have not yet changed and when you will. An honest open item is more credible than a complete-sounding list, because readers know a list of that length is never complete.",
                "Give a named human as the contact and let them actually answer. An unanswered security contact address does more damage than no contact at all.",
                "Publish the follow-up on the date you promised, even if the news is that work slipped. The kept commitment is the trust instrument, not the content.",
                "Do not compare yourself to others who did worse. It reads as deflection every time and it is the most common failure in second-round communications."
              ]
            },
            {
              kind: "quote",
              body:
                "Specificity is the cheapest trust available. Every vague sentence spends credibility; every checkable one earns it back.",
              source: "The pattern shared by the post-incident disclosures that are still cited years later"
            },
            {
              kind: "list",
              title: "The board conversation, six months later",
              items: [
                "Open with what changed in the risk picture, quantified where honest quantification is possible: dwell time, mean time to human acknowledgement, percentage of privileged access behind phishing-resistant authentication, backup restore times actually measured.",
                "Show the findings closure rate from the post-incident review, including the items that slipped and why. Boards trust leaders who bring their own bad news on a schedule.",
                "Name what remains unmitigated and what it would cost to mitigate, as a decision for them rather than a confession from you. This converts residual risk from your failure into their accepted position.",
                "Bring one exercise result from after the incident, because a tested capability is the only evidence that the lessons became capability rather than documentation.",
                "Ask for something specific. A leader who emerges from a crisis without a funding or authority ask has wasted the only moment when the organization was listening."
              ]
            },
            {
              kind: "callout",
              title: "The internal work that outlasts the external work",
              body:
                "The people who ran the incident are, six weeks later, quietly depleted and often looking at other jobs. Attrition among responders in the months after a major incident is one of the least-discussed costs in the field. Do the unglamorous things: real time off after the crisis rather than at some indefinite later point, explicit recognition naming individuals, and a review process that visibly did not punish anyone for surfacing the causes. Losing the four people who now know how to do this is a bigger long-term loss than the incident itself."
            }
          ],
          awards: ["award-trust-rebuilt", "award-board-fluency"],
          glossary: ["post-incident-disclosure", "residual-risk-acceptance", "responder-attrition", "closure-rate", "verifiable-commitment"]
        },
        {
          id: "ch-incident-capstone",
          kind: "field",
          title: "Capstone: Run It, Then Publish It",
          statement:
            "You do not know whether you can command an incident until you have commanded one under observation and written the document that says how it went.",
          minutes: 90,
          respect: 220,
          trust: 14,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body:
                "This is the chapter's terminal artifact and it is deliberately demanding. You will design and command a full-scale exercise — not a tabletop, but an exercise with real systems, real clocks and real people executing real actions — and then produce a post-incident report of a quality you would be willing to publish externally. The exercise proves capability; the report proves you can convert experience into organizational change, which is the actual job."
            },
            {
              kind: "numbered",
              title: "The exercise",
              items: [
                "Scenario drawn from your top concentration of risk, with a technical injection that is genuinely executed — a benign but real artifact placed in the environment, a genuinely disabled control, a real credential actually rotated.",
                "Command structure stood up for real: named IC, operations lead, comms lead, scribe, legal liaison, with the single-writer rule enforced and the incident record kept as it would be kept.",
                "At least one shift handoff, using the handoff artifact from earlier in this chapter, with the incoming commander genuinely not present for the first phase.",
                "Executive participation with a real first-hour briefing delivered under time pressure, and at least one decision that only an executive can make.",
                "The disclosure clock engine run against the exercise timestamps, with the resulting deadlines treated as real for the duration.",
                "An external inject with an unforgiving clock — a simulated journalist, regulator or major customer — handled by the comms lead through the pre-cleared kit.",
                "Independent observers with a single job: record every question asked that nobody could answer, and every moment the structure broke down."
              ]
            },
            {
              kind: "checklist",
              title: "The report",
              items: [
                "One-page summary that stands alone and leads with the most surprising finding.",
                "A sourced factual timeline annotated with what was known at each point, distinguished clearly from what was true.",
                "A causal analysis reaching organizational conditions — process, ownership, incentive, design — rather than stopping at human error or at a single root cause.",
                "The decision log with what was known at the time of each decision, so that decision quality can be assessed independently of outcome.",
                "A findings table with named owners, dates inside ninety days, and a verification method defined before the work starts.",
                "An explicit section on what went well, described mechanically enough that it can be deliberately repeated rather than hoped for.",
                "A written statement of what you would still not be able to handle, which is the section that distinguishes a professional document from a promotional one."
              ]
            },
            {
              kind: "metric",
              title: "The numbers to record and to keep recording",
              items: [
                "Time from first signal to declaration, and time from declaration to a functioning command structure with all roles filled.",
                "Time to first executive briefing, and whether every promised update time was met exactly.",
                "Number of single-writer violations observed, which is the cleanest proxy for whether the structure was real or nominal.",
                "Time to first evidence preservation action and whether volatile data was captured before any containment step.",
                "Number of questions asked that nobody could answer — track this across exercises; it should fall, then plateau, then rise again after any major organizational change, which tells you something important.",
                "Findings closure rate at thirty, sixty and ninety days, with verification evidence attached."
              ]
            },
            {
              kind: "callout",
              title: "What goes on the Praxis Profile",
              body:
                "This step is the chapter's credential. The evidence is not that you participated in an exercise; it is that you designed it against your own risk register, commanded it under observation, wrote a causal analysis rather than a timeline, and can show findings closed with verification attached. That package is what a hiring board or an executive committee should see when they ask whether you can hold the room while the building burns."
            }
          ],
          praxis:
            "Design, command and debrief a full-scale security exercise with real technical injections, executive participation, a genuine shift handoff and an external clock, then publish a post-incident report of externally publishable quality.",
          evidence:
            "The exercise design and inject script, the incident record as kept during the exercise, the observer notes, the published report with its causal analysis, and the findings table at ninety days with verification evidence attached to each closed item.",
          awards: ["award-incident-command-capstone", "award-ember-seal", "award-published-analysis"],
          glossary: ["full-scale-exercise", "observer-notes", "post-incident-report", "verification-evidence", "praxis-profile"]
        }
      ]
    }
  ]
};
