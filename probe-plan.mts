/* PROBE: the plan. For a built own system with its reference stack, the
   plan names the organisation, who it serves, the day, the structures in
   place with what each defeats, and the moves; with no stack it says so and
   lists the fall; nothing in it is longer than a meeting page.
   Run: npx tsx probe-plan.mts */

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { MODUX_MODELS } = await import('./src/content/modux/index');
const { buildOwnGauge, specFromTemplate } = await import('./src/content/modux/own');
const { buildModel, stressDay, fallOrder, leverage } = await import('./src/content/modux/dynamics');
const { planText } = await import('./src/lib/plan');
const { peopleOf } = await import('./src/lib/people');

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const problems: string[] = [];
const g = buildOwnGauge(specFromTemplate('water')!, byId)!;

const withRef = (() => {
  const model = buildModel(g, g.expert, byId);
  return planText({ gauge: g, notch: 0, stack: g.expert, byId, lost: stressDay(model), fall: fallOrder(model), moves: leverage(g, g.expert, byId, [], new Set(), 3).moves, people: peopleOf(g.sector), score: 100, verdict: 'holds', reference: 92, at: new Date('2026-10-18T12:00:00Z') });
})();
const bare = (() => {
  const model = buildModel(g, [], byId);
  return planText({ gauge: g, notch: 0, stack: [], byId, lost: stressDay(model), fall: fallOrder(model), moves: leverage(g, [], byId, [], new Set(), 3).moves, people: peopleOf(g.sector) });
})();

for (const [label, text] of [['with reference', withRef], ['bare', bare]] as const) {
  if (!text.includes(g.org)) problems.push(label + ': no organisation');
  if (!text.includes('Serves: ' + g.sector)) problems.push(label + ': no sector line');
  if (!/THE DAY\nThis stack keeps (about \d+|\d+ to \d+) of 24 hours of service for 180,000 people/.test(text)) problems.push(label + ': no day line');
  if (!text.includes('WHAT THIS NUMBER IS')) problems.push(label + ': no line saying what the number is');
  if (!text.includes('THE THREATS')) problems.push(label + ': no threats');
  if (text.length > 6000) problems.push(label + ': too long (' + text.length + ')');
  if (/undefined|NaN|\[object/.test(text)) problems.push(label + ': a hole in the text');
}
if (!/IN PLACE\n- .+ \((bedrock|proven|emerging|frontier)\): /.test(withRef)) problems.push('with reference: structures not listed with their statements');
if (!withRef.includes('2026-10-18')) problems.push('with reference: no date');
if (!withRef.includes('Score 100 against a reference of 92 · the stack holds')) problems.push('with reference: no score line');
if (!bare.includes('IN PLACE: nothing yet')) problems.push('bare: did not say nothing is in place');
if (!/WHERE TO ACT NEXT/.test(bare)) problems.push('bare: no moves');
if (!/THE ORDER OF THE FALL\n- /.test(bare)) problems.push('bare: no fall list');
if (!/keeps \d+(\.\d)? more hours/.test(bare)) problems.push('bare: moves without hours');

console.log(withRef.split('\n').slice(0, 8).join('\n'));
console.log('...\n' + withRef.length + ' chars with the reference, ' + bare.length + ' bare');
console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
