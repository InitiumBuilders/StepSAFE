# The law as the Steps cite it, read at the source

Started 2026-11-25, when the NIS2 Step's "read carefully" paragraph turned out to have Article 20 wrong in two ways.
The chapters cite about forty articles of GDPR, NIS2, DORA and the EU AI Act. Each one is read on EUR-Lex before it is
kept as written (EUR-Lex refuses scripts, so the reading is done in a browser). A verdict of HOLDS means the Step says
what the article says; SIMPLIFIED means it leaves out a qualifier a learner can live without; IMPRECISE and WRONG are
corrected, with the commit that did it.

| Claim in a Step or entry | The article, read 2026-11-25 | Verdict |
|---|---|---|
| NIS2 Art 20: "entities must offer similar training to employees" | 20(2): Member States "shall encourage" entities to offer similar training to their employees | WRONG, fixed in e1e3b1c (live) |
| NIS2 Art 20: managers liable, "including temporary management bans for essential entities" | the ban is Art 32(5)(b): at essential entities, when other enforcement measures fail, a temporary ban on a chief executive or legal representative exercising managerial functions | WRONG, fixed in e1e3b1c (live) |
| NIS2 Art 21: "risk-management measures, all-hazards, proportionate to risk and size" | 21(1): appropriate and proportionate measures, weighed by exposure, size, likelihood and severity; 21(2): based on an all-hazards approach | HOLDS |
| NIS2 Art 23: early warning in 24 h from awareness, notification in 72 h, a final report within a month | 23(4)(a) 24 h early warning; (b) 72 h incident notification; (d) final report not later than one month after the notification | HOLDS |
| GDPR Art 6(1): "exactly six grounds" | 6(1)(a) to (f): consent, contract, legal obligation, vital interests, public task, legitimate interests | HOLDS |
| GDPR Art 28: "gives you a right to a subprocessor list" | 28(2): no processor may engage another without the controller's prior specific or general written authorisation; under a general one, notice of each intended addition or replacement and the opportunity to object | IMPRECISE, fixed in 52f95a6 |
| GDPR Art 33: notification "within seventy-two hours of becoming aware" | 33(1): without undue delay and, where feasible, not later than 72 hours after becoming aware, unless the breach is unlikely to result in a risk; late notice carries reasons | IMPRECISE, fixed in 52f95a6 |
| GDPR Art 34: communication to individuals "without undue delay where risk is high" | 34(1): likely high risk, communicate to the data subject without undue delay | HOLDS |
| GDPR Art 35: a DPIA "particularly for systematic and extensive automated evaluation, large-scale special category data, or systematic monitoring" | 35(3)(a) to (c); (c) is systematic monitoring of a publicly accessible area on a large scale | HOLDS, SIMPLIFIED |
| GDPR Art 36: consult "where the DPIA indicates high residual risk that the controller cannot mitigate" | 36(1): consult before processing where a DPIA indicates high risk in the absence of measures taken by the controller to mitigate it | HOLDS (the usual reading; Recital 94 speaks of risk that cannot be mitigated by reasonable means) |
| DORA: the management body's ultimate responsibility "cannot be delegated away" | 5(2): the management body defines, approves, oversees and is responsible for the framework, and (a) bears the ultimate responsibility for managing ICT risk; 28(1)(a): with contracted ICT services the entity remains fully responsible for all its obligations | IMPRECISE ("cannot be delegated" is a reading, not the text), fixed in 52f95a6 |
| AI Act: a model is "presumed to present systemic risk" past 10^25 FLOPs of training compute | 51(2): presumed to have high impact capabilities when training compute is greater than 10^25 FLOPs; 51(1)(a) makes such a model one with systemic risk | HOLDS |
| AI Act Art 55: evaluation with standardised protocols and adversarial testing, systemic risk assessment and mitigation, serious incidents reported without undue delay, cybersecurity of the model and its physical infrastructure | 55(1)(a) to (d); the national authorities are told "as appropriate" | HOLDS |
| AI RMF Step: NIST AI 600-1 lists "data provenance" among its twelve risks, with "dangerous or violent content recommendations" and "the risks arising from dual-use capability" | Section 2's twelve, read in the PDF (July 2024, tsapps.nist.gov publication 958388) on 2026-11-25: CBRN Information or Capabilities; Confabulation; Dangerous, Violent, or Hateful Content; Data Privacy; Environmental Impacts; Harmful Bias or Homogenization; Human-AI Configuration; Information Integrity; Information Security; Intellectual Property; Obscene, Degrading, and/or Abusive Content; Value Chain and Component Integration. Content Provenance is one of four primary considerations the suggested actions address (with Governance, Pre-deployment Testing and Incident Disclosure); "dual-use" appears only in EO 14110's definition of foundation models | WRONG, fixed in b7c44a6 (live) |
| The same Step: published July 2024 in response to Executive Order 14110, and voluntary | the profile's introduction: pursuant to EO 14110, a companion resource for the AI RMF, which is "intended for voluntary use" | HOLDS |
| Awards: Confabulation is one of the twelve; the profile organises its actions against Govern, Map, Measure and Manage; the guide's Information Security and Information Integrity categories | Section 2; the action ids (GV, MP, MS, MG) | HOLDS |
| Award research: the AI RMF and the profile weigh risk "rather than intended use" | the profile's actions start from intended purposes (MP-1.1-001) and deactivate systems whose outcomes are "inconsistent with intended use" | IMPRECISE, fixed in b7c44a6 (live) |
| Award research: the AI Act's obligations for general-purpose AI models have applied since 2 August 2025 | AI Act Art 113(b): Chapter V applies from 2 August 2025 | HOLDS |
| GDPR Art 12, in the deletion-latency check: "longer than thirty days" is "a GDPR Article 12 problem" | 12(3): information on action taken on a request under Articles 15 to 22 without undue delay and within one month; two further months where necessary for complex or numerous requests, with the person told of the extension and the reasons within the first month | IMPRECISE, fixed in 6fd7dc0 (live) |
| DORA Art 19 guide row: initial report within 4 hours of classification and 24 hours of awareness, intermediate within 72 hours, final within a month | Delegated Regulation (EU) 2025/301, Art 5(1): (a) within 4 hours of classification and no later than 24 hours from awareness; (b) within 72 hours of the initial notification; (c) within one month of the latest intermediate report; 5(2): classified as major after 24 hours, then 4 hours from classification | HOLDS, SIMPLIFIED (the anchors of the later two are now named) |
| DORA Art 19 guide row: "Deadlines and templates set by the implementing technical standards, Delegated Regulation (EU) 2025/301"; "the classification step is itself time-bound" | DORA Art 20: (a) regulatory technical standards set content and time limits (2025/301 is these); (b) implementing technical standards set forms and templates (Implementing Regulation (EU) 2025/302). Art 5 sets no limit on classification itself | IMPRECISE, fixed in 6fd7dc0 (live) |
| AI Act Art 14, award Calibration Sceptic's research: people overseeing a high-risk system are enabled to stay aware of automation bias and to understand the system's capacities and limitations | 14(4)(a) and (b), "as appropriate and proportionate" | HOLDS |
| AI Act Art 14, award Calibration Sceptic: its warning about automation bias "applies at full strength here" (a confidence score in a security pipeline) | Art 14 binds high-risk AI systems; the risk it names is the same, the obligation is not | IMPRECISE, fixed in 6fd7dc0 (live) |

Sources: NIS2, Directive (EU) 2022/2555 (eur-lex.europa.eu, CELEX 32022L2555); GDPR, Regulation (EU) 2016/679 (CELEX
32016R0679); DORA, Regulation (EU) 2022/2554 (CELEX 32022R2554), with Delegated Regulation (EU) 2025/301 (CELEX
32025R0301) and Implementing Regulation (EU) 2025/302 (CELEX 32025R0302); the AI Act, Regulation (EU) 2024/1689 (CELEX
32024R1689); NIST's announcement at
nist.gov/news-events/news/2024/07/department-commerce-announces-new-guidance-tools-270-days-following; NIST AI 600-1
itself, July 2024, at tsapps.nist.gov/publication/get_pdf.cfm?pub_id=958388.

The first list of articles was drawn from the chapters by eye. A count of every citation on 2026-11-25 found five
more, read the same day:

| Claim | The article | Verdict |
|---|---|---|
| GDPR Art 5(1)(c) and (e): data minimisation and storage limitation are binding principles; Art 5(1)(b) purpose limitation | 5(1)(b), (c) and (e) as cited | HOLDS |
| GDPR Art 9: special categories prohibited unless a listed condition applies; health data in a published record is special category data | 9(1) and 9(2) | HOLDS |
| Practice scenario: GDPR Art 17(3) lets erasure yield to record-retention duties under GxP, EU Annex 11 and 21 CFR Part 11 | 17(3)(b): a legal obligation "which requires processing by Union or Member State law to which the controller is subject"; a US rule alone is not one | IMPRECISE, fixed in 6fd7dc0 (live) |
| Modux stack: GDPR Art 17 and Art 25 require minimisation at source and a retention engine | 25(2): by default only the personal data each purpose needs, in amount collected and period of storage; 17(1)(a): erasure without undue delay once no longer necessary | HOLDS, SIMPLIFIED (the law asks for the outcome, not the tool) |
| Modux model: GDPR Art 25, data protection by design and by default | 25(1) and (2) | HOLDS |
| Modux model: AI Act Art 14 requires human oversight for high-risk AI systems, including the ability to intervene or interrupt | 14(1) and 14(4)(e) | HOLDS |
| Guide: read GDPR Articles 32 to 34 in the original | a pointer, no claim; 32 (security of processing) read with the others | HOLDS |

The first list also named AI Act Article 9, but nothing in the text cites it; Article 14 is cited twice and is read
above. With these, every article of GDPR, NIS2, DORA and the AI Act that the text cites by number has been read at
the source: here, or when the glossary entry that cites it was written (GDPR 4(7), 4(21), 15 to 21 and 56, each with
its checked date). NIST AI 600-1 was read the same day, from the PDF on his word to download it.

Part six of glossary batch seven cites three more articles, read on EUR-Lex the same day:

| Claim in an entry | The article | Verdict |
|---|---|---|
| AI Literacy Obligation: Art 4 has providers and deployers take measures for a sufficient level of AI literacy among their staff and others operating AI systems on their behalf, weighing their technical knowledge, experience, education and training, the context of use and the people the systems are used on | Art 4 as written; it sits in Chapter I | HOLDS |
| The same entry: the duty has applied since 2 February 2025 | 113(a): Chapters I and II apply from 2 February 2025 | HOLDS |
| Critical ICT Provider: the ESAs designate the critical ICT third-party service providers and appoint a Lead Overseer for each, weighing systemic impact, the importance of the entities that rely on a provider, reliance for critical or important functions, and how hard it is to replace | 31(1)(a) and (b); 31(2)(a) to (d) | HOLDS, SIMPLIFIED (the Joint Committee, the Oversight Forum's recommendation and the parameters under each criterion are left out) |
| The same entry: after at least 30 days of non-compliance, a periodic penalty payment of up to 1% of average daily worldwide turnover, charged daily for up to six months | 35(6), (7) and (8) | HOLDS |

Part seven makes two new claims about articles already read, checked again on EUR-Lex the same day:

| Claim in an entry | The article | Verdict |
|---|---|---|
| Duty of Oversight: NIS2 Art 20 requires Member States to ensure that management bodies approve and oversee their entity's cybersecurity risk-management measures and can be held liable for infringements | 20(1): approve the measures taken to comply with Article 21, oversee their implementation, and can be held liable for infringements of that Article (without prejudice to national rules on public institutions and officials) | HOLDS |
| The same entry: DORA Art 5 makes a financial entity's management body responsible for its ICT risk framework | 5(2): defines, approves, oversees and is responsible for the implementation of all arrangements related to the ICT risk management framework | HOLDS |

The same entry's Delaware cases are court opinions, not one of these four laws. The passages each sentence rests on were
read in the opinions themselves the same day: Caremark (Court of Chancery, 25 September 1996), Stone v. Ritter (Supreme Court, 6 November 2006) and Marchand v.
Barnhill (Supreme Court, 18 June 2019). Their sources sit on the entry.

probe-law.mts holds this. It finds every citation of the four laws by article number in the course and fails on any
article missing from the line below. Add an article to that line only after reading it at the source and recording
the claim and the verdict above.

Read: GDPR 4, 5, 6, 9, 12, 15, 16, 17, 18, 19, 20, 21, 25, 28, 32, 33, 34, 35, 36, 56; NIS2 20, 21, 23, 32; DORA 5, 19, 20, 28, 31, 35; AI Act 4, 14, 51, 55, 113
