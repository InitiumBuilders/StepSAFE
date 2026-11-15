import type { Award } from "../schema";

/* Goals, watches and the people held for. Every criterion here is something
   the engine measures from the record: a goal set or reached, a day with all
   three moves made, the people served by the gauges that hold, a stress day
   kept whole, the Systems shelf read to the end. */

export const AWARDS: Award[] = [
  {
    id: "small-goal-set",
    tier: "small",
    name: "A Goal Set",
    glyph: "◦",
    statement: "A goal written against the record is a goal the record can answer.",
    criteria: "Set your first goal on the Praxis Profile.",
    rarity: "common",
    respect: 20,
    trust: 1,
    domain: "Goals",
    research: "Locke and Latham's goal setting research, across four decades and hundreds of studies, found that specific and measurable goals raise performance over vague intentions to do one's best, and that the effect depends on feedback: a goal without a measure the person can see does little. The goals here are measured by the same record the rest of the Praxis keeps."
  },
  {
    id: "small-three-goals",
    tier: "small",
    name: "Three Goals Standing",
    glyph: "⁝",
    statement: "Three goals is a direction. Thirty is a list.",
    criteria: "Have three goals set at once.",
    rarity: "common",
    respect: 30,
    trust: 1,
    domain: "Goals",
    research: "Every goal draws on the same stock of attention and time, so each goal added thins the others. The Praxis caps the list at twenty four and suggests three, and this badge marks the point where a list becomes a direction."
  },
  {
    id: "strong-goal-reached",
    tier: "strong",
    name: "A Goal Reached",
    glyph: "◉",
    statement: "The record moved to where you said it would.",
    criteria: "Reach a measured goal: the record itself crosses the target you set.",
    rarity: "uncommon",
    respect: 120,
    trust: 4,
    domain: "Goals",
    research: "Goal attainment that is verified by an external measure, not by self report, is the form that holds up in replication. A reached goal here means the count of people, hours, gauges, chapters, steps, rooms, guides, notches or days crossed the number you wrote, with no box to tick."
  },
  {
    id: "strong-five-goals",
    tier: "strong",
    name: "Five Reached",
    glyph: "✦",
    statement: "A practice that reaches what it sets can set harder things.",
    criteria: "Reach five goals.",
    rarity: "rare",
    respect: 200,
    trust: 6,
    domain: "Goals",
    research: "Bandura's work on self efficacy found that the strongest source of a person's belief that they can do a hard thing is having done a hard thing, which he called mastery experience. Five reached goals is a record of mastery experience the learner can read back."
  },
  {
    id: "small-held-ten-thousand",
    tier: "small",
    name: "Ten Thousand Held For",
    glyph: "⌂",
    statement: "A town's worth of people kept in service on the day it was tested.",
    criteria: "Hold gauges whose organisations serve ten thousand people in all, counted by the model.",
    rarity: "common",
    respect: 40,
    trust: 2,
    domain: "Systems",
    research: "The 2023 Unitronics controller compromises reached small water utilities, including the authority in Aliquippa, Pennsylvania, whose booster station went to manual operation (CISA advisory AA23-335A). Most water systems in the United States are small and carry the least security staff, so holding for ten thousand is the first mark."
  },
  {
    id: "strong-held-hundred-thousand",
    tier: "strong",
    name: "A Hundred Thousand Held For",
    glyph: "⌂⌂",
    statement: "A city's worth of people, kept in service across more than one system.",
    criteria: "Hold gauges whose organisations serve a hundred thousand people in all, counted by the model.",
    rarity: "uncommon",
    respect: 160,
    trust: 5,
    domain: "Systems",
    research: "A city runs on water, power, telecoms, dispatch and payments together. CISA publishes one set of cybersecurity performance goals for every sector (CISA Cross-Sector Cybersecurity Performance Goals, 2023). Holding for a hundred thousand people in the Praxis takes more than one gauge."
  },
  {
    id: "strong-held-million",
    tier: "strong",
    name: "A Million Held For",
    glyph: "⌂⌂⌂",
    statement: "A million people kept in service is a region that did not notice the day.",
    criteria: "Hold gauges whose organisations serve a million people in all, counted by the model.",
    rarity: "signature",
    respect: 300,
    trust: 8,
    domain: "Systems",
    research: "The largest gauges in the catalog, the city records service and the regional carrier, serve hundreds of thousands each. A million held for means most of the catalog holds, including the ones whose stress day is hardest to keep, and the record shows every one by name."
  },
  {
    id: "strong-full-day-kept",
    tier: "strong",
    name: "A Full Day Kept",
    glyph: "◯",
    statement: "Twenty four hours of service under a stress day, with nothing lost that the public could feel.",
    criteria: "Hold a gauge with a stack whose stress day in the model loses no more than half an hour of service.",
    rarity: "rare",
    respect: 140,
    trust: 4,
    domain: "Systems",
    research: "Resilience engineering measures a system by what it keeps delivering under load, not by what it blocks. A stress day that loses nothing the public can feel means the cascade paths are cut and the balancing loops close in time, which no score of coverage alone can show."
  },
  {
    id: "small-systems-shelf",
    tier: "small",
    name: "The Systems Shelf",
    glyph: "≋",
    statement: "The notation, the places to act, the delays, the cut, and the way to work a problem that has no final answer.",
    criteria: "Read every guide on the Systems shelf.",
    rarity: "uncommon",
    respect: 60,
    trust: 2,
    domain: "Systems",
    research: "Meadows, Sterman, Perrow and Rittel wrote for planners, engineers and sociologists, and almost none of it reaches security training. The five guides on the shelf are that body of work read for a security leader, with the gauges as the worked examples."
  },
  {
    id: "small-watch-kept",
    tier: "small",
    name: "A Watch Kept",
    glyph: "◔",
    statement: "A Step, a room and the gauge, in one day.",
    criteria: "Make all three of the day's moves in one day.",
    rarity: "common",
    respect: 30,
    trust: 1,
    domain: "Goals",
    research: "Habit research finds that a small set of actions done at a fixed point in the day survives longer than a large set done when there is time. The watch is three moves, and a kept watch is the unit the streak is made of."
  },
  {
    id: "strong-seven-watches",
    tier: "strong",
    name: "Seven Watches",
    glyph: "◕",
    statement: "Seven days with all three moves made. The practice is a practice now.",
    criteria: "Keep the watch on seven days.",
    rarity: "uncommon",
    respect: 150,
    trust: 5,
    domain: "Goals",
    research: "Studies of habit formation put the median time for a daily action to become automatic at about two months, with wide variation between people. Seven kept watches is not automatic yet. It is the first week in which the practice held its own shape."
  },
  {
    id: "small-own-system",
    tier: "small",
    name: "Your Own System",
    glyph: "⌘",
    statement: "The map is of a place you are responsible for.",
    criteria: "Map your own organisation, its parts and dependencies, and build it into a gauge.",
    rarity: "uncommon",
    respect: 50,
    trust: 2,
    domain: "Systems",
    research: "Booth Sweeney and Sterman found that even highly educated people misjudge how a stock responds to its flows, the problem they called bathtub dynamics (System Dynamics Review, 2000). Drawing the stocks and flows of your own organisation is the cheapest correction there is. The gauges in the catalog are other people's organisations. This one is yours."
  },
  {
    id: "strong-own-held",
    tier: "strong",
    name: "Held Your Own",
    glyph: "⌘⌘",
    statement: "Your own system, under the pressure library, held.",
    criteria: "Hold a gauge you mapped from your own organisation.",
    rarity: "rare",
    respect: 180,
    trust: 6,
    domain: "Systems",
    research: "A stack that holds on a catalog gauge proves the structures. A stack that holds on your own map proves you know where your organisation's parts are, which is the harder knowledge and the one an incident tests."
  },
  {
    id: "strong-week-held",
    tier: "strong",
    name: "The Week Held",
    glyph: "◷",
    statement: "The same day as everyone else, and it held.",
    criteria: "Hold this week's gauge at notch one with the week's pressure on, in the week it is set.",
    rarity: "uncommon",
    respect: 130,
    trust: 4,
    domain: "Systems",
    research: "Sector exercises work when every participant faces the same scenario at the same time, so CISA runs Cyber Storm as one event. The week's pressure is one scenario for the whole practice, set by the week's number, so a class, a team and a stranger can compare days."
  }
];
