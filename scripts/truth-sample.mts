/* The truth sample: 40 research notes drawn with a fixed seed, in proportion to how many notes each kind holds
   (17 awards, 9 models, 8 guides, 6 chapters), from the same notes probe-sources.mts reads. The same seed always
   draws the same notes, so anyone can check the reading in docs/TRUTH-SAMPLE.md against the corpus.
     npx tsx scripts/truth-sample.mts [seed]        prints the sample as JSON */
(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { AWARDS, ALL_CHAPTERS, GUIDES, MODUX_MODELS } = await import('../src/content/index');

export const SEED = Number(process.argv[2]) || 20261104;
const DRAW: Record<string, number> = { award: 17, model: 9, guide: 8, chapter: 6 };

interface Note { kind: string; id: string; label: string; text: string; n: number }
const notes: Note[] = [];
const add = (kind: string, id: string, label: string, text: string) => { if ((text || '').trim()) notes.push({ kind, id, label, text: text.trim(), n: notes.length }); };
for (const a of AWARDS) if (a.research) add('award', a.id, a.name, a.research);
for (const c of ALL_CHAPTERS) for (const s of c.sources || []) add('chapter', c.id, s.label, s.note);
for (const g of GUIDES) for (const s of g.sources || []) add('guide', g.id, s.label, s.note);
for (const m of MODUX_MODELS) for (const e of m.evidence || []) add('model', m.id, e.label, e.note);

/* mulberry32: small, seeded, and the same in every runtime */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const r = rng(SEED);
const sample: Note[] = [];
for (const [kind, k] of Object.entries(DRAW)) {
  const pool = notes.filter(x => x.kind === kind);
  const taken = new Set<number>();
  while (taken.size < Math.min(k, pool.length)) taken.add(Math.floor(r() * pool.length));
  for (const i of [...taken].sort((x, y) => x - y)) sample.push(pool[i]);
}
console.log(JSON.stringify({ seed: SEED, population: notes.length, sample }, null, 1));
