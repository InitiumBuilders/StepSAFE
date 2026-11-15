import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-ciso",
  act: "ACT V — MIND",
  order: 10,
  title: "The Chair",
  subtitle: "The CISO craft: board, budget, org design, and the authority nobody hands you",
  essence: "gold",
  thesis: "Senior security engineering and security leadership are different professions that happen to share a vocabulary. The engineer fails by shipping a weak control. The CISO fails by winning an argument nobody was having while the actual risk compounds three floors away, unowned and unpriced. This chapter teaches the four instruments of the chair — translation, portfolio, organization, standing — and the discipline that keeps all four honest when the room turns hostile and someone is writing the record.",
  statement: "You are handed responsibility. Authority you build yourself, in writing, in public, before you need it.",
  why: "Most security programs do not fail on technique. They fail because the person in the chair could not convert what the engineers already knew into a decision the business would fund, staff, and live with. The floor under this role moved: the SEC now requires registrants to describe board oversight of cyber risk and management's role in assessing it, a CSO has been criminally convicted for concealing a breach and had that conviction affirmed on appeal, and a sitting CISO spent two years as a named securities defendant before the case was dropped. Meanwhile budget growth fell to its slowest rate in five years and median tenure stayed under three. The chair is a job with legal exposure, a short clock, and no formal authority over most of the systems you are accountable for. It is learnable. It is not intuitive, and almost nothing that made you a great engineer transfers unmodified.",
  outcomes: [
    "Run a first-90-days entry that produces a defensible risk picture, a written mandate, and zero premature reorgs",
    "Establish ground truth about an inherited program using denominators you can defend under cross-examination",
    "Build and deliver a board narrative that a director can actually act on, including bad news, without losing standing",
    "Construct, defend, and cut a security budget in scenarios rather than a single number, and justify headcount on unit economics",
    "Design a metrics tree from business objectives downward and detect when a metric has become a target",
    "Choose an org shape deliberately — central, embedded, federated, platform — and know the failure mode you just bought",
    "Operate the risk-acceptance instrument so that risk is owned by the person who can actually price it",
    "Manage personal legal exposure through written-record discipline, D and O terms, and disclosure-control hygiene",
    "Find and pull the highest-leverage points in a security program instead of the loudest ones"
  ],
  prereq: ["ch-grc", "ch-incident"],
  unitUnlock: "u-compass",
  sources: [
    {
      label: "NIST Cybersecurity Framework 2.0 (NIST CSWP 29, February 2024)",
      note: "The GOVERN function is the only mainstream framework text that treats leadership accountability as a first-class outcome. GV.RR-01 through GV.RR-04 and GV.OV are the exact language to borrow when writing a mandate memo or a board charter — quoting a standard beats asserting authority."
    },
    {
      label: "NACD and Internet Security Alliance, Director's Handbook on Cyber-Risk Oversight",
      note: "Read this to learn what your directors were taught to ask you. It pushes boards toward cyber risk quantification and financial framing, and explicitly warns against boards that only meet the CISO annually or after a crisis. It is the answer key to your own audit committee."
    },
    {
      label: "SEC Final Rule 33-11216, Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure (July 2023)",
      note: "Item 1.05 of Form 8-K (four business days after a materiality determination) and Item 106 of Regulation S-K (describe your risk processes and the board's oversight). Item 106 is why your governance artifacts are now disclosed artifacts."
    },
    {
      label: "United States v. Sullivan, 9th Cir. No. 23-927 (opinion filed March 13, 2025)",
      note: "The appellate affirmance of the former Uber CSO's obstruction and misprision convictions. The operative facts are concealment plus a payment routed through a bug bounty and an NDA, against the backdrop of an existing FTC inquiry. Read the reasoning about what an ongoing investigation obligates you to do."
    },
    {
      label: "SEC v. SolarWinds Corp. and Timothy G. Brown (S.D.N.Y.); July 18, 2024 motion-to-dismiss opinion; dismissed with prejudice November 20, 2025",
      note: "Judge Engelmayer refused to stretch the internal accounting controls provision to cover cybersecurity controls, but let claims about specific representations in a public Security Statement proceed. The durable lesson survives the dismissal: your marketing pages are securities disclosure."
    },
    {
      label: "Verizon 2025 Data Breach Investigations Report",
      note: "Use it for the third-party share of breaches, the sharp rise in edge-device and VPN exploitation, and ransomware presence and payment behaviour. It is the least contestable public dataset you can put behind a budget ask."
    },
    {
      label: "Mandiant M-Trends 2026 (Google Cloud Threat Intelligence)",
      note: "Dwell time, detection source split, initial access vectors, and the collapse of the hand-off window between initial access and follow-on operators. Useful for arguing detection investment in terms the business understands: how long we would be blind."
    },
    {
      label: "IANS Research and Artico Search, 2025 Security Budget Benchmark Report",
      note: "Budget growth, security spend as a share of IT spend, staffing growth, and the share of CISOs reporting flat or shrinking budgets. Benchmarks are a weak argument alone and a strong argument when attached to a named risk."
    },
    {
      label: "The Open Group / FAIR Institute, Factor Analysis of Information Risk (FAIR) Standard v3.0 (January 2025)",
      note: "The decomposition — loss event frequency times loss magnitude, expressed as distributions — is the only widely accepted way to give a board a number without pretending to precision you do not have."
    },
    {
      label: "Donella Meadows, Leverage Points: Places to Intervene in a System",
      note: "Twelve intervention points ordered by power, from parameters at the bottom to paradigms at the top. It explains why buying another tool changes nothing and why changing who sees which number changes everything."
    },
    {
      label: "Netflix Technology Blog, Scaling AppSec at Netflix (Astha Singhal)",
      note: "The clearest public account of security as a product organisation: paved-road defaults, a partnership squad for high-risk teams, an automation squad for everyone else, and adoption as the primary metric rather than vulnerability counts."
    },
    {
      label: "Matthew Skelton and Manuel Pais, Team Topologies",
      note: "Stream-aligned, platform, enabling, and complicated-subsystem team types, and cognitive load as a design constraint. Read it as the missing manual for why your embedded security engineers keep getting absorbed into feature work."
    },
    {
      label: "Google, Site Reliability Engineering (the SRE book), chapters on embracing risk and eliminating toil",
      note: "Error budgets and the fifty-percent toil cap are the two imported ideas that most improve a security org. They give you a principled way to say yes to velocity and a principled way to ask for headcount."
    },
    {
      label: "CISA Known Exploited Vulnerabilities catalogue and the Binding Operational Directive that created it",
      note: "A public, dated, externally maintained list of what is actually being exploited. It is the cleanest external anchor for a remediation SLA, because you did not pick it and your engineers cannot argue with it."
    }
  ],
  pages: [
    {
      id: "ch-ciso-p-chair",
      title: "The Chair",
      credential: "Certified in Security Executive Entry and Program Assessment",
      summary: "What the job actually is, and how to enter a program you did not build without breaking it or being broken by it. Covers the four instruments of the chair, a ninety-day entry that survives contact, the listening tour that surfaces real risk instead of complaints, ground-truth establishment against an inherited inventory, the first incident under a mandate you have not yet earned, and the written mandate that converts a title into authority.",
      competencies: [
        "Distinguish the CISO craft from senior security engineering and allocate time accordingly",
        "Execute a ninety-day entry plan with dated artifacts rather than impressions",
        "Run a listening tour that produces a ranked risk picture and a coalition map",
        "Establish inventory, coverage, and identity ground truth with defensible denominators",
        "Handle a significant incident in the first month without spending credibility you do not have",
        "Negotiate and write a mandate memo that names decision rights, escalation, and reporting"
      ],
      seal: "seal-the-chair",
      steps: [
        {
          id: "ch-ciso-s-what-the-job-is",
          kind: "construct",
          title: "The Job As It Actually Is",
          statement: "The CISO is a translator, a portfolio manager, and an organisational designer who occasionally does security.",
          minutes: 18,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The promotion that is actually a career change",
              body: "The most common failure in this role is not technical and not political. It is a category error. Someone excellent at security engineering is promoted into the chair and keeps doing the job they were good at, one level up. They review architecture decisions personally. They write the detection rules they would have written. They win technical arguments in rooms full of people who cannot act on the outcome. Eighteen months later the program has better controls in the three places the CISO paid attention to and no coverage anywhere else, and the board still cannot say what the company's exposure is. The work of the chair is almost entirely conversion: turning what your engineers know into decisions other people make, budget other people approve, and behaviour other people change. You will do less security than you have done since your first year in the field, and the amount you do is a diagnostic — if you are hands-on-keyboard regularly, either you have not hired properly or you are hiding from the harder work."
            },
            {
              kind: "principle",
              body: "Your product is not controls. Your product is the decisions other people make about risk, and the speed at which they can make them safely."
            },
            {
              kind: "table",
              title: "The four instruments",
              headers: ["Instrument", "What it actually is", "How it fails", "The tell that it is failing"],
              rows: [
                ["Translation", "Converting technical state into a business claim someone can act on, and converting business intent into engineering constraints", "You describe controls instead of consequences, or you translate so far that the claim is no longer true", "Executives nod, ask no questions, and nothing changes in the next planning cycle"],
                ["Portfolio", "Allocating finite money, people, and organisational attention across risks that are not comparable in kind", "You fund what is loud, what a vendor sold you, or what burned you last time", "Every budget line traces to an incident or a demo, and none traces to a ranked exposure"],
                ["Organisation", "Choosing the shape, incentives, and interfaces of the security function and its relationship to engineering", "You inherit a shape and never revisit it, or you reorg to fix a people problem", "Work routes around your team; teams build shadow security functions"],
                ["Standing", "The accumulated credibility that lets you be believed when the facts are ugly and unverifiable in the moment", "You spend it on small fights, or you preserve it by never saying anything hard", "You find out about decisions after they ship, from someone junior"]
              ]
            },
            {
              kind: "list",
              title: "Where a functioning CISO's week actually goes",
              items: [
                "Conversations with peers outside security — engineering, legal, finance, product, sales, HR — building the relationships that let you be believed later",
                "Governance instruments: risk register maintenance, acceptance records, exception review, policy exceptions that are expiring",
                "Portfolio work: renewals, vendor consolidation, headcount planning, the standing question of what you would cut",
                "People: hiring loops, one-to-ones, promo cases, performance conversations, and the deliberate construction of a bench",
                "Preparation: the board packet, the audit committee pre-brief, the exec narrative for the thing that is about to break",
                "Incident and crisis work, which is spiky, unschedulable, and consumes whatever else was on the calendar",
                "Actual security work: architecture calls on the two or three decisions that are genuinely irreversible, and nothing else"
              ]
            },
            {
              kind: "metric",
              title: "The clock you are running against",
              body: "Reported CISO tenure clusters in the eighteen-to-thirty-six month range against a general C-suite average around five years, and 2025 practitioner surveys put self-reported or observed burnout among security leaders at roughly two-thirds. Treat this as design input, not trivia: it means your program must survive you. Anything that only works because you are personally applying pressure to it will be gone within a year of your departure.",
              items: [
                "Design for succession from month one, not month thirty",
                "Prefer mechanisms that run without you over heroics that require you",
                "Write down why decisions were made, because your successor will inherit the decisions without the reasoning"
              ]
            },
            {
              kind: "callout",
              title: "The occasionally-does-security clause",
              body: "There is one exception worth protecting. Keep enough technical depth to detect when you are being told a comfortable story. You do not need to write the detection, but you need to be able to ask which log source it depends on, what happens when that source is unavailable, and what the false negative rate looked like in the last exercise. The moment you can no longer ask the third question, you are a manager of a security function rather than a security leader, and your engineers will know before you do."
            }
          ],
          awards: ["award-chair-taken"],
          glossary: ["ciso-craft", "translation-instrument", "standing", "security-portfolio"]
        },
        {
          id: "ch-ciso-s-first-ninety",
          kind: "lesson",
          title: "The First Ninety Days That Actually Work",
          statement: "Spend the first ninety days buying information and one credible artifact, not shipping wins.",
          minutes: 30,
          respect: 120,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Why the standard advice fails here",
              body: "Generic executive onboarding advice tells you to secure early wins. In security that advice is close to actively harmful, because the available early wins are almost all visible-but-cheap: roll out a phishing simulation, publish a policy set, stand up a dashboard. Each one buys you a week of goodwill and costs you a year of credibility, because you have now signalled that you optimise for visible motion. The compounding asset in the first ninety days is information nobody else in the company has: what actually exists, who actually decides, where the money actually goes, and which three failures would genuinely hurt. Your one artifact at day ninety is not a roadmap. It is a defensible statement of exposure with named owners, and a small number of asks tied to it."
            },
            {
              kind: "timeline",
              title: "Ninety days, four phases",
              items: [
                "Days 0 to 14 — Read before you talk. The last two years of board and audit committee materials, every internal audit and pen test report, the risk register, all open exceptions, the incident log, the security section of customer contracts, the cyber insurance application and policy, and the last three vendor renewals. Meet your directs, your boss, and the general counsel. Change nothing.",
                "Days 15 to 40 — The listening tour. Thirty to fifty structured conversations across engineering, product, finance, legal, sales, support, and the field. Simultaneously run the ground-truth pass on inventory, coverage, and identity. Start the exception and acceptance backlog review because it tells you what the previous regime tolerated.",
                "Days 41 to 65 — Synthesis and pressure test. Build the exposure picture. Take it to three or four people who will argue with you: your most skeptical engineering leader, the CFO or their deputy, the GC, and one senior IC who has been there six years. Rewrite it after each. Draft the mandate memo with your boss.",
                "Days 66 to 90 — Commit in writing. Deliver the exposure picture and a twelve-month plan with three scenarios of investment. Land the mandate memo. Fix exactly one thing that was visibly broken and cheap to fix, so that the plan lands from someone who has already delivered. Announce no reorg."
              ]
            },
            {
              kind: "numbered",
              title: "The five artifacts you owe at day ninety",
              items: [
                "A ranked exposure statement: the small number of loss scenarios that would materially hurt this specific company, each with a named business owner, current position, and what would have to be true for it to happen",
                "A ground-truth appendix: inventory, coverage, and identity numbers with explicit denominators and the known gaps in those denominators, so that every later metric inherits an honest baseline",
                "A twelve-month plan in three funding scenarios — flat, plus ten percent, plus thirty percent — each with what it buys and, critically, what it does not buy",
                "A mandate memo agreed with your boss covering decision rights, escalation path, what you can block, and how disagreements resolve",
                "A risk-acceptance and exception register that is current, owned by business leaders rather than by security, and has expiry dates on every line"
              ]
            },
            {
              kind: "compare",
              title: "Two ninety-day plans",
              left: {
                title: "The plan that survives",
                items: [
                  "Ends with a claim about exposure that a CFO could underwrite",
                  "Every number carries a denominator and an admitted uncertainty",
                  "Asks are tied to named scenarios, not to framework gaps",
                  "Names owners outside security for every top risk",
                  "Explicitly lists what will not be done and what that costs",
                  "Reorg deferred until you understand why the current shape exists"
                ]
              },
              right: {
                title: "The plan that dies at month seven",
                items: [
                  "Ends with a maturity score against a framework",
                  "Percentages with no stated denominator or coverage caveat",
                  "Asks are tied to control gaps and vendor categories",
                  "Security owns every risk on the register",
                  "Promises full coverage on the current budget",
                  "Reorg announced in week six to signal decisiveness"
                ]
              }
            },
            {
              kind: "callout",
              title: "Do not reorganise in the first ninety days",
              body: "The single exception is a safety issue: someone in a position they cannot be in, a conflict of interest, or an unstaffed on-call rotation. Otherwise wait. Every strange org shape you inherit was a solution to a problem you have not found yet, often a political one. Reorganising before you find it means you will recreate the same problem with new names and burn the goodwill of everyone whose reporting line you moved. The cost of waiting three months is small. The cost of an uninformed reorg is that you spend your entire first year on personnel churn."
            },
            {
              kind: "quote",
              body: "Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies.",
              source: "NIST CSF 2.0, subcategory GV.RR-03 — quote it verbatim when your resourcing conversation stalls; it reframes the ask as a governance outcome rather than a preference"
            }
          ],
          awards: ["award-ninety-day-entry"],
          glossary: ["ninety-day-entry", "exposure-statement", "funding-scenario", "mandate-memo"]
        },
        {
          id: "ch-ciso-s-listening-tour",
          kind: "field",
          title: "The Listening Tour That Surfaces Real Risk",
          statement: "Ask questions that only a specific person can answer, and the risk register writes itself.",
          minutes: 40,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Generic questions produce generic answers",
              body: "If you ask a room what keeps them up at night, you will get ransomware, phishing, and insider threat, because those are the words the market has taught everyone to say. Those answers are worthless — they are the industry's ambient anxiety, not this company's exposure. Real risk surfaces when you ask a question that only the person in front of you can answer, and that has a factual rather than an evaluative answer. Ask a sales engineer which security question loses deals. Ask a support lead what they can see about a customer's data that they probably should not be able to see. Ask a finance manager which system, if unavailable for a week, would stop money moving. Ask a staff engineer which service they would be frightened to have a new grad deploy to on a Friday. The answers to those four questions will contain more real risk than a year of framework assessment, because they come from people who are describing their own working conditions rather than assessing yours."
            },
            {
              kind: "list",
              title: "The question set that works",
              items: [
                "What is the thing everyone here knows is broken that outsiders never hear about?",
                "Which system, if it were unavailable for a week, would actually stop the company from operating or from collecting money?",
                "What did you have to do this quarter that you knew was unsafe, and what forced it?",
                "Who has access to production data that you think probably should not, and how would we know if they looked?",
                "Where do we keep the data that we would least like to see on a leak site, and who could tell me the exact list of stores?",
                "What is the last security thing that got in your way, and what did you do instead?",
                "If you wanted to steal from this company and had your own credentials, what would you do?",
                "Which vendor has access to our environment that we would struggle to revoke inside a day?",
                "What broke in the last twelve months that we never wrote up?",
                "What does the previous security team promise that never actually happened?",
                "Which decision are you waiting on from us right now, and how long have you been waiting?",
                "If I could change exactly one thing about how security works here, what should it be, and what would break if I did?"
              ]
            },
            {
              kind: "table",
              title: "Who to interview, and what only they know",
              headers: ["Person", "What only they can tell you", "The trap"],
              rows: [
                ["General counsel", "Live regulatory exposure, litigation holds, contractual security commitments you are already bound by, and whether privilege is being used properly", "Treating them as an obstacle rather than your closest structural ally"],
                ["CFO or FP and A lead", "Where money actually moves, the real revenue concentration, and how the budget cycle genuinely works versus how it is described", "Asking for money in the first meeting instead of asking how money is decided"],
                ["Head of sales engineering", "Which security questions cost deals and which customer commitments were made without you", "Assuming the questionnaire answers on file are accurate"],
                ["Staff and principal engineers", "The real architecture, the systems everyone avoids touching, and which abstractions are load-bearing lies", "Talking only to their managers, who describe the intended system"],
                ["Support and trust-and-safety leads", "Actual data access patterns, the tooling with overbroad permissions, and the incidents that were handled as tickets", "Dismissing them as non-technical"],
                ["Site reliability or platform lead", "Change velocity, on-call reality, what the deployment path actually enforces, and where your paved road would have to live", "Arriving with mandates before understanding their toil budget"],
                ["Your own most junior analyst", "What the team actually spends its days doing, versus the org chart's description of it", "Skipping them because they are junior"],
                ["The person who left the security team last", "Why the previous program stalled, and which battles were lost and why", "Never calling them"]
              ]
            },
            {
              kind: "checklist",
              title: "Tour hygiene",
              items: [
                "Book thirty minutes, not sixty; scarcity produces candour",
                "Take notes by hand in the room, transcribe within two hours, and separate observation from inference in the transcript",
                "Never fix anything during the tour, and say so explicitly at the start, or people will perform problems at you",
                "Close every conversation by asking who else you should talk to, and track the names — the referral graph is your coalition map",
                "Track how many people independently name the same problem; three independent mentions from different functions is signal",
                "Send a two-line thank-you that repeats back the one thing you heard, so they can correct you",
                "Never quote a person to their leadership without asking first, and if you break this once the tour is over for good"
              ]
            },
            {
              kind: "callout",
              title: "Count the referral graph, not the complaints",
              body: "By the end of the tour you should be able to draw two maps. The first is the risk map: problems ranked by how many independent functions named them. The second is the influence map: who was named as someone you should talk to, and by whom. The second map is more valuable and almost nobody builds it. The three or four people who get referred by everyone, regardless of title, are the informal decision network of the company. Any change you want to make will either travel through them or fail."
            }
          ],
          praxis: "Run a real listening tour of at least twelve people across at least five distinct functions in an organisation you actually work in, volunteer for, or advise. Use the question set above, adapted to context, and hold to thirty-minute conversations. Transcribe within two hours, separating what was said from what you concluded. At the end, produce two artifacts: a risk map ranking problems by independent cross-function mentions, and a referral graph showing who was named by whom. Then take the top three items back to two of the people you interviewed and let them argue with your ranking, and record what changed.",
          evidence: "Attach to your Praxis Profile: the anonymised question set as adapted, a table of interviews conducted showing function and date but not names, the ranked risk map with mention counts, the referral graph as a diagram or adjacency list, and a short written account of at least two rankings that changed after being challenged, including what the challenge was. Do not attach raw transcripts or anything that identifies a specific person's disclosure.",
          awards: ["award-listening-tour", "award-coalition-cartographer"],
          glossary: ["listening-tour", "referral-graph", "risk-map", "independent-mention"]
        },
        {
          id: "ch-ciso-s-ground-truth",
          kind: "lab",
          title: "Ground Truth: Finding Out What Is Actually There",
          statement: "Every inherited program has a stated posture and an actual posture, and the gap lives in the denominator.",
          minutes: 40,
          respect: 190,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Ninety-eight percent of what?",
              body: "You will be told that endpoint coverage is ninety-eight percent. The number is probably true and almost certainly meaningless, because it is ninety-eight percent of the machines that the endpoint tool knows about, which is definitionally the machines that have the agent. This is the central deception in security metrics and it is usually self-deception rather than dishonesty. Coverage numbers computed from the covering system's own inventory always approach a hundred percent. The only honest coverage metric uses an independent denominator: something that knows about assets for a reason unrelated to security. Billing knows. Directory services know. DNS knows. The network knows. Your job in the ground-truth pass is to build denominators from systems that have no incentive to agree with your security tools, and then measure the disagreement. The disagreement is the finding."
            },
            {
              kind: "code",
              title: "Building an independent denominator across cloud accounts",
              lang: "bash",
              body: "# The goal is not a pretty number. It is a reconciliation you can defend.\n# Rule: the denominator must come from a system that exists for a non-security reason.\n\nset -euo pipefail\nOUT=./ground-truth\nmkdir -p $OUT\n\n# 1. Denominator source one: the org billing/account structure.\n#    Accounts nobody remembers are where the unowned risk lives.\naws organizations list-accounts --output text > $OUT/accounts.tsv\nawk '/ACTIVE/ {print $4}' $OUT/accounts.tsv | sort -u > $OUT/account-ids.txt\nwc -l < $OUT/account-ids.txt\n\n# 2. For each account, enumerate compute from the cloud control plane,\n#    not from the security tool. Assume-role into each account.\nwhile read -r ACCT; do\n  ROLE=arn:aws:iam::$ACCT:role/OrgReadOnly\n  CREDS=$(aws sts assume-role --role-arn $ROLE --role-session-name groundtruth --output text \\\n    --query Credentials.[AccessKeyId,SecretAccessKey,SessionToken] || true)\n  case $CREDS in '') echo unreachable,$ACCT >> $OUT/unreachable.csv; continue ;; esac\n  export AWS_ACCESS_KEY_ID=$(echo $CREDS | cut -d' ' -f1)\n  export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | cut -d' ' -f2)\n  export AWS_SESSION_TOKEN=$(echo $CREDS | cut -d' ' -f3)\n  for R in $(aws ec2 describe-regions --output text --query Regions[].RegionName); do\n    aws ec2 describe-instances --region $R --output text \\\n      --query Reservations[].Instances[].[InstanceId,PrivateIpAddress,Tags[?Key==Name].Value|[0]] \\\n      | sed s/^/$ACCT,$R,/ >> $OUT/compute-inventory.csv\n  done\ndone < $OUT/account-ids.txt\n\n# 3. Denominator source two: DNS. Anything with a record is something\n#    someone expects to reach. Compare with what you think you own.\ndig axfr internal.example.test @ns1.internal.example.test > $OUT/dns-zone.txt || \\\n  echo 'zone transfer refused - pull from the DNS provider API instead'\n\n# 4. The finding is the set difference, in BOTH directions.\n#    Assets the security tool has never seen: unmanaged risk.\n#    Assets only the security tool has seen: stale records inflating your numerator.\ncomm -23 $OUT/compute-inventory.sorted $OUT/edr-inventory.sorted > $OUT/unmanaged.csv\ncomm -13 $OUT/compute-inventory.sorted $OUT/edr-inventory.sorted > $OUT/ghosts.csv\nwc -l $OUT/unmanaged.csv $OUT/ghosts.csv"
            },
            {
              kind: "code",
              title: "Coverage with an honest denominator, expressed as SQL you can rerun",
              lang: "sql",
              body: "-- Anything that reports coverage from a single source is marketing.\n-- This view forces the denominator to be declared and the unknowns to be visible.\n\nCREATE OR REPLACE VIEW control_coverage AS\nWITH denominator AS (\n  -- assets that exist for a NON-security reason\n  SELECT asset_id, owner_team, environment, 'cloud_control_plane' AS source\n  FROM cloud_compute_inventory\n  WHERE state = 'running'\n  UNION\n  SELECT asset_id, owner_team, environment, 'directory' AS source\n  FROM directory_managed_devices\n  WHERE last_seen > current_date - INTERVAL '14 days'\n),\ncovered AS (\n  SELECT DISTINCT asset_id\n  FROM edr_agents\n  WHERE agent_healthy = true\n    AND last_checkin > current_date - INTERVAL '3 days'\n)\nSELECT\n  d.environment,\n  d.owner_team,\n  count(*)                                            AS denominator_assets,\n  count(c.asset_id)                                   AS covered_assets,\n  count(*) - count(c.asset_id)                        AS gap_assets,\n  round(100.0 * count(c.asset_id) / nullif(count(*),0), 1) AS coverage_pct\nFROM denominator d\nLEFT JOIN covered c ON c.asset_id = d.asset_id\nGROUP BY 1, 2\nORDER BY gap_assets DESC;\n\n-- The board slide reports the WORST owner_team row, not the average.\n-- Averages hide the team that is the actual entry point."
            },
            {
              kind: "code",
              title: "Identity ground truth: the three questions that matter",
              lang: "python",
              body: "# Identity is where inherited programs lie to themselves most.\n# Three questions, in order of how much they will change your plan.\n\nimport collections\n\ndef audit_identity(users, sessions, roles, service_principals):\n    findings = collections.defaultdict(list)\n\n    # Q1: how many humans can reach production without a phishing-resistant factor?\n    # 'MFA enabled' is not the metric. Factor STRENGTH is the metric.\n    strong = {'fido2', 'webauthn', 'platform_passkey', 'smartcard'}\n    for u in users:\n        if u['can_reach_prod'] and not (set(u['registered_factors']) & strong):\n            findings['weak_factor_prod_access'].append(u['upn'])\n\n    # Q2: what is the real blast radius of the most privileged non-human identity?\n    # Service principals are almost never in the MFA conversation and almost\n    # always hold more than any human does.\n    for sp in service_principals:\n        if sp['grants_admin_consent'] or 'Directory.ReadWrite.All' in sp['scopes']:\n            findings['tier0_nonhuman'].append((sp['name'], sp['owner'] or 'UNOWNED'))\n\n    # Q3: how long does a session outlive a revocation?\n    # This is the number that decides whether your IR plan is fiction.\n    for s in sessions:\n        if s['refresh_token_lifetime_days'] > 7 and s['reaches_prod']:\n            findings['long_lived_session'].append((s['app'], s['refresh_token_lifetime_days']))\n\n    return findings\n\n\ndef report(findings):\n    for k in ('weak_factor_prod_access', 'tier0_nonhuman', 'long_lived_session'):\n        rows = findings.get(k, [])\n        print(k, len(rows))\n        for r in rows[:10]:\n            print('   ', r)\n    # Deliberately no percentage. In the first ninety days, report counts.\n    # Percentages invite argument about the denominator before you have earned one."
            },
            {
              kind: "table",
              title: "Seven ground-truth probes and what a lie looks like",
              headers: ["Probe", "The honest form", "What a comfortable answer sounds like"],
              rows: [
                ["Asset coverage", "Independent denominator, set difference in both directions, gap by owning team", "Ninety-eight percent coverage, source unstated"],
                ["Vulnerability posture", "Time-to-remediate distribution for internet-facing assets on the CISA KEV list, with the tail shown", "Total open findings trending down"],
                ["Logging", "Named detection use cases mapped to the specific log source they require, plus source availability over the last quarter", "We send everything to the SIEM"],
                ["Identity", "Count of humans and non-humans that can reach production without a phishing-resistant factor", "MFA is enabled company-wide"],
                ["Backup and recovery", "Date and result of the last restore that was actually performed from immutable media, and the measured time it took", "Backups are running and monitored"],
                ["Third party", "Vendors with live network or data-plane access, ranked by what they could reach, with revocation time measured", "All vendors complete our questionnaire"],
                ["Incident readiness", "Date of the last exercise, who attended, the three decisions that stalled, and what changed afterwards", "We have an incident response plan"]
              ]
            },
            {
              kind: "callout",
              title: "Denominator discipline is the habit that outlives this lab",
              body: "From now on, every number you present carries three things: the denominator, where the denominator came from, and what the denominator misses. This costs you a sentence per metric and it buys you the ability to be believed for years. The first time a director asks where a number came from and you answer without hesitating — including naming what it does not cover — you have established something you cannot buy any other way. The converse is also true: the first time you cannot answer, every number you have ever presented becomes retroactively suspect."
            }
          ],
          awards: ["award-denominator-discipline", "award-ground-truth"],
          glossary: ["independent-denominator", "coverage-gap", "ghost-asset", "phishing-resistant-factor", "tier-zero"]
        },
        {
          id: "ch-ciso-s-day-thirty-one",
          kind: "drill",
          title: "Day Thirty-One: The Incident You Did Not Build The Program For",
          statement: "In your first month you have no credibility to spend, so spend process instead.",
          minutes: 25,
          respect: 175,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The trap of the early incident",
              body: "An incident in your first sixty days is the most dangerous thing that can happen to a new CISO, and it is common — you were often hired because something already went wrong or because someone senior suspects it has. You have no established relationships, no verified telemetry, no confirmed escalation path, and a team whose judgement you cannot yet calibrate. Both obvious moves are wrong. Going loud establishes you as the person who panics and burns the one-time credit you get for a first serious claim. Going quiet, in an environment where you do not yet know what obligations already exist, is how people end up in front of a jury. The correct move is neither: you convert an ambiguous situation into a bounded process with named participants, a hard checkpoint, and a written record that would read well to a stranger in two years."
            },
            {
              kind: "list",
              title: "What you do not know on day thirty-one",
              items: [
                "Whether there is an open regulatory inquiry or consent decree that already obliges disclosure",
                "Whether the telemetry that would confirm or refute the claim is retained long enough to matter",
                "Whether your predecessor made written commitments about breach handling in customer contracts",
                "Who has actual authority to make a materiality determination, and whether they have ever made one",
                "Whether your team's confidence assessments are calibrated or performative",
                "Whether the CEO wants to hear an early warning or considers one an act of alarmism"
              ]
            },
            {
              kind: "callout",
              title: "The one question to ask before anything else",
              body: "Ask the general counsel: are we currently under any regulatory inquiry, consent decree, settlement obligation, or litigation hold that touches security or data handling? This single question changes the legal character of everything that follows, and it is the question the former Uber CSO's case turned on. Ask it on day one so you already have the answer on day thirty-one. Write the answer down with the date."
            }
          ],
          drill: {
            id: "ch-ciso-d-day-thirty-one",
            scene: "You are thirty-one days into the role at a mid-size B2B software company. At 16:40 on a Thursday, a threat intelligence vendor forwards a post from an extortion leak site claiming to hold four hundred gigabytes of your company's data, with a sample directory listing that includes plausible internal path names and two customer names. Your detection lead says nothing has fired. Your predecessor left eight months ago. The CEO is on a flight that lands in three hours. Your first board meeting is in nine days.",
            clock: "45 minutes until the CEO lands and turns their phone on",
            pressure: "You have no baseline, no relationships, and a leak-site clock you do not control. Whatever you do in the next hour becomes the first page of the written record.",
            prompt: "What do you do in the next forty-five minutes?",
            options: [
              {
                id: "opt-declare-major",
                label: "Declare a major incident immediately, notify the board chair, and have finance start preparing disclosure",
                detail: "Maximum transparency, maximum speed, no accusation of concealment can ever attach to you.",
                score: -1,
                outcome: "You convene at 17:00 with fourteen people, most of whom cannot contribute. By 21:00 the directory listing turns out to be from a partner's environment that shares your naming convention. The board chair has already told two other directors.",
                ripple: "You have created a dated internal record of a major incident declaration you cannot substantiate, which counsel now has to explain in every future proceeding. Worse, you have taught the executive team that your escalations are not load-bearing, so the next one — the real one — arrives into a room that has already discounted you.",
                isBest: false
              },
              {
                id: "opt-privilege-checkpoint",
                label: "Call the GC first, open the work under privilege, assign two named people to verify the sample against internal data with a hard checkpoint at 17:25, and send a four-line holding note to the CEO and CTO stating facts, unknowns, and next update time",
                detail: "Bounded, dated, factual, and legally structured before anyone speculates in writing.",
                score: 3,
                outcome: "At 17:25 you know that two of the sample paths do not exist in your estate and one does. The CEO lands to a message that already contains what is known, what is not, and when they will hear more, which is exactly the shape an executive can act on. Verification continues under privilege with a clean record.",
                ripple: "You have established three things in your first month that normally take a year: that legal is engaged before speculation, that your updates arrive on a schedule you set rather than when someone asks, and that you distinguish facts from unknowns without being pushed. The GC becomes your closest ally, which is the single highest-value relationship in this job.",
                isBest: true
              },
              {
                id: "opt-engage-actor",
                label: "Have the threat intel vendor engage the extortion actor to obtain proof of possession before alarming anyone internally",
                detail: "You avoid a false alarm and you get evidence rather than speculation.",
                score: -2,
                outcome: "Negotiation contact is established. The actor escalates, adds a countdown timer to the post, and names a third customer. You now have an active extortion negotiation that executives and counsel learned about after it started.",
                ripple: "You have taken a unilateral action with sanctions, disclosure, and insurance implications without counsel, at a moment when you have zero credit. Even if the data proves fake, your judgement is now the story. This is the shape of the mistake that ended a career in the Uber case: the security leader deciding alone how an incident would be characterised.",
                isBest: false
              },
              {
                id: "opt-quiet-verify",
                label: "Task your strongest engineer to verify quietly overnight and brief everyone tomorrow morning with a conclusion rather than a question",
                detail: "Being wrong in month one is worse than being slow, and executives hate ambiguity.",
                score: -3,
                outcome: "You brief at 09:00 Friday with a solid analysis. By then the leak site post has been picked up by a security newsletter, a customer has emailed your CEO directly, and the CEO's first knowledge of the event came from a customer rather than from you.",
                ripple: "The analysis being correct does not save you. You have demonstrated that you filter information upward based on your own comfort, which means no executive can ever again assume they are current. If a regulator later asks when the company first knew, the honest answer is that you knew at 16:40 and chose not to say, and that sentence is doing a great deal of work in a deposition.",
                isBest: false
              }
            ],
            debrief: "The best option wins on three axes at once, which is what makes it correct rather than merely cautious. Legally, engaging counsel first means the investigative work product is structured properly from the first minute, and it forces the question of pre-existing obligations to the surface before anyone commits a characterisation to writing. Operationally, a hard checkpoint at forty-five minutes converts unbounded anxiety into a bounded task with named owners, which is the only thing that reliably prevents an incident room from filling with people performing concern. Politically, the four-line holding note is the highest-leverage artifact in executive communication: facts, unknowns, and next update time. It says you are in control without claiming to know things you do not, and it sets the rhythm of the escalation on your schedule. Note that both wrong-but-tempting options — declaring everything, and verifying quietly — are failures of the same underlying kind. Each substitutes a personal comfort preference for a process. One prefers the comfort of never being accused of hiding; the other prefers the comfort of never being wrong in public. Process is what protects you from both, and it is also the thing you can hand to your successor.",
            principle: "Under uncertainty, do not choose between loud and quiet. Choose bounded: named owners, a hard checkpoint, counsel engaged, and a written record of facts separated from unknowns."
          },
          awards: ["award-first-fire", "award-holding-note"],
          glossary: ["holding-note", "legal-privilege", "materiality-determination", "proof-of-possession"]
        },
        {
          id: "ch-ciso-s-mandate-memo",
          kind: "council",
          title: "The Mandate Memo: Converting A Title Into Authority",
          statement: "Authority that is not written down does not exist on the day you need it.",
          minutes: 30,
          respect: 145,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "You were given a title, not a mandate",
              body: "Every CISO discovers the same thing in roughly month four: the title implies authority that no document actually grants. You are accountable for outcomes produced by engineering teams that do not report to you, using budget you do not control, in a process you cannot block. This is not a failure of your hiring manager; it is the structural condition of the role. The remedy is not to demand authority, which reads as insecurity and is usually refused. The remedy is to write down, jointly with your boss, exactly what you can decide, what you can block, what you must escalate, and how disagreements resolve — and then to circulate it, because a mandate known only to you and your boss is not a mandate. The best time to write it is between day sixty and day ninety, when you have earned enough context to be specific and before you have had the fight that makes it look defensive."
            },
            {
              kind: "numbered",
              title: "The seven clauses that make a mandate real",
              items: [
                "Decision rights: the specific, enumerated decisions you make alone. Keep this list short and unambiguous. Two or three items. Vague breadth is worth less than narrow certainty.",
                "Blocking rights: the specific conditions under which you can stop a release, a deployment, or a vendor from going live. Name the conditions, not a general power. A blocking right you cannot describe in advance will be contested at the moment you use it.",
                "Consultation rights: what must come to you before it is decided, with a stated maximum response time from you. Your response time commitment is what makes this survivable for engineering.",
                "Escalation path: exactly who decides when you and an executive peer disagree, and how fast. Name the person and the maximum elapsed time. If the answer is the CEO, say so in the document.",
                "Risk acceptance authority: who can accept which magnitudes of risk. Crucially, this should say that you do not accept risk on the business's behalf — you record and price it.",
                "Reporting and access: cadence with the board or audit committee, and an explicit statement that you have direct access to the committee chair without going through your management chain. This clause is the one that matters most and is the one people forget.",
                "Resourcing linkage: a statement that material changes in scope trigger a resourcing conversation, so that new obligations do not silently arrive as unfunded mandates."
              ]
            },
            {
              kind: "compare",
              title: "Two mandates",
              left: {
                title: "The mandate that holds",
                items: [
                  "Names three specific decisions you own outright",
                  "Blocking conditions are pre-agreed and testable in advance",
                  "You commit to a response-time SLA in return for consultation rights",
                  "Escalation names a person and a clock",
                  "States plainly that business owners accept risk, not security",
                  "Grants direct access to the audit committee chair",
                  "Is circulated to peer executives and referenced in your first board packet"
                ]
              },
              right: {
                title: "The mandate that evaporates",
                items: [
                  "Grants broad responsibility for the security of the enterprise",
                  "Authority to stop unsafe changes, undefined",
                  "Expects consultation with no reciprocal commitment",
                  "Disagreements resolved collaboratively",
                  "Says the CISO owns cyber risk",
                  "Board access mediated by your manager",
                  "Lives in a shared drive and is never mentioned again"
                ]
              }
            },
            {
              kind: "quote",
              body: "Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced.",
              source: "NIST CSF 2.0, subcategory GV.RR-02 — the sentence to put at the top of the memo, because it reframes the conversation from what you want to what an assessed framework expects"
            },
            {
              kind: "table",
              title: "How to raise it without sounding like you are asking for power",
              headers: ["The framing that fails", "The framing that works", "Why the second one lands"],
              rows: [
                ["I need more authority to do this job", "Here are the four decisions I have been asked to make this quarter and I want to confirm which of them are actually mine", "Concrete, current, and asks for clarity rather than power"],
                ["Engineering keeps going around me", "Here is a proposed response-time commitment from my team in exchange for being in the loop before these three categories of decision", "Trades something valuable for something valuable"],
                ["I should report to the CEO", "I would like a standing item and direct access to the audit committee chair, and I am happy with the current reporting line", "Separates information flow from reporting line, which is the thing that actually matters"],
                ["We are under-resourced", "If we take on this new obligation, here is what comes off the list, or here is what it costs to keep both", "Makes the tradeoff visible rather than making you sound like you are complaining"]
              ]
            },
            {
              kind: "callout",
              title: "The clause everyone forgets",
              body: "Direct access to the audit committee chair without going through your management chain. Not a reporting line change — just the right to request a private conversation. It costs your boss almost nothing to grant during a friendly onboarding conversation and it is nearly impossible to obtain later, because by then asking for it implies you distrust someone. It is also the single structural protection that matters most if you are ever pressured to characterise an incident in a way you believe is wrong. Ask for it in week eight, in writing, casually, as a governance hygiene item."
            }
          ],
          awards: ["award-mandate-written"],
          glossary: ["mandate-memo", "blocking-right", "escalation-clock", "audit-committee-access"]
        }
      ]
    },
    {
      id: "ch-ciso-p-board",
      title: "The Room Where It Is Decided",
      credential: "Certified in Board and Executive Risk Communication",
      summary: "How to be useful to a board rather than merely present. Covers the four levers a board actually controls, the three-slide standard and risk narrative over control inventory, the annual governance cycle and audit committee dynamics, the questions directors are trained to ask and what each one is testing, delivering bad news without losing standing, and building a board packet that survives a hostile read.",
      competencies: [
        "Frame every board ask against one of the four levers a board can actually pull",
        "Build a three-slide risk narrative that a non-technical director can act on",
        "Operate the annual board and audit committee cycle, including executive session dynamics",
        "Answer the standard director question set with structure rather than reassurance",
        "Deliver bad news in a way that increases rather than destroys standing",
        "Produce a board packet with defensible numbers, stated uncertainty, and a single decision request"
      ],
      seal: "seal-the-room",
      steps: [
        {
          id: "ch-ciso-s-what-boards-act-on",
          kind: "construct",
          title: "What A Board Can Actually Do",
          statement: "A board has four levers and none of them is technical, so every ask must be shaped to fit one.",
          minutes: 20,
          respect: 85,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Directors cannot fix anything",
              body: "New CISOs present to boards as though the board were a very senior engineering review. They describe the state of controls, the maturity trajectory, the tooling landscape. Directors listen politely and do nothing, because there is nothing for them to do with that information. A board is not a management body. It cannot patch a system, approve an architecture, hire an engineer, or choose a vendor. It has exactly four levers: it allocates capital, it hires and fires the chief executive and sets their incentives, it directs its own attention and committee structure, and it creates the record — minutes, charters, and disclosures that establish what the company knew and when. If your board material does not connect to at least one of those four, you have delivered a status update to people who are not permitted to act on status. The ask is what makes a board presentation a board presentation."
            },
            {
              kind: "table",
              title: "The four levers and how to reach each one",
              headers: ["Lever", "What it looks like in practice", "The input you must supply", "The ask that fails"],
              rows: [
                ["Capital", "Approving or protecting a budget envelope, or funding a discrete programme", "A loss scenario with a range, the cost to change its position, and what the money does not buy", "A tool request, or a benchmark comparison with no named risk attached"],
                ["Executive accountability", "Setting or adjusting CEO objectives, or asking management pointed questions in a way that reallocates internal priority", "A named risk owned by a named executive with a stated position and trajectory", "A complaint about a peer, or a diffuse claim that the culture is not supportive"],
                ["Attention and structure", "Committee assignment, meeting cadence, adding a director with relevant expertise, commissioning an independent assessment", "An honest statement of where your own assurance is weakest and why", "Asking for more time on the agenda without saying what decision the time produces"],
                ["The record", "Minutes, charter language, oversight disclosure under Item 106, and the documented basis for materiality judgements", "Clear, dated, accurate reporting that would survive being read aloud by opposing counsel", "Softened language that makes the minute unusable as evidence that oversight occurred"]
              ]
            },
            {
              kind: "principle",
              body: "Never bring a board a problem without naming which of its four levers you are asking it to pull. If none applies, it is not board material."
            },
            {
              kind: "list",
              title: "Things a board legitimately cannot do, and stop asking them to",
              items: [
                "Resolve a disagreement between you and the CTO — that is the CEO's job, and taking it to the board damages you more than it damages your peer",
                "Approve a technical standard or architecture decision",
                "Choose or veto a specific vendor",
                "Mandate that engineering teams comply with a policy — boards direct management, not staff",
                "Give you cover for a decision that is yours to make; asking them to is how you become a person who does not make decisions"
              ]
            },
            {
              kind: "metric",
              title: "Board oversight is now a disclosed artifact",
              body: "Item 106 of Regulation S-K requires registrants to describe the board's oversight of risks from cybersecurity threats and management's role in assessing and managing them, and Item 1.05 of Form 8-K requires disclosure generally within four business days of a materiality determination. This has a practical consequence people miss: how your board oversees cyber is now something the company says publicly, which means the cadence, the committee assignment, and the reporting structure you negotiate become part of the securities record.",
              items: [
                "Whatever oversight process you describe in the 10-K, you must actually run",
                "Board minutes reflecting substantive cyber discussion are a defensive asset; thin minutes are the opposite",
                "The materiality determination is not yours to make alone, but the facts that feed it are yours to deliver accurately and promptly"
              ]
            }
          ],
          awards: ["award-board-levers"],
          glossary: ["board-lever", "item-106", "executive-session", "oversight-record"]
        },
        {
          id: "ch-ciso-s-three-slide",
          kind: "lesson",
          title: "The Three-Slide Standard",
          statement: "Risk narrative beats control inventory, because a narrative contains a decision and an inventory does not.",
          minutes: 28,
          respect: 115,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Why the fifty-slide deck fails",
              body: "The typical board security deck is a control inventory: maturity scores by domain, tool coverage, training completion, a heat map, an incident count, a roadmap. It is comprehensive, defensible, and useless, because it answers a question nobody asked. Directors are not assessing your programme; they are discharging an oversight duty over enterprise risk, and they have between twenty and forty minutes in which cybersecurity is one of eight agenda items. The deck that works has three slides and a thick appendix. Slide one is the small number of loss scenarios that could actually hurt this company and where each one stands. Slide two is what changed since last time and what it means. Slide three is the decision you need. Everything else — the maturity scores, the tool inventory, the metric detail — goes in the appendix, where it exists to be found by the one director who wants it and to demonstrate that the front three slides rest on something."
            },
            {
              kind: "numbered",
              title: "The three slides, precisely",
              items: [
                "Slide one, the exposure picture: three to five named loss scenarios specific to this company, each with a business owner, a plain-language description of how it would happen, an estimated range of loss, and a position marker showing whether it is improving, static, or worsening. Not a heat map. A short table with a trajectory arrow, because trajectory is what a director can hold in their head.",
                "Slide two, what changed: new information since the last meeting, in four categories — the threat environment as it touches us specifically, our own posture, the regulatory or contractual environment, and the business itself. New business is the category CISOs forget and it is often the most important; an acquisition or a new market changes exposure more than any control you deployed.",
                "Slide three, the decision: exactly one primary ask, stated as a decision the board can make, with the option set, your recommendation, what happens if the answer is no, and the date by which not deciding becomes a decision. If you have three asks, you have zero asks."
              ]
            },
            {
              kind: "compare",
              title: "The same reality, two ways",
              left: {
                title: "Control inventory language",
                items: [
                  "Endpoint coverage improved from ninety-one to ninety-six percent",
                  "We closed four hundred and twelve high-severity findings",
                  "Our NIST CSF maturity moved from 2.4 to 2.8",
                  "We deployed a cloud security posture management platform",
                  "Phishing simulation failure rate dropped to four percent",
                  "Twelve items are red on the risk heat map"
                ]
              },
              right: {
                title: "Risk narrative language",
                items: [
                  "The path an attacker used against two of our peers this year now requires two additional steps in our environment; it is not closed",
                  "An intruder in our largest customer-data store would have been visible in hours rather than days as of March; we cannot yet say the same for the payments path",
                  "If our primary ERP were encrypted, we now believe we could be transacting again in days rather than weeks, and here is the restore test that supports that claim",
                  "Our third-party exposure grew because the acquisition brought forty-one vendors with production access that we have not yet assessed",
                  "The single largest uninsured loss scenario on this page is contractual liability to our four largest customers, and it is owned by the chief revenue officer, not by me",
                  "We are asking for a decision on whether to accept the payments-path exposure through Q3 or fund the remediation now"
                ]
              }
            },
            {
              kind: "table",
              title: "Sentence patterns that work in the room",
              headers: ["Situation", "Pattern", "Why it works"],
              rows: [
                ["Stating a risk", "If X happened, the consequence would be Y, and we estimate it between A and B; the owner is Z", "Consequence first, range not point, named human owner"],
                ["Stating uncertainty", "We do not know W; here is how we would find out, what it would cost, and when you would hear", "Admitting a gap while showing you have a plan converts weakness into competence"],
                ["Answering are we secure", "No organisation is secure; here is what we are defended against, what we are not, and which of those two lists we propose to change this year", "Refuses a false binary without sounding evasive"],
                ["Reporting improvement", "Last time I told you A; that is now B because of C; the remaining gap is D", "Ties to the prior record, which is what directors are actually tracking"],
                ["Pushing back on a directive", "We can do that; here is what comes off the list to do it, or here is the cost to do both", "Never refuse, always price"]
              ]
            },
            {
              kind: "callout",
              title: "Never present a heat map you cannot defend the axes of",
              body: "The five-by-five likelihood-by-impact grid is the most requested and least defensible artifact in security governance. The moment a director with a finance or actuarial background asks what the difference between a four and a five on the likelihood axis is in numerical terms, an unquantified heat map collapses, and it takes your credibility with it. Either do the work — FAIR-style decomposition into loss event frequency and loss magnitude, expressed as ranges with stated confidence — or present ranked scenarios with trajectory arrows and no grid at all. The ranked list is honest and survives scrutiny. The undefended grid looks more rigorous and is not."
            },
            {
              kind: "quote",
              body: "Board-management discussions about cyber risk should include identification and quantification of financial exposure.",
              source: "NACD and Internet Security Alliance, Director's Handbook on Cyber-Risk Oversight — the principle your directors were taught, which is why qualitative-only reporting increasingly reads as underprepared"
            }
          ],
          awards: ["award-three-slide"],
          glossary: ["risk-narrative", "loss-scenario", "trajectory-marker", "heat-map-trap"]
        },
        {
          id: "ch-ciso-s-board-cycle",
          kind: "lesson",
          title: "The Annual Cycle And The Audit Committee",
          statement: "The board year has a rhythm, and a CISO who does not know it is always presenting at the wrong moment.",
          minutes: 30,
          respect: 130,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "You are one item on a calendar you did not design",
              body: "Boards run an annual cycle driven by the financial calendar, the audit cycle, and the strategy cycle. Budget authority is effectively decided in a narrow window, usually one to two quarters before the fiscal year begins, and by the time the budget appears on a board agenda the numbers were settled weeks earlier in management meetings you must already have influenced. Strategy sessions — often an offsite — are where acquisitions, market entries, and platform bets get discussed, and those decisions change your exposure more than any control programme will. If you present a well-crafted risk narrative in the quarter after the strategy offsite, you are commenting on a decision that has already been made. Learn the cycle in your first quarter and place your asks where they can still move something."
            },
            {
              kind: "timeline",
              title: "A representative annual cycle and where your leverage is",
              items: [
                "Q1 — Prior-year close, external audit, and the annual report. Your Item 106 disclosure language is drafted here, and once filed it is a public description of a process you must actually operate. Review the draft; do not let it be written by people who have never seen your programme.",
                "Q2 — Strategy and long-range planning. The highest-leverage moment of your year and the one CISOs most often miss. Get a seat, or at minimum get a written input into the strategy pre-read, covering what each strategic option does to exposure. This is where you influence next year's risk before it exists.",
                "Q3 — Budget construction. Real allocation happens in management before it reaches the board. Your scenarios must be in the CFO's hands before the first consolidation pass, not after. By the time it is a board slide it is a ratification, not a decision.",
                "Q4 — Assurance and planning approval. Internal audit plan for next year is set here, and you have more influence over it than you think; audit choosing to look at something creates organisational attention you could never command directly. Also the natural moment for the annual deep dive and the incident exercise readout."
              ]
            },
            {
              kind: "table",
              title: "Which body you are in front of, and what it wants",
              headers: ["Body", "What it actually owns", "What it wants from you", "How you lose it"],
              rows: [
                ["Full board", "Strategy, capital allocation, CEO accountability", "The exposure picture, the trajectory, and the one decision", "Depth. Detail in the full board reads as failure to prioritise"],
                ["Audit committee", "Financial reporting integrity, internal controls, external and internal audit, and often cyber by default", "Control operation evidence, findings, remediation status against dates, and any change in your assurance level", "Surprises. An audit committee's core allergy is learning something material from someone other than you"],
                ["Risk committee, where one exists", "Risk appetite, aggregate exposure, insurance and transfer", "Quantified exposure, appetite breaches, and what you are doing about them", "Unquantified claims. This committee is populated by people who price risk professionally"],
                ["Technology committee, where one exists", "Technology strategy and major programme oversight", "How security shapes and constrains the technology agenda, not a security status report", "Positioning security as separate from technology rather than as a property of it"],
                ["Executive session, no management present", "Candour", "You are not there. What matters is what the CEO and GC say about you, and whether the committee chair felt fully informed", "Being the person about whom directors ask each other clarifying questions after you leave"]
              ]
            },
            {
              kind: "list",
              title: "Audit committee dynamics you should know before your first meeting",
              items: [
                "The audit committee chair is typically a former CFO or audit partner; they think in controls, evidence, and dates, and they are trained to distrust narrative without documentation",
                "They meet privately with the external auditor and with internal audit, without management present, and cyber comes up in those sessions whether or not you know it",
                "A finding they hear first from internal audit rather than from you costs you more than the finding itself ever will",
                "They track commitments across meetings with a written tracker; a date you gave last quarter will be read back to you",
                "They are personally exposed. Their questions about your programme are partly questions about their own liability, which is why documentation of oversight matters so much to them",
                "Ask the chair for thirty minutes one-to-one before your first appearance, and ask them what would make your reporting useful. Nearly nobody does this and it changes the relationship permanently"
              ]
            },
            {
              kind: "callout",
              title: "The pre-brief is the meeting",
              body: "By the time you present, the outcome should already be determined. Before any consequential board or committee appearance, walk the material individually through the committee chair, the CFO, the GC, and your own boss. You are not seeking approval; you are finding out which sentence lands wrong, which number will be challenged, and which director has a private concern you can address before it becomes a public one. A board meeting where you are surprised by a question is a pre-brief you did not do. The corollary is that you should never use a board meeting to raise something for the first time — that is experienced as an ambush, and directors do not forgive it even when you were right."
            }
          ],
          awards: ["award-board-cycle"],
          glossary: ["audit-committee", "executive-session", "pre-brief", "risk-appetite", "internal-audit-plan"]
        },
        {
          id: "ch-ciso-s-director-questions",
          kind: "council",
          title: "The Questions Directors Are Trained To Ask",
          statement: "Every director question is testing something other than what it appears to ask.",
          minutes: 32,
          respect: 155,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The questions come from a handbook",
              body: "Directors are not improvising. Governance bodies publish handbooks and question sets, boards run director education sessions, and audit committee chairs compare notes across the three or four boards they sit on. The result is a fairly stable canonical question set, which means you can prepare for it precisely. More importantly, each question has a surface form and a real form. When a director asks whether you have enough resources, the surface question is about budget and the real question is whether you will tell them the truth about your own constraints or perform contentment. When they ask how you compare to peers, the surface question is benchmarking and the real question is whether you think for yourself. Answer the real question and the surface question resolves itself."
            },
            {
              kind: "table",
              title: "The canonical set, decoded",
              headers: ["The question", "What it is really testing", "The shape of a strong answer", "The failure"],
              rows: [
                ["Are we secure?", "Whether you will accept a false binary to make people comfortable", "Reframe to defended-against-what, state the two or three scenarios you are not currently defended against, and name which you propose to change", "Yes, or a maturity score"],
                ["How do we compare to our peers?", "Whether you benchmark instead of thinking, and whether you know your own industry's actual loss experience", "Give one relevant benchmark, then immediately explain why our specific exposure differs from the peer average and in which direction", "A quadrant chart, or a spend-versus-peers percentage with no risk attached"],
                ["Do you have the resources you need?", "Whether you tell the truth upward under social pressure to say yes", "Yes for the risks we have prioritised; here is specifically what we are not covering as a result, and here is what it would cost to cover it", "Yes, we are in good shape"],
                ["What keeps you up at night?", "Whether your fears are specific to this company or borrowed from headlines", "One named scenario, why this company specifically, what would have to be true, and what you are doing", "Ransomware and nation-state actors"],
                ["Could what happened to that company happen to us?", "Whether you have actually analysed the public incident rather than dismissing it", "Walk the attacker's path against our environment step by step, name where we would and would not have stopped it, and be honest about the steps we cannot rule out", "We have controls for that"],
                ["How would we know if it were happening now?", "Whether your detection claims are grounded or aspirational", "Name the specific telemetry, the detection, the coverage gap, and the last time it was tested against a real or simulated adversary", "We have twenty-four-seven monitoring"],
                ["What is our exposure in dollars?", "Whether you can operate in the board's native unit", "A range with stated method and stated confidence, plus the two assumptions that most move the number", "Declining to quantify, or a precise single figure"],
                ["Are we compliant?", "Often a proxy for whether they are personally protected", "Compliance status honestly, then the distinction between compliance and exposure, with one concrete example where we are compliant and still exposed", "Yes, which invites the assumption that compliance equals safety"],
                ["What would you do with an extra ten million?", "Judgement, prioritisation, and whether you have a plan or a wish list", "Three specific things in priority order, each with the risk it changes, and honesty that the third has diminishing returns", "A list of tools"],
                ["What is your biggest weakness as a programme?", "Whether you are self-aware and safe to trust with bad news", "A real one, with why it persists and what would resolve it", "A humblebrag, such as we move too fast"]
              ]
            },
            {
              kind: "list",
              title: "Answer mechanics that hold up under follow-up",
              items: [
                "Lead with the answer, then the reasoning. Directors are trained to interrupt; if your conclusion is at the end you may never reach it",
                "Give a number with a range and a named method rather than a point estimate; a range invites a conversation and a point estimate invites a challenge",
                "Say I do not know, followed immediately by how you would find out and when you will report back, then actually report back unprompted",
                "Never answer for a peer executive who is in the room; hand it to them, which builds the alliance and signals you are not empire-building",
                "If asked to speculate about attribution, decline explicitly and explain why attribution rarely changes the decision in front of them",
                "Write down every commitment you make in the meeting and open the next meeting with the status of each, unprompted"
              ]
            },
            {
              kind: "quote",
              body: "Directors should set the expectation that management will establish an enterprise-wide, cyber-risk management framework.",
              source: "NACD and Internet Security Alliance, Director's Handbook on Cyber-Risk Oversight — read the handbook your board read, because it is the answer key to their questions"
            },
            {
              kind: "checklist",
              title: "Before you walk in",
              items: [
                "Rehearse the ten canonical questions aloud with someone who will push back, not in your head",
                "Have the appendix page number for every number on the front three slides memorised",
                "Know the two questions you most hope are not asked, and prepare those answers first",
                "Confirm every commitment from the last meeting has a status, including the ones nobody followed up on",
                "Agree with the CEO and GC in advance who answers what, especially on anything with legal exposure",
                "Decide in advance the one sentence you want a director to repeat in the executive session after you leave"
              ]
            }
          ],
          awards: ["award-director-fluency", "award-answer-the-real-question"],
          glossary: ["canonical-question-set", "point-estimate", "attribution-trap", "commitment-tracker"]
        },
        {
          id: "ch-ciso-s-bad-news",
          kind: "drill",
          title: "Delivering Bad News And Keeping Authority",
          statement: "How you deliver the failure determines whether you keep the mandate to fix it.",
          minutes: 26,
          respect: 185,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Bad news is the only real test of standing",
              body: "Everything you do in good conditions is preparation for the meeting where you have to say that something you previously asserted was wrong. This is where CISOs are actually evaluated, and the evaluation is not about the failure. Boards and executives have seen failures; they expect them. What they are measuring is whether you found it yourself or someone else did, whether you brought it immediately or when you had to, whether you can state the exposure without either minimising or catastrophising, and whether the corrective action addresses the mechanism that let it happen rather than the specific instance. Get those four right and a bad finding will increase your authority, because you have demonstrated the one property that cannot be verified in advance: that your reporting can be trusted when it is against your own interest."
            },
            {
              kind: "numbered",
              title: "The five-part structure for bad news",
              items: [
                "The fact, stated plainly in one sentence, with no preamble and no context-setting. Preamble reads as management and destroys trust before you reach the content.",
                "The window: when it started, when it was found, how it was found, and by whom. Found-by is the most informative datum in the entire disclosure and everyone in the room knows it.",
                "The exposure: what could have happened and what evidence bears on whether it did, expressed with explicit confidence. Distinguish what you know from what you have not been able to rule out.",
                "The correction: the immediate containment, then the mechanism change that prevents the class rather than the instance, with dates and a named owner.",
                "The process change: what you are changing about how you assure or attest, so that the next occurrence of this class is caught earlier. This is the part that restores authority, because it says the system got better rather than that you are sorry."
              ]
            },
            {
              kind: "callout",
              title: "The asymmetry that governs everything here",
              body: "There is no version of this where concealment is the lower-risk path, and that is a change from a decade ago. Median dwell time and detection-source data show that a very large share of intrusions are still discovered by an external party, meaning the probability that a concealed problem stays concealed is not high. Add mandatory disclosure timelines, a criminal conviction of a security executive for concealing a breach affirmed on appeal, and civil exposure for statements about security posture, and the expected value calculation is not close. The only defensible strategy is early, accurate, documented reporting through the correct channel — which incidentally is also the strategy that makes you promotable."
            }
          ],
          drill: {
            id: "ch-ciso-d-bad-news",
            scene: "You are eleven months into the role at a publicly traded company. Your audit committee meets in ninety minutes. Twenty minutes ago your GRC lead told you that the privileged access review control — which you personally reported as operating effectively in last quarter's committee materials — has not actually run since February because the identity system migration broke the job that feeds it. Five months. No compensating detection was in place for the same period. Internal audit does not know yet. The committee packet with your prior attestation is already distributed.",
            clock: "90 minutes to the audit committee",
            pressure: "You certified this control. The chair is a former audit partner who tracks commitments across meetings in writing, and your remediation credibility for the next year depends on the next hour.",
            prompt: "What do you do before and during the meeting?",
            options: [
              {
                id: "opt-fix-quietly",
                label: "Present the agenda as planned, restore the control this week, and disclose next quarter alongside the completed remediation",
                detail: "You will have the fix in hand, which makes it a much stronger conversation and avoids an unproductive panic.",
                score: -3,
                outcome: "The control is restored in nine days. In week six, internal audit's routine identity-migration testing finds the same gap and reports it to the committee directly, noting the five-month window and that management had not raised it.",
                ripple: "The finding becomes a governance finding rather than a control finding, which is a categorically worse thing. You have handed the committee evidence that your attestations are not reliable, and every metric you present for the remainder of your tenure is now discounted. In a company subject to disclosure controls, you have also created a period during which management's certification process was operating on information you knew to be wrong, which is a conversation you do not want to have with counsel.",
                isBest: false
              },
              {
                id: "opt-chair-then-lead",
                label: "Call the committee chair immediately for a five-minute heads-up, then open the meeting with it: the fact, the window, how it was found, the exposure with stated confidence, the compensating evidence you do and do not have, the remediation with a date and owner, and the change to how you attest",
                detail: "Full disclosure, structured, with the chair not surprised in front of their own committee.",
                score: 3,
                outcome: "The chair takes the call, asks two questions, and thanks you for not letting them be surprised. In the meeting you take fifteen minutes instead of your planned five, the committee asks hard questions about the attestation process, and you leave with an agreed thirty-day report-back and an instruction to brief internal audit directly.",
                ripple: "You have converted a control failure into evidence that your governance works, which is the only trade available to you here. The attestation process change is what does the work: it tells the committee that the class of failure is addressed, not the instance. The chair now regards you as someone who protects them, and that relationship is worth more than the finding cost. Twelve months later, when you need a difficult budget decision supported, the chair is the person who asks the question that makes it happen.",
                isBest: true
              },
              {
                id: "opt-cfo-decides",
                label: "Brief the CFO and GC in the ten minutes before the meeting and let them decide whether it goes to the committee today",
                detail: "It respects the chain of command, gets legal eyes on it before disclosure, and it is genuinely their call how management speaks to the committee.",
                score: -1,
                outcome: "The CFO, under time pressure and without full facts, says to hold it until the analysis is complete. You comply. Two weeks later the GC, having thought about it properly, insists it be raised, and the committee now learns both the failure and that management deliberated about whether to tell them.",
                ripple: "This is the most tempting wrong answer because it is procedurally correct in form. But you have laundered your own obligation through a peer who had ten minutes and incomplete information, and you have created a decision record about disclosure timing that is far more damaging than the underlying control gap. Consulting the GC is right; asking a peer to absorb your disclosure judgement under time pressure is not. If you want their input, bring it to them the moment you know, not ten minutes before the room.",
                isBest: false
              },
              {
                id: "opt-no-conclusion",
                label: "Open with it, but frame it as an in-progress finding with no exposure conclusion yet and commit to a full analysis in two weeks",
                detail: "Honest, avoids overstating what you know, and does not commit to numbers you cannot yet support.",
                score: 0,
                outcome: "The committee accepts it, but the chair asks three times for a bound on the exposure and you decline each time. The tone in the room shifts. In the executive session afterwards the chair asks the CEO whether security has the analytical capability to answer that question at all.",
                ripple: "Refusing to bound the exposure reads as evasion even when it is epistemic caution, because a committee cannot act on no conclusion yet. You always have something: the number of privileged accounts in scope, whether any of them showed anomalous activity, what the compensating telemetry does and does not cover. A bounded statement with explicit uncertainty — we have reviewed the authentication logs for all forty-one accounts and found no anomalous access, though we cannot rule out activity that would not appear in that source — is both honest and actionable. Caution without a bound is indistinguishable from unpreparedness.",
                isBest: false
              }
            ],
            debrief: "The best answer contains two moves that most people get only half right. The first is the chair call. It is not about seeking permission and it is not about softening the blow; it is about ensuring that the person accountable for the committee's oversight is never surprised in front of their own committee. That single act of protection buys you a durable ally, and it costs five minutes. The second is the last element of the structure: the change to how you attest. A control failure is a fact; a governance failure is a pattern. If you disclose only the control gap, the committee is left to wonder how many other attestations rest on the same unverified basis, and they will ask. If you arrive with the mechanism change — automated verification that the job ran, an exception that fires when the control produces no output, a quarterly evidence sample rather than a management assertion — you have answered the unasked question and converted the event from evidence of weakness into evidence of a functioning system. Notice too that the two failing options fail in opposite directions: one over-delegates the disclosure judgement, one under-commits to a conclusion. Both are attempts to avoid personally owning a hard statement in a hostile room, and the room can always tell.",
            principle: "Bad news travels with a structure: the fact, the window, the found-by, the bounded exposure, the mechanism fix, and the change to how you assure. Never surprise the person who is accountable for overseeing you."
          },
          awards: ["award-bad-news-standing", "award-mechanism-not-instance"],
          glossary: ["attestation", "control-failure", "governance-finding", "compensating-evidence", "bounded-exposure"]
        },
        {
          id: "ch-ciso-s-board-packet",
          kind: "field",
          title: "Build And Survive A Board Packet",
          statement: "A board packet is not a document, it is an instrument that has to survive a hostile reader two years later.",
          minutes: 40,
          respect: 165,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Write it for three readers at once",
              body: "A board packet has three audiences and most CISOs write for only the first. Reader one is the director in the meeting, who has twelve minutes and wants the exposure, the change, and the decision. Reader two is the audit committee chair reading carefully the night before, who will check whether last quarter's commitments were met and will notice any number that moved without explanation. Reader three is a hostile lawyer reading it in discovery in two years, asking what the company knew and when it knew it. The third reader is the one who disciplines your writing. Anything you would not want read aloud in that context should not be in the packet — and, equally important, anything you know and did not say is also going to be examined. The discipline is not to write less. It is to write accurately, with dates, with stated uncertainty, and without adjectives that could be characterised as reassurance."
            },
            {
              kind: "table",
              title: "Packet rubric",
              headers: ["Dimension", "Strong", "Weak"],
              rows: [
                ["Front matter", "Three slides: exposure, what changed, the decision", "Agenda, programme overview, and a maturity model"],
                ["Numbers", "Every figure carries a denominator, a source, and a date", "Percentages with no denominator and no as-of date"],
                ["Uncertainty", "Explicitly stated where confidence is low and what would raise it", "Uniform confident tone throughout"],
                ["Continuity", "Opens with the status of every commitment from last meeting, including the ones nobody chased", "No reference to prior commitments"],
                ["Ownership", "Every risk has a named business owner who is not you", "Security owns everything on the register"],
                ["The ask", "One decision, option set, recommendation, cost of no, and the date the option expires", "Multiple asks, or none"],
                ["Appendix", "Deep enough that any front-slide claim can be traced to evidence", "Absent, or a copy of the front slides in more words"],
                ["Language", "Would survive being read aloud by opposing counsel", "Contains the words robust, world-class, or fully mitigated"]
              ]
            },
            {
              kind: "checklist",
              title: "Pre-flight",
              items: [
                "Every number on the front three slides has an appendix page and I know its number without looking",
                "I can state the denominator and the known gaps for each metric in one sentence",
                "Prior-meeting commitments each have a status line, including any that slipped, with the reason",
                "There is exactly one decision request and it has a cost-of-no and an expiry date",
                "Nothing in the document asserts a level of assurance I could not evidence within a day",
                "The GC has read the packet and is comfortable with every characterisation in it",
                "I have pre-briefed the committee chair, the CFO, and my own manager individually",
                "I have decided the single sentence I want repeated after I leave the room"
              ]
            },
            {
              kind: "callout",
              title: "Two words to remove from every packet you ever write",
              body: "Mitigated and ensure. Fully mitigated is a claim of completeness that is almost never true and that a plaintiff's lawyer will read back to you with the relevant residual risk highlighted. Ensure claims a guarantee you cannot deliver. Replace them with reduced from X to Y as measured by Z, and designed to, respectively. This is not lawyerly hedging; it is precision, and precision is what makes the rest of your claims believable. The same applies to robust, best-in-class, and industry-leading, all of which signal that you are selling rather than reporting — and in the SolarWinds matter it was exactly the specific, checkable assertions in a public security statement that survived a motion to dismiss when the vaguer promotional language did not."
            },
            {
              kind: "metric",
              title: "What the packet is measured on afterwards",
              body: "You will not get direct feedback on a board packet. The measurable signals are indirect and you should track them deliberately over three or four meetings.",
              items: [
                "Number of clarifying questions about what a number means, which should trend toward zero",
                "Number of questions about what to do about it, which should trend upward — that is engagement, not confusion",
                "Whether the decision you requested was actually made in the meeting rather than deferred",
                "Whether a director quotes your framing back to you or to management in a later meeting, which is the strongest available signal that the narrative landed",
                "Whether you are asked to come back more often, which is usually good, or given less time, which is usually not"
              ]
            }
          ],
          praxis: "Produce a complete board packet for a real organisation you work in, advise, or have permission to model: three front slides plus an appendix of no fewer than six pages in which every front-slide claim is traceable to a source, a date, and a denominator. Include a status line for a set of prior commitments, whether real or constructed from the last available reporting. Then deliver it live to at least two people who are not security practitioners — ideally one finance and one legal — and have them attack it. Record every question asked, classify each as clarifying or engaging, and revise. Deliver a second time to a different pair and measure whether the clarifying-question count fell.",
          evidence: "Attach to your Praxis Profile: the redacted packet in both versions, a question log with each question classified as clarifying or engaging and attributed by role rather than by name, a short written diff explaining the three most significant changes between versions and what triggered each, and a one-paragraph statement of the sentence you wanted repeated after you left the room and whether it was. Redact all organisation-identifying material and any real exposure figures.",
          awards: ["award-board-packet", "award-hostile-reader"],
          glossary: ["board-packet", "cost-of-no", "clarifying-question", "discovery-read"]
        }
      ]
    },
    {
      id: "ch-ciso-p-portfolio",
      title: "The Portfolio",
      credential: "Certified in Security Portfolio and Investment Management",
      summary: "Money, tools, people, and the metrics that decide all three. Covers budget construction in scenarios rather than a single number, headcount justification on unit economics, the discipline of killing a tool without losing coverage, building a metrics tree from business objectives downward, and recognising the moment a metric becomes a target and stops telling you anything.",
      competencies: [
        "Construct a security budget in run, grow, and transform layers with defensible drivers",
        "Present investment as scenarios with named risk deltas rather than a single number",
        "Justify headcount using absorbed toil, unit economics, and the counterfactual",
        "Retire a tool without silently losing detection or control coverage",
        "Build a metrics tree that descends from business objectives to operational measures",
        "Detect and counter Goodhart effects in security measurement and compensation"
      ],
      seal: "seal-the-portfolio",
      steps: [
        {
          id: "ch-ciso-s-budget-construction",
          kind: "lesson",
          title: "Building A Budget That Survives The Cut",
          statement: "Never present a number; present three scenarios and let the business choose which risk it is buying down.",
          minutes: 30,
          respect: 110,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The single-number ask is a request to be cut",
              body: "A budget presented as one number invites exactly one response: can you do it for less. You will always answer yes, because you can always do something for less, and you have now negotiated against yourself in public. The alternative is to present the same work as three scenarios — flat, moderate, and ambitious — each stated in terms of what it buys and, more importantly, what it does not. This shifts the conversation from how much do you need to which risks are we choosing to carry, which is a question the business is actually equipped to answer and which produces a decision that has a named owner. It also protects you when the answer is flat, because the flat scenario already documented, in advance and without emotion, what would not be covered. That document is the single most valuable artifact you will have if the uncovered thing happens."
            },
            {
              kind: "table",
              title: "Three layers, three different arguments",
              headers: ["Layer", "What it is", "The argument that funds it", "How it gets cut"],
              rows: [
                ["Run", "Keeping existing controls operating: licences, staff, on-call, the SOC, identity infrastructure", "Non-discretionary. Frame as the cost of the current control posture; a cut here is a decision to reduce posture, and should be named as such", "Silently, through a licence renewal that gets renegotiated down in seat count without anyone modelling the coverage loss"],
                ["Grow", "Extending existing capability to more of the estate or raising its quality", "Coverage gap plus a named loss scenario. This is where the ground-truth denominators earn their keep", "Deferred a quarter at a time until the capability is stale"],
                ["Transform", "New capability, architectural change, or eliminating a class of risk permanently", "Business enablement or structural cost reduction, almost never fear. Tie it to a revenue, velocity, or audit-cost outcome", "First, always, because it is the only layer without an incumbent defender"]
              ]
            },
            {
              kind: "numbered",
              title: "Building the number bottom-up so you can defend it top-down",
              items: [
                "Start from the ranked exposure statement, not from last year's budget. Last year's budget encodes last year's fears and someone else's vendor relationships.",
                "For each of the top exposures, write the intervention that changes its position, and price it fully: licence, implementation labour, ongoing operational load in FTE-fractions, and the integration cost with what you already run. The operational load is the line that new CISOs omit and it is usually the largest.",
                "Separate the price of maintaining position from the price of improving it. Most security budgets grow because run cost grows silently while everyone argues about the grow line.",
                "Assemble three scenarios by cutting from the bottom of the ranked list, not by cutting a uniform percentage from every line. Uniform percentage cuts are how you end up with nine capabilities that are all slightly non-functional.",
                "For each scenario, write the explicit uncovered set: the named exposures that remain at current position, with owners. This is the paragraph the CFO will actually read.",
                "Bring the scenarios to the CFO's team before the consolidation pass, in their format, with your arithmetic exposed. A finance partner who can reproduce your numbers becomes an advocate; one who cannot becomes a filter."
              ]
            },
            {
              kind: "metric",
              title: "Benchmarks: useful as a sanity check, weak as an argument",
              body: "The 2025 IANS and Artico Search benchmark of several hundred CISOs found security budget growth of about four percent, down from roughly eight percent the prior year and the slowest in five years; security spend as a share of IT spend fell to roughly eleven percent, breaking a multi-year upward trend; staffing growth was around seven percent; more than half of respondents reported flat or shrinking budgets, and only about one in nine described their team as adequately staffed.",
              items: [
                "Use a benchmark to check whether your ask is plausible, never as the reason for it",
                "A CFO can always find a peer set where you look expensive; peer comparison is a symmetric weapon",
                "The benchmark that actually moves money is your own industry's loss experience, not your own industry's spending",
                "If your ask is above benchmark, say so first and explain the company-specific reason, before someone else says it for you"
              ]
            },
            {
              kind: "compare",
              title: "Two budget asks",
              left: {
                title: "The ask that lands",
                items: [
                  "Three scenarios with explicit uncovered sets",
                  "Every line traces to a ranked exposure with a named business owner",
                  "Operational load priced in FTE-fractions, not just licence cost",
                  "Includes at least one proposed reduction you found yourself",
                  "Arrives before the finance consolidation pass, in finance's format",
                  "States what would make you come back mid-year and ask for more"
                ]
              },
              right: {
                title: "The ask that dies",
                items: [
                  "One number, plus a stretch number nobody believes",
                  "Lines traced to framework gaps and analyst quadrants",
                  "Licence cost only; implementation and run load unstated",
                  "No proposed reductions, which signals you have not examined your own portfolio",
                  "Arrives as a board slide after allocation is settled",
                  "Implies this ask ends the conversation permanently"
                ]
              }
            },
            {
              kind: "callout",
              title: "Bring your own cut",
              body: "Always walk into a budget conversation with a reduction you found yourself — a tool you are retiring, a contract you renegotiated, a process you automated that frees a headcount, a service you are handing back to the business. This does three things simultaneously. It proves you manage a portfolio rather than accumulate one, it establishes that you have already looked so the CFO does not need to go looking, and it buys you standing to defend the lines you are not offering. A CISO who never proposes a cut is presumed to have slack everywhere, and finance will find it for you with far less precision than you would have."
            }
          ],
          awards: ["award-scenario-budget", "award-bring-your-own-cut"],
          glossary: ["run-grow-transform", "uncovered-set", "funding-scenario", "operational-load"]
        },
        {
          id: "ch-ciso-s-headcount",
          kind: "lesson",
          title: "Headcount: The Hardest Ask In The Portfolio",
          statement: "Nobody funds a headcount because you are busy; they fund it because you showed what it absorbs and what happens without it.",
          minutes: 28,
          respect: 160,
          trust: 7,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Why headcount is harder than money",
              body: "A tool is a line item that can be cancelled. A person is a permanent cost, a management obligation, a recruiting cycle, and a signal about organisational shape. Consequently headcount asks face a much higher evidentiary bar than spend asks of the same size, and the arguments that work for software fail completely here. Busy does not fund a role — everyone is busy. Coverage gaps do not fund a role by themselves, because the obvious counter is automation. What funds a role is a demonstration that a specific, measurable body of work exists, that it is currently being absorbed at a cost you can name, that the absorption is degrading something the business cares about, and that the alternatives — automate, outsource, defer, stop doing it — have been examined and priced. The last element is what separates a funded ask from a declined one, because it proves you tried not to ask."
            },
            {
              kind: "numbered",
              title: "The four-part headcount case",
              items: [
                "The work: a measured body of demand, in units. Tickets per week, reviews per sprint, alerts per shift, assessments per quarter, with the trend over at least two quarters. Measured, not estimated — if you cannot measure it, instrument it for six weeks before you ask.",
                "The current absorption: exactly who is absorbing it now and what they stopped doing to absorb it. The most persuasive form is a senior engineer's time reallocated from engineering to toil, because it names a specific value destruction. If your principal engineer spends forty percent of their week on access reviews, say that in salary terms.",
                "The alternatives, priced and rejected with reasons: automation cost and lead time, managed service cost including the integration and oversight load, the cost of simply not doing the work expressed as the risk position that changes, and the deferral cost. Present the one you would choose if headcount is denied, and mean it.",
                "The counterfactual: what specifically degrades over the next two quarters without the role, expressed in something the business measures — response time, review latency blocking releases, audit findings, customer commitments missed, on-call attrition risk."
              ]
            },
            {
              kind: "table",
              title: "Roles and the argument that actually funds each",
              headers: ["Role", "What it absorbs", "The measurable relief", "What happens without it"],
              rows: [
                ["Detection engineer", "Alert tuning, detection coverage against a named technique set, and the backlog of untested detections", "False positive rate, detection coverage against prioritised techniques, mean time to first meaningful alert", "Analyst attrition, alert fatigue, and detections that decay silently until they are all noise"],
                ["Security platform engineer", "Building and running paved-road controls consumed by engineering", "Adoption rate of secure defaults, and reviews avoided per quarter", "Every control becomes a manual review and your team becomes a queue"],
                ["Identity engineer", "Joiner-mover-leaver, entitlement review, non-human identity lifecycle", "Orphaned account count, review cycle time, privileged account count", "The single most common initial access path stays open, and audit findings compound"],
                ["GRC analyst", "Customer security questionnaires, audit evidence, exception lifecycle", "Sales cycle days saved, audit hours reduced, exceptions expiring on time", "Engineers do compliance work badly, which is the most expensive possible way to do it"],
                ["Deputy or chief of staff", "Programme management, board material, portfolio administration, and your succession", "Your reallocated hours, and continuity when you are unavailable", "You are the single point of failure for the entire function, which is itself a risk on your register"]
              ]
            },
            {
              kind: "callout",
              title: "The toil ceiling, borrowed from SRE",
              body: "Google's SRE practice caps toil — manual, repetitive, automatable, reactive work that scales linearly with service growth — at fifty percent of a team's time, with the remainder reserved for engineering that reduces future toil. Import this cap explicitly into your security team and publish it. It converts a subjective complaint about being overloaded into an objective threshold that has been breached, and it gives you a principled answer to the automation counter-argument: we cannot automate our way out because we are above the ceiling and have no engineering capacity to build the automation. That is a specific, falsifiable claim, and it is the strongest headcount argument available to a security function."
            },
            {
              kind: "list",
              title: "Traps in the headcount conversation",
              items: [
                "The contractor substitution: contractors are correct for bounded projects and wrong for functions requiring institutional context. Accepting contractors for ongoing operational work converts a headcount problem into a knowledge-retention problem that is worse and less visible",
                "The managed service that requires a headcount to manage: every outsourced function needs an internal owner who can evaluate its output, and if you do not budget for that owner you have bought an unaudited black box",
                "Backfill erosion: an unfilled role held open for two quarters becomes evidence that the role was not needed. Track time-to-fill and escalate at sixty days, not at six months",
                "Level compression: accepting a junior req instead of the senior one you needed, then discovering that the work required judgement rather than throughput",
                "Asking for two when you need one, expecting to be halved. Finance partners you will work with for years remember this, and it destroys the credibility of every number you present afterwards"
              ]
            },
            {
              kind: "metric",
              title: "The number that reframes the ask",
              body: "Compute and publish the fully loaded cost of the work currently being absorbed. If four senior engineers each spend a quarter of their time on manual access reviews, that is one full-time equivalent of your most expensive labour, delivered badly, with no career progression attached to it.",
              items: [
                "State it as: we are already spending this; the question is whether we spend it deliberately and at the right level",
                "Attach the quality argument: the work is being done by people who resent it and are not evaluated on it",
                "Attach the retention argument, which is the one that moves executives who have recently lost a senior engineer"
              ]
            }
          ],
          awards: ["award-headcount-case", "award-toil-ceiling"],
          glossary: ["toil", "toil-ceiling", "counterfactual-cost", "fully-loaded-cost", "level-compression"]
        },
        {
          id: "ch-ciso-s-kill-a-tool",
          kind: "drill",
          title: "How To Kill A Tool",
          statement: "Consolidation is a coverage argument, not a cost argument, and the difference is whether you can name what you lose.",
          minutes: 26,
          respect: 180,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The accumulated portfolio",
              body: "Every security programme older than four years contains tools that exist because of an incident, a previous leader's relationship, a compliance question that has since changed, or a proof of concept nobody formally ended. Gartner survey work has found large majorities of organisations pursuing vendor consolidation, and notably found that the primary motivation was reducing operational complexity and improving risk posture rather than licence savings — most respondents did not expect to spend less. That distinction matters enormously for how you argue it internally. If you sell consolidation as savings, you will be held to the savings and you will lose the operational benefit when finance takes the money. If you sell it as complexity reduction and coverage clarity, you keep the freed capacity and you get to redeploy it."
            },
            {
              kind: "numbered",
              title: "The retirement sequence that does not lose coverage",
              items: [
                "Enumerate what the tool uniquely provides, expressed as specific detections, controls, or evidence artifacts — not as product categories. Map each to the adversary technique or control objective it serves.",
                "Identify which of those the surviving tool provides, which it provides differently, and which nobody provides. The third list is the whole decision.",
                "Run a bounded comparison — three weeks, both tools live, same environment, an agreed detection or control set, with results published to the team before any decision.",
                "Write the coverage delta as a document with named accepted losses, each with an owner. If nobody will sign for the loss, you do not have consolidation, you have a gap.",
                "Migrate content, not just licences: detections, suppression logic, integrations, runbooks, and the institutional knowledge in someone's head. Budget the labour explicitly; it is usually the largest cost of the entire exercise.",
                "Run both in parallel for one full detection cycle, then decommission with a named owner and a date, and verify the decommission actually happened. Zombie tools that stay licensed because nobody closed the contract are extremely common."
              ]
            },
            {
              kind: "callout",
              title: "The political dimension nobody warns you about",
              body: "Tools have sponsors. Somebody selected it, defended it, built their reputation partly on it, and may have a relationship with the vendor's account team going back years. Killing a tool without engaging its sponsor privately first converts a portfolio decision into a personal defeat, and you will pay for it in every subsequent negotiation. The sequence is always: sponsor first, in private, with the data and a genuine invitation to argue; then the team; then the announcement. If the sponsor is your peer or your superior, the conversation is not about the tool at all, it is about giving them a way to be the person who made the call."
            }
          ],
          drill: {
            id: "ch-ciso-d-kill-a-tool",
            scene: "Budget season. The CFO has asked every function for a four percent reduction, which for you is one point four million dollars. Your portfolio has thirty-eight security products. Two of them overlap substantially in endpoint and workload detection; the older one costs nine hundred thousand a year, is deeply integrated into six runbooks, and was championed by your VP of Infrastructure, who is not in your reporting line and whose team you depend on for every rollout you will do this year. The newer one costs six hundred thousand, has broader cloud coverage, and your detection team prefers it. Renewal on the older tool is in eleven weeks.",
            clock: "11 weeks to the older tool's renewal date, 3 weeks to submit your reduction plan",
            pressure: "You need the money, you need the VP of Infrastructure for the next twelve months, and any coverage you silently lose becomes your fault the first time something gets through.",
            prompt: "How do you take the one point four million out?",
            options: [
              {
                id: "opt-lowest-utilisation",
                label: "Cut the products with the lowest measured utilisation across the portfolio, announce the list in the weekly staff meeting, and let owners raise objections afterwards",
                detail: "Data-driven, fast, avoids singling anyone out, and utilisation is an objective criterion nobody can argue with.",
                score: -1,
                outcome: "You hit the number. Six weeks later an intrusion is investigated and the forensic timeline has a four-day hole because a low-utilisation tool was the only source retaining a particular log type. Two of the retired products turn out to have been the sole evidence source for a customer contractual commitment.",
                ripple: "Utilisation measures how often people log in, not what a product uniquely provides. Low-utilisation tools are frequently the ones that run silently and correctly, which is what you want from a control. You also taught every peer executive that your portfolio decisions arrive as announcements, which means next time they will pre-emptively defend their tools to your boss rather than to you.",
                isBest: false
              },
              {
                id: "opt-bakeoff-delta",
                label: "Run a three-week parallel comparison on an agreed detection and control set, publish the coverage delta mapped to adversary techniques and named risks, engage the VP privately with the data before anyone else sees it, then retire with a signed acceptance for each named loss, a content migration plan, and a dated owner",
                detail: "Slower, evidenced, and it puts the sponsor inside the decision rather than outside it.",
                score: 3,
                outcome: "The comparison finds the older tool uniquely provides two detections and one forensic artifact. Two are reproduced on the surviving platform within the migration window; the third is accepted in writing by the VP of Infrastructure with a six-month revisit. You retire the tool, bank eight hundred thousand after migration labour, and find the remaining six hundred thousand from two zombie contracts the exercise surfaced.",
                ripple: "The coverage delta document becomes the template for every subsequent retirement, which is worth more than this one decision. The VP, having been consulted first and having personally signed the one accepted loss, becomes a co-owner of consolidation rather than an obstacle, and supports your rollout work for the next year. You have also established that nothing leaves your portfolio without someone naming what is lost, which is the discipline that prevents the slow silent erosion that kills programmes.",
                isBest: true
              },
              {
                id: "opt-defer-and-cut-people",
                label: "Keep every tool, renegotiate aggressively at each renewal for multi-year discounts, and find the one point four million by holding three open requisitions and reducing contractor spend",
                detail: "No capability is lost, no political fight is required, and vacancies are the least disruptive place to find money.",
                score: -3,
                outcome: "You hit the number without a single difficult conversation. Over the following year, three open roles disappear from the plan permanently, your detection engineering backlog stops moving, two analysts leave citing workload, and the portfolio still has thirty-eight products that nobody has time to operate properly.",
                ripple: "This is the most common and most damaging error in the discipline, and it is tempting precisely because it is frictionless. You have traded people for licences, which is exactly backwards: tools deliver value only through the human capacity to operate them, so cutting capacity while preserving tools reduces effective coverage twice over. Requisitions surrendered in a budget cycle are almost never returned, and you have quietly converted a one-year saving into a permanent structural reduction in your programme's ceiling.",
                isBest: false
              },
              {
                id: "opt-cut-the-sponsor",
                label: "Retire the VP of Infrastructure's tool first and explicitly, to demonstrate that portfolio decisions are made on merit and that no sponsor is protected",
                detail: "Establishes independence early, sets the precedent that data beats politics, and gets the hardest cut done while you have a budget mandate as cover.",
                score: -2,
                outcome: "You get the saving and a reputation for decisiveness that lasts about five weeks. The VP's team becomes procedurally cooperative and substantively slow: rollouts require formal requests, timelines stretch, and you learn about infrastructure changes after they ship.",
                ripple: "Independence demonstrated at someone's expense is not independence, it is a hostage-taking, and everyone else in the executive layer updates accordingly. The signal you intended — decisions are made on merit — is received as: this person will use a mandate to settle scope disputes. The identical outcome was available by engaging the sponsor privately with the same data forty-eight hours earlier, at a cost of one uncomfortable conversation.",
                isBest: false
              }
            ],
            debrief: "The core teaching is that consolidation is a coverage argument wearing a cost argument's clothes. The number the CFO asked for is real, but the decision that matters is which specific defensive capability the organisation is choosing to stop having, and the only artifact that makes that decision legitimate is a written coverage delta with named, owned, accepted losses. Two of the wrong answers avoid producing that artifact entirely. Utilisation-based cutting substitutes a proxy that is negatively correlated with what you care about, because well-designed controls run without anyone logging into them. Cutting people instead of tools avoids the artifact by avoiding the decision, and it is the single most consequential error here: it is fully reversible on paper and almost never reversed in practice, and it degrades the operating capacity that makes every remaining tool worth anything. The fourth option gets the analysis right and the sequence wrong, which is worth dwelling on, because in this job sequence frequently matters more than substance. The same decision, same data, same outcome, changes from a partnership to a defeat depending on whether the sponsor heard it from you privately or from a slide publicly. That forty-eight-hour difference is most of what senior stakeholder management actually is.",
            principle: "Nothing leaves the portfolio until someone has written down what is lost and signed for it. Cut tools before people, and tell the sponsor before you tell the room."
          },
          awards: ["award-coverage-delta", "award-portfolio-pruning"],
          glossary: ["coverage-delta", "zombie-contract", "tool-sponsor", "content-migration"]
        },
        {
          id: "ch-ciso-s-metrics-tree",
          kind: "lab",
          title: "Building A Metrics Tree From The Business Down",
          statement: "A metric that cannot be traced upward to a business objective and downward to an owner is decoration.",
          minutes: 38,
          respect: 175,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Most security metrics are built upward and that is why they fail",
              body: "The usual method is to start with what the tools emit — alert counts, patch percentages, training completion, findings closed — and then attempt to aggregate them into something executive-shaped. This never works, because the tool-level measures were designed to help operators run the tool, not to inform a resource decision. The correct construction runs the other way. Start from a small number of business objectives, derive the loss scenarios that threaten each, derive the control objectives that change those scenarios' position, and only then derive the operational measures that tell you whether the control objective is being met. Each node gets an owner, a denominator, a refresh cadence, and — the field everyone omits — the decision it would change. A measure that would not change any decision at any value is not a metric; it is telemetry, and it belongs in a dashboard nobody presents."
            },
            {
              kind: "code",
              title: "The tree as a declarative artifact under version control",
              lang: "yaml",
              body: "# metrics-tree.yaml\n# Rule of the tree: every node names the decision it changes.\n# If decision_changed is empty, delete the node.\n\nbusiness_objective:\n  id: bo-retain-enterprise-revenue\n  statement: 'Retain and grow revenue from the top 50 enterprise accounts'\n  owner: 'Chief Revenue Officer'\n\n  loss_scenarios:\n    - id: ls-customer-data-exposure\n      statement: 'Unauthorised access to multi-tenant customer data store'\n      owner: 'SVP Platform Engineering'\n      annualised_range_usd: [4200000, 31000000]\n      method: 'FAIR decomposition, LEF x LM, 90 percent confidence interval'\n      assumptions_that_move_it:\n        - 'number of records per tenant in the shared store'\n        - 'contractual liability caps in the top 10 agreements'\n\n      control_objectives:\n        - id: co-tenant-isolation\n          statement: 'A compromised tenant context cannot read another tenant data'\n          owner: 'Principal Engineer, Platform'\n          leading_measures:\n            - id: m-isolation-test-coverage\n              measure: 'percent of data access paths covered by an automated cross-tenant negative test'\n              denominator: 'paths enumerated from the API gateway route table, not from the test suite'\n              refresh: 'per merge to main'\n              owner: 'Platform Security Engineering'\n              decision_changed: 'whether a new data access pattern may ship without a paved-road review'\n              target: 100\n              current: 71\n            - id: m-privileged-read-alerting\n              measure: 'percent of cross-tenant read events producing an alert within 5 minutes in the last exercise'\n              denominator: 'synthetic events injected during quarterly purple-team, all paths'\n              refresh: 'quarterly'\n              owner: 'Detection Engineering'\n              decision_changed: 'whether detection headcount goes to this path or to identity'\n              target: 95\n              current: 62\n          lagging_measures:\n            - id: m-actual-crosstenant-events\n              measure: 'confirmed cross-tenant access events'\n              denominator: 'n/a - absolute count'\n              refresh: 'continuous'\n              owner: 'CISO'\n              decision_changed: 'incident declaration and disclosure assessment'\n              target: 0\n              current: 0\n              note: 'A zero here is not evidence of safety. It is only meaningful alongside m-privileged-read-alerting.'"
            },
            {
              kind: "code",
              title: "Control health with the denominator forced into the open",
              lang: "sql",
              body: "-- Control HEALTH is different from control COVERAGE.\n-- Coverage: how much of the estate the control applies to.\n-- Health:   whether the control actually executed and produced output.\n-- Most silent control failures are health failures, and almost nobody measures them.\n\nCREATE OR REPLACE VIEW control_health AS\nWITH expected AS (\n  SELECT\n    c.control_id,\n    c.control_name,\n    c.owner_team,\n    c.expected_runs_per_week,\n    generate_series(\n      date_trunc('week', current_date - INTERVAL '12 weeks'),\n      date_trunc('week', current_date),\n      INTERVAL '1 week'\n    ) AS week\n  FROM control_registry c\n  WHERE c.status = 'active'\n),\nobserved AS (\n  SELECT\n    control_id,\n    date_trunc('week', run_at) AS week,\n    count(*) FILTER (WHERE outcome = 'completed')  AS completed_runs,\n    count(*) FILTER (WHERE outcome = 'error')      AS errored_runs,\n    sum(records_evaluated)                         AS records_evaluated\n  FROM control_run_log\n  GROUP BY 1, 2\n)\nSELECT\n  e.control_id,\n  e.control_name,\n  e.owner_team,\n  e.week,\n  e.expected_runs_per_week,\n  coalesce(o.completed_runs, 0)  AS completed_runs,\n  coalesce(o.errored_runs, 0)    AS errored_runs,\n  coalesce(o.records_evaluated, 0) AS records_evaluated,\n  CASE\n    WHEN coalesce(o.completed_runs, 0) = 0 THEN 'SILENT_FAILURE'\n    WHEN coalesce(o.records_evaluated, 0) = 0 THEN 'RAN_BUT_EVALUATED_NOTHING'\n    WHEN o.completed_runs < e.expected_runs_per_week THEN 'DEGRADED'\n    ELSE 'HEALTHY'\n  END AS health_state\nFROM expected e\nLEFT JOIN observed o\n  ON o.control_id = e.control_id AND o.week = e.week\nORDER BY e.control_id, e.week;\n\n-- RAN_BUT_EVALUATED_NOTHING is the state that ends careers.\n-- The job succeeds, the dashboard is green, and the input was empty for five months."
            },
            {
              kind: "code",
              title: "A guard that refuses to let a metric exist without an owner or a decision",
              lang: "python",
              body: "# Run this in CI against metrics-tree.yaml.\n# The point is not validation. The point is that the schema itself\n# encodes the standard, so the argument happens at review time, once.\n\nimport sys\nimport yaml\n\nREQUIRED_MEASURE_FIELDS = (\n    'id', 'measure', 'denominator', 'refresh', 'owner', 'decision_changed'\n)\n\nBANNED_DENOMINATORS = (\n    'all assets',           # which inventory?\n    'total findings',       # from whose scanner?\n    'n/a',                  # allowed ONLY on absolute counts, checked below\n)\n\n\ndef walk_measures(tree):\n    for ls in tree['business_objective'].get('loss_scenarios', []):\n        for co in ls.get('control_objectives', []):\n            for bucket in ('leading_measures', 'lagging_measures'):\n                for m in co.get(bucket, []):\n                    yield ls['id'], co['id'], bucket, m\n\n\ndef check(path):\n    tree = yaml.safe_load(open(path))\n    errors = []\n\n    for ls_id, co_id, bucket, m in walk_measures(tree):\n        where = ls_id + ' / ' + co_id + ' / ' + str(m.get('id'))\n\n        for field in REQUIRED_MEASURE_FIELDS:\n            if not m.get(field):\n                errors.append(where + ' missing required field: ' + field)\n\n        d = str(m.get('denominator', '')).strip().lower()\n        if d in BANNED_DENOMINATORS and not d.startswith('n/a'):\n            errors.append(where + ' has an undefendable denominator: ' + d)\n\n        if d.startswith('n/a') and 'count' not in str(m.get('measure', '')).lower():\n            errors.append(where + ' uses n/a denominator but is not an absolute count')\n\n        if bucket == 'leading_measures' and m.get('refresh') == 'annual':\n            errors.append(where + ' is leading but refreshes annually, which makes it lagging')\n\n    for e in errors:\n        print('FAIL ' + e)\n    return 1 if errors else 0\n\n\nif __name__ == '__main__':\n    sys.exit(check(sys.argv[1]))"
            },
            {
              kind: "table",
              title: "Leading and lagging, with the pairing that makes each honest",
              headers: ["Lagging measure", "What it tells you too late", "The leading measure that predicts it", "The pair keeps you honest because"],
              rows: [
                ["Confirmed incidents", "That prevention failed, months after the decision that caused it", "Adoption rate of paved-road defaults in new services", "Zero incidents with low adoption means you were lucky, and the pair says so"],
                ["Mean time to detect", "Detection quality, only after a real intrusion", "Percentage of prioritised techniques with a tested detection and a verified log source", "Good MTTD on the three intrusions you found says nothing about the ones you did not"],
                ["Audit findings", "Control failure, one to twelve months after it started", "Control health state, weekly, including silent-failure detection", "A clean audit against a silently failed control is the worst possible combination"],
                ["Breach cost", "Everything, once", "Recovery time measured in an actual restore test from immutable media", "A recovery claim that has never been executed is a hypothesis"],
                ["Customer security escalations", "That the market has noticed", "Days of sales cycle consumed by security review, trended", "Rising review friction predicts escalations one to two quarters out"]
              ]
            },
            {
              kind: "callout",
              title: "Four fields or it does not ship",
              body: "Owner, denominator, refresh cadence, and the decision it changes. Enforce this in review, not in conversation, and enforce it on your own metrics first and most harshly. The discipline has a second-order effect that is more valuable than the metrics themselves: it forces you to discover which of your activities have no decision attached to them at all. In most programmes that is somewhere between a third and half of the reporting, and deleting it frees more analyst time than any tool you could buy."
            }
          ],
          awards: ["award-metrics-tree", "award-silent-failure-hunter"],
          glossary: ["metrics-tree", "control-health", "silent-failure", "leading-measure", "decision-changed"]
        },
        {
          id: "ch-ciso-s-goodhart",
          kind: "construct",
          title: "When A Measure Becomes A Target",
          statement: "The moment you put a security metric in a compensation plan, you have stopped measuring security and started measuring compliance with your metric.",
          minutes: 22,
          respect: 135,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "quote",
              body: "When a measure becomes a target, it ceases to be a good measure.",
              source: "Marilyn Strathern's formulation of Goodhart's law — the original economic statement concerned regulatory targets on statistical regularities, and the security version is identical in mechanism"
            },
            {
              kind: "prose",
              title: "The specific case of mean time to respond",
              body: "MTTR is the most commonly weaponised metric in security operations and it is instructive precisely because it is a genuinely useful diagnostic that becomes actively harmful the moment it becomes an objective. Consider what an analyst who is measured on MTTR can do. They can close ambiguous alerts faster, since an alert closed as benign stops the clock. They can push borderline cases to a queue that is measured differently. They can discourage the detection team from shipping noisy but high-value detections that would raise the average. They can avoid escalating, because escalation extends the measured interval. Every one of those behaviours improves the number and degrades security, and none of them requires anyone to act in bad faith — they are simply the rational responses to the incentive. Within two quarters your MTTR chart is beautiful and your dwell time on the intrusions that matter is unchanged or worse, because the cases that take longest to resolve are precisely the ones that were real."
            },
            {
              kind: "table",
              title: "The gaming catalogue and the counter-measure",
              headers: ["Metric used as a target", "How it is gamed, usually without malice", "The paired counter-metric"],
              rows: [
                ["Mean time to respond", "Fast closure of ambiguous alerts, reluctance to escalate, pressure against noisy but valuable detections", "Rate of alerts reopened or later found related to a real incident, plus true-positive yield by detection"],
                ["Vulnerability count reduction", "Scan scope narrowed, findings reclassified, risk-accepted in bulk, scanners tuned down", "Time-to-remediate distribution on internet-facing assets on the CISA KEV list, with the tail shown, plus scanned-asset count against an independent denominator"],
                ["Phishing simulation failure rate", "Progressively easier simulations, and staff learning to spot the simulation vendor rather than the phish", "Report rate and median time to report, plus outcomes when a real campaign lands"],
                ["Training completion", "Click-through completion with no retention", "Behaviour change in a measured task, or nothing at all — an unmeasurable metric should not be reported"],
                ["Patch compliance percentage", "Denominator shrinks as unmanaged assets fall out of the inventory", "Coverage of the inventory itself, measured from an independent source"],
                ["Detection coverage against a technique matrix", "Shallow detections written to claim a cell, never tested", "Percentage of claimed detections validated by adversary emulation in the last two quarters"],
                ["Number of security reviews completed", "Reviews become shallower to raise throughput", "Defects found post-review per hundred reviews, and review latency at the ninety-fifth percentile"]
              ]
            },
            {
              kind: "principle",
              body: "Every target metric must ship with a paired counter-metric that moves in the opposite direction when the first is gamed. Report the pair, always, on the same page, or you are reporting a number that has been optimised for you rather than measured."
            },
            {
              kind: "list",
              title: "Rules that keep measurement honest",
              items: [
                "Never put a gameable operational metric into individual compensation. Put outcomes and behaviours there instead, and reserve operational metrics for management diagnosis",
                "Report distributions rather than means whenever the tail is where the risk lives, which in security is almost always. A ninety-fifth percentile tells you about your worst days; a mean tells you about your median day, which is not the day you will be judged on",
                "Prefer coverage and health metrics to volume metrics. How much of the estate, and is the control actually running, beat how many things did we do",
                "Change your metric set deliberately every eighteen to twenty-four months and say why. Any fixed metric is being optimised against by the second year",
                "When a metric improves sharply, investigate before celebrating. Genuine security improvements are usually gradual; sharp improvements are usually definitional changes",
                "Publish the definition alongside the number, every time. Most metric disputes are definition disputes that were never surfaced"
              ]
            },
            {
              kind: "callout",
              title: "The one place a hard target is safe",
              body: "Targets are safe when the measure is externally defined, externally maintained, and not under your control. Remediation timelines against the CISA Known Exploited Vulnerabilities catalogue are the cleanest example available: you did not choose the list, you cannot quietly adjust its scope, the entries are dated, and the catalogue exists for reasons entirely independent of your performance review. That external immovability is exactly what makes it resistant to Goodhart pressure. When you need one hard, defensible number for a board, prefer a measure whose definition someone else controls."
            }
          ],
          awards: ["award-goodhart-guard", "award-paired-metric"],
          glossary: ["goodhart-effect", "paired-counter-metric", "true-positive-yield", "distribution-not-mean", "external-anchor"]
        }
      ]
    },
    {
      id: "ch-ciso-p-org",
      title: "Shape Is Strategy",
      credential: "Certified in Security Organisation Design and Talent Systems",
      summary: "The organisational chart is a security control. Covers the three canonical shapes and the failure mode each one buys, security as a product organisation with paved-road defaults and adoption as the primary metric, building and rolling out a paved road without spending your credibility, hiring for slope rather than intercept, interview signal that survives contact, and the reorganisation decision made under commercial pressure.",
      competencies: [
        "Choose deliberately between centralised, embedded, federated, and platform shapes and name the failure mode acquired",
        "Convert a security control from a mandate into a consumable product with an adoption metric",
        "Ship a paved-road control through a warn-then-block ladder without provoking organisational rejection",
        "Design an interview loop that produces signal about learning rate rather than current knowledge",
        "Build a bench with deliberate depth, rotation, and a named successor",
        "Restructure a security function without destroying the craft depth that makes it useful"
      ],
      seal: "seal-the-shape",
      steps: [
        {
          id: "ch-ciso-s-org-shapes",
          kind: "construct",
          title: "The Three Shapes And What Each One Costs",
          statement: "There is no correct security org shape, only a shape whose failure mode you have chosen on purpose.",
          minutes: 22,
          respect: 90,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Conway's law applies to defence",
              body: "Systems come to resemble the communication structures of the organisations that build them. The security corollary is sharper and less often stated: your security architecture will converge on your security org chart, whether you intend it or not. A centralised team produces centralised chokepoints — gateways, review boards, a single pane of glass — because that is where the people who build things sit relative to each other. An embedded model produces per-team variation and inconsistent depth, because each embedded engineer optimises locally. A platform model produces reusable defaults and a long tail of teams that have not adopted them. None of this is a defect. It is the mechanical consequence of where you put people, which is why org design is a technical decision that happens to involve humans, and why delegating it entirely to an HR business partner produces an architecture nobody chose."
            },
            {
              kind: "table",
              title: "Four shapes, honestly compared",
              headers: ["Shape", "When it is right", "What it produces", "Its characteristic failure", "The early tell"],
              rows: [
                ["Centralised", "Under about two hundred engineers, in a heavily regulated environment, or in the first year of a programme that needs coherence", "Consistency, deep craft, a defensible single risk picture", "Becomes a queue; engineering routes around it; security is the last gate and therefore the reason things are late", "Your team's primary metric becomes throughput of reviews"],
                ["Embedded", "When you have enough senior security engineers to place one credibly in each stream and enough seniority to protect them", "Contextual decisions, high trust, fast local resolution", "Absorption. Embedded engineers get pulled into feature work, lose craft currency, and start reporting the team's view rather than the risk", "Your embedded engineers stop attending security team rituals and their promo cases are written by product managers"],
                ["Federated", "Large, multi-business-unit organisations where local autonomy is genuine and unavoidable", "Local ownership, scalability, business-unit accountability", "Divergence. Twelve different definitions of critical, no aggregate risk picture, and standards that exist only on paper", "You cannot answer a board question about the whole company without a two-week data call"],
                ["Platform plus partnership", "Engineering-led organisations at scale, where secure defaults can be built into the delivery path", "Reusable defaults, leverage, adoption measurable as a single number", "The long tail. Legacy and acquired systems never adopt, and the platform team optimises for the teams that were easy", "Adoption plateaus around seventy percent and stops, and nobody owns the remainder"]
              ]
            },
            {
              kind: "list",
              title: "Spans, layers, and the numbers that hold up in practice",
              items: [
                "Five to eight direct reports is the workable band for a manager doing real work; below four you have a layer that exists for status, above nine one-to-ones become status reports and coaching stops",
                "You as CISO should have no more than six or seven directs, and if you have more you are functioning as a team lead rather than an executive",
                "Every layer costs roughly a week of latency on any decision that has to travel through it, and adds one translation loss on any signal travelling up",
                "Three layers between you and the most junior person is the practical limit before you lose contact with reality; at four you are managing a report of a report of a summary",
                "Detection and response requires enough people for a sustainable rotation. Below roughly six for follow-the-sun or eight for a fair local rotation, you are not staffing a function, you are creating an attrition schedule",
                "A single specialist with no peer is a bus-factor risk and a career dead end for the person; either pair them or buy the capability"
              ]
            },
            {
              kind: "compare",
              title: "Centralised and embedded, at the point where each breaks",
              left: {
                title: "Centralised, at breaking point",
                items: [
                  "Review queue latency is the top complaint in every engineering retro",
                  "Teams schedule around security review rather than through it",
                  "Your best engineers spend their time on other teams' contexts",
                  "You are informed of architectural decisions rather than consulted",
                  "Exception requests grow faster than reviews completed"
                ]
              },
              right: {
                title: "Embedded, at breaking point",
                items: [
                  "Embedded engineers describe their team's risk position in their team's language",
                  "Security craft skills decay because there is no peer group",
                  "Two teams solve the same problem three incompatible ways",
                  "You learn about a control decision at an incident review",
                  "The embedded engineer's manager, who is not you, writes their performance review"
                ]
              }
            },
            {
              kind: "principle",
              body: "Choose the shape whose failure mode you can detect early and afford. Then instrument specifically for that failure mode, because it is coming."
            },
            {
              kind: "callout",
              title: "Never reorganise to solve a people problem",
              body: "Restructuring to route around an individual is the most common and most expensive organisational error in this role. It costs every person whose reporting line moved, it signals to the whole function that structure is negotiable and personal, and it does not solve the problem — the individual is still there, now with a grievance and a narrative. If someone is in the wrong role, that is a performance conversation, and it is a conversation you owe them directly. Reorganisations should be justifiable in a sentence that contains no proper nouns."
            }
          ],
          awards: ["award-shape-chosen"],
          glossary: ["conways-law", "embedded-absorption", "span-of-control", "bus-factor", "federated-divergence"]
        },
        {
          id: "ch-ciso-s-platform-model",
          kind: "lesson",
          title: "Security As A Product Organisation",
          statement: "Turn every control you would have mandated into a product someone chooses, then measure adoption instead of compliance.",
          minutes: 32,
          respect: 145,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The mandate does not scale and the product does",
              body: "A mandate requires enforcement, and enforcement scales linearly with the number of teams while your headcount does not. The alternative, developed most publicly at Netflix and since adopted widely, is to treat security capability as a platform product: build the secure path so that it is also the fastest and easiest path, make it the default in the delivery toolchain, and then measure how many teams are on it. The public account of scaling application security at Netflix describes exactly this shift — from per-application security review toward secure-by-default central platforms for authentication, authorisation, secret storage, and certificates, with the security function split between a partnership squad that does high-touch work with the highest-risk teams and an automation squad that builds self-service capability for everyone else. The critical move is what happens to your metric. You stop counting vulnerabilities found and start counting adoption of the thing that makes the class of vulnerability structurally unlikely. That is a different job and it produces a different organisation."
            },
            {
              kind: "table",
              title: "The same control, two ways",
              headers: ["Dimension", "Control as mandate", "Control as product"],
              rows: [
                ["Primary metric", "Compliance percentage, exceptions outstanding", "Adoption rate, time-to-first-successful-use, retention"],
                ["Who bears the effort", "The engineering team, each time, individually", "The security platform team, once"],
                ["Failure response", "Escalate to the team's leadership", "Treat non-adoption as a product defect and go find out why"],
                ["Relationship to velocity", "A tax on shipping", "A shortcut that happens to be secure"],
                ["Evidence for audit", "Collected by asking teams", "Emitted by the platform automatically as a by-product"],
                ["What happens when you leave", "Enforcement decays and the control quietly dies", "The default remains in the toolchain and keeps working"],
                ["What it demands of you", "Authority you do not have", "Engineering investment and product discipline you must fund"]
              ]
            },
            {
              kind: "numbered",
              title: "Converting a control into a product",
              items: [
                "Pick the control that consumes the most review time across teams. That is your highest-leverage candidate, because the review time is the budget for building the product.",
                "Find the fastest existing path a team takes to accomplish the underlying goal, and make the secure version of that path faster than the insecure one. If secure is slower, adoption will be driven entirely by enforcement, and you are back to a mandate with extra steps.",
                "Ship it with documentation written for someone who does not care about security and has forty minutes. The correct length of a paved-road getting-started guide is one page.",
                "Instrument adoption from day one, per team, with an owner. Adoption you cannot see is adoption you cannot manage, and the number will be the argument for your next headcount.",
                "Run the deprecation ladder deliberately: available, then default-on for new work, then warn on the old path, then block the old path, with a published date for each rung and a real exception route.",
                "Treat the teams who do not adopt as your research programme, not as violators. There is nearly always a legitimate reason — a runtime you do not support, a latency budget, an acquired stack — and it is the most valuable product feedback you will get."
              ]
            },
            {
              kind: "callout",
              title: "Cognitive load is the constraint you are actually managing",
              body: "The Team Topologies framing is that a platform team exists to reduce the cognitive load of stream-aligned teams, and that a team's capacity for domain complexity is finite and already spent on their own domain. Every security requirement you add consumes some of that fixed budget, and beyond a threshold teams do not comply badly — they comply nominally, which looks like compliance and is not. This gives you a hard design test for any security requirement: does a stream-aligned engineer need to understand it in order to do the right thing? If yes, you have imposed load, and load is repaid in shortcuts. If no, because the default handles it, you have spent your team's cognitive budget instead of theirs, which is exactly what a platform team is for."
            },
            {
              kind: "metric",
              title: "The four numbers a security platform team runs on",
              body: "These replace vulnerability counts as the primary operating metrics, and they are the ones to put in front of an engineering leadership audience because they are the same numbers any internal platform team is measured on.",
              items: [
                "Adoption: percentage of services on the paved road, by team, against an independent service inventory",
                "Time to first successful use: how long from a team deciding to adopt to their first working deployment on the path. Above a day, adoption stalls",
                "Reviews avoided: manual security reviews not required because the team is on the paved road, converted into hours and named as capacity returned to engineering",
                "Escape rate: defects of the class the paved road is supposed to prevent, found in production on services that were on the paved road. This is the honesty check, and if you do not publish it nobody will believe the other three"
              ]
            },
            {
              kind: "quote",
              body: "Instead of asking how an application does an important security thing, ask whether it is using the product that handles it.",
              source: "The operative reframing behind the Netflix paved-road model, as described in public engineering writing on scaling application security — it converts an open-ended assessment question into a boolean you can measure across thousands of services"
            }
          ],
          awards: ["award-security-as-product", "award-adoption-metric"],
          glossary: ["paved-road", "platform-team", "cognitive-load", "escape-rate", "partnership-squad"]
        },
        {
          id: "ch-ciso-s-paved-road-lab",
          kind: "lab",
          title: "Shipping A Paved Road Without Burning Credibility",
          statement: "Ship the guardrail in warn mode first; you get exactly one chance to break everyone's build.",
          minutes: 40,
          respect: 200,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The rollout is the product",
              body: "Most paved-road efforts fail at rollout rather than at engineering. A team builds a technically excellent guardrail, turns it on as a blocking gate, breaks forty builds in an afternoon, and spends the next eighteen months as the team that broke the builds. The organisational memory of that afternoon outlives the control. The alternative is a deliberate ladder with published dates: observe silently, then warn with a clear remediation path, then block only for new work, then block everywhere, with a real and fast exception route at every rung. This takes a quarter instead of a week, and it is the difference between a control that survives and a control that gets an executive exemption. The engineering underneath is genuinely the easy part."
            },
            {
              kind: "code",
              title: "A guardrail with an explicit enforcement mode, driven by a dated ladder",
              lang: "yaml",
              body: "# .github/workflows/paved-road-gate.yml\n# The enforcement mode is data, not code. The ladder is published,\n# the dates are in the repo, and nobody is surprised on a Tuesday.\n\nname: paved-road-gate\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\njobs:\n  gate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Resolve enforcement mode for this repo\n        id: mode\n        run: |\n          # modes: observe | warn | block-new | block-all\n          # Ladder dates live in policy/ladder.yaml, reviewed in the open.\n          python3 tooling/resolve_mode.py \\\n            --repo ${{ github.repository }} \\\n            --ladder policy/ladder.yaml \\\n            --out mode.txt\n          echo mode=$(cat mode.txt) >> $GITHUB_OUTPUT\n\n      - name: Evaluate controls\n        id: eval\n        continue-on-error: true\n        run: python3 tooling/evaluate_controls.py --format json --out findings.json\n\n      - name: Report\n        run: |\n          python3 tooling/report.py \\\n            --findings findings.json \\\n            --mode ${{ steps.mode.outputs.mode }} \\\n            --remediation-url https://paved.internal/fix \\\n            --exception-url https://paved.internal/exception\n\n      - name: Enforce\n        if: steps.mode.outputs.mode == 'block-new' || steps.mode.outputs.mode == 'block-all'\n        run: python3 tooling/enforce.py --findings findings.json --mode ${{ steps.mode.outputs.mode }}\n\n---\n# policy/ladder.yaml\ncontrol: require-workload-identity-not-static-keys\nowner: security-platform\nrungs:\n  - mode: observe\n    from: 2026-01-06\n    note: 'Silent. We are measuring the true blast radius before we tell anyone.'\n  - mode: warn\n    from: 2026-02-03\n    note: 'Annotated PR comment with a one-page fix and an owner to ask.'\n  - mode: block-new\n    from: 2026-03-16\n    note: 'New repositories and new services only. Existing paths untouched.'\n  - mode: block-all\n    from: 2026-05-11\n    note: 'Announced 12 weeks in advance. Exception route stays open and is 24h SLA.'\nexception:\n  route: 'paved.internal/exception'\n  max_duration_days: 90\n  approver: 'service owner director, countersigned by security platform'\n  expiry_behaviour: 'auto-reopens the finding and notifies the approver, not the engineer'"
            },
            {
              kind: "code",
              title: "Adoption measured against an independent service inventory",
              lang: "python",
              body: "# Adoption measured from the paved road's own telemetry always looks great,\n# for the same reason endpoint coverage always looks great. Use a denominator\n# the platform team does not control: the deployment system's service registry.\n\nimport collections\nimport datetime\n\n\ndef adoption_report(service_registry, paved_road_users, ownership):\n    # service_registry: every service that has deployed to prod in 30 days,\n    #                   from the DEPLOYMENT system, not from us.\n    # paved_road_users: services observed using the paved-road identity path.\n    active = {s['name'] for s in service_registry\n              if s['last_prod_deploy'] > datetime.date.today() - datetime.timedelta(days=30)}\n    adopted = active & set(paved_road_users)\n    laggards = active - set(paved_road_users)\n\n    by_team = collections.defaultdict(lambda: {'total': 0, 'adopted': 0, 'names': []})\n    for svc in active:\n        team = ownership.get(svc, 'UNOWNED')\n        by_team[team]['total'] += 1\n        if svc in adopted:\n            by_team[team]['adopted'] += 1\n        else:\n            by_team[team]['names'].append(svc)\n\n    rows = []\n    for team, d in by_team.items():\n        pct = round(100.0 * d['adopted'] / d['total'], 1) if d['total'] else 0.0\n        rows.append((team, d['total'], d['adopted'], pct, d['names'][:5]))\n\n    # Sort by REMAINING work, not by percentage. A team at 40 percent with\n    # 2 services matters far less than a team at 85 percent with 60.\n    rows.sort(key=lambda r: r[1] - r[2], reverse=True)\n\n    unowned = [s for s in laggards if ownership.get(s) is None]\n    return {\n        'overall_pct': round(100.0 * len(adopted) / len(active), 1) if active else 0.0,\n        'by_team': rows,\n        'unowned_services': unowned,   # this list is a finding in itself\n    }\n\n\n# The escape-rate check. Publish it even when it is embarrassing,\n# because the credibility of the other three numbers depends on it.\ndef escape_rate(incidents, adopted_services, control_class):\n    relevant = [i for i in incidents if i['class'] == control_class]\n    on_road = [i for i in relevant if i['service'] in adopted_services]\n    return {\n        'total_of_class': len(relevant),\n        'occurred_on_paved_road': len(on_road),\n        'note': 'A non-zero value here is a product defect, not a user error.',\n    }"
            },
            {
              kind: "table",
              title: "The rollout ladder, and what each rung is actually for",
              headers: ["Rung", "Duration", "What it is for", "What you learn", "The mistake"],
              rows: [
                ["Observe", "Two to four weeks", "Measuring true blast radius before anyone knows", "How many teams and services would have been hit, and which are unowned", "Skipping it because you are confident; the count is always higher than you think"],
                ["Warn", "Four to six weeks", "Teaching the fix and testing whether it is actually followable", "Whether your remediation doc works on a real repo you did not write", "A warning with no one-page fix and no named human to ask"],
                ["Block new", "Six to eight weeks", "Stopping the growth of the problem while leaving existing work alone", "Whether the exception route is fast enough to be used rather than escalated around", "Blocking existing pipelines at this rung, which is the credibility-burning error"],
                ["Block all", "Announced twelve weeks ahead", "Closing it", "Which teams have a genuine structural blocker you did not know about", "Moving the date, which teaches everyone that dates are negotiable"]
              ]
            },
            {
              kind: "checklist",
              title: "Before you turn on any enforcement rung",
              items: [
                "A one-page fix that a stranger can follow in under forty minutes without asking anyone",
                "A named human, not a mailbox, who answers questions during the first two weeks of each rung",
                "An exception route with a published turnaround under one working day and a hard maximum duration",
                "Exception expiry that reopens the finding and notifies the approving director rather than the engineer",
                "The blast radius measured in observe mode, shared with engineering leadership before the warn rung",
                "A rollback switch you can pull in under five minutes, and one person besides you who knows how",
                "Adoption instrumented against an independent inventory, with unowned services surfaced separately"
              ]
            },
            {
              kind: "callout",
              title: "The exception route is the load-bearing component",
              body: "A guardrail with a slow or hostile exception process does not produce compliance; it produces circumvention, and circumvention you cannot see is strictly worse than the original risk because you have lost visibility as well. Make the exception route fast, low-friction, and slightly public — visible to peers — and make expiry automatic with notification going to the approving director rather than the engineer. Fast and visible converts the exception process from an adversarial gate into an accurate risk register that maintains itself, which is the single most useful artifact this entire lab produces."
            }
          ],
          awards: ["award-paved-road-shipped", "award-warn-before-block"],
          glossary: ["enforcement-ladder", "blast-radius", "exception-route", "escape-rate", "unowned-service"]
        },
        {
          id: "ch-ciso-s-hiring-slope",
          kind: "lesson",
          title: "Hiring For Slope, Interviewing For Signal",
          statement: "Hire the rate of change, not the current position, because the current position expires in eighteen months.",
          minutes: 30,
          respect: 140,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Intercept and slope",
              body: "Every candidate can be described by two numbers: where they are now, and how fast they move. Intercept is what a resume measures — tools known, certifications held, environments operated. Slope is the rate at which they acquire new competence, and it is the only one that compounds. Security is a domain where the intercept decays unusually fast, because the substrate changes: the cloud provider ships a new identity primitive, the adversary changes their access vector, an entire class of control becomes irrelevant. A person hired for deep expertise in a specific product is, three years later, an expert in something you may no longer run. A person with steep slope is, three years later, running the thing you have not bought yet. Hire for slope at every level except one — when you need a specific scarce capability under time pressure to close a live gap, buy the intercept deliberately and knowingly, and understand that you are buying a depreciating asset."
            },
            {
              kind: "table",
              title: "Signals, how to elicit them, and how each is faked",
              headers: ["Signal", "How to elicit it", "What a genuine positive sounds like", "The convincing false positive"],
              rows: [
                ["Slope", "Ask them to teach you something they learned in the last six months, in depth, including what they got wrong at first", "Structured explanation with the confusions named and the moment it clicked", "A fluent summary of a well-known topic that could have been read yesterday"],
                ["Debugging under uncertainty", "Give a real, partially-observable failure and let them ask you for information. Charge them nothing for questions and everything for conclusions", "Hypothesis, cheapest disconfirming test, revision when the answer surprises them", "A confident correct answer arrived at instantly, which usually means they have seen this exact case"],
                ["Judgement about risk", "Present a scenario with no good options and a real deadline. Ask what they would do and what they would tell whom", "Names the tradeoff explicitly, chooses, and states what would change their mind", "A textbook answer that assumes resources and time the scenario did not offer"],
                ["Ownership", "Ask about something that went badly where they were responsible", "Specific, includes their own contribution to the failure, and describes a mechanism they changed", "A story where the failure was upstream, the lesson was communication, and the fix was a process someone else owns"],
                ["Working with engineers", "Ask them to describe a time they were overruled on a security decision", "They understood why, kept the relationship, and either changed the constraint later or accepted it honestly", "They were right, the company suffered, and they left"],
                ["Written thinking", "A short written exercise: one page on a real ambiguous decision, done on their own time with a hard length limit", "Structure, admitted uncertainty, a recommendation", "Length as a substitute for structure, or perfect prose with no decision in it"]
              ]
            },
            {
              kind: "numbered",
              title: "A loop that produces signal instead of consensus",
              items: [
                "Define, before the first candidate, the two or three signals this specific role turns on, and assign each signal to exactly one interviewer who owns it. Unassigned signals get assessed by everyone shallowly and nobody deeply.",
                "Give every interviewer a different signal. Four people all assessing general competence produces four correlated opinions and the illusion of a strong signal.",
                "Use real artifacts. A redacted incident from your own history, a real architectural decision you actually faced, a genuine piece of ambiguous telemetry. Puzzles measure puzzle skill.",
                "Require written scores before the debrief, submitted independently. Verbal debriefs converge on whoever speaks first and most confidently, which is a measurement of your panel, not the candidate.",
                "In the debrief, ask each interviewer for the strongest evidence against their own conclusion. This one question changes more hiring outcomes than any other intervention available to you.",
                "Have someone own the no. A default-yes loop with no assigned skeptic will hire pleasant people who interview well, which is a distinct and much larger population than people who do the job well."
              ]
            },
            {
              kind: "list",
              title: "Building a bench, which is the part nobody does",
              items: [
                "Name a successor for yourself in writing, to your boss, within your first year. It costs you nothing, it is what a serious executive does, and the median tenure data says it will matter",
                "Two-deep every critical function. If exactly one person can run the incident bridge, restore from backup, or explain the identity architecture, that is an operational risk that belongs on your register with the others",
                "Rotate deliberately: detection engineers into incident response, GRC analysts into platform work, platform engineers into an on-call cycle. Rotation is how you find out who has slope",
                "Give away the parts of your job that develop people: let a senior engineer own a board appendix section, let a manager run the budget scenario build, let someone else chair the exception review",
                "Hire at least one person who is better than you at something central. If you cannot name that person, you have hired for comfort",
                "Track internal promotion rate as a first-class metric. A function that never promotes internally is a function that will lose everyone good at year three, and the recruiting cost of that is invisible in your budget and enormous"
              ]
            },
            {
              kind: "callout",
              title: "The interview question that predicts the most",
              body: "Ask: tell me about a security decision you got wrong, how you found out, and what you changed as a result. Weak candidates cannot produce one, or produce one where the error was someone else's and the lesson was that they should have been listened to. Strong candidates produce a specific decision, name their own reasoning error rather than a communication failure, describe how the feedback reached them, and identify a mechanism — not an intention — that they changed. This single question tests calibration, ownership, and slope simultaneously, and it is nearly impossible to fake convincingly because the fabricated version always locates the error outside the speaker."
            }
          ],
          awards: ["award-hire-for-slope", "award-bench-built"],
          glossary: ["slope-vs-intercept", "signal-ownership", "independent-scoring", "two-deep", "internal-promotion-rate"]
        },
        {
          id: "ch-ciso-s-reorg",
          kind: "drill",
          title: "The Reorganisation You Have To Get Right",
          statement: "Org design is the one act of leadership you cannot delegate and cannot cheaply undo.",
          minutes: 28,
          respect: 195,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Restructuring is a one-shot instrument",
              body: "You get roughly one significant reorganisation per two years before the function stops believing that structure means anything. Each one costs about a quarter of productivity, resets every informal relationship your people had built with engineering, and puts your best individual contributors in play on the external market for about six weeks. That cost is worth paying when the current shape is structurally incapable of the outcome you need. It is never worth paying to signal decisiveness, to route around a person, or to match a shape that worked at your previous company. Before you move a single box, write the sentence that explains what the new shape makes possible that the old one could not, and test whether that sentence survives being read by a skeptical staff engineer."
            },
            {
              kind: "list",
              title: "Questions to answer in writing before any restructure",
              items: [
                "What specific outcome is the current shape structurally unable to produce, as distinct from currently not producing?",
                "Which teams will now have to talk to each other who did not before, and is that the actual bottleneck?",
                "What craft depth exists today that this shape might disperse, and how will it be preserved?",
                "Who loses scope, and have I spoken to each of them personally before anyone else hears?",
                "What is the interface each new team publishes — what it does, what it does not, and how to ask?",
                "What will I measure in ninety days to know whether this worked, and what result would make me revert?"
              ]
            }
          ],
          drill: {
            id: "ch-ciso-d-reorg",
            scene: "You have been in the chair fourteen months. Twenty-two people, six directs: appsec, detection and response, GRC, identity, infrastructure security, and a two-person platform team. The company has grown from four hundred to eleven hundred engineers in eighteen months and just closed an acquisition adding two hundred more on a stack you do not support. Your review queue latency is now eleven days at the median and engineering leadership has raised it twice with the CTO. Two of your strongest appsec engineers have told you privately they are bored. Your budget is flat next year. The CTO has offered to fund four heads if you can show a shape that scales.",
            clock: "Three weeks to bring a proposal to the CTO before headcount planning closes",
            pressure: "Flat budget, four conditional heads, a queue that is now an executive-visible problem, and two flight risks who are your best people.",
            prompt: "What shape do you propose?",
            options: [
              {
                id: "opt-embed-everything",
                label: "Embed security engineers into the highest-velocity product organisations and keep a small central policy and governance team",
                detail: "It is the modern consensus answer, it eliminates the queue by eliminating the gate, and it puts security where the decisions are made.",
                score: -1,
                outcome: "The queue disappears within six weeks and engineering leadership is delighted. By month seven, four of the six embedded engineers are doing feature work, two have had their performance reviews written primarily by product managers, and you cannot answer a board question about aggregate posture without a manual data call. One of your two bored appsec engineers leaves, citing lack of craft peers.",
                ripple: "Embedding without a platform underneath converts a queue problem into an absorption problem, which is harder to see and much harder to reverse. The queue was visible and generated complaints; absorption generates nothing but a slow decline in craft depth and consistency that surfaces two years later as a serious incident on a team everyone believed was covered. Embedding is a genuine and correct pattern, but it is the second move, not the first: it works when there is a platform for embedded engineers to pull from and a strong home-team identity to return to.",
                isBest: false
              },
              {
                id: "opt-platform-partnership",
                label: "Restructure into a security platform team owning paved-road defaults, a partnership function with named partners for the four highest-risk engineering organisations, and a consolidated detection and response core; publish a service catalogue with a review SLO and use the four heads on the platform team",
                detail: "Attacks the queue by removing the need for most reviews rather than by staffing the queue, and gives the bored engineers a building job.",
                score: 3,
                outcome: "You propose it with a ninety-day measurement plan: review queue latency, paved-road adoption, and reviews avoided. Six months later median review latency is under two days because sixty percent of services no longer require a review, both flight risks are building the platform and have stayed, and the acquisition's unsupported stack is a named, dated, unowned-services line item rather than an invisible gap.",
                ripple: "The deeper win is that the shape gives you a story that scales past this headcount conversation. Adoption and reviews-avoided are numbers the CTO already knows how to read from their own platform organisations, which converts your next funding request from a security argument into an engineering-productivity argument. You have also created a home for craft depth — the platform team — which is the structural answer to the boredom problem and the retention problem simultaneously. The risk you have bought is the long tail: adoption will plateau, and you must name an owner for the remainder now, in the proposal, or it will belong to nobody.",
                isBest: true
              },
              {
                id: "opt-staff-the-queue",
                label: "Keep the current shape and use the four heads to staff the review function, adding a triage tier so that low-risk changes get a fast path",
                detail: "Directly addresses the executive-visible problem, requires no disruption, and a risk-tiered fast path is a well-established practice.",
                score: -2,
                outcome: "Latency drops to four days within a quarter and engineering stops complaining. Eighteen months later the company has nineteen hundred engineers, the queue is at nine days again, and you are asking for four more heads with a weaker argument than last time because the previous four demonstrably did not solve it.",
                ripple: "This is the most seductive wrong answer because it works, briefly, and it is low-risk in the quarter it is proposed. But review demand scales with engineering headcount while your team does not, so staffing a queue buys time at a fixed exchange rate and buys nothing structural. You have also spent your one conditional headcount opportunity on labour rather than leverage, and told the CTO — who funds platform teams for exactly this reason in their own organisation — that security is a function that scales linearly with people. That framing will cost you every future funding conversation.",
                isBest: false
              },
              {
                id: "opt-delegate-design",
                label: "Hire a strong deputy with the four heads and have them design the structure, since they will be the one operating it day to day",
                detail: "Delegation, developing a leader, and the person closest to the work designing the work.",
                score: -3,
                outcome: "Recruiting takes five months. The headcount planning window closes without a proposal and the four heads are reallocated. The deputy arrives to inherit the same queue, no funded plan, and an engineering organisation that now believes security cannot answer a structural question.",
                ripple: "Org design in the first two years is the CISO's non-delegable act, for the same reason architecture is not delegated to the newest engineer: it encodes a theory of how the function creates value, and only the person accountable for that value can hold the theory. There is a further problem — a deputy hired to design their own structure has every incentive to design one that maximises their scope, and no accumulated context about which political constraints are real. Delegate the operation. Own the shape.",
                isBest: false
              }
            ],
            debrief: "The generative insight is that a queue is a symptom of a missing product, not of insufficient staff. When demand for a service scales with the size of the engineering organisation and supply scales with your headcount, no amount of staffing changes the trajectory — you are simply choosing how often you have this conversation. The platform-plus-partnership shape breaks the coupling by removing the requirement for most of the demand, which is why adoption and reviews-avoided become the operating metrics rather than throughput. Note how the three wrong answers each optimise a real and legitimate value: embedding optimises proximity to decisions, staffing the queue optimises the visible executive complaint, and delegation optimises leadership development. All three values are correct in isolation. What makes them wrong here is sequence and structure — embedding is the right second move and the wrong first one, staffing the queue is right when demand is bounded and wrong when it scales with the company, and delegation is right for operation and wrong for the encoding of your theory of value. Finally, observe what the best option does politically: it translates a security proposal into the vocabulary of platform engineering, which is a language the CTO already speaks and already funds. Most of what looks like influence at this level is finding the frame in which your request is an ordinary request.",
            principle: "A queue means a missing product. Design the shape that removes demand rather than the shape that absorbs it, and never delegate the encoding of how your function creates value."
          },
          awards: ["award-shape-that-scales", "award-queue-to-product"],
          glossary: ["review-slo", "service-catalogue", "long-tail-adoption", "absorption-risk", "leverage-versus-labour"]
        }
      ]
    },
    {
      id: "ch-ciso-p-standing",
      title: "Standing",
      credential: "Certified in Security Executive Standing, Liability, and Leverage",
      summary: "The durable half of the job: where your leverage comes from, what it costs you personally, and where to push. Covers reporting-line politics and what each line does to your influence, personal legal exposure after the Sullivan conviction and the SolarWinds matter including written-record discipline and D and O terms, the risk-acceptance instrument built as a machine-checked artifact, the refusal that preserves the relationship, and systems-thinking leverage points applied to a security programme.",
      competencies: [
        "Evaluate a reporting line by the conflicts it creates rather than by its apparent seniority",
        "Manage personal legal exposure through record discipline, counsel engagement, and insurance terms",
        "Operate a risk-acceptance instrument where business owners, not security, carry the risk",
        "Refuse a request in a way that preserves the relationship and produces a better decision",
        "Build coalitions with legal, privacy, finance, and engineering leadership before you need them",
        "Locate and pull the highest-leverage intervention points in a security programme"
      ],
      seal: "seal-standing",
      steps: [
        {
          id: "ch-ciso-s-reporting-line",
          kind: "lesson",
          title: "Reporting Line Politics",
          statement: "The reporting line matters far less than who owns the risk register and who signs the acceptance.",
          minutes: 26,
          respect: 105,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The question people ask, and the question that matters",
              body: "Security leaders spend an enormous amount of energy on where the role should report, usually arguing for the CEO on the grounds of independence. The argument is not wrong but it is badly framed, because a reporting line grants proximity, not authority, and proximity to a CEO who does not want the detail is worth less than a strong relationship with a CIO who will actually move resources. What determines your effective influence is a different set of facts: who owns the risk register, who signs risk acceptances, whether you have unmediated access to the audit committee chair, whether you are in the room when architecture and strategy are decided, and whether your budget can be cut by a peer without a conversation. Optimise those five. If you get them, the reporting line is largely cosmetic. If you do not get them, reporting to the CEO buys you a better title and the same powerlessness with a shorter path to being blamed."
            },
            {
              kind: "table",
              title: "Five lines, honestly",
              headers: ["Reports to", "Leverage gained", "Leverage lost", "The structural conflict", "Works when"],
              rows: [
                ["CIO", "Resources, operational reach, credibility with infrastructure, and a boss who understands your constraints", "Independence on anything where security findings reflect on IT delivery", "Your boss is accountable for the availability and cost that your controls affect, and for the systems your findings criticise", "The CIO is genuinely senior, your findings on their estate reach the audit committee unfiltered, and you have direct committee access"],
                ["CTO", "Proximity to engineering decisions, product influence, and the paved-road model becomes natural", "Enterprise IT, corporate systems, and physical or personnel security tend to fall out of scope entirely", "Velocity is your boss's primary objective and your constraints are the friction", "The company is product-led, your scope is honestly limited to product security, and someone else owns enterprise risk"],
                ["CEO", "Visibility, convening power, and the ability to name a risk without it being filtered", "Detail-level support, a boss who understands the work, and often practical resourcing help", "The CEO has ten priorities and yours is not usually one; you may get thirty minutes a quarter", "The CEO is genuinely engaged, or regulatory context requires demonstrable independence"],
                ["General counsel", "Privilege applied naturally, a boss who thinks about record and obligation, strong alignment on disclosure discipline", "Engineering credibility, and a tendency for the programme to be pulled toward compliance and away from build", "Legal risk management can crowd out engineering risk reduction; not everything should be run under privilege", "The dominant exposure is regulatory or contractual, or the company is in or approaching litigation"],
                ["Chief risk officer", "Integration into enterprise risk, native quantification, appetite language already exists, and board access is normal", "Distance from engineering, and a slower operating tempo than incident work requires", "Second-line functions are structurally not permitted to build, and much of security is building", "Financial services or similarly regulated sectors with a mature three-lines model and a separate operational security team"]
              ]
            },
            {
              kind: "list",
              title: "The five facts to negotiate, in priority order",
              items: [
                "Unmediated access to the audit committee chair, at your request, without pre-clearance",
                "Business owners sign risk acceptances; security records and prices them but does not own them",
                "You are a named participant in architecture review and in the strategy planning cycle, not a reviewer of its output",
                "Your budget cannot be reallocated by a peer function without a conversation involving your boss",
                "You have a written mandate specifying what you can block and how disagreements escalate, with a clock"
              ]
            },
            {
              kind: "callout",
              title: "The dotted line is the cheapest thing you will ever ask for",
              body: "A dotted line to the audit committee, or simply a documented right to request a private session with the chair, costs your organisation nothing and is the single structural protection that survives a change of boss, a change of CEO, and a change of your own standing. It is also the mechanism that makes the difference in the scenario every CISO fears: being told to characterise something in a way you believe is inaccurate. Ask for it during onboarding when it reads as governance hygiene. Asking for it in month twenty reads as an accusation, and will be refused for that reason."
            },
            {
              kind: "metric",
              title: "Reporting line as disclosed fact",
              body: "Item 106 of Regulation S-K requires public registrants to describe management's role in assessing and managing material cybersecurity risks, including the relevant management positions and their expertise, as well as the board's oversight. This makes your reporting structure and your access to the board something the company states publicly.",
              items: [
                "Read your own company's disclosure language and check whether it describes a process you actually operate",
                "If the filing says the CISO reports quarterly to the audit committee, that cadence is now a commitment with securities implications",
                "This is leverage: a governance structure that has been publicly described is much harder for a peer to quietly erode"
              ]
            }
          ],
          awards: ["award-line-and-leverage"],
          glossary: ["reporting-line", "dotted-line", "three-lines-model", "unmediated-access"]
        },
        {
          id: "ch-ciso-s-liability",
          kind: "lesson",
          title: "Personal Exposure And The Written Record",
          statement: "The lesson of the last five years is not to write less down; it is to write the truth down in the right instrument.",
          minutes: 34,
          respect: 185,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "What actually changed",
              body: "For most of this profession's history, the personal downside of the role was reputational: you were fired after a breach and you found another job. That changed in a specific and traceable way. A chief security officer was criminally convicted for conduct surrounding the concealment of a breach and had that conviction affirmed on appeal. A sitting CISO spent two years as a named defendant in a securities enforcement action before it was dropped. Mandatory public disclosure of material incidents on a short clock became law for US registrants, along with a requirement to describe governance. The net effect is not that the role became dangerous in general — the overwhelming majority of CISOs face no personal legal exposure whatsoever — but that a specific narrow band of conduct became genuinely hazardous: participating in a decision to conceal, making or permitting inaccurate public statements about security posture, and creating records that misrepresent what you knew. Everything in this step is about staying out of that band without becoming the kind of leader who stops writing things down."
            },
            {
              kind: "timeline",
              title: "The sequence every CISO should be able to recite",
              items: [
                "2016 — Uber suffers a breach affecting data on roughly fifty-seven million users and six hundred thousand drivers, while the company is already engaged with the FTC over a prior 2014 incident. The intruders are paid one hundred thousand dollars, routed through a bug bounty programme, and made to sign nondisclosure agreements.",
                "October 2022 — After trial in the Northern District of California, the former CSO is convicted of obstruction of an FTC proceeding and of misprision of a felony. This is the first criminal conviction of a security executive for conduct in the handling of a breach.",
                "May 2023 — Sentence imposed: three years of probation, a fifty thousand dollar fine, and community service, against a government request for fifteen months of imprisonment.",
                "July 2023 — The SEC adopts its cybersecurity disclosure rules: Item 1.05 of Form 8-K, generally four business days after a materiality determination, and Item 106 of Regulation S-K on risk management processes and board oversight.",
                "October 2023 — The SEC sues SolarWinds and its CISO personally, alleging misleading disclosures and, novelly, that cybersecurity deficiencies violated the internal accounting controls provision.",
                "July 2024 — The court dismisses most of the case, rejecting the attempt to stretch internal accounting controls to cover cybersecurity, and rejecting general promotional statements as non-actionable puffery. What survives is narrower: specific, checkable claims in a public security statement about access controls and password practices.",
                "March 2025 — The Ninth Circuit affirms the CSO's conviction, rejecting the argument that a post-hoc nondisclosure agreement could retroactively legitimise the intruders' access.",
                "November 2025 — The SEC dismisses its remaining claims against SolarWinds and its CISO with prejudice. The enforcement threat recedes; the underlying discipline does not, because private securities litigation, contractual claims, and state regulators all remain."
              ]
            },
            {
              kind: "table",
              title: "Where exposure actually comes from",
              headers: ["Exposure", "What triggers it", "What protects you"],
              rows: [
                ["Obstruction or concealment", "Participating in a decision to withhold from a regulator or investigator, or characterising an incident to avoid an obligation", "Ask the pre-existing-obligation question on day one and again at every incident; escalate to counsel before any characterisation is fixed; never be the sole decision-maker on disclosure"],
                ["Securities claims", "Public statements about security posture that are specific, checkable, and untrue, including on a marketing page or trust centre", "Own the review of every external security claim; version them; keep dated evidence that each specific assertion was true when made"],
                ["Disclosure-control failure", "Material facts known to security that do not reach the people making the materiality determination", "A documented escalation path with defined thresholds, exercised in tabletops with legal and finance present"],
                ["Contractual liability", "Customer commitments about controls, notification windows, or certifications that the programme does not meet", "Review security terms before signature; maintain a register of contractual security commitments and test against it"],
                ["Employment consequence", "Being made the accountable party for a decision that was made above you", "Contemporaneous written recommendations sent to the decision-maker, retained; a mandate memo; and D and O terms negotiated at hire"]
              ]
            },
            {
              kind: "list",
              title: "Written-record discipline that helps rather than harms",
              items: [
                "Write recommendations, not predictions. We recommend X because Y; if X is not funded, exposure Z remains at its current position is defensible. This will cause a breach is not, and is usually wrong",
                "Send the recommendation to the person who can decide, and keep it. A recommendation that lives only in your own notes protects nobody, including you",
                "Separate observation from inference explicitly in every incident record. The log shows A is a fact; we believe this indicates B is an inference; both belong in the record, labelled",
                "Do not speculate about attribution, motive, or legal consequence in writing during an incident. Those judgements belong to counsel and are almost never load-bearing for your decisions",
                "Understand what privilege actually covers and what it does not. Routing ordinary engineering work through counsel to obtain privilege is both ineffective and corrosive; genuine investigative work directed by counsel for legal advice is different",
                "Never create a document whose purpose is to be found later. It reads exactly as what it is, and it destroys the credibility of the records that were written honestly",
                "Keep your own contemporaneous decision log: date, decision, options considered, who decided, what you recommended. It is not a weapon; it is how you remember your own reasoning eighteen months later, which is what you will actually need it for"
              ]
            },
            {
              kind: "callout",
              title: "The insurance conversation to have at hire, in writing",
              body: "Confirm four things before you accept the role and get the answers by email: that the directors and officers policy names or covers your position, not merely the board and the named executive officers; that there is Side A difference-in-conditions coverage that responds when the company cannot indemnify you; that the indemnification agreement includes advancement of legal fees rather than reimbursement after the fact, because advancement is what determines whether you can afford counsel in month one; and that you may retain independent counsel if the company's interests and yours diverge. Ask for a copy of the indemnification agreement. This conversation is completely normal for senior executives, it is expected by any competent general counsel, and asking for it costs you nothing except the discomfort of asking."
            },
            {
              kind: "principle",
              body: "Never be the only person who knows something material, and never be the only person who decides how it is characterised. Both of those conditions are where careers end, and both are avoidable by escalating early to a named counterpart."
            }
          ],
          awards: ["award-record-discipline", "award-liability-literate"],
          glossary: ["misprision", "legal-privilege", "side-a-dic", "advancement-of-fees", "disclosure-controls", "materiality"]
        },
        {
          id: "ch-ciso-s-risk-acceptance",
          kind: "lab",
          title: "The Risk-Acceptance Instrument",
          statement: "You do not accept risk; you price it, record it, and make the person who owns the upside sign for the downside.",
          minutes: 36,
          respect: 170,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The most misused instrument in governance",
              body: "In most organisations the risk acceptance is a formality: an engineer wants an exception, security writes a paragraph, someone approves it, and it is never seen again. Used properly it is the single most powerful tool available to a CISO without formal authority, because it does something no policy can do — it moves the risk from your ledger to the ledger of the person who is receiving the benefit. That transfer is legitimate and healthy. The business is entitled to accept risk; it is entitled to ship the feature, keep the legacy system, defer the migration. What it is not entitled to do is accept the risk implicitly, without pricing it, without naming who owns it, and without a date on which the acceptance is revisited. Your job is not to prevent risk acceptance. Your job is to make it explicit, owned, priced, and expiring."
            },
            {
              kind: "code",
              title: "The record, as a machine-checkable artifact in version control",
              lang: "yaml",
              body: "# risk-acceptances/2026-03-ra-0117.yaml\n# Every field exists because a field like it was once missing\n# and the resulting argument cost someone their job.\n\nid: ra-2026-0117\ntitle: 'Legacy reporting service retains customer records without field-level encryption'\nstatus: active\n\nrequested_by:\n  name: 'Director, Revenue Operations'\n  reason: 'Migration would take two quarters and blocks Q2 revenue reporting commitments'\n\n# The person who signs is the person who receives the BENEFIT.\n# Not security. Not the engineer. The one whose objective this protects.\naccepted_by:\n  name: 'SVP Revenue Operations'\n  authority_basis: 'Risk magnitude below the 5M USD threshold delegated to SVP level per RM-POL-004'\n  signed_at: '2026-03-11'\n\nexposure:\n  scenario: 'Unauthorised read of the reporting datastore exposes 2.1M customer records in cleartext'\n  method: 'FAIR decomposition, reviewed with Enterprise Risk'\n  loss_event_frequency_per_year: [0.02, 0.14]\n  loss_magnitude_usd: [3100000, 19000000]\n  annualised_range_usd: [62000, 2660000]\n  confidence: 'moderate - magnitude driven by contractual liability caps in 4 agreements'\n  assumptions_that_move_it:\n    - 'record count in the reporting store, currently growing 4 percent per month'\n    - 'whether the top-4 contracts renew with the current liability caps'\n\ncompensating_controls:\n  - control: 'Network path restricted to the reporting VPC; no internet route'\n    owner: 'Infrastructure Security'\n    verified_at: '2026-03-10'\n    verification_method: 'automated route-table assertion, runs daily'\n  - control: 'Alert on any read exceeding 10k rows by a non-service principal'\n    owner: 'Detection Engineering'\n    verified_at: '2026-03-09'\n    verification_method: 'synthetic event injected, alert fired in 2m11s'\n\n# Expiry is not optional. An acceptance without an expiry is a policy change\n# made by one person without anyone noticing.\nexpires_at: '2026-09-11'\nreview_cadence: 'quarterly'\non_expiry:\n  action: 'reopen as an active finding'\n  notify: ['SVP Revenue Operations', 'CISO', 'Enterprise Risk']\n  note: 'Notification goes to the ACCEPTOR, not to the engineer. The engineer cannot renew this.'\n\ninvalidated_if:\n  - 'record count exceeds 3M'\n  - 'any internet route is added to the reporting VPC'\n  - 'the detection above fails its monthly verification twice consecutively'\n  - 'a contract in the top-4 renews without the current liability cap'\n\nlinked_risk_register_entry: 'RR-088'\nlinked_finding: 'FND-2025-3391'"
            },
            {
              kind: "code",
              title: "The daemon that makes the instrument real",
              lang: "python",
              body: "# An acceptance register that nobody enforces is a filing cabinet.\n# This runs daily. It is the reason the instrument has teeth.\n\nimport datetime\nimport glob\nimport yaml\n\nTODAY = datetime.date.today()\nWARN_DAYS = 30\n\n\ndef load_all(path_glob='risk-acceptances/*.yaml'):\n    for path in sorted(glob.glob(path_glob)):\n        with open(path) as fh:\n            yield path, yaml.safe_load(fh)\n\n\ndef check_expiry(ra):\n    expires = datetime.date.fromisoformat(ra['expires_at'])\n    days = (expires - TODAY).days\n    if days < 0:\n        return ('EXPIRED', days)\n    if days <= WARN_DAYS:\n        return ('EXPIRING', days)\n    return ('CURRENT', days)\n\n\ndef check_compensating_controls(ra, control_health):\n    # An acceptance is only valid while its compensating controls actually run.\n    # This is the check almost nobody implements, and it is the whole point:\n    # the acceptance was granted on the strength of these controls existing.\n    broken = []\n    for c in ra.get('compensating_controls', []):\n        state = control_health.get(c['control'], 'UNKNOWN')\n        if state != 'HEALTHY':\n            broken.append((c['control'], state))\n    return broken\n\n\ndef check_invalidation_triggers(ra, telemetry):\n    tripped = []\n    for condition in ra.get('invalidated_if', []):\n        if telemetry.evaluate(condition):\n            tripped.append(condition)\n    return tripped\n\n\ndef run(control_health, telemetry, notifier):\n    for path, ra in load_all():\n        if ra.get('status') != 'active':\n            continue\n\n        state, days = check_expiry(ra)\n        broken = check_compensating_controls(ra, control_health)\n        tripped = check_invalidation_triggers(ra, telemetry)\n\n        acceptor = ra['accepted_by']['name']\n\n        if state == 'EXPIRED':\n            notifier.reopen_finding(ra['linked_finding'])\n            notifier.notify(ra['on_expiry']['notify'],\n                            subject='Risk acceptance ' + ra['id'] + ' has expired and the finding is reopened')\n\n        elif state == 'EXPIRING':\n            notifier.notify([acceptor],\n                            subject='Risk acceptance ' + ra['id'] + ' expires in ' + str(days) + ' days')\n\n        if broken:\n            # This is an escalation, not a reminder. The basis of the\n            # acceptance no longer holds, so the acceptance no longer holds.\n            notifier.escalate(\n                to=[acceptor, 'CISO', 'Enterprise Risk'],\n                subject='Compensating control failure invalidates ' + ra['id'],\n                detail=broken,\n            )\n\n        if tripped:\n            notifier.escalate(\n                to=[acceptor, 'CISO', 'Enterprise Risk'],\n                subject='Invalidation trigger met for ' + ra['id'],\n                detail=tripped,\n            )"
            },
            {
              kind: "table",
              title: "Why each field exists",
              headers: ["Field", "The failure it prevents"],
              rows: [
                ["Accepted-by with an authority basis", "The classic disaster: a manager accepts a risk far above their delegated authority, and after the event nobody accepts that the acceptance was valid"],
                ["Quantified exposure with a range", "Acceptance of a risk nobody sized, which means nobody could have decided rationally and everybody will claim they were misled"],
                ["Assumptions that move it", "The exposure was sized correctly and then quietly grew by an order of magnitude while the acceptance stayed unchanged"],
                ["Compensating controls with verification method and date", "The acceptance rests on a control that silently stopped running, which is the most common way an acceptance becomes fiction"],
                ["Expiry with mandatory reopen", "Permanent exceptions, which are policy changes made by one person without governance"],
                ["Notify the acceptor rather than the engineer", "Renewal by the person least empowered to challenge it, and quiet perpetual rollover"],
                ["Invalidation triggers", "The acceptance remaining nominally valid after the world changed underneath it"],
                ["Link to the risk register entry", "Aggregate blindness: forty individually reasonable acceptances summing to an exposure nobody has ever seen totalled"]
              ]
            },
            {
              kind: "callout",
              title: "The aggregation report is the one that changes behaviour",
              body: "Once a quarter, total every active acceptance by business unit and by risk category, and present the aggregate to the executive team and to the risk or audit committee. Individually, every acceptance was reasonable — that is precisely why it was granted. In aggregate they frequently reveal an exposure position that no one would have approved deliberately, and that nobody has ever seen because it was never assembled. This report requires no authority to produce, contains no accusation, and is often the single highest-leverage artifact a CISO without formal power can create. It works because it converts a thousand small local decisions into one visible global fact, which is exactly the mechanism by which information flow changes system behaviour."
            },
            {
              kind: "checklist",
              title: "Instrument hygiene",
              items: [
                "No acceptance without a named individual, an authority basis, and a signature",
                "No acceptance without a sized exposure, even if the sizing is a wide range with low confidence",
                "No acceptance without an expiry date, and no expiry longer than twelve months",
                "Compensating controls carry a verification method and a last-verified date that a job maintains, not a human",
                "Expiry notification goes to the accepting executive, and expiry reopens the finding automatically",
                "The register is aggregated and reported quarterly, by business unit, to the executive team",
                "Security never appears in the accepted-by field; if the only available signer is you, escalate rather than sign"
              ]
            }
          ],
          awards: ["award-risk-instrument", "award-aggregation-report"],
          glossary: ["risk-acceptance", "authority-basis", "compensating-control", "invalidation-trigger", "aggregate-exposure"]
        },
        {
          id: "ch-ciso-s-the-no",
          kind: "drill",
          title: "The No That Keeps The Door Open",
          statement: "A refusal that ends the conversation guarantees that the next conversation happens without you.",
          minutes: 24,
          respect: 165,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Why the correct no is usually the wrong move",
              body: "You will be right often. That is not the problem. The problem is that a security function which is experienced as a source of refusals gets routed around, and being routed around is strictly worse than approving something you dislike, because you lose visibility as well as control. The teams still ship; you simply stop hearing about it. The move that preserves both the relationship and the risk position is to replace refusal with pricing: yes, and here is what it costs, who signs for it, how long it lasts, and what we will do to reduce it. This is not capitulation. A time-boxed, owner-signed, compensated, expiring acceptance is often a genuinely better risk outcome than a refusal that gets overridden two levels above you next week, because the refusal leaves no artifact and the acceptance leaves a dated one with a name on it."
            },
            {
              kind: "list",
              title: "The four things a good no contains",
              items: [
                "An acknowledgement of the actual objective, stated in their terms, so it is clear you are solving their problem rather than defending your territory",
                "The specific consequence, sized, not the policy citation. Policies do not persuade engineers; consequences do, and a policy citation invites a search for a policy exception",
                "An alternative path that gets most of what they want, even if it is worse for them than what they asked for. If you have no alternative, you have not done the work",
                "A decision route that does not require you: if they still want it, here is who signs and here is the instrument. Making yourself removable from the path is what makes you trustworthy in it"
              ]
            },
            {
              kind: "callout",
              title: "The coalition you build before you need it",
              body: "The refusals that hold are never held alone. General counsel, privacy, internal audit, finance, and at least one respected engineering leader form a standing coalition whose interests overlap with yours in different places. Legal cares about obligation and record; privacy cares about data minimisation and purpose limitation; audit cares about control operation; finance cares about unbudgeted loss and insurance; the engineering leader cares about not being woken up. Build these relationships in quiet quarters with no ask attached, and when something genuinely must not ship you will find you are not the person refusing it — you are one of four people independently raising the same concern, which is a completely different and much harder thing to override."
            }
          ],
          drill: {
            id: "ch-ciso-d-the-no",
            scene: "Thursday, 15:00. The CTO messages you directly. A flagship customer feature launches Monday at a public event the CEO is speaking at. To make the deadline, the team needs to run the new service with a broad database role that can read across all tenant schemas, because the scoped role work is not finished and would take about three weeks. The service is internet-facing. The CTO is asking, not telling, and they have been a genuine ally on your paved-road funding. There is a go or no-go call at 15:30.",
            clock: "30 minutes to the go or no-go call",
            pressure: "A public launch, the CEO on stage, an ally asking, three weeks of real engineering work that cannot be compressed, and a cross-tenant read path on an internet-facing service.",
            prompt: "What do you say on the call?",
            options: [
              {
                id: "opt-hard-no",
                label: "No. Cross-tenant data access on an internet-facing service violates the tenant isolation standard, and the standard exists precisely for launches like this one",
                detail: "It is correct, it is consistent, and consistency is what makes a standard mean anything.",
                score: -2,
                outcome: "The CTO escalates to the CEO at 16:20. The feature ships Monday with the broad role and a verbal commitment to fix it after the event. Nobody signs anything, no compensating control is added, and the scoped-role work slips to the following quarter behind post-launch fixes.",
                ripple: "You got the worse risk outcome and the worse political outcome simultaneously, which is the signature of this failure mode. The risk shipped anyway, with no acceptance record, no expiry, no compensating detection, and no owner other than implicitly you. You also spent an ally: the next time the CTO faces this choice they will not ask, because asking produced a refusal and an escalation rather than a solution. Being right is not a strategy when you cannot enforce.",
                isBest: false
              },
              {
                id: "opt-priced-yes",
                label: "Yes, with an instrument: a risk acceptance signed by the CTO, a hard expiry two weeks after launch, a compensating detection on cross-schema reads deployed before Monday, a rate limit on the broad role, and the scoped-role work explicitly placed on the post-launch retro agenda with a named owner and a date",
                detail: "Price it, own it, bound it, detect it, and put the remediation somewhere it cannot quietly disappear.",
                score: 3,
                outcome: "The detection is deployed Sunday and fires correctly against a synthetic cross-schema read. The feature launches. The acceptance expires two weeks later, the automated reopen notifies the CTO rather than the engineer, and the scoped role ships nine days after that because the retro item had a name and a date attached to it.",
                ripple: "Three durable things happened. The CTO learned that bringing you a hard problem produces a path rather than an obstacle, which means they will bring you the next one earlier, when there is still time to do it properly. The organisation acquired a working example of the acceptance instrument on a high-visibility launch, which does more to normalise it than any policy rollout. And you now hold a signed, dated artifact showing that the risk was identified, sized, compensated, and owned — which is exactly what you would want to exist if the two-week window turned out to be the wrong two weeks.",
                isBest: true
              },
              {
                id: "opt-escalate-ceo",
                label: "Take it to the CEO immediately to get an authoritative decision from the person who owns the launch and the risk together",
                detail: "It is genuinely above your pay grade, the CEO is on stage Monday so it is their exposure, and escalation is what the mandate memo is for.",
                score: -1,
                outcome: "The CEO takes the call, has ninety seconds of context, asks whether the risk is acceptable, hears two conflicting answers, and decides to ship. You get the same outcome as a hard no, with the additional cost that the CTO learned you will go over their head on a question they brought to you in good faith.",
                ripple: "Escalation is a real and necessary instrument and this is the wrong use of it. It is for genuine deadlock after you have produced options, not for the first difficult decision of the week. Used prematurely it converts a solvable engineering problem into a political event, and it burns the escalation path itself — the third time you escalate, the CEO stops treating it as signal. Reserve it for when you would resign over the answer.",
                isBest: false
              },
              {
                id: "opt-verbal-yes",
                label: "Approve it verbally to protect the launch and the relationship, and record your concern in your own notes so there is a record of your position",
                detail: "Pragmatic, preserves the ally, and you have documented that you flagged it.",
                score: -3,
                outcome: "The launch goes well. The broad role remains in place fourteen months later. It surfaces in an external penetration test, then in a customer security review, and the question asked is who approved this.",
                ripple: "A private note is the worst possible record: it is invisible when it could have driven a decision and it appears self-serving when it finally surfaces. Nothing was priced, nobody signed, no detection was added, and no expiry existed, so the risk simply became permanent through inattention. This is also the option that most closely resembles the pattern that has ended careers — a security leader making a unilateral, unrecorded accommodation and documenting only their own protection.",
                isBest: false
              }
            ],
            debrief: "The instrument is what separates the best answer from the merely agreeable one. Approving is not the achievement; approving with an expiry, a named signer, a compensating detection deployed before the risk goes live, and the remediation placed on an agenda with an owner and a date — that is the achievement, and every one of those five components is doing distinct work. The expiry prevents permanence. The signer moves ownership to the person receiving the benefit. The detection converts an unmonitored exposure into a monitored one, which is a genuinely different risk position rather than a rhetorical one. The retro item with a name prevents the remediation from becoming the thing everyone agrees is important and nobody does. And the artifact itself is what makes the whole arrangement survivable if the window turns out badly. Notice that the hard no and the verbal yes fail identically in the thing that matters: neither produces an artifact, neither adds a control, and neither moves ownership. One feels principled and one feels pragmatic, and the risk position is the same in both. The middle path is not a compromise between them; it is a strictly better outcome than either, and it is available almost every time.",
            principle: "Do not refuse; price. A time-boxed, owner-signed, compensated, expiring yes is a better risk position than a no you cannot enforce, and it keeps you in the room for the next decision."
          },
          awards: ["award-priced-not-refused", "award-coalition-builder"],
          glossary: ["risk-acceptance", "escalation-instrument", "compensating-detection", "influence-without-authority"]
        },
        {
          id: "ch-ciso-s-leverage-points",
          kind: "field",
          title: "Where The Leverage Actually Is",
          statement: "Most security effort is spent at the weakest intervention points, because those are the ones you can act on alone.",
          minutes: 40,
          respect: 215,
          trust: 14,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The ordering that reorganises your priorities",
              body: "Donella Meadows ranked twelve places to intervene in a system by increasing power. At the bottom sit constants and parameters — budgets, thresholds, standards. Above them sit buffers, stock-and-flow structure, delay lengths, and the strength of feedback loops. Higher still: the structure of information flows, meaning who does and does not have access to information. Above that, the rules of the system — incentives, punishments, constraints. Then the power to add, change, evolve, or self-organise structure. Then the goals of the system. Then the mindset or paradigm out of which the goals, structure, rules, and parameters arise. The uncomfortable observation for our field is that essentially the entire security industry operates at level twelve. Tools, budgets, thresholds, coverage percentages, SLA targets: these are parameters. They are the least powerful intervention available and they consume nearly all of our attention, because they are the ones we can change without anyone's permission. The leverage is higher up the list, and everything above level six requires other people."
            },
            {
              kind: "table",
              title: "Meadows applied to a security programme",
              headers: ["Level", "Meadows", "Security analogue", "A concrete intervention at this level"],
              rows: [
                ["12", "Constants and parameters", "Budget, tool count, patch SLAs, coverage targets, alert thresholds", "Buy a scanner; tighten a threshold from thirty days to fourteen. Necessary, almost never sufficient"],
                ["11", "Buffer sizes relative to flows", "Detection engineering headroom, on-call slack, incident surge capacity, error budget", "Cap toil at fifty percent so the team retains capacity to absorb a bad week"],
                ["10", "Stock and flow structure", "Network and identity architecture, the deployment path, where data actually lives", "Make the paved road the only path to production; consolidate data stores so there are fewer places to defend"],
                ["9", "Length of delays", "Time to detect, time to patch, time to revoke a session, time to get a security review", "Cut session and token lifetimes so revocation is real; take review latency from eleven days to two"],
                ["8", "Strength of negative feedback loops", "Detection and response itself, control health monitoring, exception expiry", "Alert on control silence, not just on control failure; auto-reopen expired acceptances"],
                ["7", "Gain on positive feedback loops", "Compounding effects: adoption begetting adoption, or tool sprawl begetting more sprawl", "Publish adoption league tables so teams pull each other along; starve the sprawl loop by killing tools"],
                ["6", "Structure of information flows", "Who sees which risk number, and when", "Send the exception aggregate to the executive team quarterly; give engineering teams their own risk dashboard instead of reporting them upward"],
                ["5", "Rules of the system", "Promotion criteria, definition of done, launch checklists, contractual terms, what blocks a release", "Put a security criterion into the engineering promotion rubric and the definition of done"],
                ["4", "Power to self-organise", "Whether teams can create their own security capability and change the standard", "Security champions with a real budget and the authority to propose changes to the standard itself"],
                ["3", "Goals of the system", "What the organisation is actually optimising for, as revealed by what it rewards", "Get an availability-and-safety objective into the CTO's own goals rather than into yours"],
                ["2", "Paradigm", "The shared belief about what security is: a gate, a cost, a property of good engineering", "Change the founding story: security incidents reframed as engineering quality failures, reviewed in engineering forums, not security ones"],
                ["1", "Power to transcend paradigms", "Holding your own model of security lightly enough to notice when it has stopped fitting", "Genuinely entertain that your programme's central assumption is wrong, and design a test for it"]
              ]
            },
            {
              kind: "list",
              title: "The five highest-leverage moves available in most programmes",
              items: [
                "Change who sees which number. The quarterly exception aggregate to the executive team, or per-team risk dashboards owned by the team rather than reported about the team, both operate at level six and cost almost nothing",
                "Change the definition of done. A security criterion inside engineering's own definition of done operates at level five and is worth more than any gate you could build",
                "Change the promotion rubric. If security work does not count toward advancement in engineering, no amount of advocacy will make senior engineers do it; if it does count, you will not need to advocate",
                "Change the default path. Making the secure path the fastest path is a level-ten structural intervention that keeps working after you leave",
                "Change who owns the risk. Moving acceptance signature to business owners is a level-five rules change that reallocates attention across the entire organisation permanently"
              ]
            },
            {
              kind: "callout",
              title: "Why we stay at level twelve",
              body: "Parameter interventions are the ones you can execute with your own budget and your own team, on your own timeline, with a visible artifact at the end. Everything above level six requires persuading someone who does not report to you to change something they own — the promotion rubric belongs to engineering leadership, the definition of done belongs to the teams, the goals belong to the CEO. That is precisely why higher-leverage interventions are rare and precisely why they are worth the whole first four pages of this chapter. Translation, portfolio, org design, and standing are not adjacent skills to the technical work. They are the mechanism by which you reach the levels where the system actually moves."
            },
            {
              kind: "quote",
              body: "The structure of information flows: who does and does not have access to information.",
              source: "Donella Meadows, Leverage Points: Places to Intervene in a System, level six — the highest-leverage intervention that a CISO can usually make unilaterally"
            }
          ],
          praxis: "Map a real security programme you work in or advise against the twelve leverage points. For each level, write down what your programme currently does there, honestly, including the levels where the answer is nothing. Then estimate what share of your programme's total effort and budget sits at levels twelve through nine. Select exactly one intervention at level six or five — an information-flow change or a rules change — that you can actually attempt within a quarter. Define in advance what you expect to change and how you will measure it, run the intervention, and measure it at ninety days, including the case where nothing changed.",
          evidence: "Attach to your Praxis Profile: the completed twelve-level map with your programme's current state at each level; a stated estimate of effort concentration at the parameter levels with the reasoning behind the estimate; a one-page pre-registration of the chosen intervention naming the predicted effect, the measure, and the ninety-day threshold that would count as failure; and the ninety-day result with an honest account of what happened, what you got wrong in the prediction, and what the resistance to the change taught you about where the real system boundary is. A null result with a good post-mortem is stronger evidence than a success with no prediction recorded in advance.",
          awards: ["award-leverage-map", "award-level-six-intervention", "award-the-chair-complete"],
          glossary: ["leverage-point", "information-flow", "system-goal", "paradigm", "pre-registration"]
        }
      ]
    }
  ]
};
