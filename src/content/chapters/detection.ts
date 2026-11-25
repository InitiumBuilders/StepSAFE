import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-detection",
  act: "ACT II — SIGHT",
  order: 3,
  title: "THE LANTERN",
  subtitle: "Detection engineering, telemetry economics, hunting, and a SOC that does not consume the people who run it",
  essence: "azure",
  thesis: "Detection is a software product with a hostile user, a recurring bill, and a decay rate. Version it, test it, measure its coverage honestly, and retire it when it stops earning the noise it makes.",
  statement: "You do not have detection. You have the detections you tested this quarter, on the telemetry you are still paying for, staffed by people who still answer the page.",
  why: "Mandiant M-Trends 2026 puts the global median dwell time at 14 days, up from 11 the year before, while the window between initial access and hand-off to a second actor has collapsed from over eight hours in 2022 to roughly 22 seconds. Internal detection crossed a majority for the first time in years at 52 percent, which is progress and also an admission: for nearly half of intrusions somebody else told the victim. Exploitation remained the leading initial infection vector for the sixth consecutive year at 32 percent, and the Verizon 2025 DBIR found vulnerability exploitation behind about 20 percent of breaches with edge and VPN devices absorbing a large and rapidly growing share. Read those together and the shape of the problem is clear. The attacker no longer needs weeks. Your detection program has to be measured in whether it produces a decision inside a shift, not in how many rules the console reports. This chapter is about building the machine that produces those decisions and the honesty required to know whether it works.",
  outcomes: [
    "Ship detections through a reviewed, tested, version-controlled pipeline rather than a console text box",
    "Write an Alerting and Detection Strategy that a stranger can operate at 03:00 without calling you",
    "Model the cost of telemetry per detection question and defend a logging budget in the language of the person holding it",
    "Score ATT&CK coverage honestly, including robustness against evasion, and refuse the green heatmap",
    "Design and run a purple team exercise that ends in a changed control, not a slide",
    "Hunt from a written hypothesis using stacking, long-tail and beaconing analysis instead of vibes",
    "Deploy deception that is nearly free to run and nearly impossible to explain away",
    "Design a SOC whose metrics cannot be gamed and whose on-call load is survivable across years"
  ],
  prereq: ["ch-identity"],
  unitUnlock: "u-lantern",
  sources: [
    {
      label: "Palantir — Alerting and Detection Strategy Framework (github.com/palantir/alerting-detection-strategy-framework)",
      note: "The ten-section template that turns a rule into an operable document: Goal, Categorization, Strategy Abstract, Technical Context, Blind Spots and Assumptions, False Positives, Validation, Priority, Response, Additional Resources. Use the Blind Spots section as your review gate; it is the part teams skip and the part that saves the on-call."
    },
    {
      label: "SigmaHQ — Sigma Rule Specification (github.com/SigmaHQ/sigma-specification)",
      note: "Authoritative on required fields (title, logsource, detection), condition semantics, value modifiers such as contains, startswith, endswith, re and exists, and the status and level vocabularies. Read it before you invent your own YAML dialect."
    },
    {
      label: "MITRE ATT&CK and ATT&CK Navigator (attack.mitre.org)",
      note: "Technique pages carry the procedure examples and named groups that make a detection concrete. Navigator is the layer format you should generate from your rule repository rather than colour in by hand."
    },
    {
      label: "MITRE Center for Threat-Informed Defense — Summiting the Pyramid",
      note: "The only widely used model that scores how hard an analytic is to evade, using levels from Ephemeral Values up to Core to (Sub-)Technique across Application, User-Mode and Kernel-Mode observation points. Version 4 added telemetry confidence scoring. This is what turns coverage from a colour into an engineering measurement."
    },
    {
      label: "Red Canary — Atomic Red Team (github.com/redcanaryco/atomic-red-team)",
      note: "Thousands of small, portable, cleanup-aware tests mapped to ATT&CK, driven by Invoke-AtomicTest. The right tool for detection unit-testing. Not an adversary emulation plan; do not confuse a technique test with a campaign."
    },
    {
      label: "MITRE Caldera (github.com/mitre/caldera)",
      note: "Agent-based automated adversary emulation with an Atomic plugin. Use it when you need a chained operation with sequencing and cleanup rather than isolated technique execution."
    },
    {
      label: "Google SRE Book, Chapter 6 — Monitoring Distributed Systems (sre.google/sre-book)",
      note: "The clearest statement anywhere of symptoms versus causes, the four golden signals, and the rule that a page must be urgent, actionable and require intelligence. Every alerting policy argument you will ever have is settled in this chapter."
    },
    {
      label: "Mandiant M-Trends 2026 (cloud.google.com/blog/topics/threat-intelligence/m-trends-2026)",
      note: "Median dwell time 14 days, 122 days for espionage and North Korean IT worker cases, internal detection at 52 percent, exploits at 32 percent of initial infection vectors, hand-off to a second actor in 22 seconds. Use these to set your detection latency targets, not to decorate slides."
    },
    {
      label: "Verizon 2025 Data Breach Investigations Report",
      note: "Vulnerability exploitation as an initial access vector, edge device and VPN targeting growth, and remediation timelines for edge KEVs. Good for arguing that your detection strategy must assume the perimeter device is the entry point."
    },
    {
      label: "AWS — Logging data events with CloudTrail (docs.aws.amazon.com/awscloudtrail)",
      note: "States plainly that trails and event data stores do not log data events by default and that data events are billed separately. This single default explains most cloud investigations that dead-end at the bucket."
    },
    {
      label: "Amazon GuardDuty — IAM finding types (docs.aws.amazon.com/guardduty)",
      note: "Exact finding names and their data sources. Note the operational trap documented there: when GuardDuty observes continued activity from a remote host or account, the model learns it as expected and stops generating the finding."
    },
    {
      label: "Thinkst — Canarytokens (canarytokens.org and help.canary.tools)",
      note: "Free tripwires: DNS tokens, document tokens, AWS key tokens that fire on any API attempt. The lowest cost per unit of true positive in the entire discipline."
    },
    {
      label: "NIST Cybersecurity Framework 2.0 (NIST CSWP 29) — Detect function",
      note: "DE.CM continuous monitoring and DE.AE adverse event analysis. The subcategory on declaring an incident when adverse events meet defined criteria is the one auditors ignore and the one that decides whether your program has a spine."
    },
    {
      label: "Alert Fatigue in Security Operations Centres: Research Challenges and Opportunities, ACM Computing Surveys (2025)",
      note: "The academic anchor for treating alert fatigue as a systems and human-factors problem rather than a discipline problem. Cite this when someone proposes to solve alert volume by hiring."
    }
  ],
  pages: [
    {
      id: "ch-detection-page-product",
      title: "PAGE I — DETECTION AS A PRODUCT",
      credential: "Certified Detection Engineer — Detection as a Product (StepSAFE Praxis, Chapter III, Page I)",
      summary: "Detection stops being an art the moment it acquires a repository, a test suite, a review gate and an owner. This Page moves the learner from writing rules to shipping a product: the funnel from telemetry to decision, the Alerting and Detection Strategy document, Sigma and detection-as-code, continuous integration for detections, and the systems view of alert fatigue and tuning debt.",
      competencies: [
        "Decompose the detection funnel from raw event to analyst decision and locate loss at each stage",
        "Author an Alerting and Detection Strategy that survives its author leaving the company",
        "Write portable Sigma rules with correct logsource, condition and modifier semantics",
        "Build a CI pipeline that lints, compiles, and unit-tests detections against labelled true and known-good data",
        "Quantify tuning debt and set an auto-demotion policy for rules that stop earning their noise",
        "Argue alert fatigue as a design failure of the alert generator rather than a staffing shortfall"
      ],
      seal: "SEAL :: THE FORGE",
      steps: [
        {
          id: "ch-detection-funnel",
          kind: "construct",
          title: "The Detection Is Not the Alert",
          statement: "A detection is the entire path from an event that was logged to a human who made a decision, and it fails at whichever stage you never measured.",
          minutes: 18,
          respect: 70,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Most people picture a detection as a rule. A string of query language sitting in a console. That picture is why so many programs are surprised when a breach walks past a rule that was, technically, enabled. The rule is one stage in a pipeline of six, and every stage silently discards signal. If you cannot say what fraction survives each stage, you do not have a detection capability, you have a collection of queries."
            },
            {
              kind: "numbered",
              title: "The six stages of the funnel",
              items: [
                "Occurrence. The adversary does the thing. This is the only stage you do not control.",
                "Emission. The host, service or control plane produces an event describing it. Missing agent, disabled audit policy, or an API that simply does not emit means the funnel ends here with no trace.",
                "Ingestion. The event reaches somewhere queryable, inside a latency you can live with. Dropped at the collector, throttled at the broker, filtered by a cost-saving rule nobody reviewed.",
                "Matching. Your logic fires. Field name changed in an agent upgrade, timezone parsed wrong, the field you keyed on is truncated at 256 characters.",
                "Presentation. The alert reaches a queue a human actually reads, with the context needed to judge it. A high-severity alert routed to an email folder is a log entry with delusions.",
                "Decision. A human or a piece of automation concludes true or false and acts. This is the only output that counts."
              ]
            },
            {
              kind: "table",
              title: "Where signal actually dies, and the instrument that reveals it",
              headers: ["Stage", "Typical failure", "The measurement that would have caught it"],
              rows: [
                ["Emission", "Endpoint agent stopped reporting three weeks ago on 4 percent of the fleet", "Daily count of distinct reporting hosts per log source against the asset inventory, alarmed on deviation"],
                ["Ingestion", "A noise filter added during a cost exercise dropped the field a rule keys on", "Per-source event volume and per-field null rate, tracked as a time series with change annotations"],
                ["Matching", "Vendor renamed a field in a minor version and the rule silently matches nothing", "Synthetic true-positive replay on a schedule; a rule with zero matches for N days is quarantined, not trusted"],
                ["Presentation", "Rule fires 900 times a day into a queue nobody has opened since March", "Alerts per rule per day, and the fraction of alerts that ever received a human disposition"],
                ["Decision", "Analyst closed it as benign in 40 seconds because the last 200 were benign", "Disposition distribution per rule plus time-to-disposition; a rule closed benign 99 percent of the time is a defect report"]
              ]
            },
            {
              kind: "principle",
              title: "The funnel law",
              body: "Coverage claims are made about stage four. Breaches happen at stages two, three and six. Anyone who reports detection health using only rule counts is reporting on the stage that matters least."
            },
            {
              kind: "callout",
              title: "The silent-rule problem",
              body: "The most dangerous rule in any environment is the one that has not fired in six months. It reads as coverage on every dashboard and it is indistinguishable, from the outside, from a rule that is broken. Build the quarantine rule now, before you have three hundred of them: any detection with zero matches and zero synthetic validations in the last 30 days moves to a suspect state and blocks the coverage report until someone proves it still works."
            }
          ],
          glossary: ["detection-funnel", "signal-loss", "silent-rule", "disposition-rate", "detection-drift"],
          awards: ["award-funnel-sight"]
        },
        {
          id: "ch-detection-ads-document",
          kind: "lesson",
          title: "The Alerting and Detection Strategy",
          statement: "A detection that only its author can operate is a liability disguised as a control; write the document that lets a stranger run it at 03:00.",
          minutes: 32,
          respect: 130,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Palantir published the Alerting and Detection Strategy framework because their incident response team hit the same wall every growing team hits: rules accumulated faster than understanding, nobody could say why a given alert existed, and the person who could explain it had moved teams. The ADS is a documentation template with ten sections. It looks like bureaucracy for about a week, and then the first time an analyst who has never seen the rule resolves an alert in four minutes without escalating, you understand what you bought."
            },
            {
              kind: "table",
              title: "The ten ADS sections and what a good one actually contains",
              headers: ["Section", "What it demands", "The failure it prevents"],
              rows: [
                ["Goal", "Plain language: the behaviour you are trying to catch, not the query", "Rules that detect a tool rather than a behaviour and die when the tool changes"],
                ["Categorization", "ATT&CK tactic and technique, parent and child", "Coverage maps assembled from guesswork after the fact"],
                ["Strategy Abstract", "How it works end to end: sources, enrichment, aggregation, suppression", "The analyst who cannot tell whether the alert means one event or a threshold breach"],
                ["Technical Context", "Background a responder needs but does not have: what the tool is, what normal looks like", "Escalation to tier three purely to answer what is svchost"],
                ["Blind Spots and Assumptions", "Where it will not fire and how it is defeated", "A false sense of coverage; this is the section that makes coverage claims honest"],
                ["False Positives", "Known benign triggers with the environmental reason", "Repeated rediscovery of the same benign pattern by six different analysts"],
                ["Validation", "The exact steps to generate a true positive that trips the rule", "Rules that quietly stop working; this section is your unit test"],
                ["Priority", "The criteria that make it high, medium or low, and how that maps in the SIEM", "Severity inflation, where everything is high and nothing is"],
                ["Response", "General triage and investigation steps for the responder", "The 03:00 page with no runbook"],
                ["Additional Resources", "Internal and external references", "Institutional knowledge that lives in one person"]
              ]
            },
            {
              kind: "callout",
              title: "The section everyone skips",
              body: "Blind Spots and Assumptions is the whole framework. Palantir states it directly: no strategy is perfect, and naming the assumptions lets another engineer see how it fails or is defeated. In practice, forcing an author to write down that a detection assumes the endpoint agent is running, assumes command lines are not obfuscated beyond a certain length, and does not cover the same technique executed through WMI, is the single highest-value ten minutes in the detection lifecycle. It converts a green square on a heatmap into a measured claim."
            },
            {
              kind: "compare",
              title: "Two versions of the same rule",
              left: {
                title: "Rule without an ADS",
                items: [
                  "Name: Suspicious PowerShell",
                  "Severity: High, because the author felt it was high",
                  "Owner: unknown, author left in 2024",
                  "Analyst on receiving it: escalates or closes on instinct",
                  "When it stops firing: nobody notices for two quarters",
                  "In the coverage report: counts as T1059.001 covered"
                ]
              },
              right: {
                title: "Rule with an ADS",
                items: [
                  "Goal: detect encoded command execution launched by an Office process",
                  "Categorization: Execution / T1059.001, with the specific procedure named",
                  "Blind spots: does not cover PowerShell hosted through a custom runspace or invoked over WinRM",
                  "False positives: three named enterprise tools, with the parent process signature that excludes them",
                  "Validation: an Atomic test id and the expected event, replayed weekly in CI",
                  "Priority: high only when the parent is an Office binary and the user is outside the developer group"
                ]
              }
            },
            {
              kind: "checklist",
              title: "ADS review gate — a pull request does not merge without these",
              items: [
                "The Goal describes a behaviour a human would recognise, and contains no product names",
                "At least one blind spot is named, and it is a real one an attacker could use",
                "Every false positive listed has a filter or an explicit decision not to filter, with a reason",
                "The Validation section names a reproducible test, ideally an Atomic test id or a Caldera ability",
                "Priority criteria are conditional, not absolute; the rule can be high in one context and low in another",
                "The Response section tells the analyst the first three things to look at, in order",
                "The author has named a successor owner who is not the author"
              ]
            },
            {
              kind: "principle",
              body: "The rule is the cheap part. The document is the product. If you must choose between one hundred undocumented detections and thirty documented ones, choose thirty; the hundred will be deleted by your successor anyway, and they will be right to do it."
            }
          ],
          glossary: ["alerting-and-detection-strategy", "blind-spot-declaration", "detection-owner", "severity-inflation"],
          awards: ["award-ads-authored"]
        },
        {
          id: "ch-detection-sigma-ci",
          kind: "lab",
          title: "Detection-as-Code: Sigma, Backends, and a CI That Says No",
          statement: "If a detection can reach production without passing a test, you are not running detection engineering, you are running a suggestion box.",
          minutes: 40,
          respect: 190,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Sigma is a vendor-neutral YAML format for describing a detection over log events, compiled by pySigma into Splunk SPL, Elastic queries, Sentinel KQL and roughly two dozen other backends. Its real value is not portability between SIEMs, which most organisations never exercise. Its value is that a YAML file is diffable, reviewable, testable and ownable in a way that a saved search in a console is not. The specification requires exactly three fields: title, logsource and detection. Everything else that makes a rule operable — id, status, level, tags, falsepositives, references — is optional to the spec and mandatory in your repository. That gap is your CI pipeline's job."
            },
            {
              kind: "code",
              title: "A rule with the metadata an on-call actually needs",
              lang: "yaml",
              body: "title: Download Utility Output Piped Directly Into A Shell\nid: replace-with-a-generated-uuid-v4\nstatus: experimental\ndescription: Detects curl or wget whose output is piped straight into an interpreter, a staging pattern common to Linux payload delivery and to container escape tooling\nreferences:\n    - https://attack.mitre.org/techniques/T1059/004/\nauthor: detection-guild\ndate: 2026-08-05\ntags:\n    - attack.execution\n    - attack.t1059.004\nlogsource:\n    category: process_creation\n    product: linux\ndetection:\n    selection_downloader:\n        CommandLine|contains:\n            - 'curl '\n            - 'wget '\n    selection_pipe:\n        CommandLine|contains:\n            - '| sh'\n            - '| bash'\n            - '|sh'\n            - '|bash'\n    filter_build_agents:\n        User|startswith: 'svc-build-'\n    condition: all of selection_* and not 1 of filter_*\nfields:\n    - CommandLine\n    - ParentCommandLine\n    - User\n    - Image\nfalsepositives:\n    - Container image build steps and configuration management bootstrap scripts\n    - Vendor install documentation followed literally by an engineer on a workstation\nlevel: medium"
            },
            {
              kind: "list",
              title: "Read the rule like a reviewer, not an author",
              items: [
                "The condition uses all of selection_* and not 1 of filter_*. That means every selection block must match and any single filter defeats it. Get this backwards and you have either a rule that never fires or a rule that fires on everything.",
                "The filter is scoped to a service account naming convention, not to a command line pattern. Filtering on command line content is how an attacker turns your suppression list into an evasion manual.",
                "status is experimental, which in the Sigma vocabulary means it may produce false positives. That word is load-bearing: your pipeline should route experimental rules away from the paging queue automatically.",
                "level is medium, not high. The behaviour is suspicious, not conclusive. Reserve high for logic where the false positive rate is genuinely low in your environment, and critical for logic that indicates a likely incident.",
                "The fields block tells the SIEM which columns to surface. Analysts judge alerts on the first screen; this is not decoration, it is triage speed."
              ]
            },
            {
              kind: "code",
              title: "The pipeline that refuses bad detections",
              lang: "yaml",
              body: "name: detection-ci\non:\n  pull_request:\n    paths:\n      - 'rules/**'\n      - 'tests/**'\n\njobs:\n  gate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: install toolchain\n        run: pip install sigma-cli pysigma-backend-splunk pysigma-backend-elasticsearch pyyaml\n\n      - name: syntax and schema\n        run: sigma check rules/\n\n      - name: house metadata policy\n        run: python tools/require_fields.py rules/ --need id level tags references falsepositives\n\n      - name: must compile to every deployed backend\n        run: |\n          sigma convert -t splunk -p splunk_windows rules/ > /dev/null\n          sigma convert -t elasticsearch -p ecs_windows rules/ > /dev/null\n\n      - name: true positives must match\n        run: python tools/detect_test.py --rules rules/ --expect-match tests/true_positive/\n\n      - name: known good must not match\n        run: python tools/detect_test.py --rules rules/ --expect-no-match tests/known_good/\n\n      - name: every rule maps to a technique that exists\n        run: python tools/attack_map.py rules/ --require-technique --attack-version 17\n\n      - name: publish coverage layer as a build artifact\n        run: python tools/navigator_layer.py rules/ --out artifacts/coverage.layer"
            },
            {
              kind: "code",
              title: "The test manifest that makes a detection falsifiable",
              lang: "yaml",
              body: "rule: rules/linux/download_piped_to_shell.yml\n\nexpect_match:\n  - fixture: tests/true_positive/atomic_t1059_004_curl_pipe.jsonl\n    reason: Atomic Red Team T1059.004 test 1, captured from the lab host on 2026-07-14\n  - fixture: tests/true_positive/caldera_op_ashgrove_stage2.jsonl\n    reason: emulation of the staging step observed in the Q2 purple exercise\n\nexpect_no_match:\n  - fixture: tests/known_good/packer_build_fleet_30d.jsonl\n    reason: image build farm, the loudest legitimate source of this pattern\n  - fixture: tests/known_good/prod_bootstrap_30d.jsonl\n    reason: production instance bootstrap, thirty days of steady state\n\nbudget:\n  max_matches_per_day_in_known_good: 0\n  max_alerts_per_day_forecast: 4\n  forecast_source: tests/known_good/prod_bootstrap_30d.jsonl"
            },
            {
              kind: "callout",
              title: "The two fixtures that make this real",
              body: "Anyone can assert that a rule matches a malicious sample. The hard and valuable half is the known-good corpus: thirty days of real production telemetry from the noisiest legitimate systems, frozen as a fixture. Every rule is measured against it before merge, and the forecast alert volume is printed in the pull request. This is the single change that converts alert tuning from a permanent chore into a merge-time decision. It also creates a governance question you must answer deliberately: that corpus contains real user activity, so it needs the same access controls, retention limit and scrubbing policy as any production data set. Teams that skip that step end up with the world's least-defensible shadow database."
            },
            {
              kind: "principle",
              body: "A detection you cannot test is a belief. A detection with a passing true-positive fixture and a clean known-good corpus is a measurement. Ship measurements."
            }
          ],
          praxis: "Stand up a detection repository with sigma-cli, three rules, one true-positive fixture per rule generated from Atomic Red Team, and a known-good corpus of at least seven days of your own lab telemetry. Wire the CI so a pull request fails when a rule matches the known-good corpus.",
          evidence: "A link to the repository (or a redacted export) showing a failing pipeline run for a deliberately noisy rule and the subsequent passing run after tuning, with both pull request checks visible.",
          glossary: ["detection-as-code", "sigma-rule", "known-good-corpus", "pysigma-backend", "alert-volume-forecast"],
          awards: ["award-first-detection-shipped", "award-noise-slayer"]
        },
        {
          id: "ch-detection-drill-ship-or-hold",
          kind: "drill",
          title: "Drill: The Rule That Is Right and Loud",
          statement: "Under a live campaign, the choice is never noisy versus quiet; it is which queue absorbs the noise and who owns the decay clock.",
          minutes: 22,
          respect: 145,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "This is the most common decision in detection engineering and the one most often made badly, because both instincts in the room are defensible. The person who wants to ship is right that going blind during an active campaign is unacceptable. The person who wants to hold is right that a rule producing four hundred alerts a day will destroy the queue and, worse, train the analysts to distrust that entire technique class for a year afterwards. The craft is in noticing that severity and destination are separate dials from correctness."
            },
            {
              kind: "list",
              title: "What you know before the clock starts",
              items: [
                "Threat intel reports an active campaign using a legitimate remote monitoring tool for initial hands-on-keyboard access; three peers in your sector were hit in the last eleven days",
                "Your engineer has a working rule keyed on the installer and service creation pattern; it is correct",
                "Backtested over thirty days of production telemetry the rule produces roughly 400 matches a day, almost all from a sanctioned deployment of the same tool by the IT service desk",
                "The service desk cannot be excluded cleanly: they use the same binary, same signer, and frequently from user context because of a licensing quirk",
                "Your paging queue currently absorbs about 30 alerts per shift and the on-call is already at the edge",
                "There is a change freeze in 40 minutes for the quarter-end close"
              ]
            },
            {
              kind: "principle",
              body: "Correctness, severity, destination and lifetime are four independent properties of a detection. Teams that treat them as one dial ship either blindness or burnout."
            }
          ],
          drill: {
            id: "ch-detection-drill-ship-or-hold-scene",
            scene: "Thursday, 16:20. Your detection engineer has a rule for a live campaign that is correct and produces roughly 400 matches a day. Change freeze starts at 17:00 and runs eleven days. The head of the SOC is in the doorway and the CISO is on a call about the same campaign.",
            clock: "40 minutes to the freeze",
            pressure: "Peers in your sector compromised in the last eleven days. On-call already saturated. Eleven days of freeze if you miss this window.",
            prompt: "The rule is correct and loud. Decide what ships in the next forty minutes.",
            options: [
              {
                id: "opt-page-it",
                label: "Ship it at high severity into the paging queue. Coverage during a live campaign beats analyst comfort.",
                detail: "Argue that eleven days blind is the unacceptable risk and that the SOC can absorb the volume with overtime.",
                score: -3,
                outcome: "The queue takes roughly 130 additional alerts per shift. Within four days the on-call is bulk-closing them with a saved comment. On day seven the real one arrives and is closed in nineteen seconds alongside forty service desk installs.",
                ripple: "You did not just lose this detection. You taught the entire team that alerts of this class are noise, and that learned response persists for months across unrelated rules keyed on the same tooling. The next engineer who writes a good rule in this space inherits a queue that has already decided the answer."
              },
              {
                id: "opt-hold-and-tune",
                label: "Hold the rule. Tune it to under five per day, then ship after the freeze with a proper exception.",
                detail: "Maintain the quality bar. A rule that damages the queue is worse than no rule.",
                score: -1,
                outcome: "The bar is upheld and the environment is blind to the campaign for eleven days. The tuning work takes six days because the service desk pattern turns out to be genuinely irreducible without an inventory change.",
                ripple: "You will be right on process and wrong on outcome, and if the campaign lands during the freeze the post-incident review will find a correct, tested, unshipped rule in a branch. That artefact ends careers. Quality bars that have no fast path for live threats get overridden by executives during the next incident, and then you lose the bar permanently."
              },
              {
                id: "opt-quiet-queue-no-doc",
                label: "Ship at high severity but route to a dedicated campaign queue reviewed once per shift. Skip the ADS to make the freeze.",
                detail: "Compromise: coverage without paging damage, documentation to follow.",
                score: 1,
                outcome: "The paging queue is protected and the signal is retained. Review happens twice on the first day, then slips; by day five the queue has 1,900 unreviewed items and no analyst knows what triage looks like because there is no runbook.",
                ripple: "This is the option that looks like judgement and decays into the first option with extra steps. The missing ADS means the once-a-shift reviewer has no false-positive list, no priority criteria and no response steps, so the review degrades to scrolling. Undocumented detections do not stay quiet, they stay unowned."
              },
              {
                id: "opt-context-tier-with-clock",
                label: "Ship it as non-paging enrichment into the hunt tier, with an ADS, a named owner, a five-day tuning SLA and an automatic expiry.",
                detail: "The rule lands today at informational level, feeding a correlation that only pages when it co-occurs with a second signal such as a new account, a new external destination, or execution outside service desk hours. It expires automatically in thirty days unless promoted.",
                score: 3,
                isBest: true,
                outcome: "Signal is retained from hour one and nobody is paged for it alone. The correlation fires eleven times in the first week; two are genuine, both caught inside a shift. The five-day SLA forces the service desk inventory conversation that turns out to be the real fix.",
                ripple: "You established four things the organisation keeps: that severity and destination are separate from correctness, that a loud rule can still be useful as context, that every emergency detection carries a decay clock so the repository does not silt up, and that tuning debt has a due date and an owner. The expiry is the part teams forget; without it, next quarter you have forty emergency rules nobody dares delete."
              }
            ],
            debrief: "The winning move separates four properties that novices bind together. Correctness is settled — the rule is right. Severity is a claim about confidence, and 400 matches a day is a confession that confidence is low. Destination is a routing decision, and there is almost always a tier between paging and deletion: an enrichment or context tier where the signal is queryable and joinable but wakes nobody. Lifetime is the property nobody assigns, which is why detection repositories accumulate. The correlation requirement is what converts a low-confidence signal into a high-confidence alert: on its own the tool install means little, but installed by a user who has never installed it before, outside service desk hours, followed by a new outbound destination, is a different event entirely. The Google SRE rule applies without modification: a page must be urgent, actionable, and require intelligence. A single tool install is none of the three; the correlated cluster is all three. Note also what the five-day SLA bought — it forced the conversation about why the service desk cannot be distinguished from an attacker, which is an asset management defect that was invisible until a detection tried to depend on it. Detections are the best environmental sensors you own, and not only for adversaries.",
            principle: "Ship the signal, withhold the page. A detection can be loud and still be valuable if it lands somewhere with no human attached and a clock that forces the decision it deferred."
          },
          glossary: ["enrichment-tier", "correlation-alert", "detection-expiry", "tuning-sla"],
          awards: ["award-quiet-pager"]
        },
        {
          id: "ch-detection-tuning-debt",
          kind: "lesson",
          title: "Tuning Debt and the Systems View of Alert Fatigue",
          statement: "Alert fatigue is a property of the alert generator, not of the people receiving alerts, and no amount of hiring fixes a generator.",
          minutes: 30,
          respect: 165,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "There is a reflex in security leadership that when the queue overflows, the answer is more analysts. It is the wrong answer and the arithmetic is not subtle. Alert volume scales with the environment and with the rule count; analyst capacity scales with headcount and a hiring pipeline measured in months. One curve is exponential in your own decisions and the other is linear in someone else's budget. You will never win that race by running faster. The ACM Computing Surveys review of alert fatigue in security operations centres frames this correctly as a systems and human-factors problem, and vendor surveys have consistently found a majority of SOC analysts reporting burnout. Treat those two facts as one fact: the generator is miscalibrated, and the humans are the load-bearing element absorbing the miscalibration."
            },
            {
              kind: "metric",
              title: "The four numbers that describe a detection's health",
              body: "Track these per rule, weekly, and publish them. Any rule can survive being wrong; no rule survives being unmeasured.",
              items: [
                "Alerts per day. The bill the rule charges the organisation.",
                "True positive rate on dispositioned alerts. Not accuracy in the abstract; the fraction of what the analyst actually saw that mattered.",
                "Time to disposition, median and 90th percentile. A rule with a fast median and a terrible tail is hiding a subset that nobody can judge.",
                "Unique escalations per quarter. The only number that shows the rule contributed to an outcome rather than to activity."
              ]
            },
            {
              kind: "table",
              title: "The rule triage matrix",
              headers: ["Alerts per day", "True positive rate", "Verdict", "Action"],
              rows: [
                ["Low", "High", "Load bearing", "Protect it. Add validation to CI so you notice the day it breaks."],
                ["Low", "Low", "Cheap noise", "Tolerable in the enrichment tier. Never in the paging queue. Review annually."],
                ["High", "High", "You are on fire", "This is not a detection problem, it is an incident or a control gap. Escalate to engineering, not to tuning."],
                ["High", "Low", "Debt", "Demote to enrichment now, assign an owner and a due date, delete if the date passes."],
                ["Zero for 30 days", "Undefined", "Suspect", "Quarantine. Prove it still fires with a synthetic true positive before it counts as coverage again."]
              ]
            },
            {
              kind: "prose",
              title: "Why debt is the right word",
              body: "Tuning debt behaves exactly like technical debt. It has a principal, which is the engineering hours required to fix the rule properly. It has interest, which is analyst hours per day spent servicing the noise, compounding for as long as you defer. And it has a default event, which is not a dramatic failure but the quiet one described in the previous drill: a genuine alert closed in seconds because the previous forty were not. The reason to name it debt is that it gives you the vocabulary executives already accept. No CFO needs an explanation of why unserviced debt eventually forecloses. Bring a debt register to the quarterly review — rule, daily interest in analyst hours, principal in engineering days, age — and the conversation about detection headcount changes shape immediately."
            },
            {
              kind: "numbered",
              title: "The auto-demotion policy, in the order you should implement it",
              items: [
                "Instrument first. You cannot demote what you cannot count, and most SIEMs do not give you per-rule disposition out of the box. Build the per-rule metrics before you build the policy.",
                "Set the paging budget as a hard number, per shift, agreed with the SOC lead. Not a target — a budget, the way a latency SLO is a budget.",
                "Rank rules by alerts contributed against escalations produced. Publish the ranking to the engineers who wrote them; visibility alone removes a surprising fraction of the volume.",
                "Automate demotion: any paging rule exceeding its share of the budget for two consecutive weeks with no escalation drops to enrichment automatically, with a ticket to its owner. No meeting, no debate.",
                "Automate expiry: enrichment rules with no query hits and no escalations for two quarters are deleted, with the ADS archived so the reasoning survives even though the rule does not.",
                "Report the deletions upward as a positive metric. If your program cannot celebrate removing detections, it will never stop accumulating them."
              ]
            },
            {
              kind: "quote",
              body: "Every page should be actionable.",
              source: "Google SRE Book, Chapter 6 — Monitoring Distributed Systems"
            },
            {
              kind: "callout",
              title: "The second-order effect nobody plans for",
              body: "When you finally cut alert volume by 70 percent, the SOC's measured mean time to respond often gets worse, not better. This is not a regression. You removed the flood of trivially-closable alerts that were dragging the mean down, so what remains is the genuinely hard work. If you have not pre-briefed your executive on this effect, your successful cleanup will read as a performance collapse on the very dashboard you are judged by. Brief it before you start, in writing, with the predicted direction of each metric. This is the difference between an engineering win and a political loss."
            }
          ],
          glossary: ["tuning-debt", "alert-fatigue", "paging-budget", "auto-demotion", "disposition-rate", "false-positive-economics"],
          awards: ["award-debt-register"]
        },
        {
          id: "ch-detection-field-repo",
          kind: "field",
          title: "Field: Stand Up the Detection Guild",
          statement: "The repository, the review gate and the owner are the program; everything else is content that flows through them.",
          minutes: 38,
          respect: 175,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "This is the first thing you build in a new job and the thing you will be judged on in three years. Not the rules. The machine that produces, reviews, tests, deploys, measures and retires rules, and the social contract that makes engineers want to use it. Most detection-as-code initiatives fail not on tooling but on the second part: the pipeline exists, and people still make emergency changes in the console because the pipeline takes ninety minutes and the console takes ninety seconds. Your job is to make the correct path the fast path."
            },
            {
              kind: "numbered",
              title: "Build order",
              items: [
                "Inventory what exists. Export every enabled rule from every console. Count them, then count how many have an owner, a description and a firing history. The gap between those numbers is your opening argument.",
                "Create the repository with a directory structure that mirrors how you will reason about coverage: by platform and log source, not by SIEM product. Products change; log sources are more durable.",
                "Write the ADS template as a pull request template so it cannot be skipped without deliberate effort.",
                "Add the CI gate in shadow mode for two weeks. It reports failures without blocking. Fix the toolchain against real rules before you make it authoritative.",
                "Migrate the ten most-fired rules first, not the ten best rules. The most-fired rules generate the metrics that fund the rest of the work.",
                "Turn the gate on for new and modified rules only. Never require a big-bang migration; you will lose the political capital and the backlog will outlive you.",
                "Instrument the deployment path so a merged rule reaches production in under fifteen minutes. Above thirty minutes, engineers route around you and the whole edifice becomes theatre.",
                "Add the break-glass path explicitly: a documented way to ship in five minutes during an incident, which auto-creates the pull request retroactively and expires the rule in seven days if the pull request is not completed."
              ]
            },
            {
              kind: "checklist",
              title: "Signs the guild is real rather than aspirational",
              items: [
                "An engineer outside the security team has submitted a detection pull request and had it merged",
                "A rule has been deleted through the process, with the ADS archived and the coverage map updated automatically",
                "The coverage layer published by CI is the artefact leadership looks at, not a hand-maintained spreadsheet",
                "Break-glass has been used at least once and the retroactive pull request was completed within the window",
                "A rule failed CI because it matched the known-good corpus, and the author thanked the pipeline rather than filing an exception",
                "The weekly per-rule metrics are visible to the people who wrote the rules without anyone requesting them"
              ]
            },
            {
              kind: "table",
              title: "What to measure in the first ninety days, and what each number is actually telling you",
              headers: ["Metric", "Baseline day 1", "Target day 90", "What it really measures"],
              rows: [
                ["Percentage of production detections under version control", "Usually under 20", "Above 60", "Whether the program has a spine or a set of habits"],
                ["Median merge-to-production time", "Often undefined", "Under 15 minutes", "Whether engineers will use the correct path under pressure"],
                ["Detections with a named living owner", "Frequently under 30 percent", "100 percent of paging rules", "Whether an alert at 03:00 has anyone to call"],
                ["Rules deleted or demoted in the period", "Zero", "At least 10 percent of the paging set", "Whether the program can subtract, which is the harder half"],
                ["Paging alerts per shift", "Whatever hurts today", "Inside the agreed budget", "Whether the humans will still be here in two years"]
              ]
            },
            {
              kind: "callout",
              title: "The political trap",
              body: "Somebody will propose that the detection repository be owned by the SIEM administrators, because they own the platform. Resist this specifically and calmly. Platform administration optimises for stability and availability; detection engineering optimises for change rate and coverage. Housed together, stability always wins and the rule set ossifies. Keep the platform team as the owner of the deployment mechanism and the detection guild as the owner of the content, with a documented interface between them. That boundary is worth arguing about in week one and nearly impossible to relitigate in year two."
            }
          ],
          praxis: "In a real or lab environment, establish the detection repository end to end: directory structure, ADS pull request template, CI gate in shadow mode then enforcing, and an instrumented deploy path. Migrate your ten highest-volume rules and publish the first weekly per-rule metrics report. Document the break-glass path and rehearse it once.",
          evidence: "Attach to the Praxis Profile: the repository tree, the ADS template, one merged pull request showing a real review conversation that changed the rule, the first weekly metrics report with per-rule alert volume and disposition, and a written record of the break-glass rehearsal including the retroactive pull request.",
          glossary: ["detection-guild", "break-glass-detection", "shadow-mode-ci", "coverage-layer"],
          awards: ["award-guild-founded", "award-first-detection-shipped"]
        }
      ]
    },
    {
      id: "ch-detection-page-telemetry",
      title: "PAGE II — THE TELEMETRY ECONOMY",
      credential: "Certified Detection Engineer — Telemetry Economics and Security Data Architecture (StepSAFE Praxis, Chapter III, Page II)",
      summary: "Every log line is a recurring purchase and a future answer. This Page teaches the learner to reason backwards from the questions an investigation will ask, to price telemetry honestly, to build a pipeline that routes by detection value rather than by habit, to normalise without destroying evidence, and to defend the logging budget in front of the person who signs for it.",
      competencies: [
        "Derive log source requirements from investigative questions rather than from vendor default configurations",
        "Model the fully loaded cost of a telemetry source across ingest, index, retention and query",
        "Design a tiered pipeline with distinct detect, investigate and archive paths and defensible latency for each",
        "Normalise to a common schema without losing the raw evidence an investigation or a court will need",
        "Identify and close the specific blind spots created by default-off telemetry",
        "Negotiate a telemetry budget using risk and answerability rather than fear"
      ],
      seal: "SEAL :: THE LEDGER",
      steps: [
        {
          id: "ch-detection-questions-first",
          kind: "construct",
          title: "The Question You Cannot Ask Later",
          statement: "Logging decisions are made once and paid for forever, in both directions: what you did not collect is not merely missing, it is unknowable.",
          minutes: 16,
          respect: 65,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Every incident ends with a list of questions. Which accounts did that key touch. What was read out of that bucket. When did the beacon start. Whether the developer laptop that got the phish also held the signing credential. You do not get to decide at that moment what data exists; you decided months earlier, usually by accepting a default. The discipline is to invert the process: start from the questions an investigation will ask, and treat the log source as the answer's precondition. This sounds obvious and almost nobody does it, because the vendor's default configuration is a decision that feels like an absence of a decision."
            },
            {
              kind: "table",
              title: "Investigative question to telemetry precondition",
              headers: ["The question you will be asked", "The telemetry that must already exist", "The default that will betray you"],
              rows: [
                ["Which objects did the attacker actually read from that bucket", "Object-level data events for the specific bucket, enabled before the event", "AWS CloudTrail does not log data events by default and bills for them separately; you will have the API call that listed the bucket and nothing about what was taken"],
                ["When did this beaconing start", "Egress connection records or proxy logs with retention longer than the dwell time you actually experience", "Ninety-day retention against espionage cases that M-Trends 2026 puts at a 122-day median dwell time"],
                ["Did the attacker read the mailbox or just have access to it", "Mailbox audit and message access events, enabled at the right licence tier", "Access-only logging; you can prove entry and not exposure, which is exactly the distinction a regulator will ask about"],
                ["What did this process do after it launched", "Process creation with full command line, plus parent lineage and hashes", "Command line logging disabled by group policy default on Windows; you get the image name and nothing about the arguments"],
                ["Was the same credential used elsewhere", "Authentication events with a stable, joinable principal identifier across identity provider, cloud and endpoint", "Three systems that each log a different identifier for the same human, joinable only by hand"],
                ["Who changed the detection that should have caught this", "Audit logging of the security tooling itself", "Security platform admin actions unlogged or retained for thirty days"]
              ]
            },
            {
              kind: "principle",
              title: "The asymmetry",
              body: "Under-collection is a silent, permanent loss discovered only under pressure. Over-collection is a loud, recoverable cost discovered every month on an invoice. Given equal uncertainty, err toward collecting and route to cheap storage — but say that out loud, because it is a spending decision and it deserves a decision-maker."
            },
            {
              kind: "checklist",
              title: "The twelve questions that should drive your log source inventory",
              items: [
                "Can I reconstruct an identity's full session across the identity provider, the cloud control plane and the endpoint",
                "Can I distinguish access to data from exfiltration of data",
                "Can I see outbound network destinations from every network segment, including the ones nobody documented",
                "Can I see what executed, with arguments, on every class of endpoint including servers and build agents",
                "Can I see privilege changes in every system that grants privilege, including SaaS applications",
                "Can I see the creation, use and deletion of credentials, keys and tokens",
                "Can I detect the disabling of my own telemetry",
                "Can I answer any of the above about a device that was rebuilt after the incident",
                "Can I answer any of the above going back further than my worst realistic dwell time",
                "Can I join across sources without a human doing manual correlation",
                "Can I prove chain of custody for anything I would hand to a regulator or a court",
                "Can I answer these for the third parties and vendors with access to my environment"
              ]
            },
            {
              kind: "callout",
              title: "Write the retention decision down as a risk acceptance",
              body: "When you set retention at ninety days because that is what the budget allows, that is a legitimate business decision and a bad thing to discover during an incident. Convert it into a signed risk acceptance naming the specific investigative questions that become unanswerable past ninety days, with the dwell time data that makes it concrete. Two outcomes follow, both good: either you get the budget, or the organisation owns the decision explicitly instead of discovering it through you at the worst possible hour."
            }
          ],
          glossary: ["log-source-inventory", "investigative-precondition", "retention-risk-acceptance", "data-plane-telemetry"],
          awards: ["award-questions-first"]
        },
        {
          id: "ch-detection-telemetry-economics",
          kind: "lesson",
          title: "The Real Price of a Log Line",
          statement: "Telemetry is not bought once; it is rented per gigabyte per day forever, and the only defensible unit of value is questions answered per dollar.",
          minutes: 34,
          respect: 155,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Security data volumes grow whether or not you do anything, because the environment grows: more identities, more endpoints, more cloud services each emitting their own audit stream. Practitioner reporting consistently describes enterprise telemetry growth in the range of twenty to thirty percent a year with no change in policy. That means a flat budget is a compounding cut, and if you have not modelled it you will spend every year in an emergency reduction exercise driven by finance rather than by risk. The way out is to hold a cost model that a finance partner recognises as legitimate and that you can drive with engineering decisions."
            },
            {
              kind: "list",
              title: "The five cost components most teams collapse into one",
              items: [
                "Ingest and index. What most licences charge for, usually per gigabyte per day. The number everyone quotes and the only one anyone tracks.",
                "Retention. Storage over time, sharply different between hot searchable storage and cold object storage. Often an order of magnitude apart, sometimes two.",
                "Query. Compute for search, which in lake architectures is the dominant and most variable cost. A single badly written hunt over a year of data can cost more than a month of ingest.",
                "Egress and transfer. Cloud data leaving a region or a provider to reach your analytics tier. Silent until it is enormous.",
                "Human. Engineering time to parse, normalise, maintain and repair the pipeline when a vendor changes a field. This is real money and it never appears in the tooling business case."
              ]
            },
            {
              kind: "code",
              title: "The model you should be able to write from memory",
              lang: "python",
              body: "def annual_cost(gb_per_day, ingest_rate, hot_days, hot_gb_month, cold_gb_month, queries_per_day, gb_scanned, scan_rate):\n    ingest = gb_per_day * ingest_rate * 365\n    hot_storage = gb_per_day * hot_days * hot_gb_month * 12\n    cold_days = 365 - hot_days\n    cold_storage = gb_per_day * cold_days * cold_gb_month * 12\n    query = queries_per_day * gb_scanned * scan_rate * 365\n    return {\n        'ingest': ingest,\n        'hot_storage': hot_storage,\n        'cold_storage': cold_storage,\n        'query': query,\n        'total': ingest + hot_storage + cold_storage + query,\n    }\n\n\nif __name__ == '__main__':\n    baseline = annual_cost(\n        gb_per_day=1000,\n        ingest_rate=2.50,\n        hot_days=30,\n        hot_gb_month=0.023,\n        cold_gb_month=0.004,\n        queries_per_day=400,\n        gb_scanned=8,\n        scan_rate=0.005,\n    )\n    print(baseline)"
            },
            {
              kind: "callout",
              title: "Use your own rates, and notice what the model teaches",
              body: "The rates above are placeholders and you must replace them with your contracted numbers before this model is worth anything. What survives the substitution is the shape: ingest dominates in a classic SIEM, query dominates in a lake, and hot retention is where an unexamined default quietly doubles a bill. Run the model twice, once at your current volume and once at plus twenty-five percent, and you will have next year's budget conversation before finance opens it."
            },
            {
              kind: "table",
              title: "Tiering by the decision the data supports",
              headers: ["Tier", "Latency you need", "Typical residents", "Retention", "The mistake"],
              rows: [
                ["Detect", "Seconds to two minutes", "Identity events, control plane audit, EDR alerts and process creation, canary triggers", "7 to 30 days hot", "Putting everything here because it is the tier the SIEM sales engineer configured"],
                ["Investigate", "Minutes, queryable on demand", "Full endpoint telemetry, proxy and DNS, email metadata, VPC flow", "90 to 400 days warm", "Cutting this tier first during a budget exercise because it does not feed alerts"],
                ["Archive", "Hours, restore or scan in place", "Everything, in original form, compressed columnar in object storage", "1 to 7 years, driven by legal and regulatory duty", "Storing it in a format nobody can query without the original vendor"],
                ["Discard", "Never", "Genuinely valueless verbosity: debug chatter, health checks, duplicated agent heartbeats", "Zero", "Discarding at the collector without a written record of what was dropped and why"]
              ]
            },
            {
              kind: "principle",
              body: "Never drop data at the edge without an artefact recording what was dropped, by whom, on which date, and which detections were checked against it. The undocumented cost-saving filter is the most common cause of a detection that silently stopped working."
            },
            {
              kind: "metric",
              title: "The three ratios that make you credible in a budget meeting",
              body: "Executives do not evaluate gigabytes. They evaluate whether spend maps to answers.",
              items: [
                "Cost per detection question: annual cost of a source divided by the number of distinct investigative questions it uniquely answers. Sources that answer nothing uniquely are duplicates.",
                "Coverage attribution: the fraction of your paging detections that would break entirely if a given source were removed. Run this as a query against the rule repository, not as an opinion.",
                "Answerability horizon: the oldest date at which you can still fully reconstruct an identity's activity. Compare it to the dwell times in M-Trends. If your horizon is shorter than your realistic dwell time, you are buying data that expires before you need it."
              ]
            }
          ],
          glossary: ["telemetry-tiering", "cost-per-question", "answerability-horizon", "coverage-attribution", "ingest-rate"],
          awards: ["award-budget-defender"]
        },
        {
          id: "ch-detection-pipeline-lab",
          kind: "lab",
          title: "Lab: The Pipeline That Routes by Value",
          statement: "Decouple collection from destination, and the annual budget fight becomes a routing change instead of a capability loss.",
          minutes: 40,
          respect: 195,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "The architectural move that matters is putting a broker and a processing layer between your collectors and your analytics tiers. Once telemetry lands in a durable log such as Kafka, the question of where it goes becomes a configuration decision that you can change in an afternoon, rather than an agent redeployment across forty thousand hosts. The OpenTelemetry Collector has become the pragmatic default for the collection and processing half of this because it is vendor-neutral, has a large processor library, and is already deployed by your platform team for application observability. Reusing their infrastructure is often the fastest route to a security pipeline you do not have to justify separately."
            },
            {
              kind: "code",
              title: "Collector configuration with two pipelines from one collection path",
              lang: "yaml",
              body: "receivers:\n  otlp:\n    protocols:\n      grpc:\n        endpoint: 0.0.0.0:4317\n  filelog/edr:\n    include: [ /var/log/edr/telemetry.jsonl ]\n    start_at: end\n  filelog/auditd:\n    include: [ /var/log/audit/audit.log ]\n    operators:\n      - type: regex_parser\n        regex: 'type=(?P<audit_type>\\S+)'\n\nprocessors:\n  memory_limiter:\n    check_interval: 1s\n    limit_percentage: 75\n  batch:\n    send_batch_size: 8192\n    timeout: 5s\n  attributes/ocsf_stamp:\n    actions:\n      - key: metadata.version\n        action: upsert\n        value: 1.3.0\n      - key: metadata.product.name\n        action: upsert\n        value: edr-agent\n  filter/drop_health_chatter:\n    error_mode: ignore\n    logs:\n      log_record:\n        - 'IsMatch(attributes[event.name], ^agent_heartbeat$)'\n        - 'IsMatch(attributes[event.name], ^kubelet_probe$)'\n  transform/preserve_raw:\n    log_statements:\n      - context: log\n        statements:\n          - set(attributes[raw_data], body) where attributes[raw_data] == nil\n\nexporters:\n  kafka/detect:\n    brokers: [ kafka-0:9092, kafka-1:9092, kafka-2:9092 ]\n    topic: sec.detect\n    encoding: otlp_proto\n  kafka/lake:\n    brokers: [ kafka-0:9092, kafka-1:9092, kafka-2:9092 ]\n    topic: sec.lake\n    encoding: otlp_proto\n\nservice:\n  pipelines:\n    logs/detect:\n      receivers: [ otlp, filelog/edr, filelog/auditd ]\n      processors: [ memory_limiter, filter/drop_health_chatter, attributes/ocsf_stamp, batch ]\n      exporters: [ kafka/detect ]\n    logs/lake:\n      receivers: [ otlp, filelog/edr, filelog/auditd ]\n      processors: [ memory_limiter, transform/preserve_raw, attributes/ocsf_stamp, batch ]\n      exporters: [ kafka/lake ]\n  telemetry:\n    metrics:\n      level: detailed"
            },
            {
              kind: "list",
              title: "Read the config for the decisions it encodes",
              items: [
                "Two pipelines share receivers but not processors. The detect path is filtered for volume and speed; the lake path preserves the raw body. This is the whole architecture in one file: never let the cost-optimised path be the only path.",
                "The drop filter names exactly two event types and nothing else. Every entry added here should require a pull request and a note; this list is where capability quietly dies.",
                "memory_limiter is first in every pipeline. Under a telemetry burst, a collector without it will be OOM-killed and you will lose data during precisely the event you needed it for.",
                "The raw body is preserved into an attribute before any transformation, on the lake path only. Normalised data is for detection; raw data is for the investigation and for anything that might become evidence.",
                "Collector self-telemetry is set to detailed. The pipeline needs to be monitored like production infrastructure, because it is. Dropped-record and queue-depth metrics are your early warning that stage three of the funnel is failing."
              ]
            },
            {
              kind: "code",
              title: "Prove the pipeline is alive rather than assuming it",
              lang: "bash",
              body: "# 1. Per-source freshness. Anything stale is a blind spot, not a quiet network.\ncurl -s localhost:8888/metrics \\\n  | grep -E 'otelcol_receiver_accepted_log_records|otelcol_exporter_send_failed_log_records'\n\n# 2. Broker lag. Growing lag on the detect topic is detection latency you have not measured.\nkafka-consumer-groups.sh --bootstrap-server kafka-0:9092 \\\n  --describe --group siem-detect-ingest\n\n# 3. Synthetic canary event, end to end, every five minutes from a cron job.\nlogger -t sec-canary \"pipeline-probe id=$(uuidgen) ts=$(date -u +%s)\"\n\n# 4. Assert the probe arrived within the detect-tier latency budget.\npython3 tools/probe_latency.py --topic sec.detect --budget-seconds 120 --window 15m\n\n# 5. Daily reporting-host census against the asset inventory.\npython3 tools/host_census.py --source edr --inventory cmdb.csv --alert-below 0.98"
            },
            {
              kind: "callout",
              title: "The synthetic probe is not optional",
              body: "A cron job that emits a uniquely identifiable event every five minutes from a representative host in every network zone, and an assertion that it arrived inside the latency budget, will tell you about pipeline failures days before an analyst notices that a rule went quiet. It costs almost nothing and it is the difference between discovering a broken log source during a maintenance window and discovering it during a breach. Run one probe per zone and per log source class, not one globally; the failure modes are almost always partial."
            },
            {
              kind: "principle",
              body: "The pipeline is production infrastructure with a security function. Give it an SLO, an on-call, dashboards and change control, or accept that your detection coverage has an unmonitored single point of failure in front of it."
            }
          ],
          praxis: "Build the two-pipeline pattern in a lab: collectors feeding a broker, a filtered low-latency detect path and a raw-preserving lake path, plus the five verification checks. Deliberately break one path and measure how long your monitoring takes to tell you.",
          evidence: "The collector and broker configuration, a screenshot or export of the freshness and lag metrics, and a written timeline of the induced failure showing time-to-detection of the pipeline break itself.",
          glossary: ["opentelemetry-collector", "synthetic-probe", "broker-lag", "raw-preservation", "pipeline-slo"],
          awards: ["award-pipeline-architect"]
        },
        {
          id: "ch-detection-drill-budget-cut",
          kind: "drill",
          title: "Drill: Forty Percent, Thirty Days",
          statement: "A telemetry cut executed by volume destroys capability at random; a cut executed by detection dependency destroys almost nothing.",
          minutes: 24,
          respect: 160,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "This drill arrives in every career, usually in the same form: a number, a deadline, and no discussion of what the number costs. The reflex is to find the biggest source and cut it, because that is the fastest arithmetic. The reflex is wrong, and the reason is that volume and value are almost uncorrelated in security telemetry. DNS and flow records are enormous and cheap per unit of investigative value; identity provider events are tiny and irreplaceable. If you cut by volume you will hit the investigative tier hardest, which produces no visible degradation for months and then a catastrophic one during an incident."
            },
            {
              kind: "list",
              title: "The board on the table",
              items: [
                "Current ingest is about 1.2 TB per day across 41 sources; the CFO wants a 40 percent reduction in run rate within 30 days",
                "The top three sources by volume are DNS resolver logs, VPC flow logs, and Windows endpoint process telemetry",
                "Your paging detections reference 9 sources; your hunts reference 23; your last four incidents leaned on DNS and flow for scoping",
                "Retention is currently 400 days warm across everything, set by a default nobody has revisited since the platform was deployed",
                "Roughly 18 percent of ingest is duplicated: the same endpoint events arriving through both the EDR integration and a legacy forwarder",
                "Your median dwell time last year was 19 days; two of the four incidents involved activity that began more than 120 days before discovery"
              ]
            },
            {
              kind: "principle",
              body: "Cut duplication first, then retention on the sources with no long-tail investigative value, then hot-tier residency, then and only then consider dropping a source outright."
            }
          ],
          drill: {
            id: "ch-detection-drill-budget-cut-scene",
            scene: "Monday, 09:15. The CFO's message says the security data platform run rate must fall 40 percent by the end of the month; the number came from a company-wide cloud cost programme and is not negotiable in aggregate. Your platform engineer has already drafted a plan to turn off DNS logging.",
            clock: "30 days to the reduction, decision needed this week",
            pressure: "The number is fixed. Every option is a real loss. Whatever you cut, you will be asked about it in the next incident review.",
            prompt: "Choose the reduction strategy you will commit to in writing.",
            options: [
              {
                id: "opt-cut-biggest-source",
                label: "Turn off DNS resolver logging. It is the single largest source and no paging detection depends on it.",
                detail: "One change, hits the number immediately, no detection breaks on day one.",
                score: -3,
                outcome: "The target is met in nine days with no visible degradation. Four months later, during a compromise of a managed service provider account, you cannot answer which internal hosts resolved the attacker infrastructure, and scoping takes eleven days instead of two.",
                ripple: "You optimised for the metric that was measured and destroyed the capability that was not. DNS and flow records are the cheapest scoping data in existence per unit of answer; they rarely fire alerts and they underpin nearly every containment decision. The deeper failure is procedural: you let alert dependency stand in for investigative dependency, and those are different graphs."
              },
              {
                id: "opt-uniform-retention-cut",
                label: "Cut retention from 400 days to 90 across every source. No detection breaks, the saving is immediate and uniform.",
                detail: "Egalitarian, simple to explain, requires no analysis of which source matters.",
                score: -2,
                outcome: "The number is met. Detection is unaffected. Then a supply chain notification arrives referencing activity from seven months ago and you have nothing before day 90 for any source.",
                ripple: "Uniformity is the tell that no analysis happened. M-Trends 2026 puts espionage and North Korean IT worker cases at a 122-day median dwell time, and your own history already contained two incidents with activity older than 120 days. A 90-day horizon is a decision to be unable to investigate exactly the class of intrusion that matters most. Retention should be differentiated by investigative half-life, and identity and authentication events should be the last thing you shorten, not part of a flat cut."
              },
              {
                id: "opt-lake-everything",
                label: "Move all analytics to a cheap object-storage lake and run detections there. Modern architecture, structural cost reduction.",
                detail: "Eliminates the per-gigabyte licence entirely and keeps every source.",
                score: 1,
                outcome: "Costs fall structurally and every source survives. Detection latency for the identity and control-plane rules moves from under a minute to between eight and twenty-five minutes depending on partition pruning, and query spend becomes the new uncontrolled line item.",
                ripple: "This is the right destination reached at the wrong speed and without the tiering that makes it safe. A lake is excellent for the investigate and archive tiers and dangerous as the sole home of the detect tier, because credential-abuse detections have to beat an attacker whose hand-off window M-Trends now measures in seconds. Done over two quarters with a small hot detect tier retained, this becomes the best answer; done in thirty days as a single move, it trades a known bill for an unknown one and slows the only detections where minutes matter."
              },
              {
                id: "opt-route-by-dependency",
                label: "Cut by dependency: eliminate the duplicated feed, split retention by investigative half-life, shrink hot residency, and route full fidelity to cheap storage.",
                detail: "Query the rule repository for source dependency, kill the 18 percent duplication, keep DNS and flow at full fidelity in the lake with a short hot window, hold identity and control-plane events long and hot, and publish the residual capability loss as a named risk.",
                score: 3,
                isBest: true,
                outcome: "Duplication removal alone yields 18 percent. Reducing hot residency from 400 days to 30 for the high-volume network sources, with full retention in object storage, delivers the rest with room to spare. No source is lost. Two hunts get slower and are documented as such.",
                ripple: "You converted a capability question into an architecture question, which is the only way to win it. Three durable assets come out of this: a machine-readable dependency map from rules and hunts to sources that makes every future cut a five-minute analysis; a differentiated retention policy that survives the next reorganisation; and a written statement of residual loss that puts the risk where it belongs. You also proved to finance that security can absorb a cost target through engineering, which is the reputation that gets you heard next time the number is unreasonable."
              }
            ],
            debrief: "The correct instinct is to refuse the frame. You were handed a volume target and the only defensible response is a dependency analysis, because volume and investigative value are close to uncorrelated in this domain. Start with duplication, which is pure waste and usually larger than anyone expects — two collection paths for the same endpoint events is the single most common finding in a telemetry audit. Then differentiate retention by investigative half-life: identity, authentication and control-plane events have a long half-life and small volume, so keep them long; packet-adjacent network records have enormous volume and a shorter but non-trivial half-life, so keep them long in cheap storage and short in expensive storage. Hot residency is where the money hides, because hot storage is frequently an order of magnitude more expensive per gigabyte-month than object storage and almost nobody has revisited the default. Only after all of that do you consider dropping a source, and when you do, you write down what becomes unanswerable and get it accepted by someone with the authority to accept it. One more thing to carry: the dependency map is the deliverable, not the cut. Build it once and every subsequent budget conversation takes an hour instead of a month.",
            principle: "Never cut telemetry by volume. Cut by dependency, and make the residual loss a named, owned, written risk rather than a silent one."
          },
          glossary: ["investigative-half-life", "dependency-map", "hot-residency", "duplicated-feed"],
          awards: ["award-budget-defender", "award-honest-map"]
        },
        {
          id: "ch-detection-schema-normalisation",
          kind: "lesson",
          title: "Schema, Normalisation, and the Evidence You Destroyed",
          statement: "Normalise so detections are portable, preserve the raw so investigations are possible; a pipeline that does only the first has traded tomorrow's truth for today's convenience.",
          minutes: 30,
          respect: 170,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Every mature security data platform converges on a common schema, because without one every detection is written against a specific product's field names and dies when the product changes. The Open Cybersecurity Schema Framework has become the most widely adopted vendor-neutral option, and Elastic Common Schema remains widespread in the Elastic ecosystem. The choice matters less than the commitment; what destroys programs is having three half-applied schemas and a convention that lives in one engineer's head. But normalisation is lossy by construction, and the losses are where investigations go to die."
            },
            {
              kind: "compare",
              title: "What normalisation gives and what it takes",
              left: {
                title: "What you gain",
                items: [
                  "Detections written once against a field name that survives a vendor swap",
                  "Joins across sources without a bespoke translation per pair",
                  "A shared vocabulary between detection engineers, hunters and responders",
                  "Rule portability, so a community Sigma rule maps to your environment with a pipeline rather than a rewrite",
                  "Coverage measurement that can be computed rather than surveyed"
                ]
              },
              right: {
                title: "What you lose if you are careless",
                items: [
                  "Fields with no schema equivalent, silently dropped at the parser",
                  "Truncation: command lines cut at 4096 characters, exactly where the encoded payload lives",
                  "Type coercion errors that turn a distinguishing value into a null",
                  "Timestamp normalisation that discards the original source clock, making clock-skew analysis impossible",
                  "The vendor's own enrichment and confidence scoring, flattened into a severity integer",
                  "Any claim to evidentiary integrity, because you can no longer produce the original record"
                ]
              }
            },
            {
              kind: "table",
              title: "Normalisation defects that have cost real investigations time",
              headers: ["Defect", "How it presents", "The control"],
              rows: [
                ["Command line truncation", "Detections keyed on encoded payloads match nothing on the longest, most malicious command lines", "Assert maximum observed field length per source daily; alarm when a field hits its ceiling more than a trivial fraction of the time"],
                ["Field renamed upstream", "Rule matches drop to zero on a specific source while other sources look healthy", "Per-rule, per-source match counts with change-point detection; the silent-rule quarantine from Page I"],
                ["Timezone assumed local", "Cross-source timeline is internally inconsistent by hours and nobody trusts the reconstruction", "Store the original timestamp string alongside the normalised UTC value; never discard the source clock"],
                ["Identity fragmentation", "The same human appears as three unrelated principals and correlation rules never fire", "An identity resolution table maintained as a first-class asset, tested in CI like a detection"],
                ["Enrichment collapse", "A vendor verdict of suspicious-with-reasoning becomes severity equals 3 with no reasoning", "Preserve the vendor payload as a nested object on the lake path; normalise for detection, not for storage"]
              ]
            },
            {
              kind: "principle",
              title: "The two-copy rule",
              body: "Normalised for detection, raw for truth. If the normalised record is the only record you kept, then your incident report, your regulatory filing and your legal position all rest on the correctness of a parser that nobody has tested since it was written."
            },
            {
              kind: "checklist",
              title: "Parser change control, because a parser is a detection dependency",
              items: [
                "Parsers live in the same repository as the detections, reviewed by the same gate",
                "Every parser has a fixture set of real source records and asserted output fields",
                "A parser change runs the full detection test suite before merge, because a field rename breaks rules silently",
                "Field-level null rates are monitored per source with alarms on step changes",
                "The raw record is retained on the lake path for every source, without exception, for the full retention period",
                "Original timestamps and original severity values are preserved as separate fields, never overwritten",
                "There is a documented procedure for producing an original, unmodified record for legal or regulatory use, and it has been rehearsed"
              ]
            },
            {
              kind: "callout",
              title: "Identity resolution is the highest-leverage normalisation work you will do",
              body: "The single mapping from a human being to every identifier they hold — corporate account, cloud principal, endpoint user SID, service account they operate, personal device identifier, contractor account from the acquisition three years ago — unlocks more detection value than any individual rule. It turns a dozen weak signals scattered across systems into one strong story about one person. It is also unglamorous, never funded on its own merits, and degrades continuously. Fund it inside a project that has a sponsor, maintain it in version control, and test it in CI. The teams that have it detect account compromise in minutes; the teams that do not detect it when someone notices something strange."
            }
          ],
          glossary: ["ocsf", "identity-resolution", "field-truncation", "parser-change-control", "two-copy-rule"],
          awards: ["award-schema-keeper"]
        },
        {
          id: "ch-detection-council-log-budget",
          kind: "council",
          title: "Council: Buying Visibility From Someone Who Sees a Cost Centre",
          statement: "Finance does not refuse to fund visibility; it refuses to fund a number with no unit of value attached, and that is your failure to translate, not their failure to care.",
          minutes: 30,
          respect: 180,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "The telemetry budget conversation goes badly for a predictable reason. The security leader arrives with volume, cost and threat, and the finance leader hears an unbounded commitment justified by fear. Fear is not a unit of account, and a CFO who has been asked to fund fear three years running has learned to discount it. What works is arriving with a portfolio: specific questions the organisation will need answered, the specific data required to answer each, its price, and an explicit statement of what becomes unanswerable if it is not funded. That converts an open-ended ask into a menu with tradeoffs, and executives are extremely good at menus."
            },
            {
              kind: "compare",
              title: "Two ways to ask for the same money",
              left: {
                title: "What loses",
                items: [
                  "We need to increase SIEM ingest by 300 gigabytes a day",
                  "Threat actors are becoming more sophisticated",
                  "Our peers all have this and we are behind",
                  "If we do not do this we could be breached",
                  "The vendor recommends full endpoint telemetry",
                  "Here is a heatmap that is mostly red"
                ]
              },
              right: {
                title: "What wins",
                items: [
                  "For 210 thousand a year we can answer, within one shift, which customer records were accessed during an incident. Today that question takes us between two and six weeks and the answer is partial.",
                  "Our regulatory notification clock is 72 hours. Three of the four data sources needed to scope a notification inside that clock are not currently retained past 30 days.",
                  "Our own last four incidents required data from these six sources. Two of them we had to reconstruct from backups, which added nine days.",
                  "Here are three funding levels. At the lowest, these two questions become unanswerable and I am asking you to accept that in writing.",
                  "Of the increase, 40 percent is eliminated in year two by removing duplication we have already identified.",
                  "Here is the number we will report quarterly so you can see whether this bought what I said it would buy."
                ]
              }
            },
            {
              kind: "numbered",
              title: "How to run the meeting",
              items: [
                "Open with the question, never the technology. Which data left the building is a board-level question; gigabytes per day is not.",
                "Bring your own incident history first. Internal evidence beats industry statistics in every room, because it cannot be dismissed as vendor marketing or as somebody else's problem.",
                "Use external data only to establish that your history is not anomalous. M-Trends 2026 at a 14-day median dwell time and 122 days for espionage cases is the sentence that justifies retention length; do not use more than one or two such figures.",
                "Present three tiers, and make the lowest one genuinely viable. If the cheapest option is obviously unacceptable, you have presented a threat, not a choice, and you will be treated accordingly.",
                "Name what you will stop doing. A leader who only ever adds is managed as a cost; a leader who brings a decommission list alongside every ask is treated as an operator.",
                "Ask for the risk acceptance in writing at the level you did not get funded to. Do this without any hint of threat; the purpose is to place the decision with its owner, and a CFO who understands that is usually the one who finds the money.",
                "Close with the review date and the specific metric you will bring back. Funding renewed on evidence is easier than funding renewed on memory."
              ]
            },
            {
              kind: "quote",
              body: "Cost is what you pay to have the answer already; investigation is what you pay to reconstruct it.",
              source: "StepSAFE Praxis — Council doctrine, Chapter III"
            },
            {
              kind: "callout",
              title: "The move that changes the room",
              body: "Offer to reduce spend somewhere visible in the same meeting. Bring the duplication finding, the retired rules, the decommissioned tool. A security leader who has never returned money has no credibility when asking for it, and the asymmetry is severe: one demonstrated reduction buys you several years of being believed. This is not a rhetorical trick. It is a genuine discipline, and running your telemetry portfolio tightly enough to have something to give back is itself the practice."
            },
            {
              kind: "principle",
              body: "Translate visibility into answerability, price the answers, and put the unfunded questions in writing in front of the person who owns the risk. Then live with the decision without resentment, because you built the conditions for it to be made well."
            }
          ],
          glossary: ["answerability-horizon", "risk-acceptance", "funding-tiers", "decommission-list"],
          awards: ["award-board-clarity", "award-budget-defender"]
        }
      ]
    },
    {
      id: "ch-detection-page-coverage",
      title: "PAGE III — THE HONEST MAP",
      credential: "Certified Detection Engineer — Coverage Measurement and Adversary Emulation (StepSAFE Praxis, Chapter III, Page III)",
      summary: "Coverage is the most abused word in security. This Page replaces the green heatmap with a measurement: technique versus procedure, robustness against evasion using Summiting the Pyramid, layers generated from the rule repository rather than coloured by hand, and validation through Atomic Red Team and Caldera. It ends with running a purple team exercise that changes a control rather than producing a slide.",
      competencies: [
        "Distinguish technique coverage from procedure coverage and refuse claims that conflate them",
        "Score analytics for evasion robustness using the Summiting the Pyramid levels and observation points",
        "Generate an ATT&CK Navigator layer automatically from the detection repository and validation results",
        "Execute and clean up Atomic Red Team tests and convert results into detection fixtures",
        "Design a chained adversary emulation with Caldera and interpret partial execution honestly",
        "Run a purple team exercise that terminates in a merged control change with an owner"
      ],
      seal: "SEAL :: THE MAP",
      steps: [
        {
          id: "ch-detection-coverage-claim",
          kind: "construct",
          title: "Coverage Is a Claim, Not a Colour",
          statement: "A green square means somebody wrote something once; coverage means a specific procedure was executed in your environment and produced a decision.",
          minutes: 18,
          respect: 75,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "ATT&CK organises adversary behaviour into tactics, techniques, sub-techniques and procedures. A technique such as command and scripting interpreter is a category. A sub-technique such as PowerShell narrows it. A procedure is a specific way a specific actor did it: this loader, this encoding, this parent process, on this operating system version. Detections match procedures. Heatmaps colour techniques. That mismatch is the single largest source of self-deception in the discipline, and it is not subtle once you see it: a rule that catches one procedure of a technique with dozens of known procedures turns the entire technique green."
            },
            {
              kind: "table",
              title: "The coverage confidence scale — use this instead of a binary",
              headers: ["Score", "Meaning", "What it takes to claim it", "What it is worth in an incident"],
              rows: [
                ["0", "None", "Nothing written", "Nothing"],
                ["1", "Mapped intent", "A rule exists and someone tagged it with the technique", "Almost nothing; this is where most heatmaps actually sit"],
                ["2", "Written, untested", "Logic exists, compiles, has never been observed to fire on a true positive", "Unknown, and unknown should be treated as zero"],
                ["3", "Lab validated", "Fires on a controlled true positive in a lab environment", "Real, but silent about production noise and production telemetry gaps"],
                ["4", "Production validated", "Fires on an atomic or emulated test executed in production or a production-faithful environment, within latency, and the alert reached a queue", "This is the first score that means something operationally"],
                ["5", "Proven in engagement", "Detected genuine adversary or full-scope red team activity end to end, including analyst decision", "The only score you should report externally without qualification"]
              ]
            },
            {
              kind: "principle",
              body: "Report coverage as a distribution across confidence levels, never as a percentage. The moment you emit a single number, it becomes a target, and the cheapest way to move it is to write untested rules."
            },
            {
              kind: "list",
              title: "Four questions that collapse most coverage claims",
              items: [
                "Which procedure of this technique does the detection actually match, and how many other procedures are documented on the technique page?",
                "On which platforms and operating system versions was it validated, and does your fleet contain versions outside that set?",
                "What is the alert volume in production, and what fraction of alerts receive a real disposition? A rule nobody reads is not coverage.",
                "What single change by the adversary defeats it — renaming a binary, changing a parent process, adding whitespace to a command line? If the answer is trivial, the square should not be green."
              ]
            },
            {
              kind: "callout",
              title: "The honest failure mode is under-claiming",
              body: "Teams that score themselves rigorously almost always find their honest numbers are far lower than they expected, and the first instinct is to hide that from leadership. Do the opposite, immediately and with context. A program that reports forty techniques at production-validated confidence and is explicit about the rest is enormously more credible, and enormously more fundable, than one reporting eighty percent coverage that nobody believes. You get exactly one chance to reset the baseline honestly, and it is on the day you arrive."
            }
          ],
          glossary: ["procedure-coverage", "coverage-confidence", "attack-technique", "heatmap-fallacy"],
          awards: ["award-honest-map"]
        },
        {
          id: "ch-detection-navigator",
          kind: "lesson",
          title: "Generating the Map Instead of Painting It",
          statement: "If a human colours your coverage map, it records what that human believed on that day; if your pipeline generates it, it records what your detections actually do.",
          minutes: 26,
          respect: 120,
          trust: 6,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "ATT&CK Navigator consumes a layer file describing techniques with scores, colours, comments and metadata. Most organisations maintain their layer by hand in a workshop once a year, which means it is stale within weeks and reflects opinion rather than state. The correct pattern is to treat the layer as a build artefact: your CI reads every rule's technique tags, joins them to the validation results from the last test run, computes the confidence score, and emits the layer. Coverage then becomes a property of the repository rather than a meeting."
            },
            {
              kind: "table",
              title: "What each field of a generated layer should carry, and where it comes from",
              headers: ["Layer field", "Populate from", "Why it matters"],
              rows: [
                ["techniqueID", "The attack tag on the Sigma rule, validated against the current ATT&CK version in CI", "Prevents drift when techniques are renamed, split or deprecated between ATT&CK releases"],
                ["score", "The confidence scale from the previous Step, computed from validation records", "Turns colour into a measurement with a definition anyone can audit"],
                ["comment", "Rule ids, last validation date, and the named blind spots from the ADS", "Lets a reviewer see why a square is the colour it is without opening the repository"],
                ["metadata", "Alert volume, disposition rate, owner", "Exposes the rules that are green and useless in the same view as the rules that are green and load-bearing"],
                ["enabled or disabled state", "Whether the rule is deployed, quarantined or expired", "A quarantined silent rule must not colour a square; this is the most common source of phantom coverage"],
                ["Layer version and generation timestamp", "The build", "Any layer without a generation timestamp should be assumed to be a year old"]
              ]
            },
            {
              kind: "numbered",
              title: "Building the generator",
              items: [
                "Parse every rule for its technique tags and reject any tag that does not resolve against the pinned ATT&CK version.",
                "Join to the validation ledger: for each rule, the most recent successful true-positive validation, where it ran, and how long ago.",
                "Apply a decay function. A validation older than one quarter drops the confidence score by one level; older than two quarters drops it to written-untested. Detection rots and the map must show rot.",
                "Join to operational metrics: alerts per day, disposition rate, escalations. Attach as metadata, not as score, so operational noise never inflates coverage.",
                "Aggregate to the technique. Take the maximum confidence across contributing rules, but record the count of procedures covered separately, because one procedure of twelve is not the same as eight of twelve.",
                "Emit the layer, publish it as a build artefact, and diff it against the previous build. The diff is the interesting object: coverage that disappeared without anyone deciding it should is the finding."
              ]
            },
            {
              kind: "callout",
              title: "The comparison layer nobody builds and everybody needs",
              body: "Generate three layers and view them together: what you have detections for, what your telemetry could theoretically support even where no rule exists, and what the threat groups relevant to your sector actually use. The intersection of high-relevance and low-coverage is your backlog, in priority order, computed rather than argued. The set of techniques where telemetry exists but no rule does is your cheapest possible next quarter, because the expensive part — data collection — is already paid for. Most teams have never seen the second layer and are astonished by how much of it they are already funding."
            },
            {
              kind: "principle",
              body: "The valuable artefact is not the layer, it is the diff between layers over time. A map that only ever gets greener is a map that has stopped being measured."
            }
          ],
          glossary: ["attack-navigator", "coverage-layer", "validation-ledger", "coverage-decay", "detection-coverage-map"],
          awards: ["award-coverage-auditor"]
        },
        {
          id: "ch-detection-robustness",
          kind: "lesson",
          title: "Summiting the Pyramid: How Hard Is Your Analytic to Evade",
          statement: "Two detections for the same technique can differ by an order of magnitude in how easily an adversary defeats them, and until you score that difference you are counting rules rather than measuring defence.",
          minutes: 34,
          respect: 200,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "The Pyramid of Pain told us which indicators cost the adversary the most to change: hashes are trivial, addresses are cheap, domains cost a little, tools cost real effort, and tactics, techniques and procedures cost the most. Summiting the Pyramid, from the MITRE Center for Threat-Informed Defense, applies that logic inside the analytic itself. It asks not what the detection is about but which observable it keys on, and how tightly that observable is bound to the technique working at all. This is the maturity step that separates a team that writes many rules from a team that writes durable ones."
            },
            {
              kind: "table",
              title: "The robustness levels, from most evadable to least",
              headers: ["Level", "Name", "What the analytic keys on", "How an adversary defeats it"],
              rows: [
                ["1", "Ephemeral Values", "Values the adversary chooses freely: a filename, a hash, a mutex, a user agent string, a specific IP", "Change the value. Cost: minutes, often automated"],
                ["2", "Core to Adversary-Brought Tool or Outside Boundary", "Behaviour intrinsic to the tool the adversary brought, or activity observed outside the trust boundary", "Bring a different tool, or recompile. Cost: hours to days"],
                ["3", "Core to Pre-Existing Tools or Inside Boundary", "Behaviour of tooling already present on the system, or observation from inside the boundary", "Switch to a different living-off-the-land binary. Cost: real effort and reduced options"],
                ["4", "Core to Some Implementations of the (Sub-)Technique", "Something true of a class of implementations of the technique", "Choose a different implementation. Cost: significant, sometimes requires new capability"],
                ["5", "Core to the (Sub-)Technique", "Something that must be true for the technique to function at all", "Stop using the technique. Cost: maximal"]
              ]
            },
            {
              kind: "list",
              title: "The observation point matters as much as the level",
              items: [
                "Application (A): the application's own logs. Rich in meaning, easiest for an adversary with sufficient privilege to disable or forge.",
                "User-Mode (U): API and process telemetry from user space. The dominant source for endpoint detection and the layer most commonly tampered with by unhooking.",
                "Kernel-Mode (K): kernel callbacks and drivers. Hardest to defeat, most operationally expensive to collect and maintain.",
                "For network analytics the equivalent axis is Payload Visibility (P) versus Header Visibility (H), which is why the collapse of payload visibility under widespread encryption pushed so much network detection down the axis without anyone recording it as a coverage loss.",
                "Version 4 of the project added telemetry confidence scoring, which rates how reliably a given log source reports on a technique at all. That closes the loop back to Page II: robustness is meaningless if the source you depend on is unreliable."
              ]
            },
            {
              kind: "compare",
              title: "Same technique, two analytics",
              left: {
                title: "Level 1, Application observation",
                items: [
                  "Alerts when a process named the specific loader binary observed in last month's report executes",
                  "Written in twenty minutes from a threat intel report",
                  "Green on the heatmap the same afternoon",
                  "Defeated by renaming the file",
                  "Will fire zero times against the next campaign by the same actor",
                  "Genuinely useful for exactly one thing: retroactive hunting over historical data"
                ]
              },
              right: {
                title: "Level 4, Kernel observation",
                items: [
                  "Alerts on the sequence of operations the technique requires regardless of which binary performs them",
                  "Took two weeks including a study of benign implementations",
                  "Required a telemetry change to collect the necessary events",
                  "Defeated only by switching to a different implementation class",
                  "Fires on tooling that did not exist when it was written",
                  "Costs more to maintain and will outlive three tool vendors"
                ]
              }
            },
            {
              kind: "callout",
              title: "You need both, and you must label which is which",
              body: "Level 1 analytics are not bad; they are fast, cheap and precise, and during a live campaign they are exactly right. The failure is not writing them, it is failing to record their level, so that a repository of two hundred ephemeral-value rules reports the same coverage as a repository of forty behavioural ones. Put the robustness level in the rule metadata, aggregate it into the coverage layer, and report the distribution. Then the question in your quarterly review becomes the correct one: not how many detections do we have, but how many of them survive the adversary noticing us."
            },
            {
              kind: "principle",
              body: "Write low-level analytics for speed and high-level analytics for durability, label every one of them, and never let the fast ones count as the durable ones in a report."
            }
          ],
          glossary: ["summiting-the-pyramid", "analytic-robustness", "observation-point", "pyramid-of-pain", "telemetry-confidence"],
          awards: ["award-robust-analytic"]
        },
        {
          id: "ch-detection-atomic-lab",
          kind: "lab",
          title: "Lab: Atomic Tests, Caldera Chains, and the Validation Ledger",
          statement: "A detection is validated when a real technique execution produced a real alert in the real environment, and everything short of that is a hypothesis wearing a lab coat.",
          minutes: 40,
          respect: 190,
          trust: 12,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Atomic Red Team is a library of small, portable, cleanup-aware tests mapped to ATT&CK techniques, driven by the Invoke-AtomicTest PowerShell module. The library is large — the repository currently advertises well over 1,800 atomics across a few hundred techniques — and its value is that each test is a single, precise, repeatable procedure. Caldera is the complementary tool: an agent-based framework for chaining abilities into an operation with sequencing, so you can emulate a campaign rather than fire isolated techniques. Use both, for different purposes, and never confuse a technique test with an emulation plan."
            },
            {
              kind: "code",
              title: "Atomic execution with prerequisites, logging and cleanup",
              lang: "powershell",
              body: "Install-Module -Name invoke-atomicredteam -Scope CurrentUser -Force\nImport-Module invoke-atomicredteam -Force\n\n# 1. Read before you run. Every atomic is code executing on your host.\nInvoke-AtomicTest T1059.004 -ShowDetailsBrief\nInvoke-AtomicTest T1059.004 -TestNumbers 1 -ShowDetails\n\n# 2. Stage prerequisites explicitly so the test itself is the only variable.\nInvoke-AtomicTest T1059.004 -TestNumbers 1 -GetPrereqs\n\n# 3. Execute with a timestamped execution log. This log is the evidence.\nInvoke-AtomicTest T1059.004 -TestNumbers 1 -ExecutionLogPath C:/purple/2026-08-05-T1059.004.csv\n\n# 4. Always clean up. An uncleaned atomic becomes next quarter's false positive.\nInvoke-AtomicTest T1059.004 -TestNumbers 1 -Cleanup\n\n# 5. Run a whole tactic against a scoped host group, unattended, with a timeout.\nInvoke-AtomicTest All -TestNumbers 1 -PathToAtomicsFolder C:/AtomicRedTeam/atomics -TimeoutSeconds 120 -ExecutionLogPath C:/purple/sweep.csv"
            },
            {
              kind: "code",
              title: "Caldera for a chained operation, lab only",
              lang: "bash",
              body: "git clone https://github.com/mitre/caldera.git --recursive\ncd caldera\npip install -r requirements.txt\n\n# --insecure enables default credentials. Lab networks only, never on a routable segment.\npython server.py --insecure\n\n# Deploy an agent on the target from the Caldera UI payload, then:\n#   1. Build an adversary profile from abilities that mirror a real campaign order\n#   2. Run the operation with a planner that stops on failure rather than continuing blind\n#   3. Export the operation report as JSON for the validation ledger\n#\n# The value over atomics is sequencing: discovery informs the next ability,\n# which is how a real intrusion behaves and how partial detection actually shows up."
            },
            {
              kind: "code",
              title: "The validation ledger entry — the artefact that makes the coverage layer honest",
              lang: "yaml",
              body: "validation:\n  id: val-2026-08-05-t1059-004-01\n  technique: T1059.004\n  procedure: Atomic Red Team T1059.004 test 1, curl piped to shell\n  executed_at: 2026-08-05T14:22:11Z\n  executed_by: purple-team\n  environment: production-faithful staging, ubuntu 24.04, EDR agent 8.4.2\n  robustness_level: 2\n  observation_point: user-mode\n\n  telemetry:\n    emitted: true\n    source: edr.process_creation\n    first_event_at: 2026-08-05T14:22:12Z\n\n  ingestion:\n    arrived_at: 2026-08-05T14:22:41Z\n    latency_seconds: 29\n\n  matching:\n    rule: rules/linux/download_piped_to_shell.yml\n    matched: true\n\n  presentation:\n    queue: soc-enrichment\n    alerted_at: 2026-08-05T14:23:05Z\n\n  decision:\n    reached_analyst: false\n    note: rule is in the enrichment tier by design; correlated paging rule did not fire because no second signal was generated by the isolated test\n\n  confidence_awarded: 3\n  gaps_found:\n    - Ingestion latency of 29 seconds is inside budget but the p90 across the sweep was 74 seconds\n    - Command line field truncated at 4096 characters on two of the twelve hosts tested"
            },
            {
              kind: "checklist",
              title: "Rules of engagement before any atomic touches a production host",
              items: [
                "Written authorisation naming the hosts, the window and the techniques, approved by the system owner not only by security",
                "A named abort authority who can stop the exercise, reachable for the whole window",
                "The SOC informed or deliberately not informed, and that choice recorded — both are valid designs and only one of them tests the humans",
                "Every test reviewed for destructive potential; some atomics modify boot configuration or disable controls",
                "Cleanup verified by an independent check, not by the exit code of the cleanup command",
                "The execution log retained and joined to the validation ledger the same day, while the telemetry is still hot",
                "A rollback plan for any control you disabled to permit execution, with a deadline for re-enabling it"
              ]
            },
            {
              kind: "principle",
              body: "Record the whole funnel for every validation, not just whether the rule matched. Most validation failures are ingestion latency, truncation or routing, and a test that only asserts matching will report success on a detection that no human will ever see."
            }
          ],
          praxis: "Run at least eight Atomic Red Team tests spanning three tactics against a production-faithful host, record a full validation ledger entry for each covering all six funnel stages, and feed the results into your generated coverage layer.",
          evidence: "The execution logs, the eight ledger entries including at least one honest failure with the stage that failed identified, and the before-and-after coverage layer diff.",
          glossary: ["atomic-test", "adversary-emulation", "validation-ledger", "rules-of-engagement", "caldera-operation"],
          awards: ["award-atomic-validator", "award-red-to-green"]
        },
        {
          id: "ch-detection-drill-purple-block",
          kind: "drill",
          title: "Drill: The Exercise That Stopped at Step Two",
          statement: "A control that blocks early is a good outcome and a bad test; conflating the two is how organisations certify coverage they do not have.",
          minutes: 24,
          respect: 165,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "This is the most common failure of purple team reporting and it looks like a success. The emulation chain has eight steps. Step two is blocked by the endpoint agent. Steps three through eight therefore never execute, so nothing about them was observed. The temptation to report the chain as defended is enormous, because in a narrow sense it was: the adversary stopped. But the finding you actually produced is one prevention and six unknowns, and the six unknowns are where the next intrusion will live, because it will arrive through a path that does not include step two."
            },
            {
              kind: "timeline",
              title: "How the exercise actually went",
              items: [
                "09:00 — Operation begins. Step one, initial access simulation via a staged phishing payload on a test account. Executed successfully, alerted, analyst triaged in eleven minutes.",
                "09:14 — Step two, credential dumping. Blocked by the EDR agent at execution. Prevention alert raised, no further execution.",
                "09:14 — Steps three through eight, comprising lateral movement, persistence, discovery, collection, staging and exfiltration, never run.",
                "09:40 — Red lead reports the operation halted. The exercise sponsor is pleased.",
                "11:00 — You are asked for the report by end of day for the risk committee meeting tomorrow."
              ]
            },
            {
              kind: "principle",
              body: "Prevention and detection are different findings and must be reported in different columns. A blocked step tells you nothing about whether the block would have been noticed had it failed."
            }
          ],
          drill: {
            id: "ch-detection-drill-purple-block-scene",
            scene: "Wednesday, 11:00. The quarterly purple team operation halted at step two of eight when the endpoint agent blocked credential dumping. The risk committee meets tomorrow morning and the sponsor has already told two executives the exercise went well.",
            clock: "Report due by 17:00 today",
            pressure: "The sponsor wants a win. The committee will take whatever you write as the state of the environment for the next quarter.",
            prompt: "Decide what the report says and what happens next.",
            options: [
              {
                id: "opt-report-full-coverage",
                label: "Report the chain as successfully defended. The adversary was stopped at step two; that is the outcome the control exists to produce.",
                detail: "Technically accurate, matches the sponsor's expectation, closes the item.",
                score: -3,
                outcome: "The committee records the chain as covered. Two quarters later an intrusion arrives through a path that bypasses credential dumping entirely, and steps four through seven proceed for nine days without an alert.",
                ripple: "You did not merely misreport. You wrote a false entry into the organisation's risk memory, and risk memory is durable — the next three planning cycles will deprioritise this area because it is recorded as green. The damage compounds because nobody re-tests what is already covered."
              },
              {
                id: "opt-rules-exist",
                label: "Report the block, and mark steps three to eight as covered on the basis that rules exist in the repository for each of those techniques.",
                detail: "Uses evidence you actually have. The rules are written, mapped and deployed.",
                score: -2,
                outcome: "The report reads as thorough. During the next real incident, two of those six rules turn out to have been matching nothing for months because a field rename in an agent upgrade broke them.",
                ripple: "This is the coverage confidence scale collapsing under pressure: level 2, written and untested, being reported as level 4. It is the most seductive of the wrong answers because it feels like diligence — you consulted the repository. The lesson is that the existence of logic is not evidence about behaviour, and the whole point of the exercise was to obtain evidence about behaviour."
              },
              {
                id: "opt-disable-and-rerun",
                label: "Re-run the full chain with the endpoint agent disabled on the target so the remaining six steps can be observed.",
                detail: "Gets you real data on the untested steps, quickly, before the deadline.",
                score: -1,
                outcome: "You obtain execution of all eight steps and discover three detection gaps. You also spend two hours arguing with the platform owner, leave a host in a reduced state during business hours, and produce results for an environment configuration that does not exist in production.",
                ripple: "Tempting because the instinct is correct — you do need the rest of the chain — but the method invalidates the result and creates real risk. With the agent disabled you are testing a fictional environment, and any detection that depends on that agent's telemetry is now untestable rather than tested. Disabling a control to test detection is only defensible when the control's telemetry is not the detection's data source, which is rarely true on the endpoint."
              },
              {
                id: "opt-detect-only-window",
                label: "Report one prevention and six unknowns, then re-run the remainder in a scoped detect-only window with the block converted to alert-only for that specific technique on named hosts.",
                detail: "Keep the agent fully deployed and reporting; change only the response action for one technique on a small, monitored host set, inside an authorised window, with the SOC informed and a hard rollback time.",
                score: 3,
                isBest: true,
                outcome: "The report is honest and the committee understands the distinction immediately. The scoped re-run finds that two of the six remaining steps produce no alert at all and one produces an alert that never reaches a queue. Three specific defects are filed with owners.",
                ripple: "Three things persist. The organisation learns the difference between prevented and detected, which reshapes how it reads every future exercise report. Your exercise methodology now includes detect-only re-runs as standard, which means chains stop hiding behind their first block forever. And you established that an honest report with unknowns in it is not a failure of the exercise but its actual product, which is the cultural precondition for anyone ever telling you bad news again."
              }
            ],
            debrief: "The technique that makes this work is converting a preventive control to detect-only for one technique, on named hosts, for a bounded window, rather than disabling the control. The agent stays deployed, keeps producing telemetry, and keeps protecting against everything else; only the response action for the tested behaviour changes. That preserves the fidelity of the test environment, which is the whole point. Two further craft notes. First, sequence matters more than people expect: emulation chains that stop early systematically over-report defence, so design your operations so that later steps can be seeded independently — start step five from a known state rather than requiring steps one through four to succeed. Caldera makes this straightforward, and it is why chained emulation is worth the extra complexity over isolated atomics. Second, the reporting structure is a permanent asset. Three columns: prevented, detected, unknown. Unknown is the most valuable column and the one that disappears from every report written by someone trying to please a sponsor. Protect it. A quarterly exercise whose unknown column is always empty is not a rigorous programme, it is a ceremony.",
            principle: "Report prevented, detected and unknown as separate columns, and treat unknown as the deliverable. A blocked step is a finding about prevention and silence about detection."
          },
          glossary: ["detect-only-window", "prevention-versus-detection", "emulation-chain", "unknown-column"],
          awards: ["award-honest-map", "award-purple-discipline"]
        },
        {
          id: "ch-detection-field-purple",
          kind: "field",
          title: "Field: Run the Exercise That Changes a Control",
          statement: "An exercise that ends in a report has failed; an exercise that ends in a merged change with an owner and a date is the only kind worth the calendar time.",
          minutes: 40,
          respect: 205,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Most purple team exercises produce a document and a good feeling and change nothing, because the exercise is scoped as an assessment rather than as an engineering activity. The fix is structural: define the exercise's success criterion at the start as a set of merged changes, not as a set of findings. That single reframing changes who attends, how long the window is, and what happens in the room. It also changes the relationship with the red side from adversarial to collaborative, because both sides are now measured on the same output."
            },
            {
              kind: "numbered",
              title: "The exercise, end to end",
              items: [
                "Choose the adversary, not the technique list. Pick a threat group genuinely relevant to your sector and build the plan from its documented behaviours. An exercise justified by intelligence survives the question of why we are testing this.",
                "Write the emulation plan with steps that can be seeded independently, so a block at step two does not blind you to steps three through eight.",
                "Agree the rules of engagement in writing: hosts, window, abort authority, whether the SOC is informed, what may not be touched, and the rollback deadline for any control adjusted for the exercise.",
                "Instrument first. Confirm before you begin that the telemetry you expect to observe is actually flowing from the target hosts, using the freshness checks from Page II. Half of all failed exercises fail here and blame detection.",
                "Run it side by side in one room, physical or virtual, red executing and blue watching their own consoles live. The value of purple over sequential red-then-blue is entirely in the shared observation of the moment a technique produces no signal.",
                "Capture at every step: what was executed, what telemetry appeared, whether logic matched, whether an alert was raised, whether it reached a human, how long each stage took. The six-stage funnel is your capture template.",
                "Triage findings the same day into three buckets: telemetry gap, logic gap, routing or process gap. These go to three different owners and conflating them is why findings do not get fixed.",
                "Convert each finding into a repository issue with an owner and a date, then hold a re-test at the thirty-day mark that runs only the failed steps. The re-test is the part that separates a programme from an event.",
                "Update the coverage layer from the validation ledger, and report the diff, including anything that moved backwards."
              ]
            },
            {
              kind: "table",
              title: "Finding taxonomy — three buckets, three owners, three fix horizons",
              headers: ["Bucket", "Symptom during the exercise", "Owner", "Typical fix time"],
              rows: [
                ["Telemetry gap", "The technique executed and no event of any kind was produced or ingested", "Platform and detection engineering jointly", "Weeks; often requires agent configuration change or a licence decision"],
                ["Logic gap", "Events arrived, nothing matched", "Detection engineering", "Days; this is the bucket everyone assumes is the whole exercise"],
                ["Routing or process gap", "An alert was raised and no human saw it, or saw it and could not act", "SOC leadership", "Hours to days, and the highest return per hour of the three"]
              ]
            },
            {
              kind: "checklist",
              title: "The exercise was real if all of these are true thirty days later",
              items: [
                "At least one merged detection pull request cites the exercise as its origin",
                "At least one telemetry configuration changed as a result, with the cost impact recorded",
                "At least one runbook or routing rule changed because an alert reached nobody",
                "The failed steps were re-tested and the results recorded in the validation ledger",
                "The coverage layer diff was published and included at least one square that went down",
                "Someone outside security, typically a platform or application owner, took an action item and completed it",
                "The unknown column from the report has shrunk through testing rather than through assertion"
              ]
            },
            {
              kind: "callout",
              title: "On breach and attack simulation platforms",
              body: "Commercial BAS tools automate continuous execution of technique tests and are genuinely useful for regression: they will tell you the week a detection stops working, which manual quarterly exercises never will. What they cannot do is design an emulation of a specific adversary's tradecraft against your specific architecture, or notice that an alert reached a queue nobody reads. Buy BAS for continuous regression testing and staff purple teaming for discovery. Organisations that substitute the tool for the practice end up with a very high-frequency measurement of a very shallow question."
            }
          ],
          praxis: "Plan and run a purple team exercise against a named, intelligence-justified adversary profile, with independently seedable steps, live joint observation, and same-day triage into telemetry, logic and routing findings. Drive every finding to an owned issue with a date, then run the thirty-day re-test of failed steps only.",
          evidence: "The rules of engagement document, the emulation plan, the per-step funnel capture sheet, the three-bucket finding list with owners and dates, at least one merged pull request or configuration change citing the exercise, and the re-test results with the coverage layer diff.",
          glossary: ["purple-team", "emulation-plan", "breach-and-attack-simulation", "finding-taxonomy", "re-test-cadence"],
          awards: ["award-purple-discipline", "award-red-to-green", "award-coverage-auditor"]
        }
      ]
    },
    {
      id: "ch-detection-page-hunt",
      title: "PAGE IV — THE HUNT AND THE TRAP",
      credential: "Certified Detection Engineer — Threat Hunting and Deception Operations (StepSAFE Praxis, Chapter III, Page IV)",
      summary: "Hunting is what you do about the adversary your detections were not built for. This Page teaches hypothesis construction, the pyramid of pain applied to hunt design, the three analytical workhorses of stacking, long-tail and beaconing analysis, and then the cheapest high-signal detection ever invented: deception. It closes with a drill on the canary that fires at 03:00 and a field project to build a deception grid.",
      competencies: [
        "Write a falsifiable hunt hypothesis with a named data source and a defined negative result",
        "Choose hunt targets by adversary cost using the pyramid of pain rather than by data availability",
        "Execute stacking, long-tail and beaconing analyses and interpret their characteristic false positives",
        "Convert a successful hunt into a tested detection and a failed hunt into a telemetry requirement",
        "Deploy honeytokens and canaries with correct placement, alerting and rotation discipline",
        "Triage a deception trigger as a true positive by construction without over-reacting to the wrong entity"
      ],
      seal: "SEAL :: THE SNARE",
      steps: [
        {
          id: "ch-detection-hunt-hypothesis",
          kind: "construct",
          title: "Hypothesis, Not Vibes",
          statement: "A hunt without a written hypothesis and a defined negative result is browsing, and browsing produces neither findings nor the ability to say what you ruled out.",
          minutes: 20,
          respect: 80,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "The most common form of threat hunting in the wild is an analyst with spare time and a search bar. It occasionally finds something, which is why it persists, and it is unmanageable: you cannot schedule it, staff it, review it, or report on it, and when it finds nothing you cannot distinguish an absence of adversary from an absence of method. A hypothesis-driven hunt fixes all of that by making the hunt falsifiable. Three components are required, and if any is missing you do not yet have a hunt."
            },
            {
              kind: "numbered",
              title: "The three components of a real hypothesis",
              items: [
                "A specific adversary behaviour, stated as something someone did, not as a threat noun. Not ransomware, but: an operator staged an archive of file shares to a local directory before exfiltration.",
                "The data source in which evidence of that behaviour would appear, named precisely, including the fields you will use and the retention window available.",
                "The observable that would confirm it and, critically, the result that would refute it. What does normal look like, quantitatively, so that you can say this hunt found nothing rather than I did not see anything."
              ]
            },
            {
              kind: "table",
              title: "Weak hypothesis to strong hypothesis",
              headers: ["Weak", "Why it fails", "Strong"],
              rows: [
                ["Look for suspicious PowerShell", "Suspicious is not a predicate; no negative result is definable", "PowerShell processes whose parent is an Office application and whose command line exceeds 800 characters, over 30 days of process telemetry, expecting fewer than five per week from three known automation accounts"],
                ["Hunt for lateral movement", "Names a tactic, not a behaviour, and no data source", "Interactive logon type 10 sessions from a workstation to another workstation, which our architecture should never produce, over 90 days of authentication events"],
                ["Check for data exfiltration", "Unbounded, and the negative result is undefinable", "Outbound sessions exceeding 500 megabytes to destinations first observed in the last 14 days, from hosts in the finance segment, against 180 days of flow records"],
                ["See if anyone is beaconing", "No definition of beaconing, so no query and no threshold", "Source and destination pairs with at least 48 connections in 7 days whose inter-arrival gap has a coefficient of variation under 0.1, excluding known software update endpoints"]
              ]
            },
            {
              kind: "principle",
              body: "A hunt that ends with nothing found is a successful hunt if you can state precisely what you ruled out, over which window, using which data. That statement is the product. The finding, when it comes, is a bonus."
            },
            {
              kind: "list",
              title: "Every hunt has four possible outcomes and three of them are valuable",
              items: [
                "Adversary found. Rare. Becomes an incident, and the hunt becomes the incident's first evidence.",
                "Nothing found, data sufficient. The best common outcome. Record the coverage claim: this behaviour was absent from this data over this window. Then automate the hunt into a scheduled detection if it is cheap enough.",
                "Nothing found, data insufficient. The most valuable outcome for the programme, because you have just discovered a telemetry gap by trying to use telemetry rather than by auditing a list. File it against the log source inventory from Page II.",
                "Misconfiguration or unmanaged asset found. Extremely common and frequently more valuable than finding an adversary. Hunts are the best environmental discovery mechanism most organisations own, and this is how you get invited back by infrastructure teams."
              ]
            },
            {
              kind: "callout",
              title: "Write the hunt down before you run it",
              body: "One page: hypothesis, data source, query, expected normal, what would confirm, what would refute, and the window. Written before execution, because a hypothesis written afterwards will always be the one your results happened to support. This is the same discipline as pre-registration in science and it exists for the same reason: analysts are extremely good at finding a story in noise, and the only defence is committing to the prediction first."
            }
          ],
          glossary: ["hunt-hypothesis", "negative-result", "falsifiability", "telemetry-gap"],
          awards: ["award-hunt-first-blood"]
        },
        {
          id: "ch-detection-pyramid-hunt",
          kind: "lesson",
          title: "The Pyramid of Pain as a Hunt Planner",
          statement: "Hunt where change is expensive for the adversary, not where data is convenient for you.",
          minutes: 26,
          respect: 125,
          trust: 6,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "David Bianco's Pyramid of Pain ranks indicators by what it costs an adversary to change them: hash values at the bottom, then IP addresses, domain names, network and host artefacts, tools, and at the apex tactics, techniques and procedures. It is usually taught as an intelligence consumption model. It is more useful as a hunt planner, because it tells you which hunts have a shelf life measured in hours and which have one measured in years. The gravitational pull is always downward — indicator hunts are easy to write, easy to run, and produce clean binary answers — which is exactly why disciplined teams budget their hunt time upward."
            },
            {
              kind: "table",
              title: "Pyramid level to hunt design",
              headers: ["Level", "Cost to adversary of changing it", "What a hunt at this level looks like", "Shelf life of the hunt"],
              rows: [
                ["Hash values", "Trivial and automatic", "Sweep endpoint telemetry for known-bad hashes from a report", "Hours. Recompilation defeats it before the report is published"],
                ["IP addresses", "Trivial", "Search egress records for reported infrastructure", "Days. Worth running retrospectively over long windows, worthless prospectively"],
                ["Domain names", "Cheap but not free", "Search DNS for reported domains and for registration-pattern siblings", "Weeks. The sibling-pattern variant is where the value is"],
                ["Network and host artefacts", "Annoying; requires changing tooling behaviour", "Hunt for the user agent shape, the named pipe convention, the service description pattern, the certificate characteristics", "Months. This is where most productive hunting lives"],
                ["Tools", "Expensive; requires new capability or a new supplier", "Hunt for the behavioural fingerprint of a tool class regardless of binary: how it spawns, what it touches, in what order", "Quarters"],
                ["TTPs", "Maximal; requires changing how they operate", "Hunt for the objective: staging before exfiltration, credential access before lateral movement, discovery bursts from an account that has never enumerated anything", "Years, and it catches actors you have never heard of"]
              ]
            },
            {
              kind: "principle",
              body: "Spend roughly a fifth of hunt time at the bottom of the pyramid for fast retrospective sweeps and the rest at the artefact level and above. Indicator hunting feels productive because it terminates cleanly; behavioural hunting is productive because it does not have to be rewritten every week."
            },
            {
              kind: "compare",
              title: "Two hunts for the same intrusion set",
              left: {
                title: "Indicator hunt",
                items: [
                  "Input: 40 hashes and 12 IP addresses from a public report",
                  "Written in fifteen minutes, runs in two",
                  "Produces a clean yes or no over 90 days of history",
                  "Genuine value: retrospective. Tells you whether you were hit before the report existed",
                  "Zero prospective value once the actor rotates, which may already have happened",
                  "Cannot be converted into a durable detection"
                ]
              },
              right: {
                title: "Behavioural hunt",
                items: [
                  "Input: the actor's documented habit of staging archives to a specific directory class before exfiltration",
                  "Takes a day to write because you must first characterise normal",
                  "Produces a ranked list requiring judgement, not a binary",
                  "Catches the actor after rotation, and catches unrelated actors with the same habit",
                  "Frequently discovers unrelated problems: backup misconfiguration, shadow IT, a departing employee",
                  "Converts directly into a scheduled detection with a threshold you have already calibrated"
                ]
              }
            },
            {
              kind: "callout",
              title: "The conversion rule",
              body: "Every hunt that produces a repeatable analytic should be evaluated for conversion into a scheduled detection, and most should not be converted. The test is simple: can it run at an alert volume inside your paging budget, with a disposition an analyst can reach in under ten minutes, using an ADS a stranger could follow. If not, it stays a hunt on a cadence — monthly, quarterly — which is a legitimate permanent state and not a failure. The anti-pattern is converting every successful hunt into an alert, which is how a good hunting programme becomes the primary source of the alert fatigue described on Page I."
            }
          ],
          glossary: ["pyramid-of-pain", "indicator-hunt", "behavioural-hunt", "hunt-conversion", "retrospective-sweep"],
          awards: ["award-hunt-first-blood"]
        },
        {
          id: "ch-detection-hunt-lab",
          kind: "lab",
          title: "Lab: Stacking, the Long Tail, and Finding the Metronome",
          statement: "Three techniques — count the rare, rank the unusual, and measure the regularity — will find more real intrusions than any list of indicators you will ever be given.",
          minutes: 40,
          respect: 200,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "These three analyses require no machine learning, no baseline training period, and no vendor. They work on any structured field in any data set and they are the reason experienced hunters can be productive in an environment they saw for the first time that morning. Stacking counts values and surfaces the rare. Long-tail analysis, sometimes called least frequency of occurrence, ranks by rarity across a population. Beaconing analysis measures the regularity of the interval between connections. Learn all three properly and you have a portable hunting capability that survives every tooling change of your career."
            },
            {
              kind: "code",
              title: "Stacking: what runs almost nowhere",
              lang: "sql",
              body: "-- Rare executables across the fleet, with the context needed to judge them.\n-- The insight: malware is rare by construction; enterprise software is not.\nSELECT\n    process_name,\n    signer,\n    COUNT(DISTINCT host_id)              AS hosts,\n    COUNT(*)                             AS executions,\n    MIN(ts)                              AS first_seen,\n    MAX(ts)                              AS last_seen,\n    APPROX_SET(parent_process_name)      AS parents,\n    COUNT(DISTINCT user_name)            AS distinct_users\nFROM process_events\nWHERE ts > now() - INTERVAL '30' DAY\nGROUP BY process_name, signer\nHAVING COUNT(DISTINCT host_id) <= 3\n   AND COUNT(*) <= 40\nORDER BY hosts ASC, executions ASC\nLIMIT 300"
            },
            {
              kind: "code",
              title: "Long tail: rank by rarity within a meaningful population",
              lang: "kusto",
              body: "// Rare parent-child process relationships, scoped to servers only.\n// Scoping the population is the whole craft: rare across the whole estate is noise,\n// rare within a homogeneous server role is a finding.\nlet ServerCount = toscalar(DeviceInfo | where DeviceType == 'Server' | summarize dcount(DeviceId));\nDeviceProcessEvents\n| where Timestamp > ago(30d)\n| join kind=inner (\n    DeviceInfo\n    | where DeviceType == 'Server'\n    | distinct DeviceId, MachineGroup\n  ) on DeviceId\n| summarize\n      Hosts = dcount(DeviceId),\n      Runs = count(),\n      Users = dcount(AccountName),\n      Sample = any(ProcessCommandLine)\n  by MachineGroup, InitiatingProcessFileName, FileName\n| extend Rarity = todouble(Hosts) / todouble(ServerCount)\n| where Rarity < 0.02\n| order by Runs asc, Hosts asc\n| take 250"
            },
            {
              kind: "code",
              title: "Beaconing: measure the metronome, then account for jitter",
              lang: "sql",
              body: "WITH gaps AS (\n    SELECT\n        src_ip,\n        dest_host,\n        ts,\n        date_diff('second', LAG(ts) OVER (PARTITION BY src_ip, dest_host ORDER BY ts), ts) AS gap_s,\n        bytes_out\n    FROM egress_sessions\n    WHERE ts > now() - INTERVAL '7' DAY\n),\nshape AS (\n    SELECT\n        src_ip,\n        dest_host,\n        COUNT(*)                                   AS connections,\n        APPROX_PERCENTILE(gap_s, 0.5)              AS median_gap_s,\n        STDDEV_POP(gap_s)                          AS gap_sd,\n        APPROX_PERCENTILE(bytes_out, 0.5)          AS median_bytes,\n        STDDEV_POP(bytes_out)                      AS bytes_sd,\n        COUNT(DISTINCT date_trunc('hour', ts))     AS active_hours\n    FROM gaps\n    WHERE gap_s IS NOT NULL AND gap_s BETWEEN 5 AND 86400\n    GROUP BY src_ip, dest_host\n)\nSELECT\n    src_ip,\n    dest_host,\n    connections,\n    median_gap_s,\n    gap_sd / NULLIF(median_gap_s, 0)   AS gap_cv,\n    bytes_sd / NULLIF(median_bytes, 0) AS bytes_cv,\n    active_hours\nFROM shape\nWHERE connections >= 48\n  AND median_gap_s BETWEEN 30 AND 7200\n  AND gap_sd / NULLIF(median_gap_s, 0) < 0.15\n  AND active_hours >= 20\nORDER BY gap_cv ASC\nLIMIT 200"
            },
            {
              kind: "list",
              title: "What each query will actually return the first time you run it, and what to do about it",
              items: [
                "Stacking returns installer temporary files, per-user application updaters and one-off administrator utilities. Suppress by path class and signer, never by name, and keep the suppression list in version control with the rules.",
                "Long-tail analysis returns whatever is unique about your smallest machine group. Scope the population tightly — by role, by build image, by business unit — and rarity becomes meaningful instead of merely true.",
                "Beaconing returns software update checks, telemetry agents, certificate revocation checks and monitoring probes, all of which are more regular than malware. Your allowlist here is a durable asset; build it once, maintain it, and the query becomes usable forever.",
                "Modern implants add jitter, so a coefficient of variation threshold of 0.15 will miss anything jittered by twenty percent or more. Compensate by also ranking on the combination of low byte-size variance and high active-hour coverage: a channel that is dull in volume and awake at 04:00 every day is interesting even when its timing is irregular.",
                "The strongest beaconing signal in practice is not perfect regularity but persistence through a period when the host was otherwise idle. Join to logon sessions and rank pairs that continued while no user was present."
              ]
            },
            {
              kind: "callout",
              title: "The stacking trap that costs new hunters a week",
              body: "Rarity is only meaningful within a population that should be homogeneous. Stacking process names across a fleet containing developer workstations, kiosk terminals and domain controllers returns thousands of rare items, all legitimately rare, and the hunt drowns. Stack within a build image or a machine role and the same query returns a handful of items, each genuinely anomalous. Time spent defining the population is the highest-return time in the entire hunt, and it is the step that separates hunters who find things from hunters who produce long lists."
            },
            {
              kind: "principle",
              body: "Every hunt query you write should end its life in one of three places: a scheduled detection, a documented allowlist plus a recurring cadence, or a filed telemetry gap. A query that ends nowhere was entertainment."
            }
          ],
          praxis: "Run all three analyses against real telemetry from your own environment or lab over at least thirty days. Build and version-control the suppression and allowlist assets each one requires. Take one result from each analysis through to a written disposition.",
          evidence: "The three queries as run, the suppression assets in version control, a written hunt record per analysis stating hypothesis, window, what was ruled out, and the disposition of the top three results, including at least one telemetry gap filed against the log source inventory.",
          glossary: ["stack-counting", "long-tail-analysis", "beaconing-jitter", "coefficient-of-variation", "population-scoping"],
          awards: ["award-hunt-first-blood", "award-metronome"]
        },
        {
          id: "ch-detection-deception",
          kind: "lesson",
          title: "Deception: The Cheapest True Positive You Will Ever Own",
          statement: "Every other detection asks whether unusual activity is malicious; a canary only fires when something touched an object that exists for no other reason.",
          minutes: 28,
          respect: 145,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "The economics of deception are unlike anything else in detection. A canarytoken is a file, a DNS name, a credential or an API key that has no legitimate purpose. Nobody in your organisation has a reason to open it, resolve it, or use it. Therefore any interaction is, by construction, either an adversary, a scanner, or a misconfiguration — and all three are things you want to know about immediately. The false positive rate is not low; it is structurally near zero, which is why a canary alert can justifiably be a single-event page when almost nothing else can. Thinkst provides both a free hosted service at canarytokens.org and a commercial appliance line; the concept works equally well self-hosted."
            },
            {
              kind: "table",
              title: "Token types, placement, and what a trigger actually tells you",
              headers: ["Token", "Where it goes", "What firing means", "Placement mistake to avoid"],
              rows: [
                ["AWS API key with no permissions", "In a source repository, a CI environment file, a laptop credentials file, a wiki page about deployment", "Someone read a place credentials live and tried to use them. CloudTrail records the attempt even though the call fails", "Putting it somewhere a secret scanner will find and report as a real leak, generating an internal fire drill every quarter"],
                ["DNS token", "In a configuration file, a hosts entry, an internal documentation page, a scheduled task name", "Something resolved a name that only exists in that one file", "Placing it where a backup or indexing agent will parse the file and resolve the name, producing a recurring benign trigger"],
                ["Document token", "In a file share directory named plausibly: board papers, salary review, acquisition due diligence", "The document was opened, with the source address recorded", "Naming it so temptingly that a curious employee opens it, which is an HR event rather than a security one; name it plausibly, not irresistibly"],
                ["Fake privileged account in the directory", "In the identity provider, with a name matching your admin naming convention, no logon rights, never used", "Someone enumerated privileged accounts and attempted authentication", "Granting it real privileges to make it convincing, thereby creating the exposure you were trying to detect"],
                ["Honeypot service on a network segment", "On an unused address in a segment where nothing should be scanning", "Something is scanning a segment that has no legitimate scanner", "Forgetting to exclude it from the authorised vulnerability scanner, which then triggers it weekly forever"],
                ["Fake database record with a unique identifier", "Inside a production table, alongside real records", "That record appeared somewhere it should not: a paste site, a support ticket, an outbound file", "Failing to tell the data team, so it is discovered during a data quality audit and deleted"]
              ]
            },
            {
              kind: "numbered",
              title: "The operational rules that keep deception valuable",
              items: [
                "Register every token in an inventory: what it is, where it was placed, when, by whom, what firing should mean, and who to call. An untracked token that fires in two years is an unsolvable mystery and will be closed as noise.",
                "Route canary alerts on a path that is architecturally separate from your main alert pipeline. If your SIEM ingestion is broken or your environment is being actively disrupted, this is exactly when the canary matters most.",
                "Alert on the first event, always. This is the one detection class where thresholds and aggregation are wrong.",
                "Rotate placements periodically rather than merely rotating tokens. Attackers who have seen your environment before learn where you put them, and a token in the same directory for three years is a token an experienced operator steps around.",
                "Never tell more people than necessary, and record precisely who knows. A deception grid whose locations are documented on the intranet is a map for the adversary who reads the intranet.",
                "Test them on a schedule. A canary that has silently stopped reporting is worse than no canary, because you are counting on it. Trigger one deliberately each quarter and confirm the whole path from trigger to page.",
                "Decide in advance what response a trigger warrants, and write it down before the first one fires. Three in the morning is not the time to be deciding whether a canary is a real incident."
              ]
            },
            {
              kind: "metric",
              title: "Why this is the best cost-per-signal in the discipline",
              body: "Compare against any other detection you own, using the same unit: engineering hours plus recurring cost, divided by high-confidence true positives per year.",
              items: [
                "Setup cost: minutes per token for the hosted variety, a few days for a well-designed grid of several dozen with an inventory.",
                "Recurring cost: effectively zero ingest, zero tuning, no rule maintenance, no schema dependency.",
                "False positive rate: structurally near zero, and the exceptions are known in advance — your own scanners, your own backup agents, your own secret scanners.",
                "Detection stage reached: a canary fires at the adversary's discovery and credential access phase, which is early, and it fires regardless of which tool they brought.",
                "Robustness in Summiting the Pyramid terms: the adversary cannot evade a canary by changing tooling, only by not looking — which constrains their behaviour, which is itself a win."
              ]
            },
            {
              kind: "callout",
              title: "The strategic effect that does not show up in any metric",
              body: "A well-known deception programme changes adversary behaviour before it detects anything. An operator who believes credentials in your environment may be poisoned moves more slowly, tests more carefully, and touches fewer things — which extends your detection window against every other control you own. This is one of the very few places in defence where the mere credible existence of a capability provides value. It also argues for a deliberate communications choice: publicise that you run deception, never where. Announce the practice, hide the placements."
            }
          ],
          glossary: ["honeytoken", "canary-token", "deception-grid", "single-event-alert", "token-inventory"],
          awards: ["award-canary-keeper", "award-trap-setter"]
        },
        {
          id: "ch-detection-drill-canary",
          kind: "drill",
          title: "Drill: The Canary Fires at 03:12",
          statement: "A deception trigger is a true positive by construction; the only open question is which entity to contain, and the obvious one is frequently the wrong one.",
          minutes: 22,
          respect: 155,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Deception removes the hardest question in detection — is this malicious — and replaces it with a subtler one. Something interacted with an object that exists for no legitimate reason. The interaction has attributes: a source address, a user agent, a principal, a timestamp. Those attributes describe the thing that touched the token, which may not be the thing you should contain, and may not even be a thing that knows it touched anything. Getting this wrong at 03:12 in either direction — dismissing it, or detonating on the wrong entity — is the difference between a clean containment and a bad week."
            },
            {
              kind: "list",
              title: "What the page contains",
              items: [
                "An AWS access key canarytoken, planted eleven months ago in a file named deploy.env inside a private source repository, was used to call an AWS API",
                "The call failed, as designed; the key has no permissions. CloudTrail recorded the attempt",
                "Source address resolves to your corporate office egress range",
                "The calling user agent string indicates a common cloud enumeration tool, not the AWS CLI or an SDK",
                "The token inventory says the placement was in a repository owned by the platform engineering team; three engineers have write access, eleven have read",
                "One of those eleven is a contractor whose engagement ended nine days ago; offboarding shows the identity was disabled but the source control access was via a personal account linked by email",
                "It is 03:12 on a Saturday"
              ]
            },
            {
              kind: "principle",
              body: "Contain the access path, not the person, until you know which is which. The identity attached to a trigger is a hypothesis about who; the path the token travelled is a fact about how."
            }
          ],
          drill: {
            id: "ch-detection-drill-canary-scene",
            scene: "03:12 Saturday. A canary AWS key planted in a private repository eleven months ago has just been used from your corporate office egress address, with a cloud enumeration tool user agent. The key had no permissions and the call failed. You are the on-call incident lead.",
            clock: "First decision inside 15 minutes",
            pressure: "Weekend skeleton staffing. The obvious suspect is a contractor whose access was supposedly removed nine days ago. The office address makes it look internal and routine.",
            prompt: "Take the first action.",
            options: [
              {
                id: "opt-close-benign",
                label: "Close it. The source is the office egress address, the key has no permissions, the call failed, and it is almost certainly someone's security scanner.",
                detail: "Low impact, no permissions, internal source. Note it for Monday.",
                score: -3,
                outcome: "The alert is closed in four minutes. The enumeration tool continues through the repository's other secrets for six hours. Two of them are real. The intrusion is confirmed eleven days later by an external notification.",
                ripple: "You inverted the entire logic of deception. The token has no legitimate reason to be touched by anything, so the source being internal makes it more alarming, not less: an internal source means the thing reading your private repository secrets is already inside. Closing a canary as benign because it came from the office is the single most common way deception programmes fail, and it usually happens once and permanently, because the closure teaches the next analyst that these are noise."
              },
              {
                id: "opt-slack-the-contractor",
                label: "Message the contractor and the three repository owners on Slack to ask whether anyone is running a scanner, then decide based on the replies.",
                detail: "Fast, cheap, resolves the most likely benign explanation before escalating on a Saturday.",
                score: -2,
                outcome: "Two of four reply within the hour, both saying no. The contractor does not reply. Ninety minutes are lost, and if the contractor's account is the compromised path you have now announced the investigation to whoever controls it.",
                ripple: "Two failures compound here. You tipped off a potentially adversary-controlled account, and you used a communications channel that may itself be compromised for incident coordination. The habit to build is that early-phase incident communication about a suspected identity compromise never goes through a channel that identity can read, and never goes to the suspected identity at all. There is a version of this question that is worth asking, but it goes to the repository platform's audit log, not to a human on Slack."
              },
              {
                id: "opt-full-lockdown",
                label: "Declare a P1, disable the contractor's accounts, isolate any device associated with them, and wake the CISO.",
                detail: "Decisive containment on the most likely path. Better to over-react on a true positive.",
                score: 1,
                outcome: "Containment is fast and the contractor turns out to be uninvolved. The actual path was a compromised build agent that had cloned the repository into a workspace six months ago and was subsequently attacked through an unrelated vulnerability. Four hours are spent on the wrong entity.",
                ripple: "Not a disaster, and far better than closing it, but it shows the characteristic error of acting on the most available identity rather than the most probable path. The token was in a repository; anything that ever cloned that repository holds a copy. The set of entities that could have read it is much larger than the set of humans with access, and includes CI systems, backup snapshots, developer laptops, container images and artefact caches. Enumerate the copies before you pick a suspect."
              },
              {
                id: "opt-path-first",
                label: "Treat it as a confirmed P1, revoke and rotate every secret in that repository, enumerate everything that has ever cloned it, and pull the source control and cloud audit logs for the source address before touching any individual.",
                detail: "Contain the artefact and the path. In parallel, query the office egress NAT logs to resolve the internal host behind the shared address, and check whether the enumeration tool user agent appears anywhere else in the last 30 days.",
                score: 3,
                isBest: true,
                outcome: "The NAT resolution identifies a build agent inside the office range within twenty minutes. Repository audit logs show it cloned the repository in February. Secret rotation is underway before the responsible host is even confirmed, and the enumeration user agent search finds two earlier attempts against a different account that nobody had noticed.",
                ripple: "You built the habit that matters: containment follows the artefact and the path, attribution follows the evidence, and the two run in parallel rather than in sequence. The user agent pivot is the part that generalises furthest — a canary gives you one confirmed adversary attribute, and the highest-value immediate move is always to search everywhere else for that attribute, because a confirmed indicator from your own environment is worth more than any external feed. You also discovered the real lesson: an egress NAT address that cannot be resolved to an internal host is a blind spot that would have cost hours, and that goes on the telemetry backlog on Monday."
              }
            ],
            debrief: "Three transferable moves. First, the direction of inference for deception is opposite to normal alerting: an internal source raises severity rather than lowering it, because the token only exists inside. Analysts trained on conventional alerts will get this backwards, so it must be written explicitly in the canary runbook. Second, contain the artefact before you attribute the actor. A secret in a repository has been copied to every clone, cache, container image and backup that ever touched it; rotation and revocation are unambiguous, reversible-in-cost, and do not require knowing who. Attribution is slower, more likely to be wrong, and far more expensive when it is wrong — you can always rotate a key back into service, you cannot un-accuse a colleague. Third, pivot on the confirmed attribute immediately. The user agent, the source address, the timing: these are now known-adversary attributes in your environment, worth more than any external intelligence feed, and searching for them across all telemetry in the first hour is consistently the highest-yield action available. Note the underlying architecture lesson too: shared egress addresses that cannot be resolved back to an internal host are a systemic blind spot which turns every external-facing detection into a dead end. That finding, produced by a fifteen-dollar-a-year canary, is worth more than the canary.",
            principle: "A deception trigger is not a question about whether. It is a question about which path, and the path is contained by rotating the artefact, not by disabling a person."
          },
          glossary: ["canary-token", "artefact-containment", "attribute-pivot", "egress-nat-resolution"],
          awards: ["award-canary-keeper", "award-quiet-pager"]
        },
        {
          id: "ch-detection-field-deception",
          kind: "field",
          title: "Field: Build the Deception Grid",
          statement: "Thirty well-placed tokens with an inventory and a rehearsed response beat three hundred scattered ones nobody remembers planting.",
          minutes: 34,
          respect: 165,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "A deception grid is not a pile of tokens. It is a deliberate placement design that maps to the paths an adversary must traverse, an inventory that makes every trigger interpretable, an alert route that survives the compromise of your main pipeline, and a rehearsed response. Built properly it takes a few days and then costs almost nothing to run, which makes it the highest-return project available to a small team. Built carelessly it produces one mysterious alert a year that gets closed as noise."
            },
            {
              kind: "numbered",
              title: "Design the placements against the attacker's path, not against your org chart",
              items: [
                "Discovery: a fake privileged account in the directory matching your admin naming convention, with no rights and no logon capability, and a share on a file server named for something an operator enumerating shares would open.",
                "Credential access: AWS or cloud API key tokens in the four places credentials genuinely live — a repository environment file, a CI variable store, a developer laptop credentials directory, and an internal wiki page about deployment.",
                "Lateral movement: a DNS token embedded in a scheduled task definition and a saved remote desktop connection file on a jump host, both of which an operator surveying a foothold will read.",
                "Collection: document tokens in file shares named plausibly for sensitive material, placed in directories that a search for common sensitive filename patterns would return.",
                "Exfiltration and third party: a unique fake record inside a production data set, so that its appearance in a paste, a support ticket or an outbound file is unambiguous evidence of where the data came from.",
                "Vendor and supply chain: a token in whatever artefact you share with third parties, so that a breach at a supplier reveals itself through your data rather than through their notification timeline."
              ]
            },
            {
              kind: "code",
              title: "The inventory record — one per token, in version control, access-restricted",
              lang: "yaml",
              body: "token:\n  id: cn-2026-014\n  type: aws-api-key\n  provider: canarytokens-self-hosted\n  planted_on: 2026-08-05\n  planted_by: detection-guild\n  rotate_placement_by: 2027-02-05\n\n  placement:\n    system: source control, repository platform-deploy\n    path: config/deploy.env\n    visible_to: platform-engineering read group, 14 principals at time of planting\n    rationale: mirrors the real location of deployment credentials in this repository\n\n  expected_benign_triggers:\n    - none; the secret scanner is configured to skip this path via an allowlist entry\n\n  on_trigger:\n    severity: P1 on first event, no threshold\n    route: canary-page channel, out of band from the SIEM, direct to the incident pager\n    first_actions:\n      - rotate every real secret in the same repository\n      - enumerate all clones, caches, CI workspaces and container images derived from it\n      - resolve the source address to an internal host before contacting any individual\n      - pivot on the user agent and source address across all telemetry for 30 days\n    do_not:\n      - contact the apparent user via a channel that user can read\n      - close as benign on the basis of an internal source address\n\n  test:\n    last_verified: 2026-07-30\n    cadence_days: 90\n    method: trigger from an isolated lab address and confirm the page arrives within 5 minutes"
            },
            {
              kind: "checklist",
              title: "Before you consider the grid live",
              items: [
                "Every token has an inventory record with an on-trigger runbook written before the first trigger",
                "The alert path is out of band from the SIEM and has been tested end to end from trigger to page",
                "Your own scanners, backup agents and secret detection tools are allowlisted at each placement, and each exception is recorded",
                "The set of people who know the placements is written down and is as small as the design allows",
                "The response runbook explicitly states that an internal source address increases severity",
                "A quarterly test schedule exists and the first test has been executed and recorded",
                "Legal and HR have been consulted about the document tokens in shared locations, because a trigger by a curious employee is a personnel matter with rules you do not get to invent at 03:00",
                "Someone other than the person who planted them can operate the grid, because they will be on holiday when it fires"
              ]
            },
            {
              kind: "callout",
              title: "The mistake that makes a grid worthless in eighteen months",
              body: "Tokens are planted during a burst of enthusiasm, the inventory is a spreadsheet on someone's drive, and the person who planted them changes role. Eighteen months later a token fires and nobody can say what it was, where it was, or what it means, so it is closed as noise — and correctly so, because an uninterpretable alert is worse than none. The inventory is not administrative overhead around the interesting work. The inventory is the work. Tokens are trivially easy to create; the durable asset is the record that makes a future trigger meaningful."
            }
          ],
          praxis: "Design and deploy a deception grid of at least twelve tokens spanning discovery, credential access, lateral movement and collection. Build the version-controlled inventory with per-token runbooks, establish an out-of-band alert path, allowlist your own scanning tooling, and execute one full end-to-end trigger test.",
          evidence: "The placement design mapped to attacker path stages, the inventory records with redacted placement paths, proof of the out-of-band alert route, and the timed result of the end-to-end trigger test showing trigger-to-page latency.",
          glossary: ["deception-grid", "token-inventory", "out-of-band-alerting", "placement-rotation"],
          awards: ["award-trap-setter", "award-canary-keeper"]
        }
      ]
    },
    {
      id: "ch-detection-page-room",
      title: "PAGE V — THE ROOM WHERE IT HAPPENS",
      credential: "Certified Detection Engineer — Security Operations Design and Cloud Detection (StepSAFE Praxis, Chapter III, Page V)",
      summary: "A SOC is a queueing system staffed by people whose attention is the scarcest resource you manage. This Page covers tiered versus tierless design, the handoff problem, automation that is worth building, the specific ways MTTD and MTTR get gamed, cloud detection where the control plane is the crime scene, the on-call design that keeps senior people for years, and how to tell a board what you can and cannot see.",
      competencies: [
        "Model the SOC as a queueing system and predict where added load will fail first",
        "Choose between tiered and tierless operating models on the basis of the work, not fashion",
        "Design a handoff artefact that survives shift, timezone and vendor boundaries",
        "Detect the specific gaming behaviours that MTTD and MTTR incentivise, and instrument against them",
        "Build identity-centric cloud detection distinguishing control-plane from data-plane evidence",
        "Present detection capability to a board in terms of decisions and blind spots rather than tooling"
      ],
      seal: "SEAL :: THE WATCH",
      steps: [
        {
          id: "ch-detection-soc-queue",
          kind: "construct",
          title: "The SOC Is a Queueing System",
          statement: "Attention is the scarce resource, arrival rate is set by your own engineering choices, and every queueing system fails the same way when utilisation approaches one.",
          minutes: 18,
          respect: 75,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              body: "Treat the SOC as an operations research problem and most of its pathologies become predictable rather than mysterious. Alerts arrive at some rate. Analysts service them at some rate. When utilisation — arrivals divided by capacity — approaches one, waiting time does not increase linearly, it increases without bound. This is why a SOC running at what looks like a comfortable eighty-five percent capacity is in fact one bad Tuesday from a queue it will never clear, and why adding a single additional noisy rule can appear to break a team that absorbed the previous forty without complaint."
            },
            {
              kind: "list",
              title: "The five variables you actually control",
              items: [
                "Arrival rate. Set almost entirely by your own detection engineering, which means alert volume is a design output, not an environmental fact. This is the variable with the most leverage and the one most often treated as fixed.",
                "Service time. How long one alert takes to disposition. Reduced by context at the point of alert — enrichment, ADS response steps, prior related alerts — far more than by analyst skill.",
                "Variance. Two alerts averaging six minutes may be one at thirty seconds and one at twelve minutes. High variance destroys predictability and is what makes shifts feel worse than the averages suggest.",
                "Capacity. Analyst hours, but degraded by context switching, meetings, and the fact that a human at hour seven of a night shift is not the same servicer as at hour one.",
                "Abandonment. The rate at which items leave the queue without a real decision. This is the failure mode that does not show up as a backlog, because the queue looks healthy while the work is being discarded."
              ]
            },
            {
              kind: "metric",
              title: "Instrument these four and you can see the system, not just the backlog",
              body: "Backlog depth alone is the least informative number in security operations, because a healthy-looking queue can be maintained indefinitely by closing things carelessly.",
              items: [
                "Utilisation: alert arrivals multiplied by median service time, divided by available analyst hours. Above 0.7 sustained, plan for failure; above 0.85, you are already failing and have not noticed.",
                "Disposition depth: the fraction of closures that involved at least one pivot into another data source. Shallow closures rising is the earliest signal of abandonment.",
                "Service time distribution, not the mean. Watch the 90th percentile; that tail is where the real incidents live and where the tail collapsing to the median means people have stopped investigating.",
                "Time-to-first-touch versus time-to-disposition. A widening gap means the queue is being triaged for appearance rather than worked."
              ]
            },
            {
              kind: "principle",
              body: "You cannot hire your way out of an arrival-rate problem. Every additional analyst adds capacity linearly and every additional detection adds arrivals in proportion to the environment, which grows on its own. The only sustainable control point is the generator."
            },
            {
              kind: "callout",
              title: "Abandonment is invisible on every dashboard you own",
              body: "When a system is overloaded, humans do not stop working; they shorten. The alert is opened, glanced at, and closed with a plausible reason. The queue looks fine. Throughput looks excellent. Mean time to respond improves. Every metric on the wall says the team is performing better than ever, and the environment has quietly stopped being monitored. The only instruments that catch this are disposition depth and the service time distribution, which is why they belong on the same screen as the backlog and almost never are."
            }
          ],
          glossary: ["queueing-utilisation", "disposition-depth", "alert-abandonment", "service-time-distribution"],
          awards: ["award-queue-sight"]
        },
        {
          id: "ch-detection-tiering",
          kind: "lesson",
          title: "Tiered, Tierless, and the Handoff Problem",
          statement: "Tiering optimises for throughput on repetitive work and taxes every investigation that crosses its boundary; choose it deliberately or it will choose itself.",
          minutes: 30,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "The classic three-tier SOC exists because it is an efficient answer to a real problem: when most alerts are repetitive and low-complexity, routing them to cheaper, less experienced staff and escalating the rest is straightforward economics. It works. Its costs are also real and consistently underestimated, and they concentrate at the boundaries. Every escalation is a handoff, every handoff loses context, and the loss is worst on exactly the alerts that mattered, because those are the ones with the most context to lose. The tierless model — every analyst owns an alert from arrival to conclusion, with specialists available for consultation rather than escalation — trades throughput for continuity and for a much better talent development curve."
            },
            {
              kind: "compare",
              title: "The honest comparison",
              left: {
                title: "Tiered",
                items: [
                  "Scales headcount cheaply; tier one is a viable entry-level role and a real hiring pipeline",
                  "Predictable throughput on repetitive volume, easy to outsource the first tier",
                  "Clear career ladder that people can see from outside",
                  "Context loss at every escalation, worst on complex alerts",
                  "Tier one work is often genuinely deadening, which is a leading cause of the attrition it enables you to absorb",
                  "Creates a structural incentive to escalate ambiguity rather than resolve it"
                ]
              },
              right: {
                title: "Tierless",
                items: [
                  "No handoff loss; the person who saw the first signal follows the thread",
                  "Analysts develop faster because they see whole incidents rather than fragments",
                  "Higher retention among strong people, who leave tiered SOCs precisely to escape tier one work",
                  "Requires uniformly senior staff, which is expensive and hard to hire",
                  "Throughput on repetitive volume is worse, so it only works if you have already fixed alert volume",
                  "Harder to outsource, harder to scale quickly, harder to cover 24 hours in a small team"
                ]
              }
            },
            {
              kind: "callout",
              title: "The prerequisite nobody states",
              body: "Tierless is not a management philosophy you can adopt; it is a consequence of having solved alert volume. A tierless SOC receiving three hundred alerts a shift is simply a tiered SOC where everyone is doing tier one work and calling it something else. Fix the generator first, using the tuning debt and auto-demotion work from Page I, and the operating model question largely answers itself. Attempted in the other order, tierless becomes a way to burn out your most expensive people on your least valuable work."
            },
            {
              kind: "table",
              title: "The handoff artefact — what must transfer, and what happens when it does not",
              headers: ["Element", "Why it must transfer", "The failure when it does not"],
              rows: [
                ["The hypothesis under test", "The receiving analyst needs to know what the sender believed, not just what they did", "The investigation restarts from zero, or worse, silently adopts a wrong assumption nobody wrote down"],
                ["What has been ruled out, and how", "Prevents re-doing hours of work", "The same three queries are run by three people across two shifts and nobody notices"],
                ["What is pending: queries running, containment awaiting approval, people awaiting reply", "These are the items that die in a gap", "A containment request approved at 08:00 that nobody actions because the requester went home at 06:00"],
                ["The clock: notification deadlines, legal holds, evidence expiry", "Regulatory clocks do not pause for shift changes", "A 72-hour notification window consumed by three handoffs, discovered on hour 60"],
                ["Confidence level and what would change it", "Distinguishes we believe this is contained from we have not found more yet", "An incident declared resolved because the second shift read absence of new findings as evidence of containment"],
                ["Who has been told what", "Communications consistency is a legal exposure and a trust asset", "Two different statements to the same executive within six hours"]
              ]
            },
            {
              kind: "numbered",
              title: "Handoff discipline that works across shifts, timezones and vendor boundaries",
              items: [
                "The handoff is written, always, even when the shifts overlap in the same room. Verbal handoffs feel faster and reliably lose the pending items.",
                "The handoff is structured, using the six elements above as fixed headings. Free text drifts toward narrative and omits the clock.",
                "The outgoing analyst stays for a fixed overlap window — fifteen minutes is usually enough — during which the incoming analyst reads and asks questions. Budget it as work time, not as goodwill.",
                "The incoming analyst restates the hypothesis in their own words. This single practice catches more misunderstandings than any template.",
                "Anything with a clock is escalated at handoff, not carried. Deadlines must not cross a boundary silently.",
                "For managed service provider boundaries, the artefact is contractual, not cultural: define the required fields in the agreement, because a vendor will otherwise transfer a ticket id and a severity."
              ]
            },
            {
              kind: "principle",
              body: "Design the handoff before you design the tiers. The tier boundary is only as good as the artefact that crosses it, and most SOCs have specified the first and never the second."
            }
          ],
          glossary: ["tierless-soc", "handoff-artefact", "escalation-loss", "shift-overlap"],
          awards: ["award-clean-handoff"]
        },
        {
          id: "ch-detection-metrics-gaming",
          kind: "lesson",
          title: "MTTD, MTTR, and the Metric That Eats Your Program",
          statement: "Every operational metric you publish becomes a target, and the cheapest way to move almost all of them is to do less real work.",
          minutes: 30,
          respect: 175,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "Mean time to detect and mean time to respond are the two numbers every executive asks for and the two most easily corrupted numbers in security operations. The corruption is rarely dishonest. It emerges from ordinary people responding rationally to what is measured, which is why exhortations to integrity do not fix it and instrumentation does. If you publish a metric without publishing its counter-metric, you have not built a dashboard, you have built an incentive."
            },
            {
              kind: "table",
              title: "How each metric gets gamed, and the counter-metric that makes gaming visible",
              headers: ["Metric", "The rational gaming behaviour", "Counter-metric to publish alongside it"],
              rows: [
                ["Mean time to detect", "Start the clock at alert generation rather than at adversary action, so MTTD measures your ticketing latency and not your detection", "Dwell time measured from earliest confirmed adversary activity in the post-incident timeline, reported separately and never averaged with MTTD"],
                ["Mean time to respond", "Close alerts faster and shallower; auto-close low-severity classes; reclassify hard alerts as requests", "Disposition depth and reopen rate. A falling MTTR with a rising reopen rate is a shallowing team, not a faster one"],
                ["Alert volume handled", "Keep noisy rules because they generate impressive throughput numbers", "Escalations per thousand alerts, and alerts per rule. Volume without escalation is activity, not work"],
                ["Percentage of alerts triaged within SLA", "Touch everything quickly and disposition nothing; time-to-first-touch becomes the whole job", "Gap between time-to-first-touch and time-to-disposition"],
                ["Detection coverage percentage", "Write untested rules and tag them with techniques", "Distribution across the coverage confidence scale, and count of rules validated in the last quarter"],
                ["False positive rate", "Suppress aggressively and stop investigating ambiguous alerts", "True positives discovered by hunting or externally that an existing rule should have caught but did not"]
              ]
            },
            {
              kind: "principle",
              title: "The pairing law",
              body: "Never publish a speed metric without a quality metric, and never publish a volume metric without an outcome metric. Any single number, published alone and repeatedly, will be optimised at the expense of everything it does not measure."
            },
            {
              kind: "prose",
              title: "The metrics actually worth reporting",
              body: "Three families survive contact with incentives reasonably well. Outcome metrics: incidents detected internally as a fraction of all incidents, which is the number M-Trends tracks industry-wide and which put internal detection at 52 percent in the most recent report. Capability metrics: techniques validated at production confidence in the last quarter, telemetry sources with verified freshness, detections with a living owner. And load metrics: pages per on-call shift, utilisation, analyst tenure. Note what these have in common — each is hard to move without doing the actual work, and each is understandable by someone outside the function. That second property is what makes them defensible in a room where you are not the expert on incentives."
            },
            {
              kind: "checklist",
              title: "Before any metric goes on a wall",
              items: [
                "Write down, explicitly, the cheapest way to move this number without improving anything. If you cannot think of one, you have not thought hard enough",
                "Identify the counter-metric that would expose that behaviour, and publish it at the same size and in the same place",
                "Confirm the definition is written and versioned, including exactly when each clock starts and stops",
                "Confirm the people measured by it were shown it before it was published, and could challenge the definition",
                "Decide the review cadence and who is allowed to change the definition, because an undefended definition drifts toward whatever is easiest to report",
                "Check whether the metric would have moved during your last real incident. A metric that is flat through a genuine crisis is measuring the wrong thing"
              ]
            },
            {
              kind: "callout",
              title: "The number that matters most is the one nobody asks for",
              body: "Median tenure of your security analysts. It is a lagging indicator of every other thing in this Page — alert volume, handoff quality, on-call design, whether the work is meaningful — and it is the one number that, when it falls, tells you the whole system is failing before any operational dashboard notices. Reporting on the intake of new analysts is easy and tells you almost nothing. Report on how long the good ones stay, and treat a decline as an incident with a root cause analysis, because that is exactly what it is."
            }
          ],
          glossary: ["mttd", "mttr", "counter-metric", "reopen-rate", "analyst-tenure"],
          awards: ["award-metric-honesty"]
        },
        {
          id: "ch-detection-cloud-lab",
          kind: "lab",
          title: "Lab: Cloud Detection Where the Control Plane Is the Crime Scene",
          statement: "In cloud, the attacker rarely runs code on a host you monitor; they make API calls as an identity, and if you are not detecting on the control plane you are not detecting.",
          minutes: 40,
          respect: 210,
          trust: 14,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "On-premises detection instincts transfer badly to cloud because the unit of adversary action changes. There is often no malware, no process, no endpoint agent, and no lateral movement in the traditional sense. There is an identity making API calls. The control plane — CloudTrail in AWS, the audit logs in the other major providers — is therefore both the primary telemetry and the primary target, and the first thing a competent operator does is try to blind it. AWS documents that trails do not log data events by default and that data events are billed separately, which means the default configuration answers who touched the bucket and is silent on what they took. That single default has shaped more cloud incident reports than any vulnerability."
            },
            {
              kind: "table",
              title: "Control plane versus data plane, and what each can and cannot tell you",
              headers: ["Dimension", "Control plane (management events)", "Data plane (data events)"],
              rows: [
                ["Example operations", "CreateAccessKey, AssumeRole, PutBucketPolicy, StopLogging, ModifyInstanceAttribute", "S3 GetObject and PutObject, Lambda Invoke, DynamoDB item operations"],
                ["Default state", "Recorded by default", "Off by default, on trails and event data stores alike"],
                ["Volume and cost", "Modest; the highest value per gigabyte of any telemetry you own", "Very high; billed separately and capable of dwarfing every other source"],
                ["Question it answers", "Who has access, how did they get it, what did they change", "What data was actually read or written"],
                ["Typical detection", "Anomalous privilege change, key creation, logging disabled, role assumed from an unexpected principal", "Mass object enumeration and retrieval, access to a specific sensitive prefix, canary object read"],
                ["The trap", "Assuming it covers data access; GuardDuty's exfiltration finding for IAM entities is explicitly built on management operations only", "Enabling it estate-wide and discovering the bill; enable selectively on the buckets that matter"]
              ]
            },
            {
              kind: "code",
              title: "Verify what you are actually recording before you write a single detection",
              lang: "bash",
              body: "# 1. Is there an organisation trail, is it multi-region, and is it running?\naws cloudtrail describe-trails --include-shadow-trails \\\n  --query 'trailList[].[Name,IsMultiRegionTrail,IsOrganizationTrail,HomeRegion]' --output table\n\naws cloudtrail get-trail-status --name org-trail \\\n  --query '[IsLogging,LatestDeliveryTime,LatestDeliveryError]'\n\n# 2. Which data events, if any, are being captured? Empty output is the common answer.\naws cloudtrail get-event-selectors --trail-name org-trail\n\n# 3. Is log file validation on? Without it you cannot prove the trail was not tampered with.\naws cloudtrail describe-trails --trail-name-list org-trail \\\n  --query 'trailList[].LogFileValidationEnabled'\n\n# 4. Is GuardDuty enabled everywhere, and are the optional protections on?\nfor r in $(aws ec2 describe-regions --query 'Regions[].RegionName' --output text); do\n  echo -n \"$r: \"\n  aws guardduty list-detectors --region $r --query 'DetectorIds' --output text\ndone\n\n# 5. Which suppression filters exist? These are where coverage quietly disappears.\naws guardduty list-filters --detector-id $DETECTOR --query 'FilterNames'"
            },
            {
              kind: "code",
              title: "Identity-centric detections over the control plane",
              lang: "sql",
              body: "-- A. Someone is turning off the lights. These are the highest-priority events in the account.\nSELECT eventtime, useridentity.arn, eventname, sourceipaddress, useragent, errorcode\nFROM cloudtrail_logs\nWHERE eventtime > date_add('day', -7, now())\n  AND eventname IN (\n      'StopLogging', 'DeleteTrail', 'UpdateTrail', 'PutEventSelectors',\n      'DeleteFlowLogs', 'DeleteDetector', 'CreateFilter',\n      'DisableAlarmActions', 'DeleteLogGroup', 'PutRetentionPolicy'\n  )\nORDER BY eventtime DESC;\n\n-- B. First time this principal has ever called this API. Cheap, high yield, no ML required.\nWITH history AS (\n    SELECT useridentity.arn AS arn, eventname, MIN(eventtime) AS first_seen\n    FROM cloudtrail_logs\n    WHERE eventtime > date_add('day', -180, now())\n    GROUP BY 1, 2\n)\nSELECT arn, eventname, first_seen\nFROM history\nWHERE first_seen > date_add('day', -1, now())\n  AND eventname LIKE 'Create%'\n   OR eventname LIKE 'Attach%'\n   OR eventname LIKE 'Put%Policy';\n\n-- C. Role assumed from an address range that principal has never used, with session context.\nSELECT\n    useridentity.sessioncontext.sessionissuer.arn AS role_arn,\n    requestparameters,\n    sourceipaddress,\n    COUNT(*) AS n\nFROM cloudtrail_logs\nWHERE eventname = 'AssumeRole'\n  AND eventtime > date_add('day', -2, now())\nGROUP BY 1, 2, 3\nORDER BY n ASC\nLIMIT 200;"
            },
            {
              kind: "list",
              title: "Cloud-specific traps that cost people real incidents",
              items: [
                "GuardDuty learns. The documentation states that when it observes continued activity from a remote host or account, the model treats it as expected and stops generating that finding. An adversary who establishes a steady pattern becomes invisible to the anomaly findings over time. Do not treat a managed detection service as a permanent control; complement it with your own explicit logic.",
                "Suppression filters are unversioned coverage loss. A filter added during a noisy week silently removes a finding class forever, with no diff and no review. Export the filter list into version control and diff it on a schedule, exactly as you would a firewall rule set.",
                "Findings are not alerts. GuardDuty produces findings; whether they reach a human depends on EventBridge rules you wrote and never tested. Validate the whole path with a sample finding generator, not by assuming the integration works.",
                "Delivery latency is real and variable. Control-plane events are not instantaneous, and your detection latency budget must account for delivery, aggregation and rule evaluation. Measure it with a synthetic action rather than assuming a number from a marketing page.",
                "Identity is federated and the principal in the log is often a role, not a person. Without session name conventions enforced at the identity provider and a resolution table, your alert names an assumed role that forty people share.",
                "The organisation boundary is the real perimeter. A trail configured per-account leaves every new account created by a developer entirely unmonitored until someone notices. Enforce at the organisation level, and detect the creation of accounts outside it."
              ]
            },
            {
              kind: "principle",
              body: "In cloud, detect on identity and on the control plane first, enable data events selectively on the resources that would actually appear in a breach notification, and treat any action that reduces your own visibility as the highest-severity event class in the environment."
            }
          ],
          praxis: "In a cloud account you control, verify trail configuration and coverage with the audit commands, deliberately create the blind spot by disabling a data event selector, then build and validate three detections: logging tampering, first-time privileged API use by a principal, and role assumption from an unusual source. Trigger each one for real and measure end-to-end latency from action to alert.",
          evidence: "The audit command output before and after, the three detections in the repository with ADS documents, and a latency table showing measured action-to-alert time for each, including the stage where most of the delay occurred.",
          glossary: ["control-plane-telemetry", "data-plane-telemetry", "cloudtrail-data-events", "guardduty-finding", "suppression-filter", "identity-centric-detection", "log-source-fidelity"],
          awards: ["award-cloud-eyes", "award-atomic-validator"]
        },
        {
          id: "ch-detection-drill-burnout",
          kind: "drill",
          title: "Drill: The Analyst Who Is Done",
          statement: "Analyst burnout is not a wellbeing problem adjacent to security; it is the failure mode of your detection architecture presenting as a human being.",
          minutes: 24,
          respect: 170,
          trust: 10,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              body: "Vendor surveys have repeatedly found that a majority of SOC analysts report burnout, and the academic literature now treats alert fatigue in security operations as a systems and human-factors research problem rather than a matter of individual resilience. You will meet this personally, and the meeting usually looks like this: your strongest senior analyst, the one who finds the things nobody else finds, tells you quietly that she cannot keep doing this. What you do in the next hour determines whether you lose her, and what you do in the next month determines whether you lose the next one too."
            },
            {
              kind: "list",
              title: "The situation",
              items: [
                "Your senior analyst has been paged 14 times across the last 5 nights; 11 of those pages came from three rules",
                "She has been with you four years, holds most of the undocumented environmental knowledge, and mentors two juniors",
                "Two other analysts resigned in the last seven months and both cited on-call in their exit interviews",
                "Your board has asked for an MTTR improvement target for next quarter and your CIO has already committed to it",
                "Hiring approval for one additional analyst exists; realistic time to a productive hire is four to six months",
                "The three rules generating most of the pages are all mapped to techniques on your coverage layer and all were written by the security director"
              ]
            },
            {
              kind: "principle",
              body: "Whoever wrote the rule does not pay for it. The engineer's cost is measured in hours and the analyst's cost is measured in nights, which is why paging authority must sit with the people who take the pages."
            }
          ],
          drill: {
            id: "ch-detection-drill-burnout-scene",
            scene: "Friday, 17:40. Your best senior analyst has just told you she is done — not threatening to leave, simply stating a fact about what she can sustain. Eleven of her fourteen pages this week came from three rules. The board wants an MTTR target next quarter and your CIO has already agreed to it.",
            clock: "You have this conversation now; the structural decision is due Monday",
            pressure: "Losing her costs more institutional knowledge than the last two departures combined. The hiring pipeline is six months. The MTTR commitment is already public.",
            prompt: "Choose the intervention you will commit to on Monday.",
            options: [
              {
                id: "opt-time-off-contractor",
                label: "Give her two weeks off immediately and bring in a contractor to cover the rotation while you recruit.",
                detail: "Immediate relief for the person in front of you, no structural risk, buys time for hiring.",
                score: -1,
                outcome: "She takes the leave and returns to an identical queue. The contractor covers shifts competently and escalates everything, because they lack the environmental knowledge to disposition anything. She resigns in nine weeks.",
                ripple: "Humane, immediate, and it treats the symptom in a way that guarantees recurrence. Worse, it teaches the team that the response to unsustainable load is individual accommodation, which means the next person suffers silently for longer before speaking, because speaking up now carries the implication of personal weakness rather than of system failure. Time off is a legitimate component of the answer and a catastrophic totality of it."
              },
              {
                id: "opt-mssp-tier-one",
                label: "Contract an MSSP to absorb tier one triage so your internal team only sees escalations.",
                detail: "Structural, fast to procure, directly reduces the volume your people see, and the MTTR number will improve.",
                score: 0,
                outcome: "Volume to the internal team drops by roughly sixty percent within two months. MTTR improves and the board is satisfied. Two quarters later, an intrusion is missed because the pattern was only visible across three alerts the provider triaged independently and closed on separate shifts.",
                ripple: "You moved the queue rather than shrinking it, and you bought a new handoff boundary at the point of highest context loss. Managed providers are genuinely useful, but they solve capacity, not arrival rate, and the boundary they create needs the contractual handoff artefact from earlier in this Page. Choosing this without first cutting the generator means you are now paying somebody else to be exhausted by rules you still own, and you have lost the signal that told you they were bad."
              },
              {
                id: "opt-automate-closure",
                label: "Deploy automated triage that auto-closes the low-confidence alert classes driving the volume, and use the MTTR gain to satisfy the board commitment.",
                detail: "Fastest path to both outcomes. The automation is defensible: it closes only alerts matching patterns historically dispositioned benign.",
                score: -2,
                outcome: "Pages drop immediately and MTTR improves dramatically. The board is delighted. Eleven months later a genuine intrusion is auto-closed because its early signals matched the historically benign pattern the model was trained on.",
                ripple: "This is the most dangerous option because it succeeds on every metric while removing the capability. Automating closure of a noisy rule is not tuning, it is concealment: the rule still fires, the noise still exists, and you have inserted a machine to hide it. Automation belongs on enrichment and containment, where it saves analyst time by doing work; it does not belong on disposition, where it saves analyst time by skipping judgement. The tell is that nobody had to delete anything."
              },
              {
                id: "opt-bankruptcy-sprint",
                label: "Declare alert bankruptcy: freeze new paging rules, demote the three offenders to enrichment on Monday morning, give the SOC lead veto authority over what pages, and redesign the rotation.",
                detail: "Three rules demoted immediately with their authors assigned to fix or retire them within thirty days. Paging budget set as a hard number per shift. On-call redesigned with a follow-the-sun split, written handoff artefact, and compensated recovery time. Board pre-briefed that MTTR will worsen before it improves, with the reason in writing.",
                score: 3,
                isBest: true,
                outcome: "Pages per shift fall by roughly two thirds inside a week. Two of the three rules are rewritten as correlations and return to paging within the month; one is deleted outright. MTTR worsens for six weeks exactly as pre-briefed, then improves past the original baseline. She stays.",
                ripple: "The durable change is the veto. Moving paging authority to the people who take the pages permanently realigns the incentive that created the problem, and it converts every future noisy rule from a negotiation into a rule. The pre-brief is the other half: by predicting the metric regression in writing before it happened, you converted what would have looked like a performance collapse into evidence that you understand your own system. That is the specific move that earns you the latitude to do this again."
              }
            ],
            debrief: "The reflex is to treat this as a people problem and the discipline is to treat it as an architecture problem with a person as the presenting symptom. Three ideas transfer. First, paging authority belongs with the people who are paged. Detection engineers should be free to ship anything into the enrichment tier and should require SOC consent to page, because the person who writes the rule never pays its recurring cost and no amount of good intent fixes an asymmetry that structural. Second, when you fix alert volume, your speed metrics will get worse before they get better, because you removed the trivially-closable items that were dragging the mean down. Pre-brief this in writing, with the predicted direction of each metric and the expected recovery period. Do it before you start, because after the regression it reads as an excuse. Third, be precise about where automation belongs. Automating enrichment gives the analyst a better first screen. Automating containment gives them speed under pressure. Automating disposition removes the judgement that is the entire reason the role exists — and it does so invisibly, which is why it passes review. On the human dimension, note that the two prior resignations both cited on-call and nothing changed. That is the actual finding: your organisation already had the data and treated it as individual departures rather than as a signal. Exit interviews are telemetry. Read them the way you would read a log.",
            principle: "Give the pager's owner the veto over what pages. Fix the generator, pre-brief the metric regression, and automate enrichment and containment but never disposition."
          },
          glossary: ["alert-bankruptcy", "paging-veto", "on-call-design", "soar-boundaries", "metric-regression-brief"],
          awards: ["award-quiet-pager", "award-keeper-of-people"]
        },
        {
          id: "ch-detection-council-board",
          kind: "council",
          title: "Council: Telling the Board What You Cannot See",
          statement: "Boards do not need your coverage percentage; they need to know which questions you could answer tomorrow morning and which you could not, and to decide whether that is acceptable.",
          minutes: 32,
          respect: 195,
          trust: 13,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              body: "The detection conversation with a board goes wrong in a specific and repeatable way. The security leader presents capability — tools deployed, rules written, coverage achieved — and the board hears reassurance, which is not something it can govern. Governance requires a decision, and a decision requires a choice with consequences attached. Reframe the whole discussion around answerability: here are the questions this organisation will be asked during an incident, by regulators, by customers, by this board; here is which of them we could answer within 24 hours today; here is what closing each remaining gap costs. Now there is something to decide."
            },
            {
              kind: "compare",
              title: "Two ways to present the same detection program",
              left: {
                title: "What produces nodding and no decision",
                items: [
                  "We have achieved 74 percent MITRE ATT&CK coverage",
                  "We have deployed a next-generation SIEM and XDR",
                  "Our mean time to detect improved by 31 percent",
                  "We are aligned with the NIST Cybersecurity Framework",
                  "We monitor 24 by 7 with a follow-the-sun model",
                  "Our SOC processed 41,000 alerts last quarter"
                ]
              },
              right: {
                title: "What produces a decision",
                items: [
                  "If a customer database were accessed tomorrow, we could tell you which records within about 12 hours. For our two acquired subsidiaries we could not tell you at all, at any timeframe.",
                  "We would detect an attacker using stolen employee credentials in cloud in under an hour. We would likely not detect the same attacker operating inside the acquired environment for weeks.",
                  "Our regulatory notification clock is 72 hours. In our last exercise, scoping alone consumed 41 of them.",
                  "Independent testing validated 38 techniques end to end last quarter. Nine of them failed and are being fixed; here are the three still open and why.",
                  "The two things that would most change these numbers cost 400 thousand and 90 thousand respectively. Here is what each buys in answerability.",
                  "The risk I am asking you to accept, if you fund neither, is stated in one paragraph and I would like it minuted."
                ]
              }
            },
            {
              kind: "numbered",
              title: "The structure of the briefing",
              items: [
                "One page. Boards read one page and skim ten. The appendix can be as long as you like and will be read by exactly one director, who will be the one who asks the good question.",
                "Lead with the questions, not the capability. What could we answer, how fast, and where are we blind. This is the only framing in which a non-specialist can exercise judgement.",
                "Show independently validated evidence, not self-assessment. Techniques validated by exercise, with the failures included. A report with no failures in it is read, correctly, as a report that was not testing anything.",
                "Use industry data sparingly and only to calibrate. One figure, such as the M-Trends median dwell time and the fact that roughly half of intrusions are still discovered by someone other than the victim, is enough to establish that your numbers are not anomalous. Three figures becomes a lecture.",
                "Name the trend, not just the level. A board can act on getting worse in a specific area far more readily than on an absolute number it has no basis to judge.",
                "Present funding as options with consequences, always including a do-nothing option stated neutrally and without theatre. If the cheapest option is presented as unthinkable, you have removed the board's role.",
                "Close by asking for a decision and for it to be recorded. Unminuted acceptance is not acceptance; it is a story two people will remember differently after an incident."
              ]
            },
            {
              kind: "table",
              title: "Translating engineering truth into governance language without losing the truth",
              headers: ["What is true technically", "What loses the room", "What lands"],
              rows: [
                ["Coverage is a distribution across confidence levels", "Explaining the confidence scale", "We have proven 38 detections work under test. We believe another 120 work and have not proven it. I will not report the second number as capability."],
                ["Telemetry retention is shorter than realistic dwell time", "Discussing gigabytes and hot tiers", "If an intrusion began more than 90 days ago, we cannot reconstruct it. Industry data puts espionage dwell time well beyond that."],
                ["Alert volume is unsustainable", "Presenting alert counts", "We are staffed to investigate a fraction of what we generate. I am reducing what we generate rather than asking for headcount."],
                ["Cloud data events are not enabled", "Explaining CloudTrail selectors", "For most of our storage, we can prove someone had access and cannot prove what they took. That is the exact question a regulator asks first."],
                ["Detection decays without validation", "Describing CI pipelines", "Detections stop working silently, so we retest them on a schedule and report the ones that failed. Last quarter, nine had failed."]
              ]
            },
            {
              kind: "quote",
              body: "Report the blind spot before someone else discovers it for you; the same fact costs a hundred times more when it arrives as a surprise.",
              source: "StepSAFE Praxis — Council doctrine, Chapter III"
            },
            {
              kind: "callout",
              title: "The credibility asset you are actually building",
              body: "Every one of these briefings is a deposit or a withdrawal on a single account: whether this board believes you when you tell them something is bad. The way to build that balance is to report a failure before you are asked, with the fix and the date, in a quarter where nothing was on fire. Directors have almost no way to evaluate your technical judgement and a very well-developed instinct for who tells them the truth early. When the real incident arrives — and it will arrive during your tenure — that balance is the only thing that buys you the authority to act at speed without spending three days establishing that you should be believed."
            },
            {
              kind: "principle",
              body: "Translate detection into answerability, present options with consequences including doing nothing, insist the decision is recorded, and report your own failures before anyone asks."
            }
          ],
          glossary: ["answerability-briefing", "risk-acceptance", "board-narrative", "validated-coverage"],
          awards: ["award-board-clarity", "award-lantern-lit"]
        }
      ]
    }
  ]
};
