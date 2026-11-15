/* The gauge's score: a small sequenced engine on WebAudio, with no audio files.

   The arrangement lives in pure functions at the top of this file (tempo, key,
   chords, the layer table, and the events on each 16th note). They need no
   WebAudio, so a Node script can print a bar as data and check it. The synth
   voices and the lookahead scheduler come after them.

   This file also owns the one AudioContext and the master chain that sound.ts
   shares. Nothing here touches the context at import time. */

export type Intensity = 'bed' | 'run';
export type Layer = 'kick' | 'bass' | 'hat' | 'snare' | 'pad' | 'arp' | 'strings' | 'brass' | 'timp' | 'choir';

/** One note on the grid. step is 0..15 in the bar, len is in 16th notes, gain is the peak level. */
export interface ScoreEvent {
  step: number;
  layer: Layer;
  midi: number[];
  len: number;
  gain: number;
}

export interface LayerTable {
  kick: 'heart' | 'four' | 'four+last16';
  bass: boolean;
  hats: 'none' | 'offbeats' | '16ths';
  snare: boolean;
  arp: 'none' | '8ths' | '16ths';
  pad: true;
  /* the orchestra: a string section from Hardened, timpani from Systemic, brass from Wicked, a choir at Outlier */
  strings: boolean;
  timp: boolean;
  brass: boolean;
  choir: boolean;
}

export interface Beat {
  beat: number;
  barPos: number;
  band: number;
  intensity: Intensity;
}

/* ---------- pure timing and arrangement ---------- */

export const BAND_NAMES = ['Ground', 'Hardened', 'Systemic', 'Wicked', 'Outlier'] as const;
export const TEMPO = [84, 92, 100, 112, 124] as const;
export const KEY_NAMES = ['A', 'B', 'C#', 'D#', 'F'] as const;
export const STEPS_PER_BAR = 16;

/** Natural minor, in semitones above the tonic. */
const MINOR = [0, 2, 3, 5, 7, 8, 10];
/** A four bar phrase on scale degrees: i, VI, III, iv. */
const PROGRESSION = [0, 5, 2, 3];
const ROMAN = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function clampBand(band: number): number {
  if (!Number.isFinite(band)) return 0;
  return Math.max(0, Math.min(4, Math.round(band)));
}

export function tempoFor(band: number): number { return TEMPO[clampBand(band)]; }
export function stepSec(band: number): number { return 60 / tempoFor(band) / 4; }
export function barSec(band: number): number { return stepSec(band) * STEPS_PER_BAR; }
export function beatMs(band: number): number { return 60000 / tempoFor(band); }

/** The tonic climbs a whole step per band from A2 (MIDI 45): A, B, C#, D#, F. */
export function tonicMidi(band: number): number { return 45 + 2 * clampBand(band); }
export function midiHz(m: number): number { return 440 * Math.pow(2, (m - 69) / 12); }
export function midiName(m: number): string { return NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1); }

/** The tonic of a band in Hz, an octave below tonicMidi. sound.ts lands the notch riser on it. */
export function keyRootHz(band: number): number { return midiHz(tonicMidi(band) - 12); }

/** A diatonic triad on a scale degree, voiced close between tonic+10 and tonic+21 so chords move by small steps. */
export function chordFor(band: number, bar: number): { degree: number; name: string; midi: number[] } {
  const k = tonicMidi(band);
  const degree = PROGRESSION[((bar % 4) + 4) % 4];
  const lo = k + 10;
  const midi = [0, 2, 4].map(i => {
    const d = degree + i;
    let m = k + 12 + 12 * Math.floor(d / 7) + MINOR[d % 7];
    while (m >= lo + 12) m -= 12;
    while (m < lo) m += 12;
    return m;
  }).sort((a, b) => a - b);
  return { degree, name: ROMAN[degree], midi };
}

/** Which layers play, by band and intensity. */
export function layersFor(bandIn: number, intensity: Intensity): LayerTable {
  const band = clampBand(bandIn);
  if (intensity === 'bed') {
    return { kick: 'heart', bass: band >= 1, hats: 'none', snare: false, arp: 'none', pad: true, strings: band >= 1, timp: false, brass: false, choir: band >= 4 };
  }
  return {
    kick: band >= 4 ? 'four+last16' : 'four',
    bass: true,
    hats: band >= 3 ? '16ths' : band >= 1 ? 'offbeats' : 'none',
    snare: band >= 2,
    arp: band >= 4 ? '16ths' : band >= 3 ? '8ths' : 'none',
    pad: true,
    strings: true,
    timp: band >= 2,
    brass: band >= 3,
    choir: band >= 4,
  };
}

/* Sub bass ostinatos over one bar, as [step, semitones above the tonic, length in 16ths].
   They use the root, minor third, fifth and minor seventh. */
const BASS_BED: [number, number, number][] = [[0, 0, 6], [6, 3, 2], [8, 7, 6], [14, 10, 2]];
const BASS_RUN: [number, number, number][] = [[0, 0, 3], [3, 0, 3], [6, 3, 2], [8, 7, 3], [11, 0, 1], [12, 10, 2], [14, 7, 2]];

/** Every event that starts on one 16th step. bar is the bar within the phrase and picks the chord. */
export function stepEvents(bandIn: number, intensity: Intensity, step: number, bar: number): ScoreEvent[] {
  const band = clampBand(bandIn);
  const L = layersFor(band, intensity);
  const ev: ScoreEvent[] = [];
  const chord = chordFor(band, bar);

  if (step === 0) ev.push({ step, layer: 'pad', midi: chord.midi, len: 16, gain: intensity === 'bed' ? 0.03 : 0.024 });

  /* the orchestra sits an octave above the pad. Strings swell through every bar; the choir
     breathes with them at Outlier; brass stabs the first and third bars of the phrase; the
     timpani roll into the turnaround and strike the downbeat. */
  const up = chord.midi.map(m => m + 12);
  if (L.strings && step === 0) ev.push({ step, layer: 'strings', midi: up, len: 16, gain: (intensity === 'bed' ? 0.011 : 0.009) + band * 0.0015 });
  if (L.choir && step === 0) ev.push({ step, layer: 'choir', midi: up, len: 16, gain: intensity === 'bed' ? 0.05 : 0.045 });
  if (L.brass && ((bar % 4 === 0 && step === 0) || (bar % 4 === 2 && step === 8))) {
    ev.push({ step, layer: 'brass', midi: [chord.midi[0] - 12, chord.midi[0]], len: 4, gain: 0.06 + (band - 3) * 0.015 });
  }
  if (L.timp) {
    const low = tonicMidi(band) - 12;
    if (bar % 4 === 3 && (step === 8 || step === 12 || step === 14)) ev.push({ step, layer: 'timp', midi: [low], len: 2, gain: step === 14 ? 0.3 : 0.24 });
    if (band >= 3 && bar % 4 === 0 && step === 0) ev.push({ step, layer: 'timp', midi: [low], len: 2, gain: 0.32 });
  }

  if (L.kick === 'heart') {
    if (step === 0 || step === 8) ev.push({ step, layer: 'kick', midi: [], len: 1, gain: step === 0 ? 0.34 : 0.26 });
  } else {
    if (step % 4 === 0) ev.push({ step, layer: 'kick', midi: [], len: 1, gain: Math.min(0.9, 0.7 + band * 0.04 + (step === 0 ? 0.05 : 0)) });
    if (L.kick === 'four+last16' && step === 15) ev.push({ step, layer: 'kick', midi: [], len: 1, gain: 0.5 });
  }

  if (L.bass) {
    const pat = intensity === 'bed' ? BASS_BED : BASS_RUN;
    const n = pat.find(p => p[0] === step);
    if (n) ev.push({ step, layer: 'bass', midi: [tonicMidi(band) - 12 + n[1]], len: n[2], gain: intensity === 'bed' ? 0.2 : 0.3 });
  }

  if (L.hats === 'offbeats' && step % 4 === 2) ev.push({ step, layer: 'hat', midi: [], len: 1, gain: 0.05 + band * 0.006 });
  if (L.hats === '16ths') {
    const g = step % 4 === 2 ? 0.07 : step % 2 === 0 ? 0.03 : 0.04;
    ev.push({ step, layer: 'hat', midi: [], len: 1, gain: g });
  }

  if (L.snare && (step === 4 || step === 12)) ev.push({ step, layer: 'snare', midi: [], len: 1, gain: 0.22 + (band - 2) * 0.03 });

  if (L.arp === '8ths' && step % 2 === 0) {
    const tones = [...chord.midi, chord.midi[0] + 12].map(m => m + 12);
    const order = [0, 1, 2, 3, 2, 1];
    ev.push({ step, layer: 'arp', midi: [tones[order[(bar * 8 + step / 2) % order.length]]], len: 2, gain: 0.05 });
  }
  if (L.arp === '16ths') {
    const tones = [...chord.midi, ...chord.midi.map(m => m + 12), chord.midi[0] + 24];
    const order = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
    ev.push({ step, layer: 'arp', midi: [tones[order[(bar * 16 + step) % order.length]]], len: 1, gain: 0.045 });
  }

  return ev;
}

export function barEvents(band: number, intensity: Intensity, bar = 0): ScoreEvent[] {
  const out: ScoreEvent[] = [];
  for (let s = 0; s < STEPS_PER_BAR; s++) out.push(...stepEvents(band, intensity, s, bar));
  return out;
}

/* The transport. step is the next 16th to schedule. A requested band waits in
   pendingBand and only takes over when the next step is a bar line, so tempo and
   key never change in the middle of a bar. A new key starts its phrase on the tonic. */
export interface Transport { step: number; bar: number; beat: number; band: number; pendingBand: number | null; }

export function transportStart(band: number): Transport {
  return { step: 0, bar: 0, beat: 0, band: clampBand(band), pendingBand: null };
}

export function requestBand(t: Transport, band: number): Transport {
  const b = clampBand(band);
  return { ...t, pendingBand: b === t.band ? null : b };
}

/** Call before scheduling a step. Applies a pending band only on a bar line. */
export function enterStep(t: Transport): Transport {
  if (t.step !== 0 || t.pendingBand === null) return t;
  return { ...t, band: t.pendingBand, pendingBand: null, bar: 0 };
}

/** Call after scheduling a step. */
export function leaveStep(t: Transport): Transport {
  const step = (t.step + 1) % STEPS_PER_BAR;
  return { ...t, step, bar: step === 0 ? t.bar + 1 : t.bar, beat: t.step % 4 === 0 ? t.beat + 1 : t.beat };
}

/* ---------- the shared AudioContext and master chain ---------- */

/* Measured 2026-10-13 by rendering every band offline: at 0.2 and 0.4 the score sat near -37 dBFS,
   too quiet to hear on a phone. These levels put a run near -22 dBFS with a limiter as the ceiling. */
const MASTER_LEVEL = 0.6;
const SCORE_LEVEL = 0.7;
/** each band drives the score about a decibel harder */
const bandGain = (band: number) => 0.82 + clampBand(band) * 0.11;
const LOOKAHEAD = 0.12;
const TICK_MS = 25;
const FLOOR = 0.0001;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let scoreIn: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

/** The one AudioContext, made on first call. Master gain 0.2 into a compressor into the speakers. */
export function audio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      const c = new C();
      const comp = c.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 12;
      comp.ratio.value = 3;
      comp.attack.value = 0.004;
      comp.release.value = 0.25;
      /* the ceiling: a fast, hard compressor so no combination of score and effects can clip */
      const lim = c.createDynamicsCompressor();
      lim.threshold.value = -2;
      lim.knee.value = 0;
      lim.ratio.value = 20;
      lim.attack.value = 0.001;
      lim.release.value = 0.08;
      const m = c.createGain();
      m.gain.value = MASTER_LEVEL;
      m.connect(comp);
      comp.connect(lim);
      lim.connect(c.destination);
      const si = c.createGain();
      si.gain.value = 1;
      si.connect(m);
      ctx = c; master = m; scoreIn = si;
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return { ctx, master: master! };
  } catch {
    return null;
  }
}

/** Two seconds of white noise, made once per context and reused by every noise voice. */
export function noiseBuffer(c: AudioContext): AudioBuffer {
  if (noiseBuf && noiseBuf.sampleRate === c.sampleRate) return noiseBuf;
  const len = Math.floor(c.sampleRate * 2);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  noiseBuf = buf;
  return buf;
}

/** Freezes a param at its value at time `at`, so the next ramp starts from where it is. */
function holdAt(p: AudioParam, at: number) {
  if (typeof p.cancelAndHoldAtTime === 'function') {
    p.cancelAndHoldAtTime(at);
  } else {
    p.cancelScheduledValues(at);
    p.setValueAtTime(Math.max(FLOOR, p.value), at);
  }
}

/** Dips the score under a sound effect and brings it back. Does nothing when no context exists. */
export function duckScore(depth: number, sec: number) {
  if (!ctx || !scoreIn) return;
  const now = ctx.currentTime;
  const g = scoreIn.gain;
  holdAt(g, now);
  g.exponentialRampToValueAtTime(Math.max(FLOOR, depth), now + 0.04);
  g.exponentialRampToValueAtTime(1, now + Math.max(0.1, sec));
}

/* ---------- voices ---------- */

function envGain(c: AudioContext, at: number): GainNode {
  const g = c.createGain();
  g.gain.value = FLOOR;
  g.gain.setValueAtTime(FLOOR, at);
  return g;
}

function playKick(c: AudioContext, out: AudioNode, at: number, gain: number, soft: boolean) {
  const o = c.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(150, at);
  o.frequency.exponentialRampToValueAtTime(45, at + (soft ? 0.16 : 0.12));
  const g = envGain(c, at);
  const end = at + (soft ? 0.42 : 0.32);
  g.gain.exponentialRampToValueAtTime(gain, at + (soft ? 0.012 : 0.005));
  g.gain.exponentialRampToValueAtTime(FLOOR, end);
  o.connect(g); g.connect(out);
  o.start(at); o.stop(end + 0.05);
}

function playBass(c: AudioContext, out: AudioNode, at: number, midi: number, dur: number, gain: number, band: number, soft: boolean) {
  const o = c.createOscillator();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(midiHz(midi), at);
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.Q.value = 3;
  const base = 150 + band * 30;
  const peak = soft ? 380 + band * 60 : 560 + band * 150;
  f.frequency.setValueAtTime(base, at);
  f.frequency.exponentialRampToValueAtTime(peak, at + 0.012);
  f.frequency.exponentialRampToValueAtTime(base, at + Math.min(dur, 0.2));
  const g = envGain(c, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.008);
  g.gain.exponentialRampToValueAtTime(gain * 0.6, at + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(FLOOR, at + dur);
  o.connect(f); f.connect(g); g.connect(out);
  o.start(at); o.stop(at + dur + 0.05);
}

function playHat(c: AudioContext, out: AudioNode, at: number, gain: number, dur: number) {
  const buf = noiseBuffer(c);
  const src = c.createBufferSource();
  src.buffer = buf;
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7000;
  const g = envGain(c, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.002);
  g.gain.exponentialRampToValueAtTime(FLOOR, at + dur);
  src.connect(hp); hp.connect(g); g.connect(out);
  src.start(at, Math.random() * (buf.duration - dur - 0.1));
  src.stop(at + dur + 0.05);
}

function playSnare(c: AudioContext, out: AudioNode, at: number, gain: number) {
  const buf = noiseBuffer(c);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1900;
  bp.Q.value = 0.9;
  const g = envGain(c, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.002);
  g.gain.exponentialRampToValueAtTime(FLOOR, at + 0.17);
  src.connect(bp); bp.connect(g); g.connect(out);
  src.start(at, Math.random() * 1.5);
  src.stop(at + 0.22);

  const o = c.createOscillator();
  o.type = 'triangle';
  o.frequency.setValueAtTime(200, at);
  o.frequency.exponentialRampToValueAtTime(150, at + 0.08);
  const tg = envGain(c, at);
  tg.gain.exponentialRampToValueAtTime(gain * 0.6, at + 0.003);
  tg.gain.exponentialRampToValueAtTime(FLOOR, at + 0.09);
  o.connect(tg); tg.connect(out);
  o.start(at); o.stop(at + 0.14);
}

/** A chord of detuned saws. It swells in over most of a bar, holds, and releases over the next bar. */
function playPad(c: AudioContext, out: AudioNode, at: number, midi: number[], bar: number, gain: number) {
  const g = envGain(c, at);
  const attack = bar * 0.45;
  const release = bar * 1.2;
  g.gain.linearRampToValueAtTime(gain, at + attack);
  g.gain.setValueAtTime(gain, at + bar);
  g.gain.exponentialRampToValueAtTime(FLOOR, at + bar + release);
  g.connect(out);
  const end = at + bar + release + 0.05;
  for (const m of midi) {
    for (const cents of [-8, 0, 7]) {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(midiHz(m), at);
      o.detune.setValueAtTime(cents, at);
      o.connect(g);
      o.start(at); o.stop(end);
    }
  }
}

function playArp(c: AudioContext, out: AudioNode, at: number, midi: number, dur: number, gain: number) {
  const o = c.createOscillator();
  o.type = 'triangle';
  o.frequency.setValueAtTime(midiHz(midi), at);
  const g = envGain(c, at);
  const end = at + Math.min(0.35, dur * 1.6);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.004);
  g.gain.exponentialRampToValueAtTime(FLOOR, end);
  o.connect(g); g.connect(out);
  o.start(at); o.stop(end + 0.05);
}

/** A string section: three detuned saws a note, a slow bow into the note, vibrato, and a soft top. */
function playStrings(c: AudioContext, out: AudioNode, at: number, midi: number[], bar: number, gain: number) {
  const g = envGain(c, at);
  g.gain.linearRampToValueAtTime(gain, at + bar * 0.55);
  g.gain.setValueAtTime(gain, at + bar);
  g.gain.exponentialRampToValueAtTime(FLOOR, at + bar * 1.9);
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 2200;
  f.Q.value = 0.5;
  f.connect(g); g.connect(out);
  const vib = c.createOscillator();
  vib.type = 'sine';
  vib.frequency.value = 5.2;
  const vibDepth = c.createGain();
  vibDepth.gain.value = 7;
  vib.connect(vibDepth);
  const end = at + bar * 1.9 + 0.05;
  for (const m of midi) {
    for (const cents of [-11, 0, 9]) {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(midiHz(m), at);
      o.detune.setValueAtTime(cents, at);
      vibDepth.connect(o.detune);
      o.connect(f);
      o.start(at); o.stop(end);
    }
  }
  vib.start(at); vib.stop(end);
}

/** A brass stab: saws and a square an octave apart. The filter opens in sixty milliseconds and closes as the note decays. */
function playBrass(c: AudioContext, out: AudioNode, at: number, midi: number[], dur: number, gain: number) {
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.Q.value = 2.5;
  f.frequency.setValueAtTime(380, at);
  f.frequency.exponentialRampToValueAtTime(2600, at + 0.06);
  f.frequency.exponentialRampToValueAtTime(500, at + dur);
  const g = envGain(c, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.02);
  g.gain.setValueAtTime(gain, at + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(FLOOR, at + dur);
  f.connect(g); g.connect(out);
  const voices: [OscillatorType, number][] = [['sawtooth', -6], ['sawtooth', 6], ['square', 0]];
  for (const m of midi) {
    for (const [type, cents] of voices) {
      const o = c.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(midiHz(m), at);
      o.detune.setValueAtTime(cents, at);
      o.connect(f);
      o.start(at); o.stop(at + dur + 0.05);
    }
  }
}

/** A timpani: a sine that drops a fifth in eighty milliseconds over a skin of noise, ringing for half a second. */
function playTimp(c: AudioContext, out: AudioNode, at: number, midi: number, gain: number) {
  const hz = midiHz(midi);
  const o = c.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(hz * 1.5, at);
  o.frequency.exponentialRampToValueAtTime(hz, at + 0.08);
  const g = envGain(c, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.006);
  g.gain.exponentialRampToValueAtTime(FLOOR, at + 0.55);
  o.connect(g); g.connect(out);
  o.start(at); o.stop(at + 0.6);
  const buf = noiseBuffer(c);
  const src = c.createBufferSource();
  src.buffer = buf;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 900;
  const ng = envGain(c, at);
  ng.gain.exponentialRampToValueAtTime(gain * 0.5, at + 0.003);
  ng.gain.exponentialRampToValueAtTime(FLOOR, at + 0.12);
  src.connect(lp); lp.connect(ng); ng.connect(out);
  src.start(at, Math.random() * 1.5);
  src.stop(at + 0.2);
}

/** A choir on "ah": four voices a note, shaped by the vowel's formants, breathing in over half a bar. */
function playChoir(c: AudioContext, out: AudioNode, at: number, midi: number[], bar: number, gain: number) {
  const g = envGain(c, at);
  g.gain.linearRampToValueAtTime(gain, at + bar * 0.5);
  g.gain.setValueAtTime(gain, at + bar);
  g.gain.exponentialRampToValueAtTime(FLOOR, at + bar * 2);
  g.connect(out);
  const formants: [number, number, number][] = [[730, 7, 1], [1090, 9, 0.7], [2440, 10, 0.25]];
  const ins = formants.map(([hz, q, k]) => {
    const f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = hz;
    f.Q.value = q;
    const fg = c.createGain();
    fg.gain.value = k;
    f.connect(fg); fg.connect(g);
    return f;
  });
  const vib = c.createOscillator();
  vib.type = 'sine';
  vib.frequency.value = 4.6;
  const vibDepth = c.createGain();
  vibDepth.gain.value = 9;
  vib.connect(vibDepth);
  const end = at + bar * 2 + 0.05;
  for (const m of midi) {
    for (const cents of [-14, -5, 6, 13]) {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(midiHz(m), at);
      o.detune.setValueAtTime(cents, at);
      vibDepth.connect(o.detune);
      for (const f of ins) o.connect(f);
      o.start(at); o.stop(end);
    }
  }
  vib.start(at); vib.stop(end);
}

/** One event, to the right voice. The pad has its own filter; everything else goes to the bus. */
function playEvent(c: AudioContext, bus: AudioNode, padFilter: AudioNode, e: ScoreEvent, at: number, band: number, mode: Intensity, sd: number) {
  const bar = barSec(band);
  switch (e.layer) {
    case 'pad': playPad(c, padFilter, at, e.midi, bar, e.gain); break;
    case 'kick': playKick(c, bus, at, e.gain, mode === 'bed'); break;
    case 'bass': playBass(c, bus, at, e.midi[0], e.len * sd * 0.9, e.gain, band, mode === 'bed'); break;
    case 'hat': playHat(c, bus, at, e.gain, e.step % 4 === 2 ? 0.05 : 0.03); break;
    case 'snare': playSnare(c, bus, at, e.gain); break;
    case 'arp': playArp(c, bus, at, e.midi[0], e.len * sd, e.gain); break;
    case 'strings': playStrings(c, bus, at, e.midi, bar, e.gain); break;
    case 'brass': playBrass(c, bus, at, e.midi, e.len * sd, e.gain); break;
    case 'timp': playTimp(c, bus, at, e.midi[0], e.gain); break;
    case 'choir': playChoir(c, bus, at, e.midi, bar, e.gain); break;
  }
}

/* ---------- the scheduler ---------- */

interface Session {
  ctx: AudioContext;
  out: GainNode;
  buses: Record<Intensity, GainNode>;
  padFilter: BiquadFilterNode;
  padLfo: OscillatorNode;
  t: Transport;
  intensity: Intensity;
  fadeFrom: Intensity | null;
  fadeUntil: number;
  nextTime: number;
  beatTimes: number[];
  timers: Set<number>;
  stopping: boolean;
}

let cur: Session | null = null;
let interval: number | null = null;
let enabled: () => boolean = () => true;
const listeners = new Set<(b: Beat) => void>();

/** sound.ts installs its on/off preference here. The scheduler checks it on every tick. */
export function setScoreGate(fn: () => boolean) { enabled = fn; }

const padCutoff = (band: number) => 520 + clampBand(band) * 140;

function newSession(c: AudioContext, band: number, intensity: Intensity): Session {
  const out = c.createGain();
  out.gain.value = FLOOR;
  const now = c.currentTime;
  out.gain.setValueAtTime(FLOOR, now);
  out.gain.exponentialRampToValueAtTime(SCORE_LEVEL * bandGain(band), now + 0.6);
  out.connect(scoreIn!);

  const mk = (on: boolean) => {
    const g = c.createGain();
    g.gain.value = on ? 1 : FLOOR;
    g.connect(out);
    return g;
  };
  const buses = { bed: mk(intensity === 'bed'), run: mk(intensity === 'run') };

  const padFilter = c.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.Q.value = 0.7;
  padFilter.frequency.value = padCutoff(band);
  padFilter.connect(out);
  const padLfo = c.createOscillator();
  padLfo.type = 'sine';
  padLfo.frequency.value = 0.07;
  const depth = c.createGain();
  depth.gain.value = 220;
  padLfo.connect(depth); depth.connect(padFilter.frequency);
  padLfo.start(now);

  return {
    ctx: c, out, buses, padFilter, padLfo,
    t: transportStart(band), intensity, fadeFrom: null, fadeUntil: 0,
    nextTime: now + 0.06, beatTimes: [], timers: new Set(), stopping: false,
  };
}

function emit(b: Beat) {
  listeners.forEach(cb => { try { cb(b); } catch { /* a broken listener must not stop the clock */ } });
}

function scheduleStep(s: Session) {
  const c = s.ctx;
  const before = s.t.band;
  s.t = enterStep(s.t);
  const band = s.t.band;
  const at = s.nextTime;
  const step = s.t.step;
  const sd = stepSec(band);

  if (band !== before) {
    holdAt(s.padFilter.frequency, at);
    s.padFilter.frequency.linearRampToValueAtTime(padCutoff(band), at + barSec(band));
    holdAt(s.out.gain, at);
    s.out.gain.linearRampToValueAtTime(SCORE_LEVEL * bandGain(band), at + barSec(band));
  }

  const playing: Intensity[] = [s.intensity];
  if (s.fadeFrom && s.fadeFrom !== s.intensity && at < s.fadeUntil) playing.push(s.fadeFrom);

  for (const mode of playing) {
    const bus = s.buses[mode];
    for (const e of stepEvents(band, mode, step, s.t.bar)) {
      /* the pad is one voice for both intensities, so it plays for the current one only */
      if (e.layer === 'pad' && mode !== s.intensity) continue;
      playEvent(c, bus, s.padFilter, e, at, band, mode, sd);
    }
  }

  if (step % 4 === 0) {
    const b: Beat = { beat: s.t.beat, barPos: step / 4, band, intensity: s.intensity };
    s.beatTimes.push(at);
    const id = window.setTimeout(() => { s.timers.delete(id); if (cur === s && !s.stopping) emit(b); }, Math.max(0, (at - c.currentTime) * 1000));
    s.timers.add(id);
  }

  s.t = leaveStep(s.t);
  s.nextTime = at + sd;
}

function tick() {
  const s = cur;
  if (!s || s.stopping) return;
  if (!enabled()) { stopScore(0); return; }
  const now = s.ctx.currentTime;
  /* After a throttled background tab the clock can fall behind. Skip ahead instead of firing a burst of late notes. */
  if (s.nextTime < now - 0.05) s.nextTime = now + 0.03;
  while (s.nextTime < now + LOOKAHEAD) scheduleStep(s);
  while (s.beatTimes.length && s.beatTimes[0] < now - 0.5) s.beatTimes.shift();
  if (s.fadeFrom && now > s.fadeUntil) s.fadeFrom = null;
}

function crossfade(s: Session, to: Intensity) {
  const c = s.ctx;
  const from = s.intensity;
  const t0 = Math.max(s.nextTime, c.currentTime);
  const len = barSec(s.t.band);
  const up = s.buses[to].gain;
  const down = s.buses[from].gain;
  holdAt(up, t0);
  up.linearRampToValueAtTime(1, t0 + len);
  const mid = Math.max(FLOOR, Math.min(0.3, down.value));
  holdAt(down, t0);
  down.linearRampToValueAtTime(mid, t0 + len * 0.5);
  down.exponentialRampToValueAtTime(FLOOR, t0 + len);
  s.fadeFrom = from;
  s.fadeUntil = t0 + len;
  s.intensity = to;
}

/** Starts the score, or retargets it. A band change waits for the next bar line; an intensity change crossfades over a bar. */
export function startScore(band: number, intensity: Intensity) {
  if (!enabled()) return;
  const a = audio();
  if (!a) return;
  const s = cur;
  if (s && !s.stopping && s.ctx === a.ctx) {
    s.t = requestBand(s.t, band);
    if (intensity !== s.intensity) crossfade(s, intensity);
    return;
  }
  cur = newSession(a.ctx, band, intensity);
  if (interval === null) interval = window.setInterval(tick, TICK_MS);
  tick();
}

/** Stops scheduling at once and fades what is already sounding over fadeMs. */
export function stopScore(fadeMs = 600) {
  if (interval !== null) { window.clearInterval(interval); interval = null; }
  const s = cur;
  if (!s) return;
  cur = null;
  s.stopping = true;
  s.timers.forEach(id => window.clearTimeout(id));
  s.timers.clear();
  s.beatTimes = [];
  const c = s.ctx;
  const now = c.currentTime;
  const fade = Math.max(0.03, fadeMs / 1000);
  holdAt(s.out.gain, now);
  s.out.gain.exponentialRampToValueAtTime(FLOOR, now + fade);
  window.setTimeout(() => {
    try { s.padLfo.stop(); } catch { /* already stopped */ }
    s.out.disconnect();
  }, (fade + 0.25) * 1000);
}

export function scorePlaying(): boolean { return !!cur && !cur.stopping; }

export function onBeat(cb: (b: Beat) => void): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

/** Milliseconds until the next scheduled quarter note, or 0 when the score is not playing. */
export function untilNextBeat(): number {
  const s = cur;
  if (!s || s.stopping) return 0;
  const now = s.ctx.currentTime;
  for (const t of s.beatTimes) if (t >= now) return (t - now) * 1000;
  const steps = (4 - (s.t.step % 4)) % 4;
  return Math.max(0, (s.nextTime + steps * stepSec(s.t.band) - now) * 1000);
}

/* ---------- offline rendering, for measuring the score ---------- */

/** Render bars of the score into an offline context through the same chain a
    live session uses (session gain, score input, master, compressor), so the
    result can be measured: loudness, peaks, clipping and brightness. */
export async function renderOffline(band: number, intensity: Intensity, bars = 4, rate = 44100): Promise<AudioBuffer> {
  const b = clampBand(band);
  const sd = stepSec(b);
  const len = Math.ceil((bars * STEPS_PER_BAR * sd + 2) * rate);
  const oc = new OfflineAudioContext(1, len, rate);
  const c = oc as unknown as AudioContext;
  const comp = oc.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.25;
  const lim = oc.createDynamicsCompressor();
  lim.threshold.value = -2; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08;
  comp.connect(lim); lim.connect(oc.destination);
  const m = oc.createGain(); m.gain.value = MASTER_LEVEL; m.connect(comp);
  const out = oc.createGain(); out.gain.value = SCORE_LEVEL * bandGain(b); out.connect(m);
  const bus = oc.createGain(); bus.gain.value = 1; bus.connect(out);
  const padFilter = oc.createBiquadFilter();
  padFilter.type = 'lowpass'; padFilter.Q.value = 0.7; padFilter.frequency.value = padCutoff(b);
  padFilter.connect(out);
  let at = 0.05;
  for (let bar = 0; bar < bars; bar++) {
    for (let step = 0; step < STEPS_PER_BAR; step++) {
      for (const e of stepEvents(b, intensity, step, bar)) playEvent(c, bus, padFilter, e, at, b, intensity, sd);
      at += sd;
    }
  }
  return oc.startRendering();
}
