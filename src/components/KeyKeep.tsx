/* Where the learner's own keys live (lib/keyring.ts): held for this visit, sealed on this device under a passphrase,
   or sealed and locked. One panel, shown beside every key field in Settings. */
import React, { useState } from 'react';
import { useKeyring, sealWith, unlock, lock, forget, passphraseOk, keyringAvailable, MIN_PASSPHRASE } from '../lib/keyring';

const FIELD: React.CSSProperties = { width: '100%', maxWidth: 420 };

export function KeyKeep() {
  const { status, keys, legacy } = useKeyring();
  const [pass, setPass] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmForget, setConfirmForget] = useState(false);
  const held = !!(keys.anthropicKey || keys.davaraToken || keys.elevenKey);

  const line =
    status === 'unavailable' ? 'This browser cannot seal keys here (it needs a secure connection with Web Crypto), so a key is held for this visit only.'
    : status === 'open' ? 'Sealed on this device and open now. At rest they stay sealed; while open, this page can use them.'
    : status === 'locked' ? 'Sealed on this device. Enter your passphrase to use them on this visit.'
    : held ? 'Held for this visit. Your keys are in this page’s memory and go when you close the tab.'
    : 'Nothing held. A key you paste is kept for this visit unless you seal it.';

  const run = async (f: () => Promise<boolean>, good: string, bad: string) => {
    setBusy(true); setNote(null);
    const r = await f();
    setBusy(false); setPass(''); setAgain('');
    setNote({ ok: r, text: r ? good : bad });
  };

  return (
    <div className="panel panel-2 keykeep" style={{ marginBottom: 'var(--s4)' }}>
      <span className="label" style={{ display: 'block', marginBottom: 8 }}>WHERE YOUR KEYS LIVE</span>
      <p className="sec" style={{ margin: 0 }}>{line}</p>
      {legacy && status !== 'open' && (
        <p className="sec" style={{ margin: '8px 0 0' }}>An earlier version kept a key here in plain text. It has been taken out of storage and is held for this visit. Seal it to keep it.</p>
      )}

      {keyringAvailable() && (status === 'session') && held && (
        <form className="stack-sm" style={{ marginTop: 'var(--s3)' }} onSubmit={(e) => { e.preventDefault(); if (passphraseOk(pass) && pass === again) run(() => sealWith(pass), 'Sealed. Next visit, your passphrase opens them.', 'Could not seal on this device.'); }}>
          <label className="label" htmlFor="kk-pass">A passphrase to seal them, {MIN_PASSPHRASE} characters or more</label>
          <input id="kk-pass" type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} style={FIELD} />
          <label className="label" htmlFor="kk-again">The same passphrase again</label>
          <input id="kk-again" type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} style={FIELD} />
          <div className="row" style={{ gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-sm" type="submit" disabled={busy || !passphraseOk(pass) || pass !== again}>{busy ? 'Sealing' : 'Seal on this device'}</button>
            {pass && again && pass !== again && <span className="sec">The two do not match yet.</span>}
          </div>
        </form>
      )}

      {status === 'locked' && (
        <form className="row" style={{ marginTop: 'var(--s3)', gap: 12, alignItems: 'center', flexWrap: 'wrap' }} onSubmit={(e) => { e.preventDefault(); if (pass) run(() => unlock(pass), 'Open for this visit.', 'That passphrase does not open them.'); }}>
          <label className="label" htmlFor="kk-open" style={{ width: '100%' }}>Your passphrase</label>
          <input id="kk-open" type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} style={FIELD} />
          <button className="btn btn-sm" type="submit" disabled={busy || !pass}>{busy ? 'Opening' : 'Open them'}</button>
        </form>
      )}

      {status === 'open' && (
        <div className="row" style={{ marginTop: 'var(--s3)', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-sm" type="button" onClick={() => { lock(); setNote({ ok: true, text: 'Locked. They stay sealed on this device.' }); }}>Lock now</button>
        </div>
      )}

      {(status === 'open' || status === 'locked') && (
        <div className="row" style={{ marginTop: 'var(--s3)', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {!confirmForget
            ? <button className="btn btn-sm" type="button" onClick={() => setConfirmForget(true)}>Forget the sealed keys</button>
            : <>
                <span className="sec">This removes them from this device for good, with any treasury checks sealed beside them.</span>
                <button className="btn btn-sm" type="button" onClick={() => { forget(); setConfirmForget(false); setNote({ ok: true, text: 'Forgotten. Paste a key again to use one.' }); }}>Forget them</button>
                <button className="btn btn-sm" type="button" onClick={() => setConfirmForget(false)}>Keep them</button>
              </>}
        </div>
      )}

      {note && <p className="sec" role="status" style={{ margin: '8px 0 0', color: note.ok ? 'var(--ink-accent)' : 'var(--ink-alarm)' }}>{note.text}</p>}
      <p className="sec" style={{ margin: '8px 0 0' }}>Sealed with AES-256-GCM under a key made from your passphrase (PBKDF2, 600,000 rounds). The passphrase is never stored. Forget it and no one can open the seal, including us; you can always forget the sealed keys and paste them again from your provider.</p>
    </div>
  );
}
