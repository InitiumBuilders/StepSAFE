import type { Counsel } from "../schema";

/* UNIT counsel :: THE PRACTICE — FRONTIER AI
   Your specialists speak inside the simulation. They advise from their own doctrine,
   in their own register, and they do not always agree. Some of them are confidently
   wrong in exactly the way their file says they will be. Weighing the advice is the
   skill; obeying it is not. Seva never answers — Seva reframes the question. */

export const COUNSEL: Counsel[] = [
  /* ============================================================
     SIM A — sim-halcyon-custody
     Roles: u-vault, u-lantern, u-anchor, u-keeper, u-compass
     ============================================================ */
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d1",
    voices: [
      {
        member: "u-anchor",
        line: "Nobody presses anything until I have an operations lead, a scribe, and a named owner for the network change. Kill the flow at the edge — a null route and a QUIC block are not identity events, so the far end never learns why it died. The person can wait for a lawyer; the bytes cannot wait for anyone.",
        leaning: "cut the path, not the person",
      },
      {
        member: "u-keeper",
        line: "That harness token is still valid and it still carries checkpoint read scope. I would revoke the credential and rotate the domain key inside the minute and take whatever breaks in the morning. A live key during an active read is not custody. It is a door somebody left open with a log file attached.",
        leaning: "revoke the credential now",
      },
      {
        member: "u-lantern",
        line: "Whatever you cut, start the capture first. KESTREL-7 fires on volume, which means it can tell you the shape of that session and nothing whatsoever about its contents. The four minutes of full packets you take before the block are the only artifact tonight that nobody has to infer later.",
        leaning: "capture before you cut",
      },
    ],
  },
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d2",
    voices: [
      {
        member: "u-vault",
        line: "Skip the personal directories entirely. The answer is in the mint record and the object manifest — compare what that harness token actually read against the shard layout and you will know whether this was a checkpoint pull or somebody's benchmark, without reading one line of a man's mail.",
        leaning: "the artifacts, not the person",
      },
      {
        member: "u-anchor",
        line: "The shell history is the difference between misconduct and a cron job, and it lives on the endpoint or nowhere. Take it — but take it with the reason written down first. At hour twenty-two somebody will ask why we read what we read, and I want the answer to be a paragraph we wrote at hour one.",
        leaning: "scope it, then take the host",
      },
      {
        member: "u-compass",
        line: "You have one examiner and a full-disk sweep is a four-hour commitment that ends in a briefing you cannot deliver at 07:00. Decide now which single question he is answering. Everything he finds outside that question is a liability you are paying him by the hour to create.",
        leaning: "one question, one examiner",
      },
    ],
  },
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d3",
    voices: [
      {
        member: "u-keeper",
        line: "Strip the weight-read scope, yes. And then make every full-checkpoint read a witnessed operation with a recorded quorum and a signed ceremony log, because if we are finally doing this under fire we should do it properly rather than do it twice.",
        leaning: "two humans, ceremony, no exceptions",
      },
      {
        member: "u-compass",
        line: "The safety org is the only part of research that has ever voluntarily asked us for a control. Break their run tonight and you will spend four quarters discovering what they built to route around us. Turn off the scope and leave them a working door.",
        leaning: "do not break the eval",
      },
      {
        member: "u-lantern",
        line: "Leaving it up to watch it is the answer I would have given four years ago and it is wrong — I would be instrumenting one path out of eleven hundred and eighty people. Take the scope off, and give me the mint events as a feed. A token request is a beautifully low-volume signal and I have never once had it.",
        leaning: "strip scope, feed me the mints",
      },
    ],
  },
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d4",
    voices: [
      {
        member: "u-anchor",
        line: "Suspend with pay. No cause stated, no allegation in the letter, a named HR contact at the bottom of it. He is worth more to us as a person who will still take a call than as a defendant, and the only fact that resolves this is a fact he holds. And the CTO does not make first contact — not today, not angry.",
        leaning: "keep the human channel open",
      },
      {
        member: "u-keeper",
        line: "Whatever HR decides, he sits in the recovery quorum for two custody domains and his hardware token is still enrolled. Remove him from the quorum tonight and rotate everything he could help reconstitute. I am not willing to hold a custody path whose holder is under investigation.",
        leaning: "pull him from the quorum now",
      },
      {
        member: "u-compass",
        line: "Understand what you are actually deciding. Whatever you write this morning is the document a tribunal reads first, before any forensics. The room wants a scalp because a scalp is legible, and there is no version of today where you are both decisive and correct. Pick correct and take the twenty bad minutes.",
        leaning: "the written record decides this",
      },
    ],
  },
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d5",
    voices: [
      {
        member: "u-keeper",
        line: "Forty-one shards of seventy-four, drawn from two custody domains of four. That is not a partial theft, it is noise with a filename — the domains hold independent key authorities and without the other two there is nothing to assemble. Give Estelle that number and give her why it is structural rather than lucky.",
        leaning: "the arithmetic is the answer",
      },
      {
        member: "u-vault",
        line: "I would not say noise until somebody has tried and failed to assemble it. Keeper designed that scheme, which makes Keeper the last person who should certify it held. Give me two hours and a copy and let me fail in front of a witness, and then you can say cannot rather than should not.",
        leaning: "test it before you claim it",
      },
      {
        member: "u-compass",
        line: "Estelle will carry exactly one sentence out of this call into the rest of her week. Give her not usable, here is why, here is when it is confirmed — and put the shard arithmetic in an appendix. Four numbers to a board is four separate chances for one of them to move under you.",
        leaning: "one sentence, appendix the rest",
      },
    ],
  },
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d6",
    voices: [
      {
        member: "u-compass",
        line: "The note to eleven hundred and eighty people has to land before her article does, and yes, the leaker is on that distribution. That is fine. A frightened person holding accurate information stops being interesting to a journalist. What you cannot do today is open a leak hunt — it consumes the exact people you need and tells the building what we actually care about.",
        leaning: "internal first, no leak hunt",
      },
      {
        member: "u-lantern",
        line: "Narrow the internal note. Everything you write to eleven hundred people you are also writing to the operator, and if there is a second path I have not found yet, today is the day they close it and I lose it permanently.",
        leaning: "assume the subject is reading",
      },
      {
        member: "u-anchor",
        line: "Say only what survives Friday. An internal matter, one person on paid leave, no conclusion reached, an update by a stated date. Not one number — the 2.1 TB is a sampled estimate and I have watched estimates like that move by an order of magnitude before breakfast.",
        leaning: "no numbers in print",
      },
    ],
  },
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d7",
    voices: [
      {
        member: "u-lantern",
        line: "KESTREL-7 has now produced one confirmed false positive at forty sigma and cost the company a night. I want its volume threshold raised and the known-good ASN list rebuilt before it fires again. An alert that wakes five people for a package mirror is how a team learns to ignore the one that matters.",
        leaning: "retune the canary, cut the noise",
      },
      {
        member: "u-vault",
        line: "The portal still mints a token with full checkpoint read scope for any authenticated researcher. That was true at 02:41 and the ASN turning out to be ours has not made it less true. Restore the workflow, keep the scope off, and say both halves in one sentence so nobody hears restored on its own.",
        leaning: "hold the authorization fix",
      },
      {
        member: "u-compass",
        line: "Retract in writing, to the same distribution, with the wrong figure struck through rather than deleted. It costs ten unpleasant minutes and it is the entire reason anybody will believe the two findings you are keeping. Do not let the relief in that room close a thing nobody has explained.",
        leaning: "retract loudly, keep the rest",
      },
    ],
  },
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d8",
    voices: [
      {
        member: "u-compass",
        line: "File the initial inside the window with the unknowns named, and pick the update cadence yourself, because whatever rhythm you choose is the rhythm they will hold you to for the next year. And notice that the calendar is a communication: an extension request dated today reads exactly the way you would read it.",
        leaning: "file now, own the cadence",
      },
      {
        member: "u-anchor",
        line: "Our fact base moved once already today and the 340 MB is eleven hours old. Give me six hours to characterize it before anything gets a date on it. I would rather file late with a shape than early with a sentence we spend three weeks unwinding in a permanent file.",
        leaning: "characterize before you file",
      },
      {
        member: "u-keeper",
        line: "Whatever goes in, the custody arithmetic goes in with it. Legal will write the most defensible sentence available from what you hand them, and if you hand them ambiguity they will describe a full weight compromise, because that is the conservative reading of a brief that never mentions key domains.",
        leaning: "give legal the arithmetic",
      },
    ],
  },
  {
    simId: "sim-halcyon-custody",
    decisionId: "sim-hal-d9",
    voices: [
      {
        member: "u-anchor",
        line: "My team has the context and a handover at hour twenty-two costs three hours of re-explaining a night nobody else lived. Give me until 02:00 and I will have the pipeline lineage myself. I am not handing a live personal data question to somebody who has to read the whole incident from the top.",
        leaning: "we carry it through",
      },
      {
        member: "u-compass",
        line: "New species, new clock, new commander, and the awareness timestamp goes in writing at the minute counsel said it. Your original team stopped being an asset at some hour tonight and not one person in that room can tell you which one. This decision is why any of them are still here in June.",
        leaning: "fresh team, new clock",
      },
      {
        member: "u-lantern",
        line: "The whole question is whether the de-identification stage ran, and that is a pipeline job record, not a forensic image. Before anybody argues about clocks, tell me whether we even retain those records six days back — because if we do not, the answer to a regulator is going to be somebody's memory.",
        leaning: "find out if we even logged it",
      },
    ],
  },

  /* ============================================================
     SIM B — sim-cadence-trifecta
     Roles: u-forge, u-lantern, u-signal, u-oracle, u-anchor
     ============================================================ */
  {
    simId: "sim-cadence-trifecta",
    decisionId: "sim-cad-d1",
    voices: [
      {
        member: "u-oracle",
        line: "Every one of those calls is authorized, which is the finding — nothing broke. Desk holds private data, ingests untrusted content, and can talk outward, and you only have to remove one of the three. Kill the egress-capable tool class globally, this minute, and leave read and summarize running.",
        leaning: "break a leg of the trifecta",
      },
      {
        member: "u-forge",
        line: "Block the two hostnames first. Ninety seconds, zero customer impact, and I can put it back with one line. A global capability kill across twenty-three hundred tenants at 06:12 is a production change with nobody named as its rollback owner, and that is how we cause the second incident before breakfast.",
        leaning: "surgical first, reversible",
      },
      {
        member: "u-lantern",
        line: "Whatever you turn off, do not turn off the reads. The retrieval log is the only telemetry that will ever answer what left, and the detector that woke us fires on volume — which means every tenant sitting under its threshold is invisible to us right now.",
        leaning: "keep the telemetry alive",
      },
    ],
  },
  {
    simId: "sim-cadence-trifecta",
    decisionId: "sim-cad-d2",
    voices: [
      {
        member: "u-oracle",
        line: "That classifier is trained on the attacks we have already seen and faces somebody who can iterate against it for the price of an afternoon. Ninety-five percent is not a ninety-five percent reduction in anything; it is a filter with a published search procedure. Untrusted influence plus an irreversible action equals a human, out of band.",
        leaning: "structural, not statistical",
      },
      {
        member: "u-forge",
        line: "Build the taint gate as the default in the SDK and let the three accounts who genuinely cannot wait register a documented exception with an owner and an expiry date. I would rather have the paved road live for everyone in a fortnight than spend that fortnight fighting product for a mandate.",
        leaning: "ship the default, allow exceptions",
      },
      {
        member: "u-lantern",
        line: "Keep the classifier and never once call it a control. As a detection it is genuinely good — low volume, high fidelity, the first signal I have ever had for this class. As a boundary it is a rule whose failure mode I cannot write down, which means it is not finished.",
        leaning: "telemetry yes, boundary no",
      },
    ],
  },
  {
    simId: "sim-cadence-trifecta",
    decisionId: "sim-cad-d3",
    voices: [
      {
        member: "u-lantern",
        line: "We logged that a tool was called and not what it was handed, so triangulate. The retriever's document selection, the response byte arithmetic, and the attacker's own stated criteria are three independent records; where they agree you have a finding. Where they disagree, publish the disagreement — that is what makes the agreements worth anything.",
        leaning: "triangulate and publish gaps",
      },
      {
        member: "u-signal",
        line: "The durable answer is a signed receipt per tool call: issuer, document ids, timestamp, held on the tenant's side, so blast radius becomes a query instead of an investigation. I can have the schema drafted this morning, and this is the one week of the decade where somebody will fund it.",
        leaning: "build the receipt chain now",
      },
      {
        member: "u-anchor",
        line: "Legal gets three columns and no adjectives: known, believed with a confidence attached, and not determined. The seventy-two-hour clock started at 06:12 whether or not we like the shape of what we hold by then, and I would rather hand a supervisory authority an honest gap than a smooth paragraph.",
        leaning: "known, believed, unknown",
      },
    ],
  },
  {
    simId: "sim-cadence-trifecta",
    decisionId: "sim-cad-d4",
    voices: [
      {
        member: "u-forge",
        line: "Sam is the reason anyone here understands this bug class, and our own triage closed him against a ticket that does not describe the same thing. Acknowledge it publicly by date, credit him, pay retroactively at the top tier, name the triage change. Your inbound report volume for the next year is decided in the next twenty minutes.",
        leaning: "own it publicly, by name",
      },
      {
        member: "u-anchor",
        line: "This is a communications decision and I want it off my bridge — my people are minutes from the first candidate set. Hand it to comms with the facts exact and one hard rule: nobody asserts anything about the March ticket that a screenshot in his possession can falsify.",
        leaning: "delegate it, protect the bridge",
      },
      {
        member: "u-lantern",
        line: "The finding underneath this is that a contractor with a duplicate-closure quota is part of our detection stack. Injection reports get closed as duplicates because every one of them looks like the last one, and until there is an escalation path for an unfamiliar bug class this recurs no matter what we post today.",
        leaning: "the triager is the control",
      },
    ],
  },
  {
    simId: "sim-cadence-trifecta",
    decisionId: "sim-cad-d5",
    voices: [
      {
        member: "u-signal",
        line: "An allowlist entry is a claim with no issuer, no expiry and no revocation path, which is precisely why it laundered. Make every destination a tenant-registered artifact proved by a signed challenge, ship the default empty, publish a rejection list for open forwarders. Then the regulator's question has a data structure as its answer.",
        leaning: "proof of control, empty default",
      },
      {
        member: "u-oracle",
        line: "Do not spend a week rebuilding the control that just failed. The destination was never the boundary and never could be — the attacker picks it, for free, forever. Every engineer-hour that goes into registration is an hour not going into the gate that makes the class impossible.",
        leaning: "spend it on the gate instead",
      },
      {
        member: "u-forge",
        line: "Northbeam is a transitive dependency we shipped in a default and nobody ever read its forwarding behaviour. That is the review we do not do for any allowlist anywhere, and it is exactly why I want the registration list: an inventory of where customer data goes is an artifact this company has never possessed.",
        leaning: "read the dependency, keep it",
      },
    ],
  },
  {
    simId: "sim-cadence-trifecta",
    decisionId: "sim-cad-d6",
    voices: [
      {
        member: "u-oracle",
        line: "There is a provably safe subset and it has been running since 06:16 — read and summarize with no path outward. Publish the capability matrix: what is on, what is off, why each is in that state, and what has to become true to restore it. That converts an unbounded trust question into a bounded engineering commitment.",
        leaning: "publish the safe subset",
      },
      {
        member: "u-anchor",
        line: "Publish the matrix and still take Desk fully dark in the fourteen until their candidate sets close. I do not leave a live agent running inside an environment I am still imaging. Explaining that to fourteen customers is a much easier call than explaining a second movement in a tenant we already told was safe.",
        leaning: "dark in the fourteen",
      },
      {
        member: "u-forge",
        line: "If we pull it entirely the work still has to happen. Three hundred tenants stand up direct-to-model integrations inside a fortnight with none of our logging, none of our destination controls and none of the gate. Withdrawal does not remove the risk, it relocates it somewhere neither of us can see it.",
        leaning: "pulling relocates the risk",
      },
    ],
  },
  {
    simId: "sim-cadence-trifecta",
    decisionId: "sim-cad-d7",
    voices: [
      {
        member: "u-lantern",
        line: "Send the working. Candidate set, byte arithmetic, the raw retrieval extract, the methodology, and the two cases where the three signals disagree — with the disagreements in the body rather than a footnote. Her privacy office can check us, which is the entire reason they will believe us.",
        leaning: "send the working, gaps included",
      },
      {
        member: "u-signal",
        line: "Send her the determination and the evidence for her tenant, not the raw log. Those extracts carry selection metadata about documents that were never involved and, in two places, references into other tenants' shared workspaces. Minimum disclosure is not a way of hiding; it is what makes the disclosure survivable.",
        leaning: "the evidence she needs, no more",
      },
      {
        member: "u-anchor",
        line: "Whatever goes, a named engineer goes on it with a phone number, and every claim carries a confidence level. She has told us plainly she does not want reassurance. Send her a summary and she will assume ninety thousand, and she will be right to.",
        leaning: "a name and a confidence level",
      },
    ],
  },
  {
    simId: "sim-cadence-trifecta",
    decisionId: "sim-cad-d8",
    voices: [
      {
        member: "u-oracle",
        line: "It is clean against our injection corpus, and that corpus is the best one anybody has — three hundred payloads including every variant from today and the calendar path from an hour ago. Ship it tonight and publish the corpus result with it. Holding a working boundary for five days while egress stays dark is a real cost we would be paying for a feeling.",
        leaning: "the numbers are good, ship it",
      },
      {
        member: "u-lantern",
        line: "I cannot write down how this gate fails, so it is not finished. Nobody has enumerated the untrusted ingress paths — mail bodies, attachments, calendar descriptions, fetched pages, tool results, shared-document comments — and a gate with an unlisted ingress is worse than no gate, because we would be announcing it as the fix.",
        leaning: "enumerate the failures first",
      },
      {
        member: "u-anchor",
        line: "It is hour twenty and this room has been awake for all of them. I have twice run past the point where my own judgement was worth anything, and both postmortems found it. Nothing that changes a security property ships from this bridge tonight. Define the pass bar in the morning, with people who have slept.",
        leaning: "nothing ships at hour twenty",
      },
    ],
  },

  /* ============================================================
     SIM C — sim-orrery-chair
     Roles: u-compass, u-ledger, u-signal, u-oracle, u-seva, u-cartographer
     ============================================================ */
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d1",
    voices: [
      {
        member: "u-seva",
        line: "Two of the four people who wrote that sentence have left the company. Before you decide what reliably means, find out what they were afraid of when they chose the word — and then ask who in this building supplies the definition if you decline to.",
        leaning: "the question underneath",
      },
      {
        member: "u-oracle",
        line: "Three of ten on fully autonomous end-to-end exploitation against real codebases with no hinting is a serious number, and Yuki's harness is the best instrument anyone in this field has built. Treat the result as real and act on it now. Waiting for two hundred trials is waiting for a number whose shape you already have.",
        leaning: "the result is real, act on it",
      },
      {
        member: "u-ledger",
        line: "Three of ten is not a rate, it is three events. You cannot state a frequency from an n of ten and you certainly cannot carry one into a board room — the interval around that estimate contains both nothing and everything. Pre-register the trial count and the analysis before anyone runs another thing.",
        leaning: "n of ten is not a frequency",
      },
      {
        member: "u-compass",
        line: "Take the precautionary path, which is cheap, and file the undefined word as a written framework defect with a revision deadline, which is the part that compounds. A document that has no way of being told it is broken is decoration, and you are the first person here in a position to say so.",
        leaning: "precaution now, defect in writing",
      },
    ],
  },
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d2",
    voices: [
      {
        member: "u-compass",
        line: "On day nineteen you have almost no personal authority and a great deal of process authority, and confusing the two is how a first ninety days ends. Three pages to the committee, her position stated in her own words and stated better than she would state it, and one specific request. Fair process survives being on the losing side of it.",
        leaning: "borrow the framework's authority",
      },
      {
        member: "u-cartographer",
        line: "Draw this as a fault domain rather than an org chart. The Head of Model Safety reports to the person who owns the launch, so your evaluation function and your shipping function fail together by construction. And I would use the freeze authority today — a control nobody has ever seen exercised is a control the estate has already routed around.",
        leaning: "freeze it, and draw the domain",
      },
      {
        member: "u-seva",
        line: "She has been here six years and she is entirely sincere, which is the difficult part. What is she protecting that you would also protect if you had built this place from eleven people — and what does that answer tell you about how the memo should be written?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d3",
    voices: [
      {
        member: "u-compass",
        line: "One factual record, one named owner, and every external sentence routed through that person — including the S-1 language. The damage in these things is never the underlying conduct. It is the inconsistency between what you told the supervisory authority, the investigator, the market, and your own staff.",
        leaning: "one record, one owner",
      },
      {
        member: "u-signal",
        line: "A claim you would not make to both is a claim you should not be making to either. Disclose the running evaluation to both, with its status and its uncertainty attached to it, because those two files eventually sit on the same desk and the difference between them becomes the story.",
        leaning: "same claim to both",
      },
      {
        member: "u-ledger",
        line: "The supervisory relationship governs you for a decade. The civil demand is over in a year and is run by people paid to find the gap between your marketing and your reality. Flag the evaluation to the AI Office with a committed date. Answer the demand completely, in scope, and not one sentence past it.",
        leaning: "candour aimed, not sprayed",
      },
    ],
  },
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d4",
    voices: [
      {
        member: "u-oracle",
        line: "The scaffolds and the corpus construction are the recipe, not the finding. Publishing the method for eliciting a capability two days after the capability ships is a supply chain decision, and the defensive value everyone keeps citing is realizable through named parties without putting it in a public PDF.",
        leaning: "hold the scaffolds",
      },
      {
        member: "u-compass",
        line: "Whatever you decide, it needs a date, a named decider, and a written-reasons requirement to extend. Sofia will accept a bounded delay and will never accept a discretion, and the difference costs you nothing today and everything on the next result that matters.",
        leaning: "bound it with a date",
      },
      {
        member: "u-seva",
        line: "Four years here and she has never once been asked to hold a result. What does Sofia currently believe this company is — and after Friday, will she still believe it?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d5",
    voices: [
      {
        member: "u-compass",
        line: "You are six days from launch with forty-one people and a governance redesign on the table. A one-page criteria document and a named decider buys most of the legitimacy for a tenth of the effort; a five-member board with an external member is a standing meeting nobody has budget to staff. Formalize it lightly and revisit next quarter.",
        leaning: "keep it light until after launch",
      },
      {
        member: "u-signal",
        line: "It needs an issuer you do not control, written criteria, an expiry, and an appeal path, or it is not governance — it is your discretion with a form stapled to it, and this population detects the difference inside a week. The external member is the whole mechanism. Remove that and the rest is typography.",
        leaning: "an outside voice or nothing",
      },
      {
        member: "u-seva",
        line: "She said plainly that she is not asking security to have less authority. So what is she actually asking for — and why is that more expensive for you to give than the veto is for you to keep?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d6",
    voices: [
      {
        member: "u-oracle",
        line: "Your threshold is written entirely in terms of autonomy, and uplift never appears in an autonomy benchmark at all, because it accrues to operators who are already capable. Thirty-eight percent off expert time to exploit is the finding, and the framework has no language for it. That is a defect, not an argument for shipping or holding.",
        leaning: "the threshold measures the wrong thing",
      },
      {
        member: "u-ledger",
        line: "Give me until morning and I will put a loss exceedance curve on this — threat event frequency from the observed targeting, magnitude calibrated against three peer events the GC already holds. My read is that the annualized exposure sits comfortably inside an appetite this board would sign, and Marguerite is right on the arithmetic she has.",
        leaning: "the numbers support shipping",
      },
      {
        member: "u-seva",
        line: "You have already said you would make her argument if you sat in her chair. So the question is not whether she is right. It is what you would want the person in your chair to do on the day the threshold turns out to have measured the wrong thing.",
        leaning: "the question underneath",
      },
      {
        member: "u-compass",
        line: "Ship against a written safety case with named acceptance criteria and a rollback trigger that has an actual number in it, and log the threshold defect the same day. She gets her launch and you get a document that still means something in month four when the trigger fires.",
        leaning: "safety case, then ship",
      },
    ],
  },
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d7",
    voices: [
      {
        member: "u-cartographer",
        line: "Two-person control on weight movement sounds free until you are restoring a checkpoint at four in the morning across a hundred-and-thirty-thousand-accelerator estate and the second custodian is asleep in another region. I have watched that cost nine hours. Gate the next run if you must, but keep a human quorum off the restore path.",
        leaning: "do not gate the restore path",
      },
      {
        member: "u-ledger",
        line: "Industry-leading is not a claim, it is an adjective, and in a registration statement it is an adjective with a three-day-old internal memo contradicting it. Describe the actual level in RAND terms and price the uplift programme. A number attached to a launch the board already wants is the only version of this that ever gets funded.",
        leaning: "describe it, price it",
      },
      {
        member: "u-signal",
        line: "Put the gate somewhere that binds: the next frontier run does not commence without independent verification of the target level, with a named verifier and a date. A commitment with no issuer, no expiry and no way to check it is a rumour with better typography — and this one is going into an S-1.",
        leaning: "a gate with a named verifier",
      },
    ],
  },
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d8",
    voices: [
      {
        member: "u-ledger",
        line: "The dated record is the asset, and it is the only asset here you can still build prospectively. A voluntary publication timestamped ahead of her deadline narrows every adversarial theory anyone constructs for three years. I have watched one dated artifact move a settlement by an order of magnitude.",
        leaning: "the record is worth the week",
      },
      {
        member: "u-compass",
        line: "Read the bill before you sign it. Twenty-three days in, publishing an uncomfortable number three days before launch with an S-1 in drafting, you spend nearly everything you have with investor relations, the founder and at least one director. There is a version where you brief the committee, hold the artifact ready, and publish the moment she files.",
        leaning: "hold it, publish on her filing",
      },
      {
        member: "u-seva",
        line: "Eleven hundred people will learn what this company actually rewards from what happens to Yuki's team in the next four hours. What do you want them to learn — and is the thing you are about to do the thing that teaches it?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-orrery-chair",
    decisionId: "sim-orr-d9",
    voices: [
      {
        member: "u-ledger",
        line: "Frequency, vulnerability after each mitigation, magnitude calibrated against the three peer events the GC is holding. Four slides, a range spanning roughly an order of magnitude, stated honestly. Then name the two uncertainties that move the answer most and what it would cost to narrow each. Gerald will ask that; hand it to him already asked.",
        leaning: "a range and a purchase order",
      },
      {
        member: "u-cartographer",
        line: "Before you name two uncertainties, check what they share. The KYC gate's real bypass rate and the uplift transfer to lower-skill operators both resolve through the same identity vendor and the same operator panel. Those are not two estimates. That is one estimate written down twice, and the range you quote will be too narrow because of it.",
        leaning: "name what the two share",
      },
      {
        member: "u-seva",
        line: "Gerald asked for the two uncertainties that dominate. What is the one you have not written down because you have no way to measure it yet — and what follows if that one is the largest of the three?",
        leaning: "the question underneath",
      },
    ],
  },
];
