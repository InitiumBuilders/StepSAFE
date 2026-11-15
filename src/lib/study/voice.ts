/* THE VOICE. Everything in the Praxis that is read aloud comes through here:
   a card in StudyMode, a Step, a guide, a whole chapter. Two engines. The
   device's own speech needs nothing and sends nothing. ElevenLabs runs on
   the learner's own key, sent browser direct to api.elevenlabs.io and not
   to the StepSAFE server; every passage it reads is kept on the device, so
   a passage is paid for once. If ElevenLabs fails, the device speaks. */
import { liveVoice } from '../keyring';

export interface VoiceConfig {
  /** 'device' = the browser's own speech; 'eleven' = ElevenLabs on the learner's key */
  mode: 'device' | 'eleven';
  elevenKey: string;
  /** the ElevenLabs voice id; Honor by default */
  voiceId: string;
  /** reading speed for the device voice, 0.7 to 1.3 */
  rate: number;
}

export const HONOR_VOICE = 'cHlKR8aJujyitGaZzzp0';
/** a voice every ElevenLabs account has, used when the chosen voice is not in the learner's library */
const FALLBACK_VOICE = '21m00Tcm4TlvDq8ikWAM';
const MODEL = 'eleven_turbo_v2_5';
const VOICE_CACHE = 'stepsafe-voice-v1';

let config: VoiceConfig = { mode: 'device', elevenKey: '', voiceId: HONOR_VOICE, rate: 1 };
export function configureVoice(c: VoiceConfig) { config = c; }
export function voiceConfig(): VoiceConfig { return config; }

export function elevenReady(c: VoiceConfig = config): boolean {
  c = liveVoice(c);
  return c.mode === 'eleven' && c.elevenKey.trim().length >= 20;
}
export function voiceLabel(c: VoiceConfig = config): string {
  return elevenReady(c) ? 'ElevenLabs, your key' : 'Your device';
}

/* ---------- the device ---------- */

let current: SpeechSynthesisUtterance | null = null;

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && (('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') || elevenReady());
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const en = voices.filter(v => /^en/i.test(v.lang));
  return en.find(v => v.localService && /natural|neural|premium|enhanced/i.test(v.name)) || en.find(v => v.localService) || en[0] || voices[0];
}

function speakDevice(text: string, opts: { rate?: number } = {}): Promise<void> {
  return new Promise(resolve => {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined' || !text.trim()) { resolve(); return; }
    const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = opts.rate ?? config.rate ?? 1;
    let done = false;
    const finish = () => { if (done) return; done = true; window.clearTimeout(guard); if (current === u) current = null; resolve(); };
    u.onend = finish;
    u.onerror = finish;
    /* an engine that never starts, or never ends, must not hold the session */
    const guard = window.setTimeout(finish, Math.max(4000, u.text.split(/\s+/).length * 420 + 1500));
    current = u;
    window.speechSynthesis.speak(u);
  });
}

/* ---------- ElevenLabs, on the learner's key ---------- */

let audio: HTMLAudioElement | null = null;
let audioUrl: string | null = null;
let aborter: AbortController | null = null;
const memo = new Map<string, Blob>();

async function hash(text: string): Promise<string> {
  const data = new TextEncoder().encode(MODEL + '|' + config.voiceId + '|' + text);
  const h = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function fromKeep(key: string): Promise<Blob | null> {
  if (memo.has(key)) return memo.get(key)!;
  try { const c = await caches.open(VOICE_CACHE); const r = await c.match('/__voice/' + key); return r ? await r.blob() : null; } catch { return null; }
}
async function toKeep(key: string, blob: Blob) {
  memo.set(key, blob);
  try { const c = await caches.open(VOICE_CACHE); await c.put('/__voice/' + key, new Response(blob, { headers: { 'content-type': 'audio/mpeg' } })); } catch { /* memory only */ }
}

export interface ElevenResult { ok: boolean; error?: string; fromKeep?: boolean }

/** fetch one passage as audio: the keep first, then the API; a voice not in the library falls back once */
export async function elevenFetch(text: string, c: VoiceConfig = config, voiceId = c.voiceId || HONOR_VOICE): Promise<{ blob: Blob | null; result: ElevenResult }> {
  const t = text.replace(/\s+/g, ' ').trim().slice(0, 4000);
  if (!t) return { blob: null, result: { ok: true } };
  const key = await hash(t);
  const kept = await fromKeep(key);
  if (kept) return { blob: kept, result: { ok: true, fromKeep: true } };
  aborter = new AbortController();
  try {
    const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + encodeURIComponent(voiceId) + '?output_format=mp3_44100_128', {
      method: 'POST',
      headers: { 'xi-api-key': liveVoice(c).elevenKey.trim(), 'content-type': 'application/json', accept: 'audio/mpeg' },
      body: JSON.stringify({ text: t, model_id: MODEL, voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true } }),
      signal: aborter.signal,
    });
    if (!r.ok) {
      let detail = 'HTTP ' + r.status;
      try { const j = await r.json(); detail = String(j?.detail?.message || j?.detail?.status || j?.detail || detail).slice(0, 160); } catch { /* the status is enough */ }
      /* the chosen voice is not in this library: read with a voice every account has */
      if ((r.status === 404 || r.status === 400) && voiceId !== FALLBACK_VOICE && /voice/i.test(detail)) return elevenFetch(text, c, FALLBACK_VOICE);
      return { blob: null, result: { ok: false, error: detail } };
    }
    const blob = await r.blob();
    await toKeep(key, blob);
    return { blob, result: { ok: true } };
  } catch (e) {
    return { blob: null, result: { ok: false, error: e instanceof Error && e.name === 'AbortError' ? 'stopped' : 'no connection' } };
  } finally { aborter = null; }
}

function play(blob: Blob): Promise<void> {
  return new Promise(resolve => {
    stopAudio();
    audioUrl = URL.createObjectURL(blob);
    const a = new Audio(audioUrl);
    audio = a;
    let done = false;
    const finish = () => { if (done) return; done = true; if (audio === a) stopAudio(); resolve(); };
    a.onended = finish;
    a.onerror = finish;
    a.play().catch(finish);
  });
}
function stopAudio() {
  if (audio) { try { audio.pause(); } catch { /* already stopped */ } audio = null; }
  if (audioUrl) { URL.revokeObjectURL(audioUrl); audioUrl = null; }
}

/* ---------- the router ---------- */

let lastError: string | null = null;
export function voiceLastError(): string | null { return lastError; }

/** read one text aloud with the configured voice; resolves when it ends or is cut off */
export async function speak(text: string, opts: { rate?: number } = {}): Promise<void> {
  if (!text.trim()) return;
  if (elevenReady()) {
    const { blob, result } = await elevenFetch(text);
    if (blob) { lastError = null; await play(blob); return; }
    if (result.error === 'stopped') return;
    lastError = result.error || 'no audio';
  }
  await speakDevice(text, opts);
}

export function stopSpeaking() {
  if (aborter) { aborter.abort(); aborter = null; }
  stopAudio();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) { current = null; window.speechSynthesis.cancel(); }
}

export function speaking(): boolean {
  return !!audio || (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking);
}

/** a pause that ends early if the listener stops the reading */
export function breath(ms: number, stopped: () => boolean): Promise<void> {
  return new Promise(resolve => {
    const t0 = Date.now();
    const tick = () => { if (stopped() || Date.now() - t0 >= ms) resolve(); else window.setTimeout(tick, 100); };
    tick();
  });
}

/** how much voice is kept on the device, for Settings */
export async function voiceKeep(): Promise<{ passages: number; bytes: number }> {
  try {
    const c = await caches.open(VOICE_CACHE);
    const keys = await c.keys();
    let bytes = 0;
    for (const k of keys) { const r = await c.match(k); if (r) bytes += (await r.blob()).size; }
    return { passages: keys.length, bytes };
  } catch { return { passages: 0, bytes: 0 }; }
}
export async function clearVoiceKeep() { memo.clear(); try { await caches.delete(VOICE_CACHE); } catch { /* nothing kept */ } }
