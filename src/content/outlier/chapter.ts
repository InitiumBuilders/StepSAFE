/* CHAPTER 2.6.7: OUTLIER SYSTEMS STRUCTURES AND INSIGHTS. A hidden chapter.
   It opens when three things are true: The Keeper has opened, a gauge has
   been run, and a known system has been chosen in Map your own system. It
   is built from the known systems and Davara's synthesis across them: one
   Step per system, read in groups, framed by how to read a system and closed
   by the patterns the outliers share. It sits outside CHAPTERS, so the
   twelve and the unit's phases stay as they are. */

import type { Chapter, Page, Step, StepBlock } from '../schema';
import { KNOWN_SYSTEMS } from './systems';
import { SYNTHESIS } from './synthesis';
import type { KnownSystem } from './schema';
/* names of the catalog structures the entries cite, written by the generator: the outlier chunk must not import
   the modux chunk, which imports it (a cycle between two chunks breaks the production build at load) */
import { MODEL_NAMES } from './names';
import { COMMONS } from './commons';
import { OUTLIER_ID, KEEPER_ID } from './ids';
export { OUTLIER_ID, OUTLIER_NUMBER, COMING_NUMBER, KEEPER_ID } from './ids';
const modelName = (id: string) => MODEL_NAMES[id] || id;


const host = (url: string) => { try { return new URL(url).host.replace(/^www\./, ''); } catch { return url; } };
const words = (x: string) => (x.match(/\S+/g) || []).length;
const slug = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function systemStep(k: KnownSystem): Step {
  const b: StepBlock[] = [];
  b.push({ kind: 'principle', title: 'The keystone question', body: k.keystoneQuestion });
  if (k.synthesis) b.push({ kind: 'prose', body: k.synthesis });
  if (k.tagline) b.push({ kind: 'quote', body: k.tagline.text, source: k.name + ', ' + host(k.tagline.source) });
  b.push({ kind: 'callout', title: 'The outlier move', body: k.outlierMove });
  b.push({ kind: 'prose', title: 'The problem it makes headway on', body: k.coreProblem + (k.knownFor ? '\n\n' + k.knownFor : '') });
  if (k.structure) b.push({ kind: 'prose', title: 'Its structure', body: k.structure });
  if (k.stocks.length || k.flows.length) b.push({ kind: 'compare', title: 'What it holds and what moves', left: { title: 'Stocks', items: k.stocks }, right: { title: 'Flows', items: k.flows } });
  if (k.loops.length) b.push({ kind: 'table', title: 'The loops that drive it', headers: ['Loop', 'Kind', 'How it runs'], rows: k.loops.map(l => [l.name, l.kind === 'reinforcing' ? 'Reinforcing' : 'Balancing', l.how]) });
  if (k.evolution.length) b.push({ kind: 'timeline', title: 'How it moved and restructured', items: k.evolution.map(e => e.when + '. ' + e.move) });
  if (k.doesWell.length) b.push({ kind: 'list', title: 'What it does very well', items: k.doesWell });
  if (k.leveragePoints.length) b.push({ kind: 'table', title: 'Its leverage points, deepest first', headers: ['Leverage point', 'Why it moves the system'], rows: k.leveragePoints.map(l => [l.point, l.why]) });
  if (k.securityPosture) b.push({ kind: 'prose', title: 'Its security posture', body: k.securityPosture });
  if (k.securityLeverage.length) b.push({
    kind: 'table', title: 'Its strongest security leverage', headers: ['The move', 'Why it holds', 'In the catalog'],
    rows: k.securityLeverage.map(s => [s.move, s.why, s.models.map(modelName).join(', ') || 'Nothing in the catalog yet']),
  });
  if (k.risks.length) b.push({ kind: 'list', title: 'Where it is exposed', items: k.risks });
  if (k.incidents.length) b.push({ kind: 'table', title: 'On the record', headers: ['When', 'What happened', 'Source'], rows: k.incidents.map(i => [i.when, i.what, host(i.source)]) });
  b.push({ kind: 'callout', title: 'The lesson', body: k.lesson });
  if (k.uncertain.length) b.push({ kind: 'list', title: 'What the sources could not settle', items: k.uncertain });
  b.push({ kind: 'list', title: 'Sources', items: k.sources.map(s => s.label + ': ' + s.url) });
  const text = b.map(x => [x.body, ...(x.items || []), ...(x.rows || []).flat(), ...(x.left?.items || []), ...(x.right?.items || [])].join(' ')).join(' ');
  return {
    id: 'ol-' + k.id, kind: 'lesson', title: k.name, statement: k.lesson,
    minutes: Math.max(6, Math.round(words(text) / 200)), respect: 80, trust: 3, mode: 'both', blocks: b,
    praxis: 'Open Map your own system, start from ' + k.name + ', and run its stress day. Then compare your stack with its strongest security leverage above.',
  };
}

function groups(): { group: string; systems: KnownSystem[] }[] {
  const out: { group: string; systems: KnownSystem[] }[] = [];
  for (const k of KNOWN_SYSTEMS) {
    const g = out.find(x => x.group === k.group);
    if (g) g.systems.push(k); else out.push({ group: k.group, systems: [k] });
  }
  return out;
}

const S = SYNTHESIS;

function openingPage(): Page {
  const b: StepBlock[] = [];
  if (S?.opening) b.push({ kind: 'prose', body: S.opening });
  b.push({ kind: 'table', title: 'The systems in this chapter', headers: ['System', 'The keystone question it answers'], rows: KNOWN_SYSTEMS.map(k => [k.name, k.keystoneQuestion]) });
  b.push({ kind: 'list', title: 'How each system is read', items: [
    'The keystone question it helps the world answer, and the problem it makes headway on.',
    'Its outlier move: the one thing it does better than almost anyone.',
    'Its stocks, its flows and the loops that drive them.',
    'How it moved and restructured over time.',
    'Its leverage points, deepest first, and its strongest security leverage.',
    'Its map, in the same parts and pressures as Map your own system, so it can be run as a stress day.',
  ] });
  return {
    id: 'olp-read', title: 'How To Read An Outlier', credential: 'Outlier Systems · Reading a system',
    summary: 'The lens the chapter reads every system with.', competencies: ['Read a system as stocks, flows and loops', 'Name a keystone question', 'Order leverage points from the deepest'],
    seal: 'SEAL OF THE OPEN LENS',
    steps: [{ id: 'ol-read', kind: 'construct', title: 'How To Read An Outlier', statement: S?.chapter.statement || 'Read a real system as stocks, flows and loops, and its security leverage shows where the system keeps its answer.', minutes: 8, respect: 60, trust: 2, mode: 'both', blocks: b }],
  };
}

function closingPage(): Page {
  const steps: Step[] = [];
  if (S) {
    steps.push({
      id: 'ol-patterns', kind: 'council', title: 'What The Outliers Share', statement: S.chapter.statement, minutes: 12, respect: 120, trust: 4, mode: 'both',
      blocks: [
        { kind: 'table', title: 'Patterns across the systems', headers: ['Pattern', 'The reading', 'Where it shows'], rows: S.patterns.map(p => [p.name, p.read, p.examples.join(', ')]) },
        { kind: 'prose', title: 'The synthesis', body: S.closing },
      ],
    });
    if (S.strongest && S.strongest.length) steps.push({
      id: 'ol-strongest', kind: 'council', title: 'The Strongest Moves', statement: 'These are the security moves that held across the most systems, ranked, with the structures in the catalog that build them.', minutes: 8, respect: 90, trust: 3, mode: 'both',
      blocks: [{ kind: 'table', title: 'The strongest sound security moves across every system', headers: ['The move', 'Why it holds', 'Who makes it', 'In the catalog'], rows: S.strongest.map(x => [x.move, x.why, x.systems.join(', '), x.models.map(modelName).join(', ') || 'Nothing in the catalog yet']) }],
      praxis: 'Pick the move on this list your own organisation lacks, map where it would sit in Map your own system, and run the stress day with and without it.',
    });
    if (COMMONS.foundations.length) steps.push({
      id: 'ol-commons', kind: 'lab', title: 'What They All Rest On',
      statement: 'Most of these systems stand on a few shared foundations, so one structural move at a foundation protects every system above it.', minutes: 10, respect: 90, trust: 3, mode: 'both',
      blocks: [{ kind: 'table', title: 'The shared foundations, from the model', headers: ['Foundation', 'Systems resting on it', 'Hours lost if it fails', 'The one move for all of them'],
        rows: COMMONS.foundations.map(f => [f.name, String(f.rests.length), String(Math.round(f.lost)), f.contain[0] ? f.contain[0].name + ' keeps ' + Math.round(f.contain[0].gain) + ' hours across ' + f.contain[0].helped + (f.contain[0].helped === 1 ? ' system' : ' systems') : 'No single move stands out']) }],
      praxis: 'Find the foundation your own organisation leans on hardest, then check whether one failure there would take you down along with everyone else who rests on it.',
    });
    if (S.moduxAdditions.length) steps.push({
      id: 'ol-modux', kind: 'lab', title: 'What This Changes In The Gauges', statement: 'A real system is the best test of a gauge, so each one taught the gauges something.', minutes: 6, respect: 60, trust: 2, mode: 'both',
      blocks: [{ kind: 'table', title: 'Additions drawn from these systems', headers: ['Addition', 'What it is', 'From'], rows: S.moduxAdditions.map(a => [a.title, a.detail, a.from.join(', ')]) }],
      praxis: 'Map one of these systems, run its stress day, and hold it at a higher notch than the reference stack.',
    });
  }
  return {
    id: 'olp-patterns', title: 'What The Outliers Share', credential: 'Outlier Systems · The patterns across them',
    summary: 'The synthesis across every system in the chapter.', competencies: ['Name the patterns outlier systems share', 'Say where their security leverage lives'],
    seal: 'SEAL OF THE OUTLIER', steps,
  };
}

export const OUTLIER_CHAPTER: Chapter | null = KNOWN_SYSTEMS.length ? {
  id: OUTLIER_ID,
  act: 'OUTLIER SYSTEMS',
  order: 267,
  title: 'Outlier Systems Structures And Insights',
  subtitle: S?.chapter.subtitle || 'The structures, loops and security leverage of ' + KNOWN_SYSTEMS.length + ' real systems',
  essence: 'violet',
  thesis: S?.chapter.thesis || 'Each system in this chapter is read the same way: the question it answers, the problem it makes headway on, its stocks, flows and loops, how it changed over time, its leverage points, and where its security has the most leverage.',
  statement: S?.chapter.statement || 'Read a real system as stocks, flows and loops, and its security leverage shows where the system keeps its answer.',
  why: S?.chapter.why || 'A security leader defends a system they did not design. Reading systems that already work at scale shows which structures hold under pressure and which ones fail first.',
  outcomes: S?.chapter.outcomes || [
    'Name the keystone question a system answers and the problem it makes headway on.',
    'Read a system as stocks, flows and the loops that drive them.',
    "Order a system's leverage points from the deepest to the shallowest.",
    "Find a system's strongest security leverage and the catalog structures that match it.",
  ],
  prereq: [KEEPER_ID],
  sources: KNOWN_SYSTEMS.map(k => ({ label: k.name, note: 'Researched from ' + k.sources.length + ' public sources, among them ' + k.sources.slice(0, 2).map(s => host(s.url)).join(' and ') + '. The notes with every source are in research/outlier/notes/' + k.id + '.md.' })),
  pages: [
    openingPage(),
    ...groups().map(g => ({
      id: 'olp-' + slug(g.group), title: g.group, credential: 'Outlier Systems · ' + g.group,
      summary: g.systems.map(k => k.name).join(', ') + '.',
      competencies: ['Name the keystone question each system answers', 'Read its stocks, flows and loops', 'Find its strongest security leverage'],
      seal: 'SEAL OF ' + g.group.toUpperCase(),
      steps: g.systems.map(systemStep),
    })),
    closingPage(),
  ].filter(p => p.steps.length),
} : null;
