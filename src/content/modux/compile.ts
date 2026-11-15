/* Compile a Modux course into a Chapter.

   A course is an ordered path through the catalog. Each model becomes one
   Step, with its drill attached, so the existing Step engine handles progress,
   respect, drills and the review queue without changes. Pure function: it
   takes the models it needs and depends on no other Modux file. */

import type { Chapter, Page, Step, StepBlock, StepKind } from '../schema';
import type { ModuxCourse, ModuxModel, ModuxTier } from '../modux-schema';
import { TIER_LABEL, FAMILY_LABEL } from '../modux-schema';

const KIND_BY_TIER: Record<ModuxTier, StepKind> = {
  bedrock: 'construct',
  proven: 'lesson',
  emerging: 'lab',
  frontier: 'drill',
};

const RESPECT_BY_TIER: Record<ModuxTier, number> = {
  bedrock: 70,
  proven: 85,
  emerging: 95,
  frontier: 110,
};

const TRUST_BY_TIER: Record<ModuxTier, number> = {
  bedrock: 3,
  proven: 4,
  emerging: 4,
  frontier: 5,
};

export function modelToBlocks(m: ModuxModel, byId: Map<string, ModuxModel>): StepBlock[] {
  const blocks: StepBlock[] = [
    { kind: 'principle', body: m.statement },
    { kind: 'prose', title: 'Where it comes from', body: m.origin },
    { kind: 'prose', title: 'The structure', body: m.structure },
    { kind: 'list', title: 'Parts', items: m.components },
    {
      kind: 'compare',
      left: { title: 'What it defeats', items: m.defeats },
      right: { title: 'Where it fails', items: m.failsWhen },
    },
    { kind: 'callout', title: 'Under stress', body: m.underStress },
    { kind: 'prose', title: 'Systems lens', body: m.systemsLens },
    { kind: 'prose', title: 'How to adopt it', body: m.adoption },
    { kind: 'checklist', title: 'Signs it is working', items: m.signals },
  ];
  if (m.evidence.length) {
    blocks.push({
      kind: 'table',
      title: 'Evidence',
      headers: ['Source', 'What it shows'],
      rows: m.evidence.map(e => [e.label, e.note]),
    });
  }
  if (m.combines.length) {
    blocks.push({
      kind: 'list',
      title: 'Combines with',
      items: m.combines.map(c => {
        const other = byId.get(c.model);
        return (other ? other.name : c.model) + ': ' + c.how;
      }),
    });
  }
  if (m.conflicts && m.conflicts.length) {
    blocks.push({
      kind: 'list',
      title: 'Pulls against',
      items: m.conflicts.map(c => {
        const other = byId.get(c.model);
        return (other ? other.name : c.model) + ': ' + c.how;
      }),
    });
  }
  return blocks;
}

export function modelToStep(course: ModuxCourse, m: ModuxModel, byId: Map<string, ModuxModel>): Step {
  return {
    id: course.id + '--' + m.id,
    kind: KIND_BY_TIER[m.tier],
    title: m.name,
    statement: m.statement,
    minutes: m.minutes,
    respect: RESPECT_BY_TIER[m.tier],
    trust: TRUST_BY_TIER[m.tier],
    mode: m.mode,
    blocks: modelToBlocks(m, byId),
    drill: m.drill,
    glossary: m.tags,
    awards: [],
  };
}

export function compileCourse(course: ModuxCourse, models: ModuxModel[]): Chapter {
  const byId = new Map(models.map(m => [m.id, m]));
  const pages: Page[] = course.pages.map(p => {
    const ms = p.models.map(id => byId.get(id)).filter(Boolean) as ModuxModel[];
    return {
      id: p.id,
      title: p.title,
      credential: p.credential,
      summary: p.summary,
      competencies: ms.map(m => m.name + ': where it fits, what it defeats, where it fails'),
      seal: 'MODUX',
      steps: ms.map(m => modelToStep(course, m, byId)),
    };
  });
  const families = new Set<string>();
  for (const p of pages) for (const s of p.steps) {
    const m = byId.get(s.id.split('--')[1]);
    if (m) families.add(FAMILY_LABEL[m.family]);
  }
  return {
    id: course.id,
    act: 'MODUX MODELS',
    order: 100 + course.order,
    title: course.title,
    subtitle: course.statement,
    essence: course.essence,
    thesis: course.thesis,
    statement: course.statement,
    why: course.thesis,
    outcomes: course.outcomes,
    prereq: [],
    sources: [...families].map(f => ({ label: f, note: 'Models drawn from this family of the Modux catalog.' })),
    pages,
  };
}

export function tierLabel(t: ModuxTier) {
  return TIER_LABEL[t];
}
