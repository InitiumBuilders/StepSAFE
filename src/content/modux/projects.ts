/* Stacks as Praxis Projects. Each stack becomes a project template: adopt
   these models, in this order, where you work, and bring evidence. Every
   field is assembled from the stack and its models; nothing new is claimed. */

import type { ProjectTemplate } from '../schema';
import type { ModuxModel, ModuxStack, ModuxTier } from '../modux-schema';

const TIER_DIFFICULTY: Record<ModuxTier, number> = { bedrock: 2, proven: 3, emerging: 4, frontier: 5 };

function firstSentence(s: string): string {
  const i = s.search(/[.!?](\s|$)/);
  return i > 0 ? s.slice(0, i + 1) : s;
}

export function stackProjects(stacks: ModuxStack[], byId: Map<string, ModuxModel>): ProjectTemplate[] {
  return stacks.map(st => {
    const ms = st.models.map(id => byId.get(id)).filter(Boolean) as ModuxModel[];
    const difficulty = Math.max(2, ...ms.map(m => TIER_DIFFICULTY[m.tier]));
    return {
      id: 'px-' + st.id,
      title: 'Adopt ' + st.name,
      domain: 'modux',
      statement: st.statement,
      difficulty,
      weeks: Math.max(4, ms.length * 2),
      brief: st.why + ' Fits: ' + st.fits,
      deliverables: ms.map(m => m.name + ': ' + firstSentence(m.adoption)),
      evidence: ms.map(m => m.name + ': ' + (m.signals[0] || 'a written record that it is in place')),
      rubric: ms.map(m => ({
        dimension: m.name,
        strong: m.signals[1] || m.signals[0] || 'In place and verified.',
        weak: m.failsWhen[0] || 'In place on paper only.',
      })),
      awards: [],
      mode: 'both',
    };
  });
}
