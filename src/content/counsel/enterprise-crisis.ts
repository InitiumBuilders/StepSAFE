import type { Counsel } from "../schema";

/* THE PRACTICE :: UNIT COUNSEL — LARGE ENTERPRISE CRISIS COMMAND
   Your specialists speak inside the decision. They advise from their own doctrine,
   in their own register, and they do not always agree. Some of them are wrong in
   the exact way their file says they are wrong. Weighing counsel is the skill;
   obedience is not. Seva never answers. Seva asks. */

export const COUNSEL: Counsel[] = [
  /* ---------------------------------------------------------------- */
  /* A — sim-idp-root-burn :: Halverd Retail Group                     */
  /* ---------------------------------------------------------------- */
  {
    simId: "sim-idp-root-burn",
    decisionId: "sim-idp-root-burn-d1",
    voices: [
      {
        member: "u-anchor",
        line: "Before you touch the token I want three names on this bridge: who is operations lead, who owns communications, who is writing the timeline. Then nothing changes in the Okta admin plane without coming through one of them. Rana is asking you for permission to pull threads, and what she actually needs is a role.",
        leaning: "declare and freeze, evict later",
      },
      {
        member: "u-lantern",
        line: "Ask what the System Log retention is before you ask what the adversary did. If it is ninety days rolling and nobody has exported it to something write-once, the evidence for this entire incident is aging out while we discuss it. I would rather have a preserved log set and no theory than a theory and no logs.",
        leaning: "preserve before you interpret",
      },
      {
        member: "u-compass",
        line: "Declaring freezes administrative change across 940 applications in the week that carries 31 percent of the operating profit, and you will not be permitted to un-declare it quietly. That may well be the right purchase. Say out loud what you are buying with it, because the CIO will ask you at 06:00 and you should not be composing the answer then.",
        leaning: "price the declaration first",
      },
      {
        member: "u-seva",
        line: "Three accounts, one token, one strange ASN. What would have to be true for three accounts to be the whole of it — and have you checked whether it is true, or only noticed that nothing yet contradicts it?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-idp-root-burn",
    decisionId: "sim-idp-root-burn-d2",
    voices: [
      {
        member: "u-lantern",
        line: "That object produces authentications I cannot separate from the Brightwell tenant, and the UEBA service just told you the same thing in writing. Leaving it live means every sign-in in this environment carries an asterisk nobody can resolve. Kill it and give me back a baseline I can actually detect against.",
        leaning: "delete it, buy back the signal",
      },
      {
        member: "u-keeper",
        line: "Capture the entity ID, the ACS URL, the signing certificate thumbprint and the creation audit event before anything touches it. An object you delete before documenting it is a key destroyed without a record of who held it, and no ceremony log means no evidence anybody will accept later.",
        leaning: "capture before you cut",
      },
      {
        member: "u-signal",
        line: "That IdP is an issuer nobody in this company authorised, and its thumbprint is the one artefact here that can be matched against somebody else's intrusion. Every assertion it has ever made is a claim with a provenance. Write them down before you decide its fate.",
        leaning: "the issuer is the evidence",
      },
      {
        member: "u-anchor",
        line: "If we watch it, the trigger goes in writing before we leave this call. Three named people who can disable it without asking me, the exact condition that makes them do it, and a phone that is answered at 03:00. Observation without a stop condition is not a decision, it is a hope with a monitoring dashboard.",
        leaning: "watch only with a written trigger",
      },
    ],
  },
  {
    simId: "sim-idp-root-burn",
    decisionId: "sim-idp-root-burn-d3",
    voices: [
      {
        member: "u-compass",
        line: "Marguerite is not obstructing you, she is asking for a number and a duration, and she has given you twenty-two minutes to produce both. Bring the staffing plan and the review cadence in the same breath as the restriction. If you hand her a restriction without a rota, you get it for four days and never get anything from her again.",
        leaning: "bring the plan, not just the ask",
      },
      {
        member: "u-lantern",
        line: "Three tickets out of 640 overnight is a base rate, not yet a pattern, and closing the desk closes the one channel where I can watch them try again. Put real-time alerting on every privileged reset and leave it armed. A vector you can observe is worth more than a vector you have blinded yourself to.",
        leaning: "leave it armed and watch it",
      },
      {
        member: "u-anchor",
        line: "Whatever you take away, you own the replacement path before the stores open. A manager in Boise locked out of a supervisor override at 06:00 will find a route back in, and the route she finds will be a shared credential in a messaging app you cannot see or revoke.",
        leaning: "no restriction without a path",
      },
      {
        member: "u-seva",
        line: "You are about to ask an executive to spend real revenue on your judgement. Would you make the same recommendation if the quarter did not exist? And if the answer is no, which of the two versions is the one you actually believe?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-idp-root-burn",
    decisionId: "sim-idp-root-burn-d4",
    voices: [
      {
        member: "u-keeper",
        line: "Rotation is a ceremony, not a button. If you cannot name every holder of every credential on that list — app registrations, SCIM secrets, delegated admin grants, service-account certificates — then you are not rotating, you are refreshing the ones you happen to remember, and calling the change record complete.",
        leaning: "one list, one cutover",
      },
      {
        member: "u-lantern",
        line: "There is a case for rotating the three known accounts right now and watching what changes. Adversary behaviour immediately after a partial rotation is the highest-fidelity telemetry you will get all day, and it costs you three accounts they have already finished using. I would take that trade to find out whether they have a second path.",
        leaning: "make them move, then read it",
      },
      {
        member: "u-anchor",
        line: "Callum is offering execution and asking you for command, and those are different things. The answer is not no, it is not yet — and it is worthless unless you give him the hour you will say yes. A ready team held without a time turns into a resentful team in about ninety minutes.",
        leaning: "not yet, and name the hour",
      },
    ],
  },
  {
    simId: "sim-idp-root-burn",
    decisionId: "sim-idp-root-burn-d5",
    voices: [
      {
        member: "u-keeper",
        line: "A signing key you cannot prove you control is not a key you are entitled to keep using. That farm goes dark tonight and Finance authenticates locally until the migration lands. Everything else on the table is a scheme for continuing to operate a trust anchor while conceding that somebody else may hold it.",
        leaning: "take the farm down tonight",
      },
      {
        member: "u-lantern",
        line: "Understand what you are asking me to detect if the farm stays up. A forged assertion is correctly signed by the correct issuer with correct claims. The only tell is an assertion with no preceding authentication event, and I am not confident that field comes out of this farm reliably. Do not write a detection into a decision as if it were a control.",
        leaning: "do not ask detection to cover this",
      },
      {
        member: "u-compass",
        line: "That farm exists because Finance won an argument in 2021 and nobody reopened it. You will not get another week where a board is paying attention to AD FS. Attach a named owner and a dated decommissioning to whatever you do tonight, because the window where architectural debt is cheap to retire closes in about six weeks.",
        leaning: "use the incident to kill the farm",
      },
      {
        member: "u-seva",
        line: "Somebody disabled certificate rollover in 2021 and somebody approved it. Who in this company would have had to say no — and does that person, or that role, still exist today?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-idp-root-burn",
    decisionId: "sim-idp-root-burn-d6",
    voices: [
      {
        member: "u-signal",
        line: "You do not have to choose between certifying and rebuilding. Enumerate every surviving trust as a claim with a named issuer, an expiry and a revocation path, and anything that cannot produce one gets cut at the cutover. That makes the tenant certifiable by construction rather than by assertion, and it is buildable before T plus eleven.",
        leaning: "certify by attestation, stay in place",
      },
      {
        member: "u-keeper",
        line: "Rebuild the administrative plane and nothing else. A few hundred identities, hardware keys issued in person, break-glass in an envelope somebody signs for, zero standing privilege. The user plane is 68,000 people and re-enrolling them this week makes you the outage rather than the response.",
        leaning: "burn the admin plane only",
      },
      {
        member: "u-compass",
        line: "Whichever way you go, write the conditions that would make you escalate to a full rebuild, and write them today while you are still frightened. In January that page is the difference between a board hearing a decision and a board hearing a rationalisation.",
        leaning: "write what would change your mind",
      },
      {
        member: "u-seva",
        line: "Anwar says he has no opinion and you do. What is the belief sitting underneath yours — that this tenant can be cleaned, or that you cannot afford for it to be dirty? Those two lead to different plans and only one of them is about evidence.",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-idp-root-burn",
    decisionId: "sim-idp-root-burn-d7",
    voices: [
      {
        member: "u-compass",
        line: "Compliance is the only metric here. At 71 percent re-enrolment your cutover evicts nobody and you have spent the disruption for nothing. Write the message that makes 68,000 tired people act on a Tuesday, and accept that it will be outside the building in forty minutes, because it will.",
        leaning: "write for compliance, not comfort",
      },
      {
        member: "u-signal",
        line: "Give each audience the minimum that lets them act. A store colleague needs an instruction and a deadline. The word incident is a claim, and a claim made to 68,000 people is a claim made to the press, to the plaintiffs bar and to a regulator who has not yet been told anything. Disclose function, not category.",
        leaning: "minimum that lets them act",
      },
      {
        member: "u-lantern",
        line: "Whatever you send becomes a pretext by Thursday. Somebody will call the desk opening with a reference to the security thing their manager mentioned, and that phrasing needs to be a detection before the message ships, not after the first successful vish.",
        leaning: "instrument the message",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* B — sim-ransom-clearinghouse :: Verrant Health Solutions          */
  /* ---------------------------------------------------------------- */
  {
    simId: "sim-ransom-clearinghouse",
    decisionId: "sim-ransom-clearinghouse-d1",
    voices: [
      {
        member: "u-anchor",
        line: "Containment and continuity are one order with two owners, and neither of them is me because I am running the bridge. Before anything is severed I want a named person on the downtime path with a publish time, because if the business has no route it will build one and you will lose containment by 09:00 anyway.",
        leaning: "one order, two owners",
      },
      {
        member: "u-vault",
        line: "Ask which side of this is irreversible. A severed switch reconnects on Tuesday. An eligibility answer served out of a routing configuration the adversary could write is a dispensing decision at a pharmacy counter, and there is no abort path on that one. You never keep a signing path live because the interface still looks fine.",
        leaning: "the served answer is irreversible",
      },
      {
        member: "u-lantern",
        line: "You do not know the routing path is clean. You know you have never instrumented the configuration store, which is a different statement wearing the same clothes. Absence of evidence from a place you never recorded is not evidence, and I will not let it be minuted as one.",
        leaning: "cut, you cannot certify it",
      },
      {
        member: "u-ledger",
        line: "Understand that severing is also a harm with a frequency of one and a magnitude nobody in this building has bounded. 61,000 provider organisations falling to a manual procedure most have never run is a real event with real patients in it. You are not choosing between harm and safety, you are choosing which harm you author.",
        leaning: "you are choosing a harm either way",
      },
    ],
  },
  {
    simId: "sim-ransom-clearinghouse",
    decisionId: "sim-ransom-clearinghouse-d2",
    voices: [
      {
        member: "u-ledger",
        line: "Give Gideon a distribution rather than a promise. Historical restore throughput on that appliance, three tiers, a 50th and a 90th percentile with the assumptions written on the face of it. That is a number you can defend line by line to a syndicate, and refusing to produce one reads as an absence of method rather than as rigour.",
        leaning: "give him a modelled range",
      },
      {
        member: "u-vault",
        line: "Duy is reading a console, and a console is an interface. Bybit lost roughly 1.5 billion dollars because signers approved what an interface showed them rather than what the object actually was. Restore one tier-one system into a room that cannot reach production, with a stopwatch and a second pair of eyes, and then we can discuss hours.",
        leaning: "the console is not the restore",
      },
      {
        member: "u-anchor",
        line: "I will give the chair a time instead of a number. Clean-room restore result at 12:00, recovery estimate at 13:00, and I will hit both or tell him at 11:30 that I will not. I do not know yet, and here is when I will, is a complete sentence and it survives being repeated to bankers.",
        leaning: "commit to a time, not a number",
      },
      {
        member: "u-compass",
        line: "He is not asking you for truth, he is asking for something he can say to the syndicate before Asia opens. If you give him nothing, he will construct something himself and it will be worse and it will be attributed to you. Hand him a commitment that is safe to repeat.",
        leaning: "give him something repeatable",
      },
    ],
  },
  {
    simId: "sim-ransom-clearinghouse",
    decisionId: "sim-ransom-clearinghouse-d3",
    voices: [
      {
        member: "u-vault",
        line: "This is the only action on the table today that has no abort path. Once that transaction confirms there is no time lock, no pause, no second signature and no reversal — and the person who authorises it will almost certainly not be the person who understood the counterparty analysis. Slow the thing that cannot be undone.",
        leaning: "irreversible, so it goes slowest",
      },
      {
        member: "u-ledger",
        line: "Then cost the alternative properly, because a refusal without a priced reconstruct path is not analysis, it is a preference. Ninety million of unreconstructable revenue is an assumption somebody said out loud once. Find out how much of those forty-one days sits in payer-side transaction records before that figure hardens into a fact.",
        leaning: "cost the alternative first",
      },
      {
        member: "u-signal",
        line: "Renata issued her claim honestly, with a confidence, which is more than most attribution ever carries. Record it that way. A self-initiated report to the Bureau with the confidence attached is a document you can produce years from now; a vendor screening a wallet against the SDN list is a document that proves you looked in the one place designated entities never appear.",
        leaning: "build the record, then decide",
      },
      {
        member: "u-compass",
        line: "The decision is the board's with counsel, and a 36-hour hold owned by security is you taking it. Put it in front of them today with the record still being built in parallel — because a hold that produces nothing but your objections is how the real conversation happens at 22:00 in a room you were not invited to.",
        leaning: "route it, do not hold it",
      },
    ],
  },
  {
    simId: "sim-ransom-clearinghouse",
    decisionId: "sim-ransom-clearinghouse-d4",
    voices: [
      {
        member: "u-signal",
        line: "File on the clock with a confidence attached to every number in it. A claim that carries its own uncertainty can be revised without ceremony; a claim asserted flat has to be retracted, and a supervisory authority reads those two events very differently. List the open questions by name and commit to a phase two date.",
        leaning: "phased, with confidence markers",
      },
      {
        member: "u-ledger",
        line: "Your facts have moved twice in thirteen hours and both moves went against you. Assume a third. Whatever you put in the filing, put in the version you would still defend if the next correction is as large as the last two, because a notification amended three times reads as an organisation with no understanding at all.",
        leaning: "assume a third reversal",
      },
      {
        member: "u-anchor",
        line: "I will tell you which facts are stable and put my name on the split. Egress volume is stable. Record counts are not, and neither is the date range. Nobody files a record count out of my bridge today, and I will say that to the DPC myself if it helps.",
        leaning: "file only the stable facts",
      },
      {
        member: "u-compass",
        line: "The Commission has already contacted you. From that message onward you are not disclosing, you are confirming, and the posture difference is worth more than any precision you buy by waiting. Every hour past this point is spent, not saved.",
        leaning: "file before you are confirming",
      },
    ],
  },
  {
    simId: "sim-ransom-clearinghouse",
    decisionId: "sim-ransom-clearinghouse-d5",
    voices: [
      {
        member: "u-anchor",
        line: "Rotate the analysts tonight, formal shifts, written handover at every boundary. I will hold the command seat through the restore — the handover cost on command is higher than anywhere else in this response and there is nobody in the building carrying the whole picture. Rotate the room. The chair can wait until the restore is stable.",
        leaning: "rotate the room, not the chair",
      },
      {
        member: "u-compass",
        line: "You are staffing a five-week incident out of nine people, and the rota you write at 01:30 is the one you will still be running in week four. Build it for the real duration now, from the wider organisation and the retainer, or you will rebuild it in week two out of whoever has not yet resigned.",
        leaning: "staff for five weeks tonight",
      },
      {
        member: "u-ledger",
        line: "Two-person integrity on every destructive action and everything touching the clean room, effective immediately. Your change process was calibrated against a normal error frequency and you are not operating at one. The clean room is a single point of failure with exactly one control on it, and that control is a tired person.",
        leaning: "two-person rule on destructive acts",
      },
      {
        member: "u-seva",
        line: "Duy has not left the building because he believes the forty-one days belong to him. If he is still carrying that in week three, what does this response lose — and is that a cost you have written down anywhere?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-ransom-clearinghouse",
    decisionId: "sim-ransom-clearinghouse-d6",
    voices: [
      {
        member: "u-signal",
        line: "Each of those 480 covered entities holds a 60-day clock that does not start until you speak. Every hour you hold is an hour spent out of their budget without asking them, and they will describe it in exactly those terms to their own regulators. Notify the parties with a duty to act before anyone else hears anything.",
        leaning: "notify the duty-holders first",
      },
      {
        member: "u-ledger",
        line: "Notify 480 payers today with a count that moves next week and you have caused 480 re-notifications, each landing on a member as a second letter saying the first was wrong. Speed has a cost and nobody in this room has priced it. Send the categories and the date range, and hold the numbers until they are defensible.",
        leaning: "a wrong count is a harm too",
      },
      {
        member: "u-vault",
        line: "Nothing in your notification plan waits on the negotiation. A deletion certificate is a text file with no verifiable property whatsoever, and that sample set was mirrored by third parties within the hour. Never make a duty contingent on a promise from a counterparty who has already broken every other one.",
        leaning: "nothing waits on the criminal",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* C — sim-signed-build-poisoned :: Aureon Runtime, Inc.             */
  /* ---------------------------------------------------------------- */
  {
    simId: "sim-signed-build-poisoned",
    decisionId: "sim-signed-build-poisoned-d1",
    voices: [
      {
        member: "u-forge",
        line: "Everything resident in that runner at 14:22 is burned. The cosign OIDC identity, npm, PyPI, the CDN write credential and the Debian key — not possibly read, burned. And that box has been up since March, so do not confuse the job ending with the access ending. CI is production and it is the least monitored production we own.",
        leaning: "burn everything in that memory",
      },
      {
        member: "u-cartographer",
        line: "Think hard before you freeze the manifest. That channel is how 1.9 million hosts receive every fix you ship, and a frozen update path is an outage with a very long tail — you would be trading a possibly-poisoned release for a certainly-stale fleet on point-of-sale terminals and Kubernetes nodes you cannot reach any other way.",
        leaning: "do not freeze the channel",
      },
      {
        member: "u-keeper",
        line: "Image the runner before it leaves the pool and do not wipe it. Whoever revokes the OIDC trust does it with a second named person watching and a written record of the hour, because you are removing this company's ability to publish anything and somebody will later need to prove exactly how and when.",
        leaning: "image first, revoke under witness",
      },
      {
        member: "u-lantern",
        line: "Convergence is at 31 percent and climbing four points an hour. Whatever we argue about in this call, the number is worse when we finish than when we started, and it is the only number in the incident that is still moving in the adversary's favour.",
        leaning: "the clock is in the fleet",
      },
    ],
  },
  {
    simId: "sim-signed-build-poisoned",
    decisionId: "sim-signed-build-poisoned-d2",
    voices: [
      {
        member: "u-oracle",
        line: "The diff service is calibrated on two years of release deltas and it scored this low. The SBOM is identical to the lockfile, the provenance validates against the expected builder and the log entry is present. Three independent checks agree. At some point a stack of passing evaluations is what evidence looks like, and refusing to say so is not rigour, it is superstition.",
        leaning: "the evidence agrees, say so",
      },
      {
        member: "u-forge",
        line: "Every one of those checks came out of the pipeline we are investigating. The SBOM was generated in the same job that produced the binary, so of course they match — the injected code was never a dependency. Rebuild 4.11.2 from the attested commit on infrastructure that has never held our credentials and compare the bytes. Six hours, and then we actually know.",
        leaning: "rebuild independently or say nothing",
      },
      {
        member: "u-signal",
        line: "Provenance is a claim about an issuer and a process, and the issuer is the thing under investigation. A valid signature over a poisoned artefact is precisely what a valid signature looks like. The attestation is true and it answers a question nobody is asking.",
        leaning: "the attestation is true and empty",
      },
      {
        member: "u-seva",
        line: "She wants to send it in forty-five minutes. What do you know now that you did not know at 08:12 — and of the things you know, which ones came from inside the machine you are asking about?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-signed-build-poisoned",
    decisionId: "sim-signed-build-poisoned-d6",
    voices: [
      {
        member: "u-signal",
        line: "He is a verifier. Give him what a verifier needs — the digests, the exposure window, the hosts inside his boundary, and the confidence on each answer separately. Withholding the two you have because the third is unfinished is disclosure by symmetry, and to a man with his own reporting clock it reads as stalling.",
        leaning: "answer what you can, mark the rest",
      },
      {
        member: "u-oracle",
        line: "Be careful what you commit to a federal record. The sentence we cannot certify 4.11.2 exists permanently regardless of what the rebuild finds at 17:00, and it will be read by people with authority to act and no ability to re-weigh it later. Send him the two facts and the hour the third arrives, and let the finding speak when it exists.",
        leaning: "send facts, not a verdict",
      },
      {
        member: "u-keeper",
        line: "Whatever you send, write it yourself and send it in writing. A verbal briefing inside a regulated relationship still produces a written record — authored by somebody with less precision, reconstructed from memory, with your name at the top of it. Custody of the record is custody of the fact.",
        leaning: "write the record yourself",
      },
    ],
  },
  {
    simId: "sim-signed-build-poisoned",
    decisionId: "sim-signed-build-poisoned-d3",
    voices: [
      {
        member: "u-keeper",
        line: "You cannot vouch for a window in which your identity signed something you did not build. Declare it untrusted, name the exact hours, enumerate all four log entries including the one you cannot account for, and re-sign from a rebuilt path. A custodian who has never withdrawn a signature has never demonstrated that the signature meant anything.",
        leaning: "declare the window untrusted",
      },
      {
        member: "u-forge",
        line: "Get Debian and the container base-image maintainers on a call before you publish a word of it. Your revocation is their outage and they each need lead time. Skip that call and the most honest thing you do all week arrives in their inbox as an incident you caused.",
        leaning: "coordinate downstream first",
      },
      {
        member: "u-signal",
        line: "An allowlist of good digests is a control only if a machine consumes it. Our agent checks signature validity and expected identity and nothing else, so a digest list changes the behaviour of humans who read blog posts and of nothing that actually updates. Change the verification policy or you have changed nothing.",
        leaning: "revocation machines actually read",
      },
      {
        member: "u-lantern",
        line: "I want to know what was signed at 19:07 before we characterise it publicly. One unexplained transparency log entry may be an internal test build somebody triggered by hand, and declaring your own signing identity worthless over an artefact you have never seen is a claim you may spend years walking back.",
        leaning: "find the artefact first",
      },
    ],
  },
  {
    simId: "sim-signed-build-poisoned",
    decisionId: "sim-signed-build-poisoned-d4",
    voices: [
      {
        member: "u-forge",
        line: "Lead with SHA pinning and a two-person gate on release workflow changes. Those are the ones that actually get adopted. If I take runner caching off Tobias by decree I spend the next year policing exceptions instead of building the road — give me two quarters and I will land ephemeral runners with his teams asking for them.",
        leaning: "pin now, persuade on the rest",
      },
      {
        member: "u-keeper",
        line: "The signing credential sat in the same process as third-party code the maintainer of which had a personal access token with no expiry. Nothing else on your list matters until that is architecturally impossible. Build and publish are two stages, and only one of them is ever permitted to hold a key.",
        leaning: "separate build from publish",
      },
      {
        member: "u-cartographer",
        line: "Name what all of it shared. One long-lived VM held npm, PyPI, the CDN and the Debian key, which means you never had four credentials — you had one credential with four names on it, and no diagram in this company showed that. Ephemeral runners are how they become four again.",
        leaning: "split the correlated credential",
      },
      {
        member: "u-seva",
        line: "She asked which three change the outcome, and she asked which one Tobias will fight. You have prepared an answer to the first. Why is the second question the one you are hoping she forgets she asked?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-signed-build-poisoned",
    decisionId: "sim-signed-build-poisoned-d5",
    voices: [
      {
        member: "u-forge",
        line: "The ISSO gets the eleven host identifiers within the half hour, before anything is published and long before you answer Corinne. He kept your authorisation in place yesterday because he learned things from you first. That is the entire asset and it survives exactly one violation.",
        leaning: "ISSO first, publish, then press",
      },
      {
        member: "u-signal",
        line: "Notify precisely and stop there. Four hundred subscribers can each be reached directly and every one of them will be, so a public amendment reaches nobody who can act and adds another public claim you now have to keep true forever. Disclose to those who can do something; do not broadcast to those who cannot.",
        leaning: "notify precisely, do not broadcast",
      },
      {
        member: "u-lantern",
        line: "The nightly was scoped out in hour one because somebody called it non-production. That is a category judgement standing in for an exposure judgement, and it is the same substitution behind every coverage gap I have ever inherited. Name that in the correction or your next scoping call makes it again.",
        leaning: "scope by output, not by label",
      },
      {
        member: "u-cartographer",
        line: "Four hundred against 1.9 million is a denominator, and a denominator is a defensive instrument that your audience recognises on sight. For the eleven hosts inside that federal boundary the number is eleven out of eleven, and those are the highest-consequence machines in the entire affected set.",
        leaning: "do not reach for the denominator",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* D — sim-materiality-eight-k :: Ridgeline Instruments Corporation  */
  /* ---------------------------------------------------------------- */
  {
    simId: "sim-materiality-eight-k",
    decisionId: "sim-materiality-eight-k-d1",
    voices: [
      {
        member: "u-anchor",
        line: "Aurelio wrote confirmed because he confirmed it. If that word changes between his keyboard and the committee, somebody other than the analyst has become the author of the finding and nobody downstream will know that happened. I have never seen a factual edit stay small.",
        leaning: "do not edit a finding",
      },
      {
        member: "u-ledger",
        line: "Confirmed access is a technical statement that will be read as a legal one, and that ambiguity is what she is actually reacting to. Write it as confirmed authentication, assessed read access, exfiltration unknown, each with a confidence. That is more precise than either version and there is nothing left to argue about adjectivally.",
        leaning: "state confidence, not adjectives",
      },
      {
        member: "u-compass",
        line: "Marisol is not reaching for a word change because she wants a false record. She is reaching for it because a word change is the only instrument anyone has handed her. Give her the structure she actually needs — facts in one section, characterisation in hers — and the refusal is accepted in ten minutes instead of escalated over ten days.",
        leaning: "give her a better instrument",
      },
    ],
  },
  {
    simId: "sim-materiality-eight-k",
    decisionId: "sim-materiality-eight-k-d2",
    voices: [
      {
        member: "u-compass",
        line: "A committee that convenes and decides nothing produces minutes reading that the company looked at this and did not act. Convene once, next week, with facts on the table and a decision available, and the record shows a governance body that moved the moment it had something to move on. Untidy minutes are their own exposure.",
        leaning: "convene once, with a decision",
      },
      {
        member: "u-ledger",
        line: "The clock runs from the determination, which makes the determination the thing that has to carry a date. Put the date in the calendar today and it survives whatever the forensics do to you next week — and it is the single artefact that distinguishes deliberation from drift when somebody reconstructs this.",
        leaning: "the determination gets a date",
      },
      {
        member: "u-anchor",
        line: "Delia said moderate confidence and asked for another day. In my experience a moderate-confidence preliminary reverses more often than it holds, and this one is being used to justify not convening anything. Do not build a governance schedule on a finding its own author has caveated.",
        leaning: "do not schedule on a preliminary",
      },
      {
        member: "u-seva",
        line: "She says minutes create a record. What record is being created right now, in the nine days where the calendar shows no meeting at all — and who do you think reads that one first?",
        leaning: "the question underneath",
      },
    ],
  },
  {
    simId: "sim-materiality-eight-k",
    decisionId: "sim-materiality-eight-k-d3",
    voices: [
      {
        member: "u-signal",
        line: "He is asking you to issue a claim you have no authority to issue, and he will treat your answer as the security function signing the schedule. Issue the fact and only the fact, with your name on it as its source: the account could read the Brummer data room from June until last week, and we do not know whether its contents are in the 340 gigabytes.",
        leaning: "issue the fact, not the conclusion",
      },
      {
        member: "u-ledger",
        line: "You do not yet know whether data room contents are in that 340 gigabytes, and a fact of this shape delivered at moderate confidence into a live transaction moves people who cannot weigh it. Attach the confidence explicitly or wait for Delia, because an unqualified fact travels as a certainty.",
        leaning: "confidence before consequence",
      },
      {
        member: "u-compass",
        line: "Before anyone answers anything, get the actual representation and read it. Cybersecurity reps in purchase agreements are routinely drafted to any unauthorised access rather than to material incidents, and every person in this chain is assuming the two standards are the same word because they use the same word.",
        leaning: "read the clause first",
      },
    ],
  },
  {
    simId: "sim-materiality-eight-k",
    decisionId: "sim-materiality-eight-k-d4",
    voices: [
      {
        member: "u-ledger",
        line: "Give Grant a number. Decompose it properly — loss event frequency, loss magnitude, a range with every assumption written on the face of it. A committee asked to argue significance with no quantity in the room will default to the only quantity it already has, and that is 14.8 million. Do not send him in there unarmed.",
        leaning: "model it so it can be argued",
      },
      {
        member: "u-compass",
        line: "The moment a modelled expected loss exists, that figure is the decision. It will be laid next to 14.8 million by three people who have spent their careers comparing numbers to thresholds, and the qualitative case will never be reached. False precision here does not inform the determination, it replaces it.",
        leaning: "do not hand them a number",
      },
      {
        member: "u-signal",
        line: "State the factors with their confidences and then stop. Nature of what was taken: high. Attribution: moderate, on infrastructure overlap only. Competitive exposure: named, not quantified. You are supplying inputs, and the determination has a different issuer with a different authority.",
        leaning: "supply factors, not the verdict",
      },
      {
        member: "u-cartographer",
        line: "Say plainly what the moat actually was. Nineteen years of calibration held as trade secret and not as a patent — the only property protecting it was that nobody else had a copy, and that property is now gone. It never appeared on a financial statement and it is the whole company.",
        leaning: "the moat was the control",
      },
    ],
  },
  {
    simId: "sim-materiality-eight-k",
    decisionId: "sim-materiality-eight-k-d5",
    voices: [
      {
        member: "u-signal",
        line: "Unauthorized activity on certain systems is a claim with no content in it. The filing has to describe what was taken — the firmware source and the calibration implementation for the SP-9 platform — and it can do that without a single detail an actor could use. Precision about the category is not precision about the technique.",
        leaning: "describe what was taken",
      },
      {
        member: "u-ledger",
        line: "The draft asserts that the incident is material and that it is not reasonably likely to be material, in the same document, four lines apart. Somebody will read those two sentences side by side, and that somebody will be paid to. You cannot file a determination and its own denial together.",
        leaning: "the filing contradicts itself",
      },
      {
        member: "u-anchor",
        line: "Object in writing and object today. Outside counsel are drafting from a template and from what they have been told, and nobody has told them that certain systems means a complete firmware source tree. A verbal concern that does not change the filing is indistinguishable, afterwards, from no concern.",
        leaning: "put the objection in writing",
      },
      {
        member: "u-cartographer",
        line: "Naming SP-9 and the calibration algorithm in a public filing tells every other actor which repository was worth four months of patience, and Ridgeline hardware sits in refineries, water treatment and two classes of naval vessel. There is a real downstream cost to that precision and somebody in this room should say it out loud before it is filed.",
        leaning: "precision has a downstream cost",
      },
    ],
  },
  {
    simId: "sim-materiality-eight-k",
    decisionId: "sim-materiality-eight-k-d6",
    voices: [
      {
        member: "u-anchor",
        line: "She asked whether there is a difference. She did not ask whether it matters. Answer the question she asked: yes, one, here it is, I do not believe it changes the determination and that judgement is yours. Three sentences, and it is complete.",
        leaning: "answer the question she asked",
      },
      {
        member: "u-signal",
        line: "You are the issuer of that summary. Consistent with a state-aligned set and infrastructure overlap, not conclusive are two different claims at two different confidences, and you published the stronger one under your own name into the confirmed column. Whoever tightens a claim owns the correction.",
        leaning: "you tightened it, so you correct it",
      },
      {
        member: "u-compass",
        line: "The determination rests on what was taken, not on who took it. Open a document review inside a determination vote and three directors spend the afternoon re-reading nine days of material, the vote defers, and an 8-K that had margin no longer has any. Record the amendment after the vote, on the record, in the minutes.",
        leaning: "do not reopen the record at the vote",
      },
      {
        member: "u-seva",
        line: "She asked you this same question on day two, and she is asking it again now that you have had nine days to write things down. What do you think she is actually measuring, and has she measured it yet?",
        leaning: "the question underneath",
      },
    ],
  },
];
