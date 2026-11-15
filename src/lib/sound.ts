/* The gauge's sound, made in the browser with WebAudio. No files.

   Every sound means something: the riser is a notch being taken, the score
   under the gauge (score.ts) gets faster and climbs in key with the band, each
   threat resolves as a clean tone (stopped) or a low hit (landed), the verdict
   resolves major or falls, and Gold rings like a bell. One switch turns all of
   it off, and the choice is remembered on this device. Nothing plays before the
   learner presses a button, so the browser never has to block an autoplay. */

import {
  audio, noiseBuffer, keyRootHz, duckScore, setScoreGate,
  startScore, stopScore, onBeat as onScoreBeat, beatMs as scoreBeatMs, untilNextBeat as scoreUntilNextBeat,
  type Beat, type Intensity,
} from './score';

const PREF = 'stepsafe-sound';

export function soundOn(): boolean {
  try { return localStorage.getItem(PREF) !== 'off'; } catch { return true; }
}

/* The score asks this on every tick, so turning sound off anywhere stops it. */
setScoreGate(soundOn);

export function setSound(on: boolean) {
  try { localStorage.setItem(PREF, on ? 'on' : 'off'); } catch { /* the choice lasts for this page */ }
  if (!on) stopScore(0);
}

/** The shared context and master, or null when sound is off. */
function ac(): { ctx: AudioContext; master: GainNode } | null {
  if (!soundOn()) return null;
  return audio();
}

function tone(freq: number, at: number, dur: number, type: OscillatorType, peak: number, glideTo?: number) {
  const a = ac(); if (!a) return;
  const { ctx: c, master } = a;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, at + dur);
  g.gain.value = 0.0001;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + Math.min(0.03, dur / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g); g.connect(master);
  o.start(at); o.stop(at + dur + 0.05);
}

function noise(at: number, dur: number, from: number, to: number, peak: number) {
  const a = ac(); if (!a) return;
  const { ctx: c, master } = a;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 4;
  f.frequency.setValueAtTime(from, at);
  f.frequency.exponentialRampToValueAtTime(to, at + dur);
  const g = c.createGain();
  g.gain.value = 0.0001;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + dur * 0.8);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(f); f.connect(g); g.connect(master);
  src.start(at, Math.random()); src.stop(at + dur + 0.05);
}

function score(band: number, intensity: Intensity) {
  if (!ac()) return;
  startScore(band, intensity);
}

function scoreStop(fadeMs = 600) { stopScore(fadeMs); }

function stopPulse() { scoreStop(600); }

export const Sound = {
  /** taking a notch: a rising sweep that ends on the new band's key note, the one the score moves to */
  notch(band: number) {
    const a = ac(); if (!a) return;
    const t = a.ctx.currentTime;
    const root = keyRootHz(band);
    duckScore(0.45, 1.6);
    noise(t, 1.1, 300, 4200 + band * 600, 0.35);
    tone(root, t, 1.2, 'sawtooth', 0.12, root * 4);
    tone(root * 2, t + 1.05, 0.9, 'triangle', 0.28);
    tone(root * 3, t + 1.05, 0.9, 'sine', 0.14);
  },

  /** under a run: the score at full drive for this band */
  startPulse(band: number) { score(band, 'run'); },

  stopPulse,

  /** start the score, or move it to a new band or intensity without a stumble */
  score,

  /** fade the score out and stop scheduling */
  scoreStop,

  /** quarter notes at their audio time; returns an unsubscribe function */
  onBeat(cb: (b: Beat) => void): () => void { return onScoreBeat(cb); },

  /** length of one quarter note at a band's tempo, in ms */
  beatMs(band: number): number { return scoreBeatMs(band); },

  /** ms until the next scheduled quarter note, or 0 when the score is not playing */
  untilNextBeat(): number { return scoreUntilNextBeat(); },

  /** one threat resolving */
  threat(stopped: boolean) {
    const a = ac(); if (!a) return;
    const t = a.ctx.currentTime;
    duckScore(stopped ? 0.7 : 0.55, 0.45);
    if (stopped) { tone(880, t, 0.22, 'sine', 0.22, 1320); tone(1760, t + 0.04, 0.18, 'sine', 0.06); }
    else { tone(90, t, 0.45, 'sine', 0.5, 45); noise(t, 0.25, 900, 200, 0.25); }
  },

  verdict(held: boolean) {
    const a = ac(); if (!a) return;
    const t = a.ctx.currentTime;
    duckScore(0.4, 1.8);
    if (held) [261.63, 329.63, 392, 523.25].forEach((f, i) => tone(f, t + i * 0.09, 1.6, 'triangle', 0.18));
    else [220, 207.65, 174.61, 146.83].forEach((f, i) => tone(f, t + i * 0.14, 1.1, 'sawtooth', 0.08));
  },

  /** a bell: struck partials, the inharmonic ones that make metal sound like metal */
  gold() {
    const a = ac(); if (!a) return;
    const t = a.ctx.currentTime;
    duckScore(0.4, 3);
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      const at = t + i * 0.12;
      tone(f, at, 3.2, 'sine', 0.2);
      tone(f * 2.76, at, 1.6, 'sine', 0.05);
      tone(f * 5.4, at, 0.8, 'sine', 0.02);
    });
    noise(t + 0.5, 1.6, 6000, 12000, 0.05);
  },

  /** the system's beat: one soft struck glass an hour, a lower one every six, the hours a threat pushes unseen */
  hour(accent: boolean) {
    const a = ac(); if (!a) return;
    const t = a.ctx.currentTime;
    if (accent) { tone(659.25, t, 0.5, 'sine', 0.07); tone(329.63, t, 0.6, 'triangle', 0.035); }
    else tone(1318.5, t, 0.16, 'sine', 0.025);
  },

  /** a part drops under half its function: a low tone that settles */
  fall() {
    const a = ac(); if (!a) return;
    const t = a.ctx.currentTime;
    tone(196, t, 0.7, 'triangle', 0.12, 130.8);
  },

  /** the adversary that studies you arrives: a dark swell from below */
  adversary() {
    const a = ac(); if (!a) return;
    const t = a.ctx.currentTime;
    duckScore(0.4, 2);
    noise(t, 1.4, 2400, 160, 0.22);
    tone(55, t, 1.6, 'sawtooth', 0.09, 41.2);
    tone(110, t + 0.2, 1.3, 'sine', 0.08, 82.4);
  },

  /** a small chime for gratus */
  gratus() {
    const a = ac(); if (!a) return;
    const t = a.ctx.currentTime;
    duckScore(0.6, 0.9);
    tone(1046.5, t, 0.8, 'sine', 0.14);
    tone(1568, t + 0.08, 0.7, 'sine', 0.08);
  },
};
