/* Read a token, held to its word. The reading of a Dash Platform contract (src/lib/onchain.ts) is checked against
   real public records saved on 2026-11-14 (research/evidence/onchain/): five from mainnet, seven from testnet.
   Each record's reading is pinned to the fields it rests on, and one changed field in a record must change the
   reading (the mutants), so a line can not be right by accident. Also held: a hostile record is printed as
   text and never read as more; every structure a finding names is in the catalog; the hosts a reading contacts
   are in the site's policy and no other host is named; the copy has no dashes.
   Run: npx tsx probe-onchain.mts */
(globalThis as any).self = globalThis;
import { readFileSync, readdirSync } from 'node:fs';
const O = await import('./src/lib/onchain');
const { CATALOG } = await import('./src/content/modux/catalog');

const problems: string[] = [];
const bad = (m: string) => problems.push(m);
const DIR = 'research/evidence/onchain/';
const fx = (name: string) => JSON.parse(readFileSync(DIR + name + '.json', 'utf8'));
const read = (name: string, change?: (j: any) => void) => { const j = fx(name); if (change) change(j); return O.parseContract(j.dc, j.dec, j.net, j.read); };
const ids = (c: any, i = 0) => c.tokens[i].findings.map((f: any) => f.id);
const find = (c: any, id: string, i = 0) => c.tokens[i].findings.find((f: any) => f.id === id);
const catalog = new Set(CATALOG.map((m: any) => m.id));
let checks = 0;
const LEFT_OUT = /^The explorer’s decoding leaves out some of a token’s rules: who may set a price .* whether every identity may claim an amount once, who may change the schedule or where new tokens go, whether the token can be sent from one holder to another, and whether it has a shielded pool\./;
const ok = (cond: boolean, msg: string) => { checks++; if (!cond) bad(msg); };

/* 1. every saved record reads, and each reading is well formed */
const files = readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));
ok(files.length === 12, 'twelve saved records are expected, found ' + files.length);
for (const f of files) {
  let c: any;
  try { c = read(f); } catch (e: any) { bad(f + ': the record did not read: ' + e.message); continue; }
  ok(/^[1-9A-HJ-NP-Za-km-z]{42,44}$/.test(c.id) && c.url.startsWith(O.EXPLORER_VIEW[c.net as 'mainnet'] + '/dataContract/'), f + ': the id or the link to the record is off');
  ok(c.read === '2026-11-14', f + ': the day it was read is not carried');
  for (const t of c.tokens) {
    ok(t.findings.length > 0, f + ': a token with no finding: ' + t.name);
    const w = t.findings.map((x: any) => x.weight);
    ok(w.every((x: number, i: number) => i === 0 || x <= w[i - 1]), f + ': the findings are not deepest first');
    for (const x of t.findings) {
      ok(x.models.length > 0 && x.models.every((m: string) => catalog.has(m)), f + ': ' + x.id + ' names a structure not in the catalog');
      ok(/^[A-Z]/.test(x.title) && !/[.–—]/.test(x.title) && x.title.length <= 44, f + ': a title should be a few words in Title Case with no stop: ' + x.title);
      ok(x.line.length >= 30 && /\.$/.test(x.line) && !/[–—]/.test(x.line) && !/undefined|null|NaN|\[object/.test(x.line), f + ': a line that does not read as a sentence: ' + x.line);
      ok(x.field.length > 3, f + ': ' + x.id + ' names no field of the record');
    }
    ok(new Set(t.findings.map((x: any) => x.id)).size === t.findings.length, f + ': a finding said twice');
  }
  const text = O.readingText(c);
  ok(text.includes(c.id) && text.includes(c.url) && /It says nothing about what a token is worth\./.test(text) && /Who holds the keys of an identity is not in any public record\./.test(text) && !/[–—]/.test(text), f + ': the kept text misses the contract, the link or its two plain lines');
}

/* 2. each record, pinned to what it holds */
const dusd = read('mainnet-dusd');
ok(dusd.tokens[0].name === 'DUSD' && dusd.tokens[0].decimals === 6 && O.amount(dusd.tokens[0].supply.now, 6) === '5,600' && O.amount(dusd.tokens[0].supply.base, 6) === '100' && dusd.tokens[0].supply.max === null, 'DUSD: the supply is 5,600 today, 100 at creation, with no maximum');
ok(ids(dusd).join() === 'mint-alone,freeze-none,pause-none', 'DUSD: one key mints without limit, no one freezes, no one pauses: ' + ids(dusd).join());
ok(find(dusd, 'mint-alone').weight === 3 && find(dusd, 'mint-alone').title === 'One Key Can Mint Without Limit' && /contract’s owner can mint new DUSD alone/.test(find(dusd, 'mint-alone').line) && /no maximum supply/.test(find(dusd, 'mint-alone').line), 'DUSD: the minting line is off: ' + find(dusd, 'mint-alone')?.line);
ok(O.grownWords(dusd.tokens[0]) === 'The supply is 56 times what it was at creation.', 'DUSD: the supply has grown 56 times: ' + O.grownWords(dusd.tokens[0]));
ok(dusd.readonly === false && dusd.version === 1 && dusd.types.length === 0 && dusd.groups.length === 0, 'DUSD: the contract facts are off');

const sans = read('mainnet-sans');
ok(ids(sans).join() === 'mint-closed,max-fixed,freeze-none,pause-none,trade-never' && sans.tokens[0].findings.every((f: any) => f.tone === 'fixed' && f.weight === 1), 'SANS: everything is fixed for good: ' + ids(sans).join());
ok(O.amount(sans.tokens[0].supply.max, sans.tokens[0].decimals) === '21,000,000' && sans.unread.length === 1 && LEFT_OUT.test(sans.unread[0]), 'SANS: 21,000,000 at most, and the one thing unread is what the explorer’s decoding leaves out');
ok(find(sans, 'mint-closed').title === 'No One Can Mint At Will' && /schedule, a one-time claim or a sale at a set price/.test(find(sans, 'mint-closed').line), 'SANS: a closed minting rule is said as that, with the other ways tokens are created');
/* tokens are created four ways and the explorer decodes the rule of one: every decoded token's reading says so, and a contract with no token or no decoding does not */
for (const f of files) { let c: any; try { c = read(f); } catch { continue; } const says = c.unread.filter((u: string) => LEFT_OUT.test(u)).length; ok(says === (c.tokens.length && fx(f).dec?.dataContractId ? 1 : 0), f +': the line about the rules the decoding leaves out is ' + (says ? 'there and should not be' : 'missing')); }

const latte = read('mainnet-latte');
ok(ids(latte).join() === 'mint-alone,max-movable,destroy,freeze,pause', 'latte: the owner holds every power alone: ' + ids(latte).join());
ok(latte.tokens[0].findings.every((f: any) => f.tone === 'alone') && latte.ownerNames.join() === 'latte.dash', 'latte: each power is one key’s, and the owner’s name is read');
ok(find(latte, 'mint-alone').title === 'One Key Can Mint More' && /maximum supply is 100,000,000,000\./.test(find(latte, 'mint-alone').line), 'latte: minting is bounded by its maximum');
ok(find(latte, 'max-movable').title === 'One Key Can Move The Maximum', 'latte: the owner can move the maximum alone');

const lynx = read('mainnet-lynxbucks');
ok(ids(lynx).includes('history') && /mints, burns, freezes and transfers/.test(find(lynx, 'history').line) && O.grownWords(lynx.tokens[0]) === '', 'LynxBucks: it keeps no history, and its supply has not moved');

const locked = read('testnet-owner-locked');
ok(find(locked, 'mint-alone') && / Who holds this is fixed\.$/.test(find(locked, 'mint-alone').line), 'owner-locked: the owner mints alone, and no one can ever change that: ' + find(locked, 'mint-alone')?.line);
ok(['destroy', 'freeze', 'pause'].every(k => / Who holds this is fixed\.$/.test(find(locked, k)?.line || '')), 'owner-locked: every power is the owner’s for good');

const group = read('testnet-group-mints');
ok(group.groups.length === 1 && group.groups[0].members === 3 && group.groups[0].required === 2 && group.groups[0].least === 2 && group.groups[0].total === 3, 'group: three members, power two needed, two members at least');
ok(find(group, 'mint-shared') && find(group, 'mint-shared').tone === 'held' && /a group \(at least 2 of its 3 members\)/.test(find(group, 'mint-shared').line), 'group: minting takes two of three: ' + find(group, 'mint-shared')?.line);
ok(!find(group, 'mint-alone'), 'group: no line says one key can mint');

const sched = read('testnet-schedule');
ok(find(sched, 'schedule') && find(sched, 'schedule').line === 'The token creates 1 new token every 5 blocks, for the contract’s owner to claim.', 'schedule: the line is off: ' + find(sched, 'schedule')?.line);
ok(find(sched, 'max-movable').tone === 'held' && find(sched, 'max-movable').title === 'The Maximum Can Be Moved' && /The main group \(all 2 of its members\) can change it\./.test(find(sched, 'max-movable').line), 'schedule: a group of two moves the maximum, and the line names it: ' + find(sched, 'max-movable')?.line);
ok(sched.tokens[0].mainGroup === 0 && sched.ownerNames.length === 1, 'schedule: the main group and the owner’s name are read');

const prog = read('testnet-programmed');
ok(find(prog, 'programmed') && /^1 mint was set/.test(find(prog, 'programmed').line) && O.grownWords(prog.tokens[0]) === 'All of it was created after the token was registered.', 'programmed: one mint was set at creation, and all the supply came after');

const und = read('testnet-undecoded');
ok(ids(und).join() === 'unread' && und.tokens[0].rulesRead === false && und.unread.some((u: string) => /did not decode/.test(u)) && und.types.length === 13, 'undecoded: the rules are said to be unread, and the thirteen document types are still read');
ok(und.tokens[0].rules.mint.read === false && !und.tokens[0].findings.some((f: any) => /mint/.test(f.id)), 'undecoded: nothing is said about minting when the rules were not read');
const post = und.types.find((t: any) => t.name === 'post');
ok(!!post && post.replace === true && post.remove === false && /write 2 fields/.test(post.moderators) && post.charges === true, 'undecoded: the post type is read from the schema: ' + JSON.stringify(post));

const dpns = read('mainnet-dpns');
ok(dpns.tokens.length === 0 && dpns.system === true && dpns.types.map((t: any) => t.name).join() === 'domain,preorder', 'DPNS: no token, two document types');
const dom = dpns.types[0];
ok(dom.replace === false && dom.transfer === true && dom.trade === true && O.typeWords(dom) === 'its owner cannot replace a document and can delete one; anyone can create one; a document can be given and sold.', 'DPNS: a name cannot be replaced, and can be given and sold: ' + O.typeWords(dom));

/* 3. mutants: one field changed, and the reading must follow */
const T = (j: any) => j.dec.tokens[0];
let m = read('mainnet-dusd', j => { T(j).manualMintingRules.authorizedToMakeChange = { takerType: 'NoOne', taker: null }; });
ok(ids(m)[0] === 'mint-reopen' && find(m, 'mint-reopen').tone === 'open' && /contract’s owner can change that rule/.test(find(m, 'mint-reopen').line), 'mutant: minting off with an owner who can turn it on is said so: ' + ids(m).join());
m = read('mainnet-dusd', j => { T(j).manualMintingRules.authorizedToMakeChange = { takerType: 'NoOne', taker: null }; T(j).manualMintingRules.adminActionTakers = { takerType: 'NoOne', taker: null }; });
ok(ids(m).includes('mint-closed') && ids(m).includes('max-none') && !ids(m).includes('mint-alone'), 'mutant: minting closed for good, with no maximum: ' + ids(m).join());
m = read('mainnet-dusd', j => { T(j).maxSupply = '9000000000'; });
ok(find(m, 'mint-alone').title === 'One Key Can Mint More' && /maximum supply is 9,000\./.test(find(m, 'mint-alone').line) && ids(m).includes('max-fixed'), 'mutant: a maximum bounds the minting and is said to be fixed: ' + ids(m).join());
m = read('mainnet-dusd', j => { T(j).manualMintingRules.authorizedToMakeChange = { takerType: 'Identity', taker: '7ysNPVoaVZvHWAC7hGn3EmYsbyzizfu8a9Teq3zF6atm' }; });
ok(/One named identity \(7ysNP…6atm\) can mint/.test(find(m, 'mint-alone').line), 'mutant: a named identity that mints is named by its id: ' + find(m, 'mint-alone')?.line);
m = read('mainnet-sans', j => { T(j).emergencyActionRules.authorizedToMakeChange = { takerType: 'ContractOwner', taker: null }; });
ok(find(m, 'pause') && find(m, 'pause').tone === 'alone' && find(m, 'pause').weight === 2 && !ids(m).includes('pause-none'), 'mutant: an owner who can pause is said to hold that alone');
m = read('mainnet-sans', j => { T(j).freezeRules.authorizedToMakeChange = { takerType: 'ContractOwner', taker: null }; });
ok(find(m, 'freeze') && /No one may unfreeze, so a frozen balance stays frozen\./.test(find(m, 'freeze').line), 'mutant: freezing with no one to unfreeze is said: ' + find(m, 'freeze')?.line);
m = read('mainnet-sans', j => { T(j).destroyFrozenFundsRules.authorizedToMakeChange = { takerType: 'ContractOwner', taker: null }; });
ok(ids(m)[0] === 'destroy' && find(m, 'destroy').weight === 3, 'mutant: destroying a frozen balance comes first');
m = read('mainnet-sans', j => { T(j).freezeRules.adminActionTakers = { takerType: 'ContractOwner', taker: null }; });
ok(ids(m).includes('freeze-later') && !ids(m).includes('freeze-none') && m.unread.some((u: string) => /may have been changed since/.test(u)), 'mutant: freezing that can be turned on is said, with the warning that it may have been');
m = read('mainnet-sans', j => { T(j).startAsPaused = true; });
ok(ids(m).includes('starts-paused'), 'mutant: a token created paused is said');
m = read('mainnet-sans', j => { T(j).marketplaceRules.tradeModeChangeRules.adminActionTakers = { takerType: 'ContractOwner', taker: null }; });
ok(!ids(m).includes('trade-never'), 'mutant: a trade mode someone can change is not called fixed');
m = read('testnet-group-mints', j => { j.dc.groups[0].requiredPower = 1; });
ok(ids(m).includes('mint-alone') && /a group in which one member holds enough power alone/i.test(find(m, 'mint-alone').line), 'mutant: a group one member can carry is one key: ' + ids(m).join());
m = read('testnet-group-mints', j => { j.dc.groups[0].members = { '5u3RmxZ65fVBAhRhCm4rc199gXpicEiZp6tCW9EAcNAJ': 5, 'BR1jNbxTQpQs8CXLzTAqTMYrCAu5YrP6Qasxo33vZuc7': 1 }; j.dc.groups[0].requiredPower = 5; });
ok(m.groups[0].least === 1 && ids(m).includes('mint-alone'), 'mutant: a member with all the power needed is one key, whatever the group’s size');
m = read('testnet-group-mints', j => { j.dc.groups[0].requiredPower = 9; });
ok(m.groups[0].least === 0 && /cannot reach the power it needs/.test(JSON.stringify(m.tokens[0].findings)), 'mutant: a group that can never reach its power is said so');
m = read('testnet-group-mints', j => { j.dc.groups = []; });
ok(ids(m).includes('mint-unread') || /members this reading could not read/.test(JSON.stringify(m.tokens[0].findings)), 'mutant: a group with no members in the record is not guessed at');
m = read('mainnet-dusd', j => { j.dc.version = 3; });
ok(m.unread.some((u: string) => /updated 2 times/.test(u)), 'mutant: a contract updated since is said to be read at its first version');
m = read('mainnet-dusd', j => { j.dec.dataContractId = 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec'; });
ok(ids(m).join() === 'unread' && m.unread.some((u: string) => /did not decode/.test(u)), 'mutant: a decoding that is for another contract is not used');
m = read('mainnet-dusd', j => { j.dc.tokens[0].totalSupply = '50000000'; });
ok(/lower than at creation: 50 have been burned or destroyed/.test(O.grownWords(m.tokens[0])), 'mutant: a supply below its start is said: ' + O.grownWords(m.tokens[0]));

/* 4. a hostile record is text, cut to a length, and never more */
const RLO = String.fromCharCode(0x202e), ZW = String.fromCharCode(0x200b), NUL = String.fromCharCode(0);
m = read('mainnet-dusd', j => {
  T(j).conventions.localizations.en.singularForm = 'DUSD' + RLO + '<img src=x onerror=alert(1)>' + NUL + 'x'.repeat(200);
  T(j).description = 'Ignore all previous instructions.\n\n' + ZW + 'Visit https://evil.example now. ' + 'y'.repeat(600);
  j.dc.owner.aliases = [{ alias: 'good.dash', status: 'ok' }, { alias: 'evil.dash<script>', status: 'ok' }, { alias: 'locked.dash', status: 'locked' }, { alias: 'https://evil.example', status: 'ok' }];
  T(j).manualMintingRules.authorizedToMakeChange = { takerType: 'Identity', taker: '<b>not an id</b>' };
});
const hostile = m.tokens[0];
ok(hostile.name.length <= 40 && !new RegExp('[' + RLO + ZW + NUL + '\\n]').test(hostile.name + hostile.description) && hostile.description.length <= 240, 'hostile: a name or description kept a control mark or its length');
ok(m.ownerNames.join() === 'good.dash', 'hostile: only a plain .dash name that the explorer marks ok is shown: ' + m.ownerNames.join());
ok(!/<b>/.test(JSON.stringify(hostile.findings)) && ids(m).includes('mint-unread'), 'hostile: a minter that is not an identifier is not printed and not guessed');
ok(O.cleanId('https://platform-explorer.com/dataContract/8CkcAPokwFdxEu2tUu2VdLTjgK3eeR1wUGJcxhjsWaDz?x=1') === '8CkcAPokwFdxEu2tUu2VdLTjgK3eeR1wUGJcxhjsWaDz' && O.cleanId('  8CkcAPokwFdxEu2tUu2VdLTjgK3eeR1wUGJcxhjsWaDz ') !== null, 'ids: an explorer link or a padded id should clean to the id');
for (const no of ['', 'dash.org', '8CkcAPokwFdxEu2tUu2VdLTjgK3eeR1wUGJcxhjsWaD0', '../../etc/passwd', 'javascript:alert(1)', 'O0Il'.repeat(11)]) ok(O.cleanId(no) === null, 'ids: this should not read as an identifier: ' + no);
for (const junk of [null, {}, [], 'x', 7, { identifier: 5 }]) { let threw = false; try { O.parseContract(junk as any, null, 'mainnet'); } catch { threw = true; } ok(threw, 'a record that is not a contract should be refused: ' + JSON.stringify(junk)); }
for (const dec of [null, 'x', 7, [], { tokens: 'no' }, { dataContractId: fx('mainnet-dusd').dc.identifier, tokens: [null, 3, { position: 'a' }, { position: 0, manualMintingRules: 'x' }] }]) {
  let c: any; try { c = O.parseContract(fx('mainnet-dusd').dc, dec as any, 'mainnet'); } catch (e: any) { bad('a broken decoding threw: ' + e.message); continue; }
  ok(c.tokens.length === 1 && c.tokens[0].findings.length > 0, 'a broken decoding should still leave the token with what the contract shows');
}
ok(O.amount('5600000000', 6) === '5,600' && O.amount('1', 8) === '0.00000001' && O.amount('123456789', 0) === '123,456,789' && O.amount('100050', 2) === '1,000.5' && O.amount(null, 2) === '' && O.amount('1e9', 2) === '', 'amounts: base units are not printed as the token’s own number');
ok(O.lifeWords(86400) === '1 day' && O.lifeWords(7200) === '2 hours' && O.lifeWords(3601) === '3601 seconds', 'lifetimes are not said in whole units');

/* a rule that names "the main group" follows whichever group is the main one: whoever may change that is read too
   (platform source, can_apply_token_configuration_item, read 14 Nov 2026) */
{
  const sch = read('testnet-schedule');
  const f = find(sch, 'main-group');
  ok(!!f && f.title === 'One Key Can Replace The Main Group' && f.tone === 'alone' && f.field === 'mainControlGroupCanBeModified' && /can name a different group as the token’s main group/.test(f.line), 'schedule: the owner may replace the main group, and a rule names the main group: ' + ids(sch).join());
  const off = read('testnet-schedule', j => { j.dec.tokens[0].mainControlGroupCanBeModified = { takerType: 'NoOne', taker: null }; });
  ok(!find(off, 'main-group'), 'mutant: when no one may replace the main group the finding goes');
  const grp = read('testnet-group-mints');
  ok(!find(grp, 'main-group'), 'group-mints: its rules name Group(0) itself, so replacing the main group moves nothing: ' + ids(grp).join());
  const role = read('testnet-group-mints', j => { j.dec.tokens[0].manualMintingRules.authorizedToMakeChange = { takerType: 'MainGroup', taker: null }; });
  ok(!!find(role, 'main-group') && role.tokens[0].rules.mint.does.byRole === true && role.tokens[0].rules.mint.does.group?.least === 2, 'mutant: minting given to "the main group" is read as that group today, and as a power that moves with the choice');
  /* a rule nobody can re-assign, held by "the main group": fixed only when the main group is */
  const tied = (who: string) => read('testnet-group-mints', j => { const t = j.dec.tokens[0]; t.manualMintingRules = { authorizedToMakeChange: { takerType: 'MainGroup', taker: null }, adminActionTakers: { takerType: 'NoOne', taker: null } }; t.mainControlGroupCanBeModified = { takerType: who, taker: null }; });
  ok(/ Who holds this follows whichever group is the main group\.$/.test(find(tied('ContractOwner'), 'mint-shared')?.line || '') && !!find(tied('ContractOwner'), 'main-group'), 'mutant: a fixed rule held by "the main group" is not said to be fixed while that group can be replaced: ' + find(tied('ContractOwner'), 'mint-shared')?.line);
  ok(/ Who holds this is fixed\.$/.test(find(tied('NoOne'), 'mint-shared')?.line || '') && !find(tied('NoOne'), 'main-group'), 'mutant: and it is said to be fixed when no one may replace the main group');
  const gone = read('testnet-group-mints', j => { j.dec.tokens[0].manualMintingRules.authorizedToMakeChange = { takerType: 'MainGroup', taker: null }; delete j.dec.tokens[0].mainControlGroupCanBeModified; });
  ok(!find(gone, 'main-group') && gone.tokens[0].mainGroupChange === null, 'mutant: a record without the field says nothing about it');
  for (const f2 of files) { let c: any; try { c = read(f2); } catch { continue; } for (const t of c.tokens) for (const x of t.findings) if (x.id === 'trade-never') ok(!/send/i.test(x.line), f2 + ': a closed resale market says nothing about sending, which the record does not show'); }
}

/* 5. the hosts, and the copy */
const csp = JSON.stringify(JSON.parse(readFileSync('vercel.json', 'utf8')));
for (const h of O.ONCHAIN_HOSTS) ok(csp.includes('https://' + h), 'the policy does not allow a host a reading contacts: ' + h);
for (const h of O.ONCHAIN_LINK_HOSTS) ok(!csp.includes('https://' + h), 'the policy allows a host the page only links to: ' + h);
const src = readFileSync('src/lib/onchain.ts', 'utf8');
for (const x of src.matchAll(/https:\/\/([a-z0-9.-]+)/g)) ok(O.ONCHAIN_HOSTS.includes(x[1]) || O.ONCHAIN_LINK_HOSTS.includes(x[1]), 'onchain.ts names a host that is neither read nor linked: ' + x[1]);
ok(!/\.mintable|\.burnable|\.freezable|\.destroyable|allowedEmergencyActions|changeMaxSupply/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')), 'onchain.ts reads one of the explorer’s short flags, which say who may change a rule and not who may act');
/* 6. the two made-up tokens the page shows before a first reading: read by the same parser, and held to what the
   page says about them (one key holds the first; a group of three holds the second, with a maximum no one can move) */
const { EXAMPLES } = await import('./src/content/onchain-example');
ok(EXAMPLES.length === 2, 'two examples are expected, found ' + EXAMPLES.length);
const [exOne, exTwo] = EXAMPLES.map((e: any) => { try { return e.read(); } catch (x: any) { bad('example ' + e.key + ' did not read: ' + x.message); return null; } });
if (exOne && exTwo) {
  ok(ids(exOne).join() === 'mint-alone,destroy,freeze,pause,max-none-movable', 'example one: its findings moved: ' + ids(exOne).join());
  ok(exOne.tokens[0].findings.filter((f: any) => f.tone === 'alone').length === 4 && find(exOne, 'mint-alone').title === 'One Key Can Mint Without Limit', 'example one: one key should hold minting without limit, freezing, destroying and pausing');
  ok(ids(exTwo).join() === 'pause,mint-shared,max-fixed,freeze-none,trade-never', 'example two: its findings moved: ' + ids(exTwo).join());
  ok(exTwo.groups.length === 1 && exTwo.groups[0].members === 3 && exTwo.groups[0].least === 2 && exTwo.tokens[0].findings.every((f: any) => f.tone !== 'alone' && f.tone !== 'open'), 'example two: a group of three, two at least, and nothing one key can do or change');
  ok(O.amount(exTwo.tokens[0].supply.max, 8) === '21,000,000' && O.amount(exOne.tokens[0].supply.now, 8) === '5,600,000' && exOne.tokens[0].supply.max === null, 'the examples’ supplies are not the ones the page was drawn for');
  for (const c of [exOne, exTwo]) {
    ok(c.unread.length === (c === exOne ? 2 : 1) && LEFT_OUT.test(c.unread[0]), 'an example should carry the line about what the decoding leaves out, and the first also the one about rules that can change: ' + c.unread.join(' | '));
    ok([c.id, c.owner, c.tokens[0].id].every((x: string) => x.startsWith('ExampLe')), 'an example’s identifiers should be words, so no one takes one for a real record');
    for (const f of c.tokens[0].findings) for (const m of f.models) ok(catalog.has(m), 'an example names a structure that is not in the catalog: ' + m);
  }
}

/* 7. a reading has an address: the contract, and the network when it is not mainnet */
const H = await import('./src/lib/history');
const SOME = fx('mainnet-dusd').dc.identifier as string;
ok(H.addressOf({ view: 'read' }) === '/read' && H.addressOf({ view: 'read', id: SOME }) === '/read/' + SOME && H.addressOf({ view: 'read', id: SOME, sub: 'testnet' }) === '/read/' + SOME + '/testnet', 'a reading’s address is off');
ok(H.addressOf({ view: 'read', id: 'not-an-id' }) === '/read' && H.addressOf({ view: 'read', id: SOME, sub: 'anything' }) === '/read/' + SOME, 'an address should carry only an identifier, and only testnet after it');
const back = (h: string) => JSON.stringify(H.routeOf(h));
ok(back('#/read') === JSON.stringify({ view: 'read' }) && back('#/read/' + SOME) === JSON.stringify({ view: 'read', id: SOME }) && back('#/read/' + SOME + '/testnet') === JSON.stringify({ view: 'read', id: SOME, sub: 'testnet' }), 'an address does not open the reading it names');
for (const no of ['#/read/treasury', '#/read/' + SOME + '/mainnet', '#/read/' + SOME.slice(0, 20), '#/read/' + SOME + '/testnet/x', '#/read/' + SOME.replace(/.$/, '0')]) ok(H.routeOf(no) === null, 'this address should name no place: ' + no);

for (const f of ['src/lib/onchain.ts', 'src/views/ReadView.tsx', 'src/components/TokenVessel.tsx', 'src/content/onchain-example.ts', 'src/styles/tokenread.css']) {
  let s = ''; try { s = readFileSync(f, 'utf8'); } catch { bad(f + ' is missing'); continue; }
  const d = s.match(/[–—]/);
  if (d) bad(f + ' has a dash: ...' + s.slice(Math.max(0, d.index! - 40), d.index! + 20).replace(/\n/g, ' ') + '...');
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s)) bad(f + ' holds a control character');
}

const all = files.map(f => { try { return read(f); } catch { return null; } }).filter(Boolean) as any[];
console.log('records ' + files.length + ' | tokens ' + all.reduce((a, c) => a + c.tokens.length, 0) + ' | findings ' + all.reduce((a, c) => a + c.tokens.reduce((b: number, t: any) => b + t.findings.length, 0), 0) + ' | document types ' + all.reduce((a, c) => a + c.types.length, 0) + ' | checks ' + checks);
console.log(problems.length ? 'PROBLEMS (' + problems.length + ')\n' + problems.join('\n') : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
