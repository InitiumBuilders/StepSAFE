/* READ ALOUD: a Step, a guide or a chapter as an audiobook. The passages
   play in order with the configured voice; the player sits at the bottom
   of the page while it reads, shows which passage is playing, and moves
   through them. Stopping stops at once. Nothing is read until the learner
   presses play. */

import React, { useEffect, useRef, useState } from 'react';
import { type Passage, readingMinutes } from '../lib/reading';
import { canSpeak, speak, stopSpeaking, breath, voiceLabel, voiceLastError, elevenReady, elevenFetch } from '../lib/study/voice';

/* where a reading stopped, kept on the device so a long chapter picks up tomorrow where it left off */
const RESUME_KEY = 'stepsafe-reading-v1';
function resumeKey(ps: Passage[], label: string): string { return label + '|' + ps.length + '|' + (ps[0]?.title || ''); }
function readResume(k: string): number { try { const x = JSON.parse(localStorage.getItem(RESUME_KEY) || '{}'); const n = Number(x[k]); return Number.isFinite(n) && n > 0 ? n : 0; } catch { return 0; } }
function writeResume(k: string, at: number) { try { const x = JSON.parse(localStorage.getItem(RESUME_KEY) || '{}'); if (at > 0) x[k] = at; else delete x[k]; const keys = Object.keys(x); if (keys.length > 40) delete x[keys[0]]; localStorage.setItem(RESUME_KEY, JSON.stringify(x)); } catch { /* memory only */ } }

export function ReadAloud({ passages, label, onPassage }: { passages: Passage[]; label: string; onPassage?: (p: Passage | null) => void }) {
  const rkey = resumeKey(passages, label);
  const [at, setAt] = useState(() => { const r = readResume(rkey); return r > 0 && r < passages.length ? r : -1; });
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const stopRef = useRef(false);
  const runRef = useRef(0);
  const minutes = readingMinutes(passages);

  /* play from a passage: read it, breathe, move on; a stop ends the run */
  const run = (from: number) => {
    const my = ++runRef.current;
    stopRef.current = false;
    setPlaying(true);
    setNote(null);
    (async () => {
      for (let i = from; i < passages.length; i++) {
        if (stopRef.current || runRef.current !== my) return;
        setAt(i);
        writeResume(rkey, i);
        onPassage?.(passages[i]);
        const p = passages[i];
        /* the next passage fetched while this one reads, so the voice does not pause between them */
        if (elevenReady() && passages[i + 1]) void elevenFetch(passages[i + 1].text);
        if (p.title) { await speak(p.title); if (stopRef.current || runRef.current !== my) return; await breath(500, () => stopRef.current); }
        await speak(p.text);
        if (stopRef.current || runRef.current !== my) return;
        const err = voiceLastError();
        if (err && elevenReady()) setNote('ElevenLabs did not answer (' + err + '). Your device is reading instead.');
        await breath(900, () => stopRef.current);
      }
      if (runRef.current === my) { setPlaying(false); setAt(-1); writeResume(rkey, 0); onPassage?.(null); }
    })();
  };
  const stop = () => { stopRef.current = true; runRef.current++; stopSpeaking(); setPlaying(false); onPassage?.(null); };
  const step = (d: number) => { const next = Math.max(0, Math.min(passages.length - 1, (at < 0 ? 0 : at) + d)); stop(); run(next); };

  useEffect(() => () => { stopRef.current = true; runRef.current++; stopSpeaking(); }, []);

  if (!canSpeak() || !passages.length) return null;
  const cur = at >= 0 ? passages[at] : null;
  return (
    <div className={'ra' + (playing ? ' on' : '')} role="group" aria-label={'Read ' + label + ' aloud'}>
      <button className={'btn ' + (playing ? 'btn-ghost' : 'btn-key') + ' btn-sm ra-play'} onClick={() => (playing ? stop() : run(at < 0 ? 0 : at))} aria-pressed={playing}>
        {playing ? (
          <><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" /></svg>Stop</>
        ) : (
          <><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path d="M7 5.5v13l11-6.5z" fill="currentColor" /></svg>{at >= 0 ? 'Continue' : 'Read aloud'}</>
        )}
      </button>
      <div className="ra-text" aria-live="polite">
        <strong>{cur ? (cur.title || 'Reading') : label}</strong>
        <em>{playing || at >= 0 ? (at + 1) + ' of ' + passages.length : passages.length + ' passages · about ' + minutes + ' min · ' + voiceLabel()}</em>
        {note && <small>{note}</small>}
      </div>
      {passages.length > 1 && (
        <div className="ra-nav">
          <button className="btn btn-ghost btn-sm" onClick={() => step(-1)} disabled={at <= 0} aria-label="The passage before">{'←'}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => step(1)} disabled={at >= passages.length - 1} aria-label="The next passage">{'→'}</button>
        </div>
      )}
    </div>
  );
}
