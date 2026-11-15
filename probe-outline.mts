/* The outline the app starts from (content/outline.gen.ts) matches the curriculum, and filling it gives back the
   curriculum exactly: every chapter, page, Step, award, guide and room with every field, the glossary and the
   project templates whole, nothing duplicated. Run: npx tsx probe-outline.mts */
(globalThis as any).self = globalThis;
const { buildOutline } = await import('./scripts/content-outline.mts');
const { readFileSync } = await import('node:fs');
const problems: string[] = [];
const bad = (m: string) => problems.push(m);

/* 1. the file is current */
if (readFileSync('src/content/outline.gen.ts', 'utf8') !== await buildOutline()) bad('src/content/outline.gen.ts is out of date: run npx tsx scripts/content-outline.mts');

/* 2. before the rest arrives, the registry holds the outline: titles, no long text */
const R = await import('./src/content/registry');
if (R.contentReady()) bad('the registry is full before anything asked for it');
const firstStep = R.CHAPTERS[0].pages[0].steps[0];
if (firstStep.blocks.length) bad('the outline carries Step blocks');
if (R.TERMS.length) bad('the outline carries the glossary');
if (!R.MODUX_MODELS.length || R.MODUX_MODELS.some((m: any) => m.statement || m.evidence.length || m.drill)) bad('the outline carries Modux model text');
if (!R.MODUX_MODELS.every((m: any) => m.name && m.family && m.tier && Array.isArray(m.combines))) bad('the outline lacks a model\'s name, family, tier or links');
if (!R.MODUX_CHAPTERS.length || R.MODUX_CHAPTERS.some((c: any) => c.pages.some((p: any) => p.steps.some((s: any) => s.blocks.length)))) bad('the outline carries Modux step blocks');
const held = { chapter: R.CHAPTERS[0], page: R.CHAPTERS[0].pages[0], step: firstStep, award: R.AWARDS[0], sim: R.SIMS[0], guide: R.GUIDES[0], model: R.MODUX_MODELS[0], course: R.MODUX_CHAPTERS[0] };

/* 3. filling it gives the curriculum back exactly, and keeps every object it already handed out */
const { FULL } = await import('./src/content/full');
await R.loadContent();
if (!R.contentReady()) bad('loadContent did not fill the registry');
/* the same data, whatever order the keys were written in */
const canon = (x: unknown): unknown => Array.isArray(x) ? x.map(canon) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x as object).sort().map(k => [k, canon((x as Record<string, unknown>)[k])])) : x;
const same = (a: unknown, b: unknown) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
if (!same(R.CHAPTERS, FULL.chapters)) bad('the twelve chapters differ from the curriculum after filling');
const outlier = R.ALL_CHAPTERS.find(c => c.id === FULL.outlier?.id);
if (FULL.outlier && !same(outlier, FULL.outlier)) bad('the hidden chapter differs after filling');
if (!same(R.AWARDS, FULL.awards)) bad('the awards differ after filling');
if (!same(R.GUIDES, FULL.guides)) bad('the guides differ after filling');
if (!same(R.SIMS, FULL.sims)) bad('the rooms differ after filling');
if (!same(R.TERMS, FULL.terms)) bad('the glossary differs after filling');
if (!same(R.PROJECTS.slice(0, FULL.projects.length), FULL.projects)) bad('the project templates differ after filling');
if (!same(R.PROJECTS.slice(FULL.projects.length), FULL.moduxProjects)) bad('the Modux stacks\' project templates differ after filling');
if (!same(R.MODUX_MODELS, FULL.moduxModels)) bad('the Modux models differ from the catalog after filling');
if (!same(R.MODUX_CHAPTERS, FULL.moduxChapters)) bad('the Modux courses differ after filling');
if (held.model !== R.MODUX_MODELS[0] || held.course !== R.MODUX_CHAPTERS[0] || R.moduxById(held.model.id) !== held.model) bad('filling replaced a Modux object instead of filling it');
if (!held.model.statement || !held.course.pages[0].steps[0].blocks.length) bad('a Modux model or step held from the outline is still empty after filling');
if (R.ALL_CHAPTERS.filter((c: any) => R.MODUX_CHAPTERS.includes(c)).length !== R.MODUX_CHAPTERS.length) bad('the Modux courses are not all among the chapters the lookups search');
if (held.chapter !== R.CHAPTERS[0] || held.step !== R.CHAPTERS[0].pages[0].steps[0] || held.award !== R.AWARDS[0] || held.sim !== R.SIMS[0] || held.guide !== R.GUIDES[0]) bad('filling replaced an object instead of filling it');
if (!held.step.blocks.length) bad('a Step held from the outline is still empty after filling');
if (R.resolveTerm(FULL.terms[0].id).term?.id !== FULL.terms[0].id) bad('the glossary does not resolve after filling');
await R.loadContent();
if (R.TERMS.length !== FULL.terms.length) bad('filling twice duplicated the glossary');

const kb = (n: number) => Math.round(n / 1024) + ' KB';
console.log('outline ' + kb(readFileSync('src/content/outline.gen.ts').length) + ' · ' + R.CHAPTERS.length + ' chapters, ' + R.AWARDS.length + ' awards, ' + R.GUIDES.length + ' guides, ' + R.SIMS.length + ' rooms, ' + R.TERMS.length + ' terms, ' + R.MODUX_MODELS.length + ' Modux models, ' + R.MODUX_CHAPTERS.length + ' Modux courses');
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
