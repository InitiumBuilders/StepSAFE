/* THE KEYRING. A learner's own credentials (an Anthropic key, a Davara token, an ElevenLabs key) never sit in the
   main record any more. By default a key is held for this visit: it lives in this page's memory and is gone when the
   tab closes. Kept on the device, the keys are sealed together with AES-256-GCM under a key derived from the learner's
   passphrase (PBKDF2, SHA-256, 600,000 rounds, a fresh salt for each passphrase, a fresh nonce for each seal, and this
   blob's own label bound in as additional data so the ciphertext cannot pass as anything else). The passphrase is
   never stored, and the derived key is non-extractable and held only while the keyring is open. The round count is
   stored with the blob, so it can rise later without stranding what is already sealed.

   What this does and does not do. Sealed, the keys at rest open only with the passphrase: a cryptographic control,
   against anyone who reads this browser's storage on the device or from a copy of it. Open, they are in this page's
   memory, the same boundary as anything the page shows, and a script running on this origin could read them then: a
   policy boundary, narrowed by the site's Content-Security-Policy, not removed by it. Forget the passphrase and the
   sealed keys cannot be opened by anyone, including us; the way back is to forget them and paste the keys again from
   the provider, which never weakens the seal.

   The keyring also holds the learner's treasury checks (Dash Defenders, lib/checkstore.ts). A check lists a treasury's
   weak points, so it is held the way a key is: for this visit, or sealed in the same blob under the same passphrase.
   It never enters the main record, its export or its import.

   Two tabs open at once: a seal written in one is read by the other (the storage event). If the other tab can open it
   with the key it holds, it takes the newer keys and checks; if it cannot, the passphrase changed there, and this tab
   locks rather than writing over it.

   The MoTRUS vault (lib/motrus.tsx) uses the same construction for the learner's own structures, under its own key. */
import { useSyncExternalStore } from 'react';
import type { TreasuryCheck } from './check';
import { EVIDENCE_KINDS, type CheckAnswer } from '../content/check/types';

export interface Secrets { anthropicKey: string; davaraToken: string; elevenKey: string }
export type KeyName = keyof Secrets;
export type KeyringStatus = 'session' | 'open' | 'locked' | 'unavailable';

const STORE = 'stepsafe-keys-v1';
const ROUNDS = 600000;
const LABEL = new TextEncoder().encode('stepsafe-keys-v1');
const MIN_PASS = 12;
const EMPTY: Secrets = { anthropicKey: '', davaraToken: '', elevenKey: '' };

interface Sealed { v: 1; kdf: 'PBKDF2-SHA256'; rounds: number; salt: string; iv: string; ct: string }

let mem: Secrets = { ...EMPTY };
let held: TreasuryCheck[] = [];
let legacyChecks = false;
let key: CryptoKey | null = null;
let salt: Uint8Array | null = null;
let rounds = ROUNDS;
let legacy = false;
let version = 0;
let writing: Promise<void> = Promise.resolve();
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach((f) => f()); };

const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const clip = (v: string) => String(v || '').trim().slice(0, 300);

const ANSWER_SET = new Set<string>(['yes', 'partly', 'no', 'unsure', 'na']);
const MAX_CHECKS = 40;

/** treasury checks from a seal, an earlier record or a file: anything that is not one is dropped */
export function cleanChecks(raw: unknown): TreasuryCheck[] {
  if (!Array.isArray(raw)) return [];
  const out: TreasuryCheck[] = [];
  for (const c of raw.slice(0, MAX_CHECKS) as any[]) {
    if (!c || typeof c !== 'object' || typeof c.id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(c.id)) continue;
    const answers: Record<string, CheckAnswer> = {};
    if (c.answers && typeof c.answers === 'object') {
      for (const [k, v] of Object.entries(c.answers).slice(0, 40)) if (/^[a-z0-9-]{1,40}$/.test(k) && ANSWER_SET.has(v as string)) answers[k] = v as CheckAnswer;
    }
    const done = Number(c.done) || 0;
    const kind = typeof c.kind === 'string' && /^[a-z-]{1,24}$/.test(c.kind) ? c.kind : undefined;
    const evidence: Record<string, any> = {};
    if (c.evidence && typeof c.evidence === 'object') {
      for (const [k, r] of Object.entries(c.evidence).slice(0, 12) as [string, any][]) {
        if (!/^[a-z0-9-]{1,40}$/.test(k) || !r || typeof r !== 'object') continue;
        if (!(EVIDENCE_KINDS as readonly string[]).includes(r.kind) || !['yes', 'partly', 'no', 'open'].includes(r.allows)) continue;
        if (typeof r.url !== 'string' || !/^https:\/\/[^\s"]{1,300}$/.test(r.url) || typeof r.read !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.read)) continue;
        evidence[k] = {
          kind: r.kind, subject: String(r.subject || '').slice(0, 120), url: r.url, read: r.read, found: String(r.found || '').slice(0, 600), allows: r.allows,
          ...(r.unseen ? { unseen: String(r.unseen).slice(0, 200) } : {}),
          /* what a changeable record held, so the next reading can say what changed */
          ...(Array.isArray(r.held) ? { held: r.held.slice(0, 40).map((x: unknown) => String(x).slice(0, 260)) } : {}),
        };
      }
    }
    out.push({ id: c.id, ...(kind ? { kind } : {}), project: typeof c.project === 'string' ? c.project.slice(0, 80) : '', answers, at: Number(c.at) || 0, ...(done > 0 ? { done } : {}), ...(Object.keys(evidence).length ? { evidence } : {}) });
  }
  return out;
}

/** the checks made this visit come first and win on a shared id; newest first */
function mergeChecks(visit: TreasuryCheck[], other: TreasuryCheck[]): TreasuryCheck[] {
  const seen = new Set(visit.map((c) => c.id));
  return [...visit, ...other.filter((c) => !seen.has(c.id))].sort((a, b) => b.at - a.at).slice(0, MAX_CHECKS);
}

export function keyringAvailable(): boolean {
  return typeof crypto !== 'undefined' && !!crypto.subtle && typeof window !== 'undefined' && window.isSecureContext;
}

function readSealed(): Sealed | null {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.v === 1 && s.kdf === 'PBKDF2-SHA256' && s.ct && s.iv && s.salt && s.rounds >= 100000 ? s : null;
  } catch { return null; }
}

async function derive(pass: string, saltBytes: Uint8Array, n: number): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes as BufferSource, iterations: n, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

async function writeSealed(): Promise<void> {
  /* the key, salt and round count this seal is made under, taken once: the encryption is awaited, and the page
     can lock, or another tab can change the passphrase, before it finishes */
  const k = key, sl = salt, n = rounds;
  if (!k || !sl) return;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify({ ...mem, checks: held }));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource, additionalData: LABEL as BufferSource }, k, data as BufferSource));
  /* locked or resealed meanwhile: write nothing, so a seal never pairs one key's ciphertext with another's salt */
  if (key !== k || salt !== sl) return;
  const out: Sealed = { v: 1, kdf: 'PBKDF2-SHA256', rounds: n, salt: b64(sl), iv: b64(iv), ct: b64(ct) };
  try { localStorage.setItem(STORE, JSON.stringify(out)); } catch { /* storage blocked: the keys stay open for this visit */ }
}

export function keyringStatus(): KeyringStatus {
  if (!keyringAvailable()) return 'unavailable';
  if (key) return 'open';
  return readSealed() ? 'locked' : 'session';
}

/** the keys this page can use now: open or held for the visit; empty while locked */
export function secrets(): Secrets { return { ...mem }; }

/** a key was found in plain text in a record written by an earlier version, and moved here */
export function legacyMoved(): boolean { return legacy; }

export function setSecret(name: KeyName, value: string): void {
  mem = { ...mem, [name]: clip(value) };
  if (key) writing = writing.then(writeSealed, writeSealed);
  emit();
}

export const passphraseOk = (p: string) => p.length >= MIN_PASS;
export const MIN_PASSPHRASE = MIN_PASS;

/** seal what is held now under a new passphrase; replaces any earlier seal */
export async function sealWith(pass: string): Promise<boolean> {
  if (!keyringAvailable() || !passphraseOk(pass)) return false;
  salt = crypto.getRandomValues(new Uint8Array(16));
  rounds = ROUNDS;
  key = await derive(pass, salt, rounds);
  await (writing = writing.then(writeSealed, writeSealed));
  legacy = false; legacyChecks = false;
  emit();
  return true;
}

export async function unlock(pass: string): Promise<boolean> {
  const s = readSealed();
  if (!s || !keyringAvailable()) return false;
  try {
    const sl = unb64(s.salt), k = await derive(pass, sl, s.rounds);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(s.iv) as BufferSource, additionalData: LABEL as BufferSource }, k, unb64(s.ct) as BufferSource);
    const got = JSON.parse(new TextDecoder().decode(pt));
    /* a key typed this visit before unlocking wins over the sealed one, and is sealed with the rest */
    mem = { anthropicKey: clip(mem.anthropicKey || got.anthropicKey), davaraToken: clip(mem.davaraToken || got.davaraToken), elevenKey: clip(mem.elevenKey || got.elevenKey) };
    /* a check made this visit before unlocking joins the sealed ones */
    held = mergeChecks(held, cleanChecks(got.checks));
    key = k; salt = sl; rounds = s.rounds;
    if (rounds < ROUNDS) { rounds = ROUNDS; key = await derive(pass, sl, rounds); }
    await (writing = writing.then(writeSealed, writeSealed));
    legacyChecks = false;
    emit();
    return true;
  } catch { return false; }
}

/** drop the keys from this page's memory; the seal stays */
export function lock(): void {
  key = null; salt = null; mem = { ...EMPTY }; held = [];
  emit();
}

/** remove the sealed keys from this device and from memory */
export function forget(): void {
  try { localStorage.removeItem(STORE); } catch { /* nothing to remove */ }
  key = null; salt = null; mem = { ...EMPTY }; held = []; legacy = false; legacyChecks = false;
  emit();
}

/* ---------- the treasury checks ---------- */

/** the checks this page holds now: open, or made this visit; empty while locked */
export function heldChecks(): TreasuryCheck[] { return held; }

export function setHeldChecks(next: TreasuryCheck[]): void {
  held = next.slice(0, MAX_CHECKS);
  if (key) writing = writing.then(writeSealed, writeSealed);
  emit();
}

/** checks found in plain text, in a record written by an earlier version or in an imported file, moved here */
export function adoptLegacyChecks(found: unknown): number {
  const list = cleanChecks(found);
  if (!list.length) return 0;
  held = mergeChecks(held, list);
  legacyChecks = true;
  if (key) writing = writing.then(writeSealed, writeSealed);
  emit();
  return list.length;
}

export function legacyChecksMoved(): boolean { return legacyChecks; }

/* ---------- another tab wrote the seal ---------- */

/** what this tab does when the sealed blob changes in another tab; exported so the probe can drive it */
export async function adoptStorageChange(newValue: string | null): Promise<void> {
  if (!key) { emit(); return; }
  const k = key;
  if (!newValue) { key = null; salt = null; mem = { ...EMPTY }; held = []; emit(); return; }
  try {
    const s = JSON.parse(newValue);
    if (!salt || !s || s.v !== 1 || s.salt !== b64(salt)) throw new Error('a new seal');
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(s.iv) as BufferSource, additionalData: LABEL as BufferSource }, k, unb64(s.ct) as BufferSource);
    if (key !== k) return;
    const got = JSON.parse(new TextDecoder().decode(pt));
    mem = { anthropicKey: clip(got.anthropicKey), davaraToken: clip(got.davaraToken), elevenKey: clip(got.elevenKey) };
    held = cleanChecks(got.checks);
  } catch {
    if (key !== k) return;
    key = null; salt = null; mem = { ...EMPTY }; held = [];
  }
  emit();
}

let listening = false;
function listen(): void {
  if (listening || typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
  listening = true;
  window.addEventListener('storage', (e: StorageEvent) => { if (e.key === STORE) void adoptStorageChange(e.newValue); });
}

/** called once by the record loader: a key an earlier version stored in plain text moves here, for this visit */
export function adoptLegacy(found: Partial<Secrets>): void {
  const next = { anthropicKey: clip(found.anthropicKey || ''), davaraToken: clip(found.davaraToken || ''), elevenKey: clip(found.elevenKey || '') };
  if (!next.anthropicKey && !next.davaraToken && !next.elevenKey) return;
  mem = { anthropicKey: mem.anthropicKey || next.anthropicKey, davaraToken: mem.davaraToken || next.davaraToken, elevenKey: mem.elevenKey || next.elevenKey };
  legacy = true;
  emit();
}

/** a provider or voice config with the keyring's keys in place of whatever the record carried */
export function liveProvider<T extends { anthropicKey: string; davaraToken: string }>(p: T): T {
  return { ...p, anthropicKey: mem.anthropicKey, davaraToken: mem.davaraToken };
}
export function liveVoice<T extends { elevenKey: string }>(c: T): T {
  return { ...c, elevenKey: mem.elevenKey };
}

/** the record's own copy of a provider or voice config, with every secret blanked, for storage */
export function withoutSecrets<T extends { provider: { anthropicKey: string; davaraToken: string }; voice: { elevenKey: string } }>(s: T): T {
  return { ...s, provider: { ...s.provider, anthropicKey: '', davaraToken: '' }, voice: { ...s.voice, elevenKey: '' } };
}

function subscribe(f: () => void) { listen(); listeners.add(f); return () => { listeners.delete(f); }; }

/** re-renders on any keyring change; returns the status and the keys usable now */
export function useKeyring(): { status: KeyringStatus; keys: Secrets; legacy: boolean } {
  useSyncExternalStore(subscribe, () => version, () => version);
  return { status: keyringStatus(), keys: secrets(), legacy };
}
