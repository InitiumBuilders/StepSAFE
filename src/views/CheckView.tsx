/* DASH DEFENDERS · THE CHECKS BEFORE LAUNCH. Each check is twelve statements a project answers about itself;
   the page shows what holds, the gaps in the order to close them, and the structures that close each one,
   and writes a dated record for a reviewer. A check lists a project's weak points, so it is held by the
   keyring (lib/checkstore.ts): for this visit, or sealed on this device under the keyring's passphrase. It
   leaves only when the learner copies or saves the record.

   With no check named in the route, the page lists the checks, each with the ring of its latest run. With
   one named, its ring is the figure (components/CheckRing.tsx) and one statement stands in front at a time,
   answered by a tap or a key. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { emojiOf } from '../content/modux/emoji';
import type { CheckAnswer, CheckItem, CheckKind } from '../content/check/types';
import { CHECKS, checkKind, isCheckKind } from '../content/check';
import { csfName } from '../content/check/csf';
import { moduxById, awardById } from '../content/registry';
import type { Award } from '../content/schema';
import { useS, uid } from '../lib/state';
import { useEngine } from '../lib/engine';
import { scoreCheck, checkRecord, checkDate, launchOf, launchRecord, inline, lastReading, ANSWER_LABEL, type TreasuryCheck } from '../lib/check';
import { useChecks, newCheck, nameCheck, answerCheck, removeCheck, setReading, setReadings } from '../lib/checkstore';
import { lessonsFor, readyToRecheck, KIND_LABEL } from '../lib/learn';
import { spineCoverage } from '../lib/spine';
import { readDomainLocks, readDnsRecords, readMultisig, readScorecard, contradicts, shownBy, evidenceSource, subjectOf, cleanDomain, isScorecardKind, type EvidenceSource, type Reading, type ScorecardKind } from '../lib/evidence';
import { sealWith, unlock, lock, passphraseOk, MIN_PASSPHRASE, type KeyringStatus } from '../lib/keyring';
import { SectionHead, TIER_NAMES } from '../components/bits';
import { KeyRing, PartRows, AnswerGlyph, partClass } from '../components/CheckRing';

const ANSWERS: CheckAnswer[] = ['yes', 'partly', 'no', 'unsure'];
const KEY_HINT: Record<CheckAnswer, string> = { yes: 'Y', partly: 'P', no: 'N', unsure: 'S', na: 'D' };
const KEY_ANSWER: Record<string, CheckAnswer> = { y: 'yes', '1': 'yes', p: 'partly', '2': 'partly', n: 'no', '3': 'no', s: 'unsure', '4': 'unsure', d: 'na', '5': 'na' };
const kindId = (c: TreasuryCheck) => c.kind || 'treasury';

/* ---------- where the checks live ---------- */

function CheckKeep({ status, count, legacy }: { status: KeyringStatus; count: number; legacy: boolean }) {
  const [pass, setPass] = useState('');
  const [again, setAgain] = useState('');
  const [sealing, setSealing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  const run = async (f: () => Promise<boolean>, good: string, bad: string) => {
    setBusy(true); setNote(null);
    const r = await f();
    setBusy(false); setPass(''); setAgain('');
    if (r) setSealing(false);
    setNote(r && !good ? null : { ok: r, text: r ? good : bad });
  };

  const line =
    status === 'unavailable' ? 'This browser cannot seal them here (it needs a secure connection with Web Crypto), so a check is held for this visit only.'
    : status === 'open' ? 'Sealed on this device under your keyring passphrase, and open for this visit.'
    : status === 'locked' ? 'Your earlier checks are sealed on this device. Enter your keyring passphrase to open them.' + (count ? ' Any check you make before opening them is added to them.' : '')
    : count ? 'Held for this visit only. Close this tab and ' + (count === 1 ? 'it is' : 'they are') + ' gone, unless you seal ' + (count === 1 ? 'it' : 'them') + ' on this device.'
    : 'A check is held for this visit only, unless you seal it on this device with a passphrase.';

  return (
    <section className={'ck-keep k-' + status} aria-label="Where your checks live">
      <svg className="ck-keep-lock" viewBox="0 0 24 24" aria-hidden>
        <rect x="5" y="10.5" width="14" height="10" rx="3" />
        <path d={status === 'open' || status === 'session' || status === 'unavailable' ? 'M8.5 10.5V7.5a3.5 3.5 0 0 1 6.6-1.6' : 'M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3'} />
      </svg>
      <div className="ck-keep-body">
        <p className="ck-keep-line"><span className="label">Where your checks live</span>{line}</p>
        {legacy && status !== 'open' && (
          <p className="sec">Checks were found in plain text, from an earlier version of this page or a restored record file. They have been moved out of plain storage and are held for this visit. Seal them to keep them.</p>
        )}

        {status === 'session' && count > 0 && !sealing && (
          <div className="ck-keep-act"><button className="btn btn-sm" type="button" onClick={() => { setSealing(true); setNote(null); }}>Seal on this device</button></div>
        )}
        {status === 'session' && sealing && (
          <form className="ck-keep-form" onSubmit={(e) => { e.preventDefault(); if (passphraseOk(pass) && pass === again) run(() => sealWith(pass), 'Sealed. Next visit, your passphrase opens them.', 'Could not seal on this device.'); }}>
            <label>
              <span className="label">A passphrase, {MIN_PASSPHRASE} characters or more</span>
              <input type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} />
            </label>
            <label>
              <span className="label">The same passphrase again</span>
              <input type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} />
            </label>
            <div className="ck-keep-act">
              <button className="btn btn-sm btn-key" type="submit" disabled={busy || !passphraseOk(pass) || pass !== again}>{busy ? 'Sealing' : 'Seal them'}</button>
              <button className="btn btn-sm btn-ghost" type="button" onClick={() => { setSealing(false); setPass(''); setAgain(''); }}>Not now</button>
              {pass && again && pass !== again && <span className="sec">The two do not match yet.</span>}
            </div>
            <p className="sec">Sealed with AES-256-GCM under a key made from your passphrase. The same passphrase seals any model keys you keep in Settings. It is never stored: forget it and no one can open the seal, including us.</p>
          </form>
        )}

        {status === 'locked' && (
          <form className="ck-keep-form ck-keep-open" onSubmit={(e) => { e.preventDefault(); if (pass) run(() => unlock(pass), '', 'That passphrase does not open them.'); }}>
            <label>
              <span className="label">Your keyring passphrase</span>
              <input type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
            </label>
            <div className="ck-keep-act"><button className="btn btn-sm" type="submit" disabled={busy || !pass}>{busy ? 'Opening' : 'Open them'}</button></div>
          </form>
        )}

        {status === 'open' && (
          <div className="ck-keep-act"><button className="btn btn-sm" type="button" onClick={() => { lock(); setNote({ ok: true, text: 'Locked, with your keys. They stay sealed on this device.' }); }}>Lock now</button></div>
        )}

        {note && <p className={'sec ck-keep-note' + (note.ok ? '' : ' bad')} role="status">{note.text}</p>}
      </div>
    </section>
  );
}

/* ---------- the public record ---------- */

/* what each public record asks for, and what the page says before the first read */
const SOURCE_COPY: Record<EvidenceSource, { line: string; label: string; placeholder: string }> = {
  rdap: {
    line: 'Read the domain’s locks from its registry’s public record, so this answer need not rest on your word. The registry will see which domain you asked about.',
    label: 'The domain', placeholder: 'example.org',
  },
  dns: {
    line: 'Read where the domain’s records point from Google Public DNS: its name servers, addresses, mail servers and CAA. Each reading is a dated copy, and the next one says what changed. Google will see which domain you asked about.',
    label: 'The domain', placeholder: 'example.org',
  },
  insight: {
    line: 'Read the treasury address from insight.dash.org, a public Dash explorer, so this answer need not rest on your word. The explorer will see which address you asked about.',
    label: 'The treasury address', placeholder: 'A Dash address starting with 7',
  },
  scorecard: {
    line: 'Read the repository’s published results from OpenSSF Scorecard, so this answer need not rest on your word. One read fills every statement in this check that Scorecard can show. Scorecard will see which repository you asked about.',
    label: 'The repository', placeholder: 'github.com/owner/repo',
  },
};

/* a statement a public record can show: read it, say what it showed and when, and when the answer claims
   more than the record allows, say so plainly and let the project choose */
function ReadRecord({ run, runs, kind, item, answer, onAnswer }: { run: TreasuryCheck; runs: TreasuryCheck[]; kind: CheckKind; item: CheckItem; answer?: CheckAnswer; onAnswer: (a: CheckAnswer) => void }) {
  const ev = item.evidence!;
  const source = evidenceSource(ev);
  const copy = SOURCE_COPY[source];
  const reading = run.evidence?.[item.id];
  /* statements that read the same record share what was typed for it: one treasury address, one repository, one domain */
  const other = Object.values(run.evidence || {}).find(r => subjectOf(evidenceSource(r.kind)) === subjectOf(source));
  const [value, setValue] = useState(reading?.subject || other?.subject || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [kept, setKept] = useState(false);
  const sameRead = kind.items.filter(i => i.evidence && evidenceSource(i.evidence) === source);
  async function read() {
    setBusy(true); setErr('');
    try {
      if (source === 'scorecard') {
        const kinds = [...new Set(sameRead.map(i => i.evidence).filter((k): k is ScorecardKind => !!k && isScorecardKind(k)))];
        const got = await readScorecard(value, kinds);
        const byItem: Record<string, Reading> = {};
        for (const i of sameRead) { const r = got.readings[i.evidence as ScorecardKind]; if (r) byItem[i.id] = r; }
        setReadings(run.id, byItem);
        setValue(got.subject);
      } else if (source === 'dns') {
        setReading(run.id, item.id, await readDnsRecords(value, lastReading(runs, run, item.id, ev, cleanDomain(value))));
      } else {
        setReading(run.id, item.id, source === 'rdap' ? await readDomainLocks(value) : await readMultisig(value, ev as 'multisig-agree' | 'multisig-spare'));
      }
      setKept(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'The record could not be read.');
    }
    setBusy(false);
  }
  const against = contradicts(answer, reading);
  const shown = shownBy(answer, reading);
  const filled = source === 'scorecard' && reading ? sameRead.filter(i => run.evidence?.[i.id]?.subject === reading.subject).length : 0;
  return (
    <div className={'ck-ev' + (against ? ' against' : shown ? ' shown' : '')}>
      <span className="label">The public record</span>
      {!reading && <p className="ck-ev-line">{copy.line}</p>}
      <form className="ck-ev-form" onSubmit={(e) => { e.preventDefault(); if (value.trim() && !busy) read(); }}>
        <label>
          <span className="label">{copy.label}</span>
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={copy.placeholder} spellCheck={false} autoCapitalize="off" autoComplete="off" />
        </label>
        <button className="btn btn-sm" type="submit" disabled={busy || !value.trim()}>{busy ? 'Reading' : reading ? 'Read it again' : 'Read it from the public record'}</button>
      </form>
      {err && <p className="ck-ev-err" role="alert">{err}</p>}
      {reading && (
        <div className="ck-ev-found" role="status">
          <p><strong>{reading.found}</strong>{reading.unseen ? ' ' + reading.unseen : ''}</p>
          <p className="sec">Read {reading.read} for {reading.subject}.{filled > 1 ? ' The same read filled ' + (filled - 1) + ' other statement' + (filled > 2 ? 's' : '') + ' in this check.' : ''} <a href={reading.url} target="_blank" rel="noopener noreferrer">See the record</a></p>
          {reading.allows === 'open' && <p className="sec">This record does not settle your answer either way.</p>}
          {against && reading.allows !== 'open' && !kept && (
            <div className="ck-ev-against">
              <p>You answered {ANSWER_LABEL[answer!]}. The record allows {ANSWER_LABEL[reading.allows]} at most.</p>
              <div className="ck-keep-act">
                <button className="btn btn-sm" type="button" onClick={() => reading.allows !== 'open' && onAnswer(reading.allows)}>Change my answer to {ANSWER_LABEL[reading.allows]}</button>
                <button className="btn btn-sm btn-ghost" type="button" onClick={() => setKept(true)}>Keep my answer</button>
              </div>
            </div>
          )}
          {against && reading.allows !== 'open' && kept && <p className="sec">Your answer stays {ANSWER_LABEL[answer!]}, and the record you hand a reviewer will say the public record allows {ANSWER_LABEL[reading.allows]} at most.</p>}
          {shown && <p className="ck-ev-shown">This record backs your answer.</p>}
        </div>
      )}
    </div>
  );
}

/* ---------- the page ---------- */

export function CheckView() {
  const { s } = useS();
  const id = s.route.id;
  return isCheckKind(id) ? <CheckRun key={id} kind={checkKind(id)} /> : <CheckHub />;
}

/* the checks before launch, each with the ring of its latest run, and the launch record that joins them */
function CheckHub() {
  const { s: st, d } = useS();
  const { checks, status, legacy } = useChecks();
  const L = useMemo(() => launchOf(checks, CHECKS), [checks]);
  const ready = (id: string) => readyToRecheck(id, st);
  const spine = useMemo(() => spineCoverage(), []);
  const [copied, setCopied] = useState(false);
  const modelName = (id: string) => moduxById(id)?.name || id;
  const ran = L.runs.filter(r => r.run);
  const top = L.gaps.slice(0, 6);
  const record = () => launchRecord(checks, CHECKS, modelName);
  async function copy() {
    try { await navigator.clipboard.writeText(record()); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* the record can still be saved */ }
  }
  function save() {
    const names = [...new Set(ran.map(r => r.run!.project.trim()).filter(Boolean))];
    const url = URL.createObjectURL(new Blob([record()], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'launch-record-' + (names.join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'project') + '-' + checkDate(Date.now()) + '.md';
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="wrap ck">
      <SectionHead sigil="keystone" kicker="Dash Defenders" title="Checks before launch"
        lede="Five checks, each twelve statements a project answers about itself. Each ring shows what holds, and the launch record joins all five for a reviewer." />
      <CheckKeep status={status} count={checks.length} legacy={legacy} />
      <ul className="ck-hub">
        {CHECKS.map(k => {
          const last = checks.find(c => kindId(c) === k.id);
          const sc = last ? scoreCheck(last) : null;
          const state = !last ? (status === 'locked' ? 'Not run on this visit' : 'Not run yet')
            : !last.done ? sc!.answered + ' of ' + sc!.total + ' answered'
            : sc!.held + ' of ' + sc!.applies + ' held · ' + checkDate(last.done);
          return (
            <li key={k.id} className="ck-hub-card panel">
              <button type="button" className="ck-hub-open" data-kind={k.id} onClick={() => d({ t: 'route', view: 'check', id: k.id })} aria-label={(last ? (last.done ? 'Open ' : 'Continue ') : 'Begin ') + 'the ' + k.name.toLowerCase() + ' check'}>
                <KeyRing kind={k} answers={last?.answers || {}} sc={sc} closed={!!sc?.allHeld} mini />
                <span className="ck-hub-text">
                  <strong>{k.name}</strong>
                  <em>{k.line}</em>
                  <span className="ck-hub-state">{state}{last?.project.trim() ? ' · ' + last.project.trim() : ''}</span>
                </span>
                <span className="ck-hub-go">{last ? (last.done ? 'Open' : 'Continue') : 'Begin'}<svg viewBox="0 0 24 24" aria-hidden><path d="M9 6l6 6-6 6" /></svg></span>
              </button>
            </li>
          );
        })}
      </ul>

      <section className="tkr-door panel" aria-labelledby="tkr-door-h">
        <div className="tkr-door-text">
          <span className="label">From the public record</span>
          <h2 id="tkr-door-h">Read a token</h2>
          <p className="sec">Who can mint, freeze, pause or destroy a Dash Platform token, and who can change those rules, read from its contract.</p>
        </div>
        <button className="btn" type="button" onClick={() => d({ t: 'route', view: 'read' })} aria-label="Open Read a token">Open</button>
      </section>

      <section className="ck-launch panel" aria-labelledby="ck-launch-h">
        <header className="ck-launch-head">
          <span className="label">The launch record</span>
          <h2 id="ck-launch-h">{ran.length ? L.finished + ' of ' + CHECKS.length + ' checks finished' : 'No check run yet'}</h2>
          <p className="sec">The newest finished run of each check, joined into one record for a reviewer: every answer, the gaps deepest first across all five, and what changed since each check’s run before.</p>
        </header>
        {ran.length ? (
          <>
            <dl className="ck-launch-tally">
              <div><dt>Held</dt><dd>{L.held}<small> of {L.applies}</small></dd></div>
              <div><dt>Gaps</dt><dd>{L.gaps.length}</dd></div>
              <div><dt>Shown by a record</dt><dd>{L.shown}</dd></div>
              <div><dt>Said</dt><dd>{L.answered - L.shown}</dd></div>
            </dl>
            {L.contradicted > 0 && <p className="ck-launch-against">{L.contradicted} answer{L.contradicted > 1 ? 's claim' : ' claims'} more than the public record allows.</p>}
            {top.length > 0 && (
              <>
                <h3>The deepest gaps, across every check</h3>
                <ol className="ck-gaps">
                  {top.map(g => (
                    <li key={g.kind.id + ':' + g.item.id} className={partClass(g.kind, g.item.part)}>
                      <button type="button" onClick={() => d({ t: 'route', view: 'check', id: g.kind.id })} aria-label={'Open the ' + g.kind.name.toLowerCase() + ' check: ' + g.item.short}>
                        <i aria-hidden />
                        <span>
                          <strong>{g.item.move}</strong>
                          <em>{g.answer ? ANSWER_LABEL[g.answer] : 'Not answered yet'} · {g.kind.name} · {g.item.short}{ready(g.item.id) ? ' · lessons done, answer it again' : ''}</em>
                        </span>
                        <svg className="ck-open" viewBox="0 0 24 24" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
                      </button>
                    </li>
                  ))}
                </ol>
                {L.gaps.length > top.length && <p className="sec ck-launch-more">{L.gaps.length - top.length} more, each with its move, in the record.</p>}
              </>
            )}
            {L.changes.length > 0 && (
              <>
                <h3>Since the run before</h3>
                <ul className="ck-launch-changes">
                  {L.changes.map(ch => (
                    <li key={ch.kind.id}>
                      <strong>{ch.kind.name}, {checkDate(ch.from.done || ch.from.at)} to {checkDate(ch.to.done || ch.to.at)}</strong>
                      <span>{[ch.closed.length ? 'Closed: ' + ch.closed.map(i => inline(i.short)).join(', ') + '.' : '', ch.opened.length ? 'Opened: ' + ch.opened.map(i => inline(i.short)).join(', ') + '.' : ''].filter(Boolean).join(' ') || 'No statement moved between held and not held.'}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="ck-actions">
              <button className="btn btn-key ck-copy" onClick={copy}>{copied ? 'Copied' : 'Copy the launch record'}</button>
              <button className="btn" onClick={save}>Save the launch record</button>
            </div>
            <p className="ck-note">The launch record lists the project’s weak points across every check. It is made from your sealed checks on this device and leaves it only when you copy or save it. Share it only with your reviewer. The answers are the project’s own; StepSAFE does not verify them.</p>
          </>
        ) : (
          <p className="ck-launch-empty">Begin a check and its answers join the record here.</p>
        )}
      </section>

      <section className="ck-spine panel" aria-labelledby="ck-spine-h">
        <header className="ck-launch-head">
          <span className="label">The spine</span>
          <h2 id="ck-spine-h">What the corpus teaches, by NIST CSF 2.0 function</h2>
          <p className="sec">The sixty pages of the core chapters and every StepGuide, each read for the function it teaches first, beside the statements in the five checks that test it. Where a function is thin, its gaps have fewer lessons to close them.</p>
        </header>
        <ul className="ck-spine-grid">
          {spine.map(f => (
            <li key={f.fn} className={f.thin ? 'thin' : ''}>
              <details>
                <summary>
                  <span className="ck-spine-fn">{f.name}<small>{f.fn}</small></span>
                  <span className="ck-spine-n"><strong>{f.first.length}</strong> {f.first.length === 1 ? 'page' : 'pages'} and <strong>{f.guides.length}</strong> {f.guides.length === 1 ? 'StepGuide teach' : 'StepGuides teach'} it first{f.also.length ? '; ' + f.also.length + (f.also.length === 1 ? ' page' : ' pages') + ' in part' : ''}</span>
                  <span className="ck-spine-n"><strong>{f.statements}</strong> {f.statements === 1 ? 'statement tests' : 'statements test'} it</span>
                  {f.thin && <span className="ck-spine-thin">Thin</span>}
                </summary>
                <ol>
                  {f.first.map(p => <li key={p.id}><button type="button" onClick={() => d({ t: 'route', view: 'chapter', id: p.chapterId })}><strong>{p.title}</strong><em>{p.chapter}</em></button></li>)}
                  {f.also.map(p => <li key={p.id} className="also"><button type="button" onClick={() => d({ t: 'route', view: 'chapter', id: p.chapterId })}><strong>{p.title}</strong><em>{p.chapter} · in part</em></button></li>)}
                  {f.guides.map(g => <li key={g.id}><button type="button" onClick={() => d({ t: 'route', view: 'guides', id: g.id })}><strong>{g.title}</strong><em>StepGuide · {g.domain}</em></button></li>)}
                </ol>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CheckRun({ kind }: { kind: CheckKind }) {
  const { s: st, d } = useS();
  const eng = useEngine();
  const all = useChecks();
  const { status, legacy } = all;
  const checks = useMemo(() => all.checks.filter(c => kindId(c) === kind.id), [all.checks, kind.id]);
  const items = kind.items;
  const N = items.length;
  const [cur, setCur] = useState<string | null>(() => checks.find(c => !c.done)?.id || checks[0]?.id || null);
  const c = checks.find(x => x.id === cur) || null;
  const sc = useMemo(() => (c ? scoreCheck(c) : null), [c]);
  /* the milestones this run reached, shown in the result itself, so no toast covers it */
  const earned = (sc?.complete ? [awardById('small-' + kind.id + '-check'), sc.allHeld ? awardById('strong-' + kind.id + '-held') : undefined] : [])
    .filter((a): a is Award => !!a && !!st.awards[a.id]);
  const firstOpen = (x: TreasuryCheck | null) => Math.max(0, items.findIndex(i => !x?.answers[i.id]));
  const [at, setAt] = useState(() => firstOpen(c));
  const [view, setView] = useState<'focus' | 'result'>(() => (c?.done ? 'result' : 'focus'));
  /* back from the result to look again: Next then steps through in order instead of returning to the result */
  const [reviewing, setReviewing] = useState(false);
  const [copied, setCopied] = useState(false);
  const modelName = (id: string) => moduxById(id)?.name || id;
  const cardRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const begun = useRef(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const advance = useRef(0);
  const partName = (id: string) => kind.parts.find(p => p.id === id)?.name || '';
  const unnamed = kind.id === 'treasury' ? 'An unnamed treasury' : 'An unnamed project';

  function open(id: string) {
    const x = checks.find(y => y.id === id) || null;
    setCur(id);
    setAt(firstOpen(x));
    setView(x?.done ? 'result' : 'focus');
    setReviewing(false);
  }

  /* the checks come and go with the keyring: locked, they leave; opened, the newest unfinished one returns */
  useEffect(() => {
    if (!c && checks.length) open(checks.find(x => !x.done)?.id || checks[0].id);
  }, [c, checks]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => window.clearTimeout(advance.current), []);

  function start() {
    const id = uid();
    newCheck(id, c && c.done ? c.project : '', kind.id);
    setCur(id); setAt(0); setView('focus'); setReviewing(false);
    begun.current = true;
  }
  useEffect(() => {
    if (!begun.current || !stageRef.current) return;
    begun.current = false;
    stageRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [cur]);

  /* the milestones, once a check has an answer for every statement */
  const fired = useRef('');
  useEffect(() => {
    if (!c || !sc?.complete) return;
    const key = c.id + (sc.allHeld ? ':held' : ':done');
    if (fired.current === key) return;
    fired.current = key;
    eng.checkFinished(kind.id, sc.allHeld);
  }, [c?.id, sc?.complete, sc?.allHeld]); // eslint-disable-line react-hooks/exhaustive-deps

  /* a new statement in front: keep its top in view on a phone */
  useEffect(() => {
    const el = cardRef.current;
    if (el && view === 'focus' && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [at, view]);

  const item = items[at];
  const ans = c?.answers[item.id];
  const gap = !!ans && ans !== 'yes' && ans !== 'na';
  /* the loop into the corpus: the lessons that teach this statement's move, and a re-check once they are done */
  const lessons = lessonsFor(item.id, st);
  const recheck = gap && readyToRecheck(item.id, st);
  const gapNote = (id: string) => { const n = lessonsFor(id, st).length; return !n ? '' : readyToRecheck(id, st) ? ' · lessons done, answer it again' : ' · ' + n + (n > 1 ? ' lessons' : ' lesson'); };

  function goto(i: number) { window.clearTimeout(advance.current); setAt(i); setView('focus'); }
  function review(i: number) { setReviewing(true); goto(i); }
  /* the last open statement answered: the result is next, unless the learner came back to look again */
  const toResult = at === N - 1 || (!!sc?.complete && !reviewing);
  function next() {
    window.clearTimeout(advance.current);
    if (!toResult) setAt(at + 1);
    else { setView('result'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }
  function prev() { window.clearTimeout(advance.current); if (at > 0) setAt(at - 1); }

  function answer(o: CheckAnswer) {
    if (!c) return;
    answerCheck(c.id, item.id, o, N);
    window.clearTimeout(advance.current);
    const after = { ...c.answers, [item.id]: o };
    if ((o === 'yes' || o === 'na') && !item.evidence) {
      /* a held statement moves on by itself, to the next one still open; one a public record can show waits, so the record can be read */
      advance.current = window.setTimeout(() => {
        for (let k = 1; k <= N; k++) {
          const j = (at + k) % N;
          if (!after[items[j].id]) { setAt(j); return; }
        }
        setView('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 340);
    } else {
      /* a gap waits, so its move can be read; Enter carries on */
      requestAnimationFrame(() => nextRef.current?.focus({ preventScroll: true }));
    }
  }

  /* the keys: Y P N S (and D where a statement can not apply), the arrows to move */
  useEffect(() => {
    if (!c || view !== 'focus') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); return; }
      const o = KEY_ANSWER[e.key.toLowerCase()];
      if (o && (o !== 'na' || item.na)) { e.preventDefault(); answer(o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const record = c ? checkRecord(c, modelName) : '';
  async function copy() {
    try { await navigator.clipboard.writeText(record); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* the record can still be saved */ }
  }
  function save() {
    if (!c) return;
    const url = URL.createObjectURL(new Blob([record], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = kind.id + '-check-' + (c.project.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project') + '-' + checkDate(c.done || c.at) + '.md';
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const opts: CheckAnswer[] = item.na ? [...ANSWERS, 'na'] : ANSWERS;

  return (
    <div className="wrap ck">
      <button type="button" className="ck-back" onClick={() => d({ t: 'route', view: 'check' })}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M15 6l-6 6 6 6" /></svg>Checks before launch
      </button>
      <SectionHead sigil="keystone" kicker="Dash Defenders" title={kind.title} lede={c ? undefined : kind.lede} />

      <CheckKeep status={status} count={all.checks.length} legacy={legacy} />

      {!c ? (
        <section className="ck-hero panel">
          <KeyRing kind={kind} answers={{}} sc={null} />
          <div className="ck-hero-text">
            <p className="ck-hero-lead">Each arc of the ring is one statement. A statement that holds lights its arc. A gap leaves the ring open.</p>
            <PartRows kind={kind} sc={null} />
            <p className="sec">Answer Yes, Partly, No or Not sure. Not sure counts as not held: if nobody can say how something is kept, nobody can check it.</p>
            <button className="btn btn-key ck-begin" data-ck-begin onClick={start}>Begin the check</button>
          </div>
        </section>
      ) : (
        <>
          {view === 'focus' ? (
            <div className="ck-stage" ref={stageRef}>
              <aside className="ck-aside">
                <div className="ck-bar">
                  <label className="ck-name">
                    <span className="label">{kind.id === 'treasury' ? 'Project or treasury' : 'Project'}</span>
                    <input value={c.project} onChange={e => nameCheck(c.id, e.target.value)} placeholder="The name a reviewer will see" maxLength={80} />
                  </label>
                  <div className="ck-progress" aria-live="polite"><strong>{sc!.answered}</strong><span>of {N} answered</span></div>
                </div>
                <KeyRing kind={kind} answers={c.answers} evidence={c.evidence} at={at} onPick={goto} sc={sc} />
                <PartRows kind={kind} sc={sc} />
                {sc!.answered > 0 && <button className="btn btn-ghost btn-sm ck-to-result" onClick={() => { setView('result'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>See the result</button>}
              </aside>

              <article ref={cardRef} key={item.id} className={'ck-card panel ' + partClass(kind, item.part)} data-item={item.id} aria-labelledby="ck-ask">
                <header className="ck-card-head">
                  <span className="ck-chip"><i aria-hidden />{partName(item.part)}</span>
                  <span className="ck-count">Statement {at + 1} of {N}</span>
                </header>
                <h2 id="ck-ask" className="ck-ask">{item.ask}</h2>
                <p className="ck-why">{item.why}</p>
                <div className="ck-answers" role="radiogroup" aria-labelledby="ck-ask">
                  {opts.map(o => (
                    <button key={o} type="button" role="radio" aria-checked={ans === o}
                      className={'ck-ans o-' + o + (ans === o ? ' on' : '') + (o === 'na' ? ' wide' : '')} onClick={() => answer(o)}>
                      <AnswerGlyph kind={o} />
                      <span>{o === 'na' && item.na ? item.na : ANSWER_LABEL[o]}</span>
                      <kbd aria-hidden>{KEY_HINT[o]}</kbd>
                    </button>
                  ))}
                </div>
                {item.evidence && <ReadRecord key={item.id} run={c} runs={checks} kind={kind} item={item} answer={ans} onAnswer={(o) => answerCheck(c.id, item.id, o, N)} />}
                {gap && (
                  <div className="ck-move">
                    <span className="label">The move</span>
                    <p>{item.move}</p>
                    <div className="ck-models">
                      {item.models.map(m => <button key={m} type="button" className="chip" onClick={() => d({ t: 'route', view: 'modux-model', id: m })}><span className="mt-e gx-e" aria-hidden>{emojiOf(m)}</span>{modelName(m)}</button>)}
                    </div>
                    {lessons.length > 0 && (
                      <div className="ck-learn">
                        <span className="label">The lessons that teach it</span>
                        <ul>
                          {lessons.map(l => (
                            <li key={l.id}>
                              <button type="button" className={l.done ? 'done' : ''} onClick={() => d({ t: 'route', view: l.route.view, id: l.route.id })}>
                                <span className="ck-learn-text">
                                  <small>{KIND_LABEL[l.kind]}{l.motus ? ' · Motus' : ''}{l.where ? ' · ' + l.where : ''}</small>
                                  <strong>{l.title}</strong>
                                </span>
                                {l.done
                                  ? <svg className="ck-learn-mark" viewBox="0 0 24 24" role="img" aria-label="Done"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                  : <svg className="ck-learn-mark" viewBox="0 0 24 24" aria-hidden><path d="M9 6l6 6-6 6" /></svg>}
                              </button>
                            </li>
                          ))}
                        </ul>
                        {recheck && <p className="ck-recheck" role="status">Every lesson for this gap is done. If the move is made, answer the statement again.</p>}
                      </div>
                    )}
                  </div>
                )}
                <p className="ck-csf"><abbr title={'NIST Cybersecurity Framework 2.0: ' + csfName(item.csf)}>NIST CSF {item.csf}</abbr> · {csfName(item.csf)} · sources read {item.sources[0]?.checked}</p>
                <footer className="ck-card-nav">
                  <button className="btn btn-ghost btn-sm" type="button" onClick={prev} disabled={at === 0}>Previous</button>
                  <span className="ck-keys" aria-hidden>Keys: Y P N S, and the arrows</span>
                  <button ref={nextRef} className="btn btn-sm" type="button" onClick={next}>{toResult ? 'See the result' : 'Next statement'}</button>
                </footer>
              </article>
            </div>
          ) : (
            <section className={'ck-result panel' + (sc!.allHeld ? ' all-held' : '')} aria-label="The result">
              <div className="ck-result-head">
                <KeyRing kind={kind} answers={c.answers} evidence={c.evidence} onPick={review} sc={sc} closed={sc!.allHeld} />
                <div className="ck-result-side">
                  <div className="ck-held">
                    <span className="label">The result</span>
                    <h2>{c.project.trim() || unnamed}</h2>
                    <p>{sc!.held} of {sc!.applies} held{sc!.partly ? ', ' + sc!.partly + ' partly' : ''}{sc!.complete ? '' : ', ' + (N - sc!.answered) + ' still to answer'}</p>
                    <p className="ck-shown-line">Shown by a public record: {sc!.shown} of {N}. Said: {sc!.answered - sc!.shown}.{sc!.contradicted.length ? ' ' + sc!.contradicted.length + ' answer' + (sc!.contradicted.length > 1 ? 's claim' : ' claims') + ' more than the record allows.' : sc!.readable && !sc!.shown ? ' ' + sc!.readable + (sc!.readable > 1 ? ' statements' : ' statement') + ' can be read from a public record.' : ''}</p>
                  </div>
                  {earned.length > 0 && (
                    <ul className="ck-earned" aria-label="Milestones held">
                      {earned.map(a => <li key={a.id}><span className="ck-earned-glyph" aria-hidden>{a.glyph}</span>{TIER_NAMES[a.tier]} · {a.name}</li>)}
                    </ul>
                  )}
                  <PartRows kind={kind} sc={sc} />
                  <ul className="ck-legend" aria-label="How the ring draws an answer">
                    {(['yes', 'partly', 'no', 'unsure'] as CheckAnswer[]).map(k => <li key={k}><AnswerGlyph kind={k} />{ANSWER_LABEL[k]}</li>)}
                    <li><svg className="ck-glyph" viewBox="0 0 28 20" aria-hidden><circle className="ck-ev-dot" cx="14" cy="10" r="4.5" /></svg>Shown by a record</li>
                    <li><svg className="ck-glyph" viewBox="0 0 28 20" aria-hidden><circle className="ck-ev-dot against" cx="14" cy="10" r="4.5" /></svg>More than the record allows</li>
                  </ul>
                </div>
              </div>

              {sc!.allHeld ? (
                <p className="ck-verdict">By your answers, every statement that applies holds. That stays your own account until a reviewer reads the record. Keep the record with the date, and run the check again when anything changes.</p>
              ) : sc!.gaps.length ? (
                <>
                  <h3>The gaps, deepest first</h3>
                  <ol className="ck-gaps">
                    {sc!.gaps.map(g => {
                      const i = items.indexOf(g.item);
                      return (
                        <li key={g.item.id} className={partClass(kind, g.item.part)}>
                          <button type="button" onClick={() => review(i)} aria-label={'Open statement ' + (i + 1) + ': ' + g.item.short}>
                            <i aria-hidden />
                            <span>
                              <strong>{g.item.move}</strong>
                              <em>{g.answer ? ANSWER_LABEL[g.answer] : 'Not answered yet'} · {g.item.short}{gapNote(g.item.id)}</em>
                            </span>
                            <svg className="ck-open" viewBox="0 0 24 24" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </>
              ) : null}

              <div className="ck-actions">
                <button className="btn btn-key ck-copy" onClick={copy} disabled={!sc!.answered}>{copied ? 'Copied' : 'Copy the record'}</button>
                <button className="btn" onClick={save} disabled={!sc!.answered}>Save the record</button>
                <button className="btn btn-ghost" onClick={() => review(firstOpen(c))}>Review the answers</button>
                <button className="btn btn-ghost" onClick={start}>Start a new check</button>
              </div>
              <p className="ck-note">The record lists this project’s weak points. Share it only with your reviewer. The answers are the project’s own; StepSAFE does not verify them.</p>
            </section>
          )}

          {checks.length > 1 && (
            <section className="ck-past" aria-label="Earlier checks">
              <h3>Earlier checks</h3>
              <ul>
                {checks.map(x => {
                  const xs = scoreCheck(x);
                  return (
                    <li key={x.id} className={x.id === c.id ? 'on' : ''}>
                      <button type="button" onClick={() => { open(x.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        <strong>{x.project.trim() || unnamed}</strong>
                        <span>{checkDate(x.done || x.at)} · {xs.held} of {xs.applies} held{xs.complete ? '' : ' · ' + (xs.total - xs.answered) + ' to answer'}</span>
                      </button>
                      {x.id !== c.id && <button type="button" className="ck-remove" onClick={() => removeCheck(x.id)} aria-label={'Remove the check for ' + (x.project || unnamed.toLowerCase())}>Remove</button>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <details className="ck-sources">
            <summary>Sources, each read at the source</summary>
            <ul>{[...new Map(items.flatMap(i => i.sources).map(x => [x.url, x])).values()].map(x => <li key={x.url}><a href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a> <span>checked {x.checked}</span></li>)}</ul>
          </details>
        </>
      )}
    </div>
  );
}
