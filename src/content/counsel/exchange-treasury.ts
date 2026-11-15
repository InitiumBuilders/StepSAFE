import type { Counsel } from "../schema";

/* THE PRACTICE :: UNIT counsel for the exchange and treasury simulations.
   Your specialists advise from their own doctrine, in their own register, and they
   do not always agree. Some of them are confidently wrong in the exact way their
   own file says they will be. Weighing the advice is the skill. Obeying it is not. */

export const COUNSEL: Counsel[] = [
  /* ============================================================
     MODULE A — sim-halcyon-cold-vault-deception
     ============================================================ */
  {
    simId: "sim-halcyon-cold-vault-deception",
    decisionId: "hal-d01",
    voices: [
      {
        member: "u-anchor",
        line: "Before anyone types: Wen Li is operations lead, Priya owns the chain picture, and someone I name is writing down every action with a timestamp. Then one instruction, to four people, and it is that every signing path in this company stops before we have a theory. I do not need a theory to know that four capable people improvising in four directions is how this gets worse.",
        leaning: "kill signing, then assign names",
      },
      {
        member: "u-vault",
        line: "The vault is behaving exactly as written and it emptied, which means the compromise is upstream of the contract and I cannot yet tell you how far upstream. Nothing signs anywhere until I can — not the operations vaults, not the bridge operators, not the rotation job that runs on a cron nobody has read since deployment.",
        leaning: "revoke every signing path",
      },
      {
        member: "u-lantern",
        line: "Give me ninety seconds before you pull the automation signers down, because those jobs are the only continuous telemetry we have out of the treasury tier and the moment they stop I lose the baseline I would be comparing against. I would rather know now what the pipeline actually recorded in the last hour than discover on Monday that it recorded nothing.",
        leaning: "read the pipeline before you cut",
      },
    ],
  },
  {
    simId: "sim-halcyon-cold-vault-deception",
    decisionId: "hal-d02",
    voices: [
      {
        member: "u-anchor",
        line: "Memory first, then disk, then nobody logs in, and two people on custody so this survives a hostile reading eleven months from now. Devi does not get to do both jobs, so treasury signing is dead for two days and I will carry that conversation with Nadia myself.",
        leaning: "preserve evidence first",
      },
      {
        member: "u-lantern",
        line: "Seven disk images cost Devi two days and hand you seven haystacks. What I want inside the hour is the browser extension inventory, the exact bundle hashes those machines fetched today, and the outbound request logs, because the delivery path is where the signal is and the disks are only where it goes to be read slowly.",
        leaning: "chase the delivery path",
      },
      {
        member: "u-vault",
        line: "The laptops are a hypothesis. The transaction is a fact and it is sitting on a public chain right now with an operation byte no human in this company ever read. Whoever you can spare should be reconstructing what those four people were actually asked to approve.",
        leaning: "the answer is in the calldata",
      },
    ],
  },
  {
    simId: "sim-halcyon-cold-vault-deception",
    decisionId: "hal-d03",
    voices: [
      {
        member: "u-vault",
        line: "The hot wallet hierarchy derives from a different seed on different hardware and I have walked the derivation path myself — there is no cryptographic relationship to HAL-COLD-01. On the key material, withdrawals are safe to keep running today.",
        leaning: "hot wallets are independent",
      },
      {
        member: "u-ledger",
        line: "Then say that and nothing wider. We have not seen evidence, we have verified, and we believe are three different statements carrying three different exposures, and the second one is the one that ends up quoted in the MAS submission. Pause, give a reason narrow enough to be true, and name the hour of the next update.",
        leaning: "pause, and narrow the claim",
      },
      {
        member: "u-compass",
        line: "Whatever you choose, Nadia needs one sentence she can repeat identically to the desk, to the market makers and to the regulator, plus a named time for the next one. A pause with a checkpoint is a bounded event. A pause without one is a countdown the market gets to time for you.",
        leaning: "bound it with a checkpoint",
      },
    ],
  },
  {
    simId: "sim-halcyon-cold-vault-deception",
    decisionId: "hal-d04",
    voices: [
      {
        member: "u-anchor",
        line: "Marcus is the most useful witness I have. He is the only person who has described the screen at the instant it lied to him, and he described it before he knew anyone considered him a suspect. Suspend him and every account I need after this arrives filtered through fear and a lawyer.",
        leaning: "he is a witness, not a suspect",
      },
      {
        member: "u-signal",
        line: "Three facts assembled after the event by the person under the most pressure is a narrative with a timestamp, not evidence. A recruiter call, an unusual hour, a signature — none of them carry an issuer, none of them have an expiry, and nobody in that room has been asked what would falsify the theory.",
        leaning: "the claim has no issuer",
      },
      {
        member: "u-compass",
        line: "Refuse it, and do not refuse it alone in a corridor. Ten minutes, in writing, to Nadia with your reasoning and with the sentence Anselm can repeat to his own team without losing face. Otherwise you win this argument and lose the executive you need for the next fortnight.",
        leaning: "refuse upward, in writing",
      },
    ],
  },
  {
    simId: "sim-halcyon-cold-vault-deception",
    decisionId: "hal-d05",
    voices: [
      {
        member: "u-ledger",
        line: "Give the wire a distribution rather than a point. I can have a coverage-ratio simulation across the reserve composition and the facility drawdown inside ninety minutes, and a range with a stated confidence interval is more honest than a single figure we quietly reconcile in thirty days.",
        leaning: "publish the range, not a point",
      },
      {
        member: "u-compass",
        line: "In forty minutes she needs three numbers she can say out loud without a footnote and one date. The proof of reserves is the only item on this list a stranger can check without trusting us, so the date on it matters more than every adjective in the statement combined.",
        leaning: "arithmetic and a dated proof",
      },
      {
        member: "u-signal",
        line: "Publish it as a claim with an issuer and a method: who attested, over what snapshot, and how a customer verifies their own leaf. And correct the emergency raise line specifically, because an uncorrected specific always outlives a general reassurance.",
        leaning: "make it checkable by a stranger",
      },
    ],
  },
  {
    simId: "sim-halcyon-cold-vault-deception",
    decisionId: "hal-d06",
    voices: [
      {
        member: "u-vault",
        line: "Assets sitting behind a contract nobody can currently sign for are not accruing risk. Assets moving tonight through a toolchain I have not exonerated are the same bet we lost at lunchtime, with more zeroes on it and two signers awake at three in the morning.",
        leaning: "nothing moves",
      },
      {
        member: "u-anchor",
        line: "If it goes tonight, I run it. I have the whole picture, I have been on this since minute six, and I am not handing a movement of this size to someone who has to be briefed into it first.",
        leaning: "I will hold it through the night",
      },
      {
        member: "u-ledger",
        line: "Price both directions before you answer him. A missed Monday open costs us spread and some embarrassment. A second movement through the same rendering layer costs us the remaining balance and the last of our credibility. Rafael has written down neither number, which is how I know the plan is energy rather than analysis.",
        leaning: "price the open against the estate",
      },
    ],
  },
  {
    simId: "sim-halcyon-cold-vault-deception",
    decisionId: "hal-d07",
    voices: [
      {
        member: "u-lantern",
        line: "A bundle hash and an activation condition is a detection two hundred security teams can deploy before dinner. Send the indicator now with the observation and nothing else attached — no theory, no fault, just what we saw and exactly how another team looks for it in their own cache.",
        leaning: "ship the indicator now",
      },
      {
        member: "u-signal",
        line: "The observation and the attribution travel at different speeds and that is not a technicality. We can prove the bundle came from their domain and matches no release they have ever shipped. We cannot yet say which of their systems produced it, and if we say it anyway we have handed them a correction to win in public.",
        leaning: "observation fast, fault slow",
      },
      {
        member: "u-ledger",
        line: "Ingrid reads it before it leaves the building — not to slow it to a day, but because the sentence we publish tonight has to survive an insurance claim, a MAS submission and whatever proceeding follows a 1.44 billion dollar loss. Fifteen minutes of legal review is cheap against a document that permanent.",
        leaning: "counsel reads it first",
      },
    ],
  },
  {
    simId: "sim-halcyon-cold-vault-deception",
    decisionId: "hal-d08",
    voices: [
      {
        member: "u-vault",
        line: "The simulator and the hardware wallet both consumed whatever the page handed them, which makes them one check wearing two costumes. Fund a second path to the same truth: raw calldata decoded on a separate device, the operation byte read out loud by a human, and delegatecall treated as break-glass with a named second approver.",
        leaning: "independent path, not more signers",
      },
      {
        member: "u-compass",
        line: "Camille funds what she can defend to the other six seats, and independent hash verification does not fit on a slide the way six-of-eleven does. Lead with the signer increase, carry the verification work underneath it as implementation detail, and you will get both.",
        leaning: "sell what fits on one slide",
      },
      {
        member: "u-ledger",
        line: "Then give her the arithmetic that makes the narrow answer the fundable one: percentage of treasury transactions with independent verification, time to verify, exception count per quarter. A control she can watch a number move on survives three budget cycles. A control described as better hygiene does not survive one.",
        leaning: "make the narrow answer measurable",
      },
    ],
  },

  /* ============================================================
     MODULE B — sim-verity-governance-capture
     ============================================================ */
  {
    simId: "sim-verity-governance-capture",
    decisionId: "ver-d01",
    voices: [
      {
        member: "u-anchor",
        line: "Nobody posts anything until I know who is decompiling, who is watching the vote, who is assembling the council and who is writing it down. Forty minutes in with one engineer awake is not an incident response, it is Tomas and a hunch, and the forum will read it as exactly that.",
        leaning: "assemble before you speak",
      },
      {
        member: "u-cartographer",
        line: "Put a watcher on getVotes at the vote-escrow contract before anything else happens. The figure in the governance dashboard is a rendering; the chain is the only witness this system has, and I do not trust any voting-power number we have not recomputed from it in the last ten minutes.",
        leaning: "recompute the power from chain",
      },
      {
        member: "u-signal",
        line: "The term sheet, the legal opinion and the one-pager are all claims with no issuer anyone has checked, attached to an address funded four days ago whose voting power was bought in the same block as the proposal. I would spend an hour establishing whether that T-bill issuer has ever heard the name vrt-steward.",
        leaning: "check who vouched for this",
      },
    ],
  },
  {
    simId: "sim-verity-governance-capture",
    decisionId: "ver-d02",
    voices: [
      {
        member: "u-signal",
        line: "Aurelio made a narrow true claim and the forum heard a broad one. He verified that the calldata decodes, which says nothing whatsoever about the bytecode at the delegatecall target. Post the trace in his own thread and name the gap as a gap in the method, so the correction belongs to the method rather than to the man.",
        leaning: "publish the artefact, name the gap",
      },
      {
        member: "u-ledger",
        line: "Message him first. He is the only external reviewer we have who answers on a Saturday, and his retraction is worth more than our post — that relationship sits on our third-party register as a real asset, and a public contradiction is how it gets written down to zero.",
        leaning: "correct him privately first",
      },
      {
        member: "u-compass",
        line: "Whatever you write has to let the two delegates who endorsed this publicly change their minds without looking foolish, because they are the votes you need in six hours. Evidence gives them an exit. Being right at them does not.",
        leaning: "give the endorsers an exit",
      },
    ],
  },
  {
    simId: "sim-verity-governance-capture",
    decisionId: "ver-d03",
    voices: [
      {
        member: "u-cartographer",
        line: "The pause stops the liquidation engine, and a lending market that cannot liquidate accrues bad debt every hour the price moves, with no ceiling on it, on a weekend. They have held four hours without executing. Keep the market alive and put every eye we have on the mempool for the moment they do.",
        leaning: "do not freeze the market",
      },
      {
        member: "u-anchor",
        line: "The pause and the explanation go out in the same minute or they are two events and the second one reads as a cover-up. I want the bad-debt exposure per hour published by us before anyone else calculates it, and the unpause criteria written down before the button is pressed.",
        leaning: "pause and narrate together",
      },
      {
        member: "u-ledger",
        line: "A million and a half of bad debt over a weekend against a hundred and eighteen million of treasury and seven hundred and forty of collateral is not a close call, and it stops feeling close the moment you write it as a frequency and a magnitude instead of as two competing anxieties.",
        leaning: "the arithmetic is not close",
      },
    ],
  },
  {
    simId: "sim-verity-governance-capture",
    decisionId: "ver-d04",
    voices: [
      {
        member: "u-signal",
        line: "Authority with no expiry and no revocation path is precisely what we tell everyone else never to trust. Put the pause to a binding ratification vote inside twenty-four hours and build the auto-expiry in, because a power that lapses unless renewed is describable as delegated and a power that simply persists is not.",
        leaning: "give the power an expiry",
      },
      {
        member: "u-compass",
        line: "Do not open the decentralisation argument while the protocol is still paused and the patch is unwritten. Publish the decision record, ship the fix, and hold the governance conversation on Monday when the people writing it have slept and we have something concrete to point at.",
        leaning: "not during the incident",
      },
      {
        member: "u-oracle",
        line: "The only question any forum will care about, legal or otherwise, is on whose authority the pause executed and whether that authority was still valid at the moment it was exercised rather than at the moment it was granted. Publish the delegation chain. The philosophy can wait for people who enjoy it.",
        leaning: "publish the delegation chain",
      },
    ],
  },
  {
    simId: "sim-verity-governance-capture",
    decisionId: "ver-d05",
    voices: [
      {
        member: "u-anchor",
        line: "The pause is holding the line, which means the patch has no reason to be fast, only a reason to be right. Tomas has been awake nineteen hours and he is not writing the contract that owns everything. Rotate in two people who have slept and put him on review tomorrow.",
        leaning: "the pause is holding; slow down",
      },
      {
        member: "u-oracle",
        line: "The governance test suite covers every path in the Governor and it has caught two real regressions this year. If the patch passes it and passes the fork rehearsal, thirty minutes is enough. Waiting sixty hours to ship a change we can evaluate in twenty minutes is not caution, it is cost with a virtue attached.",
        leaning: "the suite will catch it",
      },
      {
        member: "u-cartographer",
        line: "Rehearse it on a fork with the real council multisig and the real signers, at the hour those signers will actually be awake. Every rehearsal any of us has ever run silently supplied a dependency the real one did not have, and this patch touches the mechanism that controls the entire protocol.",
        leaning: "rehearse with the real signers",
      },
    ],
  },
  {
    simId: "sim-verity-governance-capture",
    decisionId: "ver-d06",
    voices: [
      {
        member: "u-compass",
        line: "Publish the commit, the single reviewer, the date, and the sentence that governance parameters were never on any security checklist. The exchange is drafting a listing decision from public sources on Monday, and a process gap with a dated fix attached is a decision they can defend. A denial is not.",
        leaning: "publish the record and the fix",
      },
      {
        member: "u-ledger",
        line: "Give the exchange a technical annex privately and keep the public post narrow. A written admission of a control gap does not stay in a forum; it becomes an exhibit, and we are a foundation with contributors in fourteen jurisdictions and nothing standing behind any of them.",
        leaning: "annex privately, post narrowly",
      },
      {
        member: "u-signal",
        line: "Answer it as a record rather than as a rebuttal. The screenshot is a genuine artefact carrying a false inference, and the only thing that displaces it is a fuller artefact with the same property of being checkable by anyone. Nobody in the history of this industry has ever displaced a screenshot with a denial.",
        leaning: "displace it with the record",
      },
    ],
  },
  {
    simId: "sim-verity-governance-capture",
    decisionId: "ver-d07",
    voices: [
      {
        member: "u-cartographer",
        line: "Write the exercise requirement in — annually, against a scripted scenario, with the council actually signing. The sharpest failure of that weekend was not the flash loan, it was forty minutes spent reaching for a cancel authority that never applied to the execution path in play. Powers nobody exercises decay quietly into beliefs about powers.",
        leaning: "constrain it and rehearse it",
      },
      {
        member: "u-ledger",
        line: "I can price both directions before the vote opens: expected cost of a false-positive pause against expected value of a true one, taking this weekend as one observation and the two earlier emergency uses as two more. On those inputs the standing mandate carries comfortably, and I would rather the DAO decided on a number than on a mood.",
        leaning: "the numbers favour the mandate",
      },
      {
        member: "u-oracle",
        line: "Narrow it to named modules with a hard expiry and a mandatory ratification step. Every irreversible action belongs behind a human with enough context to genuinely refuse it, and a guardian holding a standing mandate with no ratification is a human who has been structurally relieved of ever being refused.",
        leaning: "narrow scope, hard expiry",
      },
    ],
  },

  /* ============================================================
     MODULE C — sim-bellwether-insider-extortion
     ============================================================ */
  {
    simId: "sim-bellwether-insider-extortion",
    decisionId: "bwd-d01",
    voices: [
      {
        member: "u-lantern",
        line: "The only thing genuinely on a clock is our own retention. Those reporting-console queries are logged and have never been alerted on, which means they expire on a schedule nobody has looked at since it was configured. Freeze twenty-four months of them somewhere the support organisation cannot reach, before you validate a single record.",
        leaning: "beat the retention window",
      },
      {
        member: "u-anchor",
        line: "Validate against the snapshot, not production, and it happens on my authority with one named person running it and one named person recording what they touched. If the source is inside the building, every query we run is a message to them about what we know and when we started knowing it.",
        leaning: "quietly, and named hands only",
      },
      {
        member: "u-keeper",
        line: "Before any log leaves the platform I want an export path with two custodians, hashes recorded at the point of capture, and an independent witness on the transfer. If this ends in front of a court, an artefact whose chain nobody can attest to is a story we tell about evidence rather than evidence.",
        leaning: "custody before collection",
      },
    ],
  },
  {
    simId: "sim-bellwether-insider-extortion",
    decisionId: "bwd-d02",
    voices: [
      {
        member: "u-keeper",
        line: "The bulk export path is a capability one person can use alone, at volume, and its legitimate use is rare. Take the capability away from everyone today — that is a ninety-minute change — and leave the ticket path untouched. You do not have to be right about any individual to be right about the path.",
        leaning: "cut the capability, not the people",
      },
      {
        member: "u-oracle",
        line: "Twelve of the thirty-four sit beyond four standard deviations on lookups per resolved ticket across five months of history. That is not a hunch, it is a model with a population behind it, and I would act on those twelve today rather than wait for a confession.",
        leaning: "the model is confident enough",
      },
      {
        member: "u-anchor",
        line: "Warren gets the shape of it fifteen minutes before it lands, and he gets it from me. Forty thousand abandoned calls a day includes people trying to freeze accounts during a live takeover, and a containment measure that produces its own victims is one I have to defend in the same document as the breach.",
        leaning: "harm caused counts too",
      },
    ],
  },
  {
    simId: "sim-bellwether-insider-extortion",
    decisionId: "bwd-d03",
    voices: [
      {
        member: "u-compass",
        line: "Delphine does not need a number, she needs an input she can build a determination on: confirmed floor, the channel that is unmeasured, the date you will be defensible, and a planning assumption labelled as an assumption. Put it in writing in that shape, because anything you say aloud is a settled fact by Thursday.",
        leaning: "hand over a structure",
      },
      {
        member: "u-lantern",
        line: "Twelve thousand is what one console can see, and the console with no rule on it is the one I cannot bound at all. Those reporting queries were never alerted on because they looked exactly like the documented legitimate use, and I will not estimate the size of something I have never had coverage over.",
        leaning: "no number until it is measured",
      },
      {
        member: "u-signal",
        line: "Move the determination off the count and onto the character of the data. Government ID images, financial account identifiers and balances to the cent are a class of claim about a person, and that class is material at twelve thousand and at seventy thousand alike. The count is the single input we are least able to attest today.",
        leaning: "materiality on character",
      },
    ],
  },
  {
    simId: "sim-bellwether-insider-extortion",
    decisionId: "bwd-d04",
    voices: [
      {
        member: "u-anchor",
        line: "Split the sentence. No funds were moved by the unauthorised access is a claim tied to a named system that we can hold forever. No customer funds were taken is a claim about the whole world and we lose it inside a week. State confidence per system, and state by when it will be higher.",
        leaning: "confidence per named system",
      },
      {
        member: "u-compass",
        line: "Name the vendor. Four thousand of our own people currently believe they are under suspicion, the board wants an actor rather than a console, and a story with a name in it is a story this organisation can actually carry. Without one, every internal channel writes its own version by Friday and we spend a month chasing them.",
        leaning: "the story needs an actor",
      },
      {
        member: "u-signal",
        line: "A warning with no safe action attached is just fear distributed at scale. Ship the verified callback protocol in the same statement — a number the customer dials back on, a check that does not rest on a frightened person judging whether a voice sounds legitimate at nine at night.",
        leaning: "give them a verifiable path",
      },
    ],
  },
  {
    simId: "sim-bellwether-insider-extortion",
    decisionId: "bwd-d05",
    voices: [
      {
        member: "u-keeper",
        line: "You cannot recall a copy. This is the same arithmetic as a leaked key: once it exists somewhere else, the only honest move is to rotate everything downstream and absorb the exposure. A promise of deletion from the person holding the copy is not a control, it is a twenty million dollar receipt.",
        leaning: "a copy is not recallable",
      },
      {
        member: "u-lantern",
        line: "Keep the channel open through a negotiator anyway. Eleven days of contact is eleven days of infrastructure, wallet clustering and idiolect I can pivot on, and attribution is currently the only lead we have that is not five months cold.",
        leaning: "the channel is a source",
      },
      {
        member: "u-compass",
        line: "Refuse it in one sentence the committee can repeat verbatim, and put money somewhere visible in the same breath — outbound warning calls, the callback protocol, the make-whole commitment, a bounty. A refusal with nothing attached reads to a board as stubbornness and to a regulator as inaction.",
        leaning: "refuse with a funded action",
      },
    ],
  },
  {
    simId: "sim-bellwether-insider-extortion",
    decisionId: "bwd-d06",
    voices: [
      {
        member: "u-keeper",
        line: "Dual control on any unmasked government ID, and I want the second approver sitting at a different vendor from the requester, so the two of them cannot be recruited through the same Telegram channel. Split knowledge is not two people. It is two people who cannot be bought by one buyer.",
        leaning: "dual control across vendors",
      },
      {
        member: "u-lantern",
        line: "Friction that agents cannot work with gets routed around by good people at four in the morning, and then we are blind again with a policy document for comfort. Spend the cheap money on honeytokens in every store where authorised bulk read is possible, and kill the behavioural analytics line — four hundred alerts a week against people doing their job is how a queue dies.",
        leaning: "tripwires over friction",
      },
      {
        member: "u-oracle",
        line: "Scope the grant to the ticket rather than to the person. Unmasking should exist for one customer, for the life of one open ticket, and expire with it. Standing access to a population is an action space, and every entry in it is something somebody can be paid fifteen thousand dollars to do on your behalf.",
        leaning: "scope the grant to the ticket",
      },
    ],
  },
  {
    simId: "sim-bellwether-insider-extortion",
    decisionId: "bwd-d07",
    voices: [
      {
        member: "u-compass",
        line: "Write it in the first person with a date and an owner against every remediation line. Supervisors are not looking for a firm with no gaps, they are looking for a firm that can find its own, and naming the tradeoff that produced this one — handle-time targets — is the sentence that makes everything after it credible.",
        leaning: "plain gap, dated remediation",
      },
      {
        member: "u-anchor",
        line: "Let Delphine hold the pen and you write the technical annex underneath it. Twenty-three days in, on a document that sits in the supervisory record permanently, I do not want the draft written by the person who has been carrying this since Tuesday morning.",
        leaning: "counsel holds the pen",
      },
      {
        member: "u-signal",
        line: "Write only what you will still stand behind at the next examination, because that is the property this document actually needs — it is a claim with our name on it and no expiry date. Mean time to detect was twenty-two weeks. Say the number, because the examiner can already compute it from what we filed.",
        leaning: "write what survives re-reading",
      },
    ],
  },
];
