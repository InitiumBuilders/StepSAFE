/* DASH DEFENDERS · READ A TOKEN. A token on Dash Platform is a stock with valves, and the rules that say who holds
   each valve are public. This page reads them from the public record and writes them out: who may mint, freeze,
   pause or destroy, who may change who may, and what no one can ever change. The reading is shown evidence, not
   an answer a project gives about itself, and it says what it could not read.

   Nothing is read until the visitor asks. A link that names a contract fills the field and waits for the button,
   because a read tells the explorer which contract was looked up. A reading is held for the visit only.

   The page reads who holds each power. What a token is worth is left to its reader, and the foot of the page says so. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { emojiOf } from '../content/modux/emoji';
import { useS } from '../lib/state';
import { moduxById } from '../content/registry';
import { SectionHead, ShareLink } from '../components/bits';
import { TokenVessel, KeyMarks } from '../components/TokenVessel';
import {
  readContract, cleanId, amount, holderWords, readingText, typeWords, grownWords, shortId, RULE_KEYS,
  type ContractRead, type TokenRead, type Finding, type GroupRead, type Net, type Rule, type RuleKey, type Tone,
} from '../lib/onchain';
import { EXAMPLES } from '../content/onchain-example';

/* the readings of this visit, so Back and Forward show one again without asking the explorer twice */
const KEPT = new Map<string, ContractRead>();
const keyOf = (net: Net, id: string) => net + ':' + id;
function keep(c: ContractRead) {
  KEPT.delete(keyOf(c.net, c.id));
  KEPT.set(keyOf(c.net, c.id), c);
  while (KEPT.size > 8) KEPT.delete(KEPT.keys().next().value as string);
}

/* the reading that has just arrived. The app mounts a page again when its address changes, so this outlives the page. */
let ARRIVED = '';

const NET_NAME: Record<Net, string> = { mainnet: 'Mainnet', testnet: 'Testnet' };
const MOST_TOKENS = 12;

const POWER: Record<RuleKey, string> = {
  mint: 'Mint new tokens at will',
  burn: 'Burn tokens it holds',
  freeze: 'Freeze a holder’s balance',
  unfreeze: 'Unfreeze a balance',
  destroy: 'Destroy a frozen balance',
  pause: 'Pause and resume every transfer',
  max: 'Change the maximum supply',
  trade: 'Change whether it can be resold on Platform',
  names: 'Change how it is named and shown',
};

/* a finding's kind, drawn by shape: one key, a group, a rule that can still change, a rule fixed for good, a note */
function ToneMark({ tone }: { tone: Tone }) {
  return (
    <svg className="tkr-mark" viewBox="0 0 28 28" aria-hidden focusable="false">
      {tone === 'alone' && <circle className="tkr-fill" cx="14" cy="14" r="6" />}
      {tone === 'held' && <><path d="M14 7.5 L7.5 19.5 H20.5 Z" /><circle className="tkr-fill" cx="14" cy="7.5" r="3.4" /><circle className="tkr-fill" cx="7.5" cy="19.5" r="3.4" /><circle className="tkr-fill" cx="20.5" cy="19.5" r="3.4" /></>}
      {tone === 'open' && <path d="M19.7 8.3 A8 8 0 1 0 22 14" />}
      {tone === 'fixed' && <rect className="tkr-fill" x="7" y="7" width="14" height="14" rx="4" />}
      {tone === 'note' && <path d="M8 14 H20" />}
    </svg>
  );
}

function Findings({ list }: { list: Finding[] }) {
  const { d } = useS();
  return (
    <ol className="tkr-findings">
      {list.map(f => {
        const models = f.models.map(id => moduxById(id)).filter((m): m is NonNullable<ReturnType<typeof moduxById>> => !!m);
        return (
          <li key={f.id} className={'tkr-f tkr-t-' + f.tone} data-finding={f.id}>
            <ToneMark tone={f.tone} />
            <div className="tkr-f-body">
              <strong className="tkr-f-title">{f.title}</strong>
              <p>{f.line}</p>
              <p className="tkr-f-from">Read from <code>{f.field}</code></p>
              {models.length > 0 && (
                <div className="tkr-f-models">
                  {models.map(m => <button key={m.id} type="button" className="chip" onClick={() => d({ t: 'route', view: 'modux-model', id: m.id })}><span className="mt-e gx-e" aria-hidden>{emojiOf(m.id)}</span>{m.name}</button>)}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function HolderCell({ r, which, label }: { r: Rule; which: 'does' | 'changes'; label: string }) {
  const h = r[which];
  return (
    <td data-label={label}>
      {r.read ? <span className="tkr-holder"><KeyMarks h={h} />{holderWords(h)}</span> : <span className="tkr-holder">Not in the record</span>}
    </td>
  );
}

function Powers({ t }: { t: TokenRead }) {
  return (
    <table className="tkr-powers">
      <thead>
        <tr><th scope="col">Power</th><th scope="col">Who holds it</th><th scope="col">Who can change who holds it</th></tr>
      </thead>
      <tbody>
        {RULE_KEYS.map(k => (
          <tr key={k}>
            <th scope="row">{POWER[k]}</th>
            <HolderCell r={t.rules[k]} which="does" label="Who holds it" />
            <HolderCell r={t.rules[k]} which="changes" label="Who can change that" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* one token: its stock, what a holder is trusting, and who holds each power */
function TokenReading({ t, named }: { t: TokenRead; /** the token's name stands over it: off when the page's own heading is its name */ named: boolean }) {
  const s = t.supply;
  const grown = grownWords(t);
  const H = named ? 'h4' : 'h3';
  return (
    <article className="tkr-token panel" data-token={t.id}>
      <div className="tkr-top">
        <div className="tkr-fig"><TokenVessel token={t} /></div>
        <div className="tkr-facts">
          {named && <><span className="label">As its issuer named it</span><h3 className="tkr-name">{t.name}</h3></>}
          {t.description && <p className="tkr-said"><span className="label">Its issuer’s description</span>{t.description}</p>}
          <dl className="tkr-supply">
            <div><dt>In existence today</dt><dd>{s.now != null ? amount(s.now, t.decimals) : 'Not read'}</dd></div>
            <div><dt>At creation</dt><dd>{s.base != null ? amount(s.base, t.decimals) : 'Not read'}</dd></div>
            <div><dt>At most</dt><dd>{s.max != null ? amount(s.max, t.decimals) : 'No maximum'}</dd></div>
          </dl>
          {grown && <p className="sec tkr-grown">{grown}</p>}
        </div>
      </div>
      <H className="tkr-h">What a holder is trusting</H>
      <Findings list={t.findings} />
      <H className="tkr-h">Who holds each power</H>
      <Powers t={t} />
    </article>
  );
}

function groupWords(g: GroupRead): string {
  const even = g.ids.every(x => x.power === g.ids[0].power);
  return g.members + (g.members === 1 ? ' member' : ' members') + '. An action needs power ' + g.required + ' of ' + g.total
    + (g.least === 0 ? ', which the members cannot reach.' : g.least === g.members ? ', which takes all of them.' : ', which takes at least ' + g.least + ' of them.')
    + (even ? '' : ' Their power is not equal: the largest holds ' + g.ids[0].power + '.');
}

/* a whole reading. An example shows the same page with no record to open, copy or share. */
function Reading({ c, example, headRef }: { c: ContractRead; example?: boolean; headRef?: React.Ref<HTMLHeadingElement> }) {
  const [copied, setCopied] = useState(false);
  const one = c.tokens.length === 1 ? c.tokens[0] : null;
  const title = one ? one.name : c.tokens.length ? c.tokens.length + ' tokens in one contract' : 'A data contract with no token';
  const tokens = c.tokens.slice(0, MOST_TOKENS);
  const text = () => readingText(c);
  async function copy() {
    try { await navigator.clipboard.writeText(text()); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* the reading can still be saved */ }
  }
  function save() {
    const url = URL.createObjectURL(new Blob([text()], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'token-reading-' + c.net + '-' + c.id.slice(0, 8) + '-' + c.read + '.md';
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className={'tkr-result' + (example ? ' tkr-example' : '')} aria-labelledby={example ? undefined : 'tkr-result-h'} aria-label={example ? 'An example reading' : undefined}>
      {!example && (
        <header className="tkr-result-head">
          <span className="label">{one ? 'The token, as its issuer named it' : 'The reading'} · {NET_NAME[c.net]} · read {c.read}</span>
          <h2 id="tkr-result-h" tabIndex={-1} ref={headRef}>{title}</h2>
          <p className="sec">
            Contract <span className="tkr-id" title={c.id}>{shortId(c.id)}</span>, version {c.version}{c.system ? ', a system contract of Dash Platform' : ''}.
            {c.owner ? <> Its owner is the identity <span className="tkr-id" title={c.owner}>{shortId(c.owner)}</span>{c.ownerNames.length ? ' (' + c.ownerNames.join(', ') + ')' : ''}.</> : null}
            {c.readonly === true ? ' The contract can never be updated.' : ''}
          </p>
        </header>
      )}

      {tokens.map(t => <TokenReading key={t.position} t={t} named={!one && !example} />)}
      {c.tokens.length > tokens.length && <p className="sec">{c.tokens.length - tokens.length} more tokens are in the record.</p>}
      {!c.tokens.length && <p className="tkr-none">This contract holds no token, so there is no supply to read. Its document types are below.</p>}

      {c.groups.length > 0 && (
        <section className="tkr-more" aria-label="Its groups">
          <h3 className="tkr-h">Its groups</h3>
          <ul className="tkr-list">
            {c.groups.map(g => <li key={g.position}><strong>Group {g.position}</strong> {groupWords(g)}</li>)}
          </ul>
        </section>
      )}

      {c.types.length > 0 && (
        <section className="tkr-more" aria-label="Its document types">
          <h3 className="tkr-h">Its document types</h3>
          <ul className="tkr-list">
            {c.types.map(d => { const w = typeWords(d); return <li key={d.name}><strong>{d.name}</strong> {w.charAt(0).toUpperCase() + w.slice(1)}</li>; })}
          </ul>
        </section>
      )}

      {!example && (
        <>
          <section className="tkr-more" aria-label="What this reading could not read">
            <h3 className="tkr-h">What this reading could not read</h3>
            <ul className="tkr-list">
              {c.unread.map(u => <li key={u}>{u}</li>)}
              <li>Who holds the keys of an identity is not in any public record.</li>
            </ul>
          </section>
          <div className="tkr-actions">
            <button className="btn btn-key" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy the reading'}</button>
            <button className="btn" type="button" onClick={save}>Save the reading</button>
            <ShareLink route={{ view: 'read', id: c.id, sub: c.net === 'testnet' ? 'testnet' : undefined }} title={'A reading of ' + title} label="Share this page" />
            <a className="btn btn-ghost" href={c.url} target="_blank" rel="noopener noreferrer">See the record on the explorer</a>
          </div>
        </>
      )}
    </section>
  );
}

export function ReadView() {
  const { s, d } = useS();
  const rid = s.route.id && cleanId(s.route.id) ? s.route.id : '';
  const rnet: Net = s.route.sub === 'testnet' ? 'testnet' : 'mainnet';
  const [value, setValue] = useState(rid);
  const [net, setNet] = useState<Net>(rnet);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [, setTick] = useState(0);
  const [ex, setEx] = useState(0);
  const head = useRef<HTMLHeadingElement | null>(null);
  const reading = rid ? KEPT.get(keyOf(rnet, rid)) || null : null;
  const example = useMemo(() => EXAMPLES[ex].read(), [ex]);

  /* the address names a contract: the field holds it, and the page waits to be asked */
  useEffect(() => { if (rid) { setValue(rid); setNet(rnet); } setErr(''); }, [rid, rnet]);
  /* a reading that has just arrived is where a screen reader should be */
  useEffect(() => { if (reading && ARRIVED === keyOf(reading.net, reading.id)) { ARRIVED = ''; head.current?.focus({ preventScroll: true }); } }, [reading]);

  async function read() {
    if (busy) return;
    if (!cleanId(value)) { setErr('That is not a Dash Platform identifier. A contract or token id is about 44 letters and digits.'); return; }
    setBusy(true); setErr('');
    try {
      const c = await readContract(value, net);
      keep(c);
      ARRIVED = keyOf(c.net, c.id);
      setTick(n => n + 1);
      d({ t: 'route', view: 'read', id: c.id, sub: c.net === 'testnet' ? 'testnet' : undefined });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'The record could not be read.');
    }
    setBusy(false);
  }

  const form = (
    <form className="tkr-form panel" onSubmit={e => { e.preventDefault(); read(); }} aria-label={reading ? 'Read another token' : 'Read a token'}>
      {reading && <h2 className="tkr-h">Read another</h2>}
      <div className="tkr-form-row">
        <label className="tkr-field">
          <span className="label">A token or contract id, or its explorer link</span>
          <input value={value} onChange={e => { setValue(e.target.value); if (err) setErr(''); }} placeholder="About 44 letters and digits" spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off" inputMode="text" />
        </label>
        <div className="tkr-net" role="radiogroup" aria-labelledby="tkr-net-l">
          <span className="label" id="tkr-net-l">Network</span>
          <div className="tkr-net-opts">
            {(['mainnet', 'testnet'] as Net[]).map(n => (
              <label key={n} className={'tkr-net-opt' + (net === n ? ' tkr-on' : '')}>
                <input type="radio" name="tkr-net" value={n} checked={net === n} onChange={() => setNet(n)} />
                <span>{NET_NAME[n]}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="btn btn-key" type="submit" disabled={busy || !value.trim()}>{busy ? 'Reading' : 'Read it from the public record'}</button>
      </div>
      {rid && !reading && !busy && !err && <p className="tkr-waits" role="status">This link names a contract on {NET_NAME[rnet]}. Press the button to read it.</p>}
      {busy && <p className="tkr-waits" role="status">Reading the contract, the transition that created it, and its rules.</p>}
      {err && <p className="tkr-err" role="alert">{err}</p>}
      <p className="sec tkr-says">The read goes from your browser to the community Platform Explorer, which will see which contract you asked about. StepSAFE keeps the reading for this visit only.</p>
    </form>
  );

  return (
    <div className="wrap tkr">
      <SectionHead sigil="keystone" kicker="Dash Defenders" title="Read a token"
        lede={reading ? undefined : 'Every token on Dash Platform carries public rules: who can mint more, who can freeze a balance or stop every transfer, and who can change those rules. Paste a token’s id and read them here.'} />
      {reading ? (
        <>
          <Reading c={reading} headRef={head} />
          {form}
        </>
      ) : (
        <>
          {form}
          <section className="tkr-examples" aria-labelledby="tkr-ex-h">
            <header className="tkr-result-head">
              <span className="label">Before you read one</span>
              <h2 id="tkr-ex-h">Two made-up tokens</h2>
              <p className="sec">Neither is on Dash Platform. They show what a reading says when one key holds a token, and when a group of three does.</p>
            </header>
            <div className="tkr-pick" role="group" aria-label="Which example">
              {EXAMPLES.map((e, i) => <button key={e.key} type="button" className={'btn btn-sm' + (i === ex ? ' tkr-on' : ' btn-ghost')} aria-pressed={i === ex} onClick={() => setEx(i)}>{e.pick}</button>)}
            </div>
            <Reading key={EXAMPLES[ex].key} c={example} example />
          </section>
        </>
      )}
      <p className="tkr-foot">The record is read from the Platform Explorer, a community service by pshenmic. This page reads who holds each power. What a token is worth is for you to judge.</p>
    </div>
  );
}
