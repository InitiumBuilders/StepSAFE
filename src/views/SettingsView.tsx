/* SETTINGS — theme, mode tiers, guise, wallet, and the reset. */

import React, { useEffect, useState } from 'react';
import { GUISE_VOICE } from '../content/registry';
import type { Guise } from '../content/schema';
import { useS } from '../lib/state';
import { PRINCIPLES, foundPrinciples } from '../content/principles';
import { pwaSupported, canInstall, onInstallChange, promptInstall, isStandalone, isIos, keepAll, keptCount, offlineTotal, type KeepProgress } from '../lib/pwa';
import { speak, stopSpeaking, elevenFetch, elevenReady, voiceKeep, clearVoiceKeep, HONOR_VOICE } from '../lib/study/voice';
import { useEngine } from '../lib/engine';
import { SectionHead, useToast } from '../components/bits';
import { discoverWallets, connectWallet, shortAddr, chainName, type DiscoveredWallet } from '../lib/wallet';
import { providerLabel, providerReady } from '../lib/provider';
import { useKeyring, setSecret, adoptLegacyChecks } from '../lib/keyring';
import { KeyKeep } from '../components/KeyKeep';
import { checkMind, GAUGE_MODEL } from '../lib/gaugeMind';
import { chargeKeystone, Swarm } from '../lib/swarm';
import { localDay } from '../lib/day';
import { clearRooms } from '../lib/roomProgress';

const GUISES: Guise[] = ['male', 'female', 'one'];

const FIELD: React.CSSProperties = {
  padding: '12px 15px',
  borderRadius: 12,
  border: '1px solid var(--frame-strong)',
  background: 'var(--panel-2)',
  color: 'var(--ink)',
  fontSize: '1rem',
  fontFamily: 'var(--font-mono)',
  boxShadow: 'var(--inset)',
  width: '100%',
};

/* Fields excluded from an exported record: credentials never travel in a file
   the learner might email to themselves, and the route belongs to the device. */
/* treasury checks list a treasury's weak points: they live in the keyring and never travel in a record file */
const NEVER_EXPORT = ['provider', 'voice', 'route', 'checks'] as const;

export function SettingsView() {
  const { s, d } = useS();
  const { keys } = useKeyring();
  const found = foundPrinciples();
  /* the voice: a test line, and what is kept */
  const [voiceTest, setVoiceTest] = useState<{ busy: boolean; text: string | null; ok: boolean }>({ busy: false, text: null, ok: true });
  const [vkeep, setVkeep] = useState<{ passages: number; bytes: number }>({ passages: 0, bytes: 0 });
  useEffect(() => { voiceKeep().then(setVkeep); }, [voiceTest]);
  const testVoice = async () => {
    setVoiceTest({ busy: true, text: null, ok: true });
    const line = 'The next world class security leader is built one Step at a time.';
    if (s.voice.mode === 'eleven') {
      if (!elevenReady(s.voice)) { setVoiceTest({ busy: false, text: 'Paste an ElevenLabs key first.', ok: false }); return; }
      const { blob, result } = await elevenFetch(line, s.voice);
      if (!blob) { setVoiceTest({ busy: false, text: 'ElevenLabs did not answer: ' + (result.error || 'no audio') + '.', ok: false }); return; }
      await speak(line);
      setVoiceTest({ busy: false, text: result.fromKeep ? 'Read from the keep, nothing billed.' : 'Read by ElevenLabs on your key, and kept.', ok: true });
      return;
    }
    await speak(line);
    setVoiceTest({ busy: false, text: 'Read by your device.', ok: true });
  };
  /* on your device: the install prompt when the browser offers one, and the keep */
  const [installable, setInstallable] = useState(canInstall());
  const [standalone] = useState(isStandalone());
  const [keep, setKeep] = useState<KeepProgress | null>(null);
  const [kept, setKept] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => { const off = onInstallChange(() => setInstallable(canInstall())); keptCount().then(setKept); offlineTotal().then(setTotal); return off; }, []);
  const keepNow = () => { setKeep({ done: 0, total: 0, failed: 0, finished: false }); keepAll(p => { setKeep(p); if (p.finished) keptCount().then(setKept); }); };
  const eng = useEngine();
  const [wallets, setWallets] = useState<DiscoveredWallet[]>([]);
  const [scanning, setScanning] = useState(false);
  const [walletErr, setWalletErr] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [ioMsg, setIoMsg] = useState('');
  /* a restore moves to the Profile page, so its word to the learner travels as a toast, not a line here */
  const { push } = useToast();
  const [check, setCheck] = useState<{ busy?: boolean; ok?: boolean; text?: string }>({});
  async function runCheck() {
    setCheck({ busy: true });
    const r = await checkMind(s.provider);
    setCheck(r.ok
      ? { ok: true, text: 'Connected. Claude answered as ' + (r.model || 'your model') + (r.model && r.model !== GAUGE_MODEL ? '. Your key cannot use ' + GAUGE_MODEL + ', so the gauges will use this model.' : '.') }
      : { ok: false, text: 'Could not connect: ' + (r.error || 'no reply') + '.' });
  }
  useEffect(() => { chargeKeystone(); }, []);

  function exportRecord() {
    const clean: Record<string, unknown> = { ...(s as unknown as Record<string, unknown>) };
    for (const k of NEVER_EXPORT) delete clean[k];
    const payload = {
      kind: 'stepsafe-praxis-record',
      version: 1,
      exportedAt: new Date().toISOString(),
      handle: s.handle,
      record: clean,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stepsafe-praxis-' + (s.handle || 'record').replace(/[^a-z0-9]+/gi, '-').toLowerCase() +
      '-' + localDay() + '.json';
    a.click();
    URL.revokeObjectURL(url);
    setIoMsg('Exported. Keep it somewhere you would actually be able to find it — a backup you cannot restore is a receipt, not a recovery.');
  }

  function importRecord(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed?.kind !== 'stepsafe-praxis-record' || !parsed?.record) {
          setIoMsg('That file is not a StepSAFE record export.');
          return;
        }
        const rec = { ...parsed.record };
        const moved = adoptLegacyChecks(rec.checks);
        for (const k of NEVER_EXPORT) delete rec[k];
        d({ t: 'import', state: rec });
        const said = 'Restored ' + (parsed.handle || 'record') + ' from ' +
          String(parsed.exportedAt || '').slice(0, 10) + '. Your credentials on this device were left untouched.' +
          (moved ? ' The file also held ' + (moved === 1 ? 'a treasury check' : moved + ' treasury checks') + ' in plain text. ' + (moved === 1 ? 'It is' : 'They are') + ' held for this visit; seal ' + (moved === 1 ? 'it' : 'them') + ' on the check page to keep ' + (moved === 1 ? 'it' : 'them') + ', and delete the file.' : '');
        setIoMsg(said);
        push({ title: 'Record restored', body: said });
      } catch {
        setIoMsg('That file could not be read as JSON.');
      }
    };
    reader.readAsText(file);
  }

  async function scan() {
    setScanning(true); setWalletErr('');
    try {
      const found = await discoverWallets();
      setWallets(found);
      if (!found.length) setWalletErr('No browser wallet detected. Install MetaMask, Coinbase Wallet, Rabby, or any EIP-6963 wallet, then rescan.');
    } finally {
      setScanning(false);
    }
  }

  async function link(w: DiscoveredWallet) {
    setWalletErr('');
    try {
      const { address, chainId } = await connectWallet(w);
      eng.linkWallet(address, chainId, w.name);
    } catch (e) {
      setWalletErr(e instanceof Error ? e.message : 'Connection declined.');
    }
  }

  return (
    <div className="wrap">
      <SectionHead sigil="tune" kicker="SETTINGS" title="The controls." />

      <section className="band" style={{ paddingTop: 0 }} data-keystone data-essence="#60a5fa">
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>Light</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>
            Nocturne is the night sea: light speaks. Meridian is the daylight: ink speaks. Semble-Super-Dark-Mov is the black, built for the sharpest contrast.
          </p>
          <div className="row">
            <button className={'btn' + (s.theme === 'nocturne' ? ' btn-charge' : '')}
              aria-pressed={s.theme === 'nocturne'}
              onClick={() => { d({ t: 'theme', theme: 'nocturne' }); Swarm.setLight(false); }}>
              Nocturne
            </button>
            <button className={'btn' + (s.theme === 'meridian' ? ' btn-charge' : '')}
              aria-pressed={s.theme === 'meridian'}
              onClick={() => { d({ t: 'theme', theme: 'meridian' }); Swarm.setLight(true); }}>
              Meridian
            </button>
            <button className={'btn' + (s.theme === 'mov' ? ' btn-charge' : '')}
              aria-pressed={s.theme === 'mov'}
              onClick={() => { d({ t: 'theme', theme: 'mov' }); Swarm.setLight(false); }}>
              Semble-Super-Dark-Mov
            </button>
          </div>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>Display</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>The size of everything, and how much moves. Both stay on this device.</p>
          <div className="disp-grid">
            <div className="disp-row">
              <span className="label">Text size</span>
              <div className="row">
                {([['standard', 'Standard'], ['large', 'Large'], ['largest', 'Largest']] as const).map(([k, l]) => (
                  <button key={k} className={'btn btn-sm' + (s.textSize === k ? ' btn-charge' : '')} aria-pressed={s.textSize === k} onClick={() => d({ t: 'display', textSize: k })}>{l}</button>
                ))}
              </div>
              <p className="disp-sample">A Step, a room, the gauge. This line shows the size you chose.</p>
            </div>
            <div className="disp-row">
              <span className="label">Motion</span>
              <div className="row">
                <button className={'btn btn-sm' + (s.motion === 'full' ? ' btn-charge' : '')} aria-pressed={s.motion === 'full'} onClick={() => d({ t: 'display', motion: 'full' })}>Full</button>
                <button className={'btn btn-sm' + (s.motion === 'calm' ? ' btn-charge' : '')} aria-pressed={s.motion === 'calm'} onClick={() => d({ t: 'display', motion: 'calm' })}>Calm</button>
              </div>
              <p className="sec" style={{ margin: '10px 0 0', fontSize: '0.9rem' }}>Calm stills the orbs, the reveals and the glow, and lands every number at once.</p>
            </div>
            <div className="disp-row">
              <span className="label">Single-key shortcuts</span>
              <div className="row">
                <button className={'btn btn-sm' + (s.shortcuts !== 'off' ? ' btn-charge' : '')} aria-pressed={s.shortcuts !== 'off'} onClick={() => d({ t: 'display', shortcuts: 'on' })}>On</button>
                <button className={'btn btn-sm' + (s.shortcuts === 'off' ? ' btn-charge' : '')} aria-pressed={s.shortcuts === 'off'} onClick={() => d({ t: 'display', shortcuts: 'off' })}>Off</button>
              </div>
              <p className="sec" style={{ margin: '10px 0 0', fontSize: '0.9rem' }}>When on, / opens Find and ? lists the shortcuts; on a study card, L reads it aloud and 1 to 4 grade it. Turn them off if you use speech input. Ctrl or Cmd with K opens Find either way.</p>
            </div>
          </div>
          {found.length > 0 && (
            <div className="disp-principles">
              <span className="label">Principles found {'·'} {found.length} of {PRINCIPLES.length}</span>
              <ul>{PRINCIPLES.filter(p => found.includes(p.id)).map(p => <li key={p.id}><strong>{p.name}</strong><span>{p.line} Here: {p.here}</span></li>)}</ul>
            </div>
          )}
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>The voice</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>Every reading in the Praxis, a card in StudyMode or a whole chapter, comes through one voice. Your device can read with its own. With an ElevenLabs key of your own it reads with a voice from your library, and every passage is kept on this device so it is paid for once.</p>
          <div className="row" style={{ marginBottom: 'var(--s4)', flexWrap: 'wrap' }}>
            {([['device', 'My device'], ['eleven', 'My ElevenLabs key']] as const).map(([m, label]) => (
              <button key={m} className={'btn' + (s.voice.mode === m ? ' btn-charge' : '')} aria-pressed={s.voice.mode === m} onClick={() => d({ t: 'voice', patch: { mode: m } })}>{label}</button>
            ))}
          </div>
          {s.voice.mode === 'eleven' && (
            <div className="stack-sm" style={{ marginBottom: 'var(--s4)' }}>
              <p className="sec" style={{ margin: 0 }}>The key goes browser direct to api.elevenlabs.io. It never goes to the StepSAFE server, the record never stores it, and an exported record never carries it. Use a key budgeted for this, and revoke it when you are done.</p>
              <KeyKeep />
              <label className="label" htmlFor="elkey">ElevenLabs API key</label>
              <input id="elkey" type="password" autoComplete="off" spellCheck={false} value={keys.elevenKey} onChange={e => setSecret('elevenKey', e.target.value)} placeholder="xi-…" style={FIELD} />
              <label className="label" htmlFor="elvoice">Voice id</label>
              <input id="elvoice" spellCheck={false} value={s.voice.voiceId} onChange={e => d({ t: 'voice', patch: { voiceId: e.target.value } })} placeholder={HONOR_VOICE} style={FIELD} />
              <p className="sec" style={{ margin: 0 }}>Honor by default. Any voice id from your ElevenLabs library works; a voice that is not in your library falls back to one every account has.</p>
            </div>
          )}
          {s.voice.mode === 'device' && (
            <div className="stack-sm" style={{ marginBottom: 'var(--s4)' }}>
              <label className="label" htmlFor="vrate">Reading speed {'·'} {s.voice.rate.toFixed(2)}</label>
              <input id="vrate" type="range" min={0.7} max={1.3} step={0.05} value={s.voice.rate} onChange={e => d({ t: 'voice', patch: { rate: parseFloat(e.target.value) } })} aria-label="Reading speed" />
            </div>
          )}
          <div className="row" style={{ alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-sm" disabled={voiceTest.busy} onClick={testVoice}>{voiceTest.busy ? 'Reading' : 'Test the voice'}</button>
            <button className="btn btn-sm btn-ghost" onClick={() => stopSpeaking()}>Stop</button>
            {voiceTest.text && <span className="sec" style={{ margin: 0, color: voiceTest.ok ? 'var(--ink-accent)' : 'var(--ink-alarm)' }}>{voiceTest.text}</span>}
          </div>
          {vkeep.passages > 0 && (
            <p className="sec" style={{ margin: '12px 0 0', fontSize: '0.9rem' }}>
              {vkeep.passages} {vkeep.passages === 1 ? 'passage' : 'passages'} of voice kept on this device, about {(vkeep.bytes / 1048576).toFixed(1)} MB. <button className="btn btn-ghost btn-sm" onClick={() => clearVoiceKeep().then(() => voiceKeep().then(setVkeep))}>Clear the voice keep</button>
            </p>
          )}
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>On your device</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>The Praxis installs like an app and can be kept whole on this device, so StudyMode, the gauges and the guides open with no signal. Your record already lives here.</p>
          <div className="row">
            {standalone ? <span className="chip on">Installed</span>
              : installable ? <button className="btn btn-key" onClick={() => { promptInstall().then(() => setInstallable(canInstall())); }}>Install the app</button>
              : isIos() ? <span className="sec" style={{ margin: 0 }}>On iPhone: Share, then Add to Home Screen.</span>
              : <span className="sec" style={{ margin: 0 }}>Your browser will offer the install from its own menu.</span>}
            <button className="btn" onClick={keepNow} disabled={!pwaSupported() || (keep !== null && !keep.finished)}>
              {keep && !keep.finished ? 'Keeping ' + keep.done + (keep.total ? ' of ' + keep.total : '') : kept > 20 ? 'Keep it again' : 'Keep the Praxis on this device'}
            </button>
          </div>
          <p className="sec" style={{ margin: '12px 0 0', fontSize: '0.9rem' }}>
            {keep?.error === 'no-worker' ? 'The keep runs on the live site, in a browser that can hold it.'
              : keep?.error ? 'The keep stopped: ' + keep.error
              : keep?.finished ? 'Kept ' + (keep.done - keep.failed) + ' of ' + keep.total + ' files.' + (keep.failed ? ' ' + keep.failed + ' did not come through; keep it again when you have signal.' : ' The Praxis opens with no signal.')
              : kept > 20 ? kept + ' files kept on this device' + (total ? ' of ' + total + ' in the build.' : '.')
              : total ? total + ' files in the build. Nothing kept yet beyond what you have opened.' : 'The files you open are kept as you go.'}
          </p>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>Mode — NOVUS and MOTUS</h3>
          <div className="grid grid-2" style={{ marginBottom: 'var(--s4)' }}>
            <div className="blk-callout" style={s.mode === 'novus' ? { borderColor: 'var(--cyan)' } : undefined}>
              <h4 style={{ marginBottom: 8 }}>NOVUS MODE</h4>
              <p className="sec">
                For people just getting started, or starting at the beginning. Every foundation,
                every core Step, the full glossary, the starter simulations. Open to anyone —
                from $23/month. Beginning is the honorable place to begin.
              </p>
              {s.mode !== 'novus' && (
                <button className="btn btn-sm" onClick={() => d({ t: 'mode', mode: 'novus' })}>
                  Switch to NOVUS
                </button>
              )}
            </div>
            <div className="blk-callout" style={s.mode === 'motus' ? { borderColor: 'var(--gold)' } : undefined}>
              <h4 style={{ marginBottom: 8 }}>MOTUS MODE</h4>
              <p className="sec">
                The all-in tier. The full project-based Praxis Framework, the advanced and
                outlier-level guides, custom pathways and expectations — planned directly with
                August, priced to your commitment. For the movers.
              </p>
              <div className="row">
                <a className="btn btn-sm btn-key" href="mailto:August@MotusMoves.US?subject=MOTUS%20MODE%20Application">
                  Apply — August@MotusMoves.US
                </a>
                {s.mode !== 'motus' && (
                  <button className="btn btn-sm btn-ghost" onClick={() => d({ t: 'mode', mode: 'motus' })}>
                    Preview MOTUS content
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="sec" style={{ margin: 0 }}>
            You can transition or upgrade at any time. Current mode: <strong>{s.mode.toUpperCase()}</strong>.
          </p>
          <button className="btn btn-sm btn-ghost" style={{ marginTop: 'var(--s3)' }} onClick={() => d({ t: 'route', view: 'welcome' })}>See the welcome page</button>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>Your guide's guise</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>
            The substance never changes — only the register. Male, Female, or One.
          </p>
          <div className="row" style={{ marginBottom: 'var(--s3)' }}>
            {GUISES.map(g => (
              <button key={g} className={'btn' + (s.guise === g ? ' btn-charge' : '')}
                aria-pressed={s.guise === g} onClick={() => d({ t: 'guise', guise: g })}>
                {GUISE_VOICE[g].name}
              </button>
            ))}
          </div>
          {s.guise && <p className="sec" style={{ margin: 0 }}>{GUISE_VOICE[s.guise].note}</p>}
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>Wallet — your record on the graph</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>
            Link an Ethereum wallet (MetaMask, Coinbase Wallet, Rabby, and every EIP-6963 wallet)
            to attach your address to your Praxis Profile and mint milestones as Intuition
            $TRUST-graph attestations. <strong>Read-only by design:</strong> this school never
            requests signatures, never constructs transactions, and never touches keys — exactly
            the discipline it teaches.
          </p>
          {s.wallet ? (
            <div className="row">
              <span className="chip on mono">{shortAddr(s.wallet.address)}</span>
              <span className="chip">{chainName(s.wallet.chainId)}</span>
              <span className="chip">{s.wallet.label}</span>
              <button className="btn btn-sm btn-ghost" onClick={() => d({ t: 'wallet', wallet: null })}>
                Unlink
              </button>
            </div>
          ) : (
            <div className="stack-sm">
              <div className="row">
                <button className="btn btn-key" disabled={scanning} onClick={scan}>
                  {scanning ? 'Scanning…' : wallets.length ? 'Rescan wallets' : 'Detect wallets'}
                </button>
                {wallets.map(w => (
                  <button key={w.uuid} className="btn" onClick={() => link(w)}>
                    {w.icon && <img src={w.icon} alt="" width={20} height={20} style={{ borderRadius: 5 }} />}
                    Link {w.name}
                  </button>
                ))}
              </div>
              {walletErr && <p className="sec" style={{ margin: 0, color: 'var(--ink-warn)' }}>{walletErr}</p>}
            </div>
          )}
        </div>
      </section>

      {/* ---- where Seva's mind runs ---- */}
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>Seva's mind — bring your own</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>
            By default Seva runs on the StepSAFE server, whose key never reaches your browser.
            You can instead point Seva at your own Anthropic key or your own Davara instance.
          </p>

          <div className="row" style={{ marginBottom: 'var(--s4)', flexWrap: 'wrap' }}>
            {([
              ['shared', 'StepSAFE server'],
              ['anthropic', 'My Anthropic key'],
              ['davara', 'My Davara instance'],
            ] as const).map(([m, label]) => (
              <button key={m} className={'btn' + (s.provider.mode === m ? ' btn-charge' : '')}
                aria-pressed={s.provider.mode === m}
                onClick={() => d({ t: 'provider', patch: { mode: m } })}>
                {label}
              </button>
            ))}
          </div>

          {s.provider.mode !== 'shared' && (
            <div className="panel panel-2" style={{ marginBottom: 'var(--s4)', borderColor: 'rgba(232,196,107,0.4)' }}>
              <span className="label" style={{ display: 'block', marginBottom: 8 }}>
                READ THIS BEFORE YOU PASTE A CREDENTIAL
              </span>
              <p className="sec" style={{ margin: 0 }}>
                Your key goes browser direct to the provider you choose and never to the StepSAFE server. The
                record never stores it: it is held for this visit, or sealed on this device under a passphrase
                you choose. While it is open, this page can use it, and so could any script running on this
                origin; the site's Content-Security-Policy narrows where such a script could send it. Use a key
                scoped and budgeted for this, not your organisation's production key, and revoke it when you
                are done. On a shared or public machine, use the server option instead.
              </p>
            </div>
          )}
          {s.provider.mode !== 'shared' && <KeyKeep />}

          {s.provider.mode === 'anthropic' && (
            <div className="stack-sm">
              <label className="label" htmlFor="antkey">Anthropic API key</label>
              <input id="antkey" type="password" autoComplete="off" spellCheck={false}
                value={keys.anthropicKey}
                onChange={e => setSecret('anthropicKey', e.target.value)}
                placeholder="sk-ant-…"
                style={FIELD} />
              <label className="label" htmlFor="antmodel">Model</label>
              <input id="antmodel" value={s.provider.model} spellCheck={false}
                onChange={e => d({ t: 'provider', patch: { model: e.target.value } })}
                placeholder="claude-sonnet-5-5" style={FIELD} />
              <p className="sec" style={{ margin: 0 }}>
                Sent directly to api.anthropic.com with the browser-access header. Nothing transits
                our infrastructure. {providerReady(s.provider)
                  ? 'Key looks well-formed.'
                  : 'A key starting sk- is required before this route is used.'}
              </p>
              <div className="row" style={{ alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-sm" disabled={!providerReady(s.provider) || check.busy} onClick={runCheck}>
                  {check.busy ? 'Checking' : 'Check the connection'}
                </button>
                {check.text && <span className="sec" style={{ color: check.ok ? 'var(--ink-accent)' : 'var(--ink-alarm)' }}>{check.text}</span>}
              </div>
              <p className="sec" style={{ margin: 0 }}>
                Modux Gauges use this key for Claude's reviews of your runs and MoTRUS models, for forging scenarios, and for reflecting on your record. They ask for {GAUGE_MODEL} first.
              </p>
            </div>
          )}

          {s.provider.mode === 'davara' && (
            <div className="stack-sm">
              <label className="label" htmlFor="dvurl">Davara endpoint URL</label>
              <input id="dvurl" value={s.provider.davaraUrl} spellCheck={false}
                onChange={e => d({ t: 'provider', patch: { davaraUrl: e.target.value } })}
                placeholder="https://your-davara-instance/…/chat" style={FIELD} />
              <p className="sec" style={{ margin: 0 }}>This site connects only to the addresses its security policy names, so your instance needs to be at davara.dev or one of its subdomains.</p>
              <label className="label" htmlFor="dvtok">DMAT / bearer token</label>
              <input id="dvtok" type="password" autoComplete="off" spellCheck={false}
                value={keys.davaraToken}
                onChange={e => setSecret('davaraToken', e.target.value)}
                placeholder="token" style={FIELD} />
              <details className="reveal">
                <summary>What your endpoint has to accept</summary>
                <div className="reveal-body">
                  <p className="sec" style={{ marginTop: 0 }}>
                    A POST with <code>Authorization: Bearer &lt;token&gt;</code> and a JSON body of
                    <code> {'{ system, messages: [{ role, content }], max_tokens, model }'}</code>.
                  </p>
                  <p className="sec" style={{ margin: 0 }}>
                    Reply with <code>{'{ text: "…" }'}</code>, or an Anthropic-shaped
                    <code> {'{ content: [{ type: "text", text }] }'}</code>. Anything else is treated
                    as a failure and Seva falls back to authored counsel rather than going silent.
                    Your endpoint must send CORS headers permitting this origin.
                  </p>
                </div>
              </details>
            </div>
          )}

          <p className="sec" style={{ marginTop: 'var(--s4)', marginBottom: 0 }}>
            Currently routing to <strong>{providerLabel(s.provider)}</strong>. If a route fails for
            any reason, Seva answers from the authored line-book instead — the guide never goes
            silent, and the chat tells you which mind replied.
          </p>
          <p className="sec" style={{ marginTop: 'var(--s3)', marginBottom: 0 }}>
            Dasha is the Dash Support Team's own mind. She runs at DashSupport.Team on her own model and tools, whichever
            route is chosen here. When you speak with her, your conversation with her goes to her server and to the model
            she runs on. Your record stays on this device. Her voice is hers too: when you listen to one of her replies,
            her server sends that reply's text to ElevenLabs to be read, and if her voice is off this device reads it.
            On a voice call your browser turns your speech into text, and may use its maker's online service to do it.
            This page sends no sound anywhere.
          </p>
        </div>
      </section>

      {/* ---- the record itself ---- */}
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>Your record — export and restore</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>
            Everything you have earned lives in this browser. Clearing site data destroys it. Export
            a signed-in-time snapshot you can keep, move to another machine, or restore after a
            reset. Credentials and treasury checks are deliberately excluded from the file.
          </p>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button className="btn btn-key" onClick={exportRecord}>Export my record</button>
            <label className="btn" style={{ cursor: 'pointer' }}>
              Restore from file
              <input type="file" accept="application/json" style={{ display: 'none' }}
                onChange={importRecord} />
            </label>
          </div>
          {ioMsg && <p className="sec" style={{ marginTop: 12, marginBottom: 0 }}>{ioMsg}</p>}
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel" style={{ borderColor: 'rgba(255,179,179,0.35)' }}>
          <h3 style={{ marginBottom: 'var(--s3)' }}>Reset the journey</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>
            Erases every step, page, chapter, award, project, and conversation on this device.
            There is no undo — which is itself a lesson about backups.
          </p>
          {!confirmReset ? (
            <button className="btn" onClick={() => setConfirmReset(true)}>Reset…</button>
          ) : (
            <div className="row">
              <button className="btn" style={{ borderColor: 'var(--ink-alarm)' }}
                onClick={() => { d({ t: 'reset' }); clearRooms(); setConfirmReset(false); }}>
                Yes — erase everything
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Keep my record</button>
            </div>
          )}
        </div>
      </section>

      {/* ---- the public promises: how to report a security problem, what leaves the device, the accessibility aim ---- */}
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel">
          <h3 style={{ marginBottom: 'var(--s3)' }}>Security, privacy and access</h3>
          <p className="sec" style={{ marginBottom: 'var(--s4)' }}>
            How to report a security problem, what leaves this device and when, and the accessibility standard the app aims for. StepSAFE’s own record reads these promises from the site in your browser.
          </p>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-key" onClick={() => d({ t: 'route', view: 'trust' })}>StepSAFE’s own record</button>
            <a className="btn" href="/security.html">Report a security problem</a>
            <a className="btn" href="/privacy.html">Privacy</a>
            <a className="btn" href="/accessibility.html">Accessibility</a>
          </div>
        </div>
      </section>
    </div>
  );
}
