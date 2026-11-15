import type { Guide } from "./schema";

/* StepGUIDES :: the model behind every gauge, written down so it can be
   argued with. Every constant, every rule, the three incidents it is checked
   against with the result, and what it does not do. Kept in step with
   content/modux/dynamics.ts and content/modux/calibration.ts. */

export const GUIDE_MODEL: Guide = {
  id: "sg-the-model-written-down",
  title: "The Model, Written Down",
  domain: "Systems",
  kind: "model",
  statement: "A number you cannot argue with is a number you should not carry into a meeting.",
  summary:
    "Every gauge runs the same model: parts that hold a stock of their function, dependencies that carry it after a delay, threats that push on parts, structures that take the push away or cut the path. This guide writes down every rule and every constant, the three public incidents the model is checked against before each release, and what the model does not do.",
  minutes: 14,
  mode: "both",
  blocks: [
    {
      kind: "prose",
      title: "What the hours are",
      body:
        "The model answers one question: on the same map, which stack keeps more of the day for the people the organisation serves. It runs two days. The stress day lands every threat in the first hour, which is the floor. The spread day lands them across twenty hours, which is the most a stack keeps. The page shows both as a range, in whole hours. The hours are a comparison between stacks on one map. They are not a forecast of an incident, and two maps drawn by two people will give two different days.\n\nThe constants below were set by hand. They were not fitted to data. They are checked against the shape of three public incidents, and a release does not ship if any check fails."
    },
    {
      kind: "numbered",
      title: "The rules, in the order the model applies them",
      items: [
        "Every part holds a stock of its function, from 0 to 1, and starts the day at 1.",
        "Every dependency carries the upstream part's function to the part that depends on it, after a delay: 3 hours when the link is a supply (supplies, powers, ships, treats, delivers), 1 hour into people or the public, and 15 minutes otherwise.",
        "A threat that lands pushes on its part with a pressure set by its weight: (weight / 3) squared, so 0.11, 0.44 or 1. One structure in the stack that counters it lets a tenth of that through. Two or more let nothing through.",
        "A landed threat keeps pushing for 6 hours. Each detection structure that counters it shortens that, and detection only works as far as the people parts still function: dwell is 6 / (1 + detection structures x people).",
        "A part moves toward the lower of two ceilings. The first is what it is supplied: the lowest function arriving along its dependencies that are not cut. The second is what the threats on it leave: 1 minus the pressure getting through.",
        "It falls toward that ceiling fast: 0.9 per hour of the gap when a threat set it, 0.7 per hour when the supply set it. It recovers toward it slowly: 0.12 per hour of the gap, times 1.6 for each resilience structure among its threats' counters, times a people factor between one half and one.",
        "People: the mean function of the parts of kind People. A map with no people part counts as fully staffed.",
        "Cuts. A breaker for a kind of part cuts what crosses into that kind from another kind; a failure between two parts of the same kind still travels. Fail safe defaults cut what a control or time part commands. Cell architecture and a blast radius budget cut every crossing between kinds. Loose coupling cuts nothing and adds 2 hours to every delay.",
        "Service is what reaches the public parts along every dependency, cut or not, because a cut into the public keeps trust and not the water. Trust is the public parts' own stock. Hours lost is the shortfall in service, added up over the day.",
        "Leverage is measured, one move at a time: the stress day with and without each candidate structure, ranked by hours kept per point of budget."
      ]
    },
    {
      kind: "table",
      title: "The constants",
      headers: ["Constant", "Value", "What it stands for"],
      rows: [
        ["Threat fall rate", "0.9 per hour", "How fast a part falls toward what a landed threat leaves it"],
        ["Supply fall rate", "0.7 per hour", "How fast a part falls toward what still reaches it"],
        ["Recovery rate", "0.12 per hour", "How fast a part comes back, before resilience and people"],
        ["Resilience", "x 1.6 each", "Each resilience structure among the part's threats' counters"],
        ["Dwell", "6 hours", "How long a landed threat keeps pushing with nothing to see it"],
        ["Layers", "1, 0.1, 0", "Pressure through zero, one, two or more countering structures"],
        ["Threat pressure", "0.11, 0.44, 1", "Weight 1, 2 and 3, as (weight / 3) squared"],
        ["Delays", "3 h, 1 h, 15 min", "A supply link, a link into people or the public, any other link"],
        ["Loose coupling", "+ 2 hours", "Slack added to every delay"],
        ["People factor", "0.5 to 1", "Recovery pace with the people parts down or whole"]
      ]
    },
    {
      kind: "table",
      title: "The checks: three public incidents",
      body: "Each incident is written as the smallest map that carries its shape. The check is what fell first with nothing in place, and whether the structure that made the difference in the real day makes the difference in the model. Stress day hours, rounded.",
      headers: ["Incident", "What is known", "Check", "Model"],
      rows: [
        ["Booster station, Aliquippa, Pennsylvania, November 2023", "An exposed controller with a default password was taken over. The station went to manual operation; no known risk to the water.", "Controller falls first. Nothing in place: most of the day lost. Manual mode: the day kept.", "Controller first. About 10 hours bare. 24 with fail safe defaults."],
        ["Claims clearinghouse, Change Healthcare, February 2024", "Entry through a remote portal without a second factor. Claims and prescriptions stopped across the United States for weeks; providers with another route recovered sooner.", "Clearinghouse falls first. Nothing in place: most of the day lost. A second factor, or another route: most of the day kept.", "Clearinghouse first. About 9 hours bare. About 22 with a second factor. 24 with a blast radius budget."],
        ["A faulty update, CrowdStrike, 19 July 2024", "An update crashed the Windows machines that received it within minutes. Each machine was fixed by hand, so staff set the pace.", "The agent falls first. Nothing in place: most of the day lost. A cooldown before an update spreads: the day kept.", "Agent first. About 7 hours bare. About 22 with a dependency cooldown."]
      ]
    },
    {
      kind: "list",
      title: "What the model does not do",
      items: [
        "It does not pivot. A blocked adversary in the model stops; a real one tries the next door.",
        "It runs one day. Change Healthcare lasted weeks and NotPetya took Maersk about ten days to rebuild; the model sees the first day of them.",
        "It does not model a decision to stop. Colonial Pipeline shut its pipeline down on purpose in 2021; the model has no part for that choice.",
        "It measures leverage one move at a time, so a pair of structures that only works together is invisible to the ranking.",
        "Threat weights and maps are written by people, including you. A map with a missing dependency gives a day that is too kind.",
        "A run on the board came by link and is reported by whoever sent it. It is a team's record, not a verified one."
      ]
    },
    {
      kind: "prose",
      title: "How to argue with it",
      body:
        "Pick a constant and change it in your head. Then say which of the three incidents the change would break. Raise the recovery rate and the faulty update stops costing most of a day, which is not what airlines lived through. Lower the layer constant to nothing through a single structure and a second factor on the clearinghouse portal keeps every hour, which is more than one structure earns against a determined actor. If a change breaks no incident and makes your own map read truer, it is a better constant, and it should be argued for in the open."
    }
  ],
  sources: [
    { label: "CISA, FBI, NSA and EPA advisory AA23-335A (December 2023)", note: "The Unitronics controller compromises, including the booster station in Aliquippa taken to manual operation." },
    { label: "Testimony of the UnitedHealth Group chief executive to the US Senate Finance Committee (May 2024)", note: "The entry through a remote access portal without multi factor authentication at Change Healthcare." },
    { label: "American Hospital Association, survey of the Change Healthcare impact (March 2024)", note: "How widely the outage reached providers, and how long it lasted for them." },
    { label: "CrowdStrike, Preliminary Post Incident Review and Root Cause Analysis (July and August 2024)", note: "The timing of the faulty content update and its withdrawal, and the manual recovery it required." },
    { label: "John Sterman, Business Dynamics (2000)", note: "Stocks, flows, delays and the practice of writing a model's assumptions down so they can be tested." },
    { label: "Donella Meadows, Thinking in Systems (2008)", note: "The notation the gauges use, and why a model should be judged by the behaviour it produces." }
  ]
};
