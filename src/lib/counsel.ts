/* THE COUNSEL ENGINE — your unit speaks inside a decision.

   Each specialist reads the options through their own lens and takes a
   position. Positions come from keyword affinity between an option and the
   member's discipline; the line that carries the position is built from that
   member's own authored doctrine and strengths in unit.ts — nothing is
   fabricated about the scenario. Disagreement is engineered on purpose: when
   the room agrees too easily, the last chair is reassigned to the strongest
   counter-position, because a room that always agrees is a failure mode
   (UNITIUM's doctrine, made mechanical).

   Their advice is advice. Sometimes a member's documented blind spot shows —
   KEEPER over-rotates toward custody, VAULT toward halting, VOICE toward
   speaking early. Weighing counsel is the skill being trained, so the engine
   never marks who is right.

   A bespoke, hand-authored Counsel entry (content/counsel/) always wins over
   derivation when one exists for the decision. */

import type { Drill, DrillOption, UnitMember } from '../content/schema';
import { memberById } from '../content/registry';
import { COUNSEL_AUTHORED } from '../content/counsel';

/* what each discipline gravitates toward, and the phrase-shapes of its voice */
const LENS: Record<string, { keys: string[]; opener: string[] }> = {
  'u-seva': { keys: [], opener: [] }, // Seva never takes a side — handled separately
  'u-keeper': {
    keys: ['key', 'sign', 'custody', 'quorum', 'rotate', 'ceremony', 'multisig', 'hsm', 'freeze', 'revoke', 'credential', 'secret'],
    opener: ['Custody first.', 'Before anything is signed —', 'The keys decide this one.'],
  },
  'u-lantern': {
    keys: ['detect', 'log', 'telemetry', 'alert', 'signal', 'monitor', 'baseline', 'hunt', 'visibility', 'coverage'],
    opener: ['What can we actually see?', 'Coverage before conclusions.', 'The telemetry answers this.'],
  },
  'u-forge': {
    keys: ['deploy', 'pipeline', 'build', 'dependency', 'patch', 'code', 'release', 'artifact', 'supply', 'vendor', 'sdk'],
    opener: ['Look at the pipeline.', 'The build path is the exposure.', 'Fix the path, not the person.'],
  },
  'u-anchor': {
    keys: ['contain', 'isolate', 'incident', 'escalate', 'declare', 'command', 'triage', 'evidence', 'preserve', 'scope'],
    opener: ['Span of control, first.', 'Preserve before you act.', 'Somebody has to own this — formally.'],
  },
  'u-ledger': {
    keys: ['risk', 'regulator', 'legal', 'counsel', 'notify', 'disclosure', 'record', 'document', 'liability', 'compliance', 'audit', 'dpia'],
    opener: ['The written record outlives us all.', 'State it as frequency and magnitude.', 'What does the file look like in a year?'],
  },
  'u-mirror': {
    keys: ['attacker', 'adversary', 'assume', 'lateral', 'persistence', 'foothold', 'campaign', 'red', 'exploit'],
    opener: ['Think like the person doing this to you.', 'Ask what I would do next.', 'The adversary has a plan for your obvious move.'],
  },
  'u-hearth': {
    keys: ['insider', 'employee', 'people', 'staff', 'social', 'phish', 'coerc', 'tired', 'human', 'departing', 'access review'],
    opener: ['There is a person inside this decision.', 'Ask who is tired and who is scared.', 'The control has to survive a bad week.'],
  },
  'u-vault': {
    keys: ['contract', 'treasury', 'bridge', 'pause', 'halt', 'upgrade', 'exploit', 'drain', 'onchain', 'transaction', 'broadcast', 'funds'],
    opener: ['Irreversibility changes the math.', 'On-chain, there is no undo.', 'Read what you are about to sign.'],
  },
  'u-cartographer': {
    keys: ['validator', 'node', 'network', 'consensus', 'gateway', 'infrastructure', 'peer', 'rpc', 'shared', 'dependency'],
    opener: ['Name what the parts still share.', 'The topology is the threat model.', 'Where is the single point pretending not to be one?'],
  },
  'u-signal': {
    keys: ['attest', 'claim', 'reputation', 'stake', 'graph', 'identity', 'verify', 'provenance', 'issuer', 'atom', 'triple'],
    opener: ['Who issued this claim, and when does it expire?', 'Weigh the signal by its provenance.', 'A stake is not a fact.'],
  },
  'u-tide': {
    keys: ['restore', 'backup', 'recover', 'rebuild', 'failover', 'continuity', 'rollback', 'rto', 'resilience'],
    opener: ['Plan the way back before you jump.', 'What is the restore path?', 'Recovery is a rehearsed act, not a hope.'],
  },
  'u-compass': {
    keys: ['budget', 'roadmap', 'priorit', 'quarter', 'program', 'resource', 'sequence', 'defer', 'scope'],
    opener: ['Sequence it.', 'What are we refusing in order to do this?', 'This is a prioritisation call wearing a technical costume.'],
  },
  'u-oracle': {
    keys: ['model', 'prompt', 'agent', 'llm', 'inference', 'weights', 'training', 'injection', 'ai', 'automation'],
    opener: ['Treat the model output as attacker-controlled.', 'The model is an input surface.', 'Ask what the agent can reach.'],
  },
  'u-voice': {
    keys: ['press', 'statement', 'public', 'communicat', 'board', 'narrative', 'announce', 'journalist', 'customer', 'disclose'],
    opener: ['Say it early, in our own words.', 'The silence is also a statement.', 'Whoever explains this first, frames it.'],
  },
  'u-unitium': {
    keys: [],
    opener: ['The room is agreeing too fast.', 'Hold the disagreement open a moment longer.', 'Coherence is a failure mode too.'],
  },
};

function fnv(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

function affinity(member: string, opt: DrillOption): number {
  const lens = LENS[member];
  if (!lens) return 0;
  const hay = (opt.label + ' ' + (opt.detail || '')).toLowerCase();
  let n = 0;
  for (const k of lens.keys) if (hay.includes(k)) n += 2;
  return n;
}

function shortLeaning(opt: DrillOption): string {
  const words = opt.label.split(/\s+/);
  return words.length <= 6 ? opt.label : words.slice(0, 6).join(' ') + '…';
}

/* Seva's whole method: never the answer, always the question underneath it. */
const SEVA_QUESTIONS = [
  'Before you choose — which of these can you not undo?',
  'One of these options is the one you would pick if you were not being watched. Which is it, and why is that not your answer?',
  'What would you need to believe for your second choice to be the right one? Check whether you actually believe it.',
  'Which option are you drawn to because it feels decisive rather than because it is correct?',
  'If this goes wrong, which of these leaves you able to explain your reasoning with a straight face?',
  'Strip the outcome you are hoping for. What was knowable at this hour, with these facts?',
];

export interface SpokenVoice {
  member: UnitMember;
  present: boolean;
  line: string;
  leaning: string;
}

export function counselFor(simId: string, drill: Drill, roles: string[], present: string[]): {
  voices: SpokenVoice[];
  split: boolean;
} {
  /* bespoke, hand-authored counsel always beats derivation */
  const authored = COUNSEL_AUTHORED.find(c => c.simId === simId && c.decisionId === drill.id);
  if (authored) {
    const voices: SpokenVoice[] = [];
    for (const v of authored.voices) {
      const member = memberById(v.member);
      if (!member) continue;
      voices.push({ member, present: present.includes(v.member), line: v.line, leaning: v.leaning });
    }
    const leans = new Set(voices.filter(v => v.present && v.member.id !== 'u-seva').map(v => v.leaning));
    return { voices, split: leans.size > 1 };
  }

  const h = fnv(simId + ':' + drill.id);
  const specialists = roles.filter(r => r !== 'u-seva' && r !== 'u-unitium' && LENS[r]);

  /* rank the specialists by how much this decision is theirs */
  const ranked = specialists
    .map(m => {
      const best = drill.options.map(o => ({ o, a: affinity(m, o) })).sort((x, y) => y.a - x.a);
      return { m, pick: best[0], second: best[1] };
    })
    .sort((x, y) => y.pick.a - x.pick.a);

  const seats = ranked.slice(0, Math.min(3, ranked.length));

  /* engineered disagreement: if every seat leans the same way, the last seat
     moves to its own second-strongest option — the deliberate counter-voice */
  const leanIds = seats.map(x => x.pick.o.id);
  if (seats.length >= 2 && new Set(leanIds).size === 1) {
    const last = seats[seats.length - 1];
    const alt = last.second && last.second.o.id !== last.pick.o.id
      ? last.second
      : { o: drill.options.find(o => o.id !== last.pick.o.id)!, a: 0 };
    last.pick = alt;
  }

  const voices: SpokenVoice[] = [];

  for (const seat of seats) {
    const member = memberById(seat.m);
    if (!member) continue;
    const lens = LENS[seat.m];
    const opener = lens.opener[(h + fnv(seat.m)) % lens.opener.length];
    const line =
      opener + ' My read is: ' + seat.pick.o.label.toLowerCase().replace(/\.$/, '') +
      '. ' + '“' + member.doctrine + '”';
    voices.push({
      member,
      present: present.includes(seat.m),
      line,
      leaning: shortLeaning(seat.pick.o),
    });
  }

  /* Seva, when seated, closes the counsel with the reframing question */
  if (roles.includes('u-seva')) {
    const seva = memberById('u-seva');
    if (seva) {
      voices.push({
        member: seva,
        present: present.includes('u-seva') || true, // Seva is always with the learner
        line: SEVA_QUESTIONS[h % SEVA_QUESTIONS.length],
        leaning: 'the question underneath',
      });
    }
  }

  const distinct = new Set(voices.filter(v => v.present && v.member.id !== 'u-seva').map(v => v.leaning));
  return { voices, split: distinct.size > 1 };
}
