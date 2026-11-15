import type { Term } from "./schema";

/* StepGuides :: GLOSSARY, SYSTEMS: the words a systems map is read with.
   Loops, delays, slack, drift and the archetypes that make the same mistake
   look new every time. Every entry says what the gauge does with it. */

export const TERMS_SYSTEMS: Term[] = [
  {
    id: "wicked-problem",
    term: "Wicked Problem",
    domain: "Systems",
    short: "A problem with no final statement, no stopping rule and no test that a solution is right, where every attempt changes the problem.",
    long: "Rittel and Webber named the class in 1973 while studying city planning. A wicked problem cannot be written down once, because how you state it already contains the answer you expect. There is no point at which it is solved, only points at which you stop. Attempts are better or worse, and the people who judge them disagree. Every attempt changes the situation, so there is no trial run. Each one is unique enough that the last answer does not transfer whole. Defending an organisation has every one of those marks. The adversary adapts to the defence, the fix changes the system it was meant to protect, the budget holder and the engineer judge a control by different ends, and the place you choose to start decides what you will find. Tame problems have a stopping rule and a test. Patching a known vulnerability is tame. Deciding what a hospital keeps running on a night when its directory is gone is wicked.",
    why: "The gauge is built as a wicked problem on purpose. A stack that holds at Ground is a worse answer at Systemic, the adversary at Wicked picks against your last move, and Outlier asks for a structure the catalog does not hold. The World is there so you can see the problem change as you act on it.",
    related: ["leverage-point", "feedback-loop", "requisite-variety", "policy-resistance", "fixes-that-fail"],
    mode: "both"
  },
  {
    id: "reinforcing-loop",
    term: "Reinforcing Loop",
    domain: "Systems",
    short: "A feedback loop that amplifies its own output. Growth that makes more growth, or loss that makes more loss.",
    long: "Trace a loop around a system and multiply the signs of its links. An even count of negatives is a reinforcing loop. Left alone it runs away in whichever direction it started. Compound interest is one. So is a failure that spreads along dependencies: a part loses function, the parts that draw from it lose supply, their function falls, and the parts that draw from them follow. Trust works the same way in the other direction. A service that fails in public loses trust, the loss makes every later message land worse, and a message that lands badly costs more trust. Reinforcing loops are the reason a day can go from fine to lost in an hour. They are also the reason a programme that learns from each incident gets better faster each year. The loop does not care which way it turns.",
    why: "The World letters every loop it finds. An R loop with no breaker on it is where a stress day gets its shape, and the leverage list ranks the structures by how much of that loop they cut.",
    related: ["feedback-loop", "balancing-loop", "cascade-failure", "tight-coupling", "breaker"],
    mode: "both"
  },
  {
    id: "balancing-loop",
    term: "Balancing Loop",
    domain: "Systems",
    short: "A feedback loop that pulls a stock back toward a goal. Detection and response is one; so is a thermostat.",
    long: "A balancing loop compares where a stock is with where it should be and acts on the gap. A thermostat is the plain case. Detection and response is the security case: a threat lands, something sees it, someone acts, the function comes back. The loop's strength is how fast it closes the gap. Its delay is the time between the gap appearing and the action arriving, and the delay is what makes balancing loops misbehave. Act on a reading that is already old and you overshoot, then overshoot the other way, and the system oscillates around the goal instead of settling on it. A loop that is too weak loses to any reinforcing loop it faces. A loop with a long delay chases the problem it had an hour ago. Meadows put the strength of balancing loops and the length of delays above any parameter as places to act, because a weak or late loop cannot be fixed by tuning the thing it is trying to hold.",
    why: "In the model a detect layer shortens the dwell of a landed threat and a resilience layer speeds recovery. Both are balancing loops, and the day chart shows whether they closed the gap in time or only after the service was gone.",
    related: ["feedback-loop", "reinforcing-loop", "system-delay", "dwell-time", "mean-time-to-detect"],
    mode: "both"
  },
  {
    id: "resilience",
    term: "Resilience",
    domain: "Systems",
    short: "The capacity of a system to recover its function after a shock. Different from resisting the shock in the first place.",
    long: "Meadows described resilience as a measure of the range of conditions a system can return from, and warned that it is invisible until it is tested. A rigid system can look stronger than a resilient one right up to the day it breaks. Hollnagel gave resilience four parts that a programme can build and check: respond to what happens, monitor what is changing, learn from what has happened, and anticipate what could. Most security spending buys resistance, which is the ability to keep a threat out. Resilience is what the organisation has left when resistance fails, and resistance always fails somewhere. A hospital that can run on paper for a night, a water plant whose operators can turn the pumps by hand, a bank that can hold instant payments for an hour and release them later, each has a resilience that no control at the perimeter provides. Resilience is bought with slack, with practice, and with the decision in advance of which function is kept last.",
    why: "A resilience layer in a stack speeds recovery in the model and nothing else, which is honest about what it does. It does not stop the threat. It shortens how long the lost hours last.",
    related: ["slack", "graceful-degradation", "defense-in-depth", "balancing-loop", "normal-accident"],
    mode: "both"
  },
  {
    id: "slack",
    term: "Slack",
    domain: "Systems",
    short: "Spare capacity, time and attention that absorb variation. The first thing efficiency removes and the first thing an incident needs.",
    long: "Every system that survives surprises carries some slack: a second person who knows the procedure, a buffer tank, a manual mode, a budget line nobody has committed, an on-call engineer who is not already at full load. Slack looks like waste on a quiet day, so efficiency programmes remove it, and the removal is invisible until the day it is needed. Perrow drew the line between loose coupling, where slack lets one failure wait while people respond, and tight coupling, where there is no time and no substitute. A post incident review that is honest will usually find a piece of slack that had been cut in the year before: the retired backup operator, the second circuit that was consolidated to save money, the staging environment that was turned off. Slack is a design decision, and it has to be defended on the quiet days by someone who can say what it is for.",
    why: "In the model a part with slack holds its level for a while after its supply fails. That delay is the window in which a balancing loop can act. Remove the slack and the window closes.",
    related: ["resilience", "tight-coupling", "system-delay", "normal-accident", "graceful-degradation"],
    mode: "both"
  },
  {
    id: "normal-accident",
    term: "Normal Accident",
    domain: "Systems",
    short: "Perrow's finding that in a system that is both interactively complex and tightly coupled, some accidents are inevitable.",
    long: "Charles Perrow studied Three Mile Island and concluded that the accident was not caused by a single operator error or a single broken part. Two properties of the plant made it certain that some combination of small failures would one day interact in a way nobody had foreseen. Interactive complexity means parts affect each other in ways that are not visible or planned, so a failure in one place shows up as a strange reading somewhere else. Tight coupling means there is no time to understand the strange reading before the next thing happens. Together they make an accident that is normal in the sense of expected. Adding alarms to such a system does not help, because the alarms are part of the complexity. The ways out are to reduce the coupling, with slack and breakers, or to reduce the complexity, with simpler and better understood dependencies. Modern infrastructure, where a directory, a time service and a vendor's cloud sit under everything, has both properties by default.",
    why: "A gauge at Systemic assumes one of your layers fails and asks whether the rest still holds. That is Perrow's question asked of your stack.",
    related: ["tight-coupling", "cascade-failure", "slack", "breaker", "drift-into-failure", "failure-domain", "swiss-cheese-model", "safety-ii"],
    mode: "both"
  },
  {
    id: "policy-resistance",
    term: "Policy Resistance",
    domain: "Systems",
    short: "When people with different goals each pull a stock their way, every push is met by a counter push and the system stays where it was.",
    long: "Meadows called it the trap of fixes that get fought. A security team sets a password standard, people set up workarounds to meet their own goal of getting work done, the team tightens the standard, the workarounds get more creative, and after a year the real security of the accounts is where it started while everyone is more tired. Each actor is behaving sensibly for their own goal. The stock does not move because the goals disagree. More force from one side only raises the force from the other. The way out is to find a goal every actor can share and change the system so that the sensible thing for each of them also moves the stock. Passkeys end the password fight for that reason: they make the secure path the easy one. The same shape appears in vulnerability deadlines, in change freezes, and in any rule that engineers route around.",
    why: "When a gauge's debrief says a structure held on paper and failed in the room, look for the goal it was fighting. A control that people work around does not count as a layer in the model, and it should not count as one in your programme.",
    related: ["goodharts-law", "paved-road", "fixes-that-fail", "shifting-the-burden", "leverage-point"],
    mode: "both"
  },
  {
    id: "shifting-the-burden",
    term: "Shifting the Burden",
    domain: "Systems",
    short: "A symptomatic fix that works well enough to weaken the capacity for the fundamental fix.",
    long: "Senge's archetype has two balancing loops pulling on one symptom. One is quick and treats the symptom. The other is slow and treats the cause. The quick one works, which relieves the pressure that was driving the slow one, so the fundamental fix is postponed again, and each round leaves the organisation more dependent on the quick fix. An incident response retainer that is called for every incident shifts the burden from building a team that can run one. A tool that suppresses noisy alerts shifts the burden from fixing the data that makes them noisy. Paying a ransom shifts the burden from backups that work. The tell is a fix that has to be repeated, with a capacity that was supposed to grow and did not. The way out is to use the symptomatic fix as a bridge with an end date, and to put the saved time into the fundamental one while the symptom is quiet.",
    why: "The Modux catalog separates structures that stop a threat from structures that recover from one. If your record holds only through the recovering kind, the burden has been shifted, and a notch that adds a faster threat will find it.",
    related: ["fixes-that-fail", "policy-resistance", "security-debt", "resilience", "leverage-point"],
    mode: "both"
  },
  {
    id: "fixes-that-fail",
    term: "Fixes That Fail",
    domain: "Systems",
    short: "A fix that relieves a symptom now and, after a delay, brings it back worse through a consequence nobody traced.",
    long: "The archetype is a balancing loop with a reinforcing loop hidden under it. The fix closes the gap on the symptom, and a side effect of the fix feeds the cause. Blocking USB storage sends files to personal cloud shares. Adding an approval step to every change makes people batch their changes into larger and riskier ones. Requiring a second factor on every action trains people to approve prompts without reading them, which is the behaviour push bombing exploits. The delay is what hides it: by the time the symptom returns the fix has been forgotten as a cause, so the same fix is applied harder. Reading the archetype takes one question asked before the fix ships, which is what the people affected by it will do next to reach their own goal. The answer is usually known to anyone who asks them.",
    why: "At Wicked the adversary picks against your last stack. That is the archetype made into a game rule: every structure you add is also a behaviour the next pressure is written to exploit.",
    related: ["shifting-the-burden", "policy-resistance", "system-delay", "alert-fatigue", "goodharts-law"],
    mode: "both"
  },
  {
    id: "tragedy-of-the-commons",
    term: "Tragedy of the Commons",
    domain: "Systems",
    short: "A shared resource that nobody owns gets used past its limit because the cost of each use falls on everyone and the benefit on one.",
    long: "Hardin's pasture is the famous case, and Meadows reframed it as a missing feedback: the user of the commons gets the benefit of their use at once and feels only a small share of the damage, with a delay. Security programmes are full of commons. A shared service account is one. The ingest budget of the log platform is one, consumed by every team that turns on verbose logging. The attention of the on-call engineer is one, drawn down by every team that ships an alert without tuning it. The time of the one person who knows the legacy system is one. Each use is reasonable and the sum is a resource that is gone when it is needed. There are two repairs. Give the commons an owner who can say no, or build the feedback so that each user feels the cost of their use, with a quota, a charge, or a visible count.",
    why: "A gauge's budget is a commons across your stack. Every structure you add spends from it, and the leverage list is the feedback that tells you what each one bought.",
    related: ["feedback-loop", "alert-fatigue", "control-decay", "security-debt", "policy-resistance"],
    mode: "both"
  },
  {
    id: "drift-into-failure",
    term: "Drift Into Failure",
    domain: "Systems",
    short: "A system moves toward failure through small decisions that each made sense, under pressure for efficiency, with no single bad choice to point at.",
    long: "Sidney Dekker's account of how complex organisations fail has no villain in it. Each decision to defer the patch, skip the game day, consolidate the circuit or extend the certificate was locally rational, made by competent people with the information they had and the pressure they were under. The margin erodes a little at a time, the organisation adapts to each new normal, and the day it fails, every step toward the failure had been approved. Diane Vaughan found the same pattern at NASA before Challenger and named the mechanism normalisation of deviance: a deviation that produces no harm becomes the new baseline, and the next deviation is measured from there. The signs are visible if anyone is looking for them. A standard that keeps getting exceptions. A control whose owner has left. A risk acceptance that has been renewed three times. Drift is countered by a person whose job is to notice the margin shrinking and say so while it is still boring.",
    why: "Your gauge record shows drift when a stack that held last quarter no longer does, because a pressure was added or a structure was weakened. Reading the record over time is the point of keeping one.",
    related: ["normal-accident", "control-decay", "security-debt", "slack", "shifting-the-burden"],
    mode: "both"
  },
  {
    id: "graceful-degradation",
    term: "Graceful Degradation",
    domain: "Systems",
    short: "A system that loses function in steps, keeping the most important function longest, instead of failing all at once.",
    long: "Degradation is designed, and the design is a ranking: which function is kept last when the rest is gone. A water plant that can run its pumps by hand keeps water moving when its control network is down. A hospital that can register patients on paper keeps treating when the records system is gone. A payments service that can queue transfers and release them later keeps the money whole when it cannot settle. Each is a decision made in advance, practised, and paid for in slack. The opposite is a system where every function depends on every other, so the first failure is the whole failure. Degradation also buys time, which is the resource a balancing loop needs most: an hour on manual is an hour for detection and response to close the gap before the public feels it.",
    why: "The stress day counts hours of service kept for the people the organisation serves. Graceful degradation is how a stack keeps hours it cannot keep by stopping the threat.",
    related: ["resilience", "slack", "cascade-failure", "tight-coupling", "defense-in-depth"],
    mode: "both"
  }
];
