import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-foundations",
  act: "ACT I — GROUND",
  order: 1,
  title: "Ground",
  subtitle: "Security as a system: mental models, threat modeling, and adversary theory for the people who will be held responsible",
  essence: "cyan",
  thesis: "Security is not a collection of controls. It is a system with stocks, flows, delays, and feedback loops, operated against an intelligent opponent who is also running a system. Whoever models the whole thing more accurately wins, and accuracy is a skill that can be trained.",
  statement: "You do not defend a diagram. You defend a deployment, against an adversary with a budget.",
  why: "Most security programs fail in the same three ways: they optimise a parameter instead of a structure, they measure the wrong loop, and they build a threat model of the architecture they wish they had. Every one of those failures is invisible from inside a control checklist and obvious from inside a systems model. This chapter installs the models. Everything later in the Praxis compiles against them.",
  outcomes: [
    "Draw any security program as stocks, flows, delays, and loops, and identify which of those four is actually killing you",
    "Locate the highest-leverage intervention in a program using Meadows leverage points rather than the loudest recent incident",
    "Size a defense against an adversary using requisite variety instead of vendor category coverage",
    "Run a threat model that survives contact with the deployed artifact, not just the architecture diagram",
    "Choose between STRIDE, attack trees, PASTA, and LINDDUN on the merits of the question being asked",
    "Read an intrusion in ATT&CK terms and place every detection you own on the Pyramid of Pain honestly",
    "Distinguish commodity, criminal, and state adversaries and defend differently against each",
    "State a risk as a calibrated range with a base rate attached, and defend that range to a board",
    "Tell the difference between a control and a capability, and predict which of your controls is currently decaying"
  ],
  prereq: [],
  unitUnlock: "u-seva",
  sources: [
    {
      label: "Donella Meadows, Leverage Points: Places to Intervene in a System (1999)",
      note: "The twelve leverage points, ranked least to most effective. Read it for point 9 (lengths of delays) and point 6 (structure of information flows) — those two explain more failed security programs than any control framework does."
    },
    {
      label: "Phil Venables, Leverage Points: A Cybersecurity Perspective",
      note: "A practitioner mapping of all twelve Meadows points onto security work, by someone who has run the function at Goldman Sachs and Google Cloud. Use it as the bridge between the systems literature and a real budget cycle."
    },
    {
      label: "NIST Cybersecurity Framework 2.0 (February 2024)",
      note: "Six functions now — GOVERN was added and placed at the centre of the wheel, touching Identify, Protect, Detect, Respond, Recover. Twenty-two categories, one hundred and six subcategories. Good for structure and for a shared vocabulary with auditors; useless as a threat model."
    },
    {
      label: "NIST SP 800-207, Zero Trust Architecture (August 2020)",
      note: "The seven tenets and the Policy Engine / Policy Administrator / Policy Enforcement Point split. The value is the decomposition, not the marketing term that grew on top of it."
    },
    {
      label: "MITRE ATT&CK, Enterprise matrix",
      note: "The shared behavioural vocabulary. Note that v18 (October 2025) replaced per-technique Detections with Detection Strategies, and that the current Enterprise matrix carries fifteen tactic columns — Defense Evasion has been split into Stealth and Defense Impairment. If your coverage map still says fourteen tactics, it is stale."
    },
    {
      label: "MITRE D3FEND (version 1.6.0 on 2026-11-04)",
      note: "The defensive counterpart to ATT&CK, organised as Model, Harden, Detect, Isolate, Deceive, Evict, Restore, over an ontology of digital artifacts. Use the artifact ontology to argue about what a control actually touches.",
      url: "https://d3fend.mitre.org/",
      checked: "2026-11-04",
    },
    {
      label: "Center for Threat-Informed Defense, Summiting the Pyramid",
      note: "Grades a detection from Level 1 (ephemeral values) to Level 5 (core to the technique) and adds an observable axis: Application, User-Mode, Kernel-Mode, Payload, Header. This is how you stop lying to yourself about detection coverage."
    },
    {
      label: "Hutchins, Cloppert and Amin, Intelligence-Driven Computer Network Defense (Lockheed Martin, 2011)",
      note: "The original intrusion kill chain paper. Read it for the actual argument — that defenders get repeated opportunities against a campaign, not one — rather than the seven-box picture everyone copies."
    },
    {
      label: "David Bianco, The Pyramid of Pain",
      note: "The economic argument for TTP-level detection. Hash values and IPs cost the adversary minutes; tools cost weeks; TTPs force a redesign of the playbook."
    },
    {
      label: "Threat Modeling Manifesto and Shostack's Four Question Framework",
      note: "Four questions: what are we working on, what can go wrong, what are we going to do about it, did we do a good job. The manifesto's anti-patterns — Hero Threat Modeler, Admiration for the Problem, Tendency to Overfocus, Perfect Representation — are a better review checklist than most methodologies."
    },
    {
      label: "LINDDUN privacy threat modeling (linddun.org, 2024 knowledge-base update)",
      note: "Seven privacy threat types: Linking, Identifying, Non-repudiation, Detecting, Data Disclosure, Unawareness, Non-compliance. LINDDUN GO is the card-deck form that makes it usable in a one-hour session with engineers."
    },
    {
      label: "Verizon Data Breach Investigations Report 2025",
      note: "22,052 incidents and 12,195 confirmed breaches. Credential abuse 22 percent and vulnerability exploitation 20 percent of initial access, exploitation up 34 percent year over year, third-party involvement doubled from 15 to 30 percent. Use it for base rates, never for your specific risk."
    },
    {
      label: "Mandiant M-Trends 2026",
      note: "Global median dwell time 14 days, up from 11. Internal detection 9 days versus 25 days for external notification, internal detection rate 52 percent. Exploitation the leading initial infection vector for the sixth consecutive year at roughly a third of intrusions."
    },
    {
      label: "Google Project Zero, 0day In The Wild",
      note: "The tracker itself is useful; the caveat attached to it is essential. Project Zero notes that every entry is a failure case for an attacker, and that detection bias makes the true volume of in-the-wild zero-day an unknown. That single paragraph is the best short lesson on selection bias in security data anywhere."
    }
  ],
  pages: [
    {
      id: "ch-foundations-p1-systems",
      title: "The Systems Lens",
      credential: "Certified in Systems Reasoning for Security Programs",
      summary: "A security program is a system before it is a set of controls. This Page teaches you to see the stocks of unmitigated risk, the flows that fill and drain them, the delays that make every intervention feel useless, and the feedback loops that quietly decide whether your program compounds or erodes. It ends with Meadows leverage points mapped onto real security work, so that you stop tuning parameters when the structure is what is broken.",
      competencies: [
        "Render a security program as an explicit stock-and-flow model with named delays",
        "Identify the reinforcing and balancing loops operating inside a security function and name which one currently dominates",
        "Diagnose delay as a root cause rather than treating it as an execution problem",
        "Rank candidate interventions by Meadows leverage point rather than by cost or visibility",
        "Simulate the behaviour of a remediation pipeline before committing budget to it",
        "Recognise the parameter trap: a new SLA, a new threshold, a new tool, on a structure that cannot deliver it"
      ],
      seal: "GROUND-I",
      steps: [
        {
          id: "ch-foundations-stocks-and-flows",
          kind: "construct",
          title: "Stocks, Flows, and the Bathtub You Are Standing In",
          statement: "Your risk is a stock, your controls act on flows, and almost every argument in security is people confusing the two.",
          minutes: 22,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The one distinction that reorganises everything",
              body: "A stock is an accumulation: the number of unremediated internet-facing vulnerabilities you have right now, the number of standing privileged credentials in your directory, the number of unmanaged assets, the volume of retained personal data. A flow is a rate: new vulnerabilities disclosed per week, credentials created per month, records ingested per day, findings closed per sprint. Stocks are what an adversary attacks. Flows are what your program controls. The gap between those two sentences is where most security programs quietly die."
            },
            {
              kind: "principle",
              title: "The bathtub law",
              body: "A stock only falls when outflow exceeds inflow. You can double the outflow and still be losing if the inflow tripled. Any metric that reports outflow alone — findings closed, tickets resolved, patches deployed, alerts triaged — is unfalsifiable theatre until it is placed next to the inflow and the resulting level."
            },
            {
              kind: "table",
              title: "Reading a security program as stocks and flows",
              headers: ["Stock (what the adversary sees)", "Inflow", "Outflow", "The metric people report instead"],
              rows: [
                ["Exploitable internet-facing services", "New deployments, shadow IT, M and A, newly disclosed CVEs in existing software", "Patching, decommissioning, network isolation, WAF virtual patching", "Patches applied this month"],
                ["Standing privileged access", "New hires, role changes, break-glass never revoked, service accounts created for one migration", "Deprovisioning, JIT elevation, access reviews that actually revoke", "Percent of accounts reviewed"],
                ["Undetected adversary presence", "Successful intrusions, dwell accumulating daily", "Detections that fire, hunts that find, external notification", "Number of alerts triaged"],
                ["Retained personal data", "New collection, new integrations, log verbosity, backups of backups", "Retention enforcement, minimisation at source, deletion pipelines", "DSAR turnaround time"],
                ["Unmanaged assets", "Cloud accounts opened by a team with a credit card, IoT, contractor laptops", "Discovery plus onboarding to control planes", "CMDB record count"]
              ]
            },
            {
              kind: "callout",
              title: "The number that exposes the confusion",
              body: "Ask any vulnerability management lead for their monthly remediation count and they will have it instantly. Ask for the monthly inflow rate for the same asset class and most will have to go and calculate it. That asymmetry is not laziness. It is that the whole reporting culture was built around outflow, because outflow is the part the team gets credit for."
            },
            {
              kind: "metric",
              title: "Base rates worth carrying in your head",
              source: "Verizon DBIR 2025; Mandiant M-Trends 2026; VulnCheck State of Exploitation 1H-2026",
              items: [
                "Vulnerability exploitation was around 20 percent of breach initial access in the 2025 DBIR, up 34 percent year over year — an inflow that is accelerating, not a constant",
                "Exploitation has been the leading initial infection vector in Mandiant investigations for six consecutive years, at roughly a third of intrusions",
                "VulnCheck recorded 495 additions to the Known Exploited Vulnerabilities catalogue in the first half of 2026, with a median of about 80 days from CVE publication to KEV status — but roughly 23 percent showed exploitation on or before publication day",
                "Global median dwell time in M-Trends 2026 was 14 days, up from 11 — the stock of undetected presence is not draining faster than it fills"
              ]
            },
            {
              kind: "checklist",
              title: "Convert any program to a stock-and-flow view in twenty minutes",
              items: [
                "Name the stock in units an adversary would recognise, not in units your ticketing system emits",
                "Measure the current level, not the change — the level is the exposure",
                "Measure inflow over the same window as outflow, using the same source of truth",
                "Write down the delay between an inflow event and the moment you can see it",
                "Ask which of inflow, outflow, or delay you have actually ever tried to change",
                "If the answer is only outflow, you have found this quarter's real work"
              ]
            }
          ],
          awards: ["first-model-drawn", "bathtub-clarity"],
          glossary: ["stock-and-flow", "inflow-rate", "outflow-rate", "exposure-level"]
        },
        {
          id: "ch-foundations-feedback-loops",
          kind: "lesson",
          title: "Loops: Why Programs Compound or Erode",
          statement: "Every security program is already running feedback loops; the only question is whether you designed them or inherited them.",
          minutes: 28,
          respect: 95,
          trust: 4,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Balancing loops hold a level; reinforcing loops move it",
              body: "A balancing loop senses a gap against a goal and acts to close it. Continuous control monitoring is a balancing loop: it senses configuration drift against a desired state and triggers correction. A reinforcing loop feeds on itself. Good reinforcing loops exist — improvements to build and deployment reliability free up engineering time, which funds further reliability work, which frees up more. Bad ones exist too, and they are the ones that end careers: alert fatigue reduces triage quality, which lets real detections slip, which produces an incident, which triggers more alerting, which deepens the fatigue."
            },
            {
              kind: "compare",
              title: "The two loops running in every security team right now",
              left: {
                title: "The erosion loop (reinforcing, hostile)",
                items: [
                  "A control is deployed but not instrumented for coverage",
                  "Coverage decays silently as the estate changes",
                  "An incident occurs in the uncovered fraction",
                  "The response is to buy another control rather than instrument the first",
                  "Operational load rises, instrumentation gets deprioritised again",
                  "Effective coverage of every control now decays faster"
                ]
              },
              right: {
                title: "The compounding loop (reinforcing, wanted)",
                items: [
                  "Every control ships with a coverage signal as a launch requirement",
                  "Coverage gaps are visible to the owning team, not only to security",
                  "Teams close their own gaps because the gap is embarrassing and cheap to fix",
                  "Security spends the recovered time on the next control's instrumentation",
                  "The cost of instrumenting control N+1 falls because the pattern is reusable",
                  "Assurance becomes a platform property rather than an audit event"
                ]
              }
            },
            {
              kind: "principle",
              title: "Goodhart's blade",
              body: "Any loop you close using a metric will optimise that metric. If the loop is closed on findings-closed, teams will close findings — by reclassifying, by risk-accepting, by decomposing one finding into three and closing two. Close the loop on the stock level instead, because the level is much harder to game and is the thing the adversary actually experiences."
            },
            {
              kind: "list",
              title: "Loops worth deliberately installing",
              items: [
                "Policy-as-code drift detection that opens a pull request against the offending repository rather than a ticket against a person",
                "Detection validation on a schedule, so that a detection which stopped firing raises an alarm about itself",
                "Blameless post-incident review whose output is a change to a system, tracked to completion, and not a change to a person's behaviour",
                "Error-budget style negotiation with platform teams: below the objective, security work takes priority over feature work, and both sides agreed to that in advance",
                "Publishing per-team security posture openly, which the Venables mapping identifies as leverage point 6 — changing the structure of information flows — and which reliably produces improvement without any new mandate"
              ]
            },
            {
              kind: "quote",
              body: "The gap between the service level objective and one hundred percent is a budget for failure, and the budget is spent deliberately rather than consumed by accident.",
              source: "Paraphrase of the error-budget argument, Google SRE Book, Embracing Risk"
            },
            {
              kind: "callout",
              title: "The second-order effect nobody warns you about",
              body: "When you install a strong balancing loop — say, automated remediation of misconfigured storage buckets — you remove the pain that was motivating architectural change. Teams stop feeling the cost of creating public buckets because the loop cleans up after them. Inflow rises to consume the new outflow capacity. This is not hypothetical; it is the standard outcome of auto-remediation deployed without a matching signal back to the creating team. Automate the correction, but never hide the creation rate from the creator."
            }
          ],
          awards: ["loop-cartographer"],
          glossary: ["balancing-loop", "reinforcing-loop", "goodharts-law", "error-budget", "control-drift"]
        },
        {
          id: "ch-foundations-delay",
          kind: "lesson",
          title: "Delay Is the Dominant Failure Mode",
          statement: "Most security programs are not under-resourced; they are over-delayed, and the two look identical from the outside.",
          minutes: 30,
          respect: 120,
          trust: 5,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Why delay beats capacity as an explanation",
              body: "Meadows ranks the lengths of delays relative to the rate of system change at leverage point 9, above feedback loop strength and far above parameters. In security this is the difference between a team that cannot patch and a team that cannot see. Consider a typical enterprise pipeline: asset discovery runs on a seven-day scan cycle, the configuration database is perhaps sixty percent accurate on ownership, the change advisory board meets weekly, and the maintenance window for a given tier is monthly. The organisation has not decided to take forty days to patch. Forty days is simply the sum of the delays, and no amount of urgency in a policy document subtracts from that sum."
            },
            {
              kind: "timeline",
              title: "Anatomy of a forty-one day mean time to remediate",
              items: [
                "Day 0 — CVE published, exploitation already occurring in roughly one in four KEV cases at or before publication",
                "Day 0 to 7 — vulnerability appears in your scanner only after the next authenticated scan cycle completes",
                "Day 7 to 12 — ownership resolution, because the asset inventory record names a team that reorganised eleven months ago",
                "Day 12 to 19 — the ticket waits for the weekly change advisory board",
                "Day 19 to 34 — the fix waits for the monthly maintenance window for that service tier",
                "Day 34 to 41 — verification waits for the next scan cycle to confirm closure",
                "Total attacker opportunity — 41 days, of which roughly 4 were engineering work"
              ]
            },
            {
              kind: "principle",
              title: "The delay diagnostic",
              body: "Before you fund capacity, decompose your mean time to remediate into time-to-know, time-to-own, time-to-approve, time-to-change, and time-to-verify. If engineering effort is less than a quarter of the total, hiring will not help you and will make the queue longer, because more work in progress increases the delay in every other stage."
            },
            {
              kind: "table",
              title: "Where the delay actually lives, and the intervention that shortens it",
              headers: ["Delay stage", "Typical driver", "Intervention", "Meadows leverage point"],
              rows: [
                ["Time to know", "Periodic scanning, incomplete external attack surface view", "Continuous discovery, agent telemetry, deployment-time inventory registration", "9 — lengths of delays"],
                ["Time to own", "Stale ownership metadata, no accountable service catalogue", "Ownership as a deploy-time required field enforced in the pipeline", "10 — structure of stocks and flows"],
                ["Time to approve", "Weekly change board treating a KEV item like a feature release", "A pre-approved standard change path for a defined class of security fixes", "5 — rules of the system"],
                ["Time to change", "Monthly window, low deployment confidence, manual rollback", "Investment in deployment reliability so that any change is cheap", "7 — gain of a positive feedback loop"],
                ["Time to verify", "Verification tied to the same slow scan cycle", "Verify from the artifact and the running process, not from a rescan", "6 — structure of information flows"]
              ]
            },
            {
              kind: "callout",
              title: "Delay also destroys your ability to learn",
              body: "A long delay between action and measurement does not merely slow you down. It makes causal attribution impossible, which means your program cannot learn. If it takes a quarter to see whether a control change reduced incidents, you will get roughly four learning cycles a year, and each one will be confounded by everything else that changed. Shortening measurement delay is therefore a compounding investment: it buys both faster response and faster improvement. Venables makes exactly this point — the time it takes to measure security effectiveness and adjust is one of the most important determinants of program quality."
            },
            {
              kind: "list",
              title: "Delays people never think to measure, and should",
              items: [
                "Time from an engineer creating a new cloud account to that account appearing under central guardrails",
                "Time from an employee departure to the revocation of their last live session token, not their last account",
                "Time from a detection being written to that detection being validated against real adversary behaviour",
                "Time from a third party being onboarded to that third party appearing in your incident notification list",
                "Time from a new data flow shipping to that data flow appearing in the record of processing activities"
              ]
            }
          ],
          awards: ["delay-hunter"],
          glossary: ["mean-time-to-remediate", "time-to-know", "measurement-delay", "standard-change", "system-delay"]
        },
        {
          id: "ch-foundations-leverage-points",
          kind: "lesson",
          title: "Twelve Places to Intervene, Ranked",
          statement: "The interventions that are easiest to fund are the ones Meadows ranks last, and that inversion is the structural reason security budgets under-deliver.",
          minutes: 34,
          respect: 150,
          trust: 7,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The ranking, and why it is uncomfortable",
              body: "Meadows ordered twelve intervention points from least to most effective. Numbers and parameters sit at the bottom, at 12. Buffer sizes at 11. Stock and flow structure at 10. Delay lengths at 9. Balancing loop strength at 8. Reinforcing loop gain at 7. Information flows at 6. Rules at 5. The power to self-organise at 4. Goals at 3. Mindset or paradigm at 2. The power to transcend paradigms at 1. Now notice what a security budget is usually spent on: thresholds, coverage percentages, tool counts, staffing numbers. All of that is leverage point 12. It is the easiest to approve, the easiest to report, and the least effective."
            },
            {
              kind: "table",
              title: "The Meadows ladder, mapped onto security work",
              headers: ["Point", "Meadows", "What it looks like in a security program", "Honest assessment"],
              rows: [
                ["12", "Constants and parameters", "Password length, log retention days, scan frequency, an SLA number", "Necessary, nearly always over-invested in relative to effect"],
                ["11", "Buffer sizes", "Defense in depth — layered controls absorbing individual failures", "Real but expensive; buffers are slow to change and correlate more than people think"],
                ["10", "Stock and flow structure", "Architecture: segmentation, credential topology, where data comes to rest", "High return, long lead time, requires platform partnership not policy"],
                ["9", "Lengths of delays", "Time to know, own, approve, change, verify; feedback speed on control effectiveness", "The single most underrated intervention in the field"],
                ["8", "Balancing loop strength", "Continuous control monitoring, policy as code, drift correction", "Where the modern posture management market lives; strong when instrumented, theatre when not"],
                ["7", "Reinforcing loop gain", "Deployment reliability improvements that fund further improvements", "Rarely claimed by security teams even though security is the largest beneficiary"],
                ["6", "Information flows", "Publishing per-team posture; making risk visible to the person who created it", "Cheapest high-leverage move available to almost every CISO"],
                ["5", "Rules of the system", "Standard change paths, deploy gates, regulatory shaping, contractual security terms", "Powerful and permanent; also where unintended consequences bite hardest"],
                ["4", "Power to self-organise", "Devolved experimentation with consistent policy objectives; blameless root cause work", "Produces resilience that no central team can produce alone"],
                ["3", "Goals of the system", "Whether the program exists to reduce loss, pass audits, or protect a share price", "If this is wrong, nothing below it can save you"],
                ["2", "Mindset or paradigm", "Whether leadership believes breaches are preventable or inevitable and survivable", "Determines whether risk appetite conversations are even possible"],
                ["1", "Power to transcend paradigms", "Knowing when your own model has stopped describing reality and dropping it", "The rarest skill; the reason this Page exists"]
              ]
            },
            {
              kind: "principle",
              title: "The parameter trap",
              body: "When a program is failing, the reflex is to tighten a number: shorten the SLA, raise the coverage target, lower the alert threshold. This is leverage point 12 applied to a structure that cannot deliver it. The result is a policy that is violated by default, which teaches the organisation that security policy is aspirational. You have now made leverage point 5 — the rules of the system — weaker, in exchange for a number on a slide."
            },
            {
              kind: "callout",
              title: "Meadows' own warning, and it applies exactly",
              body: "Meadows cautioned that leverage points are counterintuitive and that people reliably push them in the wrong direction. In security, the classic wrong-direction push is at point 8: a team notices drift, so it strengthens the balancing loop by adding hard blocking enforcement, and engineers respond by moving work to environments the loop cannot see. Enforcement strength increased; actual coverage fell. Before strengthening any balancing loop, ask where the work will go if the loop wins."
            },
            {
              kind: "checklist",
              title: "The leverage audit, run once per planning cycle",
              items: [
                "List every funded initiative in the coming year and assign each one a Meadows number",
                "Sum the budget by leverage point and look at the distribution",
                "If more than half the money sits at 11 and 12, you have a portfolio problem, not an execution problem",
                "For the top three initiatives, name the second-order effect and where the displaced work will go",
                "Identify one intervention at point 6 you could ship this quarter for near-zero cost",
                "Identify whether your program's stated goal at point 3 matches what you are actually measured on"
              ]
            }
          ],
          awards: ["leverage-audit", "meadows-ladder"],
          glossary: ["leverage-point", "parameter-trap", "policy-as-code", "second-order-effect"]
        },
        {
          id: "ch-foundations-lab-simulate-program",
          kind: "lab",
          title: "Lab: Simulate the Pipeline Before You Fund It",
          statement: "If you cannot simulate your remediation pipeline in fifty lines of code, you do not understand it well enough to spend money on it.",
          minutes: 40,
          respect: 175,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "What this lab proves",
              body: "You will build a discrete-time model of a vulnerability remediation pipeline with a real inflow, a capacity-limited outflow, and a staged delay. Then you will run three interventions against it — doubling remediation capacity, halving the discovery delay, and adding a standard change path — and see which one actually drains the stock. The result is counterintuitive to most executives and is the single most persuasive artifact you can bring to a budget conversation."
            },
            {
              kind: "code",
              title: "pipeline.py — a stock, a flow, and a delay",
              lang: "python",
              body: "import random\nimport statistics\n\n# One tick equals one day. We model internet-facing findings only.\nDAYS = 365\n\nclass Pipeline:\n    def __init__(self, discovery_delay, approve_delay, capacity, inflow_mean):\n        self.discovery_delay = discovery_delay   # days from existence to visibility\n        self.approve_delay = approve_delay       # days from visibility to authorised change\n        self.capacity = capacity                 # findings an engineer pool can close per day\n        self.inflow_mean = inflow_mean           # new exploitable findings per day\n        self.latent = []                         # exists but not yet seen\n        self.queued = []                         # seen, awaiting approval\n        self.ready = 0                           # approved, awaiting engineering\n        self.exposure_days = 0                   # integral of open exposure over time\n\n    def tick(self, day):\n        arrivals = max(0, int(random.gauss(self.inflow_mean, self.inflow_mean * 0.4)))\n        self.latent.append((day + self.discovery_delay, arrivals))\n\n        surfaced = 0\n        for due, count in list(self.latent):\n            if due <= day:\n                surfaced += count\n                self.latent.remove((due, count))\n        if surfaced:\n            self.queued.append((day + self.approve_delay, surfaced))\n\n        for due, count in list(self.queued):\n            if due <= day:\n                self.ready += count\n                self.queued.remove((due, count))\n\n        closed = min(self.ready, self.capacity)\n        self.ready -= closed\n\n        open_now = sum(c for _, c in self.latent) + sum(c for _, c in self.queued) + self.ready\n        self.exposure_days += open_now\n        return open_now\n\n\ndef run(label, **kw):\n    random.seed(7)\n    p = Pipeline(**kw)\n    levels = [p.tick(d) for d in range(DAYS)]\n    tail = levels[-90:]\n    print(label.ljust(34),\n          'steady-state open:', str(int(statistics.mean(tail))).rjust(5),\n          '  exposure-days:', str(p.exposure_days).rjust(8))\n\n\nBASE = dict(discovery_delay=7, approve_delay=12, capacity=9, inflow_mean=10)\n\nrun('baseline', **BASE)\nrun('double engineering capacity', **{**BASE, 'capacity': 18})\nrun('continuous discovery (7 -> 1)', **{**BASE, 'discovery_delay': 1})\nrun('standard change path (12 -> 2)', **{**BASE, 'approve_delay': 2})\nrun('both delays cut, same capacity', **{**BASE, 'discovery_delay': 1, 'approve_delay': 2})\nrun('inflow reduced 30 percent', **{**BASE, 'inflow_mean': 7})\n"
            },
            {
              kind: "numbered",
              title: "Run it, then interrogate it",
              items: [
                "Run the script as written and record the steady-state open count and exposure-days for each scenario",
                "Notice that doubling capacity when capacity is already close to inflow produces a large improvement, and that doubling it again produces almost none — capacity only helps while it is the binding constraint",
                "Notice that cutting delays does not change the steady-state level much at all, but slashes exposure-days, because exposure-days is the integral that the adversary actually samples from",
                "Set capacity to 20 and rerun the delay scenarios; observe that once capacity is abundant, delay becomes the entire story",
                "Replace the Gaussian inflow with a bursty distribution — a Poisson process with an occasional multiplier of ten for a mass-exploitation event — and observe how badly a capacity-constrained pipeline handles the burst",
                "Add a second class of finding with its own capacity pool and watch what happens when the two classes share the change approval queue"
              ]
            },
            {
              kind: "callout",
              title: "The finding that changes budget conversations",
              body: "Steady-state open count is the metric every dashboard reports. Exposure-days is the metric that correlates with getting breached, because an adversary does not sample your queue depth once a quarter — they sample it continuously. Two programs can report identical open counts while one carries three times the exposure-days of the other. When you present this simulation, lead with exposure-days and let the open count be a footnote."
            },
            {
              kind: "principle",
              title: "Model before money",
              body: "Any intervention worth more than a quarter of an engineer's year should be justified against an explicit model that names the constraint it relieves. If the model shows the intervention does not move the constraint, the intervention is a preference, not a plan."
            },
            {
              kind: "list",
              title: "Extensions worth building once you have the basic model",
              items: [
                "Add a decay term to remediation quality: a fraction of closed findings reopen, which is what actually happens with configuration fixes that are not enforced as code",
                "Model two teams with different capacities sharing one approval queue, and watch the fast team get starved by the slow one",
                "Introduce a KEV fast lane with a separate delay and priority, and measure how much exposure-day reduction it buys for how small a policy change",
                "Add an adversary process that samples the open stock at a fixed rate and converts a hit into an incident, then run a thousand seeds to get a distribution rather than a point estimate"
              ]
            }
          ],
          praxis: "Instrument your own pipeline for one asset class and replace the invented parameters in this model with your measured ones.",
          evidence: "The parameterised script plus a one-page comparison of steady-state open count versus exposure-days for your real program under three candidate interventions.",
          awards: ["first-simulation", "exposure-days"],
          glossary: ["exposure-days", "binding-constraint", "steady-state", "discrete-time-model"]
        },
        {
          id: "ch-foundations-drill-parameter-trap",
          kind: "drill",
          title: "Drill: Forty-One Days",
          statement: "When the number is bad, the reflex is to change the number; the discipline is to change the structure that produced it.",
          minutes: 20,
          respect: 140,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Setting",
              body: "You are eleven weeks into a CISO role at a mid-size logistics company. Internet-facing estate is roughly nine hundred hosts across three cloud accounts and two legacy data centres. A newly disclosed authentication bypass in an edge appliance you operate has just been added to the KEV catalogue, with confirmed in-the-wild exploitation. Your measured mean time to remediate for internet-facing assets is forty-one days. The COO has asked for a plan in the executive sync ninety minutes from now."
            },
            {
              kind: "list",
              title: "What you already know about your own pipeline",
              items: [
                "Authenticated scanning runs on a seven-day cycle",
                "Asset ownership metadata resolves correctly about sixty percent of the time on first attempt",
                "The change advisory board meets Thursdays and does not distinguish a KEV patch from a schema migration",
                "Tier-2 services have a monthly maintenance window; the next one is nineteen days away",
                "Closure is only confirmed by the following scan cycle",
                "Engineering effort on a typical patch is under four hours"
              ]
            }
          ],
          drill: {
            id: "ch-foundations-drill-parameter-trap-d",
            scene: "Executive sync in ninety minutes. A KEV-listed authentication bypass affects an edge appliance in your internet-facing estate. Your mean time to remediate is forty-one days and the COO wants to know what you are going to do about it.",
            clock: "90 minutes to a decision, 19 days to the next maintenance window",
            pressure: "The COO has already said the number is unacceptable. The head of platform engineering is in the room and is protective of change control. Your predecessor left after an outage caused by an emergency change.",
            prompt: "What do you commit to in the sync?",
            options: [
              {
                id: "ch-foundations-drill-parameter-trap-o1",
                label: "Announce a mandatory 72-hour remediation SLA for all internet-facing assets, effective immediately",
                detail: "Strong, decisive, and exactly what the room wants to hear.",
                score: -1,
                outcome: "The SLA is approved in the room and missed within the first week. Discovery alone consumes seven days. Within a month, teams are marking items as compensating-control-applied to stop the SLA breach reports, and your remediation data becomes unreliable.",
                ripple: "You have spent your newest political capital on leverage point 12 and, by making a rule that is violated by default, weakened leverage point 5. The next real mandate you issue will be discounted by everyone who watched this one fail.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-parameter-trap-o2",
                label: "Procure a risk-based vulnerability prioritisation platform with EPSS and KEV enrichment",
                detail: "Stop treating all findings equally; let the data decide what matters.",
                score: -2,
                outcome: "Procurement takes ten weeks. The platform correctly tells you which twenty findings matter most — a fact you could have obtained free from the KEV catalogue — and every one of those twenty still takes forty-one days to fix.",
                ripple: "You have improved the quality of the queue's ordering without touching any of the five delays that constitute the queue's latency. Worse, the tool now generates its own reporting, which will be mistaken for progress for at least two quarters.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-parameter-trap-o3",
                label: "Decompose the 41 days publicly, then attack the two largest delays: continuous external discovery, and a pre-approved standard change path for KEV-listed items",
                detail: "Show the decomposition in the sync. Ask the CAB chair to co-author the standard change definition rather than be bypassed by it.",
                score: 3,
                outcome: "The decomposition reframes the conversation from a performance problem into a process problem, which lowers the temperature and moves platform engineering from defence to collaboration. The standard change path is agreed in two weeks with a tight, auditable scope. Continuous discovery removes the seven-day and the verification delays together.",
                ripple: "Time to remediate falls toward single digits for the KEV class without adding a single headcount. More importantly, you have shortened the measurement delay, so the next control change you make can actually be evaluated. The CAB chair becomes an ally because you made them the author of the exception rather than its victim.",
                isBest: true
              },
              {
                id: "ch-foundations-drill-parameter-trap-o4",
                label: "Escalate to the board risk committee and request four additional headcount for the vulnerability management team",
                detail: "The team is genuinely stretched, and the number will not move without people.",
                score: -1,
                outcome: "Two of the four roles are approved and filled in five months. Engineering effort was never the constraint — it was under four hours per patch — so the added capacity sits idle behind the same approval and window delays, and the metric barely moves.",
                ripple: "You have burned a board ask on a non-constraint, and next year's request for the thing that would have worked now competes against a visible failure. Adding people also increased work in progress, which lengthened the approval queue slightly for everyone else.",
                isBest: false
              }
            ],
            debrief: "The forty-one days is not a performance figure; it is an arithmetic sum of five structural delays, of which under four hours is engineering. Options one and four both treat it as an effort problem — one by demanding more urgency, the other by buying more hands — and both fail for the same reason: they act on a stage that is not the constraint. Option two improves the ordering of a queue whose latency is the actual problem. Option three is Meadows leverage point 9 applied directly, paired with point 5 (a new rule that creates a legitimate fast path) and point 6 (making the decomposition visible to the people who own each stage). Note the political craft in the best answer as well: co-authoring the standard change with the change advisory board chair converts the person most able to block you into the person accountable for the fix. A bypass would have produced the same technical outcome and a permanent enemy.",
            principle: "Decompose the number before you attack it. If engineering effort is a small fraction of elapsed time, the answer is never more engineers and never a tighter deadline."
          },
          awards: ["delay-hunter", "first-blood-drill"],
          glossary: ["standard-change", "change-advisory-board", "kev-catalog", "epss"]
        }
      ]
    },
    {
      id: "ch-foundations-p2-variety",
      title: "Variety, Viability, and Decay",
      credential: "Certified in Defensive Variety and Control Viability",
      summary: "Ashby's law says a regulator must have at least as much variety as the thing it regulates. Applied to security, it explains why buying a second product in a category you already cover is a waste and why one uncovered layer beats ten redundant ones. This Page also confronts the least discussed fact in the field: controls decay. A control is a claim about the present tense, and the estate changes under it every day. You will learn to measure that decay, to distinguish a control from a capability, and to argue the difference to an executive who wants to buy a product.",
      competencies: [
        "Apply the law of requisite variety to a control portfolio and identify the layer with zero variety",
        "Map a security organisation onto the viable system model and locate the missing system",
        "Distinguish defense in depth from defense in breadth and choose correctly under a fixed budget",
        "Separate controls from capabilities and explain why capability survives novelty and controls do not",
        "Measure control decay empirically and express it as a half-life",
        "Negotiate a control request from an executive without either capitulating or refusing"
      ],
      seal: "GROUND-II",
      steps: [
        {
          id: "ch-foundations-requisite-variety",
          kind: "construct",
          title: "Requisite Variety: Only Variety Absorbs Variety",
          statement: "You cannot regulate a system with more states than your regulator can distinguish, and an adversary's job is to find a state you have no response for.",
          minutes: 24,
          respect: 85,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Ashby's law, stated for defenders",
              body: "W. Ross Ashby's law of requisite variety holds that only variety can absorb variety: a regulator must be able to take at least as many distinct states as the disturbances it is meant to regulate. A thermostat with two states — on and off — regulates a one-dimensional disturbance. An adversary is not one-dimensional. They can arrive through a credential, an unpatched edge device, a third-party integration, a signed but malicious update, a helpdesk phone call, a contractor laptop, or an over-permissive service account. If your control portfolio has ten products that all inspect the endpoint, you have enormous depth and almost no variety. You have ten thermostats and no lock."
            },
            {
              kind: "principle",
              title: "The variety test",
              body: "For every plausible entry path, ask what would have to fail for the adversary to succeed, and whether the answer names one mechanism or several independent ones. If the answer names one mechanism repeated, you have redundancy, not variety. Redundancy protects against random failure. Variety protects against an intelligent opponent, because an intelligent opponent will only attack where variety is zero."
            },
            {
              kind: "table",
              title: "Variety inventory for a mid-size enterprise",
              headers: ["Entry path", "Distinct mechanisms you can bring", "Typical actual variety", "Failure mode"],
              rows: [
                ["Stolen valid credential", "Phishing-resistant authenticator, device binding, session token binding, behavioural anomaly, just-in-time elevation", "One — a password plus a push notification", "Push fatigue and token theft defeat the single mechanism entirely"],
                ["Internet-facing exploitation", "Patch velocity, attack surface reduction, exploit mitigation, network isolation of the appliance, egress control", "Two — patching and a firewall rule", "Zero-day on the appliance leaves nothing between the adversary and lateral movement"],
                ["Trusted third-party integration", "Scoped tokens, short token lifetime, per-tenant egress allow-lists, anomaly detection on integration behaviour, contractual notification", "One — the vendor's own assurance questionnaire", "Third-party involvement in breaches doubled to 30 percent in the 2025 DBIR against precisely this variety gap"],
                ["Insider or compromised employee", "Separation of duties, dual authorisation on sensitive actions, immutable audit, data egress control, behavioural baseline", "One — after-the-fact logging", "Detection exists but no mechanism prevents or interrupts"],
                ["Malicious dependency in the build", "Provenance attestation, reproducible builds, pinned and verified artefacts, build isolation, runtime behaviour baselining", "Zero to one — a software composition scan for known CVEs", "A scanner that looks for known bad has no state for a novel malicious package"]
              ]
            },
            {
              kind: "callout",
              title: "The purchasing pathology this explains",
              body: "Security markets are organised by category, and categories are organised around the layers that are easiest to instrument. That means budget flows toward layers that already have coverage, because those layers have mature products with clear comparison criteria. The layers with zero variety are usually the ones with no mature product — identity lifecycle hygiene, third-party token scoping, build provenance — which is exactly why they have zero variety. The market will not solve your variety gap for you; it created it."
            },
            {
              kind: "checklist",
              title: "Run a variety audit",
              items: [
                "List the top eight entry paths for your sector, sourced from the DBIR patterns and your own incident history",
                "For each path, list the independent mechanisms that would each have to fail",
                "Mark any path where the count is one, and any path where the mechanisms are not actually independent",
                "Non-independence is the trap: two controls from the same vendor, on the same agent, reading the same telemetry, are one mechanism wearing two names",
                "Rank remediation by paths with the lowest variety, not by the paths with the loudest recent headlines",
                "Recheck after every acquisition, because acquisitions import entry paths faster than they import controls"
              ]
            }
          ],
          awards: ["variety-audit"],
          glossary: ["requisite-variety", "control-independence", "entry-path", "redundancy-vs-variety"]
        },
        {
          id: "ch-foundations-viable-system",
          kind: "lesson",
          title: "The Viable System Model of a Security Function",
          statement: "Most security orgs are missing System Four, and that is why they are always surprised.",
          minutes: 32,
          respect: 155,
          trust: 8,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Stafford Beer's five systems, applied",
              body: "Beer's viable system model describes any organisation that survives in a changing environment as five interacting systems. System One does the primary work. System Two coordinates System One units and damps oscillation between them. System Three manages the here-and-now: resource allocation, performance, internal optimisation. System Three-star provides sporadic direct audit that bypasses normal reporting. System Four looks outward and forward at the environment and the future. System Five holds identity, policy, and the balance between Three and Four. A security function that lacks any one of these five is not merely inefficient; it is structurally incapable of remaining viable as its environment changes."
            },
            {
              kind: "table",
              title: "Mapping the five systems onto a security organisation",
              headers: ["System", "Function", "Security instantiation", "Symptom when absent or weak"],
              rows: [
                ["One", "Primary operations", "SOC triage, IR, vulnerability remediation, IAM operations, appsec review", "Nothing gets done; usually the last thing to be missing"],
                ["Two", "Coordination and anti-oscillation", "Shared severity definitions, common ticket taxonomy, deconfliction between hunt and IR, a single change calendar", "Two teams work the same incident with different sevs; hunts trip IR containment"],
                ["Three", "Internal regulation, resource allocation", "Program management, control ownership, budget, metrics, the operating rhythm", "Resource fights, duplicated tooling, no one can say who owns a control"],
                ["Three-star", "Sporadic direct audit", "Purple team, control validation, red team, unannounced access reviews, evidence sampling", "Reported coverage diverges from real coverage and nobody notices for years"],
                ["Four", "Outside and future", "Threat intelligence that changes plans, horizon scanning, architecture influence, regulatory anticipation", "Every new adversary technique and every new regulation arrives as a surprise and a crisis"],
                ["Five", "Identity and policy balance", "Risk appetite, the stated purpose of the function, arbitration between today's fires and tomorrow's architecture", "The program oscillates between audit-driven and incident-driven with each new leader"]
              ]
            },
            {
              kind: "principle",
              title: "Three-star is not optional",
              body: "The audit channel that bypasses normal reporting is the only structural defence against a program that has learned to report what leadership wants. Every large control failure that surfaced during a breach was preceded by a period in which the routine reporting said the control was fine. Purple teaming, unannounced control validation, and evidence sampling are the security instantiation of Beer's Three-star channel, and they must report on a path that does not run through the people whose numbers they are testing."
            },
            {
              kind: "compare",
              title: "Where security functions actually break",
              left: {
                title: "The System Four deficit",
                items: [
                  "Threat intelligence is consumed as indicator feeds rather than as an input to architecture",
                  "New regulation arrives as a compliance project rather than a design constraint anticipated a year earlier",
                  "Adversary shifts — token theft over password theft, edge devices over user endpoints — are recognised only after they hit you",
                  "There is no one whose job is to be wrong about the future in writing, early enough for it to matter"
                ]
              },
              right: {
                title: "The System Three dominance failure",
                items: [
                  "Everything is measured on this quarter's operational metrics",
                  "Architecture work loses every prioritisation contest to incident and audit work",
                  "Investment follows the last incident, which is a rear-view mirror with a lag",
                  "The function becomes very good at a threat model that expired eighteen months ago"
                ]
              }
            },
            {
              kind: "callout",
              title: "The homeostat you are actually running",
              body: "Beer's central claim is that viability comes from the balance between System Three and System Four, held by System Five. In security this is the permanent tension between operating today's controls and redesigning for tomorrow's adversary. If System Five — you — does not explicitly hold that balance, System Three always wins, because operational pain is immediate and architectural debt is not. The practical form of holding the balance is embarrassingly simple: a protected fraction of engineering capacity that operational escalation is not permitted to consume, defended in writing, every quarter."
            },
            {
              kind: "list",
              title: "Diagnostic questions for your own function",
              items: [
                "Who in your organisation is paid to be looking eighteen months out, and what fraction of their time is actually protected from operational escalation",
                "What channel exists for bad news that does not pass through the person responsible for the number",
                "When two of your teams disagree about severity, what resolves it — a definition, or a personality",
                "What percentage of last year's investment was driven by an incident, an audit, or a forward-looking model, and are you comfortable with the split",
                "If your best engineer left tomorrow, which of the five systems would stop functioning"
              ]
            }
          ],
          awards: ["viable-system-map", "three-star-channel"],
          glossary: ["viable-system-model", "system-four", "purple-team", "audit-channel", "risk-appetite"]
        },
        {
          id: "ch-foundations-depth-breadth-capability",
          kind: "lesson",
          title: "Depth, Breadth, and the Control-versus-Capability Line",
          statement: "A control is a frozen answer to a question the adversary has already moved past; a capability is the ability to produce a new answer.",
          minutes: 30,
          respect: 130,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Depth and breadth are not the same purchase",
              body: "Defense in depth stacks controls along a single expected path so that individual failures are absorbed. In Meadows terms it is leverage point 11 — buffer size. Defense in breadth spreads coverage across paths so that no path is undefended. In Ashby terms it is variety. Depth protects you against a control that fails. Breadth protects you against an adversary who chooses a different route. Since an adversary chooses their route after observing your defences, and a control failure is largely random, breadth generally dominates depth once you have any depth at all. The exception is the crown-jewel path, where you want both."
            },
            {
              kind: "compare",
              title: "When to buy depth, when to buy breadth",
              left: {
                title: "Buy depth",
                items: [
                  "On the one or two paths to your genuine crown jewels, where a single failure is unacceptable",
                  "Where the control has a known, non-trivial false-negative rate you cannot reduce",
                  "Where the layers fail independently — a network control and a cryptographic control fail for different reasons",
                  "Where regulation or contract requires demonstrable redundancy and you can get real independence for the money"
                ]
              },
              right: {
                title: "Buy breadth",
                items: [
                  "Anywhere the variety audit returned a count of one",
                  "On paths that recent sector data shows are actively used and you have never defended",
                  "Where a new mechanism costs less than deepening an existing stack, which is almost always true at the first unit of coverage",
                  "Where the adversary has demonstrated route-switching behaviour, which is the normal behaviour of any competent operator"
                ]
              }
            },
            {
              kind: "principle",
              title: "The independence requirement",
              body: "Two layers only give you depth if they fail for different reasons. Two endpoint agents on the same host, both dependent on the same kernel callbacks, both blind to the same in-memory technique, both administered by the same team through the same console, are one layer with two invoices. Before claiming depth, write down the single event that would disable both layers at once. If you can write it in a sentence, you do not have depth."
            },
            {
              kind: "table",
              title: "Control versus capability",
              headers: ["Dimension", "Control", "Capability"],
              rows: [
                ["What it is", "A specific enforced behaviour: this port is closed, this binary is blocked, this token expires in one hour", "A durable ability to sense, decide, and act on a class of problem"],
                ["Example", "An allow-list of approved signing certificates", "A detection engineering function that can write, validate, and deploy a new analytic in under a week"],
                ["Behaviour against a novel technique", "Fails silently, because it encodes yesterday's known-bad", "Adapts, because it encodes a way of producing answers"],
                ["Decay profile", "Decays continuously as the estate changes underneath it", "Appreciates with use, if the people are retained"],
                ["What an auditor can see", "Everything — controls are legible and testable", "Almost nothing, which is why capability is chronically underfunded"],
                ["Cost shape", "Capital purchase then a maintenance tail", "Salary, retention, and time; no vendor will sell it to you"]
              ]
            },
            {
              kind: "callout",
              title: "The asymmetry that determines your budget philosophy",
              body: "Controls are legible to auditors, boards, and regulators. Capabilities are not. That means a program optimised for external legibility will systematically over-buy controls and under-build capability, and will look excellent right up until it meets a technique nobody wrote a control for. The counter-move is to make capability legible on purpose: publish time-to-write-and-validate-a-detection, time-to-contain in exercises, time-to-produce-a-forensic-answer. Turn your capability into a measured number before someone forces you to justify it as a headcount line."
            },
            {
              kind: "quote",
              body: "Detection and response is not a product you install. It is a manufacturing process whose output is analytics, and like any manufacturing process it has yield, cycle time, and defect rates.",
              source: "Working formulation used across modern detection engineering practice"
            }
          ],
          awards: ["depth-vs-breadth", "capability-ledger"],
          glossary: ["defense-in-depth", "defense-in-breadth", "control-independence", "capability", "detection-engineering"]
        },
        {
          id: "ch-foundations-lab-control-decay",
          kind: "lab",
          title: "Lab: Measure the Half-Life of a Control",
          statement: "Every control has a decay rate, and if you have never measured it you are reporting a number from the day you deployed.",
          minutes: 40,
          respect: 185,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Why decay is invisible by construction",
              body: "Coverage is usually computed as agents-installed divided by assets-known. Both terms are wrong in the same direction. The numerator counts installations, not healthy reporting agents. The denominator counts assets your inventory knows about, which systematically excludes exactly the assets most likely to be uncovered. The result is a coverage figure that is biased upward and that drifts further upward over time as the unknown estate grows. Control decay is the rate at which real coverage falls away from reported coverage, and it is measurable if you are willing to look."
            },
            {
              kind: "code",
              title: "decay.sql — reported coverage versus reporting reality",
              lang: "sql",
              body: "-- Assumes three independent sources joined into one warehouse:\n--   cmdb_assets      : what the inventory believes exists\n--   agent_checkins   : last heartbeat per agent, per host\n--   cloud_inventory  : authoritative enumeration from provider APIs\n--\n-- The whole point is that the denominator comes from a source the\n-- control does not control.\n\nWITH truth AS (\n  SELECT host_id, first_seen, environment\n  FROM cloud_inventory\n  WHERE state = 'running'\n),\nhealthy AS (\n  SELECT host_id, MAX(checkin_at) AS last_seen\n  FROM agent_checkins\n  GROUP BY host_id\n  HAVING MAX(checkin_at) > NOW() - INTERVAL '24 hours'\n)\nSELECT\n  t.environment,\n  DATE_TRUNC('week', t.first_seen)                AS cohort_week,\n  COUNT(*)                                        AS hosts,\n  COUNT(h.host_id)                                AS covered,\n  ROUND(100.0 * COUNT(h.host_id) / COUNT(*), 1)   AS real_coverage_pct,\n  ROUND(AVG(EXTRACT(EPOCH FROM (h.last_seen - t.first_seen)) / 86400), 1)\n                                                  AS mean_days_to_coverage\nFROM truth t\nLEFT JOIN healthy h ON h.host_id = t.host_id\nGROUP BY 1, 2\nORDER BY 1, 2;\n"
            },
            {
              kind: "code",
              title: "halflife.py — fit the decay and express it in days",
              lang: "python",
              body: "import math\n\n# Real coverage of one control, sampled weekly, for a single cohort of\n# hosts that were all fully covered at week zero. This is the shape you\n# get when nobody re-runs enrolment after the initial rollout.\nsamples = [\n    (0, 100.0), (1, 98.4), (2, 96.1), (3, 94.0), (4, 91.2),\n    (5, 89.5), (6, 86.9), (7, 85.1), (8, 82.6), (9, 80.4),\n    (10, 78.8), (11, 76.2), (12, 74.5),\n]\n\n# Fit C(t) = C0 * exp(-k t) by least squares on the log.\nn = len(samples)\nsx = sum(t for t, _ in samples)\nsy = sum(math.log(c) for _, c in samples)\nsxx = sum(t * t for t, _ in samples)\nsxy = sum(t * math.log(c) for t, c in samples)\n\nk = -(n * sxy - sx * sy) / (n * sxx - sx * sx)\nhalf_life_weeks = math.log(2) / k\n\nprint('decay constant per week :', round(k, 5))\nprint('half-life               :', round(half_life_weeks, 1), 'weeks',\n      '=', round(half_life_weeks * 7), 'days')\nprint('coverage at 12 months   :', round(100 * math.exp(-k * 52), 1), 'percent')\nprint()\nprint('Enrolment rate required to hold coverage flat, per week:')\nprint('   ', round(k * 100, 2), 'percent of the fleet must be re-enrolled')\n"
            },
            {
              kind: "numbered",
              title: "Procedure",
              items: [
                "Pick one control with a machine-readable health signal — endpoint agent, log forwarder, disk encryption, MDM enrolment, WAF coverage",
                "Find a denominator the control does not produce: the cloud provider API, the DHCP lease table, the identity provider's device registry, the switch ARP tables",
                "Compute real coverage weekly for at least a quarter, split by cohort of asset creation date so that new growth does not mask decay in the old estate",
                "Fit the exponential and report the half-life in days, alongside the re-enrolment rate needed to hold the line",
                "Repeat for a second control and compare half-lives; the spread between your best and worst control is the most useful number this lab produces",
                "Present the two half-lives to the owning teams before you present them to leadership, so that the first reaction is engineering rather than defensiveness"
              ]
            },
            {
              kind: "callout",
              title: "What the half-life tells you that coverage cannot",
              body: "Coverage is a level. Half-life is a rate. A control at 94 percent with a six-week half-life is in far worse shape than a control at 88 percent with a two-year half-life, and only one of those two facts appears on a standard dashboard. Half-life also gives you a defensible answer to the question every executive eventually asks — why do we need to keep spending on something we already bought — because you can now state the enrolment rate required simply to stay still."
            },
            {
              kind: "principle",
              title: "Denominator independence",
              body: "Never let a control supply the denominator for its own coverage metric. Any control that enumerates the world through its own agents is structurally blind to the part of the world where its agents are absent. This one rule catches more inflated assurance than any audit procedure."
            }
          ],
          praxis: "Compute real coverage and half-life for two controls in your own estate using an independent denominator for each.",
          evidence: "The two queries, the fitted half-lives in days, the required weekly re-enrolment rate, and a screenshot or export showing the gap between reported and real coverage.",
          awards: ["half-life-measured", "denominator-independence"],
          glossary: ["control-decay", "coverage-half-life", "denominator-independence", "cohort-analysis"]
        },
        {
          id: "ch-foundations-drill-two-million",
          kind: "drill",
          title: "Drill: Two Million and One Choice",
          statement: "The layer you already cover is the one everyone wants to reinforce, and it is almost never the layer that will be used against you.",
          minutes: 22,
          respect: 160,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Setting",
              body: "You are the CISO of a 4,000-person healthcare technology company. Annual planning has landed you two point four million dollars of incremental security spend, and finance wants it committed by Friday. Your current posture: mature endpoint detection with 94 percent real coverage, a 24x5 managed SOC, quarterly penetration testing, and a vulnerability program with a 21-day mean time to remediate on internet-facing assets. Your identity estate is a different story — password plus push authenticator for everyone, roughly 340 standing privileged accounts, no session token binding, joiner-mover-leaver handled by a quarterly manual review, and eleven third-party integrations holding long-lived OAuth tokens into your CRM."
            },
            {
              kind: "metric",
              title: "Sector context on your desk",
              source: "Verizon DBIR 2025",
              items: [
                "Credential abuse was the single largest initial access vector at roughly 22 percent",
                "Vulnerability exploitation was roughly 20 percent and rising 34 percent year over year",
                "Third-party involvement in breaches doubled from 15 percent to 30 percent",
                "Phishing was third at roughly 16 percent"
              ]
            }
          ],
          drill: {
            id: "ch-foundations-drill-two-million-d",
            scene: "Two point four million dollars of incremental spend must be committed by Friday. Endpoint is mature. Identity is not. Eleven third-party integrations hold long-lived OAuth tokens into your CRM.",
            clock: "4 days to commit, 1 planning cycle to live with it",
            pressure: "The board's audit committee has asked twice this year about ransomware specifically. Your head of infrastructure has already circulated a proposal for a second endpoint product. The CFO will read whatever you sign as your statement of priorities.",
            prompt: "Where does the two point four million go?",
            options: [
              {
                id: "ch-foundations-drill-two-million-o1",
                label: "Deploy a second, independent endpoint detection product alongside the incumbent for true defense in depth",
                detail: "Two vendors, two detection philosophies, no single point of failure on the endpoint.",
                score: -2,
                outcome: "Agent conflicts consume the platform team for two quarters. Both products read overlapping kernel and user-mode telemetry, so they miss substantially the same in-memory techniques. Real coverage of the second product plateaus at 81 percent because the same enrolment gaps that limit the first one limit it too.",
                ripple: "You have doubled operational load and added no variety. Worse, you have set the precedent that the answer to a security question is a second product in an existing category, which is the exact reasoning that will be used against you at every future planning cycle. The identity gap is now a year older.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-two-million-o2",
                label: "Fund identity: phishing-resistant authenticators everywhere, session token binding, just-in-time elevation to retire standing privilege, and scoped short-lived tokens with per-integration egress monitoring for the eleven third parties",
                detail: "Four mechanisms on the two paths where your variety count is currently one.",
                score: 3,
                outcome: "The program takes three quarters and is genuinely painful in the middle two. At the end, credential theft no longer converts to access, stolen session tokens no longer replay, standing privilege drops from 340 accounts to a few dozen break-glass identities with alarms on them, and third-party token compromise becomes a scoped and observable event rather than a silent full-tenant read.",
                ripple: "You have added variety on the two highest-frequency entry paths in your sector's data simultaneously. A second-order benefit arrives unplanned: retiring standing privilege forces an ownership cleanup that improves the accuracy of your asset inventory, which shortens time-to-own in the remediation pipeline you were separately trying to fix.",
                isBest: true
              },
              {
                id: "ch-foundations-drill-two-million-o3",
                label: "Extend the managed SOC to 24x7 and add two in-house detection engineers",
                detail: "Detection and response is capability, not a control, and capability survives novelty.",
                score: 1,
                outcome: "Real and useful. Mean time to detect improves, and the detection engineers begin producing analytics at the technique level rather than consuming indicator feeds. But nothing about the rate at which adversaries obtain valid credentials changes, and your third-party token exposure is untouched.",
                ripple: "You bought capability, which is the right instinct and the harder thing to justify — this is not a foolish answer. The cost is that you spent your one large budget on shortening dwell time rather than reducing entry frequency, and dwell time is the metric that matters second. Do this next year, after the entry paths are closed.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-two-million-o4",
                label: "Buy an integrated governance, risk and compliance platform to unify control evidence and give the audit committee a live posture view",
                detail: "The board has asked twice; visibility into control status is a real gap.",
                score: -3,
                outcome: "Eighteen months of implementation produces a well-organised, real-time view of controls whose real coverage you have never independently measured. The platform inherits its denominators from the same systems that were already overstating coverage, so it reports high assurance with high confidence.",
                ripple: "You have industrialised a measurement error and put it in front of the board with a timestamp on it. When the incident comes through the identity path you did not fund, the existence of a live green dashboard makes the post-incident conversation materially worse, because it demonstrates that the organisation was told it was fine.",
                isBest: false
              }
            ],
            debrief: "This drill is an Ashby problem wearing a budget costume. Endpoint already has depth; adding a second product there increases redundancy against random control failure while adding almost nothing against an intelligent adversary who simply routes around a covered layer. Option two adds four independent mechanisms across the two paths where your variety count is one, and those two paths are the top and the fastest-growing categories in current sector data. Option three is the genuinely tempting wrong answer, and note that it scores positive: buying capability rather than controls is usually the sophisticated move, and a strong candidate will feel real discomfort rejecting it. It loses this year only on sequencing — reducing entry frequency dominates reducing dwell time when your entry paths have a variety count of one, because dwell time only matters after entry. Option four is the failure mode that ends careers quietly: it converts an assurance gap into an assurance illusion, and the illusion is worse than the gap because it removes the discomfort that would otherwise have driven action.",
            principle: "Spend where variety is one, not where depth is comfortable. And when you must choose between reducing entry frequency and reducing dwell time, reduce entry frequency first, because dwell time is conditional on entry."
          },
          awards: ["variety-audit", "budget-under-fire"],
          glossary: ["phishing-resistant-auth", "token-binding", "standing-privilege", "just-in-time-access", "assurance-illusion"]
        },
        {
          id: "ch-foundations-council-control-request",
          kind: "council",
          title: "Council: The Executive Who Has Already Chosen the Product",
          statement: "When an executive brings you a control, they are usually bringing you a fear; answer the fear or you will be arguing forever.",
          minutes: 26,
          respect: 145,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The situation, which will happen to you within your first year",
              body: "A senior executive — often the CFO, sometimes a board member's proxy, occasionally the CEO after a conference — arrives with a specific product they want deployed. They have a demo, a peer reference, and a timeline. The product is not a bad product. It is simply at leverage point 12 on a layer where you already have coverage, and deploying it will consume a quarter of your team's capacity. Refusing on technical grounds will fail, because their belief was not formed on technical grounds. Accepting will cost you the year."
            },
            {
              kind: "numbered",
              title: "The move, in sequence",
              items: [
                "Name the fear out loud before discussing the product. Say what you believe they are worried about and ask if you have it right. Almost always the answer is a specific scenario — appearing negligent, a peer's public incident, a regulator question they could not answer",
                "Agree with the fear explicitly and without qualification. Do not defend the current program in the same breath; that reads as dismissal and is the most common unforced error in this conversation",
                "Convert the fear into a question the organisation can answer with evidence. Not would this product help, but what would have to be true for that scenario to happen here, and can we currently see it",
                "Bring the variety table. Show the entry paths, show which have a count of one, and show where their proposed product sits. Do not editorialise; the table does the work",
                "Offer a real alternative with a date, not a deferral. The sentence that closes this is a commitment to a specific mechanism on a specific path by a specific quarter",
                "Give them something to carry. Executives who bring a proposal need to leave with a win. Let the win be the measurement — an unannounced validation of the layer they were worried about, with results reported to them directly"
              ]
            },
            {
              kind: "compare",
              title: "Two ways this conversation ends",
              left: {
                title: "What loses the room",
                items: [
                  "Leading with the technical objection to the product",
                  "Citing your framework maturity score as evidence you are covered",
                  "Saying we already have that, which the executive hears as we already dismissed your concern",
                  "Agreeing to a proof of concept you intend to let die quietly, which costs the same capacity and adds a broken promise",
                  "Escalating to the CEO to have the request overruled, which wins once and costs you the relationship permanently"
                ]
              },
              right: {
                title: "What holds the room",
                items: [
                  "Stating their scenario back to them more precisely than they stated it",
                  "Showing an honest gap somewhere else, which buys enormous credibility because it is costly to say",
                  "Bringing evidence about your own coverage that you generated rather than a vendor generated",
                  "Naming what you will stop doing if you take this on — capacity is finite and executives respect an explicit trade far more than a vague yes",
                  "Committing to a measurement they can check without you"
                ]
              }
            },
            {
              kind: "callout",
              title: "The line that works, and why",
              body: "Something close to: I think you are worried that if we were hit the way that peer was hit, we would not have seen it coming, and I share that worry. Here is what we can see today on that path and here is what we cannot. This product covers the part we can already see. Give me the same money against the part we cannot, and I will bring you an unannounced test of both in ninety days. This works because it accepts the premise, refuses only the instrument, offers a substitute with a date, and hands the executive an independent verification they can quote upward. You have converted a purchasing argument into a shared measurement commitment."
            },
            {
              kind: "principle",
              title: "Never win by refusing",
              body: "A CISO who becomes known for saying no acquires a reputation as an obstacle, and obstacles get routed around rather than argued with. The routing is invisible and it is fatal — it is how shadow IT, unreviewed acquisitions, and unapproved integrations happen. Win by substituting, by measuring, and by trading explicitly. Reserve the outright no for the small number of things that are genuinely unsafe, and spend the credibility you saved on those."
            },
            {
              kind: "list",
              title: "Prepare these three artifacts before you ever need them",
              items: [
                "A one-page variety table for your top eight entry paths, current within a quarter, that you can put on a screen in ten seconds",
                "An honest coverage figure for your two most-cited controls, with an independent denominator, so that you are never quoting a vendor console back to an executive",
                "A standing list of the three things you would fund next and what each one buys, so that when unexpected money appears you are not improvising in a room where improvisation is read as absence of a plan"
              ]
            }
          ],
          awards: ["room-held", "substitute-not-refuse"],
          glossary: ["risk-appetite", "unannounced-validation", "shadow-it", "capacity-trade"]
        }
      ]
    },
    {
      id: "ch-foundations-p3-threatmodel",
      title: "Threat Models That Survive Contact",
      credential: "Certified Threat Modeling Practitioner — Deployment Grade",
      summary: "Most threat models are wrong in the same way: they model the diagram rather than the deployment. This Page teaches the four-question frame, STRIDE applied to real trust boundaries rather than to boxes, attack trees and PASTA and the question each is actually built to answer, and LINDDUN for the privacy threats that no security methodology will surface for you. It ends with a live model against a running system and the deployment artifacts that prove where the boundary really is.",
      competencies: [
        "Run the four-question frame on any system and produce decisions rather than a document",
        "Apply STRIDE per element and per interaction without generating a hundred worthless findings",
        "Build an attack tree with costs attached and read the cheapest path off it",
        "Choose between STRIDE, attack trees, PASTA, and LINDDUN based on the question being asked",
        "Surface privacy threats using the seven LINDDUN categories against a real data flow",
        "Locate trust boundaries from deployed configuration rather than from an architecture drawing",
        "Recognise and interrupt the four Threat Modeling Manifesto anti-patterns in a live session"
      ],
      seal: "GROUND-III",
      steps: [
        {
          id: "ch-foundations-four-questions",
          kind: "construct",
          title: "The Four Questions",
          statement: "Threat modeling is not a methodology, it is four questions, and the methodologies are only ways of answering the second one.",
          minutes: 20,
          respect: 65,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The frame",
              body: "Adam Shostack's four questions are: what are we working on, what can go wrong, what are we going to do about it, and did we do a good job. The Threat Modeling Manifesto adopted them as the organising frame precisely because they are method-agnostic. Note the ordering. The first question comes first because it is answerable — an engineering team can describe what they are building. Approaches that begin with the adversary or with assets tend to stall, because a team that has never done this cannot enumerate attackers or agree on asset value in a first session, and a stalled first session usually means there is no second one."
            },
            {
              kind: "numbered",
              title: "What each question is really asking",
              items: [
                "What are we working on — scope, components, data, dependencies, and above all where the trust boundaries are. If this takes more than a third of the session you are drawing, not modeling",
                "What can go wrong — the generative step. STRIDE, attack trees, LINDDUN, kill chains and ATT&CK are all just structured ways to be systematically imaginative here",
                "What are we going to do about it — mitigate, eliminate, transfer, or accept, each with a named owner and a ticket. A threat with no disposition is a threat you have documented rather than addressed",
                "Did we do a good job — the question everyone skips, and the only one that makes the practice improve. Did the model predict the finding that the pentest later found. Did the mitigation ship. Did the assumption hold"
              ]
            },
            {
              kind: "principle",
              title: "The output is decisions, not documents",
              body: "A threat model whose artifact is a document that nobody reads has failed even if every threat in it is correct. The measurable output of a good session is a small number of design changes merged, tests added, and assumptions written down where they can later be falsified. If your session produces a spreadsheet and no pull requests, you ran a workshop, not a threat model."
            },
            {
              kind: "list",
              title: "The manifesto's four anti-patterns, and how each one shows up in a real room",
              items: [
                "Hero Threat Modeler — one security person does the modeling and hands it over. The team learns nothing, the model expires the moment the design changes, and you have created a permanent dependency on yourself",
                "Admiration for the Problem — the room spends fifty minutes enumerating increasingly baroque attacks and ten minutes on what to do. Enjoyable, useless. Time-box the generative phase explicitly",
                "Tendency to Overfocus — everyone piles onto the one threat category the loudest person is expert in, usually crypto or injection, while entire trust boundaries go unexamined",
                "Perfect Representation — the session stalls arguing about whether the diagram is accurate. The diagram never will be. Get to good enough and move, then correct it from deployment artifacts afterward"
              ]
            },
            {
              kind: "callout",
              title: "The manifesto values, and the one that costs the most to honour",
              body: "The manifesto prefers a culture of finding and fixing design issues over checkbox compliance; people and collaboration over processes and tools; a journey of understanding over a snapshot; doing threat modeling over talking about it; continuous refinement over a single delivery. The expensive one is continuous refinement. A single delivery is fundable, schedulable, and auditable. Continuous refinement requires the model to be attached to the design process itself, which means it has to live in the repository next to the code and change when the code changes. Every organisation says it wants the first four values and then funds a single delivery."
            }
          ],
          awards: ["four-questions"],
          glossary: ["threat-model", "trust-boundary", "hero-threat-modeler", "design-decision"]
        },
        {
          id: "ch-foundations-stride",
          kind: "lesson",
          title: "STRIDE Applied to Boundaries, Not Boxes",
          statement: "STRIDE is a checklist against security properties, and it only works when you point it at an interaction rather than at a component.",
          minutes: 30,
          respect: 125,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "What STRIDE actually is",
              body: "STRIDE is a mnemonic for six threat classes, each the violation of a desirable property. Spoofing violates authenticity. Tampering violates integrity. Repudiation violates non-repudiation. Information disclosure violates confidentiality. Denial of service violates availability. Elevation of privilege violates authorisation. Its power is that it converts a blank page into six specific prompts. Its weakness is that applied carelessly it produces six threats per box on a diagram, most of them meaningless, and a team that concludes threat modeling is bureaucracy."
            },
            {
              kind: "table",
              title: "STRIDE, the property violated, and the question that makes it productive",
              headers: ["Threat", "Property violated", "The question to ask at a boundary", "Typical mitigation family"],
              rows: [
                ["Spoofing", "Authenticity", "Who is on the other side of this call, and what evidence do we have that is not replayable", "Cryptographic identity, mutual TLS, workload identity, phishing-resistant authenticators"],
                ["Tampering", "Integrity", "What could an attacker change in transit or at rest here, and would we ever know", "Signing, MACs, provenance attestation, immutable storage, integrity monitoring"],
                ["Repudiation", "Non-repudiation", "If someone denies doing this, what do we have, and who controls that evidence", "Append-only logs held outside the actor's control, signed audit trails"],
                ["Information disclosure", "Confidentiality", "What data crosses here, who can observe it, and what does it become when combined with data elsewhere", "Encryption, minimisation, tokenisation, scoping of the credential itself"],
                ["Denial of service", "Availability", "What is the cheapest input that costs us the most work", "Quotas, rate limits, admission control, load shedding, cost caps"],
                ["Elevation of privilege", "Authorisation", "What does this component get to do that it should not need, and who granted it", "Least privilege, capability scoping, policy enforcement at the resource, not at the caller"]
              ]
            },
            {
              kind: "principle",
              title: "Point it at the flow",
              body: "Applying STRIDE per element gives you a mechanical inventory. Applying it per interaction across a trust boundary gives you real findings, because threats live in the relationship between two components with different levels of trust, not inside a rectangle. If a data flow does not cross a boundary, most STRIDE categories against it are noise."
            },
            {
              kind: "callout",
              title: "Where the real boundary is, and why the diagram never shows it",
              body: "Architecture diagrams draw boundaries at network edges because network edges are what diagrams have always shown. In a modern deployment the boundary is wherever a credential changes hands. A service mesh sidecar holds a workload identity; a CI runner holds a deployment credential; a third-party integration holds an OAuth token with a scope nobody has read since it was granted. Every one of those is a trust boundary, and none of them appear on the drawing. The fastest way to find the real boundaries is to enumerate every credential in the system and ask what each one can do if it leaves."
            },
            {
              kind: "compare",
              title: "The same system, modeled two ways",
              left: {
                title: "STRIDE on the diagram",
                items: [
                  "Six threats against the API gateway box",
                  "Six threats against the service box",
                  "Six threats against the database box",
                  "Eighteen findings, roughly three of which are actionable",
                  "Team concludes the exercise is compliance theatre and does not book a second session"
                ]
              },
              right: {
                title: "STRIDE on the boundaries",
                items: [
                  "The gateway-to-service hop: what identity does the service see, and can it be forged from inside the cluster",
                  "The service-to-database hop: is the credential scoped to this service or shared across the namespace",
                  "The CI-to-cluster hop: what can the deploy credential do, and who can trigger a deploy",
                  "The third-party-to-CRM hop: what is the token's scope and lifetime, and would we see it used at three in the morning",
                  "Four findings, all actionable, two of which become merged pull requests that week"
                ]
              }
            },
            {
              kind: "checklist",
              title: "Session discipline that keeps STRIDE useful",
              items: [
                "Enumerate credentials before you enumerate components",
                "Draw the boundary wherever a credential changes hands or a trust level changes",
                "Run STRIDE per boundary crossing, not per box",
                "Time-box the generation phase to half the session and enforce it out loud",
                "Every threat leaves the room with a disposition and an owner, or it does not leave the room",
                "Record assumptions separately and explicitly, because assumptions are what the next incident will falsify"
              ]
            }
          ],
          awards: ["stride-on-boundaries"],
          glossary: ["stride", "trust-boundary", "data-flow-diagram", "workload-identity", "least-privilege"]
        },
        {
          id: "ch-foundations-attack-trees-pasta",
          kind: "lesson",
          title: "Attack Trees, PASTA, and Choosing the Right Instrument",
          statement: "Different methods answer different questions, and using the wrong one produces an impeccable answer to something nobody asked.",
          minutes: 34,
          respect: 165,
          trust: 8,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Attack trees: cost as the organising principle",
              body: "An attack tree puts an adversary goal at the root and decomposes it into subgoals joined by AND and OR nodes. The value is not the tree; it is what you annotate the leaves with. Attach cost, required capability, detectability, and legality to each leaf, propagate upward — OR nodes take the minimum cost, AND nodes take the sum — and the tree tells you the cheapest path to the goal. That is the path a rational adversary takes, and it is very frequently not the path your controls are concentrated on. Attack trees are the right instrument when you need to compare defensive options against a single high-consequence outcome."
            },
            {
              kind: "code",
              title: "An attack tree in plain YAML, with costs that propagate",
              lang: "yaml",
              body: "goal: Exfiltrate the full customer table\nop: OR\nchildren:\n  - name: Compromise a database credential\n    op: OR\n    children:\n      - name: Steal from CI secret store\n        cost_usd: 15000\n        capability: intermediate\n        detect_prob: 0.35\n      - name: Steal from a developer laptop\n        cost_usd: 8000\n        capability: commodity\n        detect_prob: 0.55\n      - name: Read from an over-permissive service account\n        cost_usd: 2000\n        capability: commodity\n        detect_prob: 0.10\n\n  - name: Abuse an existing legitimate export path\n    op: AND\n    children:\n      - name: Obtain support-tool access\n        cost_usd: 6000\n        capability: commodity\n        detect_prob: 0.25\n      - name: Defeat the export volume threshold\n        cost_usd: 1000\n        capability: commodity\n        detect_prob: 0.40\n\n  - name: Exploit the database directly from the internet\n    op: AND\n    children:\n      - name: Find an exposed instance\n        cost_usd: 500\n        capability: commodity\n        detect_prob: 0.05\n      - name: Working exploit for the running version\n        cost_usd: 250000\n        capability: state\n        detect_prob: 0.60\n\n# OR takes the minimum, AND takes the sum.\n# Cheapest path: over-permissive service account, 2000 dollars,\n# commodity capability, 10 percent chance of being noticed.\n# Note where your budget currently sits.\n"
            },
            {
              kind: "prose",
              title: "PASTA: risk-centric, seven stages, expensive and sometimes correct",
              body: "The Process for Attack Simulation and Threat Analysis is a seven-stage, risk-centric methodology: define business objectives, define the technical scope, decompose the application, analyse threats, analyse vulnerabilities, model attacks, and analyse risk and impact. It is heavyweight by design. Its distinguishing feature is that it starts from business objectives and ends at business impact, which makes its output legible to people who control budgets. Use it when the question is whether to build something at all, or when a regulator or an acquirer needs a defensible, traceable analysis. Do not use it for a two-week feature; you will spend more on the analysis than on the feature, and the team will never agree to another one."
            },
            {
              kind: "table",
              title: "Choosing the instrument",
              headers: ["Question you are actually asking", "Right method", "Wrong method and what goes wrong"],
              rows: [
                ["What could go wrong with this design change", "STRIDE per boundary", "PASTA — seven stages for a two-week change kills the practice"],
                ["Which of these three defensive investments buys the most against our worst outcome", "Attack tree with costs on the leaves", "STRIDE — enumerates threats but gives you no basis for comparing spend"],
                ["Should we build this product line at all, given the risk", "PASTA", "Attack tree — great on one goal, silent on business objectives"],
                ["What happens to individuals if this data is misused, even by us", "LINDDUN", "STRIDE — has no category for a system that works exactly as designed and still harms someone"],
                ["Where would a real intrusion have been stopped", "Kill chain plus ATT&CK mapping", "Any design-time method — these are operational questions about a real campaign"],
                ["Is this control actually working right now", "Purple team and control validation", "All of the above — no design-time method answers a present-tense question"]
              ]
            },
            {
              kind: "principle",
              title: "Annotate or do not bother",
              body: "An unannotated attack tree is a pretty picture that confirms what the room already believed. The entire analytic value is in the leaf annotations and the propagation rule. If you cannot get cost estimates, use ordinal capability tiers — commodity, criminal, state — and propagate those instead. Even a crude annotation reorders priorities, which is the point."
            },
            {
              kind: "callout",
              title: "The second-order effect of cost-annotated trees",
              body: "Once a team sees that the cheapest path to the crown jewel costs two thousand dollars and runs through a service account nobody owns, the conversation stops being about security maturity and starts being about that service account. Cost annotation is a rhetorical device as much as an analytic one: it makes the asymmetry visceral. The risk is that people treat your estimates as precise. State them as ranges and say out loud that the ordering is the finding, not the numbers."
            }
          ],
          awards: ["attack-tree-annotated", "right-instrument"],
          glossary: ["attack-tree", "pasta", "and-or-decomposition", "adversary-cost", "crown-jewel"]
        },
        {
          id: "ch-foundations-lab-linddun",
          kind: "lab",
          title: "Lab: LINDDUN Against a Real Data Flow",
          statement: "Security threat modeling asks what an attacker could do to the system; privacy threat modeling asks what the system does to a person when it is working perfectly.",
          minutes: 38,
          respect: 180,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Why STRIDE cannot find these",
              body: "STRIDE is a taxonomy of violations of system properties. Every one of its six categories assumes something went wrong. Privacy harms frequently occur when nothing goes wrong: the data was collected lawfully, stored correctly, transmitted over TLS, and accessed by an authorised employee, and a person was still identified, profiled, or exposed. LINDDUN, developed at KU Leuven and referenced by the NIST Privacy Framework, supplies the missing taxonomy. Its 2024 knowledge-base update names seven categories: Linking, Identifying, Non-repudiation, Detecting, Data Disclosure, Unawareness, and Non-compliance."
            },
            {
              kind: "table",
              title: "The seven categories, with the question each one forces",
              headers: ["Category", "The threat", "The question to ask of your own system"],
              rows: [
                ["Linking", "Two records about the same person can be associated", "What joins across our datasets, including via a timestamp, a device id, or a coarse location, that we never intended to be a join key"],
                ["Identifying", "A person can be picked out of a set", "What is the smallest combination of fields in our supposedly anonymous export that is unique for most people in it"],
                ["Non-repudiation", "A person cannot plausibly deny an action", "Where have we created undeniable evidence about a person that they did not ask for and cannot remove — and who could subpoena it"],
                ["Detecting", "The mere existence of a record can be inferred", "Can an outsider tell whether someone is in our system from a response time, an error message, or a password reset flow"],
                ["Data Disclosure", "More data is exposed than necessary, to more parties than necessary", "Which downstream consumer receives fields it has never used, and which of our logs contain a payload nobody minimised"],
                ["Unawareness", "People do not know or cannot intervene in what happens to their data", "Could a competent user discover what we hold and cause it to change or stop, without contacting support"],
                ["Non-compliance", "Processing violates policy, regulation, or the stated purpose", "Where does actual processing diverge from the record of processing activities, and how would we ever notice"]
              ]
            },
            {
              kind: "code",
              title: "flows.yaml — the inventory the session runs against",
              lang: "yaml",
              body: "# Generate this from configuration, not from memory. Every entry must be\n# traceable to a schema, a pipeline definition, or an integration config.\n\nsystem: appointment-reminders\n\nsubjects:\n  - patients\n  - clinicians\n\ndata_elements:\n  - id: patient_id\n    kind: pseudonymous_identifier\n    stable: true\n    shared_with: [reminder_service, analytics_warehouse, sms_vendor]\n  - id: mobile_number\n    kind: direct_identifier\n    stable: true\n    shared_with: [reminder_service, sms_vendor]\n  - id: appointment_time\n    kind: event_timestamp\n    precision: minute\n    shared_with: [reminder_service, analytics_warehouse, sms_vendor]\n  - id: clinic_id\n    kind: quasi_identifier\n    note: 'oncology clinics are separately identifiable by clinic_id'\n    shared_with: [reminder_service, analytics_warehouse, sms_vendor]\n  - id: device_advertising_id\n    kind: quasi_identifier\n    source: mobile_app_sdk\n    shared_with: [analytics_warehouse, product_analytics_vendor]\n\nretention:\n  reminder_service: 30 days\n  analytics_warehouse: 7 years\n  sms_vendor: undefined\n  product_analytics_vendor: undefined\n\nsubject_controls:\n  opt_out_of_reminders: true\n  opt_out_of_analytics: false\n  self_service_deletion: false\n"
            },
            {
              kind: "code",
              title: "kanon.py — find the identifying combinations before someone else does",
              lang: "python",
              body: "import csv\nimport itertools\nfrom collections import Counter\n\n# Run this over any export you believe is anonymous. It reports the\n# smallest field combinations that isolate individuals.\n\nQUASI = ['clinic_id', 'appointment_time_hour', 'age_band', 'postcode_sector']\nPATH = 'export.csv'\n\nwith open(PATH, newline='') as fh:\n    rows = list(csv.DictReader(fh))\n\nprint('records:', len(rows))\nfor size in range(1, len(QUASI) + 1):\n    for combo in itertools.combinations(QUASI, size):\n        counts = Counter(tuple(r[c] for c in combo) for r in rows)\n        singletons = sum(1 for v in counts.values() if v == 1)\n        k_min = min(counts.values())\n        pct = 100.0 * singletons / len(rows)\n        flag = '  <-- IDENTIFYING' if pct > 5 else ''\n        print(str(size), ' + '.join(combo).ljust(58),\n              'k=' + str(k_min).rjust(4),\n              'unique=' + (str(round(pct, 1)) + '%').rjust(7),\n              flag)\n"
            },
            {
              kind: "numbered",
              title: "Procedure for a ninety-minute LINDDUN session",
              items: [
                "Generate flows.yaml from real configuration — schemas, pipeline definitions, integration scopes — not from what the team believes is true",
                "Walk each data element across each recipient and apply the seven categories in order, one pass, no debate about severity yet",
                "Run the k-anonymity script over any export claimed to be anonymised, and put the output on the screen; the room's assumptions usually die in that moment",
                "Mark every recipient whose retention is listed as undefined; undefined retention is a finding on its own and is extremely common with vendors",
                "For Unawareness, actually attempt the subject journey — try to find out what the system holds about you as a user would, and time it",
                "Close with dispositions: minimise at source, shorten retention, remove a field from a downstream contract, add a subject control, or accept with a named owner and a review date"
              ]
            },
            {
              kind: "callout",
              title: "The finding that recurs in almost every session",
              body: "A quasi-identifier that nobody classified as personal data — a device advertising id, a coarse timestamp, a clinic or branch code — turns out to make an otherwise pseudonymous dataset re-identifying when joined with something the organisation also holds. This is the Linking category doing its work, and it is the single most valuable output of privacy threat modeling, because no security control anywhere in your estate would ever have surfaced it. Note also the ethical dimension: the clinic_id field in the example above leaks a health inference for anyone attending a specialist clinic, and it does so while every system behaves exactly as specified."
            },
            {
              kind: "principle",
              title: "Undefined is a finding",
              body: "Undefined retention, undefined recipient scope, and undefined subject control are not gaps in documentation. They are statements that no one is enforcing a limit, which means the limit is whatever the system happens to do. Treat every undefined as a live finding with an owner, not as an action item to go and write something down."
            }
          ],
          praxis: "Run a LINDDUN pass on one real data flow in a system you own, with the inventory generated from configuration and the k-anonymity script run against a real export.",
          evidence: "The generated flows inventory, the k-anonymity output showing the smallest identifying combination, and at least two dispositions merged as code or contract changes.",
          awards: ["linddun-pass", "quasi-identifier-found"],
          glossary: ["linddun", "quasi-identifier", "k-anonymity", "data-minimisation", "linkability"]
        },
        {
          id: "ch-foundations-drill-diagram-lied",
          kind: "drill",
          title: "Drill: The Diagram Lied",
          statement: "A threat model of the architecture you intended is a threat model of a system that does not exist.",
          minutes: 22,
          respect: 155,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Setting",
              body: "Design review, forty-five minutes, six engineers and a product manager in the room. A team is presenting a threat model for a new customer-facing service before it goes live in eleven days. The model is genuinely competent: STRIDE applied per element, twenty-two threats enumerated, sixteen with mitigations, six risk-accepted with reasons. The diagram shows a single trust boundary at the API gateway, with everything behind it drawn as internal. You spent forty minutes last night reading their infrastructure repository. The deploy pipeline uses a shared CI service account with write access to three environments. The service pulls its database credential from a namespace-wide secret that four other services also mount. There is an egress path to a third-party enrichment API that appears nowhere on the diagram."
            },
            {
              kind: "list",
              title: "What is true in the room",
              items: [
                "The team did more threat modeling work than any other team at the company this quarter",
                "Their manager is in the room and is proud of them",
                "Ship date is eleven days out and has been announced to customers",
                "You are the only person present who has read the deployment configuration",
                "If you humiliate this team, no other team will bring you a threat model again"
              ]
            }
          ],
          drill: {
            id: "ch-foundations-drill-diagram-lied-d",
            scene: "A competent STRIDE threat model is being presented for a service shipping in eleven days. The diagram shows one trust boundary. The deployment has at least three the diagram does not show, including a namespace-wide database secret shared with four services and an undocumented third-party egress path.",
            clock: "45 minute review, 11 days to ship",
            pressure: "The team is proud, their manager is present, and the ship date is public. You are the only one who has read the infrastructure repository.",
            prompt: "How do you run the next thirty minutes?",
            options: [
              {
                id: "ch-foundations-drill-diagram-lied-o1",
                label: "Approve with conditions, log the three deployment gaps as accepted risks with a post-launch remediation date",
                detail: "The team did good work, the date is public, and you have documented the exposure.",
                score: -1,
                outcome: "The service ships. Post-launch remediation slips twice behind feature work, which is what post-launch remediation does. The namespace-wide secret is still shared eighteen months later, and by then two more services mount it.",
                ripple: "You have taught the organisation that a threat model is an approval gate you can pass with documentation rather than a design process. Risk acceptance used this way is not a decision; it is a way of converting an engineering problem into a paperwork problem, and the paperwork will be quoted back at you during the incident.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-diagram-lied-o2",
                label: "Reject the model, explain that the trust boundaries are wrong, and require the team to complete formal threat modeling training before resubmitting",
                detail: "The gap is fundamental and the team clearly needs the grounding.",
                score: -2,
                outcome: "The ship date slips, the team is publicly embarrassed, and the model is resubmitted three weeks later with the same single boundary because training did not tell them to read their own Terraform either.",
                ripple: "You have produced the Hero Threat Modeler anti-pattern in its most damaging form — the security function as the authority who judges rather than the partner who models. The next four teams will do the minimum required to pass you, and you will lose the only channel you had into design decisions.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-diagram-lied-o3",
                label: "Put the infrastructure repository on the screen and re-derive the boundaries live with the team, by enumerating credentials rather than components",
                detail: "Ask one question — where does a credential change hands — and let the deployment answer it. Then rerun STRIDE on the boundaries that appear.",
                score: 3,
                outcome: "Within fifteen minutes the room finds the namespace-wide secret themselves, and an engineer volunteers that they had wondered about it. Three new boundaries appear. Two of the twenty-two original threats become irrelevant and four new ones appear, of which two are serious. The team leaves with two pull requests scoped, not a document.",
                ripple: "You taught a transferable method rather than delivering a verdict, so the next model this team brings you will already be derived from deployment. Because the finding came from the team rather than from you, the manager's pride survives intact and the ship date conversation becomes a joint engineering trade rather than a security veto. The credential-enumeration technique spreads to two other teams within a quarter, entirely without your involvement.",
                isBest: true
              },
              {
                id: "ch-foundations-drill-diagram-lied-o4",
                label: "Accept the model for this review and commission an external threat modeling consultancy to build an authoritative model of the full platform",
                detail: "The gap is bigger than this one service and deserves proper treatment.",
                score: -1,
                outcome: "A high-quality one-hundred-page model arrives in fourteen weeks describing a platform that has changed substantially since the engagement began. It is read carefully by two people and cited by nobody in a design review.",
                ripple: "You spent real money to produce a snapshot in a domain where the manifesto's core value is a journey of understanding over a snapshot. Worse, the existence of the external model becomes a reason for teams not to build the muscle themselves, which is the Hero anti-pattern outsourced and paid for.",
                isBest: false
              }
            ],
            debrief: "The teaching device here is that the wrong answers are all defensible and one of them is what most organisations actually do. Option one is the standard corporate outcome and it is subtly corrosive, because it converts a design problem into an accepted-risk record and thereby removes the pressure that would have fixed it. Option two is technically correct about the deficiency and destroys the relationship that makes future modeling possible. Option four buys quality and loses continuity. Option three works because it changes the method rather than the verdict: enumerating credentials rather than components is the single highest-yield technique in deployment-grade threat modeling, because in a modern system the trust boundary is wherever a credential changes hands, and credentials are enumerable from configuration while trust levels are not. Note the social engineering in the best answer too — putting the repository on the screen and asking the room a question makes the team the discoverer of their own gap, which is the only version of this finding that survives contact with the ship date.",
            principle: "Derive trust boundaries from deployed configuration by enumerating credentials, never from the architecture drawing. And when you find a gap, arrange for the team to find it rather than to be told it."
          },
          awards: ["boundary-from-deployment", "taught-not-told"],
          glossary: ["trust-boundary", "risk-acceptance", "credential-enumeration", "namespace-secret", "hero-threat-modeler"]
        },
        {
          id: "ch-foundations-field-live-model",
          kind: "field",
          title: "Field: Model a System You Actually Operate",
          statement: "You have not threat modeled until a design changed because of it.",
          minutes: 40,
          respect: 200,
          trust: 12,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The assignment",
              body: "Choose one real system you have access to and some responsibility for. It can be small — a personal project with a database and an API, an internal tool at work, a home lab with an authenticated service. Size does not matter; reality does. You will run the four questions against it, derive boundaries from deployment rather than from your memory of the design, apply STRIDE per boundary, and ship at least two changes. Then you will answer the fourth question honestly, in writing, which is the part almost nobody does."
            },
            {
              kind: "numbered",
              title: "Sequence",
              items: [
                "Enumerate every credential the system possesses or accepts: API keys, database credentials, OAuth tokens, deploy keys, service accounts, session cookies, signing keys. For each, write what it can do and how long it lives",
                "Draw the boundaries where those credentials change hands. Compare this drawing with whatever architecture diagram exists. Photograph both",
                "Apply STRIDE to each boundary crossing. Time-box generation to forty-five minutes and stop when the timer goes, even mid-thought",
                "Rank findings by adversary cost, not by CVSS-style severity. Build a small annotated attack tree for your single worst outcome",
                "Ship at least two changes. Scope a credential down, shorten a token lifetime, split a shared secret, add an egress restriction, remove a field from a log",
                "Write the assumptions you are relying on as falsifiable statements — for example, only the CI runner can read this secret — and define how you would detect each one becoming false",
                "Return in thirty days and answer question four: did the model predict anything real, did the changes hold, which assumption already broke"
              ]
            },
            {
              kind: "checklist",
              title: "Quality bar for the submitted model",
              items: [
                "Credential inventory is derived from configuration, and each entry names the source file or console it came from",
                "At least one boundary exists that the original diagram did not show",
                "Every threat has a disposition and a named owner, including the accepted ones",
                "At least two changes are merged, with links",
                "At least three assumptions are stated as falsifiable claims with a detection method attached",
                "The thirty-day follow-up exists and says something that was not known on day one"
              ]
            },
            {
              kind: "callout",
              title: "The most common way this assignment is failed",
              body: "Learners produce a beautiful model and zero merged changes, because the modeling is intellectually satisfying and the changes are tedious. This is Admiration for the Problem, and it is the specific anti-pattern this field step exists to burn out of you. If you are running short on time, cut the enumeration in half and ship the changes. A partial model that altered a system beats a complete model that altered nothing, every time, without exception."
            },
            {
              kind: "principle",
              title: "The falsifiable assumption is the durable artifact",
              body: "Threats age quickly; architectures change; findings get fixed or forgotten. Assumptions written as falsifiable statements with a detection method attached outlive all of it, because they convert a moment of understanding into a standing monitor. Ten years from now the only part of your first threat model still doing work will be the assumptions you made checkable."
            }
          ],
          praxis: "Run a full four-question threat model against a live system you operate, deriving boundaries from credentials, and merge at least two changes.",
          evidence: "Credential inventory with sources, both boundary drawings side by side, the STRIDE-per-boundary findings with dispositions and owners, links to two merged changes, three falsifiable assumptions with detection methods, and a dated thirty-day review answering question four.",
          awards: ["first-real-model", "assumption-ledger", "two-changes-shipped"],
          glossary: ["falsifiable-assumption", "credential-inventory", "disposition", "admiration-for-the-problem"]
        }
      ]
    },
    {
      id: "ch-foundations-p4-adversary",
      title: "Adversary Theory",
      credential: "Certified in Adversary Reasoning and Threat-Informed Defense",
      summary: "There is a person on the other side with a budget, a deadline, a manager, and a preference for the cheapest thing that works. This Page replaces the abstraction called the threat with an economic actor. You will learn what the kill chain paper actually argued, how ATT&CK differs from it and why both are needed, how to place every detection you own on the Pyramid of Pain without flattering yourself, why commodity, criminal, and state adversaries require genuinely different defences, and how to build a detection portfolio that costs an adversary something.",
      competencies: [
        "Explain the intrusion kill chain's actual thesis and its limits as an operational model",
        "Map an intrusion to ATT&CK tactics and techniques accurately, including the current fifteen-tactic Enterprise structure",
        "Grade every detection you own by Summiting the Pyramid level and observable location",
        "Reason about adversary cost and choose detections that impose it",
        "Differentiate commodity, criminal, and state adversary economics and defend accordingly",
        "Build and validate a detection portfolio rather than consuming an indicator feed"
      ],
      seal: "GROUND-IV",
      steps: [
        {
          id: "ch-foundations-killchain-attack",
          kind: "lesson",
          title: "The Kill Chain Argument, and What ATT&CK Added",
          statement: "The kill chain's contribution was never the seven boxes; it was the claim that a defender gets many chances against one campaign.",
          minutes: 28,
          respect: 110,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "What Hutchins, Cloppert and Amin actually said",
              body: "The 2011 Lockheed Martin paper is quoted constantly and read rarely. Its thesis is not that intrusions have seven phases. Its thesis is that an intrusion is a chain, that the adversary must succeed at every link while the defender need only break one, and that because advanced adversaries run repeated campaigns with reused tradecraft, each intrusion attempt leaks intelligence that improves the defender's position on the next one. The paper's real innovation is the courses-of-action matrix — detect, deny, disrupt, degrade, deceive, destroy, applied across each phase — which turns intelligence into a defensive plan rather than a report."
            },
            {
              kind: "timeline",
              title: "The seven phases, with the defensive question each raises",
              items: [
                "Reconnaissance — what does our external surface tell an adversary for free, and would we ever see them looking",
                "Weaponisation — happens entirely on their infrastructure; you cannot detect it, which is precisely why the phase is instructive about the limits of the model",
                "Delivery — the phase where most commodity intrusions are stopped, and the phase with the richest telemetry",
                "Exploitation — mitigations here are architectural and long-lead, but they are the ones that survive novelty",
                "Installation — persistence is where an adversary must touch something durable, and durable things can be baselined",
                "Command and control — the choke point that once made egress control the highest-value control in the enterprise",
                "Actions on objectives — by definition the most expensive place to catch someone, and the place where most organisations actually do"
              ]
            },
            {
              kind: "compare",
              title: "Kill chain versus ATT&CK",
              left: {
                title: "Intrusion kill chain",
                items: [
                  "Linear and campaign-shaped; excellent for narrative and for briefing non-specialists",
                  "Built around a perimeter-crossing intrusion, which fits 2011 better than it fits a cloud tenant",
                  "Strong on the courses-of-action framing, which ATT&CK does not replace",
                  "Weak once the adversary is inside and behaving non-linearly, which is the majority of dwell time",
                  "Says nothing about how a technique is actually performed"
                ]
              },
              right: {
                title: "MITRE ATT&CK",
                items: [
                  "A behavioural knowledge base rather than a sequence; techniques recur across phases and loop",
                  "Enterprise, Mobile, and ICS matrices, grounded in observed real-world behaviour",
                  "Currently fifteen Enterprise tactic columns — note that Defense Evasion has been split into Stealth and Defense Impairment; a coverage map that still shows fourteen is out of date",
                  "As of v18 in October 2025, per-technique Detections were replaced by Detection Strategies, which changes how coverage should be claimed",
                  "Weak as a narrative device; a board does not want a matrix"
                ]
              }
            },
            {
              kind: "principle",
              title: "Use both, for different audiences and different work",
              body: "Use the kill chain to tell the story of an intrusion to executives and to structure courses of action across a campaign. Use ATT&CK to do the engineering: to specify what a detection covers, to compare your coverage against a named adversary's known behaviour, and to give red and blue a shared vocabulary. Confusing the two produces board decks full of matrices, which nobody acts on, and detection backlogs full of narrative, which nobody can implement."
            },
            {
              kind: "callout",
              title: "The trap in coverage maps",
              body: "A heat map showing green across most of the ATT&CK matrix is almost always a lie, and it is usually an honest lie. Coverage is typically claimed at the technique level when the actual detection matches one procedure of one implementation — a specific command line, a specific file path. The adversary changes the path and the green square remains green. The next Step gives you the grading scheme that stops this. Also remember D3FEND as the other half of the picture: it organises countermeasures across Model, Harden, Detect, Isolate, Deceive, Evict, and Restore over an ontology of digital artifacts, which lets you argue about what a control actually touches instead of what category it was sold under."
            }
          ],
          awards: ["kill-chain-read"],
          glossary: ["intrusion-kill-chain", "courses-of-action-matrix", "attack-tactic", "attack-technique", "d3fend"]
        },
        {
          id: "ch-foundations-pyramid-of-pain",
          kind: "construct",
          title: "The Pyramid of Pain, Graded Honestly",
          statement: "Detection quality is measured in what it costs the adversary to evade, and almost every detection you own costs them minutes.",
          minutes: 26,
          respect: 105,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Bianco's economic argument",
              body: "David Bianco's Pyramid of Pain ranks indicator types by how much it hurts an adversary when you detect on them. Hash values sit at the bottom: recompiling changes the hash, cost measured in seconds. IP addresses next: rotating infrastructure is trivial and largely automated. Domain names cost a little more because of registration friction. Network and host artifacts cost more still. Tools cost weeks, because a new tool must be built or bought and then re-tested against defences. At the apex sit tactics, techniques and procedures — detecting those forces the adversary to change how they operate, retrain, and redesign their playbook. The pyramid is not a hierarchy of goodness; it is a price list."
            },
            {
              kind: "table",
              title: "The price list, with realistic evasion costs",
              headers: ["Level", "Indicator", "Adversary cost to evade", "What it is still good for"],
              rows: [
                ["1", "Hash values", "Seconds — recompile, pad, repack", "Retrospective hunting, attribution, blocking known commodity payloads at zero marginal cost"],
                ["2", "IP addresses", "Minutes — rotate hosts, use a CDN or a legitimate cloud front", "Retro-hunt over historical telemetry, correlation, and cheap perimeter hygiene"],
                ["3", "Domain names", "Hours to days — registration, aging, reputation", "Detecting infrastructure reuse across a campaign"],
                ["4", "Network and host artifacts", "Weeks — implies changing implant behaviour or protocol details", "Real detection value; this is where most decent SOC content lives"],
                ["5", "Tools", "Weeks to months — build, buy, or retool and retest", "High value; forces observable investment by the adversary"],
                ["6", "Tactics, techniques and procedures", "Months and organisational change — retrain operators, rewrite playbooks", "The only level that generalises across campaigns and actors"]
              ]
            },
            {
              kind: "prose",
              title: "Summiting the Pyramid: the grading scheme that stops self-deception",
              body: "The Center for Threat-Informed Defense extended the pyramid into a scoring method for individual analytics. A detection is scored from Level 1 to Level 5: Level 1 is ephemeral values; Level 2 is core to an adversary-brought tool or outside the boundary; Level 3 is core to a pre-existing tool or inside the boundary; Level 4 is core to some implementations of a technique; Level 5 is core to the technique or sub-technique itself. A second axis records where the observable comes from — Application, User-Mode, Kernel-Mode, Payload visibility, Header visibility — because an observable an adversary can forge from user-mode is weaker than the same observable sourced from the kernel."
            },
            {
              kind: "principle",
              title: "Score the analytic, not the technique",
              body: "Coverage claims should be made per analytic with a level attached, and a technique should only be called covered when at least one Level 4 or Level 5 analytic exists for it and has been validated. Everything else is retro-hunt material. A portfolio of two hundred Level 1 detections and four Level 5 detections is not ninety-eight percent covered; it has four detections and a large archive."
            },
            {
              kind: "callout",
              title: "The observable axis is where most people get surprised",
              body: "Two analytics can detect the same technique and differ enormously in robustness because of where they read. A process-creation event sourced from a user-mode hook can be evaded by an adversary who unhooks or who never traverses that code path; the same logical event sourced from a kernel callback is much harder to suppress without a louder, separately detectable action. This is why the modern ATT&CK release replaced flat Detections with Detection Strategies — the sensing location and the analytic logic are not separable questions."
            }
          ],
          awards: ["pyramid-graded"],
          glossary: ["pyramid-of-pain", "summiting-the-pyramid", "analytic-robustness", "ioc", "ttp"]
        },
        {
          id: "ch-foundations-adversary-classes",
          kind: "lesson",
          title: "Commodity, Criminal, State: Three Economies, Three Defences",
          statement: "You do not defend against attackers; you defend against business models, and the three models fail differently.",
          minutes: 32,
          respect: 160,
          trust: 8,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The distinction that matters is economic, not technical",
              body: "Commodity actors run a volume business. Their unit economics require automation and low per-target cost, which means they take whatever is cheap and abundant — exposed services, reused credentials, unpatched edge devices. Organised criminal groups run a margin business. They will spend real money and weeks of operator time on a target, because a successful extortion or fraud pays for many failures, and they specialise: initial access brokers sell to affiliates who sell to negotiators. State actors run a mission business. They have a requirement handed down, a budget that does not need to be recovered from the target, and patience measured in quarters. Each economy produces a different failure mode for defenders."
            },
            {
              kind: "table",
              title: "Three economies, compared on the dimensions that change your decisions",
              headers: ["Dimension", "Commodity", "Criminal", "State"],
              rows: [
                ["Target selection", "Opportunistic, scanned, indiscriminate", "Selected on ability to pay and on business disruption leverage", "Selected on intelligence requirement; you may be a stepping stone, not the goal"],
                ["Cost tolerance per target", "Cents to dollars", "Thousands to hundreds of thousands", "Effectively unbounded relative to your defences"],
                ["Zero-day usage", "Effectively never; they use what is public and unpatched", "Rare but increasing, usually purchased and aimed at edge devices with wide reach", "Routine, and Project Zero's tracker is a record of the ones that failed, not of the population"],
                ["Response to detection", "Moves to the next target within minutes", "Escalates or retries with different tradecraft; may already hold persistence elsewhere", "Goes quieter, waits, returns through a path you did not model"],
                ["Dwell behaviour", "Short, noisy, immediate monetisation", "Days to weeks of staging before impact; the ransom note is often the notification", "Months, low and slow, living off the land, minimal tooling"],
                ["What actually stops them", "Hygiene: patching velocity, no exposed services, phishing-resistant auth", "Blast radius control, backup integrity, identity segmentation, fast containment", "Architecture, supply chain integrity, and detection at Level 4 and above"]
              ]
            },
            {
              kind: "metric",
              title: "Numbers that discipline this conversation",
              source: "Mandiant M-Trends 2026; Verizon DBIR 2025; Google Project Zero",
              items: [
                "Global median dwell time 14 days in 2025, up from 11 — and 25 days when an external party told you, versus 9 when you found it yourself",
                "Internal detection rose to 52 percent of cases, meaning roughly half of organisations still learn from outside, and 14 percent learn from a ransom note",
                "Exploitation led initial infection vectors for the sixth consecutive year at roughly a third of intrusions",
                "Project Zero's caveat is the essential one: every entry in the in-the-wild zero-day tracker is a failure case for an attacker, so the data describes detection, not prevalence"
              ]
            },
            {
              kind: "principle",
              title: "Defend the economy, not the actor name",
              body: "Naming a threat group is useful for tradecraft prediction and almost useless for prioritisation. What changes your architecture is the cost tolerance of the economy you are exposed to. A hospital and a defence contractor face overlapping techniques and completely different economics, and their control portfolios should therefore diverge sharply even though their ATT&CK heat maps might look similar."
            },
            {
              kind: "callout",
              title: "The second-order effect most programs miss",
              body: "Improving hygiene against commodity actors changes which adversary reaches you, and that is a real strategic outcome rather than a marginal one. If your exposed surface stops yielding to automation, the remaining intrusions you experience will be from actors willing to spend, which means your incident frequency falls while your incident severity rises. Programs that do not anticipate this misread the severity increase as a failure of the hygiene investment, when it is the expected consequence of success. Plan the response and forensics capability to arrive at the same time as the hygiene, not two years later."
            },
            {
              kind: "list",
              title: "What to actually do differently for each",
              items: [
                "Against commodity: attack the inflow. Remove exposed services, achieve real patch velocity on internet-facing assets, deploy phishing-resistant authentication. Detection barely matters here because prevention is cheap and reliable",
                "Against criminal: assume entry and defend the blast radius. Segment identity, make backups genuinely immutable and test the restore, rehearse containment decisions in advance, and know who authorises disconnecting a business system at two in the morning",
                "Against state: invest in architecture and provenance, because detection alone loses to an adversary who can afford to be quiet. Supply chain integrity, hardware roots of trust, and Level 4-plus analytics on the few techniques that are physically hard to avoid",
                "Across all three: shorten the delay between the adversary acting and you knowing, because dwell time is the only variable that all three economies share"
              ]
            }
          ],
          awards: ["adversary-economics"],
          glossary: ["initial-access-broker", "dwell-time", "living-off-the-land", "blast-radius", "commodity-actor"]
        },
        {
          id: "ch-foundations-drill-indicator-dump",
          kind: "drill",
          title: "Drill: Fourteen Hundred Indicators",
          statement: "An indicator list is a receipt for someone else's incident, and treating it as a defence buys you the illusion of action for the price of a day.",
          minutes: 20,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Setting",
              body: "Your sector ISAC has issued an urgent advisory at 07:40. It concerns an actor actively targeting organisations like yours. The package contains 1,412 indicators — 890 file hashes, 402 IP addresses, 120 domains — and an eleven-page narrative describing tradecraft. Two things in the narrative stand out: the actor obtains initial access through stolen session tokens replayed against cloud identity providers, and they establish persistence by registering an additional authentication method on the compromised account. Your CEO forwarded the advisory to you at 07:55 with three words. Your SOC lead is asking whether to block the list."
            },
            {
              kind: "metric",
              title: "What the pyramid says this list is worth",
              source: "Bianco, Pyramid of Pain; Center for Threat-Informed Defense, Summiting the Pyramid",
              items: [
                "890 hashes — Level 1, ephemeral values, seconds of adversary cost",
                "402 IPs — Level 1 to 2, minutes of adversary cost, and a meaningful false positive risk if any sit behind shared cloud or CDN infrastructure",
                "120 domains — Level 2, hours of adversary cost",
                "The two behaviours described in the narrative — Level 4 to 5, months of adversary cost, and they are free"
              ]
            }
          ],
          drill: {
            id: "ch-foundations-drill-indicator-dump-d",
            scene: "An ISAC advisory with 1,412 indicators and an eleven-page narrative describing session token replay and rogue authentication method registration. The CEO has forwarded it. The SOC lead wants to know whether to block the list.",
            clock: "Report to the CEO by end of day",
            pressure: "Two peer organisations in your sector disclosed breaches to this actor in the past month. Your SOC is already running at capacity on a separate investigation.",
            prompt: "What do you direct in the first four hours?",
            options: [
              {
                id: "ch-foundations-drill-indicator-dump-o1",
                label: "Push all 1,412 indicators to the firewall, proxy, DNS sinkhole and EDR block lists, and report to the CEO that the advisory has been actioned",
                detail: "Fast, complete, demonstrably responsive, and every indicator the ISAC supplied is now blocked.",
                score: -1,
                outcome: "Blocking completes by mid-morning. Three of the IP addresses belong to a shared cloud front and break a legitimate integration, consuming the afternoon. The actor's infrastructure rotates within days. The two behaviours described in the narrative remain entirely undetected in your environment, and one of them is already present.",
                ripple: "You have reported completion to the CEO on work that imposed minutes of cost on the adversary, which means the organisation now believes it is protected. That belief is the actual damage: it removes the urgency that would have funded the identity work, and it will be quoted in the post-incident review as evidence that the advisory was handled.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-indicator-dump-o2",
                label: "Hunt the two behaviours immediately across identity logs, write Level 4 detections for both, and use the indicator list only as a retrospective hunt across ninety days of telemetry",
                detail: "Query for authentication method registrations on accounts that did not also perform a password change, and for session tokens presented from an ASN or device posture inconsistent with the issuing session. Then look backwards with the hashes and IPs.",
                score: 3,
                outcome: "The retro-hunt finds two IP matches from six weeks ago that nobody had noticed, which localises the investigation immediately. The behavioural hunt finds one rogue authentication method on a contractor account registered nineteen days earlier. Both detections are deployed by the following week and generalise to any actor using the same technique.",
                ripple: "You have converted a perishable list into a durable capability, and you have an actual finding to report rather than a completion status. The identity detections you built continue paying out against unrelated actors for years. Critically, the retro-hunt used the low-value indicators for the one thing they are genuinely good at — looking backwards over data you already hold, where their ephemerality does not matter.",
                isBest: true
              },
              {
                id: "ch-foundations-drill-indicator-dump-o3",
                label: "Request confidence scores and provenance from the ISAC before acting, to avoid false positives and wasted effort",
                detail: "Acting on unscored intelligence is how teams break production and lose credibility.",
                score: -2,
                outcome: "The ISAC responds in two days with partial context. Nothing was hunted, nothing was detected, and the actor's tradecraft — which was fully described in the free narrative text you already had — remained unexamined for forty-eight hours.",
                ripple: "The instinct to demand rigour before acting is correct in many contexts and wrong here, because the highest-value content in the package required no scoring at all. You applied a quality gate to the part of the intelligence that needed one while ignoring the part that did not.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-indicator-dump-o4",
                label: "Block the indicators now for immediate coverage, and open a project to build behavioural detection capability next quarter",
                detail: "Do the fast thing today and the durable thing on a proper timeline with proper resourcing.",
                score: 1,
                outcome: "The blocking happens. The project is chartered, scoped, and then deprioritised twice against operational demand, which is what happens to work that was framed as a project rather than as this week's hunt.",
                ripple: "This is the tempting answer and it is not stupid — sequencing fast wins ahead of durable work is often right. It fails here because the durable work was four hours of hunting, not a quarter of project delivery. By converting an urgent, cheap, high-value action into a future initiative, you gave it the failure profile of an initiative.",
                isBest: false
              }
            ],
            debrief: "The teaching point is that the free text was worth more than the structured data, which is true of most threat intelligence and is the opposite of how most organisations process it. The 1,412 indicators sit at Levels 1 and 2 of the pyramid and impose minutes of cost. The two sentences of tradecraft in the narrative describe Level 4 and Level 5 behaviours that cost months to change. Option one is the standard institutional response and its real cost is not the wasted hours but the false completion signal delivered upward. Option four is the sophisticated-sounding trap: it correctly sequences quick wins before durable work, but it misestimates the durable work as a quarter-long project when it was an afternoon of hunting, and that misestimate is what kills it. Note what option two does with the indicators — it does not discard them. Low-pyramid indicators are excellent for retrospective hunting across telemetry you already store, because a hash that the adversary abandoned last month is still a perfectly good pointer to what they did last month.",
            principle: "Detect on the behaviour, hunt with the indicator. And never report the completion of low-pyramid work as though it were a defence, because the belief it creates is more dangerous than the gap it papers over."
          },
          awards: ["pyramid-graded", "retro-hunt"],
          glossary: ["retro-hunt", "session-token-replay", "mfa-registration-abuse", "threat-intelligence", "false-completion"]
        },
        {
          id: "ch-foundations-lab-detection-portfolio",
          kind: "lab",
          title: "Lab: Grade Your Detection Portfolio",
          statement: "A coverage map you did not grade is a wish list with colours.",
          minutes: 40,
          respect: 190,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "What you will build",
              body: "You will take a real detection — or write one — grade it under Summiting the Pyramid, then deliberately evade it and observe whether the grade was honest. This is the single most useful exercise in detection engineering, because the gap between believed robustness and actual robustness is where every surprise lives. The scoring is not academic: a Level 2 analytic that you believed was Level 5 means a technique you believe is covered is not."
            },
            {
              kind: "code",
              title: "A Level 2 detection wearing a Level 5 name",
              lang: "yaml",
              body: "title: Suspicious remote service creation\nid: 8f2c1a44-0000-4000-8000-000000000001\nstatus: experimental\ndescription: >\n  Claims to detect remote service creation for lateral movement.\n  Read the selection block before believing that claim.\nlogsource:\n  product: windows\n  service: security\ndetection:\n  selection:\n    EventID: 4697\n    ServiceFileName|contains: 'psexesvc'\n  condition: selection\nfalsepositives:\n  - Legitimate administrative use of the same utility\nlevel: high\n\n# Summiting the Pyramid grade: LEVEL 2.\n# The analytic is keyed to a string that is core to one adversary-brought\n# tool. Rename the service binary and the detection is silent, while the\n# technique is entirely unchanged. This is the most common shape of\n# detection in a real SOC and it is almost always claimed as coverage\n# of the whole technique.\n"
            },
            {
              kind: "code",
              title: "The same technique, graded higher",
              lang: "yaml",
              body: "title: Remote service installation by a non-service-management process\nid: 8f2c1a44-0000-4000-8000-000000000002\nstatus: experimental\ndescription: >\n  Keys on the invariant: a service was created on a host by a session\n  that authenticated remotely, within a short window of that logon.\n  No tool name, no file path, no hash.\nlogsource:\n  product: windows\n  service: security\ndetection:\n  service_created:\n    EventID: 4697\n  remote_logon:\n    EventID: 4624\n    LogonType:\n      - 3\n      - 10\n  correlation:\n    - remote_logon followed by service_created\n    - same TargetLogonId\n    - within: 120s\n  condition: correlation\nfalsepositives:\n  - Configuration management and software deployment tooling, which must\n    be enumerated and allow-listed by identity rather than by binary name\nlevel: high\n\n# Summiting the Pyramid grade: LEVEL 4 to 5, observable location K/U.\n# To evade this, the adversary must stop creating services over remote\n# logons entirely, which is a change to the technique, not to a string.\n# Note the cost: this analytic requires correlation, a logon identifier\n# join, and a curated allow-list of legitimate deployment identities.\n# Robustness is bought with engineering effort, every time.\n"
            },
            {
              kind: "code",
              title: "score.py — portfolio-level honesty",
              lang: "python",
              body: "import csv\nfrom collections import defaultdict\n\n# detections.csv columns:\n#   rule_id, technique_id, level (1-5), observable (A|U|K|P|H), validated (y|n)\n\nrows = list(csv.DictReader(open('detections.csv')))\n\nby_technique = defaultdict(list)\nfor r in rows:\n    by_technique[r['technique_id']].append(r)\n\ncovered, weak, unvalidated = [], [], []\nfor tech, rules in by_technique.items():\n    best = max(int(r['level']) for r in rules)\n    any_validated = any(r['validated'] == 'y' and int(r['level']) >= 4 for r in rules)\n    if best >= 4 and any_validated:\n        covered.append(tech)\n    elif best >= 4:\n        unvalidated.append(tech)\n    else:\n        weak.append(tech)\n\ntotal = len(by_technique)\nprint('techniques with any rule      :', total)\nprint('honestly covered (L4+, tested):', len(covered),\n      '(' + str(round(100 * len(covered) / total)) + '%)')\nprint('L4+ but never validated       :', len(unvalidated))\nprint('L1-L3 only, retro-hunt value  :', len(weak))\nprint()\nprint('The number you were about to put on a slide was',\n      str(round(100 * total / total)) + '% of techniques with a rule.')\nprint('The number that is true is', str(round(100 * len(covered) / total)) + '%.')\n"
            },
            {
              kind: "numbered",
              title: "Procedure",
              items: [
                "Export your detection inventory with technique mappings; if you cannot export it, that is finding number one",
                "Grade each analytic 1 to 5 and record the observable location. Do this with two people independently and compare, because self-grading drifts upward",
                "For your ten highest-claimed techniques, execute the technique in a lab in a way that varies only the low-pyramid attributes — rename the binary, change the path, alter the port",
                "Record which detections survived. Any detection that did not survive a rename was Level 2 regardless of what you graded it",
                "Recompute portfolio coverage using only validated Level 4-plus analytics and note the difference against your previous claim",
                "Pick the three techniques where the gap between claim and reality is largest and rewrite one analytic each to key on an invariant rather than an artifact"
              ]
            },
            {
              kind: "callout",
              title: "The uncomfortable arithmetic",
              body: "Teams running this exercise for the first time routinely find that their honestly-covered percentage is a small fraction of their claimed percentage. That is not a failure of the team; it is a failure of the measurement convention the whole industry uses. The value of doing it is that it reorders your backlog instantly and gives you an unfakeable metric to improve. Report the honest number upward with the explanation attached, before someone else computes it during an incident."
            },
            {
              kind: "principle",
              title: "Key on invariants, not artifacts",
              body: "Ask of every analytic: what would the adversary have to stop doing for this to go silent. If the answer is change a name, a path, a port, or a hash, you have an artifact. If the answer is stop using this technique, you have an invariant. Robustness is expensive and worth it, and the correct portfolio is a small number of invariant analytics plus a large archive of artifact matches used for retrospective hunting."
            }
          ],
          praxis: "Grade your real detection inventory, validate the top ten by execution with varied artifacts, and rewrite one analytic to key on an invariant.",
          evidence: "The graded inventory with levels and observable locations, execution logs from the validation runs showing which detections survived artifact variation, the before-and-after coverage figures, and the rewritten analytic.",
          awards: ["honest-coverage", "invariant-detection"],
          glossary: ["detection-engineering", "analytic-robustness", "invariant", "sigma-rule", "purple-team"]
        },
        {
          id: "ch-foundations-field-adversary-portfolio",
          kind: "field",
          title: "Field: Build an Adversary-Informed Portfolio",
          statement: "Pick one adversary who genuinely targets organisations like yours, and become undeniably expensive to that one adversary.",
          minutes: 40,
          respect: 215,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The assignment",
              body: "Broad coverage ambitions produce shallow coverage everywhere. Instead you will select a single documented adversary or campaign that plausibly targets your sector, extract its technique set, honestly assess your position against that set, and close the three most valuable gaps with validated Level 4-plus analytics. This is the discipline that threat-informed defense actually names, as opposed to the version where a heat map is coloured in and filed."
            },
            {
              kind: "numbered",
              title: "Sequence",
              items: [
                "Choose one adversary or campaign with public, primary-source reporting — a CISA advisory, a vendor incident report with technical detail, or an ATT&CK group entry with cited references. Write down why this adversary is plausible for your sector rather than merely famous",
                "Extract every technique with a citation. Reject anything you cannot trace to a primary source; secondary summaries drift and you will inherit their errors",
                "Score your current position per technique using the honest grading from the previous Lab, not your existing coverage map",
                "Rank the gaps by adversary cost imposed rather than by count of techniques closed. Closing one Level 5 gap beats closing six Level 2 gaps",
                "Build and validate three analytics against the top three gaps, executing the technique with varied artifacts to prove robustness",
                "Run a purple team exercise against the closed gaps with someone who did not build the detections, and record what they found that you did not expect",
                "Write the one-page brief you would give a board: which adversary, why them, what changed, what it now costs them, and what remains open"
              ]
            },
            {
              kind: "checklist",
              title: "Evidence quality bar",
              items: [
                "Every technique in the extracted set has a primary source citation",
                "The plausibility argument for choosing this adversary references your sector, your data, or your dependencies — not a headline",
                "Coverage assessment uses Summiting the Pyramid levels with observable locations, not a colour",
                "The three new analytics survived artifact variation during validation, with logs to prove it",
                "The purple team was run by someone independent of the build",
                "The board brief is one page and contains no matrix"
              ]
            },
            {
              kind: "callout",
              title: "Where this goes wrong",
              body: "The two failure modes are choosing a famous adversary who has no plausible interest in you, and building analytics that were never executed against. The first wastes a quarter defending a scenario your organisation will never face while your actual exposure — commodity exploitation of an edge device, most likely — stays open. The second produces detections that exist in a repository and have never fired, which is the detection engineering equivalent of an untested backup. Both failures are common in programs that look sophisticated from the outside."
            },
            {
              kind: "principle",
              title: "Depth against one beats breadth against none",
              body: "A program that can demonstrate genuine, validated, high-robustness coverage against one relevant adversary has both a capability and a method it can repeat. A program with a fully coloured heat map has an artifact. When you inherit a function, look for evidence of the first and assume the second is present regardless of what the map says."
            }
          ],
          praxis: "Select one plausible adversary, extract their technique set from primary sources, honestly grade your position, close the top three gaps with validated analytics, and have them purple teamed independently.",
          evidence: "The cited technique extraction, the plausibility argument, the graded before-and-after position, three validated analytics with execution evidence, the independent purple team report, and the one-page board brief.",
          awards: ["threat-informed", "purple-validated", "adversary-economics"],
          glossary: ["threat-informed-defense", "purple-team", "primary-source", "technique-extraction"]
        }
      ]
    },
    {
      id: "ch-foundations-p5-calibration",
      title: "Consequence and Calibration",
      credential: "Certified in Risk Calibration and Blast-Radius Reasoning",
      summary: "The CIA triad is where the field started and it is not where the field ended. This Page covers the properties that modern systems actually violate, the blast-radius question that determines whether an incident is an inconvenience or an existential event, and the reason security intuition is systematically miscalibrated — along with the training that fixes it. You will build a FAIR-shaped loss model, learn to say a number with an honest interval attached, and then defend that interval to a board that wants certainty you cannot give them.",
      competencies: [
        "Extend the CIA triad with authenticity, non-repudiation, safety, and availability treated as a security property",
        "Compute blast radius from credential and network reachability rather than from asset classification labels",
        "Distinguish Knightian risk from uncertainty and choose the right decision method for each",
        "Apply base rates and recognise selection bias in security data",
        "Produce calibrated ninety percent intervals and measure your own calibration over time",
        "Decompose a loss scenario using FAIR and run a Monte Carlo rather than colouring a heat map",
        "Present uncertainty to a board without either false precision or useless hedging"
      ],
      seal: "GROUND-V",
      steps: [
        {
          id: "ch-foundations-beyond-cia",
          kind: "lesson",
          title: "Beyond the Triad: What Actually Gets Violated",
          statement: "Confidentiality, integrity and availability were a good start in 1975 and they will not describe your worst day.",
          minutes: 26,
          respect: 100,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The triad's real limitation",
              body: "The triad is a decomposition of what a defender wants, and it has three genuine weaknesses. First, it is silent on who: a message can be perfectly confidential, intact, and available, and still be from someone other than who it claims. Second, it treats availability as an operational concern that security borrows, which is why availability engineering and security engineering are separate disciplines in most organisations despite ransomware being an availability attack. Third, it has no vocabulary for physical consequence, which matters the moment your system touches a vehicle, a pump, a dose, or a grid."
            },
            {
              kind: "table",
              title: "The extended property set, and what each one is for",
              headers: ["Property", "What it asserts", "Where the triad fails without it", "Mechanism family"],
              rows: [
                ["Authenticity", "This came from who it claims", "A signed but attacker-controlled update is confidential, intact, available, and catastrophic", "Cryptographic identity, provenance attestation, code signing with key custody that matters"],
                ["Non-repudiation", "The actor cannot credibly deny it", "Fraud and insider cases collapse without evidence the actor did not control", "Append-only logs outside the actor's authority, signed audit trails, dual control"],
                ["Safety", "The system cannot cause physical harm", "Integrity is preserved while a valid command does something dangerous", "Interlocks, envelope limits, fail-safe defaults, out-of-band shutdown"],
                ["Availability as a security property", "Denial is an attack objective, not just an outage", "Ransomware and destructive attacks are treated as IT incidents until they are not", "Immutable backups with tested restore, capacity headroom, load shedding, recovery rehearsal"],
                ["Authorisation freshness", "Access reflects current entitlement, not historical grant", "Every property holds while a departed contractor's token still works", "Short-lived credentials, continuous evaluation, just-in-time elevation"],
                ["Accountability of automation", "A machine decision can be explained and traced", "Automated action is correct by all three properties and unexplainable when challenged", "Decision logging, policy versioning, replayable authorisation"]
              ]
            },
            {
              kind: "prose",
              title: "Availability deserves the promotion",
              body: "Treating availability as a security property has a practical consequence: it makes the reliability organisation your ally rather than your counterparty. The Google SRE framing is directly useful here. Reliability targets are set by the value of the service, not by an aspiration to perfection, and the gap between the target and one hundred percent is a budget to be spent deliberately. Each additional nine costs dramatically more than the last, and users frequently cannot perceive the difference because their experience is dominated by less reliable components. That reasoning transfers exactly to security controls: perfection is not the target, the marginal cost curve is steep, and the correct question is what level of assurance is worth the spend for this specific service."
            },
            {
              kind: "callout",
              title: "The zero trust decomposition, used properly",
              body: "NIST SP 800-207, published in August 2020, is worth reading for its decomposition rather than its brand. It separates the Policy Engine that makes the access decision, the Policy Administrator that establishes or tears down the communication path, and the Policy Enforcement Point that actually gates traffic. That separation is the useful part, because it tells you where to look when access control fails: a wrong decision, a decision that was correct but never enforced, or an enforcement point that was bypassed entirely. Most access control incidents are the third case, and most access control investment goes to the first."
            },
            {
              kind: "principle",
              title: "Name the property before you name the control",
              body: "When someone proposes a control, ask which property it preserves and against what. If the answer is a category name rather than a property, the proposal has not been thought through. This one question kills more bad spending than any review board, and it takes four seconds."
            }
          ],
          awards: ["property-set"],
          glossary: ["cia-triad", "authenticity", "non-repudiation", "safety-property", "policy-enforcement-point"]
        },
        {
          id: "ch-foundations-blast-radius",
          kind: "construct",
          title: "Blast Radius: The Only Asset Question That Matters",
          statement: "An asset's importance is not what it holds, it is what it reaches.",
          minutes: 24,
          respect: 95,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Why classification schemes mislead",
              body: "Traditional asset classification labels a system by the sensitivity of the data on it. That framing misses the systems that hold nothing and reach everything: a build server, a monitoring agent with an account on every host, a configuration management tool, a directory service, a CI runner, a backup system, an identity provider. None of them contain the crown jewels. All of them can obtain the crown jewels. Blast radius reframes the question from what does this hold to what does compromise of this permit, and it is computed from credentials and reachability rather than assigned from a label."
            },
            {
              kind: "numbered",
              title: "How to compute blast radius for real",
              items: [
                "Start from the compromised entity, not from the data. Assume full control of one host, one identity, or one pipeline",
                "Enumerate every credential reachable from that position: mounted secrets, instance metadata, cached tokens, agent certificates, saved sessions, keys in the process memory of anything running there",
                "For each credential, enumerate what it authorises. Not what it is used for — what it authorises. Those two sets diverge enormously in practice",
                "Repeat transitively. The second hop is where blast radius usually explodes, because the first hop lands somewhere with broader rights than the origin",
                "Add network reachability as a separate layer: what can this position talk to, and what listens without further authentication",
                "Stop when you reach either the crown jewel or a boundary that requires a credential the position genuinely cannot obtain. Write down that boundary — it is the thing you are actually defending"
              ]
            },
            {
              kind: "code",
              title: "A transitive reachability sketch you can run against real data",
              lang: "python",
              body: "from collections import deque\n\n# edges: principal -> set of principals or resources it can reach or become.\n# Build this from IAM policy, group membership, secret mounts, and\n# assume-role relationships. Every edge must come from configuration.\n\nedges = {\n    'ci-runner-sa':        {'deploy-role', 'artifact-registry'},\n    'deploy-role':         {'prod-cluster-admin'},\n    'prod-cluster-admin':  {'ns-default-secrets', 'ns-payments-secrets'},\n    'ns-payments-secrets': {'payments-db-rw'},\n    'monitoring-agent':    {'read-all-hosts'},\n    'read-all-hosts':      {'ci-runner-sa'},\n    'payments-db-rw':      set(),\n    'artifact-registry':   set(),\n    'ns-default-secrets':  set(),\n}\n\ndef radius(start):\n    seen, q = {start}, deque([start])\n    while q:\n        node = q.popleft()\n        for nxt in edges.get(node, set()):\n            if nxt not in seen:\n                seen.add(nxt)\n                q.append(nxt)\n    return seen - {start}\n\nfor origin in ['monitoring-agent', 'ci-runner-sa']:\n    r = radius(origin)\n    print(origin.ljust(20), 'reaches', str(len(r)).rjust(2), 'principals')\n    print(' ' * 20, sorted(r))\n    print()\n\n# The monitoring agent holds no sensitive data and reaches the payments\n# database in four hops. No classification scheme would have flagged it.\n"
            },
            {
              kind: "principle",
              title: "The second hop rule",
              body: "Blast radius is almost never large at the first hop and almost always large at the second. The reason is structural: the first hop lands on something operational, and operational things are granted broad rights so that they can be operational. Any blast radius analysis that stops at one hop will conclude you are fine. Always compute at least three hops, and treat any cycle in the graph as a finding in its own right."
            },
            {
              kind: "callout",
              title: "What to do with the answer",
              body: "The output of a blast radius analysis is not a report; it is a list of edges to cut. Cutting an edge is concrete: scope a role down, remove an assume-role trust relationship, split a shared secret per service, move a credential from a mounted file to a short-lived issued token, put a human approval on one specific transition. Three cut edges beat any number of documented paths. And measure it afterwards — blast radius is one of the few security properties that gives you an honest before-and-after integer."
            }
          ],
          awards: ["blast-radius-computed", "edge-cut"],
          glossary: ["blast-radius", "transitive-reachability", "instance-metadata", "assume-role", "crown-jewel"]
        },
        {
          id: "ch-foundations-lab-calibration-fair",
          kind: "lab",
          title: "Lab: Calibrate Yourself, Then Model the Loss",
          statement: "You are overconfident by a measurable amount, and until you measure it every number you give a board is a guess wearing a suit.",
          minutes: 40,
          respect: 195,
          trust: 12,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Risk, uncertainty, and why the distinction changes your method",
              body: "Frank Knight separated risk — outcomes whose probability distribution you can estimate — from uncertainty, where you cannot. Most of security lives in between and pretends otherwise. Commodity exploitation of an internet-facing service is close to risk: there is population data, the base rates are stable enough to reason with, and a frequency estimate is defensible. A first-of-its-kind supply chain compromise of a dependency you have never audited is closer to uncertainty, and the correct response there is not a better probability estimate but robustness — reducing blast radius, increasing recoverability, and buying optionality. Applying frequency models to genuine uncertainty produces confident nonsense; applying robustness thinking to well-characterised risk produces expensive over-engineering."
            },
            {
              kind: "prose",
              title: "The calibration problem, quantified",
              body: "Hubbard's research on calibrated probability assessment is the most useful uncomfortable finding in the field. When untrained experts state they are ninety percent confident, they are typically correct far less often than ninety percent of the time — measured ranges across groups sit well below the stated level, sometimes dramatically so. The important part is what follows: calibration is trainable. A few hours of structured practice with immediate feedback moves most people close to their stated confidence and the improvement persists. This means that the accuracy of every estimate your program produces is a skill you can deliberately install, and almost nobody does."
            },
            {
              kind: "code",
              title: "calibrate.py — measure your own miscalibration before you fix it",
              lang: "python",
              body: "import json\n\n# Answer 20 trivia questions with a 90 percent confidence interval each.\n# Use questions with checkable numeric answers you do not know exactly:\n# the length of a river, a company's founding year, a population figure.\n# Record lower and upper bounds BEFORE looking anything up.\n#\n# answers.json: [{'q': '...', 'lo': 100, 'hi': 900, 'truth': 412}, ...]\n\nitems = json.load(open('answers.json'))\n\nhits = sum(1 for i in items if i['lo'] <= i['truth'] <= i['hi'])\nn = len(items)\nrate = 100.0 * hits / n\n\nprint('questions        :', n)\nprint('truth in interval:', hits, '(' + str(round(rate)) + '%)')\nprint('stated confidence: 90%')\nprint()\n\nif rate < 75:\n    print('Overconfident. Your intervals are too narrow.')\n    print('Fix: for each question, ask what would have to be true for the')\n    print('answer to fall OUTSIDE your range. If you cannot name two')\n    print('plausible worlds, the range is not wide enough.')\nelif rate > 97:\n    print('Underconfident. Your intervals are uselessly wide.')\n    print('Fix: an interval that is always right carries no information.')\nelse:\n    print('Approximately calibrated. Re-test quarterly; calibration decays.')\n\n# The equivalent-bet test, applied per question:\n#   Would you rather (a) win a prize if the truth is inside your interval,\n#   or (b) win the same prize on a 90 percent lottery wheel?\n# If you prefer the wheel, your interval is too narrow. Widen it and\n# re-ask until you are genuinely indifferent between the two.\n"
            },
            {
              kind: "code",
              title: "fair.py — a loss model that shows its uncertainty",
              lang: "python",
              body: "import math\nimport random\nimport statistics\n\n# FAIR decomposition:\n#   Risk = Loss Event Frequency x Loss Magnitude\n#   LEF  = Threat Event Frequency x Vulnerability\n#   TEF  = Contact Frequency x Probability of Action\n#   Vulnerability = f(Threat Capability, Resistance Strength)\n#   LM   = Primary Loss + Secondary Risk\n#\n# Every input below is a calibrated 90 percent interval, not a point.\n\ndef lognormal_from_ci(lo, hi):\n    # 90 percent CI on a lognormal: 1.645 sigma either side of the mean log.\n    mu = (math.log(lo) + math.log(hi)) / 2\n    sigma = (math.log(hi) - math.log(lo)) / (2 * 1.645)\n    return lambda: random.lognormvariate(mu, sigma)\n\nTEF = lognormal_from_ci(4, 40)          # credible attempts per year\nVULN_LO, VULN_HI = 0.02, 0.20           # fraction of attempts that succeed\nPRIMARY = lognormal_from_ci(80000, 2500000)\nSECONDARY_PROB = 0.30                   # chance of regulatory or customer fallout\nSECONDARY = lognormal_from_ci(200000, 12000000)\n\nITER = 200000\nrandom.seed(11)\nlosses = []\n\nfor _ in range(ITER):\n    tef = TEF()\n    vuln = random.uniform(VULN_LO, VULN_HI)\n    events = 0\n    lam = tef * vuln\n    # Poisson draw for the number of loss events this year\n    l, k, p = math.exp(-lam), 0, 1.0\n    while True:\n        p *= random.random()\n        if p <= l:\n            break\n        k += 1\n    events = k\n    total = 0.0\n    for _ in range(events):\n        total += PRIMARY()\n        if random.random() < SECONDARY_PROB:\n            total += SECONDARY()\n    losses.append(total)\n\nlosses.sort()\ndef pct(p):\n    return losses[int(p * len(losses)) - 1]\n\nprint('annualised loss exposure')\nprint('  mean         :', round(statistics.mean(losses)))\nprint('  median       :', round(pct(0.50)))\nprint('  90th pct     :', round(pct(0.90)))\nprint('  99th pct     :', round(pct(0.99)))\nprint('  P(zero loss) :', round(100 * sum(1 for x in losses if x == 0) / len(losses)), 'percent')\nprint()\nprint('The mean is not the story. The 99th percentile is what kills the')\nprint('company, and the probability of zero is what the board assumes.')\n"
            },
            {
              kind: "numbered",
              title: "Procedure",
              items: [
                "Take the twenty-question calibration test cold and record your hit rate before any training",
                "Apply the equivalent-bet test to every question you got wrong and retake with fresh questions; most people improve substantially in one sitting",
                "Pick one real loss scenario in your organisation and decompose it with FAIR: contact frequency, probability of action, threat capability against resistance strength, primary loss, secondary loss",
                "Source each input from something checkable — your own incident history, sector base rates from the DBIR, your own control validation results — and record the source next to the interval",
                "Run the Monte Carlo and look at the shape, not the mean. Note the probability of zero loss and the ninety-ninth percentile",
                "Change one control assumption — for example, resistance strength improving because you deployed phishing-resistant authentication — and rerun. The delta between the two distributions is your business case, expressed in the only units a CFO natively reads"
              ]
            },
            {
              kind: "callout",
              title: "Base rates and the selection bias you are standing in",
              body: "Two disciplines make estimates honest. The first is starting from a base rate: before estimating your own probability, ask what the rate is across the population, and only then adjust for what makes you different. The second is remembering where your data came from. Project Zero states it plainly about their in-the-wild zero-day tracker — every entry is a failure case for an attacker, and detection rates differ by platform, so the data describes what was caught rather than what happened. The same caveat applies to breach reports, to your own incident history, and to your detection metrics. You are always reasoning from the sample that was visible, and the invisible sample is the one that will hurt you."
            },
            {
              kind: "principle",
              title: "A number without an interval is a lie with a decimal point",
              body: "Never state a single-point security estimate. State a ninety percent interval, name the source of each input, and say what would move the interval. This is slower, it is less satisfying to the room, and it is the difference between an estimate that can be improved and an assertion that can only be believed or disbelieved."
            }
          ],
          praxis: "Measure your own calibration, retrain, then build and run a FAIR Monte Carlo for one real loss scenario with sourced intervals.",
          evidence: "Your before-and-after calibration hit rates, the FAIR decomposition with a named source for every input interval, the loss distribution output, and the delta distribution for one proposed control change.",
          awards: ["calibrated", "monte-carlo-run", "interval-discipline"],
          glossary: ["calibration", "knightian-uncertainty", "base-rate", "fair-model", "loss-exceedance-curve"]
        },
        {
          id: "ch-foundations-drill-critical-nine-eight",
          kind: "drill",
          title: "Drill: The 9.8",
          statement: "Severity is a property of the vulnerability; risk is a property of your deployment, and confusing the two is how organisations spend a quarter on nothing.",
          minutes: 20,
          respect: 155,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Setting",
              body: "A CVSS 9.8 remote code execution vulnerability has been published in a widely used serialisation library. Your software composition analysis reports the library present in 312 of your services. It is 16:20 on a Thursday. The CTO has seen the same headline you have and wants a decision in thirty minutes; a company-wide code freeze and emergency patch cycle is on the table and has been used twice before. What you know so far: the vulnerable code path requires the application to deserialise attacker-controlled input using a specific non-default configuration flag; the CVE is not in the KEV catalogue; there is no public proof of concept yet; 9 of the 312 services are internet-facing."
            },
            {
              kind: "metric",
              title: "Base rates you should be holding in mind",
              source: "VulnCheck State of Exploitation; CISA KEV; Verizon DBIR 2025",
              items: [
                "Only a small minority of published CVEs ever attract confirmed exploitation — estimates across sources sit in the low single-digit to mid single-digit percentage range",
                "Roughly 23 percent of KEV entries in the first half of 2026 showed exploitation on or before the CVE publication date, so absence from KEV on day one is weak evidence, not strong evidence",
                "Median time from CVE publication to KEV listing was around 80 days in that period",
                "Content management systems and network edge devices dominate KEV additions; a serialisation library deep in an internal service is not the profile that usually gets there fast"
              ]
            }
          ],
          drill: {
            id: "ch-foundations-drill-critical-nine-eight-d",
            scene: "A CVSS 9.8 in a serialisation library present in 312 services. The vulnerable path requires a non-default configuration flag. Not in KEV, no public proof of concept, 9 services internet-facing. The CTO wants a decision in thirty minutes and a company-wide code freeze is on the table.",
            clock: "30 minutes to a recommendation",
            pressure: "The CTO has been burned before by a slow response and says so. Two engineering directors are already asking their teams to stop work. Whatever you say in the next thirty minutes sets the organisational tempo for the next two weeks.",
            prompt: "What do you recommend?",
            options: [
              {
                id: "ch-foundations-drill-critical-nine-eight-o1",
                label: "Declare a company-wide code freeze and emergency patch cycle across all 312 services",
                detail: "It is a 9.8, it is everywhere, and being wrong in the cautious direction is survivable.",
                score: -2,
                outcome: "Two weeks of engineering capacity across the company is consumed. Roughly 300 of the 312 services never had the configuration flag set and were never exploitable. Three unrelated production incidents are caused by rushed dependency upgrades, which is the normal yield of an emergency patch cycle at that scale.",
                ripple: "The real cost arrives later. You have spent the organisation's emergency response budget — which is measured in willingness, not dollars — on a non-event. The next time you call an emergency, the response will be slower and more sceptical, and there is no way to know in advance whether that will be the one that mattered.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-critical-nine-eight-o2",
                label: "Answer three questions before recommending anything: is the vulnerable function reachable in our call graphs, is the required flag set anywhere, and are any of the 9 internet-facing services in that set",
                detail: "Then patch the reachable set on an emergency path, schedule the rest normally, and set a trigger that escalates automatically if a proof of concept or a KEV listing appears.",
                score: 3,
                outcome: "Reachability analysis and a configuration grep across the estate take under two hours. Four services have the flag set; one is internet-facing. Those four are patched that night on an emergency path. The remaining 308 go into the normal cycle. The escalation trigger fires nothing for six weeks, at which point the fix has shipped everywhere anyway.",
                ripple: "You spent four hours of engineering rather than two weeks of company capacity, and you preserved the emergency mechanism for an actual emergency. Just as importantly, you gave the CTO a decision procedure rather than a verdict, and that procedure gets reused by engineering leadership on the next three advisories without you being in the room.",
                isBest: true
              },
              {
                id: "ch-foundations-drill-critical-nine-eight-o3",
                label: "Wait for the vendor advisory and the maintainers' guidance before committing to any action",
                detail: "Acting on incomplete information is how organisations cause their own outages.",
                score: -3,
                outcome: "Guidance arrives in nine days. In the meantime nothing was assessed, so when it arrives you still do not know whether you are exposed and you have lost the window in which assessment was cheap and uncontested.",
                ripple: "Waiting produced neither safety nor information. If exploitation had begun during those nine days you would have been discovering your exposure under incident conditions, which costs several times more and is done badly. This is the answer that feels prudent and is purely passive.",
                isBest: false
              },
              {
                id: "ch-foundations-drill-critical-nine-eight-o4",
                label: "Patch the 9 internet-facing services immediately and schedule the remaining 303 over the next sprint",
                detail: "Prioritise by exposure, act fast where it counts, avoid the company-wide disruption.",
                score: 1,
                outcome: "Reasonable and mostly harmless. Eight of the nine internet-facing services did not have the flag set and were patched for no reason, which is cheap. But three internal services that did have the flag set and are reachable from a low-trust internal network segment were treated as routine.",
                ripple: "The instinct to prioritise by internet exposure is correct most of the time, and this is genuinely the second-best answer. It fails here because exposure is a proxy for reachability and this vulnerability's reachability is governed by a configuration flag, not by network position. Whenever the exploitation precondition is something other than network exposure, the exposure proxy quietly stops working and nothing tells you.",
                isBest: false
              }
            ],
            debrief: "The 9.8 is a property of the vulnerability in the abstract, computed without any knowledge of your deployment. Your risk is a function of reachability, precondition, and exposure — three things you can determine in hours. Option one substitutes severity for risk and pays two weeks for the substitution. Option three is passivity dressed as prudence. Option four is the genuinely tempting answer and scores positive, because prioritising by internet exposure is the correct default heuristic in most cases; it fails here specifically because the exploitation precondition is a configuration flag rather than network position, which is exactly the situation in which the exposure proxy silently stops tracking the thing it proxies for. Option two wins because it converts a severity number into three answerable questions, spends hours rather than weeks, and — this is the part most people miss — installs an escalation trigger, so that the decision remains correct if new information arrives. A decision with a trigger attached is not a gamble; it is a position with a stop.",
            principle: "Never act on severity. Act on reachability, precondition, and exposure — and attach an automatic escalation trigger so that being wrong is cheap and self-correcting."
          },
          awards: ["reachability-first", "trigger-attached"],
          glossary: ["cvss", "reachability-analysis", "kev-catalog", "escalation-trigger", "software-composition-analysis"]
        },
        {
          id: "ch-foundations-council-board-uncertainty",
          kind: "council",
          title: "Council: Telling a Board the Truth About Uncertainty",
          statement: "A board does not need certainty from you; it needs to know which decisions are theirs and what each one costs.",
          minutes: 30,
          respect: 185,
          trust: 14,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "What a board is actually for, and what they will ask",
              body: "A board's function is oversight of risk, not management of it. They are legally exposed, time-poor, and mostly non-technical, and they have learned that the honest answer to are we secure is unavailable. What they need from you is a small number of things: whether the risk the organisation is carrying is inside the appetite they set, which decisions require them rather than you, what would have to happen for your assessment to be wrong, and whether you would tell them if it were. The last one is the real question underneath all the others, and everything you do in the room either builds or spends that credit."
            },
            {
              kind: "compare",
              title: "Two ways to present the same uncertain estimate",
              left: {
                title: "What fails",
                items: [
                  "A red-amber-green heat map, which encodes a false ordinal scale and permits no arithmetic",
                  "A single point estimate — expected annual loss of 4.2 million — which invites an argument about the number instead of the decision",
                  "Refusing to quantify because the data is imperfect, which reads as inability rather than rigour and moves the decision to someone less careful",
                  "A maturity score against a framework, which measures conformance to a document rather than exposure to an adversary",
                  "Any slide containing a matrix"
                ]
              },
              right: {
                title: "What works",
                items: [
                  "A loss exceedance curve: here is the probability we lose more than X in a year, and here is the same curve if you fund this",
                  "Explicit ninety percent intervals with the source of each input named",
                  "A named decision with two or three options, the cost of each, and your recommendation stated plainly",
                  "The two assumptions the whole estimate rests on, and the specific event that would falsify each",
                  "One number they can check without you, from a source you do not control"
                ]
              }
            },
            {
              kind: "numbered",
              title: "The structure of a fifteen-minute board item",
              items: [
                "Two minutes — what changed since last time, including anything that made your previous assessment wrong. Leading with your own correction buys more credibility than any amount of good news",
                "Three minutes — the exposure, as a distribution, against the appetite they previously agreed. If they never agreed an appetite, that is the item, and it is a better item than whatever you had planned",
                "Three minutes — the decision that is theirs, with options and costs. One decision. If you bring three, you will get none",
                "Two minutes — the assumptions and their falsifiers, stated as things that could happen rather than as caveats",
                "Five minutes — questions, and answer the one they asked rather than the one you prepared for",
                "Never — a technical explanation of a control, unless a director asks for it, in which case give it in sixty seconds and offer detail afterwards"
              ]
            },
            {
              kind: "callout",
              title: "The sentence that establishes you, and when to use it",
              body: "At some point you will have to say a version of: I do not know, here is what it would take to find out, here is what I would do in the meantime, and here is when I will come back to you. Most people avoid this sentence because it feels like an admission of failure. It is the opposite. A board has spent its career with executives who project certainty, and the ones who project it hardest have generally been the ones concealing the most. Saying the sentence once, early, and then delivering on the come-back date is worth more than three quarters of green dashboards. The corollary is that you must never say it about something you should already know."
            },
            {
              kind: "principle",
              title: "Governance is a leverage point, not a formality",
              body: "NIST CSF 2.0 added GOVERN as a sixth function and put it in the centre of the wheel, touching all five others. That placement is a systems claim, and it is correct: risk appetite, accountability, and the escalation path are Meadows leverage points 3 and 5 — the goals of the system and its rules. A CISO who treats board engagement as reporting overhead is declining the only access they will ever have to those two leverage points, and will spend their tenure operating at point 12 instead."
            },
            {
              kind: "list",
              title: "Things to establish in your first four board meetings",
              items: [
                "A written risk appetite that a reasonable person could use to judge whether a specific decision was inside it",
                "A named escalation threshold — the class of event on which you will contact the chair directly, out of cycle, without asking permission first",
                "One independently verifiable metric they can check without you, such as an external attack surface figure or an audited control validation result",
                "A standing five minutes with no executives present, which is the only mechanism that makes bad news structurally possible",
                "An agreed cadence for revisiting appetite, because appetite set during a calm quarter will not survive contact with an incident and everyone should know that in advance"
              ]
            }
          ],
          awards: ["board-credibility", "appetite-agreed", "interval-discipline"],
          glossary: ["risk-appetite", "loss-exceedance-curve", "escalation-threshold", "govern-function", "oversight"]
        },
        {
          id: "ch-foundations-field-risk-register",
          kind: "field",
          title: "Field: Publish a Register That Can Be Wrong",
          statement: "A risk register that has never been falsified is a filing system; make yours capable of being proven wrong and then track how often it is.",
          minutes: 40,
          respect: 220,
          trust: 14,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The assignment",
              body: "Almost every risk register in existence is a list of concerns with colours attached, reviewed quarterly, and never once evaluated for accuracy. You will build the opposite: a small register of five to eight scenarios, each stated as a falsifiable forecast with a calibrated interval, each with a named owner and an explicit trigger, and each carrying a scoring date on which you will find out whether you were right. Then you will actually score it. The scoring is the entire point; everything before it is preparation."
            },
            {
              kind: "numbered",
              title: "Build sequence",
              items: [
                "Choose five to eight scenarios that matter to a real organisation you are part of. Each must name a specific loss event, not a category — not third-party risk but unauthorised access to customer records through the analytics vendor's integration",
                "For each, state a forecast with a resolution date and a ninety percent interval: probability of occurrence in the next twelve months, and loss magnitude given occurrence",
                "Name the base rate you started from and the specific reasons you adjusted away from it. If you cannot name a base rate, say so explicitly — that admission is itself a finding about your evidence position",
                "Attach a trigger to each: the observable event on which the forecast should be revised immediately rather than at the next review",
                "Name an accountable owner who is not you, and a decision that owner controls which would move the number",
                "Publish it where the owners can see it, not only where governance can see it. Visibility to the person who can act is Meadows leverage point 6 and costs nothing",
                "Set the scoring date in your calendar now, and on that date record for each item whether the outcome fell inside your interval"
              ]
            },
            {
              kind: "checklist",
              title: "What separates this from a normal register",
              items: [
                "Every entry names a specific loss event with a mechanism, not a risk category",
                "Every entry has a ninety percent interval, not a colour or an ordinal score",
                "Every entry names the base rate used and the adjustment made",
                "Every entry has a trigger that would cause immediate revision",
                "Every entry has an owner who is not the security function and a decision they control",
                "A scoring date exists and a scoring record exists after it, including the entries you got wrong",
                "Your own calibration score across the register is recorded and tracked over time"
              ]
            },
            {
              kind: "callout",
              title: "What you will learn in the first scoring round",
              body: "Two things, reliably. First, several of your intervals were too narrow, which is the universal untrained result and is why the calibration lab precedes this one. Second, at least one entry will turn out to have been unfalsifiable as written — you will reach the scoring date and be unable to determine whether it happened. That entry teaches you more than the ones you got right, because unfalsifiable entries are the default output of every risk process in the world and you have just learned to detect them in your own work."
            },
            {
              kind: "principle",
              title: "Track the register, not the risks",
              body: "The durable asset is not the register; it is the record of how accurate your registers have been. A CISO who can say our forecasts have landed inside their stated intervals in roughly the right proportion over three years is making a claim no maturity score can match, and it is a claim about the institution's ability to reason, not about its controls. Build that record early, because it takes years to accumulate and cannot be backfilled."
            }
          ],
          praxis: "Build, publish, and later score a falsifiable risk register of five to eight scenarios with calibrated intervals, base rates, triggers, and non-security owners.",
          evidence: "The published register, the base rate and adjustment note for each entry, the trigger definitions, evidence that owners outside security accepted their entries, the dated scoring record including misses, and your calibration rate across the set.",
          awards: ["falsifiable-register", "calibrated", "scored-and-wrong"],
          glossary: ["risk-register", "falsifiable-forecast", "resolution-date", "base-rate", "trigger"]
        }
      ]
    }
  ]
};
