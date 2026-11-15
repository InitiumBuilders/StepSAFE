/* THE KNOWN SYSTEMS on the Modux page. Real organisations, mapped from
   public sources with the same parts and pressures as Map your own system.
   Each one reads as its keystone question, its outlier move, its map, and the
   security moves it leans on most, with the catalog structures that match.
   Any of them runs as a stress day in one press. */

import React, { useMemo, useState } from 'react';
import { MODUX_MODELS, moduxById } from '../content/registry';
import { NODE_KIND_LABEL } from '../content/modux-schema';
import { knownGroups, knownById, specFromKnown, buildOwnGauge, systemOf } from '../content/modux/own';
import { SystemAtlas, LeverageLadder } from './SystemAtlas';
import { ManyDays } from './ManyDays';
import { guardsOf } from '../lib/systemRead';
import { useS } from '../lib/state';
import { useEngine } from '../lib/engine';
import { outlierVisible, knownChosen } from '../lib/outlier';
import type { KnownSystem } from '../content/outlier/schema';
import { SYNTHESIS } from '../content/outlier/synthesis';
import { HARDENING } from '../content/outlier/hardening';
import { VERBS, verbOf } from '../lib/hardening';
import { CommonsMap } from './CommonsMap';

const host = (url: string) => { try { return new URL(url).host.replace(/^www\./, ''); } catch { return url; } };

export function KnownSystems() {
  const { s, d } = useS();
  const groups = useMemo(() => knownGroups(), []);
  const all = useMemo(() => groups.flatMap(g => g.systems), [groups]);
  const [g, setG] = useState('all');
  const [q, setQ] = useState('');
  const sel = (s.route.id || '').startsWith('sys:') ? knownById((s.route.id || '').slice(4)) : undefined;
  const chosen = new Set(knownChosen(s));
  const shown = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return all.filter(k => (g === 'all' || k.group === g) &&
      (!ql || (k.name + ' ' + k.sector + ' ' + k.keystoneQuestion + ' ' + k.coreProblem + ' ' + k.outlierMove + ' ' + k.tags.join(' ')).toLowerCase().includes(ql)));
  }, [all, g, q]);

  if (!all.length) return <div className="mx-empty">The known systems are being researched.</div>;
  if (sel) return <KnownDetail k={sel} />;

  return (
    <>
      <p className="lede" style={{ margin: 'var(--s5) 0 var(--s4)' }}>
        {all.length} real systems, mapped from public sources with the same parts and pressures you use in Map your own system.
        Read the question each one answers, the move it makes better than almost anyone, and where its security has the most leverage.
        Then run its stress day.
      </p>
      {SYNTHESIS?.strongest && SYNTHESIS.strongest.length > 0 && (
        <details className="ks-panel ks-strongest">
          <summary>The strongest moves across all {all.length}</summary>
          <ol className="ks-lever">
            {SYNTHESIS.strongest.map((x, i) => (
              <li key={i}>
                <strong>{x.move}</strong>
                <span>{x.why}</span>
                <span className="ks-who">{x.systems.join(', ')}</span>
                {x.models.length > 0 && (
                  <span className="ks-models">
                    {x.models.map(id => <button key={id} className="mx-chip" onClick={() => d({ t: 'route', view: 'modux-model', id })}>{moduxById(id)?.name || id}</button>)}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </details>
      )}
      <span className="label">What they rest on</span>
      <CommonsMap />
      {HARDENING.moves.length > 0 && (
        <details className="ks-panel ks-strongest ks-harden" open>
          <summary>The moves that harden the most systems</summary>
          <p className="sec" style={{ margin: '8px 0 10px' }}>
            For each of the {HARDENING.systems} systems the model plans a week of hardening, one move a day, each chosen after the ones before it.
            These are the moves the weeks pick, most often first. Every number comes from running the model.
          </p>
          <ol className="ks-lever">
            {HARDENING.moves.filter(m => m.first.length > 0 || m.systems.length >= 4).slice(0, 8).map(m => (
              <li key={m.id} className={'v-' + m.verb}>
                <strong><i className="ks-verb-dot" aria-hidden />{m.name}</strong>
                <span>
                  {VERBS.find(v => v.id === m.verb)?.label}. {m.first.length > 0 ? 'The first move in ' + m.first.length + (m.first.length === 1 ? ' system' : ' systems') + ', ' : ''}in the plan for {m.systems.length} of {HARDENING.systems}, adding {m.gain} hours of the stress day on average.
                </span>
                <span className="ks-who">{m.systems.map(id => knownById(id)?.name || id).join(', ')}</span>
                <span className="ks-models">
                  <button className="mx-chip" onClick={() => d({ t: 'route', view: 'modux-model', id: m.id })}>Open {m.name}</button>
                </span>
              </li>
            ))}
          </ol>
        </details>
      )}
      <div className="mx-filters">
        <div className="mx-chips">
          <button className={'mx-chip' + (g === 'all' ? ' on' : '')} onClick={() => setG('all')}>All systems</button>
          {groups.map(x => (
            <button key={x.group} className={'mx-chip' + (g === x.group ? ' on' : '')} onClick={() => setG(g === x.group ? 'all' : x.group)}>{x.group}</button>
          ))}
          <span className="spacer" />
          <input className="mx-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search systems" aria-label="Search the known systems" maxLength={80} />
        </div>
      </div>
      <div className="mx-grid">
        {shown.map(k => (
          <button key={k.id} className="mx-card ks-card" style={{ ['--hue' as string]: k.own ? '#f0d48c' : '#a78bff' }}
            onClick={() => d({ t: 'route', view: 'modux', sub: 'systems', id: 'sys:' + k.id })}>
            <span className="mx-card-top">
              <span className="mx-fam">{k.group}</span>
              <span className="mx-tier">{chosen.has(k.id) ? 'Mapped' : k.map.parts.length + ' parts'}</span>
            </span>
            <h3>{k.name}</h3>
            <p>{k.keystoneQuestion}</p>
            <span className="mx-card-foot">{k.sector}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 && <div className="mx-empty">No system matches that filter.</div>}
    </>
  );
}

function KnownDetail({ k }: { k: KnownSystem }) {
  const { s, d } = useS();
  const eng = useEngine();
  const byId = useMemo(() => new Map(MODUX_MODELS.map(m => [m.id, m])), []);
  const spec = useMemo(() => specFromKnown(k.id), [k.id]);
  const gauge = useMemo(() => (spec ? buildOwnGauge(spec, byId) : null), [spec, byId]);
  const system = useMemo(() => (spec ? systemOf(spec) : { nodes: [], edges: [] }), [spec]);
  const guards = useMemo(() => k.securityLeverage.map(s => ({ move: s.move, parts: gauge ? guardsOf(s.models, gauge.threats) : [] })), [k, gauge]);
  const [err, setErr] = useState('');
  const open = outlierVisible(s);

  function run() {
    setErr('');
    if (!spec || !gauge) { setErr('This map did not build into a gauge.'); return; }
    d({ t: 'forge-add', gauge });
    d({ t: 'own-spec', id: gauge.id, spec });
    eng.knownStarted(k.id);
    d({ t: 'route', view: 'modux-gauge', id: gauge.id });
  }
  function edit() {
    eng.knownStarted(k.id);
    d({ t: 'route', view: 'modux', sub: 'gauges', id: 'known:' + k.id });
  }

  return (
    <article className="ks-detail">
      <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'modux', sub: 'systems' })}>← All systems</button>
      <header className="ks-head mx-glass mx-lit">
        <span className="mx-kicker">{k.group}</span>
        <h2 style={{ margin: '6px 0 4px' }}>{k.name}</h2>
        <p className="sec" style={{ margin: 0 }}>{k.sector}. {k.serves}</p>
        {k.tagline && (
          <blockquote className="ks-tagline">
            <p>{k.tagline.text}</p>
            <a href={k.tagline.source} target="_blank" rel="noopener noreferrer">{host(k.tagline.source)}</a>
          </blockquote>
        )}
        <div className="ks-key">
          <span className="label">The keystone question</span>
          <p>{k.keystoneQuestion}</p>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-key" onClick={run} disabled={!gauge}>Run its stress day</button>
          <button className="btn" onClick={edit}>Edit the map first</button>
          {open && <button className="btn btn-ghost" onClick={() => d({ t: 'route', view: 'step', id: 'ol-' + k.id })}>Read it in Chapter 2.6.7</button>}
          {(k.id === 'dash' || k.id === 'dashsupport-team') && <button className="btn btn-ghost" onClick={() => d({ t: 'route', view: 'check', id: 'treasury' })}>Run the treasury check</button>}
        </div>
        {err && <p className="sec" style={{ color: 'var(--ink-alarm)', margin: 0 }}>{err}</p>}
      </header>

      <section className="ks-panel ks-atlas">
        <span className="label">Its system, in motion · {system.nodes.length} parts, {system.edges.length} links</span>
        <SystemAtlas system={system} threats={gauge?.threats || []} gauge={gauge} byId={byId} guards={guards} org={k.name} reading autoplay stack={gauge?.expert} plan={{ name: k.name, url: k.url, own: k.securityLeverage.map(x => ({ move: x.move, why: x.why })), sources: k.sources }} label={k.name + ' system map'} />
      </section>

      {gauge && <section className="ks-panel ks-days"><ManyDays gauge={gauge} stack={[]} compare={{ stack: gauge.expert, label: 'the reference stack' }} byId={byId} nameOf={id => gauge.system.nodes.find(n => n.id === id)?.name || id} /></section>}

      {k.leveragePoints.length > 0 && <div className="ks-panel"><LeverageLadder points={k.leveragePoints} /></div>}

      <div className="ks-cols">
        <section className="ks-panel">
          <span className="label">The problem it makes headway on</span>
          <p>{k.coreProblem}</p>
          <span className="label">Its outlier move</span>
          <p>{k.outlierMove}</p>
          <span className="label">The lesson</span>
          <p className="ks-lesson">{k.lesson}</p>
        </section>
        <section className="ks-panel">
          <span className="label">Its parts</span>
          <ul className="ks-parts">
            {k.map.parts.map(p => <li key={p.id}><strong>{p.name}</strong><span>{NODE_KIND_LABEL[p.kind]}</span></li>)}
          </ul>
        </section>
      </div>

      <section className="ks-panel">
        <span className="label">Where its security has the most leverage</span>
        <ol className="ks-lever">
          {k.securityLeverage.map((x, i) => (
            <li key={i}>
              <strong>{x.move}</strong>
              <span>{x.why}</span>
              {x.models.length > 0 && (
                <span className="ks-models">
                  {x.models.map(id => (
                    <button key={id} className="mx-chip" onClick={() => d({ t: 'route', view: 'modux-model', id })}>{moduxById(id)?.name || id}</button>
                  ))}
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {gauge && gauge.expert.length > 0 && (
        <section className="ks-panel">
          <span className="label">The structures that hold its stress day</span>
          <p className="sec" style={{ margin: '4px 0 10px' }}>The reference stack for this map. With all of it in place the model keeps the whole stress day.</p>
          <ul className="ks-threats ks-holds">
            {gauge.expert.map(id => {
              const m = byId.get(id); if (!m) return null;
              const verb = verbOf('layer', m.family, id);
              const parts = guardsOf([id], gauge.threats).map(p => system.nodes.find(n => n.id === p)?.name || p);
              return (
                <li key={id} className={'v-' + verb}>
                  <strong><i className="ks-verb-dot" aria-hidden />{m.name}</strong>
                  <span>{VERBS.find(v => v.id === verb)?.label}{parts.length ? '. Holds ' + parts.join(', ') + '.' : '. Cuts a link a failure would travel.'}</span>
                  <button className="mx-chip" onClick={() => d({ t: 'route', view: 'modux-model', id })}>Open</button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <details className="ks-panel ks-sources">
        <summary>{k.sources.length} sources</summary>
        <ul>
          {k.sources.map((x, i) => <li key={i}><a href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a> <span>{host(x.url)}</span></li>)}
        </ul>
        {k.uncertain.length > 0 && (
          <>
            <span className="label">What the sources could not settle</span>
            <ul>{k.uncertain.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </>
        )}
      </details>
    </article>
  );
}

/* a known system's map and ladder, for its lesson in Chapter 2.6.7 */
export function KnownSystemAtlas({ id }: { id: string }) {
  const k = knownById(id);
  const byId = useMemo(() => new Map(MODUX_MODELS.map(m => [m.id, m])), []);
  const spec = useMemo(() => specFromKnown(id), [id]);
  const gauge = useMemo(() => (spec ? buildOwnGauge(spec, byId) : null), [spec, byId]);
  const system = useMemo(() => (spec ? systemOf(spec) : { nodes: [], edges: [] }), [spec]);
  const guards = useMemo(() => (k ? k.securityLeverage.map(s => ({ move: s.move, parts: gauge ? guardsOf(s.models, gauge.threats) : [] })) : []), [k, gauge]);
  if (!k || !gauge) return null;
  return (
    <div className="ks-step-atlas">
      <section className="ks-panel ks-atlas">
        <span className="label">Its system, in motion · {system.nodes.length} parts, {system.edges.length} links</span>
        <SystemAtlas system={system} threats={gauge.threats} gauge={gauge} byId={byId} guards={guards} org={k.name} reading autoplay stack={gauge.expert} plan={{ name: k.name, url: k.url, own: k.securityLeverage.map(x => ({ move: x.move, why: x.why })), sources: k.sources }} label={k.name + ' system map'} />
      </section>
      {k.leveragePoints.length > 0 && <div className="ks-panel"><LeverageLadder points={k.leveragePoints} /></div>}
    </div>
  );
}
