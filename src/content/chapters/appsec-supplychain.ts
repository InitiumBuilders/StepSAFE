import type { Chapter } from "../schema";

export const chapter: Chapter = {
  id: "ch-appsec",
  act: "ACT II — SIGHT",
  order: 4,
  title: "THE FORGE",
  subtitle: "Application security, the secure SDLC, and the software supply chain",
  essence: "azure",
  thesis: "Software is not attacked where it is weakest. It is attacked where the weakness is cheapest to reach — and for the last five years the cheapest path has run through the build, not the binary.",
  statement: "You do not secure code by finding bugs. You secure code by changing the conditions that manufacture them.",
  why: "Most application security programs are archaeology. They dig through finished software looking for defects that were designed in months earlier, then negotiate with the people who shipped them. That model loses on arithmetic alone: a scanner can generate findings faster than any organisation can fix them, and a queue that grows faster than it drains is not a backlog, it is a decoration. The teams that actually reduce risk do three things differently. They attack the class, not the instance — deleting whole vulnerability families by changing language, framework, or default rather than filing one ticket at a time. They make the secure path the fast path, so engineers adopt it out of self-interest rather than compliance. And they treat the build system as production, because since SolarWinds every serious adversary has understood that one compromised pipeline is worth ten thousand compromised laptops. This chapter teaches all three, in the order a real programme has to build them.",
  outcomes: [
    "Explain where each major vulnerability class comes from at the level of language, framework, and design decision — not just how to detect it",
    "Argue the memory-safety position with the actual Android and Chromium data, including why a rewrite is the wrong ask",
    "Design a paved road that engineers choose voluntarily, and know precisely when a guardrail must become a gate",
    "Run threat modelling inside design review in under an hour without producing a document nobody reads",
    "Compare SAST, DAST, IAST and SCA honestly, and model the economics of a false-positive rate",
    "Write a coverage-guided fuzz harness and a property-based test that find real defects in parser and protocol code",
    "Reconstruct the xz-utils, Codecov, SolarWinds, polyfill.io and tj-actions compromises well enough to teach them",
    "Take a CI/CD pipeline from unsigned and over-privileged to SLSA Build L3 with verified provenance",
    "State clearly what an SBOM solves, what it does not, and what you must build alongside it",
    "Build a prioritisation model on KEV, EPSS and reachability that survives audit and defends a deliberate no",
    "Communicate exposure to a board without either false comfort or theatre"
  ],
  prereq: ["ch-identity"],
  unitUnlock: "u-forge",
  sources: [
    {
      label: "OWASP Top 10:2025 — full category list and A03 Software Supply Chain Failures",
      note: "Read the methodology page before the list. The 2025 edition is eight data-driven categories plus two community-voted ones, and A03 was voted first by roughly half the community while appearing in a very small slice of the contributed CVE data. That gap between fear and measurement is the most instructive thing in the document."
    },
    {
      label: "Google Security Blog — Eliminating Memory Safety Vulnerabilities at the Source (September 2024)",
      note: "The single best argument for safe-by-default language strategy. Android memory-safety bugs fell from 76 percent of vulnerabilities in 2019 to 24 percent in 2024 with almost no rewriting, because vulnerability density decays exponentially with code age. Use it whenever someone tells you the only options are rewrite or resign."
    },
    {
      label: "The Chromium Projects — Memory Safety",
      note: "The base rate: around 70 percent of high-severity Chromium security bugs are memory-unsafety problems, from a study of 912 high or critical Stable-channel bugs since 2015, roughly half of them use-after-free. Also honest about the limits of sandboxing and site isolation, which matters when your answer to a bug class is containment."
    },
    {
      label: "SLSA v1.1 specification — Build Track levels L0 to L3",
      note: "Short, precise, and explicit about scope. L1 provenance is trivially forgeable, L2 buys you signatures, L3 buys you isolation and signing keys that user-defined build steps cannot reach. Read the scope statements as carefully as the requirements: SLSA does not claim to tell you the source was good."
    },
    {
      label: "Sigstore documentation — cosign, Fulcio, Rekor",
      note: "Keyless signing with ephemeral keys bound to an OIDC identity and logged in an append-only transparency log. The right mental model is that Sigstore answers who signed this and when, not is this software safe. Excellent for eliminating long-lived signing keys from CI."
    },
    {
      label: "CISA Alert — Supply Chain Compromise of tj-actions/changed-files (CVE-2025-30066) and reviewdog/action-setup (CVE-2025-30154), March 2025",
      note: "The canonical mutable-tag incident. Version tags v1 through v45.0.7 were all repointed at one malicious commit that dumped runner memory into public build logs. Read it as a story about tags being pointers, not versions."
    },
    {
      label: "Filippo Valsorda — A Retrospective Survey of 2024/2025 Open Source Supply Chain Compromises",
      note: "A working taxonomy of about twenty real compromises grouped by root cause: phishing, unsafe GitHub Actions triggers, credential theft, and control handoff. The most useful part is the conclusion, which reduces maintainer duty to a very short list including phishing-resistant authentication and never using pull_request_target."
    },
    {
      label: "CrowdStrike — SUNSPOT: An Implant in the Build Process (SolarWinds)",
      note: "The implant watched for MsBuild processes, swapped a single source file for a backdoored copy while the compiler was running, and restored the original afterwards, with hash checks so builds would not fail and alert developers. This is the reference text for why your build machines are production."
    },
    {
      label: "Codecov Security Update — Bash Uploader compromise (2021)",
      note: "A credential leaked through a Docker image layer let an attacker edit a script that thousands of CI pipelines curled and piped to bash. Undetected for roughly two months, and found by a customer verifying a checksum. Every clause of that sentence is a lesson."
    },
    {
      label: "FIRST — Exploit Prediction Scoring System (EPSS)",
      note: "EPSS estimates the probability that a CVE will be exploited in the wild in the next thirty days, refreshed daily. Read the model and using-EPSS pages together so you understand it is a population-level probability, not a statement about your environment."
    },
    {
      label: "CISA Known Exploited Vulnerabilities catalog and Binding Operational Directive 22-01",
      note: "Inclusion requires a CVE ID, reliable evidence of active exploitation, and a clear remediation action. Treat KEV as ground truth about the past rather than prediction, and treat the federal due dates as a floor other regulators will eventually copy."
    },
    {
      label: "Google OSS-Fuzz",
      note: "Continuous fuzzing at scale across roughly a thousand open-source projects, credited with finding well over ten thousand vulnerabilities and tens of thousands of bugs. The build integration documentation is the fastest path from zero to a running harness."
    },
    {
      label: "GitHub Security Lab — Bugs that survive the heat of continuous fuzzing",
      note: "The necessary counterweight to OSS-Fuzz enthusiasm. Shows projects fuzzed for years at under twenty percent coverage, uninstrumented dependencies as blind spots, and encoders getting far less attention than decoders. Read it before you tell a board that a project is fuzzed."
    },
    {
      label: "AWS EC2 documentation — instance metadata options and IMDSv2",
      note: "The concrete mechanics of the most common cloud SSRF escalation and its fix: session tokens obtained by PUT, a response hop limit, AMI and account-level defaults, and enforcement. Read the precedence table, because that is where teams believe they are enforced and are not."
    }
  ],
  pages: [
    {
      id: "ch-appsec-pg-origins",
      title: "ORIGINS OF DEFECT",
      credential: "Certified in Vulnerability Class Analysis — StepSAFE Praxis",
      summary: "Vulnerabilities are not random. Each major class is the predictable output of a specific language property, framework default, or design shortcut. This Page teaches you to reason backwards from a finding to the condition that produced it, so you can argue for deleting the class instead of patching the instance — and to tell the difference between the bug classes a tool can find and the ones only a human who understands the domain will ever see.",
      competencies: [
        "Trace a vulnerability from instance to class to originating condition",
        "Use the OWASP Top 10 correctly and state its methodological limits out loud",
        "Argue the memory-safety case from the Android and Chromium data, including the code-age argument",
        "Recognise and construct authorisation logic bugs that no scanner can label",
        "Exploit and then close a server-side request forgery path into cloud metadata",
        "Judge deserialization and race-condition findings on exploitability rather than signature"
      ],
      seal: "AZ-ORIGIN",
      steps: [
        {
          id: "ch-appsec-step-class-not-instance",
          kind: "construct",
          title: "The Class, Not The Instance",
          statement: "Every ticket you close is one instance; every condition you change is every instance, forever.",
          minutes: 18,
          respect: 70,
          trust: 2,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The arithmetic that breaks most programmes",
              body: "A mid-sized engineering organisation with two hundred services will generate more scanner findings in a quarter than a security team can meaningfully review in a year. If your unit of work is the finding, you have entered a race you lose by construction: the generator is automated and the remediator is human. The only escape is to change the unit of work. Stop asking how many findings did we close and start asking how many findings became impossible. One framework change that makes a template engine auto-escape by default retires every cross-site scripting finding in every service that uses it, including the ones nobody has written yet."
            },
            {
              kind: "principle",
              title: "The Ladder of Causes",
              body: "Instance: this endpoint leaks another tenant's invoice. Class: broken object level authorisation. Condition: the framework lets a developer fetch by primary key without ever passing the caller's identity into the query. Fix at the instance level and you have fixed one endpoint. Fix at the condition level — make the data access layer require an actor argument that cannot be defaulted — and every endpoint written after today is safe by construction."
            },
            {
              kind: "table",
              title: "Reading a finding down to its condition",
              headers: ["Instance you were handed", "Class", "Originating condition", "Class-level fix"],
              rows: [
                ["Reflected script in a search box", "Cross-site scripting", "Template engine that interpolates raw by default", "Contextual auto-escaping on, raw output requires an explicit unsafe call that trips review"],
                ["Order lookup returns other tenants' orders", "Broken object level authorisation", "ORM allows fetch-by-id with no actor in scope", "Repository API that will not compile without a caller principal"],
                ["Image resizer fetches an attacker-supplied URL", "Server-side request forgery", "Egress is unrestricted and metadata is reachable", "Fetch proxy with allowlist, IMDSv2 enforced, hop limit 1"],
                ["Heap overflow in a media parser", "Memory unsafety", "Parser written in C with manual bounds handling", "New parsers in a memory-safe language behind a stable interface"],
                ["Admin route reachable without a role check", "Broken access control", "Authorisation applied per-handler by convention", "Deny-by-default middleware with an explicit, reviewed allow list"]
              ]
            },
            {
              kind: "callout",
              title: "Where the class-level move is illegitimate",
              body: "Not every class can be deleted. Business logic flaws — pricing that can be driven negative, a refund flow that can be replayed, a workflow whose states can be reached out of order — have no framework-level condition to change because the condition is the domain itself. For those you need people who understand the business reading the design. Confusing the two is the most common failure: teams buy tools for the classes tools can find, then are breached through the classes tools never could."
            },
            {
              kind: "quote",
              body: "Attackers innovate, so defenders need to innovate just to keep pace.",
              source: "The Chromium Projects, Memory Safety"
            }
          ],
          awards: ["class-over-instance"],
          glossary: ["vulnerability-class", "originating-condition", "secure-default", "business-logic-flaw"]
        },
        {
          id: "ch-appsec-step-top-ten-limits",
          kind: "lesson",
          title: "The Top Ten Is A Census, Not A Threat Model",
          statement: "The OWASP Top 10 tells you what testers found in the applications that agreed to be measured; it does not tell you what will be used against you.",
          minutes: 25,
          respect: 95,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "What the document actually is",
              body: "The OWASP Top 10 is an awareness document built from contributed application testing data plus a community survey. The 2025 edition selects eight categories from data and two from the survey, and OWASP says plainly in its own methodology that the data reflects vulnerabilities the industry already knows how to test for, and that tooling capability lags discovery by years. That is an honest disclosure of a real bias: the list over-represents what scanners detect and under-represents what only humans find. Cite it as a shared vocabulary. Never cite it as a risk assessment for your estate."
            },
            {
              kind: "table",
              title: "OWASP Top 10:2025 as published",
              headers: ["Rank", "Category", "What it is really measuring"],
              rows: [
                ["A01", "Broken Access Control", "The widest CWE net on the list — around forty CWEs. Persistently first because authorisation is per-application logic and no generic tool owns it"],
                ["A02", "Security Misconfiguration", "Deployment and platform defaults, now a top-two problem as infrastructure became code"],
                ["A03", "Software Supply Chain Failures", "New in 2025. Voted first by roughly half the community survey, yet backed by a handful of CWEs and a very small CVE footprint in the contributed data"],
                ["A04", "Cryptographic Failures", "Mostly transport and storage defaults rather than broken primitives"],
                ["A05", "Injection", "Still high CVE volume, but increasingly a legacy-code and non-web-framework story"],
                ["A06", "Insecure Design", "The category that admits the rest of the list is downstream of decisions"],
                ["A07", "Authentication Failures", "Session, credential and recovery flows"],
                ["A08", "Software or Data Integrity Failures", "Update channels, deserialization, unverified artefacts"],
                ["A09", "Security Logging and Alerting Failures", "Renamed to include alerting — you are not credited for logs nobody reads"],
                ["A10", "Mishandling of Exceptional Conditions", "Error paths, fail-open behaviour, and what your code does when a dependency times out"]
              ]
            },
            {
              kind: "callout",
              title: "The A03 lesson is a lesson about lists",
              body: "Software Supply Chain Failures entered at number three on the strength of community fear while carrying one of the smallest data footprints on the list. Is the community wrong? No — SolarWinds, Codecov, xz-utils and the npm worms are real and the impact is enormous. The data is thin because application penetration tests do not detect build compromises. That is the whole lesson: absence of evidence in a testing corpus is not evidence of absence in the world, and any ranking that mixes measured incidence with perceived importance must be read as two documents stapled together."
            },
            {
              kind: "compare",
              title: "Using it well versus using it badly",
              left: {
                title: "Legitimate uses",
                items: [
                  "A shared vocabulary so engineers, testers and auditors mean the same thing",
                  "A training curriculum backbone for developers new to security",
                  "A coverage checklist when designing a testing programme — have we any capability at all in each category",
                  "A conversation opener with a regulator or customer who already knows the names"
                ]
              },
              right: {
                title: "Abuses that will cost you",
                items: [
                  "Treating rank order as risk order for your specific application",
                  "Declaring a product secure because it has no Top 10 findings",
                  "Writing contracts or acceptance gates that say free of OWASP Top 10 issues, which is unfalsifiable and therefore unenforceable",
                  "Ignoring domain-specific classes — tenancy, entitlements, pricing, settlement — because they do not appear on a general list"
                ]
              }
            },
            {
              kind: "principle",
              title: "The substitution rule",
              body: "Whenever someone offers you a general list as a substitute for thinking about your own system, accept the list as vocabulary and reject it as conclusion. Your threat model is the list of things an adversary would want from you, ranked by what they would gain. Nobody else can write it."
            }
          ],
          awards: ["reads-the-methodology"],
          glossary: ["owasp-top-ten", "incidence-rate", "cwe", "awareness-document"]
        },
        {
          id: "ch-appsec-step-memory-safety",
          kind: "lesson",
          title: "Memory Safety: The Only Class We Know How To Delete",
          statement: "Memory unsafety is the one major vulnerability class with a proven industrial cure, and the cure is not a rewrite.",
          minutes: 32,
          respect: 145,
          trust: 5,
          mode: "both",
          blocks: [
            {
              kind: "metric",
              title: "The base rate, from two of the largest measured codebases on earth",
              body: "These are the numbers to carry in your head. They are not vendor marketing; they come from the engineering teams that own the code.",
              items: [
                "Chromium: around 70 percent of high-severity security bugs are memory-unsafety problems, from a study of 912 high or critical Stable-channel bugs since 2015",
                "Roughly half of those Chromium memory bugs are use-after-free specifically — a lifetime problem, not a bounds problem",
                "Android: memory-safety issues were 76 percent of vulnerabilities in 2019 and 24 percent in 2024",
                "Android memory-safety vulnerability count fell from 223 in 2019 to under 50 in 2024",
                "Android reports the rollback rate of Rust changes at less than half that of C++ — a reliability argument, not only a security one"
              ]
            },
            {
              kind: "prose",
              title: "Why the rewrite argument is a trap",
              body: "The instinctive objection is that safety requires rewriting tens of millions of lines of C++, which nobody will fund. Google's answer is the most important structural insight in modern application security: you do not need to. Vulnerability density is not uniform across a codebase, it decays exponentially with code age. Old code that has been exercised, fuzzed and patched for years is dramatically less dangerous per line than code written last quarter — Android cites roughly a three to seven times lower density in five-year-old code. So if you write all new and substantially modified code in a memory-safe language and let the old code age, the memory-safety share of your vulnerabilities falls without a rewrite programme. Android's decline happened while the absolute amount of C++ in the system kept growing."
            },
            {
              kind: "principle",
              title: "Safety is a property of new code, not of total code",
              body: "The security-relevant question is never what fraction of your codebase is memory-safe. It is what fraction of the code you wrote this quarter is memory-safe. The first number changes over a decade. The second you can change at the next planning meeting, and it is the one that drives next year's CVE count."
            },
            {
              kind: "numbered",
              title: "How to actually write a memory-safe roadmap that survives contact with engineering",
              items: [
                "Draw the boundary first. Identify the components that parse untrusted input — media, archive, font, network protocol and file format parsers. This is where memory bugs become remote code execution, and it is a small fraction of any codebase.",
                "Declare a new-code rule with a date, not an aspiration. From quarter X, new parsers and new network-facing components are written in a memory-safe language unless a named executive grants a written exception.",
                "Invest in interoperability before you invest in rewriting. The blocker is almost never the language, it is the foreign function boundary. Fund the binding generators and the build integration first; teams will adopt on their own once the friction is gone.",
                "Do not neglect the unsafe blocks. A Rust component with a sprawling unsafe surface has moved the risk, not removed it. Require unsafe blocks to be small, justified in a comment, and reviewed by someone other than the author.",
                "Keep the mitigations you already have. Sandboxing, site isolation, control flow integrity, hardware memory tagging and allocator hardening all raise exploitation cost on the code you are not replacing. The Chromium team is explicit that containment has hit its limits — which is an argument for adding source-level elimination, not for removing containment.",
                "Report on it as a leading indicator. Percentage of new lines in memory-safe languages, and memory-safety share of the last twelve months of CVEs. Both trend lines belong in your quarterly board material."
              ]
            },
            {
              kind: "callout",
              title: "The intellectually honest caveats",
              body: "Memory safety deletes memory unsafety. It does nothing for authorisation flaws, logic bugs, SSRF, injection, or supply chain compromise — and as memory bugs fall, the remaining classes become a larger share of your problem, which can look like regression on a chart if you are not careful about denominators. Garbage-collected languages solve spatial and temporal memory safety but introduce their own class in deserialization. And a safe language does not save you from calling an unsafe library. Say all of this before an engineer says it to you."
            }
          ],
          awards: ["memory-safe-roadmap", "reads-the-methodology"],
          glossary: ["memory-safety", "use-after-free", "vulnerability-density", "code-age-decay", "unsafe-block"]
        },
        {
          id: "ch-appsec-step-bola-lab",
          kind: "lab",
          title: "Lab: The Authorisation Bug No Scanner Will Ever Name",
          statement: "Broken object level authorisation is invisible to tools because a correct response and a catastrophic one are byte-identical in shape.",
          minutes: 40,
          respect: 165,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Why this class survives every tool you own",
              body: "A scanner sees a request for /invoices/8814 return HTTP 200 with a well-formed invoice. It has no idea whether 8814 belongs to the caller. There is no dangerous function, no tainted sink, no anomalous pattern — the vulnerability lives entirely in the relationship between two pieces of data the tool cannot correlate. This is why broken access control has sat at or near the top of the OWASP list for years while injection has steadily fallen: injection has a syntactic signature and parameterised queries killed it at the framework level, and authorisation has neither."
            },
            {
              kind: "code",
              title: "The shape of the defect",
              lang: "python",
              body: "@app.get('/api/invoices/<int:invoice_id>')\n@require_auth\ndef get_invoice(invoice_id):\n    invoice = Invoice.query.get(invoice_id)\n    if invoice is None:\n        abort(404)\n    return jsonify(invoice.to_dict())\n\n\n@app.get('/api/invoices')\n@require_auth\ndef list_invoices():\n    rows = Invoice.query.filter_by(org_id=g.principal.org_id).all()\n    return jsonify([r.to_dict() for r in rows])"
            },
            {
              kind: "prose",
              title: "Read those two handlers again",
              body: "The list endpoint is correct. It scopes by org. The single-item endpoint is a full cross-tenant read, and it was almost certainly written by the same engineer on the same afternoon. Nothing about the code looks wrong; the authorisation is simply absent rather than incorrect. This is the signature failure mode of per-handler authorisation: correctness depends on every developer remembering, every time, forever. That is not a control, it is a hope."
            },
            {
              kind: "code",
              title: "The class-level fix: make the unscoped query impossible to express",
              lang: "python",
              body: "class Scoped:\n    def __init__(self, model, principal):\n        self._model = model\n        self._principal = principal\n\n    def by_id(self, ident):\n        return (self._model.query\n                .filter_by(id=ident, org_id=self._principal.org_id)\n                .one_or_none())\n\n    def all(self):\n        return self._model.query.filter_by(org_id=self._principal.org_id).all()\n\n\ndef scoped(model):\n    if not hasattr(g, 'principal'):\n        raise RuntimeError('no principal in request scope')\n    return Scoped(model, g.principal)\n\n\n@app.get('/api/invoices/<int:invoice_id>')\n@require_auth\ndef get_invoice(invoice_id):\n    invoice = scoped(Invoice).by_id(invoice_id)\n    if invoice is None:\n        abort(404)\n    return jsonify(invoice.to_dict())"
            },
            {
              kind: "numbered",
              title: "Do the lab",
              items: [
                "Take any application you have access to that has more than one tenant, customer, or user. Create two accounts in different tenants and capture a valid session for each.",
                "Enumerate every route that accepts an identifier in the path, query string, or body. Include identifiers that are not integers — UUIDs feel safe and are not, because they leak through emails, exports, logs and shared links.",
                "For each route, replay tenant A's request with tenant B's session. Record the status code and whether the body contains tenant A's data. You are looking for 200 where you expect 403 or 404.",
                "Do the write side, which is where teams stop too early. PATCH, DELETE, and any state transition. A cross-tenant read is a breach; a cross-tenant write is a breach plus an integrity incident plus a legal problem.",
                "Now test the second-order case: nested resources. /orgs/A/projects/9/tasks/4 where the project belongs to A but the task belongs to B. Frameworks that check only the first path segment fail here constantly.",
                "Write the guard once, centrally, so it cannot be forgotten. Then add a test that asserts every registered route is covered by the guard, and make that test fail the build when someone adds a route that is not."
              ]
            },
            {
              kind: "callout",
              title: "404 or 403",
              body: "Return 404 for objects the caller may not see. A 403 confirms the object exists, which turns your authorisation control into an enumeration oracle — useful to an attacker mapping your customer base, and occasionally a disclosure incident in its own right. The exception is when a 404 would break a legitimate support workflow; in that case log the 403 and alert on volume."
            }
          ],
          praxis: "Run the cross-tenant matrix against a service you own or a deliberately vulnerable target you control, and land the centralised scoped-access guard plus the route coverage test.",
          evidence: "The test file that asserts full route coverage of the authorisation guard, plus a redacted matrix of routes tested and results.",
          awards: ["tenancy-breaker", "class-over-instance"],
          glossary: ["bola", "idor", "multi-tenancy", "deny-by-default", "enumeration-oracle"]
        },
        {
          id: "ch-appsec-step-ssrf-metadata",
          kind: "lab",
          title: "Lab: SSRF Into The Metadata Service",
          statement: "In cloud environments server-side request forgery is not an information leak, it is a credential handoff.",
          minutes: 35,
          respect: 170,
          trust: 7,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Why this one is different",
              body: "SSRF is boring on paper: your server fetches a URL an attacker controls. It becomes catastrophic in cloud because there is a service on the local link at 169.254.169.254 that will hand out the instance's role credentials to anything on the box that asks. The application does not need a shell. It needs one HTTP GET reflected through a feature that was designed to fetch images, render web pages to PDF, validate webhook endpoints, import from a URL, or expand a link preview. The historical reference point is the 2019 Capital One breach, where a misconfigured web application firewall combined with metadata access produced tens of millions of records."
            },
            {
              kind: "code",
              title: "What the attack looks like against a v1 metadata service",
              lang: "bash",
              body: "curl -s 'http://169.254.169.254/latest/meta-data/iam/security-credentials/'\ncurl -s 'http://169.254.169.254/latest/meta-data/iam/security-credentials/app-role'\n\ncurl -s 'http://169.254.169.254/latest/user-data'"
            },
            {
              kind: "code",
              title: "What it looks like once IMDSv2 is required",
              lang: "bash",
              body: "TOKEN=$(curl -s -X PUT 'http://169.254.169.254/latest/api/token' \\\n  -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600')\n\ncurl -s -H X-aws-ec2-metadata-token:$TOKEN \\\n  'http://169.254.169.254/latest/meta-data/iam/security-credentials/'"
            },
            {
              kind: "prose",
              title: "The three properties that break the attack",
              body: "IMDSv2 is not authentication — anything on the instance can still get a token. It defeats SSRF through three specific properties. First, the token is obtained with a PUT, and the overwhelming majority of SSRF primitives can only issue a GET. Second, the token must be echoed in a request header, and most SSRF primitives cannot set arbitrary headers. Third, the PUT response carries an IP time-to-live, so setting the hop limit to 1 means the response cannot traverse a container network bridge or an open reverse proxy to reach an off-instance attacker. Each property independently kills a large fraction of real exploitation paths; together they are close to decisive for the classic reflected-GET case."
            },
            {
              kind: "code",
              title: "Enforce it, then verify you actually enforced it",
              lang: "bash",
              body: "aws ec2 modify-instance-metadata-options \\\n  --instance-id i-0123456789abcdef0 \\\n  --http-tokens required \\\n  --http-put-response-hop-limit 1 \\\n  --http-endpoint enabled\n\naws ec2 describe-instances \\\n  --query 'Reservations[].Instances[].{id:InstanceId,opts:MetadataOptions}' \\\n  --output table\n\naws ec2 modify-instance-metadata-defaults \\\n  --http-tokens required \\\n  --http-put-response-hop-limit 2"
            },
            {
              kind: "checklist",
              title: "The full SSRF control set — metadata hardening alone is not a programme",
              items: [
                "Resolve the hostname once, validate the resulting IP against a deny list of RFC 1918, loopback, link-local and IPv6 unique-local ranges, then connect to that IP with the original Host header set explicitly",
                "Refuse to follow redirects, or re-validate the resolved address on every hop — an allowlisted domain that 302s to 169.254.169.254 defeats naive validation",
                "Prefer an allowlist of destinations over a deny list wherever the business permits it",
                "Route all outbound fetches through a dedicated egress proxy in a subnet with no instance role and no route to the metadata endpoint",
                "Set the metadata hop limit to 1 for bare instances, and understand that container environments may need 2 — which is exactly why per-workload settings beat a global default",
                "Disable the metadata endpoint entirely on workloads that do not need instance credentials",
                "Scope the instance role to almost nothing, because the correct assumption is that SSRF will eventually succeed somewhere"
              ]
            },
            {
              kind: "callout",
              title: "Read the precedence table before you claim enforcement",
              body: "AWS resolves the metadata configuration from launch parameters, then account-level defaults, then AMI configuration, in that order. A team that sets an account default of tokens-required and then launches instances that explicitly request tokens-optional gets tokens-optional, silently, because the launch parameter wins. Account-level enforcement exists precisely to close that hole and it fails launches rather than downgrading them. If your evidence is a policy document rather than a describe-instances output across every region, you do not have evidence."
            }
          ],
          praxis: "Enumerate every outbound-fetch feature in one service you own, prove which ones can reach link-local addresses, then land both the egress proxy and enforced IMDSv2.",
          evidence: "Before and after describe-instances output showing HttpTokens required and the hop limit set, plus the code diff for the fetch validator.",
          awards: ["metadata-locksmith", "egress-discipline"],
          glossary: ["ssrf", "imdsv2", "link-local-address", "egress-proxy", "hop-limit"]
        },
        {
          id: "ch-appsec-step-deser-drill",
          kind: "drill",
          title: "Drill: The Deserialization Finding",
          statement: "A vulnerability class with a fearsome reputation still has to be reachable by an attacker before it deserves your weekend.",
          minutes: 25,
          respect: 150,
          trust: 6,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The class, briefly",
              body: "Unsafe deserialization turns a data channel into a code channel. Java native serialization, Python pickle, Ruby Marshal, PHP unserialize and a long tail of misconfigured YAML and JSON binders all allow an attacker who controls the byte stream to influence which types are constructed and which methods run during construction. Gadget chains assembled from ordinary library classes then convert type instantiation into command execution. The class is real and it is severe. It is also the class where the gap between a scanner signature and actual exploitability is widest, which is why it makes such a good decision drill."
            },
            {
              kind: "compare",
              title: "What makes a deserialization finding urgent versus theoretical",
              left: {
                title: "Treat as urgent",
                items: [
                  "The deserialized bytes originate from a request body, cookie, header, or message queue an external party can write to",
                  "The runtime has a known reachable gadget chain in the dependency set actually on the classpath",
                  "The process holds credentials or network position worth taking",
                  "No allowlist of permitted types is in effect"
                ]
              },
              right: {
                title: "Treat as backlog",
                items: [
                  "The input is a file written by the same process on the same host with no external write path",
                  "The deserializer is configured with a strict type allowlist that the payload cannot satisfy",
                  "The library is present but the code path is dead — nothing calls it, and reachability analysis confirms it",
                  "The finding is on a build-time tool that never processes untrusted data"
                ]
              }
            },
            {
              kind: "principle",
              title: "Severity describes the bug; priority describes your system",
              body: "Two identical CVEs in two of your services can honestly warrant an emergency change window and a routine sprint ticket respectively. The variable is not the bug. It is reachability, exposure and blast radius. A programme that cannot make that distinction will burn its credibility on the first ten findings and have none left for the eleventh, which will be the one that matters."
            },
            {
              kind: "callout",
              title: "The structural fix, when you have the time",
              body: "Every mainstream deserialization library now supports a type allowlist, and every one of them ships with it disabled for backwards compatibility. Configuring a strict allowlist retires the entire class for that service, converts every future CVE in that library into a low-priority item, and takes an afternoon. That is the class-level move hiding inside what looks like a patching problem — and it is a far better use of the same engineering hours than the ticket you were about to file."
            }
          ],
          drill: {
            id: "ch-appsec-drill-deser",
            scene: "Friday, 16:40. Your SCA tool fires a critical on a Java library used by eleven services. The advisory describes unsafe deserialization leading to remote code execution, CVSS 9.8. The tool has helpfully opened eleven tickets and emailed the eleven owning teams, three of whom have already replied asking whether they should cancel their evening. Your platform team lead is on holiday. You have the dependency graph, an API gateway log, and about twenty minutes before this becomes a rumour.",
            clock: "20 minutes before the story writes itself",
            pressure: "Eleven teams, a Friday evening, and an automated email that has already implied urgency you have not yet verified.",
            prompt: "What do you do first?",
            options: [
              {
                id: "ch-appsec-drill-deser-opt-patch-all",
                label: "Declare a P1, freeze deploys, and require all eleven services to patch tonight",
                detail: "Maximum urgency, uniform treatment, nobody can accuse you of underreacting.",
                score: -1,
                outcome: "Eight of the eleven services turn out not to call the vulnerable code path at all. Two of them break in production at 23:00 because the patched library changed a serialization default, and you spend Saturday on an outage you created.",
                ripple: "The next critical you declare gets slow-walked, because engineering has learned that your P1 is not correlated with actual danger. You have spent credibility on a coin flip."
              },
              {
                id: "ch-appsec-drill-deser-opt-reachability",
                label: "Split the eleven by reachability and exposure in the first ten minutes, then act differently on each group",
                detail: "Which services deserialize attacker-controlled bytes, which are internet-reachable, which hold credentials worth taking. Emergency-patch that subset tonight; schedule the rest.",
                score: 3,
                outcome: "Two services deserialize request-supplied data and one is internet-facing. You patch that one under an emergency change with a rollback plan, apply a temporary type allowlist to the second, and put the remaining nine into the normal sprint. Nobody works past 20:00.",
                ripple: "You have just demonstrated the triage model you want the organisation to internalise, using an incident as the teaching vehicle. The next time a 9.8 lands, three team leads run the same split themselves before pinging you.",
                isBest: true
              },
              {
                id: "ch-appsec-drill-deser-opt-wait",
                label: "Reply to the three teams that it can wait until Monday and go home",
                detail: "Friday deploys are how outages happen; Monday morning with full staffing is safer.",
                score: -2,
                outcome: "Defensible for nine of the services and indefensible for the internet-facing one, which is scanned by an opportunistic mass-exploitation campaign over the weekend. You are now explaining a decision you made without looking.",
                ripple: "The specific harm is bad. The lasting harm is worse: you made a risk decision without doing the ten minutes of analysis that would have made it a judgement rather than a guess, and that will be the finding in the post-incident review."
              },
              {
                id: "ch-appsec-drill-deser-opt-waf",
                label: "Push a WAF rule blocking serialized-object magic bytes across all eleven and revisit next week",
                detail: "Fast, no code change, no deploy freeze, buys time for a considered fix.",
                score: 1,
                outcome: "It genuinely blocks the naive payloads and buys real time, which is why this option is tempting. It also misses base64-wrapped, gzip-wrapped, and multipart-delivered variants, and it does nothing for the message-queue consumer that never passes through the WAF.",
                ripple: "Compensating controls that are never revisited become permanent. Six months later the rule is still there, the library is still vulnerable, and a new consumer has been added on a path the WAF does not see."
              }
            ],
            debrief: "The correct move is not patch everything or patch nothing — it is spend ten minutes converting one uniform alert into three differentiated decisions. Reachability is the highest-value variable available to you in that window: a critical deserialization CVE in a code path nothing calls carries approximately the risk of a comment. Exposure is second: internet-facing changes the attacker population from a handful of insiders to the entire internet's scanning infrastructure. Note what the third option gets right, because it is the most seductive answer here. A WAF rule is a legitimate compensating control and it does buy time. It fails as a first move because it treats all eleven services identically, exactly like the first option, while adding the illusion of resolution. The best answer is also the cheapest in human cost — nine teams get their Friday evening back, which is how you build the credit you will need on the night an emergency is real.",
            principle: "Under time pressure, the highest-leverage action is almost never to act on everything. It is to differentiate — because a uniform response to a non-uniform problem is a guess wearing a process."
          },
          awards: ["reachability-realist", "the-ten-minute-split"],
          glossary: ["deserialization", "gadget-chain", "reachability", "compensating-control", "blast-radius"]
        }
      ]
    },
    {
      id: "ch-appsec-pg-paved-road",
      title: "THE PAVED ROAD",
      credential: "Certified in Secure Development Lifecycle Design — StepSAFE Praxis",
      summary: "A secure SDLC that engineers route around is worse than none, because it produces the paperwork of assurance without the substance. This Page teaches the design of programmes people adopt voluntarily: paved roads with real gravity, guardrails that only become gates where the loss is unrecoverable, threat modelling that fits inside a design review, and an honest account of why shift-left succeeded as a slogan and frequently failed as a practice.",
      competencies: [
        "Design a paved road with enough gravity that the insecure path becomes the expensive one",
        "Decide which controls are guardrails and which few must be hard gates, and defend the line",
        "Run a threat model inside an existing design review without adding a ceremony",
        "Diagnose and reverse a shift-left programme that has become a ticket firehose",
        "Build and sustain a security champions network that does not decay into a mailing list",
        "Negotiate a release decision with an executive who wants a yes"
      ],
      seal: "AZ-ROAD",
      steps: [
        {
          id: "ch-appsec-step-guardrails-gates",
          kind: "construct",
          title: "Guardrails Over Gates",
          statement: "Every gate you install is a tax on every release forever; charge it only where the loss is unrecoverable.",
          minutes: 20,
          respect: 85,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "The definitions matter more than they look",
              body: "A guardrail is a control that makes the wrong thing hard and the right thing automatic, without stopping anyone: a base image that already has the hardened defaults, a library that will not compile an unscoped query, a linter that warns and links to the fix. A gate is a control that blocks progress until a condition is met: a scan that fails the build, a sign-off that must be collected, a change advisory board. Guardrails scale with engineering headcount because they cost nothing per use. Gates scale with security headcount because someone has to adjudicate the exceptions, and exceptions arrive in proportion to releases."
            },
            {
              kind: "table",
              title: "Where each belongs",
              headers: ["Situation", "Guardrail or gate", "Reasoning"],
              rows: [
                ["Secrets committed to a repository", "Gate — block the push", "The loss is instant and irreversible the moment the commit lands on a remote; a warning arrives too late to matter"],
                ["A dependency with a KEV-listed CVE reachable from an entrypoint", "Gate — fail the build", "Small, well-defined, high-signal set. A gate is only tolerable when its false-positive rate is near zero"],
                ["A dependency with any CVE at all", "Guardrail — annotate the pull request", "Gate here and you have built a firehose; teams will get an exception process approved and then use it by default"],
                ["Unencrypted storage bucket", "Guardrail in the module, gate at deploy for regulated data", "Make the paved-road module encrypt by default; reserve the hard block for the data classes where a leak is a notification event"],
                ["Missing threat model on a new externally-facing service", "Gate — but on design review, not on release", "Blocking at release means the design is already built. Blocking at design costs an hour and saves a quarter"],
                ["New use of a memory-unsafe language in a parser", "Gate — named executive exception", "Rare, high-consequence, and the exception itself is the useful artefact because it tells you where the risk is accumulating"]
              ]
            },
            {
              kind: "principle",
              title: "The gravity test",
              body: "A paved road is working when a team that has never met you chooses it because it is faster, not because they were told to. If the road only gets used when you enforce it, it is not a road, it is a checkpoint — and checkpoints get routed around the moment a deadline arrives."
            },
            {
              kind: "callout",
              title: "The exception process tells you the truth",
              body: "Read your exception register once a quarter and treat it as your most honest telemetry. If one gate produces most of the exceptions, that gate is miscalibrated and you should convert it to a guardrail before someone senior converts it for you. If exceptions are approved at a rate above roughly one in five requests, the gate has already stopped being a control and has become a formality with a queue."
            }
          ],
          awards: ["guardrail-over-gate"],
          glossary: ["paved-road", "guardrail", "hard-gate", "exception-register", "secure-default"]
        },
        {
          id: "ch-appsec-step-threat-model-design",
          kind: "lesson",
          title: "Threat Modelling Inside The Design Review",
          statement: "A threat model is not a document; it is a forty-minute argument held before the code exists, and its only artefact worth keeping is the decisions it changed.",
          minutes: 30,
          respect: 140,
          trust: 5,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Why the heavyweight versions died",
              body: "Formal threat modelling methodologies collapsed in most organisations for a mundane reason: they required a specialist to run a multi-hour session that produced a forty-page artefact nobody read, at a rate of perhaps one service per week against an engineering organisation shipping a hundred changes a day. The response was not to make the method better. It was to make it small enough to fit inside a ritual that already exists — the design review — and to accept a less complete model produced a hundred times more often. Coverage beats depth when the alternative to shallow coverage is no coverage."
            },
            {
              kind: "numbered",
              title: "The four questions, in the order that actually works in a room",
              items: [
                "What are we building? Force a whiteboard diagram with trust boundaries drawn as explicit lines. Not a component diagram — a diagram where every line that crosses from one owner or one privilege level to another is marked. Half of all findings surface during the act of drawing this, before anyone has said the word threat.",
                "What can go wrong? Walk each boundary crossing, not each component. Ask who can send bytes across this line, what happens if they are hostile, and what they gain if this side is compromised. If the room is stuck, use STRIDE as a prompt list rather than a framework.",
                "What are we going to do about it? Every issue gets exactly one of four dispositions: mitigate now, mitigate later with a ticket and a date, accept with a named accepter, or transfer. Ambiguity here is how threat models become fiction.",
                "Did we do a good job? Revisit at the first significant design change and after any incident touching that service. A model that is never revisited is a snapshot of what a team believed on one Tuesday."
              ]
            },
            {
              kind: "checklist",
              title: "The prompts that earn their place in a forty-minute session",
              items: [
                "Where does untrusted input enter, and what parses it before authentication happens",
                "What identity does each component run as, and what would that identity let an attacker do next",
                "What is the most sensitive object in this design, and can it be requested by identifier",
                "What happens on failure — does this component fail open or closed, and did anyone decide that on purpose",
                "Which secret does this need, where does it come from, and how does it rotate",
                "What does an administrator of this system see, and who administers the administrators",
                "If this service is fully compromised, what is the second thing the attacker reaches",
                "What in this design is new to the company — new protocol, new language, new vendor, first use of a pattern"
              ]
            },
            {
              kind: "callout",
              title: "The output you keep",
              body: "Keep the diagram with the trust boundaries, and keep the disposition list. Throw away the narrative. If a threat model needs a narrative to be understood, the diagram is wrong. The disposition list is what you will hand an auditor, what you will use to check whether the built system matches the reviewed design, and what you will read after the incident that proves you knew."
            },
            {
              kind: "quote",
              body: "Insecure Design is a category that admits the rest of the list is downstream of decisions.",
              source: "Framing of OWASP A06:2025, Insecure Design"
            }
          ],
          awards: ["threat-model-in-the-room"],
          glossary: ["trust-boundary", "stride", "disposition", "design-review", "fail-closed"]
        },
        {
          id: "ch-appsec-step-shift-left-failure",
          kind: "lesson",
          title: "Shift Left Was Half An Idea",
          statement: "Moving detection earlier without moving remediation capacity earlier just relocates the queue and calls it progress.",
          minutes: 28,
          respect: 155,
          trust: 6,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The half that was right",
              body: "The economic argument for shifting left is sound and well established: a defect found at design costs a fraction of the same defect found in production, because the fix is a conversation rather than a change to a running system with users on it. Nobody serious disputes the direction. The failure was in the implementation, because most organisations implemented shift-left as move the scanners into the pipeline and then declared victory when the scanners started running. Detection moved. Nothing else did."
            },
            {
              kind: "prose",
              title: "How it becomes a firehose",
              body: "Here is the sequence, and you will recognise it. A scanner is wired into continuous integration with default rules. It produces several hundred findings on the first run against a mature codebase. Because nobody can triage that, the team is told to fix criticals only. Criticals include a large number of transitive dependency findings that are not reachable and several static analysis findings that are structurally impossible in the given control flow. Engineers spend two sprints on findings they can tell are wrong, learn that the tool is unreliable, and start treating all of its output as noise. Six months later the tool is still running, the dashboard is still green-ish, and the one true finding in the pile has been ignored for four months alongside the false ones. You have not shifted left. You have shifted trust out."
            },
            {
              kind: "metric",
              title: "The three numbers that tell you which situation you are in",
              body: "Instrument these before you buy anything else. They are more diagnostic than any tool comparison.",
              items: [
                "Precision at the developer's desk: of the findings you send to engineers, what fraction do they agree are real and worth fixing. Below roughly one in two, adoption collapses and no amount of executive support saves it",
                "Time from finding to a decision — not to a fix. Decisions include accept and wontfix. A queue where nothing is ever formally declined is a queue that will grow without bound",
                "Findings created per week versus findings resolved per week. If creation exceeds resolution persistently, the programme has a structural defect that no amount of nagging will fix"
              ]
            },
            {
              kind: "compare",
              title: "Shift left as practised badly versus as it should be",
              left: {
                title: "The firehose pattern",
                items: [
                  "Turn on every rule the vendor ships, because turning rules off feels like accepting risk",
                  "Route findings directly to developers with no triage layer",
                  "Measure programme success by findings created and coverage percentage",
                  "Fail the build on any finding above a severity threshold",
                  "Treat a declined finding as a security failure rather than a normal outcome"
                ]
              },
              right: {
                title: "The paved pattern",
                items: [
                  "Start with a small ruleset chosen for near-zero false positives, and earn the right to add rules by demonstrated precision",
                  "Triage centrally at first; hand routing to teams only once precision is proven",
                  "Measure by classes eliminated, mean time to decision, and voluntary paved-road adoption",
                  "Fail the build only on the small high-signal set — secrets, KEV-listed and reachable, known-malicious packages",
                  "Publish the declined findings and the reasoning, so declining is a visible, accountable, normal act"
                ]
              }
            },
            {
              kind: "principle",
              title: "Capacity is the constraint, not detection",
              body: "You can always buy more detection. You cannot buy more attention. Any security initiative that increases the demand on engineering attention without increasing supply is a transfer of your problem onto someone with less context and less time — and it will be returned to you as apathy."
            }
          ],
          awards: ["firehose-extinguisher"],
          glossary: ["shift-left", "precision", "triage-layer", "mean-time-to-decision", "alert-fatigue"]
        },
        {
          id: "ch-appsec-step-gate-drill",
          kind: "drill",
          title: "Drill: The Gate And The Release Train",
          statement: "The moment your control blocks revenue is the moment you discover whether you designed it or inherited it.",
          minutes: 25,
          respect: 160,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The structural problem with release-time gates",
              body: "A gate at release is a gate at the worst possible moment. Every stakeholder is committed, the marketing date is public, the cost of the change is maximal, and the person holding the gate is the only one in the room with an incentive to stop. That asymmetry is why release-time security gates lose almost every argument they enter, and why the ones that win tend to win once and then get renegotiated out of existence. The design lesson is to move the decisive control earlier and keep the release gate narrow enough that it almost never fires."
            },
            {
              kind: "callout",
              title: "Before you read the drill",
              body: "Notice that the interesting question in this scenario is never is the finding real. It is what does the organisation learn about your controls from how you handle it. You will be right about the technology roughly as often as you are wrong; you will be judged on whether your controls behave predictably."
            },
            {
              kind: "table",
              title: "The unbundling options, ranked by how often they are available",
              headers: ["Move", "What ships on the date", "What it costs", "When it does not work"],
              rows: [
                ["Feature flag, default off", "Everything except the risky capability", "One flag and a follow-up change", "When the risky path is the product itself"],
                ["Internal-only allowlist for launch week", "The full product, to a controlled population", "An allowlist and a comms line", "When the launch is the public announcement"],
                ["Staged rollout by percentage", "The product, to a fraction of traffic", "A rollout mechanism you should already have", "When the risk is a data-integrity or credential issue rather than a stability one"],
                ["Network-level block on the dangerous path", "Everything", "An hour of platform work, plus permanent maintenance debt", "When the path is reachable internally or by an alternate route"],
                ["Ship with the defect and fix later", "Everything", "The risk, in full, plus your position on every future gate", "Almost always"]
              ]
            },
            {
              kind: "principle",
              title: "Arrive with an option, not a verdict",
              body: "The security leader who walks into a launch meeting with only a yes or no has already reduced their own influence to a coin flip. Walk in with the unbundling table filled out for this specific release and you change the meeting from a negotiation about your authority into a design discussion about theirs. You will win far more of those."
            }
          ],
          drill: {
            id: "ch-appsec-drill-release-gate",
            scene: "Thursday 09:00. The flagship customer portal ships tomorrow after nine months of work, with a press release scheduled and two enterprise customers whose contracts are contingent on the date. Your pipeline gate fires: the pull request adds a new file-import feature that fetches user-supplied URLs server-side, and your reachability tooling confirms the fetch has no destination validation. The engineering VP is in your calendar in fifteen minutes and has already used the phrase we can fix it in the first patch release.",
            clock: "15 minutes until the VP conversation, 30 hours until launch",
            pressure: "A public date, two contingent contracts, and a control that has never blocked anything this visible before.",
            prompt: "What position do you take into that meeting?",
            options: [
              {
                id: "ch-appsec-drill-release-gate-opt-block",
                label: "Hold the gate. The feature is an SSRF and it does not ship until it is validated",
                detail: "The control exists for exactly this. If it bends here it bends always.",
                score: 0,
                outcome: "You may well win, and the feature is genuinely dangerous. But you have framed it as security versus the business on the day before launch, which is the one framing where you are structurally the obstacle. Even winning costs you.",
                ripple: "The next quarter's roadmap review quietly moves security review to a later stage so it stops surprising people. You held the line on one release and lost position on all of them."
              },
              {
                id: "ch-appsec-drill-release-gate-opt-ship",
                label: "Accept the risk, log it, and ship with a commitment to fix in the first patch",
                detail: "The business consequence of a slip is concrete and the security consequence is probabilistic.",
                score: -2,
                outcome: "An unvalidated server-side fetch on an internet-facing portal is among the most reliably discovered and most damaging primitives there is; automated scanning finds these within days of exposure. You have accepted a risk whose realistic probability you did not measure.",
                ripple: "Worse than the risk itself: you have established that the gate is negotiable under date pressure, which every future team now knows. Your gate has become a suggestion with a meeting attached."
              },
              {
                id: "ch-appsec-drill-release-gate-opt-scope",
                label: "Ship the release with the import feature disabled by flag, land the validation and egress proxy next week, enable then",
                detail: "Separate the launch from the feature. The gate blocks a capability, not a date.",
                score: 3,
                outcome: "The portal launches on schedule, the press release is unaffected, both contracts close, and the dangerous primitive is not reachable in production. The fix lands eight days later with a proper egress proxy and a test, and the flag flips on in a low-drama change.",
                ripple: "You have taught the organisation the single most valuable pattern in this domain: security blocks capabilities, not calendars. Two other teams adopt feature flags for risky functionality within the quarter without being asked, because it visibly bought a colleague a launch.",
                isBest: true
              },
              {
                id: "ch-appsec-drill-release-gate-opt-waf",
                label: "Ship as-is behind an emergency WAF rule blocking internal IP ranges in the URL parameter",
                detail: "A real compensating control, deployable in an hour, no code change and no date impact.",
                score: 1,
                outcome: "It blocks the obvious payloads. It does not survive DNS rebinding, a redirect from an allowed host, decimal or IPv6-mapped encodings of 169.254.169.254, or the alternate code path that a second team adds three weeks later.",
                ripple: "This is the most tempting wrong answer because it is genuinely useful and costs nobody anything today. The damage is that it resolves the ticket. Nobody returns to an item marked mitigated, and eleven months later the compensating control is the only thing standing between a scanner and your instance role."
              }
            ],
            debrief: "The winning move reframes the decision from when do we ship to what ships. Almost every release-time security conflict has a scoping solution hiding inside it, because a release is a bundle and bundles can be unbundled — feature flags, dark launches, staged rollouts, restricting a capability to internal users on day one. Look for that solution before you look for a position. Notice the trap in the fourth option: a WAF rule is a legitimate control and would be a good second layer, but as the primary answer it converts an open item into a closed one, and closed items do not get revisited. If you take that path, the discipline is to keep the ticket open with the compensating control noted, never to close it. The first option is not wrong on the technology and it is not scored negatively — but it spends organisational capital to achieve an outcome the third option achieves for free, and a CISO who cannot tell the difference between being right and being effective will run out of capital long before they run out of correct opinions.",
            principle: "When a control meets a deadline, unbundle the release before you argue about the date. Blocking a capability is a decision; blocking a calendar is a fight."
          },
          awards: ["unbundler", "guardrail-over-gate"],
          glossary: ["feature-flag", "dark-launch", "compensating-control", "risk-acceptance", "organisational-capital"]
        },
        {
          id: "ch-appsec-step-build-paved-road",
          kind: "field",
          title: "Field: Build One Segment Of Paved Road",
          statement: "Ship one secure default that a team adopts without being asked, and you have learned more about security programme design than any framework will teach you.",
          minutes: 90,
          respect: 200,
          trust: 11,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The assignment",
              body: "Pick one recurring insecure pattern in a real codebase you have access to — your employer's, an open-source project you contribute to, or a substantial personal project with more than one contributor. Build the paved alternative. Not a document about the alternative, not a linter rule that complains about the current state: the actual thing that makes the secure path faster than the insecure one. Then get at least one person who is not you to use it voluntarily, and record why they did."
            },
            {
              kind: "list",
              title: "Segments that are the right size for this exercise",
              items: [
                "A repository template with secret scanning, pinned Actions by commit SHA, minimal token permissions and a signed-release workflow already wired — so starting a new service correctly takes zero decisions",
                "A data access wrapper that cannot express a query without a caller principal, as in the authorisation lab, plus the route coverage test",
                "An HTTP client wrapper with DNS-resolution validation, redirect re-validation and a hard deny on link-local ranges, published as the standard client",
                "A Terraform or Pulumi module for the storage primitive your organisation uses most, with encryption, logging, public-access-block and lifecycle defaults set and difficult to unset",
                "A local development container that provides short-lived credentials through OIDC so nobody has a reason to keep a long-lived key in their home directory",
                "A logging helper that redacts a defined set of field names by default, so the safe call is the shortest call"
              ]
            },
            {
              kind: "checklist",
              title: "The bar this has to clear to count",
              items: [
                "It is faster to use than the alternative, measured in decisions the developer has to make, not in lines of code",
                "The insecure behaviour is still possible but requires an explicit, visible, greppable escape hatch",
                "It has tests, and the tests demonstrate the security property, not just the happy path",
                "It has documentation shorter than one screen with a copy-pasteable example that works",
                "Someone who does not report to you and does not owe you a favour used it and can say why",
                "You can name the vulnerability class it retires and estimate how many instances of that class it prevents per year"
              ]
            },
            {
              kind: "callout",
              title: "The part everyone skips",
              body: "Adoption is the deliverable, not the artefact. A perfect secure library with no users has produced exactly zero security outcome, and the industry is full of them. Budget half your time for the build and half for the adoption work — the office hours, the migration pull request you write yourself for the first team, the five-minute demo at the engineering all-hands. If that ratio feels wrong to you, that instinct is the thing this exercise is designed to correct."
            }
          ],
          praxis: "Build and ship one paved-road segment into a real repository, then drive its first voluntary adoption by a team or contributor who is not you.",
          evidence: "A link to the merged code with tests and README, the pull request in which someone else adopted it, and a short written statement of the vulnerability class retired with your estimate of annual instances prevented.",
          awards: ["paved-road-builder", "first-voluntary-adopter"],
          glossary: ["paved-road", "escape-hatch", "secure-default", "adoption-metric"]
        },
        {
          id: "ch-appsec-step-champions-council",
          kind: "council",
          title: "Council: A Champions Network That Does Not Decay",
          statement: "A security champions programme is a distribution network for judgement, and every one that fails does so because it distributed tasks instead.",
          minutes: 30,
          respect: 150,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Why most of them are dead within a year",
              body: "The standard failure has a predictable shape. Volunteers are recruited with a title and no budget. They are given the security team's least popular work — chasing scanner tickets, filling in questionnaires, nagging teammates about patch deadlines. The role gives them no career benefit, costs them peer goodwill, and is invisible to their manager at performance review. Within two quarters the enthusiastic ones have burned out, the strategic ones have quietly stopped attending, and what remains is a mailing list with a name. The root cause is not motivation. It is that the programme was designed as a labour transfer rather than a capability transfer."
            },
            {
              kind: "numbered",
              title: "The design that holds",
              items: [
                "Buy the time explicitly. Negotiate a named allocation with the engineering manager — four hours a week is a real number that survives scrutiny — and get it into the team's capacity plan. Unfunded volunteering is the single strongest predictor of programme death.",
                "Give judgement, not tasks. A champion's job is to be the person in the room during design review who asks the trust boundary questions, and to be the first reviewer for security-relevant pull requests. It is not to close your tickets.",
                "Make the role a career asset with evidence. Write into the engineering competency framework what a champion demonstrates, contribute a paragraph to their performance review, and make the role a recognised step toward staff engineer. If their manager does not see value, the role is a hobby.",
                "Teach in cohorts, not in onboarding documents. Run a real, hands-on curriculum with peers — break something together, fix it together. The cohort bond is what makes people still show up in month nine.",
                "Give them privileges nobody else has: the ability to approve a defined class of risk acceptance up to a threshold, early access to tooling, a direct line to you. Authority is the compensation you can grant that costs no budget.",
                "Measure the network by leading indicators — design reviews attended, threats caught before code, paved-road contributions merged — and never by tickets closed, which will immediately corrupt the role back into labour transfer."
              ]
            },
            {
              kind: "table",
              title: "What you say when a VP asks what this costs",
              headers: ["Their question", "The weak answer", "The answer that works"],
              rows: [
                ["Why do I give up four hours of an engineer's week", "Security is everyone's responsibility", "Because a design flaw caught in review costs an hour and the same flaw caught in production costs a quarter, and my team cannot attend every design review in your org — your champion can"],
                ["Can we just buy a tool instead", "Tools do not catch everything", "Tools catch the classes with syntactic signatures. Your last three serious findings were authorisation and business logic, and no tool on the market labels those"],
                ["What happens if my champion leaves", "We recruit another one", "The judgement stays in the team through the review habits and the paved-road code they contributed. That is why we measure contributions, not attendance"],
                ["How do I know it is working", "Engagement is strong", "Threats dispositioned at design review per quarter, and the ratio of security-relevant defects caught pre-merge versus post-deploy. Both are on your dashboard, not mine"]
              ]
            },
            {
              kind: "principle",
              title: "The compensation you can actually offer",
              body: "You rarely control money. You almost always control access, authority, information and recognition. Design the champion role around those four and it becomes something engineers compete for. Design it around obligation and you will be recruiting again in six months, from a smaller pool, with a worse reputation."
            }
          ],
          awards: ["champion-network", "capability-transfer"],
          glossary: ["security-champion", "capability-transfer", "leading-indicator", "risk-acceptance-threshold"]
        }
      ]
    },
    {
      id: "ch-appsec-pg-proof",
      title: "PROOF OF ABSENCE",
      credential: "Certified in Security Testing and Assurance — StepSAFE Praxis",
      summary: "Every security testing technique answers a different question, and most programmes buy four tools that answer the same one. This Page compares SAST, DAST, IAST and SCA honestly including the economics of their error rates, then goes hands-on with the two techniques that consistently find defects nothing else does: coverage-guided fuzzing and property-based testing. It ends with the discipline of standing up continuous fuzzing and proving what it actually covers.",
      competencies: [
        "Match each testing technique to the vulnerability classes it can and cannot detect",
        "Model the cost of a false-positive rate and set a precision floor before deployment",
        "Write and run a coverage-guided fuzz harness that finds a real crash",
        "Write property-based tests for parser and protocol code including round-trip and differential properties",
        "Interpret coverage data honestly and identify uninstrumented blind spots",
        "Handle a late-arriving penetration test report without either capitulating or stalling"
      ],
      seal: "AZ-PROOF",
      steps: [
        {
          id: "ch-appsec-step-tooling-honest",
          kind: "lesson",
          title: "SAST, DAST, IAST, SCA: The Honest Comparison",
          statement: "These are not four grades of the same product; they answer four different questions, and knowing which question you have is the entire purchasing decision.",
          minutes: 30,
          respect: 110,
          trust: 4,
          mode: "novus",
          blocks: [
            {
              kind: "table",
              title: "What each technique can and cannot see",
              headers: ["Technique", "The question it answers", "Genuinely strong at", "Structurally blind to", "Dominant error mode"],
              rows: [
                ["SAST", "Does this source code contain a dangerous pattern", "Injection sinks, hardcoded secrets, unsafe API use, taint flows within a single language and codebase", "Anything requiring runtime state, configuration, or knowledge of who the caller is — so all authorisation and logic bugs", "False positives, because it must assume every path is reachable"],
                ["DAST", "Does this running application behave insecurely from outside", "Reflected and stored injection, misconfiguration, missing headers, some access control if you give it two credential sets", "Anything behind an unreached code path, complex workflows it cannot navigate, non-HTTP interfaces", "False negatives, because coverage is bounded by what the crawler reaches"],
                ["IAST", "What is actually happening inside the process during a real request", "Confirming exploitability of taint flows with far less guesswork, since it sees both the request and the runtime", "Code paths that no test or user exercises; requires an agent in the runtime, which limits deployment", "Coverage gaps, and operational resistance to running an agent in production"],
                ["SCA", "What third-party code am I shipping and what is known about it", "Inventory, licence, known-CVE matching, transitive dependency discovery", "Whether the vulnerable function is ever called, and anything malicious that has no CVE — including every incident in this chapter", "False positives at enormous volume, driven by unreachable transitive findings"],
                ["Fuzzing", "Can I make this code do something it was never designed to do", "Memory corruption, panics, assertion failures, resource exhaustion, parser differentials", "Anything requiring valid authentication state or semantic correctness of output", "Blind spots from harness design and low coverage, silently"],
                ["Manual review and pentest", "What would a smart adversary do to this specific system", "Authorisation, business logic, chained weaknesses, design flaws — the classes that dominate real breaches", "Scale, repeatability, and regression detection", "Cost and variance between practitioners"]
              ]
            },
            {
              kind: "prose",
              title: "The purchasing failure this table is designed to prevent",
              body: "Most organisations end up with two SAST products, a DAST that only ever scanned the marketing site, and an SCA generating four thousand open findings — while having zero capability against the class that appears first on the OWASP list every single year. If your last three real incidents were authorisation failures and your entire testing budget went to tools that structurally cannot detect authorisation failures, you did not buy security testing. You bought coverage of the things that are easy to cover. The right first question in any tooling conversation is which class do we have no capability against at all, and the honest answer is usually access control and business logic."
            },
            {
              kind: "compare",
              title: "Where SCA genuinely earns its keep versus where it wastes your organisation",
              left: {
                title: "High value",
                items: [
                  "Inventory — knowing within minutes whether you ship a given package when the next Log4Shell lands. This alone justifies the purchase",
                  "Detecting known-malicious packages and typosquats at install time",
                  "Blocking direct dependencies with KEV-listed vulnerabilities at the pull request",
                  "Surfacing unmaintained dependencies, which is a leading indicator of both defect risk and takeover risk"
                ]
              },
              right: {
                title: "Value-destroying if left unmanaged",
                items: [
                  "Routing every transitive CVE to a product team with no reachability filter",
                  "Failing builds on findings in test-only or build-only dependency scopes",
                  "Treating CVSS as the sole prioritisation input, which produces a queue sorted by irrelevance",
                  "Reporting total open findings to executives as a security metric, which incentivises exactly the wrong behaviour"
                ]
              }
            },
            {
              kind: "principle",
              title: "Buy for a class, not for a category",
              body: "Never approve a security tool purchase without naming the vulnerability class it addresses, the class it leaves uncovered, and the precision you will require of it before you route its output to an engineer. If nobody in the room can answer the third question, you are buying a firehose."
            }
          ],
          awards: ["tool-realist"],
          glossary: ["sast", "dast", "iast", "sca", "taint-analysis"]
        },
        {
          id: "ch-appsec-step-false-positive-economics",
          kind: "lesson",
          title: "The False Positive Is An Economic Instrument",
          statement: "A tool's precision is not a technical specification; it is the exchange rate between your programme and your engineers' trust.",
          minutes: 28,
          respect: 160,
          trust: 6,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Do the multiplication before you deploy anything",
              body: "Take the number of findings a tool will produce per week across your estate. Multiply by the median engineer-minutes to investigate one finding to the point of a confident verdict — in practice this is fifteen to forty-five minutes for a static analysis finding on unfamiliar code, and considerably more for anything transitive. Multiply by the fraction that will turn out to be wrong. That product is what you are spending, in the most expensive currency your organisation has, to obtain the true positives hiding in the same stream. Now ask whether you would authorise that spend as a line item. Most teams have never run this multiplication, which is why most teams are running tools they would not fund if the cost were visible."
            },
            {
              kind: "metric",
              title: "The thresholds that show up repeatedly in practice",
              body: "These are practitioner heuristics rather than published constants. Treat them as calibration points to test in your own environment, not as laws.",
              items: [
                "Above roughly fifty percent precision, engineers investigate findings on the assumption they are probably real",
                "Between twenty and fifty percent, engineers investigate but resentfully, and start batching findings to the end of the sprint where they die",
                "Below twenty percent, engineers rationally stop reading, and at that point your true positives are being suppressed by your own tooling",
                "Once trust is lost, restoring it takes several times longer than losing it, because engineers must accumulate new evidence against a prior you gave them",
                "A single high-profile false positive that costs a team a weekend does more damage than a hundred quiet ones"
              ]
            },
            {
              kind: "numbered",
              title: "How to deploy a noisy tool without destroying trust",
              items: [
                "Run it in shadow mode first for at least four weeks. Nobody but you sees the output. You are measuring, not protecting.",
                "Hand-triage a random sample of at least fifty findings to establish real precision, per rule. Not overall precision — per rule, because precision is wildly non-uniform and the aggregate number hides both your best rules and your worst.",
                "Enable only the rules that clear your precision floor. Expect this to be a small minority of what the vendor ships enabled by default, and expect the vendor to tell you that you are underusing the product.",
                "Suppress by construct, not by instance. If a rule is wrong because of a framework idiom, write the suppression against the idiom so it holds for all future code, rather than dismissing findings one at a time forever.",
                "Publish the precision numbers to engineering. Saying this rule is right eighty-five percent of the time buys you enormous cooperation, because it treats engineers as adults who can price a probability.",
                "Re-measure quarterly. Codebases drift, frameworks change, and a rule that was precise last year can become a nuisance without anyone noticing."
              ]
            },
            {
              kind: "callout",
              title: "The false negative you never see",
              body: "Precision is the number you can measure, which is exactly why programmes over-optimise for it. Recall is the number that will hurt you, and you cannot measure it without a ground truth you do not have. The only practical proxies are: findings from penetration tests and bug bounty that your tools had the opportunity to catch and did not, and post-incident analysis of whether the exploited defect was in a scanned path. Track both, present both, and be extremely suspicious of any tool report that only ever discusses what was found."
            },
            {
              kind: "principle",
              title: "Trust is the scarce resource",
              body: "You can rerun a scan. You cannot rerun the moment an engineer decided your team wastes their time. Manage precision as you would manage a budget, because that is exactly what it is."
            }
          ],
          awards: ["precision-floor", "firehose-extinguisher"],
          glossary: ["precision", "recall", "shadow-mode", "suppression-by-construct", "alert-fatigue"]
        },
        {
          id: "ch-appsec-step-fuzz-lab",
          kind: "lab",
          title: "Lab: Write A Harness That Finds Something",
          statement: "Coverage-guided fuzzing is the only automated technique that reliably finds bugs nobody anticipated, and its entire effectiveness lives in the harness you write.",
          minutes: 45,
          respect: 190,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Why this technique is different in kind",
              body: "Static analysis finds patterns someone wrote a rule for. Penetration testing finds what a specific person thought to try. Coverage-guided fuzzing finds the input that nobody in the world had considered, because it is not looking for anything — it mutates inputs, watches which code paths light up, keeps the mutations that reached somewhere new, and repeats a few billion times. OSS-Fuzz has used this to find well over ten thousand vulnerabilities and tens of thousands of bugs across roughly a thousand projects. It is the closest thing our field has to a machine that manufactures unknown-unknowns on demand."
            },
            {
              kind: "code",
              title: "A Rust harness with cargo-fuzz, structured as a round-trip property",
              lang: "rust",
              body: "#![no_main]\nuse libfuzzer_sys::fuzz_target;\nuse myproto::{parse_frame, encode_frame};\n\nfuzz_target!(|data: &[u8]| {\n    let frame = match parse_frame(data) {\n        Ok(f) => f,\n        Err(_) => return,\n    };\n\n    let reencoded = encode_frame(&frame);\n    let reparsed = parse_frame(&reencoded).unwrap();\n\n    assert_eq!(frame, reparsed);\n});"
            },
            {
              kind: "prose",
              title: "Read what that harness is really doing",
              body: "It is not only looking for crashes. It asserts a property: anything that parses must re-encode and re-parse to the same value. That single assertion catches a whole family of defects a crash-only harness would sail past — length fields that are not validated against actual content, ambiguous encodings where two different byte sequences produce the same object, and integer truncation in the encoder. Parser differentials of exactly this kind have produced request smuggling, certificate confusion and authentication bypass across the industry. A harness that only checks for segfaults is leaving most of the value on the table."
            },
            {
              kind: "code",
              title: "Run it, then find out what it is not reaching",
              lang: "bash",
              body: "cargo install cargo-fuzz\ncargo fuzz init\ncargo fuzz list\n\ncargo fuzz run frame_roundtrip -- -max_total_time=600 -print_final_stats=1\n\ncargo fuzz coverage frame_roundtrip\ncargo cov -- show target/x86_64-unknown-linux-gnu/coverage/x86_64-unknown-linux-gnu/release/frame_roundtrip \\\n  --format=html --instr-profile=fuzz/coverage/frame_roundtrip/coverage.profdata \\\n  > /tmp/cov.html\n\ncargo fuzz run frame_roundtrip fuzz/artifacts/frame_roundtrip/crash-8f2a1c\ncargo fuzz tmin frame_roundtrip fuzz/artifacts/frame_roundtrip/crash-8f2a1c"
            },
            {
              kind: "checklist",
              title: "The harness quality bar — most harnesses fail here, not in the fuzzer",
              items: [
                "Seed the corpus with real valid inputs. A fuzzer starting from an empty corpus can spend days rediscovering your file format's magic bytes",
                "Disable or stub checksum validation during fuzzing, or the fuzzer will spend its entire budget failing a CRC check at byte four",
                "Remove nondeterminism — time, randomness, thread scheduling — or you get flaky crashes that nobody can reproduce and everybody learns to ignore",
                "Build with sanitizers on. Address sanitizer for spatial and temporal memory errors, undefined behaviour sanitizer for the silent ones, memory sanitizer for uninitialised reads. Without a sanitizer you only detect the crashes that were going to crash anyway",
                "Fuzz the encoder as well as the decoder. Research on bugs that survive continuous fuzzing shows encoders, writers and serialisers get dramatically less attention than parsers, and the bugs sit there for years",
                "Check coverage and be honest about it. GStreamer had been on OSS-Fuzz for seven years with two active fuzzers and roughly nineteen percent coverage. Years of fuzzing is not the same claim as fuzzed",
                "Run it continuously in CI on every commit, with the corpus persisted between runs. A fuzzer that runs once is a test; a fuzzer that runs forever is a control"
              ]
            },
            {
              kind: "callout",
              title: "What fuzzing will never give you",
              body: "It will not find your authorisation bug, because it has no concept of who should be allowed. It will not find your business logic flaw, because it does not know what the correct answer is. And it will not cover your dependencies unless they are instrumented — the case study to remember is a document viewer whose real vulnerabilities lived in an uninstrumented library that was not in OSS-Fuzz at all, while the main project sat there with a clean bill of health."
            }
          ],
          praxis: "Write a coverage-guided harness with at least one non-crash property assertion against a real parser, run it for a minimum of one hour with sanitizers enabled, and pursue any finding to a minimised reproducer.",
          evidence: "The harness source, the coverage report showing which functions were and were not reached, and either a minimised crashing input with the fix, or a written analysis of why coverage plateaued and what you changed to move it.",
          awards: ["fuzz-first-crash", "harness-writer"],
          glossary: ["coverage-guided-fuzzing", "sanitizer", "corpus", "parser-differential", "test-case-minimisation"]
        },
        {
          id: "ch-appsec-step-property-testing",
          kind: "lab",
          title: "Lab: Properties Beat Examples",
          statement: "An example test asserts what you already thought of; a property test asserts what must always be true, and then goes looking for the counterexample.",
          minutes: 38,
          respect: 175,
          trust: 8,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The shift in what you write down",
              body: "Example-based tests encode the developer's imagination, which means they encode the developer's blind spots with perfect fidelity. Property-based testing inverts this: you state an invariant and let the framework generate thousands of inputs attempting to violate it, then automatically shrink any counterexample to its minimal form. The payoff is highest exactly where security defects concentrate — parsers, serialisers, access control decisions, state machines, and anything involving canonicalisation. Property testing and fuzzing are the same idea at different levels of abstraction; property testing works on structured values and semantic invariants, fuzzing works on bytes and crashes."
            },
            {
              kind: "code",
              title: "Security properties expressed with Hypothesis",
              lang: "python",
              body: "from hypothesis import given, strategies as st, settings, assume\n\n\n@given(st.binary(max_size=4096))\n@settings(max_examples=5000)\ndef test_parse_never_raises_unexpected(data):\n    try:\n        parse_message(data)\n    except MessageError:\n        pass\n\n\n@given(st.builds(Message, header=headers(), body=st.binary(max_size=1024)))\ndef test_encode_parse_roundtrip(msg):\n    assert parse_message(encode_message(msg)) == msg\n\n\n@given(st.text(max_size=200))\ndef test_normalisation_is_idempotent(raw):\n    once = normalise_username(raw)\n    assert normalise_username(once) == once\n\n\n@given(principals(), objects())\ndef test_authorisation_is_deny_by_default(principal, obj):\n    assume(not any(g.applies(principal, obj) for g in explicit_grants()))\n    assert can_access(principal, obj) is False"
            },
            {
              kind: "prose",
              title: "The fourth test is the one to study",
              body: "Deny-by-default is usually asserted in a design document and enforced by convention. That test makes it a machine-checked property of the system: for any principal and any object, if no explicit grant applies, access is denied. When someone later adds a convenience path that returns true for internal service accounts without registering a grant, the test fails on a generated case nobody would have written by hand. That is what it looks like to turn a security principle into something the build system can enforce, and it is a far stronger control than a policy statement."
            },
            {
              kind: "list",
              title: "Properties worth stealing for security-relevant code",
              items: [
                "Round-trip: decode then encode then decode yields the same value. Catches ambiguous encodings and truncation",
                "Idempotence: normalising, canonicalising or sanitising twice equals doing it once. Catches the double-decode bugs behind a great many filter bypasses",
                "Differential: your implementation and a reference implementation agree on every input. This is how request smuggling, X.509 parsing differences and JSON parser disagreements get found",
                "Monotonicity of authority: adding a deny rule never increases access; removing a grant never increases access",
                "Invariant preservation on state machines: no sequence of legal transitions reaches a state where an invariant is false — the class that catches workflow bypass and replayable refunds",
                "Bounded resource use: no input under N bytes causes more than M allocations or K milliseconds, which is how you catch algorithmic complexity denial of service before someone else does",
                "Structural equality after redaction: a redacted log record contains no substring of any field marked sensitive, for all generated records"
              ]
            },
            {
              kind: "callout",
              title: "Make the counterexample permanent",
              body: "When a property test fails, the shrunk counterexample is the most valuable artefact the run produced. Commit it as a regression example test alongside the property, and commit it to your fuzzing corpus too. Frameworks that persist a failure database do this for you; make sure the database is in version control rather than in a developer's cache directory, or the finding evaporates the next time CI runs on a fresh container."
            }
          ],
          praxis: "Add at least four security-relevant properties to a real codebase, including one round-trip and one authorisation invariant, and commit any shrunk counterexample as a permanent regression test.",
          evidence: "The merged test file, plus the counterexample and the diff of the defect it exposed if it found one, or the coverage delta if it did not.",
          awards: ["property-thinker", "harness-writer"],
          glossary: ["property-based-testing", "shrinking", "differential-testing", "idempotence", "invariant"]
        },
        {
          id: "ch-appsec-step-pentest-drill",
          kind: "drill",
          title: "Drill: The Report Lands Two Days Before Launch",
          statement: "A penetration test report is an input to a decision, not the decision — and treating it as the decision is how security teams get removed from the process.",
          minutes: 25,
          respect: 155,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "What a report actually contains",
              body: "A typical report from a competent firm contains a handful of findings that would change your risk materially, a larger set that are real but low consequence, and a tail of informational items driven by the firm's checklist and their need to demonstrate thoroughness. The severities are assigned by someone who spent two weeks with your system and does not know which of your services holds regulated data, which is behind a mutual-TLS boundary, or which one is being decommissioned next month. Your job is not to transcribe their severities into your tracker. It is to re-rate every finding against your own environment before anyone else reads it."
            },
            {
              kind: "checklist",
              title: "The re-rating pass, before the findings leave your desk",
              items: [
                "Is the finding reproducible in the environment we are actually shipping, or only in the test instance with debug enabled",
                "Does exploitation require a precondition we already control — an authenticated session, a role, network position inside a segment",
                "What does the attacker gain, expressed as data or capability, not as a severity word",
                "Is there a compensating control already in place that the tester did not have visibility into",
                "Is this an instance of a class we can retire, in which case the class fix goes on the roadmap and the instance fix ships now",
                "Would I personally sign a statement that this finding, unfixed, is an acceptable risk for ninety days"
              ]
            },
            {
              kind: "compare",
              title: "How to read a report's severity column",
              left: {
                title: "Signals the rating is well founded",
                items: [
                  "A working reproduction with exact steps, request and response captured",
                  "The tester states what they achieved, not what could theoretically follow",
                  "Preconditions are named explicitly, including any credentials they were given",
                  "Findings are chained where chaining is the real risk, rather than listed separately to inflate the count"
                ]
              },
              right: {
                title: "Signals the rating is checklist-driven",
                items: [
                  "Severity assigned from a header or configuration name with no demonstrated impact",
                  "Findings that reference the test environment configuration rather than the shipping one",
                  "Identical wording to findings you have seen in other reports from the same firm",
                  "A high rated on the basis of defence in depth rather than an achieved outcome"
                ]
              }
            },
            {
              kind: "principle",
              title: "You own the severity in your tracker",
              body: "The assessor owns their report. You own what enters your organisation's risk record. Re-rate every finding, record both the original and your rating with the reasoning, and send the delta back to the firm. Assessors who receive calibration feedback get better; assessors whose ratings are transcribed unchallenged never do."
            }
          ],
          drill: {
            id: "ch-appsec-drill-pentest",
            scene: "Wednesday 18:00. The external assessment of the new payments integration arrives, two days before go-live. Nine findings: one critical, three high, five medium. The critical is an authentication bypass on an administrative endpoint. The three highs are a missing security header, a verbose error page, and a session cookie without the Secure attribute in the test environment. The report is already in a shared drive that the programme director can read, and she has messaged you asking whether this stops the launch.",
            clock: "40 minutes before the programme director escalates upward",
            pressure: "A shared document you do not control, an executive already reading severity labels, and a genuine critical mixed with three findings that are not.",
            prompt: "What is your move?",
            options: [
              {
                id: "ch-appsec-drill-pentest-opt-forward",
                label: "Forward the report to engineering with a note that the critical and all highs must be fixed before launch",
                detail: "Fast, defensible, and treats the assessor's severity ratings as authoritative.",
                score: -1,
                outcome: "Engineering spends the night on a cookie attribute that only applies to a test environment and a header that mitigates nothing in this architecture, while the authentication bypass gets the same attention as the noise.",
                ripple: "You have outsourced your risk judgement to a vendor who does not know your system. The next time an assessment lands, engineering discounts all of it equally — including the critical."
              },
              {
                id: "ch-appsec-drill-pentest-opt-reproduce",
                label: "Reproduce the critical yourself in the production configuration first, then send one differentiated message with your own ratings",
                detail: "Confirm the bypass, re-rate the three highs against the shipping environment, and state a launch position with reasoning.",
                score: 3,
                outcome: "The bypass reproduces and is genuinely launch-blocking; two of the three highs do not apply to the production configuration at all. You send one message: one blocker with a proposed fix and a re-test plan, two items scheduled, six informational. The director has a decision she can make.",
                ripple: "You have established that findings pass through your judgement before they reach engineering, which is the position that makes you useful rather than a router. The assessment firm also gets your re-rating feedback, and next year's report is calibrated better.",
                isBest: true
              },
              {
                id: "ch-appsec-drill-pentest-opt-delay",
                label: "Tell the director you need until Friday to analyse before giving a position",
                detail: "Do not answer under pressure with incomplete information; a considered answer is worth the wait.",
                score: -2,
                outcome: "Friday is go-live. You have converted a solvable problem into a crisis by consuming the only slack in the schedule, and the decision will now be made without you because it has to be made.",
                ripple: "Executives route around people who cannot produce a position inside the decision window. Say I have a preliminary read now and a firm one in two hours — never come back later on a question that has a deadline."
              },
              {
                id: "ch-appsec-drill-pentest-opt-mitigate",
                label: "Propose blocking the administrative endpoint at the load balancer for launch and fixing the bypass in the following sprint",
                detail: "Removes the exploitable path today with no code change and preserves the date.",
                score: 1,
                outcome: "A reasonable compensating control, and in some architectures it is the right call. But you proposed it without reproducing the finding, so you do not yet know whether the endpoint is reachable by another route, whether internal callers depend on it, or whether the bypass also affects a non-administrative path.",
                ripple: "This is the tempting one because it looks decisive and preserves the date. Proposing a mitigation before you understand the defect means that roughly a third of the time you will mitigate the symptom and ship the disease, and you will have spent your credibility asserting otherwise."
              }
            ],
            debrief: "The differentiator is the twenty minutes spent reproducing before communicating. It converts you from a conduit for someone else's opinions into the person in the organisation who knows what is true — and that is the entire basis of a CISO's authority. Notice that the fourth option and the second option can end in the same action; the difference is sequence. Mitigation proposed after reproduction is engineering. Mitigation proposed before reproduction is guessing with a confident tone, and it fails in the specific way that is hardest to recover from, because you will have publicly recommended something that turns out not to address the issue. Also note the third option: needing more time is often correct and is almost always fatal when the deadline is fixed. The professional move is to give a graded answer with an explicit confidence level and a time by which it firms up.",
            principle: "Never forward a finding you have not reproduced. The value you add is not distribution, it is verdict — and a verdict you did not verify is an opinion with your name on it."
          },
          awards: ["verdict-not-conduit", "reachability-realist"],
          glossary: ["penetration-test", "re-rating", "compensating-control", "decision-window"]
        },
        {
          id: "ch-appsec-step-continuous-fuzzing-field",
          kind: "field",
          title: "Field: Continuous Fuzzing With Honest Coverage",
          statement: "Claiming a project is fuzzed without publishing its coverage is the assurance equivalent of a green dashboard nobody validated.",
          minutes: 120,
          respect: 210,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The assignment",
              body: "Take a real open-source project that parses untrusted input — a codec, an archive format, a configuration parser, a network protocol implementation — and either onboard it to continuous fuzzing or materially improve its existing fuzzing. This is deliberately a real-world task with a real maintainer on the other end, because the human part of it is half the lesson. You will learn more about supply chain security from one conversation with an unpaid maintainer than from any framework document."
            },
            {
              kind: "numbered",
              title: "Steps",
              items: [
                "Choose a target that is genuinely reachable from untrusted input and is either not in OSS-Fuzz or is in it with visibly weak coverage. The GitHub Security Lab research on bugs that survive continuous fuzzing is a good source of the pattern to look for: few harnesses, low coverage, uninstrumented dependencies, encoders untested.",
                "Talk to the maintainer before you write anything. Ask what they would want fuzzed, whether they have capacity to receive reports, and what their disclosure preference is. Sending unrequested crash reports to a volunteer is a cost you are imposing on them.",
                "Write at least two harnesses. One on the primary parse path, one on a path that current fuzzing does not reach — an encoder, a writer, a secondary format, or a state-machine-driven path that needs a structured input grammar rather than raw bytes.",
                "Build with address sanitizer and undefined behaviour sanitizer at minimum. Seed the corpus from the project's own test data and any public sample files.",
                "Measure coverage and write it down as a number before and after. This is the deliverable that distinguishes real work from activity.",
                "Wire it to run continuously — OSS-Fuzz if the project qualifies, otherwise a scheduled workflow with a persisted corpus artefact. A fuzzer that does not run next month is a demo.",
                "Handle anything you find responsibly. Coordinate with the maintainer, agree a timeline, do not publish a working reproducer before a fix is available, and request a CVE only if the maintainer wants one — many do not, and the research literature notes that CVEs are rarely filed for OSS-Fuzz findings."
              ]
            },
            {
              kind: "callout",
              title: "The number that makes this credible",
              body: "Anyone can say they set up fuzzing. The evidence that means something is line coverage of the target module before and after, plus a named list of functions still unreached and why. That final list is the honest part, and it is the part that will make a hiring manager or a board take you seriously, because it demonstrates you understand that a control has edges."
            },
            {
              kind: "checklist",
              title: "Evidence quality bar",
              items: [
                "Harness source is merged upstream, or in a public fork with a linked pull request",
                "Coverage report published with before and after figures for the target module",
                "Explicit list of functions and code paths not covered, with the reason for each",
                "Continuous execution demonstrated — a workflow file plus at least two weeks of run history",
                "Any finding handled through coordinated disclosure with dates recorded",
                "A short written note on what the maintainer said they needed, and whether you delivered it"
              ]
            }
          ],
          praxis: "Onboard or materially improve continuous fuzzing for a real upstream project, coordinating with its maintainer throughout, and publish honest before-and-after coverage.",
          evidence: "Upstream pull request link, coverage report with before and after numbers, the uncovered-functions list with reasons, workflow run history, and the disclosure timeline for anything found.",
          awards: ["oss-contributor", "coverage-honesty", "harness-writer"],
          glossary: ["oss-fuzz", "line-coverage", "coordinated-disclosure", "corpus-persistence"]
        }
      ]
    },
    {
      id: "ch-appsec-pg-chain",
      title: "THE CHAIN",
      credential: "Certified in Software Supply Chain Integrity — StepSAFE Praxis",
      summary: "The pipeline is the crown jewel, and the industry learned this the hard way across SolarWinds, Codecov, event-stream, xz-utils, 3CX, polyfill.io and a run of GitHub Actions compromises. This Page teaches the real taxonomy of how chains break, dissects xz-utils as the definitive social-engineering case, then goes hands-on: hardening a pipeline, producing and verifying signed provenance, and stating precisely what SBOMs do and do not solve.",
      competencies: [
        "Classify a supply chain compromise by root cause and predict which defences would have stopped it",
        "Reconstruct the xz-utils operation and identify the pressure points that made it possible",
        "Harden a CI/CD pipeline against pwn requests, cache poisoning, token theft and mutable tags",
        "Produce and verify SLSA provenance and Sigstore signatures, and reach Build L3 honestly",
        "Design lockfile and pinning discipline that survives real developer workflows",
        "State the genuine value and the genuine limits of an SBOM to a regulator or customer"
      ],
      seal: "AZ-CHAIN",
      steps: [
        {
          id: "ch-appsec-step-chain-taxonomy",
          kind: "lesson",
          title: "Four Ways A Chain Breaks",
          statement: "Almost every open source compromise of the last two years reduces to phishing, a privileged automated trigger, a stolen long-lived credential, or a handover of control — and each has a different defence.",
          minutes: 30,
          respect: 120,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Why the taxonomy matters more than the incident list",
              body: "Practitioners collect incidents; professionals collect root causes. A survey of roughly twenty major open source compromises across 2024 and 2025 by Filippo Valsorda found that they cluster into a very small number of causes, which is extraordinarily good news, because it means the defensive list is short. The incidents feel varied because the payloads and blast radii differ enormously. The way in almost never does."
            },
            {
              kind: "table",
              title: "The four root causes with real examples and the defence that would have worked",
              headers: ["Root cause", "Representative incidents", "What actually stops it"],
              rows: [
                ["Phishing of a maintainer", "npm debug and chalk, eslint-config-prettier, @solana/web3.js", "Phishing-resistant authentication — passkeys or WebAuthn. Note that these succeeded despite two-factor authentication, because one-time codes are phishable and hardware-bound credentials are not"],
                ["Privileged attacker-controlled workflow trigger", "Ultralytics, spotbugs, reviewdog, Rspack, Kong Ingress Controller", "Do not use pull_request_target or issue_comment to run untrusted code with secrets. Treat any workflow that checks out fork code and holds a token as remote code execution by design"],
                ["Long-lived credential theft and reuse", "Codecov, Shai-Hulud and its successor, lottie-player", "Eliminate long-lived tokens. Short-lived OIDC federation to cloud, trusted publishing for registries, and no static registry token in any workflow"],
                ["Handover of control", "xz-utils, polyfill.io, MavenGate", "Never transfer maintainership, domains, or package ownership to parties you cannot vouch for. This is a governance control, not a technical one, which is why it keeps working on us"]
              ]
            },
            {
              kind: "timeline",
              title: "The incidents a CISO should be able to narrate from memory",
              items: [
                "2018 — event-stream. A maintainer hands the package to a helpful stranger who adds a dependency that steals cryptocurrency wallets. The original control-handover case",
                "2020 — SolarWinds. SUNSPOT watches for MsBuild, swaps a source file for a backdoored copy during compilation, and restores the original afterwards. Roughly eighteen thousand organisations receive a signed, legitimate update containing SUNBURST",
                "2021 — Codecov. A credential leaked through a Docker image layer lets an attacker modify a Bash uploader that thousands of pipelines curled and piped to a shell. Undetected from 31 January to 1 April, and found by a customer verifying a checksum",
                "2023 — 3CX. A compromised desktop application distributed to a very large enterprise customer base, notable for being a supply chain attack whose upstream was itself a supply chain attack on another vendor",
                "2024 — xz-utils, CVE-2024-3094. A multi-year persona campaign obtains maintainership and lands a backdoor in release tarballs, caught by an engineer investigating a fraction of a second of extra SSH latency",
                "2024 — polyfill.io. The domain and GitHub account are acquired, and a script embedded in well over one hundred thousand sites begins serving conditional malware to selected mobile users",
                "2025 — tj-actions/changed-files, CVE-2025-30066. Tags v1 through v45.0.7 are repointed to a single malicious commit that dumps runner memory containing secrets into public build logs across tens of thousands of repositories",
                "2025 — Shai-Hulud. The first genuinely self-replicating npm worm: steal maintainer credentials, run TruffleHog for more, republish infected versions of everything that account owns, repeat"
              ]
            },
            {
              kind: "principle",
              title: "The chain is people plus automation, and the automation is the easier target",
              body: "Every one of these incidents had a human element and an automation element. The human element is what got the attacker in. The automation element is what turned one compromised human into thousands of compromised organisations, without further effort. That multiplier is the reason supply chain attacks dominate the modern threat picture, and it is why hardening the automation gives you more leverage than hardening the humans."
            },
            {
              kind: "callout",
              title: "Where this leaves you as a consumer",
              body: "You cannot fix upstream maintainer hygiene. You can control what your build does with upstream code: pin by immutable digest, isolate the build, deny egress from build steps that do not need it, keep no long-lived secrets on runners, verify provenance before deploying, and stage rollouts so a bad artefact reaches a fraction of your fleet before a human notices. Every one of those is inside your authority today."
            }
          ],
          awards: ["chain-taxonomist"],
          glossary: ["supply-chain-compromise", "control-handoff", "phishing-resistant-auth", "trusted-publishing", "mutable-tag"]
        },
        {
          id: "ch-appsec-step-xz",
          kind: "lesson",
          title: "xz-utils: How To Buy A Maintainer",
          statement: "The most sophisticated supply chain attack yet documented did not exploit a single vulnerability; it exploited the fact that critical infrastructure is maintained by exhausted volunteers.",
          minutes: 35,
          respect: 165,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "timeline",
              title: "The operation, as reconstructed from public evidence",
              items: [
                "Early 2021 — the Jia Tan persona is created, along with several supporting accounts whose GitHub histories all begin suspiciously recently",
                "29 October 2021 — a first, entirely innocuous contribution to xz-utils: a patch touching an editorconfig file. The purpose is to exist in the commit history",
                "2022 — sockpuppet accounts including Jigar Kumar and Dennis Ens appear on the xz-devel mailing list complaining about slow releases and unresponsive maintenance, and pressing for a co-maintainer to be appointed",
                "2022 — the original maintainer, Lasse Collin, responds publicly that he has been dealing with long-term mental health issues and limited capacity. The pressure campaign continues against a person who has just disclosed vulnerability",
                "June 2022 onward — Jia Tan begins contributing at volume, eventually accumulating hundreds of commits, and is granted increasing trust and then release authority",
                "January 2024 — the first backdoor-related commit lands. Critically, the malicious build machinery is present in the release tarballs and not in the public git repository, so anyone reading GitHub sees clean code",
                "24 February 2024 — xz 5.6.0 is released. The payload hooks into the RSA key handling path reached by sshd through its systemd notification dependency on liblzma, giving remote code execution to the holder of a specific key",
                "March 2024 — pressure begins on major distributions to expedite adoption into stable releases, which is the last and most audacious step",
                "29 March 2024 — Andres Freund, investigating roughly half a second of unexplained latency in SSH logins on a Debian unstable machine, works the anomaly back to liblzma and posts to the Openwall mailing list. The operation ends"
              ]
            },
            {
              kind: "prose",
              title: "What made this different from everything before it",
              body: "The tradecraft is what earns this incident its status. The backdoor was not in the source repository, only in the distributed tarballs, defeating source review entirely. The build injection was disguised in autotools machinery that almost nobody reads. Test fixture files carried the payload, because binary blobs in a test directory attract no scrutiny. The trigger required a specific attacker-held key, so the backdoor was inert to anyone who found it and could not be used by a third party who discovered it. And the human operation ran for over two years with the patience to spend the first year building a commit history that did nothing. Assume the same operator is running the same play right now against other projects, and assume that most of those attempts will not be caught by an engineer noticing a timing anomaly on a machine that happened to matter."
            },
            {
              kind: "compare",
              title: "Defences that would have helped versus defences that would not",
              left: {
                title: "Would have mattered",
                items: [
                  "Reproducible builds — the tarball did not correspond to the git tree, and a build reproducibility check compares exactly that",
                  "Building distribution packages from version control rather than from maintainer-produced tarballs",
                  "Scrutiny of binary test fixtures added to a compression library",
                  "Reducing sshd's dependency surface, which is precisely what several distributions did afterwards",
                  "Funded maintainership, so the pressure campaign would have had no lever to pull"
                ]
              },
              right: {
                title: "Would have done nothing",
                items: [
                  "An SBOM — you would have had a perfect inventory of a component whose backdoor had no CVE and no known-bad hash at the time",
                  "Vulnerability scanning against CVE databases, since there was nothing to match until after discovery",
                  "Code review of the git repository, which was clean by design",
                  "Package signing, since the malicious tarball was signed by the legitimate release authority",
                  "SLSA build provenance at any level, because the build honestly and verifiably produced exactly what the compromised source said it should"
                ]
              }
            },
            {
              kind: "callout",
              title: "The uncomfortable conclusion",
              body: "Nearly the entire modern supply chain security stack — signing, provenance, SBOM, attestations — verifies that an artefact came from a stated source through a stated process. xz-utils passed all of that, because the stated source was compromised. Integrity controls answer did this change in transit. They do not answer was the author honest. That second question is a trust and governance problem, and it is the open frontier. Anyone selling you a tool that closes it is selling you something else."
            },
            {
              kind: "principle",
              title: "Sustained maintainer pressure is an attack indicator",
              body: "When several low-history accounts appear simultaneously to complain about release cadence and press for new maintainers, that pattern is now a recognised intrusion signature. Any project you depend on materially should be watched for it, and any project you maintain should have a written policy that maintainership is never granted under time pressure or public complaint."
            }
          ],
          awards: ["supply-chain-archaeologist", "chain-taxonomist"],
          glossary: ["control-handoff", "reproducible-builds", "release-tarball", "sockpuppet-campaign", "build-injection"]
        },
        {
          id: "ch-appsec-step-actions-hardening",
          kind: "lab",
          title: "Lab: Harden The Pipeline",
          statement: "Your CI system holds credentials to everything you own, executes arbitrary code by design, and is usually the least monitored production system in the company.",
          minutes: 50,
          respect: 195,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The three primitives an attacker needs, and how CI hands them over",
              body: "Code execution, credentials, and a path to publish. A continuous integration system offers all three by design: it runs code on every push, it holds tokens for cloud, registries and repositories, and it is the thing that produces your releases. The tj-actions compromise in March 2025 is the clearest demonstration. Tags v1 through v45.0.7 were all repointed to a single malicious commit; the injected code scanned runner memory for credentials and printed them into build logs, which on public repositories are world-readable. Tens of thousands of repositories were affected, and the entry point was one compromised personal access token belonging to a bot."
            },
            {
              kind: "code",
              title: "The dangerous pattern — and it looks completely ordinary",
              lang: "yaml",
              body: "on:\n  pull_request_target:\n    types: [opened, synchronize]\n\npermissions: write-all\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          ref: ${{ github.event.pull_request.head.sha }}\n\n      - uses: tj-actions/changed-files@v45\n\n      - run: npm ci && npm test\n        env:\n          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}\n\n      - name: comment\n        run: gh pr comment ${{ github.event.pull_request.number }} --body 'Tested ${{ github.event.pull_request.title }}'"
            },
            {
              kind: "numbered",
              title: "Everything wrong with those twenty lines",
              items: [
                "pull_request_target runs in the context of the base repository with access to secrets, and the explicit checkout of the fork head then executes attacker-controlled code with those secrets in scope. This is the pwn request pattern, and it is the second most common root cause of open source compromise in the 2024 to 2025 survey.",
                "permissions: write-all grants the workflow token far more than it needs. The default should be read-only at the repository or organisation level, with per-job elevation only where required.",
                "npm ci executes lifecycle scripts from the dependency tree of a pull request an attacker opened. Untrusted code, trusted environment.",
                "An action pinned to a mutable tag. v45 is a pointer that the upstream repository can move at any time, which is exactly what happened in CVE-2025-30066.",
                "A long-lived registry token present in a job triggered by an external contributor. There is no reason a test job needs publish credentials.",
                "Direct interpolation of the pull request title into a run block. A title containing shell metacharacters becomes command execution on the runner. Script injection through interpolated event fields is one of the most reliably present bugs in real workflow files.",
                "No egress restriction, so exfiltration is a single outbound request."
              ]
            },
            {
              kind: "code",
              title: "The hardened form",
              lang: "yaml",
              body: "on:\n  pull_request:\n    types: [opened, synchronize]\n\npermissions:\n  contents: read\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    timeout-minutes: 15\n    steps:\n      - uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8\n        with:\n          persist-credentials: false\n\n      - uses: actions/setup-node@1d0ff469b7ec7b3cb9d8673fde0c81c44821de2a\n        with:\n          node-version-file: .nvmrc\n\n      - run: npm ci --ignore-scripts\n      - run: npm test\n\n  publish:\n    needs: test\n    if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/')\n    runs-on: ubuntu-latest\n    environment: release\n    permissions:\n      contents: read\n      id-token: write\n    steps:\n      - uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8\n      - uses: actions/setup-node@1d0ff469b7ec7b3cb9d8673fde0c81c44821de2a\n        with:\n          registry-url: https://registry.npmjs.org\n      - run: npm ci --ignore-scripts\n      - run: npm publish --provenance --access public"
            },
            {
              kind: "checklist",
              title: "The pipeline hardening standard to hold every repository to",
              items: [
                "Default workflow permissions set to read-only at the organisation level, elevated per job only where genuinely needed",
                "Every third-party action pinned by full commit SHA, never by tag — and a bot that updates those SHAs so pinning does not become staleness",
                "An allowlist of permitted actions at the organisation level, so a compromised action nobody uses cannot be introduced by a single pull request",
                "No pull_request_target, no workflow_run over untrusted refs, no issue_comment triggers that check out or execute fork content. If you believe you need one, you need a different design",
                "Never interpolate event-controlled fields directly into run blocks. Pass them through the env context and reference the environment variable, which is not evaluated by the shell as code",
                "Zero long-lived cloud credentials — OIDC federation with a trust policy scoped to the specific repository, ref and environment, not to the whole organisation",
                "Registry publishing through trusted publishing or OIDC, and provenance generated at publish time",
                "Publish jobs isolated in a protected environment with required reviewers, separate from any job that ever runs contributor code",
                "Lifecycle and post-install scripts disabled by default in continuous integration",
                "Egress from build steps restricted to an allowlist, so exfiltration requires more than one outbound call",
                "Build logs treated as public even when they are private, because that assumption is the only one that survives a misconfiguration",
                "Cache scoping understood — caches are shared across a trust boundary between a fork branch and the base branch, and cache poisoning has been the pivot in multiple real compromises"
              ]
            },
            {
              kind: "callout",
              title: "The OIDC trust policy mistake everyone makes",
              body: "Teams correctly replace static cloud keys with OIDC federation, then write a trust policy whose subject condition matches the whole organisation. Any repository in that organisation — including a brand new one created by an intern, or a fork workflow that runs in your context — can then assume the role. Scope the subject to repository, ref and environment. Then go and read the policies you wrote last year, because this specific error is close to universal on first implementation."
            }
          ],
          praxis: "Audit every workflow in one real repository against the hardening standard, then land the fixes: SHA pinning, minimal permissions, removal of privileged triggers, and OIDC with a correctly scoped trust policy.",
          evidence: "The merged workflow diffs, a screenshot or export of organisation-level default permissions and the allowed-actions policy, and the OIDC trust policy with its subject condition visible.",
          awards: ["pipeline-locksmith", "sha-pinner"],
          glossary: ["pwn-request", "sha-pinning", "oidc-federation", "cache-poisoning", "script-injection", "trusted-publishing"]
        },
        {
          id: "ch-appsec-step-sign-attest-verify",
          kind: "lab",
          title: "Lab: Sign, Attest, Verify",
          statement: "An artefact you cannot trace back to a specific commit built by a specific workflow is an artefact you are choosing to trust on faith.",
          minutes: 45,
          respect: 190,
          trust: 10,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "What each layer actually buys you",
              body: "Signing answers who vouched for these bytes. Provenance answers what source and what process produced them. Verification is where both become a control rather than metadata — and the near-universal failure is generating attestations that nothing ever checks. Sigstore removes the hardest operational obstacle by making signing keyless: an ephemeral key is generated per signature, Fulcio issues a short-lived certificate binding it to an OIDC identity such as a specific workflow, the signing event is recorded in the Rekor transparency log, and the private key is discarded. There is no long-lived signing key to steal, which eliminates an entire category of incident."
            },
            {
              kind: "code",
              title: "Produce a signed artefact with attestations in CI",
              lang: "bash",
              body: "cosign sign --yes ghcr.io/acme/api@sha256:9c2ba1...\n\nsyft ghcr.io/acme/api@sha256:9c2ba1... -o spdx-json > sbom.spdx.json\ncosign attest --yes --predicate sbom.spdx.json \\\n  --type spdxjson ghcr.io/acme/api@sha256:9c2ba1...\n\ncosign attest --yes --predicate provenance.json \\\n  --type slsaprovenance1 ghcr.io/acme/api@sha256:9c2ba1..."
            },
            {
              kind: "code",
              title: "The verification that makes it a control",
              lang: "bash",
              body: "cosign verify ghcr.io/acme/api@sha256:9c2ba1... \\\n  --certificate-identity-regexp 'https://github.com/acme/api/.github/workflows/release.yml@refs/tags/.*' \\\n  --certificate-oidc-issuer https://token.actions.githubusercontent.com\n\ncosign verify-attestation ghcr.io/acme/api@sha256:9c2ba1... \\\n  --type slsaprovenance1 \\\n  --certificate-identity-regexp 'https://github.com/acme/api/.github/workflows/release.yml@refs/tags/.*' \\\n  --certificate-oidc-issuer https://token.actions.githubusercontent.com \\\n  --policy policy.rego"
            },
            {
              kind: "prose",
              title: "The identity flags are the whole control",
              body: "Running cosign verify without certificate-identity and certificate-oidc-issuer proves only that somebody signed this, which is worth almost nothing — anyone with a GitHub account can sign anything. The security property comes entirely from asserting which identity must have signed. Pin the identity to the exact workflow file, in the exact repository, triggered from a tag ref. Then a compromised developer laptop cannot produce an artefact your admission controller will accept, because the laptop cannot obtain that workflow identity."
            },
            {
              kind: "table",
              title: "SLSA Build track, and what each level genuinely defends against",
              headers: ["Level", "Requirement", "Attack it stops", "Attack it does not stop"],
              rows: [
                ["L0", "Nothing", "Nothing", "Everything"],
                ["L1", "Provenance exists and is distributed, possibly unsigned", "Honest mistakes and accidental drift about what was built", "Any deliberate attacker — L1 provenance is trivial to forge"],
                ["L2", "Provenance signed by a hosted build platform, consumer validates it", "Tampering with the artefact after the build", "Tampering during the build, or a malicious build step reading the signing key"],
                ["L3", "Hardened platform, builds isolated from one another, signing material unreachable by user-defined build steps", "Tampering during the build by insiders, stolen credentials or other tenants — the SUNSPOT scenario", "A compromised source repository. SLSA verifies process integrity, not authorial intent — the xz-utils gap"]
              ]
            },
            {
              kind: "callout",
              title: "Verification without enforcement is documentation",
              body: "The step that separates real programmes from theatre is a policy engine in the admission path that refuses to run an unverified image. Do it in staging first with a report-only mode, measure how many workloads would break, fix those, then enforce. If you enforce before measuring you will cause an outage and lose the mandate. If you never enforce at all you have built an expensive metadata pipeline whose only consumer is an auditor."
            }
          ],
          praxis: "Take one real service from unsigned to signed with SBOM and SLSA provenance attestations, and stand up verification that fails closed in at least one environment.",
          evidence: "The cosign verify output showing certificate identity and issuer, the admission policy that enforces it, and a demonstration of a deliberately unsigned image being rejected.",
          awards: ["attestation-verified", "signed-and-sealed", "slsa-level-three"],
          glossary: ["sigstore", "fulcio", "rekor", "slsa-build-level", "in-toto-attestation", "admission-control"]
        },
        {
          id: "ch-appsec-step-tag-drill",
          kind: "drill",
          title: "Drill: The Tag Moved Last Night",
          statement: "When a dependency you have used for years turns hostile, your first decision is about secrets, not about code.",
          minutes: 28,
          respect: 180,
          trust: 9,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The pattern to internalise",
              body: "A git tag is a mutable pointer. The upstream owner can move v45 to any commit at any time, and every pipeline that references v45 will silently pick up the new code on its next run. In March 2025 this happened to tj-actions/changed-files: an attacker with a compromised personal access token repointed tags v1 through v45.0.7 at one malicious commit that scanned runner process memory for credentials and wrote them into build logs. On public repositories those logs are readable by anyone. CISA issued an alert covering that compromise and a related one in reviewdog/action-setup."
            },
            {
              kind: "metric",
              title: "What you need on hand before this happens to you",
              body: "None of these can be assembled during the incident. Build them now.",
              items: [
                "A queryable inventory of every third-party action, package and container base image used by any pipeline you own, with the ref each one is pinned to",
                "Build log retention and the ability to search logs across all repositories for a string",
                "A rotation runbook per secret type with a measured completion time, because the answer to how long does full rotation take must not be a guess",
                "Knowledge of which repositories are public, which is where a log-exfiltration incident becomes a disclosure"
              ]
            },
            {
              kind: "numbered",
              title: "Secret rotation order, because you will not be able to do them all at once",
              items: [
                "Anything that grants publish rights to a package or image registry. A stolen publish token turns your incident into everyone else's incident, and that is the transition you must prevent at any cost.",
                "Cloud credentials with write access, especially any role that can modify identity and access policy, because that is how a stolen key becomes persistent access.",
                "Source control tokens with write scope, which can be used to modify workflows and re-establish the foothold you are currently removing.",
                "Signing keys and anything that authenticates your artefacts to consumers.",
                "Read-only credentials and third-party service tokens, which matter but do not compound.",
                "After each rotation, verify the old credential is actually dead rather than merely replaced. Many systems accept both until the old one is explicitly revoked, and a rotation that leaves the old key valid has achieved nothing."
              ]
            },
            {
              kind: "principle",
              title: "Pinning is not a fix if the pin is never updated",
              body: "SHA pinning eliminates the mutable tag problem and creates a staleness problem in its place. That trade is correct, but only if you also run automated pin updates with review. Teams that pin and then stop updating are running two-year-old actions with their own unpatched flaws, and they have swapped a fast-moving risk for a slow-moving one without noticing."
            }
          ],
          drill: {
            id: "ch-appsec-drill-tag-move",
            scene: "Saturday 07:20. A security researcher publishes that a widely used GitHub Action was compromised: all version tags were repointed at a malicious commit that dumps runner memory into build logs. The window given is roughly the last thirty-six hours. Your inventory says one hundred and forty of your repositories reference that action, eleven of them public. Your on-call platform engineer is awake and asking what to do first. Legal is not yet awake.",
            clock: "The exploitation window is already closed but the exposure window is not",
            pressure: "One hundred and forty repositories, eleven public, a rotation runbook nobody has timed, and a weekend.",
            prompt: "What is the first action you direct?",
            options: [
              {
                id: "ch-appsec-drill-tag-opt-pin",
                label: "Push a change across all one hundred and forty repositories pinning the action to a known-good commit SHA",
                detail: "Stops any further execution of the malicious code immediately and fixes the underlying weakness.",
                score: 0,
                outcome: "Correct as a remediation and wrong as a first action. Pinning stops future exposure but does nothing about the credentials that were already printed into logs during the window, some of which are in public repositories and may already have been harvested.",
                ripple: "You will get to this within the hour and you should. Doing it first means the first ninety minutes of the incident were spent on the future rather than on the live exposure."
              },
              {
                id: "ch-appsec-drill-tag-opt-triage-rotate",
                label: "Determine which of the one hundred and forty actually ran in the window, prioritise the public ones, and start rotating every secret those workflows could reach",
                detail: "Exposure first, then containment, then remediation. Public repositories first because their logs are world-readable.",
                score: 3,
                outcome: "Thirty-one repositories ran the action in the window, four of them public. You rotate those four repositories' secrets within the first hour, the remaining twenty-seven by early afternoon, and pin all one hundred and forty in a single automated change once rotation is underway.",
                ripple: "The rotation runbook gets timed under real conditions for the first time and you discover two secret types with no documented rotation path. That discovery is worth more than the incident cost, and it becomes a funded project on Monday.",
                isBest: true
              },
              {
                id: "ch-appsec-drill-tag-opt-delete-logs",
                label: "Delete the build logs from the affected public repositories immediately to remove the exposed secrets",
                detail: "Removes the credentials from public view within minutes with no code change.",
                score: -2,
                outcome: "The logs have been publicly readable for up to thirty-six hours and have almost certainly been scraped — mass collection of public build logs began within hours of the disclosure. You have destroyed your own forensic record while achieving essentially nothing defensively.",
                ripple: "You now cannot determine which secrets were exposed, which means you must rotate everything blindly, and you cannot answer a regulator's question about scope. Deleting evidence also looks exactly like what it looks like."
              },
              {
                id: "ch-appsec-drill-tag-opt-scan",
                label: "Run a repository-wide scan for the attacker's known indicators and respond only where they are found",
                detail: "Targeted, evidence-driven, avoids the cost and disruption of rotating credentials that were never exposed.",
                score: -1,
                outcome: "Indicator-based scoping is the right instinct in many incidents and it is genuinely tempting here. It fails because the published indicators cover the variants observed so far — one version printed to logs, another posted to an external endpoint — and you have no assurance the list is complete for the whole window.",
                ripple: "Scoping an incident to the indicators that happen to have been published is how partially-contained incidents recur three weeks later. Use indicators to prioritise, never to exonerate."
              }
            ],
            debrief: "The ordering principle is exposure, containment, remediation. Rotation is exposure work: the secrets are already out, and every minute they remain valid is a minute an automated harvester can use them. Pinning is remediation: important, permanent, and not urgent in the first hour. Log deletion is neither, and it costs you your forensic record. The fourth option is the most instructive wrong answer because indicator-driven scoping is a legitimate and often correct technique — its failure here is specific. Published indicators from a fast-moving disclosure are a lower bound on attacker behaviour, never an upper bound, and you were told there were at least two payload variants. The real lesson lands afterwards: everything that made the best answer possible was built before Saturday. The inventory, the log search, the rotation runbook. During an incident you do not rise to the occasion, you fall to the level of your preparation.",
            principle: "In a credential exposure incident, rotate before you remediate. The vulnerability can wait an hour; a live credential cannot."
          },
          awards: ["rotation-under-fire", "pipeline-locksmith"],
          glossary: ["mutable-tag", "credential-rotation", "indicator-of-compromise", "exposure-window", "forensic-record"]
        },
        {
          id: "ch-appsec-step-sbom-truth",
          kind: "lesson",
          title: "What An SBOM Solves, And What It Does Not",
          statement: "An SBOM is an inventory, and an inventory is enormously valuable on exactly one kind of day and largely inert on every other.",
          minutes: 26,
          respect: 115,
          trust: 5,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "Start with the day it works",
              body: "December 2021, Log4Shell. The organisations that answered do we ship Log4j and where in under an hour did so because they had a machine-readable inventory of components per artefact. The organisations that took three weeks spent those weeks emailing team leads. That gap is the entire business case for SBOM, and it is a genuinely strong one. It is a case about response time to a newly disclosed vulnerability in a known component, and it is worth the investment on that basis alone. What follows is not an argument against SBOMs. It is an argument against the claims made about them."
            },
            {
              kind: "compare",
              title: "The honest ledger",
              left: {
                title: "What an SBOM genuinely gives you",
                items: [
                  "Sub-hour answers to which artefacts contain component X, at any depth",
                  "A basis for licence compliance, which is often what actually funds the programme",
                  "Detection of unmaintained and end-of-life components before they become incidents",
                  "Contractual and regulatory evidence that increasingly customers and governments simply require",
                  "A diff between what you thought you shipped and what you shipped, which is frequently the most surprising output of the first run"
                ]
              },
              right: {
                title: "What it does not give you",
                items: [
                  "Any indication of whether a listed vulnerable function is reachable or callable in your build",
                  "Any protection from malicious code that has no CVE — which covers xz-utils, event-stream, Shai-Hulud and every typosquat",
                  "Any assurance the SBOM matches the artefact, unless it is generated at build time from the build and cryptographically bound to the artefact digest",
                  "Visibility into vendored, statically linked, or code-generated components that most generators miss",
                  "Coverage of the build-time supply chain — the actions, plugins and toolchain that never appear in the runtime component list, which is where several of the largest recent compromises actually happened"
                ]
              }
            },
            {
              kind: "table",
              title: "Practical format guidance",
              headers: ["Consideration", "SPDX", "CycloneDX"],
              rows: [
                ["Origin and orientation", "ISO-standardised, originally licence-compliance oriented, now broad", "OWASP project, originally security oriented"],
                ["Where it tends to be demanded", "Government and large enterprise procurement", "Security tooling and vulnerability workflows"],
                ["Beyond components", "Strong relationship modelling between elements", "Native support for vulnerability, service and formulation data"],
                ["Practical advice", "Generate both from the same build if a customer demands one and your tooling prefers the other", "Never hand-author either; generate at build time from the build itself"]
              ]
            },
            {
              kind: "principle",
              title: "An SBOM produced after the fact is a guess with a schema",
              body: "Scanning a finished container to infer its contents is inference. Emitting the component list from the build system that resolved the dependencies is fact. Generate at build time, sign it, attest it against the artefact digest, and store it where an incident responder can query it at three in the morning without asking anyone for access."
            },
            {
              kind: "callout",
              title: "The question to ask when someone mandates SBOMs",
              body: "Ask what decision the SBOM will change. If the answer is we will know faster during the next Log4Shell, fund it immediately. If the answer is we will know our software is secure, correct the record gently and in writing, because that misunderstanding will eventually become someone's assurance statement to a customer, and you do not want your name near it."
            }
          ],
          awards: ["sbom-truth-teller"],
          glossary: ["sbom", "spdx", "cyclonedx", "transitive-dependency", "vendored-code"]
        }
      ]
    },
    {
      id: "ch-appsec-pg-triage",
      title: "THE TRIAGE FLOOR",
      credential: "Certified in Risk-Based Vulnerability Management — StepSAFE Praxis",
      summary: "The scanner is not the problem; the absence of a defensible decision function is. This Page builds a prioritisation model on the three signals that actually predict harm — known exploitation, exploit probability, and reachability — then designs service levels that survive audit, teaches the discipline of a documented and accountable no, and ends in the boardroom where all of it has to be explained to people who will only ever hear the headline.",
      competencies: [
        "Distinguish severity, exploitability and priority, and explain the difference to a non-technical executive",
        "Combine KEV, EPSS and reachability into a decision function that is auditable and defensible",
        "Design remediation service levels that account for both risk and engineering capacity",
        "Decline a finding in writing with reasoning that survives a post-incident review",
        "Publish a vulnerability management standard with enforcement, exceptions and evidence",
        "Answer a board question about exposure without false comfort, jargon, or theatre"
      ],
      seal: "AZ-TRIAGE",
      steps: [
        {
          id: "ch-appsec-step-severity-priority",
          kind: "construct",
          title: "Severity Is Not Priority",
          statement: "CVSS describes the bug in the abstract; priority is a statement about your system, your adversaries and your capacity, and only you can make it.",
          minutes: 20,
          respect: 90,
          trust: 3,
          mode: "novus",
          blocks: [
            {
              kind: "prose",
              title: "What CVSS is and what it was never for",
              body: "CVSS base score measures intrinsic characteristics of a vulnerability assuming a reasonable worst case, deliberately excluding your environment. Its own specification says this. It is a useful common language for describing how bad a bug could be. It was never designed as a work queue, and using it as one produces a queue sorted by a number that is uncorrelated with harm — most CVSS 9.8 vulnerabilities are never exploited by anyone, and some of the most damaging real-world exploitation involves medium-scored bugs chained together."
            },
            {
              kind: "principle",
              title: "The three-variable decomposition",
              body: "Priority equals severity multiplied by likelihood multiplied by exposure. Severity is CVSS, and you get it for free. Likelihood is KEV plus EPSS plus threat intelligence about who targets your sector. Exposure is reachability, internet accessibility, data sensitivity and blast radius, and it is the only one of the three that nobody outside your organisation can compute. That is why exposure is where your effort belongs — the other two arrive as feeds."
            },
            {
              kind: "table",
              title: "Four findings that a CVSS-sorted queue gets exactly backwards",
              headers: ["Finding", "CVSS", "Exploitation signal", "Reachability", "Correct priority"],
              rows: [
                ["Deserialization RCE in a library present but never called", "9.8", "No public exploit", "Function not reachable from any entrypoint", "Backlog, patch on the normal cycle"],
                ["Auth bypass in an internet-facing edge appliance", "7.5", "On KEV, mass-exploited", "Internet-facing by definition", "Emergency change tonight"],
                ["Path traversal in a build-time-only tool", "9.1", "Public proof of concept exists", "Never processes untrusted input", "Low, fix when convenient"],
                ["Session fixation in your own customer portal", "6.5", "No CVE, found by pentest", "Reachable, holds regulated data", "High — and no external feed will ever tell you this"]
              ]
            },
            {
              kind: "callout",
              title: "The fourth row is the one that matters",
              body: "It has no CVE, no CVSS from a vendor, no EPSS score and no KEV entry, and it is the finding most likely to actually be used against you, because it is specific to your application and therefore attracts a targeted attacker rather than a mass scanner. A vulnerability management programme that only manages things with CVE numbers is managing the part of the problem that came with a label attached."
            }
          ],
          awards: ["priority-not-severity"],
          glossary: ["cvss", "exploitability", "blast-radius", "exposure", "risk-based-prioritisation"]
        },
        {
          id: "ch-appsec-step-kev-epss-reach",
          kind: "lesson",
          title: "KEV, EPSS And Reachability: A Working Decision Function",
          statement: "Three cheap signals, combined in the right order, will cut your remediation workload by an order of magnitude without increasing your risk.",
          minutes: 32,
          respect: 165,
          trust: 7,
          mode: "both",
          blocks: [
            {
              kind: "table",
              title: "What each signal is, precisely",
              headers: ["Signal", "What it actually asserts", "Correct use", "Common misuse"],
              rows: [
                ["CISA KEV", "This CVE has reliable evidence of active exploitation in the wild, a CVE ID, and a clear remediation action", "Non-negotiable escalation trigger. If it is on KEV and you run it, you fix it", "Treating absence from KEV as evidence of safety. KEV is a record of the observed past, not a forecast"],
                ["EPSS", "Probability that this CVE will be exploited in the wild within the next thirty days, refreshed daily, at population level", "Ranking the enormous middle of the queue that KEV does not cover", "Reading it as the probability that you specifically will be attacked. It knows nothing about your environment"],
                ["Reachability", "Is the vulnerable function actually callable from an entrypoint in this build", "Deleting the large majority of transitive dependency findings from the queue with justification", "Trusting a call-graph analysis over dynamic dispatch, reflection, or configuration-driven loading without saying so"],
                ["Exposure and sensitivity", "Is it internet-facing, what data does it touch, what does compromise reach next", "The multiplier on everything else, and the only input you own entirely", "Leaving it implicit in someone's head rather than encoded in the asset inventory"]
              ]
            },
            {
              kind: "prose",
              title: "The effort argument, stated carefully",
              body: "Published research on EPSS demonstrates substantially better efficiency and coverage than CVSS-based prioritisation — that is, a higher proportion of what you prioritise turns out to be exploited, and a higher proportion of what is exploited turns out to have been prioritised. Independent analyses of EPSS version 4 report remediation effort reductions of roughly an order of magnitude against a CVSS-seven-and-above policy at comparable coverage. Do not quote a specific multiplier as if it applies to your estate; the honest framing to an executive is that switching from severity-based to exploitation-based prioritisation lets you cover the same real risk with dramatically less engineering time, and that the published evidence supports the direction strongly."
            },
            {
              kind: "numbered",
              title: "The decision function, in evaluation order",
              items: [
                "Is it on KEV and present in your estate? Emergency path. No further analysis, no debate about reachability — active exploitation means the theoretical questions are already settled.",
                "Is it internet-facing with a known public exploit? Emergency path. The gap between public exploit and mass scanning is now measured in hours, not weeks.",
                "Is the vulnerable code reachable from an entrypoint in this build? If not, drop to the lowest tier with the reachability evidence recorded. This step removes the majority of a typical SCA queue and it is the single highest-leverage filter you have.",
                "Is EPSS above your escalation threshold — many teams use something in the region of one to ten percent, calibrated against their own capacity? If yes, standard remediation service level.",
                "Everything remaining goes into the routine dependency update cycle, which should be automated and continuous rather than ticket-driven.",
                "Overlay sensitivity: any finding on a system holding regulated data or holding credentials to other systems moves up one tier automatically, regardless of the above."
              ]
            },
            {
              kind: "metric",
              title: "What to instrument",
              body: "These are the numbers that let you defend the model when it is challenged, which it will be, most likely after an incident.",
              items: [
                "Percentage of exploited-in-the-wild vulnerabilities affecting you that your model had escalated before exploitation began — your coverage, and the number that matters most",
                "Percentage of escalated findings that were ever weaponised anywhere — your efficiency, and the number that protects your engineers' time",
                "Median time from disclosure to decision, separately from time to fix",
                "Reachability filter rate, with a periodic manual audit of a sample of dropped findings to confirm the analysis was right",
                "KEV backlog age — this should be near zero, and if it is not, that single number is your most important remediation metric"
              ]
            },
            {
              kind: "callout",
              title: "The reachability caveat you must state out loud",
              body: "Reachability analysis is the most powerful filter in the model and it is not sound. Reflection, dynamic dispatch, deserialization, configuration-driven class loading, native calls and plugin architectures all break static call-graph analysis, generally in the unsafe direction. Use it aggressively for prioritisation, never as a basis for asserting that you are not vulnerable, and never apply it at all to a KEV-listed finding."
            }
          ],
          awards: ["reachability-realist", "triage-surgeon"],
          glossary: ["kev", "epss", "reachability-analysis", "coverage-and-efficiency", "call-graph"]
        },
        {
          id: "ch-appsec-step-triage-drill",
          kind: "drill",
          title: "Drill: The 9.8 And The 6.5",
          statement: "The moment you have capacity for one of two vulnerabilities is the moment your prioritisation model is either real or decorative.",
          minutes: 25,
          respect: 170,
          trust: 8,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "Setting up the constraint",
              body: "Real prioritisation decisions are never between fixing something and fixing nothing. They are between two things, with one team, one change window, and a regulator or customer who will later read whichever choice you made. The drill below is constructed so that the higher CVSS score is the wrong answer and the reasoning is available to anyone who looks at the right signals."
            },
            {
              kind: "checklist",
              title: "The questions that resolve almost every triage argument",
              items: [
                "Is it on KEV",
                "Is there a public working exploit, and how old is it",
                "Is the vulnerable path reachable from an entrypoint in this build",
                "Is the affected system internet-facing",
                "What does compromise of this system reach next",
                "What data does it hold, and does a breach here trigger a notification obligation",
                "What is the cost and risk of the fix itself"
              ]
            },
            {
              kind: "table",
              title: "Where each signal comes from and how fast you can get it",
              headers: ["Signal", "Source", "Time to obtain", "Who owns it"],
              rows: [
                ["KEV listing", "CISA catalog, machine-readable feed", "Seconds, if you ingest it", "Automate it — nobody should be checking a website"],
                ["Exploitation probability", "EPSS daily scores from FIRST", "Seconds", "Automate, and pin the threshold in your standard so it is not renegotiated per finding"],
                ["Public exploit availability", "Advisories, exploit databases, threat intel feeds", "Minutes to hours", "Analyst judgement, because exploit quality varies enormously"],
                ["Reachability", "Call-graph analysis over your own build", "Minutes if instrumented, days if not", "Engineering, and it must be built before you need it"],
                ["Exposure and data sensitivity", "Your asset inventory", "Instant or never", "You. No vendor can supply this, and its absence is why most triage stalls"]
              ]
            },
            {
              kind: "principle",
              title: "The instruction from above is data, not a decision",
              body: "When a senior person has already directed a course of action based on a partial signal, your job is not to comply and not to overrule. It is to supply the signal they did not have, in writing, with a recommendation attached. Most reversals happen quietly and immediately once the missing evidence is on the table, and the ones that do not are now their documented decision rather than your undocumented capitulation."
            }
          ],
          drill: {
            id: "ch-appsec-drill-nine-eight",
            scene: "Tuesday 11:00. Two findings, one platform team, one change window on Thursday night. Finding A is CVSS 9.8, remote code execution in a serialisation library used by your internal analytics service, EPSS in the low single-digit percentiles, no public exploit, not on KEV, and your reachability tooling reports the vulnerable function is not called. Finding B is CVSS 6.5, an authentication weakness in the internet-facing VPN appliance that terminates access for four thousand remote staff, added to CISA KEV yesterday, with a working exploit circulating. The infrastructure director has already told the team to start on the 9.8 because it is the critical.",
            clock: "Thursday night change window, one team",
            pressure: "A director who has already given an instruction based on a number that is genuinely on the advisory.",
            prompt: "What do you do?",
            options: [
              {
                id: "ch-appsec-drill-nine-eight-opt-follow",
                label: "Let the team proceed with the 9.8 and schedule the VPN appliance for the following window",
                detail: "The director has decided, the score supports it, and overturning a director's technical instruction costs political capital.",
                score: -3,
                outcome: "The VPN appliance is on KEV with a working exploit and terminates access for the whole remote workforce. Mass exploitation of edge access appliances typically begins within days of a working exploit circulating. You have deferred the one finding with confirmed active exploitation.",
                ripple: "If this is exploited, the post-incident review will show that the information required to make the right call was on your desk and you deferred to seniority. That is the single worst position a security leader can be in, and it ends careers more often than technical error does."
              },
              {
                id: "ch-appsec-drill-nine-eight-opt-both",
                label: "Demand both be fixed in Thursday's window",
                detail: "Refuse the false choice, escalate for more resources, do not let a capacity constraint dictate a risk decision.",
                score: -1,
                outcome: "The team attempts both, the appliance upgrade overruns because it requires a firmware step and a reboot of the access path for four thousand people, and neither change completes cleanly. Thursday night becomes an availability incident.",
                ripple: "Refusing to prioritise is not rigour, it is abdication dressed as it. The organisation had one team and you knew that. Someone will now do the prioritisation for you, under worse conditions and without your input."
              },
              {
                id: "ch-appsec-drill-nine-eight-opt-kev",
                label: "Reprioritise to the VPN appliance with a one-page written rationale, and put the 9.8 on the normal cycle with its reachability evidence attached",
                detail: "KEV plus internet-facing plus working exploit outranks a higher score with no exploitation signal and no reachable path.",
                score: 3,
                outcome: "The appliance is patched Thursday. The 9.8 goes into the standard cycle two weeks later with the reachability analysis recorded, which is also what you would show an auditor who asks why a critical waited.",
                ripple: "The written rationale is the durable artefact. It shows the director you are applying a model rather than an opinion, and the next time this arises he applies it himself. You have distributed a decision function instead of winning an argument.",
                isBest: true
              },
              {
                id: "ch-appsec-drill-nine-eight-opt-compensate",
                label: "Fix the 9.8 as instructed and place compensating controls in front of the VPN appliance — geofencing, tightened conditional access, enhanced monitoring",
                detail: "Respects the director's decision, reduces the appliance risk immediately, avoids a confrontation about seniority.",
                score: 0,
                outcome: "The compensating controls are real and genuinely reduce risk — geofencing and conditional access do defeat a meaningful share of opportunistic exploitation. But the appliance remains exploitable by anyone who is in-region or using a compromised endpoint, and the vulnerability is under active exploitation right now.",
                ripple: "This is the most tempting option because it is technically competent and politically frictionless, and it is the one experienced people choose when they do not want the conversation. It converts a clear prioritisation decision into a permanent compensating control, and it teaches the organisation that KEV status is negotiable if you are willing to add monitoring."
              }
            ],
            debrief: "The core discipline is that active exploitation dominates theoretical severity, always, without exception. KEV exists precisely to be that trump card, and a prioritisation model that can be overridden by a higher score with no exploitation signal is not a model. Two subtleties are worth extracting. First, the fourth option is the trap experienced practitioners fall into: compensating controls are a legitimate tool and a poor substitute for fixing a vulnerability under active exploitation, and choosing them to avoid a conversation with a director is a political decision wearing technical clothes. Second, the winning answer includes a written rationale, which is not bureaucracy — it is the artefact that converts a single correct decision into an organisational capability, and it is also the document that protects you and your team if the deferred finding is later exploited. Write the rationale before the change window, not after the incident.",
            principle: "Confirmed exploitation outranks theoretical severity. When the two conflict, follow the evidence of what attackers are actually doing, and write down why."
          },
          awards: ["triage-surgeon", "kev-first"],
          glossary: ["kev", "epss", "compensating-control", "change-window", "written-rationale"]
        },
        {
          id: "ch-appsec-step-saying-no",
          kind: "council",
          title: "Council: How To Say No To A Scanner Report",
          statement: "A no you can defend in writing is a security control; a no delivered verbally in a meeting is a liability with your name on it.",
          minutes: 30,
          respect: 175,
          trust: 9,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "Why this is a leadership skill and not a technical one",
              body: "Most vulnerability management programmes have no functioning decline path. Findings can be fixed or they can rot, and rotting is unowned, undocumented and invisible until an auditor or an incident finds it. That is the worst of all worlds: you carry the risk without having decided to, and you have no record of reasoning if it goes wrong. A programme with an explicit, accountable, documented decline is strictly safer than one without, even though it feels more exposed — because the alternative is not that nothing was declined. The alternative is that everything was declined by default, silently, by people with no authority to do so."
            },
            {
              kind: "numbered",
              title: "The anatomy of a defensible decline",
              items: [
                "State the finding precisely, including the identifier, the affected component and version, and the asserted impact in the reporter's own terms. Never paraphrase the claim you are about to reject.",
                "State what you verified and how, with evidence. Not we assessed it as low — the vulnerable method is not reachable from any entrypoint, per call-graph analysis dated the fourteenth, output attached, plus manual confirmation that no reflection or configuration-driven loading path reaches it.",
                "State the conditions that would change the decision. If this component is exposed to untrusted input, or if this CVE is added to KEV, or if a public exploit appears, this decline is void and the finding returns at high priority. This is the clause that makes a decline safe rather than permanent.",
                "Name the accepter. A specific human with the authority to accept this risk on behalf of the organisation, which is often the service owner rather than you. Security advises on risk; the business owns it. Never accept risk on behalf of a business unit you do not run.",
                "Set an expiry. Ninety or one hundred and eighty days, after which it must be re-argued. Environments change and a decline based on a fact that has since become false is worse than no decline at all.",
                "Publish it where the next person will find it — attached to the finding, in the asset record, and searchable. A decline nobody can find will be rediscovered, re-argued, and eventually reversed by someone with less context."
              ]
            },
            {
              kind: "compare",
              title: "Two declines, same finding",
              left: {
                title: "The one that will not survive",
                items: [
                  "Assessed as low risk in our environment",
                  "Mitigated by existing controls",
                  "Not applicable",
                  "Accepted by security",
                  "No expiry, no conditions, no named human"
                ]
              },
              right: {
                title: "The one that holds up",
                items: [
                  "CVE identifier, component, version, and the reporter's impact claim quoted",
                  "Reachability evidence attached, with the analysis method and its known limits stated",
                  "Explicit reversal conditions including KEV listing and public exploit availability",
                  "Named accepter with role, plus the security adviser who prepared the analysis",
                  "Expiry date and a calendar entry that actually fires"
                ]
              }
            },
            {
              kind: "callout",
              title: "When you must not decline",
              body: "Never decline a KEV-listed finding on a system you operate. Never decline on the basis of reachability analysis alone for anything internet-facing. Never decline a finding whose reporter you have not spoken to, because half the time they know something the report does not contain. And never decline because remediation is expensive — that is a legitimate input to a business risk acceptance made by the business, and it is never a security conclusion."
            },
            {
              kind: "principle",
              title: "The reviewer of your no is not the auditor",
              body: "Write every decline as though it will be read aloud in a post-incident review by someone hostile who knows how the story ends. If it survives that reading, it is a decision. If it does not, it was a shortcut and you should go and do the work."
            }
          ],
          awards: ["the-quiet-no", "triage-surgeon"],
          glossary: ["risk-acceptance", "decline-record", "reversal-condition", "named-accepter", "expiry-review"]
        },
        {
          id: "ch-appsec-step-vm-standard-field",
          kind: "field",
          title: "Field: Publish A Standard With Teeth",
          statement: "A vulnerability management standard that does not specify enforcement, exceptions and evidence is a wish list with a document number.",
          minutes: 100,
          respect: 205,
          trust: 12,
          mode: "motus",
          blocks: [
            {
              kind: "prose",
              title: "The assignment",
              body: "Write and get adopted a real vulnerability management standard for a real organisation — your employer, a client, a non-profit you volunteer for, or an open-source project with enough contributors to need one. Adopted is the operative word. A document you wrote and nobody ratified is an essay. The exercise is to experience the negotiation, because the negotiation is where you learn which of your clauses were principles and which were preferences."
            },
            {
              kind: "list",
              title: "The sections that must be present",
              items: [
                "Scope — which assets, which environments, which classes of finding, and explicitly what is out of scope",
                "The decision function — KEV, EPSS threshold, reachability, exposure and sensitivity, written so two different engineers reach the same tier on the same finding",
                "Service levels by tier, with the clock defined precisely: does it start at disclosure, at detection, or at triage, and does it stop at deployed or at verified",
                "Enforcement — what actually happens when a service level is breached, and who is notified in what order. If nothing happens, say so honestly rather than implying consequences that do not exist",
                "The exception process — who may grant, what evidence is required, maximum duration, and where the register lives",
                "Evidence requirements — what proof of remediation is accepted, because deployed and verified are different claims",
                "Emergency path — who can invoke it, what it bypasses, and the retrospective requirement afterwards",
                "Metrics and reporting cadence, including at least one metric that can make the programme look bad, because a standard with only flattering metrics is not measuring anything"
              ]
            },
            {
              kind: "table",
              title: "A service level table that survives contact with engineering",
              headers: ["Tier", "Trigger", "Decision by", "Remediated by", "Enforcement on breach"],
              rows: [
                ["Emergency", "KEV-listed and present, or internet-facing with a working public exploit", "2 hours", "72 hours or documented compensating control", "Automatic escalation to CTO and service owner, daily standing update until closed"],
                ["High", "Reachable, exploitation probability above threshold, or sensitive data in scope", "3 business days", "30 days", "Named on the engineering leadership report, blocks non-security feature deploys after 45 days"],
                ["Standard", "Reachable, no exploitation signal", "10 business days", "90 days", "Tracked, reported quarterly, no deploy blocking"],
                ["Routine", "Not reachable, or non-production scope", "Batched", "Next dependency update cycle", "Automated update tooling only, no human ticket"]
              ]
            },
            {
              kind: "checklist",
              title: "Evidence that you did the real thing rather than the writing thing",
              items: [
                "The standard is ratified by a named owner with authority, with a date",
                "At least one clause changed during negotiation, and you can explain what you traded and why",
                "The service levels were pressure-tested against actual historical data — how many findings would have breached each tier last quarter",
                "The exception process has been used at least once, and you can show the register entry",
                "One metric in the reporting pack is capable of showing the programme failing",
                "Engineering leadership can state the emergency criteria from memory when asked, which is the real test of whether a standard is alive"
              ]
            },
            {
              kind: "callout",
              title: "The clause people forget",
              body: "Define when the clock stops. Teams routinely report a fix as complete when the pull request merges, while the vulnerable version is still running in three regions behind a slow deployment pipeline. If your service level measures merge rather than deployed-and-verified, your metrics will be systematically optimistic by however long your slowest deployment takes — and you will discover that number during an incident."
            }
          ],
          praxis: "Draft, negotiate and get formally adopted a vulnerability management standard with a decision function, service levels, enforcement, exceptions and evidence requirements.",
          evidence: "The ratified standard with the approver named and dated, a summary of what changed during negotiation and why, and the back-test showing how last quarter's findings would have been tiered under it.",
          awards: ["standard-bearer", "triage-surgeon"],
          glossary: ["service-level-objective", "exception-register", "emergency-path", "back-test", "clock-definition"]
        },
        {
          id: "ch-appsec-step-board-council",
          kind: "council",
          title: "Council: The Board Asks If We Are Exposed",
          statement: "A board does not want your findings count; it wants to know whether you would recognise the day this goes wrong, and what happens next.",
          minutes: 35,
          respect: 200,
          trust: 13,
          mode: "both",
          blocks: [
            {
              kind: "prose",
              title: "The question behind the question",
              body: "When a supply chain compromise is in the news and a director asks are we exposed, they are not asking a technical question. They are asking three things at once: could this happen to us, would we know, and are you the person who has thought about it. Answer only the literal question and you will give a technically accurate response that fails completely. The answer that works has a shape: what we know now, what we do not yet know and by when we will, what we are doing regardless, and what I would need to change that answer permanently."
            },
            {
              kind: "compare",
              title: "Two answers to the same board question",
              left: {
                title: "The answer that loses the room",
                items: [
                  "We have deployed SCA across ninety-four percent of repositories",
                  "Our mean time to remediate criticals is eighteen days, down from twenty-two",
                  "We are SLSA Level 2 compliant on the majority of build pipelines",
                  "There is no evidence we were affected",
                  "We take supply chain security very seriously"
                ]
              },
              right: {
                title: "The answer that earns the next question",
                items: [
                  "We used that component in two products. Neither ran the affected version, and I can show you how I know within the hour",
                  "If we had been affected, we would have detected it through build log review and credential rotation alerting — that path is tested, and I can tell you the last date it was tested",
                  "The class of attack that would actually work against us today is a compromised third-party build action, because forty percent of our pipelines still reference mutable tags. That is funded and dated for the second quarter",
                  "The thing I cannot currently answer is whether a malicious change by a legitimate upstream maintainer would be caught, and nobody in the industry can answer that well yet",
                  "What would change my answer permanently is build provenance verification enforced at deploy, which needs one engineer for two quarters"
                ]
              }
            },
            {
              kind: "numbered",
              title: "Rules for the room",
              items: [
                "Lead with the specific answer to their actual question, not with the programme. If they asked about one incident, the first sentence is about that incident.",
                "Separate what you know from what you believe, explicitly and in those words. Board members are professionally trained to notice when someone blurs the two, and they will trust the person who marks the boundary themselves.",
                "Volunteer your biggest gap before anyone asks. It is the single strongest credibility move available to you, and the alternative is that a director finds it later and wonders what else you did not mention.",
                "Never say we are secure and never say we are compliant as an answer to a risk question. Say what a specific attack would cost us and what specifically stands in its way.",
                "Bring exactly one number that matters and be able to defend how it is computed. Ten numbers is a dashboard and a dashboard is not an argument.",
                "Attach every ask to a decision they can make. Not we need more resources — this specific control needs one engineer for two quarters, it closes this specific attack path, and here is what I stop doing if you say no.",
                "If you do not know, say I do not know, here is how I will find out, and here is the date. Then hit the date. One kept commitment of that kind is worth a year of polished slides."
              ]
            },
            {
              kind: "callout",
              title: "The trap in the news-driven question",
              body: "When a board asks about an incident they read about, the tempting answer is to describe the control that would have stopped that specific incident. Resist it. The next attack will not be that one, and you will have anchored the board on a defence that is already historical. Reframe once, briefly: that incident was an instance of maintainer control handover, here is our exposure to that class, and here is the class we are weakest against. Boards remember the person who taught them a category far longer than the person who answered a headline."
            },
            {
              kind: "quote",
              body: "31 percent of breaches now start with software vulnerabilities, beating stolen passwords as the top way attackers get in.",
              source: "Verizon Data Breach Investigations Report, 2026 headline finding"
            },
            {
              kind: "principle",
              title: "Credibility is a compound instrument",
              body: "Everything in this chapter — the paved road, the harness, the attestation, the decline record, the standard — exists so that on the day someone asks whether you are exposed, you can answer from evidence instead of from hope. That is the whole job. The technical work is how you earn the right to be believed."
            }
          ],
          awards: ["board-ready", "the-quiet-no", "class-over-instance"],
          glossary: ["board-communication", "known-versus-believed", "attack-class-framing", "credibility-compounding"]
        }
      ]
    }
  ]
};
