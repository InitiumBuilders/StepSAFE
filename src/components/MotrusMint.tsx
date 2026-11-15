/* Mint a MoTRUS model, and open or create the vault that keeps them. */

import React, { useState } from 'react';
import { FAMILY_LABEL, type ModuxFamily } from '../content/modux-schema';
import { useMotrus, type MotrusModel } from '../lib/motrus';
import { uid } from '../lib/state';

const FAMILIES = Object.keys(FAMILY_LABEL) as ModuxFamily[];

export function VaultGate({ compact = false }: { compact?: boolean }) {
  const v = useMotrus();
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  if (v.status === 'open') return null;
  if (v.status === 'unavailable') {
    return <p className="sec gx-note">This browser cannot seal a vault here (it needs a secure page). Models minted for one gauge still work.</p>;
  }
  /* not a <form>: the gate also sits inside the mint form, and forms cannot nest */
  async function go() {
    if (busy || !pass) return;
    setBusy(true); setMsg('');
    if (v.status === 'none') {
      if (pass.length < 8) { setMsg('Use at least 8 characters.'); setBusy(false); return; }
      if (pass !== pass2) { setMsg('The two passphrases differ.'); setBusy(false); return; }
      await v.create(pass);
    } else {
      const ok = await v.unlock(pass);
      if (!ok) setMsg('That passphrase does not open this vault.');
    }
    setPass(''); setPass2(''); setBusy(false);
  }
  return (
    <div className={'gx-vault' + (compact ? ' compact' : '')} role="group" aria-label="MoTRUS vault"
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void go(); } }}>
      <span className="tr-detail-label">{v.status === 'none' ? 'Create your MoTRUS vault' : 'Your MoTRUS vault is sealed'}</span>
      <p className="sec" style={{ margin: '4px 0 10px' }}>
        {v.status === 'none'
          ? 'Kept models are sealed with AES-GCM under your passphrase on this device. Your passphrase is not stored anywhere. Without it the vault stays sealed, for you and for us.'
          : 'Enter your passphrase to open it for this session.'}
      </p>
      <div className="gx-vault-row">
        <input type="password" autoComplete="new-password" value={pass} onChange={e => setPass(e.target.value)}
          placeholder="Passphrase" aria-label="Vault passphrase" className="mx-search" />
        {v.status === 'none' && (
          <input type="password" autoComplete="new-password" value={pass2} onChange={e => setPass2(e.target.value)}
            placeholder="Again" aria-label="Repeat the passphrase" className="mx-search" />
        )}
        <button type="button" className="btn btn-sm" disabled={busy || !pass} onClick={() => void go()}>{busy ? 'Working' : v.status === 'none' ? 'Create vault' : 'Open'}</button>
      </div>
      {msg && <p className="sec" style={{ color: 'var(--ink-alarm)', margin: '8px 0 0' }}>{msg}</p>}
    </div>
  );
}

export function MotrusMint({ onMinted, onCancel, allowKeep = true, keepOnly = false, initial }: {
  onMinted: (m: MotrusModel) => void;
  /** a starting point, such as a study card the model grows from */
  initial?: { name?: string; statement?: string; structure?: string; failsWhen?: string; family?: ModuxFamily | 'own' };
  onCancel?: () => void;
  allowKeep?: boolean;
  /** outside a gauge a model only makes sense kept */
  keepOnly?: boolean;
}) {
  const v = useMotrus();
  const [name, setName] = useState(initial?.name || '');
  const [statement, setStatement] = useState(initial?.statement || '');
  const [structure, setStructure] = useState(initial?.structure || '');
  const [failsWhen, setFailsWhen] = useState(initial?.failsWhen || '');
  const [family, setFamily] = useState<ModuxFamily | 'own'>(initial?.family || 'own');
  const [keep, setKeep] = useState(allowKeep && v.status !== 'unavailable');
  const [busy, setBusy] = useState(false);
  const canKeep = allowKeep && v.status !== 'unavailable';
  const needVault = keep && v.status !== 'open';
  const ready = name.trim().length >= 3 && statement.trim().length >= 10 && structure.trim().length >= 20 && !needVault;

  async function mint(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    const m: MotrusModel = {
      id: 'mt-' + uid(),
      name: name.trim().slice(0, 80),
      statement: statement.trim().slice(0, 400),
      structure: structure.trim().slice(0, 2400),
      failsWhen: failsWhen.trim().slice(0, 600),
      family,
      createdAt: Date.now(),
      reviews: {},
      kept: keep,
    };
    if (keep) await v.put(m);
    setBusy(false);
    onMinted(m);
  }

  return (
    <form className="gx-mint mx-glass" onSubmit={mint}>
      <h3 style={{ margin: 0 }}>Mint a MoTRUS model</h3>
      <p className="sec" style={{ margin: '6px 0 14px' }}>
        Write a structure of your own in the same shape as the catalog, with its parts and how it fails.
        In a gauge it costs 3 and can claim up to two threats.
      </p>
      <label className="gx-field"><span>Name</span>
        <input className="mx-search" value={name} onChange={e => setName(e.target.value)} maxLength={80} placeholder="What you call it" />
      </label>
      <label className="gx-field"><span>What it defeats</span>
        <input className="mx-search" value={statement} onChange={e => setStatement(e.target.value)} maxLength={400} placeholder="One line" />
      </label>
      <label className="gx-field"><span>The structure</span>
        <textarea className="mx-search" rows={4} value={structure} onChange={e => setStructure(e.target.value)} maxLength={2400}
          placeholder="The parts, who holds each one, and what flows between them" />
      </label>
      <label className="gx-field"><span>How it fails</span>
        <textarea className="mx-search" rows={2} value={failsWhen} onChange={e => setFailsWhen(e.target.value)} maxLength={600}
          placeholder="The conditions under which it stops working" />
      </label>
      <label className="gx-field"><span>Family</span>
        <select className="mx-search" value={family} onChange={e => setFamily(e.target.value as ModuxFamily | 'own')}>
          <option value="own">Its own family</option>
          {FAMILIES.map(f => <option key={f} value={f}>{FAMILY_LABEL[f]}</option>)}
        </select>
      </label>

      {!keepOnly && <fieldset className="gx-keep">
        <legend className="tr-detail-label">Where it lives</legend>
        <label className={'gx-radio' + (!canKeep ? ' off' : '')}>
          <input type="radio" name="keep" checked={keep} disabled={!canKeep} onChange={() => setKeep(true)} />
          <span>Keep it in my vault, sealed on this device</span>
        </label>
        <label className="gx-radio">
          <input type="radio" name="keep" checked={!keep} onChange={() => setKeep(false)} />
          <span>Use it for this gauge only. Nothing is stored, and it is gone when I leave.</span>
        </label>
      </fieldset>}
      {needVault && <VaultGate compact />}

      <div className="row" style={{ marginTop: 14, flexWrap: 'wrap' }}>
        <button className="btn btn-key" disabled={!ready || busy}>{busy ? 'Sealing' : 'Mint it'}</button>
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
