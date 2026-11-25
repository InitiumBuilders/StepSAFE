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
| AI RMF Step: NIST AI 600-1 lists "data provenance" among its twelve risks | NIST's announcement of 2024-07-26 confirms 12 risks and just over 200 actions; the list itself is only in the PDF | OPEN: the PDF is a download |

Sources: NIS2, Directive (EU) 2022/2555 (eur-lex.europa.eu, CELEX 32022L2555); GDPR, Regulation (EU) 2016/679 (CELEX
32016R0679); DORA, Regulation (EU) 2022/2554 (CELEX 32022R2554); the AI Act, Regulation (EU) 2024/1689 (CELEX 32024R1689);
NIST's announcement at nist.gov/news-events/news/2024/07/department-commerce-announces-new-guidance-tools-270-days-following.

Still to read: GDPR 12; DORA 19; AI Act 9 (the Steps only point to these, without a claim about their text).
