/* READ A TOKEN. A token on Dash Platform is a stock with valves: someone may mint more, someone may burn, someone
   may freeze a holder's balance or stop every transfer, and each of those powers has a rule that says who holds it
   and who may change who holds it. The rules are public and most can never change, so a holder can read them
   before trusting the token, and an issuer can read them back before a launch.

   Three public records, read from the community Platform Explorer (pshenmic; not a Dash Core Group service), from
   the browser, with no key:
     the contract        its owner, its version, its tokens' supply today, its groups and their members' power
     its create transition   the bytes the owner signed when the contract was registered
     the decoded transition  the explorer's reading of those bytes: every token rule, as it was created
   What this cannot show, said on the page: who holds the keys of an identity; whether a rule that allows change has
   been changed since the contract was created (the page lists which rules could be); the rules the explorer's
   decoding leaves out (the price of a direct purchase, a claim every identity may make once, who may change
   the schedule or where new tokens go, whether the token can be sent at all, and its shielded pool); and what a
   token is worth.
   Tokens are created four ways: minted at will under manualMintingRules, released by a schedule, claimed once by
   each identity, and bought at a price the issuer sets. The maximum supply bounds all four (the Platform book,
   read 2026-11-14). So a closed minting rule is said as that and no more.
   The explorer's own short flags ("mintable" and the rest) are not used: a flag says a power exists, and not who
   holds it or who may change who holds it. This page reads the rule itself.

   Parsing is pure and held to saved real records (research/evidence/onchain/, probe-onchain.mts). The network calls
   are separate. Names and descriptions in a record are whatever the issuer typed: they are shown as text, cut to
   a length, and never followed as links. */

export type Net = 'mainnet' | 'testnet';
export const EXPLORER: Record<Net, string> = { mainnet: 'https://platform-explorer.pshenmic.dev', testnet: 'https://testnet.platform-explorer.pshenmic.dev' };
/** where a reviewer opens the same record; the page links here and never reads it */
export const EXPLORER_VIEW: Record<Net, string> = { mainnet: 'https://platform-explorer.com', testnet: 'https://testnet.platform-explorer.com' };
/** every host a reading contacts; probe-onchain.mts holds vercel.json's connect-src to these */
export const ONCHAIN_HOSTS = Object.values(EXPLORER).map(u => new URL(u).host);
export const ONCHAIN_LINK_HOSTS = Object.values(EXPLORER_VIEW).map(u => new URL(u).host);

/* ---------- what a reading holds ---------- */

/** who holds a power, or who may change who holds it */
export type Holder =
  | { who: 'none' }
  | { who: 'owner' }
  | { who: 'identity'; id: string }
  | { who: 'group'; position: number; main: boolean; /** named as "the main group", whichever group that is */ byRole?: boolean; group: GroupRead | null }
  | { who: 'unread'; raw: string };

export interface GroupRead {
  position: number;
  /** identities in the group */
  members: number;
  /** the power an action needs */
  required: number;
  /** the members' power added up */
  total: number;
  /** the fewest members whose power together reaches what is required; 0 when the group can never reach it */
  least: number;
  ids: { id: string; power: number }[];
}

export const RULE_KEYS = ['mint', 'burn', 'freeze', 'unfreeze', 'destroy', 'pause', 'max', 'trade', 'names'] as const;
export type RuleKey = typeof RULE_KEYS[number];

export interface Rule {
  key: RuleKey;
  /** who may act: mint, burn, freeze, unfreeze, destroy a frozen balance, pause; or change the maximum, the trade mode, the names */
  does: Holder;
  /** who may change who may act */
  changes: Holder;
  /** read from the record; false when the record did not carry this rule */
  read: boolean;
}

export type Tone = 'alone' | 'open' | 'held' | 'fixed' | 'note';
export interface Finding {
  id: string;
  /** 3 is the most a holder is trusting, 1 the least; the page orders by it */
  weight: 1 | 2 | 3;
  tone: Tone;
  /** the statement, in a few words */
  title: string;
  /** what the record says, in one or two plain sentences */
  line: string;
  /** the field of the record it rests on, so a reviewer can find it */
  field: string;
  /** the catalog structures that answer it */
  models: string[];
}

export interface TokenRead {
  id: string;
  position: number;
  name: string;
  plural: string;
  description: string;
  decimals: number;
  /** base units, as whole numbers in strings; null where the record did not carry it */
  supply: { base: string | null; now: string | null; max: string | null };
  rules: Record<RuleKey, Rule>;
  tradeMode: string;
  startsPaused: boolean;
  /** a frozen balance can still receive */
  toFrozen: boolean;
  history: { transfer: boolean; freeze: boolean; mint: boolean; burn: boolean } | null;
  /** where newly minted tokens go when the minter may not choose */
  destination: string | null;
  choosing: boolean;
  /** tokens created on a schedule, in the record's own words; '' when there is none */
  schedule: string;
  /** mints set for fixed times at creation */
  programmed: number;
  mainGroup: number | null;
  /** who may name a different group as the main group; null when the record did not carry it */
  mainGroupChange: Holder | null;
  /** false when the explorer's decoding carried no rules for this token */
  rulesRead: boolean;
  findings: Finding[];
}

export interface TypeRead {
  name: string;
  /** its owner may replace a document */
  replace: boolean;
  /** its owner may delete a document */
  remove: boolean | 'consumed';
  history: boolean;
  transfer: boolean;
  trade: boolean;
  /** who may create one: anyone, the contract's owner only, or no one */
  create: 'anyone' | 'owner' | 'none';
  /** seconds a document lives; 0 when it does not expire */
  ttl: number;
  /** what the contract's moderators may do to it, in words; '' when nothing */
  moderators: string;
  charges: boolean;
  properties: number;
}

export interface ContractRead {
  net: Net;
  id: string;
  owner: string;
  /** .dash names the owner identity holds, as the explorer lists them */
  ownerNames: string[];
  version: number;
  system: boolean;
  /** the day it was read, YYYY-MM-DD */
  read: string;
  /** the public record, so a reviewer can read it again */
  url: string;
  /** the contract can never be updated */
  readonly: boolean | null;
  tokens: TokenRead[];
  types: TypeRead[];
  groups: GroupRead[];
  /** what this reading could not read, one sentence each */
  unread: string[];
}

/* ---------- what may be read ---------- */

const B58 = /^[1-9A-HJ-NP-Za-km-z]{42,44}$/;
/** a contract or token identifier from whatever was typed (an id, or an explorer link that ends in one), or null */
export function cleanId(raw: string): string | null {
  const s = String(raw || '').trim().replace(/[?#].*$/, '').replace(/\/+$/, '');
  const last = s.slice(s.lastIndexOf('/') + 1);
  return B58.test(last) ? last : null;
}

/* control characters, and the marks that reorder or hide text: built from code points so this file holds none */
const CTRL = new RegExp('[' + [[0, 31], [127, 159], [0x2028, 0x2029], [0x200b, 0x200f], [0x202a, 0x202e], [0x2066, 0x2069], [0xfeff, 0xfeff]]
  .map(([a, b]) => String.fromCharCode(a) + '-' + String.fromCharCode(b)).join('') + ']', 'g');
/** text an issuer typed, made safe to print: no control or direction marks, one line, cut to a length */
export const said = (v: unknown, max = 80): string => String(v == null ? '' : v).replace(CTRL, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const idOf = (v: unknown): string => (typeof v === 'string' && B58.test(v) ? v : '');
const whole = (v: unknown): string | null => { const s = typeof v === 'number' && Number.isFinite(v) && v >= 0 ? String(Math.trunc(v)) : typeof v === 'string' ? v.trim() : ''; return /^\d{1,30}$/.test(s) ? s.replace(/^0+(?=\d)/, '') : null; };

/** a count of base units as the token's own number: 5600000000 with 6 decimals is 5,600 */
export function amount(base: string | null, decimals: number): string {
  if (base == null || !/^\d+$/.test(base)) return '';
  const d = Math.max(0, Math.min(18, decimals | 0));
  const s = base.padStart(d + 1, '0');
  const int = s.slice(0, s.length - d).replace(/\B(?=(\d{3})+(?!\d))/g, ','), frac = d ? s.slice(s.length - d).replace(/0+$/, '') : '';
  return frac ? int + '.' + frac : int;
}
/** how many times over: 5,600,000,000 against 100,000,000 is 56 */
function times(now: string, base: string): number {
  try { const b = BigInt(base); if (b <= 0n) return 0; return Number((BigInt(now) * 100n) / b) / 100; } catch { return 0; }
}
export const shortId = (id: string) => (id.length > 12 ? id.slice(0, 5) + '…' + id.slice(-4) : id);

/* ---------- reading the records: pure ---------- */

function groupOf(raw: any, position: number): GroupRead | null {
  const m = raw && typeof raw === 'object' && raw.members && typeof raw.members === 'object' ? raw.members : null;
  const required = Number(raw?.requiredPower);
  if (!m || !Number.isFinite(required) || required < 1) return null;
  const ids = Object.keys(m).slice(0, 256).map(id => ({ id: idOf(id), power: Number(m[id]) })).filter(x => x.id && Number.isFinite(x.power) && x.power > 0).sort((a, b) => b.power - a.power);
  if (!ids.length) return null;
  const total = ids.reduce((a, x) => a + x.power, 0);
  let least = 0, sum = 0;
  for (const x of ids) { sum += x.power; least++; if (sum >= required) break; }
  return { position, members: ids.length, required, total, least: sum >= required ? least : 0, ids };
}

function holderOf(raw: any, groups: GroupRead[], mainGroup: number | null): Holder {
  const t = String(raw?.takerType ?? '');
  if (t === 'NoOne') return { who: 'none' };
  if (t === 'ContractOwner') return { who: 'owner' };
  if (t === 'Identity') { const id = idOf(raw?.taker); return id ? { who: 'identity', id } : { who: 'unread', raw: said(t, 40) }; }
  if (t === 'MainGroup') return mainGroup == null ? { who: 'unread', raw: 'MainGroup' } : { who: 'group', position: mainGroup, main: true, byRole: true, group: groups.find(g => g.position === mainGroup) || null };
  const g = /^Group(?:\((\d{1,5})\))?$/.exec(t);
  if (g) {
    const position = g[1] != null ? Number(g[1]) : Number(raw?.taker);
    if (Number.isInteger(position) && position >= 0) return { who: 'group', position, main: position === mainGroup, group: groups.find(x => x.position === position) || null };
  }
  return { who: 'unread', raw: said(t || 'nothing', 40) };
}

const NO_RULE = (key: RuleKey): Rule => ({ key, does: { who: 'unread', raw: 'not in the record' }, changes: { who: 'unread', raw: 'not in the record' }, read: false });
function ruleOf(key: RuleKey, raw: any, groups: GroupRead[], mainGroup: number | null): Rule {
  if (!raw || typeof raw !== 'object' || !raw.authorizedToMakeChange) return NO_RULE(key);
  return { key, does: holderOf(raw.authorizedToMakeChange, groups, mainGroup), changes: holderOf(raw.adminActionTakers, groups, mainGroup), read: true };
}

/* one identity acting alone: the owner, a named identity, or a group one member can carry by itself */
export const alone = (h: Holder) => h.who === 'owner' || h.who === 'identity' || (h.who === 'group' && !!h.group && h.group.least === 1);
export const nobody = (h: Holder) => h.who === 'none';
const shared = (h: Holder) => h.who === 'group' && !!h.group && h.group.least > 1;

/** a holder in words, as the subject of a sentence: "The contract’s owner", "A group (at least 2 of its 3 members)".
    A rule that names the main group by its role says so: "The main group (all 2 of its members)". */
export function holderWords(h: Holder, cap = true): string {
  const main = h.who === 'group' && h.byRole === true;
  const g = main ? 'the main group' : 'a group';
  const s = h.who === 'none' ? 'no one'
    : h.who === 'owner' ? 'the contract’s owner'
    : h.who === 'identity' ? 'one named identity (' + shortId(h.id) + ')'
    : h.who === 'group' ? (h.group
      ? (h.group.least === 0 ? g + (main ? ', which cannot reach the power it needs' : ' that cannot reach the power it needs')
        : h.group.least === 1 ? g + (main ? ', in which one member holds enough power alone' : ' in which one member holds enough power alone')
        : h.group.least === h.group.members ? g + ' (all ' + h.group.members + ' of its members)'
        : g + ' (at least ' + h.group.least + ' of its ' + h.group.members + ' members)')
      : g + (main ? ', whose members this reading could not read' : ' whose members this reading could not read'))
    : 'someone this reading could not read';
  return cap ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

const M = {
  shared: ['mm-chain-multisig-governance', 'mm-org-two-person-integrity'],
  flow: ['mm-systems-stock-and-flow', 'mm-chain-credible-neutrality'],
  rights: ['mm-org-decision-rights', 'mm-chain-credible-neutrality'],
  breaker: ['mm-chain-circuit-breakers', 'mm-identity-break-glass'],
  change: ['mm-chain-timelock-and-guardian', 'mm-org-decision-rights'],
  log: ['mm-crypto-transparency-log'],
  permanent: ['mm-data-permanence-boundary'],
};

/** what a holder is trusting, deepest first */
function findingsOf(t: Omit<TokenRead, 'findings'>): Finding[] {
  const out: Finding[] = [];
  const add = (f: Finding) => out.push(f);
  const R = t.rules, d = t.decimals;
  const unit = t.plural || t.name || 'tokens';
  /* a power given to "the main group" moves when that group is replaced, whatever its own rule says */
  const follows = (r: Rule) => r.does.who === 'group' && r.does.byRole === true && !!t.mainGroupChange && !nobody(t.mainGroupChange);
  const lockNote = (r: Rule) => (!r.read ? '' : nobody(r.changes) ? (follows(r) ? ' Who holds this follows whichever group is the main group.' : ' Who holds this is fixed.') : ' ' + holderWords(r.changes) + ' can change who holds this.');

  if (!t.rulesRead) {
    add({ id: 'unread', weight: 3, tone: 'note', title: 'Its Rules Could Not Be Read', line: 'The explorer’s decoding of this contract carried no rules for this token, so this page cannot say who may mint, freeze or pause it. Its supply is read from the contract.', field: 'tokens (decoded create transition)', models: M.log });
  }

  /* 1. the inflow: who may mint, and whether anything bounds it */
  const mint = R.mint, max = t.supply.max;
  if (mint.read) {
    const cap = max == null ? 'There is no maximum supply, so nothing limits how many.' : 'The maximum supply is ' + amount(max, d) + '.';
    if (alone(mint.does)) {
      add({ id: 'mint-alone', weight: 3, tone: 'alone', title: max == null ? 'One Key Can Mint Without Limit' : 'One Key Can Mint More',
        line: holderWords(mint.does) + ' can mint new ' + unit + ' alone, at any time. ' + cap + lockNote(mint), field: 'manualMintingRules.authorizedToMakeChange, maxSupply', models: M.shared });
    } else if (shared(mint.does)) {
      add({ id: 'mint-shared', weight: 1, tone: 'held', title: 'Minting Takes More Than One Key',
        line: 'Minting needs ' + holderWords(mint.does, false) + '. ' + cap + lockNote(mint), field: 'manualMintingRules.authorizedToMakeChange, groups', models: M.shared });
    } else if (nobody(mint.does)) {
      const reopen = !nobody(mint.changes);
      add({ id: reopen ? 'mint-reopen' : 'mint-closed', weight: reopen ? 2 : 1, tone: reopen ? 'open' : 'fixed', title: reopen ? 'Minting Is Off, And Can Be Turned On' : 'No One Can Mint At Will',
        line: reopen ? 'No one may mint at will today. ' + holderWords(mint.changes) + ' can change that rule and name a minter.' : 'No one may mint at will, and that rule is fixed. A schedule, a one-time claim or a sale at a set price can still create tokens where the token has one.',
        field: 'manualMintingRules', models: reopen ? M.change : M.flow });
    } else {
      add({ id: 'mint-unread', weight: 2, tone: 'note', title: 'Who May Mint Could Not Be Read', line: 'The record names ' + holderWords(mint.does, false) + ' as the minter.' + lockNote(mint), field: 'manualMintingRules.authorizedToMakeChange', models: M.shared });
    }
  }

  /* 2. the rim: the maximum, and who may move it */
  const mx = R.max;
  if (mx.read) {
    const movable = !nobody(mx.does) || !nobody(mx.changes);
    if (max != null && !movable) add({ id: 'max-fixed', weight: 1, tone: 'fixed', title: 'The Maximum Is Fixed', line: 'At most ' + amount(max, d) + ' ' + unit + ' can exist, and that number is fixed.', field: 'maxSupply, maxSupplyChangeRules', models: M.flow });
    else if (max != null) {
      /* judged by whoever can move it today, or, when no one can, by whoever can name a mover */
      const mover = nobody(mx.does) ? mx.changes : mx.does;
      add({ id: 'max-movable', weight: alone(mover) ? 3 : 2, tone: alone(mover) ? 'alone' : shared(mover) ? 'held' : 'open', title: alone(mover) ? 'One Key Can Move The Maximum' : 'The Maximum Can Be Moved',
        line: 'The maximum supply is ' + amount(max, d) + ' today. ' + (nobody(mx.does) ? holderWords(mx.changes) + ' can name someone who may change it.' : holderWords(mx.does) + ' can change it.' + lockNote(mx)), field: 'maxSupplyChangeRules', models: M.change });
    }
    else if (movable) add({ id: 'max-none-movable', weight: 1, tone: 'note', title: 'A Maximum Can Still Be Set', line: 'There is no maximum supply. ' + (nobody(mx.does) ? holderWords(mx.changes) + ' can name someone who may set one.' : holderWords(mx.does) + ' can set one.'), field: 'maxSupplyChangeRules', models: M.change });
    else if (!mint.read || nobody(mint.does)) add({ id: 'max-none', weight: 1, tone: 'note', title: 'There Is No Maximum Supply', line: 'No maximum is set and no one can set one.', field: 'maxSupply, maxSupplyChangeRules', models: M.flow });
  }
  if (t.schedule) add({ id: 'schedule', weight: 2, tone: 'open', title: 'New Tokens Arrive On A Schedule', line: t.schedule, field: 'distributionRules.perpetualDistribution', models: M.flow });
  if (t.programmed > 0) add({ id: 'programmed', weight: 1, tone: 'note', title: 'Some Mints Were Set At Creation', line: t.programmed + (t.programmed === 1 ? ' mint was set for a fixed time' : ' mints were set for fixed times') + ' when the token was created.', field: 'distributionRules.preProgrammedDistribution', models: M.flow });

  /* 3. a holder's own balance: freezing, destroying, pausing */
  const fr = R.freeze, un = R.unfreeze, de = R.destroy;
  if (de.read && !nobody(de.does)) {
    add({ id: 'destroy', weight: 3, tone: alone(de.does) ? 'alone' : 'held', title: alone(de.does) ? 'One Key Can Destroy A Frozen Balance' : 'A Group Can Destroy A Frozen Balance',
      line: holderWords(de.does) + ' can destroy the tokens of a balance that has been frozen.' + lockNote(de), field: 'destroyFrozenFundsRules.authorizedToMakeChange', models: M.rights });
  }
  if (fr.read && !nobody(fr.does)) {
    const stuck = un.read && nobody(un.does);
    add({ id: 'freeze', weight: alone(fr.does) ? 3 : 2, tone: alone(fr.does) ? 'alone' : 'held', title: alone(fr.does) ? 'One Key Can Freeze A Balance' : 'A Group Can Freeze A Balance',
      line: holderWords(fr.does) + ' can freeze any holder’s balance, which stops that holder from sending.' + (stuck ? ' No one may unfreeze, so a frozen balance stays frozen.' : un.read ? ' ' + holderWords(un.does) + ' can unfreeze.' : '') + lockNote(fr), field: 'freezeRules, unfreezeRules', models: M.rights });
  } else if (fr.read && de.read && nobody(de.does)) {
    const later = !nobody(fr.changes) || !nobody(de.changes);
    add({ id: later ? 'freeze-later' : 'freeze-none', weight: later ? 2 : 1, tone: later ? 'open' : 'fixed', title: later ? 'Freezing Is Off, And Can Be Turned On' : 'No One Can Freeze Or Take A Balance',
      line: later ? 'No one may freeze or destroy a balance today. ' + holderWords(!nobody(fr.changes) ? fr.changes : de.changes) + ' can change that rule.' : 'No one may freeze a balance or destroy one, and those rules are fixed.', field: 'freezeRules, destroyFrozenFundsRules', models: later ? M.change : M.rights });
  }
  const pa = R.pause;
  if (pa.read) {
    if (!nobody(pa.does)) add({ id: 'pause', weight: 2, tone: alone(pa.does) ? 'alone' : 'held', title: alone(pa.does) ? 'One Key Can Stop Every Transfer' : 'A Group Can Stop Every Transfer',
      line: holderWords(pa.does) + ' can pause the token, which stops every transfer until the same holder resumes it.' + lockNote(pa), field: 'emergencyActionRules.authorizedToMakeChange', models: M.breaker });
    else add({ id: nobody(pa.changes) ? 'pause-none' : 'pause-later', weight: 1, tone: nobody(pa.changes) ? 'fixed' : 'open', title: nobody(pa.changes) ? 'No One Can Pause It' : 'Pausing Is Off, And Can Be Turned On',
      line: nobody(pa.changes) ? 'No one may pause the token, and that rule is fixed. Its transfers can not be stopped.' : 'No one may pause the token today. ' + holderWords(pa.changes) + ' can change that rule.', field: 'emergencyActionRules', models: M.breaker });
  }
  if (t.startsPaused) add({ id: 'starts-paused', weight: 1, tone: 'note', title: 'It Was Created Paused', line: 'The token was created with transfers paused. Whether it has been resumed since is not in this reading.', field: 'startAsPaused', models: M.breaker });

  /* a rule that names "the main group" follows whichever group is the main one, so whoever may change that holds those powers too */
  const mg = t.mainGroupChange;
  const byRole = RULE_KEYS.filter(k => [R[k].does, R[k].changes].some(h => h.who === 'group' && h.byRole === true));
  if (mg && !nobody(mg) && mg.who !== 'unread' && byRole.length) {
    add({ id: 'main-group', weight: alone(mg) ? 3 : 2, tone: alone(mg) ? 'alone' : shared(mg) ? 'held' : 'open', title: alone(mg) ? 'One Key Can Replace The Main Group' : 'The Main Group Can Be Replaced',
      line: holderWords(mg) + ' can name a different group as the token’s main group. Every power the main group holds goes with that choice.', field: 'mainControlGroupCanBeModified', models: M.change });
  }

  /* 4. the record it keeps, and where it trades */
  if (t.history && !(t.history.mint && t.history.burn && t.history.freeze && t.history.transfer)) {
    const off = [!t.history.mint && 'mints', !t.history.burn && 'burns', !t.history.freeze && 'freezes', !t.history.transfer && 'transfers'].filter(Boolean) as string[];
    add({ id: 'history', weight: 1, tone: 'note', title: off.length === 4 ? 'It Keeps No Public History' : 'It Keeps No History Of Some Actions', line: 'The token keeps no public history of its ' + (off.length > 1 ? off.slice(0, -1).join(', ') + ' and ' + off[off.length - 1] : off[0]) + '.', field: 'keepsHistory', models: M.log });
  }
  const tr = R.trade;
  if (tr.read && t.tradeMode === 'NotTradeable' && nobody(tr.does) && nobody(tr.changes)) add({ id: 'trade-never', weight: 1, tone: 'fixed', title: 'It Can Not Join The Resale Market', line: 'The token was created not tradeable, and that is fixed.', field: 'marketplaceRules', models: M.permanent });

  const rank: Record<Tone, number> = { alone: 0, open: 1, note: 2, held: 3, fixed: 4 };
  return out.sort((a, b) => b.weight - a.weight || rank[a.tone] - rank[b.tone]);
}

function scheduleWords(p: any, decimals: number): string {
  if (!p || typeof p !== 'object') return '';
  const every = Number(p.interval);
  const kind = String(p.type || '');
  const beat = kind === 'BlockBasedDistribution' ? 'blocks' : kind === 'TimeBasedDistribution' ? 'milliseconds' : kind === 'EpochBasedDistribution' ? 'epochs' : '';
  const to = String(p.recipientType || '') === 'ContractOwner' ? 'the contract’s owner'
    : String(p.recipientType || '') === 'Identity' && idOf(p.recipientValue) ? 'one named identity (' + shortId(idOf(p.recipientValue)) + ')'
    : /Evonodes/i.test(String(p.recipientType || '')) ? 'the evonodes that proposed blocks' : 'a recipient this reading could not read';
  const fixed = String(p.functionName || '') === 'FixedAmount' ? whole(p.functionValue?.amount) : null;
  const what = fixed ? amount(fixed, decimals) + (amount(fixed, decimals) === '1' ? ' new token' : ' new tokens') : 'new tokens, by a rule named ' + (said(p.functionName, 30) || 'in the record');
  return 'The token creates ' + what + (Number.isFinite(every) && every > 0 && beat ? ' every ' + every.toLocaleString('en-US') + ' ' + beat : ' on a schedule') + ', for ' + to + ' to claim.';
}

function tokenOf(position: number, dec: any, now: any, groups: GroupRead[]): TokenRead {
  const conv = dec?.conventions || {};
  const loc = (conv.localizations && typeof conv.localizations === 'object' ? conv.localizations : now?.localizations) || {};
  const en = loc.en || loc[Object.keys(loc)[0]] || {};
  const decimals = Number.isInteger(conv.decimals) ? conv.decimals : Number.isInteger(now?.decimals) ? now.decimals : 0;
  const mainRaw = dec ? dec.mainControlGroup : now?.mainGroup;
  const mainGroup = Number.isInteger(mainRaw) && mainRaw >= 0 ? mainRaw : null;
  const r = (key: RuleKey, raw: any) => ruleOf(key, raw, groups, mainGroup);
  const rules: Record<RuleKey, Rule> = {
    mint: r('mint', dec?.manualMintingRules), burn: r('burn', dec?.manualBurningRules), freeze: r('freeze', dec?.freezeRules), unfreeze: r('unfreeze', dec?.unfreezeRules),
    destroy: r('destroy', dec?.destroyFrozenFundsRules), pause: r('pause', dec?.emergencyActionRules), max: r('max', dec?.maxSupplyChangeRules),
    trade: r('trade', dec?.marketplaceRules?.tradeModeChangeRules), names: r('names', dec?.conventionsChangeRules),
  };
  /* the rules count as read only when the one a holder asks about first, who may mint, was in the record */
  const rulesRead = rules.mint.read;
  const dist = dec?.distributionRules || {};
  const h = dec?.keepsHistory;
  const base: Omit<TokenRead, 'findings'> = {
    id: idOf(dec?.tokenId) || idOf(now?.identifier),
    position,
    name: said(en.singularForm, 40) || 'Token ' + position,
    plural: said(en.pluralForm, 40),
    description: said(dec?.description ?? now?.description, 240),
    decimals: Math.max(0, Math.min(18, decimals)),
    supply: { base: whole(dec?.baseSupply ?? now?.baseSupply), now: whole(now?.totalSupply), max: whole(dec ? dec.maxSupply : now?.maxSupply) },
    rules,
    tradeMode: said(dec?.marketplaceRules?.tradeMode, 30),
    startsPaused: dec?.startAsPaused === true,
    toFrozen: dec?.isAllowedTransferToFrozenBalance === true,
    history: h && typeof h === 'object' ? { transfer: h.keepsTransferHistory === true, freeze: h.keepsFreezingHistory === true, mint: h.keepsMintingHistory === true, burn: h.keepsBurningHistory === true } : null,
    destination: idOf(dist.newTokenDestinationIdentity) || null,
    choosing: dist.mintingAllowChoosingDestination === true,
    schedule: scheduleWords(dist.perpetualDistribution, Math.max(0, Math.min(18, decimals))),
    programmed: Array.isArray(dist.preProgrammedDistribution) ? Math.min(dist.preProgrammedDistribution.length, 9999) : 0,
    mainGroup,
    mainGroupChange: dec?.mainControlGroupCanBeModified && typeof dec.mainControlGroupCanBeModified === 'object' ? holderOf(dec.mainControlGroupCanBeModified, groups, mainGroup) : null,
    rulesRead,
  };
  return { ...base, findings: findingsOf(base) };
}

function typeOf(name: string, s: any, cfg: any): TypeRead {
  const ma = s?.moderatorAbilities && typeof s.moderatorAbilities === 'object' ? s.moderatorAbilities : null;
  const can = [ma?.delete === true && 'delete its documents', Array.isArray(ma?.changeFields) && ma.changeFields.length > 0 && 'write ' + ma.changeFields.length + (ma.changeFields.length === 1 ? ' field' : ' fields') + ' on them'].filter(Boolean) as string[];
  const mode = Number(s?.creationRestrictionMode);
  return {
    name: said(name, 64),
    replace: typeof s?.documentsMutable === 'boolean' ? s.documentsMutable : cfg?.documentsMutableContractDefault !== false,
    remove: s?.canBeDeleted === 'onlyWhenConsumed' ? 'consumed' : typeof s?.canBeDeleted === 'boolean' ? s.canBeDeleted : cfg?.documentsCanBeDeletedContractDefault !== false,
    history: typeof s?.documentsKeepHistory === 'boolean' ? s.documentsKeepHistory : cfg?.documentsKeepHistoryContractDefault === true,
    transfer: s?.transferable === 1,
    trade: s?.tradeMode === 1,
    create: mode === 1 ? 'owner' : mode === 2 ? 'none' : 'anyone',
    ttl: Number.isInteger(s?.ttl) && s.ttl > 0 ? s.ttl : 0,
    moderators: can.join(' and '),
    charges: !!(s?.actionFees || s?.tokenCost),
    properties: s?.properties && typeof s.properties === 'object' ? Object.keys(s.properties).length : 0,
  };
}

/** a contract's reading from its record and the explorer's decoding of its create transition */
export function parseContract(dc: any, dec: any, net: Net, read = today()): ContractRead {
  const id = idOf(dc?.identifier);
  if (!id) throw new Error('The record read is not a data contract.');
  const unread: string[] = [];
  const groups = (Array.isArray(dc?.groups) ? dc.groups : []).slice(0, 64).map((g: any, i: number) => groupOf(g, i)).filter(Boolean) as GroupRead[];
  const decOk = !!dec && typeof dec === 'object' && idOf(dec.dataContractId) === id;
  if (!decOk) unread.push('The explorer did not decode the transition that created this contract, so the rules it was created with are not read here.');
  const decTokens: any[] = decOk && Array.isArray(dec.tokens) ? dec.tokens : [];
  const nowTokens: any[] = Array.isArray(dc?.tokens) ? dc.tokens.slice(0, 64) : [];
  const positions = [...new Set([...nowTokens.map(t => Number(t?.position)), ...decTokens.map(t => Number(t?.position))].filter(p => Number.isInteger(p) && p >= 0))].sort((a, b) => a - b).slice(0, 64);
  const tokens = positions.map(p => tokenOf(p, decTokens.find(t => Number(t?.position) === p) || null, nowTokens.find(t => Number(t?.position) === p) || null, groups));
  if (decOk && tokens.length) unread.push('The explorer’s decoding leaves out some of a token’s rules: who may set a price at which anyone buys newly minted tokens, whether every identity may claim an amount once, who may change the schedule or where new tokens go, whether the token can be sent from one holder to another, and whether it has a shielded pool. The first three can add to the supply, up to the maximum when there is one. All of them are in the contract itself.');
  const version = Number.isInteger(dc?.version) ? dc.version : 1;
  if (version > 1) unread.push('The contract has been updated ' + (version - 1) + (version === 2 ? ' time' : ' times') + ' since it was created. This page reads the rules of the first version. An update can add a document type or a token; it cannot change the rules of a token that exists.');
  if (tokens.some(t => RULE_KEYS.some(k => t.rules[k].read && (!nobody(t.rules[k].does) || !nobody(t.rules[k].changes)) && k !== 'mint' && k !== 'burn' && k !== 'freeze' && k !== 'unfreeze' && k !== 'destroy' && k !== 'pause')) || tokens.some(t => RULE_KEYS.some(k => t.rules[k].read && !nobody(t.rules[k].changes))))
    unread.push('Where a line says a rule can be changed, it may have been changed since the contract was created. The explorer lists a token’s actions, and a change of its rules is one of them.');
  let schema: any = {};
  try { schema = typeof dc?.schema === 'string' ? JSON.parse(dc.schema) : dc?.schema || {}; } catch { unread.push('The contract’s document types could not be read.'); }
  const cfg = decOk ? dec.internalConfig : null;
  const types = Object.keys(schema && typeof schema === 'object' ? schema : {}).slice(0, 100).filter(k => schema[k] && typeof schema[k] === 'object').map(k => typeOf(k, schema[k], cfg));
  const names = (Array.isArray(dc?.owner?.aliases) ? dc.owner.aliases : []).filter((a: any) => a && a.status === 'ok').map((a: any) => said(a.alias, 70)).filter((a: string) => /^[a-z0-9-]{1,63}\.dash$/i.test(a)).slice(0, 4);
  return {
    net, id, owner: idOf(dc?.owner?.identifier) || idOf(decOk ? dec.ownerId : ''), ownerNames: names, version, system: dc?.isSystem === true, read,
    url: EXPLORER_VIEW[net] + '/dataContract/' + id,
    readonly: cfg && typeof cfg.readonly === 'boolean' ? cfg.readonly : null,
    tokens, types, groups, unread,
  };
}

/** the reading as dated plain text a holder or a reviewer can keep */
export function readingText(c: ContractRead): string {
  const L: string[] = [];
  L.push('# A reading of ' + (c.tokens.length === 1 ? c.tokens[0].name : c.tokens.length ? c.tokens.length + ' tokens' : 'a data contract') + ' on Dash Platform (' + c.net + ')');
  L.push('');
  L.push('Read ' + c.read + ' from the community Platform Explorer: ' + c.url);
  L.push('Contract ' + c.id + ', version ' + c.version + '. Owner ' + c.owner + (c.ownerNames.length ? ' (' + c.ownerNames.join(', ') + ')' : '') + '.');
  L.push('This reads who holds each power. It says nothing about what a token is worth.');
  for (const t of c.tokens) {
    L.push('');
    L.push('## ' + t.name + (t.id ? ' (' + t.id + ')' : ''));
    const s = t.supply;
    L.push('Supply: ' + (s.now != null ? amount(s.now, t.decimals) + ' today' : 'not read') + (s.base != null ? ', ' + amount(s.base, t.decimals) + ' at creation' : '') + (s.max != null ? ', ' + amount(s.max, t.decimals) + ' at most' : ', no maximum') + '.');
    for (const f of t.findings) L.push('- ' + f.title + '. ' + f.line + ' [' + f.field + ']');
  }
  if (c.types.length) {
    L.push('');
    L.push('## Its document types');
    for (const d of c.types) L.push('- ' + d.name + ': ' + typeWords(d));
  }
  if (c.unread.length) { L.push(''); L.push('## What this reading could not read'); for (const u of c.unread) L.push('- ' + u); }
  L.push('- Who holds the keys of an identity is not in any public record.');
  return L.join('\n') + '\n';
}

/** a document type's facts in one sentence */
export function typeWords(d: TypeRead): string {
  const life = d.ttl ? ' Each one is deleted ' + lifeWords(d.ttl) + ' after it is created.' : '';
  return 'its owner ' + (d.replace ? 'can' : 'cannot') + ' replace a document and ' + (d.remove === 'consumed' ? 'cannot delete one (another document can consume it)' : d.remove ? 'can delete one' : 'cannot delete one')
    + '; ' + (d.create === 'anyone' ? 'anyone can create one' : d.create === 'owner' ? 'only the contract’s owner can create one' : 'no one can create one directly')
    + (d.transfer || d.trade ? '; a document can be ' + [d.transfer && 'given', d.trade && 'sold'].filter(Boolean).join(' and ') : '')
    + (d.history ? '; every version is kept' : '') + (d.moderators ? '; the contract’s moderators can ' + d.moderators : '') + (d.charges ? '; an action on it is charged' : '') + '.' + life;
}
export function lifeWords(seconds: number): string {
  const u: [number, string][] = [[86400, 'day'], [3600, 'hour'], [60, 'minute']];
  for (const [n, w] of u) if (seconds >= n && seconds % n === 0) { const k = seconds / n; return k + ' ' + w + (k === 1 ? '' : 's'); }
  return seconds + ' seconds';
}

/** how far the supply has moved since the token was created, in words; '' when it has not, or cannot be told */
export function grownWords(t: TokenRead): string {
  const { base, now } = t.supply;
  if (base == null || now == null || base === now) return '';
  try {
    const b = BigInt(base), n = BigInt(now);
    if (n > b) return b === 0n ? 'All of it was created after the token was registered.' : 'The supply is ' + times(now, base).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' times what it was at creation.';
    return 'The supply is lower than at creation: ' + amount((b - n).toString(), t.decimals) + ' have been burned or destroyed.';
  } catch { return ''; }
}

/* ---------- reading the records: the network ---------- */

const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

async function ask(url: string, body?: unknown): Promise<{ status: number; json: any }> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const res = await fetch(url, body === undefined ? { signal: ctl.signal } : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
    let json: any = null;
    try { json = await res.json(); } catch { /* an answer that is not JSON is read as none */ }
    return { status: res.status, json };
  } catch (e: any) {
    throw new Error(e?.name === 'AbortError' ? 'The explorer took too long to answer. Try again in a moment.' : 'The explorer could not be reached. Check the connection and try again.');
  } finally { clearTimeout(timer); }
}

/** read a contract, or the contract of a token, from the public explorer */
export async function readContract(raw: string, net: Net): Promise<ContractRead> {
  let id = cleanId(raw);
  if (!id) throw new Error('That is not a Dash Platform identifier. A contract id is about 44 letters and digits.');
  const base = EXPLORER[net];
  let r = await ask(base + '/dataContract/' + id);
  if (r.status === 404 || (r.status === 200 && !idOf(r.json?.identifier))) {
    /* a token's own id: the explorer names the contract that holds it */
    const t = await ask(base + '/token/' + id);
    const holder = t.status === 200 ? idOf(t.json?.dataContractIdentifier) : '';
    if (!holder) throw new Error('No contract or token with this id on ' + net + '.' + (net === 'mainnet' ? ' If it is on testnet, switch the network.' : ''));
    id = holder;
    r = await ask(base + '/dataContract/' + id);
  }
  if (r.status !== 200 || !idOf(r.json?.identifier)) throw new Error('The explorer did not answer for this contract (' + r.status + '). Try again later.');
  const dc = r.json;
  let dec: any = null;
  const hash = typeof dc.txHash === 'string' && /^[0-9A-Fa-f]{64}$/.test(dc.txHash) ? dc.txHash : '';
  if (hash) {
    const tx = await ask(base + '/transaction/' + hash);
    const data = tx.status === 200 && typeof tx.json?.data === 'string' && tx.json.data.length <= 60000 && /^[A-Za-z0-9+/=]+$/.test(tx.json.data) ? tx.json.data : '';
    if (data) { const d = await ask(base + '/transaction/decode', { base64: data }); if (d.status === 200) dec = d.json; }
  }
  return parseContract(dc, dec, net);
}
