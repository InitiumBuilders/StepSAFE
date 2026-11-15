/* WHO YOU ARE, IN YOUR OWN WORDS.

   The Praxis Profile carries a bio, a mantra, a favorite quote, your strongest
   anchors, two honest paragraphs, your cyber security goals and your systems
   practitioner goals. Above them stands your Unitium Code Name. You can change
   it whenever you want, and every change is logged with your own account of
   why. The log is private: it lives on this device and in your export, and it
   a share link carries only the name. */

import React, { useEffect, useRef, useState } from 'react';
import { useS, type PraxisProfile, type CodeNameEntry } from '../lib/state';
import { Sound } from '../lib/sound';

type PromptKey = 'context' | 'inspiration' | 'shift' | 'newYou' | 'moves';

/* the five accounts every change of name carries */
const PROMPTS: { k: PromptKey; label: string; hint: string }[] = [
  { k: 'context', label: 'Context', hint: 'Where you are, and what led to this.' },
  { k: 'inspiration', label: 'Inspiration', hint: 'What, or who, inspired this name.' },
  { k: 'shift', label: 'The shift', hint: 'What made this foundation change or switch in your life.' },
  { k: 'newYou', label: 'Why are you a new you?', hint: 'Why you have transformed into the next evolution of you.' },
  { k: 'moves', label: 'Now what will you set off and do?', hint: 'Cast off into your next strongest moves.' },
];

const EMPTY: Record<PromptKey, string> = { context: '', inspiration: '', shift: '', newYou: '', moves: '' };

const when = (t: number) => new Date(t).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

export function CodeName() {
  const { s, d } = useS();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [ans, setAns] = useState<Record<PromptKey, string>>(EMPTY);
  const [err, setErr] = useState('');
  const [glow, setGlow] = useState(false);
  const first = useRef<HTMLInputElement | null>(null);
  useEffect(() => { if (open) first.current?.focus(); }, [open]);

  const log = s.codeNameLog;
  const n = log.length;
  const since = n ? log[n - 1].at : 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const to = name.trim();
    if (!to) { setErr('Write the name first.'); return; }
    if (to === s.codeName) { setErr('That is already your code name.'); return; }
    const missing = PROMPTS.filter(p => !ans[p.k].trim());
    if (missing.length) {
      setErr('Every change is logged in full. Still to write: ' + missing.map(p => p.label).join(', ') + '.');
      return;
    }
    const entry: CodeNameEntry = {
      at: Date.now(), from: s.codeName, to,
      context: ans.context.trim(), inspiration: ans.inspiration.trim(), shift: ans.shift.trim(),
      newYou: ans.newYou.trim(), moves: ans.moves.trim(),
    };
    d({ t: 'code-name', entry });
    Sound.gratus();
    setOpen(false); setName(''); setAns(EMPTY); setErr('');
    setGlow(true);
    window.setTimeout(() => setGlow(false), 1600);
  }

  return (
    <section className="band" style={{ paddingTop: 0 }}>
      <div className={'pf-name mx-glass' + (glow ? ' named' : '')}>
        <div className="pf-name-main">
          <span className="mx-kicker">UNITIUM CODE NAME</span>
          {s.codeName
            ? <h2 className="pf-cn">{s.codeName}</h2>
            : <h2 className="pf-cn pf-cn-none">No name yet</h2>}
          <p className="sec" style={{ margin: 0 }}>
            {s.codeName
              ? 'Evolution ' + n + ' · since ' + when(since)
              : 'The name you move under. Change it whenever you want. Every change is logged, with your own account of why.'}
          </p>
        </div>
        <button className="btn btn-key" onClick={() => { setOpen(v => !v); setErr(''); }} aria-expanded={open}>
          {open ? 'Not now' : s.codeName ? 'Change your code name' : 'Take your code name'}
        </button>
      </div>

      {open && (
        <form className="panel pf-form" onSubmit={submit} noValidate>
          <label className="pf-field">
            <span className="label">{s.codeName ? 'NEW UNITIUM CODE NAME' : 'YOUR UNITIUM CODE NAME'}</span>
            <input ref={first} value={name} onChange={e => setName(e.target.value)} maxLength={48}
              placeholder={s.codeName ? 'The next evolution of you' : 'The name you move under'} aria-required="true" />
          </label>
          {PROMPTS.map(p => (
            <label className="pf-field" key={p.k}>
              <span className="label">{p.label.toUpperCase()}</span>
              <textarea rows={3} value={ans[p.k]} onChange={e => setAns(a => ({ ...a, [p.k]: e.target.value }))}
                placeholder={p.hint} aria-required="true" />
            </label>
          ))}
          <p className="sec pf-private">
            This log is private. It stays on this device and in your export. A share link carries only the name.
          </p>
          {err && <p className="pf-err" role="alert">{err}</p>}
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-key">{s.codeName ? 'Log the change and take the name' : 'Take the name'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Not now</button>
          </div>
        </form>
      )}

      {n > 0 && (
        <details className="pf-log">
          <summary>The log · {n} {n === 1 ? 'entry' : 'entries'} · private</summary>
          <ol>
            {[...log].reverse().map((e, i) => (
              <li key={e.at + ':' + i}>
                <div className="pf-log-head">
                  <strong>{e.from ? e.from + ' → ' + e.to : e.to}</strong>
                  <span>Evolution {n - i} · {when(e.at)}</span>
                </div>
                <dl>
                  {PROMPTS.map(p => (
                    <React.Fragment key={p.k}>
                      <dt>{p.label}</dt>
                      <dd>{e[p.k]}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}

/* the fields of the profile; the two honest paragraphs run full width */
type TextField = Exclude<keyof PraxisProfile, 'intentionAt'>;
const FIELDS: { k: TextField; label: string; hint: string; rows: number; wide?: boolean; honest?: boolean }[] = [
  { k: 'bio', label: 'Bio', hint: 'Who you are and where you stand today.', rows: 3, wide: true },
  { k: 'mantra', label: 'Mantra', hint: 'The line you move on.', rows: 2 },
  { k: 'quote', label: 'Favorite quote', hint: 'Words from someone else that hold for you.', rows: 2 },
  { k: 'anchors', label: 'Strongest anchors', hint: 'The people, practices and places that hold you steady. One per line.', rows: 4, wide: true },
  { k: 'strong', label: 'What you do well and really really well', hint: 'Say it plainly.', rows: 5, wide: true, honest: true },
  { k: 'help', label: 'What you need help with and what you want to work on', hint: 'Say it plainly.', rows: 5, wide: true, honest: true },
  { k: 'cyberGoals', label: 'Cyber security goals', hint: 'What you will be able to defend, prove or lead, and by when.', rows: 4 },
  { k: 'systemsGoals', label: 'Systems practitioner goals', hint: 'The systems you will learn to read, map and hold.', rows: 4 },
];

export function OwnWords() {
  const { s, d } = useS();
  const [draft, setDraft] = useState<PraxisProfile>(s.profile);
  const [saved, setSaved] = useState(false);
  const timer = useRef(0);
  useEffect(() => { setDraft(s.profile); }, [s.profile]);

  /* a field saves when you leave it */
  function commit(k: TextField) {
    if (draft[k] === s.profile[k]) return;
    d({ t: 'profile', patch: { [k]: draft[k] } });
    setSaved(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(false), 1800);
  }

  const filled = FIELDS.filter(f => s.profile[f.k].trim()).length;
  /* written words read as prose; the form returns on Edit, and stays until something is written */
  const [editing, setEditing] = useState(filled === 0);

  return (
    <section className="band" style={{ paddingTop: 0 }}>
      <div className="row-between" style={{ marginBottom: 'var(--s4)', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0 }}>In your own words</h2>
          <p className="sec" style={{ margin: '6px 0 0' }}>
            {filled === FIELDS.length ? 'Every field written.' : filled + ' of ' + FIELDS.length + ' written.' + (editing ? ' Each field saves when you leave it.' : '')}
          </p>
        </div>
        <span className="row" style={{ gap: 10, alignItems: 'center' }}>
          <span className="pf-saved" aria-live="polite">{saved ? 'Saved' : ''}</span>
          {filled > 0 && (
            <button className="btn btn-sm" onClick={() => setEditing(v => !v)} aria-pressed={editing}>{editing ? 'Done' : 'Edit'}</button>
          )}
        </span>
      </div>
      {editing ? (
        <div className="pf-grid">
          {FIELDS.map(f => (
            <label className={'pf-field' + (f.wide ? ' wide' : '')} key={f.k}>
              <span className="label">{f.honest && <em className="pf-honest">An honest paragraph · </em>}{f.label}</span>
              <textarea rows={f.rows} value={draft[f.k]} placeholder={f.hint}
                onChange={e => setDraft(dr => ({ ...dr, [f.k]: e.target.value }))}
                onBlur={() => commit(f.k)} />
            </label>
          ))}
        </div>
      ) : (
        <div className="pf-grid pf-read">
          {FIELDS.map(f => {
            const text = s.profile[f.k].trim();
            return (
              <div className={'pf-field' + (f.wide ? ' wide' : '') + (text ? '' : ' empty')} key={f.k}>
                <span className="label">{f.honest && <em className="pf-honest">An honest paragraph · </em>}{f.label}</span>
                {text ? <p className={f.k === 'mantra' || f.k === 'quote' ? 'pf-line' : ''}>{text}</p>
                  : <button className="pf-write" onClick={() => setEditing(true)}>Not written yet</button>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
