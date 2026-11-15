/* STEPSAFE READS ITSELF (views/TrustView.tsx). StepSAFE's own record asks the site it runs on for StepSAFE's own
   promises and says which hold: the security.txt, the headers the app's page comes with, every site this visit has
   reached, what this browser keeps for StepSAFE, and the bill of materials, with the known flaws in it read from
   OSV.dev on a second press. A reading shows the moment it was taken, not the practice behind it.

   Parsing is pure and is tested in probe-selfread.mts against the site's own files and against broken copies of
   them. The reads are at the foot of this file. Each asks this site only, except the flaws, which ask OSV.dev, and
   none sends a cookie. The page shows the names and sizes of what this browser keeps, never what is in it. */

import { HOST_NAMES, STORE_NAMES } from '../content/own';

export type SelfMark = 'shown' | 'gap' | 'unread';
export type SelfId = 'disclosure' | 'scripts' | 'framing' | 'https' | 'referrer' | 'powers' | 'hosts' | 'device' | 'parts' | 'flaws';
export interface SelfFinding { id: SelfId; mark: SelfMark; title: string; line: string; from: string }

/** the promises, in the order the page reads them */
export const SELF_TITLES: Record<SelfId, string> = {
  disclosure: 'A flaw can be reported privately',
  scripts: 'Pages run this site’s scripts only',
  framing: 'No other site can frame these pages',
  https: 'Every visit stays on HTTPS',
  referrer: 'Links out do not say where you came from',
  powers: 'The camera, location and payments are off',
  hosts: 'This visit reached only the sites the privacy page names',
  device: 'What this browser keeps for StepSAFE',
  parts: 'Every package that ships is listed',
  flaws: 'No known flaw in what ships',
};
export const SELF_FROM: Record<SelfId, string> = {
  disclosure: '/.well-known/security.txt',
  scripts: 'the Content-Security-Policy header',
  framing: 'the Content-Security-Policy and X-Frame-Options headers',
  https: 'the Strict-Transport-Security header',
  referrer: 'the Referrer-Policy header',
  powers: 'the Permissions-Policy header',
  hosts: 'your browser’s list of what this visit loaded',
  device: 'this browser’s storage for this site',
  parts: '/sbom.cdx.json',
  flaws: 'OSV.dev',
};
const find = (id: SelfId, mark: SelfMark, line: string): SelfFinding => ({ id, mark, title: SELF_TITLES[id], line, from: SELF_FROM[id] });

const DAY = 864e5;
const pad = (n: number) => String(n).padStart(2, '0');
/** a day as YYYY-MM-DD, in UTC, the way security.txt writes it */
export const dayOf = (ms: number) => { const d = new Date(ms); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); };
/** a moment as the visitor's own clock shows it */
export const timeOf = (ms: number) => { const d = new Date(ms); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' at ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const plural = (n: number, one: string, many = one + 's') => n + ' ' + (n === 1 ? one : many);

/* ---------- security.txt ---------- */

export interface SecurityTxt { contact: string[]; expires: string; expiresCount: number; policy: string; canonical: string; languages: string }

export function parseSecurityTxt(text: string): SecurityTxt {
  const out: SecurityTxt = { contact: [], expires: '', expiresCount: 0, policy: '', canonical: '', languages: '' };
  for (const raw of String(text || '').slice(0, 32768).split(/\r?\n/)) {
    if (raw.trimStart().startsWith('#')) continue;
    const m = /^\s*([A-Za-z-]+)\s*:\s*(\S.*?)\s*$/.exec(raw);
    if (!m) continue;
    const k = m[1].toLowerCase(), v = m[2].slice(0, 500);
    if (k === 'contact') out.contact.push(v);
    else if (k === 'expires') { out.expiresCount++; if (!out.expires) out.expires = v; }
    else if (k === 'policy' && !out.policy) out.policy = v;
    else if (k === 'canonical' && !out.canonical) out.canonical = v;
    else if (k === 'preferred-languages' && !out.languages) out.languages = v;
  }
  return out;
}

export function disclosureFinding(st: SecurityTxt | null, now: number): SelfFinding {
  const f = (mark: SelfMark, line: string) => find('disclosure', mark, line);
  if (!st) return f('gap', 'This site has no security.txt.');
  const contact = st.contact.find((c) => /^(mailto:|https:\/\/)/i.test(c));
  if (!contact) return f('gap', 'security.txt names no contact.');
  if (/\[\[|\]\]/.test(contact)) return f('gap', 'security.txt is here, but its contact is not filled in yet.');
  if (st.expiresCount !== 1) return f('gap', st.expiresCount ? 'security.txt gives its Expires date more than once.' : 'security.txt gives no Expires date.');
  const exp = Date.parse(st.expires);
  if (!Number.isFinite(exp)) return f('gap', 'The Expires date in security.txt cannot be read.');
  if (exp <= now) return f('gap', 'security.txt expired on ' + dayOf(exp) + '.');
  const days = Math.ceil((exp - now) / DAY);
  if (days > 366) return f('gap', 'security.txt is set to expire ' + days + ' days from now. RFC 9116 advises less than a year.');
  const who = contact.replace(/^mailto:/i, '');
  return f('shown', 'Reports go to ' + who + (st.policy ? ', under the policy at ' + st.policy : '') + '. The file is good until ' + dayOf(exp) + ', ' + plural(days, 'day') + ' from now.');
}

/* ---------- the headers the app's page comes with ---------- */

/** a Content-Security-Policy as its directives; the first of a name counts, as in a browser */
export function cspOf(csp: string): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const part of String(csp || '').split(';')) {
    const [name, ...vals] = part.trim().split(/\s+/);
    if (name && !m.has(name.toLowerCase())) m.set(name.toLowerCase(), vals);
  }
  return m;
}
const SELF_SOURCE = (v: string) => v === "'self'" || /^'(sha256|sha384|sha512)-[A-Za-z0-9+/=]+'$/.test(v) || /^'nonce-[A-Za-z0-9+/=]+'$/.test(v);

export function scriptsFinding(csp: string | null): SelfFinding {
  const f = (mark: SelfMark, line: string) => find('scripts', mark, line);
  if (!csp) return f('gap', 'This page came with no Content-Security-Policy header.');
  const d = cspOf(csp);
  const src = d.get('script-src') || d.get('default-src');
  if (!src || !src.length) return f('gap', 'The security policy sets no limit on scripts.');
  const others = src.filter((v) => !SELF_SOURCE(v));
  if (others.length) return f('gap', 'The security policy also lets scripts in from: ' + others.join(', ') + '.');
  const plug = d.get('object-src');
  return f('shown', 'The security policy lets a page run only scripts loaded from this site. A script written into a page, or loaded from anywhere else, does not run.'
    + (plug && plug.length === 1 && plug[0] === "'none'" ? ' Plugins are refused too.' : ''));
}

export function framingFinding(csp: string | null, xfo: string | null): SelfFinding {
  const fa = cspOf(csp || '').get('frame-ancestors');
  const none = !!fa && fa.length === 1 && fa[0] === "'none'";
  const deny = /^\s*deny\s*$/i.test(xfo || '');
  if (!none && !deny) return find('framing', 'gap', 'Nothing in the headers stops another site from showing StepSAFE inside its own page.');
  return find('framing', 'shown', 'The headers forbid any other site from showing StepSAFE inside its own page'
    + (none && deny ? ', in both the security policy and X-Frame-Options' : '') + '. That stops a page elsewhere from laying its own buttons over StepSAFE’s.');
}

export function httpsFinding(hsts: string | null): SelfFinding {
  const m = /max-age\s*=\s*"?(\d+)"?/i.exec(hsts || '');
  if (!hsts || !m) return find('https', 'gap', 'This page came without the header that keeps browsers on HTTPS.');
  const days = Math.floor(Number(m[1]) / 86400);
  if (days < 365) return find('https', 'gap', 'Browsers are told to keep to HTTPS here for only ' + plural(days, 'day') + '.');
  return find('https', 'shown', 'Browsers are told to use only HTTPS here for the next ' + plural(days, 'day') + (/includesubdomains/i.test(hsts) ? ', on every subdomain too' : '') + '.');
}

export function referrerFinding(rp: string | null): SelfFinding {
  /* a list names fallbacks: the last one the browser knows is the one it uses */
  const last = String(rp || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean).pop() || '';
  if (last === 'no-referrer' || last === 'same-origin') return find('referrer', 'shown', 'When you follow a link out of StepSAFE, the other site is not told which page you came from.');
  return find('referrer', 'gap', last ? 'The referrer policy is ' + last + ', so another site can learn which StepSAFE page sent you.' : 'No referrer policy was sent, so the browser’s own default applies.');
}

const POWER_WORDS: Record<string, string> = { camera: 'the camera', geolocation: 'your location', payment: 'payments' };
export function powersFinding(pp: string | null): SelfFinding {
  const pairs = new Map<string, string>();
  for (const part of String(pp || '').split(',')) {
    const m = /^\s*([a-z-]+)\s*=\s*\(([^)]*)\)\s*$/i.exec(part);
    if (m && !pairs.has(m[1].toLowerCase())) pairs.set(m[1].toLowerCase(), m[2].trim());
  }
  const on = Object.keys(POWER_WORDS).filter((k) => pairs.get(k) !== '');
  if (on.length) return find('powers', 'gap', 'The permissions header does not switch off ' + on.map((k) => POWER_WORDS[k]).join(', ') + '.');
  const mic = pairs.get('microphone');
  return find('powers', 'shown', 'The camera, your location and payments are switched off for every page.'
    + (mic === 'self' ? ' The microphone is allowed for this site only, for a voice call with a guide.' : mic === '' ? ' So is the microphone.' : ''));
}

/* ---------- the sites this visit has reached ---------- */

export function nameOfHost(host: string): string | null {
  if (Object.prototype.hasOwnProperty.call(HOST_NAMES, host)) return HOST_NAMES[host];
  for (const k of Object.keys(HOST_NAMES)) if (k.startsWith('*.') && host.endsWith(k.slice(1))) return HOST_NAMES[k];
  return null;
}

export interface Reached { host: string; name: string | null }
export function hostsReached(urls: string[], here: string): Reached[] {
  const seen = new Map<string, string | null>();
  for (const u of urls) {
    let host = '';
    try { const x = new URL(u); if (x.protocol !== 'https:' && x.protocol !== 'http:') continue; host = x.host; } catch { continue; }
    if (!seen.has(host)) seen.set(host, host === here ? 'this site' : nameOfHost(host));
  }
  return [...seen].map(([host, name]) => ({ host, name }))
    .sort((a, b) => (a.host === here ? -1 : b.host === here ? 1 : a.host < b.host ? -1 : 1));
}

/* The browser lists a load the security policy refused too, with no time, no bytes and no status: it never left the
   browser. Vercel's preview pages write in a toolbar script from vercel.live, and the policy refuses it. Such a load
   is told apart, so the page never says a visit reached a site it was kept from. */
export interface Loaded { name: string; duration: number; transferSize: number; responseStatus?: number }
export function splitLoaded(entries: Loaded[]): { sent: string[]; stopped: string[] } {
  const sent: string[] = [], stopped: string[] = [];
  for (const e of entries) (e.duration > 0 || e.transferSize > 0 || (e.responseStatus || 0) > 0 ? sent : stopped).push(e.name);
  return { sent, stopped };
}

export function hostsFinding(list: Reached[], here: string, full: boolean, stopped: Reached[] = []): SelfFinding {
  const unknown = list.filter((x) => !x.name);
  const others = list.filter((x) => x.name && x.host !== here);
  const kept = stopped.filter((s) => s.host !== here && !list.some((x) => x.host === s.host));
  const refused = kept.length ? ' The security policy stopped every request to ' + kept.map((x) => x.host).join(', ') + ' before it left your browser.' : '';
  const tail = refused + (full ? ' Your browser’s list of what this visit loaded is full, so a site reached since may be missing.' : '');
  if (unknown.length) return find('hosts', 'gap', 'This visit reached ' + plural(unknown.length, 'site') + ' the privacy page does not name: ' + unknown.map((x) => x.host).join(', ') + '.' + tail);
  return find('hosts', 'shown', (others.length
    ? 'Besides this site, this visit has reached ' + plural(others.length, 'site') + ': ' + others.map((x) => x.name + ' (' + x.host + ')').join('; ') + '.'
    : 'This visit has reached no site but this one.') + tail);
}

/* ---------- what this browser keeps for StepSAFE ---------- */

export type KeyState = 'session' | 'open' | 'locked' | 'unavailable';
export interface StoreScan { items: { key: string; label: string; bytes: number }[]; shaped: string[]; sealed: 'none' | 'sealed' | 'bad'; rounds: number }

/* text that looks like a key for a service StepSAFE connects to. The page says where such text sits, never what it is. */
const KEY_SHAPED = /sk-ant-[A-Za-z0-9_-]{20,}|(?<![A-Za-z0-9])sk_[a-f0-9]{40,}/;
const SEALED_FIELDS = ['ct', 'iv', 'kdf', 'rounds', 'salt', 'v'];

export function scanStore(entries: [string, string][]): StoreScan {
  const out: StoreScan = { items: [], shaped: [], sealed: 'none', rounds: 0 };
  for (const [key, value] of entries.slice(0, 500)) {
    const label = Object.prototype.hasOwnProperty.call(STORE_NAMES, key) ? STORE_NAMES[key] : key.startsWith('stepsafe-') ? 'a StepSAFE setting (' + key + ')' : 'something StepSAFE did not write (' + key + ')';
    out.items.push({ key, label, bytes: (key.length + value.length) * 2 });
    if (key === 'stepsafe-keys-v1') {
      let s: any = null;
      try { s = JSON.parse(value); } catch { s = null; }
      const fields = s && typeof s === 'object' ? Object.keys(s).sort() : [];
      const ok = fields.join(',') === SEALED_FIELDS.join(',') && s.v === 1 && s.kdf === 'PBKDF2-SHA256' && Number(s.rounds) >= 100000
        && [s.ct, s.iv, s.salt].every((x: unknown) => typeof x === 'string' && /^[A-Za-z0-9+/=]+$/.test(x));
      out.sealed = ok ? 'sealed' : 'bad';
      if (ok) out.rounds = Number(s.rounds);
    } else if (KEY_SHAPED.test(value)) out.shaped.push(label);
  }
  return out;
}

export function deviceFinding(scan: StoreScan, keys: KeyState, cookie: string, offline: number | null): SelfFinding {
  const gaps: string[] = [];
  const parts: string[] = [];
  const kb = Math.max(1, Math.round(scan.items.reduce((n, x) => n + x.bytes, 0) / 1024));
  parts.push(scan.items.length
    ? 'This browser keeps ' + plural(scan.items.length, 'item') + ' for StepSAFE, about ' + kb + ' KB: ' + scan.items.map((x) => x.label).join(', ') + '.'
    : 'This browser keeps nothing for StepSAFE yet.');
  if (scan.sealed === 'bad') gaps.push('The kept keys are not in the sealed form StepSAFE writes.');
  else if (scan.sealed === 'sealed') parts.push('Your keys are kept sealed with AES-256-GCM, under a key drawn from your passphrase by ' + scan.rounds.toLocaleString('en-US') + ' rounds of PBKDF2-SHA256, and they are ' + (keys === 'open' ? 'open for this visit.' : 'locked.'));
  else parts.push(keys === 'unavailable' ? 'This browser cannot seal keys, so none is kept.' : 'No key is kept. A key you paste is held in this page’s memory for this visit only.');
  if (scan.shaped.length) gaps.push('Text shaped like a service key sits in plain text in ' + scan.shaped.join(', ') + '. StepSAFE does not put a key there. Clearing this site’s data in your browser removes it.');
  const cookies = String(cookie || '').split(';').map((c) => c.split('=')[0].trim()).filter(Boolean);
  if (cookies.length) gaps.push('This page can read ' + plural(cookies.length, 'cookie') + ' (' + cookies.join(', ') + '), and StepSAFE sets none.');
  else parts.push('No cookie is set that this page can read.');
  if (offline != null && offline > 0) parts.push('The browser also keeps ' + plural(offline, 'of StepSAFE’s files', 'of StepSAFE’s files') + ' so the app opens without a signal.');
  return find('device', gaps.length ? 'gap' : 'shown', [...gaps, ...parts].join(' '));
}

/* ---------- the bill of materials, and the known flaws in it ---------- */

export interface SbomPart { name: string; version: string; license: string; supplier: string; purl: string }
export interface Sbom { spec: string; timestamp: string; parts: SbomPart[] }

export function parseSbom(json: unknown): Sbom | null {
  const j = json as any;
  if (!j || typeof j !== 'object' || j.bomFormat !== 'CycloneDX' || !Array.isArray(j.components) || j.components.length > 500) return null;
  const parts: SbomPart[] = j.components
    .filter((c: any) => c && typeof c.name === 'string' && typeof c.version === 'string')
    .map((c: any) => ({
      name: c.name.slice(0, 120), version: c.version.slice(0, 60),
      license: String(c.licenses?.[0]?.license?.id || c.licenses?.[0]?.license?.name || '').slice(0, 60),
      supplier: String(c.supplier?.name || '').slice(0, 120),
      purl: typeof c.purl === 'string' ? c.purl.slice(0, 300) : '',
    }));
  return { spec: String(j.specVersion || '').slice(0, 10), timestamp: String(j.metadata?.timestamp || '').slice(0, 40), parts };
}

export function partsFinding(sbom: Sbom | null): SelfFinding {
  if (!sbom) return find('parts', 'gap', 'There is no readable bill of materials at /sbom.cdx.json.');
  if (!sbom.parts.length) return find('parts', 'gap', 'The bill of materials lists no package.');
  const thin = sbom.parts.filter((p) => !p.supplier || !/^pkg:/.test(p.purl)).map((p) => p.name);
  const when = Date.parse(sbom.timestamp);
  const pk = npmParts(sbom.parts);
  const files = sbom.parts.filter((p) => !pk.includes(p));
  const families = [...new Set(files.map((p) => p.name.replace(/ \d{3}$/, '')))];
  const list = 'StepSAFE ships ' + plural(pk.length, 'open-source package') + (pk.length ? ' (' + pk.map((p) => p.name + ' ' + p.version).join(', ') + ')' : '')
    + (files.length ? ' and ' + plural(files.length, 'font file') + ' (' + families.join(', ') + ')' : '') + '.';
  if (thin.length) return find('parts', 'gap', list + ' The list gives no supplier or no package id for ' + thin.join(', ') + '.');
  return find('parts', 'shown', list + ' The list is a CycloneDX ' + (sbom.spec || '') + ' bill of materials'
    + (Number.isFinite(when) ? ', written ' + dayOf(when) : '') + ', with a supplier, a version and an id for each.');
}

/** the npm packages in a bill of materials: what OSV.dev can be asked about (it keeps no record of font files) */
export const npmParts = (parts: SbomPart[]) => parts.filter((p) => p.purl.startsWith('pkg:npm/'));

export const OSV_BATCH = 'https://api.osv.dev/v1/querybatch';
export const osvBody = (parts: SbomPart[]) => ({ queries: parts.map((p) => ({ package: { ecosystem: 'npm', name: p.name }, version: p.version })) });

export interface Flaw { name: string; version: string; ids: string[] }
export function parseOsv(json: unknown, parts: SbomPart[]): Flaw[] | null {
  const r = (json as any)?.results;
  if (!Array.isArray(r) || r.length !== parts.length) return null;
  const out: Flaw[] = [];
  r.forEach((x: any, i: number) => {
    const ids = (Array.isArray(x?.vulns) ? x.vulns : []).map((y: any) => String(y?.id || ''))
      .filter((id: string) => /^[A-Za-z0-9][A-Za-z0-9._:-]{2,63}$/.test(id)).slice(0, 20);
    if (ids.length) out.push({ name: parts[i].name, version: parts[i].version, ids });
  });
  return out;
}

export function flawsFinding(flaws: Flaw[] | null, n: number, at: number): SelfFinding {
  if (!flaws) return find('flaws', 'unread', 'OSV.dev’s answer could not be read.');
  if (!flaws.length) return find('flaws', 'shown', 'OSV.dev knows of no flaw in any of the ' + plural(n, 'package') + ', as of ' + timeOf(at) + '.');
  return find('flaws', 'gap', 'OSV.dev lists known flaws in ' + flaws.length + ' of the ' + plural(n, 'package') + ': '
    + flaws.map((f) => f.name + ' ' + f.version + ' (' + f.ids.join(', ') + ')').join('; ') + '. Read on ' + timeOf(at) + '.');
}

/* ---------- a whole reading ---------- */

export interface SelfReading { at: number; origin: string; findings: SelfFinding[]; parts: SbomPart[] }

export function tally(list: SelfFinding[]) {
  return { shown: list.filter((f) => f.mark === 'shown').length, gap: list.filter((f) => f.mark === 'gap').length, unread: list.filter((f) => f.mark === 'unread').length };
}

const MARK_WORDS: Record<SelfMark, string> = { shown: 'Holds', gap: 'Does not hold', unread: 'Not read' };
/** the reading as Markdown, for a reviewer to keep */
/** the reading as Markdown; `more` is a section of its own (the page adds OpenSSF Scorecard's readings), set after
   the findings */
export function readingText(r: SelfReading, flaws: SelfFinding | null, more: string[] = []): string {
  const list = flaws ? [...r.findings, flaws] : r.findings;
  return ['# StepSAFE’s own record', '',
    'Read in a browser from ' + r.origin + ' on ' + timeOf(r.at) + '. A reading shows that moment, not the practice behind it.', '',
    ...list.map((f) => '- **' + f.title + '.** ' + MARK_WORDS[f.mark] + '. ' + f.line + ' Read from ' + f.from + '.'),
    ...(more.length ? ['', ...more] : []),
    '', 'Read it again at ' + r.origin + '/trust', ''].join('\n');
}

/* ---------- the reads ---------- */

/** the size StepSAFE asks the browser to keep its list of loaded files at, set when the app starts (main.tsx) */
export const LOADED_LIST_SIZE = 1000;

async function fetchCapped(url: string, init: RequestInit = {}, ms = 8000): Promise<Response> {
  const ctl = new AbortController();
  const t = window.setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { cache: 'no-store', credentials: 'omit', ...init, signal: ctl.signal }); }
  finally { window.clearTimeout(t); }
}
const textCapped = async (r: Response, max: number) => (await r.text()).slice(0, max);

async function offlineFiles(): Promise<number | null> {
  try {
    if (typeof caches === 'undefined') return null;
    let n = 0;
    for (const name of await caches.keys()) if (name.startsWith('stepsafe')) n += (await (await caches.open(name)).keys()).length;
    return n;
  } catch { return null; }
}

/** every read but the flaws, from this site only */
export async function readSelf(keys: KeyState): Promise<SelfReading> {
  const at = Date.now();
  const here = location.host;
  const [st, head, sbom, offline] = await Promise.allSettled([
    fetchCapped('/.well-known/security.txt').then(async (r) => (r.ok && /text\/plain/i.test(r.headers.get('content-type') || '') ? parseSecurityTxt(await textCapped(r, 32768)) : null)),
    fetchCapped('/', { method: 'HEAD' }),
    fetchCapped('/sbom.cdx.json').then(async (r) => (r.ok ? parseSbom(JSON.parse(await textCapped(r, 262144))) : null)),
    offlineFiles(),
  ]);
  const unread = (id: SelfId) => find(id, 'unread', 'Could not be read just now. Try again in a moment.');
  const findings: SelfFinding[] = [];
  findings.push(st.status === 'fulfilled' ? disclosureFinding(st.value, at) : unread('disclosure'));
  if (head.status === 'fulfilled' && head.value.ok) {
    const h = head.value.headers;
    const csp = h.get('content-security-policy');
    findings.push(scriptsFinding(csp), framingFinding(csp, h.get('x-frame-options')), httpsFinding(h.get('strict-transport-security')),
      referrerFinding(h.get('referrer-policy')), powersFinding(h.get('permissions-policy')));
  } else findings.push(unread('scripts'), unread('framing'), unread('https'), unread('referrer'), unread('powers'));
  const loaded = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const { sent, stopped } = splitLoaded(loaded.map((e) => ({ name: e.name, duration: e.duration, transferSize: e.transferSize, responseStatus: (e as PerformanceResourceTiming & { responseStatus?: number }).responseStatus })));
  findings.push(hostsFinding(hostsReached([location.href, ...sent], here), here, loaded.length >= LOADED_LIST_SIZE, hostsReached(stopped, here)));
  const entries: [string, string][] = [];
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k != null) entries.push([k, localStorage.getItem(k) || '']); } } catch { /* storage blocked: nothing to list */ }
  findings.push(deviceFinding(scanStore(entries), keys, document.cookie, offline.status === 'fulfilled' ? offline.value : null));
  const bom = sbom.status === 'fulfilled' ? sbom.value : null;
  findings.push(sbom.status === 'fulfilled' ? partsFinding(bom) : unread('parts'));
  return { at, origin: location.origin, findings, parts: bom ? bom.parts : [] };
}

/** the known flaws in what ships, asked of OSV.dev: the one read that leaves this site */
export async function readFlaws(all: SbomPart[]): Promise<SelfFinding> {
  const at = Date.now();
  const parts = npmParts(all);
  if (!parts.length) return find('flaws', 'unread', 'There is no bill of materials to ask about.');
  try {
    const r = await fetchCapped(OSV_BATCH, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(osvBody(parts)) }, 12000);
    if (!r.ok) return find('flaws', 'unread', 'OSV.dev answered ' + r.status + '. Try again in a moment.');
    return flawsFinding(parseOsv(JSON.parse(await textCapped(r, 262144)), parts), parts.length, at);
  } catch {
    return find('flaws', 'unread', 'OSV.dev could not be reached just now. Try again in a moment.');
  }
}
