/* SHOWN, NOT SAID. Some statements in the checks can be read from a public record, so a reviewer does not have
   to take the project's word for them. A reading says what the record showed, where it was read, when, and
   the strongest answer that record allows. The project's answer stays its own: when it claims more than the
   record allows, the page says so plainly and the project chooses; nothing is overwritten.

   Four reads, all from the browser, keyless, and allowed by name in vercel.json's connect-src:
     domain-locks  a domain's lock statuses from its registry's RDAP server (the base for each TLD from IANA's
                   bootstrap, published 2026-10-28; TLDs whose registry is not listed here are said so plainly)
     dns-records   where a domain's records point, from Google Public DNS (dns.google): name servers, addresses,
                   mail servers and CAA. A dated copy, kept so the next reading can say what changed; it never
                   settles the statement, because whether the records point where they should is the project's
                   to say, and nothing watches while the page is closed
     multisig      a Dash address from insight.dash.org: an X address has one key; a 7 address is a script,
                   and once it has spent, its redeem script on the chain gives m of n
     scorecard     a GitHub repository's published OpenSSF Scorecard results from api.scorecard.dev: one read
                   serves every statement in the code check that a Scorecard check can show
   A reading limits an answer only where the record settles it. Where the record cannot see far enough (a
   script address that has not spent, a Scorecard check whose own docs say a low score is not definitive),
   the reading says what it found and allows 'open': it neither backs the answer nor limits it.
   What a reading cannot do, said on the page: it shows a state on the day it was read, not the practice
   behind it; a record is text a project could edit, so a reviewer reads the links again; and a read tells
   its provider which domain, address or repository is being checked. Parsing is pure and tested against
   saved real responses (research/evidence/, probe-check.mts); the network calls are separate. */

import type { CheckAnswer, EvidenceKind } from '../content/check/types';
export type { EvidenceKind } from '../content/check/types';

export interface Reading {
  kind: EvidenceKind;
  /** the domain or address that was read */
  subject: string;
  /** the public record, so a reviewer can read it again */
  url: string;
  /** the day it was read, YYYY-MM-DD */
  read: string;
  /** what the record showed, in one plain sentence */
  found: string;
  /** the strongest answer the record allows for this statement; open when the record does not settle it */
  allows: 'yes' | 'partly' | 'no' | 'open';
  /** what the record cannot show about the statement, said beside it */
  unseen?: string;
  /** for a record that can change: what it held, one line each, so the next reading can say what changed */
  held?: string[];
}

/* ---------- where each record is read ---------- */

/* RDAP bases from https://data.iana.org/rdap/dns.json (publication 2026-10-28), for the TLDs projects use most */
export const RDAP_BASE: Record<string, string> = {
  org: 'https://rdap.publicinterestregistry.org/rdap/',
  foundation: 'https://rdap.publicinterestregistry.org/rdap/',
  com: 'https://rdap.verisign.com/com/v1/',
  net: 'https://rdap.verisign.com/net/v1/',
  team: 'https://rdap.identitydigital.services/rdap/',
  finance: 'https://rdap.identitydigital.services/rdap/',
  network: 'https://rdap.identitydigital.services/rdap/',
  money: 'https://rdap.identitydigital.services/rdap/',
  ai: 'https://rdap.identitydigital.services/rdap/',
  info: 'https://rdap.identitydigital.services/rdap/',
  cash: 'https://rdap.identitydigital.services/rdap/',
  systems: 'https://rdap.identitydigital.services/rdap/',
  xyz: 'https://rdap.centralnic.com/xyz/',
  app: 'https://pubapi.registry.google/rdap/',
  dev: 'https://pubapi.registry.google/rdap/',
};
export const INSIGHT = 'https://insight.dash.org/insight-api';
/* Scorecard's REST API, as its README names it; it answers a browser page with access-control-allow-origin: *,
   on a 404 as well. The viewer is a link for the reviewer, never read by the page. */
export const SCORECARD_API = 'https://api.scorecard.dev/projects/';
export const SCORECARD_VIEW = 'https://scorecard.dev/viewer/?uri=';
/* Google Public DNS's JSON API, which Google calls a web-friendly API for DNS over HTTPS: no key, no account, and it
   answers a browser page with access-control-allow-origin: * (tested 2026-11-10). Its own query page is the link
   a reviewer opens. */
export const DOH = 'https://dns.google/resolve';
export const DOH_VIEW = 'https://dns.google/query?name=';
/** every host a read may contact; probe-check.mts holds vercel.json's connect-src to exactly these */
export const EVIDENCE_HOSTS = [...new Set([...Object.values(RDAP_BASE), INSIGHT, SCORECARD_API, DOH].map(u => new URL(u).host))];
/** hosts the page links to so a reviewer can read the record again, and never reads itself */
export const LINK_HOSTS = ['insight.dash.org', 'scorecard.dev'];

/** which public record a kind reads: statements that read the same record share the subject typed for it */
export type EvidenceSource = 'rdap' | 'dns' | 'insight' | 'scorecard';
export const evidenceSource = (k: EvidenceKind): EvidenceSource => (k === 'domain-locks' ? 'rdap' : k === 'dns-records' ? 'dns' : k.startsWith('multisig') ? 'insight' : 'scorecard');
/** what a project types for a record: the lock read and the DNS read both take its domain, so either fills the other */
export const subjectOf = (s: EvidenceSource): string => (s === 'rdap' || s === 'dns' ? 'domain' : s);
export type ScorecardKind = Extract<EvidenceKind, `scorecard-${string}`>;
export const isScorecardKind = (k: EvidenceKind): k is ScorecardKind => k.startsWith('scorecard-');

const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

/* ---------- what may be read ---------- */

/** a bare domain from whatever was typed, or null */
export function cleanDomain(raw: string): string | null {
  const d = String(raw || '').trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/[/?#].*$/, '').replace(/\.$/, '');
  return /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(d) ? d : null;
}
export const tldOf = (domain: string) => domain.slice(domain.lastIndexOf('.') + 1);
export const rdapUrl = (domain: string) => (RDAP_BASE[tldOf(domain)] ? RDAP_BASE[tldOf(domain)] + 'domain/' + domain : null);
export const READABLE_TLDS = Object.keys(RDAP_BASE);

/** a Dash mainnet address: X for one key, 7 for a script (base58, 34 characters) */
export function dashAddressType(raw: string): 'single' | 'script' | null {
  const a = String(raw || '').trim();
  if (!/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{34}$/.test(a)) return null;
  return a[0] === 'X' ? 'single' : a[0] === '7' ? 'script' : null;
}

/** a GitHub repository from whatever was typed (owner/repo, github.com/owner/repo, or its URL), as
   github.com/owner/repo. The letter case is kept: Scorecard names a repository with the case GitHub shows. */
export function cleanRepo(raw: string): string | null {
  let r = String(raw || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/[?#].*$/, '').replace(/\/+$/, '');
  if (/^github\.com\//i.test(r)) r = r.slice('github.com/'.length);
  const m = r.match(/^([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100})(?:\/.*)?$/);
  if (!m) return null;
  const repo = m[2].replace(/\.git$/i, '');
  if (!repo || repo === '.' || repo === '..') return null;
  return 'github.com/' + m[1] + '/' + repo;
}

/* ---------- reading a record: pure ---------- */

/** a domain's locks from an RDAP response */
export function parseRdap(json: any, domain: string, url: string, read = today()): Reading {
  const status: string[] = Array.isArray(json?.status) ? json.status.map((s: any) => String(s).toLowerCase()) : [];
  const has = (k: string) => status.some(s => s === 'client ' + k + ' prohibited' || s === 'server ' + k + ' prohibited');
  const locks = ['transfer', 'update', 'delete'];
  const set = locks.filter(has), unset = locks.filter(k => !has(k));
  const registry = status.some(s => s.startsWith('server ') && s.endsWith(' prohibited'));
  const exp = (Array.isArray(json?.events) ? json.events : []).find((e: any) => e?.eventAction === 'expiration')?.eventDate;
  const list = (xs: string[]) => xs.length === 1 ? xs[0] : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
  const found = (set.length ? 'The ' + list(set) + ' lock' + (set.length > 1 ? 's are' : ' is') + ' set' : 'No lock is set')
    + (unset.length && set.length ? '; the ' + list(unset) + ' lock' + (unset.length > 1 ? 's are' : ' is') + ' not' : '')
    + (registry ? '. The registry holds its own lock as well' : '')
    + (exp ? '. The registration runs to ' + String(exp).slice(0, 10) : '') + '.';
  return { kind: 'domain-locks', subject: domain, url, read, found, allows: unset.length === 0 ? 'yes' : set.length ? 'partly' : 'no', unseen: 'Whether it renews by itself is not in the record.' };
}

/** m of n from a P2SH multisig redeem script, as hex, or null when it is not one */
export function parseRedeemScript(hex: string): { m: number; n: number } | null {
  const h = String(hex || '').toLowerCase();
  if (!/^[0-9a-f]+$/.test(h) || h.length < 8 || !h.endsWith('ae')) return null;
  const op = (i: number) => parseInt(h.slice(i, i + 2), 16);
  const m = op(0) - 0x50;
  if (m < 1 || m > 16) return null;
  let i = 2, keys = 0;
  while (i < h.length - 4) {
    const len = op(i);
    if (len !== 0x21 && len !== 0x41) return null;
    i += 2 + len * 2;
    keys++;
  }
  const n = op(i) - 0x50;
  if (i !== h.length - 4 || n !== keys || n < m || n > 16) return null;
  return { m, n };
}

/** a Dash treasury address's threshold, from insight's transactions for it */
export function parseMultisig(txsJson: any, address: string, kind: 'multisig-agree' | 'multisig-spare', url: string, read = today()): Reading {
  const type = dashAddressType(address);
  const base = { kind, subject: address, url, read };
  if (type === 'single') {
    return { ...base, found: 'This is a single-key address: one key can move everything in it.', allows: 'no' };
  }
  let mn: { m: number; n: number } | null = null;
  for (const tx of Array.isArray(txsJson?.txs) ? txsJson.txs : []) {
    for (const v of Array.isArray(tx?.vin) ? tx.vin : []) {
      if (v?.addr !== address) continue;
      const asm = String(v?.scriptSig?.asm || '').trim().split(/\s+/);
      mn = parseRedeemScript(asm[asm.length - 1] || '');
      if (mn) break;
    }
    if (mn) break;
  }
  if (!mn) {
    return { ...base, found: 'This is a script address, and it has not spent in the record read, so its signers are not on the chain yet.', allows: 'open', unseen: 'Its threshold shows once it has spent.' };
  }
  const found = 'Spends from this address need ' + mn.m + ' of ' + mn.n + ' signatures, read from a redeem script on the chain.';
  const allows = kind === 'multisig-agree' ? (mn.m >= 2 ? 'yes' : 'no') : (mn.m < mn.n ? 'yes' : 'no');
  return { ...base, found, allows, unseen: kind === 'multisig-agree' ? 'Whether the keys are held by different people is not in the record.' : undefined };
}

/* What each Scorecard check can show, from its own docs (ossf/scorecard, docs/checks.md, read 2026-11-05). A
   low score limits the answer only where those docs say the check sees all the statement claims; elsewhere it
   is open. Code-Review reads about the last 30 changes. Branch-Protection's first tier, 3 of 10, is force
   pushes and deletion blocked. Token-Permissions cannot see the repository's read-only setting. Signed-Releases
   gives 8 for a signature with each of the last releases and 10 for provenance, and verifies neither.
   Dependency-Update-Tool says a low score is not definitive, and the weekly scan leaves it out. Security-Policy
   gives 6 of its 10 for a contact in SECURITY.md. */
type Allows = Reading['allows'];
const SCORECARD_RULES: Record<ScorecardKind, { check: string; allows: (score: number) => Allows; unseen: string }> = {
  'scorecard-review': { check: 'Code-Review', allows: (s) => (s >= 10 ? 'yes' : s > 0 ? 'partly' : 'no'), unseen: 'Scorecard reads the recent changes, not the setting that requires review.' },
  'scorecard-branch': { check: 'Branch-Protection', allows: (s) => (s >= 3 ? 'yes' : s > 0 ? 'partly' : 'no'), unseen: 'Who can turn the rules off is not in the record.' },
  'scorecard-token': { check: 'Token-Permissions', allows: (s) => (s >= 9 ? 'yes' : 'open'), unseen: 'Scorecard reads the workflow files; it cannot see whether the repository’s default token is read-only.' },
  'scorecard-signed': { check: 'Signed-Releases', allows: (s) => (s >= 8 ? 'yes' : 'open'), unseen: 'Scorecard looks for signature files with the last releases and does not verify them. Whether users are told how to check them is not in the record.' },
  'scorecard-provenance': { check: 'Signed-Releases', allows: (s) => (s >= 10 ? 'yes' : 'open'), unseen: 'Scorecard gives 10 only when each of the last releases carries a provenance file, and does not verify it.' },
  'scorecard-updates': { check: 'Dependency-Update-Tool', allows: (s) => (s >= 10 ? 'yes' : 'open'), unseen: 'Scorecard can see that an update tool is enabled, not whether it runs or whether its updates are merged.' },
  'scorecard-policy': { check: 'Security-Policy', allows: (s) => (s >= 6 ? 'yes' : 'open'), unseen: 'Whether someone answers is not in the record, and GitHub’s private reporting, turned on in settings, does not show in the file.' },
};
export const scorecardCheckOf = (k: ScorecardKind) => SCORECARD_RULES[k].check;
const RANK_OF: Record<Exclude<Allows, 'open'>, number> = { yes: 3, partly: 2, no: 1 };
const lower = (a: Allows, b: Allows): Allows => (a === 'open' ? b : b === 'open' ? a : RANK_OF[a] <= RANK_OF[b] ? a : b);

/** force pushes and deletion, branch by branch, from Branch-Protection's details */
function branchRules(details: string[]) {
  const by = new Map<string, { force?: boolean; del?: boolean }>();
  for (const d of details) {
    const m = String(d).match(/'(force pushes|allow deletion)' (disabled|enabled) on branch '([^']{1,100})'/);
    if (!m) continue;
    const b = by.get(m[3]) || {};
    if (m[1] === 'force pushes') b.force = m[2] === 'disabled'; else b.del = m[2] === 'disabled';
    by.set(m[3], b);
  }
  return [...by].filter(([, b]) => b.force !== undefined && b.del !== undefined).map(([name, b]) => ({ name, force: !!b.force, del: !!b.del }));
}

/** one statement's reading from a repository's published Scorecard results */
export function parseScorecard(json: any, kind: ScorecardKind, subject: string, url: string, read = today()): Reading {
  const rule = SCORECARD_RULES[kind];
  const base = { kind, subject, url, read, unseen: rule.unseen };
  const scan = typeof json?.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(json.date) ? json.date.slice(0, 10) : 'an undated scan';
  const c = (Array.isArray(json?.checks) ? json.checks : []).find((x: any) => x?.name === rule.check);
  if (!c) return { ...base, found: 'Scorecard’s scan of ' + scan + ' did not run ' + rule.check + '; its weekly scan of public repositories leaves some checks out.', allows: 'open' };
  const score = typeof c.score === 'number' ? c.score : NaN;
  const reason = String(c.reason || '').replace(/\s*--\s*score normalized to -?\d+\s*$/i, '').replace(/[.\s]+$/, '').slice(0, 160);
  if (!Number.isFinite(score) || score < 0) {
    const why = reason && reason.length <= 60 && !/error/i.test(reason) ? ': “' + reason + '”' : '';
    return { ...base, found: rule.check + ' did not run in Scorecard’s scan of ' + scan + why + '.', allows: 'open' };
  }
  const s = Math.min(10, Math.round(score));
  let allows = rule.allows(s);
  /* Scorecard's own reason is quoted as its words; what the page adds from the details is not */
  let text = reason ? '“' + reason + '”' : 'no reason given';
  const details: string[] = Array.isArray(c.details) ? c.details.map(String).slice(0, 200) : [];
  if (kind === 'scorecard-branch') {
    const rules = branchRules(details);
    if (rules.length) {
      const all = rules.every(r => r.force && r.del);
      text = all ? 'force pushes and deletion are blocked on ' + rules.map(r => r.name).join(', ')
        : rules.map(r => r.name + ': force pushes ' + (r.force ? 'blocked' : 'allowed') + ', deletion ' + (r.del ? 'blocked' : 'allowed')).join('; ');
      allows = lower(allows, all ? 'yes' : rules.some(r => r.force || r.del) ? 'partly' : 'no');
    }
  }
  if (kind === 'scorecard-token') {
    const n = details.filter(d => /no topLevel permission defined/.test(d)).length;
    if (n) text += '; ' + n + (n > 1 ? ' workflows set' : ' workflow sets') + ' no top-level permissions';
  }
  return { ...base, found: rule.check + ' scored ' + s + ' of 10 in Scorecard’s scan of ' + scan + ': ' + text + '.', allows };
}

/* ---------- DNS: where a domain points, and what changed since the last reading ---------- */

/** what a DNS reading asks for: who serves the zone, where the site and the mail go, and which authorities may
   issue certificates for the domain */
export const DNS_TYPES = ['NS', 'A', 'AAAA', 'MX', 'CAA'] as const;
export type DnsType = typeof DNS_TYPES[number];
const DNS_TYPE_NAME: Record<number, string> = { 1: 'A', 2: 'NS', 5: 'CNAME', 15: 'MX', 28: 'AAAA', 257: 'CAA' };
const dnsHost = (s: unknown) => String(s ?? '').trim().toLowerCase().replace(/\.$/, '');
/* DNS data is whatever the domain's owner, or someone who took its DNS account, put there; a line reaches the page
   and the record only if it is made of the characters these record types use */
const DNS_SAFE = /^[a-z0-9.:_\-@/ ";=]{1,253}$/;
/* a record with other characters is kept only as a short fingerprint (FNV-1a), so a change to it still shows and
   its text never does */
const fingerprint = (s: string) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
const NOT_SHOWN = / \(not shown, [0-9a-f]{8}\)$/;

/** the records a set of DNS answers holds, one line each ("NS ns1.example.net", "MX 10 mail.example.org"),
   sorted, at most 40. TTLs are left out: they count down between readings and are not a change. */
export function dnsLines(answers: Partial<Record<DnsType, any>>): string[] {
  const out = new Set<string>();
  for (const t of DNS_TYPES) {
    for (const a of Array.isArray(answers?.[t]?.Answer) ? answers[t].Answer : []) {
      const type = DNS_TYPE_NAME[Number(a?.type)];
      if (!type || (type !== t && type !== 'CNAME')) continue;
      let data = String(a?.data ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
      if (type === 'NS' || type === 'CNAME') data = dnsHost(data);
      /* a null MX (host ".") says the domain takes no mail */
      else if (type === 'MX') { const [p, h] = data.split(' '); data = (Number.parseInt(p, 10) || 0) + ' ' + (dnsHost(h) || '.'); }
      const owner = dnsHost(a?.name);
      if (!data) continue;
      if (!DNS_SAFE.test(data) || (type === 'CNAME' && !DNS_SAFE.test(owner))) { out.add(type + ' (not shown, ' + fingerprint(owner + ' ' + data) + ')'); continue; }
      out.add(type === 'CNAME' ? 'CNAME ' + owner + ' ' + data : type + ' ' + data);
    }
  }
  return [...out].sort().slice(0, 40);
}

/** a list said in words: "a", "a and b", "a, b and c", or "a, b, c and 2 more" */
const sayList = (xs: string[], cap = 3) => (xs.length <= cap
  ? (xs.length < 2 ? xs[0] || '' : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1])
  : xs.slice(0, cap).join(', ') + ' and ' + (xs.length - cap) + ' more');

/** the records in plain sentences */
function dnsSnapshot(lines: string[]): string {
  const of = (t: string) => lines.filter(l => l.startsWith(t + ' ') && !NOT_SHOWN.test(l)).map(l => l.slice(t.length + 1));
  const ns = of('NS'), a = of('A'), aaaa = of('AAAA'), cname = of('CNAME'), caa = of('CAA');
  const hidden = lines.filter(l => NOT_SHOWN.test(l)).length;
  const mxAll = of('MX').sort((x, y) => Number.parseInt(x, 10) - Number.parseInt(y, 10) || x.localeCompare(y)).map(m => m.replace(/^\d+ /, ''));
  const mx = mxAll.filter(h => h !== '.');
  const out: string[] = [ns.length ? 'The name servers are ' + sayList(ns) + '.' : 'No name servers answer at this name.'];
  if (cname.length) out.push('It is an alias: ' + sayList(cname.map(c => c.replace(' ', ' points to '))) + '.');
  const v6 = aaaa.length ? (aaaa.length === 1 ? 'one IPv6 address' : aaaa.length + ' IPv6 addresses') : '';
  out.push(a.length || aaaa.length ? 'It points to ' + [a.length ? sayList(a, 2) : '', v6].filter(Boolean).join(', and to ') + '.' : 'It has no address records.');
  out.push(mx.length ? 'Mail goes to ' + sayList(mx, 2) + '.' : mxAll.length ? 'It takes no mail (a null MX record).' : 'It has no mail servers.');
  const issue = caa.filter(c => /^\d+ issue /.test(c)).map(c => c.replace(/^\d+ issue /, '').replace(/"/g, '').split(';')[0].trim());
  out.push(!lines.some(l => l.startsWith('CAA ')) ? 'No CAA record limits which authorities may issue certificates for it.'
    : issue.length && issue.every(i => !i) ? 'Its CAA record lets no authority issue certificates for it.'
    : issue.length ? 'Only ' + sayList([...new Set(issue.filter(Boolean))], 4) + ' may issue certificates for it (CAA).'
    : 'It has a CAA record.');
  if (hidden) out.push(hidden === 1 ? 'One record holds characters this page does not show.' : hidden + ' records hold characters this page does not show.');
  return out.join(' ');
}

/** what changed since an earlier reading of the same domain, or '' when there is none to compare with */
function dnsChanges(prev: Reading | undefined, domain: string, lines: string[]): string {
  if (!prev || prev.kind !== 'dns-records' || prev.subject !== domain || !Array.isArray(prev.held)) return '';
  const before = new Set(prev.held), now = new Set(lines);
  const added = lines.filter(l => !before.has(l)), removed = prev.held.filter(l => !now.has(l));
  if (!added.length && !removed.length) return 'Nothing changed since the reading of ' + prev.read + '.';
  return 'Changed since the reading of ' + prev.read + ':'
    + (added.length ? ' added ' + sayList(added) + (removed.length ? ';' : '.') : '')
    + (removed.length ? ' removed ' + sayList(removed) + '.' : '');
}

/** a domain's DNS records, from Google Public DNS answers for each type: a dated copy that never settles the
   statement, compared with the reading before when there is one */
export function parseDns(answers: Partial<Record<DnsType, any>>, domain: string, url: string, read = today(), prev?: Reading): Reading {
  const held = dnsLines(answers);
  const since = dnsChanges(prev, domain, held);
  return {
    kind: 'dns-records', subject: domain, url, read,
    found: (since ? since + ' ' : '') + dnsSnapshot(held),
    allows: 'open',
    unseen: 'Where each record should point is the project’s to say, and nothing watches while this page is closed. Read it again to compare.',
    held,
  };
}

/* ---------- reading a record: the network ---------- */

export async function readDomainLocks(raw: string): Promise<Reading> {
  const domain = cleanDomain(raw);
  if (!domain) throw new Error('That is not a domain name. Type it as example.org.');
  const url = rdapUrl(domain);
  if (!url) throw new Error('This page reads registry records for ' + READABLE_TLDS.map(t => '.' + t).join(', ') + '. The record for .' + tldOf(domain) + ' cannot be read here yet.');
  const res = await fetch(url, { headers: { accept: 'application/rdap+json, application/json' } });
  if (res.status === 404) throw new Error('The registry has no record for ' + domain + '.');
  if (!res.ok) throw new Error('The registry did not answer (' + res.status + '). Try again later.');
  return parseRdap(await res.json(), domain, url);
}

/** a domain's records from Google Public DNS, one answer per type, compared with the reading before when one is given */
export async function readDnsRecords(raw: string, prev?: Reading): Promise<Reading> {
  const domain = cleanDomain(raw);
  if (!domain) throw new Error('That is not a domain name. Type it as example.org.');
  const answers: Partial<Record<DnsType, any>> = {};
  await Promise.all(DNS_TYPES.map(async (t) => {
    const res = await fetch(DOH + '?name=' + encodeURIComponent(domain) + '&type=' + t);
    if (!res.ok) throw new Error('Google Public DNS did not answer (' + res.status + '). Try again later.');
    answers[t] = await res.json();
  }));
  const status = DNS_TYPES.map(t => Number(answers[t]?.Status));
  if (status.includes(3)) throw new Error('There is no such name in DNS: ' + domain + '.');
  if (status.includes(2)) throw new Error('Google Public DNS could not resolve ' + domain + ' (SERVFAIL). Its name servers may be down, or its DNSSEC signatures may be broken.');
  return parseDns(answers, domain, DOH_VIEW + domain, today(), prev);
}

export async function readMultisig(raw: string, kind: 'multisig-agree' | 'multisig-spare'): Promise<Reading> {
  const address = String(raw || '').trim();
  const type = dashAddressType(address);
  if (!type) throw new Error('That is not a Dash address. A treasury address starts with 7 (a script) or X (one key).');
  const page = 'https://insight.dash.org/insight/address/' + address;
  if (type === 'single') return parseMultisig({ txs: [] }, address, kind, page);
  /* the newest transactions come first; a spend that shows the redeem script is usually within three pages */
  let last: any = { txs: [] };
  for (let p = 0; p < 3; p++) {
    const res = await fetch(INSIGHT + '/txs?address=' + address + '&pageNum=' + p);
    if (!res.ok) throw new Error('The Dash explorer did not answer (' + res.status + '). Try again later.');
    const j = await res.json();
    const r = parseMultisig(j, address, kind, page);
    if (!/has not spent/.test(r.found)) return r;
    last = j;
    if (!j.pagesTotal || p + 1 >= j.pagesTotal) break;
  }
  return parseMultisig(last, address, kind, page);
}

/** a repository's published Scorecard results, read once for every statement that asks; `scanned` is the day of the
   scan read, or '' when the results carry no date */
export async function readScorecard(raw: string, kinds: ScorecardKind[]): Promise<{ subject: string; scanned: string; readings: Partial<Record<ScorecardKind, Reading>> }> {
  const typed = cleanRepo(raw);
  if (!typed) throw new Error('That is not a GitHub repository. Type it as github.com/owner/repo.');
  /* Scorecard keeps GitHub's letter case; when the typed case finds nothing, the lower case is tried once */
  let subject = typed;
  let res = await fetch(SCORECARD_API + subject);
  if (res.status === 404 && subject !== subject.toLowerCase()) { subject = subject.toLowerCase(); res = await fetch(SCORECARD_API + subject); }
  if (res.status === 404) throw new Error('OpenSSF Scorecard has no published results for ' + typed + '. It scans more than a million public repositories each week, and a project can publish its own by running the Scorecard GitHub Action with publish_results set to true. Type the name with the letter case GitHub shows.');
  if (!res.ok) throw new Error('Scorecard did not answer (' + res.status + '). Try again later.');
  const json = await res.json();
  const url = SCORECARD_VIEW + subject;
  const readings: Partial<Record<ScorecardKind, Reading>> = {};
  for (const k of kinds) readings[k] = parseScorecard(json, k, subject, url);
  const scanned = typeof json?.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(json.date) ? json.date.slice(0, 10) : '';
  return { subject, scanned, readings };
}

export const RANK: Record<CheckAnswer, number> = { yes: 3, partly: 2, no: 1, unsure: 1, na: 0 };
/** an answer the record does not allow; an open reading limits nothing */
export const contradicts = (answer: CheckAnswer | undefined, r: Reading | undefined) =>
  !!answer && !!r && answer !== 'na' && r.allows !== 'open' && RANK[answer] > RANK[r.allows];
/** an answer the record backs: a held answer the record allows, or a not-held answer the record confirms */
export const shownBy = (answer: CheckAnswer | undefined, r: Reading | undefined) =>
  !!answer && !!r && answer !== 'na' && r.allows !== 'open' && (RANK[answer] >= 2 ? RANK[answer] <= RANK[r.allows] : r.allows === 'no');
