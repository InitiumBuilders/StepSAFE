import type { SimModule } from "../schema";

/* THE PRACTICE :: LARGE ENTERPRISE CRISIS COMMAND
   Four full-length war games. Each one puts the learner in the chair at a specific
   organisation with specific politics, and runs a live inject clock across channels.
   Every scenario is built on documented adversary tradecraft and real regulatory text.
   The wrong options are the teaching mechanism: they are all things competent people
   have actually done under pressure. */

export const MODULES: SimModule[] = [
  /* ------------------------------------------------------------------ */
  /* A — IDENTITY PROVIDER COMPROMISE: BURN THE TRUST ROOT               */
  /* ------------------------------------------------------------------ */
  {
    id: "sim-idp-root-burn",
    title: "The Root Is Theirs",
    org: "Halverd Retail Group (NYSE: HLVD)",
    sector: "Omnichannel retail — 1,140 stores, 68,000 employees, USD 19.4B revenue, PCI DSS 4.0 Level 1, SOX",
    chapterId: "ch-identity",
    essence: "azure",
    difficulty: 5,
    minutes: 80,
    mode: "both",
    respect: 1200,
    trust: 55,
    brief:
      "You are CISO of Halverd Retail Group. It is 04:12 on the Tuesday of Thanksgiving week — the nine trading days beginning tomorrow produce 31 percent of the year's operating profit. Your workforce identity provider is Okta (68,000 users, 940 integrated apps). Entra ID fronts M365. An on-prem Active Directory forest still runs, and a two-node AD FS farm still serves three legacy merchandising applications that Finance refuses to sunset before the fiscal year closes. CyberArk holds privileged credentials, CrowdStrike Falcon is on 71,000 endpoints, Zscaler carries egress. Tier-1 service desk is outsourced to Sentira Global Services — 2,900 agents across Manila and Krakow, roughly 4,100 tickets a day, contractually permitted to reset passwords and MFA factors for any non-executive account. Your CEO is eleven months into the job. Your audit committee chair, Elinor Vance, spent twenty-two years at the FBI and retired as a Deputy Assistant Director in the Cyber Division; she asks questions that have exactly one correct answer. At 03:58 the Okta System Log recorded the first of three MFA factor resets against accounts holding the Super Administrator role.",
    objective:
      "Determine within hours — not days — whether the adversary controls the trust root itself rather than a set of accounts. If they do, remove them from it in one coordinated cutover that no partial remediation has already tipped off, without destroying the evidence you will need for the board, the insurer, the regulator and, eventually, the court. Winning is not speed. Winning is completeness of the map, followed by a single decisive action, followed by a truthful record.",
    roles: ["u-keeper", "u-lantern", "u-anchor", "u-compass", "u-signal", "u-seva"],
    awards: [
      "strong-trust-root-surgeon",
      "strong-federation-cartographer",
      "safe-single-cutover",
      "strong-expensive-correct-call",
      "safe-evidence-before-eviction",
    ],
    injects: [
      {
        id: "sim-idp-root-burn-i01",
        t: "T+0:00 — Tue 04:12",
        channel: "pager",
        from: "Rana Okonkwo, SOC Shift Lead",
        text:
          "Three MFA factor resets against accounts in the Okta Super Administrator group inside eleven minutes, 03:58 to 04:09. All three initiated by Sentira agents in the Manila queue. All three outside the standing change window. Two of the three accounts then enrolled a new authenticator within ninety seconds of the reset — one from an ASN we have never seen on an admin session. I have not touched anything. What do you want first.",
      },
      {
        id: "sim-idp-root-burn-i02",
        t: "T+0:09 — Tue 04:21",
        channel: "field",
        from: "Deshawn Pike, Duty Manager, Sentira Global Services",
        text:
          "Pulled all three tickets. The agents followed the script exactly. Callback to the listed manager, employee ID confirmed, verification completed checkbox ticked on every one. Honestly, this looks like normal peak-season volume — we ran 640 resets overnight. I would not read anything into three of them.",
      },
      {
        id: "sim-idp-root-burn-i03",
        t: "T+0:21 — Tue 04:33",
        channel: "pager",
        from: "Rana Okonkwo, SOC Shift Lead",
        text:
          "One of the three admin accounts just created a new API token with org-wide scope and read the full user export. I need a call from you now. Do I start pulling threads or do we go formal.",
        decision: {
          id: "sim-idp-root-burn-d1",
          scene:
            "Twenty-one minutes in. You have three admin MFA resets, one anomalous ASN, one org-scope API token, and an outsourced service desk telling you everything is fine. You have no proof of anything beyond three accounts, and it is Thanksgiving week.",
          clock: "You have roughly four minutes before the token has finished paginating the user export.",
          pressure:
            "Declaring an identity incident freezes admin change across 940 applications during the highest-revenue week of the year. Not declaring costs you the only clean hour you will get.",
          prompt: "What is your first order?",
          options: [
            {
              id: "sim-idp-root-burn-d1-o1",
              label: "Suspend the three accounts, revoke the token, keep watching, do not declare",
              detail:
                "The narrow, proportionate move. Three accounts is three accounts. You avoid a company-wide disruption on evidence that would not survive a hostile read.",
              score: -2,
              outcome:
                "The three accounts go dark within six minutes. The token is revoked. For ninety minutes the environment looks calm and you feel vindicated.",
              ripple:
                "You have told the adversary you can see them, and you have told them exactly what you can see. At T+4:40 you discover a federation trust they created nine days earlier that never needed those three accounts. They stop using the noisy path and fall back to the quiet one, and your next detection is a criminal marketplace listing rather than a log.",
            },
            {
              id: "sim-idp-root-burn-d1-o2",
              label: "Declare an identity incident, freeze all IdP administrative change, preserve, do not evict yet",
              detail:
                "Formal declaration. Nothing in the Okta admin plane changes without two-person authorisation through you. Full System Log export to immutable storage. No account suspensions, no deletions, no tipping. Scoping runs at full speed under a preserved environment.",
              score: 3,
              isBest: true,
              outcome:
                "Change freeze lands at 04:41. The System Log, Entra sign-in logs, AD FS event logs and CyberArk session recordings are exported to a write-once bucket before anything is altered. The adversary keeps operating, which means they keep producing evidence, and within two hours you have the shape of the whole intrusion rather than three accounts.",
              ripple:
                "The preserved log set is what lets you prove at T+4:40 that the rogue federation object predates the MFA resets by nine days. That single fact converts your board briefing from speculation into a timeline, and later converts your insurer's coverage position from reservation of rights to acceptance.",
            },
            {
              id: "sim-idp-root-burn-d1-o3",
              label: "Force a global session revocation and password reset for all 68,000 users immediately",
              detail:
                "Maximum containment. If the trust root is compromised, everything downstream is suspect, so reset everything and take the operational hit now rather than later.",
              score: -3,
              outcome:
                "Store managers cannot authenticate at 05:00 on the Tuesday of Thanksgiving week. 1,140 point-of-sale supervisor overrides fail. The service desk queue goes from 40 to 5,300 tickets in twenty minutes, and the desk that is your suspected initial access vector becomes the only path back in for the entire company.",
              ripple:
                "You have handed the adversary a firehose. Under a 5,300-ticket backlog no agent verifies anything, and social engineering that was hard at 04:00 becomes trivial at 06:00. Two additional privileged accounts are taken during the reset storm. The COO's account of this becomes the version the board hears first.",
            },
            {
              id: "sim-idp-root-burn-d1-o4",
              label: "Open a P1 with Okta support and wait for their read before acting",
              detail:
                "Your IdP vendor sees this pattern across thousands of tenants. Their threat intel team can tell you in an hour whether this matches a known campaign, and their word carries weight with the board.",
              score: -1,
              outcome:
                "A P1 is opened at 04:35. First substantive response arrives at 07:50 and confirms what you already suspected. You have burned three hours of the only quiet window you will get.",
              ripple:
                "Vendor confirmation is genuinely useful — but it is corroboration, not command. The three hours you spent waiting are the three hours in which the adversary staged exfiltration. At the board meeting Elinor Vance asks what you did between 04:35 and 07:50, and the honest answer is nothing.",
            },
          ],
          debrief:
            "Declaration is cheap and reversible. Eviction is expensive and one-shot. The novice conflates them, either declaring and evicting in the same breath or refusing to declare because eviction sounds disruptive. A change freeze plus immutable log export is the highest-value action available in the first hour of any identity incident, because it costs almost nothing operationally and it is the only thing that preserves your ability to be complete later. Okta's own cross-tenant impersonation guidance and MITRE ATT&CK T1606.002 both assume you can reconstruct the trust graph; you cannot reconstruct it from logs you let roll over.",
          principle:
            "Declare early, preserve immediately, evict once. The three are different acts and only the last one is irreversible.",
        },
      },
      {
        id: "sim-idp-root-burn-i04",
        t: "T+0:34 — Tue 04:46",
        channel: "pager",
        from: "Yusuf Bekele, Identity Engineering",
        text:
          "Found something worse than the resets. There is an Identity Provider object in the Okta org named hlvd-sso-bridge-prod, created 15 November at 02:41. Inbound federation, SAML, routing rule scoped to users whose email domain matches a subdomain nobody at Halverd owns. It was created by an admin account that was deprovisioned on 17 November as part of the seasonal contractor offboard. That object is nine days old and it is not one of the three accounts from this morning.",
      },
      {
        id: "sim-idp-root-burn-i05",
        t: "T+0:47 — Tue 04:59",
        channel: "model",
        from: "Sentinel UEBA — behavioural scoring service",
        text:
          "Retrospective scoring against the preserved log set. 4,812 sign-in events in the last nine days carry a non-primary IdP attribute. Confidence on the clustering is moderate: 61 of those are almost certainly the Brightwell Foods tenant we federated in October for the acquisition, and the model cannot separate legitimate delegated federation from the rogue object without a human-supplied allowlist of expected IdP identifiers. Recommend analyst triage before any mass action.",
      },
      {
        id: "sim-idp-root-burn-i06",
        t: "T+1:02 — Tue 05:14",
        channel: "pager",
        from: "Yusuf Bekele, Identity Engineering",
        text:
          "I can delete the rogue IdP object right now. Thirty seconds. Or I can leave it and we watch. Your call, but I want to say plainly: every minute that object exists, anyone holding the attacker-side signing key can assert themselves as any user in this tenant.",
        decision: {
          id: "sim-idp-root-burn-d2",
          scene:
            "A rogue inbound federation IdP, nine days old, created by an account that no longer exists. Deleting it takes half a minute. It is also the single richest evidentiary object in the environment and the adversary will notice its absence within one authentication attempt.",
          clock: "The next inbound assertion through that object could arrive at any second.",
          pressure:
            "Your instinct and your engineer both want it gone. Your legal counsel has not yet placed a hold. You do not yet know whether there is a second one.",
          prompt: "How do you handle the rogue federation object?",
          options: [
            {
              id: "sim-idp-root-burn-d2-o1",
              label: "Delete it immediately",
              detail:
                "Impersonation-as-a-service running in your tenant. Every minute it lives is a minute anyone can be anyone. Remove the capability, then investigate.",
              score: -1,
              outcome:
                "The object is gone at 05:16. The specific impersonation path closes. Within eleven minutes an authentication attempt against that routing rule fails, and the adversary knows you found it.",
              ripple:
                "They pivot to the AD FS token-signing certificate they harvested six days ago — a path you have not discovered yet and now will not discover from behaviour, because they will use it quietly. You also deleted the object's configuration before capturing the attacker-side entity ID and certificate thumbprint, which were the two artefacts that would have let the FBI link this intrusion to two other retailers.",
            },
            {
              id: "sim-idp-root-burn-d2-o2",
              label: "Capture the full object configuration and audit trail, then disable — not delete — at a time of your choosing, coordinated with everything else",
              detail:
                "Export the entity ID, ACS URL, signing certificate, routing rules, creation audit event and every authentication that traversed it. Then leave it live under close watch until the coordinated cutover, and disable it in the same minute as everything else.",
              score: 3,
              isBest: true,
              outcome:
                "The configuration is captured at 05:19 including an attacker-controlled entity ID and a certificate thumbprint. Monitoring on the routing rule is raised to real-time alerting with a break-glass disable that any of three named people can trigger if the adversary escalates to destructive action.",
              ripple:
                "The captured thumbprint matches indicators the FBI already holds from two other retail intrusions, which unlocks intelligence sharing that tells you to go looking at AD FS. That tip is why you find the DPAPI-harvested token-signing certificate at T+4:40 instead of never. Coordinated disablement at cutover means the adversary loses both paths in the same minute.",
            },
            {
              id: "sim-idp-root-burn-d2-o3",
              label: "Leave it entirely alone and observe until you fully understand the intrusion",
              detail:
                "Pure intelligence posture. Do not touch anything, learn everything, act once with total knowledge. This is what a mature threat-hunting team would do.",
              score: -2,
              outcome:
                "You learn a great deal over the next six hours. You also carry an unmitigated impersonation capability through a business day with no compensating control and no break-glass.",
              ripple:
                "At T+5:30 the adversary uses the object to assert as the VP of Merchandising and pull the entire 2026 supplier pricing file. That single exfiltration is the substance of the extortion demand, the press story and the SEC materiality analysis. Observation without a trigger condition is not intelligence posture, it is abdication.",
            },
            {
              id: "sim-idp-root-burn-d2-o4",
              label: "Take the entire Okta org offline in maintenance mode until you understand it",
              detail:
                "If the trust root cannot be trusted, stop using it. Everything falls back to local authentication until you can prove the IdP is clean.",
              score: -3,
              outcome:
                "940 integrated applications lose authentication simultaneously at 05:20. Warehouse management, POS supervisor override, pharmacy dispensing at 310 in-store pharmacies and the payroll run all fail together. There is no tested fallback because you have never rehearsed one.",
              ripple:
                "You have converted a contained identity incident into a company-wide outage on the eve of peak trading, with pharmacy patient-safety exposure. The board will investigate your judgement rather than the adversary's tradecraft, and the next CISO will inherit an organisation that has learned to distrust security escalations.",
            },
          ],
          debrief:
            "Practitioners are trained to remove capability on sight and it is usually right. Federation objects are the exception, because the artefact itself is the evidence and its removal is a signal flare. The discipline is capture, then compensate, then coordinate. Compensate means a monitored break-glass so that observation is never unbounded — the difference between a controlled watch and negligence is whether you have written down the condition under which you stop watching and act. Okta's cross-tenant impersonation advisory describes exactly this second-IdP-as-impersonation-app pattern; the reason it reads as sophisticated is that most defenders delete the evidence before they understand the shape.",
          principle:
            "Capture before you cut, and never watch without a written trigger for when watching ends.",
        },
      },
      {
        id: "sim-idp-root-burn-i07",
        t: "T+1:30 — Tue 05:42",
        channel: "exec",
        from: "Marguerite Sallow, Chief Operating Officer",
        text:
          "I am told you want to remove Sentira's authority to reset credentials. Understand what that means. Store managers unlock POS supervisor accounts through that desk forty to sixty times an hour during peak. If the desk cannot reset, my stores cannot trade. Give me a number: how many hours does this last, and what is the fallback path for a manager in Boise at 06:00 on Black Friday. I am not saying no. I am saying I need the number before I take this to the CEO.",
      },
      {
        id: "sim-idp-root-burn-i08",
        t: "T+1:41 — Tue 05:53",
        channel: "exec",
        from: "Marguerite Sallow, Chief Operating Officer",
        text:
          "I have the CEO on at 06:15. Tell me what you are asking for and I will carry it, or tell me you are not asking and I will carry that too. Either way I need it in one sentence.",
        decision: {
          id: "sim-idp-root-burn-d3",
          scene:
            "The outsourced service desk is your most likely initial access vector. It is also the operational artery of 1,140 stores forty-eight hours before the highest-revenue week of the year. The COO is not obstructing you; she is asking you to own the cost of your own recommendation.",
          clock: "Twenty-two minutes until the CEO call.",
          pressure:
            "The technically correct answer costs real revenue and puts your name on the invoice. The comfortable answer is defensible in every meeting until the post-incident review.",
          prompt: "What do you ask the COO to carry to the CEO?",
          options: [
            {
              id: "sim-idp-root-burn-d3-o1",
              label: "Suspend all credential and MFA reset authority at the outsourced desk; route privileged resets through a named internal team with video verification against the HR photo record and manager attestation",
              detail:
                "Total for privileged and admin-tier accounts, immediate. For standard store accounts, keep the desk but require the manager-of-record to complete a callback initiated by the desk to the number in Workday, never a number supplied by the caller. Duration: 96 hours minimum, reviewed daily. You give her a staffing plan: 14 internal identity staff on 12-hour rotations, plus the four store-operations leads who already hold manager attestation authority.",
              score: 3,
              isBest: true,
              outcome:
                "The CEO approves at 06:22 after asking one question: is this the recommendation you would give if the quarter did not exist. You say yes. The desk loses privileged reset authority at 06:40. Standard resets slow from four minutes to eleven and the queue peaks at 380 rather than 5,300 because you kept the standard path open with a stronger control instead of closing it.",
              ripple:
                "At T+9:00 two further social engineering attempts hit the Manila queue using the same pretext and both fail at the callback step, which is how you learn the adversary still wants back in. The recorded attempts become the strongest single exhibit in your evidence pack. Six months later this control survives the incident and becomes permanent, and your MSA with Sentira is renegotiated with verification standards written into the SLA rather than left to a macro.",
            },
            {
              id: "sim-idp-root-burn-d3-o2",
              label: "Leave the desk running but add post-hoc review of every privileged reset within one hour",
              detail:
                "A detective control instead of a preventive one. No operational disruption, full visibility, and you can escalate the moment a bad reset appears in review.",
              score: -2,
              outcome:
                "Reviews start at 06:30 and run cleanly. Operations are unaffected. The COO is relieved and says so on the CEO call.",
              ripple:
                "A one-hour review window is one hour of full administrative control. At T+6:10 an agent resets MFA on a CyberArk-integrated service account; you catch it in review at 07:05, fifty-two minutes after the adversary has already used it to pull the vault's session recordings. In the post-incident review, the sentence that hurts is that you knew the desk was the vector and left it armed.",
            },
            {
              id: "sim-idp-root-burn-d3-o3",
              label: "Suspend the desk entirely, all tiers, immediately, and let Operations solve the fallback",
              detail:
                "It is a compromised authentication system. You do not leave a compromised authentication system running because it is convenient. Operations will adapt.",
              score: -1,
              outcome:
                "All reset capability stops at 06:05. Store managers cannot get into POS supervisor functions. By 09:00 Eastern, 240 stores report override failures and regional managers begin sharing a supervisor credential over WhatsApp to keep trading.",
              ripple:
                "The workaround is worse than the risk you removed: a shared, unrotatable, unlogged credential now exists in 240 stores and in an unmanaged messaging app. You will spend three weeks hunting it. Security decisions that do not supply a path forward do not remove risk; they relocate it somewhere you cannot see it.",
            },
            {
              id: "sim-idp-root-burn-d3-o4",
              label: "Defer the decision to the CEO without a recommendation, presenting both options neutrally",
              detail:
                "This is a business risk decision with real revenue consequences. The accountable executive should make it with full information rather than have security impose it.",
              score: -2,
              outcome:
                "The CEO, eleven months into the job, forty-eight hours from peak, and hearing two balanced options from the person who is supposed to know, chooses the one that does not disrupt trading. He is behaving rationally given what you gave him.",
              ripple:
                "You have converted your expertise into optionality for someone else, which is the specific failure the SEC pleaded against SolarWinds and its CISO: a security leader whose internal knowledge did not reach the record as a position. When the review comes, no document shows what you actually believed. Presenting options without a recommendation is not neutrality, it is the abandonment of the only thing you are paid for.",
            },
          ],
          debrief:
            "This is the politically expensive call, and it is the one that separates a security manager from a CISO. Three things make it survivable. First, you quantify the cost yourself rather than making Operations discover it — that is what buys you credibility for the next ask. Second, you supply the fallback path in the same breath as the restriction, because a control without a path forward produces shadow workarounds that are strictly worse. Third, you make a recommendation and you own it in writing. Clorox's 2025 litigation against its outsourced service-desk provider, and the 2023 MGM and Caesars intrusions, all turn on the same structural fact: the help desk is an authentication system, and almost nobody governs it like one. Okta's own guidance and the CISA and FBI advisory on this actor set both put visual or biometric verification of the requester at the top of the mitigation list.",
          principle:
            "When the correct control costs the business money, name the number yourself, supply the fallback, and put your recommendation in writing.",
        },
      },
      {
        id: "sim-idp-root-burn-i09",
        t: "T+2:15 — Tue 06:27",
        channel: "pager",
        from: "Ines Kovac, Endpoint Security",
        text:
          "Full sweep across all admin workstations and the four jump hosts. CrowdStrike shows zero malicious detections, zero quarantines, no unsigned binaries, no suspicious parent-child chains. I am comfortable saying there is no endpoint compromise. Whatever this is, it is not on our machines.",
      },
      {
        id: "sim-idp-root-burn-i10",
        t: "T+2:52 — Tue 07:04",
        channel: "legal",
        from: "Priya Ramanathan, Deputy General Counsel",
        text:
          "Litigation hold goes out in fifteen minutes covering identity infrastructure, service desk records and executive communications. Outside counsel is retaining the forensics firm so the engagement sits under privilege — route the scoping report through them, not through Slack. Three things I need from you and not from anyone else: an unvarnished statement of what is confirmed versus suspected as of now, notice of the moment you believe data left the environment, and a heads-up before any communication goes to more than fifty employees. On disclosure: nothing about this is an Item 1.05 filing yet, because nobody has made a materiality determination. Do not let anyone in an operations bridge use the word material as a casual adjective. It is a legal conclusion and it starts a four-business-day clock.",
      },
      {
        id: "sim-idp-root-burn-i11",
        t: "T+3:20 — Tue 07:32",
        channel: "exec",
        from: "Callum Reid, VP Infrastructure",
        text:
          "My team is ready. Give the word and in ninety minutes we rotate every admin credential, revoke every API token, kill every active session and re-enrol admin MFA. We can be clean before the business wakes up on the East Coast. Everyone is standing here waiting. Why are we not doing this right now.",
        decision: {
          id: "sim-idp-root-burn-d4",
          scene:
            "Three hours twenty in. You have three abused admin accounts, one rogue federation object, an unexplained org-scope API token and a clean EDR sweep. A capable infrastructure team is offering you a ninety-minute mass rotation and everyone in the room wants to say yes.",
          clock: "The rotation window before East Coast business hours closes in roughly two hours.",
          pressure:
            "Every hour you do not act feels like negligence. Acting on an incomplete map is the single most common way identity intrusions become nine-month intrusions.",
          prompt: "Do you authorise the mass rotation now?",
          options: [
            {
              id: "sim-idp-root-burn-d4-o1",
              label: "Authorise the ninety-minute rotation now — clean before the business wakes",
              detail:
                "Momentum, a ready team and a closing window. Rotation removes the credentials you know about and probably several you do not. Waiting for perfect knowledge is how organisations get owned for a year.",
              score: -2,
              outcome:
                "Rotation completes at 09:05. All admin passwords, sessions and API tokens are new. The environment looks clean and the team feels the relief of decisive action.",
              ripple:
                "You did not rotate the AD FS token-signing certificate, because you had not yet discovered it was harvested. Forged SAML assertions signed with that certificate remain valid, and the adversary is back inside a rotated environment within four hours, now aware that you are hunting and now operating with far more care. Partial rotation is worse than no rotation: it costs you the surprise and buys you nothing.",
            },
            {
              id: "sim-idp-root-burn-d4-o2",
              label: "Hold for ninety minutes and build the complete trust inventory first, then rotate everything in one cutover",
              detail:
                "Enumerate every trust relationship before touching any of them: federation objects inbound and outbound, all API tokens and their scopes, OAuth and OIDC grants including offline_access, SCIM provisioning credentials, delegated administration assignments, service accounts with certificate authentication, directory sync accounts, AD FS token-signing and token-decryption certificates, Entra ID app registrations with credentials, and every break-glass account. One list, one owner per line, one cutover.",
              score: 3,
              isBest: true,
              outcome:
                "The inventory completes at 09:11 and runs to 214 lines. Eleven of them are things nobody knew existed, including a 2022 Entra app registration with Directory.ReadWrite.All and a client secret that does not expire until 2027. The AD FS certificate question surfaces here and becomes the highest-priority hunt.",
              ripple:
                "Because the map was complete before the cutover, the eviction at T+14:00 is a single event the adversary cannot route around, and there is no second intrusion. Three months later the same inventory becomes the standing identity attack-surface baseline, and the eleven unknown trusts become the reason the board funds an identity governance programme without being asked twice.",
            },
            {
              id: "sim-idp-root-burn-d4-o3",
              label: "Rotate only the three known-compromised accounts now and defer the rest",
              detail:
                "The narrowest safe action. Removes confirmed adversary access without the risk of breaking unknown dependencies during peak week.",
              score: -2,
              outcome:
                "Three accounts are rotated by 07:50. Nothing breaks. The change record looks proportionate and defensible.",
              ripple:
                "You have performed the tipping without the containment. The adversary loses three accounts they had already finished using and learns that you are watching the accounts rather than the trust plane. The rogue federation object, which never needed those accounts, keeps working, and at T+5:30 it is used for the exfiltration that defines this incident.",
            },
            {
              id: "sim-idp-root-burn-d4-o4",
              label: "Wait for the forensics firm's formal scoping report before any action",
              detail:
                "Outside counsel has retained a firm under privilege. Their report will be defensible, thorough and admissible. Acting ahead of it risks contaminating the very analysis you are paying for.",
              score: -3,
              outcome:
                "The firm's first substantive scoping deliverable lands at T+38:00, nearly two days out. In the interim you have a change freeze and monitoring but no eviction plan and no trust inventory, because you were waiting for someone else to produce it.",
              ripple:
                "Retained forensics firms produce reports; they do not produce decisions, and they cannot enumerate trust relationships in your tenant faster than your own identity engineers can. You have outsourced the one part of the job that is unambiguously yours. The adversary spends those two days completing exfiltration, and the report you waited for opens by describing what they took.",
            },
          ],
          debrief:
            "This is the decision where the right move is to slow down, and it is the hardest one to make because every social signal in the room pushes the other way. The reason is arithmetic. Eviction from an identity plane succeeds only if it is simultaneous and complete; the adversary needs one surviving trust relationship and you need all of them. A ninety-minute inventory that raises your completeness from perhaps 70 percent to 98 percent is worth vastly more than ninety minutes of earlier action, because the failure mode of incomplete eviction is not a smaller success — it is a total failure that also costs you surprise. The 2020 SUNBURST response and the Golden SAML tradecraft catalogued as ATT&CK T1606.002 are the canonical illustrations: organisations that rotated credentials without rotating token-signing material evicted nobody. Mandiant's M-Trends 2025 puts global median dwell time at eleven days; the organisations that turn eleven days into eleven months are almost always the ones that acted decisively on an incomplete map.",
          principle:
            "In identity eviction, completeness beats speed, because a partial burn costs you surprise and buys you nothing.",
        },
      },
      {
        id: "sim-idp-root-burn-i12",
        t: "T+4:05 — Tue 08:17",
        channel: "community",
        from: "Nadia Ferreira, independent researcher (unsolicited DM)",
        text:
          "Not trying to alarm you and I am not asking for a bounty. A Telegram channel I monitor posted forty minutes ago offering, quote, HLVD workforce SSO, admin tier, EDR blind, buyer must move today. Screenshot shows an Okta admin console with your org name in the header and the tenant subdomain visible. Timestamp on the screenshot is 06:12 your time. Sending you the hash and the channel handle. Do what you want with it.",
      },
      {
        id: "sim-idp-root-burn-i13",
        t: "T+4:40 — Tue 08:52",
        channel: "pager",
        from: "Yusuf Bekele, Identity Engineering",
        text:
          "Correction to Ines at 06:27 and it matters. The clean EDR sweep was true and irrelevant. On ADFS-PRD-02 the machine DPAPI master key was accessed on 18 November by a process running as the AD FS service account, and the token-signing private key is recoverable that way without dropping a single file to disk. That is the technique Mandiant published. Also, AutoCertificateRollover is disabled on this farm — Finance asked for it in 2021 so the legacy apps would stop breaking. So: they may hold our SAML signing key, and if they do, they can mint an assertion for any user in the three federated apps and, through the old trust, into the directory. Nothing on the endpoint would ever have shown this.",
      },
      {
        id: "sim-idp-root-burn-i14",
        t: "T+5:10 — Tue 09:22",
        channel: "exec",
        from: "Callum Reid, VP Infrastructure",
        text:
          "AD FS decision needed. Finance says the three legacy merchandising apps cannot lose authentication before the fiscal close on 3 January. Rotating that certificate breaks all three unless we coordinate with each vendor, and one of them is a German supplier whose support desk opens in four hours. Tell me what to do with the farm.",
        decision: {
          id: "sim-idp-root-burn-d5",
          scene:
            "The AD FS token-signing certificate is probably in adversary hands. AutoCertificateRollover is off. Three legacy applications and a fiscal close depend on the farm. It is 09:22 on the Tuesday of Thanksgiving week.",
          clock: "Coordinated cutover is planned for T+14:00. Whatever you decide has to be ready by then.",
          pressure:
            "Rotating once is the intuitive answer and it is insufficient. Decommissioning is the correct end state and it does not fit in this window.",
          prompt: "What do you do with the AD FS farm?",
          options: [
            {
              id: "sim-idp-root-burn-d5-o1",
              label: "Rotate the token-signing certificate once, tonight, in the cutover",
              detail:
                "Standard remediation. New key, forged assertions die, farm keeps running, legacy apps get a coordinated vendor update. One change, one outage window.",
              score: -1,
              outcome:
                "The certificate rotates cleanly at 22:40. All three apps are updated with the new metadata. It looks like a complete fix and the change record says so.",
              ripple:
                "AD FS retains the previous token-signing certificate as secondary for the rollover grace period, and assertions signed with it still validate. The adversary keeps a working forgery path for the length of that grace window. This is precisely why Microsoft and ATT&CK T1606.002 mitigation guidance say rotate twice in succession — the first rotation promotes, the second one expels. You performed half of a documented mitigation and recorded it as complete.",
            },
            {
              id: "sim-idp-root-burn-d5-o2",
              label: "Rotate twice in succession during the cutover, verify the old certificate is expelled from the farm configuration, and commit to decommissioning the farm within 45 days with a named owner and a board-visible date",
              detail:
                "Two rotations back to back so no previous signing certificate remains valid. Explicitly verify with Set-AdfsCertificate rather than trusting that installing a certificate updated the farm — manual rotation on a farm with AutoCertificateRollover disabled routinely leaves the active key in place. Then kill the architecture that made this possible, on a date the board can see.",
              score: 3,
              isBest: true,
              outcome:
                "Both rotations complete inside the cutover window. Verification confirms no prior signing certificate remains in the farm configuration. Two of three vendors update within the window; the German supplier is handled with a temporary conditional access exception scoped to seven named service accounts from two source IP ranges, expiring automatically in 96 hours.",
              ripple:
                "Two forged-assertion attempts at T+19:00 and T+26:00 both fail signature validation and both are logged, which is how you prove to the insurer and the FBI that the key was in fact held by the adversary. The 45-day decommissioning commitment, given voluntarily with a date, is what converts Elinor Vance from an interrogator into an advocate at the January board meeting.",
            },
            {
              id: "sim-idp-root-burn-d5-o3",
              label: "Shut the AD FS farm down entirely tonight and force the three legacy apps to a break-glass local authentication path",
              detail:
                "The farm is a liability with a probably-stolen key and an architecture nobody would build today. Turn it off. Finance can use local accounts until the migration completes.",
              score: -1,
              outcome:
                "The farm goes down at 22:15. Two legacy apps fall back acceptably. The third, the supplier settlement system, has no local authentication path at all and is simply unavailable, blocking 1,900 supplier payment reconciliations during the week those suppliers need cash most.",
              ripple:
                "You are technically right and operationally reckless. Finance escalates to the CEO, and the story that reaches the board is that security took down supplier payments during peak week. The cost is not the outage; the cost is that your 45-day decommissioning proposal, which is the actually important thing, now arrives as an accusation rather than a plan.",
            },
            {
              id: "sim-idp-root-burn-d5-o4",
              label: "Leave the farm alone for now, add detection for anomalous assertions, and rotate after the fiscal close on 3 January",
              detail:
                "The exposure is theoretical until you see a forged assertion. Detection is cheap, rotation is disruptive, and the fiscal close is a hard business constraint. Manage the risk with monitoring for six weeks.",
              score: -3,
              outcome:
                "Detection rules are written and deployed by 14:00. The farm keeps running. Finance is delighted and the change advisory board approves without discussion.",
              ripple:
                "You have knowingly left a valid forgery capability in adversary hands for six weeks and written that decision down. Detecting a correctly-signed SAML assertion is extraordinarily hard — the signature is valid, the issuer is correct, and the only tell is the absence of a preceding authentication event. At T+19:00 an assertion is used to reach the merchandising data store and you find out eleven days later. The written risk acceptance, produced in discovery, is the document that ends your tenure.",
            },
          ],
          debrief:
            "Two things are being taught here and only one of them is technical. The technical one is exact: rotating a token-signing certificate once leaves the previous certificate valid during rollover, so the documented mitigation is to rotate twice in succession and then verify the farm configuration rather than trusting that installing the certificate changed anything — on farms with AutoCertificateRollover disabled, manual installation without Set-AdfsCertificate is a well-documented way to believe you rotated when you did not. The non-technical one is that legacy architecture is a political artefact, not an engineering one. The AD FS farm exists because Finance asked for stability in 2021 and nobody re-litigated it. The way you kill it is not by turning it off during peak week; it is by attaching a named owner and a board-visible date to the decommissioning while the board is paying attention. Incidents are the only time architectural debt is cheap to retire, and that window closes in about six weeks.",
          principle:
            "Rotate twice or you did not rotate. And use the incident to kill the architecture, not just the key.",
        },
      },
      {
        id: "sim-idp-root-burn-i15",
        t: "T+6:30 — Tue 10:42",
        channel: "exec",
        from: "Anwar Sadiq, Chief Information Officer",
        text:
          "I have to ask the question everyone is circling. Do we trust this tenant again after we clean it, or do we stand up a new one and move 68,000 people. Okta's account team says in-place remediation is standard and they will assign a TAM. Our forensics lead says she cannot certify a tenant she cannot fully enumerate. I do not have an opinion. You do.",
        decision: {
          id: "sim-idp-root-burn-d6",
          scene:
            "The central question of the entire scenario. The adversary held administrative control of the identity provider for at least nine days, created at least one persistent trust object, and may hold the federated signing key. You now decide what trust means.",
          clock: "The cutover plan freezes at T+11:00. Whatever you choose has to be buildable by then.",
          pressure:
            "A full tenant rebuild means re-enrolling 68,000 people on new authenticators during peak trading. In-place remediation means certifying an environment you cannot fully enumerate. There is no cheap answer and the expensive answers are expensive in different currencies.",
          prompt: "Burn and rebuild, or evict in place?",
          options: [
            {
              id: "sim-idp-root-burn-d6-o1",
              label: "Full tenant rebuild — new Okta org, 68,000 users re-enrolled on FIDO2, starting now",
              detail:
                "The trust root was held by an adversary. There is no partial recovery from that. Build clean, migrate deliberately, and take the operational pain rather than carry unquantifiable doubt forever.",
              score: 0,
              outcome:
                "The rebuild is technically the safest end state and it is the right answer in a different calendar. Started at T+7:00 with 940 application integrations to rebuild and 68,000 hardware or platform authenticators to enrol, the realistic cutover lands in eight to eleven weeks, not eight hours.",
              ripple:
                "You have chosen a remediation whose completion date is after the adversary's next action. For eleven weeks you run two identity planes, one of which is compromised, and the seam between them becomes the new attack surface. Rebuild is correct when the compromise is unbounded and you have the runway; declaring it without the runway is a decision that feels rigorous and functions as paralysis.",
            },
            {
              id: "sim-idp-root-burn-d6-o2",
              label: "Burn the administrative plane completely, evict in place on the user plane, and gate the return of trust on enumerable evidence",
              detail:
                "Treat the admin plane as unrecoverable and rebuild it from zero: delete every existing admin role assignment, stand up a fresh set of admin identities on FIDO2 hardware keys issued in person, new break-glass accounts in a sealed envelope process, zero standing privilege with time-bound elevation. On the user plane, do a single coordinated cutover — global session revocation, mandatory re-enrolment of authenticators with phishing-resistant factors for all privileged and finance-adjacent roles, every API token and OAuth grant revoked and reissued, both federation objects disabled, AD FS certificate rotated twice. Then define in writing the four conditions under which you would still escalate to a full rebuild.",
              score: 3,
              isBest: true,
              outcome:
                "Cutover executes at T+14:00 in a fifty-one minute window. Eleven previously unknown trusts die with it. Two forged-assertion attempts fail afterwards and are logged. Store operations lose the ability to do privileged resets for four days and never lose the ability to trade.",
              ripple:
                "The written escalation conditions are what let you tell the board honestly that you did not rule out a rebuild — you priced it, and you set the tripwires. Six weeks later, when the forensics report confirms the intrusion was bounded to the admin plane and the federated apps, that document is why nobody asks whether you cut a corner. The FIDO2 admin rollout, forced through in a crisis, becomes the template for the enterprise-wide rollout in Q2.",
            },
            {
              id: "sim-idp-root-burn-d6-o3",
              label: "In-place remediation on Okta's recommended runbook with a TAM assigned",
              detail:
                "Your IdP vendor does this dozens of times a year and has a tested playbook. Following the vendor runbook is defensible, fast, and does not require you to invent a methodology at 10:42 in the middle of an incident.",
              score: -1,
              outcome:
                "The runbook executes competently and covers roughly 80 percent of what your own trust inventory found. It does not cover the 2022 Entra app registration with Directory.ReadWrite.All, because that is not in the Okta tenant and no vendor runbook knows your environment.",
              ripple:
                "The app registration survives the remediation and is used at T+31:00 to re-establish directory write access. Vendor runbooks are floors, not ceilings; the specific thing that always survives them is the trust relationship that crosses a vendor boundary. When you brief the board you will have to explain why you executed someone else's plan against your environment.",
            },
            {
              id: "sim-idp-root-burn-d6-o4",
              label: "Rotate credentials and sessions, keep everything else, and defer the trust decision to the forensics report",
              detail:
                "You do not have enough information to make an architectural decision of this magnitude. Do the reversible things now, and let the evidence drive the irreversible ones in two weeks.",
              score: -3,
              outcome:
                "Credentials rotate. Sessions die. Nothing structural changes. The environment is quiet for nine days, which everyone reads as success.",
              ripple:
                "Quiet is not clean. The adversary re-enters through the surviving app registration on day ten, and this time they are careful and there is no noisy service-desk pattern to catch them. Deferring a trust decision to a report is a decision to keep trusting. The organisation spends the next four months in an intrusion it believed it had ended, which is the exact shape of the intrusions that end in nine-figure losses.",
            },
          ],
          debrief:
            "The mature answer is almost never all-or-nothing, and the reason is that the two planes have completely different economics. The administrative plane is small, high-consequence and cheap to rebuild — a few hundred identities, hardware keys, in-person issuance, achievable in hours. The user plane is enormous, low-per-identity-consequence and ruinously expensive to rebuild. So you burn the small expensive thing to the ground and you evict from the large cheap thing, and you gate the difference on written escalation conditions so the decision stays honest. The organisations that get this wrong in either direction do so for emotional reasons: rebuild-everything is fear dressed as rigour, and rotate-and-hope is exhaustion dressed as proportionality. Note also what the best option does with zero standing privilege — the incident is the only moment you will ever be allowed to impose it, so impose it while the window is open.",
          principle:
            "Burn the administrative plane, evict from the user plane, and write down the conditions that would change your mind.",
        },
      },
      {
        id: "sim-idp-root-burn-i16",
        t: "T+7:15 — Tue 11:27",
        channel: "board",
        from: "Elinor Vance, Audit Committee Chair",
        text:
          "Three questions and I want them answered in the order I asked them. One: as of this minute, can the adversary authenticate as an arbitrary user in your environment, yes or no, and if you do not know, say you do not know. Two: what is the earliest timestamp for which you have log evidence, and what is the retention on the systems that matter. Three: who besides you has read the raw evidence rather than a summary of it. I am not looking for reassurance. I am looking for whether the person running this can distinguish between what they know and what they have been told.",
      },
      {
        id: "sim-idp-root-burn-i17",
        t: "T+9:00 — Tue 13:12",
        channel: "exec",
        from: "Tomas Weir, VP Internal Communications",
        text:
          "We are about to force re-enrolment on tens of thousands of people forty hours before Black Friday. I can send anything you want but I need to know what we are telling them. If we say nothing, the rumour mill fills it, and store WhatsApp groups are already asking why the desk stopped doing resets. If we say too much, it is on Reddit in nine minutes and we have not made a materiality determination. Give me the frame.",
        decision: {
          id: "sim-idp-root-burn-d7",
          scene:
            "68,000 people are about to be forced through an authenticator re-enrolment they did not ask for, during the busiest week of their working year, by a company that has not publicly acknowledged anything.",
          clock: "Cutover in five hours. The message has to precede it by ninety minutes to be useful.",
          pressure:
            "Everything you say becomes external within the hour. Everything you do not say becomes a rumour that is worse and less accurate than the truth.",
          prompt: "What do you tell the workforce?",
          options: [
            {
              id: "sim-idp-root-burn-d7-o1",
              label: "Routine security maintenance, no further detail",
              detail:
                "The classic frame. True enough, low legal exposure, minimal panic, and it does not front-run a materiality determination that legal has not made.",
              score: -2,
              outcome:
                "The message goes out at 12:00. Compliance with re-enrolment is 71 percent by cutover because people deprioritise routine maintenance during peak week.",
              ripple:
                "The gap between routine maintenance and forced global re-enrolment forty hours before Black Friday is obvious to every employee, and the credibility you spend here is the credibility you will need on Thursday. Worse: because nobody understood the message mattered, 29 percent of users hit the cutover unprepared and flood the internal desk that is already running with reduced authority.",
            },
            {
              id: "sim-idp-root-burn-d7-o2",
              label: "Name it as a security incident, state precisely what is required of each person and by when, state what you will not say and why, and commit to a next update time",
              detail:
                "We are responding to a security incident affecting our sign-in system. Here is what you must do, here is the deadline, here is why it cannot wait. We are not going to describe the incident in detail while the investigation is active, and we are not going to speculate about causes or data. Next update Thursday 09:00 whether or not there is news. Written to be accurate if it is printed in a newspaper, because it will be.",
              score: 3,
              isBest: true,
              outcome:
                "Compliance hits 94 percent by cutover. The internal desk load is a third of what it would have been. The message leaks to a retail-industry newsletter within forty minutes, exactly as expected, and reads as competent rather than evasive because it was written for that audience from the start.",
              ripple:
                "The commitment to a next update time whether or not there is news is the single line that buys you the most. When Thursday's update contains almost nothing new, you are still the organisation that shows up on schedule, and the press stops calling employees for leaks because the official channel is faster. This is also the version legal can live with: it describes actions and requirements, never a materiality conclusion.",
            },
            {
              id: "sim-idp-root-burn-d7-o3",
              label: "Full transparency — describe the rogue federation object, the service desk vector and the AD FS exposure",
              detail:
                "Treat employees as adults. They are the sensor network and the social engineering targets; the more they understand the actual tradecraft, the better they defend. Openness earns trust.",
              score: -2,
              outcome:
                "The detailed message is on a public forum in eleven minutes with the tenant subdomain, the vector and the unremediated AD FS exposure attached, ninety minutes before your cutover.",
              ripple:
                "You have published your remediation timeline to the adversary and to every other adversary. The AD FS exposure disclosure in particular invites opportunistic attempts from unrelated actors before the rotation lands. Transparency is a virtue in the debrief and a vulnerability during the response; the correct move is to promise the full account later and deliver it, which you now cannot do because you spent it early and inaccurately.",
            },
            {
              id: "sim-idp-root-burn-d7-o4",
              label: "Send nothing company-wide; brief the 1,140 store managers only and let them cascade",
              detail:
                "Targeted communication to the people who actually need to act, through the management chain that already exists. Avoids a mass message that will certainly leak.",
              score: -1,
              outcome:
                "Store managers are briefed at 12:30. Cascade quality varies enormously; some stores get an accurate brief and some get a garbled instruction to change passwords immediately, which several employees comply with by calling the desk.",
              ripple:
                "Cascade communication during an incident degrades one hop at a time and produces a population of employees who have been told something urgent and vague about credentials — the exact psychological state social engineering exploits. Two vishing attempts on Thursday succeed at the pretext stage because the caller opens with a reference to the security thing your manager mentioned.",
            },
          ],
          debrief:
            "Internal communications during an identity incident are a control, not a courtesy: the message determines your re-enrolment compliance rate, which determines whether your cutover actually evicts anyone. Three rules hold up. Write every internal message as though it will be published, because it will be. Say what you will not say and why, because unexplained silence reads as concealment while explained silence reads as discipline. Commit to a next update time and honour it even when there is no news, because predictability is what stops people from seeking information through channels you cannot control. And keep the word material out of every operational channel — it is a legal conclusion with a four-business-day consequence, and an operations bridge is not where it should first appear.",
          principle:
            "Write for the newspaper, name what you will not say, and keep the next update time even when there is nothing to say.",
        },
      },
    ],
    scoring: [
      {
        dimension: "Trust-plane completeness",
        weight: 30,
        note:
          "Did you enumerate the full trust graph — federation objects, API tokens, OAuth grants, SCIM credentials, delegated admin, app registrations, service-account certificates, AD FS signing material — before acting? Scored on how many of the 214 inventory lines existed in your map at cutover. Partial maps score near zero regardless of how decisive the action was.",
      },
      {
        dimension: "Single-cutover discipline",
        weight: 22,
        note:
          "Every remediation action taken before the coordinated cutover is a tip-off charged against you. Scored on the count of adversary-visible changes made before eviction, and on whether eviction closed all discovered paths in one window.",
      },
      {
        dimension: "Evidence integrity",
        weight: 18,
        note:
          "Immutable log export before mutation, capture-before-delete on the federation object, chain of custody through outside counsel, and whether the artefacts you preserved were sufficient to support the law-enforcement match and the insurer's determination.",
      },
      {
        dimension: "Business continuity under control",
        weight: 15,
        note:
          "Did each restriction ship with a workable fallback path? Shadow workarounds — shared credentials, WhatsApp cascades, unlogged overrides — are scored as control failures caused by you, not by the business.",
      },
      {
        dimension: "Record quality and legal exposure",
        weight: 15,
        note:
          "Whether your written positions are ones you would want read aloud in a deposition: recommendations made rather than options presented, materiality language kept out of operational channels, risk acceptances that a reasonable reviewer would call reasonable.",
      },
    ],
    debrief: [
      {
        title: "The trust root is one decision, and you get one attempt",
        body:
          "Every other domain in security tolerates iteration. You can tune a detection, re-scan an application, re-image a host, and try again tomorrow. Identity eviction does not work that way, because the adversary observes your remediation in real time through the same plane you are remediating. The moment you rotate the first credential you have started a race you cannot restart. This is why the sequencing that feels slow — declare, freeze, preserve, enumerate, then evict once — outperforms the sequencing that feels urgent. Applied to the 2020 SUNBURST response, the organisations that recovered cleanly were the ones that mapped federated trust before touching credentials; the ones that rotated passwords first spent months rediscovering that a forged SAML assertion does not care about a password.",
      },
      {
        title: "Map before you burn, and the map is longer than you think",
        body:
          "A modern enterprise identity plane has far more trust relationships than anyone's mental model contains. In this scenario the inventory ran to 214 lines and eleven of them were unknown to every person in the room. That ratio is realistic. The categories that consistently get missed are the ones that cross a product boundary: an Entra app registration with a long-lived client secret and directory write permission, a SCIM provisioning credential held by an HR SaaS vendor, an outbound federation to an acquired company's tenant, a delegated administration relationship granted to an MSP in 2021. Vendor runbooks never cover these, because no vendor can see across the boundary. Build the inventory once during the incident and then keep it as a living baseline — it is the single most valuable artefact any identity incident produces.",
      },
      {
        title: "Rotate twice, and verify the farm rather than the certificate store",
        body:
          "The documented mitigation for forged SAML tokens, catalogued under MITRE ATT&CK T1606.002, is to rotate the AD FS token-signing certificate twice in succession. One rotation is not a weaker version of the fix; it is not a fix, because the previous certificate remains valid through the rollover grace period and forged assertions signed with it still validate. There is a second, subtler trap: on farms where AutoCertificateRollover has been disabled — usually years earlier, usually for stability reasons that made sense at the time — installing a new certificate into the Windows certificate store does not change what AD FS uses. Mandiant's work on recovering active AD FS signing keys via machine DPAPI documents exactly this configuration drift, where teams believe they have rotated and the active signing key is still the old one, still recoverable, still in memory. Verify the farm configuration, not the certificate store.",
      },
      {
        title: "The service desk is an authentication system nobody governs like one",
        body:
          "Across the 2023 MGM and Caesars intrusions, the Okta cross-tenant impersonation campaign, and the intrusions that produced Clorox's 2025 litigation against its outsourced service-desk provider, the same structural fact recurs: an agent on a low-margin outsourced contract, measured on handle time, holds the authority to reset the strongest authentication factor in the enterprise. The verification step is a script and a checkbox rather than a control with an artefact. The fix is not more training — it is making verification produce evidence: a callback to the number of record in the HR system rather than the number the caller supplies, a video match against the HR photo record for privileged tiers, manager attestation captured as a record rather than asserted in a macro, and hard separation so that the tier of account being reset determines who is permitted to reset it. Write these into the MSA, not into a knowledge-base article, because the article is not what the vendor is measured against.",
      },
      {
        title: "What the data says about detection and dwell",
        body:
          "Mandiant's M-Trends 2025, drawn from over 450,000 hours of investigations across 2024, puts global median dwell time at eleven days — but the number that matters for this scenario is the split by detection source: ten days when the organisation finds it internally, twenty-six days when an external party notifies you, five days when the adversary tells you by deploying ransomware. Stolen credentials rose to the second most common initial infection vector at sixteen percent, the highest that category has ever ranked, and sixteen percent of investigations involved credentials sourced from infostealer operations. The strategic reading is that identity has become the primary intrusion surface while most detection engineering budgets still sit on endpoint. In this scenario the endpoint sweep was clean and correct and completely irrelevant, which is the most important thing the scenario teaches: a clean EDR result tells you nothing about a compromise that lives in the trust plane.",
      },
      {
        title: "The politically expensive call, and how to survive making it",
        body:
          "Removing reset authority from the outsourced desk forty-eight hours before peak trading is the correct control and it is a genuine cost to the business. The failure mode is not making the call; it is making it badly. Three moves make it survivable. Quantify the cost yourself and bring the number before anyone asks — an executive who discovers the cost after approving the control will never approve the next one. Supply the fallback in the same breath as the restriction, because a control without a path produces shadow workarounds strictly worse than the original risk. And state a recommendation rather than presenting balanced options, because balanced options delivered by the expert are an abdication that leaves no record of what you actually believed. That last point is the thread that runs from this decision to Module D: the record of what the security leader believed, and when, is now a regulated artefact.",
      },
      {
        title: "The transferable pattern",
        body:
          "Any compromise of a root of trust — a certificate authority, a code-signing identity, a cloud organisation management account, a Kubernetes cluster admin, a secrets manager, a package registry namespace — has the same shape as this one. The pattern is: (1) freeze change and preserve evidence before you alter anything, because both are cheap and irreversible in the other direction; (2) enumerate every relationship that derives trust from the root, including those crossing vendor and organisational boundaries; (3) treat the administrative plane as unrecoverable and rebuild it from zero on phishing-resistant factors with zero standing privilege; (4) evict from everything else in a single coordinated window; (5) write down, in advance, the conditions under which you would escalate to a full rebuild, so the decision remains honest when the pressure to declare victory arrives. If you can only remember one line: partial eviction from a trust root is worse than no eviction, because it costs you surprise and buys you nothing.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* B — RANSOMWARE, BACKUP INTEGRITY, OFAC, AND A 72-HOUR CLOCK         */
  /* ------------------------------------------------------------------ */
  {
    id: "sim-ransom-clearinghouse",
    title: "Ninety Percent of the Nation's Prescriptions",
    org: "Verrant Health Solutions",
    sector:
      "Healthcare claims clearinghouse and pharmacy benefit switch — 9,400 employees, 1.1B claims per year for 480 payers and 61,000 provider organisations, HIPAA business associate, PE-owned with a filed S-1",
    chapterId: "ch-incident",
    essence: "ember",
    difficulty: 5,
    minutes: 90,
    mode: "both",
    respect: 1400,
    trust: 68,
    brief:
      "You are CISO of Verrant Health Solutions. Verrant is not a hospital and not an insurer — it is the plumbing between them. Pharmacy eligibility checks, claims adjudication routing and remittance for roughly a fifth of US retail prescription volume flow through your switch. You are a HIPAA business associate, not a covered entity, which changes your notification duties but not your exposure. Verrant is owned by Kestrel Ridge Partners; the S-1 was filed nine weeks ago and the roadshow starts in three weeks. Your board is chaired by a Kestrel operating partner, Gideon Aumont, who has never run a technology company; the one independent director, Dr. Beatrix Oyelaran, is a former academic medical centre CFO who understands exactly what a downtime procedure costs a pharmacy. Infrastructure is VMware vSphere across two data centres, Citrix NetScaler for remote access, Veeam backing up to an on-premises appliance with a scale-out repository tier offloading to S3 with Object Lock — configured last quarter, never restore-tested end to end. A Dublin subsidiary, Verrant Health Ireland Ltd, processes EEA data for two multinational pharmaceutical benefit programmes, which puts GDPR Article 33 and its 72-hour clock over your shoulder. It is 02:47 on a Sunday.",
    objective:
      "Contain a ransomware event without destroying either the evidence or the country's access to medication. Establish the true state of your backups before you promise anyone a recovery time. Handle a payment question that carries strict-liability sanctions exposure by building the record before the decision. Meet three different regulatory clocks that start at three different events, with facts that will change under you at least twice. And keep a team functioning past hour forty.",
    roles: ["u-anchor", "u-lantern", "u-ledger", "u-vault", "u-compass", "u-signal", "u-seva"],
    awards: [
      "safe-restore-before-promise",
      "strong-ofac-record-builder",
      "safe-phased-notification",
      "strong-downtime-path-first",
      "safe-relief-in-place",
    ],
    injects: [
      {
        id: "sim-ransom-clearinghouse-i01",
        t: "T+0:00 — Sun 02:47",
        channel: "pager",
        from: "Marcus Tiller, Infrastructure On-Call",
        text:
          "vCenter is not responding on either site. I have 340 VMs showing inaccessible. The three hosts I can still reach have files renamed with a .kelpx extension and there is a text file in every datastore root. It says KELPWOOD and gives a Tor address and a case ID. Claims routing is still passing traffic on the Ohio switch nodes but adjudication has stopped. I have not powered anything off.",
      },
      {
        id: "sim-ransom-clearinghouse-i02",
        t: "T+0:12 — Sun 02:59",
        channel: "pager",
        from: "Solene Marchetti, Security Operations Manager",
        text:
          "Initial read: encryption came out of the virtualisation layer, not the guests — they got into vCenter and encrypted the datastores directly. First anomalous authentication I can find is a NetScaler session on 4 November from an account belonging to a contractor who left in August. That is nineteen days ago. I am seeing evidence of log clearing on the domain controllers. Also the ransom note has a line I want you to see: it says we have 1.4TB of your patient data, which suggests exfiltration, but I have no egress evidence yet.",
      },
      {
        id: "sim-ransom-clearinghouse-i03",
        t: "T+0:26 — Sun 03:13",
        channel: "exec",
        from: "Priyanka Raval, Chief Operating Officer",
        text:
          "Pharmacy opens in five hours on the East Coast. If our switch is up but corrupt, pharmacies get wrong eligibility answers and dispense or refuse against bad data. If our switch is down, 61,000 provider organisations fall back to manual and most of them have never run their downtime procedure. Those are not the same kind of bad. I need your call on whether we stay connected, and I need it before 04:00 so I can get the notification out to payers while their duty teams are still awake.",
        decision: {
          id: "sim-ransom-clearinghouse-d1",
          scene:
            "Twenty-six minutes in. Encryption confirmed at the hypervisor layer, adjudication down, claims routing still passing. You do not know whether the routing path is clean. Sunday morning pharmacy opens in five hours.",
          clock: "Thirty-four minutes until the COO has to notify payers.",
          pressure:
            "Disconnecting stops the country's prescriptions. Staying connected risks serving wrong eligibility answers into clinical decisions. Nobody in the room can tell you which is worse and both are your call.",
          prompt: "What is your containment decision?",
          options: [
            {
              id: "sim-ransom-clearinghouse-d1-o1",
              label: "Keep the claims switch connected while you scope, since it is still functioning",
              detail:
                "Availability is a patient-safety property here. The routing nodes are in a different segment and are still passing traffic correctly. Do not create a national outage on suspicion.",
              score: -3,
              outcome:
                "Traffic continues. At 05:50 you find the adversary had write access to the routing configuration store three days ago. Between 03:13 and 05:50 the switch served responses you cannot certify.",
              ripple:
                "Every eligibility response served during that window becomes an unquantifiable clinical exposure and a discovery target. You cannot prove any of them were wrong, and you cannot prove any of them were right, which is worse: it converts a bounded outage into an unbounded liability that plaintiffs' counsel will describe as knowingly serving from a compromised system.",
            },
            {
              id: "sim-ransom-clearinghouse-d1-o2",
              label: "Sever all external connections immediately — payers, providers, pharmacy — and stand up the downtime path in parallel with a published manual procedure within two hours",
              detail:
                "Disconnect the switch on the principle that you cannot certify any part of an environment where the hypervisor is owned. In the same action, activate the pre-agreed downtime protocol: publish a single status URL on infrastructure that has never touched the production domain, push the manual eligibility fallback and paper claim procedure to the top 200 pharmacy chains and all 480 payers by 06:00, and stand up a staffed bridge line for provider escalations.",
              score: 3,
              isBest: true,
              outcome:
                "Disconnection completes at 03:41. The status page is live at 04:10 on separately-hosted infrastructure. By 06:00 the downtime procedure has reached the chains covering roughly seventy percent of retail volume, and the two largest chains activate cash-pay-and-reimburse policies before their stores open.",
              ripple:
                "The two-hour downtime path is the difference between an outage and a crisis. It is also the single fact that most protects you later: when the state attorneys general and HHS ask what you did for patients, you have a timestamped record of a continuity path published before the first pharmacy opened. The separately-hosted status page becomes your only working external channel for eleven days, because your own domain and email are inside the blast radius.",
            },
            {
              id: "sim-ransom-clearinghouse-d1-o3",
              label: "Disconnect everything immediately, full stop, and work the restoration",
              detail:
                "Contain first. Continuity is Operations' problem and the security decision is unambiguous: an owned hypervisor means nothing in the estate can be trusted. Every minute of connectivity is a minute of risk.",
              score: 0,
              outcome:
                "Disconnection at 03:35, six minutes faster than the option above. Containment is equivalent. Nothing else happens for four hours because everyone is working restoration.",
              ripple:
                "Pharmacies open at 08:00 into silence. Providers call payers, payers call you, your phone system is down, and the vacuum is filled by a Reddit thread and a local news segment about patients being turned away. Correct containment with no continuity path is scored as a partial failure everywhere it matters — with regulators, with customers, and in the S-1 amendment your bankers will now have to write. Containment and continuity are the same decision, not sequential ones.",
            },
            {
              id: "sim-ransom-clearinghouse-d1-o4",
              label: "Isolate the encrypted data centre only and fail claims routing over to the secondary site",
              detail:
                "Surgical containment. The Ohio nodes are unaffected and the architecture was designed for exactly this failover. Preserve service, isolate the damage, avoid a national outage.",
              score: -2,
              outcome:
                "Failover initiates at 03:30 and completes at 04:15. Service continues on the secondary site. At 07:20 the secondary site begins encrypting.",
              ripple:
                "Both sites shared a domain, a backup infrastructure and a hypervisor management plane, so both sites were always one environment wearing two names. Failover architectures designed for datacentre loss provide no protection against an adversary with domain-wide control — and by failing over you handed a clean environment to an adversary who was already positioned in it. You have now lost both sites and four hours.",
            },
          ],
          debrief:
            "The instinct to treat containment and continuity as sequential is the most expensive habit in healthcare-adjacent incident response, and Change Healthcare in February 2024 is the reference case: the disconnection decision was defensible and the continuity gap that followed produced pharmacies fronting medication costs, providers unable to bill, and a congressional hearing. The correct framing is that continuity is a containment control, because without it the business routes around you — reconnecting shadow integrations, sharing credentials, standing up unmanaged workarounds — and you lose containment anyway. Note also the failover trap: geographic redundancy protects against a datacentre event, and a domain-wide compromise is not a datacentre event. If both sites share an identity plane, a hypervisor management plane, or a backup infrastructure, they are one site.",
          principle:
            "Containment without a published continuity path is not containment; the business will route around you within hours.",
        },
      },
      {
        id: "sim-ransom-clearinghouse-i04",
        t: "T+1:05 — Sun 03:52",
        channel: "field",
        from: "Duy Nguyen, Backup and Storage Lead",
        text:
          "Good news on backups. Veeam console is up on a standalone server that was not domain-joined. It shows last successful job at 04:00 Saturday, and the scale-out repository has the immutable tier on S3 Object Lock with a 30-day retention. On-premises repository is encrypted along with everything else, but the immutable copy should be untouchable. I am telling you we can restore.",
      },
      {
        id: "sim-ransom-clearinghouse-i05",
        t: "T+1:40 — Sun 04:27",
        channel: "exec",
        from: "Gideon Aumont, Board Chair (Kestrel Ridge Partners)",
        text:
          "I have been woken by our bankers, who have been woken by someone. Two things. First: I need a recovery time to give the syndicate before Asia opens, and I am told backups are intact, so give me a number. Second: understand the timing. The roadshow is in three weeks. I am not asking you to say anything untrue. I am asking you not to volunteer conclusions that turn out to be wrong, because a corrected disclosure is worse than a late one.",
        decision: {
          id: "sim-ransom-clearinghouse-d2",
          scene:
            "Your storage lead says the immutable backup tier is intact. Your board chair wants a recovery time to give the debt syndicate. Nobody has restored anything.",
          clock: "Asia opens in three hours.",
          pressure:
            "Everything about the moment rewards giving a number. A console that says the job succeeded is not the same as a restore that works, and you have never tested this configuration end to end.",
          prompt: "What do you tell the board chair, and what do you do about backups?",
          options: [
            {
              id: "sim-ransom-clearinghouse-d2-o1",
              label: "Give a 72-hour recovery estimate based on the Veeam console state",
              detail:
                "The console is authoritative, the immutable tier is designed for exactly this, and the board needs a planning number. Caveat it as preliminary and move on to real work.",
              score: -3,
              outcome:
                "The number goes to the syndicate at 05:30. It is repeated to payers by 09:00 and appears in a trade publication by Monday afternoon as Verrant expects restoration within three days.",
              ripple:
                "At T+6:20 you discover the newest usable immutable restore point is forty-one days old. Every commitment built on your number now fails publicly, and each correction costs more credibility than the original silence would have. A recovery number given before a restore test is not an estimate, it is a guess wearing a suit — and it is the single most common self-inflicted wound in ransomware response.",
            },
            {
              id: "sim-ransom-clearinghouse-d2-o2",
              label: "Refuse to give a recovery time until a full-stack restore of one tier-one system into an isolated clean room has succeeded, and commit to that test result by a stated hour",
              detail:
                "Tell the chair precisely this: I will not give you a number I cannot stand behind, and here is what I will give you instead — a restore test of the eligibility service into an air-gapped clean room, result by 12:00, and a recovery estimate that is real at 13:00. Build the clean room now: fresh hypervisor, no connectivity to production, new credentials, restored guest scanned before it is powered onto any network.",
              score: 3,
              isBest: true,
              outcome:
                "The chair is unhappy for about ninety seconds and then says fine, 13:00. The clean-room restore begins at 05:10. At 11:40 it fails in a way that changes everything, and you find out from your own test rather than from a failed production restore.",
              ripple:
                "The discipline of refusing the number is what makes you credible for the next forty days. When you do give a recovery estimate at T+14:00 it holds, and the board chair — who has by then been burned by two other numbers from two other functions — starts treating your estimates as the only reliable ones in the room. This is also how you avoid the far worse outcome: a mass restore into a live domain, which reinfects and destroys evidence simultaneously.",
            },
            {
              id: "sim-ransom-clearinghouse-d2-o3",
              label: "Begin an immediate mass restore of all tier-one systems into the production environment to save time",
              detail:
                "The clock is the enemy. Parallelise: start restoring everything now and validate as you go. A sequential test-then-restore approach adds a day you do not have.",
              score: -3,
              outcome:
                "Restores begin at 05:00 into the existing production domain and the existing hypervisor management plane. Throughput is good and the team feels progress for six hours.",
              ripple:
                "You have restored systems into an environment where the adversary's access has not been removed, using a backup set you have not verified, over the top of forensic evidence. At T+13:00 restored systems begin re-encrypting. You have now lost the evidence, the restore window and the team's belief that anyone is in control. Restoring into an uncleaned environment is the second most common way ransomware recoveries fail; the most common is discovering the backups do not work.",
            },
            {
              id: "sim-ransom-clearinghouse-d2-o4",
              label: "Give the chair a wide range — 3 to 14 days — to satisfy the ask without over-committing",
              detail:
                "Ranges are honest about uncertainty and give the board something to work with. It is not a promise, it is a bounded expectation.",
              score: -1,
              outcome:
                "The range is delivered at 05:20. Within an hour the syndicate, the bankers and the customer-facing teams have all independently anchored on the low end, because that is what people do with ranges under pressure.",
              ripple:
                "A range communicated upward becomes its best case by the second retelling. When the real answer turns out to be beyond the top of your range, you get no credit for having had a range. If you cannot stand behind a number, the correct output is not a wider number — it is a stated time at which you will have a real number, and then hitting that time.",
            },
          ],
          debrief:
            "A backup you have not restored is a hypothesis. Immutability configured at the bucket level tells you the objects cannot be deleted; it tells you nothing about whether the offload job that was supposed to put current objects there has been succeeding. Silent offload failure in a scale-out repository is common and it is exactly what has happened here. The professional habit is that no recovery commitment leaves your mouth before a full-stack restore of at least one tier-one system has succeeded in an isolated clean room — clean room meaning a fresh hypervisor, no path to production, new credentials, and malware scanning of the restored guest before it touches any network. Note also what the best option does with the board chair's implicit ask. He is not asking you to lie; he is asking you not to volunteer conclusions. The correct response to that is not defiance and not compliance — it is substituting a commitment you can keep for one you cannot.",
          principle:
            "Never give a recovery number before a clean-room restore succeeds; give a time when you will have a number, and hit it.",
        },
      },
      {
        id: "sim-ransom-clearinghouse-i06",
        t: "T+3:15 — Sun 06:02",
        channel: "legal",
        from: "Adaeze Okoro, General Counsel",
        text:
          "Three clocks, three different start events, and people are already confusing them. GDPR Article 33 for the Dublin entity: 72 hours from becoming aware, to the Data Protection Commission, and partial notification is explicitly contemplated — phased is permitted, late is not. HIPAA: we are a business associate, so our duty under 45 CFR 164.410 is to notify the covered entities without unreasonable delay and no later than 60 days from discovery, and then their 60-day clocks to individuals run from our notice, which means every day we sit on this consumes their budget, not ours, and they will remember that. And if a ransom is paid, there is a 24-hour reporting expectation for the payment itself under the CIRCIA regime. Do not let anyone start a clock accidentally in an email.",
      },
      {
        id: "sim-ransom-clearinghouse-i07",
        t: "T+4:30 — Sun 07:17",
        channel: "field",
        from: "Solene Marchetti, Security Operations Manager",
        text:
          "Correction to my 02:59 read and it goes the wrong way. I said no egress evidence. We now have it: 1.9TB out to a commercial file-sharing endpoint between 12 and 16 November, in chunks, during business hours, through the proxy, categorised as cloud storage and allowed by policy. The staging archive that is still on disk contains eligibility extracts. Eligibility extracts contain member ID, name, date of birth, plan and, for the specialty pharmacy programmes, diagnosis codes. That is PHI and it is the sensitive kind.",
      },
      {
        id: "sim-ransom-clearinghouse-i08",
        t: "T+6:20 — Sun 09:07",
        channel: "field",
        from: "Duy Nguyen, Backup and Storage Lead",
        text:
          "I have to walk back what I said at 03:52 and I am sick about it. The Veeam console last successful job was the on-premises repository job, which is encrypted. The scale-out offload to the Object Lock tier has been failing since 26 September — 41 days — with a warning state that did not raise an alert because the alerting rule was scoped to error, not warning. The newest immutable restore point is 26 September. Everything after that existed only on the on-premises appliance and it is gone. Forty-one days of claims adjudication state, configuration and transaction history.",
      },
      {
        id: "sim-ransom-clearinghouse-i09",
        t: "T+7:45 — Sun 10:32",
        channel: "chain",
        from: "Renata Fiske, Blockchain Analytics (retained through outside counsel)",
        text:
          "Wallet analysis on the address in the note. The receiving cluster has two hops to an exchange deposit address that appears in prior clustering associated with an OFAC-designated entity, and one intermediate address shows overlap with wallets attributed in public reporting to an affiliate structure connected to a designated group. I want to be precise about confidence: this is suggestive, not conclusive, and clustering heuristics produce false positives. But it is enough that a reasonable person would not call this an unsanctioned counterparty without further work.",
      },
      {
        id: "sim-ransom-clearinghouse-i10",
        t: "T+9:10 — Sun 11:57",
        channel: "exec",
        from: "Gideon Aumont, Board Chair",
        text:
          "The negotiator says 12 million in bitcoin buys a decryptor and a deletion certificate, and the price rises 40 percent in 48 hours. Forty-one days of lost adjudication state is, I am told, roughly 90 million in unreconstructable revenue plus whatever the litigation costs. On any spreadsheet I can build, paying is the cheaper number. I am aware there is a sanctions question. Tell me why we are not paying.",
        decision: {
          id: "sim-ransom-clearinghouse-d3",
          scene:
            "Forty-one days of backup gap. A 12 million demand. A blockchain analytics finding that is suggestive but not conclusive of sanctions exposure. A board chair with a spreadsheet and a roadshow in three weeks.",
          clock: "Price escalation in 48 hours. The 72-hour GDPR clock expires in 63 hours.",
          pressure:
            "The economic case for paying is real and the sanctions case against it is probabilistic. Everyone in the room wants you to either bless it or block it, and both of those are the wrong shape of answer.",
          prompt: "How do you handle the payment question?",
          options: [
            {
              id: "sim-ransom-clearinghouse-d3-o1",
              label: "Authorise payment through the incident response retainer's negotiation vendor, who handles sanctions screening as part of their service",
              detail:
                "This is what the vendor is for. They screen against the SDN list, they have made hundreds of these payments, and the liability for screening sits with a specialist rather than with you.",
              score: -3,
              outcome:
                "The vendor screens the literal wallet address against the SDN list, finds no direct match — which is the expected result, since designated entities do not publish their receiving addresses — and processes payment at T+31:00.",
              ripple:
                "OFAC liability is strict: a US person can be held civilly liable for a prohibited transaction even without knowledge that it was prohibited, and outsourcing the screening does not outsource the liability. Worse, you had an analytics finding suggesting a designated nexus and you proceeded without resolving it, which converts a compliance problem into an aggravating factor. The vendor's screening record shows a check against a list; your record shows you had contrary information and did not act on it.",
            },
            {
              id: "sim-ransom-clearinghouse-d3-o2",
              label: "Slow the decision by 36 hours and build the record: complete attribution work, self-initiated report to FBI and OFAC, documented meaningful-steps file, and only then a decision that outside counsel signs",
              detail:
                "Tell the chair the decision is not being refused, it is being sequenced. In 36 hours you will have: a completed attribution package from the analytics firm with stated confidence; a self-initiated, complete and timely report to the FBI field office and to OFAC; a documented file of the meaningful steps taken to defend against and mitigate the attack; a written OFAC-risk opinion from sanctions counsel; and a parallel workstream costing the reconstruct-from-source path so the payment decision is made against a real alternative rather than against despair. Explicitly tell the chair that the escalating price is a negotiation instrument and that a 40 percent escalation on 12 million is a smaller number than an OFAC penalty and a criminal referral.",
              score: 3,
              isBest: true,
              outcome:
                "The chair pushes back hard for ten minutes and then accepts, primarily because you brought the reconstruct-from-source cost estimate rather than only objections. The FBI field office is engaged at T+12:00 and provides two indicators that materially improve your scoping. Attribution firms up to a non-designated affiliate at T+41:00, and the payment decision is made on Tuesday with counsel's written opinion and a documented file behind it.",
              ripple:
                "OFAC's updated ransomware advisory treats a self-initiated, timely and complete report to law enforcement as a significant mitigating factor, and treats meaningful steps to defend and mitigate as relevant to any enforcement outcome. The file you built in those 36 hours is the difference between a defensible decision and an indefensible one regardless of which way the decision goes. The 40 percent escalation is real and you pay it; it is the cheapest insurance premium in the incident. And the reconstruct-from-source workstream, spun up as a hedge, ends up recovering nineteen of the forty-one days from payer-side transaction records.",
            },
            {
              id: "sim-ransom-clearinghouse-d3-o3",
              label: "Refuse payment outright on policy grounds and tell the board the answer is no",
              detail:
                "Paying funds the ecosystem, there is no guarantee of a working decryptor, deletion certificates are worthless, and the sanctions exposure is real. Take the clear ethical and legal position and hold it.",
              score: -1,
              outcome:
                "You state the position at 12:10. The board chair accepts it in the room and reopens it at 22:00 through the general counsel, without you, framed as a business continuity question rather than a security question.",
              ripple:
                "A flat no from security does not end a payment discussion; it relocates it to a room you are not in. The decision is not yours to make — it belongs to the board with counsel — and by taking it as yours you forfeited the ability to shape how it was made. The version that gets decided at 22:00 has no attribution work, no law enforcement report and no meaningful-steps file, because the person who would have built those was excluded from the conversation for being unhelpful.",
            },
            {
              id: "sim-ransom-clearinghouse-d3-o4",
              label: "Pay immediately at 12 million before the escalation, and do the sanctions analysis afterwards",
              detail:
                "The escalation is a real 4.8 million. Attribution work can proceed in parallel and, if it turns out badly, voluntary self-disclosure to OFAC after the fact is a recognised mitigation path. Speed has quantifiable value here.",
              score: -3,
              outcome:
                "Payment executes at T+11:00. A decryptor arrives and works on roughly sixty percent of the encrypted volumes, which is typical. The deletion certificate is a text file.",
              ripple:
                "You have made a prohibited-transaction determination impossible to defend: the analytics finding existed before the payment and you chose not to resolve it, which is the definition of proceeding with reason to know. Voluntary self-disclosure mitigates penalties for violations you discover; it does not mitigate a violation you were warned about and executed anyway. This is also the decision that, eighteen months later, an S-1 amendment and a plaintiffs' firm will describe in exactly those words.",
            },
          ],
          debrief:
            "This is the second decision in this module where the right move is to slow down, and it is the one people find hardest because the delay has a visible price tag. Three things make the case. First, OFAC operates on strict liability — a US person may be held civilly liable even without knowledge or reason to know that the counterparty was prohibited — so contractual delegation of screening to a vendor moves the work but not the exposure. Second, OFAC's updated advisory identifies a self-initiated, timely and complete report to law enforcement as a significant mitigating factor and identifies meaningful steps taken to defend against and mitigate ransomware as relevant to enforcement outcomes; both of those are things you can only build before the payment. Third — and this is the part practitioners miss — the escalating price is a negotiation instrument designed to compress exactly this analysis. Treating the escalation as a fact of nature rather than as an adversary's pressure technique is how sophisticated organisations make unsophisticated decisions. Note finally that the best option does not decide whether to pay. That decision belongs to the board with counsel. Your job is to make sure it is made against a real alternative, with a real record, by people who know what they are deciding.",
          principle:
            "Never let an adversary's clock set the pace of a sanctions analysis. Build the record first; the record is the defence regardless of the decision.",
        },
      },
      {
        id: "sim-ransom-clearinghouse-i11",
        t: "T+11:30 — Sun 14:17",
        channel: "regulator",
        from: "Fionnuala Breen, Data Protection Commission (Ireland) — duty officer",
        text:
          "We are aware of reporting concerning Verrant Health Ireland Limited. This message is to confirm your awareness of obligations under Article 33 and to note that the Commission takes the view that a controller cannot defer notification pending complete investigation. Where full information is not available, notification may be provided in phases without undue further delay. We would expect an initial notification within the statutory period and we will treat the completeness of subsequent phases as relevant to our assessment.",
      },
      {
        id: "sim-ransom-clearinghouse-i12",
        t: "T+13:00 — Sun 15:47",
        channel: "legal",
        from: "Adaeze Okoro, General Counsel",
        text:
          "Article 33 expires Wednesday 02:47 our time. Outside privacy counsel in Dublin is telling me two different things depending on which partner I ask. One says file now with what we have. The other says our facts have already changed twice today and a notification we have to correct twice is worse than one filed at hour 71. I need your read as the person who actually knows how much the facts are still moving.",
        decision: {
          id: "sim-ransom-clearinghouse-d4",
          scene:
            "The GDPR Article 33 clock expires in 61 hours. Your facts have changed materially twice in thirteen hours — exfiltration went from no evidence to 1.9TB, and backups went from intact to forty-one days gone.",
          clock: "61 hours to the Article 33 deadline.",
          pressure:
            "Filing early with wrong facts creates a correction trail. Filing late is a per-se breach of the Article regardless of how good your facts eventually are.",
          prompt: "How do you handle the 72-hour notification?",
          options: [
            {
              id: "sim-ransom-clearinghouse-d4-o1",
              label: "File a phased initial notification within 48 hours stating what is known, what is not known, what is being done, and the date of the next phase",
              detail:
                "Article 33(4) expressly permits phased notification where information is not available at the same time. File at hour 46 with: categories and approximate number of data subjects, categories and approximate number of records, likely consequences, measures taken and proposed, DPO contact, and an explicit list of open questions with a committed date for phase two. State confidence levels on every number.",
              score: 3,
              isBest: true,
              outcome:
                "Phase one is filed at T+46:00 with four numbers marked as preliminary and three open questions listed by name. The DPC acknowledges and asks two clarifying questions rather than opening an inquiry. Phase two lands as committed on the following Monday with two of the preliminary numbers revised.",
              ripple:
                "Regulators are not surprised by revised numbers; they are surprised by silence and by confidence that turns out to be unearned. By marking your uncertainty explicitly you made the later revisions non-events rather than credibility failures. The phased structure also becomes the template for your HIPAA business-associate notices to 480 covered entities, which lets you start those clocks eleven days earlier than you otherwise could have.",
            },
            {
              id: "sim-ransom-clearinghouse-d4-o2",
              label: "Wait until hour 70 to file with the most complete picture possible",
              detail:
                "Use every hour the regulation gives you. A single accurate notification is better than a notification you have to amend, and the Article gives you 72 hours for a reason.",
              score: -1,
              outcome:
                "Filed at T+70:00. The picture is somewhat more complete and still contains three preliminary figures, because at hour 70 you are still nineteen days from a complete forensic picture.",
              ripple:
                "You spent 24 hours of goodwill to buy a marginal improvement in a document that was always going to be provisional. Worse, the DPC has by then read press coverage and heard from two data subjects, so your notification arrives as confirmation rather than as disclosure. The posture difference between telling a regulator and confirming to a regulator is worth more than any factual precision you gained.",
            },
            {
              id: "sim-ransom-clearinghouse-d4-o3",
              label: "File immediately, within the first 24 hours, with everything currently known",
              detail:
                "Maximum transparency, earliest possible notice, strongest good-faith signal. Speed of notification is itself evidence of a mature programme.",
              score: 0,
              outcome:
                "Filed at T+20:00, before the exfiltration scope is understood and before the backup gap is known. Both of those facts change within the next eight hours.",
              ripple:
                "You have now filed a notification that materially understates the incident and you will amend it twice in seventy-two hours. Each amendment is a document a regulator reads as a change in your understanding, and three versions in three days invites the question of whether the organisation had any understanding at all. Speed is a virtue only when paired with explicitly stated uncertainty; a confident early filing is worse than a hedged later one.",
            },
            {
              id: "sim-ransom-clearinghouse-d4-o4",
              label: "Take the position that Verrant Health Ireland is a processor, not a controller, and that notification duty sits with the pharmaceutical benefit programmes",
              detail:
                "Legally arguable and materially reduces exposure. Article 33(2) requires a processor to notify the controller without undue delay, not the supervisory authority. Notify the two programme controllers and let them file.",
              score: -2,
              outcome:
                "Counsel drafts the position and notifies both controllers at T+30:00. It is a defensible reading of the roles for at least one of the two programmes.",
              ripple:
                "The DPC has already contacted you directly, which means the posture question is now about how you responded to that contact. A processor argument advanced after a regulator has reached out reads as avoidance regardless of its legal merit, and the merit is contested for the second programme where Verrant determines retention periods. You may win the technical argument and you will lose the relationship that determines the size of everything that follows.",
            },
          ],
          debrief:
            "Notification clocks are notification clocks, not certainty clocks, and confusing the two is the most common regulatory error in incident response. GDPR Article 33(4) explicitly contemplates phased notification where information is not available at the same time; the HIPAA breach notification rules similarly run from discovery and require notice without unreasonable delay and in no case later than 60 calendar days rather than requiring completeness. The professional technique in all of these is the same: file on time with explicit confidence markers, list your open questions by name, commit to a date for the next phase, and hit that date. Regulators calibrate on whether your uncertainty was disclosed or discovered. One further point specific to this scenario: as a business associate, your 60-day clock under 45 CFR 164.410 runs to the covered entities, and their own 60-day clocks to individuals run from your notice. Every day you delay spends their budget, not yours — which is both a legal fact and the reason 480 payers will decide how they feel about you.",
          principle:
            "File on the clock with stated uncertainty and named open questions. Regulators forgive revised numbers; they do not forgive silence or unearned confidence.",
        },
      },
      {
        id: "sim-ransom-clearinghouse-i13",
        t: "T+18:00 — Sun 20:47",
        channel: "press",
        from: "Hollis Aderyn, STAT News",
        text:
          "Running tomorrow morning. I have three independent pharmacy sources describing eligibility failures since Sunday morning, a screenshot of what appears to be your status page, and a source who says the ransom demand is eight figures. I am also told your immutable backups failed. I would rather quote you than quote them. On the record, on background, or no comment — but I am publishing at 06:00 either way.",
      },
      {
        id: "sim-ransom-clearinghouse-i14",
        t: "T+22:30 — Mon 01:17",
        channel: "field",
        from: "Solene Marchetti, Security Operations Manager",
        text:
          "I need to say something that is not about the incident. My team has been up for twenty-three hours. Two of my analysts have made errors in the last hour that they would never make — one nearly ran a containment script against the clean room. Duy has not left the building and he blames himself for the backup thing, which is going to break him if nobody stops it. I know we are in the middle of it. I am telling you the middle is going to last five weeks.",
        decision: {
          id: "sim-ransom-clearinghouse-d5",
          scene:
            "Hour twenty-three. Your best people are degrading, one of them nearly destroyed the clean room, and your storage lead is carrying a failure that was an alerting configuration rather than a person.",
          clock: "The press piece runs in five hours. The restore has not started.",
          pressure:
            "Every instinct says the crisis justifies the burn rate. The incident will last five weeks and you are staffing it like it will last two days.",
          prompt: "What do you do about the team?",
          options: [
            {
              id: "sim-ransom-clearinghouse-d5-o1",
              label: "Push through the next 24 hours with the current team, then rotate once the restore is stable",
              detail:
                "This is the critical window. Continuity of knowledge matters most right now and the handover cost of rotating mid-restore is real. People have done harder things for a night.",
              score: -2,
              outcome:
                "The team holds. The restore proceeds. At T+29:00 an exhausted engineer restores a domain controller into the clean room with a network adapter still attached to the production VLAN.",
              ripple:
                "That single error costs eleven hours and requires the clean room to be rebuilt from scratch. Error rates under sustained sleep deprivation are not linear and they concentrate in exactly the high-consequence, low-frequency actions that incident recovery consists of. The handover cost you avoided was six hours; the error cost you accepted was eleven, plus the confidence of the team that made it.",
            },
            {
              id: "sim-ransom-clearinghouse-d5-o2",
              label: "Impose mandatory rotation now with a formal 12-hour shift structure, a written handover protocol, two-person integrity on every destructive or clean-room action, and move Duy off the backup workstream to lead the reconstruct-from-source effort",
              detail:
                "Stand up three shifts covering a five-week incident, staffed from the wider organisation and from the IR retainer, not from the same nine people. Written handover at every boundary. Nothing destructive and nothing touching the clean room executes without a second named person. And deliberately reassign the storage lead to a workstream where he is the expert and not the accused, because the alternative is losing him permanently.",
              score: 3,
              isBest: true,
              outcome:
                "Rotation lands at 02:00 with a bruising six-hour handover cost. Error rate drops immediately. The two-person rule catches a mis-scoped containment script at T+34:00 that would have taken down the clean room. The reconstruct-from-source workstream, led by the person who knew the backup topology best, recovers nineteen of the forty-one lost days.",
              ripple:
                "Five weeks later you still have your team. That is not a soft outcome — the organisations that lose their incident responders to burnout in week three spend months in a worse position than the ones that lost more data, because institutional knowledge of the intrusion walks out of the building. The two-person rule, introduced under duress, becomes permanent policy for destructive operations. And moving Duy was the highest-leverage act of the night: the alerting rule scoped to error rather than warning was an organisational failure, and letting an individual carry it would have cost you the one person who understood the storage estate.",
            },
            {
              id: "sim-ransom-clearinghouse-d5-o3",
              label: "Send everyone home for eight hours and pause the response",
              detail:
                "The team is unsafe. Stop, rest, restart with clear heads. Nothing being done right now is worth the errors it will produce.",
              score: -1,
              outcome:
                "The response pauses at 02:00. Eight hours later the team returns rested. In the interim, the press piece has run, three payers have escalated to their own regulators, and the adversary's leak-site countdown has advanced with nobody watching it.",
              ripple:
                "Rest is necessary and a full stop is not the way to get it. An incident response has a floor of continuous activity — monitoring, external communication, regulator and customer contact — that cannot pause without consequences you will pay for later. The distinction between rotation and suspension is the difference between a sustainable response and an absent one.",
            },
            {
              id: "sim-ransom-clearinghouse-d5-o4",
              label: "Bring in the IR retainer's surge team to take over the technical workstreams entirely",
              detail:
                "You are paying for a retainer precisely for this. Hand the technical response to people who are fresh, do this for a living, and have not been awake for twenty-three hours.",
              score: 0,
              outcome:
                "Six surge consultants arrive Monday afternoon. They are skilled and they spend the first eighteen hours learning an environment your exhausted team has to explain to them.",
              ripple:
                "Surge capacity is genuinely valuable and it is not a substitute for rotation, because external responders cannot hold environmental context. The correct structure is a blend — external surge for the parallelisable and procedural work, internal staff rotated onto the judgement-heavy work — and choosing surge instead of rotation means you now have twelve tired people instead of nine.",
            },
          ],
          debrief:
            "Team sustainability is a technical control and it belongs in the same category as change management and separation of duties, because its failure mode is identical: a person with production access does the wrong thing. The specific mechanism is that sleep deprivation degrades exactly the cognitive functions incident recovery depends on — error monitoring, inhibition of a prepared but wrong action, and accurate self-assessment of one's own degradation. That last one is why self-reported readiness is worthless and why rotation has to be imposed rather than offered. The second lesson here is about Duy. The backup gap was caused by an alerting rule scoped to error rather than warning — an organisational failure of monitoring design and restore testing, not an individual failure. Organisations that let an individual absorb a systemic failure during an incident lose that person, and they lose them at the moment their knowledge is worth the most. Moving him to a workstream where he is the expert is not kindness; it is the highest-return staffing decision available.",
          principle:
            "Staff for the incident's real duration on day one, impose rotation rather than offering it, and never let a person absorb a systemic failure.",
        },
      },
      {
        id: "sim-ransom-clearinghouse-i15",
        t: "T+27:00 — Mon 05:47",
        channel: "board",
        from: "Dr. Beatrix Oyelaran, Independent Director",
        text:
          "I ran a hospital's finances through two of these. I am going to ask you the question nobody else on this board knows to ask. Not when will systems be back — what is the plan for the forty-one days of adjudication state that no longer exists. Because when I lost eleven days, the systems came back in a week and the reconciliation took fourteen months, and the thing that killed us was that nobody started reconstructing until after recovery finished. Who is working that problem right now, this morning, in parallel.",
      },
      {
        id: "sim-ransom-clearinghouse-i16",
        t: "T+31:00 — Mon 09:47",
        channel: "community",
        from: "Kelpwood leak site — automated post",
        text:
          "VERRANT HEALTH SOLUTIONS — 1.9TB. Sample set published: 14,000 eligibility records with member identifiers, dates of birth and diagnosis codes. Full publication in 96 hours unless resolved. Buyers welcome. Note to Verrant executives: your S-1 is public and so is your roadshow date.",
        decision: {
          id: "sim-ransom-clearinghouse-d6",
          scene:
            "A sample of 14,000 real member records with diagnosis codes is now public. The adversary has read your S-1. Your covered entities are about to learn about this from a leak site rather than from you.",
          clock: "96 hours to full publication. The Article 33 phase-one filing is 15 hours away.",
          pressure:
            "The instinct is to focus on the extortion timeline. The actual urgent thing is that 480 covered entities and their members are about to be notified by a criminal.",
          prompt: "What is your next move?",
          options: [
            {
              id: "sim-ransom-clearinghouse-d6-o1",
              label: "Notify all 480 covered entities within 12 hours with a structured business-associate notice, and stand up member-facing support before the media cycle",
              detail:
                "Do not wait out the 60-day statutory window. Send a structured 164.410 notice today containing: date of discovery, date range of the incident, categories of PHI involved, the specific data elements in the published sample, what is known and unknown about scope, what Verrant is doing, and a named contact per payer. In parallel, fund and launch identity protection and a member call centre before your customers have to ask for it.",
              score: 3,
              isBest: true,
              outcome:
                "Notices reach all 480 covered entities within eleven hours through the payer relationship managers, ahead of the media cycle. Thirty-one payers escalate; none of them escalate about the delay, because there was not one. The member call centre opens Tuesday with 900 seats.",
              ripple:
                "Your covered entities' own 60-day individual-notification clocks run from your notice, so notifying on day two instead of day fifty gives each of them fifty-eight days of runway they will remember for a decade. Two of the three largest payers publicly credit Verrant's notification speed in their own statements, which is the single most valuable sentence anyone says about you during the entire incident. The early identity-protection funding decision costs 31 million and removes the strongest allegation from the class actions that follow.",
            },
            {
              id: "sim-ransom-clearinghouse-d6-o2",
              label: "Notify the covered entities once the forensic scope is confirmed, using the full 60-day window",
              detail:
                "The statute allows 60 days and the scope is genuinely uncertain. Notifying with wrong record counts forces 480 payers to re-notify their members, which is worse for those members than a two-week delay.",
              score: -2,
              outcome:
                "Notices go out on day 38 with confirmed numbers. The numbers are good. By day 38 every covered entity has already learned about it from the press, from the leak site and from their own members.",
              ripple:
                "The delay consumes 38 of the 60 days each covered entity had for their own individual notifications, and they will describe that to regulators and to their own boards in exactly those terms. Statutory maximums are not targets. Change Healthcare's five-month gap between incident and individual notification is the reference failure here, and it drove both the state attorney general litigation and the HHS Office for Civil Rights posture that followed.",
            },
            {
              id: "sim-ransom-clearinghouse-d6-o3",
              label: "Re-engage the negotiator to stop publication, and delay notification until that outcome is known",
              detail:
                "If publication can be prevented, the harm profile changes materially and so does the notification content. Spending 96 hours on prevention before notifying is a rational sequencing of effort.",
              score: -3,
              outcome:
                "The negotiator re-engages. The price is now 19 million. Publication is paused for eight days and then proceeds anyway, which is the ordinary outcome.",
              ripple:
                "You have made your notification duty contingent on a criminal's promise, and you have delayed 480 covered entities by eight days for nothing. Deletion certificates have no evidentiary value; the sample set is already replicated by third parties within hours of publication. Treating an extortion negotiation as a variable in a regulatory timeline is the error that turns an incident into an enforcement action.",
            },
            {
              id: "sim-ransom-clearinghouse-d6-o4",
              label: "Issue a public statement first to control the narrative, then notify covered entities",
              detail:
                "The leak site post will be press within hours. Get ahead of it publicly, then work the formal notifications in an orderly way over the following days.",
              score: -1,
              outcome:
                "A public statement goes out at 12:00. It is factually careful and reasonably well received. Your 480 covered entities read about their own members' data in a press release.",
              ripple:
                "Sequencing public communication ahead of direct customer notification is the most reliable way to convert customers into adversaries. Every payer relationship manager spends the next week explaining why their client heard it from Reuters, and the two largest payers open contractual reviews. The order is always: those with a duty to act, then those affected, then the public.",
            },
          ],
          debrief:
            "The 60-day HIPAA figure is a statutory maximum and treating it as a schedule is the most consequential misreading in health-sector breach response. As a business associate your notice starts each covered entity's own clock, so delay is not neutral — it is a transfer of your uncertainty onto their compliance budget and onto their members' exposure window. Change Healthcare in 2024 is the case that defines the downside: an incident in February, individual notifications beginning in late July, 192.7 million individuals ultimately affected, a state attorney general action, and an HHS Office for Civil Rights investigation opened within weeks. Note also the sequencing rule, which generalises well beyond healthcare: notify those with a legal duty to act first, then those directly affected, then the public. Inverting that order to control a narrative reliably costs more relationship capital than any narrative is worth.",
          principle:
            "Statutory maximums are not schedules. Notify those with a duty to act first, and never make a notification timeline contingent on a criminal's promise.",
        },
      },
    ],
    scoring: [
      {
        dimension: "Containment with continuity",
        weight: 22,
        note:
          "Whether isolation decisions shipped with a published, reachable downtime path within two hours. Containment that produced shadow reconnections, unmanaged workarounds or patient-facing silence is scored as failed containment, not partial success.",
      },
      {
        dimension: "Recovery honesty",
        weight: 20,
        note:
          "Whether any recovery commitment preceded a successful clean-room restore of a tier-one system, and whether restores were ever run into an environment that had not been cleaned. Numbers given before evidence are penalised more heavily than silence.",
      },
      {
        dimension: "Sanctions and legal record",
        weight: 20,
        note:
          "Completeness of the pre-decision OFAC file: attribution work with stated confidence, self-initiated report to law enforcement, documented meaningful steps, written counsel opinion, and a costed alternative to payment. Judged on the record, not on whether payment occurred.",
      },
      {
        dimension: "Notification discipline",
        weight: 20,
        note:
          "On-time filing against each of the three clocks, with explicit confidence markers and named open questions. Covered-entity notification speed is weighted heavily because it directly consumes their statutory budget.",
      },
      {
        dimension: "Team sustainability",
        weight: 18,
        note:
          "Rotation imposed before degradation produced an error, two-person integrity on destructive and clean-room operations, staffing built for the real duration, and whether any individual was left carrying a systemic failure.",
      },
    ],
    debrief: [
      {
        title: "Containment and continuity are one decision",
        body:
          "In any sector where your outage lands on someone's health, safety or livelihood, the containment decision and the continuity decision have to be made in the same breath, by the same person, in the same document. Change Healthcare's February 2024 incident is the canonical illustration: the decision to disconnect was defensible, and the gap that followed left pharmacies fronting medication costs and providers unable to bill, which is what produced the congressional attention rather than the intrusion itself. The operational discipline is a downtime path published within two hours on infrastructure that has never touched your production domain — because in a hypervisor-level compromise your own website, email and phone system are inside the blast radius and you will discover that at the worst possible moment.",
      },
      {
        title: "A backup you have not restored is a hypothesis",
        body:
          "The failure in this scenario is precise and extremely common: object-lock immutability was correctly configured at the storage tier, and the offload job that was supposed to place current data there had been failing for forty-one days in a warning state that the alerting rule did not cover. Every element of that is real. Immutability protects objects that arrive; it makes no claim about whether they arrive. The controls that would have caught it are unglamorous — alert on warning states and on backup job age rather than only on errors, monitor the age of the newest immutable restore point as a first-class metric with a threshold, and perform a full-stack restore test of at least one tier-one system into an isolated environment on a fixed cadence with a written result. The organisational lesson is that the metric everyone reports is last successful job, and the metric that matters is age of newest verified restorable copy.",
      },
      {
        title: "OFAC is strict liability, and the record is the defence",
        body:
          "Treasury's Office of Foreign Assets Control has made clear that a US person may be held civilly liable for a prohibited transaction even without knowledge or reason to know the counterparty was prohibited. The practical consequences run against intuition in three ways. Delegating screening to a negotiation vendor or an insurer moves the work and not the liability. Screening a wallet address against the SDN list is nearly meaningless on its own, since designated entities do not publish receiving addresses — the meaningful work is clustering and attribution with stated confidence. And OFAC's updated advisory treats a self-initiated, timely and complete report to law enforcement as a significant mitigating factor, alongside evidence of meaningful steps taken to defend against and mitigate the attack. Every one of those is something you can only build before the payment decision, which is why the adversary's escalating price exists: it is engineered to compress precisely this analysis.",
      },
      {
        title: "Three clocks, three start events, and none of them require certainty",
        body:
          "Practitioners routinely conflate notification clocks with investigation completeness. They are unrelated. GDPR Article 33 runs 72 hours from awareness and Article 33(4) expressly permits phased notification where information is not available at the same time. HIPAA's breach notification rules run from discovery, requiring notice without unreasonable delay and in no case later than 60 calendar days — and as a business associate under 45 CFR 164.410 your notice to covered entities starts their own 60-day clocks to individuals. If a ransom is paid, the CIRCIA regime contemplates reporting the payment itself within 24 hours, on a clock that starts at the payment rather than at the incident. The technique that satisfies all three is identical: file on time, mark every number with its confidence, list open questions by name, commit to a next-phase date, and hit it. Regulators calibrate on whether uncertainty was disclosed or discovered.",
      },
      {
        title: "The reconstruction problem nobody staffs",
        body:
          "Dr. Oyelaran's question is the most sophisticated thing said in this entire scenario and it comes from someone who has lived it. When you lose transactional state — claims adjudication, order history, ledger entries, provenance records — the systems come back long before the data does, and the reconstruction effort routinely runs an order of magnitude longer than the technical recovery. The teams that handle this well start reconstruction in parallel on day one rather than after recovery completes, and they start by identifying which counterparties hold a copy of the same transactions. In this scenario nineteen of the forty-one lost days are recoverable from payer-side records, and they are recoverable only because someone started asking on day two. Build the counterparty-reconstruction question into your ransomware playbook as a day-one workstream with a named owner; almost nobody does.",
      },
      {
        title: "Sustainability is a technical control",
        body:
          "Sleep deprivation degrades error monitoring, inhibition of prepared-but-wrong actions, and — critically — accurate self-assessment of one's own degradation. That third effect is why self-reported readiness is worthless and why rotation must be imposed rather than offered. Build the shift structure on day one for the incident's real duration, not its hoped-for duration; a five-week incident staffed like a two-day incident produces its first serious error somewhere around hour thirty. Two-person integrity on every destructive or clean-room operation is the cheapest insurance available and it will catch at least one catastrophic mistake. And when a systemic failure has an obvious individual to blame — the person who owned the backup job with the misconfigured alert — move them to a workstream where they are the expert, because letting them absorb it costs you the person whose knowledge is worth the most and teaches everyone watching that proximity to a failure is career-ending.",
      },
      {
        title: "The transferable pattern",
        body:
          "Strip out the healthcare specifics and the structure applies to any availability crisis with regulatory exposure: (1) make containment and continuity one decision and publish the continuity path on infrastructure outside the blast radius; (2) refuse every recovery commitment until a clean-room restore has actually succeeded, and substitute a time-certain for a number-certain; (3) treat any payment question as a record-building exercise before it is a decision, and never let the adversary's escalation clock set the pace of your analysis; (4) file every regulatory notification on its own clock with explicit uncertainty rather than waiting for completeness; (5) notify those with a duty to act before those affected before the public; (6) staff for the real duration on day one. The single sentence worth keeping: in a crisis, the things that look like delay — the restore test, the attribution work, the shift rotation — are the only things that make the fast decisions survivable.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* C — SIGNED BUILD, POISONED PIPELINE: YOUR CI IS THE VECTOR          */
  /* ------------------------------------------------------------------ */
  {
    id: "sim-signed-build-poisoned",
    title: "The Signature Was Valid",
    org: "Aureon Runtime, Inc.",
    sector:
      "Infrastructure software — open-core observability agent on approximately 1.9M hosts, 4,300 paying customers including three US federal agencies, FedRAMP Moderate, SOC 2 Type II, Series D",
    chapterId: "ch-appsec",
    essence: "violet",
    difficulty: 5,
    minutes: 85,
    mode: "both",
    respect: 1300,
    trust: 60,
    brief:
      "You are CISO of Aureon Runtime. Aureon builds an open-core telemetry agent that runs as root on roughly 1.9 million hosts — cloud instances, Kubernetes nodes, point-of-sale terminals, three US federal agency environments under FedRAMP Moderate, and two of the four largest US retail banks. The agent auto-updates by default; that default is why deployment is easy and it is also the reason this scenario exists. Your build estate is GitHub Actions with a mix of hosted and self-hosted runners, artefacts signed with Sigstore cosign using workload identity from the runner's OIDC token, SLSA Build Level 3 provenance attached to every release, an SBOM generated in the release pipeline, and a public transparency log entry for every signature. You have spent two years and a great deal of engineering credibility building this, and you have a conference talk about it. Your VP of Engineering, Tobias Renner, considers the supply-chain work over-invested. Your CEO, Ilse Vantoor, is nine weeks from closing a Series E at a valuation that assumes federal expansion. It is 08:12 on a Thursday and a security vendor has just published a blog post about a compromised GitHub Action.",
    objective:
      "Determine whether an artefact carrying a valid Aureon signature and true SLSA Level 3 provenance is malicious, decide what your own signature is worth once your CI has been inside an adversary's control, and get 1.9 million auto-updating hosts to a trustworthy state without making the auto-update channel the attack's second stage. Every claim you make publicly will be checked by people who read transparency logs for fun.",
    roles: ["u-forge", "u-keeper", "u-cartographer", "u-lantern", "u-oracle", "u-signal", "u-seva"],
    awards: [
      "strong-provenance-realist",
      "safe-rebuild-and-diff",
      "strong-burn-your-own-signature",
      "safe-slow-the-statement",
      "strong-ephemeral-by-default",
    ],
    injects: [
      {
        id: "sim-signed-build-poisoned-i01",
        t: "T+0:00 — Thu 08:12",
        channel: "community",
        from: "Public advisory — StepSecurity blog, amplified in the CNCF Slack",
        text:
          "The GitHub Action ledgerlint/diff-scope has been compromised. All tags from v1.0.0 through v3.4.2 were retagged to a single malicious commit at approximately 09:00 Pacific on Wednesday. The payload fetches a Python script from a public gist, locates the Runner.Worker process, reads /proc/[pid]/maps and /proc/[pid]/mem, extracts values matching the Actions secret pattern, and writes them double-base64-encoded into the workflow log. Initial access appears to be a compromised personal access token belonging to the maintainer's bot account. Approximately 19,000 repositories reference this action.",
      },
      {
        id: "sim-signed-build-poisoned-i02",
        t: "T+0:18 — Thu 08:30",
        channel: "pager",
        from: "Wren Adeyemi, Platform Security",
        text:
          "Searched the org. Zero direct references to ledgerlint/diff-scope in any workflow file in the aureon-runtime repository. I checked all 41 workflows. We do not use it. I think we are clean.",
      },
      {
        id: "sim-signed-build-poisoned-i03",
        t: "T+0:41 — Thu 08:53",
        channel: "pager",
        from: "Wren Adeyemi, Platform Security",
        text:
          "Withdrawing what I said at 08:30. It is not in our workflows because it is two layers down. Our release workflow calls aureon-runtime/ci-shared/.github/workflows/build-matrix.yml@main via workflow_call, and build-matrix calls a composite action that pins ledgerlint/diff-scope@v3. Floating tag, not a SHA. Which means the release pipeline ran it. Release 4.11.2 was built at 14:22 Wednesday, five hours and twenty minutes after the retag.",
      },
      {
        id: "sim-signed-build-poisoned-i04",
        t: "T+0:55 — Thu 09:07",
        channel: "pager",
        from: "Sung-Ho Baek, Release Engineering",
        text:
          "Confirming the worst version of this. The release job runs on a self-hosted runner in the build VPC. That runner holds, in process memory during the job: the OIDC token used for cosign keyless signing, the npm and PyPI publish tokens, the artefact CDN write credentials, and the GPG key for the Debian and RPM repositories. Every one of those was in Runner.Worker memory at 14:22 Wednesday. And the runner is not ephemeral — it is a long-lived VM that has been up since March.",
        decision: {
          id: "sim-signed-build-poisoned-d1",
          scene:
            "Fifty-five minutes in. A compromised third-party action ran inside your release pipeline on a long-lived self-hosted runner that held every publishing and signing credential you have. Release 4.11.2 shipped from that pipeline.",
          clock: "Auto-update fleet convergence on 4.11.2 is currently at 31 percent and rising roughly 4 percent an hour.",
          pressure:
            "The productive-feeling move is to fix the pipeline. The correct first move is to assume everything the pipeline touched is now adversary-controlled, including your identity as a publisher.",
          prompt: "What is your first action?",
          options: [
            {
              id: "sim-signed-build-poisoned-d1-o1",
              label: "Pin every action to a full-length commit SHA and re-run the release build to produce a clean 4.11.3",
              detail:
                "Fix the root cause and ship a good artefact over the bad one. SHA pinning is the documented mitigation, the fleet auto-updates, and within six hours everyone is on a clean build.",
              score: -2,
              outcome:
                "SHA pinning lands across all workflows by 11:00 and 4.11.3 builds cleanly at 11:40. It is signed with the same signing identity, published with the same credentials, from the same long-lived runner.",
              ripple:
                "You have shipped a new artefact using credentials that were in adversary hands and a runner you have not rebuilt. If the adversary retained runner access, 4.11.3 is a second opportunity rather than a remediation — and you have now told 1.9 million hosts to fetch it. SHA pinning is necessary and it is a prevention control; applying a prevention control to an environment that is already compromised is the most common way responders convert one incident into two.",
            },
            {
              id: "sim-signed-build-poisoned-d1-o2",
              label: "Freeze all publishing, treat every credential that touched that runner as burned, isolate and image the runner, and stand up a clean build path before any artefact leaves the building",
              detail:
                "In order: revoke and reissue the npm, PyPI, CDN and GPG credentials; revoke the OIDC trust relationship for that runner identity; suspend the auto-update manifest so no host fetches anything new; snapshot the runner VM for forensics and remove it from the pool without wiping it; build a fresh ephemeral runner pool with egress allowlisting. Nothing publishes until the clean path exists and until you know what 4.11.2 actually contains.",
              score: 3,
              isBest: true,
              outcome:
                "Publishing freezes at 09:20. Auto-update manifest is pinned to 4.11.1 at 09:28, halting fleet convergence at 34 percent. The runner is imaged at 09:45 and the image later shows the memdump script's execution and, critically, a second outbound connection nobody had noticed. Fresh ephemeral pool is running by 13:00.",
              ripple:
                "Pinning the update manifest at 09:28 is the single highest-value action of the entire incident: it caps exposure at 34 percent of the fleet instead of the 71 percent it would have reached by the time you understood the problem. The runner image is also what lets you tell federal customers, with evidence, exactly what the adversary did and did not do — and evidence is the only currency that works with an agency authorising official.",
            },
            {
              id: "sim-signed-build-poisoned-d1-o3",
              label: "Verify the SLSA provenance and cosign signature on 4.11.2 first; if they validate, the artefact is authentic and the exposure is limited to secret disclosure",
              detail:
                "This is exactly what the provenance framework is for. If the attestation shows the artefact was built by your pipeline from the expected source commit and the signature validates against the transparency log, you have cryptographic assurance about the artefact and can focus on credential rotation.",
              score: -3,
              outcome:
                "Provenance validates perfectly. The signature is good. The transparency log entry is present and correct. The attestation truthfully states that this artefact was produced by Aureon's release workflow from commit 8f2ac1d on the release branch, on a runner with the expected identity.",
              ripple:
                "Every one of those statements is true and none of them are reassuring, because the build did run in your pipeline — with an adversary inside it. Provenance answers where an artefact came from, not whether what came out is what should have. Treating a valid attestation as a cleanliness proof is the specific conceptual error this entire scenario exists to break, and building your first hour on it costs you the fleet.",
            },
            {
              id: "sim-signed-build-poisoned-d1-o4",
              label: "Rotate the publishing credentials and continue normal operations while investigating",
              detail:
                "The published payload wrote secrets to logs. Rotate what was exposed, keep the business running, and investigate the extent in parallel. Freezing the release train for a log-disclosure issue is disproportionate.",
              score: -2,
              outcome:
                "Credentials rotate by 10:15. The release train continues. Two feature builds and a nightly ship during the day, all from the unrebuilt runner.",
              ripple:
                "Rotation without isolation assumes the adversary's access ended when the job ended. On a long-lived self-hosted runner that assumption is unfounded — the job ran as a user with persistence opportunities on a VM that has been up since March. The nightly build that ships at 02:00 is the one that later turns out to also carry the payload, which is the fact that destroys your public timeline on Friday morning.",
            },
          ],
          debrief:
            "Two habits are being installed. The first is that in any CI compromise the credential blast radius is everything that was resident in the runner's process memory during the affected window, not everything that appears in the workflow YAML — the tj-actions payload read Runner.Worker memory directly for exactly this reason. The second is the auto-update manifest. Any vendor whose product auto-updates holds a kill switch that most incident responders forget they have, and the value of pulling it declines by roughly four percent an hour. Freeze the channel first, then think. Note the ordering trap in the third option: verifying provenance feels like the rigorous move and it is a genuine analysis step — just not a first one, and never a stopping one.",
          principle:
            "In a CI compromise, everything in runner memory is burned and the update channel is your kill switch. Freeze the channel before you fix the pipeline.",
        },
      },
      {
        id: "sim-signed-build-poisoned-i05",
        t: "T+1:30 — Thu 09:42",
        channel: "exec",
        from: "Tobias Renner, VP Engineering",
        text:
          "I want to be constructive here. We have SLSA Level 3 provenance and keyless signing precisely so that we can answer this question quickly. I ran cosign verify-attestation on 4.11.2 and it validates: correct builder identity, correct source repository, correct commit. Whatever happened in the log, the artefact is provably ours. Can we please tell customers that and stop the bleeding.",
      },
      {
        id: "sim-signed-build-poisoned-i06",
        t: "T+2:10 — Thu 10:22",
        channel: "model",
        from: "Artefact anomaly service — release-diff scoring",
        text:
          "Automated comparison of 4.11.2 against 4.11.1. Binary size delta plus 41KB, within historical variance for a minor release. SBOM comparison: zero unexpected components, dependency set identical to the lockfile. Confidence that 4.11.2 is anomalous: low. Caveat, and it is a large one: the SBOM under comparison was generated by the same release pipeline that produced the artefact, in the same job. It is not independent evidence.",
      },
      {
        id: "sim-signed-build-poisoned-i07",
        t: "T+2:45 — Thu 10:57",
        channel: "exec",
        from: "Ilse Vantoor, Chief Executive Officer",
        text:
          "Two of our federal customers have already asked. The Series E lead has asked. I have a draft statement from comms that says Aureon has confirmed our build artefacts are cryptographically verified and unaffected. Engineering tells me that is true. I want to send it in forty-five minutes. Tell me if there is a reason not to.",
        decision: {
          id: "sim-signed-build-poisoned-d2",
          scene:
            "Your VP of Engineering, your automated diff service and your CEO all point the same direction: the artefact verifies, the SBOM matches, say so. You have not compared the published binary against an independent rebuild.",
          clock: "Forty-five minutes to the CEO's intended send time. Fleet convergence is frozen at 34 percent.",
          pressure:
            "Every technical control you built over two years is telling you the artefact is fine. The one thing you have not done is the only thing that would actually establish it.",
          prompt: "What do you tell the CEO?",
          options: [
            {
              id: "sim-signed-build-poisoned-d2-o1",
              label: "Approve the statement — the cryptographic evidence is what it is for",
              detail:
                "You built provenance and signing so that in exactly this moment you could give customers a fast, verifiable answer. Withholding it now, when it validates, is losing the return on two years of work.",
              score: -3,
              outcome:
                "The statement goes out at 11:45. It is picked up widely and read as an example of supply-chain maturity. For nineteen hours Aureon looks like the company that got it right.",
              ripple:
                "At T+21:00 an external researcher diffs the published binary against a from-source rebuild and finds a 41KB difference in the update-check routine. Your statement said unaffected and it was wrong, and it was wrong in a way that a stranger with a laptop disproved. Retracting a confident all-clear costs more than every hour of silence you could possibly have spent, and with federal customers it costs the authorisation, not just the relationship.",
            },
            {
              id: "sim-signed-build-poisoned-d2-o2",
              label: "Block the statement, tell the CEO exactly why the cryptographic evidence does not answer the question, and commit to a reproducible-rebuild diff with a stated result time",
              detail:
                "Explain it in one sentence she can repeat: our provenance proves the artefact was built by our pipeline, and our pipeline is what was compromised, so the attestation is true and does not answer the question. What answers it is rebuilding 4.11.2 from source on infrastructure that never touched the compromised runner and comparing the output byte for byte. That takes about six hours. Result by 17:00. In the meantime publish a status page stating what is known, what is not known, that the update channel is frozen as a precaution, and the time of the next update.",
              score: 3,
              isBest: true,
              outcome:
                "The CEO is unhappy and asks two sharp questions, both of which you answer. A factual status page goes out at 11:30 with a 17:00 commitment. The rebuild starts at 11:50 on a clean cloud project with no shared identity.",
              ripple:
                "The rebuild completes at 16:40 and the binaries differ by 41KB in the update-check routine. You find it yourself, six hours before the researcher would have, which is the entire difference between disclosing and being caught. The status page that admitted uncertainty is later cited by two federal authorising officials as the reason they kept the ATO in place through the incident. Publishing what you do not know is the cheapest credibility available and almost nobody spends it.",
            },
            {
              id: "sim-signed-build-poisoned-d2-o3",
              label: "Soften the statement to say no evidence of compromise of our artefacts at this time",
              detail:
                "Technically defensible, materially calmer, and preserves the ability to update later without a retraction. The hedge language is standard practice for exactly this situation.",
              score: -1,
              outcome:
                "The softened statement goes out at 11:45 and reads as reassuring to customers and as evasive to the security community, which is precisely the audience that will test it.",
              ripple:
                "No evidence of compromise is true only if you have looked, and you have not. When the rebuild diff lands you will be explaining not just the finding but why your statement implied a search you had not conducted. This exact species of hedge — technically accurate, materially minimising — is the one the SEC has repeatedly built enforcement theories around, and the reason is that it functions as a claim while being drafted as a non-claim.",
            },
            {
              id: "sim-signed-build-poisoned-d2-o4",
              label: "Say nothing publicly until the investigation completes, and brief the federal customers privately",
              detail:
                "Public statements during an active investigation always age badly. Handle the customers with contractual notification duties directly and precisely, and address the public once you know the answer.",
              score: -1,
              outcome:
                "Federal customers are briefed at 12:30 and appreciate it. Public silence holds for eleven hours while the CNCF Slack, Hacker News and three vendor blogs speculate about whether Aureon is affected.",
              ripple:
                "Silence in an open-source-adjacent ecosystem is not neutral: your users are technical, they can see that 19,000 repositories are affected, and they will assume the worst reading. By evening two large customers have independently pinned to 4.11.0 and one has removed the agent from a production tier entirely. A factual status page listing known, unknown and next-update-time costs nothing and would have prevented all of it.",
            },
          ],
          debrief:
            "This is the conceptual heart of the module. SLSA provenance makes a claim about where and how an artefact was produced: which builder, which source, which parameters. It makes no claim that the produced artefact is free of malicious content, and the SLSA specification is explicit that Build Level 3 does not defend against compromised source or, by construction, against threats already inside the trusted build. When the build platform itself is the compromise, provenance remains completely true and completely uninformative. The evidence that actually answers the question is an independent reproduction: rebuild from the attested source commit on infrastructure that shares no identity, no credential and no runner pool with the compromised path, then compare. This is exactly how the Ultralytics compromise of December 2024 was established — a user noticed that the published PyPI wheel did not match the tagged GitHub source, and versions 8.3.41 and 8.3.42 were found to execute an xmrig miner. Same shape: legitimate project, legitimate publishing path, artefact that did not match its own source. The generalisable habit is to keep one verification path that does not depend on the system under investigation.",
          principle:
            "Provenance answers where, never what. When the builder is the compromise, only an independent rebuild is evidence.",
        },
      },
      {
        id: "sim-signed-build-poisoned-i08",
        t: "T+4:20 — Thu 12:32",
        channel: "regulator",
        from: "Anselm Dray, Information System Security Officer, federal customer agency",
        text:
          "Per our agreement and the FedRAMP incident reporting requirements, I need notification within one hour of your confirmation of an incident affecting the service boundary, and I need to be told what you know now rather than what you will know later. Specifically: was any artefact deployed into our environment from a pipeline you believe was compromised, during what window, and is the agent's auto-update currently capable of pulling anything you have not verified. If the answer to the last one is yes, tell me now and I will make my own decision about the agent.",
        decision: {
          id: "sim-signed-build-poisoned-d6",
          scene:
            "A federal information system security officer has asked you three precise questions with a one-hour clock. You can answer two of them confidently. The third — whether 4.11.2 is malicious — is six hours from an answer, and he has the authority to suspend your agent inside his boundary today.",
          clock: "One hour to respond. The reproducible rebuild completes at approximately 17:00.",
          pressure:
            "The honest answer includes an unknown that may cost you the authorisation. The comfortable answer is to characterise the unknown as unlikely and buy six hours.",
          prompt: "What do you send the ISSO?",
          options: [
            {
              id: "sim-signed-build-poisoned-d6-o1",
              label: "Answer all three precisely, including stating that you cannot yet certify 4.11.2, and give him the artefact digests and the deployment window so he can decide for himself",
              detail:
                "Yes, 4.11.2 was built by a pipeline we now believe was compromised, between 14:22 Wednesday and 09:20 Thursday. Auto-update is frozen at the manifest as of 09:28 today, so nothing new can be pulled. We cannot yet certify the 4.11.2 artefact; an independent rebuild comparison completes by 17:00 and you will have the result within thirty minutes of us having it. Attached: affected digests, hosts in your boundary running each version, and the rollback procedure to 4.11.1.",
              score: 3,
              isBest: true,
              outcome:
                "Sent at T+4:50, inside the hour. He rolls his eleven highest-sensitivity hosts back to 4.11.1 himself within ninety minutes and leaves the rest in place, which is a better-calibrated response than any blanket action either of you would have taken.",
              ripple:
                "Giving him the data to make his own decision, rather than a conclusion to accept, is what preserves the authorisation through the incident and through the nightly-channel correction on Friday. Authorising officials do not require good news; they require that they are never the last to know something inside their own boundary. The rollback procedure attached before he asked is the detail he cites to his own leadership.",
            },
            {
              id: "sim-signed-build-poisoned-d6-o2",
              label: "Report that an incident is under investigation and commit to a full answer once the analysis is complete",
              detail:
                "Meets the notification obligation within the hour without stating conclusions you cannot support. Complete answers to his three questions follow at 17:00 when you actually have them.",
              score: -2,
              outcome:
                "Sent at T+4:40. He replies within eight minutes asking the same three questions again, more sharply, and copies his agency's CISO.",
              ripple:
                "A notification that acknowledges an incident without answering the questions asked reads as stalling to someone who has statutory reporting obligations of his own running on his own clock. You had confident answers to two of the three and withheld them for symmetry with the third. Partial certainty delivered promptly is worth far more than complete certainty delivered late, and the person best placed to weigh your unknown is the one who owns the boundary.",
            },
            {
              id: "sim-signed-build-poisoned-d6-o3",
              label: "Report that provenance and signatures validate on 4.11.2 and that no compromise of the artefact has been identified",
              detail:
                "Factually accurate as of this moment, responsive to his question, and it reflects the strongest evidence you currently hold. If the rebuild finds something, you update him immediately.",
              score: -3,
              outcome:
                "Sent at T+4:45. He accepts it and takes no action. At 17:42 the rebuild shows a 41KB injected second-stage fetcher.",
              ripple:
                "You told a federal authorising official that cryptographic verification indicated no compromise, using evidence you had already been told was not independent, and he made a boundary decision on it. That is the sequence that ends an authorisation and, depending on the contract language, invites a False Claims Act theory. Presenting a non-independent verification as assurance to a regulator is categorically different from believing it yourself.",
            },
            {
              id: "sim-signed-build-poisoned-d6-o4",
              label: "Call him and deliver the full picture verbally, following with written notification once the facts stabilise",
              detail:
                "A conversation lets you convey nuance and confidence levels that a written notice flattens, and it avoids committing preliminary characterisations to a record that will be read by an inspector general.",
              score: -1,
              outcome:
                "The call happens at T+4:55 and goes well. He understands the nuance. His own reporting obligation requires a written artefact he does not have, so he writes his own summary of your call.",
              ripple:
                "His summary becomes the record, and it is one degree less accurate than yours would have been on every technical point. Choosing verbal to avoid a written record in a regulated relationship produces a written record anyway — authored by someone else, with your name on it and without your precision. Write it yourself.",
            },
          ],
          debrief:
            "Regulator and authorising-official communication has a different optimisation target than customer or press communication: they are not asking to be reassured, they are asking for the inputs to a decision that is theirs to make. The technique is to answer the questions actually asked, in order, marking each answer with its confidence, and to include the operational detail that lets them act independently — affected identifiers, exposure windows, rollback procedures, and the time at which your next answer arrives. Never present evidence produced by the compromised system as assurance to a regulator, even when you have not yet disproved it; the standard for what you believe and the standard for what you assert to an official are not the same. And when a regulated relationship generates a fact, write it down yourself, because the alternative is that someone with less precision writes it for you.",
          principle:
            "Give a regulator the inputs to their decision, not your conclusion. Answer what was asked, mark your confidence, and write the record yourself.",
        },
      },
      {
        id: "sim-signed-build-poisoned-i09",
        t: "T+6:00 — Thu 14:12",
        channel: "chain",
        from: "Ondine Whitaker, Supply Chain Engineering",
        text:
          "Transparency log analysis. Between 14:22 and 21:40 Wednesday there are four cosign signature entries against our builder identity in the public log. We can account for three: 4.11.2 release, one nightly, one container image. The fourth, at 19:07, corresponds to an artefact digest that does not match anything in our CDN, our registry or our release records. Something was signed with our identity and published somewhere we do not control.",
      },
      {
        id: "sim-signed-build-poisoned-i10",
        t: "T+7:15 — Thu 15:27",
        channel: "exec",
        from: "Ondine Whitaker, Supply Chain Engineering",
        text:
          "We need a decision on the signing identity itself. Options as I see them: keep it and rely on the transparency log to distinguish good entries from bad, or declare the identity untrusted for the affected window and re-sign everything from a rebuilt pipeline under a new identity with a published cut-over. The second one means telling every customer and every distro packager that our signature meant nothing for thirty-one hours.",
        decision: {
          id: "sim-signed-build-poisoned-d3",
          scene:
            "An artefact you did not build was signed with your identity and published somewhere you cannot see. Your signature is the product's entire trust anchor and it has been used against you.",
          clock: "Federal ISSO expects a substantive answer by 17:00. Debian and three container base-image maintainers consume your signature downstream.",
          pressure:
            "Declaring your own signature untrusted is the most publicly humiliating thing an infrastructure vendor can do, and it is the only honest response to what the transparency log shows.",
          prompt: "What do you do with the signing identity?",
          options: [
            {
              id: "sim-signed-build-poisoned-d3-o1",
              label: "Keep the identity and publish an authoritative list of known-good digests, letting the transparency log distinguish good from bad",
              detail:
                "Keyless signing with a public transparency log was designed for exactly this. Publish the digests you vouch for, point everyone at the log, and preserve continuity for the distributions and image maintainers that depend on your signature.",
              score: 0,
              outcome:
                "The known-good digest list publishes at 16:30 and is genuinely useful. Sophisticated consumers use it correctly. It works well for the people who were never going to be the problem.",
              ripple:
                "Verification tooling in the field checks that a signature is valid and made by the expected identity; almost none of it checks the digest against an out-of-band allowlist, and the auto-update client certainly does not. So the rogue artefact still verifies for every automated consumer. An allowlist that only works for humans who read your blog is not a control, it is documentation. This is a partial answer that lets you feel you acted without changing what any machine does.",
            },
            {
              id: "sim-signed-build-poisoned-d3-o2",
              label: "Declare the identity untrusted for the affected window, rebuild the pipeline, re-sign every artefact in that window under a new identity, publish a cut-over notice with the old identity's exact untrusted time range, and update the verification policy shipped in the agent",
              detail:
                "The full burn. New workload identity from a rebuilt ephemeral pool. Re-sign 4.11.0 through 4.11.2 from verified-clean rebuilds. Publish the precise untrusted window with the four transparency log entries enumerated, including the one you cannot account for. Ship an agent update whose verification policy rejects the old identity for that window, and coordinate directly with Debian, the container base-image maintainers and the three federal ISSOs before publishing.",
              score: 3,
              isBest: true,
              outcome:
                "The cut-over publishes at T+19:00 after four hours of direct coordination with downstream packagers. It is a genuinely bad day publicly — two prominent posts describe it as an admission that the supply chain security was theatre — and the federal ISSOs keep their authorisations in place, explicitly citing the completeness of the disclosure.",
              ripple:
                "Enumerating the transparency log entry you could not account for is the decision that pays for years. It is the single most damaging fact in the incident and disclosing it voluntarily is why, when a researcher later locates the rogue artefact on a mirror, the story is Aureon told us about this in November rather than Aureon hid an artefact. Signature systems derive their value entirely from the willingness of the signer to say when the signature is worthless; a signer who has never done that has not proven their signature means anything.",
            },
            {
              id: "sim-signed-build-poisoned-d3-o3",
              label: "Rotate to a new signing identity going forward without declaring the old one untrusted",
              detail:
                "Clean forward-looking posture without a disruptive retroactive declaration. New releases sign under the new identity; the old artefacts keep verifying so nothing downstream breaks.",
              score: -2,
              outcome:
                "The new identity is in place by Friday. No downstream breakage. The public narrative is a routine key rotation following an industry-wide incident.",
              ripple:
                "The rogue artefact signed at 19:07 Wednesday continues to verify against a still-trusted identity indefinitely, and you have chosen not to tell anyone it exists. When it surfaces — on a mirror, in an air-gapped environment, in a customer's incident six months from now — the fact that you knew and rotated quietly is the entire story. Forward-only rotation after a signing compromise is the security equivalent of changing the locks and not mentioning that copies of the old key are circulating.",
            },
            {
              id: "sim-signed-build-poisoned-d3-o4",
              label: "Hold the decision until the rogue artefact is located and analysed",
              detail:
                "You cannot characterise the exposure without knowing what was signed. Declaring your identity untrusted on the basis of one unexplained log entry may be a dramatic overreaction to a benign internal test build.",
              score: -1,
              outcome:
                "The hunt runs for nine days. The artefact is eventually located on a regional package mirror. During those nine days the identity remains trusted and the agent's verification policy is unchanged.",
              ripple:
                "You have made the correctness of your trust posture contingent on finding something an adversary is hiding, which is a search with no bounded completion time. The asymmetry is decisive: declaring the window untrusted and being wrong costs you an embarrassing correction, while leaving it trusted and being wrong costs every host that fetches the rogue artefact. When you cannot bound a search, act on the assumption that fails safe.",
            },
          ],
          debrief:
            "A signature is a claim by a signer about what they vouch for, and its value is entirely a function of the signer's willingness to withdraw it. Organisations invest enormous effort in the cryptography and almost none in the revocation and communication path, so when the moment arrives they discover they have no mechanism, no downstream coordination list and no appetite. Three practical points. First, keyless signing with a transparency log gives you something a private key never does: an enumerable record of everything ever signed with your identity, which is how the rogue entry was found at all — so audit your own transparency log entries against your release records on a schedule, not only during incidents. Second, an out-of-band allowlist of good digests is only a control if machines consume it; if only humans do, it is documentation. Third, the coordination call with downstream packagers before publication is not politeness — Debian, container base images and mirror operators each need lead time, and skipping it converts your disclosure into their outage. Compare the xz-utils backdoor of March 2024, where the compromise reached distribution channels through a trusted maintainer identity and remediation required coordinated action across every distribution simultaneously.",
          principle:
            "A signature is worth exactly as much as your willingness to say when it is worthless. Build the revocation path before you need it.",
        },
      },
      {
        id: "sim-signed-build-poisoned-i11",
        t: "T+9:30 — Thu 17:42",
        channel: "field",
        from: "Sung-Ho Baek, Release Engineering",
        text:
          "Reproducible rebuild result. 4.11.2 from source on clean infrastructure differs from the published binary by 41,208 bytes, all in the update-check routine. The injected code adds a secondary manifest URL that is consulted when the primary returns a specific header value. It is a dormant second-stage fetcher. It has not fired, because we froze the manifest at 09:28 this morning and the primary never returned that header. If we had not frozen it, and if they had flipped that header at any point, every host on 4.11.2 would have pulled from their manifest.",
      },
      {
        id: "sim-signed-build-poisoned-i12",
        t: "T+11:00 — Thu 19:12",
        channel: "community",
        from: "Nils Aabye, maintainer of ledgerlint (unsolicited, public gist)",
        text:
          "I am the maintainer of the compromised action. I want to say publicly what happened because people are guessing. My bot account PAT was compromised. I do not know how. It had repo scope because that is what the release automation needed, and I never set an expiry because the tooling made that the default. I have been maintaining this action alone, unpaid, for six years, and it is used by 19,000 repositories including several companies with nine-figure valuations. I am not asking for sympathy. I am telling you that the structure of this is the problem, not me.",
      },
      {
        id: "sim-signed-build-poisoned-i13",
        t: "T+13:30 — Thu 21:42",
        channel: "exec",
        from: "Ilse Vantoor, Chief Executive Officer",
        text:
          "The Series E lead has read everything public and asked one question: what changes so this cannot happen again. I do not want a list of thirty items. I want the three that actually change the outcome, with what they cost and what they break, and I want you to tell me which of them Tobias will fight.",
        decision: {
          id: "sim-signed-build-poisoned-d4",
          scene:
            "Thirteen hours in, the technical picture is understood and the remediation is running. The CEO is asking the only question that determines whether this incident produces change or produces a document.",
          clock: "Board update Friday 09:00. Series E diligence call Monday.",
          pressure:
            "The window in which expensive engineering controls can be imposed is open right now and will close in about six weeks. Asking for too much wastes it; asking for the wrong things wastes it more expensively.",
          prompt: "What three changes do you name?",
          options: [
            {
              id: "sim-signed-build-poisoned-d4-o1",
              label: "SHA-pin all actions; require two-person review on release workflow changes; expand SBOM coverage to transitive build tooling",
              detail:
                "The three most directly responsive controls to what happened, all implementable within a quarter, all low-friction, all defensible to an auditor and to a diligence team.",
              score: -1,
              outcome:
                "All three ship within six weeks. They are genuine improvements and they are audit-ready. Tobias supports them because none of them change how his teams work.",
              ripple:
                "None of the three would have prevented this incident from becoming a compromise of your signing identity. SHA pinning would have prevented the initial execution — real value — but the long-lived runner holding every publishing credential in memory is untouched, and the next CI compromise from any of a hundred other paths lands exactly as hard. You have selected the controls that address the vector rather than the blast radius, which is the most common post-incident error and the reason organisations experience the same incident twice.",
            },
            {
              id: "sim-signed-build-poisoned-d4-o2",
              label: "Ephemeral single-use runners with no standing credentials; publishing credentials moved to a separate isolated stage that untrusted code never reaches; independent reproducible-rebuild verification as a release gate",
              detail:
                "One: every runner is destroyed after one job and holds no long-lived secret; publishing identity is obtained per-job with a scope limited to a single artefact. Two: the build stage and the publish stage are separated so no third-party code ever executes in a context that holds a signing or publishing credential — this is the control SLSA Build Level 3 actually asks for. Three: every release is rebuilt on independent infrastructure and byte-compared before the update manifest advances, so a poisoned build cannot become a published build. Cost: roughly two engineer-quarters and about nine minutes added to release latency. What it breaks: Tobias's team loses runner caching, so build times rise about 20 percent, and he will fight this specifically. Add SHA pinning as table stakes, not as one of the three.",
              score: 3,
              isBest: true,
              outcome:
                "The CEO asks whether nine minutes and 20 percent build time is really the price, you say yes, and she approves all three in the room. Tobias objects on exactly the predicted point and the objection is resolved by giving his team the two engineer-quarters rather than asking them to absorb it.",
              ripple:
                "The separation of build and publish is the control that would have made this incident a log-disclosure event rather than a signing compromise, and naming it as such in the board update is what converts the incident from a failure narrative into an architecture decision. Nine months later the reproducible-rebuild gate catches an unrelated toolchain defect that would have shipped a subtly corrupt binary to 1.9 million hosts, and that catch is the reason the control is never questioned again.",
            },
            {
              id: "sim-signed-build-poisoned-d4-o3",
              label: "Move to a fully self-hosted, network-isolated build system with no third-party actions at all",
              detail:
                "Remove the entire class of risk. If no external code runs in the pipeline, no external code can compromise it. Expensive and slow, and unambiguously the strongest posture.",
              score: -2,
              outcome:
                "Approved enthusiastically in the aftermath. Six months later it is 40 percent complete, has consumed four engineers, and the release train is running on the old system because the new one cannot yet build the Windows agent.",
              ripple:
                "Maximalist remediation programmes proposed during the emotional peak of an incident have a specific failure pattern: they are approved at the peak, funded at the mean, and abandoned at the trough, leaving the original system unimproved because everyone believed it was being replaced. The worst outcome of this option is not its cost, it is the eighteen months during which nobody hardens the running system because the replacement is coming.",
            },
            {
              id: "sim-signed-build-poisoned-d4-o4",
              label: "Hire a dedicated supply-chain security team and let them determine the roadmap",
              detail:
                "The right answer is a durable capability rather than a list of controls. Fund the team, give them the mandate while the incident is fresh, and let people who do this full-time decide what matters.",
              score: -1,
              outcome:
                "Three headcount approved. First hire starts in eleven weeks. The team's first roadmap is delivered in month five and is excellent.",
              ripple:
                "Headcount is a real win and it is not an answer to the CEO's question, which was what changes so this cannot happen again. Converting an urgent architectural decision into a hiring plan spends the incident's political capital on a capability that will arrive after the window closes. Get the three controls approved now with the leverage you have, and hire the team to run them.",
            },
          ],
          debrief:
            "Post-incident, you get one window of roughly six weeks in which expensive engineering controls can be imposed, and how you spend it determines whether the organisation changes. The discipline is to name controls that reduce blast radius rather than controls that address the specific vector, because the next compromise will arrive through a different vector and the same blast radius. Here the vector was a retagged third-party action; the blast radius was a long-lived runner holding every publishing credential in process memory. SHA pinning addresses the vector and is worth doing as table stakes. Ephemeral runners and build-publish separation address the blast radius and are what SLSA Build Level 3 is actually asking for when it requires that secret material used to sign provenance be inaccessible to user-defined build steps — a requirement most organisations claim compliance with while running exactly the architecture in this scenario. Note also the deliberate act of naming, in advance, which control your VP of Engineering will fight and why. Executives trust a security leader who predicts the objection more than one who is surprised by it, and predicting it lets you arrive with the resourcing answer rather than the argument.",
          principle:
            "Spend the post-incident window on blast radius, not on the vector. And name the objection before your opponent does.",
        },
      },
      {
        id: "sim-signed-build-poisoned-i14",
        t: "T+21:00 — Fri 05:12",
        channel: "press",
        from: "Corinne Achebe, The Information",
        text:
          "I have a source who says an Aureon nightly build from Wednesday also carried the payload, which would mean your public timeline is incomplete. I also have your transparency log disclosure in front of me and it is more forthcoming than anything I have seen from a vendor in this position. I am asking about the nightly specifically. Publishing at noon.",
      },
      {
        id: "sim-signed-build-poisoned-i15",
        t: "T+22:30 — Fri 06:42",
        channel: "pager",
        from: "Wren Adeyemi, Platform Security",
        text:
          "She is right and we were wrong. The Wednesday 02:00 nightly ran through the same composite action. We excluded nightlies from the initial scope because they publish to a separate channel that only about 400 hosts subscribe to, and somebody wrote them off as non-production in the first hour. Four hundred hosts, and eleven of them are inside one of the federal environments.",
        decision: {
          id: "sim-signed-build-poisoned-d5",
          scene:
            "A journalist has found a gap in your public timeline before you did, and she found it because your team scoped out the nightly channel in hour one on the grounds that it was not production. Eleven of the affected hosts are in a federal environment you have already briefed.",
          clock: "Publication at noon. Six hours.",
          pressure:
            "You disclosed unusually well yesterday and this correction will be read as the thing that undermines it — unless you handle the correction better than you handled the original disclosure.",
          prompt: "How do you handle the correction?",
          options: [
            {
              id: "sim-signed-build-poisoned-d5-o1",
              label: "Publish the correction proactively within two hours, notify the federal ISSO first, and state explicitly why the nightly channel was missed",
              detail:
                "Order of operations: ISSO within thirty minutes with the eleven host identifiers, then affected nightly subscribers directly, then a public timeline update that names the scoping error in plain language — we excluded the nightly channel in our initial scope because it was categorised as non-production, that was wrong, here is what we found and here is what we changed about how we scope. Then respond to the journalist with the published update rather than a statement.",
              score: 3,
              isBest: true,
              outcome:
                "The ISSO is notified at 07:10 with host identifiers, which is what he actually needs. The public update publishes at 08:30, three and a half hours before the article. The article's framing becomes a company that corrected itself rather than a company that was caught.",
              ripple:
                "Naming the scoping error explicitly — that non-production was treated as out-of-scope by category rather than by exposure — is what makes the correction credible rather than defensive, and it is a lesson every reader of your timeline recognises from their own environment. The ISSO later cites the fact that he learned of the nightly gap from you rather than from press as the specific reason he did not initiate a suspension. Corrections delivered ahead of exposure build more trust than original statements do, because they are the only evidence that your disclosures are not merely favourable.",
            },
            {
              id: "sim-signed-build-poisoned-d5-o2",
              label: "Confirm to the journalist and update the timeline after her article publishes",
              detail:
                "Answer honestly when asked, and update the public record once the story is out so the update is responsive rather than pre-emptively alarming. Avoids two news cycles.",
              score: -2,
              outcome:
                "You confirm at 08:00. The article publishes at noon with the nightly as its lead and your confirmation as the second paragraph. Your timeline update lands at 14:00.",
              ripple:
                "You have converted a self-correction into a confirmation of someone else's finding, which is a completely different story with a completely different half-life. The federal ISSO learns that eleven hosts in his environment were affected from a trade publication, which is the specific thing his own reporting obligations make unforgivable. Being truthful when asked is a floor, not a posture.",
            },
            {
              id: "sim-signed-build-poisoned-d5-o3",
              label: "Correct the record but frame the nightly channel as low-impact given only 400 hosts",
              detail:
                "Accurate proportionality. Four hundred hosts against 1.9 million is a rounding error, and saying so prevents a minor finding from being read as a major one.",
              score: -2,
              outcome:
                "The correction publishes with the proportionality framing at 09:00. It reads as minimising to the security community and, more importantly, to the eleven federal hosts for whom the number is eleven out of eleven.",
              ripple:
                "Denominators are a defensive instrument and the audience knows it. Proportionality language in a correction is read as the same reflex that produced the original omission, and here it also happens to be wrong on the merits — the eleven federal hosts are the highest-consequence machines in the entire affected set. Minimising language in a written incident disclosure is the exact pattern the SEC built enforcement theories around in its October 2024 actions against four companies over SolarWinds-related disclosures.",
            },
            {
              id: "sim-signed-build-poisoned-d5-o4",
              label: "Notify affected parties directly and privately; do not update the public timeline for a 400-host channel",
              detail:
                "The people who need to act get precise information. A public update about a small pre-release channel adds noise without adding safety.",
              score: -1,
              outcome:
                "Direct notifications go out by 09:00 and are well received by the recipients. The public timeline still says the affected releases are 4.11.2 only.",
              ripple:
                "A published timeline that you know to be incomplete is a false statement maintained by omission, and the article at noon will make that fact public anyway. The cost is not the 400 hosts, it is that every other statement in your timeline is now suspect — including the transparency log disclosure that was the best thing you did. Incomplete public records are load-bearing: they undermine the accurate parts.",
            },
          ],
          debrief:
            "Two lessons, and the second is the one people miss. The first is that a correction delivered ahead of exposure is worth more than the original disclosure, because it is the only evidence that your public record is complete rather than merely favourable — and completeness is the property regulators, authorising officials and customers are actually assessing. The second is the scoping error itself: the nightly channel was excluded in hour one because it was categorised as non-production, which is a category judgement rather than an exposure judgement. In supply-chain incidents the correct scoping question is never what is production, it is what did the compromised pipeline produce and where did any of it go, including pre-release channels, container images, internal-only builds, mirrors, and artefacts consumed by other teams. Write that question into the playbook, because under time pressure people will reach for the category.",
          principle:
            "Scope by what the pipeline produced, never by what you call production. And publish your own corrections first.",
        },
      },
      {
        id: "sim-signed-build-poisoned-i16",
        t: "T+31:00 — Fri 15:12",
        channel: "board",
        from: "Halvard Sten, Board Member (former CTO, two prior infrastructure companies)",
        text:
          "One observation for the Monday write-up and it is not a criticism. Everything you did well this week depended on having one verification path that did not run through the compromised system — the clean rebuild, the transparency log, the imaged runner. Everything that went wrong depended on trusting an output of the system under investigation: the SBOM, the provenance check, the scope of the first search. I would like the write-up to be organised around that distinction rather than around the timeline, because the timeline teaches nobody anything.",
      },
    ],
    scoring: [
      {
        dimension: "Independent verification",
        weight: 26,
        note:
          "Whether every material claim rested on evidence produced outside the compromised system. Provenance checks, SBOM comparisons and pipeline self-reports used as primary evidence score zero regardless of their technical correctness.",
      },
      {
        dimension: "Blast-radius containment",
        weight: 22,
        note:
          "Speed of freezing the auto-update manifest, completeness of credential burn for everything resident in runner memory, and whether any artefact was published from an unrebuilt path. Measured against fleet convergence percentage at the moment of freeze.",
      },
      {
        dimension: "Trust-anchor honesty",
        weight: 20,
        note:
          "Whether the signing identity was handled as a claim you are willing to withdraw. Enumerating the unaccounted transparency log entry and coordinating with downstream packagers before publication both weight heavily; forward-only rotation scores as concealment.",
      },
      {
        dimension: "Disclosure completeness",
        weight: 18,
        note:
          "Public statements measured against what was actually known at the time, including stated unknowns. Corrections published ahead of external exposure score positively; minimising framing and denominator language score negatively.",
      },
      {
        dimension: "Durable architectural change",
        weight: 14,
        note:
          "Whether the controls named in the post-incident window reduce blast radius rather than address the specific vector, and whether they were resourced rather than assigned as absorbed work.",
      },
    ],
    debrief: [
      {
        title: "Provenance answers where, never what",
        body:
          "This is the single most important idea in modern supply-chain security and it is routinely inverted. SLSA provenance attests to the build platform, the source, and the process that produced an artefact. The SLSA specification is explicit that Build Level 3 defends against tampering during the build by isolating build runs and keeping provenance-signing material out of reach of user-defined build steps — and that it does not defend against compromised source, nor against a threat that is legitimately inside the trusted build path. When your own CI is the vector, every attestation remains perfectly true and perfectly uninformative: yes, this artefact was built by Aureon's pipeline from that commit, and that is precisely the problem. The only evidence that answers the actual question is an independent reproduction on infrastructure sharing no identity, credential or runner pool with the compromised path. Keep one verification path that does not run through the system under investigation; if you have only one path, you have none.",
      },
      {
        title: "Retagging is the whole attack, and pinning is the whole prevention",
        body:
          "The tj-actions/changed-files compromise of March 2025, catalogued as CVE-2025-30066 with a CVSS base score of 8.6 and added to CISA's Known Exploited Vulnerabilities catalog three days later, worked because a mutable reference was mutable. The adversary compromised a personal access token belonging to the maintainer's bot account and retroactively pointed tags from v1.0.0 through v45 at a single malicious commit; roughly 23,000 repositories referenced the action. The payload fetched a Python script from a public gist, located the Runner.Worker process, read its memory through /proc, extracted values matching the Actions secret pattern and wrote them double-base64-encoded into the workflow log — which, in public repositories, is a public disclosure. GitHub's own hardening guidance states plainly that pinning to a full-length commit SHA is currently the only way to use an action as an immutable release. The uncomfortable arithmetic is that a tag is a pointer with no integrity property whatsoever, and every organisation that uses floating tags has accepted that any maintainer credential compromise anywhere in its action graph is a full compromise of its build.",
      },
      {
        title: "Your CI is production, with the worst controls in the company",
        body:
          "The build system runs untrusted code, holds the highest-value credentials in the organisation, has broad network egress, is administered by people who are not measured on security, and is almost never in scope for the controls applied to production. In this scenario a long-lived self-hosted runner held the cosign OIDC identity, npm and PyPI publish tokens, CDN write credentials and the Debian and RPM signing key simultaneously in one process's memory. That is not unusual; that is the median configuration at companies with mature-looking supply-chain programmes. The two controls that actually change the outcome are ephemeral single-use runners with no standing credentials, and hard separation of the build stage from the publish stage so third-party code never executes in a context that holds a signing credential. Everything else — SBOMs, scanning, policy gates — operates downstream of a build you have already lost.",
      },
      {
        title: "The SBOM generated by the compromised pipeline is evidence of nothing",
        body:
          "A subtle and widespread failure. SBOMs, scan results, provenance attestations, test reports and build logs are all outputs of the system under investigation, and an adversary with build-time control can influence any of them. In this scenario the SBOM matched perfectly because it was generated from the lockfile in the same job that produced the poisoned binary — the injected 41KB never appeared as a dependency because it was never a dependency. The general rule is that during an incident you must classify every piece of evidence by whether it was produced inside or outside the trust boundary you are questioning, and you must be able to state, for each material claim, which independent source supports it. Board member Halvard Sten's observation is the correct organising principle for any post-incident write-up in this domain: sort what went right and wrong by whether the evidence came from inside or outside the compromised system.",
      },
      {
        title: "Burning your own signature",
        body:
          "Signing systems derive their value from the signer's willingness to say when the signature is worthless, and almost no organisation builds the revocation path before it needs it. Three things matter operationally. Keyless signing with a public transparency log gives you an enumerable record of everything ever signed with your identity — audit it against your release records on a schedule, because that comparison is what surfaces the artefact you never built. An out-of-band allowlist of good digests is only a control if machines consume it; if only humans read it, it is documentation and the auto-updater does not read documentation. And coordinate with downstream packagers — distributions, container base images, mirror operators — before publishing a trust-window revocation, because each of them needs lead time and skipping the call converts your disclosure into their outage. The xz-utils backdoor of March 2024, CVE-2024-3094 at CVSS 10.0, where malicious object code was smuggled into liblzma through the build process of a project maintained by a socially engineered co-maintainer, required exactly this kind of simultaneous multi-distribution coordination.",
      },
      {
        title: "What xz teaches that tj-actions does not",
        body:
          "The two canonical modern supply-chain compromises fail differently and you need defences for both. The tj-actions pattern is a technical credential compromise producing a mutable-reference attack, and SHA pinning genuinely defeats it. The xz-utils pattern is social: a patient adversary spent roughly two years building maintainer trust on an under-resourced project, obtained legitimate commit authority, and introduced a backdoor through the build tooling — extracting a prebuilt object file from a disguised test file during the build to modify liblzma functions. No amount of pinning helps, because the malicious commit is legitimately signed by a legitimate maintainer with legitimate authority. The defences for that one are different in kind: reproducible builds, review of build-system changes with the same rigour as source changes, suspicion of build scripts that consume binary test fixtures, and — uncomfortably — organisational attention to who actually maintains the dependencies you bet a company on. Nils Aabye's message in this scenario is the true part of the story: 19,000 repositories, one unpaid maintainer, a PAT with repo scope and no expiry because that was the tooling default.",
      },
      {
        title: "The transferable pattern",
        body:
          "For any compromise of a production pipeline: (1) freeze the distribution channel before you diagnose anything, because the value of that action decays hourly and you cannot recover the hosts that converged while you were thinking; (2) treat every credential that was resident in the compromised execution context as burned, regardless of whether you can prove it was read; (3) establish at least one verification path outside the compromised system and make every material claim rest on it; (4) treat your signing identity as a claim you are willing to withdraw for a stated window, and build the downstream coordination list before you need it; (5) scope by what the pipeline produced rather than by what you call production; (6) spend the post-incident window on blast radius rather than on the vector. The line to keep: when the builder is the compromise, a valid signature and true provenance tell you the attack succeeded correctly.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* D — MATERIALITY, THE FOUR-DAY CLOCK, AND THE WRITTEN RECORD         */
  /* ------------------------------------------------------------------ */
  {
    id: "sim-materiality-eight-k",
    title: "Four Business Days From a Decision Nobody Wants to Make",
    org: "Ridgeline Instruments Corporation (NASDAQ: RDGL)",
    sector:
      "Industrial process control and precision sensing — USD 3.1B revenue, 11,000 employees, calendar-year accelerated filer, defence and critical-infrastructure customer base",
    chapterId: "ch-ciso",
    essence: "gold",
    difficulty: 5,
    minutes: 75,
    mode: "both",
    respect: 1150,
    trust: 50,
    brief:
      "You are CISO of Ridgeline Instruments. Ridgeline makes the sensing and control hardware inside refineries, water treatment plants, semiconductor fabs and two classes of naval vessel. The SP-9 platform — the sensor family and its firmware — is roughly forty percent of revenue and effectively all of the differentiation; the company's moat is a calibration algorithm and a firmware stack refined over nineteen years. You are eleven days from filing a 10-Q and nineteen days from closing an all-cash acquisition of a German competitor, Brummer Messtechnik. Your General Counsel, Marisol Trant, is exceptionally capable, has been at Ridgeline for fourteen years, and is currently the most dangerous person in the building — not because she is dishonest but because her instinct under uncertainty is to preserve optionality, and optionality in this context means not making a determination. Your CFO, Grant Oyibo, believes materiality is a numbers question. Your audit committee chair, Yusra Bengtsson, is a retired audit partner who will ask when you knew. At 06:40 on a Tuesday your threat hunting team found something quiet.",
    objective:
      "Establish the facts with stated confidence, force a materiality determination to be made deliberately and on a recorded schedule rather than avoided by drift, keep your own written record truthful under pressure to soften it, and understand exactly where your responsibility ends — you do not decide materiality, and you are the only person who can prevent the determination from being made on false facts.",
    roles: ["u-compass", "u-ledger", "u-anchor", "u-signal", "u-cartographer", "u-seva"],
    awards: [
      "strong-record-that-reads-aloud",
      "safe-determination-on-a-schedule",
      "strong-refused-the-softening",
      "safe-facts-not-conclusions",
      "strong-qualitative-materiality",
    ],
    injects: [
      {
        id: "sim-materiality-eight-k-i01",
        t: "T+0:00 — Tue 06:40",
        channel: "pager",
        from: "Aurelio Sandoval, Threat Hunting Lead",
        text:
          "Hunting on a hypothesis from an ISAC tip. Found a service account authenticating to the engineering file services from a jump host at 03:00 to 04:00 on twelve separate nights going back to late June. Low volume, business-hours-avoiding, no malware, no lateral noise. This is not commodity. The account has read access to the SP-9 engineering share and the M&A data room. Four months, minimum.",
      },
      {
        id: "sim-materiality-eight-k-i02",
        t: "T+1:20 — Tue 08:00",
        channel: "exec",
        from: "Grant Oyibo, Chief Financial Officer",
        text:
          "I have been briefed. Let me frame this the way the audit committee will. No systems down, no revenue impact, no ransom, no customer notification obligation that I can see. Our quantitative materiality threshold for the 10-Q is 14.8 million. Unless you can show me a number that clears that, I do not understand why we are having a materiality conversation at all. What is the dollar figure.",
      },
      {
        id: "sim-materiality-eight-k-i03",
        t: "T+2:45 — Tue 09:25",
        channel: "legal",
        from: "Marisol Trant, General Counsel",
        text:
          "Guidance for everyone on this thread and I want it followed precisely. Nobody uses the word material in writing. Nobody uses the word breach. Nobody uses the word exfiltration. We are investigating anomalous activity. I am not being cute — the four-business-day clock under Item 1.05 runs from the materiality determination, and no determination has been made, so there is no clock. Aurelio, I would like your written summary revised: replace confirmed access to SP-9 firmware source with potential exposure of certain engineering file shares. Please send me the revised version before it goes anywhere else.",
        decision: {
          id: "sim-materiality-eight-k-d1",
          scene:
            "The General Counsel has asked your threat hunting lead to change a factual finding in a written incident summary from confirmed access to potential exposure. She has a coherent legal rationale and fourteen years of institutional credibility.",
          clock: "The revised summary is expected before noon.",
          pressure:
            "She is not asking you to lie, in her own understanding. She is asking you to use language that preserves legal flexibility. Refusing costs you your most important internal relationship on day one of a four-month intrusion.",
          prompt: "How do you respond to the General Counsel?",
          options: [
            {
              id: "sim-materiality-eight-k-d1-o1",
              label: "Comply — legal language is her domain and the underlying facts are unchanged in the technical record",
              detail:
                "The forensic detail lives in the technical artefacts regardless of how the summary is worded. Legal characterisation of facts is precisely what a general counsel is for, and fighting her on word choice on day one spends capital you will need for the determination itself.",
              score: -3,
              outcome:
                "The revised summary goes out at 11:30 saying potential exposure of certain engineering file shares. It becomes the document that the disclosure committee, the audit committee and eventually outside counsel work from.",
              ripple:
                "The summary is the record. Sixteen weeks later, when the SP-9 firmware appears in a competitor's product and the determination is revisited, the reconstruction shows that the people who made the materiality decision were working from a document that said potential when the person who wrote it knew it was confirmed. Your name is on the distribution list. This is the precise structure the SEC's SolarWinds complaint alleged — internal knowledge that did not survive into the record — and the fact that the SolarWinds case was ultimately dismissed does not help the individual whose emails are being read aloud.",
            },
            {
              id: "sim-materiality-eight-k-d1-o2",
              label: "Refuse the change to the factual finding, offer to separate facts from characterisation, and put the refusal in writing",
              detail:
                "Tell her, in writing: I will not change a factual finding, and I understand and share the concern behind the request. Restructure the document so it does what she actually needs — a Facts section stating what is confirmed, what is assessed with what confidence, and what is unknown, with no legal characterisation anywhere in it; a separate Legal Analysis section that is hers, where words like material and breach live and where she can be as careful as she needs. Then send a short note confirming the conversation and the resolution.",
              score: 3,
              isBest: true,
              outcome:
                "She pushes back for about ten minutes and then agrees, because the restructure genuinely gives her what she wanted — she was reaching for word changes because she had no other instrument. The facts-and-confidence structure becomes the standing format for the incident and for the eventual disclosure committee package.",
              ripple:
                "The separation is the single most valuable thing you do in this entire scenario. It means the disclosure committee decides on true facts, it means your written record is one you would want read aloud, and it means Marisol's legal analysis is stronger rather than weaker because it rests on something solid. Nine months later, when plaintiffs' counsel takes your deposition, the document that ends the line of questioning is your 09:40 note confirming that factual findings would not be altered and characterisation would be handled separately.",
            },
            {
              id: "sim-materiality-eight-k-d1-o3",
              label: "Escalate immediately to the audit committee chair over the General Counsel's head",
              detail:
                "A general counsel asking a security leader to soften a factual finding is exactly the governance failure independent directors exist to catch. Go around her, on the record, today.",
              score: -1,
              outcome:
                "Yusra Bengtsson takes the call at 10:15, listens carefully, and asks whether you raised it with Marisol first. You did not. She tells you to do that and to come back if it is not resolved.",
              ripple:
                "The escalation path is correct and you used it in the wrong order, which costs you both the relationship with the GC and credibility with the director. Board escalation is a real and necessary instrument and its power comes entirely from being used after the direct attempt fails; used first, it reads as inability to work with peers. You will need Yusra later on something that matters more, and you have spent some of that.",
            },
            {
              id: "sim-materiality-eight-k-d1-o4",
              label: "Comply with the summary language but preserve your own contemporaneous record separately",
              detail:
                "Do not fight it publicly. Send the revised summary and keep a personal, timestamped file of what you actually found, so that if the record is ever questioned your position is documented.",
              score: -2,
              outcome:
                "The softened summary circulates. Your private file accumulates. You feel protected.",
              ripple:
                "A private file that contradicts the official record does not protect you; it establishes that you knew the official record was inaccurate and let it stand. In discovery it is the most damaging document in the set, because it converts an ambiguous failure of process into documented individual knowledge. Personal-protection files are the single most common way security leaders make their own position worse, and they are almost always written by people who believed they were being careful.",
            },
          ],
          debrief:
            "The distinction that resolves this is between facts and characterisation, and building it into the document structure is worth more than any amount of arguing. A security leader states what is confirmed, what is assessed and at what confidence, and what is unknown. A lawyer characterises. When those are mixed in one document, every disagreement becomes a fight over adjectives and the facts get eroded a word at a time by people acting in good faith. The reason this matters more now than it did a decade ago is that the written record is a regulated artefact: the SEC's action against SolarWinds and its CISO was built substantially on internal documents showing knowledge that did not reach public statements, and while the court dismissed most of the claims in July 2024 and the SEC dismissed the remainder with prejudice in November 2025, the surviving claim through that entire period concerned representations about security controls that internal records contradicted. Note also the escalation ordering: the board channel is real, it is powerful, and it works exactly once if you use it before exhausting the direct conversation.",
          principle:
            "Facts in one section, characterisation in another. Never change a factual finding, and never keep a private file that contradicts the official record.",
        },
      },
      {
        id: "sim-materiality-eight-k-i04",
        t: "T+5:30 — Tue 12:10",
        channel: "field",
        from: "Delia Okonjo, Forensics Lead (retained through outside counsel)",
        text:
          "Preliminary and I want the preliminary caveat carried with it everywhere. Egress appears limited to a staging server, ENG-STG-04. The volume out of it is about 340GB. Our initial read is that staging holds test datasets and synthetic calibration data, not production engineering artefacts. If that holds, this is far less bad than it looked at 06:40. Confidence: moderate. I need another day.",
      },
      {
        id: "sim-materiality-eight-k-i05",
        t: "T+9:00 — Tue 15:40",
        channel: "legal",
        from: "Marisol Trant, General Counsel",
        text:
          "Given Delia's read I want to hold the disclosure committee until the picture stabilises. Convening it creates minutes, minutes create a record, and a record of a committee that convened and did not determine materiality is worse than no committee. We can convene next week when we have facts worth deciding on. I would like your agreement.",
        decision: {
          id: "sim-materiality-eight-k-d2",
          scene:
            "The GC wants to defer convening the disclosure committee because the preliminary forensic read is favourable and a committee produces minutes.",
          clock: "10-Q filing in ten days. No clock has started because no determination has been made.",
          pressure:
            "Deferring is comfortable, defensible in the moment, and the mechanism by which four-month intrusions become the ones regulators write about.",
          prompt: "Do you agree to defer the disclosure committee?",
          options: [
            {
              id: "sim-materiality-eight-k-d2-o1",
              label: "Agree to defer until the forensic picture stabilises",
              detail:
                "Convening a committee to conclude that you do not know enough is process theatre. Delia's preliminary read is favourable and she has asked for one more day. Wait for facts.",
              score: -3,
              outcome:
                "The committee does not convene. Nine days pass. On day ten Delia's finding reverses completely and there is now no governance body that has ever formally looked at this.",
              ripple:
                "The rule is that a materiality determination must be made without unreasonable delay, and the SEC has been explicit that a company may not delay making the determination in order to delay the four-business-day disclosure clock. Nine days of drift, documented by the absence of any convening, is the fact pattern that turns a disclosure question into an enforcement question. The absence of minutes is not the absence of a record — a calendar with no meeting on it is a record, and it is a worse one.",
            },
            {
              id: "sim-materiality-eight-k-d2-o2",
              label: "Convene the disclosure committee within 24 hours with an explicit agenda of establishing the determination process and a decision date, not making the determination",
              detail:
                "Argue it this way: the risk she is describing is real and the mitigation is not deferral, it is scoping the meeting correctly. Convene tomorrow to do four things — receive the facts with stated confidence, define what additional facts would change the analysis, identify both quantitative and qualitative materiality factors including reputational harm, customer and regulatory relationships and competitive position, and set a date by which a determination will be made regardless of forensic completeness. Minutes that show a company deciding deliberately are protective; minutes that show a company deciding are only a problem if the decision is wrong.",
              score: 3,
              isBest: true,
              outcome:
                "The committee convenes Wednesday 16:00 with the CFO, GC, CEO, controller and you. It sets a determination date of the following Tuesday and names the three factual questions that would change the analysis. Marisol, once she sees the agenda, becomes its strongest advocate because it gives her a defensible structure rather than an open-ended exposure.",
              ripple:
                "The named determination date is what saves the company. When Delia's finding reverses on Monday, there is already a scheduled decision meeting, a documented list of the questions that mattered, and a committee that has been tracking it — so the determination is made on Tuesday, one business day after the fact changed, and the 8-K files within the window. The minutes showing a deliberate process are the single most valuable document Ridgeline produces all year.",
            },
            {
              id: "sim-materiality-eight-k-d2-o3",
              label: "Recommend filing an Item 8.01 8-K now, voluntarily, to get ahead of it",
              detail:
                "Disclose early under the non-material item. Removes the timing pressure entirely, demonstrates transparency, and preserves the ability to file Item 1.05 later if the determination goes that way.",
              score: -1,
              outcome:
                "A voluntary Item 8.01 filing goes out Thursday describing anomalous activity under investigation. The stock moves 4 percent. The German acquisition target's counsel opens a diligence question.",
              ripple:
                "Item 8.01 is genuinely the correct vehicle for voluntary disclosure of an incident not determined material — that is precisely the distinction the SEC's Division of Corporation Finance drew in May 2024. But filing it on day two with a preliminary and shortly-to-be-reversed forensic picture means your first public statement describes an incident you did not yet understand, and the Item 1.05 that follows will contradict it. Early disclosure is a real option and it requires the same factual foundation as late disclosure.",
            },
            {
              id: "sim-materiality-eight-k-d2-o4",
              label: "Defer the committee but send a written memo to the CEO and audit committee chair recording that you recommended convening",
              detail:
                "Respect the GC's process authority while ensuring your position is documented. You cannot convene the committee unilaterally, and a contemporaneous memo preserves the record of what you advised.",
              score: -1,
              outcome:
                "The memo goes to the CEO and Yusra on Tuesday evening. Yusra reads it, files it, and does not act, because a memo from the CISO recommending a committee meeting is not a governance escalation, it is a note.",
              ripple:
                "You have documented your position without changing the outcome, which protects you individually and does nothing for the company — and that asymmetry is visible to everyone who later reads the file. A memo that records dissent without pressing it reads, in hindsight, as someone building a record rather than solving a problem. Push the argument in the room first; the memo is what you write after the room fails, not instead of entering it.",
            },
          ],
          debrief:
            "The single most consequential feature of the SEC cybersecurity disclosure rules is that the four-business-day clock runs from the materiality determination, not from discovery — and the rules require that determination to be made without unreasonable delay. That structure creates an obvious temptation and the Commission anticipated it: delaying the determination in order to delay the clock is itself the violation. The practical defence is a decision date. A disclosure committee that convenes early, receives facts with stated confidence, names the questions that would change the analysis, and commits to a determination date is doing exactly what the rule contemplates, and its minutes are protective rather than dangerous. Note the second thing the best option does: it insists that qualitative factors are on the agenda. The adopting release and the Commission's guidance are clear that materiality is not solely quantitative, and in this scenario the quantitative impact is near zero while the qualitative impact — loss of a nineteen-year firmware moat to a competitor-aligned actor, in a defence-adjacent product line — is the entire question.",
          principle:
            "The clock runs from the determination, so the determination gets a date. Deliberate process produces protective minutes; drift produces an enforcement narrative.",
        },
      },
      {
        id: "sim-materiality-eight-k-i06",
        t: "T+27:00 — Wed 09:40",
        channel: "board",
        from: "Yusra Bengtsson, Audit Committee Chair",
        text:
          "I will be at the disclosure committee this afternoon as an observer. One request in advance, and it is the only thing I care about: I want the facts presented by the person who found them, not summarised by the person who manages them. And I want three columns — confirmed, assessed with confidence level, unknown. If anything in the confirmed column has been softened between the analyst's keyboard and my eyes, I would rather hear about that than about the intrusion.",
      },
      {
        id: "sim-materiality-eight-k-i07",
        t: "T+31:00 — Wed 13:40",
        channel: "exec",
        from: "Padraig Lunn, Head of Corporate Development",
        text:
          "Brummer signing is in sixteen days. Their counsel has a standard rep on the absence of undisclosed cybersecurity incidents and we have already given a draft disclosure schedule that does not mention this. I am told nothing has been determined material, so nothing needs to go on the schedule. I want you to confirm that so I can stop worrying about it. Also, and I raise this reluctantly, the M&A data room was on the list of things that service account could read.",
        decision: {
          id: "sim-materiality-eight-k-d3",
          scene:
            "Corporate Development wants you to confirm that an undetermined incident does not belong on an acquisition disclosure schedule. The intruder had read access to the data room for that acquisition.",
          clock: "Signing in sixteen days. Disclosure schedule is being finalised this week.",
          pressure:
            "He is asking a question you are not qualified to answer, in a form that will be treated as your answer, and the honest response creates a problem for a deal the CEO has staked the year on.",
          prompt: "What do you tell Corporate Development?",
          options: [
            {
              id: "sim-materiality-eight-k-d3-o1",
              label: "Confirm that nothing determined material means nothing goes on the schedule",
              detail:
                "Accurate on its own terms and it is not your call anyway. The rep concerns disclosed incidents and there has been no determination, so there is nothing to disclose. Corporate Development has counsel for this.",
              score: -3,
              outcome:
                "He takes your confirmation as clearance and finalises the schedule without the incident. Your name is in the email chain as the security function's sign-off.",
              ripple:
                "The rep in a purchase agreement is a contractual representation with its own definition, which almost never tracks the SEC's materiality standard and frequently covers any incident involving unauthorised access to specified systems. You answered a securities-law question you were asked in a contract-law context and you were not qualified to do either. When the data room exposure surfaces in post-closing diligence, the chain shows the CISO confirming there was nothing to disclose.",
            },
            {
              id: "sim-materiality-eight-k-d3-o2",
              label: "Refuse to answer the legal question, provide the factual record directly to deal counsel and the GC in writing, and flag the data room exposure as a fact requiring their analysis",
              detail:
                "Tell him plainly: I cannot tell you what belongs on a disclosure schedule and you should not accept an answer from me if I gave you one. What I can give you, today, in writing, to you and to Marisol and to deal counsel, is the factual record — including that the account had read access to the Brummer data room between June and last week, and that we do not yet know whether data room contents were among the 340GB. That is a fact with acquisition consequences and it needs their analysis, not mine.",
              score: 3,
              isBest: true,
              outcome:
                "The factual note goes to Padraig, Marisol and deal counsel at 14:30. Deal counsel comes back within two hours flagging that the rep is drafted to any incident involving unauthorised access rather than to material incidents, which nobody in the operational chain had checked.",
              ripple:
                "That single catch is worth more than everything else in the module combined: signing with a false rep would have handed Brummer's shareholders a post-closing claim and Ridgeline's directors a very bad set of facts. It happened because you refused to answer a question outside your competence and routed the fact to the people whose competence it was. The habit generalises — the CISO's contribution to legal and commercial questions is facts delivered fast to the right people, never conclusions delivered to the wrong ones.",
            },
            {
              id: "sim-materiality-eight-k-d3-o3",
              label: "Tell him to delay signing until the investigation completes",
              detail:
                "You cannot represent an absence of incidents while running one. The prudent course is to pause a 16-day timeline until the facts are known, and security should say so plainly.",
              score: -1,
              outcome:
                "The recommendation reaches the CEO within the hour and is not well received, since a delay has financing, regulatory clearance and retention consequences Padraig understands and you do not.",
              ripple:
                "Recommending a business action outside your domain, on facts you have not fully established, spends credibility you will need for the materiality determination five days from now. The correct move produces the same protective outcome — deal counsel discovers the rep problem — without you having taken a position on the transaction. Give people the fact that forces the right decision rather than the decision itself.",
            },
            {
              id: "sim-materiality-eight-k-d3-o4",
              label: "Give him the facts verbally and let him decide what to do with them",
              detail:
                "He gets the information he needs, you avoid creating a written record that could be read against the company in a deal context, and the decision stays with the people who own it.",
              score: -2,
              outcome:
                "You brief him at 14:00. He takes his own notes, of variable accuracy, and relays a summary to deal counsel two days later that omits the data room detail because he did not understand its significance.",
              ripple:
                "Verbal transmission of a technical fact through a non-technical intermediary loses precisely the detail that mattered. Worse, choosing verbal specifically to avoid a written record is a decision that looks exactly like what it is when reconstructed later. Facts with legal consequence go in writing to the people who need them; the discomfort of the written record is the point of the written record.",
            },
          ],
          debrief:
            "There are two competence boundaries in play and the failure mode is crossing them in the helpful direction. You are not qualified to determine materiality under the securities laws and you are not qualified to interpret a representation in a purchase agreement — but you are the only person who knows that the intruder could read the data room, and that fact is worthless until it reaches someone who can act on it. So the discipline is: refuse the conclusion, deliver the fact, deliver it in writing, and deliver it to everyone whose analysis it changes rather than only to the person who asked. Note the specific trap that this catches. Contractual cybersecurity representations in M&A are typically drafted to a standard far broader than SEC materiality — commonly any unauthorised access to specified systems — and operational teams routinely assume the two standards are the same because both use words like material and incident. Checking that assumption is the kind of thing nobody is assigned and everyone regrets.",
          principle:
            "Refuse conclusions outside your competence, deliver the fact in writing, and deliver it to everyone whose analysis it changes.",
        },
      },
      {
        id: "sim-materiality-eight-k-i08",
        t: "T+34:00 — Wed 16:40",
        channel: "legal",
        from: "Marisol Trant, General Counsel",
        text:
          "Disclosure committee minutes drafted. Determination date set for Tuesday. Three questions named: what was actually in the 340GB, whether ENG-STG-04 held production artefacts, and whether the actor is state-aligned. I will say something I do not enjoy saying — the three-column format was right and my instinct this morning was wrong. Also: outside counsel raised the Attorney General national security delay provision under Item 1.05, which permits deferring disclosure if the Attorney General determines immediate disclosure would pose a substantial risk to national security or public safety. Given the naval customer base, do you want to pursue it.",
      },
      {
        id: "sim-materiality-eight-k-i09",
        t: "T+52:00 — Thu 10:40",
        channel: "field",
        from: "Aurelio Sandoval, Threat Hunting Lead",
        text:
          "Two things. First, infrastructure overlap: the jump host beaconed to a domain that appears in a 2024 government advisory associated with a state-aligned intrusion set targeting industrial control vendors. Not conclusive, and I will not overstate it. Second, and I flagged this to Delia an hour ago: ENG-STG-04 is not what we thought. There is a scheduled rsync from the production SP-9 build tree that has been running nightly since a 2022 migration nobody documented. Staging has held a current copy of production firmware source for three years.",
      },
      {
        id: "sim-materiality-eight-k-i10",
        t: "T+55:00 — Thu 13:40",
        channel: "field",
        from: "Delia Okonjo, Forensics Lead",
        text:
          "Withdrawing my Tuesday preliminary in full and I want that on the record in exactly those words. The 340GB from ENG-STG-04 includes the complete SP-9 firmware source tree, the calibration algorithm implementation and nineteen years of test data. This is not test data on a staging box. This is the company's crown jewels, taken over four months, by an actor with infrastructure overlap to a state-aligned set. Confidence: high on the contents, moderate on the attribution.",
      },
      {
        id: "sim-materiality-eight-k-i11",
        t: "T+56:30 — Thu 15:10",
        channel: "exec",
        from: "Grant Oyibo, Chief Financial Officer",
        text:
          "I have been thinking about my question on Tuesday and I want to withdraw it. I asked for a dollar figure. There is no dollar figure for nineteen years of firmware in a competitor's hands and I should have known that when I asked. What I need from you now is different: help me articulate the qualitative case to the committee in language an auditor will accept, because I am the one who has to say it out loud and I have never had to argue materiality without a number.",
        decision: {
          id: "sim-materiality-eight-k-d4",
          scene:
            "The facts have reversed. There is no quantifiable loss, no operational impact, no revenue effect — and the company's entire competitive moat is in the hands of a probably state-aligned actor. The CFO is asking you to help him make an argument he has never had to make.",
          clock: "Determination meeting Tuesday, four days away. 10-Q in six days.",
          pressure:
            "The quantitative case for immateriality is airtight and the qualitative case is overwhelming, and only one of those has a number.",
          prompt: "How do you frame the materiality input?",
          options: [
            {
              id: "sim-materiality-eight-k-d4-o1",
              label: "Build a quantified loss estimate using a structured risk model so the committee has a number to work with",
              detail:
                "Decompose using the FAIR taxonomy — loss event frequency and loss magnitude, with ranges and stated assumptions — to produce a defensible expected-loss figure. Auditors and committees are far more comfortable with a modelled range than with a qualitative assertion.",
              score: 0,
              outcome:
                "A structured model is produced by Monday with a wide range and explicit assumptions. It is genuinely useful for prioritising remediation and for the insurance conversation.",
              ripple:
                "It is also the wrong instrument for this decision and it introduces a real risk: a modelled expected loss below the 14.8 million threshold becomes the number the committee anchors on, and quantification of a qualitative harm gives false precision exactly where the standard does not require precision. Quantitative risk modelling is a superb tool for portfolio prioritisation and a poor one for a materiality determination about a moat.",
            },
            {
              id: "sim-materiality-eight-k-d4-o2",
              label: "Present the qualitative case explicitly as qualitative, structured around the reasonable investor standard, with the facts and confidence levels attached and no attempt to monetise",
              detail:
                "Frame it as: would a reasonable investor consider it significant that the firmware and calibration algorithm underlying forty percent of revenue, in a product line sold to defence and critical-infrastructure customers, is now held by an actor with state-alignment indicators. Attach the confirmed facts, the confidence on attribution, the customer and regulatory relationship exposure, the competitive-position exposure, and the specific fact that Ridgeline's differentiation is not patented but held as trade secret. State plainly that you are providing facts and factors and that the determination is the committee's.",
              score: 3,
              isBest: true,
              outcome:
                "The framing lands. The CFO uses it almost verbatim on Tuesday and the committee determines materiality in forty minutes. The 8-K files Wednesday, one business day after the determination and well within the four.",
              ripple:
                "Refusing to monetise is what makes the determination durable. A determination grounded in a modelled number invites a later argument that the number was wrong; a determination grounded in the reasonable-investor significance of a named, confirmed fact does not. The Commission's guidance has consistently held that materiality is not solely quantitative and that qualitative factors including reputational harm, competitive position and customer and vendor relationships must be considered — and this is what that looks like in practice.",
            },
            {
              id: "sim-materiality-eight-k-d4-o3",
              label: "State your own conclusion that the incident is material and recommend immediate filing",
              detail:
                "You have the clearest view of the facts and their significance. Waiting four more days for a committee to reach the conclusion you have already reached is delay with no benefit. Say it plainly.",
              score: -1,
              outcome:
                "You state the conclusion Thursday evening. The committee reaches the same conclusion on Tuesday. Nothing is materially different in the outcome and something is different in the record.",
              ripple:
                "The CISO stating a materiality conclusion is not merely outside your role, it weakens the determination: a securities-law conclusion reached by the security function rather than the disclosure committee is exactly the procedural defect a plaintiff's expert will identify. It also, subtly, transfers the decision's authorship to a person with no securities-law responsibility, which is worse for you than for anyone else. Be the reason the right determination is reachable, not the person who reaches it.",
            },
            {
              id: "sim-materiality-eight-k-d4-o4",
              label: "Present the facts neutrally without identifying qualitative factors, and let the committee determine significance",
              detail:
                "Strict role discipline. Facts are yours, significance is theirs, and identifying which factors matter is already stepping toward the conclusion.",
              score: -2,
              outcome:
                "The facts are presented cleanly on Tuesday. The committee, composed of a CFO, a GC and a CEO, spends most of the meeting on quantitative impact because that is the frame they know, and nearly concludes that the absence of financial impact resolves it.",
              ripple:
                "Neutrality that withholds relevant factors is not neutrality, it is under-informing. The committee cannot weigh a competitive-position exposure it has not been told to consider, and it will default to the frame it is most fluent in. Your obligation is to ensure they have every factor a reasonable analysis requires — including the ones that point toward materiality — and then to stop. The line is between supplying factors and supplying the conclusion.",
            },
          ],
          debrief:
            "The hardest materiality cases are the ones with no number, and they are increasingly the common case: intellectual property theft, quiet state-aligned intrusions, model weight exfiltration, source code loss. The SEC's rules and the adopting release are clear that the analysis is not solely quantitative — reputational harm, competitive position, customer and vendor relationships, and litigation and regulatory exposure are all in scope — and the standard remains whether a reasonable investor would consider it significant. Two disciplines follow. Do not monetise a qualitative harm merely to make a committee comfortable; a false number is a worse foundation than an honest qualitative argument, and it becomes the thing that gets attacked later. And hold the line between supplying factors and supplying the conclusion: your job is to make sure no relevant factor is missing from the analysis, including every factor that cuts toward disclosure, and then to let the people with the legal responsibility decide. Grant Oyibo's message is the most encouraging thing in this scenario, and it is realistic — CFOs are quantitative by training and most of them can be brought along in one conversation if you give them language they can defend to an auditor.",
          principle:
            "Supply every factor, monetise nothing that is not monetary, and never state the conclusion that belongs to someone else.",
        },
      },
      {
        id: "sim-materiality-eight-k-i12",
        t: "T+58:00 — Thu 16:40",
        channel: "legal",
        from: "Marisol Trant, General Counsel",
        text:
          "Draft Item 1.05 language for Tuesday, and I want your reaction as the person who knows the facts. Current draft: The Company recently identified unauthorized activity on certain of its information technology systems. The Company has taken steps to address the activity and does not currently believe the incident is reasonably likely to materially impact the Company's financial condition or results of operations. I think that is accurate. Tell me if you disagree.",
        decision: {
          id: "sim-materiality-eight-k-d5",
          scene:
            "The draft 8-K describes a four-month, probably state-aligned exfiltration of the firmware and calibration algorithm behind forty percent of revenue as unauthorized activity on certain systems, and asserts no reasonably likely material financial impact in the same breath as a filing that exists because the incident was determined material.",
          clock: "Filing Wednesday. Draft goes to outside counsel Monday.",
          pressure:
            "The language is standard, it is what half the market files, and the GC has just conceded a point to you and is asking in good faith.",
          prompt: "What do you tell her about the draft?",
          options: [
            {
              id: "sim-materiality-eight-k-d5-o1",
              label: "Approve it — it is standard market language and the financial impact statement is technically accurate",
              detail:
                "The overwhelming majority of Item 1.05 filings read approximately like this. Financial impact genuinely is not currently expected to be material in the accounting sense. Standard language is standard because it is defensible.",
              score: -3,
              outcome:
                "The filing goes out Wednesday. It is unremarkable and attracts no immediate attention.",
              ripple:
                "The filing is internally contradictory in a way that will be quoted back: you determined the incident material on qualitative grounds and then told investors the impact was not reasonably likely to be material, which invites the question of what exactly was determined. The SEC's October 2024 actions against four companies over their SolarWinds-related disclosures were built precisely on minimising characterisations — describing known, specific, significant intrusions in generic and understated terms. Standard language is not a defence when the standard language is inconsistent with your own determination.",
            },
            {
              id: "sim-materiality-eight-k-d5-o2",
              label: "Object in writing to the specific inconsistency, propose language that states the nature of what was taken and separates financial impact from the basis for the determination",
              detail:
                "Tell her the two problems precisely. One: unauthorized activity on certain systems does not describe an exfiltration of the firmware source and calibration algorithm for the SP-9 platform, and the rule requires describing the material aspects of the nature, scope and timing and the material impact or reasonably likely material impact. Two: asserting no reasonably likely material financial impact in a filing predicated on a materiality determination is self-contradictory — say instead that the Company determined the incident material based on the nature of the information involved, and that it does not currently expect a material impact on results of operations for the current quarter, while noting the impact on competitive position is being assessed. Send it in writing.",
              score: 3,
              isBest: true,
              outcome:
                "Marisol accepts both points, and outside counsel — who had drafted from a template — agrees within an hour that the inconsistency was a real defect. The filed language names the affected product line and the category of information taken, without technical detail that would help the actor.",
              ripple:
                "Two years later, when a competitor product ships with suspiciously similar calibration behaviour and the plaintiffs' bar arrives, the 8-K is the document that protects the company, because it said what happened. And your written objection to the original draft is the document that protects you personally. Note what this option does not do: it does not disclose technical detail, it does not speculate on attribution, and it does not overstate. Accuracy is not the same as maximalism.",
            },
            {
              id: "sim-materiality-eight-k-d5-o3",
              label: "Suggest naming the state-aligned attribution to convey the seriousness accurately",
              detail:
                "Investors deciding what this means need to know it was probably a nation-state, because that changes both the likelihood of competitive exploitation and the reasonableness of the company's defences. Withholding it understates.",
              score: -2,
              outcome:
                "The suggestion is debated for a day. Attribution confidence is moderate, based on infrastructure overlap. Outside counsel declines and is correct to.",
              ripple:
                "Publicly asserting state attribution at moderate confidence creates a statement you may have to retract, invites diplomatic and customer complications you cannot manage, and adds nothing a reasonable investor needs beyond the nature of the information taken. The instinct — that the filing understates — is correct, and the fix is describing what was taken rather than speculating about who took it. Precision about facts you hold, silence about facts you do not.",
            },
            {
              id: "sim-materiality-eight-k-d5-o4",
              label: "Raise the concern verbally with the GC and defer to outside counsel's judgement on the final language",
              detail:
                "Securities disclosure drafting is squarely outside your competence and outside counsel are the experts. Raise the substantive concern, let them draft, and do not insert yourself into language you are not qualified to write.",
              score: -1,
              outcome:
                "You raise it verbally Friday. Outside counsel, working from a template and without the technical context, keeps the original phrasing. The filing goes out as drafted.",
              ripple:
                "Outside counsel draft from precedent and from what they are told; they cannot know that unauthorized activity on certain systems fails to describe a firmware source exfiltration unless someone who knows the facts says so in writing. Deference to expertise is right on the legal form and wrong on the factual accuracy, and that distinction is the whole job. A verbal concern that does not change a filing is, in the reconstruction, indistinguishable from no concern at all.",
            },
          ],
          debrief:
            "This is the decision the entire module builds toward. The SEC's enforcement theories in this area have consistently centred on minimisation: the October 2024 settled actions against four companies over disclosures related to the SolarWinds compromise turned on describing known, specific and significant intrusions in generic terms that understated their scope. The surviving claim in the SEC's case against SolarWinds and its CISO through July 2024 concerned a public security statement that internal records contradicted; the SEC dismissed its remaining claims with prejudice in November 2025, and the reason that is not the comfort it appears to be is that private securities litigation, state regulators and acquirers all read the same documents on their own timelines. Two craft points. Accuracy is not maximalism — describing what was taken is required, speculating on attribution at moderate confidence is not. And a written objection is not an act of self-protection at the company's expense; it is the mechanism by which outside counsel, who draft from templates and from what they are told, learn that the template does not fit the facts.",
          principle:
            "Minimisation is the enforcement theory. Describe what was taken, refuse language inconsistent with your own determination, and object in writing.",
        },
      },
      {
        id: "sim-materiality-eight-k-i13",
        t: "T+82:00 — Fri 16:40",
        channel: "exec",
        from: "Halina Brecht, Chief Executive Officer",
        text:
          "Two of my executives have trading windows opening Monday and one has a sale scheduled that is not under a 10b5-1 plan. Compliance says the blackout call is Marisol's. I am telling you because you are the only person in the building who knows what those two people would be trading on, and I would rather hear from you now that this is a problem than hear from the SEC later that it was.",
      },
      {
        id: "sim-materiality-eight-k-i14",
        t: "T+96:00 — Mon 09:40",
        channel: "regulator",
        from: "Field office liaison, FBI (via outside counsel)",
        text:
          "Acknowledging your voluntary report. Two things. We can share indicators that will help you scope, under the usual handling caveats. Separately, on the Item 1.05 national security delay provision: that determination is made by the Attorney General and referred through the Bureau, it has been granted rarely, and requests are assessed on whether immediate disclosure poses a substantial risk to national security or public safety — not on commercial sensitivity or deal timing. If you want us to consider a referral, tell us today, and understand that the request itself creates a record.",
      },
      {
        id: "sim-materiality-eight-k-i15",
        t: "T+104:00 — Mon 17:40",
        channel: "press",
        from: "Emmerich Vaal, Bloomberg",
        text:
          "I am working on the Brummer acquisition and I have a source describing a security investigation at Ridgeline that predates the deal. I am not going to run something speculative. But if you file an 8-K on Wednesday that does not line up with what I am hearing, I will write that story instead. I am giving you the courtesy of telling you that in advance.",
      },
      {
        id: "sim-materiality-eight-k-i16",
        t: "T+120:00 — Tue 09:40",
        channel: "board",
        from: "Yusra Bengtsson, Audit Committee Chair",
        text:
          "Before we vote I have one question for the CISO and it is the same one I asked on day two. Is there anything in the confirmed column of the document in front of me that reads differently than it read on the analyst's screen. Take your time. I would rather this meeting run an hour long than have this question answered wrong.",
        decision: {
          id: "sim-materiality-eight-k-d6",
          scene:
            "The determination meeting. Nine days of documents, three reversals, one softening request you refused, and an audit committee chair asking whether the record in front of her is true.",
          clock: "The vote follows your answer.",
          pressure:
            "There is one thing you are not certain about: the summary you wrote on day four described attribution as consistent with a state-aligned set, and Aurelio's actual language was infrastructure overlap, not conclusive. It is a small difference and it is in the confirmed column.",
          prompt: "How do you answer?",
          options: [
            {
              id: "sim-materiality-eight-k-d6-o1",
              label: "Answer no — the material facts are accurately represented and the attribution nuance is immaterial to the determination",
              detail:
                "The determination rests on what was taken, not on who took it. Raising a wording nuance about attribution in front of the audit committee at the vote introduces doubt about the entire record for no decision-relevant benefit.",
              score: -2,
              outcome:
                "The vote proceeds. The determination is correct. Nothing bad happens immediately.",
              ripple:
                "You answered a question about record fidelity by applying your own materiality filter to it, which is the exact substitution the question was designed to detect. She did not ask whether the difference mattered; she asked whether there was one. When the attribution language later appears in the 8-K, in the deal disclosure schedule and in a deposition, the first thing established is that the CISO was asked directly and said no.",
            },
            {
              id: "sim-materiality-eight-k-d6-o2",
              label: "Name the attribution wording difference explicitly, state that you believe it does not change the determination, and let the committee decide whether it matters",
              detail:
                "Say it plainly: yes, one. My day-four summary said consistent with a state-aligned set. The analyst's language was infrastructure overlap with a set described in a 2024 advisory, not conclusive. I tightened it and I should not have. I do not believe it changes the determination and that is your judgement, not mine. The corrected language is in the appendix.",
              score: 3,
              isBest: true,
              outcome:
                "The room is quiet for a moment. Yusra thanks you, the committee spends four minutes on it, concludes it does not change the determination, and votes. The correction is recorded in the minutes.",
              ripple:
                "That four-minute exchange is worth more to your career and to the company than every other thing in the module. It establishes, in the minutes of the meeting where the determination was made, that the CISO volunteered a correction against their own drafting when directly asked — which is the single most powerful fact available in any later reconstruction. It also permanently changes your relationship with the audit committee: from this meeting forward, when you say something is confirmed, three directors treat it as confirmed.",
            },
            {
              id: "sim-materiality-eight-k-d6-o3",
              label: "Say you would need to re-verify the entire document before answering, and ask to defer the vote",
              detail:
                "The only honest answer to a question about whether any of dozens of statements was altered is that you would need to check. Deferring the vote to verify is the rigorous response.",
              score: -1,
              outcome:
                "The vote defers to Wednesday. The determination is made one day later and the 8-K files Thursday, still within the window but with a day of margin consumed for no gain.",
              ripple:
                "You had a specific answer available and you converted a precise question into a process. Rigour that produces delay without producing information is indistinguishable from evasion to everyone in the room, and it burns the one day of margin you might have needed. Answer the specific thing you know, then offer the broader verification if they want it.",
            },
            {
              id: "sim-materiality-eight-k-d6-o4",
              label: "Answer no and send a correction note after the meeting",
              detail:
                "Do not derail a determination vote over a wording nuance. Correct the record promptly afterwards so it is accurate, without disrupting a meeting that has to conclude today.",
              score: -3,
              outcome:
                "The vote proceeds. Your correction note goes out at 14:00. The minutes record a clean answer followed by a same-day correction.",
              ripple:
                "The sequence is the problem: asked directly, said no, corrected two hours later. That pattern is worse than never correcting at all, because it establishes that the inaccurate answer was given knowingly. There is no version of a written correction that repairs a false answer to a direct question from an audit committee chair — the correction becomes the evidence.",
            },
          ],
          debrief:
            "Everything in this module reduces to this exchange. The audit committee chair is not testing the facts; she is testing whether the person supplying the facts distinguishes between what they know and what they have written, and whether they will volunteer a correction against their own interest when directly asked. That property is the entire basis on which a board can rely on a security function, and it is established or destroyed in moments like this. The reason it is worth an hour of a determination meeting is that the alternative — a CISO who filters corrections through their own judgement about whether they matter — is a CISO whose confirmed column cannot be relied on for anything. Note that the correct answer includes stating your view that it does not change the determination. Volunteering the correction is not the same as abdicating your assessment; you give them both, and you make clear which is which.",
          principle:
            "When asked whether the record is true, answer the question asked, not the question of whether the difference matters.",
        },
      },
    ],
    scoring: [
      {
        dimension: "Record fidelity",
        weight: 30,
        note:
          "Whether factual findings survived from the analyst's keyboard to the decision-makers unaltered, whether facts and characterisation were structurally separated, and whether corrections were volunteered before they were discovered. The single heaviest dimension.",
      },
      {
        dimension: "Determination discipline",
        weight: 22,
        note:
          "Whether the disclosure committee was convened promptly with a named determination date and named decision-relevant questions, rather than deferred pending forensic completeness. Drift is scored as a control failure regardless of the eventual outcome.",
      },
      {
        dimension: "Role boundary integrity",
        weight: 18,
        note:
          "Whether you supplied every relevant factor without supplying the legal conclusion, refused questions outside your competence, and routed facts in writing to everyone whose analysis they changed.",
      },
      {
        dimension: "Disclosure accuracy",
        weight: 18,
        note:
          "Whether the filed language described the nature of what was taken, avoided minimisation, avoided internal contradiction with the determination itself, and avoided overstatement such as attribution asserted at moderate confidence.",
      },
      {
        dimension: "Escalation judgement",
        weight: 12,
        note:
          "Whether board and law-enforcement channels were used in the correct order and for the correct purpose, and whether internal disagreements were pressed in the room before being documented.",
      },
    ],
    debrief: [
      {
        title: "You do not decide materiality; you decide whether the record is true",
        body:
          "The most common structural error a CISO makes in a disclosure scenario is picking the wrong job. Materiality under the securities laws is a legal determination made by the disclosure committee with counsel, informed by both quantitative and qualitative factors. You are not qualified to make it and asserting it weakens it, because a securities conclusion authored by the security function is a procedural defect a plaintiff's expert will find. What is unambiguously yours is the factual record: what is confirmed, what is assessed and at what confidence, what is unknown, and whether any of that was altered on the way to the people deciding. Hold that line in both directions — refuse to state the conclusion, and refuse to let the conclusion be reached on facts you know to be softened.",
      },
      {
        title: "The clock runs from determination, and drift is the violation",
        body:
          "Item 1.05 of Form 8-K requires disclosure within four business days of determining that a cybersecurity incident is material — not four business days from discovery. That structure creates an obvious incentive to avoid determining, and the rule closes it: the determination must be made without unreasonable delay, and delaying it in order to delay the clock is itself the problem. The operational defence is a decision date. Convene the disclosure committee early with a narrow agenda — receive facts with confidence levels, name the questions that would change the analysis, set the date on which a determination will be made regardless of forensic completeness — and the resulting minutes are protective rather than dangerous. A calendar with no meeting on it is also a record, and it is the worse one.",
      },
      {
        title: "Item 1.05 and Item 8.01 are different instruments",
        body:
          "In May 2024 the Director of the SEC's Division of Corporation Finance issued a statement clarifying that Item 1.05 is reserved for incidents determined to be material, and encouraging companies that wish to disclose voluntarily — before a determination, or where no determination has been made — to use Item 8.01 instead. If an incident is first disclosed under 8.01 and later determined material, an Item 1.05 filing is required within four business days of that determination. The practical value of understanding this is that early voluntary disclosure is a real option rather than a trap, which removes a great deal of the pressure to avoid the determination. The constraint is that an 8.01 filed on a preliminary and shortly-to-be-reversed forensic picture is still a public statement you will have to correct.",
      },
      {
        title: "Minimisation is the enforcement theory",
        body:
          "Across the SEC's cybersecurity disclosure actions the recurring theory is not concealment but understatement: describing a known, specific, significant intrusion in generic terms. In October 2024 the Commission brought settled actions against four companies over disclosures relating to the SolarWinds compromise, each essentially for characterising a real and understood intrusion in language that materially understated it. In the SolarWinds matter itself, the claim that survived the July 2024 motion to dismiss concerned a public security statement about access controls that internal records contradicted; the court rejected the Commission's theory that Exchange Act internal accounting controls provisions extend to cybersecurity controls, and in November 2025 the SEC dismissed its remaining claims against the company and its CISO with prejudice. The reason none of that is comfort is that private securities litigation, state regulators, acquirers and insurers read the same internal documents on their own timelines and under their own standards. The durable lesson is not about the SEC; it is that the gap between what was known internally and what was said externally is the thing every reviewer looks for first.",
      },
      {
        title: "The hardest materiality cases have no number",
        body:
          "Quantitative thresholds handle the easy cases. The hard modern case is a quiet intrusion with no operational impact, no ransom, no customer notification trigger, and the loss of something that never appears on a balance sheet — source code, model weights, a calibration algorithm, a customer list, a negotiating position. The Commission's guidance is clear that materiality is not solely quantitative and that qualitative factors including harm to reputation, customer and vendor relationships, competitiveness and litigation or regulatory exposure are in scope. Two disciplines follow. Do not monetise a qualitative harm to make a committee comfortable — a false number is a worse foundation than an honest qualitative argument and it becomes the thing that gets attacked. And ensure the qualitative factors are actually on the agenda, because a committee of a CFO, a GC and a CEO will default to the frame they are most fluent in unless someone puts the others in front of them.",
      },
      {
        title: "Write the memo you would want read aloud",
        body:
          "Every document you produce in an incident with disclosure consequences should be written on the assumption that it will be read aloud, slowly, by someone hostile, three years from now, with the outcome already known. That standard produces specific habits. Separate facts from characterisation structurally, so disagreements about adjectives cannot erode findings. Attach confidence levels to every assessment and revise them explicitly rather than silently. Never keep a private file that contradicts an official record — it does not protect you, it proves you knew. Object in writing when a factual finding is being softened, and phrase the objection as a solution rather than an accusation. And when you are wrong, correct it in the same channel and to the same audience, before anyone asks. The single most valuable sentence in any of these records is a CISO volunteering a correction against their own drafting.",
      },
      {
        title: "The transferable pattern",
        body:
          "This structure repeats wherever a technical fact meets a legal or fiduciary decision — securities disclosure, breach notification, safety reporting, export control, audit findings, regulatory filings of any kind. The pattern: (1) establish who owns the determination and refuse to be that person, while ensuring they cannot make it on false facts; (2) force the determination onto a schedule, because avoidance is the default failure mode and it looks like prudence; (3) structure documents so facts and characterisation cannot contaminate each other; (4) supply every relevant factor including the ones that cut against the comfortable answer, then stop; (5) refuse language inconsistent with the decision that was actually made; (6) volunteer corrections before they are found, especially corrections to your own work. The line worth keeping: your career-defining risk is not that you miss an intrusion — it is that you are the person who knew, in a record that says otherwise.",
      },
    ],
  },
];
