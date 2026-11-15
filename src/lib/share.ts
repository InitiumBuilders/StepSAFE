/* A PRAXIS PROFILE YOU CAN ACTUALLY SHOW.

   Export makes a record survivable. This makes it showable: a compact summary
   is compressed and packed into the URL fragment, so a link renders a read-only
   profile with no server, no account, and no database.

   The fragment matters. Everything after '#' is never sent to the server in an
   HTTP request, so the record is not logged by our host, by Vercel, or by any
   proxy in between — it is decoded entirely in the reader's browser.

   HONESTY, ENFORCED IN THE UI AS WELL AS HERE: a link like this is
   SELF-ATTESTED. The holder generated it, so a determined person could hand-
   craft one. It is a portfolio, not a verified credential. The verifiable
   version is the Intuition attestation, where the claim is signed and staked on
   a public graph — and the shared page says exactly that rather than implying a
   guarantee it cannot make. */

import type { ModuxGauge } from '../content/modux-schema';

export interface SharedPage {
  title: string;
  credential: string;
  chapter: string;
}

export interface SharedProfile {
  v: 1;
  handle: string;
  rank: string;
  phase: string;
  respect: number;
  trust: number;
  steps: number;
  pages: SharedPage[];
  chapters: string[];
  awards: { name: string; tier: string; glyph: string }[];
  sims: number;
  streak: number;
  /** Modux gauges: optional so older links still open */
  gratus?: number;
  gratusGold?: number;
  topNotch?: number;
  /** the Unitium Code Name and the mantra travel; the log stays on the device */
  codeName?: string;
  mantra?: string;
  /** the service record: people held for and hours of service kept, counted by the model */
  people?: number;
  hoursKept?: number;
  gaugesHeld?: number;
  /** StudyMode: cards held in the top boxes, and whole UNITIA earned */
  cardsHeld?: number;
  unitia?: number;
  wallet?: string;
  at: string;
}

/* base64url so the payload survives being pasted into chat apps and mail */
function toB64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deflate(text: string): Promise<Uint8Array | null> {
  if (typeof CompressionStream === 'undefined') return null;
  const cs = new CompressionStream('deflate-raw');
  const encoded = new TextEncoder().encode(text);
  const buf = new ArrayBuffer(encoded.byteLength);
  new Uint8Array(buf).set(encoded);
  const stream = new Blob([buf]).stream().pipeThrough(cs);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function inflate(bytes: Uint8Array): Promise<string | null> {
  if (typeof DecompressionStream === 'undefined') return null;
  try {
    const ds = new DecompressionStream('deflate-raw');
    /* copy into a plain ArrayBuffer — a Uint8Array may be backed by a
       SharedArrayBuffer, which BlobPart does not accept */
    const buf = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buf).set(bytes);
    const stream = new Blob([buf]).stream().pipeThrough(ds);
    return await new Response(stream).text();
  } catch {
    return null;
  }
}

/** Encode a profile into a shareable fragment. 'z' = compressed, 'r' = raw. */
export async function encodeProfile(p: SharedProfile): Promise<string> {
  const json = JSON.stringify(p);
  const packed = await deflate(json);
  if (packed) return 'z' + toB64Url(packed);
  return 'r' + toB64Url(new TextEncoder().encode(json));
}

export async function decodeProfile(fragment: string): Promise<SharedProfile | null> {
  try {
    const mode = fragment[0];
    const body = fragment.slice(1);
    const bytes = fromB64Url(body);
    const json = mode === 'z' ? await inflate(bytes) : new TextDecoder().decode(bytes);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (parsed?.v !== 1 || typeof parsed.handle !== 'string') return null;
    return parsed as SharedProfile;
  } catch {
    return null;
  }
}

/* ---------- a gauge in a link ---------- */

const NODE_KINDS = new Set(['people', 'identity', 'network', 'data', 'build', 'money', 'control', 'model', 'public', 'time', 'vendor']);
const str = (x: unknown, max: number) => (typeof x === 'string' ? x.slice(0, max) : '');

/** Read a gauge out of untrusted JSON: shapes checked, sizes capped, counters kept only
    when the catalog knows them, and the origin set to forged whatever the link said. */
export function sanitizeGauge(raw: unknown, knownModel: (id: string) => boolean): ModuxGauge | null {
  if (!raw || typeof raw !== 'object') return null;
  const g = raw as Record<string, unknown>;
  const sys = g.system as { nodes?: unknown; edges?: unknown } | undefined;
  if (!Array.isArray(g.threats) || !sys || !Array.isArray(sys.nodes) || !Array.isArray(sys.edges)) return null;
  const nodes = (sys.nodes as unknown[]).slice(0, 16).map(n => {
    const x = n as Record<string, unknown>;
    return { id: str(x.id, 24), name: str(x.name, 48), kind: str(x.kind, 12) as ModuxGauge['system']['nodes'][number]['kind'] };
  }).filter(n => n.id && n.name && NODE_KINDS.has(n.kind));
  const ids = new Set(nodes.map(n => n.id));
  const edges = (sys.edges as unknown[]).slice(0, 40).map(e => {
    const x = e as Record<string, unknown>;
    return { from: str(x.from, 24), to: str(x.to, 24), how: str(x.how, 40) || 'reaches' };
  }).filter(e => ids.has(e.from) && ids.has(e.to) && e.from !== e.to);
  const threats = (g.threats as unknown[]).slice(0, 12).map((t, i) => {
    const x = t as Record<string, unknown>;
    const counters = Array.isArray(x.counters) ? (x.counters as unknown[]).filter((c): c is string => typeof c === 'string' && knownModel(c)).slice(0, 12) : [];
    const w = Number(x.weight);
    return {
      id: str(x.id, 8) || String.fromCharCode(97 + i), name: str(x.name, 80), move: str(x.move, 300), counters,
      weight: Number.isFinite(w) ? Math.max(1, Math.min(3, Math.round(w))) : 2, target: str(x.target, 24),
      ...(x.open === true ? { open: true } : {}), ...(typeof x.pressure === 'string' ? { pressure: str(x.pressure, 24) } : {}),
    };
  }).filter(t => t.name && ids.has(t.target) && (t.open || t.counters.length > 0));
  const budget = Number(g.budget);
  if (nodes.length < 2 || threats.length < 1 || !Number.isFinite(budget)) return null;
  const expert = Array.isArray(g.expert) ? (g.expert as unknown[]).filter((c): c is string => typeof c === 'string' && knownModel(c)).slice(0, 24) : [];
  const essence = str(g.essence, 8);
  return {
    id: (str(g.id, 32) || 'sh-' + Math.abs(hashOf(JSON.stringify(nodes) + JSON.stringify(threats))).toString(36)).replace(/[^a-z0-9-]/gi, ''),
    title: str(g.title, 80) || 'A shared gauge', org: str(g.org, 60) || 'An organisation', sector: str(g.sector, 120),
    brief: str(g.brief, 600), adversary: str(g.adversary, 120) || 'Whoever finds the weakest part first',
    budget: Math.max(1, Math.min(99, Math.round(budget))), threats, expert, debrief: str(g.debrief, 600),
    essence: (['cyan', 'azure', 'violet', 'ember', 'gold'].includes(essence) ? essence : 'cyan') as ModuxGauge['essence'],
    system: { nodes, edges }, tags: Array.isArray(g.tags) ? (g.tags as unknown[]).filter((t): t is string => typeof t === 'string').slice(0, 8) : [],
    origin: 'forged', seed: g.seed === 'own' ? 'own' : 'shared',
  };
}

function hashOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h | 0;
}

export interface SharedGauge { gauge: ModuxGauge; by?: string; best?: { notch: number; hoursKept: number } }

export async function encodeGauge(g: ModuxGauge, extra: { by?: string; best?: { notch: number; hoursKept: number } } = {}): Promise<string> {
  const json = JSON.stringify({ v: 2, g, ...(extra.by ? { by: extra.by } : {}), ...(extra.best ? { best: extra.best } : {}) });
  const packed = await deflate(json);
  if (packed) return 'z' + toB64Url(packed);
  return 'r' + toB64Url(new TextEncoder().encode(json));
}

export async function decodeGauge(fragment: string, knownModel: (id: string) => boolean): Promise<SharedGauge | null> {
  try {
    const mode = fragment[0];
    const bytes = fromB64Url(fragment.slice(1));
    const json = mode === 'z' ? await inflate(bytes) : new TextDecoder().decode(bytes);
    if (!json) return null;
    const parsed = JSON.parse(json);
    /* a bare gauge from the first links, or the wrapper */
    const raw = parsed && typeof parsed === 'object' && 'g' in parsed ? parsed.g : parsed;
    const gauge = sanitizeGauge(raw, knownModel);
    if (!gauge) return null;
    const out: SharedGauge = { gauge };
    if (parsed && typeof parsed === 'object' && 'g' in parsed) {
      const by = typeof parsed.by === 'string' ? parsed.by.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 40) : '';
      if (by) out.by = by;
      const b = parsed.best;
      if (b && typeof b === 'object') {
        const notch = Number(b.notch), hk = Number(b.hoursKept);
        if (Number.isFinite(notch) && Number.isFinite(hk)) out.best = { notch: Math.max(0, Math.min(40, Math.round(notch))), hoursKept: Math.max(0, Math.min(24, Math.round(hk * 10) / 10)) };
      }
    }
    return out;
  } catch {
    return null;
  }
}

/* ---------- a run in a link: the gauge it was on, and the day ---------- */

export interface SharedRun { gauge: ModuxGauge; run: { by: string; notch: number; score: number; hoursKept: number; held: boolean; stack: string[]; at: number } }

/** a run from outside, with every field checked and clamped */
export function cleanRun(raw: unknown, knownModel: (id: string) => boolean): SharedRun['run'] {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const by = (typeof r.by === 'string' ? r.by : '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 40) || 'Someone';
  const num = (x: unknown, lo: number, hi: number, dp = 0) => { const n = Number(x); if (!Number.isFinite(n)) return lo; const k = Math.pow(10, dp); return Math.max(lo, Math.min(hi, Math.round(n * k) / k)); };
  const stack = Array.isArray(r.stack) ? (r.stack as unknown[]).filter((c): c is string => typeof c === 'string' && knownModel(c)).slice(0, 24) : [];
  return { by, notch: num(r.notch, 0, 40), score: num(r.score, 0, 100), hoursKept: num(r.hoursKept, 0, 24, 1), held: r.held === true, stack, at: num(r.at, 0, 4102444800000) };
}

/* ---------- the open formats: a gauge or a run as a file ---------- */

export const GAUGE_FORMAT = 'stepsafe-gauge';
export const RUN_FORMAT = 'stepsafe-run';
export const SCHEMA_BASE = 'https://unitium-safe.vercel.app/schema/';

/** a gauge, or a gauge with one run on it, as a file any tool can read */
export function recordFile(gauge: ModuxGauge, run?: SharedRun['run']): string {
  return JSON.stringify(run
    ? { $schema: SCHEMA_BASE + 'stepsafe-run.v1.json', format: RUN_FORMAT, version: 1, gauge, run }
    : { $schema: SCHEMA_BASE + 'stepsafe-gauge.v1.json', format: GAUGE_FORMAT, version: 1, gauge }, null, 2);
}

/** read a record file: the gauge and, when it carries one, the run; null when it is neither */
export function readRecordFile(text: string, knownModel: (id: string) => boolean): { gauge: ModuxGauge; run?: SharedRun['run'] } | null {
  try {
    if (text.length > 400000) return null;
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.format !== GAUGE_FORMAT && parsed.format !== RUN_FORMAT) return null;
    const gauge = sanitizeGauge(parsed.gauge, knownModel);
    if (!gauge) return null;
    return parsed.format === RUN_FORMAT && parsed.run ? { gauge, run: cleanRun(parsed.run, knownModel) } : { gauge };
  } catch {
    return null;
  }
}

/** hand the browser a file to save */
export function saveFile(name: string, text: string) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function encodeResult(g: ModuxGauge, run: SharedRun['run']): Promise<string> {
  const json = JSON.stringify({ v: 1, g, r: run });
  const packed = await deflate(json);
  if (packed) return 'z' + toB64Url(packed);
  return 'r' + toB64Url(new TextEncoder().encode(json));
}

export async function decodeResult(fragment: string, knownModel: (id: string) => boolean): Promise<SharedRun | null> {
  try {
    const mode = fragment[0];
    const bytes = fromB64Url(fragment.slice(1));
    const json = mode === 'z' ? await inflate(bytes) : new TextDecoder().decode(bytes);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object' || !parsed.g || !parsed.r || typeof parsed.r !== 'object') return null;
    const gauge = sanitizeGauge(parsed.g, knownModel);
    if (!gauge) return null;
    return { gauge, run: cleanRun(parsed.r, knownModel) };
  } catch {
    return null;
  }
}

export function resultUrl(fragment: string): string {
  return location.origin + location.pathname + '#r=' + fragment;
}

/** Read a shared run out of the current URL, if there is one. */
export async function resultFromUrl(knownModel: (id: string) => boolean): Promise<SharedRun | null> {
  const m = /(?:^|[#&])r=([A-Za-z0-9\-_]+)/.exec(location.hash);
  if (!m) return null;
  return decodeResult(m[1], knownModel);
}

export function gaugeUrl(fragment: string): string {
  return location.origin + location.pathname + '#g=' + fragment;
}

/** Read a shared gauge out of the current URL, if there is one. */
export async function gaugeFromUrl(knownModel: (id: string) => boolean): Promise<SharedGauge | null> {
  const m = /(?:^|[#&])g=([A-Za-z0-9\-_]+)/.exec(location.hash);
  if (!m) return null;
  return decodeGauge(m[1], knownModel);
}

export function shareUrl(fragment: string): string {
  return location.origin + location.pathname + '#p=' + fragment;
}

/** Read a shared profile out of the current URL, if there is one. */
export async function profileFromUrl(): Promise<SharedProfile | null> {
  const m = /(?:^|[#&])p=([A-Za-z0-9\-_]+)/.exec(location.hash);
  if (!m) return null;
  return decodeProfile(m[1]);
}

/* ---------- a study set in a link ----------
   A list of cards and a name, sent by a teacher to a class or a lead to a
   team. Mode 'exam' carries the seed and the cards in order, so everyone who
   opens it takes the same test. The link carries ids and words only: no
   record, no notes, no own words. */

export interface SharedSet { label: string; ids: string[]; mode: 'study' | 'exam'; seed?: number; by?: string }

const SET_ID = /^(term|model|guide|step|threat|stack|room|incident):[A-Za-z0-9_.-]{1,120}$/;
const plain = (x: unknown, max: number) => (typeof x === 'string' ? x.replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, max) : '');

/** read a set out of untrusted JSON: ids must look like card ids, sizes capped, words stripped */
export function cleanSet(raw: unknown): SharedSet | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const ids = Array.isArray(r.ids) ? [...new Set(r.ids.filter((i): i is string => typeof i === 'string' && SET_ID.test(i)))].slice(0, 200) : [];
  if (!ids.length) return null;
  const mode = r.mode === 'exam' ? 'exam' : 'study';
  const seed = typeof r.seed === 'number' && Number.isFinite(r.seed) ? Math.abs(Math.floor(r.seed)) % 0x7fffffff : undefined;
  return { label: plain(r.label, 80) || (mode === 'exam' ? 'A test' : 'A study set'), ids: mode === 'exam' ? ids.slice(0, 60) : ids, mode, seed, by: plain(r.by, 40) || undefined };
}

export async function encodeSet(x: SharedSet): Promise<string> {
  const json = JSON.stringify({ v: 1, ...x });
  const packed = await deflate(json);
  if (packed) return 'z' + toB64Url(packed);
  return 'r' + toB64Url(new TextEncoder().encode(json));
}

export async function decodeSet(fragment: string): Promise<SharedSet | null> {
  try {
    const bytes = fromB64Url(fragment.slice(1));
    const json = fragment[0] === 'z' ? await inflate(bytes) : new TextDecoder().decode(bytes);
    if (!json) return null;
    return cleanSet(JSON.parse(json));
  } catch {
    return null;
  }
}

export function setUrl(fragment: string): string {
  return location.origin + location.pathname + '#s=' + fragment;
}

export async function setFromUrl(): Promise<SharedSet | null> {
  const m = /(?:^|[#&])s=([A-Za-z0-9\-_]+)/.exec(location.hash);
  if (!m) return null;
  return decodeSet(m[1]);
}
