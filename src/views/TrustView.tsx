/* STEPSAFE'S OWN RECORD. StepSAFE asks every project to back its record with evidence anyone can read. This page
   holds StepSAFE to that. Press the button and the browser reads StepSAFE's own promises from the site itself
   (lib/selfread.ts): its security.txt, the headers the app's page comes with, every site this visit has reached, what
   this browser keeps for StepSAFE, and its bill of materials. Two reads leave this site, each on its own button, and
   the page says what each sends before it is pressed: OSV.dev, asked about known flaws in what ships, and OpenSSF
   Scorecard, asked for its published results on the public copy of StepSAFE's code (OWN_REPO), which are set
   beside the answers they bear on.

   Then what a browser cannot read, said plainly: the tests every release runs, StepSAFE's answers to its own Code and
   releases check with the gaps first, and where it stands on what a US federal buyer looks for (content/own.ts).
   A reading is held for the visit only. */

import React, { useEffect, useRef, useState } from 'react';
import { SectionHead, Mark } from '../components/bits';
import { useKeyring } from '../lib/keyring';
import { ANSWER_LABEL } from '../lib/check';
import { ITEMS as CODE_ITEMS } from '../content/check/code';
import { CODE_ANSWERS, FEDERAL, RELEASE_TESTS, OWN_ON, OWN_REPO, type FederalStatus } from '../content/own';
import {
  readSelf, readFlaws, readingText, tally, timeOf, SELF_TITLES,
  type SelfFinding, type SelfMark, type SelfReading, type SelfId,
} from '../lib/selfread';
import { readScorecard, isScorecardKind, contradicts, shownBy, SCORECARD_VIEW, type Reading, type ScorecardKind } from '../lib/evidence';
import type { CheckAnswer, CheckItem } from '../content/check/types';

/* the reading of this visit, so leaving the page and coming back shows it again without reading twice */
let KEPT: SelfReading | null = null;
let KEPT_FLAWS: SelfFinding | null = null;
interface CardRead { subject: string; scanned: string; at: number; readings: Partial<Record<ScorecardKind, Reading>> }
let KEPT_CARD: CardRead | null = null;

/* the answers OpenSSF Scorecard can bear on: one read of the public copy fills them all */
const CARD_KINDS = [...new Set(CODE_ITEMS.flatMap((i) => (i.evidence && isScorecardKind(i.evidence) ? [i.evidence] : [])))];
const cardOf = (card: CardRead | null, item: CheckItem): Reading | null =>
  (card && item.evidence && isScorecardKind(item.evidence) ? card.readings[item.evidence] || null : null);
/** what a Scorecard reading says about StepSAFE's answer, in the words the check itself uses */
function cardVerdict(answer: CheckAnswer, r: Reading): string {
  if (contradicts(answer, r)) return 'StepSAFE answered ' + ANSWER_LABEL[answer] + '. The record allows ' + ANSWER_LABEL[r.allows as CheckAnswer] + ' at most.';
  return shownBy(answer, r) ? 'This record backs StepSAFE’s answer.' : 'This record does not settle the answer either way.';
}
/** one line for the whole read: how many answers the scan backs, disagrees with, and leaves open */
function cardSummary(scanned: string, backs: number, against: number, unsettled: number): string {
  const scan = 'OpenSSF Scorecard’s scan' + (scanned ? ' of ' + scanned : '');
  if (!backs && !against) return scan + ' does not settle any of these answers.';
  const parts = [backs ? 'backs ' + backs : '', against ? 'disagrees with ' + against : '', unsettled ? 'does not settle ' + unsettled : ''].filter(Boolean);
  parts[0] += ' of these answers';
  const said = parts.length === 1 ? parts[0] : parts.length === 2 ? parts.join(' and ') : parts[0] + ', ' + parts[1] + ', and ' + parts[2];
  return scan + ' ' + said + '.';
}

type Shape = 'whole' | 'half' | 'open' | 'dash';
/* a status drawn by its shape as well as its colour: whole holds, half holds in part, an open ring does not, a dash
   was not read or does not apply */
function OwnMark({ shape }: { shape: Shape }) {
  return (
    <svg className={'ownr-mark ownr-s-' + shape} viewBox="0 0 28 28" aria-hidden focusable="false">
      {shape === 'whole' && <circle className="ownr-fill" cx="14" cy="14" r="7" />}
      {shape === 'half' && <><circle cx="14" cy="14" r="7" /><path className="ownr-fill" d="M14 7 A7 7 0 0 0 14 21 Z" /></>}
      {shape === 'open' && <circle cx="14" cy="14" r="7" />}
      {shape === 'dash' && <path d="M8 14 H20" />}
    </svg>
  );
}
const MARK_SHAPE: Record<SelfMark, Shape> = { shown: 'whole', gap: 'open', unread: 'dash' };
const MARK_WORDS: Record<SelfMark, string> = { shown: 'Holds', gap: 'Does not hold', unread: 'Not read' };
const ANSWER_SHAPE: Record<CheckAnswer, Shape> = { yes: 'whole', partly: 'half', no: 'open', unsure: 'dash', na: 'dash' };
const STATUS_SHAPE: Record<FederalStatus, Shape> = { 'in place': 'whole', partly: 'half', 'not yet': 'open', 'not certified': 'open' };
const STATUS_WORDS: Record<FederalStatus, string> = { 'in place': 'In place', partly: 'In part', 'not yet': 'Not yet', 'not certified': 'Not certified' };
const READ_ORDER: SelfId[] = ['disclosure', 'scripts', 'framing', 'https', 'referrer', 'powers', 'hosts', 'device', 'parts'];

function Finding({ f }: { f: SelfFinding }) {
  return (
    <li className={'ownr-f ownr-k-' + f.mark} data-ownr={f.id}>
      <OwnMark shape={MARK_SHAPE[f.mark]} />
      <div className="ownr-f-body">
        <strong className="ownr-f-title">{f.title}</strong>
        <span className="ownr-f-state">{MARK_WORDS[f.mark]}</span>
        <p>{f.line}</p>
        <p className="ownr-f-from">Read from {f.from}</p>
      </div>
    </li>
  );
}

/* before the first press: the promises the reading will test, each waiting */
function Waiting() {
  return (
    <ol className="ownr-findings ownr-waiting">
      {READ_ORDER.map((id) => (
        <li key={id} className="ownr-f ownr-k-wait" data-ownr={id}>
          <OwnMark shape="dash" />
          <div className="ownr-f-body"><strong className="ownr-f-title">{SELF_TITLES[id]}</strong><span className="ownr-f-state">Not read yet</span></div>
        </li>
      ))}
    </ol>
  );
}

/* an answer beside the reading that bears on it: a reading that holds is named in a line, one that does not is quoted */
function ReadLine({ f, disagrees }: { f: SelfFinding; disagrees: boolean }) {
  return disagrees
    ? <p className="ownr-read-line ownr-disagree">The reading above disagrees: {f.line}</p>
    : <p className="ownr-read-line">{f.mark === 'gap' ? 'Read above, it does not hold: ' + f.line : 'Read above, from ' + f.from + ', and it holds.'}</p>;
}

/* an answer beside OpenSSF Scorecard's reading of the public copy: what the record showed, what it cannot show, and
   whether it backs the answer */
function CardLine({ r, answer }: { r: Reading; answer: CheckAnswer }) {
  return (
    <div className={'ownr-card-line' + (contradicts(answer, r) ? ' ownr-disagree' : '')}>
      <span className="label">OpenSSF Scorecard, on the public copy</span>
      <p>{r.found}{r.unseen ? ' ' + r.unseen : ''}</p>
      <p className="ownr-card-verdict">{cardVerdict(answer, r)}</p>
    </div>
  );
}

const WEIGHT_ORDER: Record<CheckAnswer, number> = { no: 0, partly: 1, unsure: 2, yes: 3, na: 4 };

/** `alone` is the page at /trust, drawn without the rest of the app (trustMount.tsx): it carries its own way in */
export function TrustView({ alone = false }: { alone?: boolean }) {
  const { status } = useKeyring();
  const [reading, setReading] = useState<SelfReading | null>(KEPT);
  const [flaws, setFlaws] = useState<SelfFinding | null>(KEPT_FLAWS);
  const [busy, setBusy] = useState(false);
  const [asking, setAsking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [card, setCard] = useState<CardRead | null>(KEPT_CARD);
  const [carding, setCarding] = useState(false);
  const [cardErr, setCardErr] = useState('');
  const head = useRef<HTMLHeadingElement | null>(null);
  const arrived = useRef(false);

  /* a reading that has just arrived is where a screen reader should be */
  useEffect(() => { if (reading && arrived.current) { arrived.current = false; head.current?.focus({ preventScroll: true }); } }, [reading]);

  async function read() {
    if (busy) return;
    setBusy(true);
    const r = await readSelf(status);
    KEPT = r; arrived.current = true;
    setReading(r);
    setBusy(false);
  }
  async function ask() {
    if (asking || !reading) return;
    setAsking(true);
    const f = await readFlaws(reading.parts);
    KEPT_FLAWS = f;
    setFlaws(f);
    setAsking(false);
  }
  async function askCard() {
    if (carding) return;
    setCarding(true);
    setCardErr('');
    try {
      const got = await readScorecard(OWN_REPO, CARD_KINDS);
      KEPT_CARD = { ...got, at: Date.now() };
      setCard(KEPT_CARD);
    } catch (e) {
      const m = e instanceof Error ? e.message : '';
      setCardErr(/^OpenSSF Scorecard has no published results/.test(m) ? 'OpenSSF Scorecard has no published results for StepSAFE’s public copy yet.'
        : /^Scorecard did not answer/.test(m) ? m : 'OpenSSF Scorecard could not be reached. Try again later.');
    }
    setCarding(false);
  }
  const text = () => (reading ? readingText(reading, flaws, cardText()) : '');
  async function copy() {
    try { await navigator.clipboard.writeText(text()); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* the reading can still be saved */ }
  }
  function save() {
    if (!reading) return;
    const url = URL.createObjectURL(new Blob([text()], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stepsafe-own-record-' + timeOf(reading.at).slice(0, 10) + '.md';
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const t = reading ? tally(flaws ? [...reading.findings, flaws] : reading.findings) : null;
  const byId = (id: string) => (reading ? [...reading.findings, ...(flaws ? [flaws] : [])].find((f) => f.id === id) || null : null);
  const answers = CODE_ITEMS.map((item) => ({ item, a: CODE_ANSWERS[item.id] })).filter((x) => x.a)
    .sort((x, y) => WEIGHT_ORDER[x.a.answer] - WEIGHT_ORDER[y.a.answer] || y.item.weight - x.item.weight);
  const held = answers.filter((x) => x.a.answer === 'yes').length;
  const open = answers.filter((x) => x.a.answer === 'no' || x.a.answer === 'partly').length;
  const carded = answers.filter((x) => x.item.evidence && isScorecardKind(x.item.evidence)).length;
  const cardRows = card ? answers.map(({ item, a }) => ({ item, a, r: cardOf(card, item) })).filter((x): x is typeof x & { r: Reading } => !!x.r) : [];
  const backs = cardRows.filter((x) => shownBy(x.a.answer, x.r)).length;
  const against = cardRows.filter((x) => contradicts(x.a.answer, x.r)).length;
  const unsettled = cardRows.length - backs - against;
  /* the Scorecard readings in the copied or saved reading, under their own heading */
  function cardText(): string[] {
    if (!card || !cardRows.length) return [];
    return ['## Read by OpenSSF Scorecard', '',
      'Its published results for ' + card.subject + (card.scanned ? ', from its scan of ' + card.scanned : '') + ', set beside StepSAFE’s answers to its own check.', '',
      ...cardRows.map(({ item, a, r }) => '- **' + item.short + '.** StepSAFE answers ' + ANSWER_LABEL[a.answer] + '. ' + r.found + ' ' + cardVerdict(a.answer, r))];
  }

  return (
    <div className="wrap ownr">
      {alone && (
        <header className="ownr-top">
          <a className="ownr-brand" href="/"><Mark size={28} /><span>StepSAFE</span></a>
          <a className="btn" href="/">Open StepSAFE</a>
        </header>
      )}
      <SectionHead sigil="lens" kicker="Security and trust" title="StepSAFE’s own record"
        lede="StepSAFE asks every project to back its record with evidence anyone can read. This page applies that rule to StepSAFE. Press the button, and your browser reads StepSAFE’s security promises from this site and says which hold." />

      <section className="ownr-read panel" aria-labelledby="ownr-read-h">
        <h2 id="ownr-read-h" className="ownr-h">Read in your browser</h2>
        <div className="ownr-actions">
          <button type="button" className="btn btn-key" onClick={read} disabled={busy}>{busy ? 'Reading' : reading ? 'Read it again' : 'Read StepSAFE’s record'}</button>
          {reading && <button type="button" className="btn" onClick={copy}>{copied ? 'Copied' : 'Copy the reading'}</button>}
          {reading && <button type="button" className="btn" onClick={save}>Save it as a file</button>}
        </div>
        <p className="sec ownr-says">These reads ask this site only, from your browser. Nothing is sent anywhere else, and the reading is kept for this visit only.</p>
        {busy && <p className="ownr-waits" role="status">Reading security.txt, this page’s headers, the bill of materials and what this browser keeps.</p>}
        {reading && t && (
          <header className="ownr-result-head">
            <h3 ref={head} tabIndex={-1} className="ownr-sum">
              {t.shown} of {t.shown + t.gap + t.unread} {t.shown === 1 ? 'holds' : 'hold'}{t.gap ? ', ' + t.gap + (t.gap === 1 ? ' does not' : ' do not') : ''}{t.unread ? ', ' + t.unread + ' not read' : ''}
            </h3>
            <p className="sec">Read from {reading.origin} on <span className="ownr-when">{timeOf(reading.at)}</span>.</p>
          </header>
        )}
        {reading ? <ol className="ownr-findings">{reading.findings.map((f) => <Finding key={f.id} f={f} />)}</ol> : <Waiting />}
      </section>

      <section className="ownr-read panel" aria-labelledby="ownr-flaws-h">
        <h2 id="ownr-flaws-h" className="ownr-h">Known flaws in what ships</h2>
        <p className="sec ownr-says">OSV.dev keeps an open database of known flaws in open-source packages. Asking it sends the names and versions of the packages StepSAFE ships, which are public, and nothing about you.</p>
        <div className="ownr-actions">
          <button type="button" className="btn btn-key" onClick={ask} disabled={!reading || asking}>{asking ? 'Asking OSV.dev' : flaws ? 'Ask OSV.dev again' : 'Ask OSV.dev'}</button>
        </div>
        {!reading && <p className="ownr-waits">Read StepSAFE’s record first. The question uses its bill of materials.</p>}
        {flaws && <ol className="ownr-findings" aria-live="polite"><Finding f={flaws} /></ol>}
      </section>

      <section className="ownr-block" aria-labelledby="ownr-tests-h">
        <header className="ownr-result-head">
          <h2 id="ownr-tests-h" className="ownr-h">Tested before every release</h2>
          <p className="sec">A browser cannot run these, so this is StepSAFE’s word. Each test is named, so a reviewer can ask to see it run.</p>
        </header>
        <ul className="ownr-tests">
          {RELEASE_TESTS.map((x) => <li key={x.name}><code>{x.name}</code><span>{x.line}</span></li>)}
        </ul>
      </section>

      <section className="ownr-block" aria-labelledby="ownr-code-h">
        <header className="ownr-result-head">
          <h2 id="ownr-code-h" className="ownr-h">StepSAFE’s answers to its own check</h2>
          <p className="sec">The Code and releases check, answered for StepSAFE as of {OWN_ON}: {held} of {answers.length} hold, {open} are gaps or hold in part. The gaps come first, deepest first.</p>
        </header>
        <div className="ownr-read panel ownr-card">
          <p className="sec ownr-says">OpenSSF Scorecard scores the public copy of StepSAFE’s code, at {OWN_REPO}, and {carded} of these answers can be checked against its published results. Asking it sends the name of that repository, and nothing about you.</p>
          <div className="ownr-actions">
            <button type="button" className="btn btn-key" onClick={askCard} disabled={carding}>{carding ? 'Asking OpenSSF Scorecard' : card ? 'Ask OpenSSF Scorecard again' : 'Ask OpenSSF Scorecard'}</button>
          </div>
          {cardErr && <p className="ownr-waits" role="alert">{cardErr}</p>}
          {card && (
            <p className="ownr-card-sum" role="status" data-ownr-card>
              {cardSummary(card.scanned, backs, against, unsettled) + ' Each reading is under its answer. '}
              <a href={SCORECARD_VIEW + card.subject} target="_blank" rel="noopener noreferrer">See the record</a>
            </p>
          )}
        </div>
        <ol className="ownr-answers">
          {answers.map(({ item, a }) => {
            const r = a.read ? byId(a.read) : null;
            const disagrees = !!r && r.mark === 'gap' && (a.answer === 'yes');
            const rc = cardOf(card, item);
            return (
              <li key={item.id} className={'ownr-a ownr-ans-' + a.answer} data-ownr-answer={item.id}>
                <OwnMark shape={ANSWER_SHAPE[a.answer]} />
                <div className="ownr-f-body">
                  <strong className="ownr-f-title">{item.short}</strong>
                  <span className="ownr-f-state">{ANSWER_LABEL[a.answer]} · {a.how === 'shown' ? 'Shown on this page' : 'Said by StepSAFE'}{rc && shownBy(a.answer, rc) ? ', backed by OpenSSF Scorecard' : ''}</span>
                  <p className="ownr-ask">{'“' + item.ask + '”'}</p>
                  <p>{a.note}</p>
                  {r && r.mark !== 'unread' && <ReadLine f={r} disagrees={disagrees} />}
                  {rc && <CardLine r={rc} answer={a.answer} />}
                  {(a.answer === 'no' || a.answer === 'partly') && <p className="ownr-move"><span className="label">The move</span>{item.move}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="ownr-block" aria-labelledby="ownr-fed-h">
        <header className="ownr-result-head">
          <h2 id="ownr-fed-h" className="ownr-h">What a US federal buyer looks for</h2>
          <p className="sec">No product is approved for government use on its own. These are the first things a federal buyer asks for, and where StepSAFE stands on each.</p>
        </header>
        <ol className="ownr-answers">
          {FEDERAL.map((row) => {
            const r = row.read ? byId(row.read) : null;
            return (
              <li key={row.id} className={'ownr-a ownr-st-' + row.status.replace(/ /g, '-')} data-ownr-federal={row.id}>
                <OwnMark shape={STATUS_SHAPE[row.status]} />
                <div className="ownr-f-body">
                  <strong className="ownr-f-title">{row.name}</strong>
                  <span className="ownr-f-state">{STATUS_WORDS[row.status]}</span>
                  <p>{row.line}</p>
                  {r && r.mark !== 'unread' && <ReadLine f={r} disagrees={r.mark === 'gap'} />}
                  {row.sources.length > 0 && (
                    <p className="ownr-f-from">
                      {row.sources.map((s, i) => <React.Fragment key={s.url}>{i > 0 && ' · '}<a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></React.Fragment>)}
                      {' '}(read {row.sources[0].checked})
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <p className="ownr-foot">
        A reading shows the moment it was taken, not the practice behind it. The policies are at <a href="/security.html">/security.html</a>, <a href="/privacy.html">/privacy.html</a> and <a href="/accessibility.html">/accessibility.html</a>, and the bill of materials is at <a href="/sbom.cdx.json">/sbom.cdx.json</a>.
      </p>
    </div>
  );
}
