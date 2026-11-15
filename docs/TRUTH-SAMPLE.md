# The truth sample

Read on 2026-11-04. Forty research notes drawn with seed 20261104 from the 1654 notes probe-sources.mts reads, in proportion to each kind: 17 awards, 9 models, 8 guides and 6 chapters. `npx tsx scripts/truth-sample.mts` draws the same forty again.

Each note was read against the source it names, at that source. **Supported** means the source says what the note says. **Partly** means the substance holds and a detail does not: a number, a title, a version, the force of a standard, or a missing source. **Not supported** means the source says otherwise. A note **fails** when it is not supported or its source cannot be found.

## The result

| | Notes |
|---|---|
| Supported | 27 |
| Supported, secondary | 2 |
| Partly | 7 |
| Not supported | 1 |
| Not openly readable | 1 |
| No outside claim | 2 |

**1 of 38 checkable notes failed**, under the rule of four, so the next features may go ahead. But **8 of 38** had something to correct, about one in five: a figure, a title, a version, a standard said to require what it only recommends, or no named source. If the sample is typical, the corpus holds a few hundred more like them (forty notes make a rough estimate), and the ratchet is how they get found and fixed.

Six were corrected in this pass, and 33 notes now carry the source they name as a link, with the day it was read. `docs/TRUTH-RATCHET.json` holds that count, and probe-sources.mts fails if it ever falls.

## Every note

| # | Kind | Note | Verdict | What the source said | Changed |
|---|---|---|---|---|---|
| 1 | award | small-first-timeline · Minute by Minute | supported | M-Trends 2025 gives 26, 10 and 5 days; the SEC statement gives four business days. |  |
| 2 | award | strong-class-eliminated · Killed the Class | supported | The pledge names the goal; Google reports memory safety at 76% of Android vulnerabilities in 2019 and 24% in 2024. |  |
| 3 | award | first-real-model · A Model of Something You Actually Run | supported | The manifesto values and M-Trends 2025 (exploits first, 33%). The Verizon DBIR was not reopened. |  |
| 4 | award | property-set · Named the Property Before the Control | partly | NIST SP 800-207 grants access to each resource per session, not per request. | per-request became per-session |
| 5 | award | aw-least-privilege · The Deputy Test | supported | Praetorian: 37% of 90 vendors had not implemented the external ID correctly. |  |
| 6 | award | aw-continuous-eval · A Session That Can Die | supported | Okta: tokens from HAR files hijacked sessions at 5 customers; BeyondTrust: use within 30 minutes. |  |
| 7 | award | aw-integrity-honest · The Data, Not the Key | supported | Joux’s forbidden attack recovers the authentication key. The note named no source. | linked to the Black Hat 2016 paper |
| 8 | award | aw-key-incident-lead · Reasoned From Consequence | supported, secondary | Press reports of the board’s April 2024 findings agree; the report itself was not opened. | not linked |
| 9 | award | award-first-hour-briefing · First Hour Briefing | supported | SP 800-61r3 sorts communication into four categories and recommends updating senior leadership. |  |
| 10 | award | award-incident-command-capstone · Commanded Under Observation | partly | SP 800-61r3 says procedures can be tested or exercised and recommends an after-action report; it requires neither. | requires became can be and recommends |
| 11 | award | honest-scope · The Written Exclusion | supported | The ASL-3 activation states the exclusion; Article 55 requires adequate cybersecurity. |  |
| 12 | award | drift-watcher · Drift Watcher | supported | Article 55(1) lists evaluation, risk mitigation, serious incident reporting and cybersecurity. |  |
| 13 | award | award-holding-note · The Holding Statement | supported | The Gerding statement of 21 May 2024 directs undetermined incidents to Item 8.01. |  |
| 14 | award | award-hostile-reader · Read Aloud By Opposing Counsel | supported | SEC litigation release 26423: dismissed with prejudice on 20 November 2025. |  |
| 15 | award | predicate-architect · Predicate Architect | supported | Buterin’s essay gives the definition and the first rule; the original nakamoto.com page is gone, a repost is linked. |  |
| 16 | award | strong-ephemeral-by-default · Ephemeral Runners, Short-Lived Keys | supported | M-Trends 2026: prior compromise third globally at 10%, first in ransomware at 30%, up from 15%. |  |
| 17 | award | strong-mx-hold-outlier · Held At Outlier | no outside claim | Describes the gauge itself. |  |
| 18 | model | mm-identity-device-bound-session · Chrome DBSC public availability on Windows (2026) | supported | Google Workspace: DBSC generally available in Chrome on Windows, 2026. |  |
| 19 | model | mm-detect-schema-normalisation · OCSF launch (August 2022) | partly | Eighteen founders is right; AWS counted more than 145 participating organisations a year later, not 75. | 75 companies became 145 organisations |
| 20 | model | mm-data-minimisation-at-source · EDPB Guidelines 4/2019 | supported | The EDPB page gives the title and the final version of 20 October 2020; the examples were not reread. |  |
| 21 | model | mm-chain-private-order-flow · Flashbots transparency report, 2023 | supported | A 2023 Flashbots report gives 25 to 35% of transactions and 80% of value, citing Thomas Thiery’s research. |  |
| 22 | model | mm-ai-weight-custody · Anthropic Responsible Scaling Policy, ASL-3 security standard, 2025 | supported | The ASL-3 activation ties the standard to capability and names the attackers in scope. |  |
| 23 | model | mm-si-out-of-band-halt · IEC 61508 and safety instrumented systems | not openly readable | IEC 61508 is a paid standard. | not linked |
| 24 | model | mm-si-layered-autonomy · Aviation automation and mode awareness research | partly | True of the literature, but the note names no specific source. | open: needs a named source |
| 25 | model | mm-org-incident-command · FIRESCOPE and the Incident Command System (1970s onward) | not supported | Cal OES’s ICS history gives FEMA’s National Fire Academy teaching ICS by 1983 and FEMA recognising FIRESCOPE in 1986; no 1987 adoption. | 1987 adoption became taught by 1983 |
| 26 | model | mm-org-risk-in-ranges · Insurance underwriting of cyber risk | partly | True of the industry, but the note names no specific source. | open: needs a named source |
| 27 | guide | sg-key-hierarchy-model · NIST SP 800-130 and SP 800-152, A Framework for Designing Cryptographic Key Management Systems | partly | SP 800-152 is titled A Profile for U.S. Federal Cryptographic Key Management Systems. | the label now gives both titles |
| 28 | guide | sg-attack-coverage-model · MITRE ATT&CK Navigator | supported | The project describes itself as navigation and annotation of ATT&CK matrices. |  |
| 29 | guide | sg-detection-reading-path · MITRE Center for Threat-Informed Defense, Summiting the Pyramid | supported | The project engineers analytics to make adversary evasion harder. |  |
| 30 | guide | sg-post-incident-review · Sidney Dekker, The Field Guide to Understanding Human Error (3rd ed., 2014) | supported, secondary | Reviews and a bookseller listing agree; the book itself is not open. | not linked |
| 31 | guide | sg-notification-clocks · SEC Division of Corporation Finance staff statement, 21 May 2024 (Erik Gerding) | supported | The Gerding statement keeps the duty to determine materiality without unreasonable delay. |  |
| 32 | guide | sg-treasury-key-ceremony · SLIP-0039 — Shamir's Secret Sharing for Mnemonic Codes | supported | SLIP-0039 specifies a two-level scheme of group and member shares. |  |
| 33 | guide | sg-crypto-shredding-field-note · NIST IR 8547 — Transition to Post-Quantum Cryptography Standards | supported | NIST IR 8547, Transition to Post-Quantum Cryptography Standards, 12 November 2024. |  |
| 34 | guide | sg-lethal-trifecta-checklist · Invariant Labs — GitHub MCP server exfiltration research | supported | Invariant Labs: a public issue injects the agent, private data is pulled in, a public pull request leaks it. |  |
| 35 | chapter | ch-foundations · MITRE D3FEND (model version 1.5.0) | partly | The seven tactics are right; the site shows version 1.6.0. | the label now gives 1.6.0 and the date |
| 36 | chapter | ch-incident · Mandiant M-Trends 2025 | supported | M-Trends 2025: 11 days overall, 26 external, 5 adversary; stolen credentials second in 2024. |  |
| 37 | chapter | ch-grc · Regulation (EU) 2022/2554 (DORA) and the ESAs implementing standards on the Register of Information | supported | EIOPA: DORA entered into application on 17 January 2025; the register has its own ITS. |  |
| 38 | chapter | ch-dashevo · Dash documentation, Understanding Governance | supported | The governance page gives the 80/20 split, a superblock every 16,616 blocks, the 1 DASH fee and the net-yes rule. |  |
| 39 | chapter | ch-dashevo · Dash documentation, dashmate | supported | The dashmate docs cover config, ports, status and doctor. |  |
| 40 | chapter | mx-resilience-data · Resilience | no outside claim | A pointer to a family of models. |  |

## Still open

- Notes 24 and 26 name a body of work rather than a source. Each needs a named, readable source, or the claim narrowed to what one says.
- Notes 8 and 30 hold up in secondary reading; the review board’s report and Dekker’s book should be read themselves before they are linked.
- Note 23 cites a paid standard. It stays, marked as not openly readable.
