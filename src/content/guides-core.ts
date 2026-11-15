import type { Guide } from "./schema";

/* StepGUIDES :: core library.
   The reference shelf a working security leader actually reaches for.
   Every guide is meant to be printed and used on a real day. */

export const GUIDES: Guide[] = [
  /* ---------------------------------------------------------------- */
  /* FOUNDATIONS                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: "sg-threat-model-playbook",
    title: "The Ninety-Minute Threat Model",
    domain: "Design Security",
    kind: "playbook",
    statement: "A threat model that does not change a line of the design was theater with a diagram.",
    summary:
      "Run a design-stage threat model in ninety minutes that ends in committed engineering work — a design change, an owned control, a dated risk acceptance, or a shipped detection. Includes the STRIDE questions that actually find bugs and the assumption register that ages badly on purpose.",
    minutes: 40,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "When to spend the ninety minutes",
        body:
          "You cannot threat model everything, and teams that try stop threat modeling within two quarters. Trigger on structure, not on calendar. Run a model when a new trust boundary appears — a service starts accepting untrusted input, a tenant boundary is introduced, a third party begins holding your data. Run one when authentication or authorization logic changes, when data crosses a classification tier, or when a system starts doing something irreversible: moving money, handling key material, deleting at scale. Do not run one for a copy change, a new field on an existing form, or a dependency bump. The Threat Modeling Manifesto reduces the practice to four questions — what are we working on, what can go wrong, what are we going to do about it, and did we do a good enough job. The fourth is the one every program skips, and it is the only one that produces learning."
      },
      {
        kind: "numbered",
        title: "The procedure",
        items: [
          "0-10 min. Draw the system on one surface, with the people who built it. Not UML: boxes for processes, cylinders for stores, arrows for flows, and a dashed line wherever data changes owner, privilege level, or network. If nobody in the room can draw it without opening the console, that finding outranks anything else you were going to discover today.",
          "10-20 min. Label every arrow with three things: the data class crossing it, the authentication protecting it, and who can read it in transit. Roughly half of real findings surface here, before anyone has said the word threat.",
          "20-45 min. Walk STRIDE per element, not per system. Ask the element-specific question, not the category name. Three minutes per element, hard stop, keep moving. Depth is a second session, and only for what survives ranking.",
          "45-60 min. Rank by attacker economics, not by a severity label. For each candidate threat ask: what must the adversary already possess, what do they get, and what does it cost them to try again after failing once. A threat that is cheap to retry beats a threat that is severe but single-shot.",
          "60-75 min. Convert every surviving threat into exactly one of four outcomes — a design change, a compensating control with a named owner, an accepted risk with an expiry date, or a detection with a written query. There is no fifth bucket, and we will monitor it is not a detection unless someone can paste the query.",
          "75-85 min. Write the assumptions down. Every threat model rests on claims like the load balancer terminates TLS and re-encrypts, or the queue is only reachable inside the VPC. Those claims are the model's real attack surface, and they are the part that rots.",
          "85-90 min. Set the re-review trigger, not a date. A date produces a calendar invite nobody honours. A trigger — re-model when this service begins accepting requests from outside the mesh — produces an actual review at the moment it matters."
        ]
      },
      {
        kind: "table",
        title: "STRIDE, phrased so it finds things",
        headers: ["Category", "The question that finds nothing", "The question that finds bugs", "Where it usually lands"],
        rows: [
          [
            "Spoofing",
            "Can identity be spoofed?",
            "What proof of identity does this element accept, and what is the cheapest way to produce that proof without being the principal?",
            "Service-to-service auth, webhook receivers, SSO assertion validation, internal calls that trust a header"
          ],
          [
            "Tampering",
            "Can data be tampered with?",
            "Which value in this flow is trusted downstream but written upstream by a party we do not control?",
            "Client-supplied identifiers, price and quantity fields, JWT claims copied into policy decisions"
          ],
          [
            "Repudiation",
            "Do we have logs?",
            "If this action is disputed nine months from now, which field in which log distinguishes the user doing it from an admin doing it as the user?",
            "Impersonation features, support tooling, batch jobs, anything with a service account in the actor field"
          ],
          [
            "Information disclosure",
            "Is the data encrypted?",
            "Who can read this store or this flow today without triggering any alert, and how many of them are humans?",
            "Read replicas, analytics exports, log fields, verbose error responses, backups"
          ],
          [
            "Denial of service",
            "Can it be DoSed?",
            "What unauthenticated request costs us the most CPU, storage, or money per byte the attacker sends?",
            "Regex, image and PDF parsing, unbounded pagination, zip handling, model inference calls"
          ],
          [
            "Elevation of privilege",
            "Can a user become an admin?",
            "Where does an authorization decision consume data that a lower-privileged party can influence?",
            "Tenant identifiers in paths, object references, role claims from untrusted issuers, deserialization"
          ]
        ]
      },
      {
        kind: "callout",
        title: "The three failure modes that kill programs",
        body:
          "First: modeling the diagram instead of the deployment. The diagram shows one service; production has a debug sidecar, a bastion host, and a decade-old cron box holding a database credential. Ask what else can reach this data store and wait through the silence. Second: outsourcing to the security team. A model built without the engineers who will implement the fix produces findings that get closed as will-not-fix by people who were never in the room. Third: acceptance without expiry. A risk accepted with no date is not a decision, it is a disappearance — made by someone who will have changed teams before it matters."
      },
      {
        kind: "code",
        title: "The assumption register — the artifact that ages on purpose",
        lang: "yaml",
        body:
          "# threat-model/payments-v3.assumptions.yaml\nassumptions:\n  - id: A1\n    claim: The internal gateway rejects any request lacking a valid mTLS client certificate\n    owner: platform-networking\n    verified_by: weekly automated probe from an unauthorised namespace\n    breaks_if: anyone adds an allow-list bypass for a legacy client\n    last_verified: 2026-07-28\n\n  - id: A2\n    claim: Ledger writes are idempotent on client_request_id\n    owner: payments-core\n    verified_by: property test in payments-core CI, gate on merge\n    breaks_if: the identifier becomes optional for any caller\n    last_verified: 2026-08-01\n\n  - id: A3\n    claim: No human holds standing read access to the card vault\n    owner: iam\n    verified_by: quarterly access review plus a detection on vault reads outside a break-glass session\n    breaks_if: an on-call runbook adds a manual query step\n    last_verified: 2026-06-30\n\n# Rule: an assumption with no verified_by is a wish.\n# Rule: an assumption older than its review cadence is an open finding."
      },
      {
        kind: "compare",
        title: "Two sessions that look identical from outside the room",
        left: {
          title: "Changes the design",
          items: [
            "The engineers hold the pen; security asks questions",
            "Findings are phrased as capabilities an attacker gains, not as control gaps",
            "Every threat exits as design change, owned control, dated acceptance, or a written query",
            "Assumptions are recorded with an owner and a verification method",
            "The re-review trigger is a system event, not a quarter",
            "Two or three findings, deeply understood, all of them scheduled"
          ]
        },
        right: {
          title: "Changes nothing",
          items: [
            "A security engineer fills a template alone and circulates it",
            "Findings are phrased as missing controls from a standard",
            "Everything exits as a recommendation with no owner",
            "Assumptions are implicit in the diagram and never written down",
            "The review is scheduled annually and slips",
            "Twenty-nine findings, none of them in a sprint"
          ]
        }
      },
      {
        kind: "checklist",
        title: "Exit criteria — do not close the session without these",
        items: [
          "Every arrow on the diagram has a data class and an authentication mechanism written on it",
          "Every finding names the attacker's starting position, not just the vulnerability",
          "Every finding has one of the four dispositions and a human name attached",
          "Every accepted risk has an expiry date inside twelve months and an accepting authority who could actually be fired for it",
          "Every detection disposition has a query, a log source, and a person who will triage the alert",
          "The assumption register has at least three entries, each with a verification method",
          "The re-review trigger is written as an observable system event",
          "Someone who was not in the room can read the output and reconstruct the argument"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Threat modeling is forecasting, scored by hindsight. Write down what you believed and why, so that when you are wrong you learn something instead of arguing about whose framework it was."
      }
    ],
    sources: [
      {
        label: "Threat Modeling Manifesto (threatmodelingmanifesto.org)",
        note: "The four questions and five values, vendor-neutral and one page long. Use it to end methodology arguments; the values section is the part that actually settles disputes about tooling."
      },
      {
        label: "Adam Shostack, Threat Modeling: Designing for Security (Wiley)",
        note: "Still the reference text for STRIDE-per-element. Read chapters 1-3 and 12; skip the tooling appendix, which has aged."
      },
      {
        label: "OWASP Threat Modeling Cheat Sheet",
        note: "Short, current, and free. This is what you hand an engineer who will never read a book, and it is enough to make them useful in a session."
      },
      {
        label: "MITRE ATT&CK Enterprise v19 (April 2026)",
        note: "Use it after STRIDE, not instead of it. STRIDE generates hypotheses about your design; ATT&CK checks whether your list resembles what adversaries actually do post-compromise."
      },
      {
        label: "LINDDUN privacy threat framework (linddun.org)",
        note: "STRIDE has a blind spot the size of privacy. Linkability and detectability catch design flaws — join keys, correlatable identifiers — that STRIDE will never surface."
      },
      {
        label: "NIST SP 800-154 (draft), Guide to Data-Centric System Threat Modeling",
        note: "Never finalised, but the data-centric framing is the fastest way to model a system whose architecture you do not control, such as a SaaS vendor holding your data."
      }
    ]
  },

  {
    id: "sg-design-review-record",
    title: "Security Design Review Record",
    domain: "Design Security",
    kind: "template",
    statement: "The record exists so the next person can tell a decision from an accident.",
    summary:
      "The fill-in artifact that ends a security design review. Written so that in eighteen months, when the control is questioned in an audit or a breach, the reasoning survives the departure of everyone who was in the room.",
    minutes: 25,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "What this is for",
        body:
          "Most design review output dies as a comment thread on a document that gets superseded. The record below is deliberately boring and deliberately short — one page, produced at the end of the review, stored beside the code and not in a governance tool nobody opens. Its job is to survive turnover. The two fields that matter most are the ones teams want to delete: what we chose not to do, and what we assumed. Those are what an incident review or a regulator will ask about, and they are the only fields that let a future engineer distinguish a deliberate tradeoff from an oversight."
      },
      {
        kind: "code",
        title: "The template — copy verbatim, fill every field, delete nothing",
        lang: "markdown",
        body:
          "# Security Design Review Record\n\nSystem: <service or feature name>\nReview date: <YYYY-MM-DD>\nReviewers: <names and roles, including the engineers who will implement>\nDecision authority: <the person accountable if this is wrong>\nDesign document: <permanent link, pinned to a revision>\nVerdict: ACCEPT | ACCEPT WITH CONDITIONS | REWORK | BLOCK\n\n## 1. What this system does, in three sentences\n<Plain language. If it takes more than three sentences, the design is not settled.>\n\n## 2. Data and trust boundaries\n| Data | Classification | At rest | In transit | Who can read it without an alert |\n|---|---|---|---|---|\n|  |  |  |  |  |\n\nTrust boundaries crossed: <list each, with what authenticates across it>\n\n## 3. Threats considered and disposition\n| # | Threat (attacker capability, not control gap) | Disposition | Owner | Due / expiry |\n|---|---|---|---|---|\n| 1 |  | design change / control / accepted / detection |  |  |\n\n## 4. What we chose NOT to do, and why\n<The most valuable section in this document. One paragraph per rejected control.\nName the cost that made it not worth it: latency, engineering weeks, user friction,\nblast radius of the control itself. If nothing was rejected, the review was not real.>\n\n## 5. Assumptions this design depends on\n| ID | Claim | Owner | How it is verified | Breaks if |\n|---|---|---|---|---|\n\n## 6. Conditions of acceptance\n<Only if verdict is ACCEPT WITH CONDITIONS. Each condition is a merge gate or a\ndeploy gate, with the name of the check that enforces it. Conditions with no\nenforcing check are not conditions.>\n\n## 7. Detections this design requires\n| Behaviour to detect | Log source | Query exists? | Who triages |\n|---|---|---|---|\n\n## 8. Re-review trigger\n<An observable system event, not a date.>\n\n## 9. Residual risk statement, for the accepting authority to sign\n<One paragraph, written for an executive: what could still go wrong, how bad,\nhow we would know, and how long recovery takes.>"
      },
      {
        kind: "list",
        title: "The four verdicts, and what each one obliges",
        items: [
          "ACCEPT — the design is sound as drawn. Obliges nothing beyond recording the assumptions. Use it, and use it often enough that the other verdicts still mean something.",
          "ACCEPT WITH CONDITIONS — ship, but named gates must be in place before a stated milestone. Each condition must map to an automated check; a condition enforced by memory is an ACCEPT with extra paperwork.",
          "REWORK — a specific part of the design cannot be made safe with controls, and the structure has to change. Name the part. A REWORK verdict that does not point at a component is a political act, not a technical one.",
          "BLOCK — reserved. Use when shipping would create an unrecoverable state: irreversible data exposure, key material leaving a boundary, a control that cannot be rolled back. Expect to defend it to an executive within a day, in writing, in the residual risk section."
        ]
      },
      {
        kind: "table",
        title: "Who signs, by residual exposure",
        headers: ["Residual exposure", "Accepting authority", "Maximum acceptance term", "Required in the record"],
        rows: [
          ["Single-tenant, non-regulated data, reversible", "Engineering manager", "12 months", "Assumptions and re-review trigger"],
          ["Cross-tenant reachability, or regulated data at rest", "Director plus security lead", "6 months", "Detections section fully populated"],
          ["Key material, payment flows, or authentication logic", "CISO plus system owner", "3 months", "Independent review by an engineer outside the team"],
          ["Irreversible exposure or loss of forensic capability", "CISO and executive owner, in writing", "Single named release", "Recovery plan with tested restore evidence"]
        ]
      },
      {
        kind: "callout",
        title: "What never goes in this record",
        body:
          "No adjectives. Robust, comprehensive, and industry-standard describe nothing and cannot be falsified — strike them on sight. No control names without a mechanism: encryption at rest means nothing without who holds the key. No findings copied from a scanner. And no risk ratings borrowed from a matrix the reader has not seen; if you write High, the record must say high compared to what, measured how."
      },
      {
        kind: "checklist",
        title: "Reviewer pre-submit check",
        items: [
          "Section 4 is not empty, and each rejected control names the cost that killed it",
          "Every disposition in section 3 has a human name, not a team name",
          "Every condition in section 6 maps to a check that fails a build or a deploy",
          "Every detection in section 7 names a triage owner who has agreed to it",
          "The residual risk paragraph is readable by someone with no security background",
          "The design document link is pinned to a revision, not to a mutable head",
          "The record is stored in the same repository as the code it describes"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Write the record for the person who will be angry about this decision in two years. Give them enough to see that you were reasoning, even if you were wrong."
      }
    ],
    sources: [
      {
        label: "Threat Modeling Manifesto — Dialog is key",
        note: "The manifesto's fourth principle is that dialogue creates value and documents record it. This template is the recording half; do not let it become the whole practice."
      },
      {
        label: "Google, Building Secure and Reliable Systems (O'Reilly, free online)",
        note: "Chapters on design documents and on understanding adversaries. The best available treatment of writing design decisions so they survive organisational change."
      },
      {
        label: "NIST SP 800-160 Vol. 1 Rev. 1, Engineering Trustworthy Secure Systems",
        note: "Heavy going, but the source of the discipline that design decisions must be traceable to stated assumptions and stated adversary capability."
      },
      {
        label: "OWASP Application Security Verification Standard 5.0.0 (May 2025)",
        note: "Use as the requirements shelf your section 3 dispositions point at, so that design decisions and verification requirements share vocabulary."
      },
      {
        label: "Michael Nygard, Documenting Architecture Decisions (the ADR pattern)",
        note: "This record is an ADR with a threat column. Read the original to understand why the format is short and immutable rather than a living document."
      }
    ]
  },

  {
    id: "sg-vuln-triage-model",
    title: "Triage by Exploitation Evidence, Not by Severity",
    domain: "Vulnerability Management",
    kind: "model",
    statement: "Severity is a property of a CVE. Risk is a property of your deployment. Only one of them should page a human.",
    summary:
      "A four-signal decision lattice — known exploitation, exploitation probability, code reachability, and network exposure — that turns a queue of forty thousand findings into a remediation plan a team can actually execute, plus the traps each signal sets for you.",
    minutes: 32,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why the queue is unwinnable as posed",
        body:
          "Roughly a third of published CVEs score 7.0 or above under CVSS. If your policy is patch everything high and critical, your policy is patch a third of everything, forever, and it will not be met. Worse, it is not even efficient: the FIRST EPSS research shows that a CVSS 7-and-above strategy requires remediating around half of known CVEs to reach about 75 percent coverage of what is actually exploited, an efficiency of roughly six percent — ninety-four out of every hundred fixes buy nothing measurable. EPSS v4, released 17 March 2025, reaches comparable coverage at around six percent of the volume, with efficiency near forty-seven percent and a reported ROC AUC of 0.838. That is not a marginal improvement in a metric; it is the difference between a programme that can be staffed and one that cannot."
      },
      {
        kind: "metric",
        title: "The three numbers you must be able to define on demand",
        items: [
          "Coverage — of everything actually exploited in the wild, what share did we remediate? Missing this is the failure that ends careers.",
          "Efficiency — of everything we remediated, what share was actually exploited? Missing this is the failure that ends programmes, through burnout and lost credibility with engineering.",
          "Effort — what share of the total vulnerability volume did we touch to achieve that coverage? This is the number your VP of Engineering feels, and the one you must be able to defend line by line.",
          "You are always trading coverage against effort. State the trade explicitly and get it signed, or someone else will pick a point on that curve for you and it will be the wrong one."
        ]
      },
      {
        kind: "table",
        title: "The lattice — four signals, one disposition",
        headers: ["KEV / confirmed ITW", "EPSS", "Reachable in our code", "Internet-exposed", "Disposition"],
        rows: [
          ["Yes", "any", "any", "Yes", "Emergency change. Clock starts at detection, not at ticket creation. Mitigate today, patch this week."],
          ["Yes", "any", "Yes", "No", "Standard emergency queue, 7 days. Lateral movement is the scenario; do not discount it because there is no public listener."],
          ["Yes", "any", "No / unknown", "No", "14 days. Reachability analysis is not a licence to ignore a vulnerability that adversaries are provably using — treat unknown as reachable."],
          ["No", "greater than 0.10", "Yes", "Yes", "14 days. This is the population that becomes tomorrow's KEV entry; treating it as routine is how organisations get surprised."],
          ["No", "greater than 0.10", "Yes", "No", "30 days, in the normal sprint."],
          ["No", "0.01 to 0.10", "Yes", "either", "Next scheduled dependency uplift. Do not create a ticket per CVE; create a ticket per upgrade."],
          ["No", "less than 0.01", "No", "No", "Suppress with a documented, expiring justification. Re-evaluate on EPSS movement, not on a calendar."]
        ]
      },
      {
        kind: "numbered",
        title: "Running the triage",
        items: [
          "Anchor on assets, not findings. A finding without a known owner, environment, and exposure classification cannot be triaged, only counted. Fix your asset inventory before you tune your scanner; every hour spent here repays tenfold downstream.",
          "Join KEV first. It is a binary, evidence-based fact of exploitation, maintained by CISA, and it is the only signal in the lattice that is not a prediction. Anything in KEV skips the debate entirely.",
          "Join EPSS second, and refresh it daily. EPSS scores move — a CVE at 0.004 on Tuesday can be at 0.62 on Friday when a proof of concept lands. A triage decision made against a stale score is a decision made against last week's world.",
          "Apply reachability third, and only third. Function-level reachability tells you whether the vulnerable symbol is on a call path from your entry points. It is the strongest noise reducer available and the easiest to over-trust.",
          "Apply exposure fourth, from network fact and not from architecture intent. Query the load balancers, the security groups, and the service mesh. Intent says it is internal; the config decides.",
          "Batch by fix, not by finding. Thirty CVEs resolved by one framework upgrade are one unit of work. Reporting them as thirty tickets makes your programme look busy and makes your engineers hate you.",
          "Publish the coverage and efficiency numbers monthly, next to the effort number. This is how you keep the right to set thresholds when someone senior demands you patch every critical."
        ]
      },
      {
        kind: "code",
        title: "The join, in the form the data actually takes",
        lang: "sql",
        body:
          "-- One row per remediable unit of work, not per finding.\nWITH signals AS (\n  SELECT\n    f.cve_id,\n    f.asset_id,\n    a.owner_team,\n    a.environment,\n    p.package,\n    p.fixed_version,\n    COALESCE(k.in_kev, FALSE)                AS kev,\n    e.epss_score,\n    e.epss_percentile,\n    COALESCE(r.function_reachable, NULL)     AS reachable,\n    x.internet_exposed\n  FROM findings f\n  JOIN assets a          ON a.id = f.asset_id\n  JOIN packages p        ON p.id = f.package_id\n  LEFT JOIN cisa_kev k   ON k.cve_id = f.cve_id\n  LEFT JOIN epss_daily e ON e.cve_id = f.cve_id AND e.as_of = CURRENT_DATE\n  LEFT JOIN reachability r ON r.cve_id = f.cve_id AND r.repo = a.repo\n  LEFT JOIN exposure x   ON x.asset_id = a.id\n)\nSELECT\n  owner_team,\n  package,\n  fixed_version,\n  COUNT(DISTINCT cve_id)                     AS cves_closed_by_this_upgrade,\n  BOOL_OR(kev)                               AS any_kev,\n  MAX(epss_score)                            AS worst_epss,\n  BOOL_OR(internet_exposed)                  AS any_exposed,\n  CASE\n    WHEN BOOL_OR(kev) AND BOOL_OR(internet_exposed)      THEN 'emergency'\n    WHEN BOOL_OR(kev)                                    THEN 'sev1_7d'\n    WHEN MAX(epss_score) > 0.10 AND BOOL_OR(reachable)   THEN 'sev2_14d'\n    WHEN MAX(epss_score) > 0.01 AND BOOL_OR(reachable)   THEN 'next_uplift'\n    ELSE 'suppress_with_expiry'\n  END                                        AS sla_bucket\nFROM signals\nWHERE environment = 'production'\nGROUP BY owner_team, package, fixed_version\nORDER BY any_kev DESC, worst_epss DESC;\n\n-- Note the WHERE clause. Triaging non-production findings against production\n-- SLAs is the single most common way vulnerability programmes lose credibility."
      },
      {
        kind: "compare",
        title: "Reachability: what it buys and what it costs you",
        left: {
          title: "What it legitimately buys",
          items: [
            "Order-of-magnitude noise reduction on transitive dependency findings, which are the bulk of the queue",
            "A defensible answer to the engineer asking why they must upgrade a library they never call",
            "Prioritisation that survives contact with a sprint planning meeting",
            "A forcing function to build a real dependency graph, which pays off again during incident scoping"
          ]
        },
        right: {
          title: "What it quietly costs you",
          items: [
            "Reflection, dynamic dispatch, dependency injection, and eval-style loading defeat static call graphs — the analysis reports unreachable and is simply wrong",
            "Configuration-triggered code paths look unreachable until a flag flips in production",
            "Vendored, minified, and native code is usually invisible to the analyser",
            "Unknown gets silently rendered as no in most dashboards, which converts a gap in tooling into a decision to ignore",
            "It says nothing about data reachability — whether attacker-controlled input actually arrives at the call site"
          ]
        }
      },
      {
        kind: "callout",
        title: "Three traps, each of which I have watched cost a quarter",
        body:
          "EPSS is not a risk score and does not know your environment. It estimates the probability that a CVE is exploited somewhere in the wild in the next thirty days. A 0.9 on software you do not run is worth nothing; a 0.02 on your single internet-facing authentication service deserves a conversation. Never multiply EPSS by an impact number and call the product risk — the units are incoherent. Second: KEV is a floor, not a ceiling. Inclusion requires a CVE identifier, reliable evidence of active exploitation, and clear remediation guidance, so exploitation that is targeted, unreported, or lacks a patch will not appear. Absence from KEV is absence of public evidence, nothing more. Third: suppression without expiry is the same disease as risk acceptance without expiry. Every suppression carries a date and a reason that can be checked."
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Prioritisation is the act of deciding what you will knowingly leave undone. Do it in writing, with numbers, in public — or it will be done for you by whoever escalates loudest."
      }
    ],
    sources: [
      {
        label: "FIRST, Exploit Prediction Scoring System (first.org/epss)",
        note: "The model, the daily API, and the definitions of coverage, efficiency, and effort. Read the model page and the why-EPSS article before you argue thresholds with anyone."
      },
      {
        label: "EPSS v4 release, 17 March 2025 (FIRST EPSS SIG; Empirical Security research writeup)",
        note: "The version that changed the practical calculus: reported ROC AUC around 0.838, and comparable coverage to a CVSS 7+ strategy at roughly a tenth of the remediation volume."
      },
      {
        label: "CISA Known Exploited Vulnerabilities catalog and BOD 22-01",
        note: "The only evidence-based, binary exploitation signal available free. Learn the three inclusion criteria so you can explain to an executive why a scary CVE is not on it."
      },
      {
        label: "CVSS v4.0 specification (FIRST)",
        note: "Read the Threat and Environmental metric groups specifically. Most organisations use only Base, which the specification explicitly says was never intended to be used alone for prioritisation."
      },
      {
        label: "Cyentia Institute and Kenna Security, Prioritization to Prediction (volumes 1-9)",
        note: "The empirical work that established remediation capacity as a hard constraint — most organisations close only a minority of open findings in a given month. Volume 5 on remediation capacity is the one to read first."
      },
      {
        label: "OWASP Top 10:2025, A03 Software Supply Chain Failures",
        note: "The 2025 revision promoted supply chain to third place and broadened it well beyond vulnerable components. Useful framing when arguing that dependency triage is not the whole of supply chain security."
      }
    ]
  },

  {
    id: "sg-fair-quantification-model",
    title: "Quantifying a Risk Without Lying",
    domain: "Risk Quantification",
    kind: "model",
    statement: "You do not need to be right about the number. You need to be wrong in a way that is visible and correctable.",
    summary:
      "The FAIR decomposition, applied in sixty minutes to one real scenario, with the calibration discipline that makes estimates honest and the failure modes that make quantification worse than the heat map it replaced.",
    minutes: 35,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "The argument for doing this at all",
        body:
          "A five-by-five heat map cannot be added, cannot be compared across business units, and cannot be checked against reality. Two analysts rating the same scenario High and Medium have no way to discover which of them is wrong, because the terms have no referent. Quantification is not valuable because the number is accurate — it usually is not — but because it is falsifiable. When you say we expect between one and four events per year, each costing between 1.2 and 9 million, you have made a claim that next year can contradict. That single property changes the conversation with a board from a debate about adjectives into a debate about evidence. It also exposes the estimates that were never really estimates, which is uncomfortable and is exactly the point."
      },
      {
        kind: "table",
        title: "The FAIR decomposition, and where the argument usually is",
        headers: ["Factor", "Definition", "How you actually estimate it", "Where teams get it wrong"],
        rows: [
          [
            "Loss Event Frequency",
            "How often a loss event occurs in a stated period",
            "Threat Event Frequency multiplied by Vulnerability",
            "Estimated directly from a gut feeling, skipping the decomposition that makes it debatable"
          ],
          [
            "Threat Event Frequency",
            "How often the threat actor acts against this asset",
            "Contact Frequency multiplied by Probability of Action; ground it in your own telemetry — blocked attempts, phishing reports, scan volume",
            "Confusing attempts against the perimeter with attempts against this specific asset"
          ],
          [
            "Vulnerability",
            "The proportion of threat events that become loss events",
            "A function of Threat Capability against Resistance Strength; usually estimated as a percentage with a wide range",
            "Set to 100 percent because a control is missing, ignoring the other controls in the path"
          ],
          [
            "Primary Loss",
            "Loss borne directly by the organisation",
            "Six forms: productivity, response, replacement, fines and judgments, competitive advantage, reputation",
            "Only response cost is counted, because it is the only one finance can produce an invoice for"
          ],
          [
            "Secondary Loss Event Frequency",
            "How often the primary event triggers a reaction from other parties",
            "Regulators, customers, and partners; often far below 100 percent, and that is the point",
            "Assumed to be certain, which inflates every scenario and destroys the model's discriminating power"
          ],
          [
            "Secondary Loss Magnitude",
            "Cost of that reaction",
            "Notification, credit monitoring, legal, fines, churn",
            "Estimated from a headline breach cost number that has no relationship to your record count or jurisdiction"
          ]
        ]
      },
      {
        kind: "numbered",
        title: "The sixty-minute estimate",
        items: [
          "Scope one scenario in one sentence: this actor, doing this thing, to this asset, producing this loss. External actor uses a stolen session cookie to export the customer table from the admin console is a scenario. Ransomware is not — it is a category, and categories cannot be estimated.",
          "Calibrate the estimators first. Give the group ten trivia questions with numeric answers and ask for 90 percent confidence intervals. Most untrained people land inside their own interval four or five times out of ten. Twenty minutes of this changes every number produced afterwards, and it is the single highest-leverage thing in the whole method.",
          "Estimate Threat Event Frequency as a range, and say out loud what evidence you are using. Your own detection data beats any industry report, because it is about you. If you have none, that discovery is worth more than the estimate.",
          "Estimate Vulnerability by naming the controls in the path and asking, against an actor with this capability, what fraction of attempts get through. Argue about the fraction, not about whether the control is good.",
          "Estimate Primary Loss by walking the six forms of loss explicitly. Response and replacement are easy; productivity is usually the largest and is usually forgotten.",
          "Estimate Secondary Loss Event Frequency separately from magnitude. Whether regulators react and how expensive their reaction is are two different uncertainties, and collapsing them is the most common source of nonsense in a FAIR analysis.",
          "Simulate. Ten thousand Monte Carlo draws over the ranges, output a loss exceedance curve, not a single number. The curve is the deliverable; the mean is the least interesting statistic on it.",
          "Record the assumptions and the evidence next to the result, and revisit when reality provides a data point. An estimate that is never compared to an outcome is astrology with better tooling."
        ]
      },
      {
        kind: "code",
        title: "The simulation, in the smallest honest form",
        lang: "python",
        body:
          "import numpy as np\n\nrng = np.random.default_rng(20260805)\nN = 100_000\n\n# Ranges are 90% confidence intervals from calibrated estimators.\n# TEF: 4 to 40 credential-theft attempts per year against admin console users.\ntef = rng.lognormal(mean=np.log(12), sigma=0.55, size=N)\n\n# Vulnerability: given phishing-resistant MFA plus session binding,\n# 1% to 12% of attempts succeed. Wide, because we have thin evidence.\nvuln = rng.beta(a=2.0, b=45.0, size=N)\n\nlef = tef * vuln                      # loss events per year\n\n# Primary loss per event: response, productivity, replacement.\nprimary = rng.lognormal(mean=np.log(350_000), sigma=0.8, size=N)\n\n# Secondary: happens only sometimes. Separate the frequency from the magnitude.\nslef = rng.uniform(0.15, 0.55, size=N)\nslm  = rng.lognormal(mean=np.log(1_800_000), sigma=1.0, size=N)\n\nannual_loss = lef * (primary + slef * slm)\n\nfor p in (50, 80, 90, 95, 99):\n    print(p, 'th percentile annual loss:', round(np.percentile(annual_loss, p)))\n\nprint('P(loss > 10M in a year):', round((annual_loss > 10_000_000).mean(), 4))\n\n# Report the exceedance curve and the P(exceeds tolerance) figure.\n# Never report the mean alone: these distributions are heavily skewed and the\n# mean sits above the median, which makes the typical year look worse than it is\n# and the bad year look better than it is."
      },
      {
        kind: "compare",
        title: "What the board actually hears",
        left: {
          title: "Heat map",
          items: [
            "This risk is High",
            "There are 14 High risks and 3 Critical risks",
            "Cannot be summed, so the portfolio view is a colour count",
            "Cannot be compared to any other business risk the board manages",
            "Cannot be checked next year — High was never falsifiable",
            "Invites the question why do you not just fix all the reds"
          ]
        },
        right: {
          title: "Loss exceedance curve",
          items: [
            "We estimate a 20 percent chance of exceeding 8 million in losses from this scenario next year",
            "Aggregated across scenarios, the portfolio has a 5 percent chance of exceeding 40 million",
            "Sits on the same axis as credit risk, weather risk, and litigation exposure",
            "Comparable to the organisation's stated risk tolerance, if one exists",
            "Wrong in a specific, checkable direction",
            "Invites the question what would move that curve and what does it cost"
          ]
        }
      },
      {
        kind: "callout",
        title: "The limits — say these out loud before anyone else does",
        body:
          "FAIR estimates frequency and magnitude of loss from an ontology; it does not model correlated failures, and correlation is where catastrophes live. A single shared identity provider failing does not produce independent losses across twelve applications — it produces one loss twelve times as large, and the model will not tell you that unless you scope the scenario at the identity provider. FAIR is also poor at genuinely novel events, because your frequency estimate has no base rate. And a quantified analysis carries false authority: a number produced from uncalibrated estimates looks exactly like a number produced from good evidence. Always publish the ranges and the evidence source, never the point estimate alone. If someone quotes your mean without the interval, that is a governance failure and you should correct it in the room."
      },
      {
        kind: "metric",
        title: "How to tell your quantification programme is working",
        items: [
          "Estimators are calibrated and their hit rate is measured — target 90 percent of true values falling inside 90 percent intervals",
          "The same scenario estimated by two independent groups produces overlapping intervals; if it does not, the scenario is underspecified",
          "At least one control investment decision per quarter cites a change in an exceedance curve rather than a compliance requirement",
          "Scenario assumptions are revisited when an actual event occurs, and the revision is recorded",
          "The number of scenarios in the register is small — twelve well-understood scenarios beat two hundred shallow ones"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Precision is cheap and worthless; calibration is expensive and decisive. Say I do not know as a range, not as a colour."
      }
    ],
    sources: [
      {
        label: "The Open Group, Risk Taxonomy (O-RT) Version 3.0 and Risk Analysis (O-RA)",
        note: "The normative FAIR standard. The taxonomy diagram in O-RT is the single page to pin above your desk; everything else in a FAIR argument reduces to which node you are debating."
      },
      {
        label: "Jack Freund and Jack Jones, Measuring and Managing Information Risk: A FAIR Approach",
        note: "The book that makes the ontology usable. Chapters on the six forms of loss are what stop teams from counting only incident response cost."
      },
      {
        label: "Douglas Hubbard and Richard Seiersen, How to Measure Anything in Cybersecurity Risk (2nd ed., 2023)",
        note: "The calibration training method and the argument against ordinal scales. If you read one thing before running a session, make it the calibration chapter."
      },
      {
        label: "FAIR Institute, FAIR-CAM (Controls Analytics Model) and FAIR-MAM (Materiality Assessment Model)",
        note: "FAIR-CAM addresses the gap where controls are treated as binary; FAIR-MAM matters if you are under SEC materiality disclosure obligations."
      },
      {
        label: "Verizon Data Breach Investigations Report (annual)",
        note: "Use for base rates on initial access vectors, not for loss magnitude. The 2025 edition puts credential abuse at 22 percent and exploitation of vulnerabilities at 20 percent of breach initial vectors — useful priors for Threat Event Frequency."
      },
      {
        label: "Tony Cox, What's Wrong with Risk Matrices? (Risk Analysis, 2008)",
        note: "The formal proof that qualitative risk matrices can rank a lower risk above a higher one. Keep it to hand for the meeting where someone defends the heat map."
      }
    ]
  },

  {
    id: "sg-post-incident-review-template",
    title: "The Post-Incident Review That Changes Something",
    domain: "Incident Response",
    kind: "template",
    statement: "The output of a review is a change to the system, not a change to how careful people promise to be.",
    summary:
      "A post-incident review record built for security incidents specifically — with the contributing-factor taxonomy that keeps you from stopping at human error, the timeline format that exposes detection gaps, and the action test that kills the actions nobody will do.",
    minutes: 30,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "What makes a security review different from an availability one",
        body:
          "Reliability post-mortems ask why the system broke. Security reviews must additionally ask what an intelligent adversary chose, and why that choice was available to them. That difference changes the method in three concrete ways. First, the timeline must have two tracks — what the adversary did, and what we saw — because the gap between them is the finding. Second, contributing factors include decisions made years earlier by people who are no longer here; a flat account of the week of the incident will miss the design choice that made it possible. Third, some actions cannot be published internally, because the adversary may still be in the environment or may return. Plan for a restricted annex from the start rather than sanitising afterwards."
      },
      {
        kind: "code",
        title: "The record",
        lang: "markdown",
        body:
          "# Post-Incident Review — <incident name, not the ticket number>\n\nSeverity: <sev>            Declared: <UTC>       Contained: <UTC>       Closed: <UTC>\nIncident commander: <name>  Review facilitator: <name, not the IC>\nReview date: <YYYY-MM-DD>   Attendees: <everyone who touched it, including on-call>\nDistribution: <internal-all | internal-restricted | restricted annex exists>\n\n## 1. What happened, in five sentences\n<Written for someone joining the company next month. No jargon, no tool names.>\n\n## 2. Impact, stated in outcomes\n- Data: <what was accessed, exfiltrated, or modified; how we know; how confident>\n- Availability: <duration, users, transactions>\n- Trust: <customers notified, regulators notified, obligations triggered>\n- Cost: <response hours, vendor spend, remediation engineering weeks>\n\n## 3. Dual timeline\n| Time (UTC) | Adversary action | Our observation | Signal that existed but was not used |\n|---|---|---|---|\n\n<The fourth column is the most valuable in the document. It is where you find the\nlog that had the answer, unqueried, the whole time.>\n\n## 4. Detection and response analysis\n- Time from first adversary action to first signal generated: <duration>\n- Time from first signal generated to first human seeing it: <duration>\n- Time from human seeing it to declaration: <duration>\n- Time from declaration to containment: <duration>\n- Which of these four is the largest, and why: <sentence>\n\n## 5. Contributing factors\n<Use the taxonomy. Aim for at least four factors across at least three categories.\nA review that finds one cause has stopped early.>\n\n## 6. What went right\n<Not decoration. Name the controls and behaviours that worked, because the next\ncost-cutting exercise will come for them and this is the evidence that saves them.>\n\n## 7. Actions\n| # | Action | Type | Owner | Due | How we will verify it happened |\n|---|---|---|---|---|---|\n\nType is one of: eliminate (removes the class of problem), reduce (shrinks blast\nradius), detect (we would see it next time), respond (we would handle it faster).\nA review whose actions are all detect and respond has accepted the recurrence.\n\n## 8. Open questions we could not answer\n<Honest list. Unknown scope, missing logs, unavailable vendor data. Each becomes\nan action or an accepted limitation with a name against it.>\n\n## 9. Restricted annex\n<Adversary infrastructure, undisclosed detections, attribution, legal analysis.\nSeparate document, separate access list, referenced by identifier only.>"
      },
      {
        kind: "table",
        title: "Contributing factor taxonomy — keep asking until you have four",
        headers: ["Category", "The question", "An example finding at this level"],
        rows: [
          [
            "Design",
            "What structural property of the system made this possible?",
            "The support console authenticated to the database as a single shared service account, so per-operator attribution never existed"
          ],
          [
            "Control",
            "Which control was absent, misconfigured, or bypassable?",
            "Conditional access required MFA but exempted a legacy protocol still enabled for eleven accounts"
          ],
          [
            "Visibility",
            "What signal did not exist, or existed and was not routed to a human?",
            "Vault audit logs were retained but never onboarded to the SIEM, so no query could reach them during the incident"
          ],
          [
            "Process",
            "Which procedure was ambiguous, missing, or too slow under pressure?",
            "The credential rotation runbook covered production but not the CI system that held a copy of the same key"
          ],
          [
            "Organisational",
            "What incentive, staffing, or ownership gap produced the conditions?",
            "The service had no named owner for fourteen months following a reorganisation, so no one triaged its findings"
          ],
          [
            "Decision",
            "What earlier decision, reasonable at the time, closed off a better option?",
            "A 2023 acceptance memo deferred network segmentation for this environment; it expired and was never revisited"
          ]
        ]
      },
      {
        kind: "timeline",
        title: "What a good dual timeline exposes — a real-shaped example",
        items: [
          "T+0h — Adversary authenticates to the VPN with credentials harvested by an infostealer. Our observation: successful login, no alert. Signal that existed: the account had never authenticated from that ASN.",
          "T+3h — Adversary enumerates internal DNS and file shares. Our observation: none. Signal that existed: EDR recorded the enumeration binary's execution, retained for 30 days, never queried.",
          "T+31h — Adversary registers a new authentication method on a privileged account. Our observation: none. Signal that existed: an identity provider audit event with a dedicated event code, present in the log, no detection written against it.",
          "T+52h — Adversary accesses the backup console. Our observation: none. Signal: backup console has its own log, not forwarded anywhere.",
          "T+96h — Encryption begins on a file cluster. Our observation: monitoring pages on disk write throughput. First human sees it 4 minutes later.",
          "T+97h — Incident declared. Containment at T+103h.",
          "Reading: mean time to detect was 96 hours, but mean time to detect once a signal was routed to a human was 4 minutes. The problem was never response speed. It was that three separate signals existed and none of them had a query pointed at it."
        ]
      },
      {
        kind: "list",
        title: "Phrases that mean the review stopped too early",
        items: [
          "Human error — a category, not a cause. Ask what made the error easy, and what made it undetectable for as long as it was.",
          "Lack of awareness — if the control depends on a person noticing something, it is not a control, it is a hope with a training budget.",
          "The team will be more careful — unfalsifiable, unassignable, and gone in six weeks.",
          "We will remind everyone — a reminder is an action item that costs nothing and does nothing, which is precisely why it survives review meetings.",
          "Root cause — singular. Complex systems fail through the interaction of several factors, and naming one is usually naming the most junior person in the chain.",
          "We were targeted by a sophisticated actor — sometimes true, and almost never the useful part. The useful part is which of your controls the sophistication was not needed to defeat."
        ]
      },
      {
        kind: "callout",
        title: "Blameless does not mean consequence-free",
        body:
          "Blameless means the review is not the venue for accountability, so that people tell you the truth about what they did and why it made sense to them at the time. It does not mean nothing follows. Repeated wilful policy violation is a management matter, handled elsewhere, by managers, with the review's factual account as input. Conflating the two ruins both: teams that fear the review conceal detail, and organisations that never act on wilful violation teach that the rules are decorative. Say this distinction out loud at the start of every review, because half the room assumes one meaning and half assumes the other."
      },
      {
        kind: "checklist",
        title: "The action test — apply to every row in section 7",
        items: [
          "Is there exactly one named human, not a team, on the owner line",
          "Would this action have prevented, reduced, or detected this specific incident — can you point at the timeline row it addresses",
          "Is the verification method something other than the owner saying it is done",
          "If the action is of type detect, does a query exist and does a named person triage its output",
          "Is at least one action of type eliminate — if every action is detect or respond, you have chosen to let this happen again",
          "Is the due date inside the period during which anyone will still remember why it exists",
          "Has an action from a previous review been re-opened here — if the same factor appears twice, escalate the factor, not the action"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "The review is not for the incident that happened. It is for the person who will make the same reasonable-looking decision in eighteen months with none of your context."
      }
    ],
    sources: [
      {
        label: "Google SRE Book, Postmortem Culture: Learning from Failure",
        note: "The blameless discipline and the template that most of the industry derives from. Read it for the culture argument, then add the adversary track this guide describes."
      },
      {
        label: "Sidney Dekker, The Field Guide to Understanding Human Error (3rd ed.)",
        note: "The book that will stop you writing human error in section 5. The local rationality principle — behaviour made sense given what the person knew — is the whole method in one idea."
      },
      {
        label: "Mandiant M-Trends 2026",
        note: "Global median dwell time of 14 days, with 52 percent of intrusions detected internally, and a median of 122 days for espionage and North Korean IT worker cases. Use these as the benchmark for section 4, and note how different the espionage figure is."
      },
      {
        label: "John Allspaw and Richard Cook, Etsy Debriefing Facilitation Guide",
        note: "How to actually run the meeting: separate facilitator, second-story questions, and the specific techniques for getting past the sanitised account."
      },
      {
        label: "Charles Perrow, Normal Accidents: Living with High-Risk Technologies",
        note: "The origin of the interactive-complexity and tight-coupling analysis. It explains why single-root-cause reviews are structurally wrong for the systems we run."
      },
      {
        label: "CISA and partners, joint advisories on incident response (AA20-245A and successors)",
        note: "Practical checklists for evidence preservation during response, which is what determines whether section 3 can be written at all."
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  /* IDENTITY AND CRYPTOGRAPHY                                         */
  /* ---------------------------------------------------------------- */
  {
    id: "sg-passkey-rollout-playbook",
    title: "Rolling Out Phishing-Resistant MFA Without Breaking the Company",
    domain: "Identity",
    kind: "playbook",
    statement: "Phishing resistance is a property of the weakest enrolled path, not of the strongest credential you shipped.",
    summary:
      "A seven-phase passkey and security key rollout: persona mapping, bootstrap without a password, enforcement by policy rather than by request, and the recovery and help desk hardening that is the actual attack surface once the credentials are strong.",
    minutes: 45,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why this is the highest-leverage identity project available",
        body:
          "The 2025 Verizon DBIR puts credential abuse at 22 percent of breach initial vectors and phishing at 16 percent. Mandiant's M-Trends 2026 reports voice phishing rising to 11 percent of initial infection vectors, the second most common overall, while email phishing fell to 6 percent — the adversary moved from your inbox to your help desk because that is where the reset button lives. This matters for sequencing. A rollout that deploys passkeys to users and leaves the help desk able to reset any credential on the strength of a phone call has not removed the phishable path; it has renamed it. NIST SP 800-63B-4 defines phishing resistance narrowly, as the authentication protocol preventing disclosure of authentication secrets and valid authenticator outputs to an impostor verifier, satisfied by channel binding or verifier name binding. Nothing about your process is covered by that definition, which is exactly why the process is where you will be attacked."
      },
      {
        kind: "table",
        title: "Persona map — build this before you buy anything",
        headers: ["Persona", "Constraint that decides the credential", "Primary credential", "Fallback that is still phishing-resistant"],
        rows: [
          [
            "Corporate knowledge worker, managed device",
            "Has one primary device, works in a browser",
            "Platform passkey bound to the managed device (Windows Hello for Business, macOS platform credential)",
            "Enrolled second platform passkey on phone"
          ],
          [
            "Privileged administrator",
            "Compromise is unrecoverable; AAL3 expectations apply",
            "Device-bound FIDO2 security key, hardware, non-exportable private key",
            "Second security key, stored separately, enrolled at issue"
          ],
          [
            "Shared workstation, no personal device (retail, clinical, manufacturing)",
            "No per-user device, gloves, no biometric reader",
            "Security key on a badge lanyard, or smart card with certificate-based authentication",
            "Supervisor-attested in-person re-issue, never a phone-based reset"
          ],
          [
            "Field or frontline worker, personal phone only",
            "No corporate device to bind to",
            "Passkey in the platform authenticator on the personal phone",
            "Time-boxed, in-person credential issuance at a depot"
          ],
          [
            "Developer with production access",
            "Also authenticates to source control, cloud, CI",
            "Hardware security key, enrolled to the identity provider and to source control independently",
            "Second hardware key; never an SMS or TOTP fallback on these accounts"
          ],
          [
            "Break-glass account",
            "Must work when the identity provider integration fails",
            "Two hardware keys held by two different people in two different safes",
            "None. Physical process only, alarmed on use"
          ],
          [
            "External contractor or partner",
            "Not on your device fleet, not in your directory",
            "Synced passkey acceptable at AAL2, backed by device compliance signals where possible",
            "Sponsor re-attestation, expiring access"
          ]
        ]
      },
      {
        kind: "numbered",
        title: "The seven phases",
        items: [
          "Phase 0 — Inventory the phishable paths, not the users. Enumerate every way a session can be obtained: SMS and voice one-time codes, TOTP, push approval, email magic links, legacy authentication protocols, help desk reset, self-service password reset with knowledge-based questions, delegated admin, service accounts with static secrets, and application passwords. This list is your actual scope. NIST SP 800-63B-4 prohibits knowledge-based authentication outright and forbids email as an out-of-band channel; if either exists in your environment, they are phase-0 removals, not phase-6 cleanup.",
          "Phase 1 — Fix registration before you fix authentication. An attacker who can enrol a credential does not need to phish one. Require an existing strong credential or an in-person or supervised issuance to register a new authenticator; instrument every registration event as a high-signal detection. This is the phase most programmes skip and every serious adversary targets.",
          "Phase 2 — Bootstrap privileged users first, in person, with two hardware keys each. Two, at enrolment, both registered. One key is a future help desk call, which is the thing you are trying to eliminate. Do administrators before the general population — the population is bigger but the administrators are the reason you are doing this.",
          "Phase 3 — Roll out to the general population with a passwordless-capable bootstrap. A time-limited, single-use onboarding credential issued through a verified channel lets a user register a passkey without ever typing a password. Cap its lifetime in hours, restrict who can issue it, and alert on every issuance by an administrator to an account they do not manage.",
          "Phase 4 — Enforce by policy, scoped to applications, not by asking users to switch. Conditional access requiring an authentication strength of phishing-resistant, applied first to the administrative consoles, then to the crown-jewel applications, then to everything. Enforcement that depends on user goodwill has a ceiling around 40 percent and stays there.",
          "Phase 5 — Kill the fallbacks, one at a time, with a measured exception queue. Disable legacy authentication protocols, remove SMS and voice as a registerable method, remove TOTP from privileged accounts, and turn off self-service password reset paths that do not require a phishing-resistant credential. Each removal gets its own change window and its own rollback, because each will break something you did not know existed.",
          "Phase 6 — Harden the human path. Re-write help desk verification so that identity proofing for a credential reset requires either an in-person check, a manager attestation through an authenticated channel, or a video call with a government identity document, and never a set of facts an attacker can buy. Record the calls. Rate-limit resets per agent per day and alert on outliers. This is the phase that determines whether the whole programme actually removed the risk.",
          "Phase 7 — Sustain. Registration events, method-removal events, and fallback usage are permanent detections, not project artifacts. Report the percentage of authentications that were phishing-resistant, per application, monthly, forever."
        ]
      },
      {
        kind: "code",
        title: "The policy shape that matters, expressed independent of vendor",
        lang: "yaml",
        body:
          "# Enforcement is a matrix of (who, what, from where) -> required authentication strength.\n# Write it in this form first; translate to your IdP second.\n\npolicies:\n  - name: admin-consoles-phishing-resistant-only\n    applies_to:\n      roles: [global-admin, privileged-role-admin, security-admin, billing-admin]\n      apps: [idp-admin-portal, cloud-console, source-control-org-settings, ci-admin]\n    require:\n      authentication_strength: phishing-resistant\n      device_state: compliant-managed\n      session_lifetime_hours: 4\n    block:\n      - legacy_auth_protocols\n      - authentication_from_unmanaged_device\n\n  - name: crown-jewel-apps\n    applies_to:\n      apps: [customer-data-console, payments-admin, hr-system, secrets-manager]\n    require:\n      authentication_strength: phishing-resistant\n      reauth_on_sensitive_action: true\n\n  - name: registration-of-new-authenticators\n    applies_to:\n      action: register_authenticator\n    require:\n      authentication_strength: phishing-resistant\n      OR_bootstrap_credential:\n        issued_by_role: [helpdesk-tier2]\n        max_lifetime_hours: 8\n        single_use: true\n    alert_always: true    # every registration is a detection, no exceptions\n\n  - name: break-glass\n    applies_to:\n      accounts: [emergency-01, emergency-02]\n    require:\n      authentication_strength: hardware-bound-key\n    exclude_from: [all_conditional_access_blocking_policies]\n    alert:\n      on_any_authentication: page-security-oncall-immediately\n      on_any_property_change: page-security-oncall-immediately"
      },
      {
        kind: "compare",
        title: "Synced passkeys versus device-bound keys — decide per persona, not per organisation",
        left: {
          title: "Synced passkeys (platform or password manager)",
          items: [
            "Recoverable when a device is lost, which removes the largest source of help desk load",
            "Adoption is fast because the enrolment flow is familiar and needs no procurement",
            "Permitted at AAL2 under SP 800-63B-4, addressed in its Appendix B",
            "Explicitly not permitted at AAL3, because syncing requires an exportable private key",
            "Your security now partly depends on the sync fabric's account recovery, which you do not control and cannot audit",
            "Right answer for the general population and most contractors"
          ]
        },
        right: {
          title: "Device-bound FIDO2 hardware keys",
          items: [
            "Non-exportable private key in a hardware authenticator; meets AAL3 expectations",
            "Attestation lets you enforce which models are acceptable, which matters for regulated roles",
            "Loss is a real operational event, which is why you issue two at enrolment and never one",
            "Procurement, shipping, and inventory become an ongoing programme cost",
            "No dependency on any consumer cloud account",
            "Right answer for administrators, developers with production access, and break-glass"
          ]
        }
      },
      {
        kind: "callout",
        title: "The recovery path is the attack",
        body:
          "Every credential system is only as strong as the thing that replaces a lost credential. Once passkeys are deployed, the adversary's cheapest route is a phone call to your service desk asking for a reset — which is precisely the shift M-Trends 2026 measured when voice phishing became the second most common initial infection vector. Three concrete controls, in order of value. One: the person who can reset a credential must not be able to do it alone for privileged accounts; require a second approver or a manager attestation delivered through an authenticated channel. Two: eliminate every knowledge-based check. Employee number, manager's name, last four of anything — all of it is purchasable, and SP 800-63B-4 forbids it. Three: make reset volume a monitored metric per agent. Social engineering campaigns show up as a statistical anomaly in one agent's queue days before they show up in an incident."
      },
      {
        kind: "metric",
        title: "What to report weekly, and the one number executives should see",
        items: [
          "Percentage of interactive authentications satisfying phishing resistance, split by application tier — this is the headline number, not enrolment percentage",
          "Enrolment percentage by persona, because a 90 percent org-wide figure hiding 40 percent among administrators is a failure dressed as success",
          "Count of authentications using a removable fallback method, trending to zero, per application",
          "Credential reset volume per help desk agent, with an outlier flag",
          "Count of authenticator registration events on privileged accounts, which should be near zero in steady state and each of which is reviewed",
          "Median time from user requesting help to restored access — if this rises, adoption stalls and pressure to re-enable fallbacks becomes irresistible",
          "For the executive slide: Microsoft's consumer sign-in analysis reports passwords taking around 24 seconds on average, passkeys around 8 seconds, and synced passkeys around 3. This project is faster for users; lead with that and the security argument lands as a bonus."
        ]
      },
      {
        kind: "checklist",
        title: "Go or no-go before you enforce on a population",
        items: [
          "Every persona in that population has an enrolled primary and an enrolled phishing-resistant fallback",
          "Break-glass accounts are excluded from the blocking policy, hold hardware keys, and page on any authentication",
          "The help desk reset procedure for this population has been rewritten and rehearsed, not just documented",
          "A detection fires on every authenticator registration and every method removal for this population, with a named triage owner",
          "Legacy authentication protocols are measured to zero for this population for at least fourteen consecutive days",
          "Rollback is a single policy toggle that a named on-call engineer can execute at 3 a.m. without an approval chain",
          "Someone has attempted to social-engineer your own help desk for a reset on a test account in this population, and failed",
          "Service accounts and application passwords used by this population are inventoried, because they are the path that survives enforcement"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "You have not deployed phishing-resistant authentication until an attacker with your user's password, their phone number, and their manager's name still cannot obtain a session."
      }
    ],
    sources: [
      {
        label: "NIST SP 800-63B-4, Digital Identity Guidelines: Authentication and Authenticator Management (final, 2025)",
        note: "Section 3.2.5 defines phishing resistance as channel binding or verifier name binding. Appendix B covers syncable authenticators, permitted at AAL2 and prohibited at AAL3 because the private key must be exportable. Section 3.1.1.2 prohibits knowledge-based authentication."
      },
      {
        label: "NIST SP 800-63B-4, Sections 2.2.3 and 2.3.3 — reauthentication",
        note: "AAL2 sets a 24 hour overall session limit with a 1 hour inactivity limit; AAL3 sets 12 hours and 15 minutes. Use these to set session lifetimes per application tier rather than picking a number that feels safe."
      },
      {
        label: "Verizon 2025 Data Breach Investigations Report",
        note: "Credential abuse at 22 percent and phishing at 16 percent of breach initial vectors, across 12,195 confirmed breaches. This is the business case slide."
      },
      {
        label: "Mandiant M-Trends 2026",
        note: "Voice phishing at 11 percent of initial infection vectors, now second overall, while email phishing dropped to 6 percent. The evidence that phase 6 is not optional."
      },
      {
        label: "FIDO Alliance, FIDO2 and WebAuthn specifications; W3C Web Authentication Level 3",
        note: "The protocol itself. Read the attestation and the resident credential sections if you intend to restrict which authenticator models are acceptable for privileged roles."
      },
      {
        label: "Microsoft Entra, phishing-resistant passwordless deployment guidance",
        note: "The persona-based planning method and the temporary access pass bootstrap pattern generalise beyond one vendor. Also the source of the sign-in duration comparison of roughly 24 seconds, 8 seconds, and 3 seconds."
      },
      {
        label: "CISA, Implementing Phishing-Resistant MFA and the Scattered Spider joint advisory (AA23-320A)",
        note: "The advisory documents help desk social engineering, SIM swapping, and MFA fatigue as primary techniques against organisations that had already deployed MFA. Read it as a specification for phase 6."
      }
    ]
  },

  {
    id: "sg-key-hierarchy-model",
    title: "Key Hierarchy and KMS Design",
    domain: "Cryptography",
    kind: "model",
    statement: "Design the hierarchy around who can be compelled to decrypt, not around which cipher you admire.",
    summary:
      "A four-layer key model — root, key-encryption, data-encryption, and ephemeral — with the blast-radius reasoning behind each boundary, the honest limits of envelope encryption, and the crypto-shredding property that only exists if you designed for it up front.",
    minutes: 35,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "The question the hierarchy answers",
        body:
          "Encryption at rest is close to meaningless as a control statement. The useful question is: when this specific component is compromised, what plaintext becomes available, and to whom? A key hierarchy is the instrument that lets you answer it. Every layer boundary in the hierarchy exists to make one class of compromise less than total. If your application server holds a key that decrypts all customer records, then application server compromise equals total data loss, and no amount of AES-256 in the marketing material changes that. Conversely, if the application can only ask a key service to unwrap a per-tenant key, and that service logs and rate-limits and can be revoked per tenant, then the same compromise has a bounded, measurable, and detectable consequence. That is the entire design goal. Choose the boundaries first; the algorithms are the easy part and NIST has already chosen them for you."
      },
      {
        kind: "table",
        title: "The four layers",
        headers: ["Layer", "What it is", "Where it lives", "Rotation reality", "Blast radius if it leaks"],
        rows: [
          [
            "Root / master",
            "The key that protects key-encryption keys and nothing else",
            "Hardware security module, FIPS 140-3 validated, non-exportable, dual control for administrative operations",
            "Rarely, and rotation means re-wrapping the KEK layer only. Design this so it is possible; most teams discover it is not.",
            "Total. Every downstream key is recoverable. This is why it never leaves hardware and why administrative access requires two people."
          ],
          [
            "Key-encryption key (KEK)",
            "Per tenant, per environment, or per data domain; wraps data keys",
            "Cloud KMS or HSM, referenced by identifier, never materialised in application memory",
            "Annually, or on personnel change for that domain. Rotation re-wraps DEKs, which is cheap because DEKs are small.",
            "One tenant or one domain. This layer is where you buy the ability to say the breach affected these customers and not those."
          ],
          [
            "Data-encryption key (DEK)",
            "Encrypts the actual records, objects, or files",
            "Stored encrypted next to the ciphertext; exists in plaintext only in application memory, for the duration of one operation",
            "On write, or per object. Never rotate DEKs on a schedule — generate fresh ones and let old ciphertext age out.",
            "The records that one DEK covers. Choose DEK granularity to make this sentence acceptable when read aloud to a regulator."
          ],
          [
            "Ephemeral / session",
            "TLS session keys, token signing keys, per-request derived keys",
            "Process memory, short-lived, forward-secret where the protocol allows",
            "Minutes to hours, automatically",
            "One session or one signing window. Getting this layer right is what makes the difference between a key leak and a key leak with historical decryption."
          ]
        ]
      },
      {
        kind: "code",
        title: "Envelope encryption, written out so the failure points are visible",
        lang: "yaml",
        body:
          "write_path:\n  1_request: application asks KMS to generate a data key under tenant KEK alias\n  2_kms_returns:\n      plaintext_dek: held in memory, zeroised after step 4\n      wrapped_dek: opaque blob, safe to persist\n  3_encrypt: AES-256-GCM over the record, with an authenticated-data field\n              carrying tenant_id and record_id so a wrapped DEK cannot be\n              replayed against a different record\n  4_persist: store ciphertext, nonce, auth tag, wrapped_dek, kek_version\n  5_zeroise: overwrite plaintext_dek\n\nread_path:\n  1_fetch: read ciphertext and wrapped_dek\n  2_unwrap: ask KMS to decrypt wrapped_dek, passing the same encryption context\n  3_decrypt: AES-256-GCM, verify auth tag, verify context matches this record\n  4_zeroise\n\nfailure_points_to_design_for:\n  - The KMS call in step 2 is your audit trail and your rate limit. If the\n    application caches unwrapped DEKs for performance, you have deleted both.\n    Cache with a hard TTL measured in seconds and count cache hits as a metric.\n  - The encryption context is what prevents a valid wrapped DEK from decrypting\n    a record it does not belong to. Omitting it is the single most common\n    envelope-encryption implementation flaw.\n  - kek_version must be persisted, or KEK rotation becomes unrecoverable.\n  - An application role that can call unwrap for every tenant is functionally\n    a root key. Scope the KMS grant by tenant, or the hierarchy is decorative."
      },
      {
        kind: "numbered",
        title: "Designing the hierarchy for a new system",
        items: [
          "Write the compromise sentences first. One line per component: if the web tier is compromised, the adversary can decrypt _____. Fill in the blanks with the design you are proposing. If any blank reads everything, the design is not finished.",
          "Choose DEK granularity by the unit you would need to isolate in an incident. Per tenant is usually right. Per record is expensive and often unnecessary. Per table is almost always wrong, because it maps to no business boundary.",
          "Put the KEK boundary where the deletion obligation is. If a customer can demand erasure, or a contract requires proof of destruction, the KEK must be per customer — destroying it is the only deletion primitive that works across backups, replicas, and analytics copies you have lost track of.",
          "Separate the authority to use a key from the authority to manage it. Decrypt and encrypt permissions belong to services; create, schedule-deletion, and policy-change belong to a small human group under dual control. Any principal holding both is a single point of total failure.",
          "Make key policy changes a detection, not a review item. Every modification of a key policy, grant, or alias should generate an alert with a named triage owner. Adversaries with cloud access do not steal keys; they add themselves to the policy.",
          "Decide the availability story explicitly. A KMS is now on the critical path for reads. Multi-region key replicas, request quotas, and a documented behaviour on KMS unavailability are design decisions, not operational afterthoughts. Teams discover this during their first regional outage.",
          "Write the rotation runbook and execute it once, in production, before you need it. A rotation capability that has never been exercised does not exist."
        ]
      },
      {
        kind: "compare",
        title: "Per-tenant KEK versus one shared key — the decision most teams get wrong by default",
        left: {
          title: "Per-tenant KEK",
          items: [
            "Incident scoping becomes an evidence question with an answer: which tenant KEKs were unwrapped, by which principal, in the window",
            "Crypto-shredding is real — destroy the KEK and the tenant's data is unrecoverable everywhere it was ever copied",
            "Regulatory deletion and data residency arguments become tractable",
            "Costs: one KMS key per tenant hits service quotas at scale, and key lifecycle becomes part of tenant provisioning and deprovisioning",
            "Cross-tenant analytics gets harder, which is a feature disguised as a cost"
          ]
        },
        right: {
          title: "One shared application key",
          items: [
            "Simple, cheap, and fast; one alias, no lifecycle work, no quota problems",
            "Any compromise of the application identity is total, for every customer, for all time",
            "Deletion can only ever be a claim about your database, never a proof about your backups",
            "Incident scope defaults to all customers, which drives notification obligations to their maximum",
            "Defensible only for genuinely single-tenant systems or non-sensitive data — and be honest about which one you have"
          ]
        }
      },
      {
        kind: "callout",
        title: "Three lies the industry tells about key management",
        body:
          "First, that rotation provides security. Rotating a key that was never exposed accomplishes nothing except proving the mechanism works — which is a real and worthwhile reason, but it is an operational readiness exercise, not a control against an adversary. Rotation matters when there is reason to believe exposure occurred, and it only matters if old ciphertext is also re-encrypted or aged out; otherwise the historical data remains readable under the old key you kept for decryption. Second, that a hardware security module makes a system secure. An HSM guarantees the key does not leave; it says nothing about who may ask it to sign or decrypt. Almost every real HSM-related failure is an authorisation failure at the API in front of it. Third, that customer-managed keys give the customer control. If your service must decrypt to function, the customer's control amounts to the ability to revoke access and thereby break their own service — real, valuable, and much narrower than the marketing implies. Say the narrow version to customers; they respect it and it survives due diligence."
      },
      {
        kind: "metric",
        title: "What a healthy key programme actually measures",
        items: [
          "Number of principals with unwrap or decrypt authority on each KEK, trending down, reviewed quarterly by a human who understands the system",
          "Number of principals with key policy modification authority, which should be a single-digit number under dual control",
          "Percentage of KMS calls carrying a correct encryption context — anything below 100 percent is a live vulnerability",
          "Age of the oldest KEK version still required for decryption, which measures how much historical ciphertext a leaked old key would open",
          "Time to complete a full KEK rotation for one tenant, measured by actually doing it, not by estimating it",
          "Count of keys with scheduled deletion pending, and the number of days remaining — the highest-consequence irreversible operation in the platform"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "A key hierarchy is a blast-radius argument written in cryptography. If you cannot state the blast radius of each layer in one sentence, you have a key store, not a hierarchy."
      }
    ],
    sources: [
      {
        label: "NIST SP 800-57 Part 1 Rev. 5, Recommendation for Key Management: General (May 2020)",
        note: "The normative reference for key types, cryptoperiods, and security strengths. Read the key-type taxonomy in Section 5 and the cryptoperiod discussion in Section 5.3 before you defend a rotation policy to an auditor."
      },
      {
        label: "NIST SP 800-130, A Framework for Designing Cryptographic Key Management Systems, and SP 800-152, its federal profile",
        note: "Dry, but they enumerate the design decisions a CKMS must make explicit. Use them as a checklist against your own design document to find the questions you did not know you had answered by default.",
        url: "https://csrc.nist.gov/pubs/sp/800/152/final",
        checked: "2026-11-04",
      },
      {
        label: "FIPS 140-3, Security Requirements for Cryptographic Modules",
        note: "What an HSM validation actually asserts, and at which level. Necessary before you accept a vendor claim of FIPS-compliant, which is not a defined term."
      },
      {
        label: "AWS Key Management Service developer guide — encryption context, grants, and key policies",
        note: "The clearest widely-available treatment of envelope encryption in practice. The encryption context section explains the binding that prevents wrapped-key replay; the grants model is the concrete form of separating use from management."
      },
      {
        label: "Google, Building Secure and Reliable Systems, chapter on design for recovery",
        note: "The counterweight to key-destruction enthusiasm: crypto-shredding is an irreversible operation on a distributed system, and the chapter explains what that obliges in review and rollout."
      },
      {
        label: "Latacora, Cryptographic Right Answers (and its predecessors)",
        note: "For the algorithm choices, so you stop spending review time on them. Its value is telling you which decisions are already made so you can spend attention on the hierarchy, which is not."
      }
    ]
  },

  {
    id: "sg-secrets-incident-playbook",
    title: "A Secret Just Leaked",
    domain: "Secrets Management",
    kind: "playbook",
    statement: "Rotation is not remediation until you can prove the old credential is dead and the new one was never in the same place.",
    summary:
      "The first sixty minutes and the following five days after a credential exposure: containment order, the proof-of-death table by secret type, the hunt for what the credential already did, and the closure criteria that stop this becoming an annual event.",
    minutes: 40,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why this is a whole playbook and not a runbook step",
        body:
          "Secret exposure is the most common security incident most organisations will ever have, and the one they handle worst. GitGuardian's 2025 report counted 23.77 million new secrets in public GitHub commits during 2024, a 25 percent increase year over year, across 4.61 percent of the 69.6 million repositories scanned. The number that should worry you more is this one: roughly 70 percent of secrets leaked in 2022 were still valid at the time of the report. Organisations detect these and do not kill them. And private repositories are not the safe harbour people assume — 35 percent of scanned private repositories contained at least one plaintext secret, a rate roughly nine times that of public ones. The reason handling is poor is that rotation looks like completion. It is not. The three questions that matter are: is the old credential dead, what did it do while it was live, and how did it get there. Most responses answer the first badly and never ask the other two."
      },
      {
        kind: "timeline",
        title: "The first sixty minutes",
        items: [
          "0-5 min — Determine the blast radius before touching anything. What does this credential authorise, in which environments, and is it used by anything on the critical path? Revoking a database credential that six services share, at 14:00 on a Tuesday, is an availability incident you caused. Know before you act.",
          "5-10 min — Decide revoke-now or rotate-then-revoke. Revoke immediately if the secret is public, or if it grants write, deploy, or key-management authority. Rotate first if it is a shared production credential with no fast-revoke path and the exposure was in a private, access-controlled location. Write the decision and the reason in the incident channel; you will be asked about it.",
          "10-20 min — Execute revocation and confirm it with a negative test. Attempt to use the old credential and confirm failure. This is not ceremony: for several major cloud and SaaS providers, a deleted key remains usable for a propagation window, and cached sessions issued under it can outlive it entirely.",
          "20-30 min — Invalidate derived sessions. This is the step everyone forgets. A revoked API key does not kill the OAuth tokens it minted, the session cookies it issued, or the cloud role sessions it assumed. CircleCI's January 2023 incident turned on exactly this class of problem: stolen session material let an actor impersonate an engineer through a 2FA-backed single sign-on, and the encryption at rest on the stolen data was defeated by extracting keys from running processes.",
          "30-45 min — Begin the use hunt in parallel with, not after, rotation. Pull every authentication and API event for that credential from first-possible-exposure to revocation. First possible exposure is the commit date or the log write, not the discovery date.",
          "45-60 min — Determine exposure duration and audience. A key in a public repository for eleven months has a different response than a key in a private CI log for two hours. Public exposure of any duration should be assumed compromised: automated scrapers reach public commits within minutes, and cloned copies persist after you force-push.",
          "Hour 1 onwards — Assign three parallel tracks with three owners: proof of death, use hunt, and source analysis. Sequential handling of these is how a two-hour incident becomes a two-week one."
        ]
      },
      {
        kind: "table",
        title: "Proof of death, by secret type",
        headers: ["Secret type", "Revocation is not complete until", "The trap"],
        rows: [
          [
            "Cloud access key (long-lived)",
            "The key is deleted, not just deactivated, and any role sessions assumed with it have expired or been explicitly revoked by policy",
            "Temporary session credentials minted before revocation remain valid for their full lifetime — up to twelve hours by default in some configurations"
          ],
          [
            "OAuth application secret or refresh token",
            "The application's grants are revoked per user, not just the client secret rotated",
            "Rotating the client secret does not invalidate refresh tokens already issued; the adversary keeps working"
          ],
          [
            "Personal access token in source control",
            "Token revoked, and every organisation the token could reach has been checked for new webhooks, deploy keys, and collaborator additions",
            "The tj-actions chain in March 2025 started with a leaked personal access token used to push malicious commits into a different project entirely, days before the visible attack"
          ],
          [
            "Database credential",
            "Password changed, all existing connections terminated, and connection pooling layers restarted",
            "A connection pool holds an authenticated session that survives the password change indefinitely"
          ],
          [
            "Signing key (code, JWT, artifact)",
            "Key rotated, and every artifact or token signed by the old key is invalidated or explicitly re-verified",
            "Rotation without revocation of previously issued signatures means anything the adversary signed is still trusted forever"
          ],
          [
            "SSH deploy key or host key",
            "Key removed from authorized_keys across every host, verified by configuration management rather than by memory",
            "One host missed by the sweep is a permanent backdoor, and it will be the host that is not in the inventory"
          ],
          [
            "Webhook signing secret",
            "Secret rotated and the receiving endpoint rejects the old signature",
            "Many implementations accept both old and new during a grace window, which is exactly the window the adversary needs"
          ],
          [
            "Encryption key",
            "Not revocable. The data it protected must be re-encrypted under a new key and the old ciphertext destroyed",
            "Treating an encryption key like a credential is the error; there is no revoke, only re-key and destroy"
          ]
        ]
      },
      {
        kind: "code",
        title: "The use hunt — the query that turns a leak into an intrusion, or clears it",
        lang: "sql",
        body:
          "-- Baseline the credential's normal behaviour, then find everything outside it.\n-- Run this from first_possible_exposure, NOT from discovery.\n\nWITH baseline AS (\n  SELECT DISTINCT source_ip_asn, user_agent, api_operation, aws_region\n  FROM cloudtrail\n  WHERE principal_id = :leaked_key_id\n    AND event_time BETWEEN :exposure_start - INTERVAL '90 days'\n                       AND :exposure_start\n),\nwindow_events AS (\n  SELECT *\n  FROM cloudtrail\n  WHERE principal_id = :leaked_key_id\n    AND event_time BETWEEN :exposure_start AND :revocation_time\n)\nSELECT\n  w.event_time,\n  w.api_operation,\n  w.source_ip,\n  w.source_ip_asn,\n  w.user_agent,\n  w.aws_region,\n  w.request_parameters,\n  w.error_code\nFROM window_events w\nLEFT JOIN baseline b\n  ON  b.source_ip_asn = w.source_ip_asn\n  AND b.user_agent    = w.user_agent\n  AND b.api_operation = w.api_operation\n  AND b.aws_region    = w.aws_region\nWHERE b.source_ip_asn IS NULL\nORDER BY w.event_time;\n\n-- Then, regardless of what the above returns, check these explicitly.\n-- An adversary who used the credential well will look normal in the join above\n-- and abnormal in exactly one of these:\n--   any Get/List/Describe on IAM, KMS, Secrets Manager, or Parameter Store\n--   any Create/Attach on users, roles, policies, or access keys\n--   any change to logging: StopLogging, DeleteTrail, PutBucketLogging\n--   any snapshot, export, or replication configuration change\n--   any first-ever use of a region you do not operate in\n--   any AccessDenied clusters, which map the adversary's enumeration attempts"
      },
      {
        kind: "callout",
        title: "The four mistakes that turn a leak into a breach",
        body:
          "Force-pushing to remove the commit and calling it done. The object remains reachable in the repository, in every clone and fork, and in the provider's cache; more importantly, the credential was scraped before you finished typing the command. Rotating into the same insecure place — a new key committed into the same repository, or written to the same CI variable that was being printed to logs, means you have performed a rotation drill, not a remediation. Scoping the investigation window to the discovery date, which is the most common way an incident is under-scoped: use the commit date, the log write time, or the artifact build time. And declaring it resolved without answering how it got there. The tj-actions/changed-files compromise in March 2025 affected more than 23,000 repositories by dumping CI runner memory into workflow logs, and its origin traced back months to a personal access token exposed through a workflow trigger in an entirely different project. The source question is the one that prevents the next incident."
      },
      {
        kind: "numbered",
        title: "Days one to five — the part that determines whether it recurs",
        items: [
          "Complete the use hunt and write down the confidence statement. Not no evidence of misuse, but: we hold complete API logs for this principal for the full exposure window, we examined every event, and we found no activity outside baseline. If logging did not cover the window, say that instead, plainly, and treat scope as unknown.",
          "Trace the introduction path. Was it committed by a human, injected by a build, printed by a debug statement, embedded in an image layer, or pasted into a ticket? GitGuardian's data found roughly 100,000 valid secrets across 15 million public Docker images including more than 7,000 exposed cloud keys, so image layers are a real and under-checked path.",
          "Check the other places the same secret lives. Secrets propagate: the same value is usually in a CI variable, a local .env, a Kubernetes secret, a Terraform state file, a Confluence page, and a Slack thread. GitGuardian found 38 percent of collaboration-platform incidents rated critical or urgent, a higher proportion than repository leaks.",
          "Close the class, not the instance. Pre-commit and server-side push protection catches the next accidental commit; short-lived, workload-identity-based credentials eliminate the category. If the credential could have been an OIDC-federated short-lived token, the correct remediation is to make it one, and that should be the finding in your review.",
          "Verify secret lifetime is now short enough that leakage is survivable. The engineering target is that no static credential outlives a single deployment. IBM's research cited in the GitGuardian report puts the average identification and remediation time for breaches involving compromised credentials at 292 days; the only defence that survives that number is credentials that expire on their own.",
          "Run the post-incident review with the dual timeline, and put the introduction path in the contributing-factors table under Design, not under Process. A human pasting a secret is not the cause; a system that accepts a pasted secret and runs with it for a year is."
        ]
      },
      {
        kind: "checklist",
        title: "Closure criteria",
        items: [
          "The old credential has been tested and confirmed to fail, from an external network position",
          "Every session, token, or connection derived from the old credential has been enumerated and invalidated",
          "The use hunt covers first-possible-exposure to revocation, and the log coverage over that window is confirmed complete or explicitly stated as incomplete",
          "The introduction path is identified and named in the review",
          "Every other copy of the same secret value has been found and rotated",
          "The replacement credential is short-lived, or there is a dated memo explaining why it cannot be",
          "A detection exists for use of this credential type from outside expected infrastructure, with a triage owner",
          "Push protection or an equivalent preventive control is enabled on the repository or system where it appeared",
          "Notification obligations have been assessed by someone qualified to assess them, and the assessment is written down"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Treat every exposed credential as used until your logs prove otherwise. If your logs cannot prove otherwise, that is the incident."
      }
    ],
    sources: [
      {
        label: "GitGuardian, State of Secrets Sprawl 2025",
        note: "23.77 million new secrets in public GitHub commits in 2024, up 25 percent; 4.61 percent of 69.6 million repositories affected; roughly 70 percent of 2022 leaks still valid; 35 percent of private repositories containing plaintext secrets. The numbers that make the case for push protection funding."
      },
      {
        label: "CircleCI, January 4 2023 security incident report",
        note: "Malware on an engineer's laptop stole session material, defeating 2FA-backed single sign-on; encryption at rest was bypassed by pulling keys from running processes. The canonical case for why session invalidation is a separate step from credential rotation."
      },
      {
        label: "Palo Alto Unit 42 and partner analyses of the tj-actions/changed-files compromise, March 2025",
        note: "More than 23,000 repositories exposed by an action that dumped runner memory into workflow logs; the chain traced back through reviewdog to a personal access token leaked months earlier. Read it as a lesson in scoping the introduction path."
      },
      {
        label: "OWASP Secrets Management Cheat Sheet",
        note: "The preventive side. Its treatment of secret lifetime and of dynamic secrets is the argument you will need when you propose eliminating a credential class rather than rotating it."
      },
      {
        label: "GitHub Docs, secret scanning and push protection; and equivalent controls in GitLab and Bitbucket",
        note: "The concrete preventive control, including the partner programme through which providers automatically revoke leaked tokens. Understand the coverage limits: custom and homegrown token formats are not detected unless you define patterns."
      },
      {
        label: "CISA and NSA, Defending Continuous Integration and Continuous Delivery Environments",
        note: "Joint guidance on CI credential handling. Useful for the day-three step where you argue for workload identity federation instead of stored keys."
      }
    ]
  },

  {
    id: "sg-pqc-migration-field-note",
    title: "Post-Quantum: What You Can Actually Do This Quarter",
    domain: "Cryptography",
    kind: "field-note",
    statement: "The migration you can start today is the inventory. Everything else is waiting with a budget line.",
    summary:
      "A practitioner's note on post-quantum migration that separates the genuinely urgent (confidentiality with long secrecy lifetimes, and cryptographic inventory) from the merely important (signatures, firmware, and everything with a 2030 deadline).",
    minutes: 20,
    mode: "novus",
    blocks: [
      {
        kind: "prose",
        title: "The one asymmetry that decides your sequencing",
        body:
          "Encryption and signatures fail differently under a cryptanalytically relevant quantum computer, and the difference should drive every decision you make. A signature verified today and never verified again is safe forever, because breaking the algorithm in 2034 does not retroactively let anyone forge a signature you already checked. But data encrypted today under a classical key exchange, and captured today, can be decrypted the moment the capability exists. That is harvest-now-decrypt-later, and it makes confidentiality the urgent half and authentication the important half. So the sequencing is: first, find every place where data with a secrecy requirement longer than about a decade crosses a network under classical key exchange, and fix the key exchange. Second, inventory everything else. Third, wait for your vendors, because for most organisations the majority of the work is not yours to do."
      },
      {
        kind: "table",
        title: "The standards, and where each one bites",
        headers: ["Standard", "Algorithm", "Replaces", "Where the migration actually hurts"],
        rows: [
          [
            "FIPS 203 (August 2024)",
            "ML-KEM, derived from CRYSTALS-Kyber",
            "RSA and elliptic-curve key establishment",
            "TLS termination everywhere, VPN concentrators, and any embedded device whose firmware you do not control. Larger key shares break assumptions about handshake packet sizes."
          ],
          [
            "FIPS 204 (August 2024)",
            "ML-DSA, derived from CRYSTALS-Dilithium",
            "RSA and ECDSA signatures",
            "Certificate chain sizes. ML-DSA signatures and public keys are far larger than ECDSA, which stresses protocols with size assumptions, constrained devices, and anything embedding a chain in a fixed field."
          ],
          [
            "FIPS 205 (August 2024)",
            "SLH-DSA, derived from SPHINCS+",
            "Signatures where conservative security assumptions matter more than size",
            "Very large signatures. Right choice for firmware signing roots and long-lived trust anchors, wrong choice for high-volume protocol signatures."
          ],
          [
            "NIST IR 8547, initial public draft (November 2024)",
            "Transition guidance rather than an algorithm",
            "The schedule itself",
            "The draft proposes deprecating 112-bit-security classical algorithms — RSA-2048, ECDSA P-256 and their peers — after 2030, and disallowing them after 2035. Treat those as planning anchors, not as final law, and re-check the final publication."
          ]
        ]
      },
      {
        kind: "numbered",
        title: "The inventory, which is the only work that is definitely yours",
        items: [
          "Start from data, not from code. List every data class with a required secrecy lifetime beyond ten years: health records, source code and design documents, key material itself, legal and M&A material, national-security-adjacent work, biometric templates. Anything on that list travelling over a classical key exchange today is at risk today.",
          "Enumerate the cryptographic endpoints those data classes cross. Load balancers, service mesh, VPN, database connections, message queues, backup transfer, and every third party who terminates TLS on your behalf. Most organisations discover here that they cannot answer what cipher suite is negotiated between two internal services.",
          "Get the negotiated parameters, not the configured ones. Configuration files lie because of defaults, overrides, and middleboxes. Take it from TLS telemetry, packet capture at a boundary, or a scanning pass that records the actual negotiated group.",
          "Separate what you control from what a vendor controls. For a typical enterprise, most of the migration is a procurement question, and the useful artifact is a supplier register with each vendor's published post-quantum roadmap and contractual commitment date.",
          "Record cryptographic agility as a property per system, scored honestly: can this system change algorithm without a code change, with a code change, or only with hardware replacement. That third category is your long-lead budget line and the reason to start now.",
          "Prioritise hybrid key exchange for external-facing and long-lifetime confidential channels. Hybrid constructions such as X25519MLKEM768 combine a classical and a post-quantum exchange so the result is at least as strong as the stronger half — meaning deploying it cannot make you worse off, which is why major browsers and CDNs enabled it ahead of any mandate.",
          "Leave signatures until after the key exchange work, with the exception of long-lived roots. A firmware signing root or a device identity certificate minted today with a fifteen-year life is a decision you cannot revisit, so make that one now with a stateful hash-based or SLH-DSA option."
        ]
      },
      {
        kind: "compare",
        title: "Urgent versus important",
        left: {
          title: "Urgent — harvest-now-decrypt-later applies",
          items: [
            "Key exchange for any channel carrying data with a decade-plus secrecy requirement",
            "VPN and site-to-site tunnels between data centres carrying bulk sensitive traffic",
            "Long-lived roots and trust anchors being minted right now with fifteen-year lifetimes",
            "Key wrapping and escrow schemes, where the wrapped material outlives the wrapping key by design",
            "Anything crossing a network you know is subject to bulk collection"
          ]
        },
        right: {
          title: "Important — but a capability, not a capture, is required",
          items: [
            "TLS certificate signature algorithms for ordinary web traffic, which are verified and discarded",
            "Code signing for software with a short support life",
            "Authentication tokens and session signatures measured in hours",
            "Document signing where a timestamp authority already anchors the claim",
            "Everything whose value expires before any plausible quantum capability arrives"
          ]
        }
      },
      {
        kind: "callout",
        title: "What I would refuse to fund this year",
        body:
          "A rip-and-replace of internal service-to-service TLS. The traffic is ephemeral, the secrecy lifetime is seconds, and the migration cost is enormous — this is the project a vendor will try to sell you, and it inverts the actual risk ordering. Also refuse: any product claiming quantum-safe encryption without naming a FIPS 203, 204, or 205 parameter set; proprietary post-quantum algorithms, which have not survived the analysis that the NIST process applied; and quantum key distribution as a general enterprise control, which several national technical authorities have publicly declined to recommend for that purpose on grounds of cost, authentication requirements, and limited applicability. Spend on inventory and agility instead. Inventory is never wasted, and agility is the control that survives whatever the final timeline turns out to be."
      },
      {
        kind: "list",
        title: "The five sentences that should appear in your board update",
        items: [
          "We have identified the data classes whose confidentiality requirement extends beyond the plausible arrival of quantum capability, and where they travel.",
          "For those channels, we are deploying hybrid key exchange, which is no weaker than what we run today and is already widely deployed on the public internet.",
          "Our cryptographic inventory now covers X percent of production systems, scored for how easily each can change algorithm.",
          "The largest part of our exposure sits with N suppliers; here are their published commitment dates and what our contracts say.",
          "Draft NIST transition guidance points at 2030 for deprecation and 2035 for disallowance of the algorithms we use today; the systems we cannot change without hardware replacement need funding decisions this year, not in 2029."
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Cryptographic agility is the deliverable. The algorithm you migrate to will be replaced too, and the organisations that suffer will be the ones for whom every migration is a first migration."
      }
    ],
    sources: [
      {
        label: "NIST FIPS 203, 204, and 205 (published 13 August 2024)",
        note: "ML-KEM, ML-DSA, and SLH-DSA respectively. Read the parameter set tables — the size differences relative to ECDSA are the engineering constraint that will actually shape your migration."
      },
      {
        label: "NIST IR 8547 (initial public draft, November 2024), Transition to Post-Quantum Cryptography Standards",
        note: "The proposed schedule: deprecation of 112-bit-security classical algorithms after 2030 and disallowance after 2035. It is a draft; cite it as a planning anchor and verify against the final publication before committing budget language."
      },
      {
        label: "NIST National Cybersecurity Center of Excellence, Migration to Post-Quantum Cryptography project (SP 1800-38)",
        note: "The practical discovery and inventory methodology, including tooling approaches for finding cryptography you did not know you had running."
      },
      {
        label: "NSA, Commercial National Security Algorithm Suite 2.0 (CNSA 2.0)",
        note: "If you sell to or operate for national security systems, this sets earlier and harder dates than the civilian guidance. Read the FAQ for the by-algorithm timelines."
      },
      {
        label: "IETF, hybrid key exchange in TLS 1.3 and the X25519MLKEM768 group",
        note: "The specific construction now widely deployed by major browsers and content delivery networks. The security argument for hybrids — no weaker than the stronger component — is what makes this safe to deploy before the dust settles."
      },
      {
        label: "UK NCSC and BSI guidance on quantum key distribution and PQC migration timelines",
        note: "Both national authorities have published position papers declining to recommend QKD as a general enterprise control. Useful when a vendor is in the room."
      }
    ]
  },

  {
    id: "sg-identity-attack-drillbook",
    title: "Identity Attack Drillbook",
    domain: "Identity",
    kind: "drillbook",
    statement: "Every identity incident is a story about a path you left open on purpose and forgot you had.",
    summary:
      "Eight timed decisions against the identity attacks that are actually landing in 2025 and 2026 — token theft, help desk social engineering, consent phishing, service principal abuse — with a full answer key and the second-order effects of each tempting wrong move.",
    minutes: 35,
    mode: "motus",
    blocks: [
      {
        kind: "prose",
        title: "How to run this",
        body:
          "Give each drill two minutes. Write your answer before reading on — reading the answer key first feels like learning and is not. Run it with your identity team and your incident responders in the same room, because roughly half of these have a correct answer that one group knows and the other does not, and the discovery of that gap is worth more than the exercise. Score honestly: three points for the correct move, one point for a defensible alternative, zero for the tempting answer, and minus two for anything that destroys evidence or tips the adversary. Anyone scoring above eighteen out of twenty-four should be leading the identity workstream."
      },
      {
        kind: "numbered",
        title: "The drills",
        items: [
          "Drill 1 — Token theft. Your identity provider shows a successful sign-in for a finance director from an ASN in a country she is not in, twelve minutes after a legitimate sign-in from her office. The sign-in shows MFA satisfied, and the MFA method recorded is the same passkey she always uses. She is on a call and cannot be reached for ten minutes. What do you do in the next two minutes?",
          "Drill 2 — The help desk call. A service desk agent messages you: someone called claiming to be a senior engineer, said they broke their phone, knew their employee number, manager's name, and last four digits of their national identifier, and asked for their MFA to be reset. The agent followed procedure and reset it. That was forty minutes ago. The engineer has production access. What is the first thing you check, and what is the first thing you change?",
          "Drill 3 — The consent grant. Your logs show a user granted an OAuth application called Document Sync Pro delegated permissions including Mail.Read and Files.Read.All. The application is publisher-unverified and was registered in a tenant you do not recognise, six days ago. Eleven users have granted it. What is the correct order of operations?",
          "Drill 4 — The new credential on a service principal. An audit event shows a client secret added to an existing application registration that has application-level Directory.ReadWrite.All. The actor is a legitimate administrator account. The administrator says they did not do it. What does that tell you, and what do you do about the service principal?",
          "Drill 5 — Device code phishing. A user reports receiving a Teams message from a colleague's account asking them to sign in to view a shared document, with a code to enter at a legitimate Microsoft sign-in URL. They entered the code. No credential was typed into any attacker-controlled page and MFA was satisfied on their own device. Are they compromised, and what does your detection need to look for?",
          "Drill 6 — Break-glass. During a suspected identity provider compromise, your incident commander proposes signing in with the emergency break-glass account to make policy changes, because normal admin accounts may be compromised. The break-glass credential is in a safe and two people must open it. What is the risk in this proposal, and what must be true before you agree?",
          "Drill 7 — The federation trust. A monitoring alert shows a new domain added as a federated identity provider in your tenant, configured with a signing certificate you have never seen. It was added eight hours ago by a global administrator account. What has the adversary just obtained, and what is the containment action?",
          "Drill 8 — Legacy protocol. Your conditional access enforces phishing-resistant authentication for all users. Sign-in logs show a successful authentication for a shared mailbox service account using IMAP with a password, from a hosting provider IP. Conditional access shows the policy as not applied. Why, and what does this tell you about the rest of your enforcement?"
        ]
      },
      {
        kind: "table",
        title: "Answer key",
        headers: ["Drill", "The tempting answer", "The correct move", "The second-order effect you must anticipate"],
        rows: [
          [
            "1 — Token theft",
            "Force a password reset and wait for the user to call back",
            "Revoke the refresh tokens and sign-in sessions for that identity immediately, then confirm from the sign-in log whether the session was interactively authenticated or issued from a token. A passkey satisfying MFA on an impossible-travel sign-in usually means the adversary is replaying stolen session material, not authenticating — the MFA claim in the token is inherited, not fresh.",
            "Session revocation is disruptive and will interrupt the user mid-call. Accept it. Also check for authenticator registration and mail forwarding rule creation in the window, because those are what the adversary does in the first ten minutes to survive your revocation."
          ],
          [
            "2 — Help desk call",
            "Coach the agent and update the procedure",
            "First check: every authenticator registration and privileged action on that account since the reset. First change: suspend the account's sessions and re-verify the real engineer in person or by video with an identity document. Then check whether the same caller has contacted other agents — social engineering campaigns are never a single call.",
            "The procedure was followed, which means the procedure is the defect. Any verification built on facts an attacker can buy is not verification. The fix is a control change, not training, and it belongs in the review under Design."
          ],
          [
            "3 — Consent grant",
            "Delete the application registration immediately",
            "Preserve first, then revoke: export the application's identifiers, reply URLs, requested scopes, and the full consent audit trail; then revoke the service principal's grants and disable it; then enumerate what it accessed using the resource-side logs, per user; then notify. Finally, turn off user consent for unverified publishers and require admin consent — the configuration is the actual finding.",
            "Deleting first destroys the audit linkage between the application object and the resource access events, and you will need that linkage to scope which mailboxes were read. You get one chance at this ordering."
          ],
          [
            "4 — Service principal credential",
            "Remove the secret and move on",
            "Treat the administrator account as compromised, because adding a credential to a high-privilege application is a persistence technique specifically chosen to survive the remediation of the user account. Remove the credential, audit every credential and federated identity on every privileged application registration, and revoke sessions for the administrator. Then check what that service principal did after the credential was added.",
            "Service principal activity does not appear in user sign-in logs and is frequently missing from a responder's mental model. If your detection coverage for non-interactive sign-ins is weak, you will clear the user and leave the adversary in place."
          ],
          [
            "5 — Device code",
            "No credential was phished, so no compromise",
            "They are compromised. Device code flow issues a genuine token to whoever holds the device code — the user authenticated legitimately and handed the resulting token to the adversary. Revoke sessions. Detection should alert on device code authentications where the sign-in client application and the resource do not match the user's normal pattern, and you should disable device code flow entirely except for the narrow set of input-constrained devices that need it.",
            "This is the drill that most identity teams get wrong, because every field in the sign-in log looks legitimate. It is legitimate. That is the technique."
          ],
          [
            "6 — Break-glass",
            "Use it, that is what it is for",
            "The risk is that if the identity provider itself is compromised, using the break-glass account exposes your last uncompromised credential to the adversary's control plane. Before agreeing, require: confirmation that the adversary does not have logging visibility, a written list of the exact changes to be made in a single session, a second person observing, and an immediate rotation of the break-glass credential afterwards. If the compromise extends to the directory itself, prefer an out-of-band vendor escalation.",
            "Break-glass accounts are excluded from conditional access by design, which means every compensating control you rely on does not apply to that session. Its use should page, not log."
          ],
          [
            "7 — Federation trust",
            "Remove the federated domain and close the ticket",
            "The adversary has obtained the ability to mint assertions for arbitrary users in your tenant, including administrators, without any credential or MFA. This is a total directory compromise, not a configuration change. Containment: remove the trust, revoke all refresh tokens tenant-wide, rotate every privileged credential, and treat everything the tenant governs as accessed. Then find how a global administrator account was obtained eight hours ago.",
            "Tenant-wide token revocation will sign out every user in the organisation. That is the correct action and you should have pre-agreed authority to take it, in writing, before an incident, or you will spend two hours seeking permission."
          ],
          [
            "8 — Legacy protocol",
            "Add the service account to the policy",
            "The policy shows as not applied because legacy authentication protocols do not participate in modern conditional access evaluation — the request is authenticated before policy can be interposed. Block legacy authentication at the protocol level, then find every other identity still using it. This tells you your enforcement percentage is measuring the wrong denominator: you are enforcing on the traffic that can be enforced upon.",
            "Blocking legacy protocols always breaks something: a multifunction printer, a monitoring integration, a decade-old application. Expect it, stage it, and require each exception to carry an expiry and a compensating network restriction."
          ]
        ]
      },
      {
        kind: "code",
        title: "Worked answer for drill 5 — what the detection has to key on",
        lang: "yaml",
        body:
          "title: Device code authentication outside expected device population\nid: 6b1f5b0e-3a2f-4c9d-9f27-2f9c5a7c1a44\nstatus: experimental\ndescription: >\n  Device code flow issues a legitimate token to whoever supplies the code.\n  Every field in the sign-in record is valid, so the signal is contextual:\n  device code authentications from user agents and clients that are not\n  input-constrained devices.\nlogsource:\n  product: azure\n  service: signinlogs\ndetection:\n  device_code_flow:\n    AuthenticationProtocol: deviceCode\n  expected_device_population:\n    DeviceDetail.OperatingSystem:\n      - Android TV\n      - tvOS\n    AppDisplayName:\n      - <your enrolled conference room client>\n  condition: device_code_flow and not expected_device_population\nfields:\n  - UserPrincipalName\n  - IPAddress\n  - AppDisplayName\n  - ResourceDisplayName\n  - DeviceDetail.OperatingSystem\nfalsepositives:\n  - Engineers using command line tools that fall back to device code on headless hosts\n  - Genuine input-constrained device enrolment, which should be a known, small list\nlevel: high\ntags:\n  - attack.credential-access\n  - attack.t1528\n\n# The durable fix is not this rule. It is disabling device code flow for every\n# identity except the enumerated input-constrained population. Write the rule\n# anyway, because the exception list will grow when you are not looking."
      },
      {
        kind: "callout",
        title: "The pattern underneath all eight",
        body:
          "Six of these eight drills describe an adversary using a legitimate mechanism exactly as designed. No malware, no exploit, no anomalous binary — a valid token, a valid consent, a valid credential addition, a valid federation trust. This is why endpoint-centric detection strategies fail against identity attacks, and why the correct instinct in an identity incident is to ask what was granted rather than what was run. Mandiant's M-Trends 2026 makes the same point from the data side: voice phishing rose to the second most common initial infection vector, adversaries harvest OAuth tokens and session cookies rather than passwords, and compromise increasingly moves through third-party SaaS relationships rather than through your perimeter."
      },
      {
        kind: "checklist",
        title: "What this drillbook should change in your environment by Friday",
        items: [
          "You can revoke refresh tokens for one identity, and tenant-wide, and you have tested both",
          "Authenticator registration and authentication-method removal each generate an alert with a named triage owner",
          "User consent to applications from unverified publishers is disabled, and admin consent has a workflow with a security review",
          "Credential and federated-identity additions on privileged application registrations are alerted, not merely logged",
          "Device code flow is disabled except for an enumerated device population",
          "Federation and domain trust changes page the on-call immediately, at any hour",
          "Help desk credential reset for privileged accounts requires a second approver through an authenticated channel",
          "Break-glass use pages, and authority to revoke tenant-wide sessions is pre-agreed in writing with a named executive"
        ]
      }
    ],
    sources: [
      {
        label: "Mandiant M-Trends 2026",
        note: "Voice phishing at 11 percent of initial infection vectors, second overall; OAuth token and session cookie harvesting; third-party SaaS compromise as a pivot to downstream customers. The data behind drills 1, 2, and 4."
      },
      {
        label: "MITRE ATT&CK, T1078.004 Cloud Accounts, T1528 Steal Application Access Token, T1550.001 Application Access Token, T1556.007 Hybrid Identity",
        note: "The technique pages now carry Detection Strategies and named analytics — for example DET0546 on abused cloud accounts, with analytics covering impossible-geolocation sign-ins and out-of-scope API calls. Use them as the specification for the detections in the closing checklist."
      },
      {
        label: "CISA, Scattered Spider joint advisory (AA23-320A) and subsequent updates",
        note: "Help desk social engineering, SIM swapping, MFA fatigue, and AiTM phishing kits, documented against organisations that had already deployed MFA. Drill 2 is taken directly from this pattern."
      },
      {
        label: "Microsoft Threat Intelligence reporting on adversary-in-the-middle phishing and token replay",
        note: "The mechanics of how a session cookie stolen through an AiTM proxy produces a sign-in record showing MFA satisfied. Necessary reading before you argue drill 1 with an analyst who trusts the MFA field."
      },
      {
        label: "Microsoft, Storm-0558 and Midnight Blizzard incident write-ups; CISA CSRB report on Storm-0558",
        note: "Federation and signing-key abuse at scale, which is drill 7 in its real form. The CSRB report is the more useful of the two for a security leader, because it is about organisational decisions rather than technique."
      },
      {
        label: "NIST SP 800-63B-4, Sections 3.2.5 and 3.1.1.2",
        note: "The definition of phishing resistance and the prohibition on knowledge-based authentication. Drill 2 exists because the latter is still widely ignored at the service desk."
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  /* DETECTION ENGINEERING                                             */
  /* ---------------------------------------------------------------- */
  {
    id: "sg-detection-as-code-playbook",
    title: "Detection as Code, End to End",
    domain: "Detection Engineering",
    kind: "playbook",
    statement: "A detection you cannot test is a belief. A detection you cannot roll back is a liability.",
    summary:
      "The full pipeline from hypothesis to production rule: the documentation contract, the four test types, the CI gates, the deployment and rollback mechanics, and the metrics that measure whether the detection function is actually working rather than merely busy.",
    minutes: 42,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "What detection as code actually changes",
        body:
          "The phrase gets used to mean rules in a git repository, which is the least interesting part. What it actually changes is that a detection acquires the properties of software: it has an owner, a test suite, a review, a version, a deployment record, and a rollback path. That matters because detection content decays faster than application code — the environment it observes changes underneath it continuously, and unlike application code, a broken detection produces silence rather than an error. Silence is indistinguishable from safety, which is why detection quality problems can persist for years. The pipeline exists to convert silence into a testable claim. Everything below serves that single purpose."
      },
      {
        kind: "numbered",
        title: "The pipeline",
        items: [
          "Hypothesis. A named adversary behaviour, mapped to a technique, with a stated reason this organisation cares. Not detect T1059 — but: an adversary with initial access on a developer workstation executes a script that reads our cloud credential file, and we would currently not see it. The hypothesis names the gap, which is what makes the rule falsifiable later.",
          "Data validation, before writing a line of logic. Confirm the required log source exists, is onboarded, is parsed correctly, has the fields you need populated rather than merely present, and has acceptable latency and completeness. Roughly a third of detection engineering failures are data failures discovered after the rule was written, which is the most expensive possible time to discover them.",
          "Document before you implement. Use the ADS structure: goal, categorisation, strategy abstract, technical context, blind spots and assumptions, false positives, validation, priority, and response. The blind spots section is the one that makes the difference between a detection function and a rule collection, because it is where the engineer states in advance what this rule will never catch.",
          "Implement in a portable form. Sigma for log-based analytics gives you a vendor-neutral source of truth that survives a SIEM migration — which you will have, roughly every four years. Accept platform-native rules where Sigma cannot express the logic, but track them as technical debt with a reason.",
          "Test in four ways before merge. Unit tests against synthetic true positives, regression tests against captured benign data, historical replay against thirty to ninety days of production logs to estimate volume, and adversary emulation to prove the rule fires on the real behaviour rather than on your idea of it.",
          "Review as code, by a second detection engineer, with the ADS document in the diff. The review question is not is this rule correct but what would an adversary do to avoid it, and would we still see them. Every review that does not ask that question is a spelling check.",
          "Deploy through the same pipeline as everything else, with an environment progression and a canary period in alert-only mode. Record the deployed version, the deployer, and the timestamp, so that when an incident review asks was this rule live in March you can answer from data.",
          "Tune with a change record, not by silent edit. Every exclusion added to a rule is a small, permanent reduction in coverage. Exclusions carry an author, a reason, and a review date, or you will wake up in three years with a rule that excludes the entire estate.",
          "Retire deliberately. A rule that has not fired in a year is either excellent or dead, and the difference is testable. Run the emulation again. If it does not fire, the rule is broken, not quiet."
        ]
      },
      {
        kind: "code",
        title: "The unit of work — rule, tests, and documentation in one directory",
        lang: "yaml",
        body:
          "# detections/cloud/credential-file-access-from-shell/rule.yml\ntitle: Cloud credential file read by a shell or scripting process\nid: 9c2a7f31-84b1-4a63-b0d1-6f39ad2c1e07\nstatus: test\ndescription: >\n  Detects reads of cloud credential material by interpreter or shell processes\n  on developer endpoints. Written against the hypothesis that an adversary with\n  code execution on a developer workstation will harvest long-lived cloud keys\n  before attempting anything noisier.\nreferences:\n  - internal ADS: detections/cloud/credential-file-access-from-shell/ads.md\nauthor: detection-engineering\ndate: 2026/07/14\nmodified: 2026/08/02\nlogsource:\n  category: file_access\n  product: linux\ndetection:\n  target_files:\n    TargetFilename|endswith:\n      - /.aws/credentials\n      - /.config/gcloud/credentials.db\n      - /.kube/config\n      - /.docker/config.json\n  interpreter_parents:\n    Image|endswith:\n      - /bash\n      - /sh\n      - /zsh\n      - /python3\n      - /node\n      - /curl\n  known_good:\n    ParentImage|startswith:\n      - /opt/corp-provisioning/\n  condition: target_files and interpreter_parents and not known_good\nfields:\n  - Image\n  - ParentImage\n  - TargetFilename\n  - User\n  - CommandLine\nfalsepositives:\n  - Developer tooling that reads credentials during local test runs\n  - Backup agents, which should be excluded by path, not by process name\nlevel: high\ntags:\n  - attack.credential-access\n  - attack.t1552.001\n\n# Sibling files in the same directory, all required by CI:\n#   ads.md              the nine-section strategy document\n#   tests/true_positive_*.jsonl    synthetic events that MUST match\n#   tests/benign_*.jsonl           captured events that MUST NOT match\n#   emulation.yml       the atomic test or emulation plan that proves it fires\n#   OWNERS              a human, not a team alias"
      },
      {
        kind: "table",
        title: "The four tests, and what each one alone would let through",
        headers: ["Test", "What it proves", "What it misses if run alone", "Gate"],
        rows: [
          [
            "Unit — synthetic true positives",
            "The logic matches the event shape you intended",
            "Everything about whether that event shape occurs in reality; a rule can pass unit tests forever against a field your parser never populates",
            "Blocks merge"
          ],
          [
            "Regression — captured benign data",
            "The rule does not match known-good activity you have already seen",
            "Novel benign activity; your benign corpus is a sample of the past, and the environment moves",
            "Blocks merge"
          ],
          [
            "Historical replay — 30 to 90 days of production logs",
            "The realistic alert volume, and therefore whether a human can triage it",
            "Behaviour that did not occur in the window; a zero-volume result is ambiguous and must be resolved by emulation",
            "Blocks deploy above a volume threshold"
          ],
          [
            "Emulation — atomic tests or a red team action",
            "The rule fires on the actual technique, executed for real, with real telemetry",
            "Variants; passing one atomic test proves one implementation is caught, not the behaviour",
            "Blocks promotion from alert-only to paging"
          ]
        ]
      },
      {
        kind: "compare",
        title: "Two ways the same rule reaches production",
        left: {
          title: "Shipped as code",
          items: [
            "Hypothesis and blind spots written before the logic",
            "Reviewed by a second engineer who asks how an adversary evades it",
            "Volume known before deployment, from replay against real logs",
            "Fires proven against emulated execution, not assumed",
            "Version, deployer, and timestamp recorded; rollback is a revert",
            "Exclusions carry an author, a reason, and a review date",
            "A migration to a new SIEM is a translation job, not a rewrite"
          ]
        },
        right: {
          title: "Shipped by ticket",
          items: [
            "Written in the SIEM console during an incident, at 2 a.m.",
            "Reviewed by whoever had console access",
            "Volume discovered by the analyst who receives four thousand alerts on Monday",
            "Assumed to work because the logic looks right",
            "No record of when it changed or who changed it",
            "Exclusions accumulate anonymously until the rule matches nothing",
            "A SIEM migration is a two-year project that loses half the content"
          ]
        }
      },
      {
        kind: "callout",
        title: "The metric trap that has hollowed out more SOCs than any adversary",
        body:
          "Alert volume, alerts closed, and mean time to triage are workload metrics wearing a quality costume. Optimising them rewards deleting detections and closing tickets fast, and both of those look excellent on a dashboard right up until an incident review shows the signal existed and was suppressed. Measure instead: true positive rate per rule, coverage of techniques with validated detections, the proportion of incidents discovered by your own detections rather than by a third party, and the time from technique publication to a tested detection. Mandiant's M-Trends 2026 reports 52 percent of intrusions detected internally — if your own internal detection rate is materially below that, you have a measurable problem no volume metric will surface."
      },
      {
        kind: "checklist",
        title: "Definition of done for a detection",
        items: [
          "The ADS document names the blind spots and the assumptions, and both are specific enough to be wrong",
          "The required log source is confirmed present, parsed, complete, and within latency tolerance in every environment where the rule deploys",
          "Unit and regression tests exist and run in CI on every change to the rule",
          "Historical replay volume is recorded in the pull request, with the number of expected alerts per week",
          "Emulation evidence is attached, showing the rule firing on real execution of the technique",
          "A named human, not a team, owns the rule and receives its alerts",
          "The response section tells the analyst what to do, including what would make this a false positive",
          "The rule is mapped to a technique and appears in the coverage map with its validation status",
          "A rollback is a single revert and a redeploy, tested at least once"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Write down what the rule cannot see, on the day you write the rule. That paragraph is worth more than the logic, because the logic will be rewritten and the blind spot will not."
      }
    ],
    sources: [
      {
        label: "Palantir, Alerting and Detection Strategy (ADS) Framework",
        note: "Nine required sections: goal, categorisation, strategy abstract, technical context, blind spots and assumptions, false positives, validation, priority, response. The most useful single artifact in detection engineering, and it is free."
      },
      {
        label: "SigmaHQ, Sigma rule specification and sigma-cli",
        note: "The portable rule format: logsource, detection with selections and a condition, level, and tags. Learn the correlation rule extensions if you are building anything beyond single-event matching."
      },
      {
        label: "MITRE ATT&CK v19 Detection Strategies and Analytics",
        note: "Enterprise ATT&CK now ships 697 Detection Strategies and 1,758 Analytics against 106 data components. This replaced free-text detection guidance with structured content you can diff against your own coverage."
      },
      {
        label: "Red Canary, Atomic Red Team",
        note: "The emulation library that makes the fourth test practical. Map each detection to the atomic tests that should trigger it, and run them on a schedule, not once."
      },
      {
        label: "Mandiant M-Trends 2026",
        note: "52 percent of intrusions detected internally, up from 43 percent; global median dwell time of 14 days. The external benchmark for the only detection metric that matters."
      },
      {
        label: "Florian Roth, writings on detection rule quality and the Sigma rule design principles",
        note: "Practical guidance on generic versus specific rules, and why a small number of well-tuned high-fidelity rules beats a large library. The counterweight to coverage-count enthusiasm."
      },
      {
        label: "Google Cloud Security, detection engineering and autonomic security operations material",
        note: "The CI/CD-for-detections pattern with concrete pipeline stages. Read for the mechanics of environment progression and canary deployment of rules."
      }
    ]
  },

  {
    id: "sg-attack-coverage-model",
    title: "What Coverage Actually Means",
    domain: "Detection Engineering",
    kind: "model",
    statement: "Coverage is a claim about data, logic, and validation together. Two out of three is a coloured square that lies.",
    summary:
      "A five-level scoring rubric for ATT&CK coverage that cannot be gamed by counting rules, the reason technique counts are the wrong denominator, and how to produce a coverage map an executive can act on without being misled.",
    minutes: 30,
    mode: "novus",
    blocks: [
      {
        kind: "prose",
        title: "The problem with every coverage heat map you have seen",
        body:
          "Someone exports the ATT&CK matrix, colours a square green if a rule exists with that technique in its tags, and presents a percentage to a steering committee. The number is fiction, for three separate reasons. First, a rule that references a technique may detect one narrow implementation of it — a rule for a specific credential dumping tool is not coverage of credential dumping. Second, the rule may reference a log source that is not onboarded in half your environments, in which case the coverage exists on paper and nowhere else. Third, the rule has probably never been tested against real execution, so nobody knows whether it fires. Coverage is the conjunction of three claims — we collect the data, we have logic over it, and we have proven the logic fires — and a map that scores only the middle claim is worse than no map, because it produces confident wrong decisions."
      },
      {
        kind: "table",
        title: "The scoring rubric — score every technique you claim, on this scale only",
        headers: ["Level", "Name", "Requirement", "What it entitles you to say"],
        rows: [
          [
            "0",
            "None",
            "No relevant telemetry collected",
            "We would not see this. Say it plainly; this is the most valuable score on the scale."
          ],
          [
            "1",
            "Telemetry",
            "The data component exists, is onboarded in all relevant environments, parsed, and retained long enough to matter",
            "We could hunt for this retrospectively. We would not be alerted."
          ],
          [
            "2",
            "Logic",
            "A rule exists over that telemetry, in production, with an owner",
            "We would probably be alerted, if the rule matches the variant used and the data is present where the activity occurs."
          ],
          [
            "3",
            "Validated",
            "Emulation evidence within the last 90 days shows the rule firing on real execution of the technique in the environment it protects",
            "We were alerted when we ran it, in this environment, this quarter."
          ],
          [
            "4",
            "Robust",
            "Validated against at least three meaningfully different implementations, and the rule keys on a behaviour that is hard for the adversary to change rather than on a tool artifact",
            "An adversary would have to change how the technique fundamentally works, not merely which tool they used."
          ]
        ]
      },
      {
        kind: "numbered",
        title: "Building the map so it survives scrutiny",
        items: [
          "Choose the denominator deliberately, and defend it. Enterprise ATT&CK v19 carries 222 techniques and 475 sub-techniques across 15 tactics. Scoring against all of them is meaningless — many are irrelevant to your platforms. Scope to a defensible subset: techniques used by the threat groups your intelligence function names as relevant, plus everything in the tactics where you cannot afford to be blind.",
          "Score data before logic. Walk the ATT&CK data components and mark which are collected, where, with what retention and what latency. This step usually reveals that your coverage ceiling is far lower than your rule count implies, and it is the cheapest possible discovery.",
          "Attach every rule to a technique with an honest scope note. A rule for one credential dumping implementation gets scored against that sub-technique, at level 2, with a note naming the implementation. Do not let it colour the parent technique green.",
          "Validate on a schedule, not once. Emulation evidence expires; ninety days is a reasonable half-life, because parsers change, agents get upgraded, and log sources quietly stop flowing. A level 3 score with no recent evidence silently decays to level 2, then to a lie.",
          "Score the environments separately. Coverage in your primary cloud tenant tells you nothing about the acquired subsidiary, the OT network, or the developer laptops. A single organisation-wide percentage hides exactly the gap an adversary will use.",
          "Publish the level 0 list as prominently as the coverage percentage. The techniques you cannot see are the actionable output of this exercise; the percentage is the part that gets screenshotted.",
          "Recompute after every ATT&CK release. Version 19 split Defense Evasion into Stealth and Defense Impairment, which reshapes any map keyed on tactic. Treat the framework version as a dependency with a version number, because it is one."
        ]
      },
      {
        kind: "code",
        title: "Computing the map from the artifacts rather than from opinion",
        lang: "python",
        body:
          "from collections import defaultdict\nimport datetime as dt\n\nVALIDATION_HALF_LIFE_DAYS = 90\n\ndef score(technique_id, rules, telemetry, emulation_runs, environments):\n    # Level 0/1: does the data exist EVERYWHERE it needs to?\n    required = telemetry.required_components(technique_id)\n    present_everywhere = all(\n        telemetry.is_collected(component, env)\n        for component in required\n        for env in environments\n    )\n    if not present_everywhere:\n        # Partial telemetry is level 0 for the environments that lack it.\n        # Reporting a single blended number here is how coverage maps lie.\n        return 0\n\n    matching_rules = [r for r in rules if technique_id in r.techniques and r.in_production]\n    if not matching_rules:\n        return 1\n\n    recent = [\n        e for e in emulation_runs\n        if e.technique_id == technique_id\n        and e.fired\n        and (dt.date.today() - e.run_date).days <= VALIDATION_HALF_LIFE_DAYS\n        and e.environment in environments\n    ]\n    if not recent:\n        return 2\n\n    distinct_implementations = {e.implementation for e in recent}\n    if len(distinct_implementations) >= 3 and all(r.keys_on_behaviour for r in matching_rules):\n        return 4\n    return 3\n\n\ndef report(scores):\n    buckets = defaultdict(list)\n    for tid, level in scores.items():\n        buckets[level].append(tid)\n\n    # The headline is NOT a percentage. It is these three numbers.\n    print('Blind (level 0):', len(buckets[0]))\n    print('Hunt-only (level 1):', len(buckets[1]))\n    print('Unvalidated logic (level 2):', len(buckets[2]))\n    print('Validated this quarter (3 or 4):', len(buckets[3]) + len(buckets[4]))\n    print()\n    print('Techniques we cannot see at all:')\n    for tid in sorted(buckets[0]):\n        print(' ', tid)"
      },
      {
        kind: "compare",
        title: "Technique coverage versus behaviour coverage",
        left: {
          title: "Counting techniques",
          items: [
            "Denominator is the framework, which was never designed as a checklist",
            "Rewards writing many narrow rules, because each one colours a square",
            "A tool-specific rule scores the same as a behavioural one",
            "Improves when MITRE publishes fewer techniques, which is not a security outcome",
            "Produces a percentage executives will hold you to and adversaries will ignore"
          ]
        },
        right: {
          title: "Counting the adversary's cost",
          items: [
            "Denominator is the set of behaviours an adversary must perform to reach your crown jewels",
            "Rewards detections that key on invariants — the thing the technique cannot avoid doing",
            "A rule that survives the adversary changing tools scores higher than one that does not",
            "Improves only when the adversary's cheapest path gets more expensive",
            "Produces a shorter list, an honest one, and one that maps to funding decisions"
          ]
        }
      },
      {
        kind: "callout",
        title: "The heat map trap, stated so you can quote it in the meeting",
        body:
          "A coverage map is a diagnostic instrument, not a scorecard, and the moment it becomes a target it stops measuring. Once a percentage appears on a leadership dashboard, the fastest way to move it is to tag more existing rules with more techniques, which costs nothing and detects nothing. If you must report a single number, report the count of level 0 techniques and drive it down — that number cannot be improved by tagging, only by collecting data or writing and validating a detection. And never let a coverage map imply that a green square means you will catch a competent adversary. Coverage means we have a proven detection for one or more known implementations. That is genuinely valuable, and it is not the same sentence."
      },
      {
        kind: "metric",
        title: "The four numbers worth reporting",
        items: [
          "Count of level 0 techniques within the defensible scope, per environment — the blind list, driven down quarterly",
          "Percentage of production rules with emulation evidence in the last 90 days — measures whether validation is a practice or a project",
          "Median age of validation evidence — a rising median means your map is decaying while the percentage holds steady",
          "Proportion of detections keyed on behavioural invariants rather than tool artifacts, which is the only number that predicts performance against an adversary who has read your blog"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "The most useful output of a coverage exercise is the list of things you cannot see. Everything else is a restatement of work you already knew you had done."
      }
    ],
    sources: [
      {
        label: "MITRE ATT&CK Enterprise v19 (released 28 April 2026)",
        note: "15 tactics, 222 techniques, 475 sub-techniques, 697 Detection Strategies, 1,758 Analytics, 106 data components, 44 mitigations. Version 19 also split Defense Evasion into Stealth and Defense Impairment, which breaks tactic-keyed maps built on earlier versions."
      },
      {
        label: "MITRE Center for Threat-Informed Defense, Summiting the Pyramid",
        note: "The formal methodology for scoring how robust a detection is against adversary evasion, by analysing whether it keys on ephemeral artifacts or on invariant behaviour. This is where level 4 in the rubric comes from."
      },
      {
        label: "MITRE Center for Threat-Informed Defense, Sensor Mappings to ATT&CK",
        note: "Maps what specific sensors actually observe onto ATT&CK data components. The instrument for scoring levels 0 and 1 honestly instead of by assumption."
      },
      {
        label: "David Bianco, The Pyramid of Pain",
        note: "The original argument that detections keyed on tools and TTPs impose real cost on an adversary while hash and IP indicators do not. Twelve years old and still the sharpest single idea in the discipline."
      },
      {
        label: "MITRE ATT&CK Navigator",
        note: "The visualisation tool. Use it to render the map, never to compute it — a layer file with colours and no scoring rubric behind it is exactly the artifact this guide warns about.",
        url: "https://github.com/mitre-attack/attack-navigator",
        checked: "2026-11-04",
      },
      {
        label: "MITRE Engenuity ATT&CK Evaluations",
        note: "Read the methodology, not the vendor scorecards. The value is in seeing how much detail separates detected from detected with sufficient context to act, which is the same distinction between level 2 and level 3 here."
      }
    ]
  },

  {
    id: "sg-hunt-design-drillbook",
    title: "Hunt Design Drillbook",
    domain: "Threat Hunting",
    kind: "drillbook",
    statement: "A hunt without a falsifiable hypothesis is a query with ambition.",
    summary:
      "Six exercises in converting vague hunting instincts into hypotheses that can fail, with a full answer key, the ABLE test for hypothesis quality, and the structure that turns every hunt into either a detection or a documented negative result.",
    minutes: 35,
    mode: "motus",
    blocks: [
      {
        kind: "prose",
        title: "Why hunts fail, and what these drills fix",
        body:
          "Most hunting programmes fail in the same place: the hypothesis. Look for suspicious PowerShell is not a hypothesis, because no result can contradict it. Without falsifiability, the hunt has no end condition, produces no negative result worth recording, and generates no detection. The PEAK framework separates three hunt types — hypothesis-driven, baseline, and model-assisted — and runs each through Prepare, Execute, and Act, with knowledge feeding every phase. The drills below all live in Prepare, because Prepare is where hunts are won or lost. Two minutes each; write your answer before reading on. The scoring band that matters is whether your hypothesis names an actor behaviour, a specific data source, and an expected observable, and states what result would prove you wrong."
      },
      {
        kind: "numbered",
        title: "The drills",
        items: [
          "Drill 1 — Convert to a hypothesis. Your CTI team reports that a group relevant to your sector uses scheduled tasks for persistence on Windows servers. Your leadership asks you to hunt for it. Write the hypothesis in one sentence, name the data source, name the observable, and state the result that would falsify it.",
          "Drill 2 — Choose the hunt type. You suspect an adversary is exfiltrating data over DNS, but you have no intelligence about a specific tool or encoding. You have ninety days of DNS query logs with query name, response code, source host, and bytes. Which PEAK hunt type do you run, and what exactly do you compute first?",
          "Drill 3 — Fix the scoping error. An analyst proposes: hunt for lateral movement across the enterprise over the last year. Name three things wrong with this scope and rewrite it into something executable in one week.",
          "Drill 4 — The negative result. You hunt for a technique across ninety days of endpoint telemetry and find nothing. Your manager asks what you found. What do you write down, and what are the three possible explanations for the null result that you must distinguish between before claiming the environment is clean?",
          "Drill 5 — Baseline design. You want to detect anomalous service account behaviour. You have authentication logs with account, source host, destination service, and timestamp. What baseline do you build, over what window, keyed on what — and what is the specific failure mode of the obvious approach?",
          "Drill 6 — From hunt to detection. Your hunt found three hosts where a legitimate remote administration tool was executed by a non-administrator account outside business hours. It was benign in all three cases. What, if anything, do you ship, and what is the argument for and against shipping a detection?"
        ]
      },
      {
        kind: "table",
        title: "Answer key",
        headers: ["Drill", "Weak answer", "Strong answer", "The judgement being tested"],
        rows: [
          [
            "1 — Hypothesis",
            "Hunt for scheduled tasks on servers",
            "If this actor has persistence in our Windows server estate, then within the last 90 days a scheduled task was created by a process other than our configuration management agent, on a host in the server OU, with a task action referencing a binary outside the standard installation paths. Data: Windows event 4698 plus endpoint process telemetry. Falsified if every 4698 in the window maps to the configuration management agent or to a documented installer.",
            "Whether you can name the observable and the falsifier. The falsifier is what converts a query into a hunt, and it is what lets you stop."
          ],
          [
            "2 — Hunt type",
            "Hypothesis-driven, looking for known DNS tunnelling tools",
            "Baseline hunt, because you have no specific intelligence to hypothesise from. Compute per-source-host distributions of: distinct subdomain count per registered domain, mean query name length and entropy, ratio of NXDOMAIN responses, and query volume outside business hours. Then look at the tail. Only after the baseline exists does a hypothesis-driven hunt become possible.",
            "Recognising that the absence of intelligence selects the hunt type. Running a hypothesis hunt without a hypothesis produces a tool-signature search that any competent adversary avoids."
          ],
          [
            "3 — Scoping",
            "Narrow it to six months",
            "Three faults: lateral movement is a tactic containing many techniques, not a thing you can query; enterprise ignores that telemetry coverage differs by environment; and a year exceeds retention on most sources, so the null result would be unfalsifiable. Rewrite: over the last 30 days, in the payments production subnet, identify authentications where a service account authenticated to a host it had not authenticated to in the preceding 60 days, using data from the domain controller security log, which we have confirmed is complete for that period.",
            "Whether you scope to a technique, an environment, and a window your data actually covers. Scope failures are the most common reason hunts produce nothing usable."
          ],
          [
            "4 — Negative result",
            "We hunted and the environment is clean",
            "Write: hypothesis, exact scope, data sources with confirmed coverage and completeness, queries run, result, and the coverage caveat. The three explanations to distinguish: the behaviour did not occur; it occurred but our telemetry does not capture it; it occurred and our query was wrong. Distinguish them by running the emulation — execute the technique in a controlled way and confirm your query finds it. A null result that has not survived an emulation check tells you nothing about the environment, only about the query.",
            "Whether you treat a null result as evidence or as absence of work. A documented, validated negative is a genuine deliverable and is how hunts compound over time."
          ],
          [
            "5 — Baseline",
            "Average logins per service account per day, alert on deviation",
            "Baseline the set of destination services each service account touches, not the count. Build over 60 days, keyed on the account-to-destination pair, and treat a first-ever pair as the signal. The obvious volume-based approach fails because service account volume is dominated by scheduled jobs whose variance swamps any adversary activity, and because an adversary using an existing account to reach a new system generates almost no additional volume. Set membership is the discriminating feature; magnitude is not.",
            "Understanding that anomaly detection on the wrong feature is worse than none, because it consumes the credibility you will need later."
          ],
          [
            "6 — Hunt to detection",
            "Nothing found that was malicious, so ship nothing",
            "Ship three things. One: a detection keyed on the narrow, high-signal condition — that tool executed by an account outside the administrator group — accepting a low volume of benign matches that are genuinely worth a look. Two: a control change, because the finding is really that a remote administration tool is executable by non-administrators, which is a policy gap. Three: the documented negative with its scope. The argument against shipping is alert fatigue, and it is answered by the historical replay volume, which you already have from the hunt itself. That is the underrated advantage of hunting: you know the alert volume before you deploy.",
            "Whether you extract control findings from hunts, not just detections. The best hunts produce a configuration change that removes the behaviour rather than a rule that watches it."
          ]
        ]
      },
      {
        kind: "code",
        title: "Worked answer for drill 5 — the baseline that works",
        lang: "sql",
        body:
          "-- Set membership, not magnitude. First-ever account-to-service pairs.\nWITH history AS (\n  SELECT DISTINCT account_name, destination_service, destination_host\n  FROM authentication_events\n  WHERE event_time BETWEEN CURRENT_DATE - INTERVAL '67 days'\n                       AND CURRENT_DATE - INTERVAL '7 days'\n    AND account_type = 'service'\n),\nrecent AS (\n  SELECT account_name, destination_service, destination_host,\n         MIN(event_time) AS first_seen,\n         COUNT(*)        AS events,\n         COUNT(DISTINCT source_host) AS distinct_sources\n  FROM authentication_events\n  WHERE event_time >= CURRENT_DATE - INTERVAL '7 days'\n    AND account_type = 'service'\n  GROUP BY 1, 2, 3\n)\nSELECT r.*\nFROM recent r\nLEFT JOIN history h\n  ON  h.account_name         = r.account_name\n  AND h.destination_service  = r.destination_service\n  AND h.destination_host     = r.destination_host\nWHERE h.account_name IS NULL\nORDER BY r.first_seen;\n\n-- Two refinements that matter in practice.\n-- 1. Exclude accounts whose destination set legitimately grows: build agents,\n--    backup, vulnerability scanners. Exclude them by name, in a list with an\n--    owner, not by a pattern that will silently widen.\n-- 2. A 60-day history with a 7-day gap before the detection window prevents\n--    the adversary's own early activity from being absorbed into the baseline,\n--    which is the classic self-poisoning failure of behavioural baselines."
      },
      {
        kind: "callout",
        title: "The ABLE test — apply to every hypothesis before you write a query",
        body:
          "A good hunt hypothesis names an Actor behaviour, a Location in the environment, and Evidence you expect to find, and it must be falsifiable. Actor behaviour, not tool: the tool changes, the behaviour is what the adversary needs. Location: which environment, which subnet, which platform — because your telemetry coverage differs across them and a hypothesis that ignores that will produce an uninterpretable result. Evidence: the specific field in the specific log that would carry the observation. If you cannot fill all three, you are not ready to hunt; you are ready to do the data engineering that makes hunting possible, which is the more valuable work anyway."
      },
      {
        kind: "checklist",
        title: "Hunt closure — nothing is finished until all of these are true",
        items: [
          "The hypothesis is written down in its original form, including the falsifier, unedited by the outcome",
          "Data source coverage and completeness for the hunt window are stated, with any gaps named",
          "Queries are saved in version control, not in an analyst's console history",
          "The result is recorded as confirmed, refuted, or inconclusive — and inconclusive is a legitimate outcome that names the missing data",
          "An emulation was run to confirm the query would have found the behaviour if it were present",
          "Every finding produced either a detection, a control change, or a documented risk acceptance",
          "The alert volume for any resulting detection was measured during the hunt, not estimated afterwards",
          "The hunt is repeatable by someone else from the written record alone"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Hunt to be proven wrong. A hunt designed so that it cannot fail will succeed at nothing, and will do so on a schedule."
      }
    ],
    sources: [
      {
        label: "Splunk, the PEAK Threat Hunting Framework (David Bianco and colleagues)",
        note: "Three hunt types — hypothesis-driven, baseline, and model-assisted — running through Prepare, Execute, and Act, with knowledge feeding every phase. The most usable modern hunting framework, and free."
      },
      {
        label: "David Bianco, The Pyramid of Pain",
        note: "Why hunting for tool artifacts produces short-lived wins and hunting for behaviours produces durable ones. Read it before designing any hypothesis."
      },
      {
        label: "Sqrrl, A Framework for Cyber Threat Hunting and the Hunting Maturity Model",
        note: "The original maturity model, HMM0 to HMM4. Still the clearest way to explain to a leadership team why buying a hunting tool before you have data coverage achieves nothing."
      },
      {
        label: "MITRE ATT&CK Enterprise v19 and its Detection Strategies",
        note: "The technique library that supplies hunt topics, and now structured analytics you can use as a starting hypothesis rather than writing from scratch."
      },
      {
        label: "TaHiTI (Targeted Hunting integrating Threat Intelligence) methodology, Dutch financial sector",
        note: "The intelligence-to-hunt handoff, formalised. Useful if your hunts are supposed to be driven by CTI and currently are not."
      },
      {
        label: "Mandiant M-Trends 2026",
        note: "Median dwell time of 14 days overall, but 122 days for cyber espionage and North Korean IT worker cases, and roughly 400 days in the BRICKSTORM backdoor cases. These numbers set your hunt lookback window; a 30-day hunt cannot find a 122-day intrusion."
      }
    ]
  },

  {
    id: "sg-logging-decisions-field-note",
    title: "Deciding What to Log",
    domain: "Detection Engineering",
    kind: "field-note",
    statement: "Every log line is a subscription, not a purchase.",
    summary:
      "A narrow field note on the single decision that quietly determines your detection ceiling: which sources to collect, at what fidelity, for how long — and the retention argument that survives a finance review.",
    minutes: 14,
    mode: "novus",
    blocks: [
      {
        kind: "prose",
        title: "The decision nobody makes deliberately",
        body:
          "Logging decisions are usually made by accident: a source is onboarded because a vendor made it easy, retention is set to whatever the default was, and three years later an incident asks a question the data cannot answer. The decision is a subscription because you pay for it every day, forever, at a price that grows with the business. That is why it deserves a deliberate framework rather than a default. The frame I use is four questions per source: what decision does this let me make, what would I lose if it were gone, how long does that decision need to be answerable, and what does one day of it cost. A source that fails the first question is not security telemetry; it is a bill."
      },
      {
        kind: "table",
        title: "The tiering decision, applied to real sources",
        headers: ["Source", "Detection value", "Investigation value", "Recommended posture"],
        rows: [
          [
            "Identity provider sign-in and audit logs",
            "Very high — most modern intrusions start and pivot here",
            "Very high, and irreplaceable; there is no other record of a consent grant or a federation change",
            "Hot and searchable for 90 days, retained 13 months minimum. This is the source to overspend on."
          ],
          [
            "Endpoint process execution and command line",
            "Very high",
            "Very high, but volume scales with fleet size",
            "Hot 30 days, warm 90, cold 12 months. Command line arguments are non-negotiable; process names without arguments are close to useless."
          ],
          [
            "Cloud control plane audit (management API)",
            "High",
            "Very high, and it is the only record of what an adversary with cloud credentials did",
            "Hot 90 days, retained 13 months minimum, in an account the production identity cannot delete from."
          ],
          [
            "DNS query logs",
            "Moderate on its own, high in combination",
            "High — resolves what a host was doing when nothing else was recorded",
            "Hot 30 days, cold 6 to 12 months. Sample only if you must, and never sample NXDOMAIN responses."
          ],
          [
            "Network flow records",
            "Low to moderate",
            "High for scoping exfiltration volume and lateral movement paths",
            "Cold storage, queryable slowly, 12 months. Rarely worth hot ingestion cost."
          ],
          [
            "Full packet capture",
            "Low",
            "Very high, for a very short window, in a few places",
            "Days, at chokepoints only. This is a scoping instrument, not a detection source."
          ],
          [
            "Application and web server access logs",
            "Low unless the application is the target",
            "Moderate to high, if they carry a user identity and a request identifier",
            "Hot 14 to 30 days. Their value is entirely determined by whether an identity field is populated."
          ],
          [
            "Secrets manager and key management audit logs",
            "High and under-collected",
            "Very high — this is how you answer what did the adversary decrypt",
            "Hot 90 days, retained 13 months. Almost always available, almost never onboarded."
          ],
          [
            "Backup and virtualisation management plane",
            "High, and consistently missed",
            "Very high; ransomware operators target these directly",
            "Hot 90 days. M-Trends 2026 specifically names backup infrastructure, identity services, and virtualisation management planes as ransomware targets."
          ],
          [
            "Debug and verbose application logs",
            "None",
            "Occasionally useful, frequently a source of leaked secrets",
            "Do not centralise. They cost the most and answer the least, and they are where credentials end up in plaintext."
          ]
        ]
      },
      {
        kind: "list",
        title: "Field decisions that matter more than source decisions",
        items: [
          "An event without an identity field is half an event. If you can spend engineering effort on one thing, spend it on populating a consistent actor identity across sources rather than on adding a new source.",
          "Command line arguments, parent process, and process hash. Losing arguments to save volume is the most expensive false economy in detection engineering; almost every meaningful endpoint detection reads them.",
          "Source and destination together. Logs that record one side of a connection cannot answer lateral movement questions, no matter how long you keep them.",
          "Timestamps in UTC with sub-second precision and a recorded ingestion time as well as an event time. Reconstructing a timeline across sources with second-granularity local timestamps is a specific and avoidable form of misery.",
          "Do not drop the failures. AccessDenied clusters, authentication failures, and NXDOMAIN responses map an adversary's enumeration, and they are the first thing volume-reduction projects delete.",
          "Beware high-cardinality fields that are not identity: request identifiers, trace identifiers, and container identifiers inflate index cost dramatically while rarely appearing in a detection. Store them, do not index them."
        ]
      },
      {
        kind: "compare",
        title: "Two retention arguments, one of which survives a finance review",
        left: {
          title: "The argument that loses",
          items: [
            "We need longer retention for security reasons",
            "Compliance requires twelve months",
            "More data is better",
            "Priced as a single line item with no alternative offered",
            "Defends every source equally, so the reviewer cuts uniformly"
          ]
        },
        right: {
          title: "The argument that wins",
          items: [
            "Median dwell time is 14 days globally, but 122 days for espionage and North Korean IT worker cases, and roughly 400 days in the BRICKSTORM intrusions",
            "A 90-day retention window means that for the intrusion class we are most worried about, the evidence of initial access will already be gone when we detect it",
            "Here is the tiering: 90 days searchable for four sources, 13 months in object storage at a twentieth of the cost for the same four, everything else 30 days",
            "Here is what we are proposing to stop collecting to pay for it",
            "Here is the specific question we would be unable to answer if you decline, written as a sentence a regulator might ask"
          ]
        }
      },
      {
        kind: "callout",
        title: "The trap in the middle tier",
        body:
          "Most organisations get the extremes right and the middle wrong. They keep endpoint telemetry hot because the EDR vendor includes it, and they keep almost nothing in cold storage because it requires an integration nobody owns. The result is a retention cliff at 30 days. The fix is unglamorous and cheap: write every high-value source to object storage in a compressed columnar format, in an account the production identity cannot delete from, with a schema registered somewhere. It costs a fraction of hot ingestion, it will be slow to query, and it will be the difference between scoping an incident and guessing at it. Do this before you buy anything with the word analytics in the product name. And put it in a separate trust domain: an adversary with production credentials who can delete your logs has removed your ability to answer any question at all, which is why M-Trends 2026 records adversaries deliberately destroying recovery and logging capability."
      },
      {
        kind: "metric",
        title: "Four numbers to keep on the wall",
        items: [
          "Cost per gigabyte per day, hot versus cold, for your top five sources — most teams cannot state this, and it is the number every conversation depends on",
          "Percentage of onboarded sources with a detection or a documented investigation use — sources failing this test are the budget for the ones that pass",
          "Ingestion latency per source, at the 95th percentile — a source arriving 40 minutes late cannot support a real-time detection regardless of its content",
          "Coverage completeness: proportion of expected hosts or accounts actually reporting in the last 24 hours. Silent agents are the most common cause of a detection that everyone believed was working"
        ]
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "Collect what answers a question you can name. Keep it as long as the intrusion you fear most stays hidden. Everything else is storage with a security label on it."
      }
    ],
    sources: [
      {
        label: "Mandiant M-Trends 2026",
        note: "Global median dwell time of 14 days; 122 days for espionage and North Korean IT worker cases; roughly 400 days for BRICKSTORM; explicit targeting of backup infrastructure, identity services, and virtualisation management planes. This is the retention argument."
      },
      {
        label: "OWASP Top 10:2025, A09 Security Logging and Alerting Failures",
        note: "The 2025 revision renamed the category from monitoring to alerting, which is the correct emphasis: collected-and-unalerted is the dominant failure mode, not uncollected."
      },
      {
        label: "MITRE ATT&CK v19 data components (106 in Enterprise)",
        note: "The mapping from log source to what it lets you detect. Use it to answer what decision does this let me make for any source you are considering."
      },
      {
        label: "NIST SP 800-92r1 (draft), Cybersecurity Log Management Planning Guide",
        note: "The formal treatment of log management planning, including the prioritisation approach. Useful when you need an external reference for a decision you have already made on judgement."
      },
      {
        label: "CISA and NSA, Best Practices for Event Logging and Threat Detection (2024 joint guidance)",
        note: "A concrete, current, multi-agency list of which event sources to collect for enterprise, cloud, and operational technology, with a strong section on log integrity and centralisation."
      }
    ]
  },

  {
    id: "sg-detection-reading-path",
    title: "Reading Path: Becoming a Detection Engineer",
    domain: "Detection Engineering",
    kind: "reading",
    statement: "Read in the order that builds judgement, not in the order the material was published.",
    summary:
      "An annotated path through the real detection literature, in five stages, with what each piece gives you, what it will not, and the specific reason it sits where it does in the sequence.",
    minutes: 40,
    mode: "novus",
    blocks: [
      {
        kind: "prose",
        title: "How to use this",
        body:
          "There is no detection engineering textbook, which is why the discipline is learned badly and unevenly. What exists is a scattered set of blog posts, frameworks, and specifications, most of it excellent and none of it sequenced. The order below is the one I would give a strong engineer moving into detection: concepts first, so that tooling makes sense; then the documentation discipline, before writing any rules, so that the rules they write are reviewable; then the frameworks; then the craft; then the systems thinking that separates a rule author from an engineer. Expect this to take a quarter of deliberate part-time reading, with practice between stages. Reading it all in a fortnight produces vocabulary, not judgement."
      },
      {
        kind: "numbered",
        title: "The path",
        items: [
          "Stage 1, concepts (a weekend). David Bianco's Pyramid of Pain, then the ATT&CK Design and Philosophy paper. The first teaches you that indicators have different costs to an adversary, which reframes every detection decision that follows. The second teaches you why ATT&CK is structured as it is, which stops you from treating it as a checklist. Read them in this order; the pyramid makes ATT&CK make sense.",
          "Stage 2, documentation discipline (one evening, then apply it for a month). Palantir's Alerting and Detection Strategy framework. Nine sections, one page of explanation, and the single highest-return artifact in the discipline. Write three ADS documents for detections that already exist in your environment before you write a new rule. You will discover that at least one of the three has a blind spot nobody had articulated.",
          "Stage 3, the frameworks (two weeks). The Sigma specification, then MITRE ATT&CK v19's Detection Strategies and Analytics, then the Center for Threat-Informed Defense's Summiting the Pyramid. Sigma teaches portability. ATT&CK's structured analytics give you a corpus to compare your own content against. Summiting the Pyramid gives you the formal vocabulary for why one detection is more robust than another, which is what you will need in review.",
          "Stage 4, the craft (a month, with practice). Jared Atkinson's On Detection series, which is the deepest published thinking on how a technique decomposes into operations and how detections should key on the invariant rather than the surface. Alongside it, Red Canary's annual Threat Detection Report, which is the closest thing to a field manual for which techniques actually matter by prevalence. Then Florian Roth's writing on rule quality, for the practical judgement about generic versus specific rules.",
          "Stage 5, the systems view (a month). Richard Bejtlich's The Practice of Network Security Monitoring, for the discipline of collection and the argument that detection is a data problem before it is a logic problem. Then Roberts and Brown's Intelligence-Driven Incident Response, for how intelligence and detection actually connect rather than how the vendor diagram claims they do. Then the PEAK hunting framework, which is where detection engineering and hunting meet — hunts are how you generate detections that no rule feed will ever give you.",
          "Continuous, forever. The annual reports: Verizon DBIR for what initiates breaches at population scale, Mandiant M-Trends for what happens after, and Red Canary for technique prevalence. Read all three every year, in that order, in one sitting. The exercise takes an afternoon and recalibrates your entire sense of proportion."
        ]
      },
      {
        kind: "table",
        title: "What each stage gives you, and what it does not",
        headers: ["Stage", "Gives you", "Does not give you", "You are ready to move on when"],
        rows: [
          [
            "1 Concepts",
            "A cost model for adversary evasion, and the structure of the technique taxonomy",
            "Any ability to write a rule",
            "You can explain why a hash-based detection and a behavioural one differ in value, without using the word robust"
          ],
          [
            "2 Documentation",
            "The habit of stating blind spots before logic",
            "Rule-writing skill",
            "You have written three ADS documents and found a blind spot in an existing production detection"
          ],
          [
            "3 Frameworks",
            "Portable rule syntax and a corpus to compare against",
            "Judgement about what to detect in your environment",
            "You can read a Sigma rule and name what an adversary would change to evade it"
          ],
          [
            "4 Craft",
            "The ability to decompose a technique into invariants and key on them",
            "Coverage strategy, or an argument for what to collect",
            "You can write a detection that survives the adversary switching tools"
          ],
          [
            "5 Systems",
            "Collection strategy, intelligence integration, and hunting as a detection source",
            "Experience, which only incidents provide",
            "You are choosing what data to collect rather than working with what arrived"
          ]
        ]
      },
      {
        kind: "list",
        title: "What to skip, and why",
        items: [
          "Vendor detection-engineering whitepapers that do not include a rule you can read. If there is no logic in it, it is a positioning document.",
          "Rule repositories consumed as a reading exercise. Read three rules deeply and emulate against them; do not read three hundred, which teaches pattern-matching on syntax rather than reasoning.",
          "Anything promising to detect the unknown. The interesting problem is detecting the known, robustly, in a specific environment, at a volume a human can triage.",
          "Machine learning for detection, until stage 5. It is a real technique with real applications, and approaching it before you can write and validate a deterministic detection produces an unfalsifiable model nobody can tune.",
          "Certification syllabi as a reading path. They optimise for coverage of terms, which is the opposite of the sequencing this path is built on."
        ]
      },
      {
        kind: "quote",
        body:
          "The higher up the pyramid you go, the more painful it is for the adversary to change what they do — and the more durable your detection becomes.",
        source: "The argument in David Bianco's Pyramid of Pain, paraphrased; read the original first."
      },
      {
        kind: "callout",
        title: "The practice that makes the reading stick",
        body:
          "After each stage, do one thing in your own environment. After stage 1, map five existing detections onto the pyramid and count how many sit at the bottom two levels. After stage 2, write the ADS for the noisiest rule you have and see whether it survives its own false positives section. After stage 3, translate one platform-native rule to Sigma and back. After stage 4, take a detection that keys on a tool name and rewrite it to key on the behaviour, then emulate both against three implementations. After stage 5, pick a technique you cannot see, and write the collection proposal rather than the rule. Reading without this produces someone who can discuss detection engineering. The practice produces someone who can do it."
      },
      {
        kind: "principle",
        title: "Principle",
        body:
          "The literature will teach you the shape of the problem. Only your own environment will teach you which of its parts are true where you work."
      }
    ],
    sources: [
      {
        label: "David Bianco, The Pyramid of Pain (2013, and the PEAK framework work that followed)",
        note: "Stage 1. The single most reused idea in detection. Its value is as a cost model for the adversary, not as a taxonomy of indicators."
      },
      {
        label: "Blake Strom et al., MITRE ATT&CK: Design and Philosophy",
        note: "Stage 1. Explains the abstraction level ATT&CK chose and why. Read it and you will stop treating the matrix as a coverage checklist."
      },
      {
        label: "Palantir, Alerting and Detection Strategy Framework",
        note: "Stage 2. Nine sections: goal, categorisation, strategy abstract, technical context, blind spots and assumptions, false positives, validation, priority, response. Apply it before you read anything else about writing rules."
      },
      {
        label: "SigmaHQ specification, and MITRE ATT&CK v19 Detection Strategies and Analytics",
        note: "Stage 3. Sigma for portability; ATT&CK's 697 detection strategies and 1,758 analytics as a corpus to compare your own content against."
      },
      {
        label: "MITRE Center for Threat-Informed Defense, Summiting the Pyramid",
        note: "Stage 3. The formal method for scoring detection robustness against evasion. This is the vocabulary that makes detection review rigorous instead of aesthetic.",
        url: "https://center-for-threat-informed-defense.github.io/summiting-the-pyramid/",
        checked: "2026-11-04",
      },
      {
        label: "Jared Atkinson, On Detection: Tactical to Functional (series)",
        note: "Stage 4. The deepest published treatment of decomposing a technique into operations and detecting the invariant. Slow reading, high return."
      },
      {
        label: "Red Canary, annual Threat Detection Report",
        note: "Stage 4 and continuous. Technique prevalence from a very large managed detection dataset, with detection guidance per technique. The best available answer to what should I work on first."
      },
      {
        label: "Richard Bejtlich, The Practice of Network Security Monitoring; Roberts and Brown, Intelligence-Driven Incident Response",
        note: "Stage 5. Collection discipline and the intelligence-to-detection loop respectively. Together they turn a rule author into someone who designs a detection capability."
      }
    ]
  },

  /* ---------------------------------------------------------------- */
  /* SYSTEMS                                                           */
  /* ---------------------------------------------------------------- */
  {
    id: "sg-read-the-systems-map",
    title: "How To Read A Systems Map",
    domain: "Systems",
    kind: "model",
    statement: "A map you cannot run is a poster.",
    summary:
      "The notation the World draws for every gauge, the same one systems researchers use on paper: stocks, flows, delays, breakers, sources and loops. How to read it in six moves, where the leverage usually is, the three mistakes that lose the most service, and the booster station worked through as a case.",
    minutes: 12,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "The notation",
        body:
          "Every part of an organisation is a stock: a vessel with a level inside it, which is the share of its function it still delivers. Every dependency is a pipe from the part that provides to the part that needs, with light moving through it for what still arrives, an arrowhead for direction, and bars across it for the delay before a failure upstream reaches the downstream part: one bar for minutes, two for an hour, three for hours. A breaker in your stack is a valve on the pipe; a failure upstream stops there and the part downstream keeps working. Every threat is a cloud on the horizon with a stream of pressure aimed at one part. A ring from your stack holds the stream at the ring; two rings hold it fully; a stream that reaches the part means nothing is in its way. The loops at work are drawn as arcs over the parts they run through, lettered R where a loop feeds itself and B where it pushes back, lit while they run. Everything on the map is computed from the gauge's own data and the same rules the score uses. Nothing is drawn for effect."
      },
      {
        kind: "numbered",
        title: "Reading a gauge in six moves",
        items: [
          "Find the public. Every gauge has one or two parts that serve the people at the edge: customers, residents, members, patients. Service delivered is what reaches them along their pipes. Everything else matters only through them.",
          "Walk the chain backwards. From the public part, follow the pipes upstream. That chain is where the service comes from, and a failure anywhere on it reaches the public after the delays written on the pipes.",
          "Read the clouds against the chain. A heavy cloud aimed at a part on the chain outranks a heavier cloud aimed at a part off it. Weight three on a booster station is the day; weight three on an office network is a bad week.",
          "Cut the chain before you cover the clouds. A breaker on the pipe just above the public keeps the service flowing even when everything upstream falls, and it usually costs one point of budget. The leverage list measures this for you in hours of service kept.",
          "Close the detect loop. With nothing in the stack that can see a landed threat, it pushes for six hours before it burns out. One structure that detects halves that. The loop reads as not running until you do.",
          "Hold two layers where the adversary will look. From Wicked onward each notch is chosen against the stack you last ran, and a threat held by one layer is the one it studies. A second layer there is the cheapest insurance on the map."
        ]
      },
      {
        kind: "prose",
        title: "The three mistakes that lose the most service",
        body:
          "The first is covering the loudest threat instead of the chain to the public. A stack can stop five threats and still lose the day because the one it let through sits on the pipe that feeds the customers. The second is a single layer on a weight three threat. One layer lets a tenth of the pressure through, and a tenth of a weight three threat over a six hour dwell takes half of a part's function. The third is no detection at all. Every landed threat then runs its full dwell, and the recovery that follows starts late. The map shows all three before a run: the chain, the thin rings, and the detect loop sitting dim."
      },
      {
        kind: "prose",
        title: "Worked: the booster station",
        body:
          "Kessler Run Water Authority serves a town of thirty thousand. Its control room commands four booster stations, a vendor's remote access tool stays connected to the control room all day, and one booster controller sits on the internet with the password it shipped with. With nothing in the stack the model loses about twenty hours of water service in a stress day: the controller, the vendor link and the control room fall in the first hours, and the boosters, which depend on the control room, fall after their delay, and the town after theirs. One structure changes the day. Fail safe defaults decide what a booster does when its controller cannot be trusted, so the stations run by hand. On the map it is a valve on every pipe into the booster stations. In the model it keeps seventeen of those twenty hours, for one point of budget. The control room still falls, the operators still have a terrible night, and the organisation is still breached in the score. The water keeps flowing. That is what the operators at Aliquippa did in November 2023 when their screen was defaced, and it is why the gauge is built from their day."
      },
      {
        kind: "prose",
        title: "What the map will not tell you",
        body:
          "The model runs the structure of a system, not the people in it. It knows that a booster station can run by hand because the stack says so; it does not know whether anyone on shift has done it. Game days are in the catalog for that reason. It also measures service and trust separately, because a threat aimed at the public, such as residents hearing about a breach before the authority speaks, costs trust without stopping the water. Read both numbers. A day that keeps the water and loses the trust is a day that gets harder every hour after."
      }
    ],
    sources: [
      { label: "Donella Meadows, Thinking in Systems (2008)", note: "Stocks, flows, delays, feedback loops and the twelve places to intervene in a system." },
      { label: "John Sterman, Business Dynamics (2000)", note: "The stock and flow notation and the behaviour delays produce in managed systems." },
      { label: "Charles Perrow, Normal Accidents (1984)", note: "Tight coupling and interactive complexity, and why slack is a design decision." },
      { label: "CISA, FBI, NSA and EPA advisory AA23-335A (December 2023)", note: "The compromise of internet exposed Unitronics controllers, including the Aliquippa booster station the water gauge is drawn from." }
    ]
  },

  /* MORE */
];
