import type { Guide } from "./schema";

/* StepGUIDES :: the Systems shelf.
   Four guides that read a security programme as a system: where to act,
   the delays that decide a day, the cut that stops a cascade, and how to
   work a problem that has no final answer. Each one ends in something you
   can do this week. */

export const GUIDES_SYSTEMS: Guide[] = [
  {
    id: "sg-twelve-places-to-act",
    title: "Where To Act: Twelve Places In A System, Read For Security",
    domain: "Systems",
    kind: "model",
    statement: "Most of a security budget is spent at the weakest place in the system, because that is the place with a price tag.",
    summary:
      "Donella Meadows ranked twelve places to intervene in a system, from the numbers at the bottom to the paradigm at the top. This guide reads each one as a security move, with what it costs, how long it takes to show, and what it looks like when it is pushed the wrong way. Use it to sort a quarter's plan by the kind of change each item is.",
    minutes: 18,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Why the list is ordered",
        body:
          "Meadows wrote the list in 1999 after years of watching people push hard on parts of a system that could not move it. Her order runs from the places that are easy to change and change little, to the places that are hard to change and change everything. The low places are where tools and thresholds live. The high places are where rules, information, goals and beliefs live. A security programme spends at the bottom because the bottom can be invoiced, approved and shown on a slide. The top is slower and needs a different kind of authority. The order is also a warning: the higher the place, the more likely a well meaning push goes the wrong way, because the system's own logic hides the sign of the change. Read the twelve in order, and for each one ask what in your current plan belongs there."
      },
      {
        kind: "numbered",
        title: "The twelve, from weakest to strongest",
        items: [
          "12. Numbers. Constants and parameters: the alert threshold, the password length, the patch deadline, the retention window. Easy to change, quick to show, and the system settles back around them. Most tuning work lives here. It is not wasted, it is just small.",
          "11. Buffers. The size of stocks that stabilise flows: how long the hospital can run on paper, how many hours of water the tanks hold, how many days of logs the platform can hold before it drops them. Buffers are slack made physical. They are expensive to add and the first thing cut to save money.",
          "10. Structure. The material stocks and flows: which parts depend on which, which service sits under everything. Changing structure is a redesign, so it is rare. Segmenting a flat network, separating the directory from the services that check it, moving a vendor out from under a critical path. Slow, costly, and the change lasts.",
          "9. Delays. The time between a cause and its effect, relative to how fast the system changes. Detection shortens the delay before anyone knows. A practised response shortens the delay before anyone acts. Shortening a delay in a loop is a stronger move than any parameter inside the loop, and lengthening one on purpose, a change freeze before a holiday, can be as strong.",
          "8. Balancing loops. The strength of the loops that hold a stock near its goal. Detection and response is one, vulnerability management is one, access review is one. Strengthening means the loop closes the gap faster and more often, with practice, with ownership, with a shorter path from the alert to the person who can act.",
          "7. Reinforcing loops. The gain around the loops that run away. Spread through dependencies, trust loss in public, alert volume that trains people to ignore alerts. Reducing the gain means cutting the loop somewhere: a breaker on the dependency, a statement that goes out before the rumour, a tuning pass before the next rule ships.",
          "6. Information flows. Who gets told what, and when. A flow that did not exist before is one of the cheapest high points to add. The CFO sees the count of exceptions. The on-call engineer sees the change that went out an hour before the alert. Residents hear from the water authority before they hear from the news. Most incidents that go badly have an information flow missing, and the missing flow is known to everyone afterwards.",
          "5. Rules. Incentives, constraints and punishments. Who can approve an exception, what ships without a review, what happens when a deadline passes. Rules shape every decision made under them, so a change here moves more than any tool. Rules are also where policy resistance lives, so a rule people route around is weaker than no rule.",
          "4. Self organisation. The power of the system to change its own structure. A programme that learns from each incident and changes a rule or a flow in response is self organising. One that files the review and moves on is not. The move here is to build the review that changes something and to protect the time it needs.",
          "3. Goals. What the system is for. A programme whose goal is passing the audit will pass the audit. One whose goal is keeping the service running for the people who depend on it will make different decisions on the same budget. The goal is set by what leadership measures and rewards, more than by what it says.",
          "2. Paradigm. The shared idea the system arises from. Whether security is a department or a property of how the organisation works. Whether an incident is a failure of a person or a signal about the system. A paradigm shift is rare and it is where the biggest changes have come from.",
          "1. Transcending paradigms. The ability to hold any paradigm loosely and choose one for the situation. Meadows put it at the top and said almost nobody reaches it. For a leader it means knowing that the threat model, the risk register and the systems map are each one way of seeing, and switching between them on purpose."
        ]
      },
      {
        kind: "prose",
        title: "How to use the list in a quarter",
        body:
          "Take the plan for the next quarter and write the number of its place in the list beside each item. Most plans come out as a column of twelves and elevens with one ten. That is not wrong, it is just a plan that will move the system a little. Then ask what one item at six, five or four would look like. A new information flow is usually the cheapest. A rule change is usually the most contested. A review that changes something is usually the one that compounds. Add one. Keep the twelves, because the thresholds still need tuning, and put the one high item first in the quarter, because it will take the longest to show."
      },
      {
        kind: "callout",
        title: "Three signs you are pushing a high place the wrong way",
        items: [
          "The new rule produced a new workaround within a month. The goal under the rule was not shared, and the push raised the counter push.",
          "The new information flow is read by nobody who can act on it. A dashboard for the board is not a flow to the person who holds the valve.",
          "The goal changed on the slide and not in the budget. Goals are set by what gets funded when two things conflict."
        ]
      },
      {
        kind: "prose",
        title: "Worked: the help desk call",
        body:
          "The gauge puts you in a payroll company where a caller talks a help desk agent into resetting a password. Reading the twelve against it: the number is the call back policy, which the agent skipped under pressure. The buffer is how long payroll can run while an account is locked. The delay is how long before anyone sees the reset was wrong. The balancing loop is the review that catches it. The information flow is whether the agent could see that the account belonged to an administrator. The rule is whether the agent is measured on calls closed or on calls closed correctly. The goal is whether the company wants fast help or safe help, and it has told the agent which by how it pays them. The cheapest strong move is the information flow and the rule. The tool at the bottom, a better voice verification, is the one that will be bought first."
      },
      {
        kind: "prose",
        title: "What the list will not do",
        body:
          "It will not tell you which item at a given place is right. Two information flows can be equally high on the list and one of them useless. It will not replace a model: the World ranks structures by running the stress day with and without each one, and that measurement beats the list for a specific gauge. The list is for the plan, where the model does not reach. Use it to notice when a whole quarter has been spent at twelve."
      }
    ],
    sources: [
      { label: "Donella Meadows, Leverage Points: Places to Intervene in a System (1999)", note: "The twelve places in her own order, with the warning about pushing high points in the wrong direction." },
      { label: "Donella Meadows, Thinking in Systems (2008)", note: "The traps and the ways out, including policy resistance and shifting the burden, which are the two most common failures of a high place push." },
      { label: "John Sterman, Business Dynamics (2000)", note: "The evidence that managers misjudge delays and accumulations even in simple systems. The model should rank the moves, and intuition should read the result." }
    ]
  },
  {
    id: "sg-delays-acting-before-you-see",
    title: "Delays: Acting Before You Can See",
    domain: "Systems",
    kind: "field-note",
    statement: "By the time the dashboard turns red, the thing it measures happened an hour ago.",
    summary:
      "Every incident runs on three delays: the time before the damage shows, the time before anyone knows, and the time before anyone acts. This note names them, shows why they make calm people overshoot, and gives five measurements you can take this week to find out which of your delays is the one deciding your days.",
    minutes: 12,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "Three delays in every incident",
        body:
          "The first is material. A controller is compromised and the booster station it commands keeps running on what it was last told for a while. A directory fails and the services that check it fail within seconds. The length of this delay is set by the structure and by how much slack the downstream part holds. The second is information. The damage is real and nobody knows. This is the dwell of the threat, and it is the delay that decides most days, because a decision cannot be made on a fact nobody has. The third is response. Someone knows and the action has not landed: the page went to the wrong person, the runbook is out of date, the change needs an approval from someone asleep. Each delay is measured in a different place, and a programme that shortens one while ignoring the others will find its days are still long."
      },
      {
        kind: "prose",
        title: "Why delays make good people overshoot",
        body:
          "A balancing loop with a delay in it oscillates. Sterman showed it with a game in which players manage a supply chain and see their orders arrive weeks late: nearly all of them order too much, then too little, then too much, while being sure they are reacting correctly to what they see. The same happens in a response room. The team acts on the picture it has, the picture is an hour old, the action is too large or too small for the real state, and the correction is also based on an old picture. The fix is not to act less. It is to know the length of the delay and to act on the state you expect at the end of it, the way a driver brakes for where the car will be. That needs the delay to be measured, which most programmes have not done."
      },
      {
        kind: "numbered",
        title: "Five measurements to take this week",
        items: [
          "Pick the last three incidents and write three timestamps for each: when the first harmful action happened, when the first person knew, when the first action landed. The gaps are your delays. Most teams have the middle timestamp and neither of the others.",
          "For your most critical dependency, ask the owner how long the downstream part runs if the upstream fails right now. Minutes, an hour, a shift. If nobody can answer, the material delay is unknown and the plan assumes it is long.",
          "Send a test page to the on-call rotation at 03:00 on a weekend and measure the time to acknowledgement. That is the response delay at its worst, which is the one that matters.",
          "Find the oldest open high finding and count the days since it was reported. That is the delay in the vulnerability loop, and it is usually measured in quarters.",
          "Time one runbook end to end with a person who did not write it. The difference between the written time and the measured time is a delay you did not know you had."
        ]
      },
      {
        kind: "compare",
        title: "Shortening a delay or tolerating it",
        left: {
          title: "Shorten it",
          items: [
            "Detection that pages the person who holds the valve, not a queue.",
            "A response practised until the runbook time and the measured time agree.",
            "An approval path for incident changes that does not wait for anyone asleep.",
            "A directory or time service failure visible to the services that depend on it before they fail."
          ]
        },
        right: {
          title: "Tolerate it",
          items: [
            "Slack in the downstream part, so the material delay is long enough for the response to arrive.",
            "A manual mode practised so the function continues while the delay runs.",
            "A holding statement written in advance, so the public hears something true inside the information delay.",
            "A buffer of cached reads, queued transfers or held payments that keeps the service whole for the length of the delay."
          ]
        }
      },
      {
        kind: "prose",
        title: "Worked: the quiet foothold",
        body:
          "The gauge puts you in a rural electric cooperative with a foothold that has sat in the network for weeks. The material delay is long: nothing has failed yet. The information delay is the whole story, because the threat has been dwelling with nothing to see it. A detect layer in the stack shortens that dwell in the model, and the day chart shows the difference as the hour at which the service line stops falling. Without it the stack can be strong at the perimeter and lose the day anyway, because every structure that stops a threat at the door does nothing for the one already inside. Read the chart for the hour the line turns. That hour is your information delay made visible."
      },
      {
        kind: "callout",
        title: "What to write down",
        body:
          "One line per delay, with its measured length and who owns shortening it. Three lines. Put them where the board slide used to have the count of blocked emails."
      }
    ],
    sources: [
      { label: "John Sterman, Business Dynamics (2000)", note: "The beer distribution game and the evidence that people managing a delayed loop oscillate while believing they are correcting." },
      { label: "Donella Meadows, Thinking in Systems (2008)", note: "Delays as a place to intervene, and why a delay in an information flow is the one that hurts most." },
      { label: "Mandiant, M-Trends 2024", note: "The global median dwell time of ten days for intrusions investigated in 2023, which is the information delay measured across many organisations." }
    ]
  },
  {
    id: "sg-breakers-designing-the-cut",
    title: "Breakers: Designing The Cut",
    domain: "Systems",
    kind: "playbook",
    statement: "A cascade needs a path. A breaker is the decision, made in advance, about where the path ends.",
    summary:
      "How to find the dependency a cascade would run along, where to place the cut, what a cut costs in service and in trust, and how to prove the breaker works before the day it is needed. Worked through the shared jump host and the booster station, with a checklist that stops a diagram from being called a breaker.",
    minutes: 15,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "What a breaker is",
        body:
          "An electrical breaker opens a circuit when the current passes a limit, so that one fault does not burn the building. Nygard brought the pattern into software: a call that keeps failing is cut, the caller falls back to a degraded answer, and the failing service gets time to recover instead of being hammered. In a systems map a breaker is a cut on a dependency, placed so that a failure upstream does not take the downstream part with it. It is a structure, it has a cost, and it has to be chosen. A segmented network is a breaker on lateral movement. A jump host with its own identity is a breaker on the admin path. A manual mode is a breaker on the control network. A held payment queue is a breaker on settlement. Each one says: past this point, the failure stops and something smaller continues."
      },
      {
        kind: "numbered",
        title: "Finding the coupling",
        items: [
          "Draw the parts and the dependencies between them, with the direction the dependency runs. Use the World's notation if you have it: a vessel per part, a pipe per dependency, delay marks on the pipe.",
          "For each pipe write what happens downstream if the upstream part fails now, and how long it takes to happen. A pipe with a short delay and a large downstream is a cascade path.",
          "Find the part with the most pipes leaving it. The directory, the time service, the shared jump host, the vendor's cloud. That part is the one a cascade runs from, and the pipes out of it are where breakers belong.",
          "Walk each cascade path to the public part. The public part is where service and trust are measured. A cut that stops the path before the public part keeps service. A cut into the public part keeps trust and not service, because the people still feel the loss.",
          "Mark the paths that already have a cut and say what the cut is. If the answer is a firewall rule nobody has tested, the path does not have a cut."
        ]
      },
      {
        kind: "numbered",
        title: "Placing the cut",
        items: [
          "Put the breaker as close to the source of the cascade as the service allows. A cut at the directory protects everything below it, and it is the hardest to make without breaking the business.",
          "Decide what continues past the cut. A breaker that stops the failure and also stops the function has only moved the outage. The degraded mode is part of the breaker's design.",
          "Decide who can close it and who can open it again. A breaker that needs a change ticket to trip is a diagram. A breaker that trips itself and nobody knows how to reset is a second incident.",
          "Price it. Every cut costs something on a quiet day: a slower admin path, a duplicated identity, a manual procedure that must be practised. Write the price beside the breaker so the quiet day budget does not remove it.",
          "Test it by tripping it. A game day in which the upstream part is turned off and the downstream part is watched. The breaker that has not been tripped on purpose has not been tested."
        ]
      },
      {
        kind: "compare",
        title: "A cut that keeps service and a cut that keeps trust",
        left: {
          title: "Keeps service",
          items: [
            "Manual mode at the pumps while the control network is isolated.",
            "A second admin path that does not cross the shared jump host.",
            "Cached reads that keep records available while the database is down.",
            "A segment that keeps the clinical network up while the business network is cut."
          ]
        },
        right: {
          title: "Keeps trust",
          items: [
            "Incident command that speaks to residents before the outage is on the news.",
            "A holding statement that says what is known and when the next word comes.",
            "A regulator told inside the clock, in writing, with the facts that are certain.",
            "A customer page that says the money is held and safe, with a time."
          ]
        }
      },
      {
        kind: "checklist",
        title: "Before you call it a breaker",
        items: [
          "It has been tripped on purpose in the last year and the downstream part continued.",
          "The degraded mode past the cut is written down and the people who run it have run it.",
          "Someone can trip it at 03:00 without an approval from someone asleep.",
          "Its quiet day cost is written beside it and has an owner who defends it.",
          "The World or your own map shows the cascade path it cuts and the public part it protects."
        ]
      },
      {
        kind: "prose",
        title: "Worked: the shared jump host and the booster station",
        body:
          "The jump host gauge gives you a carrier where every admin path crosses one host. The host is the part with the most pipes leaving it, and a threat that lands on it has a path to everything. A breaker here is a second path with its own identity, so that the cut on the jump host does not cut the admins. In the model, the breaker turns a stress day that loses most of the service into one that loses a few hours, and the leverage list ranks it first for that reason. The booster station gauge is the other shape. The cascade runs from the control network to the pumps to the town. The breaker is manual mode: the operators run the pumps by hand while the network is isolated. In Aliquippa in November 2023 that is what happened, and the water kept flowing. The breaker there was not a device. It was a decision and a practised procedure."
      },
      {
        kind: "callout",
        title: "The cost of a cut",
        body:
          "A breaker is a loss chosen in advance so that a larger loss cannot happen. The people who feel the small loss on a quiet day will ask for the breaker to be removed, and they will be right that it costs them. The answer is the map, with the path it cuts and the public part it protects, and the day it was tripped on purpose and held."
      }
    ],
    sources: [
      { label: "Charles Perrow, Normal Accidents (1984)", note: "Tight coupling as the property that gives a failure no time to be contained, and loose coupling as the design response." },
      { label: "Michael Nygard, Release It! (2007)", note: "The circuit breaker pattern in software: trip, fall back, recover, with the states and the reset written out." },
      { label: "CISA, FBI, NSA and EPA advisory AA23-335A (December 2023)", note: "The Unitronics controller compromise, including the Aliquippa booster station taken to manual control while the network was isolated." },
      { label: "Donella Meadows, Thinking in Systems (2008)", note: "Structure as a place to intervene, and why a structural change lasts longer than a parameter." }
    ]
  },
  {
    id: "sg-working-a-wicked-problem",
    title: "Working A Wicked Problem",
    domain: "Systems",
    kind: "model",
    statement: "A wicked problem is not solved. It is worked, and the work changes the problem.",
    summary:
      "Rittel and Webber's ten marks of a wicked problem, cut down to the five that matter for a security leader, the trap of solving the tame piece inside it, and a working method in seven moves that uses the systems map, the stress day and the notch as instruments. With night shift ransomware worked through and a rule for when to stop.",
    minutes: 16,
    mode: "both",
    blocks: [
      {
        kind: "prose",
        title: "What makes a problem wicked",
        body:
          "Rittel and Webber listed ten properties in 1973. Five of them do the work here. There is no definitive formulation: how you state the problem already contains the answer you expect, so the hospital problem stated as ransomware is a different problem from the same night stated as keeping patients treated. There is no stopping rule: you stop when you run out of time or money or patience, not when it is solved. Solutions are better or worse, not true or false, and the people judging them use different ends. Every attempt counts, because it changes the system, so there is no trial run. And each wicked problem is a symptom of another: the ransomware is a symptom of the flat network, which is a symptom of the budget, which is a symptom of what the board measures. Defending an organisation has all five. A leader who treats it as a tame problem with a right answer will keep finding that the answer was right last year."
      },
      {
        kind: "prose",
        title: "The tame piece trap",
        body:
          "Inside every wicked problem there are tame pieces: a patch to apply, a rule to write, a tool to buy. Each has a stopping rule and a test, and each is satisfying to finish. The trap is to do the tame pieces and report the wicked problem as progressing. A programme can patch every finding, pass every audit and lose the night, because the night was decided by a dependency nobody drew and a decision nobody practised. The tell is a plan with no item that could fail. If everything on the quarter's list will certainly be done, nothing on it is the wicked part."
      },
      {
        kind: "numbered",
        title: "The working method, seven moves",
        items: [
          "Name the stocks. Write the parts of the system as things that hold function, with the people each one serves at the end. The public part is where service and trust are counted, and it goes on the map first.",
          "Draw the flows and their delays. Each dependency with its direction and how long the downstream runs without it. Mark the sources of pressure on the horizon, aimed at the parts they reach.",
          "Find the loops. The reinforcing ones that would run away and the balancing ones that would pull back, with their delays. Letter them. If you cannot find a balancing loop for a threat, you have found the day's shape already.",
          "Place one structure and run the day. Not a plan, one structure. Read the hours of service kept and the trust at the end. The number is the model's and it is not flattering.",
          "Read what changed. Which loop the structure cut, which part held its level, which pressure got through anyway. The map after the run is a different map from the one before it, because that is what a wicked problem does.",
          "Take it up a notch. Add the pressure the adversary would add against this stack, and run again. A stack that holds at the new notch is a better answer. One that fails tells you which assumption the last answer rested on.",
          "Write what you learned as a change to a rule, a flow or a structure, with an owner. A run that changes nothing in the programme was a game. One that changes something was the work."
        ]
      },
      {
        kind: "compare",
        title: "Solving and working",
        left: {
          title: "Solving",
          items: [
            "States the problem once and holds the statement fixed.",
            "Stops when the test passes.",
            "Judges the answer right or wrong.",
            "Plans the whole thing, then executes.",
            "Reports done."
          ]
        },
        right: {
          title: "Working",
          items: [
            "Restates the problem after every move, because the move changed it.",
            "Stops when the next move costs more than it keeps.",
            "Judges the answer better or worse, in hours and in trust.",
            "Makes one move, reads the system, makes the next.",
            "Reports what changed and what the next pressure will test."
          ]
        }
      },
      {
        kind: "prose",
        title: "Worked: night shift ransomware",
        body:
          "The gauge puts you in a regional hospital network at night. Stated as ransomware, the problem is tame: restore from backups, rebuild, patch the way in. Stated as keeping patients treated through the night, it is wicked, because treatment depends on records, records on the directory, the directory on the network, and the people on the ward on all of it, with the public reading about it by morning. The first move names the ward as the public part. The second draws the directory under everything with a short delay. The third finds the reinforcing loop from the directory through every service that checks it, and no balancing loop fast enough to matter at 02:00. The fourth places a breaker, a clinical segment that keeps the ward's systems reachable while the business network is cut, and runs the day. The read says the ward kept most of its hours and the billing office lost all of theirs, which is the right trade and will not feel like one to billing. The notch adds a threat aimed at the segment's own identity, and the stack has to answer it. What goes into the programme is the segment, the practised paper mode, and the statement to the public written before it is needed."
      },
      {
        kind: "callout",
        title: "When to stop",
        body:
          "Stop a working session when the next structure keeps fewer hours than it costs in budget, or when the notch is asking for a structure the catalog does not hold and you have written down what that structure would have to do. Both are honest endings. Reporting the problem solved is not one of them."
      }
    ],
    sources: [
      { label: "Horst Rittel and Melvin Webber, Dilemmas in a General Theory of Planning (1973)", note: "The ten properties of a wicked problem, written for planners and true of every system with people in it." },
      { label: "Donella Meadows, Thinking in Systems (2008)", note: "The method of naming stocks, drawing flows and finding loops before acting, and the traps that catch a planner who skips it." },
      { label: "David Snowden and Mary Boone, A Leader's Framework for Decision Making (Harvard Business Review, 2007)", note: "The Cynefin distinction between complicated problems, which experts can solve, and complex ones, which have to be probed and read." },
      { label: "John Sterman, Business Dynamics (2000)", note: "Why a simulated run beats intuition for reading the effect of a move in a system with delays and accumulations." }
    ]
  }
];
