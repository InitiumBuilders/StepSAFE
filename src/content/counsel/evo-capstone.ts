/* UNIT counsel for the evo-capstone practice modules.

   These are the voices in the room at the moment of decision. They speak from
   their own doctrine, in their own register, about this specific inject — and
   they do not agree. Some of them are confidently wrong in exactly the way
   their bio says they are. Weighing the advice is the skill; obeying it is not. */

import type { Counsel } from "../schema";

export const COUNSEL: Counsel[] = [
  /* ---------------------------------------------------------------------------
     sim-evonode-quorum-siege — Bellwether Node Services
     roles: u-ledger, u-vault, u-lantern, u-anchor, u-signal, u-compass
     --------------------------------------------------------------------------- */

  {
    simId: "sim-evonode-quorum-siege",
    decisionId: "sim-a-d1",
    voices: [
      {
        member: "u-lantern",
        line: "Eleven nodes, three providers, one protocol behaviour, and nothing in the logs but qcontrib timeouts. That is not a fault pattern, that is a coverage gap wearing a fault costume — we have no telemetry at all on what process loaded the operator BLS key, which is the only question worth asking. Do not let Reeve restart until I know what we are even able to see.",
        leaning: "adversary until proven otherwise"
      },
      {
        member: "u-anchor",
        line: "Names and roles before hypotheses. One bridge, two tracks — availability and suspected key compromise — and Reeve is operations lead on it, not the person who decides. The restart is the only action on this table that cannot be undone, so it goes last, not first.",
        leaning: "one bridge, two tracks"
      },
      {
        member: "u-ledger",
        line: "Base rates matter here. Multi-provider operator key compromise against a mid-size hosting company is a rare event; a shared provisioning defect that lands across three providers because we built all of them from one image is not rare at all. I would not price this as an adversary yet, and the word compromise has a cost with the board that we do not get back.",
        leaning: "priors point at operations"
      },
      {
        member: "u-vault",
        line: "The operator BLS key cannot move collateral and it cannot cast a vote, so nothing here is theft yet. What it can do is sign a ProUpServTx, and that is checkable without touching a single host — pull seventy-two hours of service updates for the whole fleet from the deterministic masternode list before anyone bounces a container.",
        leaning: "read the chain before the hosts"
      }
    ]
  },

  {
    simId: "sim-evonode-quorum-siege",
    decisionId: "sim-a-d2",
    voices: [
      {
        member: "u-vault",
        line: "ProUpRevTx is signed with the operator key, which we still hold. We can null all forty-one tonight without waking a single owner and without waiting on anybody's signature. It is the one containment on this table that is entirely inside our own control, and it is available right now.",
        leaning: "revoke with our own key"
      },
      {
        member: "u-anchor",
        line: "Cap the batches by the quorum arithmetic, not by the clock Tomás is holding. Highest exposure first, self-owned collateral first because those signatures are ours to produce, and publish the batch plan and the minSize math to the operator channel as we execute so nobody has to take our word for it.",
        leaning: "stage it, publish the math"
      },
      {
        member: "u-compass",
        line: "Seventy-one owner signatures at half past four on a Saturday morning is not a plan, it is a wish with a deadline attached. Open the customer signing queue now with a written escalation and a stated time box, and tell Tomás plainly which half of his instruction we are executing and which half we are not.",
        leaning: "time-box the signatures we lack"
      }
    ]
  },

  {
    simId: "sim-evonode-quorum-siege",
    decisionId: "sim-a-d3",
    voices: [
      {
        member: "u-lantern",
        line: "Reeve's forty-one is flow data produced under load by a competent man who already had a hypothesis. I have shipped rules on exactly that basis and been wrong in exactly that way. Six is signed by the adversary and timestamped in a block that anyone in the operator channel can pull without asking us anything.",
        leaning: "publish only what is on-chain"
      },
      {
        member: "u-compass",
        line: "One number travels. Two numbers with a caveat between them becomes a thread about whether Bellwether knows the state of its own fleet, and that thread runs straight into the superblock. If we are going to be wrong, be wrong in the cautious direction — forty-one with the containment plan attached reads as a company in control of its incident.",
        leaning: "one number, the larger one"
      },
      {
        member: "u-ledger",
        line: "Every figure we publish tonight becomes an input to something we defend in writing later: the supervisory desk in Tallinn, the SOC 2 fieldwork, the treasury vote. A number we restate downward costs more than a number we never gave, because the restatement is what gets remembered. Give them the next update time and hold to that instead.",
        leaning: "no number we would restate"
      }
    ]
  },

  {
    simId: "sim-evonode-quorum-siege",
    decisionId: "sim-a-d4",
    voices: [
      {
        member: "u-vault",
        line: "Four thousand one hundred and eighty DASH leaving in twenty-six minutes is the only irreversible thing in this entire incident. The attacker changed operator payout addresses, which means the reward mapping feeding that batch is precisely the thing you can no longer attest to. Stop it, and say in the same breath exactly what would let you start it again.",
        leaning: "stop the irreversible thing"
      },
      {
        member: "u-ledger",
        line: "Six nodes is sixty-one DASH against a four-thousand-DASH batch. Run it excluding the six and you have contained the loss without handing a supervisory authority the sentence Bellwether stopped paying its customers. A halted distribution at a Tallinn entity is a different category of correspondence from a technical incident, and it is a category we do not exit for years.",
        leaning: "run it minus the six"
      },
      {
        member: "u-signal",
        line: "You make a claim to 2,900 people every week — that the delegator ledger and the chain agree. Tonight they may not, and a claim you cannot support is not something you renew quietly and reconcile afterwards. Write the resume condition as evidence somebody could check: a signed reconciliation of every operator payout address in the fleet against the deterministic list.",
        leaning: "stop attesting what you cannot prove"
      }
    ]
  },

  {
    simId: "sim-evonode-quorum-siege",
    decisionId: "sim-a-d5",
    voices: [
      {
        member: "u-anchor",
        line: "Capacity pressure is real and it is Reeve's job to feel it. Mine is to notice that those disks are the only witness to how a key left a vault, and that witness is on a clock nothing can extend. Two hosts imaged, hashed, countersigned by somebody outside operations, and then he rebuilds as fast as he likes.",
        leaning: "capture two, then restore"
      },
      {
        member: "u-lantern",
        line: "Pick the two for coverage, not for convenience — one Hetzner, one OVH, and one of them has to be a host the CI runner reached first or you have imaged the effect and lost the cause. And do not rebuild from the golden image. That pipeline is the suspect; its output is not evidence of anything except that the suspect was busy.",
        leaning: "chosen for coverage, not one host"
      },
      {
        member: "u-compass",
        line: "PoSe scores climbing is a number the whole network can read tonight. A forensic image is a number nobody sees for six weeks, if the report ever lands. Restore the six and reconstruct root cause from pipeline logs afterwards — we can carry an incomplete report far more easily than we can carry visible degradation thirty-four hours before a treasury vote.",
        leaning: "restore the capacity people see"
      }
    ]
  },

  {
    simId: "sim-evonode-quorum-siege",
    decisionId: "sim-a-d6",
    voices: [
      {
        member: "u-signal",
        line: "Give the disclosure the shape of a claim: issuer, evidence, timestamp, and a scope narrow enough that a peer operator can act on it without ever calling you. Token scope, the 02:14 authentication, the ProUpServTx signature pattern, the affected fields. No advice, no speculation about who else is exposed, no attribution.",
        leaning: "publish it as evidence, not advice"
      },
      {
        member: "u-ledger",
        line: "Ostrowski is not being timid, she is being accurate. A published description of our own vault scope is an admission, and it will be read back to us by the supervisory desk and by anyone drafting a claim against the Tallinn entity. If we publish early, the decision has to be in writing, signed by you, before it goes out and not after.",
        leaning: "counsel is right within her scope"
      },
      {
        member: "u-anchor",
        line: "Three other operators run the same tool with the same defaults, and every hour we hold this is an hour of exposure for parties who could put a future quorum under the halt threshold on the chain we are paid to keep alive. Tell counsel in writing that you are overriding her and why, and then send it inside the hour.",
        leaning: "disclose inside the hour"
      }
    ]
  },

  {
    simId: "sim-evonode-quorum-siege",
    decisionId: "sim-a-d7",
    voices: [
      {
        member: "u-compass",
        line: "Strategy is what you refuse to do, written where people can hold you to it. Withdrawing refuses nothing — it defers the judgement to a cycle where you will have less standing, not more, and it kills three engineers' funding on Monday. Do not withdraw. Publish the whole record including the eight, and invite the no vote in the same sentence.",
        leaning: "publish everything, invite the no"
      },
      {
        member: "u-ledger",
        line: "Marsh is not wrong about the arithmetic. Plus 412 net yes, a forming withdrawal campaign, thirty-four hours, and a scope that moved from six to eight inside two hours — that is a vote you are more likely to lose than win, and a public loss prices Bellwether for four cycles rather than one. Withdraw, and re-propose in thirty days holding the review.",
        leaning: "withdraw and re-propose"
      },
      {
        member: "u-signal",
        line: "The proposal is not the asset. The asset is whether a masternode owner can verify what you say without asking you, and tonight you have handed them transaction ids twice and been right twice. Spend that. A party that genuinely wants to be judged behaves observably differently from a party performing transparency, and this audience reads chains for a living.",
        leaning: "let them judge you on the record"
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     sim-final-examination-five-fronts — Veridian Commons, PBC
     roles: u-seva, u-keeper, u-lantern, u-forge, u-anchor, u-ledger, u-vault,
            u-cartographer, u-oracle, u-compass, u-signal, u-unitium
     --------------------------------------------------------------------------- */

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d1",
    voices: [
      {
        member: "u-anchor",
        line: "Three people, five fronts, and the artefact that matters is not the allocation. It is the line in the channel naming which two fronts are unstaffed until 04:00, who owns each of them, and what could go wrong in that interval. Write it before you assign anybody, because you will not write it afterwards and you know that.",
        leaning: "name what you are abandoning"
      },
      {
        member: "u-ledger",
        line: "Sort by expected loss and the collector dominates everything else on this board — 1,140 tenants, three globally systemic banks, and an agent we personally asked them to install inside their own accounts. The treasury has nineteen hours of voting and a forty-eight hour timelock sitting behind it. Put all three people where the magnitude is.",
        leaning: "magnitude first, staff the collector"
      },
      {
        member: "u-vault",
        line: "Magnitude is the wrong sort key tonight. The collector is expensive and recoverable; you can pin, rebuild and re-sign every one of those tenants next week. A governance vote with a hard deadline and an anchoring pipeline that is still writing to permanent storage are the two things Monday cannot undo. Take the treasury clock yourself and put a hand on that pipeline.",
        leaning: "irreversible before expensive"
      },
      {
        member: "u-seva",
        line: "You have listed five fronts. Which of them will still be a decision at 06:00, and which one stops being yours to make while we are having this conversation?",
        leaning: "the question underneath"
      }
    ]
  },

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d2",
    voices: [
      {
        member: "u-forge",
        line: "Bo is right about the risk and wrong about the instrument. The postinstall lives in the CLI wrapper's dependency tree, not in the signed container. Freeze auto-upgrade across all 1,140, pin every tenant to the last version whose provenance we can actually verify, and kill only the path that executes the script.",
        leaning: "freeze propagation, kill execution"
      },
      {
        member: "u-ledger",
        line: "You do not yet know which path executes, and three systemic banks are running an agent we shipped them. The loss distribution on a compromised evidence collector inside a G-SIB does not have a comfortable tail; the loss distribution on a support queue does. Four minutes of certainty is worth an ugly night with three hundred customers mid-close.",
        leaning: "push the global disable"
      },
      {
        member: "u-lantern",
        line: "Before you argue about the switch — where does the answer come from about which tenants run the CLI and which run the container? If that inventory is derived from the billing system rather than from the fleet, we are about to make a containment decision against a customer list and call it a deployment scope.",
        leaning: "establish the path before the fix"
      },
      {
        member: "u-compass",
        line: "Whatever you choose, the notification is the control. Three hundred customers are mid-close and two federal tenants have continuous monitoring obligations that assume this collector is running. One short message naming the version pin and the single action they take is support capacity you keep for the next four hours, and you will need all of it.",
        leaning: "the notification is the control"
      }
    ]
  },

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d3",
    voices: [
      {
        member: "u-cartographer",
        line: "Your account allowlist is generated from Terraform state and Terraform ran on Friday. Before anyone says the word exfiltration to a federal customer, diff the inventory against that apply. An alert derived from a mutable source is very often an alert about your own change log, and this one has the exact shape of a renamed role.",
        leaning: "check your own change log first"
      },
      {
        member: "u-oracle",
        line: "That egress control was tuned against a red-team set last quarter and it has not produced a false positive since. If it fired on the weights prefix at 140 gigabytes, I would take it at face value — the adapter checkpoints and the serving snapshot are the crown jewels and this is precisely the shape a weights theft makes on the wire.",
        leaning: "the detector is calibrated, act"
      },
      {
        member: "u-anchor",
        line: "Give Charlotte the shape of what you know rather than an answer. Unattributed egress volume, the affected prefix, the serving path unaffected, attribution at 03:05 either way. She refused a third option; you are not obliged to accept the frame, you are obliged to give her a time and then meet it.",
        leaning: "state a time, not a conclusion"
      },
      {
        member: "u-unitium",
        line: "Four people in this channel have converged on the same answer inside two minutes, which means either it is right or it originated in here and nobody examined it. Assign somebody to argue that the egress is benign, out loud, before you brief an audit committee.",
        leaning: "assign someone to argue back"
      }
    ]
  },

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d4",
    voices: [
      {
        member: "u-vault",
        line: "The calldata is unambiguous. A fee-parameter title wrapping a timelock admin reassignment, funded by 4.1 million VRDN borrowed ninety minutes ago by an address with no governance history. Three hundred and ten million dollars against a governance norm is not a close call in either direction. Assemble the four and hold the cancel ready.",
        leaning: "hold the guardian cancel ready"
      },
      {
        member: "u-keeper",
        line: "You cannot exercise that quorum tonight in any form I would put my name to. Four of seven means four signing sessions, a witness, and a recorded ceremony, and what you actually have is three keys in one pair of hands and a co-signer asleep in another timezone. If the guardians are the plan, the plan is not available for six hours.",
        leaning: "the quorum cannot convene tonight"
      },
      {
        member: "u-signal",
        line: "Publish the provenance and let it do the work. The decoded calldata beside the innocuous title, the admin-reassignment diff, and the borrow transaction that manufactured the voting power — that is a claim with an issuer and evidence attached, it costs forty-five minutes and no keys, and it is checkable by anyone. Then state in public the condition under which the guardians would act, before you need it.",
        leaning: "publish the calldata, whip nobody"
      },
      {
        member: "u-seva",
        line: "avert told you the price of using those keys. What is the price of holding them, now that everyone on the chain knows you personally hold three?",
        leaning: "the question underneath"
      }
    ]
  },

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d5",
    voices: [
      {
        member: "u-oracle",
        line: "The weights did not change. The index did, because the index is a production data store with a write path and the model is not. Rolling back to October remediates a component that was never at fault and costs you your only ML engineer for two hours. Chase the delivered narratives and the thing that wrote to the corpus.",
        leaning: "chase the write path"
      },
      {
        member: "u-lantern",
        line: "Turning the citation verifier into a blocking gate at an 11.2 percent failure rate means blocking roughly one narrative in nine, most of which are probably fine, in the middle of Q4 close. I would rather spend an hour tightening the verifier than ship a control that loud, because a gate nobody can live with gets quietly switched off by somebody at 06:00 and then we have neither.",
        leaning: "tune the verifier, do not gate"
      },
      {
        member: "u-forge",
        line: "The fact worth sitting with is that a credential harvested from our own build fleet has write access to a customer-facing retrieval index. That is a supply chain finding wearing an AI costume, and the containment is the one we should already have had on the runner: scope that credential per tenant and revoke everything the postinstall could have read.",
        leaning: "treat the index as a build artefact"
      }
    ]
  },

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d6",
    voices: [
      {
        member: "u-keeper",
        line: "Crypto-shredding is defensible only if you can evidence the destruction, and those keys sit in three customers' own KMS. That is three written instructions and three key-destruction operations at five on a Sunday morning, executed by people who have never once rehearsed it. Start the calls now, because the technique is not the hard part — custodian availability is.",
        leaning: "shred the twenty-five, evidence it"
      },
      {
        member: "u-cartographer",
        line: "Gateway removal is not removal. Anyone running a node has those bundles, and that is the design intent of the substrate somebody chose months ago. Say that plainly in the customer call, because the sentence the data has been removed is the one that gets repeated back to you in a deposition.",
        leaning: "never say removed"
      },
      {
        member: "u-signal",
        line: "Publish a revocation attestation against the two exposed transaction identifiers — issuer, timestamp, status — so any verifier resolving those bundles sees them marked withdrawn. It gives us a defensible status layer over content we cannot delete, and on an append-only chain a status layer is the only erasure story that exists.",
        leaning: "layer revocation over the writes"
      },
      {
        member: "u-ledger",
        line: "The Article 33 clock started at 04:11 and the only variable still under your control is who scopes the finding. Name the six plaintext bundles yourself, in writing, before an attacker's transaction identifiers do it for you. A finding scoped to six by the controller is a fundamentally different regulatory object from a finding scoped to 2,412 by a journalist.",
        leaning: "self-scope inside the clock"
      }
    ]
  },

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d7",
    voices: [
      {
        member: "u-signal",
        line: "The counter-stake works, and that is precisely the problem. The moment Veridian's position in the graph is a function of Veridian's balance sheet, the graph stops carrying information — and the graph is what you sell. Attach the CC6.1 control test artefacts with signatures and timestamps to the disputed triple and refer it to arbitration so the attacker's bond is slashed on evidence.",
        leaning: "answer with evidence, never capital"
      },
      {
        member: "u-ledger",
        line: "Eight hundred thousand VRDN and a fee, against forty closed gates and two enterprise renewals sitting inside their notice window. I can defend that trade to any finance committee in this building — it is the cheapest instrument on the table by an order of magnitude and it resolves inside ninety minutes rather than inside a quarter.",
        leaning: "the counter-stake prices out"
      },
      {
        member: "u-compass",
        line: "Whatever you do on the graph takes days, and procurement does not wait days. Put named humans on the phone to all forty gated customers within the hour with a signed manual attestation and the real scope. The elegance of the mechanism is not allowed to set the tempo of the customer response.",
        leaning: "phone the forty regardless"
      }
    ]
  },

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d8",
    voices: [
      {
        member: "u-anchor",
        line: "Four claims and you know the state of each one. Confirm the permanent-storage item with the real numbers, correct the collector figure to ninety CLI-path tenants and fourteen poisoned indexes, and hand him the method to verify the replication attribution himself rather than your word for it. Then name the time of your next update and meet it.",
        leaning: "give the method, not the number"
      },
      {
        member: "u-oracle",
        line: "Volunteer the debug flag and the public adapter checkpoint. They are worse than the claim he already has and they are true, and handing over the finding he did not have is the only reason your denial on the theft claim will be believed. A company that surrenders its own embarrassment does not read as a company hiding a larger one.",
        leaning: "volunteer the finding he lacks"
      },
      {
        member: "u-ledger",
        line: "Do not confirm the personal-data item to a reporter before it is filed with a supervisory authority. A public confirmation ahead of the notification is an admission with a timestamp, and it will sit in the examination file beside whatever we submit on Wednesday. Correct the two false claims now and give him that item at the hour counsel files.",
        leaning: "file before you confirm"
      }
    ]
  },

  {
    simId: "sim-final-examination-five-fronts",
    decisionId: "sim-b-d9",
    voices: [
      {
        member: "u-anchor",
        line: "I have run an incident to hour twenty-six and made the call that closed it. Ines is at nineteen and she is the only person alive who can answer three questions that gate a federal assessment starting at 11:00. Get her through the briefing, then put her out for two days. A ninety-minute handoff is ninety minutes of documentation spent during your worst-staffed hour of the night.",
        leaning: "she stays through the briefing"
      },
      {
        member: "u-keeper",
        line: "One person who understands the artefact signing path is a one-of-one quorum, and you have been operating it for fourteen months without calling it that. This is a custody failure with a human name attached. The handoff is not the cost of pulling her out — the handoff is the only durable thing tonight produces.",
        leaning: "retire the one-of-one quorum"
      },
      {
        member: "u-unitium",
        line: "Three written answers and a recorded walkthrough mean any two people in this room can take the assessor questions on Tuesday, which is the property you have needed for a year and have never had. Degrade gracefully or degrade catastrophically; the difference is ninety minutes of somebody writing things down.",
        leaning: "make the knowledge survivable"
      },
      {
        member: "u-seva",
        line: "She says she is fine. What would she have to notice about herself, at hour nineteen, in order to be able to say anything else?",
        leaning: "the question underneath"
      }
    ]
  }
];
