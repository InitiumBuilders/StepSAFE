import type { Award } from "../schema";

/* StudyMode. Every criterion here is measured from the study record on the
   device: cards held in the top boxes, cards written in the learner's own
   words, a card that left the FUD range, every kind of card met, and the
   UNITIA earned. Nothing here is self reported. */

export const AWARDS: Award[] = [
  {
    id: "small-study-first-held",
    tier: "small",
    name: "First Card Held",
    glyph: "◌",
    statement: "A card you can still answer weeks later is a card you hold.",
    criteria: "Bring one card in StudyMode to box four.",
    rarity: "common",
    respect: 20,
    trust: 1,
    domain: "StudyMode",
    research: "Cepeda, Pashler, Vul, Wixted and Rohrer (2006) reviewed hundreds of experiments on spaced practice and found that spreading reviews over time beat massing them on every delayed test they examined. The boxes here spread each review further apart as the card holds; box four means its next return is three weeks away."
  },
  {
    id: "small-study-own-words",
    tier: "small",
    name: "Said In Your Own Words",
    glyph: "◦",
    statement: "What you can explain, you can use.",
    criteria: "Write one card In My Own Words.",
    rarity: "common",
    respect: 20,
    trust: 1,
    domain: "StudyMode",
    research: "Chi, de Leeuw, Chiu and LaVancher (1994) found that students prompted to explain a text to themselves as they read understood it better than students who read it twice. Writing a card in your own words is the same act, kept on the card."
  },
  {
    id: "small-study-first-unitia",
    tier: "small",
    name: "The First UNITIA",
    glyph: "·",
    statement: "One UNITIA is a hundred seconds of attention on a card, or one card reviewed.",
    criteria: "Earn your first UNITIA in StudyMode.",
    rarity: "common",
    respect: 10,
    trust: 1,
    domain: "StudyMode",
    research: "Carroll's (1963) model of school learning put time at the centre: the time a learner actually spends engaged, against the time they need. UNITIA counts engaged time on an open card and reviews made, and it is kept on this device as a record."
  },
  {
    id: "strong-study-ten-held",
    tier: "strong",
    name: "Ten Held",
    glyph: "✧",
    statement: "Ten cards held is a working vocabulary.",
    criteria: "Hold ten cards in StudyMode.",
    rarity: "uncommon",
    respect: 80,
    trust: 3,
    domain: "StudyMode",
    research: "Roediger and Karpicke (2006) had students either reread a passage or recall it from memory, and a week later the group that had practised recall remembered more of it. Every grade in StudyMode is given after a recall, and a held card has been recalled at every box on its way up."
  },
  {
    id: "strong-study-fud-cleared",
    tier: "strong",
    name: "Out Of The FUD Range",
    glyph: "◈",
    statement: "A card rated in the FUD range, then rated sound, is a change you can date.",
    criteria: "Rate a card below 1 on Semble Sound, then later rate it +56 or higher.",
    rarity: "uncommon",
    respect: 120,
    trust: 4,
    domain: "StudyMode",
    research: "Bjork and Bjork's work on desirable difficulties found that the conditions that make learning feel hard, such as spacing and testing, are the ones that make it last, and that a learner's own sense of fluency is a poor guide to what they will keep. A card that moved from the FUD range to Semble Sound is that sense changing, kept with the dates on the card."
  },
  {
    id: "strong-study-every-kind",
    tier: "strong",
    name: "The Whole Field",
    glyph: "⊕",
    statement: "Terms, structures, threats, stacks, guides, Steps, rooms and the public incidents, each met at least once.",
    criteria: "Meet a card of every kind in the deck.",
    rarity: "uncommon",
    respect: 100,
    trust: 3,
    domain: "StudyMode",
    research: "Gick and Holyoak (1983) found that people who had met two different examples of a principle were far more likely to apply it to a new problem than people who had met one. The deck holds the same ideas as a term, a structure, a threat, a Step and an incident on purpose, so each idea is met in more than one form."
  },
  {
    id: "strong-study-fifty-held",
    tier: "strong",
    name: "Fifty Held",
    glyph: "✦",
    statement: "Fifty cards held is a field you can walk without a map.",
    criteria: "Hold fifty cards in StudyMode.",
    rarity: "rare",
    respect: 200,
    trust: 6,
    domain: "StudyMode",
    research: "Ericsson, Krampe and Tesch-Römer (1993) described expert performance as the product of deliberate practice: effortful, with feedback, sustained over years. Fifty held cards is a record of that kind of practice in one place, at the size where the systems map starts to join across domains."
  },
  {
    id: "strong-study-hundred-unitia",
    tier: "strong",
    name: "A Hundred UNITIA",
    glyph: "∴",
    statement: "Around three hours of attention on cards, or a hundred reviews, or some of each.",
    criteria: "Earn one hundred UNITIA in StudyMode.",
    rarity: "rare",
    respect: 150,
    trust: 5,
    domain: "StudyMode",
    research: "Dunlosky, Rawson, Marsh, Nathan and Willingham (2013) rated ten study techniques on the evidence and placed practice testing and distributed practice highest. A hundred UNITIA on this deck is a hundred reviews, or hours of spaced recall, in those two techniques."
  },
  {
    id: "small-study-first-test",
    tier: "small",
    name: "First Test Taken",
    glyph: "◎",
    statement: "A test is a review you cannot look ahead in.",
    criteria: "Finish a test in StudyMode.",
    rarity: "common",
    respect: 20,
    trust: 1,
    domain: "StudyMode",
    research: "Agarwal, Nunes and Blunt (2021) reviewed studies of retrieval practice run in real classrooms, across ages and subjects, and found that being tested on material improved how well students learned it. A test in StudyMode is retrieval practice in a block, with the answers held back until the end."
  },
  {
    id: "strong-study-perfect-test",
    tier: "strong",
    name: "Every Question Right",
    glyph: "✦",
    statement: "Twenty or more questions, no hints, none missed.",
    criteria: "Answer every question right on a test of twenty or more.",
    rarity: "rare",
    respect: 160,
    trust: 5,
    domain: "StudyMode",
    research: "Rawson and Dunlosky (2011) studied how many correct recalls it takes for learning to last and found that recalling a concept correctly more than once, spread out over time, was what kept it. A perfect test of twenty is twenty recalls in a row, and every one of them moves its card further along its schedule."
  }
];
