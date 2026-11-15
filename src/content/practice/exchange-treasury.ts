import type { SimModule } from "../schema";

/* THE PRACTICE :: Exchange floors and treasury vaults.
   Three simulation rooms. Real money, real irreversibility, real audiences.
   Every scenario is modelled on the public record of an incident that actually happened
   to people who were smarter than the systems they were handed. */

export const MODULES: SimModule[] = [
  /* ============================================================
     MODULE A — the signing interface lied
     ============================================================ */
  {
    id: "sim-halcyon-cold-vault-deception",
    title: "The Signature Was Valid",
    org: "Halcyon Digital Markets Ltd.",
    sector: "Centralised spot and derivatives exchange with in-house custody — Singapore HQ, Dubai subsidiary",
    chapterId: "ch-appsec",
    essence: "ember",
    difficulty: 5,
    minutes: 80,
    respect: 1240,
    trust: 58,
    mode: "both",
    brief:
      "Halcyon Digital Markets is 1,240 people across Singapore, Dubai, Zurich and Vancouver. It holds roughly 9.8 billion US dollars of customer assets across 31 chains, runs on AWS in ap-southeast-1 with a Snowflake warehouse in GCP, and is licensed by MAS as a Digital Payment Token service provider with a VARA licence for the Dubai entity and a MiCA CASP application sitting with the Central Bank of Ireland. The board has seven seats: two founders, two from Tessellate Partners and Kite Capital, and three independents including a retired MAS supervisor and a former exchange CISO who joined ten months ago and has asked hard questions about the treasury ever since. Ninety-four percent of customer assets sit in a cold aggregation vault, HAL-COLD-01, controlled by a 4-of-7 smart contract wallet on Ethereum mainnet. The seven signers are geographically split, all use hardware wallets, and every movement is simulated in a third-party transaction simulator before signature. The vault contract has been audited three times and has never had a finding above informational. You are Halcyon's Head of Security Engineering and the standing incident commander for any event that touches treasury. It is Friday, 12:31 Singapore time. Two signers are mid-flight. The CEO is at a family lunch. You are about to learn that everything on that list of controls was true and none of it was sufficient.",
    objective:
      "Contain a treasury compromise you cannot reverse. Establish within the first hour whether the failure is a signer, a device, a vendor, or your own build pipeline — and do not let the organisation act on the wrong theory. Preserve forensic evidence while a market panics. Communicate a solvency position that is accurate rather than reassuring, on a clock set by MAS, by the press, and by your own withdrawal queue. Winning is not recovering the money. The money is gone. Winning is that the second transaction never happens, the evidence survives, the public record you create is one you can still stand behind in six months, and the people who signed in good faith are not destroyed for it.",
    roles: ["u-vault", "u-ledger", "u-lantern", "u-anchor", "u-signal", "u-compass"],
    injects: [
      {
        id: "hal-i01",
        t: "T+00:00 — 12:31 SGT",
        channel: "pager",
        from: "Chain Sentinel (automated) — treasury invariant monitor",
        text:
          "CRITICAL. Invariant TREAS-04 violated on HAL-COLD-01. The proxy implementation pointer for the vault has changed. Expected: audited singleton, unchanged for 611 days. Observed: an implementation contract deployed 19 days ago, unverified source, no entry in your allowlist. Invariant TREAS-01 (balance delta ceiling) violated 40 seconds later. Three outbound transfers, same block window. Current vault balance: 0.",
      },
      {
        id: "hal-i02",
        t: "T+00:03 — 12:34 SGT",
        channel: "chain",
        from: "Priya Raghavan, Treasury Engineering",
        text:
          "Confirming from the node directly, not the dashboard. 401,346 ETH left HAL-COLD-01 in three transactions to three fresh addresses. At current mark that is 1.44 billion dollars. The vault contract itself is untouched and behaving exactly as written — someone executed a valid delegatecall through execTransaction that rewrote storage slot zero. Four good signatures. The contract did what four of our seven signers told it to do.",
      },
      {
        id: "hal-i03",
        t: "T+00:06 — 12:37 SGT",
        channel: "pager",
        from: "Wen Li Tan, Security Operations lead",
        text:
          "I have Vancouver and Zurich on a bridge. Dubai is airborne. I need a direction in the next two minutes or people are going to start improvising. What are we doing first?",
        decision: {
          id: "hal-d01",
          scene:
            "Six minutes in. The money is already gone and cannot come back. Everything you do from here is about the next transaction, not the last one. Four humans are asking you what to type.",
          clock: "T+00:06 — 120 seconds to answer",
          pressure:
            "Every instinct in the room is pointed at the money. The money is the one thing you cannot affect.",
          prompt:
            "Your first instruction to the incident bridge. Choose the action that reduces the blast radius of the NEXT event, not the one that feels like a response to this one.",
          options: [
            {
              id: "hal-d01-a",
              label: "Chase the funds — put every analyst on tracing and start calling exchanges to freeze",
              detail:
                "Mobilise the whole team on attribution and interdiction. Get addresses to Chainalysis, TRM, Tether, and the major venues immediately.",
              score: -1,
              outcome:
                "You get addresses circulating fast, which is genuinely useful. But for the next forty minutes nobody is asking whether the attacker still has the capability they just used. Tracing is a background task that a small team runs for weeks. You have just spent your scarcest resource — the first hour of your best people — on the part of the problem with the longest cycle time.",
              ripple:
                "At T+02:00 a second signing attempt appears against your Arbitrum operations vault. It fails only because a signer happened to be asleep. Your board will ask why the attacker still had a live path two hours in, and you will not have a good answer.",
            },
            {
              id: "hal-d01-b",
              label: "Revoke every signing capability the organisation has, everywhere, before anything else",
              detail:
                "All seven signers power down and physically disconnect. Every delegate key, every automation signer, every hot wallet rotation job, every bridge operator key is disabled. No transaction leaves Halcyon from any wallet on any chain until you re-authorise it manually.",
              score: 3,
              outcome:
                "Signing stops in under nine minutes. You have not yet learned anything, and that is the point: you have removed the attacker's ability to use whatever they compromised, without needing to know what it was. Automated hot wallet top-ups fail and the withdrawal queue begins to back up, which is uncomfortable and correct.",
              ripple:
                "At T+02:00 the attacker attempts a second transaction against the Arbitrum operations vault using the same technique. Nothing signs. Forensics later shows they had pre-staged three more implementation contracts. Your kill switch is the reason only one of them ever executed.",
              isBest: true,
            },
            {
              id: "hal-d01-c",
              label: "Get the seven signers on a video call and work out who signed what",
              detail:
                "Establish the human facts first. Who approved, at what time, on which device, and what did the screen say.",
              score: 0,
              outcome:
                "You learn something real within twenty minutes — all four signers describe the same benign screen. But you have spent those twenty minutes with signing capability still live across the estate, and you have started the interview process before anyone has thought about how those statements will be used. Two signers will later describe this call as the moment they realised they were suspects.",
              ripple:
                "Counsel is unhappy that four contemporaneous accounts were collected on an unrecorded call with no caution given. One signer's recollection shifts between this call and the formal interview at T+06:00, and the inconsistency ends up in the incident report looking far worse than it is.",
            },
            {
              id: "hal-d01-d",
              label: "Halt all customer withdrawals immediately and post a holding statement",
              detail:
                "Freeze the platform, tell the world you are investigating an incident, get ahead of the narrative.",
              score: 1,
              outcome:
                "It is defensible and you will probably end up here anyway. But doing it at minute six, before you know whether customer-facing hot wallets are affected, converts a treasury incident into a solvency panic of your own making. And it still does not stop the attacker signing.",
              ripple:
                "Withdrawals resume at T+09:00 after you confirm hot wallets are clean. In the interim, three market makers pull liquidity and your order book depth drops 71 percent. The recovery of confidence takes eleven days longer than it needed to, and the halt itself becomes the story rather than the theft.",
            },
          ],
          debrief:
            "The instinct to chase money is the most expensive instinct in this job. On a public chain, tracing is real work with a long tail and it does not need your first hour. What needs your first hour is capability denial: the attacker used something, you do not yet know what, and the only move that is correct under every hypothesis is to remove every path they could be using. Notice that option B requires no diagnosis at all. That is the property you want in a first move — it is right whether the compromise is a signer, a laptop, a vendor CDN, or your own CI pipeline. Bybit's own timeline shows the same shape: the useful early actions were the ones that did not depend on knowing the answer yet.",
          principle:
            "The first move in an irreversible incident must be correct under every hypothesis you have not yet ruled out.",
        },
      },
      {
        id: "hal-i04",
        t: "T+00:14 — 12:45 SGT",
        channel: "field",
        from: "Marcus Oyelaran, signer 3 (Vancouver), on the bridge",
        text:
          "I signed at 04:24 my time. The screen said transfer 30,000 USDT to HAL-OPS-TREASURY, which is the routine Friday operations top-up we have run 200 times. I checked the destination label. I ran it through the simulator like always and it came back clean, green tick, expected balance changes. My Ledger showed a hash. I compared the first four and last four characters against the interface like the runbook says. They matched. I have done nothing different from every other Friday for two years.",
      },
      {
        id: "hal-i05",
        t: "T+00:18 — 12:49 SGT",
        channel: "pager",
        from: "Devi Anand, Endpoint and Detection Engineering",
        text:
          "I can pull the four signer machines into isolation and start a full triage now. Or I can wipe and reissue clean hardware to all seven in about ninety minutes so we can operate again. I cannot do both with the people I have. What do you want?",
        decision: {
          id: "hal-d02",
          scene:
            "Eighteen minutes in. The team wants to get back to operational. Your forensic window is open and closing — volatile memory, browser state, and any staged payload on disk are all decaying in real time.",
          clock: "T+00:18",
          pressure:
            "The pressure to restore capability is coming from people who are trying to help.",
          prompt:
            "Devi has one team. Choose how you spend the forensic window.",
          options: [
            {
              id: "hal-d02-a",
              label: "Isolate and image all seven machines, memory first, before anything is touched",
              detail:
                "Network isolation at the switch, not at the host. Full memory capture, then disk images, then browser profile and extension state, hashed and logged with two-person custody. Nobody logs in. Signers get loaner laptops with no wallet capability.",
              score: 3,
              outcome:
                "You lose operational signing for two days and gain the only evidence that will ever exist. Memory from signer 3's machine turns out to be clean — no malware, no injected extension — which is the single most important finding of the entire investigation, because it moves the compromise off your endpoints and onto something upstream.",
              ripple:
                "At T+11:00 an insurance adjuster and, later, MAS both ask for the forensic basis of your root cause statement. You have hashed images with documented custody. The claim moves. In the counterfactual where you wiped, your report reads as speculation and your policy response is delayed by four months.",
              isBest: true,
            },
            {
              id: "hal-d02-b",
              label: "Wipe and reissue — get signing capability back today",
              detail:
                "Clean hardware, fresh keys, resume treasury operations by end of day. Preserve logs from the SIEM and move on.",
              score: -3,
              outcome:
                "You destroy the only copy of the evidence. Within four hours you are running a root cause investigation on SIEM telemetry that was never designed to answer this question, and every theory you produce is unfalsifiable.",
              ripple:
                "Your incident report ships at T+14 days with the phrase probable endpoint compromise. Because you cannot exclude an endpoint, you also cannot exonerate the signers. Two of them are quietly moved off treasury duty and one resigns. Eight weeks later the vendor discloses their own breach and you learn your people were innocent — after you had already treated them as suspects.",
            },
            {
              id: "hal-d02-c",
              label: "Image the four machines that signed, wipe the three that did not",
              detail:
                "Focus forensics where the signatures came from. The non-signers are not relevant.",
              score: 0,
              outcome:
                "Reasonable on its face and wrong in a way that only shows up later. The three non-signers were also served the same compromised interface that day; two of them opened it and closed it. Their machines hold the same injected payload with different timing, which is exactly the evidence that establishes the attack was served broadly rather than targeted at four individuals.",
              ripple:
                "At T+09:00 you need to prove the attack was delivered to all seven and you only have four data points. The argument that the signers were not specially targeted becomes an inference instead of a demonstration, and the board's first question is whether one of the four was complicit.",
            },
            {
              id: "hal-d02-d",
              label: "Let each signer run the EDR collection script locally and upload the results",
              detail:
                "Fastest path to broad coverage. Signers are technical people and can follow instructions.",
              score: -2,
              outcome:
                "You get partial artefacts in forty minutes and contaminate every machine in the process. Running the collector requires unlocking, which changes disk state, and one signer helpfully reboots first because the script hung.",
              ripple:
                "The evidence is admissible for internal purposes and useless for anything else. When the vendor later disputes your account of what their interface served, you have no independently verifiable capture to point at, and the dispute stays a dispute.",
            },
          ],
          debrief:
            "This is the decision most teams get wrong, because the wrong answer is the one that makes everyone feel productive. Evidence integrity is not a compliance chore; in this specific scenario it is the mechanism by which you discover the truth. The clean memory capture from a signer's machine is what tells you the endpoints were fine — and that single negative result is what redirects the entire investigation upstream to the interface vendor. Radiant Capital's October 2024 post-mortem ran the other way: three developers on Ledger and Trezor, all compromised at the device level, and it took device forensics to establish that. You do not know which world you are in until you look. Wiping first guarantees you never find out.",
          principle:
            "The negative forensic result — proving where the compromise is not — is usually what breaks the case open. You only get it if you preserve first.",
        },
      },
      {
        id: "hal-i06",
        t: "T+00:26 — 12:57 SGT",
        channel: "exec",
        from: "Anselm Roth, COO",
        text:
          "The withdrawal queue is at 4,100 requests and climbing. Twitter has the outflow. Two of our largest institutional clients have called the desk. I need to know whether customer funds are safe and I need to say something in the next twenty minutes. Also — and I want to be blunt — if one of our own signers did this, I want them off the network today.",
      },
      {
        id: "hal-i07",
        t: "T+00:34 — 13:05 SGT",
        channel: "exec",
        from: "Nadia Farouk, CEO, joining from her car",
        text:
          "I have Anselm telling me to halt withdrawals and I have our head of institutional telling me a halt will cost us six clients permanently. You are the incident commander. Tell me what to do and tell me the cost of being wrong in both directions.",
        decision: {
          id: "hal-d03",
          scene:
            "Thirty-four minutes. Hot wallets are on a completely separate key hierarchy from HAL-COLD-01 and there is no current evidence they are affected. There is also no evidence they are not — you have not finished looking, and you just isolated the machines that would tell you.",
          clock: "T+00:34",
          pressure:
            "The commercially cheap answer and the technically honest answer are different answers, and the CEO is asking you in front of the COO.",
          prompt:
            "Withdrawals. What is your recommendation, and how do you frame it?",
          options: [
            {
              id: "hal-d03-a",
              label: "Keep withdrawals running — hot wallets are a separate key hierarchy and there is no evidence of compromise",
              detail:
                "Absence of evidence is good enough. A halt manufactures panic. Keep the platform up and demonstrate confidence.",
              score: -2,
              outcome:
                "Withdrawals continue and the market reads it as strength for about ninety minutes. Then a researcher points out that your hot wallet rotation is authorised through the same internal signing portal, and the market realises you may not have checked.",
              ripple:
                "You end up halting anyway at T+03:10, from a weaker position, having implicitly told the market that hot wallets were verified when they were only assumed. That sentence gets quoted back to you in the MAS submission and it is the hardest paragraph in the whole document to write.",
            },
            {
              id: "hal-d03-b",
              label: "Halt everything now and say nothing until forensics is complete",
              detail:
                "Total stop. No statement beyond a maintenance notice. Do not speculate in public.",
              score: -1,
              outcome:
                "Safe on the technical axis, catastrophic on the information axis. A maintenance notice during a visible 1.4 billion dollar outflow is read by everyone as concealment, and the vacuum fills with the worst available theory within eleven minutes.",
              ripple:
                "By T+04:00 the dominant public narrative is insolvency rather than theft, which is a materially worse and factually false story. You spend the next four days fighting a rumour instead of explaining an incident, and two market makers who would have stayed do not.",
            },
            {
              id: "hal-d03-c",
              label: "Pause withdrawals with an explicit, narrow, honest reason and a named review checkpoint",
              detail:
                "Withdrawals paused. Public statement: an unauthorised transaction removed assets from one cold storage vault; customer withdrawals are paused as a precaution while we independently verify every other key hierarchy; next update at a stated time; Halcyon remains solvent and will cover the loss from corporate reserves and, if needed, a bridge facility.",
              score: 3,
              outcome:
                "Painful and correct. You have converted an unbounded fear into a bounded one, given the market a specific reason and a specific time, and avoided claiming a verification you have not performed. The queue stops growing because people stop panic-withdrawing when they are told why.",
              ripple:
                "At T+09:00 you resume withdrawals having actually verified the hot wallet hierarchy, and you say so. Because your first statement claimed only what was true, your second statement is believed. Bybit's ability to keep processing withdrawals through their incident rested on exactly this: the claim they made was one they could keep.",
              isBest: true,
            },
            {
              id: "hal-d03-d",
              label: "Halt only large withdrawals above a threshold, keep retail flowing",
              detail:
                "Protect the balance sheet against a run while letting ordinary customers out. Split the difference.",
              score: -3,
              outcome:
                "You have just built a two-tier redemption system in the middle of an incident, with no policy basis, no legal review, and no disclosure. It reads to institutions as a soft gate and to retail as a trap.",
              ripple:
                "MAS asks, in writing, on what basis you selectively restricted redemption for some customers and not others. There is no good answer. What began as a theft becomes a conduct question, and conduct questions attach to individuals rather than to companies.",
            },
          ],
          debrief:
            "The trap here is that both wrong answers are defensible in a meeting. The discipline is separating three different claims that everyone wants to collapse into one: we have not seen evidence of X, we have verified that not-X, and we believe not-X. Only the first is true at minute thirty-four. A world-class operator will pay real commercial cost to avoid asserting the second before it is earned, because the entire value of your public statements over the next two weeks depends on none of them having to be retracted. And note the structure of the winning statement: narrow scope, stated reason, named next checkpoint, explicit solvency position. That is the template.",
          principle:
            "Never let a statement you have not verified travel on the credibility of one you have. The retraction costs more than the halt.",
        },
      },
      {
        id: "hal-i08",
        t: "T+00:51 — 13:22 SGT",
        channel: "legal",
        from: "Ingrid Solberg, General Counsel",
        text:
          "MAS expects notification of a relevant incident within one hour of discovery and a root cause and impact analysis inside fourteen days. Discovery was 12:31. I need your factual account for the notification in the next fifteen minutes and I need you to give me only what you can evidence. Do not write probable, do not write suspected insider, do not write anything you would not want read aloud. VARA and the Central Bank of Ireland come next; the MiCA application is live and this will land in that file.",
      },
      {
        id: "hal-i09",
        t: "T+01:05 — 13:36 SGT",
        channel: "exec",
        from: "Anselm Roth, COO",
        text:
          "Our fraud team pulled signer 3's travel and comms. Marcus Oyelaran had two calls last month with a recruiter from a firm nobody can identify, and he is the only one of the four who signed outside his normal hours. Legal is drafting a suspension. I want him off every system in the next ten minutes. Confirm.",
        decision: {
          id: "hal-d04",
          scene:
            "An hour in. A COO under enormous pressure has assembled a coherent-sounding case against a named employee out of three unremarkable facts. You have one piece of contradicting evidence — Devi's preliminary memory triage on Marcus's machine came back clean forty minutes ago — and it is preliminary.",
          clock: "T+01:05",
          pressure:
            "Defending the accused person costs you standing with the executive who is about to be your main ally for the next fortnight.",
          prompt:
            "How do you handle the accusation against Marcus Oyelaran?",
          options: [
            {
              id: "hal-d04-a",
              label: "Agree to the suspension — the pattern is suggestive and the risk of leaving him connected is too high",
              detail:
                "Suspend access, keep employment status neutral, revisit when evidence lands. Better safe than sorry.",
              score: -2,
              outcome:
                "Access removal is already done — you killed all signing at minute nine — so the suspension adds no security whatsoever. What it adds is an HR record and an internal signal that the security function believes the insider theory.",
              ripple:
                "Within a day the theory leaks internally as fact. When forensics later exonerates all seven and locates the compromise in the vendor's delivered JavaScript, Marcus has already been treated as a suspect by forty colleagues. He resigns at T+7 weeks. You lose your most experienced treasury signer at exactly the moment you are rebuilding treasury operations, and every remaining signer now understands that signing a transaction at Halcyon carries personal risk with no due process.",
            },
            {
              id: "hal-d04-b",
              label: "Refuse and say why — the access question is already resolved, the evidence contradicts the theory, and premature attribution has a cost",
              detail:
                "State plainly: all signing capability was revoked at T+00:09, so suspension buys no security. Preliminary memory triage on that machine is clean. All four signers describe the same interface behaviour, which is inconsistent with a single actor. Formal interviews will happen, conducted by counsel, for all seven, with the same process for each. No individual is singled out on this evidence.",
              score: 3,
              outcome:
                "You spend real political capital and the COO is visibly unhappy. But you have kept the investigation pointed at the evidence and protected the process that will eventually produce a defensible answer. Framing it as all seven, same process removes the appearance of protecting anyone.",
              ripple:
                "At T+38:00 the interface vendor discloses that a compromised developer workstation allowed injected JavaScript to be served from their asset bucket to specific target addresses. Every signer is exonerated. Because you never let the insider theory into a document or an HR file, there is nothing to retract, and your treasury team stays intact through the rebuild. The COO tells the board you were the only person in the room who did not guess.",
              isBest: true,
            },
            {
              id: "hal-d04-c",
              label: "Escalate to the CEO and let her decide",
              detail:
                "This is above your pay grade. Present both sides and defer.",
              score: 0,
              outcome:
                "Defensible, and it does move the decision to the right authority. But you have presented it as a balanced question when it is not balanced — you hold evidence the CEO does not, and you have chosen not to weight it. Under this much pressure the CEO takes the cautious-looking option.",
              ripple:
                "The suspension happens anyway, with your fingerprints on the process rather than on the objection. When it turns out to be wrong, the record shows security escalated without recommending. Escalation without a recommendation is abdication, and the board reads it that way.",
            },
            {
              id: "hal-d04-d",
              label: "Suspend all four signers who signed, to avoid singling anyone out",
              detail:
                "If you cannot exclude an insider, treat all four equally. It is even-handed and it removes the appearance of favouritism.",
              score: -1,
              outcome:
                "Even-handed and still wrong. You have applied a serious sanction to four people on the basis of no evidence, and you have removed four of the seven humans who understand your treasury procedures on the day you most need them.",
              ripple:
                "The rebuild of signing procedure at T+72:00 is run by people who have never done it, using documentation written by the people you suspended. Two errors get made in the new runbook that would have been caught in review. The cost of the suspension is not the suspension; it is the expertise you removed from the room.",
            },
          ],
          debrief:
            "This is the politically expensive correct answer, and it is the one that separates operators from analysts. Three facts assembled after the event into a narrative is how every wrongful internal accusation in this industry has started. The specific discipline: ask what security benefit the sanction produces given controls already in place. Here it produces none, because access was already gone at minute nine, so everything the suspension buys is signalling — and the signal is false. Contrast this with Module C, where the insider theory is correct and the same rigour points the other way. The rigour is the constant, not the conclusion.",
          principle:
            "Before you sanction a person, ask what marginal security the sanction buys. If the answer is none, you are not doing security, you are doing theatre with someone's career.",
        },
      },
      {
        id: "hal-i10",
        t: "T+01:22 — 13:53 SGT",
        channel: "chain",
        from: "Priya Raghavan, Treasury Engineering",
        text:
          "Reconstructed the transaction. The four signatures are cryptographically valid over an EIP-712 typed message with operation set to 1 — delegatecall — targeting an attacker contract. That contract mimics an ERC-20 transfer function selector but its body writes the value of the first parameter into storage slot zero, which on our proxy is the implementation pointer. So the signers approved something whose type signature looked like a token transfer and whose effect was to hand over the vault. Nothing in the wallet UI or the hardware display renders the difference between call and delegatecall in a way a human reads as danger.",
      },
      {
        id: "hal-i11",
        t: "T+01:40 — 14:11 SGT",
        channel: "press",
        from: "Joachim Deller, reporter, financial wire service",
        text:
          "We are publishing in forty minutes. We have the outflow, we have the three destination addresses, and we have a source telling us Halcyon is short of customer funds and exploring an emergency raise. Do you want to comment on solvency?",
        decision: {
          id: "hal-d05",
          scene:
            "One hour forty. The loss is 1.44 billion against roughly 9.8 billion of customer assets and a corporate reserve of 610 million plus an undrawn 900 million facility from two market makers that has not been drawn and is not contractually certain. You are solvent. Proving it in forty minutes is another matter.",
          clock: "T+01:40 — forty minutes to publication",
          pressure:
            "The reporter's source is partly right, which is the most dangerous kind of source.",
          prompt:
            "What do you and the CEO put on the record about solvency?",
          options: [
            {
              id: "hal-d05-a",
              label: "State that all customer funds are safe and fully backed one-to-one",
              detail:
                "The strongest reassurance available. It is broadly true and it kills the run.",
              score: -3,
              outcome:
                "It kills the run today. It is also a statement about reserve composition that you have not reconciled since the loss, made to a financial wire, by a licensed entity, during an active incident.",
              ripple:
                "At T+30 days the reconciliation shows a temporary shortfall in one asset class that was covered by the facility three days after your statement. The statement was false when made and true when checked. MAS treats those as different things. Your incident becomes a disclosure matter and the CEO's personal exposure changes character entirely.",
            },
            {
              id: "hal-d05-b",
              label: "Decline to comment and refer to the earlier statement",
              detail:
                "Say nothing new. Do not negotiate with a deadline.",
              score: -1,
              outcome:
                "The story runs with sources say Halcyon is exploring an emergency raise and Halcyon declined to comment on solvency in the same paragraph. You have donated the frame to a source you do not control.",
              ripple:
                "The declined to comment line is the one that gets screenshotted and circulated for the next week. Two counterparties reduce limits on the basis of it. Silence is not neutral during a run; it is read as the worst thing it could mean.",
            },
            {
              id: "hal-d05-c",
              label: "Give the specific numbers you can evidence, name the facility, and commit to a verifiable proof of reserves with a date",
              detail:
                "On the record: the loss is approximately 1.44 billion dollars from one cold vault. Halcyon holds 610 million in corporate reserves and has a 900 million facility from two named counterparties, of which we are drawing an amount we will disclose. Customer liabilities remain fully covered. We will publish a Merkle-tree proof of reserves with an independent attestation within 72 hours, and here is the methodology. Correct the emergency raise framing with the facts about the facility.",
              score: 3,
              outcome:
                "The story changes shape before it publishes. You have replaced an unfalsifiable reassurance with checkable numbers and a dated commitment, and you have corrected a specific inaccuracy rather than complaining about tone.",
              ripple:
                "The proof of reserves publishes at T+68:00 and matches your statement. Because the first number you gave was checkable and checked out, every subsequent number you publish is treated as reliable. This is the single largest determinant of whether an exchange survives a nine-figure loss — Bybit processed hundreds of thousands of withdrawals through their incident on exactly this basis.",
              isBest: true,
            },
            {
              id: "hal-d05-d",
              label: "Offer the reporter an exclusive briefing after publication in exchange for softening the solvency line",
              detail:
                "Trade access for framing. It is how this game is often played.",
              score: -2,
              outcome:
                "The reporter declines, notes the attempt, and now has a second story. Even where such arrangements exist, attempting one during an active incident with a licensed entity is a judgement failure that follows you.",
              ripple:
                "The attempted trade surfaces in a follow-up piece three weeks later. It costs you more credibility than the original loss, because the loss was something that happened to you and this was something you chose.",
            },
          ],
          debrief:
            "Solvency communication has one rule: replace adjectives with arithmetic. Every reassurance that cannot be checked decays to zero the moment anything else goes wrong, and reassurance that turns out to be wrong is a securities and licensing problem rather than a communications one. The winning option is uncomfortable because it puts a hard number on the loss before you would like to. That is exactly why it works — you are trading a bad number today for the ability to be believed for the rest of the incident. And a dated, methodologically-specified proof of reserves is worth more than any amount of language, because it converts your claim into something a stranger can verify without trusting you.",
          principle:
            "In a solvency panic, publish arithmetic and a verification date. Adjectives are read as evasion and reassurance is read as a countdown.",
        },
      },
      {
        id: "hal-i12",
        t: "T+02:20 — 14:51 SGT",
        channel: "exec",
        from: "Rafael Iturbe, CTO",
        text:
          "I have a plan. I can stand up a fresh 5-of-9 vault with new keys in about ninety minutes and migrate what is left across chains tonight, so we are operational before Asia opens Monday and before anyone else can touch anything. Kyle and Marcus can generate keys from their existing setups — we do not have time to source new hardware. I want to go now.",
        decision: {
          id: "hal-d06",
          scene:
            "Two hours twenty. The CTO's plan is competent, energetic, and would move every remaining asset using an unknown-integrity toolchain, on machines you have not cleared, through an interface you have not exonerated, under time pressure created by a market open that does not actually matter.",
          clock: "T+02:20",
          pressure:
            "Saying no here makes you the person blocking recovery. Everyone in the room wants to do something constructive.",
          prompt:
            "Rafael wants to migrate the remaining treasury tonight. What do you say?",
          options: [
            {
              id: "hal-d06-a",
              label: "Approve it — moving assets away from a known-compromised context is obviously safer than leaving them",
              detail:
                "Speed is a control. Get the assets behind new keys before the attacker comes back.",
              score: -3,
              outcome:
                "You would be authorising the largest asset movement in company history using the exact class of tooling that has just been demonstrated untrustworthy, on unimaged hardware, at 3am local time for two of the signers, with no independent verification path.",
              ripple:
                "The migration succeeds. Ten days later forensics establishes the compromise was in the vendor's delivered interface bundle, which was still being served when you migrated. You spend a week unable to answer whether the new vault is clean, and you re-migrate again — this time correctly — having burned trust and 340,000 dollars of gas doing it twice.",
            },
            {
              id: "hal-d06-b",
              label: "Say no, and be explicit that the reason is that you do not yet know the blast radius",
              detail:
                "Nothing moves until three things are true: signer hardware is imaged and cleared, the signing path is reconstructed from artefacts you control rather than vendor-delivered code, and there is an independent out-of-band verification of the transaction hash on a device that has never touched the compromised toolchain. Assets stay where they are. Assets sitting still are not accruing risk; assets moving through unverified tooling are.",
              score: 3,
              outcome:
                "Rafael is frustrated and the room deflates. But you have named the actual property that matters: an asset at rest behind a contract nobody can currently sign for is safer than the same asset in flight through a toolchain of unknown integrity.",
              ripple:
                "The migration happens at T+9 days using an air-gapped signing path with independent hash verification, and the procedure it produces becomes Halcyon's permanent treasury standard. Rafael co-authors it. The delay costs nothing measurable; the procedure is the most valuable artefact to come out of the entire incident.",
              isBest: true,
            },
            {
              id: "hal-d06-c",
              label: "Approve a partial migration of the smallest vault as a test",
              detail:
                "Prove the new path works on a small balance before committing the rest. Iterate safely.",
              score: -1,
              outcome:
                "Sounds like good engineering discipline and is not, because the failure mode you are worried about is not a mechanical one. A successful small migration proves nothing about whether the toolchain is compromised — an attacker who has your interface will let a small test succeed.",
              ripple:
                "The test succeeds and manufactures false confidence. At T+04:00 the team, reassured, starts moving larger balances. You catch it because a junior engineer asks a question nobody senior thought to ask. That engineer becomes your best hire of the year and you were nine minutes from a second incident.",
            },
            {
              id: "hal-d06-d",
              label: "Defer to the CEO with a recommendation to wait",
              detail:
                "Present the risk, recommend waiting, let the executive own the timing call.",
              score: 1,
              outcome:
                "Not wrong. You made a recommendation, which is the minimum bar. But this is a technical integrity decision inside your remit and pushing it upward under time pressure invites a compromise timeline that satisfies nobody.",
              ripple:
                "The CEO splits the difference and authorises a migration at T+48:00, before hardware clearance completes. It works out. You spend the next six months without a clear precedent that the security function can stop an asset movement, and the next time it matters the argument has to be had again from scratch.",
            },
          ],
          debrief:
            "The hardest thing to do in hour three is nothing. Every incentive in the room rewards visible motion, and the person who says wait is absorbing all the discomfort so the organisation does not have to. The reframe that makes it winnable: assets at rest are not accruing risk. The risk is in the movement, and specifically in the toolchain that renders and transmits the movement. Radiant Capital rebuilt from clean devices and moved from a 3-of-11 to a 4-of-7 with 72-hour timelocks — but they did it after establishing what was compromised, not during. Also note what the winning option actually produces: an air-gapped, independently-verified signing procedure. The best artefact of most incidents is a procedure, and you only get it if you refuse to skip the step where you understand the failure.",
          principle:
            "In an integrity incident, stillness is a control. Do not move value through a toolchain you have not yet exonerated, no matter who is asking.",
        },
      },
      {
        id: "hal-i13",
        t: "T+03:12 — 15:43 SGT",
        channel: "field",
        from: "Meridian Vault (interface vendor) — Head of Security",
        text:
          "We have completed an initial review. Our smart contracts are unaffected and our source repositories show no unauthorised commits. We have found no evidence of compromise in our infrastructure. We would ask that public statements from Halcyon reflect that the issue appears to be on the client side.",
      },
      {
        id: "hal-i14",
        t: "T+03:30 — 16:01 SGT",
        channel: "pager",
        from: "Devi Anand, Endpoint and Detection Engineering",
        text:
          "Contradiction. Memory captures from four machines are clean of malware, but the browser cache on two of them holds a JavaScript bundle from the vendor's asset domain whose hash does not match what that domain serves right now, and does not match any build artefact in their public release history. The bundle contains a conditional that only activates for a small allowlist of wallet addresses, one of which is ours. It rewrites the transaction object between the confirm click and the hardware wallet, then restores the original for display. Their repositories being clean is entirely consistent with this. The tampering is downstream of source control.",
        decision: {
          id: "hal-d07",
          scene:
            "Three and a half hours. You now hold cached evidence that contradicts a vendor's public position. Two hundred other institutions use that vendor's interface today, right now, with the same conditional possibly still live for other addresses.",
          clock: "T+03:30",
          pressure:
            "Your commercial relationship, your legal exposure, and two hundred strangers' treasuries are pointing in three different directions.",
          prompt:
            "You have evidence the vendor's delivered code was tampered with. What do you do with it?",
          options: [
            {
              id: "hal-d07-a",
              label: "Send the artefacts to the vendor privately and give them 24 hours before saying anything publicly",
              detail:
                "Responsible disclosure norms. Let them verify and lead their own communication.",
              score: 0,
              outcome:
                "Correct instinct in almost every other context and too slow in this one. This is not a latent vulnerability requiring a patch cycle; it is an active, in-the-wild compromise of a live delivery channel, and the allowlist has other addresses on it.",
              ripple:
                "The vendor confirms in nine hours and rotates their infrastructure. In the meantime two other institutions sign transactions through the same interface. One is fine. One loses 31 million dollars. The 24 hours you granted out of politeness is the interval in which that happened.",
            },
            {
              id: "hal-d07-b",
              label: "Notify the vendor and the wider ecosystem simultaneously, with the artefact hashes and the indicator, within the hour",
              detail:
                "Send the vendor everything at the same moment you push an indicator advisory to the exchange security sharing group, your peer CISOs, and the vendor's other large customers you can reach directly. Publish the bundle hash and the activation condition. Do not characterise the vendor's culpability; publish only what you observed.",
              score: 3,
              outcome:
                "Two peer exchanges halt vendor-interface signing within forty minutes. The vendor is embarrassed and moves fast because they now have to. You have taken observed facts and turned them into someone else's prevented incident, without asserting anything about fault that you cannot support.",
              ripple:
                "At T+38:00 the vendor confirms a compromised developer workstation gave access to the credentials controlling their asset bucket, that the injected code targeted specific addresses, and that fresh clean bundles were uploaded within minutes of the transaction executing. Your advisory is cited as the trigger. Halcyon's standing in the industry after this incident is materially higher than it was before, which is a genuinely strange and genuinely real outcome.",
              isBest: true,
            },
            {
              id: "hal-d07-c",
              label: "Hold the evidence until counsel has assessed litigation posture against the vendor",
              detail:
                "You may be recovering 1.44 billion dollars from someone. Do not hand your best exhibit to the defendant.",
              score: -3,
              outcome:
                "Legally rational and ethically indefensible. You would be sitting on an active compromise indicator affecting other people's customer assets in order to improve a recovery position.",
              ripple:
                "The delay becomes known — these things always do, usually through a discovery process or a departing employee. It reframes Halcyon from victim to actor in every subsequent account of the incident, and it is the single fact your competitors will repeat about you for years.",
            },
            {
              id: "hal-d07-d",
              label: "Publish immediately and publicly attribute the breach to the vendor",
              detail:
                "Say plainly that the vendor was compromised and that Halcyon's controls performed as designed.",
              score: -1,
              outcome:
                "The indicators reach people quickly, which is the good part. But you have made a causal attribution four hours in, based on cached artefacts, before anyone has established how the bundle was tampered with — CDN, bucket, build pipeline, or in-transit.",
              ripple:
                "One element of your attribution is imprecise and the vendor corrects it publicly at T+12:00. The correction is minor and it costs you the moral high ground for the rest of the incident. You were right and you sounded like you were guessing, which in public is the same as guessing.",
            },
          ],
          debrief:
            "The discipline is separating observation from attribution and being fast on the first while being slow on the second. You observed: a bundle from their domain, with a hash matching no known release, containing an address-conditioned transaction rewrite. That is publishable within the hour and it is enough for a peer to defend themselves. Who is at fault is a question for week three. The Bybit case is the reference implementation of this failure mode running in reverse: the exchange's own contracts and infrastructure were fine, the compromise was in the interface delivery path at the vendor, and the industry's ability to react quickly came from indicators being shared rather than from anyone's root cause being settled. Also note the vendor's first statement was not a lie — their contracts and repositories genuinely were clean. Tampering downstream of source control is invisible to every question they asked themselves.",
          principle:
            "Publish observations at the speed of the threat and attributions at the speed of the evidence. Confusing the two costs either lives or credibility.",
        },
      },
      {
        id: "hal-i15",
        t: "T+06:40 — 19:11 SGT",
        channel: "chain",
        from: "Yusra Belkacem, Blockchain Intelligence",
        text:
          "Correcting an earlier call. At T+02:00 I told the bridge the funds had entered a mixer. That was wrong — I matched against a cluster label that a vendor had misattributed and has since retracted. What actually happened: the ETH was split across 47 intermediary addresses, partially converted to BTC through no-KYC swap services, and a meaningful portion is sitting still. Holding funds dormant to outlast the attention window is characteristic tradecraft for the DPRK-linked clusters, and the FBI has publicly attributed the Bybit theft to the TraderTraitor activity set. I am not attributing ours yet. I am telling you my first call was wrong and why.",
      },
      {
        id: "hal-i16",
        t: "T+08:15 — 20:46 SGT",
        channel: "board",
        from: "Camille Aurbach, independent director, chairs the Risk Committee",
        text:
          "Two questions for the Monday board pack, and I want them answered by you rather than by the CEO. First: what specific control would have prevented this, stated as something we can fund and measure. Second: at what point did anyone at Halcyon last ask whether a transaction simulator and a hardware wallet actually verify the same thing? Because I have read three of your audit reports and none of them ask it.",
        decision: {
          id: "hal-d08",
          scene:
            "Eight hours in, and the most useful person in the company has just asked the only question that matters. Your answer will set the security budget and the security mandate for the next three years.",
          clock: "T+08:15 — board pack due Monday",
          pressure:
            "The tempting answer is the one that sounds like more security. The correct answer is narrower and harder to sell.",
          prompt:
            "What do you tell the Risk Committee is the control that would have prevented this?",
          options: [
            {
              id: "hal-d08-a",
              label: "More signers and a higher threshold — move from 4-of-7 to 6-of-11",
              detail:
                "Raise the bar. More independent humans must be deceived for the attack to work.",
              score: -2,
              outcome:
                "Intuitive, expensive, and almost useless against this attack class. The compromise was in the shared rendering layer every signer used. Adding signers who all read the same lie increases the number of people deceived, not the difficulty of deceiving them.",
              ripple:
                "You implement it. Signing latency roughly doubles, treasury operations slow to the point where the team starts batching transactions to cope, and batching makes each individual transaction harder to review. You have made the human verification step worse while reporting to the board that you strengthened it.",
            },
            {
              id: "hal-d08-b",
              label: "Independent out-of-band verification of the exact signing payload on a device that never touches the signing toolchain",
              detail:
                "Before any signature, each signer independently computes the EIP-712 domain and message hash from raw calldata using a separate tool on a separate device, decodes the operation type and target, and confirms it matches. Any transaction with operation set to delegatecall requires a named exception with a second approver. Any failed or retried signing attempt halts the entire process pending review. Adopt clear-signing metadata under ERC-7730 so the hardware device renders intent rather than a hash.",
              score: 3,
              outcome:
                "Precise, fundable, measurable, and it directly severs the causal chain: the attack worked because the thing that rendered the transaction and the thing that transmitted it were the same untrusted surface. You are proposing a second, independent path to the same truth.",
              ripple:
                "You can measure it — percentage of treasury transactions with independent hash verification, time-to-verify, exception count. Twelve weeks later a routine transaction fails verification because of a genuine tooling bug, and the halt-on-retry rule catches it. Radiant Capital published almost exactly this list after their October 2024 loss, including the rule that any signing error must trigger a full review rather than a retry — the retry loop is what let attackers harvest three valid signatures.",
              isBest: true,
            },
            {
              id: "hal-d08-c",
              label: "Bring the signing interface in-house so no third party is in the path",
              detail:
                "Remove vendor risk entirely. Build and host our own signing front end from source we control.",
              score: 0,
              outcome:
                "Defensible strategy, wrong answer to this question. You would replace a vendor's build and delivery pipeline with your own build and delivery pipeline, which is a supply chain you have never had to defend at that assurance level. The failure was tampering downstream of source control — you now own that risk instead of transferring it, without yet having the maturity to hold it.",
              ripple:
                "Eighteen months and four engineers later you have an internal signing app with a dependency tree nobody has attested, deployed from a CI system with broader write access than the vendor's had. You have converted a vendor risk into a build integrity risk and the board believes the problem is solved.",
            },
            {
              id: "hal-d08-d",
              label: "A mandatory time delay on all large treasury movements",
              detail:
                "A 24-hour timelock on any transfer above a threshold, with a guardian able to cancel during the window.",
              score: 1,
              outcome:
                "Genuinely valuable and not the answer to this question. A timelock would have given you a cancellation window here, which is real. But the transaction that executed was an implementation-pointer rewrite that looked like a routine small transfer — under a value-threshold timelock it would not have tripped the threshold at all.",
              ripple:
                "You implement it as specified and it protects you against a different attack. Nine months later a similar payload passes straight through because it moves no value at signing time. The lesson lands the second time: timelocks must key on privileged operations, not only on value.",
            },
          ],
          debrief:
            "Camille's second question is the sharper one and most CISOs never ask it of themselves. A transaction simulator and a hardware wallet feel like two independent verifications. They are not. The simulator evaluates the payload the compromised page hands it, and the hardware wallet displays a hash of the payload the compromised page hands it. One lie upstream produces two confirmations downstream, and the human reads two green ticks as corroboration. That is the entire attack. Radiant Capital's signers ran Tenderly simulations that came back clean, on Ledger and Trezor devices, and lost fifty million dollars. Independence has to be structural — a different device, a different code path, a different source of truth — or it is not independence, it is duplication.",
          principle:
            "Two checks that consume the same input are one check. Verification is only independent when the paths do not share an ancestor.",
        },
      },
    ],
    scoring: [
      {
        dimension: "Blast-radius reduction",
        weight: 0.25,
        note:
          "Did signing capability across the entire estate stop before any diagnosis was attempted? Measured by elapsed time from first alert to full revocation of every signing path, and by whether any second attempt had a live path when it arrived. Chasing funds, arguing about attribution, or waiting for a theory before revoking all score badly here regardless of how the incident ends.",
      },
      {
        dimension: "Evidence integrity",
        weight: 0.2,
        note:
          "Volatile memory captured before disk, disk before login, two-person custody, hashes logged. Judged on whether the eventual root cause statement rests on artefacts a hostile third party could re-verify. Wiping and reissuing to restore capability is scored as a total loss on this dimension even where operations recover faster.",
      },
      {
        dimension: "Communication accuracy",
        weight: 0.2,
        note:
          "Every public and regulatory statement is checked against what was actually evidenced at the moment it was made. The metric is retractions, not tone. A statement that was reassuring and later required correction scores worse than a statement that was frightening and held. Arithmetic and dated verification commitments score above adjectives.",
      },
      {
        dimension: "Attribution discipline",
        weight: 0.2,
        note:
          "Did observations reach people who needed them at threat speed while causal claims waited for evidence? Judged on both failure directions: sitting on indicators that would have protected peers, and asserting fault or naming an internal suspect ahead of the forensics. Accusing an innocent signer and shielding a compromised vendor are the same error wearing different clothes.",
      },
      {
        dimension: "Team sustainability",
        weight: 0.15,
        note:
          "Are the people who signed in good faith still employable, still employed, and still willing to sign? Are the responders on a rotation that survives week two? Counted against you: sanctions with no marginal security benefit, unrecorded interviews that later read as interrogations, and any decision that removed operational expertise from the room during the rebuild.",
      },
    ],
    debrief: [
      {
        title: "The contract was fine. That is the entire lesson.",
        body:
          "Three audits, six hundred and eleven days of clean operation, four cryptographically valid signatures from four independent humans on four hardware wallets in four countries. Every control worked exactly as designed and the vault emptied anyway, because the trust boundary in a multisig is not the contract and it is not the key — it is the screen where a human forms an intention. Everything upstream of that screen is inside the trust boundary whether you modelled it that way or not: the browser, the extension, the bundle, the CDN, the vendor's build pipeline, and the workstation of a developer at a company you have never audited. Bybit's February 2025 loss of roughly 401,000 ETH, close to 1.5 billion dollars, was this exact shape. Their contracts were sound. Safe's contracts were sound. Safe's source repositories were sound. The compromise was injected JavaScript served from the vendor's asset bucket, conditioned to activate only for specific target addresses, replaced with clean versions within about two minutes of the transaction executing. If your threat model for treasury stops at your own perimeter, you have modelled the wrong system.",
      },
      {
        title: "What blind signing actually costs, in mechanism",
        body:
          "The attack payload used execTransaction with the operation parameter set to 1, meaning delegatecall, pointed at a contract whose function selector mimicked an ERC-20 transfer. Its body did not transfer anything; it wrote its first parameter into storage slot zero, which on a proxy is the implementation pointer. The signers were therefore asked to approve a message whose type structure read as a token transfer and whose effect was to replace the wallet's brain. EIP-712 gives you typed structured data, which is a genuine improvement over signing raw bytes, but as the NCC Group analysis of the Bybit transaction put it, EIP-712 does not solve rendering nested operations in a human-readable way. A hardware wallet showing you a hash is not showing you a decision. This is precisely the gap ERC-7730 — the Structured Data Clear Signing Format, a draft standard with authors from Ledger and across the ecosystem — exists to close: a JSON metadata format that tells a wallet how to render a call as intent rather than as hex. Until clear signing is universal, every large treasury needs the manual equivalent: decode raw calldata independently, read the operation type explicitly, and treat delegatecall as a break-glass event requiring named authorisation. Not because delegatecall is evil, but because it is the one operation whose blast radius is unbounded.",
      },
      {
        title: "Simulation is not verification when the attacker owns the renderer",
        body:
          "This is the finding most teams resist, because transaction simulation genuinely is one of the better controls available and it feels like independent confirmation. Radiant Capital's October 2024 post-mortem is the definitive account: three developers, geographically distributed, on Ledger wallets via Rabby and a Trezor via Frame, all running Tenderly simulations, all seeing legitimate transactions on the Safe front end. The malware operated at the device level between the confirm click and the hardware wallet. The simulator saw correct data because it was fed correct data; only the screen and the signed payload diverged. Roughly fifty million dollars, and their own words were that it was undetectable during manual review of the Safe UI and Tenderly simulation stages. There is a second detail in that post-mortem worth memorising: the malware induced deliberate transaction failures, and the developers resubmitted, because failed submissions are routine. Three retries produced three valid malicious signatures while looking like an ordinary bad afternoon. Retry loops are signature harvesting mechanisms. Any signing error must halt the process and trigger review, never a retry.",
      },
      {
        title: "Irreversibility as a design constraint, not a talking point",
        body:
          "Everyone in crypto says transactions are irreversible and almost nobody builds as though they believe it. The operational meaning is specific: there is no chargeback, no admin override, no clawback, and no realistic prospect of a chain reorganisation. The 2016 DAO fork is invoked constantly and is not available to you — it required rough social consensus on a young chain with an unusually concentrated stakeholder set, and the fact that it has never been repeated at scale despite far larger losses is the data point that matters. Bybit did not get a fork. Ronin did not get a fork. Because the loss is terminal, the entire security budget for treasury has to sit before the signature, and the value of a control is proportional to how far upstream of the signature it acts. This inverts the ordinary incident-response instinct. In most enterprise incidents, detection speed is the dominant variable because faster detection means less damage. Here, detection at minute zero and detection at minute sixty produce identical losses. What detection speed buys you is not recovery of this transaction; it is prevention of the next one. Reorganise your treasury programme around that and you will fund very different things.",
      },
      {
        title: "The first hour belongs to capability denial, not diagnosis",
        body:
          "The structural insight from this simulation is that the correct opening move required no knowledge. Revoking every signing capability across the estate is right if the compromise is an endpoint, right if it is a signer, right if it is the vendor, right if it is your own CI, and right if it is something nobody has thought of yet. Look for moves with that property at the start of any incident where you cannot yet name the cause. They are rare and they are worth enormous amounts. The corollary is that the most seductive early actions — tracing funds, interviewing people, drafting statements, forming a theory — are all conditional on facts you do not have, and each one consumes the attention of the people who should be closing doors. A useful discipline for the first ten minutes: write down the set of hypotheses you cannot yet exclude, then take only actions that are correct under all of them.",
      },
      {
        title: "The politics of the accusation, and why the rigour must be symmetric",
        body:
          "An hour in, a competent COO under real pressure assembled three unremarkable facts into a compelling story about a named colleague. This happens in nearly every large-loss incident, and defending the accused person is one of the few genuinely unpopular duties of the role. The test that resolves it is mechanical rather than moral: what marginal security does this sanction produce given controls already in place? At Halcyon the answer is none, because access was revoked at minute nine — so everything the suspension delivers is signalling, and the signal is false. Hold that test firmly and note that in Module C the same test points the other way, because there the access is live and the insider theory is correct. The rigour is the constant. What varies is where it lands. An organisation that watches its security lead protect an innocent signer with evidence will believe that same lead when the evidence points at a guilty one.",
      },
      {
        title: "The transferable pattern: every human approval is a rendered claim",
        body:
          "Strip the crypto away and this is a general result about approval systems. Anywhere a human authorises a consequential action, they are not authorising the action — they are authorising a rendering of the action produced by software, and the rendering and the execution are usually derived from the same source. Wire approval screens in corporate treasury and ERP systems. The diff view in a code review, where what you read and what merges are both produced by the forge. Infrastructure-as-code plan output, where the plan is generated by the same binary that applies it. And, increasingly, the confirmation dialog an AI agent shows before taking an action on your behalf, rendered by the very system whose behaviour you are trying to constrain. The defence is structurally identical in every case: an independent path to the same truth, computed by a different tool, on a different device, from the raw artefact rather than from the renderer's output. If you can only remember one thing from this simulation, remember to ask of any approval control — what would the screen look like if the attacker owned it, and would the human notice?",
      },
    ],
    awards: [
      "strong-blind-signing-breaker",
      "safe-cold-vault-commander",
      "strong-irreversible-clock",
      "safe-evidence-before-recovery",
      "strong-independent-verification-path",
    ],
  },

  /* ============================================================
     MODULE B — the treasury voted to rob itself
     ============================================================ */
  {
    id: "sim-verity-governance-capture",
    title: "Forty-Eight Hours of Timelock",
    org: "Verity Reserve DAO / Verity Protocol",
    sector: "Decentralised over-collateralised credit protocol — Cayman foundation, contributors in 14 countries",
    chapterId: "ch-chain",
    essence: "violet",
    difficulty: 4,
    minutes: 70,
    respect: 1020,
    trust: 46,
    mode: "both",
    brief:
      "Verity is an over-collateralised credit protocol on Ethereum mainnet and Base with 740 million dollars of total value locked and a DAO treasury of 118 million — 61 million in USDC, 24 million in ETH and staked ETH, and the rest in its own VRT governance token. Thirty-one core contributors are paid by a Cayman foundation; nobody is an employee of anything. Governance is a Governor Bravo fork: 40,000 VRT to submit a proposal, four percent quorum, a three-day voting period, and a 48-hour timelock before execution. Two years ago, after a stablecoin depeg scare, the DAO voted in an emergency path — executeEmergency — which allows immediate execution with no timelock if a proposal reaches a two-thirds supermajority of votable supply. It has been used twice, both times legitimately, both times celebrated. Voting power is read from the vote-escrow contract at the moment of the vote, with a lock-duration multiplier, and the votingDelay parameter was set to one block during a gas optimisation refactor eleven months ago that nobody flagged. The forum has 62,000 members. Every word you type is public and permanent, and the adversary is reading it in real time. You are Verity's Head of Security, an elected contributor with a nine-month term, and you have no authority anyone is obliged to obey. It is Saturday, 02:14 UTC.",
    objective:
      "Stop 118 million dollars of treasury and 740 million of user collateral from leaving through a mechanism the DAO itself voted for, without destroying the thing the DAO is. You have a 48-hour window that is not actually 48 hours, a Security Council that can cancel but whose use of that power damages the protocol's decentralisation posture in ways that matter legally and culturally, and a public audience that will interpret every action as either heroism or a coup depending on how you frame it. Winning is: the malicious execution never lands, no user is liquidated by your own defensive measures, the governance defect is fixed at the root rather than patched at the symptom, and the community understands why the emergency power was used well enough that it survives the next vote to remove it.",
    roles: ["u-ledger", "u-cartographer", "u-signal", "u-compass", "u-oracle", "u-anchor"],
    injects: [
      {
        id: "ver-i01",
        t: "T+00:00 — Sat 02:14 UTC",
        channel: "chain",
        from: "Governance Watch (automated) — proposal monitor",
        text:
          "New proposal VIP-47 submitted by an address funded four days ago through a no-KYC instant swap service. Proposer voting power at submission: 1,214,000 veVRT, acquired in the same block as submission. Title: Treasury Diversification into Tokenised Treasury Bills. Payload is a batch of nine calls. Voting is already open — votingDelay is one block.",
      },
      {
        id: "ver-i02",
        t: "T+00:21 — Sat 02:35 UTC",
        channel: "community",
        from: "forum.verity.xyz — post by proposer, handle vrt-steward",
        text:
          "Longform proposal, 2,800 words, with a term sheet from a real tokenised T-bill issuer, a legal opinion PDF, a yield model in a public spreadsheet, and a professionally designed one-pager. It proposes moving 40 million USDC into a short-duration tokenised treasury product for a projected 4.9 percent yield, and includes a small standing allocation to a public goods fund. Fourteen replies inside twenty minutes, all positive. Two well-known delegates say they intend to vote yes.",
      },
      {
        id: "ver-i03",
        t: "T+00:40 — Sat 02:54 UTC",
        channel: "pager",
        from: "Tomas Wieck, protocol engineer, on call",
        text:
          "I am awake and I have read the payload. Eight of the nine calls do exactly what the post says. The ninth is a delegatecall from the timelock to a contract deployed nine days ago with unverified source. I cannot tell you what it does yet. What do you want me to do first?",
        decision: {
          id: "ver-d01",
          scene:
            "Forty minutes in. You have a suspicious ninth call, no analysis, and a public forum where a proposal is gathering genuine enthusiasm from people you respect. Everything you say is visible to the proposer.",
          clock: "T+00:40",
          pressure:
            "Speaking early risks being wrong in public. Staying quiet risks the proposal accumulating so much social momentum that opposing it later looks like obstruction.",
          prompt:
            "Your first move on VIP-47.",
          options: [
            {
              id: "ver-d01-a",
              label: "Post immediately in the forum that VIP-47 contains a malicious payload and must not be voted on",
              detail:
                "Speed matters. Warn the community before delegates start voting.",
              score: -1,
              outcome:
                "You have made a strong factual claim with zero analysis behind it. The proposer replies within eight minutes with a calm, technically fluent explanation that the ninth call is a standard initialisation pattern, links to a similar batch from a well-known protocol, and asks whether the security team reviews every proposal this way or only ones from new addresses.",
              ripple:
                "You look reactive and slightly paranoid. When your real analysis lands three hours later and is correct, a meaningful fraction of the forum has already decided you cry wolf. The cost is not this proposal; it is that your next warning is discounted.",
            },
            {
              id: "ver-d01-b",
              label: "Decompile the ninth call silently, convene the Security Council on a private channel, and post nothing yet",
              detail:
                "Get Tomas plus two independent reviewers onto the bytecode. Open the Security Council channel and put them on standby with a cancellation transaction pre-built but unsigned. Instrument the vote-escrow contract for voting power changes. Say nothing publicly until you can show your work.",
              score: 3,
              outcome:
                "Ninety minutes of quiet work produces a decoded payload, a reproducible fork test showing the effect, and a Security Council already assembled with a prepared transaction. You have also not told the attacker what you know or when you noticed.",
              ripple:
                "At T+04:30 you publish decompiled bytecode, a Tenderly fork trace, and a one-line summary of the effect. Nobody argues. The proposal's support collapses in under an hour because you brought evidence rather than an accusation, and the delegates who had endorsed it publicly are able to reverse without losing face.",
              isBest: true,
            },
            {
              id: "ver-d01-c",
              label: "Ask the proposer publicly to explain the ninth call",
              detail:
                "Transparent, non-accusatory, and puts the burden of explanation where it belongs.",
              score: 0,
              outcome:
                "Courteous and it hands the attacker the initiative. They produce a plausible, confident, well-written explanation within minutes — they have prepared one — and now the technically credible answer is in the thread and yours is not, because you have not done the work yet.",
              ripple:
                "You spend the next four hours arguing against an explanation instead of presenting an analysis. The frame is theirs. When you eventually prove the payload drains the treasury, half the forum reads it as the security team winning an argument rather than as a discovered fact.",
            },
            {
              id: "ver-d01-d",
              label: "Trigger the pause guardian and freeze the protocol while you investigate",
              detail:
                "740 million of user collateral is at stake. Pause first, ask questions after.",
              score: -3,
              outcome:
                "You freeze a live lending market on a Saturday over an unanalysed call in a proposal that cannot execute for at least 48 hours even if it passes. The pause halts the liquidation engine.",
              ripple:
                "ETH moves seven percent over the next nine hours while liquidations are frozen. The protocol accrues 4.1 million dollars of bad debt that your pause caused and the attacker did not. You have spent your most disruptive power on the wrong threat at the wrong time, and the DAO will vote to constrain the guardian role — leaving you weaker for the actual emergency.",
            },
          ],
          debrief:
            "Public-by-default changes the calculus of early warning. In a corporate incident you can raise a concern internally at low cost and refine it. In a DAO, a warning is a publication and a publication is a commitment. That does not mean go slow on analysis; it means go fast on analysis and slow on announcement. Note what the winning option buys beyond the analysis itself: an assembled Security Council with an unsigned cancellation ready, and instrumentation on the voting power source. Both are preparation you cannot do in a hurry later, and neither is visible to the adversary.",
          principle:
            "In public governance, do the work privately and publish the proof. An accusation without a trace is a gift to a prepared adversary.",
        },
      },
      {
        id: "ver-i04",
        t: "T+01:35 — Sat 03:49 UTC",
        channel: "chain",
        from: "Tomas Wieck, protocol engineer",
        text:
          "Decompiled. The ninth call is a delegatecall from the TimelockController to an init contract. Its body adds a new facet with an unrestricted function that transfers arbitrary balances from the treasury and from the collateral module to a caller-supplied address. It does not move funds when the proposal executes. It installs a door. Everything else in the batch is real and would work exactly as described. This is the Beanstalk shape — April 2022, 182 million dollars, a proposal with a genuine Ukraine donation attached to a payload that drained everything.",
      },
      {
        id: "ver-i05",
        t: "T+02:10 — Sat 04:24 UTC",
        channel: "community",
        from: "Aurelio Kanz, Ninth Circle Audits, quote-posted 900 times",
        text:
          "We took a look at VIP-47 since people are asking. Calldata decodes cleanly, the treasury calls are well-formed, and we see nothing anomalous. As always, do your own research, but this looks like a normal diversification proposal to us. Happy to be corrected.",
      },
      {
        id: "ver-i06",
        t: "T+02:30 — Sat 04:44 UTC",
        channel: "community",
        from: "Ines Barbosa, contributor comms lead",
        text:
          "Ninth Circle just blessed it and the forum has relaxed. Two more delegates flipped to yes in the last ten minutes. If you are going to contradict Aurelio publicly you should know he audited our v2 core and half the delegates trust him more than they trust us. How do you want to play this?",
        decision: {
          id: "ver-d02",
          scene:
            "A respected external auditor has publicly cleared a payload you can prove is malicious. They are not lying — they decoded the calldata and it is well-formed. They did not fetch and analyse the bytecode at the delegatecall target, which is the only place the attack lives.",
          clock: "T+02:30",
          pressure:
            "Contradicting a trusted name in public is expensive and being right is not automatically enough.",
          prompt:
            "How do you handle the Ninth Circle post?",
          options: [
            {
              id: "ver-d02-a",
              label: "Post the full decompilation and fork trace publicly, name the specific gap in their method, and do it in the same thread",
              detail:
                "Publish the bytecode, the decompiled facet, a Tenderly fork showing the treasury draining after execution, and state plainly that calldata decoding does not evaluate the bytecode at a delegatecall target. Frame it as a methodology gap that catches everyone, not as an error by a person.",
              score: 3,
              outcome:
                "Aurelio verifies your trace inside twenty minutes and retracts publicly and gracefully — this is what a good auditor does when handed a reproducible artefact. The retraction from him is worth ten times more than your original post, because it comes from the person the delegates trusted.",
              ripple:
                "The exchange becomes a widely cited reference on why calldata review is not payload review. Ninth Circle adds delegatecall target bytecode analysis to their governance review checklist and says so. Your credibility with the delegate set is permanently higher because you contradicted a friend with evidence instead of with authority.",
              isBest: true,
            },
            {
              id: "ver-d02-b",
              label: "Message Aurelio privately and ask him to retract before you post anything",
              detail:
                "Preserve the relationship, let him correct his own statement, avoid a public fight.",
              score: 0,
              outcome:
                "Considerate and slow. Aurelio is asleep or in another timezone; you lose ninety minutes. Meanwhile his clean bill of health is the most-shared post in the forum and votes accumulate against a background of false reassurance.",
              ripple:
                "By the time the correction lands, the proposal has crossed quorum. It would have crossed anyway, but you have taught yourself a bad reflex: that protecting a professional relationship is worth ninety minutes during an active governance attack. That reflex will cost you more somewhere else.",
            },
            {
              id: "ver-d02-c",
              label: "Post your analysis without referencing Ninth Circle at all",
              detail:
                "Present the evidence on its own merits and let readers draw conclusions. Avoid a confrontation.",
              score: 1,
              outcome:
                "Honourable and less effective. The forum now holds two confident, contradictory expert statements and no explanation of why they differ. Non-technical delegates cannot adjudicate and default to the more comfortable conclusion.",
              ripple:
                "Confusion persists for hours and a faction forms around the idea that the security team is overreacting. You eventually have to explain the methodology gap anyway, at T+06:00, under worse conditions and with an audience that has already picked sides.",
            },
            {
              id: "ver-d02-d",
              label: "Ask the foundation to have Ninth Circle take the post down",
              detail:
                "They are a paid vendor. Use the commercial relationship to remove the misinformation quickly.",
              score: -3,
              outcome:
                "You have attempted to use a commercial lever to suppress a public technical opinion in a community whose entire premise is that opinions are not suppressible. It will become known.",
              ripple:
                "A screenshot of the request circulates within a week. It does more damage to Verity's governance culture than the attack does to its treasury, and it hands every future critic a permanent example of the core team using money to shape public analysis.",
            },
          ],
          debrief:
            "The teaching here is about the specific methodology gap, because it recurs constantly: decoding calldata tells you the shape of a call, not the behaviour of the code at its destination. A delegatecall executes foreign bytecode in your own storage context, so reviewing a governance proposal without fetching and analysing the bytecode at every delegatecall target is reviewing the envelope rather than the letter. Beanstalk's BIP-18 had exactly this structure in April 2022. The second lesson is social: the correct way to contradict a respected expert in public is with a reproducible artefact and a named methodological gap, never with credentials or tone. A fork trace anyone can rerun ends the argument in twenty minutes. An assertion starts a faction.",
          principle:
            "Calldata review is not payload review. Any delegatecall target is code you are executing, and unreviewed code you execute is code you have authorised.",
        },
      },
      {
        id: "ver-i07",
        t: "T+03:50 — Sat 06:04 UTC",
        channel: "chain",
        from: "Governance Watch (automated) — voting power monitor",
        text:
          "Correction to earlier telemetry. Proposer voting power was reported at 1,214,000 veVRT, which mapped to roughly 41 percent of votable supply. That figure omitted the lock-duration multiplier applied by the vote-escrow contract. Recomputed against getVotes at current block: 68.3 percent of votable supply. The executeEmergency threshold is two-thirds. The proposer is above it now.",
      },
      {
        id: "ver-i08",
        t: "T+04:05 — Sat 06:19 UTC",
        channel: "pager",
        from: "Tomas Wieck, protocol engineer",
        text:
          "This changes everything and I want to be precise about it. There is no 48-hour timelock in this scenario. There never was. executeEmergency bypasses the timelock entirely at a two-thirds supermajority and they crossed it. They can execute in the next block. The only reason they have not is that they are still holding a flash-loan position open across Aave and Balancer and the whole thing has to unwind inside one transaction. Our window is not two days. It is however long they take to be confident.",
        decision: {
          id: "ver-d03",
          scene:
            "Four hours. The timelock you were planning around does not apply. The Security Council can cancel a queued proposal but executeEmergency does not queue. The pause guardian can freeze the protocol, which stops the collateral module but also stops liquidations. And the DAO owns everything, including the bug.",
          clock: "T+04:05 — the attacker can execute at will",
          pressure:
            "This is the moment. Every option costs something real and there is no version where you get to be liked.",
          prompt:
            "The attacker holds a supermajority and a no-delay execution path. What do you do?",
          options: [
            {
              id: "ver-d03-a",
              label: "Pause the protocol via the guardian, accepting the liquidation freeze, and say exactly why in the same minute",
              detail:
                "Guardian pause on the collateral module and the treasury facet. Simultaneously publish: what was found, the decoded payload, the recomputed voting power, the executeEmergency gap, the fact that liquidations are frozen, the estimated bad-debt exposure per hour, and the exact conditions under which the pause lifts. Open a war room the community can watch.",
              score: 3,
              outcome:
                "The attack path closes within one block. You have also frozen a live lending market and started an unavoidable bad-debt clock, and you have told everyone that yourself rather than letting them discover it. The community is angry and informed, which is the good version of angry.",
              ripple:
                "Bad debt reaches 900,000 dollars over eleven hours and the DAO votes to cover it from treasury without much argument, because you published the exposure rate before anyone could accuse you of hiding it. The pause holds for nine hours until a governance patch raises votingDelay and removes executeEmergency. Beanstalk had no equivalent of this power in April 2022 and lost 182 million dollars in a single transaction.",
              isBest: true,
            },
            {
              id: "ver-d03-b",
              label: "Fight it with governance — rally delegates to vote no and out-vote the attacker",
              detail:
                "Mobilise the community, call every large delegate, get the votes. Use the system as designed.",
              score: -3,
              outcome:
                "Arithmetically impossible and you would burn the only hours you have discovering that. The attacker holds 68 percent of votable supply through borrowed capital that costs them nothing. There is no honest vote you can win.",
              ripple:
                "You spend six hours on calls. The attacker executes at hour five while a delegate is still explaining their voting policy. Treasury and collateral module drain together. The post-mortem records that the security lead knew the mechanism, knew the threshold, and chose a response that could not work because it was the one that required no hard decision.",
            },
            {
              id: "ver-d03-c",
              label: "Deploy a counter-proposal through executeEmergency using the DAO's own supermajority mechanism",
              detail:
                "Fight fire with fire. Assemble friendly voting power, use the same no-delay path to push through a patch that removes the vulnerable facet before they can act.",
              score: -2,
              outcome:
                "You cannot reach two-thirds because they hold 68 percent — the same arithmetic blocks you. Worse, attempting it publicly demonstrates to the attacker that you understand the mechanism and are racing them, which is the one piece of information that makes them execute immediately.",
              ripple:
                "The attacker executes eleven minutes after your counter-proposal appears on chain. Every account of this incident notes that the defenders triggered the timing. Governance mechanisms are not weapons; they are shared infrastructure, and using them adversarially in a race you cannot win only sets the clock.",
            },
            {
              id: "ver-d03-d",
              label: "Convene the Security Council to cancel — the cancel path is the designed safety valve",
              detail:
                "Five of nine council members sign a cancellation. It is the mechanism the DAO explicitly created for this.",
              score: -1,
              outcome:
                "The right instinct pointed at the wrong mechanism, and this is the whole trap. The Security Council's cancel authority operates on proposals queued in the TimelockController. executeEmergency does not queue. There is nothing to cancel. You would spend forty minutes assembling signatures for a transaction that reverts.",
              ripple:
                "The forty minutes are survivable here but the lesson is not: you did not know the precise scope of your own emergency powers until you needed them. Every break-glass control must be exercised against a realistic scenario before it is needed, or it is a comfort object rather than a control.",
            },
          ],
          debrief:
            "Two hard things collide here. The first is that emergency paths are the softest part of every governance system, because they are written under pressure after a scare, ratified with gratitude, and then never re-examined. Beanstalk's emergencyCommit allowed execution at a two-thirds supermajority with no delay, and the attacker acquired that supermajority with roughly a billion dollars of flash loans from Aave, Uniswap V2 and SushiSwap for the duration of a single transaction — voting and executing atomically. The second is that your break-glass powers have precise scopes, and the moment to learn those scopes is not the moment you reach for them. Option D fails not because cancellation is wrong but because the responder had a mental model of their own authority that did not match the code. Run the tabletop. Read the modifiers. Know which of your emergency powers apply to which execution path, in writing, before Saturday at four in the morning.",
          principle:
            "Every emergency power has an exact scope defined in code. If you have not read it recently, you do not have the power — you have a belief about it.",
        },
      },
      {
        id: "ver-i09",
        t: "T+04:40 — Sat 06:54 UTC",
        channel: "community",
        from: "0xLucid, delegate holding 4.1 percent of supply, in the forum",
        text:
          "So the core team pressed a button and froze 740 million dollars of other people's money based on their own analysis, with no vote. I want to be careful here because I think you probably found something real. But this is the exact power we were told would never be used unilaterally, and the fact that it worked this time is not an argument. Who watches this? What stops the next pause being about something you merely disagree with?",
      },
      {
        id: "ver-i10",
        t: "T+05:15 — Sat 07:29 UTC",
        channel: "legal",
        from: "Harriet Nwosu, counsel to the Verity Foundation",
        text:
          "Flagging a structural problem, not a legal opinion. Our regulatory posture across several jurisdictions rests on the argument that the protocol is not controlled by any identifiable person or group. You have just demonstrated, publicly and on chain, that nine named individuals can freeze the system and that a security lead can initiate it. That is a fact pattern regulators use to establish control. I am not telling you it was wrong. I am telling you it is now on the record and it will be cited, and you should decide deliberately how the DAO characterises it rather than letting the characterisation happen to you.",
        decision: {
          id: "ver-d04",
          scene:
            "Five hours in, the attack path is closed and the second-order problem has arrived. You have proven the protocol is controllable, which is exactly what its regulatory and cultural position depends on denying.",
          clock: "T+05:15",
          pressure:
            "The honest framing is the one that creates the most legal exposure, and the safe framing is the one that corrodes the community's trust.",
          prompt:
            "How does the DAO characterise what just happened?",
          options: [
            {
              id: "ver-d04-a",
              label: "Downplay it — describe the pause as an automated circuit breaker triggered by anomaly detection",
              detail:
                "Emphasise the systematic nature, minimise the human decision, protect the decentralisation narrative.",
              score: -3,
              outcome:
                "It is a lie, it is checkable on chain within minutes because the pause transaction has a signer, and it will be checked.",
              ripple:
                "A researcher posts the transaction and the signing address the same afternoon. You now have a governance credibility crisis on top of a governance attack, and the regulatory exposure is worse than if you had said nothing, because a misleading public characterisation of who controls a system is a materially different kind of problem from control itself.",
            },
            {
              id: "ver-d04-b",
              label: "Describe it precisely, publish the full decision record, and immediately open a binding vote to ratify or reverse",
              detail:
                "State that a named human exercised a power the DAO voted to grant, under conditions the DAO defined, and publish the timeline, the evidence, the reasoning and the alternatives rejected. Put a 24-hour binding vote on chain: ratify the pause and the remediation plan, or reverse it and unpause immediately. Commit to the outcome either way.",
              score: 3,
              outcome:
                "You have converted an act of unilateral authority into an act of accountable authority by submitting it for judgement within hours. The distinction between a guardian and a captor is entirely whether the power is answerable, and you have made it answerable at the fastest cadence the system permits.",
              ripple:
                "Ratification passes with 91 percent. Because the record is complete and the vote was real, counsel can characterise the guardian as a delegated, revocable, ratified emergency function rather than as unilateral control — a genuinely stronger position than silence. 0xLucid votes yes and co-authors the constraint proposal that follows.",
              isBest: true,
            },
            {
              id: "ver-d04-c",
              label: "Say nothing about governance philosophy and keep the focus on the technical attack",
              detail:
                "Do not litigate decentralisation during an incident. Ship the fix, discuss the politics later.",
              score: -1,
              outcome:
                "Understandable and it cedes the question. The philosophical argument happens whether you participate or not, and by the time you engage on Monday, the framing has been set by whoever cared most on Saturday.",
              ripple:
                "A well-organised faction spends the weekend building the case that the core team is a de facto board. Their proposal to strip the guardian role reaches a vote in three weeks and comes within four percent of passing. You are left with the power intact and no mandate to use it, which is the worst of both worlds.",
            },
            {
              id: "ver-d04-d",
              label: "Pre-emptively dissolve the Security Council to prove the DAO is not controlled",
              detail:
                "Remove the fact pattern. Demonstrate irreversible decentralisation by giving up the power.",
              score: -2,
              outcome:
                "You would remove the only functioning defence during an active incident, as a gesture, to influence an argument.",
              ripple:
                "The attacker still holds a supermajority position they can reconstitute. With no guardian and no council, the second attempt at T+9 days has no defender. Ideology is not a control, and giving up a capability to win a debate is the most expensive way anyone has ever won a debate.",
            },
          ],
          debrief:
            "This is the politically expensive correct answer in this module, and it is expensive in an unusual currency: it converts an ambiguous fact into an admitted one. Counsel is right that the pause creates a control fact pattern. What counsel may not immediately see is that the alternative — an unexplained or minimised intervention — creates the same fact pattern plus a credibility problem. The move that improves both the legal and the community position is the same move: make the power visibly accountable and put it to a real vote fast enough that ratification is meaningful. A guardian who submits to judgement within hours is describable as a delegated emergency function. A guardian who acts and then goes quiet is describable as a controller. The code is identical; the record is not.",
          principle:
            "Emergency power is legitimate only in proportion to how fast it is submitted for judgement. Ratify within hours or you have not used authority, you have taken it.",
        },
      },
      {
        id: "ver-i11",
        t: "T+06:30 — Sat 08:44 UTC",
        channel: "chain",
        from: "Yannick Fournier, chain analyst, contributor",
        text:
          "Attacker behaviour update. They have unwound the flash-loan position and repaid Aave and Balancer. Cost to them so far is gas plus about 41,000 dollars in flash-loan fees. Their veVRT lock has expired back to zero, so their voting power is currently nothing. They can reconstitute it in a single block whenever they choose. The paused state does not prevent them from acquiring voting power again, only from executing the payload. They are almost certainly reading this forum.",
      },
      {
        id: "ver-i12",
        t: "T+07:10 — Sat 09:24 UTC",
        channel: "exec",
        from: "Sonia Marchetti, contributor council coordinator",
        text:
          "Three proposals from contributors in the last twenty minutes. One: post an on-chain message offering the attacker a ten percent white-hat bounty to walk away. Two: emergency governance patch pushed in the next thirty minutes to raise votingDelay and kill executeEmergency. Three: ship the patch through the normal three-day process with the protocol paused throughout. People are pushing hard for option two. What do we do?",
        decision: {
          id: "ver-d05",
          scene:
            "Seven hours. The protocol is paused and safe but frozen, users are unable to manage positions, and every hour of pause has a cost. There is enormous pressure to fix the governance defect fast — and the fix is itself a governance change that has to go through governance.",
          clock: "T+07:10",
          pressure:
            "The fast fix requires using the very emergency mechanism you are trying to remove, written in half an hour, unaudited, touching the code that controls everything.",
          prompt:
            "How do you ship the governance fix?",
          options: [
            {
              id: "ver-d05-a",
              label: "Emergency patch in thirty minutes — remove executeEmergency and raise votingDelay immediately",
              detail:
                "Close the hole now. Speed is safety while the attacker can reconstitute voting power at will.",
              score: -2,
              outcome:
                "An unaudited change to the governance contracts, written under duress at nine in the morning after a sleepless night, executed through the very mechanism you have just proven is exploitable. The protocol stays paused regardless, so the patch buys no user relief.",
              ripple:
                "The patch contains an off-by-one in the votingDelay units — blocks versus seconds — that sets the delay to roughly twelve seconds instead of two days. Nobody catches it for nine days because everyone is exhausted and it deployed during an emergency. The hole you closed reopens in a shape nobody is looking for.",
            },
            {
              id: "ver-d05-b",
              label: "Keep the pause, ship the patch through the full process with two independent reviews, and publish an hourly status",
              detail:
                "Protocol stays paused. The governance patch gets written, two independent reviewers who have not been awake for nine hours read it, it goes through the normal proposal flow with the timelock intact. Publish the bad-debt exposure hourly and the unpause criteria explicitly. Bring in rested people and send the responders to sleep in shifts.",
              score: 3,
              outcome:
                "Slower and correct. The pause is doing the job the patch would do, so the patch does not need to be fast — it needs to be right, because it modifies the mechanism that controls the entire protocol. Rotating in rested reviewers catches two real issues in the draft.",
              ripple:
                "The patch ships at T+62:00, correct, with the votingDelay set to a snapshot-based checkpoint model rather than live balance reads. The unpause happens at T+68:00. Total bad debt is 1.4 million dollars, covered by treasury. The attacker's reconstituted position at T+9 days finds a snapshot they cannot reach and nothing happens at all.",
              isBest: true,
            },
            {
              id: "ver-d05-c",
              label: "Open negotiations with a ten percent white-hat bounty offer on chain",
              detail:
                "Buy certainty. Ten percent of nothing-yet-taken is cheap compared to 118 million dollars.",
              score: -1,
              outcome:
                "You are offering a percentage of funds they have not taken and currently cannot take. The pause has already removed their leverage. Offering a bounty from a defended position signals that you believe you are still exposed.",
              ripple:
                "The attacker does not reply and the offer sits on chain permanently as evidence that Verity pays. Three copycat governance probes arrive over the following four months, each testing whether a threat converts into a payment. You have advertised a price for pressure.",
            },
            {
              id: "ver-d05-d",
              label: "Unpause with the vulnerable facet disabled and patch governance afterwards at leisure",
              detail:
                "Restore user functionality now by disabling only the specific drain path, then fix governance properly over the following weeks.",
              score: 0,
              outcome:
                "Tempting because it relieves the most acute user pain, and it addresses the payload rather than the mechanism. The attacker's capability was never the specific facet; it was the ability to install arbitrary facets through a supermajority with no delay. You have removed one door from a building where they can still add doors.",
              ripple:
                "At T+31 hours a second proposal appears with a different payload and the same structure. You pause again. The second pause costs far more credibility than the first, because the community was told the problem was fixed. Treating the payload as the vulnerability instead of the mechanism buys one cycle and spends two.",
            },
          ],
          debrief:
            "This is the slow-down decision. The critical reframe is that the pause is already providing the protection the patch would provide, which means the patch has no legitimate reason to be fast. Under adrenaline that reasoning is genuinely hard to hold, because a paused protocol feels like an emergency and emergencies feel like they demand speed everywhere. Discipline: identify which control is currently holding the line, and let everything that control protects proceed at the pace correctness requires. The second lesson is the difference between patching the payload and patching the mechanism. The vulnerability was never the drain facet. It was live-balance voting power with a one-block delay plus a no-delay supermajority execution path. The correct fix is checkpointed voting power sampled at proposal creation — the pattern OpenZeppelin's Governor implements, where a meaningful votingDelay means borrowed tokens cannot vote because the snapshot precedes the loan.",
          principle:
            "When a control is holding, everything it protects moves at the speed of correctness. Speed is only a safety property while nothing is holding the line.",
        },
      },
      {
        id: "ver-i13",
        t: "T+09:45 — Sat 11:59 UTC",
        channel: "community",
        from: "Verity forum — 2,100 replies in the governance thread",
        text:
          "The thread has split into three camps. One wants the guardian role abolished. One wants the guardian role expanded with a standing mandate. One wants the entire vote-escrow model replaced. A widely-shared post claims the core team knew about the votingDelay refactor eleven months ago and ignored it. The claim is false — the refactor was reviewed by a contributor who has since left and there is no record of anyone raising it — but the screenshot circulating is a real commit with a real date and it looks damning without context.",
      },
      {
        id: "ver-i14",
        t: "T+11:20 — Sat 13:34 UTC",
        channel: "regulator",
        from: "Harriet Nwosu, counsel, relaying an inbound",
        text:
          "A major centralised exchange has asked whether VRT should remain listed given what they describe as an unresolved governance control issue. They want a written response by Monday. Separately, a market maker has widened VRT spreads to eleven percent and the token is down 34 percent. Neither of these is a security decision but both are downstream of yours, and how you describe the state of the protocol in that written response will be read by more than one audience.",
        decision: {
          id: "ver-d06",
          scene:
            "Eleven hours. The technical situation is stable. The narrative situation is not, and a false claim about an eleven-month-old commit is doing more damage than the attack did.",
          clock: "T+11:20 — written response due Monday",
          pressure:
            "Correcting the false claim requires publishing an unflattering true story about how the refactor was reviewed.",
          prompt:
            "How do you address the false claim that the team knew about the votingDelay defect for eleven months?",
          options: [
            {
              id: "ver-d06-a",
              label: "Publish the full commit history, the review record, and an honest account of why nobody caught it",
              detail:
                "Show the commit, the reviewer, the review comments, the date of departure, and state plainly: the change was reviewed by one person, governance parameter changes were not on any security review checklist, and no gate existed that would have caught it. Publish the checklist you are adding as a direct result.",
              score: 3,
              outcome:
                "You replace an accusation of concealment with an admission of a process gap, which is both true and much less damaging. The narrative shifts from they knew to they had no gate, and the second story comes with a visible fix attached.",
              ripple:
                "The exchange's Monday response cites your transparency and the listing holds. The single-reviewer gap on governance parameter changes becomes a mandatory two-reviewer rule with a named checklist, and that checklist catches a real issue four months later. The most durable outcome of the entire incident is a boring process change nobody would have funded on a quiet Tuesday.",
              isBest: true,
            },
            {
              id: "ver-d06-b",
              label: "Issue a short denial and move on",
              detail:
                "State that the claim is false and that the team had no knowledge of the defect. Do not amplify it with detail.",
              score: -2,
              outcome:
                "A denial without a record is indistinguishable from a denial with something to hide, and the screenshot is real. Every reply to your denial reposts the commit.",
              ripple:
                "The claim hardens into accepted history. It appears in a research write-up six weeks later as though it were established, and it is the version most people will remember. Unrebutted specifics beat unsupported generalities every time.",
            },
            {
              id: "ver-d06-c",
              label: "Ignore it and focus on the technical recovery",
              detail:
                "Do not feed the discourse. The work speaks for itself.",
              score: -1,
              outcome:
                "The work does not speak for itself. It never has. Meanwhile the exchange is drafting its listing decision from public sources, and the loudest public source is a false claim of concealment.",
              ripple:
                "The exchange moves VRT to a monitoring tag citing governance and disclosure concerns. Removing that tag takes five months and a formal review. Silence during an active narrative is a decision to let someone else write the record.",
            },
            {
              id: "ver-d06-d",
              label: "Name the departed contributor as the reviewer who missed it",
              detail:
                "Be specific about accountability. The record shows who reviewed the commit.",
              score: -3,
              outcome:
                "You would attribute a systemic control failure to one absent individual who cannot respond. It is also analytically false — a single reviewer on a governance parameter change is a process defect, not a personal one.",
              ripple:
                "The named person's professional reputation is damaged over something that was structurally guaranteed to happen to whoever held the pen. Every current contributor updates on what happens to people who leave, and your ability to recruit senior contributors drops measurably for the next year.",
            },
          ],
          debrief:
            "Two things worth carrying. First, a false accusation of concealment is almost always better answered with an unflattering true story than with a denial, because the true story is checkable and the denial is not. Second, notice what the true story actually is: a governance parameter change went through a single reviewer because no checklist said governance parameters were security-relevant. That is the real root cause, and it is one layer beneath the flash loan and two beneath the payload. The votingDelay was set to one block during a gas optimisation refactor by someone doing good work with no reason to think that parameter mattered. Root cause analysis that stops at the exploit stops one layer too early nearly every time.",
          principle:
            "Answer an accusation of concealment with the unflattering true record. Denials are unfalsifiable and unfalsifiable is indistinguishable from false.",
        },
      },
      {
        id: "ver-i15",
        t: "T+62:00 — Mon 16:14 UTC",
        channel: "chain",
        from: "Tomas Wieck, protocol engineer",
        text:
          "Patch is live after two independent reviews and a testnet rehearsal. Voting power now reads from checkpointed balances sampled at proposal creation, votingDelay is set to 7,200 blocks, executeEmergency is removed entirely and replaced with a Security Council fast-track that still carries a six-hour minimum delay and requires public rationale. Unpause criteria are met. Total bad debt from the liquidation freeze is 1.4 million dollars.",
      },
      {
        id: "ver-i16",
        t: "T+9 days",
        channel: "chain",
        from: "Governance Watch (automated) — proposal monitor",
        text:
          "New proposal from a fresh address with 71 percent of votable supply acquired in a single block. Payload structure matches VIP-47. Voting power at the proposal creation snapshot: zero. The proposal cannot reach quorum and cannot be voted on by the proposer. No action required. Logging for the record.",
        decision: {
          id: "ver-d07",
          scene:
            "Nine days later, the same attacker runs the same play against the patched system and it does nothing at all. The DAO is now voting on the permanent shape of its emergency powers, and you have one post to write.",
          clock: "T+9 days — governance vote opens in 48 hours",
          pressure:
            "You have been vindicated, which is the most dangerous moment for judgement in the entire incident.",
          prompt:
            "The DAO is deciding the future of the guardian role and the Security Council. What do you propose?",
          options: [
            {
              id: "ver-d07-a",
              label: "Propose expanding the guardian mandate — the pause worked and saved 118 million dollars",
              detail:
                "The evidence is unambiguous. Give the security function standing authority to pause without assembling a council.",
              score: -2,
              outcome:
                "You are using a win to acquire power, at the exact moment the community is most inclined to grant it and least inclined to think clearly about it. The pause worked here; it also caused 1.4 million dollars of bad debt and froze other people's money for 68 hours.",
              ripple:
                "It passes on the strength of your credibility. Fourteen months later a different security lead pauses over an issue that turns out to be a false positive, with no council check, and the cost of that pause exceeds the value of this one. Powers granted in gratitude are exercised in ordinary time by ordinary people.",
            },
            {
              id: "ver-d07-b",
              label: "Propose constraining the guardian — narrow scope, hard expiry, mandatory ratification vote, and a public exercise requirement",
              detail:
                "Pause authority limited to specific named modules, auto-expiring after 24 hours unless ratified by vote, a mandatory published decision record within two hours of use, an annual public tabletop where the council exercises the power against a scripted scenario, and a standing seat for a delegate who did not endorse the last use of it.",
              score: 3,
              outcome:
                "You give power away from the strongest possible position, which is the only position from which giving it away is credible. The auto-expiry converts the guardian from a control into a tripwire that forces a vote, and the exercise requirement addresses the failure you actually experienced — nobody knew the precise scope of the cancel authority until the moment it did not apply.",
              ripple:
                "It passes with 96 percent including every faction that wanted the role abolished. 0xLucid takes the dissenting seat. Two years later the constrained guardian is used again, cleanly, by someone who has rehearsed it, and nobody questions its legitimacy because the constraints were designed by the person who had every reason to want them loose.",
              isBest: true,
            },
            {
              id: "ver-d07-c",
              label: "Stay neutral and let the DAO decide without a recommendation from security",
              detail:
                "It is a governance question about your own power. Recusal is the principled position.",
              score: 0,
              outcome:
                "Superficially principled and it withholds the one input only you can provide: what actually failed, what the pause cost, and which constraints would have made the response better rather than merely more limited.",
              ripple:
                "The DAO adopts a constraint written by people without operational experience: a hard 90-minute pause cap. The next real incident needs four hours and the pause lapses mid-response. Neutrality on the design of your own controls is not humility, it is abdication of the expertise you were elected for.",
            },
            {
              id: "ver-d07-d",
              label: "Propose replacing human guardians entirely with automated circuit breakers on anomaly thresholds",
              detail:
                "Remove the control fact pattern and the human politics in one move. Let code defend code.",
              score: -1,
              outcome:
                "Attractive and it would not have caught this. No threshold on value flow, utilisation, or price would have fired — VIP-47 moved nothing at execution time. It installed a facet. The signal was semantic, and it took a human reading decompiled bytecode at four in the morning.",
              ripple:
                "Automated breakers ship and are genuinely useful against economic exploits. Eleven months later a governance-shaped attack passes straight through them because it, too, moves no value at execution. The DAO has to reconstitute a human guardian in a hurry, without the constraints you could have designed at leisure.",
            },
          ],
          debrief:
            "The moment after you are proven right is when your judgement is worst and your influence is highest, which is a dangerous combination. Every instinct says consolidate. The operator who lasts twenty years does the opposite: uses the peak of their credibility to install the constraints that will bind their successors and their tired future self. Note the specific constraint that matters most — the mandatory annual exercise. The sharpest failure in this whole scenario was not the flash loan or the payload; it was a responder reaching for a cancel authority that did not apply to the execution path in play. Powers that are never exercised decay into beliefs. And note the second design point: auto-expiry. A pause that expires unless ratified converts an act of unilateral authority into a forced conversation, which is precisely the property that makes emergency power survivable in a public system.",
          principle:
            "Give power away from strength. Constraints you design at your most credible are the only ones that will still be there when you are not.",
        },
      },
    ],
    scoring: [
      {
        dimension: "Governance integrity",
        weight: 0.25,
        note:
          "Was the root mechanism fixed rather than the observed payload? Full credit requires checkpointed voting power sampled at proposal creation, a non-trivial votingDelay, and removal or hard-delaying of any no-delay supermajority path. Disabling the specific drain facet and declaring victory scores near zero, because the attacker's capability was facet installation, not that particular facet.",
      },
      {
        dimension: "Blast-radius reduction under uncertainty",
        weight: 0.2,
        note:
          "Judged on both over- and under-reaction. Pausing at minute forty over an unanalysed call is scored as harshly as failing to pause at hour four with a proven payload and a supermajority in hand. The metric is whether the disruptive power was spent on the actual threat at the moment it was actually live, and whether the liquidation-freeze cost was named publicly before anyone else could name it.",
      },
      {
        dimension: "Public communication accuracy",
        weight: 0.2,
        note:
          "Every public statement is checked for whether the analysis behind it existed at the time. Reproducible artefacts — decompiled bytecode, fork traces, commit history — score far above assertions. Correcting a respected external voice with evidence scores high; correcting them with authority, or using a commercial relationship to influence a public technical opinion, scores negative regardless of being right.",
      },
      {
        dimension: "Legitimacy preservation",
        weight: 0.2,
        note:
          "Emergency authority is scored on how fast it was submitted for judgement, not on whether it was correct. A pause plus a full decision record plus a binding ratification vote inside hours scores maximum. A correct pause followed by silence, minimisation, or a false characterisation of the actor scores negative — the code is identical, the record is what determines whether the DAO survives its own defence.",
      },
      {
        dimension: "Responder sustainability",
        weight: 0.15,
        note:
          "Were rested reviewers rotated in before the governance patch was written? Was any contract change authored and shipped by someone who had been awake for more than sixteen hours? Was anyone named publicly for a systemic failure? An incident that ends with a correct fix and a burned-out or blamed contributor team scores worse than one that takes twelve more hours and keeps its people.",
      },
    ],
    debrief: [
      {
        title: "Governance is an attack surface with a market price",
        body:
          "The uncomfortable insight of on-chain governance is that voting power is purchasable and, if the mechanism permits it, rentable by the block. On 17 April 2022 the Beanstalk attacker borrowed on the order of a billion dollars across Aave, Uniswap V2 and SushiSwap, converted it into deposited liquidity, acquired a two-thirds supermajority, and called emergencyCommit to execute a proposal they had submitted a day earlier — all inside a single transaction, with the loans repaid before the transaction ended. Roughly 182 million dollars left the protocol; about 77 million in non-Bean assets was actually realised by the attacker. The lesson is not that flash loans are dangerous. It is that any governance system which reads voting power at the moment of the vote has priced its treasury at the cost of a flash loan fee. Verity's attacker spent about 41,000 dollars in fees to threaten 118 million. When you design or review a governance system, compute that ratio explicitly and put it in the threat model.",
      },
      {
        title: "Snapshot semantics: the single parameter that decides everything",
        body:
          "The defence is unglamorous and completely effective. Voting power must be read from a historical checkpoint taken at or before proposal creation, not from a live balance at the moment of voting. OpenZeppelin's Governor implements this directly: votingDelay establishes a gap between proposal creation and the start of voting, and voting power is retrieved from a snapshot at that point. Borrowed tokens cannot vote because the snapshot precedes the loan, and a flash loan cannot span the delay because it must be repaid inside one transaction. Verity's defect was that votingDelay had been reduced to one block during an unrelated gas optimisation, by a contributor doing careful work who had no reason to think that parameter was security-critical. This is the most transferable finding in the module: the parameter that determines whether your treasury is stealable does not look like a security parameter, and it will be changed by someone competent for a good reason unless a checklist makes it security-relevant. Governance parameters belong on the same change-control footing as key material.",
      },
      {
        title: "Emergency paths are the softest part of every system you will ever inherit",
        body:
          "Look at how executeEmergency came to exist. There was a scare, the community felt the pain of a delay, someone proposed a fast path, it was ratified with gratitude, it was used twice legitimately and celebrated both times, and then it was never examined again. That is the life cycle of nearly every break-glass control in every organisation — emergency change approval in enterprise IT, glass-break admin accounts, the manual override on a payment gateway, the exception path in a code freeze. They accumulate legitimacy through successful use and lose scrutiny through familiarity. Two habits: inventory every path in your system that bypasses a normal control, with its exact trigger condition and its exact scope, and re-review that inventory on a fixed schedule with fresh eyes. The Beanstalk emergencyCommit function was not hidden. It was documented, voted in, and understood. It was simply never re-examined against an adversary who could rent a supermajority.",
      },
      {
        title: "The timelock is not protection. It is a decision window.",
        body:
          "Practitioners routinely describe a timelock as though delay itself were a control. It is not. A 48-hour timelock provides exactly two things: time for users to exit, and time for someone with cancellation authority to act. If nobody is monitoring, or if the person monitoring lacks authority, or if the execution path in play does not queue, the timelock provides nothing at all. Verity's responders spent four hours planning around a 48-hour window that did not exist for the path the attacker held. Radiant Capital's post-mortem made the same point from the other direction: their attack involved compromised signer devices, and they stated plainly that timelocks would not have prevented it. So when you specify a timelock, specify the whole system: the delay, the monitoring that detects a queued malicious action, the authority that can cancel, the humans who hold that authority, their availability at 4am on a Saturday, and the exact set of execution paths the cancellation covers. A delay without a watcher is a countdown, not a defence.",
      },
      {
        title: "Credible neutrality versus safety, and how to hold both",
        body:
          "0xLucid's objection is not bad faith and should not be answered as though it were. A system where nine named people can freeze 740 million dollars of other people's money is a system with a control point, and control points get captured, subpoenaed, and pressured. Counsel's concern is also real: demonstrated control is a fact pattern regulators use. What resolves the tension is not choosing a side but changing the property under examination. Unaccountable power and accountable power look identical in the code and completely different in the record. The moves that hold both: publish the decision record within hours, put the action to a binding ratification vote at the fastest cadence the system permits, build auto-expiry into the power so inaction reverses it, seat a dissenter on the body that holds it, and rehearse it publicly on a schedule. None of these reduce the technical capability. All of them change what the capability is.",
      },
      {
        title: "Operating in public with the adversary in the room",
        body:
          "Every channel in this scenario was readable by the attacker in real time, which inverts several instincts from enterprise response. You cannot coordinate quietly in the primary channel. Announcing what you have found tells the adversary their window is closing, and in a race they can win, that announcement sets the clock — which is why the counter-proposal option is scored so badly. Conversely, silence is not neutral: a community that is not told what is happening will construct the worst available explanation within minutes, and a false narrative about the defenders can do more durable damage than the attack. The workable posture is a split cadence. Analysis, council assembly and prepared transactions happen in private and are never previewed. Findings, decisions already taken, costs already incurred, and the criteria for what happens next are published immediately and completely. What you are hiding is intent and timing. What you are publishing is fact and reasoning. Get that boundary wrong in either direction and you lose.",
      },
      {
        title: "The transferable pattern: break-glass is where your security actually lives",
        body:
          "Strip the tokens away and this module is about emergency authority in any organisation. Every system you will ever run has a path that bypasses the normal path, created after a painful incident, justified by an argument you would have agreed with. That path is where an adversary will go, because it was designed under time pressure, it is exercised rarely, and its scope is understood by fewer people than believe they understand it. Three concrete practices. Maintain a written inventory of every bypass path with its trigger, its scope, and who holds it — and re-derive that scope from the code, not from documentation. Exercise each one at least annually against a scripted scenario, because the failure in this simulation was a responder confidently reaching for an authority that did not apply. And design the constraints on your own emergency powers at the moment you are most trusted, because that is the only moment the constraints will be believed, and because the person who eventually misuses that power will probably not be an attacker — it will be a tired, well-meaning successor at four in the morning who was never taught what the button actually does.",
      },
    ],
    awards: [
      "strong-governance-capture-defender",
      "safe-timelock-window-operator",
      "strong-snapshot-discipline",
      "safe-accountable-emergency-power",
      "strong-public-channel-composure",
    ],
  },

  /* ============================================================
     MODULE C — the people who answer the phone
     ============================================================ */
  {
    id: "sim-bellwether-insider-extortion",
    title: "Bought, Not Breached",
    org: "Bellwether Digital, Inc. (Nasdaq: BWDX)",
    sector: "US-listed retail and institutional crypto exchange and qualified custodian",
    chapterId: "ch-incident",
    essence: "gold",
    difficulty: 5,
    minutes: 85,
    respect: 1380,
    trust: 66,
    mode: "both",
    brief:
      "Bellwether Digital is a Nasdaq-listed exchange and custodian: 4,100 employees, 12.4 million monthly transacting users, 210 billion dollars of platform assets. Customer support is 2,900 agents across three outsourced providers — a large BPO in Manila, a second in Bengaluru, and a smaller specialist firm in Bogotá — all working in Bellwether's internal console, HELM. HELM has three access tiers. Tier 1 sees ticket text and masked personal data. Tier 2 sees unmasked name, address, phone, email, the last four digits of a social security number, masked bank details, government ID images uploaded during onboarding, current balances and transaction history. Tier 3 can take account actions and requires dual control. Tier 2 is 1,840 people, and it is where the value is. The data platform is Snowflake on AWS; agents reach an operational reporting console for bulk lookups when a ticket needs history, and that console's queries are logged but have never been alerted on. Regulatory surface: SEC registrant, NYDFS BitLicense and Part 500, money transmitter licences in 48 states, FinCEN MSB registration, and a GDPR-scoped Irish subsidiary. The board has nine seats; the audit committee is chaired by a former PCAOB inspector who reads the appendices. You are Bellwether's CISO, reporting to the President with a dotted line to the audit committee. It is Tuesday, 07:12 Eastern.",
    objective:
      "Establish the true scope of an insider data theft before you are forced to publish a number, and do it without tipping the ring or destroying the evidence. Make the disclosure decisions — SEC, NYDFS, GDPR, state regulators, customers — on the legal clock rather than the news clock, and make them accurate the first time. Reduce the harm that this data will actually cause, which is not fraud on Bellwether's platform but high-conviction voice phishing against 12 million people who now believe a caller who knows their balance. Refuse the extortion in a way that does not invite the next one. And leave behind an access architecture where bulk read of customer PII is a dual-controlled, attested, alerted event rather than an ordinary Tuesday.",
    roles: ["u-keeper", "u-lantern", "u-compass", "u-signal", "u-anchor", "u-oracle"],
    injects: [
      {
        id: "bwd-i01",
        t: "T+00:00 — Tue 07:12 ET",
        channel: "legal",
        from: "Delphine Cortez, General Counsel",
        text:
          "An email arrived overnight at my address, the CEO's public address, and the investor relations inbox. It demands 20 million dollars in bitcoin within 96 hours. Attached is a CSV of 4,000 records: full names, home addresses, phone numbers, emails, last four of SSN, masked bank account numbers, account balances to the cent, and links to what appear to be government ID images. The email says they have far more and that they obtained it from inside. I have not replied. I need to know within the hour whether this data is real and where it came from.",
      },
      {
        id: "bwd-i02",
        t: "T+00:18 — Tue 07:30 ET",
        channel: "pager",
        from: "Ravi Chandrasekhar, Detection Engineering",
        text:
          "I can validate the sample. Question is how. I can run the 4,000 identifiers against the production customer database, which is fast and touches production during market hours. Or I can validate against yesterday's warehouse snapshot, which is slower and cannot confirm the balance figures are current. What do you want, and do you want me to instrument HELM before or after?",
        decision: {
          id: "bwd-d01",
          scene:
            "Eighteen minutes. You have a sample that may be a bluff, a scrape of a third-party breach, or exactly what it claims to be. Every action you take from here is either evidence or noise, and if the source is a live insider, they can see some of what you do.",
          clock: "T+00:18",
          pressure:
            "The GC wants an answer in an hour. The right answer takes longer than an hour to be sure of, and the wrong first move burns the case.",
          prompt:
            "Your first instruction. Choose for evidentiary value and for not tipping the source.",
          options: [
            {
              id: "bwd-d01-a",
              label: "Validate against the offline warehouse snapshot, and simultaneously begin silent full logging of HELM and the reporting console",
              detail:
                "Match identifiers against a read-only historical snapshot in an isolated environment. In parallel, enable full query-level capture on HELM and the Snowflake reporting console, retained to a location the support organisation cannot see, and preserve the last 24 months of existing query logs before any retention policy expires them. Tell nobody in support or at the BPOs.",
              score: 3,
              outcome:
                "Within forty minutes you can tell the GC that 3,970 of 4,000 records match live customers and the field combination is only obtainable from Tier 2 HELM or the reporting console. You have also started capturing the ring's ongoing activity, which is the evidence that will eventually name individuals.",
              ripple:
                "The preserved query logs are the single most important artefact in the incident. At T+9 days they establish that agents used the reporting console rather than the ticket console, which is what moves the affected population from 12,000 to 71,400. Without that preservation the retention window would have expired 30-day-old queries mid-investigation and you would have published the wrong number.",
              isBest: true,
            },
            {
              id: "bwd-d01-b",
              label: "Run the identifiers against production immediately — speed matters more than elegance",
              detail:
                "Fastest possible confirmation. The GC needs an answer and production is authoritative.",
              score: 0,
              outcome:
                "You get an answer in nine minutes and it is correct. You also generate an unusual bulk query pattern from a security account against production during market hours, which is visible to a platform engineering team that includes contractors, and you have started no logging on the thing that matters.",
              ripple:
                "A platform engineer mentions the odd query volume in a shared channel at T+02:00. The question spreads. By T+06:00 a support team lead at the Manila BPO has heard that security is looking at customer data, and two agents stop querying entirely. Their behaviour change is itself evidence, but you have lost the window in which the ring would have kept working in front of your new logging.",
            },
            {
              id: "bwd-d01-c",
              label: "Do not validate at all — assume it is real and move straight to containment",
              detail:
                "Treat the sample as genuine, revoke broadly, and act. Validation is a luxury.",
              score: -2,
              outcome:
                "You skip the step that tells you which system the data came from, which is the step that determines everything downstream: which population is affected, which regulator is engaged, and whether this is an insider matter or a vendor breach.",
              ripple:
                "Containment is aimed at the wrong layer for the first six hours because nobody established the field combination fingerprint. You revoke VPN access at two BPOs on a theory that turns out to be wrong while the reporting console stays wide open. The ring queries 11,000 more records during those six hours.",
            },
            {
              id: "bwd-d01-d",
              label: "Send the sample to the BPO security teams and ask them to check their own logs",
              detail:
                "They own the agents and the endpoints. Fastest path to the source is to ask the people closest to it.",
              score: -3,
              outcome:
                "You have just notified three organisations — one of which employs the people who did this — that you have a sample and are hunting for a source.",
              ripple:
                "At the Manila BPO, a team lead who is part of the ring learns within two hours. Two agent accounts are voluntarily deactivated by the vendor as a courtesy before any preservation order exists, taking their local artefacts with them. When you eventually need to establish which specific agents queried which specific records, two of the five are unreconstructible, and the vendor's cooperation from that point forward is shaped by their own legal exposure rather than by yours.",
            },
          ],
          debrief:
            "The tempo instinct is wrong here in a specific way. In a live-attacker network intrusion, speed of containment dominates. In an insider data theft where the data is already copied, the theft has already happened and speed buys you almost nothing — while tipping the source costs you the ability to ever establish scope. What you are racing is not the adversary; it is your own log retention. Notice that the winning option's most valuable component is preserving existing query logs before retention expires them. That is the least dramatic action available and it determines whether the number you eventually publish to the SEC is right. Also note the field-combination fingerprint: knowing that this exact set of fields can only be assembled from two specific consoles is what converts a sample into a lead.",
          principle:
            "When the data is already gone, you are not racing the adversary. You are racing your own log retention, and quietly.",
        },
      },
      {
        id: "bwd-i03",
        t: "T+01:40 — Tue 08:52 ET",
        channel: "pager",
        from: "Ravi Chandrasekhar, Detection Engineering",
        text:
          "3,970 of 4,000 match live customers. The other 30 are closed accounts, which fits — the source is internal, not a scrape. Field combination is only assemblable from Tier 2 HELM or the operational reporting console. First anomaly pass on HELM ticket lookups: 34 agents across two BPOs are in the top percentile for lookups-per-resolved-ticket, going back at least five months. Twelve of them are more than four standard deviations out. This did not start last week.",
      },
      {
        id: "bwd-i04",
        t: "T+02:15 — Tue 09:27 ET",
        channel: "exec",
        from: "Warren Okafor, VP Customer Operations",
        text:
          "I have heard we may have an access problem at the BPOs. I want to be helpful and I also want to be honest about what a broad revocation does. Tier 2 is 1,840 agents. If you cut them, average handle time goes from four minutes to indefinite, we abandon roughly 40,000 calls a day, and a meaningful number of those are customers who are actively being defrauded right now and need us to freeze their account. Whatever you do, please do not do it at nine in the morning on a Tuesday without telling me the shape of it.",
        decision: {
          id: "bwd-d02",
          scene:
            "Two hours fifteen. You have 34 anomalous agents out of 1,840, five months of history, and no way yet to distinguish a criminal from a diligent agent who works complex cases. Every hour of delay is more records taken. Every hour of over-revocation is real customers unable to stop real fraud.",
          clock: "T+02:15",
          pressure:
            "The security-maximal action harms customers directly and measurably, today.",
          prompt:
            "Access. What do you cut, and when?",
          options: [
            {
              id: "bwd-d02-a",
              label: "Revoke Tier 2 for all 1,840 agents immediately",
              detail:
                "You cannot distinguish the ring from the rest. Cut everything, restore individually after review.",
              score: -2,
              outcome:
                "You stop the theft and you break support for 12.4 million people during business hours with no notice. Abandoned calls spike, and among them are customers trying to freeze accounts during active takeover attempts.",
              ripple:
                "Two customers lose funds to unrelated fraud during the 31-hour support degradation because they could not reach anyone to freeze their accounts. Both are documented in complaints to state regulators. Your remediation is now itself a source of customer harm and appears in the regulatory file next to the incident. The lesson lands hard: a control that harms more than the threat it prevents is not a control.",
            },
            {
              id: "bwd-d02-b",
              label: "Cut nothing yet — keep watching to build the case before acting",
              detail:
                "You have new logging. Let it run for a week and gather unambiguous evidence on each individual.",
              score: -3,
              outcome:
                "You would be knowingly permitting continued theft of customer PII in order to improve an evidentiary position. Every record taken from this moment forward is one you chose to allow.",
              ripple:
                "The case is beautiful and the plaintiff's bar is delighted. Approximately 6,000 additional customer records are exfiltrated during your observation window and the internal decision record showing you chose to watch becomes the centrepiece of the class action. Surveillance is not containment, and there is no version of this where allowing ongoing harm to build a case survives contact with a regulator.",
            },
            {
              id: "bwd-d02-c",
              label: "Kill the bulk path for everyone today, restrict the 34 quietly, leave normal ticket support running",
              detail:
                "Immediately remove operational reporting console access from every agent at every tier — that path serves bulk lookups and almost no legitimate ticket needs it. Simultaneously and silently apply a per-agent rate limit and a Tier 3 approval requirement on unmasked lookups for the 34 anomalous accounts, with no visible message. Normal ticket support continues for the other 1,806. Warren gets the shape of it before it lands.",
              score: 3,
              outcome:
                "The high-volume exfiltration path closes within ninety minutes with no support impact, because the bulk console was never how ordinary tickets are handled. The 34 experience friction they will read as a system change rather than as detection, and their behaviour under friction is itself evidence.",
              ripple:
                "Query volume from the reporting console drops to near zero and stays there. Three of the 34 immediately attempt to reach the same data through the ticket console at high volume, which is a strong behavioural signal and narrows the ring. Warren becomes your closest ally for the rest of the incident because you told him the shape before you did it, and his team later designs the permanent Tier 2 workflow with you.",
              isBest: true,
            },
            {
              id: "bwd-d02-d",
              label: "Suspend the 34 anomalous agents today via the BPOs",
              detail:
                "Act on the evidence you have. Get the likely culprits out of the system.",
              score: -1,
              outcome:
                "You are 34 for 34 confident in an anomaly statistic that has not been reviewed against ticket complexity. Several of these agents work escalations and account recovery cases that genuinely require many lookups per ticket. And suspension routes through the BPOs, which notifies them.",
              ripple:
                "Nine of the 34 are innocent specialists, two of whom are the vendors' best escalation handlers, and they are told they are under investigation for theft. Meanwhile the BPO notification lets two ring members clean their workstations before preservation. You have simultaneously harmed the innocent and warned the guilty, which is the characteristic outcome of acting on an anomaly score as though it were a finding.",
            },
          ],
          debrief:
            "The best answer here is architectural rather than personnel-based, and that is the transferable move. Instead of asking which humans do I stop, ask which path carries the volume and does the least legitimate work. The operational reporting console was a bulk-read capability handed to a Tier 2 population for occasional convenience; removing it costs almost nothing operationally and removes the mechanism. Personnel action is slow, error-prone, notifies the wrong people, and harms innocents — so you do it later, with evidence, through counsel. Second, note the collaboration move: telling Warren the shape of the change before it lands costs you nothing in security terms and converts the executive whose function you are degrading from an obstacle into a co-designer. Incident responders who treat operations as the enemy lose access to the operational knowledge that tells them which paths are actually load-bearing.",
          principle:
            "Cut the capability, not the people. Paths can be removed in ninety minutes with evidence; humans take weeks and you will be wrong about some of them.",
        },
      },
      {
        id: "bwd-i05",
        t: "T+03:30 — Tue 10:42 ET",
        channel: "pager",
        from: "Ilse Brandt, Threat Intelligence",
        text:
          "Working theory forming in the war room that I want to get ahead of. Someone found 900 failed authentications against the Bengaluru BPO's VPN over the weekend and there is enthusiasm for an external credential-stuffing explanation — outsiders got in, agents are innocent, vendor is at fault. I want to flag that the volumes are consistent with a broad untargeted scan, none succeeded, and the source IPs have no relationship to the query patterns. It is a real observation and I do not think it is our incident. People want it to be, because external is easier to talk about than insider.",
      },
      {
        id: "bwd-i06",
        t: "T+05:50 — Tue 13:02 ET",
        channel: "legal",
        from: "Delphine Cortez, General Counsel",
        text:
          "Clock items. NYDFS Part 500 requires notice of a cybersecurity event within 72 hours of determining one occurred, and if any extortion payment is made there is a 24-hour notification and a 30-day written explanation. Our Irish entity brings GDPR Article 33 at 72 hours from awareness. On the securities side, a material cybersecurity incident triggers an Item 1.05 Form 8-K within four business days of the materiality determination — not of discovery. That distinction is the whole game and I need you to understand that I will not let us make a materiality determination we are not ready to support, and equally I will not let us defer one to buy time. Where are we on scope?",
      },
      {
        id: "bwd-i07",
        t: "T+08:20 — Tue 15:32 ET",
        channel: "pager",
        from: "Ravi Chandrasekhar, Detection Engineering",
        text:
          "Preliminary scope from HELM ticket-console DLP hits: approximately 12,000 distinct customers viewed by the anomalous cohort with no matching ticket. I want to be explicit that this is a floor and not an estimate. It covers the ticket console only. The reporting console query reconstruction is going to take days and I have no confidence about its magnitude. If anyone writes 12,000 into a document today I will need it removed later.",
        decision: {
          id: "bwd-d03",
          scene:
            "Eight hours. The extortion clock says 96 hours. The GC needs a materiality position. Communications wants a number for the holding statement. You have a floor, a warning attached to it, and an executive team that badly wants the number to be small.",
          clock: "T+08:20",
          pressure:
            "Everyone in the room will hear 12,000 as the answer no matter how you caveat it.",
          prompt:
            "How do you handle the scope number internally and externally right now?",
          options: [
            {
              id: "bwd-d03-a",
              label: "Give the 12,000 figure with caveats and let comms prepare around it",
              detail:
                "It is the best available number and the caveats are on the record. Being responsive to the business matters.",
              score: -2,
              outcome:
                "The caveats do not survive the second retelling. Within a day, twelve thousand customers is a settled internal fact appearing in a draft 8-K, a draft customer email, and a board briefing.",
              ripple:
                "The real number lands at 71,400 nine days later. You now have to revise a published figure upward by a factor of six. The revision is the story, not the breach — every article leads with Bellwether revises breach scope, the class action pleads that the initial figure was recklessly issued, and the SEC asks what basis existed for the original number.",
            },
            {
              id: "bwd-d03-b",
              label: "Refuse to give any number until the reporting-console reconstruction is complete",
              detail:
                "No figures leave the security function until the analysis is finished. Hold the line.",
              score: 0,
              outcome:
                "Protects you from the wrong number and starves the people who have genuine legal obligations. The GC cannot assess materiality on nothing, and materiality determinations cannot be deferred indefinitely without that deferral itself becoming a problem.",
              ripple:
                "Legal escalates to the audit committee that security is not providing decision inputs. You are asked to explain, and the explanation is reasonable, but the relationship with counsel — the person whose clocks you most need to work with — is now adversarial at hour twenty of a three-week incident.",
            },
            {
              id: "bwd-d03-c",
              label: "Provide a structured scope position — confirmed floor, unbounded channels, expected date of a defensible number — and get it into the record in that form",
              detail:
                "Written and circulated: confirmed minimum 12,000 from one of two channels; the second channel is unmeasured and could be materially larger; a defensible total is expected in seven to ten days; no external figure should be published before then; for materiality assessment, assume the affected population may exceed 50,000 and includes government ID images. Ask the GC to make the materiality determination on the character of the data rather than on a count.",
              score: 3,
              outcome:
                "You have given counsel exactly what they need to work — the character and the plausible upper bound — while refusing to supply a precise number the organisation would immediately harden into fact. Framing materiality on data character rather than count is the key move: government ID images and financial account data for tens of thousands of customers is material at almost any count.",
              ripple:
                "The 8-K files on the materiality determination without a customer count, describing the categories of data and stating that scope assessment is ongoing. When 71,400 lands nine days later it is an update to an ongoing assessment rather than a correction of a published figure. Coinbase's May 2025 filing followed this pattern — describing the incident, the data categories, the refused 20 million dollar demand, and a remediation cost estimate of 180 to 400 million dollars, with the specific affected count of 69,461 appearing in the state breach notification rather than in the first federal filing.",
              isBest: true,
            },
            {
              id: "bwd-d03-d",
              label: "Give the range 12,000 to 200,000 to make sure nobody anchors low",
              detail:
                "Deliberately wide so the organisation prepares for the worst case.",
              score: -1,
              outcome:
                "The upper bound is invented. You have no analytical basis for 200,000 and it will be asked for.",
              ripple:
                "The range leaks to a reporter at T+4 days and the headline uses the upper figure. Bellwether is publicly associated with a 200,000-customer breach that never happened, and the eventual accurate figure of 71,400 reads as a relieved correction rather than as a fact, which permanently damages the credibility of every number you publish afterward.",
            },
          ],
          debrief:
            "The first scope number you utter internally is the one your organisation will publish, no matter how carefully you caveat it. This is not a failure of your colleagues; it is how organisations under pressure process information. The defence is to never produce a bare number during the uncertain phase — produce a structure. Confirmed floor, unmeasured channels, expected date of confidence, and a working assumption for planning purposes that is explicitly labelled as such. And the deeper move here is redirecting the materiality analysis from count to character. Counsel needs to determine materiality on a clock; a count is the hardest input to get right and the least relevant. Government ID images, financial account identifiers, and precise balances for tens of thousands of customers is material whether the number is 12,000 or 71,400, and you can say that at hour eight with confidence.",
          principle:
            "Never hand an organisation under pressure a bare number during the uncertain phase. Hand it a structure: floor, unknowns, and the date you will be sure.",
        },
      },
      {
        id: "bwd-i08",
        t: "T+22:00 — Wed 05:12 ET",
        channel: "press",
        from: "Naomi Adekunle, investigative reporter, technology desk",
        text:
          "I have the same 4,000-record sample your extorters sent you, from a different source. I have verified three of the records with the customers themselves and they confirm the details are correct, including balances. I am writing that Bellwether customer data including government IDs is circulating. I am publishing Thursday morning. I would like to know what you are doing for these people and whether the source was an employee.",
      },
      {
        id: "bwd-i09",
        t: "T+23:30 — Wed 06:42 ET",
        channel: "exec",
        from: "Theodora Vance, President",
        text:
          "The reporter publishes tomorrow. The board wants a statement today. Two open questions I need you to settle. Do we say no customer funds were taken — because as far as I know that is true. And do we name the vendor, because our people are furious and it was not our staff who did this.",
        decision: {
          id: "bwd-d04",
          scene:
            "Just under a day. The reporter's Thursday deadline has collapsed your disclosure timeline. Two specific sentences are being drafted and both are tempting and both are traps.",
          clock: "T+23:30 — statement today, article Thursday",
          pressure:
            "Both proposed sentences are things you believe are true and neither is something you can currently support.",
          prompt:
            "Rule on the two sentences: no customer funds were taken, and naming the BPO vendor.",
          options: [
            {
              id: "bwd-d04-a",
              label: "Say no funds were taken and name the vendor — both are true and both help",
              detail:
                "Reassure customers about their money, and be transparent about where the failure occurred.",
              score: -3,
              outcome:
                "The first is unverifiable: this data is a voice-phishing toolkit, and you have not yet analysed whether accounts belonging to these customers show anomalous outbound activity. The second exports blame to a vendor while you were the data controller, the access tier was yours, and the console was yours.",
              ripple:
                "Within a week, customers who lost funds to social-engineering calls using this exact data come forward. Your no funds were taken statement is quoted in every one of their complaints. The named vendor's counsel simultaneously reads your statement as a public accusation, cooperation on evidence preservation slows to formal channels, and the two other BPOs quietly begin protecting their own positions rather than yours.",
            },
            {
              id: "bwd-d04-b",
              label: "State precisely what was and was not accessed, name no vendor, and warn customers about the specific attack this data enables",
              detail:
                "Publish: what categories of data were accessed, explicitly that passwords, private keys and seed phrases were not and that no funds were moved by the unauthorised access itself; that the access came from misused authorised support access; that Bellwether is the accountable party regardless of employment relationship. Add a prominent, specific warning that criminals may call knowing the customer's balance and address, state that Bellwether will never call to ask a customer to move funds, and commit to making whole any customer who is socially engineered as a result. Do not name the vendor while the investigation is live.",
              score: 3,
              outcome:
                "The statement is narrower and far stronger. Separating no funds were moved by the unauthorised access from the unsupportable no customer funds were taken is the difference between a claim you can hold forever and one you retract in a week. And the phishing warning is the only part of the statement that actually reduces harm.",
              ripple:
                "The Thursday article is materially better than it would have been because the specific warning is genuinely newsworthy and the reporter runs it. Coinbase's response followed this shape — explicitly stating that passwords, private keys and seed phrases were not accessed, refusing the 20 million dollar demand, and committing to reimburse customers who were socially engineered into sending funds. The make-whole commitment made before the number was known is what converted the story from negligence to accountability.",
              isBest: true,
            },
            {
              id: "bwd-d04-c",
              label: "Delay the statement until after the article, so you can respond to what is actually published",
              detail:
                "Do not pre-empt. See what she writes, then correct the record precisely.",
              score: -2,
              outcome:
                "You surrender the first account of your own incident to a third party, and more importantly you delay the phishing warning by 24 hours — the exact 24 hours in which the data is freshest and the calls are most likely to start.",
              ripple:
                "Customers begin receiving voice-phishing calls Thursday afternoon from callers who know their balances. The first ones have had no warning from Bellwether. Four confirmed losses in the first 48 hours, all preventable by a warning you had drafted and held. Reactive disclosure is a communications strategy, and this was never a communications problem.",
            },
            {
              id: "bwd-d04-d",
              label: "Publish everything including the vendor name, the 12,000 figure, and the full extortion email",
              detail:
                "Maximum transparency. Get all of it out at once and never be accused of holding anything back.",
              score: -1,
              outcome:
                "Transparency is not the same as publishing every fact you possess. The 12,000 figure is a floor you have been warned about, the vendor name is an unfinished attribution, and the extortion email contains operational detail that shapes the ring's next move.",
              ripple:
                "The 12,000 figure requires a sixfold upward revision. The vendor sues over the characterisation. And the published extortion email tells the ring exactly what you received and what you did not, which lets them calibrate the second demand. Transparency means not concealing what matters; it does not mean disclosing what you have not finished.",
            },
          ],
          debrief:
            "Two disciplines. First, the difference between no customer funds were taken and no funds were moved by the unauthorised access is not lawyerly hedging — it is the difference between a true statement and a false one, because the harm from this data is downstream and social, not on-platform. Second, resist the pull to name the vendor. You were the data controller, the tier design was yours, the console was yours, and a public accusation during a live investigation converts your best evidence source into a litigant. There is a time to hold a vendor accountable; it is contractually, afterwards, in writing. And note the single most valuable sentence in the whole statement: the specific warning that criminals may call knowing the customer's balance. That is the only part of any breach notification that has ever prevented a single dollar of loss.",
          principle:
            "Disclose the harm mechanism, not just the fact of the breach. The sentence that prevents loss is the one describing the phone call your customer is about to receive.",
        },
      },
      {
        id: "bwd-i10",
        t: "T+2 days 04:00",
        channel: "community",
        from: "Support escalation queue — automated summary",
        text:
          "412 calls in the last 18 hours from customers reporting that someone phoned them, greeted them by name, cited their current balance to the cent and their home address, claimed to be Bellwether security, and instructed them to move funds to a safe wallet. Nineteen customers complied. Total customer loss so far: 2.1 million dollars. Callers are using a spoofed number matching our published support line.",
      },
      {
        id: "bwd-i11",
        t: "T+2 days 11:20",
        channel: "board",
        from: "Gideon Marsh, board member, chair of the Audit Committee",
        text:
          "I have read the 8-K draft and the incident log. Three things. First, I want to know why a customer service agent in any location could view an unmasked government ID image without a second person approving it — that is a dual control question and I do not accept that volume is the answer. Second, I want to know when this committee was last shown a report on privileged data access by third-party personnel, because I have looked and I cannot find one. Third, someone in the executive session raised paying the 20 million. I would like your view on the record.",
        decision: {
          id: "bwd-d05",
          scene:
            "Two days. Nineteen customers have lost 2.1 million dollars. The extortion deadline is 48 hours away. A board member has asked you three questions in front of the committee and the third one is the one everyone is waiting on.",
          clock: "T+2 days — extortion deadline in 48 hours",
          pressure:
            "Twenty million dollars is materially less than the remediation estimate, and someone senior has already said so out loud.",
          prompt:
            "Your recommendation on the extortion demand, on the record to the Audit Committee.",
          options: [
            {
              id: "bwd-d05-a",
              label: "Recommend paying — 20 million against a 180 to 400 million remediation estimate is rational risk transfer",
              detail:
                "Buy the deletion, stop the customer harm, and treat it as a commercial decision.",
              score: -3,
              outcome:
                "You would be purchasing an unverifiable promise from criminals who have already distributed a sample to a journalist. There is no deletion to buy; the data is copied, and the sample's independent circulation proves it. Payment also triggers a NYDFS notification within 24 hours and a written explanation within 30 days, and it establishes to every other ring watching that Bellwether pays.",
              ripple:
                "Payment is made, the data circulates anyway within three weeks, and the fact of payment becomes public through the regulatory filing. A second extortion attempt arrives in four months against a different data set. The 20 million bought nothing and priced Bellwether for everyone.",
            },
            {
              id: "bwd-d05-b",
              label: "Recommend refusing, state the reasoning in terms the committee can defend, and redirect the money to the harm that is actually occurring",
              detail:
                "On the record: we do not pay, because the data is demonstrably already distributed and deletion cannot be verified; because payment creates a NYDFS notification obligation and a permanent public record that we pay; and because the marginal harm reduction is zero. Redirect resources to the live harm — outbound proactive warning calls to affected customers, a verified callback protocol, identity protection, the make-whole commitment, and a substantial public bounty for information leading to arrest and conviction.",
              score: 3,
              outcome:
                "The committee gets a decision they can defend to shareholders and regulators, grounded in the fact that the sample is already circulating independently. Converting the refusal into visible action against the actual harm is what makes the refusal credible rather than merely stubborn.",
              ripple:
                "The bounty produces two credible leads within a month, one of which identifies a recruiter operating in a Telegram channel. Coinbase took this exact posture in May 2025 — refused the 20 million dollar demand, announced a 20 million dollar bounty for information leading to arrest and conviction, and committed to reimburse customers socially engineered into sending funds. Refusing costs money; refusing without doing anything else costs credibility.",
              isBest: true,
            },
            {
              id: "bwd-d05-c",
              label: "Engage a professional negotiator to extend the deadline and buy investigation time",
              detail:
                "Do not pay, but do not refuse either. Keep the channel open while forensics completes.",
              score: 0,
              outcome:
                "Legitimate in ransomware where a decryption key is a real deliverable. Much weaker here, because there is nothing to deliver — the data is copied and partially distributed. What negotiation buys is time, and time is not your constraint; the calls to customers are already happening.",
              ripple:
                "Negotiation runs eleven days and yields two useful pieces of attribution intelligence, which is a genuine benefit. It also delays the public bounty by eleven days and leaves the executive team in an ambiguous posture where several people still believe payment is possible. When the refusal finally comes it lands without conviction and one board member is surprised by it.",
            },
            {
              id: "bwd-d05-d",
              label: "Defer the recommendation to the GC and the board as a purely legal and commercial matter",
              detail:
                "The CISO advises on technical facts. Payment is a business decision above the security function.",
              score: -1,
              outcome:
                "The question you were asked is squarely within your competence: whether payment achieves the security outcome it claims to. Only you can tell the committee that the data is demonstrably already distributed and that deletion is unverifiable. Deferring withholds the decisive input.",
              ripple:
                "The board deliberates without the one fact that settles it and comes close to authorising payment. It is stopped by outside counsel rather than by you. The audit committee chair notes in the minutes that the security function did not offer a view, and your standing in future board discussions is measurably lower for two years.",
            },
          ],
          debrief:
            "Extortion economics in a data theft are different from ransomware and most executives conflate them. In ransomware, payment may purchase a working decryption key, which is a verifiable deliverable. In data extortion, payment purchases a promise of deletion that is unverifiable in principle and disproven in fact the moment the sample surfaces independently — as it did here, through the reporter's separate source. That single observation should end the debate, and it is your job to put it in front of the board because nobody else in the room can. The second half matters just as much: a refusal is only credible if it comes with visible, funded action against the harm that is actually happening. Note also Gideon's first two questions, which are the better ones. Why could a single agent view an unmasked government ID without dual control, and when did the audit committee last see a report on third-party privileged access. Those are the questions that would have prevented this, and they were available to be asked at any point in the previous three years.",
          principle:
            "You cannot buy the deletion of a copy. Refuse, say precisely why, and spend the money on the harm that is actually occurring.",
        },
      },
      {
        id: "bwd-i12",
        t: "T+4 days",
        channel: "regulator",
        from: "Delphine Cortez, General Counsel",
        text:
          "Filed. Item 1.05 8-K describing the incident, the categories of data, the refused demand, and that scope assessment is ongoing, with a preliminary remediation cost estimate. NYDFS notice within 72 hours of determination. Irish DPC notified under Article 33. State attorneys general are queued behind the final count. For the record, our first materiality determination was made on the character of the data rather than the count, which is the position I want us to be able to defend, and it is defensible because you gave me the structure rather than a number.",
      },
      {
        id: "bwd-i13",
        t: "T+9 days",
        channel: "pager",
        from: "Ravi Chandrasekhar, Detection Engineering",
        text:
          "Reporting-console reconstruction complete. The figure is 71,400 distinct customers, not 12,000. The gap is entirely the reporting console: agents pulled batched customer exports for what were logged as quality assurance sampling and audit reconciliation jobs, which was a documented legitimate use of that console and was never alerted on because it was normal. Five agents across two BPOs account for 94 percent of it. Earliest activity is twenty-two weeks before the extortion email. I want to be clear that if you had published 12,000 on day one we would be revising it today by a factor of six.",
      },
      {
        id: "bwd-i14",
        t: "T+11 days",
        channel: "field",
        from: "Ilse Brandt, Threat Intelligence",
        text:
          "Recruitment mechanism established from device artefacts and one cooperating agent. Approach was through a Telegram channel aimed at BPO workers, offering between 2,000 and 15,000 US dollars per agent for lookups, paid in stablecoin, structured as a per-record piece rate with bonuses for accounts above a balance threshold. One agent was recruited by a colleague who had already been recruited, which is how it reached five people across two vendors. Median agent tenure among the five is fourteen months. Median monthly salary is under 900 dollars. This was not sophisticated. It was arithmetic.",
        decision: {
          id: "bwd-d06",
          scene:
            "Eleven days. You know the count, the mechanism, the price, and the people. The board wants the structural fix and the audit committee chair's first question — why could one agent see an unmasked government ID — is still unanswered.",
          clock: "T+11 days — remediation plan to the audit committee in 72 hours",
          pressure:
            "The fix that would actually work is the one that makes support slower and more expensive, permanently.",
          prompt:
            "What is the structural remediation you take to the board?",
          options: [
            {
              id: "bwd-d06-a",
              label: "Bring all customer support in-house and eliminate the BPOs",
              detail:
                "Remove third-party access entirely. Employees have more to lose and can be vetted properly.",
              score: -1,
              outcome:
                "Expensive, slow, and it treats employment status as a control. The relevant variables were a low-paid worker with high-value access, an unmonitored bulk read path, and a piece-rate offer. None of those are eliminated by an employment contract, and insider bribery of direct employees is well documented across every sector.",
              ripple:
                "The transition takes fourteen months and 90 million dollars. Nine months in, before it completes, a directly-employed Tier 2 agent in a domestic support centre is approached through the same Telegram channel and accepts. The controls that would have caught it were deprioritised because the reorganisation was the answer.",
            },
            {
              id: "bwd-d06-b",
              label: "Redesign the access architecture around bulk read, dual control on sensitive fields, and continuous attestation",
              detail:
                "Eliminate standing bulk export for support entirely; batch pulls become a request with named business justification, a second approver, and a time-boxed grant. Unmasked government ID viewing requires a Tier 3 dual-control approval tied to a specific ticket. Just-in-time PII unmasking scoped to the customer on the open ticket, expiring with the ticket. Per-agent lookup baselines with alerting on deviation. Honeytoken customer records that page security on any access. Query-level logging with 24-month retention outside the support organisation's control. Quarterly access reports to the audit committee by vendor and by tier.",
              score: 3,
              outcome:
                "Every element maps to a specific step in what actually happened. Average handle time rises about 40 seconds and Warren's team helps design it because you brought them in on day one. The honeytokens are the cheapest control on the list and the one most likely to catch the next attempt in week one rather than in month five.",
              ripple:
                "Seven months later a honeytoken record fires at 02:00. A single agent at the Bogotá vendor, approached through a similar channel, is identified within nine hours having accessed 31 records. The difference between twenty-two weeks and nine hours is the entire value of the programme, and it is what the audit committee remembers when the security budget is set.",
              isBest: true,
            },
            {
              id: "bwd-d06-c",
              label: "Deploy DLP and behavioural analytics across all support endpoints",
              detail:
                "Buy the detection layer. Monitor everything the agents do and alert on anomalies.",
              score: 1,
              outcome:
                "Useful and insufficient alone. Detection on top of an architecture that permits 1,840 people to bulk-read customer PII as a normal action means you are trying to distinguish malicious normal from benign normal at scale. That is exactly the problem that let this run twenty-two weeks — the reporting-console queries were logged and looked like the documented legitimate use, because they were indistinguishable from it.",
              ripple:
                "The tooling ships and generates 400 alerts a week against a support population doing its job. Alert fatigue sets in within two months and the queue is triaged by an outsourced SOC tier with no context. The next real signal is closed as a false positive in ninety seconds.",
            },
            {
              id: "bwd-d06-d",
              label: "Increase agent vetting, add polygraph-style integrity screening, and raise BPO contractual penalties",
              detail:
                "Address the human element. Better screening and stronger contracts change the incentives.",
              score: -2,
              outcome:
                "You would be trying to out-screen a 15,000 dollar offer made to someone earning under 900 dollars a month, twelve months after they passed your screening. Vetting predicts nothing about an offer that arrives later, and contractual penalties transfer money after the fact without preventing anything.",
              ripple:
                "Screening costs rise, hiring slows, two vendors raise rates to absorb the penalty exposure, and the underlying access design is untouched. Eighteen months later a fully-vetted agent with a clean record takes a similar offer. The board is told the vetting was strengthened and cannot understand why it happened again.",
            },
          ],
          debrief:
            "This is the answer to Gideon's question and it is an access-design answer, not a loyalty answer. The variables that made this possible were structural: a large population with standing unmasked access to high-value PII, a bulk export path whose legitimate use was indistinguishable from its abuse, no dual control on the most sensitive fields, no per-agent baseline, and no honeytokens. Every one of those is fixable and none of them requires knowing anything about the agents' character. Note especially the honeytoken, which is the highest-leverage item on the list and costs almost nothing: seeded records that no legitimate ticket will ever touch, which page immediately on access. Twenty-two weeks of undetected exfiltration becomes nine hours. And note the pattern that runs through the whole module — the Verizon 2025 DBIR found third-party involvement in breaches had doubled to 30 percent. Your vendors' access is your access, and their staff's incentives are part of your threat model whether you have modelled them or not.",
          principle:
            "Bulk read of customer PII is a privileged operation. Treat it like a wire transfer — dual control, named justification, time-boxed, alerted, and seeded with tripwires.",
        },
      },
      {
        id: "bwd-i15",
        t: "T+23 days",
        channel: "regulator",
        from: "Delphine Cortez, General Counsel",
        text:
          "State notifications went out on 71,400 with a description of the phishing risk and a verified callback protocol. Two state attorneys general have opened inquiries. NYDFS has asked, in writing, for our documented basis for granting unmasked PII access to third-party personnel at scale, and specifically what compensating controls existed given that the population was 1,840. There is no good answer to that question. I would like to submit the honest one and I need you to write it.",
        decision: {
          id: "bwd-d07",
          scene:
            "Twenty-three days. A regulator has asked, in writing, the one question with no defensible answer. What you write becomes a permanent part of the supervisory record.",
          clock: "T+23 days — response due in 15 business days",
          pressure:
            "The honest answer is an admission that will be quoted back at you in every examination for years.",
          prompt:
            "How do you draft the response to the NYDFS question?",
          options: [
            {
              id: "bwd-d07-a",
              label: "Emphasise the controls that did exist — logging, DLP, tier separation, vendor contracts, background checks",
              detail:
                "There was a control environment. Describe it accurately and completely.",
              score: -1,
              outcome:
                "Every item is true and the composite is misleading, because the question was about compensating controls for standing bulk access and none of those compensated for it. Regulators read this pattern constantly and recognise it immediately.",
              ripple:
                "The follow-up question is narrower and harder: which of the listed controls would have detected bulk export by an authorised user, and what was the mean time to detect. The answer is none and twenty-two weeks. You have now answered the same question twice, the second time worse, and you have spent your credibility to delay an admission by six weeks.",
            },
            {
              id: "bwd-d07-b",
              label: "State the gap plainly, explain how the design decision was made, and present the remediation with dates and measurable criteria",
              detail:
                "Write: standing unmasked PII access was granted to 1,840 third-party personnel to meet handle-time targets; the bulk reporting path was a documented legitimate capability with no dual control, no per-agent baseline and no alerting; no compensating control existed that would have detected authorised-user bulk export; mean time to detect was twenty-two weeks. Then the remediation, each item with an owner, a date, and a measurable acceptance criterion, plus the quarterly third-party privileged access report now going to the audit committee.",
              score: 3,
              outcome:
                "The plainest possible answer, which is what supervisors want and rarely receive. Naming the business tradeoff that produced the design — handle-time targets — is what makes it credible rather than performative, and it demonstrates you understand the failure as a decision rather than an accident.",
              ripple:
                "The inquiry closes without enforcement, with an undertaking to report quarterly on the remediation milestones. The examiner's note records that Bellwether's response was candid and specific. Two years later, during an unrelated examination, that record is the reason the supervisory posture is cooperative rather than adversarial. Candour with a regulator is a capital account you can only fund before you need it.",
              isBest: true,
            },
            {
              id: "bwd-d07-c",
              label: "Have outside counsel draft it and keep the security function out of the response",
              detail:
                "This is a legal document with regulatory consequences. Let specialists handle the language.",
              score: 0,
              outcome:
                "Counsel should absolutely review it. But a response drafted primarily for legal defensibility reads as legally defensible, which to a supervisor reads as evasive. It also loses the technical specificity that makes remediation commitments credible.",
              ripple:
                "The response is careful and vague. The examiner requests a technical addendum, then a meeting, then a walkthrough. What could have been one document becomes a four-month engagement, and the relationship starts from a position of the regulator having had to extract detail rather than being offered it.",
            },
            {
              id: "bwd-d07-d",
              label: "Argue the access design was industry standard for exchanges at this scale",
              detail:
                "Benchmark against peers. If everyone does it this way, the design was reasonable.",
              score: -2,
              outcome:
                "Supervisors do not accept prevalence as a standard of care, and offering it signals that you believe the design was fine and the outcome was bad luck. It also invites the obvious rejoinder about whether peers granted standing bulk access to 1,840 third-party personnel.",
              ripple:
                "The examiner treats the response as a maturity signal rather than an argument and escalates the scope of the inquiry to Bellwether's broader third-party risk programme. What was one question about one console becomes a full review of vendor governance across the firm.",
            },
          ],
          debrief:
            "There is a version of this job where you spend your career managing the appearance of your control environment, and it works until the day someone asks a question with no defensible answer — and that day always comes. The alternative is to build a supervisory relationship where your account of your own weaknesses is trusted, which is worth more than any single answer. The specific craft in the winning option: name the business tradeoff that produced the gap. Standing unmasked access existed because handle-time targets required it. That is honest, it is the actual causal chain, and it demonstrates the organisation understands the failure as a decision rather than an accident. Regulators are not looking for firms with no gaps; they are looking for firms that can find and describe their own.",
          principle:
            "Candour with a supervisor is a capital account. You can only fund it before you need it, and you spend it once.",
        },
      },
      {
        id: "bwd-i16",
        t: "T+7 months",
        channel: "pager",
        from: "Honeytoken alert (automated) — HELM canary record",
        text:
          "Canary customer record accessed at 02:07 local. Agent identity resolved. Vendor: Bogotá. Tier 2. No associated ticket. Prior 40 minutes show 31 unmasked record views with no matching tickets. Dual-control request for a government ID view was submitted and denied by the approver nine minutes ago. Access suspended automatically pending review. Elapsed time from first anomalous view to containment: nine hours forty minutes.",
      },
    ],
    scoring: [
      {
        dimension: "Evidence integrity and investigative discipline",
        weight: 0.22,
        note:
          "Judged on whether query-level logs were preserved before retention expiry, whether the validation path avoided tipping the source, and whether anyone notified the vendors or named suspects before preservation was in place. Asking a BPO to check its own logs, or acting on an anomaly score as though it were a finding, are scored as case-destroying regardless of eventual outcome.",
      },
      {
        dimension: "Containment proportionality",
        weight: 0.2,
        note:
          "Measured as harm prevented minus harm caused. Full credit for removing the bulk-read capability, which closes the mechanism at near-zero operational cost. Heavy penalties both for mass revocation that leaves 12.4 million customers unable to reach support during active fraud, and for continuing to observe a known live theft in order to strengthen a case.",
      },
      {
        dimension: "Disclosure accuracy and clock management",
        weight: 0.22,
        note:
          "Every published figure and claim is checked against what was supportable when made. A materiality determination grounded in data character rather than an unreliable count scores highest. Publishing a floor as an estimate, and later revising sixfold, is the defining failure. Also scored: whether NYDFS 72-hour, GDPR Article 33, and SEC four-business-day clocks were run from the correct trigger.",
      },
      {
        dimension: "Downstream customer harm reduction",
        weight: 0.21,
        note:
          "The real harm is voice phishing against people whose balance the caller knows. Scored on whether the specific attack was described to customers before the calls began rather than after, whether a verified callback protocol and a make-whole commitment shipped early, and whether the extortion refusal was paired with funded action against the live harm rather than standing alone.",
      },
      {
        dimension: "Structural remediation quality",
        weight: 0.15,
        note:
          "Does the fix map to the causal chain? Dual control on sensitive fields, elimination of standing bulk export, just-in-time unmasking, per-agent baselines, honeytokens, and query logs held outside the support organisation all score. Insourcing, enhanced vetting, contractual penalties, and detection tooling layered over an unchanged access design score low — they address employment status and character rather than capability.",
      },
    ],
    debrief: [
      {
        title: "Insider risk is an access-design problem wearing a loyalty costume",
        body:
          "The instinctive framing of insider threat is about people: vetting, culture, monitoring, trust. That framing produces expensive programmes that do not work, because it tries to predict at hiring time an offer that arrives fourteen months later. The Bellwether ring was recruited through a Telegram channel aimed at BPO workers, paid between 2,000 and 15,000 dollars per agent on a per-record piece rate, offered to people earning under 900 dollars a month. There is no screening regime that survives that arithmetic. What does survive it is design: how many people have standing access to high-value data, what the smallest unit of access is, whether bulk read is possible at all, whether the most sensitive fields require a second human, and whether abuse is distinguishable from legitimate use in the logs. Coinbase's May 2025 incident followed this shape precisely — overseas support contractors bribed to pull customer records, 69,461 customers affected, an incident dating to late December 2024 and not discovered until May, a refused 20 million dollar extortion demand, and a remediation estimate of 180 to 400 million dollars. The failure was not that someone was corruptible. Everyone is corruptible at some price. The failure was that one corruptible person could reach 14,000 records.",
      },
      {
        title: "The detection gap: when abuse is indistinguishable from the documented legitimate use",
        body:
          "Twenty-two weeks. That number is the heart of this scenario and it has a precise cause: the reporting console's bulk exports were a documented, approved, ordinary capability, so the ring's queries generated logs that looked exactly like the thing those logs were supposed to look like. You cannot alert your way out of that. When a capability's legitimate use and its abusive use produce identical telemetry, detection engineering has nothing to work with, and the only remaining moves are architectural: remove the capability, or add a second signal that abuse cannot mimic. Dual control is one such signal — a second human's approval is not something the abusing agent can generate. Honeytokens are another, and they are the most underrated control in this entire domain. Seeded customer records that no legitimate ticket will ever reference, paging immediately on any access, cost almost nothing and convert twenty-two weeks into nine hours. If you take one implementable item from this module, take the honeytokens, and put them in every data store where authorised bulk read is possible.",
      },
      {
        title: "Scope arithmetic: the first number you say is the number you will publish",
        body:
          "Ravi's floor of 12,000 was correct, carefully caveated, and would have destroyed the disclosure if it had been treated as an estimate — the true figure was 71,400, six times larger, and the gap was an entire channel nobody had reconstructed yet. Organisations under pressure convert caveated numbers into facts within about two retellings; this is not a failing of your colleagues, it is a property of how information moves under stress. The countermeasure is procedural: during the uncertain phase, never produce a bare number. Produce a structure — confirmed floor, enumerated unmeasured channels, an explicit planning assumption labelled as such, and a date by which you will have a defensible total. Then redirect the materiality question from count to character, because counsel has a four-business-day clock from the materiality determination and the character of the data is knowable on day one while the count is not. Tens of thousands of government ID images and financial account identifiers is material at any plausible count, and you can say so with confidence at hour eight.",
      },
      {
        title: "Extortion economics: you cannot purchase the deletion of a copy",
        body:
          "Data extortion is not ransomware and treating them the same is how boards end up authorising useless payments. Ransomware payment may buy a working decryption key, which is verifiable. Data extortion payment buys a promise of deletion, which is unverifiable in principle. In this scenario it was also disproven in fact, because a journalist obtained the same sample from a different source — that single observation should end the internal debate, and putting it in front of the board is your job because nobody else in the room will. Layer on the regulatory mechanics: under NYDFS Part 500 an extortion payment triggers notification within 24 hours and a written explanation within 30 days, so payment is not private and the fact that you pay becomes a permanent, discoverable, market-signalling record. Coinbase refused the 20 million dollar demand and announced a 20 million dollar bounty for information leading to arrest and conviction. The symmetry was not an accident; it converted a refusal into an action, and a refusal without an action is just a posture.",
      },
      {
        title: "The harm is the phone call, not the breach",
        body:
          "Almost every breach notification ever written describes what was taken and almost none describe what will be done with it. That is backwards. This data set — full name, home address, phone number, last four of an SSN, and a current balance to the cent — is not primarily useful for account takeover; it is a credibility kit for a phone call. A caller who greets someone by name, states their address, and quotes their balance to the cent has cleared the trust bar before making any request, and the request is always the same: move your funds to a safe wallet. Nineteen Bellwether customers complied and lost 2.1 million dollars. The single highest-value sentence in any notification for this incident is not the count and not the apology; it is a plain description of the call the customer is about to receive, plus a firm rule they can apply without judgement — Bellwether will never call you and ask you to move funds. Ship a verified callback protocol alongside it so there is a safe action, not only a prohibition. Measure your notification by how many losses it prevented, and you will write a different document.",
      },
      {
        title: "Regulatory clocks run on determination, not on discovery",
        body:
          "The clocks in this scenario are real and they run on different triggers, which is the detail that trips people. The SEC's Item 1.05 Form 8-K is due within four business days of determining that an incident is material — not of discovering it — and the determination itself must be made without unreasonable delay. NYDFS Part 500 requires notice within 72 hours of determining that a reportable cybersecurity event occurred, with the separate 24-hour and 30-day obligations attaching to any extortion payment. GDPR Article 33 runs 72 hours from awareness for the Irish entity. State breach notification statutes have their own triggers and often want the count. The practical consequence for a CISO is that your job is not to manage a deadline but to supply, on the record and dated, the factual inputs on which each determination rests. That means your incident log needs to be written as though counsel will rely on it, because they will. And it means the distinction between we have not verified X and we have verified not-X must be maintained in every artefact, because a materiality determination built on the wrong one of those is a securities problem rather than a security one.",
      },
      {
        title: "The transferable pattern: your vendor's access is your access",
        body:
          "The 2025 Verizon DBIR found third-party involvement in breaches had doubled to 30 percent, against roughly 12,195 confirmed breaches analysed. That number is the strategic headline of this module. Bellwether was the data controller; the tier design was Bellwether's; the console was Bellwether's; the regulator's question was addressed to Bellwether. The employment relationship of the person holding the credential is a commercial detail, not a security boundary. Three practices follow. First, inventory third-party privileged access the way you inventory your own — by data class, population size, and whether bulk read is possible — and put that inventory in front of the audit committee quarterly, because Gideon's second question was the one that would have prevented all of this and nobody had ever been asked it. Second, contract for evidence: log retention, preservation on notice, right to interview, and forensic access, negotiated before an incident when you have leverage rather than during one when you have none. Third, model your vendor's staff incentives explicitly. A control that assumes an underpaid worker will decline a 15,000 dollar offer is not a control; it is a hope with a compliance artefact attached.",
      },
    ],
    awards: [
      "strong-insider-access-architect",
      "safe-scope-before-number",
      "strong-extortion-refusal-doctrine",
      "safe-dual-control-on-egress",
      "strong-regulator-candour",
      "safe-downstream-harm-first",
    ],
  },
];
