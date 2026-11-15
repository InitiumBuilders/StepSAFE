/* MoTRUS models: structures the learner invents.

   A kept model lives in a vault on this device, sealed with AES-GCM under a
   key derived from the learner's passphrase (PBKDF2, SHA-256, 310,000
   rounds). The passphrase is never stored. Lose it and the vault cannot be
   opened by anyone, including us: that is crypto shredding, one of the
   structures in the catalog. The vault sits under its own storage key, so
   record exports, imports and share links never carry it.

   A model minted "for this gauge only" never touches storage at all. It lives
   in the gauge's memory and is gone when the learner leaves the gauge.

   While the vault is open, the models are readable in this page's memory, the
   same boundary as anything else the page shows. */

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ModuxFamily } from '../content/modux-schema';

export interface MotrusReview {
  verdict: 'sound' | 'promising' | 'unsound';
  text: string;
  at: number;
  model?: string;
}

export interface MotrusModel {
  id: string;
  name: string;
  /** what it defeats, one line */
  statement: string;
  /** the parts and the flows between them */
  structure: string;
  failsWhen: string;
  family: ModuxFamily | 'own';
  createdAt: number;
  /** keyed by gauge id and notch: "<gauge>@<notch>" */
  reviews: Record<string, MotrusReview>;
  /** kept in the vault, or held only for one gauge */
  kept: boolean;
}

export function reviewKey(gaugeId: string, notch: number): string {
  return gaugeId + '@' + notch;
}

const VAULT_KEY = 'stepsafe-motrus-v1';
const ROUNDS = 310000;

interface Sealed { v: 1; salt: string; iv: string; ct: string }

const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

export function cryptoAvailable(): boolean {
  return typeof crypto !== 'undefined' && !!crypto.subtle && typeof window !== 'undefined' && window.isSecureContext;
}

async function derive(pass: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: ROUNDS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function seal(key: CryptoKey, salt: Uint8Array, models: MotrusModel[]): Promise<Sealed> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(models));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, data as BufferSource));
  return { v: 1, salt: b64(salt), iv: b64(iv), ct: b64(ct) };
}

async function open(key: CryptoKey, sealed: Sealed): Promise<MotrusModel[]> {
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(sealed.iv) as BufferSource }, key, unb64(sealed.ct) as BufferSource);
  const parsed = JSON.parse(new TextDecoder().decode(pt));
  return Array.isArray(parsed) ? parsed : [];
}

function readSealed(): Sealed | null {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.v === 1 && s.ct ? s : null;
  } catch { return null; }
}

function writeSealed(s: Sealed | null) {
  try {
    if (s) localStorage.setItem(VAULT_KEY, JSON.stringify(s));
    else localStorage.removeItem(VAULT_KEY);
  } catch { /* storage blocked: the vault stays open in memory for this session */ }
}

export type VaultStatus = 'none' | 'locked' | 'open' | 'unavailable';

interface VaultApi {
  status: VaultStatus;
  models: MotrusModel[];
  create: (pass: string) => Promise<boolean>;
  unlock: (pass: string) => Promise<boolean>;
  lock: () => void;
  put: (m: MotrusModel) => Promise<void>;
  remove: (id: string) => Promise<void>;
  /** delete the vault and everything in it */
  shred: () => void;
}

const Ctx = createContext<VaultApi | null>(null);

export function MotrusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<VaultStatus>(() =>
    !cryptoAvailable() ? 'unavailable' : readSealed() ? 'locked' : 'none');
  const [models, setModels] = useState<MotrusModel[]>([]);
  const keyRef = useRef<{ key: CryptoKey; salt: Uint8Array } | null>(null);

  const persist = useCallback(async (next: MotrusModel[]) => {
    setModels(next);
    const k = keyRef.current;
    if (k) writeSealed(await seal(k.key, k.salt, next));
  }, []);

  const create = useCallback(async (pass: string) => {
    if (!cryptoAvailable() || pass.length < 8) return false;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await derive(pass, salt);
    keyRef.current = { key, salt };
    writeSealed(await seal(key, salt, []));
    setModels([]);
    setStatus('open');
    return true;
  }, []);

  const unlock = useCallback(async (pass: string) => {
    const sealed = readSealed();
    if (!sealed) return false;
    try {
      const salt = unb64(sealed.salt);
      const key = await derive(pass, salt);
      const list = await open(key, sealed);
      keyRef.current = { key, salt };
      setModels(list);
      setStatus('open');
      return true;
    } catch {
      return false;
    }
  }, []);

  const lock = useCallback(() => {
    keyRef.current = null;
    setModels([]);
    setStatus(readSealed() ? 'locked' : 'none');
  }, []);

  const put = useCallback(async (m: MotrusModel) => {
    const next = [m, ...models.filter(x => x.id !== m.id)];
    await persist(next);
  }, [models, persist]);

  const remove = useCallback(async (id: string) => {
    await persist(models.filter(x => x.id !== id));
  }, [models, persist]);

  const shred = useCallback(() => {
    keyRef.current = null;
    writeSealed(null);
    setModels([]);
    setStatus(cryptoAvailable() ? 'none' : 'unavailable');
  }, []);

  const api = useMemo(() => ({ status, models, create, unlock, lock, put, remove, shred }),
    [status, models, create, unlock, lock, put, remove, shred]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useMotrus(): VaultApi {
  const c = useContext(Ctx);
  if (!c) throw new Error('motrus outside provider');
  return c;
}
