/* PAXT 1 in the browser: read a document, hash it, and write the one line a wallet signs.

   This is the part of the reference implementation (the protocol folder's paxt/paxt.mjs) that a page needs. It
   must give the same answers as that file; probe-paxt.mts holds both to the same vectors. Nothing here touches a
   key: signing happens in the person's own wallet, and checking a signature happens wherever a Dash message
   verifier is (Dash Core, or a server with Dash's library). */

export const PAXT_VERSION = 'paxt1';
export const VOICES = ['voting', 'owner', 'collateral'] as const;
export type Voice = (typeof VOICES)[number];
export type Kind = 'paxt' | 'poll' | 'election';
export const MAX_DOC_BYTES = 20000;

const ID = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;
const SUB = /^[a-z0-9](?:[a-z0-9-]{0,22}[a-z0-9])?$/;
const WHEN = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}Z)?$/;
/* a byte-order mark some editors put at the start of a file; never part of a document */
const BOM = String.fromCharCode(0xfeff);

/** the one line a wallet signs: paxt1 <id> <choice[+choice]> <32 hex of the document's hash> [#revision] */
export const LINE = /^paxt1 ([a-z0-9-]+(?:\/[a-z0-9-]+)?) ([a-z0-9-]+(?:\+[a-z0-9-]+)*) ([0-9a-f]{32})(?: #([1-9][0-9]{0,2}))?$/;

export interface Terms {
  id: string;
  parent: string | null;
  title: string;
  kind: Kind;
  voice: Voice;
  opens: number;
  closes: number;
  body: string;
  options: string[];
  pick: number;
  threshold?: number;
  seats?: number;
  electorate?: 'list' | 'partners';
  rule?: { type: 'net'; percent: number } | { type: 'majority'; quorum: number };
}

/** the document in its one true form: LF line ends, no trailing spaces, no blank lines at either end, one final LF */
export function canon(doc: string): string {
  const lines = String(doc ?? '').split(BOM).join('').replace(/\r\n?/g, '\n').split('\n').map(l => l.replace(/[ \t]+$/, ''));
  while (lines.length && !lines[0]) lines.shift();
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  return lines.join('\n') + '\n';
}

export async function sha256hex(text: string): Promise<string> {
  const out = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  return [...out].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function digestOf(doc: string): Promise<{ full: string; short: string }> {
  const full = await sha256hex(canon(doc));
  return { full, short: full.slice(0, 32) };
}

function instant(s: string): number {
  if (!WHEN.test(s)) return NaN;
  return Date.parse(s.length === 10 ? s + 'T00:00:00Z' : s.replace('Z', ':00Z'));
}

export function parseDoc(doc: string): { ok: true; terms: Terms } | { ok: false; errors: string[] } {
  const text = canon(doc);
  const errors: string[] = [];
  if (new TextEncoder().encode(text).length > MAX_DOC_BYTES) errors.push('The document is longer than ' + MAX_DOC_BYTES + ' bytes.');
  const cut = text.indexOf('\n---\n');
  if (cut < 0) return { ok: false, errors: ['The header must end with a line holding only three dashes.'] };
  const head = text.slice(0, cut).split('\n');
  const body = text.slice(cut + 5).replace(/\n$/, '');
  if (head[0] !== PAXT_VERSION) errors.push('The first line must be ' + PAXT_VERSION + '.');
  const f: Record<string, string> = {};
  for (const line of head.slice(1)) {
    const m = /^([a-z]+): (.+)$/.exec(line);
    if (!m) { errors.push('Not a header line: ' + JSON.stringify(line.slice(0, 60))); continue; }
    if (m[1] in f) errors.push('The header names ' + m[1] + ' twice.');
    f[m[1]] = m[2];
  }
  const need = (k: string) => { if (!(k in f)) { errors.push('The header needs ' + k + '.'); return ''; } return f[k]; };
  const idRaw = need('id');
  const [id, sub, extra] = idRaw.split('/');
  if (!ID.test(id || '') || extra !== undefined || (sub !== undefined && !SUB.test(sub))) errors.push('id must be 3 to 40 lower-case letters, digits or dashes, with at most one /part for a poll inside a PAXT.');
  const kind = need('kind') as Kind;
  if (kind && !['paxt', 'poll', 'election'].includes(kind)) errors.push('kind must be one of: paxt, poll, election.');
  const voice = need('voice') as Voice;
  if (voice && !VOICES.includes(voice)) errors.push('voice must be one of: ' + VOICES.join(', ') + '.');
  const title = need('title');
  if (title.length > 80) errors.push('title must be 80 characters or fewer.');
  const opens = instant(need('opens')), closes = instant(need('closes'));
  if (Number.isNaN(opens) || Number.isNaN(closes)) errors.push('opens and closes must be dates like 2026-12-01 or 2026-12-01T18:00Z (UTC).');
  else if (closes <= opens) errors.push('closes must come after opens.');
  if (!body.trim()) errors.push('The document needs a body below the dashes.');

  const terms: Terms = { id: idRaw, parent: sub !== undefined ? id : null, title, kind, voice, opens, closes, body, options: [], pick: 1 };
  const known = new Set(['id', 'title', 'kind', 'voice', 'opens', 'closes']);
  const int = (k: string, lo: number, hi: number) => { known.add(k); const val = need(k); const n = /^\d{1,6}$/.test(val) ? Number(val) : NaN; if (!(n >= lo && n <= hi)) errors.push(k + ' must be a whole number from ' + lo + ' to ' + hi + '.'); return n; };
  const list = (k: string) => { known.add(k); const xs = need(k).split(',').map(x => x.trim()).filter(Boolean); if (xs.length < 2 || xs.length > 40 || xs.some(x => !SUB.test(x)) || new Set(xs).size !== xs.length) errors.push(k + ' must be 2 to 40 different names of lower-case letters, digits or dashes, separated by commas.'); return xs; };

  if (kind === 'paxt') {
    if (sub !== undefined) errors.push('A PAXT has a plain id; only a poll or an election sits inside one.');
    terms.threshold = int('threshold', 1, 100000);
    terms.options = ['join', 'leave'];
  } else if (kind === 'poll') {
    terms.options = list('options');
    known.add('rule');
    const rule = need('rule');
    const net = /^net (\d{1,2})$/.exec(rule), maj = /^majority (\d{1,6})$/.exec(rule);
    if (net) {
      terms.rule = { type: 'net', percent: Number(net[1]) };
      if (!(terms.rule.percent >= 1 && terms.rule.percent <= 99)) errors.push('rule net takes a percent from 1 to 99.');
      if (!terms.options.includes('yes') || !terms.options.includes('no')) errors.push('rule net needs the options yes and no.');
    } else if (maj) terms.rule = { type: 'majority', quorum: Number(maj[1]) };
    else errors.push('rule must be "net <percent>" or "majority <quorum>".');
  } else if (kind === 'election') {
    terms.options = list('options');
    terms.seats = int('seats', 1, 39);
    terms.pick = int('pick', 1, 40);
    if (terms.options.length && terms.seats >= terms.options.length) errors.push('seats must be fewer than the candidates.');
    if (terms.options.length && terms.pick > terms.options.length) errors.push('pick cannot be more than the candidates.');
  }
  if (kind === 'poll' || kind === 'election') {
    known.add('electorate');
    terms.electorate = (f.electorate || 'list') as 'list' | 'partners';
    if (!['list', 'partners'].includes(terms.electorate)) errors.push('electorate must be list (every masternode) or partners (the keys that joined the PAXT this sits inside).');
    if (terms.electorate === 'partners' && sub === undefined) errors.push('electorate partners needs an id of the form <paxt>/<name>.');
  }
  for (const k of Object.keys(f)) if (!known.has(k)) errors.push('The header has a line this version does not know: ' + k + '.');
  return errors.length ? { ok: false, errors } : { ok: true, terms };
}

export function ballotLine(b: { id: string; choices: string[]; digest: string; rev?: number }): string {
  const cs = [...new Set(b.choices)].sort();
  const rev = b.rev ?? 1;
  return PAXT_VERSION + ' ' + b.id + ' ' + cs.join('+') + ' ' + b.digest + (rev > 1 ? ' #' + rev : '');
}

export function parseLine(line: string): { id: string; choices: string[]; digest: string; rev: number } | null {
  const m = LINE.exec(String(line ?? ''));
  if (!m) return null;
  const choices = m[2].split('+');
  if (new Set(choices).size !== choices.length) return null;
  if ([...choices].sort().join('+') !== m[2]) return null;
  return { id: m[1], choices, digest: m[3], rev: m[4] ? Number(m[4]) : 1 };
}
