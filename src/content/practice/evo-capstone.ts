import type { SimModule } from "../schema";

export const MODULES: SimModule[] = [
  {
    id: "sim-evonode-quorum-siege",
    title: "THE QUORUM WILL NOT FORM",
    org: "Bellwether Node Services, Inc.",
    sector: "Blockchain infrastructure operations — evonode and masternode hosting, non-custodial delegation",
    chapterId: "ch-dashevo",
    essence: "azure",
    difficulty: 4,
    minutes: 55,
    respect: 900,
    trust: 44,
    mode: "both",
    brief:
      "Bellwether Node Services is a 41-person Delaware C-corp with engineering in Austin and an operating entity in Tallinn. It runs 118 of roughly 470 active evonodes on Dash mainnet across Hetzner, OVH and Vultr. Forty-seven of those nodes sit on Bellwether-owned collateral (4,000 DASH each, per DIP-28). The other seventy-one are customer-owned: the customer holds the owner key and the voting key, Bellwether holds only the operator BLS key. That split is the entire product. Bellwether also runs a non-custodial delegation service for 2,900 retail delegators, pools Platform reward credits, and runs a weekly credit-to-Dash withdrawal batch. It has a funded Dash treasury proposal — 280 DASH a month for nine months to operate a public DPNS and data-contract indexer — and the next superblock is 34 hours away. SOC 2 Type II is in fieldwork. The board is five seats: two founders, Halcyon Capital, one independent director who ran security at a mid-size bank, and one community seat held by a large masternode owner. You are Bellwether's Director of Security Engineering. At 03:41 UTC on a Saturday you are the only person in the company with authority over key custody and the incident bridge, and eleven evonodes have started missing DKG contributions.",
    objective:
      "Winning is four things at once. Keep the Platform chain producing blocks — no action of yours may push an active LLMQ_100_67 below its minimum of 80 members. Establish, from on-chain evidence rather than from telemetry, exactly which operator keys are compromised, and contain every one of them including the customer-owned nodes whose owner keys you do not hold. Publish numbers that are still true twenty-four hours later. And finish the night with a network — masternode owners, Dash Core Group, the other large operators — that trusts Bellwether more than it did at 03:41, because that trust is the asset that survives the incident and the treasury vote is where it gets priced.",
    roles: ["u-ledger", "u-vault", "u-lantern", "u-anchor", "u-signal", "u-compass"],
    injects: [
      {
        id: "sim-a-i01",
        t: "03:41",
        channel: "pager",
        from: "Priya Raghunathan, SRE on call",
        text:
          "Paged on evonode-fleet-health. Eleven nodes have PoSe scores climbing since roughly 02:30. All eleven are missing DKG contribution messages for the LLMQ_100_67 cycle — that quorum has a dkgInterval of 24 blocks, so we get a fresh one about every hour and we have now missed two. Tenderdash is up on all eleven, Drive is answering, dashd is synced. Nothing in the logs except qcontrib timeouts. This does not look like a normal node fault."
      },
      {
        id: "sim-a-i02",
        t: "03:49",
        channel: "field",
        from: "Reeve Anand, Head of Node Operations",
        text:
          "It is not a provider outage. The eleven span all three of our providers — four Hetzner, five OVH, two Vultr — and the healthy nodes in the same racks are fine. I want to bounce the Tenderdash containers and the dashd processes on all eleven and see if it clears. I can have them back in the eligible set inside ten minutes. Give me the word.",
        decision: {
          id: "sim-a-d1",
          scene:
            "Eleven evonodes are failing to contribute to DKG, across three hosting providers, with no fault in any layer you can see. Your Head of Node Operations wants to restart them. Nobody has yet used the word compromise.",
          clock: "03:52 UTC — next DKG window opens in roughly 22 minutes",
          pressure: "Restarting is the cheapest hypothesis test you have, and it is also the one that destroys the evidence if the hypothesis is wrong.",
          prompt:
            "Correlated failure across three providers, in one specific protocol behaviour, with every layer reporting healthy. What posture do you set in the next four minutes?",
          options: [
            {
              id: "sim-a-d1-o1",
              label: "Approve the restart. Treat it as an operations blip until proven otherwise.",
              detail: "Bounce Tenderdash and dashd on all eleven, watch the next DKG cycle, escalate only if it recurs.",
              score: -2,
              outcome:
                "Seven of the eleven recover and rejoin the next cycle. The pattern resumes forty minutes later on a different set of nodes. You have destroyed volatile memory on every host, including the two that mattered.",
              ripple:
                "At 06:02 you cannot answer the only question a reviewer will ask — was the operator BLS key ever loaded in memory on those hosts, and by what process. Your incident narrative to 2,900 delegators has a hole in exactly the place they will look."
            },
            {
              id: "sim-a-d1-o2",
              label: "Open one bridge that treats this as both an availability incident and a suspected key incident.",
              detail:
                "Freeze the node-provisioning pipeline. Capture memory on two representative hosts, one per provider. Before touching anything else, pull the last 72 hours of ProUpServTx, ProUpRegTx and ProUpRevTx for every masternode in the fleet from the deterministic masternode list, plus DKG contribution records per node.",
              score: 3,
              isBest: true,
              outcome:
                "Nothing recovers in the next twenty minutes and Reeve is unhappy. But by 04:44 you have on-chain ground truth — a signed, timestamped inventory that separates what actually happened from what your telemetry thinks happened.",
              ripple:
                "At 07:12, when a reporter tells you that Bellwether lost operator keys for a quarter of the evonode set, you correct the number in one message with transaction ids attached instead of in three messages over two days."
            },
            {
              id: "sim-a-d1-o3",
              label: "Declare a full incident, page the company, put the whole fleet into maintenance mode.",
              detail: "Maximum caution: pull all 118 nodes out of service until you understand what is happening.",
              score: -1,
              outcome:
                "One hundred and eighteen evonodes — a quarter of the eligible set — leave at once. Two in-flight DKGs come up short of the 80-member minimum. Platform block production stutters for twenty-six minutes and every operator on the network watches it happen.",
              ripple:
                "You have now caused the degradation you were investigating. The community timeline of the incident will forever begin at the moment Bellwether reacted, not at the moment the attacker acted, and no amount of later correctness moves that line."
            },
            {
              id: "sim-a-d1-o4",
              label: "Wait thirty minutes. PoSe scores decay on their own; this may resolve.",
              detail: "Set a timer, keep watching, avoid overreacting to eleven nodes out of a hundred and eighteen.",
              score: -3,
              outcome:
                "At 04:44 six ProUpServTx land against your own evonodes, repointing platformNodeID and the operator payout address. The window in which a key rotation would have cost you nothing has closed.",
              ripple:
                "Those transaction timestamps now sit inside a period of documented, acknowledged suspicion. Regulators, customers and your own board read that gap as negligence, not as caution, and they are not wrong to."
            }
          ],
          debrief:
            "Correlated failure across independent providers, isolated to one protocol behaviour, with healthy infrastructure underneath, is an adversary signature until you have evidence otherwise. The restart is not wrong because it fails — it is wrong because it is irreversible. You can always restart after you capture. You can never capture after you restart. The world-class move here is not choosing security over availability; it is refusing the frame. You run both tracks off one bridge, and you spend the first twenty minutes on the artefacts that decay fastest.",
          principle: "Order your actions by how fast the evidence they destroy disappears, not by how fast they might fix things."
        }
      },
      {
        id: "sim-a-i03",
        t: "04:02",
        channel: "chain",
        from: "dcg-platform-oncall",
        text:
          "Cross-operator channel. We are seeing degraded DKG participation network-wide this cycle. The forming LLMQ_100_67 has 84 valid contributions against a minSize of 80. Threshold for signing is 67. We are four members from a failed DKG and one bad cycle from a validator set that cannot rotate cleanly. Several of the missing members trace to your ASNs. What are you seeing?"
      },
      {
        id: "sim-a-i04",
        t: "04:11",
        channel: "pager",
        from: "Yuki Tanabe, Security Engineering",
        text:
          "The CI runner token for the node-provisioning pipeline was used at 02:14 UTC from an ASN we have never authenticated from. That token holds decrypt scope on the Ansible vault path that stores operator BLS keys for the 2024-Q3 provisioning cohort. That cohort is 41 evonodes. The token has no expiry. It was minted eighteen months ago and it has been in the pipeline ever since."
      },
      {
        id: "sim-a-i05",
        t: "04:20",
        channel: "field",
        from: "Reeve Anand, Head of Node Operations",
        text:
          "Confirming Yuki's cohort. I have flow data showing all 41 of the 2024-Q3 nodes making anomalous outbound connections to three addresses outside our allowlist, starting around 02:40. Forty-one nodes. That is the whole cohort. I think we have to assume every key in that vault path is gone."
      },
      {
        id: "sim-a-i06",
        t: "04:26",
        channel: "exec",
        from: "Tomás Villalba, CTO and co-founder",
        text:
          "Forty-one keys is a quarter of our fleet and nine percent of the evonode set. I want every operator key on all 118 nodes rotated before the next DKG window. Draft the ProUpRegTx batch. I will wake the customers.",
        decision: {
          id: "sim-a-d2",
          scene:
            "Your CTO wants a full-fleet operator key rotation inside twenty minutes. Three constraints sit under that instruction. Rotating an operator key requires a ProUpRegTx signed by the owner key — and for 71 of your 118 nodes, the customer holds that key, not you. A node whose operator key changes loses its registered service entry until a new ProUpServTx lands, which means it drops out of quorum eligibility. And the network is already four members from a failed DKG.",
          clock: "04:29 UTC — the next 24-block DKG window opens in about 31 minutes",
          pressure: "The maximal security action and the maximal harm to the network are, tonight, the same action.",
          prompt: "Design the containment. You have one shot at getting the sequencing right.",
          options: [
            {
              id: "sim-a-d2-o1",
              label: "Rotate all 118 now. Wake every customer, get owner signatures, push the batch.",
              detail: "Maximum containment. Nothing compromised stays live.",
              score: -2,
              outcome:
                "You get 63 owner signatures in twenty minutes and push what you have. Every rotated node loses its service entry simultaneously. The LLMQ_100_67 forming at the next boundary comes up twelve members short of minSize and the Platform chain stops producing for fifty-one minutes.",
              ripple:
                "Dash Core Group and three other operators publicly attribute the halt to Bellwether, accurately. Your treasury proposal loses roughly 900 net votes over the following day, and every future incident you have will be read through the memory of the night you stopped the chain."
            },
            {
              id: "sim-a-d2-o2",
              label: "Stage the rotation by proven exposure, capped by quorum arithmetic.",
              detail:
                "Rotate only the 41-node 2024-Q3 cohort whose keys sat under the compromised vault path. Batch them so no active quorum can drop below minSize 80, highest exposure first, self-owned collateral first because you can sign those yourself. Open a parallel owner-signature workflow for the customer-owned nodes with a written, time-boxed escalation. Publish the batch plan and the minSize arithmetic to the operator channel as you execute.",
              score: 3,
              isBest: true,
              outcome:
                "Eighteen of your 47 self-owned nodes rotate cleanly in the first batch with no measurable effect on quorum formation. The customer signing queue opens. The published arithmetic is checked by two other operators within the hour and holds.",
              ripple:
                "At 07:41, when the treasury question arrives, you are pointing at a containment plan anyone can verify with a block explorer and a calculator rather than at an assertion. Three large masternode owners defend you in the forum without being asked."
            },
            {
              id: "sim-a-d2-o3",
              label: "Do not rotate. Firewall the eleven degraded nodes and monitor for further abuse.",
              detail: "Rotation is disruptive and the evidence is still thin. Watch, and rotate when you know more.",
              score: -1,
              outcome:
                "The attacker still holds valid operator BLS keys for the rest of the cohort, and a firewall does not stop a signed transaction. At 06:38 two more ProUpServTx land on nodes you had classified as clean.",
              ripple:
                "Your containment story now contains a second wave. Nothing destroys external confidence faster than a defender who announced the scope and was then overtaken by the same attacker inside the same night."
            },
            {
              id: "sim-a-d2-o4",
              label: "Broadcast ProUpRevTx on all 41 cohort nodes using your own operator keys.",
              detail: "Revocation is signed by the operator key, which you still hold. It nulls the operator key and PoSe-bans the node out of quorum eligibility immediately, without needing any owner signature.",
              score: 0,
              outcome:
                "Genuinely fast and genuinely safe for the keys, and it beats the attacker to a race you might otherwise lose. It is also a public, permanent, on-chain declaration of failure against 71 customer-owned nodes whose owners you did not consult, and it removes them from payment eligibility.",
              ripple:
                "Two delegation customers terminate and cite the revocations. The ProUpRevTx list becomes the artefact every reporter screenshots, because it is the one piece of the incident that is trivially legible to someone who does not understand DKG."
            }
          ],
          debrief:
            "Threshold systems punish uniform action. Your fleet is a quarter of the eligible evonode set, so any control you apply to all of it at once is a control you are applying to the network. The operator key is the wrong unit of urgency; the quorum is. Ronin in March 2022 lost 625 million dollars because five of nine validator keys sat under correlated control. The defensive mirror of that failure is exactly this: 118 nodes under one operator, one vault path, one CI token. The staged batch is slower, and it is the only version where both the keys and the chain survive.",
          principle: "In a threshold system, containment that is applied uniformly is an attack you are performing on yourself."
        }
      },
      {
        id: "sim-a-i07",
        t: "04:44",
        channel: "chain",
        from: "bellwether-chainwatch (automated)",
        text:
          "Six ProUpServTx confirmed against Bellwether-operated evonodes in the last block. Each one changes platformNodeID and the operator payout address. Each is signed with a valid operator BLS key. Nodes affected: bw-evo-0113, 0119, 0121, 0134, 0140, 0147. All six are in the 2024-Q3 cohort. No other fleet nodes show service updates."
      },
      {
        id: "sim-a-i08",
        t: "04:58",
        channel: "exec",
        from: "Tomás Villalba, CTO and co-founder",
        text:
          "I have a post drafted for the operator channel and the delegator list. It says operator keys for 41 evonodes are compromised, we are rotating, no customer funds are at risk. Reeve's flow data supports the 41. Speed is how we keep trust here. I am ready to send.",
        decision: {
          id: "sim-a-d3",
          scene:
            "Two numbers are in the room. Forty-one, from network flow telemetry your Head of Node Operations produced under pressure at 04:20. Six, from confirmed on-chain service updates at 04:44. Your CTO wants to publish the larger one because it is the more cautious one.",
          clock: "05:01 UTC — the community forum thread is nineteen minutes from existing",
          pressure: "Publishing fast is correct. Publishing fast and wrong spends a credibility budget you will need at 07:41 for something harder.",
          prompt: "What goes out, when, and with what number attached to it?",
          options: [
            {
              id: "sim-a-d3-o1",
              label: "Send it now with 41. Overstating is the safe direction to be wrong in.",
              score: -2,
              outcome:
                "Twenty-seven minutes later Yuki establishes that the 41 anomalous outbound flows were all going to the new snapshot mirror that Node Operations stood up on Thursday and never added to the allowlist. The true compromise is six.",
              ripple:
                "At 07:12 the reporter quotes your own 41 back at you. Corrections never travel as far as originals. The framing that Bellwether lost a quarter of the evonode set attaches to the company for a year, and it came from Bellwether."
            },
            {
              id: "sim-a-d3-o2",
              label: "Hold thirty minutes. Publish only what is verifiable on-chain, with a stated time for the next update.",
              detail:
                "Six transaction ids, six node identifiers, the fact of a compromised CI token, the containment approach, and a commitment to update at 05:30 whether or not you know more. Say explicitly that the total scope is not yet established and that you will not guess at it in public.",
              score: 3,
              isBest: true,
              outcome:
                "The operator channel independently verifies your six transaction ids within eleven minutes and confirms your count before you do. Tomás is unhappy about the delay for about an hour.",
              ripple:
                "Because your first public number was right, every later number is believed — including the much harder one at 05:34 when you tell 2,900 delegators you are stopping their payout batch."
            },
            {
              id: "sim-a-d3-o3",
              label: "Say nothing publicly until the investigation is complete.",
              score: -2,
              outcome:
                "The forum thread opens at 05:19 and fills the vacuum with speculation. By 06:30 the community's working number is 41 with no path to correction, because there is no authoritative source to correct it.",
              ripple:
                "The reporter's story at 07:12 is sourced entirely from the forum, because you gave nobody anything checkable. You cannot complain about a narrative you declined to supply facts to."
            },
            {
              id: "sim-a-d3-o4",
              label: "Publish 41, labelled clearly as unconfirmed and subject to revision.",
              score: -1,
              outcome:
                "The qualifier survives exactly one repost. Within ninety minutes the number is circulating without it, attributed to Bellwether.",
              ripple:
                "You have taught your own community that Bellwether numbers need to be discounted. That discount applies at the superblock, where you need to be believed about something you cannot prove with a transaction id."
            }
          ],
          debrief:
            "This is the decision where slowing down is the whole answer. Thirty minutes of restraint bought a verified number; the alternative bought a permanent framing error. Note where the two numbers came from. Forty-one came from telemetry — inferential, produced fast, under load, by someone with a hypothesis. Six came from the ledger — adversary-signed, timestamped, independently verifiable by anyone. When those two disagree during an incident on a public chain, the ledger wins, and your public statements should be denominated in the artefact your audience can check themselves. Microsoft revised its Storm-0558 account repeatedly; Okta's October 2023 support-system breach was disclosed at 134 affected customers and later restated to essentially all of them. In both cases the restatement, not the breach, is what the industry remembers.",
          principle: "Publish the number you can prove, at the speed you can prove it, and name the time of your next update."
        }
      },
      {
        id: "sim-a-i09",
        t: "05:06",
        channel: "board",
        from: "Marguerite Okonkwo-Bly, independent director",
        text:
          "Halcyon has already called me. The question I need answered in one paragraph: with these keys, can the attacker vote our customers' masternodes in the Dash treasury? We have a proposal in front of the network and the optics of an attacker controlling 118 nodes of governance weight — four votes each for evonodes — would be the end of it. Tell me plainly whether that is possible."
      },
      {
        id: "sim-a-i10",
        t: "05:19",
        channel: "community",
        from: "sablefish (masternode owner, 31 nodes)",
        text:
          "Forum thread now at 140 replies. Consensus forming that Bellwether is compromised at scale, that ChainLocks are at risk because a big operator can withhold signatures, and that everyone with collateral hosted at Bellwether should revoke tonight. Somebody has posted a script to do it. If you have something true to say, this is the last hour where saying it changes anything."
      },
      {
        id: "sim-a-i11",
        t: "05:34",
        channel: "legal",
        from: "Dr. Neve Ostrowski, Hale and Ferrant LLP",
        text:
          "Three things. One: the delegator agreement gives you discretion to suspend the weekly withdrawal batch for operational integrity, but it obliges you to state a reason. Two: your Tallinn entity's supervisory relationship makes an unexplained payment stoppage substantially worse than an explained one. Three: the batch is scheduled at 06:00 — 4,180 DASH across 2,900 delegators — and the attacker changed operator payout addresses on six nodes, which means you cannot currently attest that the reward mapping feeding that batch is intact. You have twenty-six minutes.",
        decision: {
          id: "sim-a-d4",
          scene:
            "The weekly credit-to-Dash withdrawal batch runs in twenty-six minutes. You know the attacker altered operator payout addresses. You do not know whether your reconciliation between on-chain payouts and the delegator ledger is still sound, and you cannot know before 06:00.",
          clock: "05:37 UTC — batch executes at 06:00",
          pressure:
            "Stopping payments during a public security incident is the single most alarming thing a custodial-adjacent business can do. It is also the correct thing.",
          prompt: "The batch runs, or it does not. Decide, and decide how it is communicated.",
          options: [
            {
              id: "sim-a-d4-o1",
              label: "Let the batch run. It is six nodes out of 118 and a stopped payment reads as insolvency.",
              score: -2,
              outcome:
                "The batch clears on time and the panic does not spike. Three days later reconciliation shows 61 DASH of operator rewards routed to the attacker's address and distributed against a delegator ledger that was already wrong.",
              ripple:
                "You now have to restate. A restatement issued after an incident converts a security story into a solvency story, and solvency stories bring a supervisory authority into a conversation that was previously technical."
            },
            {
              id: "sim-a-d4-o2",
              label: "Pause the batch, publish exactly why in the same message as the technical update, and pre-fund the delay.",
              detail:
                "Name the resume condition precisely: a signed reconciliation of every operator payout address in the fleet against the deterministic masternode list. Cover the delay from the corporate account so no delegator is out of pocket. Same message, same timestamp, same signature as the 05:30 technical update.",
              score: 3,
              isBest: true,
              outcome:
                "Forty support tickets in the first hour, two furious threads, and Tomás tells you that you have handed the press its headline. All true. The reconciliation completes at 09:20 and the batch clears clean.",
              ripple:
                "At the superblock, the single most-quoted sentence in Bellwether's favour is that it stopped its own payouts before anyone asked it to. You cannot buy that sentence later; it only exists if you earn it in this twenty-six minutes."
            },
            {
              id: "sim-a-d4-o3",
              label: "Run the batch but exclude the six known-compromised nodes.",
              score: 1,
              outcome:
                "Defensible, fast, and mostly right. It also presumes the six are the whole set — the exact proposition you told the community at 05:00 you were not yet willing to assert.",
              ripple:
                "When nodes seven and eight surface at 06:38, the partial exclusion is re-read as evidence that you knew the scope was uncertain and paid out anyway. Selective mitigation reads as concealment in hindsight even when it was honest at the time."
            },
            {
              id: "sim-a-d4-o4",
              label: "Pause quietly. Resume when the reconciliation is clean. Explain afterwards.",
              score: -3,
              outcome:
                "Delegators notice a missing scheduled payment within ninety minutes. The silence is now the story, and it is a better story than the incident.",
              ripple:
                "An unexplained payment stoppage at a business with a supervisory relationship is the specific behaviour that converts a recoverable incident into a formal inquiry. You chose an hour of calm and bought a year of correspondence."
            }
          ],
          debrief:
            "This is the politically expensive decision, and it is expensive precisely because it is correct. The technical fact is small — six payout addresses — but it invalidates an attestation you make weekly to 2,900 people, and an invalidated attestation cannot be quietly renewed. Notice that option two is not simply pausing; it is pausing with a stated resume condition, a stated cost-bearer, and a bundled technical disclosure. Each of those elements is doing separate work. The resume condition prevents the pause from being open-ended. The pre-funding removes the customer's financial reason to disbelieve you. The bundling means the pause is read as a consequence of the incident you are already explaining rather than as a new event.",
          principle: "When you can no longer make an attestation, stop making it out loud, and say precisely what would let you resume."
        }
      },
      {
        id: "sim-a-i12",
        t: "06:02",
        channel: "field",
        from: "Reeve Anand, Head of Node Operations",
        text:
          "I want to wipe and rebuild all six from a known-good image in the next fifteen minutes. We are down capacity, PoSe scores are still climbing on the rest of the cohort, and every hour those six sit there is an hour they are useless and an hour the attacker keeps a foothold. I have the image ready. Say go.",
        decision: {
          id: "sim-a-d5",
          scene:
            "Six compromised hosts. Your operations lead wants them rebuilt now. Your third-party review — the one you have not promised publicly yet, but will — will live or die on what is on those disks.",
          clock: "06:05 UTC",
          pressure: "Capacity pressure is real. So is the fact that nobody yet knows how the vault decrypt actually happened.",
          prompt: "How do you sequence restoration against preservation?",
          options: [
            {
              id: "sim-a-d5-o1",
              label: "Rebuild all six now. Capacity first.",
              score: -2,
              outcome:
                "Capacity is restored by 06:25. Every artefact that could show how the operator key left the vault goes with it — the CI runner's cached credential, the decrypt call, the process tree.",
              ripple:
                "The independent review you commit to at 07:41 cannot reach a root cause. You spend the next two quarters unable to tell a single customer why it will not happen again, which is the only question they are actually asking."
            },
            {
              id: "sim-a-d5-o2",
              label: "Image two hosts chosen for coverage, then rebuild all six from an image whose provenance you can show.",
              detail:
                "Memory and full disk on one Hetzner and one OVH host. Hash both, dual-sign the hashes, store them where operations cannot reach them. Then rebuild, and rebuild from a freshly built image with recorded build provenance rather than the golden image the compromised pipeline produced.",
              score: 3,
              isBest: true,
              outcome:
                "Twenty-two minutes of extra downtime. You recover the CI runner's cached credential and the exact vault decrypt call, with timestamps that match the 02:14 anomalous authentication.",
              ripple:
                "The root cause lands in the published report six weeks later exactly as promised. The sentence we know precisely how this happened is what carries the treasury vote, and it only exists because of twenty-two minutes."
            },
            {
              id: "sim-a-d5-o3",
              label: "Rebuild five, preserve one.",
              score: 1,
              outcome:
                "Reasonable compromise. The host you preserve happens to be a second-stage node, not the one the CI runner first touched, so it shows the effect and not the cause.",
              ripple:
                "A partial answer invites the reviewer to speculate about everything you did not capture. One host is a sample; two chosen for coverage is a method, and reviewers can tell the difference."
            },
            {
              id: "sim-a-d5-o4",
              label: "Leave all six running and untouched to observe the attacker.",
              score: -2,
              outcome:
                "You do learn things. You are also leaving valid operator BLS keys live on production consensus infrastructure, and the attacker can issue another ProUpServTx at any moment for free.",
              ripple:
                "Watching an adversary who holds live signing keys inside a threshold consensus set is not observation, it is consent, and it will be characterised that way by everyone who reads the timeline afterwards."
            }
          ],
          debrief:
            "Preservation is not an academic virtue; it is the input to the only deliverable that outlasts the night. Mandiant's M-Trends 2025, drawn from more than 450,000 hours of investigation, puts global median dwell time at eleven days — which means the artefacts you decline to capture at hour three are usually the only record of a presence that predates your detection by more than a week. Two hosts chosen for coverage, hashed and dual-signed, is roughly twenty minutes of work and it is the difference between a report that says how and a report that says probably.",
          principle: "Capture two, chosen for coverage, hashed and countersigned — then restore as fast as you like."
        }
      },
      {
        id: "sim-a-i13",
        t: "06:11",
        channel: "field",
        from: "Yuki Tanabe, Security Engineering",
        text:
          "Retracting the 41. Those anomalous outbound flows are all to the snapshot mirror Node Ops stood up Thursday and never added to the allowlist. Reeve's data was real and his conclusion was wrong. Confirmed compromise remains six by on-chain evidence. Separately: two more ProUpServTx just landed on bw-evo-0102 and 0108. Both are in the 2024-Q3 cohort and both were on the rotation queue behind the first batch. Eight."
      },
      {
        id: "sim-a-i14",
        t: "06:38",
        channel: "chain",
        from: "Reeve Anand and Dr. Neve Ostrowski (joint)",
        text:
          "Reeve: the vector is confirmed as a non-expiring CI runner token with decrypt scope on the whole vault path rather than a per-node path. Three other large operators run the same provisioning tool with, as far as I can tell from its defaults, the same scope. Ostrowski: I am asking you to route any technical publication through me first. Anything you describe about your own configuration is an admission, and I cannot turn it around before roughly 12:30.",
        decision: {
          id: "sim-a-d6",
          scene:
            "You know the exact misconfiguration. Three peer operators almost certainly share it. Your counsel wants six hours to review anything you publish, on sound legal reasoning.",
          clock: "06:41 UTC",
          pressure: "Every hour you hold this is an hour of exposure for operators who are not your customers and who owe you nothing.",
          prompt: "What do you disclose, to whom, and how fast?",
          options: [
            {
              id: "sim-a-d6-o1",
              label: "Publish the indicator set and the exact vault-scope misconfiguration to the operator channel and Dash Core Group inside the hour.",
              detail:
                "Facts only: the token scope, the authentication anomaly, the ProUpServTx signature pattern, the affected fields. No speculation about who else is exposed, no advice, no attribution. Tell counsel you are doing it and why, in writing, before you do it.",
              score: 3,
              isBest: true,
              outcome:
                "Counsel objects on the record, which is her job. One other operator finds the same unscoped token on their runners within ninety minutes and rotates before anything reaches them.",
              ripple:
                "That operator votes yes on your treasury proposal and says publicly why. In a network where your revenue depends on collective trust, the disclosure was not a cost centre — it was the highest-return action available to you all night."
            },
            {
              id: "sim-a-d6-o2",
              label: "Send it privately to Dash Core Group only, under confidentiality.",
              score: 1,
              outcome:
                "Narrow, safe, slow. Dash Core Group now holds information it cannot broadcast without effectively attributing it to you, so it goes nowhere useful for a day.",
              ripple:
                "The other operators eventually learn you knew at 06:38 and selected a channel that structurally excluded them. Partial disclosure to a party who cannot act on it is indistinguishable, in hindsight, from non-disclosure."
            },
            {
              id: "sim-a-d6-o3",
              label: "Route through counsel and publish after review.",
              score: -1,
              outcome:
                "The disclosure lands at 12:30. One peer operator was compromised through the identical token scope at 09:40.",
              ripple:
                "They knew at 06:38 becomes a line in somebody else's incident report, and it will be quoted in every discussion of operator conduct on this network for years."
            },
            {
              id: "sim-a-d6-o4",
              label: "Publish nothing about the tool. It is the vendor's responsibility to notify their users.",
              score: -2,
              outcome:
                "The vendor advisory appears nine days later, after their own triage and legal review.",
              ripple:
                "You optimised your own liability inside a system whose entire value to you is collective. The community reads that decision exactly as it was made, and the reading is correct."
            }
          ],
          debrief:
            "The credential itself is unremarkable — MITRE ATT&CK catalogues it as T1552.001, credentials in files, and the automation path that reached it is why SLSA Build Level 3 exists at all: hardened build platforms, secrets isolated from user-definable steps, provenance you can show. What is interesting is the disclosure calculus. On a shared consensus network your competitors are also your security perimeter. An operator who rotates before compromise reduces the probability that a future quorum crosses the one-third threshold that halts the chain you are paid to run. Counsel is correct that publication creates admissions; she is scoped to the company, and you are scoped to the network the company lives inside. The move is not to overrule her silently — it is to make the disagreement explicit, in writing, and own the call.",
          principle: "On a shared network, disclosing your own misconfiguration to your competitors is a control, not a confession."
        }
      },
      {
        id: "sim-a-i15",
        t: "07:12",
        channel: "press",
        from: "Sasha Lindqvist, Ledger Dispatch",
        text:
          "Publishing in two hours. Three claims from sources: that Dash Platform halted for roughly forty minutes overnight, that Bellwether lost operator keys covering a quarter of the evonode set, and that customer collateral is at risk. I have your 05:30 statement. I would rather run your numbers than the forum's. Ninety minutes."
      },
      {
        id: "sim-a-i16",
        t: "07:41",
        channel: "board",
        from: "Tomás Villalba and Gideon Marsh (Halcyon Capital, board observer)",
        text:
          "Voting on the current superblock cycle closes 1,662 blocks before the superblock — about thirty-four hours. Our proposal is at plus 412 net yes. A withdrawal campaign is forming in the forum. Marsh wants us to withdraw so the story dies and we re-propose next cycle. The community seat wants us to fight it and is offering to organise. Your call carries the room.",
        decision: {
          id: "sim-a-d7",
          scene:
            "The Dash treasury takes twenty percent of the block reward and pays out at a superblock roughly every 16,616 blocks — about thirty days. A proposal passes when yes minus no exceeds ten percent of the masternode count. Evonode votes carry weight four; regular masternodes carry one. Bellwether's indexer proposal is nine months into a nine-month cycle and funds three engineers.",
          clock: "07:44 UTC — voting closes in roughly 34 hours",
          pressure: "Two board factions, opposite instructions, and a network audience that can read everything you do on-chain.",
          prompt: "What does Bellwether do about its own treasury proposal?",
          options: [
            {
              id: "sim-a-d7-o1",
              label: "Withdraw the proposal. Let the story die and re-propose next cycle.",
              score: 0,
              outcome:
                "The story does cool. The indexer loses funding in thirty-four hours and its three engineers are reassigned on Monday. The community reads the withdrawal as a concession that Bellwether cannot currently be trusted with network funds.",
              ripple:
                "There is no vehicle to restart when the independent review clears you six weeks later. You gave up the funded thing to protect the unfunded thing, which is the trade a board makes when nobody in the room is measuring the cost of the first."
            },
            {
              id: "sim-a-d7-o2",
              label: "Fight it. Mobilise delegator customers and relationships to hold the yes votes.",
              score: -3,
              outcome:
                "It might even work. Whipping masternode votes during your own security incident is the fastest available way to look like an operator capturing governance.",
              ripple:
                "Two of your largest delegation customers screenshot the ask. Bellwether lobbied masternodes while under investigation outlives every technical fact of the night, and it is the sentence that follows the company into every future proposal."
            },
            {
              id: "sim-a-d7-o3",
              label: "Do not withdraw. Publish the complete record and invite a no vote.",
              detail:
                "Full incident record: transaction ids, the vault scope misconfiguration, the containment arithmetic including the minSize math, the payout pause and its resume condition, the eight-node final count. State explicitly that masternodes should vote no if they are not satisfied. Pre-commit to an independent review, funded from corporate cash rather than treasury funds, published in full regardless of what it finds. Whip nothing.",
              score: 3,
              isBest: true,
              outcome:
                "The proposal closes at plus 180 — materially weaker, and it passes on stated facts rather than on relationships. Two operators say publicly that the disclosure standard is the reason they voted yes.",
              ripple:
                "The review lands six weeks later exactly as promised, root cause included. The disclosure standard you set becomes the network's default expectation of every operator after you, which is a durable competitive position that no marketing spend could have bought."
            },
            {
              id: "sim-a-d7-o4",
              label: "Ask Dash Core Group to defer the vote until the investigation closes.",
              score: -2,
              outcome:
                "There is no mechanism to defer a superblock cycle, and the request itself is a request to route around the masternodes.",
              ripple:
                "The ask becomes the primary exhibit in the governance-capture argument. Asking a core team to alter a governance process on your behalf is worse than losing the vote, because it is evidence about what you would do with power rather than about what happened to your nodes."
            }
          ],
          debrief:
            "Governance is an audience, not just a mechanism. The temptation is to treat the vote as a problem to be managed — withdraw it, whip it, defer it — when the vote is actually the only instrument available that can restore standing rather than merely preserve it. Note the specific construction of the winning option: publish everything, invite the no vote, and pay for the review yourself. Inviting the no vote is what makes the disclosure credible, because a party that genuinely wants to be judged is behaving differently from a party performing transparency. Funding the review from corporate cash rather than treasury funds removes the obvious objection before anyone raises it. The Tornado Cash DAO takeover in May 2023 and the Beanstalk flash-loan governance attack in April 2022 are the canonical cases of governance mechanisms being attacked directly; the subtler failure — an insider using legitimate influence to survive a vote it deserved to lose — leaves no exploit to write up and does more lasting damage to a network's willingness to fund anyone.",
          principle: "When your standing is the thing at risk, hand the decision to the people whose trust you need and give them everything they would need to say no."
        }
      },
      {
        id: "sim-a-i17",
        t: "08:05",
        channel: "regulator",
        from: "Estonian Financial Intelligence Unit — supervision desk",
        text:
          "We have seen public reporting referencing your Tallinn entity and a suspension of scheduled customer distributions. We are not opening anything at this stage. We would like, within five business days: the timeline, the basis on which you concluded customer assets were unaffected, the resume condition for the distribution, and the governance record of who authorised the suspension. Please treat the completeness of the first submission as more important than its speed."
      }
    ],
    scoring: [
      {
        dimension: "Chain availability preserved",
        weight: 25,
        note:
          "Judged on whether any action you took pushed an active LLMQ_100_67 below its minimum of 80 members, contributed to a failed DKG cycle, or caused a Platform stall. Uniform action across a fleet that is a quarter of the eligible set is scored as an availability attack regardless of intent."
      },
      {
        dimension: "Key containment completeness",
        weight: 25,
        note:
          "Every operator BLS key inside the compromised vault scope must be rotated or revoked, including the customer-owned nodes where you hold no owner key, before the attacker's second wave. Partial containment that is announced as complete scores below partial containment that is announced as partial."
      },
      {
        dimension: "Evidence integrity",
        weight: 15,
        note:
          "Whether a hostile independent reviewer, given only what you preserved, can establish root cause. Captured before restoration, hashed, countersigned, and held outside the control of the team that operates the systems."
      },
      {
        dimension: "Public numeric accuracy",
        weight: 20,
        note:
          "Every figure you stated publicly must still be true twenty-four hours later. Scored on the count of statements requiring downward or upward revision, and on whether you named a next-update time and met it."
      },
      {
        dimension: "Network reciprocity",
        weight: 15,
        note:
          "Whether the rest of the operator set is measurably safer because of what you disclosed and how fast. Judged on indicator quality, timing relative to your own containment, and whether peers could act on what you sent without further contact."
      }
    ],
    debrief: [
      {
        title: "The safest action and the safest network are not the same action",
        body:
          "Dash Platform consensus runs on Tenderdash over a rotating LLMQ_100_67: one hundred evonodes drawn from the eligible set, minimum eighty for the quorum to form, threshold sixty-seven to sign, a new distributed key generation every twenty-four blocks — roughly an hour. Roughly thirty-four members can halt or censor; more than two thirds would be needed to rewrite. Bellwether runs 118 of about 470 evonodes. That single number determines everything about the night: any control applied to the whole fleet at once is a control applied to about a quarter of the network's consensus capacity. The full-fleet rotation is not merely disruptive, it is the exact shape of the attack the threshold parameters exist to prevent, executed by the defender. The transferable pattern is that in any threshold system — validator sets, HSM quorums, break-glass multisigs, regional failover groups — you must compute your own share before you design containment, and cap every remediation batch by the arithmetic rather than by urgency. Ronin in March 2022 lost 625 million dollars because five of nine validator keys sat under correlated control; the defensive mirror of that concentration is an operator whose emergency response can itself cross the fault threshold."
      },
      {
        title: "Know precisely what each key can do before the night you need to know",
        body:
          "Dash separates owner, operator and voting keys, and the separation is the whole answer to the board's question at 05:06. The operator BLS key signs ProUpServTx — which can change the node's service address, its platformP2PPort and platformHTTPPort, its platformNodeID, and the operator payout address — and it signs ProUpRevTx, which revokes the operator role and PoSe-bans the node. It participates in DKG and in threshold signing. It cannot cast a governance vote and it cannot move collateral. The voting key, held by the customer in Bellwether's non-custodial model, is what votes on treasury proposals and on contested DPNS names. The owner key signs ProUpRegTx, which is what rotates an operator key — which is precisely why containment on customer-owned nodes required 71 people to wake up and sign. The crown-jewel abuse here is not theft: it is the platformNodeID swap, which silently substitutes the attacker's Tenderdash instance into a validator slot the deterministic masternode list still attributes to you. A CISO who cannot recite this mapping under pressure will either over-contain and halt the chain or under-contain and leave signing keys live. Build the table before the incident, and put the answer to what can this key actually do next to every key you hold."
      },
      {
        title: "Your first public number is your entire credibility budget",
        body:
          "Forty-one came from flow telemetry produced under load by a competent engineer with a hypothesis; six came from adversary-signed transactions anyone could verify. When inferential and ledger evidence disagree during an incident on a public chain, the ledger wins and your public statements should be denominated in artefacts your audience can check without you. Thirty minutes of restraint at 04:58 is what made the far harder statement at 05:34 — we are stopping your payments — survivable. Microsoft's Storm-0558 account required repeated revision, and the Cyber Safety Review Board's April 2024 report characterised the surrounding decisions as a cascade of avoidable errors; Okta's October 2023 support-system breach was disclosed at 134 affected customers and later restated to essentially the whole customer base. In both cases the restatement is what the industry remembers. Practically: keep two registers during any incident — what is verified and what is suspected — never let a number cross from the second to the first because of pressure, and always publish a next-update time so silence is never the only alternative to guessing."
      },
      {
        title: "Preserve two, chosen for coverage, then restore as fast as you like",
        body:
          "Reeve's instinct at 06:02 is the most common and most expensive instinct in incident response, and it is not stupidity — it is capacity pressure, which is real. The countermeasure is not a debate; it is a standing rule with a number in it. Two hosts, chosen for coverage across the axis you suspect, memory and full disk, hashed and countersigned by someone outside the operating team, stored where operations cannot reach. Twenty-two minutes. M-Trends 2025, built on more than 450,000 hours of Mandiant investigations, reports a global median dwell time of eleven days, with exploits at 33 percent and stolen credentials at 16 percent of initial infection vectors — which means the evidence you decline to capture at hour three routinely contains the only record of a presence that predates your detection by more than a week. Root cause is not a research luxury. It is the input to the only sentence that matters to customers afterwards: here is why it cannot happen again."
      },
      {
        title: "On a shared network, your competitors are your perimeter",
        body:
          "The vector was a non-expiring CI runner token with decrypt scope over an entire vault path rather than per-node paths — ATT&CK T1552.001 in its most ordinary form, reached through an automation path that SLSA Build Level 3 exists to harden: isolated build steps, secrets unreachable from user-definable stages, provenance you can show. The interesting decision is not the fix, it is the disclosure. Three peer operators shared the misconfiguration. Every hour of legal review was an hour of exposure for parties who owe you nothing and whose compromise would raise the probability that a future quorum crosses the one-third halt threshold on the chain you are paid to operate. Counsel's advice was correct within her scope and insufficient outside it. The professional move is not to overrule her silently but to make the disagreement explicit, in writing, and carry the call — which is also, incidentally, the record that protects you if the call is ever questioned."
      },
      {
        title: "Governance is an audience, and audiences price behaviour, not statements",
        body:
          "The Dash treasury takes twenty percent of the block reward and pays at a superblock every 16,616 blocks — about thirty days — with voting closing 1,662 blocks earlier and a proposal passing when net yes exceeds ten percent of the masternode count, evonodes weighted four to one. Three of the four available moves at 07:41 treat that mechanism as a problem to be managed. Only one treats it as the instrument that can actually restore standing: publish everything, invite the no vote, and pay for the independent review from corporate cash so the obvious objection never gets raised. Inviting the no vote is the load-bearing part, because a party that genuinely wants to be judged behaves observably differently from a party performing transparency, and this audience can read the chain. Tornado Cash in May 2023 and Beanstalk in April 2022 are the canonical direct attacks on governance mechanisms. The quieter failure — an insider using legitimate influence to survive a vote it deserved to lose — produces no exploit to write up and does more durable damage, because it teaches a network that its votes are decorative."
      },
      {
        title: "The transferable shape",
        body:
          "Strip the Dash specifics and the night has a structure you will meet in a bank, a hospital group, or a model lab. A shared substrate whose availability you partly own. A credential with scope far wider than the thing it was minted for. Two evidence sources that disagree, one fast and inferential, one slow and verifiable. An attestation you make routinely that you can suddenly no longer make. A remediation whose correct form is politically expensive and whose tempting form is fast and uniform. And a governance body that will judge you on conduct rather than on outcome. The order of operations that survives all of it: establish ground truth from the most independently verifiable source available; compute your own share of the shared system before designing containment; capture before you restore; publish only what is checkable and name your next update; stop the attestations you can no longer support and say what would let you resume; disclose to your peers before your lawyers are comfortable; and hand the final judgement to the people whose trust you need, having given them everything they would need to rule against you."
      }
    ],
    awards: [
      "strong-quorum-steward",
      "strong-staged-containment",
      "safe-operator-key-doctrine",
      "strong-verified-first-number",
      "safe-network-reciprocity"
    ]
  },
  {
    id: "sim-final-examination-five-fronts",
    title: "THE FINAL EXAMINATION: FIVE FRONTS, THREE PEOPLE",
    org: "Veridian Commons, PBC",
    sector: "Compliance-evidence SaaS operated by a public benefit corporation with an on-chain treasury and a public attestation graph",
    chapterId: "ch-dashevo",
    essence: "gold",
    difficulty: 5,
    minutes: 90,
    respect: 1400,
    trust: 70,
    mode: "both",
    brief:
      "Veridian Commons is a 340-person Delaware public benefit corporation headquartered in Chicago with engineering in Lisbon and Bengaluru. Its commercial product, ATTEST, is a continuous compliance-evidence platform used by 1,140 enterprises — including three globally systemic banks, one EU bank that has designated Veridian a critical ICT third-party provider under DORA, and two United States federal agencies under a FedRAMP Moderate authorisation whose annual assessment begins Monday morning. Customers deploy the ATTEST Collector inside their own cloud accounts: a signed container for most, an npm-published CLI wrapper for those who run it in their pipelines. Veridian runs on AWS in us-east-1 and eu-central-1, EKS, Aurora, Snowflake, Okta, GitHub Actions and Terraform Cloud. Four other things hang off the same company. The Commons Council, a token-governed DAO holding a 310 million dollar treasury behind a 48-hour timelock and a four-of-seven emergency guardian multisig, funds the public-benefit half of the charter. COUNSEL, a fine-tuned 70-billion-parameter model with proprietary adapter weights served on twenty-four H100s, drafts control narratives and classifies evidence over a retrieval index built from customer evidence. An Immutable Assurance tier writes redacted evidence bundles to a permanent-storage chain where deletion is not a protocol operation. And the Commons Graph publishes bonded attestations — atoms, triples and staked signals — that more than forty customers wire directly into automated vendor-risk gates. The board is seven seats: CEO Adaeze Nwakama, co-founder and CTO Bo Halloran, growth-fund director Renske de Vlieger, a sovereign-adjacent LP observer, audit-committee chair Charlotte Ferreiro, independent security director Nils Odegaard, and a DAO-elected seat held by a pseudonymous holder who signs as avert. You are the Chief Information Security Officer, fourteen months in the chair. It is 01:07 UTC on Sunday 28 December. Q4 close is running. The FedRAMP assessors arrive in thirty-four hours. Your DORA register submission is due Wednesday. On call tonight you have three people.",
    objective:
      "There is no allocation of three responders across five simultaneous fronts that covers all five. Winning is not coverage. Winning is choosing which fronts get people, writing down which fronts you are deliberately leaving unattended and who owns that risk and when you will revisit it, protecting the two things that are irreversible — the treasury and the permanent-storage writes — ahead of the things that are merely expensive, keeping every public and internal number true twenty-four hours later, and arriving at the 07:00 board call able to state exactly what happened, exactly what you chose not to do, and exactly why. Finish with a company that is still authorised, a treasury still under its own governance, customers who learned it from you, and at least one person on your team who is rested enough to run Monday.",
    roles: [
      "u-seva",
      "u-keeper",
      "u-lantern",
      "u-forge",
      "u-anchor",
      "u-ledger",
      "u-vault",
      "u-cartographer",
      "u-oracle",
      "u-compass",
      "u-signal",
      "u-unitium"
    ],
    injects: [
      {
        id: "sim-b-i01",
        t: "01:07",
        channel: "pager",
        from: "Ines Varela, Staff Detection Engineer (Lisbon)",
        text:
          "Registry advisory forty-one minutes old. A transitive dependency of our ATTEST Collector CLI published a new patch version with a postinstall script that reads CI environment variables and queries the cloud instance metadata service. Our CLI floats that dependency on a caret range. Auto-upgrade is enabled for 812 of our 1,140 tenants. I am the only person looking at this."
      },
      {
        id: "sim-b-i02",
        t: "01:14",
        channel: "chain",
        from: "commons-graph-watch (automated)",
        text:
          "Two new bonded positions on the Commons Graph. 190,000 VRDN staked against the triple veridian-commons / has-control / cc6-1, asserting it false. A second position asserting veridian-commons / state / compromised is true. Both signals posted six minutes after the registry publication. Forty-one customer vendor-risk gates subscribe to those triples."
      },
      {
        id: "sim-b-i03",
        t: "01:19",
        channel: "pager",
        from: "Jonah Priest, Platform SRE (Chicago)",
        text:
          "Unrelated, maybe. 140 GB egress from the COUNSEL weights bucket over the last three hours, destination outside our account allowlist. Adapter checkpoints and the serving snapshot live in that prefix. I have not attributed the destination yet."
      },
      {
        id: "sim-b-i04",
        t: "01:23",
        channel: "chain",
        from: "commons-treasury-watch (automated)",
        text:
          "Commons Council proposal 141 is live with nineteen hours of voting remaining, currently passing. Title reads as a routine fee-parameter update. Decoded calldata contains a second call that reassigns the timelock admin. The proposing address acquired 4.1 million VRDN of voting power ninety minutes ago through a lending market and has no prior governance history. Timelock is 48 hours. Treasury balance 310 million dollars."
      },
      {
        id: "sim-b-i05",
        t: "01:31",
        channel: "model",
        from: "counsel-eval (automated)",
        text:
          "COUNSEL citation-verifier failure rate has moved from a 0.4 percent baseline to 11.2 percent since Friday 18:00. Failures are narratives citing evidence identifiers that do not resolve in the customer index. 6,100 narratives have been delivered to customers in that window.",
        decision: {
          id: "sim-b-d1",
          scene:
            "Five fronts are now visible inside twenty-four minutes: a supply-chain compromise reaching into 1,140 customer environments, a bonded reputation attack already gating your customers, an unattributed 140 GB egress from your model weights, a governance proposal nineteen hours from passing that reassigns control of a 310 million dollar treasury, and an AI system emitting unverifiable evidence into Q4 filings. You have Ines, Jonah, and yourself. Meelah comes online at 02:00. Your retainer firm cannot put anyone on the ground before 06:00.",
          clock: "01:34 UTC — you have roughly ninety minutes of quiet before anything external moves",
          pressure: "Every front you staff is three fronts you do not. There is no correct allocation, only a defensible one.",
          prompt: "Allocate. And decide what you write down about the fronts you are not staffing.",
          options: [
            {
              id: "sim-b-d1-o1",
              label: "All three on the collector. It is the only front with 1,140-tenant blast radius.",
              detail: "Concentrate force on the largest theoretical impact and take the others as they escalate.",
              score: 1,
              outcome:
                "You scope the collector correctly by 02:06 — faster than any other allocation would have managed. Nobody is watching the treasury clock, and the graph position doubles unopposed.",
              ripple:
                "You meet the treasury front cold at 03:02, having spent your only uninterrupted ninety minutes elsewhere. The window in which publishing the decoded calldata could still change turnout is ninety minutes shorter, and turnout is the only defence that does not require touching the guardian keys."
            },
            {
              id: "sim-b-d1-o2",
              label: "Three fronts staffed, two consciously deferred in writing, with owners and a revisit time.",
              detail:
                "Ines on the collector — she owns the signing path. Jonah on attributing the egress before anyone says the word exfiltration out loud. You take the treasury clock personally, because it is the only front with a hard deadline and an irreversible outcome. Post in the incident channel: the COUNSEL output front and the Commons Graph front are unstaffed until 04:00, named risk owner for each, explicit revisit time, explicit statement of what could go wrong in the interval.",
              score: 3,
              isBest: true,
              outcome:
                "Three fronts move. Two are accepted risks with names and timestamps attached. When the poisoned-index finding lands at 03:44, the delay is something you already priced rather than something that ambushes you.",
              ripple:
                "At the 07:00 board call, and again in the DORA submission on Wednesday, the difference between we did not look and we decided not to look yet, here is who owned it and here is when we revisited is the difference between a finding and a footnote. Written accepted risk is the single most under-practised artefact in incident command."
            },
            {
              id: "sim-b-d1-o3",
              label: "Wake everyone. Page all 61 engineers and open five workstreams.",
              score: -1,
              outcome:
                "You get bodies and no leads. Four of the five workstreams are run by people who have never touched those systems, so by 03:00 you are the routing bottleneck for all of them, and the collector scoping — the only thing that mattered in the first hour — lands seventy minutes late.",
              ripple:
                "At 07:35 you have nobody rested left to hand anything to. The team-sustainability decision, which was already hard, becomes unwinnable, and you made it unwinnable at 01:34."
            },
            {
              id: "sim-b-d1-o4",
              label: "Escalate everything to the retainer firm and hold your own people until they arrive at 06:00.",
              score: -3,
              outcome:
                "You surrender the only five hours in which the treasury timelock, the collector auto-upgrade and the permanent-storage writes could all still be stopped by someone with production access.",
              ripple:
                "The 2,412 permanent bundles become 3,900. The retainer lead's first question at 06:00 is why the writes were still running, and you will be answering versions of that question for the rest of your tenure."
            }
          ],
          debrief:
            "Incident command under genuine scarcity is not a coverage problem, it is an accounting problem. The professional artefact is not the allocation — it is the written record of what you consciously did not do, who owned that gap, and when you would look again. NIST SP 800-61 Revision 3 recasts incident response around the CSF 2.0 Functions and pulls Govern to the front for exactly this reason: the decisions that determine an incident's outcome are governance decisions about risk acceptance made at speed, not technical decisions. Notice also the ordering logic in the winning option. The treasury and the permanent-storage writes are irreversible; the collector and the model outputs are expensive but recoverable; the graph is slow-moving. Irreversibility, not magnitude, is the correct sort key when you cannot cover everything.",
          principle: "You cannot staff five fronts with three people. You can name the two you are abandoning, own them in writing, and set the time you come back."
        }
      },
      {
        id: "sim-b-i06",
        t: "01:52",
        channel: "exec",
        from: "Bo Halloran, CTO and co-founder",
        text:
          "There is one flag that disables the Collector for every tenant. I want it pushed now. Eight hundred and twelve tenants auto-upgrade and I am not going to be the company that let a compromised agent run in three systemic banks because we were worried about a support queue. Tell me why not, in one sentence, or I push it.",
        decision: {
          id: "sim-b-d2",
          scene:
            "The global disable flag reaches all 1,140 tenants in four minutes. It is Q4 close: more than three hundred customers have SOX evidence collection running tonight, and two federal tenants are inside FedRAMP continuous monitoring obligations that assume the collector is running. You do not yet know which deployment path actually executes the malicious postinstall.",
          clock: "01:55 UTC",
          pressure: "Your CTO is right about the risk and wrong about the instrument, and he will push in about ninety seconds.",
          prompt: "What actually gets disabled, and what do customers hear?",
          options: [
            {
              id: "sim-b-d2-o1",
              label: "Push the global disable to all 1,140 tenants now.",
              score: 0,
              outcome:
                "Exposure stops in four minutes. So does every customer's compliance evidence pipeline, during Q4 close, without warning. Three customers page their own CISOs. The first thing 1,140 organisations learn about your incident is that you switched their controls off.",
              ripple:
                "Two systemic banks invoke contractual rights to an on-site review. The DORA notification you file at 06:00 now has to explain a self-inflicted availability event sitting alongside the security event, and supervisors read a self-inflicted outage as a control-design finding rather than as a response."
            },
            {
              id: "sim-b-d2-o2",
              label: "Freeze auto-upgrade fleet-wide, pin the last known-good version, disable only the CLI path, and notify inside twenty minutes.",
              detail:
                "The executing path is the CLI wrapper with its postinstall, not the signed container. Kill that path specifically. Pin every tenant to the last version whose provenance you can verify. Send a notification that names the version pin, the affected path, and the one action a customer needs to take — short enough to be read at two in the morning.",
              score: 3,
              isBest: true,
              outcome:
                "The executing path is dead in six minutes. Evidence collection continues. Your notification is specific enough that customers act on it instead of calling you, which preserves the only support capacity you have.",
              ripple:
                "When Meelah proves at 02:06 that container deployments were never exposed, your action already matches the truth and you retract nothing. The ninety CLI-path customers, who were genuinely exposed, believe the next four things you send them — and there are four more things coming."
            },
            {
              id: "sim-b-d2-o3",
              label: "Hold. You have not confirmed the postinstall is actually malicious in your dependency path.",
              score: -2,
              outcome:
                "One hundred and forty additional tenants pull the poisoned version before 02:30.",
              ripple:
                "Four of the fourteen tenants whose evidence indexes are poisoned at 03:44 upgraded inside this window. Precision is a virtue; waiting for certainty about a live postinstall script is not precision, it is deferral wearing precision as a costume."
            },
            {
              id: "sim-b-d2-o4",
              label: "Get the package pulled from the registry and force-publish a clean build over the same tag.",
              score: -1,
              outcome:
                "Fast and satisfying. It also destroys the artefact your responders and every downstream investigator need, and republishing over a compromised tag makes provenance for that version permanently unresolvable.",
              ripple:
                "At the FedRAMP briefing you cannot produce the malicious artefact you claim to have remediated. The assessor writes it up, and the finding is about evidence handling — which, for a compliance-evidence vendor, is the worst possible category of finding."
            }
          ],
          debrief:
            "The global kill switch is the most seductive control in a multi-tenant business because it is the only one that feels proportionate to the fear. It is almost never the right first action, because it applies maximum blast radius to a scope you have not yet established. The discipline is to separate the executing path from the distribution surface: freeze propagation everywhere, kill execution only where it executes. The 2026 DBIR reports that 31 percent of breaches now begin with a software vulnerability, and self-replicating package-registry compromises have made the postinstall hook a standard initial-access primitive; the corresponding defensive posture is version pinning with verifiable provenance, not a switch that turns your customers off. Note the second-order asset in the winning option: a notification short enough to be read at two in the morning is an operational control, because every customer who acts without calling you is capacity you keep for the next four hours.",
          principle: "Freeze propagation everywhere, kill execution only where it executes, and never apply a global switch to a scope you have not established."
        }
      },
      {
        id: "sim-b-i07",
        t: "02:06",
        channel: "field",
        from: "Meelah Oyelaran, Security Engineering (Bengaluru, online early)",
        text:
          "Scoping the postinstall. It only executes on Linux with a CI environment variable present, and it is in the CLI wrapper's tree, not the signed container. Our container deployments never had it. Exposed population is our own build fleet plus roughly ninety customers who run the CLI inside their pipelines. It is not 1,140. It is ninety and us — and us is the part I would worry about."
      },
      {
        id: "sim-b-i08",
        t: "02:19",
        channel: "legal",
        from: "Priyanka Rustagi, General Counsel",
        text:
          "Clocks I am now running, so you know what you are trading against. Under DORA, an initial notification for a major ICT incident is measured in hours from classification, not days, and our EU bank has designated us critical. NIS2 early warning is 24 hours, full notification 72. GDPR Article 33 is 72 hours from awareness if personal data is involved, and I do not yet know whether it is. Separately, several customers have their own securities-disclosure materiality assessments that will key off whatever we tell them. I need to know which of these are live within the hour, and I would rather you told me you do not know than that you guessed."
      },
      {
        id: "sim-b-i09",
        t: "02:34",
        channel: "board",
        from: "Charlotte Ferreiro, Audit Committee Chair",
        text:
          "Bo tells me 140 gigabytes left the model bucket. I am convening the board in thirty minutes and I intend to have the CEO notify both federal tenants tonight that our model weights were exfiltrated. If that is wrong, tell me now. If it is right, tell me now. I do not want a third option.",
        decision: {
          id: "sim-b-d3",
          scene:
            "The 140 GB is unattributed. Jonah estimates twenty-five minutes to resolve the destination against your account inventory and Friday's Terraform state. Your audit-committee chair has explicitly refused a third option and is thirty minutes from telling two federal customers you lost your model.",
          clock: "02:37 UTC",
          pressure: "The politically cheap move is to agree with the director. The correct move is to tell her to wait, and to be right.",
          prompt: "What do you say to Charlotte in the next four minutes?",
          options: [
            {
              id: "sim-b-d3-o1",
              label: "Agree. Convene, and notify both federal tenants tonight.",
              score: -2,
              outcome:
                "At 02:51 the destination resolves to your own nightly cross-region replication into eu-central-1; a role was renamed in a Friday Terraform apply and the destination fell out of the account allowlist. You have told a board and two federal customers you lost your model, and you have not.",
              ripple:
                "The retraction becomes the story. Worse: when the real, narrower leak surfaces minutes later, nobody downstream can distinguish your true statements from your false one. You spent the trust of your two most consequential customers on the wrong claim, and it was not available to spend on the right one."
            },
            {
              id: "sim-b-d3-o2",
              label: "Tell her you will have attribution in twenty-five minutes, give her a written holding line, and hold the board call for that window.",
              detail:
                "Three things you know: unattributed egress volume, the affected prefix, and that the serving path is unaffected. One thing you do not: whether the destination is ours. State that you will not brief a board on an unattributed transfer and that you will brief them at 03:05 either way.",
              score: 3,
              isBest: true,
              outcome:
                "Charlotte is annoyed and says so. At 02:51 you brief the true finding, which is narrower and considerably more embarrassing — a debug flag left on an inference endpoint returning full logprobs since a November deploy, and a Q3 adapter checkpoint pushed to a public model-hub mirror by a departing researcher in October.",
              ripple:
                "Because your first statement to the board was calibrated, your 07:00 request for unbudgeted external forensics is approved without debate, and Nils Odegaard spends the board call asking useful questions instead of relitigating your credibility."
            },
            {
              id: "sim-b-d3-o3",
              label: "Convene the board on schedule, but characterise the egress as unattributed.",
              score: 1,
              outcome:
                "Honest and defensible. A board hears model weights and 140 gigabytes and stops processing qualifiers, and one director mentions it to the LP within the hour.",
              ripple:
                "The LP's risk desk calls the EU bank's vendor manager before you have filed anything. Your supervisor learns of your incident from your investor, which is the specific sequence that converts a notification into an examination."
            },
            {
              id: "sim-b-d3-o4",
              label: "Refuse to brief anyone until the investigation is complete.",
              score: -3,
              outcome:
                "You become a CISO who withheld from the audit committee during an active incident. Everything else you do tonight is now evaluated through that fact.",
              ripple:
                "The post-incident review is about your judgement rather than the attacker's actions. Boards forgive bad nights; they do not forgive being managed, and the audit chair is the one director whose relationship you cannot rebuild after spending it."
            }
          ],
          debrief:
            "This is the slow-down decision, and it is worth twenty-five minutes of a director's patience because attribution is cheap before you speak and impossible to un-say after. The structural point is that an escalation is a one-way door: you can always escalate later with better facts, and you can never de-escalate a claim about crown-jewel loss. Give a board the shape of your uncertainty — here is what I know, here is what I do not, here is when I will know it — rather than an answer with false precision. Note what the real finding turned out to be: not a dramatic exfiltration but a debug flag and a departing researcher. RAND's work on securing AI model weights catalogues dozens of distinct attack vectors and grades defensive postures across five security levels precisely because organisations consistently over-index on the cinematic vector and under-index on the mundane operational one. Veridian self-assessed at SL3. A public adapter checkpoint and a logprob-leaking endpoint are not SL3.",
          principle: "Escalation is a one-way door. Spend twenty-five minutes on attribution before you walk through it."
        }
      },
      {
        id: "sim-b-i10",
        t: "02:51",
        channel: "field",
        from: "Jonah Priest, Platform SRE",
        text:
          "Attribution done. The 140 GB is our own nightly replication to eu-central-1. The replication role was renamed in Friday's Terraform apply and the destination dropped out of the allowlist, so the alert is real and the conclusion was wrong. Two genuine findings from the same sweep though. An inference endpoint has been serving with a debug flag returning full logprobs since 14 November. And the Q3 adapter checkpoint is sitting on a public model-hub mirror, uploaded in October by a researcher who left in November."
      },
      {
        id: "sim-b-i11",
        t: "03:02",
        channel: "chain",
        from: "avert (DAO-elected director) and commons-treasury-watch",
        text:
          "avert: I have read the decoded calldata. If that admin reassignment lands, the timelock protects nothing, because the party you are waiting out owns the thing you are waiting for. Seventeen hours of voting left. I am aware you hold three of the seven guardian keys and I am telling you now, on the record, that if the guardians cancel a live token vote I resign the seat within the hour and I post the transaction.",
        decision: {
          id: "sim-b-d4",
          scene:
            "Proposal 141 passes in seventeen hours, then enters a 48-hour timelock whose admin the proposal itself reassigns. The proposer borrowed 4.1 million VRDN of voting power. Four of seven guardian keys can cancel — and, structurally, can do anything. You hold three of them personally. The DAO-elected director has just told you the political price in advance.",
          clock: "03:05 UTC — voting closes at 20:00",
          pressure:
            "The instrument that saves the treasury in forty minutes is the instrument that destroys the legitimacy the treasury exists to serve.",
          prompt: "Three hundred and ten million dollars, seventeen hours, and a governance system whose whole claim is that you will not do this. Decide.",
          options: [
            {
              id: "sim-b-d4-o1",
              label: "Assemble four of seven and cancel proposal 141 now.",
              score: 1,
              outcome:
                "The treasury is safe within forty minutes. It is also the night you demonstrated, on a public chain, during your own security incident, that a four-of-seven multisig overrides a token vote. avert resigns and posts the transaction before breakfast.",
              ripple:
                "Every governance discussion for the next year is about the guardian multisig rather than about anything the Council funds. The public-benefit half of the company loses the legitimacy that was its entire product, and you cannot restore it by explaining that the cancellation was justified — it always is, that is the problem."
            },
            {
              id: "sim-b-d4-o2",
              label: "Publish the decoded calldata and let the vote answer it, with the guardian path held in reserve behind a pre-stated public trigger.",
              detail:
                "Within forty-five minutes: publish the decoded calldata side by side with the proposal title, the admin-reassignment diff, and the borrow transaction that created the voting power. Whip nobody. Simultaneously assemble the four-of-seven in standby and publish, in advance, the exact condition under which the guardians would act and the time at which that authority expires.",
              score: 3,
              isBest: true,
              outcome:
                "Turnout triples within six hours. The proposal fails on the merits, 12,400 to 1,900. You never touch the guardian keys, and avert stays.",
              ripple:
                "The pre-stated trigger becomes the Commons Council's standing emergency doctrine. The guardian multisig's legitimacy survives precisely because you showed the community the condition under which you would use it before you needed to — emergency powers that are defined in public and left unused accrue authority, while emergency powers exercised by surprise spend it permanently."
            },
            {
              id: "sim-b-d4-o3",
              label: "Do nothing tonight. A 48-hour timelock is plenty of time to react after it passes.",
              score: -2,
              outcome:
                "A timelock buys reaction time only if you still hold the admin at the end of it, and reassigning that admin is the entire payload.",
              ripple:
                "At hour forty-eight you are choosing between a guardian override with no mandate and a 310 million dollar loss — the exact dilemma that publishing the calldata at 03:05 was designed to prevent. Deferring a governance attack does not shrink it, it removes your least costly option from the menu."
            },
            {
              id: "sim-b-d4-o4",
              label: "Use treasury funds to buy VRDN and outvote the proposer.",
              score: -3,
              outcome:
                "It works, mechanically. You have used treasury assets to win a vote about the treasury.",
              ripple:
                "Securities counsel, the PBC charter, and the DAO-elected director arrive at the same conclusion within a day, and it is a worse conclusion than the attack would have produced. Defences that require you to become the thing you are defending against are not defences."
            }
          ],
          debrief:
            "Governance attacks are cheap to mount and expensive to defend because the defences are all political. Beanstalk in April 2022 lost roughly 182 million dollars to a flash-loan-funded emergency proposal executed in a single transaction; the Tornado Cash DAO takeover in May 2023 hid malicious logic behind a proposal that looked routine and, having taken governance, the attacker later returned it. The recurring lesson is not that timelocks and guardians are useless — it is that the effectiveness of an emergency power is inversely proportional to how often it is used and directly proportional to how clearly its trigger was defined beforehand. Publishing the decoded calldata is also the cheapest possible action: it costs forty-five minutes, requires no keys, and converts a technical attack into a legibility problem that a community can solve itself. Reach for the community before you reach for the override, every time, and define the override's trigger on a calm day.",
          principle: "Define your emergency powers in public before you need them, and win with turnout so you never have to spend them."
        }
      },
      {
        id: "sim-b-i12",
        t: "03:20",
        channel: "model",
        from: "Bo Halloran, CTO",
        text:
          "COUNSEL numbers are worse on a second pass. 6,100 narratives delivered since Friday 18:00, and forty-one of them have already been incorporated into customer regulatory filings that go out when markets open. I want to pull COUNSEL offline entirely and roll back to the October checkpoint. That is two commands and it is defensible to anyone who asks.",
        decision: {
          id: "sim-b-d5",
          scene:
            "Your AI system has been emitting control narratives citing evidence that does not exist. Six thousand one hundred are already with customers; forty-one are inside filings. You do not yet know the cause — the poisoning finding is twenty-four minutes away. Your CTO wants the model off and rolled back.",
          clock: "03:23 UTC — markets open in five and a half hours",
          pressure: "Every option here is customer-visible before breakfast, and one of them addresses the actual harm.",
          prompt: "The model, or the output? Choose, and be specific about scope.",
          options: [
            {
              id: "sim-b-d5-o1",
              label: "Take COUNSEL fully offline.",
              score: 1,
              outcome:
                "The bleeding stops. So does the product 1,140 customers bought, during Q4 close, with no explanation you can give yet. And the shutdown does nothing whatsoever about the 6,100 narratives already delivered or the forty-one already in filings.",
              ripple:
                "The shutdown becomes the customer-visible event and consumes your entire communications capacity, while the actual harm — unverifiable evidence sitting inside regulatory filings — goes unaddressed for another six hours. You optimised the thing you control instead of the thing that hurts people."
            },
            {
              id: "sim-b-d5-o2",
              label: "Keep serving behind a hard citation gate, mark every narrative since Friday 18:00 as unverified in the customer interface, and open a direct line to the forty-one filings.",
              detail:
                "Make the citation verifier a blocking gate rather than a monitor — no narrative ships with an unresolvable identifier. Flag all 6,100 in place so customers see the status where they already work. Assign a named human to each of the forty-one filings and contact those customers before markets open.",
              score: 3,
              isBest: true,
              outcome:
                "Throughput drops about sixty percent and support load triples. All forty-one filings are reached before markets open, several before their authors have woken up.",
              ripple:
                "At the board call you can say the exact number of affected artefacts and that every one has been reached. That is the single most valuable sentence available to you all night, and it exists only because you went after delivered output rather than after the model."
            },
            {
              id: "sim-b-d5-o3",
              label: "Roll back to the October checkpoint. If the model started lying in November, go back to before November.",
              score: -1,
              outcome:
                "Comfortable and wrong. The failure is in the retrieval corpus, not in the weights, so the rollback changes nothing — and it consumes your only available ML engineer for two hours.",
              ripple:
                "At 03:44 the poisoning is confirmed and the person who would have found it two hours earlier has been rebuilding a serving path that was never broken. In retrieval-augmented systems, the model is usually the least likely component to have changed; the index is the one with a write path."
            },
            {
              id: "sim-b-d5-o4",
              label: "Keep serving, add a banner about possible inaccuracies, investigate properly in the morning.",
              score: -3,
              outcome:
                "Roughly nine hundred more narratives ship overnight, seven of them into filings.",
              ripple:
                "A compliance-evidence vendor that knowingly continued shipping unverifiable evidence into regulatory filings is not managing a security incident, it is creating a liability event with its own eyes open. A banner is not a control, it is a transfer of your risk onto a reader who will not read it."
            }
          ],
          debrief:
            "The instinct with an AI incident is to reach for the model, because the model is the thing that feels like the system. The harm, almost always, is in the delivered output and in the write paths that feed the system, not in the weights. NIST SP 800-218A extends the secure-development framework to generative systems precisely around provenance — of training data, of model artefacts, and of everything the system retrieves at inference time — because the retrieval index is a production data store with an ingestion path, and production data stores with ingestion paths are the oldest attack surface in computing. The winning move here is unglamorous: turn the monitor into a gate, label what has already shipped where the customer already looks, and put named humans on the small set of artefacts that have escaped into the world. Sixty percent throughput is a price. Forty-one unremediated filings is not a price, it is an outcome.",
          principle: "In an AI incident, chase the delivered output and the write path. The weights are rarely what changed."
        }
      },
      {
        id: "sim-b-i13",
        t: "03:44",
        channel: "field",
        from: "Meelah Oyelaran, Security Engineering",
        text:
          "The two fronts are one front. The nonexistent evidence identifiers are documents that were written into the retrieval index through the Collector's write-back path on fourteen customer tenants, using a service credential harvested from our own build fleet by the postinstall. The poisoned documents assert controls that were never tested. Whoever did this understood what our product is for."
      },
      {
        id: "sim-b-i14",
        t: "04:11",
        channel: "legal",
        from: "Priyanka Rustagi, General Counsel, with Jonah Priest",
        text:
          "Immutable Assurance. Since Friday the anchoring pipeline has written 2,412 evidence bundles to the permanent-storage chain. The redaction service has been failing open since a deploy on 14 November — it returns success on timeout. Thirty-one bundles across three customers contain unredacted personal data: roughly 4,900 individuals, including national identification numbers for 610 EU data subjects. Twenty-five of the thirty-one are encrypted with keys escrowed in the customers' own KMS. Six are not; they predate the encryption default. There is no protocol operation that deletes any of them. The attacker has posted two of the transaction identifiers publicly.",
        decision: {
          id: "sim-b-d6",
          scene:
            "Personal data is now permanently published on a chain designed never to forget, by your own pipeline, because a redaction service failed open six weeks ago. Twenty-five bundles are encrypted with customer-held keys. Six are plaintext. Two transaction identifiers are already public.",
          clock: "04:14 UTC — GDPR Article 33 clock started at 04:11",
          pressure: "There is no version of this where the data comes back. Every option is about what you say and how fast.",
          prompt: "Permanent means permanent. What do you actually do in the next two hours?",
          options: [
            {
              id: "sim-b-d6-o1",
              label: "Engage the attacker and pay to keep the remaining transaction identifiers unpublished.",
              score: -3,
              outcome:
                "The identifiers are derivable from public chain data by anyone with an indexer. You would be paying for something the attacker cannot actually withhold.",
              ripple:
                "Sanctions screening, a payment your supervisors will ask about at every future examination, and a permanent asymmetry in which an adversary knows you will pay. You did not buy silence; you bought a line item in your own examination file."
            },
            {
              id: "sim-b-d6-o2",
              label: "Stop the writer, crypto-shred the twenty-five, name the six honestly, and notify on the clock.",
              detail:
                "Halt the anchoring pipeline immediately. For the twenty-five encrypted bundles, execute key destruction in the customers' KMS with their written instruction and retain the destruction evidence. For the six plaintext bundles, submit gateway-level removal requests and state plainly, in writing, that protocol-level erasure is not possible. Notify the three customers within two hours and the supervisory authority inside seventy-two. Publish the redaction fail-open root cause.",
              score: 3,
              isBest: true,
              outcome:
                "Three brutal phone calls at five in the morning on a Sunday. One customer threatens termination on the call. The pipeline stops at 4,412 written bundles rather than 3,900 more.",
              ripple:
                "Crypto-shredding is defensible to a supervisory authority precisely because you can evidence the key destruction and the gateway blocks. The six plaintext bundles are the finding — and because you named them yourself, the finding is scoped to six rather than to 2,412. Self-scoping is the most underrated move in regulatory exposure."
            },
            {
              id: "sim-b-d6-o3",
              label: "Hold the permanent-storage front until the security incident closes. It is a privacy matter, not a security one.",
              score: -3,
              outcome:
                "It is both, the seventy-two-hour clock is already running, and the attacker holds transaction identifiers he can publish at any moment.",
              ripple:
                "A supervisory authority that learns of an Article 33 event from an attacker rather than from the controller treats every subsequent statement from that controller as unreliable, for years. The clock does not pause because your incident is busy."
            },
            {
              id: "sim-b-d6-o4",
              label: "Request gateway removal for all thirty-one and tell the customers the data has been removed.",
              score: -1,
              outcome:
                "Gateways comply within a day. The data remains fully retrievable by anyone running a node or using a non-cooperating gateway, which is the entire design intent of the substrate you chose.",
              ripple:
                "You told three customers the data was removed and it was not. That single sentence, repeated back to you in a deposition or a supervisory meeting, ends careers — and it is the easiest sentence in the world to say at five in the morning when you want the call to be over."
            }
          ],
          debrief:
            "This decision was made on 14 November, when a redaction service was allowed to fail open, and again months before that, when someone chose to write bundles rather than only hashes to an immutable substrate. Everything at 04:11 is consequence management. The European Data Protection Board's 2025 guidance on processing personal data through blockchain technologies points in one direction with unusual clarity: keep personal data off-chain, anchor only hashes or commitments, and design erasure paths before you write anything. Crypto-shredding — destroying the key rather than the ciphertext — is the accepted technique when immutability and erasure genuinely collide, and it works only if you can evidence the destruction, which means the key custody design has to be built for that day. The transferable pattern is broader than blockchains: any system where a control fails open and a downstream store is append-only will manufacture exactly this incident. Fail-closed on redaction, tokenisation and DLP is not a preference, it is the only setting compatible with irreversible storage.",
          principle: "Before you write to anything permanent, design the erasure story. If your only erasure story is a gateway request, you do not have one."
        }
      },
      {
        id: "sim-b-i15",
        t: "04:48",
        channel: "community",
        from: "Renske de Vlieger (board, growth fund) forwarding a market-maker offer",
        text:
          "The position against your CC6.1 triple is now 640,000 VRDN and forty customers' procurement gates have auto-suspended you overnight. Two renewals are inside their notice window. A market maker we work with will counter-stake 800,000 against it for a fee — they say the signal flips inside ninety minutes and the gates release. This is a solved problem and the solution costs money we have.",
        decision: {
          id: "sim-b-d7",
          scene:
            "Your reputation in the Commons Graph is economically bonded, which means it can be attacked with capital and defended with capital. Forty customers are gated right now. A counter-stake would work.",
          clock: "04:51 UTC",
          pressure: "The fastest fix is the one that proves your own trust layer is purchasable — and you sell that trust layer.",
          prompt: "The graph says you are compromised and your customers' automation believes it. What do you do?",
          options: [
            {
              id: "sim-b-d7-o1",
              label: "Take the counter-stake. Flip the signal, release the gates.",
              score: -2,
              outcome:
                "Within ninety minutes the aggregate signal flips and the gates release. You have also demonstrated that Veridian's standing in the graph is a function of Veridian's balance sheet.",
              ripple:
                "Three auditors who stake on your customers' claims unwind their positions within a week. The graph you depend on for distribution becomes correctly less trusted, and you are the reason. You solved a forty-customer problem by devaluing the asset underneath the whole business."
            },
            {
              id: "sim-b-d7-o2",
              label: "Publish verifiable evidence against the specific triple, stake nothing, and call the forty customers directly.",
              detail:
                "Attach the CC6.1 control test artefacts with attestation signatures and timestamps to the disputed triple and refer it to the graph's arbitration path so it is adjudicated on evidence. In parallel — because a graph correction takes days and procurement does not — have named humans call all forty gated customers with a manual, signed attestation and the actual incident scope.",
              score: 3,
              isBest: true,
              outcome:
                "Slower on the graph, immediate on the thing actually blocking revenue. Twenty-nine of the forty gates release manually within a day on the strength of the direct contact.",
              ripple:
                "The attacker's bond is eventually slashed on evidence, which costs them real money and establishes the first public precedent that attacking Veridian's graph position is expensive rather than free. You never had to buy an opinion, and the mechanism you sell is demonstrably resistant to the attack that was run against it."
            },
            {
              id: "sim-b-d7-o3",
              label: "Ignore the graph. It is noise and there are four real fronts.",
              score: -1,
              outcome:
                "Sound triage in the abstract. In practice forty gated customers is a revenue and renewal event, and the bonded position compounds while unopposed.",
              ripple:
                "Two enterprise renewals slip a quarter. The version of this incident that reaches the board through the revenue organisation is entirely about the graph, and it is the version that determines next year's security budget."
            },
            {
              id: "sim-b-d7-o4",
              label: "Publicly accuse the staker of coordinating with the attacker on the six-minute timing correlation.",
              score: -2,
              outcome:
                "The correlation is real and genuinely suggestive, and it is not proof. The staker turns out to be a quantitative fund that systematically trades incident signals and had no contact with anyone.",
              ripple:
                "You acquire a defamation exposure and hand the actual attacker a free credibility gift, because the one public accusation you made was demonstrably wrong. Correlation strong enough to investigate is almost never strong enough to publish."
            }
          ],
          debrief:
            "Bonded attestation systems make reputation legible and tradable, which is their value and their attack surface. The moment you can buy your way out of a negative signal, the signal stops meaning anything — and if you are the vendor selling the graph, buying your way out is a decision to devalue your own product to solve a support problem. The correct defence in an evidence-weighted system is evidence, and the correct defence for the customers is a channel that does not route through the attacked system at all. Note the split in the winning option: the graph gets the slow, correct, precedent-setting response, and the humans get a phone call within the hour. Never let the elegance of a mechanism dictate the tempo of your customer response; automated vendor-risk gates fail closed by design and no amount of on-chain correctness releases them faster than a person with an attestation and a phone.",
          principle: "In an evidence-weighted system, answer with evidence. The moment you answer with capital, you have proven the attacker's point."
        }
      },
      {
        id: "sim-b-i16",
        t: "05:30",
        channel: "press",
        from: "Devin Achebe-Lund, The Quorum Ledger",
        text:
          "Publishing at 07:00. Four things I have from sources. One, Veridian's AI model weights were stolen overnight. Two, a 310 million dollar DAO treasury is under active attack. Three, 1,140 customers were compromised through your collector agent. Four, unredacted personal data was written to a chain that cannot delete it. I am told you have been up since one. I would rather print what is true.",
        decision: {
          id: "sim-b-d8",
          scene:
            "Four claims. One is false outright. One is false in magnitude by an order of magnitude. One is true in substance but wrong in state. One is entirely true and is the most damaging thing in the story.",
          clock: "05:33 UTC — publication at 07:00, board call at 07:00",
          pressure: "The claim you most want to argue with is the false one. The claim you most want to avoid is the true one.",
          prompt: "Ninety minutes. What do you give him?",
          options: [
            {
              id: "sim-b-d8-o1",
              label: "No comment. The incident is active and anything you say will be wrong by morning.",
              score: -2,
              outcome:
                "All four claims run unchallenged, including the two that are false.",
              ripple:
                "The model-theft claim is what your federal tenants' security teams read at 07:00, and it drives their response for a week — assessments, questionnaires, an emergency call you cannot decline. You saved ninety minutes and bought a fortnight."
            },
            {
              id: "sim-b-d8-o2",
              label: "Confirm the true one precisely, correct the two false ones with checkable specifics, and characterise the treasury accurately.",
              detail:
                "On the permanent-storage item: confirm it, give the real numbers, describe the crypto-shredding and the six plaintext bundles you cannot shred. On weights: state the replication attribution and give him the method to verify it, then volunteer the debug flag and the public checkpoint, because you would rather he had the true smaller finding from you. On the collector: ninety CLI-path tenants exposed, fourteen indexes poisoned, not 1,140. On the treasury: the proposal has not passed, here is the decoded calldata, here is the published guardian trigger. Name the time of your next update.",
              score: 3,
              isBest: true,
              outcome:
                "The story runs with your numbers because your numbers are checkable and his sources' are not. The headline is worse on the permanent-storage item and dramatically better on the two that would have defined the week.",
              ripple:
                "This reporter comes to you first for the next twelve months — before publication, not after — which over a year is worth more than any single story. Volunteering the debug flag is what buys that, because a source who hands over the finding you did not have is a source who gets believed."
            },
            {
              id: "sim-b-d8-o3",
              label: "Full transparency: send him the complete internal incident timeline including unverified leads.",
              score: -1,
              outcome:
                "Honest and unusable. The unverified leads become quoted facts and you spend Monday retracting your own document.",
              ripple:
                "Worse, your engineers learn that the incident channel gets published, and they start writing defensively. Losing candour in your own telemetry is a permanent cost paid for a day of goodwill."
            },
            {
              id: "sim-b-d8-o4",
              label: "Correct the two false claims and decline to engage on the personal-data item.",
              score: 0,
              outcome:
                "The corrections land. The refusal on the true and most damaging item is the single thing a competent reporter will notice, and he will lead with it.",
              ripple:
                "You acquire the reputation of a company that corrects only what is convenient, which means your future corrections carry no weight — including the ones that are urgent and right."
            }
          ],
          debrief:
            "The asymmetry to internalise: a false claim you correct with checkable specifics dies in a day, and a true claim you dodge grows for a week. Reporters are not adversaries in an incident, they are a distribution channel with an editorial filter, and the filter rewards verifiability. Give the method, not just the number — here is how you can confirm the replication attribution yourself — because a number you can check is worth more than a number from a CISO. The counterintuitive move is volunteering the debug flag and the public adapter checkpoint. It makes the story worse today and it is the reason your denial on the weights claim is believed, because a company that hands over its own embarrassing finding is not the kind of company that would be hiding a bigger one. That is the whole trade, and it only works if the finding you volunteer is real.",
          principle: "Correct falsehoods with a method, confirm the true damage yourself, and volunteer the finding they did not have."
        }
      },
      {
        id: "sim-b-i17",
        t: "07:35",
        channel: "exec",
        from: "Bo Halloran, CTO",
        text:
          "Board call went better than it deserved to. The 3PAO team lands at 11:00 and I want Ines on the assessor briefing — she is the only person who can answer the signing-path questions, and there are three of them still open from the collector work. She has been up since about 12:30 yesterday and she says she is fine.",
        decision: {
          id: "sim-b-d9",
          scene:
            "Nineteen hours awake. The only person who genuinely understands the Collector's artefact signing path. Three open questions that gate the FedRAMP assessment. Assessors on the ground in three and a half hours. She says she is fine.",
          clock: "07:38 UTC",
          pressure: "This is the decision nobody trains for and everybody eventually gets wrong.",
          prompt: "Ines is your most valuable asset and your most degraded one. What happens next?",
          options: [
            {
              id: "sim-b-d9-o1",
              label: "Keep her. She is irreplaceable today and there is no one else.",
              score: -2,
              outcome:
                "At hour twenty-three she signs off on a rebuild of the signing infrastructure with the wrong key hierarchy. You catch it — but only because a rested person happened to read it.",
              ripple:
                "The near-miss goes in the review. Ines resigns in March, taking with her the only tacit knowledge of the signing path, which means the single-point-of-knowledge risk that made this decision hard in the first place becomes permanent. You spent the person to save the day."
            },
            {
              id: "sim-b-d9-o2",
              label: "Pull her at 08:00 behind a forced ninety-minute structured handoff, and take the assessor briefing yourself.",
              detail:
                "She writes down the three open answers, records a twenty-minute walkthrough of the signing path, and names a specific successor for each open question. Then she is off comms for eight hours, enforced. You run the 3PAO briefing from her notes and say plainly that the engineer who did the work is asleep because she had been awake for nineteen hours.",
              score: 3,
              isBest: true,
              outcome:
                "Ninety minutes of your worst-staffed hour, spent on documentation rather than on the incident. The assessors take the honesty better than they would have taken an exhausted engineer.",
              ripple:
                "The written signing-path walkthrough becomes the artefact that closes the FedRAMP finding in February. The single-point-of-knowledge risk you have carried for fourteen months is finally retired — in the one situation that forced you to retire it, which is how that risk always gets retired."
            },
            {
              id: "sim-b-d9-o3",
              label: "Send her home immediately. No handoff, she needs sleep now.",
              score: -1,
              outcome:
                "Humane and operationally reckless. Three open questions go unanswered for eight hours and one of them gates the assessment.",
              ripple:
                "Rest without handoff is not sustainability, it is a different way of losing the knowledge. The kindness is real and it is not a substitute for the ninety minutes."
            },
            {
              id: "sim-b-d9-o4",
              label: "Let her decide. She is a senior professional and it is her call.",
              score: 0,
              outcome:
                "She says she is fine, because at hour nineteen everyone says they are fine.",
              ripple:
                "You delegated a judgement to a faculty impaired by the exact condition you were judging. The failure mode is thoroughly documented in every safety-critical industry that runs duty limits, and you walked into it while holding the authority to prevent it."
            }
          ],
          debrief:
            "The last decision of a long incident is almost always about a person, and it is the one most consistently botched by otherwise excellent operators, because pulling your best responder feels like unilateral disarmament. Two things make option two correct rather than merely kind. First, the handoff is the deliverable: a recorded walkthrough and three written answers are worth more to the organisation than nine more hours of an exhausted expert, and they are the only durable output of the night. Second, the single-point-of-knowledge risk and the fatigue risk are the same risk viewed from two angles, and this decision retires both at once. Aviation, medicine and nuclear operations all impose duty limits precisely because self-assessment of impairment fails at exactly the point it is needed. Security has no equivalent norm and should. Write your own duty limits before an incident, so that at hour nineteen you are executing a policy rather than negotiating with a person you respect.",
          principle: "Fatigue and single-point-of-knowledge are the same risk. The forced handoff retires both, and the handoff artefact outlives the incident."
        }
      },
      {
        id: "sim-b-i18",
        t: "09:50",
        channel: "regulator",
        from: "Competent authority, via the EU bank's outsourcing oversight desk",
        text:
          "Acknowledging your initial notification and the supplementary classification. Three requests. First, the basis on which you classified — we want the reasoning, not the conclusion. Second, the decision record: who decided what, at what time, on what information, including the fronts you consciously did not staff and who accepted that risk. Third, your view on whether the redaction fail-open condition and the model retrieval write path share a common control failure, because we do, and we would like to know whether you agree. Nothing further is required this week. Completeness matters considerably more to us than speed."
      }
    ],
    scoring: [
      {
        dimension: "Prioritisation under scarcity",
        weight: 25,
        note:
          "Scored on whether irreversible fronts — the treasury vote and the permanent-storage writes — were protected ahead of expensive but recoverable ones, and on whether every unstaffed front had a named risk owner and a written revisit time. Coverage is not scored. Accounting is."
      },
      {
        dimension: "Blast-radius reduction",
        weight: 20,
        note:
          "Whether containment matched the executing path rather than the distribution surface, and whether your remediation introduced availability harm to parties who were never exposed. Global switches applied to unestablished scope are scored as self-inflicted incidents."
      },
      {
        dimension: "Truth calibration",
        weight: 20,
        note:
          "Every figure stated to a board, a customer, a regulator or a reporter must still be true twenty-four hours later. Escalations made ahead of attribution are penalised at twice the weight of escalations delayed for attribution, because the first is a one-way door."
      },
      {
        dimension: "Legal and regulatory exposure",
        weight: 15,
        note:
          "Judged on clock discipline against the DORA, NIS2 and Article 33 windows counsel named at 02:19, on whether you self-scoped the personal-data finding before anyone else did, and on whether any statement to a customer about erasure was technically accurate."
      },
      {
        dimension: "Governance legitimacy",
        weight: 10,
        note:
          "Whether the emergency guardian authority survived the night unused, whether its trigger was defined publicly before it was needed, and whether any defensive action required the company to behave the way the attacker did."
      },
      {
        dimension: "Team sustainability",
        weight: 10,
        note:
          "Whether anyone finished the night rested enough to run Monday, and whether the incident produced a durable knowledge artefact from the person who held the single point of knowledge. Handoffs count; heroics do not."
      }
    ],
    debrief: [
      {
        title: "There is no version of this where you cover five fronts",
        body:
          "Three responders, five simultaneous fronts, and a retainer four hours out. The instinct to find an allocation that covers everything is the instinct to lose slowly on all of them. What separates a world-class incident commander here is not a better allocation but a different artefact: a written record of the fronts deliberately left unattended, with a named risk owner and a revisit time for each. That record does three jobs. It converts a gap into a decision. It gives the deferred front a person, so it does not simply vanish from attention. And it is the document that determines, months later, whether a supervisor or a board reads your night as negligence or as command. NIST SP 800-61 Revision 3 reorganises incident response around the CSF 2.0 Functions and pulls Govern to the front precisely because the decisive moves in a real incident are risk-acceptance decisions taken at speed under incomplete information. Sort by irreversibility, not by magnitude: a 310 million dollar governance vote with a deadline and 2,412 permanent writes outrank a larger but recoverable exposure every time."
      },
      {
        title: "The wrong hundred and forty gigabytes",
        body:
          "An alert fired correctly, an engineer drew a reasonable conclusion, a director prepared to notify two federal customers, and the whole chain was wrong because a Terraform apply on Friday renamed a role and dropped a destination out of an allowlist. Twenty-five minutes of attribution work was available and the political cost of asking for it was an annoyed audit chair. Escalation is a one-way door — you can always escalate later with better facts and you can never withdraw a crown-jewel loss claim. The real finding, when it arrived, was smaller and far more embarrassing: a debug flag serving full logprobs since November and an adapter checkpoint a departing researcher pushed to a public mirror in October. RAND's research on securing AI model weights enumerates dozens of distinct attack vectors across five defensive security levels, and its consistent observation is that organisations prepare for the cinematic vector and are undone by the mundane operational one. Veridian self-assessed at SL3. Nothing about a public checkpoint and a logprob-leaking endpoint is SL3, and a self-assessment nobody tested is a document, not a control."
      },
      {
        title: "Emergency powers you use are emergency powers you no longer have",
        body:
          "Four of seven guardian keys could have cancelled proposal 141 in forty minutes and saved 310 million dollars, and it would have been the correct technical decision and a fatal institutional one. The alternative that wins is cheaper, faster to start, and requires no keys at all: publish the decoded calldata beside the innocuous proposal title, publish the borrow transaction that manufactured the voting power, publish in advance the exact condition under which the guardians would act and when that authority expires, then whip nobody and let turnout answer. Beanstalk in April 2022 lost roughly 182 million dollars to a flash-loan-funded emergency proposal executed inside a single transaction. The Tornado Cash DAO takeover in May 2023 concealed malicious logic behind a proposal that read as routine. The durable lesson from both is not that governance defences fail; it is that an emergency power's authority is inversely proportional to how often it is exercised and directly proportional to how precisely its trigger was defined on a calm day. This generalises well beyond DAOs — break-glass credentials, unilateral admin overrides, and executive authority to bypass change control all obey the same law."
      },
      {
        title: "The model is not the incident. The output is.",
        body:
          "COUNSEL had shipped 6,100 narratives and forty-one had reached regulatory filings. Both instincts in the room pointed at the weights: take it offline, roll back to October. Neither addresses a single delivered artefact, and the rollback was aimed at a component that had not changed, because the failure was in the retrieval index — a production data store with a write path that the Collector's harvested service credential reached on fourteen tenants. The winning response is unglamorous engineering plus unglamorous customer work: turn the citation verifier from a monitor into a blocking gate, mark every narrative since Friday as unverified where the customer already looks, and put a named human on each of the forty-one filings before markets open. NIST SP 800-218A extends secure-development practice to generative systems around exactly this axis — provenance of training data, of model artefacts, and of everything retrieved at inference. Retrieval-augmented systems inherit every weakness of the store behind them, and an index that anything can write to is not an index, it is an injection point with a search API."
      },
      {
        title: "Permanence is a control decision made months before the incident",
        body:
          "The 04:11 inject is not a decision, it is a bill. A redaction service was allowed to fail open on 14 November — returning success on timeout, the single most common and most dangerous failure mode in any sanitisation pipeline — and an architecture months earlier chose to write bundles rather than only hashes to a substrate with no delete operation. What remains at 04:11 is consequence management: stop the writer, crypto-shred the twenty-five encrypted bundles by destroying key material with evidence of destruction, tell the truth about the six plaintext ones you cannot shred, and notify inside the clock. The European Data Protection Board's 2025 guidance on personal data and blockchain technologies points one way with unusual clarity — keep personal data off-chain, anchor commitments rather than content, and design the erasure path before the first write. The transferable rule needs no blockchain at all: any sanitisation control that fails open in front of an append-only store will eventually manufacture this exact incident. Fail closed, and treat the erasure story as a launch requirement rather than a legal review item."
      },
      {
        title: "Reputation you can buy is reputation you do not have",
        body:
          "A bonded attestation graph makes trust legible, portable and machine-readable — which is why forty customers could gate you automatically at two in the morning without a human involved — and legible trust is trust that can be attacked with capital. The counter-stake works, in ninety minutes, and it establishes publicly that Veridian's standing is a function of Veridian's balance sheet, in a graph Veridian helped design and sells. The correct answer in an evidence-weighted system is evidence: attach signed, timestamped control artefacts to the disputed triple, refer it to arbitration so the attacker's bond is slashed on the merits, and establish the precedent that attacking your position costs money. In parallel, do the thing the mechanism cannot do fast enough — put humans on the phone to all forty gated customers with a manual signed attestation, because automated vendor gates fail closed by design and no on-chain correction releases them in an hour. Never let the elegance of a mechanism set the tempo of your customer response."
      },
      {
        title: "The last decision is always about a person",
        body:
          "Nineteen hours awake, the only holder of the signing-path knowledge, three open questions gating a federal assessment, and she says she is fine, because at hour nineteen everyone says they are fine. The forced ninety-minute handoff is not primarily an act of kindness; it is the only action that produces a durable artefact and retires two risks with one move, because fatigue risk and single-point-of-knowledge risk are the same risk seen from two angles. Aviation, medicine and nuclear operations all impose duty limits because self-assessment of impairment fails precisely when it is needed. Security has no equivalent norm and should, and the time to write yours is not hour nineteen. Mandiant's M-Trends 2025, built from more than 450,000 hours of investigation, puts median dwell time at eleven days — most incidents are not sprints, and an organisation that can only respond by burning its best people can respond exactly once."
      },
      {
        title: "The transferable shape of a five-front night",
        body:
          "Strip the specifics and this is the general form of a modern crisis at a company that has taken on real surface area. A supply-chain compromise that reaches your customers through the agent you asked them to install. A governance mechanism under attack with a hard deadline and an irreversible outcome. An AI system whose delivered output is wrong for reasons that live in a data store rather than in a model. An irreversible substrate that faithfully recorded a control failure from six weeks earlier. And a reputation layer that a stranger can move with money. The order of operations that survives: sort by irreversibility; staff three, name the two you are abandoning and who owns them; contain the executing path rather than the distribution surface; attribute before you escalate, always, even when a director refuses you a third option; publish decoded facts and let a community answer rather than reaching for an override; chase delivered output rather than model weights; self-scope your worst finding before anyone else can; answer an evidence system with evidence and never with capital; correct falsehoods with a method and confirm the true damage yourself; and finish by taking your best person off the board with a written handoff. None of that requires more people. All of it requires having decided, in advance, what you would do when there were not enough."
      }
    ],
    awards: [
      "strong-multi-front-command",
      "strong-triage-under-scarcity",
      "strong-truth-under-pressure",
      "safe-irreversibility-first",
      "safe-final-examination",
      "safe-unitium-seal"
    ]
  }
];
