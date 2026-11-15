import type { Award } from "../schema";

/* The known systems and the hidden chapter. Both are measured from the
   record on the device: a map started from a known system, and the three
   keys to Chapter 2.6.7 held at once. */

export const AWARDS: Award[] = [
  {
    id: "small-known-system",
    tier: "small",
    name: "A Real System",
    glyph: "◇",
    statement: "A real organisation's map shows you a shape that has already been tested.",
    criteria: "Start a map in Map your own system from one of the known systems.",
    rarity: "common",
    respect: 20,
    trust: 1,
    domain: "Modux",
    research: "Klein, Calderwood and Clinton-Cirocco (1986) studied fireground commanders and found they rarely compared options side by side. They recognised the situation as a kind they had seen and acted on that. A known system gives you a kind to recognise before your own system has its worst day."
  },
  {
    id: "strong-outlier-open",
    tier: "strong",
    name: "The Hidden Chapter",
    glyph: "◈",
    statement: "Three keys opened a chapter that was not on the map.",
    criteria: "Open The Keeper, run a gauge, and start a map from a known system. Chapter 2.6.7 opens when all three are true.",
    rarity: "rare",
    respect: 60,
    trust: 3,
    domain: "Modux",
    research: "Donella Meadows (1999), in Leverage Points: Places to Intervene in a System, ranked twelve places to change a system. She found that people push hardest on the numbers, which change behaviour least, and least on goals, rules and information flows, which change it most. This chapter reads real systems for those deeper places."
  },
];
