/* The forge's reader and its route, under the replies that broke them: fenced
   JSON, prose around the object, trailing commas, a reply cut off mid-object,
   names where ids should be, kinds in the model's own words, a model that
   rejects structured output, a reply that ran out of room, a reply that could
   not be used the first time, and a connection check with no words back.
   Run: npx tsx probe-mind.mts */
import { MODUX_MODELS } from './src/content/modux/index';
import { parseObject, buildForgedGauge, forgeWithClaude, checkMind } from './src/lib/gaugeMind';
import type { ProviderConfig } from './src/lib/state';
import { setSecret } from './src/lib/keyring';

const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
const problems: string[] = [];
const bad = (s: string) => problems.push(s);

const good = {
  title: 'The Night Shift Screen', org: 'Harrow County Water', sector: 'Municipal water',
  brief: 'Two plants, one control room.', adversary: 'A group that scans for exposed controllers',
  nodes: [
    { id: 'plc', name: 'Plant controller', kind: 'control' },
    { id: 'ops', name: 'Operators', kind: 'people' },
    { id: 'vendor', name: 'Vendor remote access', kind: 'vendor' },
    { id: 'scada', name: 'Control room', kind: 'control' },
    { id: 'public', name: 'Water customers', kind: 'public' },
  ],
  edges: [{ from: 'vendor', to: 'scada', how: 'connects to' }, { from: 'scada', to: 'plc', how: 'commands' }, { from: 'plc', to: 'public', how: 'supplies' }],
  threats: [
    { name: 'Shipped password', move: 'A default password lets a stranger in.', counters: ['mm-supply-secure-by-default', 'mm-trust-policy-enforcement-point'], weight: 3, target: 'plc' },
    { name: 'Always on vendor link', move: 'The vendor link stays open.', counters: ['mm-identity-zero-standing-privilege', 'mm-trust-boundary-ledger'], weight: 3, target: 'vendor' },
    { name: 'One control network', move: 'One workstation reaches every plant.', counters: ['mm-trust-microsegmentation', 'mm-trust-blast-radius-budget'], weight: 2, target: 'scada' },
    { name: 'No practised manual mode', move: 'Nobody has run the plant by hand.', counters: ['mm-resilience-fail-safe-defaults', 'mm-resilience-game-days'], weight: 2, target: 'ops' },
    { name: 'Residents hear first', move: 'Photos reach residents before the authority speaks.', counters: ['mm-org-incident-command'], weight: 1, target: 'public' },
  ],
  debrief: 'Secure defaults and a policy point in front of the controller carry the weight.',
};
const json = JSON.stringify(good);

/* 1. a clean object */
let r = parseObject(json);
if ('error' in r) bad('clean: ' + r.error);

/* 2. a code fence and prose around it */
r = parseObject('Here is the scenario you asked for:\n\n```json\n' + json + '\n```\n\nLet me know if you want changes.');
if ('error' in r || r.value.title !== good.title) bad('fenced: ' + ('error' in r ? r.error : 'wrong title'));

/* 3. trailing commas */
r = parseObject(json.replace('"debrief"', '"extra":[1,2,],"debrief"').replace(/}$/, ',}'));
if ('error' in r) bad('trailing commas: ' + r.error);

/* 4. cut off before the fifth threat: four whole threats still read */
const cutAt = json.indexOf('{"name":"Residents') - 1;
const cut = json.slice(0, cutAt);
r = parseObject(cut);
if ('error' in r) bad('cut off: ' + r.error);
else if (!Array.isArray(r.value.threats) || (r.value.threats as unknown[]).length !== 4) bad('cut off: expected 4 whole threats, got ' + JSON.stringify(r.value.threats).slice(0, 80));
const cutBuilt = buildForgedGauge(cut, byId);
if (!cutBuilt.gauge) bad('cut off build: ' + cutBuilt.error);
/* cut off inside a string, after a key: the key is dropped, the rest reads */
const cutInString = json.slice(0, json.length - 12);
r = parseObject(cutInString);
if ('error' in r) bad('cut in string: ' + r.error);

/* 5. names where ids should be, kinds in the model's own words, targets by name */
const loose = JSON.parse(json);
loose.nodes[0].kind = 'OT controller';
loose.nodes[1].kind = 'staff';
loose.nodes[2].kind = 'third party';
loose.nodes[4].kind = 'customers';
loose.nodes[3].id = 'Control Room';
loose.edges[0].to = 'Control Room';
loose.threats[0].counters = ['Secure by default', 'Policy engine and enforcement point'];
loose.threats[1].counters = ['identity-zero-standing-privilege', 'mm-trust-boundary-ledger'];
loose.threats[2].target = 'Control room';
loose.threats[3].weight = '2';
const built = buildForgedGauge(JSON.stringify(loose), byId);
if (!built.gauge) bad('loose: ' + built.error);
else {
  const g = built.gauge;
  const kinds = g.system.nodes.map(n => n.kind).join(',');
  if (kinds !== 'control,people,vendor,control,public') bad('loose kinds: ' + kinds);
  if (!g.system.nodes.some(n => n.id === 'control-room')) bad('loose: id not slugged: ' + g.system.nodes.map(n => n.id).join(','));
  if (g.threats[0].counters.join(',') !== 'mm-supply-secure-by-default,mm-trust-policy-enforcement-point') bad('loose counters: ' + g.threats[0].counters.join(','));
  if (g.threats[1].counters[0] !== 'mm-identity-zero-standing-privilege') bad('loose near id: ' + g.threats[1].counters.join(','));
  if (g.threats[2].target !== 'control-room') bad('loose target by name: ' + g.threats[2].target);
  if (g.threats[3].weight !== 2) bad('loose weight: ' + g.threats[3].weight);
  if (!g.expert.length || g.budget < 2) bad('loose: no reference stack or budget');
}

/* 6. a reply with nothing usable says so plainly */
const none = buildForgedGauge('Sorry, I cannot help with that.', byId);
if (none.gauge || !/could not be read/.test(none.error || '')) bad('no object: ' + none.error);
const few = buildForgedGauge(JSON.stringify({ ...good, threats: good.threats.slice(0, 2) }), byId);
if (few.gauge || !/needs at least four/.test(few.error || '')) bad('few threats: ' + few.error);

/* ---------- the route, with the API played by a queue of replies ---------- */

/* keys live in the keyring now, never in the record, so the test key goes where the app reads it */
setSecret('anthropicKey', 'sk-test-not-a-real-key');
const p = { mode: 'anthropic', anthropicKey: '', model: 'claude-sonnet-5', davaraUrl: '', davaraToken: '' } as unknown as ProviderConfig;
interface Call { body: Record<string, unknown> }
let calls: Call[] = [];
let queue: { status: number; body: unknown }[] = [];
const reply = (text: string, stop = 'end_turn', thinkingFirst = true) => ({
  status: 200,
  body: { model: 'claude-opus-5-5', stop_reason: stop, content: [...(thinkingFirst ? [{ type: 'thinking', thinking: '' }] : []), { type: 'text', text }] },
});
globalThis.fetch = (async (_url: unknown, init?: { body?: string }) => {
  calls.push({ body: JSON.parse(init?.body || '{}') });
  const next = queue.shift();
  if (!next) throw new Error('no reply queued');
  return new Response(JSON.stringify(next.body), { status: next.status, headers: { 'content-type': 'application/json' } });
}) as unknown as typeof fetch;
const reset = (...q: { status: number; body: unknown }[]) => { calls = []; queue = q; };

/* 7. a model that rejects structured output: asked again without it, and the fence is still read */
reset(
  { status: 400, body: { error: { type: 'invalid_request_error', message: 'output_config.format is not supported on this model' } } },
  reply('```json\n' + json + '\n```'),
);
let f = await forgeWithClaude(p, byId, 'water');
if (!f.gauge) bad('format rejected: ' + f.error);
if (calls.length !== 2) bad('format rejected: expected 2 calls, got ' + calls.length);
const oc0 = (calls[0]?.body.output_config as { format?: { type?: string } } | undefined);
if (oc0?.format?.type !== 'json_schema') bad('format rejected: first call had no json_schema');
if (calls[0]?.body.max_tokens !== 10000) bad('format rejected: first call max_tokens ' + calls[0]?.body.max_tokens);
if (calls[1]?.body.output_config !== undefined) bad('format rejected: second call still carried output_config');

/* 8. the room went to thinking: asked again with twice the room, from the start */
reset(reply(json.slice(0, 220), 'max_tokens'), reply(json));
f = await forgeWithClaude(p, byId, '');
if (!f.gauge) bad('out of room: ' + f.error);
if (calls[1]?.body.max_tokens !== 20000) bad('out of room: second call max_tokens ' + calls[1]?.body.max_tokens);
if ((calls[1]?.body.messages as unknown[])?.length !== 1) bad('out of room: second call should start over');

/* 9. a reply that could not be used: shown what was wrong, and right the second time */
reset(reply(JSON.stringify({ ...good, threats: good.threats.slice(0, 2) })), reply(json));
f = await forgeWithClaude(p, byId, '');
if (!f.gauge) bad('repair turn: ' + f.error);
const msgs = calls[1]?.body.messages as { role: string; content: string }[] | undefined;
if (!msgs || msgs.length !== 3 || msgs[1].role !== 'assistant' || !/needs at least four/.test(msgs[2].content)) bad('repair turn: second call did not carry the reason');

/* 10. three unusable replies end with the reason, not a loop */
reset(reply('no'), reply('no'), reply('no'));
f = await forgeWithClaude(p, byId, '');
if (f.gauge || calls.length !== 3 || !/could not be read/.test(f.error || '')) bad('three misses: ' + calls.length + ' calls, ' + f.error);

/* 11. a refusal is said plainly and not retried */
reset({ status: 200, body: { stop_reason: 'refusal', content: [] } });
f = await forgeWithClaude(p, byId, 'x');
if (f.gauge || calls.length !== 1 || !/declined/.test(f.error || '')) bad('refusal: ' + calls.length + ' calls, ' + f.error);

/* 12. the connection check counts a reply that reached the model with no words back */
reset({ status: 200, body: { model: 'claude-opus-5-5', stop_reason: 'max_tokens', content: [{ type: 'thinking', thinking: '' }] } });
const c = await checkMind(p);
if (!c.ok) bad('check: ' + c.error);
if ((calls[0]?.body.output_config as { effort?: string } | undefined)?.effort !== 'low') bad('check: effort not low');

/* 13. a bad key is reported, scrubbed, and not retried */
reset({ status: 401, body: { error: { type: 'authentication_error', message: 'invalid x-api-key sk-ant-abcdefghijklmnop' } } });
f = await forgeWithClaude(p, byId, '');
if (f.gauge || calls.length !== 1 || /abcdefgh/.test(f.error || '') || !/could not be reached/.test(f.error || '')) bad('bad key: ' + calls.length + ' calls, ' + f.error);

console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
