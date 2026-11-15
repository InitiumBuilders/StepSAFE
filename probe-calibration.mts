/* PROBE: the model against three public incidents. Each incident is the
   smallest map that carries its shape; each check is a bound on the hours
   kept on the stress day with a stack, and the part that has to fall first
   with nothing in place. Every structure named must be in the catalog.
   Run: npx tsx probe-calibration.mts */

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { MODUX_MODELS } = await import('./src/content/modux/index');
const { INCIDENTS } = await import('./src/content/modux/calibration');
const { buildModel, stressDay, dayRange, fallOrder } = await import('./src/content/modux/dynamics');

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const problems: string[] = [];

for (const inc of INCIDENTS) {
  console.log('\n' + inc.name + ' · ' + inc.when);
  for (const t of inc.gauge.threats) for (const c of t.counters) if (!byId.has(c)) problems.push(inc.id + ': counter not in the catalog: ' + c);
  const bare = buildModel(inc.gauge, [], byId);
  const fall = fallOrder(bare);
  const firstHour = fall[0]?.hour;
  const first = fall.filter(f => f.hour !== null && f.hour === firstHour).map(f => f.id);
  if (!first.includes(inc.fallsFirst)) problems.push(inc.id + ': ' + inc.fallsFirst + ' should fall first, got ' + first.join(','));
  console.log('  falls first: ' + first.join(', ') + ' at hour ' + firstHour);
  for (const c of inc.checks) {
    for (const id of c.stack) if (!byId.has(id)) problems.push(inc.id + ': stack id not in the catalog: ' + id);
    const m = buildModel(inc.gauge, c.stack, byId);
    const kept = 24 - stressDay(m);
    const r = dayRange(m);
    const ok = (c.min === undefined || kept >= c.min) && (c.max === undefined || kept <= c.max);
    console.log('  ' + (ok ? 'ok  ' : 'FAIL') + ' ' + c.label + ': ' + kept.toFixed(1) + ' h (range ' + r.lo.toFixed(1) + ' to ' + r.hi.toFixed(1) + ')' + (c.min !== undefined ? ' want at least ' + c.min : '') + (c.max !== undefined ? ' want at most ' + c.max : ''));
    if (!ok) problems.push(inc.id + ': ' + c.label + ' (' + kept.toFixed(1) + ' h)');
    if (r.hi < r.lo - 1e-9) problems.push(inc.id + ': range upside down');
  }
}

console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
